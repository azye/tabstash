# TabStash Chrome Extension

A simple Chrome extension for saving and organizing browser tabs with session management.

## Features

- **Tab Stashing**: Save all tabs (except extension tabs) with one click
- **Session Management**: Tabs are automatically grouped by save session with timestamps
- **Tab Restoration**: Click individual tabs to restore them or restore entire sessions
- **Chrome Page Support**: Treats chrome:// pages like regular tabs (saved and closed)
- **Local Storage**: All data stored locally, no cloud sync required

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The TabStash extension will appear in your toolbar

## Usage

### Basic Usage
- Click the TabStash icon in your toolbar to save all current tabs and open the manager
- The extension will save all tabs (except its own) and close them
- Click on any saved tab to reopen it
- Use "Restore All" buttons to restore entire sessions

### Extension Tab
- The extension opens in a full tab (not a popup) for better usability
- Only one extension tab is kept active at a time
- The extension tab is automatically refreshed when opened

## Development

### Setup
```bash
npm install
```

### Scripts
- `npm run lint` - Check code style
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run automated tests
- `npm run test:watch` - Run tests in watch mode

### Architecture
- **Manifest V3** Chrome extension
- **Vanilla JavaScript** - No frameworks required
- **ESLint** - Comprehensive linting rules
- **Jest** - Automated testing with Chrome API mocks

### File Structure
- `manifest.json` - Extension configuration and permissions
- `background.js` - Service worker handling extension lifecycle
- `tab.html/tab.js` - Main interface for managing saved tabs
- `popup.html/popup.js` - Legacy popup interface
- `tests/` - Automated test suite
- `icons/` - Extension icons in various sizes

## Permissions

- `tabs` - Access and manipulate browser tabs
- `storage` - Save tabs locally in browser storage

## Testing

The project includes a comprehensive test suite covering:
- Background script logic and Chrome API interactions
- Tab interface functionality and DOM manipulation
- Tab filtering, session management, and restoration

Run tests with:
```bash
npm test
```

## Browser Compatibility

- Chrome/Chromium browsers
- Manifest V3 required
- Modern JavaScript features (ES6+) supported

## License

MIT License - feel free to use and modify for your own purposes.