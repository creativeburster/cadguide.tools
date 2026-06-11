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
  {
    id: 'd-bricscad-summer',
    toolId: 't13', // BricsCAD
    title: 'BricsCAD June Summer Promotion 2026',
    description: 'Enjoy a verified 15% discount on new individual licenses of BricsCAD Lite and BricsCAD Pro. Applies to both perpetual and subscription options.',
    discount: '15% OFF Perpetual & Sub',
    type: 'Promo',
    expires: '2026-06-30',
    link: 'https://www.bricsys.com/',
  },
  {
    id: 'd-progecad',
    toolId: 't57', // progeCAD Pro
    title: 'progeCAD Professional Discount',
    description: 'Get the highly versatile, DWG-compatible AutoCAD alternative with an additional discount for new perpetual licenses.',
    discount: '15% OFF Perpetual',
    type: 'Promo',
    code: 'PROGE15',
    link: 'https://www.progecad.com/buy',
  },
  {
    id: 'd-dwgfastview',
    toolId: 't53', // DWG FastView
    title: 'DWG FastView Premium Upgrade',
    description: 'Unlock full features, cloud storage, and remove ads across mobile, web, and desktop clients.',
    discount: '30% OFF Annual',
    type: 'Promo',
    code: 'FASTVIEW30',
    link: 'https://en.dwgfastview.com/upgrade',
  },
  {
    id: 'd-nanocad',
    toolId: 't56', // nanoCAD
    title: 'nanoCAD Pro Subscription Sale',
    description: 'Introductory price for new professional subscribers. Pro-grade CAD with parametric 3D modeling and 3D constraints.',
    discount: '20% OFF New Sub',
    type: 'Promo',
    link: 'https://nanocad.com/buy/',
  },
  {
    id: 'd-turbocad',
    toolId: 't62', // TurboCAD
    title: 'TurboCAD Platinum Discount',
    description: 'Special pricing on the all-in-one professional design suite. Powerful 2D drafting and 3D surface/solid modeling.',
    discount: 'Save $150 Today',
    type: 'Promo',
    link: 'https://www.turbocad.com/turbocad-windows/turbocad-platinum.html',
  },
  {
    id: 'd-zwcad-promo',
    toolId: 't12', // ZWCAD
    title: 'ZWCAD Perpetual License Promotion',
    description: 'Save big on lightweight, fast, and fully DWG-compatible CAD. Enjoy perpetual licensing with no forced updates.',
    discount: '15% OFF New License',
    type: 'Promo',
    link: 'https://www.zwsoft.com/zwcad',
  },
  {
    id: 'd-gstarcad-tradein',
    toolId: 't54', // GstarCAD
    title: 'GstarCAD Competitor Trade-in Bonus',
    description: 'Switch your AutoCAD or other CAD seat to a GstarCAD perpetual license and claim a 20% discount bonus.',
    discount: '20% Trade-in Bonus',
    type: 'Promo',
    link: 'https://www.gstarcad.net/buy',
  },

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
    title: 'Rhino 3D Student Perpetual Buyout',
    description: 'Purchase the fully-featured Rhino 3D perpetual license for just $195 (regularly $995). Fully usable for commercial projects after graduation with no expiry.',
    discount: 'Save $800 (Perpetual / Commercial-ready)',
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
  }
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
