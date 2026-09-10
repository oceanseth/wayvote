// WayVote Chrome Extension - Content Script
// Detects Reddit posts and integrates with WayVote API

class WayVoteReddit {
  constructor() {
    this.postIds = new Set();
    this.lastRequestedIds = new Set(); // Track what we last requested
    this.rankings = new Map();
    this.rankingCache = new Map(); // Cache for API responses
    this.metrics = {
      "IQ": 0,
      "Reading Comprehension": 0,
      "Critical Thinking": 0,
      "Has Children": 0
    };
    this.isEnabled = true;
    this.removePromoted = true; // Remove promoted content by default
    this.observer = null;
    this.modal = null;
    this.modalVisible = false;
    this.isRequesting = false; // Prevent concurrent requests
    
    this.init();
  }

  init() {
    console.log('WayVote: Initializing Reddit integration');
    
    // Load saved metrics from storage
    this.loadMetrics();
    
    // Start observing DOM changes
    this.startObserver();
    
    // Process existing posts
    this.processExistingPosts();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        sendResponse({success: true});
      } else if (request.action === 'toggleModal') {
        if (window.wayvoteInstance) {
          window.wayvoteInstance.toggleModal();
        }
        sendResponse({success: true});
      } else if (request.action === 'updateMetrics') {
        if (window.wayvoteInstance) {
          window.wayvoteInstance.metrics = request.metrics;
          window.wayvoteInstance.saveMetrics();
          window.wayvoteInstance.reRankPosts();
        }
        sendResponse({success: true});
      } else if (request.action === 'toggleEnabled') {
        if (window.wayvoteInstance) {
          window.wayvoteInstance.isEnabled = request.enabled;
          if (window.wayvoteInstance.isEnabled) {
            window.wayvoteInstance.reRankPosts();
          } else {
            window.wayvoteInstance.restoreOriginalOrder();
          }
        }
        sendResponse({success: true});
      } else if (request.action === 'toggleRemovePromoted') {
        if (window.wayvoteInstance) {
          window.wayvoteInstance.removePromoted = request.removePromoted;
          window.wayvoteInstance.saveSettings();
          if (window.wayvoteInstance.removePromoted) {
            window.wayvoteInstance.removePromotedContent();
        } else {
            window.wayvoteInstance.restorePromotedContent();
          }
        }
        sendResponse({success: true});
      } else if (request.action === 'popupClosed') {
        if (window.wayvoteInstance) {
          console.log('WayVote: Popup closed, processing changes');
          
          // Update metrics if provided
          if (request.metrics) {
            window.wayvoteInstance.metrics = request.metrics;
            window.wayvoteInstance.saveMetrics();
          }
          
          // Update remove promoted setting if provided
          if (request.removePromoted !== undefined) {
            window.wayvoteInstance.removePromoted = request.removePromoted;
            window.wayvoteInstance.saveSettings();
          }
          
          // Remove promoted content if enabled
          if (window.wayvoteInstance.removePromoted) {
            window.wayvoteInstance.removePromotedContent();
          }
          
          // Re-request API with new weights
          window.wayvoteInstance.reRankPosts();
        }
        sendResponse({success: true});
      }
    });
  }

  startObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewPosts(node);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processExistingPosts() {
    const posts = document.querySelectorAll('shreddit-post');
    posts.forEach(post => this.extractPostId(post));
    
    // Remove promoted content
    this.removePromotedContent();
    
    if (this.postIds.size > 0) {
      this.fetchRankings();
    }
  }

  processNewPosts(container) {
    const posts = container.querySelectorAll ? 
      container.querySelectorAll('shreddit-post') : 
      (container.tagName === 'SHREDDIT-POST' ? [container] : []);
    
    posts.forEach(post => this.extractPostId(post));
    
    // Remove promoted content from new posts
    this.removePromotedContent();
    
    if (this.postIds.size > 0) {
      this.fetchRankings();
    }
  }

  extractPostId(post) {
    const userId = post.getAttribute('user-id');
    const viewContext = post.getAttribute('view-context');
    const id = post.getAttribute('id');
    
    if (userId && viewContext && id) {
      const postId = `${userId}-${viewContext}-${id}`;
      this.postIds.add(postId);
      console.log('WayVote: Extracted post ID:', postId);
    }
  }

  // Check if the set of post IDs has changed since last request
  hasPostIdsChanged() {
    if (this.lastRequestedIds.size !== this.postIds.size) {
      return true;
    }
    
    // Check if all IDs in current set are in the last requested set
    for (const id of this.postIds) {
      if (!this.lastRequestedIds.has(id)) {
        return true;
      }
    }
    
    return false;
  }

  // Update the last requested IDs set
  updateLastRequestedIds() {
    this.lastRequestedIds.clear();
    this.postIds.forEach(id => this.lastRequestedIds.add(id));
  }

  // Remove promoted content from the page
  removePromotedContent() {
    if (!this.removePromoted) return;
    
    // Look for promoted posts using the specific selector
    const promotedLabels = document.querySelectorAll('span.promoted-label');
    let removedCount = 0;
    
    promotedLabels.forEach(label => {
      // Find the parent article containing this promoted label
      const article = label.closest('article');
      if (article && !article.hasAttribute('data-wayvote-removed')) {
        article.setAttribute('data-wayvote-removed', 'promoted');
        article.style.display = 'none'; // Hide instead of remove to avoid breaking layout
        removedCount++;
        console.log('WayVote: Removed promoted content');
      }
    });
    
    if (removedCount > 0) {
      console.log(`WayVote: Removed ${removedCount} promoted posts`);
    }
  }

  // Restore promoted content (when toggle is turned off)
  restorePromotedContent() {
    const removedArticles = document.querySelectorAll('article[data-wayvote-removed="promoted"]');
    removedArticles.forEach(article => {
      article.style.display = '';
      article.removeAttribute('data-wayvote-removed');
    });
    
    if (removedArticles.length > 0) {
      console.log(`WayVote: Restored ${removedArticles.length} promoted posts`);
    }
  }

  async fetchRankings() {
    if (!this.isEnabled || this.postIds.size === 0) return;
    
    // Check if post IDs have changed since last request
    if (!this.hasPostIdsChanged()) {
      console.log('WayVote: Post IDs unchanged, skipping API request');
      return;
    }
    
    // Prevent concurrent requests
    if (this.isRequesting) {
      console.log('WayVote: Request already in progress, skipping');
      return;
    }
    
    const ids = Array.from(this.postIds);
    const customRanking = Object.entries(this.metrics)
      .filter(([name, weight]) => weight > 0)
      .map(([name, weight]) => ({ weighName: name, weighValue: weight }));

    if (customRanking.length === 0) {
      console.log('WayVote: No metrics configured, skipping ranking');
      return;
    }

    this.isRequesting = true;

    try {
      console.log('WayVote: Fetching rankings for', ids.length, 'posts (IDs changed)');
      
      const response = await fetch('https://api.wayvote.org/getRankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: ids,
          customRanking: customRanking
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rankings = await response.json();
      console.log('WayVote: Received rankings:', rankings);
      
      // Update the last requested IDs set
      this.updateLastRequestedIds();
      
      this.rankings.clear();
      rankings.forEach(ranking => {
        this.rankings.set(ranking.contentId, ranking.rank);
      });
      
      this.reorderPosts();
      
    } catch (error) {
      console.error('WayVote: Error fetching rankings:', error);
    } finally {
      this.isRequesting = false;
    }
  }

  reorderPosts() {
    if (!this.isEnabled) return;
    
    const articles = document.querySelectorAll('article');
    const articlesWithRankings = [];
    
    articles.forEach(article => {
      const post = article.querySelector('shreddit-post');
      if (post) {
        const userId = post.getAttribute('user-id');
        const viewContext = post.getAttribute('view-context');
        const id = post.getAttribute('id');
        
        if (userId && viewContext && id) {
          const postId = `${userId}-${viewContext}-${id}`;
          const rank = this.rankings.get(postId);
          
          if (rank !== undefined) {
            articlesWithRankings.push({
              element: article,
              rank: rank,
              postId: postId
            });
          }
        }
      }
    });
    
    // Sort by rank (lower number = higher rank)
    articlesWithRankings.sort((a, b) => a.rank - b.rank);
    
    // Reorder DOM elements
    const parent = articlesWithRankings[0]?.element.parentNode;
    if (parent) {
      articlesWithRankings.forEach(({element}) => {
        parent.appendChild(element);
      });
    }
    
    console.log('WayVote: Reordered', articlesWithRankings.length, 'posts');
  }

  restoreOriginalOrder() {
    // This would require storing original order, which is complex
    // For now, we'll just refresh the page
    console.log('WayVote: Restoring original order (refresh required)');
  }

  reRankPosts() {
    this.postIds.clear();
    this.lastRequestedIds.clear(); // Clear tracking when metrics change
    this.rankings.clear();
    console.log('WayVote: Cleared post tracking due to metric changes');
    this.processExistingPosts();
  }

  async loadMetrics() {
    try {
      const result = await chrome.storage.sync.get(['wayvoteMetrics', 'wayvoteRemovePromoted']);
      if (result.wayvoteMetrics) {
        this.metrics = { ...this.metrics, ...result.wayvoteMetrics };
      }
      if (result.wayvoteRemovePromoted !== undefined) {
        this.removePromoted = result.wayvoteRemovePromoted;
      }
    } catch (error) {
      console.error('WayVote: Error loading metrics:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({ 
        wayvoteMetrics: this.metrics,
        wayvoteRemovePromoted: this.removePromoted 
      });
    } catch (error) {
      console.error('WayVote: Error saving settings:', error);
    }
  }

  async saveMetrics() {
    try {
      await chrome.storage.sync.set({ wayvoteMetrics: this.metrics });
    } catch (error) {
      console.error('WayVote: Error saving metrics:', error);
    }
  }

  // Replace Reddit's voting system with WayVote
  replaceVoteElements() {
    const voteSpans = document.querySelectorAll('span[post-click-location="vote"]');
    
    voteSpans.forEach(span => {
      const article = span.closest('article');
      if (article && !article.hasAttribute('data-wayvote-processed')) {
        article.setAttribute('data-wayvote-processed', 'true');
        
        // Find the vote count element
        const voteCount = article.querySelector('faceplate-number[pretty]');
        if (voteCount) {
          // Replace with WayVote voting system
          this.createWayVoteVoting(article, voteCount);
        }
      }
    });
  }

  createWayVoteVoting(article, originalVoteCount) {
    const post = article.querySelector('shreddit-post');
    if (!post) return;
    
    const userId = post.getAttribute('user-id');
    const viewContext = post.getAttribute('view-context');
    const id = post.getAttribute('id');
    
    if (!userId || !viewContext || !id) return;
    
    const postId = `${userId}-${viewContext}-${id}`;
    
    // Create WayVote voting container
    const wayVoteContainer = document.createElement('div');
    wayVoteContainer.className = 'wayvote-voting';
    wayVoteContainer.innerHTML = `
      <div class="wayvote-vote-buttons">
        <button class="wayvote-upvote" data-post-id="${postId}">▲</button>
        <span class="wayvote-count">0</span>
        <button class="wayvote-downvote" data-post-id="${postId}">▼</button>
      </div>
    `;
    
    // Replace original vote count
    originalVoteCount.parentNode.replaceChild(wayVoteContainer, originalVoteCount);
    
    // Add event listeners
    const upvoteBtn = wayVoteContainer.querySelector('.wayvote-upvote');
    const downvoteBtn = wayVoteContainer.querySelector('.wayvote-downvote');
    
    upvoteBtn.addEventListener('click', () => this.handleVote(postId, 'up'));
    downvoteBtn.addEventListener('click', () => this.handleVote(postId, 'down'));
  }

  async handleVote(postId, direction) {
    try {
      const response = await fetch(`https://api.wayvote.org/${direction === 'up' ? 'upVote' : 'downVote'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: postId
        })
      });

      if (response.ok) {
        console.log(`WayVote: ${direction}vote successful for`, postId);
        // Update UI to show vote was cast
        this.updateVoteUI(postId, direction);
      }
    } catch (error) {
      console.error(`WayVote: Error ${direction}voting:`, error);
    }
  }

  updateVoteUI(postId, direction) {
    const button = document.querySelector(`[data-post-id="${postId}"].wayvote-${direction}vote`);
    if (button) {
      button.style.backgroundColor = direction === 'up' ? '#ff4500' : '#7193ff';
      button.style.color = 'white';
    }
  }

  // Modal functionality
  async toggleModal() {
    console.log('WayVote: toggleModal called, modal exists:', !!this.modal, 'modalVisible:', this.modalVisible);
    
    if (!this.modal) {
      console.log('WayVote: Creating new modal...');
      await this.createModal();
    }
    
    if (this.modalVisible) {
      console.log('WayVote: Hiding modal');
      this.hideModal();
    } else {
      console.log('WayVote: Showing modal');
      this.showModal();
    }
  }

  async createModal() {
    console.log('WayVote: Creating modal...');
    
    // Check if CSS is already injected
    const existingCSS = document.querySelector('link[href*="modal.css"]');
    if (!existingCSS) {
      // Inject CSS first
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = chrome.runtime.getURL('modal.css');
      document.head.appendChild(cssLink);
      console.log('WayVote: CSS injected');
    } else {
      console.log('WayVote: CSS already exists');
    }

    // Create modal HTML directly (avoiding fetch issues)
    const modalHTML = `
      <div id="wayvote-modal-overlay" class="wayvote-modal-overlay">
        <div id="wayvote-modal" class="wayvote-modal">
          <div class="wayvote-modal-header">
            <div class="header-controls">
              <div class="toggle-container">
                <label class="toggle-switch">
                  <input type="checkbox" id="enabledToggle" checked>
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">Enabled</span>
              </div>
              <div class="toggle-container">
                <label class="toggle-switch">
                  <input type="checkbox" id="removePromotedToggle" checked>
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">Remove Promoted</span>
              </div>
            </div>
            <div class="logo">
              <h1>🎯 WayVote</h1>
              <p>Custom Reddit Rankings</p>
            </div>
            <button id="wayvote-close-btn" class="wayvote-close-btn" aria-label="Close">×</button>
          </div>

          <div class="wayvote-modal-body">
            <section class="metrics-section">
              <h2>Ranking Metrics</h2>
              <p class="section-description">
                Configure weights to apply to users' votes (0-1000)
                Example 1: If IQ is weighted at 10, a user with 1 std dev higher IQ than avg will have 10 votes instead of 1.
                Example 2: If Has Children is weighted at 5, a user who self-reports as having children will have 5 votes instead of 1.
                If set to 0, the metric will have no influence on rankings.
              </p>
              
              <div class="metrics-container" id="metricsContainer">
                <!-- Metrics will be dynamically generated here -->
              </div>
              
              <button id="addMetricBtn" class="add-metric-btn">
                ➕ Create New Metric
              </button>
            </section>

            <section class="actions-section">
              <button id="applyBtn" class="apply-btn">
                Apply Rankings
              </button>
              <button id="resetBtn" class="reset-btn">
                Reset to Defaults
              </button>
            </section>

            <section class="info-section">
              <h3>How it works</h3>
              <ul>
                <li>WayVote analyzes Reddit posts and ranks them based on your custom metrics</li>
                <li>Higher weights mean that metric has more influence on rankings</li>
                <li>Posts are reordered automatically as you browse</li>
                <li>Your votes are sent to the WayVote API for community ranking</li>
              </ul>
            </section>
          </div>

          <div class="wayvote-modal-footer">
            <p>Visit <a href="https://wayvote.org" target="_blank">wayvote.org</a> for more info</p>
          </div>
        </div>
      </div>
    `;
    
    try {
      // Create modal element directly
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHTML;
      this.modal = modalContainer.firstElementChild;
      
      console.log('WayVote: Modal HTML created:', this.modal);
      console.log('WayVote: Modal classes:', this.modal.className);
      
      // Add to page
      document.body.appendChild(this.modal);
      console.log('WayVote: Modal added to page');
      console.log('WayVote: Modal in DOM:', document.querySelector('#wayvote-modal-overlay'));
      
      // Set up event listeners
      this.setupModalEventListeners();
      
      // Load and populate metrics
      await this.loadMetricsIntoModal();
      
      console.log('WayVote: Modal created successfully');
    } catch (error) {
      console.error('WayVote: Error creating modal:', error);
    }
  }

  setupModalEventListeners() {
    // Close button
    const closeBtn = this.modal.querySelector('#wayvote-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideModal());
    }

    // Overlay click to close
    const overlay = this.modal.querySelector('.wayvote-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.hideModal();
        }
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalVisible) {
        this.hideModal();
      }
    });

    // Enable/disable toggle
    const enabledToggle = this.modal.querySelector('#enabledToggle');
    if (enabledToggle) {
      enabledToggle.addEventListener('change', (e) => {
        this.isEnabled = e.target.checked;
        this.saveSettings();
        if (this.isEnabled) {
          this.reRankPosts();
        } else {
          this.restoreOriginalOrder();
        }
      });
    }

    // Remove promoted toggle
    const removePromotedToggle = this.modal.querySelector('#removePromotedToggle');
    if (removePromotedToggle) {
      removePromotedToggle.addEventListener('change', (e) => {
        this.removePromoted = e.target.checked;
        this.saveSettings();
        if (this.removePromoted) {
          this.removePromotedContent();
        } else {
          this.restorePromotedContent();
        }
      });
    }

    // Apply button
    const applyBtn = this.modal.querySelector('#applyBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.saveSettings();
        this.reRankPosts();
        console.log('WayVote: Settings applied');
      });
    }

    // Reset button
    const resetBtn = this.modal.querySelector('#resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefaults();
      });
    }

    // Add metric button
    const addMetricBtn = this.modal.querySelector('#addMetricBtn');
    if (addMetricBtn) {
      addMetricBtn.addEventListener('click', () => {
        this.showAddMetricDialog();
      });
    }
  }

  resetToDefaults() {
    this.metrics = {
      "IQ": 0,
      "Reading Comprehension": 0,
      "Critical Thinking": 0,
      "Has Children": 0
    };
    this.saveSettings();
    this.populateMetrics();
    this.reRankPosts();
    console.log('WayVote: Reset to defaults');
  }

  showAddMetricDialog() {
    const name = prompt('Enter metric name:');
    if (name && name.trim()) {
      this.metrics[name.trim()] = 0;
      this.saveSettings();
      this.populateMetrics();
      console.log('WayVote: Added new metric:', name.trim());
    }
  }

  showModal() {
    if (this.modal) {
      console.log('WayVote: Showing modal, element:', this.modal);
      console.log('WayVote: Modal position:', this.modal.getBoundingClientRect());
      this.modalVisible = true;
      this.modal.classList.add('wayvote-modal-visible');
      document.body.classList.add('wayvote-modal-open');
      
      // Load current metrics into modal
      this.loadMetricsIntoModal();
    } else {
      console.error('WayVote: Modal element not found!');
    }
  }

  hideModal() {
    if (this.modal) {
      this.modalVisible = false;
      this.modal.classList.remove('wayvote-modal-visible');
      document.body.classList.remove('wayvote-modal-open');
      
      // Check if settings have changed and trigger API re-request
      console.log('WayVote: Modal closed, checking for changes');
      
      // Remove promoted content if enabled
      if (this.removePromoted) {
        this.removePromotedContent();
      }
      
      // Re-request API with current weights
      this.reRankPosts();
    }
  }

  async loadMetricsIntoModal() {
    // Load saved metrics and populate the modal
    try {
      const result = await chrome.storage.sync.get(['wayvoteMetrics', 'wayvoteRemovePromoted']);
      if (result.wayvoteMetrics) {
        this.metrics = { ...this.metrics, ...result.wayvoteMetrics };
      }
      if (result.wayvoteRemovePromoted !== undefined) {
        this.removePromoted = result.wayvoteRemovePromoted;
      }
      
      // Update enabled toggle
      const enabledToggle = this.modal.querySelector('#enabledToggle');
      if (enabledToggle) {
        enabledToggle.checked = this.isEnabled;
      }
      
      // Update remove promoted toggle
      const removePromotedToggle = this.modal.querySelector('#removePromotedToggle');
      if (removePromotedToggle) {
        removePromotedToggle.checked = this.removePromoted;
      }
      
      // Populate metrics container with sliders
      this.populateMetrics();
      
      console.log('WayVote: Metrics loaded into modal');
    } catch (error) {
      console.error('WayVote: Error loading metrics into modal:', error);
    }
  }

  populateMetrics() {
    const container = this.modal.querySelector('#metricsContainer');
    if (!container) {
      console.error('WayVote: Metrics container not found');
      return;
    }
    
    container.innerHTML = '';
    
    Object.entries(this.metrics).forEach(([name, weight]) => {
      const metricItem = document.createElement('div');
      metricItem.className = 'metric-item';
      metricItem.innerHTML = `
        <div class="metric-header">
          <span class="metric-name">${name}</span>
          <span class="metric-value" data-metric="${name}">${weight}</span>
          <input type="number" class="metric-input" data-metric="${name}" value="${weight}" min="0" max="1000" style="display: none;">
        </div>
        <div class="metric-controls">
          <input type="range" class="metric-slider" data-metric="${name}" min="0" max="1000" value="${weight}">
          <span class="metric-range">0 - 1000</span>
        </div>
      `;
      
      container.appendChild(metricItem);
    });
    
    // Set up event listeners for sliders and inputs
    this.setupMetricEventListeners();
  }

  setupMetricEventListeners() {
    // Slider event listeners
    const sliders = this.modal.querySelectorAll('.metric-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const name = e.target.dataset.metric;
        const value = parseInt(e.target.value);
        if (this.metrics) {
          this.metrics[name] = value;
        }
        
        // Update the displayed value
        const valueSpan = this.modal.querySelector(`.metric-value[data-metric="${name}"]`);
        if (valueSpan) {
          valueSpan.textContent = value;
        }
        
        // Clear cache when metrics change
        if (this.rankingCache) {
          this.rankingCache.clear();
        }
        console.log('WayVote: Cleared cache due to metric change:', name, '=', value);
      });
    });
    
    // Value click to edit
    const valueSpans = this.modal.querySelectorAll('.metric-value');
    valueSpans.forEach(span => {
      span.addEventListener('click', () => {
        const name = span.dataset.metric;
        const input = this.modal.querySelector(`.metric-input[data-metric="${name}"]`);
        if (input) {
          span.style.display = 'none';
          input.style.display = 'inline-block';
          input.focus();
          input.select();
        }
      });
    });
    
    // Input blur to save
    const inputs = this.modal.querySelectorAll('.metric-input');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        const name = e.target.dataset.metric;
        const value = parseInt(e.target.value) || 0;
        if (this.metrics) {
          this.metrics[name] = Math.max(0, Math.min(1000, value));
        }
        
        // Update slider and value display
        const slider = this.modal.querySelector(`.metric-slider[data-metric="${name}"]`);
        const valueSpan = this.modal.querySelector(`.metric-value[data-metric="${name}"]`);
        
        if (slider && this.metrics) slider.value = this.metrics[name];
        if (valueSpan && this.metrics) valueSpan.textContent = this.metrics[name];
        
        input.style.display = 'none';
        valueSpan.style.display = 'inline-block';
        
        // Clear cache when metrics change
        if (this.rankingCache) {
          this.rankingCache.clear();
        }
        console.log('WayVote: Cleared cache due to metric change:', name, '=', value);
      });
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    });
  }
}

// Initialize WayVote when the page loads (prevent duplicates)
if (!window.wayvoteInstance) {
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
      window.wayvoteInstance = new WayVoteReddit();
  });
} else {
    window.wayvoteInstance = new WayVoteReddit();
  }
} else {
  console.log('WayVote: Instance already exists, skipping initialization');
}
