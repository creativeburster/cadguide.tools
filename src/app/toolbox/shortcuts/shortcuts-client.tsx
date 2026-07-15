'use client';

import { useState, useMemo } from 'react';
import { SHORTCUTS_DATA, SHORTCUT_CATEGORIES } from '@/lib/shortcuts-data';
import { RelatedTools } from '@/components/related-tools';

export default function CADShortcutsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((item) => {
      const matchesSearch =
        item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortcut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleCopy = (shortcut: string) => {
    navigator.clipboard.writeText(shortcut);
    setCopiedShortcut(shortcut);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12">
      {/* Search & Actions Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search commands (e.g. LINE, TRIM, L)..."
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

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200/50">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 h-10 rounded-xl text-base font-black flex items-center gap-1.5 transition-all ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/10'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 h-10 rounded-xl text-base font-black flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/10'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Table View
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="h-12 px-6 rounded-2xl border border-slate-200 hover:border-slate-300 text-slate-700 text-base font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Sheet (PDF)
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {SHORTCUT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-base font-black border transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Premium Collectible Card Grid View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          {filteredShortcuts.length > 0 ? (
            filteredShortcuts.map((item) => (
              <div
                key={item.command}
                className="relative group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Subtle gradient corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-bl-[40px] group-hover:scale-110 transition-transform"></div>

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => handleCopy(item.shortcut)}
                      className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-black text-lg tracking-tight shadow-md hover:bg-blue-600 hover:border-blue-500 transition duration-200"
                      title="Click to copy shortcut"
                    >
                      {item.shortcut}
                      <span className="text-[9px] font-bold text-slate-400 group-hover/btn:text-white opacity-0 group-hover/btn:opacity-100 transition duration-200">
                        {copiedShortcut === item.shortcut ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                    <span className="text-base font-black text-slate-400 font-mono tracking-tight select-all">
                      {item.command}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 leading-snug mb-1">
                    {item.description}
                  </h4>
                  {item.notes && (
                    <p className="text-base text-slate-400 font-medium italic mb-4">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Cross-platform compatibility indices */}
                <div className="border-t border-slate-50 pt-4 mt-2 grid grid-cols-2 gap-2 text-base font-semibold text-slate-500 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">AutoCAD:</span>
                    <span className="font-bold text-slate-700">{item.autocad}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Gstar:</span>
                    <span className="font-bold text-slate-700">{item.gstarcad}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">ZWCAD:</span>
                    <span className="font-bold text-slate-700">{item.zwcad}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">FastV:</span>
                    <span className="text-slate-600 truncate" title={item.dwgfastview}>{item.dwgfastview}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">
              No commands matched your query.
            </div>
          )}
        </div>
      )}

      {/* Shortcuts List (Printable Zone & Table View) */}
      <div
        id="printable-shortcut-list"
        className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden ${
          viewMode === 'card' ? 'hidden print:block' : 'block'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-lg font-semibold text-slate-700">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base w-28">Shortcut</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base w-32">Full Command</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base">Description</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base text-center w-28">AutoCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base text-center w-28">GstarCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base text-center w-28">ZWCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-base text-center w-28">DWG FastView</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredShortcuts.length > 0 ? (
                filteredShortcuts.map((item) => (
                  <tr key={item.command} className="hover:bg-slate-50/30 transition duration-150">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCopy(item.shortcut)}
                        className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 font-mono font-bold text-lg border border-slate-200/50 hover:border-blue-200 transition duration-200"
                        title="Click to copy shortcut"
                      >
                        {item.shortcut}
                        <span className="text-sm text-slate-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition duration-200">
                          {copiedShortcut === item.shortcut ? 'Copied!' : 'Copy'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 font-mono text-lg">
                      {item.command}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 text-lg font-semibold">{item.description}</div>
                      <div className="text-base text-slate-400 mt-1 font-medium italic">{item.notes}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-slate-600 font-mono">
                      {item.autocad}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-slate-600 font-mono">
                      {item.gstarcad}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-slate-600 font-mono">
                      {item.zwcad}
                    </td>
                    <td className="px-6 py-4 text-center text-base font-bold text-slate-500">
                      {item.dwgfastview}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No commands matched your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printing Help Guidelines */}
      <div className="bg-blue-50/50 rounded-3xl border border-blue-50 p-8 grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-blue-900 mb-2">Printable Poster Optimization</h4>
          <p className="text-base text-blue-700 leading-relaxed">
            This page has been styled with special CSS print descriptors. Clicking the <strong>&quot;Print Sheet (PDF)&quot;</strong> button will output a clean, formatted cheat sheet table. We recommend choosing &quot;Save as PDF&quot; or selecting Landscape layout in your print wizard.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-2">How to customize shortcuts (.PGP)</h4>
          <p className="text-base text-blue-700 leading-relaxed">
            Both AutoCAD and alternative systems (GstarCAD, ZWCAD) store command aliases in an editable <code>acad.pgp</code> or <code>gcad.pgp</code> text file. Type <strong>ALIASEDIT</strong> or <strong>REINIT</strong> in your command bar to edit shortcuts or reload custom PGPs instantly.
          </p>
        </div>
      </div>

      {/* Newsletter Alert Banner */}
      <RelatedTools />

      {/* Print-specific style tag injected locally */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-shortcut-list, #printable-shortcut-list * {
            visibility: visible;
          }
          #printable-shortcut-list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          table {
            font-size: 10px !important;
          }
          th, td {
            padding: 8px 6px !important;
          }
          button {
            border: none !important;
            background: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
