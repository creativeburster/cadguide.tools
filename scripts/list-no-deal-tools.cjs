const fs = require('fs');
const files = ['c1','c2','c3','c4','c5','c6','c7'];
let allTools = [];
for (const f of files) {
  const raw = fs.readFileSync('src/lib/data/' + f + '.ts', 'utf-8');
  const blocks = raw.split(/(?=\{[\s\n]*id:)/);
  for (const block of blocks) {
    const idM = block.match(/id:\s*"(t\d+)"/);
    const nameM = block.match(/name:\s*"([^"]+)"/);
    const slugM = block.match(/slug:\s*"([^"]+)"/);
    const urlM = block.match(/official_url:\s*"([^"]*)"/);
    const pricingM = block.match(/pricing_type:\s*"([^"]*)"/);
    if (idM && nameM) {
      allTools.push({ id: idM[1], name: nameM[1], slug: slugM?slugM[1]:'', url: urlM?urlM[1]:'', pricing: pricingM?pricingM[1]:'' });
    }
  }
}

const dealIds = new Set(['t13','t57','t53','t56','t62','t12','t54','t30','t1','t4','t9','t20','t16','t23','t22','t15','t25','t21','t3','t5','t17','t6','t2','t14','t29','t11','t55','t51']);
const without = allTools.filter(t => !dealIds.has(t.id));
without.forEach(t => console.log(t.id + ' | ' + t.name + ' | ' + t.slug + ' | ' + t.pricing + ' | ' + t.url));
