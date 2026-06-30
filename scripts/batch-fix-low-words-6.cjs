const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

function fixFile(relPath, replacements) {
  const filePath = path.join(GUIDES_DIR, relPath);
  if (!fs.existsSync(filePath)) { console.log('NOT FOUND: ' + relPath); return; }
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  for (const [old, neu] of replacements) {
    if (content.includes(old)) {
      content = content.replace(old, neu);
      changed = true;
    } else {
      console.log('NOT MATCHED in ' + relPath + ': ' + old.substring(0, 60));
    }
  }
  if (changed) { fs.writeFileSync(filePath, content, 'utf-8'); console.log('OK: ' + relPath); }
  else { console.log('NO CHANGES: ' + relPath); }
}

// Allplan - insert before "## My Take"
fixFile('allplan/allplan-vs-revit-bim-platform-comparison-architecture-engineering.md', [
  ['## My Take',
   `## Regional Market and Collaboration Considerations

The choice between Allplan and Revit is heavily influenced by geographic location and local market standards. Allplan has strong market share in Germany, Austria, Switzerland, and parts of Eastern Europe — regions where engineering precision and structural detail documentation are emphasized. In these markets, Allplan's engineering tools and European code support make it the natural choice. Revit dominates in North America, the UK, Australia, and most of Asia. For firms working internationally, the choice may be dictated by client requirements. Collaboration between Allplan and Revit users requires IFC as the interchange format, which adds a conversion step and can lose some parametric data. Firms that work across both markets may need to maintain both platforms, increasing training and licensing costs but ensuring compatibility with local requirements and client expectations.

## My Take`]
]);

// CYPECAD - insert before "## My Take"
fixFile('cypecad/cypecad-vs-etabs-building-design-platform-comparison.md', [
  ['## My Take',
   `## Workflow and Productivity Comparison

The workflow differences between CYPECAD and ETABS reflect their different design philosophies. CYPECAD's workflow is design-oriented: you define the building geometry, assign loads, and CYPECAD automatically generates the structural model, performs analysis, and designs the elements according to the selected code. This automated approach is fast for standard buildings. ETABS' workflow is analysis-oriented: you manually build the analytical model, define load patterns and combinations, run the analysis, and then perform design checks. For repetitive building types like residential or office towers, CYPECAD's automation saves significant time. For unusual structures with complex geometry or non-standard load patterns, ETABS' manual modeling approach provides the flexibility needed. Many structural engineers use both tools — CYPECAD for standard buildings where speed matters, and ETABS for complex structures where analytical control matters.

## My Take`]
]);

// midas civil - insert before "## My Take"
fixFile('midas-civil/midas-civil-vs-sap2000-bridge-analysis-platform-comparison.md', [
  ['## My Take',
   `## Moving Load and Post-Tensioning Comparison

Beyond construction stage analysis, midas Civil also excels in moving load analysis for bridges. The program includes built-in moving load generators for standard truck and lane loads per AASHTO, Eurocode, and other international codes. You define the traffic lanes, and midas Civil automatically generates all possible vehicle positions, performs influence surface analysis, and envelopes the results. SAP2000 has similar capabilities but the interface is less streamlined — defining lanes and vehicles requires more manual input. For post-tensioned bridge design, midas Civil includes a dedicated PSC (Pre-Stressed Concrete) design module that handles tendon profiling, stress checks, and loss calculations. SAP2000 can model tendons but doesn't have the same level of automated PSC design checking. On Eng-Tips, a user noted that "MIDAS is powerful but atrocious" — the interface is the main complaint, not the analysis capabilities. For engineers willing to tolerate the interface, midas Civil's bridge-specific tools are unmatched at this price point.

## My Take`]
]);

// midas gen - insert before "## My Take"
fixFile('midas-gen/midas-gen-vs-etabs-building-analysis-platform-comparison.md', [
  ['## My Take',
   `## Code Support and Regional Considerations

Code support is a major factor in choosing between midas Gen and ETABS. ETABS has comprehensive support for US codes: ACI 318 for concrete, AISC 360 for steel, ASCE 7 for loads, and IBC for general building requirements. This makes ETABS the default choice for US-based structural engineering practice. midas Gen supports a broader range of international codes: Eurocode, British Standards, Korean, Chinese, Japanese, and Indian codes, in addition to US codes. This makes midas Gen more versatile for international firms working across multiple code jurisdictions. However, the depth of code support varies — midas Gen's US code implementation may not be as comprehensive or up-to-date as ETABS' implementation. For firms working primarily in the US, ETABS' code support is more reliable and better validated. For firms working in Europe, Asia, or the Middle East, midas Gen's multi-code support is a significant advantage.

## My Take`]
]);

// SAP2000 - insert before "## My Take"
fixFile('sap2000/sap2000-vs-etabs-choosing-csi-analysis-tool-project.md', [
  ['## My Take',
   `## Modeling Workflow Differences

The modeling workflows in SAP2000 and ETABS reflect their different focus areas. SAP2000 uses a general-purpose modeling approach: you define nodes, frames, shells, and solids in a 3D environment without any building-specific assumptions. This gives you complete freedom to model any structure type — bridges, tanks, retaining walls, space frames, offshore structures. ETABS uses a building-specific modeling approach: you define stories, grids, and structural elements organized by floor levels. The program automatically handles inter-story relationships, mass distribution, and lateral load paths. This makes building modeling faster and more intuitive in ETABS than in SAP2000. For a 10-story building, ETABS can complete the model in half the time it takes in SAP2000. For a bridge or industrial structure, SAP2000's general-purpose approach is more natural. The key is matching the tool to the structure type: buildings in ETABS, everything else in SAP2000.

## My Take`]
]);

// STAAD Pro - insert before "## Wrapping Up"
fixFile('staad-pro/staad-pro-editor-commands-text-modeling-automation-batch-processing.md', [
  ['## Wrapping Up',
   `## Automation Through Script-Generated Input Files

The STAAD input file's text-based format enables powerful automation workflows that are impossible with GUI-only CAD software. Since the STAAD command file is plain text, you can generate it programmatically using any scripting language — Python, Excel VBA, MATLAB, or even shell scripts. A common automation scenario is parametric structure generation: write a Python script that takes parameters like span length, number of bays, and member sizes, then generates a complete STAAD input file with all nodes, members, properties, loads, and analysis commands. This approach is used by engineering firms for standard structures like pipe racks, equipment platforms, and transmission towers where the geometry varies but the structural concept is consistent. Another automation scenario is batch analysis: generate multiple input files with varying parameters, run STAAD in batch mode, and extract results for comparison. The STAAD output file is also text-based, so you can parse it with scripts to extract forces, stresses, and design ratios for further processing.

## Wrapping Up`]
]);

console.log('\nDone.');
