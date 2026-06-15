import { Tool } from '@/lib/data';

const REGEX_CACHE = new Map<string, RegExp>();

function getCachedRegex(pattern: string, flags = 'gi'): RegExp {
  const cacheKey = `${pattern}_${flags}`;
  let regex = REGEX_CACHE.get(cacheKey);
  if (!regex) {
    regex = new RegExp(pattern, flags);
    REGEX_CACHE.set(cacheKey, regex);
  }
  regex.lastIndex = 0;
  return regex;
}

export interface GuideCategorySection {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  desc: string;
  countLabel: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
  tags: string[];
}

export const CATEGORY_SECTIONS: GuideCategorySection[] = [
  {
    id: 'sec-trouble',
    category: 'troubleshooting',
    title: 'CAD Software Troubleshooting',
    desc: 'Diagnose and resolve fatal runtime locks, active memory leaks, registry socket deadlocks, and licensing activation crashes. Recover corrupt engineering DWG/BIM assets and restore unsaved temporary drawing sessions without data loss.',
    countLabel: '450+ Active Guides',
    gradient: 'from-rose-500 via-pink-600 to-red-500',
    articles: [
      { title: 'Fix AutoCAD License Activation Failed (Registry Socket Patch)', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'Why Autodesk AutoCAD Freezes on Windows 11 Large DWG Files', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad' },
      { title: 'Resolve SolidWorks Price Seat Allocation & EULA Compliance Warnings', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks price' },
      { title: 'AutoCAD Architecture Fatal Error 0x0024 Recovery Workflow', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad architecture' },
      { title: 'Revit Crash on Launch: Repairing Damaged Local BIM Models', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'revit crash' },
      { title: 'How to Fix FLEXlm Server Socket Binding Error 10048', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm error' },
      { title: 'Resolve FLEXlm Error -15: Cannot Connect to License Server', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm error' }
    ],
    tags: ['#DWG-Recovery', '#FatalError-0x0024', '#LicensePatch']
  },
  {
    id: 'sec-perf',
    category: 'performance',
    title: 'Hardware & Performance Optimization',
    desc: 'Calibrate graphic pipeline buffers, override Windows virtualization limits, allocate workstation multi-threading processors, and eliminate graphic rendering stuttering. Optimize geometry cache response on low-end hardware assemblies.',
    countLabel: '380+ Active Guides',
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    articles: [
      { title: 'Tuning SolidWorks Free & Pro Suites on Low-End Laptops', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'Best GPU Drivers & Hardware Acceleration Settings for Autodesk Inventor', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Fix Solid Edge Graphics Stuttering & Loading Delays', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solid edge' },
      { title: 'FreeCAD Custom Settings Migration for Multi-Core Workstations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'Optimize Catia V6 3D Assembly Loading Cache Protocols', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'catia v6' },
      { title: 'Laptop RAM Allocation Rules for Complex Rhino 3D NURBS Modeling', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'rhino 3d' }
    ],
    tags: ['#GPUDrivers', '#WorkstationTuning', '#RAM-Allocation']
  },
  {
    id: 'sec-print',
    category: 'printing',
    title: 'Print & PDF Plotting Standards',
    desc: 'Enforce uniform enterprise CTB pen tables, synchronize model and layout spaces, configure high-definition print margins, and fix vector conversion line weight bugs. Automate server-side batch plotting pipelines natively.',
    countLabel: '320+ Active Guides',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-500',
    articles: [
      { title: 'ISO Standard Paper Setups for AutoCAD Online Plotting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad online' },
      { title: 'How to Batch Print Multiple Drawing Formats in DraftSight', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'draftsight' },
      { title: 'CTB Custom Pen Table Setup for AutoCAD Electrical Blueprints', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Fix PDF Missing Line Weights and Scrambled Fonts After CAD Export', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad software' },
      { title: 'Standardizing Plot Styles: CTB vs STB Pen Tables for Architects', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'plot styles' },
      { title: 'Automating High-Volume Blueprints PDF Plotting on Network Servers', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'batch plotting' }
    ],
    tags: ['#PenTables-CTB', '#BatchPlot', '#PDF-Fonts']
  },
  {
    id: 'sec-stand',
    category: 'standards',
    title: 'CAD Industry Standards & Best Practices',
    desc: 'Establish standardized AIA/ANSI layer naming conventions, map mechanical ISO scale parameters, write robust BIM execution plans (BEP), and configure IEC electrical schematics. Build unified design standard frameworks.',
    countLabel: '420+ Active Guides',
    gradient: 'from-blue-500 via-indigo-600 to-violet-500',
    articles: [
      { title: 'ANSI Standard Layer Naming for Commercial CAD Building Designs', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad design' },
      { title: 'ISO Standard Dimension Scales for Mechanical Production Drafting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk autocad' },
      { title: 'IEC Electrical Schematic CAD Drawing Best Practices', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Enterprise CAD File Archiving & Version Naming Convention Standard', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad programs' },
      { title: 'BIM Execution Plan (BEP) Modeling Standards for Public Tenders', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bim standards' },
      { title: 'AIA CAD Layering Standards for Multi-Disciplinary Coordination', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'layer standards' },
      { title: 'Revit RVT to Archicad PLN via IFC4: Attribute Mapping & LOD Preservation', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'revit to archicad' }
    ],
    tags: ['#AIA-Layers', '#ISO-Dimension', '#BIM-BEP']
  },
  {
    id: 'sec-deploy',
    category: 'deployment',
    title: 'Enterprise IT Mass Deployment',
    desc: 'Mass deploy customized CAD MSIs quietly across corporate subnets. Exclude cloud-telemetry checks, map network licensing concurrent daemons on FLEXlm Options, and configure secure SAML 2.0 SSO identity pings.',
    countLabel: '280+ Active Guides',
    gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
    articles: [
      { title: 'Mass Offline Silent Installation of AutoCAD LT for Corporate Teams', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad lt' },
      { title: 'AutoCAD for Mac: Cross-Platform License Server Deployment Guide', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad for mac' },
      { title: 'How to Budget and Buy AutoCAD Seats: Multi-Version Corporate Domain Setup', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' },
      { title: 'Managing Enterprise Single Sign-On (SSO) for Named CAD Subscriptions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'FLEXlm Options File Custom Setup for Group-Based Seat Restrictions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm options' },
      { title: 'Silent Deployment Checklists for Autodesk Network License Manager', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'network licensing' }
    ],
    tags: ['#SilentInstall', '#SSO-SAML', '#OptionsFile']
  },
  {
    id: 'sec-mig',
    category: 'migration',
    title: 'CAD Software Crossover Migration',
    desc: 'Plan crossover migrations from legacy systems to cost-effective alternatives. Reclaim identical AutoLISP runtimes, import custom PGP aliases and CUIX menus, and translate coordinate databases without losing assembly constraints.',
    countLabel: '250+ Active Guides',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    articles: [
      { title: 'Complete CAD Migration Guide: AutoCAD to BricsCAD Pro Crossover', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'AutoCAD to GstarCAD Transition Guide: Setting & Command Import', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'SolidWorks to Inventor Migration: Reclaiming 3D Parametric CAD Integrity', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Migrating Legacy AutoCAD Drawings to Online Cloud CAD Natively', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'online cad' },
      { title: 'DraftSight to BricsCAD Pro Migration: AutoLISP Command Compatibility', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'draftsight alternative' },
      { title: 'Legacy MicroStation DGN to DWG CAD Translation Standards', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'dwg translation' },
      { title: 'SolidWorks XT (Parasolid) to AutoCAD SAT (ACIS): Topology Integrity Recovery', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks to autocad' },
      { title: 'CATIA V5 to SolidWorks: Kinematic Constraints Translation Workflows', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'catia to solidworks' }
    ],
    tags: ['#AutoLISP-Migrate', '#PGP-Aliases', '#BricsCAD-Transition']
  },
  {
    id: 'sec-pro',
    category: 'procurement',
    title: 'CAD Procurement & SAM Compliance',
    desc: 'Navigate corporate named-user license budgeting, SAM compliance sweeps, EULA watermarks audit rules, and accumulative SaaS vs Perpetual break-even cost analysis. Reclaim underutilized named-user tokens to optimize corporate budgets.',
    countLabel: '180+ Active Guides',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    articles: [
      { title: '3-Year Cumulative Cost Analysis: Subscription vs Perpetual CAD', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' },
      { title: 'Named User License Audits: Excluded Non-Commercial Watermarks', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'AutoCAD LT vs Pro: Optimizing Team Seat Budget Allocations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad lt' },
      { title: 'Enterprise Software Asset Management (SAM) Compliance Checklists', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad software' },
      { title: 'Understanding EULA Seat Allocations for Named Subscriptions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'B-End Procurement Guidelines: Reclaiming Idle Named User Tokens', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' }
    ],
    tags: ['#SAM-Compliance', '#SaaS-vs-Perpetual', '#TokenReclaim']
  },
  {
    id: 'sec-man',
    category: 'manufacturing',
    title: 'CAM & 3D Printing Production',
    desc: 'Align CAD to CNC G-code conversions, evaluate STL/3MF solid kernel export tolerances, calculate sheet metal folding bend allowances, and optimize 3D slicing standards. Calibrate watertight parametric solid geometries.',
    countLabel: '220+ Active Guides',
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    articles: [
      { title: 'Optimizing STEP/IGES Coordinate Translations for CNC Machining', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad design' },
      { title: 'STL & 3MF Export Tolerances: Preventing Print Facet Distortion', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'Sheet Metal Bending Allowances: Precision K-Factor Calculations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'CAD/CAM Integration: Enforcing Standard G-Code Feed Rates', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solid edge' },
      { title: '3D Printing Solid Modeling: Exporting Watertight B-Rep Assemblies', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'CNC Milling Tolerances: Calibrating CAD Geometry Kernels for Mills', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'Rhino Organic NURBS to Inventor Parametric B-Rep Sewing Tolerances', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'rhino to inventor' }
    ],
    tags: ['#CNC-GCode', '#STLExport', '#K-Factor']
  }
];

export interface GuideArticleCard {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
  softwareSlug: string;
  keyword: string;
  slug: string;
}

export const ARTICLES_LIST: GuideArticleCard[] = [
  ...CATEGORY_SECTIONS.flatMap(sec => 
    sec.articles.map((art, aIdx) => ({
      id: `${sec.id}-art-${aIdx}`,
      category: sec.category,
      title: art.title,
      excerpt: `Detailed expert blueprint for ${art.title}. Learn active-registry configuration parameters, troubleshooting, and enterprise optimization protocols tailored for enterprise engineering workflows.`,
      author: 'Will P. (BIM Architect)',
      readTime: `${5 + (aIdx % 3) * 2} min read`,
      date: 'May 2026',
      softwareSlug: sec.category === 'troubleshooting' ? 'autocad' : 'solidworks',
      keyword: art.keyword,
      slug: art.slug
    }))
  )
];

export interface DirectoryFolder {
  id: string;
  title: string;
  countLabel: string;
  icon: string;
  links: { title: string; href: string }[];
}

export const DIRECTORY_FOLDERS: DirectoryFolder[] = [
  {
    id: 'fol-trouble',
    title: 'AutoCAD & 2D Troubleshooting',
    countLabel: '450+ Guides',
    icon: '🔧',
    links: [
      { title: 'AutoCAD Fatal Error 0x0024 Complete Enterprise Patch Workflow', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Fix AutoCAD License Activation Failed & Registry Socket deadlocks', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT Offline Silent Installation & Mass MSI Deploy Parameters', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD for Mac: Cross-Platform License Server Port Configurations', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Online: Plotting Pen Weights and Layout Margins Calibration', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Architecture Custom Menu CUIX and PGP Command Aliases Restore', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Electrical Schema Libraries and IEC Template Integration', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Buy AutoCAD Seats: named user subscriptions vs FLEXlm budget estimators', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD External Reference (XREF) Lost Relative Paths batch repairs', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Fix AutoCAD Hatch Pattern Density freeze during solid drawing loads', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT vs AutoCAD Pro: Feature differences and procurement guides', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'How to Reclaim AutoCAD temporary autosave sv$ and ac$ files safely', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-perf',
    title: 'SolidWorks & 3D Performance',
    countLabel: '380+ Guides',
    icon: '🚀',
    links: [
      { title: 'Tuning SolidWorks Free & Pro Suites on Low-End Workstation Laptops', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Resolve SolidWorks Seat Allocation EULA named user compliance audits', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Tackling SolidWorks Massive Assembly lag and GPU acceleration settings', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Eliminate SolidWorks watermark warnings and non-commercialWatermark flags', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Fixing parametric assembly geometric constraints lost in SolidWorks', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks Sheet Metal K-Factor and Bending allowance parameters', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'STEP File export transformations: fixing dry assembly boundary faces', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks PDM concurrent server latency and local cache flushes', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks weldment cut lists and structural member custom profiling', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Calibrating SolidWorks drawing layout pen weights during physical print', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks to Autodesk Inventor 3D Parametric file translation checklist', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'How to bypass SolidWorks Out of Memory Resource Monitor warnings', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-standards',
    title: 'BIM & Layer Standards',
    countLabel: '420+ Guides',
    icon: '📐',
    links: [
      { title: 'Revit Crash on Launch: Repairing local BIM database models safely', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM Execution Plan (BEP) template configurations and LOD 300/400 rules', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AIA CAD Layer Naming Standards and standard corporate prefixes', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ANSI standard architectural layer allocations for commercial projects', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ISO Standard Dimension Scales and annotation font weights guidelines', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Civil 3D Geotechnical Surface alignments and Corridor best practices', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Archicad Teamwork Server Network port binding and multi-user configurations', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Navisworks Clash Detection rule sets and unified coordination reports', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM Collaboration Format (BCF) schema data export standard interfaces', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SketchUp Pro DWG imports: vector cleanups and mesh optimizations', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Rhino 3D organic NURBS to parametric solid B-Rep export tolerances', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Geotechnical layer modeling and alignment coordinates in Civil 3D', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-deploy',
    title: 'IT Licensing & Deploy',
    countLabel: '280+ Guides',
    icon: '🖥️',
    links: [
      { title: 'FLEXlm Server Daemon Port conflict fixes (TCP 27000 and 2080)', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'FLEXlm Options File: reserve and restrict seat licenses for local groups', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Deploying Single Sign-On (SSO) SAML 2.0 for Named User subscriptions', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Troubleshoot Autodesk Desktop Licensing Service background agent crashes', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Corporate CAD Seat Budget analysis: concurrent licenses vs named users', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Windows 11 virtualized memory conflicts with CAD licensing agents', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'USB Dongle hardware licensing driver conflicts on legacy OS', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Packaging CAD software MSIs with quiet deployment parameters', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD Firewall rules: disabling telemetry audits and cloud sync daemons', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'LMTools server status checks and multiple vendor daemon configurations', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Configuring Named User offline grace periods via corporate domains', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'EULA audit compliance sweeps: user credentials validation checklist', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-printing',
    title: 'Printing & PDF Options',
    countLabel: '320+ Guides',
    icon: '🖨️',
    links: [
      { title: 'ISO Standard paper sizes and plot margin configurations', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight 2D layouts batch plotting across enterprise servers', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Custom CTB pen tables vs object-dependent STB color styles', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Fixing scrambled PDF fonts and missing vector lines after CAD export', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Automating PDF export via AutoLISP scripts and folder listeners', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Enterprise drawing stamps: vector watermark security and signatures', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Fixing print spooler crashes caused by large drawing raster lines', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Viewport scale matching between AutoCAD model and paper layouts', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Line weights calibration for PDF rendering in Acrobat Reader', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Mono vs Color plot style conversions using multiple CTB tables', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DGN to DWG plot style translations and pen weights translation', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Print borders alignment and auto-trim parameters in plotter setups', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-migration',
    title: 'Crossover & API Migration',
    countLabel: '250+ Guides',
    icon: '🔄',
    links: [
      { title: 'Complete migration checklist: AutoCAD to BricsCAD Pro crossover', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Transitioning legacy menus and hatch patterns from AutoCAD to GstarCAD', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SW parametric constraint translations when migrating to Inventor', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight to BricsCAD Pro: AutoLISP API compatibility matrices', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Legacy DGN to DWG drawings translation standards and layers alignment', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Evaluating domestic CAD alternatives: performance, prices and API specs', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'FreeCAD parameterized designs vs commercial mechanical CAD logics', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Reclaiming custom LISP files in alternative CAD setups', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'PGP custom aliases and LIN line types paths mapping in GstarCAD', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Web-based cloud CAD performance limits and network latency boundaries', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ZWCAD command aliases and AutoLISP running speed optimization', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Catia V5 3D assembly coordinates downgrade to 2D DWG configurations', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-procurement',
    title: 'Procurement & SAM Compliance',
    countLabel: '180+ Guides',
    icon: '💰',
    links: [
      { title: '3-Year Cumulative Cost Analysis: Subscription vs Perpetual Buyout', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'EULA Audit Compliance: Restricting Watermarked Academic Watermarks', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT vs Pro: Optimizing seat budget allocations for large teams', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Enterprise Software Asset Management (SAM) concurrent seat strategies', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Understanding SAML SSO named user subscriptions vs Flex Token pools', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'IT Admin Guide: Reclaiming underutilized CAD seats to cut overheads', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Global Travel Rights: Purchasing multi-region CAD licensing coverage', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Reviewing maintenance subscription updates for lifetime perpetual seats', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Intellectual property protection when distributing custom LISP tools', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Small business CAD procurement: pricing tier negotiation techniques', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Consolidating CAD accounts under single domain corporate billings', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Best practices for handling formal compliance letters from software vendors', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-manufacturing',
    title: 'CAM & 3D Printing Production',
    countLabel: '220+ Guides',
    icon: '⚙️',
    links: [
      { title: 'Tuning STEP & IGES mathematical tolerances for precision CNC milling', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'STL vs 3MF export profiles: preventing polygon triangulation facets', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Sheet Metal Bending tolerances: precise K-Factor calculations in CAD', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD/CAM Toolpath setups: validating feed rates and quiet G-codes', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'watertight B-Rep models: design parameters for additive manufacturing', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Calibrating coordinate kernel tolerances for high-precision milling', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CNC cutting path feeds: feedrate deceleration rules on sharp angles', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Interference analysis in parametric CAD assemblies before CAM export', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Laser cutting vector cleanup: removing duplicate overlaid drawing lines', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '3MF vs STL: maintaining textures and colors in additive formats', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Compensating CAD model sizing for plastic mold shrinkage percentages', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Parametric face thread design standards for CNC Lathe modeling', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-cheatsheets',
    title: 'Shortcuts & Reference Sheets',
    countLabel: '17 Sheets',
    icon: '📝',
    links: [
      { title: 'Cross-Platform CAD Shortcuts Matrix', href: '/toolbox/shortcuts' },
      { title: 'SolidWorks Essential Keyboard Shortcuts List', href: '/toolbox/solidworks-shortcuts-sheet' },
      { title: 'Rhino 3D Shortcut Keys & Command Aliases Guide', href: '/toolbox/rhino-shortcuts-sheet' },
      { title: 'Revit Keyboard Shortcuts & Command Codes Table', href: '/toolbox/revit-shortcuts-sheet' },
      { title: 'SketchUp Pro Quick Reference Hotkeys Cheat Sheet', href: '/toolbox/sketchup-shortcuts-sheet' },
      { title: 'Autodesk Inventor Keyboard Shortcuts Reference', href: '/toolbox/inventor-shortcuts-sheet' },
      { title: 'Bentley MicroStation V8i Keyboard Shortcuts Guide', href: '/toolbox/microstation-shortcuts-sheet' },
      { title: 'Graphisoft Archicad Keyboard Shortcuts Chart', href: '/toolbox/archicad-shortcuts-sheet' },
      { title: 'Dassault CATIA V5/V6 Key Shortcuts Table', href: '/toolbox/catia-shortcuts-sheet' },
      { title: 'PTC Creo Parametric Shortcut Keys Reference', href: '/toolbox/creo-shortcuts-sheet' },
      { title: 'FreeCAD Open-Source CAD Hotkeys & Mouse Navigation', href: '/toolbox/freecad-shortcuts-sheet' },
      { title: 'Autodesk Fusion 360 Keyboard Hotkeys Reference', href: '/toolbox/fusion360-shortcuts-sheet' },
      { title: 'DraftSight Keyboard Shortcuts & Command Aliases', href: '/toolbox/draftsight-shortcuts-sheet' },
      { title: 'BricsCAD Hotkeys & Command Customization Guide', href: '/toolbox/bricscad-shortcuts-sheet' },
      { title: 'Vectorworks Keyboard Shortcuts Reference Chart', href: '/toolbox/vectorworks-shortcuts-sheet' },
      { title: 'AutoCAD vs. GstarCAD Shortcut Command Diff Table', href: '/toolbox/autocad-vs-gstarcad-shortcuts' },
      { title: 'AutoCAD vs. ZWCAD Command Shortcut Diff Guide', href: '/toolbox/autocad-vs-zwcad-shortcuts' }
    ]
  }
];

export interface ArchetypeMetadata {
  id: 'drafting-aec' | 'mechanical-simulation' | 'creative-visual' | 'electronics-hardware';
  name: string;
  theme: {
    accentText: string;
    badgeBg: string;
    buttonBg: string;
    gradientHeader: string;
    cardBorder: string;
  };
  categoryOrder: string[];
  jargonMap: Record<string, string>;
}

export function getArchetypeMetadata(category_id: string): ArchetypeMetadata {
  if (category_id === 'c1' || category_id === 'c3') {
    return {
      id: 'drafting-aec',
      name: 'AEC & Drafting',
      theme: {
        accentText: 'text-slate-700',
        badgeBg: 'bg-slate-50 border-slate-200 text-slate-800',
        buttonBg: 'bg-slate-700 hover:bg-slate-800 border-slate-700',
        gradientHeader: 'from-slate-700 via-slate-800 to-zinc-900',
        cardBorder: 'hover:border-slate-300'
      },
      categoryOrder: ['troubleshooting', 'printing', 'standards', 'deployment', 'procurement', 'migration', 'performance', 'manufacturing'],
      jargonMap: {
        'large dwg files': 'complex construction DWG layouts',
        'free cad platforms': 'free drafting engines',
        'cad software': 'AEC drafting software',
        'cad design': 'architectural drafting',
        'cad designs': 'building blueprint layouts',
        'cad designs standards': 'BIM standards',
        'nurbs modeling': 'IFC component mapping',
        'assembly loading': 'BIM model linking',
        'mechanical production': 'architectural details drafting',
        '3d printing': 'BIM coordination',
        'watertight': 'fully coordinated structural'
      }
    };
  }

  if (category_id === 'c2' || category_id === 'c5') {
    return {
      id: 'mechanical-simulation',
      name: 'Mechanical & Simulation',
      theme: {
        accentText: 'text-amber-700',
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-950',
        buttonBg: 'bg-amber-600 hover:bg-amber-700 border-amber-600',
        gradientHeader: 'from-amber-600 via-amber-700 to-stone-900',
        cardBorder: 'hover:border-amber-300'
      },
      categoryOrder: ['performance', 'manufacturing', 'standards', 'procurement', 'troubleshooting', 'migration', 'deployment', 'printing'],
      jargonMap: {
        'large dwg files': 'heavy parametric assemblies',
        'free cad platforms': 'free mechanical modelers',
        'cad software': '3D mechanical CAD',
        'cad design': '3D parametric design',
        'cad designs': 'watertight solid parts',
        'cad designs standards': 'ISO mechanical limits',
        'nurbs modeling': 'NURBS B-Rep solid kernels',
        'assembly loading': 'large assembly interference solvers',
        'mechanical production': 'watertight manufacturing CNC steps',
        '3d printing': 'sub-micron CNC tooling',
        'watertight': 'watertight solid B-Rep'
      }
    };
  }

  if (category_id === 'c4') {
    return {
      id: 'creative-visual',
      name: 'Creative Visualization',
      theme: {
        accentText: 'text-indigo-700',
        badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-950',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600',
        gradientHeader: 'from-indigo-700 via-indigo-800 to-violet-900',
        cardBorder: 'hover:border-indigo-300'
      },
      categoryOrder: ['performance', 'troubleshooting', 'procurement', 'printing', 'migration', 'standards', 'deployment', 'manufacturing'],
      jargonMap: {
        'large dwg files': 'high-density poly scene files',
        'free cad platforms': 'free rendering software',
        'cad software': '3D rendering software',
        'cad design': '3D scene visualization',
        'cad designs': 'high-fidelity PBR assets',
        'cad designs standards': 'production render profiles',
        'nurbs modeling': 'PBR materials and textures mapping',
        'assembly loading': 'viewport vertex shader cache',
        'mechanical production': 'real-time raytraced views',
        '3d printing': 'RTX GPU hardware allocation',
        'watertight': 'fully manifold photorealistic mesh'
      }
    };
  }

  return {
    id: 'electronics-hardware',
    name: 'Electronics & Production',
    theme: {
      accentText: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600',
      gradientHeader: 'from-emerald-600 via-emerald-700 to-teal-900',
      cardBorder: 'hover:border-emerald-300'
    },
    categoryOrder: ['manufacturing', 'performance', 'procurement', 'troubleshooting', 'deployment', 'standards', 'migration', 'printing'],
    jargonMap: {
      'large dwg files': 'multi-layer PCB layouts',
      'free cad platforms': 'free electronics EDA modelers',
      'cad software': 'PCB design EDA software',
      'cad design': 'circuit board layout drafting',
      'cad designs': 'JLCPCB watertight footprints',
      'cad designs standards': 'IPC electrical schematic guidelines',
      'nurbs modeling': 'slicer infill mesh layers',
      'assembly loading': 'G-code post-processing speedups',
      'mechanical production': 'circuit schematic traces',
      '3d printing': '3D slicer wall layers speed',
      'watertight': 'fully watertight copper traces'
    }
  };
}

export function getLocalizedTitleAndExcerpt(
  title: string,
  excerpt: string,
  keyword: string,
  category: string,
  tool: Tool
) {
  let newTitle = title;
  let newExcerpt = excerpt;
  let newKeyword = keyword;

  if (!tool) {
    return { title: newTitle, excerpt: newExcerpt, keyword: newKeyword };
  }

  const toolName = tool.name;

  // 1. Perform primary software replacements
  if (title.includes('Revit RVT to Archicad PLN') || title.toLowerCase().includes('revit to archicad')) {
    // Keep cross-software BIM standard titles intact to preserve EEAT and prevent incorrect substitutions
  } else if (category === 'migration' || category === 'crossover') {
    const targets = ['BricsCAD Pro', 'BricsCAD', 'GstarCAD', 'Inventor', 'Online Cloud CAD', 'DWG CAD'];
    let replaced = false;
    for (const target of targets) {
      if (target.toLowerCase() === toolName.toLowerCase()) continue;
      const regex = getCachedRegex(target, 'gi');
      if (regex.test(newTitle)) {
        newTitle = newTitle.replace(regex, toolName);
        newExcerpt = newExcerpt.replace(regex, toolName);
        newKeyword = newKeyword.replace(regex, toolName.toLowerCase());
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      const allSoftware = ['AutoCAD', 'SolidWorks', 'DraftSight', 'MicroStation'];
      for (const sw of allSoftware) {
        const regex = getCachedRegex(sw, 'gi');
        if (regex.test(newTitle)) {
          // 防止同名自指碰撞，例如避免出现 "SolidWorks to SolidWorks" 的穿帮
          if (newTitle.toLowerCase().includes(toolName.toLowerCase()) && sw.toLowerCase() !== toolName.toLowerCase()) {
            continue;
          }
          newTitle = newTitle.replace(regex, toolName);
          newExcerpt = newExcerpt.replace(regex, toolName);
          newKeyword = newKeyword.replace(regex, toolName.toLowerCase());
          break;
        }
      }
    }
  } else {
    const allSoftware = [
      'AutoCAD Architecture',
      'AutoCAD Electrical',
      'AutoCAD for Mac',
      'AutoCAD LT',
      'Autodesk AutoCAD',
      'AutoCAD Online',
      'AutoCAD',
      'SolidWorks',
      'BricsCAD Pro',
      'BricsCAD',
      'GstarCAD',
      'Autodesk Inventor',
      'Inventor',
      'Solid Edge',
      'FreeCAD',
      'Catia V6',
      'Catia',
      'Rhino 3D',
      'DraftSight',
      'MicroStation',
      'Revit',
      'ZWCAD',
      'BIM',
      'Commercial CAD',
      'Schematic CAD',
      'Enterprise CAD',
      'Named CAD',
      'Autodesk'
    ];

    for (const sw of allSoftware) {
      const regex = getCachedRegex(sw, 'gi');
      if (regex.test(newTitle)) {
        newTitle = newTitle.replace(regex, toolName);
        newExcerpt = newExcerpt.replace(regex, toolName);
        newKeyword = newKeyword.replace(regex, toolName.toLowerCase());
        break;
      }
    }
  }

  // 2. Perform advanced archetype-specific jargon replacements
  const meta = getArchetypeMetadata(tool.category_id);
  for (const [key, val] of Object.entries(meta.jargonMap)) {
    const regex = getCachedRegex(key, 'gi');
    newTitle = newTitle.replace(regex, val);
    newExcerpt = newExcerpt.replace(regex, val);
    newKeyword = newKeyword.replace(regex, val.toLowerCase());
  }

  return { title: newTitle, excerpt: newExcerpt, keyword: newKeyword };
}

export function getLocalizedTitle(title: string, category: string, tool: Tool): string {
  return getLocalizedTitleAndExcerpt(title, '', '', category, tool).title;
}

export function isArticleCompatibleWithTool(articleTitle: string, articleCategory: string, tool: Tool): boolean {
  const titleLower = articleTitle.toLowerCase();
  const categoryLower = articleCategory.toLowerCase();
  const pricingType = tool.pricing_type || 'Commercial';
  const isOpenSource = pricingType === 'Open Source' || pricingType === 'Free';
  
  const industries = tool.industries || [];
  const features = tool.features || [];
  const categoryId = tool.category_id || '';

  // 辅助判定工具特征
  const isBIM = categoryId === 'bim' || industries.some((i: string) => /bim|architect|construction|building/i.test(i)) || features.includes('bim-integration');
  const isMechanical = categoryId === 'mfg' || industries.some((i: string) => /mechanical|mfg|automotive|aerospace|industrial/i.test(i)) || features.includes('parametric-modeling') || features.includes('integrated-cam') || features.includes('simulation-fea');
  const is2D = categoryId === '2d-cad' || features.includes('drafting-detailing');
  const isRendering = features.includes('rendering') || industries.some((i: string) => /visual|render|creative/i.test(i));
  const is3D = features.some((f: string) => /parametric|surface|mesh|subdivision|direct/i.test(f)) || isMechanical || isBIM || isRendering;

  // 1. 开源/免费软件熔断：不生成商业授权、采购、FLEXlm、EULA 审计相关文章
  if (isOpenSource) {
    if (
      titleLower.includes('license') ||
      titleLower.includes('flexlm') ||
      titleLower.includes('eula') ||
      titleLower.includes('seat') ||
      titleLower.includes('subscription') ||
      titleLower.includes('procurement') ||
      titleLower.includes('buy') ||
      titleLower.includes('audit') ||
      categoryLower === 'procurement' ||
      categoryLower === 'deployment'
    ) {
      return false;
    }
  }

  // 2. 特殊高价值长尾文章的精细化强类型特征熔断
  
  // (A) BIM IFC4 属性协同指南 -> 只允许在真正的 3D BIM 建模与协同软件（category_id = c3）中生成，绝对屏蔽普通 2D CAD 和机械软件
  if (titleLower.includes('ifc4') || titleLower.includes('revit to archicad') || titleLower.includes('rvt to archicad')) {
    if (categoryId !== 'c3') return false;
  }

  // (B) Rhino NURBS 到 Inventor 实体缝合 -> 必须是 3D 且支持曲面/参数化造型的机械或工业设计软件
  if (titleLower.includes('nurbs') || titleLower.includes('sewing') || titleLower.includes('brep')) {
    const supportsSurfacesOrSolids = features.includes('surface-modeling') || features.includes('parametric-modeling') || features.includes('direct-modeling') || tool.slug === 'rhino-3d';
    if (!is3D || !supportsSurfacesOrSolids || isRendering || isBIM) return false;
  }

  // (C) SolidWorks to AutoCAD 跨内核数据转换 -> 必须是 3D 实体/工程图机械软件，屏蔽纯渲染、BIM协同
  if (titleLower.includes('solidworks xt') || titleLower.includes('solidworks to autocad')) {
    if (isRendering || isBIM || !is3D) return false;
  }

  // (D) CATIA V5 to SolidWorks 约束迁移 -> 必须是主流中高端三维参数化机械装配体建模软件，绝对不用于 2D 或纯分析软件
  if (titleLower.includes('catia v5') || titleLower.includes('catia to solidworks')) {
    const allowedMechanicalAssemblySlugs = [
      'solidworks', 'autodesk-inventor', 'siemens-nx', 'solid-edge', 'ptc-creo', 'catia', 'freecad', 'onshape', 'fusion-360'
    ];
    if (!allowedMechanicalAssemblySlugs.includes(tool.slug)) return false;
  }

  // (E) FLEXlm Server -15 / 10048 报错排错 -> 必须是大型企业级商业套件，熔断轻量级渲染/家装/2D小软件及开源免费版
  if (titleLower.includes('flexlm') || titleLower.includes('options file')) {
    if (isOpenSource || tool.starting_price === 0) return false;
    const excludedFLEXlmSlugs = [
      'qcad', 'librecad', 'sketchup', 'sweet-home-3d', 'planner-5d', 
      'cedar-architect', 'homestyler', 'floorplanner', 'roomle', 
      'live-home-3d', 'coohom', 'foyr-neo', 'chief-architect', 
      'softplan', 'punch-cad', 'turbocad', 'ashampoo-3d-cad', 
      'delta-cad', 'draftsight-standard', 'nanocad-free'
    ];
    if (excludedFLEXlmSlugs.includes(tool.slug)) return false;
  }

  // (F) 3D 打印 K-Factor / G-Code / STL / 3MF -> 必须是 CAM 制造或 3D 打印相关软件
  if (titleLower.includes('k-factor') || titleLower.includes('g-code') || titleLower.includes('slicing') || titleLower.includes('watertight b-rep')) {
    const supportsCAMorPrint = features.includes('integrated-cam') || industries.some((i: string) => /cam|3d-printing|milling|machining/i.test(i)) || tool.slug === 'freecad' || tool.slug === 'fusion-360' || tool.slug === 'solidworks';
    if (!supportsCAMorPrint) return false;
  }

  // (G) 电气原理图 (Electrical/Schematic/IEC) -> 限通用 CAD 及 EDA，屏蔽创意/渲染软件 (如 V-Ray, Keyshot, Blender 等)
  if (titleLower.includes('electrical') || titleLower.includes('schematic') || titleLower.includes('iec')) {
    const isCreativeOrRender = isRendering || industries.some((i: string) => /rendering|animation|creative|game/i.test(i)) || ['v-ray', 'lumion', 'keyshot', 'corona-renderer', 'octane-render', 'blender', 'zbrush', 'maya', '3ds-max', 'cinema-4d'].includes(tool.slug);
    if (isCreativeOrRender) return false;
  }

  // (H) BIM / BEP 协同标准 -> 屏蔽纯机械 CAD (如 SolidWorks, Creo, CATIA, Solid Edge) 与纯 EDA 电子软件 (如 Altium Designer, EPLAN)
  if (titleLower.includes('bim execution') || titleLower.includes('bep') || titleLower.includes('lod 300')) {
    const isPureMechanicalOrEda = ['solidworks', 'ptc-creo', 'catia', 'solid-edge', 'altium-designer', 'eplan', 'orcad'].includes(tool.slug);
    if (isPureMechanicalOrEda) return false;
  }

  // (I) LISP / PGP / CUIX 配置指南 -> 必须是支持 LISP 引擎与 PGP 别名的 DWG 大类工具及 Rhino，屏蔽纯 BIM (Revit) 和纯机械
  if (titleLower.includes('lisp') || titleLower.includes('pgp') || titleLower.includes('cuix')) {
    const isDwgOrRhino = ['autocad', 'bricscad', 'draftsight', 'gstarcad', 'zwcad', 'nanocad', 'qcad', 'rhino-3d'].includes(tool.slug);
    if (!isDwgOrRhino) return false;
  }

  // 3. 基础行业熔断守卫：
  // 纯二维 CAD 绝不生成三维曲面/网格/CAM加工/B-Rep/G-Code 相关的文章
  if (is2D && !is3D) {
    if (
      titleLower.includes('nurbs') ||
      titleLower.includes('sewing') ||
      titleLower.includes('step') ||
      titleLower.includes('iges') ||
      titleLower.includes('brep') ||
      titleLower.includes('manifold') ||
      titleLower.includes('k-factor') ||
      titleLower.includes('bending') ||
      titleLower.includes('slicing') ||
      titleLower.includes('g-code')
    ) {
      return false;
    }
  }

  return true;
}

