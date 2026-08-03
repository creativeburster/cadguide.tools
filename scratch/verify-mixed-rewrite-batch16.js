const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['microstation','microstation-connect-edition-stability-errors-constant-crash-opening-dgn-files-dgn-to-dwg-conversion-crash-memory-raster-manager-wmts-attachment-hang-save-settings-filedesign-crash-obj-file-open-reference-attach-crash'],
  ['midas-gen','midas-gen-structural-analysis-errors-displacement-abnormal-boundary-conditions-beam-end-releases-nonlinear-time-history-zero-section-wireframe-error-2103-convergence-initial-stiffness-multilinear-elastic-link-zero-stiffness-dof-singular-pin-pin'],
  ['moi3d','moi3d-nurbs-import-export-errors-step-export-tube-bender-split-closed-surfaces-step-import-seam-crossing-v5-cad-exchanger-solid-import-naked-edges-alibre-fbx-import-polygon-subd-stp-bevel-corner'],
  ['moldex3d','moldex3d-simulation-solver-errors-random-analysis-failure-intel-cpu-instability-error-4000-cooling-non-matching-mesh-high-shear-rates-ptt-viscoelastic-license-task-exceeded-symmetry-mesh-preprocessing-crash-2025-r1'],
  ['moldflow','moldflow-insight-solver-mesh-errors-warning-302105-flow-converge-sequential-valve-gate-hot-runner-analysis-stuck-0-error-220120-no-connection-beam-tetrahedral-cool-failed-insufficient-ram-blm-mesh-refine-mesh'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
