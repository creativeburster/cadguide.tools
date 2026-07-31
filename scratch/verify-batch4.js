const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['aspen-hysys','aspen-hysys-distillation-column-convergence-failure-diagnosis'],
  ['pam-stamp','pam-stamp-springback-simulation-parameters-best-practices'],
  ['quadcept','quadcept-pcb-design-verification-gerber-export-netlist-integration'],
  ['tekla-tedds','tekla-tedds-installation-calculator-error-fix-guide'],
  ['moldex3d','moldex3d-mesh-preprocessing-fix-wizard-non-matching-mesh-configuration'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
