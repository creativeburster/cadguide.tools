const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['vectorworks','vectorworks-large-file-performance-lag-freeze-out-of-memory-apple-silicon-mac-crash-project-sharing-commit-freeze-ifc-import-crash-file-optimization-memory-management-clean-reinstall-project-sharing-repair-sp4-update-fixes'],
  ['velux-daylight-visualizer','velux-daylight-visualizer-dwg-import-missing-layers-obj-import-no-materials-open-geometry-extremely-light-scale-units-mismatch-sketchup-triangulation-layer-assignment-material-export-geometry-closure-scale-factor-face-triangulation'],
  ['vray','vray-gpu-cuda-error-700-719-optix-7900-memory-leak-driver-vfb-region-crash-rt-cuda-dll-crash-standalone-vrscene-crash-recommended-driver-clean-install-progressive-sampler-gpu-lc-workaround-memory-optimization'],
  ['ventuz','ventuz-designer-multi-gpu-crash-startup-license-manager-wrong-installation-code-cluster-tdr-timeout-crash-bmd-decklink-board-crash-dataportal-async-validation-failure-gpu-reduction-license-re-registration-tdr-registry-board-update-scene-repair'],
  ['vericut','vericut-spindle-off-collision-broaching-tapping-cutter-comp-not-activated-false-collision-fixture-c-axis-spindle-off-override-broaching-not-cutting-ctl-config-process-cutter-comp-model-replacement-macro-override-dxf-sweep'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
