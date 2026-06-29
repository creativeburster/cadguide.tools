'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, BookOpen, Search, ChevronDown, Check } from 'lucide-react';
import { siteBreadcrumbLd } from '@/lib/seo';
import type { MarkdownGuide } from '@/lib/guides-markdown';

interface AvailableTool {
  slug: string;
  name: string;
  logo_url: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  troubleshooting: 'Troubleshooting',
  performance: 'Performance',
  manufacturing: 'Manufacturing',
  deployment: 'Deployment',
  standards: 'Standards',
  procurement: 'Procurement',
  printing: 'Printing',
  migration: 'Migration',
};

const CATEGORY_COLORS: Record<string, string> = {
  troubleshooting: 'bg-red-50 text-red-700 border-red-200',
  performance: 'bg-amber-50 text-amber-700 border-amber-200',
  manufacturing: 'bg-blue-50 text-blue-700 border-blue-200',
  deployment: 'bg-purple-50 text-purple-700 border-purple-200',
  standards: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  procurement: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  printing: 'bg-teal-50 text-teal-700 border-teal-200',
  migration: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function GuidesListClient({
  guides,
  availableTools,
}: {
  guides: MarkdownGuide[];
  availableTools: AvailableTool[];
}) {
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [bySoftwareOpen, setBySoftwareOpen] = useState(false);
  const [openToolInAccordion, setOpenToolInAccordion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 12;

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [selectedTool, searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Professional Guides', path: '/guides' },
  ]);

  const filtered = guides.filter(g => {
    if (selectedTool !== 'all' && g.softwareSlug !== selectedTool) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q) || g.keyword.toLowerCase().includes(q);
    }
    return true;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const guidesByTool: Record<string, MarkdownGuide[]> = {};
  for (const guide of visible) {
    if (!guidesByTool[guide.softwareSlug]) guidesByTool[guide.softwareSlug] = [];
    guidesByTool[guide.softwareSlug].push(guide);
  }

  const toolMap = new Map(availableTools.map(t => [t.slug, t]));
  const selectedToolName = selectedTool === 'all' ? 'All Software' : (toolMap.get(selectedTool)?.name || selectedTool);
  const filteredTools = availableTools.filter(t =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase())
  );

  // A-Z index: all guides grouped by first letter (always in DOM for crawlers)
  const allGuidesByLetter: Record<string, MarkdownGuide[]> = {};
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l => { allGuidesByLetter[l] = []; });
  for (const g of guides) {
    const letter = g.title.trim().charAt(0).toUpperCase();
    if (allGuidesByLetter[letter]) {
      allGuidesByLetter[letter].push(g);
    } else {
      if (!allGuidesByLetter['#']) allGuidesByLetter['#'] = [];
      allGuidesByLetter['#'].push(g);
    }
  }
  const lettersWithGuides = Object.entries(allGuidesByLetter).filter(([, g]) => g.length > 0);

  // All guides grouped by tool for accordion
  const allGuidesByTool: Record<string, MarkdownGuide[]> = {};
  for (const g of guides) {
    if (!allGuidesByTool[g.softwareSlug]) allGuidesByTool[g.softwareSlug] = [];
    allGuidesByTool[g.softwareSlug].push(g);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-300 font-normal">/</span>
          <span className="text-slate-600">Guides</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 font-bold uppercase tracking-widest text-[9px] rounded-full mb-4">
            Technical Knowledge Base
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            CAD Troubleshooting & Performance Guides
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {guides.length} expert-written guides covering {availableTools.length} CAD, BIM, and CAE software tools. Fix crashes, optimize performance, resolve file corruption, troubleshoot licensing errors, and master manufacturing workflows with step-by-step solutions.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-center">
            <div>
              <span className="block text-2xl font-black text-slate-900">{guides.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Guides</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="block text-2xl font-black text-slate-900">{availableTools.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Software</span>
            </div>
          </div>
        </div>

        {/* Tool dropdown + Guide search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Searchable tool dropdown */}
          <div className="relative flex-1 sm:flex-none sm:w-80 sm:ml-[500px]" ref={dropdownRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Filter by Software</label>
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setToolSearch(''); }}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-200 text-sm font-bold rounded-xl hover:border-blue-300 transition-all shadow-sm"
            >
              <span className="text-slate-700">{selectedToolName}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <div className="relative p-2 border-b border-slate-100">
                  <Search className="absolute left-4 top-3 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={toolSearch}
                    onChange={e => setToolSearch(e.target.value)}
                    placeholder="Search software..."
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-slate-700"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedTool('all'); setDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition-colors ${
                      selectedTool === 'all' ? 'text-blue-600' : 'text-slate-700'
                    }`}
                  >
                    All Software
                    {selectedTool === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {filteredTools.map(t => (
                    <button
                      key={t.slug}
                      onClick={() => { setSelectedTool(t.slug); setDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition-colors ${
                        selectedTool === t.slug ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      {t.name}
                      {selectedTool === t.slug && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                  {filteredTools.length === 0 && (
                    <div className="px-4 py-3 text-xs text-slate-400 font-medium">No software found.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Guide search */}
          <div className="relative flex-1 sm:flex-none sm:w-80 sm:ml-auto">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Search Guides</label>
            <Search className="absolute left-3 top-[34px] w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, keyword, or topic..."
              className="w-full pl-9 pr-4 py-3 bg-white border-2 border-slate-200 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-slate-700 shadow-sm"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-xs font-semibold text-slate-400">
          Showing {visible.length} of {filtered.length} guide{filtered.length !== 1 ? 's' : ''}
          {selectedTool !== 'all' && ` for ${toolMap.get(selectedTool)?.name || selectedTool}`}
        </div>

        {/* Tool sections */}
        <div className="space-y-12">
          {Object.entries(guidesByTool).map(([toolSlug, toolGuides]) => {
            const tool = toolMap.get(toolSlug);
            const toolName = tool?.name || toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            return (
              <section key={toolSlug} className="space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div className="flex-grow">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{toolName}</h2>
                    <span className="text-xs text-slate-400 font-semibold">{toolGuides.length} guide{toolGuides.length !== 1 ? 's' : ''}</span>
                  </div>
                  <Link
                    href={`/tools/${toolSlug}`}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider"
                  >
                    View Tool →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {toolGuides.map(guide => {
                    const categoryLabel = CATEGORY_LABELS[guide.category] || guide.category;
                    const categoryColor = CATEGORY_COLORS[guide.category] || 'bg-slate-50 text-slate-700 border-slate-200';

                    return (
                      <Link key={guide.slug} href={`/guides/articles/${guide.slug}`} className="block group">
                        <Card className="rounded-2xl border border-slate-100 shadow-sm p-5 bg-white h-full flex flex-col justify-between hover:shadow-md hover:border-blue-100 transition-all duration-300">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${categoryColor}`}>
                                {categoryLabel}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Clock className="w-3 h-3" />
                                {guide.readTime}
                              </span>
                            </div>
                            <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                              {guide.title}
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-3">
                              {guide.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-semibold">{guide.date}</span>
                            <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 group-hover:gap-2 transition-all uppercase tracking-wider">
                              Read Guide
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="px-6 py-3 bg-white border border-slate-200 text-xs font-black text-slate-700 rounded-xl hover:border-blue-200 hover:text-blue-600 transition-all uppercase tracking-wider shadow-sm"
            >
              Load More Guides ({filtered.length - visible.length} remaining)
            </button>
          </div>
        )}

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold">
              {searchQuery ? `No guides found for "${searchQuery}".` : 'No guides available for this software.'}
            </p>
          </div>
        )}

        {/* --- SEO Sitemap Directory: Accordion by tool + A-Z index --- */}
        {/* Always in DOM for crawlers; collapsible for users */}
        <div className="mt-16 pt-8 border-t border-slate-100 space-y-6">
          {/* Accordion: All guides by software */}
          <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setBySoftwareOpen(!bySoftwareOpen)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/70 transition-colors gap-4"
            >
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">
                  📁 All Guides by Software
                </h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-1">
                  Expand to browse all {guides.length} guides grouped by software
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-xl">
                  {guides.length} Guides
                </span>
                <span className={`transform transition-transform text-slate-500 text-sm font-black shrink-0 ${bySoftwareOpen ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100/40 ${bySoftwareOpen ? 'max-h-[3000px] p-5 opacity-100' : 'max-h-0 p-0 opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                {availableTools.map(tool => {
                  const toolGuides = allGuidesByTool[tool.slug] || [];
                  if (toolGuides.length === 0) return null;
                  const isToolOpen = openToolInAccordion === tool.slug;
                  return (
                    <div key={tool.slug} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenToolInAccordion(isToolOpen ? null : tool.slug)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{tool.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{toolGuides.length}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isToolOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isToolOpen && (
                        <div className="border-t border-slate-100">
                          <ul className="divide-y divide-slate-50">
                            {toolGuides.map(g => (
                              <li key={g.slug}>
                                <Link
                                  href={`/guides/articles/${g.slug}`}
                                  className="block px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                                >
                                  {g.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* A-Z Flat Sitemap Directory */}
          <Card className="border border-slate-100 shadow-sm rounded-2xl bg-slate-50/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsSitemapOpen(!isSitemapOpen)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/70 transition-colors gap-4"
            >
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">
                  📋 Complete Guides Sitemap Directory (A-Z)
                </h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-1.5">
                  Flat crawling directory containing all guide pathways for search engines.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-xl">
                  {guides.length} Guides
                </span>
                <span className={`transform transition-transform text-slate-500 text-sm font-black shrink-0 ${isSitemapOpen ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100/40 bg-white ${isSitemapOpen ? 'max-h-[5000px] p-6 opacity-100' : 'max-h-0 p-0 opacity-0 pointer-events-none'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {(() => {
                  const sorted = [...guides].sort((a, b) => a.title.localeCompare(b.title));
                  const grouped: Record<string, typeof guides> = {};
                  for (const g of sorted) {
                    const letter = g.title.charAt(0).toUpperCase();
                    if (!grouped[letter]) grouped[letter] = [];
                    grouped[letter].push(g);
                  }
                  return Object.entries(grouped).map(([letter, letterGuides]) => (
                    <div key={letter} className="space-y-1">
                      <div className="flex items-center gap-2 pb-1.5 mb-1 border-b border-slate-100">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 border border-blue-100/40">
                          {letter}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{letterGuides.length} guides</span>
                      </div>
                      {letterGuides.map(g => (
                        <Link
                          key={g.slug}
                          href={`/guides/articles/${g.slug}`}
                          className="block px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          {g.title}
                        </Link>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
