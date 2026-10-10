const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/lib/converter-data.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 1. Add new formats
const newFormats = {
  dgn: {
    ext: "DGN",
    name: "Bentley MicroStation Design File",
    category: "Infrastructure & Civil CAD Standard",
    developer: "Bentley Systems",
    nature: "Multi-disciplinary 2D/3D design database containing civil road alignments, structural bridge elements, and GIS-referenced spatial coordinates",
    colorMaterial: "MicroStation level symbiology, element RGB colors, and material definitions",
    pmi: "Civil stationing, profile grades, dimension styles, and shared cell definitions",
    typicalUse: "Highways, transportation infrastructure, rail transit, plant design, municipal utilities",
    ecosystem: "Bentley MicroStation, OpenRoads, OpenBridge, ProjectWise"
  },
  nwd: {
    ext: "NWD",
    name: "Autodesk Navisworks Document",
    category: "Federated BIM Coordination Model",
    developer: "Autodesk",
    nature: "Highly compressed, read-only federated 3D cache combining architectural, structural, and MEP models with clash detection status, 4D timeliner data, and viewpoints",
    colorMaterial: "Appearance profiler overrides, status color codings, and material transparencies",
    pmi: "Object property sets, clash test results, redline markups, and takeoff data",
    typicalUse: "Multi-trade clash coordination, construction site simulation, 4D scheduling, design review submittals",
    ecosystem: "Navisworks Manage, Navisworks Freedom, BIM 360, Autodesk Construction Cloud"
  },
  svg: {
    ext: "SVG",
    name: "Scalable Vector Graphics (W3C)",
    category: "Web Vector Graphics Standard",
    developer: "World Wide Web Consortium (W3C)",
    nature: "XML-based two-dimensional vector graphics format that renders lossless lines, polygons, beziers, and text with interactive CSS/JS styling capabilities in modern web browsers",
    colorMaterial: "CSS fill, stroke, gradient attributes, and RGBA opacity channels",
    pmi: "Hyperlink tags, element IDs for DOM manipulation, viewBox coordinate dimensions",
    typicalUse: "Web dashboard floor plan visualization, interactive technical documentation, responsive CAD drawing displays",
    ecosystem: "Modern Web Browsers (Chrome, Safari, Firefox), Illustrator, Inkscape, Figma"
  }
};

Object.assign(raw.formats, newFormats);

