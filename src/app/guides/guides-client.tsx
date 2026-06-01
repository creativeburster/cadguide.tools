'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';

import {
  GuideCategorySection,
  CATEGORY_SECTIONS,
  GuideArticleCard,
  ARTICLES_LIST,
  DirectoryFolder,
  DIRECTORY_FOLDERS,
} from '@/lib/guides-data';

export const getProgrammaticLink = (title: string, forcedToolSlug?: string): string => {
  const titleLower = title.toLowerCase();
  
  // Find matching tool
  const matchedTool = [...tools]
    .sort((a, b) => b.slug.length - a.slug.length)
    .find(t => titleLower.includes(t.slug) || titleLower.includes(t.name.toLowerCase()));
    
  const toolSlug = forcedToolSlug || (matchedTool ? matchedTool.slug : 'autocad');
  
  // Determine category
  let category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing' = 'troubleshooting';
  if (titleLower.includes('perf') || titleLower.includes('tune') || titleLower.includes('lag') || titleLower.includes('speed') || titleLower.includes('stutter')) {
    category = 'performance';
  } else if (titleLower.includes('print') || titleLower.includes('pdf') || titleLower.includes('plot') || titleLower.includes('pen') || titleLower.includes('weight')) {
    category = 'printing';
  } else if (titleLower.includes('standard') || titleLower.includes('layer') || titleLower.includes('naming') || titleLower.includes('convention')) {
    category = 'standards';
  } else if (titleLower.includes('deploy') || titleLower.includes('install') || titleLower.includes('network') || titleLower.includes('server')) {
    category = 'deployment';
  } else if (titleLower.includes('migrat') || titleLower.includes('transition') || titleLower.includes('crossover') || titleLower.includes('import')) {
    category = 'migration';
  } else if (titleLower.includes('buy') || titleLower.includes('seat') || titleLower.includes('cost') || titleLower.includes('audit') || titleLower.includes('procure') || titleLower.includes('budget')) {
    category = 'procurement';
  } else if (titleLower.includes('cam') || titleLower.includes('cnc') || titleLower.includes('print') || titleLower.includes('mill') || titleLower.includes('metal') || titleLower.includes('g-code')) {
    category = 'manufacturing';
  }
  
  // Find index in category section
  const section = CATEGORY_SECTIONS.find(s => s.category === category);
  let index = 0;
  if (section) {
    const artIdx = section.articles.findIndex(art => 
      art.title.toLowerCase().split(' ').some(word => word.length > 3 && titleLower.includes(word))
    );
    if (artIdx >= 0) index = artIdx;
  }
  
  return `/guides/${toolSlug}-${category}-${index}`;
};

export function getLocalizedTitleAndExcerpt(title: string, excerpt: string, keyword: string, category: string, toolName: string) {
  let newTitle = title;
  let newExcerpt = excerpt;
  let newKeyword = keyword;

  if (category === 'migration' || category === 'crossover') {
    const targets = ['BricsCAD Pro', 'BricsCAD', 'GstarCAD', 'Inventor', 'Online Cloud CAD', 'DWG CAD'];
    for (const target of targets) {
      const regex = new RegExp(target, 'gi');
      if (regex.test(newTitle)) {
        newTitle = newTitle.replace(regex, toolName);
        newExcerpt = newExcerpt.replace(regex, toolName);
        newKeyword = newKeyword.replace(regex, toolName.toLowerCase());
        return { title: newTitle, excerpt: newExcerpt, keyword: newKeyword };
      }
    }
  }

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
    const regex = new RegExp(sw, 'gi');
    if (regex.test(newTitle)) {
      newTitle = newTitle.replace(regex, toolName);
      newExcerpt = newExcerpt.replace(regex, toolName);
      newKeyword = newKeyword.replace(regex, toolName.toLowerCase());
      break;
    }
  }

  return { title: newTitle, excerpt: newExcerpt, keyword: newKeyword };
}

