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
import { accordionFaqs } from '@/lib/faq-data';



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
    // 过滤掉免费/开源工具的采购分类
    let sections = CATEGORY_SECTIONS;
    if (selectedTool) {
      const isOpenSource = (selectedTool.pricing_type as string) === 'Open Source' || (selectedTool.pricing_type as string) === 'Free';
      if (isOpenSource) {
        sections = sections.filter(s => s.category !== 'procurement');
      }
    }

    if (!meta) return sections;
    return [...sections].sort((a, b) => {
      const indexA = meta.categoryOrder.indexOf(a.category);
      const indexB = meta.categoryOrder.indexOf(b.category);
      return indexA - indexB;
    });
  }, [meta, selectedTool]);



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

  const FAQS_PER_PAGE = 10; // Set to 10 for paginated view of official FAQs
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
                  const mappedInfo = getMappedCategoryInfo(p.category, selectedTool, p.title, p.desc);

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
                          {mappedInfo.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                          {mappedInfo.desc}
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
                  {getCategoryTabsForTool(selectedTool, safeAvailableGuides).map((tab) => (
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
                                {getJargonLabelForCategory(art.category, selectedTool)}
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
                  {(() => {
                    const toolFaqs = accordionFaqs.filter(f => {
                      if (selectedToolSlug !== 'all') {
                        return f.tools.includes(selectedToolSlug);
                      }
                      return true;
                    });
                    const activeFaqCategories = new Set(toolFaqs.map(f => f.category));
                    const faqTabs = [
                      { id: 'all', label: 'All Operations' },
                      ...[
                        { id: 'licensing', label: 'Licensing & SAM' },
                        { id: 'performance', label: 'Workstation Speed' },
                        { id: 'standards', label: 'Standards & API' }
                      ].filter(t => activeFaqCategories.has(t.id as any))
                    ].map(t => {
                      if (t.id === 'all') return t;
                      return {
                        id: t.id,
                        label: getJargonLabelForCategory(t.id, selectedTool)
                      };
                    });
                    return faqTabs.map((tab) => (
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
                    ));
                  })()}
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
                              {getJargonLabelForCategory(faq.category, selectedTool)}
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

                {/* Pagination Controls */}
                {totalFaqPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6 max-w-2xl mx-auto">
                    <button
                      disabled={faqPage === 1}
                      onClick={() => {
                        setFaqPage(prev => Math.max(prev - 1, 1));
                        setOpenFaqQuestion(null);
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:border-slate-300 disabled:opacity-40 disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all"
                    >
                      ← Prev
                    </button>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Page <span className="text-slate-800 font-extrabold">{faqPage}</span> of <span className="text-slate-800 font-extrabold">{totalFaqPages}</span>
                    </div>
                    <button
                      disabled={faqPage === totalFaqPages}
                      onClick={() => {
                        setFaqPage(prev => Math.min(prev + 1, totalFaqPages));
                        setOpenFaqQuestion(null);
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:border-slate-300 disabled:opacity-40 disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </Card>
            </section>
          )}



        </section>
      </div>
      </div>
    </main>
  );
}

function getJargonLabelForCategory(category: string, tool: any): string {
  if (!tool) {
    switch (category) {
      case 'procurement':
      case 'licensing':
        return 'Licensing & TCO';
      case 'troubleshooting':
        return 'Troubleshooting';
      case 'performance':
        return 'Workstation Speed';
      case 'standards':
        return 'Standards';
      case 'deployment':
        return 'IT Deployment';
      case 'migration':
        return 'Migration & API';
      case 'manufacturing':
        return 'Specialized Toolsets';
      case 'printing':
        return 'Printing & Plotting';
      default:
        return category;
    }
  }

  const industries = tool.industries || [];
  const isBIM = industries.some((i: string) => /bim|architect|civil|building/i.test(i)) || tool.category_id === 'bim';
  const isMCAD = industries.some((i: string) => /mechanical|mfg|automotive|aerospace/i.test(i)) || tool.category_id === 'mfg';
  const isEDA = industries.some((i: string) => /electronics|eda|pcb|hardware/i.test(i)) || tool.category_id === 'c6' || tool.category_id === 'eda' || tool.slug === 'altium-designer';
  const isCAE = industries.some((i: string) => /simulation|analysis|cae|finite/i.test(i)) || tool.category_id === 'cae' || tool.slug === 'ansys';
  const isFreeCAD = tool.slug === 'freecad';

  if (tool.slug === 'catia') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'DSLS Cost & TCO';
      case 'troubleshooting':
        return 'ENOVIA & GSD Repair';
      case 'performance':
        return 'Cache Mode & V5 Graphics';
      case 'standards':
        return 'DSLS & CAD Formats';
      case 'deployment':
        return 'DSLS Server Installation';
      case 'migration':
        return 'CAA API & ENOVIA Sync';
      case 'manufacturing':
        return 'GSD Surfaces & NC Toolpath';
      case 'printing':
        return 'Drafting Sheet Formats';
    }
  }

  if (tool.slug === 'ansys') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Ansys Licensing & TCO';
      case 'troubleshooting':
        return 'Mesh & Solver Debugging';
      case 'performance':
        return 'GPU Solver Acceleration';
      case 'standards':
        return 'FEA Mesh & Solver Standards';
      case 'deployment':
        return 'MPI & Cluster Deployment';
      case 'migration':
        return 'APDL & ACT Scripting';
      case 'manufacturing':
        return 'HPC Solver & Cluster Tuning';
      case 'printing':
        return 'Post-Processing Reports';
    }
  }

  if (tool.slug === 'creo') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Creo Licensing & TCO';
      case 'troubleshooting':
        return 'Skeleton Loops & PLM Fix';
      case 'performance':
        return 'Windchill Cache & Speed';
      case 'standards':
        return 'config.pro & Drawing Specs';
      case 'deployment':
        return 'Windchill Server Setup';
      case 'migration':
        return 'OTK C++ & Toolkit API';
      case 'manufacturing':
        return 'Skeleton Top-down & Sheetmetal';
      case 'printing':
        return 'config.pro Output templates';
    }
  }

  if (isFreeCAD) {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Open Source Compliance';
      case 'troubleshooting':
        return 'Topo Naming & Sketcher Debug';
      case 'performance':
        return 'Coin3D Viewport Speed';
      case 'standards':
        return 'OpenCASCADE Topology & STEP';
      case 'deployment':
        return 'AppImage & Python Env';
      case 'migration':
        return 'Python Macro Scripting';
      case 'manufacturing':
        return 'PartDesign sketcher & CAM';
      case 'printing':
        return 'TechDraw 2D Sheet Templates';
    }
  }

  if (tool.slug === 'autocad') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Autodesk Licensing & TCO';
      case 'troubleshooting':
        return 'Plot Styles & Font Repair';
      case 'performance':
        return 'Graphics Hardware Speed';
      case 'standards':
        return 'CAD Layer & CTB Standards';
      case 'deployment':
        return 'Network License Deployment';
      case 'migration':
        return 'AutoLISP & ObjectARX API';
      case 'manufacturing':
        return 'Specialized Toolsets & Blocks';
      case 'printing':
        return 'Plot Style & Printing';
    }
  }

  if (tool.slug === 'revit') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Autodesk Cloud Licensing';
      case 'troubleshooting':
        return 'Coordinates & Link Model Repair';
      case 'performance':
        return 'BIM Model & View Performance';
      case 'standards':
        return 'BIM Standards & Coordinates';
      case 'deployment':
        return 'Revit Server & Network Setup';
      case 'migration':
        return 'Dynamo & Revit API Scripting';
      case 'manufacturing':
        return 'MEP & Structural Detailing';
      case 'printing':
        return 'PDF Sheet Printing';
    }
  }

  if (tool.slug === 'altium-designer') {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'Altium 365 Licensing TCO';
      case 'troubleshooting':
        return 'DRC Violations & Git Merge';
      case 'performance':
        return 'PCB Viewport & DRC Lag';
      case 'standards':
        return 'DRC Rules & OutJob Templates';
      case 'deployment':
        return 'Altium 365 Workspace Setup';
      case 'migration':
        return 'Library Sync & Database API';
      case 'manufacturing':
        return 'PCB Layout & Gerber Setup';
      case 'printing':
        return 'OutJob Output Generation';
    }
  }

  if (isBIM) {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'BIM Subscription TCO';
      case 'troubleshooting':
        return 'BIM Coordination Debugging';
      case 'performance':
        return 'BIM Viewport & Model Speed';
      case 'standards':
        return 'BIM Standards & Coordinates';
      case 'deployment':
        return 'BIM IT & Network Deployment';
      case 'migration':
        return 'BIM Automation & API Scripting';
      case 'manufacturing':
        return 'MEP & Construction Detailing';
      case 'printing':
        return 'BIM PDF Sheet Printing';
    }
  }

  if (isMCAD) {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'MCAD Licensing TCO';
      case 'troubleshooting':
        return 'MCAD Part & Model Repair';
      case 'performance':
        return 'MCAD Assembly & Drawing Speed';
      case 'standards':
        return 'MCAD Formats & Standards';
      case 'deployment':
        return 'MCAD PDM & Server Setup';
      case 'migration':
        return 'MCAD PDM & API Customization';
      case 'manufacturing':
        return 'Sheet Metal & CAM Toolpaths';
      case 'printing':
        return 'MCAD Drawing & Pen Styles';
    }
  }

  if (isEDA) {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'EDA Software Licensing TCO';
      case 'troubleshooting':
        return 'DRC Violation & Design Healing';
      case 'performance':
        return 'EDA Viewport & Check Speed';
      case 'standards':
        return 'Clearance & Trace Standards';
      case 'deployment':
        return 'EDA Server & DB Configuration';
      case 'migration':
        return 'Library & Database API';
      case 'manufacturing':
        return 'PCB Gerber & Layout Setup';
      case 'printing':
        return 'OutJob Output Templates';
    }
  }

  if (isCAE) {
    switch (category) {
      case 'licensing':
      case 'procurement':
        return 'CAE Simulation TCO';
      case 'troubleshooting':
        return 'CAE Solver Troubleshooting';
      case 'performance':
        return 'CAE HPC & GPU Acceleration';
      case 'standards':
        return 'FEA Mesh & Convergence';
      case 'deployment':
        return 'CAE HPC Cluster Deployment';
      case 'migration':
        return 'Solver Scripting & API Extensions';
      case 'manufacturing':
        return 'CAE Simulation & Model Setup';
      case 'printing':
        return 'Post-Processing Reports';
    }
  }

  switch (category) {
    case 'procurement':
    case 'licensing':
      return 'Licensing & TCO';
    case 'troubleshooting':
      return 'Troubleshooting';
    case 'performance':
      return 'Workstation Speed';
    case 'standards':
      return 'Standards';
    case 'deployment':
      return 'IT Deployment';
    case 'migration':
      return 'Migration & API';
    case 'manufacturing':
      return 'Specialized Toolsets';
    case 'printing':
      return 'Printing & Plotting';
    default:
      return category;
  }
}

