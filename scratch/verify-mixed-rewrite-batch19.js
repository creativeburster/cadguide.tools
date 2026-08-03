const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['planbar','planbar-precast-data-corruption-tim-export-errors-drawing-file-corruption-weeks-not-opening-tim-export-canceled-detailed-drawing-files-crash-double-click-middle-mouse-msa-reinforcement-group-crash-ifc-assistant-layer-validation'],
  ['progecad','progecad-dwg-compatibility-field-corruption-errors-title-block-fields-corrupt-save-2010-dwg-back-conversion-epermanenterased-crash-invalid-dwg-version-2007-format-geometry-misalignment-autocad-map-3d-drawings-not-opening-older-autocad-version-mismatch'],
  ['proteus-design-suite','proteus-design-suite-simulation-pcb-errors-gsm-sim800l-avr-program-property-not-defined-imported-component-missing-spice-models-hd44780-controller-received-command-whilst-busy-timestep-too-small-gmin-stepping-zone-overlap-pre-production-check'],
  ['prusaslicer','prusaslicer-pressure-advance-seam-quality-errors-pa-code-not-working-mk4s-incorrect-stock-pa-hf-nozzle-toolchanger-set-pressure-advance-advance-0-hardcoded-mk4-input-shaper-seam-scar-slicer-2-7-1-regression-calibration-speeds-acceleration'],
  ['radan','radan-nesting-unfolding-errors-automatic-tooling-report-cleared-too-often-auto-tooling-crash-clamp-dead-zone-overlapping-unfold-faces-flange-too-short-warning-auto-tooling-internal-profile-start-profile-common-cut-bug'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
