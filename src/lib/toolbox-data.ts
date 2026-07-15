export interface ToolboxItem {
  slug: string;
  title: string;
  description: string;
  detailDesc: string;
  category: 'cheatsheet' | 'calculator' | 'converter' | 'troubleshoot';
  status: 'released' | 'coming-soon';
  origin: 'native' | 'third-party';
  releasedDate?: string;
  keywords: string[];
}

export const TOOLBOX_CATEGORIES = [
  { id: 'all', name: 'All Utilities' },
  { id: 'cheatsheet', name: 'Cheat Sheets & References' },
  { id: 'calculator', name: 'Engineering Calculators' },
  { id: 'converter', name: 'Parsers & File Converters' },
  { id: 'troubleshoot', name: 'Troubleshooting Wizards' },
] as const;

export const TOOLBOX_DATA: ToolboxItem[] = [
  // ==================== NATIVE (50 Self-Developed Tools) ====================
  
  // released
  {
    slug: 'shortcuts',
    title: 'Cross-Platform CAD Shortcuts Matrix',
    description: 'Compare and print keyboard command shortcuts across AutoCAD, GstarCAD, ZWCAD, and DWG FastView.',
    detailDesc: 'An interactive matrix comparing over 30 essential drafting shortcuts across major CAD packages. Includes one-click command copying and optimized Landscape style layouts for office desk cheatsheet printing.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['cad shortcuts', 'autocad cheat sheet', 'gstarcad hotkeys', 'zwcad shortcuts', 'print shortcuts']
  },
  {
    slug: 'dwg-version-checker',
    title: 'AutoCAD DWG Version Checker & Compatibility Matrix',
    description: 'Drag and drop your .dwg drawing file to detect its internal AutoCAD file format version locally.',
    detailDesc: 'An instant, client-side binary parser reading the first 6 bytes of your DWG file header (e.g. AC1032, AC1027). Checks read/write compatibility across GstarCAD, ZWCAD, AutoCAD, and DWG FastView.',
    category: 'converter',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['dwg version checker', 'dwg header code', 'ac1032 compatibility', 'autocad drawing reader']
  },
  
  // coming-soon (native)
  {
    slug: 'solidworks-shortcuts-sheet',
    title: 'SolidWorks Essential Keyboard Shortcuts List',
    description: 'Printable list of SolidWorks sketch, assembly, and drawing hotkeys and mouse gestures.',
    detailDesc: 'A comprehensive, searchable index of SolidWorks shortcuts, including standard hotkeys, S-key shortcuts, and customizable mouse gestures. Highly optimized for print and quick lookup.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['solidworks shortcuts', 'solidworks hotkeys', 'solidworks cheat sheet', 'sketch gestures']
  },
  {
    slug: 'rhino-shortcuts-sheet',
    title: 'Rhino 3D Shortcut Keys & Command Aliases Guide',
    description: 'Searchable database of Rhino 3D hotkeys, mouse modifiers, and customize command aliases.',
    detailDesc: 'Find all keyboard shortcuts and command aliases for Rhinoceros 3D. Compare defaults with popular industrial design keymaps and download custom .txt alias files.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['rhino shortcuts', 'rhino aliases', 'rhinoceros 3d hotkeys', 'industrial design hotkeys']
  },
  {
    slug: 'revit-shortcuts-sheet',
    title: 'Revit Keyboard Shortcuts & Command Codes Table',
    description: 'Quick reference sheet for Revit BIM modeling commands, modification tools, and view controls.',
    detailDesc: 'Searchable index of two-character Revit shortcuts. Categorized by Architecture, Structure, MEP, and View tabs to speed up your parametric BIM drafting workflow.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['revit shortcuts', 'bim keyboard shortcuts', 'revit keys', 'revit cheat sheet']
  },
  {
    slug: 'sketchup-shortcuts-sheet',
    title: 'SketchUp Pro Quick Reference Hotkeys Cheat Sheet',
    description: 'Quick lookup table for SketchUp drawing axes, tool keys, and view manipulation shortcuts.',
    detailDesc: 'Learn the primary drawing, camera, and layout shortcuts for SketchUp Pro. Includes key combinations for Windows and macOS.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['sketchup shortcuts', 'sketchup hotkeys', 'sketchup cheat sheet', 'sketchup mac shortcuts']
  },
  {
    slug: 'inventor-shortcuts-sheet',
    title: 'Autodesk Inventor Keyboard Shortcuts Reference',
    description: 'Printable list of Inventor assembly, drawing, and sheet metal design shortcut hotkeys.',
    detailDesc: 'Quickly find shortcuts in Inventor. Includes common keys for 2D/3D sketching, component placement, constraint options, and standard presentation tools.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['inventor shortcuts', 'inventor keys', 'autodesk inventor hotkeys', 'cad assembly shortcuts']
  },
  {
    slug: 'microstation-shortcuts-sheet',
    title: 'Bentley MicroStation V8i Keyboard Shortcuts Guide',
    description: 'Searchable index of MicroStation keyboard shortcuts, mouse shortcuts, and workspace mappings.',
    detailDesc: 'Learn the core key-ins and mouse shortcuts for MicroStation. Compare the drawing engine mappings to standard AutoCAD controls.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['microstation shortcuts', 'microstation hotkeys', 'microstation cheat sheet', 'bentley keys']
  },
  {
    slug: 'archicad-shortcuts-sheet',
    title: 'Graphisoft Archicad Keyboard Shortcuts Chart',
    description: 'Quick lookup cheat sheet for Archicad drawing, object placement, and 3D modeling shortcuts.',
    detailDesc: 'Explore all shortcut keys in Archicad Pro. Includes standard hotkeys, navigator modifiers, and custom keyboard layouts.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['archicad shortcuts', 'archicad hotkeys', 'graphisoft shortcuts', 'bim tool shortcuts']
  },
  {
    slug: 'catia-shortcuts-sheet',
    title: 'Dassault CATIA V5/V6 Key Shortcuts Table',
    description: 'Printable cheat sheet for CATIA Sketcher, Part Design, and Generative Shape Design shortcuts.',
    detailDesc: 'Quickly lookup shortcuts in CATIA. Optimize your mechanical assembly design workflows with customized mouse/keyboard modifiers.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['catia shortcuts', 'catia hotkeys', 'part design hotkeys', 'sketcher hotkeys']
  },
  {
    slug: 'creo-shortcuts-sheet',
    title: 'PTC Creo Parametric Shortcut Keys Reference',
    description: 'Essential keyboard shortcuts and mouse modifiers reference for PTC Creo 3D modeling and assembly.',
    detailDesc: 'Search all keyboard commands in Creo. Categorized by sketching, modeling, configuration variables, and custom macro triggers.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['creo shortcuts', 'creo parametric hotkeys', 'ptc creo cheat sheet', 'assembly hotkeys']
  },
  {
    slug: 'freecad-shortcuts-sheet',
    title: 'FreeCAD Open-Source CAD Hotkeys & Mouse Navigation',
    description: 'Searchable index of FreeCAD shortcuts for PartDesign, Draft, and TechDraw workbenches.',
    detailDesc: 'A complete index of hotkeys in FreeCAD. Includes navigation styles like Blender, CAD, and Inventor presets.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['freecad shortcuts', 'freecad workbenches', 'open source cad keys', 'partdesign hotkeys']
  },
  {
    slug: 'fusion360-shortcuts-sheet',
    title: 'Autodesk Fusion 360 Keyboard Hotkeys Reference',
    description: 'Printable reference for Fusion 360 sculpting, modeling, CAM path planning, and rendering tools.',
    detailDesc: 'Quickly search all shortcut keys in Fusion 360. Includes shortcuts for the parametric modeling environment, generative design, and CAM toolpaths.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['fusion 360 shortcuts', 'fusion 360 hotkeys', 'fusion 360 cheat sheet', 'cam hotkeys']
  },
  {
    slug: 'draftsight-shortcuts-sheet',
    title: 'DraftSight Keyboard Shortcuts & Command Aliases',
    description: 'Complete comparison of DraftSight keyboard commands and default aliases for AutoCAD switchers.',
    detailDesc: 'DraftSight matches AutoCAD command-for-command. Learn the key mappings and how to load AutoCAD .pgp alias files to transition seamlessly.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['draftsight shortcuts', 'draftsight aliases', 'draftsight vs autocad', 'cad key mappings']
  },
  {
    slug: 'bricscad-shortcuts-sheet',
    title: 'BricsCAD Hotkeys & Command Customization Guide',
    description: 'Interactive index of BricsCAD Lite, Pro, and BIM keyboard commands and quad cursor controls.',
    detailDesc: 'Compare BricsCAD shortcuts to standard CAD models. Includes quad cursor settings, shortcut customization paths, and custom command macros.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['bricscad shortcuts', 'quad cursor controls', 'bricscad command aliases', 'bricscad hotkeys']
  },
  {
    slug: 'vectorworks-shortcuts-sheet',
    title: 'Vectorworks Keyboard Shortcuts Reference Chart',
    description: 'Searchable cheat sheet for Vectorworks Architect, Landmark, and Spotlight drawing tools.',
    detailDesc: 'Quickly find Vectorworks tool shortcuts. Organized by tool palettes, rendering options, and view navigation settings.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['vectorworks shortcuts', 'vectorworks hotkeys', 'landmark tool keys', 'architect shortcuts']
  },
  {
    slug: 'autocad-vs-gstarcad-shortcuts',
    title: 'AutoCAD vs. GstarCAD Shortcut Command Diff Table',
    description: 'Detailed comparison highlighting the command differences and alias mappings between AutoCAD and GstarCAD.',
    detailDesc: 'While 99% of aliases are identical, some specialized commands differ. Use this diff comparison to transition your drafting office smoothly without breaking your muscle memory.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['autocad vs gstarcad', 'gstarcad command aliases', 'cad migration list', 'alias mapping']
  },
  {
    slug: 'autocad-vs-zwcad-shortcuts',
    title: 'AutoCAD vs. ZWCAD Command Shortcut Diff Guide',
    description: 'Identify the exact command and alias variations between AutoCAD and ZWCAD platforms.',
    detailDesc: 'Provides ZWCAD-specific aliases (e.g. SmartSelect) and compare them side-by-side with AutoCAD standard commands to prevent productivity loss.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['autocad vs zwcad', 'zwcad aliases', 'zwcad command difference', 'drafting migration']
  },
  {
    slug: 'autocad-shortcuts-sheet',
    title: 'AutoCAD Keyboard Shortcuts & Command Aliases Cheat Sheet',
    description: 'Searchable database of AutoCAD keyboard shortcuts, function keys, and command aliases with PGP download.',
    detailDesc: 'The most comprehensive AutoCAD shortcuts reference. Covers drawing, modify, annotation, layers, blocks, and system hotkeys with copy-to-clipboard and PGP alias file download.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['autocad shortcuts', 'autocad hotkeys', 'autocad command aliases', 'autocad cheat sheet', 'autocad function keys']
  },
  {
    slug: 'zwcad-shortcuts-sheet',
    title: 'ZWCAD Keyboard Shortcuts & Command Aliases Reference',
    description: 'Searchable index of ZWCAD keyboard shortcuts, function keys, and PGP-compatible command aliases.',
    detailDesc: 'Complete ZWCAD shortcuts reference covering drawing, modify, annotation, and system hotkeys. Includes PGP alias file download compatible with AutoCAD.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['zwcad shortcuts', 'zwcad hotkeys', 'zwcad command aliases', 'zwcad cheat sheet', 'zwcad function keys']
  },
  {
    slug: 'gstarcad-shortcuts-sheet',
    title: 'GstarCAD Keyboard Shortcuts & Command Aliases Chart',
    description: 'Quick lookup cheat sheet for GstarCAD drawing, modify, and system shortcuts with PGP alias download.',
    detailDesc: 'Search all GstarCAD keyboard shortcuts and command aliases. Fully compatible with AutoCAD PGP format for seamless migration.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['gstarcad shortcuts', 'gstarcad hotkeys', 'gstarcad command aliases', 'gstarcad cheat sheet']
  },
  {
    slug: 'nanocad-shortcuts-sheet',
    title: 'nanoCAD Keyboard Shortcuts & Hot Keys Reference',
    description: 'Searchable index of nanoCAD keyboard shortcuts, function keys, and AutoCAD-compatible command aliases.',
    detailDesc: 'Complete nanoCAD shortcuts reference. Covers drawing, modify, and system hotkeys with alias file download for efficient 2D drafting.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['nanocad shortcuts', 'nanocad hotkeys', 'nanocad command aliases', 'nanocad cheat sheet', 'free cad shortcuts']
  },
  {
    slug: 'progecad-shortcuts-sheet',
    title: 'progeCAD Keyboard Shortcuts & Command Aliases Guide',
    description: 'Interactive index of progeCAD keyboard shortcuts, function keys, and AutoCAD-compatible aliases.',
    detailDesc: 'Search all progeCAD keyboard shortcuts and command aliases. Includes .ica alias file download and covers enhanced rectangle commands.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['progecad shortcuts', 'progecad hotkeys', 'progecad command aliases', 'progecad cheat sheet', 'autocad alternative shortcuts']
  },
  {
    slug: 'tekla-shortcuts-sheet',
    title: 'Tekla Structures Keyboard Shortcuts Reference Chart',
    description: 'Complete list of Tekla Structures keyboard shortcuts for common, rendering, selecting, viewing, and drawing commands.',
    detailDesc: 'Searchable index of Tekla Structures hotkeys covering model navigation, rendering modes, selection filters, drawing management, and UCS operations.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['tekla structures shortcuts', 'tekla hotkeys', 'tekla keyboard shortcuts', 'tekla cheat sheet', 'bim steel shortcuts']
  },
  {
    slug: 'onshape-shortcuts-sheet',
    title: 'Onshape Keyboard Shortcuts Cheat Sheet',
    description: 'Searchable reference for Onshape keyboard shortcuts covering Part Studio, assembly, sketch, drawing, and 3D view.',
    detailDesc: 'Complete Onshape shortcuts guide with single-key sketch tools, constraint shortcuts, view navigation, and assembly mate commands. Print-friendly layout.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['onshape shortcuts', 'onshape hotkeys', 'onshape keyboard shortcuts', 'onshape cheat sheet', 'cloud cad shortcuts']
  },
  {
    slug: 'blender-shortcuts-sheet',
    title: 'Blender Keyboard Shortcuts & Hotkeys Cheat Sheet',
    description: 'Complete searchable list of Blender hotkeys for 3D viewport, edit mode, object mode, and rendering.',
    detailDesc: 'Comprehensive Blender shortcuts reference covering general, object mode, edit mode, viewport navigation, and rendering. Includes mode-aware hotkey tips.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['blender shortcuts', 'blender hotkeys', 'blender cheat sheet', 'blender 3d shortcuts', 'blender edit mode shortcuts']
  },
  {
    slug: '3dsmax-shortcuts-sheet',
    title: '3ds Max Keyboard Shortcuts & Hotkeys Reference',
    description: 'Searchable index of Autodesk 3ds Max keyboard shortcuts for viewport, selection, modeling, animation, and rendering.',
    detailDesc: 'Complete 3ds Max hotkeys reference covering general, viewport navigation, selection tools, editable poly sub-levels, animation, and rendering workflows.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['3ds max shortcuts', '3ds max hotkeys', '3ds max cheat sheet', '3dsmax keyboard shortcuts', 'autodesk 3ds max shortcuts']
  },
  {
    slug: 'spaceclaim-shortcuts-sheet',
    title: 'SpaceClaim Keyboard Shortcuts & Hotkeys Guide',
    description: 'Searchable reference for Ansys SpaceClaim keyboard shortcuts covering design, editing, viewing, and selection.',
    detailDesc: 'Complete SpaceClaim shortcuts guide covering Pull, Move, Fill, Combine, sketch tools, view navigation, and selection cycling for direct modeling workflows.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['spaceclaim shortcuts', 'spaceclaim hotkeys', 'ansys spaceclaim shortcuts', 'spaceclaim cheat sheet', 'direct modeling shortcuts']
  },
  {
    slug: 'altium-shortcuts-sheet',
    title: 'Altium Designer Keyboard Shortcuts & Command Reference',
    description: 'Complete searchable list of Altium Designer shortcuts for schematic, PCB layout, routing, and navigation.',
    detailDesc: 'Comprehensive Altium Designer shortcuts reference covering general, schematic placement, PCB layout, interactive routing modes, and view navigation with two-letter mnemonic commands.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['altium designer shortcuts', 'altium hotkeys', 'altium pcb shortcuts', 'altium cheat sheet', 'altium schematic shortcuts']
  },
  {
    slug: 'ansys-shortcuts-sheet',
    title: 'ANSYS Mechanical Keyboard Shortcuts & Hotkeys Guide',
    description: 'Searchable reference for ANSYS Mechanical keyboard shortcuts covering model setup, viewing, and post-processing.',
    detailDesc: 'Complete ANSYS Mechanical hotkeys reference covering general operations, view navigation, model setup, mesh generation, boundary conditions, and post-processing tools.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['ansys mechanical shortcuts', 'ansys hotkeys', 'ansys keyboard shortcuts', 'ansys cheat sheet', 'fea shortcuts']
  },
  {
    slug: 'matlab-shortcuts-sheet',
    title: 'MATLAB Keyboard Shortcuts & Editor Hotkeys Cheat Sheet',
    description: 'Complete searchable list of MATLAB keyboard shortcuts for editor, command window, navigation, and debugging.',
    detailDesc: 'Comprehensive MATLAB shortcuts reference covering editor operations, command window, panel navigation, debugging tools, and code execution with tips for command history recall.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['matlab shortcuts', 'matlab hotkeys', 'matlab keyboard shortcuts', 'matlab cheat sheet', 'matlab editor shortcuts']
  },
  {
    slug: 'mathcad-shortcuts-sheet',
    title: 'PTC Mathcad Prime Keyboard Shortcuts Reference',
    description: 'Searchable index of PTC Mathcad Prime keyboard shortcuts for math entry, editing, plotting, and worksheet management.',
    detailDesc: 'Complete Mathcad shortcuts guide covering math operators, Greek letter entry, symbolic evaluation, plotting, and worksheet management with tips for Space bar selection expansion.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-06',
    origin: 'native',
    keywords: ['ptc mathcad shortcuts', 'mathcad hotkeys', 'mathcad keyboard shortcuts', 'mathcad prime cheat sheet', 'mathcad prime shortcuts']
  },
  {
    slug: 'k-factor-calculator',
    title: 'DIN 6935 Sheet Metal Bend Allowance & K-Factor Calculator',
    description: 'Calculate sheet metal bend deduction, bend allowance, and flat pattern blank size.',
    detailDesc: 'Apply standard DIN 6935 metal bending formulas to compute sheet metal flat lengths. Featuring dynamic SVG visualizations of inner bend radius, thickness, and neutral fiber shifting.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['k-factor calculator', 'bend allowance', 'bend deduction', 'sheet metal flat length', 'din 6935']
  },
  {
    slug: 'flexlm-concurrent-seats-queue',
    title: 'FLEXlm Network Floating License Optimization Calculator',
    description: 'Optimize software licensing budgets by calculating the minimum floating licenses required using Erlang-C.',
    detailDesc: 'Input your team size, peak CAD drafting hour overlap, and license denial tolerance. The calculator uses the Erlang-C queuing algorithm to find the ideal license seat pool to minimize costs.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['flexlm license calculator', 'floating licenses', 'concurrent license optimization', 'erlang c server']
  },
  {
    slug: '3d-printing-chordal-deviation',
    title: '3D Printing Watertight Mesh Chordal Deviation Calculator',
    description: 'Optimize STEP/IGES to STL export resolution by calculating chordal sagitta deviation.',
    detailDesc: 'Input cylinder radius and angular export tolerances to calculate chordal deviation. Tells you if your STL export mesh will show faceted stepping on circular holes.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['chordal deviation', 'stl resolution calculator', 'watertight mesh export', '3d print faceting']
  },
  {
    slug: 'viewport-scale-factor-converter',
    title: 'CAD Viewport Scale Factor & XP Zoom Command Calculator',
    description: 'Calculate viewport scale factor multipliers and the exact XP command input for AutoCAD layout viewports.',
    detailDesc: 'Choose your model space units (mm, cm, m, inches), paper space layouts, and target print scales (e.g. 1:50). The tool outputs the exact Zoom XP multiplier (e.g., 1/50xp) for your drawing window.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: [
      'viewport scale calculator',
      'cad scale factor',
      'zoom xp command',
      'layout plotting scale',
      'AutoCAD scale factor calculator online',
      'drawing scale converter for architectural plans',
      'plot scale calculator for CAD printing',
      'viewport zoom xp factor converter'
    ]
  },
  {
    slug: 'limits-and-fits-calculator',
    title: 'ISO 286 Mechanical Limits and Fits Calculator',
    description: 'Enter shaft and hole dimensions to instantly calculate engineering tolerances and fit classifications.',
    detailDesc: 'Calculates maximum/minimum clearance or interference, fundamental deviations, and tolerance bands for metric shafts and holes. Visualizes standard tolerances in real-time.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: [
      'fits calculator',
      'tolerance calculator',
      'iso 286 fit calculator',
      'mechanical clearance',
      'engineering tolerance calculator ISO 2768',
      'shaft and hole fit calculator for CAD',
      'ISO 286 tolerance limits online',
      'hole and shaft clearance fit table',
      'limits and fits metric calculator'
    ]
  },
  {
    slug: 'thread-drill-size-calculator',
    title: 'Thread Tap & Drill Size Clearance Calculator',
    description: 'Search recommended drill sizes for metric (M) and unified (UNC/UNF) threads based on engagement percentages.',
    detailDesc: 'Calculates the ideal pilot hole drill diameter for tapping threads. Supports 50% to 75% thread engagement tolerances for steel, aluminum, and brass.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: [
      'tap drill size calculator',
      'metric thread drill',
      'unc clearance hole',
      'machining tap guide',
      'thread size calculator metric imperial',
      'tap drill size calculator online',
      'metric thread tolerance chart',
      'internal thread pitch diameter calculator'
    ]
  },
  {
    slug: 'beam-deflection-structural-calculator',
    title: 'Steel I-Beam Deflection & Section Modulus Calculator',
    description: 'Determine load-bearing limits, maximum deflection, and section modulus for structural H-Beams.',
    detailDesc: 'Input span length, point loads, and steel beam cross-sections to check bending stress and maximum deflections under AISC construction standards.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: ['beam deflection calculator', 'section modulus steel', 'i-beam bending limits', 'aisc load limits']
  },
  {
    slug: 'duct-size-friction-loss-calculator',
    title: 'HVAC Air Duct Sizing & Friction Loss Calculator',
    description: 'Calculate rectangular and round duct sizes, air velocity, and static friction head loss.',
    detailDesc: 'For mechanical MEP engineers. Enter targeted airflow (CFM) and friction limits to instantly calculate equivalent duct sizes and flow velocity.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'duct sizing calculator',
      'hvac friction loss',
      'duct velocity calculator',
      'mep air flow',
      'hvac air duct sizing tool friction loss',
      'rectangular duct equivalent diameter calculator',
      'ashrae duct velocity limits online',
      'colebrook equation air duct pressure drop'
    ]
  },
  {
    slug: 'dxf-watermark-layer-parser',
    title: 'DXF Educational Watermark Detector & ASCII Layer Parser',
    description: 'Inspect ASCII DXF files locally to scan for Autodesk educational plotting watermarks and extract layer tables.',
    detailDesc: 'Upload a DXF drawing to scan for educational version registry signatures that trigger printing border stamps. Extracts all active layer tables and colors without uploading files.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['dxf educational watermark', 'dxf layer parser', 'remove educational plot stamp', 'dxf registry scanner']
  },
  {
    slug: 'ctb-plot-style-pen-visualizer',
    title: 'CAD CTB Plot Style Color & Pen Thickness Visualizer',
    description: 'Load your color-dependent plot style (CTB) files to visualize and export pen width calibrations.',
    detailDesc: 'Upload custom .ctb style sheets. The client-side parser decodes index colors to display pen weights (mm), screening, and linestyles in a searchable 255-color grid. Export as printable PDF or JSON.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: [
      'ctb file reader',
      'plot style visualizer',
      'ctb pen weights table',
      'autocad print style sheet',
      'CAD line weight calculator for printing',
      'CTB file settings calculator for AutoCAD',
      'plot style pen thickness visualizer',
      'color dependent plot style table reader'
    ]
  },
  {
    slug: 'color-rgb-to-aci-matchbox',
    title: 'RGB Hex to ACI (AutoCAD Index Color) Conversion Helper',
    description: 'Convert standard RGB or Hex color codes to their closest matching AutoCAD Index Color (1-255).',
    detailDesc: 'Enter RGB or Hex values. The algorithm calculates color distance (Delta E) to match your color to the nearest standard ACI code used in CTB line weight indexing.',
    category: 'converter',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-06-04',
    keywords: [
      'rgb to aci',
      'autocad index color converter',
      'cad hex color matching',
      'aci color list',
      'rgb hex to aci index color converter',
      'closest matching ACI code calculator',
      'color distance delta E calculation CAD',
      'aci lines weights index matching'
    ]
  },
  {
    slug: 'fatal-error-diagnostic-wizard',
    title: 'AutoCAD Fatal Error & Crash Log Diagnostic Wizard',
    description: 'Input your AutoCAD crash memory address codes to diagnose the crash cause and get fixes.',
    detailDesc: 'A diagnostic wizard mapped to over 100 common AutoCAD crash addresses (e.g. e06d7363h, Access Violation). Gives solutions for graphics acceleration, registry issues, or corrupt DLLs.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['autocad fatal error', 'crash diagnostic code', 'e06d7363h crash fix', 'cad access violation']
  },
  {
    slug: 'flexlm-error-15-debugger',
    title: 'FLEXlm Network License Error -15 Connection troubleshooter',
    description: 'An interactive diagnostic path to solve server port blocks, network timeouts, and firewall licensing issues.',
    detailDesc: 'Resolve licensing issues (e.g., "Cannot connect to license server"). Tests port 27000-27009 status, firewall exclusions, and configures the ADSKFLEX_LICENSE_FILE environment variables.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['flexlm error 15', 'network license connection failed', 'port 27000 block', 'adskflex license file']
  },
  {
    slug: 'drawing-lag-performance-cleaner',
    title: 'Drawing Lag & Slow DWG File Integrity diagnostic',
    description: 'Diagnose laggy viewports and massive dwg files by scanning for scales, regapps, and bloat.',
    detailDesc: 'Analyze your lag symptoms. Guides you through purge commands, removing excessive scale lists (SCALELISTEDIT), binding corrupt Xrefs, and cleaning orphan regapp blocks.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['slow dwg file', 'cad viewport lag', 'cleanup scalelistedit', 'orphan regapps bloat']
  },
  {
    slug: 'missing-font-shx-resolver',
    title: 'Missing CAD Fonts & SHX Substitute Matchbox',
    description: 'Identify unknown missing fonts on drawing opening and download/map safe SHX substitutes.',
    detailDesc: 'When opening drawings with question marks (?) on Chinese/Japanese text or missing symbols, enter the missing font name. Matches it to standard substitutes like gbcbig.shx or hztxt.shx.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'missing shx font',
      'cad text question mark',
      'gbcbig shx download',
      'font substitution map',
      'AutoCAD font question mark fix LISP',
      'missing shx font download alternative',
      'gbcbig shx substitution setup',
      'hztxt missing text style rebuild'
    ]
  },
  {
    slug: 'pdf-plot-chinese-gibberish-resolver',
    title: 'PDF Plotting Chinese Font Gibberish & Garbled Characters Fix',
    description: 'Resolve plotting issues where Chinese characters show as scrambled letters, question marks, or gibberish in PDF exports.',
    detailDesc: 'Step-by-step diagnostic guide for resolving TTF/SHX font embedding issues in PDF plotter drivers. Covers setting "Capture Fonts" options, system font variables, and switching to DWG to PDF.pc3 config.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: [
      'cad pdf gibberish',
      'garbled text pdf plotting',
      'chinese characters pdf question mark',
      'pc3 plotter font capture',
      'missing lines fix PDF export from CAD',
      'autocad pdf print chinese question mark',
      'gibberish font characters plotter PC3',
      'font capture pdf translation error'
    ]
  },
  {
    slug: 'cad-hatch-scale-optimizer',
    title: 'CAD Hatch Pattern Scale Optimizer',
    description: 'Optimize drawing patterns density to prevent viewport freezes and empty hatches.',
    detailDesc: 'Calculate recommended hatch scales based on current drawing units (Metric vs Imperial) and targeted sheet scales to prevent solid hatch scaling crashes (MAXHATCH limit exceeded).',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'hatch scale optimizer',
      'maxhatch fix',
      'autocad hatch scale',
      'hatch density limit',
      'hatch density limit exceeded fix',
      'maxhatch limit autocad crash warning',
      'cad hatch scale factor optimizer',
      'solid hatch pattern scale generator'
    ]
  },
  {
    slug: 'cad-limits-checker',
    title: 'CAD Drawing Limits & Grid boundary Calculator',
    description: 'Quickly set up grid limits for architectural plotting and standard paper sizes in model space.',
    detailDesc: 'Input target standard paper size (A0-A4, Arch E) and drawing scale to get exact coordinates for setting the LIMITS and GRID limits in model space.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'cad limits calculator',
      'autocad drawing limits',
      'grid boundaries A3',
      'paper limits coordinate',
      'paper size to scale converter ANSI ISO',
      'AutoCAD limits and grid boundaries calculator',
      'A3 layout model space coordinates',
      'zoom all limits autocad script generator'
    ]
  },
  {
    slug: 'pipe-friction-head-loss',
    title: 'Pipe Flow Friction Head Loss (Hazen-Williams) Calculator',
    description: 'Calculate pipe flow velocity, piping friction losses, and pump sizing head adjustments.',
    detailDesc: 'Uses Hazen-Williams formulas to calculate pressure drops in commercial piping systems. Supports copper, PVC, steel, and cast iron parameters.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: ['pipe head loss calculator', 'hazen williams pressure drop', 'piping friction loss', 'pump head sizing']
  },
  {
    slug: 'screw-torque-preload-calculator',
    title: 'Bolt Tightening Torque & Preload Tension Calculator',
    description: 'Find required assembly torque, bolt preloads, and tightening standards for high-tensile fasteners.',
    detailDesc: 'Apply standard mechanical bolt torque equations (T=KFD) to determine target installation preloads based on friction coefficients and bolt grades (8.8, 10.9, 12.9).',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'bolt torque calculator',
      'fastener preload tension',
      'tightening torque 10.9',
      'mechanical screw preload',
      'bolt tightening torque standards calculator',
      'mechanical screw preload tension calculator',
      'VDI 2230 bolt torque guide',
      'high-tensile fasteners torque values chart'
    ]
  },
  {
    slug: 'weld-strength-calculator',
    title: 'Fillet Weld Strength & Load Capacity Calculator',
    description: 'Calculate throat thickness, joint stress limits, and load capacity for structural steel welds.',
    detailDesc: 'Determine mechanical load limits for standard fillet and butt welds under AISC structural guidelines based on electrode strengths (E70XX) and plate thickness.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'weld strength calculator',
      'fillet weld throat size',
      'aisc weld capacity',
      'joint stress calculator',
      'weld strength calculator AISC ASD',
      'fillet weld throat thickness calculator',
      'steel joint fillet weld load capacity',
      'effective throat weld sizing standard'
    ]
  },
  {
    slug: 'spring-force-rate-calculator',
    title: 'Helical Compression Spring Rate & Force Calculator',
    description: 'Calculate spring stiffness, deflection limits, and wire sizing configurations.',
    detailDesc: 'Compute spring rates, shear stress, and coil deflections based on active wire diameters, coil counts, and shear modulus of materials.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'native',
    keywords: [
      'spring rate calculator',
      'compression spring force',
      'coil stiffness calculator',
      'spring deflection limits',
      'helical compression spring rate calculator',
      'spring stiffness calculation online',
      'solid height limit spring deflection force',
      'torsional shear stress wahl factor'
    ]
  },
  {
    slug: 'autocad-registry-clean-generator',
    title: 'Clean Registry Reset Batch File Generator',
    description: 'Create a customized Windows command script to safely reset AutoCAD settings and clean profiles.',
    detailDesc: 'Generate a clean .bat batch script to remove orphaned registry paths, cached license locks, and configuration settings when performing clean CAD reinstalls.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['clean uninstall autocad', 'reset cad registry batch', 'remove licensing cache', 'autocad bat reset']
  },
  {
    slug: 'acad-pgp-alias-editor',
    title: 'Online ACAD.pgp Command Alias Editor & Compiler',
    description: 'Edit, customize, and compile AutoCAD PGP command shortcut files directly in your browser.',
    detailDesc: 'Upload your existing acad.pgp or gcad.pgp, edit aliases in an interactive table, detect duplicate hotkeys, and download a syntactically verified output PGP file.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['edit acad pgp', 'cad command alias compiler', 'pgp alias editor online', 'reinit pgp shortcuts']
  },
  {
    slug: 'flexlm-debug-log-analyzer',
    title: 'FLEXlm License Log Offline Analyzer',
    description: 'Parse network license debug logs locally to audit usage statistics and license denials.',
    detailDesc: 'Drag your lmgrd debug log files locally in your browser. Analyzes denied checkouts, concurrent usage peaks, and seat hogging without uploading sensitive server logs.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['flexlm log analyzer', 'lmgrd debug log audit', 'license denials report', 'floating license usage chart']
  },
  {
    slug: 'missing-regapp-cleaner-batch',
    title: 'Massive Regapp Bloat Command Script Generator',
    description: 'Generate safe macro script commands to clean orphan registered application blocks.',
    detailDesc: 'If your drawings are bloated and laggy, generate a custom LISP macro script to purge excessive registered applications (-PURGE > R) in automated batch routines.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['purge regapps command', 'dwg bloat script', 'registered application cleanup', 'lisp purge regapp']
  },
  {
    slug: 'cad-scale-list-reset-helper',
    title: 'CAD Plotting Scale List Reset Automation Guide',
    description: 'Resolve drawing lag caused by custom scale lists using automated command script builders.',
    detailDesc: 'Custom scale lists often bloat drawings through external references. Generate the exact script routine command to restore standard default scale lists in any CAD interface.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-04',
    origin: 'native',
    keywords: ['scale list reset utility', 'scalelistedit bloat fix', 'cad plotting scale reset', 'xref scale cleanup']
  },

  // ==================== THIRD-PARTY (25 External Cloud Tools) ====================
  {
    slug: 'online-pdf-to-dwg-converter',
    title: 'Online Vector PDF to CAD DWG Converter Portal',
    description: 'Objective reviews & direct portal: Losslessly restore vector PDF drawings back to CAD DWG/DXF files with intact layers.',
    detailDesc: 'When you need to restore vector geometries from structural PDF drawings, converting them to standard DWG is critical. We review the top 5 cloud-based converters, highlighting conversion accuracy, text recognition (OCR) fidelity, and layering outputs.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['pdf to dwg converter', 'vector pdf to dxf', 'online pdf conversion reviews', 'cad tracing tools']
  },
  {
    slug: 'online-dwg-to-pdf-cloud-printer',
    title: 'Online DWG to Vector PDF Batch Cloud Printer',
    description: 'Objective reviews & direct portal: Batch convert DWG drawings to high-fidelity PDF sheets in the cloud without local software installations.',
    detailDesc: 'Need to print high-resolution PDF sets from DWG files without desktop CAD? We evaluate cloud plotters that preserve CTB line weights, layout tabs, viewport scales, and support batch queues.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['dwg to pdf online', 'cloud pc3 plotter', 'batch dwg printing', 'ctb vector printing']
  },
  {
    slug: 'online-dwg-version-downgrader-cloud',
    title: 'Online DWG Format Version Downgrader',
    description: 'Objective reviews & direct portal: Quickly save down latest AutoCAD drawings to legacy CAD compatible version formats online.',
    detailDesc: 'If your local drafting software throws "version unsupported" errors, use these verified cloud conversion pipelines to quickly convert AutoCAD 2027 format DWG files down to legacy AutoCAD 2013 (AC1027) or 2004 (AC1018) compatible formats.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['downgrade dwg version', 'convert cad version online', 'ac1032 to ac1027 converter', 'autocad file converter']
  },
  {
    slug: 'cloud-dwg-to-step-iges-converter',
    title: 'Online 3D DWG to STEP/IGES CAD Translator',
    description: 'Objective reviews & direct portal: Translate 3D solid geometries from DWG models to universal manufacturing files (STEP/IGES) for CAM toolpaths.',
    detailDesc: 'Evaluate commercial cloud CAD translators that take 3D solids inside DWG and export watertight STEP or IGES mesh files suitable for SolidWorks, Rhino, or CNC CAM path planning tools.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['dwg to step converter', '3d dwg to iges translator', 'cad format conversion cloud', 'cnc mesh translation']
  },
  {
    slug: 'cloud-bim-rvt-to-ifc-converter',
    title: 'Online Revit RVT to openBIM IFC Standard Converter',
    description: 'Objective reviews & direct portal: Convert proprietary Autodesk Revit (.RVT) models to buildingSmart openBIM IFC formats.',
    detailDesc: 'BIM model exchange requires open standard compatibility. We benchmark cloud compilation engines that parse Revit families and output clean, compliant buildingSmart IFC models without losing property parameters.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['rvt to ifc cloud', 'revit openbim exporter', 'ifc validation utility', 'bim model translation']
  },
  {
    slug: 'online-dgn-to-dwg-converter',
    title: 'Online Bentley DGN to AutoCAD DWG Layer Converter',
    description: 'Objective reviews & direct portal: Convert Bentley MicroStation DGN drawings to standard AutoCAD DWG/DXF formatting.',
    detailDesc: 'MicroStation and AutoCAD handle geometries differently. We benchmark cloud tools that map DGN levels to DWG layers, maintaining complex custom line styles and shared cell structures without geometric data corruption.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['dgn to dwg online', 'microstation to autocad conversion', 'map dgn levels to layers', 'shared cells mapping']
  },
  {
    slug: 'cloud-dwg-drawing-recovery-service',
    title: 'Online Damaged DWG Drawing Recovery & Repair Portal',
    description: 'Objective reviews & direct portal: Repair broken or corrupt DWG files online when local CAD recovery commands fail.',
    detailDesc: 'When drawings get corrupt and local RECOVER commands fail, cloud recovery services can reconstruct the drawing database. We review portals that repair header metadata and salvage drawing layers.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['repair corrupt dwg', 'drawing file is not valid online', 'recover broken cad drawing', 'dwg header repair cloud']
  },
  {
    slug: 'online-3d-cad-viewer-collaborator',
    title: 'Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal',
    description: 'Objective reviews & direct portal: Collaborative review and viewing of complex 3D CAD assemblies inside any modern web browser.',
    detailDesc: 'Review the top cloud CAD visualization platforms that let clients interact with complex 3D CAD assemblies (CATIA, NX, Inventor) or Revit models directly in browsers, without active software licenses.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['cloud 3d cad viewer', 'share revit model online', 'mobile bim viewer', 'redline markup tool']
  },
  {
    slug: 'online-point-cloud-to-mesh-converter',
    title: 'Online Point Cloud (LAS/PTS) to Watertight Mesh Converter',
    description: 'Objective reviews & direct portal: Convert raw LiDAR scanner coordinate points into editable watertight mesh surfaces for CAD.',
    detailDesc: 'LiDAR scanning outputs massive coordinates lists. We evaluate cloud-scale point cloud meshing servers that convert raw LAS or PTS data into standard OBJ or DXF meshes.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['point cloud to mesh converter', 'las file to obj converter', 'convert scanner data online', 'dxf terrain generator']
  },
  {
    slug: 'cloud-dxf-to-gcode-laser-converter',
    title: 'Online DXF to CNC G-Code Path Planner',
    description: 'Objective reviews & direct portal: Convert 2D DXF profiles into CNC G-Code toolpaths for laser, waterjet, or plasma cutting.',
    detailDesc: 'For digital fabricators. We evaluate cloud toolpath compilers that take standard 2D DXF contours and generate G-code commands, configuring lead-in, lead-out, and cutting speeds.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['dxf to gcode converter', 'online laser cutter path', 'cnc toolpath generator', 'plasma cutting gcode']
  },
  {
    slug: 'online-step-to-stl-slicer-helper',
    title: 'STEP to Sliced STL Mesh Resolution Cloud Helper',
    description: 'Objective reviews & direct portal: Mesh parametric STEP files to polygonal STL models optimized for 3D printing.',
    detailDesc: 'Benchmark converters that handle high-fidelity parametric STEP models, converting them to optimized polygonal STL meshes while letting you control chordal deviation and slice limits.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: [
      'step to stl converter',
      'mesh resolution optimizer',
      '3d printing export cloud',
      'parametric stl slicer',
      'step to stl converter mesh resolution',
      '3d printing chordal deviation slicer',
      'convert step to stl online watertight',
      'parametric stp to polygonal mesh'
    ]
  },
  {
    slug: 'online-dwg-to-dxf-batch-converter',
    title: 'Online Bulk DWG / DXF Format Mutual Converter',
    description: 'Objective reviews & direct portal: Batch convert DWG drawings to DXF syntax and vice versa without any local CAD tools.',
    detailDesc: 'We evaluate batch cloud conversion portals that let you upload hundreds of DWG drawings, converting them to DXF formatting and maintaining script execution safety.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['batch dwg to dxf', 'online dxf converter', 'drawing conversion server', 'script safe converters']
  },
  {
    slug: 'cloud-cad-telemetry-blocker-wizard',
    title: 'Enterprise CAD Telemetry Blocker Configuration Portal',
    description: 'Objective reviews & direct portal: Build custom firewall rules to block background telemetry phone-home requests from CAD software.',
    detailDesc: 'Evaluate firewall config builders and network scripts that restrict AutoCAD or SolidWorks from making silent outbound telemetry calls, preventing audits and network licensing server timeouts.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['block autodesk telemetry', 'solidworks license check block', 'cad firewall rules builder', 'network license security']
  },
  {
    slug: 'online-lisp-script-compiler-protector',
    title: 'AutoLISP LSP Script Encryption (FAS/VLX) Online Portal',
    description: 'Objective reviews & direct portal: Encrypt AutoLISP source code into compiled FAS or VLX bytecode blocks online to protect IP.',
    detailDesc: 'If you want to protect your custom LISP scripts from plagiarism before distribution, use these online compilation wizards to convert ASCII .lsp scripts into compiled .fas executable blocks.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['encrypt lisp code', 'compile lsp to fas online', 'autolisp code protector', 'vlx script compiler']
  },
  {
    slug: 'online-revit-family-checker-audit',
    title: 'BIM Revit Family File Integrity & Parameter Auditor',
    description: 'Objective reviews & direct portal: Audit shared parameters, orphan objects, and geometry file weights inside Revit family files (.rfa).',
    detailDesc: 'Benchmark online BIM auditors that inspect Revit family files for redundant parameters, unpurged objects, and parameter naming compliance, optimizing BIM models performance before ingestion.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['revit family auditor', 'rfa file check online', 'shared parameters compliance', 'bim model optimization']
  },
  {
    slug: 'online-ifc-viewer-validator',
    title: 'Online openBIM IFC Standard File Validator & Viewer',
    description: 'Objective reviews & direct portal: Inspect and validate openBIM IFC structures against official schema definitions online.',
    detailDesc: 'Ensure buildingSmart compliance. We review web-based IFC validators that check geometric watertighthness, space relations, and metadata completeness according to IFC 2x3 and IFC 4 standards.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['ifc file validator', 'openbim validation online', 'check ifc file structure', 'buildingsmart standard']
  },
  {
    slug: 'online-point-cloud-las-to-dxf-contour',
    title: 'Online Point Cloud LAS to DXF Terrain Contour Generator',
    description: 'Objective reviews & direct portal: Extract terrain contours and topographic curves in DXF formats from raw geospatial LAS coordinates.',
    detailDesc: 'Evaluate online mapping portals that extract ground elevation levels from raw LAS coordinates and generate smooth topograhic contour vectors in DXF formats for road designs.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['point cloud terrain generator', 'las file to contour online', 'dxf contour generator', 'civil mapping tool']
  },
  {
    slug: 'online-solidworks-e-drawings-cloud-viewer',
    title: 'Online SolidWorks eDrawings (SLDPRT/SLDASM) Viewer',
    description: 'Objective reviews & direct portal: View and markup SolidWorks parts and assemblies online in WebGL layers without software licenses.',
    detailDesc: 'Compare cloud viewers that load SolidWorks SLDPRT or SLDASM files in WebGL layers, letting you inspect model structure, rotate assemblies, and perform cross-section mockups.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['sldprt file viewer online', 'view solidworks assemblies browser', 'web edrawings viewer', 'machining model viewer']
  },
  {
    slug: 'online-dwg-compare-diff-viewer',
    title: 'Cloud DWG Revision Difference & Compare Visualizer',
    description: 'Objective reviews & direct portal: Compare revision differences between two DWG files visually with red-and-green highlighted overlays.',
    detailDesc: 'We evaluate cloud tools that parse two dwg files and visually overlay them. Highlight insertions, deletions, and metadata updates in layout files to speed up drafting reviews.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['dwg comparison online', 'compare drawing versions', 'cad diff tool', 'revision highlighter']
  },
  {
    slug: 'online-image-jpg-to-dxf-vectorizer',
    title: 'Online Image Raster (JPG/PNG) to Vector DXF Tracer',
    description: 'Objective reviews & direct portal: Vectorize raster image plans (JPG/PNG) into CAD-ready DXF drawing curves.',
    detailDesc: 'Review cloud tracing engines that take raster scans of plans or hand-drawn schematics, converting them into smooth bezier arcs and vector line segments in DXF formats.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['raster to vector converter', 'jpg to dxf tracer online', 'convert blueprint to dxf', 'vectorize plan scans']
  },
  {
    slug: 'online-step-to-obj-gltf-converter',
    title: 'Online STEP to glTF/OBJ Rendering Mesh Converter',
    description: 'Objective reviews & direct portal: Optimize heavy industrial STEP models to lightweight glTF/OBJ mesh assets for web visualization.',
    detailDesc: 'Benchmark CAD conversion pipelines that polygonize nurbs boundary representations in STEP models, generating texture-mapped glTF mesh outputs for VR, AR, or Three.js environments.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['step to gltf converter', 'convert step to obj online', 'webgl mesh translator', 'step to mesh converter']
  },
  {
    slug: 'online-cad-license-audit-shield',
    title: 'Enterprise CAD Software Anti-Piracy Audit Shield Guide',
    description: 'Objective reviews & direct portal: Navigate anti-piracy licensing audits, software compliance letters, and mitigation strategies.',
    detailDesc: 'We review defensive legal checklists, license scanning utilities, and network proxy setups that help enterprise SAM administrators identify and resolve unlicensed software liabilities before audit letters arrive.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['autodesk license audit defense', 'solidworks anti piracy letter', 'cad compliance shield', 'unlicensed software audit help']
  },
  {
    slug: 'online-dwg-layer-splitter-cloud',
    title: 'Online DWG Layer Splitter & Batch Drawing Separator',
    description: 'Objective reviews & direct portal: Batch split multi-layered drawings into separate sub-drawings by layer configuration.',
    detailDesc: 'Evaluate online scripts that parse multi-layered drawings (e.g. electrical + mechanical Xrefs), slicing them down layer-by-layer into clean, separate sub-drawings.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['split dwg layers online', 'dwg divider cloud', 'batch layer separator', 'cad batch exporting']
  },
  {
    slug: 'online-dxf-text-translator-cloud',
    title: 'Online DXF/DWG Drawing Multi-Language Batch Translator',
    description: 'Objective reviews & direct portal: Batch translate text and annotations inside DXF drawings across multiple languages.',
    detailDesc: 'Review localization servers that batch-translate text and block attributes in dxf files without corrupting coordinate parameters, outputting correctly encoded SHX formatting.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['translate cad drawing online', 'translate dxf text', 'dwg multi language localization', 'shx text translation']
  },
  {
    slug: 'online-skp-to-fbx-cloud-converter',
    title: 'Online SketchUp SKP to FBX Render Mesh Converter',
    description: 'Objective reviews & direct portal: Export SketchUp (.SKP) scenes to FBX meshes with intact texture coordinate mapping.',
    detailDesc: 'Evaluate cloud polygonization utilities that take architectural SKP files and output render-ready FBX models with matching texture coordinates, ready for Twinmotion or Lumion rendering.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-05',
    origin: 'third-party',
    keywords: ['skp to fbx online', 'sketchup rendering export', 'convert skp scene to mesh', 'fbx texture mapping']
  },

  // ==================== NEW NATIVE CALCULATORS ====================
  {
    slug: 'gear-module-calculator',
    title: 'Gear Module, Pitch Diameter & Teeth Calculator',
    description: 'Calculate gear module (m), pitch diameter, number of teeth, and center distance for metric spur gears.',
    detailDesc: 'Enter any two of module, teeth count, or pitch diameter to calculate the third. Supports center distance calculation for two mating gears. Includes standard module series recommendations (DIN 780).',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['gear module calculator', 'spur gear pitch diameter', 'gear teeth calculation', 'dinv 780 module', 'metric gear calculator', 'gear center distance', 'm d z gear formula', 'module pitch circle diameter']
  },
  {
    slug: 'cnc-feed-rate-calculator',
    title: 'CNC Feed Rate, Spindle Speed & Chip Load Calculator',
    description: 'Calculate CNC milling feed rate (mm/min), spindle RPM, and chip load per tooth for optimal machining.',
    detailDesc: 'Input cutting speed (Vc), number of flutes, and chip load per tooth to calculate spindle RPM and feed rate. Supports metric and imperial units. Includes recommended cutting speeds for common materials (steel, aluminum, brass, plastic).',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['cnc feed rate calculator', 'spindle speed rpm', 'chip load per tooth', 'machining feed calculation', 'cnc milling speed calculator', 'cutting speed vc formula', 'feed rate mm per minute', 'cnc machining parameters']
  },
  {
    slug: 'steel-section-weight-calculator',
    title: 'Steel Section Weight & Surface Area Calculator',
    description: 'Calculate per-meter weight and surface area for steel I-beams, angles, channels, tubes, and flat bars.',
    detailDesc: 'Select steel profile type (I-beam, angle, channel, round tube, square tube, flat bar) and enter dimensions to calculate weight per meter, total weight, and paint surface area. Uses standard steel density (7850 kg/m³).',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['steel weight calculator', 'i-beam weight per meter', 'angle steel weight', 'steel channel weight', 'steel tube weight calculator', 'steel profile surface area', 'steel section mass calculator', 'fabrication steel weight']
  },
  {
    slug: 'surface-roughness-converter',
    title: 'Surface Roughness Ra, Rz, Rt Converter & Comparator',
    description: 'Convert between Ra, Rz, and Rt surface roughness values and compare with ISO grade numbers.',
    detailDesc: 'Enter any roughness value (Ra, Rz, or Rt) to convert to the others. Includes ISO 1302 surface finish symbols, N-grade classification, and common manufacturing process capability ranges (grinding, milling, turning).',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['surface roughness converter', 'ra to rz conversion', 'rt roughness calculator', 'iso 1302 surface finish', 'n grade roughness', 'ra rz rt converter', 'surface finish comparator', 'grinding milling roughness range']
  },
  {
    slug: 'pipe-thermal-expansion-calculator',
    title: 'Pipe Thermal Expansion & Anchor Force Calculator',
    description: 'Calculate thermal expansion length, expansion stress, and anchor loads for piping systems.',
    detailDesc: 'Enter pipe material, length, temperature change, and pipe size to calculate thermal expansion (ΔL), expansion stress, and anchor force. Supports carbon steel, stainless steel, copper, and aluminum. Uses ASME B31.3 expansion coefficients.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['pipe thermal expansion calculator', 'pipe expansion length', 'thermal stress piping', 'asme b31.3 expansion', 'pipe anchor force', 'carbon steel expansion coefficient', 'pipe stress thermal', 'piping expansion calculation']
  },
  {
    slug: 'tolerance-stackup-calculator',
    title: 'Dimensional Tolerance Stack-Up Analyzer (Worst Case & RSS)',
    description: 'Analyze dimensional tolerance chains using Worst Case (arithmetic) and Root Sum Square (statistical) methods.',
    detailDesc: 'Enter a chain of dimensions with their ±tolerances to calculate the total stack-up using both Worst Case and RSS methods. Identifies the maximum and minimum assembly dimensions and highlights critical contributors.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['tolerance stackup calculator', 'worst case tolerance', 'rss root sum square', 'dimensional chain analysis', 'tolerance analysis tool', 'assembly tolerance calculation', 'statistical tolerance stackup', 'arithmetic tolerance method']
  },
  {
    slug: 'injection-clamping-force-calculator',
    title: 'Injection Molding Clamping Force & Projected Area Calculator',
    description: 'Calculate the required clamping force for injection molding based on projected area and cavity pressure.',
    detailDesc: 'Enter projected part area, number of cavities, and cavity pressure factor to calculate the required clamping force (tons). Includes recommended cavity pressures for common materials (PP, PE, ABS, PC, nylon) and safety factor guidance.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['injection molding clamping force', 'projected area calculator', 'cavity pressure injection', 'mold clamping tonnage', 'injection molding force calculation', 'clamping force formula', 'mold tonnage calculator', 'plastic injection pressure']
  },
  {
    slug: 'belt-drive-length-calculator',
    title: 'Belt Drive Length & Center Distance Calculator',
    description: 'Calculate belt length, center distance, and speed ratio for V-belt and timing belt drive systems.',
    detailDesc: 'Enter driver and driven pulley diameters and center distance to calculate belt length. Or enter belt length and pulley diameters to find center distance. Includes speed ratio and RPM output calculation.',
    category: 'calculator',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['belt drive length calculator', 'v-belt length formula', 'timing belt center distance', 'pulley speed ratio', 'belt drive calculation', 'center distance calculator', 'belt length formula', 'pulley rpm calculator']
  },

  // ==================== NEW NATIVE CHEATSHEETS ====================
  {
    slug: 'nx-shortcuts-sheet',
    title: 'Siemens NX Keyboard Shortcuts & Mouse Gestures Guide',
    description: 'Searchable cheat sheet for Siemens NX (Unigraphics) modeling, sketching, and assembly shortcuts.',
    detailDesc: 'Complete index of NX keyboard shortcuts including sketcher tools, feature modeling, assembly constraints, and synchronous technology. Covers NX 12 through NX 2307 series with mouse gesture and radial tool button guides.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['nx shortcuts', 'siemens nx hotkeys', 'ug nx keyboard', 'nx sketcher shortcuts', 'nx mouse gestures', 'nx command aliases', 'unigraphics shortcuts', 'nx assembly shortcuts']
  },
  {
    slug: 'civil3d-shortcuts-sheet',
    title: 'Autodesk Civil 3D Keyboard Shortcuts & Command Aliases',
    description: 'Quick reference for Civil 3D surface, alignment, profile, and corridor modeling shortcuts.',
    detailDesc: 'Searchable index of Civil 3D-specific shortcuts beyond standard AutoCAD, including surface editing, alignment layout, profile view, corridor section, and pipe network commands. Optimized for civil/transportation design workflows.',
    category: 'cheatsheet',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['civil 3d shortcuts', 'civil 3d hotkeys', 'autocad civil shortcuts', 'civil 3d command aliases', 'corridor shortcuts', 'alignment profile shortcuts', 'civil 3d cheat sheet', 'civil engineering cad keys']
  },

  // ==================== NEW NATIVE CONVERTERS ====================
  {
    slug: 'stl-mesh-checker',
    title: 'STL Mesh Inspector: Triangle Count, Volume & Watertightness Checker',
    description: 'Drag and drop STL files to check triangle count, bounding box, volume, surface area, and mesh integrity.',
    detailDesc: 'A fully client-side STL parser that reads both ASCII and binary STL files. Reports triangle count, bounding box dimensions, calculated volume, surface area, edge manifoldness check, and identifies non-watertight edges for 3D printing validation.',
    category: 'converter',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['stl checker', 'stl mesh inspector', 'stl triangle count', 'stl volume calculator', 'watertight mesh check', 'stl bounding box', '3d print mesh validation', 'stl file analyzer online']
  },
  {
    slug: 'step-file-header-parser',
    title: 'STEP File Header Parser & Metadata Inspector',
    description: 'Drag and drop STEP (.stp/.step) files to extract header metadata: author, organization, CAD system, and units.',
    detailDesc: 'A client-side text parser that reads the ISO 10303 STEP header section (HEADER; ENDSEC;) to extract FILE_DESCRIPTION, FILE_NAME, and FILE_SCHEMA entries. Identifies the originating CAD system, authoring organization, and AP protocol (AP203, AP214, AP242).',
    category: 'converter',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['step file parser', 'step header metadata', 'iso 10303 parser', 'step ap203 ap214 ap242', 'step file inspector', 'cad file metadata extractor', 'step file information', 'stp header reader']
  },
  {
    slug: 'csv-to-dxf-converter',
    title: 'CSV Coordinate to DXF Point & Polyline Converter',
    description: 'Convert CSV coordinate data (Northing, Easting, Elevation) to DXF format for CAD import.',
    detailDesc: 'Upload a CSV file with X,Y,Z coordinates and generate a DXF file with points, polylines, or both. Supports configurable column mapping, point labels, layer names, and coordinate scaling. Output downloads directly — no server upload required.',
    category: 'converter',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['csv to dxf converter', 'coordinate to cad', 'csv points to dxf', 'survey points to dxf', 'csv to dxf online', 'coordinate import cad', 'csv xyz to dxf', 'survey data to autocad']
  },

  // ==================== NEW NATIVE TROUBLESHOOTERS ====================
  {
    slug: 'solidworks-crash-diagnostic-wizard',
    title: 'SolidWorks Crash & Freeze Diagnostic Wizard',
    description: 'Diagnose SolidWorks crashes, freezes, and instability by walking through common causes and fixes.',
    detailDesc: 'An interactive diagnostic wizard for SolidWorks stability issues. Covers graphics driver conflicts, memory exhaustion, corrupt toolbox, registry issues, and service pack problems. Provides step-by-step fixes based on crash symptoms.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['solidworks crash fix', 'solidworks freeze diagnostic', 'solidworks stability issues', 'solidworks graphics crash', 'solidworks rx diagnostic', 'solidworks not responding', 'solidworks crash on startup', 'solidworks performance troubleshooting']
  },
  {
    slug: 'revit-performance-diagnostic-wizard',
    title: 'Revit Model Performance & Slow Navigation Diagnostic',
    description: 'Diagnose slow Revit models, laggy navigation, and long sync times with an interactive troubleshooting wizard.',
    detailDesc: 'Walks through common Revit performance bottlenecks: oversized families, excessive linked models, poor view templates, DWG imports, and worksharing conflicts. Provides actionable fixes based on reported symptoms.',
    category: 'troubleshoot',
    status: 'released',
    origin: 'native',
    releasedDate: '2026-07-09',
    keywords: ['revit slow performance', 'revit model lag fix', 'revit performance optimization', 'revit family size optimization', 'revit navigation slow', 'revit sync slow fix', 'revit troubleshooting wizard', 'revit model cleanup']
  },

  // ==================== NEW THIRD-PARTY REFERRALS ====================
  {
    slug: 'online-ifc-to-revit-converter',
    title: 'Online IFC to Revit RVT Model Converter',
    description: 'Objective reviews & direct portal: Convert openBIM IFC models back to native Revit RVT families and elements.',
    detailDesc: 'We evaluate cloud services that parse IFC entities and reconstruct them as native Revit families, preserving parameter data and category assignments. Compare conversion fidelity, element mapping accuracy, and parameter retention.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['ifc to rvt converter', 'ifc to revit online', 'openbim to revit', 'ifc import revit', 'ifc to native revit families']
  },
  {
    slug: 'online-mesh-repair-service',
    title: 'Online 3D Mesh Repair & Healing Service',
    description: 'Objective reviews & direct portal: Fix non-manifold edges, holes, and intersections in STL/OBJ meshes for 3D printing.',
    detailDesc: 'Evaluate cloud mesh repair tools that automatically detect and fix non-manifold edges, fill holes, remove self-intersections, and re-orient normals. Compare repair algorithms, batch processing, and output quality.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['mesh repair online', 'stl fix holes', 'non-manifold mesh fix', '3d print mesh repair', 'mesh healing service', 'fix stl file online']
  },
  {
    slug: 'online-reverse-engineering-service',
    title: 'Online 3D Scan Reverse Engineering & CAD Reconstruction',
    description: 'Objective reviews & direct portal: Convert 3D scan point clouds and meshes into parametric CAD models.',
    detailDesc: 'We review cloud-based reverse engineering platforms that take scan data (point clouds, meshes) and generate parametric CAD surfaces, solid models, and 2D drawings. Compare auto-surfacing, primitive fitting, and export formats.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['reverse engineering online', '3d scan to cad', 'point cloud to solid model', 'mesh to step converter', 'scan to parametric cad', 'reverse engineering software cloud']
  },
  {
    slug: 'online-cad-file-compressor',
    title: 'Online CAD File Size Compressor & Optimizer',
    description: 'Objective reviews & direct portal: Reduce DWG, RVT, and STEP file sizes for email sharing and cloud upload.',
    detailDesc: 'Evaluate cloud file compression services that purge unused elements, compress textures, simplify geometry, and strip metadata from CAD files. Compare compression ratios, quality retention, and supported formats.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['cad file compressor', 'dwg file size reducer', 'rvt file optimization', 'compress step file', 'cad file size reduction', 'optimize dwg for sharing']
  },
  {
    slug: 'online-bim-quantity-estimator',
    title: 'Online BIM Material Quantity & Cost Estimator',
    description: 'Objective reviews & direct portal: Extract material quantities, volumes, and cost estimates from IFC and RVT models.',
    detailDesc: 'We benchmark cloud-based BIM quantity takeoff tools that parse IFC and Revit models to extract material volumes, counts, and areas. Compare accuracy, material classification, and export to cost estimation formats.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['bim quantity takeoff', 'ifc material extraction', 'revit quantity estimation', 'bim cost calculator', 'online quantity surveyor', 'bim material schedule']
  },
  {
    slug: 'online-cnc-nesting-optimizer',
    title: 'Online CNC Nesting & Sheet Material Optimization',
    description: 'Objective reviews & direct portal: Optimize part layout on sheet metal, wood, and composite panels to minimize waste.',
    detailDesc: 'Evaluate cloud nesting engines that arrange 2D DXF/DWG parts on standard sheet sizes to maximize material utilization. Compare nesting algorithms, utilization rates, and support for common sheet sizes.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['cnc nesting online', 'sheet metal nesting', 'dxf nesting optimizer', 'material utilization calculator', 'nesting software cloud', 'sheet cutting optimization']
  },
  {
    slug: 'online-cfd-simulation-platform',
    title: 'Online Cloud CFD Simulation & Fluid Analysis Platform',
    description: 'Objective reviews & direct portal: Run computational fluid dynamics simulations in the cloud without local hardware.',
    detailDesc: 'We review cloud CFD platforms that handle mesh generation, solver execution, and post-processing in browser-based interfaces. Compare solver types (RANS, LES, DNS), mesh capacity, and pricing models.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['cloud cfd simulation', 'online fluid dynamics', 'cfd solver cloud', 'browser cfd analysis', 'cloud airflow simulation', 'online heat transfer simulation']
  },
  {
    slug: 'online-fea-simulation-platform',
    title: 'Online Cloud FEA Structural Analysis Platform',
    description: 'Objective reviews & direct portal: Run finite element analysis simulations in the cloud without local software licenses.',
    detailDesc: 'Evaluate cloud FEA platforms that handle meshing, solving, and post-processing for linear static, modal, and nonlinear analyses. Compare solver performance, material libraries, and CAD import capabilities.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['cloud fea simulation', 'online structural analysis', 'finite element cloud', 'browser fea solver', 'online stress analysis', 'cloud mechanical simulation']
  },
  {
    slug: 'online-injection-mold-flow-analysis',
    title: 'Online Injection Molding Flow & Mold Analysis Service',
    description: 'Objective reviews & direct portal: Simulate plastic injection molding fill patterns, cooling, and warpage in the cloud.',
    detailDesc: 'We review cloud mold flow analysis services that predict fill patterns, air traps, weld lines, cooling time, and part warpage. Compare solver accuracy, material databases, and optimization recommendations.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['injection mold flow analysis', 'moldex3d cloud', 'moldflow online', 'plastic simulation cloud', 'mold filling simulation', 'warpage prediction online']
  },
  {
    slug: 'online-bim-coordination-checker',
    title: 'Online BIM Clash Detection & Coordination Checker',
    description: 'Objective reviews & direct portal: Upload IFC and NWD models for automated clash detection and coordination review.',
    detailDesc: 'Evaluate cloud BIM coordination platforms that perform automated clash detection between disciplines (architecture, structure, MEP). Compare clash detection algorithms, grouping, reporting, and integration with issue trackers.',
    category: 'troubleshoot',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'third-party',
    keywords: ['bim clash detection online', 'navisworks alternative cloud', 'ifc coordination check', 'bim conflict detection', 'online clash report', 'bim coordination platform']
  },
  {
    slug: 'bolt-circle-pattern-calculator',
    title: 'Bolt Circle Pattern & Flange Hole Coordinate Calculator',
    description: 'Generate X/Y coordinates for equally spaced bolt circles. Configurable bolt count, PCD, rotation offset, and hole diameter. Export CSV for CNC drilling.',
    detailDesc: 'Calculate precise hole coordinates for flange drilling patterns. Enter pitch circle diameter (PCD), number of bolts, and starting angle to get X/Y coordinates for each hole. Includes bolt circle SVG preview and CSV export for CNC machines.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'native',
    keywords: ['bolt circle calculator', 'flange hole pattern', 'pcd coordinate generator', 'bolt pattern cnc', 'drilling coordinate calculator', 'bolt circle coordinate']
  },
  {
    slug: 'gcode-quick-reference-sheet',
    title: 'CNC G-Code & M-Code Quick Reference Cheatsheet',
    description: 'Searchable index of common CNC G-codes (G0-G92) and M-codes (M0-M30) with descriptions, modal groups, and usage examples.',
    detailDesc: 'A comprehensive, searchable reference for CNC programming G-codes and M-codes. Covers Fanuc, Haas, Siemens, and LinuxCNC dialects. Includes modal group classification and common canned cycles.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'native',
    keywords: ['g-code reference', 'cnc m-code list', 'fanuc g-code cheat sheet', 'haas g-code reference', 'cnc programming codes', 'g-code modal groups']
  },
  {
    slug: 'gdt-symbol-reference-guide',
    title: 'GD&T Symbol Reference Guide (ASME Y14.5)',
    description: 'Interactive reference for ASME Y14.5 Geometric Dimensioning & Tolerancing symbols. Form, profile, orientation, location, and runout controls with tolerance zone descriptions.',
    detailDesc: 'Browse all ASME Y14.5 GD&T symbols by category: form, profile, orientation, location, and runout. Each symbol includes its tolerance zone type, datum references, material condition modifiers, and practical usage examples.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'native',
    keywords: ['gd&t symbols', 'asme y14.5 reference', 'geometric dimensioning tolerancing', 'gdt symbol guide', 'tolerance zone types', 'datum reference frame']
  },
  {
    slug: 'iso-286-limits-fits-reference',
    title: 'ISO 286 Limits & Fits Reference Table',
    description: 'Searchable ISO 286-1/2 limits and fits reference: IT tolerance grades, shaft/hole fundamental deviations, and common fit combinations with applications.',
    detailDesc: 'Browse ISO 286 limits and fits by category: clearance, transition, and interference fits. Includes IT5-IT11 tolerance grades in micrometers for common size ranges, shaft (a-zc) and hole (A-ZC) fundamental deviations, and practical application examples for each fit.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['iso 286', 'limits and fits', 'tolerance grades', 'it tolerance', 'shaft tolerance', 'hole tolerance', 'clearance fit', 'interference fit', 'transition fit', 'hole basis system']
  },
  {
    slug: 'iso-metric-thread-reference',
    title: 'ISO Metric Thread & Tap Drill Size Reference',
    description: 'Complete ISO metric thread table (M1.6–M48) with coarse/fine pitch, tap drill sizes, clearance holes, and thread engagement data.',
    detailDesc: 'Searchable ISO 261 metric thread reference covering M1.6 to M48 coarse pitch and M8 to M30 fine pitch threads. Includes tap drill diameters, ISO 273 clearance hole sizes (close/normal), thread tolerance classes (4H-8g), and thread engagement guidelines.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['iso metric thread', 'tap drill size', 'thread pitch', 'm6 m8 m10', 'clearance hole', 'thread tolerance', 'iso 261', 'iso 965', 'metric fine thread', 'tap drill chart']
  },
  {
    slug: 'aws-welding-symbol-reference',
    title: 'AWS Welding Symbol Reference Guide (A2.4)',
    description: 'Complete AWS A2.4 welding symbol reference: groove, fillet, plug, surfacing welds with supplementary symbols and tail notes.',
    detailDesc: 'Browse AWS A2.4 welding symbols by category: groove welds (V, bevel, U, J, flare), basic welds (fillet, plug, slot, spot, seam), supplementary symbols (all-around, field weld, backing, contour), and process codes (SMAW, GMAW, GTAW, FCAW, SAW).',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['aws welding symbols', 'a2.4 standard', 'weld symbol reference', 'groove weld symbol', 'fillet weld symbol', 'welding process codes', 'smaw gmaw gtaw', 'weld all around symbol', 'field weld symbol']
  },
  {
    slug: 'surface-roughness-reference',
    title: 'Surface Roughness (Ra/Rz) Symbols & Values Reference',
    description: 'ISO 1302 surface texture symbols, Ra/Rz values, manufacturing process capabilities, and typical applications reference table.',
    detailDesc: 'Searchable ISO 1302 surface roughness reference: surface texture symbols (material removal, prohibited, lay direction), Ra values from 0.012 to 50μm with corresponding manufacturing processes, Rz conversion data, and typical engineering applications.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['surface roughness', 'ra value', 'rz value', 'iso 1302', 'surface finish symbol', 'surface texture', 'machining surface finish', 'ra rz conversion', 'surface lay', 'grinding polishing lapping']
  },
  {
    slug: 'autolisp-function-reference',
    title: 'AutoLISP Function Quick Reference for AutoCAD',
    description: 'Complete AutoLISP function reference: math, geometry, entity access, selection sets, list manipulation, and command execution for AutoCAD scripting.',
    detailDesc: '50+ AutoLISP functions organized by category: math and logic operators, geometry calculations (distance, angle, polar, inters), entity access (entget, entmake, entmod, ssget), list operations (car, cdr, mapcar, assoc), I/O functions (getpoint, getdist, command), and system variables.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['autolisp', 'autolisp functions', 'autocad scripting', 'autocad api', 'entget entmake', 'ssget selection set', 'lisp programming', 'autocad automation', 'defun c:', 'dxf group codes']
  },
  {
    slug: 'steel-section-properties-reference',
    title: 'Standard Steel Section Properties Reference (IPE/HEA/HEB/UB/UC)',
    description: 'European (IPE, HEA, HEB, UPE) and British (UB, UC) steel section properties: dimensions, area, weight, moment of inertia, and section modulus.',
    detailDesc: 'Searchable steel section properties database: European IPE beams (80-600), HEA/HEB wide flange sections (100-400), British Universal Beams (203-610) and Columns (152-356), and channel sections (UPE/PFC). Includes cross-sectional area, unit weight, moment of inertia (Iy), and section modulus (Wy).',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['steel section properties', 'ipe beam', 'hea heb section', 'universal beam', 'universal column', 'moment of inertia', 'section modulus', 'steel profile', 'eurocode 3', 'hot rolled steel', 'ub uc section']
  },
  {
    slug: 'cnc-speeds-feeds-reference',
    title: 'CNC Speeds & Feeds Quick Reference Table',
    description: 'CNC cutting speeds (Vc) and feed rates per material: steel, aluminum, stainless, titanium, brass, and plastics with HSS and carbide tool data.',
    detailDesc: 'Searchable CNC speeds and feeds reference: HSS and carbide cutting speeds for 12+ materials (aluminum, steel, stainless, titanium, cast iron, Inconel, brass, plastics), chip load per tooth data, drilling speeds, RPM/feed formulas, and material-specific machining tips.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['cnc speeds and feeds', 'cutting speed', 'feed rate', 'spindle speed rpm', 'chip load', 'carbide tool speed', 'hss tool speed', 'aluminum machining', 'stainless machining', 'titanium machining', 'cnc formula']
  },
  {
    slug: 'iso-2768-general-tolerances-reference',
    title: 'ISO 2768 General Tolerances Reference Table',
    description: 'ISO 2768-1/2 general tolerances for linear dimensions, angular dimensions, and geometrical tolerances across four accuracy classes (fine, medium, coarse, very coarse).',
    detailDesc: 'Searchable ISO 2768 general tolerance reference: linear tolerances per size range (0.5-4000mm), angular tolerances per angle and side length, geometrical tolerances (flatness, straightness, perpendicularity, symmetry, runout), and accuracy class selection guide.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['iso 2768', 'general tolerances', 'iso 2768-1', 'iso 2768-2', 'linear tolerance', 'angular tolerance', 'geometrical tolerance', 'fine medium coarse', 'general tolerance class', 'din 7168']
  },
  {
    slug: 'drill-bit-size-chart',
    title: 'Drill Bit Size Chart (Number, Letter & Fractional)',
    description: 'Complete drill bit size chart: number drills (#1-#80), letter drills (A-Z), and fractional inch drills with metric conversions and tap drill applications.',
    detailDesc: '120+ drill sizes from #80 (0.34mm) to 1/2" (12.7mm): number drills with inch/mm conversions, letter drills A-Z, fractional inch drills, metric drill equivalents, and tap drill applications for UNC/UNF threads.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['drill bit size chart', 'number drill', 'letter drill', 'fractional drill', 'drill size conversion', 'tap drill size', 'drill chart metric imperial', 'ansi b94.11', 'drill bit mm to inch']
  },
  {
    slug: 'material-properties-reference',
    title: 'Engineering Material Properties Reference Table',
    description: 'Mechanical properties of steel, aluminum, copper, titanium, brass, and engineering plastics: density, yield strength, elastic modulus, Poisson ratio, and thermal expansion.',
    detailDesc: '40+ engineering materials with mechanical properties: steels (1018, 1045, 4140, 4340, 303, 304, 316, 17-4PH, D2), aluminum alloys (6061, 7075, 2024, 5052), copper/brass/bronze, titanium (Ti-6Al-4V), nickel alloys (Inconel 718, Monel), cast iron, and engineering plastics (POM, PEEK, PTFE, PC, ABS).',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['material properties', 'engineering materials', 'steel properties', 'aluminum properties', 'titanium properties', 'yield strength', 'elastic modulus', 'density', 'thermal expansion', 'material selection', 'inconel properties', 'plastic properties']
  },
  {
    slug: 'imperial-thread-reference',
    title: 'UNC/UNF Imperial Thread & Tap Drill Reference',
    description: 'Complete UNC (coarse) and UNF (fine) thread table: #0 through 1-1/2" with TPI, tap drill sizes, clearance holes, and thread engagement data.',
    detailDesc: 'Searchable UNC and UNF thread reference: #0-80 through 1-1/2"-6 UNC coarse threads, #0-80 through 1-1/2"-12 UNF fine threads, clearance hole sizes (close/normal), thread tolerance classes (1A-3B), and tap drill formula.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['unc thread', 'unf thread', 'imperial thread', 'unified thread', 'threads per inch', 'tap drill size', 'asme b1.1', 'clearance hole', 'thread tolerance class', 'coarse fine thread']
  },
  {
    slug: 'pipe-size-chart',
    title: 'Pipe Size Chart (NPS/DN/Schedule) Reference',
    description: 'Complete pipe size chart: NPS to DN conversion, outside diameter, wall thickness for Schedule 10-160 and XS/XXS, with weight and bore data.',
    detailDesc: 'Searchable pipe size chart: NPS 1/8" to 24" with DN conversion, OD, wall thickness for Schedule 10/40/80/160, inside diameter (bore), and weight per meter. Covers ASME B36.10 and EN 10220 standards.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['pipe size chart', 'nps dn conversion', 'pipe schedule', 'pipe wall thickness', 'pipe outside diameter', 'asme b36.10', 'schedule 40 80', 'pipe weight', 'nominal pipe size', 'pipe od']
  },
  {
    slug: 'gear-ratio-speed-calculator',
    title: 'Gear Ratio & Speed Calculator (Spur, Planetary)',
    description: 'Calculate gear ratio, output speed (RPM), output torque, and center distance for spur gear pairs and planetary gear sets.',
    detailDesc: 'Gear ratio calculator for spur gear pairs (z2/z1) and planetary gear sets (1+zr/zs). Computes output RPM, output torque with efficiency, and center distance. Supports metric module input.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['gear ratio', 'gear speed calculator', 'planetary gear', 'spur gear', 'output rpm', 'gear torque', 'center distance', 'gear train', 'reduction ratio', 'planetary gear ratio']
  },
  {
    slug: 'hydraulic-cylinder-force-calculator',
    title: 'Hydraulic Cylinder Force Calculator (Push & Pull)',
    description: 'Calculate hydraulic cylinder push and pull force from bore diameter, rod diameter, and pressure. Supports metric and imperial units.',
    detailDesc: 'Hydraulic cylinder force calculator: push force (full piston area) and pull force (annulus area). Inputs: bore, rod diameter, pressure. Supports metric (mm, bar) and imperial (in, psi) units.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['hydraulic cylinder force', 'cylinder push pull force', 'hydraulic calculator', 'bore diameter', 'piston area', 'annulus area', 'fluid power', 'cylinder pressure', 'hydraulic system design']
  },
  {
    slug: 'pressure-vessel-thickness-calculator',
    title: 'Pressure Vessel Wall Thickness Calculator (ASME BPVC)',
    description: 'Calculate minimum wall thickness for cylindrical and spherical pressure vessels per ASME BPVC Section VIII Division 1.',
    detailDesc: 'ASME BPVC VIII Div 1 pressure vessel thickness calculator: cylindrical t=PD/(2SE-P), spherical t=PD/(4SE-P). Includes joint efficiency, corrosion allowance, MAWP verification, and material selection.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['pressure vessel thickness', 'asme bpvc', 'vessel wall thickness', 'mawp calculator', 'cylindrical vessel', 'spherical vessel', 'joint efficiency', 'corrosion allowance', 'vessel design']
  },
  {
    slug: 'shaft-torsion-stress-calculator',
    title: 'Shaft Torsion Stress & Angle Calculator',
    description: 'Calculate torsional shear stress and twist angle for solid and hollow circular shafts under torque loading.',
    detailDesc: 'Shaft torsion calculator: shear stress tau=Tr/J, twist angle theta=TL/(GJ). Supports solid and hollow shafts, power-speed-torque conversion, polar moment of inertia, and safety factor using distortion energy theory.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['shaft torsion', 'torsional stress', 'twist angle', 'torque calculator', 'polar moment of inertia', 'shear stress shaft', 'power speed torque', 'hollow shaft', 'solid shaft']
  },
  {
    slug: 'column-buckling-calculator',
    title: 'Euler Column Buckling Load Calculator',
    description: 'Calculate critical buckling load for columns using Euler and Johnson formulas with four end-condition types.',
    detailDesc: 'Column buckling calculator: Euler elastic buckling (Pcr=pi^2*EI/(KL)^2) for slender columns, Johnson parabolic for intermediate slenderness. Supports pinned, fixed, cantilever, and guided ends. Automatic transition based on slenderness ratio vs Cc.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['column buckling', 'euler buckling', 'critical load', 'slenderness ratio', 'johnson formula', 'buckling load', 'end condition factor', 'elastic buckling', 'inelastic buckling']
  },
  {
    slug: 'true-position-calculator',
    title: 'True Position (GD&T) Calculator with Bonus Tolerance',
    description: 'Calculate true position deviation and bonus tolerance for ASME Y14.5 position tolerances with MMC and LMC modifiers.',
    detailDesc: 'GD&T true position calculator: TP=2*sqrt(dx^2+dy^2). Bonus tolerance for MMC (actual-MMC) and LMC (MMC-actual). Tolerance utilization bar, pass/fail assessment per ASME Y14.5.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['true position', 'gdt calculator', 'position tolerance', 'bonus tolerance', 'mmc lmc', 'asme y14.5', 'geometric dimensioning', 'position deviation', 'cmm inspection']
  },
  {
    slug: 'hardness-converter',
    title: 'Hardness Converter (HRC, HV, HB, HRB, N/mm²)',
    description: 'Convert between Rockwell (HRC, HRB), Vickers (HV), Brinell (HB), and tensile strength (N/mm²) hardness scales.',
    detailDesc: 'Hardness scale converter based on ASTM E140 and ISO 18265: Rockwell C (HRC), Rockwell B (HRB), Vickers (HV), Brinell (HB), and estimated tensile strength. Interpolated conversion table for steels.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['hardness converter', 'hrc to hv', 'rockwell to vickers', 'brinell to rockwell', 'hardness scale', 'astm e140', 'tensile strength estimate', 'hrb conversion']
  },
  {
    slug: 'bend-allowance-calculator',
    title: 'Sheet Metal Bend Allowance & Deduction Calculator',
    description: 'Calculate bend allowance, bend deduction, and flat pattern length for sheet metal bending with K-factor.',
    detailDesc: 'Sheet metal bend calculator: BA=A*(R+K*T), BD=2*OSSB*tan(A/2)-BA, flat=flange1+flange2-BD. Supports K-factor selection, bend radius, angle, and flange dimensions for press brake operations.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['bend allowance', 'bend deduction', 'sheet metal calculator', 'k factor', 'flat pattern', 'press brake', 'bend radius', 'outside setback', 'ossb', 'sheet metal fabrication']
  },
  {
    slug: 'turning-speeds-feeds-calculator',
    title: 'CNC Turning Speeds & Feeds Calculator (Lathe)',
    description: 'Calculate spindle RPM, feed rate, cutting time, and MRR for CNC turning operations with material-specific speeds.',
    detailDesc: 'CNC lathe turning calculator: RPM=Vc*1000/(pi*D), feed rate=RPM*fn, MRR=feed*DOC*D, cutting time. Material-specific cutting speeds for HSS and carbide tools across 7 materials.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['turning speeds feeds', 'cnc lathe calculator', 'spindle rpm', 'feed rate turning', 'cutting time', 'mrr turning', 'lathe speeds', 'cutting speed calculator']
  },
  {
    slug: 'milling-mrr-calculator',
    title: 'Milling MRR & Feed Rate Calculator',
    description: 'Calculate material removal rate, feed rate, spindle RPM, and cutting time for CNC milling operations.',
    detailDesc: 'CNC milling calculator: RPM=Vc*1000/(pi*D), feed=RPM*fz*Z, MRR=WOC*DOC*feed/1000. Material-specific cutting speeds and chip loads. Includes power estimation and cutting time.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['milling mrr', 'cnc milling calculator', 'material removal rate', 'feed rate milling', 'chip load', 'flute count', 'spindle rpm milling', 'cutting speed milling']
  },
  {
    slug: 'reynolds-number-calculator',
    title: 'Reynolds Number Calculator (Pipe Flow)',
    description: 'Calculate Reynolds number for pipe flow to determine laminar, transitional, or turbulent flow regime.',
    detailDesc: 'Reynolds number calculator: Re=rho*V*D/mu. Classifies flow as laminar (Re<2300), transitional (2300-4000), or turbulent (>4000). Includes friction factor and fluid presets (water, air, oil, glycerin).',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['reynolds number', 'flow regime', 'laminar turbulent', 'pipe flow', 'friction factor', 'fluid mechanics', 'blasius formula', 'viscosity calculator', 'flow classification']
  },
  {
    slug: 'valve-cv-calculator',
    title: 'Valve Cv Flow Coefficient Calculator',
    description: 'Calculate valve flow coefficient (Cv) for liquids and gases per ISA-75.01 standard.',
    detailDesc: 'Valve Cv calculator: liquid Cv=Q*sqrt(SG/dP), gas Cv=Q/(22.67*sqrt(dP*P2/(SG*T))). Inputs: flow rate, specific gravity, inlet/outlet pressure. For control valve sizing per ISA-75.01.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['valve cv', 'flow coefficient', 'cv calculator', 'valve sizing', 'isa 75.01', 'control valve', 'liquid gas cv', 'pressure drop valve', 'gpm scfh']
  },
  {
    slug: 'ohms-law-calculator',
    title: "Ohm's Law Calculator (V, I, R, P)",
    description: "Calculate voltage, current, resistance, and power using Ohm's law. Enter any two known values to solve for all four.",
    detailDesc: "Ohm's law calculator: V=IR, P=VI=I^2R=V^2/R. Enter any two of voltage, current, resistance, or power to solve for all four. Clean interface with instant results.",
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['ohms law', 'voltage current resistance', 'power calculator', 'electrical calculator', 'v i r p', 'circuit calculator', 'watt calculator', 'amp calculator']
  },
  {
    slug: 'three-phase-power-calculator',
    title: 'Three-Phase Power Calculator (kW, kVA, PF, Amps)',
    description: 'Calculate real power, apparent power, reactive power, power factor, and line current for three-phase AC systems.',
    detailDesc: 'Three-phase power calculator: I=P*1000/(sqrt(3)*V*PF), kVA=kW/PF, kVAR=kVA*sin(phi). Supports power-to-current and current-to-power modes. Motor efficiency for input current calculation.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['three phase power', 'kva kw kvar', 'power factor calculator', 'line current', 'motor current', 'ac power calculator', '3 phase amps', 'reactive power', 'apparent power']
  },
  {
    slug: 'wire-gauge-awg-calculator',
    title: 'Wire Gauge (AWG) Calculator — Diameter, Area & Resistance',
    description: 'Convert AWG wire gauge to diameter, cross-sectional area, resistance per km, and ampacity for copper and aluminum.',
    detailDesc: 'AWG wire gauge calculator: diameter, cross-sectional area, resistance per km (copper/aluminum), and ampacity per NEC Table 310.16. Covers AWG 4/0 to 24 with material selection.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['awg calculator', 'wire gauge', 'wire diameter', 'cross section area', 'wire resistance', 'ampacity', 'copper aluminum wire', 'nec table', 'wire size', 'conductor ampacity']
  },
  {
    slug: 'concrete-volume-mix-calculator',
    title: 'Concrete Volume & Mix Ratio Calculator',
    description: 'Calculate concrete volume for slabs, columns, and footings. Determine cement, sand, aggregate, and water quantities.',
    detailDesc: 'Concrete calculator: volume for slab/column/footing, mix ratio (M5-M25), cement bags, sand and aggregate volume/weight, water quantity. Includes waste factor and dry volume conversion.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['concrete volume', 'concrete mix calculator', 'cement sand aggregate', 'concrete quantity', 'mix ratio', 'cement bags', 'slab column footing', 'm20 m25 concrete', 'construction calculator']
  },
  {
    slug: 'rebar-weight-calculator',
    title: 'Rebar Weight & Spacing Calculator (kg/m, lb/ft)',
    description: 'Calculate rebar weight per meter, total weight for slabs and walls, and number of bars from spacing.',
    detailDesc: 'Rebar weight calculator: unit weight W=d^2/162, total weight for slab reinforcement (both directions), bar count from spacing. Supports bar sizes 8-40mm with slab dimensions.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['rebar weight', 'reinforcement weight', 'rebar calculator', 'bar spacing', 'steel reinforcement', 'rebar kg per meter', 'slab reinforcement', 'bar count calculator', 'rebar weight formula']
  },
  {
    slug: 'engineering-unit-converter',
    title: 'Engineering Unit Converter (Length, Force, Pressure, Energy)',
    description: 'Convert between metric and imperial units across 9 categories: length, mass, force, pressure, energy, power, temperature, velocity, and area.',
    detailDesc: 'Multi-category engineering unit converter: length (mm to miles), mass (mg to tons), force (N to lbf), pressure (Pa to psi), energy (J to BTU), power (W to hp), temperature (C/F/K), velocity (m/s to knots), area (mm² to acres).',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['unit converter', 'metric imperial conversion', 'length converter', 'pressure converter', 'force converter', 'energy converter', 'engineering units', 'measurement conversion', 'si units']
  },
  {
    slug: 'fatigue-life-calculator',
    title: 'Fatigue Life (S-N Curve) Calculator',
    description: 'Calculate fatigue life cycles from stress amplitude using Basquin equation and S-N curves for steel and aluminum.',
    detailDesc: 'Fatigue life calculator using Basquin equation: Sa=a*N^b, a=Sut^2/Se, b=-0.085. Steel endurance limit (infinite life below Se), aluminum always finite. Surface finish and size factors.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['fatigue life', 's-n curve', 'basquin equation', 'endurance limit', 'fatigue calculator', 'stress amplitude', 'fatigue cycles', 'steel aluminum fatigue', 'surface finish factor', 'mechanical fatigue']
  },
  {
    slug: 'section-modulus-calculator',
    title: 'Section Modulus & Moment of Inertia Calculator',
    description: 'Calculate section modulus, moment of inertia, radius of gyration, and area for rectangular, circular, I-beam, box, and tube sections.',
    detailDesc: 'Cross-section property calculator: moment of inertia (Ix, Iy), section modulus (Wx, Wy), area, radius of gyration. Supports solid rectangular, circular, hollow tube, box section, and I-beam profiles.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-15',
    origin: 'native',
    keywords: ['section modulus', 'moment of inertia', 'cross section properties', 'radius of gyration', 'i-beam properties', 'rectangular section', 'circular section', 'tube section', 'box section', 'beam calculator']
  },
  {
    slug: 'pump-affinity-law-calculator',
    title: 'Pump Affinity Law Calculator (Flow, Head & Power)',
    description: 'Calculate new flow rate, head pressure, and shaft power when changing pump speed or impeller diameter per affinity laws.',
    detailDesc: 'Apply centrifugal pump affinity laws to predict performance changes. Q₂/Q₁ = N₂/N₁, H₂/H₁ = (N₂/N₁)², P₂/P₁ = (N₂/N₁)³. Supports both speed change and impeller diameter change modes.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'native',
    keywords: ['pump affinity law', 'centrifugal pump calculator', 'impeller speed change', 'pump performance curve', 'flow head power calculator', 'pump scaling law']
  },
  {
    slug: '3d-print-cost-time-estimator',
    title: '3D Print Time & Filament Cost Estimator',
    description: 'Estimate 3D printing time and filament cost from model volume, infill percentage, layer height, print speed, and material price.',
    detailDesc: 'Calculate print time and material cost for FDM 3D prints. Enter model volume, infill ratio, layer height, and print speed to get estimated print duration and filament weight/cost. Supports PLA, PETG, ABS, and TPU material presets.',
    category: 'calculator',
    status: 'released',
    releasedDate: '2026-07-09',
    origin: 'native',
    keywords: ['3d print time calculator', 'filament cost estimator', 'print time estimate', 'fdm cost calculator', 'pla filament price', '3d printing material cost']
  }
];
