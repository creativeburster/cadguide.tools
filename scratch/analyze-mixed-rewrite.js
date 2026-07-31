const fs = require('fs');
const lines = fs.readFileSync('f:/cadguide.tools/scratch/audit-full-results.txt', 'utf-8').split('\n');

// Parse per-tool summary
const toolSummary = {};
let inSummary = false;
for (const line of lines) {
  if (line.startsWith('=== PER-TOOL SUMMARY ===')) { inSummary = true; continue; }
  if (inSummary && line.trim()) {
    const m = line.match(/^([\w-]+):\s+(\d+) total \(K:(\d+) R:(\d+) D:(\d+)\)/);
    if (m) {
      toolSummary[m[1]] = { total: +m[2], keep: +m[3], rewrite: +m[4], del: +m[5] };
    }
  }
}

// Parse REWRITE section
const rewriteGuides = [];
let inRewrite = false;
for (const line of lines) {
  if (line.startsWith('=== REWRITE')) { inRewrite = true; continue; }
  if (line.startsWith('=== PER-TOOL')) { inRewrite = false; continue; }
  if (inRewrite && line.trim()) {
    const parts = line.split('|');
    const filepath = parts[0].trim();
    const tool = filepath.split('/')[0];
    const filename = filepath.split('/')[1];
    const score = parts[1] ? parts[1].trim() : '';
    rewriteGuides.push({ tool, filename, filepath, score });
  }
}

// Split into zero-keep (already done) and mixed (need to do)
const zeroKeepRewrite = rewriteGuides.filter(g => (toolSummary[g.tool]?.keep || 0) === 0);
const mixedRewrite = rewriteGuides.filter(g => (toolSummary[g.tool]?.keep || 0) > 0);

console.log('=== ZERO-KEEP REWRITE (already handled) ===');
console.log('Count:', zeroKeepRewrite.length);
console.log('Tools:', [...new Set(zeroKeepRewrite.map(g => g.tool))].sort().join(', '));

console.log('\n=== MIXED REWRITE (need to handle) ===');
console.log('Count:', mixedRewrite.length);

// Group by tool
const byTool = {};
for (const g of mixedRewrite) {
  if (!byTool[g.tool]) byTool[g.tool] = [];
  byTool[g.tool].push(g);
}

const sortedTools = Object.keys(byTool).sort();
console.log('Tools:', sortedTools.length);
for (const t of sortedTools) {
  console.log(`  ${t} (K:${toolSummary[t].keep} R:${byTool[t].length}): ${byTool[t].map(g => g.filename.substring(0, 50)).join('; ')}`);
}
