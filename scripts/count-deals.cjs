const fs = require('fs');
const raw = fs.readFileSync('src/lib/deals-data.ts', 'utf-8');
const dealIds = [...raw.matchAll(/toolId:\s*'([^']+)'/g)].map(m => m[1]);
const unique = [...new Set(dealIds)];
console.log('Total deals:', dealIds.length);
console.log('Unique tools with deals:', unique.length);

// Count total tools
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let allIds = [];
for (const f of files) {
  const raw2 = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const ids = [...raw2.matchAll(/id:\s*"(t\d+)"/g)].map(x => x[1]);
  allIds = allIds.concat(ids);
}
console.log('Total tools:', allIds.length);
console.log('Coverage:', unique.length + '/' + allIds.length, '(' + Math.round(unique.length/allIds.length*100) + '%)');
