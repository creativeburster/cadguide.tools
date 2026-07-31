const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['blender','blender-large-scene-linking-geometry-nodes-viewport-performance-linking-worse-appending-eevee-next-regression-uv-linked-duplicates-asset-library-self-reference-collection-instance-missing'],
  ['clo-3d','clo-3d-avatar-dressing-fabric-simulation-export-errors-low-poly-retopology-blender-triangular-topology-buckling-stiffness-usd-export-garment-simulation-cache-file-corruption-disk-space-obj-jpeg-fabric'],
  ['corona-renderer','corona-renderer-fireflies-hdri-noise-displacement-flicker-sun-disk-highlight-clamping-light-samples-multiplier-world-size-nan-chrome-material-corona-11-interactive-clean-production-fireflies-denoiser'],
  ['draftsight','draftsight-pdf-import-export-layer-style-corruption-insert-object-blank-sheet-file-not-found-export-features-not-present-importpdf-missing-dimensionstyle-not-updating-layer-styles-corrupted-master-file'],
  ['drofus','drofus-revit-sync-room-data-management-duplicate-id-primary-key-group-options-link-status-unlinked-show-in-model-room-data-status-template-derived-from-tracking-deleted-rooms-large-project-filter-clears'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
