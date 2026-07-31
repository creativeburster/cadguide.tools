const fs = require('fs');
const path = require('path');
const dir = 'f:/cadguide.tools/src/content/guides';
const dirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
let deleted = 0;
const emptyDirs = [];
for (const d of dirs) {
  const files = fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md'));
  for (const f of files) {
    if (f.endsWith('-getting-started-guide.md')) {
      fs.unlinkSync(path.join(dir, d, f));
      deleted++;
    }
  }
  // Check if dir is now empty
  const remaining = fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md'));
  if (remaining.length === 0) emptyDirs.push(d);
}
// Remove empty dirs
for (const d of emptyDirs) fs.rmdirSync(path.join(dir, d));
console.log('deleted:', deleted, 'empty dirs removed:', emptyDirs.length);
