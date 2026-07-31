const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['solid-edge','solid-edge-crash-startup-safe-mode-crashlog-fix'],
  ['eplan','eplan-check-run-messages-p-code-errors-routing-fix'],
  ['magics','magics-stl-repair-bad-edges-normals-holes-fix'],
  ['solvespace','solvespace-naked-edges-solver-failure-opengl-fix'],
  ['glovius','glovius-cannot-open-file-crash-startup-export-fix'],
  ['pconplanner','pconplanner-performance-disappearing-geometry-gpu-fix'],
  ['t-flex-cad','t-flex-cad-parametric-construction-lines-variables-workflow'],
  ['cad-exchanger','cad-exchanger-step-to-jt-conversion-brep-fidelity-bugs'],
  ['lantek-expert','lantek-expert-nesting-workflow-automatic-manual-machine-reassignment'],
  ['think3','think3-boolean-mistakes-non-manifold-sentinel-licensing-fix'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
