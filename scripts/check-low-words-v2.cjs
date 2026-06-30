const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

function countWords(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const body = normalized.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Count all words including code blocks
  const noInline = body.replace(/`[^`]+`/g, 'code');
  const noMd = noInline.replace(/[#*_>\-|]/g, ' ');
  const words = noMd.split(/\s+/).filter(w => w.length > 0).length;
  return words;
}

const lowWordGuides = [
  'corelcad/corelcad-vs-autocad-feature-comparison-migration-guide.md',
  'qcad/qcad-vs-librecad-open-source-2d-cad-comparison.md',
  'qcad/qcad-javascript-scripting-automating-drawing-tasks-custom-tools.md',
  'qcad/qcad-block-libraries-part-management-reusable-components.md',
  'qcad/qcad-dimensioning-annotation-styles-tolerances-drawing-notes.md',
  'gstarcad/gstarcad-installation-licensing-silent-deploy-network-activation.md',
  'gstarcad/gstarcad-2d-drafting-workflow-interface-commands-dwg-compatibility.md',
  'gstarcad/gstarcad-lisp-automation-batch-processing-layer-management-commands.md',
  'gstarcad/gstarcad-performance-tuning-large-dwg-hardware-settings-system-variables.md',
  'progecad/progecad-lisp-programming-custom-tools-batch-processing-automation.md',
  'progecad/progecad-2d-drafting-autocad-compatible-workflow-template.md',
  'progecad/progecad-3d-modeling-basics-extrude-revolve-boolean-operations.md',
  'progecad/progecad-pdf-to-dwg-conversion-import-vectorize-cleanup.md',
  'progecad/progecad-vs-autocad-feature-comparison-cost-migration.md',
  'librecad/librecad-dxf-file-compatibility-autocad-cad-systems.md',
  'librecad/librecad-layer-management-block-libraries-organizing-components.md',
  'librecad/librecad-printing-pdf-export-scale-paper-size-configuration.md',
  'librecad/librecad-vs-qcad-choosing-open-source-2d-cad-tool.md',
  'turbocad/turbocad-2d-drafting-mechanical-design-interface-tools-dwg-workflow.md',
  'turbocad/turbocad-3d-modeling-solid-primitives-boolean-assembly-design.md',
  'turbocad/turbocad-parametric-constraints-2d-3d-design-automation.md',
  'turbocad/turbocad-vs-autocad-feature-comparison-pricing-migration.md',
  'varicad/varicad-assembly-design-constraints-bom-exploded-view.md',
  'varicad/varicad-sheet-metal-design-bending-unfolding-manufacturing-export.md',
  'varicad/varicad-vs-solidworks-feature-comparison-cost-analysis.md',
  'nanocad/nanocad-lisp-programming-custom-commands-entity-selection-automation.md',
  'draftsight/draftsight-macro-recording-batch-printing-automation.md',
  'vectorworks/vectorworks-vs-revit-bim-platform-comparison-architecture-design.md',
  'allplan/allplan-vs-revit-bim-platform-comparison-architecture-engineering.md',
  'bluebeam-revu/bluebeam-revu-vs-adobe-acrobat-construction-pdf-comparison.md',
  'bricscad/bricscad-licensing-deployment-network-silent-install.md',
  'bricscad/bricscad-lisp-automation-custom-commands-batch-processing.md',
  'cypecad/cypecad-vs-etabs-building-design-platform-comparison.md',
  'midas-civil/midas-civil-vs-sap2000-bridge-analysis-platform-comparison.md',
  'midas-gen/midas-gen-vs-etabs-building-analysis-platform-comparison.md',
  'sap2000/sap2000-vs-etabs-choosing-csi-analysis-tool-project.md',
  'staad-pro/staad-pro-editor-commands-text-modeling-automation-batch-processing.md',
];

console.log('Word count check (full count including code blocks):');
let stillLow = 0;
for (const g of lowWordGuides) {
  const filePath = path.join(GUIDES_DIR, g);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const wc = countWords(content);
    if (wc < 1000) {
      console.log(`  ${wc} words: ${g}`);
      stillLow++;
    } else {
      console.log(`  OK (${wc}): ${g}`);
    }
  } else {
    console.log(`  NOT FOUND: ${g}`);
  }
}
console.log(`\nStill under 1000: ${stillLow} of ${lowWordGuides.length}`);
