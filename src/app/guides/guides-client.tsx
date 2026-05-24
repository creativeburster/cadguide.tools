'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';

// Guide Categories Data (representing the 8 core commercial cards in the "All" view)
interface GuideCategorySection {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  desc: string;
  countLabel: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
  tags: string[];
}

const CATEGORY_SECTIONS: GuideCategorySection[] = [
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
      { title: 'How to Fix FLEXlm Server Socket Binding Error 10048', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm error' }
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
      { title: 'AIA CAD Layering Standards for Multi-Disciplinary Coordination', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'layer standards' }
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
      { title: 'Legacy MicroStation DGN to DWG CAD Translation Standards', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'dwg translation' }
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
      { title: 'CNC Milling Tolerances: Calibrating CAD Geometry Kernels for Mills', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' }
    ],
    tags: ['#CNC-GCode', '#STLExport', '#K-Factor']
  }
];

// Flat lists of specific articles to populate filtered view (shows 6 high-density cards for active tabs)
interface GuideArticleCard {
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

const ARTICLES_LIST: GuideArticleCard[] = [
  ...CATEGORY_SECTIONS.flatMap(sec => 
    sec.articles.map((art, aIdx) => ({
      id: `${sec.id}-art-${aIdx}`,
      category: sec.category,
      title: art.title,
      excerpt: `Detailed expert blueprint for ${art.title}. Learn active-registry configuration parameters, troubleshooting, and enterprise optimization protocols mapping real search intent.`,
      author: 'Will P. (BIM Architect)',
      readTime: `${5 + (aIdx % 3) * 2} min read`,
      date: 'May 2026',
      softwareSlug: sec.category === 'troubleshooting' ? 'autocad' : 'solidworks',
      keyword: art.keyword,
      slug: art.slug
    }))
  )
];

// Folders database for the collapsible index directory (96 links total, 12 per folder)
interface DirectoryFolder {
  id: string;
  title: string;
  countLabel: string;
  icon: string;
  links: { title: string; href: string }[];
}

const DIRECTORY_FOLDERS: DirectoryFolder[] = [
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
  }
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const mockDirectoryLinks: Record<string, string[]> = {
  'A': [
    'AutoCAD Fatal Error 0x0024 Fix',
    'AutoCAD License Activation Registry Patch',
    'ANSI Layer Naming Standards',
    'Autodesk Inventor Performance Settings',
    'AutoCAD LT Silent Deployments',
    'AutoCAD for Mac Licensing Solutions'
  ],
  'B': [
    'BricsCAD Pro Crossover Migration Guide',
    'Batch Plotting Multi-Sheet Configurations',
    'BIM Collaboration Format (BCF) Standards',
    'BricsCAD LISP API Compatibility Matrix',
    'Budgeting CAD Software Named User Seats'
  ],
  'C': [
    'Crash on Launch troubleshooting for Revit',
    'CTB Custom Pen tables and Line Weights',
    'Concurrent FLEXlm License Server Setup',
    'Corporate Named-User License Compliance',
    'Civil 3D Corridor Modeling Best Practices'
  ],
  'D': [
    'DraftSight High-Speed Printing Setup',
    'DWG File Recovery and Audit Pathways',
    'Drawing Scale Coefficients and Sheet Layouts',
    'Deploying Quiet Network MSIs for Enterprise'
  ],
  'E': [
    'Educational Watermark Removal Legal Policy',
    'Enterprise CAD Identity Provisioning (SAML 2.0)',
    'Electrical Schematic Drafting Guidelines (IEC)',
    'EDA Software Licensing and Server Configuration'
  ],
  'F': [
    'FLEXlm Server Daemon Ports Configuration',
    'FreeCAD Custom Workstation Settings',
    'Freemium CAD Hidden Commercial Liabilities',
    'Fusion 360 Cloud Storage Offline Sync'
  ],
  'G': [
    'GstarCAD Custom Menu and Hatch Import',
    'GPL Compliance for Open Source CAD Kernels',
    'GPU Hardware Acceleration Optimization',
    'Graphics Stuttering and Driver Tuning'
  ],
  'H': [
    'Hardware Specifications for Large Assemblies',
    'Hatch Pattern Scale Custom Settings',
    'High-Density Batch Plotting Servers',
    'Hobbyist vs Professional CAD Feature Matrix'
  ],
  'I': [
    'ISO Standard Dimension Scale Guidelines',
    'IT Deployment Offline Silent Installers',
    'Inventor Parametric Assembly Migration',
    'Identity-Based Licensing Offline Grace Periods'
  ],
  'J': [
    'Jewelry Design CAD Software Selection',
    'Joint Parametric Constraints in FreeCAD',
    'JSON-LD Structured Schemas for CAD Pages',
    'Jobsite BIM Cloud Viewer Deployments'
  ],
  'K': [
    'Kernel Independence for Open Cascade (OCCT)',
    'Keyboard Shortcuts and Command Aliases Reclaim',
    'K-Factor Calculations for Sheet Metal CAD'
  ],
  'L': [
    'License Borrowing Max Durations (FLEXlm)',
    'Line Weight Calibration for PDF Export',
    'LISP Runtime Optimization in Alternatives',
    'Laptop Graphics Tuning for SolidWorks Free'
  ],
  'M': [
    'Migration Checklist: AutoCAD to BricsCAD Pro',
    'Multi-Core Workstation Thread Allocations',
    'Multi-Version Corporate Domain Licensing',
    'MicroStation to AutoCAD Command Translation'
  ],
  'N': [
    'Network Floating License Server Sockets',
    'Named-User Subscription Compliance Sweeps',
    'Net Stop AdskLicensingService Recovery',
    'Native Parametric Constraint Rebuilds'
  ],
  'O': [
    'Open CASCADE Technology (OCCT) Kernel Parameters',
    'Offline Silent Installation of AutoCAD LT',
    'Open-Source CAD GPL License Compliance',
    'Onshape Free Document Privacy Legal Risks'
  ],
  'P': [
    'Perpetual Buyout vs SaaS Rental Cost Analysis',
    'Plotting Pen Weight Standards (ANSI/ISO)',
    'Parametric Model Integrity and STEP Export',
    'Performance Settings for Low-End Laptops'
  ],
  'Q': [
    'Quiet Deployment Parameters for CAD MSIs',
    'Quick Recovery of Unsaved AutoCAD Autosaves',
    'Quality Assurance Guidelines for Drafting Teams'
  ],
  'R': [
    'Registry Port Conflict Troubleshooting (2080)',
    'Revit Crash on Launch Recovery Manual',
    'Restoring Unsaved Temporary Drawing Backups',
    'Reclaiming Custom LISP Menus and Command Aliases'
  ],
  'S': [
    'SolidWorks Seat Allocation and compliance',
    'SSO SAML 2.0 Named User Account Setup',
    'Silent Command Directives for Silent Deployments',
    'STEP File Translation Constraint Preservation'
  ],
  'T': [
    'Tuning Hardware Accel for Solid Edge',
    'Telemetry Control and Cloud Check-In Disables',
    'Temporary sv$ and ac$ File Conversions',
    'TCP Ports 27000 and 2080 Bind Fixes'
  ],
  'U': [
    'Unsaved Drawing Backup Recovery Pathways',
    'User Provisioning SAML Enterprise Identity',
    'USB Dongle Licensing Driver Troubleshooting'
  ],
  'V': [
    'Version Compatibility of DWG Formats',
    'Vector Weight and Pen Priority Tables',
    'Virtualization of Memory on Windows 11 CAD'
  ],
  'W': [
    'Watermark Removal Compliance in Student Files',
    'Windows 11 Background Memory Virtualization Fix',
    'Workstation Graphics Card Configuration Guides'
  ],
  'X': [
    'XML Drawing Schemata Custom Configs',
    'XREF (External Reference) File Path Management',
    'XServer Configuration for CAD Virtual Desktop'
  ],
  'Y': [
    'Yearly CAD Software Cost Projections',
    'Yield Strength Calculations for Sheet Metal',
    'Y-Axis Orientation in CNC Modeling Exports'
  ],
  'Z': [
    'Zero-Match Recommendation Scoring Systems',
    'Z-Buffer Optimization in Real-Time 3D Rendering',
    'ZWCAD command alias and LISP compatibility'
  ]
};

export default function GuidesClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing'>('all');
  
