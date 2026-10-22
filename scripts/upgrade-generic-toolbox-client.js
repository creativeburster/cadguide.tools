const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/generic-toolbox-client.tsx');
let content = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. Inject 7 new datasets into REFERENCE_DATASETS
const extraRefDatasets = `,
  'cad-hardware-workstation-spec-builder': {
    headers: ['CAD / BIM Software & Workload', 'Primary Bottleneck', 'Recommended CPU (2026)', 'System RAM (ECC / DDR5)', 'Workstation GPU (ISV Certified)', 'NVMe Storage & Scratch Disk'],
    rows: [
      ['AutoCAD / BricsCAD / ZWCAD (2D Drafting)', 'Single-Core GHz & 2D Regen', 'Intel Core Ultra 7 / i7-14700K or Ryzen 7 9700X (5.5+ GHz)', '32 GB DDR5-6000', 'NVIDIA RTX A1000 / RTX 2000 Ada (8GB)', '1 TB PCIe 4.0 NVMe SSD'],
      ['SolidWorks / Inventor (< 1,000 Parts)', 'Single-Thread Parametric Rebuild', 'Intel Core Ultra 9 285K / i9-14900K (5.8+ GHz Turbo)', '64 GB DDR5', 'NVIDIA RTX 2000 Ada (16GB) or RTX A2000', '2 TB PCIe 4.0 NVMe (OS + PDM Local Cache)'],
      ['SolidWorks / Siemens NX (10,000+ Part Assys)', 'Single-Core GHz + Massive VRAM/RAM', 'Intel Core i9-14900KS / Xeon W5-2565X (High Clock)', '128 GB DDR5 ECC', 'NVIDIA RTX 4000 Ada (20GB) / RTX 5000 Ada (32GB)', '2× 2 TB PCIe 5.0 NVMe (Dedicated Scratch)'],
      ['Autodesk Revit / BIM (Large Central Models)', 'Single-Core Rebuild + RAM Capacity (20× RVT Size)', 'Intel Core Ultra 9 / AMD Ryzen 9 9950X (5.7 GHz)', '64 GB – 128 GB DDR5', 'NVIDIA RTX 4000 Ada (20GB) for Enscape/Twinmotion', '2 TB NVMe (Fast %LOCALAPPDATA% CollaborationCache)'],
      ['Autodesk Civil 3D (LiDAR & Corridor Surfaces)', 'Single-Core TIN Triangulation + Disk I/O', 'Intel Core i9-14900K / Ryzen 9 9900X (5.6+ GHz)', '64 GB – 128 GB DDR5', 'NVIDIA RTX 2000 Ada / RTX 4000 Ada', '2 TB High-IOPS NVMe (Fast .mms Surface Swap)'],
      ['CATIA V5/V6 & Hexagon SmartPlant 3D', 'OpenGL Viewport Culling + Database Cache', 'Intel Xeon W-2500 / Core Ultra 9 (5.4+ GHz)', '64 GB – 128 GB ECC', 'NVIDIA RTX 4000 Ada (ISV Certified Driver Mandatory)', '2 TB Enterprise NVMe RAID/SSD'],
      ['ANSYS Fluent / Abaqus FEA & KeyShot Render', 'Multi-Core Memory Bandwidth & CUDA Cores', 'AMD Threadripper PRO 7975WX (32-Core, 8-Ch DDR5)', '256 GB – 512 GB 8-Channel ECC', 'NVIDIA RTX 5000 Ada (32GB) / Dual RTX 6000 Ada (48GB)', '4 TB PCIe 5.0 NVMe Scratch Array']
    ],
    note: 'Parametric feature trees (SolidWorks, Revit, AutoCAD, NX) rebuild sequentially on 1 CPU thread—prioritize max single-core GHz over high core counts.'
  },
  'cad-command-cross-translator': {
    headers: ['Engineering Operation', 'AutoCAD / ZWCAD / BricsCAD', 'SolidWorks', 'Siemens NX', 'Autodesk Inventor', 'PTC Creo Parametric'],
    rows: [
      ['2D Sketch Creation', 'PLINE / LINE (L)', 'Sketch (Insert Sketch)', 'Sketch in Task Env (S)', 'Start 2D Sketch (S)', 'Sketch (Extrude/Placement)'],
      ['Linear Solid Extrusion', 'EXTRUDE (EXT) / PRESSPULL', 'Extruded Boss/Base', 'Extrude (X)', 'Extrude (E)', 'Extrude Protrusion / Cut'],
      ['Revolved Solid Feature', 'REVOLVE (REV)', 'Revolved Boss/Base', 'Revolve (Shift+X)', 'Revolve (R)', 'Revolve'],
      ['Path Sweep / Pipe', 'SWEEP', 'Swept Boss/Base', 'Sweep Along Guide / Tube', 'Sweep (Ctrl+Shift+S)', 'Sweep / Helical Sweep'],
      ['Multi-Section Loft / Blend', 'LOFT', 'Lofted Boss/Base', 'Through Curves / Studio Surface', 'Loft', 'Blend / Swept Blend'],
      ['Edge Fillet / Round', 'FILLET (F)', 'Fillet', 'Edge Blend (B)', 'Fillet (F)', 'Round (Ctrl+F)'],
      ['Assembly Positioning', 'ALIGN / BLOCK INSERT', 'Mate (Coincident, Concentric)', 'Assembly Constraints (C)', 'Constrain (C) / Joint (J)', 'Component Placement (Coincident)'],
      ['Duplicate Pattern', 'ARRAY (AR)', 'Linear / Circular Pattern', 'Pattern Feature / Component', 'Rectangular / Circular Pattern', 'Pattern (Dimension / Axis)'],
      ['Hollow Thin-Wall Part', 'SHELL (SOLIDEDIT)', 'Shell', 'Shell', 'Shell', 'Shell'],
      ['Section View Inspection', 'SECTIONPLANE', 'Section View', 'Edit Section (Ctrl+H)', 'Half Section View', 'View Manager -> Cross Section']
    ],
    note: 'Cross-ecosystem command and feature terminology mapping for engineers migrating between 2D/3D CAD platforms.'
  },
  'perpetual-cad-migration-compatibility-matrix': {
    headers: ['Platform Name', 'License Model (2026)', 'One-Time Buyout Price (Est.)', '5-Year Total Cost (TCO)', 'Native File Kernel', 'LISP / VBA / API Support', 'Best Migration Target For'],
    rows: [
      ['AutoCAD (Subscription Ref)', 'Annual Rental Only', 'N/A ($2,030 / yr)', '~$10,150 / seat', 'TrustedDWG (AC1032)', 'AutoLISP, VBA, .NET, ObjectARX', 'Baseline reference (Zero ownership after cancel)'],
      ['ZWCAD Professional', 'Perpetual Buyout (Optional Maint.)', '~$899 – $1,199 one-time', '~$1,199 / seat (Saves 88%)', 'Native DWG (R14 to 2025+)', 'Full AutoLISP, VLISP, VBA, ZRX', 'Heavy 2D/3D AutoCAD drafting & LISP-dependent teams'],
      ['BricsCAD Pro / BIM / Mech', 'Perpetual Buyout or Sub', '~$1,060 – $1,550 one-time', '~$1,550 / seat (Saves 84%)', 'Native DWG + ACIS 3D Kernel', 'Fast LISP (OpenLISP), BRX, .NET', 'Power users needing 2D DWG + parametric 3D/Sheet Metal'],
      ['GStarCAD Professional', 'Perpetual Buyout', '~$799 – $990 one-time', '~$990 / seat (Saves 90%)', 'Native DWG (AC1032)', 'VLISP, VBA, GRX, .NET', 'High-speed large DWG opening & dynamic block editing'],
      ['progeCAD Professional', 'Perpetual Buyout (No Dongle Lock)', '~$399 – $490 one-time', '~$490 / seat (Saves 95%)', 'IntelliCAD / ODA DWG', 'AutoLISP, SDS, COM, .NET', 'Small/medium firms seeking lowest cost per perpetual seat'],
      ['DWG FastView Pro (Web/Mobile/PC)', 'Free Tier / Low-Cost VIP', '~$0 – $49 / yr', '~$195 / 5-yrs (Saves 98%)', 'Fast Cloud & Local DWG/3D', 'Markup, Measure, Layer, PDF/Print', 'Offloading 70% of non-drafting review, shop-floor & site seats'],
      ['FreeCAD 1.0+', 'Open-Source (LGPLv2+)', '$0 Forever', '$0 / seat (Saves 100%)', 'OpenCASCADE (OCCT) B-Rep', 'Full Python 3 API & Macros', 'Zero-budget parametric 3D mechanical, FEM & CAM workflows']
    ],
    note: '5-Year TCO calculated per single seat based on published MSRP. Pairing 2 perpetual authoring seats with 8 DWG FastView review seats cuts team licensing costs by up to 92%.'
  },
  'smartplant-3d-shortcuts-sheet': {
    headers: ['Key / Combination', 'SmartPlant 3D (SP3D / S3D) Command', 'Task Environment', 'Engineering Workflow Description'],
    rows: [
      ['F5', 'Refresh View / Active Workspace', 'Global Workspace', 'Refreshes the active graphic view and updates geometry from the Plant Database'],
      ['F6', 'PinPoint: Lock East (E / X) Axis', 'PinPoint Coordinate Bar', 'Locks or unlocks the East (X) relative coordinate offset during pipe/equipment placement'],
      ['F7', 'PinPoint: Lock North (N / Y) Axis', 'PinPoint Coordinate Bar', 'Locks or unlocks the North (Y) relative coordinate offset during routing'],
      ['F8', 'PinPoint: Lock Elevation (El / Z) Axis', 'PinPoint Coordinate Bar', 'Locks vertical elevation (Z) to maintain flat or sloped pipe run grade'],
      ['F9', 'Reposition PinPoint Target Origin', 'PinPoint Coordinate Bar', 'Moves the green PinPoint relative reference target to a new nozzle, grid line, or vertex'],
      ['F12', 'Activate Relative Tracking', 'SmartSketch / PinPoint', 'Toggles relative distance/angle tracking from the last clicked piping node'],
      ['Ctrl + W', 'Define Workspace (Filter)', 'Workspace Explorer', 'Opens the Define Workspace dialog (Ctrl+W) to filter plant systems, areas, or disciplines'],
      ['Ctrl + R', 'Refresh Workspace from DB', 'Global Database Sync', 'Synchronizes local session with changes committed by other engineers in the model'],
      ['Ctrl + T', 'To-Do List (TDL) Dialog', 'Diagnostics & Errors', 'Opens the To-Do List to inspect and resolve disconnected ports or out-of-date spec items'],
      ['Alt + F1', 'Surface Style (Shaded / Wireframe)', 'Graphic View', 'Cycles display style between Smooth Shaded, Wireframe, and Hidden Line'],
      ['Ctrl + P', 'Fit View to Selection', 'View Navigation', 'Zooms and centers the active 3D viewport tightly around selected pipe runs or equipment'],
      ['Mid-Click Drag', 'Rotate 3D View Orbit', 'View Navigation', 'Orbits the camera around the active center of rotation in the 3D plant model']
    ],
    note: 'Applicable to Hexagon Smart 3D (formerly Intergraph SmartPlant 3D / SP3D) Piping, Equipment, Structure, and Hangers & Supports tasks.'
  },
  'eplan-shortcuts-sheet': {
    headers: ['Key / Shortcut', 'EPLAN Electric P8 Function', 'Category', 'Electrical Schematic & Panel Design Usage'],
    rows: [
      ['Insert', 'Symbol Selection Dialog', 'Schematic Drafting', 'Opens the IEC/NFPA symbol browser to place contactors, breakers, coils, or motors'],
      ['G', 'Insert Device (Navigator)', 'Device Management', 'Places a specific manufacturer part number directly onto the active schematic page'],
      ['Shift + F3', 'T-Node (Down / Right)', 'Autoconnecting', 'Inserts a T-node wire junction with target tracking downward/right'],
      ['Shift + F4 / F5 / F6', 'T-Node Direction Variants', 'Autoconnecting', 'Inserts T-nodes oriented Up/Left, Right/Left, or Down/Up for DIN 61346 compliance'],
      ['Ctrl + Shift + U', 'Interruption Point (Arrow)', 'Cross-Page Wiring', 'Places a source/target potential arrow to continue a wire across multiple schematic sheets'],
      ['F11', 'Insert Black Box (Device Box)', 'Complex Devices / VFD', 'Draws a customizable boundary box for PLCs, VFDs, or custom PCB assemblies'],
      ['Shift + F11', 'Insert Structure Box', 'Location / Cabinet', 'Defines a mounting location (= Function / + Location) boundary on the page'],
      ['T', 'Insert Text Annotation', 'Documentation', 'Places free-standing technical text or function text on the schematic'],
      ['Ctrl + D', 'Edit Object Properties', 'Property Dialog', 'Opens the full Device Tag (DT), terminal designation, and part assignment dialog'],
      ['F5', 'Redraw / Refresh Page', 'View & Verification', 'Refreshes autoconnecting lines and updates cross-reference contact mirrors'],
      ['Page Up / Page Down', 'Previous / Next Schematic Page', 'Page Navigator', 'Rapidly flips through multi-hundred-page electrical project documentation'],
      ['U', 'Toggle Invisible Elements', 'Diagnostics', 'Shows or hides invisible insertion points, property texts, and macro handles']
    ],
    note: 'Verified for EPLAN Electric P8 (2022–2026 Platform) standard IEC 81346 and NFPA 79 keyboard profiles.'
  },
  'plant3d-shortcuts-sheet': {
    headers: ['Command / Alias', 'AutoCAD Plant 3D Function', 'Discipline', 'Piping & P&ID Engineering Description'],
    rows: [
      ['PLANTPIPEADD', 'Route Pipe (Spec-Driven)', '3D Piping', 'Starts interactive 3D pipe routing using the active Piping Spec and Nominal Diameter'],
      ['PLANTCOMPASS', 'Toggle Routing Compass', '3D Piping', 'Toggles the 3D routing compass tick marks, angle snaps, and elevation slope locks'],
      ['PLANTPARTCONVERT', 'Convert AutoCAD Solid to Part', 'Equipment / Custom', 'Converts a generic 3D DWG block or solid into an intelligent Plant 3D valve/fitting with ports'],
      ['PLANTEQUIPMENTCREATE', 'Create Parametric Equipment', 'Equipment Modeling', 'Opens the vessel, pump, heat exchanger, and tank parametric builder'],
      ['PLANTSPECUPDATECHECK', 'Check Spec Updates', 'Spec Management', 'Audits the 3D model against updated .pspx Piping Spec files and flags changed components'],
      ['PLANTPRODUCTIONISO', 'Generate Production Isometric', 'Isometrics (ISOGEN)', 'Extracts shop-ready PCF and DWG/PDF piping isometric drawings with weld BOM tables'],
      ['PLANTQUICKISO', 'Generate Quick Iso Check', 'Isometrics (ISOGEN)', 'Runs a fast preview isometric on selected pipe lines to verify connectivity before issue'],
      ['PLANTORTHOCREATE', 'Create 2D Orthographic View', 'Ortho Drawings', 'Generates associative 2D plan and section general arrangement (GA) views from the 3D plant'],
      ['PLANTPIDLINELIST', 'P&ID Line List Palette', 'P&ID Integration', 'Opens the P&ID data list to place 2D schematic valves/lines directly into the 3D model'],
      ['PLANTINSULATIONDISPLAY', 'Toggle Pipe Insulation', 'Viewport Display', 'Switches 3D thermal/acoustic insulation thickness display on or off for clash checking'],
      ['PLANTAUDIT', 'Audit Plant 3D Database', 'Database Maintenance', 'Repairs broken links between 3D drawing entities and the SQLite/SQL Server project database'],
      ['Ctrl + Right-Click', 'Toggle Pipe Elevation / Offset Snap', '3D Routing', 'Cycles pipe justification between Center of Pipe (COP), Bottom of Pipe (BOP), and Top (TOP)']
    ],
    note: 'Applicable to Autodesk AutoCAD Plant 3D (2020–2026) P&ID, 3D Piping, Equipment, and Orthographic modules.'
  },
  'navisworks-shortcuts-sheet': {
    headers: ['Shortcut Key', 'Navisworks Command', 'Module', 'BIM Coordination & Walkthrough Function'],
    rows: [
      ['Ctrl + 1', 'Walk Mode (First-Person)', 'Navigation', 'Activates first-person walkthrough navigation (use Arrow keys / WASD to walk through model)'],
      ['Ctrl + 2', 'Look Around Mode', 'Navigation', 'Pivots camera view from a fixed standing position inside mechanical rooms'],
      ['Ctrl + 7', 'Orbit Mode', 'Navigation', 'Rotates camera around the current selection focus point'],
      ['Ctrl + G', 'Toggle Gravity (Walk on Floors)', 'Realism', 'Enables gravity so the avatar walks up stairs and slabs instead of floating'],
      ['Ctrl + D', 'Toggle Collision Detection', 'Realism', 'Prevents the camera from passing through walls, ducts, and structural columns'],
      ['Ctrl + F2', 'Clash Detective Window', 'Clash Detection', 'Opens the Clash Detective module (Navisworks Manage) to run hard/clearance clash tests'],
      ['Ctrl + F12', 'Selection Tree Palette', 'Model Hierarchy', 'Displays the full NWC/NWD/IFC file, layer, level, and family hierarchy tree'],
      ['Shift + F3', 'Find Items (Search Sets)', 'Query & Filter', 'Opens Find Items to build automated Search Sets by Revit Category, System, or IFC Property'],
      ['Ctrl + H', 'Hide Selected / Unhide', 'Visibility', 'Instantly hides selected ceiling/wall elements to inspect concealed MEP ductwork'],
      ['Page Up', 'Zoom All (Fit Model)', 'View', 'Zooms viewport out to display the entire federated project site'],
      ['F11', 'Full Screen Viewport', 'Presentation', 'Maximizes the 3D scene across the entire monitor for client BIM coordination meetings'],
      ['Ctrl + F7', 'Properties Palette', 'Metadata Inspection', 'Displays all BIM parameters, Revit Element IDs, and IFC Psets for the selected object']
    ],
    note: 'Compatible with Autodesk Navisworks Manage, Navisworks Simulate, and free Navisworks Freedom (.NWD) viewers.'
  }`;

