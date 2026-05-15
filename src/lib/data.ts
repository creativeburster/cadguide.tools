export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type PricingType =
  | "Free"
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

const genericFaqs = (name: string) => [
  {
    q: `Is ${name} suitable for professional work?`,
    a: `Yes, ${name} is widely used in its respective industry by professionals.`,
  },
  {
    q: `What are the system requirements for ${name}?`,
    a: `It typically requires a modern multi-core processor, 8GB+ RAM, and a dedicated graphics card.`,
  },
  {
    q: `Does ${name} support DWG files?`,
    a: `Many professional CAD tools support DWG, but you should check specific import/export capabilities.`,
  },
  {
    q: `Is there a free trial for ${name}?`,
    a: `Most professional software offers a 15-30 day free trial on their official website.`,
  },
  {
    q: `Where can I find tutorials for ${name}?`,
    a: `YouTube, Udemy, and the official vendor documentation are great starting points.`,
  },
  {
    q: `Can ${name} run on a laptop?`,
    a: `Yes, provided it meets the hardware specifications for 3D rendering and processing.`,
  },
];

export const tools: Tool[] = [
  {
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
    faqs: genericFaqs("AutoCAD"),

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
  },
  {
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

    alternatives: ["autodesk-inventor", "solidedge", "onshape"],
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
    faqs: genericFaqs("SolidWorks"),

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
  },
  {
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
    faqs: genericFaqs("SketchUp"),

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
  },
  {
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
    faqs: genericFaqs("Revit"),

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
  },
  {
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
    faqs: genericFaqs("Fusion 360"),

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
  },
  {
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
    faqs: genericFaqs("Rhino 3D"),

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
  },
  {
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
    faqs: genericFaqs("CATIA"),

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
  },
  {
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
    faqs: genericFaqs("Siemens NX"),

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
  },
  {
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

    alternatives: ["revit", "vectorworks", "archicad"],
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
    faqs: genericFaqs("ArchiCAD"),

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
  },
  {
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

    alternatives: ["eagle", "kicad", "orcad"],
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
    faqs: genericFaqs("Altium Designer"),

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
  },
  {
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
    faqs: genericFaqs("FreeCAD"),

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
  },
  {
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
    faqs: genericFaqs("ZWCAD"),

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
  },
  {
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
    faqs: genericFaqs("BricsCAD"),

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
  },
  {
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
    faqs: genericFaqs("Onshape"),

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
  },
  {
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
    alternatives: ["revit", "allplan", "tekla-structures"],
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
    faqs: genericFaqs("Tekla Structures"),
    tech_specs: {
      engine: "Trimble Structural Core",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["IFC", "STEP", "XML", "CIS/2"],
    },
    expert_verdict: "The choice for massive steel stadiums and complex plants.",
  },
  {
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
    faqs: genericFaqs("Solid Edge"),
    tech_specs: {
      engine: "Siemens Parasolid",
      multicore: "Moderate",
      gpu_optimization: "OpenGL",
      standards: ["PAR", "STEP", "IGES", "JT"],
    },
    expert_verdict: "Solid Edge is the 'thinking man's' SolidWorks.",
  },
  {
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
    faqs: genericFaqs("Vectorworks"),
    tech_specs: {
      engine: "Siemens Parasolid",
      multicore: "High",
      gpu_optimization: "Metal / DirectX",
      standards: ["IFC", "DWG", "RVV", "OBJ"],
    },
    expert_verdict:
      "If you work in landscape or lighting design, Vectorworks is the standard.",
  },
  {
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
    faqs: genericFaqs("Autodesk Inventor"),

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
  },
  {
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
    faqs: genericFaqs("MicroStation"),
    tech_specs: {
      engine: "Bentley Graphics Engine",
      multicore: "High",
      gpu_optimization: "High",
      standards: ["DGN", "DWG", "IFC", "STEP"],
    },
    expert_verdict: "MicroStation is for infrastructure giants.",
  },
  {
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
    faqs: genericFaqs("DraftSight"),
    tech_specs: {
      engine: "ARES",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["DWG", "DXF", "PDF"],
    },
    expert_verdict:
      "The most 'professional' AutoCAD clone. Perfect companion for SolidWorks users.",
  },
  {
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
    faqs: genericFaqs("PTC Creo"),

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
  },
  {
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
    alternatives: ["freecad", "openscad", "solvespace"],
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
    faqs: genericFaqs("OpenSCAD"),
    tech_specs: {
      engine: "CGAL / OpenCSG",
      multicore: "Low",
      gpu_optimization: "None",
      standards: ["STL", "OFF", "AMF", "CSG"],
    },
    expert_verdict:
      "OpenSCAD is the ultimate tool for engineers who think in code.",
  },
  {
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
    faqs: genericFaqs("Shapr3D"),
    tech_specs: {
      engine: "Siemens Parasolid",
      multicore: "Moderate",
      gpu_optimization: "Metal / DirectX",
      standards: ["STEP", "IGES", "XT", "STL"],
    },
    expert_verdict:
      "Shapr3D has done the impossible: made professional CAD fun.",
  },
  {
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
    faqs: genericFaqs("Chief Architect"),
    tech_specs: {
      engine: "Chief Custom AEC Engine",
      multicore: "High",
      gpu_optimization: "DirectX / Metal",
      standards: ["DWG", "DXF", "OBJ", "SKP"],
    },
    expert_verdict: "If you build houses, buy Chief Architect.",
  },
  {
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
    alternatives: ["mastercam", "solidcam", "fusion-360"],
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
    faqs: genericFaqs("Mastercam"),
    tech_specs: {
      engine: "Mastercam Custom CAM",
      multicore: "Excellent",
      gpu_optimization: "High",
      standards: ["STEP", "IGES", "Parasolid", "DWG"],
    },
    expert_verdict: "The 'gold standard' for the professional machine shop.",
  },
  {
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
    alternatives: ["freecad", "openscad", "solvespace"],
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
    faqs: genericFaqs("SolveSpace"),
    tech_specs: {
      engine: "SolveSpace Custom Solver",
      multicore: "Low",
      gpu_optimization: "None",
      standards: ["STEP", "STL", "DXF"],
    },
    expert_verdict: "A masterclass in minimalist parametric design.",
  },
  {
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
    alternatives: ["solidworks", "solidedge", "alibre-design"],
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
    faqs: genericFaqs("Alibre Design"),
    tech_specs: {
      engine: "ACIS",
      multicore: "Moderate",
      gpu_optimization: "DirectX",
      standards: ["STEP", "IGES", "SAT", "STL"],
    },
    expert_verdict: "No mandatory subscriptions, just solid parametric tools.",
  },
  {
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
    alternatives: ["ntop", "ansys-mechanical", "siemens-nx"],
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
    faqs: genericFaqs("nTop"),
    tech_specs: {
      engine: "nTop Implicit Engine",
      multicore: "Excellent",
      gpu_optimization: "NVIDIA CUDA / Optix",
      standards: ["STEP", "STL", "3MF", "Parasolid"],
    },
    expert_verdict: "The future of advanced manufacturing design.",
  },
  {
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
    faqs: genericFaqs("SolidCAM"),
    tech_specs: {
      engine: "SolidCAM Machining",
      multicore: "Excellent",
      gpu_optimization: "Moderate",
      standards: ["STEP", "SolidWorks Native"],
    },
    expert_verdict: "iMachining is literal magic for CNC shops.",
  },
  {
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
    alternatives: ["bluebeam-revu", "navisworks", "solibri"],
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
    faqs: genericFaqs("Bluebeam Revu"),
    tech_specs: {
      engine: "Bluebeam Rendering",
      multicore: "High",
      gpu_optimization: "Hardware Acceleration",
      standards: ["PDF", "IFC"],
    },
    expert_verdict:
      "You cannot run a modern construction project without Bluebeam.",
  },
  {
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
    alternatives: ["navisworks", "solibri", "bluebeam-revu"],
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
    faqs: genericFaqs("Navisworks"),
    tech_specs: {
      engine: "Autodesk Navisworks",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["NWD", "NWC", "IFC"],
    },
    expert_verdict:
      "Navisworks is where Virtual Design and Construction happens.",
  },
  {
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
    alternatives: ["navisworks", "solibri", "revizto"],
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
    faqs: genericFaqs("Solibri"),
    tech_specs: {
      engine: "Solibri IFC Engine",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["IFC", "BCF", "DWG"],
    },
    expert_verdict: "Solibri finds logical errors that other tools miss.",
  },
  {
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
    alternatives: ["meshlab", "magics", "blender"],
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
    faqs: genericFaqs("MeshLab"),
    tech_specs: {
      engine: "VCG Library",
      multicore: "Low",
      gpu_optimization: "OpenGL",
      standards: ["OBJ", "STL", "PLY"],
    },
    expert_verdict:
      "The 'Photoshop' of 3D meshes, with the UX of a science experiment.",
  },
  {
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
    alternatives: ["magics", "meshlab", "netfabb"],
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
    faqs: genericFaqs("Magics"),
    tech_specs: {
      engine: "Materialise Geometric Engine",
      multicore: "High",
      gpu_optimization: "High",
      standards: ["STL", "3MF", "STEP"],
    },
    expert_verdict:
      "Magics is the industrial benchmark for fixable unprintable meshes.",
  },
  {
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
    alternatives: ["recap-pro", "meshlab", "cyclone"],
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
    faqs: genericFaqs("Recap Pro"),
    tech_specs: {
      engine: "Autodesk Reality",
      multicore: "Excellent",
      gpu_optimization: "High",
      standards: ["RCP", "RCS", "E57"],
    },
    expert_verdict: "The gateway to reality capture in the BIM world.",
  },
  {
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
    alternatives: ["opencascade", "freecad", "parasolid"],
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
    faqs: genericFaqs("OpenCASCADE"),
    tech_specs: {
      engine: "OpenCASCADE Kernel",
      multicore: "High",
      gpu_optimization: "Customizable",
      standards: ["STEP", "IGES", "B-Rep"],
    },
    expert_verdict: "The most important open-source project in CAD history.",
  },
  {
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
    alternatives: ["varicad", "freecad", "solidworks"],
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
    faqs: genericFaqs("VariCAD"),
    tech_specs: {
      engine: "VariCAD Custom",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["STEP", "IGES", "STL"],
    },
    expert_verdict:
      "A robust choice for individual mechanical engineers on Linux.",
  },
  {
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
    alternatives: ["eagle", "kicad", "altium"],
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
    faqs: genericFaqs("Eagle"),
    tech_specs: {
      engine: "EAGLE Core",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["Gerber", "STEP", "IPC"],
    },
    expert_verdict: "The standard for mid-level professional PCB design.",
  },
  {
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
    faqs: genericFaqs("CADra"),
    tech_specs: {
      engine: "Custom",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["DWG", "DXF"],
    },
    expert_verdict: "A specialized tool for manufacturing automation.",
  },
  {
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
    faqs: genericFaqs("Civil 3D"),

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
  },
  {
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
    faqs: genericFaqs("Chief Architect Pro"),

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
  },
  {
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
    faqs: genericFaqs("Solid Edge Viewer"),
    tech_specs: {
      engine: "Siemens JT",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["PAR", "ASM", "DWG"],
    },
    expert_verdict: "The standard for viewing Solid Edge data in production.",
  },
  {
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
    faqs: genericFaqs("DWG TrueView"),
    tech_specs: {
      engine: "AutoCAD Core",
      multicore: "Low",
      gpu_optimization: "DirectX",
      standards: ["DWG", "DXF"],
    },
    expert_verdict: "The essential utility for DWG version management.",
  },
  {
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
    faqs: genericFaqs("Maya"),

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
  },
  {
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
    faqs: genericFaqs("Blender"),

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
  },
  {
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
    faqs: genericFaqs("SolveSpace Pro"),
    tech_specs: {
      engine: "Custom",
      multicore: "Low",
      gpu_optimization: "None",
      standards: ["STEP", "STL", "DXF"],
    },
    expert_verdict:
      "The ultimate tool for engineers who value geometric purity.",
  },
  {
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
    faqs: genericFaqs("DWG FastView"),

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
  },
  {
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
    faqs: genericFaqs("GstarCAD"),

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
  },
  {
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
    faqs: genericFaqs("QCAD"),
    tech_specs: {
      engine: "Qt/QCAD",
      multicore: "Low",
      gpu_optimization: "None",
      standards: ["DXF", "DWG", "SVG"],
    },
    expert_verdict:
      "The go-to choice for cross-platform 2D drafting without the overhead of modern CAD bloat.",
  },
  {
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
    faqs: genericFaqs("nanoCAD"),
    tech_specs: {
      engine: "nanoCAD Core",
      multicore: "High",
      gpu_optimization: "DirectX/OpenGL",
      standards: ["DWG", "IFC", "PDF"],
    },
    expert_verdict:
      "A formidable contender in the professional CAD market with one of the most flexible APIs available.",
  },
  {
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
    faqs: genericFaqs("progeCAD"),
    tech_specs: {
      engine: "IntelliCAD",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["DWG", "PDF", "DXF"],
    },
    expert_verdict:
      "The Swiss army knife of CAD clones, offering more utilities out-of-the-box than AutoCAD.",
  },
  {
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
    faqs: genericFaqs("IronCAD"),

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
  },
  {
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
    faqs: genericFaqs("KeyCreator"),
    tech_specs: {
      engine: "Proprietary Direct",
      multicore: "Moderate",
      gpu_optimization: "Moderate",
      standards: ["STEP", "IGES", "STL"],
    },
    expert_verdict:
      "The absolute best tool for engineers who need to fix 'broken' geometry from other systems.",
  },
  {
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
    faqs: genericFaqs("LibreCAD"),

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
  },
  {
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
    faqs: genericFaqs("CADopia"),
    tech_specs: {
      engine: "ARES",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["DWG", "DXF", "DWT"],
    },
    expert_verdict:
      "A solid, stable choice for firms that want a 'set it and forget it' 2D/3D solution.",
  },
  {
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
    faqs: genericFaqs("TurboCAD"),
    tech_specs: {
      engine: "ACIS & D-Cube",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["DWG", "SKP", "IFC"],
    },
    expert_verdict:
      "The most versatile all-rounder in the mid-range CAD market.",
  },
  {
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
    faqs: genericFaqs("EPLAN"),

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
  },
  {
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
    faqs: genericFaqs("PC SCHEMATIC"),
    tech_specs: {
      engine: "Custom",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["IEC 61346", "EN 81346"],
    },
    expert_verdict:
      "The most efficient alternative to EPLAN for small to mid-sized automation firms.",
  },
  {
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
    faqs: genericFaqs("MatrixGold"),

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
  },
  {
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
    faqs: genericFaqs("exocad"),

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
  },
  {
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
    faqs: genericFaqs("Cabinet Vision"),
    tech_specs: {
      engine: "Proprietary",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["DXF", "G-Code"],
    },
    expert_verdict: "The backbone of any modern professional woodworking shop.",
  },
  {
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
    faqs: genericFaqs("AVEVA Marine"),
    tech_specs: {
      engine: "AVEVA E3D",
      multicore: "Ultra",
      gpu_optimization: "High",
      standards: ["STEP", "IFC", "SAT"],
    },
    expert_verdict: "The undisputed king of heavy-duty maritime engineering.",
  },
  {
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
    faqs: genericFaqs("CLO 3D"),

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
  },
  {
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
    faqs: genericFaqs("Vectorworks Landmark"),
    tech_specs: {
      engine: "Parasolid",
      multicore: "High",
      gpu_optimization: "High",
      standards: ["IFC", "DWG", "Shapefile"],
    },
    expert_verdict:
      "The undisputed gold standard for professional landscape architecture.",
  },
  {
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
    faqs: genericFaqs("Shoemaster"),
    tech_specs: {
      engine: "Proprietary",
      multicore: "Moderate",
      gpu_optimization: "Basic",
      standards: ["DXF", "STL"],
    },
    expert_verdict: "Essential software for global footwear production lines.",
  },
  {
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
    faqs: genericFaqs("VISI Modelling"),
    tech_specs: {
      engine: "Parasolid",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["STEP", "IGES", "X_T"],
    },
    expert_verdict:
      "If you are making plastic injection molds, VISI is your best friend.",
  },
  {
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
    faqs: genericFaqs("WYSIWYG"),
    tech_specs: {
      engine: "Cast Core",
      multicore: "High",
      gpu_optimization: "Ultra",
      standards: ["DWG", "OBJ", "SKP"],
    },
    expert_verdict:
      "The only software you need to design and pre-program a world-class concert.",
  },
  {
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
    faqs: genericFaqs("3Design"),
    tech_specs: {
      engine: "Proprietary Parametric",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["STL", "OBJ", "3DM"],
    },
    expert_verdict:
      "The serious alternative to MatrixGold for those who prefer Mac or true parametric history.",
  },
  {
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
    faqs: genericFaqs("Geomagic Design X"),
    tech_specs: {
      engine: "Parasolid",
      multicore: "High",
      gpu_optimization: "Ultra",
      standards: ["STEP", "IGES", "STL"],
    },
    expert_verdict:
      "The professional standard for turning physical objects into digital CAD data.",
  },
  {
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
    faqs: genericFaqs("Alias AutoStudio"),
    tech_specs: {
      engine: "Alias Core",
      multicore: "High",
      gpu_optimization: "Ultra",
      standards: ["STEP", "IGES", "VDAFS"],
    },
    expert_verdict:
      "The software behind almost every beautiful car you see on the road.",
  },
  {
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
    faqs: genericFaqs("Cimatron"),
    tech_specs: {
      engine: "Parasolid",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["STEP", "IGES", "DXF"],
    },
    expert_verdict:
      "A robust, battle-tested workhorse for the precision tooling industry.",
  },
  {
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
    faqs: genericFaqs("Land F/X"),
    tech_specs: {
      engine: "AutoCAD + Custom",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["DWG", "CSV"],
    },
    expert_verdict:
      "The essential multiplier for landscape architects who use AutoCAD.",
  },
  {
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
    faqs: genericFaqs("ICAD3D+"),
    tech_specs: {
      engine: "Proprietary 3D",
      multicore: "Moderate",
      gpu_optimization: "High",
      standards: ["DXF", "STL", "IGES"],
    },
    expert_verdict:
      "The most modern 3D alternative for footwear professionals.",
  },
  {
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
    faqs: genericFaqs("ANSYS Mechanical"),

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
  },
  {
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
    faqs: genericFaqs("MSC Nastran"),

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
  },
  {
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
    faqs: genericFaqs("Altair HyperWorks"),

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
  },
  {
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
    faqs: genericFaqs("ESI Visual-Environment"),
    tech_specs: {
      engine: "PAM-CRASH Solver",
      multicore: "Ultra",
      gpu_optimization: "High",
      standards: ["STEP", "IGES", "LS-DYNA", "Nastran"],
    },
    expert_verdict:
      "The automotive crash simulation specialist trusted by European OEMs for decades.",
  },
  {
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
    faqs: genericFaqs("CorelCAD"),
    tech_specs: {
      engine: "ARES/IntelliCAD",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["DWG", "DXF", "STL", "3DM"],
    },
    expert_verdict:
      "The best perpetual-license AutoCAD alternative for Mac users who don't need a subscription.",
  },
  {
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
    faqs: genericFaqs("ZW3D"),

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
  },
  {
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
    faqs: genericFaqs("CAXA CAD"),
    tech_specs: {
      engine: "Proprietary 2D",
      multicore: "Low",
      gpu_optimization: "Basic",
      standards: ["DWG", "DXF", "EXB"],
    },
    expert_verdict:
      "The dominant CAD brand in China, increasingly gaining traction in global markets.",
  },
  {
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
    faqs: genericFaqs("ARES Commander"),

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
  },
  {
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
    faqs: genericFaqs("Synopsys Fusion Compiler"),
    tech_specs: {
      engine: "Synopsys Fusion Engine",
      multicore: "Ultra",
      gpu_optimization: "Ultra",
      standards: ["GDSII", "LEF/DEF", "Liberty", "Verilog"],
    },
    expert_verdict:
      "The most advanced chip implementation platform, powering designs at 3nm and below.",
  },
  {
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
    faqs: genericFaqs("CAMWorks"),
    tech_specs: {
      engine: "Parasolid (via SolidWorks)",
      multicore: "High",
      gpu_optimization: "Moderate",
      standards: ["STEP", "IGES", "DXF", "STL"],
    },
    expert_verdict:
      "The go-to CAM choice for SolidWorks shops seeking deep, native integration without leaving their CAD environment.",
  },
  {
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
    faqs: genericFaqs("Allplan"),

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
  },
  {
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
    faqs: genericFaqs("OpenRoads Designer"),
    tech_specs: {
      engine: "MicroStation (Bentley)",
      multicore: "High",
      gpu_optimization: "High",
      standards: ["IFC", "DGN", "DWG", "LandXML"],
    },
    expert_verdict:
      "The definitive platform for highway and infrastructure projects at enterprise scale.",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("3DEXPERIENCE"),
    tech_specs: {
      engine: "3DEXPERIENCE Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("TopSolid"),
    tech_specs: {
      engine: "TopSolid Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("BIMoffice"),
    tech_specs: {
      engine: "BIMoffice Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("EPLAN"),
    tech_specs: {
      engine: "EPLAN Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("MEDUSA4"),
    tech_specs: {
      engine: "MEDUSA4 Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("HiCAD"),
    tech_specs: {
      engine: "HiCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("BeckerCAD"),
    tech_specs: {
      engine: "BeckerCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("pCon.planner"),
    tech_specs: {
      engine: "pCon.planner Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CrownCAD"),
    tech_specs: {
      engine: "CrownCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("SINOVATION"),
    tech_specs: {
      engine: "SINOVATION Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("HaoChen CAD"),
    tech_specs: {
      engine: "HaoChen CAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CR-8000"),
    tech_specs: {
      engine: "CR-8000 Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CADmeister"),
    tech_specs: {
      engine: "CADmeister Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("IJCAD"),
    tech_specs: {
      engine: "IJCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Quadcept"),
    tech_specs: {
      engine: "Quadcept Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("RootPro CAD"),
    tech_specs: {
      engine: "RootPro CAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("V-nas"),
    tech_specs: {
      engine: "V-nas Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("KOMPAS-3D"),
    tech_specs: {
      engine: "KOMPAS-3D Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("T-FLEX CAD"),
    tech_specs: {
      engine: "T-FLEX CAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Renga"),
    tech_specs: {
      engine: "Renga Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Model Studio CS"),
    tech_specs: {
      engine: "Model Studio CS Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("AVEVA E3D Design"),
    tech_specs: {
      engine: "AVEVA E3D Design Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("DesignSpark Mechanical"),
    tech_specs: {
      engine: "DesignSpark Mechanical Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("LUSAS"),
    tech_specs: {
      engine: "LUSAS Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Visi"),
    tech_specs: {
      engine: "Visi Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Edgecam"),
    tech_specs: {
      engine: "Edgecam Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("midas Civil"),
    tech_specs: {
      engine: "midas Civil Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("midas Gen"),
    tech_specs: {
      engine: "midas Gen Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CADian"),
    tech_specs: {
      engine: "CADian Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Edificius"),
    tech_specs: {
      engine: "Edificius Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("EdiLus"),
    tech_specs: {
      engine: "EdiLus Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("think3"),
    tech_specs: {
      engine: "think3 Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Maptek Vulcan"),
    tech_specs: {
      engine: "Maptek Vulcan Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Promine"),
    tech_specs: {
      engine: "Promine Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("OOFELIE"),
    tech_specs: {
      engine: "OOFELIE Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CYPECAD"),
    tech_specs: {
      engine: "CYPECAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("TeKton3D"),
    tech_specs: {
      engine: "TeKton3D Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("KISSsoft"),
    tech_specs: {
      engine: "KISSsoft Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("cadwork"),
    tech_specs: {
      engine: "cadwork Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("MagiCAD"),
    tech_specs: {
      engine: "MagiCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Vertex BD"),
    tech_specs: {
      engine: "Vertex BD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CET Designer"),
    tech_specs: {
      engine: "CET Designer Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("ActCAD"),
    tech_specs: {
      engine: "ActCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("CADVision"),
    tech_specs: {
      engine: "CADVision Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Eberick"),
    tech_specs: {
      engine: "Eberick Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Promob"),
    tech_specs: {
      engine: "Promob Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("SCIA Engineer"),
    tech_specs: {
      engine: "SCIA Engineer Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("PowerMill"),
    tech_specs: {
      engine: "PowerMill Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("FeatureCAM"),
    tech_specs: {
      engine: "FeatureCAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("GibbsCAM"),
    tech_specs: {
      engine: "GibbsCAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("ESPRIT"),
    tech_specs: {
      engine: "ESPRIT Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("hyperMILL"),
    tech_specs: {
      engine: "hyperMILL Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Tebis"),
    tech_specs: {
      engine: "Tebis Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("WorkNC"),
    tech_specs: {
      engine: "WorkNC Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("SURFCAM"),
    tech_specs: {
      engine: "SURFCAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("BobCAD-CAM"),
    tech_specs: {
      engine: "BobCAD-CAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("DDS-CAD"),
    tech_specs: {
      engine: "DDS-CAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Planbar"),
    tech_specs: {
      engine: "Planbar Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("dRofus"),
    tech_specs: {
      engine: "dRofus Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Allegro PCB"),
    tech_specs: {
      engine: "Allegro PCB Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("OrCAD"),
    tech_specs: {
      engine: "OrCAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("PADS Professional"),
    tech_specs: {
      engine: "PADS Professional Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Xpedition"),
    tech_specs: {
      engine: "Xpedition Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Pulsonix"),
    tech_specs: {
      engine: "Pulsonix Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Target 3001!"),
    tech_specs: {
      engine: "Target 3001! Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("AutoForm"),
    tech_specs: {
      engine: "AutoForm Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("PAM-STAMP"),
    tech_specs: {
      engine: "PAM-STAMP Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Moldflow"),
    tech_specs: {
      engine: "Moldflow Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Moldex3D"),
    tech_specs: {
      engine: "Moldex3D Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("ShipConstructor"),
    tech_specs: {
      engine: "ShipConstructor Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("NAPA"),
    tech_specs: {
      engine: "NAPA Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("FORAN"),
    tech_specs: {
      engine: "FORAN Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Pytha"),
    tech_specs: {
      engine: "Pytha Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("imos iX"),
    tech_specs: {
      engine: "imos iX Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("20-20 Design"),
    tech_specs: {
      engine: "20-20 Design Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Palette CAD"),
    tech_specs: {
      engine: "Palette CAD Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("KD Max"),
    tech_specs: {
      engine: "KD Max Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("WoodWOP"),
    tech_specs: {
      engine: "WoodWOP Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("AlphaCAM"),
    tech_specs: {
      engine: "AlphaCAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Radan"),
    tech_specs: {
      engine: "Radan Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("Lantek Expert"),
    tech_specs: {
      engine: "Lantek Expert Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("SigmaNEST"),
    tech_specs: {
      engine: "SigmaNEST Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    alternatives: [],
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
    faqs: genericFaqs("MetaCAM"),
    tech_specs: {
      engine: "MetaCAM Engine",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },
    expert_verdict: "待补充专业评语。",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("Infraworks"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("3ds Max"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("ZBrush"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("KeyShot"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("Lumion"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("Enscape"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
  {
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
    official_url: "",
    affiliate_url: null,
    score: 4.5,
    pros: [],
    cons: [],
    faqs: genericFaqs("Twinmotion"),

    tech_specs: {
      engine: "N/A",
      multicore: "N/A",
      gpu_optimization: "N/A",
      standards: [],
    },

    expert_verdict: "Professional choice for the industry.",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categoryId: string) {
  return tools.filter((tool) => tool.category_id === categoryId);
}
