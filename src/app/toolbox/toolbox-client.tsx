'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOOLBOX_DATA, TOOLBOX_CATEGORIES, ToolboxItem } from '@/lib/toolbox-data';

const PAGE_SIZE = 12;

export default function ToolboxClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['all']));
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  // Search-only filter (used for category counts so numbers don't disappear when a tab is active)
  const searchResults = useMemo(() => {
    if (!searchTerm) return TOOLBOX_DATA;
    return TOOLBOX_DATA.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  // Category + search filter (used for the actual grid display)
  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return searchResults;
    return searchResults.filter((item) => item.category === activeCategory);
  }, [searchResults, activeCategory]);

  // Group by category for accordion display
  const groupedTools = useMemo(() => {
    const groups: Record<string, ToolboxItem[]> = {};
    for (const cat of TOOLBOX_CATEGORIES) {
      if (cat.id === 'all') continue;
      groups[cat.id] = searchResults.filter((t) => t.category === cat.id);
    }
    return groups;
  }, [searchResults]);

  const isSearching = searchTerm.length > 0;

  const toggleCat = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const loadMore = (catId: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [catId]: (prev[catId] || PAGE_SIZE) + PAGE_SIZE,
    }));
  };

  const getVisibleCount = (catId: string) => {
    if (isSearching) return 9999; // Show all when searching
    return visibleCounts[catId] || PAGE_SIZE;
  };

  const renderCategoryIcon = (category: ToolboxItem['category']) => {
    switch (category) {
      case 'cheatsheet':
        return '📝';
      case 'calculator':
        return '🧮';
      case '3d-converter':
        return '🧊';
      case 'converter':
        return '📂';
      case 'troubleshoot':
        return '🚨';
      case 'viewer':
        return '🔍';
      case 'generator':
        return '⚙️';
      case 'validator':
        return '✅';
      case 'comparator':
        return '🔄';
      case 'library':
        return '📚';
    }
  };

  const renderToolCard = (item: ToolboxItem) => (
    <Link
      key={item.slug}
      href={`/toolbox/${item.slug}`}
      className="group relative flex flex-col justify-between bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-300"></div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-50 transition duration-300">
            {renderCategoryIcon(item.category)}
          </div>
          {item.status === 'released' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
              ● Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black bg-slate-100 text-slate-400 border border-slate-200">
              Coming Soon
            </span>
          )}
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-base text-slate-500 leading-relaxed font-medium">
          {item.description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-base font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
        <span>
          {item.category === 'cheatsheet' || item.category === 'library'
            ? 'Open Reference'
            : item.category === 'calculator'
            ? 'Open Calculator'
            : item.category === '3d-converter' || item.category === 'converter'
            ? 'Launch Converter'
            : item.category === 'troubleshoot'
            ? 'Start Wizard'
            : item.category === 'viewer'
            ? 'Launch Viewer'
            : 'Open Utility'}
        </span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search toolbox (e.g. DWG, K-factor, shortcut)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4 text-base font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <span>Total: {TOOLBOX_DATA.length}</span>
          <span className="text-slate-200">|</span>
          <span className="text-blue-600">Active: {TOOLBOX_DATA.filter(t => t.status === 'released').length}</span>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 pb-2">
        {TOOLBOX_CATEGORIES.map((cat) => {
          const count = cat.id === 'all' ? filteredTools.length : (groupedTools[cat.id]?.length || 0);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-base font-black border transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Accordion Categories */}
      {activeCategory === 'all' && !isSearching ? (
        <div className="space-y-4">
          {TOOLBOX_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const tools = groupedTools[cat.id] || [];
            if (tools.length === 0) return null;
            const isExpanded = expandedCats.has(cat.id);
            const visible = tools.slice(0, getVisibleCount(cat.id));
            const hasMore = tools.length > visible.length;

            return (
              <div key={cat.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{renderCategoryIcon(cat.id as ToolboxItem['category'])}</span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-slate-900">{cat.name}</h3>
                      <p className="text-sm text-slate-400 font-bold">{tools.length} tools available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-400">{isExpanded ? 'Collapse' : 'Expand'}</span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                      {visible.map(renderToolCard)}
                    </div>
                    {hasMore && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => loadMore(cat.id)}
                          className="px-8 py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                        >
                          Load More ({tools.length - visible.length} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat grid when a specific category is selected or searching */
        <div>
          {filteredTools.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.slice(0, isSearching ? 9999 : getVisibleCount(activeCategory)).map(renderToolCard)}
              </div>
              {!isSearching && filteredTools.length > getVisibleCount(activeCategory) && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => loadMore(activeCategory)}
                    className="px-8 py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Load More ({filteredTools.length - getVisibleCount(activeCategory)} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">
              No tools found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
