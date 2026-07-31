const fs = require('fs');
const lines = fs.readFileSync('f:/cadguide.tools/scratch/audit-full-results.txt', 'utf-8').split('\n');

// Parse per-tool summary for keep counts
const toolSummary = {};
let inSummary = false;
for (const line of lines) {
  if (line.startsWith('=== PER-TOOL SUMMARY ===')) { inSummary = true; continue; }
  if (inSummary && line.trim()) {
    const m = line.match(/^([\w-]+):\s+(\d+) total \(K:(\d+) R:(\d+) D:(\d+)\)/);
    if (m) toolSummary[m[1]] = { keep: +m[3] };
  }
}

// Parse REWRITE section, filter mixed (keep > 0)
const baseDir = 'f:/cadguide.tools/src/content/guides';
let deleted = 0;
let inRewrite = false;
for (const line of lines) {
  if (line.startsWith('=== REWRITE')) { inRewrite = true; continue; }
  if (line.startsWith('=== PER-TOOL')) break;
  if (inRewrite && line.trim()) {
    const filepath = line.split('|')[0].trim();
    const tool = filepath.split('/')[0];
    const filename = filepath.split('/')[1];
    if ((toolSummary[tool]?.keep || 0) > 0) {
      const fullPath = `${baseDir}/${tool}/${filename}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        deleted++;
        console.log('Deleted: ' + tool + '/' + filename);
      }
    }
  }
}
console.log('\nTotal deleted: ' + deleted);
