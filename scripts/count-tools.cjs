const fs = require('fs');
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let tIds = [];
for (const f of files) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const ids = [...raw.matchAll(/id:\s*"(t\d+)"/g)].map(x => x[1]);
  tIds = tIds.concat(ids);
}
console.log('t* tools:', tIds.length);

// Check ext tools in data.ts
const dataRaw = fs.readFileSync('src/lib/data.ts', 'utf-8');
const extIds = [...dataRaw.matchAll(/'(ext-[^']+)'/g)].map(x => x[1]);
console.log('ext* tools:', extIds.length);
console.log('ext IDs:', extIds.join(', '));
console.log('Total tools:', tIds.length + extIds.length);