function getCategoryTabsForTool(tool: any, safeAvailableGuides: any[]): { id: string; label: string }[] {
  const defaultTabs = [
    { id: 'all', label: 'All Operations' },
    { id: 'procurement', label: 'Procurement & TCO' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'performance', label: 'Performance' },
    { id: 'standards', label: 'Standards' },
    { id: 'deployment', label: 'IT Deployment' },
    { id: 'migration', label: 'Migration & API' },
    { id: 'manufacturing', label: 'Specialized Toolsets' },
    { id: 'printing', label: 'Printing & Plotting' }
  ];

  if (!tool) return defaultTabs;

  const activeCategories = new Set(safeAvailableGuides.map(g => g.category));
  const filtered = defaultTabs.filter(t => t.id === 'all' || activeCategories.has(t.id as any));

  return filtered.map(t => {
    if (t.id === 'all') return t;
    return {
      id: t.id,
      label: getJargonLabelForCategory(t.id, tool)
    };
  });
}

function getMappedCategoryInfo(category: string, tool: any, originalTitle: string, originalDesc: string) {
  if (!tool) return { title: originalTitle, desc: originalDesc };

  const title = getJargonLabelForCategory(category, tool);
  let desc = originalDesc;

  const industries = tool.industries || [];
  const isBIM = industries.some((i: string) => /bim|architect|civil|building/i.test(i)) || tool.category_id === 'bim';
  const isMCAD = industries.some((i: string) => /mechanical|mfg|automotive|aerospace/i.test(i)) || tool.category_id === 'mfg';
  const isEDA = industries.some((i: string) => /electronics|eda|pcb|hardware/i.test(i)) || tool.category_id === 'c6' || tool.category_id === 'eda' || tool.slug === 'altium-designer';
  const isCAE = industries.some((i: string) => /simulation|analysis|cae|finite/i.test(i)) || tool.category_id === 'cae' || tool.slug === 'ansys';
  const isFreeCAD = tool.slug === 'freecad';

  if (isFreeCAD) {
    if (category === 'migration') {
      desc = `Write Python macro scripts, run headless background geometry audits, and customize FreeCAD interfaces.`;
    } else if (category === 'manufacturing') {
      desc = `Configure Path CAM G-code post-processors, run CalculiX FEM solvers, and design sketcher constraints in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Design custom SVG title block frames, manage TechDraw projection standard views, and export PDF sheets in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Stitch imported STEP non-manifold shells, heal topological naming issues, and lock user preferences in ${tool.name}.`;
    }
  } else if (isCAE) {
    if (category === 'migration') {
      desc = `Write ANSYS Parametric Design Language (APDL) batch solver input files and configure ACT Python extensions in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure Intel MPI cluster networks, allocate GPU solver cores, and optimize SSD out-of-core scratch spaces in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Map nCode dynamic structural fatigue simulations, extract modal mass factors, and generate solver logs in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure FLEXlm port whitelists, refine boundary layer meshes (y+ limits), and debug nonlinear contact convergences in ${tool.name}.`;
    }
  } else if (tool.slug === 'catia') {
    if (category === 'migration') {
      desc = `Develop C++ CAA components, compile workspace identities, and automate BOM properties data exports in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure Generative Shape Design (GSD) healing tolerances, CAM NC toolpaths post-processors, and Sheetmetal SMD K-Factors in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Manage sheet projection directions, configure drawing sheet background frame blocks, and export drafting sheets in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure DSLS licensing network ports, restore corrupted CATSettings panels, and heal STEP AP242 data transfer geometries in ${tool.name}.`;
    }
  } else if (tool.slug === 'creo') {
    if (category === 'migration') {
      desc = `Compile custom C++ OTK applications, configure J-Link Java metadata queries, and automate model properties in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure assembly skeleton reference paths, setup Creo Sheetmetal bend tables (.tbl), and design wire harness spools in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Configure drawing border templates, customize config.pro output parameters, and manage drafting views in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure ptc.opt options files, manage Windchill workspace client caches, and diagnose lmgrd server errors in ${tool.name}.`;
    }
  } else if (tool.slug === 'autocad') {
    if (category === 'migration') {
      desc = `Compile custom FAS/VLX LISP utilities, manage ObjectARX libraries, and configure secure script paths in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Manage CTB/STB plot pens, configure paper sizes, and fix missing font display during plotting in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure AIA and ISO 13567 default layer name schemes, linetypes, and dimensions scales in ${tool.name}.`;
    }
  } else if (tool.slug === 'revit') {
    if (category === 'migration') {
      desc = `Integrate visual scripting parameters, compile Zero Touch C# components, and automate model checking in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure duct friction loss schedules, parametric rebar cages, and advanced steel joints details in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Fix margin overrides, font substitute overlaps, and vector vs. raster print resolution in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Troubleshoot shared coordinate drifts, link CAD projections, and configure IFC4 export schemas in ${tool.name}.`;
    }
  } else if (tool.slug === 'altium-designer') {
    if (category === 'migration') {
      desc = `Import legacy database libraries, manage database connection strings, and automate tasks with the scripting API in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure multi-board panelizations, mechanical rout lines, and export NC drill files in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Configure output jobs (.OutJob), fix PDF generator crashes, and generate PCB assembly print layouts in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure impedance profiles, match trace lengths, and establish clearance rules for 3D components in ${tool.name}.`;
    }
  } else if (isBIM) {
    if (category === 'migration') {
      desc = `Integrate visual scripting parameters, compile Zero Touch C# components, and automate model checking in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure duct friction loss schedules, parametric rebar cages, and advanced steel joints details in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Fix margin overrides, font substitute overlaps, and vector vs. raster print resolution in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Troubleshoot shared coordinate drifts, link CAD projections, and configure IFC4 export schemas in ${tool.name}.`;
    }
  } else if (isMCAD) {
    if (category === 'migration') {
      desc = `Develop C# plugins, automate assemblies macro commands, and clean cache conflicts in ${tool.name} PDM.`;
    } else if (category === 'manufacturing') {
      desc = `Configure K-Factor blank lengths, bend calculations tables, and export certified detail drawing sheets in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Manage sheet formats, pen weights scales, and print resolution for assembly drawings in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Repair imported STEP/IGES surface tears, set modeling tolerance, and align coordinate origins in ${tool.name}.`;
    }
  } else if (isEDA) {
    if (category === 'migration') {
      desc = `Import legacy database libraries, manage database connection strings, and automate tasks with the scripting API in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure multi-board panelizations, mechanical rout lines, and export NC drill files in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Configure output jobs (.OutJob), fix PDF generator crashes, and generate PCB assembly print layouts in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure impedance profiles, match trace lengths, and establish clearance rules for 3D components in ${tool.name}.`;
    }
  } else if (isCAE) {
    if (category === 'migration') {
      desc = `Write ANSYS Parametric Design Language (APDL) batch solver input files and configure ACT Python extensions in ${tool.name}.`;
    } else if (category === 'manufacturing') {
      desc = `Configure Intel MPI cluster networks, allocate GPU solver cores, and optimize SSD out-of-core scratch spaces in ${tool.name}.`;
    } else if (category === 'printing') {
      desc = `Map nCode dynamic structural fatigue simulations, extract modal mass factors, and generate solver logs in ${tool.name}.`;
    } else if (category === 'standards') {
      desc = `Configure FLEXlm port whitelists, refine boundary layer meshes (y+ limits), and debug nonlinear contact convergences in ${tool.name}.`;
    }
  }

  return { title, desc };
}
