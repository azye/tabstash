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

1. **Tab Stashing**: Save all non-active tabs with session grouping
2. **Session Management**: Tabs are grouped by save session with timestamps
3. **Tab Restoration**: Click saved tabs to reopen them
4. **Bulk Operations**: Restore entire sessions at once

## File Structure and Responsibilities

### manifest.json
- Defines extension permissions: `tabs`, `storage`
- Configures popup action and service worker
- Specifies icon sizes: 16px, 48px, 128px

### popup.js (Main Logic)
- **saveAndCloseAllTabs()**: Saves non-active tabs and closes them
- **loadSavedTabs()**: Displays saved tabs grouped by session
- **restoreSession()**: Opens all tabs from a saved session

### background.js
- Minimal service worker for extension lifecycle
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

### Chrome Extension APIs Used
- `chrome.tabs.query()`: Get tab information
- `chrome.tabs.create()`: Open new tabs
- `chrome.tabs.remove()`: Close tabs
- `chrome.storage.local.get/set()`: Persist data
- `chrome.action.openPopup()`: Open extension popup

### Common Patterns

#### Tab Query Pattern
```javascript
chrome.tabs.query({currentWindow: true}, function(tabs) {
  const activeTab = tabs.find(tab => tab.active);
  const otherTabs = tabs.filter(tab => !tab.active);
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

### Extension Testing
1. Load unpacked extension in Chrome Developer Mode
2. Use Chrome DevTools for popup debugging
3. Check background console for service worker logs
4. Verify storage in `chrome://extensions/` → Storage inspector

### Common Issues
- **Permission errors**: Ensure `tabs` and `storage` permissions in manifest
- **Popup closing**: Window closes after operations (intended behavior)
- **Tab order**: Tabs are closed in reverse order for proper Ctrl+Shift+T restoration

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