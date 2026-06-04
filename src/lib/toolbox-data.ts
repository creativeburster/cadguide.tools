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
    status: 'coming-soon',
    origin: 'native',
    keywords: ['solidworks shortcuts', 'solidworks hotkeys', 'solidworks cheat sheet', 'sketch gestures']
  },
  {
    slug: 'rhino-shortcuts-sheet',
    title: 'Rhino 3D Shortcut Keys & Command Aliases Guide',
    description: 'Searchable database of Rhino 3D hotkeys, mouse modifiers, and customize command aliases.',
    detailDesc: 'Find all keyboard shortcuts and command aliases for Rhinoceros 3D. Compare defaults with popular industrial design keymaps and download custom .txt alias files.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['rhino shortcuts', 'rhino aliases', 'rhinoceros 3d hotkeys', 'industrial design hotkeys']
  },
  {
    slug: 'revit-shortcuts-sheet',
    title: 'Revit Keyboard Shortcuts & Command Codes Table',
    description: 'Quick reference sheet for Revit BIM modeling commands, modification tools, and view controls.',
    detailDesc: 'Searchable index of two-character Revit shortcuts. Categorized by Architecture, Structure, MEP, and View tabs to speed up your parametric BIM drafting workflow.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['revit shortcuts', 'bim keyboard shortcuts', 'revit keys', 'revit cheat sheet']
  },
  {
    slug: 'sketchup-shortcuts-sheet',
    title: 'SketchUp Pro Quick Reference Hotkeys Cheat Sheet',
    description: 'Quick lookup table for SketchUp drawing axes, tool keys, and view manipulation shortcuts.',
    detailDesc: 'Learn the primary drawing, camera, and layout shortcuts for SketchUp Pro. Includes key combinations for Windows and macOS.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['sketchup shortcuts', 'sketchup hotkeys', 'sketchup cheat sheet', 'sketchup mac shortcuts']
  },
  {
    slug: 'inventor-shortcuts-sheet',
    title: 'Autodesk Inventor Keyboard Shortcuts Reference',
    description: 'Printable list of Inventor assembly, drawing, and sheet metal design shortcut hotkeys.',
    detailDesc: 'Quickly find shortcuts in Inventor. Includes common keys for 2D/3D sketching, component placement, constraint options, and standard presentation tools.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['inventor shortcuts', 'inventor keys', 'autodesk inventor hotkeys', 'cad assembly shortcuts']
  },
  {
    slug: 'microstation-shortcuts-sheet',
    title: 'Bentley MicroStation V8i Keyboard Shortcuts Guide',
    description: 'Searchable index of MicroStation keyboard shortcuts, mouse shortcuts, and workspace mappings.',
    detailDesc: 'Learn the core key-ins and mouse shortcuts for MicroStation. Compare the drawing engine mappings to standard AutoCAD controls.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['microstation shortcuts', 'microstation hotkeys', 'microstation cheat sheet', 'bentley keys']
  },
  {
    slug: 'archicad-shortcuts-sheet',
    title: 'Graphisoft Archicad Keyboard Shortcuts Chart',
    description: 'Quick lookup cheat sheet for Archicad drawing, object placement, and 3D modeling shortcuts.',
    detailDesc: 'Explore all shortcut keys in Archicad Pro. Includes standard hotkeys, navigator modifiers, and custom keyboard layouts.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['archicad shortcuts', 'archicad hotkeys', 'graphisoft shortcuts', 'bim tool shortcuts']
  },
  {
    slug: 'catia-shortcuts-sheet',
    title: 'Dassault CATIA V5/V6 Key Shortcuts Table',
    description: 'Printable cheat sheet for CATIA Sketcher, Part Design, and Generative Shape Design shortcuts.',
    detailDesc: 'Quickly lookup shortcuts in CATIA. Optimize your mechanical assembly design workflows with customized mouse/keyboard modifiers.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['catia shortcuts', 'catia hotkeys', 'part design hotkeys', 'sketcher hotkeys']
  },
  {
    slug: 'creo-shortcuts-sheet',
    title: 'PTC Creo Parametric Shortcut Keys Reference',
    description: 'Essential keyboard shortcuts and mouse modifiers reference for PTC Creo 3D modeling and assembly.',
    detailDesc: 'Search all keyboard commands in Creo. Categorized by sketching, modeling, configuration variables, and custom macro triggers.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['creo shortcuts', 'creo parametric hotkeys', 'ptc creo cheat sheet', 'assembly hotkeys']
  },
  {
    slug: 'freecad-shortcuts-sheet',
    title: 'FreeCAD Open-Source CAD Hotkeys & Mouse Navigation',
    description: 'Searchable index of FreeCAD shortcuts for PartDesign, Draft, and TechDraw workbenches.',
    detailDesc: 'A complete index of hotkeys in FreeCAD. Includes navigation styles like Blender, CAD, and Inventor presets.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['freecad shortcuts', 'freecad workbenches', 'open source cad keys', 'partdesign hotkeys']
  },
  {
    slug: 'fusion360-shortcuts-sheet',
    title: 'Autodesk Fusion 360 Keyboard Hotkeys Reference',
    description: 'Printable reference for Fusion 360 sculpting, modeling, CAM path planning, and rendering tools.',
    detailDesc: 'Quickly search all shortcut keys in Fusion 360. Includes shortcuts for the parametric modeling environment, generative design, and CAM toolpaths.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['fusion 360 shortcuts', 'fusion 360 hotkeys', 'fusion 360 cheat sheet', 'cam hotkeys']
  },
  {
    slug: 'draftsight-shortcuts-sheet',
    title: 'DraftSight Keyboard Shortcuts & Command Aliases',
    description: 'Complete comparison of DraftSight keyboard commands and default aliases for AutoCAD switchers.',
    detailDesc: 'DraftSight matches AutoCAD command-for-command. Learn the key mappings and how to load AutoCAD .pgp alias files to transition seamlessly.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['draftsight shortcuts', 'draftsight aliases', 'draftsight vs autocad', 'cad key mappings']
  },
  {
    slug: 'bricscad-shortcuts-sheet',
    title: 'BricsCAD Hotkeys & Command Customization Guide',
    description: 'Interactive index of BricsCAD Lite, Pro, and BIM keyboard commands and quad cursor controls.',
    detailDesc: 'Compare BricsCAD shortcuts to standard CAD models. Includes quad cursor settings, shortcut customization paths, and custom command macros.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['bricscad shortcuts', 'quad cursor controls', 'bricscad command aliases', 'bricscad hotkeys']
  },
  {
    slug: 'vectorworks-shortcuts-sheet',
    title: 'Vectorworks Keyboard Shortcuts Reference Chart',
    description: 'Searchable cheat sheet for Vectorworks Architect, Landmark, and Spotlight drawing tools.',
    detailDesc: 'Quickly find Vectorworks tool shortcuts. Organized by tool palettes, rendering options, and view navigation settings.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['vectorworks shortcuts', 'vectorworks hotkeys', 'landmark tool keys', 'architect shortcuts']
  },
  {
    slug: 'autocad-vs-gstarcad-shortcuts',
    title: 'AutoCAD vs. GstarCAD Shortcut Command Diff Table',
    description: 'Detailed comparison highlighting the command differences and alias mappings between AutoCAD and GstarCAD.',
    detailDesc: 'While 99% of aliases are identical, some specialized commands differ. Use this diff comparison to transition your drafting office smoothly without breaking your muscle memory.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['autocad vs gstarcad', 'gstarcad command aliases', 'cad migration list', 'alias mapping']
  },
  {
    slug: 'autocad-vs-zwcad-shortcuts',
    title: 'AutoCAD vs. ZWCAD Command Shortcut Diff Guide',
    description: 'Identify the exact command and alias variations between AutoCAD and ZWCAD platforms.',
    detailDesc: 'Provides ZWCAD-specific aliases (e.g. SmartSelect) and compare them side-by-side with AutoCAD standard commands to prevent productivity loss.',
    category: 'cheatsheet',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['autocad vs zwcad', 'zwcad aliases', 'zwcad command difference', 'drafting migration']
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
    keywords: ['viewport scale calculator', 'cad scale factor', 'zoom xp command', 'layout plotting scale']
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
    keywords: ['fits calculator', 'tolerance calculator', 'iso 286 fit calculator', 'mechanical clearance']
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
    keywords: ['tap drill size calculator', 'metric thread drill', 'unc clearance hole', 'machining tap guide']
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
    status: 'coming-soon',
    origin: 'native',
    keywords: ['duct sizing calculator', 'hvac friction loss', 'duct velocity calculator', 'mep air flow']
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
    keywords: ['ctb file reader', 'plot style visualizer', 'ctb pen weights table', 'autocad print style sheet']
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
    keywords: ['rgb to aci', 'autocad index color converter', 'cad hex color matching', 'aci color list']
  },
  {
    slug: 'fatal-error-diagnostic-wizard',
    title: 'AutoCAD Fatal Error & Crash Log Diagnostic Wizard',
    description: 'Input your AutoCAD crash memory address codes to diagnose the crash cause and get fixes.',
    detailDesc: 'A diagnostic wizard mapped to over 100 common AutoCAD crash addresses (e.g. e06d7363h, Access Violation). Gives solutions for graphics acceleration, registry issues, or corrupt DLLs.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['autocad fatal error', 'crash diagnostic code', 'e06d7363h crash fix', 'cad access violation']
  },
  {
    slug: 'flexlm-error-15-debugger',
    title: 'FLEXlm Network License Error -15 Connection troubleshooter',
    description: 'An interactive diagnostic path to solve server port blocks, network timeouts, and firewall licensing issues.',
    detailDesc: 'Resolve licensing issues (e.g., "Cannot connect to license server"). Tests port 27000-27009 status, firewall exclusions, and configures the ADSKFLEX_LICENSE_FILE environment variables.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['flexlm error 15', 'network license connection failed', 'port 27000 block', 'adskflex license file']
  },
  {
    slug: 'drawing-lag-performance-cleaner',
    title: 'Drawing Lag & Slow DWG File Integrity diagnostic',
    description: 'Diagnose laggy viewports and massive dwg files by scanning for scales, regapps, and bloat.',
    detailDesc: 'Analyze your lag symptoms. Guides you through purge commands, removing excessive scale lists (SCALELISTEDIT), binding corrupt Xrefs, and cleaning orphan regapp blocks.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['slow dwg file', 'cad viewport lag', 'cleanup scalelistedit', 'orphan regapps bloat']
  },
  {
    slug: 'missing-font-shx-resolver',
    title: 'Missing CAD Fonts & SHX Substitute Matchbox',
    description: 'Identify unknown missing fonts on drawing opening and download/map safe SHX substitutes.',
    detailDesc: 'When opening drawings with question marks (?) on Chinese/Japanese text or missing symbols, enter the missing font name. Matches it to standard substitutes like gbcbig.shx or hztxt.shx.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['missing shx font', 'cad text question mark', 'gbcbig shx download', 'font substitution map']
  },
  {
    slug: 'pdf-plot-chinese-gibberish-resolver',
    title: 'PDF Plotting Chinese Font Gibberish & Garbled Characters Fix',
    description: 'Resolve plotting issues where Chinese characters show as scrambled letters, question marks, or gibberish in PDF exports.',
    detailDesc: 'Step-by-step diagnostic guide for resolving TTF/SHX font embedding issues in PDF plotter drivers. Covers setting "Capture Fonts" options, system font variables, and switching to DWG to PDF.pc3 config.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['cad pdf gibberish', 'garbled text pdf plotting', 'chinese characters pdf question mark', 'pc3 plotter font capture']
  },
  {
    slug: 'cad-hatch-scale-optimizer',
    title: 'CAD Hatch Pattern Scale Optimizer',
    description: 'Optimize drawing patterns density to prevent viewport freezes and empty hatches.',
    detailDesc: 'Calculate recommended hatch scales based on current drawing units (Metric vs Imperial) and targeted sheet scales to prevent solid hatch scaling crashes (MAXHATCH limit exceeded).',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['hatch scale optimizer', 'maxhatch fix', 'autocad hatch scale', 'hatch density limit']
  },
  {
    slug: 'cad-limits-checker',
    title: 'CAD Drawing Limits & Grid boundary Calculator',
    description: 'Quickly set up grid limits for architectural plotting and standard paper sizes in model space.',
    detailDesc: 'Input target standard paper size (A0-A4, Arch E) and drawing scale to get exact coordinates for setting the LIMITS and GRID limits in model space.',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['cad limits calculator', 'autocad drawing limits', 'grid boundaries A3', 'paper limits coordinate']
  },
  {
    slug: 'pipe-friction-head-loss',
    title: 'Pipe Flow Friction Head Loss (Hazen-Williams) Calculator',
    description: 'Calculate pipe flow velocity, piping friction losses, and pump sizing head adjustments.',
    detailDesc: 'Uses Hazen-Williams formulas to calculate pressure drops in commercial piping systems. Supports copper, PVC, steel, and cast iron parameters.',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['pipe head loss calculator', 'hazen williams pressure drop', 'piping friction loss', 'pump head sizing']
  },
  {
    slug: 'screw-torque-preload-calculator',
    title: 'Bolt Tightening Torque & Preload Tension Calculator',
    description: 'Find required assembly torque, bolt preloads, and tightening standards for high-tensile fasteners.',
    detailDesc: 'Apply standard mechanical bolt torque equations (T=KFD) to determine target installation preloads based on friction coefficients and bolt grades (8.8, 10.9, 12.9).',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['bolt torque calculator', 'fastener preload tension', 'tightening torque 10.9', 'mechanical screw preload']
  },
  {
    slug: 'weld-strength-calculator',
    title: 'Fillet Weld Strength & Load Capacity Calculator',
    description: 'Calculate throat thickness, joint stress limits, and load capacity for structural steel welds.',
    detailDesc: 'Determine mechanical load limits for standard fillet and butt welds under AISC structural guidelines based on electrode strengths (E70XX) and plate thickness.',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['weld strength calculator', 'fillet weld throat size', 'aisc weld capacity', 'joint stress calculator']
  },
  {
    slug: 'spring-force-rate-calculator',
    title: 'Helical Compression Spring Rate & Force Calculator',
    description: 'Calculate spring stiffness, deflection limits, and wire sizing configurations.',
    detailDesc: 'Compute spring rates, shear stress, and coil deflections based on active wire diameters, coil counts, and shear modulus of materials.',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['spring rate calculator', 'compression spring force', 'coil stiffness calculator', 'spring deflection limits']
  },
  {
    slug: 'autocad-registry-clean-generator',
    title: 'Clean Registry Reset Batch File Generator',
    description: 'Create a customized Windows command script to safely reset AutoCAD settings and clean profiles.',
    detailDesc: 'Generate a clean .bat batch script to remove orphaned registry paths, cached license locks, and configuration settings when performing clean CAD reinstalls.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['clean uninstall autocad', 'reset cad registry batch', 'remove licensing cache', 'autocad bat reset']
  },
  {
    slug: 'acad-pgp-alias-editor',
    title: 'Online ACAD.pgp Command Alias Editor & Compiler',
    description: 'Edit, customize, and compile AutoCAD PGP command shortcut files directly in your browser.',
    detailDesc: 'Upload your existing acad.pgp or gcad.pgp, edit aliases in an interactive table, detect duplicate hotkeys, and download a syntactically verified output PGP file.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['edit acad pgp', 'cad command alias compiler', 'pgp alias editor online', 'reinit pgp shortcuts']
  },
  {
    slug: 'flexlm-debug-log-analyzer',
    title: 'FLEXlm License Log Offline Analyzer',
    description: 'Parse network license debug logs locally to audit usage statistics and license denials.',
    detailDesc: 'Drag your lmgrd debug log files locally in your browser. Analyzes denied checkouts, concurrent usage peaks, and seat hogging without uploading sensitive server logs.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['flexlm log analyzer', 'lmgrd debug log audit', 'license denials report', 'floating license usage chart']
  },
  {
    slug: 'missing-regapp-cleaner-batch',
    title: 'Massive Regapp Bloat Command Script Generator',
    description: 'Generate safe macro script commands to clean orphan registered application blocks.',
    detailDesc: 'If your drawings are bloated and laggy, generate a custom LISP macro script to purge excessive registered applications (-PURGE > R) in automated batch routines.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['purge regapps command', 'dwg bloat script', 'registered application cleanup', 'lisp purge regapp']
  },
  {
    slug: 'cad-scale-list-reset-helper',
    title: 'CAD Plotting Scale List Reset Automation Guide',
    description: 'Resolve drawing lag caused by custom scale lists using automated command script builders.',
    detailDesc: 'Custom scale lists often bloat drawings through external references. Generate the exact script routine command to restore standard default scale lists in any CAD interface.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'native',
    keywords: ['scale list reset utility', 'scalelistedit bloat fix', 'cad plotting scale reset', 'xref scale cleanup']
  },

  // ==================== THIRD-PARTY (25 External Cloud Tools) ====================
  {
    slug: 'online-pdf-to-dwg-converter',
    title: 'Online Vector PDF to CAD DWG Converter Portal',
    description: '客观评测与直达：将 PDF 图纸无损还原为包含图层和矢量线段的 DWG/DXF 文件。',
    detailDesc: 'When you need to restore vector geometries from structural PDF drawings, converting them to standard DWG is critical. We review the top 5 cloud-based converters, highlighting conversion accuracy, text recognition (OCR) fidelity, and layering outputs.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['pdf to dwg converter', 'vector pdf to dxf', 'online pdf conversion reviews', 'cad tracing tools']
  },
  {
    slug: 'online-dwg-to-pdf-cloud-printer',
    title: 'Online DWG to Vector PDF Batch Cloud Printer',
    description: '客观评测与直达：无需安装 CAD 软件，云端批量将 DWG 图纸高保真转化为 PDF 格式。',
    detailDesc: 'Need to print high-resolution PDF sets from DWG files without desktop CAD? We evaluate cloud plotters that preserve CTB line weights, layout tabs, viewport scales, and support batch queues.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['dwg to pdf online', 'cloud pc3 plotter', 'batch dwg printing', 'ctb vector printing']
  },
  {
    slug: 'online-dwg-version-downgrader-cloud',
    title: 'Online DWG Format Version Downgrader',
    description: '客观评测与直达：快速将最新的 AC1032 图纸在线保存降级为低版本 CAD 兼容格式。',
    detailDesc: 'If your local drafting software throws "version unsupported" errors, use these verified cloud conversion pipelines to quickly convert AutoCAD 2027 format DWG files down to legacy AutoCAD 2013 (AC1027) or 2004 (AC1018) compatible formats.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['downgrade dwg version', 'convert cad version online', 'ac1032 to ac1027 converter', 'autocad file converter']
  },
  {
    slug: 'cloud-dwg-to-step-iges-converter',
    title: 'Online 3D DWG to STEP/IGES CAD Translator',
    description: '客观评测与直达：将 DWG 三维实体模型转化为通用制造格式（STEP/IGES）以进行 CNC 加工。',
    detailDesc: 'Evaluate commercial cloud CAD translators that take 3D solids inside DWG and export watertight STEP or IGES mesh files suitable for SolidWorks, Rhino, or CNC CAM path planning tools.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['dwg to step converter', '3d dwg to iges translator', 'cad format conversion cloud', 'cnc mesh translation']
  },
  {
    slug: 'cloud-bim-rvt-to-ifc-converter',
    title: 'Online Revit RVT to openBIM IFC Standard Converter',
    description: '客观评测与直达：将 Autodesk Revit (RVT) 专有文件转为 openBIM 开放式 IFC 标准模型。',
    detailDesc: 'BIM model exchange requires open standard compatibility. We benchmark cloud compilation engines that parse Revit families and output clean, compliant buildingSmart IFC models without losing property parameters.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['rvt to ifc cloud', 'revit openbim exporter', 'ifc validation utility', 'bim model translation']
  },
  {
    slug: 'online-dgn-to-dwg-converter',
    title: 'Online Bentley DGN to AutoCAD DWG Layer Converter',
    description: '客观评测与直达：在线将 Bentley MicroStation DGN 图纸高精度转换为 DWG/DXF 格式。',
    detailDesc: 'MicroStation and AutoCAD handle geometries differently. We benchmark cloud tools that map DGN levels to DWG layers, maintaining complex custom line styles and shared cell structures without geometric data corruption.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['dgn to dwg online', 'microstation to autocad conversion', 'map dgn levels to layers', 'shared cells mapping']
  },
  {
    slug: 'cloud-dwg-drawing-recovery-service',
    title: 'Online Damaged DWG Drawing Recovery & Repair Portal',
    description: '客观评测与直达：云端修复损坏、打不开或提示 "Drawing file is not valid" 的 DWG 文件。',
    detailDesc: 'When drawings get corrupt and local RECOVER commands fail, cloud recovery services can reconstruct the drawing database. We review portals that repair header metadata and salvage drawing layers.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['repair corrupt dwg', 'drawing file is not valid online', 'recover broken cad drawing', 'dwg header repair cloud']
  },
  {
    slug: 'online-3d-cad-viewer-collaborator',
    title: 'Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal',
    description: '客观评测与直达：在线看图与协同评审，支持各类 3D CAD 格式直接导入和红线标注。',
    detailDesc: 'Review the top cloud CAD visualization platforms that let clients interact with complex 3D CAD assemblies (CATIA, NX, Inventor) or Revit models directly in browsers, without active software licenses.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['cloud 3d cad viewer', 'share revit model online', 'mobile bim viewer', 'redline markup tool']
  },
  {
    slug: 'online-point-cloud-to-mesh-converter',
    title: 'Online Point Cloud (LAS/PTS) to Watertight Mesh Converter',
    description: '客观评测与直达：在线将激光雷达点云数据转化为可在 CAD 里编辑的封闭网格曲面。',
    detailDesc: 'LiDAR scanning outputs massive coordinates lists. We evaluate cloud-scale point cloud meshing servers that convert raw LAS or PTS data into standard OBJ or DXF meshes.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['point cloud to mesh converter', 'las file to obj converter', 'convert scanner data online', 'dxf terrain generator']
  },
  {
    slug: 'cloud-dxf-to-gcode-laser-converter',
    title: 'Online DXF to CNC G-Code Path Planner',
    description: '客观评测与直达：在线将 DXF 轮廓图转化为雕刻机、激光切割机可执行的 G-Code 刀轨。',
    detailDesc: 'For digital fabricators. We evaluate cloud toolpath compilers that take standard 2D DXF contours and generate G-code commands, configuring lead-in, lead-out, and cutting speeds.',
    category: 'calculator',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['dxf to gcode converter', 'online laser cutter path', 'cnc toolpath generator', 'plasma cutting gcode']
  },
  {
    slug: 'online-step-to-stl-slicer-helper',
    title: 'STEP to Sliced STL Mesh Resolution Cloud Helper',
    description: '客观评测与直达：在线将三维工程格式 (STEP) 转换为适合 3D 打印的 STL 网格。',
    detailDesc: 'Benchmark converters that handle high-fidelity parametric STEP models, converting them to optimized polygonal STL meshes while letting you control chordal deviation and slice limits.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['step to stl converter', 'mesh resolution optimizer', '3d printing export cloud', 'parametric stl slicer']
  },
  {
    slug: 'online-dwg-to-dxf-batch-converter',
    title: 'Online Bulk DWG / DXF Format Mutual Converter',
    description: '客观评测与直达：免安装软件，云端大批量实现 DWG 与 DXF 文件格式的相互转换。',
    detailDesc: 'We evaluate batch cloud conversion portals that let you upload hundreds of DWG drawings, converting them to DXF formatting and maintaining script execution safety.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['batch dwg to dxf', 'online dxf converter', 'drawing conversion server', 'script safe converters']
  },
  {
    slug: 'cloud-cad-telemetry-blocker-wizard',
    title: 'Enterprise CAD Telemetry Blocker Configuration Portal',
    description: '客观评测与直达：为企业 IT 阻断 CAD 软件的静默联网遥测与反盗版合规回传。',
    detailDesc: 'Evaluate firewall config builders and network scripts that restrict AutoCAD or SolidWorks from making silent outbound telemetry calls, preventing audits and network licensing server timeouts.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['block autodesk telemetry', 'solidworks license check block', 'cad firewall rules builder', 'network license security']
  },
  {
    slug: 'online-lisp-script-compiler-protector',
    title: 'AutoLISP LSP Script Encryption (FAS/VLX) Online Portal',
    description: '客观评测与直达：在线将 AutoLISP 源代码加密编译为 FAS 或 VLX 字节码保护知识产权。',
    detailDesc: 'If you want to protect your custom LISP scripts from plagiarism before distribution, use these online compilation wizards to convert ASCII .lsp scripts into compiled .fas executable blocks.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['encrypt lisp code', 'compile lsp to fas online', 'autolisp code protector', 'vlx script compiler']
  },
  {
    slug: 'online-revit-family-checker-audit',
    title: 'BIM Revit Family File Integrity & Parameter Auditor',
    description: '客观评测与直达：在线上传 Revit 族文件 (.rfa) 审计其图元数据、垃圾积压及共享参数。',
    detailDesc: 'Benchmark online BIM auditors that inspect Revit family files for redundant parameters, unpurged objects, and parameter naming compliance, optimizing BIM models performance before ingestion.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['revit family auditor', 'rfa file check online', 'shared parameters compliance', 'bim model optimization']
  },
  {
    slug: 'online-ifc-viewer-validator',
    title: 'Online openBIM IFC Standard File Validator & Viewer',
    description: '客观评测与直达：在线验证与查看 IFC 建筑模型，自动分析实体关系与合规性。',
    detailDesc: 'Ensure buildingSmart compliance. We review web-based IFC validators that check geometric watertighthness, space relations, and metadata completeness according to IFC 2x3 and IFC 4 standards.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['ifc file validator', 'openbim validation online', 'check ifc file structure', 'buildingsmart standard']
  },
  {
    slug: 'online-point-cloud-las-to-dxf-contour',
    title: 'Online Point Cloud LAS to DXF Terrain Contour Generator',
    description: '客观评测与直达：云端将测绘雷达点云（LAS）直接提取生成为 CAD 等高线图纸。',
    detailDesc: 'Evaluate online mapping portals that extract ground elevation levels from raw LAS coordinates and generate smooth topograhic contour vectors in DXF formats for road designs.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['point cloud terrain generator', 'las file to contour online', 'dxf contour generator', 'civil mapping tool']
  },
  {
    slug: 'online-solidworks-e-drawings-cloud-viewer',
    title: 'Online SolidWorks eDrawings (SLDPRT/SLDASM) Viewer',
    description: '客观评测与直达：无需安装任何插件，在线查看并标注 SolidWorks 零件与装配体。',
    detailDesc: 'Compare cloud viewers that load SolidWorks SLDPRT or SLDASM files in WebGL layers, letting you inspect model structure, rotate assemblies, and perform cross-section mockups.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['sldprt file viewer online', 'view solidworks assemblies browser', 'web edrawings viewer', 'machining model viewer']
  },
  {
    slug: 'online-dwg-compare-diff-viewer',
    title: 'Cloud DWG Revision Difference & Compare Visualizer',
    description: '客观评测与直达：在线对比两版 DWG 图纸的差异，自动用红绿两色高亮改动实体。',
    detailDesc: 'We evaluate cloud tools that parse two dwg files and visually overlay them. Highlight insertions, deletions, and metadata updates in layout files to speed up drafting reviews.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['dwg comparison online', 'compare drawing versions', 'cad diff tool', 'revision highlighter']
  },
  {
    slug: 'online-image-jpg-to-dxf-vectorizer',
    title: 'Online Image Raster (JPG/PNG) to Vector DXF Tracer',
    description: '客观评测与直达：在线将 JPG/PNG 图片无损描摹转换为 CAD 适用的 DXF 矢量线条。',
    detailDesc: 'Review cloud tracing engines that take raster scans of plans or hand-drawn schematics, converting them into smooth bezier arcs and vector line segments in DXF formats.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['raster to vector converter', 'jpg to dxf tracer online', 'convert blueprint to dxf', 'vectorize plan scans']
  },
  {
    slug: 'online-step-to-obj-gltf-converter',
    title: 'Online STEP to glTF/OBJ Rendering Mesh Converter',
    description: '客观评测与直达：将工业 STEP 格式转换为轻量级 OBJ 或 glTF 用于 WebGL 或 VR 渲染。',
    detailDesc: 'Benchmark CAD conversion pipelines that polygonize nurbs boundary representations in STEP models, generating texture-mapped glTF mesh outputs for VR, AR, or Three.js environments.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['step to gltf converter', 'convert step to obj online', 'webgl mesh translator', 'step to mesh converter']
  },
  {
    slug: 'online-cad-license-audit-shield',
    title: 'Enterprise CAD Software Anti-Piracy Audit Shield Guide',
    description: '客观评测与直达：企业如何应对 Autodesk 或 SolidWorks 的反盗版合规审查与罚款。',
    detailDesc: 'We review defensive legal checklists, license scanning utilities, and network proxy setups that help enterprise SAM administrators identify and resolve unlicensed software liabilities before audit letters arrive.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['autodesk license audit defense', 'solidworks anti piracy letter', 'cad compliance shield', 'unlicensed software audit help']
  },
  {
    slug: 'online-dwg-layer-splitter-cloud',
    title: 'Online DWG Layer Splitter & Batch Drawing Separator',
    description: '客观评测与直达：云端大图纸按图层拆分为多个独立的子 DWG 文件。',
    detailDesc: 'Evaluate online scripts that parse multi-layered drawings (e.g. electrical + mechanical Xrefs), slicing them down layer-by-layer into clean, separate sub-drawings.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['split dwg layers online', 'dwg divider cloud', 'batch layer separator', 'cad batch exporting']
  },
  {
    slug: 'online-dxf-text-translator-cloud',
    title: 'Online DXF/DWG Drawing Multi-Language Batch Translator',
    description: '客观评测与直达：云端批量将 DXF 图纸中的标注和文本进行中英文及多语种互译。',
    detailDesc: 'Review localization servers that batch-translate text and block attributes in dxf files without corrupting coordinate parameters, outputting correctly encoded SHX formatting.',
    category: 'troubleshoot',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['translate cad drawing online', 'translate dxf text', 'dwg multi language localization', 'shx text translation']
  },
  {
    slug: 'online-skp-to-fbx-cloud-converter',
    title: 'Online SketchUp SKP to FBX Render Mesh Converter',
    description: '客观评测与直达：云端将 SketchUp 场景（SKP）转换为带贴图材质的 FBX 渲染网格文件。',
    detailDesc: 'Evaluate cloud polygonization utilities that take architectural SKP files and output render-ready FBX models with matching texture coordinates, ready for Twinmotion or Lumion rendering.',
    category: 'converter',
    status: 'coming-soon',
    origin: 'third-party',
    keywords: ['skp to fbx online', 'sketchup rendering export', 'convert skp scene to mesh', 'fbx texture mapping']
  }
];
