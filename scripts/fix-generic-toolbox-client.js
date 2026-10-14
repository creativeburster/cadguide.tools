const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/generic-toolbox-client.tsx');
let content = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

// 1. 提取误放在 calcResult 内部的 20 个数据集 (lines 288 to 569)
const misplacedStart = content.indexOf("'asme-b16-5-flange-dimensions-table': {");
const misplacedEnd = content.indexOf("note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'\n  }");

if (misplacedStart === -1 || misplacedEnd === -1) {
  console.error('Could not find misplaced datasets boundaries!');
  process.exit(1);
}

const misplacedChunk = content.substring(misplacedStart, misplacedEnd + "note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'\n  }".length);

// 2. 准备我们新增的 12 个数据集
const newDatasets = `  'aisc-steel-shapes-library': {
    headers: ['AISC Designation', 'Nominal Depth d (in / mm)', 'Flange Width bf (in / mm)', 'Flange Thick tf (in / mm)', 'Area A (in² / mm²)', 'Elastic Modulus Wx (in³ / cm³)', 'Moment of Inertia Ix (in⁴ / cm⁴)'],
    rows: [
      ['W8x24', '7.93 in (201 mm)', '6.50 in (165 mm)', '0.400 in (10.2 mm)', '7.08 in² (4560 mm²)', '20.9 in³ (342 cm³)', '82.7 in⁴ (3440 cm⁴)'],
      ['W10x33', '9.73 in (247 mm)', '7.96 in (202 mm)', '0.435 in (11.0 mm)', '9.71 in² (6260 mm²)', '35.0 in³ (574 cm³)', '170 in⁴ (7080 cm⁴)'],
      ['W12x45', '12.06 in (306 mm)', '8.05 in (204 mm)', '0.575 in (14.6 mm)', '13.2 in² (8520 mm²)', '58.1 in³ (952 cm³)', '350 in⁴ (14600 cm⁴)'],
      ['W14x68', '14.04 in (357 mm)', '10.04 in (255 mm)', '0.720 in (18.3 mm)', '20.0 in² (12900 mm²)', '103 in³ (1690 cm³)', '722 in⁴ (30100 cm⁴)'],
      ['W16x89', '16.75 in (425 mm)', '10.27 in (261 mm)', '0.875 in (22.2 mm)', '26.2 in² (16900 mm²)', '153 in³ (2510 cm³)', '1300 in⁴ (54100 cm⁴)'],
      ['W18x97', '18.59 in (472 mm)', '11.15 in (283 mm)', '0.870 in (22.1 mm)', '28.5 in² (18400 mm²)', '188 in³ (3080 cm³)', '1750 in⁴ (72800 cm⁴)'],
      ['W21x101', '21.36 in (543 mm)', '12.29 in (312 mm)', '0.800 in (20.3 mm)', '29.8 in² (19200 mm²)', '227 in³ (3720 cm³)', '2420 in⁴ (101000 cm⁴)'],
      ['W24x104', '24.06 in (611 mm)', '12.75 in (324 mm)', '0.750 in (19.1 mm)', '30.6 in² (19700 mm²)', '258 in³ (4230 cm³)', '3100 in⁴ (129000 cm⁴)']
    ],
    note: 'Governed by AISC Steel Construction Manual 15th Edition (ASTM A6 / A992 structural wide-flange shapes).'
  },
  'din-en-structural-sections-library': {
    headers: ['Eurocode Designation', 'Section Depth h (mm)', 'Flange Width b (mm)', 'Web Thick tw (mm)', 'Flange Thick tf (mm)', 'Cross-Section Area (cm²)', 'Section Modulus Wx (cm³)'],
    rows: [
      ['IPE 160', '160', '82', '5.0', '7.4', '20.1', '109'],
      ['IPE 200', '200', '100', '5.6', '8.5', '28.5', '194'],
      ['IPE 240', '240', '120', '6.2', '9.8', '39.1', '324'],
      ['IPE 300', '300', '150', '7.1', '10.7', '53.8', '557'],
      ['HEA 160 (IPBl)', '152', '160', '6.0', '9.0', '38.8', '220'],
      ['HEA 200 (IPBl)', '190', '200', '6.5', '10.0', '53.8', '389'],
      ['HEA 240 (IPBl)', '230', '240', '7.5', '12.0', '76.8', '675'],
      ['HEB 200 (IPB)', '200', '200', '9.0', '15.0', '78.1', '570'],
      ['HEB 240 (IPB)', '240', '240', '10.0', '17.0', '106.0', '938'],
      ['HEB 300 (IPB)', '300', '300', '11.0', '19.0', '149.0', '1680']
    ],
    note: 'Conforms to EN 10034 / EN 10025-2 structural steel sections (S235JR / S355J2).'
  },
  'iso-286-fit-tolerances-library': {
    headers: ['Nominal Diameter Range (mm)', 'Hole H7 (μm)', 'Hole H8 (μm)', 'Shaft g6 (μm)', 'Shaft h6 (μm)', 'Shaft p6 (Press Fit, μm)', 'Typical Fit Character'],
    rows: [
      ['Over 3 to 6', '+12 / 0', '+18 / 0', '-4 / -12', '0 / -8', '+20 / +12', 'H7/g6: Sliding fit; H7/p6: Permanent press fit'],
      ['Over 6 to 10', '+15 / 0', '+22 / 0', '-5 / -14', '0 / -9', '+24 / +15', 'H7/g6: Free running; H7/h6: Locating clearance'],
      ['Over 10 to 18', '+18 / 0', '+27 / 0', '-6 / -17', '0 / -11', '+29 / +18', 'H7/h6: Push fit; H7/p6: Light drive fit'],
      ['Over 18 to 30', '+21 / 0', '+33 / 0', '-7 / -20', '0 / -13', '+35 / +22', 'H7/g6: Precision bearing seat; H7/p6: Heavy press'],
      ['Over 30 to 50', '+25 / 0', '+39 / 0', '-9 / -25', '0 / -16', '+42 / +26', 'H7/h6: Keyed hub; H7/p6: Bushing interference'],
      ['Over 50 to 80', '+30 / 0', '+46 / 0', '-10 / -29', '0 / -19', '+51 / +32', 'H7/g6: Machine spindle; H7/p6: Gear hub press'],
      ['Over 80 to 120', '+35 / 0', '+54 / 0', '-12 / -34', '0 / -22', '+59 / +37', 'H7/h6: Flange spigot; H7/p6: Crank pin press']
    ],
    note: 'ISO 286-1 / ISO 286-2 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes.'
  },
  'standard-ball-bearing-library': {
    headers: ['Bearing Designation', 'Bore d (mm)', 'Outer Dia D (mm)', 'Width B (mm)', 'Basic Dynamic Rating Cr (kN)', 'Basic Static Rating C0r (kN)', 'Limiting Speed (RPM grease)'],
    rows: [
      ['6000', '10', '26', '8', '4.55', '1.97', '30,000'],
      ['6004', '20', '42', '12', '9.38', '5.02', '17,000'],
      ['6008', '40', '68', '15', '16.8', '11.5', '9,500'],
      ['6200', '10', '30', '9', '5.10', '2.39', '24,000'],
      ['6204', '20', '47', '14', '12.8', '6.65', '15,000'],
      ['6205', '25', '52', '15', '14.0', '7.85', '13,000'],
      ['6208', '40', '80', '18', '29.1', '17.8', '8,500'],
      ['6304', '20', '52', '15', '15.9', '7.80', '13,000'],
      ['6308', '40', '90', '23', '40.5', '24.0', '7,500']
    ],
    note: 'ISO 15 / DIN 625-1 radial deep groove ball bearings metric boundary dimensions and load capacities.'
  },
  'engineering-plastics-properties-table': {
    headers: ['Polymer (Abbreviation)', 'Tensile Strength (MPa)', 'Flexural Modulus (GPa)', 'Heat Deflection Temp HDT (°C @ 0.45MPa)', 'Density (g/cm³)', 'Machining & Friction Characteristics'],
    rows: [
      ['Delrin / POM-Acetal', '65 - 72', '2.8 - 3.2', '160°C', '1.41', 'Outstanding dimensional stability; low moisture absorption; CNC milling favorite.'],
      ['Nylon 6/6 (PA66)', '75 - 85', '2.8 - 3.4', '180°C', '1.14', 'High wear resistance; self-lubricating; hygroscopic (swells in humid conditions).'],
      ['PEEK (Polyether ether ketone)', '95 - 105', '3.8 - 4.2', '250°C', '1.32', 'Aerospace & medical grade; extreme chemical resistance; continuous 250°C service.'],
      ['PTFE (Teflon)', '20 - 35', '0.5 - 0.7', '120°C', '2.18', 'Near-zero friction coefficient; chemically inert; creeps under high static mechanical load.'],
      ['UHMW-PE', '22 - 35', '0.7 - 0.9', '80°C', '0.94', 'Extreme abrasion resistance; low friction chutes & guide rails; difficult to glue.'],
      ['Polycarbonate (PC)', '60 - 75', '2.2 - 2.5', '135°C', '1.20', 'Optical clarity; extremely high impact strength; prone to chemical stress cracking.']
    ],
    note: 'ASTM D638 / ISO 527 engineering thermoplastic mechanical and thermal properties handbook.'
  },
  'unc-unf-thread-pitch-tap-drill': {
    headers: ['Unified Thread Size', 'Major Dia (in / mm)', 'UNC TPI (Coarse)', 'UNC Tap Drill (75% Thread)', 'UNF TPI (Fine)', 'UNF Tap Drill (75% Thread)'],
    rows: [
      ['#4', '0.1120 in (2.84 mm)', '40', '#43 (0.0890 in / 2.26 mm)', '48', '#42 (0.0935 in / 2.37 mm)'],
      ['#6', '0.1380 in (3.51 mm)', '32', '#36 (0.1065 in / 2.71 mm)', '40', '#33 (0.1130 in / 2.87 mm)'],
      ['#8', '0.1640 in (4.17 mm)', '32', '#29 (0.1360 in / 3.45 mm)', '36', '#29 (0.1360 in / 3.45 mm)'],
      ['#10', '0.1900 in (4.83 mm)', '24', '#25 (0.1495 in / 3.80 mm)', '32', '#21 (0.1590 in / 4.04 mm)'],
      ['1/4"', '0.2500 in (6.35 mm)', '20', '#7 (0.2010 in / 5.11 mm)', '28', '#3 (0.2130 in / 5.41 mm)'],
      ['5/16"', '0.3125 in (7.94 mm)', '18', 'F (0.2570 in / 6.53 mm)', '24', 'I (0.2720 in / 6.91 mm)'],
      ['3/8"', '0.3750 in (9.53 mm)', '16', '5/16 in (0.3125 in / 7.94 mm)', '24', 'Q (0.3320 in / 8.43 mm)'],
      ['1/2"', '0.5000 in (12.70 mm)', '13', '27/64 in (0.4219 in / 10.71 mm)', '20', '29/64 in (0.4531 in / 11.51 mm)'],
      ['5/8"', '0.6250 in (15.88 mm)', '11', '17/32 in (0.5312 in / 13.49 mm)', '18', '37/64 in (0.5781 in / 14.68 mm)'],
      ['3/4"', '0.7500 in (19.05 mm)', '10', '21/32 in (0.6562 in / 16.67 mm)', '16', '11/16 in (0.6875 in / 17.46 mm)']
    ],
    note: 'ASME B1.1 Unified Inch Screw Threads (UN and UNR Thread Form) tap drill charts.'
  },
  'step-ap214-vs-step-ap242-comparator': {
    headers: ['Evaluation Dimension', 'STEP AP203 (Legacy)', 'STEP AP214 (Automotive / Classic)', 'STEP AP242 (Aerospace & Model-Based Def)'],
    rows: [
      ['Core Focus Domain', 'Basic 3D B-Rep solid geometry', 'Automotive body & mechanical assemblies', 'Model-Based Enterprise (MBE) & Digital Twin'],
      ['Semantic 3D GD&T / PMI', 'No (Graphic annotations only)', 'Graphical presentation only', 'Full Semantic PMI (Machine-readable GD&T datums & tolerances)'],
      ['Assembly Hierarchy & Kinematics', 'Flat or basic assembly trees', 'Hierarchical BOM + basic kinematics', 'Advanced kinematic joints, constraints & motion pairs'],
      ['Surface / Face Color & Materials', 'Monochrome / basic colors', 'Full face color & layer assignment', 'High-fidelity optical materials + semantic surface roughness'],
      ['Tessellated & Mesh Geometry', 'Not supported', 'Limited polygonal mesh support', 'Native high-density 3D tessellation & hybrid facet representations'],
      ['Long-Term Data Archiving (LOTAR)', 'Superseded', 'Partially supported for legacy projects', 'Primary international standard for 50-year regulatory retention']
    ],
    note: 'ISO 10303 Product data representation and exchange — AP203, AP214, and AP242 edition 2 comparison.'
  },
  'autocad-dwg-version-feature-matrix': {
    headers: ['DWG File Format Header', 'AutoCAD Versions Supported', 'Key Architectural Features Added', 'Internal Encryption / Protection', 'Down-Saving Compatibility Risk'],
    rows: [
      ['AC1032 (AutoCAD 2018)', 'AutoCAD 2018 - 2025+', '64-bit precision graphic primitives, faster save times, large object support', 'Enhanced digital signatures', 'Universal default for modern CAD; cannot open in CAD 2017 or earlier without downgrade'],
      ['AC1027 (AutoCAD 2013)', 'AutoCAD 2013 - 2017', 'Surface and point cloud engine enhancements, associative arrays', 'Standard password protection', 'Common AEC milestone; legacy government agencies still mandate AC1027 submission'],
      ['AC1024 (AutoCAD 2010)', 'AutoCAD 2010 - 2012', 'Parametric constraints (geometric & dimensional), free-form 3D mesh modeling', 'Digital signatures support', 'Rock-solid legacy standard; minimal bloat; wide compatibility with CNC machines'],
      ['AC1021 (AutoCAD 2007)', 'AutoCAD 2007 - 2009', 'True solid modeling engine redesign, SectionPlane, dynamic blocks preview', 'Legacy encryption', 'Universal fallback standard for laser cutters and wire-EDM offline controllers'],
      ['AC1018 (AutoCAD 2004)', 'AutoCAD 2004 - 2006', 'First modern compressed DWG format, true color (RGB) layer support', 'Legacy password', 'Fastest parsing format for embedded microcontrollers and micro-CAD engines']
    ],
    note: 'AutoCAD DWG file format internal headers (AC10xx) and cross-generational software compatibility matrix.'
  },
  'solidworks-inventor-nx-kernel-matrix': {
    headers: ['Software Suite', 'Primary Modeling Kernel', 'Owner / Vendor', 'B-Rep Representation', 'Cross-Platform Translation Nuance'],
    rows: [
      ['SolidWorks', 'Parasolid (.x_t, .x_b)', 'Siemens Digital Industries', 'Exact analytical & NURBS B-Rep', '100% zero-loss native import into NX & Solid Edge; Parasolid kernel translation is seamless.'],
      ['Autodesk Inventor', 'ShapeManager (ASM)', 'Autodesk (Forked from ACIS 7)', 'Exact analytical & NURBS B-Rep', 'Best translated to Revit via SAT/DWG; STEP translation introduces minor edge tolerances.'],
      ['Siemens NX', 'Parasolid (.x_t, .x_b)', 'Siemens Digital Industries', 'Synchronous technology B-Rep', 'Native Parasolid exchange without geometric translation stitching or surface healing.'],
      ['PTC Creo', 'Granite One', 'PTC Inc.', 'Analytical surfaces & procedural', 'Translates cleanly via STEP AP214/242; imports Parasolid via ATB (Associative Topology Bus).'],
      ['CATIA V5 / V6', 'Convergence Geometric Modeler (CGM)', 'Dassault Systèmes', 'Exact topological B-Rep', 'Direct CATPart import into SolidWorks via 3D Interconnect; high-tolerance stitching required.']
    ],
    note: 'Boundary Representation (B-Rep) geometric modeling kernel dependencies across leading mechanical CAD systems.'
  },
  'ifc2x3-vs-ifc4-vs-ifc4x3-matrix': {
    headers: ['IFC Schema Milestone', 'ISO Standard Designation', 'AEC & Infrastructure Scope', 'B-Rep / Mesh Representation', 'Global BIM Mandate Status'],
    rows: [
      ['IFC2x3 Coordination View 2.0', 'ISO 16739 (Pre-standard)', 'Building architectural, MEP, and structural domains', 'FacetedBrep and SweptSolid geometries', 'Still the most widely implemented baseline in commercial AEC contractors (90%+ legacy usage).'],
      ['IFC4 Reference View & Design Transfer', 'ISO 16739-1:2018', 'Advanced building properties, daylighting, energy, and enhanced MEP', 'AdvancedBrep (NURBS surfaces & CSG booleans)', 'Mandated across European Nordic BIM standards, UK BIM Level 2, and Singapore CORENET X.'],
      ['IFC4.3 Infrastructure & Civil', 'ISO 16739-1:2024', 'Horizontal infrastructure: Roads, Bridges, Railways, Ports, Waterways', 'Alignment-based linear geometry and tin-meshes', 'The definitive civil engineering milestone; connects Civil 3D, OpenRoads, and Allplan with GIS.']
    ],
    note: 'BuildingSMART International Industry Foundation Classes (IFC) evolutionary schema benchmark.'
  },
  'fdm-3d-printing-filament-comparison': {
    headers: ['Filament Material', 'Nozzle Temp (°C)', 'Bed Temp (°C)', 'Tensile Strength (MPa)', 'Glass Transition Tg (°C)', 'Enclosure / Ventilation Need'],
    rows: [
      ['PLA (Polylactic Acid)', '190°C - 220°C', '20°C - 60°C', '50 - 65 MPa', '55°C', 'No / Low warping; easy printing'],
      ['PETG (Glycol-Modified)', '230°C - 250°C', '70°C - 85°C', '45 - 55 MPa', '70°C', 'No / Low-medium warping; chemical resistant'],
      ['ABS (Acrylonitrile Butadiene)', '240°C - 260°C', '95°C - 110°C', '40 - 50 MPa', '95°C', 'Yes / High warping; requires fume exhaust'],
      ['ASA (Acrylic Styrene Acrylonitrile)', '240°C - 260°C', '95°C - 110°C', '42 - 52 MPa', '98°C', 'Yes / High UV resistance outdoor grade'],
      ['TPU 95A (Polyurethane)', '215°C - 235°C', '30°C - 60°C', '25 - 35 MPa (Flex)', '50°C', 'No / High wear & vibration damping flex'],
      ['PA-CF (Carbon Fiber Nylon)', '260°C - 290°C', '80°C - 100°C', '75 - 110 MPa', '150°C', 'Recommended / Hardened nozzle required; stiff'],
      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']
    ],
    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'
  },
  'iges-vs-step-data-loss-matrix': {
    headers: ['Feature / Capability', 'IGES (.igs / .iges)', 'STEP (.stp / .step)', 'Engineering Impact & Best Practice'],
    rows: [
      ['Data Nature', 'Faceted/wireframe surface geometry (Trimmed Surfaces)', 'True Boundary Representation (B-Rep) watertight solids', 'IGES frequently produces "surface holes" and stitch failures in CAM; STEP creates true solids'],
      ['Assembly Structure', 'Single flat level; all parts merged or loose surfaces', 'Multi-level hierarchical product assembly trees', 'STEP maintains individual part identity, transform matrices, and BOM components'],
      ['Color & Layer Mapping', 'Primitive RGB line/entity color', 'Dedicated component layers, face colors, and transparency', 'STEP AP214/AP242 correctly color-codes machining faces (e.g. green for milled, blue for drilled)'],
      ['Product Manufacturing Info (PMI)', 'None (Graphic wireframe text only)', 'Semantic 3D GD&T and tolerances (AP242)', 'STEP enables automated feature recognition in modern 5-axis CAM and CMM inspection'],
      ['File Size Efficiency', 'Verbose ASCII text; large file size', 'Standardized compact ISO 10303-21 text format', 'STEP files are typically 30-50% smaller and parse significantly faster in modern CAD kernels'],
      ['Modern Industry Verdict', 'Deprecated legacy standard (Last updated 1996)', 'Active international standard for the Digital Thread', 'Never use IGES unless interfacing with pre-2000 legacy wire-EDM or CMM software']
    ],
    note: 'ANSI Initial Graphics Exchange Specification (IGES) vs ISO Standard for the Exchange of Product model data (STEP).'
  }`;

