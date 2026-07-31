const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dir = 'f:/cadguide.tools/src/content/guides';
const dirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const stats = [];
for (const d of dirs) {
  const files = fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md'));
  const cats = {};
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, d, f), 'utf-8');
    const { data } = matter(raw);
    cats[data.category] = (cats[data.category] || 0) + 1;
  }
  stats.push({ dir, count: files.length, cats });
}
stats.sort((a, b) => a.count - b.count);

const buckets = { 1: 0, '2-3': 0, '4-6': 0, '7+': 0 };
for (const s of stats) {
  if (s.count === 1) buckets[1]++;
  else if (s.count <= 3) buckets['2-3']++;
  else if (s.count <= 6) buckets['4-6']++;
  else buckets['7+']++;
}
console.log('=== Guide count distribution ===');
console.log('  1 guide:', buckets[1]);
console.log('  2-3 guides:', buckets['2-3']);
console.log('  4-6 guides:', buckets['4-6']);
console.log('  7+ guides:', buckets['7+']);

const only1 = stats.filter(s => s.count === 1);
console.log('\n=== Tools with only 1 guide (' + only1.length + ') ===');
console.log(only1.map(s => s.dir).join(', '));

// Category coverage
const allCats = ['workflow','troubleshooting','comparison','performance','migration','deployment','standards','manufacturing','printing','automation','procurement'];
const coverage = {};
for (const c of allCats) coverage[c] = 0;
for (const s of stats) {
  for (const c of allCats) {
    if (s.cats[c]) coverage[c]++;
  }
}
console.log('\n=== Category coverage (out of 240 tools) ===');
for (const [c, n] of Object.entries(coverage)) {
  console.log(`  ${c}: ${n} tools (${Math.round(n/240*100)}%)`);
}

// Tools with only getting-started (workflow) and nothing else
const onlyGettingStarted = stats.filter(s => s.count === 1 && s.cats.workflow === 1);
console.log('\n=== Tools with ONLY a getting-started guide (' + onlyGettingStarted.length + ') ===');
console.log(onlyGettingStarted.map(s => s.dir).join(', '));
