# WayVote Chrome Extension - Changelog

## Version 1.0.0 (Initial Release)

### Features
- ✅ **Reddit Integration**: Automatically detects Reddit posts and extracts unique identifiers
- ✅ **Custom Metrics**: Configure weights for IQ, Reading Comprehension, Critical Thinking, and Has Children
- ✅ **Real-time Reordering**: Posts are automatically reordered based on your custom rankings
- ✅ **Custom Voting System**: Replace Reddit's voting with WayVote's weighted voting
- ✅ **Settings UI**: Beautiful popup interface with sliders and input fields
- ✅ **API Integration**: Connects to WayVote API for community-based rankings
- ✅ **Settings Persistence**: Your preferences are saved and synced across devices
- ✅ **Responsive Design**: Works on all screen sizes

### Technical Implementation
- **Manifest V3**: Uses latest Chrome extension standards
- **Content Scripts**: Injects into Reddit pages for post detection
- **DOM Mutation Observer**: Watches for new posts as you scroll
- **Chrome Storage API**: Saves settings with sync capability
- **Fetch API**: Communicates with WayVote backend
- **CSS-in-JS**: Dynamic styling for custom vote elements

### File Structure
```
chrome_extension/
├── manifest.json          # Extension configuration
├── content.js            # Main Reddit integration
├── content.css           # Styling for WayVote elements
├── popup.html            # Settings interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Service worker
├── icons/                # Extension icons
├── README.md             # Documentation
├── INSTALL.md            # Installation guide
├── CHANGELOG.md          # This file
├── package.json          # Extension metadata
├── build-icons.js        # Icon generation script
└── generate-icons.html   # Manual icon generator
```

### API Integration
- **GET Rankings**: `POST /getRankings` with custom metric weights
- **Upvote**: `POST /upVote` for positive votes
- **Downvote**: `POST /downVote` for negative votes
- **Error Handling**: Graceful fallback when API is unavailable

### Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Other Chromium-based browsers

### Security & Privacy
- **No Personal Data**: Only sends post IDs and metric preferences
- **Local Storage**: Settings stored in Chrome's sync storage
- **HTTPS Only**: All API communication over secure connections
- **No Tracking**: No analytics or user tracking

### Known Limitations
- **Reddit Only**: Currently only works on Reddit.com
- **New Reddit**: Optimized for Reddit's current design
- **API Dependency**: Requires WayVote API to be available
- **Custom Metrics**: "Create New Metric" feature coming soon

### Future Roadmap
- 🔄 **Custom Metrics**: Allow users to create their own ranking criteria
- 🔄 **Multiple Sites**: Support for other social media platforms
- 🔄 **Advanced Filters**: More sophisticated content filtering
- 🔄 **Community Features**: Share ranking configurations
- 🔄 **Analytics**: Optional usage statistics
- 🔄 **Themes**: Customizable UI themes

### Installation
1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable Developer mode
4. Click "Load unpacked" and select the chrome_extension folder
5. Pin the extension to your toolbar
6. Visit Reddit and configure your metrics!

### Support
- **Website**: [wayvote.org](https://wayvote.org)
- **Email**: contact@wayvote.org
- **Issues**: Report bugs through GitHub issues

---

**Built with ❤️ for democratic participation and user control over content algorithms.**
