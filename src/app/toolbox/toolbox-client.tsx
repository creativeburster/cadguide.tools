'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOOLBOX_DATA, TOOLBOX_CATEGORIES, ToolboxItem } from '@/lib/toolbox-data';

export default function ToolboxClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return TOOLBOX_DATA.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const renderCategoryIcon = (category: ToolboxItem['category']) => {
    switch (category) {
      case 'cheatsheet':
        return '📝';
      case 'calculator':
        return '🧮';
      case 'converter':
        return '📂';
      case 'troubleshoot':
        return '🚨';
    }
  };

  return (
    <div className="space-y-12">
      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search toolbox (e.g. DWG, K-factor, shortcut)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <span>Total Utilities: {TOOLBOX_DATA.length}</span>
          <span className="text-slate-200">|</span>
          <span className="text-blue-600">Active: {TOOLBOX_DATA.filter(t => t.status === 'released').length}</span>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2 pb-2">
        {TOOLBOX_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black border transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Interactive Tool Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((item) => (
            <Link
              key={item.slug}
              href={item.category === 'cheatsheet' ? `/guides/${item.slug}` : `/toolbox/${item.slug}`}
              className="group relative flex flex-col justify-between bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-300"></div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-50 transition duration-300">
                    {renderCategoryIcon(item.category)}
                  </div>
                  {item.status === 'released' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse">
                      ● Active / Try Free
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-400 border border-slate-200">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>View Details</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">
            No tools found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
