const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['dwg-fastview','dwg-fastview-mobile-cad-viewer-errors-pc-v950-crash-launch-uninstall-v940-reinstall-drawings-not-opening-memory-whatsapp-drawings-bug-icloud-cloud-storage-free-features-subscription-paywall-premium-alternative-apps'],
  ['esprit','esprit-cam-post-processor-dnc-errors-undefined-vocabulary-custom-format-dnc-rs232-haas-baud-rate-cable-pinout-4axis-toolpath-tangent-entry-position-p70-arc-endpoint-deviation-ivalue-post-processor-subspindle-work-plane-mirror-image-work-offset'],
  ['exocad','exocad-dental-cad-scan-import-design-errors-3shape-trios-3oxz-import-xml-error-stl-ply-individual-dies-hide-show-box-missing-prep-files-unable-load-scan-data-duplicate-only-die-scan-adjacent-tooth-margin-line-stl-export-web-share'],
  ['femap','femap-fea-mesh-solver-errors-mesh-repair-rogue-nodes-meshing-toolbox-user-fatal-316-blseg-connection-region-fatal-9137-plate-bonding-pivot-ratios-sol103-elemental-errors-tria-4-nodes-mesh-distortion-mapped-mesh-biasing'],
  ['foran','foran-shipbuilding-cad-errors-non-windows-interface-steep-learning-curve-unix-heritage-poor-3d-model-import-export-weak-geometry-kernel-heavy-system-resource-oracle-database-poor-documentation-vendor-training-shipconstructor-cadmatic-comparison'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
