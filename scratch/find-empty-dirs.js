const fs = require('fs');
const path = require('path');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const allDirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());
const noMd = allDirs.filter(d => {
  const files = fs.readdirSync(path.join(guidesDir, d)).filter(f => f.endsWith('.md'));
  return files.length === 0;
});
console.log('Total dirs:', allDirs.length);
console.log('Dirs without .md:', noMd.length);
console.log(noMd.join('\n'));
