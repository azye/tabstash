chrome.runtime.onInstalled.addListener(() => {
  console.log('TabStash extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  saveAndCloseAllTabs(() => {
    openTabManager();
  });
});


function saveAndCloseAllTabs(callback) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const extensionUrl = chrome.runtime.getURL('');
    const tabsToSave = tabs.filter(tab => !tab.url.includes(extensionUrl));

    if (tabsToSave.length === 0) {
      if (callback) callback();
      return;
    }

    // Create a session group with timestamp
    const sessionId = Date.now();
    const tabDataArray = tabsToSave.map(tab => ({
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl,
      timestamp: sessionId,
      sessionId
    }));

    chrome.storage.local.get(['savedTabs'], (result) => {
      const savedTabs = result.savedTabs || [];
      savedTabs.unshift(...tabDataArray);
      if (callback) callback();
      chrome.storage.local.set({ savedTabs }, () => {
        // Close all non-extension tabs in reverse order so Ctrl+Shift+T restores them correctly
        
        
        const tabIdsToClose = tabsToSave.map(tab => tab.id).reverse();
        chrome.tabs.remove(tabIdsToClose);
      });
    });
  });
}

function openTabManager() {
  chrome.tabs.query({ url: chrome.runtime.getURL('tab.html') }, (tabs) => {
    if (tabs.length > 0) {
      // Extension tab exists, make it active
      chrome.tabs.update(tabs[0].id, { active: true });
      // Close any additional extension tabs
      if (tabs.length > 1) {
        const tabsToClose = tabs.slice(1).map(tab => tab.id);
        chrome.tabs.remove(tabsToClose);
      }
      // Reload the existing extension tab
      chrome.tabs.reload(tabs[0].id);
    } else {
      // No extension tab exists, create new one
      chrome.tabs.create({
        url: chrome.runtime.getURL('tab.html'),
        active: true,
        pinned: true,
      });
    }
  });
}
