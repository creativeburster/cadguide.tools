const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dir = 'f:/cadguide.tools/src/content/guides';
const dirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const onlyOne = [];
for (const d of dirs) {
  const files = fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md'));
  if (files.length === 1) {
    const raw = fs.readFileSync(path.join(dir, d, files[0]), 'utf-8');
    const { data } = matter(raw);
    onlyOne.push({ dir, file: files[0], category: data.category, title: data.title });
  }
}
console.log('tools with only 1 guide:', onlyOne.length);
onlyOne.forEach((x, i) => console.log(`${i+1}. ${x.dir} | ${x.category} | ${x.file}`));
