import * as fs from 'fs';
import * as path from 'path';

// Define the 35 tools with their high-quality translations
const TRANSLATIONS: Record<string, {
  expert_verdict: string;
  pros: string[];
  cons: string[];
  pricing_features?: Record<string, string[]>; // mapping tier name to clean features
}> = {
  medusa4: {
    expert_verdict: "MEDUSA4 is a robust 2D/3D CAD solution for plant engineering and mechanical design. It features outstanding parametric design capabilities, advanced plant layout, and native AR/VR support for advanced visualization and training. However, it has a steep learning curve and its pricing is premium.",
    pros: [
      "Powerful parametric design capabilities",
      "Industry-proven in plant engineering",
      "AR/VR support for advanced visualization",
      "Linux compatible with high flexibility",
      "High quality and reliability of German engineering"
    ],
    cons: [
      "Steep learning curve",
      "Smaller global plugin ecosystem",
      "Premium pricing",
      "Limited localized support in certain markets"
    ],
    pricing_features: {
      "Standard": ["Basic 2D/3D design", "Parametric design", "Standard drawing library"],
      "Professional": ["All Standard features", "AR/VR support", "Advanced plant design", "API integration"]
    }
  },
  hicad: {
    expert_verdict: "HiCAD is a comprehensive CAD/PDM/PLM solution spanning mechanical engineering, plant design, sheet metal, and steel construction. It is highly reliable and integrates deep PDM/PLM data management, making it an excellent all-in-one suite for medium-to-large engineering enterprises, though it requires significant training.",
    pros: [
      "All-in-one solution for multiple industries",
      "Integrated PDM/PLM for efficient data management",
      "Specialized sheet metal and steel design features",
      "German engineering reliability",
      "Robust parametric modeling"
    ],
    cons: [
      "High software acquisition cost",
      "Steep learning curve",
      "Smaller international ecosystem",
      "Limited English documentation"
    ],
    pricing_features: {
      "Standard": ["Basic 2D/3D design", "Sheet metal design", "Steel structure design"],
      "Professional": ["All Standard features", "PDM/PLM integration", "Advanced automation", "API integration"]
    }
  },
  beckercad: {
    expert_verdict: "BeckerCAD is a specialized CAD/CAM software tailored for mechanical design and sheet metal fabrication. It offers an integrated workflow from design to manufacturing at an accessible price point, though its advanced 3D modeling features are more limited compared to premium suites.",
    pros: [
      "Reliable German engineering standards",
      "Strong sheet metal design tools",
      "Integrated CAD/CAM workflow",
      "Excellent cost-performance ratio",
      "Strong European market presence"
    ],
    cons: [
      "Smaller global plugin ecosystem",
      "Limited English documentation",
      "Fewer advanced 3D surfacing tools"
    ],
    pricing_features: {
      "Standard": ["Basic CAD/CAM tools", "Sheet metal design", "CNC machining"],
      "Professional": ["All Standard features", "Advanced modeling", "Automation tools", "API integration"]
    }
  },
  pconplanner: {
    expert_verdict: "pCon.planner is a highly professional space planning and interior design software integrated with major furniture manufacturers' catalogs. It delivers stunning photorealistic rendering and outstanding client presentation features, making it the perfect choice for interior designers, although it is not meant for general CAD drafting.",
    pros: [
      "Specialized features for space planning and furniture design",
      "Native integration with major manufacturer catalogs",
      "High-quality photorealistic rendering",
      "Strong client presentation capabilities",
      "High reliable German software design"
    ],
    cons: [
      "Fails as a general-purpose drafting tool",
      "Premium pricing for professional tiers",
      "Steep learning curve for advanced features"
    ],
    pricing_features: {
      "Standard": ["Basic layout design", "Manufacturer catalog integration", "2D/3D visualization"],
      "Professional": ["All Standard features", "Photorealistic rendering", "Advanced integration tools"]
    }
  },
  crowncad: {
    expert_verdict: "CrownCAD is a cloud-native 3D CAD platform built on a proprietary geometry engine and constraint solver. It offers powerful real-time collaboration features directly in a web browser without local installation, though its global ecosystem is still in active development.",
    pros: [
      "Proprietary geometric engine and constraint solver",
      "Cloud-native real-time collaboration",
      "Fully independent technology stack",
      "Browser-based with zero installation",
      "Excellent cloud rendering speeds"
    ],
    cons: [
      "Developing global plugin ecosystem",
      "Limited international documentation",
      "Steep learning curve for advanced modeling"
    ],
    pricing_features: {
      "Standard": ["Basic 3D modeling", "Cloud-based hosting", "Real-time collaboration"],
      "Professional": ["All Standard features", "Advanced modeling tools", "API integration", "Priority support"]
    }
  },
  sinovation: {
    expert_verdict: "SINOVATION is a highly specialized CAD/CAM software focused on industrial mold and die design. It features advanced multi-axis machining and an integrated design-to-manufacturing workflow, making it highly productive for specialized mold makers but less suited for general mechanical design.",
    pros: [
      "Specialized mold and die design tools",
      "Seamless CAD/CAM manufacturing workflow",
      "Advanced multi-axis machining support",
      "Strong industrial customer base",
      "Robust technical support for manufacturing"
    ],
    cons: [
      "Not suited for general mechanical drafting",
      "Premium licensing costs",
      "Steep training requirements",
      "Smaller global developer community"
    ],
    pricing_features: {
      "Standard": ["Basic 3D design", "Mold design features", "CNC machining modules"],
      "Professional": ["All Standard features", "Advanced mold design", "Multi-axis machining", "API integration"]
    }
  },
  cadmeister: {
    expert_verdict: "CADmeister is a Japanese CAD/CAM software specialized for mold and die design, particularly famous for its high-performance electrode design. It has high DWG compatibility and excellent manufacturing automation, though its global footprint and English support are relatively limited.",
    pros: [
      "Dedicated mold and die design automation",
      "Renowned electrode design capabilities",
      "High DWG format compatibility",
      "Strong manufacturing automation features",
      "Excellent localized industry support"
    ],
    cons: [
      "Limited global plugin ecosystem",
      "Fewer English documentation resources",
      "Narrow focus on mold-specific engineering",
      "Premium pricing tiers"
    ],
    pricing_features: {
      "Standard": ["Basic CAD/CAM features", "Mold design tools", "3D modeling"],
      "Professional": ["All Standard features", "Electrode design", "Advanced CAM modules", "Design automation"]
    }
  },
  ijcad: {
    expert_verdict: "IJCAD is a highly popular, budget-friendly AutoCAD-compatible alternative widely adopted in Japan. It features high DWG compatibility, perpetual license models for easy cost planning, and excellent stability for 2D drafting, although its 3D modeling and global ecosystem are more restricted.",
    pros: [
      "High AutoCAD compatibility and smooth transition",
      "Complete support for standard DWG/DXF formats",
      "Perpetual license model for great cost control",
      "Highly trusted in construction and manufacturing",
      "Intuitive operation with low training cost"
    ],
    cons: [
      "Limited 3D modeling capabilities",
      "Smaller international ecosystem",
      "Fewer advanced automation tools compared to flagship platforms"
    ],
    pricing_features: {
      "Standard": ["DWG compatibility", "Basic drafting tools", "Standard support"],
      "Professional": ["All Standard features", "Advanced drafting features", "API integration"]
    }
  },
  "rootpro-cad": {
    expert_verdict: "RootPro CAD is a lightweight and user-friendly 2D drafting tool that offers both free and professional tiers. With solid DWG/DXF compatibility and cross-platform flexibility, it is an excellent choice for budget-conscious designers, but lacks advanced 3D modeling or large-scale project coordination features.",
    pros: [
      "Free version available for basic drafting",
      "Cross-platform flexibility",
      "Solid DWG/DXF compatibility",
      "Clean and intuitive interface",
      "Flexible subscription and perpetual choices"
    ],
    cons: [
      "No 3D modeling features",
      "Limited global developer ecosystem",
      "Not suited for massive engineering projects"
    ],
    pricing_features: {
      "Free": ["Basic drafting tools", "DWG importing", "PDF export"],
      "Professional": ["All Free features", "Advanced drafting tools", "API integration", "Priority support"]
    }
  },
  renga: {
    expert_verdict: "Renga is a comprehensive BIM system covering architecture, structural engineering, and MEP disciplines. It offers highly cost-effective 3D modeling and excellent Open BIM compliance via IFC, though its global integration and documentation are still maturing.",
    pros: [
      "Fully integrated BIM for architecture, structure, and MEP",
      "Highly cost-effective compared to major suites",
      "Excellent Open BIM and IFC integration",
      "Strong regional support",
      "Fast learning curve for 3D layouts"
    ],
    cons: [
      "Smaller global plugin ecosystem",
      "Limited English documentation",
      "Fewer advanced generative design automations"
    ],
    pricing_features: {
      "Standard": ["Basic BIM design", "Architectural modeling", "Structural modeling"],
      "Professional": ["All Standard features", "MEP design", "Collaboration tools", "API integration"]
    }
  },
  visi: {
    expert_verdict: "Visi is Hexagon's specialized CAD/CAM software for mold and die design, particularly outstanding in progressive die design. It features complete design-to-manufacturing automation and robust toolpath generation, although it has a steep learning curve and premium pricing.",
    pros: [
      "Outstanding progressive die and mold design",
      "Advanced CAD/CAM integration",
      "Backed by Hexagon's metrology and industrial standard",
      "Highly automated electrode design",
      "Robust machining simulation"
    ],
    cons: [
      "Premium pricing model",
      "Steep learning curve",
      "Too complex for general CAD needs",
      "Over-engineered for small workshops"
    ],
    pricing_features: {
      "Standard": ["Basic CAD/CAM tools", "Mold design", "3D modeling"],
      "Professional": ["All Standard features", "Progressive die tools", "Advanced CAM features", "Automation tools"]
    }
  },
  edgecam: {
    expert_verdict: "Edgecam is Hexagon's premier CAM solution specialized in multi-axis CNC milling, turning, and mill-turn machining. It features advanced toolpath optimization, high-speed machining (Waveform), and full machine simulation, though it requires a separate CAD system for full drafting workflows.",
    pros: [
      "Advanced multi-axis CNC programming",
      "Industry-leading Waveform high-speed machining",
      "Excellent toolpath safety and machine simulation",
      "Seamless integration with major CAD software",
      "Trusted industrial backing from Hexagon"
    ],
    cons: [
      "Premium acquisition costs",
      "Steep learning curve",
      "Requires separate CAD for design",
      "Over-engineered for simple 2D milling"
    ],
    pricing_features: {
      "Standard": ["Basic CAM tools", "CNC milling", "CNC turning"],
      "Professional": ["All Standard features", "Multi-axis machining", "High-speed machining", "Automation tools"]
    }
  },
  edificius: {
    expert_verdict: "Edificius is a powerful Open BIM software boasting the highest number of IFC certifications. It integrates architectural, structural, and MEP design into a unified environment, delivering high interoperability for standard construction pipelines, although its training path is steep.",
    pros: [
      "Industry-leading number of IFC certified solutions",
      "Deep compliance with Open BIM standards",
      "Unified architectural, structural, and MEP workflow",
      "Stunning real-time rendering integration",
      "Highly competitive pricing in Europe"
    ],
    cons: [
      "Premium pricing model",
      "Steep learning curve",
      "Limited localized support in secondary markets",
      "Fewer community-developed add-ons"
    ],
    pricing_features: {
      "Standard": ["Basic BIM design", "Architectural modeling", "Full IFC compliance"],
      "Professional": ["All Standard features", "Structural design", "MEP design", "Advanced integration"]
    }
  },
  edilus: {
    expert_verdict: "EdiLus is a structural engineering calculation and analysis software featuring native IFC compatibility. It offers automated structural drawings and calculations, making it a valuable tool for architectural engineers, although it lacks advanced generic architectural modeling.",
    pros: [
      "Automated structural calculations and drawings",
      "High interoperability via IFC compliance",
      "Intuitive structural modeling interface",
      "Excellent cost-to-performance ratio",
      "Strong European engineering compliance"
    ],
    cons: [
      "Limited generic architectural modeling",
      "Not designed for MEP routing",
      "Fewer international design code integrations"
    ],
    pricing_features: {
      "Standard": ["Basic structural design", "IFC compliance", "Detail drawing generation"],
      "Professional": ["All Standard features", "Advanced structural modeling", "Photo-realistic rendering", "Analysis integrations"]
    }
  },
  kisssoft: {
    expert_verdict: "KISSsoft is the global standard for gear and transmission design and calculation. It provides highly accurate mathematical analysis, shaft calculations, and seamless CAD integration, making it indispensable for automotive and drivetrain engineers, though it is completely specialized for gearboxes.",
    pros: [
      "Indispensable specialization for gear and transmission design",
      "Highly precise Swiss engineering calculations",
      "Seamless integration with major CAD tools",
      "Broad compliance with international ISO/DIN standards",
      "Trusted by global automotive giants"
    ],
    cons: [
      "Completely specialized (not for general CAD drafting)",
      "Premium licensing costs",
      "Requires advanced engineering background",
      "Small niche ecosystem"
    ],
    pricing_features: {
      "Standard": ["Basic gear calculation", "Shaft calculation", "Transmission design"],
      "Professional": ["All Standard features", "Advanced analysis", "CAD integration plugins"]
    }
  },
  cadwork: {
    expert_verdict: "cadwork is the global leader in timber construction CAD/CAM software. It integrates structural wood design with direct CNC export for automated wood fabrication, making it the perfect choice for timber engineers and house builders, although it is not meant for concrete or steel-only structures.",
    pros: [
      "Unmatched specialization for timber design and carpentry",
      "Direct CNC export to major wood manufacturing machines",
      "Highly stable Swiss engineering and building physics",
      "Full BIM and IFC format support",
      "Compliance with Eurocode and local timber building standards"
    ],
    cons: [
      "Highly specialized (not suited for other sectors)",
      "Premium acquisition cost",
      "Steep training curve"
    ],
    pricing_features: {
      "Standard": ["Basic timber design", "3D modeling", "CNC machine output"],
      "Professional": ["All Standard features", "Advanced structural analysis", "BIM integration", "Design automation"]
    }
  },
  magicad: {
    expert_verdict: "MagiCAD is the premier MEP design plugin for Revit and AutoCAD, offering massive manufacturer content libraries and advanced HVAC/electrical calculations. It is widely adopted by top engineering firms across Europe and Asia, although it represents a significant software investment.",
    pros: [
      "Highly specialized MEP and HVAC design solution",
      "Extensive database of verified manufacturer products",
      "Seamless high-performance Revit and AutoCAD integration",
      "Powerful calculation and system sizing tools",
      "Excellent coordination and clash detection"
    ],
    cons: [
      "Highly premium software cost",
      "Steep learning curve",
      "Requires a host CAD (Revit/AutoCAD) license",
      "Limited use for architectural layout"
    ],
    pricing_features: {
      "Standard": ["Basic MEP design tools", "HVAC design", "Electrical design"],
      "Professional": ["All Standard features", "Piping design", "BIM synchronization", "Manufacturer content access"]
    }
  },
  featurecam: {
    expert_verdict: "FeatureCAM is Autodesk's specialized CAM software famous for its feature-recognition automation. It dynamically automates CNC milling, turning, and wire EDM programming from solid models, saving massive setup times for job shops, though it carries premium Autodesk subscription costs.",
    pros: [
      "Automated feature recognition dramatically cuts programming time",
      "Seamless integration with Autodesk design tools",
      "User-friendly workflow with flat learning curve",
      "Excellent multi-tasking and mill-turn support",
      "Highly reliable post-processors"
    ],
    cons: [
      "Premium subscription costs",
      "Heavy dependence on Autodesk license ecosystem",
      "Less control over highly manual toolpaths",
      "Fewer complex 5-axis sculpting options"
    ],
    pricing_features: {
      "Standard": ["Basic CAM tools", "Milling automation", "Turning automation"],
      "Professional": ["All Standard features", "Multi-axis machining", "High-speed machining", "Feature recognition"]
    }
  },
  gibbscam: {
    expert_verdict: "GibbsCAM is a powerful, production-oriented CAM system supporting CNC milling, turning, wire EDM, and multi-task machining (MTM). Its famous single-screen interface makes complex multi-tasking programming highly accessible for job shops, though its pricing is premium.",
    pros: [
      "Highly intuitive, single-screen interface",
      "Advanced support for multi-task machining (MTM)",
      "Excellent CNC wire EDM capability",
      "Production-focused workflow with high toolpath security",
      "Great custom post-processor support"
    ],
    cons: [
      "Premium software acquisition cost",
      "Fewer automated feature-recognition tools than competitors",
      "Fewer global support resources in secondary markets"
    ],
    pricing_features: {
      "Standard": ["Basic CAM features", "CNC milling", "CNC turning"],
      "Professional": ["All Standard features", "Multi-axis machining", "Wire EDM", "Advanced MTM automation"]
    }
  },
  hypermill: {
    expert_verdict: "hyperMILL is the gold standard for high-end 5-axis simultaneous CNC milling and complex toolpath optimization. Widely used in aerospace, automotive, and turbine manufacturing, it delivers maximum surface quality and safety, although it represents a massive investment.",
    pros: [
      "Unmatched 5-axis simultaneous milling technology",
      "Excellent toolpath collision avoidance and optimization",
      "Renowned surface finish quality for complex parts",
      "Trusted in aerospace and turbine manufacturing",
      "Robust integration with major CAD software"
    ],
    cons: [
      "Extremely premium licensing costs",
      "Steep learning curve for complex multi-axis setups",
      "Over-engineered for basic job shops"
    ],
    pricing_features: {
      "Standard": ["Basic CAM features", "Milling tools", "Turning tools"],
      "Professional": ["All Standard features", "5-axis simultaneous milling", "High-speed machining", "Specialized turbine/blade packages"]
    }
  },
  tebis: {
    expert_verdict: "Tebis is a highly premium CAD/CAM/CAQ/MES suite designed for aerospace, automotive, and large-scale tool and die manufacturers. It provides complete process control, collision-free toolpaths, and automated quality control, making it perfect for large industrial sites.",
    pros: [
      "Full CAD/CAM/CAQ/MES manufacturing workflow integration",
      "Absolute safety with virtual machine collision-free simulation",
      "Renowned surface quality for high-stakes tool and die",
      "Excellent process optimization and automated template machining",
      "Highly trusted by global automotive groups"
    ],
    cons: [
      "Extremely high price point",
      "Very steep learning curve",
      "Fills a highly specialized niche",
      "Not suited for general light design work"
    ],
    pricing_features: {
      "Standard": ["Basic CAD/CAM tools", "Mold and die design", "Quality control (CAQ)"],
      "Professional": ["All Standard features", "MES manufacturing integration", "Advanced CAM automation", "Process optimization"]
    }
  },
  worknc: {
    expert_verdict: "WorkNC is a premier CAM software for 2-to-5 axis milling of complex molds, dies, and aerospace components. Its automated roughing and finishing algorithms ensure safe and efficient machining, making it highly valued by professional tooling workshops.",
    pros: [
      "Advanced automatic feature recognition and toolpaths",
      "Highly specialized for large mold and die fabrication",
      "High toolpath safety and collision check",
      "Excellent multi-axis milling options",
      "Reliable German and French engineering backing"
    ],
    cons: [
      "Premium software acquisition cost",
      "Steep learning curve for advanced 5-axis modules",
      "Requires separate CAD for modeling workflows"
    ],
    pricing_features: {
      "Standard": ["Basic CAM tools", "CNC milling", "Feature recognition"],
      "Professional": ["All Standard features", "5-axis milling", "High-speed machining", "Machining templates"]
    }
  },
  surfcam: {
    expert_verdict: "SURFCAM is a versatile, budget-friendly CAM system supporting 2-to-5 axis CNC milling, turning, and wire EDM. Its intuitive interface and excellent cost-to-performance ratio make it highly popular for small-to-midsize workshops and job shops.",
    pros: [
      "Highly accessible cost-performance ratio",
      "User-friendly interface with flat learning curve",
      "Versatile support for multiple CNC machining modes",
      "Trusted in light manufacturing",
      "Excellent post-processors for standard controllers"
    ],
    cons: [
      "Fewer advanced collision-avoidance automations than premium suites",
      "Developing third-party integration ecosystem",
      "Limited advanced 5-axis simultaneous sculpting"
    ],
    pricing_features: {
      "Standard": ["Basic CAM tools", "CNC milling", "CNC turning"],
      "Professional": ["All Standard features", "Multi-axis machining", "Wire EDM", "Advanced toolpath generators"]
    }
  },
  "bobcad-cam": {
    expert_verdict: "BobCAD-CAM is an exceptionally cost-effective, fully integrated CAD/CAM software designed for small job shops and manufacturing teams. It provides a complete, easy-to-use design-to-machining pipeline for milling and turning at a fraction of the cost of premium suites.",
    pros: [
      "Excellent cost-performance ratio for small workshops",
      "Seamlessly integrated CAD/CAM workflow",
      "Intuitive user interface with flat learning curve",
      "Designed specifically for job shops and CNC prototyping",
      "Strong community and learning resources"
    ],
    cons: [
      "Lacks high-end 5-axis continuous toolpath sculpting of premium suites",
      "Fewer enterprise automated features",
      "Developing global integration ecosystem"
    ],
    pricing_features: {
      "Standard": ["Basic CAD/CAM tools", "2.5D milling", "CNC turning"],
      "Professional": ["All Standard features", "Multi-axis milling", "Advanced modeling tools", "Design automation"]
    }
  },
  "dds-cad": {
    expert_verdict: "DDS-CAD is a specialized MEP design and BIM software solution featuring advanced HVAC, piping, and electrical design automation. Highly respected in the European and Nordic markets, it integrates structural coordination and energy calculations natively.",
    pros: [
      "Dedicated MEP and HVAC BIM software design",
      "Proven track record in European and Nordic markets",
      "Integrated electrical load and energy calculations",
      "Automated plan view and section generation",
      "High Open BIM and IFC compliance"
    ],
    cons: [
      "Limited general architectural or structural modeling",
      "Premium licensing and support costs",
      "Steep learning curve"
    ],
    pricing_features: {
      "Standard": ["Basic MEP tools", "HVAC design", "Electrical systems design"],
      "Professional": ["All Standard features", "Piping design", "BIM collaboration", "Energy calculation"]
    }
  },
  drofus: {
    expert_verdict: "dRofus is the leading data-driven room programming and equipment planning platform for BIM. Unlike visual CAD tools, it focuses entirely on room data sheets, equipment requirements, and building planning metadata for massive projects, although it is too complex for small teams.",
    pros: [
      "Dedicated room data and equipment requirement platform",
      "Deep real-time integration with Revit, ArchiCAD, and Open BIM",
      "Consolidates project data to eliminate silos",
      "Extremely robust for hospitals, airports, and large infrastructure",
      "Comprehensive API and automation capabilities"
    ],
    cons: [
      "No native geometric CAD drafting features",
      "Highly premium enterprise pricing",
      "Very steep learning curve"
    ],
    pricing_features: {
      "Standard": ["Basic data management", "Room data sheets", "BIM model integration"],
      "Professional": ["All Standard features", "Equipment programming", "Advanced automation", "API integration"]
    }
  },
  autoform: {
    expert_verdict: "AutoForm is the undisputed global standard for sheet metal forming simulation and BiW assembly analysis. It delivers full-process digital twins and Industry 4.0 integration, allowing automotive companies to predict manufacturing errors with extreme accuracy.",
    pros: [
      "Industry standard for sheet metal forming simulation",
      "High-precision physics solver for metal deformation",
      "Full digital twin and Industry 4.0 capability",
      "Drastically cuts die development cycles and prototype costs",
      "Trusted by all major global automotive OEMs"
    ],
    cons: [
      "Extremely premium licensing costs",
      "Very steep learning curve",
      "Highly specialized (useless outside sheet metal forming)",
      "Requires powerful enterprise workstations"
    ],
    pricing_features: {
      "Standard": ["Basic forming analysis", "Forming simulation", "Die process design"],
      "Professional": ["All Standard features", "BiW assembly analysis", "Advanced materials analysis", "Industry 4.0 integration"]
    }
  },
  moldflow: {
    expert_verdict: "Moldflow is Autodesk's flagship plastic injection molding simulation software. It allows mechanical engineers and mold makers to optimize part design, cooling channels, and warp tolerances before tooling fabrication, reducing expensive mold revisions.",
    pros: [
      "The premier standard for plastic injection molding simulation",
      "Deeply integrated with Autodesk product suites",
      "Outstanding filling, packing, cooling, and warpage simulation",
      "Reduces plastic defects and speeds up time-to-market",
      "Extensive plastic materials database with thousands of grades"
    ],
    cons: [
      "Highly premium subscription cost",
      "Steep engineering background required",
      "Over-engineered for basic part design",
      "Dedicated purely to injection molding"
    ],
    pricing_features: {
      "Standard": ["Basic injection molding analysis", "Part filling simulation", "Cooling optimization"],
      "Professional": ["All Standard features", "Warpage analysis", "Fiber orientation analysis", "Autodesk ecosystem integration"]
    }
  },
  moldex3d: {
    expert_verdict: "Moldex3D is a highly advanced plastic injection molding simulation platform, featuring advanced true-3D mesh solvers for fiber orientation, thermosets, and optical parts. It stands as the strongest competitor to Moldflow, offering excellent performance.",
    pros: [
      "Advanced true-3D mesh simulation solvers",
      "Outstanding fiber orientation and anisotropic warpage analysis",
      "Strong regional support across Asian and global markets",
      "Highly accurate optical and thermoset molding simulation",
      "Excellent parallel computing performance"
    ],
    cons: [
      "Premium enterprise pricing model",
      "Steep learning curve for complex meshes",
      "Highly specialized for plastic injection molding"
    ],
    pricing_features: {
      "Standard": ["Basic 3D molding simulation", "Part filling and packing", "Cooling channel design"],
      "Professional": ["All Standard features", "Advanced warpage analysis", "Fiber orientation simulation", "Optical/specialized molding"]
    }
  },
  woodwop: {
    expert_verdict: "WoodWOP is HOMAG's proprietary wood and cabinetry CAM software. Tailored specifically for CNC router programming in furniture, cabinet, and kitchen manufacturing, it offers seamless integration with HOMAG machinery and nesting optimization.",
    pros: [
      "Indispensable specialization for woodworking and cabinetry CNC",
      "Direct, seamless integration with HOMAG CNC machinery",
      "Highly visual and user-friendly workshop programming",
      "Outstanding nesting and material yield optimization",
      "Deeply trusted in European cabinetry and kitchen industries"
    ],
    cons: [
      "Premium software acquisition cost",
      "Restricted mostly to HOMAG hardware ecosystems",
      "Completely unsuited for metal CNC machining"
    ],
    pricing_features: {
      "Standard": ["Basic wood machining", "Cabinet design templates", "CNC router programming"],
      "Professional": ["All Standard features", "Advanced nesting", "Barcode/labeling automation", "HOMAG machine bridge"]
    }
  },
  alphacam: {
    expert_verdict: "AlphaCAM is a highly versatile CAM solution supporting CNC wood, stone, glass, and metal routing and machining. It is widely adopted by custom furniture and architectural component manufacturers due to its outstanding CAD-to-CAM flexibility.",
    pros: [
      "Versatile CAD/CAM for wood, stone, glass, and metal",
      "Flexible multi-axis CNC routing and nesting support",
      "User-friendly interface for workshop operators",
      "Highly trusted by custom furniture and countertop builders",
      "Excellent custom macro and automation support"
    ],
    cons: [
      "Lacks advanced continuous 5-axis mold sculpting of flagship suites",
      "Smaller developer ecosystem in mainstream metalworking",
      "Fewer built-in CAD design features"
    ],
    pricing_features: {
      "Standard": ["Basic routing and milling", "2.5D machining", "Standard nesting"],
      "Professional": ["All Standard features", "Multi-axis machining", "Specialized stone cutting modules", "Advanced nesting optimization"]
    }
  },
  radan: {
    expert_verdict: "Radan is the leading CAD/CAM software for sheet metal design, nesting, and CNC punching. Its industry-leading automated nesting solver maximizes sheet metal yield, significantly cutting raw material costs for professional fabricators.",
    pros: [
      "Industry-leading automatic sheet metal nesting and yield",
      "Highly specialized for CNC punching, profiling, and bending",
      "Proven track record with massive installations worldwide",
      "Granular material inventory and quote tracking",
      "High reliable software backing"
    ],
    cons: [
      "Premium pricing tiers",
      "Requires focused training",
      "Completely specialized for sheet metal fabrication"
    ],
    pricing_features: {
      "Standard": ["Basic sheet metal design", "Standard nesting tools", "Bending calculation"],
      "Professional": ["All Standard features", "CNC punch programming", "Laser profiling", "Granular inventory integration"]
    }
  },
  "lantek-expert": {
    expert_verdict: "Lantek Expert is a specialized CAD/CAM nesting software designed for sheet metal punching, laser, plasma, and waterjet cutting. It offers excellent automatic nesting and cost estimation, making it highly competitive for sheet metal job shops.",
    pros: [
      "Dedicated sheet metal nesting and cutting programming",
      "Excellent automatic nesting and sheet yield",
      "Highly competitive pricing and cost-performance",
      "Granular ERP and cost estimation integration",
      "Strong European support network"
    ],
    cons: [
      "Premium software costs",
      "Steep learning curve for complex systems",
      "Not designed for general mechanical product design"
    ],
    pricing_features: {
      "Standard": ["Basic cut programming", "CNC punching", "Standard nesting"],
      "Professional": ["All Standard features", "Laser profiling", "Waterjet cutting", "ERP cost estimation integration"]
    }
  },
  sigmanest: {
    expert_verdict: "SigmaNEST is the undisputed industry standard for sheet metal nesting and multi-process CNC cutting. Backed by top-tier algorithms, it optimizes raw material yields across laser, plasma, punch, router, and waterjet processes for massive manufacturing sites.",
    pros: [
      "Undisputed best-in-class sheet metal nesting yield",
      "Outstanding multi-process cutting support (laser, plasma, waterjet)",
      "Massive material yield and raw cost optimization",
      "Integrated inventory and shop floor tracking",
      "Excellent post-processor database for all machines"
    ],
    cons: [
      "Very premium software acquisition and support costs",
      "Steep learning curve for advanced features",
      "Over-engineered for simple job shops",
      "Strictly focused on sheet and profile cutting"
    ],
    pricing_features: {
      "Standard": ["Basic nesting and profiling", "Laser cutting programming", "Plasma/punch programming"],
      "Professional": ["All Standard features", "Multi-process nesting", "Warehouse inventory integration", "Shop floor production tracking"]
    }
  },
  metacam: {
    expert_verdict: "MetaCAM is a comprehensive sheet metal CAD/CAM solution specialized in CNC punch, laser, and press brake bending programming. It features integrated automated nesting and bending simulation, providing great value for custom fabricators.",
    pros: [
      "Unified sheet metal cutting and press brake bending programming",
      "Automated nesting and collision-free bending simulation",
      "Excellent post-processor support for major fabrication machines",
      "Highly competitive cost-to-performance ratio",
      "Trusted by custom sheet metal shops"
    ],
    cons: [
      "Fewer enterprise ERP inventory integrations",
      "Requires dedicated operator training",
      "Unsuited for 3D continuous milling"
    ],
    pricing_features: {
      "Standard": ["Basic sheet metal design", "CNC profiling", "Standard nesting"],
      "Professional": ["All Standard features", "Press brake bending simulation", "Laser cutting programming", "Production automation"]
    }
  }
};

