const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['allegro-pcb','allegro-pcb-drc-constraint-manager-errors-dbdoctor-single-thread-noopengl-stale-drc-shape-spacing-external-rules'],
  ['alphacam','alphacam-nesting-post-processor-errors-subroutine-linear-anc-pgm-morbidelli-xilog-font-tracing-accurite-tool-direction'],
  ['esprit','esprit-post-processor-5axis-errors-dmu50-heidenhain-subprogram-not-licensed-security-manager-undefined-vocabulary-tcpc-pricing'],
  ['moi3d','moi3d-stl-export-boolean-errors-open-edges-stray-fillets-false-faces-non-planar-union-bsod-intel-driver-centroid-triangulation-non-manifold'],
  ['openfoam','openfoam-snappyhexmesh-parallel-errors-face-area-mismatch-cyclic-patches-decompose-methods-2d-mesh-motion-empty-patches-extrudemesh'],
  ['proteus-design-suite','proteus-simulation-crash-cpu-load-errors-access-violation-arduino-ntdll-pds-mcu-licensing-excess-cpu-mhz-backward-compatible-stack-overflow'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
