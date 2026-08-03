const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['altair-hyperworks','altair-hypermesh-2025-tetra-jacobian-error-v14-segmentation-crash-startup-2026-imprint-crash-fem-export-freeze-nsml1-element-set-settings-reset'],
  ['altium-designer','altium-designer-datamodel-dll-crash-routing-polygon-repour-unrouted-net-dead-copper-drc-zero-area-clearance-error-same-net-hidden-track-teardrop-zero-width-board-region-missing-stackup-health-check-monitor'],
  ['ansys-discovery','ansys-discovery-gpu-out-of-memory-explore-license-firewall-port-443-amd-card-disabled-nvidia-maxwell-prerequisite-check-driver-528-33-system-compatibility-livegx'],
  ['ansys-fluent','ansys-fluent-amg-divergence-mesh-skewness-udf-sigsegv-thread-pointer-eulerian-multiphase-dynamic-mesh-negative-cell-volume-quad-tri-remeshing-udf-density-divergence-initialization-pressure-far-field-pressure-outlet'],
  ['ansys-mechanical','ansys-mechanical-wbu-crash-startup-intel-compiler-dll-system32-mesh-script-80004005-productconfig-ipv6-localhost-intel-integrated-graphics-nvidia-control-panel-appdata-reset'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
