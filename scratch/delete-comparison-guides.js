const fs = require('fs');
const path = require('path');

const deleteList = [
  'autodesk-netfabb/autodesk-netfabb-vs-meshmixer-vs-magics-stl-repair-comparison.md',
  'browzwear/browzwear-vs-clo-3d-vs-marvelous-designer-comparison.md',
  'edgecam/edgecam-vs-mastercam-comparison-job-shop.md',
  'exocad/exocad-vs-3shape-vs-cerec-dental-cad-comparison.md',
  'gstarcad/gstarcad-vs-autocad-feature-comparison-performance-migration.md',
  'kompas-3d/kompas-3d-vs-solidworks-comparison.md',
  'ls-dyna/ls-dyna-vs-abaqus-explicit-solver-comparison-crash-impact.md',
  'mastercam/mastercam-vs-gibbscam-vs-camworks-cam-comparison.md',
  'matrixgold/matrixgold-vs-rhinogold-vs-jewelcad-pro-comparison.md',
  'midas-gen/midas-gen-vs-etabs-building-analysis-platform-comparison.md',
  'nanocad/nanocad-vs-autocad-lt-feature-comparison-migration.md',
  'progecad/progecad-vs-autocad-feature-comparison-cost-migration.md',
  'simscale/simscale-vs-desktop-cae-cloud-on-premise-simulation-comparison.md',
  'varicad/varicad-vs-solidworks-feature-comparison-cost-analysis.md',
  'cabinet-vision/cabinet-vision-vs-sketchup-vs-mozaik-cabinet-design-comparison.md',
  'draftsight/draftsight-vs-autocad-feature-comparison-migration.md',
  'drofus/drofus-vs-revit-schedules-bim-data-management-comparison.md',
  'dwg-trueview/dwg-trueview-vs-autocad-viewer-free-dwg-comparison.md',
  'easyeda/easyeda-vs-kicad-pcb-design-comparison-free-tool.md',
  'gibbscam/gibbscam-vs-mastercam-comparison-small-shop.md',
  'infraworks/autodesk-infraworks-vs-civil-3d-comparison-workflow.md',
  'keycreator/keycreator-vs-autocad-manufacturing-comparison.md',
  'openscad/openscad-vs-freecad-open-source-comparison.md',
  'optitex/optitex-vs-gerber-accumark-vs-lectra-modaris-comparison.md',
  'orcad/orcad-vs-altium-designer-pcb-comparison.md',
  'solibri/solibri-office-vs-solibri-site-license-comparison.md',
  'solibri/solibri-vs-navisworks-bim-coordination-clash-detection-comparison.md',
  'turbocad/turbocad-vs-autocad-feature-comparison-pricing-migration.md',
  'vectorworks/vectorworks-vs-revit-bim-platform-comparison-architecture-design.md',
  'ironcad/ironcad-vs-ironcad-draft-3d-2d.md',
];

const baseDir = 'f:/cadguide.tools/src/content/guides';
let deleted = 0;
for (const rel of deleteList) {
  const fpath = path.join(baseDir, rel);
  if (fs.existsSync(fpath)) {
    fs.unlinkSync(fpath);
    deleted++;
    console.log('Deleted: ' + rel);
  } else {
    console.log('NOT FOUND: ' + rel);
  }
}
console.log('\nTotal deleted: ' + deleted);
