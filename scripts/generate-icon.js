const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, '../assets/icon.b64'), 'utf8');
const buf = Buffer.from(b64, 'base64');

const assetsDir = path.join(__dirname, '../assets');
['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach((name) => {
  fs.writeFileSync(path.join(assetsDir, name), buf);
  console.log('Wrote', name);
});
