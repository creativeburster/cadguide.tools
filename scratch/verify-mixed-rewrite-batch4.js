const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['featurecam','featurecam-stock-model-dmk-toolpath-errors-5axis-simulation-workpiece-repositioned-round-stock-offset-oversized-dmk-tpdmk01-depth-overridden-casting-multibody-solid-uccnc-post-processor-fanuc-xbuild'],
  ['freecad','freecad-topological-naming-techdraw-errors-assembly-invalid-shape-name-2d-references-corrupt-sketch-edit-auto-update-link-array-wrong-dimensions-globalplacement-external-geometry-master-skills-nested-applink-stdpart-offset'],
  ['fusion-360','fusion-360-cloud-sync-joint-timeline-errors-slow-uploads-collaborator-network-diagnostic-nvidia-driver-clean-reinstall-joints-failing-update-lost-references-timeline-isolation-assembly-constraints-joints-cloud-sync-stuck-q-folder-offline-team-hub'],
  ['gstar-cad','gstar-cad-lisp-compatibility-dwg-pdf-export-errors-lisp-not-loading-unicode-lispsys-dwg-pdf-plot-style-monochrome-ctb-hatch-patterns-search-path-command-aliases-gacd-pgp-migrated-settings-import-batch-plot-not-merging'],
  ['hexagon-pc-dmis','hexagon-pc-dmis-cad-alignment-true-position-legacy-datum-d1-d2-d3-axis-mismatch-cad-refuses-align-reality-cad-part-point-cloud-best-fit-plane-alignment-upside-down-z-transform'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
