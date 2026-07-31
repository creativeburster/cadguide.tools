const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['camworks','camworks-toolpath-generation-crash-rebuild-volumill-wrap-180-gouge-contour-compensation-techdb'],
  ['carlson-survey','carlson-survey-field-to-finish-coordinate-import-wrong-layer-truncation-scale-empty-collector-code-conversion'],
  ['chief-architect','chief-architect-performance-roof-generation-network-drive-multi-monitor-auto-roof-return-library-crash-truss-overlap'],
  ['cimatron','cimatron-crash-mold-parting-e16-quicksplit-open-solid-eco-reanalyze-assembly-parting-activation'],
  ['diptrace','diptrace-gerber-export-autorouter-truetype-font-default-trace-width-plane-net-panelized-trace-custom-mask'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(`${s} | cat:${data.category} | src:${data.sources.length} | miss:${miss.length ? miss.join(',') : 'none'}`);
}
