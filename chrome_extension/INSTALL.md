# WayVote Chrome Extension - Installation Guide

## Quick Installation (Development)

### Step 1: Download the Extension
1. Download or clone the WayVote repository
2. Navigate to the `chrome_extension` folder

### Step 2: Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `chrome_extension` folder
5. The WayVote extension should now appear in your extensions list

### Step 3: Pin the Extension
1. Click the **puzzle piece icon** in Chrome's toolbar
2. Find **WayVote** and click the **pin icon** 📌
3. The WayVote icon should now appear in your toolbar

### Step 4: Test on Reddit
1. Go to [reddit.com](https://reddit.com)
2. Click the **WayVote icon** 🎯 in your toolbar
3. Configure your metrics and click **"Apply Rankings"**
4. Browse Reddit and see posts reordered based on your preferences!

## Troubleshooting

### Extension Not Loading
- Make sure you selected the `chrome_extension` folder (not the parent directory)
- Check that all files are present in the folder
- Ensure PNG icon files exist in the `icons/` folder (icon16.png, icon32.png, icon48.png, icon128.png)
- Try refreshing the extensions page

### Extension Not Working on Reddit
- Make sure you're on reddit.com or www.reddit.com
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the Reddit page
- Open browser console (F12) to check for error messages

### API Errors
- Verify you have internet connection
- Check that api.wayvote.org is accessible
- Look for network errors in browser console

## Features to Test

1. **Metric Configuration**: Open popup and adjust slider values
2. **Post Reordering**: Set a metric weight > 0 and see posts reorder
3. **Custom Voting**: Click the new vote buttons on posts
4. **Settings Persistence**: Close and reopen popup to see saved settings

## Next Steps

- **Create Custom Metrics**: Use the "Create New Metric" button (coming soon)
- **Share Feedback**: Visit [wayvote.org](https://wayvote.org) to provide feedback
- **Join Community**: Help improve the ranking algorithms

---

**Need Help?** Visit [wayvote.org](https://wayvote.org) or email contact@wayvote.org
