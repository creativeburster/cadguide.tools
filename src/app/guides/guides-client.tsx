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
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'calculators'>('all');
  const [activeLetter, setActiveLetter] = useState<string>('A');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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

        {/* --- CRITICAL: 2-COLUMN GRID CONTAINING 6 SECTION CARDS (Section 1 to Section 6) --- */}
        {isAll ? (
          /* STATE A: "All Guides" displaying the 6 Core Category Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {CATEGORY_SECTIONS.map((p, idx) => (
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
                      <Badge variant="outline" className="bg-slate-50 text-slate-400 text-[9px] font-bold border-slate-100 uppercase tracking-wide">
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

                  {/* Featured Sub-articles */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
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

                <div 
                  onClick={() => setActiveTab(p.category)}
                  className="mt-8 pt-4 border-t border-slate-100 text-xs font-black text-blue-600 flex items-center gap-1 cursor-pointer relative z-10 self-start hover:underline"
                >
                  <span>Explore Section {idx + 1} Guides</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Card>
            ))}
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

        {/* --- CRITICAL: THE 2,500-PAGE SEO ALPHABETICAL & SITE DIRECTORY INDEX --- */}
        {/* We statically render all letters' content in the DOM and toggle display using class bindings. */}
        {/* This makes 100% of sitemap pathways immediately crawlable by search engine bots in a single fetch! */}
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
                    isSelected ? "block" : "hidden"
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
                        {/* Link is dummy preview pointing to AutoCAD fatal error */}
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
