const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['siemens-nx','siemens-nx-license-performance-splm-port-sls-migration-save-hang'],
  ['allplan','allplan-ifc-export-issues-level-mapping-attributes-remapper-stair-quantity'],
  ['autocad-plant-3d','autocad-plant-3d-isometric-generation-skey-custom-valve-split-corrupted-suite'],
  ['comsol-multiphysics','comsol-solver-diagnostics-convergence-lu-factorization-memory-discretization'],
  ['cypecad','cypecad-seismic-design-compliance-ehe08-annex10-ductility-modal-dual-system'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