const refTarget = `'sheet-metal-bend-deduction-chart': {\n    headers: ['Sheet Thickness T (mm)', 'Gauge Equiv (Steel)', 'Recommended V-Die (mm)', 'Inside Radius R (mm)', 'K-Factor (Air Bend)', '90° Bend Allowance BA (mm)', '90° Bend Deduction BD (mm)'],\n    rows: [\n      ['1.0 mm', '20 Ga (0.91mm)', 'V8', '1.0 mm', '0.42', '2.23 mm', '1.77 mm'],\n      ['1.2 mm', '18 Ga (1.21mm)', 'V10', '1.2 mm', '0.42', '2.68 mm', '2.12 mm'],\n      ['1.5 mm', '16 Ga (1.52mm)', 'V12', '1.5 mm', '0.43', '3.37 mm', '2.63 mm'],\n      ['2.0 mm', '14 Ga (1.90mm)', 'V16', '2.0 mm', '0.43', '4.49 mm', '3.51 mm'],\n      ['2.5 mm', '12 Ga (2.66mm)', 'V20', '2.5 mm', '0.44', '5.65 mm', '4.35 mm'],\n      ['3.0 mm', '11 Ga (3.04mm)', 'V24', '3.0 mm', '0.44', '6.79 mm', '5.21 mm'],\n      ['4.0 mm', '8 Ga (4.18mm)', 'V32', '4.0 mm', '0.45', '9.11 mm', '6.89 mm'],\n      ['5.0 mm', '6 Ga (4.94mm)', 'V40', '5.0 mm', '0.45', '11.39 mm', '8.61 mm'],\n      ['6.0 mm', '3 Ga (6.07mm)', 'V50', '6.0 mm', '0.46', '13.76 mm', '10.24 mm']\n    ],\n    note: 'Calculated for 90° air bending on cold-rolled mild steel (V = 8×T rule): BA = (π/2)·(R + K·T), BD = 2·(R + T) - BA.'\n  }`;

