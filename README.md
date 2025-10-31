# 🔥 TabStash Chrome Extension

A sleek Chrome extension that helps you save and organize browser tabs with session management. Perfect for developers who juggle multiple projects and research sessions!

## ✨ Features

- **🎯 One-Click Tab Stashing**: Save all tabs (except extension tabs) with a single click
- **📁 Smart Session Management**: Tabs are automatically grouped by save session with timestamps
- **🔄 Easy Tab Restoration**: Click individual tabs to restore them or restore entire sessions
- **🧹 Clear All Tabs**: Remove all saved tabs at once with confirmation
- **📊 Tab Counter**: See total count of saved tabs at a glance
- **🌐 Chrome Page Support**: Treats chrome:// pages like regular tabs (saved and closed)
- **💾 Local Storage**: All data stored locally, no cloud sync required

## 🚀 Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this directory
4. The TabStash extension will appear in your toolbar 🔥

## 📖 Usage

### Basic Usage
- Click the TabStash icon in your toolbar to instantly save all current tabs and open the manager
- The extension will save all tabs (except its own) and close them with one click
- Click on any saved tab to reopen it
- Use "Restore All" buttons to restore entire sessions
- Use the "Clear All Tabs" button to remove all saved tabs

### Extension Tab
- The extension opens in a full tab (not a popup) for better usability
- Only one extension tab is kept active at a time
- The extension tab is automatically refreshed when opened
- See your total saved tabs count right in the header

## 🛠️ Development

### Quick Setup
```bash
npm install
```

### Available Scripts
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run automated tests
- `npm run test:watch` - Run tests in watch mode

### Tech Stack
- **📦 Manifest V3** Chrome extension
- **🟨 Vanilla JavaScript** - No frameworks required
- **📏 ESLint** - Comprehensive linting rules
- **🧪 Jest** - Automated testing with Chrome API mocks

### Project Structure
```
├── manifest.json          # Extension configuration and permissions
├── background.js          # Service worker handling extension lifecycle
├── tab.html/tab.js       # Main interface for managing saved tabs
├── popup.html/popup.js   # Legacy popup interface
├── tests/               # Automated test suite
├── icons/               # Extension icons in various sizes
└── AGENTS.md            # Detailed development documentation
```

## 🔐 Permissions

- `tabs` - Access and manipulate browser tabs
- `storage` - Save tabs locally in browser storage

## 🧪 Testing

The project includes a comprehensive test suite covering:
- Background script logic and Chrome API interactions
- Tab interface functionality and DOM manipulation
- Tab filtering, session management, and restoration

Run tests with:
```bash
npm test
```

## 🌍 Browser Compatibility

- Chrome/Chromium browsers
- Manifest V3 required
- Modern JavaScript features (ES6+) supported

## 📄 License

MIT License - feel free to use and modify for your own purposes.

---

**Made with ❤️ for developers who love organized tabs**