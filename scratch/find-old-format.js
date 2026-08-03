const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const guidesDir = 'f:/cadguide.tools/src/content/guides';
const allDirs = fs.readdirSync(guidesDir).filter(d => fs.statSync(path.join(guidesDir, d)).isDirectory());
const oldFormat = [];
for (const d of allDirs) {
  const files = fs.readdirSync(path.join(guidesDir, d)).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const { data } = matter(fs.readFileSync(path.join(guidesDir, d, f), 'utf-8'));
    if (!data.softwareSlug) {
      oldFormat.push(`${d}/${f}`);
    }
  }
}
console.log('Old format guides (no softwareSlug):', oldFormat.length);
console.log(oldFormat.join('\n'));
