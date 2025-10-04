# WayVote Chrome Extension

A browser extension that gives you control over Reddit's ranking algorithm by allowing you to customize how posts are ranked based on your preferred metrics.

## Features

- **Custom Ranking Metrics**: Configure weights for different user attributes (IQ, Reading Comprehension, Critical Thinking, Has Children)
- **Real-time Post Reordering**: Reddit posts are automatically reordered based on your custom rankings
- **Custom Voting System**: Replace Reddit's voting with WayVote's weighted voting system
- **Easy Configuration**: Simple popup interface to adjust metric weights with sliders
- **API Integration**: Connects to the WayVote API for community-based rankings

## Installation

### Development Installation

1. **Download the extension files** to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the `chrome_extension` folder
5. **Pin the extension** to your toolbar for easy access

### Production Installation

*Coming soon - will be available on the Chrome Web Store*

## Usage

### Basic Setup

1. **Navigate to Reddit** (reddit.com or www.reddit.com)
2. **Click the WayVote extension icon** in your browser toolbar
3. **Configure your metrics** using the sliders or input fields
4. **Click "Apply Rankings"** to start customizing your Reddit experience

### Metric Configuration

- **IQ**: Weight for user intelligence scores
- **Reading Comprehension**: Weight for reading comprehension abilities  
- **Critical Thinking**: Weight for critical thinking skills
- **Has Children**: Weight for users who have children

Each metric can be weighted from 0-1000:
- **0**: This metric has no influence on rankings
- **500**: This metric has moderate influence
- **1000**: This metric has maximum influence

### How It Works

1. **Post Detection**: The extension automatically detects Reddit posts as you browse
2. **ID Extraction**: Extracts unique identifiers from each post (user-id, view-context, id)
3. **API Request**: Sends post IDs to the WayVote API with your custom metric weights
4. **Ranking**: Receives custom rankings for each post based on your preferences
5. **Reordering**: Automatically reorders posts so highest-ranked content appears first
6. **Custom Voting**: Replaces Reddit's voting system with WayVote's weighted voting

## Technical Details

### Files Structure

```
chrome_extension/
├── manifest.json          # Extension configuration
├── content.js            # Main content script for Reddit integration
├── content.css           # Styles for WayVote elements
├── popup.html            # Settings popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon.svg         # Source SVG icon
│   ├── icon16.png       # 16x16 icon
│   ├── icon32.png       # 32x32 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

### API Integration

The extension integrates with the WayVote API:

- **GET Rankings**: `POST https://api.wayvote.org/getRankings`
- **Upvote**: `POST https://api.wayvote.org/upVote`
- **Downvote**: `POST https://api.wayvote.org/downVote`

### Data Format

**Rankings Request:**
```json
{
  "ids": ["user1-context1-id1", "user2-context2-id2"],
  "customRanking": [
    { "weighName": "IQ", "weighValue": 10 },
    { "weighName": "Critical Thinking", "weighValue": 5 }
  ]
}
```

**Rankings Response:**
```json
[
  { "contentId": "user1-context1-id1", "rank": 1 },
  { "contentId": "user2-context2-id2", "rank": 2 }
]
```

## Development

### Prerequisites

- Chrome browser
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome extension APIs

### Local Development

1. **Make changes** to the extension files
2. **Reload the extension** in `chrome://extensions/`
3. **Test on Reddit** to verify functionality
4. **Check console** for any errors or debugging info

### Building Icons

To create PNG icons from the SVG:

```bash
# Using ImageMagick (if installed)
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Debugging

- **Content Script**: Check browser console on Reddit pages
- **Popup**: Right-click popup → Inspect
- **Background**: Check `chrome://extensions/` → Details → Inspect views: background page

## Privacy & Security

- **No Personal Data**: The extension only sends post IDs and metric preferences
- **Local Storage**: Settings are stored locally in Chrome's sync storage
- **API Communication**: All API calls are made directly to api.wayvote.org
- **No Tracking**: No user tracking or analytics

## Troubleshooting

### Extension Not Working

1. **Check if enabled**: Ensure the extension is enabled in `chrome://extensions/`
2. **Refresh Reddit**: Reload the Reddit page after installing
3. **Check console**: Look for error messages in browser console
4. **Verify API**: Ensure api.wayvote.org is accessible

### Posts Not Reordering

1. **Check metrics**: Ensure at least one metric has a weight > 0
2. **Apply settings**: Click "Apply Rankings" in the popup
3. **Wait for API**: API calls may take a few seconds
4. **Check network**: Verify API requests are successful in Network tab

### Voting Not Working

1. **Check API status**: Verify the WayVote API is responding
2. **Check permissions**: Ensure extension has access to api.wayvote.org
3. **Try manual vote**: Test voting through the popup interface

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## Support

- **Website**: [wayvote.org](https://wayvote.org)
- **Email**: contact@wayvote.org
- **Issues**: Report bugs through GitHub issues

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for democratic participation and user control over content algorithms.
