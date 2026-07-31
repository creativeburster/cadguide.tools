const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['dwg-fastview','dwg-fastview-cannot-open-drawing-missing-font-sync-conflict-fix'],
  ['circuitmaker','circuitmaker-performance-limits-rotation-bugs-file-format-migration'],
  ['radan','radan-floating-scrap-unfold-errors-tooling-hints-workflow'],
  ['visi','visi-analysis-draft-checking-split-line-geometry-healing-mold'],
  ['shipconstructor','shipconstructor-clash-management-navisworks-distributed-teams'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
