const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['magi','magicad-revit-crash-ifc-export-errors-accessviolation-dataset-worksharing-support-hangers-crash-friction-loss-sprinkler-hazen-williams-darcy-weissbach-active-storey-duct-pipe-ifc-export-mchpv-arx-brx'],
  ['mastercam','mastercam-toolpath-regeneration-5axis-simulation-errors-slow-regeneration-stock-model-collision-5axis-simulation-nci-gcode-mismatch-machine-definition-optirrough-collision-gouging-stock-model-solid-body-simulator-collision-md-limits'],
  ['materialise-magics','materialise-magics-stl-repair-support-errors-thickened-supports-empty-slices-no-support-method-machine-setup-stl-errors-bad-edges-normals-holes-triangles-autofix-massive-stl-viewport-triangle-reduction-support-stl-cura-fdm'],
  ['matlab','matlab-simulink-simulation-performance-codegen-errors-referenced-model-solver-settings-foc-100khz-multirate-rate-transition-signal-delay-wrong-norm-accelerator-r2024b-assertion-variant-subsystem'],
  ['maxwell-render','maxwell-render-network-rendering-firefly-errors-firewall-tcp-udp-ports-mxi-merging-version-sync-antivirus-node-communication-fireflies-reflective-scene-denoiser-render-crash-ram-resolution-reduction'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
