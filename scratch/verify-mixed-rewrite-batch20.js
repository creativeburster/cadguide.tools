const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['rhino','rhino-8-mac-render-mesh-crash-errors-render-mesh-broken-8-20-metal-regression-constant-crashes-rendered-view-cpu-render-switch-performance-stability-ui-bugs-crash-macos-update-material-rendering-slow-copy-paste-window-focus-switching'],
  ['revit','revit-2025-parameter-family-load-errors-shared-parameter-conflict-family-load-failure-crash-parameter-deletion-global-parameters-broken-groups-air-terminal-family-crash-network-calculations-schema-conflict-crash-upgraded-models'],
  ['robot-structural-analysis','robot-structural-analysis-solver-revit-integration-errors-access-violation-crash-revit-transfer-model-direct-integration-revit-2025-calculation-freeze-no-convergence-nonlinear-generate-model-destroys-calculation-bracing-intersection-release-overload'],
  ['sketchup','sketchup-2024-2025-memory-leak-crash-errors-macos-ram-usage-3d-spacemouse-memory-leak-ram-maxed-out-crash-exporting-images-new-render-engine-profile-builder-4-startup-crash-memory-not-freed-deleting-groups-multiple-documents-memory-leak'],
  ['solvespace','solvespace-handle-limit-constraint-solver-errors-handle-isnt-unique-32-bit-entity-handle-limit-solver-fails-angle-constraint-jumps-constraints-incompatible-large-object-unit-scaling-constraining-entities-previous-groups-linked-parts-import-ref'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