export function getLocalizedTitle(title: string, category: string, toolName: string): string {
  return getLocalizedTitleAndExcerpt(title, '', '', category, toolName).title;
}

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
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>('all');
  
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

  const selectedTool = tools.find(t => t.slug === selectedToolSlug) || null;

  // Sync client-side document title for a flawless browser tab user experience
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (selectedTool) {
        const industries = selectedTool.industries || [];
        const isBIM = industries.some((i: string) => /bim|architect|civil|building/i.test(i)) || selectedTool.category_id === 'bim';
        const isMechanical = industries.some((i: string) => /mechanical|mfg|automotive|aerospace/i.test(i)) || selectedTool.category_id === 'mfg';
        const isOpenSource = selectedTool.pricing_type === 'Open Source' || selectedTool.pricing_type === 'Free';

        let customTitle = `${selectedTool.name} CAD Guides & IT Deployment`;
        if (isOpenSource) {
          customTitle = `${selectedTool.name} Free Guides & Custom Configs`;
        } else if (isBIM) {
          customTitle = `${selectedTool.name} BIM Guides & Enterprise Setup`;
        } else if (isMechanical) {
          customTitle = `${selectedTool.name} 3D Specs & Workstation Tuning`;
        }

        document.title = `${customTitle} | CADGuide.tools`;
      } else {
        document.title = 'CAD Professional Guides & IT Deployment | CADGuide.tools';
      }
    }
  }, [selectedTool]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam) {
        const matched = tools.find(t => t.slug === toolParam);
        if (matched) {
          setSelectedToolSlug(toolParam);
        }
      }
    }
  }, []);

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
  
  const rawDisplayArticles = ARTICLES_LIST.filter(a => a.category === activeTab).slice(0, 6);
  const displayArticles = rawDisplayArticles.map((art) => {
    if (!selectedTool) return art;
    const localized = getLocalizedTitleAndExcerpt(art.title, art.excerpt, art.keyword, art.category, selectedTool.name);
    return {
      ...art,
      title: localized.title,
      excerpt: localized.excerpt,
      keyword: localized.keyword,
      softwareSlug: selectedTool.slug
    };
  });

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
        <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium mb-8">
          Zero entry-level tutorials. Pure, B-End engineering blueprints, troubleshooting steps, and hardware tunings, curated by industry architects and IT administrators.
        </p>

        {/* --- PREMIUM DYNAMIC SOFTWARE FILTER --- */}
        <div className="max-w-md mx-auto mb-4 relative text-left">
          <label className="block text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 mb-2">
            Filter Guides by Software:
          </label>
          <div className="relative">
            <select
              value={selectedToolSlug}
              onChange={(e) => {
                setSelectedToolSlug(e.target.value);
                // Dynamically update query param
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  if (e.target.value === 'all') {
                    url.searchParams.delete('tool');
                  } else {
                    url.searchParams.set('tool', e.target.value);
                  }
                  window.history.pushState({}, '', url.toString());
                }
              }}
              className="w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-2xl px-5 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer transition-all hover:border-slate-300"
            >
              <option value="all">⚡ All CAD & BIM Software (Default Showcase)</option>
              {[...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} Guides
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
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
                        <Link href={`/guides/${p.category}`} className="hover:underline hover:text-blue-600 transition-colors">
                          {p.title}
                        </Link>
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
                        {p.articles.map((art, aIdx) => {
                          const displayTitle = selectedTool 
                            ? getLocalizedTitle(art.title, p.category, selectedTool.name)
                            : art.title;
                          const displayKeyword = selectedTool
                            ? getLocalizedTitleAndExcerpt('', '', art.keyword, p.category, selectedTool.name).keyword
                            : art.keyword;
                          const displaySlug = selectedTool
                            ? `${selectedTool.slug}-${p.category}-${aIdx}`
                            : `${p.category === 'troubleshooting' ? 'autocad' : 'solidworks'}-${p.category}-${aIdx}`;
                          return (
                            <li key={art.title} className="group/item flex items-start gap-2">
                              <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                              <div className="flex-1 min-w-0">
                                <Link 
                                  href={`/guides/${displaySlug}`} 
                                  className="font-bold text-slate-800 hover:text-blue-600 transition-colors group-hover/item:underline block leading-snug"
                                >
                                  {displayTitle}
                                </Link>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                  Keyword Mapped: {displayKeyword}
                                </span>
                              </div>
                            </li>
                          );
                        })}
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
                      <Link href={`/guides/${art.softwareSlug}-${art.category}-${art.id.split('-').pop()}`}>{art.title}</Link>
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
                      <Link href={`/guides/${art.softwareSlug}-${art.category}-${art.id.split('-').pop()}`} className="text-xs font-black text-blue-600 hover:underline">
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
                    {activeAlphabetList.map((item, idx) => {
                      const displayItem = selectedTool 
                        ? getLocalizedTitle(item, 'all', selectedTool.name)
                        : item;
                      return (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all group">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <Link href={getProgrammaticLink(item, selectedTool?.slug)} className="font-bold text-slate-800 group-hover:text-blue-600 hover:underline">
                            {displayItem}
                          </Link>
                        </div>
                      );
                    })}
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
                      {folder.links.map((link, lIdx) => {
                        const displayTitle = selectedTool 
                          ? getLocalizedTitle(link.title, folder.id.replace('fol-', ''), selectedTool.name)
                          : link.title;
                        return (
                          <div key={lIdx} className="flex items-start gap-2 p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
                            <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                            <Link 
                              href={getProgrammaticLink(link.title, selectedTool?.slug)} 
                              className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors hover:underline block leading-snug"
                            >
                              {displayTitle}
                            </Link>
                          </div>
                        );
                      })}
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
