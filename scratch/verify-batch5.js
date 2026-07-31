const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['autoform','autoform-simulation-accuracy-pareto-principle-force-correlation-springback'],
  ['aveva-e3d-design','aveva-e3d-database-claims-flushes-cable-routing-errors'],
  ['msc-patran','msc-patran-imported-geometry-cleanup-congruency-mesh-repair'],
  ['pulsonix','pulsonix-pcb-migration-altium-kicad-import-filters-feature-gaps'],
  ['pv-elite','pv-elite-asme-code-compliance-mdmt-wrc107-lug-hydrotest-issues'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
