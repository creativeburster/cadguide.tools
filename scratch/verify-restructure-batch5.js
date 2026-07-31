const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['altair-hyperworks','altair-hyperworks-mesh-quality-optimization-errors-rbe3-thin-shell-fsi-mesh-size'],
  ['ansys-fluent','ansys-fluent-convergence-udf-diagnostics-amg-pressure-correction-define-macro-uds-nan'],
  ['ares-commander','ares-commander-startup-lisp-compatibility-opengl-crash-cloud-lock-colordlg-background-image'],
  ['autocad','autocad-crash-performance-diagnostics-graphics-regression-parametric-constraint-model-layout-legacy-solids'],
  ['autodesk-construction-cloud','autodesk-construction-cloud-worksharing-sync-errors-orphaned-workset-ownership-duplicated-materials-bottleneck'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
