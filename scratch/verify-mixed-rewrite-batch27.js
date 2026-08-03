const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['3dexperience','3dexperience-solidworks-connection-error-upgrade-mysession-freeze-large-assembly-conversion-performance-multi-config-save-delays-xcad-connector-reinstall-trusted-sites-async-refresh-dynamic-tree-clean-reinstall'],
  ['abaqus','abaqus-contact-sdi-tetrahedral-corner-node-zero-force-overclosure-interference-fit-penalty-hard-contact-overconstraint-surface-mesh-crack-node-stuck-surface-to-surface-penalty-small-sliding'],
  ['actcad','actcad-lisp-visual-lisp-vl-vla-vlax-vlr-unsupported-bedit-dynamic-block-crash-open-command-hang-move-slow-graphics-zoom-pan-cancel-intellicad-13-1-oda-sdk-update'],
  ['alibre-design','alibre-design-assembly-hang-open-inventor-import-scale-1-10-path-pattern-crash-orphaned-process-autokill-sheet-metal-invalid-part-drawing-crash-v28-sp3-sp4-constraint-fix-crash-recovery'],
  ['allplan','allplan-ifc-export-wrong-level-bimplus-slab-conversion-2025-loses-references-ifc-2x3-dedicated-exporter-bugs-import-ignored-elements-defective-data-multiple-building-instance-tga-2025-0-3-hotfix-data-healer-standard-export'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
