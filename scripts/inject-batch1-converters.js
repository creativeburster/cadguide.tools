const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/lib/converter-data.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. Add new formats
const newFormats = {
  sldasm: {
    ext: "SLDASM",
    name: "SolidWorks Assembly File",
    category: "Native MCAD Assembly",
    developer: "Dassault Systèmes",
    nature: "Multi-component mechanical assembly structure referencing external .sldprt and sub-.sldasm parts with kinematic 3D mates",
    colorMaterial: "Sub-assembly appearance overrides, component transparency, and display states",
    pmi: "DimXpert assembly dimensions, exploded view paths, and Bill of Materials (BOM) hierarchy",
    typicalUse: "Complex machinery design, industrial robotics, automotive subsystems, consumer electronics packaging",
    ecosystem: "SolidWorks, eDrawings, Dassault 3DEXPERIENCE"
  },
  catproduct: {
    ext: "CATProduct",
    name: "CATIA V5/V6 Product Assembly",
    category: "Enterprise Aeromarket Assembly",
    developer: "Dassault Systèmes",
    nature: "Hierarchical product structure linking external .CATPart components with assembly constraints, joint kinematics, and vehicle coordinate systems",
    colorMaterial: "Subsystem color codes, layer filters, and visual clearance overlays",
    pmi: "3D Functional Tolerancing & Annotation (FT&A) and GD&T datum systems",
    typicalUse: "Aerospace airframes, automotive body-in-white (BIW), powertrain assemblies, shipbuilding modules",
    ecosystem: "CATIA V5, CATIA 3DEXPERIENCE, DELMIA, ENOVIA"
  },
  iam: {
    ext: "IAM",
    name: "Autodesk Inventor Assembly",
    category: "Native MCAD Assembly",
    developer: "Autodesk",
    nature: "Parametric mechanical assembly container managing external .ipt component dependencies, assembly joints, adaptive features, and Content Center standard hardware",
    colorMaterial: "Component level appearance styles, visual override layers, and sectional cutaway planes",
    pmi: "3D model annotations, tolerances, and structured multi-level BOM tables",
    typicalUse: "Industrial automation, factory layouts, sheet metal assemblies, structural frame designs",
    ecosystem: "Autodesk Inventor, Autodesk Vault, Factory Design Utilities, Navisworks"
  },
  dwf: {
    ext: "DWF / DWFx",
    name: "Autodesk Design Web Format",
    category: "2D/3D Lightweight Publishing Standard",
    developer: "Autodesk (1995)",
    nature: "Highly compressed, vector-and-metadata container designed for secure, read-only design reviews, markup approvals, and jobsite sheet viewing without exposing source CAD geometry",
    colorMaterial: "Pre-rendered RGB plot colors, CTB-derived lineweights, and fill patterns",
    pmi: "Sheet coordinate grids, digital approval stamps, review redline markups, and drawing title blocks",
    typicalUse: "Construction field submittals, client review packages, bidding document sets, municipal permit archives",
    ecosystem: "Autodesk Design Review, AutoCAD, Navisworks, BIM 360"
  },
  image: {
    ext: "Image (Raster)",
    name: "Scanned Drawing / Raster Bitmap (JPG, PNG, TIFF)",
    category: "Raster Optical Image",
    developer: "Standard Photographic/Imaging Consortium",
    nature: "Pixel grid matrix containing scanned paper blueprints, construction site drone photos, or hand-drawn concept sketches requiring optical vectorization",
    colorMaterial: "Grayscale, binary monochrome 1-bit, or 24-bit sRGB pixels",
    pmi: "Optical scan artifacts, paper grain, printed title blocks, and hand-annotated dimensions",
    typicalUse: "Legacy paper drawing digitization, historical facility renovation, reverse engineering from photographs, site survey overlays",
    ecosystem: "Scanners, Photoshop, AutoCAD (ImageAttach), Vectorization Engines"
  }
};

Object.assign(raw.formats, newFormats);

