const fs = require('fs');
const lines = fs.readFileSync('f:/cadguide.tools/scratch/audit-full-results.txt', 'utf-8').split('\n');
let inSummary = false;
const zeroKeep = [];
const hasRewrite = [];
for (const l of lines) {
  if (l.startsWith('=== PER-TOOL')) inSummary = true;
  if (inSummary && l.includes('total (K:')) {
    const m = l.match(/^([^:]+):\s*(\d+)\s*total\s*\(K:(\d+)\s*R:(\d+)\s*D:(\d+)\)/);
    if (m) {
      const tool = m[1], total = parseInt(m[2]), k = parseInt(m[3]), r = parseInt(m[4]), d = parseInt(m[5]);
      if (k === 0 && total >= 2) {
        zeroKeep.push({tool, total, r, d});
      } else if (r > 0 && k > 0) {
        hasRewrite.push({tool, k, r, total});
      }
    }
  }
}
console.log('=== Zero-keep tools remaining ===');
console.log('Count:', zeroKeep.length, '| Total guides:', zeroKeep.reduce((s,t)=>s+t.r+t.d,0));
console.log('\n=== Tools with both KEEP and REWRITE ===');
console.log('Count:', hasRewrite.length, '| REWRITE guides:', hasRewrite.reduce((s,t)=>s+t.r,0));
console.log('\nDetail (REWRITE count per tool):');
hasRewrite.sort((a,b)=>b.r-a.r);
for (const t of hasRewrite) {
  console.log(`  ${t.tool}: K=${t.k} R=${t.r} total=${t.total}`);
}
console.log('\n=== Summary ===');
console.log('Zero-keep remaining:', zeroKeep.length, 'tools,', zeroKeep.reduce((s,t)=>s+t.r+t.d,0), 'guides to delete+replace');
console.log('Mixed tools:', hasRewrite.length, 'tools,', hasRewrite.reduce((s,t)=>s+t.r,0), 'REWRITE guides to delete+replace');
console.log('Total REWRITE remaining:', zeroKeep.reduce((s,t)=>s+t.r,0) + hasRewrite.reduce((s,t)=>s+t.r,0));
