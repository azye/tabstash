# TabStash Chrome Extension - LLM Agent Documentation

This document provides detailed guidance for LLM agents working on the TabStash Chrome extension codebase.

## Project Overview

TabStash is a Manifest V3 Chrome extension that allows users to save and organize browser tabs. The extension provides a simple interface to stash multiple tabs at once and restore them later.

## Architecture

### Core Components

- **manifest.json**: Extension configuration (Manifest V3)
- **popup.html/popup.js**: Main user interface and logic
- **background.js**: Service worker for extension lifecycle
- **icons/**: Extension icons in various sizes

### Key Features

1. **Tab Stashing**: Save all tabs (except extension tabs) with session grouping
2. **Session Management**: Tabs are grouped by save session with timestamps
3. **Tab Restoration**: Click saved tabs to reopen them
4. **Bulk Operations**: Restore entire sessions at once
5. **Icon Action**: Click extension icon to save tabs and open manager tab
6. **Chrome Page Handling**: Treats chrome:// pages like regular tabs (saved and closed)

## File Structure and Responsibilities

### manifest.json
- Defines extension permissions: `tabs`, `storage`
- Configures action handler and service worker
- Specifies icon sizes: 16px, 48px, 128px

### tab.html/tab.js (Main Interface)
- **loadSavedTabs()**: Displays saved tabs grouped by session
- **restoreSession()**: Opens all tabs from a saved session
- Individual tab restoration on click

### popup.js (Legacy Popup)
- **saveAndCloseAllTabs()**: Saves non-active tabs and closes them
- **loadSavedTabs()**: Displays saved tabs grouped by session
- **restoreSession()**: Opens all tabs from a saved session

### background.js
- Service worker for extension lifecycle
- **saveAndCloseAllTabs()**: Saves all non-extension tabs (including chrome:// pages) and closes them
- **openTabManager()**: Opens or activates extension tab, reloads existing tab
- Handles extension installation and action clicks

## Data Storage

### Storage Schema
```javascript
{
  savedTabs: [
    {
      title: string,
      url: string,
      favicon: string,
      timestamp: number,
      sessionId: number
    }
  ]
}
```

### Session Grouping
- Tabs saved together share the same `sessionId` (timestamp)
- Individual tabs (legacy format) may not have `sessionId`
- Sessions display with count and timestamp

## Development Guidelines

### Code Style
- Use vanilla JavaScript (no frameworks)
- Follow existing naming conventions (camelCase)
- Maintain consistent indentation and formatting
- Use Chrome extension APIs exclusively
- **Linting**: ESLint with comprehensive rules for best practices
- **Lint Scripts**: 
  - `npm run lint`: Check code style
  - `npm run lint:fix`: Auto-fix linting issues

### Chrome Extension APIs Used
- `chrome.tabs.query()`: Get tab information
- `chrome.tabs.create()`: Open new tabs
- `chrome.tabs.update()`: Modify existing tabs
- `chrome.tabs.remove()`: Close tabs
- `chrome.storage.local.get/set()`: Persist data
- `chrome.action.onClicked`: Handle extension icon clicks
- `chrome.runtime.getURL()`: Get extension URLs

### Common Patterns

#### Tab Query Pattern
```javascript
chrome.tabs.query({currentWindow: true}, function(tabs) {
  const extensionUrl = chrome.runtime.getURL('');
  const tabsToSave = tabs.filter(tab => !tab.url.includes(extensionUrl));
  // Only extension tabs are excluded, chrome:// pages are treated normally
});
```

#### Storage Pattern
```javascript
chrome.storage.local.get(['savedTabs'], function(result) {
  const savedTabs = result.savedTabs || [];
  // Modify savedTabs
  chrome.storage.local.set({savedTabs: savedTabs}, callback);
});
```

## Testing and Debugging

### Automated Testing
- **Framework**: Jest with jsdom environment
- **Test Scripts**: 
  - `npm test`: Run all tests
  - `npm run test:watch`: Run tests in watch mode
- **Test Coverage**: Tests cover background script logic, tab interface functionality, and Chrome API interactions
- **Test Files**:
  - `tests/background.test.js`: Background service worker tests
  - `tests/tab.test.js`: Tab interface tests
  - `tests/setup.js`: Chrome API mocks and test setup

### Extension Testing
1. Load unpacked extension in Chrome Developer Mode
2. Use Chrome DevTools for popup debugging
3. Check background console for service worker logs
4. Verify storage in `chrome://extensions/` → Storage inspector
5. Run automated tests: `npm test`

### Common Issues
- **Permission errors**: Ensure `tabs` and `storage` permissions in manifest
- **Extension tab management**: Only extension tabs are filtered out from save/close operations
- **Chrome page handling**: chrome:// pages are treated like regular tabs (saved and closed)
- **Tab order**: Tabs are closed in reverse order for proper Ctrl+Shift+T restoration
- **Multiple extension tabs**: Only one extension tab is kept active, others are closed
- **Tab reload logic**: Extension tab is only reloaded if it already exists
- **Test failures**: Ensure Chrome API mocks are properly set up before running tests

## Extension Limitations

- No cloud sync (local storage only)
- No tab organization beyond session grouping
- No search functionality for saved tabs
- No export/import capabilities

## Potential Enhancements

When considering new features, maintain:
- Simple, intuitive UI
- Fast performance with many tabs
- Backward compatibility with existing saved tabs
- Manifest V3 compliance

## Security Considerations

- No external network requests
- All data stored locally
- No sensitive data in logs
- Proper URL handling when creating tabs

## Browser Compatibility

- Designed for Chrome/Chromium browsers
- Manifest V3 required
- Modern JavaScript features (ES6+) acceptable