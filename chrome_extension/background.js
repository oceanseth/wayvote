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
      // Ensure content script is injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(error => {
        // Content script might already be injected, ignore error
        console.log('WayVote: Content script injection skipped (already present)');
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
    // Open popup (handled by manifest action)
    console.log('WayVote: Icon clicked on Reddit page');
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
