const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['autodesk-robot','autodesk-robot-panel-fem-nonlinear-convergence-tension-only-cable-split-3d-solid-support'],
  ['bimcollab','bimcollab-bcf-plugin-connectivity-dll-revit-hotfix-https-offline-crash-timezone'],
  ['bluebeam-revu','bluebeam-revu-studio-session-sync-performance-timeout-pending-upload-stuck-grouped-markups'],
  ['cadworx','cadworx-isogen-generation-errors-pod-dll-freeze-log-permission-tolerance-start-path'],
  ['caesar-ii','caesar-ii-support-stiffness-nozzle-loads-divergence-friction-rigid-anchor-cnode'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
