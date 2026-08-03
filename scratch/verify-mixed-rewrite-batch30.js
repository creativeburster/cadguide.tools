const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['autodesk-robot','autodesk-robot-access-violation-c0000005-crash-revit-transfer-non-linear-convergence-tension-only-bars-generate-model-destroys-calculation-excessive-releases-contact-no-convergence-mesh-quality-steel-connection-crash-2024-hotfix'],
  ['autoform','autoform-springback-inaccuracy-isotropic-kinematic-hardening-process-description-secondary-operations-full-cycle-bem-eps-shell-element-material-card-cyclic-tension-compression-backdraft-geometric-compensation-coining-ts-11-thick-shell'],
  ['aveva-e3d-design','aveva-e3d-design-gui-recovery-crash-unsaved-database-pml-unset-pmlvar-ifc-property-import-dgn-unexpected-end-of-file-insufficient-memory-multicad-nwd-import-scale-bucketsize-model-simplification-session-recovery-3-1-10-fix'],
  ['bimcollab','bimcollab-bcf-live-connector-not-importing-comment-jumping-saving-mid-sentence-delete-key-deleting-issues-revit-bcf-manager-crash-family-environment-invalid-milestones-navisworks-bulk-import-auto-sync-23-5-1-june-2025-beta'],
  ['bluebeam-revu','bluebeam-revu-hangs-freezes-awcc-graphics-hook-stopped-working-corrupted-profile-periodic-freeze-recent-files-network-drive-slow-performance-rendering-engine-blurred-garbled-text-software-rendering'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
