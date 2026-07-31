const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['msc-nastran','msc-nastran-fatal-9137-pivot-ratio-sol103-response-dynamics-mumps-4291-eqd4s-mat8-orthotropic-shear-modulus-bailout-open-core-memory-linux'],
  ['planbar','planbar-element-plan-crash-data-corruption-bt-assert-release-nmktlayoutcatcell-associative-view-conflict-rebar-extrusion-single-line-assemblying-group-bending-machine'],
  ['simcenter-star-ccm','simcenter-star-ccm-mesh-divergence-floating-point-errors-tetrahedral-polyhedral-trimmed-field-function-division-zero-boolean-subtraction-detach-amg-solver-divergence-bad-cells-interface'],
  ['tebis','tebis-post-processor-5axis-machining-errors-machine-configuration-onrewindmachine-performrewinds-cyclic-axis-optimizemachineangles-swarf-4axis-advanced-tcp-coordinates-safe-z'],
  ['worknc','worknc-post-processor-roughing-performance-errors-concatenated-file-number-composite-pp-name-separator-menu97-dat-ang-rest-machining-overmetal-contouring-edge-support-surface-scale-miniature'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
