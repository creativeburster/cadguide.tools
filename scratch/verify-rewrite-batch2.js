const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['autodesk-netfabb','autodesk-netfabb-mesh-repair-damage-access-violation-stl-load-failures-degenerate-faces-appdata-floating-point'],
  ['browzwear','browzwear-vstitcher-crash-simulation-errors-trim-pattern-extra-large-lightning-bolt-dxf-grading-save-outfit-api'],
  ['cabinet-vision','cabinet-vision-cutlist-corruption-cnc-errors-negative-sheets-backup-freeze-update-3704-thm-crash-nesting'],
  ['exocad','exocad-dentalcad-margin-scan-import-errors-cutting-operation-antagonist-3shape-3oxz-itero-mesh-holes-model-creator-implant-library'],
  ['gibbscam','gibbscam-post-processor-5axis-errors-g682-transform-plane-post-line-overflow-render-crash-c-axis-orientation-fatal-post-error'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
