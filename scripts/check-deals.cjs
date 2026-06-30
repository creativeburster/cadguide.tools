const fs = require('fs');
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let all = [];
for (const f of files) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const m = [...raw.matchAll(/id:\s*"(t\d+)"/g)].map(x => x[1]);
  all = all.concat(m);
}
console.log('Total tools:', all.length);

const dealIds = new Set(['t13','t57','t53','t56','t62','t12','t54','t30','t1','t4','t9','t20','t16','t23','t22','t15','t25','t21','t3','t5','t17','t6','t2','t14','t29','t11','t55','t51']);
const withDeals = all.filter(id => dealIds.has(id));
const withoutDeals = all.filter(id => !dealIds.has(id));
console.log('Tools with deals:', withDeals.length);
console.log('Tools without deals:', withoutDeals.length);
console.log('\nWithout deals:');
withoutDeals.forEach(id => console.log('  ' + id));
