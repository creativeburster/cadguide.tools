const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['hypermill','hypermill-5axis-collision-avoidance-multiblade-errors-collision-free-tool-angle-reference-job-multiblade-plunge-optional-module-smooth-overlap-lead-angle-rest-machining-version-2024-barrel-cutter-maxx-collision-check'],
  ['ijcad','ijcad-dwg-compatibility-large-drawing-performance-errors-trustdwg-hatch-scale-print-large-file-stability-layout-copy-viewport-offset-paper-margin-polygon-viewport-clip-freeze-crash-plot-single-character-text-dwg-to-pdf'],
  ['keycreator','keycreator-imported-model-repair-assembly-performance-errors-gap-precision-repair-problem-entities-boolean-face-face-intersection-diagnose-solids-healing-semitransparent-unset-material-multi-process-reading-file-cache-blend-chamfer-tangency'],
  ['keyshot','keyshot-gpu-mode-texture-mapping-errors-gpu-not-updating-windows-graphics-high-performance-rhino8-texture-maps-uv-testfillinlegacytexturecoordinates-gpu-crashes-geometries-area-light-flake-2024.2-nvlink-multi-gpu-driver-gpu-out-of-memory-cpu-textures'],
  ['kicad','kicad-altium-importer-pcb-workflow-errors-in8cu-non-existent-power-plane-mapping-schematic-pcb-link-lost-update-pcb-relink-silkscreen-text-size-position-zero-sized-th-pads-smd-plane-voids-python-footprint-library-drc'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
