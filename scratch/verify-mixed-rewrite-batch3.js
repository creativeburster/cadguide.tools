const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['dwg-trueview','dwg-trueview-pdf-export-batch-plot-errors-export-does-nothing-preset-plot-blank-plot-command-batch-plot-black-white-monochrome-ctb-page-setup-not-saved-cannot-write-dwg-extents-model-space-custom-plot-style-installation'],
  ['eagle','eagle-pcb-custom-footprint-drc-gerber-errors-pad-overlapping-annular-ring-complex-footprint-polygon-connection-unrouted-paths-tht-not-metalized-cutout-isolation-overlap-without-schematic-name-command-gerber-solder-mask-bga'],
  ['edgecam','edgecam-feature-finder-3d-machining-performance-line-selection-solids-wireframe-toolpath-calculation-stl-regeneration-rest-roughing-offset-retracts-stl-workaround-full-5axis-overwhelming-parameters-waveform-slow-single-part'],
  ['enscape','enscape-custom-asset-library-hdri-skybox-errors-sourcedirectory-not-exist-local-folder-assets-not-showing-post-upgrade-save-as-new-folder-import-scale-metric-fbx-hdri-cannot-scale-model-scale-location-not-recognized-cloud-network'],
  ['eplan-electric-p8','eplan-electric-p8-migration-parts-database-export-errors-excel-column-mapping-embedded-images-xrefs-fixed-paths-macro-edz-mdb-ema-dwg-old-dwg-electrical-logic-exploded-blocks-project-files-apply-project-defaults'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
