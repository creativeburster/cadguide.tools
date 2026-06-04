export interface ToolboxItem {
  slug: string;
  title: string;
  description: string;
  detailDesc: string;
  category: 'cheatsheet' | 'calculator' | 'converter' | 'troubleshoot';
  status: 'released' | 'coming-soon';
  releasedDate?: string;
  keywords: string[];
}

export const TOOLBOX_CATEGORIES = [
  { id: 'all', name: 'All Utilities' },
  { id: 'cheatsheet', name: 'Cheat Sheets & References' },
  { id: 'calculator', name: 'Engineering Calculators' },
  { id: 'converter', name: 'Parsers & File Converters' },
  { id: 'troubleshoot', name: 'Troubleshooting Guides' },
] as const;

export const TOOLBOX_DATA: ToolboxItem[] = [
  // ==================== CHEAT SHEETS & REFERENCES ====================
  {
    slug: 'shortcuts',
    title: 'Cross-Platform CAD Shortcuts Matrix',
    description: 'Compare and print keyboard command shortcuts across AutoCAD, GstarCAD, ZWCAD, and DWG FastView.',
    detailDesc: 'An interactive matrix comparing over 30 essential drafting shortcuts across major CAD packages. Includes one-click command copying and optimized Landscape style layouts for office desk cheatsheet printing.',
    category: 'cheatsheet',
    status: 'released',
    releasedDate: '2026-06-04',
    keywords: ['cad shortcuts', 'autocad cheat sheet', 'gstarcad hotkeys', 'zwcad shortcuts', 'print shortcuts']
  },
  {
    slug: 'solidworks-shortcuts-sheet',
    title: 'SolidWorks Essential Keyboard Shortcuts List',
    description: 'Printable list of SolidWorks sketch, assembly, and drawing hotkeys and mouse gestures.',
    detailDesc: 'A comprehensive, searchable index of SolidWorks shortcuts, including standard hotkeys, S-key shortcuts, and customizable mouse gestures. Highly optimized for print and quick lookup.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['solidworks shortcuts', 'solidworks hotkeys', 'solidworks cheat sheet', 'sketch gestures']
  },
  {
    slug: 'rhino-shortcuts-sheet',
    title: 'Rhino 3D Shortcut Keys & Command Aliases Guide',
    description: 'Searchable database of Rhino 3D hotkeys, mouse modifiers, and customize command aliases.',
    detailDesc: 'Find all keyboard shortcuts and command aliases for Rhinoceros 3D. Compare defaults with popular industrial design keymaps and download custom .txt alias files.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['rhino shortcuts', 'rhino aliases', 'rhinoceros 3d hotkeys', 'industrial design hotkeys']
  },
  {
    slug: 'revit-shortcuts-sheet',
    title: 'Revit Keyboard Shortcuts & Command Codes Table',
    description: 'Quick reference sheet for Revit BIM modeling commands, modification tools, and view controls.',
    detailDesc: 'Searchable index of two-character Revit shortcuts. Categorized by Architecture, Structure, MEP, and View tabs to speed up your parametric BIM drafting workflow.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['revit shortcuts', 'bim keyboard shortcuts', 'revit keys', 'revit cheat sheet']
  },
  {
    slug: 'sketchup-shortcuts-sheet',
    title: 'SketchUp Pro Quick Reference Hotkeys Cheat Sheet',
    description: 'Quick lookup table for SketchUp drawing axes, tool keys, and view manipulation shortcuts.',
    detailDesc: 'Learn the primary drawing, camera, and layout shortcuts for SketchUp Pro. Includes key combinations for Windows and macOS.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['sketchup shortcuts', 'sketchup hotkeys', 'sketchup cheat sheet', 'sketchup mac shortcuts']
  },
  {
    slug: 'autocad-vs-gstarcad-shortcuts',
    title: 'AutoCAD vs. GstarCAD Shortcut Command Diff Table',
    description: 'Detailed comparison highlighting the command differences and alias mappings between AutoCAD and GstarCAD.',
    detailDesc: 'While 99% of aliases are identical, some specialized commands differ. Use this diff comparison to transition your drafting office smoothly without breaking your muscle memory.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['autocad vs gstarcad', 'gstarcad command aliases', 'cad migration list', 'alias mapping']
  },
  {
    slug: 'hatch-patterns-scale-reference',
    title: 'Standard CAD Hatch Pattern Scale & Line Type Reference',
    description: 'Visual library of standard ANSI and ISO hatch patterns with recommended scale factors for plotting.',
    detailDesc: 'Provides visual previews of all standard hatch patterns. Input your target plot scale (e.g. 1:50) to instantly get the correct hatch scale factor to avoid solid-block plotting errors.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['cad hatch patterns', 'hatch scale calculator', 'ansi hatch list', 'iso hatch scale']
  },
  {
    slug: 'limits-and-fits-fits-table',
    title: 'ISO Limits and Fits (H7/g6) Tolerance Reference Chart',
    description: 'Visual matching reference guide for hole-basis and shaft-basis engineering fit systems.',
    detailDesc: 'Quickly find upper and lower limit deviations for mechanical clearances, transitions, and interference fits (e.g. H7/g6, H8/f7) according to ISO 286 standards.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['iso limits and fits', 'h7 g6 tolerance', 'fits table', 'shaft hole clearance']
  },
  {
    slug: 'bim-lod-specification-matrix',
    title: 'BIM LOD (Level of Development) 100-500 Specification Matrix',
    description: 'A detailed requirements checklist for BIM objects from LOD 100 schematic design to LOD 500 as-built.',
    detailDesc: 'An interactive checklist and specification matrix defining the geometric (LOG) and information (LOI) requirements for architectural, structural, and MEP Revit families at each LOD tier.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['bim lod', 'level of development', 'lod 300 vs 400', 'revit lod standards']
  },
  {
    slug: 'fusion360-shortcuts-sheet',
    title: 'Autodesk Fusion 360 Keyboard Hotkeys Reference',
    description: 'Printable reference for Fusion 360 sculpting, modeling, CAM path planning, and rendering tools.',
    detailDesc: 'Quickly search all shortcut keys in Fusion 360. Includes shortcuts for the parametric modeling environment, generative design, and CAM toolpaths.',
    category: 'cheatsheet',
    status: 'coming-soon',
    keywords: ['fusion 360 shortcuts', 'fusion 360 hotkeys', 'fusion 360 cheat sheet', 'cam hotkeys']
  },

  // ==================== CALCULATORS ====================
  {
    slug: 'k-factor-calculator',
    title: 'DIN 6935 Sheet Metal Bend Allowance & K-Factor Calculator',
    description: 'Calculate sheet metal bend deduction, bend allowance, and flat pattern blank size.',
    detailDesc: 'Apply standard DIN 6935 metal bending formulas to compute sheet metal flat lengths. Featuring dynamic SVG visualizations of inner bend radius, thickness, and neutral fiber shifting.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['k-factor calculator', 'bend allowance', 'bend deduction', 'sheet metal flat length', 'din 6935']
  },
  {
    slug: 'flexlm-concurrent-seats-queue',
    title: 'FLEXlm Network Floating License Optimization Calculator',
    description: 'Optimize software licensing budgets by calculating the minimum floating licenses required using Erlang-C.',
    detailDesc: 'Input your team size, peak CAD drafting hour overlap, and license denial tolerance. The calculator uses the Erlang-C queuing algorithm to find the ideal license seat pool to minimize costs.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['flexlm license calculator', 'floating licenses', 'concurrent license optimization', 'erlang c server']
  },
  {
    slug: '3d-printing-chordal-deviation',
    title: '3D Printing Watertight Mesh Chordal Deviation Calculator',
    description: 'Optimize STEP/IGES to STL export resolution by calculating chordal sagitta deviation.',
    detailDesc: 'Input cylinder radius and angular export tolerances to calculate chordal deviation. Tells you if your STL export mesh will show faceted stepping on circular holes.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['chordal deviation', 'stl resolution calculator', 'watertight mesh export', '3d print faceting']
  },
  {
    slug: 'viewport-scale-factor-converter',
    title: 'CAD Viewport Scale Factor & XP Zoom Command Calculator',
    description: 'Calculate viewport scale factor multipliers and the exact XP command input for AutoCAD layout viewports.',
    detailDesc: 'Choose your model space units (mm, cm, m, inches), paper space layouts, and target print scales (e.g. 1:50). The tool outputs the exact Zoom XP multiplier (e.g., 1/50xp) for your drawing window.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['viewport scale calculator', 'cad scale factor', 'zoom xp command', 'layout plotting scale']
  },
  {
    slug: 'limits-and-fits-calculator',
    title: 'ISO 286 Mechanical Limits and Fits Calculator',
    description: 'Enter shaft and hole dimensions to instantly calculate engineering tolerances and fit classifications.',
    detailDesc: 'Calculates maximum/minimum clearance or interference, fundamental deviations, and tolerance bands for metric shafts and holes. Visualizes standard tolerances in real-time.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['fits calculator', 'tolerance calculator', 'iso 286 fit calculator', 'mechanical clearance']
  },
  {
    slug: 'thread-drill-size-calculator',
    title: 'Thread Tap & Drill Size Clearance Calculator',
    description: 'Search recommended drill sizes for metric (M) and unified (UNC/UNF) threads based on engagement percentages.',
    detailDesc: 'Calculates the ideal pilot hole drill diameter for tapping threads. Supports 50% to 75% thread engagement tolerances for steel, aluminum, and brass.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['tap drill size calculator', 'metric thread drill', 'unc clearance hole', 'machining tap guide']
  },
  {
    slug: 'beam-deflection-structural-calculator',
    title: 'Steel I-Beam Deflection & Section Modulus Calculator',
    description: 'Determine load-bearing limits, maximum deflection, and section modulus for structural H-Beams.',
    detailDesc: 'Input span length, point loads, and steel beam cross-sections to check bending stress and maximum deflections under AISC construction standards.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['beam deflection calculator', 'section modulus steel', 'i-beam bending limits', 'aisc load limits']
  },
  {
    slug: 'duct-size-friction-loss-calculator',
    title: 'HVAC Air Duct Sizing & Friction Loss Calculator',
    description: 'Calculate rectangular and round duct sizes, air velocity, and static friction head loss.',
    detailDesc: 'For mechanical MEP engineers. Enter targeted airflow (CFM) and friction limits to instantly calculate equivalent duct sizes and flow velocity.',
    category: 'calculator',
    status: 'coming-soon',
    keywords: ['duct sizing calculator', 'hvac friction loss', 'duct velocity calculator', 'mep air flow']
  },

  // ==================== PARSERS & FILE CONVERTERS ====================
  {
    slug: 'dwg-version-checker',
    title: 'AutoCAD DWG Version Checker & Compatibility Matrix',
    description: 'Drag and drop your .dwg drawing file to detect its internal AutoCAD file format version locally.',
    detailDesc: 'An instant, client-side binary parser reading the first 6 bytes of your DWG file header (e.g. AC1032, AC1027). Checks read/write compatibility across GstarCAD, ZWCAD, AutoCAD, and DWG FastView.',
    category: 'converter',
    status: 'released',
    releasedDate: '2026-06-04',
    keywords: ['dwg version checker', 'dwg header code', 'ac1032 compatibility', 'autocad drawing reader']
  },
  {
    slug: 'dxf-watermark-layer-parser',
    title: 'DXF Educational Watermark Detector & ASCII Layer Parser',
    description: 'Inspect ASCII DXF files locally to scan for Autodesk educational plotting watermarks and extract layer tables.',
    detailDesc: 'Upload a DXF drawing to scan for educational version registry signatures that trigger printing border stamps. Extracts all active layer tables and colors without uploading files.',
    category: 'converter',
    status: 'coming-soon',
    keywords: ['dxf educational watermark', 'dxf layer parser', 'remove educational plot stamp', 'dxf registry scanner']
  },
  {
    slug: 'ctb-plot-style-pen-visualizer',
    title: 'CAD CTB Plot Style Color & Pen Thickness Visualizer',
    description: 'Load your color-dependent plot style (CTB) files to visualize and export pen width calibrations.',
    detailDesc: 'Upload custom .ctb style sheets. The client-side parser decodes index colors to display pen weights (mm), screening, and linestyles in a searchable 255-color grid. Export as printable PDF or JSON.',
    category: 'converter',
    status: 'coming-soon',
    keywords: ['ctb file reader', 'plot style visualizer', 'ctb pen weights table', 'autocad print style sheet']
  },
  {
    slug: 'pdf-scale-calibration-helper',
    title: 'PDF to CAD Drawing Scale Calibration Calculator',
    description: 'Find the exact scale factor to scale imported PDF drawings back to 1:1 model space coordinates.',
    detailDesc: 'When importing Vector PDFs, they are often scaled down. Input a known dimension on the PDF and its design measurement to compute the exact scale factor to input in the SCALE command.',
    category: 'converter',
    status: 'coming-soon',
    keywords: ['pdf to cad scale', 'pdf import calibration', 'scale vector pdf', '1to1 model coordinates']
  },
  {
    slug: 'survey-coordinates-to-dxf-generator',
    title: 'XYZ Survey Coordinates to DXF Point Plotter',
    description: 'Convert plain text XYZ survey coordinate lists into a downloadable 2D/3D DXF file with points.',
    detailDesc: 'Paste space or comma-separated XYZ coordinates to instantly generate and download a compliant DXF file containing point entities and elevation labels.',
    category: 'converter',
    status: 'coming-soon',
    keywords: ['xyz to dxf converter', 'survey point plotter', 'coordinates to cad drawing', 'dxf points generator']
  },
  {
    slug: 'color-rgb-to-aci-matchbox',
    title: 'RGB Hex to ACI (AutoCAD Index Color) Conversion Helper',
    description: 'Convert standard RGB or Hex color codes to their closest matching AutoCAD Index Color (1-255).',
    detailDesc: 'Enter RGB or Hex values. The algorithm calculates color distance (Delta E) to match your color to the nearest standard ACI code used in CTB line weight indexing.',
    category: 'converter',
    status: 'coming-soon',
    keywords: ['rgb to aci', 'autocad index color converter', 'cad hex color matching', 'aci color list']
  },

  // ==================== TROUBLESHOOTING GUIDES ====================
  {
    slug: 'fatal-error-diagnostic-wizard',
    title: 'AutoCAD Fatal Error & Crash Log Diagnostic Wizard',
    description: 'Input your AutoCAD crash memory address codes to diagnose the crash cause and get fixes.',
    detailDesc: 'A diagnostic wizard mapped to over 100 common AutoCAD crash addresses (e.g. e06d7363h, Access Violation). Gives solutions for graphics acceleration, registry issues, or corrupt DLLs.',
    category: 'troubleshoot',
    status: 'coming-soon',
    keywords: ['autocad fatal error', 'crash diagnostic code', 'e06d7363h crash fix', 'cad access violation']
  },
  {
    slug: 'flexlm-error-15-debugger',
    title: 'FLEXlm Network License Error -15 Connection troubleshooter',
    description: 'An interactive diagnostic path to solve server port blocks, network timeouts, and firewall licensing issues.',
    detailDesc: 'Resolve licensing issues (e.g., "Cannot connect to license server"). Tests port 27000-27009 status, firewall exclusions, and configures the ADSKFLEX_LICENSE_FILE environment variables.',
    category: 'troubleshoot',
    status: 'coming-soon',
    keywords: ['flexlm error 15', 'network license connection failed', 'port 27000 block', 'adskflex license file']
  },
  {
    slug: 'drawing-lag-performance-cleaner',
    title: 'Drawing Lag & Slow DWG File Integrity diagnostic',
    description: 'Diagnose laggy viewports and massive dwg files by scanning for scales, regapps, and bloat.',
    detailDesc: 'Analyze your lag symptoms. Guides you through purge commands, removing excessive scale lists (SCALELISTEDIT), binding corrupt Xrefs, and cleaning orphan regapp blocks.',
    category: 'troubleshoot',
    status: 'coming-soon',
    keywords: ['slow dwg file', 'cad viewport lag', 'cleanup scalelistedit', 'orphan regapps bloat']
  },
  {
    slug: 'missing-font-shx-resolver',
    title: 'Missing CAD Fonts & SHX Substitute Matchbox',
    description: 'Identify unknown missing fonts on drawing opening and download/map safe SHX substitutes.',
    detailDesc: 'When opening drawings with question marks (?) on Chinese/Japanese text or missing symbols, enter the missing font name. Matches it to standard substitutes like gbcbig.shx or hztxt.shx.',
    category: 'troubleshoot',
    status: 'coming-soon',
    keywords: ['missing shx font', 'cad text question mark', 'gbcbig shx download', 'font substitution map']
  },
  {
    slug: 'pdf-plot-chinese-gibberish-resolver',
    title: 'PDF Plotting Chinese Font Gibberish & Garbled Characters Fix',
    description: 'Resolve plotting issues where Chinese characters show as scrambled letters, question marks, or gibberish in PDF exports.',
    detailDesc: 'Step-by-step diagnostic guide for resolving TTF/SHX font embedding issues in PDF plotter drivers. Covers setting "Capture Fonts" options, system font variables, and switching to DWG to PDF.pc3 config.',
    category: 'troubleshoot',
    status: 'coming-soon',
    keywords: ['cad pdf gibberish', 'garbled text pdf plotting', 'chinese characters pdf question mark', 'pc3 plotter font capture']
  }
];
