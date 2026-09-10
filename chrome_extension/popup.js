// WayVote Chrome Extension - Popup Script

class WayVotePopup {
  constructor() {
    this.defaultMetrics = {
      "IQ": 0,
      "Reading Comprehension": 0,
      "Critical Thinking": 0,
      "Has Children": 0
    };
    
    this.metrics = { ...this.defaultMetrics };
    this.isEnabled = true;
    this.removePromoted = true;
    
    this.init();
  }

  async init() {
    // Load saved settings
    await this.loadSettings();
    
    // Initialize UI
    this.initializeUI();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Render metrics
    this.renderMetrics();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['wayvoteMetrics', 'wayvoteEnabled', 'wayvoteRemovePromoted']);
      
      if (result.wayvoteMetrics) {
        this.metrics = { ...this.defaultMetrics, ...result.wayvoteMetrics };
      }
      
      if (result.wayvoteEnabled !== undefined) {
        this.isEnabled = result.wayvoteEnabled;
      }
      
      if (result.wayvoteRemovePromoted !== undefined) {
        this.removePromoted = result.wayvoteRemovePromoted;
      }
    } catch (error) {
      console.error('WayVote: Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        wayvoteMetrics: this.metrics,
        wayvoteEnabled: this.isEnabled,
        wayvoteRemovePromoted: this.removePromoted
      });
    } catch (error) {
      console.error('WayVote: Error saving settings:', error);
    }
  }

  initializeUI() {
    // Set initial toggle states
    const enabledToggle = document.getElementById('enabledToggle');
    if (enabledToggle) {
      enabledToggle.checked = this.isEnabled;
    }
    
    const removePromotedToggle = document.getElementById('removePromotedToggle');
    if (removePromotedToggle) {
      removePromotedToggle.checked = this.removePromoted;
    }
  }

  setupEventListeners() {
    // Enable/disable toggle
    const enabledToggle = document.getElementById('enabledToggle');
    if (enabledToggle) {
      enabledToggle.addEventListener('change', (e) => {
        this.isEnabled = e.target.checked;
        this.saveSettings();
        this.sendMessageToContentScript('toggleEnabled', { enabled: this.isEnabled });
        this.settingsChanged = true; // Mark that settings have changed
      });
    }

    // Remove promoted content toggle
    const removePromotedToggle = document.getElementById('removePromotedToggle');
    if (removePromotedToggle) {
      removePromotedToggle.addEventListener('change', (e) => {
        this.removePromoted = e.target.checked;
        this.saveSettings();
        this.sendMessageToContentScript('toggleRemovePromoted', { removePromoted: this.removePromoted });
        this.settingsChanged = true; // Mark that settings have changed
      });
    }

    // Apply button
    const applyBtn = document.getElementById('applyBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applySettings();
      });
    }

    // Add beforeunload event to detect popup closing
    window.addEventListener('beforeunload', () => {
      this.checkForChanges();
    });

    // Also add visibility change event as backup
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.checkForChanges();
      }
    });

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefaults();
      });
    }

    // Add metric button
    const addMetricBtn = document.getElementById('addMetricBtn');
    if (addMetricBtn) {
      addMetricBtn.addEventListener('click', () => {
        this.showAddMetricDialog();
      });
    }
  }

  renderMetrics() {
    const container = document.getElementById('metricsContainer');
    container.innerHTML = '';

    Object.entries(this.metrics).forEach(([name, value]) => {
      const metricElement = this.createMetricElement(name, value);
      container.appendChild(metricElement);
    });
  }

  createMetricElement(name, value) {
    const div = document.createElement('div');
    div.className = 'metric-item';
    div.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">${name}</span>
        <span class="metric-value" id="value-${name}">${value}</span>
      </div>
      <div class="metric-controls">
        <div class="slider-container">
          <input 
            type="range" 
            class="metric-slider" 
            id="slider-${name}"
            min="0" 
            max="1000" 
            value="${value}"
            data-metric="${name}"
          >
        </div>
        <input 
          type="number" 
          class="metric-input" 
          id="input-${name}"
          min="0" 
          max="1000" 
          value="${value}"
          data-metric="${name}"
        >
      </div>
    `;

    // Add event listeners for this metric
    const slider = div.querySelector('.metric-slider');
    const input = div.querySelector('.metric-input');
    const valueDisplay = div.querySelector('.metric-value');

    slider.addEventListener('input', (e) => {
      const newValue = parseInt(e.target.value);
      input.value = newValue;
      valueDisplay.textContent = newValue;
      this.metrics[name] = newValue;
      this.settingsChanged = true; // Mark that settings have changed
    });

    input.addEventListener('input', (e) => {
      let newValue = parseInt(e.target.value) || 0;
      newValue = Math.max(0, Math.min(1000, newValue)); // Clamp between 0-1000
      
      e.target.value = newValue;
      slider.value = newValue;
      valueDisplay.textContent = newValue;
      this.metrics[name] = newValue;
      this.settingsChanged = true; // Mark that settings have changed
    });

    return div;
  }

  async applySettings() {
    const applyBtn = document.getElementById('applyBtn');
    const originalText = applyBtn.textContent;
    
    // Show loading state
    applyBtn.textContent = 'Applying...';
    applyBtn.disabled = true;
    applyBtn.classList.add('loading');

    try {
      // Save settings
      await this.saveSettings();
      
      // Send to content script
      await this.sendMessageToContentScript('updateMetrics', { metrics: this.metrics });
      
      // Reset the settings changed flag since we just applied
      this.settingsChanged = false;
      
      // Show success feedback
      applyBtn.textContent = 'Applied!';
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.disabled = false;
        applyBtn.classList.remove('loading');
      }, 1500);
      
    } catch (error) {
      console.error('WayVote: Error applying settings:', error);
      applyBtn.textContent = 'Error';
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.disabled = false;
        applyBtn.classList.remove('loading');
      }, 2000);
    }
  }

  async resetToDefaults() {
    if (confirm('Reset all metrics to default values (0)?')) {
      this.metrics = { ...this.defaultMetrics };
      this.renderMetrics();
      await this.saveSettings();
      await this.sendMessageToContentScript('updateMetrics', { metrics: this.metrics });
    }
  }

  showAddMetricDialog() {
    // For now, just show "coming soon" alert
    alert('Create New Metric - Coming Soon!\n\nThis feature will allow you to create custom metrics beyond the default ones.');
  }

  async sendMessageToContentScript(action, data) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url && tab.url.includes('reddit.com')) {
        await chrome.tabs.sendMessage(tab.id, {
          action: action,
          ...data
        });
      }
    } catch (error) {
      console.error('WayVote: Error sending message to content script:', error);
    }
  }

  // Track if settings have changed since last apply
  settingsChanged = false;

  // Check if current metrics differ from saved metrics
  checkForChanges() {
    // This will be called when the popup is about to close
    if (this.settingsChanged) {
      console.log('WayVote: Settings changed, triggering API re-request');
      this.sendMessageToContentScript('popupClosed', { 
        metrics: this.metrics,
        removePromoted: this.removePromoted
      });
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WayVotePopup();
});
