import type { Tool } from '@/lib/data';

export interface Deal {
  id: string;
  toolId: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  expires?: string;
  type: 'Promo' | 'Evergreen' | 'FreeStudent';
  link: string;
}

export const activeDeals: Deal[] = [
  // 1. Promo Codes & Sales (限时特惠与优惠码)
  // 2. Evergreen Commercial Savings & Free Trials (长期省钱方案与官方免费评估)
  {
    id: 'd-alibre-installments',
    toolId: 't30', // Alibre Design
    title: 'Alibre Design Interest-Free Financing',
    description: 'Acquire professional, SolidWorks-like 3D parametric perpetual licenses without the upfront strain. 10-month interest-free payment plans are available.',
    discount: '10-Month Interest-Free Plan',
    type: 'Evergreen',
    link: 'https://www.alibre.com/buy-now/',
  },
  {
    id: 'd-alibre-trial',
    toolId: 't30', // Alibre Design
    title: 'Alibre Design 30-Day Free Trial',
    description: 'Try the fully featured 3D CAD software (Atom3D, Pro, or Expert) free for 30 days. No credit card required.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.alibre.com/free-trial/',
  },
  {
    id: 'd-autocad-annual',
    toolId: 't1', // AutoCAD
    title: 'AutoCAD Annual Plan Discount',
    description: 'Save 10% compared to monthly payments by choosing the AutoCAD annual subscription plan.',
    discount: 'Save 10% Annually',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/autocad/overview',
  },
  {
    id: 'd-autocad-trial',
    toolId: 't1', // AutoCAD
    title: 'AutoCAD 30-Day Free Trial',
    description: 'Download a free 30-day trial of AutoCAD to design and draft with the latest features and specialized toolsets.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/autocad/free-trial',
  },
  {
    id: 'd-revit-trial',
    toolId: 't4', // Revit
    title: 'Autodesk Revit 30-Day Free Trial',
    description: 'Get full access to Autodesk Revit free for 30 days to evaluate its Building Information Modeling (BIM) tools.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/revit/free-trial',
  },
  {
    id: 'd-archicad-trial',
    toolId: 't9', // ArchiCAD
    title: 'ArchiCAD 30-Day Free Evaluation',
    description: 'Register for a 30-day fully functional trial license of ArchiCAD to experience Graphisoft\'s architect-centric BIM design workflow.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://graphisoft.com/try-archicad',
  },
  {
    id: 'd-inventor-trial',
    toolId: 't20', // Autodesk Inventor
    title: 'Autodesk Inventor 30-Day Free Trial',
    description: 'Test Inventor\'s professional-grade 3D mechanical design, simulation, and tooling features free for 30 days.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/inventor/free-trial',
  },
  {
    id: 'd-solidedge-trial',
    toolId: 't16', // Solid Edge
    title: 'Siemens Solid Edge 30-Day Evaluation',
    description: 'Get a 30-day trial of Solid Edge to experience Synchronous Technology for fast 3D modeling and sheet metal design.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://solidedge.siemens.com/en/solutions/users/free-trials/',
  },
  {
    id: 'd-creo-trial',
    toolId: 't23', // PTC Creo
    title: 'PTC Creo 30-Day Free Trial',
    description: 'Evaluate the industry standard parametric 3D CAD powerhouse with a full 30-day evaluation package.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.ptc.com/en/products/creo/trial',
  },
  {
    id: 'd-draftsight-trial',
    toolId: 't22', // DraftSight
    title: 'DraftSight Premium 30-Day Free Trial',
    description: 'Experience professional 2D and 3D DWG design with full constraint support and advanced APIs free for 30 days.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.draftsight.com/FreeTrial',
  },
  {
    id: 'd-tekla-trial',
    toolId: 't15', // Tekla Structures
    title: 'Tekla Structures 30-Day Free Trial',
    description: 'Apply for a free 30-day trial to model steel, concrete, and timber structures with Tekla\'s advanced LOD 500 BIM system.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.tekla.com/products/tekla-structures/free-trial',
  },
  {
    id: 'd-shapr3d-trial',
    toolId: 't25', // Shapr3D
    title: 'Shapr3D Pro 14-Day Free Trial',
    description: 'Get full access to Shapr3D Pro on desktop or iPad with unlimited Parasolid modeling and high-resolution export for 2 weeks.',
    discount: '14-Day Free Pro Trial',
    type: 'Evergreen',
    link: 'https://www.shapr3d.com/pricing',
  },
  {
    id: 'd-microstation-trial',
    toolId: 't21', // MicroStation
    title: 'Bentley MicroStation 14-Day Trial',
    description: 'Download the infrastructure standard CAD modeler and test its universal DGN/DWG processing tools free for 14 days.',
    discount: '14-Day Free Trial',
    type: 'Evergreen',
    link: 'https://www.bentley.com/software/microstation/',
  },
  {
    id: 'd-sketchup-annual',
    toolId: 't3', // SketchUp
    title: 'SketchUp Pro Annual Plan',
    description: 'Save on 3D modeling and layout documentation by selecting the annual subscription billing option.',
    discount: 'Save ~12% on Pro',
    type: 'Evergreen',
    link: 'https://www.sketchup.com/plans-and-pricing',
  },
  {
    id: 'd-fusion-annual',
    toolId: 't5', // Fusion 360
    title: 'Autodesk Fusion Annual Plan',
    description: 'Save around 33% by billing the unified CAD/CAM/CAE workspace annually instead of monthly.',
    discount: 'Save 33% Annually',
    type: 'Evergreen',
    link: 'https://www.autodesk.com/products/fusion-360',
  },
  {
    id: 'd-vectorworks-edu',
    toolId: 't17', // Vectorworks
    title: 'Vectorworks Academic Pricing',
    description: 'Deep student discounts on professional BIM, landscape design, and entertainment architecture design tools.',
    discount: 'Over 90% OFF',
    type: 'Evergreen',
    link: 'https://www.vectorworks.net/',
  },

  // 3. Free & Student / Academic Plans (教育与免费授权计划)
  {
    id: 'd-sketchup-student-studio',
    toolId: 't3', // SketchUp
    title: 'SketchUp Studio for Higher Education',
    description: 'Students and educators can access the full SketchUp Studio package (including V-Ray, Revit importer, and Sefaira) for just $55/year (regularly $349/year).',
    discount: '$55/Year Student Plan',
    type: 'FreeStudent',
    link: 'https://www.sketchup.com/plans-and-pricing/higher-education',
  },
  {
    id: 'd-rhino-student-buyout',
    toolId: 't6', // Rhino 3D
    title: 'Rhino 3D Education License',
    description: 'Rhino offers heavily discounted education licenses for students and educators. Like commercial Rhino, education licenses are perpetual (no subscription), but they are restricted to learning and academic use — commercial work is not permitted on an education license.',
    discount: 'Education Pricing (Non-Commercial)',
    type: 'FreeStudent',
    link: 'https://www.rhino3d.com/edu',
  },
  {
    id: 'd-revit-student',
    toolId: 't4', // Revit
    title: 'Autodesk Revit Free Student Access',
    description: 'Get free 1-year renewable academic access to Revit and other Autodesk design tools for learning and teaching.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-archicad-student',
    toolId: 't9', // ArchiCAD
    title: 'ArchiCAD Free Academic License',
    description: 'Graphisoft provides verified architectural students, teachers, and schools with free renewable academic licenses of ArchiCAD.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://graphisoft.com/solutions/education',
  },
  {
    id: 'd-inventor-student',
    toolId: 't20', // Autodesk Inventor
    title: 'Autodesk Inventor Free Student Access',
    description: 'Access the complete professional 3D mechanical design and simulation suite for free under Autodesk\'s Education plan.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-solidedge-student',
    toolId: 't16', // Solid Edge
    title: 'Siemens Solid Edge Student Edition',
    description: '100% free, full-featured academic package of Solid Edge for school, university, or self-study projects.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://solidedge.siemens.com/en/solutions/users/students/',
  },
  {
    id: 'd-solidedge-hobbyist',
    toolId: 't16', // Solid Edge
    title: 'Solid Edge Community Edition for Hobbyists',
    description: 'Siemens provides makers, DIY-designers, and hobbyists with a free version of Solid Edge for personal use.',
    discount: '100% FREE Community Edition',
    type: 'FreeStudent',
    link: 'https://solidedge.siemens.com/en/solutions/users/hobbyists-and-makers/',
  },
  {
    id: 'd-creo-student',
    toolId: 't23', // PTC Creo
    title: 'PTC Creo University Student Edition',
    description: 'Claim a free or heavily discounted academic package of Creo Parametric for university assignments or K-12 learning.',
    discount: '100% FREE / Academic Discount',
    type: 'FreeStudent',
    link: 'https://www.ptc.com/en/academic-program/products',
  },
  {
    id: 'd-tekla-student',
    toolId: 't15', // Tekla Structures
    title: 'Tekla Campus Student License',
    description: 'Register at Tekla Campus to download a free student license of Tekla Structures and Trimble Connect for self-learning.',
    discount: '100% FREE Learning License',
    type: 'FreeStudent',
    link: 'https://campus.tekla.com/',
  },
  {
    id: 'd-microstation-student',
    toolId: 't21', // MicroStation
    title: 'Bentley Education Free Software Access',
    description: 'Bentley Systems offers free 1-year renewable access to MicroStation and 50+ other design tools for verified students and faculty.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://education.bentley.com/',
  },
  {
    id: 'd-draftsight-student-plan',
    toolId: 't22', // DraftSight
    title: 'DraftSight Standard Student Subscription',
    description: 'Verified students can get a full 12-month license of DraftSight Standard 2D CAD for just $99 (over 60% savings).',
    discount: '$99/Year Student Plan',
    type: 'FreeStudent',
    link: 'https://www.draftsight.com/how-to-buy/education-draftsight',
  },
  {
    id: 'd-shapr3d-free-edu',
    toolId: 't25', // Shapr3D
    title: 'Shapr3D Pro for Education',
    description: 'Get Shapr3D Pro (including Parasolid engine, unlimited export options, and desk/mobile sync) 100% free for students and educators.',
    discount: '100% FREE Pro for Edu',
    type: 'FreeStudent',
    link: 'https://www.shapr3d.com/education',
  },
  {
    id: 'd-zwcad-free-edu',
    toolId: 't12', // ZWCAD
    title: 'ZWCAD Renewable Student License',
    description: 'ZWSOFT provides verified students and teachers with free 12-month renewable licenses of ZWCAD to support architectural learning.',
    discount: '100% FREE for Students',
    type: 'FreeStudent',
    link: 'https://www.zwsoft.com/community/education',
  },
  {
    id: 'd-autocad-student',
    toolId: 't1', // AutoCAD
    title: 'AutoCAD Student Free Access',
    description: 'Get free 1-year renewable access to Autodesk software and services for educational purposes.',
    discount: '100% FREE / Student',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-solidworks-student',
    toolId: 't2', // SolidWorks
    title: 'SolidWorks for Students',
    description: 'Access the complete CAD/CAE suite for education, including free CSWA/CSWP exam certification vouchers.',
    discount: '90% OFF / Free CSWA',
    type: 'FreeStudent',
    link: 'https://www.solidworks.com/solution/organization-type/students',
  },
  {
    id: 'd-fusion-hobbyist',
    toolId: 't5', // Fusion 360
    title: 'Autodesk Fusion for Personal Use',
    description: 'Free version for non-commercial projects, qualifying hobbyists, and startups generating under $1,000/year.',
    discount: 'FREE for Hobbyists',
    type: 'FreeStudent',
    link: 'https://www.autodesk.com/products/fusion-360/personal',
  },
  {
    id: 'd-onshape-free',
    toolId: 't14', // Onshape
    title: 'Onshape Free Non-Commercial Plan',
    description: 'Professional cloud-native parametric CAD for makers, hobbyists, and open-source project designers.',
    discount: 'FREE / Public Docs',
    type: 'FreeStudent',
    link: 'https://www.onshape.com/en/products/free',
  },
  {
    id: 'd-solvespace-free',
    toolId: 't29', // SolveSpace
    title: 'SolveSpace Minimalist CAD',
    description: 'SolveSpace is a 100% free, open-source constraint-based parametric modeler. Perpetual access with no registration.',
    discount: '100% FREE Forever',
    type: 'FreeStudent',
    link: 'https://solvespace.com/download.pl',
  },
  {
    id: 'd-freecad-free',
    toolId: 't11', // FreeCAD
    title: 'FreeCAD Open Source Desktop CAD',
    description: '100% free and open-source parametric 3D CAD modeling software. Perpetual access with no restrictions.',
    discount: '100% FREE Forever',
    type: 'FreeStudent',
    link: 'https://www.freecad.org/',
  },
  {
    id: 'd-qcad-free',
    toolId: 't55', // QCAD
    title: 'QCAD Community Edition',
    description: 'Community-driven, free, open-source 2D CAD systems for drafting, schematics, and vector engineering.',
    discount: '100% FREE Core',
    type: 'FreeStudent',
    link: 'https://qcad.org/',
  },
  {
    id: 'd-blender-free',
    toolId: 't51', // Blender
    title: 'Blender 3D Suite',
    description: 'Free open-source 3D software for modeling, rigging, animation, rendering, simulation, and compositing.',
    discount: '100% FREE Creator Suite',
    type: 'FreeStudent',
    link: 'https://www.blender.org/',
  },

  // BATCH 2: Evergreen Free Trials — Major Commercial Tools
  {
    id: 'd-catia-trial', toolId: 't7', title: 'CATIA Free Trial Request',
    description: 'Request a free trial of CATIA, the industry-leading 3D CAD platform for aerospace, automotive, and industrial design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.3ds.com/products-services/catia/trial/',
  },
  {
    id: 'd-siemens-nx-trial', toolId: 't8', title: 'Siemens NX Free Trial',
    description: 'Experience Siemens NX industrial-grade CAD/CAM/CAE with a free trial. Full parametric modeling, assembly design, and simulation.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.plm.automation.siemens.com/global/en/products/nx/',
  },
  {
    id: 'd-civil3d-trial', toolId: 't44', title: 'Autodesk Civil 3D 30-Day Free Trial',
    description: 'Download a free 30-day trial of Civil 3D for civil engineering design, documentation, and BIM workflows.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/civil-3d/free-trial',
  },
  {
    id: 'd-civil3d-student', toolId: 't44', title: 'Civil 3D Free Student Access',
    description: 'Students and educators get free renewable access to Civil 3D through Autodesk Education plan.',
    discount: '100% FREE for Students', type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-navisworks-trial', toolId: 't36', title: 'Autodesk Navisworks 30-Day Free Trial',
    description: 'Try Navisworks Manage free for 30 days for BIM coordination, clash detection, and project review.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/navisworks/free-trial',
  },
  {
    id: 'd-maya-trial', toolId: 't50', title: 'Autodesk Maya 30-Day Free Trial',
    description: 'Download a free 30-day trial of Maya for 3D animation, modeling, simulation, and rendering.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/maya/free-trial',
  },
  {
    id: 'd-maya-student', toolId: 't50', title: 'Maya Free Student Access',
    description: 'Students and educators get free renewable access to Maya through Autodesk Education plan.',
    discount: '100% FREE for Students', type: 'FreeStudent',
    link: 'https://www.autodesk.com/education/edu-software',
  },
  {
    id: 'd-recap-trial', toolId: 't39', title: 'Autodesk ReCap Pro 30-Day Free Trial',
    description: 'Try ReCap Pro free for 30 days for reality capture and 3D scanning data processing.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/recap/free-trial',
  },
  {
    id: 'd-powermill-trial', toolId: 't148', title: 'Autodesk PowerMill 30-Day Free Trial',
    description: 'Download a free 30-day trial of PowerMill for high-speed 5-axis CAM programming.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/powermill/free-trial',
  },
  {
    id: 'd-netfabb-trial', toolId: 't217', title: 'Autodesk Netfabb 30-Day Free Trial',
    description: 'Try Netfabb free for 30 days for additive manufacturing preparation, simulation, and design optimization.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/netfabb/free-trial',
  },
  {
    id: 'd-moldflow-trial', toolId: 't168', title: 'Autodesk Moldflow 30-Day Free Trial',
    description: 'Download a free 30-day trial of Moldflow Insight for plastic injection molding simulation.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/moldflow/free-trial',
  },
  {
    id: 'd-robot-trial', toolId: 't242', title: 'Autodesk Robot Structural Analysis 30-Day Trial',
    description: 'Try Robot Structural Analysis free for 30 days for advanced structural analysis and design.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/robot-structural-analysis/free-trial',
  },
  {
    id: 'd-alias-trial', toolId: 't80', title: 'Alias AutoStudio 30-Day Free Trial',
    description: 'Try Alias AutoStudio free for 30 days for automotive surface modeling and Class-A surface design.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.autodesk.com/products/alias/free-trial',
  },
  {
    id: 'd-bluebeam-trial', toolId: 't34', title: 'Bluebeam Revu 30-Day Free Trial',
    description: 'Try Bluebeam Revu free for 30 days for PDF markup, document control, and construction collaboration.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.bluebeam.com/free-trial/',
  },
  {
    id: 'd-solibri-trial', toolId: 't36', title: 'Solibri Office 30-Day Free Trial',
    description: 'Try Solibri Office free for 30 days for BIM model checking, clash detection, and quality assurance.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.solibri.com/free-trial',
  },

  // BATCH 3: CAE/FEA/CFD Trials & Student Editions
  {
    id: 'd-ansys-fluent-student', toolId: 't185', title: 'ANSYS Fluent Free Student Edition',
    description: 'ANSYS offers a free Student Edition of Fluent for CFD simulation with meshing limits. Perfect for learning computational fluid dynamics.',
    discount: 'FREE Student Edition', type: 'FreeStudent',
    link: 'https://www.ansys.com/academic/students/ansys-student',
  },
  {
    id: 'd-ansys-workbench-student', toolId: 't186', title: 'ANSYS Workbench Free Student Edition',
    description: 'Get ANSYS Workbench free for students with structural, thermal, and fluid analysis capabilities. Limited mesh size but fully functional.',
    discount: 'FREE Student Edition', type: 'FreeStudent',
    link: 'https://www.ansys.com/academic/students/ansys-student',
  },
  {
    id: 'd-ansys-discovery-trial', toolId: 't187', title: 'ANSYS Discovery Free Trial',
    description: 'Try ANSYS Discovery free for instant physics simulation and interactive design exploration.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.ansys.com/products/3d-design/ansys-discovery',
  },
  {
    id: 'd-abaqus-student', toolId: 't188', title: 'Abaqus Free Student Edition',
    description: 'Dassault Systèmes offers a free Abaqus Student Edition for academic use with model size limits. Ideal for learning nonlinear FEA.',
    discount: 'FREE Student Edition', type: 'FreeStudent',
    link: 'https://www.3ds.com/products/simulia/students',
  },
  {
    id: 'd-comsol-trial', toolId: 't189', title: 'COMSOL Multiphysics Free Trial',
    description: 'Request a free trial of COMSOL Multiphysics for multiphysics simulation and modeling.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.comsol.com/free-trial',
  },
  {
    id: 'd-altair-student', toolId: 't86', title: 'Altair HyperWorks Free Student Edition',
    description: 'Altair offers free student access to HyperWorks for simulation, optimization, and CAE learning.',
    discount: 'FREE Student Edition', type: 'FreeStudent',
    link: 'https://www.altair.com/academic-program/',
  },
  {
    id: 'd-altair-inspire-trial', toolId: 't195', title: 'Altair Inspire Free Trial',
    description: 'Try Altair Inspire for generative design and topology optimization with a free trial.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://altair.com/inspire',
  },
  {
    id: 'd-sap2000-trial', toolId: 't233', title: 'CSI SAP2000 Free Trial',
    description: 'Download a free trial of SAP2000 for structural analysis and design. Fully functional for evaluation.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.csiamerica.com/products/sap2000',
  },
  {
    id: 'd-etabs-trial', toolId: 't234', title: 'CSI ETABS Free Trial',
    description: 'Download a free trial of ETABS for building analysis and design. Fully functional for evaluation.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.csiamerica.com/products/etabs',
  },
  {
    id: 'd-staad-trial', toolId: 't235', title: 'Bentley STAAD.Pro Free Trial',
    description: 'Try STAAD.pro free for structural analysis and design of steel, concrete, and timber structures.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.bentley.com/software/staad-pro/',
  },
  {
    id: 'd-midas-civil-trial', toolId: 't126', title: 'MIDAS Civil Free Trial',
    description: 'Request a free trial of MIDAS Civil for bridge and civil structure analysis and design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.midasoft.com/products/midascivil',
  },
  {
    id: 'd-midas-gen-trial', toolId: 't127', title: 'MIDAS Gen Free Trial',
    description: 'Request a free trial of MIDAS Gen for building structural analysis and design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.midasoft.com/products/midasgen',
  },
  {
    id: 'd-cypecad-trial', toolId: 't136', title: 'CYPECAD Free Trial',
    description: 'Request a free trial of CYPECAD for building design and analysis per Eurocode.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.cype.com/en/cypecad/',
  },
  {
    id: 'd-idea-statica-trial', toolId: 't243', title: 'IDEA StatiCa Free Trial',
    description: 'Try IDEA StatiCa free for steel connection design and verification per Eurocode.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.ideastatica.com/free-trial',
  },
  {
    id: 'd-idea-statica-student', toolId: 't243', title: 'IDEA StatiCa Free Student Edition',
    description: 'IDEA StatiCa offers a free Student Edition for steel connection design learning and coursework.',
    discount: '100% FREE for Students', type: 'FreeStudent',
    link: 'https://www.ideastatica.com/education',
  },
  {
    id: 'd-risa-trial', toolId: 't244', title: 'RISA-3D Free Trial',
    description: 'Download a free trial of RISA-3D for structural analysis and design of 3D structures.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://risa.com/products/risa-3d',
  },
  {
    id: 'd-simscale-free', toolId: 't193', title: 'SimScale Free Community Plan',
    description: 'SimScale offers a free Community plan for CFD, FEA, and thermal simulation in the cloud. Limited to public projects.',
    discount: 'FREE Community Plan', type: 'FreeStudent',
    link: 'https://www.simscale.com/pricing/',
  },
  {
    id: 'd-femap-trial', toolId: 't194', title: 'Siemens Femap Free Trial',
    description: 'Try Femap free for 30 days for FEA pre/post processing with Nastran solvers.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://plm.sw.siemens.com/en-US/simcenter/mechanical-simulation/femap/',
  },
  {
    id: 'd-starccm-trial', toolId: 't191', title: 'Simcenter STAR-CCM+ Free Trial',
    description: 'Request a free trial of STAR-CCM+ for CFD and multiphysics simulation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://plm.sw.siemens.com/en-US/simcenter/fluids-thermal-simulation/star-ccm/',
  },
  {
    id: 'd-autopipe-trial', toolId: 't210', title: 'Bentley AutoPIPE Free Trial',
    description: 'Try AutoPIPE free for pipe stress analysis under static and dynamic loads.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.bentley.com/software/autopipe/',
  },
  {
    id: 'd-caesar-trial', toolId: 't209', title: 'Hexagon CAESAR II Free Trial',
    description: 'Request a free trial of CAESAR II for piping stress and flexibility analysis.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://hexagon.com/products/caesar-ii',
  },
  {
    id: 'd-lusas-trial', toolId: 't123', title: 'LUSAS Free Trial',
    description: 'Request a free trial of LUSAS for structural, bridge, and geotechnical analysis.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.lusas.com/',
  },
  {
    id: 'd-scia-trial', toolId: 't147', title: 'SCIA Engineer Free Trial',
    description: 'Request a free trial of SCIA Engineer for structural analysis and design of buildings and bridges.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.scia.net/',
  },
  {
    id: 'd-tekla-tedds-trial', toolId: 't236', title: 'Tekla Tedds Free Trial',
    description: 'Try Tekla Tedds free for 30 days for structural engineering calculations and document automation.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.tekla.com/products/tekla-tedds',
  },
  {
    id: 'd-tekla-tedds-student', toolId: 't236', title: 'Tekla Tedds Student License',
    description: 'Students can access Tekla Tedds for free through Trimble academic program for structural calculations.',
    discount: '100% FREE for Students', type: 'FreeStudent',
    link: 'https://campus.tekla.com/',
  },

  // BATCH 4: Free & Open Source Tools
  {
    id: 'd-librecad-free', toolId: 't60', title: 'LibreCAD Free 2D CAD',
    description: 'LibreCAD is a 100% free, open-source 2D CAD application for Windows, macOS, and Linux. DXF native format, no registration required.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://librecad.org/',
  },
  {
    id: 'd-openscad-free', toolId: 't24', title: 'OpenSCAD Free 3D CAD',
    description: 'OpenSCAD is a free, open-source script-based 3D CAD modeler. Create solid 3D objects from code — perfect for parametric design.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://openscad.org/',
  },
  {
    id: 'd-kicad-free', toolId: 't198', title: 'KiCad Open Source EDA',
    description: 'KiCad is a 100% free, open-source EDA suite for PCB design with schematic capture, PCB layout, and 3D viewer. No limitations.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.kicad.org/',
  },
  {
    id: 'd-ltspice-free', toolId: 't202', title: 'LTspice Free SPICE Simulator',
    description: 'LTspice is a free, high-performance SPICE simulator by Analog Devices for analog circuit simulation and schematic capture.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html',
  },
  {
    id: 'd-circuitmaker-free', toolId: 't205', title: 'CircuitMaker Free PCB Design',
    description: 'CircuitMaker is Altium free, community-driven PCB design platform for makers, hobbyists, and open-source hardware projects.',
    discount: '100% FREE for Makers', type: 'FreeStudent',
    link: 'https://circuitmaker.com/',
  },
  {
    id: 'd-openfoam-free', toolId: 't192', title: 'OpenFOAM Open Source CFD',
    description: 'OpenFOAM is a free, open-source CFD toolbox for computational fluid dynamics simulation. No license fees, ever.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.openfoam.com/',
  },
  {
    id: 'd-ultimaker-cura-free', toolId: 't213', title: 'UltiMaker Cura Free Slicer',
    description: 'Cura is the world most popular free 3D printing slicer. Open-source with 200+ material profiles and plugin support.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://ultimaker.com/software/ultimaker-cura/',
  },
  {
    id: 'd-prusaslicer-free', toolId: 't214', title: 'PrusaSlicer Free 3D Printing Slicer',
    description: 'PrusaSlicer is a free, open-source slicer for FDM, SLA, and MSLA 3D printers. Advanced supports, infill, and multi-material support.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.prusa3d.com/page/prusaslicer_424/',
  },
  {
    id: 'd-bambu-studio-free', toolId: 't215', title: 'Bambu Studio Free Slicer',
    description: 'Bambu Studio is a free, open-source 3D printing slicer optimized for Bambu Lab printers with multi-color and high-speed support.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://bambulab.com/en/download/studio',
  },
  {
    id: 'd-designspark-free', toolId: 't122', title: 'DesignSpark Mechanical Free CAD',
    description: 'DesignSpark Mechanical is a free 3D CAD tool by RS Components for makers and engineers. Direct modeling with no license fees.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.rs-online.com/designspark/mechanical',
  },
  {
    id: 'd-meshlab-free', toolId: 't37', title: 'MeshLab Free 3D Mesh Processing',
    description: 'MeshLab is a free, open-source tool for processing and editing 3D triangular meshes. Ideal for 3D scanning, cleaning, and optimization.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.meshlab.net/',
  },
  {
    id: 'd-pconplanner-free', toolId: 't107', title: 'pCon.planner Free 3D Interior Design',
    description: 'pCon.planner is a free 3D interior design and space planning tool with DWG support, rendering, and furniture catalog integration.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://pcon-planner.com/',
  },
  {
    id: 'd-dwg-trueview-free', toolId: 't49', title: 'DWG TrueView Free Viewer',
    description: 'DWG TrueView is Autodesk free DWG viewer for viewing, plotting, and converting DWG and DXF files without a CAD license.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.autodesk.com/viewers/dwg-trueview',
  },
  {
    id: 'd-multisim-free', toolId: 't201', title: 'NI Multisim Free for Students',
    description: 'Multisim Live is a free, browser-based SPICE simulation and circuit analysis tool for students and educators.',
    discount: 'FREE Student Edition', type: 'FreeStudent',
    link: 'https://www.multisim.com/',
  },
  {
    id: 'd-tinkercad-free', toolId: 't237', title: 'Tinkercad Free 3D Design',
    description: 'Tinkercad is a free, browser-based 3D design and electronics tool by Autodesk. Perfect for beginners and education.',
    discount: '100% FREE Forever', type: 'FreeStudent',
    link: 'https://www.tinkercad.com/',
  },
  {
    id: 'd-opencascade-free', toolId: 't40', title: 'OpenCASCADE Free CAD Platform',
    description: 'OpenCASCADE is a free, open-source 3D modeling kernel and CAD development platform for custom CAD applications.',
    discount: '100% FREE Open Source', type: 'FreeStudent',
    link: 'https://www.opencascade.com/',
  },
  {
    id: 'd-rootpro-free', toolId: 't115', title: 'RootPro CAD Free Edition',
    description: 'RootPro CAD offers a free edition with full 2D drafting capabilities. Upgradable to Professional for advanced features.',
    discount: '100% FREE Edition', type: 'FreeStudent',
    link: 'https://www.rootprocad.com/',
  },
  {
    id: 'd-crowncad-free', toolId: 't108', title: 'CrownCAD Free Cloud CAD',
    description: 'CrownCAD offers a free plan for cloud-based 3D CAD with parametric modeling, assembly design, and collaboration tools.',
    discount: 'FREE Cloud Plan', type: 'FreeStudent',
    link: 'https://www.crowncad.com/',
  },
  {
    id: 'd-easyeda-free', toolId: 't199', title: 'EasyEDA Free Online PCB Design',
    description: 'EasyEDA is a free, browser-based PCB design suite with schematic capture, SPICE simulation, and PCB layout.',
    discount: '100% FREE Online', type: 'FreeStudent',
    link: 'https://easyeda.com/',
  },
  {
    id: 'd-arcsite-free', toolId: 't92', title: 'ArcSite Free Plan',
    description: 'ArcSite offers a free plan for mobile CAD drawing and field documentation on iPad and Android tablets.',
    discount: 'FREE Mobile Plan', type: 'FreeStudent',
    link: 'https://arcsite.app/pricing',
  },
  {
    id: 'd-cad-reader-free', toolId: 't93', title: 'CAD Reader Free DWG Viewer',
    description: 'CAD Reader is a free mobile and desktop DWG/DXF viewer with measurement, markup, and sharing tools.',
    discount: '100% FREE Viewer', type: 'FreeStudent',
    link: 'https://www.glodon.com/products/cad-reader',
  },
  {
    id: 'd-solid-edge-viewer-free', toolId: 't48', title: 'Solid Edge Free Viewer',
    description: 'Solid Edge offers a free viewer for viewing, measuring, and markup of Solid Edge and JT files without a license.',
    discount: '100% FREE Viewer', type: 'FreeStudent',
    link: 'https://solidedge.siemens.com/en/solutions/users/free-viewers/',
  },

  {
    id: 'd-bricscad-trial',
    toolId: 't13', // BricsCAD
    title: 'BricsCAD 30-Day Free Trial',
    description: 'Download a fully functional 30-day free trial of BricsCAD — the all-in-one 2D, 3D, BIM, and mechanical CAD platform. No credit card required.',
    discount: '30-Day Free Trial',
    type: 'Evergreen',
    link: 'https://bricscad.octave.com/bricscad-download',
  },

  // BATCH 5: EDA & Mid-Tier Vendor Trials
  {
    id: 'd-altium-trial', toolId: 't10', title: 'Altium Designer Free Trial',
    description: 'Try Altium Designer free for 30 days — the industry standard for professional PCB design.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.altium.com/altium-designer/free-trial',
  },
  {
    id: 'd-altium365-trial', toolId: 't204', title: 'Altium 365 Free Trial',
    description: 'Try Altium 365 free for 30 days — cloud-connected PCB design platform with version control and collaboration.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.altium.com/altium-365/free-trial',
  },
  {
    id: 'd-orcad-trial', toolId: 't161', title: 'OrCAD Free Trial',
    description: 'Try OrCAD PCB Designer free for 30 days for schematic capture and PCB layout.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.orcad.com/free-trial',
  },
  {
    id: 'd-pads-trial', toolId: 't162', title: 'Siemens PADS Professional Free Trial',
    description: 'Request a free trial of PADS Professional for PCB design and analysis.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.sw.siemens.com/en-US/products/pads',
  },
  {
    id: 'd-diptrace-trial', toolId: 't200', title: 'DipTrace Free Trial',
    description: 'Try DipTrace free for 30 days for PCB design with schematic capture and layout.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://diptrace.com/download/download-diptrace/',
  },
  {
    id: 'd-proteus-trial', toolId: 't203', title: 'Proteus Design Suite Free Trial',
    description: 'Download a free trial of Proteus for PCB design with circuit simulation.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.labcenter.com/download/',
  },
  {
    id: 'd-pulsonix-trial', toolId: 't164', title: 'Pulsonix Free Trial',
    description: 'Try Pulsonix free for 30 days for PCB design with schematic capture and autorouting.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.pulsonix.com/free-trial',
  },
  {
    id: 'd-quadcept-trial', toolId: 't114', title: 'Quadcept Free Trial',
    description: 'Try Quadcept free for 30 days — cloud-based EDA for schematic capture and PCB design.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.quadcept.com/trial',
  },
  {
    id: 'd-varicad-trial', toolId: 't41', title: 'VariCAD Free Trial',
    description: 'Try VariCAD free for 30 days — 3D parametric mechanical CAD with sheet metal and BOM.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.varicad.com/en/demo/',
  },
  {
    id: 'd-ironcad-trial', toolId: 't58', title: 'IronCAD Free Trial',
    description: 'Try IronCAD free for 30 days for 3D design with innovative drag-and-drop modeling.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.ironcad.com/free-trial/',
  },
  {
    id: 'd-actcad-trial', toolId: 't143', title: 'ActCAD Free Trial',
    description: 'Try ActCAD free for 30 days — professional DWG-compatible 2D/3D CAD with IntelliCAD engine.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://actcad.com/free-trial',
  },
  {
    id: 'd-clo3d-trial', toolId: 't69', title: 'CLO 3D Free Trial',
    description: 'Try CLO 3D free for 30 days for 3D garment design, pattern making, and virtual sampling.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.clo3d.com/try',
  },
  {
    id: 'd-marvelous-trial', toolId: 't222', title: 'Marvelous Designer Free Trial',
    description: 'Try Marvelous Designer free for 30 days for 3D clothing simulation and pattern design.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://marvelousdesigner.com/trial',
  },
  {
    id: 'd-browzwear-trial', toolId: 't221', title: 'Browzwear Free Trial',
    description: 'Request a free trial of Browzwear VStitcher for 3D garment design and virtual fashion prototyping.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://browzwear.com/free-trial',
  },
  {
    id: 'd-simplify3d-trial', toolId: 't216', title: 'Simplify3D Free Trial',
    description: 'Try Simplify3D free for 14 days for advanced 3D printing slicer software with multi-process support.',
    discount: '14-Day Free Trial', type: 'Evergreen',
    link: 'https://www.simplify3d.com/free-trial/',
  },
  {
    id: 'd-vray-trial', toolId: 't226', title: 'V-Ray Free Trial',
    description: 'Try V-Ray free for 30 days — photorealistic rendering for 3ds Max, Maya, SketchUp, Rhino, and Revit.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.chaos.com/free-trial',
  },
  {
    id: 'd-corona-trial', toolId: 't227', title: 'Corona Renderer Free Trial',
    description: 'Try Corona Renderer free for 30 days — photorealistic rendering for 3ds Max and Cinema 4D.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.chaos.com/free-trial',
  },
  {
    id: 'd-d5render-free', toolId: 't225', title: 'D5 Render Free Community Version',
    description: 'D5 Render offers a free Community version for real-time architectural rendering with limited features.',
    discount: 'FREE Community Version', type: 'FreeStudent',
    link: 'https://www.d5render.com/pricing',
  },
  {
    id: 'd-substance-trial', toolId: 't228', title: 'Adobe Substance 3D Painter Free Trial',
    description: 'Try Substance 3D Painter free for 7 days — industry-standard 3D texturing and material painting.',
    discount: '7-Day Free Trial', type: 'Evergreen',
    link: 'https://www.adobe.com/products/substance3d-painter.html',
  },
  {
    id: 'd-mastercam-student', toolId: 't28', title: 'Mastercam Free Learning Edition',
    description: 'Mastercam offers a free Learning Edition for students and educators — full CAM functionality with no post-processor.',
    discount: 'FREE Learning Edition', type: 'FreeStudent',
    link: 'https://www.mastercam.com/en/Support/Downloads/Learning-Edition',
  },
  {
    id: 'd-esprit-trial', toolId: 't151', title: 'ESPRIT Free Trial',
    description: 'Request a free trial of ESPRIT CAM for CNC programming and toolpath simulation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.espritcam.com/free-trial',
  },
  {
    id: 'd-allplan-trial', toolId: 't94', title: 'Allplan Free Trial',
    description: 'Request a free trial of Allplan for BIM architecture, engineering, and construction documentation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.allplan.com/en/free-trial',
  },
  {
    id: 'd-chief-architect-trial', toolId: 't27', title: 'Chief Architect Free Trial',
    description: 'Download a free trial of Chief Architect for residential home design, 3D modeling, and construction documents.',
    discount: 'Free Trial', type: 'Evergreen',
    link: 'https://www.chiefarchitect.com/free-trial/',
  },
  {
    id: 'd-cabinet-vision-trial', toolId: 't67', title: 'Cabinet Vision Free Trial',
    description: 'Request a free trial of Cabinet Vision for cabinet design, nesting, and manufacturing documentation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.cabinetvision.com/free-trial',
  },
  {
    id: 'd-exocad-trial', toolId: 't66', title: 'exocad DentalCAD Free Trial',
    description: 'Request a free trial of exocad DentalCAD for digital dentistry and dental CAD/CAM design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://exocad.com/contact/',
  },
  {
    id: 'd-3dexperience-trial', toolId: 't100', title: '3DEXPERIENCE Free Trial',
    description: 'Request a free trial of the 3DEXPERIENCE platform for collaborative 3D design, simulation, and PLM workflows.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.3ds.com/3dexperience/',
  },
  {
    id: 'd-3dexperience-student', toolId: 't100', title: '3DEXPERIENCE Free Student Edition',
    description: 'Dassault Systemes offers free student access to 3DEXPERIENCE SOLIDWORKS and CATIA through the Academic Program.',
    discount: '100% FREE for Students', type: 'FreeStudent',
    link: 'https://www.3ds.com/edu/students',
  },
  {
    id: 'd-geomagic-trial', toolId: 't79', title: 'Geomagic Design X Free Trial',
    description: 'Request a free trial of Geomagic Design X for reverse engineering and 3D scan-to-CAD conversion.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.3dsystems.com/software/geomagic-design-x',
  },
  {
    id: 'd-keycreator-trial', toolId: 't59', title: 'KeyCreator Free Trial',
    description: 'Request a free trial of KeyCreator for direct 3D CAD modeling without parametric history constraints.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.kubotekkosmos.com/products/keycreator',
  },
  {
    id: 'd-zw3d-trial', toolId: 't89', title: 'ZW3D Free Trial',
    description: 'Try ZW3D free for 30 days for 3D CAD/CAM with parametric modeling and machining.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.zwsoft.com/product/zw3d/free-trial',
  },
  {
    id: 'd-ares-trial', toolId: 't91', title: 'ARES Commander Free Trial',
    description: 'Try ARES Commander free for 30 days — professional DWG-compatible 2D/3D CAD by Graebert.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.graebert.com/free-trial',
  },
  {
    id: 'd-kompas-trial', toolId: 't117', title: 'KOMPAS-3D Free Trial',
    description: 'Try KOMPAS-3D free for 30 days for parametric 3D mechanical design and assembly modeling.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://ascon.net/products/kompas-3d/',
  },
  {
    id: 'd-cadopia-trial', toolId: 't61', title: 'CADopia Free Trial',
    description: 'Try CADopia free for 30 days — professional DWG-compatible 2D/3D CAD with IntelliCAD engine.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.cadopia.com/download',
  },
  {
    id: 'd-cadian-trial', toolId: 't128', title: 'CADian Free Trial',
    description: 'Try CADian free for 30 days — DWG-compatible 2D/3D CAD with native IntelliCAD engine.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.cadian.com/',
  },
  {
    id: 'd-tflex-trial', toolId: 't118', title: 'T-FLEX CAD Free Trial',
    description: 'Try T-FLEX CAD free for 30 days — parametric 3D mechanical CAD with integrated PDM.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.tflex.com/',
  },
  {
    id: 'd-magics-trial', toolId: 't38', title: 'Materialise Magics Free Trial',
    description: 'Try Magics free for 30 days — the industry standard for 3D printing data preparation and file repair.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.materialise.com/en/industrial/software/magics',
  },
  {
    id: 'd-glovius-trial', toolId: 't27', title: 'Glovius Free Trial',
    description: 'Try Glovius free for 15 days for 3D CAD file viewing, measurement, and markup of CATIA, NX, SolidWorks, and STEP files.',
    discount: '15-Day Free Trial', type: 'Evergreen',
    link: 'https://www.glovius.com/free-trial',
  },
  {
    id: 'd-cad-exchanger-trial', toolId: 't28', title: 'CAD Exchanger Free Trial',
    description: 'Try CAD Exchanger free for 30 days for 3D CAD file conversion and viewing across 20+ formats.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://cadexchanger.com/free-trial',
  },
  {
    id: 'd-landfx-trial', toolId: 't82', title: 'Land F/X Free Trial',
    description: 'Request a free trial of Land F/X for AutoCAD-based irrigation design, planting, and site planning.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.landfx.com/Trial',
  },
  {
    id: 'd-carlson-trial', toolId: 't239', title: 'Carlson Survey Free Trial',
    description: 'Try Carlson Survey free for 30 days for land surveying, COGO, and field-to-finish workflows.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.carlsonsw.com/free-trial/',
  },
  {
    id: 'd-edificius-trial', toolId: 't130', title: 'Edificius Free Trial',
    description: 'Try Edificius free for 30 days for BIM architectural design with integrated rendering and quantity takeoff.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.accasoftware.com/en/edificius',
  },
  {
    id: 'd-edilus-trial', toolId: 't131', title: 'EdiLus Free Trial',
    description: 'Try EdiLus free for 30 days for structural analysis and BIM modeling of buildings per Eurocode.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://www.accasoftware.com/en/edilus',
  },
  {
    id: 'd-planbar-trial', toolId: 't158', title: 'Allplan Planbar Free Trial',
    description: 'Request a free trial of Planbar for precast concrete design, BIM modeling, and production drawing automation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.allplan.com/products/planbar/',
  },
  {
    id: 'd-magicad-trial', toolId: 't140', title: 'MagiCAD Free Trial',
    description: 'Request a free trial of MagiCAD for MEP design and BIM within AutoCAD and Revit.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.magicad.com/',
  },
  {
    id: 'd-dds-cad-trial', toolId: 't157', title: 'DDS-CAD Free Trial',
    description: 'Request a free trial of DDS-CAD for MEP engineering and building services design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.dds-cad.com/',
  },
  {
    id: 'd-drofus-trial', toolId: 't159', title: 'dRofus Free Trial',
    description: 'Request a free trial of dRofus for BIM data management, project coordination, and facility management.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.drofus.com/',
  },
  {
    id: 'd-cadwork-trial', toolId: 't139', title: 'cadwork Free Trial',
    description: 'Request a free trial of cadwork for timber construction, carpentry, and wood building design.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://cadwork.com/',
  },
  {
    id: 'd-renga-trial', toolId: 't119', title: 'Renga Free Trial',
    description: 'Try Renga free for 30 days for BIM architectural and structural design with Russian and CIS standards.',
    discount: '30-Day Free Trial', type: 'Evergreen',
    link: 'https://rengabim.com/',
  },
  {
    id: 'd-hicad-trial', toolId: 't105', title: 'HiCAD Free Trial',
    description: 'Request a free trial of HiCAD for 2D/3D mechanical and plant design CAD.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.isdgroup.com/',
  },
  {
    id: 'd-topsolid-trial', toolId: 't101', title: 'TopSolid Free Trial',
    description: 'Request a free trial of TopSolid for integrated CAD/CAM and ERP manufacturing workflows.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.topsolid.com/',
  },
  {
    id: 'd-kisssoft-trial', toolId: 't138', title: 'KISSsoft Free Trial',
    description: 'Request a free trial of KISSsoft for gear, shaft, and machine element sizing per international standards.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.kisssoft.com/',
  },
  {
    id: 'd-vertex-trial', toolId: 't141', title: 'Vertex BD Free Trial',
    description: 'Request a free trial of Vertex BD for wood and steel framed building design and manufacturing.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.vertex.fi/',
  },
  {
    id: 'd-cet-trial', toolId: 't142', title: 'CET Designer Free Trial',
    description: 'Request a free trial of CET Designer for space planning, interior design, and manufacturing documentation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.configura.com/',
  },
  {
    id: 'd-promob-trial', toolId: 't146', title: 'Promob Free Trial',
    description: 'Request a free trial of Promob for furniture design, 3D visualization, and manufacturing documentation.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.promob.com/',
  },
  {
    id: 'd-medusa4-trial', toolId: 't104', title: 'MEDUSA4 Free Trial',
    description: 'Request a free trial of MEDUSA4 for 2D/3D mechanical and plant design CAD.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.cad-schroer.com/products/medusa4/',
  },
  {
    id: 'd-3design-trial', toolId: 't78', title: '3Design Free Trial',
    description: 'Request a free trial of 3Design CAD for jewelry design and 3D modeling.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://3design.com/',
  },
  {
    id: 'd-matrixgold-trial', toolId: 't65', title: 'MatrixGold Free Trial',
    description: 'Request a free trial of MatrixGold for jewelry design with parametric modeling and rendering.',
    discount: 'Free Trial Request', type: 'Evergreen',
    link: 'https://www.gemvision.com/matrixgold',
  },
];

/**
 * Get active deals for a specific tool by its ID.
 * Returns the first matching deal (most relevant, typically Promo > Evergreen > FreeStudent).
 */
export function getDealsForTool(toolId: string): Deal[] {
  return activeDeals.filter((d) => d.toolId === toolId);
}

/**
 * Get the best (highest priority) deal for a tool.
 * Priority: Promo > Evergreen > FreeStudent
 */
export function getBestDealForTool(toolId: string): Deal | null {
  const deals = getDealsForTool(toolId);
  if (deals.length === 0) return null;
  const promo = deals.find((d) => d.type === 'Promo');
  if (promo) return promo;
  const evergreen = deals.find((d) => d.type === 'Evergreen');
  if (evergreen) return evergreen;
  return deals[0];
}
