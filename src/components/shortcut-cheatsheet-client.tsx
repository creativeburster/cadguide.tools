'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Printer, Download, Sparkles, Check, Copy, Star, ArrowRight, Compass } from 'lucide-react';
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
  mode?: 'shortcuts' | 'reference';
  columnHeaders?: [string, string, string];
  searchPlaceholder?: string;
}

// Cross-software discovery recommendations per CAD software
const CROSS_DISCOVERY_MAP: Record<string, { label: string; href: string; badge: string; desc: string }[]> = {
  autocad: [
    {
      label: 'AutoCAD vs GstarCAD Shortcuts',
      href: '/toolbox/autocad-vs-gstarcad-shortcuts',
      badge: 'Migration',
      desc: 'Compare command aliases and transition differences with zero retraining'
    },
    {
      label: 'Drawing Lag & Bloat Cleaner',
      href: '/toolbox/drawing-lag-performance-cleaner',
      badge: 'Troubleshoot',
      desc: 'Purge orphaned regapps, unreferenced linestyles, and viewport stutter'
    },
    {
      label: 'AutoCAD vs BricsCAD',
      href: '/compare/autocad-vs-bricscad',
      badge: 'Comparison',
      desc: 'Compare perpetual licensing, native LISP, and AI drafting capabilities'
    }
  ],
  solidworks: [
    {
      label: 'SolidWorks vs Fusion 360',
      href: '/compare/fusion-360-vs-solidworks',
      badge: 'Comparison',
      desc: 'Cloud collaboration vs heavy industrial assembly modeling showdown'
    },
    {
      label: 'Sheet Metal K-Factor Calculator',
      href: '/toolbox/k-factor-calculator',
      badge: 'Calculator',
      desc: 'DIN 6935 neutral axis shift and flat pattern blank calculations'
    },
    {
      label: 'Online CAD File Compressor',
      href: '/toolbox/online-cad-file-compressor',
      badge: 'Utility',
      desc: 'Compress massive assembly STEP/SLDPRT files up to 80%'
    }
  ],
  revit: [
    {
      label: 'ArchiCAD vs Revit BIM Showdown',
      href: '/compare/archicad-vs-revit',
      badge: 'BIM Comparison',
      desc: 'Mac compatibility, OpenBIM IFC handling, and multi-disciplinary teams'
    },
    {
      label: 'Revit to IFC High-Precision Guide',
      href: '/convert/revit-to-ifc',
      badge: 'Workflow',
      desc: 'Complete property set and geometry mapping rules for IFC2x3 & IFC4'
    },
    {
      label: 'Revit Family Parameter Calculator',
      href: '/toolbox/revit-family-param-calculator',
      badge: 'Optimization',
      desc: 'Streamline parametric family formulas and nested constraints'
    }
  ],
  inventor: [
    {
      label: 'Autodesk Inventor vs SolidWorks',
      href: '/compare/autodesk-inventor-vs-solidworks',
      badge: 'Comparison',
      desc: 'Detailed engineering analysis of assembly performance and drawing generators'
    },
    {
      label: 'STEP File Header & Schema Parser',
      href: '/toolbox/step-file-header-parser',
      badge: 'Inspection',
      desc: 'Audit AP203/AP214/AP242 schemas and origin units in-browser'
    }
  ],
  rhino: [
    {
      label: 'Rhino 3D vs Blender',
      href: '/compare/blender-vs-rhino-3d',
      badge: 'Comparison',
      desc: 'NURBS precision mathematical surfaces vs polygonal mesh sculpting'
    },
    {
      label: '3D Printing Chordal Deviation Calc',
      href: '/toolbox/3d-printing-chordal-deviation',
      badge: 'Mesh Quality',
      desc: 'Balance polygonal faceting vs file size for watertight 3D prints'
    }
  ],
  blender: [
    {
      label: 'Blender vs Maya Pipeline Comparison',
      href: '/compare/blender-vs-maya',
      badge: 'Comparison',
      desc: 'Cycles render engine vs Hollywood enterprise studio rigging pipelines'
    },
    {
      label: 'STL Mesh Integrity & Slicer Checker',
      href: '/toolbox/stl-mesh-checker',
      badge: 'Print Prep',
      desc: 'Detect non-manifold edges, normal flips, and manifold voids'
    },
    {
      label: 'STL / OBJ Mesh Decimator Calc',
      href: '/toolbox/stl-mesh-decimator-reducer',
      badge: 'Size Reducer',
      desc: 'Calculate polygon reduction and ASCII-to-Binary STL file savings'
    }
  ],
  nx: [
    {
      label: 'NX STEP AP242 & PMI Export Troubleshooter',
      href: '/toolbox/nx-step-ap242-pmi-export-troubleshooter',
      badge: 'NX Diagnostic',
      desc: 'Fix missing sub-assemblies, empty Reference Sets, and lost 3D PMI in NX STEP exports'
    },
    {
      label: 'NX (.PRT) to STEP Converter Guide',
      href: '/convert/nx-prt-to-step',
      badge: 'B-Rep Exchange',
      desc: 'Export Siemens NX Parasolid assemblies to ISO 10303-21 STEP AP214/AP242'
    },
    {
      label: 'Cross-CAD Command & Feature Translator',
      href: '/toolbox/cad-command-cross-translator',
      badge: 'Cross-Platform',
      desc: 'Translate commands between Siemens NX, SolidWorks, CATIA, Creo, and AutoCAD'
    }
  ],
  civil: [
    {
      label: 'Civil 3D Corridor & Surface Lag Optimizer',
      href: '/toolbox/civil3d-corridor-surface-lag-optimizer',
      badge: 'Performance Fix',
      desc: 'Eliminate TIN surface regen freezes, missing .mms errors, and slow corridor rebuilds'
    },
    {
      label: 'DWG File Size & RegApp Bloat Reducer',
      href: '/toolbox/dwg-file-size-reducer',
      badge: 'DWG Cleaner',
      desc: 'Purge orphaned DGN linetypes, RegApps, and proxy graphics from heavy site DWGs'
    },
    {
      label: '2026 CAD Workstation Hardware Spec Builder',
      href: '/toolbox/cad-hardware-workstation-spec-builder',
      badge: 'Hardware Guide',
      desc: 'Optimal single-core GHz CPU, RAM, and NVMe specs for Civil 3D LiDAR surfaces'
    }
  ],
  kicad: [
    {
      label: 'PCB Trace Width & Current Calculator',
      href: '/toolbox/pcb-trace-width-calculator',
      badge: 'IPC-2221',
      desc: 'Calculate internal and external copper trace width for target temperature rise'
    },
    {
      label: 'Gerber & Drill File Pre-Flight Viewer',
      href: '/toolbox/gerber-viewer',
      badge: 'CAM Check',
      desc: 'Inspect RS-274X Gerber layers, solder mask clearances, and Excellon drill hits'
    },
    {
      label: 'Electrical Schematic Symbols Reference',
      href: '/toolbox/electrical-drawing-symbols-reference',
      badge: 'IEC / NFPA',
      desc: 'Cross-reference IEC 60617 and IEEE/NFPA 79 schematic symbols and tags'
    }
  ],
  catia: [
    {
      label: 'CATIA (.CATPart) to STEP Converter',
      href: '/convert/catpart-to-step',
      badge: 'Top Converter',
      desc: 'Convert CATIA V5/3DEXPERIENCE parts and products to neutral STEP AP214/AP242'
    },
    {
      label: 'STEP Assembly Defeature & Size Reducer',
      href: '/toolbox/step-file-size-reducer',
      badge: 'Size Optimizer',
      desc: 'Shrink 300MB+ automotive & aerospace STEP assemblies for fast supplier exchange'
    },
    {
      label: 'Cross-CAD Command & Feature Translator',
      href: '/toolbox/cad-command-cross-translator',
      badge: 'Migration',
      desc: 'Map CATIA Part Design commands (Pad, Pocket, Shaft) to SolidWorks & Siemens NX'
    }
  ],
  progecad: [
    {
      label: '2026 Perpetual CAD Migration Matrix',
      href: '/toolbox/perpetual-cad-migration-compatibility-matrix',
      badge: 'Perpetual Buyout',
      desc: 'Compare progeCAD, ZWCAD, BricsCAD, and GStarCAD one-time buyout licensing & LISP support'
    },
    {
      label: '5-Year Subscription vs. Perpetual TCO Calc',
      href: '/toolbox/cad-subscription-vs-perpetual-roi-calculator',
      badge: 'ROI Calculator',
      desc: 'Calculate 5-year team license savings when switching from annual rental to perpetual CAD'
    },
    {
      label: 'DWG Bloat & File Size Reducer',
      href: '/toolbox/dwg-file-size-reducer',
      badge: 'DWG Optimizer',
      desc: 'Clean bloated DWG files for smooth panning and plotting in IntelliCAD / DWG engines'
    }
  ]
};

