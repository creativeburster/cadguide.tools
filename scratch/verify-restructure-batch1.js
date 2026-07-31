const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['staad-pro','staad-pro-solver-diagnostics-disjointed-structure-convergence-direct-analysis'],
  ['abaqus','abaqus-contact-convergence-severe-discontinuity-penetration-rigid-body'],
  ['navisworks','navisworks-clash-detection-accuracy-hard-conservative-guid-stability'],
  ['gerber-accumark','gerber-accumark-crash-diagnosis-save-exception-error-115b-dxf-bounding-box'],
  ['lectra-modaris','lectra-modaris-file-exchange-dxf-aama-illustrator-compatibility-pattern-incompatibility'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