const CATEGORY_NAMES: Record<string, string> = {
  c1: "2D drafting and general CAD",
  c2: "3D modeling and product design",
  c3: "Building Information Modeling (BIM)",
  c4: "CAD viewing and markup",
  c5: "CAE/CAM and manufacturing",
  c6: "electronics design automation (EDA)",
  c7: "specialized vertical-market CAD",
};

// Custom serializer to match original formatting
function serializeTool(tool: any): string {
  let str = JSON.stringify(tool, null, 2);
  
  // Replace the full logo URL back to getLogo("...") call
  // logo_url: "https://ui-avatars.com/api/?name=RV&background=0f172a&color=fff&size=200&bold=true&font-size=0.33"
  // => logo_url: getLogo("RV")
  str = str.replace(/"https:\/\/ui-avatars\.com\/api\/\?name=([^&]+)&background=0f172a&color=fff&size=200&bold=true&font-size=0.33"/g, (match, p1) => {
    return `getLogo("${decodeURIComponent(p1)}")`;
  });
  
  // Remove quotes from valid JS keys: name, id, slug, etc.
  str = str.replace(/^(\s*)"([a-zA-Z_][a-zA-Z0-9_]*)":/gm, '$1$2:');
  
  return str;
}

// Read c1.ts to c7.ts, apply updates and save them back
async function runSanitization() {
  const dataDir = path.resolve(__dirname, '..', 'src', 'lib', 'data');
  const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

  for (const filename of files) {
    const filePath = path.join(dataDir, filename);
    console.log(`Processing file: ${filePath}`);
    
    // Read the original file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the header (imports, comments, array start)
    const arrayStartIdx = content.indexOf('export const ');
    if (arrayStartIdx === -1) {
      console.error(`Could not find export declaration in ${filename}`);
      continue;
    }
    const arrayDeclLineEnd = content.indexOf(' = [', arrayStartIdx);
    if (arrayDeclLineEnd === -1) {
      console.error(`Could not find array declaration start in ${filename}`);
      continue;
    }
    
    const header = content.substring(0, arrayDeclLineEnd + 4);
    
    // Dynamic import to load the current array in Node
    const moduleName = filename.replace('.ts', '');
    const modulePath = `../src/lib/data/${moduleName}`;
    const imported = require(modulePath);
    const toolsArrayKey = `${moduleName}Tools`;
    const tools = imported[toolsArrayKey];
    
    if (!tools || !Array.isArray(tools)) {
      console.error(`Could not load array ${toolsArrayKey} from ${modulePath}`);
      continue;
    }
    
    // Sanitize each tool in the array
    const sanitizedTools = tools.map((t: any) => {
      const tool = { ...t };
      
      // 1. Correct the score if it's > 5.0 (out of bounds)
      if (tool.score > 5.0) {
        const oldScore = tool.score;
        tool.score = Math.round((oldScore / 20.0) * 10) / 10;
        console.log(`  [Score Fix] ${tool.name} (${tool.slug}): ${oldScore} -> ${tool.score}`);
      }
      
      // 2. Translate actual CJK tools
      if (TRANSLATIONS[tool.slug]) {
        const tr = TRANSLATIONS[tool.slug];
        tool.expert_verdict = tr.expert_verdict;
        tool.pros = tr.pros;
        tool.cons = tr.cons;
        
        if (tr.pricing_features && tool.pricing_tiers) {
          tool.pricing_tiers = tool.pricing_tiers.map((tier: any) => {
            const cleanFeatures = tr.pricing_features?.[tier.name];
            if (cleanFeatures) {
              return { ...tier, features: cleanFeatures };
            }
            return tier;
          });
        }
        console.log(`  [CJK Translate] Translated full CJK fields for ${tool.name} (${tool.slug})`);
      }
      
      // 3. Resolve Chinese placeholders "待补充专业评语。"
      if (tool.expert_verdict === '待补充专业评语。') {
        const catName = CATEGORY_NAMES[tool.category_id] || "professional drafting and design";
        tool.expert_verdict = `${tool.name} is a professional software solution for ${catName}. It provides comprehensive tools tailored for engineering, drafting, and design workflows.`;
        console.log(`  [Placeholder Fix] Replaced placeholder for ${tool.name} (${tool.slug})`);
      }
      
      // Double check any leftover CJK characters in pros/cons for other tools (just in case)
      const hasCJK = (str: string) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(str);
      if (tool.expert_verdict && hasCJK(tool.expert_verdict)) {
        console.warn(`  [Warning] CJK still found in expert_verdict for ${tool.name}: ${tool.expert_verdict}`);
      }
      if (tool.pros && tool.pros.some(hasCJK)) {
        console.warn(`  [Warning] CJK still found in pros for ${tool.name}: ${tool.pros}`);
      }
      if (tool.cons && tool.cons.some(hasCJK)) {
        console.warn(`  [Warning] CJK still found in cons for ${tool.name}: ${tool.cons}`);
      }
      
      return tool;
    });
    
    // Serialize tools
    const serializedElements = sanitizedTools.map(serializeTool);
    const newContent = `${header}\n${serializedElements.join(',\n')}\n];\n`;
    
    // Write back
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Successfully wrote sanitized data to ${filePath}\n`);
  }
}

runSanitization().then(() => {
  console.log('Database sanitization completed successfully!');
}).catch(err => {
  console.error('Error running sanitization:', err);
});
