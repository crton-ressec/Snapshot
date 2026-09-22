const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

// Tiny valid solid green 64x64 PNG — jimp/expo happy, Expo resizes for icons
const GREEN_B64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAATklEQVR42u3PQQ0AAAgEoNP+wYxlA/9u0IDK5LVOBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBARuC/OPAUiwJMAGAAAAAElFTkSuQmCC";

const buf = Buffer.from(GREEN_B64, 'base64');
['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach(name => {
  fs.writeFileSync(path.join(assetsDir, name), buf);
});
console.log('Icons written successfully');
