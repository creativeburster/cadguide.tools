const fs = require('fs');
const path = require('path');

// Get all tool slugs
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let allTools = [];
for (const f of files) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const matches = [...raw.matchAll(/id:\s*"(t\d+)".*?slug:\s*"([^"]+)"/gs)];
  for (const m of matches) {
    allTools.push({ id: m[1], slug: m[2] });
  }
}
// Add ext tools
const dataRaw = fs.readFileSync('src/lib/data.ts', 'utf-8');
const extSlugs = ['infraworks','3ds-max','zbrush','keyshot','lumion','enscape','twinmotion'];
for (const s of extSlugs) {
  allTools.push({ id: 'ext-'+s, slug: s });
}

// Get tools that already have guides
const guidesDir = path.join(process.cwd(), 'src', 'content', 'guides');
const guidedTools = new Set(fs.readdirSync(guidesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name));

const without = allTools.filter(t => !guidedTools.has(t.slug));
const withGuides = allTools.filter(t => guidedTools.has(t.slug));

console.log('Total tools:', allTools.length);
console.log('With guides:', withGuides.length);
console.log('Without guides:', without.length);
console.log('\nTools without guides (' + without.length + '):');
without.forEach(t => console.log('  ' + t.slug));