// 3. 将所有 32 个额外数据集组合并注入到 REFERENCE_DATASETS 的末尾
// 定位 REFERENCE_DATASETS 原始结尾 (wire-gauge-chart-swg-bwg-awg 之后，TROUBLESHOOT_DATASETS 之前)
const refCloseTarget = "note: 'Covers American Wire Gauge (AWG), Standard Wire Gauge (SWG / Imperial), and Birmingham Wire Gauge (BWG).'\n  }\n};";
const refCloseIdx = content.indexOf(refCloseTarget);
if (refCloseIdx === -1) {
  console.error('Could not find original REFERENCE_DATASETS close position!');
  process.exit(1);
}

// 插入点在 "  }\n" 之后，"};" 之前
const insertPoint = refCloseIdx + refCloseTarget.length - 3;
const beforeClose = content.substring(0, insertPoint);
const afterClose = content.substring(insertPoint);

// 组合出完整的 REFERENCE_DATASETS 追加内容
const allExtraDatasets = `,\n${misplacedChunk},\n${newDatasets}\n`;
let reconstructed = beforeClose + allExtraDatasets + afterClose;

// 4. 清理 calcResult 内部被误放的 misplacedChunk
const calcTarget = `    return {\n      primary: primary.toFixed(2),\n      safety: safety.toFixed(2),\n      status: pass ? 'VERIFIED (PASS)' : 'ATTENTION (CHECK)',\n      pass\n    ,\n${misplacedChunk}\n};\n  }, [paramA, paramB, paramC]);`;

const cleanCalc = `    return {\n      primary: primary.toFixed(2),\n      safety: safety.toFixed(2),\n      status: pass ? 'VERIFIED (PASS)' : 'ATTENTION (CHECK)',\n      pass\n    };\n  }, [paramA, paramB, paramC]);`;

if (!reconstructed.includes(calcTarget)) {
  console.error('Could not cleanly find misplaced block inside calcResult for replacement!');
  // 打印调试
  process.exit(1);
}

reconstructed = reconstructed.replace(calcTarget, cleanCalc);

// 5. 确保 isCheatsheetOrLib 能够支持 comparator
reconstructed = reconstructed.replace(
  `const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library';`,
  `const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library' || (tool.category === 'comparator' && !!REFERENCE_DATASETS[tool.slug]);`
);

fs.writeFileSync(targetFile, reconstructed, 'utf8');
console.log('Successfully refactored generic-toolbox-client.tsx with clean architecture and all 42 reference datasets!');
