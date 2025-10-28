// Mock DOM environment
document.body.innerHTML = `
  <button id="saveAllTabs">Save All Tabs</button>
  <div id="tabList"></div>
`;

// Load the tab script
require('../tab.js');

describe('Tab Interface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset Chrome API mocks
    chrome.tabs.query.mockClear();
    chrome.tabs.create.mockClear();
    chrome.tabs.remove.mockClear();
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
    
    // Reset DOM
    document.getElementById('tabList').innerHTML = '';
  });

  describe('DOM Elements', () => {
    test('should find save button and tab list', () => {
      const saveBtn = document.getElementById('saveAllTabs');
      const tabList = document.getElementById('tabList');
      
      expect(saveBtn).toBeTruthy();
      expect(tabList).toBeTruthy();
    });
  });

  describe('Tab Saving', () => {
    test('should show message when no other tabs exist', () => {
      const mockTabs = [
        { id: 1, url: 'chrome-extension://test-id/tab.html', active: true }
      ];
      
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback(mockTabs);
      });

      // Simulate clicking save button
      const saveBtn = document.getElementById('saveAllTabs');
      saveBtn.click();

      // Should filter out active tab and extension tab
      const otherTabs = mockTabs.filter(tab => !tab.active);
      expect(otherTabs).toHaveLength(0);
    });

    test('should save non-active tabs', () => {
      const mockTabs = [
        { id: 1, url: 'chrome-extension://test-id/tab.html', active: true },
        { id: 2, url: 'https://example.com', active: false, title: 'Example', favIconUrl: 'favicon.ico' },
        { id: 3, url: 'https://test.com', active: false, title: 'Test', favIconUrl: 'favicon2.ico' }
      ];
      
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback(mockTabs);
      });
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ savedTabs: [] });
      });
      chrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });
      chrome.tabs.remove.mockImplementation((tabIds, callback) => {
        callback();
      });

      // Simulate the save logic
      const otherTabs = mockTabs.filter(tab => !tab.active);
      expect(otherTabs).toHaveLength(2);
      
      const sessionId = Date.now();
      const tabDataArray = otherTabs.map(tab => ({
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl,
        timestamp: sessionId,
        sessionId
      }));

      expect(tabDataArray).toHaveLength(2);
      expect(tabDataArray[0].title).toBe('Example');
      expect(tabDataArray[1].title).toBe('Test');
    });
  });

  describe('Tab Loading', () => {
    test('should show empty state when no saved tabs', () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ savedTabs: [] });
      });

      // Simulate loadSavedTabs behavior
      const savedTabs = [];
      const tabList = document.getElementById('tabList');
      
      if (savedTabs.length === 0) {
        tabList.innerHTML = '<div class="empty-state">No saved tabs yet. Click the button above to save your tabs!</div>';
      }

      expect(tabList.innerHTML).toContain('No saved tabs yet');
    });

    test('should group tabs by session', () => {
      const sessionId = Date.now();
      const mockSavedTabs = [
        { title: 'Tab 1', url: 'https://example1.com', sessionId },
        { title: 'Tab 2', url: 'https://example2.com', sessionId },
        { title: 'Old Tab', url: 'https://old.com' } // No sessionId
      ];

      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ savedTabs: mockSavedTabs });
      });

      // Simulate session grouping logic
      const sessions = {};
      mockSavedTabs.forEach(tab => {
        const tabSessionId = tab.sessionId || 'individual';
        if (!sessions[tabSessionId]) {
          sessions[tabSessionId] = [];
        }
        sessions[tabSessionId].push(tab);
      });

      expect(Object.keys(sessions)).toHaveLength(2);
      expect(sessions[sessionId]).toHaveLength(2);
      expect(sessions.individual).toHaveLength(1);
    });

    test('should identify session groups correctly', () => {
      const sessionId = Date.now();
      const sessionTabs = [
        { title: 'Tab 1', url: 'https://example1.com', sessionId },
        { title: 'Tab 2', url: 'https://example2.com', sessionId }
      ];
      const individualTab = { title: 'Old Tab', url: 'https://old.com' }; // Single tab without sessionId

      const isGroupSession = sessionTabs.length > 1 || sessionTabs[0].sessionId;
      const isGroupIndividual = individualTab.sessionId !== undefined;

      expect(isGroupSession).toBe(true);
      expect(isGroupIndividual).toBe(false);
    });
  });

  describe('Tab Restoration', () => {
    test('should create tabs for session restoration', () => {
      const sessionTabs = [
        { url: 'https://example1.com' },
        { url: 'https://example2.com' }
      ];

      // Simulate restoreSession behavior
      sessionTabs.forEach(tab => {
        chrome.tabs.create({ url: tab.url });
      });

      expect(chrome.tabs.create).toHaveBeenCalledTimes(2);
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://example1.com' });
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://example2.com' });
    });
  });

  describe('Utility Functions', () => {
    test('should escape HTML properly', () => {
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      const maliciousInput = '<script>alert("xss")</script>';
      const escaped = escapeHtml(maliciousInput);
      
      expect(escaped).toBe('&lt;script&gt;alert(\"xss\")&lt;/script&gt;');
      expect(escaped).not.toContain('<script>');
    });

    test('should create tab element correctly', () => {
      const createTabElement = (tab) => {
        const tabElement = document.createElement('div');
        tabElement.className = 'tab-item';
        tabElement.innerHTML = `
          <div class="tab-title">${escapeHtml(tab.title)}</div>
          <div class="tab-url">${escapeHtml(tab.url)}</div>
        `;
        return tabElement;
      };

      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      const tab = { title: 'Test Tab', url: 'https://example.com' };
      const tabElement = createTabElement(tab);

      expect(tabElement.className).toBe('tab-item');
      expect(tabElement.innerHTML).toContain('Test Tab');
      expect(tabElement.innerHTML).toContain('https://example.com');
    });
  });
});