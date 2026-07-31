const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const files = [
  'f:/cadguide.tools/src/content/guides/solid-edge/solid-edge-crash-startup-safe-mode-crashlog-fix.md',
  'f:/cadguide.tools/src/content/guides/eplan/eplan-check-run-messages-p-code-errors-routing-fix.md',
  'f:/cadguide.tools/src/content/guides/magics/magics-stl-repair-bad-edges-normals-holes-fix.md',
  'f:/cadguide.tools/src/content/guides/solvespace/solvespace-naked-edges-solver-failure-opengl-fix.md',
  'f:/cadguide.tools/src/content/guides/glovius/glovius-cannot-open-file-crash-startup-export-fix.md',
];
const required = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf-8');
  const { data } = matter(raw);
  const missing = required.filter(k => !data[k]);
  const sourceCount = Array.isArray(data.sources) ? data.sources.length : 0;
  console.log(`${data.slug} | cat: ${data.category} | sources: ${sourceCount} | missing: ${missing.length ? missing.join(',') : 'none'}`);
}
