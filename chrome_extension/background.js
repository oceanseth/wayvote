// WayVote Chrome Extension - Background Service Worker

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('WayVote: Extension installed/updated');
  
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      wayvoteMetrics: {
        "IQ": 0,
        "Reading Comprehension": 0,
        "Critical Thinking": 0,
        "Has Children": 0
      },
      wayvoteEnabled: true
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://wayvote.org'
    });
  }
});

// Handle tab updates to inject content script on Reddit pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('reddit.com')) {
      // Check if content script is already injected to avoid duplicates
      chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not present, inject it
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }).catch(error => {
            console.log('WayVote: Content script injection failed:', error);
          });
        } else {
          console.log('WayVote: Content script already present');
        }
      });
    }
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('WayVote: Background received message:', request);
  
  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get(['wayvoteMetrics', 'wayvoteEnabled'], (result) => {
        sendResponse({
          metrics: result.wayvoteMetrics || {},
          enabled: result.wayvoteEnabled !== false
        });
      });
      return true; // Keep message channel open for async response
      
    case 'saveSettings':
      chrome.storage.sync.set({
        wayvoteMetrics: request.metrics,
        wayvoteEnabled: request.enabled
      }, () => {
        sendResponse({ success: true });
      });
      return true;
      
    case 'logError':
      console.error('WayVote Error:', request.error);
      sendResponse({ success: true });
      break;
      
    default:
      console.log('WayVote: Unknown action:', request.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes('reddit.com')) {
    // Send message to content script to toggle modal
    chrome.tabs.sendMessage(tab.id, { action: 'toggleModal' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('WayVote: Content script not ready, injecting...');
        // If content script isn't ready, inject it first
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).then(() => {
          // Wait a bit for script to initialize, then send message
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleModal' });
          }, 100);
        });
      } else {
        console.log('WayVote: Modal toggled successfully');
      }
    });
  } else {
    // Open WayVote website if not on Reddit
    chrome.tabs.create({
      url: 'https://wayvote.org'
    });
  }
});

// Periodic cleanup and maintenance
setInterval(() => {
  // Clean up old data if needed
  chrome.storage.local.get(null, (items) => {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    Object.keys(items).forEach(key => {
      if (key.startsWith('wayvote_') && items[key].timestamp) {
        if (now - items[key].timestamp > maxAge) {
          chrome.storage.local.remove(key);
        }
      }
    });
  });
}, 24 * 60 * 60 * 1000); // Run daily
