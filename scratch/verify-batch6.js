const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['surfcam','surfcam-post-processor-configuration-gcode-errors-custom-posts'],
  ['target-3001','target-3001-pcb-design-user-evaluation-strengths-weaknesses'],
  ['lusas','lusas-nonlinear-convergence-diagnosis-residual-pivot-connectivity'],
  ['scia-engineer','scia-engineer-bim-integration-revit-ifc-analytical-model-conversion'],
  ['vertex-bd','vertex-bd-framing-automation-truss-errors-hold-down-ifc-import'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
