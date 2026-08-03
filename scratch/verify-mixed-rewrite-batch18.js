const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['openscad','openscad-stl-export-import-errors-assertion-failure-rotate-extrude-degenerate-triangle-export-button-macos-15-nondeterministic-assertion-manifold-backend-non-manifold-import-crash-nullptr-corrupted-binary-stl-stdout-buffered-output'],
  ['optitex','optitex-pds-crash-3d-simulation-errors-outer-notch-internal-piece-view-fabric-cannot-turn-off-pieces-disappear-3ddi-export-nvidia-settings-stitches-not-visible-3d-window-bending-field-empty-hqr-oaff-file-load-hangs-o-cloud-link'],
  ['orcad','orcad-presto-constraint-manager-errors-daily-crashes-sync-failures-rules-reset-design-sync-cmavp-2-error-editing-constraints-nested-net-group-modify-delete-csv-import-single-worksheet-tcfx-technology-file'],
  ['pam-stamp','pam-stamp-springback-solver-errors-convergence-failure-implicit-solver-upper-pad-stop-criterion-distance-detection-springback-accuracy-damping-value-integration-points-mesh-strategy-springback-compensation-solver-selection-smp-dp-advanced-implicit'],
  ['pconplanner','pconplanner-performance-display-errors-application-error-crash-outdated-gpu-drivers-drawing-parts-disappear-zooming-ucs-distance-slow-performance-3d-warehouse-overload-dedicated-gpu-not-used-laptops-second-monitor-crash-graphics-memory-shortage'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