if (!content.includes('cad-hardware-workstation-spec-builder')) {
  if (!content.includes(refTarget)) {
    console.error('Could not find sheet-metal-bend-deduction-chart target!');
    process.exit(1);
  }
  content = content.replace(refTarget, refTarget + extraRefDatasets);
}

// 2. Add specialized TROUBLESHOOT_DATASETS for SP3D, NX STEP, and Civil 3D
const extraTroubleshoot = `,
  smartplant3d: {
    softwareName: 'Hexagon SmartPlant 3D (SP3D / Smart 3D)',
    symptoms: [
      'Piping Specification not found in Catalog or NPD (Nominal Piping Diameter) unavailable',
      'To-Do List (TDL) displays disconnected port or eccentric reducer elevation mismatch',
      'ISOGEN Isometric Drawing extraction fails with "Disconnected Pipeline" or zero-length weld',
      'Session file (.ses) fails to refresh or hangs during Define Workspace (Ctrl+W) query'
    ],
    steps: [
      {
        step: 1,
        title: 'Synchronize Active Workspace & Verify Catalog Connection',
        cmd: 'Ctrl + R (Refresh Workspace)',
        desc: 'Ensure local session cache matches the Plant, Catalog, and Site SQL/Oracle databases.',
        detail: 'In Project Management, run "Synchronize Model with Catalog" (uncheck "Regenerate Out-of-Date Occurrences" first for fast check) to pull newly added Piping Specs and Bolt/Gasket tables.'
      },
      {
        step: 2,
        title: 'Resolve To-Do List (TDL) Disconnected Ports & Spec Breaks',
        cmd: 'Ctrl + T (To-Do List)',
        desc: 'Inspect and update out-of-date piping occurrences and broken nozzle connections.',
        detail: 'Open To-Do List (Ctrl+T), right-click failed piping features -> Properties, and click "Update". For eccentric reducers, ensure BOP (Bottom of Pipe) flat-side orientation matches the mating pipe run.'
      },
      {
        step: 3,
        title: 'Verify Pipeline Continuity Before ISOGEN Extraction',
        cmd: 'Piping Task -> Check Pipeline Connectivity',
        desc: 'Locate micro-gaps, open pipe ends, or unplaced gaskets blocking PCF generation.',
        detail: 'Select the Pipeline in Workspace Explorer, run "Diagnostics -> Check Connectivity". Any open end without a blind flange, cap, or continuation nozzle will cause ISOGEN to split the isometric.'
      },
      {
        step: 4,
        title: 'Clear Corrupted Local SP3D User Preferences & Symbol Share Cache',
        desc: 'Rebuild local XML symbol cache when custom valves or hangers fail to render.',
        detail: 'Close Smart 3D. Clear temporary cache files under %TEMP% and verify read permissions on the network SharedContent (Symbol Share) directory.'
      }
    ],
    envVars: [
      { name: 'SharedContent Path', recommended: 'UNC Network Path (\\\\Server\\SharedContent)', desc: 'Must use identical UNC path across all clients—never use mapped drive letters (e.g. S:\\).' },
      { name: 'PinPoint Lock', recommended: 'F6 / F7 / F8 Active', desc: 'Prevents accidental off-axis diagonal pipe skewing (<0.1 deg) that breaks isometric ortho views.' },
      { name: 'Workspace Scope', recommended: 'System + Volume Filter', desc: 'Restrict Ctrl+W filter to specific Unit/Area to keep memory footprint under 6 GB.' }
    ]
  },
  nx_step: {
    softwareName: 'Siemens NX (STEP AP214 / AP242 Translator)',
    symptoms: [
      'Exported STEP file opens empty or misses sub-assembly components in SolidWorks / CATIA',
      '3D PMI (GD&T tolerances and datum targets) disappear after STEP AP242 export',
      'Solid bodies export as open sheet bodies (surfaces) with unsewn boundary edges',
      'External STEP translator console window freezes at 99% on large assemblies'
    ],
    steps: [
      {
        step: 1,
        title: 'Enforce "MODEL" or "Entire Part" Reference Set Before Export',
        cmd: 'Assemblies -> Reference Sets -> MODEL',
        desc: 'Prevent sub-components set to "Empty" reference set from being skipped by the translator.',
        detail: 'In NX Assembly Navigator, select all components, right-click -> Replace Reference Set -> MODEL. In the STEP Export dialog under "Data to Export", select Selected Objects -> Solid Bodies.'
      },
      {
        step: 2,
        title: 'Enable Semantic 3D PMI Output in STEP AP242 Settings',
        cmd: 'File -> Export -> STEP -> Settings -> PMI',
        desc: 'Include machine-readable GD&T annotations and section views in ISO 10303-242 output.',
        detail: 'Use the STEP242 translator (not legacy STEP203). Under Export Settings -> Object Types, check "Product Data (PMI)" and set PMI Reference Geometry to "Graphical & Semantic".'
      },
      {
        step: 3,
        title: 'Run "Examine Geometry" to Heal Tiny Edges & Sheet Gaps',
        cmd: 'Analysis -> Examine Geometry',
        desc: 'Identify self-intersecting faces, tiny edges (<0.02mm), and unsewn sheet bodies.',
        detail: 'Check "Tiny", "Misaligned", and "Sheet Boundaries". Use "Heal Geometry" or "Optimize Face" in NX Synchronous Modeling before exporting to ensure watertight B-Rep solids.'
      },
      {
        step: 4,
        title: 'Set B-Rep Tolerance & Flatten Assembly Structure if Required',
        desc: 'Match Parasolid 0.01mm modeling tolerance to target CAD kernel.',
        detail: 'In STEP Export Advanced tab, set Distance Tolerance to 0.01 mm (or 0.0254 mm). Check "Export Assembly as External References" only if recipient wants separate part files.'
      }
    ],
    envVars: [
      { name: 'Application Protocol', recommended: 'STEP AP242 (ISO 10303-242)', desc: 'Supports colors, layers, assembly trees, and semantic 3D PMI in a single file.' },
      { name: 'Reference Set', recommended: 'MODEL (Solid Bodies)', desc: 'Crucial NX setting—components on "Empty" reference set will not export to STEP.' },
      { name: 'B-Spline Approximation', recommended: '0.01 mm', desc: 'Prevents high-degree NURBS surfaces from tearing when imported into ACIS/CGM kernels.' }
    ]
  },
  civil3d: {
    softwareName: 'Autodesk Civil 3D (Surfaces & Corridors)',
    symptoms: [
      'Viewport freezes for 30+ seconds every time a profile or alignment grip is moved',
      'Error: "Associated .mms file not found" when opening a drawing with large TIN surface',
      'Corridor rebuild takes minutes and consumes 100% of a single CPU core',
      'File size exceeds 80 MB with slow QSAVE and eTransmit packaging failures'
    ],
    steps: [
      {
        step: 1,
        title: 'Enable Level of Detail (LEVELOFDETAIL) for Dense TIN Surfaces',
        cmd: 'LEVELOFDETAIL',
        desc: 'Dynamically reduces displayed triangle count when zoomed out without altering surface accuracy.',
        detail: 'Type LEVELOFDETAIL on the command line (or View tab -> Level of Detail). Civil 3D will decimate screen display contours when zoomed out and restore 100% precision as you zoom in.'
      },
      {
        step: 2,
        title: 'Externalize Surfaces & Alignments via Data Shortcuts (DREF)',
        cmd: 'CREATEFOLDER / CREATESHORTCUTS',
        desc: 'Split monolithic project files into separate Surface, Alignment, Corridor, and Sheet drawings.',
        detail: 'Never keep a 5-million-point LiDAR TIN surface, 10 corridors, and 50 plan/profile sheets in one DWG. Reference the surface via Data Shortcuts (DREF) as "Reference Only" display style.'
      },
      {
        step: 3,
        title: 'Switch Corridor Rebuild Mode from Automatic to Manual',
        cmd: 'Prospector -> Corridors -> Rebuild - Automatic (Uncheck)',
        desc: 'Prevent Civil 3D from recalculating thousands of assembly stations on every minor edit.',
        detail: 'In Toolspace -> Prospector, expand Corridors, right-click your corridor and uncheck "Rebuild - Automatic". Batch your alignment/profile edits and trigger a single manual Rebuild when ready.'
      },
      {
        step: 4,
        title: 'Keep .MMS Memory-Mapped Surface File in Same Directory as .DWG',
        desc: 'When a TIN surface exceeds ~2 million points, Civil 3D offloads data to an external .mms file.',
        detail: 'Always copy or archive the <DrawingName>_<SurfaceId>.mms file alongside the .dwg. To embed a smaller cropped boundary inside the DWG, add a "Data Clip" outer boundary first.'
      }
    ],
    envVars: [
      { name: 'LEVELOFDETAIL', recommended: 'ON (1)', desc: 'Halves GPU viewport regeneration time on large grading and LiDAR TIN surfaces.' },
      { name: 'PROXYGRAPHICS', recommended: '0 (During Design)', desc: 'Avoids saving megabytes of static proxy graphics images on every QSAVE.' },
      { name: 'ISAVEPERCENT', recommended: '0', desc: 'Forces full clean saves instead of incremental saves that fragment large Civil 3D databases.' }
    ]
  }`;

