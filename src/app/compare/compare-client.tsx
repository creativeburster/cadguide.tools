'use client';

import { useState, useMemo, Suspense, useRef } from 'react';
import { tools } from '@/lib/data';
import { editorPickPairs, comparisonPairs } from '@/lib/seo-content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import Link from 'next/link';
import { X, Scale, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(initialIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Editor-picked top comparisons. Static data — compute once.
  const editorPicks = useMemo(() => editorPickPairs(), []);

  // Load all 67 comparison pairs
  const allPairs = useMemo(() => comparisonPairs(), []);

  const disciplines = useMemo(() => [
    {
      id: '2d-drafting',
      name: '2D Drafting & CAD',
      description: 'General-purpose 2D drafting, technical detailing, and legacy DWG drawing exchange.',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-100',
      bgGradient: 'from-sky-50/40 via-blue-50/10 to-transparent',
      hoverBorder: 'hover:border-sky-300/80',
      shadowColor: 'hover:shadow-sky-100/40',
      iconColor: 'text-sky-500',
      filterLabel: '2D CAD',
      test: (a: any, b: any) => {
        const has2D = a.category_id === 'c1' || b.category_id === 'c1';
        const hasBIM = a.category_id === 'c3' || b.category_id === 'c3';
        return has2D && !hasBIM;
      }
    },
    {
      id: '3d-mcad',
      name: '3D MCAD & Product Modeling',
      description: 'Parametric solid engineering, complex mechanical assemblies, and product design pipelines.',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-100',
      bgGradient: 'from-amber-50/40 via-orange-50/10 to-transparent',
      hoverBorder: 'hover:border-amber-300/80',
      shadowColor: 'hover:shadow-amber-100/40',
      iconColor: 'text-amber-500',
      filterLabel: '3D MCAD',
      test: (a: any, b: any) => {
        const has3D = a.category_id === 'c2' || b.category_id === 'c2';
        const hasBIM = a.category_id === 'c3' || b.category_id === 'c3';
        return has3D && !hasBIM;
      }
    },
    {
      id: 'bim-arch',
      name: 'BIM & Architectural CAD',
      description: 'Building information modeling, architectural visualization, and dynamic spatial coordination.',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      bgGradient: 'from-emerald-50/40 via-teal-50/10 to-transparent',
      hoverBorder: 'hover:border-emerald-300/80',
      shadowColor: 'hover:shadow-emerald-100/40',
      iconColor: 'text-emerald-500',
      filterLabel: 'BIM & Architecture',
      test: (a: any, b: any) => {
        const hasBIM = a.category_id === 'c3' || b.category_id === 'c3';
        const renderingSlugs = ['lumion', 'twinmotion', 'enscape', 'v-ray', 'corona-renderer'];
        const hasRender = renderingSlugs.includes(a.slug) || renderingSlugs.includes(b.slug);
        return hasBIM || hasRender;
      }
    },
    {
      id: 'cae-eda',
      name: 'CAE, CAM & EDA Electronics',
      description: 'Finite element analysis (FEA), fluid simulation (CFD), multi-axis CNC machining, and PCB layout.',
      badgeBg: 'bg-violet-50 text-violet-800 border-violet-100',
      bgGradient: 'from-violet-50/40 via-purple-50/10 to-transparent',
      hoverBorder: 'hover:border-violet-300/80',
      shadowColor: 'hover:shadow-violet-100/40',
      iconColor: 'text-violet-500',
      filterLabel: 'CAE / CAM / EDA',
      test: (a: any, b: any) => {
        return a.category_id === 'c5' || b.category_id === 'c5' || a.category_id === 'c6' || b.category_id === 'c6';
      }
    },
    {
      id: 'specialized-rendering',
      name: 'Specialized Tools & Slicers',
      description: 'Additive manufacturing slicers, robust layout viewers, and specialized vertical CAD engines.',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-100',
      bgGradient: 'from-rose-50/40 via-pink-50/10 to-transparent',
      hoverBorder: 'hover:border-rose-300/80',
      shadowColor: 'hover:shadow-rose-100/40',
      iconColor: 'text-rose-500',
      filterLabel: 'Slicers & Specialized',
      test: (a: any, b: any) => true
    }
  ], []);

  const categorizedPairsMap = useMemo(() => {
    const groups: Record<string, typeof allPairs> = {
      '2d-drafting': [],
      '3d-mcad': [],
      'bim-arch': [],
      'cae-eda': [],
      'specialized-rendering': []
    };

    allPairs.forEach(pair => {
      for (const disc of disciplines) {
        if (disc.id === 'specialized-rendering') {
          groups[disc.id].push(pair);
          break;
        }
        if (disc.test(pair.a, pair.b)) {
          groups[disc.id].push(pair);
          break;
        }
      }
    });

    return groups;
  }, [allPairs, disciplines]);

  const filteredSearch = useMemo(() => {
    if (!searchTerm) return [];
    const normalize = (str: string) => str.toLowerCase().replace(/[-\s]+/g, '');
    const normalizedTerm = normalize(searchTerm);
    return tools.filter(t => 
      normalize(t.name).includes(normalizedTerm) && 
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
                  <ToolLogo slug={tool.slug} src={tool.logo_url} websiteUrl={tool.official_url} name={tool.name} className="w-12 h-12 rounded-xl" />
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
                            <ToolLogo slug={tool.slug} src={tool.logo_url} websiteUrl={tool.official_url} name={tool.name} className="w-20 h-20 mx-auto mb-8 rounded-3xl shadow-xl border border-slate-50" />
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
        <button
          onClick={focusSearch}
          className="block w-full text-center py-12 md:py-20 bg-white rounded-[28px] md:rounded-[48px] border-4 border-dashed border-slate-100 max-w-4xl mx-auto shadow-sm hover:border-blue-200 transition-colors"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-slate-300 transition-colors">
            <SearchIcon className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h2 className="text-lg md:text-3xl font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
            Search above to build your matrix
          </h2>
          <p className="mt-3 md:mt-4 text-sm font-medium text-slate-400">
            …or pick a popular head-to-head below.
          </p>
        </button>
      )}

      {/* Editor Picks — featured pre-built comparison pages.
          Always rendered so users can keep discovering after they've
          finished a custom matrix. Each card deep-links to a
          /compare/<a-vs-b> long-tail page that already has its own
          metadata + JSON-LD. */}
      <section className="mt-20 md:mt-28">
        <div className="text-center mb-10 md:mb-14">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-100 font-black uppercase tracking-widest text-[10px] mb-4 md:mb-6"
          >
            Editor Picks
          </Badge>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">
            Popular Head-to-Heads
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pre-built deep-dive pages for the comparisons buyers search for most. Each has an 11-row feature matrix and a decision guide.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {editorPicks.map(({ pairSlug, a, b, blurb }) => (
            <Link
              key={pairSlug}
              href={`/compare/${pairSlug}`}
              className="group bg-white rounded-[24px] md:rounded-[28px] border border-slate-100 p-5 md:p-7 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40 transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <ToolLogo
                  slug={a.slug}
                  src={a.logo_url}
                  websiteUrl={a.official_url}
                  name={a.name}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl shadow-sm border border-slate-50"
                />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">vs</span>
                <ToolLogo
                  slug={b.slug}
                  src={b.logo_url}
                  websiteUrl={b.official_url}
                  name={b.name}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl shadow-sm border border-slate-50"
                />
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                {a.name} <span className="text-slate-300">vs</span> {b.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 line-clamp-2">
                {blurb}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-700">
                View comparison
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10 md:mt-14">
          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest h-12 px-6 hover:bg-white"
          >
            <Link href="/best">Browse Best-Of Lists by Category</Link>
          </Button>
        </div>
      </section>

      {/* Browse All Head-to-Head Comparison Guides */}
      <section className="mt-24 md:mt-36 border-t border-slate-100 pt-20">
        <div className="text-center mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-100 font-black uppercase tracking-widest text-[10px] mb-4"
          >
            Directory Catalog
          </Badge>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Browse Comparison Guides by Engineering Discipline
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Direct indexing of our curated competitor pairings. Formulated to target high-value buyer decision queries with no doorway pages.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                : 'bg-white border-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-800'
            }`}
          >
            All Categories ({allPairs.length})
          </button>
          {disciplines.map(disc => {
            const count = categorizedPairsMap[disc.id]?.length || 0;
            if (count === 0) return null;
            return (
              <button
                key={disc.id}
                onClick={() => setActiveCategory(disc.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                  activeCategory === disc.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-800'
                }`}
              >
                {disc.filterLabel} ({count})
              </button>
            );
          })}
        </div>

        {/* Discipline Grid */}
        <div className="space-y-12">
          {disciplines.map(disc => {
            const list = categorizedPairsMap[disc.id] || [];
            if (list.length === 0) return null;
            
            // If filtering and this discipline isn't active, skip it
            if (activeCategory !== 'all' && activeCategory !== disc.id) return null;

            return (
              <div 
                key={disc.id} 
                className={`bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm transition-all group hover:shadow-xl duration-500 bg-gradient-to-br ${disc.bgGradient} ${disc.hoverBorder} ${disc.shadowColor}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100/60">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${disc.iconColor} bg-current`} />
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        {disc.name}
                      </h3>
                      <Badge className={`font-bold rounded-lg text-[10px] tracking-wider uppercase ${disc.badgeBg}`}>
                        {list.length} Guides
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
                      {disc.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map(pair => (
                    <Link
                      key={pair.pairSlug}
                      href={`/compare/${pair.pairSlug}`}
                      className="group/pill relative flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-slate-100/80 rounded-2xl hover:border-blue-200 shadow-sm hover:shadow-[0_12px_24px_-8px_rgba(59,130,246,0.12)] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Dynamic Double Logo overlap */}
                        <div className="flex items-center -space-x-3.5 flex-shrink-0">
                          <div className="relative z-10 transition-transform duration-300 group-hover/pill:translate-x-1">
                            <ToolLogo
                              slug={pair.a.slug}
                              src={pair.a.logo_url}
                              websiteUrl={pair.a.official_url}
                              name={pair.a.name}
                              className="w-9 h-9 rounded-lg shadow-sm border border-slate-100 bg-white"
                            />
                          </div>
                          <div className="relative z-0 transition-transform duration-300 group-hover/pill:-translate-x-1">
                            <ToolLogo
                              slug={pair.b.slug}
                              src={pair.b.logo_url}
                              websiteUrl={pair.b.official_url}
                              name={pair.b.name}
                              className="w-9 h-9 rounded-lg shadow-sm border border-slate-100 bg-white"
                            />
                          </div>
                        </div>

                        {/* Title text */}
                        <div className="font-bold text-slate-800 text-sm group-hover/pill:text-blue-600 transition-colors truncate">
                          {pair.a.name}
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-slate-50 text-slate-400 group-hover/pill:bg-blue-50 group-hover/pill:text-blue-500 uppercase tracking-widest transition-colors mx-1.5">
                            vs
                          </span>
                          {pair.b.name}
                        </div>
                      </div>

                      {/* Hover Arrow indicator */}
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover/pill:text-blue-500 group-hover/pill:translate-x-0.5 transition-all opacity-0 group-hover/pill:opacity-100 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
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
