'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Search,
  ChevronRight
} from 'lucide-react';

import {
  CATEGORY_SECTIONS,
  ARTICLES_LIST,
  getArchetypeMetadata,
  getLocalizedTitleAndExcerpt,
  isArticleCompatibleWithTool
} from '@/lib/guides-data';



export default function GuidesClient() {
  // Navigation View logic (matching Gstaracademy)
  const [currentView, setCurrentView] = useState<'overview' | 'tool-guide' | 'faq'>('overview');
  
  // Traditional Guide list state
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing'>('all');
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>('all');
  
  // Q&A section state
  const [faqTab, setFaqTab] = useState<'all' | 'licensing' | 'performance' | 'standards'>('all');
  const [faqPage, setFaqPage] = useState<number>(1);
  const [openFaqQuestion, setOpenFaqQuestion] = useState<string | null>(null);

  // Search logic for left sidebar
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTool = tools.find(t => t.slug === selectedToolSlug) || null;
  const meta = selectedTool ? getArchetypeMetadata(selectedTool.category_id) : null;

  // Sync title
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

  const sortedCategorySections = React.useMemo(() => {
    if (!meta) return CATEGORY_SECTIONS;
    return [...CATEGORY_SECTIONS].sort((a, b) => {
      const indexA = meta.categoryOrder.indexOf(a.category);
      const indexB = meta.categoryOrder.indexOf(b.category);
      return indexA - indexB;
    });
  }, [meta]);



  const handleFaqTabChange = (tabId: 'all' | 'licensing' | 'performance' | 'standards') => {
    setFaqTab(tabId);
    setFaqPage(1);
    setOpenFaqQuestion(null);
  };

  const isAll = activeTab === 'all';

  const safeAvailableGuides = React.useMemo(() => {
    if (!selectedTool) return [];
    
    const allCompatible = ARTICLES_LIST.filter((g) =>
      isArticleCompatibleWithTool(g.title, g.category, selectedTool)
    );
    
    let safe = allCompatible;
    if (safe.length < 4) {
      const fallbackPool = ARTICLES_LIST.filter(
        (g) =>
          !safe.some((existing) => existing.id === g.id) &&
          !g.title.toLowerCase().includes("license") &&
          !g.title.toLowerCase().includes("flexlm") &&
          !g.title.toLowerCase().includes("ssot") &&
          !g.title.toLowerCase().includes("procurement")
      );
      safe = [...safe, ...fallbackPool].slice(0, 100);
    }
    
    return safe.map((g) => {
      const localized = getLocalizedTitleAndExcerpt(g.title, g.excerpt, g.keyword, g.category, selectedTool);
      return {
        ...g,
        title: localized.title,
        excerpt: localized.excerpt,
        keyword: localized.keyword,
        slug: g.slug
      };
    });
  }, [selectedTool]);

  const accordionFaqs = [
    {
      category: 'licensing',
      tools: ['autocad', 'solidworks', 'revit'],
      q: 'How to diagnose and resolve FLEXlm Network License Error -15,10?',
      a: 'FLEXlm Error -15,10 occurs when the client machine cannot establish communication with the licensing manager server. To resolve it: 1. Ensure the server host is reachable and both the license manager port (default 27000-27009) and vendor daemon port (adskflex, default 2080) are open in all network firewalls. 2. Verify that the system environment variable ADSKFLEX_LICENSE_FILE is correctly set to @YOUR_SERVER_IP on the client machine. 3. Open the LICPATH.lic file in your AutoCAD install directory and verify the server hostname is correctly resolved to the server IP.'
    },
    {
      category: 'performance',
      tools: ['autocad'],
      q: 'How to resolve AutoCAD viewport freezes caused by Windows Registry port socket leakage?',
      a: 'High-frequency model database rebuilds or external references can cause Windows local port/socket depletion. To fix this: 1. Press Win+R, type regedit, and navigate to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters. 2. Create a new DWORD (32-bit) Value named MaxUserPort and set its value data to 65534 (decimal) to expand the ephemeral port range. 3. Create another DWORD named TcpTimedWaitDelay and set its value to 30 (decimal) to release closed ports faster. Restart your system for changes to apply.'
    },
    {
      category: 'performance',
      tools: ['autocad'],
      q: 'How to prevent stutters and memory leakage caused by high-density hatch patterns?',
      a: 'Ultra-dense or corruption-prone hatch boundaries force AutoCAD to compute millions of lines, depleting rendering memory. To prevent crashes: 1. Type HPMAXLINES in the command bar and reduce the maximum line rendering limit (e.g., set it to 100000). 2. Use the HPMAXAREAS command to restrict the search space for hatch detection. 3. Always check for closed loop boundaries before applying hatches, and disable associative hatching if the drawing experiences recurring layout stutter.'
    },
    {
      category: 'licensing',
      tools: ['autocad', 'solidworks', 'revit'],
      q: 'How can our enterprise reduce annual CAD seat licensing costs safely?',
      a: 'Corporate offices can systematically audit named user logs to reclaim underutilized seats. Migrating general drawing groups from high-priced legacy solutions to modern, high-compatibility alternatives like BricsCAD Pro or GstarCAD can reduce licensing overhead by 50-70% while fully preserving legacy AutoLISP APIs, drawing templates, and key command shortcuts with zero retraining.'
    },
    {
      category: 'performance',
      tools: ['autocad'],
      q: 'How to debug and resolve AutoCAD Fatal Error 0x0024 crash?',
      a: 'AutoCAD Fatal Error 0x0024 is typically caused by memory block corruptions in the drawing database structure or temporary file locks. To resolve it: 1. Clean your Windows temp files by deleting everything in %TEMP%. 2. Launch AutoCAD and open the drawing using the RECOVER command to audit database blocks. 3. Run the PURGE command to clean unused blocks, registered applications (RegApps), and zero-length geometry. 4. Disable hardware acceleration temporarily via 3DCONFIG if the crash occurs during viewport rendering.'
    },
    {
      category: 'standards',
      tools: ['autocad'],
      q: 'How to fix the Secure Load Warning when running custom AutoLISP scripts?',
      a: 'Starting from AutoCAD 2014, security protocols prevent loading custom LISP routines from non-secure pathways, triggering the Secure Load Warning. To bypass this safely: 1. Type SECURELOAD in the command bar and set it to 1 (warns but loads) or 0 (loads unconditionally, not recommended for untrusted scripts). 2. Add your custom script folders to the TRUSTEDPATHS system variable via Options > Files > Trusted Locations, ensuring all enterprise custom CUIX/LISP repositories load seamlessly.'
    },
    {
      category: 'performance',
      tools: ['solidworks'],
      q: 'How to prevent SolidWorks Out of Memory and system resource depletion crashes on large assemblies?',
      a: 'When working with large assemblies, SolidWorks can exhaust Windows commit charge limits even with high physical RAM. Resolve this by: 1. Navigating to Windows System Properties > Performance Settings > Advanced > Virtual Memory. 2. Uncheck \'Automatically manage paging file size for all drives\'. 3. Manually configure a custom Pagefile (Swap) size set to 1.5x to 2x your physical RAM (e.g., Min 49152MB, Max 98304MB for a 64GB RAM workstation) on your fastest NVMe SSD. Restart Windows to prevent GDI leak and memory allocation lockups.'
    },
    {
      category: 'standards',
      tools: ['solidworks'],
      q: 'How to repair imported STEP/IGES broken faces and sheet knitting tolerance failures in SolidWorks?',
      a: 'Imported non-native files often contain sheet gaps due to mathematical modeler tolerance drift. To form a solid body: 1. Right-click the imported body in the FeatureManager Tree and launch Import Diagnostics to automatically detect gap boundaries and overlap faces. 2. Adjust the Heal Tolerance slider or manually run the Knit Surface command. 3. Check \'Try to form solid\' and set a custom knitting tolerance of 0.025mm to 0.1mm (do not exceed 0.25mm to avoid geometry distortion). 4. If knitting fails, delete the problematic faces and use Boundary Surface or Filled Surface to manually patch the open loop before re-knitting.'
    },
    {
      category: 'performance',
      tools: ['solidworks'],
      q: 'How to eliminate SolidWorks assembly viewport stutter and graphics lag?',
      a: 'SolidWorks viewport lag is usually caused by uncertified graphics drivers or suboptimal performance options. Resolve it by: 1. Navigating to System Options > Performance, and check \'Use Software OpenGL\' to test if the graphics card driver is the bottleneck. 2. Ensure you are using certified ISV Workstation graphics drivers (NVIDIA RTX/Quadro or AMD Radeon Pro) instead of mainstream gaming drivers. 3. Open NVIDIA Control Panel, go to Manage 3D Settings, locate SolidWorks, and set Threaded Optimization to OFF and Power Management to Prefer Maximum Performance.'
    },
    {
      category: 'standards',
      tools: ['solidworks'],
      q: 'How do we configure K-Factor sheet metal bend calculations in SolidWorks?',
      a: 'K-Factor is the ratio that represents the location of the neutral sheet in sheet metal bending. In SolidWorks, configuring K-Factor determines the precise flat pattern blank length. Standard reference parameters for common materials: 1. Soft Copper/Brass: K-Factor = 0.35. 2. Mild Steel/Carbon Steel: K-Factor = 0.44 to 0.45. 3. Stainless Steel: K-Factor = 0.40 to 0.42. 4. Aluminum Alloys: K-Factor = 0.50 (hard bend). Use the sheet metal bend table (Excel template) hosted on the shared server to override local calculation deviations automatically.'
    },
    {
      category: 'performance',
      tools: ['solidworks'],
      q: 'How do we resolve file local cache conflicts and version lockups in SolidWorks PDM?',
      a: 'SolidWorks PDM cache lockups happen when local file versions drift from the database vault metadata, especially when working offline. To fix this: 1. Right-click the vault directory, choose \'Clear Local Cache\' to remove un-checked-out files. 2. If files remain locked, open PDM Administration, go to User Settings, and select \'Force Get Latest Version\' on drawing open. 3. Kill the PDM service processes (EdmServer.exe, ConisioAdmin.exe) via Task Manager and delete the hidden \'.lock\' metadata files in the local workspace directory.'
    },
    {
      category: 'standards',
      tools: ['revit'],
      q: 'How to resolve model position drift and alignment shifts in linked Revit models?',
      a: 'BIM link coordinate offset happens when separate discipline files use misaligned Project Base Points or Survey Points. To resolve: 1. Open the host architectural model. 2. Insert the linked structural/MEP model via Link Revit, selecting Auto - Origin to Internal Origin or Auto - Project Base Point. 3. Select the link instance in the viewport, look at the Properties palette, and click Acquire Coordinates. This pulls the shared coordinate system from the host to the link. 4. Pin both Survey Points and Project Base Points to lock coordinates against accidental manual drag.'
    },
    {
      category: 'standards',
      tools: ['revit'],
      q: 'How to configure Revit IFC4 export settings to prevent missing parameter sets and class mapping errors?',
      a: 'Revit category parameters often drop during standard IFC exports, and entities can map incorrectly. Fix this by: 1. Navigating to File > Export > Options > IFC Options to check the class mapping table (e.g., ensure Revit Columns map to IfcColumn and generic models map to IfcBuildingElementProxy only where appropriate). 2. Choose IFC4 Design Transfer View or IFC2x3 Coordination View 2.0. 3. Under export setup, check \'Export Revit property sets\' and \'Export user-defined property sets\'. 4. Check \'Export base quantities\' to generate net volume and surface area parameters for downstream schedule verification.'
    },
    {
      category: 'performance',
      tools: ['revit'],
      q: 'How to optimize bloated Revit families and resolve view redraw lags in heavy project models?',
      a: 'Importing heavy, un-optimized families (containing millions of polygons or deep multi-level nestings) will bloat the .rvt file and freeze viewports. To clean them: 1. Open the family file (.rfa), run the Purge Unused command at least three times. 2. Select complex 3D geometry and use Visibility/Graphics Overrides to hide detailed geometries in Coarse and Medium views, drawing lightweight 2D symbolic lines for general layouts instead. 3. Avoid deep nested family levels; flag necessary nested sub-families as Shared to reuse resources across instances. 4. Convert un-parameterized imported CAD meshes into native Revit solid extrusions.'
    },
    {
      category: 'licensing',
      tools: ['autocad', 'solidworks', 'revit'],
      q: 'What are the compliance and security risks of deploying free CAD platforms?',
      a: 'Free cloud-based CAD engines typically require all user document repositories to remain public under their free tier plans, posing extreme security risks for proprietary engineering designs. Furthermore, using educational licenses for commercial drafting constitutes a direct EULA violation, making companies highly vulnerable to vendor network telemetry audits and sudden legal watermark infections.'
    },
    {
      category: 'licensing',
      tools: ['autocad', 'solidworks', 'revit'],
      q: 'What are the legal EULA risks associated with academic watermarks inside commercial drawings?',
      a: 'Commercial distribution of files containing student watermarks can lead to immediate audit fines. B-End organizations must restrict academic seat usage to certified environments and leverage automated DWG audit scripts to sweep external vendor blocks before database commits.'
    },
    {
      category: 'standards',
      tools: ['autocad'],
      q: 'How do we automate ISO scaling pen weight standards across multi-disciplinary teams?',
      a: 'Enterprise CAD administrators can establish uniform CTB (Color-Dependent) plot styles hosted on shared network directories. Integrating standard startup scripts into the custom CUIX layout ensures drafting scales remain synchronized for every user login.'
    }
  ];

  const searchLower = searchQuery.toLowerCase().trim();
  const filteredFaqs = (faqTab === 'all' 
    ? accordionFaqs 
    : accordionFaqs.filter(f => f.category === faqTab)
  ).filter(f => {
    if (selectedToolSlug !== 'all') {
      return f.tools.includes(selectedToolSlug);
    }
    return true;
  }).filter(f => 
    !searchLower || 
    f.q.toLowerCase().includes(searchLower) || 
    f.a.toLowerCase().includes(searchLower)
  );

  const FAQS_PER_PAGE = 3;
  const totalFaqPages = Math.ceil(filteredFaqs.length / FAQS_PER_PAGE);
  const displayedFaqs = filteredFaqs.slice((faqPage - 1) * FAQS_PER_PAGE, faqPage * FAQS_PER_PAGE);

  // Left Sidebar Filter Logic
  const sidebarNavItems = [
    { id: 'overview', label: 'Overview', icon: '🏛' },
    { id: 'faq', label: 'FAQ', icon: '💬' }
  ];

  const filteredSidebarItems = sidebarNavItems
    .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#f7f5f0] pb-24 text-slate-800">

      {/* Decorative Visual Header Accent Line */}
      <div className={cn(
        "w-full h-1.5 bg-gradient-to-r",
        meta?.id === 'drafting-aec' && "from-slate-500 via-slate-600 to-slate-700",
        meta?.id === 'mechanical-simulation' && "from-amber-500 via-amber-600 to-amber-700",
        meta?.id === 'creative-visual' && "from-indigo-500 via-indigo-600 to-indigo-700",
        meta?.id === 'electronics-hardware' && "from-emerald-500 via-emerald-600 to-emerald-700",
        !meta && "from-blue-500 via-indigo-500 to-purple-500"
      )} />

      {/* Gstaracademy Style Layout Container */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-300 font-normal">/</span>
          <span className="text-slate-600">Guides & Knowledge Base</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- LEFT SIDEBAR (Gstaracademy Layout matching) --- */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
          {/* Quick Search */}
          <Card className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Base..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </Card>

          {/* Sidebar quick Software Filter */}
          <Card className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-2">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">
              Active Software Focus
            </span>
            <div className="relative">
              <select
                value={selectedToolSlug}
                onChange={(e) => {
                  setSelectedToolSlug(e.target.value);
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
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-slate-100/50"
              >
                <option value="all">⚡ All Software</option>
                {[...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-[9px]">
                ▼
              </div>
            </div>
          </Card>

          {/* Navigation Menu */}
          <Card className="p-2.5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col gap-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase px-3 py-1.5">
              Knowledge Navigation
            </span>
            {filteredSidebarItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </Card>
        </aside>

        {/* --- MAIN DISPLAY PANEL (Gstaracademy Layout matching) --- */}
        <section className="flex-grow min-w-0">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-4 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tool-guide', label: selectedTool ? `${selectedTool.name} Guides` : 'Tool Guides' },
              { id: 'faq', label: 'FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  currentView === tab.id
                    ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200/80 hover:border-slate-300 hover:text-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* VIEW A: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Header Box */}
              <Card className="p-8 sm:p-10 rounded-[32px] bg-white border border-slate-200/50 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 font-bold uppercase tracking-widest text-[9px] rounded-full">
                    Gstaracademy - Knowledge Center
                  </Badge>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    Enterprise CAx Knowledge & Operational Center
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    Zero introductory manuals. Direct, high-precision technical blueprints, memory tuning profiles, registry sockets, and cross-format conversion standards.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 max-w-xl mx-auto text-center font-bold">
                  <div>
                    <span className="block text-2xl font-black text-slate-900">440+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Technical Terms</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-slate-900">240+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Software Profiles</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-slate-900">2,500+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Linked Guides</span>
                  </div>
                </div>
              </Card>

              {/* Symmetric Grid of Category sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedCategorySections.map((p, idx) => {

                  return (
                    <Card
                      key={p.id}
                      className="border border-slate-200/50 shadow-sm rounded-3xl p-6 sm:p-7 bg-white relative overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Section {idx + 1}
                          </span>
                          <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[8px] font-bold border-slate-100 uppercase tracking-wide">
                            {p.countLabel}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                          <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${p.gradient}`} />
                          {p.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                          {p.desc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] font-bold bg-slate-50 border border-slate-150 text-slate-400 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setActiveTab(p.category);
                              setCurrentView('tool-guide');
                            }}
                            className="text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group/btn"
                          >
                            Browse Category Guides <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}          {/* VIEW: TOOL GUIDES */}
          {currentView === 'tool-guide' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Category tabs inside Tool Guide */}
              <Card className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
                  {[
                    { id: 'all', label: 'All Operations' },
                    { id: 'procurement', label: 'Procurement & TCO' },
                    { id: 'troubleshooting', label: 'Troubleshooting' },
                    { id: 'performance', label: 'Performance' },
                    { id: 'standards', label: 'Standards' },
                    { id: 'deployment', label: 'IT Deployment' },
                    { id: 'migration', label: 'Migration & API' },
                    { id: 'manufacturing', label: 'Specialized Toolsets' },
                    { id: 'printing', label: 'Printing & Plotting' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        activeTab === tab.id
                          ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Guides Display Flow */}
              {selectedToolSlug === 'all' ? (
                <Card className="p-8 sm:p-12 rounded-[32px] bg-white border border-slate-200/50 shadow-sm text-center max-w-2xl mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mx-auto text-2xl animate-bounce">
                    💻
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Select a Software Core Blueprint</h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto font-medium">
                      Please select a specific software from the left sidebar focus menu, or choose one of our verified platforms below to retrieve its dedicated IT operation and deployment blueprints.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {[
                      { slug: 'autocad', name: 'AutoCAD', emoji: '📐' },
                      { slug: 'solidworks', name: 'SolidWorks', emoji: '🔩' },
                      { slug: 'revit', name: 'Revit', emoji: '🏢' }
                    ].map((t) => (
                      <button
                        key={t.slug}
                        onClick={() => {
                          setSelectedToolSlug(t.slug);
                          if (typeof window !== 'undefined') {
                            const url = new URL(window.location.href);
                            url.searchParams.set('tool', t.slug);
                            window.history.pushState({}, '', url.toString());
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl transition-all shadow-sm"
                      >
                        <span>{t.emoji}</span> {t.name}
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (() => {
                const searchLower = searchQuery.toLowerCase().trim();
                const filteredGuides = (activeTab === 'all'
                  ? safeAvailableGuides
                  : safeAvailableGuides.filter(g => g.category === activeTab)
                ).filter(g => 
                  !searchLower ||
                  g.title.toLowerCase().includes(searchLower) ||
                  g.excerpt.toLowerCase().includes(searchLower)
                );

                if (filteredGuides.length === 0) {
                  return (
                    <Card className="p-8 sm:p-12 rounded-[32px] bg-white border border-slate-200/50 shadow-sm text-center max-w-xl mx-auto space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 mx-auto text-xl">
                        🔍
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-slate-900">No Guides Found</h5>
                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs mx-auto font-medium">
                          We couldn't find any guide in this section matching "{searchQuery}" for {selectedTool?.name}. Try adjusting your keywords.
                        </p>
                      </div>
                    </Card>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredGuides.map((art) => {
                      return (
                        <Card key={art.title} className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/55 hover:border-slate-300 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-black uppercase tracking-[0.15em] bg-blue-50 text-blue-750 border border-blue-100 px-2 py-0.5 rounded-md">
                                {art.category === 'procurement' ? 'Procurement & TCO' : art.category === 'performance' ? 'Performance' : art.category === 'standards' ? 'Standards' : art.category === 'troubleshooting' ? 'Troubleshooting' : art.category === 'deployment' ? 'IT Deployment' : art.category === 'migration' ? 'Migration & API' : art.category === 'manufacturing' ? 'Specialized Toolsets' : 'Printing & Plotting'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold">{art.keyword}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                              <Link href={`/guides/${art.slug}`}>
                                {art.title}
                              </Link>
                            </h4>
                            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-semibold">
                              {art.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 border-t border-slate-100/60 mt-4 flex items-center justify-between">
                            <Link href={`/guides/${art.slug}`} className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline inline-flex items-center gap-1 group/link">
                              Deploy Blueprint <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                            </Link>
                            <span className="text-[9px] text-slate-400 font-bold">AEC Verified</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                );
              })()}

            </div>
          )}


          {/* VIEW D: TECHNICAL FAQ */}
          {currentView === 'faq' && (
            <section className="space-y-6 animate-in fade-in duration-300">
              <Card className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-200 pb-5 max-w-2xl mx-auto">
                  {[
                    { id: 'all', label: 'All Operations' },
                    { id: 'licensing', label: 'Licensing & SAM' },
                    { id: 'performance', label: 'Workstation Speed' },
                    { id: 'standards', label: 'Standards & API' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleFaqTabChange(tab.id as Parameters<typeof handleFaqTabChange>[0])}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        faqTab === tab.id
                          ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md shadow-slate-100 scale-[1.02]'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  {displayedFaqs.map((faq) => {
                    const isOpen = openFaqQuestion === faq.q;
                    return (
                      <div key={faq.q} className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-sm">
                        <button
                          onClick={() => setOpenFaqQuestion(isOpen ? null : faq.q)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50/50 transition-colors gap-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.15em] bg-indigo-50 text-indigo-600 border border-indigo-100/50 px-2 py-0.5 rounded-md shrink-0">
                              {faq.category === 'licensing' ? 'Licensing & SAM' : faq.category === 'performance' ? 'Performance' : 'Standards'}
                            </span>
                            <span>{faq.q}</span>
                          </div>
                          <span className={cn("transform transition-transform text-indigo-600 text-xs shrink-0", isOpen ? "rotate-180" : "")}>
                            ▼
                          </span>
                        </button>
                        <div className={cn("transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 bg-slate-50/30", isOpen ? "max-h-96 p-4 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none")}>
                          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>
          )}



        </section>
      </div>
      </div>
    </main>
  );
}
