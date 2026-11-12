const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'resume.html');
const assets = path.join(root, 'assets');
fs.mkdirSync(assets, { recursive: true });

let html = fs.readFileSync(src, 'utf8');
let n = 0;
html = html.replace(/src="data:image\/(jpeg|jpg|png|webp|gif);base64,([^"]+)"/g, (_, type, b64) => {
  n += 1;
  const ext = type === 'jpeg' || type === 'jpg' ? 'jpg' : type;
  const name = n === 1 ? `portrait.${ext}` : `survey-${n - 1}.${ext}`;
  fs.writeFileSync(path.join(assets, name), Buffer.from(b64, 'base64'));
  console.log('wrote', name, fs.statSync(path.join(assets, name)).size, 'bytes');
  return `src="assets/${name}"`;
});

fs.writeFileSync(path.join(root, 'resume.extracted.html'), html);
console.log('images', n, 'html bytes', html.length);
