const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['land-fx','land-fx-cad-errors-fatal-error-fxcad-2025-autocad-bug-updater-crashes-freezes-web-dialog-cloud-data-planting-errors-no-function-definition-lookup-unhandled-exception-xref-images-not-loading-plant-data-mismatch-verify-labels'],
  ['lantek-expert','lantek-expert-nesting-import-errors-invalid-header-data-dxf-dwg-version-mismatch-workshop-sheet-logo-not-printing-acercade-bmp-open-contours-superimposed-lines-machine-reassignment-modify-machine-nesting-plan-compatibility'],
  ['ls-dyna','ls-dyna-solver-convergence-errors-constraint-contact-crash-double-sided-penalty-contact-nonlinear-solver-failed-equilibrium-implicit-explicit-out-of-range-residual-timestep-isnan-negative-eigenvalues-mf2-material-model-penetrations-ignore'],
  ['ltspice','ltspice-simulation-convergence-errors-infinite-recursion-syntax-error-v24-update-parentheses-fix-time-step-too-small-parasitic-addition-simulation-lockup-ad8274-discrete-opamp-floating-nodes-capacitance-debugtran-net-name-plotting'],
  ['lumion','lumion-ray-tracing-crash-errors-artifacts-blotches-samples-denoiser-frequent-crash-nvidia-driver-dds-texture-non-divisible-4-project-recovery-effects-reverted-default-merge-project-black-scene-incompatible-files-version-match'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