// 2. Add 13 New Conversion Pairs
const newPairs = {
  "catpart-to-stl": {
    slug: "catpart-to-stl",
    title: "CATIA CATPart to STL Converter",
    h1Title: "Dassault CATIA V5/V6 (.CATPart) to STL 3D Printing Mesh Converter",
    metaTitle: "CATPart to STL Converter — 3D Printing & Rapid Prototyping (2026)",
    metaDescription: "Convert Dassault CATIA CATPart solid models to clean watertight binary STL meshes for Bambu Lab, Cura, and Prusa 3D printing slicers.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Exact B-Rep Solid to Watertight Triangular Mesh (Tessellation)",
    difficulty: "Medium (Chordal Deviation & Faceting Tolerance Calibration)",
    fromFormat: raw.formats.catpart,
    toFormat: raw.formats.stl,
    keyParameters: [
      {
        label: "Chordal Deviation",
        value: "0.01 mm to 0.05 mm",
        hint: "Controls maximum distance between true curved NURBS surface and approximated flat facet"
      },
      {
        label: "Angle Tolerance",
        value: "10° to 15°",
        hint: "Prevents visible polygonal stepping on cylindrical drill holes and fillets"
      },
      {
        label: "Binary Format",
        value: "Binary Little-Endian",
        hint: "Reduces file size by ~80% compared to legacy ASCII text STL"
      }
    ],
    painPointDesc: "Aerospace and automotive engineers frequently need to rapid-prototype CATIA CATPart components on commercial 3D printers. Since slicing software cannot process native CATIA solid trees, parts must be tessellated into clean, manifold, watertight STL meshes without faceting distortion.",
    riskWarning: "Setting chordal deviation too fine (<0.005mm) can generate multi-gigabyte STL files that freeze slicing software. Verify mesh polygon count before slicing.",
    technicalGuide: [
      {
        title: "1. Tessellation Settings for Precision Fillets",
        desc: "Tune chordal height to 0.02mm for functional press-fit parts to ensure cylindrical holes remain round rather than faceted octagons."
      },
      {
        title: "2. Verifying Watertight Manifold Topology",
        desc: "Ensure the source CATPart has no unstitched surface patches. Open boundary edges cause non-manifold errors in slicers."
      },
      {
        title: "3. Unit Scaling & Bounding Box Check",
        desc: "CATIA operates natively in millimeters. Verify your slicer does not interpret dimensions as inches upon import."
      }
    ],
    recommendedTools: [raw.tools.fastview, raw.tools.cadexchanger, raw.tools.bambu, raw.tools.freecad],
    faqs: [
      {
        question: "Why do curved holes in my 3D print look like faceted polygons?",
        answer: "The chordal deviation in the tessellation settings was set too coarse. Reduce chordal error to 0.02mm and angular tolerance to 10° for smooth cylindrical walls."
      },
      {
        question: "Can I convert a CATPart file to STL without installing CATIA?",
        answer: "Yes, use DWG FastView 3D Cloud Converter or CAD Exchanger, which parse CATPart boundary geometry and export binary STL directly."
      }
    ],
    relatedSlugs: ["catpart-to-step", "sldprt-to-stl", "catpart-to-3mf", "step-to-stl"]
  },

  "nx-prt-to-stl": {
    slug: "nx-prt-to-stl",
    title: "Siemens NX PRT to STL Converter",
    h1Title: "Siemens NX (.prt) to STL 3D Printing Mesh Converter",
    metaTitle: "NX PRT to STL Converter — High-Precision Slicing Mesh (2026)",
    metaDescription: "Convert Siemens NX native PRT solid models to watertight binary STL meshes. Optimize surface facet tolerance for SLA, SLS, and FDM 3D printing.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Parasolid Native B-Rep to Triangular Facet Mesh (ISO/ASTM 52915)",
    difficulty: "Medium (Tolerance & Surface Triangulation Control)",
    fromFormat: raw.formats.nx_prt,
    toFormat: raw.formats.stl,
    keyParameters: [
      {
        label: "Facet Triangle Tolerance",
        value: "0.02 mm",
        hint: "Ensures precision fit for tooling and jig rapid prototyping"
      },
      {
        label: "Mesh Manifold Check",
        value: "Watertight Solid Closure",
        hint: "Eliminates zero-thickness sliver faces and non-manifold edges"
      },
      {
        label: "Output Format",
        value: "Binary STL",
        hint: "Standard compact 84-byte header binary layout"
      }
    ],
    painPointDesc: "Siemens NX part files (.prt) built on the Parasolid kernel contain rich B-Rep topology. Tooling and shop floor technicians need fast conversion to STL for 3D printed workholding fixtures and molds without tying up high-tier NX CAD seats.",
    riskWarning: "Make sure all sheet bodies and unstitched surface features are hidden or excluded, as they produce unclosed mesh boundaries that confuse slicing software.",
    technicalGuide: [
      {
        title: "1. Parasolid Faceting Tuning",
        desc: "Use adaptive triangulation to place dense facets along tight blends and fillets while keeping planar faces lightweight."
      },
      {
        title: "2. Removing Construction Planes and Curves",
        desc: "Filter export objects to 'Solid Bodies Only' to prevent unwanted wireframe artifacts in the STL file."
      }
    ],
    recommendedTools: [raw.tools.fastview, raw.tools.cadexchanger, raw.tools.bambu, raw.tools.freecad],
    faqs: [
      {
        question: "Can I convert an NX assembly file (.prt) with this tool?",
        answer: "Yes, multi-body parts or assemblies in NX PRT format will be unified or converted as individual STL meshes for slicing."
      }
    ],
    relatedSlugs: ["nx-prt-to-step", "step-to-stl", "sldprt-to-stl"]
  },

  "creo-prt-to-stl": {
    slug: "creo-prt-to-stl",
    title: "PTC Creo PRT to STL Converter",
    h1Title: "PTC Creo / Pro-E (.prt) to STL 3D Printing Mesh Converter",
    metaTitle: "Creo PRT to STL Converter — Pro-E to 3D Printing Slicer (2026)",
    metaDescription: "Convert PTC Creo and Pro/ENGINEER PRT models to binary STL format. Optimize chord height and angle control for additive manufacturing.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Granite Kernel Solid to Faceted Triangular Mesh",
    difficulty: "Medium (Chord Height & Angle Control Calibration)",
    fromFormat: raw.formats.creo_prt,
    toFormat: raw.formats.stl,
    keyParameters: [
      {
        label: "Chord Height",
        value: "0.02 mm",
        hint: "Maximum deviation between mathematical curve and facet edge"
      },
      {
        label: "Angle Control",
        value: "0.5 to 0.7",
        hint: "Controls triangle density across curvature transitions"
      }
    ],
    painPointDesc: "Consumer product engineers designing in PTC Creo need to export prototypes directly to 3D printers. Converting Creo PRT files to clean, watertight STL eliminates common slicing mesh repair warnings in PrusaSlicer and Bambu Studio.",
    riskWarning: "Verify model units (inches vs millimeters) in the Creo part setup before export to avoid 25.4x scaling discrepancies in your slicer.",
    technicalGuide: [
      {
        title: "1. Calibrating Chord Height",
        desc: "Set chord height between 0.01mm and 0.03mm for functional snap-fit components."
      }
    ],
    recommendedTools: [raw.tools.fastview, raw.tools.cadexchanger, raw.tools.bambu, raw.tools.freecad],
    faqs: [
      {
        question: "Why is my 3D print 25.4 times too small or too large?",
        answer: "Creo often defaults to inches. Ensure the unit system is converted to millimeters before generating the STL mesh."
      }
    ],
    relatedSlugs: ["creo-prt-to-step", "step-to-stl", "catpart-to-stl"]
  },

  "catpart-to-3mf": {
    slug: "catpart-to-3mf",
    title: "CATIA CATPart to 3MF Converter",
    h1Title: "Dassault CATIA (.CATPart) to 3MF Multi-Material Slicing Converter",
    metaTitle: "CATPart to 3MF Converter — Bambu Lab & Prusa Multi-Color Slicing (2026)",
    metaDescription: "Convert CATIA CATPart files to modern 3D Manufacturing Format (3MF) containers. Retain component color coding, metadata, and watertight mesh topology.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Exact B-Rep Solid to Multi-Property 3MF Container (ISO/ASTM 52915)",
    difficulty: "Medium (Mesh Tessellation & Color/Metadata Packaging)",
    fromFormat: raw.formats.catpart,
    toFormat: raw.formats['3mf'],
    keyParameters: [
      {
        label: "Container Packaging",
        value: "OPC ZIP XML Archive",
        hint: "Compresses mesh geometry, color palettes, and print settings in one container"
      },
      {
        label: "Color Retention",
        value: "sRGB Face Colors",
        hint: "Preserves face and body color assignments for multi-material AMS / MMU printing"
      }
    ],
    painPointDesc: "Modern 3D printing has transitioned from single-color STL to feature-rich 3MF format, popularized by Bambu Lab and Prusa. Industrial designers working in CATIA need to export complex multi-body parts directly to 3MF to preserve part colors, materials, and print orientation.",
    riskWarning: "Ensure the 3MF converter adheres to the official 3MF Core Specification to prevent schema parsing errors in custom slicers.",
    technicalGuide: [
      {
        title: "1. 3MF vs STL Advantages",
        desc: "3MF files are typically 1/3 the file size of equivalent binary STLs and natively support multi-color assignments."
      }
    ],
    recommendedTools: [raw.tools.bambu, raw.tools.cadexchanger, raw.tools.fastview],
    faqs: [
      {
        question: "Why is 3MF preferred over STL for 3D printing?",
        answer: "3MF is an open, compressed XML format that embeds color, scale units, thumbnail previews, and build orientation without mesh corruption."
      }
    ],
    relatedSlugs: ["step-to-3mf", "sldprt-to-3mf", "catpart-to-stl"]
  },

  "fbx-to-stl": {
    slug: "fbx-to-stl",
    title: "Autodesk FBX to STL Converter",
    h1Title: "Autodesk FBX (Mesh & Armature) to STL 3D Printing Converter",
    metaTitle: "FBX to STL Converter — 3D Printing Game Assets & Figurines (2026)",
    metaDescription: "Convert Autodesk FBX 3D models and character assets into watertight STL meshes for 3D printing. Bake skinning poses and eliminate non-manifold faces.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Rigged/Animated Polygonal Mesh to Watertight Static Solid Mesh",
    difficulty: "High (Baking Skeletal Pose & Shell Solidification)",
    fromFormat: raw.formats.fbx,
    toFormat: raw.formats.stl,
    keyParameters: [
      {
        label: "Armature State",
        value: "Bake Active Pose",
        hint: "Freezes skeletal animation or T-pose into a static geometric freeze"
      },
      {
        label: "Wall Thickness",
        value: "Solid Infill / Minimum Wall Thickness",
        hint: "Zero-thickness clothing or hair sheets must be solidified before 3D printing"
      }
    ],
    painPointDesc: "Game environment artists, digital sculptors, and tabletop miniature enthusiasts regularly download FBX models designed for real-time rendering. These models contain zero-thickness planes, open seams, and bone rigs that crash 3D printing slicers. Converting FBX to STL requires baking the pose and solidifying mesh shells.",
    riskWarning: "Gaming FBX assets frequently have zero-thickness planes (hair strands, capes) that cannot be 3D printed. They must be thickened or booleaned before slicing.",
    technicalGuide: [
      {
        title: "1. Freezing Animation & Armature Bakes",
        desc: "Ensure the desired pose is baked to mesh vertices rather than relying on bone skinning weights."
      },
      {
        title: "2. Solidifying Non-Manifold Shells",
        desc: "Apply a solidify modifier (minimum 1.2mm wall thickness) to paper-thin geometry."
      }
    ],
    recommendedTools: [raw.tools.blender, raw.tools.bambu, raw.tools.meshlab, raw.tools.fastview],
    faqs: [
      {
        question: "Why does my slicer complain about non-manifold edges in the converted FBX?",
        answer: "Video game FBX models often have open bottoms, intersecting floating meshes, or two-sided flat planes. The mesh must be repaired into a watertight closed shell."
      }
    ],
    relatedSlugs: ["obj-to-stl", "glb-to-stl", "step-to-stl"]
  },

  "glb-to-stl": {
    slug: "glb-to-stl",
    title: "Web3D GLB/glTF to STL Converter",
    h1Title: "GLB/glTF (Web3D) to STL 3D Printing Slicer Converter",
    metaTitle: "GLB to STL Converter — Web3D to 3D Printing Slicer (2026)",
    metaDescription: "Convert Web3D GLB and glTF models to watertight binary STL meshes. Decompress Draco geometry and prepare browser assets for 3D printing.",
    category: "3d-printing",
    categoryLabel: "3D Printing & Slicing",
    conversionNature: "Web Binary glTF Container to Additive Manufacturing STL",
    difficulty: "Medium (Draco Mesh Decompression & Coordinate System Normalization)",
    fromFormat: raw.formats.glb,
    toFormat: raw.formats.stl,
    keyParameters: [
      {
        label: "Draco Decompression",
        value: "Lossless Point Recovery",
        hint: "Decompresses compact Draco web buffer attributes into full 32-bit float vectors"
      },
      {
        label: "Up-Axis Alignment",
        value: "Y-Up to Z-Up Conversion",
        hint: "glTF standard uses Y-Up; CAD 3D printing standard uses Z-Up"
      }
    ],
    painPointDesc: "Online 3D repositories, mobile AR captures, and WebGL configurators store assets in binary GLB format. Makers wanting to print these objects must convert GLB to STL while correcting orientation from WebGL Y-Up to 3D printer Z-Up.",
    riskWarning: "GLB models often include normal maps that simulate surface detail without true geometric relief. Verify that actual geometric displacement is present.",
    technicalGuide: [
      {
        title: "1. Y-Up to Z-Up Coordinate Rotation",
        desc: "Rotate the model -90° around the X-axis so the floor plane aligns correctly with the 3D printer build plate."
      }
    ],
    recommendedTools: [raw.tools.blender, raw.tools.bambu, raw.tools.meshlab, raw.tools.fastview],
    faqs: [
      {
        question: "Why is my converted GLB model lying on its side in the slicer?",
        answer: "glTF/GLB specifies the Y-axis as Up, whereas 3D printing slicers use Z-axis as Up. The converter rotates the orientation 90 degrees to ensure correct alignment."
      }
    ],
    relatedSlugs: ["step-to-glb", "fbx-to-stl", "obj-to-stl"]
  },

  "obj-to-glb": {
    slug: "obj-to-glb",
    title: "Wavefront OBJ to Web3D GLB Converter",
    h1Title: "Wavefront (.obj) to Web3D (.glb) Draco-Compressed Converter",
    metaTitle: "OBJ to GLB Converter — WebGL, Shopify 3D & AR Visualization (2026)",
    metaDescription: "Convert Wavefront OBJ models and MTL textures to compact binary GLB files with Draco compression for Three.js, Shopify 3D, and mobile AR.",
    category: "web3d",
    categoryLabel: "Web3D & Lightweight Visualization",
    conversionNature: "Text Wavefront Waveform to Compact Binary Web3D Container (glTF 2.0)",
    difficulty: "Low-Medium (Material MTL Mapping & Texture Baking)",
    fromFormat: raw.formats.obj,
    toFormat: raw.formats.glb,
    keyParameters: [
      {
        label: "Compression Engine",
        value: "Google Draco Geometry",
        hint: "Shrinks file size by 70-90% for instant web loading over 4G/5G mobile networks"
      },
      {
        label: "PBR Material Workflow",
        value: "Metallic-Roughness Standard",
        hint: "Converts legacy specular/diffuse MTL textures into modern glTF PBR shaders"
      }
    ],
    painPointDesc: "Wavefront OBJ is an uncompressed ASCII format that results in massive file sizes with loose texture image dependencies. For e-commerce 3D product viewers (Shopify, Amazon) and Three.js web apps, converting OBJ to a single self-contained, Draco-compressed GLB file is mandatory.",
    riskWarning: "Ensure all texture images referenced in the .mtl file are available in the same folder during conversion to prevent white untextured models.",
    technicalGuide: [
      {
        title: "1. Packing Embedded Textures",
        desc: "Embed diffuse, roughness, and normal maps directly inside the single GLB binary buffer."
      }
    ],
    recommendedTools: [raw.tools.blender, raw.tools.fastview, raw.tools.anyconv],
    faqs: [
      {
        question: "Can this converted GLB file be uploaded directly to Shopify 3D or Apple Quick Look?",
        answer: "Yes, standard glTF 2.0 GLB files with PBR materials are fully compliant with Shopify product pages and web AR viewers."
      }
    ],
    relatedSlugs: ["step-to-glb", "skp-to-glb", "fbx-to-glb", "stl-to-glb"]
  },

  "fbx-to-glb": {
    slug: "fbx-to-glb",
    title: "Autodesk FBX to Web3D GLB Converter",
    h1Title: "Autodesk FBX to Web3D (.glb) Real-Time Asset Converter",
    metaTitle: "FBX to GLB Converter — Interactive WebGL, Three.js & Metaverse (2026)",
    metaDescription: "Convert Autodesk FBX 3D models with animations and PBR materials to compact binary GLB files for Three.js, Babylon.js, and web-based AR.",
    category: "web3d",
    categoryLabel: "Web3D & Lightweight Visualization",
    conversionNature: "Proprietary DCC Exchange Format to Open Web3D Standard (glTF 2.0)",
    difficulty: "Medium (Skeletal Animation & PBR Shader Conversion)",
    fromFormat: raw.formats.fbx,
    toFormat: raw.formats.glb,
    keyParameters: [
      {
        label: "Animation Tracks",
        value: "Linear Interpolation Sampling",
        hint: "Bakes skeletal keyframes into compact glTF animation channels"
      },
      {
        label: "Material PBR Translation",
        value: "Roughness/Metalness Map",
        hint: "Maps Autodesk Stingray/Standard materials to glTF PBR standard"
      }
    ],
    painPointDesc: "Game engines and digital content tools (Maya, 3ds Max) export complex scenes in FBX format. However, web browsers cannot natively render FBX files. Converting FBX to GLB enables seamless real-time viewing in web applications with full animation and material fidelity.",
    riskWarning: "High-resolution 4K/8K textures should be downscaled to 2048x2048 or compressed to WebP/KTX2 for optimal web performance.",
    technicalGuide: [
      {
        title: "1. Material Mapping Pipeline",
        desc: "Convert standard Lambert or Blinn shaders into glTF PBR metallic-roughness materials."
      }
    ],
    recommendedTools: [raw.tools.blender, raw.tools.fastview, raw.tools.anyconv],
    faqs: [
      {
        question: "Does the GLB file preserve skeletal character animations from FBX?",
        answer: "Yes, rigged skeletal animations and transform tracks are fully supported by the glTF 2.0 specification."
      }
    ],
    relatedSlugs: ["skp-to-fbx", "obj-to-glb", "step-to-glb"]
  },

  "stl-to-glb": {
    slug: "stl-to-glb",
    title: "3D Printing STL to Web3D GLB Converter",
    h1Title: "Stereolithography (.stl) to Web3D (.glb) Interactive Viewer Converter",
    metaTitle: "STL to GLB Converter — WebGL 3D Preview & Draco Compression (2026)",
    metaDescription: "Convert 3D printing STL files to web-optimized GLB models. Apply Draco compression, compute smooth surface normals, and assign aesthetic materials.",
    category: "web3d",
    categoryLabel: "Web3D & Lightweight Visualization",
    conversionNature: "Raw Faceted Mesh to Compressed Web3D Model with PBR Shading",
    difficulty: "Low-Medium (Normal Vector Smoothing & Draco Compression)",
    fromFormat: raw.formats.stl,
    toFormat: raw.formats.glb,
    keyParameters: [
      {
        label: "Draco Mesh Compression",
        value: "Up to 85% Size Reduction",
        hint: "Compresses unindexed STL triangle coordinates for rapid web downloads"
      },
      {
        label: "Normal Smoothing",
        value: "Angle Threshold 30°",
        hint: "Calculates vertex normals to eliminate faceted appearance in web viewports"
      }
    ],
    painPointDesc: "Manufacturers and 3D printing hubs want to display 3D models directly on their websites for online quoting and interactive portfolio reviews. Raw STL files are too large and lack surface shading normals. Converting STL to GLB reduces file size by ~80% and applies smooth, attractive metallic or plastic PBR rendering.",
    riskWarning: "STL files contain zero color or normal vector information. The converter calculates vertex normals procedurally based on face adjacency.",
    technicalGuide: [
      {
        title: "1. Calculating Smooth Vertex Normals",
        desc: "Calculate shared vertex normals across adjacent faces to give curved surfaces a smooth, injection-molded appearance rather than a blocky faceted look."
      }
    ],
    recommendedTools: [raw.tools.blender, raw.tools.fastview, raw.tools.meshlab],
    faqs: [
      {
        question: "Can I add color to an STL file when converting to GLB?",
        answer: "Yes! While STL has no native color data, the converter allows you to assign realistic PBR materials (e.g. brushed metal, glossy resin, matte PLA plastic) to the generated GLB model."
      }
    ],
    relatedSlugs: ["step-to-glb", "obj-to-glb", "step-to-stl"]
  },

  "dwg-version-converter": {
    slug: "dwg-version-converter",
    title: "AutoCAD DWG Version Downgrader & Format Converter",
    h1Title: "AutoCAD DWG Version Downgrader (2026/2024 to 2018/2013/2004/R14)",
    metaTitle: "DWG Version Converter — Save Down AutoCAD DWG Files Online (2026)",
    metaDescription: "Convert and save down latest AutoCAD DWG drawings (AutoCAD 2026, 2024, 2021) to legacy formats (2018, 2013, 2010, 2004, R14) without AutoCAD.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "CAD Database Schema Migration across AutoCAD AC1032 / AC1027 / AC1018 Versions",
    difficulty: "Medium (Custom Object Enablers & Proxy Graphics Handling)",
    fromFormat: raw.formats.dwg,
    toFormat: raw.formats.dwg,
    keyParameters: [
      {
        label: "Target Schema Version",
        value: "AutoCAD 2018 / 2013 / 2004",
        hint: "AC1032 (2018-2026), AC1027 (2013-2017), AC1018 (2004-2006)"
      },
      {
        label: "Proxy Graphics",
        value: "Explode / Retain Visuals",
        hint: "Ensures vertical application objects (Civil 3D, Architecture) remain visible in older CAD"
      }
    ],
    painPointDesc: "AutoCAD periodically updates its underlying DWG database schema (AC1032, AC1027, etc.). When project partners run older CAD releases (AutoCAD 2014, GstarCAD 2020, or legacy CNC machines), opening newer DWG files triggers the dreaded 'Drawing file is not valid' error. A version downgrader saves files down to universal legacy formats without requiring an active Autodesk subscription.",
    riskWarning: "Converting down to AutoCAD 2004 or R14 may downgrade dynamic block parameters and associative hatches into standard static entities.",
    technicalGuide: [
      {
        title: "1. Understanding AutoCAD Format Generations",
        desc: "AutoCAD 2018-2026 uses AC1032 format; 2013-2017 uses AC1027; 2010-2012 uses AC1024; 2004-2006 uses AC1018. Save down to the lowest version supported by all project partners."
      },
      {
        title: "2. Preserving Civil 3D & Architecture Proxy Graphics",
        desc: "Ensure PROXYGRAPHICS is set to 1 before saving down so custom AEC objects render correctly in vanilla CAD."
      }
    ],
    recommendedTools: [raw.tools.autodwg, raw.tools.fastview, raw.tools.gstarcad, raw.tools.anyconv],
    faqs: [
      {
        question: "Why does AutoCAD say 'Drawing file is not valid' when opening my file?",
        answer: "This error almost always means the drawing was created in a newer version of AutoCAD than the one you are running. Save the file down to a version your software can open (e.g. AutoCAD 2013 format)."
      },
      {
        question: "Can I convert DWG versions for free without installing AutoCAD?",
        answer: "Yes, you can use DWG FastView Cloud Converter, Autodesk DWG TrueView, or AutoDWG DWG Converter to batch downgrade files."
      }
    ],
    relatedSlugs: ["dwf-to-dwg", "slddrw-to-dwg", "image-to-dwg", "ifc-to-dwg"]
  },

  "dwg-to-svg": {
    slug: "dwg-to-svg",
    title: "AutoCAD DWG to Scalable Vector Graphics (SVG) Converter",
    h1Title: "AutoCAD (.dwg) to Scalable Vector Graphics (.svg) Web Converter",
    metaTitle: "DWG to SVG Converter — Interactive Web CAD Vector Graphics (2026)",
    metaDescription: "Convert AutoCAD DWG blueprints to clean, scalable W3C SVG vector graphics. Retain functional CAD layers, true colors, and crisp zooming for web dashboards.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "CAD Database Vectors to W3C XML Scalable Vector Graphics (SVG)",
    difficulty: "Medium (Coordinate Space Scaling & Arc/Spline Approximation)",
    fromFormat: raw.formats.dwg,
    toFormat: raw.formats.svg,
    keyParameters: [
      {
        label: "Layer Tagging",
        value: "Grouped SVG <g> Elements",
        hint: "Organizes polylines into labeled SVG groups for CSS styling and toggleable visibility"
      },
      {
        label: "Coordinate Precision",
        value: "2 to 4 Decimal Places",
        hint: "Optimizes SVG file size while maintaining crisp vector rendering at high zoom levels"
      }
    ],
    painPointDesc: "Web developers and facility managers need to embed interactive architectural floor plans and mechanical schematics into modern web dashboards (React, Vue, mobile apps). Exporting raster PNGs causes blurry pixelation upon zooming. Converting DWG to SVG delivers crisp, lossless, interactive vector geometry directly in the DOM.",
    riskWarning: "Drawings with millions of hatch lines or dense contour topography can produce massive SVG DOM trees. Purge unneeded layers before export.",
    technicalGuide: [
      {
        title: "1. Optimizing SVG DOM Elements",
        desc: "Convert recurring CAD blocks into SVG <defs> symbols to reduce DOM node counts and improve web browser rendering performance."
      },
      {
        title: "2. Color Mapping & Lineweight Scaling",
        desc: "Translate AutoCAD Color Index (ACI) values into clean HEX/RGB styles with responsive CSS stroke-width scaling."
      }
    ],
    recommendedTools: [raw.tools.autodwg, raw.tools.fastview, raw.tools.gstarcad, raw.tools.anyconv],
    faqs: [
      {
        question: "Can I manipulate individual CAD layers in the converted SVG using JavaScript?",
        answer: "Yes! High-quality DWG to SVG converters preserve AutoCAD layers as grouped <g id='layer_name'> elements, allowing dynamic show/hide and styling via CSS and JavaScript."
      }
    ],
    relatedSlugs: ["dwf-to-dwg", "slddrw-to-pdf", "image-to-dwg"]
  },

  "dgn-to-step": {
    slug: "dgn-to-step",
    title: "Bentley MicroStation DGN to STEP Converter",
    h1Title: "Bentley MicroStation (.dgn) to STEP (ISO 10303) Solid Converter",
    metaTitle: "DGN to STEP Converter — Civil & Infrastructure MCAD Interop (2026)",
    metaDescription: "Convert Bentley MicroStation DGN 3D civil and structural models to neutral STEP format. Bridge infrastructure engineering with mechanical CAD.",
    category: "mcad-interop",
    categoryLabel: "Industrial MCAD Interop",
    conversionNature: "Infrastructure CAD Database to Neutral Mechanical Solid (ISO 10303)",
    difficulty: "Medium-High (Civil Spatial Units & B-Rep Topology Mapping)",
    fromFormat: raw.formats.dgn,
    toFormat: raw.formats.step,
    keyParameters: [
      {
        label: "3D Solid Entity Extraction",
        value: "Parasolid B-Rep Bodies",
        hint: "Converts MicroStation SmartSolids and Feature Solids into compliant STEP AP214/AP242"
      },
      {
        label: "Geographic Coordinate Offset",
        value: "Local Origin Normalization",
        hint: "Normalizes State Plane / GIS coordinates to prevent floating-point precision loss in MCAD"
      }
    ],
    painPointDesc: "Civil infrastructure and bridge designs are created in Bentley MicroStation, but mechanical components (bearings, expansion joints, structural steel embeds) are manufactured in SolidWorks or Inventor. Converting DGN models to neutral STEP files bridges the data exchange between civil contractors and mechanical fabricators.",
    riskWarning: "Civil models with large State Plane coordinate values (millions of feet/meters from origin) can cause numerical jitter in mechanical CAD. Normalize to a local project benchmark prior to export.",
    technicalGuide: [
      {
        title: "1. SmartSolid to STEP Conversion",
        desc: "Extract Parasolid-based SmartSolids directly into neutral STEP format to retain mathematical surface continuity."
      }
    ],
    recommendedTools: [raw.tools.cadexchanger, raw.tools.fastview, raw.tools.freecad],
    faqs: [
      {
        question: "Why does my DGN model look distorted when opened in SolidWorks?",
        answer: "MicroStation files often place geometry hundreds of kilometers from the origin in geographic survey coordinates. Reset the origin to the local project centroid before exporting to STEP."
      }
    ],
    relatedSlugs: ["ifc-to-dwg", "revit-to-ifc", "catproduct-to-step"]
  },

  "nwd-to-ifc": {
    slug: "nwd-to-ifc",
    title: "Autodesk Navisworks NWD to openBIM IFC Converter",
    h1Title: "Autodesk Navisworks (.nwd) to openBIM IFC4 Coordination Converter",
    metaTitle: "NWD to IFC Converter — Federated Model Coordination & OpenBIM (2026)",
    metaDescription: "Convert Autodesk Navisworks NWD federated coordination models to openBIM IFC2x3/IFC4 format for clash detection in Solibri, Archicad, and BIMcollab.",
    category: "bim-doc",
    categoryLabel: "BIM & 2D Documentation",
    conversionNature: "Federated Review Cache to Standard openBIM Semantic Model (ISO 16739)",
    difficulty: "High (Mesh Geometry to BIM Semantic Classification Mapping)",
    fromFormat: raw.formats.nwd,
    toFormat: raw.formats.ifc,
    keyParameters: [
      {
        label: "Target Schema",
        value: "IFC4 Reference View / IFC2x3",
        hint: "Certified openBIM coordination view for clash detection and code checking"
      },
      {
        label: "Property Set Retention",
        value: "Extended Navisworks User Data",
        hint: "Preserves custom take-off parameters and trade categorization attributes"
      }
    ],
    painPointDesc: "General contractors frequently compile master coordination models into Autodesk Navisworks NWD files. However, public infrastructure projects and openBIM mandates require neutral IFC format for validation in Solibri or Archicad. Converting NWD cache files to IFC enables vendor-neutral compliance.",
    riskWarning: "NWD files are optimized lightweight review models; underlying high-level parametric parametric curves are pre-tessellated into surface meshes.",
    technicalGuide: [
      {
        title: "1. Rebuilding BuildingSmart Classifications",
        desc: "Map Navisworks layer hierarchies to standard IfcBuildingElementProxy or specific IFC classes (IfcBeam, IfcColumn, IfcPipeSegment)."
      }
    ],
    recommendedTools: [raw.tools.cadexchanger, raw.tools.fastview, raw.tools.freecad],
    faqs: [
      {
        question: "Can an NWD file be converted directly back to an editable Revit model?",
        answer: "No, NWD is a read-only compiled display cache. Converting it to IFC provides reference geometry for clash detection and coordination, but not fully parametric Revit family objects."
      }
    ],
    relatedSlugs: ["revit-to-ifc", "ifc-to-dwg", "rvt-to-dwg"]
  }
};

