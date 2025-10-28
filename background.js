chrome.runtime.onInstalled.addListener(function () {
  console.log('TabStash extension installed')
})

chrome.action.onClicked.addListener(function (tab) {
  saveAndCloseAllTabs(function () {
    openTabManager()
  })
})

function saveAndCloseAllTabs (callback) {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabsToSave = tabs.filter(tab => !tab.url.includes(chrome.runtime.getURL('')))

    if (tabsToSave.length === 0) {
      if (callback) callback()
      return
    }

    // Create a session group with timestamp
    const sessionId = Date.now()
    const tabDataArray = tabsToSave.map(tab => ({
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl,
      timestamp: sessionId,
      sessionId
    }))

    chrome.storage.local.get(['savedTabs'], function (result) {
      const savedTabs = result.savedTabs || []
      savedTabs.unshift(...tabDataArray)

      chrome.storage.local.set({ savedTabs }, function () {
        // Close all tabs (except extension tabs) in reverse order so Ctrl+Shift+T restores them correctly
        const tabIdsToClose = tabsToSave.map(tab => tab.id).reverse()
        chrome.tabs.remove(tabIdsToClose, function () {
          // Execute callback after tabs are closed and saved
          if (callback) callback()
        })
      })
    })
  })
}

function openTabManager () {
  chrome.tabs.query({ url: chrome.runtime.getURL('tab.html') }, function (tabs) {
    if (tabs.length > 1) {
      // Multiple tabs exist, close all but the first one
      const tabsToClose = tabs.slice(1).map(tab => tab.id)
      chrome.tabs.remove(tabsToClose, function () {
        // Refresh the remaining tab
        chrome.tabs.reload(tabs[0].id)
      })
    } else if (tabs.length === 1) {
      // One tab exists, refresh it
      chrome.tabs.reload(tabs[0].id)
    } else {
      // No tabs exist, create new one
      chrome.tabs.create({
        url: chrome.runtime.getURL('tab.html'),
        active: false,
        pinned: true
      })
    }
  })
}
