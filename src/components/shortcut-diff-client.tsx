'use client';

import { useState, useMemo } from 'react';
import { Search, Printer, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export interface DiffItem {
  shortcut: string;
  primaryCmd: string;
  secondaryCmd: string;
  isSame: boolean;
  diffNote: string;
  useCase: string;
}

interface ShortcutDiffClientProps {
  primaryApp: string;
  secondaryApp: string;
  diffData: DiffItem[];
}

export default function ShortcutDiffClient({
  primaryApp,
  secondaryApp,
  diffData
}: ShortcutDiffClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'diff' | 'same'>('all');
  const [copiedIndex, setCopiedIndex] = useState<{ row: number; app: 'primary' | 'secondary' } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Search and filter logic
  const filteredData = useMemo(() => {
    return diffData.filter((item) => {
      const matchFilter =
        filterType === 'all' ||
        (filterType === 'diff' && !item.isSame) ||
        (filterType === 'same' && item.isSame);

      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        item.shortcut.toLowerCase().includes(query) ||
        item.primaryCmd.toLowerCase().includes(query) ||
        item.secondaryCmd.toLowerCase().includes(query) ||
        item.diffNote.toLowerCase().includes(query) ||
        item.useCase.toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [diffData, searchQuery, filterType]);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, rowIndex: number, app: 'primary' | 'secondary') => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ row: rowIndex, app });
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Comparison & Search Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Control Panel: Search, Filter & Print */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search shortcuts or commands (e.g. L, Line, Copy)...`}
              className="w-full h-12 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/50">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer h-11"
            >
              <Printer className="w-4 h-4" />
              Print Comparison (A4)
            </button>
          </div>
        </div>

        {/* Difference Status Toggle Switch */}
        <div className="flex gap-2 mb-6 print:hidden">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 border-slate-950 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Commands ({diffData.length})
          </button>
          <button
            onClick={() => setFilterType('diff')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'diff'
                ? 'bg-rose-600 border-rose-700 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Differences Only ({diffData.filter((i) => !i.isSame).length})
          </button>
          <button
            onClick={() => setFilterType('same')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              filterType === 'same'
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Identical Only ({diffData.filter((i) => i.isSame).length})
          </button>
        </div>

        {/* Premium Collectible Card Grid View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:hidden">
            {filteredData.map((item, idx) => (
              <div
                key={idx}
                className={`relative group border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
                  item.isSame ? 'bg-white border-slate-100 hover:border-blue-200' : 'bg-rose-50/20 border-rose-100/60 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-black tracking-tight text-xs shadow-sm select-all border border-slate-800">
                      {item.shortcut}
                    </span>
                    {item.isSame ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        Identical
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        Different
                      </span>
                    )}
                  </div>

                  {/* Commands Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-3 font-mono text-sm">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">{primaryApp}</div>
                      <div
                        onClick={() => copyToClipboard(item.primaryCmd, idx, 'primary')}
                        className="font-black text-slate-900 hover:text-blue-600 cursor-pointer select-all truncate"
                      >
                        {item.primaryCmd}
                        {copiedIndex?.row === idx && copiedIndex?.app === 'primary' && (
                          <span className="text-[9px] text-emerald-500 font-bold block">Copied!</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">{secondaryApp}</div>
                      <div
                        onClick={() => copyToClipboard(item.secondaryCmd, idx, 'secondary')}
                        className={`font-black cursor-pointer select-all truncate ${
                          item.isSame ? 'text-slate-900 hover:text-blue-600' : 'text-rose-600 hover:text-rose-700'
                        }`}
                      >
                        {item.secondaryCmd}
                        {copiedIndex?.row === idx && copiedIndex?.app === 'secondary' && (
                          <span className="text-[9px] text-emerald-500 font-bold block">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-500 leading-relaxed mt-2 select-all">
                    {item.useCase}
                  </p>
                </div>

                {!item.isSame && (
                  <div className="text-[11px] text-rose-700 font-semibold mt-3 bg-white/80 p-2.5 rounded-xl border border-rose-100/50 leading-relaxed shadow-sm">
                    ⚠️ {item.diffNote}
                  </div>
                )}
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-slate-100">
                No matching comparison commands found.
              </div>
            )}
          </div>
        )}

        {/* Comparison Data Table */}
        <div
          className={`overflow-x-auto print:overflow-visible ${
            viewMode === 'card' ? 'hidden print:block' : 'block'
          }`}
        >
          <table className="w-full text-left border-collapse text-sm font-semibold text-slate-700">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-xs tracking-wider font-bold">
                <th className="py-3 px-4 w-[110px]">Alias</th>
                <th className="py-3 px-4 w-[160px]">{primaryApp} Cmd</th>
                <th className="py-3 px-4 w-[160px]">{secondaryApp} Cmd</th>
                <th className="py-3 px-4 w-[100px] text-center">Status</th>
                <th className="py-3 px-4">Core Use Case & Differences</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-50 hover:bg-slate-50/40 transition-colors ${
                    !item.isSame ? 'bg-rose-50/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-black tracking-tight text-xs shadow-sm select-all">
                      {item.shortcut}
                    </span>
                  </td>
                  
                  {/* Primary App Cmd */}
                  <td className="py-3 px-4">
                    <span
                      onClick={() => copyToClipboard(item.primaryCmd, idx, 'primary')}
                      className="text-slate-900 hover:text-blue-600 transition-colors font-black text-sm cursor-pointer select-all inline-flex items-center gap-1"
                    >
                      {item.primaryCmd}
                      {copiedIndex?.row === idx && copiedIndex?.app === 'primary' && (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </span>
                  </td>

                  {/* Secondary App Cmd */}
                  <td className="py-3 px-4">
                    <span
                      onClick={() => copyToClipboard(item.secondaryCmd, idx, 'secondary')}
                      className={`font-black text-sm cursor-pointer select-all inline-flex items-center gap-1 transition-colors ${
                        item.isSame ? 'text-slate-900 hover:text-blue-600' : 'text-rose-600 hover:text-rose-700'
                      }`}
                    >
                      {item.secondaryCmd}
                      {copiedIndex?.row === idx && copiedIndex?.app === 'secondary' && (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-3 px-4 text-center">
                    {item.isSame ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3" />
                        Identical
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        <AlertTriangle className="w-3 h-3" />
                        Different
                      </span>
                    )}
                  </td>

                  {/* Descriptions */}
                  <td className="py-3 px-4 leading-relaxed">
                    <div className="text-slate-900 font-bold text-xs">{item.useCase}</div>
                    {!item.isSame && (
                      <div className="text-rose-600/80 font-medium mt-1 text-xs bg-rose-50/50 p-2 rounded-lg border border-rose-100/30">
                        ⚠️ {item.diffNote}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No matching comparison commands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* @media print styles */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
            .print\\:border-none {
              border: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            @page {
              size: A4 landscape;
              margin: 1.5cm 1cm 1.5cm 1cm;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>

      </div>

      {/* Migration & Efficiency Guides */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 print:hidden">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            {primaryApp} ➔ {secondaryApp} Migration Guide
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            Seamless Migration & Compatibility Strategy Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              1. 99% Common Shortcuts are Identical
            </h4>
            <p>
              Most alternative CAD engines like GstarCAD and ZWCAD are deeply aligned with AutoCAD. High-frequency alias commands (such as L-Line, C-Circle, CO-Copy, M-Move, RO-Rotate) are 100% identical. Habits require zero adjustment.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              2. Seamless PGP Settings Import
            </h4>
            <p>
              If you have heavily customized `acad.pgp` files, you can copy-paste your aliases directly into the alternative CAD application via "Tools ➔ Customize ➔ Edit Aliases (PGP)" or load custom PGPs dynamically.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              3. Minor Platform Deviations
            </h4>
            <p>
              Some commands have minor platform differences (e.g. workspace setups or custom selection features). Pay attention to rows marked as "Different" to smoothly adapt your workflow.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
