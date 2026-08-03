const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['trimble-business-center','tbc-import-export-crash-traverse-angular-adjustment-csv-import-optionsvalidation-photogrammetry-child-process-sentinelone-rl-reduction-combined-traverses-cleanup-utility-closed-traverse-antivirus-whitelisting'],
  ['trimble-connect','trimble-connect-sync-failed-schedule-path-restrictions-desktop-ssl-tls-download-free-account-upload-lock-sync-manager-cloud-not-loading-syncdata-folder-deletion-schedule-path-relaxation-firewall-tls-configuration-sync-manager-update'],
  ['turbocad','turbocad-parallels-mac-crash-corrupted-ini-config-gdi-opengl-rendering-crash-reporting-diagnostics-floating-license-built-in-folder-deletion-default-workspace-reset-nvidia-amd-gpu-2025-sp1-update'],
  ['twinmotion','twinmotion-datasmith-export-root-folder-udatasmith-import-crash-collapse-modes-plugin-version-compat-datasmith-reload-crash-revit-missing-materials-unreal-engine-project-root-folder-keep-hierarchy-plugin-matching-update'],
  ['ultimaker-cura','ultimaker-cura-slicing-failed-corrupted-config-upgrade-usb-printing-plugin-material-settings-crash-tiled-infill-glibcxx-printer-definition-version-mismatch-config-folder-reset-plugin-disable-profile-backup-cache-clear'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
