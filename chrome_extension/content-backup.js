// WayVote Chrome Extension - Content Script
// Detects Reddit posts and integrates with WayVote API

class WayVoteReddit {
  constructor() {
    this.postIds = new Set();
    this.rankings = new Map();
    this.metrics = {
      "IQ": 0,
      "Reading Comprehension": 0,
      "Critical Thinking": 0,
      "Has Children": 0
    };
    this.isEnabled = true;
    this.observer = null;
    
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
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateMetrics') {
        this.metrics = request.metrics;
        this.saveMetrics();
        this.reRankPosts();
        sendResponse({success: true});
      } else if (request.action === 'toggleEnabled') {
        this.isEnabled = request.enabled;
        if (this.isEnabled) {
          this.reRankPosts();
        } else {
          this.restoreOriginalOrder();
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
    
    if (this.postIds.size > 0) {
      this.fetchRankings();
    }
  }

  processNewPosts(container) {
    const posts = container.querySelectorAll ? 
      container.querySelectorAll('shreddit-post') : 
      (container.tagName === 'SHREDDIT-POST' ? [container] : []);
    
    posts.forEach(post => this.extractPostId(post));
    
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

  async fetchRankings() {
    if (!this.isEnabled || this.postIds.size === 0) return;
    
    const ids = Array.from(this.postIds);
    const customRanking = Object.entries(this.metrics)
      .filter(([name, weight]) => weight > 0)
      .map(([name, weight]) => ({ weighName: name, weighValue: weight }));

    if (customRanking.length === 0) {
      console.log('WayVote: No metrics configured, skipping ranking');
      return;
    }

    try {
      console.log('WayVote: Fetching rankings for', ids.length, 'posts');
      
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
      
      this.rankings.clear();
      rankings.forEach(ranking => {
        this.rankings.set(ranking.contentId, ranking.rank);
      });
      
      this.reorderPosts();
      
    } catch (error) {
      console.error('WayVote: Error fetching rankings:', error);
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
    this.rankings.clear();
    this.processExistingPosts();
  }

  async loadMetrics() {
    try {
      const result = await chrome.storage.sync.get(['wayvoteMetrics']);
      if (result.wayvoteMetrics) {
        this.metrics = { ...this.metrics, ...result.wayvoteMetrics };
      }
    } catch (error) {
      console.error('WayVote: Error loading metrics:', error);
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
}

// Initialize WayVote when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WayVoteReddit();
  });
} else {
  new WayVoteReddit();
}
