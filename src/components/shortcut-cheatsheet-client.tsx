'use client';

import { useState, useMemo } from 'react';
import { Search, Printer, Download, Sparkles, Info, Check } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export interface ShortcutItem {
  keys: string;
  command: string;
  category: string;
  description: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface TipItem {
  title: string;
  content: string;
}

interface ShortcutCheatsheetClientProps {
  title: string;
  subtitle: string;
  categories: CategoryOption[];
  shortcuts: ShortcutItem[];
  tips: TipItem[];
  downloadAliasText?: string;
  downloadAliasFileName?: string;
}

export default function ShortcutCheatsheetClient({
  title,
  subtitle,
  categories,
  shortcuts,
  tips,
  downloadAliasText,
  downloadAliasFileName = 'aliases.txt'
}: ShortcutCheatsheetClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCopied, setIsCopied] = useState<number | null>(null);

  // Search and filter logic
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.keys.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [shortcuts, searchQuery, activeCategory]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAlias = () => {
    if (!downloadAliasText) return;
    const blob = new Blob([downloadAliasText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadAliasFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setIsCopied(index);
    setTimeout(() => setIsCopied(null), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Shortcut Search and Multi-tab Category Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Search Input & Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys or commands (e.g. Ctrl, Line, Extrude)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="flex gap-2">
            {downloadAliasText && (
              <button
                onClick={handleDownloadAlias}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Aliases
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Cheatsheet (A4)
            </button>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 border-slate-950 text-white'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Commands
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 border-slate-950 text-white'
                  : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Shortcut Cheatsheet Table */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-sm font-semibold text-slate-700">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-xs tracking-wider font-bold">
                <th className="py-3 px-4 w-[180px]">Hotkeys</th>
                <th className="py-3 px-4 w-[200px]">Command</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortcuts.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 print:hover:bg-transparent transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-black tracking-tight text-xs shadow-sm select-all">
                      {item.keys}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      onClick={() => handleCopyCommand(item.command, idx)}
                      className="text-slate-900 font-black text-sm hover:text-blue-600 transition-colors cursor-pointer select-all flex items-center gap-1.5"
                    >
                      {item.command}
                      {isCopied === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 print:hidden">Copy</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium leading-relaxed">{item.description}</td>
                </tr>
              ))}
              {filteredShortcuts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">
                    No matching shortcuts found. Please try other terms.
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

      {/* Advanced Efficiency Guide Card */}
      {tips.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 print:hidden">
          <div>
            <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              {title} Advanced Efficiency Guide
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
              {title} Efficiency Optimization & Best Practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-500">
            {tips.map((tip, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {tip.title}
                </h4>
                <p className="pl-3">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedTools />
    </div>
);
}