const tsTarget = `      { name: 'Virtual Memory (Paging File)', recommended: '2x System RAM', desc: 'Configure Windows paging file on high-speed NVMe to prevent RAM exhaustion during meshing.' }\n    ]\n  }`;
if (!content.includes('smartplant3d: {')) {
  content = content.replace(tsTarget, tsTarget + extraTroubleshoot);
}

// Update troubleshootData routing
content = content.replace(
  `    if (s.includes('revit') || s.includes('bim')) return TROUBLESHOOT_DATASETS.revit;`,
  `    if (s.includes('smartplant') || s.includes('sp3d')) return TROUBLESHOOT_DATASETS.smartplant3d;\n    if (s.includes('nx-step') || (s.includes('nx') && s.includes('step'))) return TROUBLESHOOT_DATASETS.nx_step;\n    if (s.includes('civil3d') || s.includes('corridor')) return TROUBLESHOOT_DATASETS.civil3d;\n    if (s.includes('revit') || s.includes('bim')) return TROUBLESHOOT_DATASETS.revit;`
);

// 3. Add INITIAL_PARAMS for the new calculators
content = content.replace(
  `  'cam-profile-generator': [40, 15, 120],`,
  `  'cam-profile-generator': [40, 15, 120],\n  'step-file-size-reducer': [240, 65, 1.0],\n  'stl-mesh-decimator-reducer': [2500, 75, 0.02],\n  'ifc-model-size-optimizer': [450, 70, 1.0],\n  'cad-subscription-vs-perpetual-roi-calculator': [10, 2030, 899],\n  'cad-floating-license-seat-calculator': [35, 3.0, 2200],`
);

