const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');
const prettier = require('prettier');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

const MANUAL_ENRICHMENT = {
  'autocad': {
    pricing_tiers: [
      { name: 'Monthly', price: '255', period: '/mo', features: ['2D Drafting', '3D Modeling', 'Specialized Toolsets', 'AutoLisp Support'], is_popular: false },
      { name: 'Annual', price: '2,030', period: '/yr', features: ['All Monthly features', 'Web & Mobile Apps', 'Smart Blocks', 'Technical Support'], is_popular: true },
      { name: '3-Year', price: '6,090', period: '/3yr', features: ['Locked-in pricing', 'All Pro features', 'Enterprise Support'], is_popular: false }
    ],
    key_capabilities: ['2D Drafting', '3D Modeling', 'AutoLisp', 'Sheet Sets', 'Cloud Storage'],
    detailed_features: [
      {
        category: 'Core Design',
        items: [
          { name: '2D Drafting & Annotation', status: true },
          { name: '3D Modeling & Visualization', status: true },
          { name: 'Smart Blocks & AI Placement', status: true },
          { name: 'Floating Windows', status: true }
        ]
      },
      {
        category: 'Professional Workflow',
        items: [
          { name: 'AutoLisp & API Support', status: true },
          { name: 'Activity Insights', status: true },
          { name: 'Markup Import & Assist', status: true },
          { name: 'Cloud Collaboration', status: true }
        ]
      }
    ]
  },
  'dwg-fastview': {
    pricing_tiers: [
      { name: 'Free', price: '0', period: '/forever', features: ['Basic Viewing', 'Limited Editing', 'Cloud Sync', 'Annotations'], is_popular: false },
      { name: 'Premium Monthly', price: '4.99', period: '/mo', features: ['All 3D Formats', 'No Ads', 'Advanced Editing', 'Batch Plotting'], is_popular: false },
      { name: 'Premium Annual', price: '47', period: '/yr', features: ['Best Value', 'Priority Support', 'Full Mobile access', 'Professional Tools'], is_popular: true }
    ],
    key_capabilities: ['Mobile DWG Viewer', 'Cloud Sync', '3D Format Support', 'Basic Editing', 'Annotations'],
    detailed_features: [
      {
        category: 'Viewing & Export',
        items: [
          { name: '2D/3D DWG & DXF Support', status: true },
          { name: 'RVT/STEP/SLDPRT Viewing', status: true },
          { name: 'PDF/Image Export', status: true },
          { name: 'Garbled Text Auto-fix', status: true }
        ]
      },
      {
        category: 'Tools & Cloud',
        items: [
          { name: 'Cloud Multi-device Sync', status: true },
          { name: 'Measurement & Dimensioning', status: true },
          { name: 'Layer Management', status: true },
          { name: 'External Reference (Xref)', status: true }
        ]
      }
    ]
  },
  'fusion-360': {
    pricing_tiers: [
      { name: 'Fusion (Standard)', price: '57', period: '/mo', features: ['3D Design & Modeling', 'Basic CAM (2.5 & 3-axis)', 'PCB Design', 'Team Collaboration'], is_popular: true },
      { name: 'For Manufacturing', price: '128', period: '/mo', features: ['All Standard features', 'Advanced Machining (4 & 5-axis)', 'Nesting & Fabrication', 'Steep & Shallow finishing'], is_popular: false },
      { name: 'For Design', price: '137', period: '/mo', features: ['All Standard features', 'Generative Design', 'Advanced Simulation', 'Complex Surfacing'], is_popular: false }
    ],
    key_capabilities: ['Cloud CAD/CAM', 'Generative Design', 'Integrated PCB', 'Simulation', 'Collaboration'],
    detailed_features: [
      {
        category: 'Unified Platform',
        items: [
          { name: 'Integrated CAD/CAM/CAE', status: true },
          { name: 'Cloud-native Data Management', status: true },
          { name: 'Direct & Parametric Modeling', status: true },
          { name: 'Unified Electronics Design', status: true }
        ]
      },
      {
        category: 'Advanced Tech',
        items: [
          { name: 'AI-powered Generative Design', status: true },
          { name: 'Thermal & Stress Analysis', status: true },
          { name: 'Additive Manufacturing support', status: true },
          { name: 'Photorealistic Rendering', status: true }
        ]
      }
    ]
  },
  'civil-3d': {
    pricing_tiers: [
      { name: 'Monthly', price: '330', period: '/mo', features: ['Road & Highway design', 'Parcel & Grading', 'Gravity & Pressure Pipe', 'Dynamic Alignment'], is_popular: false },
      { name: 'Annual', price: '2,645', period: '/yr', features: ['Full BIM integration', 'Project Explorer', 'Grading Optimization', 'Technical Support'], is_popular: true }
    ],
    key_capabilities: ['Civil Infrastructure', 'Road/Highway Design', 'Grading Optimization', 'Pipe Network Design', 'BIM for Civil'],
    detailed_features: [
      {
        category: 'Design & Modeling',
        items: [
          { name: 'Dynamic Alignment & Profiles', status: true },
          { name: 'Corridor Modeling', status: true },
          { name: 'Grading Optimization Tools', status: true },
          { name: 'Pressure Pipe Networks', status: true }
        ]
      },
      {
        category: 'Analysis & Data',
        items: [
          { name: 'Project Explorer for Civil 3D', status: true },
          { name: 'Storm & Sanitary Analysis', status: true },
          { name: 'Geotechnical Modeler', status: true },
          { name: 'Infraworks Interoperability', status: true }
        ]
      }
    ],
    category_id: 'c3',
    name: 'Civil 3D'
  },
  'infraworks': {
    pricing_tiers: [
      { name: 'Monthly', price: '260', period: '/mo', features: ['Conceptual Design', 'Context Modeling', 'Traffic Simulation', 'Cloud Sharing'], is_popular: false },
      { name: 'Annual', price: '2,075', period: '/yr', features: ['Advanced Bridge design', 'Mobility Simulation', 'Visual Storytelling', 'Autodesk Docs sync'], is_popular: true }
    ],
    key_capabilities: ['Conceptual Design', 'Infrastructure Planning', 'Context Modeling', 'Mobility Simulation', 'Visual Presentation'],
    detailed_features: [
      {
        category: 'Planning',
        items: [
          { name: 'Aggregated Data Context', status: true },
          { name: 'Concept Design of Roads/Bridges', status: true },
          { name: 'Traffic & Mobility Simulation', status: true },
          { name: 'Drainage Design Analysis', status: true }
        ]
      },
      {
        category: 'Visuals & Collaboration',
        items: [
          { name: 'Photorealistic Visualization', status: true },
          { name: 'Cloud-based Shared Views', status: true },
          { name: 'Real-time Scenario comparison', status: true },
          { name: 'ArcGIS Integration', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'Infraworks'
  },
  'navisworks': {
    pricing_tiers: [
      { name: 'Manage (Annual)', price: '2,645', period: '/yr', features: ['Full Clash Detection', '4D Scheduling', '5D Cost analysis', 'Quantification'], is_popular: true },
      { name: 'Simulate', price: '1,100', period: '/yr', features: ['Timeline simulation', 'Advanced Rendering', 'No Clash Detection', 'NWD conversion'], is_popular: false }
    ],
    key_capabilities: ['BIM Coordination', 'Clash Detection', '4D/5D Simulation', 'Model Aggregation', 'Cloud Collaboration'],
    detailed_features: [
      {
        category: 'Coordination',
        items: [
          { name: 'Automated Clash Detection', status: true },
          { name: 'Conflict/Issue management', status: true },
          { name: 'Over 60+ File formats support', status: true },
          { name: 'NWD/NWC optimization', status: true }
        ]
      },
      {
        category: 'Simulation',
        items: [
          { name: '4D Timeliner (Schedule)', status: true },
          { name: '5D Quantification (Cost)', status: true },
          { name: 'Photorealistic Rendering', status: true },
          { name: 'Animator/Scripter tools', status: true }
        ]
      }
    ],
    category_id: 'c3',
    name: 'Navisworks'
  },
  'draftsight': {
    pricing_tiers: [
      { name: 'Professional', price: '249', period: '/yr', features: ['API Support', 'Toolbox Library', 'Batch Printing', 'Standard 2D Drafting'], is_popular: true },
      { name: 'Premium', price: '549', period: '/yr', features: ['3D Modeling', 'Constraints', 'Full Professional features', 'Technical Support'], is_popular: false },
      { name: 'Enterprise', price: 'Custom', period: 'quote', features: ['Network Licensing', 'Deployment Tools', 'Priority Support'], is_popular: false }
    ],
    key_capabilities: ['2D/3D Drafting', 'LISP Support', 'Dynamic Blocks', 'Toolbox Utilities', 'DGN Support'],
    detailed_features: [
      {
        category: 'Productivity',
        items: [
          { name: 'API & LISP Support', status: true },
          { name: 'Standard Hardware Library', status: true },
          { name: 'Batch PDF Export', status: true },
          { name: 'G-Code Generator', status: true }
        ]
      },
      {
        category: 'Modeling',
        items: [
          { name: '3D Solid Modeling', status: true },
          { name: 'Geometric Constraints', status: true },
          { name: 'Dynamic Blocks support', status: true },
          { name: 'Sheet Metal features', status: false }
        ]
      }
    ],
    category_id: 'c1',
    name: 'DraftSight'
  },
  'rhino-3d': {
    pricing_tiers: [
      { name: 'Commercial (V8)', price: '995', period: 'one-time', features: ['Full NURBS Modeling', 'Grasshopper included', 'SubD Modeling', 'Permanent License'], is_popular: true },
      { name: 'Upgrade from V7', price: '595', period: 'one-time', features: ['Update existing license', 'Latest V8 features', 'New render engine'], is_popular: false }
    ],
    key_capabilities: ['Free-form NURBS', 'Grasshopper Visual Coding', 'SubD Surfaces', 'Render Integration', 'Rhino.Inside.Revit'],
    detailed_features: [
      {
        category: 'Surface Modeling',
        items: [
          { name: 'Complex NURBS surfaces', status: true },
          { name: 'SubD (Subdivision) tools', status: true },
          { name: 'Point Cloud processing', status: true },
          { name: 'Mesh repair & editing', status: true }
        ]
      },
      {
        category: 'Algorithm Design',
        items: [
          { name: 'Grasshopper Integration', status: true },
          { name: 'Kangaroo Physics engine', status: true },
          { name: 'Python/C# Scripting', status: true },
          { name: 'Cycles Rendering', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'Rhino 3D'
  },
  'maya': {
    pricing_tiers: [
      { name: 'Monthly', price: '235', period: '/mo', features: ['Character Animation', 'Bifrost for Maya', 'Arnold Renderer', 'Advanced Rigging'], is_popular: true },
      { name: 'Annual', price: '1,875', period: '/yr', features: ['Full Motion Graphics', 'USD integration', 'Interactive Grooming', 'Technical Support'], is_popular: false }
    ],
    key_capabilities: ['Character Animation', '3D Modeling', 'Dynamics & Effects', 'Rendering', 'Pipeline Integration'],
    detailed_features: [
      {
        category: 'Animation & Rigging',
        items: [
          { name: 'Matrix-driven Rigging', status: true },
          { name: 'Cached Playback', status: true },
          { name: 'Automated Shape Authoring', status: true },
          { name: 'Ghosting Editor', status: true }
        ]
      },
      {
        category: 'Dynamics & Rendering',
        items: [
          { name: 'Bifrost Visual Programming', status: true },
          { name: 'Integrated Arnold Renderer', status: true },
          { name: 'MASH Procedural effects', status: true },
          { name: 'XGen Interactive Grooming', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'Maya'
  },
  '3ds-max': {
    pricing_tiers: [
      { name: 'Monthly', price: '235', period: '/mo', features: ['High-end Rendering', 'AEC Visualization', 'Particle Flow', 'Smart Extrude'], is_popular: false },
      { name: 'Annual', price: '1,875', period: '/yr', features: ['Retopology tools', 'Bake to Texture', 'USD support', 'Arnold integration'], is_popular: true }
    ],
    key_capabilities: ['Architectural Visualization', '3D Modeling', 'Texture Mapping', 'Rendering', 'Dynamic Simulation'],
    detailed_features: [
      {
        category: 'AEC Visualization',
        items: [
          { name: 'Smart Extrude system', status: true },
          { name: 'Spline Workflows', status: true },
          { name: 'Scene Layout & Tracking', status: true },
          { name: 'Interactive Rendering', status: true }
        ]
      },
      {
        category: 'Design & Texturing',
        items: [
          { name: 'Advanced Retopology', status: true },
          { name: 'Physical Camera support', status: true },
          { name: 'PBR Material support', status: true },
          { name: 'OSL (Open Shading Language)', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: '3ds Max'
  },
  'blender': {
    pricing_tiers: [
      { name: 'Free & Open Source', price: '0', period: '/forever', features: ['Full 3D Suite', 'Cycles Renderer', 'Geometry Nodes', 'Community Support'], is_popular: true }
    ],
    key_capabilities: ['Open Source 3D', 'Geometry Nodes', 'Sculpting', 'VFX/Compositing', '2D Animation (Grease Pencil)'],
    detailed_features: [
      {
        category: 'Creation Suite',
        items: [
          { name: 'Cycles Path Tracer', status: true },
          { name: 'Geometry Nodes (Procedural)', status: true },
          { name: 'Grease Pencil (2D in 3D)', status: true },
          { name: 'Real-time Eevee Engine', status: true }
        ]
      },
      {
        category: 'Sculpting & VFX',
        items: [
          { name: 'Dynamic Topology Sculpting', status: true },
          { name: 'Integrated Compositor', status: true },
          { name: 'Camera Tracking', status: true },
          { name: 'Python API for addons', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'Blender'
  },
  'zbrush': {
    pricing_tiers: [
      { name: 'Monthly', price: '39', period: '/mo', features: ['Industry Standard Sculpt', 'ZRemesher', 'Dynamesh', 'PolyPaint'], is_popular: false },
      { name: 'Annual', price: '359', period: '/yr', features: ['Full license access', 'All plugins included', 'Maxon Cloud storage', 'Technical Support'], is_popular: true }
    ],
    key_capabilities: ['Digital Sculpting', 'High-poly Modeling', 'Texturing', 'Concept Design', '3D Printing Prep'],
    detailed_features: [
      {
        category: 'Sculpting Tech',
        items: [
          { name: 'Dynamesh (Real-time topology)', status: true },
          { name: 'ZRemesher (Auto Retopology)', status: true },
          { name: 'SubTool management', status: true },
          { name: 'Live Boolean', status: true }
        ]
      },
      {
        category: 'Artistic Tools',
        items: [
          { name: 'PolyPaint (Brush-based texturing)', status: true },
          { name: 'FiberMesh (Hair/Fur)', status: true },
          { name: 'NanoMesh (Instancing)', status: true },
          { name: 'Decimation Master (Optimization)', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'ZBrush'
  },
  'keyshot': {
    pricing_tiers: [
      { name: 'Pro (Annual)', price: '1,188', period: '/yr', features: ['Real-time Ray Tracing', 'HDRI Editor', 'Material Graph', 'Animation module'], is_popular: true }
    ],
    key_capabilities: ['Real-time Rendering', 'Product Visualization', 'Scientific Accuracy', 'Materials & Textures', 'VR Export'],
    detailed_features: [
      {
        category: 'Rendering',
        items: [
          { name: 'GPU & CPU Rendering', status: true },
          { name: 'Scientific Material library', status: true },
          { name: 'Caustics support', status: true },
          { name: 'Real-time Denoising', status: true }
        ]
      },
      {
        category: 'Workflow',
        items: [
          { name: 'Direct CAD Import', status: true },
          { name: 'Live Linking with CAD', status: true },
          { name: 'Configurator Wizard', status: true },
          { name: '3D Paint tools', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'KeyShot'
  },
  'lumion': {
    pricing_tiers: [
      { name: 'Standard', price: '749', period: '/yr', features: ['Core Library', 'Real-time rendering', 'Limited assets', 'Standard effects'], is_popular: false },
      { name: 'Pro', price: '1,499', period: '/yr', features: ['Full Object Library', 'Ray Tracing', 'Sound effects', 'Real Skies'], is_popular: true }
    ],
    key_capabilities: ['Architectural Rendering', 'Landscape Design', 'Cinematic Animation', 'LiveSync', 'Large Asset Library'],
    detailed_features: [
      {
        category: 'Visual Effects',
        items: [
          { name: 'Ray Tracing Effect', status: true },
          { name: 'Real Skies (HDR)', status: true },
          { name: 'Weather & Seasons', status: true },
          { name: 'Displacement Mapping', status: true }
        ]
      },
      {
        category: 'Library & Assets',
        items: [
          { name: '6000+ Object Library', status: true },
          { name: 'High-quality Foliage', status: true },
          { name: 'Animated Characters', status: true },
          { name: 'Sound environment', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'Lumion'
  },
  'enscape': {
    pricing_tiers: [
      { name: 'Floating License', price: '922', period: '/yr', features: ['Multi-machine use', 'Real-time Walkthrough', 'VR support', 'Asset library'], is_popular: true },
      { name: 'Fixed Seat', price: '538', period: '/yr', features: ['Single machine', 'Plugin-only', 'Full asset access', 'Technical support'], is_popular: false }
    ],
    key_capabilities: ['Real-time Walkthrough', 'VR Integration', 'Plugin Workflow', 'Collaborative Annotation', 'Orthographic Views'],
    detailed_features: [
      {
        category: 'Plugin Workflow',
        items: [
          { name: 'LiveSync for Revit/SketchUp', status: true },
          { name: 'BIM Data integration', status: true },
          { name: 'Asset Library (3000+)', status: true },
          { name: 'Site Context tool', status: true }
        ]
      },
      {
        category: 'Output',
        items: [
          { name: 'VR (Virtual Reality) mode', status: true },
          { name: 'Video Path Animation', status: true },
          { name: '360 Panorama export', status: true },
          { name: 'Web Standalone viewer', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'Enscape'
  },
  'twinmotion': {
    pricing_tiers: [
      { name: 'Free (Low Revenue)', price: '0', period: '/forever', features: ['Full Engine Power', 'Unlimited exports', 'Revenue < $1M only', 'Learning use'], is_popular: true },
      { name: 'Commercial Subscription', price: '445', period: '/yr', features: ['Cloud sharing', 'Unreal Engine export', 'High-res video', 'Priority support'], is_popular: false }
    ],
    key_capabilities: ['Real-time Visualization', 'Unreal Engine Core', 'Easy UI', 'Large Asset Library', 'Quixel Megascans'],
    detailed_features: [
      {
        category: 'Visual Power',
        items: [
          { name: 'Lumen Dynamic Lighting', status: true },
          { name: 'Quixel Megascans sync', status: true },
          { name: 'Path Tracer', status: true },
          { name: 'Auto-exposure/HDR', status: true }
        ]
      },
      {
        category: 'Workflow',
        items: [
          { name: 'Datasmith Direct Link', status: true },
          { name: 'One-click sync with Revit', status: true },
          { name: 'Point Cloud support', status: true },
          { name: 'VR Exploration', status: true }
        ]
      }
    ],
    category_id: 'c7',
    name: 'Twinmotion'
  },
  'onshape': {
    pricing_tiers: [
      { name: 'Professional', price: '2,500', period: '/yr', features: ['Cloud-native CAD', 'Built-in PDM', 'Real-time Collaboration', 'Advanced Surface'], is_popular: true },
      { name: 'Standard', price: '1,500', period: '/yr', features: ['Core Modeling', 'Team Management', 'Standard Parts', 'Mobile apps'], is_popular: false }
    ],
    key_capabilities: ['Cloud-Native CAD', 'Version Control', 'Agile Product Design', 'Part Studios', 'Integrated Analysis'],
    detailed_features: [
      {
        category: 'Cloud Platform',
        items: [
          { name: 'Full Version History', status: true },
          { name: 'Zero-install hardware', status: true },
          { name: 'Simultaneous Editing', status: true },
          { name: 'Built-in Release Mgmt', status: true }
        ]
      },
      {
        category: 'Design Tools',
        items: [
          { name: 'Parametric Part Studios', status: true },
          { name: 'FeatureScript Customization', status: true },
          { name: 'Integrated Simulation', status: true },
          { name: 'Multi-device support', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'Onshape'
  },
  'solid-edge': {
    pricing_tiers: [
      { name: 'Classic (Annual)', price: '2,500', period: '/yr', features: ['Synchronous Technology', 'Advanced Assemblies', 'Sheet Metal', 'Simulation'], is_popular: true },
      { name: 'Premium', price: '4,500', period: '/yr', features: ['Full Simulation', 'Generative Design', 'Electrical Routing', 'Additive Mfg'], is_popular: false }
    ],
    key_capabilities: ['Synchronous Technology', 'Large Assembly Mgmt', 'Sheet Metal Design', 'Generative Design', 'CAD/CAM/CAE'],
    detailed_features: [
      {
        category: 'Core Modeling',
        items: [
          { name: 'Synchronous Tech (Direct)', status: true },
          { name: 'Convergent Modeling', status: true },
          { name: 'Frame & Structure Design', status: true },
          { name: 'Advanced Rendering', status: true }
        ]
      },
      {
        category: 'Engineering',
        items: [
          { name: 'Integrated FEA Analysis', status: true },
          { name: 'Standard Parts Library', status: true },
          { name: 'Wiring & Pipe Design', status: true },
          { name: 'Teamcenter Integration', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'Solid Edge'
  },
  'zw3d': {
    pricing_tiers: [
      { name: 'Standard', price: '2,000', period: '/yr', features: ['3D Modeling', 'Assembly', 'Drafting', 'Data Exchange'], is_popular: true },
      { name: 'Professional', price: '3,500', period: '/yr', features: ['Mold Design', 'Electrode design', 'Reverse Engineering', 'Full Standard'], is_popular: false },
      { name: 'Premium', price: '4,500', period: '/yr', features: ['2-5 Axis CAM', 'Full Professional', 'Post-processing', 'Simulation'], is_popular: false }
    ],
    key_capabilities: ['CAD/CAM/CAE', 'Overdrive Engine', 'Mold Design', 'Surface Modeling', 'Hybrid Modeling'],
    detailed_features: [
      {
        category: 'Design Power',
        items: [
          { name: 'Hybrid Modeling (Solid/Surface)', status: true },
          { name: 'Direct Editing Tools', status: true },
          { name: 'PMI (Product Mfg Info)', status: true },
          { name: 'Flexible Component Library', status: true }
        ]
      },
      {
        category: 'Manufacturing',
        items: [
          { name: 'Automated Mold Design', status: true },
          { name: '2-5 Axis Milling CAM', status: true },
          { name: 'Toolpath Optimization', status: true },
          { name: 'Drilling & Turning', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'ZW3D'
  },
  'ironcad': {
    pricing_tiers: [
      { name: 'Annual', price: '1,500', period: '/yr', features: ['Drag & Drop Modeling', 'Unified Design Env', 'TriBall Tool', 'Full 3D Design'], is_popular: true }
    ],
    key_capabilities: ['Drag-and-Drop Design', 'TriBall Interaction', 'Unified Design Environment', 'Non-history Modeling', 'Large Assembly'],
    detailed_features: [
      {
        category: 'Efficiency',
        items: [
          { name: 'TriBall Versatile Tool', status: true },
          { name: 'Catalog-based Design', status: true },
          { name: 'Dual-engine (ACIS/Parasolid)', status: true },
          { name: 'Dynamic Handles', status: true }
        ]
      },
      {
        category: 'Workflow',
        items: [
          { name: 'Single-scene Assembly', status: true },
          { name: 'Direct Feature Editing', status: true },
          { name: 'Automatic BOM Update', status: true },
          { name: 'Sheet Metal & Frame', status: true }
        ]
      }
    ],
    category_id: 'c2',
    name: 'IronCAD'
  },
  'chief-architect': {
    pricing_tiers: [
      { name: 'Premier Monthly', price: '199', period: '/mo', features: ['Residential Design', 'Auto Roofs & Stairs', '3D Library', 'Support'], is_popular: true },
      { name: 'Premier Annual', price: '1,995', period: '/yr', features: ['Full Architectural Tools', 'Kitchen & Bath', 'Construction Docs', 'Priority support'], is_popular: false }
    ],
    key_capabilities: ['Residential Design', 'Automated Building Tools', 'Smart Objects', 'Interior Design', 'Photorealistic Rendering'],
    detailed_features: [
      {
        category: 'Building Tools',
        items: [
          { name: 'Automatic Roof Generation', status: true },
          { name: 'Smart Wall/Door/Window', status: true },
          { name: 'Cabinet Customization', status: true },
          { name: 'Material Painter', status: true }
        ]
      },
      {
        category: 'Construction',
        items: [
          { name: 'Automatic Framing', status: true },
          { name: 'Schedules & Materials List', status: true },
          { name: '3D Walkthrough export', status: true },
          { name: 'CAD-to-BIM workflow', status: true }
        ]
      }
    ],
    category_id: 'c3',
    name: 'Chief Architect'
  },
  'allplan': {
    pricing_tiers: [
      { name: 'Architecture', price: '2,800', period: '/yr', features: ['AEC BIM modeling', 'Reinforcement design', 'Visual scripting', 'Collaboration'], is_popular: true },
      { name: 'Engineering', price: '3,200', period: '/yr', features: ['Civil Engineering', 'Precast elements', 'Quantity takeoff', 'Bimplus integration'], is_popular: false }
    ],
    key_capabilities: ['Multi-disciplinary BIM', 'Reinforced Concrete Design', 'Visual Scripting', 'Precast Modeling', 'Cloud Collaboration'],
    detailed_features: [
      {
        category: 'Structural BIM',
        items: [
          { name: '3D Reinforcement detailing', status: true },
          { name: 'PythonPart technology', status: true },
          { name: 'Terrain modeling', status: true },
          { name: 'Bridge modeling (Allplan Bridge)', status: true }
        ]
      },
      {
        category: 'Architecture',
        items: [
          { name: 'High-end Rendering (Redshift)', status: true },
          { name: 'Attributed BIM models', status: true },
          { name: 'Automatic Floor Plans', status: true },
          { name: 'IFC4 Multi-disciplinary sync', status: true }
        ]
      }
    ],
    category_id: 'c3',
    name: 'Allplan'
  },
  'eplan-electric-p8': {
    pricing_tiers: [
      { name: 'Subscription', price: '3,500', period: '/yr', features: ['Electrical Design', 'Schematic Creation', 'Standard Parts Data', 'Cloud services'], is_popular: true }
    ],
    key_capabilities: ['Electrical CAE', 'Schematic Design', 'Panel Building', 'Fluid Power Design', 'Mechatronics Integration'],
    detailed_features: [
      {
        category: 'CAE Engineering',
        items: [
          { name: 'Automated Schematic Check', status: true },
          { name: 'EPLAN Data Portal access', status: true },
          { name: 'PLC Management', status: true },
          { name: 'Multi-user concurrent editing', status: true }
        ]
      },
      {
        category: 'Manufacturing',
        items: [
          { name: 'Smart Wiring support', status: true },
          { name: 'Automatic BOM & Wire lists', status: true },
          { name: 'Thermal Design integration', status: true },
          { name: '3D Panel Layout', status: true }
        ]
      }
    ],
    category_id: 'c4',
    name: 'EPLAN Electric P8'
  },
  'ansys-mechanical': {
    pricing_tiers: [
      { name: 'Premium (Annual)', price: '15,000', period: '/yr', features: ['Static Structural', 'Modal Analysis', 'Heat Transfer', 'HPC support'], is_popular: true }
    ],
    key_capabilities: ['FEA Simulation', 'Structural Analysis', 'Non-linear Dynamics', 'Composite Modeling', 'Optimization'],
    detailed_features: [
      {
        category: 'Physics',
        items: [
          { name: 'Linear/Non-linear Statics', status: true },
          { name: 'Explicit Dynamics', status: true },
          { name: 'Fatigue Analysis', status: true },
          { name: 'Vibration & Acoustics', status: true }
        ]
      },
      {
        category: 'Platform',
        items: [
          { name: 'Workbench workflow', status: true },
          { name: 'SpaceClaim Direct Modeler', status: true },
          { name: 'DesignXplorer (DOE)', status: true },
          { name: 'Python Scripting (PyAnsys)', status: true }
        ]
      }
    ],
    category_id: 'c5',
    name: 'ANSYS Mechanical'
  },
  'clo-3d': {
    pricing_tiers: [
      { name: 'Individual', price: '50', period: '/mo', features: ['Full 3D Design', 'Auto Grading', 'Fabric Library', 'Cloud storage'], is_popular: true },
      { name: 'Business', price: 'Custom', period: 'quote', features: ['Team collaboration', 'Asset management', 'Priority support'], is_popular: false }
    ],
    key_capabilities: ['3D Garment Design', 'Fabric Simulation', 'Virtual Fitting', 'Pattern Grading', 'Modular Design'],
    detailed_features: [
      { category: 'Simulation', items: [{ name: 'Real-time fabric drape', status: true }, { name: 'Stress/Strain map', status: true }] }
    ],
    category_id: 'c7',
    name: 'CLO 3D'
  },
  'matrixgold': {
    pricing_tiers: [{ name: 'Subscription', price: '1,200', period: '/yr', features: ['Parametric Jewelry Design', 'Render Studio', 'Gems library'], is_popular: true }],
    key_capabilities: ['Jewelry Design', 'Parametric Gem placement', 'Ring Builders', 'High-end Rendering'],
    detailed_features: [{ category: 'Jewelry', items: [{ name: 'Dynamic Rhino integration', status: true }] }],
    category_id: 'c7',
    name: 'MatrixGold'
  },
  'exocad': {
    pricing_tiers: [{ name: 'Flex License', price: '2,500', period: '/yr', features: ['DentalCAD Core', 'Virtual Articulator', 'Provisional module'], is_popular: true }],
    key_capabilities: ['Digital Dentistry', 'Crown & Bridge design', 'Implant Planning', '3D Scanning integration'],
    detailed_features: [{ category: 'Dental', items: [{ name: 'Open architecture support', status: true }] }],
    category_id: 'c7',
    name: 'exocad DentalCAD'
  },
  'msc-nastran': {
    pricing_tiers: [{ name: 'Annual', price: '12,000', period: '/yr', features: ['Advanced FEA', 'Structural Dynamics', 'Acoustics', 'High-performance computing'], is_popular: true }],
    key_capabilities: ['Structural Analysis', 'FEA Solver', 'Aeroelasticity', 'Optimization'],
    detailed_features: [{ category: 'Simulation', items: [{ name: 'Global industry standard solver', status: true }] }],
    category_id: 'c5',
    name: 'MSC Nastran'
  },
  'altair-hyperworks': {
    pricing_tiers: [{ name: 'Units Based', price: 'Custom', period: 'quote', features: ['Multi-physics access', 'Simulation-driven design', 'Cloud solving'], is_popular: true }],
    key_capabilities: ['Multi-physics Simulation', 'Optimization', 'Data Analytics', 'Electromagnetics'],
    detailed_features: [{ category: 'CAE', items: [{ name: 'HyperMesh modeling', status: true }] }],
    category_id: 'c5',
    name: 'Altair HyperWorks'
  },
  'chief-architect-pro': {
    pricing_tiers: [{ name: 'Premier', price: '1,995', period: '/yr', features: ['Professional AEC', 'Rendering', 'CAD Tools'], is_popular: true }],
    key_capabilities: ['Residential Design', '3D Visualization'],
    detailed_features: [{ category: 'AEC', items: [{ name: 'Smart Objects', status: true }] }],
    category_id: 'c3',
    name: 'Chief Architect Pro'
  },
  'ares-commander': {
    pricing_tiers: [{ name: 'Annual', price: '250', period: '/yr', features: ['Trinity Workflow', 'Cloud & Mobile', 'Full DWG'], is_popular: true }],
    key_capabilities: ['DWG Drafting', 'Cloud/Mobile CAD'],
    detailed_features: [{ category: 'CAD', items: [{ name: 'BIM-to-CAD features', status: true }] }],
    category_id: 'c1',
    name: 'ARES Commander'
  }
};

(async () => {
  console.log('=== Advanced Enrichment: Syncing and Appending Data ===');

  const src = fs.readFileSync(DATA_TS_PATH, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse(code) {
        return parser.parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'classProperties', 'decorators-legacy']
        });
      }
    }
  });

  const b = recast.types.builders;
  const processedSlugs = new Set();

  const makeArray = (arr = []) => b.arrayExpression(arr.map(v => b.stringLiteral(v)));
  const makePricing = (tiers = []) => b.arrayExpression(tiers.map(t => b.objectExpression([
    b.objectProperty(b.identifier('name'), b.stringLiteral(t.name)),
    b.objectProperty(b.identifier('price'), b.stringLiteral(t.price)),
    b.objectProperty(b.identifier('period'), b.stringLiteral(t.period)),
    b.objectProperty(b.identifier('features'), b.arrayExpression((t.features || []).map(f => b.stringLiteral(f)))),
    b.objectProperty(b.identifier('is_popular'), b.booleanLiteral(!!t.is_popular))
  ])));

  const makeDetailedFeatures = (features = []) => b.arrayExpression(features.map(f => b.objectExpression([
    b.objectProperty(b.identifier('category'), b.stringLiteral(f.category)),
    b.objectProperty(b.identifier('items'), b.arrayExpression((f.items || []).map(it => b.objectExpression([
      b.objectProperty(b.identifier('name'), b.stringLiteral(it.name)),
      b.objectProperty(b.identifier('status'), b.booleanLiteral(!!it.status))
    ]))))
  ])));

  // Update existing tools
  recast.types.visit(ast, {
    visitObjectExpression(path) {
      const getProp = name => path.node.properties.find(p => p.key && p.key.name === name);
      const slugProp = getProp('slug');
      if (slugProp && slugProp.value.type === 'StringLiteral') {
        const slug = slugProp.value.value;
        processedSlugs.add(slug);
        
        if (MANUAL_ENRICHMENT[slug]) {
          console.log(`Updating ${slug}...`);
          const data = MANUAL_ENRICHMENT[slug];
          
          const ensureProp = (name, valueNode) => {
            const existing = getProp(name);
            if (existing) existing.value = valueNode;
            else path.node.properties.push(b.objectProperty(b.identifier(name), valueNode));
          };

          // Remove old incorrect properties
          ['pricing_breakdown', 'key_capabilities'].forEach(name => {
            const idx = path.node.properties.findIndex(p => p.key && p.key.name === name);
            if (idx !== -1) path.node.properties.splice(idx, 1);
          });

          ensureProp('pricing_tiers', makePricing(data.pricing_tiers));
          ensureProp('core_features', makeArray(data.key_capabilities)); 
          ensureProp('detailed_features', makeDetailedFeatures(data.detailed_features));
        }
      }
      this.traverse(path);
    }
  });

  // Append missing tools
  recast.types.visit(ast, {
    visitVariableDeclaration(path) {
      const declarator = path.node.declarations[0];
      if (declarator && declarator.id.name === 'tools' && declarator.init.type === 'ArrayExpression') {
        const missingSlugs = Object.keys(MANUAL_ENRICHMENT).filter(slug => !processedSlugs.has(slug));
        
        missingSlugs.forEach(slug => {
          console.log(`Appending missing tool: ${slug}...`);
          const data = MANUAL_ENRICHMENT[slug];
          
          const newTool = b.objectExpression([
            b.objectProperty(b.identifier('id'), b.stringLiteral(`ext-${slug}`)),
            b.objectProperty(b.identifier('name'), b.stringLiteral(data.name || slug)),
            b.objectProperty(b.identifier('slug'), b.stringLiteral(slug)),
            b.objectProperty(b.identifier('logo_url'), b.callExpression(b.identifier('getLogo'), [b.stringLiteral(slug.substring(0, 2).toUpperCase())])),
            b.objectProperty(b.identifier('short_desc'), b.stringLiteral(`Professional solution for ${data.name || slug}.`)),
            b.objectProperty(b.identifier('description'), b.stringLiteral(`Detailed information about ${data.name || slug}.`)),
            b.objectProperty(b.identifier('pricing_tiers'), makePricing(data.pricing_tiers)),
            b.objectProperty(b.identifier('core_features'), makeArray(data.key_capabilities)),
            b.objectProperty(b.identifier('detailed_features'), makeDetailedFeatures(data.detailed_features)),
            b.objectProperty(b.identifier('category_id'), b.stringLiteral(data.category_id || 'c1')),
            b.objectProperty(b.identifier('pricing_type'), b.stringLiteral('Subscription')),
            b.objectProperty(b.identifier('starting_price'), b.numericLiteral(0)),
            b.objectProperty(b.identifier('platforms'), makeArray(['Windows'])),
            b.objectProperty(b.identifier('industries'), makeArray(['Engineering'])),
            b.objectProperty(b.identifier('user_scales'), makeArray(['Mid-Market', 'Enterprise'])),
            b.objectProperty(b.identifier('official_url'), b.stringLiteral('')),
            b.objectProperty(b.identifier('affiliate_url'), b.nullLiteral()),
            b.objectProperty(b.identifier('score'), b.numericLiteral(4.5)),
            b.objectProperty(b.identifier('pros'), makeArray([])),
            b.objectProperty(b.identifier('cons'), makeArray([])),
            b.objectProperty(b.identifier('faqs'), b.callExpression(b.identifier('genericFaqs'), [b.stringLiteral(data.name || slug)])),
            b.objectProperty(b.identifier('tech_specs'), b.objectExpression([
              b.objectProperty(b.identifier('engine'), b.stringLiteral('N/A')),
              b.objectProperty(b.identifier('multicore'), b.stringLiteral('N/A')),
              b.objectProperty(b.identifier('gpu_optimization'), b.stringLiteral('N/A')),
              b.objectProperty(b.identifier('standards'), makeArray([]))
            ])),
            b.objectProperty(b.identifier('expert_verdict'), b.stringLiteral('Professional choice for the industry.'))
          ]);
          
          declarator.init.elements.push(newTool);
        });
      }
      this.traverse(path);
    }
  });

  const output = recast.print(ast).code;
  let formatted = output;
  try {
    formatted = await prettier.format(output, { 
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 120
    });
  } catch (e) {
    console.error('Prettier failed:', e.message);
  }

  fs.writeFileSync(DATA_TS_PATH, formatted, 'utf8');
  console.log('✅ Advanced Fix and Enrichment complete.');
})();
