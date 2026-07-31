const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['ironcad','ironcad-step-import-catalog-errors-scattered-parts-acis-pmi-registry-triball-sizebox-ap242'],
  ['ls-dyna','ls-dyna-instability-hourglass-errors-nan-negative-volume-contact-hourglass-energy-mass-scaling-implicit-convergence-energy-balance'],
  ['midas-gen','midas-gen-singular-errors-crash-troubleshooting-abnormal-displacement-end-releases-nan-material-dof-singular-automesh-cpp-graphics'],
  ['optitex','optitex-pds-import-crash-simulation-errors-dxf-astm-hpgl-plt-corruption-autosave-texture-gpu-oaff'],
  ['turbocad','turbocad-dwg-import-rendering-errors-block-backwards-lightworks-black-acis-trim-constraint-freeze-macos-crash-audit-recover'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