// 4. Add 1-to-1 calculator schemas in calcSchema
const newCalcSchemas = `
    // A1. STEP / SLDASM 装配体去特征瘦身计算器 (step-file-size-reducer)
    if (s === 'step-file-size-reducer') {
      return {
        labelA: 'Original STEP / Assembly Size (MB)',
        labelB: 'Defeature Level (% Fasteners & Fillets Stripped, 10–90%)',
        labelC: 'Compression Mode (1 = Uncompressed .stp, 2 = .stp.Z / 7z)',
        formula: 'Size_defeatured = S_orig · (1 − 0.78 · η_defeature) • Size_archive = Size_defeatured · (Mode ≥ 2 ? 0.22 : 1.0)',
        unit: 'MB (Optimized)',
        secondaryLabel: 'Total Size Reduction & Estimated Email/Upload Readiness',
        desc: 'Projected STEP File Footprint After Removing Internal Hardware, Threads & Small Fillets',
        calc: (a: number, b: number, c: number) => {
          const orig = Math.max(1, a);
          const stripPct = Math.max(5, Math.min(95, b)) / 100;
          const isZipped = c >= 1.5;
          const afterDefeature = orig * (1 - 0.78 * stripPct);
          const finalMb = isZipped ? afterDefeature * 0.22 : afterDefeature;
          const savedPct = ((1 - finalMb / orig) * 100).toFixed(1);
          return {
            primary: finalMb.toFixed(1),
            secondary: \`-\${savedPct}% Saved (\${orig.toFixed(0)} MB → \${finalMb.toFixed(1)} MB\${isZipped ? ' + ZIP' : ''})\`,
            pass: finalMb <= 50
          };
        }
      };
    }

    // A2. 3D 打印 STL / OBJ 网格减面与二进制体积换算器 (stl-mesh-decimator-reducer)
    if (s === 'stl-mesh-decimator-reducer') {
      return {
        labelA: 'Original Triangle Count (×1,000 Facets, e.g. 2500 = 2.5M)',
        labelB: 'Target Decimation Reduction Ratio (%, 10–95%)',
        labelC: 'Chordal Tolerance Deviation (mm)',
        formula: 'N_rem = N_orig · (1 − R_dec) • Size_Bin = (N_rem · 50 bytes + 84) / 1024² • Size_ASCII ≈ 5.2 × Size_Bin',
        unit: 'MB (Binary STL)',
        secondaryLabel: 'Remaining Triangles & ASCII vs. Binary Savings',
        desc: 'Exact Binary STL File Size (50 Bytes/Triangle) After Mesh Decimation',
        calc: (a: number, b: number, c: number) => {
          const origK = Math.max(1, a);
          const decRatio = Math.max(0, Math.min(98, b)) / 100;
          const remTriangles = origK * 1000 * (1 - decRatio);
          const binMb = (remTriangles * 50 + 84) / (1024 * 1024);
          const origAsciiMb = (origK * 1000 * 260) / (1024 * 1024);
          return {
            primary: binMb.toFixed(2),
            secondary: \`\${(remTriangles / 1000).toFixed(0)}k tris (vs \${origAsciiMb.toFixed(0)} MB ASCII) • Tol: \${c.toFixed(3)} mm\`,
            pass: binMb <= 100 && c <= 0.05
          };
        }
      };
    }

    // A3. BIM Revit to IFC 模型体积优化与 IFCZIP 计算器 (ifc-model-size-optimizer)
    if (s === 'ifc-model-size-optimizer') {
      return {
        labelA: 'Uncompressed .IFC File Size (MB)',
        labelB: 'Tessellation & Property Strip Factor (%, 20–85%)',
        labelC: 'Enable IFCZIP Archive Packaging (1 = .ifcZip, 0 = Raw .ifc)',
        formula: 'S_clean = S_raw · (1 − 0.65 · η_lod) • S_ifczip = S_clean · 0.18 (ISO 10303-21 ZIP Deflate)',
        unit: 'MB',
        secondaryLabel: 'Total Reduction Ratio & CDE Upload Status',
        desc: 'Optimized IFC4 Reference View / IFCZIP Deliverable Footprint',
        calc: (a: number, b: number, c: number) => {
          const rawMb = Math.max(1, a);
          const optRatio = Math.max(0, Math.min(90, b)) / 100;
          const useZip = c >= 0.5;
          const cleanedMb = rawMb * (1 - 0.65 * optRatio);
          const finalMb = useZip ? cleanedMb * 0.18 : cleanedMb;
          const reduction = ((1 - finalMb / rawMb) * 100).toFixed(1);
          return {
            primary: finalMb.toFixed(1),
            secondary: \`-\${reduction}% (\${rawMb.toFixed(0)} MB → \${finalMb.toFixed(1)} MB \${useZip ? '.ifcZIP' : '.ifc'})\`,
            pass: finalMb <= 150
          };
        }
      };
    }

    // B1. CAD 订阅制 vs 永久买断制 5 年总成本 TCO 计算器 (cad-subscription-vs-perpetual-roi-calculator)
    if (s === 'cad-subscription-vs-perpetual-roi-calculator') {
      return {
        labelA: 'Total Engineering Seats in Team',
        labelB: 'Annual Subscription Cost per Seat ($/yr, e.g. 2030)',
        labelC: 'One-Time Perpetual Buyout Price ($/seat, e.g. 899)',
        formula: 'TCO_sub(5yr) = N · P_sub · 5 • TCO_perp(5yr) = N · (P_buyout + 0.20·P_buyout) • Savings = TCO_sub − TCO_perp',
        unit: 'USD Saved (5-Yr)',
        secondaryLabel: 'Break-Even Payback Period & 5-Year Cost Comparison',
        desc: 'Net 5-Year Capital Savings by Switching from SaaS Rental to Perpetual CAD Licenses',
        calc: (a: number, b: number, c: number) => {
          const seats = Math.max(1, Math.round(a));
          const subYr = Math.max(100, b);
          const perpOnce = Math.max(100, c);
          const tcoSub5 = seats * subYr * 5;
          const tcoPerp5 = seats * Math.round(perpOnce * 1.2); // includes 1 optional upgrade cycle
          const savings = Math.max(0, tcoSub5 - tcoPerp5);
          const breakEvenMonths = ((perpOnce / subYr) * 12).toFixed(1);
          return {
            primary: \`$\${savings.toLocaleString('en-US')}\`,
            secondary: \`Payback: \${breakEvenMonths} mos ($\${tcoPerp5.toLocaleString('en-US')} vs $\${tcoSub5.toLocaleString('en-US')})\`,
            pass: savings > 0
          };
        }
      };
    }

    // B2. 浮动网络授权 (FLEXlm) 并发席位配比计算器 (cad-floating-license-seat-calculator)
    if (s === 'cad-floating-license-seat-calculator') {
      return {
        labelA: 'Total Engineers & Reviewers in Department',
        labelB: 'Concurrent Sharing Ratio (e.g. 3.0 = 1 Seat per 3 Users)',
        labelC: 'Annual Cost per Full Authoring Seat ($/yr)',
        formula: 'Seats_req = ceil(N_users / R_concurrent) + 1_buffer • Savings = (N_users − Seats_req) · Cost_seat',
        unit: 'Floating Seats',
        secondaryLabel: 'Annual License Budget Saved via Viewer Offloading',
        desc: 'Recommended Floating Network Pool Size & Annual Savings (Offloading Reviewers to DWG FastView)',
        calc: (a: number, b: number, c: number) => {
          const totalUsers = Math.max(2, Math.round(a));
          const ratio = Math.max(1.1, Math.min(8, b));
          const seatCost = Math.max(200, c);
          const reqSeats = Math.min(totalUsers, Math.ceil(totalUsers / ratio) + 1);
          const savedSeats = Math.max(0, totalUsers - reqSeats);
          const annualSaved = savedSeats * seatCost;
          return {
            primary: \`\${reqSeats} Seats\`,
            secondary: \`Save $\${annualSaved.toLocaleString('en-US')}/yr (\${savedSeats} review seats offloaded)\`,
            pass: reqSeats < totalUsers
          };
        }
      };
    }
`;

