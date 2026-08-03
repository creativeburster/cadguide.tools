const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const allDirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());
const multi = [];
const single = [];
for (const d of allDirs) {
  const files = fs.readdirSync(path.join(guidesDir, d)).filter(f => f.endsWith('.md'));
  if (files.length > 1) {
    multi.push(`${d} (${files.length} files)`);
  } else {
    single.push(d);
  }
}
console.log('Dirs with multiple .md files:', multi.length);
console.log(multi.join('\n'));
console.log('\nDirs with single .md file:', single.length);
