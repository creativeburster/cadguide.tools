const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/lib/toolbox-data.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const newTools = [
  // ================= A. 垂直格式瘦身与轻量化矩阵 (4 款) =================
  {
    slug: 'dwg-file-size-reducer',
    title: 'AutoCAD DWG Bloat Analyzer & File Size Reducer',
    description: 'Diagnose and reduce bloated 50MB+ DWG drawings down to kilobytes by purging DGN orphaned linetypes, Regapps, and annotation scale lists.',
    detailDesc: 'Solves the #1 drafting bottleneck where simple 2D drawings balloon to tens of megabytes and freeze upon saving. Calculates file size reduction ratios and generates automated -PURGE (Regapps, Zero-length geometry, Orphaned DGN data), SCALELISTEDIT reset, and WBLOCK export routines.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['dwg file size reducer', 'compress dwg file online', 'autocad file too large fix', 'purge dgn linetypes bloat', 'reduce dwg size without losing quality']
  },
  {
    slug: 'step-file-size-reducer',
    title: 'STEP / SLDASM Assembly Defeature & File Size Optimizer',
    description: 'Calculate 3D STEP/IGES file size reduction ratios by stripping internal fasteners, cosmetic threads, small fillets, and hidden sub-assemblies.',
    detailDesc: 'Mechanical engineers frequently struggle to email or upload 300MB+ STEP AP214/AP242 assemblies. This tool models the byte-size impact of geometric defeaturing (removing internal cavities, knurls, embossed text, and hardware) across SolidWorks, Siemens NX, Inventor, and CATIA while protecting intellectual property.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['step file size reducer', 'compress step file', 'solidworks defeature assembly size', 'reduce stp file size for email', 'simplify 3d cad model step']
  },
  {
    slug: 'stl-mesh-decimator-reducer',
    title: '3D Printing STL / OBJ Mesh Polygon Decimator & Size Reducer',
    description: 'Calculate optimal triangle decimation ratios, chordal tolerance deviation, and binary STL file size reduction for 3D printing slicers.',
    detailDesc: 'High-resolution 3D scans and ZBrush/Blender sculpts often exceed 5 million triangles (250MB+), crashing Bambu Studio, Cura, or PrusaSlicer. Computes exact Binary vs. ASCII STL byte footprints (50 bytes per facet) and recommends target polygon counts that preserve surface curvature below your nozzle resolution.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['stl file size reducer', 'decimate stl mesh online', 'reduce stl triangle count', 'compress stl file for 3d printing', 'ascii to binary stl size calculator']
  },
  {
    slug: 'ifc-model-size-optimizer',
    title: 'BIM Revit to IFC Model Size Optimizer & IFCZIP Compressor',
    description: 'Optimize bloated BIM IFC2x3/IFC4 exports by tuning Level of Development (LoD) tessellation, stripping custom property sets, and IFCZIP compression.',
    detailDesc: 'Exporting a 200MB Revit (.rvt) project with high-detail MEP families can unexpectedly produce a 900MB+ uncompressed .ifc text file. Evaluates polygon facet explosions on curved pipes/rebar, optimizes Revit IFC exporter tessellation level settings, and calculates IFCZIP archive compression ratios (up to 85% smaller).',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['ifc file size reducer', 'revit to ifc file too large', 'compress ifc model ifczip', 'optimize bim ifc export size', 'reduce ifc file size solibri']
  },

  // ================= B. 采购 TCO、硬件选型与跨软件迁移矩阵 (4 款) =================
  {
    slug: 'cad-subscription-vs-perpetual-roi-calculator',
    title: 'CAD Subscription vs. Perpetual License 5-Year TCO & ROI Calculator',
    description: 'Compare 5-year cumulative software costs between Autodesk/SolidWorks annual subscriptions and one-time perpetual buyout alternatives.',
    detailDesc: 'Built for engineering managers and IT procurement teams auditing annual SaaS rental inflation. Input your drafting and 3D modeling seat counts to calculate exact break-even months and 5-year net savings when switching to perpetual licenses (ZWCAD, BricsCAD, GStarCAD, progeCAD) paired with DWG FastView viewer seats.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['cad perpetual license calculator', 'autocad subscription vs perpetual cost', 'cad 5 year tco calculator', 'one time purchase cad roi', 'replace autocad subscription savings']
  },
  {
    slug: 'cad-hardware-workstation-spec-builder',
    title: 'CAD & BIM Workstation Hardware Spec Recommender (2026 Matrix)',
    description: 'Match your primary CAD/BIM software and assembly part count to optimal CPU single-core clock speeds, ECC RAM, and NVIDIA RTX workstation GPUs.',
    detailDesc: 'Stop wasting budget on 64-core processors for single-threaded parametric rebuilds. Provides verified hardware specifications across AutoCAD, SolidWorks, Revit, Siemens NX, Civil 3D, and CATIA—distinguishing between single-core GHz bottlenecks (modeling/drafting) and multi-core GPU/CPU scaling (FEA/CFD/Rendering).',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['cad workstation spec recommender', 'best cpu for solidworks revit 2026', 'single core vs multi core cad', 'how much ram for large cad assemblies', 'nvidia rtx workstation gpu cad matrix']
  },
  {
    slug: 'cad-command-cross-translator',
    title: 'Cross-CAD Command & Terminology Translator (SolidWorks ⇄ NX ⇄ Inventor ⇄ AutoCAD)',
    description: 'Translate feature names, assembly mate terminology, and drafting commands when migrating between SolidWorks, Siemens NX, Inventor, Creo, and AutoCAD.',
    detailDesc: 'Eliminates the muscle-memory friction when switching CAD ecosystems. Maps equivalent parametric operations side-by-side—such as SolidWorks "Mate" to Inventor "Constraint" and NX "Assembly Constraint", or "Boss-Extrude" to Creo "Extrude Protrusion" and CATIA "Pad"—complete with default hotkey mappings.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['cad command translator', 'solidworks to siemens nx commands', 'inventor vs solidworks terminology', 'autocad to bricscad command mapping', 'creo vs solidworks feature names']
  },
  {
    slug: 'cad-floating-license-seat-calculator',
    title: 'Floating Network License (FLEXlm) Concurrent Seat Ratio Calculator',
    description: 'Estimate optimal floating network license seats required for multi-shift engineering teams and calculate savings from lightweight viewer offloading.',
    detailDesc: 'Helps CAD administrators size floating license pools (SolidWorks SNL, BricsCAD Network, Siemens SPLM) without causing checkout denials. Computes optimal concurrent-to-total user ratios (typically 1:2.5 to 1:4) and models cost reductions achieved by moving review-only managers to DWG FastView.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['floating license seat calculator', 'concurrent cad license ratio', 'flexlm license pool sizing', 'solidworks network license calculator', 'reduce cad license seat denials']
  },

  // ================= C. 重工业与高壁垒专业软件速查表 (4 款) =================
  {
    slug: 'smartplant-3d-shortcuts-sheet',
    title: 'Hexagon SmartPlant 3D (SP3D) Piping, Equipment & PinPoint Cheat Sheet',
    description: 'Searchable reference of SmartPlant 3D (SP3D / S3D) keyboard shortcuts, PinPoint coordinate locks, piping routing commands, and workspace filters.',
    detailDesc: 'Purpose-built for petrochemical, power plant, and offshore marine piping designers. Covers Smart 3D task switching (Piping, Equipment, Structure, Hangers & Supports), PinPoint relative coordinate entry (F6/F7/F8), smart sketch glyph locks, and isometric extraction checks. Supports one-click A4 PDF printing.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['smartplant 3d shortcuts', 'sp3d piping cheat sheet', 'hexagon smart 3d keyboard shortcuts', 'sp3d pinpoint shortcut keys', 'smartplant 3d routing commands']
  },
  {
    slug: 'eplan-shortcuts-sheet',
    title: 'EPLAN Electric P8 Keyboard Shortcuts & Schematic Symbol Cheat Sheet',
    description: 'Complete printable cheat sheet of EPLAN Electric P8 hotkeys for schematic drafting, T-nodes, terminal strips, PLC numbering, and wire cross-references.',
    detailDesc: 'Accelerate industrial control panel and electrical cabinet design in EPLAN Electric P8. Includes instant lookup for symbol insertion (Insert), T-node direction toggling (Shift+F3 to F6), black box generation (F11), potential tracking, and automated page macro navigation.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['eplan electric p8 shortcuts', 'eplan keyboard shortcuts pdf', 'eplan t node shortcut', 'eplan schematic drafting hotkeys', 'eplan p8 cheat sheet']
  },
  {
    slug: 'plant3d-shortcuts-sheet',
    title: 'AutoCAD Plant 3D Piping, P&ID & Isometric Commands Cheat Sheet',
    description: 'Essential AutoCAD Plant 3D system commands, compass routing toggles, spec viewer hotkeys, and PCF/isometric drawing generation commands.',
    detailDesc: 'Designed for process piping engineers working in AutoCAD Plant 3D. Lists critical command-line triggers including PLANTPIPEADD, PLANTCOMPASS, PLANTPARTCONVERT, PLANTISOTB, ortho view refresh routines, and P&ID line-to-pipe spec validation commands.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['autocad plant 3d shortcuts', 'plant 3d commands cheat sheet', 'plantpipeadd shortcut', 'plant 3d isometric commands', 'p&id autocad shortcuts']
  },
  {
    slug: 'navisworks-shortcuts-sheet',
    title: 'Autodesk Navisworks Clash Detective, Roamer & 4D Navigation Shortcuts',
    description: 'Printable keyboard shortcuts and walk/fly navigation hotkeys for Autodesk Navisworks Manage, Simulate, and Freedom BIM review.',
    detailDesc: 'Master large-scale BIM coordination and plant walkthroughs in Navisworks. Covers first-person avatar walk controls, Clash Detective window toggles (Ctrl+F2), Selection Tree (Ctrl+F12), viewpoint saving, sectioning planes, and 4D TimeLiner simulation playback keys.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['navisworks shortcuts cheat sheet', 'navisworks freedom navigation keys', 'clash detective shortcut navisworks', 'navisworks walk fly controls', 'bim coordination shortcuts']
  },

  // ================= D. 蓝海重工业排障向导与买断制选型矩阵 (4 款) =================
  {
    slug: 'smartplant-3d-piping-spec-error-wizard',
    title: 'SmartPlant 3D (SP3D) Piping Spec & Isometric Extraction Troubleshooter',
    description: 'Resolve SP3D "Piping Specification Not Found", eccentric reducer port alignment errors, and broken ISOGEN PCF isometric sheets.',
    detailDesc: 'Field-tested diagnostic wizard for Hexagon SmartPlant 3D piping engineers and PDS/S3D administrators. Walks through verifying Catalog database connection strings, fixing NPD (Nominal Piping Diameter) spec breaks, resolving To-Do List (TDL) disconnected port glyphs, and repairing ISOGEN backing sheet symbols.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['smartplant 3d piping spec error', 'sp3d isogen extraction failed', 'sp3d todo list disconnected port', 'smart 3d catalog database fix', 'sp3d eccentric reducer routing error']
  },
  {
    slug: 'nx-step-ap242-pmi-export-troubleshooter',
    title: 'Siemens NX to STEP AP242 PMI & Reference Set Export Troubleshooter',
    description: 'Fix missing 3D GD&T PMI annotations, empty assembly files, and unsewn sheet bodies when exporting STEP AP214/AP242 from Siemens NX.',
    detailDesc: 'Addresses the top translation failures encountered by Siemens NX users exporting customer deliverables. Explains how to configure NX STEP242 translator .def files, enforce "MODEL" Reference Set inclusion so sub-components do not vanish, and enable semantic PMI product manufacturing information output.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['siemens nx step export missing parts', 'nx export step ap242 pmi', 'nx reference set step translation', 'siemens nx step sheet body instead of solid', 'nx step242 def file configuration']
  },
  {
    slug: 'civil3d-corridor-surface-lag-optimizer',
    title: 'Civil 3D Large TIN Surface & Corridor Rebuild Performance Optimizer',
    description: 'Eliminate Civil 3D viewport freezing, slow corridor rebuilds, and .mms file errors on massive LiDAR point cloud and highway grading projects.',
    detailDesc: 'Step-by-step optimization guide for civil infrastructure engineers handling multi-million-point TIN surfaces. Covers Level of Detail (LEVELOFDETAIL) activation, externalizing large surfaces via Data Shortcuts (DREF), weeding contour vertices, and disabling automatic corridor rebuild locks.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['civil 3d slow corridor rebuild', 'civil 3d large surface lag fix', 'levelofdetail civil 3d command', 'missing mms file civil 3d surface', 'optimize tin surface point cloud']
  },
  {
    slug: 'perpetual-cad-migration-compatibility-matrix',
    title: '2026 Perpetual License CAD Migration & Compatibility Matrix',
    description: 'Side-by-side technical audit of perpetual buyout CAD software (ZWCAD, BricsCAD, GStarCAD, progeCAD) vs. AutoCAD & SolidWorks subscriptions.',
    detailDesc: 'Comprehensive procurement benchmark for engineering firms replacing annual subscriptions with one-time perpetual licenses. Compares native AC1032 DWG read/write fidelity, AutoLISP/VLX/ObjectARX plugin compatibility, Dynamic Block editing, 3D Parasolid/ACIS modeling kernels, and 5-year total cost of ownership.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-21',
    keywords: ['perpetual cad comparison matrix', 'bricscad vs zwcad vs gstarcad vs progecad', 'best perpetual license autocad alternative', 'one time buyout cad lisp compatibility', 'perpetual 3d cad software comparison']
  }
];

// Check before appending
const existingSlugs = new Set([...content.matchAll(/["']?slug["']?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]));
const toInsert = newTools.filter(t => !existingSlugs.has(t.slug));

if (toInsert.length === 0) {
  console.log('All 16 tools are already present in toolbox-data.ts.');
  process.exit(0);
}

const toolsString = toInsert.map(t => JSON.stringify(t, null, 2)).join(',\n  ');

content = content.replace(
  /\n\];\s*$/,
  `,\n  ${toolsString}\n];\n`
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log(`Successfully injected ${toInsert.length} new data-driven tools into toolbox-data.ts!`);
