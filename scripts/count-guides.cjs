const fs = require('fs');
const path = require('path');

const guidesDir = path.join(process.cwd(), 'src', 'content', 'guides');
const toolDirs = fs.readdirSync(guidesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let total = 0;
const stats = {};

for (const tool of toolDirs) {
  const toolPath = path.join(guidesDir, tool);
  const files = fs.readdirSync(toolPath).filter(f => f.endsWith('.md'));
  stats[tool] = files.length;
  total += files.length;
}

console.log('Total guides:', total);
console.log('Tools with guides:', toolDirs.length);
console.log();
Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([tool, n]) => {
  console.log('  ' + tool + ': ' + n);
});

// Check total tools in catalog
const dataFiles = ['c1','c2','c3','c4','c5','c6','c7'];
let allTools = [];
for (const f of dataFiles) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const ids = [...raw.matchAll(/id:\s*"(t\d+)"/g)].map(x => x[1]);
  allTools = allTools.concat(ids);
}
console.log('\nTotal tools in catalog:', allTools.length);
console.log('Coverage:', toolDirs.length + '/' + allTools.length, '(' + Math.round(toolDirs.length/allTools.length*100) + '%)');
