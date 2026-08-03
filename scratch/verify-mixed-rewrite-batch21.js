const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['solid-edge','solid-edge-2025-crash-performance-errors-random-crashes-outdated-bios-drivers-sp8-crash-3dconnexion-driver-conflict-update-10-table-edit-crash-regression-very-slow-performance-network-links-onedrive-crash-open-create-file-user-profile-corruption'],
  ['solidworks','solidworks-2024-2025-stability-crash-errors-crash-ctrl-copy-drag-view-clr-dll-sp0-crash-opening-drawing-annotationwpf-sp5-crash-file-new-missing-drawing-template-crash-custom-library-mate-references-gpu-tdr-hard-system-crash-lenovo-p16-nvidia'],
  ['spacedesign','spacedesign-sketchup-plugin-report-pdf-errors-bug-splats-attribute-window-version-incompatibility-3d-pdf-creation-crash-ifxcominitialize-system-memory-request-failed-win32-api-load-error-64bit-mismatch-sketchup-2015-migration-module-name-change'],
  ['spacemaker','spacemaker-forma-import-revit-integration-errors-georeferenced-dxf-wrong-position-autocad-geo-command-revit-connectivity-failure-side-by-side-add-in-weird-terrain-nextgen-project-north-true-north-misalignment-geolocation-missing-add-in-v0917-rollback'],
  ['spatial','spatial-acis-boolean-modeling-kernel-errors-boolean-fail-near-coincident-faces-edgecoin-problem-ds-bad-geom-condition-vertex-gap-errors-asat-file-load-failure-complex-sharing-structure'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
