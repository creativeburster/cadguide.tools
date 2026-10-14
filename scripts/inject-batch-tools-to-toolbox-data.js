const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/lib/toolbox-data.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const newTools = [
  // ================= 1. VALIDATORS & CHECKERS (6 款) =================
  {
    slug: 'cad-open-contour-checker',
    title: 'CAD Open Contour & Micro-Gap Diagnostic Checker',
    description: 'Inspect 2D polylines and curves for tiny microscopic gaps and unclosed loops that cause CNC toolpath and 3D extrusion failures.',
    detailDesc: 'Machinists and CAD modelers frequently encounter failed boundary extrusions or CAM toolpath rejections due to microscopic gaps (under 0.05mm) between arcs and lines. This tool diagnoses endpoints, highlights open vertex coordinates, and generates PEDIT join script routines.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['open contour checker', 'cad gap checker', 'unclosed polyline fix', 'cam toolpath boundary error', 'pedit join automated']
  },
  {
    slug: 'duplicate-overlapping-lines-checker',
    title: 'Duplicate & Overlapping Geometry (OVERKILL) Cleaner',
    description: 'Identify coincident duplicate lines, collinear overlapping segments, and duplicate zero-length entities for laser cutting and CNC nesting.',
    detailDesc: 'In laser, plasma, and waterjet cutting, overlapping identical vectors cause machines to double-cut the same path, burning materials and blowing nozzles. Diagnoses duplicate entity counts and generates optimized OVERKILL routines to merge collinear segments.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['overkill cad', 'duplicate lines checker', 'overlapping geometry laser cut', 'clean duplicate vectors dxf', 'cnc nesting path double cut']
  },
  {
    slug: 'cad-dimension-override-checker',
    title: 'CAD Dimension Text Override & Fake Measurement Audit',
    description: 'Audit drawing blueprints to catch fake, hand-modified dimension text overrides that do not match true underlying CAD geometry.',
    detailDesc: 'A critical QA/QC engineering audit tool. Draftsmen under deadline pressure sometimes manually override dimension text (e.g. typing "100.0" over a 98.2mm line). Identifies overridden dimension entities and lists discrepancies between measured geometry and printed annotations.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['cad dimension override audit', 'fake dimensions checker', 'verify drawing measurements', 'dimoverride lisp audit', 'qa qc drawing checker']
  },
  {
    slug: 'non-manifold-mesh-checker',
    title: '3D Printing Non-Manifold Mesh & Topology Defect Checker',
    description: 'Verify 3D meshes for self-intersections, zero-thickness walls, inverted face normals, and open boundary holes before 3D printing slicing.',
    detailDesc: 'Non-manifold edges, T-junctions, and internal floating faces cause slicers (Bambu Studio, Cura, PrusaSlicer) to miscalculate solid infill or drop geometry entirely. Validates watertight mesh closure, calculates Euler characteristic, and pinpoints non-manifold coordinates.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['non manifold checker', 'watertight mesh check', '3d printing mesh repair', 'slicer mesh errors fix', 'stl self intersection audit']
  },
  {
    slug: 'thread-engagement-length-checker',
    title: 'Thread Engagement Length & Pull-Out Safety Checker',
    description: 'Calculate minimum safe thread engagement depth and shear area for bolted joints across steel, cast iron, and aluminum substrates.',
    detailDesc: 'Prevents stripped threads in machine assemblies. Evaluates thread shear area and required engagement length based on fastener tensile grade (8.8, 10.9) versus tapped hole substrate shear yield strength (e.g. 6061-T6 aluminum vs 4140 steel) per Machinery\'s Handbook standards.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['thread engagement length', 'thread shear pullout calculator', 'screw thread depth aluminum', 'machinerys handbook thread engagement', 'bolt stripping safety factor']
  },
  {
    slug: 'bim-naming-convention-checker',
    title: 'BIM Layer & Family Naming Convention Validator (ISO 19650 / AIA)',
    description: 'Validate Revit family parameters, CAD layer names, and IFC classifications against strict ISO 19650 and AIA project delivery standards.',
    detailDesc: 'Ensures compliance with national BIM mandates (UK BIM Framework, Singapore CORENET X, US National CAD Standard). Validates field delimitations (Discipline-Zone-Level-Type-Role), character length limits, and forbidden special characters across master project databases.',
    category: 'validator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['iso 19650 naming checker', 'bim layer naming standard', 'aia cad layer format check', 'revit family naming audit', 'bep compliance validator']
  },

  // ================= 2. GENERATORS & CREATORS (6 款) =================
  {
    slug: 'gcode-drilling-cycle-generator',
    title: 'CNC Hole Drilling G-Code Cycle Generator (G81 / G83 / G73)',
    description: 'Generate parametric CNC drilling cycles: standard drill (G81), deep-hole peck drill (G83), and chip-break drill (G73) for Fanuc, Haas, and Siemens.',
    detailDesc: 'Quickly generates production-ready G-code blocks for CNC milling and lathe live tooling. Calculates retract planes (R), peck depths (Q), dwell times (P), and feeds/speeds for multiple hole coordinates without launching heavy CAM suites.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['gcode drilling generator', 'g83 peck drill cycle', 'g81 canned cycle generator', 'fanuc gcode hole drill', 'haas cnc drilling code']
  },
  {
    slug: 'lisp-batch-purge-script-generator',
    title: 'AutoLISP Batch Drawing Purge & Audit Script Generator',
    description: 'Generate customized AutoLISP (.lsp) macro routines to batch clean unreferenced blocks, purge regapps, fix scales, and audit DWG files.',
    detailDesc: 'Customizes automated AutoLISP routine scripts tailored to your company drafting standards. Select options for purging nested blocks, removing DGN linetype bloat, resetting annotation scales, and auditing corrupt drawing databases during silent startup.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['autolisp purge generator', 'batch drawing clean script', 'cad batch audit lisp', 'lisp purge regapps script', 'autocad automated cleaner']
  },
  {
    slug: 'cad-custom-hatch-pat-generator',
    title: 'Custom AutoCAD Hatch Pattern (.PAT) Code Generator',
    description: 'Design and compile custom repeatable AutoCAD hatch patterns into syntactically verified .PAT format with angle, delta, and dash spacing.',
    detailDesc: 'Writing AutoCAD .PAT hatch patterns manually is notoriously complex. Enter pattern line angles, origin coordinates (X, Y), displacement deltas, and pen-up/pen-down dash segments to generate perfectly tiled, leak-free custom architectural hatch files.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['custom hatch generator', 'autocad pat file creator', 'make cad hatch pattern', 'pat pattern compiler', 'custom architectural hatch']
  },
  {
    slug: 'iso-layer-standard-template-generator',
    title: 'ISO 13567 & AIA CAD Layer Standard Script Generator',
    description: 'Generate standardized CAD layer structures, color indexes (ACI), and linetypes compliant with AIA CAD Guidelines and ISO 13567-2.',
    detailDesc: 'Select architectural, structural, or MEP disciplines to generate an executable AutoLISP or SCR script that instantly instantiates all required standard layers (e.g. A-WALL-FULL, S-COLS, M-DUCT-SUPP) with exact corporate RGB colors, linetypes, and lineweights.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['cad layer standard generator', 'iso 13567 layer script', 'aia layer template autocad', 'automated layer setup script', 'standard cad lineweights']
  },
  {
    slug: 'thread-milling-gcode-generator',
    title: 'CNC Thread Milling Helical Interpolation (G02/G03) Generator',
    description: 'Calculate toolpaths and generate G-code for internal and external CNC thread milling with climb milling and arc lead-in/lead-out.',
    detailDesc: 'Computes cutter radius compensation, pitch helix Z-travel, and helical interpolation arcs (G02/G03 with I/J offsets). Generates clean CNC blocks for metric and unified threads, avoiding costly tap breakage in difficult-to-machine alloys like titanium and stainless.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['thread milling gcode generator', 'helical interpolation g02 g03', 'internal thread milling program', 'cnc thread milling lead in', 'climb thread milling macro']
  },
  {
    slug: 'cnc-facing-pocket-path-generator',
    title: 'CNC Face Milling & Rectangular Pocket G-Code Generator',
    description: 'Generate 2.5D face milling and pocket clearing CNC toolpath routines with stepover, depth-of-cut passes, and feed rate optimization.',
    detailDesc: 'Parametric toolpath builder for squaring raw stock and clearing rectangular pockets on manual-CNC retrofits and shop floor mills. Specify tool diameter, stock dimensions, stepover percentage, and total depth to output complete ready-to-run G-code programs.',
    category: 'generator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['cnc face milling generator', 'rectangular pocket gcode', 'fly cutting toolpath gcode', '2.5d pocket roughing macro', 'shop floor quick gcode']
  },

  // ================= 3. COMPARATORS & DIFF TOOLS (6 款) =================
  {
    slug: 'step-ap214-vs-ap242-comparator',
    title: 'STEP AP203 vs AP214 vs AP242 Protocol Feature Matrix',
    description: 'Authoritative comparison of ISO 10303 STEP application protocols: assembly hierarchy, RGB surface colors, and 3D semantic PMI / GD&T.',
    detailDesc: 'Helps CAD administrators and manufacturing engineers choose the correct neutral format protocol. Compares AP203 (legacy), AP214 (automotive standard with colors), and AP242 (enterprise standard with semantic 3D annotations and LOTAR compliance).',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['step ap214 vs ap242', 'step protocol comparison', 'step ap203 vs ap214', 'pmi in step ap242', 'iso 10303 protocol differences']
  },
  {
    slug: 'cad-version-feature-matrix',
    title: 'AutoCAD Releases (2018 to 2026+) Architecture & Feature Comparison',
    description: 'Comprehensive cross-version matrix comparing AutoCAD releases: DWG format codes (AC1032), DirectX graphics engines, and Apple Silicon support.',
    detailDesc: 'Determines whether software upgrades are necessary. Details DWG file schema changes, graphics subsystem requirements (DirectX 11 vs 12 vs Metal), cloud drawing history features, and backward-compatibility factors across recent CAD workstation generations.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['autocad version comparison', 'autocad 2024 vs 2026', 'dwg ac1032 versions', 'autocad directx 12 requirements', 'apple silicon cad comparison']
  },
  {
    slug: 'mcad-kernel-comparator',
    title: '3D CAD Modeling Kernels Comparison Matrix (Parasolid, ACIS, CGM, ASM)',
    description: 'Deep technical benchmark of major 3D CAD kernels: Siemens Parasolid, Dassault CGM, Autodesk ShapeManager, and Spatial ACIS.',
    detailDesc: 'Compares mathematical B-Rep surface representations, tolerance healing engines, Class-A curvature continuity, and cross-kernel translation fidelity across SolidWorks, NX, Inventor, CATIA, and Onshape.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['parasolid vs acis', 'cad geometric kernels comparison', 'shapemanager vs parasolid', 'catia cgm kernel', 'brep modeling engines']
  },
  {
    slug: 'bim-ifc-schema-comparator',
    title: 'openBIM IFC Schema Evolution Matrix (IFC2x3 vs IFC4 vs IFC4.3)',
    description: 'Comparison of buildingSMART IFC schemas: building vertical domains vs civil infrastructure (bridges, roads, railways) and Solibri compatibility.',
    detailDesc: 'Guides BIM managers on selecting the optimal openBIM export schema. Contrasts legacy tender baseline IFC2x3 with modern architectural IFC4 and new infrastructure-certified IFC4.3 civil alignment standards.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['ifc2x3 vs ifc4', 'ifc4.3 infrastructure standard', 'openbim schema comparison', 'solibri ifc compatibility', 'buildingsmart standards matrix']
  },
  {
    slug: 'fdm-filament-selector-comparator',
    title: '3D Printing Filament Selection Matrix (PLA, PETG, ABS, TPU, PA-CF, PC)',
    description: 'Engineering radar comparison of FDM 3D printing filaments: rigidity, impact strength, temperature resistance (HDT), and warping difficulty.',
    detailDesc: 'Side-by-side selection guide for engineering prototypes. Compares flexural modulus, Izod impact toughness, heat deflection temperatures, UV weatherability, and printing chamber requirements per ISO test standards.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['pla vs petg vs abs', '3d printing filament comparison', 'pa cf vs pc filament', 'tpu 95a properties', 'filament selection radar chart']
  },
  {
    slug: 'iges-vs-step-comparator',
    title: 'IGES (.igs) vs STEP (.stp) Neutral CAD Format Comparison',
    description: 'Detailed analysis of IGES trimmed surface wireframes versus STEP solid B-Rep models: surface stitching errors, file size, and CAM toolpaths.',
    detailDesc: 'Examines why IGES (ANSI Y14.26M, deprecated) produces surface gap leaks and stitching failures in modern CAM, whereas ISO 10303 STEP guarantees watertight solid volumes, hierarchical assembly trees, and face color retention.',
    category: 'comparator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['iges vs step', 'igs or stp for cam', 'step solid vs iges surface', 'cad format translator choice', 'why not use iges']
  },

  // ================= 4. LIBRARIES & ASSET STORES (6 款) =================
  {
    slug: 'aisc-steel-shapes-library',
    title: 'AISC Standard Steel Shapes Structural Properties Library',
    description: 'Comprehensive dimensional and structural property database for AISC wide-flange beams (W-Shapes), I-beams, channels, and angles.',
    detailDesc: 'Searchable engineering database conforming to AISC 15th Edition. Look up depth (d), flange width (bf), cross-sectional area (A), elastic section modulus (Wx), and moment of inertia (Ix) for structural steel design.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['aisc steel shapes database', 'w shape beam properties', 'aisc wide flange dimensions', 'structural steel section modulus', 'astm a992 beam table']
  },
  {
    slug: 'din-en-structural-sections-library',
    title: 'Eurocode DIN / EN Structural Steel Profiles Library (IPE, HEA, HEB)',
    description: 'Dimensional and geometric properties of European structural steel profiles: IPE beams, HEA/HEB wide-flange columns per EN 10034 / EN 10025.',
    detailDesc: 'Standard structural engineering library for Eurocode 3 designs. Provides beam depth (h), flange width (b), web/flange thickness, cross-sectional area, and section modulus for European structural sections.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['ipe beam dimensions', 'hea column dimensions table', 'heb eurocode steel sections', 'en 10034 structural profiles', 'european steel section properties']
  },
  {
    slug: 'iso-286-fit-tolerances-library',
    title: 'ISO 286 Limits and Fits Engineering Tolerances Database (H7/g6, H7/p6)',
    description: 'Standard metric limits and fits database per ISO 286: hole and shaft upper/lower deviations (μm) for clearance, transition, and press fits.',
    detailDesc: 'Interactive engineering database for machine design. Look up upper and lower fundamental deviations in micrometers for standard hole tolerance zones (H7, H8) and shaft tolerance zones (g6, h6, p6) across all diameter steps.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['iso 286 fits table', 'h7 g6 tolerance chart', 'h7 p6 press fit deviation', 'metric limits and fits database', 'machining tolerance lookup']
  },
  {
    slug: 'standard-ball-bearing-library',
    title: 'Deep Groove Ball Bearings (6000, 6200, 6300 Series) Specification Library',
    description: 'Dimensions, basic dynamic load ratings (Cr), static ratings (C0r), and RPM limits for ISO metric radial ball bearings.',
    detailDesc: 'Mechanical bearing selection catalog conforming to ISO 15 and DIN 625. Look up bore diameter (d), outer diameter (D), width (B), dynamic capacity, static load limits, and maximum grease/oil rotational speeds.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['ball bearing dimensions table', '6204 bearing specs', '6000 series bearing catalog', 'bearing dynamic load rating cr', 'iso 15 deep groove bearings']
  },
  {
    slug: 'engineering-plastics-property-database',
    title: 'Engineering Thermoplastics Properties & Machinability Database',
    description: 'Physical, mechanical, and thermal properties of engineering plastics: POM (Delrin), PA66 (Nylon), PEEK, PTFE (Teflon), and Polycarbonate.',
    detailDesc: 'Precision material selection guide for CNC plastic machining and mechanical components. Covers density, tensile modulus, yield strength, continuous service temperature, friction coefficient, and moisture absorption.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['engineering plastics properties', 'delrin vs nylon machinability', 'peek tensile modulus', 'ptfe friction coefficient', 'cnc plastic materials database']
  },
  {
    slug: 'ansi-b1-1-unified-screw-threads-library',
    title: 'ANSI / ASME B1.1 Unified Inch Screw Threads (UNC / UNF) Database',
    description: 'Standard dimensions for Unified inch fasteners: major diameter, TPI, pitch diameter, minor diameter, and recommended tap drill sizes.',
    detailDesc: 'Comprehensive reference catalog for American inch fasteners per ASME B1.1. Includes coarse threads (UNC) and fine threads (UNF) from #4 up to 1/2", with exact decimal dimensions and 75% thread tap drill selections.',
    category: 'library',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['unc unf thread dimensions table', '1 4 20 unc tap drill', 'asme b1 1 thread database', 'unified inch screw thread chart', 'pitch diameter unc unf']
  },

  // ================= 5. TROUBLESHOOTING WIZARDS (6 款) =================
  {
    slug: 'autocad-fatal-error-0xc0000005-wizard',
    title: 'AutoCAD Fatal Error: 0xC0000005 Access Violation Repair Wizard',
    description: 'Step-by-step diagnostic guide to resolve AutoCAD crash error "Fatal Error: Unhandled Access Violation Exception 0xC0000005".',
    detailDesc: 'Diagnoses memory access violations caused by corrupt .NET Framework runtimes, outdated DirectX drivers, or conflicting LISP third-party plugins. Walks engineers through safe mode launch, disabling hardware acceleration, and rebuilding corrupted user profile paths.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['autocad fatal error 0xc0000005', 'unhandled access violation cad crash', 'autocad crash on startup fix', 'fatal error drawing recovery', 'clean profile reset autocad']
  },
  {
    slug: 'missing-ctb-plot-style-resolver',
    title: 'Missing CTB Plot Style Table & Color Plotting Fixer',
    description: 'Troubleshoot missing monochrome.ctb or custom plot styles resulting in drawings printing with unexpected colors or hairline weights.',
    detailDesc: 'Diagnoses plot style table lookup path failures in AutoCAD and GstarCAD. Explains differences between color-dependent (CTB) and named (STB) plot styles, providing commands (CONVERTPSTYLES, STYLESMANAGER) to restore missing monochrome plotting.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['missing ctb plot style', 'monochrome ctb missing autocad', 'convertpstyles cad fix', 'plot style table search path', 'cad prints in color instead of black']
  },
  {
    slug: 'cad-xref-unresolved-path-fixer',
    title: 'External Reference (XREF) Unresolved Path & Red Cross Resolver',
    description: 'Resolve missing external reference drawings (XREFs) displaying yellow exclamation marks or broken red crosses in drawing sheet sets.',
    detailDesc: 'Step-by-step diagnostic wizard for fixing unlinked external references. Covers absolute versus relative path binding, automated REDIR directory search-and-replace, and batch path repointing when drawings move to cloud drives (SharePoint, Google Drive).',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['xref unresolved fix', 'missing external reference cad', 'xref path relative vs absolute', 'redir command autocad', 'bind xref without error']
  },
  {
    slug: 'graphics-acceleration-black-screen-wizard',
    title: 'CAD & SolidWorks Hardware Acceleration Black Screen Wizard',
    description: 'Troubleshoot viewport freezes, black screens, and cursor tearing caused by GPU hardware acceleration and DirectX/OpenGL conflicts.',
    detailDesc: 'Guides engineers experiencing graphics viewport stutter, missing crosshairs, or fatal crashes when rotating 3D models. Explains GRAPHICSCONFIG command settings, certified GPU driver rollbacks, and switching between DirectX 11 and DirectX 12 modes.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['cad hardware acceleration black screen', 'graphicsconfig autocad crash', 'solidworks open gl viewport lag', 'gpu driver cad freezing', 'cursor tearing cad fix']
  },
  {
    slug: 'license-manager-error-0-15-wizard',
    title: 'FLEXlm Network License Error [-15.10.10061] Diagnostic Wizard',
    description: 'Resolve network license checkout failures: "Cannot connect to license server system [-15.10.10061]" and TCP port blocking.',
    detailDesc: 'System administrator diagnostic wizard for resolving floating license checkouts. Walks through verifying lmgrd TCP ports (27000-27009), adskflex vendor daemon port configuration, Windows Firewall inbound rules, and ADSKFLEX_LICENSE_FILE environment variables.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['flexlm error 15 10 10061', 'license server connection refused', 'cannot checkout license autocad', 'lmgrd port 27000 firewall', 'adskflex license file environment variable']
  },
  {
    slug: 'text-style-question-mark-font-fixer',
    title: 'CAD Text Question Mark (?) & BigFont SHX Encoding Fixer',
    description: 'Fix Asian, Cyrillic, and technical symbol characters appearing as question marks (?) due to missing BigFont or codepage mismatches.',
    detailDesc: 'Comprehensive guide to solving font substitution errors in AutoCAD and BricsCAD. Explains how to map missing SHX font files (gbcbig.shx, bigfont.shx, chs.shx) using the FONTALT system variable, ACAD.FMP font mapping files, and TTF font substitutions.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-10-10',
    keywords: ['cad text question mark fix', 'missing bigfont shx autocad', 'fontalt system variable', 'gbcbig shx substitute', 'asian characters cad question mark']
  }
];

// Append to TOOLBOX_DATA
const toolsString = newTools.map(t => JSON.stringify(t, null, 2)).join(',\n  ');

content = content.replace(
  /\n\];\s*$/,
  `,\n  ${toolsString}\n];\n`
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully injected 30 new tools into toolbox-data.ts!');
