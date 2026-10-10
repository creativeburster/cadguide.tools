const fs = require('fs');

const content = fs.readFileSync('./src/lib/toolbox-data.ts', 'utf8');

// Match all slugs
const slugs = [];
const slugRegex = /["']?slug["']?:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = slugRegex.exec(content)) !== null) {
  slugs.push(match[1]);
}

console.log('Total tools count (slugs):', slugs.length);

const cats = ['validator', 'generator', 'comparator', 'library', 'troubleshoot', 'calculator', 'converter', '3d-converter', 'cheatsheet', 'viewer'];
const counts = {};
for (const c of cats) {
  const reg = new RegExp(`["']?category["']?:\\s*['"]${c}['"]`, 'g');
  const m = content.match(reg);
  counts[c] = m ? m.length : 0;
}

console.log('Category distribution:');
console.table(counts);
