'use client';

import { useState, useMemo } from 'react';
import { SHORTCUTS_DATA, SHORTCUT_CATEGORIES, ZWCAD_OFFICIAL_SHORTCUTS_URL } from '@/lib/shortcuts-data';
import { RelatedTools } from '@/components/related-tools';
import { PrintableBrandHeader, PrintableBrandFooter, downloadCheatSheetWallpaperPng } from '@/components/printable-brand-banner';
import { Download, ExternalLink } from 'lucide-react';

export default function CADShortcutsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const filteredShortcuts = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return SHORTCUTS_DATA.filter((item) => {
      const matchesSearch =
        item.command.toLowerCase().includes(q) ||
        item.shortcut.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleCopy = (shortcut: string) => {
    navigator.clipboard.writeText(shortcut).catch(() => {});
    setCopiedShortcut(shortcut);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadCsv = () => {
    const lines = [
      '# ZWCAD Official Keyboard Shortcuts & Command Aliases Reference',
      `# Source: ${ZWCAD_OFFICIAL_SHORTCUTS_URL}`,
      'Shortcut,Full Command,Category,Official Function',
      ...filteredShortcuts.map(item =>
        `"${item.shortcut}","${item.command}",${item.category},"${item.description}"`
      ),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zwcad-official-shortcuts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            data-testid="input-search"
            placeholder="Search shortcuts (e.g. LINE, CIRCLE, L, Ctrl+S)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <div className="absolute left-4 top-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200/50">
            <button
              type="button"
              data-testid="btn-view-card"
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 h-10 rounded-xl text-sm font-black transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Card View
            </button>
            <button
              type="button"
              data-testid="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 h-10 rounded-xl text-sm font-black transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            type="button"
            data-testid="export-csv-btn"
            onClick={downloadCsv}
            className="h-12 px-4 rounded-2xl border border-slate-200 text-slate-700 text-sm font-black flex items-center gap-2 hover:bg-slate-50 transition-all bg-white cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Export CSV
          </button>

          <button
            type="button"
            data-testid="btn-download-wallpaper"
            onClick={() =>
              downloadCheatSheetWallpaperPng({
                title: 'Verified ZWCAD Keyboard Shortcuts',
                path: '/toolbox/shortcuts',
                items: SHORTCUTS_DATA.map((s) => ({
                  key: s.shortcut,
                  command: s.command,
                  desc: s.description,
                })),
              })
            }
            className="h-12 px-4 rounded-2xl border border-slate-200 text-slate-700 text-sm font-black flex items-center gap-2 hover:bg-slate-50 transition-all bg-white cursor-pointer"
          >
            Desk Wallpaper (PNG)
          </button>

          <button
            type="button"
            data-testid="btn-print-a4"
            onClick={handlePrint}
            className="h-12 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            Print A4 Sheet (PDF)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {SHORTCUT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-testid={`cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-black border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div data-testid="shortcut-count" className="text-sm font-black text-slate-500">
          Showing {filteredShortcuts.length} verified commands
        </div>
      </div>

      {viewMode === 'card' && (
        <div data-testid="cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
          {filteredShortcuts.length > 0 ? (
            filteredShortcuts.map((item) => (
              <div
                key={`${item.shortcut}-${item.command}`}
                data-testid="shortcut-card"
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.shortcut)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-base hover:bg-blue-600 transition cursor-pointer"
                      title="Click to copy shortcut"
                    >
                      {item.shortcut}
                      <span className="text-xs font-bold text-slate-300">
                        {copiedShortcut === item.shortcut ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                    <span className="text-sm font-black text-slate-500 font-mono text-right break-all">
                      {item.command}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 leading-snug">
                    {item.description}
                  </h4>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>{item.category}</span>
                  <span>ZWCAD Official</span>
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

      <div
        id="printable-shortcut-list"
        className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden print:p-2 ${
          viewMode === 'card' ? 'hidden print:block' : 'block'
        }`}
      >
        <PrintableBrandHeader
          title="ZWCAD Keyboard Shortcuts & Command Aliases Reference"
          subtitle="Verified command shortcuts and function keys from official ZWSOFT ZWCAD documentation."
          itemCount={filteredShortcuts.length}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base font-semibold text-slate-700">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-sm w-36">Shortcut</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-sm w-64">Full Name</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-sm w-32">Category</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-sm">Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShortcuts.length > 0 ? (
                filteredShortcuts.map((item) => (
                  <tr key={`${item.shortcut}-${item.command}`} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.shortcut)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 font-mono font-bold text-sm border border-slate-200 cursor-pointer"
                      >
                        {copiedShortcut === item.shortcut ? 'Copied' : item.shortcut}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 font-black text-slate-900 font-mono text-sm">
                      {item.command}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-bold uppercase text-slate-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 text-sm font-medium">
                      {item.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No commands matched your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PrintableBrandFooter title="ZWCAD Keyboard Shortcuts & Command Aliases Reference" />
      </div>

      <div className="bg-blue-50/60 rounded-3xl border border-blue-100 p-8 grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-blue-900 mb-2">Command Alias Customization (zwcad.pgp)</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Per ZWSOFT documentation, you can manage aliases via <strong>Tools &rarr; Customize &rarr; Command Alias Editor</strong> (command <strong>ALIASEDIT</strong>) or edit <code>zwcad.pgp</code> using <code>ShortcutKey,*Command Full Name</code> syntax. Run <strong>REINIT</strong> in the command line to reload <code>zwcad.pgp</code> without restarting ZWCAD.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Official Documentation Source</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Every shortcut key, command name, and description in this table is sourced directly from the official ZWSOFT ZWCAD User Guide.
            </p>
          </div>
          <a
            href={ZWCAD_OFFICIAL_SHORTCUTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-black text-blue-700 hover:underline w-fit"
          >
            <ExternalLink className="w-4 h-4" />
            ZWSOFT Official ZWCAD Shortcut Keys Guide
          </a>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
