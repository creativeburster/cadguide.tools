const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['ansys-workbench','ansys-workbench-meshing-solver-diagnostics-shape-check-unit-mismatch-magnitude-limit'],
  ['autodesk-inventor','autodesk-inventor-memory-stability-gdi-leak-cefsharp-onedrive-helical-gears'],
  ['ptc-creo','ptc-creo-startup-assembly-crash-license-retrieve-display-flexible-component'],
  ['bricscad','bricscad-lisp-dwg-stability-heap-memory-v23-login-aec-dictionary-large-dwg'],
  ['etabs','etabs-modal-mass-participation-negative-eigenvalue-ritz-vector-basement-mass'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
