const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['kisssoft','kisssoft-bearing-minimum-load-kisssys-load-spectrum-errors-bearing-warning-preload-clearance-life-difference-torque-rpm-coefficient-kissdesign-migration-system-module-agma-iso-operating-mode-kinematic-clutch-brake-power-flow'],
  ['kompas-3d','kompas-3d-export-solid-surface-assembly-performance-errors-boolean-boundary-edges-contour-tolerance-fillet-open-chain-split-edges-large-assembly-display-simplification-sheet-metal-bend-unfold-bend-table-export-settings-solids-transfer'],
  ['librecad','librecad-dxf-import-entity-selection-errors-dxf-cannot-open-windows-reinstall-libdxfrw-large-dxf-hatch-gap-non-closed-contours-qcad-leader-not-deleted-trueview-failure-duplicate-tool-bounding-box-select-first-dxf-version-ac1027-downgrade'],
  ['ltspice','ltspice-buck-converter-convergence-transient-errors-sic-mosfet-time-step-gate-oscillation-ir2104-synchronous-stuck-nmos-alternate-solver-bordodynov-op-operating-point-feedback-open-loop-nodeset-ltspice-24-convergence-bug-pfc-beta-uic-averaged-model'],
  ['lumion','lumion-ray-tracing-artifacts-blotches-crash-errors-artifacts-blotches-patchy-samples-denoiser-nvidia-577-crash-driver-rollback-3d-grass-reflective-2025.2-ocean-reflectivity-glass-water-moving-blotches-dark-bounces-radiance-caching'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
