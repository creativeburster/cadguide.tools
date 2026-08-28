'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Search, 
  Printer, 
  Cog, 
  Globe, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  FileCode2, 
  SlidersHorizontal, 
  ChevronRight 
} from 'lucide-react';
import { 
  CONVERTER_CATEGORIES, 
  ConversionPair 
} from '@/lib/converter-data';

interface ConvertHubClientProps {
  initialPairs: ConversionPair[];
}

export function ConvertHubClient({ initialPairs }: ConvertHubClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFrom, setSelectedFrom] = useState<string>('all');
  const [selectedTo, setSelectedTo] = useState<string>('all');

  const formatOptions = useMemo(() => {
    const froms = new Set<string>();
    const tos = new Set<string>();
    initialPairs.forEach(p => {
      froms.add(p.fromFormat.ext.split(' ')[0]);
      tos.add(p.toFormat.ext.split(' ')[0]);
    });
    return {
      fromList: Array.from(froms).sort(),
      toList: Array.from(tos).sort(),
    };
  }, [initialPairs]);

  const filteredPairs = useMemo(() => {
    return initialPairs.filter(pair => {
      if (selectedCategory !== 'all' && pair.category !== selectedCategory) {
        return false;
      }
      if (selectedFrom !== 'all' && !pair.fromFormat.ext.toUpperCase().includes(selectedFrom.toUpperCase())) {
        return false;
      }
      if (selectedTo !== 'all' && !pair.toFormat.ext.toUpperCase().includes(selectedTo.toUpperCase())) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = pair.title.toLowerCase().includes(query);
        const matchSlug = pair.slug.toLowerCase().includes(query);
        const matchDesc = pair.painPointDesc.toLowerCase().includes(query);
        const matchFrom = pair.fromFormat.name.toLowerCase().includes(query) || pair.fromFormat.ext.toLowerCase().includes(query);
        const matchTo = pair.toFormat.name.toLowerCase().includes(query) || pair.toFormat.ext.toLowerCase().includes(query);
        return matchTitle || matchSlug || matchDesc || matchFrom || matchTo;
      }
      return true;
    });
  }, [initialPairs, selectedCategory, selectedFrom, selectedTo, searchQuery]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case '3d-printing':
        return <Printer className="w-4 h-4 text-indigo-500" />;
      case 'mcad-interop':
        return <Cog className="w-4 h-4 text-blue-500" />;
      case 'web3d':
        return <Globe className="w-4 h-4 text-emerald-500" />;
      case 'bim-doc':
        return <Layers className="w-4 h-4 text-amber-500" />;
      default:
        return <FileCode2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Category Pills & Quick Filter Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversions (e.g. STEP to STL, SLDPRT, GLB, Revit, IFC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-16 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Format Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>From:</span>
              <select
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="all">All Formats</option>
                {formatOptions.fromList.map((ext) => (
                  <option key={ext} value={ext}>{ext}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600">
              <span>To:</span>
              <select
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="all">All Formats</option>
                {formatOptions.toList.map((ext) => (
                  <option key={ext} value={ext}>{ext}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-slate-100 text-slate-650 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>All Conversions ({initialPairs.length})</span>
          </button>

          {CONVERTER_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = initialPairs.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.shortName} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Conversion Pairs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span>CAD & 3D Conversion Pipelines</span>
            <span className="text-xs font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              {filteredPairs.length} Available
            </span>
          </h2>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">
            Zero-Server Load • Curated Sponsor Benchmarks
          </span>
        </div>

        {filteredPairs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
            <FileCode2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No matching conversion pairs found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or reset format filters to see all available CAD translation workflows.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFrom('all');
                setSelectedTo('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-block"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPairs.map((pair) => {
              return (
                <Link
                  key={pair.slug}
                  href={`/convert/${pair.slug}`}
                  className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header with Format Pills */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl tracking-wider">
                          {pair.fromFormat.ext.split(' ')[0]}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <span className="px-3 py-1.5 bg-blue-600 text-white font-black text-xs rounded-xl tracking-wider">
                          {pair.toFormat.ext.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {pair.categoryLabel.split(' ')[0]}
                      </span>
                    </div>

                    {/* Title and Nature */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                        {pair.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-650 line-clamp-1">
                        {pair.conversionNature}
                      </p>
                    </div>

                    {/* Pain Point Summary */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {pair.painPointDesc}
                    </p>

                    {/* Key Parameter Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pair.keyParameters.slice(0, 2).map((kp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100 rounded-lg px-2 py-0.5"
                        >
                          {kp.label}: <strong className="text-slate-800">{kp.value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA & Sponsor Count */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span className="text-slate-400 font-semibold text-[11px]">
                      {pair.recommendedTools.length} Curated Tools
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-extrabold">
                      Convert & Optimize <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Educational Matrix Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">Zero-Data-Leak Local Conversion Architecture</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Proprietary industrial CAD models (SolidWorks, CATIA, NX) contain confidential patented geometry, internal tooling cooling lines, and proprietary tolerances. We recommend verified 100% offline open-source engines (such as FreeCAD and Blender) to process defense and automotive models locally with zero cloud upload risk.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-bold text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Evaluation • No Cloud Telemetry</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">B-Rep vs Polygonal Mesh vs openBIM</h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Converting between solid B-Rep (STEP, Parasolid), polygonal meshes (STL, 3MF, OBJ), real-time Web3D (GLB), and openBIM (IFC) requires different mathematical tolerances. Our benchmark guides give you precise chordal deviation numbers and schema parameters to guarantee 100% watertight output.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-bold text-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Calibrated for Bambu Lab, Mastercam, Three.js & Revit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