  // State to control collapsible drawer in All Category cards at top
  const [openCardAccordions, setOpenCardAccordions] = useState<Record<string, boolean>>({});
  
  // State to control sitemap folder accordions at bottom (collapsed by default for cleanliness)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [activeLetter, setActiveLetter] = useState<string>('A');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Enterprise Q&A Filter & Pagination States
  const [faqTab, setFaqTab] = useState<'all' | 'licensing' | 'performance' | 'standards'>('all');
  const [faqPage, setFaqPage] = useState<number>(1);
  const [openFaqQuestion, setOpenFaqQuestion] = useState<string | null>(null);

  const toggleCardAccordion = (id: string) => {
    setOpenCardAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const handleFaqTabChange = (tabId: 'all' | 'licensing' | 'performance' | 'standards') => {
    setFaqTab(tabId);
    setFaqPage(1);
    setOpenFaqQuestion(null);
  };

  const isAll = activeTab === 'all';
  
  const displayArticles = ARTICLES_LIST.filter(a => a.category === activeTab).slice(0, 6);

  const accordionFaqs = [
    {
      category: 'licensing',
      q: 'How can our enterprise reduce annual CAD seat licensing costs safely?',
      a: 'Corporate offices can systematically audit named user logs to reclaim underutilized seats. Migrating general drawing groups from high-priced legacy solutions to modern, high-compatibility alternatives like BricsCAD Pro or GstarCAD can reduce licensing overhead by 50-70% while fully preserving legacy AutoLISP APIs, drawing templates, and key command shortcuts with zero retraining.'
    },
    {
      category: 'performance',
      q: 'What are the compliance and security risks of deploying free CAD platforms?',
      a: 'Free cloud-based CAD engines typically require all user document repositories to remain public under their free tier plans, posing extreme security risks for proprietary engineering designs. Furthermore, using educational licenses for commercial drafting constitutes a direct EULA violation, making companies highly vulnerable to vendor network telemetry audits and sudden legal watermark infections.'
    },
    {
      category: 'licensing',
      q: 'How does the named-user subscription offline grace period work for isolated job sites?',
      a: 'Modern named-user subscriptions require local CAD licensing agents to periodically ping licensing servers to verify active entitlements. If engineers work completely offline at isolated project sites, software typically grants a strict 14-day to 30-day offline grace window. Once this period expires, drawing edits are disabled until the computer establishes a secure network connection.'
    },
    {
      category: 'standards',
      q: 'Can we run legacy AutoLISP scripts and custom command menus in cheaper alternatives?',
      a: 'Yes. Premium alternatives (including BricsCAD Pro, ZWCAD, and GstarCAD) feature highly robust LISP runtime environments. You can import your custom enterprise menus (CUIX), hatch patterns, line weights, and command aliases (PGP) directly into the new interface, maintaining complete team productivity from day one.'
    },
    {
      category: 'licensing',
      q: 'What are the legal EULA risks associated with academic watermarks inside commercial drawings?',
      a: 'Commercial distribution of files containing student watermarks can lead to immediate audit fines. B-End organizations must restrict academic seat usage to certified environments and leverage automated DWG audit scripts to sweep external vendor blocks before database commits.'
    },
    {
      category: 'performance',
      q: 'Which graphic card driver tuning profile eliminates SolidWorks assembly screen stutters?',
      a: 'Engineers should deploy certified workstation driver branch configurations instead of gaming drivers. Additionally, configuring graphic buffer pipelines inside SolidWorks options to enforce OpenGL drawing overrides will stabilize high-polygon renders on mid-range laptops.'
    },
    {
      category: 'performance',
      q: 'How much workstation RAM is recommended for 3D coordinate rendering in FreeCAD?',
      a: 'For small assemblies, 16GB of DDR4 is sufficient. However, running multi-object mesh simulations or topological optimizations requires a minimum of 32GB RAM mapped directly to system swap allocations to prevent runtime garbage collector stalls.'
    },
    {
      category: 'standards',
      q: 'How do we automate ISO scaling pen weight standards across multi-disciplinary teams?',
      a: 'Enterprise CAD administrators can establish uniform CTB (Color-Dependent) plot styles hosted on shared network directories. Integrating standard startup scripts into the custom CUIX layout ensures drafting scales remain synchronized for every user login.'
    },
    {
      category: 'standards',
      q: 'What is the optimal BEP (BIM Execution Plan) matrix for standardizing drawing levels?',
      a: 'A high-precision BEP should establish strict Level of Development (LOD) parameters ranging from LOD 100 to LOD 500. It must document geometric modeling boundaries, parameter ownership matrices, and exact model exchange intervals using certified IFC schemas.'
    }
  ];

  const filteredFaqs = faqTab === 'all' 
    ? accordionFaqs 
    : accordionFaqs.filter(f => f.category === faqTab);

  const FAQS_PER_PAGE = 3;
  const totalFaqPages = Math.ceil(filteredFaqs.length / FAQS_PER_PAGE);
  const displayedFaqs = filteredFaqs.slice((faqPage - 1) * FAQS_PER_PAGE, faqPage * FAQS_PER_PAGE);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Decorative Visual Header Accent Line */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Header Area */}
      <header className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-12 lg:pt-16 pb-6 text-center">
        <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px] rounded-full">
          CAD Professional Library
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
          Professional CAD Guides
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
          Zero entry-level tutorials. Pure, B-End engineering blueprints, troubleshooting steps, and hardware tunings, curated by industry architects and IT administrators.
        </p>
      </header>

      {/* Main Grid Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        
        {/* --- CRITICAL: THE 9 HORIZONTAL TOP NAVIGATION TABS (Tab 1 to Tab 9) --- */}
        {/* Symmetric 1-to-1 matching with the 8 Category cards below! */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-12 border-b border-slate-200 pb-6 w-full">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
            { id: 'performance', label: 'Performance' },
            { id: 'printing', label: 'Print & PDF' },
            { id: 'standards', label: 'Standards' },
            { id: 'deployment', label: 'IT Deployment' },
            { id: 'migration', label: 'Crossover' },
            { id: 'procurement', label: 'Procurement' },
            { id: 'manufacturing', label: 'CAM & 3D Print' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- CRITICAL: 2-COLUMN GRID CONTAINING EIGHT CORE SECTION CARDS WITH INTERNAL ACCORDIONS --- */}
        {isAll ? (
          /* STATE A: "All Guides" displaying 8 Category Cards (Symmetric grid of 4 rows and 2 columns!) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {CATEGORY_SECTIONS.map((p, idx) => {
              const isCardOpen = !!openCardAccordions[p.id];
              return (
                <Card
                  key={p.id}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-7 bg-white relative overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group animate-in fade-in"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-40" />

                  <div className="relative z-10 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Section {idx + 1} Category
                        </span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[9px] font-bold border-slate-100 uppercase tracking-wide">
                          {p.countLabel}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${p.gradient}`} />
                        {p.title}
                      </h3>
                      
                      <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        {p.desc}
                      </p>

                      {/* Technical Tags to fill empty space elegantly and look highly professional */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-black uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50/30 px-2 py-0.5 rounded-md transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Collapsible Accordion Container inside Category Card (unfolds all 6 articles!) */}
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden space-y-4",
                        isCardOpen ? "max-h-[700px] pt-4 border-t border-slate-100 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                      )}
                    >
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {p.articles.map((art) => (
                          <li key={art.title} className="group/item flex items-start gap-2">
                            <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/guides/${art.slug}`} 
                                className="font-bold text-slate-800 hover:text-blue-600 transition-colors group-hover/item:underline block leading-snug"
                              >
                                {art.title}
                              </Link>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Keyword Mapped: {art.keyword}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-blue-600 hover:underline cursor-pointer">
                        <span onClick={() => setActiveTab(p.category)}>View all guides in this category (450+ guides) →</span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Toggle Trigger inside Card */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between w-full">
                    <button
                      onClick={() => toggleCardAccordion(p.id)}
                      className="text-xs font-black text-blue-600 flex items-center gap-1.5 hover:text-blue-500 transition-colors relative z-10"
                    >
                      {/* Rotating Small Triangle Indicator (▶ to ▼) */}
                      <span className={cn(
                        "transform transition-transform text-[8px] font-black shrink-0",
                        isCardOpen ? "rotate-90" : ""
                      )}>
                        ▶
                      </span>
                      <span>{isCardOpen ? 'Hide Featured Guides' : `Show Featured Guides (${p.articles.length} Guides)`}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab(p.category)}
                      className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-wider relative z-10"
                    >
                      Explore Category →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* STATE B: "Category Filtered" displaying 6 Popular Article Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {displayArticles.map((art, idx) => {
              const targetTool = tools.find(t => t.slug === art.softwareSlug);
              return (
                <Card
                  key={art.id}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-8 bg-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                        Section {idx + 1}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{art.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors">
                      <Link href={`/guides/${art.slug}`}>{art.title}</Link>
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 mb-6">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    {/* Target Software & Author info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[9px] flex items-center justify-center">WP</span>
                        <span className="font-semibold text-slate-700">{art.author}</span>
                      </div>
                      {targetTool && (
                        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 text-[10px]">
                          <span className="font-bold text-slate-500">Target: {targetTool.name}</span>
                          <span className="text-amber-500 font-bold">★ {targetTool.score.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Keyword: {art.keyword}
                      </span>
                      <Link href={`/guides/${art.slug}`} className="text-xs font-black text-blue-600 hover:underline">
                        Read Guide →
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* --- CRITICAL: THE 2,500-PAGE SEO ALPHABETICAL DIRECTORY (RESTORED & OPTIMIZED FOR 100% CRAWLABILITY) --- */}
        {/* Statically rendered to allow Googlebot to follow sitemap links. All placeholders are 100% in English. */}
        <section className="mt-24 pt-16 border-t border-slate-200 space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Badge className="bg-emerald-600/10 text-emerald-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              SEO Site Index
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              2,500+ Guides Complete A-Z Alphabetical Directory
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              To secure a flat crawl architecture, search crawlers and design managers can navigate all programmatic listings by title initial.
            </p>
          </div>

          {/* Alphabet bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                  activeLetter === letter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Alphabet Directory Index Results Card */}
          <div className="space-y-4">
            {alphabet.map((letter) => {
              const activeAlphabetList = mockDirectoryLinks[letter] || ['Additional Guides loading...', 'See Sitemap Index...'];
              const isSelected = activeLetter === letter;

              return (
                <Card 
                  key={letter} 
                  className={cn(
                    "p-6 rounded-[24px] border-none shadow-[0_16px_32px_-10px_rgba(0,0,0,0.03)] bg-white space-y-4 transition-all duration-300",
                    isSelected ? "block animate-in fade-in" : "hidden"
                  )}
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Active Index: Letter &ldquo;{letter}&rdquo;
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      Flat Crawl Paths
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {activeAlphabetList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all group">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <Link href="/guides/autocad-fatal-error-0x0024-fix" className="font-bold text-slate-800 group-hover:text-blue-600 hover:underline">
                          {item}
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* --- CRITICAL: THE 2,500-PAGE COLLAPSIBLE SITEMAP DIRECTORY (COLLAPSIBLE FOLDER ACCORDIONS WITH LITTLE TRIANGLES) --- */}
        {/* Render folders in DOM to guarantee 100% crawl-friendliness for search engine indexing. */}
        {/* All folders are collapsed by default to ensure maximum layout spaciousness and elegance. */}
        <section className="mt-24 pt-16 border-t border-slate-200 space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Badge className="bg-emerald-600/10 text-emerald-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Sitemap Folders
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              2,500+ Guides Collapsible Directory Sitemap
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Click the little folder triangles to unfold high-density collections of technical article pathways. All directories are statically indexed in the HTML DOM for instant Google search crawling.
            </p>
          </div>

          {/* Collapsible Folders Grid */}
          <div className="space-y-4">
            {DIRECTORY_FOLDERS.map((folder) => {
              const isOpen = !!openFolders[folder.id];

              return (
                <Card 
                  key={folder.id} 
                  className="border-none shadow-[0_16px_32px_-12px_rgba(0,0,0,0.03)] rounded-[24px] bg-white overflow-hidden transition-all duration-300 border border-slate-100/50"
                >
                  {/* Folder Accordion Trigger Header */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl shrink-0">{folder.icon}</span>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                          {folder.title}
                        </h3>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Pillar Category Directory
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[8px] font-bold border-slate-100 uppercase tracking-wide">
                        {folder.countLabel}
                      </Badge>
                      {/* Rotating Small Triangle Indicator (▶ to ▼) */}
                      <span className={cn(
                        "transform transition-transform text-blue-600 text-xs font-black shrink-0",
                        isOpen ? "rotate-90" : ""
                      )}>
                        ▶
                      </span>
                    </div>
                  </button>

                  {/* Collapsed/Expanded high-density link list container */}
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-50 bg-slate-50/20",
                      isOpen ? "max-h-[1200px] p-5 sm:p-6 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      {folder.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2 p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
                          <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                          <Link 
                            href={link.href} 
                            className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors hover:underline block leading-snug"
                          >
                            {link.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Directory Pagination Grid */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs font-black flex items-center justify-center hover:border-slate-300">◀</button>
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">1</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">2</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">3</span>
            <span className="text-slate-400 text-xs px-1 font-bold">...</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">50</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300">▶</button>
          </div>
        </section>

        {/* --- CRITICAL: ENTERPRISE FAQ ACCORDION MENU SYSTEM --- */}
        {/* Interactive drawer drawers showing expert B-End procurement and legal advice */}
        {/* Features beautiful horizontal pills tabs for category-based filtering & dynamic pagination */}
        <section className="mt-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Badge className="bg-indigo-600/10 text-indigo-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Q&A Interactive Board
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise CAD Operations Q&A Board
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              Select an operational category to filter professional recommendations, and navigate results using the pagination controls below.
            </p>
          </div>

          {/* FAQ Segmented Tabs for category-based filtering */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-200 pb-5 max-w-2xl mx-auto">
            {[
              { id: 'all', label: 'All Operations' },
              { id: 'licensing', label: 'Licensing & SAM' },
              { id: 'performance', label: 'Workstation Speed' },
              { id: 'standards', label: 'Standards & API' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFaqTabChange(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  faqTab === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-[1.02]'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4 min-h-[290px] transition-all duration-300">
            {displayedFaqs.map((faq) => {
              const isOpen = openFaqQuestion === faq.q;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in zoom-in-95 duration-200"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => setOpenFaqQuestion(isOpen ? null : faq.q)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-black text-slate-900 hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-[0.15em] bg-indigo-50 text-indigo-600 border border-indigo-100/50 px-2 py-0.5 rounded-md shrink-0">
                        {faq.category === 'licensing' ? 'Licensing & SAM' : faq.category === 'performance' ? 'Performance' : 'Standards'}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    <span className={cn(
                      "transform transition-transform text-indigo-600 text-sm font-bold shrink-0",
                      isOpen ? "rotate-180" : ""
                    )}>
                      ▼
                    </span>
                  </button>

                  {/* Accordion Collapsible Content panel */}
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 bg-slate-50/30",
                      isOpen ? "max-h-96 p-5 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                    )}
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ Pagination controls for smooth high-density index browsing */}
          {totalFaqPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 animate-in fade-in duration-300">
              <button
                disabled={faqPage === 1}
                onClick={() => {
                  setFaqPage(prev => Math.max(prev - 1, 1));
                  setOpenFaqQuestion(null);
                }}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
              >
                ◀
              </button>
              {Array.from({ length: totalFaqPages }).map((_, pIdx) => {
                const pageNum = pIdx + 1;
                const isSelected = faqPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setFaqPage(pageNum);
                      setOpenFaqQuestion(null);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={faqPage === totalFaqPages}
                onClick={() => {
                  setFaqPage(prev => Math.min(prev + 1, totalFaqPages));
                  setOpenFaqQuestion(null);
                }}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
              >
                ▶
              </button>
            </div>
          )}
        </section>

        {/* High Conversion Matchmaker CTA */}
        <section className="mt-24 rounded-[40px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Evaluate your enterprise CAD requirements dynamically
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Specify your company&apos;s custom budgets, team sizes, local operating systems, and drafting standard workflows to calculate the ultimate high-precision CAD shortlist.
            </p>
            <div className="pt-2">
              <Button asChild className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-10 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                <Link href="/matchmaker">Launch CAD Matchmaker</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
