const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['3ds-max','3ds-max-vray-proxy-large-scene-performance-optimize-instances-voxel-16000-proxies-network-load-updating-instances-freeze-coronabitmap-slow-save-embree-geometry-rebuild'],
  ['altair-inspire','altair-inspire-polynurbs-fit-crash-topology-optimization-cad-export-gaps-non-design-contacts-lattice-additive-manufacturing-motion-over-constrained-joints-loads-design-space'],
  ['altium-365','altium-365-codesigner-ecad-mcad-sync-errors-speedpak-no-document-internal-id-mismatch-common-comp-folder-addalu-items-permissions-negative-coordinates-decal-graphics'],
  ['archicad','archicad-ifc-import-geometry-errors-publisher-pdf-hang-general-import-parametric-construction-brep-morphs-objects-vector-fill-overload-property-mapping-hybrid-hotlink-module-revit'],
  ['bambu-studio','bambu-studio-custom-profile-pressure-advance-calibration-errors-profiles-disappearing-second-x1c-ams-sync-default-020-manage-result-custom-name-power-cycle-a1-p2s-k-values-flow-dynamics-overrides'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
