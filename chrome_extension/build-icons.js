// Simple script to generate PNG icons from SVG
// This requires ImageMagick to be installed: https://imagemagick.org/

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];
const svgPath = path.join(__dirname, 'icons', 'icon.svg');

console.log('🎯 WayVote: Building Chrome extension icons...');

// Check if ImageMagick is available
try {
  execSync('magick -version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ ImageMagick not found. Please install ImageMagick to build icons.');
  console.log('📥 Download from: https://imagemagick.org/script/download.php');
  process.exit(1);
}

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG icon not found at:', svgPath);
  process.exit(1);
}

// Generate PNG icons
sizes.forEach(size => {
  const outputPath = path.join(__dirname, 'icons', `icon${size}.png`);
  
  try {
    execSync(`magick "${svgPath}" -resize ${size}x${size} "${outputPath}"`, { stdio: 'ignore' });
    console.log(`✅ Generated icon${size}.png`);
  } catch (error) {
    console.error(`❌ Failed to generate icon${size}.png:`, error.message);
  }
});

console.log('🎉 Icon generation complete!');
console.log('📁 Icons saved to: chrome_extension/icons/');
console.log('');
console.log('📋 Next steps:');
console.log('1. Load the extension in Chrome (chrome://extensions/)');
console.log('2. Enable Developer mode');
console.log('3. Click "Load unpacked" and select the chrome_extension folder');
console.log('4. Test on Reddit!');
