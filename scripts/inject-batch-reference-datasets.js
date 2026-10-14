const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/generic-toolbox-client.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

const newDatasets = `  },
  'aisc-steel-shapes-library': {
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
      ['6300', '10', '35', '11', '8.06', '3.40', '20,000'],
      ['6304', '20', '52', '15', '15.9', '7.90', '13,000'],
      ['6308', '40', '90', '23', '40.5', '24.0', '7,500']
    ],
    note: 'ISO 15 / DIN 625 deep groove radial ball bearings engineering specification and load ratings.'
  },
  'engineering-plastics-property-database': {
    headers: ['Polymer / Trade Name', 'Density (g/cm³)', 'Tensile Modulus (MPa)', 'Yield Strength (MPa)', 'Continuous Use Temp (°C)', 'Friction Coefficient (dry)', 'Key Engineering Merit'],
    rows: [
      ['POM (Acetal / Delrin)', '1.41 - 1.43', '2,800 - 3,200', '65 - 72', '-40°C to +100°C', '0.20 - 0.25', 'High dimensional stability, natural lubricity, gear & bushing standard'],
      ['PA66 (Nylon 6,6)', '1.14 - 1.15', '3,000 - 3,500', '75 - 85', '-30°C to +110°C', '0.28 - 0.35', 'High impact toughness and fatigue resistance; absorbs moisture'],
      ['PEEK (Polyetheretherketone)', '1.30 - 1.32', '3,800 - 4,200', '95 - 105', '-50°C to +250°C', '0.30 - 0.38', 'Ultra-high thermal and chemical endurance; aerospace and medical implant grade'],
      ['PTFE (Teflon)', '2.15 - 2.20', '400 - 600', '20 - 30', '-200°C to +260°C', '0.04 - 0.10', 'Extremely low friction, chemically inert, cryogenic to extreme heat seals'],
      ['PC (Polycarbonate / Lexan)', '1.20', '2,200 - 2,400', '60 - 70', '-40°C to +125°C', '0.35 - 0.40', 'Optical clarity, virtually unbreakable impact resistance; safety shields'],
      ['UHMW-PE (Ultra-High MW)', '0.93 - 0.95', '700 - 1,000', '20 - 25', '-150°C to +80°C', '0.10 - 0.15', 'Zero moisture absorption, superior sliding abrasion resistance for chute liners']
    ],
    note: 'Standard: ISO 527 / ASTM D638 baseline physical and tribological data for precision CNC plastic machining.'
  },
  'ansi-b1-1-unified-screw-threads-library': {
    headers: ['Thread Size (UNC / UNF)', 'Nominal Major Dia (in / mm)', 'Threads Per Inch (TPI)', 'Pitch (mm)', 'Pitch Diameter E (in / mm)', 'Tap Drill Size (75% Thread)'],
    rows: [
      ['#4-40 UNC', '0.1120 in (2.845 mm)', '40', '0.635', '0.0958 in (2.433 mm)', '#43 (2.26 mm)'],
      ['#6-32 UNC', '0.1380 in (3.505 mm)', '32', '0.794', '0.1177 in (2.990 mm)', '#36 (2.77 mm)'],
      ['#8-32 UNC', '0.1640 in (4.166 mm)', '32', '0.794', '0.1437 in (3.650 mm)', '#29 (3.45 mm)'],
      ['#10-24 UNC', '0.1900 in (4.826 mm)', '24', '1.058', '0.1629 in (4.138 mm)', '#25 (3.80 mm)'],
      ['#10-32 UNF', '0.1900 in (4.826 mm)', '32', '0.794', '0.1697 in (4.310 mm)', '#21 (4.04 mm)'],
      ['1/4"-20 UNC', '0.2500 in (6.350 mm)', '20', '1.270', '0.2175 in (5.524 mm)', '#7 (5.11 mm)'],
      ['1/4"-28 UNF', '0.2500 in (6.350 mm)', '28', '0.907', '0.2268 in (5.761 mm)', '#3 (5.41 mm)'],
      ['3/8"-16 UNC', '0.3750 in (9.525 mm)', '16', '1.588', '0.3344 in (8.494 mm)', '5/16" (7.94 mm)'],
      ['1/2"-13 UNC', '0.5000 in (12.700 mm)', '13', '1.954', '0.4500 in (11.430 mm)', '27/64" (10.72 mm)']
    ],
    note: 'Governed by ASME/ANSI B1.1 Unified Inch Screw Threads (UN and UNR Thread Form).'
  },
  'step-ap214-vs-ap242-comparator': {
    headers: ['Capability / Feature', 'STEP AP203 (Legacy)', 'STEP AP214 (Automotive Standard)', 'STEP AP242 (Modern Enterprise Edition)', 'Practical Engineering Recommendation'],
    rows: [
      ['Primary Target Industry', 'Aerospace 1990s Configuration', 'Automotive body & powertrain', 'Unified Aerospace, Automotive, Defense (MBE)', 'Default to AP242 for all new digital thread deployments'],
      ['Assembly Tree Hierarchy', 'Basic part containers', 'Full hierarchical assembly structure', 'Advanced nested multi-level product structure', 'AP242 provides cleanest multi-CAD assembly fidelity'],
      ['Component & Surface Colors', 'Unsupported (monochrome only)', 'Fully supported (RGB / surface colors)', 'Fully supported with material appearance presets', 'AP214/AP242 both avoid single-color gray model conversions'],
      ['Geometric Dimensioning (GD&T)', 'None', 'Basic visual drafting annotations', 'Semantic 3D PMI machine-readable annotations', 'AP242 allows automated CMM programming & CAM toolpaths'],
      ['Kinematic Joints & Mates', 'None', 'Kinematic mechanisms (limited adoption)', 'Standardized kinematic assembly joints', 'AP242 stores spatial motion limits across CAD systems'],
      ['Tessellated Mesh & Point Clouds', 'Unsupported', 'Unsupported', 'Hybrid solid B-Rep + Faceted mesh support', 'AP242 uniquely supports hybrid scan-to-CAD models'],
      ['Long-Term Data Archival (LOTAR)', 'Obsolete', 'Partial', 'Certified ISO 10303 LOTAR compliance', 'Mandatory for 30+ year aerospace airframe compliance']
    ],
    note: 'Comprehensive protocol benchmark between ISO 10303 Application Protocols (AP203 vs AP214 vs AP242 Ed.2).'
  },
  'cad-version-feature-matrix': {
    headers: ['Metric / Feature', 'AutoCAD 2018-2020', 'AutoCAD 2021-2023', 'AutoCAD 2024-2025', 'AutoCAD 2026+', 'Interoperability Impact'],
    rows: [
      ['Underlying DWG Format Code', 'AC1032', 'AC1032', 'AC1032', 'AC1032', 'File schema has remained AC1032 since 2018 (no format breaking change)'],
      ['Hardware Graphics Acceleration', 'DirectX 11 (Standard)', 'DirectX 12 introduction (3D Viewports)', 'DirectX 12 Advanced / Vulkan pipeline', 'Next-Gen GPU multi-threaded shader caching', 'Modern viewports require dedicated WDDM 3.0 graphics drivers'],
      ['Drawing History & Comparison', 'Basic manual DWG compare', 'Automated cloud DWG version history', 'Live Smart Block placement & Activity Insights', 'AI-assisted dimensioning & markup assist', 'Recent versions auto-detect geometry changes between saved revisions'],
      ['Apple Silicon (M1/M2/M3) Native', 'No (Rosetta 2 emulation)', 'No (Intel binary only)', 'Native Apple Silicon ARM64 architecture', 'Optimized Metal 3 multi-core vector engine', 'Massive 2x performance jump for macOS CAD workstations'],
      ['LISP & Script Automation', 'AutoLISP Desktop', 'AutoLISP in Web App', 'Unified LISP debugger in VS Code', 'Cloud-synchronized automated LISP workflows', 'Scripts remain backwards-compatible across all AC1032 releases']
    ],
    note: 'Architecture and feature comparison across recent major AutoCAD releases (Autodesk Platform Services).'
  },
  'mcad-kernel-comparator': {
    headers: ['Geometric Kernel', 'Owner / Licensor', 'Primary Host CAD Systems', 'B-Rep Surface Geometry Engine', 'Sewing & Healing Tolerance', 'Ecosystem Interoperability Advantage'],
    rows: [
      ['Parasolid', 'Siemens Digital Industries', 'SolidWorks, Siemens NX, Solid Edge, Onshape', 'Convergent modeling; NURBS and Facet hybrid', 'Industry leading automatic topology healing (0.001mm)', 'Native Parasolid X_T/X_B format transfers without translation loss between SolidWorks and NX'],
      ['ShapeManager (ASM)', 'Autodesk', 'Autodesk Inventor, AutoCAD, Fusion 360', 'Fork of ACIS 7.0; specialized in sheet metal & T-Splines', 'High-precision analytic and spline surface intersection', 'Native geometry exchange between AutoCAD solids, Fusion 360, and Inventor IAM assemblies'],
      ['ACIS', 'Dassault Spatial Corp', 'BricsCAD, ZWCAD, SpaceClaim, TurboCAD', 'Classic boundary representation (SAT/SAB format)', 'Robust manifold solid modeling and direct editing', 'Universal SAT interchange widely supported across legacy CAM and simulation engines'],
      ['CGM (CATIA Geo Modeler)', 'Dassault Systèmes', 'CATIA V5/V6, 3DEXPERIENCE, DELMIA', 'Ultra-high curvature continuity (G3/G4) for Class-A automotive', 'Enterprise carline coordinate system & massive aerospace BIW', 'The gold standard for automotive Class-A aesthetic surfaces and aircraft aerodynamic fairings'],
      ['Granite', 'PTC', 'PTC Creo (Pro/ENGINEER), Mathcad', 'Feature-based associative parametric kernel', 'Robust datum-driven history trees and draft angles', 'High reliability in consumer packaging, injection molding draft, and complex family tables']
    ],
    note: 'Authoritative comparative analysis of commercial CAD 3D geometric modeling kernels.'
  },
  'bim-ifc-schema-comparator': {
    headers: ['openBIM Schema Version', 'ISO Standard Status', 'Infrastructure & Civil Elements', 'Property Sets & Materials', 'Solibri / Clash Detection Support', 'Industry Adoption Status'],
    rows: [
      ['IFC2x3 (TC1)', 'ISO 16739:2005', 'None (Vertical buildings only)', 'Standard Pset_* dictionaries; basic material layers', 'Universal 100% support across all BIM tools', 'Legacy dominant baseline; standard in most public government tenders'],
      ['IFC4 (Add2 TC1)', 'ISO 16739-1:2018', 'Basic terrain & geometric representations', 'Complex multi-layered materials and energy analysis', 'High support in modern BIM viewers (Solibri, Navisworks)', 'Primary standard for modern architectural and MEP project delivery'],
      ['IFC4.3 (Infrastructure)', 'ISO 16739-1:2024 (Official)', 'Dedicated Alignment, Road, Rail, Bridge, Ports, Waterways', 'Linear positioning along road/rail stationing (Chainage)', 'Rapidly expanding across civil software (Civil 3D, OpenRoads)', 'The global standard for highways, high-speed rail, and bridge openBIM mandates']
    ],
    note: 'Governed by buildingSMART International openBIM data schema evolution standards.'
  },
  'fdm-filament-selector-comparator': {
    headers: ['Filament Material', 'Tensile Modulus (Rigidity)', 'Impact Toughness (Izod)', 'Heat Deflection (HDT @ 0.45MPa)', 'UV & Weather Resistance', 'Ease of Printing / Warping Tendency', 'Best Suited Application'],
    rows: [
      ['PLA (Standard / Plus)', '★★★★☆ (3,500 MPa)', '★★☆☆☆ (3.5 kJ/m²)', '★☆☆☆☆ (55°C)', '★☆☆☆☆ (Degrades in sun)', '★★★★★ (Zero warp, no enclosure)', 'Visual models, cosplay props, conceptual prototypes'],
      ['PETG (Glycol Co-polyester)', '★★★☆☆ (2,100 MPa)', '★★★☆☆ (7.5 kJ/m²)', '★★☆☆☆ (70°C)', '★★★★☆ (Good UV resistance)', '★★★★☆ (Low warp, water-tight)', 'Snap-fits, outdoor brackets, chemical/fluid containers'],
      ['ABS / ASA', '★★★☆☆ (2,300 MPa)', '★★★★☆ (15 kJ/m²)', '★★★☆☆ (95°C)', '★★★★★ (ASA outdoor king)', '★★☆☆☆ (Severe warp, needs enclosure)', 'Automotive interior parts, outdoor electrical housings'],
      ['TPU 95A / 85A (Flex)', '★☆☆☆☆ (Flex 25 MPa)', '★★★★★ (Unbreakable)', '★★☆☆☆ (50°C)', '★★★★☆ (Abrasion resistant)', '★★★☆☆ (Direct drive required)', 'Gaskets, vibration dampers, protective bumpers, phone cases'],
      ['PA-CF (Nylon Carbon Fiber)', '★★★★★ (6,000 MPa)', '★★★★☆ (12 kJ/m²)', '★★★★★ (155°C)', '★★★☆☆ (Absorbs moisture)', '★★☆☆☆ (Needs hardened nozzle & drybox)', 'High-stress drone arms, CNC workholding jigs, engine brackets'],
      ['PC (Polycarbonate)', '★★★★☆ (2,400 MPa)', '★★★★★ (30 kJ/m²)', '★★★★★ (140°C)', '★★★★☆ (Flame retardant)', '★☆☆☆☆ (Requires 100°C+ chamber)', 'High-impact structural fixtures, electrical insulator shields']
    ],
    note: 'Comparative selection matrix based on ISO 178 flexural and ISO 179 impact testing standards.'
  },
  'iges-vs-step-comparator': {
    headers: ['Comparison Dimension', 'IGES (.igs / .iges - ANSI Y14.26M)', 'STEP (.stp / .step - ISO 10303)', 'Impact on CAM & Tooling Workflow'],
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

// Replace the closing brackets of REFERENCE_DATASETS
content = content.replace(
  `      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']\n    ],\n    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'\n  }\n};`,
  `      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']\n    ],\n    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'\n  }${newDatasets}\n};`
);

// Also make sure isCheatsheetOrLib recognizes comparators with dataset
content = content.replace(
  `const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library';`,
  `const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library' || (tool.category === 'comparator' && !!REFERENCE_DATASETS[tool.slug]);`
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully injected 12 new reference datasets into generic-toolbox-client.tsx!');
