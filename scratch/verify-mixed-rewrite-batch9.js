const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['allegro-pcb','allegro-pcb-library-link-padstack-errors-orcap-2434-footprint-missing-orcap-2435-pin-mismatch-case-sensitive-dbdoctor-batch-update-smd-pad-void-spmhcs-3-split-pad-replacing-padstacks-mandatory-drc'],
  ['alphacam','alphacam-nesting-toolpath-errors-multiple-copies-subroutine-linear-cannot-find-offset-path-circular-geometry-pocket-plunge-lead-in-slope-autoz-ramp-post-processor-004-address-rapid-traverse-feed-rate-blowout-advanced-toolpath-editor-slow-down-corners'],
  ['autodesk-dynamo','autodesk-dynamo-revit-2025-migration-crash-errors-old-graphs-null-ironpython2-cpython3-script-crash-revit-2025-incompatible-packages-unifi-content-catalog-conflict-multi-version-revit-separate-graphs-troubleshooting-null-freeze-debugging'],
  ['autodesk-netfabb','autodesk-netfabb-stl-repair-export-errors-repairs-lost-stl-export-3mf-windows-service-repair-hangs-free-netfabb-basic-wall-thickness-petal-geometry-cad-recreation-check-file-quality-degenerate-triangles-non-manifold-prusa-slicer-fusion-360-manufacture'],
  ['bobcad-cam','bobcad-cam-post-processor-posting-errors-v36-tool-list-commented-posting-window-blank-unmounted-cpp-redistributable-cl-file-not-found-old-version-grooving-g71-rapids-profile-g01-exception-calculation-routine-tolerance-step-over'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
