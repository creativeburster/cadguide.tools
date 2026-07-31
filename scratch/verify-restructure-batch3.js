const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['idea-statica','idea-statica-connection-analysis-singularity-gmna-bolt-gap-mitre-cut'],
  ['midas-civil','midas-civil-construction-stage-convergence-zero-stiffness-tendon-recess-cable-restart'],
  ['3dexperience','3dexperience-solidworks-integration-conversion-mysession-refresh-connection-2026'],
  ['actcad','actcad-lisp-porting-visual-lisp-replacement-pdf-dwg-conversion'],
  ['alibre-design','alibre-design-assembly-performance-drawing-quality-hoops-faceting'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