content = content.replace(
  `    // 0. 螺纹最小旋合长度校核 (thread-engagement-length-checker)`,
  `${newCalcSchemas}\n    // 0. 螺纹最小旋合长度校核 (thread-engagement-length-checker)`
);

// 5. Add CSV Export & Print A4 Cheat Sheet handlers + Format Size Reduction Suite banner
const csvHelperCode = `  const handleExportCsv = () => {
    if (!referenceData) return;
    const escapeCsv = (val: string) => \`"\${val.replace(/"/g, '""')}"\`;
    const lines = [
      referenceData.headers.map(escapeCsv).join(','),
      ...filteredRows.map(r => r.map(escapeCsv).join(','))
    ];
    const blob = new Blob([lines.join('\\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${tool.slug}-reference.csv\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isCompressorFamily = [
    'online-cad-file-compressor',
    'dwg-file-size-reducer',
    'step-file-size-reducer',
    'stl-mesh-decimator-reducer',
    'ifc-model-size-optimizer'
  ].includes(tool.slug);
`;

if (!content.includes('handleExportCsv')) {
  content = content.replace(
    `  const handleDownloadGenerated = () => {`,
    `${csvHelperCode}\n  const handleDownloadGenerated = () => {`
  );
}

// 6. Upgrade Mode B (isCheatsheetOrLib) with Print A4 Cheat Sheet + Export CSV buttons + Print Header
const oldCheatsheetControls = `            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>`;

