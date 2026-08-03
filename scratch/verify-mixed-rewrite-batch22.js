const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['speedikon','speedikon-openbuildings-ifc-export-dwg-reference-errors-ifc-export-missing-property-mapping-dwg-reference-line-style-scale-dwg-font-substitution-missing-shx-dgn-to-dwg-line-style-drop-dwg-units-warning-manual-units-setting'],
  ['spiral-modeler','spiral-modeler-tekla-spiral-beam-camworks-spiral-machining-errors-spiralbeamdataexception-datamissing-definitionpointstooclose-zero-total-rise-camworks-spiral-in-toolpath-cutting-width-ignored-fusion-360-spiral-toolpath-contact-point-boundary-dive'],
  ['spitfire','spitfire-project-management-file-data-errors-sov-workbook-data-set-not-ok-word-file-not-found-sflink-lock-timeout-cannot-open-word-excel-chromium-browser-integrity-check-report-xts-project-task-sync-error-empty-task-id-cost-code-fix'],
  ['star-ccm','star-ccm-solver-divergence-gpu-errors-amg-solver-diverged-arm-linux-segregated-species-nan-residuals-floating-point-error-non-finite-residual-continuity-gpu-acceleration-calculation-stuck-amg-solver-divergence-first-iteration'],
  ['steel-beam-designer','steel-beam-designer-calculation-errors-tekla-unconservative-single-angle-beam-risa-3d-negative-hp-singly-symmetric-beams-tekla-beam-partial-fixity-force-error-ram-web-opening-tee-buckling-display-staad-pro-chs-shear-area-underestimation'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
