chrome.runtime.onInstalled.addListener(function() {
  console.log('TabStash extension installed');
});

chrome.action.onClicked.addListener(function(tab) {
  chrome.action.openPopup();
});