export default function ShortcutCheatsheetClient({
  title,
  categories,
  shortcuts,
  tips,
  downloadAliasText,
  downloadAliasFileName = 'aliases.txt',
  mode,
  columnHeaders,
  searchPlaceholder
}: ShortcutCheatsheetClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [isNotesCopied, setIsNotesCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const isReference = mode === 'reference' || (
    !title.toLowerCase().includes('shortcut') && 
    !title.toLowerCase().includes('hotkey') && 
    !title.toLowerCase().includes('alias')
  );

  const placeholderText = searchPlaceholder || (
    isReference 
      ? 'Search standards, sizes, specifications, or notes...' 
      : 'Search keys or commands (e.g. Ctrl, Line, Extrude)...'
  );

  const tableHeaders = columnHeaders || (
    isReference
      ? ['Code / Size', 'Specification', 'Engineering Notes']
      : ['Hotkeys', 'Command', 'Description']
  );

  // Search and filter logic
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((item) => {
      let matchCategory = true;
      if (activeCategory === 'top10') {
        const top10 = shortcuts.slice(0, 10);
        return top10.includes(item);
      } else if (activeCategory !== 'all') {
        matchCategory = item.category === activeCategory;
      }

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

  // Copy structured quick reference notes formatted for sticky note / notepad
  const handleCopyAllQuickCard = () => {
    const topItems = shortcuts.slice(0, 15);
    const textLines = [
      isReference ? `=== ${title} Engineering Reference Data ===` : `=== ${title} Essential Shortcuts Reference ===`,
      `Verified by CADGuide.tools • ${new Date().getFullYear()}`,
      '',
      ...topItems.map(item => `• ${item.keys.padEnd(10, ' ')} : ${item.command} — ${item.description}`),
      '',
      '👉 More free CAD utilities: https://cadguide.tools/toolbox'
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setIsNotesCopied(true);
    setTimeout(() => setIsNotesCopied(false), 2000);
  };

  // Find cross-discovery items matching this software
  const crossDiscoveryItems = useMemo(() => {
    const key = title.toLowerCase();
    for (const [k, v] of Object.entries(CROSS_DISCOVERY_MAP)) {
      if (key.includes(k)) return v;
    }
    // Fallback general comparisons
    return [
      {
        label: 'Online CAD File Compressor',
        href: '/toolbox/online-cad-file-compressor',
        badge: 'Popular',
        desc: 'Reduce file sizes of 3D models and drawing databases'
      },
      {
        label: 'Cross-CAD Command & Feature Translator',
        href: '/toolbox/cad-command-cross-translator',
        badge: 'Cross-Platform',
        desc: 'Map equivalent 2D/3D commands across AutoCAD, SolidWorks, NX, Inventor, and Creo'
      },
      {
        label: 'Browse CAD Comparisons',
        href: '/compare',
        badge: 'Directory',
        desc: 'Explore side-by-side spec sheets for 180+ engineering applications'
      }
    ];
  }, [title]);

  return (
    <div className="flex flex-col gap-8">
      {/* Shortcut Search and Multi-tab Category Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Search Input & Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholderText}
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

            {/* Copy Quick Notes Button */}
            <button
              onClick={handleCopyAllQuickCard}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer h-11 ${
                isNotesCopied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white'
              }`}
              title="Copy top items formatted as clean text for your notepad"
            >
              {isNotesCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Notes Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>{isReference ? 'Copy Reference Data' : 'Copy Cheat Sheet'}</span>
                </>
              )}
            </button>

            {downloadAliasText && (
              <button
                onClick={handleDownloadAlias}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer h-11 bg-white"
              >
                <Download className="w-4 h-4" />
                Download Aliases
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all cursor-pointer h-11"
            >
              <Printer className="w-4 h-4" />
              Print (A4)
            </button>
          </div>
        </div>

        {/* Filter Category Tabs with Top 10 Essentials Pill */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 border-slate-950 text-white shadow-sm'
                : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isReference ? `All Entries (${shortcuts.length})` : `All Commands (${shortcuts.length})`}
          </button>
          <button
            onClick={() => setActiveCategory('top10')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'top10'
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm shadow-amber-500/20'
                : 'bg-amber-50/80 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Top 10 Essentials
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

        {/* Cross-Software Discovery Callout: Hook for Retention & Dwell Time */}
        {crossDiscoveryItems.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-indigo-50/40 border border-blue-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  Exploring {title} Workflows or Planning a Transition?
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Check out popular comparison reports and companion tools for this software
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {crossDiscoveryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-700 font-bold text-xs transition-all shadow-xs group"
                >
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-blue-50 text-blue-600 rounded">
                    {item.badge}
                  </span>
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Premium Collectible Card Grid View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:hidden">
            {filteredShortcuts.map((item, idx) => (
              <div
                key={idx}
                className="relative group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
              >
                {/* Subtle gradient corner decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-bl-[24px] group-hover:scale-110 transition-transform"></div>

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1.5 rounded-lg font-black tracking-tight text-xs shadow-sm select-all border border-slate-800">
                      {item.keys}
                    </span>
                    <span
                      onClick={() => handleCopyCommand(item.command, idx)}
                      className="text-xs font-black text-slate-400 font-mono hover:text-blue-600 cursor-pointer select-all flex items-center gap-1 transition-colors"
                    >
                      {item.command}
                      {isCopied === idx && (
                        <span className="text-[10px] text-emerald-500 font-bold">Copied!</span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-bold leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            {filteredShortcuts.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-slate-100">
                {isReference ? 'No matching engineering reference items found. Please try other terms.' : 'No matching shortcuts found. Please try other terms.'}
              </div>
            )}
          </div>
        )}

        {/* Shortcut Cheatsheet Table */}
        <div
          className={`overflow-x-auto print:overflow-visible ${
            viewMode === 'card' ? 'hidden print:block' : 'block'
          }`}
        >
          <table className="w-full text-left border-collapse text-sm font-semibold text-slate-700">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-xs tracking-wider font-bold">
                <th className="py-3 px-4 w-[180px]">{tableHeaders[0]}</th>
                <th className="py-3 px-4 w-[200px]">{tableHeaders[1]}</th>
                <th className="py-3 px-4">{tableHeaders[2]}</th>
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

      {/* Contextual Next-Step Engine */}
      <RelatedTools />
    </div>
  );
}
