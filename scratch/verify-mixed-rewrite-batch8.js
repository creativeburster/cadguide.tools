const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['mech-mind','mech-mind-calibration-point-cloud-matching-errors-board-not-detected-nano-ocb20-movement-mismatch-intrinsic-offset-poor-calibration-overexposure-smoothing-3d-matching-stl-normals-overlapped-poses-reference-frame'],
  ['mechanical-desktop','mechanical-desktop-dwg-migration-autocad-compatibility-errors-cannot-edit-mdt-autocad-mechanical-incompatible-dwg-wblock-purge-audit-incompatible-version-save-as-saved-outside-structured-objects-insert-purge-mdt-3d-export-dxf-inventor-migration'],
  ['medusa','medusa4-properties-window-3d-export-errors-properties-not-displayed-too-many-elements-positioning-step-export-personal-advanced-upgrade-3d-model-fe-software-step-interface-sheet-metal-parametrics-element-insertion-drawing-simplification'],
  ['microstation','microstation-dgn-reference-dwg-export-errors-nested-references-ignore-attachment-live-nesting-dgn-load-windows-update-self-reference-dwg-merge-cell-clipping-masks-retain-merge-portable-absolute-paths-relative-path-config-variables'],
  ['moldflow','moldflow-mesh-analysis-errors-blm-mesh-refine-mesh-not-passing-mesh-quantity-melt-flow-convergence-layers-beam-elements-temperature-distribution-3d-tetrahedral-ami-2026-meshing-fails-beam-cold-runner-error-220120-connection-node-merge'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
