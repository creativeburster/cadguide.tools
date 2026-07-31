const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['browzwear','browzwear-vstitcher-graphics-selection-errors-lightning-bolt-shattered-glass-graphics-card-unable-select-internal-elements-zoom-crashing-prolonged-use-wrong-colors-vector-artwork-glossy-fabric-vray-fur-material-mode'],
  ['cabinet-vision','cabinet-vision-cnc-nesting-dxf-output-errors-nested-pocketing-cutter-not-exiting-machine-optimizer-lead-out-door-reveals-premill-edgebanding-s2m-dxf-missing-operations-license-tool-not-found-machine-tool-id-64bit-migration-performance'],
  ['cad-exchanger','cad-exchanger-step-iges-conversion-import-errors-iges-brep-edge-connectivity-orientations-split-periodic-surfaces-defeaturing-round-off-precision-disappearing-compound-autocad-step-export-inventor-fusion360'],
  ['crowncad','crowncad-cloud-assembly-model-validation-errors-large-assembly-performance-part-state-refresh-invalid-faces-edges-check-entity-virtual-parts-converting-normal-geometry-analysis-problematic-entities-documentation-plugin-ecosystem'],
  ['designspark-mechanical','designspark-mechanical-export-3d-printing-errors-dwg-dxf-no-file-translator-dwg-dxf-missing-geometry-amf-obj-non-manifold-edges-slow-export-large-assemblies-dsm6-cannot-export-cura-stl-workaround'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
