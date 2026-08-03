const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['substance-painter','substance-painter-startup-crash-tdr-gpu-timeout-bake-crash-uv-tile-errors-export-crash-gpu-driver-compatibility-registry-tdr-fix-disable-raytracing-ryzen-bios-update-uv-tile-mask-refresh-insufficient-disk-space-corruption'],
  ['surfcam','surfcam-post-processor-gcode-errors-arc-move-format-unsupported-commands-multiple-motion-modes-legacy-operation-migration-mpost-spost-configuration-grbl-compatibility-modal-gcode-correction-pocket-roughing-legacy-migration'],
  ['t-flex-cad','t-flex-cad-3d-projection-crash-dwg-import-errors-large-assembly-freeze-hatch-position-placement-freeze-dxf-dwg-non-parametric-import-system-stability-projection-algorithm-fixes-assembly-loading-optimization-import-parameter-configuration'],
  ['target-3001','target-3001-pcb-design-signal-island-short-circuit-ground-plane-island-orphan-autorouter-suboptimal-routing-star-ground-short-circuit-alert-schematic-signal-island-without-ref-pin-drc-check-island-deletion-router-strategy-signal-name-verification'],
  ['tebis','tebis-cam-collision-check-5-axis-avoidance-milling-cad-import-catia-3dxml-nc-job-recalculation-sister-tool-automatic-change-cnc-simulator-digital-twin-machine-head-collision-prevention-postprocessor-synchronization-tool-life-management'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
