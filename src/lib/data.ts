export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type PricingType =
  | "Free"
  | "Open Source"
  | "Freemium"
  | "Subscription"
  | "Perpetual"
  | "Subscription / Perpetual";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  short_desc: string;
  description: string;
  category_id: string;
  pricing_type: PricingType;
  starting_price: number;
  platforms: string[];
  industries: string[];
  core_features: string[];
  user_scales: string[];
  official_url: string;
  affiliate_url: string | null;
  score: number;
  pros: string[];
  cons: string[];
  faqs: { q: string; a: string }[];
  tech_specs?: {
    engine: string; // Geometry Kernel (e.g. Parasolid, ACIS)
    multicore: string; // Multi-threading support level
    gpu_optimization: string; // GPU acceleration type
    standards: string[]; // Industry standards supported (e.g. IFC4, STEP)
  };
  expert_verdict?: string; // Professional expert verdict
  country?: string;
  pricing_tiers?: {
    name: string;
    price: string;
    period: string;
    features: string[];
    is_popular?: boolean;
  }[];
  detailed_features?: {
    category: string;
    items: { name: string; status: boolean }[];
  }[];
  alternatives?: string[]; // slugs of similar tools
  pricing_breakdown?: {
    tier: string;
    price: string;
    notes: string;
  }[];
  key_capabilities?: string[];

  // --- Extended product metadata (Phase 4) --------------------------------
  // All optional. Tools that have these populated render extra detail
  // sections (Compatibility, Trust & Support) and richer sidebar badges.
  // Tools without them fall back gracefully to the original layout.

  /** Latest stable version / release name (e.g. "2026", "v9.5"). */
  version?: string;
  /** ISO yyyy-mm-dd date when this listing was last hand-verified. */
  last_updated?: string;
  /** Free trial duration in days, or 0 for "no trial". */
  free_trial_days?: number;

  /** Interface / documentation languages supported. */
  languages?: string[];

  /** File formats the tool can import. */
  file_formats_in?: string[];
  /** File formats the tool can export / save to. */
  file_formats_out?: string[];

  /** Third-party systems this tool natively integrates with. */
  integrations?: string[];

  /** Deployment topologies offered. */
  deployment_options?: (
    | "Desktop"
    | "Cloud"
    | "On-Premise"
    | "Hybrid"
    | "Mobile"
    | "Web"
  )[];

  /** License kinds offered by the vendor. */
  license_types?: (
    | "Perpetual"
    | "Subscription"
    | "Educational"
    | "Commercial"
    | "Open-Source"
    | "Free"
    | "Network"
    | "Floating"
  )[];

  /** Marketing / product screenshots (used on the detail page gallery). */
  screenshots?: { url: string; alt: string; caption?: string }[];

  /**
   * Third-party review aggregator ratings. `score` is on the source's
   * own scale (G2: 0-5, Gartner: 0-5, Capterra: 0-5). `count` is the
   * total number of customer reviews backing the score.
   */
  external_ratings?: {
    source:
      | "G2"
      | "Capterra"
      | "TrustRadius"
      | "Gartner Peer Insights"
      | "Software Advice"
      | "GetApp";
    score: number;
    max: number;
    count: number;
    url?: string;
  }[];

  /** Support channels the vendor offers. */
  support_channels?: (
    | "Email"
    | "Phone"
    | "Chat"
    | "Community"
    | "Documentation"
    | "Training"
    | "Knowledge Base"
    | "Reseller Network"
  )[];

  /**
   * Security / compliance certifications the vendor publicly claims
   * (e.g. 'SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA', 'FedRAMP').
   */
  security_compliance?: string[];

  /** API / SDK availability for programmatic access and extensions. */
  api_sdk?: {
    has_api: boolean;
    has_sdk: boolean;
    /** Wire protocol if has_api. */
    api_type?: string;
    /** SDK language bindings if has_sdk. */
    sdk_languages?: string[];
    /** URL to public API docs. */
    docs_url?: string;
  };
}

export const categories: Category[] = [
  {
    id: "c1",
    name: "2D CAD",
    slug: "2d-cad",
    description: "Best 2D drafting and drawing software.",
  },
  {
    id: "c2",
    name: "3D Modeling",
    slug: "3d-modeling",
    description: "Top 3D modeling and design tools.",
  },
  {
    id: "c3",
    name: "BIM",
    slug: "bim",
    description: "Building Information Modeling software.",
  },
  {
    id: "c4",
    name: "Viewer",
    slug: "viewer",
    description: "CAD viewers and markup tools.",
  },
  {
    id: "c5",
    name: "CAE/CAM",
    slug: "cae-cam",
    description: "Advanced engineering and manufacturing tools.",
  },
  {
    id: "c6",
    name: "EDA",
    slug: "eda",
    description: "Electronics design automation.",
  },
  {
    id: "c7",
    name: "Specialized",
    slug: "specialized",
    description: "Vertical market CAD for specialized industries.",
  },
];

const getLogo = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff&size=200&bold=true&font-size=0.33`;

export const tools: Tool[] = [{
  id: "t1",
  name: "AutoCAD",
  slug: "autocad",
  logo_url: getLogo("AC"),
  short_desc:
    "The global industrial standard for 2D drafting and 3D modeling.",

  description:
    "AutoCAD is the industry-leading computer-aided design software developed by Autodesk. As the pioneer of the CAD industry, it defined the .DWG format standard and remains an essential foundation tool for AEC and manufacturing.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "255",
      period: "/mo",
      features: [
        "2D Drafting",
        "3D Modeling",
        "Specialized Toolsets",
        "AutoLisp Support",
      ],
      is_popular: false,
    },
    {
      name: "Annual",
      price: "2,030",
      period: "/yr",

      features: [
        "All Monthly features",
        "Web & Mobile Apps",
        "Smart Blocks",
        "Technical Support",
      ],

      is_popular: true,
    },
    {
      name: "3-Year",
      price: "6,090",
      period: "/3yr",
      features: [
        "Locked-in pricing",
        "All Pro features",
        "Enterprise Support",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Core Design",

      items: [
        {
          name: "2D Drafting & Annotation",
          status: true,
        },
        {
          name: "3D Modeling & Visualization",
          status: true,
        },
        {
          name: "Smart Blocks & AI Placement",
          status: true,
        },
        {
          name: "Floating Windows",
          status: true,
        },
      ],
    },
    {
      category: "Professional Workflow",

      items: [
        {
          name: "AutoLisp & API Support",
          status: true,
        },
        {
          name: "Activity Insights",
          status: true,
        },
        {
          name: "Markup Import & Assist",
          status: true,
        },
        {
          name: "Cloud Collaboration",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["bricscad", "nanocad", "draftsight"],
  country: "USA",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 255,
  platforms: ["Windows", "macOS", "Web"],
  industries: ["Architecture", "Engineering", "Manufacturing"],
  core_features: [
    "2D Drafting",
    "3D Modeling",
    "AutoLisp",
    "Sheet Sets",
    "Cloud Storage",
  ],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.autodesk.com/products/autocad",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Unmatched compatibility",
    "Vast plugin ecosystem",
    "High precision",
  ],
  cons: ["Expensive", "Non-parametric 3D", "Single-core modeling"],
  faqs: [
    {
      q: "What is AutoCAD used for?",
      a: "The global industrial standard for 2D drafting and 3D modeling. AutoCAD is a 2D CAD solution widely adopted in Architecture, Engineering, Manufacturing.",
    },
    {
      q: "How much does AutoCAD cost?",
      a: "AutoCAD starts at $255 per seat on a subscription and network license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does AutoCAD offer a free trial?",
      a: "Yes — AutoCAD ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does AutoCAD support?",
      a: "AutoCAD runs on Windows, macOS, and Web. Deployment options include desktop, cloud, web.",
    },
    {
      q: "Which file formats does AutoCAD support?",
      a: "AutoCAD imports DWG, DXF, DWF, DGN, STEP, IGES and more. Export covers DWG, DXF, DWF, PDF, STL, IGES and more.",
    },
    {
      q: "Does AutoCAD have an API for automation and customization?",
      a: "Yes. AutoCAD exposes AutoLISP / ObjectARX / .NET / VBA with SDK bindings for C++, C#, .NET, LISP. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Autodesk ShapeManager (ASM)",
    multicore: "Limited",
    gpu_optimization: "DirectX 11/12",
    standards: ["DWG", "DXF", "DGN", "STEP", "PDF"],
  },

  expert_verdict:
    "AutoCAD remains the definitive answer for global 2D drafting. Irreplaceable for firms reliant on the DWG format.",

  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Czech",
    "Hungarian",
    "Polish",
    "Portuguese",
    "Russian",
  ],

  file_formats_in: [
    "DWG",
    "DXF",
    "DWF",
    "DGN",
    "STEP",
    "IGES",
    "IFC",
    "PDF",
    "STL",
    "3DS",
    "FBX",
    "Rhino",
    "IPT",
  ],

  file_formats_out: [
    "DWG",
    "DXF",
    "DWF",
    "PDF",
    "STL",
    "IGES",
    "STEP",
    "FBX",
    "JPG",
    "PNG",
    "BMP",
    "TIF",
  ],

  integrations: [
    "Autodesk Drive",
    "Autodesk Docs",
    "BIM 360",
    "Construction Cloud",
    "Microsoft 365",
    "Box",
    "Dropbox",
    "Adobe PDF",
  ],

  deployment_options: ["Desktop", "Cloud", "Web", "Mobile"],
  license_types: ["Subscription", "Network", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.5,
      max: 5,
      count: 3600,
      url: "https://www.g2.com/products/autocad/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 3200,
      url: "https://www.capterra.com/p/175030/AutoCAD/",
    },
    {
      source: "TrustRadius",
      score: 8.7,
      max: 10,
      count: 1500,
      url: "https://www.trustradius.com/products/autodesk-autocad/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
    "Knowledge Base",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR", "CCPA"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "AutoLISP / ObjectARX / .NET / VBA",
    sdk_languages: ["C++", "C#", ".NET", "LISP", "JavaScript"],
    docs_url: "https://aps.autodesk.com/developer/overview/autocad",
  },
}, {
  id: "t2",
  name: "SolidWorks",
  slug: "solidworks",
  logo_url: getLogo("SW"),
  short_desc:
    "The de-facto industry standard for 3D parametric mechanical design.",

  description:
    "SolidWorks is the flagship mechanical design software from Dassault Systèmes. It is renowned for its robust parametric feature-based modeling and ease of use.",

  pricing_tiers: [
    {
      name: "Term (Annual)",
      price: "2,700",
      period: "/yr",

      features: [
        "Full 3D Design",
        "Standard Library",
        "Sustainability tools",
        "Cloud Services",
      ],

      is_popular: true,
    },
    {
      name: "Perpetual",
      price: "3,995",
      period: "one-time",
      features: [
        "Owned license",
        "Add-on required for Cloud",
        "Maintenance extra",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Mechanical Design",

      items: [
        {
          name: "Parametric 3D Modeling",
          status: true,
        },
        {
          name: "Advanced Assemblies",
          status: true,
        },
        {
          name: "Sheet Metal Design",
          status: true,
        },
        {
          name: "Mold Design Tools",
          status: true,
        },
      ],
    },
    {
      category: "Analysis & PLM",

      items: [
        {
          name: "Integrated Simulation (FEA)",
          status: true,
        },
        {
          name: "PDM Data Management",
          status: true,
        },
        {
          name: "Automatic BOM Generation",
          status: true,
        },
        {
          name: "3DEXPERIENCE Integration",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["autodesk-inventor", "onshape", "ptc-creo"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 1295,
  platforms: ["Windows"],
  industries: ["Mechanical", "Manufacturing", "Automotive"],
  core_features: [
    "Parametric 3D",
    "Assemblies",
    "Simulation",
    "Sheet Metal",
    "PDM Support",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.solidworks.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Intuitive workflow",
    "Superior Parasolid stability",
    "Unmatched ecosystem",
  ],
  cons: ["Windows only", "Hardware hungry", "Legacy API"],
  faqs: [
    {
      q: "What is SolidWorks used for?",
      a: "The de-facto industry standard for 3D parametric mechanical design. SolidWorks is a 3D modeling solution widely adopted in Mechanical, Manufacturing, Automotive.",
    },
    {
      q: "How much does SolidWorks cost?",
      a: "SolidWorks starts at $1,295 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does SolidWorks offer a free trial?",
      a: "Yes — SolidWorks ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does SolidWorks support?",
      a: "SolidWorks runs on Windows. Deployment options include desktop, cloud.",
    },
    {
      q: "Which file formats does SolidWorks support?",
      a: "SolidWorks imports SLDPRT, SLDASM, SLDDRW, STEP, IGES, Parasolid and more. Export covers SLDPRT, STEP, IGES, Parasolid, STL, 3DXML and more.",
    },
    {
      q: "Does SolidWorks have an API for automation and customization?",
      a: "Yes. SolidWorks exposes COM-based API with SDK bindings for C++, C#, VBA, .NET. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Siemens Parasolid",
    multicore: "Low",
    gpu_optimization: "OpenGL",
    standards: ["SLDPRT", "STEP", "IGES", "IFC"],
  },

  expert_verdict:
    "If you are in mechanical design, SolidWorks is the most reliable choice.",
  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Russian",
    "Polish",
    "Czech",
    "Turkish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "SLDPRT",
    "SLDASM",
    "SLDDRW",
    "STEP",
    "IGES",
    "Parasolid",
    "ACIS",
    "STL",
    "DWG",
    "DXF",
    "CATIA",
    "Pro/E",
    "Inventor",
    "NX",
    "JT",
  ],

  file_formats_out: [
    "SLDPRT",
    "STEP",
    "IGES",
    "Parasolid",
    "STL",
    "3DXML",
    "eDrawings",
    "PDF",
    "DWG",
    "DXF",
    "JT",
    "OBJ",
    "VRML",
  ],

  integrations: [
    "3DEXPERIENCE",
    "SolidWorks PDM",
    "SolidWorks Composer",
    "CAMWorks",
    "eDrawings",
    "Visualize",
    "Excel",
    "Microsoft 365",
  ],

  deployment_options: ["Desktop", "Cloud"],
  license_types: ["Subscription", "Perpetual", "Network", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 1500,
      url: "https://www.g2.com/products/solidworks/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 1100,
      url: "https://www.capterra.com/p/119921/SOLIDWORKS/",
    },
    {
      source: "TrustRadius",
      score: 8.8,
      max: 10,
      count: 950,
      url: "https://www.trustradius.com/products/solidworks/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "COM-based API",
    sdk_languages: ["C++", "C#", "VBA", ".NET"],
    docs_url:
      "https://help.solidworks.com/2026/english/api/sldworksapiprogguide/welcome.htm",
  },
}, {
  id: "t3",
  name: "SketchUp",
  slug: "sketchup",
  logo_url: getLogo("SU"),
  short_desc:
    "The world's most intuitive 3D design tool for architecture and interiors.",

  description:
    "SketchUp is famous for its unique 'Push/Pull' modeling logic, perfect for conceptual design and visualization.",

  pricing_tiers: [
    {
      name: "Go",
      price: "119",
      period: "/yr",
      features: ["Web Modeler", "iPad support", "Unlimited cloud storage"],
    },
    {
      name: "Pro",
      price: "349",
      period: "/yr",
      features: ["Desktop Modeler", "LayOut 2D", "Style Builder"],
      is_popular: true,
    },
    {
      name: "Studio",
      price: "749",
      period: "/yr",
      features: ["V-Ray Rendering", "Scan Data import", "Revit Importer"],
    },
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "V-Ray Integration (Studio Tier)", status: true },
        { name: "Point Cloud Modeling (Scan Essentials)", status: true },
        { name: "Direct Revit File Import", status: true },
        { name: "Sefaira for Energy & Carbon Analysis", status: true },
        { name: "Advanced Solid Tools for 3D Printing", status: true },
      ],
    },
  ],

  alternatives: ["rhino-3d", "revit", "archicad"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Freemium",
  starting_price: 119,
  platforms: ["Windows", "macOS", "Web"],
  industries: ["Architecture", "Interior Design", "Landscape"],
  core_features: [
    "Push/Pull Modeling",
    "3D Warehouse Library",
    "LayOut Module",
  ],
  user_scales: ["Individuals", "Small Business"],
  official_url: "https://www.sketchup.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Low learning curve",
    "Millions of models",
    "Great rendering support",
  ],
  cons: ["Large scene slowdown", "Weak curves", "Sluggish documentation"],
  faqs: [
    {
      q: "What is SketchUp used for?",
      a: "The world's most intuitive 3D design tool for architecture and interiors. SketchUp is a 3D modeling solution widely adopted in Architecture, Interior Design, Landscape.",
    },
    {
      q: "How much does SketchUp cost?",
      a: "SketchUp starts at $119 per seat on a subscription and free license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does SketchUp offer a free trial?",
      a: "Yes — SketchUp ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does SketchUp support?",
      a: "SketchUp runs on Windows, macOS, and Web. Deployment options include desktop, web, cloud.",
    },
    {
      q: "Which file formats does SketchUp support?",
      a: "SketchUp imports SKP, DWG, DXF, 3DS, STL, KMZ and more. Export covers SKP, DWG, DXF, 3DS, STL, KMZ and more.",
    },
    {
      q: "Does SketchUp have an API for automation and customization?",
      a: "Yes. SketchUp exposes Ruby API / SketchUp SDK with SDK bindings for Ruby, C++. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Trimble Proprietary",
    multicore: "Very Low",
    gpu_optimization: "OpenGL",
    standards: ["SKP", "DWG", "IFC", "STL"],
  },

  expert_verdict:
    "SketchUp is the digital 'sketchpad' for design. Unmatched for speed and inspiration.",

  pricing_breakdown: [
    {
      tier: "Go",
      price: "$129/yr",
      notes: "iPad & Web only",
    },
    {
      tier: "Pro",
      price: "$349/yr",
      notes: "Desktop + LayOut (Most popular)",
    },
    {
      tier: "Studio",
      price: "$749/yr",
      notes: "Includes V-Ray & Scan Essentials",
    },
  ],

  key_capabilities: [
    "Intuitive 3D Concept Modeling",
    "2D Documentation with LayOut",
    "3D Warehouse (Millions of free models)",
    "Extension Warehouse (1000+ plugins)",
    "Cloud Collaboration via Trimble Connect",
  ],

  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Russian",
    "Dutch",
    "Polish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "SKP",
    "DWG",
    "DXF",
    "3DS",
    "STL",
    "KMZ",
    "COLLADA",
    "IFC",
    "IFCZIP",
    "OBJ",
    "PNG",
    "JPG",
  ],

  file_formats_out: [
    "SKP",
    "DWG",
    "DXF",
    "3DS",
    "STL",
    "KMZ",
    "COLLADA",
    "IFC",
    "OBJ",
    "FBX",
    "XSI",
    "WRL",
    "PDF",
    "PNG",
    "JPG",
  ],

  integrations: [
    "Trimble Connect",
    "3D Warehouse",
    "Extension Warehouse",
    "Sefaira",
    "LayOut",
    "V-Ray",
    "Enscape",
    "Twinmotion",
    "Lumion",
  ],

  deployment_options: ["Desktop", "Web", "Cloud", "Mobile"],
  license_types: ["Subscription", "Free", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.5,
      max: 5,
      count: 1700,
      url: "https://www.g2.com/products/sketchup/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 1100,
      url: "https://www.capterra.com/p/187433/SketchUp/",
    },
    {
      source: "TrustRadius",
      score: 8.8,
      max: 10,
      count: 450,
      url: "https://www.trustradius.com/products/sketchup/reviews",
    },
  ],

  support_channels: [
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "GDPR", "ISO 27001"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Ruby API / SketchUp SDK",
    sdk_languages: ["Ruby", "C++"],
    docs_url: "https://ruby.sketchup.com/",
  },
}, {
  id: "t4",
  name: "Revit",
  slug: "revit",
  logo_url: getLogo("RV"),
  short_desc:
    "The de-facto standard for Building Information Modeling (BIM).",

  description:
    "Revit is Autodesk's flagship software built specifically for BIM, allowing architects and engineers to collaborate in a unified model.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "355",
      period: "/mo",
      features: ["Full BIM features", "Worksharing", "Cloud access"],
    },
    {
      name: "Annual",
      price: "2830",
      period: "/yr",
      features: ["Save 33%", "Multi-user collaboration", "Priority Support"],
      is_popular: true,
    },
    {
      name: "3-Year",
      price: "8490",
      period: "/3yr",
      features: ["Enterprise scale", "Price protection", "Flex licensing"],
    },
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "Toposolid: Advanced terrain modeling tools", status: true },
        { name: "Accelerated Graphics (Tech Preview)", status: true },
        { name: "Automated Sheet Placement", status: true },
        { name: "MEP Fabrication Modeling enhancements", status: true },
        { name: "Native IFC Support & Interoperability", status: true },
      ],
    },
  ],

  alternatives: ["archicad", "vectorworks", "allplan"],
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 355,
  platforms: ["Windows"],
  industries: ["AEC", "Construction", "Structural Engineering"],
  core_features: [
    "Lifecycle BIM Management",
    "Parametric Families",
    "Cloud Worksharing",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.autodesk.com/products/revit",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Powerful collaboration",
    "Data-geometry integration",
    "High market demand",
  ],
  cons: [
    "Windows only",
    "Steep learning curve",
    "High hardware requirements",
  ],
  faqs: [
    {
      q: "What is Revit used for?",
      a: "The de-facto standard for Building Information Modeling (BIM). Revit is a BIM solution widely adopted in AEC, Construction, Structural Engineering.",
    },
    {
      q: "How much does Revit cost?",
      a: "Revit starts at $355 per seat on a subscription and network license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Revit offer a free trial?",
      a: "Yes — Revit ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Revit support?",
      a: "Revit runs on Windows. Deployment options include desktop, cloud.",
    },
    {
      q: "Which file formats does Revit support?",
      a: "Revit imports RVT, RFA, RTE, IFC, DWG, DXF and more. Export covers RVT, IFC, DWG, DXF, DGN, NWC and more.",
    },
    {
      q: "Does Revit have an API for automation and customization?",
      a: "Yes. Revit exposes .NET API with SDK bindings for C#, VB.NET. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Autodesk ShapeManager (ASM)",
    multicore: "Medium",
    gpu_optimization: "DirectX 11",
    standards: ["RVT", "IFC", "DWG", "NWD"],
  },

  expert_verdict:
    "Revit is the undisputed king of BIM in North America. Essential for modern architecture.",

  pricing_breakdown: [
    {
      tier: "Monthly",
      price: "$290/mo",
      notes: "Flexible BIM access",
    },
    {
      tier: "Annual",
      price: "$2,310/yr",
      notes: "Professional BIM standard",
    },
    {
      tier: "AEC Collection",
      price: "$2,825/yr",
      notes: "Bundle with AutoCAD, Civil 3D, etc.",
    },
  ],

  key_capabilities: [
    "Parametric 3D BIM Modeling",
    "Automated Construction Documentation",
    "Multi-disciplinary Coordination (MEP, Structural, Arch)",
    "Cloud Collaboration with BIM Collaborate Pro",
    "Parametric Family Creation",
  ],

  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Russian",
    "Polish",
    "Czech",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "RVT",
    "RFA",
    "RTE",
    "IFC",
    "DWG",
    "DXF",
    "DGN",
    "SAT",
    "SKP",
    "OBJ",
    "3DM",
    "NWD",
  ],

  file_formats_out: [
    "RVT",
    "IFC",
    "DWG",
    "DXF",
    "DGN",
    "NWC",
    "FBX",
    "PDF",
    "gbXML",
    "ODX",
  ],

  integrations: [
    "BIM 360",
    "Autodesk Construction Cloud",
    "Navisworks",
    "AutoCAD",
    "3ds Max",
    "Dynamo",
    "Robot Structural Analysis",
    "Enscape",
    "Twinmotion",
  ],

  deployment_options: ["Desktop", "Cloud"],
  license_types: ["Subscription", "Network", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 740,
      url: "https://www.g2.com/products/revit/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 530,
      url: "https://www.capterra.com/p/187420/Revit/",
    },
    {
      source: "TrustRadius",
      score: 8.5,
      max: 10,
      count: 420,
      url: "https://www.trustradius.com/products/autodesk-revit/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: ".NET API",
    sdk_languages: ["C#", "VB.NET"],
    docs_url:
      "https://www.autodesk.com/developer-network/platform-technologies/revit",
  },
}, {
  id: "t5",
  name: "Fusion 360",
  slug: "fusion-360",
  logo_url: getLogo("F3"),
  short_desc: "The cloud-native powerhouse for integrated CAD, CAM, and CAE.",

  description:
    "Fusion 360 is a cloud-based platform that breaks down the silos between design and production.",

  pricing_tiers: [
    {
      name: "Fusion (Standard)",
      price: "57",
      period: "/mo",

      features: [
        "3D Design & Modeling",
        "Basic CAM (2.5 & 3-axis)",
        "PCB Design",
        "Team Collaboration",
      ],

      is_popular: true,
    },
    {
      name: "For Manufacturing",
      price: "128",
      period: "/mo",

      features: [
        "All Standard features",
        "Advanced Machining (4 & 5-axis)",
        "Nesting & Fabrication",
        "Steep & Shallow finishing",
      ],

      is_popular: false,
    },
    {
      name: "For Design",
      price: "137",
      period: "/mo",

      features: [
        "All Standard features",
        "Generative Design",
        "Advanced Simulation",
        "Complex Surfacing",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Unified Platform",

      items: [
        {
          name: "Integrated CAD/CAM/CAE",
          status: true,
        },
        {
          name: "Cloud-native Data Management",
          status: true,
        },
        {
          name: "Direct & Parametric Modeling",
          status: true,
        },
        {
          name: "Unified Electronics Design",
          status: true,
        },
      ],
    },
    {
      category: "Advanced Tech",

      items: [
        {
          name: "AI-powered Generative Design",
          status: true,
        },
        {
          name: "Thermal & Stress Analysis",
          status: true,
        },
        {
          name: "Additive Manufacturing support",
          status: true,
        },
        {
          name: "Photorealistic Rendering",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["solidworks", "onshape", "shapr3d"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 85,
  platforms: ["Windows", "macOS"],
  industries: ["Industrial Design", "Electronics", "Prototyping"],

  core_features: [
    "Cloud CAD/CAM",
    "Generative Design",
    "Integrated PCB",
    "Simulation",
    "Collaboration",
  ],

  user_scales: ["Small Business", "Startups", "Individuals"],
  official_url: "https://www.autodesk.com/fusion-360",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Seamless cloud sync",
    "Exceptional CAM value",
    "Native Apple Silicon",
  ],
  cons: ["Cloud dependency", "Subscription only", "Learning curve"],
  faqs: [
    {
      q: "What is Fusion 360 used for?",
      a: "The cloud-native powerhouse for integrated CAD, CAM, and CAE. Fusion 360 is a 3D modeling solution widely adopted in Industrial Design, Electronics, Prototyping.",
    },
    {
      q: "How much does Fusion 360 cost?",
      a: "Fusion 360 starts at $85 per seat on a subscription and free license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Fusion 360 offer a free trial?",
      a: "Yes — Fusion 360 ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Fusion 360 support?",
      a: "Fusion 360 runs on Windows and macOS. Deployment options include desktop, cloud, web.",
    },
    {
      q: "Which file formats does Fusion 360 support?",
      a: "Fusion 360 imports F3D, STEP, IGES, SAT, STL, DWG and more. Export covers F3D, STEP, IGES, SAT, STL, DWG and more.",
    },
    {
      q: "Does Fusion 360 have an API for automation and customization?",
      a: "Yes. Fusion 360 exposes Fusion API with SDK bindings for Python, C++. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Autodesk ShapeManager (ASM)",
    multicore: "Moderate",
    gpu_optimization: "DirectX / Metal",
    standards: ["F3D", "STEP", "STL", "DXF"],
  },

  expert_verdict: "Fusion 360 is the future of agile hardware design.",
  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Czech",
    "Hungarian",
    "Polish",
    "Portuguese",
    "Russian",
  ],

  file_formats_in: [
    "F3D",
    "STEP",
    "IGES",
    "SAT",
    "STL",
    "DWG",
    "DXF",
    "OBJ",
    "SLDPRT",
    "IPT",
    "IAM",
    "CATPart",
    "PRT",
    "3DM",
    "X_T",
    "X_B",
  ],

  file_formats_out: [
    "F3D",
    "STEP",
    "IGES",
    "SAT",
    "STL",
    "DWG",
    "DXF",
    "OBJ",
    "FBX",
    "3MF",
    "USD",
    "IPT",
  ],

  integrations: [
    "Fusion Manage",
    "Autodesk Drive",
    "Autodesk Docs",
    "Slack",
    "Microsoft Teams",
    "GitHub",
    "Markforged",
    "Formlabs",
    "Carbide",
  ],

  deployment_options: ["Desktop", "Cloud", "Web", "Mobile"],
  license_types: ["Subscription", "Free", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.6,
      max: 5,
      count: 1300,
      url: "https://www.g2.com/products/fusion-360/reviews",
    },
    {
      source: "Capterra",
      score: 4.5,
      max: 5,
      count: 850,
      url: "https://www.capterra.com/p/166080/Autodesk-Fusion-360/",
    },
    {
      source: "TrustRadius",
      score: 8.6,
      max: 10,
      count: 410,
      url: "https://www.trustradius.com/products/autodesk-fusion-360/reviews",
    },
  ],

  support_channels: [
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
    "Knowledge Base",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Fusion API",
    sdk_languages: ["Python", "C++"],
    docs_url:
      "https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A",
  },
}, {
  id: "t6",
  name: "Rhino 3D",
  slug: "rhino-3d",
  logo_url: getLogo("RH"),
  short_desc:
    "The industry standard for complex NURBS modeling and computational design.",

  description:
    "Rhino (Rhinoceros) is a versatile 3D modeler with deep integration with Grasshopper for generative design.",

  pricing_tiers: [
    {
      name: "Commercial (V8)",
      price: "995",
      period: "one-time",

      features: [
        "Full NURBS Modeling",
        "Grasshopper included",
        "SubD Modeling",
        "Permanent License",
      ],

      is_popular: true,
    },
    {
      name: "Upgrade from V7",
      price: "595",
      period: "one-time",
      features: [
        "Update existing license",
        "Latest V8 features",
        "New render engine",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Surface Modeling",

      items: [
        {
          name: "Complex NURBS surfaces",
          status: true,
        },
        {
          name: "SubD (Subdivision) tools",
          status: true,
        },
        {
          name: "Point Cloud processing",
          status: true,
        },
        {
          name: "Mesh repair & editing",
          status: true,
        },
      ],
    },
    {
      category: "Algorithm Design",

      items: [
        {
          name: "Grasshopper Integration",
          status: true,
        },
        {
          name: "Kangaroo Physics engine",
          status: true,
        },
        {
          name: "Python/C# Scripting",
          status: true,
        },
        {
          name: "Cycles Rendering",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["sketchup", "maya", "blender"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Perpetual",
  starting_price: 995,
  platforms: ["Windows", "macOS"],
  industries: ["Architecture", "Industrial Design", "Jewelry"],

  core_features: [
    "Free-form NURBS",
    "Grasshopper Visual Coding",
    "SubD Surfaces",
    "Render Integration",
    "Rhino.Inside.Revit",
  ],

  user_scales: ["Mid-Market", "Individuals"],
  official_url: "https://www.rhino3d.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Best-in-class surfacing",
    "No subscription fees",
    "Vibrant community",
  ],
  cons: ["Lacks native parametric history", "Basic 2D", "High hardware reqs"],
  faqs: [
    {
      q: "What is Rhino 3D used for?",
      a: "The industry standard for complex NURBS modeling and computational design. Rhino 3D is a 3D modeling solution widely adopted in Architecture, Industrial Design, Jewelry.",
    },
    {
      q: "How much does Rhino 3D cost?",
      a: "Rhino 3D starts at $995 per seat on a perpetual and educational license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Rhino 3D offer a free trial?",
      a: "Yes — Rhino 3D ships with a 90-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Rhino 3D support?",
      a: "Rhino 3D runs on Windows and macOS. Deployment options include desktop.",
    },
    {
      q: "Which file formats does Rhino 3D support?",
      a: "Rhino 3D imports 3DM, STEP, IGES, SAT, STL, DWG and more. Export covers 3DM, STEP, IGES, STL, DWG, DXF and more.",
    },
    {
      q: "Does Rhino 3D have an API for automation and customization?",
      a: "Yes. Rhino 3D exposes RhinoCommon / openNURBS with SDK bindings for C#, Python, C++, VB.NET. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "OpenNURBS",
    multicore: "Low",
    gpu_optimization: "OpenGL",
    standards: ["3DM", "STEP", "IGES", "OBJ"],
  },

  expert_verdict:
    "If your designs involve complex curves or algorithmic logic, Rhino is the undisputed king.",

  version: "8",
  last_updated: "2025-11-15",
  free_trial_days: 90,

  languages: [
    "English",
    "Czech",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Polish",
    "Portuguese",
    "Russian",
    "Spanish",
    "Simplified Chinese",
    "Traditional Chinese",
  ],

  file_formats_in: [
    "3DM",
    "STEP",
    "IGES",
    "SAT",
    "STL",
    "DWG",
    "DXF",
    "OBJ",
    "FBX",
    "3DS",
    "AI",
    "PDF",
    "SKP",
    "X_T",
    "X_B",
  ],

  file_formats_out: [
    "3DM",
    "STEP",
    "IGES",
    "STL",
    "DWG",
    "DXF",
    "OBJ",
    "FBX",
    "3DS",
    "PDF",
    "AI",
    "KMZ",
    "GLB",
    "USDZ",
    "X_T",
  ],

  integrations: [
    "Grasshopper",
    "V-Ray",
    "Enscape",
    "KeyShot",
    "Twinmotion",
    "Lumion",
    "Revit (Rhino.Inside)",
    "Unreal Engine",
    "Unity",
  ],

  deployment_options: ["Desktop"],
  license_types: ["Perpetual", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.6,
      max: 5,
      count: 350,
      url: "https://www.g2.com/products/rhinoceros/reviews",
    },
    {
      source: "Capterra",
      score: 4.7,
      max: 5,
      count: 180,
      url: "https://www.capterra.com/p/175026/Rhinoceros/",
    },
    {
      source: "TrustRadius",
      score: 8.8,
      max: 10,
      count: 140,
      url: "https://www.trustradius.com/products/rhinoceros-3d/reviews",
    },
  ],

  support_channels: ["Email", "Community", "Documentation", "Training"],
  security_compliance: ["GDPR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "RhinoCommon / openNURBS",
    sdk_languages: ["C#", "Python", "C++", "VB.NET"],
    docs_url: "https://developer.rhino3d.com/",
  },
}, {
  id: "t7",
  name: "CATIA",
  slug: "catia",
  logo_url: getLogo("CT"),
  short_desc:
    "The high-end PLM standard for Aerospace and Automotive engineering.",

  description:
    "CATIA is the flagship PLM suite from Dassault Systèmes, capable of managing entire aircraft assemblies.",

  pricing_tiers: [
    {
      name: "3DEXPERIENCE Cloud",
      price: "2,700",
      period: "/yr",

      features: [
        "Social Collaboration",
        "3D Dashboard",
        "Base Part/Assembly Design",
        "Version Control",
      ],

      is_popular: true,
    },
    {
      name: "Mechanical Engineer",
      price: "4,500",
      period: "/yr",

      features: [
        "Advanced Surfacing",
        "Sheet Metal Design",
        "Mechanism Simulation",
        "Standard Catalogs",
      ],

      is_popular: false,
    },
    {
      name: "Systems Engineer",
      price: "Custom",
      period: "quote",

      features: [
        "Model-based Systems (MBSE)",
        "Electric/Electronic Systems",
        "Lifecycle Analysis",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "High-end Engineering",

      items: [
        {
          name: "Generative Shape Design (GSD)",
          status: true,
        },
        {
          name: "Complex Assembly Management",
          status: true,
        },
        {
          name: "Composite Part Design",
          status: true,
        },
        {
          name: "Additive Manufacturing optimization",
          status: true,
        },
      ],
    },
    {
      category: "Industry Verticals",

      items: [
        {
          name: "Aerospace Structures design",
          status: true,
        },
        {
          name: "Automotive Class-A Surfacing",
          status: true,
        },
        {
          name: "Systems Engineering (SysML)",
          status: true,
        },
        {
          name: "Digital Mock-up (DMU)",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["siemens-nx", "ptc-creo", "solidworks"],
  country: "France",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 4500,
  platforms: ["Windows"],
  industries: ["Aerospace", "Automotive", "Shipbuilding"],

  core_features: [
    "High-end Surfacing",
    "Aero & Auto Design",
    "Systems Engineering",
    "Digital Twin",
    "Cloud PLM",
  ],

  user_scales: ["Enterprise"],
  official_url: "https://www.3ds.com/products-services/catia/",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Complex assembly handling",
    "Superior surfacing",
    "Deep PLM integration",
  ],
  cons: [
    "Prohibitively expensive",
    "Steep learning curve",
    "Extreme hardware reqs",
  ],
  faqs: [
    {
      q: "What is CATIA used for?",
      a: "The high-end PLM standard for Aerospace and Automotive engineering. CATIA is a 3D modeling solution widely adopted in Aerospace, Automotive, Shipbuilding.",
    },
    {
      q: "How much does CATIA cost?",
      a: "CATIA starts at $4,500 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does CATIA offer a free trial?",
      a: "CATIA does not currently advertise a public time-boxed trial. The vendor typically arranges evaluation access on request through reseller partners.",
    },
    {
      q: "What operating systems does CATIA support?",
      a: "CATIA runs on Windows. Deployment options include desktop, cloud, on-premise.",
    },
    {
      q: "Which file formats does CATIA support?",
      a: "CATIA imports CATPart, CATProduct, CATDrawing, STEP, IGES, 3DXML and more. Export covers CATPart, CATProduct, STEP, IGES, 3DXML, STL and more.",
    },
    {
      q: "Does CATIA have an API for automation and customization?",
      a: "Yes. CATIA exposes CAA / 3DEXPERIENCE API with SDK bindings for C++, C#, Java, VBScript. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "CGM (Convergence Geometric Modeler)",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["CATPart", "STEP", "IGES", "VDA-FS"],
  },

  expert_verdict: "CATIA isn't just software; it's an industrial ecosystem.",
  version: "3DEXPERIENCE R2026x",
  last_updated: "2025-11-15",
  free_trial_days: 0,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Russian",
    "Spanish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "CATPart",
    "CATProduct",
    "CATDrawing",
    "STEP",
    "IGES",
    "3DXML",
    "STL",
    "NX",
    "JT",
    "SLDPRT",
    "DWG",
    "DXF",
  ],

  file_formats_out: [
    "CATPart",
    "CATProduct",
    "STEP",
    "IGES",
    "3DXML",
    "STL",
    "JT",
    "PDF",
    "DWG",
    "DXF",
    "CGR",
  ],

  integrations: [
    "3DEXPERIENCE",
    "ENOVIA",
    "DELMIA",
    "SIMULIA",
    "NETVIBES",
    "EXALEAD",
    "Microsoft 365",
  ],

  deployment_options: ["Desktop", "Cloud", "On-Premise"],
  license_types: ["Subscription", "Perpetual", "Network"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 230,
      url: "https://www.g2.com/products/catia/reviews",
    },
    {
      source: "Capterra",
      score: 4.4,
      max: 5,
      count: 95,
      url: "https://www.capterra.com/p/138802/CATIA/",
    },
    {
      source: "TrustRadius",
      score: 8.5,
      max: 10,
      count: 280,
      url: "https://www.trustradius.com/products/catia/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR", "ITAR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "CAA / 3DEXPERIENCE API",
    sdk_languages: ["C++", "C#", "Java", "VBScript"],
    docs_url: "https://www.3ds.com/products/catia/developer",
  },
}, {
  id: "t8",
  name: "Siemens NX",
  slug: "siemens-nx",
  logo_url: getLogo("NX"),
  short_desc:
    "Powerful high-end CAD/CAM/CAE suite for advanced manufacturing.",

  description:
    "Siemens NX provides integrated toolsets for design, simulation, and manufacturing, featuring Synchronous Technology.",

  pricing_tiers: [
    {
      name: "Core CAD (NX X)",
      price: "3,000",
      period: "/yr",

      features: [
        "Parametric Modeling",
        "Synchronous Technology",
        "Basic Assemblies",
        "Drafting",
      ],

      is_popular: true,
    },
    {
      name: "Advanced Designer",
      price: "6,500",
      period: "/yr",
      features: [
        "Advanced Surfacing",
        "Sheet Metal",
        "Plastic Part Design",
        "Routing",
      ],
      is_popular: false,
    },
    {
      name: "Value-Based (Tokens)",
      price: "Custom",
      period: "per use",

      features: [
        "Flexible module access",
        "Simulation roles",
        "Manufacturing roles",
        "Enterprise scale",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Digital Twin",

      items: [
        {
          name: "Convergent Modeling",
          status: true,
        },
        {
          name: "Generative Design tools",
          status: true,
        },
        {
          name: "Model Based Definition (MBD)",
          status: true,
        },
        {
          name: "Mechatronics Concept Designer",
          status: true,
        },
      ],
    },
    {
      category: "Analysis & Manufacturing",

      items: [
        {
          name: "Integrated CAE/FEA",
          status: true,
        },
        {
          name: "Advanced Surface Analysis",
          status: true,
        },
        {
          name: "Robotics Programming",
          status: true,
        },
        {
          name: "Additive Mfg Optimization",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["catia", "ptc-creo", "solidworks"],
  country: "Germany",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 6000,
  platforms: ["Windows", "Linux"],
  industries: ["Aerospace", "Consumer Electronics", "Energy"],

  core_features: [
    "Synchronous Tech",
    "Convergent Modeling",
    "Digital Twin",
    "Advanced Mfg",
    "Scalable PLM",
  ],

  user_scales: ["Enterprise"],
  official_url: "https://www.plm.automation.siemens.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Rapid geometry edits",
    "Exceptional CAD-CAM integration",
    "Native Linux support",
  ],
  cons: ["High entry price", "Complex licensing", "Specialized training req"],
  faqs: [
    {
      q: "What is Siemens NX used for?",
      a: "Powerful high-end CAD/CAM/CAE suite for advanced manufacturing. Siemens NX is a CAE / CAM solution widely adopted in Aerospace, Consumer Electronics, Energy.",
    },
    {
      q: "How much does Siemens NX cost?",
      a: "Siemens NX starts at $6,000 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Siemens NX offer a free trial?",
      a: "Yes — Siemens NX ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Siemens NX support?",
      a: "Siemens NX runs on Windows and Linux. Deployment options include desktop, cloud, on-premise.",
    },
    {
      q: "Which file formats does Siemens NX support?",
      a: "Siemens NX imports PRT, STEP, IGES, Parasolid, JT, CATPart and more. Export covers PRT, STEP, IGES, Parasolid, JT, STL and more.",
    },
    {
      q: "Does Siemens NX have an API for automation and customization?",
      a: "Yes. Siemens NX exposes NX Open / Open C / Open C++ with SDK bindings for C++, C#, Java, Python. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Siemens Parasolid",
    multicore: "Excellent",
    gpu_optimization: "High",
    standards: ["PRT", "STEP", "JT", "XT"],
  },

  expert_verdict: "The 'Swiss Army Knife' of high-end engineering.",
  version: "2412",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Czech",
    "Russian",
    "Polish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "PRT",
    "STEP",
    "IGES",
    "Parasolid",
    "JT",
    "CATPart",
    "SLDPRT",
    "IPT",
    "STL",
    "DWG",
    "DXF",
    "3DXML",
    "ACIS",
  ],

  file_formats_out: [
    "PRT",
    "STEP",
    "IGES",
    "Parasolid",
    "JT",
    "STL",
    "DWG",
    "DXF",
    "PDF",
    "OBJ",
    "VRML",
  ],

  integrations: [
    "Teamcenter",
    "Solid Edge",
    "Simcenter",
    "Mendix",
    "Polarion",
    "Tecnomatix",
  ],

  deployment_options: ["Desktop", "Cloud", "On-Premise"],
  license_types: ["Subscription", "Perpetual", "Network", "Floating"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 200,
      url: "https://www.g2.com/products/siemens-nx/reviews",
    },
    {
      source: "TrustRadius",
      score: 8.7,
      max: 10,
      count: 180,
      url: "https://www.trustradius.com/products/siemens-nx/reviews",
    },
    {
      source: "Gartner Peer Insights",
      score: 4.5,
      max: 5,
      count: 140,
      url: "https://www.gartner.com/reviews/market/computer-aided-design-cad-software",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR", "ITAR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "NX Open / Open C / Open C++",
    sdk_languages: ["C++", "C#", "Java", "Python", "VB.NET"],
    docs_url:
      "https://docs.sw.siemens.com/en-US/product/209349590/doc/PL20191002145020308.nx_api",
  },
}, {
  id: "t9",
  name: "ArchiCAD",
  slug: "archicad",
  logo_url: getLogo("ACD"),
  short_desc: "The BIM software of choice for design-oriented architects.",

  description:
    "ArchiCAD, developed by Graphisoft, was the first BIM software for personal computers.",

  pricing_tiers: [
    {
      name: "Studio",
      price: "201",
      period: "/mo",

      features: [
        "Architectural Design",
        "Local Collaboration",
        "Standard BIM tools",
        "Documentation",
      ],

      is_popular: true,
    },
    {
      name: "Collaborate",
      price: "237",
      period: "/mo",

      features: [
        "MEP Design",
        "Global Team Collaboration",
        "Model Checker",
        "Project Manager",
      ],

      is_popular: false,
    },
    {
      name: "BIMcloud",
      price: "47",
      period: "/mo",

      features: [
        "Cloud Coordination",
        "Real-time multi-user sync",
        "Infinite projects",
        "Security",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "BIM Workflow",

      items: [
        {
          name: "Algorithmic Design (Grasshopper)",
          status: true,
        },
        {
          name: "Integrated MEP Modeler",
          status: true,
        },
        {
          name: "Automatic Documentation",
          status: true,
        },
        {
          name: "OPEN BIM (IFC4) support",
          status: true,
        },
      ],
    },
    {
      category: "Visualization",

      items: [
        {
          name: "Built-in CineRender Engine",
          status: true,
        },
        {
          name: "Enscape/Twinmotion support",
          status: true,
        },
        {
          name: "BIMx Mobile Presentation",
          status: true,
        },
        {
          name: "Graphic Override rules",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["revit", "vectorworks", "allplan"],
  country: "Hungary",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 1800,
  platforms: ["Windows", "macOS"],
  industries: ["Architecture", "Interior Design"],

  core_features: [
    "Parametric BIM",
    "Teamwork Sync",
    "Open BIM",
    "Smart Objects",
    "Documentation",
  ],

  user_scales: ["Mid-Market", "Small Business"],
  official_url: "https://graphisoft.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Architect-centric UI",
    "Lightweight performance",
    "macOS optimization",
  ],
  cons: [
    "Smaller US market share",
    "MEP tools less mature",
    "Smaller plugin ecosystem",
  ],
  faqs: [
    {
      q: "What is ArchiCAD used for?",
      a: "The BIM software of choice for design-oriented architects. ArchiCAD is a BIM solution widely adopted in Architecture, Interior Design.",
    },
    {
      q: "How much does ArchiCAD cost?",
      a: "ArchiCAD starts at $1,800 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does ArchiCAD offer a free trial?",
      a: "Yes — ArchiCAD ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does ArchiCAD support?",
      a: "ArchiCAD runs on Windows and macOS. Deployment options include desktop, cloud.",
    },
    {
      q: "Which file formats does ArchiCAD support?",
      a: "ArchiCAD imports PLN, PLA, IFC, BCF, DWG, DXF and more. Export covers PLN, PLA, IFC, BCF, DWG, DXF and more.",
    },
    {
      q: "Does ArchiCAD have an API for automation and customization?",
      a: "Yes. ArchiCAD exposes GDL / ArchicadAPI with SDK bindings for C++, Python, JavaScript. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Graphisoft Proprietary",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["IFC", "DWG", "BIMx"],
  },

  expert_verdict: "ArchiCAD is built by architects, for architects.",
  version: "28",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Hungarian",
    "Polish",
    "Czech",
    "Russian",
    "Simplified Chinese",
    "Brazilian Portuguese",
    "Dutch",
    "Greek",
    "Turkish",
  ],

  file_formats_in: [
    "PLN",
    "PLA",
    "IFC",
    "BCF",
    "DWG",
    "DXF",
    "RVT",
    "3DS",
    "OBJ",
    "SKP",
    "PDF",
    "JPG",
    "PNG",
  ],

  file_formats_out: [
    "PLN",
    "PLA",
    "IFC",
    "BCF",
    "DWG",
    "DXF",
    "RVT",
    "3DM",
    "OBJ",
    "SKP",
    "PDF",
    "JPG",
    "PNG",
    "3D PDF",
  ],

  integrations: [
    "BIMcloud",
    "BIMx",
    "EcoDesigner Star",
    "Twinmotion",
    "Lumion",
    "Enscape",
    "Solibri",
    "Trimble Connect",
  ],

  deployment_options: ["Desktop", "Cloud"],
  license_types: ["Subscription", "Perpetual", "Network", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 200,
      url: "https://www.g2.com/products/archicad/reviews",
    },
    {
      source: "Capterra",
      score: 4.5,
      max: 5,
      count: 240,
      url: "https://www.capterra.com/p/175020/ArchiCAD/",
    },
    {
      source: "TrustRadius",
      score: 8.5,
      max: 10,
      count: 130,
      url: "https://www.trustradius.com/products/archicad/reviews",
    },
  ],

  support_channels: [
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],
  security_compliance: ["GDPR", "ISO 27001"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "GDL / ArchicadAPI",
    sdk_languages: ["C++", "Python", "JavaScript"],
    docs_url: "https://archicadapi.graphisoft.com/",
  },
}, {
  id: "t10",
  name: "Altium Designer",
  slug: "altium-designer",
  logo_url: getLogo("AD"),
  short_desc: "The professional standard for PCB and electronics design.",

  description:
    "Altium Designer offers a unified design environment including schematic capture and 3D PCB layout.",

  pricing_tiers: [
    {
      name: "Standard",
      price: "3,500",
      period: "/yr",

      features: [
        "Unified PCB Design",
        "Native 3D PCB",
        "Standard Component Mgmt",
        "Altium 365 Core",
      ],

      is_popular: true,
    },
    {
      name: "Professional",
      price: "7,500",
      period: "/yr",

      features: [
        "Advanced Simulation",
        "Rigid-flex Design",
        "Multi-board Assembly",
        "Team Configuration",
      ],

      is_popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",

      features: [
        "Lifecycle Management",
        "Centralized Libraries",
        "Global Team Workflow",
        "Custom APIs",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "PCB Design",

      items: [
        {
          name: "Interactive Routing Engine",
          status: true,
        },
        {
          name: "Native 3D Visualization",
          status: true,
        },
        {
          name: "Hierarchical Schematic Design",
          status: true,
        },
        {
          name: "MCAD/ECAD Co-design",
          status: true,
        },
      ],
    },
    {
      category: "Manufacturing",

      items: [
        {
          name: "Draftsman Documentation",
          status: true,
        },
        {
          name: "BOM Management",
          status: true,
        },
        {
          name: "ActiveBOM Supply Chain data",
          status: true,
        },
        {
          name: "Gerber/ODB++ Output",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["eagle", "orcad", "eplan-electric-p8"],
  country: "Australia",
  category_id: "c6",
  pricing_type: "Subscription",
  starting_price: 3850,
  platforms: ["Windows"],
  industries: ["Consumer Electronics", "Medical", "Automotive"],

  core_features: [
    "Unified PCB Design",
    "Native 3D",
    "Altium 365",
    "Interactive Routing",
    "Supply Chain Integration",
  ],

  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.altium.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Industry-leading 3D PCB",
    "Schematic-layout sync",
    "Extensive component library",
  ],
  cons: ["High subscription cost", "Steep learning curve", "Windows only"],
  faqs: [
    {
      q: "What is Altium Designer used for?",
      a: "The professional standard for PCB and electronics design. Altium Designer is an EDA solution widely adopted in Consumer Electronics, Medical, Automotive.",
    },
    {
      q: "How much does Altium Designer cost?",
      a: "Altium Designer starts at $3,850 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Altium Designer offer a free trial?",
      a: "Yes — Altium Designer ships with a 15-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Altium Designer support?",
      a: "Altium Designer runs on Windows. Deployment options include desktop, cloud.",
    },
    {
      q: "Which file formats does Altium Designer support?",
      a: "Altium Designer imports SchDoc, PcbDoc, PrjPcb, Gerber, ODB++, IPC-2581 and more. Export covers SchDoc, PcbDoc, Gerber, ODB++, IPC-2581, STEP and more.",
    },
    {
      q: "Does Altium Designer have an API for automation and customization?",
      a: "Yes. Altium Designer exposes Delphi-based API / Altium 365 REST with SDK bindings for Delphi, JavaScript, C#. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Altium Unified Modeler",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["Gerber", "ODB++", "STEP", "IPC"],
  },

  expert_verdict:
    "Altium is the 'Gold Standard' for professional PCB designers.",
  version: "25",
  last_updated: "2025-11-15",
  free_trial_days: 15,

  languages: [
    "English",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Russian",
  ],

  file_formats_in: [
    "SchDoc",
    "PcbDoc",
    "PrjPcb",
    "Gerber",
    "ODB++",
    "IPC-2581",
    "STEP",
    "IGES",
    "DXF",
    "DWG",
    "IDF",
  ],

  file_formats_out: [
    "SchDoc",
    "PcbDoc",
    "Gerber",
    "ODB++",
    "IPC-2581",
    "STEP",
    "IGES",
    "DXF",
    "PDF",
    "BOM",
    "3D PDF",
    "IDF",
  ],

  integrations: [
    "Altium 365",
    "Concord Pro",
    "Octopart",
    "SOLIDWORKS",
    "PTC Creo",
    "Autodesk Inventor",
    "Component Search Engine",
  ],

  deployment_options: ["Desktop", "Cloud"],
  license_types: ["Subscription", "Perpetual", "Network"],

  external_ratings: [
    {
      source: "G2",
      score: 4.4,
      max: 5,
      count: 280,
      url: "https://www.g2.com/products/altium-designer/reviews",
    },
    {
      source: "Capterra",
      score: 4.5,
      max: 5,
      count: 130,
      url: "https://www.capterra.com/p/238434/Altium-Designer/",
    },
    {
      source: "TrustRadius",
      score: 8.5,
      max: 10,
      count: 95,
      url: "https://www.trustradius.com/products/altium-designer/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "GDPR", "ISO 27001"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Delphi-based API / Altium 365 REST",
    sdk_languages: ["Delphi", "JavaScript", "C#"],
    docs_url:
      "https://www.altium.com/documentation/altium-designer/script-handbook",
  },
}, {
  id: "t11",
  name: "FreeCAD",
  slug: "freecad",
  logo_url: getLogo("FC"),
  short_desc: "The premier open-source 3D parametric modeler.",

  description:
    "FreeCAD is an open-source parametric 3D modeler made to design real-life objects of any size.",

  pricing_tiers: [
    {
      name: "Community",
      price: "0",
      period: "/yr",
      features: ["Full feature set", "Community support", "Open source"],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "Extensible via Python API", status: true },
        { name: "Modular Workbench-based UI", status: true },
        {
          name: "Support for many formats (STEP, IGES, STL, DXF)",
          status: true,
        },
        { name: "Sketcher with constraint solver", status: true },
        { name: "Path (CAM) module for CNC", status: true },
      ],
    },
  ],

  alternatives: ["solidworks", "fusion-360", "solvespace"],
  country: "Community/International",
  category_id: "c2",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Hobbyist", "Education", "Engineering"],
  core_features: [
    "Parametric Modeling",
    "Modular Architecture",
    "Python Scripting",
  ],
  user_scales: ["Individuals", "Education"],
  official_url: "https://www.freecad.org",
  affiliate_url: null,
  score: 4.2,
  pros: ["Completely free", "Python scriptable", "Excellent cross-platform"],
  cons: ["Cluttered UI", "Stability issues", "Steep learning curve"],
  faqs: [
    {
      q: "What is FreeCAD used for?",
      a: "The premier open-source 3D parametric modeler. FreeCAD is a 3D modeling solution widely adopted in Hobbyist, Education, Engineering.",
    },
    {
      q: "How much does FreeCAD cost?",
      a: "FreeCAD is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is FreeCAD really free?",
      a: "Yes — FreeCAD is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does FreeCAD support?",
      a: "FreeCAD runs on Windows, macOS, and Linux. Deployment options include desktop.",
    },
    {
      q: "Which file formats does FreeCAD support?",
      a: "FreeCAD imports FCStd, STEP, IGES, BREP, OBJ, STL and more. Export covers FCStd, STEP, IGES, BREP, OBJ, STL and more.",
    },
    {
      q: "Does FreeCAD have an API for automation and customization?",
      a: "Yes. FreeCAD exposes Python API with SDK bindings for Python, C++. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "OpenCASCADE",
    multicore: "Low",
    gpu_optimization: "OpenGL",
    standards: ["STEP", "IGES", "STL", "DXF"],
  },

  expert_verdict: "The best free alternative to SolidWorks.",

  pricing_breakdown: [
    {
      tier: "Community",
      price: "$0",
      notes: "Open Source (LGPL)",
    },
    {
      tier: "Contribution",
      price: "Donate",
      notes: "Support developers",
    },
  ],

  key_capabilities: [
    "Open-source Parametric 3D Modeling",
    "BIM/AEC Workbenches",
    "Finite Element Analysis (FEA)",
    "Robot Simulation Module",
    "2D Technical Drawing (TechDraw)",
  ],

  version: "1.0",
  last_updated: "2025-11-15",
  free_trial_days: 0,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Russian",
    "Czech",
    "Polish",
    "Portuguese",
    "Turkish",
    "Arabic",
    "Dutch",
    "Greek",
    "Hungarian",
    "Indonesian",
    "Norwegian",
    "Slovak",
    "Swedish",
    "Ukrainian",
    "Vietnamese",
  ],

  file_formats_in: [
    "FCStd",
    "STEP",
    "IGES",
    "BREP",
    "OBJ",
    "STL",
    "PLY",
    "DWG",
    "DXF",
    "SVG",
    "IFC",
    "Collada",
  ],

  file_formats_out: [
    "FCStd",
    "STEP",
    "IGES",
    "BREP",
    "OBJ",
    "STL",
    "PLY",
    "DWG",
    "DXF",
    "SVG",
    "IFC",
    "AMF",
    "PDF",
  ],

  integrations: [
    "OpenSCAD",
    "Salome-Meca",
    "CalculiX",
    "OpenFOAM",
    "KiCad",
    "LibreCAD",
  ],
  deployment_options: ["Desktop"],
  license_types: ["Open-Source", "Free"],

  external_ratings: [
    {
      source: "G2",
      score: 4.3,
      max: 5,
      count: 70,
      url: "https://www.g2.com/products/freecad/reviews",
    },
    {
      source: "Capterra",
      score: 4.2,
      max: 5,
      count: 110,
      url: "https://www.capterra.com/p/189000/FreeCAD/",
    },
  ],

  support_channels: ["Community", "Documentation"],
  security_compliance: [],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Python API",
    sdk_languages: ["Python", "C++"],
    docs_url: "https://wiki.freecad.org/Python_scripting_tutorial",
  },
}, {
  id: "t12",
  name: "ZWCAD",
  slug: "zwcad",
  logo_url: getLogo("ZW"),
  short_desc:
    "The most cost-effective and compatible alternative to AutoCAD.",

  description:
    "ZWCAD is a powerful 2D CAD solution with high compatibility with the .DWG format.",

  pricing_tiers: [
    {
      name: "Standard",
      price: "899",
      period: "initial",
      features: ["2D Drafting", "LISP Support", "Smart Mouse"],
    },
    {
      name: "Professional",
      price: "1199",
      period: "initial",
      features: ["3D Modeling", "API (VBA/ZRX)", "Batch Plotting"],
      is_popular: true,
    },
    {
      name: "Network",
      price: "1499",
      period: "initial",
      features: ["Multi-user floating", "Enterprise admin", "Cloud sync"],
    },
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "Flexi-block (similar to Dynamic Blocks)", status: true },
        {
          name: "Smart Voice: Add voice annotations to drawings",
          status: true,
        },
        {
          name: "Smart Select: Multi-criteria object selection",
          status: true,
        },
        { name: "Hardware Acceleration for large drawings", status: true },
        { name: "DWG 2024 support", status: true },
      ],
    },
  ],

  alternatives: ["autocad", "bricscad", "gstarcad"],
  country: "China",
  category_id: "c1",
  pricing_type: "Subscription / Perpetual",
  starting_price: 899,
  platforms: ["Windows", "Linux"],
  industries: ["Architecture", "Engineering", "Interior Design"],
  core_features: [
    "Smart Mouse / Smart Voice",
    "High DWG Compatibility",
    "LISP Support",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.zwsoft.com/zwcad",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Familiar to AutoCAD users",
    "Fast for large drawings",
    "Perpetual license option",
  ],
  cons: ["Basic 3D", "Cloud evolving", "Smaller plugin ecosystem"],
  faqs: [
    {
      q: "What is ZWCAD used for?",
      a: "The most cost-effective and compatible alternative to AutoCAD. ZWCAD is a 2D CAD solution widely adopted in Architecture, Engineering, Interior Design.",
    },
    {
      q: "How much does ZWCAD cost?",
      a: "ZWCAD starts at $899 per seat on a subscription / perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ZWCAD?",
      a: "ZWCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ZWCAD support?",
      a: "ZWCAD runs on Windows and Linux.",
    },
    {
      q: "Which file formats does ZWCAD support?",
      a: "ZWCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ZWCAD?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, BricsCAD, GstarCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "ZWSoft Custom",
    multicore: "Moderate",
    gpu_optimization: "Hardware Acceleration",
    standards: ["DWG", "DXF", "DWT", "PDF"],
  },

  expert_verdict: "ZWCAD is the most logical switch from AutoCAD.",

  pricing_breakdown: [
    {
      tier: "Standard",
      price: "~$799",
      notes: "Perpetual (2D drafting focus)",
    },
    {
      tier: "Professional",
      price: "~$1,199",
      notes: "Includes 3D & API support",
    },
    {
      tier: "Subscription",
      price: "~$399/yr",
      notes: "Annual maintenance option",
    },
  ],

  key_capabilities: [
    "Native DWG/DXF Compatibility",
    "Familiar AutoCAD-like UI/UX",
    "Lisp/VBA/ZRX API Support",
    "Smart Plotting & Annotations",
    "Multi-platform (Desktop & Mobile)",
  ],
}, {
  id: "t13",
  name: "BricsCAD",
  slug: "bricscad",
  logo_url: getLogo("BC"),
  short_desc: "The modern CAD platform for 2D, 3D, BIM, and Mechanical.",

  description:
    "BricsCAD uses AI-driven tools to speed up design workflows in a single environment.",

  pricing_tiers: [
    {
      name: "Lite (2D)",
      price: "590",
      period: "/yr",
      features: ["2D Drafting", "Full LISP", "DWG Native"],
    },
    {
      name: "Pro (3D)",
      price: "1150",
      period: "/yr",
      features: ["3D Direct Modeling", "VBA Support", "Civil Tools"],
      is_popular: true,
    },
    {
      name: "Ultimate",
      price: "2150",
      period: "/yr",
      features: ["Mechanical & BIM", "Assembly Design", "Sheet Metal"],
    },
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        {
          name: "One platform for 2D, 3D, BIM, and Mechanical",
          status: true,
        },
        { name: "Propagate: Copy details across entire model", status: true },
        { name: "Automated Scan-to-BIM workflows", status: true },
        { name: "Assembly design & Kinematics", status: true },
        { name: "Parametric Blocks with constraints", status: true },
      ],
    },
  ],

  alternatives: ["autocad", "zwcad", "revit"],
  country: "Belgium",
  category_id: "c1",
  pricing_type: "Subscription / Perpetual",
  starting_price: 590,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["AEC", "Mechanical", "GIS"],
  core_features: ["AI-powered BIMify", "Direct Modeling", "Native DWG"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.bricsys.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Unified DWG platform",
    "Excellent AI implementation",
    "AutoCAD plugin support",
  ],
  cons: [
    "Lacks brand recognition",
    "Tier-locked BIM",
    "Direct Modeling curve",
  ],
  faqs: [
    {
      q: "What is BricsCAD used for?",
      a: "The modern CAD platform for 2D, 3D, BIM, and Mechanical. BricsCAD is a 2D CAD solution widely adopted in AEC, Mechanical, GIS.",
    },
    {
      q: "How much does BricsCAD cost?",
      a: "BricsCAD starts at $590 per seat on a subscription / perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of BricsCAD?",
      a: "BricsCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does BricsCAD support?",
      a: "BricsCAD runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does BricsCAD support?",
      a: "BricsCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to BricsCAD?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, ZWCAD, Revit. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "ACIS",
    multicore: "High",
    gpu_optimization: "Redway3d rendering",
    standards: ["DWG", "IFC", "STEP", "IGES"],
  },

  expert_verdict: "The most technologically advanced 'DWG-based' software.",

  pricing_breakdown: [
    {
      tier: "Lite",
      price: "$650/yr",
      notes: "2D Drafting focus",
    },
    {
      tier: "Pro",
      price: "$1,300/yr",
      notes: "Full 3D & Lisp",
    },
    {
      tier: "Ultimate",
      price: "$2,450/yr",
      notes: "All-in-one BIM & Mechanical",
    },
  ],

  key_capabilities: [
    "Native DWG BIM & Mechanical Modeling",
    "AI-driven Design (BIMify, Propagate)",
    "Direct 3D Modeling (Non-history based)",
    "Civil/Survey design tools",
    "Point Cloud viewing & modeling",
  ],
}, {
  id: "t14",
  name: "Onshape",
  slug: "onshape",
  logo_url: getLogo("OS"),
  short_desc:
    "The professional CAD system built for agile cloud development.",
  description:
    "Onshape is the first and only pure-cloud professional 3D CAD system.",

  pricing_tiers: [
    {
      name: "Professional",
      price: "2,500",
      period: "/yr",

      features: [
        "Cloud-native CAD",
        "Built-in PDM",
        "Real-time Collaboration",
        "Advanced Surface",
      ],

      is_popular: true,
    },
    {
      name: "Standard",
      price: "1,500",
      period: "/yr",
      features: [
        "Core Modeling",
        "Team Management",
        "Standard Parts",
        "Mobile apps",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Cloud Platform",

      items: [
        {
          name: "Full Version History",
          status: true,
        },
        {
          name: "Zero-install hardware",
          status: true,
        },
        {
          name: "Simultaneous Editing",
          status: true,
        },
        {
          name: "Built-in Release Mgmt",
          status: true,
        },
      ],
    },
    {
      category: "Design Tools",

      items: [
        {
          name: "Parametric Part Studios",
          status: true,
        },
        {
          name: "FeatureScript Customization",
          status: true,
        },
        {
          name: "Integrated Simulation",
          status: true,
        },
        {
          name: "Multi-device support",
          status: true,
        },
      ],
    },
  ],

  alternatives: ["fusion-360", "solidworks", "shapr3d"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 1500,
  platforms: ["Web", "iOS", "Android"],
  industries: ["Startups", "Consumer Products", "Robotics"],

  core_features: [
    "Cloud-Native CAD",
    "Version Control",
    "Agile Product Design",
    "Part Studios",
    "Integrated Analysis",
  ],

  user_scales: ["Small Business", "Startups"],
  official_url: "https://www.onshape.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Zero IT footprint",
    "Real-time collaboration",
    "Superior version control",
  ],
  cons: [
    "Internet dependency",
    "Surfacing maturing",
    "Expensive for occasional users",
  ],
  faqs: [
    {
      q: "What is Onshape used for?",
      a: "The professional CAD system built for agile cloud development. Onshape is a 3D modeling solution widely adopted in Startups, Consumer Products, Robotics.",
    },
    {
      q: "How much does Onshape cost?",
      a: "Onshape starts at $1,500 per seat on a subscription and free license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Onshape offer a free trial?",
      a: "Yes — Onshape ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Onshape support?",
      a: "Onshape runs on Web, iOS, and Android. Deployment options include cloud, web, mobile.",
    },
    {
      q: "Which file formats does Onshape support?",
      a: "Onshape imports STEP, IGES, Parasolid, STL, SLDPRT, SLDASM and more. Export covers STEP, IGES, Parasolid, STL, 3MF, DWG and more.",
    },
    {
      q: "Does Onshape have an API for automation and customization?",
      a: "Yes. Onshape exposes REST with SDK bindings for Python, JavaScript, Java, C#. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Siemens Parasolid (Cloud)",
    multicore: "Unlimited",
    gpu_optimization: "WebGL 2.0",
    standards: ["STEP", "IGES", "Parasolid", "DXF"],
  },

  expert_verdict: "Onshape is the 'Google Docs' of CAD.",
  version: "Continuous (cloud)",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Russian",
    "Polish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "STEP",
    "IGES",
    "Parasolid",
    "STL",
    "SLDPRT",
    "SLDASM",
    "IPT",
    "IAM",
    "PRT",
    "CATPart",
    "DWG",
    "DXF",
    "X_T",
    "X_B",
    "ACIS",
    "JT",
    "3MF",
  ],

  file_formats_out: [
    "STEP",
    "IGES",
    "Parasolid",
    "STL",
    "3MF",
    "DWG",
    "DXF",
    "OBJ",
    "JT",
    "X_T",
    "X_B",
    "PDF",
    "JPG",
    "PNG",
  ],

  integrations: [
    "Onshape PDM",
    "Slack",
    "Jira",
    "GitHub",
    "Microsoft Teams",
    "Drift",
    "Bambu Studio",
    "Markforged",
  ],

  deployment_options: ["Cloud", "Web", "Mobile"],
  license_types: ["Subscription", "Free", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.6,
      max: 5,
      count: 380,
      url: "https://www.g2.com/products/onshape/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 280,
      url: "https://www.capterra.com/p/170018/Onshape/",
    },
    {
      source: "TrustRadius",
      score: 8.7,
      max: 10,
      count: 120,
      url: "https://www.trustradius.com/products/onshape/reviews",
    },
  ],

  support_channels: [
    "Email",
    "Chat",
    "Community",
    "Documentation",
    "Training",
  ],
  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR", "CCPA", "ITAR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "REST",
    sdk_languages: ["Python", "JavaScript", "Java", "C#"],
    docs_url: "https://onshape-public.github.io/docs/",
  },
}, {
  id: "t15",
  name: "Tekla Structures",
  slug: "tekla-structures",
  logo_url: getLogo("TS"),
  short_desc: "The world's most advanced structural BIM software.",
  description:
    "Tekla Structures is a BIM software for detailing steel, concrete, and timber structures.",
  pricing_tiers: [
    {
      name: "Carbon",
      price: "3,800",
      period: "/yr",

      features: [
        "Viewing & Collaboration",
        "Layout management",
        "Planning tools",
        "Open API access",
      ],

      is_popular: false,
    },
    {
      name: "Graphite",
      price: "7,200",
      period: "/yr",

      features: [
        "Modeling & Documentation",
        "Reinforced concrete",
        "Standard connections",
        "Reporting",
      ],

      is_popular: true,
    },
    {
      name: "Diamond",
      price: "12,500",
      period: "/yr",

      features: [
        "Full Automation",
        "Custom Connections",
        "CNC export",
        "Complex Steel Details",
      ],

      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Steel & Concrete",

      items: [
        {
          name: "LOD 500 Manufacturing data",
          status: true,
        },
        {
          name: "Automatic Connection Design",
          status: true,
        },
        {
          name: "Reinforcement Detailing",
          status: true,
        },
        {
          name: "Erection Planning",
          status: true,
        },
      ],
    },
    {
      category: "BIM Integration",

      items: [
        {
          name: "Trimble Connect Cloud",
          status: true,
        },
        {
          name: "IFC/STEP export",
          status: true,
        },
        {
          name: "Custom Component Editor",
          status: true,
        },
        {
          name: "API (C#) support",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["revit", "allplan", "civil-3d"],
  country: "Finland",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 2400,
  platforms: ["Windows"],
  industries: ["Structural Engineering", "Construction"],
  core_features: [
    "Steel Detailing",
    "BIM LOD 500",
    "Clash Detection",
    "CNC Export",
    "Structural Engineering",
  ],
  user_scales: ["Enterprise"],
  official_url: "https://www.tekla.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Unbeatable for steel",
    "Handles massive models",
    "CNC machine link",
  ],
  cons: ["Very expensive", "Highly specialized", "Steep learning curve"],
  faqs: [
    {
      q: "What is Tekla Structures used for?",
      a: "The world's most advanced structural BIM software. Tekla Structures is a BIM solution widely adopted in Structural Engineering, Construction.",
    },
    {
      q: "How much does Tekla Structures cost?",
      a: "Tekla Structures starts at $2,400 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Tekla Structures?",
      a: "Tekla Structures is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Tekla Structures support?",
      a: "Tekla Structures runs on Windows.",
    },
    {
      q: "Which file formats does Tekla Structures support?",
      a: "Tekla Structures works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Tekla Structures?",
      a: "The closest alternatives within the BIM space are Revit, Allplan, Civil 3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Trimble Structural Core",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["IFC", "STEP", "XML", "CIS/2"],
  },
  expert_verdict: "The choice for massive steel stadiums and complex plants.",
}, {
  id: "t16",
  name: "Solid Edge",
  slug: "solid-edge",
  logo_url: getLogo("SE"),
  short_desc:
    "Professional 3D CAD with industry-leading Synchronous Technology.",
  description:
    "Solid Edge features Synchronous Technology for rapid direct and history-based modeling.",
  pricing_tiers: [
    {
      name: "Classic (Annual)",
      price: "2,500",
      period: "/yr",

      features: [
        "Synchronous Technology",
        "Advanced Assemblies",
        "Sheet Metal",
        "Simulation",
      ],

      is_popular: true,
    },
    {
      name: "Premium",
      price: "4,500",
      period: "/yr",

      features: [
        "Full Simulation",
        "Generative Design",
        "Electrical Routing",
        "Additive Mfg",
      ],

      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Core Modeling",

      items: [
        {
          name: "Synchronous Tech (Direct)",
          status: true,
        },
        {
          name: "Convergent Modeling",
          status: true,
        },
        {
          name: "Frame & Structure Design",
          status: true,
        },
        {
          name: "Advanced Rendering",
          status: true,
        },
      ],
    },
    {
      category: "Engineering",

      items: [
        {
          name: "Integrated FEA Analysis",
          status: true,
        },
        {
          name: "Standard Parts Library",
          status: true,
        },
        {
          name: "Wiring & Pipe Design",
          status: true,
        },
        {
          name: "Teamcenter Integration",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["solidworks", "autodesk-inventor", "fusion-360"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription / Perpetual",
  starting_price: 1200,
  platforms: ["Windows"],
  industries: ["Mechanical", "Industrial Design"],
  core_features: [
    "Synchronous Technology",
    "Large Assembly Mgmt",
    "Sheet Metal Design",
    "Generative Design",
    "CAD/CAM/CAE",
  ],
  user_scales: ["Mid-Market", "Small Business"],
  official_url: "https://solidedge.siemens.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Hybrid modeling power",
    "Excellent sheet metal",
    "Flexible pricing",
  ],
  cons: [
    "Smaller marketing presence",
    "Legacy UI areas",
    "Smaller community",
  ],
  faqs: [
    {
      q: "What is Solid Edge used for?",
      a: "Professional 3D CAD with industry-leading Synchronous Technology. Solid Edge is a 3D modeling solution widely adopted in Mechanical, Industrial Design.",
    },
    {
      q: "How much does Solid Edge cost?",
      a: "Solid Edge starts at $1,200 per seat on a subscription / perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Solid Edge?",
      a: "Solid Edge is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Solid Edge support?",
      a: "Solid Edge runs on Windows.",
    },
    {
      q: "Which file formats does Solid Edge support?",
      a: "Solid Edge works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Solid Edge?",
      a: "The closest alternatives within the 3D Modeling space are SolidWorks, Autodesk Inventor, Fusion 360. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Siemens Parasolid",
    multicore: "Moderate",
    gpu_optimization: "OpenGL",
    standards: ["PAR", "STEP", "IGES", "JT"],
  },
  expert_verdict: "Solid Edge is the 'thinking man's' SolidWorks.",
}, {
  id: "t17",
  name: "Vectorworks",
  slug: "vectorworks",
  logo_url: getLogo("VW"),
  short_desc:
    "The all-in-one BIM solution for landscape and entertainment design.",
  description:
    "Vectorworks is a versatile BIM and CAD software suite for architects and entertainment professionals.",
  pricing_tiers: [
    {
      name: "Architect (Annual)",
      price: "1,530",
      period: "/yr",
      features: [
        "BIM Workflow",
        "3D Modeling",
        "Resource Manager",
        "Cloud Services",
      ],
      is_popular: true,
    },
    {
      name: "Design Suite",
      price: "2,100",
      period: "/yr",
      features: [
        "Landscape design",
        "Spotlight (Stage)",
        "Architect features",
        "Rendering",
      ],
      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Specialized Design",

      items: [
        {
          name: "Spotlight Lighting Tools",
          status: true,
        },
        {
          name: "Landmark GIS Integration",
          status: true,
        },
        {
          name: "Hybrid 2D/3D Workflow",
          status: true,
        },
        {
          name: "Parasolid Engine core",
          status: true,
        },
      ],
    },
    {
      category: "Core Tools",

      items: [
        {
          name: "Cinema 4D Rendering",
          status: true,
        },
        {
          name: "Data-driven Design (Marionette)",
          status: true,
        },
        {
          name: "Live Data Visualization",
          status: true,
        },
        {
          name: "Smart Objects library",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["archicad", "revit", "sketchup"],
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription / Perpetual",
  starting_price: 1530,
  platforms: ["Windows", "macOS"],
  industries: ["Architecture", "Landscape", "Entertainment"],
  core_features: [
    "Multi-disciplinary BIM",
    "Stage & Lighting Design",
    "Landscape modeling",
    "High-end Rendering",
    "GIS Integration",
  ],
  user_scales: ["Small Business", "Agencies"],
  official_url: "https://www.vectorworks.net",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Best-in-class 2D graphics",
    "Unique industry modules",
    "Strong macOS optimization",
  ],
  cons: [
    "BIM coordination less robust",
    "3D navigation clunky",
    "Steep learning curve",
  ],
  faqs: [
    {
      q: "What is Vectorworks used for?",
      a: "The all-in-one BIM solution for landscape and entertainment design. Vectorworks is a BIM solution widely adopted in Architecture, Landscape, Entertainment.",
    },
    {
      q: "How much does Vectorworks cost?",
      a: "Vectorworks starts at $1,530 per seat on a subscription / perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Vectorworks?",
      a: "Vectorworks is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Vectorworks support?",
      a: "Vectorworks runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Vectorworks support?",
      a: "Vectorworks works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Vectorworks?",
      a: "The closest alternatives within the BIM space are ArchiCAD, Revit, SketchUp. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Siemens Parasolid",
    multicore: "High",
    gpu_optimization: "Metal / DirectX",
    standards: ["IFC", "DWG", "RVV", "OBJ"],
  },
  expert_verdict:
    "If you work in landscape or lighting design, Vectorworks is the standard.",
}, {
  id: "t20",
  name: "Autodesk Inventor",
  slug: "autodesk-inventor",
  logo_url: getLogo("INV"),
  short_desc: "Professional-grade 3D mechanical design and simulation.",

  description:
    "Autodesk Inventor provides professional tools for product design and rendering, featuring iLogic automation and specialized toolsets.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "315",
      period: "/mo",
      features: ["Full 3D modeling", "Simulation", "Rendering"],
    },
    {
      name: "Annual",
      price: "2435",
      period: "/yr",
      features: ["Save 35%", "Priority Support", "Workflows Link"],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Parametric Design", status: true },
        { name: "Direct Edit", status: true },
      ],
    },
  ],

  alternatives: ["solidworks", "fusion-360"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 315,
  platforms: ["Windows"],
  industries: ["Manufacturing"],
  core_features: ["iLogic Automation", "Shared Views"],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.autodesk.com/inventor",
  affiliate_url: null,
  score: 4.7,
  pros: ["iLogic design automation", "Eco-system integration"],
  cons: ["Windows only", "Expensive"],
  faqs: [
    {
      q: "What is Autodesk Inventor used for?",
      a: "Professional-grade 3D mechanical design and simulation. Autodesk Inventor is a 3D modeling solution widely adopted in Manufacturing.",
    },
    {
      q: "How much does Autodesk Inventor cost?",
      a: "Autodesk Inventor starts at $315 per seat on a subscription and network license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does Autodesk Inventor offer a free trial?",
      a: "Yes — Autodesk Inventor ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does Autodesk Inventor support?",
      a: "Autodesk Inventor runs on Windows. Deployment options include desktop.",
    },
    {
      q: "Which file formats does Autodesk Inventor support?",
      a: "Autodesk Inventor imports IPT, IAM, IDW, IDX, STEP, IGES and more. Export covers IPT, IAM, STEP, IGES, SAT, STL and more.",
    },
    {
      q: "Does Autodesk Inventor have an API for automation and customization?",
      a: "Yes. Autodesk Inventor exposes .NET / COM API with SDK bindings for C#, VB.NET, C++, VBA. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Autodesk ShapeManager (ASM)",
    multicore: "Moderate",
    gpu_optimization: "Direct3D",
    standards: ["IPT", "IAM"],
  },

  expert_verdict:
    "The superior choice for mechanical design within the Autodesk ecosystem.",
  version: "2026",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Russian",
    "Czech",
    "Polish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "IPT",
    "IAM",
    "IDW",
    "IDX",
    "STEP",
    "IGES",
    "SAT",
    "STL",
    "DWG",
    "DXF",
    "SLDPRT",
    "CATPart",
    "NX",
    "Parasolid",
    "JT",
  ],

  file_formats_out: [
    "IPT",
    "IAM",
    "STEP",
    "IGES",
    "SAT",
    "STL",
    "DWG",
    "DXF",
    "JT",
    "OBJ",
    "FBX",
    "3MF",
    "PDF",
  ],

  integrations: [
    "Vault",
    "AutoCAD",
    "Fusion 360",
    "BIM 360",
    "Autodesk Drive",
    "Nastran In-CAD",
    "Inventor CAM",
  ],

  deployment_options: ["Desktop"],
  license_types: ["Subscription", "Network", "Educational"],

  external_ratings: [
    {
      source: "G2",
      score: 4.5,
      max: 5,
      count: 410,
      url: "https://www.g2.com/products/autodesk-inventor/reviews",
    },
    {
      source: "Capterra",
      score: 4.5,
      max: 5,
      count: 260,
      url: "https://www.capterra.com/p/118923/Autodesk-Inventor/",
    },
    {
      source: "TrustRadius",
      score: 8.6,
      max: 10,
      count: 350,
      url: "https://www.trustradius.com/products/autodesk-inventor/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: ".NET / COM API",
    sdk_languages: ["C#", "VB.NET", "C++", "VBA"],
    docs_url:
      "https://www.autodesk.com/developer-network/platform-technologies/inventor",
  },
}, {
  id: "t21",
  name: "MicroStation",
  slug: "microstation",
  logo_url: getLogo("MS"),
  short_desc: "The infrastructure engineering standard for massive projects.",
  description:
    "MicroStation is the CAD platform of choice for the world's most demanding infrastructure projects. It handles massive datasets with ease, providing native DGN support.",
  pricing_tiers: [
    {
      name: "Virtuosity Annual",
      price: "2,150",
      period: "/yr",

      features: [
        "Full 2D/3D CAD",
        "Interoperability support",
        "Bentley Learn training",
        "Cloud services",
      ],

      is_popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",

      features: [
        "Massive dataset handling",
        "ProjectWise integration",
        "Priority support",
        "Global licensing",
      ],

      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Infrastructure",

      items: [
        {
          name: "Native DGN/DWG support",
          status: true,
        },
        {
          name: "Reality Mesh (ContextCapture)",
          status: true,
        },
        {
          name: "Point Cloud Processing",
          status: true,
        },
        {
          name: "Geospatial coordination",
          status: true,
        },
      ],
    },
    {
      category: "Engineering",

      items: [
        {
          name: "Advanced Solid Modeling",
          status: true,
        },
        {
          name: "Constraint-based design",
          status: true,
        },
        {
          name: "Animated Rendering",
          status: true,
        },
        {
          name: "Standard Catalogs integration",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["autocad", "civil-3d", "revit"],
  country: "USA",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 2500,
  platforms: ["Windows"],
  industries: ["Infrastructure", "Civil Engineering", "GIS"],
  core_features: [
    "Infrastructure CAD",
    "Reality Modeling",
    "Parametric Modeling",
    "Universal Format Support",
    "Interoperability",
  ],
  user_scales: ["Enterprise", "Government"],
  official_url: "https://www.bentley.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Handles massive datasets",
    "Native DGN format",
    "Unmatched in bridge/road",
  ],
  cons: [
    "Interface complex",
    "Expensive for individuals",
    "Steep learning curve",
  ],
  faqs: [
    {
      q: "What is MicroStation used for?",
      a: "The infrastructure engineering standard for massive projects. MicroStation is a 2D CAD solution widely adopted in Infrastructure, Civil Engineering, GIS.",
    },
    {
      q: "How much does MicroStation cost?",
      a: "MicroStation starts at $2,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of MicroStation?",
      a: "MicroStation is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MicroStation support?",
      a: "MicroStation runs on Windows.",
    },
    {
      q: "Which file formats does MicroStation support?",
      a: "MicroStation works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MicroStation?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, Civil 3D, Revit. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Bentley Graphics Engine",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["DGN", "DWG", "IFC", "STEP"],
  },
  expert_verdict: "MicroStation is for infrastructure giants.",
}, {
  id: "t22",
  name: "DraftSight",
  slug: "draftsight",
  logo_url: getLogo("DS"),
  short_desc: "Professional-grade 2D CAD solution from Dassault Systèmes.",
  description:
    "DraftSight is the go-to AutoCAD alternative for firms using SolidWorks. It offers a familiar interface and full DWG compatibility.",
  pricing_tiers: [
    {
      name: "Professional",
      price: "249",
      period: "/yr",
      features: [
        "API Support",
        "Toolbox Library",
        "Batch Printing",
        "Standard 2D Drafting",
      ],
      is_popular: true,
    },
    {
      name: "Premium",
      price: "549",
      period: "/yr",

      features: [
        "3D Modeling",
        "Constraints",
        "Full Professional features",
        "Technical Support",
      ],

      is_popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      features: ["Network Licensing", "Deployment Tools", "Priority Support"],
      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Productivity",

      items: [
        {
          name: "API & LISP Support",
          status: true,
        },
        {
          name: "Standard Hardware Library",
          status: true,
        },
        {
          name: "Batch PDF Export",
          status: true,
        },
        {
          name: "G-Code Generator",
          status: true,
        },
      ],
    },
    {
      category: "Modeling",

      items: [
        {
          name: "3D Solid Modeling",
          status: true,
        },
        {
          name: "Geometric Constraints",
          status: true,
        },
        {
          name: "Dynamic Blocks support",
          status: true,
        },
        {
          name: "Sheet Metal features",
          status: false,
        },
      ],
    },
  ],
  alternatives: ["autocad", "bricscad", "nanocad"],
  country: "France",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 249,
  platforms: ["Windows", "macOS"],
  industries: ["Manufacturing", "Engineering", "AEC"],
  core_features: [
    "2D/3D Drafting",
    "LISP Support",
    "Dynamic Blocks",
    "Toolbox Utilities",
    "DGN Support",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.draftsight.com",
  affiliate_url: null,
  score: 4.3,
  pros: [
    "Cheaper than AutoCAD",
    "SolidWorks PDM integration",
    "Professional support",
  ],
  cons: ["No longer free", "Interface generic", "Lacks AutoCAD automation"],
  faqs: [
    {
      q: "What is DraftSight used for?",
      a: "Professional-grade 2D CAD solution from Dassault Systèmes. DraftSight is a 2D CAD solution widely adopted in Manufacturing, Engineering, AEC.",
    },
    {
      q: "How much does DraftSight cost?",
      a: "DraftSight starts at $249 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of DraftSight?",
      a: "DraftSight is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does DraftSight support?",
      a: "DraftSight runs on Windows and macOS.",
    },
    {
      q: "Which file formats does DraftSight support?",
      a: "DraftSight works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to DraftSight?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, BricsCAD, nanoCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ARES",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["DWG", "DXF", "PDF"],
  },
  expert_verdict:
    "The most 'professional' AutoCAD clone. Perfect companion for SolidWorks users.",
}, {
  id: "t23",
  name: "PTC Creo",
  slug: "ptc-creo",
  logo_url: getLogo("CR"),
  short_desc: "The original parametric 3D CAD powerhouse.",

  description:
    "Creo (formerly Pro/ENGINEER) is a scalable, integrated suite of software that supports product design for discrete manufacturers.",

  pricing_tiers: [
    {
      name: "Essentials",
      price: "2430",
      period: "/yr",
      features: ["Parametric Modeling", "Sheet Metal", "Rendering"],
    },
    {
      name: "Advanced",
      price: "5890",
      period: "/yr",
      features: ["Mechanism Dynamics", "Tolerance Analysis", "Simulation"],
      is_popular: true,
    },
    {
      name: "Enterprise",
      price: "9500",
      period: "/yr",
      features: ["Multi-CAD Collab", "Advanced Surface", "Additive Manuf."],
    },
  ],

  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Parametric Modeling", status: true },
        { name: "Direct Modeling", status: true },
        { name: "Sheet Metal", status: true },
      ],
    },
    {
      category: "Analysis",
      items: [
        { name: "FEA Simulation", status: true },
        { name: "Model-Based Definition", status: true },
        { name: "Generative Design", status: true },
      ],
    },
  ],

  alternatives: ["catia", "siemens-nx", "solidworks"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 2430,
  platforms: ["Windows"],
  industries: ["Manufacturing", "High-Tech", "Medical"],
  core_features: [
    "Model-Based Definition",
    "Generative Design",
    "Real-time Simulation",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.ptc.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Assembly management king",
    "World-class simulation",
    "Deep manufacturing tools",
  ],
  cons: [
    "Steep learning curve",
    "Overwhelming UI",
    "Hardware workstation req",
  ],
  faqs: [
    {
      q: "What is PTC Creo used for?",
      a: "The original parametric 3D CAD powerhouse. PTC Creo is a 3D modeling solution widely adopted in Manufacturing, High-Tech, Medical.",
    },
    {
      q: "How much does PTC Creo cost?",
      a: "PTC Creo starts at $2,430 per seat on a subscription and perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Does PTC Creo offer a free trial?",
      a: "Yes — PTC Creo ships with a 30-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.",
    },
    {
      q: "What operating systems does PTC Creo support?",
      a: "PTC Creo runs on Windows. Deployment options include desktop, cloud.",
    },
    {
      q: "Which file formats does PTC Creo support?",
      a: "PTC Creo imports PRT, ASM, DRW, STEP, IGES, STL and more. Export covers PRT, ASM, STEP, IGES, STL, DWG and more.",
    },
    {
      q: "Does PTC Creo have an API for automation and customization?",
      a: "Yes. PTC Creo exposes Pro/TOOLKIT / J-Link / Web.Link with SDK bindings for C, C++, Java, JavaScript. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Granite",
    multicore: "Excellent",
    gpu_optimization: "High",
    standards: ["PRT", "STEP", "IGES", "STL"],
  },

  expert_verdict: "Creo is for serious engineering at massive scales.",
  version: "11",
  last_updated: "2025-11-15",
  free_trial_days: 30,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Czech",
    "Russian",
    "Polish",
    "Brazilian Portuguese",
  ],

  file_formats_in: [
    "PRT",
    "ASM",
    "DRW",
    "STEP",
    "IGES",
    "STL",
    "DWG",
    "DXF",
    "CATPart",
    "SLDPRT",
    "JT",
    "Parasolid",
  ],

  file_formats_out: [
    "PRT",
    "ASM",
    "STEP",
    "IGES",
    "STL",
    "DWG",
    "DXF",
    "JT",
    "OBJ",
    "VRML",
    "PDF",
    "3D PDF",
  ],

  integrations: [
    "Windchill",
    "ThingWorx",
    "Vuforia",
    "Creo Simulate",
    "Creo Generative Design",
    "Mathcad",
  ],

  deployment_options: ["Desktop", "Cloud"],
  license_types: ["Subscription", "Perpetual", "Network", "Floating"],

  external_ratings: [
    {
      source: "G2",
      score: 4.3,
      max: 5,
      count: 460,
      url: "https://www.g2.com/products/ptc-creo/reviews",
    },
    {
      source: "Capterra",
      score: 4.4,
      max: 5,
      count: 220,
      url: "https://www.capterra.com/p/138691/Creo-Parametric/",
    },
    {
      source: "TrustRadius",
      score: 8.4,
      max: 10,
      count: 380,
      url: "https://www.trustradius.com/products/ptc-creo/reviews",
    },
  ],

  support_channels: [
    "Phone",
    "Email",
    "Community",
    "Documentation",
    "Training",
    "Reseller Network",
  ],

  security_compliance: ["SOC 2 Type II", "ISO 27001", "GDPR", "ITAR"],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Pro/TOOLKIT / J-Link / Web.Link",
    sdk_languages: ["C", "C++", "Java", "JavaScript"],
    docs_url: "https://support.ptc.com/help/creo/creo_pma/r11.0/",
  },
}, {
  id: "t24",
  name: "OpenSCAD",
  slug: "openscad",
  logo_url: getLogo("OSC"),
  short_desc: "The programmer's solid 3D CAD modeler.",
  description:
    "OpenSCAD is a software for creating solid 3D CAD objects. It is not an interactive modeler but a 3D-compiler based on a textual description language.",
  pricing_tiers: [
    {
      name: "Open Source",
      price: "0",
      period: "/yr",
      features: ["Full feature set", "Community support", "Free forever"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Programming",
      items: [
        { name: "Script-based CAD", status: true },
        { name: "Variables/Loops", status: true },
        { name: "Module System", status: true },
      ],
    },
    {
      category: "Geometry",
      items: [
        { name: "CSG Modeling", status: true },
        { name: "STL Export", status: true },
        { name: "SVG Import", status: true },
      ],
    },
  ],
  alternatives: ["freecad", "solvespace", "solvespace-pro"],
  country: "Community/International",
  category_id: "c2",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Hobbyist", "Maker", "Research"],
  core_features: [
    "Script-based Modeling",
    "CSG Geometry Engine",
    "Parametric Variables",
  ],
  user_scales: ["Individuals"],
  official_url: "https://openscad.org",
  affiliate_url: null,
  score: 4.4,
  pros: [
    "Total code control",
    "Perfect for 3D printing",
    "Extremely lightweight",
  ],
  cons: ["No interactive GUI", "Cody learning curve", "Poor organic shapes"],
  faqs: [
    {
      q: "What is OpenSCAD used for?",
      a: "The programmer's solid 3D CAD modeler. OpenSCAD is a 3D modeling solution widely adopted in Hobbyist, Maker, Research.",
    },
    {
      q: "How much does OpenSCAD cost?",
      a: "OpenSCAD is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is OpenSCAD really free?",
      a: "Yes — OpenSCAD is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does OpenSCAD support?",
      a: "OpenSCAD runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does OpenSCAD support?",
      a: "OpenSCAD works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to OpenSCAD?",
      a: "The closest alternatives within the 3D Modeling space are FreeCAD, SolveSpace, SolveSpace Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CGAL / OpenCSG",
    multicore: "Low",
    gpu_optimization: "None",
    standards: ["STL", "OFF", "AMF", "CSG"],
  },
  expert_verdict:
    "OpenSCAD is the ultimate tool for engineers who think in code.",
}, {
  id: "t25",
  name: "Shapr3D",
  slug: "shapr3d",
  logo_url: getLogo("S3"),
  short_desc: "Professional CAD for mobile and desktop mobility.",
  description:
    "Shapr3D is a professional CAD tool built for iPad and desktop. It uses the Siemens Parasolid kernel for industrial-grade precision.",
  pricing_tiers: [
    {
      name: "Free",
      price: "0",
      period: "/yr",
      features: ["2 Designs", "Low-res export", "Basic tools"],
    },
    {
      name: "Pro",
      price: "299",
      period: "/yr",
      features: ["Unlimited designs", "High-res export", "Parasolid engine"],
      is_popular: true,
    },
    {
      name: "Enterprise",
      price: "499",
      period: "/yr",
      features: ["Network licensing", "Priority support", "Deployment tools"],
    },
  ],
  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Direct Modeling", status: true },
        { name: "Parasolid Core", status: true },
        { name: "Apple Pencil Support", status: true },
      ],
    },
    {
      category: "Workflow",
      items: [
        { name: "Desktop/iPad Sync", status: true },
        { name: "Visualization Mode", status: true },
        { name: "AR Preview", status: true },
      ],
    },
  ],
  alternatives: ["fusion-360", "solidworks", "onshape"],
  country: "Hungary",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 299,
  platforms: ["Windows", "macOS", "iOS"],
  industries: ["Industrial Design", "Prototyping", "AEC"],
  core_features: [
    "Direct Modeling with Apple Pencil",
    "Parasolid Precision",
    "Multi-Device Sync",
  ],
  user_scales: ["Individuals", "Small Business"],
  official_url: "https://www.shapr3d.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Most intuitive UI",
    "Industrial Parasolid kernel",
    "Offline mobility",
  ],
  cons: ["Subscription only", "Assembly maturing", "Pencil req for iPad"],
  faqs: [
    {
      q: "What is Shapr3D used for?",
      a: "Professional CAD for mobile and desktop mobility. Shapr3D is a 3D modeling solution widely adopted in Industrial Design, Prototyping, AEC.",
    },
    {
      q: "How much does Shapr3D cost?",
      a: "Shapr3D starts at $299 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Shapr3D?",
      a: "Shapr3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Shapr3D support?",
      a: "Shapr3D runs on Windows, macOS, and iOS.",
    },
    {
      q: "Which file formats does Shapr3D support?",
      a: "Shapr3D works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Shapr3D?",
      a: "The closest alternatives within the 3D Modeling space are Fusion 360, SolidWorks, Onshape. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Siemens Parasolid",
    multicore: "Moderate",
    gpu_optimization: "Metal / DirectX",
    standards: ["STEP", "IGES", "XT", "STL"],
  },
  expert_verdict:
    "Shapr3D has done the impossible: made professional CAD fun.",
}, {
  id: "t27",
  name: "Chief Architect",
  slug: "chief-architect",
  logo_url: getLogo("CA"),
  short_desc: "Professional home design software for builders.",
  description:
    "Chief Architect is specialized for residential home design. It generates 3D models and construction documents with architectural automation.",
  pricing_tiers: [
    {
      name: "Premier Monthly",
      price: "199",
      period: "/mo",
      features: [
        "Residential Design",
        "Auto Roofs & Stairs",
        "3D Library",
        "Support",
      ],
      is_popular: true,
    },
    {
      name: "Premier Annual",
      price: "1,995",
      period: "/yr",

      features: [
        "Full Architectural Tools",
        "Kitchen & Bath",
        "Construction Docs",
        "Priority support",
      ],

      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Building Tools",

      items: [
        {
          name: "Automatic Roof Generation",
          status: true,
        },
        {
          name: "Smart Wall/Door/Window",
          status: true,
        },
        {
          name: "Cabinet Customization",
          status: true,
        },
        {
          name: "Material Painter",
          status: true,
        },
      ],
    },
    {
      category: "Construction",

      items: [
        {
          name: "Automatic Framing",
          status: true,
        },
        {
          name: "Schedules & Materials List",
          status: true,
        },
        {
          name: "3D Walkthrough export",
          status: true,
        },
        {
          name: "CAD-to-BIM workflow",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["revit", "sketchup", "archicad"],
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 1995,
  platforms: ["Windows", "macOS"],
  industries: ["Residential Architecture", "Remodeling"],
  core_features: [
    "Residential Design",
    "Automated Building Tools",
    "Smart Objects",
    "Interior Design",
    "Photorealistic Rendering",
  ],
  user_scales: ["Small Business", "Agencies"],
  official_url: "https://www.chiefarchitect.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Residential construction docs",
    "Massive home library",
    "Fast client renders",
  ],
  cons: ["Not for mechanical", "Expensive", "Windows version lead"],
  faqs: [
    {
      q: "What is Chief Architect used for?",
      a: "Professional home design software for builders. Chief Architect is a BIM solution widely adopted in Residential Architecture, Remodeling.",
    },
    {
      q: "How much does Chief Architect cost?",
      a: "Chief Architect starts at $1,995 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Chief Architect?",
      a: "Chief Architect is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Chief Architect support?",
      a: "Chief Architect runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Chief Architect support?",
      a: "Chief Architect works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Chief Architect?",
      a: "The closest alternatives within the BIM space are Revit, SketchUp, ArchiCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Chief Custom AEC Engine",
    multicore: "High",
    gpu_optimization: "DirectX / Metal",
    standards: ["DWG", "DXF", "OBJ", "SKP"],
  },
  expert_verdict: "If you build houses, buy Chief Architect.",
}, {
  id: "t28",
  name: "Mastercam",
  slug: "mastercam",
  logo_url: getLogo("MC"),
  short_desc: "The global leader in CAM software for manufacturing.",
  description:
    "Mastercam is the world's most widely used CAM software. It provides solutions for all types of manufacturing, from 2- through 5-axis milling.",
  pricing_tiers: [
    {
      name: "Entry",
      price: "3000",
      period: "/yr",
      features: ["2D Milling", "Basic Lathe", "Drafting"],
    },
    {
      name: "Mill-Turn",
      price: "8000",
      period: "/yr",
      features: ["Multi-tasking", "Machine Sim", "Post support"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "CAM",
      items: [
        { name: "Dynamic Motion", status: true },
        { name: "Multi-Axis Milling", status: true },
        { name: "Swiss Machining", status: true },
      ],
    },
    {
      category: "CAD",
      items: [
        { name: "Wireframe Modeling", status: true },
        { name: "Solid Modeling", status: true },
        { name: "Drafting", status: true },
      ],
    },
  ],
  alternatives: ["solidcam", "fusion-360", "ansys-mechanical"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 3000,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Machining", "Die & Mold"],
  core_features: ["Dynamic Motion", "Multi-Axis Milling", "Swiss Machining"],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.mastercam.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Standard post-processors",
    "Dynamic Milling cycle reduction",
    "Global training network",
  ],
  cons: ["Steep price", "Dated legacy UI", "Complex mastering"],
  faqs: [
    {
      q: "What is Mastercam used for?",
      a: "The global leader in CAM software for manufacturing. Mastercam is a CAE / CAM solution widely adopted in Manufacturing, Machining, Die & Mold.",
    },
    {
      q: "How much does Mastercam cost?",
      a: "Mastercam starts at $3,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Mastercam?",
      a: "Mastercam is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Mastercam support?",
      a: "Mastercam runs on Windows.",
    },
    {
      q: "Which file formats does Mastercam support?",
      a: "Mastercam works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Mastercam?",
      a: "The closest alternatives within the CAE/CAM space are SolidCAM, Fusion 360, ANSYS Mechanical. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Mastercam Custom CAM",
    multicore: "Excellent",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "Parasolid", "DWG"],
  },
  expert_verdict: "The 'gold standard' for the professional machine shop.",
}, {
  id: "t29",
  name: "SolveSpace",
  slug: "solvespace",
  logo_url: getLogo("SS"),
  short_desc: "A minimalist, open-source 2D/3D parametric CAD tool.",
  description:
    "SolveSpace is a free constraint-based parametric modeler. It is very lightweight and focuses on pure geometric logic.",
  pricing_tiers: [
    {
      name: "Open Source",
      price: "0",
      period: "/yr",
      features: ["Full feature set", "Free forever", "No registration"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Constraint Solver", status: true },
        { name: "Sketching", status: true },
        { name: "STEP Export", status: true },
      ],
    },
  ],
  alternatives: ["freecad", "openscad", "solvespace-pro"],
  country: "Community/International",
  category_id: "c2",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Hobbyist", "Light Engineering", "Education"],
  core_features: ["Constraint Solver", "Minimalist Footprint", "STEP Export"],
  user_scales: ["Individuals"],
  official_url: "https://solvespace.com",
  affiliate_url: null,
  score: 4.1,
  pros: ["Tiny file size", "Fast for simple parts", "Pure logic"],
  cons: ["No assembly management", "Basic UI", "Limited rendering"],
  faqs: [
    {
      q: "What is SolveSpace used for?",
      a: "A minimalist, open-source 2D/3D parametric CAD tool. SolveSpace is a 3D modeling solution widely adopted in Hobbyist, Light Engineering, Education.",
    },
    {
      q: "How much does SolveSpace cost?",
      a: "SolveSpace is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is SolveSpace really free?",
      a: "Yes — SolveSpace is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does SolveSpace support?",
      a: "SolveSpace runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does SolveSpace support?",
      a: "SolveSpace works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SolveSpace?",
      a: "The closest alternatives within the 3D Modeling space are FreeCAD, OpenSCAD, SolveSpace Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SolveSpace Custom Solver",
    multicore: "Low",
    gpu_optimization: "None",
    standards: ["STEP", "STL", "DXF"],
  },
  expert_verdict: "A masterclass in minimalist parametric design.",
}, {
  id: "t30",
  name: "Alibre Design",
  slug: "alibre-design",
  logo_url: getLogo("AL"),
  short_desc: "Professional 3D CAD without the enterprise price tag.",
  description:
    "Alibre Design provides industrial-grade parametric modeling tools. It is a popular choice for those seeking a perpetual license instead of a subscription.",
  pricing_tiers: [
    {
      name: "Professional",
      price: "950",
      period: "initial",
      features: ["3D Parametric", "2D Drafting", "Keyshot bundle"],
    },
    {
      name: "Expert",
      price: "1850",
      period: "initial",
      features: ["Sheet Metal", "Motion Analysis", "Full Library"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Parametric Design", status: true },
        { name: "Global Variables", status: true },
        { name: "Sheet Metal", status: true },
      ],
    },
    {
      category: "Presentation",
      items: [
        { name: "Keyshot Render", status: true },
        { name: "2D Detailing", status: true },
        { name: "Exploded Views", status: true },
      ],
    },
  ],
  alternatives: ["solidworks", "varicad", "zw3d"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Perpetual",
  starting_price: 950,
  platforms: ["Windows"],
  industries: ["Mechanical", "Manufacturing", "Prototyping"],
  core_features: ["Parametric Modeling", "Global Variables", "Sheet Metal"],
  user_scales: ["Small Business", "Individuals"],
  official_url: "https://www.alibre.com",
  affiliate_url: null,
  score: 4.5,
  pros: [
    "Fair perpetual model",
    "SolidWorks-like workflow",
    "Solid mid-range perf",
  ],
  cons: ["Windows only", "Smaller add-on ecosystem", "Tiered simulation"],
  faqs: [
    {
      q: "What is Alibre Design used for?",
      a: "Professional 3D CAD without the enterprise price tag. Alibre Design is a 3D modeling solution widely adopted in Mechanical, Manufacturing, Prototyping.",
    },
    {
      q: "How much does Alibre Design cost?",
      a: "Alibre Design starts at $950 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Alibre Design?",
      a: "Alibre Design is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Alibre Design support?",
      a: "Alibre Design runs on Windows.",
    },
    {
      q: "Which file formats does Alibre Design support?",
      a: "Alibre Design works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Alibre Design?",
      a: "The closest alternatives within the 3D Modeling space are SolidWorks, VariCAD, ZW3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ACIS",
    multicore: "Moderate",
    gpu_optimization: "DirectX",
    standards: ["STEP", "IGES", "SAT", "STL"],
  },
  expert_verdict: "No mandatory subscriptions, just solid parametric tools.",
}, {
  id: "t31",
  name: "nTop",
  slug: "ntop",
  logo_url: getLogo("NT"),
  short_desc: "Engineering design software for additive manufacturing.",
  description:
    "nTop uses implicit modeling technology to enable the design of high-performance parts with complex lattices and topology optimization.",
  pricing_tiers: [
    {
      name: "Enterprise",
      price: "7500",
      period: "/yr",
      features: ["Full implicit engine", "Lattice design", "Support"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "Implicit Modeling", status: true },
        { name: "Lattice Generation", status: true },
        { name: "Field Driven", status: true },
      ],
    },
    {
      category: "Analysis",
      items: [
        { name: "Topology Opt", status: true },
        { name: "GPU Simulation", status: true },
        { name: "Batch Process", status: true },
      ],
    },
  ],
  alternatives: ["ansys-mechanical", "siemens-nx", "mastercam"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 7500,
  platforms: ["Windows"],
  industries: ["Aerospace", "Medical", "Automotive"],
  core_features: [
    "Implicit Modeling",
    "Lattice Generation",
    "DoE Automation",
  ],
  user_scales: ["Enterprise", "Research"],
  official_url: "https://www.ntop.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Unbeatable lattice strutture",
    "Handles extreme complexity",
    "Workflow automation",
  ],
  cons: [
    "Extremely expensive",
    "Mathematical mindset curve",
    "Not general-purpose",
  ],
  faqs: [
    {
      q: "What is nTop used for?",
      a: "Engineering design software for additive manufacturing. nTop is a CAE / CAM solution widely adopted in Aerospace, Medical, Automotive.",
    },
    {
      q: "How much does nTop cost?",
      a: "nTop starts at $7,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of nTop?",
      a: "nTop is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does nTop support?",
      a: "nTop runs on Windows.",
    },
    {
      q: "Which file formats does nTop support?",
      a: "nTop works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to nTop?",
      a: "The closest alternatives within the CAE/CAM space are ANSYS Mechanical, Siemens NX, Mastercam. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "nTop Implicit Engine",
    multicore: "Excellent",
    gpu_optimization: "NVIDIA CUDA / Optix",
    standards: ["STEP", "STL", "3MF", "Parasolid"],
  },
  expert_verdict: "The future of advanced manufacturing design.",
}, {
  id: "t32",
  name: "SolidCAM",
  slug: "solidcam",
  logo_url: getLogo("SC"),
  short_desc: "The leading integrated CAM for SolidWorks.",
  description:
    "SolidCAM is a complete solution for CNC programming. Its iMachining technology can reduce machining times by up to 70%.",
  pricing_tiers: [
    {
      name: "iMachining",
      price: "4000",
      period: "/yr",
      features: ["2D/3D iMachining", "SolidWorks native", "Post support"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "CAM",
      items: [
        { name: "iMachining 2D/3D", status: true },
        { name: "Multi-Axis Milling", status: true },
        { name: "Probe module", status: true },
      ],
    },
  ],
  alternatives: ["mastercam", "camworks", "fusion-360"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 4000,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Medical", "Aerospace"],
  core_features: [
    "iMachining 2D/3D",
    "Multi-Axis Milling",
    "Single-window Integration",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.solidcam.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "iMachining cycle reduction",
    "SolidWorks native experience",
    "Great post-processors",
  ],
  cons: ["Host CAD req", "Learning curve", "High price"],
  faqs: [
    {
      q: "What is SolidCAM used for?",
      a: "The leading integrated CAM for SolidWorks. SolidCAM is a CAE / CAM solution widely adopted in Manufacturing, Medical, Aerospace.",
    },
    {
      q: "How much does SolidCAM cost?",
      a: "SolidCAM starts at $4,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of SolidCAM?",
      a: "SolidCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does SolidCAM support?",
      a: "SolidCAM runs on Windows.",
    },
    {
      q: "Which file formats does SolidCAM support?",
      a: "SolidCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SolidCAM?",
      a: "The closest alternatives within the CAE/CAM space are Mastercam, CAMWorks, Fusion 360. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SolidCAM Machining",
    multicore: "Excellent",
    gpu_optimization: "Moderate",
    standards: ["STEP", "SolidWorks Native"],
  },
  expert_verdict: "iMachining is literal magic for CNC shops.",
}, {
  id: "t34",
  name: "Bluebeam Revu",
  slug: "bluebeam-revu",
  logo_url: getLogo("BB"),
  short_desc: "The AEC standard for PDF markup and collaboration.",
  description:
    "Bluebeam Revu is a project efficiency and collaboration solution that allows users to markup, takeoff, and organize PDF files.",
  pricing_tiers: [
    {
      name: "Basics",
      price: "240",
      period: "/yr",

      features: [
        "PDF Markup Tools",
        "Real-time Collaboration",
        "Cloud Storage",
        "Measurement tools",
      ],

      is_popular: false,
    },
    {
      name: "Core",
      price: "300",
      period: "/yr",

      features: [
        "Advanced Measurement",
        "Quantity Link",
        "Specialized Toolsets",
        "Mobile access",
      ],

      is_popular: true,
    },
    {
      name: "Complete",
      price: "400",
      period: "/yr",
      features: [
        "Full Automation",
        "Visual Search",
        "Batch Link",
        "Advanced Scripting",
      ],
      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Collaboration",

      items: [
        {
          name: "Studio Sessions (Real-time)",
          status: true,
        },
        {
          name: "Studio Projects (DMS)",
          status: true,
        },
        {
          name: "Markup List management",
          status: true,
        },
        {
          name: "Multi-device Revu iPad sync",
          status: true,
        },
      ],
    },
    {
      category: "Takeoff & Tools",

      items: [
        {
          name: "Automatic Quantity Link",
          status: true,
        },
        {
          name: "Dynamic Fill tool",
          status: true,
        },
        {
          name: "Custom Tool Chests",
          status: true,
        },
        {
          name: "3D PDF viewing/annotation",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["navisworks", "solibri", "recap-pro"],
  country: "USA",
  category_id: "c4",
  pricing_type: "Subscription",
  starting_price: 240,
  platforms: ["Windows"],
  industries: ["AEC", "Construction", "Estimating"],
  core_features: [
    "AEC Collaboration",
    "Studio Sessions",
    "Precision Measurements",
    "Quantity Takeoff",
    "Document Management",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.bluebeam.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Essential construction project hub",
    "Best PDF markup",
    "Estimating integration",
  ],
  cons: [
    "No longer free trial version",
    "Subscription shift",
    "Learning curve",
  ],
  faqs: [
    {
      q: "What is Bluebeam Revu used for?",
      a: "The AEC standard for PDF markup and collaboration. Bluebeam Revu is a CAD viewer solution widely adopted in AEC, Construction, Estimating.",
    },
    {
      q: "How much does Bluebeam Revu cost?",
      a: "Bluebeam Revu starts at $240 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Bluebeam Revu?",
      a: "Bluebeam Revu is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Bluebeam Revu support?",
      a: "Bluebeam Revu runs on Windows.",
    },
    {
      q: "Which file formats does Bluebeam Revu support?",
      a: "Bluebeam Revu works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Bluebeam Revu?",
      a: "The closest alternatives within the Viewer space are Navisworks, Solibri, Recap Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Bluebeam Rendering",
    multicore: "High",
    gpu_optimization: "Hardware Acceleration",
    standards: ["PDF", "IFC"],
  },
  expert_verdict:
    "You cannot run a modern construction project without Bluebeam.",
}, {
  id: "t35",
  name: "Navisworks",
  slug: "navisworks",
  logo_url: getLogo("NV"),
  short_desc: "Project review software for clash detection.",
  description:
    "Navisworks allows architecture, engineering, and construction professionals to holistically review integrated models and data with stakeholders to better control project outcomes.",
  pricing_tiers: [
    {
      name: "Manage (Annual)",
      price: "2,645",
      period: "/yr",

      features: [
        "Full Clash Detection",
        "4D Scheduling",
        "5D Cost analysis",
        "Quantification",
      ],

      is_popular: true,
    },
    {
      name: "Simulate",
      price: "1,100",
      period: "/yr",

      features: [
        "Timeline simulation",
        "Advanced Rendering",
        "No Clash Detection",
        "NWD conversion",
      ],

      is_popular: false,
    },
  ],
  detailed_features: [
    {
      category: "Coordination",

      items: [
        {
          name: "Automated Clash Detection",
          status: true,
        },
        {
          name: "Conflict/Issue management",
          status: true,
        },
        {
          name: "Over 60+ File formats support",
          status: true,
        },
        {
          name: "NWD/NWC optimization",
          status: true,
        },
      ],
    },
    {
      category: "Simulation",

      items: [
        {
          name: "4D Timeliner (Schedule)",
          status: true,
        },
        {
          name: "5D Quantification (Cost)",
          status: true,
        },
        {
          name: "Photorealistic Rendering",
          status: true,
        },
        {
          name: "Animator/Scripter tools",
          status: true,
        },
      ],
    },
  ],
  alternatives: ["solibri", "bluebeam-revu", "recap-pro"],
  country: "USA",
  category_id: "c4",
  pricing_type: "Subscription",
  starting_price: 1050,
  platforms: ["Windows"],
  industries: ["Construction", "AEC", "Oil & Gas"],
  core_features: [
    "BIM Coordination",
    "Clash Detection",
    "4D/5D Simulation",
    "Model Aggregation",
    "Cloud Collaboration",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.autodesk.com/navisworks",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Massive model handling",
    "BIM coordination standard",
    "Powerful reports",
  ],
  cons: ["Dated UI", "Steep learning", "Expensive viewer"],
  faqs: [
    {
      q: "What is Navisworks used for?",
      a: "Project review software for clash detection. Navisworks is a CAD viewer solution widely adopted in Construction, AEC, Oil & Gas.",
    },
    {
      q: "How much does Navisworks cost?",
      a: "Navisworks starts at $1,050 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Navisworks?",
      a: "Navisworks is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Navisworks support?",
      a: "Navisworks runs on Windows.",
    },
    {
      q: "Which file formats does Navisworks support?",
      a: "Navisworks works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Navisworks?",
      a: "The closest alternatives within the Viewer space are Solibri, Bluebeam Revu, Recap Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Autodesk Navisworks",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["NWD", "NWC", "IFC"],
  },
  expert_verdict:
    "Navisworks is where Virtual Design and Construction happens.",
}, {
  id: "t36",
  name: "Solibri",
  slug: "solibri",
  logo_url: getLogo("SL"),
  short_desc: "The BIM quality assurance and QC leader.",
  description:
    "Solibri is the market leader in BIM Quality Assurance and Quality Control. It provides tools for BIM managers to check for model integrity and coordination issues.",
  pricing_tiers: [
    {
      name: "Office",
      price: "3500",
      period: "/yr",
      features: ["Full Rule Checking", "QC Manager", "Team collab"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Checking",
      items: [
        { name: "Rule-based Checking", status: true },
        { name: "Clash detection", status: true },
        { name: "Model Comparison", status: true },
      ],
    },
    {
      category: "Information",
      items: [
        { name: "Takeoff", status: true },
        { name: "Data Mining", status: true },
        { name: "Report Gen.", status: true },
      ],
    },
  ],
  alternatives: ["navisworks", "recap-pro", "bluebeam-revu"],
  country: "USA",
  category_id: "c4",
  pricing_type: "Subscription",
  starting_price: 3500,
  platforms: ["Windows", "macOS"],
  industries: ["AEC", "BIM Management"],
  core_features: [
    "Rule-based Checking",
    "Information Takeoff",
    "Clash Detection",
  ],
  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.solibri.com",
  affiliate_url: null,
  score: 4.7,
  pros: ["Deepest validation rules", "Clean UI", "Open BIM native"],
  cons: ["Expensive", "IFC data quality dependent", "Complex rule custom"],
  faqs: [
    {
      q: "What is Solibri used for?",
      a: "The BIM quality assurance and QC leader. Solibri is a CAD viewer solution widely adopted in AEC, BIM Management.",
    },
    {
      q: "How much does Solibri cost?",
      a: "Solibri starts at $3,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Solibri?",
      a: "Solibri is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Solibri support?",
      a: "Solibri runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Solibri support?",
      a: "Solibri works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Solibri?",
      a: "The closest alternatives within the Viewer space are Navisworks, Recap Pro, Bluebeam Revu. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Solibri IFC Engine",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["IFC", "BCF", "DWG"],
  },
  expert_verdict: "Solibri finds logical errors that other tools miss.",
}, {
  id: "t37",
  name: "MeshLab",
  slug: "meshlab",
  logo_url: getLogo("ML"),
  short_desc: "Open-source system for processing 3D meshes.",
  description:
    "MeshLab is an open-source, portable, and extensible system for the processing and editing of unstructured 3D triangular meshes.",
  pricing_tiers: [
    {
      name: "Community",
      price: "0",
      period: "/yr",
      features: ["Open source", "Mesh editing", "Point cloud"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Editing",
      items: [
        { name: "Mesh Cleaning", status: true },
        { name: "Smoothing", status: true },
        { name: "Decimation", status: true },
      ],
    },
  ],
  alternatives: ["magics", "blender", "solid-edge-viewer"],
  country: "USA",
  category_id: "c4",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Research", "Archaeology", "3D Printing"],
  core_features: [
    "Mesh Cleaning",
    "Surface Reconstruction",
    "Point Cloud to Mesh",
  ],
  user_scales: ["Individuals", "Education"],
  official_url: "https://www.meshlab.net",
  affiliate_url: null,
  score: 4.1,
  pros: ["Vast mesh filters", "Completely free", "Point cloud handling"],
  cons: ["Unstable (crashes)", "Complex UI", "Legacy UX"],
  faqs: [
    {
      q: "What is MeshLab used for?",
      a: "Open-source system for processing 3D meshes. MeshLab is a CAD viewer solution widely adopted in Research, Archaeology, 3D Printing.",
    },
    {
      q: "How much does MeshLab cost?",
      a: "MeshLab is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is MeshLab really free?",
      a: "Yes — MeshLab is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does MeshLab support?",
      a: "MeshLab runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does MeshLab support?",
      a: "MeshLab works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MeshLab?",
      a: "The closest alternatives within the Viewer space are Magics, Blender, Solid Edge Viewer. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "VCG Library",
    multicore: "Low",
    gpu_optimization: "OpenGL",
    standards: ["OBJ", "STL", "PLY"],
  },
  expert_verdict:
    "The 'Photoshop' of 3D meshes, with the UX of a science experiment.",
}, {
  id: "t38",
  name: "Magics",
  slug: "magics",
  logo_url: getLogo("MG"),
  short_desc: "Data and build preparation for 3D printing.",
  description:
    "Materialise Magics is the most powerful STL editor for additive manufacturing. It allows users to fix file errors and generate support structures.",
  pricing_tiers: [
    {
      name: "Essential",
      price: "5000",
      period: "/yr",
      features: ["STL Repair", "Support generation", "Build tray"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Repair",
      items: [
        { name: "STL Fixer", status: true },
        { name: "Watertight check", status: true },
        { name: "Face editing", status: true },
      ],
    },
    {
      category: "Additive",
      items: [
        { name: "Auto-nesting", status: true },
        { name: "Support generation", status: true },
        { name: "Slicing engine", status: true },
      ],
    },
  ],
  alternatives: ["meshlab", "siemens-nx", "mastercam"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 5000,
  platforms: ["Windows"],
  industries: ["Additive Manufacturing", "Medical", "Aerospace"],
  core_features: [
    "STL Repair",
    "Support Structure Generation",
    "Build Tray Opt",
  ],
  user_scales: ["Enterprise", "Service Bureaus"],
  official_url: "https://www.materialise.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Unbeatable STL repair",
    "Metal printing supports",
    "Cost estimation",
  ],
  cons: [
    "Extremely expensive",
    "Specialized knowledge req",
    "Steep learning",
  ],
  faqs: [
    {
      q: "What is Magics used for?",
      a: "Data and build preparation for 3D printing. Magics is a CAE / CAM solution widely adopted in Additive Manufacturing, Medical, Aerospace.",
    },
    {
      q: "How much does Magics cost?",
      a: "Magics starts at $5,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Magics?",
      a: "Magics is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Magics support?",
      a: "Magics runs on Windows.",
    },
    {
      q: "Which file formats does Magics support?",
      a: "Magics works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Magics?",
      a: "The closest alternatives within the CAE/CAM space are MeshLab, Siemens NX, Mastercam. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Materialise Geometric Engine",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["STL", "3MF", "STEP"],
  },
  expert_verdict:
    "Magics is the industrial benchmark for fixable unprintable meshes.",
}, {
  id: "t39",
  name: "Recap Pro",
  slug: "recap-pro",
  logo_url: getLogo("RC"),
  short_desc: "Reality capture and 3D scanning software.",
  description:
    "Autodesk ReCap Pro converts laser scans and photos into 3D models or point clouds. It is essential for scan-to-BIM workflows.",
  pricing_tiers: [
    {
      name: "Annual",
      price: "360",
      period: "/yr",
      features: ["Scan registration", "Photo-to-3D", "Cloud sync"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Scans",
      items: [
        { name: "Automatic Reg", status: true },
        { name: "Cleanup tools", status: true },
        { name: "Point cloud edit", status: true },
      ],
    },
  ],
  alternatives: ["meshlab", "solibri", "navisworks"],
  country: "USA",
  category_id: "c4",
  pricing_type: "Subscription",
  starting_price: 360,
  platforms: ["Windows"],
  industries: ["AEC", "Surveying", "Infrastructure"],
  core_features: ["Point Cloud Registration", "Photo to 3D", "Scan-to-BIM"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.autodesk.com/recap",
  affiliate_url: null,
  score: 4.6,
  pros: ["Best Revit integration", "Modern UI", "Photogrammetry results"],
  cons: [
    "Cloud credits dependency",
    "Limited manual editing",
    "Subscription only",
  ],
  faqs: [
    {
      q: "What is Recap Pro used for?",
      a: "Reality capture and 3D scanning software. Recap Pro is a CAD viewer solution widely adopted in AEC, Surveying, Infrastructure.",
    },
    {
      q: "How much does Recap Pro cost?",
      a: "Recap Pro starts at $360 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Recap Pro?",
      a: "Recap Pro is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Recap Pro support?",
      a: "Recap Pro runs on Windows.",
    },
    {
      q: "Which file formats does Recap Pro support?",
      a: "Recap Pro works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Recap Pro?",
      a: "The closest alternatives within the Viewer space are MeshLab, Solibri, Navisworks. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Autodesk Reality",
    multicore: "Excellent",
    gpu_optimization: "High",
    standards: ["RCP", "RCS", "E57"],
  },
  expert_verdict: "The gateway to reality capture in the BIM world.",
}, {
  id: "t40",
  name: "OpenCASCADE",
  slug: "opencascade",
  logo_url: getLogo("OC"),
  short_desc: "The open-source geometry kernel for CAD developers.",
  description:
    "Open CASCADE Technology (OCCT) is an open-source development platform for 3D CAD/CAM/CAE. It provides a geometry modeling kernel and data exchange tools.",
  pricing_tiers: [
    {
      name: "Open Source",
      price: "0",
      period: "/yr",
      features: ["B-Rep kernel", "Visualization", "Data exchange"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Kernel",
      items: [
        { name: "B-Rep Modeler", status: true },
        { name: "STEP/IGES Lib", status: true },
        { name: "Visualization", status: true },
      ],
    },
  ],
  alternatives: ["freecad", "siemens-nx", "solidcam"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Software Dev", "Research"],
  core_features: [
    "B-Rep Modeling Kernel",
    "Data Exchange",
    "Visualization Lib",
  ],
  user_scales: ["Individuals", "Enterprise"],
  official_url: "https://www.opencascade.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Complete free B-Rep kernel",
    "Foundation of FreeCAD",
    "Customizable",
  ],
  cons: ["Very hard to learn", "C++ knowledge req", "Basic documentation"],
  faqs: [
    {
      q: "What is OpenCASCADE used for?",
      a: "The open-source geometry kernel for CAD developers. OpenCASCADE is a CAE / CAM solution widely adopted in Software Dev, Research.",
    },
    {
      q: "How much does OpenCASCADE cost?",
      a: "OpenCASCADE is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is OpenCASCADE really free?",
      a: "Yes — OpenCASCADE is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does OpenCASCADE support?",
      a: "OpenCASCADE runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does OpenCASCADE support?",
      a: "OpenCASCADE works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to OpenCASCADE?",
      a: "The closest alternatives within the CAE/CAM space are FreeCAD, Siemens NX, SolidCAM. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "OpenCASCADE Kernel",
    multicore: "High",
    gpu_optimization: "Customizable",
    standards: ["STEP", "IGES", "B-Rep"],
  },
  expert_verdict: "The most important open-source project in CAD history.",
}, {
  id: "t41",
  name: "VariCAD",
  slug: "varicad",
  logo_url: getLogo("VC"),
  short_desc: "Compact CAD system for mechanical engineering.",
  description:
    "VariCAD is a compact 3D/2D CAD system for mechanical engineering.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "700",
      period: "initial",
      features: ["Fast performance", "Native Linux", "Standard parts"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Modeling",
      items: [
        { name: "3D Modeling", status: true },
        { name: "2D Drafting", status: true },
        { name: "Standard Parts", status: true },
      ],
    },
  ],
  alternatives: ["freecad", "solidworks", "alibre-design"],
  country: "USA",
  category_id: "c2",
  pricing_type: "Perpetual",
  starting_price: 700,
  platforms: ["Windows", "Linux"],
  industries: ["Mechanical", "Hobbyist"],
  core_features: ["3D Modeling", "2D Drafting", "Standard Parts Lib"],
  user_scales: ["Individuals", "Small Business"],
  official_url: "https://www.varicad.com",
  affiliate_url: null,
  score: 4.0,
  pros: ["Fast performance", "Native Linux support", "Affordable perpetual"],
  cons: ["Non-standard UI", "Basic visuals", "Small community"],
  faqs: [
    {
      q: "What is VariCAD used for?",
      a: "Compact CAD system for mechanical engineering. VariCAD is a 3D modeling solution widely adopted in Mechanical, Hobbyist.",
    },
    {
      q: "How much does VariCAD cost?",
      a: "VariCAD starts at $700 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of VariCAD?",
      a: "VariCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does VariCAD support?",
      a: "VariCAD runs on Windows and Linux.",
    },
    {
      q: "Which file formats does VariCAD support?",
      a: "VariCAD works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to VariCAD?",
      a: "The closest alternatives within the 3D Modeling space are FreeCAD, SolidWorks, Alibre Design. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "VariCAD Custom",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["STEP", "IGES", "STL"],
  },
  expert_verdict:
    "A robust choice for individual mechanical engineers on Linux.",
}, {
  id: "t42",
  name: "Eagle",
  slug: "eagle",
  logo_url: getLogo("EG"),
  short_desc: "PCB design software integrated with Fusion 360.",
  description:
    "EAGLE is an EDA software for PCB design, now part of Autodesk Fusion 360.",
  pricing_tiers: [
    {
      name: "Subscription",
      price: "680",
      period: "/yr",
      features: ["Fusion 360 link", "SPICE", "Library"],
      is_popular: true,
    },
  ],
  detailed_features: [
    {
      category: "Electronics",
      items: [
        { name: "Schematic Edit", status: true },
        { name: "PCB Layout", status: true },
        { name: "Auto-router", status: true },
      ],
    },
  ],
  alternatives: [
    "altium-designer",
    "eplan-electric-p8",
    "synopsys-fusion-compiler",
  ],
  country: "USA",
  category_id: "c6",
  pricing_type: "Subscription",
  starting_price: 680,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Electronics", "IoT", "Education"],
  core_features: [
    "Schematic-to-PCB Link",
    "Library Management",
    "SPICE Simulation",
  ],
  user_scales: ["Individuals", "Small Business"],
  official_url: "https://www.autodesk.com/eagle",
  affiliate_url: null,
  score: 4.6,
  pros: ["Fusion 360 MCAD link", "Massive library support", "Cross-platform"],
  cons: [
    "Subscription only",
    "Interface quirky",
    "Replaced by Fusion Electronics",
  ],
  faqs: [
    {
      q: "What is Eagle used for?",
      a: "PCB design software integrated with Fusion 360. Eagle is an EDA solution widely adopted in Electronics, IoT, Education.",
    },
    {
      q: "How much does Eagle cost?",
      a: "Eagle starts at $680 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Eagle?",
      a: "Eagle is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Eagle support?",
      a: "Eagle runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does Eagle support?",
      a: "Eagle works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Eagle?",
      a: "The closest alternatives within the EDA space are Altium Designer, EPLAN Electric P8, Synopsys Fusion Compiler. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "EAGLE Core",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["Gerber", "STEP", "IPC"],
  },
  expert_verdict: "The standard for mid-level professional PCB design.",
}, {
  id: "t43",
  name: "CADra",
  slug: "cadra",
  logo_url: getLogo("CDR"),
  short_desc: "High-end 2D CAD for drafting automation.",
  description:
    "CADra is a professional 2D drafting system used for high-end design automation.",
  country: "USA",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 1500,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Automation"],
  core_features: [
    "Programmable Commands",
    "Extreme Drafting Speed",
    "Native DWG",
  ],
  user_scales: ["Enterprise"],
  official_url: "https://www.adra.com",
  affiliate_url: null,
  score: 4.0,
  pros: [
    "Massive schematic speed",
    "Highly programmable",
    "Legacy platform reliability",
  ],
  cons: ["Niche and expensive", "Old-school UI", "Limited BIM"],
  faqs: [
    {
      q: "What is CADra used for?",
      a: "High-end 2D CAD for drafting automation. CADra is a 2D CAD solution widely adopted in Manufacturing, Automation.",
    },
    {
      q: "How much does CADra cost?",
      a: "CADra starts at $1,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CADra?",
      a: "CADra is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CADra support?",
      a: "CADra runs on Windows.",
    },
    {
      q: "Which file formats does CADra support?",
      a: "CADra works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CADra?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, nanoCAD, MicroStation. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Custom",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["DWG", "DXF"],
  },
  expert_verdict: "A specialized tool for manufacturing automation.",
}, {
  id: "t44",
  name: "Civil 3D",
  slug: "civil-3d",
  logo_url: getLogo("C3"),
  short_desc: "Civil engineering design and documentation software.",
  description: "Civil 3D supports BIM for enhanced civil engineering design.",
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 2615,
  platforms: ["Windows"],
  industries: ["Civil Engineering", "Transportation"],

  core_features: [
    "Civil Infrastructure",
    "Road/Highway Design",
    "Grading Optimization",
    "Pipe Network Design",
    "BIM for Civil",
  ],

  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.autodesk.com/civil-3d",
  affiliate_url: null,
  score: 4.8,
  pros: ["Road design standard", "Dynamic objects", "Infra BIM essential"],
  cons: ["Prone to crashes", "Steep learning curve", "Expensive"],
  faqs: [
    {
      q: "What is Civil 3D used for?",
      a: "Civil engineering design and documentation software. Civil 3D is a BIM solution widely adopted in Civil Engineering, Transportation.",
    },
    {
      q: "How much does Civil 3D cost?",
      a: "Civil 3D starts at $2,615 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Civil 3D?",
      a: "Civil 3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Civil 3D support?",
      a: "Civil 3D runs on Windows.",
    },
    {
      q: "Which file formats does Civil 3D support?",
      a: "Civil 3D works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Civil 3D?",
      a: "The closest alternatives within the BIM space are Revit, OpenRoads Designer, ArchiCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Autodesk ShapeManager (ASM)",
    multicore: "Low",
    gpu_optimization: "DirectX",
    standards: ["DWG", "IFC", "LandXML"],
  },

  expert_verdict: "The industry standard for civil engineering projects.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "330",
      period: "/mo",

      features: [
        "Road & Highway design",
        "Parcel & Grading",
        "Gravity & Pressure Pipe",
        "Dynamic Alignment",
      ],

      is_popular: false,
    },
    {
      name: "Annual",
      price: "2,645",
      period: "/yr",

      features: [
        "Full BIM integration",
        "Project Explorer",
        "Grading Optimization",
        "Technical Support",
      ],

      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Design & Modeling",

      items: [
        {
          name: "Dynamic Alignment & Profiles",
          status: true,
        },
        {
          name: "Corridor Modeling",
          status: true,
        },
        {
          name: "Grading Optimization Tools",
          status: true,
        },
        {
          name: "Pressure Pipe Networks",
          status: true,
        },
      ],
    },
    {
      category: "Analysis & Data",

      items: [
        {
          name: "Project Explorer for Civil 3D",
          status: true,
        },
        {
          name: "Storm & Sanitary Analysis",
          status: true,
        },
        {
          name: "Geotechnical Modeler",
          status: true,
        },
        {
          name: "Infraworks Interoperability",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t46",
  name: "Chief Architect Pro",
  slug: "chief-architect-pro",
  logo_url: getLogo("CAP"),
  short_desc: "High-end 3D home design for professionals.",
  description:
    "Chief Architect Pro specializes in advanced residential and light commercial design.",
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 1995,
  platforms: ["Windows", "macOS"],
  industries: ["Residential Design", "Remodeling"],
  core_features: ["Residential Design", "3D Visualization"],
  user_scales: ["Small Business", "Agencies"],
  official_url: "https://www.chiefarchitect.com",
  affiliate_url: null,
  score: 4.8,
  pros: ["Remodeling standard", "Kitchen design speed", "macOS support"],
  cons: ["Not for mechanical", "Steep learning", "Expensive"],
  faqs: [
    {
      q: "What is Chief Architect Pro used for?",
      a: "High-end 3D home design for professionals. Chief Architect Pro is a BIM solution widely adopted in Residential Design, Remodeling.",
    },
    {
      q: "How much does Chief Architect Pro cost?",
      a: "Chief Architect Pro starts at $1,995 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Chief Architect Pro?",
      a: "Chief Architect Pro is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Chief Architect Pro support?",
      a: "Chief Architect Pro runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Chief Architect Pro support?",
      a: "Chief Architect Pro works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Chief Architect Pro?",
      a: "The closest alternatives within the BIM space are Chief Architect, ArchiCAD, Allplan. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["IFC", "DWG", "OBJ"],
  },

  expert_verdict: "The money-making machine for home builders.",

  pricing_tiers: [
    {
      name: "Premier",
      price: "1,995",
      period: "/yr",
      features: ["Professional AEC", "Rendering", "CAD Tools"],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "AEC",

      items: [
        {
          name: "Smart Objects",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t48",
  name: "Solid Edge Viewer",
  slug: "solid-edge-viewer",
  logo_url: getLogo("SEV"),
  short_desc: "Free viewer for Solid Edge and 2D CAD files.",
  description: "View Solid Edge assemblies, parts, and drafts for free.",
  country: "USA",
  category_id: "c4",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Manufacturing", "General"],
  core_features: ["3D Rotation", "Measurement", "Sectioning"],
  user_scales: ["Individuals", "Mid-Market"],
  official_url: "https://www.siemens.com",
  affiliate_url: null,
  score: 4.2,
  pros: ["Free for all", "Official file support", "Measurement tools"],
  cons: ["Windows only", "No editing", "Large install"],
  faqs: [
    {
      q: "What is Solid Edge Viewer used for?",
      a: "Free viewer for Solid Edge and 2D CAD files. Solid Edge Viewer is a CAD viewer solution widely adopted in Manufacturing, General.",
    },
    {
      q: "How much does Solid Edge Viewer cost?",
      a: "Solid Edge Viewer is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is Solid Edge Viewer really free?",
      a: "Yes — Solid Edge Viewer is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does Solid Edge Viewer support?",
      a: "Solid Edge Viewer runs on Windows.",
    },
    {
      q: "Which file formats does Solid Edge Viewer support?",
      a: "Solid Edge Viewer works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Solid Edge Viewer?",
      a: "The closest alternatives within the Viewer space are DWG TrueView, MeshLab, Recap Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Siemens JT",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["PAR", "ASM", "DWG"],
  },
  expert_verdict: "The standard for viewing Solid Edge data in production.",
}, {
  id: "t49",
  name: "DWG TrueView",
  slug: "dwg-trueview",
  logo_url: getLogo("TV"),
  short_desc: "Official free DWG viewer and converter.",
  description:
    "The official viewer for DWG files, built on the AutoCAD engine.",
  country: "USA",
  category_id: "c4",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Architecture", "Engineering"],
  core_features: ["Native DWG viewing", "DWG conversion", "Layer control"],
  user_scales: ["Individuals", "Enterprise"],
  official_url: "https://www.autodesk.com",
  affiliate_url: null,
  score: 4.3,
  pros: ["Most accurate viewer", "TrueConvert included", "100% Free"],
  cons: ["Heavy install", "No macOS", "No mark-up"],
  faqs: [
    {
      q: "What is DWG TrueView used for?",
      a: "Official free DWG viewer and converter. DWG TrueView is a CAD viewer solution widely adopted in Architecture, Engineering.",
    },
    {
      q: "How much does DWG TrueView cost?",
      a: "DWG TrueView is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is DWG TrueView really free?",
      a: "Yes — DWG TrueView is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does DWG TrueView support?",
      a: "DWG TrueView runs on Windows.",
    },
    {
      q: "Which file formats does DWG TrueView support?",
      a: "DWG TrueView works with standard CAD viewer interchange formats including STEP, IGES, JT, and 3D PDF for viewing. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to DWG TrueView?",
      a: "The closest alternatives within the Viewer space are Solid Edge Viewer, MeshLab, Recap Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AutoCAD Core",
    multicore: "Low",
    gpu_optimization: "DirectX",
    standards: ["DWG", "DXF"],
  },
  expert_verdict: "The essential utility for DWG version management.",
}, {
  id: "t50",
  name: "Maya",
  slug: "maya",
  logo_url: getLogo("MY"),
  short_desc: "3D animation, modeling, and simulation software.",
  description:
    "Maya is professional 3D software for creating realistic characters and effects.",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 1875,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["VFX", "Gaming", "Animation"],

  core_features: [
    "Character Animation",
    "3D Modeling",
    "Dynamics & Effects",
    "Rendering",
    "Pipeline Integration",
  ],

  user_scales: ["Enterprise", "Agencies"],
  official_url: "https://www.autodesk.com/maya",
  affiliate_url: null,
  score: 4.9,
  pros: ["Industry VFX standard", "Node-based power", "Linux support"],
  cons: ["Steep learning", "High cost", "Not for engineering"],
  faqs: [
    {
      q: "What is Maya used for?",
      a: "3D animation, modeling, and simulation software. Maya is a 3D modeling solution widely adopted in VFX, Gaming, Animation.",
    },
    {
      q: "How much does Maya cost?",
      a: "Maya starts at $1,875 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Maya?",
      a: "Maya is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Maya support?",
      a: "Maya runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does Maya support?",
      a: "Maya works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Maya?",
      a: "The closest alternatives within the 3D Modeling space are SolidWorks, PTC Creo, CATIA. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Maya Nucleus",
    multicore: "High",
    gpu_optimization: "CUDA",
    standards: ["FBX", "USD", "OBJ"],
  },

  expert_verdict: "The power user's choice for Hollywood effects.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "235",
      period: "/mo",

      features: [
        "Character Animation",
        "Bifrost for Maya",
        "Arnold Renderer",
        "Advanced Rigging",
      ],

      is_popular: true,
    },
    {
      name: "Annual",
      price: "1,875",
      period: "/yr",

      features: [
        "Full Motion Graphics",
        "USD integration",
        "Interactive Grooming",
        "Technical Support",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Animation & Rigging",

      items: [
        {
          name: "Matrix-driven Rigging",
          status: true,
        },
        {
          name: "Cached Playback",
          status: true,
        },
        {
          name: "Automated Shape Authoring",
          status: true,
        },
        {
          name: "Ghosting Editor",
          status: true,
        },
      ],
    },
    {
      category: "Dynamics & Rendering",

      items: [
        {
          name: "Bifrost Visual Programming",
          status: true,
        },
        {
          name: "Integrated Arnold Renderer",
          status: true,
        },
        {
          name: "MASH Procedural effects",
          status: true,
        },
        {
          name: "XGen Interactive Grooming",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t51",
  name: "Blender",
  slug: "blender",
  logo_url: getLogo("BL"),
  short_desc: "The free and open-source 3D creation suite.",
  description:
    "Blender supports the entirety of the 3D pipeline for modeling and animation.",
  country: "USA",
  category_id: "c2",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Indie Games", "VFX", "Hobbyist"],

  core_features: [
    "Open Source 3D",
    "Geometry Nodes",
    "Sculpting",
    "VFX/Compositing",
    "2D Animation (Grease Pencil)",
  ],

  user_scales: ["Individuals", "Startups"],
  official_url: "https://www.blender.org",
  affiliate_url: null,
  score: 4.8,
  pros: ["100% Free", "Cycles production renderer", "Rapid development"],
  cons: ["Non-standard UI", "Lacks NURBS precision", "Not for CAD/CAM"],
  faqs: [
    {
      q: "What is Blender used for?",
      a: "The free and open-source 3D creation suite. Blender is a 3D modeling solution widely adopted in Indie Games, VFX, Hobbyist.",
    },
    {
      q: "How much does Blender cost?",
      a: "Blender is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is Blender really free?",
      a: "Yes — Blender is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does Blender support?",
      a: "Blender runs on Windows, macOS, and Linux. Deployment options include desktop.",
    },
    {
      q: "Which file formats does Blender support?",
      a: "Blender imports BLEND, OBJ, FBX, glTF, GLB, USD and more. Export covers BLEND, OBJ, FBX, glTF, GLB, USD and more.",
    },
    {
      q: "Does Blender have an API for automation and customization?",
      a: "Yes. Blender exposes Python API with SDK bindings for Python, C, C++. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines; full reference docs are published by the vendor.",
    },
  ],

  tech_specs: {
    engine: "Cycles / Eevee",
    multicore: "High",
    gpu_optimization: "OptiX",
    standards: ["BLEND", "FBX", "STL"],
  },

  expert_verdict:
    "Disrupting the professional 3D industry with open-source power.",

  pricing_tiers: [
    {
      name: "Free & Open Source",
      price: "0",
      period: "/forever",
      features: [
        "Full 3D Suite",
        "Cycles Renderer",
        "Geometry Nodes",
        "Community Support",
      ],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Creation Suite",

      items: [
        {
          name: "Cycles Path Tracer",
          status: true,
        },
        {
          name: "Geometry Nodes (Procedural)",
          status: true,
        },
        {
          name: "Grease Pencil (2D in 3D)",
          status: true,
        },
        {
          name: "Real-time Eevee Engine",
          status: true,
        },
      ],
    },
    {
      category: "Sculpting & VFX",

      items: [
        {
          name: "Dynamic Topology Sculpting",
          status: true,
        },
        {
          name: "Integrated Compositor",
          status: true,
        },
        {
          name: "Camera Tracking",
          status: true,
        },
        {
          name: "Python API for addons",
          status: true,
        },
      ],
    },
  ],

  version: "4.5 LTS",
  last_updated: "2025-11-15",
  free_trial_days: 0,

  languages: [
    "English",
    "French",
    "German",
    "Italian",
    "Spanish",
    "Japanese",
    "Korean",
    "Simplified Chinese",
    "Traditional Chinese",
    "Russian",
    "Arabic",
    "Czech",
    "Dutch",
    "Polish",
    "Portuguese",
    "Turkish",
    "Ukrainian",
  ],

  file_formats_in: [
    "BLEND",
    "OBJ",
    "FBX",
    "glTF",
    "GLB",
    "USD",
    "USDZ",
    "COLLADA",
    "STL",
    "PLY",
    "X3D",
    "ABC",
    "DAE",
    "SVG",
  ],

  file_formats_out: [
    "BLEND",
    "OBJ",
    "FBX",
    "glTF",
    "GLB",
    "USD",
    "USDZ",
    "COLLADA",
    "STL",
    "PLY",
    "X3D",
    "ABC",
    "MP4",
    "PNG",
    "EXR",
  ],

  integrations: [
    "Cycles",
    "Eevee",
    "Geometry Nodes",
    "GitHub",
    "Unity",
    "Unreal Engine",
    "Adobe Substance",
    "OpenColorIO",
    "OpenSubdiv",
  ],

  deployment_options: ["Desktop"],
  license_types: ["Open-Source", "Free"],

  external_ratings: [
    {
      source: "G2",
      score: 4.6,
      max: 5,
      count: 270,
      url: "https://www.g2.com/products/blender/reviews",
    },
    {
      source: "Capterra",
      score: 4.6,
      max: 5,
      count: 1000,
      url: "https://www.capterra.com/p/175170/Blender/",
    },
    {
      source: "TrustRadius",
      score: 9,
      max: 10,
      count: 120,
      url: "https://www.trustradius.com/products/blender/reviews",
    },
  ],

  support_channels: ["Community", "Documentation", "Training"],
  security_compliance: [],

  api_sdk: {
    has_api: true,
    has_sdk: true,
    api_type: "Python API",
    sdk_languages: ["Python", "C", "C++"],
    docs_url: "https://docs.blender.org/api/current/",
  },
}, {
  id: "t52",
  name: "SolveSpace Pro",
  slug: "solvespace-pro",
  logo_url: getLogo("SSP"),
  short_desc: "Constraint-based 2D/3D parametric CAD.",
  description:
    "SolveSpace is a minimalist modeler for precise geometric parts.",
  country: "USA",
  category_id: "c2",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Education", "Makers", "Mechanical"],
  core_features: ["Constraint Solver", "Geometric Logic", "STEP Export"],
  user_scales: ["Individuals"],
  official_url: "https://solvespace.com",
  affiliate_url: null,
  score: 4.3,
  pros: ["Extremely fast", "Pure geometric logic", "Completely free"],
  cons: ["No assembly", "Hard for organic", "Slow complex rendering"],
  faqs: [
    {
      q: "What is SolveSpace Pro used for?",
      a: "Constraint-based 2D/3D parametric CAD. SolveSpace Pro is a 3D modeling solution widely adopted in Education, Makers, Mechanical.",
    },
    {
      q: "How much does SolveSpace Pro cost?",
      a: "SolveSpace Pro is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is SolveSpace Pro really free?",
      a: "Yes — SolveSpace Pro is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does SolveSpace Pro support?",
      a: "SolveSpace Pro runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does SolveSpace Pro support?",
      a: "SolveSpace Pro works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SolveSpace Pro?",
      a: "The closest alternatives within the 3D Modeling space are FreeCAD, OpenSCAD, SolveSpace. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Custom",
    multicore: "Low",
    gpu_optimization: "None",
    standards: ["STEP", "STL", "DXF"],
  },
  expert_verdict:
    "The ultimate tool for engineers who value geometric purity.",
}, {
  id: "t53",
  name: "DWG FastView",
  slug: "dwg-fastview",
  logo_url:
    "https://en.dwgfastview.com/wp-content/themes/gstarcad-en/images/logo.png",
  short_desc: "Lightweight cross-platform CAD viewer & editor.",

  description:
    "DWG FastView allows you to view and edit CAD drawings on mobile, web, and desktop with extreme speed and cloud synchronization.",

  country: "USA",
  category_id: "c1",
  pricing_type: "Freemium",
  starting_price: 0,
  platforms: ["Windows", "Mobile", "Web"],
  industries: ["Construction", "Real Estate", "Architecture"],

  core_features: [
    "Mobile DWG Viewer",
    "Cloud Sync",
    "3D Format Support",
    "Basic Editing",
    "Annotations",
  ],

  user_scales: ["Individuals", "Small Business"],
  official_url: "https://en.dwgfastview.com",
  affiliate_url: null,
  score: 4.6,
  pros: ["Super fast on mobile", "Good cloud sync", "Free basic version"],
  cons: ["Subscription for Pro", "Ads in free version", "Limited 3D"],
  faqs: [
    {
      q: "What is DWG FastView used for?",
      a: "Lightweight cross-platform CAD viewer & editor. DWG FastView is a 2D CAD solution widely adopted in Construction, Real Estate, Architecture.",
    },
    {
      q: "How much does DWG FastView cost?",
      a: "DWG FastView is offered on a freemium model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of DWG FastView?",
      a: "DWG FastView is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does DWG FastView support?",
      a: "DWG FastView runs on Windows, Mobile, and Web. The browser-based experience requires no local install.",
    },
    {
      q: "Which file formats does DWG FastView support?",
      a: "DWG FastView works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to DWG FastView?",
      a: "The closest alternatives within the 2D CAD space are QCAD, ZWCAD, TurboCAD Platinum. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "GstarCAD Core",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["DWG", "DXF"],
  },

  expert_verdict:
    "The definitive mobile CAD viewer for professionals on the move.",

  detailed_features: [
    {
      category: "Viewing & Export",

      items: [
        {
          name: "2D/3D DWG & DXF Support",
          status: true,
        },
        {
          name: "RVT/STEP/SLDPRT Viewing",
          status: true,
        },
        {
          name: "PDF/Image Export",
          status: true,
        },
        {
          name: "Garbled Text Auto-fix",
          status: true,
        },
      ],
    },
    {
      category: "Tools & Cloud",

      items: [
        {
          name: "Cloud Multi-device Sync",
          status: true,
        },
        {
          name: "Measurement & Dimensioning",
          status: true,
        },
        {
          name: "Layer Management",
          status: true,
        },
        {
          name: "External Reference (Xref)",
          status: true,
        },
      ],
    },
  ],

  pricing_tiers: [
    {
      name: "Free",
      price: "0",
      period: "/forever",
      features: [
        "Basic Viewing",
        "Limited Editing",
        "Cloud Sync",
        "Annotations",
      ],
      is_popular: false,
    },
    {
      name: "Premium Monthly",
      price: "4.99",
      period: "/mo",
      features: [
        "All 3D Formats",
        "No Ads",
        "Advanced Editing",
        "Batch Plotting",
      ],
      is_popular: false,
    },
    {
      name: "Premium Annual",
      price: "47",
      period: "/yr",

      features: [
        "Best Value",
        "Priority Support",
        "Full Mobile access",
        "Professional Tools",
      ],

      is_popular: true,
    },
  ],
}, {
  id: "t54",
  name: "GstarCAD",
  slug: "gstarcad",
  logo_url: "https://www.gstarcad.net/Public/Home/images/logo.png",
  short_desc: "High-performance AutoCAD alternative.",

  description:
    "GstarCAD is built on an independent core, offering 99% compatibility with AutoCAD and superior speed for large drawings.",

  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 499,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Mechanical", "Construction"],
  core_features: [
    "Native DWG Support",
    "High Performance Core",
    "AutoCAD Command Support",
  ],
  user_scales: ["Small Team", "Enterprise"],
  official_url: "https://www.gstarcad.net",
  affiliate_url: null,
  score: 4.8,
  pros: ["Extremely fast core", "One-time cost", "Native compatibility"],
  cons: ["Windows only", "Brand awareness in West", "Fewer add-ons"],
  faqs: [
    {
      q: "What is GstarCAD used for?",
      a: "High-performance AutoCAD alternative. GstarCAD is a 2D CAD solution widely adopted in Manufacturing, Mechanical, Construction.",
    },
    {
      q: "How much does GstarCAD cost?",
      a: "GstarCAD starts at $499 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of GstarCAD?",
      a: "GstarCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does GstarCAD support?",
      a: "GstarCAD runs on Windows.",
    },
    {
      q: "Which file formats does GstarCAD support?",
      a: "GstarCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to GstarCAD?",
      a: "The closest alternatives within the 2D CAD space are progeCAD Professional, CADopia, CAXA CAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Independent Core",
    multicore: "High",
    gpu_optimization: "Ultra",
    standards: ["DWG", "DXF", "LISP"],
  },

  expert_verdict:
    "The top-performing AutoCAD clone for power users who hate lag.",

  pricing_breakdown: [
    {
      tier: "Standard",
      price: "~$600",
      notes: "Perpetual license",
    },
    {
      tier: "Professional",
      price: "~$900",
      notes: "Full 3D modeling support",
    },
    {
      tier: "Annual Update",
      price: "~$200",
      notes: "Optional upgrade fee",
    },
  ],

  key_capabilities: [
    "High-performance 2D/3D CAD",
    "Dynamic Block Support",
    "PDF to DWG Conversion",
    "Collaborative Design toolset",
    "Lisp/C++/VBA Support",
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "Extremely fast file opening & saving", status: true },
        { name: "Cloud storage integration", status: true },
        { name: "Mobile App (GstarCAD MC) integration", status: true },
        { name: "Batch Printing & File Comparison", status: true },
        { name: "Parametric Constraint support", status: true },
      ],
    },
  ],
}, {
  id: "t55",
  name: "QCAD",
  slug: "qcad",
  logo_url: "https://www.qcad.org/images/qcad_logo.png",
  short_desc: "The open-source 2D CAD standard for everyone.",
  description:
    "QCAD is a free, open-source application for computer-aided drafting (CAD) in two dimensions (2D). It is highly modular and extensible, supporting Windows, macOS, and Linux. QCAD is praised for its simplicity and focused toolset for technical drawings.",
  country: "USA",
  category_id: "c1",
  pricing_type: "Freemium",
  starting_price: 39,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["General Drafting", "Education", "Hobbyist"],
  core_features: [
    "Layer Management",
    "Block Support",
    "DXF/DWG Support",
    "Scripting Interface",
  ],
  user_scales: ["Individuals", "Small Business"],
  official_url: "https://www.qcad.org",
  affiliate_url: null,
  score: 4.4,
  pros: ["Open source core", "Very easy to learn", "Great for schematics"],
  cons: ["2D only", "Limited advanced automation", "Older UI style"],
  faqs: [
    {
      q: "What is QCAD used for?",
      a: "The open-source 2D CAD standard for everyone. QCAD is a 2D CAD solution widely adopted in General Drafting, Education, Hobbyist.",
    },
    {
      q: "How much does QCAD cost?",
      a: "QCAD starts at $39 per seat on a freemium license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of QCAD?",
      a: "QCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does QCAD support?",
      a: "QCAD runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does QCAD support?",
      a: "QCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to QCAD?",
      a: "The closest alternatives within the 2D CAD space are DWG FastView, ARES Commander, DraftSight. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Qt/QCAD",
    multicore: "Low",
    gpu_optimization: "None",
    standards: ["DXF", "DWG", "SVG"],
  },
  expert_verdict:
    "The go-to choice for cross-platform 2D drafting without the overhead of modern CAD bloat.",
}, {
  id: "t56",
  name: "nanoCAD",
  slug: "nanocad",
  logo_url:
    "https://nanocad.com/upload/medialibrary/900/9000a6f81e7d8d2b2707b1406e200844.png",
  short_desc: "Professional-grade 2D/3D CAD with powerful API.",
  description:
    "nanoCAD is a professional-grade CAD tool. It has a familiar interface, powerful drafting and design tools, native DWG compatibility, and an open API. It is designed to provide users with the best possible performance and modern features at a competitive price.",
  country: "Russia",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 200,
  platforms: ["Windows"],
  industries: ["Engineering", "Construction", "Manufacturing"],
  core_features: [
    "Native DWG Support",
    "Parametric 3D",
    "Excel Integration",
    "Open API (C++, .NET)",
  ],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://nanocad.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "High performance",
    "Robust API for customization",
    "Modern interface",
  ],
  cons: [
    "Windows only",
    "Subscription required for latest",
    "Steep learning curve for Pro",
  ],
  faqs: [
    {
      q: "What is nanoCAD used for?",
      a: "Professional-grade 2D/3D CAD with powerful API. nanoCAD is a 2D CAD solution widely adopted in Engineering, Construction, Manufacturing.",
    },
    {
      q: "How much does nanoCAD cost?",
      a: "nanoCAD starts at $200 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of nanoCAD?",
      a: "nanoCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does nanoCAD support?",
      a: "nanoCAD runs on Windows.",
    },
    {
      q: "Which file formats does nanoCAD support?",
      a: "nanoCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to nanoCAD?",
      a: "The closest alternatives within the 2D CAD space are AutoCAD, MicroStation, ARES Commander. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "nanoCAD Core",
    multicore: "High",
    gpu_optimization: "DirectX/OpenGL",
    standards: ["DWG", "IFC", "PDF"],
  },
  expert_verdict:
    "A formidable contender in the professional CAD market with one of the most flexible APIs available.",
}, {
  id: "t57",
  name: "progeCAD Professional",
  slug: "progecad",
  logo_url: "https://www.progecad.com/templates/progecad/images/logo.png",
  short_desc: "AutoCAD clone with PDF to DWG conversion.",
  description:
    "progeCAD is a 2D/3D DWG-native CAD for general-purpose drafting. The program offers very high compatibility with AutoCAD and delivers a complete set of CAD tools for drafting, design, and rendering.",
  country: "USA",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 399,
  platforms: ["Windows"],
  industries: ["Architecture", "Civil Engineering", "Mechanical"],
  core_features: [
    "PDF to DWG Converter",
    "3D Architectural Module",
    "EasyArch 3D Plugin",
    "iCADLib Block Manager",
  ],
  user_scales: ["Small Team", "Mid-Market"],
  official_url: "https://www.progecad.com",
  affiliate_url: null,
  score: 4.5,
  pros: ["Includes PDF-to-DWG", "Perpetual license", "Standard interface"],
  cons: [
    "Windows only",
    "Can be buggy with huge files",
    "Update cycle is annual",
  ],
  faqs: [
    {
      q: "What is progeCAD Professional used for?",
      a: "AutoCAD clone with PDF to DWG conversion. progeCAD Professional is a 2D CAD solution widely adopted in Architecture, Civil Engineering, Mechanical.",
    },
    {
      q: "How much does progeCAD Professional cost?",
      a: "progeCAD Professional starts at $399 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of progeCAD Professional?",
      a: "progeCAD Professional is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does progeCAD Professional support?",
      a: "progeCAD Professional runs on Windows.",
    },
    {
      q: "Which file formats does progeCAD Professional support?",
      a: "progeCAD Professional works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to progeCAD Professional?",
      a: "The closest alternatives within the 2D CAD space are CADopia, TurboCAD Platinum, CAXA CAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "IntelliCAD",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["DWG", "PDF", "DXF"],
  },
  expert_verdict:
    "The Swiss army knife of CAD clones, offering more utilities out-of-the-box than AutoCAD.",
}, {
  id: "t58",
  name: "IronCAD",
  slug: "ironcad",
  logo_url:
    "https://www.ironcad.com/wp-content/uploads/2018/10/ironcad-logo-1.png",
  short_desc: "The fastest way to 3D design and manufacturing.",

  description:
    "IronCAD is a leading provider of innovative 3D design productivity solutions. Its creative design approach provides levels of agility that are unattainable with today's standard parametric systems.",

  country: "USA",
  category_id: "c2",
  pricing_type: "Perpetual",
  starting_price: 3950,
  platforms: ["Windows"],
  industries: ["Industrial Design", "Machine Design", "Packaging"],

  core_features: [
    "Drag-and-Drop Design",
    "TriBall Interaction",
    "Unified Design Environment",
    "Non-history Modeling",
    "Large Assembly",
  ],

  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.ironcad.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Unmatched design speed",
    "Dual-kernel precision",
    "Flexible modeling",
  ],
  cons: ["Expensive", "Smaller user base", "Requires high-end GPU"],
  faqs: [
    {
      q: "What is IronCAD used for?",
      a: "The fastest way to 3D design and manufacturing. IronCAD is a 3D modeling solution widely adopted in Industrial Design, Machine Design, Packaging.",
    },
    {
      q: "How much does IronCAD cost?",
      a: "IronCAD starts at $3,950 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of IronCAD?",
      a: "IronCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does IronCAD support?",
      a: "IronCAD runs on Windows.",
    },
    {
      q: "Which file formats does IronCAD support?",
      a: "IronCAD works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to IronCAD?",
      a: "The closest alternatives within the 3D Modeling space are Rhino 3D, ZW3D, Alibre Design. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "ACIS & Parasolid",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["STEP", "SAT", "X_T"],
  },

  expert_verdict:
    "A radical alternative to history-based CAD that can triple design output for mechanical assemblies.",

  pricing_tiers: [
    {
      name: "Annual",
      price: "1,500",
      period: "/yr",

      features: [
        "Drag & Drop Modeling",
        "Unified Design Env",
        "TriBall Tool",
        "Full 3D Design",
      ],

      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Efficiency",

      items: [
        {
          name: "TriBall Versatile Tool",
          status: true,
        },
        {
          name: "Catalog-based Design",
          status: true,
        },
        {
          name: "Dual-engine (ACIS/Parasolid)",
          status: true,
        },
        {
          name: "Dynamic Handles",
          status: true,
        },
      ],
    },
    {
      category: "Workflow",

      items: [
        {
          name: "Single-scene Assembly",
          status: true,
        },
        {
          name: "Direct Feature Editing",
          status: true,
        },
        {
          name: "Automatic BOM Update",
          status: true,
        },
        {
          name: "Sheet Metal & Frame",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t59",
  name: "KeyCreator",
  slug: "keycreator",
  logo_url: "https://www.kubotekkosmos.com/images/keycreator-logo.png",
  short_desc: "Direct modeling CAD for fast manufacturing design.",
  description:
    "KeyCreator is a professional CAD software for direct modeling. It is designed for engineers who need to work with geometry from any source without worrying about history or constraints.",
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 1500,
  platforms: ["Windows"],
  industries: ["Tool & Die", "Mold Design", "Rapid Prototyping"],
  core_features: [
    "Direct Geometry Editing",
    "Universal CAD Importers",
    "Drafting & Detailing",
    "Assembly Management",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.kubotekkosmos.com",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Handles any CAD file",
    "Fast geometry repair",
    "No constraint issues",
  ],
  cons: ["Lacks parametric history", "Niche user base", "UI feels dated"],
  faqs: [
    {
      q: "What is KeyCreator used for?",
      a: "Direct modeling CAD for fast manufacturing design. KeyCreator is a 3D modeling solution widely adopted in Tool & Die, Mold Design, Rapid Prototyping.",
    },
    {
      q: "How much does KeyCreator cost?",
      a: "KeyCreator starts at $1,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of KeyCreator?",
      a: "KeyCreator is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does KeyCreator support?",
      a: "KeyCreator runs on Windows.",
    },
    {
      q: "Which file formats does KeyCreator support?",
      a: "KeyCreator works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to KeyCreator?",
      a: "The closest alternatives within the 3D Modeling space are Autodesk Inventor, Fusion 360, PTC Creo. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary Direct",
    multicore: "Moderate",
    gpu_optimization: "Moderate",
    standards: ["STEP", "IGES", "STL"],
  },
  expert_verdict:
    "The absolute best tool for engineers who need to fix 'broken' geometry from other systems.",
}, {
  id: "t60",
  name: "LibreCAD",
  slug: "librecad",
  logo_url:
    "https://librecad.org/wp-content/uploads/2016/06/LibreCAD-Logo-Large.png",
  short_desc: "Open source free 2D CAD for all platforms.",

  description:
    "LibreCAD is a fully comprehensive 2D CAD application that you can download and install for free. It is translated into over 30 languages and runs on Windows, macOS, and Linux.",

  country: "Community/International",
  category_id: "c1",
  pricing_type: "Free",
  starting_price: 0,
  platforms: ["Windows", "macOS", "Linux"],
  industries: ["Education", "Hobbyist", "Laser Cutting"],
  core_features: [
    "Advanced Layering",
    "Block System",
    "DXF Native Support",
    "Lightweight Core",
  ],
  user_scales: ["Individuals", "Education"],
  official_url: "https://librecad.org",
  affiliate_url: null,
  score: 4.1,
  pros: ["100% Free", "Very lightweight", "Open source community"],
  cons: [
    "Basic features only",
    "No DWG support (DXF only)",
    "No 3D capability",
  ],
  faqs: [
    {
      q: "What is LibreCAD used for?",
      a: "Open source free 2D CAD for all platforms. LibreCAD is a 2D CAD solution widely adopted in Education, Hobbyist, Laser Cutting.",
    },
    {
      q: "How much does LibreCAD cost?",
      a: "LibreCAD is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.",
    },
    {
      q: "Is LibreCAD really free?",
      a: "Yes — LibreCAD is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.",
    },
    {
      q: "What operating systems does LibreCAD support?",
      a: "LibreCAD runs on Windows, macOS, and Linux.",
    },
    {
      q: "Which file formats does LibreCAD support?",
      a: "LibreCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to LibreCAD?",
      a: "The closest alternatives within the 2D CAD space are QCAD, DWG FastView, CADra. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Qt/LibreCAD",
    multicore: "None",
    gpu_optimization: "None",
    standards: ["DXF", "JWW"],
  },

  expert_verdict:
    "Perfect for students and hobbyists who need simple, reliable 2D schematics.",

  pricing_breakdown: [
    {
      tier: "Free",
      price: "$0",
      notes: "Open Source (GPLv2)",
    },
  ],

  key_capabilities: [
    "Free 2D Drafting & Design",
    "Native DXF support",
    "Layer Management",
    "Command-line input for precision",
    "Lightweight & Cross-platform",
  ],

  detailed_features: [
    {
      category: "Features",
      items: [
        { name: "Support for more than 30 languages", status: true },
        { name: "Plugin support for extra features", status: true },
        { name: "Advanced snapping system", status: true },
        { name: "Library of blocks/symbols", status: true },
        { name: "Active community support", status: true },
      ],
    },
  ],
}, {
  id: "t61",
  name: "CADopia",
  slug: "cadopia",
  logo_url: "https://www.cadopia.com/images/cadopia-logo.png",
  short_desc: "Professional 2D/3D DWG CAD for engineers.",
  description:
    "CADopia is a full-featured 2D and 3D drafting and design software. It is a cost-effective alternative to AutoCAD, offering professional tools and high compatibility.",
  country: "USA",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 545,
  platforms: ["Windows"],
  industries: ["Engineering", "AEC", "Interior Design"],
  core_features: [
    "Native DWG Support",
    "3D Solid Modeling",
    "LISP Support",
    "Digital Signatures",
  ],
  user_scales: ["Small Team", "Mid-Market"],
  official_url: "https://www.cadopia.com",
  affiliate_url: null,
  score: 4.3,
  pros: [
    "Stable and reliable",
    "One-time payment",
    "AutoCAD like experience",
  ],
  cons: ["Windows only", "Slow update cycle", "Marketing is outdated"],
  faqs: [
    {
      q: "What is CADopia used for?",
      a: "Professional 2D/3D DWG CAD for engineers. CADopia is a 2D CAD solution widely adopted in Engineering, AEC, Interior Design.",
    },
    {
      q: "How much does CADopia cost?",
      a: "CADopia starts at $545 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CADopia?",
      a: "CADopia is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CADopia support?",
      a: "CADopia runs on Windows.",
    },
    {
      q: "Which file formats does CADopia support?",
      a: "CADopia works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CADopia?",
      a: "The closest alternatives within the 2D CAD space are progeCAD Professional, CAXA CAD, TurboCAD Platinum. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ARES",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["DWG", "DXF", "DWT"],
  },
  expert_verdict:
    "A solid, stable choice for firms that want a 'set it and forget it' 2D/3D solution.",
}, {
  id: "t62",
  name: "TurboCAD Platinum",
  slug: "turbocad",
  logo_url: "https://www.turbocad.com/media/wysiwyg/TurboCAD-Logo.png",
  short_desc: "All-in-one professional 2D/3D design suite.",
  description:
    "TurboCAD is a brilliant collection of professional 2D/3D CAD tools to design, modify, present, and document in an integrated fashion. It is known for its versatility and large library of architectural and mechanical tools.",
  country: "USA",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 999,
  platforms: ["Windows", "macOS"],
  industries: ["Architecture", "Mechanical", "Consumer Products"],
  core_features: [
    "Hybrid Modeling",
    "Photorealistic Rendering",
    "Geometric Constraints",
    "BIM Data Support",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.turbocad.com",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Immense tool set",
    "Great value for money",
    "Mac support available",
  ],
  cons: [
    "UI can be cluttered",
    "Occasional instability",
    "High system requirements",
  ],
  faqs: [
    {
      q: "What is TurboCAD Platinum used for?",
      a: "All-in-one professional 2D/3D design suite. TurboCAD Platinum is a 2D CAD solution widely adopted in Architecture, Mechanical, Consumer Products.",
    },
    {
      q: "How much does TurboCAD Platinum cost?",
      a: "TurboCAD Platinum starts at $999 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of TurboCAD Platinum?",
      a: "TurboCAD Platinum is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does TurboCAD Platinum support?",
      a: "TurboCAD Platinum runs on Windows and macOS.",
    },
    {
      q: "Which file formats does TurboCAD Platinum support?",
      a: "TurboCAD Platinum works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to TurboCAD Platinum?",
      a: "The closest alternatives within the 2D CAD space are CAXA CAD, progeCAD Professional, CADopia. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ACIS & D-Cube",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["DWG", "SKP", "IFC"],
  },
  expert_verdict:
    "The most versatile all-rounder in the mid-range CAD market.",
}, {
  id: "t63",
  name: "EPLAN Electric P8",
  slug: "eplan-electric-p8",
  logo_url:
    "https://www.eplan.com/typo3conf/ext/eplan/Resources/Public/Images/Logo.svg",
  short_desc: "The global standard for electrical engineering.",

  description:
    "EPLAN Electric P8 is a consistent, integrated and fast system for the planning and design of electrical engineering for machines and plant systems.",

  country: "USA",
  category_id: "c6",
  pricing_type: "Subscription",
  starting_price: 2500,
  platforms: ["Windows"],
  industries: ["Electrical Engineering", "Automation"],

  core_features: [
    "Electrical CAE",
    "Schematic Design",
    "Panel Building",
    "Fluid Power Design",
    "Mechatronics Integration",
  ],

  user_scales: ["Enterprise", "Mid-Market"],
  official_url: "https://www.eplan.com",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Unmatched automation",
    "Massive parts library",
    "Industry standard in EU",
  ],
  cons: [
    "Very high cost",
    "Steep learning curve",
    "Requires specialized training",
  ],
  faqs: [
    {
      q: "What is EPLAN Electric P8 used for?",
      a: "The global standard for electrical engineering. EPLAN Electric P8 is an EDA solution widely adopted in Electrical Engineering, Automation.",
    },
    {
      q: "How much does EPLAN Electric P8 cost?",
      a: "EPLAN Electric P8 starts at $2,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of EPLAN Electric P8?",
      a: "EPLAN Electric P8 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does EPLAN Electric P8 support?",
      a: "EPLAN Electric P8 runs on Windows.",
    },
    {
      q: "Which file formats does EPLAN Electric P8 support?",
      a: "EPLAN Electric P8 works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to EPLAN Electric P8?",
      a: "The closest alternatives within the EDA space are Altium Designer, Synopsys Fusion Compiler, Eagle. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary",
    multicore: "High",
    gpu_optimization: "Moderate",
    standards: ["IEC", "NFPA", "JIC"],
  },

  expert_verdict:
    "The gold standard for anyone serious about industrial electrical design.",

  pricing_tiers: [
    {
      name: "Subscription",
      price: "3,500",
      period: "/yr",

      features: [
        "Electrical Design",
        "Schematic Creation",
        "Standard Parts Data",
        "Cloud services",
      ],

      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "CAE Engineering",

      items: [
        {
          name: "Automated Schematic Check",
          status: true,
        },
        {
          name: "EPLAN Data Portal access",
          status: true,
        },
        {
          name: "PLC Management",
          status: true,
        },
        {
          name: "Multi-user concurrent editing",
          status: true,
        },
      ],
    },
    {
      category: "Manufacturing",

      items: [
        {
          name: "Smart Wiring support",
          status: true,
        },
        {
          name: "Automatic BOM & Wire lists",
          status: true,
        },
        {
          name: "Thermal Design integration",
          status: true,
        },
        {
          name: "3D Panel Layout",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t64",
  name: "PC SCHEMATIC Automation",
  slug: "pc-schematic",
  logo_url: "https://www.pcschematic.com/images/pcs_logo_new.png",
  short_desc: "Intelligent electrical CAD for automation.",
  description:
    "PC SCHEMATIC Automation is high-end electrical CAD software for drawing schematics for electrical wiring diagrams, control circuits, pneumatics and hydraulics.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Perpetual",
  starting_price: 1500,
  platforms: ["Windows"],
  industries: ["Automation", "Manufacturing"],
  core_features: [
    "Auto-generating Lists",
    "Component Database",
    "Smart Routing",
    "PLC Management",
  ],
  user_scales: ["Small Team", "Mid-Market"],
  official_url: "https://www.pcschematic.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "User friendly",
    "Efficient parts management",
    "One-time cost available",
  ],
  cons: [
    "Smaller community than EPLAN",
    "Windows only",
    "UI is very traditional",
  ],
  faqs: [
    {
      q: "What is PC SCHEMATIC Automation used for?",
      a: "Intelligent electrical CAD for automation. PC SCHEMATIC Automation is a visualization and rendering solution widely adopted in Automation, Manufacturing.",
    },
    {
      q: "How much does PC SCHEMATIC Automation cost?",
      a: "PC SCHEMATIC Automation starts at $1,500 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of PC SCHEMATIC Automation?",
      a: "PC SCHEMATIC Automation is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does PC SCHEMATIC Automation support?",
      a: "PC SCHEMATIC Automation runs on Windows.",
    },
    {
      q: "Which file formats does PC SCHEMATIC Automation support?",
      a: "PC SCHEMATIC Automation works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to PC SCHEMATIC Automation?",
      a: "The closest alternatives within the Specialized space are Shoemaster, 3Design, ICAD3D+. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Custom",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["IEC 61346", "EN 81346"],
  },
  expert_verdict:
    "The most efficient alternative to EPLAN for small to mid-sized automation firms.",
}, {
  id: "t65",
  name: "MatrixGold",
  slug: "matrixgold",
  logo_url: "https://www.gemvision.com/images/matrixgold-logo.png",
  short_desc: "The world's most advanced jewelry design software.",

  description:
    "MatrixGold combines the top features of Matrix and RhinoGold with a simplified interface to provide a powerful 3D jewelry design experience.",

  country: "USA",
  category_id: "c7",
  pricing_type: "Perpetual",
  starting_price: 7900,
  platforms: ["Windows"],
  industries: ["Jewelry Design", "Manufacturing"],

  core_features: [
    "Jewelry Design",
    "Parametric Gem placement",
    "Ring Builders",
    "High-end Rendering",
  ],

  user_scales: ["Individual Artists", "High-end Jewelers"],
  official_url: "https://www.gemvision.com/matrixgold",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Ultimate precision",
    "Dynamic parametric history",
    "Photorealistic rendering",
  ],
  cons: [
    "Extremely expensive",
    "Niche hardware requirements",
    "Steep learning curve",
  ],
  faqs: [
    {
      q: "What is MatrixGold used for?",
      a: "The world's most advanced jewelry design software. MatrixGold is a visualization and rendering solution widely adopted in Jewelry Design, Manufacturing.",
    },
    {
      q: "How much does MatrixGold cost?",
      a: "MatrixGold starts at $7,900 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of MatrixGold?",
      a: "MatrixGold is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MatrixGold support?",
      a: "MatrixGold runs on Windows.",
    },
    {
      q: "Which file formats does MatrixGold support?",
      a: "MatrixGold works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MatrixGold?",
      a: "The closest alternatives within the Specialized space are PC SCHEMATIC Automation, Shoemaster, 3Design. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Rhino 7 + Custom",
    multicore: "Moderate",
    gpu_optimization: "Ultra",
    standards: ["STL", "OBJ", "3DM"],
  },

  expert_verdict:
    "If you are a professional jeweler, this is the only tool you will ever need.",

  pricing_tiers: [
    {
      name: "Subscription",
      price: "1,200",
      period: "/yr",
      features: [
        "Parametric Jewelry Design",
        "Render Studio",
        "Gems library",
      ],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Jewelry",

      items: [
        {
          name: "Dynamic Rhino integration",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t66",
  name: "exocad DentalCAD",
  slug: "exocad",
  logo_url:
    "https://exocad.com/typo3conf/ext/exocad_site/Resources/Public/Images/exocad_logo.svg",
  short_desc: "Leading dental CAD software for labs.",

  description:
    "exocad DentalCAD is the tool for every dental technician who wants to be part of the future in digital dentistry.",

  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 3000,
  platforms: ["Windows"],
  industries: ["Dental", "Medical"],

  core_features: [
    "Digital Dentistry",
    "Crown & Bridge design",
    "Implant Planning",
    "3D Scanning integration",
  ],

  user_scales: ["Dental Labs", "Clinics"],
  official_url: "https://exocad.com",
  affiliate_url: null,
  score: 4.8,
  pros: ["Robust and reliable", "Huge module ecosystem", "Open architecture"],
  cons: [
    "Complex licensing",
    "Requires specific scanners",
    "High total cost",
  ],
  faqs: [
    {
      q: "What is exocad DentalCAD used for?",
      a: "Leading dental CAD software for labs. exocad DentalCAD is a visualization and rendering solution widely adopted in Dental, Medical.",
    },
    {
      q: "How much does exocad DentalCAD cost?",
      a: "exocad DentalCAD starts at $3,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of exocad DentalCAD?",
      a: "exocad DentalCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does exocad DentalCAD support?",
      a: "exocad DentalCAD runs on Windows.",
    },
    {
      q: "Which file formats does exocad DentalCAD support?",
      a: "exocad DentalCAD works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to exocad DentalCAD?",
      a: "The closest alternatives within the Specialized space are CLO 3D, Cabinet Vision, AVEVA Marine. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["STL", "PLY", "OBJ"],
  },

  expert_verdict:
    "The software that defined the digital dental lab industry.",

  pricing_tiers: [
    {
      name: "Flex License",
      price: "2,500",
      period: "/yr",
      features: [
        "DentalCAD Core",
        "Virtual Articulator",
        "Provisional module",
      ],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Dental",

      items: [
        {
          name: "Open architecture support",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t67",
  name: "Cabinet Vision",
  slug: "cabinet-vision",
  logo_url: "https://www.cabinetvision.com/images/logo.png",
  short_desc: "Essential tool for the woodworking industry.",
  description:
    "Cabinet Vision is a unique solution for the woodworking industry, providing tools for design, rendering, and CNC manufacturing of cabinets.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 2000,
  platforms: ["Windows"],
  industries: ["Woodworking", "Furniture"],
  core_features: [
    "Auto-generation of Cut Lists",
    "CNC Integration",
    "3D Photo Rendering",
    "Material Optimization",
  ],
  user_scales: ["Small Custom Shops", "Industrial Manufacturers"],
  official_url: "https://www.cabinetvision.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Seamless design-to-CNC",
    "Highly customizable",
    "Large library of hardware",
  ],
  cons: [
    "Very complex setup",
    "Old-school UI",
    "High cost of implementation",
  ],
  faqs: [
    {
      q: "What is Cabinet Vision used for?",
      a: "Essential tool for the woodworking industry. Cabinet Vision is a visualization and rendering solution widely adopted in Woodworking, Furniture.",
    },
    {
      q: "How much does Cabinet Vision cost?",
      a: "Cabinet Vision starts at $2,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Cabinet Vision?",
      a: "Cabinet Vision is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Cabinet Vision support?",
      a: "Cabinet Vision runs on Windows.",
    },
    {
      q: "Which file formats does Cabinet Vision support?",
      a: "Cabinet Vision works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Cabinet Vision?",
      a: "The closest alternatives within the Specialized space are exocad DentalCAD, CLO 3D, Land F/X. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["DXF", "G-Code"],
  },
  expert_verdict: "The backbone of any modern professional woodworking shop.",
}, {
  id: "t68",
  name: "AVEVA Marine",
  slug: "aveva-marine",
  logo_url:
    "https://www.aveva.com/content/dam/aveva/images/logos/aveva-logo.svg",
  short_desc: "Integrated engineering and design for shipbuilding.",
  description:
    "AVEVA Marine combines engineering and design for the world's most complex ships and offshore platforms.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 15000,
  platforms: ["Windows"],
  industries: ["Shipbuilding", "Oil & Gas"],
  core_features: [
    "Hull Design",
    "Outfitting",
    "3D Collaborative Environment",
    "Project Management",
  ],
  user_scales: ["Enterprise", "Major Shipyards"],
  official_url: "https://www.aveva.com/en/products/marine/",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Handles massive assemblies",
    "Global collaboration",
    "Deep engineering logic",
  ],
  cons: [
    "Extremely expensive",
    "Huge learning curve",
    "Requires specialized IT infrastructure",
  ],
  faqs: [
    {
      q: "What is AVEVA Marine used for?",
      a: "Integrated engineering and design for shipbuilding. AVEVA Marine is a visualization and rendering solution widely adopted in Shipbuilding, Oil & Gas.",
    },
    {
      q: "How much does AVEVA Marine cost?",
      a: "AVEVA Marine starts at $15,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of AVEVA Marine?",
      a: "AVEVA Marine is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does AVEVA Marine support?",
      a: "AVEVA Marine runs on Windows.",
    },
    {
      q: "Which file formats does AVEVA Marine support?",
      a: "AVEVA Marine works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to AVEVA Marine?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AVEVA E3D",
    multicore: "Ultra",
    gpu_optimization: "High",
    standards: ["STEP", "IFC", "SAT"],
  },
  expert_verdict: "The undisputed king of heavy-duty maritime engineering.",
}, {
  id: "t69",
  name: "CLO 3D",
  slug: "clo-3d",
  logo_url: "https://www.clo3d.com/images/common/logo_clo.png",
  short_desc: "3D garment visualization and design.",

  description:
    "CLO is a 3D fashion design software that creates virtual, true-to-life garment visualizations with cutting-edge simulation technologies.",

  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 600,
  platforms: ["Windows", "macOS"],
  industries: ["Fashion", "Apparel", "Gaming"],

  core_features: [
    "3D Garment Design",
    "Fabric Simulation",
    "Virtual Fitting",
    "Pattern Grading",
    "Modular Design",
  ],

  user_scales: ["Indie Designers", "Global Fashion Brands"],
  official_url: "https://www.clo3d.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Best-in-class simulation",
    "Easy to learn",
    "Reduces physical samples",
  ],
  cons: [
    "Requires strong GPU",
    "Subscription only",
    "Learning curve for pattern making",
  ],
  faqs: [
    {
      q: "What is CLO 3D used for?",
      a: "3D garment visualization and design. CLO 3D is a visualization and rendering solution widely adopted in Fashion, Apparel, Gaming.",
    },
    {
      q: "How much does CLO 3D cost?",
      a: "CLO 3D starts at $600 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CLO 3D?",
      a: "CLO 3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CLO 3D support?",
      a: "CLO 3D runs on Windows and macOS.",
    },
    {
      q: "Which file formats does CLO 3D support?",
      a: "CLO 3D works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CLO 3D?",
      a: "The closest alternatives within the Specialized space are exocad DentalCAD, Cabinet Vision, AVEVA Marine. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "CLO Simulation Engine",
    multicore: "High",
    gpu_optimization: "Ultra",
    standards: ["DXF-ASTM", "OBJ", "FBX"],
  },

  expert_verdict:
    "Transforming the fashion industry by digitizing the entire sampling process.",

  pricing_tiers: [
    {
      name: "Individual",
      price: "50",
      period: "/mo",
      features: [
        "Full 3D Design",
        "Auto Grading",
        "Fabric Library",
        "Cloud storage",
      ],
      is_popular: true,
    },
    {
      name: "Business",
      price: "Custom",
      period: "quote",
      features: [
        "Team collaboration",
        "Asset management",
        "Priority support",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Simulation",

      items: [
        {
          name: "Real-time fabric drape",
          status: true,
        },
        {
          name: "Stress/Strain map",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t74",
  name: "Vectorworks Landmark",
  slug: "vectorworks-landmark",
  logo_url: "https://www.vectorworks.net/img/icons/icon-landmark.svg",
  short_desc: "The premier CAD software for landscape design.",
  description:
    "Vectorworks Landmark provides a specialized toolset for landscape architects and designers, integrating GIS, BIM, and advanced 2D/3D drafting in one package.",
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 153,
  platforms: ["Windows", "macOS"],
  industries: ["Landscape Architecture", "Urban Planning"],
  core_features: [
    "Irrigation Design",
    "Plant Databases",
    "Terrain Modeling",
    "GIS Integration",
  ],
  user_scales: ["Small Team", "Mid-Market"],
  official_url: "https://www.vectorworks.net/landmark",
  affiliate_url: null,
  score: 4.8,
  pros: ["Mac native", "Incredible 2D graphics", "BIM for landscape"],
  cons: [
    "Higher learning curve",
    "Requires modern hardware",
    "Expensive setup",
  ],
  faqs: [
    {
      q: "What is Vectorworks Landmark used for?",
      a: "The premier CAD software for landscape design. Vectorworks Landmark is a BIM solution widely adopted in Landscape Architecture, Urban Planning.",
    },
    {
      q: "How much does Vectorworks Landmark cost?",
      a: "Vectorworks Landmark starts at $153 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Vectorworks Landmark?",
      a: "Vectorworks Landmark is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Vectorworks Landmark support?",
      a: "Vectorworks Landmark runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Vectorworks Landmark support?",
      a: "Vectorworks Landmark works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Vectorworks Landmark?",
      a: "The closest alternatives within the BIM space are ArchiCAD, Revit, Civil 3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Parasolid",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["IFC", "DWG", "Shapefile"],
  },
  expert_verdict:
    "The undisputed gold standard for professional landscape architecture.",
}, {
  id: "t75",
  name: "Shoemaster",
  slug: "shoemaster",
  logo_url:
    "https://www.shoemaster.co.uk/wp-content/themes/shoemaster/images/logo.png",
  short_desc: "Leading CAD/CAM for the global footwear industry.",
  description:
    "Shoemaster is a world-leading CAD/CAM system providing 2D and 3D solutions for the footwear industry, from initial design to manufacturing.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Perpetual",
  starting_price: 5000,
  platforms: ["Windows"],
  industries: ["Footwear", "Apparel"],
  core_features: [
    "3D Last Design",
    "Pattern Engineering",
    "Material Costing",
    "Virtual Sampling",
  ],
  user_scales: ["Large Manufacturers", "Design Studios"],
  official_url: "https://www.shoemaster.co.uk",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Industry standard for shoes",
    "Integrated CAM",
    "Highly specialized",
  ],
  cons: ["Very niche", "High cost", "Legacy UI"],
  faqs: [
    {
      q: "What is Shoemaster used for?",
      a: "Leading CAD/CAM for the global footwear industry. Shoemaster is a visualization and rendering solution widely adopted in Footwear, Apparel.",
    },
    {
      q: "How much does Shoemaster cost?",
      a: "Shoemaster starts at $5,000 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Shoemaster?",
      a: "Shoemaster is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Shoemaster support?",
      a: "Shoemaster runs on Windows.",
    },
    {
      q: "Which file formats does Shoemaster support?",
      a: "Shoemaster works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Shoemaster?",
      a: "The closest alternatives within the Specialized space are PC SCHEMATIC Automation, 3Design, ICAD3D+. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary",
    multicore: "Moderate",
    gpu_optimization: "Basic",
    standards: ["DXF", "STL"],
  },
  expert_verdict: "Essential software for global footwear production lines.",
}, {
  id: "t76",
  name: "VISI Modelling",
  slug: "visi-modelling",
  logo_url: "https://www.visicadcam.com/images/logo.png",
  short_desc: "Specialized CAD/CAM for the mold and die industry.",
  description:
    "VISI is acknowledged as the world's leading CAD CAM software solution for the Mould & Die industries, offering fully integrated wireframe, surface, and solid modeling.",
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 3000,
  platforms: ["Windows"],
  industries: ["Mold Design", "Tooling"],
  core_features: [
    "Analysis of Draft",
    "Core & Cavity Separation",
    "Electrode Design",
    "Dynamic Wireframe",
  ],
  user_scales: ["Tool Shops", "Manufacturing Plants"],
  official_url: "https://www.visicadcam.com",
  affiliate_url: null,
  score: 4.8,
  pros: ["Incredibly robust for molds", "Fast processing", "Integrated CAM"],
  cons: ["Expensive", "Requires specialized knowledge", "Complex interface"],
  faqs: [
    {
      q: "What is VISI Modelling used for?",
      a: "Specialized CAD/CAM for the mold and die industry. VISI Modelling is a CAE / CAM solution widely adopted in Mold Design, Tooling.",
    },
    {
      q: "How much does VISI Modelling cost?",
      a: "VISI Modelling starts at $3,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of VISI Modelling?",
      a: "VISI Modelling is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does VISI Modelling support?",
      a: "VISI Modelling runs on Windows.",
    },
    {
      q: "Which file formats does VISI Modelling support?",
      a: "VISI Modelling works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to VISI Modelling?",
      a: "The closest alternatives within the CAE/CAM space are Cimatron, Siemens NX, SolidCAM. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Parasolid",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "X_T"],
  },
  expert_verdict:
    "If you are making plastic injection molds, VISI is your best friend.",
}, {
  id: "t77",
  name: "WYSIWYG",
  slug: "wysiwyg",
  logo_url:
    "https://cast-soft.com/wp-content/themes/cast/images/wysiwyg_logo.png",
  short_desc: "The standard for lighting design and pre-visualization.",
  description:
    "WYSIWYG is an all-in-one lighting design software tool with CAD, data, visualization, and virtual show control features.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 1200,
  platforms: ["Windows"],
  industries: ["Event Design", "Theatre", "Concerts"],
  core_features: [
    "Real-time Visualization",
    "Lighting Plotting",
    "Console Integration",
    "VR Pre-viz",
  ],
  user_scales: ["Lighting Designers", "Production Houses"],
  official_url: "https://cast-soft.com/wysiwyg/",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Incredible realism",
    "Accurate beams",
    "Industry standard for shows",
  ],
  cons: [
    "High subscription cost",
    "Heavy hardware demand",
    "Steep learning curve",
  ],
  faqs: [
    {
      q: "What is WYSIWYG used for?",
      a: "The standard for lighting design and pre-visualization. WYSIWYG is a visualization and rendering solution widely adopted in Event Design, Theatre, Concerts.",
    },
    {
      q: "How much does WYSIWYG cost?",
      a: "WYSIWYG starts at $1,200 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of WYSIWYG?",
      a: "WYSIWYG is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does WYSIWYG support?",
      a: "WYSIWYG runs on Windows.",
    },
    {
      q: "Which file formats does WYSIWYG support?",
      a: "WYSIWYG works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to WYSIWYG?",
      a: "The closest alternatives within the Specialized space are AVEVA Marine, exocad DentalCAD, CLO 3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Cast Core",
    multicore: "High",
    gpu_optimization: "Ultra",
    standards: ["DWG", "OBJ", "SKP"],
  },
  expert_verdict:
    "The only software you need to design and pre-program a world-class concert.",
}, {
  id: "t78",
  name: "3Design",
  slug: "3design",
  logo_url:
    "https://3design.com/wp-content/uploads/2019/06/Logo-3Design-Simple-Couleur.png",
  short_desc: "Parametric 3D CAD for professional jewelry.",
  description:
    "3Design is a powerful 3D jewelry design software that allows for full parametric control, meaning you can change any parameter of your jewelry at any time.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Perpetual",
  starting_price: 6000,
  platforms: ["Windows", "macOS"],
  industries: ["Jewelry Design"],
  core_features: [
    "History Tree",
    "Pavé Wizard",
    "Automatic Ring Resizer",
    "Built-in Rendering",
  ],
  user_scales: ["Jewelry Designers", "Luxury Brands"],
  official_url: "https://3design.com",
  affiliate_url: null,
  score: 4.7,
  pros: ["Full parametric history", "Mac support", "Specialized jewel tools"],
  cons: [
    "Learning curve for parametric",
    "Very expensive",
    "Niche user base",
  ],
  faqs: [
    {
      q: "What is 3Design used for?",
      a: "Parametric 3D CAD for professional jewelry. 3Design is a visualization and rendering solution widely adopted in Jewelry Design.",
    },
    {
      q: "How much does 3Design cost?",
      a: "3Design starts at $6,000 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of 3Design?",
      a: "3Design is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does 3Design support?",
      a: "3Design runs on Windows and macOS.",
    },
    {
      q: "Which file formats does 3Design support?",
      a: "3Design works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to 3Design?",
      a: "The closest alternatives within the Specialized space are PC SCHEMATIC Automation, Shoemaster, ICAD3D+. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary Parametric",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["STL", "OBJ", "3DM"],
  },
  expert_verdict:
    "The serious alternative to MatrixGold for those who prefer Mac or true parametric history.",
}, {
  id: "t79",
  name: "Geomagic Design X",
  slug: "geomagic-design-x",
  logo_url:
    "https://www.3dsystems.com/sites/default/files/logo-3d-systems.png",
  short_desc: "The world's most comprehensive reverse engineering software.",
  description:
    "Geomagic Design X combines history-based CAD with 3D scan data processing so you can create feature-based, editable solid models compatible with your existing CAD software.",
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 5000,
  platforms: ["Windows"],
  industries: ["Reverse Engineering", "Quality Control"],
  core_features: [
    "Automatic Surface Fitting",
    "Mesh to Solid",
    "LiveTransfer to CAD",
    "Point Cloud Analysis",
  ],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.3dsystems.com/software/geomagic-design-x",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Best scan-to-CAD workflow",
    "Feature-based modeling",
    "Extremely accurate",
  ],
  cons: [
    "Very expensive",
    "High hardware requirements",
    "Steep learning curve",
  ],
  faqs: [
    {
      q: "What is Geomagic Design X used for?",
      a: "The world's most comprehensive reverse engineering software. Geomagic Design X is a 3D modeling solution widely adopted in Reverse Engineering, Quality Control.",
    },
    {
      q: "How much does Geomagic Design X cost?",
      a: "Geomagic Design X starts at $5,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Geomagic Design X?",
      a: "Geomagic Design X is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Geomagic Design X support?",
      a: "Geomagic Design X runs on Windows.",
    },
    {
      q: "Which file formats does Geomagic Design X support?",
      a: "Geomagic Design X works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Geomagic Design X?",
      a: "The closest alternatives within the 3D Modeling space are SolidWorks, PTC Creo, Autodesk Inventor. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Parasolid",
    multicore: "High",
    gpu_optimization: "Ultra",
    standards: ["STEP", "IGES", "STL"],
  },
  expert_verdict:
    "The professional standard for turning physical objects into digital CAD data.",
}, {
  id: "t80",
  name: "Alias AutoStudio",
  slug: "alias-autostudio",
  logo_url:
    "https://www.autodesk.com/content/dam/autodesk/logos/alias-logo.svg",
  short_desc: "Industrial design and automotive styling software.",
  description:
    "Alias software provides surfacing, modeling, and visualization tools for industrial, product, and automotive design.",
  country: "USA",
  category_id: "c2",
  pricing_type: "Subscription",
  starting_price: 12000,
  platforms: ["Windows", "macOS"],
  industries: ["Automotive", "Industrial Design"],
  core_features: [
    "Class-A Surfacing",
    "Conceptual Sketching",
    "VR Visualization",
    "Dynamo Integration",
  ],
  user_scales: ["Enterprise", "Design Agencies"],
  official_url: "https://www.autodesk.com/products/alias/overview",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Gold standard for Class-A surfaces",
    "Stunning visualization",
    "Unified design workflow",
  ],
  cons: [
    "Extremely high cost",
    "Steepest learning curve in CAD",
    "Niche expertise needed",
  ],
  faqs: [
    {
      q: "What is Alias AutoStudio used for?",
      a: "Industrial design and automotive styling software. Alias AutoStudio is a 3D modeling solution widely adopted in Automotive, Industrial Design.",
    },
    {
      q: "How much does Alias AutoStudio cost?",
      a: "Alias AutoStudio starts at $12,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Alias AutoStudio?",
      a: "Alias AutoStudio is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Alias AutoStudio support?",
      a: "Alias AutoStudio runs on Windows and macOS.",
    },
    {
      q: "Which file formats does Alias AutoStudio support?",
      a: "Alias AutoStudio works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Alias AutoStudio?",
      a: "The closest alternatives within the 3D Modeling space are SolidWorks, PTC Creo, CATIA. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Alias Core",
    multicore: "High",
    gpu_optimization: "Ultra",
    standards: ["STEP", "IGES", "VDAFS"],
  },
  expert_verdict:
    "The software behind almost every beautiful car you see on the road.",
}, {
  id: "t81",
  name: "Cimatron",
  slug: "cimatron",
  logo_url: "https://www.cimatron.com/sites/default/files/cimatron-logo.png",
  short_desc: "Integrated CAD/CAM for mold and die makers.",
  description:
    "Cimatron delivers a single, integrated solution for toolmakers, from quoting to design, to CNC programming.",
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 3500,
  platforms: ["Windows"],
  industries: ["Mold Design", "Die Design"],
  core_features: [
    "Automated Tool Design",
    "Conformal Cooling",
    "NC Programming",
    "Quick Split & Core",
  ],
  user_scales: ["Tool Shops", "Manufacturing Plants"],
  official_url: "https://www.cimatron.com",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Excellent end-to-end workflow",
    "Powerful NC programming",
    "Specialized mold tools",
  ],
  cons: ["Legacy UI feel", "Expensive", "Requires high-end PC"],
  faqs: [
    {
      q: "What is Cimatron used for?",
      a: "Integrated CAD/CAM for mold and die makers. Cimatron is a CAE / CAM solution widely adopted in Mold Design, Die Design.",
    },
    {
      q: "How much does Cimatron cost?",
      a: "Cimatron starts at $3,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Cimatron?",
      a: "Cimatron is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Cimatron support?",
      a: "Cimatron runs on Windows.",
    },
    {
      q: "Which file formats does Cimatron support?",
      a: "Cimatron works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Cimatron?",
      a: "The closest alternatives within the CAE/CAM space are VISI Modelling, Siemens NX, SolidCAM. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Parasolid",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "DXF"],
  },
  expert_verdict:
    "A robust, battle-tested workhorse for the precision tooling industry.",
}, {
  id: "t82",
  name: "Land F/X",
  slug: "land-fx",
  logo_url: "https://www.landfx.com/images/logo.png",
  short_desc: "Professional AutoCAD plugin for landscape architects.",
  description:
    "Land F/X is a powerful add-on for AutoCAD and SketchUp that provides smart tools for planting, irrigation, and site design.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 500,
  platforms: ["Windows"],
  industries: ["Landscape Architecture", "Irrigation"],
  core_features: [
    "Plant Manager",
    "Irrigation Design",
    "Detail Management",
    "SketchUp Connection",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.landfx.com",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Incredibly efficient",
    "Large plant database",
    "Direct AutoCAD integration",
  ],
  cons: [
    "Requires AutoCAD",
    "Subscription based",
    "Learning curve for automation",
  ],
  faqs: [
    {
      q: "What is Land F/X used for?",
      a: "Professional AutoCAD plugin for landscape architects. Land F/X is a visualization and rendering solution widely adopted in Landscape Architecture, Irrigation.",
    },
    {
      q: "How much does Land F/X cost?",
      a: "Land F/X starts at $500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Land F/X?",
      a: "Land F/X is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Land F/X support?",
      a: "Land F/X runs on Windows.",
    },
    {
      q: "Which file formats does Land F/X support?",
      a: "Land F/X works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Land F/X?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AutoCAD + Custom",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["DWG", "CSV"],
  },
  expert_verdict:
    "The essential multiplier for landscape architects who use AutoCAD.",
}, {
  id: "t83",
  name: "ICAD3D+",
  slug: "icad3d-plus",
  logo_url: "https://www.icad3dplus.com/img/logo.png",
  short_desc: "3D design and pattern engineering for footwear.",
  description:
    "ICAD3D+ is a comprehensive 3D software for footwear design and pattern engineering, allowing users to work in a virtual environment with real physical constraints.",
  country: "USA",
  category_id: "c7",
  pricing_type: "Perpetual",
  starting_price: 4500,
  platforms: ["Windows"],
  industries: ["Footwear"],
  core_features: [
    "Virtual Flattening",
    "Sole Design",
    "Material Consumption Analysis",
    "Direct to Manufacturing",
  ],
  user_scales: ["Footwear Brands", "Pattern Houses"],
  official_url: "https://www.icad3dplus.com",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Precise pattern engineering",
    "Modern 3D engine",
    "Direct manufacturing export",
  ],
  cons: ["Very niche", "High cost", "Steep learning for non-tech designers"],
  faqs: [
    {
      q: "What is ICAD3D+ used for?",
      a: "3D design and pattern engineering for footwear. ICAD3D+ is a visualization and rendering solution widely adopted in Footwear.",
    },
    {
      q: "How much does ICAD3D+ cost?",
      a: "ICAD3D+ starts at $4,500 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ICAD3D+?",
      a: "ICAD3D+ is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ICAD3D+ support?",
      a: "ICAD3D+ runs on Windows.",
    },
    {
      q: "Which file formats does ICAD3D+ support?",
      a: "ICAD3D+ works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ICAD3D+?",
      a: "The closest alternatives within the Specialized space are PC SCHEMATIC Automation, Shoemaster, 3Design. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary 3D",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["DXF", "STL", "IGES"],
  },
  expert_verdict:
    "The most modern 3D alternative for footwear professionals.",
}, {
  id: "t84",
  name: "ANSYS Mechanical",
  slug: "ansys-mechanical",
  logo_url: getLogo("ANSYS"),
  short_desc: "The gold standard for structural FEA simulation.",

  description:
    "ANSYS Mechanical is a finite element analysis (FEA) tool that enables engineers to simulate structural, thermal, and acoustic performance, helping to build better products faster.",

  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 25000,
  platforms: ["Windows", "Linux"],
  industries: ["Aerospace", "Automotive", "Energy", "Manufacturing"],

  core_features: [
    "FEA Simulation",
    "Structural Analysis",
    "Non-linear Dynamics",
    "Composite Modeling",
    "Optimization",
  ],

  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.ansys.com/products/structures/ansys-mechanical",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Industry gold standard",
    "Extremely deep physics coverage",
    "Tight CAD integrations",
  ],
  cons: ["Very high cost", "Complex licensing", "Steep learning curve"],
  faqs: [
    {
      q: "What is ANSYS Mechanical used for?",
      a: "The gold standard for structural FEA simulation. ANSYS Mechanical is a CAE / CAM solution widely adopted in Aerospace, Automotive, Energy.",
    },
    {
      q: "How much does ANSYS Mechanical cost?",
      a: "ANSYS Mechanical starts at $25,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ANSYS Mechanical?",
      a: "ANSYS Mechanical is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ANSYS Mechanical support?",
      a: "ANSYS Mechanical runs on Windows and Linux.",
    },
    {
      q: "Which file formats does ANSYS Mechanical support?",
      a: "ANSYS Mechanical works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ANSYS Mechanical?",
      a: "The closest alternatives within the CAE/CAM space are Mastercam, SolidCAM, Altair HyperWorks. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary FEA",
    multicore: "Ultra",
    gpu_optimization: "Ultra",
    standards: ["STEP", "IGES", "STL", "ACIS"],
  },

  expert_verdict:
    "The undisputed leader in structural simulation, trusted by every major aerospace and automotive OEM.",

  pricing_tiers: [
    {
      name: "Premium (Annual)",
      price: "15,000",
      period: "/yr",
      features: [
        "Static Structural",
        "Modal Analysis",
        "Heat Transfer",
        "HPC support",
      ],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Physics",

      items: [
        {
          name: "Linear/Non-linear Statics",
          status: true,
        },
        {
          name: "Explicit Dynamics",
          status: true,
        },
        {
          name: "Fatigue Analysis",
          status: true,
        },
        {
          name: "Vibration & Acoustics",
          status: true,
        },
      ],
    },
    {
      category: "Platform",

      items: [
        {
          name: "Workbench workflow",
          status: true,
        },
        {
          name: "SpaceClaim Direct Modeler",
          status: true,
        },
        {
          name: "DesignXplorer (DOE)",
          status: true,
        },
        {
          name: "Python Scripting (PyAnsys)",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t85",
  name: "MSC Nastran",
  slug: "msc-nastran",
  logo_url: getLogo("MSC Nastran"),
  short_desc: "NASA-born structural analysis solver, now by Hexagon.",

  description:
    "MSC Nastran is a multidisciplinary structural analysis application used by engineers to perform static, dynamic, and thermal analysis across the aerospace, automotive and manufacturing industries.",

  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 18000,
  platforms: ["Windows", "Linux"],
  industries: ["Aerospace", "Automotive", "Defense"],
  core_features: [
    "Structural Analysis",
    "FEA Solver",
    "Aeroelasticity",
    "Optimization",
  ],
  user_scales: ["Enterprise"],
  official_url: "https://hexagon.com/products/msc-nastran",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "NASA heritage and proven accuracy",
    "Industry-standard for aerospace",
    "Broad solver capabilities",
  ],
  cons: ["Extremely expensive", "Old-school UI", "Complex setup"],
  faqs: [
    {
      q: "What is MSC Nastran used for?",
      a: "NASA-born structural analysis solver, now by Hexagon. MSC Nastran is a CAE / CAM solution widely adopted in Aerospace, Automotive, Defense.",
    },
    {
      q: "How much does MSC Nastran cost?",
      a: "MSC Nastran starts at $18,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of MSC Nastran?",
      a: "MSC Nastran is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MSC Nastran support?",
      a: "MSC Nastran runs on Windows and Linux.",
    },
    {
      q: "Which file formats does MSC Nastran support?",
      a: "MSC Nastran works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MSC Nastran?",
      a: "The closest alternatives within the CAE/CAM space are Siemens NX, Mastercam, nTop. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary FEA Solver",
    multicore: "Ultra",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "BDF"],
  },

  expert_verdict:
    "Born at NASA, Nastran is the simulation benchmark for aerospace certifications worldwide.",

  pricing_tiers: [
    {
      name: "Annual",
      price: "12,000",
      period: "/yr",

      features: [
        "Advanced FEA",
        "Structural Dynamics",
        "Acoustics",
        "High-performance computing",
      ],

      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "Simulation",

      items: [
        {
          name: "Global industry standard solver",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t86",
  name: "Altair HyperWorks",
  slug: "altair-hyperworks",
  logo_url: getLogo("Altair HyperWorks"),
  short_desc: "Comprehensive simulation-driven design platform.",

  description:
    "Altair HyperWorks is an open-architecture simulation platform providing best-in-class technologies to design and optimize high-performance, weight-efficient and innovative products.",

  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 12000,
  platforms: ["Windows", "Linux"],
  industries: ["Automotive", "Aerospace", "Manufacturing"],

  core_features: [
    "Multi-physics Simulation",
    "Optimization",
    "Data Analytics",
    "Electromagnetics",
  ],

  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://altair.com/hyperworks/",
  affiliate_url: null,
  score: 4.8,
  pros: [
    "Unit-based licensing flexibility",
    "Excellent meshing tools",
    "Broad simulation suite",
  ],
  cons: [
    "Expensive for small teams",
    "Complex ecosystem",
    "UI can be overwhelming",
  ],
  faqs: [
    {
      q: "What is Altair HyperWorks used for?",
      a: "Comprehensive simulation-driven design platform. Altair HyperWorks is a CAE / CAM solution widely adopted in Automotive, Aerospace, Manufacturing.",
    },
    {
      q: "How much does Altair HyperWorks cost?",
      a: "Altair HyperWorks starts at $12,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Altair HyperWorks?",
      a: "Altair HyperWorks is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Altair HyperWorks support?",
      a: "Altair HyperWorks runs on Windows and Linux.",
    },
    {
      q: "Which file formats does Altair HyperWorks support?",
      a: "Altair HyperWorks works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Altair HyperWorks?",
      a: "The closest alternatives within the CAE/CAM space are SolidCAM, Mastercam, ANSYS Mechanical. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary CAE Suite",
    multicore: "Ultra",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "Nastran BDF", "LS-DYNA"],
  },

  expert_verdict:
    "The most flexible CAE platform thanks to its unique unit-based licensing model.",

  pricing_tiers: [
    {
      name: "Units Based",
      price: "Custom",
      period: "quote",
      features: [
        "Multi-physics access",
        "Simulation-driven design",
        "Cloud solving",
      ],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "CAE",

      items: [
        {
          name: "HyperMesh modeling",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t87",
  name: "ESI Visual-Environment",
  slug: "esi-visual-environment",
  logo_url: getLogo("ESI Group"),
  short_desc:
    "Virtual prototyping platform for crash and comfort simulation.",
  description:
    "ESI Visual-Environment is a unified pre- and post-processing platform for virtual manufacturing and performance simulation, covering crash, NVH, welding and composites.",
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 15000,
  platforms: ["Windows", "Linux"],
  industries: ["Automotive", "Aerospace", "Shipbuilding"],
  core_features: [
    "Crash Simulation (PAM-CRASH)",
    "NVH Analysis",
    "Welding Simulation",
    "Composites Design",
  ],
  user_scales: ["Enterprise"],
  official_url: "https://www.esi-group.com/products/virtual-performance",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Leading crash simulation (PAM-CRASH)",
    "Comprehensive virtual manufacturing",
    "Strong automotive heritage",
  ],
  cons: [
    "Niche market focus",
    "Very high cost",
    "Limited community resources",
  ],
  faqs: [
    {
      q: "What is ESI Visual-Environment used for?",
      a: "Virtual prototyping platform for crash and comfort simulation. ESI Visual-Environment is a CAE / CAM solution widely adopted in Automotive, Aerospace, Shipbuilding.",
    },
    {
      q: "How much does ESI Visual-Environment cost?",
      a: "ESI Visual-Environment starts at $15,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ESI Visual-Environment?",
      a: "ESI Visual-Environment is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ESI Visual-Environment support?",
      a: "ESI Visual-Environment runs on Windows and Linux.",
    },
    {
      q: "Which file formats does ESI Visual-Environment support?",
      a: "ESI Visual-Environment works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ESI Visual-Environment?",
      a: "The closest alternatives within the CAE/CAM space are Siemens NX, SolidCAM, Altair HyperWorks. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "PAM-CRASH Solver",
    multicore: "Ultra",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "LS-DYNA", "Nastran"],
  },
  expert_verdict:
    "The automotive crash simulation specialist trusted by European OEMs for decades.",
}, {
  id: "t88",
  name: "CorelCAD",
  slug: "corelcad",
  logo_url: getLogo("CorelCAD"),
  short_desc: "Affordable DWG-compatible CAD for professionals.",
  description:
    "CorelCAD delivers powerful 2D drafting and 3D design tools in a familiar CAD environment, offering DWG file compatibility at a fraction of AutoCAD's price.",
  country: "Canada",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 499,
  platforms: ["Windows", "macOS"],
  industries: ["Architecture", "Mechanical", "General"],
  core_features: [
    "DWG Compatibility",
    "2D Drafting",
    "3D Solid Modeling",
    "CustomSHX Fonts",
  ],
  user_scales: ["Freelancer", "Small Business"],
  official_url: "https://www.coreldraw.com/en/product/corelcad/",
  affiliate_url: null,
  score: 4.3,
  pros: [
    "One-time perpetual purchase",
    "Mac support",
    "Familiar AutoCAD-like interface",
  ],
  cons: [
    "Limited plugin ecosystem",
    "Less frequent updates",
    "Smaller community",
  ],
  faqs: [
    {
      q: "What is CorelCAD used for?",
      a: "Affordable DWG-compatible CAD for professionals. CorelCAD is a 2D CAD solution widely adopted in Architecture, Mechanical, General.",
    },
    {
      q: "How much does CorelCAD cost?",
      a: "CorelCAD starts at $499 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CorelCAD?",
      a: "CorelCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CorelCAD support?",
      a: "CorelCAD runs on Windows and macOS.",
    },
    {
      q: "Which file formats does CorelCAD support?",
      a: "CorelCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CorelCAD?",
      a: "The closest alternatives within the 2D CAD space are CAXA CAD, TurboCAD Platinum, CADopia. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ARES/IntelliCAD",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["DWG", "DXF", "STL", "3DM"],
  },
  expert_verdict:
    "The best perpetual-license AutoCAD alternative for Mac users who don't need a subscription.",
}, {
  id: "t89",
  name: "ZW3D",
  slug: "zw3d",
  logo_url: getLogo("ZW3D"),
  short_desc: "All-in-one 3D CAD/CAM solution from ZWSOFT.",

  description:
    "ZW3D is an all-in-one CAD/CAM solution that delivers fast, stable, and precise 3D modeling, assembly, and 2.5-5 axis CNC machining in a single environment.",

  country: "China",
  category_id: "c2",
  pricing_type: "Perpetual",
  starting_price: 2995,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Mechanical", "Mold Design"],

  core_features: [
    "CAD/CAM/CAE",
    "Overdrive Engine",
    "Mold Design",
    "Surface Modeling",
    "Hybrid Modeling",
  ],

  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://www.zwsoft.com/zw3d",
  affiliate_url: null,
  score: 4.5,
  pros: [
    "Integrated CAD+CAM",
    "Perpetual license available",
    "Competitive pricing",
  ],
  cons: [
    "Less third-party integrations",
    "Smaller user community",
    "UI not as polished as NX",
  ],
  faqs: [
    {
      q: "What is ZW3D used for?",
      a: "All-in-one 3D CAD/CAM solution from ZWSOFT. ZW3D is a 3D modeling solution widely adopted in Manufacturing, Mechanical, Mold Design.",
    },
    {
      q: "How much does ZW3D cost?",
      a: "ZW3D starts at $2,995 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ZW3D?",
      a: "ZW3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ZW3D support?",
      a: "ZW3D runs on Windows.",
    },
    {
      q: "Which file formats does ZW3D support?",
      a: "ZW3D works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ZW3D?",
      a: "The closest alternatives within the 3D Modeling space are Alibre Design, Rhino 3D, IronCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Overdrive Kernel (Proprietary)",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["STEP", "IGES", "DXF", "STL"],
  },

  expert_verdict:
    "Exceptional value for shops needing integrated CAD+CAM without the NX or CATIA price tag.",

  pricing_tiers: [
    {
      name: "Standard",
      price: "2,000",
      period: "/yr",
      features: ["3D Modeling", "Assembly", "Drafting", "Data Exchange"],
      is_popular: true,
    },
    {
      name: "Professional",
      price: "3,500",
      period: "/yr",
      features: [
        "Mold Design",
        "Electrode design",
        "Reverse Engineering",
        "Full Standard",
      ],
      is_popular: false,
    },
    {
      name: "Premium",
      price: "4,500",
      period: "/yr",
      features: [
        "2-5 Axis CAM",
        "Full Professional",
        "Post-processing",
        "Simulation",
      ],
      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Design Power",

      items: [
        {
          name: "Hybrid Modeling (Solid/Surface)",
          status: true,
        },
        {
          name: "Direct Editing Tools",
          status: true,
        },
        {
          name: "PMI (Product Mfg Info)",
          status: true,
        },
        {
          name: "Flexible Component Library",
          status: true,
        },
      ],
    },
    {
      category: "Manufacturing",

      items: [
        {
          name: "Automated Mold Design",
          status: true,
        },
        {
          name: "2-5 Axis Milling CAM",
          status: true,
        },
        {
          name: "Toolpath Optimization",
          status: true,
        },
        {
          name: "Drilling & Turning",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t90",
  name: "CAXA CAD",
  slug: "caxa-cad",
  logo_url: getLogo("CAXA CAD"),
  short_desc: "Leading Chinese 2D CAD with English market presence.",
  description:
    "CAXA CAD is a professional 2D drafting and design software developed in China, offering full DWG compatibility and specialized tools for mechanical and electrical design.",
  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 800,
  platforms: ["Windows"],
  industries: ["Mechanical", "Manufacturing", "Electrical"],
  core_features: [
    "DWG Compatibility",
    "Parametric Drawing",
    "BOM Generation",
    "Title Block Management",
  ],
  user_scales: ["Small Business", "Mid-Market", "Enterprise"],
  official_url: "https://www.caxa.com/en/",
  affiliate_url: null,
  score: 4.3,
  pros: [
    "Strong DWG support",
    "Affordable perpetual license",
    "Good for CJK environments",
  ],
  cons: [
    "Smaller global community",
    "English documentation limited",
    "Fewer plugins vs AutoCAD",
  ],
  faqs: [
    {
      q: "What is CAXA CAD used for?",
      a: "Leading Chinese 2D CAD with English market presence. CAXA CAD is a 2D CAD solution widely adopted in Mechanical, Manufacturing, Electrical.",
    },
    {
      q: "How much does CAXA CAD cost?",
      a: "CAXA CAD starts at $800 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CAXA CAD?",
      a: "CAXA CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CAXA CAD support?",
      a: "CAXA CAD runs on Windows.",
    },
    {
      q: "Which file formats does CAXA CAD support?",
      a: "CAXA CAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CAXA CAD?",
      a: "The closest alternatives within the 2D CAD space are TurboCAD Platinum, CADopia, CorelCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Proprietary 2D",
    multicore: "Low",
    gpu_optimization: "Basic",
    standards: ["DWG", "DXF", "EXB"],
  },
  expert_verdict:
    "The dominant CAD brand in China, increasingly gaining traction in global markets.",
}, {
  id: "t91",
  name: "ARES Commander",
  slug: "ares-commander",
  logo_url: getLogo("ARES Commander"),
  short_desc: "Professional DWG CAD with cross-platform trinity.",

  description:
    "ARES Commander by Graebert is a professional CAD software with full DWG support, available on Desktop, Mobile (ARES Touch) and Cloud (ARES Kudo) — the only true CAD trinity.",

  country: "Germany",
  category_id: "c1",
  pricing_type: "Subscription",
  starting_price: 200,
  platforms: ["Windows", "macOS", "Linux", "Web"],
  industries: ["Architecture", "Mechanical", "General"],
  core_features: ["DWG Drafting", "Cloud/Mobile CAD"],
  user_scales: ["Freelancer", "Small Business", "Mid-Market"],
  official_url: "https://www.graebert.com/cad-software/ares-commander/",
  affiliate_url: null,
  score: 4.5,
  pros: [
    "Only CAD with Desktop+Mobile+Cloud sync",
    "Linux support",
    "Reasonable pricing",
  ],
  cons: [
    "Smaller plugin ecosystem",
    "Less known than BricsCAD",
    "Cloud features require subscription",
  ],
  faqs: [
    {
      q: "What is ARES Commander used for?",
      a: "Professional DWG CAD with cross-platform trinity. ARES Commander is a 2D CAD solution widely adopted in Architecture, Mechanical, General.",
    },
    {
      q: "How much does ARES Commander cost?",
      a: "ARES Commander starts at $200 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of ARES Commander?",
      a: "ARES Commander is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ARES Commander support?",
      a: "ARES Commander runs on Windows, macOS, Linux, and Web. The browser-based experience requires no local install.",
    },
    {
      q: "Which file formats does ARES Commander support?",
      a: "ARES Commander works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ARES Commander?",
      a: "The closest alternatives within the 2D CAD space are DraftSight, AutoCAD, nanoCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "ARES (IntelliCAD-derived)",
    multicore: "Moderate",
    gpu_optimization: "Moderate",
    standards: ["DWG", "DXF", "PDF"],
  },

  expert_verdict:
    "The undisputed king of cross-platform DWG CAD — desktop, mobile, and cloud in perfect sync.",

  pricing_tiers: [
    {
      name: "Annual",
      price: "250",
      period: "/yr",
      features: ["Trinity Workflow", "Cloud & Mobile", "Full DWG"],
      is_popular: true,
    },
  ],

  detailed_features: [
    {
      category: "CAD",

      items: [
        {
          name: "BIM-to-CAD features",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t92",
  name: "Synopsys Fusion Compiler",
  slug: "synopsys-fusion-compiler",
  logo_url: getLogo("Synopsys"),
  short_desc: "Next-generation RTL-to-GDSII EDA compiler from Synopsys.",
  description:
    "Synopsys Fusion Compiler is an innovative RTL-to-GDSII implementation system that fuses synthesis, place and route, and signoff-driven optimization in a single, unified environment.",
  country: "USA",
  category_id: "c6",
  pricing_type: "Subscription",
  starting_price: 50000,
  platforms: ["Linux"],
  industries: ["Semiconductor", "IC Design", "Electronics"],
  core_features: [
    "RTL Synthesis",
    "Place & Route",
    "Signoff Closure",
    "AI-Driven Optimization",
  ],
  user_scales: ["Enterprise"],
  official_url:
    "https://www.synopsys.com/implementation-and-signoff/rtl-synthesis-test/fusion-compiler.html",
  affiliate_url: null,
  score: 4.9,
  pros: [
    "Industry-leading PPA results",
    "Unified RTL-to-GDSII flow",
    "AI-powered optimization",
  ],
  cons: ["Extremely expensive", "Linux only", "Requires deep EDA expertise"],
  faqs: [
    {
      q: "What is Synopsys Fusion Compiler used for?",
      a: "Next-generation RTL-to-GDSII EDA compiler from Synopsys. Synopsys Fusion Compiler is an EDA solution widely adopted in Semiconductor, IC Design, Electronics.",
    },
    {
      q: "How much does Synopsys Fusion Compiler cost?",
      a: "Synopsys Fusion Compiler starts at $50,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Synopsys Fusion Compiler?",
      a: "Synopsys Fusion Compiler is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Synopsys Fusion Compiler support?",
      a: "Synopsys Fusion Compiler runs on Linux.",
    },
    {
      q: "Which file formats does Synopsys Fusion Compiler support?",
      a: "Synopsys Fusion Compiler works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Synopsys Fusion Compiler?",
      a: "The closest alternatives within the EDA space are Altium Designer, EPLAN Electric P8, Eagle. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Synopsys Fusion Engine",
    multicore: "Ultra",
    gpu_optimization: "Ultra",
    standards: ["GDSII", "LEF/DEF", "Liberty", "Verilog"],
  },
  expert_verdict:
    "The most advanced chip implementation platform, powering designs at 3nm and below.",
}, {
  id: "t93",
  name: "CAMWorks",
  slug: "camworks",
  logo_url: getLogo("CAMWorks"),
  short_desc: "Knowledge-based CAM solution by HCL Technologies.",
  description:
    "CAMWorks is an industry-leading CAM solution developed by HCL Technologies that works natively inside SolidWorks and Solid Edge, using feature-based machining to automate CNC programming.",
  country: "USA",
  category_id: "c5",
  pricing_type: "Subscription",
  starting_price: 5000,
  platforms: ["Windows"],
  industries: ["Manufacturing", "Mold Design", "Precision Machining"],
  core_features: [
    "Feature-Based Machining",
    "VoluMill High-Speed Machining",
    "SolidWorks Integration",
    "Tolerance-Based Machining",
  ],
  user_scales: ["Small Business", "Mid-Market"],
  official_url: "https://camworks.com/",
  affiliate_url: null,
  score: 4.6,
  pros: [
    "Deep SolidWorks native integration",
    "Automated feature recognition",
    "VoluMill bundled",
  ],
  cons: [
    "SolidWorks-dependent",
    "Expensive for what it offers",
    "Support can be slow",
  ],
  faqs: [
    {
      q: "What is CAMWorks used for?",
      a: "Knowledge-based CAM solution by HCL Technologies. CAMWorks is a CAE / CAM solution widely adopted in Manufacturing, Mold Design, Precision Machining.",
    },
    {
      q: "How much does CAMWorks cost?",
      a: "CAMWorks starts at $5,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of CAMWorks?",
      a: "CAMWorks is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CAMWorks support?",
      a: "CAMWorks runs on Windows.",
    },
    {
      q: "Which file formats does CAMWorks support?",
      a: "CAMWorks works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CAMWorks?",
      a: "The closest alternatives within the CAE/CAM space are SolidCAM, Altair HyperWorks, Mastercam. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Parasolid (via SolidWorks)",
    multicore: "High",
    gpu_optimization: "Moderate",
    standards: ["STEP", "IGES", "DXF", "STL"],
  },
  expert_verdict:
    "The go-to CAM choice for SolidWorks shops seeking deep, native integration without leaving their CAD environment.",
}, {
  id: "t94",
  name: "Allplan",
  slug: "allplan",
  logo_url: getLogo("Allplan"),
  short_desc: "Professional BIM platform by Nemetschek for AEC.",

  description:
    "Allplan is a professional BIM software for architecture, engineering, and construction, developed by Nemetschek. It covers everything from concept design to construction documentation.",

  country: "Germany",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 1800,
  platforms: ["Windows"],
  industries: ["Architecture", "Structural Engineering", "Construction"],

  core_features: [
    "Multi-disciplinary BIM",
    "Reinforced Concrete Design",
    "Visual Scripting",
    "Precast Modeling",
    "Cloud Collaboration",
  ],

  user_scales: ["Small Business", "Mid-Market", "Enterprise"],
  official_url: "https://www.allplan.com/",
  affiliate_url: null,
  score: 4.5,
  pros: [
    "Strong structural engineering tools",
    "Good IFC support",
    "European market leader",
  ],
  cons: [
    "Less popular in North America",
    "Steeper learning curve",
    "UI feels dated",
  ],
  faqs: [
    {
      q: "What is Allplan used for?",
      a: "Professional BIM platform by Nemetschek for AEC. Allplan is a BIM solution widely adopted in Architecture, Structural Engineering, Construction.",
    },
    {
      q: "How much does Allplan cost?",
      a: "Allplan starts at $1,800 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of Allplan?",
      a: "Allplan is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Allplan support?",
      a: "Allplan runs on Windows.",
    },
    {
      q: "Which file formats does Allplan support?",
      a: "Allplan works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Allplan?",
      a: "The closest alternatives within the BIM space are ArchiCAD, Revit, OpenRoads Designer. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "Proprietary BIM",
    multicore: "Moderate",
    gpu_optimization: "High",
    standards: ["IFC", "DWG", "DXF", "STEP"],
  },

  expert_verdict:
    "Nemetschek's flagship BIM tool, dominant in DACH region and strong for structural-heavy projects.",

  pricing_tiers: [
    {
      name: "Architecture",
      price: "2,800",
      period: "/yr",

      features: [
        "AEC BIM modeling",
        "Reinforcement design",
        "Visual scripting",
        "Collaboration",
      ],

      is_popular: true,
    },
    {
      name: "Engineering",
      price: "3,200",
      period: "/yr",

      features: [
        "Civil Engineering",
        "Precast elements",
        "Quantity takeoff",
        "Bimplus integration",
      ],

      is_popular: false,
    },
  ],

  detailed_features: [
    {
      category: "Structural BIM",

      items: [
        {
          name: "3D Reinforcement detailing",
          status: true,
        },
        {
          name: "PythonPart technology",
          status: true,
        },
        {
          name: "Terrain modeling",
          status: true,
        },
        {
          name: "Bridge modeling (Allplan Bridge)",
          status: true,
        },
      ],
    },
    {
      category: "Architecture",

      items: [
        {
          name: "High-end Rendering (Redshift)",
          status: true,
        },
        {
          name: "Attributed BIM models",
          status: true,
        },
        {
          name: "Automatic Floor Plans",
          status: true,
        },
        {
          name: "IFC4 Multi-disciplinary sync",
          status: true,
        },
      ],
    },
  ],
}, {
  id: "t95",
  name: "OpenRoads Designer",
  slug: "openroads-designer",
  logo_url: getLogo("OpenRoads Designer"),
  short_desc: "Comprehensive civil road design platform by Bentley.",
  description:
    "OpenRoads Designer by Bentley Systems is a comprehensive BIM application for road and highway design, providing a fully dynamic design environment for road layout, drainage, and corridor modeling.",
  country: "USA",
  category_id: "c3",
  pricing_type: "Subscription",
  starting_price: 4000,
  platforms: ["Windows"],
  industries: ["Civil Engineering", "Transportation", "Infrastructure"],
  core_features: [
    "Corridor Modeling",
    "Drainage Design",
    "Terrain Modeling",
    "InRoads Migration",
  ],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.bentley.com/software/openroads-designer/",
  affiliate_url: null,
  score: 4.7,
  pros: [
    "Best-in-class road corridor modeling",
    "Deep civil BIM capabilities",
    "Strong Bentley ecosystem integration",
  ],
  cons: ["High cost", "Windows only", "Complex for simple projects"],
  faqs: [
    {
      q: "What is OpenRoads Designer used for?",
      a: "Comprehensive civil road design platform by Bentley. OpenRoads Designer is a BIM solution widely adopted in Civil Engineering, Transportation, Infrastructure.",
    },
    {
      q: "How much does OpenRoads Designer cost?",
      a: "OpenRoads Designer starts at $4,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.",
    },
    {
      q: "Is there a free version of OpenRoads Designer?",
      a: "OpenRoads Designer is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does OpenRoads Designer support?",
      a: "OpenRoads Designer runs on Windows.",
    },
    {
      q: "Which file formats does OpenRoads Designer support?",
      a: "OpenRoads Designer works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to OpenRoads Designer?",
      a: "The closest alternatives within the BIM space are Revit, Civil 3D, Allplan. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "MicroStation (Bentley)",
    multicore: "High",
    gpu_optimization: "High",
    standards: ["IFC", "DGN", "DWG", "LandXML"],
  },
  expert_verdict:
    "The definitive platform for highway and infrastructure projects at enterprise scale.",
}, {
  id: "t100",
  name: "3DEXPERIENCE",
  slug: "3dexperience",
  logo_url: getLogo("3D"),
  short_desc:
    "Through virtual twin technologies, Dassault Systèmes’ collaborative platform empowers business and people to create sust",
  description:
    "Through virtual twin technologies, Dassault Systèmes’ collaborative platform empowers business and people to create sustainable innovations.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["medusa4", "pconplanner", "crowncad"],
  country: "France",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.3ds.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is 3DEXPERIENCE used for?",
      a: "Through virtual twin technologies, Dassault Systèmes’ collaborative platform empowers business and people to create sust 3DEXPERIENCE is a 2D CAD solution.",
    },
    {
      q: "How much does 3DEXPERIENCE cost?",
      a: "3DEXPERIENCE is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of 3DEXPERIENCE?",
      a: "3DEXPERIENCE is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does 3DEXPERIENCE support?",
      a: "3DEXPERIENCE runs on macOS.",
    },
    {
      q: "Which file formats does 3DEXPERIENCE support?",
      a: "3DEXPERIENCE works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to 3DEXPERIENCE?",
      a: "The closest alternatives within the 2D CAD space are MEDUSA4, pCon.planner, CrownCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "3DEXPERIENCE Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t101",
  name: "TopSolid",
  slug: "topsolid",
  logo_url: getLogo("TO"),
  short_desc:
    "TopSolid, a global leader in CAD/CAM/ERP software publishing, primarily targets the mechanical engineering, sheet metal ",
  description:
    "TopSolid, a global leader in CAD/CAM/ERP software publishing, primarily targets the mechanical engineering, sheet metal working/boiler making, and woodworking industries.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["beckercad", "cadmeister", "visi"],
  country: "France",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.topsolid.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is TopSolid used for?",
      a: "TopSolid, a global leader in CAD/CAM/ERP software publishing, primarily targets the mechanical engineering, sheet metal  TopSolid is a CAE / CAM solution.",
    },
    {
      q: "How much does TopSolid cost?",
      a: "TopSolid is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of TopSolid?",
      a: "TopSolid is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does TopSolid support?",
      a: "TopSolid runs on Windows.",
    },
    {
      q: "Which file formats does TopSolid support?",
      a: "TopSolid works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to TopSolid?",
      a: "The closest alternatives within the CAE/CAM space are BeckerCAD, CADmeister, Visi. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "TopSolid Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t102",
  name: "BIMoffice",
  slug: "bimoffice",
  logo_url: getLogo("BI"),
  short_desc: "简要介绍 BIMoffice（官方站点）",
  description: "详细介绍 BIMoffice（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["hicad", "renga", "edificius"],
  country: "France",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.bimoffice.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is BIMoffice used for?",
      a: "简要介绍 BIMoffice（官方站点） BIMoffice is a BIM solution.",
    },
    {
      q: "How much does BIMoffice cost?",
      a: "BIMoffice is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of BIMoffice?",
      a: "BIMoffice is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does BIMoffice support?",
      a: "BIMoffice runs on Windows.",
    },
    {
      q: "Which file formats does BIMoffice support?",
      a: "BIMoffice works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to BIMoffice?",
      a: "The closest alternatives within the BIM space are HiCAD, Renga, Edificius. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "BIMoffice Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t103",
  name: "EPLAN",
  slug: "eplan",
  logo_url: getLogo("EP"),
  short_desc:
    "Eplan offers automated electrical engineering software for panel building and switchgear manufacturing.",
  description:
    "Eplan offers automated electrical engineering software for panel building and switchgear manufacturing.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["cr-8000", "quadcept", "allegro-pcb"],
  country: "Germany",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.eplan-software.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is EPLAN used for?",
      a: "Eplan offers automated electrical engineering software for panel building and switchgear manufacturing. EPLAN is an EDA solution.",
    },
    {
      q: "How much does EPLAN cost?",
      a: "EPLAN is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of EPLAN?",
      a: "EPLAN is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does EPLAN support?",
      a: "EPLAN runs on Windows.",
    },
    {
      q: "Which file formats does EPLAN support?",
      a: "EPLAN works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to EPLAN?",
      a: "The closest alternatives within the EDA space are CR-8000, Quadcept, Allegro PCB. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "EPLAN Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t104",
  name: "MEDUSA4",
  slug: "medusa4",
  logo_url: getLogo("ME"),
  short_desc:
    "Benefit from intelligent 2D & 3D CAD software, immersive AR and VR apps for virtual experiences, training and services f",
  description:
    "Benefit from intelligent 2D & 3D CAD software, immersive AR and VR apps for virtual experiences, training and services for mechanical engineering, factory layout, plant design.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "pconplanner", "crowncad"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.cad-schroer.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is MEDUSA4 used for?",
      a: "Benefit from intelligent 2D & 3D CAD software, immersive AR and VR apps for virtual experiences, training and services f MEDUSA4 is a 2D CAD solution.",
    },
    {
      q: "How much does MEDUSA4 cost?",
      a: "MEDUSA4 is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of MEDUSA4?",
      a: "MEDUSA4 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MEDUSA4 support?",
      a: "MEDUSA4 runs on Windows.",
    },
    {
      q: "Which file formats does MEDUSA4 support?",
      a: "MEDUSA4 works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MEDUSA4?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, pCon.planner, CrownCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "MEDUSA4 Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t105",
  name: "HiCAD",
  slug: "hicad",
  logo_url: getLogo("HI"),
  short_desc:
    "ISD bietet Lösungen für 2D-/3D-CAD und PDM/PLM für Konstruktionsaufgaben im Maschinenbau, Anlagenbau, Blechbearbeitung, ",
  description:
    "ISD bietet Lösungen für 2D-/3D-CAD und PDM/PLM für Konstruktionsaufgaben im Maschinenbau, Anlagenbau, Blechbearbeitung, Stahl- und Metallbau.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "renga", "edificius"],
  country: "Germany",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.isdgroup.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is HiCAD used for?",
      a: "ISD bietet Lösungen für 2D-/3D-CAD und PDM/PLM für Konstruktionsaufgaben im Maschinenbau, Anlagenbau, Blechbearbeitung,  HiCAD is a BIM solution.",
    },
    {
      q: "How much does HiCAD cost?",
      a: "HiCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of HiCAD?",
      a: "HiCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does HiCAD support?",
      a: "HiCAD runs on Windows.",
    },
    {
      q: "Which file formats does HiCAD support?",
      a: "HiCAD works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to HiCAD?",
      a: "The closest alternatives within the BIM space are BIMoffice, Renga, Edificius. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "HiCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t106",
  name: "BeckerCAD",
  slug: "beckercad",
  logo_url: getLogo("BE"),
  short_desc: "简要介绍 BeckerCAD（官方站点）",
  description: "详细介绍 BeckerCAD（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "cadmeister", "visi"],
  country: "Germany",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.beckercad.de/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is BeckerCAD used for?",
      a: "简要介绍 BeckerCAD（官方站点） BeckerCAD is a CAE / CAM solution.",
    },
    {
      q: "How much does BeckerCAD cost?",
      a: "BeckerCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of BeckerCAD?",
      a: "BeckerCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does BeckerCAD support?",
      a: "BeckerCAD runs on Windows.",
    },
    {
      q: "Which file formats does BeckerCAD support?",
      a: "BeckerCAD works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to BeckerCAD?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, CADmeister, Visi. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "BeckerCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t107",
  name: "pCon.planner",
  slug: "pconplanner",
  logo_url: getLogo("PC"),
  short_desc: "简要介绍 pCon.planner（官方站点）",
  description: "详细介绍 pCon.planner（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "crowncad"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://pcon-planner.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is pCon.planner used for?",
      a: "简要介绍 pCon.planner（官方站点） pCon.planner is a 2D CAD solution.",
    },
    {
      q: "How much does pCon.planner cost?",
      a: "pCon.planner is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of pCon.planner?",
      a: "pCon.planner is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does pCon.planner support?",
      a: "pCon.planner runs on Windows and macOS.",
    },
    {
      q: "Which file formats does pCon.planner support?",
      a: "pCon.planner works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to pCon.planner?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, CrownCAD. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "pCon.planner Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t108",
  name: "CrownCAD",
  slug: "crowncad",
  logo_url: getLogo("CR"),
  short_desc:
    "华云三维致力于面向智能制造的工业软件研发和推广，拥有自主研发的三维几何建模引擎和几何约束求解器，基于这两项三维CAD核心技术，专注打造完全自主可控、基于云架构的三维CAD平台皇冠CAD（CrownCAD）",
  description:
    "华云三维致力于面向智能制造的工业软件研发和推广，拥有自主研发的三维几何建模引擎和几何约束求解器，基于这两项三维CAD核心技术，专注打造完全自主可控、基于云架构的三维CAD平台皇冠CAD（CrownCAD）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.crowncad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CrownCAD used for?",
      a: "华云三维致力于面向智能制造的工业软件研发和推广，拥有自主研发的三维几何建模引擎和几何约束求解器，基于这两项三维CAD核心技术，专注打造完全自主可控、基于云架构的三维CAD平台皇冠CAD（CrownCAD） CrownCAD is a 2D CAD solution.",
    },
    {
      q: "How much does CrownCAD cost?",
      a: "CrownCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CrownCAD?",
      a: "CrownCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CrownCAD support?",
      a: "CrownCAD runs on Windows.",
    },
    {
      q: "Which file formats does CrownCAD support?",
      a: "CrownCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CrownCAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CrownCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t109",
  name: "SINOVATION",
  slug: "sinovation",
  logo_url: getLogo("SI"),
  short_desc: "简要介绍 SINOVATION（官方站点）",
  description: "详细介绍 SINOVATION（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "http://www.hweast.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is SINOVATION used for?",
      a: "简要介绍 SINOVATION（官方站点） SINOVATION is a 2D CAD solution.",
    },
    {
      q: "How much does SINOVATION cost?",
      a: "SINOVATION is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of SINOVATION?",
      a: "SINOVATION is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does SINOVATION support?",
      a: "SINOVATION runs on Windows.",
    },
    {
      q: "Which file formats does SINOVATION support?",
      a: "SINOVATION works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SINOVATION?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SINOVATION Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t110",
  name: "HaoChen CAD",
  slug: "haochen-cad",
  logo_url: getLogo("HA"),
  short_desc: "简要介绍 HaoChen CAD（官方站点）",
  description: "详细介绍 HaoChen CAD（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "http://www.hccad.net/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is HaoChen CAD used for?",
      a: "简要介绍 HaoChen CAD（官方站点） HaoChen CAD is a 2D CAD solution.",
    },
    {
      q: "How much does HaoChen CAD cost?",
      a: "HaoChen CAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of HaoChen CAD?",
      a: "HaoChen CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does HaoChen CAD support?",
      a: "HaoChen CAD runs on Windows.",
    },
    {
      q: "Which file formats does HaoChen CAD support?",
      a: "HaoChen CAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to HaoChen CAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "HaoChen CAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t111",
  name: "CR-8000",
  slug: "cr-8000",
  logo_url: getLogo("CR"),
  short_desc:
    "Zuken Americas is part of a global software company offering advanced design solutions for the creation and management o",
  description:
    "Zuken Americas is part of a global software company offering advanced design solutions for the creation and management of PCB designs, electrical and fluid systems and 3D cabinet and wire harness layouts.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "quadcept", "allegro-pcb"],
  country: "Japan",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.zuken.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CR-8000 used for?",
      a: "Zuken Americas is part of a global software company offering advanced design solutions for the creation and management o CR-8000 is an EDA solution.",
    },
    {
      q: "How much does CR-8000 cost?",
      a: "CR-8000 is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CR-8000?",
      a: "CR-8000 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CR-8000 support?",
      a: "CR-8000 runs on Windows and macOS.",
    },
    {
      q: "Which file formats does CR-8000 support?",
      a: "CR-8000 works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CR-8000?",
      a: "The closest alternatives within the EDA space are EPLAN, Quadcept, Allegro PCB. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CR-8000 Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t112",
  name: "CADmeister",
  slug: "cadmeister",
  logo_url: getLogo("CA"),
  short_desc: "简要介绍 CADmeister（官方站点）",
  description: "详细介绍 CADmeister（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "visi"],
  country: "Japan",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.uel.co.jp/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CADmeister used for?",
      a: "简要介绍 CADmeister（官方站点） CADmeister is a CAE / CAM solution.",
    },
    {
      q: "How much does CADmeister cost?",
      a: "CADmeister is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CADmeister?",
      a: "CADmeister is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CADmeister support?",
      a: "CADmeister runs on Windows.",
    },
    {
      q: "Which file formats does CADmeister support?",
      a: "CADmeister works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CADmeister?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, Visi. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CADmeister Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t113",
  name: "IJCAD",
  slug: "ijcad",
  logo_url: getLogo("IJ"),
  short_desc:
    "IJCADはAutoCADと互換性のあるソフトウェアとして高いシェアを誇っています。IJCADは業種や規模を限定せず、.dwg図面が使われるあらゆるシーンで活用が可能です。",
  description:
    "IJCADはAutoCADと互換性のあるソフトウェアとして高いシェアを誇っています。IJCADは業種や規模を限定せず、.dwg図面が使われるあらゆるシーンで活用が可能です。",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Japan",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.ijcad.jp/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is IJCAD used for?",
      a: "IJCADはAutoCADと互換性のあるソフトウェアとして高いシェアを誇っています。IJCADは業種や規模を限定せず、.dwg図面が使われるあらゆるシーンで活用が可能です。 IJCAD is a 2D CAD solution.",
    },
    {
      q: "How much does IJCAD cost?",
      a: "IJCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of IJCAD?",
      a: "IJCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does IJCAD support?",
      a: "IJCAD runs on Windows.",
    },
    {
      q: "Which file formats does IJCAD support?",
      a: "IJCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to IJCAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "IJCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t114",
  name: "Quadcept",
  slug: "quadcept",
  logo_url: getLogo("QU"),
  short_desc:
    "Quadcept is a pay as you go cloud based CAD system offering robust features.",
  description:
    "Quadcept is a pay as you go cloud based CAD system offering robust features.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "allegro-pcb"],
  country: "Japan",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.quadcept.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Quadcept used for?",
      a: "Quadcept is a pay as you go cloud based CAD system offering robust features. Quadcept is an EDA solution.",
    },
    {
      q: "How much does Quadcept cost?",
      a: "Quadcept is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Quadcept?",
      a: "Quadcept is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Quadcept support?",
      a: "Quadcept runs on Windows.",
    },
    {
      q: "Which file formats does Quadcept support?",
      a: "Quadcept works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Quadcept?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Allegro PCB. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Quadcept Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t115",
  name: "RootPro CAD",
  slug: "rootpro-cad",
  logo_url: getLogo("RO"),
  short_desc:
    "RootPro CAD is 2D general-purpose CAD software that can create design drawings for various fields such as mechanical, ar",
  description:
    "RootPro CAD is 2D general-purpose CAD software that can create design drawings for various fields such as mechanical, architecture, civil engineering, and electronics. It can be used by many people such as design, construction, quality control, and drawing management. RootPro CAD has a free version that can be used for free and a professional version that can be used with subscription license. Please use it according to your needs.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Japan",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.rootprocad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is RootPro CAD used for?",
      a: "RootPro CAD is 2D general-purpose CAD software that can create design drawings for various fields such as mechanical, ar RootPro CAD is a 2D CAD solution.",
    },
    {
      q: "How much does RootPro CAD cost?",
      a: "RootPro CAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of RootPro CAD?",
      a: "RootPro CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does RootPro CAD support?",
      a: "RootPro CAD runs on Windows and macOS.",
    },
    {
      q: "Which file formats does RootPro CAD support?",
      a: "RootPro CAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to RootPro CAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "RootPro CAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t116",
  name: "V-nas",
  slug: "v-nas",
  logo_url: getLogo("V"),
  short_desc:
    "情報サービスコンサルタント『川田テクノシステム株式会社（KTS）』の公式ホームページです。KTSの取り組みのご紹介、製品情報のご紹介、各種お申込みのご案内を掲載しています。",
  description:
    "情報サービスコンサルタント『川田テクノシステム株式会社（KTS）』の公式ホームページです。KTSの取り組みのご紹介、製品情報のご紹介、各種お申込みのご案内を掲載しています。",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Japan",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.kts.co.jp/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is V-nas used for?",
      a: "情報サービスコンサルタント『川田テクノシステム株式会社（KTS）』の公式ホームページです。KTSの取り組みのご紹介、製品情報のご紹介、各種お申込みのご案内を掲載しています。 V-nas is a 2D CAD solution.",
    },
    {
      q: "How much does V-nas cost?",
      a: "V-nas is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of V-nas?",
      a: "V-nas is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does V-nas support?",
      a: "V-nas runs on Windows.",
    },
    {
      q: "Which file formats does V-nas support?",
      a: "V-nas works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to V-nas?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "V-nas Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t117",
  name: "KOMPAS-3D",
  slug: "kompas-3d",
  logo_url: getLogo("KO"),
  short_desc:
    "The official website of ASCON, a leading software developer for design, manufacturing, and data management solutions.",
  description:
    "The official website of ASCON, a leading software developer for design, manufacturing, and data management solutions.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Russia",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://ascon.net/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is KOMPAS-3D used for?",
      a: "The official website of ASCON, a leading software developer for design, manufacturing, and data management solutions. KOMPAS-3D is a 2D CAD solution.",
    },
    {
      q: "How much does KOMPAS-3D cost?",
      a: "KOMPAS-3D is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of KOMPAS-3D?",
      a: "KOMPAS-3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does KOMPAS-3D support?",
      a: "KOMPAS-3D runs on Windows.",
    },
    {
      q: "Which file formats does KOMPAS-3D support?",
      a: "KOMPAS-3D works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to KOMPAS-3D?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "KOMPAS-3D Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t118",
  name: "T-FLEX CAD",
  slug: "t-flex-cad",
  logo_url: getLogo("T"),
  short_desc:
    "Top Systems offers the comprehensive set of integrated applications for T-FLEX Parametric CAD, including CAM, FEA and PD",
  description:
    "Top Systems offers the comprehensive set of integrated applications for T-FLEX Parametric CAD, including CAM, FEA and PDM",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Russia",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.tflex.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is T-FLEX CAD used for?",
      a: "Top Systems offers the comprehensive set of integrated applications for T-FLEX Parametric CAD, including CAM, FEA and PD T-FLEX CAD is a 2D CAD solution.",
    },
    {
      q: "How much does T-FLEX CAD cost?",
      a: "T-FLEX CAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of T-FLEX CAD?",
      a: "T-FLEX CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does T-FLEX CAD support?",
      a: "T-FLEX CAD runs on Windows.",
    },
    {
      q: "Which file formats does T-FLEX CAD support?",
      a: "T-FLEX CAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to T-FLEX CAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "T-FLEX CAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t119",
  name: "Renga",
  slug: "renga",
  logo_url: getLogo("RE"),
  short_desc:
    "Renga - российская BIM-система для совместного архитектурного проектирования, разработки несущих конструкций, внутренних",
  description:
    "Renga - российская BIM-система для совместного архитектурного проектирования, разработки несущих конструкций, внутренних инженерных сетей и технологической части зданий и сооружений.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "edificius"],
  country: "Russia",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://rengabim.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Renga used for?",
      a: "Renga - российская BIM-система для совместного архитектурного проектирования, разработки несущих конструкций, внутренних Renga is a BIM solution.",
    },
    {
      q: "How much does Renga cost?",
      a: "Renga is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Renga?",
      a: "Renga is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Renga support?",
      a: "Renga runs on Windows.",
    },
    {
      q: "Which file formats does Renga support?",
      a: "Renga works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Renga?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Edificius. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Renga Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t120",
  name: "Model Studio CS",
  slug: "model-studio-cs",
  logo_url: getLogo("MO"),
  short_desc: "简要介绍 Model Studio CS（官方站点）",
  description: "详细介绍 Model Studio CS（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Russia",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.mstudio.ru/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Model Studio CS used for?",
      a: "简要介绍 Model Studio CS（官方站点） Model Studio CS is a 2D CAD solution.",
    },
    {
      q: "How much does Model Studio CS cost?",
      a: "Model Studio CS is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Model Studio CS?",
      a: "Model Studio CS is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Model Studio CS support?",
      a: "Model Studio CS runs on Windows.",
    },
    {
      q: "Which file formats does Model Studio CS support?",
      a: "Model Studio CS works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Model Studio CS?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Model Studio CS Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t121",
  name: "AVEVA E3D Design",
  slug: "aveva-e3d-design",
  logo_url: getLogo("AV"),
  short_desc:
    "At AVEVA, we work with you and harness the power of our ecosystem, to deliver solutions and expertise to optimize engine",
  description:
    "At AVEVA, we work with you and harness the power of our ecosystem, to deliver solutions and expertise to optimize engineering, operations and performance.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "UK",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.aveva.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is AVEVA E3D Design used for?",
      a: "At AVEVA, we work with you and harness the power of our ecosystem, to deliver solutions and expertise to optimize engine AVEVA E3D Design is a 2D CAD solution.",
    },
    {
      q: "How much does AVEVA E3D Design cost?",
      a: "AVEVA E3D Design is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of AVEVA E3D Design?",
      a: "AVEVA E3D Design is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does AVEVA E3D Design support?",
      a: "AVEVA E3D Design runs on Windows.",
    },
    {
      q: "Which file formats does AVEVA E3D Design support?",
      a: "AVEVA E3D Design works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to AVEVA E3D Design?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AVEVA E3D Design Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t122",
  name: "DesignSpark Mechanical",
  slug: "designspark-mechanical",
  logo_url: getLogo("DE"),
  short_desc:
    "Your go-to design engineering platform – Accelerate your design time to market with design software, access to CAD neutral.",
  description:
    "Your go-to design engineering platform – Accelerate your design time to market with design software, access to CAD neutral libraries, early introduction to products and support from engineers and manufacturers.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "UK",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.rs-online.com/designspark/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is DesignSpark Mechanical used for?",
      a: "Your go-to design engineering platform – Accelerate your design time to market with design software, access to CAD neutral. DesignSpark Mechanical is a 2D CAD solution.",
    },
    {
      q: "How much does DesignSpark Mechanical cost?",
      a: "DesignSpark Mechanical is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of DesignSpark Mechanical?",
      a: "DesignSpark Mechanical is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does DesignSpark Mechanical support?",
      a: "DesignSpark Mechanical runs on Windows.",
    },
    {
      q: "Which file formats does DesignSpark Mechanical support?",
      a: "DesignSpark Mechanical works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to DesignSpark Mechanical?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "DesignSpark Mechanical Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t123",
  name: "LUSAS",
  slug: "lusas",
  logo_url: getLogo("LU"),
  short_desc: "简要介绍 LUSAS（官方站点）",
  description: "详细介绍 LUSAS（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "UK",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.lusas.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is LUSAS used for?",
      a: "简要介绍 LUSAS（官方站点） LUSAS is a 2D CAD solution.",
    },
    {
      q: "How much does LUSAS cost?",
      a: "LUSAS is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of LUSAS?",
      a: "LUSAS is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does LUSAS support?",
      a: "LUSAS runs on Windows.",
    },
    {
      q: "Which file formats does LUSAS support?",
      a: "LUSAS works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to LUSAS?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "LUSAS Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t124",
  name: "Visi",
  slug: "visi",
  logo_url: getLogo("VI"),
  short_desc: "简要介绍 Visi（官方站点）",
  description: "详细介绍 Visi（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "UK",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.hexagonmi.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Visi used for?",
      a: "简要介绍 Visi（官方站点） Visi is a CAE / CAM solution.",
    },
    {
      q: "How much does Visi cost?",
      a: "Visi is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Visi?",
      a: "Visi is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Visi support?",
      a: "Visi runs on Windows.",
    },
    {
      q: "Which file formats does Visi support?",
      a: "Visi works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Visi?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Visi Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t125",
  name: "Edgecam",
  slug: "edgecam",
  logo_url: getLogo("ED"),
  short_desc: "简要介绍 Edgecam（官方站点）",
  description: "详细介绍 Edgecam（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "UK",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.hexagonmi.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Edgecam used for?",
      a: "简要介绍 Edgecam（官方站点） Edgecam is a CAE / CAM solution.",
    },
    {
      q: "How much does Edgecam cost?",
      a: "Edgecam is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Edgecam?",
      a: "Edgecam is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Edgecam support?",
      a: "Edgecam runs on Windows.",
    },
    {
      q: "Which file formats does Edgecam support?",
      a: "Edgecam works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Edgecam?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Edgecam Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t126",
  name: "midas Civil",
  slug: "midas-civil",
  logo_url: getLogo("MI"),
  short_desc:
    "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, an",
  description:
    "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, and machinery. It responds to a wide range of static, dynamic, nonlinear, ground analysis, liquidation, seismic analysis, and BIM linkage with FEA NX, CIVIL NX, iGEN, SOILWORKS, etc.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "South Korea",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.midasoft.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is midas Civil used for?",
      a: "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, an midas Civil is a 2D CAD solution.",
    },
    {
      q: "How much does midas Civil cost?",
      a: "midas Civil is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of midas Civil?",
      a: "midas Civil is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does midas Civil support?",
      a: "midas Civil runs on Windows and macOS.",
    },
    {
      q: "Which file formats does midas Civil support?",
      a: "midas Civil works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to midas Civil?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "midas Civil Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t127",
  name: "midas Gen",
  slug: "midas-gen",
  logo_url: getLogo("MI"),
  short_desc:
    "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, an",
  description:
    "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, and machinery. It responds to a wide range of static, dynamic, nonlinear, ground analysis, liquidation, seismic analysis, and BIM linkage with FEA NX, CIVIL NX, iGEN, SOILWORKS, etc.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "South Korea",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.midasoft.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is midas Gen used for?",
      a: "MIDAS provides structural analysis and FEM analysis software specialized in the fields of architecture, soil, ground, an midas Gen is a 2D CAD solution.",
    },
    {
      q: "How much does midas Gen cost?",
      a: "midas Gen is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of midas Gen?",
      a: "midas Gen is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does midas Gen support?",
      a: "midas Gen runs on Windows and macOS.",
    },
    {
      q: "Which file formats does midas Gen support?",
      a: "midas Gen works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to midas Gen?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "midas Gen Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t128",
  name: "CADian",
  slug: "cadian",
  logo_url: getLogo("CA"),
  short_desc:
    "30년 이상의 개발 역사가 말해주듯, 신뢰할 수 있는 국산 CAD, CADian!",
  description:
    "30년 이상의 개발 역사가 말해주듯, 신뢰할 수 있는 국산 CAD, CADian!",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "South Korea",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.cadian.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CADian used for?",
      a: "30년 이상의 개발 역사가 말해주듯, 신뢰할 수 있는 국산 CAD, CADian! CADian is a 2D CAD solution.",
    },
    {
      q: "How much does CADian cost?",
      a: "CADian is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CADian?",
      a: "CADian is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CADian support?",
      a: "CADian runs on Windows.",
    },
    {
      q: "Which file formats does CADian support?",
      a: "CADian works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CADian?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CADian Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t130",
  name: "Edificius",
  slug: "edificius",
  logo_url: getLogo("ED"),
  short_desc:
    "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering a",
  description:
    "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering and construction industries",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Italy",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.accasoftware.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Edificius used for?",
      a: "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering a Edificius is a BIM solution.",
    },
    {
      q: "How much does Edificius cost?",
      a: "Edificius is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Edificius?",
      a: "Edificius is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Edificius support?",
      a: "Edificius runs on Windows.",
    },
    {
      q: "Which file formats does Edificius support?",
      a: "Edificius works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Edificius?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Edificius Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t131",
  name: "EdiLus",
  slug: "edilus",
  logo_url: getLogo("ED"),
  short_desc:
    "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering a",
  description:
    "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering and construction industries",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Italy",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.accasoftware.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is EdiLus used for?",
      a: "The company with the highest number of IFC certified software solutions in the world for the architecture, engineering a EdiLus is a BIM solution.",
    },
    {
      q: "How much does EdiLus cost?",
      a: "EdiLus is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of EdiLus?",
      a: "EdiLus is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does EdiLus support?",
      a: "EdiLus runs on Windows.",
    },
    {
      q: "Which file formats does EdiLus support?",
      a: "EdiLus works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to EdiLus?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "EdiLus Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t132",
  name: "think3",
  slug: "think3",
  logo_url: getLogo("TH"),
  short_desc: "简要介绍 think3（官方站点）",
  description: "详细介绍 think3（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Italy",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.think3.eu/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is think3 used for?",
      a: "简要介绍 think3（官方站点） think3 is a 2D CAD solution.",
    },
    {
      q: "How much does think3 cost?",
      a: "think3 is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of think3?",
      a: "think3 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does think3 support?",
      a: "think3 runs on Windows.",
    },
    {
      q: "Which file formats does think3 support?",
      a: "think3 works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to think3?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "think3 Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t133",
  name: "Maptek Vulcan",
  slug: "maptek-vulcan",
  logo_url: getLogo("MA"),
  short_desc:
    "Maptek™ is a leading provider of innovative software, hardware and services for the mining industry. Founded 40 years ag",
  description:
    "Maptek™ is a leading provider of innovative software, hardware and services for the mining industry. Founded 40 years ago, Maptek develops products which are used at more than 2500 sites in 90 countries. Our technology solutions cover the whole mining cycle from exploration to reclamation.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Australia",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.maptek.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Maptek Vulcan used for?",
      a: "Maptek™ is a leading provider of innovative software, hardware and services for the mining industry. Founded 40 years ag Maptek Vulcan is a 2D CAD solution.",
    },
    {
      q: "How much does Maptek Vulcan cost?",
      a: "Maptek Vulcan is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Maptek Vulcan?",
      a: "Maptek Vulcan is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Maptek Vulcan support?",
      a: "Maptek Vulcan runs on Windows.",
    },
    {
      q: "Which file formats does Maptek Vulcan support?",
      a: "Maptek Vulcan works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Maptek Vulcan?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Maptek Vulcan Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t134",
  name: "Promine",
  slug: "promine",
  logo_url: getLogo("PR"),
  short_desc:
    "Solutions for Everyday Mining. Our users are guranteed a user-friendly mining and surveying software adaptable to today’",
  description:
    "Solutions for Everyday Mining. Our users are guranteed a user-friendly mining and surveying software adaptable to today’s mining industry.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Canada",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.promine.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Promine used for?",
      a: "Solutions for Everyday Mining. Our users are guranteed a user-friendly mining and surveying software adaptable to today’ Promine is a 2D CAD solution.",
    },
    {
      q: "How much does Promine cost?",
      a: "Promine is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Promine?",
      a: "Promine is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Promine support?",
      a: "Promine runs on Windows.",
    },
    {
      q: "Which file formats does Promine support?",
      a: "Promine works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Promine?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Promine Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t135",
  name: "OOFELIE",
  slug: "oofelie",
  logo_url: getLogo("OO"),
  short_desc:
    "Open Engineering is a European high-tech supplier of multiphysics simulations engineering tools and services.",
  description:
    "Open Engineering is a European high-tech supplier of multiphysics simulations engineering tools and services.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Belgium",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.open-engineering.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is OOFELIE used for?",
      a: "Open Engineering is a European high-tech supplier of multiphysics simulations engineering tools and services. OOFELIE is a 2D CAD solution.",
    },
    {
      q: "How much does OOFELIE cost?",
      a: "OOFELIE is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of OOFELIE?",
      a: "OOFELIE is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does OOFELIE support?",
      a: "OOFELIE runs on Windows.",
    },
    {
      q: "Which file formats does OOFELIE support?",
      a: "OOFELIE works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to OOFELIE?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "OOFELIE Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t136",
  name: "CYPECAD",
  slug: "cypecad",
  logo_url: getLogo("CY"),
  short_desc:
    "Technical software for structural design, mep systems, construction management. Engineering projects. Pathology",
  description:
    "Technical software for structural design, mep systems, construction management. Engineering projects. Pathology",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Spain",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.cype.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CYPECAD used for?",
      a: "Technical software for structural design, mep systems, construction management. Engineering projects. Pathology CYPECAD is a 2D CAD solution.",
    },
    {
      q: "How much does CYPECAD cost?",
      a: "CYPECAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CYPECAD?",
      a: "CYPECAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CYPECAD support?",
      a: "CYPECAD runs on Windows.",
    },
    {
      q: "Which file formats does CYPECAD support?",
      a: "CYPECAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CYPECAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CYPECAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t137",
  name: "TeKton3D",
  slug: "tekton3d",
  logo_url: getLogo("TE"),
  short_desc:
    "Desarrollo de software para el diseño y cálculo de instalaciones y estructuras en edificios y aplicación del Código Técn",
  description:
    "Desarrollo de software para el diseño y cálculo de instalaciones y estructuras en edificios y aplicación del Código Técnico de la Edificación",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Spain",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.imventa.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is TeKton3D used for?",
      a: "Desarrollo de software para el diseño y cálculo de instalaciones y estructuras en edificios y aplicación del Código Técn TeKton3D is a 2D CAD solution.",
    },
    {
      q: "How much does TeKton3D cost?",
      a: "TeKton3D is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of TeKton3D?",
      a: "TeKton3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does TeKton3D support?",
      a: "TeKton3D runs on Windows.",
    },
    {
      q: "Which file formats does TeKton3D support?",
      a: "TeKton3D works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to TeKton3D?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "TeKton3D Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t138",
  name: "KISSsoft",
  slug: "kisssoft",
  logo_url: getLogo("KI"),
  short_desc: "简要介绍 KISSsoft（官方站点）",
  description: "详细介绍 KISSsoft（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Switzerland",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.kisssoft.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is KISSsoft used for?",
      a: "简要介绍 KISSsoft（官方站点） KISSsoft is a CAE / CAM solution.",
    },
    {
      q: "How much does KISSsoft cost?",
      a: "KISSsoft is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of KISSsoft?",
      a: "KISSsoft is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does KISSsoft support?",
      a: "KISSsoft runs on Windows.",
    },
    {
      q: "Which file formats does KISSsoft support?",
      a: "KISSsoft works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to KISSsoft?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "KISSsoft Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t139",
  name: "cadwork",
  slug: "cadwork",
  logo_url: getLogo("CA"),
  short_desc: "Cadwork CAD/CAM software for timber construction.",
  description: "Cadwork CAD/CAM software for timber construction.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Switzerland",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.cadwork.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is cadwork used for?",
      a: "Cadwork CAD/CAM software for timber construction. cadwork is a BIM solution.",
    },
    {
      q: "How much does cadwork cost?",
      a: "cadwork is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of cadwork?",
      a: "cadwork is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does cadwork support?",
      a: "cadwork runs on Windows.",
    },
    {
      q: "Which file formats does cadwork support?",
      a: "cadwork works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to cadwork?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "cadwork Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t140",
  name: "MagiCAD",
  slug: "magicad",
  logo_url: getLogo("MA"),
  short_desc:
    "MagiCAD Group specialises in MEP design software for designers and BIM solutions for MEP manufacturers in the constructi",
  description:
    "MagiCAD Group specialises in MEP design software for designers and BIM solutions for MEP manufacturers in the construction industry.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Finland",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.magicad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is MagiCAD used for?",
      a: "MagiCAD Group specialises in MEP design software for designers and BIM solutions for MEP manufacturers in the constructi MagiCAD is a BIM solution.",
    },
    {
      q: "How much does MagiCAD cost?",
      a: "MagiCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of MagiCAD?",
      a: "MagiCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MagiCAD support?",
      a: "MagiCAD runs on Windows.",
    },
    {
      q: "Which file formats does MagiCAD support?",
      a: "MagiCAD works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MagiCAD?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "MagiCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t141",
  name: "Vertex BD",
  slug: "vertex-bd",
  logo_url: getLogo("VE"),
  short_desc:
    "Vertexin kotimaiset 3D-suunnitteluohjelmat sekä tiedonhallintaratkaisut teollisuudelle. 3D CAD, PDM ja PLM – lue lisää o",
  description:
    "Vertexin kotimaiset 3D-suunnitteluohjelmat sekä tiedonhallintaratkaisut teollisuudelle. 3D CAD, PDM ja PLM – lue lisää ohjelmistoista sivuiltamme.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Finland",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.vertex.fi/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Vertex BD used for?",
      a: "Vertexin kotimaiset 3D-suunnitteluohjelmat sekä tiedonhallintaratkaisut teollisuudelle. 3D CAD, PDM ja PLM – lue lisää o Vertex BD is a 2D CAD solution.",
    },
    {
      q: "How much does Vertex BD cost?",
      a: "Vertex BD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Vertex BD?",
      a: "Vertex BD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Vertex BD support?",
      a: "Vertex BD runs on Windows.",
    },
    {
      q: "Which file formats does Vertex BD support?",
      a: "Vertex BD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Vertex BD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Vertex BD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t142",
  name: "CET Designer",
  slug: "cet-designer",
  logo_url: getLogo("CE"),
  short_desc:
    "We offer space planning software solutions that will help you streamline your sales, design and order processes.",
  description:
    "We offer space planning software solutions that will help you streamline your sales, design and order processes.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Sweden",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.configura.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CET Designer used for?",
      a: "We offer space planning software solutions that will help you streamline your sales, design and order processes. CET Designer is a 2D CAD solution.",
    },
    {
      q: "How much does CET Designer cost?",
      a: "CET Designer is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CET Designer?",
      a: "CET Designer is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CET Designer support?",
      a: "CET Designer runs on Windows.",
    },
    {
      q: "Which file formats does CET Designer support?",
      a: "CET Designer works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CET Designer?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CET Designer Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t143",
  name: "ActCAD",
  slug: "actcad",
  logo_url: getLogo("AC"),
  short_desc: "简要介绍 ActCAD（官方站点）",
  description: "详细介绍 ActCAD（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "India",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://actcad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is ActCAD used for?",
      a: "简要介绍 ActCAD（官方站点） ActCAD is a 2D CAD solution.",
    },
    {
      q: "How much does ActCAD cost?",
      a: "ActCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of ActCAD?",
      a: "ActCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ActCAD support?",
      a: "ActCAD runs on Windows and macOS.",
    },
    {
      q: "Which file formats does ActCAD support?",
      a: "ActCAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ActCAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ActCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t144",
  name: "CADVision",
  slug: "cadvision",
  logo_url: getLogo("CA"),
  short_desc: "简要介绍 CADVision（官方站点）",
  description: "详细介绍 CADVision（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "India",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.cadvision.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is CADVision used for?",
      a: "简要介绍 CADVision（官方站点） CADVision is a 2D CAD solution.",
    },
    {
      q: "How much does CADVision cost?",
      a: "CADVision is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of CADVision?",
      a: "CADVision is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does CADVision support?",
      a: "CADVision runs on Windows.",
    },
    {
      q: "Which file formats does CADVision support?",
      a: "CADVision works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to CADVision?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "CADVision Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t145",
  name: "Eberick",
  slug: "eberick",
  logo_url: getLogo("EB"),
  short_desc:
    "Somos a líder nacional para projetos em BIM e Gestão Digital da Construção, com soluções em software para todas as etapa",
  description:
    "Somos a líder nacional para projetos em BIM e Gestão Digital da Construção, com soluções em software para todas as etapas do ciclo de vida do empreendimento.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Brazil",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.altoqi.com.br/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Eberick used for?",
      a: "Somos a líder nacional para projetos em BIM e Gestão Digital da Construção, com soluções em software para todas as etapa Eberick is a 2D CAD solution.",
    },
    {
      q: "How much does Eberick cost?",
      a: "Eberick is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Eberick?",
      a: "Eberick is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Eberick support?",
      a: "Eberick runs on Windows.",
    },
    {
      q: "Which file formats does Eberick support?",
      a: "Eberick works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Eberick?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Eberick Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t146",
  name: "Promob",
  slug: "promob",
  logo_url: getLogo("PR"),
  short_desc:
    "Projetar, produzir e gerenciar nunca foi tão fácil com a Promob Software Solutions. À maior desenvolvedora de software d",
  description:
    "Projetar, produzir e gerenciar nunca foi tão fácil com a Promob Software Solutions. À maior desenvolvedora de software do setor moveleiro!",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Brazil",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.promob.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Promob used for?",
      a: "Projetar, produzir e gerenciar nunca foi tão fácil com a Promob Software Solutions. À maior desenvolvedora de software d Promob is a 2D CAD solution.",
    },
    {
      q: "How much does Promob cost?",
      a: "Promob is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Promob?",
      a: "Promob is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Promob support?",
      a: "Promob runs on Windows.",
    },
    {
      q: "Which file formats does Promob support?",
      a: "Promob works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Promob?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Promob Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t147",
  name: "SCIA Engineer",
  slug: "scia-engineer",
  logo_url: getLogo("SC"),
  short_desc:
    "SCIA combines structural engineering and design know-how with technology, to provide powerful structural analysis softwa",
  description:
    "SCIA combines structural engineering and design know-how with technology, to provide powerful structural analysis software and high-level support.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Netherlands",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.scia.net/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is SCIA Engineer used for?",
      a: "SCIA combines structural engineering and design know-how with technology, to provide powerful structural analysis softwa SCIA Engineer is a 2D CAD solution.",
    },
    {
      q: "How much does SCIA Engineer cost?",
      a: "SCIA Engineer is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of SCIA Engineer?",
      a: "SCIA Engineer is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does SCIA Engineer support?",
      a: "SCIA Engineer runs on Windows.",
    },
    {
      q: "Which file formats does SCIA Engineer support?",
      a: "SCIA Engineer works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SCIA Engineer?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SCIA Engineer Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t148",
  name: "PowerMill",
  slug: "powermill",
  logo_url: getLogo("PO"),
  short_desc: "简要介绍 PowerMill（官方站点）",
  description: "详细介绍 PowerMill（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "UK",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.autodesk.com/products/powermill",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is PowerMill used for?",
      a: "简要介绍 PowerMill（官方站点） PowerMill is a 2D CAD solution.",
    },
    {
      q: "How much does PowerMill cost?",
      a: "PowerMill is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of PowerMill?",
      a: "PowerMill is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does PowerMill support?",
      a: "PowerMill runs on Windows.",
    },
    {
      q: "Which file formats does PowerMill support?",
      a: "PowerMill works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to PowerMill?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "PowerMill Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t149",
  name: "FeatureCAM",
  slug: "featurecam",
  logo_url: getLogo("FE"),
  short_desc: "简要介绍 FeatureCAM（官方站点）",
  description: "详细介绍 FeatureCAM（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.autodesk.com/products/featurecam",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is FeatureCAM used for?",
      a: "简要介绍 FeatureCAM（官方站点） FeatureCAM is a CAE / CAM solution.",
    },
    {
      q: "How much does FeatureCAM cost?",
      a: "FeatureCAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of FeatureCAM?",
      a: "FeatureCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does FeatureCAM support?",
      a: "FeatureCAM runs on Windows.",
    },
    {
      q: "Which file formats does FeatureCAM support?",
      a: "FeatureCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to FeatureCAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "FeatureCAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t150",
  name: "GibbsCAM",
  slug: "gibbscam",
  logo_url: getLogo("GI"),
  short_desc:
    "GibbsCAM® is cutting-edge CAM software for programming CNC machine tools with the power and flexibility to make parts th",
  description:
    "GibbsCAM® is cutting-edge CAM software for programming CNC machine tools with the power and flexibility to make parts the way you want.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.gibbscam.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is GibbsCAM used for?",
      a: "GibbsCAM® is cutting-edge CAM software for programming CNC machine tools with the power and flexibility to make parts th GibbsCAM is a CAE / CAM solution.",
    },
    {
      q: "How much does GibbsCAM cost?",
      a: "GibbsCAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of GibbsCAM?",
      a: "GibbsCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does GibbsCAM support?",
      a: "GibbsCAM runs on Windows.",
    },
    {
      q: "Which file formats does GibbsCAM support?",
      a: "GibbsCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to GibbsCAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "GibbsCAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t151",
  name: "ESPRIT",
  slug: "esprit",
  logo_url: getLogo("ES"),
  short_desc:
    "Is ESPRIT the best CAM software for your shop? Learn more about what makes us different and how we can help you achieve ",
  description:
    "Is ESPRIT the best CAM software for your shop? Learn more about what makes us different and how we can help you achieve your goals.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "USA",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.espritcam.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is ESPRIT used for?",
      a: "Is ESPRIT the best CAM software for your shop? Learn more about what makes us different and how we can help you achieve  ESPRIT is a 2D CAD solution.",
    },
    {
      q: "How much does ESPRIT cost?",
      a: "ESPRIT is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of ESPRIT?",
      a: "ESPRIT is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ESPRIT support?",
      a: "ESPRIT runs on Windows.",
    },
    {
      q: "Which file formats does ESPRIT support?",
      a: "ESPRIT works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ESPRIT?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ESPRIT Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t152",
  name: "hyperMILL",
  slug: "hypermill",
  logo_url: getLogo("HY"),
  short_desc:
    "Innovative CAD CAM solutions generate optimised NC milling and turning programs for machine tools | Explore hyperMILL CA",
  description:
    "Innovative CAD CAM solutions generate optimised NC milling and turning programs for machine tools | Explore hyperMILL CAM software now!",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Germany",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.openmind-tech.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is hyperMILL used for?",
      a: "Innovative CAD CAM solutions generate optimised NC milling and turning programs for machine tools | Explore hyperMILL CA hyperMILL is a CAE / CAM solution.",
    },
    {
      q: "How much does hyperMILL cost?",
      a: "hyperMILL is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of hyperMILL?",
      a: "hyperMILL is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does hyperMILL support?",
      a: "hyperMILL runs on Windows.",
    },
    {
      q: "Which file formats does hyperMILL support?",
      a: "hyperMILL works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to hyperMILL?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "hyperMILL Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t153",
  name: "Tebis",
  slug: "tebis",
  logo_url: getLogo("TE"),
  short_desc:
    "Software components for CAD/CAM, CAQ and MES support design and production in die, model and machine manufacturing.",
  description:
    "Software components for CAD/CAM, CAQ and MES support design and production in die, model and machine manufacturing.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Germany",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.tebis.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Tebis used for?",
      a: "Software components for CAD/CAM, CAQ and MES support design and production in die, model and machine manufacturing. Tebis is a CAE / CAM solution.",
    },
    {
      q: "How much does Tebis cost?",
      a: "Tebis is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Tebis?",
      a: "Tebis is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Tebis support?",
      a: "Tebis runs on Windows.",
    },
    {
      q: "Which file formats does Tebis support?",
      a: "Tebis works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Tebis?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Tebis Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t154",
  name: "WorkNC",
  slug: "worknc",
  logo_url: getLogo("WO"),
  short_desc: "简要介绍 WorkNC（官方站点）",
  description: "详细介绍 WorkNC（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "France",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.worknc.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is WorkNC used for?",
      a: "简要介绍 WorkNC（官方站点） WorkNC is a CAE / CAM solution.",
    },
    {
      q: "How much does WorkNC cost?",
      a: "WorkNC is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of WorkNC?",
      a: "WorkNC is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does WorkNC support?",
      a: "WorkNC runs on Windows.",
    },
    {
      q: "Which file formats does WorkNC support?",
      a: "WorkNC works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to WorkNC?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "WorkNC Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t155",
  name: "SURFCAM",
  slug: "surfcam",
  logo_url: getLogo("SU"),
  short_desc: "简要介绍 SURFCAM（官方站点）",
  description: "详细介绍 SURFCAM（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.surfcam.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is SURFCAM used for?",
      a: "简要介绍 SURFCAM（官方站点） SURFCAM is a CAE / CAM solution.",
    },
    {
      q: "How much does SURFCAM cost?",
      a: "SURFCAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of SURFCAM?",
      a: "SURFCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does SURFCAM support?",
      a: "SURFCAM runs on Windows.",
    },
    {
      q: "Which file formats does SURFCAM support?",
      a: "SURFCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SURFCAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SURFCAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t156",
  name: "BobCAD-CAM",
  slug: "bobcad-cam",
  logo_url: getLogo("BO"),
  short_desc:
    "The World Leader in Powerful & Affordable CNC CAD/CAM Software Solutions",
  description:
    "The World Leader in Powerful & Affordable CNC CAD/CAM Software Solutions",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://bobcad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is BobCAD-CAM used for?",
      a: "The World Leader in Powerful & Affordable CNC CAD/CAM Software Solutions BobCAD-CAM is a CAE / CAM solution.",
    },
    {
      q: "How much does BobCAD-CAM cost?",
      a: "BobCAD-CAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of BobCAD-CAM?",
      a: "BobCAD-CAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does BobCAD-CAM support?",
      a: "BobCAD-CAM runs on Windows.",
    },
    {
      q: "Which file formats does BobCAD-CAM support?",
      a: "BobCAD-CAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to BobCAD-CAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "BobCAD-CAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t157",
  name: "DDS-CAD",
  slug: "dds-cad",
  logo_url: getLogo("DD"),
  short_desc: "简要介绍 DDS-CAD（官方站点）",
  description: "详细介绍 DDS-CAD（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Norway",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.dds-cad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is DDS-CAD used for?",
      a: "简要介绍 DDS-CAD（官方站点） DDS-CAD is a BIM solution.",
    },
    {
      q: "How much does DDS-CAD cost?",
      a: "DDS-CAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of DDS-CAD?",
      a: "DDS-CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does DDS-CAD support?",
      a: "DDS-CAD runs on Windows.",
    },
    {
      q: "Which file formats does DDS-CAD support?",
      a: "DDS-CAD works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to DDS-CAD?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "DDS-CAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t158",
  name: "Planbar",
  slug: "planbar",
  logo_url: getLogo("PL"),
  short_desc: "简要介绍 Planbar（官方站点）",
  description: "详细介绍 Planbar（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.allplan.com/products/planbar/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Planbar used for?",
      a: "简要介绍 Planbar（官方站点） Planbar is a 2D CAD solution.",
    },
    {
      q: "How much does Planbar cost?",
      a: "Planbar is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Planbar?",
      a: "Planbar is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Planbar support?",
      a: "Planbar runs on Windows.",
    },
    {
      q: "Which file formats does Planbar support?",
      a: "Planbar works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Planbar?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Planbar Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t159",
  name: "dRofus",
  slug: "drofus",
  logo_url: getLogo("DR"),
  short_desc:
    "dRofus is the leading data-driven building requirements platform helping teams standardize project data, eliminate silos",
  description:
    "dRofus is the leading data-driven building requirements platform helping teams standardize project data, eliminate silos, and collaborate with confidence.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["bimoffice", "hicad", "renga"],
  country: "Norway",
  category_id: "c3",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.drofus.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is dRofus used for?",
      a: "dRofus is the leading data-driven building requirements platform helping teams standardize project data, eliminate silos dRofus is a BIM solution.",
    },
    {
      q: "How much does dRofus cost?",
      a: "dRofus is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of dRofus?",
      a: "dRofus is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does dRofus support?",
      a: "dRofus runs on Windows.",
    },
    {
      q: "Which file formats does dRofus support?",
      a: "dRofus works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to dRofus?",
      a: "The closest alternatives within the BIM space are BIMoffice, HiCAD, Renga. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "dRofus Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t160",
  name: "Allegro PCB",
  slug: "allegro-pcb",
  logo_url: getLogo("AL"),
  short_desc: "简要介绍 Allegro PCB（官方站点）",
  description: "详细介绍 Allegro PCB（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "USA",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url:
    "https://www.cadence.com/en_US/home/tools/pcb-design-and-analysis/pcb-layout/allegro-pcb-designer.html",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Allegro PCB used for?",
      a: "简要介绍 Allegro PCB（官方站点） Allegro PCB is an EDA solution.",
    },
    {
      q: "How much does Allegro PCB cost?",
      a: "Allegro PCB is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Allegro PCB?",
      a: "Allegro PCB is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Allegro PCB support?",
      a: "Allegro PCB runs on Windows.",
    },
    {
      q: "Which file formats does Allegro PCB support?",
      a: "Allegro PCB works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Allegro PCB?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Allegro PCB Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t161",
  name: "OrCAD",
  slug: "orcad",
  logo_url: getLogo("OR"),
  short_desc: "简要介绍 OrCAD（官方站点）",
  description: "详细介绍 OrCAD（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "USA",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.orcad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is OrCAD used for?",
      a: "简要介绍 OrCAD（官方站点） OrCAD is an EDA solution.",
    },
    {
      q: "How much does OrCAD cost?",
      a: "OrCAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of OrCAD?",
      a: "OrCAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does OrCAD support?",
      a: "OrCAD runs on Windows.",
    },
    {
      q: "Which file formats does OrCAD support?",
      a: "OrCAD works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to OrCAD?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "OrCAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t162",
  name: "PADS Professional",
  slug: "pads-professional",
  logo_url: getLogo("PA"),
  short_desc:
    "For 20 years, PADS has been your trusted choice for PCB design. We’re building on that legacy with a modern, future-read",
  description:
    "For 20 years, PADS has been your trusted choice for PCB design. We’re building on that legacy with a modern, future-ready Xpedition ecosystem.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "USA",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://eda.sw.siemens.com/en-US/pcb/pads/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is PADS Professional used for?",
      a: "For 20 years, PADS has been your trusted choice for PCB design. We’re building on that legacy with a modern, future-read PADS Professional is an EDA solution.",
    },
    {
      q: "How much does PADS Professional cost?",
      a: "PADS Professional is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of PADS Professional?",
      a: "PADS Professional is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does PADS Professional support?",
      a: "PADS Professional runs on Windows.",
    },
    {
      q: "Which file formats does PADS Professional support?",
      a: "PADS Professional works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to PADS Professional?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "PADS Professional Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t163",
  name: "Xpedition",
  slug: "xpedition",
  logo_url: getLogo("XP"),
  short_desc:
    "The Xpedition product family offers industry leading, scalable PCB design solutions that grow with you, from independent",
  description:
    "The Xpedition product family offers industry leading, scalable PCB design solutions that grow with you, from independent engineers to global enterprises.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "USA",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://eda.sw.siemens.com/en-US/pcb/xpedition/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Xpedition used for?",
      a: "The Xpedition product family offers industry leading, scalable PCB design solutions that grow with you, from independent Xpedition is an EDA solution.",
    },
    {
      q: "How much does Xpedition cost?",
      a: "Xpedition is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Xpedition?",
      a: "Xpedition is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Xpedition support?",
      a: "Xpedition runs on Windows.",
    },
    {
      q: "Which file formats does Xpedition support?",
      a: "Xpedition works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Xpedition?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Xpedition Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t164",
  name: "Pulsonix",
  slug: "pulsonix",
  logo_url: getLogo("PU"),
  short_desc:
    "Welcome to Pulsonix – affordable, powerful and intuitive Schematic Capture and PCB Design Software.",
  description:
    "Welcome to Pulsonix – affordable, powerful and intuitive Schematic Capture and PCB Design Software.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "UK",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.pulsonix.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Pulsonix used for?",
      a: "Welcome to Pulsonix – affordable, powerful and intuitive Schematic Capture and PCB Design Software. Pulsonix is an EDA solution.",
    },
    {
      q: "How much does Pulsonix cost?",
      a: "Pulsonix is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Pulsonix?",
      a: "Pulsonix is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Pulsonix support?",
      a: "Pulsonix runs on Windows.",
    },
    {
      q: "Which file formats does Pulsonix support?",
      a: "Pulsonix works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Pulsonix?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Pulsonix Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t165",
  name: "Target 3001!",
  slug: "target-3001",
  logo_url: getLogo("TA"),
  short_desc: "简要介绍 Target 3001!（官方站点）",
  description: "详细介绍 Target 3001!（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["eplan", "cr-8000", "quadcept"],
  country: "Germany",
  category_id: "c6",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://ibf-it.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Target 3001! used for?",
      a: "简要介绍 Target 3001!（官方站点） Target 3001! is an EDA solution.",
    },
    {
      q: "How much does Target 3001! cost?",
      a: "Target 3001! is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Target 3001!?",
      a: "Target 3001! is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Target 3001! support?",
      a: "Target 3001! runs on Windows.",
    },
    {
      q: "Which file formats does Target 3001! support?",
      a: "Target 3001! works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Target 3001!?",
      a: "The closest alternatives within the EDA space are EPLAN, CR-8000, Quadcept. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Target 3001! Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t166",
  name: "AutoForm",
  slug: "autoform",
  logo_url: getLogo("AU"),
  short_desc:
    "AutoForm’s software solutions form a comprehensive platform for the engineering, evaluation and improvement of the sheet",
  description:
    "AutoForm’s software solutions form a comprehensive platform for the engineering, evaluation and improvement of the sheet metal forming and BiW assembly processes. This platform allows for full digitalization, seamless information and data flow, and integration of Industry 4.0 standards.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Switzerland",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.autoform.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is AutoForm used for?",
      a: "AutoForm’s software solutions form a comprehensive platform for the engineering, evaluation and improvement of the sheet AutoForm is a CAE / CAM solution.",
    },
    {
      q: "How much does AutoForm cost?",
      a: "AutoForm is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of AutoForm?",
      a: "AutoForm is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does AutoForm support?",
      a: "AutoForm runs on Windows.",
    },
    {
      q: "Which file formats does AutoForm support?",
      a: "AutoForm works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to AutoForm?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AutoForm Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t167",
  name: "PAM-STAMP",
  slug: "pam-stamp",
  logo_url: getLogo("PA"),
  short_desc: "简要介绍 PAM-STAMP（官方站点）",
  description: "详细介绍 PAM-STAMP（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "France",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.esi-group.com/products/pam-stamp",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is PAM-STAMP used for?",
      a: "简要介绍 PAM-STAMP（官方站点） PAM-STAMP is a 2D CAD solution.",
    },
    {
      q: "How much does PAM-STAMP cost?",
      a: "PAM-STAMP is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of PAM-STAMP?",
      a: "PAM-STAMP is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does PAM-STAMP support?",
      a: "PAM-STAMP runs on Windows.",
    },
    {
      q: "Which file formats does PAM-STAMP support?",
      a: "PAM-STAMP works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to PAM-STAMP?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "PAM-STAMP Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t168",
  name: "Moldflow",
  slug: "moldflow",
  logo_url: getLogo("MO"),
  short_desc: "简要介绍 Moldflow（官方站点）",
  description: "详细介绍 Moldflow（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.autodesk.com/products/moldflow",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Moldflow used for?",
      a: "简要介绍 Moldflow（官方站点） Moldflow is a CAE / CAM solution.",
    },
    {
      q: "How much does Moldflow cost?",
      a: "Moldflow is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Moldflow?",
      a: "Moldflow is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Moldflow support?",
      a: "Moldflow runs on Windows.",
    },
    {
      q: "Which file formats does Moldflow support?",
      a: "Moldflow works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Moldflow?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Moldflow Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t169",
  name: "Moldex3D",
  slug: "moldex3d",
  logo_url: getLogo("MO"),
  short_desc: "Moldex3D | Plastic Injection Molding Simulation Software",
  description: "Moldex3D | Plastic Injection Molding Simulation Software",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Taiwan",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.moldex3d.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Moldex3D used for?",
      a: "Moldex3D | Plastic Injection Molding Simulation Software Moldex3D is a CAE / CAM solution.",
    },
    {
      q: "How much does Moldex3D cost?",
      a: "Moldex3D is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Moldex3D?",
      a: "Moldex3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Moldex3D support?",
      a: "Moldex3D runs on macOS.",
    },
    {
      q: "Which file formats does Moldex3D support?",
      a: "Moldex3D works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Moldex3D?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Moldex3D Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t170",
  name: "ShipConstructor",
  slug: "shipconstructor",
  logo_url: getLogo("SH"),
  short_desc:
    "Engineering information is a shipbuilder’s most important asset. Using a solution that is built to handle shipbuilding’s",
  description:
    "Engineering information is a shipbuilder’s most important asset. Using a solution that is built to handle shipbuilding’s unique challenges is key.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Canada",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.ssi-corporate.com/products/shipconstructor/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is ShipConstructor used for?",
      a: "Engineering information is a shipbuilder’s most important asset. Using a solution that is built to handle shipbuilding’s ShipConstructor is a 2D CAD solution.",
    },
    {
      q: "How much does ShipConstructor cost?",
      a: "ShipConstructor is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of ShipConstructor?",
      a: "ShipConstructor is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ShipConstructor support?",
      a: "ShipConstructor runs on macOS.",
    },
    {
      q: "Which file formats does ShipConstructor support?",
      a: "ShipConstructor works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ShipConstructor?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "ShipConstructor Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t171",
  name: "NAPA",
  slug: "napa",
  logo_url: getLogo("NA"),
  short_desc:
    "NAPA provides maritime software and data services for ship design and operations to enable a safer, more sustainable, an",
  description:
    "NAPA provides maritime software and data services for ship design and operations to enable a safer, more sustainable, and future-proof maritime industry.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Finland",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.napa.fi/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is NAPA used for?",
      a: "NAPA provides maritime software and data services for ship design and operations to enable a safer, more sustainable, an NAPA is a 2D CAD solution.",
    },
    {
      q: "How much does NAPA cost?",
      a: "NAPA is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of NAPA?",
      a: "NAPA is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does NAPA support?",
      a: "NAPA runs on Windows.",
    },
    {
      q: "Which file formats does NAPA support?",
      a: "NAPA works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to NAPA?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "NAPA Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t172",
  name: "FORAN",
  slug: "foran",
  logo_url: getLogo("FO"),
  short_desc: "简要介绍 FORAN（官方站点）",
  description: "详细介绍 FORAN（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Spain",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.sener-foran.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is FORAN used for?",
      a: "简要介绍 FORAN（官方站点） FORAN is a 2D CAD solution.",
    },
    {
      q: "How much does FORAN cost?",
      a: "FORAN is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of FORAN?",
      a: "FORAN is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does FORAN support?",
      a: "FORAN runs on Windows.",
    },
    {
      q: "Which file formats does FORAN support?",
      a: "FORAN works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to FORAN?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "FORAN Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t173",
  name: "Pytha",
  slug: "pytha",
  logo_url: getLogo("PY"),
  short_desc:
    "PYTHA is the most advanced 3D CAD system in interior design, furniture making, exhibition design and for the shop fittin",
  description:
    "PYTHA is the most advanced 3D CAD system in interior design, furniture making, exhibition design and for the shop fitting industry.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.pytha.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Pytha used for?",
      a: "PYTHA is the most advanced 3D CAD system in interior design, furniture making, exhibition design and for the shop fittin Pytha is a 2D CAD solution.",
    },
    {
      q: "How much does Pytha cost?",
      a: "Pytha is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Pytha?",
      a: "Pytha is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Pytha support?",
      a: "Pytha runs on Windows.",
    },
    {
      q: "Which file formats does Pytha support?",
      a: "Pytha works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Pytha?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Pytha Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t174",
  name: "imos iX",
  slug: "imos-ix",
  logo_url: getLogo("IM"),
  short_desc:
    "Die imos AG entwickelt und vertreibt weltweit integrierte Softwarelösungen für den Möbel- und Innenausbau.",
  description:
    "Die imos AG entwickelt und vertreibt weltweit integrierte Softwarelösungen für den Möbel- und Innenausbau.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.imos3d.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is imos iX used for?",
      a: "Die imos AG entwickelt und vertreibt weltweit integrierte Softwarelösungen für den Möbel- und Innenausbau. imos iX is a 2D CAD solution.",
    },
    {
      q: "How much does imos iX cost?",
      a: "imos iX is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of imos iX?",
      a: "imos iX is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does imos iX support?",
      a: "imos iX runs on Windows.",
    },
    {
      q: "Which file formats does imos iX support?",
      a: "imos iX works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to imos iX?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "imos iX Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t175",
  name: "20-20 Design",
  slug: "20-20-design",
  logo_url: getLogo("20"),
  short_desc:
    "Explore all training options for Design Flex, the leading kitchen and bathroom design and sales solution. Ideal for resi",
  description:
    "Explore all training options for Design Flex, the leading kitchen and bathroom design and sales solution. Ideal for residential and commercial design projects.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "USA",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.2020spaces.com/2020design/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is 20-20 Design used for?",
      a: "Explore all training options for Design Flex, the leading kitchen and bathroom design and sales solution. Ideal for resi 20-20 Design is a 2D CAD solution.",
    },
    {
      q: "How much does 20-20 Design cost?",
      a: "20-20 Design is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of 20-20 Design?",
      a: "20-20 Design is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does 20-20 Design support?",
      a: "20-20 Design runs on Windows.",
    },
    {
      q: "Which file formats does 20-20 Design support?",
      a: "20-20 Design works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to 20-20 Design?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "20-20 Design Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t176",
  name: "Palette CAD",
  slug: "palette-cad",
  logo_url: getLogo("PA"),
  short_desc:
    "Palette CAD 3D-Software für Handwerker, Fachhandel & Planer überzeugt mit Einfachheit & Professionalität zugleich. Onlin",
  description:
    "Palette CAD 3D-Software für Handwerker, Fachhandel & Planer überzeugt mit Einfachheit & Professionalität zugleich. Online & Cloudbasiert!",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "Germany",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.palettecad.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Palette CAD used for?",
      a: "Palette CAD 3D-Software für Handwerker, Fachhandel & Planer überzeugt mit Einfachheit & Professionalität zugleich. Onlin Palette CAD is a 2D CAD solution.",
    },
    {
      q: "How much does Palette CAD cost?",
      a: "Palette CAD is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Palette CAD?",
      a: "Palette CAD is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Palette CAD support?",
      a: "Palette CAD runs on macOS.",
    },
    {
      q: "Which file formats does Palette CAD support?",
      a: "Palette CAD works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Palette CAD?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Palette CAD Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t177",
  name: "KD Max",
  slug: "kd-max",
  logo_url: getLogo("KD"),
  short_desc: "简要介绍 KD Max（官方站点）",
  description: "详细介绍 KD Max（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["3dexperience", "medusa4", "pconplanner"],
  country: "China",
  category_id: "c1",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.yfcad.com/kd-max/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is KD Max used for?",
      a: "简要介绍 KD Max（官方站点） KD Max is a 2D CAD solution.",
    },
    {
      q: "How much does KD Max cost?",
      a: "KD Max is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of KD Max?",
      a: "KD Max is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does KD Max support?",
      a: "KD Max runs on Windows.",
    },
    {
      q: "Which file formats does KD Max support?",
      a: "KD Max works with standard 2D CAD interchange formats including DWG, DXF, and PDF. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to KD Max?",
      a: "The closest alternatives within the 2D CAD space are 3DEXPERIENCE, MEDUSA4, pCon.planner. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "KD Max Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t178",
  name: "WoodWOP",
  slug: "woodwop",
  logo_url: getLogo("WO"),
  short_desc:
    "Whether you are seeking a machinery or software for furniture production, flooring production, kitchen production, close",
  description:
    "Whether you are seeking a machinery or software for furniture production, flooring production, kitchen production, closet production, construction element production, timber house construction and solid wood processing, we offer solutions from individual machines to complete production line. From small woodworking shops to industry-level series production, our products are used to produce high-quality furniture, kitchens, wooden houses, windows, wooden floors and stairs.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Germany",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows", "macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.homag.com/en/product-detail/software-woodwop",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is WoodWOP used for?",
      a: "Whether you are seeking a machinery or software for furniture production, flooring production, kitchen production, close WoodWOP is a CAE / CAM solution.",
    },
    {
      q: "How much does WoodWOP cost?",
      a: "WoodWOP is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of WoodWOP?",
      a: "WoodWOP is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does WoodWOP support?",
      a: "WoodWOP runs on Windows and macOS.",
    },
    {
      q: "Which file formats does WoodWOP support?",
      a: "WoodWOP works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to WoodWOP?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "WoodWOP Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t179",
  name: "AlphaCAM",
  slug: "alphacam",
  logo_url: getLogo("AL"),
  short_desc: "简要介绍 AlphaCAM（官方站点）",
  description: "详细介绍 AlphaCAM（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "UK",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.alphacam.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is AlphaCAM used for?",
      a: "简要介绍 AlphaCAM（官方站点） AlphaCAM is a CAE / CAM solution.",
    },
    {
      q: "How much does AlphaCAM cost?",
      a: "AlphaCAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of AlphaCAM?",
      a: "AlphaCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does AlphaCAM support?",
      a: "AlphaCAM runs on Windows.",
    },
    {
      q: "Which file formats does AlphaCAM support?",
      a: "AlphaCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to AlphaCAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "AlphaCAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t180",
  name: "Radan",
  slug: "radan",
  logo_url: getLogo("RA"),
  short_desc: "简要介绍 Radan（官方站点）",
  description: "详细介绍 Radan（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "UK",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.radan.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Radan used for?",
      a: "简要介绍 Radan（官方站点） Radan is a CAE / CAM solution.",
    },
    {
      q: "How much does Radan cost?",
      a: "Radan is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Radan?",
      a: "Radan is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Radan support?",
      a: "Radan runs on Windows.",
    },
    {
      q: "Which file formats does Radan support?",
      a: "Radan works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Radan?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Radan Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t182",
  name: "Lantek Expert",
  slug: "lantek-expert",
  logo_url: getLogo("LA"),
  short_desc: "简要介绍 Lantek Expert（官方站点）",
  description: "详细介绍 Lantek Expert（官方站点）",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "Spain",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.lanteksms.com/en/software/expert-punch",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Lantek Expert used for?",
      a: "简要介绍 Lantek Expert（官方站点） Lantek Expert is a CAE / CAM solution.",
    },
    {
      q: "How much does Lantek Expert cost?",
      a: "Lantek Expert is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Lantek Expert?",
      a: "Lantek Expert is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Lantek Expert support?",
      a: "Lantek Expert runs on Windows.",
    },
    {
      q: "Which file formats does Lantek Expert support?",
      a: "Lantek Expert works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Lantek Expert?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "Lantek Expert Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t183",
  name: "SigmaNEST",
  slug: "sigmanest",
  logo_url: getLogo("SI"),
  short_desc:
    "SigmaNEST CAD/CAM nesting software runs all major brands of laser, plasma, punch, router, waterjet, tube, and pressbrake",
  description:
    "SigmaNEST CAD/CAM nesting software runs all major brands of laser, plasma, punch, router, waterjet, tube, and pressbrake, providing higher yield, high quality, faster NC; and automates importing, quoting, work orders, and inventory.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["Windows"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.sigmanest.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is SigmaNEST used for?",
      a: "SigmaNEST CAD/CAM nesting software runs all major brands of laser, plasma, punch, router, waterjet, tube, and pressbrake SigmaNEST is a CAE / CAM solution.",
    },
    {
      q: "How much does SigmaNEST cost?",
      a: "SigmaNEST is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of SigmaNEST?",
      a: "SigmaNEST is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does SigmaNEST support?",
      a: "SigmaNEST runs on Windows.",
    },
    {
      q: "Which file formats does SigmaNEST support?",
      a: "SigmaNEST works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to SigmaNEST?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "SigmaNEST Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "t184",
  name: "MetaCAM",
  slug: "metacam",
  logo_url: getLogo("ME"),
  short_desc:
    "Metamation Sheet Metal CAD CAM Software. Designing, Developing and Delivering Sheet Metal CAD CAM Software.",
  description:
    "Metamation Sheet Metal CAD CAM Software. Designing, Developing and Delivering Sheet Metal CAD CAM Software.",
  pricing_tiers: [
    {
      name: "Perpetual",
      price: "N/A",
      period: "initial",
      features: [],
      is_popular: false,
    },
  ],
  detailed_features: [],
  alternatives: ["topsolid", "beckercad", "cadmeister"],
  country: "USA",
  category_id: "c5",
  pricing_type: "Perpetual",
  starting_price: 0,
  platforms: ["macOS"],
  industries: [],
  core_features: [],
  user_scales: [],
  official_url: "https://www.metamation.com/",
  affiliate_url: null,
  score: 0,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is MetaCAM used for?",
      a: "Metamation Sheet Metal CAD CAM Software. Designing, Developing and Delivering Sheet Metal CAD CAM Software. MetaCAM is a CAE / CAM solution.",
    },
    {
      q: "How much does MetaCAM cost?",
      a: "MetaCAM is offered on a perpetual model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of MetaCAM?",
      a: "MetaCAM is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does MetaCAM support?",
      a: "MetaCAM runs on macOS.",
    },
    {
      q: "Which file formats does MetaCAM support?",
      a: "MetaCAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to MetaCAM?",
      a: "The closest alternatives within the CAE/CAM space are TopSolid, BeckerCAD, CADmeister. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],
  tech_specs: {
    engine: "MetaCAM Engine",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },
  expert_verdict: "待补充专业评语。",
}, {
  id: "ext-infraworks",
  name: "Infraworks",
  slug: "infraworks",
  logo_url: getLogo("IN"),
  short_desc: "Professional solution for Infraworks.",
  description: "Detailed information about Infraworks.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "260",
      period: "/mo",

      features: [
        "Conceptual Design",
        "Context Modeling",
        "Traffic Simulation",
        "Cloud Sharing",
      ],

      is_popular: false,
    },
    {
      name: "Annual",
      price: "2,075",
      period: "/yr",

      features: [
        "Advanced Bridge design",
        "Mobility Simulation",
        "Visual Storytelling",
        "Autodesk Docs sync",
      ],

      is_popular: true,
    },
  ],

  core_features: [
    "Conceptual Design",
    "Infrastructure Planning",
    "Context Modeling",
    "Mobility Simulation",
    "Visual Presentation",
  ],

  detailed_features: [
    {
      category: "Planning",

      items: [
        {
          name: "Aggregated Data Context",
          status: true,
        },
        {
          name: "Concept Design of Roads/Bridges",
          status: true,
        },
        {
          name: "Traffic & Mobility Simulation",
          status: true,
        },
        {
          name: "Drainage Design Analysis",
          status: true,
        },
      ],
    },
    {
      category: "Visuals & Collaboration",

      items: [
        {
          name: "Photorealistic Visualization",
          status: true,
        },
        {
          name: "Cloud-based Shared Views",
          status: true,
        },
        {
          name: "Real-time Scenario comparison",
          status: true,
        },
        {
          name: "ArcGIS Integration",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.autodesk.com/products/infraworks/overview",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Infraworks used for?",
      a: "Professional solution for Infraworks. Infraworks is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does Infraworks cost?",
      a: "Infraworks is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Infraworks?",
      a: "Infraworks is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Infraworks support?",
      a: "Infraworks runs on Windows.",
    },
    {
      q: "Which file formats does Infraworks support?",
      a: "Infraworks works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Infraworks?",
      a: "The closest alternatives within the Specialized space are 3ds Max, ZBrush, KeyShot. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-3ds-max",
  name: "3ds Max",
  slug: "3ds-max",
  logo_url: getLogo("3D"),
  short_desc: "Professional solution for 3ds Max.",
  description: "Detailed information about 3ds Max.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "235",
      period: "/mo",

      features: [
        "High-end Rendering",
        "AEC Visualization",
        "Particle Flow",
        "Smart Extrude",
      ],

      is_popular: false,
    },
    {
      name: "Annual",
      price: "1,875",
      period: "/yr",
      features: [
        "Retopology tools",
        "Bake to Texture",
        "USD support",
        "Arnold integration",
      ],
      is_popular: true,
    },
  ],

  core_features: [
    "Architectural Visualization",
    "3D Modeling",
    "Texture Mapping",
    "Rendering",
    "Dynamic Simulation",
  ],

  detailed_features: [
    {
      category: "AEC Visualization",

      items: [
        {
          name: "Smart Extrude system",
          status: true,
        },
        {
          name: "Spline Workflows",
          status: true,
        },
        {
          name: "Scene Layout & Tracking",
          status: true,
        },
        {
          name: "Interactive Rendering",
          status: true,
        },
      ],
    },
    {
      category: "Design & Texturing",

      items: [
        {
          name: "Advanced Retopology",
          status: true,
        },
        {
          name: "Physical Camera support",
          status: true,
        },
        {
          name: "PBR Material support",
          status: true,
        },
        {
          name: "OSL (Open Shading Language)",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.autodesk.com/products/3ds-max/overview",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is 3ds Max used for?",
      a: "Professional solution for 3ds Max. 3ds Max is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does 3ds Max cost?",
      a: "3ds Max is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of 3ds Max?",
      a: "3ds Max is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does 3ds Max support?",
      a: "3ds Max runs on Windows.",
    },
    {
      q: "Which file formats does 3ds Max support?",
      a: "3ds Max works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to 3ds Max?",
      a: "The closest alternatives within the Specialized space are Infraworks, ZBrush, KeyShot. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-zbrush",
  name: "ZBrush",
  slug: "zbrush",
  logo_url: getLogo("ZB"),
  short_desc: "Professional solution for ZBrush.",
  description: "Detailed information about ZBrush.",

  pricing_tiers: [
    {
      name: "Monthly",
      price: "39",
      period: "/mo",
      features: [
        "Industry Standard Sculpt",
        "ZRemesher",
        "Dynamesh",
        "PolyPaint",
      ],
      is_popular: false,
    },
    {
      name: "Annual",
      price: "359",
      period: "/yr",

      features: [
        "Full license access",
        "All plugins included",
        "Maxon Cloud storage",
        "Technical Support",
      ],

      is_popular: true,
    },
  ],

  core_features: [
    "Digital Sculpting",
    "High-poly Modeling",
    "Texturing",
    "Concept Design",
    "3D Printing Prep",
  ],

  detailed_features: [
    {
      category: "Sculpting Tech",

      items: [
        {
          name: "Dynamesh (Real-time topology)",
          status: true,
        },
        {
          name: "ZRemesher (Auto Retopology)",
          status: true,
        },
        {
          name: "SubTool management",
          status: true,
        },
        {
          name: "Live Boolean",
          status: true,
        },
      ],
    },
    {
      category: "Artistic Tools",

      items: [
        {
          name: "PolyPaint (Brush-based texturing)",
          status: true,
        },
        {
          name: "FiberMesh (Hair/Fur)",
          status: true,
        },
        {
          name: "NanoMesh (Instancing)",
          status: true,
        },
        {
          name: "Decimation Master (Optimization)",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.maxon.net/en/zbrush",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is ZBrush used for?",
      a: "Professional solution for ZBrush. ZBrush is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does ZBrush cost?",
      a: "ZBrush is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of ZBrush?",
      a: "ZBrush is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does ZBrush support?",
      a: "ZBrush runs on Windows.",
    },
    {
      q: "Which file formats does ZBrush support?",
      a: "ZBrush works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to ZBrush?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, KeyShot. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-keyshot",
  name: "KeyShot",
  slug: "keyshot",
  logo_url: getLogo("KE"),
  short_desc: "Professional solution for KeyShot.",
  description: "Detailed information about KeyShot.",

  pricing_tiers: [
    {
      name: "Pro (Annual)",
      price: "1,188",
      period: "/yr",

      features: [
        "Real-time Ray Tracing",
        "HDRI Editor",
        "Material Graph",
        "Animation module",
      ],

      is_popular: true,
    },
  ],

  core_features: [
    "Real-time Rendering",
    "Product Visualization",
    "Scientific Accuracy",
    "Materials & Textures",
    "VR Export",
  ],

  detailed_features: [
    {
      category: "Rendering",

      items: [
        {
          name: "GPU & CPU Rendering",
          status: true,
        },
        {
          name: "Scientific Material library",
          status: true,
        },
        {
          name: "Caustics support",
          status: true,
        },
        {
          name: "Real-time Denoising",
          status: true,
        },
      ],
    },
    {
      category: "Workflow",

      items: [
        {
          name: "Direct CAD Import",
          status: true,
        },
        {
          name: "Live Linking with CAD",
          status: true,
        },
        {
          name: "Configurator Wizard",
          status: true,
        },
        {
          name: "3D Paint tools",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.keyshot.com",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is KeyShot used for?",
      a: "Professional solution for KeyShot. KeyShot is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does KeyShot cost?",
      a: "KeyShot is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of KeyShot?",
      a: "KeyShot is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does KeyShot support?",
      a: "KeyShot runs on Windows.",
    },
    {
      q: "Which file formats does KeyShot support?",
      a: "KeyShot works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to KeyShot?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-lumion",
  name: "Lumion",
  slug: "lumion",
  logo_url: getLogo("LU"),
  short_desc: "Professional solution for Lumion.",
  description: "Detailed information about Lumion.",

  pricing_tiers: [
    {
      name: "Standard",
      price: "749",
      period: "/yr",

      features: [
        "Core Library",
        "Real-time rendering",
        "Limited assets",
        "Standard effects",
      ],

      is_popular: false,
    },
    {
      name: "Pro",
      price: "1,499",
      period: "/yr",
      features: [
        "Full Object Library",
        "Ray Tracing",
        "Sound effects",
        "Real Skies",
      ],
      is_popular: true,
    },
  ],

  core_features: [
    "Architectural Rendering",
    "Landscape Design",
    "Cinematic Animation",
    "LiveSync",
    "Large Asset Library",
  ],

  detailed_features: [
    {
      category: "Visual Effects",

      items: [
        {
          name: "Ray Tracing Effect",
          status: true,
        },
        {
          name: "Real Skies (HDR)",
          status: true,
        },
        {
          name: "Weather & Seasons",
          status: true,
        },
        {
          name: "Displacement Mapping",
          status: true,
        },
      ],
    },
    {
      category: "Library & Assets",

      items: [
        {
          name: "6000+ Object Library",
          status: true,
        },
        {
          name: "High-quality Foliage",
          status: true,
        },
        {
          name: "Animated Characters",
          status: true,
        },
        {
          name: "Sound environment",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://lumion.com",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Lumion used for?",
      a: "Professional solution for Lumion. Lumion is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does Lumion cost?",
      a: "Lumion is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Lumion?",
      a: "Lumion is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Lumion support?",
      a: "Lumion runs on Windows.",
    },
    {
      q: "Which file formats does Lumion support?",
      a: "Lumion works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Lumion?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-enscape",
  name: "Enscape",
  slug: "enscape",
  logo_url: getLogo("EN"),
  short_desc: "Professional solution for Enscape.",
  description: "Detailed information about Enscape.",

  pricing_tiers: [
    {
      name: "Floating License",
      price: "922",
      period: "/yr",

      features: [
        "Multi-machine use",
        "Real-time Walkthrough",
        "VR support",
        "Asset library",
      ],

      is_popular: true,
    },
    {
      name: "Fixed Seat",
      price: "538",
      period: "/yr",
      features: [
        "Single machine",
        "Plugin-only",
        "Full asset access",
        "Technical support",
      ],
      is_popular: false,
    },
  ],

  core_features: [
    "Real-time Walkthrough",
    "VR Integration",
    "Plugin Workflow",
    "Collaborative Annotation",
    "Orthographic Views",
  ],

  detailed_features: [
    {
      category: "Plugin Workflow",

      items: [
        {
          name: "LiveSync for Revit/SketchUp",
          status: true,
        },
        {
          name: "BIM Data integration",
          status: true,
        },
        {
          name: "Asset Library (3000+)",
          status: true,
        },
        {
          name: "Site Context tool",
          status: true,
        },
      ],
    },
    {
      category: "Output",

      items: [
        {
          name: "VR (Virtual Reality) mode",
          status: true,
        },
        {
          name: "Video Path Animation",
          status: true,
        },
        {
          name: "360 Panorama export",
          status: true,
        },
        {
          name: "Web Standalone viewer",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://enscape3d.com",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Enscape used for?",
      a: "Professional solution for Enscape. Enscape is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does Enscape cost?",
      a: "Enscape is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Enscape?",
      a: "Enscape is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Enscape support?",
      a: "Enscape runs on Windows.",
    },
    {
      q: "Which file formats does Enscape support?",
      a: "Enscape works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Enscape?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "ext-twinmotion",
  name: "Twinmotion",
  slug: "twinmotion",
  logo_url: getLogo("TW"),
  short_desc: "Professional solution for Twinmotion.",
  description: "Detailed information about Twinmotion.",

  pricing_tiers: [
    {
      name: "Free (Low Revenue)",
      price: "0",
      period: "/forever",

      features: [
        "Full Engine Power",
        "Unlimited exports",
        "Revenue < $1M only",
        "Learning use",
      ],

      is_popular: true,
    },
    {
      name: "Commercial Subscription",
      price: "445",
      period: "/yr",

      features: [
        "Cloud sharing",
        "Unreal Engine export",
        "High-res video",
        "Priority support",
      ],

      is_popular: false,
    },
  ],

  core_features: [
    "Real-time Visualization",
    "Unreal Engine Core",
    "Easy UI",
    "Large Asset Library",
    "Quixel Megascans",
  ],

  detailed_features: [
    {
      category: "Visual Power",

      items: [
        {
          name: "Lumen Dynamic Lighting",
          status: true,
        },
        {
          name: "Quixel Megascans sync",
          status: true,
        },
        {
          name: "Path Tracer",
          status: true,
        },
        {
          name: "Auto-exposure/HDR",
          status: true,
        },
      ],
    },
    {
      category: "Workflow",

      items: [
        {
          name: "Datasmith Direct Link",
          status: true,
        },
        {
          name: "One-click sync with Revit",
          status: true,
        },
        {
          name: "Point Cloud support",
          status: true,
        },
        {
          name: "VR Exploration",
          status: true,
        },
      ],
    },
  ],

  category_id: "c7",
  pricing_type: "Subscription",
  starting_price: 0,
  platforms: ["Windows"],
  industries: ["Engineering"],
  user_scales: ["Mid-Market", "Enterprise"],
  official_url: "https://www.twinmotion.com",
  affiliate_url: null,
  score: 4.5,
  pros: [],
  cons: [],
  faqs: [
    {
      q: "What is Twinmotion used for?",
      a: "Professional solution for Twinmotion. Twinmotion is a visualization and rendering solution widely adopted in Engineering.",
    },
    {
      q: "How much does Twinmotion cost?",
      a: "Twinmotion is offered on a subscription model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.",
    },
    {
      q: "Is there a free version of Twinmotion?",
      a: "Twinmotion is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.",
    },
    {
      q: "What operating systems does Twinmotion support?",
      a: "Twinmotion runs on Windows.",
    },
    {
      q: "Which file formats does Twinmotion support?",
      a: "Twinmotion works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor's official documentation for the complete list of supported import and export options.",
    },
    {
      q: "What are the best alternatives to Twinmotion?",
      a: "The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.",
    },
  ],

  tech_specs: {
    engine: "N/A",
    multicore: "N/A",
    gpu_optimization: "N/A",
    standards: [],
  },

  expert_verdict: "Professional choice for the industry.",
}, {
  id: "t185",
  "name": "ANSYS Fluent",
  "slug": "ansys-fluent",
  logo_url: getLogo("AF"),
  "short_desc": "Industry-leading CFD solver for fluid dynamics, heat transfer, and reaction simulations.",
  "description": "ANSYS Fluent is the global standard general-purpose CFD code used across aerospace, automotive, energy, and consumer-products R&D for steady-state, transient, multi-phase, reacting, and turbulent flow analysis.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 30000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Aerospace", "Automotive", "Energy", "Manufacturing"],

  "core_features": [
    "Pressure-based and density-based solvers",
    "Multi-phase flow (VOF, mixture, Eulerian)",
    "Turbulence models (k-epsilon, k-omega, LES, DES)",
    "Combustion and chemical reactions",
    "Conjugate heat transfer",
    "Fluid-structure interaction with ANSYS Mechanical",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.ansys.com/products/fluids/ansys-fluent",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Most comprehensive CFD physics library in the industry",
    "Tight integration with the wider Ansys multiphysics suite",
    "Strong HPC scaling on thousands of cores",
  ],

  "cons": [
    "Per-seat pricing is extremely high; no public list price",
    "Steep learning curve for non-CFD-trained engineers",
    "Requires expensive HPC hardware for production-scale models",
  ],

  "tech_specs": {
    "engine": "Custom finite-volume CFD solver",
    "multicore": "Distributed (MPI/HPC)",
    "gpu_optimization": "GPU offload for select solvers (2024 R1+)",
    "standards": ["CGNS", "HDF5", "EnSight Gold"],
  },

  "expert_verdict": "The benchmark CFD tool — chosen by aerospace and F1 teams where physics fidelity outweighs license cost.",

  "pricing_tiers": [{
    "name": "Commercial Seat",
    "price": "Quote",
    "period": "annual",

    "features": [
      "Full Fluent solver",
      "Unlimited HPC pack add-ons available",
      "Ansys Customer Portal support",
    ],
  }],

  faqs: [{
    q: 'What is ANSYS Fluent used for?',
    a: 'Industry-leading CFD solver for fluid dynamics, heat transfer, and reaction simulations. ANSYS Fluent is a CAE / CAM solution widely adopted in Aerospace, Automotive, Energy.',
  }, {
    q: 'How much does ANSYS Fluent cost?',
    a: 'ANSYS Fluent starts at $30,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of ANSYS Fluent?',
    a: 'ANSYS Fluent is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does ANSYS Fluent support?',
    a: 'ANSYS Fluent runs on Windows and Linux.',
  }, {
    q: 'Which file formats does ANSYS Fluent support?',
    a: 'ANSYS Fluent works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to ANSYS Fluent?',
    a: 'The closest alternatives within the CAE/CAM space are SolidCAM, Altair HyperWorks, ANSYS Workbench. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['solidcam', 'altair-hyperworks', 'ansys-workbench'],
  detailed_features: [],
}, {
  id: "t186",
  "name": "ANSYS Workbench",
  "slug": "ansys-workbench",
  logo_url: getLogo("AW"),
  "short_desc": "Unified Ansys simulation platform for project management, geometry prep, and multi-physics coupling.",
  "description": "ANSYS Workbench is the integrated environment that ties together Mechanical, Fluent, CFX, Maxwell, HFSS, and DesignModeler/SpaceClaim, giving simulation engineers one project tree for parametric, multi-physics studies.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 30000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Aerospace", "Automotive", "Electronics", "Manufacturing"],

  "core_features": [
    "Project Schematic with parametric workflows",
    "DesignModeler and SpaceClaim CAD integration",
    "Bi-directional CAD links (NX, Creo, SolidWorks, Inventor)",
    "Mesh manager with shared topology",
    "Engineering Data material library",
    "DesignXplorer DOE / optimization",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.ansys.com/products/ansys-workbench",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Single project file orchestrates multi-physics analyses",
    "Strong parametric and optimization tooling",
    "Industry standard for engineering simulation pipelines",
  ],

  "cons": [
    "Bundled with expensive Ansys suite — no standalone purchase",
    "UI can feel dated next to newer cloud-native tools",
    "Setting up coupled multi-physics requires deep training",
  ],

  "tech_specs": {
    "engine": "Ansys integration framework",
    "multicore": "Inherits from underlying solvers (MPI)",
    "gpu_optimization": "Inherits from solvers",
    "standards": ["STEP", "IGES", "Parasolid", "ACIS"],
  },

  "expert_verdict": "Sets the standard for how a multi-physics simulation suite should be organised — every other vendor copies the Schematic concept.",
  faqs: [{
    q: 'What is ANSYS Workbench used for?',
    a: 'Unified Ansys simulation platform for project management, geometry prep, and multi-physics coupling. ANSYS Workbench is a CAE / CAM solution widely adopted in Aerospace, Automotive, Electronics.',
  }, {
    q: 'How much does ANSYS Workbench cost?',
    a: 'ANSYS Workbench starts at $30,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of ANSYS Workbench?',
    a: 'ANSYS Workbench is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does ANSYS Workbench support?',
    a: 'ANSYS Workbench runs on Windows and Linux.',
  }, {
    q: 'Which file formats does ANSYS Workbench support?',
    a: 'ANSYS Workbench works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to ANSYS Workbench?',
    a: 'The closest alternatives within the CAE/CAM space are Simcenter STAR-CCM+, CAESAR II, AspenTech Aspen HYSYS. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['simcenter-star-ccm', 'caesar-ii', 'aspen-hysys'],
  detailed_features: [],
}, {
  id: "t187",
  "name": "ANSYS Discovery",
  "slug": "ansys-discovery",
  logo_url: getLogo("AD"),
  "short_desc": "Real-time simulation-driven design with live solver feedback during modeling.",
  "description": "ANSYS Discovery couples a direct-modeling CAD environment with a GPU-accelerated solver that updates results as you push, pull, and modify geometry — collapsing the design / simulate / redesign loop into seconds.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2280,
  "platforms": ["Windows"],
  "industries": ["Manufacturing", "Product Design", "Electronics", "Automotive"],

  "core_features": [
    "Live Physics GPU solver for instant feedback",
    "Direct geometry modeling (formerly SpaceClaim)",
    "Structural, modal, thermal, fluid quick studies",
    "Refined high-fidelity solver for validation",
    "Topology optimization",
    "Bi-directional with Workbench",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.ansys.com/products/3d-design/ansys-discovery",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Real-time results dramatically reduce iteration time",
    "Approachable to designers who aren't full-time analysts",
    "Bridges the gap between CAD and high-fidelity FEA",
  ],

  "cons": [
    "Live Physics is an approximation — Refined solver still needed for sign-off",
    "Requires a powerful CUDA-capable GPU",
    "Still cheaper than full Workbench but far from inexpensive",
  ],

  "tech_specs": {
    "engine": "GPU Lattice Boltzmann + finite element",
    "multicore": "Yes",
    "gpu_optimization": "CUDA / NVIDIA RTX",
    "standards": ["STEP", "IGES", "Parasolid", "ACIS"],
  },

  "expert_verdict": "The most exciting Ansys product in a decade — turns simulation into a real-time design tool for product engineers.",
  faqs: [{
    q: 'What is ANSYS Discovery used for?',
    a: 'Real-time simulation-driven design with live solver feedback during modeling. ANSYS Discovery is a CAE / CAM solution widely adopted in Manufacturing, Product Design, Electronics.',
  }, {
    q: 'How much does ANSYS Discovery cost?',
    a: 'ANSYS Discovery starts at $2,280 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of ANSYS Discovery?',
    a: 'ANSYS Discovery is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does ANSYS Discovery support?',
    a: 'ANSYS Discovery runs on Windows.',
  }, {
    q: 'Which file formats does ANSYS Discovery support?',
    a: 'ANSYS Discovery works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to ANSYS Discovery?',
    a: 'The closest alternatives within the CAE/CAM space are Altair Inspire, PV Elite, Bentley STAAD.Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['altair-inspire', 'pv-elite', 'staad-pro'],
  detailed_features: [],
}, {
  id: "t188",
  "name": "Abaqus",
  "slug": "abaqus",
  logo_url: getLogo("AB"),
  "short_desc": "High-fidelity non-linear finite element analysis from Dassault Systèmes Simulia.",
  "description": "Abaqus is the FEA solver of record for highly non-linear problems — large deformations, contact, composites, hyperelastic materials, and crash. Widely used in aerospace, automotive crash, tyre, and electronics drop-test analysis.",
  "country": "France",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 25000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Aerospace", "Automotive", "Defense", "Electronics", "Energy"],

  "core_features": [
    "Abaqus/Standard implicit solver",
    "Abaqus/Explicit for crash, impact, drop test",
    "Abaqus/CAE preprocessor",
    "Co-simulation with CFD and EM",
    "User subroutines (UMAT, UEL, VUMAT)",
    "Tosca topology / shape / bead optimization",
  ],

  "user_scales": ["Enterprise"],
  "official_url": "https://www.3ds.com/products/simulia/abaqus",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Gold standard for non-linear FEA, contact, and composites",
    "User subroutines allow extending the solver with custom physics",
    "Trusted by every major automotive crash and aerospace certification body",
  ],

  "cons": [
    "Among the most expensive FEA licenses on the market",
    "Abaqus/CAE preprocessor lags behind Workbench in usability",
    "Very steep learning curve",
  ],

  "tech_specs": {
    "engine": "Abaqus/Standard + Abaqus/Explicit",
    "multicore": "Distributed (MPI)",
    "gpu_optimization": "Partial (selected element types)",
    "standards": ["STEP", "IGES", "Parasolid", "Nastran .bdf"],
  },

  "expert_verdict": "When the model is highly non-linear, large-strain, or contact-heavy, Abaqus is the default choice.",
  faqs: [{
    q: 'What is Abaqus used for?',
    a: 'High-fidelity non-linear finite element analysis from Dassault Systèmes Simulia. Abaqus is a CAE / CAM solution widely adopted in Aerospace, Automotive, Defense.',
  }, {
    q: 'How much does Abaqus cost?',
    a: 'Abaqus starts at $25,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Abaqus?',
    a: 'Abaqus is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Abaqus support?',
    a: 'Abaqus runs on Windows and Linux.',
  }, {
    q: 'Which file formats does Abaqus support?',
    a: 'Abaqus works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Abaqus?',
    a: 'The closest alternatives within the CAE/CAM space are Siemens NX, ESI Visual-Environment, ANSYS Fluent. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['siemens-nx', 'esi-visual-environment', 'ansys-fluent'],
  detailed_features: [],
}, {
  id: "t189",
  "name": "COMSOL Multiphysics",
  "slug": "comsol-multiphysics",
  logo_url: getLogo("CM"),
  "short_desc": "Coupled multi-physics finite element simulation across electromagnetics, structures, fluids, and chemistry.",
  "description": "COMSOL Multiphysics is a finite element platform designed from day one for coupling arbitrary physics — electromagnetics, heat transfer, structural mechanics, acoustics, and chemical reactions — in a single model.",
  "country": "Sweden",
  "category_id": "c5",
  "pricing_type": "Perpetual",
  "starting_price": 3995,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Electronics", "Energy", "Research", "Manufacturing"],

  "core_features": [
    "True multi-physics coupling in a single solver",
    "Equation-based modeling for custom PDEs",
    "30+ add-on modules (RF, Wave Optics, Battery, MEMS)",
    "Application Builder for deployable simulation apps",
    "LiveLink modules for Solidworks, Inventor, AutoCAD, Revit, MATLAB",
    "Cluster computing support",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.comsol.com",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Best-in-class multi-physics coupling — couple any two physics out of the box",
    "Equation-based modeling lets researchers implement custom PDEs",
    "Strong in academia and R&D departments",
  ],

  "cons": [
    "Each add-on module is an additional license fee",
    "Memory hungry on large models",
    "Less polished CAD prep workflow than Ansys",
  ],

  "tech_specs": {
    "engine": "Custom FEM with multi-physics coupling",
    "multicore": "Shared and distributed",
    "gpu_optimization": "Limited",
    "standards": ["STEP", "IGES", "Parasolid", "ACIS"],
  },

  "expert_verdict": "The go-to FEA tool when you need to couple unusual physics — RF + thermal + structural in one shot.",
  faqs: [{
    q: 'What is COMSOL Multiphysics used for?',
    a: 'Coupled multi-physics finite element simulation across electromagnetics, structures, fluids, and chemistry. COMSOL Multiphysics is a CAE / CAM solution widely adopted in Electronics, Energy, Research.',
  }, {
    q: 'How much does COMSOL Multiphysics cost?',
    a: 'COMSOL Multiphysics starts at $3,995 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of COMSOL Multiphysics?',
    a: 'COMSOL Multiphysics is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does COMSOL Multiphysics support?',
    a: 'COMSOL Multiphysics runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does COMSOL Multiphysics support?',
    a: 'COMSOL Multiphysics works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to COMSOL Multiphysics?',
    a: 'The closest alternatives within the CAE/CAM space are CSI ETABS, CSI SAP2000, Femap. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['etabs', 'sap2000', 'femap'],
  detailed_features: [],
}, {
  id: "t190",
  "name": "LS-DYNA",
  "slug": "ls-dyna",
  logo_url: getLogo("LD"),
  "short_desc": "Explicit non-linear dynamics solver for crash, blast, drop, and metal forming.",
  "description": "LS-DYNA (Ansys) is the dominant explicit FEA solver for fast-transient mechanical events — automotive crash, occupant safety, drop test, blast, ballistics, sheet-metal forming, and high-velocity impact.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 20000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Automotive", "Aerospace", "Defense", "Manufacturing"],

  "core_features": [
    "Explicit and implicit time-integration",
    "Crashworthiness and occupant safety",
    "SPH, EFG, DEM, ALE, FSI",
    "Sheet-metal forming (LS-FORM)",
    "Composite materials and delamination",
    "Multi-physics: EM, thermal, ICFD",
  ],

  "user_scales": ["Enterprise"],
  "official_url": "https://www.ansys.com/products/structures/ansys-ls-dyna",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Industry-standard for automotive crash and aerospace bird-strike",
    "Massive material library and element formulations",
    "Excellent HPC scaling",
  ],

  "cons": [
    "Command-driven keyword input file is notoriously dense",
    "Preprocessing typically done in LS-PrePost or ANSA, not bundled",
    "Top-tier licensing cost",
  ],

  "tech_specs": {
    "engine": "Lagrangian + Eulerian explicit FEM",
    "multicore": "SMP and MPP",
    "gpu_optimization": "Yes (implicit solver)",
    "standards": ["Nastran .bdf", "STEP", "IGES"],
  },

  "expert_verdict": "If you're doing crash, blast, or drop simulation at OEM scale, LS-DYNA is the default — full stop.",
  faqs: [{
    q: 'What is LS-DYNA used for?',
    a: 'Explicit non-linear dynamics solver for crash, blast, drop, and metal forming. LS-DYNA is a CAE / CAM solution widely adopted in Automotive, Aerospace, Defense.',
  }, {
    q: 'How much does LS-DYNA cost?',
    a: 'LS-DYNA starts at $20,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of LS-DYNA?',
    a: 'LS-DYNA is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does LS-DYNA support?',
    a: 'LS-DYNA runs on Windows and Linux.',
  }, {
    q: 'Which file formats does LS-DYNA support?',
    a: 'LS-DYNA works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to LS-DYNA?',
    a: 'The closest alternatives within the CAE/CAM space are Siemens NX, ESI Visual-Environment, ANSYS Fluent. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['siemens-nx', 'esi-visual-environment', 'ansys-fluent'],
  detailed_features: [],
}, {
  id: "t191",
  "name": "Simcenter STAR-CCM+",
  "slug": "simcenter-star-ccm",
  logo_url: getLogo("SS"),
  "short_desc": "Multi-physics CFD platform from Siemens Digital Industries, strong in marine, turbomachinery, and electronics cooling.",
  "description": "Simcenter STAR-CCM+ is Siemens' end-to-end CFD environment combining geometry prep, automatic meshing, multi-physics solvers, and post-processing in a single workflow — popular for marine, motorsport, turbomachinery, and electronics cooling.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 25000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Aerospace", "Automotive", "Energy", "Marine"],

  "core_features": [
    "Polyhedral and trimmed-cell automatic meshing",
    "Coupled implicit pressure-velocity solver",
    "Reacting flow, combustion, multi-phase",
    "Overset / chimera mesh for moving bodies",
    "Optimate+ for DOE and optimization",
    "Power-on-Demand HPC tokens",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://plm.sw.siemens.com/en-US/simcenter/fluids-thermal-simulation/star-ccm/",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Single-environment workflow from CAD to results",
    "Excellent automatic polyhedral meshing",
    "Power-on-Demand removes per-core licensing friction",
  ],

  "cons": [
    "Commercial license cost is high",
    "Less standalone physics extensibility than Fluent or COMSOL",
    "Tight Siemens ecosystem alignment",
  ],

  "tech_specs": {
    "engine": "Coupled finite-volume CFD",
    "multicore": "MPI (HPC)",
    "gpu_optimization": "Limited",
    "standards": ["STEP", "IGES", "Parasolid", "CGNS"],
  },

  "expert_verdict": "If you want one tool to do mesh-to-results without juggling Fluent + ICEM + CFD-Post, STAR-CCM+ is the answer.",
  faqs: [{
    q: 'What is Simcenter STAR-CCM+ used for?',
    a: 'Multi-physics CFD platform from Siemens Digital Industries, strong in marine, turbomachinery, and electronics cooling. Simcenter STAR-CCM+ is a CAE / CAM solution widely adopted in Aerospace, Automotive, Energy.',
  }, {
    q: 'How much does Simcenter STAR-CCM+ cost?',
    a: 'Simcenter STAR-CCM+ starts at $25,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Simcenter STAR-CCM+?',
    a: 'Simcenter STAR-CCM+ is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Simcenter STAR-CCM+ support?',
    a: 'Simcenter STAR-CCM+ runs on Windows and Linux.',
  }, {
    q: 'Which file formats does Simcenter STAR-CCM+ support?',
    a: 'Simcenter STAR-CCM+ works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Simcenter STAR-CCM+?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Workbench, CAESAR II, AspenTech Aspen HYSYS. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-workbench', 'caesar-ii', 'aspen-hysys'],
  detailed_features: [],
}, {
  id: "t192",
  "name": "OpenFOAM",
  "slug": "openfoam",
  logo_url: getLogo("OP"),
  "short_desc": "Free open-source C++ CFD toolbox used widely in academia, research, and motorsport.",
  "description": "OpenFOAM is a GPL-licensed C++ CFD library and solver suite providing dozens of pre-built solvers for incompressible, compressible, multi-phase, combustion, and DNS/LES simulations — the leading open-source choice in CFD.",
  "country": "UK",
  "category_id": "c5",
  "pricing_type": "Free",
  "starting_price": 0,
  "platforms": ["Linux", "Windows", "macOS"],
  "industries": ["Research", "Aerospace", "Automotive", "Energy"],

  "core_features": [
    "Dozens of pre-built CFD solvers",
    "snappyHexMesh automatic mesher",
    "Lagrangian particle tracking, DEM, MHD",
    "User-extensible C++ source code",
    "Excellent HPC scaling with MPI",
    "ParaView post-processing",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.openfoam.com",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Zero license cost — scales to thousands of cores for free",
    "Full C++ source is open and customisable",
    "Massive academic and motorsport adoption",
  ],

  "cons": [
    "Command-line driven; no native GUI",
    "Steep learning curve for the dictionary-file workflow",
    "Commercial support requires third-party vendors (ESI, OpenCFD, CFD Direct)",
  ],

  "tech_specs": {
    "engine": "Custom C++ finite-volume CFD",
    "multicore": "MPI",
    "gpu_optimization": "Limited (third-party petscFoam)",
    "standards": ["STL", "VTK", "EnSight"],
  },

  "expert_verdict": "The open-source CFD that beat commercial codes in motorsport — if you can manage Linux and C++, the cost savings are massive.",
  faqs: [{
    q: 'What is OpenFOAM used for?',
    a: 'Free open-source C++ CFD toolbox used widely in academia, research, and motorsport. OpenFOAM is a CAE / CAM solution widely adopted in Research, Aerospace, Automotive.',
  }, {
    q: 'How much does OpenFOAM cost?',
    a: 'OpenFOAM is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is OpenFOAM really free?',
    a: 'Yes — OpenFOAM is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does OpenFOAM support?',
    a: 'OpenFOAM runs on Linux, Windows, and macOS.',
  }, {
    q: 'Which file formats does OpenFOAM support?',
    a: 'OpenFOAM works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to OpenFOAM?',
    a: 'The closest alternatives within the CAE/CAM space are OpenCASCADE, ANSYS Discovery, Altair Inspire. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['opencascade', 'ansys-discovery', 'altair-inspire'],
  detailed_features: [],
}, {
  id: "t193",
  "name": "SimScale",
  "slug": "simscale",
  logo_url: getLogo("SI"),
  "short_desc": "Browser-based cloud CFD/FEA/thermal simulation platform with per-hour pricing.",
  "description": "SimScale runs OpenFOAM, Code_Aster, and CalculiX in the browser on AWS — letting engineers do production-grade CFD and FEA without local solvers, local hardware, or licensing servers.",
  "country": "Germany",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2400,
  "platforms": ["Web"],
  "industries": ["AEC", "Electronics", "Energy", "Manufacturing"],

  "core_features": [
    "CFD, FEA, thermal, particle dynamics in the browser",
    "Unlimited cloud compute (per-hour metering)",
    "Real-time collaboration on projects",
    "Public Community Plan for hobbyists",
    "Pre-built turbomachinery, AEC, electronics workflows",
    "Native CAD upload (STEP, Parasolid, STL)",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://www.simscale.com",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "No installation, no HPC procurement, no licence dongles",
    "Pay-as-you-go cloud compute scales with project size",
    "Excellent free Community Plan for self-learning",
  ],

  "cons": [
    "Heavily reliant on internet connectivity",
    "Less physics breadth than Ansys or COMSOL",
    "Public Community Plan exposes projects publicly by default",
  ],

  "tech_specs": {
    "engine": "OpenFOAM + Code_Aster + CalculiX in AWS",
    "multicore": "Cloud HPC (unlimited cores)",
    "gpu_optimization": "N/A (CPU)",
    "standards": ["STEP", "Parasolid", "STL", "IGES"],
  },

  "expert_verdict": "Made cloud CFD/FEA actually work — Community Plan is the best free way to learn industrial-grade simulation.",
  faqs: [{
    q: 'What is SimScale used for?',
    a: 'Browser-based cloud CFD/FEA/thermal simulation platform with per-hour pricing. SimScale is a CAE / CAM solution widely adopted in AEC, Electronics, Energy.',
  }, {
    q: 'How much does SimScale cost?',
    a: 'SimScale starts at $2,400 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of SimScale?',
    a: 'SimScale is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does SimScale support?',
    a: 'SimScale runs on Web. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does SimScale support?',
    a: 'SimScale works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to SimScale?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, Altair Inspire, PV Elite. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'altair-inspire', 'pv-elite'],
  detailed_features: [],
}, {
  id: "t194",
  "name": "Femap",
  "slug": "femap",
  logo_url: getLogo("FE"),
  "short_desc": "Siemens Femap is a CAD-independent FEA pre/postprocessor primarily paired with NX Nastran.",
  "description": "Femap is Siemens' Windows-native, CAD-agnostic finite element preprocessor and post-processor, most often paired with NX Nastran or MSC Nastran as the solver of record for aerospace structures.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Perpetual",
  "starting_price": 12000,
  "platforms": ["Windows"],
  "industries": ["Aerospace", "Defense", "Marine"],

  "core_features": [
    "Best-in-class structural FE preprocessing",
    "CAD-agnostic (NX, Creo, SolidWorks, CATIA, Inventor)",
    "NX Nastran integration",
    "API for Visual Basic / Python automation",
    "Composites and bonded contact modeling",
    "Optimization with Topology and Nastran SOL 200",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://plm.sw.siemens.com/en-US/simcenter/mechanical-simulation/femap/",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Lightweight, fast, and very stable on huge airframe models",
    "CAD-agnostic — works with any CAD source",
    "Strong scripting / automation API",
  ],

  "cons": [
    "Windows-only",
    "UI feels dated next to Workbench or Hypermesh",
    "Solver is sold separately",
  ],

  "tech_specs": {
    "engine": "Femap GUI + NX/MSC Nastran solver",
    "multicore": "Inherits from Nastran",
    "gpu_optimization": "Limited",
    "standards": ["Nastran .bdf", "STEP", "IGES", "Parasolid"],
  },

  "expert_verdict": "Still the preferred FE preprocessor for aerospace structural teams that live and breathe Nastran .bdf decks.",
  faqs: [{
    q: 'What is Femap used for?',
    a: 'Siemens Femap is a CAD-independent FEA pre/postprocessor primarily paired with NX Nastran. Femap is a CAE / CAM solution widely adopted in Aerospace, Defense, Marine.',
  }, {
    q: 'How much does Femap cost?',
    a: 'Femap starts at $12,000 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Femap?',
    a: 'Femap is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Femap support?',
    a: 'Femap runs on Windows.',
  }, {
    q: 'Which file formats does Femap support?',
    a: 'Femap works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Femap?',
    a: 'The closest alternatives within the CAE/CAM space are CSI SAP2000, COMSOL Multiphysics, CSI ETABS. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['sap2000', 'comsol-multiphysics', 'etabs'],
  detailed_features: [],
}, {
  id: "t195",
  "name": "Altair Inspire",
  "slug": "altair-inspire",
  logo_url: getLogo("AI"),
  "short_desc": "Generative design and rapid FEA platform from Altair, with topology optimization at its core.",
  "description": "Altair Inspire is a designer-friendly generative design and simulation environment that gives engineers fast access to topology, lattice, and PolyNURBS optimization — early-concept design with real Altair OptiStruct physics underneath.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 6000,
  "platforms": ["Windows"],
  "industries": ["Aerospace", "Automotive", "Manufacturing", "Product Design"],

  "core_features": [
    "Topology and lattice optimization (OptiStruct under the hood)",
    "PolyNURBS rebuild of optimized shapes",
    "Quick structural / modal / thermal analyses",
    "Motion analysis (MotionSolve)",
    "Print 3D and Cast modules",
    "Inspire Studio for industrial design",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://altair.com/inspire",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Industry-best topology optimization driven by real OptiStruct",
    "Designer-friendly UI — engineers can use it without an analyst",
    "Strong manufacturing-aware optimization (cast, extrusion, 3D print)",
  ],

  "cons": [
    "Not a full FEA replacement — go to HyperWorks for production analysis",
    "Windows-only",
    "Subscription only",
  ],

  "tech_specs": {
    "engine": "OptiStruct + MotionSolve",
    "multicore": "Yes",
    "gpu_optimization": "Limited",
    "standards": ["STEP", "IGES", "Parasolid"],
  },

  "expert_verdict": "Best entry point into generative design for engineers who don't want to run a full Hypermesh stack.",
  faqs: [{
    q: 'What is Altair Inspire used for?',
    a: 'Generative design and rapid FEA platform from Altair, with topology optimization at its core. Altair Inspire is a CAE / CAM solution widely adopted in Aerospace, Automotive, Manufacturing.',
  }, {
    q: 'How much does Altair Inspire cost?',
    a: 'Altair Inspire starts at $6,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Altair Inspire?',
    a: 'Altair Inspire is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Altair Inspire support?',
    a: 'Altair Inspire runs on Windows.',
  }, {
    q: 'Which file formats does Altair Inspire support?',
    a: 'Altair Inspire works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Altair Inspire?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, PV Elite, Bentley STAAD.Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'pv-elite', 'staad-pro'],
  detailed_features: [],
}, {
  id: "t196",
  "name": "MSC Patran",
  "slug": "msc-patran",
  logo_url: getLogo("MP"),
  "short_desc": "Long-standing FEA preprocessor and post-processor from Hexagon/MSC, tightly paired with MSC Nastran.",
  "description": "MSC Patran is Hexagon's mature, multi-discipline FE pre/post-processor — the canonical front-end for MSC Nastran since the 1980s and still used heavily in aerospace and defense.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 14000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Aerospace", "Defense", "Automotive"],

  "core_features": [
    "Patran Command Language (PCL) automation",
    "Native MSC Nastran integration",
    "Multi-solver support (Marc, Abaqus, ANSYS)",
    "Composites layup and failure plotting",
    "Linear contact, sub-modeling, glue",
    "Patran Laminate Modeler add-on",
  ],

  "user_scales": ["Enterprise"],
  "official_url": "https://hexagon.com/products/patran",
  "affiliate_url": null,
  "score": 4.2,

  "pros": [
    "Deep Nastran integration, decades of aerospace validation",
    "Powerful PCL scripting for plant-floor automation",
    "Strong composites toolset",
  ],

  "cons": [
    "GUI shows its age",
    "Hexagon licensing complexity since the MSC acquisition",
    "Modern alternatives like HyperMesh outpace it in usability",
  ],

  "tech_specs": {
    "engine": "Patran GUI + Nastran/Marc/Abaqus",
    "multicore": "Inherits from solver",
    "gpu_optimization": "Limited",
    "standards": ["Nastran .bdf", "STEP", "IGES"],
  },

  "expert_verdict": "The aerospace world's de facto Nastran cockpit — still robust, even if newer pre-processors are flashier.",
  faqs: [{
    q: 'What is MSC Patran used for?',
    a: 'Long-standing FEA preprocessor and post-processor from Hexagon/MSC, tightly paired with MSC Nastran. MSC Patran is a CAE / CAM solution widely adopted in Aerospace, Defense, Automotive.',
  }, {
    q: 'How much does MSC Patran cost?',
    a: 'MSC Patran starts at $14,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of MSC Patran?',
    a: 'MSC Patran is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does MSC Patran support?',
    a: 'MSC Patran runs on Windows and Linux.',
  }, {
    q: 'Which file formats does MSC Patran support?',
    a: 'MSC Patran works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to MSC Patran?',
    a: 'The closest alternatives within the CAE/CAM space are Autodesk Robot Structural Analysis, Bentley STAAD.Pro, Bentley AutoPIPE. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-robot', 'staad-pro', 'autopipe'],
  detailed_features: [],
}, {
  id: "t197",
  "name": "MSC Adams",
  "slug": "msc-adams",
  logo_url: getLogo("MA"),
  "short_desc": "Multibody dynamics simulation for mechanisms, vehicles, and powertrains.",
  "description": "MSC Adams (now Hexagon) is the industry-leading multibody dynamics solver — used to predict and validate vehicle handling, suspension kinematics, gear meshes, and complex mechanism behavior before physical prototyping.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 18000,
  "platforms": ["Windows", "Linux"],
  "industries": ["Automotive", "Aerospace", "Defense", "Manufacturing"],

  "core_features": [
    "Adams/Car vehicle dynamics templates",
    "Adams/Driveline and Adams/Tire",
    "Flexible body integration with Nastran",
    "Co-simulation with Simulink and AMESim",
    "Durability load-case extraction",
    "View animation and post-processing",
  ],

  "user_scales": ["Enterprise"],
  "official_url": "https://hexagon.com/products/product-groups/computer-aided-engineering-software/adams",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Default multibody tool for vehicle dynamics teams",
    "Flexible-body coupling with Nastran is industry-leading",
    "Strong template library (Adams/Car)",
  ],

  "cons": [
    "Top-tier license pricing",
    "GUI is functional but dated",
    "Setup of complex assemblies takes weeks",
  ],

  "tech_specs": {
    "engine": "Adams Solver (rigid + flexible MBD)",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["Parasolid", "STEP", "Nastran .bdf"],
  },

  "expert_verdict": "If you are simulating a car suspension, helicopter rotor, or robotic arm in industry, Adams is the answer.",
  faqs: [{
    q: 'What is MSC Adams used for?',
    a: 'Multibody dynamics simulation for mechanisms, vehicles, and powertrains. MSC Adams is a CAE / CAM solution widely adopted in Automotive, Aerospace, Defense.',
  }, {
    q: 'How much does MSC Adams cost?',
    a: 'MSC Adams starts at $18,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of MSC Adams?',
    a: 'MSC Adams is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does MSC Adams support?',
    a: 'MSC Adams runs on Windows and Linux.',
  }, {
    q: 'Which file formats does MSC Adams support?',
    a: 'MSC Adams works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to MSC Adams?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, Altair Inspire, PV Elite. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'altair-inspire', 'pv-elite'],
  detailed_features: [],
}, {
  id: "t198",
  "name": "KiCad",
  "slug": "kicad",
  logo_url: getLogo("KI"),
  "short_desc": "Free, open-source professional schematic capture and PCB layout suite.",
  "description": "KiCad is the dominant open-source EDA suite — schematic capture, PCB layout, 3D viewer, SPICE simulation, and Gerber output — backed by CERN and used in hardware startups, education, and increasingly serious commercial work.",
  "country": "Switzerland",
  "category_id": "c6",
  "pricing_type": "Open Source",
  "starting_price": 0,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Electronics", "Hardware Startups", "Education"],

  "core_features": [
    "Eeschema schematic editor",
    "Pcbnew layout with push-and-shove router",
    "3D viewer with realistic rendering",
    "Built-in SPICE simulation",
    "Differential pair routing, length matching",
    "Gerber, drill, IPC-2581, ODB++ output",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB"],
  "official_url": "https://www.kicad.org",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Zero license cost, no node-locking, no per-seat fees",
    "Quality has reached commercial parity since v6",
    "Massive open-source library ecosystem",
  ],

  "cons": [
    "High-speed design tools still behind Altium / Allegro",
    "No built-in supply-chain part availability check",
    "Variants and DRC for ultra-dense boards lag commercial tools",
  ],

  "tech_specs": {
    "engine": "Custom KiCad engine",
    "multicore": "Partial",
    "gpu_optimization": "OpenGL rendering",
    "standards": ["Gerber X2", "IPC-2581", "ODB++", "STEP"],
  },

  "expert_verdict": "The open-source EDA that finally caught up — competitive with mid-tier commercial tools for 90% of hardware projects.",
  faqs: [{
    q: 'What is KiCad used for?',
    a: 'Free, open-source professional schematic capture and PCB layout suite. KiCad is an EDA solution widely adopted in Electronics, Hardware Startups, Education.',
  }, {
    q: 'How much does KiCad cost?',
    a: 'KiCad is open-source and free to use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is KiCad really free?',
    a: 'Yes — KiCad is open-source software released under a permissive license. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does KiCad support?',
    a: 'KiCad runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does KiCad support?',
    a: 'KiCad works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to KiCad?',
    a: 'The closest alternatives within the EDA space are LTspice, EasyEDA, Proteus Design Suite. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ltspice', 'easyeda', 'proteus-design-suite'],
  detailed_features: [],
}, {
  id: "t199",
  "name": "EasyEDA",
  "slug": "easyeda",
  logo_url: getLogo("EA"),
  "short_desc": "Free browser-based PCB design tightly integrated with JLCPCB and LCSC parts catalog.",
  "description": "EasyEDA is a free web-based schematic and PCB layout tool from JLCPCB — its killer feature is one-click order to JLCPCB fabrication with assembled-parts BOM picked from LCSC, making prototype-to-board cycle times days, not weeks.",
  "country": "China",
  "category_id": "c6",
  "pricing_type": "Freemium",
  "starting_price": 0,
  "platforms": ["Web", "Windows", "macOS", "Linux"],
  "industries": ["Electronics", "Hardware Startups", "Education"],

  "core_features": [
    "Browser-based schematic and PCB editor",
    "Direct integration with LCSC parts catalog",
    "One-click JLCPCB fabrication and assembly order",
    "Realtime collaboration on schematic/PCB",
    "Built-in simulator (NgSpice)",
    "Importers for Altium, Eagle, KiCad",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB"],
  "official_url": "https://easyeda.com",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Zero-friction path from design to fabricated assembled PCB",
    "Massive LCSC component library with live availability",
    "Free for most use cases",
  ],

  "cons": [
    "Tied to JLCPCB / LCSC supply chain",
    "Advanced features lag commercial tools",
    "Cloud-only Standard Edition has project size limits",
  ],

  "tech_specs": {
    "engine": "EasyEDA cloud + Pro desktop",
    "multicore": "Cloud-scaled",
    "gpu_optimization": "WebGL",
    "standards": ["Gerber", "STEP", "Altium import"],
  },

  "expert_verdict": "The best free EDA for hobbyists who want a real PCB in their mailbox in a week.",
  faqs: [{
    q: 'What is EasyEDA used for?',
    a: 'Free browser-based PCB design tightly integrated with JLCPCB and LCSC parts catalog. EasyEDA is an EDA solution widely adopted in Electronics, Hardware Startups, Education.',
  }, {
    q: 'How much does EasyEDA cost?',
    a: 'EasyEDA is offered on a freemium model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.',
  }, {
    q: 'Is there a free version of EasyEDA?',
    a: 'EasyEDA is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does EasyEDA support?',
    a: 'EasyEDA runs on Web, Windows, macOS, and Linux. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does EasyEDA support?',
    a: 'EasyEDA works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to EasyEDA?',
    a: 'The closest alternatives within the EDA space are Proteus Design Suite, NI Multisim, KiCad. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['proteus-design-suite', 'multisim', 'kicad'],
  detailed_features: [],
}, {
  id: "t200",
  "name": "DipTrace",
  "slug": "diptrace",
  logo_url: getLogo("DI"),
  "short_desc": "Affordable schematic capture and PCB design for small teams and consultants.",
  "description": "DipTrace is a Ukrainian-developed schematic capture and PCB layout tool aimed at SMBs and individual designers — clean UI, perpetual licensing, and pricing that undercuts Altium by an order of magnitude.",
  "country": "Ukraine",
  "category_id": "c6",
  "pricing_type": "Perpetual",
  "starting_price": 145,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Electronics", "SMB", "Education"],

  "core_features": [
    "Schematic capture with hierarchical sheets",
    "Shape-based autorouter",
    "3D viewer with STEP export",
    "Component library with 200k+ parts",
    "Differential pair and length matching",
    "ODB++, Gerber X2, NC drill output",
  ],

  "user_scales": ["Freelancer", "SMB"],
  "official_url": "https://diptrace.com",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Perpetual license at ~$300 for the Standard edition",
    "Friendly learning curve",
    "Free Starter edition for non-profit use",
  ],

  "cons": [
    "Not aimed at high-speed digital or RF",
    "Smaller ecosystem than KiCad / Altium",
    "Limited team-collaboration features",
  ],

  "tech_specs": {
    "engine": "DipTrace native",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["Gerber X2", "STEP", "DXF"],
  },

  "expert_verdict": "A small-shop EDA workhorse — perpetual, affordable, and capable enough for 80% of real boards.",
  faqs: [{
    q: 'What is DipTrace used for?',
    a: 'Affordable schematic capture and PCB design for small teams and consultants. DipTrace is an EDA solution widely adopted in Electronics, SMB, Education.',
  }, {
    q: 'How much does DipTrace cost?',
    a: 'DipTrace starts at $145 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of DipTrace?',
    a: 'DipTrace is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does DipTrace support?',
    a: 'DipTrace runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does DipTrace support?',
    a: 'DipTrace works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to DipTrace?',
    a: 'The closest alternatives within the EDA space are Proteus Design Suite, EasyEDA, NI Multisim. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['proteus-design-suite', 'easyeda', 'multisim'],
  detailed_features: [],
}, {
  id: "t201",
  "name": "NI Multisim",
  "slug": "multisim",
  logo_url: getLogo("NM"),
  "short_desc": "Schematic capture with SPICE-based circuit simulation, popular in education and analog design.",
  "description": "NI Multisim is the long-standing educational and engineering SPICE simulator (formerly Electronics Workbench) — used in thousands of universities for analog and mixed-signal circuit instruction and prototyping.",
  "country": "USA",
  "category_id": "c6",
  "pricing_type": "Subscription",
  "starting_price": 600,
  "platforms": ["Windows"],
  "industries": ["Electronics", "Education", "Aerospace"],

  "core_features": [
    "Interactive SPICE simulation with virtual instruments",
    "Mixed-signal A/D simulation",
    "Microcontroller co-simulation",
    "Ultiboard PCB layout pairing",
    "26,000+ component database",
    "LabVIEW integration",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Education"],
  "official_url": "https://www.ni.com/en-us/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim.html",
  "affiliate_url": null,
  "score": 4.2,

  "pros": [
    "Best-in-class interactive analog simulation UX",
    "Strong educational pedigree — used in many universities",
    "Virtual instruments mimic real lab benches",
  ],

  "cons": [
    "Windows-only",
    "PCB layout (Ultiboard) is the weak partner",
    "Now under Emerson — future roadmap uncertain",
  ],

  "tech_specs": {
    "engine": "Berkeley SPICE + XSPICE extensions",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["SPICE3", "IBIS"],
  },

  "expert_verdict": "Still the friendliest way to teach circuits — and a fine bench-side simulator for analog designers.",
  faqs: [{
    q: 'What is NI Multisim used for?',
    a: 'Schematic capture with SPICE-based circuit simulation, popular in education and analog design. NI Multisim is an EDA solution widely adopted in Electronics, Education, Aerospace.',
  }, {
    q: 'How much does NI Multisim cost?',
    a: 'NI Multisim starts at $600 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of NI Multisim?',
    a: 'NI Multisim is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does NI Multisim support?',
    a: 'NI Multisim runs on Windows.',
  }, {
    q: 'Which file formats does NI Multisim support?',
    a: 'NI Multisim works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to NI Multisim?',
    a: 'The closest alternatives within the EDA space are Altium 365, Eagle, Altium Designer. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['altium-365', 'eagle', 'altium-designer'],
  detailed_features: [],
}, {
  id: "t202",
  "name": "LTspice",
  "slug": "ltspice",
  logo_url: getLogo("LT"),
  "short_desc": "Free SPICE simulator from Analog Devices, the de facto industry standard for analog design.",
  "description": "LTspice is a free, high-performance SPICE simulator distributed by Analog Devices — the most widely used SPICE tool in industry for power-electronics, switching converters, and analog circuit design.",
  "country": "USA",
  "category_id": "c6",
  "pricing_type": "Free",
  "starting_price": 0,
  "platforms": ["Windows", "macOS"],
  "industries": ["Electronics", "Power", "Education"],

  "core_features": [
    "High-speed SPICE3 / SPICE4 solver",
    "Built-in Analog Devices part models",
    "Fast switching-regulator simulation",
    "Waveform viewer with math expressions",
    "Worst-case and Monte Carlo analyses",
    "Behavioral models and SPICE directives",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html",
  "affiliate_url": null,
  "score": 4.8,

  "pros": [
    "Completely free — no node-lock, no per-seat",
    "Famously fast and stable SPICE solver",
    "Huge community of models and example circuits",
  ],

  "cons": [
    "Schematic editor UI is utilitarian",
    "No PCB layout — strictly simulation",
    "Documentation is sparse; learning is community-driven",
  ],

  "tech_specs": {
    "engine": "Custom SPICE solver (Mike Engelhardt)",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["SPICE3"],
  },

  "expert_verdict": "The free SPICE that every analog engineer has installed — the industry's quietest, most-used EDA tool.",
  faqs: [{
    q: 'What is LTspice used for?',
    a: 'Free SPICE simulator from Analog Devices, the de facto industry standard for analog design. LTspice is an EDA solution widely adopted in Electronics, Power, Education.',
  }, {
    q: 'How much does LTspice cost?',
    a: 'LTspice is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is LTspice really free?',
    a: 'Yes — LTspice is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does LTspice support?',
    a: 'LTspice runs on Windows and macOS.',
  }, {
    q: 'Which file formats does LTspice support?',
    a: 'LTspice works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to LTspice?',
    a: 'The closest alternatives within the EDA space are CircuitMaker, KiCad, Altium Designer. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['circuitmaker', 'kicad', 'altium-designer'],
  detailed_features: [],
}, {
  id: "t203",
  "name": "Proteus Design Suite",
  "slug": "proteus-design-suite",
  logo_url: getLogo("PD"),
  "short_desc": "Schematic, simulation, and PCB design with embedded-firmware co-simulation.",
  "description": "Proteus from Labcenter Electronics combines schematic capture, mixed-signal SPICE simulation, PCB layout, and — uniquely — full microcontroller firmware co-simulation for AVR, PIC, ARM Cortex-M, and 8051 in a single tool.",
  "country": "UK",
  "category_id": "c6",
  "pricing_type": "Perpetual",
  "starting_price": 248,
  "platforms": ["Windows"],
  "industries": ["Electronics", "Embedded", "Education"],

  "core_features": [
    "Schematic + SPICE simulation",
    "Microcontroller VSM co-simulation",
    "Peripheral models (LCDs, sensors, motors)",
    "ARES PCB layout with autorouter",
    "3D viewer and STEP export",
    "Live IDE link with MPLAB X, Atmel Studio, Keil",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Education"],
  "official_url": "https://www.labcenter.com",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Unique microcontroller co-simulation",
    "Perpetual license model",
    "Strong fit for embedded courses",
  ],

  "cons": [
    "Windows-only",
    "PCB layout (ARES) is dated next to KiCad / Altium",
    "Add-on libraries can stack up the price",
  ],

  "tech_specs": {
    "engine": "Proteus VSM",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["SPICE", "Gerber", "STEP"],
  },

  "expert_verdict": "Still the best way to debug firmware against a virtual LCD or motor without touching hardware.",
  faqs: [{
    q: 'What is Proteus Design Suite used for?',
    a: 'Schematic, simulation, and PCB design with embedded-firmware co-simulation. Proteus Design Suite is an EDA solution widely adopted in Electronics, Embedded, Education.',
  }, {
    q: 'How much does Proteus Design Suite cost?',
    a: 'Proteus Design Suite starts at $248 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Proteus Design Suite?',
    a: 'Proteus Design Suite is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Proteus Design Suite support?',
    a: 'Proteus Design Suite runs on Windows.',
  }, {
    q: 'Which file formats does Proteus Design Suite support?',
    a: 'Proteus Design Suite works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Proteus Design Suite?',
    a: 'The closest alternatives within the EDA space are DipTrace, NI Multisim, EasyEDA. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['diptrace', 'multisim', 'easyeda'],
  detailed_features: [],
}, {
  id: "t204",
  "name": "Altium 365",
  "slug": "altium-365",
  logo_url: getLogo("A3"),
  "short_desc": "Cloud collaboration, data-management, and supply-chain layer for Altium Designer teams.",
  "description": "Altium 365 is the cloud platform around Altium Designer — workspace-based design data management, MCAD CoDesigner with SolidWorks/Creo, manufacturing portal, and Altium Concord Pro replacement.",
  "country": "USA",
  "category_id": "c6",
  "pricing_type": "Subscription",
  "starting_price": 295,
  "platforms": ["Windows", "Web"],
  "industries": ["Electronics", "Aerospace", "Industrial"],

  "core_features": [
    "Cloud workspace and version control",
    "MCAD CoDesigner (SolidWorks, Creo, Inventor)",
    "Manufacturing release portal",
    "Live BOM, part lifecycle, supplier links",
    "Browser-based viewer for non-Altium reviewers",
    "Component management with vault",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.altium.com/altium-365",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Eliminates file-shuffling between PCB and MCAD teams",
    "Modern web UI for stakeholders without Altium licenses",
    "Tight live link to Octopart for supply-chain data",
  ],

  "cons": [
    "Adds to the already high Altium subscription cost",
    "Limited offline workflows",
    "Concord Pro migration paths can be rough",
  ],

  "tech_specs": {
    "engine": "Altium 365 cloud + Altium Designer client",
    "multicore": "Cloud",
    "gpu_optimization": "N/A",
    "standards": ["Gerber X2", "IPC-2581", "ODB++", "STEP"],
  },

  "expert_verdict": "If you already use Altium Designer in a team, 365 has become almost mandatory for managing design data and MCAD handoff.",
  faqs: [{
    q: 'What is Altium 365 used for?',
    a: 'Cloud collaboration, data-management, and supply-chain layer for Altium Designer teams. Altium 365 is an EDA solution widely adopted in Electronics, Aerospace, Industrial.',
  }, {
    q: 'How much does Altium 365 cost?',
    a: 'Altium 365 starts at $295 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Altium 365?',
    a: 'Altium 365 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Altium 365 support?',
    a: 'Altium 365 runs on Windows and Web. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does Altium 365 support?',
    a: 'Altium 365 works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Altium 365?',
    a: 'The closest alternatives within the EDA space are Altium Designer, EPLAN Electric P8, NI Multisim. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['altium-designer', 'eplan-electric-p8', 'multisim'],
  detailed_features: [],
}, {
  id: "t205",
  "name": "CircuitMaker",
  "slug": "circuitmaker",
  logo_url: getLogo("CI"),
  "short_desc": "Free community-edition PCB design from Altium, with public-cloud project sharing.",
  "description": "CircuitMaker is Altium's free community PCB design tool — built on the same engine as Altium Designer but with cloud-only, public-by-default storage that has built a vibrant maker / hobbyist community.",
  "country": "USA",
  "category_id": "c6",
  "pricing_type": "Free",
  "starting_price": 0,
  "platforms": ["Windows"],
  "industries": ["Electronics", "Hobbyist", "Education"],

  "core_features": [
    "Altium-engine schematic and PCB layout",
    "Octopart-backed component library",
    "Public cloud project hosting",
    "Sandbox private repos (paid CircuitMaker Pro)",
    "STEP 3D export",
    "Realtime project collaboration",
  ],

  "user_scales": ["Hobbyist", "Education"],
  "official_url": "https://circuitmaker.com",
  "affiliate_url": null,
  "score": 4.1,

  "pros": [
    "Real Altium engine for free",
    "Cloud project hosting is friction-free",
    "Open-source-style sharing community",
  ],

  "cons": [
    "Free tier requires public projects (no commercial confidentiality)",
    "Windows-only",
    "Pro tier exists for private projects — not really free for industry use",
  ],

  "tech_specs": {
    "engine": "Altium engine",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["Gerber X2", "STEP"],
  },

  "expert_verdict": "Free Altium for hobbyists who don't mind making their projects public — a great way to learn the Altium UI before paying.",
  faqs: [{
    q: 'What is CircuitMaker used for?',
    a: 'Free community-edition PCB design from Altium, with public-cloud project sharing. CircuitMaker is an EDA solution widely adopted in Electronics, Hobbyist, Education.',
  }, {
    q: 'How much does CircuitMaker cost?',
    a: 'CircuitMaker is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is CircuitMaker really free?',
    a: 'Yes — CircuitMaker is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does CircuitMaker support?',
    a: 'CircuitMaker runs on Windows.',
  }, {
    q: 'Which file formats does CircuitMaker support?',
    a: 'CircuitMaker works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to CircuitMaker?',
    a: 'The closest alternatives within the EDA space are LTspice, NI Multisim, Proteus Design Suite. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ltspice', 'multisim', 'proteus-design-suite'],
  detailed_features: [],
}, {
  id: "t206",
  "name": "AutoCAD Plant 3D",
  "slug": "autocad-plant-3d",
  logo_url: getLogo("AP"),
  "short_desc": "Autodesk's plant-design toolkit for piping, equipment, and P&ID workflows on the AutoCAD platform.",
  "description": "AutoCAD Plant 3D adds spec-driven pipe routing, equipment modeling, P&ID generation, isometric drawing extraction, and orthographic GA drawings on top of vanilla AutoCAD, used by mid-size EPC firms.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Subscription",
  "starting_price": 2615,
  "platforms": ["Windows"],
  "industries": ["Energy", "Chemical", "Oil & Gas", "Power"],

  "core_features": [
    "Spec-driven 3D pipe routing",
    "P&ID symbol library and validation",
    "Auto-generation of isometric drawings",
    "Equipment modeling (vessels, exchangers, pumps)",
    "Project collaboration via Vault",
    "Data validation between P&ID and 3D model",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.autodesk.com/products/autocad/included-toolsets/autocad-plant-3d",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Lowest learning curve for AutoCAD-fluent firms",
    "Included in AutoCAD specialised toolsets",
    "Industry-standard isometric output (ISOGEN)",
  ],

  "cons": [
    "Less powerful than AVEVA E3D / SP3D for mega-projects",
    "Project file size becomes unwieldy past ~50k pipe components",
    "Windows-only",
  ],

  "tech_specs": {
    "engine": "AutoCAD ObjectARX",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["DWG", "PCF", "ISO 15926"],
  },

  "expert_verdict": "The mid-market plant-design choice — affordable, integrated with the AutoCAD AEC stack, good enough for most EPC projects.",
  faqs: [{
    q: 'What is AutoCAD Plant 3D used for?',
    a: 'Autodesk\'s plant-design toolkit for piping, equipment, and P&ID workflows on the AutoCAD platform. AutoCAD Plant 3D is a BIM solution widely adopted in Energy, Chemical, Oil & Gas.',
  }, {
    q: 'How much does AutoCAD Plant 3D cost?',
    a: 'AutoCAD Plant 3D starts at $2,615 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of AutoCAD Plant 3D?',
    a: 'AutoCAD Plant 3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does AutoCAD Plant 3D support?',
    a: 'AutoCAD Plant 3D runs on Windows.',
  }, {
    q: 'Which file formats does AutoCAD Plant 3D support?',
    a: 'AutoCAD Plant 3D works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to AutoCAD Plant 3D?',
    a: 'The closest alternatives within the BIM space are Autodesk Construction Cloud, Allplan, BIMcollab. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-construction-cloud', 'allplan', 'bimcollab'],
  detailed_features: [],
}, {
  id: "t207",
  "name": "Hexagon SmartPlant 3D",
  "slug": "smartplant-3d",
  logo_url: getLogo("HS"),
  "short_desc": "Hexagon's data-centric plant-design platform (now part of CADWorx & Analysis Solutions).",
  "description": "SmartPlant 3D (SP3D), now under the Hexagon banner, is a rules-based, data-centric plant-design system competing head-to-head with AVEVA E3D — strong in petrochemical, power, and offshore.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Subscription",
  "starting_price": 18000,
  "platforms": ["Windows"],
  "industries": ["Oil & Gas", "Chemical", "Power", "Marine"],

  "core_features": [
    "Rule-based pipe, structural, cable tray, HVAC design",
    "Database-driven (Oracle / SQL Server)",
    "Multi-discipline concurrent engineering",
    "Tight link with SmartPlant Foundation",
    "Auto-generation of orthographics and isometrics",
    "Clash detection and 4D scheduling",
  ],

  "user_scales": ["Enterprise"],
  "official_url": "https://hexagon.com/products/smartplant-3d",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Database-driven model is uniquely robust at giga-project scale",
    "Strong integration with the broader SmartPlant suite",
    "Adopted by many international EPCs",
  ],

  "cons": [
    "Notoriously complex Oracle/SQL setup",
    "Enterprise pricing only",
    "Windows-only",
  ],

  "tech_specs": {
    "engine": "SP3D (database-centric)",
    "multicore": "Yes",
    "gpu_optimization": "Basic",
    "standards": ["ISO 15926", "PCF", "DGN"],
  },

  "expert_verdict": "Goes head-to-head with AVEVA E3D. Pick based on which one your owner-operator already uses for its asset model.",
  faqs: [{
    q: 'What is Hexagon SmartPlant 3D used for?',
    a: 'Hexagon\'s data-centric plant-design platform (now part of CADWorx & Analysis Solutions). Hexagon SmartPlant 3D is a BIM solution widely adopted in Oil & Gas, Chemical, Power.',
  }, {
    q: 'How much does Hexagon SmartPlant 3D cost?',
    a: 'Hexagon SmartPlant 3D starts at $18,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Hexagon SmartPlant 3D?',
    a: 'Hexagon SmartPlant 3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Hexagon SmartPlant 3D support?',
    a: 'Hexagon SmartPlant 3D runs on Windows.',
  }, {
    q: 'Which file formats does Hexagon SmartPlant 3D support?',
    a: 'Hexagon SmartPlant 3D works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Hexagon SmartPlant 3D?',
    a: 'The closest alternatives within the BIM space are Autodesk Construction Cloud, Allplan, BIMcollab. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-construction-cloud', 'allplan', 'bimcollab'],
  detailed_features: [],
}, {
  id: "t208",
  "name": "CADWorx Plant Professional",
  "slug": "cadworx",
  logo_url: getLogo("CP"),
  "short_desc": "AutoCAD-based plant design from Hexagon — pipe spec, isometrics, and bidirectional CAESAR II.",
  "description": "CADWorx Plant Professional is Hexagon's AutoCAD-based plant-design tool — popular in the Americas as an affordable alternative to E3D/SP3D, with seamless bi-directional links to CAESAR II for pipe-stress.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Subscription",
  "starting_price": 5000,
  "platforms": ["Windows"],
  "industries": ["Oil & Gas", "Chemical", "Power"],

  "core_features": [
    "AutoCAD-based 3D plant modeling",
    "Spec-driven pipe routing",
    "Bi-directional CAESAR II link",
    "Auto-isometrics (ISOGEN)",
    "Integration with PV Elite, Tank, SmartMarine",
    "Steel modeling (CADWorx Structure)",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://hexagon.com/products/cadworx-plant-professional",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Far cheaper than E3D/SP3D for small-to-mid EPCs",
    "Native AutoCAD platform reduces training",
    "Best-in-class CAESAR II integration",
  ],

  "cons": [
    "Tied to AutoCAD subscription separately",
    "Less suitable for multi-thousand-line giga projects",
    "Windows-only",
  ],

  "tech_specs": {
    "engine": "AutoCAD ObjectARX",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["DWG", "PCF", "ISO 15926"],
  },

  "expert_verdict": "The pragmatic plant-design choice for North American EPCs that already live inside AutoCAD.",
  faqs: [{
    q: 'What is CADWorx Plant Professional used for?',
    a: 'AutoCAD-based plant design from Hexagon — pipe spec, isometrics, and bidirectional CAESAR II. CADWorx Plant Professional is a BIM solution widely adopted in Oil & Gas, Chemical, Power.',
  }, {
    q: 'How much does CADWorx Plant Professional cost?',
    a: 'CADWorx Plant Professional starts at $5,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of CADWorx Plant Professional?',
    a: 'CADWorx Plant Professional is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does CADWorx Plant Professional support?',
    a: 'CADWorx Plant Professional runs on Windows.',
  }, {
    q: 'Which file formats does CADWorx Plant Professional support?',
    a: 'CADWorx Plant Professional works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to CADWorx Plant Professional?',
    a: 'The closest alternatives within the BIM space are Autodesk Construction Cloud, BIMcollab, AutoCAD Plant 3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-construction-cloud', 'bimcollab', 'autocad-plant-3d'],
  detailed_features: [],
}, {
  id: "t209",
  "name": "CAESAR II",
  "slug": "caesar-ii",
  logo_url: getLogo("CI"),
  "short_desc": "Industry-standard pipe stress analysis for static and dynamic load cases.",
  "description": "Hexagon CAESAR II is the global benchmark pipe-stress analysis tool — used by oil & gas, petrochemical, and power EPCs for code-compliant ASME B31, EN 13480, and B31.3 stress analysis of piping systems.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 8000,
  "platforms": ["Windows"],
  "industries": ["Oil & Gas", "Chemical", "Power"],

  "core_features": [
    "ASME B31.1/B31.3/B31.4/B31.8 code checks",
    "Dynamic analysis: harmonic, spectrum, time history",
    "Hanger design and pipe support optimisation",
    "Bidirectional with CADWorx, SmartPlant, Plant 3D",
    "Nozzle load calculations (WRC 107/297)",
    "Flange leakage analysis",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://hexagon.com/products/caesar-ii",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Industry default — accepted by regulators worldwide",
    "Mature, stable code-checking library",
    "Excellent CAD integration with major plant tools",
  ],

  "cons": [
    "Windows-only",
    "License cost is steep for occasional users",
    "UI shows its age",
  ],

  "tech_specs": {
    "engine": "CAESAR II beam FEM",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["ASME B31", "EN 13480"],
  },

  "expert_verdict": "The pipe stress tool. Practically every regulator, owner, and EPC accepts CAESAR II output without question.",
  faqs: [{
    q: 'What is CAESAR II used for?',
    a: 'Industry-standard pipe stress analysis for static and dynamic load cases. CAESAR II is a CAE / CAM solution widely adopted in Oil & Gas, Chemical, Power.',
  }, {
    q: 'How much does CAESAR II cost?',
    a: 'CAESAR II starts at $8,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of CAESAR II?',
    a: 'CAESAR II is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does CAESAR II support?',
    a: 'CAESAR II runs on Windows.',
  }, {
    q: 'Which file formats does CAESAR II support?',
    a: 'CAESAR II works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to CAESAR II?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Workbench, Simcenter STAR-CCM+, AspenTech Aspen HYSYS. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-workbench', 'simcenter-star-ccm', 'aspen-hysys'],
  detailed_features: [],
}, {
  id: "t210",
  "name": "Bentley AutoPIPE",
  "slug": "autopipe",
  logo_url: getLogo("BA"),
  "short_desc": "Bentley's pipe stress analysis competing with CAESAR II — strong in nuclear and power.",
  "description": "AutoPIPE is Bentley's pipe stress / flexibility analysis tool, particularly strong in nuclear power (it ships with the NRC-validated nuclear analysis module), refinery, and offshore applications.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 8000,
  "platforms": ["Windows"],
  "industries": ["Power", "Nuclear", "Oil & Gas"],

  "core_features": [
    "ASME B31, EN 13480, KTA, ASME NB/NC/ND codes",
    "Buried pipe and PipePlus modules",
    "Bi-directional with OpenPlant, AutoCAD Plant 3D",
    "Spectrum, harmonic, and SAM analyses",
    "Hanger sizing and selection",
    "Reduced-order modal analysis",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.bentley.com/software/autopipe/",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Best nuclear-code coverage in the industry",
    "Native integration with Bentley OpenPlant suite",
    "ELS (Bentley) subscription is competitive",
  ],

  "cons": [
    "Less ubiquitous than CAESAR II — some owners require CAESAR II output specifically",
    "Windows-only",
    "Smaller third-party plug-in ecosystem",
  ],

  "tech_specs": {
    "engine": "AutoPIPE beam FEM",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["ASME B31", "EN 13480", "KTA", "ASME NB"],
  },

  "expert_verdict": "Nuclear and power-plant designers' alternative to CAESAR II — and a better fit if your shop is on the Bentley ELS.",
  faqs: [{
    q: 'What is Bentley AutoPIPE used for?',
    a: 'Bentley\'s pipe stress analysis competing with CAESAR II — strong in nuclear and power. Bentley AutoPIPE is a CAE / CAM solution widely adopted in Power, Nuclear, Oil & Gas.',
  }, {
    q: 'How much does Bentley AutoPIPE cost?',
    a: 'Bentley AutoPIPE starts at $8,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Bentley AutoPIPE?',
    a: 'Bentley AutoPIPE is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Bentley AutoPIPE support?',
    a: 'Bentley AutoPIPE runs on Windows.',
  }, {
    q: 'Which file formats does Bentley AutoPIPE support?',
    a: 'Bentley AutoPIPE works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Bentley AutoPIPE?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, Altair Inspire, PV Elite. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'altair-inspire', 'pv-elite'],
  detailed_features: [],
}, {
  id: "t211",
  "name": "PV Elite",
  "slug": "pv-elite",
  logo_url: getLogo("PE"),
  "short_desc": "Pressure vessel and heat exchanger design and code-compliance checking.",
  "description": "Hexagon PV Elite is the most-used software for pressure vessel and heat exchanger design and code compliance — ASME VIII Div 1/2, PD 5500, EN 13445, and many others — with integrated wind/seismic load handling.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 6500,
  "platforms": ["Windows"],
  "industries": ["Oil & Gas", "Chemical", "Power"],

  "core_features": [
    "ASME VIII Div 1 & Div 2 code compliance",
    "PD 5500, EN 13445, TEMA exchanger codes",
    "Wind, seismic, and snow load calculations",
    "Vessel nozzle FEA (WRC, FEA 107/297)",
    "Drawing and material report output",
    "Bidirectional with CADWorx Equipment",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://hexagon.com/products/pv-elite",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "De facto industry standard for ASME pressure vessel design",
    "Comprehensive code library",
    "Direct material report and fabrication drawing output",
  ],

  "cons": [
    "Windows-only",
    "Subscription only — perpetual licenses no longer sold",
    "Add-on modules can stack up the price",
  ],

  "tech_specs": {
    "engine": "PV Elite analytic + FEA",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["ASME VIII Div 1/2", "PD 5500", "EN 13445"],
  },

  "expert_verdict": "If you design pressure vessels, you have PV Elite installed. End of discussion.",
  faqs: [{
    q: 'What is PV Elite used for?',
    a: 'Pressure vessel and heat exchanger design and code-compliance checking. PV Elite is a CAE / CAM solution widely adopted in Oil & Gas, Chemical, Power.',
  }, {
    q: 'How much does PV Elite cost?',
    a: 'PV Elite starts at $6,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of PV Elite?',
    a: 'PV Elite is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does PV Elite support?',
    a: 'PV Elite runs on Windows.',
  }, {
    q: 'Which file formats does PV Elite support?',
    a: 'PV Elite works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to PV Elite?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, Altair Inspire, Bentley STAAD.Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'altair-inspire', 'staad-pro'],
  detailed_features: [],
}, {
  id: "t212",
  "name": "AspenTech Aspen HYSYS",
  "slug": "aspen-hysys",
  logo_url: getLogo("AA"),
  "short_desc": "Process simulation for oil & gas, refining, and gas processing — the upstream standard.",
  "description": "Aspen HYSYS is the global standard process simulator for upstream oil & gas, refining, and gas processing — steady-state and dynamic simulation, pipeline networks, equipment sizing, and operations analytics.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 25000,
  "platforms": ["Windows"],
  "industries": ["Oil & Gas", "Refining", "Chemical"],

  "core_features": [
    "Steady-state and dynamic process simulation",
    "Refining-focused thermodynamic packages",
    "HYSYS Upstream pipeline / wellbore modeling",
    "Activated Energy Analyzer and Exchanger Design",
    "Heat-exchanger network optimisation",
    "Aspen Plus inter-operability",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.aspentech.com/en/products/engineering/aspen-hysys",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Industry default for upstream and midstream process simulation",
    "Excellent dynamic simulation capability",
    "Tight integration with the wider AspenTech suite",
  ],

  "cons": ["Top-tier enterprise pricing", "Windows-only", "Steep onboarding curve"],

  "tech_specs": {
    "engine": "Aspen HYSYS solver",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["CAPE-OPEN"],
  },

  "expert_verdict": "If you simulate refineries or oil-and-gas processing for a living, HYSYS is on your desk.",
  faqs: [{
    q: 'What is AspenTech Aspen HYSYS used for?',
    a: 'Process simulation for oil & gas, refining, and gas processing — the upstream standard. AspenTech Aspen HYSYS is a CAE / CAM solution widely adopted in Oil & Gas, Refining, Chemical.',
  }, {
    q: 'How much does AspenTech Aspen HYSYS cost?',
    a: 'AspenTech Aspen HYSYS starts at $25,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of AspenTech Aspen HYSYS?',
    a: 'AspenTech Aspen HYSYS is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does AspenTech Aspen HYSYS support?',
    a: 'AspenTech Aspen HYSYS runs on Windows.',
  }, {
    q: 'Which file formats does AspenTech Aspen HYSYS support?',
    a: 'AspenTech Aspen HYSYS works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to AspenTech Aspen HYSYS?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Workbench, Simcenter STAR-CCM+, CAESAR II. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-workbench', 'simcenter-star-ccm', 'caesar-ii'],
  detailed_features: [],
}, {
  id: "t213",
  "name": "UltiMaker Cura",
  "slug": "ultimaker-cura",
  logo_url: getLogo("UC"),
  "short_desc": "Free, open-source slicer — the most-used FDM 3D printing prep tool in the world.",
  "description": "UltiMaker Cura is the dominant free, open-source slicer for FDM/FFF 3D printing — supports 400+ printer profiles out of the box, scripting via post-processing plugins, and a marketplace of third-party material profiles.",
  "country": "Netherlands",
  "category_id": "c7",
  "pricing_type": "Open Source",
  "starting_price": 0,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Maker", "Education", "Manufacturing"],

  "core_features": [
    "400+ printer profiles out of the box",
    "Tree, normal, and Cura Engine support generation",
    "Marketplace for plugins and material profiles",
    "Adaptive layers and Z-hop optimisation",
    "Mesh repair and infill patterns library",
    "Cloud account for shared profiles",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Education"],
  "official_url": "https://ultimaker.com/software/ultimaker-cura/",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Free, fast updates, huge community",
    "Marketplace makes extending trivial",
    "Open source — any printer manufacturer can ship a profile",
  ],

  "cons": [
    "Default supports are still inferior to PrusaSlicer's Organic Supports",
    "Less DLP/SLA support than dedicated tools",
    "Cloud features pull users toward UltiMaker hardware",
  ],

  "tech_specs": {
    "engine": "CuraEngine",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL preview",
    "standards": ["STL", "3MF", "OBJ", "G-code"],
  },

  "expert_verdict": "The slicer 70% of FDM printers in the world rely on. Free, fast, and good enough for nearly everything.",
  faqs: [{
    q: 'What is UltiMaker Cura used for?',
    a: 'Free, open-source slicer — the most-used FDM 3D printing prep tool in the world. UltiMaker Cura is a visualization and rendering solution widely adopted in Maker, Education, Manufacturing.',
  }, {
    q: 'How much does UltiMaker Cura cost?',
    a: 'UltiMaker Cura is open-source and free to use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is UltiMaker Cura really free?',
    a: 'Yes — UltiMaker Cura is open-source software released under a permissive license. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does UltiMaker Cura support?',
    a: 'UltiMaker Cura runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does UltiMaker Cura support?',
    a: 'UltiMaker Cura works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to UltiMaker Cura?',
    a: 'The closest alternatives within the Specialized space are Bambu Studio, PrusaSlicer, D5 Render. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['bambu-studio', 'prusaslicer', 'd5-render'],
  detailed_features: [],
}, {
  id: "t214",
  "name": "PrusaSlicer",
  "slug": "prusaslicer",
  logo_url: getLogo("PR"),
  "short_desc": "Open-source slicer from Prusa Research — known for Organic Supports and rapid feature delivery.",
  "description": "PrusaSlicer is Prusa Research's open-source slicer, originally a Slic3r fork, now the slicer with the fastest pace of innovation — Organic Supports, ironing, multi-material with Prusa MMU, and SLA support.",
  "country": "Czech Republic",
  "category_id": "c7",
  "pricing_type": "Open Source",
  "starting_price": 0,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Maker", "Education", "Manufacturing"],

  "core_features": [
    "Organic / tree supports with industry-best quality",
    "FDM and SLA / DLP slicing in one app",
    "Multi-material with MMU and toolchanger support",
    "Adaptive cubic infill",
    "Connect cloud printer monitoring",
    "Profiles for 50+ printer brands",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Education"],
  "official_url": "https://www.prusa3d.com/page/prusaslicer_424/",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Best support generation in the industry (Organic Supports)",
    "Free and open-source under AGPL",
    "Frequent major releases with real new features",
  ],

  "cons": [
    "Profile optimisation skewed toward Prusa hardware",
    "Some advanced features lag Bambu Studio for high-speed CoreXY",
    "Cloud features tied to Prusa Connect",
  ],

  "tech_specs": {
    "engine": "PrusaSlicer (Slic3r-derived)",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL",
    "standards": ["STL", "3MF", "OBJ", "G-code"],
  },

  "expert_verdict": "If you care about print quality, PrusaSlicer is the slicer to beat — and most don't.",
  faqs: [{
    q: 'What is PrusaSlicer used for?',
    a: 'Open-source slicer from Prusa Research — known for Organic Supports and rapid feature delivery. PrusaSlicer is a visualization and rendering solution widely adopted in Maker, Education, Manufacturing.',
  }, {
    q: 'How much does PrusaSlicer cost?',
    a: 'PrusaSlicer is open-source and free to use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is PrusaSlicer really free?',
    a: 'Yes — PrusaSlicer is open-source software released under a permissive license. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does PrusaSlicer support?',
    a: 'PrusaSlicer runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does PrusaSlicer support?',
    a: 'PrusaSlicer works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to PrusaSlicer?',
    a: 'The closest alternatives within the Specialized space are Bambu Studio, UltiMaker Cura, D5 Render. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['bambu-studio', 'ultimaker-cura', 'd5-render'],
  detailed_features: [],
}, {
  id: "t215",
  "name": "Bambu Studio",
  "slug": "bambu-studio",
  logo_url: getLogo("BS"),
  "short_desc": "Bambu Lab's PrusaSlicer-derived slicer, optimized for high-speed CoreXY printers.",
  "description": "Bambu Studio is the slicer for Bambu Lab's high-speed CoreXY 3D printers — a PrusaSlicer fork tuned for very high accelerations, AMS multi-color, and cloud-connected workflows. Free and increasingly multi-vendor.",
  "country": "China",
  "category_id": "c7",
  "pricing_type": "Open Source",
  "starting_price": 0,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Maker", "Education", "Manufacturing"],

  "core_features": [
    "High-speed printer profiles (X1, P1, A1 series)",
    "AMS multi-color and multi-material slicing",
    "Input shaping and pressure advance calibration",
    "MakerWorld cloud model library integration",
    "Tree supports, ironing, fuzzy skin",
    "Profiles for third-party CoreXY printers (Voron, etc.)",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Education"],
  "official_url": "https://bambulab.com/en/download/studio",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Best out-of-box experience for high-speed CoreXY printing",
    "Robust multi-color AMS workflow",
    "Active development, frequent updates",
  ],

  "cons": [
    "Cloud features push users toward Bambu Cloud",
    "Some profiles default to Bambu Lab hardware quirks",
    "Multi-material on non-Bambu printers needs manual setup",
  ],

  "tech_specs": {
    "engine": "Bambu Studio (PrusaSlicer fork)",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL",
    "standards": ["STL", "3MF", "OBJ", "G-code"],
  },

  "expert_verdict": "If you own a Bambu Lab printer it's a no-brainer; if you don't, it's still a solid third-party choice for high-speed prints.",
  faqs: [{
    q: 'What is Bambu Studio used for?',
    a: 'Bambu Lab\'s PrusaSlicer-derived slicer, optimized for high-speed CoreXY printers. Bambu Studio is a visualization and rendering solution widely adopted in Maker, Education, Manufacturing.',
  }, {
    q: 'How much does Bambu Studio cost?',
    a: 'Bambu Studio is open-source and free to use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is Bambu Studio really free?',
    a: 'Yes — Bambu Studio is open-source software released under a permissive license. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does Bambu Studio support?',
    a: 'Bambu Studio runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does Bambu Studio support?',
    a: 'Bambu Studio works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Bambu Studio?',
    a: 'The closest alternatives within the Specialized space are UltiMaker Cura, PrusaSlicer, D5 Render. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ultimaker-cura', 'prusaslicer', 'd5-render'],
  detailed_features: [],
}, {
  id: "t216",
  "name": "Simplify3D",
  "slug": "simplify3d",
  logo_url: getLogo("SI"),
  "short_desc": "Veteran commercial slicer with manual fine-tuning controls beloved by power users.",
  "description": "Simplify3D is a long-standing commercial FDM slicer that built its reputation on granular per-part settings, manual support placement, and stable output — now competing with rapid-evolving free slicers.",
  "country": "USA",
  "category_id": "c7",
  "pricing_type": "Perpetual",
  "starting_price": 199,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Maker", "Education", "Manufacturing"],

  "core_features": [
    "Per-process slicing with stop-points",
    "Manual support placement",
    "Multi-extrusion management",
    "Pre-print simulation",
    "Mesh repair tools",
    "Profiles for 100+ printers",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB"],
  "official_url": "https://www.simplify3d.com",
  "affiliate_url": null,
  "score": 3.9,

  "pros": [
    "Per-process settings still unmatched for complex prints",
    "Stable, fast slicer",
    "Manual support placement gives the user full control",
  ],

  "cons": [
    "Free open-source slicers now match or beat its quality",
    "Major releases are slow",
    "Commercial price tag in a free-tool market",
  ],

  "tech_specs": {
    "engine": "Simplify3D engine",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL",
    "standards": ["STL", "OBJ", "G-code"],
  },

  "expert_verdict": "Power-user slicer for those who refuse to switch. New users should start with PrusaSlicer or Bambu Studio.",
  faqs: [{
    q: 'What is Simplify3D used for?',
    a: 'Veteran commercial slicer with manual fine-tuning controls beloved by power users. Simplify3D is a visualization and rendering solution widely adopted in Maker, Education, Manufacturing.',
  }, {
    q: 'How much does Simplify3D cost?',
    a: 'Simplify3D starts at $199 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Simplify3D?',
    a: 'Simplify3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Simplify3D support?',
    a: 'Simplify3D runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does Simplify3D support?',
    a: 'Simplify3D works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Simplify3D?',
    a: 'The closest alternatives within the Specialized space are JewelCAD Pro, RhinoGold, Carlson Survey. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['jewelcad-pro', 'rhinogold', 'carlson-survey'],
  detailed_features: [],
}, {
  id: "t217",
  "name": "Autodesk Netfabb",
  "slug": "autodesk-netfabb",
  logo_url: getLogo("AN"),
  "short_desc": "Industrial additive manufacturing prep, lattice, and build-plate optimization.",
  "description": "Autodesk Netfabb is the industrial-grade 3D-printing prep platform — used for metal AM, polymer SLS, and powder-bed fusion build-plate packing, support generation, lattice generation, and simulation of distortion.",
  "country": "USA",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 4070,
  "platforms": ["Windows"],
  "industries": ["Aerospace", "Medical", "Manufacturing", "Automotive"],

  "core_features": [
    "Build-plate packing optimisation",
    "Lattice generation",
    "Support generation for metal AM",
    "Distortion / residual stress simulation",
    "Mesh repair tools",
    "Integration with Fusion 360 and Inventor",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.autodesk.com/products/netfabb",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Industrial AM workflow for metal and polymer powder beds",
    "Lattice and topology tools tightly integrated",
    "Distortion simulation reduces print failures",
  ],

  "cons": [
    "Windows-only",
    "Sold as subscription; pricey for occasional jobs",
    "UI feels like a stack of acquired tools (legacy Materialise / Netfabb GmbH)",
  ],

  "tech_specs": {
    "engine": "Netfabb",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL",
    "standards": ["STL", "3MF", "AMF"],
  },

  "expert_verdict": "The serious industrial AM prep tool — overkill for a desktop FDM, essential for production metal AM lines.",
  faqs: [{
    q: 'What is Autodesk Netfabb used for?',
    a: 'Industrial additive manufacturing prep, lattice, and build-plate optimization. Autodesk Netfabb is a visualization and rendering solution widely adopted in Aerospace, Medical, Manufacturing.',
  }, {
    q: 'How much does Autodesk Netfabb cost?',
    a: 'Autodesk Netfabb starts at $4,070 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Autodesk Netfabb?',
    a: 'Autodesk Netfabb is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Autodesk Netfabb support?',
    a: 'Autodesk Netfabb runs on Windows.',
  }, {
    q: 'Which file formats does Autodesk Netfabb support?',
    a: 'Autodesk Netfabb works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Autodesk Netfabb?',
    a: 'The closest alternatives within the Specialized space are Optitex, Lectra Modaris, Gerber AccuMark. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['optitex', 'lectra-modaris', 'gerber-accumark'],
  detailed_features: [],
}, {
  id: "t218",
  "name": "Optitex",
  "slug": "optitex",
  logo_url: getLogo("OP"),
  "short_desc": "2D pattern making and 3D digital prototyping for fashion and apparel.",
  "description": "Optitex is a leading apparel CAD suite for 2D pattern making, marker making, and 3D garment simulation — used by major brands to shorten the design-to-sample cycle with photoreal virtual sampling.",
  "country": "Israel",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 3000,
  "platforms": ["Windows"],
  "industries": ["Fashion", "Apparel", "Textile"],

  "core_features": [
    "2D pattern making with PDS 2D",
    "3D garment simulation",
    "Automatic marker making",
    "Fabric simulation with physics",
    "Photorealistic rendering with Vidya",
    "PLM integration",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://optitex.com",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Tight 2D ↔ 3D workflow",
    "Strong marker optimisation reduces fabric waste",
    "Used by major global apparel brands",
  ],

  "cons": [
    "Windows-only",
    "Annual licensing is steep for individual designers",
    "Learning curve for 3D simulation",
  ],

  "tech_specs": {
    "engine": "Optitex PDS / 3D",
    "multicore": "Yes",
    "gpu_optimization": "Yes",
    "standards": ["DXF-AAMA", "DXF-ASTM"],
  },

  "expert_verdict": "The industrial-grade 2D-and-3D apparel CAD many global brands actually use.",
  faqs: [{
    q: 'What is Optitex used for?',
    a: '2D pattern making and 3D digital prototyping for fashion and apparel. Optitex is a visualization and rendering solution widely adopted in Fashion, Apparel, Textile.',
  }, {
    q: 'How much does Optitex cost?',
    a: 'Optitex starts at $3,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Optitex?',
    a: 'Optitex is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Optitex support?',
    a: 'Optitex runs on Windows.',
  }, {
    q: 'Which file formats does Optitex support?',
    a: 'Optitex works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Optitex?',
    a: 'The closest alternatives within the Specialized space are Browzwear, Trimble Business Center, Marvelous Designer. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['browzwear', 'trimble-business-center', 'marvelous-designer'],
  detailed_features: [],
}, {
  id: "t219",
  "name": "Gerber AccuMark",
  "slug": "gerber-accumark",
  logo_url: getLogo("GA"),
  "short_desc": "Lectra's Gerber AccuMark — the long-standing global standard for apparel pattern and marker making.",
  "description": "Gerber AccuMark (now part of Lectra) is the historic global standard for apparel pattern making, grading, and marker making — deployed by virtually every global apparel manufacturer for decades.",
  "country": "USA",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 3500,
  "platforms": ["Windows"],
  "industries": ["Fashion", "Apparel", "Textile"],

  "core_features": [
    "2D pattern design, grading, marker making",
    "AccuMark 3D virtual sampling",
    "Easy Order made-to-measure",
    "Plotter and cutter integration",
    "PLM connector",
    "Cloud-based AccuMark Open Source library",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.lectra.com/en/fashion/products/accumark",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "The de facto global pattern CAD — fluent talent pool everywhere",
    "Mature plotter / cutter integration",
    "Strong PLM connector",
  ],

  "cons": [
    "Windows-only",
    "Subscription pricing not advertised — quote-only",
    "3D module less polished than CLO / Browzwear",
  ],

  "tech_specs": {
    "engine": "AccuMark",
    "multicore": "Yes",
    "gpu_optimization": "Limited",
    "standards": ["DXF-AAMA", "DXF-ASTM"],
  },

  "expert_verdict": "If you work in any large apparel factory, AccuMark is already on the desk.",
  faqs: [{
    q: 'What is Gerber AccuMark used for?',
    a: 'Lectra\'s Gerber AccuMark — the long-standing global standard for apparel pattern and marker making. Gerber AccuMark is a visualization and rendering solution widely adopted in Fashion, Apparel, Textile.',
  }, {
    q: 'How much does Gerber AccuMark cost?',
    a: 'Gerber AccuMark starts at $3,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Gerber AccuMark?',
    a: 'Gerber AccuMark is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Gerber AccuMark support?',
    a: 'Gerber AccuMark runs on Windows.',
  }, {
    q: 'Which file formats does Gerber AccuMark support?',
    a: 'Gerber AccuMark works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Gerber AccuMark?',
    a: 'The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['infraworks', '3ds-max', 'zbrush'],
  detailed_features: [],
}, {
  id: "t220",
  "name": "Lectra Modaris",
  "slug": "lectra-modaris",
  logo_url: getLogo("LM"),
  "short_desc": "Lectra's professional pattern design and grading tool for apparel manufacturing.",
  "description": "Lectra Modaris is the European-favoured apparel CAD — strong in haute couture and luxury houses for pattern design, made-to-measure, and integration with Lectra's cutting hardware.",
  "country": "France",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 3500,
  "platforms": ["Windows"],
  "industries": ["Fashion", "Apparel", "Luxury"],

  "core_features": [
    "Modaris pattern design and grading",
    "Modaris 3D virtual prototyping",
    "Diamino marker making",
    "Direct connection to Lectra cutters",
    "Made-to-measure templates",
    "PLM (Furmark / Centric) integration",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://www.lectra.com/en/fashion/products/modaris",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Long-standing European apparel standard",
    "Strong made-to-measure capability",
    "Integration with Lectra cutting line",
  ],

  "cons": [
    "Windows-only",
    "Quote-only pricing",
    "UI feels conservative compared with newer tools",
  ],

  "tech_specs": {
    "engine": "Modaris",
    "multicore": "Yes",
    "gpu_optimization": "Limited",
    "standards": ["DXF-AAMA", "DXF-ASTM"],
  },

  "expert_verdict": "Lectra's flagship pattern CAD — particularly strong in European luxury / couture houses.",
  faqs: [{
    q: 'What is Lectra Modaris used for?',
    a: 'Lectra\'s professional pattern design and grading tool for apparel manufacturing. Lectra Modaris is a visualization and rendering solution widely adopted in Fashion, Apparel, Luxury.',
  }, {
    q: 'How much does Lectra Modaris cost?',
    a: 'Lectra Modaris starts at $3,500 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Lectra Modaris?',
    a: 'Lectra Modaris is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Lectra Modaris support?',
    a: 'Lectra Modaris runs on Windows.',
  }, {
    q: 'Which file formats does Lectra Modaris support?',
    a: 'Lectra Modaris works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Lectra Modaris?',
    a: 'The closest alternatives within the Specialized space are Autodesk Netfabb, Optitex, Gerber AccuMark. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-netfabb', 'optitex', 'gerber-accumark'],
  detailed_features: [],
}, {
  id: "t221",
  "name": "Browzwear",
  "slug": "browzwear",
  logo_url: getLogo("BR"),
  "short_desc": "Cloud-connected 3D fashion design software for virtual sampling and digital twins.",
  "description": "Browzwear's VStitcher and Lotta are the leading 3D virtual-sampling tools for the apparel industry — letting brands replace physical samples with photoreal digital prototypes that can be reviewed and approved by stakeholders worldwide.",
  "country": "Singapore",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 3600,
  "platforms": ["Windows", "macOS"],
  "industries": ["Fashion", "Apparel"],

  "core_features": [
    "VStitcher 3D garment simulation",
    "Lotta cloud collaboration",
    "Fabric digitization with True-to-Scale",
    "Animation and pose simulation",
    "PBR fabric rendering",
    "PLM and DAM connectors",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://browzwear.com",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Best-in-class 3D garment simulation realism",
    "Cloud collaboration (Lotta) reduces sample cycles",
    "Strong adoption with major US/EU brands",
  ],

  "cons": [
    "Subscription-only, premium pricing",
    "Best paired with Adobe Substance for material authoring",
    "Steep learning curve",
  ],

  "tech_specs": {
    "engine": "VStitcher 3D",
    "multicore": "Yes",
    "gpu_optimization": "Yes",
    "standards": ["DXF-AAMA", "GLB"],
  },

  "expert_verdict": "Top-tier 3D apparel simulation. Browzwear and CLO 3D are the two real options for serious virtual sampling.",
  faqs: [{
    q: 'What is Browzwear used for?',
    a: 'Cloud-connected 3D fashion design software for virtual sampling and digital twins. Browzwear is a visualization and rendering solution widely adopted in Fashion, Apparel.',
  }, {
    q: 'How much does Browzwear cost?',
    a: 'Browzwear starts at $3,600 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Browzwear?',
    a: 'Browzwear is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Browzwear support?',
    a: 'Browzwear runs on Windows and macOS.',
  }, {
    q: 'Which file formats does Browzwear support?',
    a: 'Browzwear works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Browzwear?',
    a: 'The closest alternatives within the Specialized space are Trimble Business Center, Marvelous Designer, V-Ray. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['trimble-business-center', 'marvelous-designer', 'v-ray'],
  detailed_features: [],
}, {
  id: "t222",
  "name": "Marvelous Designer",
  "slug": "marvelous-designer",
  logo_url: getLogo("MD"),
  "short_desc": "3D garment design used widely in games, animation, film, and apparel concepting.",
  "description": "Marvelous Designer is the dominant 3D garment design tool in the games, film, and animation industry — and an approachable entry point for apparel designers exploring 3D before moving to CLO or Browzwear.",
  "country": "South Korea",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 480,
  "platforms": ["Windows", "macOS"],
  "industries": ["Games", "Film & Animation", "Fashion"],

  "core_features": [
    "Pattern-based 3D garment creation",
    "Cloth physics simulation",
    "Avatars and animation",
    "Texture and PBR material editor",
    "Maya / Blender / Unreal / Unity exporters",
    "Garment library and presets",
  ],

  "user_scales": ["Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://marvelousdesigner.com",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Dominant in 3D character / film clothing workflows",
    "Approachable to non-pattern-trained 3D artists",
    "Strong exporters to all major DCC pipelines",
  ],

  "cons": [
    "Subscription pricing pushed users away from prior perpetual model",
    "Less suited for production apparel manufacturing than CLO or Browzwear",
    "No native plotter / cutter integration",
  ],

  "tech_specs": {
    "engine": "MD Cloth Simulator",
    "multicore": "Yes",
    "gpu_optimization": "Yes (CUDA)",
    "standards": ["FBX", "OBJ", "Alembic", "USD"],
  },

  "expert_verdict": "The cross-industry 3D garment tool — equally at home dressing a Pixar character or a luxury-brand mannequin.",
  faqs: [{
    q: 'What is Marvelous Designer used for?',
    a: '3D garment design used widely in games, animation, film, and apparel concepting. Marvelous Designer is a visualization and rendering solution widely adopted in Games, Film & Animation, Fashion.',
  }, {
    q: 'How much does Marvelous Designer cost?',
    a: 'Marvelous Designer starts at $480 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Marvelous Designer?',
    a: 'Marvelous Designer is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Marvelous Designer support?',
    a: 'Marvelous Designer runs on Windows and macOS.',
  }, {
    q: 'Which file formats does Marvelous Designer support?',
    a: 'Marvelous Designer works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Marvelous Designer?',
    a: 'The closest alternatives within the Specialized space are Adobe Substance 3D Painter, V-Ray, Browzwear. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['substance-painter', 'v-ray', 'browzwear'],
  detailed_features: [],
}, {
  id: "t223",
  "name": "RhinoGold",
  "slug": "rhinogold",
  logo_url: getLogo("RH"),
  "short_desc": "Rhino-based jewelry CAD plugin with gem setting, parametric jewelry libraries, and rendering.",
  "description": "RhinoGold is a Rhino-based jewelry CAD plugin built around gem setting, parametric jewelry components, and a rendering pipeline — historically the dominant jewelry CAD before being superseded by MatrixGold from the same vendor.",
  "country": "Spain",
  "category_id": "c7",
  "pricing_type": "Perpetual",
  "starting_price": 2495,
  "platforms": ["Windows"],
  "industries": ["Jewelry"],

  "core_features": [
    "Built on Rhinoceros 3D",
    "Gem setting tools",
    "Parametric ring shanks, prongs, settings",
    "Render with VRay-derived engine",
    "STL export for 3D printing",
    "GemVision asset library compatibility",
  ],

  "user_scales": ["Freelancer", "SMB"],
  "official_url": "https://www.rhinogold.com",
  "affiliate_url": null,
  "score": 4.2,

  "pros": [
    "Rhino base means open ecosystem",
    "Perpetual licensing",
    "Strong gem-setting library",
  ],

  "cons": [
    "No longer the vendor's flagship (replaced by MatrixGold)",
    "Windows-only",
    "Roadmap stalled — most new investment goes to MatrixGold",
  ],

  "tech_specs": {
    "engine": "Rhinoceros + RhinoGold plugin",
    "multicore": "Limited",
    "gpu_optimization": "OpenGL",
    "standards": ["STL", "STEP", "OBJ"],
  },

  "expert_verdict": "Still in use at many small jewelry studios, but new buyers should look at MatrixGold or 3Design.",
  faqs: [{
    q: 'What is RhinoGold used for?',
    a: 'Rhino-based jewelry CAD plugin with gem setting, parametric jewelry libraries, and rendering. RhinoGold is a visualization and rendering solution widely adopted in Jewelry.',
  }, {
    q: 'How much does RhinoGold cost?',
    a: 'RhinoGold starts at $2,495 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of RhinoGold?',
    a: 'RhinoGold is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does RhinoGold support?',
    a: 'RhinoGold runs on Windows.',
  }, {
    q: 'Which file formats does RhinoGold support?',
    a: 'RhinoGold works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to RhinoGold?',
    a: 'The closest alternatives within the Specialized space are JewelCAD Pro, Simplify3D, Carlson Survey. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['jewelcad-pro', 'simplify3d', 'carlson-survey'],
  detailed_features: [],
}, {
  id: "t224",
  "name": "JewelCAD Pro",
  "slug": "jewelcad-pro",
  logo_url: getLogo("JP"),
  "short_desc": "Asia-popular dedicated jewelry CAD with parametric setting and rendering.",
  "description": "JewelCAD Pro from Jcadcam is the most widely used jewelry CAD in Asia — particularly Hong Kong, Mainland China, and India — with parametric jewelry templates, gem-setting tools, and high-resolution STL export.",
  "country": "Hong Kong",
  "category_id": "c7",
  "pricing_type": "Perpetual",
  "starting_price": 2200,
  "platforms": ["Windows"],
  "industries": ["Jewelry"],

  "core_features": [
    "Parametric jewelry libraries (rings, pendants, earrings)",
    "Gem setting with prong, bezel, channel, pavé",
    "Sub-D modeling",
    "Photoreal rendering",
    "High-resolution STL export for casting",
    "CAM toolpath generation",
  ],

  "user_scales": ["Freelancer", "SMB"],
  "official_url": "https://www.jcadcam.com",
  "affiliate_url": null,
  "score": 4.1,

  "pros": [
    "Strong adoption in Hong Kong / mainland China / India jewelry hubs",
    "Perpetual license",
    "Built-in CAM and STL output for casting",
  ],

  "cons": [
    "Windows-only",
    "Smaller global community than Rhino/MatrixGold",
    "UI is utilitarian and dated",
  ],

  "tech_specs": {
    "engine": "JewelCAD",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["STL", "OBJ", "DXF"],
  },

  "expert_verdict": "The pragmatic Asia-region jewelry CAD — perpetual, capable, and immediately productive for casters and setters.",
  faqs: [{
    q: 'What is JewelCAD Pro used for?',
    a: 'Asia-popular dedicated jewelry CAD with parametric setting and rendering. JewelCAD Pro is a visualization and rendering solution widely adopted in Jewelry.',
  }, {
    q: 'How much does JewelCAD Pro cost?',
    a: 'JewelCAD Pro starts at $2,200 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of JewelCAD Pro?',
    a: 'JewelCAD Pro is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does JewelCAD Pro support?',
    a: 'JewelCAD Pro runs on Windows.',
  }, {
    q: 'Which file formats does JewelCAD Pro support?',
    a: 'JewelCAD Pro works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to JewelCAD Pro?',
    a: 'The closest alternatives within the Specialized space are RhinoGold, Simplify3D, Carlson Survey. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['rhinogold', 'simplify3d', 'carlson-survey'],
  detailed_features: [],
}, {
  id: "t225",
  "name": "D5 Render",
  "slug": "d5-render",
  logo_url: getLogo("DR"),
  "short_desc": "Real-time ray-traced renderer for architecture, interiors, and product visualization.",
  "description": "D5 Render is a real-time GPU ray-traced renderer aimed at architects and interior designers — live link to SketchUp, Revit, Rhino, ArchiCAD, and 3ds Max, with a free Community Edition that includes commercial use.",
  "country": "China",
  "category_id": "c7",
  "pricing_type": "Freemium",
  "starting_price": 38,
  "platforms": ["Windows"],
  "industries": ["AEC", "Interior Design", "Product Visualization"],

  "core_features": [
    "Real-time ray tracing on RTX GPUs",
    "Live link to SketchUp, Revit, Rhino, ArchiCAD, 3ds Max",
    "Asset library (objects, materials, vegetation)",
    "Animation and video sequencing",
    "Cloud rendering for high-res stills",
    "DLSS / AI denoise",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB", "Mid-Market"],
  "official_url": "https://www.d5render.com",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Real-time RTX ray tracing with friendly UI",
    "Free Community Edition includes commercial use",
    "Live link plugins eliminate import/export friction",
  ],

  "cons": [
    "Requires NVIDIA RTX GPU for full functionality",
    "Windows-only",
    "Less control than V-Ray / Corona for advanced users",
  ],

  "tech_specs": {
    "engine": "D5 (RTX ray-traced)",
    "multicore": "GPU-bound",
    "gpu_optimization": "NVIDIA RTX, DLSS",
    "standards": ["FBX", "OBJ", "glTF"],
  },

  "expert_verdict": "The fastest path to good-looking architectural visuals — free tier alone makes it worth installing.",
  faqs: [{
    q: 'What is D5 Render used for?',
    a: 'Real-time ray-traced renderer for architecture, interiors, and product visualization. D5 Render is a visualization and rendering solution widely adopted in AEC, Interior Design, Product Visualization.',
  }, {
    q: 'How much does D5 Render cost?',
    a: 'D5 Render starts at $38 per seat on a freemium license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of D5 Render?',
    a: 'D5 Render is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does D5 Render support?',
    a: 'D5 Render runs on Windows.',
  }, {
    q: 'Which file formats does D5 Render support?',
    a: 'D5 Render works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to D5 Render?',
    a: 'The closest alternatives within the Specialized space are UltiMaker Cura, Corona Renderer, Bambu Studio. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ultimaker-cura', 'corona-renderer', 'bambu-studio'],
  detailed_features: [],
}, {
  id: "t226",
  "name": "V-Ray",
  "slug": "v-ray",
  logo_url: getLogo("VR"),
  "short_desc": "Chaos V-Ray — the long-standing industry-standard production renderer for 3ds Max, Maya, Revit, Rhino, and SketchUp.",
  "description": "V-Ray from Chaos is the world's most-used production renderer across architecture, automotive, and product visualization — host integrations for 3ds Max, Maya, Revit, Rhino, SketchUp, Houdini, Unreal, and Cinema 4D.",
  "country": "Bulgaria",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 396,
  "platforms": ["Windows", "macOS"],
  "industries": ["AEC", "Automotive", "Film & Animation", "Product Visualization"],

  "core_features": [
    "Hybrid CPU + GPU rendering (CUDA / RTX)",
    "Plugins for 3ds Max, Maya, Revit, Rhino, SketchUp, Houdini, Cinema 4D",
    "Chaos Vantage real-time review",
    "VRayMtl, VRayProxy, light cache",
    "Distributed rendering",
    "Chaos Cosmos asset library",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.chaos.com/vray",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Industry default for production renders",
    "Host-program coverage is unmatched",
    "Mature material library and Cosmos assets",
  ],

  "cons": [
    "Subscription pricing (perpetual no longer sold)",
    "Setup complexity higher than D5 / Enscape",
    "GPU mode still trails CPU in feature parity",
  ],

  "tech_specs": {
    "engine": "V-Ray (CPU + GPU)",
    "multicore": "Yes",
    "gpu_optimization": "CUDA, RTX, OptiX",
    "standards": ["FBX", "Alembic", "USD"],
  },

  "expert_verdict": "Still the default production renderer in arch-viz studios worldwide. Pair with Chaos Vantage for real-time review.",
  faqs: [{
    q: 'What is V-Ray used for?',
    a: 'Chaos V-Ray — the long-standing industry-standard production renderer for 3ds Max, Maya, Revit, Rhino, and SketchUp. V-Ray is a visualization and rendering solution widely adopted in AEC, Automotive, Film & Animation.',
  }, {
    q: 'How much does V-Ray cost?',
    a: 'V-Ray starts at $396 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of V-Ray?',
    a: 'V-Ray is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does V-Ray support?',
    a: 'V-Ray runs on Windows and macOS.',
  }, {
    q: 'Which file formats does V-Ray support?',
    a: 'V-Ray works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to V-Ray?',
    a: 'The closest alternatives within the Specialized space are Marvelous Designer, Browzwear, Trimble Business Center. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['marvelous-designer', 'browzwear', 'trimble-business-center'],
  detailed_features: [],
}, {
  id: "t227",
  "name": "Corona Renderer",
  "slug": "corona-renderer",
  logo_url: getLogo("CR"),
  "short_desc": "Chaos Corona — interactive unbiased renderer beloved for interior visualization workflows.",
  "description": "Corona Renderer (Chaos) is a CPU-based unbiased renderer that won the interior-visualization community with very fast interactive preview, simple material setup, and excellent out-of-box quality.",
  "country": "Czech Republic",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 32,
  "platforms": ["Windows"],
  "industries": ["AEC", "Interior Design", "Product Visualization"],

  "core_features": [
    "Path-traced unbiased CPU renderer",
    "Interactive viewport renderer",
    "Corona Material with simple parameters",
    "Plugins for 3ds Max and Cinema 4D",
    "Chaos Cosmos library",
    "AI Denoise (NVIDIA OptiX or Intel Open Image)",
  ],

  "user_scales": ["Freelancer", "SMB", "Mid-Market"],
  "official_url": "https://www.chaos.com/corona",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Best-in-class interior visualization out of the box",
    "Friendly UI with very few parameters",
    "Strong CPU performance scales well in render farms",
  ],

  "cons": [
    "CPU-only — no GPU acceleration",
    "Plugin support narrower than V-Ray (3ds Max + C4D only)",
    "Subscription only",
  ],

  "tech_specs": {
    "engine": "Corona path-tracer (CPU)",
    "multicore": "Yes",
    "gpu_optimization": "Denoiser only",
    "standards": ["FBX", "Alembic"],
  },

  "expert_verdict": "Interior visualization shops love Corona — fast iteration and great default quality with minimal fiddling.",
  faqs: [{
    q: 'What is Corona Renderer used for?',
    a: 'Chaos Corona — interactive unbiased renderer beloved for interior visualization workflows. Corona Renderer is a visualization and rendering solution widely adopted in AEC, Interior Design, Product Visualization.',
  }, {
    q: 'How much does Corona Renderer cost?',
    a: 'Corona Renderer starts at $32 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Corona Renderer?',
    a: 'Corona Renderer is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Corona Renderer support?',
    a: 'Corona Renderer runs on Windows.',
  }, {
    q: 'Which file formats does Corona Renderer support?',
    a: 'Corona Renderer works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Corona Renderer?',
    a: 'The closest alternatives within the Specialized space are Marvelous Designer, Adobe Substance 3D Painter, Browzwear. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['marvelous-designer', 'substance-painter', 'browzwear'],
  detailed_features: [],
}, {
  id: "t228",
  "name": "Adobe Substance 3D Painter",
  "slug": "substance-painter",
  logo_url: getLogo("AS"),
  "short_desc": "PBR texture-painting tool used industry-wide for games, film, and product visualization.",
  "description": "Adobe Substance 3D Painter is the industry-default PBR texture-painting application — used to texture characters, vehicles, environments, and products with smart materials, generators, and a non-destructive layer stack.",
  "country": "France",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 240,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Games", "Film & Animation", "Product Visualization", "Automotive"],

  "core_features": [
    "Non-destructive PBR layer stack",
    "Smart materials and smart masks",
    "Procedural generators",
    "Bakers (AO, normal, curvature, world-space)",
    "USD and glTF export",
    "Live link with Substance Painter for Maya, Blender, 3ds Max",
  ],

  "user_scales": ["Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.adobe.com/products/substance3d-painter.html",
  "affiliate_url": null,
  "score": 4.7,

  "pros": [
    "Industry default for PBR texturing in games and film",
    "Excellent procedural generators",
    "Mature integration with all major 3D DCCs",
  ],

  "cons": [
    "Adobe subscription pricing replaced cheaper Allegorithmic licensing",
    "Linux build trails Windows / macOS",
    "Painter ≠ Designer — buying Substance Collection often needed",
  ],

  "tech_specs": {
    "engine": "Substance Engine",
    "multicore": "Yes",
    "gpu_optimization": "Yes",
    "standards": ["USD", "glTF", "FBX", "OBJ"],
  },

  "expert_verdict": "The default PBR texturing tool of the 3D industry. Adobe pricing aside, there is no real alternative at this maturity.",
  faqs: [{
    q: 'What is Adobe Substance 3D Painter used for?',
    a: 'PBR texture-painting tool used industry-wide for games, film, and product visualization. Adobe Substance 3D Painter is a visualization and rendering solution widely adopted in Games, Film & Animation, Product Visualization.',
  }, {
    q: 'How much does Adobe Substance 3D Painter cost?',
    a: 'Adobe Substance 3D Painter starts at $240 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Adobe Substance 3D Painter?',
    a: 'Adobe Substance 3D Painter is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Adobe Substance 3D Painter support?',
    a: 'Adobe Substance 3D Painter runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does Adobe Substance 3D Painter support?',
    a: 'Adobe Substance 3D Painter works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Adobe Substance 3D Painter?',
    a: 'The closest alternatives within the Specialized space are Marvelous Designer, V-Ray, Browzwear. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['marvelous-designer', 'v-ray', 'browzwear'],
  detailed_features: [],
}, {
  id: "t229",
  "name": "Autodesk Construction Cloud",
  "slug": "autodesk-construction-cloud",
  logo_url: getLogo("AC"),
  "short_desc": "Autodesk's unified construction-management platform (BIM 360, BIM Collaborate, Build, Takeoff, Docs).",
  "description": "Autodesk Construction Cloud is the umbrella for Autodesk's construction-management software — BIM Collaborate, Build, Docs, Takeoff, Cost — replacing the long-running BIM 360 brand and unifying common data environment, model coordination, and field tools.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Subscription",
  "starting_price": 1080,
  "platforms": ["Web", "Windows", "iOS", "Android"],
  "industries": ["AEC", "Construction"],

  "core_features": [
    "Autodesk Docs CDE",
    "BIM Collaborate Pro (Revit Cloud Worksharing)",
    "Build (project management, field, RFI, submittals)",
    "Takeoff (2D / 3D quantity takeoff)",
    "Cost management",
    "API + Insight + Auto-clash detection",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://construction.autodesk.com",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Single platform unifies model collaboration and field workflows",
    "Tight Revit and Civil 3D integration",
    "Strong API and ACC Connect ecosystem",
  ],

  "cons": [
    "Per-user pricing adds up fast on large projects",
    "Migration from legacy BIM 360 still painful",
    "Mobile experience inconsistent across modules",
  ],

  "tech_specs": {
    "engine": "Autodesk Forge / APS",
    "multicore": "Cloud",
    "gpu_optimization": "N/A",
    "standards": ["IFC", "RVT", "DWG", "Navisworks NWD"],
  },

  "expert_verdict": "The natural collaboration layer for any Autodesk-centric AEC firm — and the de facto industry standard CDE.",
  faqs: [{
    q: 'What is Autodesk Construction Cloud used for?',
    a: 'Autodesk\'s unified construction-management platform (BIM 360, BIM Collaborate, Build, Takeoff, Docs). Autodesk Construction Cloud is a BIM solution widely adopted in AEC, Construction.',
  }, {
    q: 'How much does Autodesk Construction Cloud cost?',
    a: 'Autodesk Construction Cloud starts at $1,080 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Autodesk Construction Cloud?',
    a: 'Autodesk Construction Cloud is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Autodesk Construction Cloud support?',
    a: 'Autodesk Construction Cloud runs on Web, Windows, iOS, and Android. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does Autodesk Construction Cloud support?',
    a: 'Autodesk Construction Cloud works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Autodesk Construction Cloud?',
    a: 'The closest alternatives within the BIM space are BIMcollab, Allplan, AutoCAD Plant 3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['bimcollab', 'allplan', 'autocad-plant-3d'],
  detailed_features: [],
}, {
  id: "t230",
  "name": "Trimble Connect",
  "slug": "trimble-connect",
  logo_url: getLogo("TC"),
  "short_desc": "Trimble's openBIM common data environment with strong Tekla and SketchUp integration.",
  "description": "Trimble Connect is the openBIM-friendly common data environment from Trimble — known for excellent IFC viewer/clash, web/desktop/mobile/HoloLens parity, and strong fit with Tekla Structures and SketchUp.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Freemium",
  "starting_price": 0,
  "platforms": ["Web", "Windows", "macOS", "iOS", "Android"],
  "industries": ["AEC", "Construction"],

  "core_features": [
    "Free tier for unlimited collaborators",
    "IFC viewer with clash detection",
    "Native links to Tekla Structures and SketchUp",
    "Mobile + AR (HoloLens, ARKit)",
    "ToDo workflow for issue tracking",
    "REST API and SAML SSO",
  ],

  "user_scales": ["Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://connect.trimble.com",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Generous free tier",
    "True openBIM workflow on IFC",
    "Best HoloLens / AR review story",
  ],

  "cons": [
    "Less feature-rich than ACC for full construction management",
    "Coordination workflows still maturing",
    "Some advanced features paywalled at Business tier",
  ],

  "tech_specs": {
    "engine": "Trimble Connect cloud + native viewers",
    "multicore": "Cloud",
    "gpu_optimization": "N/A",
    "standards": ["IFC", "DWG", "RVT", "SKP"],
  },

  "expert_verdict": "If you live in Tekla or SketchUp, Trimble Connect is the natural CDE — free tier alone makes it worth trying.",
  faqs: [{
    q: 'What is Trimble Connect used for?',
    a: 'Trimble\'s openBIM common data environment with strong Tekla and SketchUp integration. Trimble Connect is a BIM solution widely adopted in AEC, Construction.',
  }, {
    q: 'How much does Trimble Connect cost?',
    a: 'Trimble Connect is offered on a freemium model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.',
  }, {
    q: 'Is there a free version of Trimble Connect?',
    a: 'Trimble Connect is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Trimble Connect support?',
    a: 'Trimble Connect runs on Web, Windows, macOS, iOS, and Android. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does Trimble Connect support?',
    a: 'Trimble Connect works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Trimble Connect?',
    a: 'The closest alternatives within the BIM space are Autodesk Dynamo, Autodesk Construction Cloud, BIMcollab. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-dynamo', 'autodesk-construction-cloud', 'bimcollab'],
  detailed_features: [],
}, {
  id: "t231",
  "name": "BIMcollab",
  "slug": "bimcollab",
  logo_url: getLogo("BI"),
  "short_desc": "Issue management and IFC-based clash review across BIM authoring tools.",
  "description": "BIMcollab is a leading issue-management and openBIM clash-review platform — vendor-neutral, BCF 2.1 / 3.0 native, with deep plugins for Revit, ArchiCAD, Tekla, Navisworks, Solibri, and IFC viewers.",
  "country": "Netherlands",
  "category_id": "c3",
  "pricing_type": "Subscription",
  "starting_price": 590,
  "platforms": ["Web", "Windows", "macOS"],
  "industries": ["AEC", "Construction"],

  "core_features": [
    "Cloud-hosted issue tracker with BCF 2.1 / 3.0",
    "Plugins for Revit, ArchiCAD, Tekla, Navisworks, Solibri",
    "BIMcollab ZOOM federated IFC viewer",
    "Smart Views and rules",
    "Clash detection (BIMcollab ZOOM)",
    "REST API and SSO",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.bimcollab.com",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Vendor-neutral BCF workflow",
    "Plugins for every major BIM tool",
    "Strong adoption in European AEC firms",
  ],

  "cons": [
    "Per-project pricing can stack up",
    "Focused on issue/clash — not a full CDE",
    "ZOOM clash detection less powerful than Solibri",
  ],

  "tech_specs": {
    "engine": "BIMcollab cloud + ZOOM viewer",
    "multicore": "Cloud",
    "gpu_optimization": "Yes (ZOOM)",
    "standards": ["BCF 2.1 / 3.0", "IFC"],
  },

  "expert_verdict": "The gold standard for openBIM issue management. Pair with Solibri or ZOOM for clash, and you have a vendor-neutral coordination stack.",
  faqs: [{
    q: 'What is BIMcollab used for?',
    a: 'Issue management and IFC-based clash review across BIM authoring tools. BIMcollab is a BIM solution widely adopted in AEC, Construction.',
  }, {
    q: 'How much does BIMcollab cost?',
    a: 'BIMcollab starts at $590 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of BIMcollab?',
    a: 'BIMcollab is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does BIMcollab support?',
    a: 'BIMcollab runs on Web, Windows, and macOS. The browser-based experience requires no local install.',
  }, {
    q: 'Which file formats does BIMcollab support?',
    a: 'BIMcollab works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to BIMcollab?',
    a: 'The closest alternatives within the BIM space are Autodesk Construction Cloud, Allplan, Revit. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-construction-cloud', 'allplan', 'revit'],
  detailed_features: [],
}, {
  id: "t232",
  "name": "Autodesk Dynamo",
  "slug": "autodesk-dynamo",
  logo_url: getLogo("AD"),
  "short_desc": "Visual programming for Revit and Civil 3D — automation, parametrics, and computational BIM.",
  "description": "Dynamo is the visual programming environment that sits inside Revit and Civil 3D — letting BIM specialists automate repetitive workflows, generate parametric geometry, and access the Revit API without writing C# code.",
  "country": "USA",
  "category_id": "c3",
  "pricing_type": "Free",
  "starting_price": 0,
  "platforms": ["Windows"],
  "industries": ["AEC", "Construction"],

  "core_features": [
    "Visual node-based scripting",
    "Native Revit and Civil 3D APIs exposed",
    "Python and Zero-Touch C# extension",
    "Dynamo Player for non-programmer end-users",
    "Generative Design integration",
    "Active package manager (Dynamo Packages)",
  ],

  "user_scales": ["Freelancer", "SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://dynamobim.org",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Free, included with Revit",
    "Massive package ecosystem (Clockwork, archi-lab, Rhythm)",
    "Bridges design intent to BIM automation without coding",
  ],

  "cons": [
    "Tied to Autodesk products (Revit, Civil 3D)",
    "Performance drops on graphs with thousands of nodes",
    "Steeper learning than it appears — production graphs need Python",
  ],

  "tech_specs": {
    "engine": "DynamoCore",
    "multicore": "Limited",
    "gpu_optimization": "N/A",
    "standards": ["RVT", "DWG", "IFC"],
  },

  "expert_verdict": "Every serious Revit firm runs Dynamo workflows. Free and powerful — there's no reason not to install it.",
  faqs: [{
    q: 'What is Autodesk Dynamo used for?',
    a: 'Visual programming for Revit and Civil 3D — automation, parametrics, and computational BIM. Autodesk Dynamo is a BIM solution widely adopted in AEC, Construction.',
  }, {
    q: 'How much does Autodesk Dynamo cost?',
    a: 'Autodesk Dynamo is completely free for both personal and commercial use. Vendor support and commercial services may be offered separately.',
  }, {
    q: 'Is Autodesk Dynamo really free?',
    a: 'Yes — Autodesk Dynamo is a free product distributed by the vendor. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.',
  }, {
    q: 'What operating systems does Autodesk Dynamo support?',
    a: 'Autodesk Dynamo runs on Windows.',
  }, {
    q: 'Which file formats does Autodesk Dynamo support?',
    a: 'Autodesk Dynamo works with standard BIM interchange formats including IFC, RVT, and DWG. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Autodesk Dynamo?',
    a: 'The closest alternatives within the BIM space are Trimble Connect, BIMcollab, Autodesk Construction Cloud. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['trimble-connect', 'bimcollab', 'autodesk-construction-cloud'],
  detailed_features: [],
}, {
  id: "t233",
  "name": "CSI SAP2000",
  "slug": "sap2000",
  logo_url: getLogo("CS"),
  "short_desc": "General-purpose structural analysis for buildings, bridges, towers, and offshore.",
  "description": "SAP2000 from Computers and Structures Inc is the general-purpose structural analysis tool used across building, bridge, tower, dam, and offshore engineering — paired with ETABS for buildings and CSiBridge for bridges.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Perpetual",
  "starting_price": 2495,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering", "Infrastructure"],

  "core_features": [
    "Linear / non-linear static and dynamic analysis",
    "Response spectrum and time history",
    "Pushover and IDA analyses",
    "Bridge module (precast, segmental, cable-stayed)",
    "Steel, concrete, aluminum, cold-formed design codes",
    "API for VBA / .NET automation",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.csiamerica.com/products/sap2000",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Industry-trusted general analysis tool",
    "Strong bridge / tower / dam coverage",
    "Massive global user base",
  ],

  "cons": [
    "Windows-only",
    "BIM interoperability is improving but trails Tekla/Revit-native tools",
    "GUI is functional but dated",
  ],

  "tech_specs": {
    "engine": "SAP2000 (finite element + frame)",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["AISC", "ACI", "Eurocode", "IS"],
  },

  "expert_verdict": "If a structure isn't a regular building, SAP2000 is the default tool. Bridges, towers, stadium roofs — all routine.",
  faqs: [{
    q: 'What is CSI SAP2000 used for?',
    a: 'General-purpose structural analysis for buildings, bridges, towers, and offshore. CSI SAP2000 is a CAE / CAM solution widely adopted in AEC, Civil Engineering, Infrastructure.',
  }, {
    q: 'How much does CSI SAP2000 cost?',
    a: 'CSI SAP2000 starts at $2,495 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of CSI SAP2000?',
    a: 'CSI SAP2000 is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does CSI SAP2000 support?',
    a: 'CSI SAP2000 runs on Windows.',
  }, {
    q: 'Which file formats does CSI SAP2000 support?',
    a: 'CSI SAP2000 works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to CSI SAP2000?',
    a: 'The closest alternatives within the CAE/CAM space are COMSOL Multiphysics, CSI ETABS, Femap. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['comsol-multiphysics', 'etabs', 'femap'],
  detailed_features: [],
}, {
  id: "t234",
  "name": "CSI ETABS",
  "slug": "etabs",
  logo_url: getLogo("CE"),
  "short_desc": "Building-focused integrated structural analysis and design.",
  "description": "ETABS from CSI is the world's most-used integrated analysis and design tool for buildings — gravity, lateral, seismic, with floor / slab / beam / column design baked into one workflow.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Perpetual",
  "starting_price": 2495,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering"],

  "core_features": [
    "Slab, beam, column, shear-wall integrated design",
    "Linear and non-linear analysis",
    "Pushover, response spectrum, time history",
    "Concrete, steel, composite design codes",
    "Detailing modules for slabs and walls",
    "API for automation",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.csiamerica.com/products/etabs",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Building structural analysis market leader",
    "Slab and lateral system design highly integrated",
    "Strong seismic / response-spectrum tooling",
  ],

  "cons": [
    "Windows-only",
    "Perpetual + annual maintenance is pricey",
    "Less suited to non-building structures (use SAP2000)",
  ],

  "tech_specs": {
    "engine": "ETABS (finite element)",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["ACI", "AISC", "Eurocode", "IS", "ASCE 7"],
  },

  "expert_verdict": "The default structural analysis tool for building engineers. Pair with Tekla or Revit for detailing.",
  faqs: [{
    q: 'What is CSI ETABS used for?',
    a: 'Building-focused integrated structural analysis and design. CSI ETABS is a CAE / CAM solution widely adopted in AEC, Civil Engineering.',
  }, {
    q: 'How much does CSI ETABS cost?',
    a: 'CSI ETABS starts at $2,495 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of CSI ETABS?',
    a: 'CSI ETABS is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does CSI ETABS support?',
    a: 'CSI ETABS runs on Windows.',
  }, {
    q: 'Which file formats does CSI ETABS support?',
    a: 'CSI ETABS works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to CSI ETABS?',
    a: 'The closest alternatives within the CAE/CAM space are COMSOL Multiphysics, CSI SAP2000, Femap. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['comsol-multiphysics', 'sap2000', 'femap'],
  detailed_features: [],
}, {
  id: "t235",
  "name": "Bentley STAAD.Pro",
  "slug": "staad-pro",
  logo_url: getLogo("BS"),
  "short_desc": "Long-running general structural analysis and design — strong in industrial and infrastructure.",
  "description": "STAAD.Pro from Bentley is the original general-purpose structural analysis tool, particularly popular in industrial / power-plant structures, pipe racks, and Asia-region civil engineering.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 3200,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering", "Industrial"],

  "core_features": [
    "Linear / non-linear static and dynamic analysis",
    "Concrete, steel, aluminum, timber design codes",
    "Connection design (STAAD Connection Design)",
    "Foundation design (Footing, Mat, Pile)",
    "BIM interoperability (ISM, IFC)",
    "OpenSTAAD API for automation",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.bentley.com/software/staad-pro/",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Strong industrial / pipe rack pedigree",
    "Wide global code coverage",
    "Included in Bentley ELS bundles",
  ],

  "cons": [
    "Windows-only",
    "UI shows its age",
    "Bentley licensing complexity (CONNECT, ELS)",
  ],

  "tech_specs": {
    "engine": "STAAD.Pro",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["AISC", "ACI", "Eurocode", "IS", "BS"],
  },

  "expert_verdict": "Heavy lifter for industrial structures and Asia-region civil engineering — still going strong after 40 years.",
  faqs: [{
    q: 'What is Bentley STAAD.Pro used for?',
    a: 'Long-running general structural analysis and design — strong in industrial and infrastructure. Bentley STAAD.Pro is a CAE / CAM solution widely adopted in AEC, Civil Engineering, Industrial.',
  }, {
    q: 'How much does Bentley STAAD.Pro cost?',
    a: 'Bentley STAAD.Pro starts at $3,200 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Bentley STAAD.Pro?',
    a: 'Bentley STAAD.Pro is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Bentley STAAD.Pro support?',
    a: 'Bentley STAAD.Pro runs on Windows.',
  }, {
    q: 'Which file formats does Bentley STAAD.Pro support?',
    a: 'Bentley STAAD.Pro works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Bentley STAAD.Pro?',
    a: 'The closest alternatives within the CAE/CAM space are Autodesk Robot Structural Analysis, ANSYS Discovery, Altair Inspire. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['autodesk-robot', 'ansys-discovery', 'altair-inspire'],
  detailed_features: [],
}, {
  id: "t236",
  "name": "Tekla Tedds",
  "slug": "tekla-tedds",
  logo_url: getLogo("TT"),
  "short_desc": "Trimble Tekla Tedds — calculation library and document generator for structural design.",
  "description": "Tekla Tedds is Trimble's library-driven calculation and document-generation tool for structural engineers — pre-built code-compliant calc templates (AISC, ACI, Eurocode, BS) that produce signed, archived design reports.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2400,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering"],

  "core_features": [
    "1,500+ pre-built calculation templates",
    "Concrete, steel, masonry, timber, wind, seismic checks",
    "Custom calc builder",
    "Integration with Tekla Structures and Revit",
    "Word-format design reports",
    "Multi-region code coverage (US, UK, EU, AU, IN)",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://www.tekla.com/products/tekla-tedds",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Eliminates spreadsheet-based design calculations",
    "Auditable, signed PDF / Word output",
    "Active library maintenance for code changes",
  ],

  "cons": [
    "Windows-only",
    "Subscription only",
    "Not an analysis package — pair with ETABS / SAP2000 / Robot",
  ],

  "tech_specs": {
    "engine": "Tedds calculation engine",
    "multicore": "Limited",
    "gpu_optimization": "No",
    "standards": ["AISC", "ACI", "Eurocode", "BS", "AS"],
  },

  "expert_verdict": "Document-quality structural calcs in minutes. Most consulting offices that try Tedds adopt it permanently.",
  faqs: [{
    q: 'What is Tekla Tedds used for?',
    a: 'Trimble Tekla Tedds — calculation library and document generator for structural design. Tekla Tedds is a CAE / CAM solution widely adopted in AEC, Civil Engineering.',
  }, {
    q: 'How much does Tekla Tedds cost?',
    a: 'Tekla Tedds starts at $2,400 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Tekla Tedds?',
    a: 'Tekla Tedds is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Tekla Tedds support?',
    a: 'Tekla Tedds runs on Windows.',
  }, {
    q: 'Which file formats does Tekla Tedds support?',
    a: 'Tekla Tedds works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Tekla Tedds?',
    a: 'The closest alternatives within the CAE/CAM space are RISA-3D, ANSYS Discovery, SimScale. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['risa-3d', 'ansys-discovery', 'simscale'],
  detailed_features: [],
}, {
  id: "t237",
  "name": "Plasticity",
  "slug": "plasticity",
  logo_url: getLogo("PL"),
  "short_desc": "New-generation 3D modeller blending the best of Rhino, Blender, and CAD — Parasolid under the hood.",
  "description": "Plasticity is a young commercial 3D modeller designed for industrial designers and 3D artists who want CAD-quality NURBS surfaces with a modern, Blender-like UX. Parasolid kernel.",
  "country": "USA",
  "category_id": "c2",
  "pricing_type": "Perpetual",
  "starting_price": 149,
  "platforms": ["Windows", "macOS", "Linux"],
  "industries": ["Product Design", "Games", "Industrial Design"],

  "core_features": [
    "Parasolid NURBS kernel",
    "Blender-style hotkey-driven workflow",
    "Solid / surface hybrid modeling",
    "Boolean operations with auto-fillet",
    "STEP, IGES, OBJ, X_T export",
    "Indie license (≤$100k revenue)",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB"],
  "official_url": "https://www.plasticity.xyz",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Fast, modern, hotkey-heavy UX",
    "Real Parasolid for clean STEP/IGES output",
    "Perpetual indie license under $200",
  ],

  "cons": [
    "Young product — feature gaps vs Rhino/Fusion 360",
    "No assembly / drawing modules yet",
    "Smaller community and plugin ecosystem",
  ],

  "tech_specs": {
    "engine": "Parasolid",
    "multicore": "Yes",
    "gpu_optimization": "OpenGL",
    "standards": ["STEP", "IGES", "Parasolid", "OBJ"],
  },

  "expert_verdict": "The most exciting new 3D CAD in years. If you wished Rhino felt more like Blender, Plasticity is for you.",
  faqs: [{
    q: 'What is Plasticity used for?',
    a: 'New-generation 3D modeller blending the best of Rhino, Blender, and CAD — Parasolid under the hood. Plasticity is a 3D modeling solution widely adopted in Product Design, Games, Industrial Design.',
  }, {
    q: 'How much does Plasticity cost?',
    a: 'Plasticity starts at $149 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Plasticity?',
    a: 'Plasticity is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Plasticity support?',
    a: 'Plasticity runs on Windows, macOS, and Linux.',
  }, {
    q: 'Which file formats does Plasticity support?',
    a: 'Plasticity works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Plasticity?',
    a: 'The closest alternatives within the 3D Modeling space are MoI3D, Alibre Design, ZW3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['moi3d', 'alibre-design', 'zw3d'],
  detailed_features: [],
}, {
  id: "t238",
  "name": "MoI3D",
  "slug": "moi3d",
  logo_url: getLogo("MO"),
  "short_desc": "Moment of Inspiration — lightweight NURBS modeller beloved for fast concept design.",
  "description": "MoI3D (Moment of Inspiration) is a long-running solo-developer NURBS modeller — drawn from the same lineage as Rhino but with a famously elegant, simple UI focused on rapid concept modeling.",
  "country": "USA",
  "category_id": "c2",
  "pricing_type": "Perpetual",
  "starting_price": 295,
  "platforms": ["Windows", "macOS"],
  "industries": ["Product Design", "Industrial Design", "Games"],

  "core_features": [
    "NURBS solid and surface modeling",
    "Pen-tablet friendly UI",
    "Excellent quad-mesh export for 3D printing / games",
    "Boolean operations",
    "Curve and surface manipulation",
    "Robust STEP, IGES, OBJ, 3DM export",
  ],

  "user_scales": ["Hobbyist", "Freelancer", "SMB"],
  "official_url": "https://moi3d.com",
  "affiliate_url": null,
  "score": 4.3,

  "pros": [
    "Famously elegant, simple UI",
    "Perpetual license at $295",
    "Best NURBS-to-quad-mesh export in the industry",
  ],

  "cons": [
    "Slow release pace (solo developer)",
    "No assemblies / drawings / parametric history",
    "Smaller user base than Rhino",
  ],

  "tech_specs": {
    "engine": "MoI / SMLib",
    "multicore": "Limited",
    "gpu_optimization": "OpenGL",
    "standards": ["STEP", "IGES", "OBJ", "3DM"],
  },

  "expert_verdict": "The thinking person's NURBS sketchpad. Many product designers keep MoI installed alongside Rhino just for its concept-modeling speed.",
  faqs: [{
    q: 'What is MoI3D used for?',
    a: 'Moment of Inspiration — lightweight NURBS modeller beloved for fast concept design. MoI3D is a 3D modeling solution widely adopted in Product Design, Industrial Design, Games.',
  }, {
    q: 'How much does MoI3D cost?',
    a: 'MoI3D starts at $295 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of MoI3D?',
    a: 'MoI3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does MoI3D support?',
    a: 'MoI3D runs on Windows and macOS.',
  }, {
    q: 'Which file formats does MoI3D support?',
    a: 'MoI3D works with standard 3D modeling interchange formats including STEP, IGES, STL, and Parasolid. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to MoI3D?',
    a: 'The closest alternatives within the 3D Modeling space are Plasticity, Alibre Design, ZW3D. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['plasticity', 'alibre-design', 'zw3d'],
  detailed_features: [],
}, {
  id: "t239",
  "name": "Carlson Survey",
  "slug": "carlson-survey",
  logo_url: getLogo("CS"),
  "short_desc": "Field-to-finish surveying software running on AutoCAD or IntelliCAD.",
  "description": "Carlson Survey is the field-to-finish surveying CAD popular with US land surveyors — runs on AutoCAD or the bundled IntelliCAD engine, with strong total-station, GNSS, and data-collector integration.",
  "country": "USA",
  "category_id": "c7",
  "pricing_type": "Perpetual",
  "starting_price": 1995,
  "platforms": ["Windows"],
  "industries": ["Civil Engineering", "Surveying", "Land Development"],

  "core_features": [
    "AutoCAD or embedded IntelliCAD",
    "Field-to-finish processing",
    "GNSS and total-station support",
    "Carlson SurvCE data collector integration",
    "Roading and earthwork modules",
    "Drone / point-cloud processing add-ons",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://www.carlsonsw.com/products/survey/",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Field-tested workflow for US land surveying",
    "Perpetual licensing still available",
    "Strong SurvCE data collector ecosystem",
  ],

  "cons": ["Windows-only", "UI is utilitarian", "Niche outside North America"],

  "tech_specs": {
    "engine": "AutoCAD or IntelliCAD",
    "multicore": "Limited",
    "gpu_optimization": "Basic",
    "standards": ["DWG", "LandXML", "DXF"],
  },

  "expert_verdict": "If you do small-to-mid US land surveying, Carlson Survey + SurvCE is the workflow that just works.",
  faqs: [{
    q: 'What is Carlson Survey used for?',
    a: 'Field-to-finish surveying software running on AutoCAD or IntelliCAD. Carlson Survey is a visualization and rendering solution widely adopted in Civil Engineering, Surveying, Land Development.',
  }, {
    q: 'How much does Carlson Survey cost?',
    a: 'Carlson Survey starts at $1,995 per seat on a perpetual license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Carlson Survey?',
    a: 'Carlson Survey is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Carlson Survey support?',
    a: 'Carlson Survey runs on Windows.',
  }, {
    q: 'Which file formats does Carlson Survey support?',
    a: 'Carlson Survey works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Carlson Survey?',
    a: 'The closest alternatives within the Specialized space are RhinoGold, PC SCHEMATIC Automation, JewelCAD Pro. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['rhinogold', 'pc-schematic', 'jewelcad-pro'],
  detailed_features: [],
}, {
  id: "t240",
  "name": "Trimble Business Center",
  "slug": "trimble-business-center",
  logo_url: getLogo("TB"),
  "short_desc": "Office software for processing survey, GIS, and construction-layout field data.",
  "description": "Trimble Business Center (TBC) is the office-side companion to Trimble field instruments — processes GNSS, total-station, scanner, and UAV data into deliverables for survey, GIS, and construction-layout workflows.",
  "country": "USA",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 2400,
  "platforms": ["Windows"],
  "industries": ["Civil Engineering", "Surveying", "Construction"],

  "core_features": [
    "GNSS baseline processing",
    "Total-station and level data reduction",
    "Point-cloud (Trimble SX / scanner) processing",
    "UAV photogrammetry",
    "Construction stake-out reports",
    "LandXML / IFC / DWG / DXF export",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://geospatial.trimble.com/en/products/software/trimble-business-center",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Best-in-class GNSS post-processing",
    "Multi-source field data fusion (GNSS, TS, scanner, UAV)",
    "Tight integration with Trimble field controllers",
  ],

  "cons": [
    "Windows-only",
    "Subscription pricing",
    "Most valuable when your field hardware is also Trimble",
  ],

  "tech_specs": {
    "engine": "Trimble Business Center",
    "multicore": "Yes",
    "gpu_optimization": "Yes",
    "standards": ["LandXML", "IFC", "DWG", "DXF", "LAS"],
  },

  "expert_verdict": "The default office solution for surveyors who shoot with Trimble. Stays relevant as field tech keeps evolving.",
  faqs: [{
    q: 'What is Trimble Business Center used for?',
    a: 'Office software for processing survey, GIS, and construction-layout field data. Trimble Business Center is a visualization and rendering solution widely adopted in Civil Engineering, Surveying, Construction.',
  }, {
    q: 'How much does Trimble Business Center cost?',
    a: 'Trimble Business Center starts at $2,400 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Trimble Business Center?',
    a: 'Trimble Business Center is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Trimble Business Center support?',
    a: 'Trimble Business Center runs on Windows.',
  }, {
    q: 'Which file formats does Trimble Business Center support?',
    a: 'Trimble Business Center works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Trimble Business Center?',
    a: 'The closest alternatives within the Specialized space are Browzwear, Marvelous Designer, V-Ray. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['browzwear', 'marvelous-designer', 'v-ray'],
  detailed_features: [],
}, {
  id: "t241",
  "name": "Leica Cyclone",
  "slug": "leica-cyclone",
  logo_url: getLogo("LC"),
  "short_desc": "Leica's flagship terrestrial laser scanning point-cloud processing software.",
  "description": "Leica Cyclone is Hexagon's flagship reality-capture software — terrestrial laser scan registration, point-cloud processing, modeling, and deliverable production for AEC and as-built workflows.",
  "country": "Switzerland",
  "category_id": "c7",
  "pricing_type": "Subscription",
  "starting_price": 6000,
  "platforms": ["Windows"],
  "industries": ["AEC", "Surveying", "Construction"],

  "core_features": [
    "Cloud-to-Cloud, Visual, Target registration",
    "TruView and JetStream web/desktop viewers",
    "Cyclone 3DR modeling and analysis",
    "Plant 3D and Revit publishers",
    "Cyclone Field for in-field scanning",
    "Photogrammetry fusion (Leica BLK)",
  ],

  "user_scales": ["Mid-Market", "Enterprise"],
  "official_url": "https://leica-geosystems.com/products/laser-scanners/software/leica-cyclone",
  "affiliate_url": null,
  "score": 4.5,

  "pros": [
    "Industry default for terrestrial laser scan processing",
    "Mature publishers to Revit / Plant 3D / Navisworks",
    "Strong Leica BLK / RTC360 integration",
  ],

  "cons": [
    "Windows-only",
    "Best ROI when paired with Leica scanners",
    "Subscription pricing is enterprise-tier",
  ],

  "tech_specs": {
    "engine": "Cyclone",
    "multicore": "Yes",
    "gpu_optimization": "Yes",
    "standards": ["E57", "LAS", "PTS", "IFC"],
  },

  "expert_verdict": "The reality-capture office software the as-built world runs on. Pair with BLK / RTC360 for a complete scan-to-BIM workflow.",
  faqs: [{
    q: 'What is Leica Cyclone used for?',
    a: 'Leica\'s flagship terrestrial laser scanning point-cloud processing software. Leica Cyclone is a visualization and rendering solution widely adopted in AEC, Surveying, Construction.',
  }, {
    q: 'How much does Leica Cyclone cost?',
    a: 'Leica Cyclone starts at $6,000 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Leica Cyclone?',
    a: 'Leica Cyclone is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Leica Cyclone support?',
    a: 'Leica Cyclone runs on Windows.',
  }, {
    q: 'Which file formats does Leica Cyclone support?',
    a: 'Leica Cyclone works with standard visualization and rendering interchange formats including FBX, OBJ, glTF, and USD. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Leica Cyclone?',
    a: 'The closest alternatives within the Specialized space are Infraworks, 3ds Max, ZBrush. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['infraworks', '3ds-max', 'zbrush'],
  detailed_features: [],
}, {
  id: "t242",
  "name": "Autodesk Robot Structural Analysis",
  "slug": "autodesk-robot",
  logo_url: getLogo("AR"),
  "short_desc": "Autodesk's general structural analysis tool, tightly linked to Revit for BIM-driven workflows.",
  "description": "Robot Structural Analysis Professional is Autodesk's general-purpose FEA tool for buildings, bridges, and civil structures with first-class bidirectional Revit interoperability via the Robot link.",
  "country": "France",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2615,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering"],

  "core_features": [
    "Linear and non-linear analysis",
    "Reinforced concrete and steel design",
    "Bi-directional Revit link",
    "Multi-region code coverage (Eurocode, AISC, ACI, BS)",
    "Dynamic, modal, and seismic analyses",
    "Wind tunnel simulation add-on",
  ],

  "user_scales": ["SMB", "Mid-Market", "Enterprise"],
  "official_url": "https://www.autodesk.com/products/robot-structural-analysis",
  "affiliate_url": null,
  "score": 4.2,

  "pros": [
    "Native Revit integration is industry-leading",
    "Included in AEC Collection bundling",
    "Good multi-region code library",
  ],

  "cons": [
    "Less polished than ETABS / SAP2000 for stand-alone analysis",
    "Windows-only",
    "Autodesk has reduced visible investment in recent years",
  ],

  "tech_specs": {
    "engine": "Robot solver",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["Eurocode", "AISC", "ACI", "BS"],
  },

  "expert_verdict": "The default structural analysis tool for Revit-centric firms — convenience trumps analytical depth.",
  faqs: [{
    q: 'What is Autodesk Robot Structural Analysis used for?',
    a: 'Autodesk\'s general structural analysis tool, tightly linked to Revit for BIM-driven workflows. Autodesk Robot Structural Analysis is a CAE / CAM solution widely adopted in AEC, Civil Engineering.',
  }, {
    q: 'How much does Autodesk Robot Structural Analysis cost?',
    a: 'Autodesk Robot Structural Analysis starts at $2,615 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of Autodesk Robot Structural Analysis?',
    a: 'Autodesk Robot Structural Analysis is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does Autodesk Robot Structural Analysis support?',
    a: 'Autodesk Robot Structural Analysis runs on Windows.',
  }, {
    q: 'Which file formats does Autodesk Robot Structural Analysis support?',
    a: 'Autodesk Robot Structural Analysis works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to Autodesk Robot Structural Analysis?',
    a: 'The closest alternatives within the CAE/CAM space are Bentley STAAD.Pro, ANSYS Discovery, Altair Inspire. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['staad-pro', 'ansys-discovery', 'altair-inspire'],
  detailed_features: [],
}, {
  id: "t243",
  "name": "IDEA StatiCa",
  "slug": "idea-statica",
  logo_url: getLogo("IS"),
  "short_desc": "Steel and concrete connection design with the CBFEM method.",
  "description": "IDEA StatiCa is the leading connection-design tool for steel and concrete — its CBFEM (Component-Based Finite Element Method) lets engineers analyse arbitrarily complex connections that would be infeasible with classical hand methods.",
  "country": "Czech Republic",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2300,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering"],

  "core_features": [
    "CBFEM (Component-Based FEM) for connections",
    "Steel, concrete, and composite member checks",
    "Detail (D-region) concrete analysis",
    "Bidirectional links to Tekla, Revit, Advance Steel, ETABS, SAP2000",
    "EN, AISC, CISC, AS, IS code checks",
    "API for automation",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://www.ideastatica.com",
  "affiliate_url": null,
  "score": 4.6,

  "pros": [
    "Best-in-class connection design",
    "CBFEM is rapidly becoming the industry standard",
    "Wide BIM / FEA interoperability",
  ],

  "cons": [
    "Windows-only",
    "Subscription only",
    "Requires Tekla / Revit / FEA link for full productivity",
  ],

  "tech_specs": {
    "engine": "CBFEM",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["EN", "AISC", "CISC", "AS", "IS"],
  },

  "expert_verdict": "Has reshaped how the structural-steel industry designs connections. Talk to any modern fabricator — they have it installed.",
  faqs: [{
    q: 'What is IDEA StatiCa used for?',
    a: 'Steel and concrete connection design with the CBFEM method. IDEA StatiCa is a CAE / CAM solution widely adopted in AEC, Civil Engineering.',
  }, {
    q: 'How much does IDEA StatiCa cost?',
    a: 'IDEA StatiCa starts at $2,300 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of IDEA StatiCa?',
    a: 'IDEA StatiCa is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does IDEA StatiCa support?',
    a: 'IDEA StatiCa runs on Windows.',
  }, {
    q: 'Which file formats does IDEA StatiCa support?',
    a: 'IDEA StatiCa works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to IDEA StatiCa?',
    a: 'The closest alternatives within the CAE/CAM space are ANSYS Discovery, SimScale, Altair Inspire. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['ansys-discovery', 'simscale', 'altair-inspire'],
  detailed_features: [],
}, {
  id: "t244",
  "name": "RISA-3D",
  "slug": "risa-3d",
  logo_url: getLogo("R3"),
  "short_desc": "Building-focused structural analysis from RISA Tech, popular with US consulting offices.",
  "description": "RISA-3D is RISA Tech's general 3D structural analysis tool — popular with North American consulting offices for everyday building, industrial, and component analyses, with strong concrete, steel, masonry, wood, and cold-formed checks.",
  "country": "USA",
  "category_id": "c5",
  "pricing_type": "Subscription",
  "starting_price": 2200,
  "platforms": ["Windows"],
  "industries": ["AEC", "Civil Engineering"],

  "core_features": [
    "Linear and P-Delta analysis",
    "Concrete (ACI), steel (AISC), wood (NDS), masonry (TMS) checks",
    "RISAFloor integration for gravity systems",
    "Cold-formed steel and aluminum design",
    "RISA-3D Educational free version",
    "API and import from Revit",
  ],

  "user_scales": ["SMB", "Mid-Market"],
  "official_url": "https://risa.com/products/risa-3d",
  "affiliate_url": null,
  "score": 4.4,

  "pros": [
    "Excellent fit for typical North American consulting workflows",
    "Strong wood and cold-formed steel modules",
    "Approachable UI for non-specialists",
  ],

  "cons": [
    "Windows-only",
    "Smaller global footprint outside North America",
    "Less suited to large infrastructure than SAP2000 / STAAD",
  ],

  "tech_specs": {
    "engine": "RISA solver",
    "multicore": "Yes",
    "gpu_optimization": "No",
    "standards": ["AISC", "ACI", "NDS", "TMS"],
  },

  "expert_verdict": "An everyday workhorse for North American building engineers. Pair with RISAFloor for full gravity-and-lateral workflows.",
  faqs: [{
    q: 'What is RISA-3D used for?',
    a: 'Building-focused structural analysis from RISA Tech, popular with US consulting offices. RISA-3D is a CAE / CAM solution widely adopted in AEC, Civil Engineering.',
  }, {
    q: 'How much does RISA-3D cost?',
    a: 'RISA-3D starts at $2,200 per seat on a subscription license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.',
  }, {
    q: 'Is there a free version of RISA-3D?',
    a: 'RISA-3D is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.',
  }, {
    q: 'What operating systems does RISA-3D support?',
    a: 'RISA-3D runs on Windows.',
  }, {
    q: 'Which file formats does RISA-3D support?',
    a: 'RISA-3D works with standard CAE / CAM interchange formats including STEP, IGES, and native NC formats. Check the vendor\'s official documentation for the complete list of supported import and export options.',
  }, {
    q: 'What are the best alternatives to RISA-3D?',
    a: 'The closest alternatives within the CAE/CAM space are Tekla Tedds, ANSYS Discovery, SimScale. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.',
  }],
  alternatives: ['tekla-tedds', 'ansys-discovery', 'simscale'],
  detailed_features: [],
}];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categoryId: string) {
  return tools.filter((tool) => tool.category_id === categoryId);
}
