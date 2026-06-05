'use client';

import { useState, useMemo } from 'react';
import { SHORTCUTS_DATA, SHORTCUT_CATEGORIES } from '@/lib/shortcuts-data';
import { RelatedTools } from '@/components/related-tools';

export default function CADShortcutsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);

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
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none h-12 px-6 rounded-2xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
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

      {/* Shortcuts List (Printable Zone) */}
      <div id="printable-shortcut-list" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs w-28">Shortcut</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs w-32">Full Command</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Description</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-28">AutoCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-28">GstarCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-28">ZWCAD</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-28">DWG FastView</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredShortcuts.length > 0 ? (
                filteredShortcuts.map((item) => (
                  <tr key={item.command} className="hover:bg-slate-50/30 transition duration-150">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCopy(item.shortcut)}
                        className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 font-mono font-bold text-sm border border-slate-200/50 hover:border-blue-200 transition duration-200"
                        title="Click to copy shortcut"
                      >
                        {item.shortcut}
                        <span className="text-[10px] text-slate-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition duration-200">
                          {copiedShortcut === item.shortcut ? 'Copied!' : 'Copy'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 font-mono text-sm">
                      {item.command}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 text-sm font-semibold">{item.description}</div>
                      <div className="text-xs text-slate-400 mt-1 font-medium italic">{item.notes}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-600 font-mono">
                      {item.autocad}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-600 font-mono">
                      {item.gstarcad}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-600 font-mono">
                      {item.zwcad}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
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
          <p className="text-xs text-blue-700 leading-relaxed">
            This page has been styled with special CSS print descriptors. Clicking the <strong>&quot;Print Sheet (PDF)&quot;</strong> button will output a clean, formatted cheat sheet table. We recommend choosing &quot;Save as PDF&quot; or selecting Landscape layout in your print wizard.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-2">How to customize shortcuts (.PGP)</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
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