const newCheatsheetControls = `            <div className="flex flex-wrap items-center gap-2.5 print:hidden">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {referenceData && (
                <>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all"
                    title="Download Reference Table as CSV"
                  >
                    <FileCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all"
                    title="Print or Save as One-Page A4 PDF Cheat Sheet"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print A4 PDF</span>
                  </button>
                </>
              )}
            </div>`;

content = content.replace(oldCheatsheetControls, newCheatsheetControls);

// 7. Add Format-Specific File Size Reduction Suite banner for compressor family right above Section 4
const compressorSuiteBanner = `      {/* Specialized Format Size Reduction Matrix (For Compressor & Reducer Family) */}
      {isCompressorFamily && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-lg space-y-5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                Specialized Format Optimization Suite
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                Target Your Exact CAD / 3D File Format for Maximum Size Reduction
              </h3>
            </div>
            <Link
              href="/toolbox/online-cad-file-compressor"
              className="text-xs font-bold text-indigo-300 hover:text-white underline shrink-0"
            >
              Universal CAD Compressor Hub →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                slug: 'dwg-file-size-reducer',
                badge: '2D/3D DWG',
                title: 'DWG Bloat & RegApp Reducer',
                desc: 'Purge orphaned DGN linetypes, RegApps & scale lists (Up to 85% smaller).'
              },
              {
                slug: 'step-file-size-reducer',
                badge: 'STEP / SLDASM',
                title: 'STEP Assembly Defeature Calc',
                desc: 'Strip internal fasteners, threads & fillets for email-ready 3D STEP files.'
              },
              {
                slug: 'stl-mesh-decimator-reducer',
                badge: 'STL / OBJ Mesh',
                title: '3D Print Mesh Decimator',
                desc: 'Calculate polygon reduction & ASCII-to-Binary STL savings (80% smaller).'
              },
              {
                slug: 'ifc-model-size-optimizer',
                badge: 'Revit / IFC',
                title: 'BIM IFC & IFCZIP Optimizer',
                desc: 'Tune LoD facet tessellation & IFCZIP compression for large BIM models.'
              }
            ].map((item) => (
              <Link
                key={item.slug}
                href={\`/toolbox/\${item.slug}\`}
                className={\`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 \${
                  tool.slug === item.slug
                    ? 'bg-indigo-600/30 border-indigo-400 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50'
                }\`}
              >
                <div className="space-y-1.5">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {item.badge}
                  </span>
                  <h4 className="text-sm font-black text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1 pt-1">
                  <span>{tool.slug === item.slug ? '● Active Tool' : 'Open Optimizer →'}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Cross-Workflow Discovery & Recommendations */}`;

if (!content.includes('Specialized Format Size Reduction Matrix')) {
  content = content.replace(
    `      {/* 4. Cross-Workflow Discovery & Recommendations */}`,
    compressorSuiteBanner
  );
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully upgraded generic-toolbox-client.tsx with 7 datasets, 3 troubleshoot trees, 5 calculators, Print/CSV buttons, and Compressor Suite!');
