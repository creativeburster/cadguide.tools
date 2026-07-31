const fs = require('fs');
const lines = fs.readFileSync('f:/cadguide.tools/scratch/audit-full-results.txt', 'utf-8').split('\n');
const tools = [];
let inSummary = false;
for (const l of lines) {
  if (l.startsWith('=== PER-TOOL')) inSummary = true;
  if (inSummary && l.includes('total (K:')) {
    const m = l.match(/^([^:]+):\s*(\d+)\s*total\s*\(K:(\d+)\s*R:(\d+)\s*D:(\d+)\)/);
    if (m && parseInt(m[3]) === 0 && parseInt(m[2]) >= 2) {
      tools.push({ tool: m[1], total: parseInt(m[2]), rewrite: parseInt(m[4]), del: parseInt(m[5]) });
    }
  }
}
tools.sort((a, b) => b.total - a.total);
for (const t of tools) console.log(t.tool + ': ' + t.total + ' (R:' + t.rewrite + ' D:' + t.del + ')');
console.log('Total zero-keep tools: ' + tools.length);
