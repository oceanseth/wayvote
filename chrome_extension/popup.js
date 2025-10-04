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
      const result = await chrome.storage.sync.get(['wayvoteMetrics', 'wayvoteEnabled']);
      
      if (result.wayvoteMetrics) {
        this.metrics = { ...this.defaultMetrics, ...result.wayvoteMetrics };
      }
      
      if (result.wayvoteEnabled !== undefined) {
        this.isEnabled = result.wayvoteEnabled;
      }
    } catch (error) {
      console.error('WayVote: Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        wayvoteMetrics: this.metrics,
        wayvoteEnabled: this.isEnabled
      });
    } catch (error) {
      console.error('WayVote: Error saving settings:', error);
    }
  }

  initializeUI() {
    // Set initial toggle state
    const enabledToggle = document.getElementById('enabledToggle');
    enabledToggle.checked = this.isEnabled;
  }

  setupEventListeners() {
    // Enable/disable toggle
    const enabledToggle = document.getElementById('enabledToggle');
    enabledToggle.addEventListener('change', (e) => {
      this.isEnabled = e.target.checked;
      this.saveSettings();
      this.sendMessageToContentScript('toggleEnabled', { enabled: this.isEnabled });
    });

    // Apply button
    const applyBtn = document.getElementById('applyBtn');
    applyBtn.addEventListener('click', () => {
      this.applySettings();
    });

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
      this.resetToDefaults();
    });

    // Add metric button
    const addMetricBtn = document.getElementById('addMetricBtn');
    addMetricBtn.addEventListener('click', () => {
      this.showAddMetricDialog();
    });
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
    });

    input.addEventListener('input', (e) => {
      let newValue = parseInt(e.target.value) || 0;
      newValue = Math.max(0, Math.min(1000, newValue)); // Clamp between 0-1000
      
      e.target.value = newValue;
      slider.value = newValue;
      valueDisplay.textContent = newValue;
      this.metrics[name] = newValue;
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
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WayVotePopup();
});
