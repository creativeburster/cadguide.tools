const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['freecad','freecad-assembly-topological-naming-errors-invalid-shape-name-tnp-sketcher-invalid-input-toponaming-windows-weekly-face-edge-ids-recompute-fillet-rectangle-hole-attachment-editor-assembly-joints-break-crash-selecting-sketch'],
  ['fusion-360','fusion-360-cloud-sync-import-errors-unable-import-cloud-upload-offline-toggle-uploads-delayed-stuck-queue-cancel-resave-design-not-yet-available-aws-crash-corruption-version-export-reimport-wlogin-cache-clear-ipt-step-online-converter-local-file-open'],
  ['gstar-cad','gstarcad-compatibility-stability-errors-opendcl-crash-docking-bar-pin-button-dwg-file-association-windows-menus-toolbars-disappear-windows-update-settings-reset-autolisp-incompatibility-api-transient-graphics-memory-corruption-grx-workaround'],
  ['hyperworks','hyperworks-mesh-solver-errors-hypermesh-2025-session-freeze-file-menu-import-fsi-tcp-socket-write-error-mesh-distortion-fluid-element-size-invalid-argument-solver-export-hwx-crash-ossmooth-application-crash-importing-model-after-results'],
  ['icem-surf','icem-surf-export-surface-modeling-errors-export-alias-catia-v5-edf-name-shortening-modify-patch-trim-poor-performance-2025-extrapolate-rational-surface-weight-mismatch-fillet-alias-2017-catpart-import-cos-trimmed-surfaces-2025-bug-fixes'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
