const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['inventor','inventor-2025-assembly-errors-crash-finish-edit-multi-monitor-dpi-update-save-loop-model-state-constraints-not-working-part-edit-reboot-parts-not-moving-one-constraint-design-doctor-ilogic-click-drag-defer-update'],
  ['inventor-cam','inventor-cam-post-processor-toolpath-errors-g01-instead-g03-2024-update-tolerance-referenceerror-version-mismatch-haas-ngc-supportedfeatures-previous-post-revision-trunnion-machine-configuration-empty-toolpath-machine-crash-2025-update'],
  ['ironcad','ironcad-2025-stability-export-errors-crash-hole-table-54-150-holes-sp1-step-export-missing-parts-catia-part-hangs-selection-dwg-export-failure-pu1-sp1-assembly-icc-cannot-drag-out-crash-recovery'],
  ['keycreator','keycreator-modeling-display-errors-models-wireframe-body-corruption-clean-body-step-reimport-solids-semitransparent-material-prt-ckd-conversion-cadkey-import-gap-precision-mismatch-repair-pdf-export-sp1'],
  ['kompas-3d','kompas-3d-assembly-file-recovery-errors-assembly-crash-rebuild-top-down-save-before-rebuild-invalid-file-structure-open-with-verification-dxf-dwg-export-failure-verification-repair-lost-link-variable-fatal-error-cax-geometry-graphics-override-registry'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
