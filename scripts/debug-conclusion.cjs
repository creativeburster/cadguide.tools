const fs = require('fs');
const path = require('path');

const files = [
  'allplan/allplan-vs-revit-bim-platform-comparison-architecture-engineering.md',
  'cypecad/cypecad-vs-etabs-building-design-platform-comparison.md',
  'midas-civil/midas-civil-vs-sap2000-bridge-analysis-platform-comparison.md',
  'midas-gen/midas-gen-vs-etabs-building-analysis-platform-comparison.md',
  'sap2000/sap2000-vs-etabs-choosing-csi-analysis-tool-project.md',
  'staad-pro/staad-pro-editor-commands-text-modeling-automation-batch-processing.md',
];

for (const f of files) {
  const fp = path.join('src', 'content', 'guides', f);
  const c = fs.readFileSync(fp, 'utf-8');
  const lines = c.split('\n');
  console.log('\n=== ' + f + ' ===');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Conclusion') || lines[i].includes('Regional') || lines[i].includes('Workflow') || lines[i].includes('Construction') || lines[i].includes('Code Support') || lines[i].includes('Modeling') || lines[i].includes('Automation')) {
      console.log(i + ': ' + lines[i].substring(0, 80));
    }
  }
}