Object.assign(raw.pairs, newPairs);

// 3. Update Categories
const printCat = raw.categories.find(c => c.id === '3d-printing');
if (printCat) {
  ['catpart-to-stl', 'nx-prt-to-stl', 'creo-prt-to-stl', 'catpart-to-3mf', 'fbx-to-stl', 'glb-to-stl'].forEach(slug => {
    if (!printCat.pairs.includes(slug)) printCat.pairs.push(slug);
  });
}

const webCat = raw.categories.find(c => c.id === 'web3d');
if (webCat) {
  ['obj-to-glb', 'fbx-to-glb', 'stl-to-glb'].forEach(slug => {
    if (!webCat.pairs.includes(slug)) webCat.pairs.push(slug);
  });
}

const mcadCat = raw.categories.find(c => c.id === 'mcad-interop');
if (mcadCat) {
  ['dgn-to-step'].forEach(slug => {
    if (!mcadCat.pairs.includes(slug)) mcadCat.pairs.push(slug);
  });
}

const bimCat = raw.categories.find(c => c.id === 'bim-doc');
if (bimCat) {
  ['dwg-version-converter', 'dwg-to-svg', 'nwd-to-ifc'].forEach(slug => {
    if (!bimCat.pairs.includes(slug)) bimCat.pairs.push(slug);
  });
}

// 4. Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2), 'utf8');
console.log('Successfully injected Batch 2 & 3 converters into converter-data.json!');
console.log('Final Total Pairs Count:', Object.keys(raw.pairs).length);
