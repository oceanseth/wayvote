// Simple update to add navigation button functionality

// Add these properties to the constructor:
// this.navButton = null;
// this.settingsModal = null;

// Add this call in the init() method after loadMetrics():
// this.createNavButton();

// Add these methods to the class:

createNavButton() {
  const checkNav = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      const navDivs = nav.querySelectorAll('div');
      if (navDivs.length >= 3) {
        const thirdDiv = navDivs[2];
        if (thirdDiv.querySelector('#wayvote-nav-button')) return;
        
        this.navButton = document.createElement('div');
        this.navButton.id = 'wayvote-nav-button';
        this.navButton.innerHTML = '<div class="wayvote-nav-btn"><div class="wayvote-icon">ðŸŽ¯</div><div class="wayvote-status ' + (this.isEnabled ? 'enabled' : 'disabled') + '"></div></div>';
        
        this.navButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.openSettingsModal();
        });
        
        thirdDiv.appendChild(this.navButton);
        console.log('WayVote: Navigation button created');
      } else {
        setTimeout(checkNav, 1000);
      }
    } else {
      setTimeout(checkNav, 1000);
    }
  };
  checkNav();
}

openSettingsModal() {
  if (this.settingsModal) this.settingsModal.remove();
  
  this.settingsModal = document.createElement('div');
  this.settingsModal.id = 'wayvote-settings-modal';
  this.settingsModal.innerHTML = '<div class="wayvote-modal-overlay"><div class="wayvote-modal"><div class="wayvote-modal-header"><h2>ðŸŽ¯ WayVote Settings</h2><button class="wayvote-modal-close">&times;</button></div><div class="wayvote-modal-content"><div class="wayvote-toggle"><label><input type="checkbox" ' + (this.isEnabled ? 'checked' : '') + ' id="wayvote-enabled"> Enable WayVote Rankings</label></div><div class="wayvote-metrics"><h3>Metric Weights (0-1000)</h3></div><div class="wayvote-modal-actions"><button id="wayvote-apply" class="wayvote-apply-btn">Apply Settings</button><button id="wayvote-close" class="wayvote-close-btn">Close</button></div></div></div></div>';
  
  // Add event listeners
  this.settingsModal.querySelector('.wayvote-modal-close').addEventListener('click', () => this.closeSettingsModal());
  this.settingsModal.querySelector('#wayvote-close').addEventListener('click', () => this.closeSettingsModal());
  this.settingsModal.querySelector('#wayvote-apply').addEventListener('click', () => this.applySettings());
  
  document.body.appendChild(this.settingsModal);
}

closeSettingsModal() {
  if (this.settingsModal) {
    this.settingsModal.remove();
    this.settingsModal = null;
  }
}

applySettings() {
  const enabledCheckbox = this.settingsModal.querySelector('#wayvote-enabled');
  this.isEnabled = enabledCheckbox.checked;
  this.saveMetrics();
  this.updateNavButton();
  if (this.isEnabled) this.reRankPosts();
  this.closeSettingsModal();
}

updateNavButton() {
  if (this.navButton) {
    const statusElement = this.navButton.querySelector('.wayvote-status');
    if (statusElement) {
      statusElement.className = 'wayvote-status ' + (this.isEnabled ? 'enabled' : 'disabled');
    }
  }
}
