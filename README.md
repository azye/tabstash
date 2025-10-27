# TabStash Chrome Extension

A simple Chrome extension for saving and organizing browser tabs.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The TabStash extension will appear in your toolbar

## Usage

- Click the TabStash icon in your toolbar
- Click "Save Current Tab" to save the active tab
- Click on any saved tab to reopen it
- Tabs are stored locally in your browser

## Development

This extension uses Manifest V3 and includes:
- `manifest.json` - Extension configuration
- `popup.html/js` - Extension popup interface
- `background.js` - Service worker
- `icons/` - Extension icons

## Permissions

- `tabs` - Access tab information
- `storage` - Save tabs locally