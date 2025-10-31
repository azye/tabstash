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
5. **Clear All Tabs**: Remove all saved tabs at once with confirmation
6. **Tab Counter**: Display total count of saved tabs in the interface
7. **Icon Action**: Click extension icon to save tabs and open manager tab
8. **Chrome Page Handling**: Treats chrome:// pages like regular tabs (saved and closed)
9. **Fire Icon**: Visual representation using flame/fire icon for tab stashing concept

## File Structure and Responsibilities

### manifest.json
- Defines extension permissions: `tabs`, `storage`
- Configures action handler and service worker
- Specifies icon sizes: 16px, 48px, 128px

### tab.html/tab.js (Main Interface)
- **loadSavedTabs()**: Displays saved tabs grouped by session, updates tab counter
- **restoreSession()**: Opens all tabs from a saved session
- **clearAllTabs()**: Removes all saved tabs from storage
- Individual tab restoration on click
- **Tab Counter Display**: Shows total count of saved tabs in header

### popup.js (Legacy Popup)
- **saveAndCloseAllTabs()**: Saves non-active tabs and closes them
- **loadSavedTabs()**: Displays saved tabs grouped by session
- **restoreSession()**: Opens all tabs from a saved session

### icons/
- **icon.svg**: Main SVG icon (fire/flame design)
- **icon16.png**: 16x16 pixel PNG version for toolbar
- **icon48.png**: 48x48 pixel PNG version for extension management
- **icon128.png**: 128x128 pixel PNG version for Chrome Web Store

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

## Development Setup

### Initial Setup
```bash
npm install
```

### Available Scripts
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode

### Dependencies
- **Dev Dependencies**: Jest, ESLint with standard config, jsdom environment
- **No Runtime Dependencies**: Uses only Chrome extension APIs

## Development Guidelines

### Code Style
- Use vanilla JavaScript (no frameworks)
- Follow existing naming conventions (camelCase)
- Maintain consistent indentation and formatting
- Use Chrome extension APIs exclusively
- **Linting**: ESLint with standard configuration and comprehensive rules
- **Lint Scripts**: 
  - `npm run lint`: Check code style
  - `npm run lint:fix`: Auto-fix linting issues
- **ESLint Configuration**: 
  - Extends standard config with webextensions environment
  - Enforces single quotes, 2-space indentation, semicolons
  - ES2021 syntax support, arrow functions preferred
  - Console logging allowed, camelcase disabled

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

#### UI Update Pattern
```javascript
// Update tab counter
savedTabsCount.textContent = savedTabs.length;

// Show user feedback
showMessage(`Saved ${otherTabs.length} tabs successfully!`);
```

## Testing and Debugging

### Automated Testing
- **Framework**: Jest with jsdom environment
- **Test Scripts**: 
  - `npm test`: Run all tests
  - `npm run test:watch`: Run tests in watch mode
- **Test Coverage**: Tests cover background script logic, tab interface functionality, and Chrome API interactions
- **Test Configuration**:
  - Collects coverage from all JS files except tests and config
  - Uses setup file for Chrome API mocks
  - Tests located in `tests/` directory with `.test.js` pattern
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
- **Linting errors**: Run `npm run lint:fix` to auto-fix common formatting issues
- **ESLint configuration**: Uses .eslintrc.js file with standard config and webextensions environment

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