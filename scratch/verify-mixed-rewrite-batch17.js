const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['nanocad','nanocad-stability-compatibility-errors-fatal-error-crash-corrupted-dwg-recover-rmproxy-dwg2018-not-opening-free-v5-proxy-object-fatal-error-speexplodeall-file-loss-trial-expiry-pro11-trueview-dxf-proxy-graphics'],
  ['navisworks','navisworks-clash-detective-stability-errors-crash-grouping-clashes-not-maintaining-groups-2026-constant-crashing-drag-drop-search-set-fatal-error-clr-exception-freezing-grouping-all-tests-viewpoint-disappearing-sort-workaround'],
  ['onshape','onshape-import-export-assembly-errors-assembly-import-distortion-browser-crash-large-stl-obj-step-export-import-roundtrip-faulty-topology-micron-part-export-failed-shared-assembly-solidworks-hidden-suppressed-parts'],
  ['opencascade','opencascade-occt-brep-fillet-errors-segfault-chfi3d-builder-intersectmorecorner-stale-topology-missing-intersection-edges-brepcheck-subshapenotinshape-sewing-solidification-inconsistent-generated-modified-isdeleted-implicit-topology-natural-bounds'],
  ['openfoam','openfoam-solver-convergence-fsi-errors-floating-point-exception-leastsquaresvectors-mesh-motion-residuals-explode-fsi-simulation-crash-interface-decomposition-solid-solver-residuals-not-converging-chtmultiregionfoam-steady-state-not-stopping'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
