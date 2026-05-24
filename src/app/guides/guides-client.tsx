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

// Guide Categories Data (representing the 6 cards in the "All" view)
interface GuideCategorySection {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration';
  title: string;
  desc: string;
  countLabel: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
}

const CATEGORY_SECTIONS: GuideCategorySection[] = [
  {
    id: 'sec-trouble',
    category: 'troubleshooting',
    title: 'CAD Software Troubleshooting',
    desc: 'Solve program crashes, fatal memory lockout errors, license validation failures, and restore unsaved temporary drawing backups.',
    countLabel: '450+ Active Guides',
    gradient: 'from-rose-500 via-pink-600 to-red-500',
    articles: [
      { title: 'Fix AutoCAD License Activation Failed (Registry Socket Patch)', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'Why Autodesk AutoCAD Freezes on Windows 11 Large DWG Files', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad' },
      { title: 'Resolve SolidWorks Price Seat Allocation & EULA Compliance Warnings', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks price' },
      { title: 'AutoCAD Architecture Fatal Error 0x0024 Recovery Workflow', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad architecture' }
    ]
  },
  {
    id: 'sec-perf',
    category: 'performance',
    title: 'Hardware & Performance Optimization',
    desc: 'Fine-tune GPU acceleration, optimize workhorse laptop parameters, adjust solid modeling multi-threading, and eliminate lag on massive assemblies.',
    countLabel: '380+ Active Guides',
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    articles: [
      { title: 'Tuning SolidWorks Free & Pro Suites on Low-End Laptops', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'Best GPU Drivers & Hardware Acceleration Settings for Autodesk Inventor', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Fix Solid Edge Graphics Stuttering & Loading Delays', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solid edge' },
      { title: 'FreeCAD Custom Settings Migration for Multi-Core Workstations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' }
    ]
  },
  {
    id: 'sec-print',
    category: 'printing',
    title: 'Print & PDF Plotting Standards',
    desc: 'Standardize enterprise CTB pen tables, configure layout model spaces, fix line weight errors, and automate high-speed batch plotting pipelines.',
    countLabel: '320+ Active Guides',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-500',
    articles: [
      { title: 'ISO Standard Paper Setups for AutoCAD Online Plotting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad online' },
      { title: 'How to Batch Print Multiple Drawing Formats in DraftSight', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'draftsight' },
      { title: 'CTB Custom Pen Table Setup for AutoCAD Electrical Blueprints', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Fix PDF Missing Line Weights and Scrambled Fonts After CAD Export', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad software' }
    ]
  },
  {
    id: 'sec-stand',
    category: 'standards',
    title: 'CAD Industry Standards & Best Practices',
    desc: 'Enforce ANSI layer naming directories, align international ISO dimension formatting rules, and construct electrical schematic standard workflows.',
    countLabel: '420+ Active Guides',
    gradient: 'from-blue-500 via-indigo-600 to-violet-500',
    articles: [
      { title: 'ANSI Standard Layer Naming for Commercial CAD Building Designs', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad design' },
      { title: 'ISO Standard Dimension Scales for Mechanical Production Drafting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk autocad' },
      { title: 'IEC Electrical Schematic CAD Drawing Best Practices', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Enterprise CAD File Archiving & Version Naming Convention Standard', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad programs' }
    ]
  },
  {
    id: 'sec-deploy',
    category: 'deployment',
    title: 'Enterprise IT Mass Deployment',
    desc: 'Configure silent automated installer scripts, manage concurrent FLEXlm servers, track named-user compliance tokens, and design network firewall parameters.',
    countLabel: '280+ Active Guides',
    gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
    articles: [
      { title: 'Mass Offline Silent Installation of AutoCAD LT for Corporate Teams', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad lt' },
      { title: 'AutoCAD for Mac: Cross-Platform License Server Deployment Guide', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad for mac' },
      { title: 'How to Budget and Buy AutoCAD Seats: Multi-Version Corporate Domain Setup', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' },
      { title: 'Managing Enterprise Single Sign-On (SSO) for Named CAD Subscriptions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' }
    ]
  },
  {
    id: 'sec-mig',
    category: 'migration',
    title: 'CAD Software Crossover Migration',
    desc: 'Plan migration checklists from legacy systems to high-performance AutoCAD alternatives. Reclaim custom menus, styles, and command aliases.',
    countLabel: '250+ Active Guides',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    articles: [
      { title: 'Complete CAD Migration Guide: AutoCAD to BricsCAD Pro Crossover', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'AutoCAD to GstarCAD Transition Guide: Setting & Command Import', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'SolidWorks to Inventor Migration: Reclaiming 3D Parametric CAD Integrity', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Migrating legacy AutoCAD drawings to Online cloud CAD natively', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'online cad' }
    ]
  }
];

// Flat lists of specific articles to populate filtered view (shows 6 high-density cards for active tabs)
interface GuideArticleCard {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration';
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
  // Troubleshooting
  {
    id: 'art1',
    category: 'troubleshooting',
    title: 'Fix AutoCAD License Activation Failed (Registry Socket Patch)',
    excerpt: 'Detailed troubleshooting guide for fatal error socket conflicts. Resolve active-registry licensing crashes by flushing memory tables and clearing background task ports without dataloss.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad license',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art2',
    category: 'troubleshooting',
    title: 'Why Autodesk AutoCAD Freezes on Windows 11 Large DWG Files',
    excerpt: 'Is Windows 11 background memory virtualization locking your system during large vector loads? Learn how to disable telemetry checks and configure graphic allocation parameters.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art3',
    category: 'troubleshooting',
    title: 'Resolve SolidWorks Price Seat Allocation & EULA Compliance Warnings',
    excerpt: 'Corporate design environments are highly prone to network compliance sweeps. Map your named-user licenses properly and exclude non-commercial academic watermark infections.',
    author: 'Will P. (BIM Architect)',
    readTime: '5 min read',
    date: 'May 2026',
    softwareSlug: 'solidworks',
    keyword: 'solidworks price',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art3-1',
    category: 'troubleshooting',
    title: 'AutoCAD Architecture Fatal Error 0x0024 Recovery Workflow',
    excerpt: 'Is your drafting environment crashing on startup? Learn the step-by-step registry cleanup process to restore normal drawing coordinates and clear memory buffers safely.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad architecture',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art3-2',
    category: 'troubleshooting',
    title: 'Revit Crash on Launch: Repairing Damaged Local BIM Models',
    excerpt: 'Solve critical workstation lockups when loading active team projects. Force local sync tables to clear transaction logs and isolate corrupt families from central files.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'revit',
    keyword: 'revit crash',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art3-3',
    category: 'troubleshooting',
    title: 'How to Fix FLEXlm Server Socket Binding Error 10048',
    excerpt: 'Prevent concurrent licensing server downtime. Identify active port conflicts on TCP 27000 and force orphaned license daemon processes to bind correctly.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'flexlm error',
    slug: 'autocad-fatal-error-0x0024-fix',
  },

  // Performance
  {
    id: 'art4',
    category: 'performance',
    title: 'Tuning SolidWorks Free & Pro Suites on Low-End Laptops',
    excerpt: 'A comprehensive, step-by-step checklist to configure low-end workstations. Shut down redundant visual pipelines and scale geometry caching down to optimize solid modeling response.',
    author: 'Will P. (BIM Architect)',
    readTime: '10 min read',
    date: 'May 2026',
    softwareSlug: 'solidworks',
    keyword: 'solidworks free',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art5',
    category: 'performance',
    title: 'Best GPU Drivers & Hardware Acceleration Settings for Autodesk Inventor',
    excerpt: 'Is your graphics card underperforming? Configure standard workstation registries, clear driver bottlenecks, and establish optimal multi-threading rendering thresholds.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autodesk-inventor',
    keyword: 'autodesk inventor',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art6',
    category: 'performance',
    title: 'FreeCAD Custom Settings Migration for Multi-Core Workstations',
    excerpt: 'Maximize the performance of open-source OCCT kernels. Configure thread allocation scripts to unlock native processing speeds for constraint-based solid assemblies.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'freecad',
    keyword: 'freecad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art6-1',
    category: 'performance',
    title: 'Fix Solid Edge Graphics Stuttering & Loading Delays',
    excerpt: 'Overcome graphics lag on large sheet metal designs. Tune registry buffers and override default Windows battery throttling policies for engineering workstations.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'solid-edge',
    keyword: 'solid edge',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art6-2',
    category: 'performance',
    title: 'Optimize Catia V6 3D Assembly Loading Cache Protocols',
    excerpt: 'Enterprise guide to memory cache sizing. Prevent local buffer deadlocks when importing high-density automotive assemblies over corporate network drives.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'catia',
    keyword: 'catia v6',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art6-3',
    category: 'performance',
    title: 'Laptop RAM Allocation Rules for Complex Rhino 3D NURBS Modeling',
    excerpt: 'Fine-tune virtual page sizes to handle complex organic geometry. Minimize background process locks and configure Windows page files for intensive rendering pipelines.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'rhino',
    keyword: 'rhino 3d',
    slug: 'autocad-fatal-error-0x0024-fix',
  },

  // Printing
  {
    id: 'art7',
    category: 'printing',
    title: 'ISO Standard Paper Setups for AutoCAD Online Plotting',
    excerpt: 'A detailed manual to configure layout size standards and pen weights on cloud CAD browsers. Prevent sheet conversion lines from clipping on ANSI/ISO production prints.',
    author: 'Will P. (BIM Architect)',
    readTime: '5 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad online',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art8',
    category: 'printing',
    title: 'How to Batch Print Multiple Drawing Formats in DraftSight',
    excerpt: 'Enforce high-density batch printing workflows. Build automation pipelines to plot 2D/3D DWG sheets across complex enterprise printer servers seamlessly.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'draftsight',
    keyword: 'draftsight',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art9',
    category: 'printing',
    title: 'CTB Custom Pen Table Setup for AutoCAD Electrical Blueprints',
    excerpt: 'Standardize lines and vector weight priorities. Build custom CTB tables for electrical schematics to guarantee high readability of thin lines and wire pathways.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad electrical',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art9-1',
    category: 'printing',
    title: 'Fix PDF Missing Line Weights and Scrambled Fonts After CAD Export',
    excerpt: 'Establish precise true-type font embeddings. Resolve common DWG-to-PDF vector conversion bugs and scale line weights to ensure clean, readable layout exports.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'cad software',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art9-2',
    category: 'printing',
    title: 'Standardizing Plot Styles: CTB vs STB Pen Tables for Architects',
    excerpt: 'A complete architectural guide to visual standardizations. Map layer-dependent CTB tables versus modern object-dependent STB layouts for commercial team projects.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'plot styles',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art9-3',
    category: 'printing',
    title: 'Automating High-Volume Blueprints PDF Plotting on Network Servers',
    excerpt: 'Set up background script listeners to automatically generate PDFs from updated team project directories, saving hours of manual output work daily.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'batch plotting',
    slug: 'autocad-fatal-error-0x0024-fix',
  },

  // Standards
  {
    id: 'art10',
    category: 'standards',
    title: 'ANSI Standard Layer Naming for Commercial CAD Building Designs',
    excerpt: 'Deploy robust layer standards for building designs. Map your architectural, structural, and MEP layers accurately in compliance with standard AIA/ANSI guidelines.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'cad design',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art11',
    category: 'standards',
    title: 'ISO Standard Dimension Scales for Mechanical Production Drafting',
    excerpt: 'Configure uniform text annotations and tolerance boundaries. Learn how to implement ISO standards to avoid drawing translation scales mismatches during overseas shipping.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autodesk autocad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art12',
    category: 'standards',
    title: 'IEC Electrical Schematic CAD Drawing Best Practices',
    excerpt: 'IT guide to enforcing international electrical drafting conventions. Set up standard graphic templates and multi-sheet references for automation.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad electrical',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art12-1',
    category: 'standards',
    title: 'Enterprise CAD File Archiving & Version Naming Convention Standard',
    excerpt: 'Enforce absolute control over team deliverables. Establish strict revision suffix rules, file metadata headers, and folder organization directories to block version confusion.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'cad programs',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art12-2',
    category: 'standards',
    title: 'BIM Execution Plan (BEP) Modeling Standards for Public Tenders',
    excerpt: 'Align drawing structures to government standards. Write strict BEP templates and detail level-of-development (LOD 300/400) rules for public architectural bids.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'revit',
    keyword: 'bim standards',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art12-3',
    category: 'standards',
    title: 'AIA CAD Layering Standards for Multi-Disciplinary Coordination',
    excerpt: 'Coordinate architecture and engineering files perfectly. Set up AIA standard prefixes to filter layer visibility instantly during external file imports (XREFs).',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'layer standards',
    slug: 'autocad-fatal-error-0x0024-fix',
  },

  // Deployment
  {
    id: 'art13',
    category: 'deployment',
    title: 'Mass Offline Silent Installation of AutoCAD LT for Corporate Teams',
    excerpt: 'Deploy clean offline setups across massive enterprise networks. Build customized MSI packages, deploy quiet parameters, and exclude cloud check-in telemetry prompts.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad lt',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art14',
    category: 'deployment',
    title: 'AutoCAD for Mac: Cross-Platform License Server Deployment Guide',
    excerpt: 'Connect macOS design workstations to corporate server networks. Troubleshoot port binds and license file parameters for concurrent float servers.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad for mac',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art15',
    category: 'deployment',
    title: 'How to Budget and Buy AutoCAD Seats: Multi-Version Corporate Domain Setup',
    excerpt: 'Review of named-user license allocations, SSO SAML 2.0 setups, and offline grace limits. Buy exactly the right number of seats to prevent EULA violations.',
    author: 'Will P. (BIM Architect)',
    readTime: '10 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'buy autocad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art15-1',
    category: 'deployment',
    title: 'Managing Enterprise Single Sign-On (SSO) for Named CAD Subscriptions',
    excerpt: 'Secure user onboarding via SAML 2.0. Automate active directory syncs, map named seats to corporate emails, and disable raw offline access vectors.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad license',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art15-2',
    category: 'deployment',
    title: 'FLEXlm Options File Custom Setup for Group-Based Seat Restrictions',
    excerpt: 'Optimize concurrent corporate licensing allocations. Restrict named seats to specific teams, reserve floating slots for high-priority groups, and block double borrowing.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'flexlm options',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art15-3',
    category: 'deployment',
    title: 'Silent Deployment Checklists for Autodesk Network License Manager',
    excerpt: 'Mass deploy clean FLEXlm environments across Windows Server setups. Configure background startup daemons and map license check-in firewalls.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'network licensing',
    slug: 'autocad-fatal-error-0x0024-fix',
  },

  // Migration
  {
    id: 'art16',
    category: 'migration',
    title: 'Complete CAD Migration Guide: AutoCAD to BricsCAD Pro Crossover',
    excerpt: 'Step-by-step corporate crossover guide. Transition mechanical draftsmen with zero retraining. Reclaim identical LISP APIs, drawing templates, and key command aliases.',
    author: 'Will P. (BIM Architect)',
    readTime: '11 min read',
    date: 'May 2026',
    softwareSlug: 'bricscad',
    keyword: 'bricscad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art17',
    category: 'migration',
    title: 'AutoCAD to GstarCAD Transition Guide: Setting & Command Import',
    excerpt: 'Migrating legacy configurations to high-performance low-cost alternatives. Learn how to import custom menus, hatch files, and linestyles to avoid configuration loss.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'May 2026',
    softwareSlug: 'bricscad',
    keyword: 'bricscad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art18',
    category: 'migration',
    title: 'SolidWorks to Inventor Migration: Reclaiming 3D Parametric CAD Integrity',
    excerpt: 'Crossover checklist for 3D design offices. Rebuild custom assemblies and convert native parametric structures to STEP formats without losing constraint metadata.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'autodesk-inventor',
    keyword: 'autodesk inventor',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art18-1',
    category: 'migration',
    title: 'Migrating Legacy AutoCAD Drawings to Online Cloud CAD Natively',
    excerpt: 'Secure drawing translations to cloud databases. Clear custom LISP commands, strip nested blocks, and configure SVG vector engines to render drafts smoothly in browsers.',
    author: 'Will P. (BIM Architect)',
    readTime: '8 min read',
    date: 'May 2026',
    softwareSlug: 'online-cad',
    keyword: 'online cad',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art18-2',
    category: 'migration',
    title: 'DraftSight to BricsCAD Pro Migration: AutoLISP Command Compatibility',
    excerpt: 'Reclaim identical command aliases. Move custom LISP APIs, coordinate layouts, and batch printing configurations with absolute data integrity.',
    author: 'Will P. (BIM Architect)',
    readTime: '6 min read',
    date: 'May 2026',
    softwareSlug: 'bricscad',
    keyword: 'draftsight alternative',
    slug: 'autocad-fatal-error-0x0024-fix',
  },
  {
    id: 'art18-3',
    category: 'migration',
    title: 'Legacy MicroStation DGN to DWG CAD Translation Standards',
    excerpt: 'Solve geometric distortion bugs. Calibrate precise coordinates mappings and convert complex DGN line weights to standard AutoCAD DWG layers flawlessly.',
    author: 'Will P. (BIM Architect)',
    readTime: '9 min read',
    date: 'May 2026',
    softwareSlug: 'autocad',
    keyword: 'dwg translation',
    slug: 'autocad-fatal-error-0x0024-fix',
  }
];

// Folders database for the collapsible index directory (72 links total, 12 per folder)
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
    title: 'AutoCAD & 二维制图故障排查 (AutoCAD & 2D Troubleshooting)',
    countLabel: '450+ 篇指南',
    icon: '🔧',
    links: [
      { title: 'AutoCAD 致命错误 0x0024 完整企业级修复流程', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 注册表激活失败与 Socket 端口死锁解决', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT 离线静默安装与企业大批量 silent 部署参数', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD for Mac 跨平台许可证服务器连接与端口绑定配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Online 网页版图纸打印与笔宽 Pen Weights 配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Architecture 命令行丢失与自定义菜单 CUIX 恢复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Electrical 继电器元件库与 IEC 图幅模版设置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '购买 AutoCAD 攻略：单用户订阅与并发网络版席位预算计算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 外部参照 (XREF) 路径失效与相对路径批量修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Hatch 填充图案比例过密导致系统卡死解决方法', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT 与 Pro 版本功能深度对比及选型指南', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '恢复 AutoCAD 临时自动保存文件 (.sv$ / .ac$) 终极指南', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-perf',
    title: 'SolidWorks & 三维参数化造型优化 (SolidWorks & 3D Performance)',
    countLabel: '380+ 篇指南',
    icon: '🚀',
    links: [
      { title: 'SolidWorks Free 免费版与 Pro 专业版在低配笔记本上的性能优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 价格与 Named User 席位分配 EULA 合规审计避坑', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 大型装配体卡顿、轻量化加载与显卡硬件加速优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解决 SolidWorks 运行时水滴水印提示与非商业版水印警告', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 零件建模几何约束 (Constraints) 丢失快速修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks Sheet Metal 钣金折弯系数与 K-Factor 算法计算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 导出 STEP 文件装配体干涉与破面破线修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks PDM 客户端局域网同步延迟与本地缓存清理', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 焊件结构件属性库与型材切割清单自定义配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 图纸工程图 pen style weights 打印边距微调', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 与 Autodesk Inventor 协同设计数据无损双向转换', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 运行内存不足 (Resource Monitor) 警告解决策略', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-standards',
    title: 'BIM 建筑规范与图层制图标准 (BIM & Layer Standards)',
    countLabel: '420+ 篇指南',
    icon: '📐',
    links: [
      { title: 'Revit 启动时崩溃 (Crash on Launch) 本地 BIM 模型快速同步修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM 协同设计 Execution Plan (BEP) 模版与 LOD 300/400 规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AIA 美国建筑师学会 CAD 图层命名标准与前缀分类过滤规则', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ANSI 商业建筑制图图层分配标准与企业内部规范模版定制', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ISO 机械制图标注比例与图幅字体大小标准规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Civil 3D 地形曲面与路线道路 Corridor 建模三维最佳实践', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Archicad Teamwork 协同服务器网络映射与多用户连接端口配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Navisworks 碰撞检测 (Clash Detection) 规则配置与冲突报告优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM 协同格式 BCF 在不同设计软件间的导入导出接口标准', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SketchUp Pro 导入大型 DWG 矢量图卡死与孤立网格清理', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Rhino 3D 复杂 NURBS 曲面转 parametric 实体模型精度控制', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Geotechnical 三维地质分层在 Civil 3D 中的层序可视化配置', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-deploy',
    title: '企业 IT 许可证授权与 Mass 部署 (IT Licensing & Deploy)',
    countLabel: '280+ 篇指南',
    icon: '🖥️',
    links: [
      { title: 'FLEXlm 并发许可证服务器 TCP 27000/2080 端口占用冲突修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'FLEXlm Options 文件配置：按用户组 reserve 与 restrict 席位', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业单点登录 (SSO) SAML 2.0 在 Named User 订阅中的部署', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Autodesk Desktop Licensing Service background 挂起无法启动解决', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业 CAD 席位预算核算：并发与 named 混合授权成本模型', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Windows 11 后台内存虚拟化导致 CAD 授权失效 (EULA 报错) 修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '老版本 USB 加密狗 Dongle 驱动冲突导致工程系统闪退排查', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD 软件网络安装包 MSI 封装与 Active Directory 静默部署', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业 CAD 网络防火墙设置：关闭遥测上传与保护隐私文件安全', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'LMTools 并发服务器状态查询与多套 vendor daemon 服务配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Named User 离线使用宽限期 (Grace Period) 企业域策略统一配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '防止商业违规审计：企业 named 账户实名合规配置指南', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-printing',
    title: '图纸打印、PDF 转换与笔宽 Pen Tables (Printing & PDF Options)',
    countLabel: '320+ 篇指南',
    icon: '🖨️',
    links: [
      { title: 'ISO 标准图纸边距与 pen styles pen weights 绘图机配置规格', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight 2D 图纸多排版 layout 空间批量打印 (Batch Plot)', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '自定义 CTB 笔宽颜色映射表与 STB 命名颜色打印配置区别', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '修复 CAD 导出 PDF 格式后矢量文字乱码与线型中断 BUG', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '自动高清晰度 PDF 导出：命令行 LISP 脚本与文件系统自动生成', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业出图图纸数字章管理：矢量背景印章与电子签名绑定', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解决巨幅图纸 PDF 导出因线型文件过大导致打印后台挂起', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD 布局 model space 与 layout space 视口比例快速对齐校正', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '线条粗细比例失调：PDF 线宽在不同矢量查看器中的平滑配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '黑白工程图与彩色效果图快速出图：多配置 CTB 文件的灵活绑定', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DGN 格式与 DWG 格式线型对照 pen weights 转换表配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '制图机自动裁纸与边距自动对齐配置：解决图纸边缘缺失 BUG', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-migration',
    title: 'CAD 软件无缝迁移与二开兼容性平移 (Crossover & API Mig)',
    countLabel: '250+ 篇指南',
    icon: '🔄',
    links: [
      { title: '从传统 AutoCAD 完美迁移至 BricsCAD Pro 的全套 checklist', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 迁移至 GstarCAD：导入自定义 CUIX 菜单与 Hatch 填充', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 转 Inventor：无缝重建 3D 参数化装配体装配关系', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight 与 BricsCAD Pro 的 AutoLISP LISP 二次开发接口兼容性表', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '遗留 DGN 图纸完美转换 DWG 格式：解决层映射与符号转换偏差', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '国产 CAD 替代选型剖析：底层内核、API 接口与大型图纸运行对比', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '免费开源 FreeCAD 与商业 CAD 几何约束逻辑与二次开发对比', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '老旧 AutoCAD LISP 代码移植到廉价替代 CAD 的语法改写补丁', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'GstarCAD 快捷键 PGP 文件与自定义线型文件导入路径对照', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '网页云端 CAD 跨平台兼容性评估：性能瓶颈与网络要求', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ZWCAD command alias 命令别名及 AutoLISP 运行速度优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '从三维 Catia V5 降级导出为二维 DWG 剖面图的映射规范', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  }
];

export default function GuidesClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'calculators'>('all');
  
  // State to control collapsible drawer in All Category cards at top
  const [openCardAccordions, setOpenCardAccordions] = useState<Record<string, boolean>>({});
  
  // State to control sitemap folder accordions at bottom (collapsed by default for cleanliness)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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

  const isAll = activeTab === 'all';
  
  const displayArticles = ARTICLES_LIST.filter(a => a.category === activeTab).slice(0, 6);

  const accordionFaqs = [
    {
      q: 'How can our enterprise reduce annual CAD seat licensing costs safely?',
      a: 'Corporate offices can systematically audit named user logs to reclaim underutilized seats. Migrating general drawing groups from high-priced legacy solutions to modern, high-compatibility alternatives like BricsCAD Pro or GstarCAD can reduce licensing overhead by 50-70% while fully preserving legacy AutoLISP APIs, drawing templates, and key command shortcuts with zero retraining.'
    },
    {
      q: 'What are the compliance and security risks of deploying free CAD platforms?',
      a: 'Free cloud-based CAD engines typically require all user document repositories to remain public under their free tier plans, posing extreme security risks for proprietary engineering designs. Furthermore, using educational licenses for commercial drafting constitutes a direct EULA violation, making companies highly vulnerable to vendor network telemetry audits and sudden legal watermark infections.'
    },
    {
      q: 'How does the named-user subscription offline grace period work for isolated job sites?',
      a: 'Modern named-user subscriptions require local CAD licensing agents to periodically ping licensing servers to verify active entitlements. If engineers work completely offline at isolated project sites, software typically grants a strict 14-day to 30-day offline grace window. Once this period expires, drawing edits are disabled until the computer establishes a secure network connection.'
    },
    {
      q: 'Can we run legacy AutoLISP scripts and custom command menus in cheaper alternatives?',
      a: 'Yes. Premium alternatives (including BricsCAD Pro, ZWCAD, and GstarCAD) feature highly robust LISP runtime environments. You can import your custom enterprise menus (CUIX), hatch patterns, line weights, and command aliases (PGP) directly into the new interface, maintaining complete team productivity from day one.'
    }
  ];

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
        
        {/* --- CRITICAL: THE 8 HORIZONTAL TOP NAVIGATION TABS (Tab 1 to Tab 8) --- */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-12 border-b border-slate-200 pb-6 w-full">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
            { id: 'performance', label: 'Performance' },
            { id: 'printing', label: 'Print & PDF' },
            { id: 'standards', label: 'Standards' },
            { id: 'deployment', label: 'IT Deployment' },
            { id: 'migration', label: 'Crossover' },
            { id: 'calculators', label: 'Calculators' }
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

        {/* --- CRITICAL: 2-COLUMN GRID CONTAINING 6 SECTION CARDS WITH INTERNAL ACCORDIONS --- */}
        {isAll ? (
          /* STATE A: "All Guides" displaying the 6 Core Category Cards (Spacious & Clean, no trypophobia!) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {CATEGORY_SECTIONS.map((p, idx) => {
              const isCardOpen = !!openCardAccordions[p.id];
              return (
                <Card
                  key={p.id}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-8 bg-white relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-40" />

                  <div className="relative z-10 space-y-6">
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
                    </div>

                    {/* Collapsible Accordion Container inside Category Card (DOM-resident for Googlebot) */}
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden space-y-3",
                        isCardOpen ? "max-h-[500px] pt-4 border-t border-slate-100 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
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
                    </div>
                  </div>

                  {/* Accordion Toggle Trigger Trigger inside Card */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between w-full">
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
                      <span>{isCardOpen ? '收起热门指南' : `展开热门指南 (${p.articles.length} 篇)`}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab(p.category)}
                      className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-wider relative z-10"
                    >
                      进入板块 →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* STATE B: "Category Filtered" displaying 6 Popular Article/Calculators Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeTab === 'calculators' ? (
              /* Sub-Calculators View */
              [
                { name: 'CAD Scale & Plot Ratio Calculator', desc: 'Calculate exact scale ratios to prevent print size clipping errors.', slug: 'scale-calculator' },
                { name: 'FLEXlm Concurrency Licensing Tool', desc: 'Verify server sockets and estimate named-user floating allocations.', slug: 'license-calculator' },
                { name: 'ISO Standard Drawing Paper Setup Tool', desc: 'Calibrate paper width and margins for multi-sheet layouts.', slug: 'paper-calculator' },
                { name: 'B-Rep Solid Kernel Tolerances Tool', desc: 'Evaluate coordinate gap thresholds for SolidWorks model exports.', slug: 'tolerance-calculator' },
                { name: 'Enterprise CAD Seat Optimization Matcher', desc: 'Drip budget parameters to find cost-saving AutoCAD alternatives.', slug: 'seat-calculator' },
                { name: 'DWG/STEP Cross-Compatibility Checker', desc: 'Scan and flag read/write file compatibility vectors per version.', slug: 'compatibility-calculator' }
              ].map((calc, idx) => (
                <Card
                  key={idx}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 bg-white flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase text-slate-400">
                      <span>Section {idx + 1} Calculator</span>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Pure JS</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 hover:text-blue-600 transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{calc.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">Category: CAD Practical Tools</span>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-4 rounded-lg">
                      <Link href="/matchmaker">Launch Calculator →</Link>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              /* Specific Category Article Cards (Always showing exactly 6 high-density cards) */
              displayArticles.map((art, idx) => {
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
              })
            )}
          </div>
        )}

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
              点击文件夹右侧的小三角 `▶` 展开高密度专业指南链接网格。全站索引在 DOM 中静态就绪，完美兼容搜索引擎（Googlebot）全量抓取。
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
                      {/* Rotating Small Triangle Indicator (折叠为 ▶, 展开旋转 90 度为 ▼) */}
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
        <section className="mt-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Badge className="bg-indigo-600/10 text-indigo-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Q&A Interactive Board
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise CAD Operations Q&A Board
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Select an operational issue below to review detailed deployment recommendations and legal frameworks.
            </p>
          </div>

          <div className="space-y-4">
            {accordionFaqs.map((faq, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-black text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className={cn(
                      "transform transition-transform text-blue-600 text-sm font-bold shrink-0",
                      isOpen ? "rotate-180" : ""
                    )}>
                      ▼
                    </span>
                  </button>

                  {/* Accordion Collapsible Content panel */}
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 bg-slate-50/50",
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
