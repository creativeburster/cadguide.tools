const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['mastercam','mastercam-toolpath-verify-errors-5-axis-threadmill-3-axis-post-mc26-drilling-engraving-regeneration'],
  ['openscad','openscad-cgal-rendering-errors-nef-polyhedron3-non-manifold-stl-winding-order-coincident-faces-cache-manifold'],
  ['risa-3d','risa-3d-instability-pdelta-failures-end-releases-hinge-pinned-node-tension-only-ghost-reactions'],
  ['simplify3d','simplify3d-slicing-crashes-model-errors-v5-coasting-wipe-cannot-slice-rotated-zero-thickness-978mb-gpu-visual-cpp'],
  ['ultimaker-cura','ultimaker-cura-slicing-engine-errors-polyclipping-randomize-infill-localhost-antivirus-surface-mode-tiledinfill'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
