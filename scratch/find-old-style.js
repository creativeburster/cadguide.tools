const fs = require('fs');
const path = require('path');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const allDirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());
const newStyle = [];
const oldStyle = [];
for (const d of allDirs) {
  const files = fs.readdirSync(path.join(guidesDir, d)).filter(f => f.endsWith('.md'));
  const hasLong = files.some(f => f.length > 100);
  if (hasLong) {
    newStyle.push(d);
  } else {
    oldStyle.push(d);
  }
}
console.log('New-style (long filename) dirs:', newStyle.length);
console.log('Old-style (short filename) dirs:', oldStyle.length);
console.log('\nOld-style dirs:');
console.log(oldStyle.sort().join('\n'));
