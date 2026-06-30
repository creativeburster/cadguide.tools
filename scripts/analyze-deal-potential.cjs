const fs = require('fs');

// Load all tools
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let allTools = [];
for (const f of files) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  // Extract id, name, slug, pricing_type, official_url
  const toolMatches = [...raw.matchAll(/id:\s*"(t\d+)".*?name:\s*"([^"]+)".*?slug:\s*"([^"]+)"/gs)];
  for (const m of toolMatches) {
    allTools.push({ id: m[1], name: m[2], slug: m[3] });
  }
}

// Tools with deals
const dealIds = new Set(['t13','t57','t53','t56','t62','t12','t54','t30','t1','t4','t9','t20','t16','t23','t22','t15','t25','t21','t3','t5','t17','t6','t2','t14','t29','t11','t55','t51']);

const without = allTools.filter(t => !dealIds.has(t.id));
console.log('Total tools:', allTools.length);
console.log('With deals:', allTools.length - without.length);
console.log('Without deals:', without.length);
console.log('\nTools without deals:');
without.forEach(t => console.log('  ' + t.id + ' | ' + t.name + ' | ' + t.slug));
