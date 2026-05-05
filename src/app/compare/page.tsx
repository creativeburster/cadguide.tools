'use client';

import { useState, useMemo, Suspense, useRef } from 'react';
import { tools } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import Link from 'next/link';
import { X, Info, Scale, Check, Search as SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(initialIds);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSearch = useMemo(() => {
    if (!searchTerm) return [];
    return tools.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedToolIds.includes(t.id)
    ).slice(0, 5);
  }, [searchTerm, selectedToolIds]);

  const selectedTools = useMemo(() => {
    return selectedToolIds.map(id => tools.find(t => t.id === id)!).filter(Boolean);
  }, [selectedToolIds]);

  const addTool = (id: string) => {
    if (selectedToolIds.length < 4) {
      setSelectedToolIds([...selectedToolIds, id]);
      setSearchTerm('');
    }
  };

  const removeTool = (id: string) => {
    setSelectedToolIds(selectedToolIds.filter(tId => tId !== id));
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const comparisonRows = [
    { label: 'Expert Score', key: 'score', type: 'rating' },
    { label: 'Origin Country', key: 'country', type: 'text' },
    { label: 'Pricing Model', key: 'pricing_type', type: 'badge' },
    { label: 'Starting Price', key: 'starting_price', type: 'price' },
    { label: 'Geometry Engine', key: 'tech_specs.engine', type: 'text' },
    { label: 'OS Compatibility', key: 'platforms', type: 'list' },
    { label: 'Core Industries', key: 'industries', type: 'list' },
    { label: 'Target User', key: 'user_scales', type: 'list' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <main className="max-w-[1360px] mx-auto px-4 py-16 min-h-screen">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">Technical Comparison</h1>
        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
          Side-by-side analysis of up to <span className="text-blue-600 font-black">4 tools</span>. 
          Expert ratings, pricing tiers, and technical specifications.
        </p>
      </div>

      {/* Search & Selector */}
      <div className="max-w-3xl mx-auto mb-20 relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <SearchIcon className="w-6 h-6" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={selectedToolIds.length >= 4 ? "Maximum tools reached" : "Search to add software (e.g. CATIA, SolidWorks)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={selectedToolIds.length >= 4}
            className="w-full pl-16 pr-6 py-6 rounded-[28px] bg-white border-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-xl shadow-2xl shadow-slate-200/50 disabled:bg-slate-50"
          />
          {filteredSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-50 overflow-hidden p-2">
              {filteredSearch.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => addTool(tool.id)}
                  className="w-full flex items-center gap-5 px-6 py-4 hover:bg-blue-50 transition-all rounded-2xl text-left"
                >
                  <ToolLogo src={tool.logo_url} name={tool.name} className="w-12 h-12 rounded-xl" />
                  <div>
                    <div className="font-black text-slate-900">{tool.name}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tool.industries[0]}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      {selectedTools.length > 0 ? (
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="w-48 lg:w-64 p-10 bg-slate-50/50 text-left align-top">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Technical Matrix</div>
                    <div className="text-xs text-slate-400 font-bold leading-relaxed">Detailed Head-to-Head Analysis</div>
                  </th>
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tool = selectedTools[i];
                    return (
                      <th key={tool?.id || `empty-${i}`} className={`p-10 border-l border-slate-100 align-top ${!tool ? 'bg-slate-50/20' : ''}`}>
                        {tool ? (
                          <div className="relative group text-center">
                            <button 
                              onClick={() => removeTool(tool.id)}
                              className="absolute -top-4 -right-4 w-10 h-10 bg-white shadow-lg border border-slate-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <ToolLogo src={tool.logo_url} name={tool.name} className="w-20 h-20 mx-auto mb-8 rounded-3xl shadow-xl border border-slate-50" />
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{tool.name}</h3>
                            <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-1.5 rounded-xl border border-yellow-100">
                              <span className="text-yellow-600 font-black text-lg">★ {tool.score}</span>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={focusSearch}
                            className="w-full text-center py-8 group/slot hover:bg-white transition-colors rounded-2xl"
                          >
                            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl border-4 border-dashed border-slate-100 group-hover/slot:border-blue-200 flex items-center justify-center text-slate-200 group-hover/slot:text-blue-200 transition-all">
                              <SearchIcon className="w-8 h-8" />
                            </div>
                            <div className="text-slate-300 group-hover/slot:text-blue-400 font-black uppercase text-[10px] tracking-widest transition-colors">Add Tool</div>
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdfe]'}>
                    <td className="p-10 border-r border-slate-100">
                      <div className="font-black text-slate-900 text-sm tracking-tight">{row.label}</div>
                    </td>
                    {Array.from({ length: 4 }).map((_, i) => {
                      const tool = selectedTools[i];
                      const val = tool ? getNestedValue(tool, row.key) : null;
                      return (
                        <td key={`${i}-${row.key}`} className="p-10 text-center border-r border-slate-100 last:border-r-0">
                          {tool ? (
                            <div className="flex flex-col items-center">
                              {row.type === 'rating' && <span className="text-2xl font-black text-slate-900">★ {val}</span>}
                              {row.type === 'price' && <span className="text-xl font-black text-slate-900">${val || 'TBA'}</span>}
                              {row.type === 'badge' && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold">{val}</Badge>}
                              {row.type === 'list' && (
                                <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
                                  {val?.slice(0, 4).map((item: string) => (
                                    <span key={item} className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">{item}</span>
                                  ))}
                                </div>
                              )}
                              {row.type === 'text' && <span className="text-slate-600 font-black text-sm">{val || '-'}</span>}
                            </div>
                          ) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="p-10 border-r border-slate-100 bg-slate-50/30">
                    <div className="font-black text-slate-900 text-sm tracking-tight">Verdict</div>
                  </td>
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tool = selectedTools[i];
                    return (
                      <td key={`v-${i}`} className="p-10 border-r border-slate-100 last:border-r-0 align-top">
                        {tool ? (
                          <div className="flex flex-col h-full">
                            <p className="text-xs text-slate-500 font-bold italic leading-relaxed mb-8 line-clamp-4">
                              "{tool.expert_verdict}"
                            </p>
                            <Button asChild className="mt-auto w-full rounded-2xl bg-slate-900 hover:bg-blue-600 font-black h-12 text-sm transition-all shadow-lg hover:shadow-blue-200">
                              <Link href={`/tools/${tool.slug}`}>Full Analysis</Link>
                            </Button>
                          </div>
                        ) : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[48px] border-4 border-dashed border-slate-100 max-w-4xl mx-auto shadow-sm">
          <button 
            onClick={focusSearch}
            className="w-full"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-slate-200 hover:text-blue-600 transition-colors">
              <SearchIcon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-300 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">Add software to begin Matrix</h2>
          </button>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
