const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['ansys-workbench','ansys-workbench-designmodeler-script-error-corrupted-preferences-xml-appdata-reset-project-schematic-refresh-license-server-timeout-ansyslmd-ini-productconfig-reconfiguration'],
  ['ares-commander','ares-commander-crash-launch-opengl-graphics-driver-lisp-dcl-load-dialog-dwg-background-image-crash-ttr-ttt-circle-script-korean-language-parameter-flisp-editor'],
  ['aspen-hysys','aspen-hysys-column-non-convergence-over-specified-specs-two-liquid-phases-consistency-error-stages-drying-up-spec-errors-tolerance-feed-pressure-gravitational-head-flow-rate-reflux-ratio-water-removal'],
  ['autocad-plant-3d','autocad-plant-3d-2025-spec-viewer-empty-network-drive-catalog-builder-error-show-details-hyperlink-unable-load-spec-file-renamed-moved-auto-routing-different-size-connection-manager-no-connection-grv-fl-clamp-class'],
  ['autodesk-inventor','autodesk-inventor-2025-performance-slow-shared-project-browser-update-coreclr-net-runtime-crash-intel-gen-13-windows-11-24h2-avx-seh-compatibility-hang-crash-save-long-path-network-design-data-efficiency-mode-fntcache-registry-limit'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
