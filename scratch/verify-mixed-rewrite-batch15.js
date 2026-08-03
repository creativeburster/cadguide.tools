const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['magics','magics-stl-repair-support-errors-bad-edges-inverted-normals-autofix-manual-repair-thickened-support-empty-slices-brep-fillet-failure-import-hang-select-orientation-tree-support-incorrect-generation'],
  ['marvelous-designer','marvelous-designer-usd-export-unreal-engine-errors-invalid-input-lod0-chaos-cloth-asset-static-mesh-materials-translucent-usdimporttranslucentmaterial-shadow-artifacts-opaque-blend-mode-cloth-falls-physics-asset-export-splits-mesh-merge'],
  ['mastercam','mastercam-post-processing-parameter-errors-gcode-missing-ij-arcs-linearize-spline-4plus1-full-5axis-clearance-blend-spline-tool-numbers-feeds-speeds-ignored-common-parameters-post-not-recognized-2026-machine-definition-tombstone-hole-locations'],
  ['matrixgold','matrixgold-jewelry-design-errors-mysterious-logo-watermark-3d-printed-wax-quad-remesh-rhino-crash-trimming-curves-profile-editor-graph-desync-pasting-geometry-ring-resizer-odd-shapes-tolerance-dynamic-power-toggle'],
  ['meshlab','meshlab-mesh-processing-export-errors-fbx-glb-import-crash-export-crash-quadric-edge-collapse-decimation-non-manifold-edge-repair-not-persisting-stl-duplicate-faces-vertex-duplication-ply-large-model-crash-memory-exhaustion'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