// 2. Add AutoDWG tool
raw.tools.autodwg = {
  name: "AutoDWG Converter Suite",
  badge: "2D Vector Conversion Standard",
  rating: 4.8,
  metrics: [
    { name: "DWF Vector Accuracy", score: 98 },
    { name: "Raster Tracing Quality", score: 92 },
    { name: "Batch Conversion Speed", score: 96 }
  ],
  pros: [
    "Industry standard for DWF/DWFx to editable DWG conversion with intact layers",
    "High-accuracy optical center-line and outline raster tracing for scanned blueprints",
    "Standalone desktop application with zero AutoCAD dependency required"
  ],
  cons: [
    "Commercial paid license for full version",
    "Desktop Windows installation only"
  ],
  officialUrl: "https://www.autodwg.com",
  affiliateUrl: null,
  pricing: "Free Trial / $180+ Perpetual",
  verdict: "The undisputed gold standard for 2D DWG, DWF, and raster-to-vector CAD drafting interoperability."
};

// 3. New Conversion Pairs
const newPairs = {
  "sldasm-to-step": {
    slug: "sldasm-to-step",
    title: "SolidWorks SLDASM to STEP Converter",
    h1Title: "SolidWorks (.sldasm) Assembly to STEP (STP AP242/AP214) Solid Converter",
    metaTitle: "SolidWorks Assembly (.sldasm) to STEP Converter — Pack & Go Interop (2026)",
    metaDescription: "Convert native SolidWorks SLDASM multi-component assemblies to neutral STEP (AP214/AP242) files. Preserve assembly tree hierarchy, component colors, and mates without SolidWorks.",
    category: "mcad-interop",
    categoryLabel: "Industrial MCAD Interop",
    conversionNature: "Hierarchical MCAD Assembly to Neutral Solid Container (ISO 10303)",
    difficulty: "High (Multi-File External Dependency & Coordinate Frame Resolution)",
    fromFormat: raw.formats.sldasm,
    toFormat: raw.formats.step,
    keyParameters: [
      {
        label: "STEP Protocol",
        value: "AP242 / AP214",
        hint: "AP242 preserves semantic assembly tree structure; AP214 guarantees color assignment across legacy CAM"
      },
      {
        label: "Component Packaging",
        value: "Pack and Go Required",
        hint: "External .sldprt part references must reside in the same root directory or zip container"
      },
      {
        label: "Mate Kinematics",
        value: "Rigid Spatial Positioning",
        hint: "Dynamic mechanical joints are frozen into static 3D transformation matrices"
      }
    ],
    painPointDesc: "SolidWorks assemblies (.sldasm) store kinematic mate relationships and relative component file paths rather than embedded part bodies. Sharing isolated .sldasm files results in missing component errors in downstream CAM or cross-CAD systems unless packaged with Pack and Go or converted into a self-contained multi-body STEP container.",
    riskWarning: "Always verify all referenced .sldprt parts are included in the same folder or zip package before conversion. Missing sub-components will produce hollow assemblies, orphan mates, or broken coordinate origins.",
    technicalGuide: [
      {
        title: "1. Pack and Go Packaging Checklist",
        desc: "Ensure all external parts, toolbox hardware components, and nested sub-assemblies are collected into a flat folder before dispatching to cloud conversion engines."
      },
      {
        title: "2. Protocol Choice: STEP AP214 vs AP242",
        desc: "Choose AP242 if downstream systems require Product Manufacturing Information (PMI) and advanced assembly structure; select AP214 for universal compatibility with older CNC and CAM suites."
      },
      {
        title: "3. Handling Flexible Sub-Assemblies & Configurations",
        desc: "Flexible sub-assemblies should be resolved to their nominal stroke state. Suppressed components in active SolidWorks configurations will be omitted from the exported STEP container."
      },
      {
        title: "4. Physical Assembly Validation",
        desc: "Post-conversion, verify center of mass, component interference, and bounding box volume against the original SolidWorks design to ensure no parts were dropped."
      }
    ],
    recommendedTools: [
      raw.tools.fastview,
      raw.tools.cadexchanger,
      raw.tools.freecad,
      raw.tools.onshape
    ],
    faqs: [
      {
        question: "Why does my converted STEP file show empty shells or missing parts?",
        answer: "A .sldasm file does not contain 3D solid geometry—it only stores pointers to .sldprt part files. If the converter cannot access those .sldprt files, it cannot generate solid geometry. You must upload a ZIP containing the .sldasm and all referenced .sldprt files."
      },
      {
        question: "Does STEP AP242 preserve SolidWorks assembly mates?",
        answer: "No universal CAD neutral format preserves parametric parametric mates. STEP AP214 and AP242 convert mates into rigid transformation matrices, locking each part in its exact 3D spatial position."
      },
      {
        question: "How do I convert a SolidWorks assembly to STEP without a SolidWorks license?",
        answer: "Use dedicated cloud conversion services like DWG FastView 3D or CAD Exchanger, or open the packaged ZIP in Onshape (free tier) and export directly as STEP AP242."
      }
    ],
    relatedSlugs: ["sldprt-to-step", "sldprt-to-parasolid-xt", "catproduct-to-step", "iam-to-step"]
  },

  "catproduct-to-step": {
    slug: "catproduct-to-step",
    title: "CATIA CATProduct to STEP Converter",
    h1Title: "Dassault CATIA V5/V6 (.CATProduct) to STEP AP242 Assembly Converter",
    metaTitle: "CATIA CATProduct to STEP Converter — Aerospace & Automotive Interop (2026)",
    metaDescription: "Convert Dassault CATIA V5 CATProduct multi-level assemblies to universal STEP (AP242/AP214) solid B-Rep models. Maintain vehicle coordinate systems, product structures, and color coding.",
    category: "mcad-interop",
    categoryLabel: "Industrial MCAD Interop",
    conversionNature: "Enterprise Product Structure to Neutral Solid B-Rep (ISO 10303-242)",
    difficulty: "High (Multi-Level Product Structure & Cache Mode CGR Handling)",
    fromFormat: raw.formats.catproduct,
    toFormat: raw.formats.step,
    keyParameters: [
      {
        label: "Target Protocol",
        value: "STEP AP242 Ed.2",
        hint: "Standardized protocol for aerospace and automotive digital thread interoperability"
      },
      {
        label: "Geometry Representation",
        value: "Exact B-Rep Solid",
        hint: "Convert from Design Mode solids rather than tessellated CGR visualization cache"
      },
      {
        label: "Coordinate System",
        value: "Vehicle / Aircraft Grid",
        hint: "Preserves carline/buttock-line global spatial position relative to vehicle datum zero"
      }
    ],
    painPointDesc: "Tier-1 automotive suppliers and aerospace sub-contractors frequently receive complex CATIA V5/V6 assemblies (.CATProduct) from OEMs. Without multi-thousand-dollar CATIA licensing, downstream tooling and CNC shops cannot extract clean B-Rep solids, check clearances, or program 5-axis toolpaths.",
    riskWarning: "Ensure the CATProduct is saved in 'Design Mode' rather than 'Visualization Mode (CGR)'. Visualization mode only contains faceted triangles, which will fail to export as true mathematical NURBS solids in STEP.",
    technicalGuide: [
      {
        title: "1. Resolving CATIA Cache Mode (CGR)",
        desc: "Make sure all linked CATParts have their full geometric design data loaded so the converter extracts mathematical B-Rep surfaces rather than faceted polygon shells."
      },
      {
        title: "2. Vehicle Grid Reference vs Local Origin",
        desc: "Automotive assemblies are positioned in absolute vehicle carline coordinates. Verify whether your tooling software expects global aircraft/vehicle coordinates or a local part centroid."
      },
      {
        title: "3. Preserving Fastener Hardware & Catalog Parts",
        desc: "Ensure all standard catalog fasteners and brackets are packaged alongside the primary structural CATParts before uploading."
      },
      {
        title: "4. Multi-body Part Merging vs Multi-Instance Assemblies",
        desc: "CATIA supports both multi-body parts and product instances. Choose whether to output a single multi-body solid or a federated assembly tree."
      }
    ],
    recommendedTools: [
      raw.tools.cadexchanger,
      raw.tools.datakit,
      raw.tools.fastview,
      raw.tools.freecad
    ],
    faqs: [
      {
        question: "Why did my CATProduct export as faceted polygonal mesh instead of smooth surfaces?",
        answer: "This occurs when CATIA was in 'Visualization Mode' (Cache Mode) when saving, which creates CGR lightweight facets. The converter needs access to the underlying exact CATPart geometry."
      },
      {
        question: "Can I convert CATIA V6 (.3dxml) assemblies using this converter?",
        answer: "Yes, advanced cloud conversion suites such as CAD Exchanger and Datakit support reading 3DXML product structures and exporting them as STEP AP242."
      },
      {
        question: "How do I preserve component layer colors from CATIA in STEP?",
        answer: "Select STEP AP214 or AP242 protocol. STEP AP203 does not support surface and component color mapping."
      }
    ],
    relatedSlugs: ["catpart-to-step", "sldasm-to-step", "catpart-to-parasolid-xt", "nx-prt-to-step"]
  },

  "iam-to-step": {
    slug: "iam-to-step",
    title: "Autodesk Inventor IAM to STEP Converter",
    h1Title: "Autodesk Inventor (.iam) Assembly to STEP (AP214/AP242) Solid Converter",
    metaTitle: "Inventor (.iam) to STEP Converter — Multi-Component Mechanical Interop (2026)",
    metaDescription: "Convert Autodesk Inventor IAM assemblies to neutral ISO 10303 STEP format. Preserve assembly hierarchies, Content Center standard parts, and multi-body sheet metal designs.",
    category: "mcad-interop",
    categoryLabel: "Industrial MCAD Interop",
    conversionNature: "Inventor Assembly Architecture to Neutral Solid Container (ISO 10303)",
    difficulty: "Medium-High (Content Center Library Resolution & Adaptive Constraints)",
    fromFormat: raw.formats.iam,
    toFormat: raw.formats.step,
    keyParameters: [
      {
        label: "Content Center Linking",
        value: "Full Library Resolution",
        hint: "Include fasteners from standard Desktop/Vault Content Center libraries"
      },
      {
        label: "Model States & Level of Detail",
        value: "Master / Primary State",
        hint: "Specify active Model State to avoid suppressed sub-assemblies being dropped"
      },
      {
        label: "STEP Protocol",
        value: "AP214 / AP242",
        hint: "Guarantees cross-CAD assembly tree and color attribute retention"
      }
    ],
    painPointDesc: "Autodesk Inventor assemblies (.iam) rely on external .ipt part files and Content Center fastener libraries. When transferring machine designs to customers or vendors using SolidWorks, PTC Creo, or Siemens NX, un-packaged .iam files frequently break, requiring conversion to universal neutral STEP assemblies.",
    riskWarning: "Make sure all Content Center hardware parts (bolts, nuts, bearings) are included using Inventor's Pack and Go utility. Unresolved hardware references will leave empty holes in the final STEP assembly.",
    technicalGuide: [
      {
        title: "1. Execute Inventor Pack and Go",
        desc: "Always run 'Pack and Go' within Inventor or Inventor Apprentice to collect all external .ipt models, Content Center standard components, and custom sub-assemblies into a single directory."
      },
      {
        title: "2. Flattening Flexible Tubing & Harnesses",
        desc: "Convert dynamic wire harnesses and flexible tubing runs into static solid representations prior to export to avoid coordinate system calculation errors."
      },
      {
        title: "3. Shrinkwrap for Intellectual Property Protection",
        desc: "If sharing assemblies with external vendors, consider using Inventor's Shrinkwrap feature to fill internal voids and remove proprietary internal mechanisms before exporting to STEP."
      },
      {
        title: "4. Verifying Mass Properties in Neutral CAD",
        desc: "Open the generated STEP file in an independent viewer to verify that component bounding boxes and total assembly mass align with the engineering specification."
      }
    ],
    recommendedTools: [
      raw.tools.fastview,
      raw.tools.cadexchanger,
      raw.tools.autodesk_viewer,
      raw.tools.freecad
    ],
    faqs: [
      {
        question: "Why are fasteners and bolts missing in my converted STEP file?",
        answer: "Fasteners generated from Autodesk Inventor Content Center are stored in a separate local directory. If you did not include them via Pack and Go, the converter cannot find the geometry."
      },
      {
        question: "Can I convert an Inventor IAM file if I only have a web browser?",
        answer: "Yes, you can upload the Pack and Go ZIP file to Autodesk Viewer or DWG FastView 3D to convert and download the resulting neutral STEP file."
      },
      {
        question: "Does the STEP export retain flexible sub-assembly movement?",
        answer: "No. STEP is a static boundary-representation format. All components will be fixed rigidly in the spatial position they occupied when exported."
      }
    ],
    relatedSlugs: ["ipt-to-step", "sldasm-to-step", "ipt-to-stl", "catproduct-to-step"]
  },

  "dwf-to-dwg": {
    slug: "dwf-to-dwg",
    title: "Autodesk DWF/DWFx to AutoCAD DWG Converter",
    h1Title: "Autodesk DWF/DWFx to Editable AutoCAD (.dwg) Vector Drawing Converter",
    metaTitle: "DWF to DWG Converter — Convert Read-Only DWF to Editable AutoCAD Drawings (2026)",
    metaDescription: "Convert Autodesk DWF and DWFx publish-only files back to fully editable AutoCAD DWG/DXF drawings. Restore layers, line weights, true dimensions, and scale proportions.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "Published Read-Only Vector Package to Editable CAD Drawing Database",
    difficulty: "Medium (Vector Geometry & Layer Reconstruction)",
    fromFormat: raw.formats.dwf,
    toFormat: raw.formats.dwg,
    keyParameters: [
      {
        label: "Layer Reconstruction",
        value: "Full Sheet Layer Recovery",
        hint: "Rebuilds individual CAD layers (A-WALL, A-DOOR, etc.) from DWF sheet data"
      },
      {
        label: "Scale Calibration",
        value: "True Dimension Proportions",
        hint: "Calibrates model space units using known dimension baselines on the blueprint"
      },
      {
        label: "Polyline Optimization",
        value: "Continuous Arc & Line Fitting",
        hint: "Merges segmented vector fragments back into clean polyline entities"
      }
    ],
    painPointDesc: "Autodesk DWF/DWFx files are intended as read-only, published digital blueprints. Sub-contractors and drafting teams frequently receive DWF files from clients but cannot edit them in AutoCAD, make revisions, or integrate them into master floor plans. Converting DWF back to layered, editable DWG removes this bottleneck.",
    riskWarning: "Some DWF files flatten text strings into graphical line segments (vector strokes) rather than editable TrueType/SHX fonts. Verify that converted text entities are fully editable strings.",
    technicalGuide: [
      {
        title: "1. DWF vs DWFx Architectural Overview",
        desc: "DWF uses ZIP compression over W2D streams, while DWFx is based on Microsoft XPS standard. Both encapsulate layered vector graphics that can be reversibly reconstructed."
      },
      {
        title: "2. Setting 1:1 Scale & Unit Calibration",
        desc: "DWF files often store paper sheet coordinates (e.g., ARCH D 24x36 inches). After conversion to DWG, use the SCALE command with a reference dimension (e.g., a standard door opening or grid line) to return to true 1:1 building scale."
      },
      {
        title: "3. Reconstructing Block References",
        desc: "Standard furniture and door symbols in DWF are often disassociated into raw lines. High-end converters group recurring geometry back into reusable AutoCAD block references."
      },
      {
        title: "4. Color Index (ACI) vs TrueColor Plot Styles",
        desc: "Map pre-plotted RGB lineweights back to standard CAD layer colors (Index 1-7) to enable downstream printing with monochrome.ctb."
      }
    ],
    recommendedTools: [
      raw.tools.autodwg,
      raw.tools.gstarcad,
      raw.tools.fastview,
      raw.tools.anyconv
    ],
    faqs: [
      {
        question: "Can I edit converted DWF lines and text in AutoCAD like a native drawing?",
        answer: "Yes. Once converted to DWG using a dedicated vector reconstructor like AutoDWG, lines become editable polylines and arcs, and layers can be frozen, locked, or modified as normal."
      },
      {
        question: "Why is the converted drawing in paper space units instead of millimeters or feet?",
        answer: "DWF was plotted from layout space. To convert to 1:1 model scale, simply select the geometry in AutoCAD, run SCALE, select 'Reference', and input the actual length of a known dimension."
      },
      {
        question: "What is the difference between DWF and DWFx?",
        answer: "DWFx is Microsoft XPS-compliant and can be opened in Windows without Autodesk software. Both formats contain the same vector data and convert identically to DWG."
      }
    ],
    relatedSlugs: ["ifc-to-dwg", "slddrw-to-dwg", "image-to-dwg", "rvt-to-dwg"]
  },

  "rvt-to-dwg": {
    slug: "rvt-to-dwg",
    title: "Autodesk Revit RVT to AutoCAD DWG Converter",
    h1Title: "Autodesk Revit (.rvt) to AutoCAD (.dwg) 2D Construction Blueprint Converter",
    metaTitle: "Revit to DWG Converter — 2D Floor Plans, Sections & Layer Mapping (2026)",
    metaDescription: "Convert Autodesk Revit RVT BIM models to layered 2D AutoCAD DWG blueprints. Export floor plans, elevations, and structural details compliant with AIA and ISO 13567 standards.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "3D Parametric BIM Database to Standard 2D/3D AutoCAD DWG Vectors",
    difficulty: "Medium (BIM Category to CAD Layer Standard Mapping)",
    fromFormat: raw.formats.rvt,
    toFormat: raw.formats.dwg,
    keyParameters: [
      {
        label: "Layer Standard",
        value: "AIA / ISO 13567 / CP83",
        hint: "Maps Revit categories (Walls, Doors, Windows) to strict CAD layer naming conventions"
      },
      {
        label: "3D View Solids",
        value: "ACIS Solids (3D)",
        hint: "Outputs watertight ACIS 3D solid geometry rather than hollow polymesh facets"
      },
      {
        label: "Coordinate System",
        value: "Shared Coordinates vs Project Base",
        hint: "Aligns structural and MEP DWG outputs with the civil site survey datum"
      }
    ],
    painPointDesc: "While architectural master models are developed in Autodesk Revit, jobsite general contractors, MEP trade specialists, and municipal plan examiners require 2D AutoCAD DWG drawings. Without Revit installed, extracting clean, layered 2D floor plans from multi-gigabyte .rvt files requires specialized BIM export pipelines.",
    riskWarning: "Ensure room separation lines and invisible analytical reference planes are filtered out during DWG generation to prevent clutter in the exported construction sheets.",
    technicalGuide: [
      {
        title: "1. Configuring AIA and ISO 13567 Layer Standards",
        desc: "Map Revit Model Categories (Doors, Curtain Walls, Structural Framing) to standard CAD layers (A-DOOR, A-GLAZ, S-COLS) to comply with municipal submittal guidelines."
      },
      {
        title: "2. Managing View Crop Regions and Annotations",
        desc: "Ensure sheet viewports crop properly to avoid exporting unseen background geometry into the DWG model space."
      },
      {
        title: "3. Shared Coordinates vs Internal Origin",
        desc: "Civil engineering drawings use Shared Coordinates (State Plane or UTM). Ensure the export settings reflect the correct site coordinate system."
      },
      {
        title: "4. Text Style & Hatch Pattern Mapping",
        desc: "Configure Revit font substitutions to map custom TrueType architectural fonts cleanly to standard AutoCAD SHX or Arial text styles."
      }
    ],
    recommendedTools: [
      raw.tools.fastview,
      raw.tools.gstarcad,
      raw.tools.bluebeam,
      raw.tools.cadexchanger
    ],
    faqs: [
      {
        question: "Can I convert a Revit RVT file to DWG without having Revit installed?",
        answer: "Yes. You can upload the .rvt file to Autodesk Viewer or DWG FastView Cloud, which will process the BIM model on remote servers and allow you to download individual sheet views as DWG files."
      },
      {
        question: "How do I ensure dimensions and text in DWG look identical to Revit?",
        answer: "In the export configuration, set Text Formatting to 'Preserve Visual Fidelity' and map custom TrueType fonts to universal standard fonts like Arial."
      },
      {
        question: "Can this export 3D geometry as well as 2D floor plans?",
        answer: "Yes. By selecting a 3D isometric view in the export settings and setting solid representation to 'ACIS Solids', the generated DWG will contain 3D solid bodies."
      }
    ],
    relatedSlugs: ["revit-to-ifc", "ifc-to-dwg", "dwf-to-dwg", "slddrw-to-dwg"]
  },

  "image-to-dwg": {
    slug: "image-to-dwg",
    title: "Raster Image (JPG/PNG/TIFF) to AutoCAD DWG Converter",
    h1Title: "Raster Image (JPG/PNG/Blueprint) to Editable AutoCAD (.dwg) Vector Converter",
    metaTitle: "Image to DWG Converter — Raster to Vector Blueprint Digitization (2026)",
    metaDescription: "Convert scanned paper blueprints, construction site photos, and raster JPG/PNG sketches into editable AutoCAD DWG/DXF vector paths with center-line tracing.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "Pixel Grid Optical Matrix to Mathematical Vector CAD Database",
    difficulty: "Medium-High (Optical Noise Filtering & Centerline Vectorization)",
    fromFormat: raw.formats.image,
    toFormat: raw.formats.dwg,
    keyParameters: [
      {
        label: "Tracing Engine",
        value: "Center-Line vs Outline Tracing",
        hint: "Center-line mode produces clean single-stroke CAD lines; Outline mode traces contours"
      },
      {
        label: "Threshold / Despeckle",
        value: "Adaptive Binarization",
        hint: "Eliminates paper grain, scanning dirt specks, and yellowed document noise"
      },
      {
        label: "Corner Detection",
        value: "Orthogonal Snapping (90°)",
        hint: "Snaps nearly-perpendicular scanned lines into crisp orthogonal CAD vectors"
      }
    ],
    painPointDesc: "Architects and civil engineers frequently inherit legacy paper blueprints, PDF raster scans, or site phone photos of old schematics. Manually re-drafting paper plans in AutoCAD takes hours. An optical raster-to-vector converter automatically detects lines, arcs, circles, and text, outputting layered CAD files in seconds.",
    riskWarning: "Hand-drawn sketches with variable line weights or low-contrast scans (below 200 DPI) will require manual post-cleanup. High-resolution black-and-white 300+ DPI scans produce the cleanest vectors.",
    technicalGuide: [
      {
        title: "1. Scan Preparation: Contrast & Resolution",
        desc: "Scan blueprints at 300 to 400 DPI monochrome. Higher contrast between black ink lines and white paper background drastically improves optical vector recognition accuracy."
      },
      {
        title: "2. Center-Line Tracing vs Outline Tracing",
        desc: "For mechanical diagrams and architectural floor plans, always select 'Center-Line' tracing. 'Outline' tracing creates double lines around the stroke thickness of every wall or dimension line."
      },
      {
        title: "3. Calibrating 1:1 Scale in AutoCAD",
        desc: "After opening the vectorized DWG, measure a known reference dimension (such as a 3-foot doorway or a 10-meter grid line) and use the SCALE > Reference command to set 1:1 real-world dimensions."
      },
      {
        title: "4. Text Recognition (OCR) Layer Segregation",
        desc: "Dedicated raster converters run optical character recognition (OCR) on dimension text and place annotations on a dedicated 'TEXT' layer separate from wall geometry."
      }
    ],
    recommendedTools: [
      raw.tools.autodwg,
      raw.tools.gstarcad,
      raw.tools.freecad,
      raw.tools.anyconv
    ],
    faqs: [
      {
        question: "Can I convert a smartphone photo of a drawing into a usable DWG file?",
        answer: "Yes, provided the photo is taken directly overhead (minimizing perspective distortion) in good lighting with high contrast. However, a flatbed scan always yields significantly more accurate vectors."
      },
      {
        question: "Why did my converted wall lines turn into double lines?",
        answer: "This happens when using 'Outline' (contour) vectorization instead of 'Center-Line' vectorization. Select Center-Line mode so the converter generates a single central stroke."
      },
      {
        question: "How do I ensure the converted drawing matches true building dimensions?",
        answer: "Raster images have no built-in CAD scale units. Use the AutoCAD SCALE command with the 'Reference' option using a known dimension on the plan to restore 1:1 true scale."
      }
    ],
    relatedSlugs: ["dwf-to-dwg", "ifc-to-dwg", "slddrw-to-dwg", "rvt-to-dwg"]
  }
};

Object.assign(raw.pairs, newPairs);

// 4. Update Categories
const mcadCat = raw.categories.find(c => c.id === 'mcad-interop');
if (mcadCat) {
  ['sldasm-to-step', 'catproduct-to-step', 'iam-to-step'].forEach(slug => {
    if (!mcadCat.pairs.includes(slug)) mcadCat.pairs.push(slug);
  });
}

const bimCat = raw.categories.find(c => c.id === 'bim-doc');
if (bimCat) {
  ['dwf-to-dwg', 'rvt-to-dwg', 'image-to-dwg'].forEach(slug => {
    if (!bimCat.pairs.includes(slug)) bimCat.pairs.push(slug);
  });
}

// 5. Save back
fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2), 'utf8');
console.log('Successfully updated converter-data.json with 6 new pairs!');
console.log('New total pairs:', Object.keys(raw.pairs).length);
