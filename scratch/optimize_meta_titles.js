const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

const replacements = {
  // Main toolbox page
  'src/app/toolbox/page.tsx': 'CAD & BIM Toolbox: Free Online Calculators',

  // Calculators & wizards
  'src/app/toolbox/3d-printing-chordal-deviation/page.tsx': '3D Printing Chordal Deviation Calculator',
  'src/app/toolbox/autocad-registry-clean-generator/page.tsx': 'AutoCAD Clean Registry Batch Generator',
  'src/app/toolbox/autocad-vs-gstarcad-shortcuts/page.tsx': 'AutoCAD vs GstarCAD Shortcuts Diff Table',
  'src/app/toolbox/autocad-vs-zwcad-shortcuts/page.tsx': 'AutoCAD vs ZWCAD Shortcuts Diff Guide',
  'src/app/toolbox/beam-deflection-structural-calculator/page.tsx': 'Steel I-Beam Deflection Calculator',
  'src/app/toolbox/cad-limits-checker/page.tsx': 'CAD Limits & Grid Boundary Calculator',
  'src/app/toolbox/cad-scale-list-reset-helper/page.tsx': 'CAD Scale List Reset LISP Helper',
  'src/app/toolbox/color-rgb-to-aci-matchbox/page.tsx': 'Hex/RGB to ACI Color Converter',
  'src/app/toolbox/ctb-plot-style-pen-visualizer/page.tsx': 'CAD CTB Plot Style Pen Visualizer',
  'src/app/toolbox/drawing-lag-performance-cleaner/page.tsx': 'Slow DWG Performance LISP Cleaner',
  'src/app/toolbox/duct-size-friction-loss-calculator/page.tsx': 'HVAC Air Duct Sizing & Friction Loss',
  'src/app/toolbox/dwg-version-checker/page.tsx': 'AutoCAD DWG Version Checker Matrix',
  'src/app/toolbox/dxf-watermark-layer-parser/page.tsx': 'DXF Watermark Detector & Layer Parser',
  'src/app/toolbox/flexlm-concurrent-seats-queue/page.tsx': 'FLEXlm Concurrent License Optimizer',
  'src/app/toolbox/flexlm-debug-log-analyzer/page.tsx': 'FLEXlm License Log Offline Analyzer',
  'src/app/toolbox/flexlm-error-15-debugger/page.tsx': 'FLEXlm License Error -15 Troubleshooter',
  'src/app/toolbox/k-factor-calculator/page.tsx': 'Sheet Metal K-Factor Calculator',
  'src/app/toolbox/limits-and-fits-calculator/page.tsx': 'ISO 286 Limits and Fits Calculator',
  'src/app/toolbox/missing-regapp-cleaner-batch/page.tsx': 'AutoCAD Regapp LISP Cleaner Generator',
  'src/app/toolbox/pipe-friction-head-loss/page.tsx': 'Pipe Flow Friction Head Loss Calculator',
  'src/app/toolbox/screw-torque-preload-calculator/page.tsx': 'Bolt Tightening Torque & Preload Tool',
  'src/app/toolbox/shortcuts/page.tsx': 'Ultimate CAD Shortcuts Comparison Sheet',
  'src/app/toolbox/spring-force-rate-calculator/page.tsx': 'Helical Compression Spring Calculator',
  'src/app/toolbox/thread-drill-size-calculator/page.tsx': 'Thread Tap & Drill Size Calculator',
  'src/app/toolbox/viewport-scale-factor-converter/page.tsx': 'CAD Viewport Scale Factor Converter',
  'src/app/toolbox/weld-strength-calculator/page.tsx': 'Fillet Weld Strength & Load Capacity',
  'src/app/toolbox/pdf-plot-chinese-gibberish-resolver/page.tsx': 'CAD PDF Chinese Font Scrambled Text Fixer',
  'src/app/toolbox/fatal-error-diagnostic-wizard/page.tsx': 'AutoCAD Fatal Error & Crash Log Diagnostic',

  // Third party tools
  'src/app/toolbox/cloud-bim-rvt-to-ifc-converter/page.tsx': 'Best Revit RVT to IFC Converters Online',
  'src/app/toolbox/cloud-dwg-drawing-recovery-service/page.tsx': 'Best Online DWG Recovery & Repair Services',
  'src/app/toolbox/cloud-dwg-to-step-iges-converter/page.tsx': 'Best DWG to STEP/IGES Online Converters',
  'src/app/toolbox/cloud-dxf-to-gcode-laser-converter/page.tsx': 'Best DXF to CNC G-Code Laser Converters',
  'src/app/toolbox/online-3d-cad-viewer-collaborator/page.tsx': 'Best 3D CAD/BIM Online Viewers Review',
  'src/app/toolbox/online-cad-license-audit-shield/page.tsx': 'Best CAD Software License Audit Shield',
  'src/app/toolbox/online-dgn-to-dwg-converter/page.tsx': 'Best DGN to DWG Online Converters Review',
  'src/app/toolbox/online-dwg-compare-diff-viewer/page.tsx': 'Best Online DWG Compare & Diff Tools',
  'src/app/toolbox/online-dwg-layer-splitter-cloud/page.tsx': 'Best Online DWG Layer Splitter Tools',
  'src/app/toolbox/online-dwg-to-dxf-batch-converter/page.tsx': 'Best DWG to DXF Bulk Online Converters',
  'src/app/toolbox/online-dwg-to-pdf-cloud-printer/page.tsx': 'Best DWG to Vector PDF Online Printers',
  'src/app/toolbox/online-dwg-version-downgrader-cloud/page.tsx': 'Best DWG Version Downgraders Online',
  'src/app/toolbox/online-dxf-text-translator-cloud/page.tsx': 'Best DXF/DWG Online Text Translators',
  'src/app/toolbox/online-ifc-viewer-validator/page.tsx': 'Best Online IFC Validators & Viewers',
  'src/app/toolbox/online-image-jpg-to-dxf-vectorizer/page.tsx': 'Best Image JPG/PNG to DXF Vectorizers',
  'src/app/toolbox/online-lisp-script-compiler-protector/page.tsx': 'Best AutoLISP LSP to FAS Compilers',
  'src/app/toolbox/online-pdf-to-dwg-converter/page.tsx': 'Best Vector PDF to DWG Converters Online',
  'src/app/toolbox/online-point-cloud-las-to-dxf-contour/page.tsx': 'Best Point Cloud LAS to DXF Contour Tools',
  'src/app/toolbox/online-point-cloud-to-mesh-converter/page.tsx': 'Best Point Cloud to Mesh Online Tools',
  'src/app/toolbox/online-revit-family-checker-audit/page.tsx': 'Best Revit Family RFA File Checkers',
  'src/app/toolbox/online-skp-to-fbx-cloud-converter/page.tsx': 'Best SketchUp SKP to FBX Online Converters',
  'src/app/toolbox/online-solidworks-e-drawings-cloud-viewer/page.tsx': 'Best SolidWorks eDrawings SLDPRT Viewers',
  'src/app/toolbox/online-step-to-obj-gltf-converter/page.tsx': 'Best STEP to glTF/OBJ Online Converters',
  'src/app/toolbox/online-step-to-stl-slicer-helper/page.tsx': 'Best STEP to STL Online Converters',

  // Shortcuts sheets
  'src/app/toolbox/archicad-shortcuts-sheet/page.tsx': 'ArchiCAD Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/bricscad-shortcuts-sheet/page.tsx': 'BricsCAD Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/catia-shortcuts-sheet/page.tsx': 'CATIA V5/V6 Keyboard Shortcuts & Hotkeys',
  'src/app/toolbox/creo-shortcuts-sheet/page.tsx': 'Creo Parametric Shortcuts & Hotkeys Guide',
  'src/app/toolbox/draftsight-shortcuts-sheet/page.tsx': 'DraftSight Keyboard Shortcuts & Hotkeys',
  'src/app/toolbox/freecad-shortcuts-sheet/page.tsx': 'FreeCAD Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/fusion360-shortcuts-sheet/page.tsx': 'Fusion 360 Keyboard Shortcuts & Hotkeys',
  'src/app/toolbox/inventor-shortcuts-sheet/page.tsx': 'Inventor Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/microstation-shortcuts-sheet/page.tsx': 'MicroStation Keyboard Shortcuts & Hotkeys',
  'src/app/toolbox/revit-shortcuts-sheet/page.tsx': 'Revit Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/rhino-shortcuts-sheet/page.tsx': 'Rhino 3D Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/sketchup-shortcuts-sheet/page.tsx': 'SketchUp Keyboard Shortcuts & Hotkeys Guide',
  'src/app/toolbox/solidworks-shortcuts-sheet/page.tsx': 'SolidWorks Keyboard Shortcuts & Hotkeys',
  'src/app/toolbox/vectorworks-shortcuts-sheet/page.tsx': 'Vectorworks Keyboard Shortcuts & Hotkeys',
  
  // Cloud Telemetry Blocker
  'src/app/toolbox/cloud-cad-telemetry-blocker-wizard/page.tsx': 'Best CAD Telemetry Blockers & Proxy Rules'
};

let modifiedCount = 0;

for (const [relPath, newTitle] of Object.entries(replacements)) {
  const fullPath = path.join(PROJECT_ROOT, relPath.replace(/\//g, path.sep));
  if (!fs.existsSync(fullPath)) {
    console.error(`File does not exist: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  // Match title in pageMetadata
  // Look for: title: '...' or title: "..."
  const regex = /(title:\s*)(['"`])(.*?)(['"`])/;
  const match = content.match(regex);
  if (match) {
    const quote = match[2];
    const oldTitle = match[3];
    if (oldTitle === newTitle) {
      // Already correct
      continue;
    }
    content = content.replace(regex, `$1${quote}${newTitle}${quote}`);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated [${relPath}]: "${oldTitle}" -> "${newTitle}"`);
    modifiedCount++;
  } else {
    console.warn(`Could not find title pattern in: ${relPath}`);
  }
}

console.log(`\nSuccessfully updated ${modifiedCount} meta titles!`);
