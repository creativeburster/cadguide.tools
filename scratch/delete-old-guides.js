const fs = require('fs');
const path = require('path');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const allDirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());
let deleted = 0;
for (const d of allDirs) {
  const dirPath = path.join(guidesDir, d);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  // Identify old-style files (short filenames, not the new long-filename format)
  const oldFiles = files.filter(f => f.length < 100);
  for (const f of oldFiles) {
    const fullPath = path.join(dirPath, f);
    fs.unlinkSync(fullPath);
    deleted++;
    console.log(`Deleted: ${d}/${f}`);
  }
}
console.log(`\nTotal deleted: ${deleted}`);
