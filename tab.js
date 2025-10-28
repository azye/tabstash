document.addEventListener('DOMContentLoaded', function () {
  const saveBtn = document.getElementById('saveAllTabs')
  const tabList = document.getElementById('tabList')

  saveBtn.addEventListener('click', saveAndCloseAllTabs)
  loadSavedTabs()

  function saveAndCloseAllTabs () {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const otherTabs = tabs.filter(tab => !tab.active)

      if (otherTabs.length === 0) {
        showMessage('No other tabs to save!')
        return
      }

      // Create a session group with timestamp
      const sessionId = Date.now()
      const tabDataArray = otherTabs.map(tab => ({
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
          // Close tabs in reverse order so Ctrl+Shift+T restores them correctly
          const tabIdsToClose = otherTabs.map(tab => tab.id).reverse()
          chrome.tabs.remove(tabIdsToClose, function () {
            loadSavedTabs()
            showMessage(`Saved ${otherTabs.length} tabs successfully!`)
          })
        })
      })
    })
  }

  function loadSavedTabs () {
    chrome.storage.local.get(['savedTabs'], function (result) {
      const savedTabs = result.savedTabs || []
      tabList.innerHTML = ''

      if (savedTabs.length === 0) {
        tabList.innerHTML = '<div class="empty-state">No saved tabs yet. Click the button above to save your tabs!</div>'
        return
      }

      // Group tabs by session
      const sessions = {}
      savedTabs.forEach(tab => {
        const sessionId = tab.sessionId || 'individual'
        if (!sessions[sessionId]) {
          sessions[sessionId] = []
        }
        sessions[sessionId].push(tab)
      })

      Object.keys(sessions).forEach(sessionId => {
        const sessionTabs = sessions[sessionId]
        const isGroup = sessionTabs.length > 1 || sessionTabs[0].sessionId

        if (isGroup) {
          const sessionElement = document.createElement('div')
          sessionElement.className = 'session-group'

          const sessionHeader = document.createElement('div')
          sessionHeader.className = 'session-header'
          sessionHeader.innerHTML = `
            <span>Session (${sessionTabs.length} tabs) - ${new Date(sessionTabs[0].timestamp).toLocaleString()}</span>
            <button class="restore-all-btn">Restore All</button>
          `

          const restoreAllBtn = sessionHeader.querySelector('.restore-all-btn')
          restoreAllBtn.onclick = () => restoreSession(sessionTabs)

          sessionElement.appendChild(sessionHeader)

          const tabContent = document.createElement('div')
          tabContent.className = 'tab-content'

          sessionTabs.forEach(tab => {
            const tabElement = createTabElement(tab)
            tabContent.appendChild(tabElement)
          })

          sessionElement.appendChild(tabContent)
          tabList.appendChild(sessionElement)
        } else {
          // Individual tabs (old format)
          const tab = sessionTabs[0]
          const tabElement = createTabElement(tab)
          tabList.appendChild(tabElement)
        }
      })
    })
  }

  function createTabElement (tab) {
    const tabElement = document.createElement('div')
    tabElement.className = 'tab-item'
    tabElement.innerHTML = `
      <div class="tab-title">${escapeHtml(tab.title)}</div>
      <div class="tab-url">${escapeHtml(tab.url)}</div>
    `

    tabElement.addEventListener('click', function () {
      chrome.tabs.create({ url: tab.url })
    })

    return tabElement
  }

  function restoreSession (sessionTabs) {
    sessionTabs.forEach(tab => {
      chrome.tabs.create({ url: tab.url })
    })
    showMessage(`Restored ${sessionTabs.length} tabs!`)
  }

  function showMessage (message) {
    // Create a temporary message element
    const messageDiv = document.createElement('div')
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4285f4;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: bold;
    `
    messageDiv.textContent = message
    document.body.appendChild(messageDiv)

    // Remove after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv)
      }
    }, 3000)
  }

  function escapeHtml (text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
})
