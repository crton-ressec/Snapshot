const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, '../assets');
const b64Path = path.join(assetsDir, 'icon.b64');

function createWithConvert() {
  try {
    // Create green background
    execSync(`convert -size 1024x1024 xc:'#00C853' ${path.join(assetsDir, 'bg.png')}`);
    // Download emoji if possible
    try {
      execSync(`curl -sL "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f917.png" -o ${path.join(assetsDir, 'emoji.png')}`);
      execSync(`convert ${path.join(assetsDir, 'emoji.png')} -resize 620x620 ${path.join(assetsDir, 'emoji-large.png')}`);
      execSync(`convert ${path.join(assetsDir, 'bg.png')} ${path.join(assetsDir, 'emoji-large.png')} -gravity center -compose over -composite ${path.join(assetsDir, 'icon.png')}`);
      console.log('Created icon with exact \ud83e\udd17 emoji on green');
    } catch (e) {
      // Fallback to solid green
      execSync(`convert -size 1024x1024 xc:'#00C853' ${path.join(assetsDir, 'icon.png')}`);
      console.log('Created solid green icon (emoji download failed)');
    }
    // Copy
    ['splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach((name) => {
      fs.copyFileSync(path.join(assetsDir, 'icon.png'), path.join(assetsDir, name));
    });
    // Cleanup temp
    try {
      fs.unlinkSync(path.join(assetsDir, 'bg.png'));
      fs.unlinkSync(path.join(assetsDir, 'emoji.png'));
      fs.unlinkSync(path.join(assetsDir, 'emoji-large.png'));
    } catch {}
    return true;
  } catch (e) {
    console.log('ImageMagick convert not available:', e.message);
    return false;
  }
}

if (fs.existsSync(b64Path)) {
  const b64 = fs.readFileSync(b64Path, 'utf8');
  const buf = Buffer.from(b64, 'base64');
  ['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach((name) => {
    fs.writeFileSync(path.join(assetsDir, name), buf);
  });
  console.log('Used embedded icon.b64 (exact \ud83e\udd17)');
} else if (!createWithConvert()) {
  console.log('Could not generate icon - please add assets/icon.png manually');
}
