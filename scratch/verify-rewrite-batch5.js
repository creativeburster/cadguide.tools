const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['bobcad-cam','bobcad-cam-post-processor-posting-errors-v36-tool-list-output-tool-list-blank-window-cpp-redistributable-v25-absolute-ij-arc-block-222-clf-mfc140u'],
  ['crowncad','crowncad-text-scaling-dwg-import-sync-issues-text-explode-curves-sketch-zoom-dwg-insert-2026-r2-drawing-template-date-format-autosave-disconnection'],
  ['designspark-mechanical','designspark-mechanical-stl-export-crash-errors-free-tier-upgrade-cylinder-boolean-face-corrupted-config-appdata-fips-graphics-driver'],
  ['femap','femap-mesh-quality-nastran-fatal-errors-4297-eqd4d-element-quality-9058-plot-planar-9137-pivot-ratio-rigid-body-sol103-include-path-contact-convergence'],
  ['land-fx','land-fx-plant-manager-freeze-import-crash-errors-firewall-cloud-endpoint-nvidia-driver-security-software-dcl-slideview-arx-lookup-function'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
