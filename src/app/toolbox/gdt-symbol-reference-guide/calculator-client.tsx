'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Printer, Copy, Check, Download, Info } from 'lucide-react';

interface GDTSymbol {
  id: string;
  name: string;
  symbol: string;
  asciiTag: string;
  category: 'form' | 'profile' | 'orientation' | 'location' | 'runout';
  zone: string;
  datum: string;
  status2018: 'Active' | 'Removed in ASME Y14.5-2018';
  description: string;
}

const DATA: GDTSymbol[] = [
  {
    id: 'straightness',
    name: 'Straightness',
    symbol: '—',
    asciiTag: '[STR]',
    category: 'form',
    zone: 'Two parallel lines or cylinder',
    datum: 'No datum',
    status2018: 'Active',
    description: 'Controls how straight a line element of a surface or an axis must be at each evaluated cut.',
  },
  {
    id: 'flatness',
    name: 'Flatness',
    symbol: '⏥',
    asciiTag: '[FLT]',
    category: 'form',
    zone: 'Two parallel planes',
    datum: 'No datum',
    status2018: 'Active',
    description: 'Controls how flat a surface must be between two parallel planes without requiring a datum.',
  },
  {
    id: 'circularity',
    name: 'Circularity',
    symbol: '○',
    asciiTag: '[CIR]',
    category: 'form',
    zone: 'Two concentric circles',
    datum: 'No datum',
    status2018: 'Active',
    description: 'Controls how round a cross-section must be at any individual slice perpendicular to the axis.',
  },
  {
    id: 'cylindricity',
    name: 'Cylindricity',
    symbol: '⌭',
    asciiTag: '[CYL]',
    category: 'form',
    zone: 'Two concentric cylinders',
    datum: 'No datum',
    status2018: 'Active',
    description: 'Controls the entire cylindrical surface at once for roundness, straightness, and taper combined.',
  },
  {
    id: 'profile-line',
    name: 'Profile of a Line',
    symbol: '⌒',
    asciiTag: '[PRL]',
    category: 'profile',
    zone: 'Two parallel boundary curves',
    datum: 'Optional datum',
    status2018: 'Active',
    description: 'Defines a 2D tolerance zone along any curved line or cross-section relative to its true profile.',
  },
  {
    id: 'profile-surface',
    name: 'Profile of a Surface',
    symbol: '⌓',
    asciiTag: '[PRS]',
    category: 'profile',
    zone: 'Two parallel offset surfaces',
    datum: 'Optional datum',
    status2018: 'Active',
    description: 'Defines a 3D tolerance zone around any surface shape; supports complex or freeform geometry.',
  },
  {
    id: 'angularity',
    name: 'Angularity',
    symbol: '∠',
    asciiTag: '[ANG]',
    category: 'orientation',
    zone: 'Two parallel planes at basic angle',
    datum: 'Requires datum',
    status2018: 'Active',
    description: 'Controls a surface or axis at an exact specified basic angle relative to a datum reference.',
  },
  {
    id: 'perpendicularity',
    name: 'Perpendicularity',
    symbol: '⊥',
    asciiTag: '[PERP]',
    category: 'orientation',
    zone: 'Two parallel planes or cylinder',
    datum: 'Requires datum',
    status2018: 'Active',
    description: 'Controls a surface or axis at exactly 90 deg relative to a datum plane or axis.',
  },
  {
    id: 'parallelism',
    name: 'Parallelism',
    symbol: '∥',
    asciiTag: '[PAR]',
    category: 'orientation',
    zone: 'Two parallel planes',
    datum: 'Requires datum',
    status2018: 'Active',
    description: 'Controls a surface or axis so it runs parallel (0 deg basic implied) to a datum.',
  },
  {
    id: 'position',
    name: 'Position',
    symbol: '⊕',
    asciiTag: '[POS]',
    category: 'location',
    zone: 'Cylindrical (diameter) or planar zone',
    datum: 'Requires datum',
    status2018: 'Active',
    description: 'Controls exact feature location relative to datums; commonly combined with MMC/LMC modifiers.',
  },
  {
    id: 'runout',
    name: 'Runout',
    symbol: '↗',
    asciiTag: '[RUN]',
    category: 'runout',
    zone: 'Two concentric circles per cross-section',
    datum: 'Requires datum axis',
    status2018: 'Active',
    description: 'Controls circular surface variation at individual cross-sections relative to a datum axis as the part rotates.',
  },
  {
    id: 'total-runout',
    name: 'Total Runout',
    symbol: '⌰',
    asciiTag: '[TRUN]',
    category: 'runout',
    zone: 'Two concentric cylinders',
    datum: 'Requires datum axis',
    status2018: 'Active',
    description: 'Controls the entire surface relative to a datum axis in one full sweep along the axis.',
  },
  {
    id: 'concentricity',
    name: 'Concentricity',
    symbol: '◎',
    asciiTag: '[CON-2009]',
    category: 'location',
    zone: 'Cylinder coaxial with datum axis',
    datum: 'Requires datum axis',
    status2018: 'Removed in ASME Y14.5-2018',
    description: 'Formerly controlled median points of a cylindrical feature relative to a datum axis; removed in ASME Y14.5-2018 in favor of Position or Runout.',
  },
  {
    id: 'symmetry',
    name: 'Symmetry',
    symbol: '⌯',
    asciiTag: '[SYM-2009]',
    category: 'location',
    zone: 'Two parallel planes about datum centerplane',
    datum: 'Requires datum plane',
    status2018: 'Removed in ASME Y14.5-2018',
    description: 'Formerly controlled median points symmetric about a datum plane; removed in ASME Y14.5-2018 in favor of Position.',
  },
];

const MATERIAL_MODIFIERS = [
  {
    symbol: 'Ⓜ',
    asciiTag: '(M)',
    name: 'Maximum Material Condition (MMC)',
    description: 'Applies when a feature is at its largest allowable material size (smallest hole / largest pin); unlocks bonus tolerance as size departs from MMC.',
  },
  {
    symbol: 'Ⓛ',
    asciiTag: '(L)',
    name: 'Least Material Condition (LMC)',
    description: 'Applies when a feature is at its smallest allowable material size; used where minimum wall thickness or material retention governs.',
  },
  {
    symbol: 'RFS',
    asciiTag: 'Default (No Symbol)',
    name: 'Regardless of Feature Size',
    description: 'Default condition per ASME Y14.5 when neither MMC nor LMC is specified; tolerance applies at actual size with no bonus tolerance.',
  },
  {
    symbol: 'Ⓟ',
    asciiTag: '(P)',
    name: 'Projected Tolerance Zone',
    description: 'Extends the tolerance zone beyond the feature surface (typically above threaded holes or pressed pins) to control mating fastener alignment.',
  },
  {
    symbol: 'Ⓕ',
    asciiTag: '(F)',
    name: 'Free State Symbol',
    description: 'Indicates measurement in the unrestrained state without clamping forces for non-rigid or flexible parts.',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'form', name: 'Form' },
  { id: 'profile', name: 'Profile' },
  { id: 'orientation', name: 'Orientation' },
  { id: 'location', name: 'Location' },
  { id: 'runout', name: 'Runout' },
];

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function GDTSymbolClient() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [includeRemoved2018, setIncludeRemoved2018] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DATA.filter((item) => {
      if (!includeRemoved2018 && item.status2018 !== 'Active') return false;
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      const matchCat = activeCat === 'all' || item.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [search, activeCat, includeRemoved2018]);

  const handleCopy = async () => {
    const text = filtered.map((s) => `${s.name} ${s.asciiTag} (${s.status2018}): ${s.zone} | ${s.datum}`).join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    const rows = [
      ['Symbol Name', 'ASCII Tag', 'Category', 'Tolerance Zone', 'Datum Requirement', 'ASME Status', 'Description'],
      ...filtered.map((item) => [
        item.name,
        item.asciiTag,
        item.category,
        item.zone,
        item.datum,
        item.status2018,
        item.description,
      ]),
      ['', '', '', '', '', '', ''],
      ['Modifier', 'ASCII Symbol', 'Notes', '', '', '', ''],
      ...MATERIAL_MODIFIERS.map((m) => [m.name, m.asciiTag, m.description, '', '', '', '']),
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gdt-asme-y14-5-reference.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm print:hidden">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            data-testid="input-search"
            placeholder="Search GD&T characteristics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-500 px-2">
            Showing <span data-testid="result-count">{filtered.length}</span> symbols
          </span>
          <button
            type="button"
            data-testid="toggle-removed-2018"
            onClick={() => setIncludeRemoved2018((v) => !v)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
              includeRemoved2018
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {includeRemoved2018 ? 'Hide 2018 Removed (+2)' : 'Show Removed in 2018 (+2)'}
          </button>
          <button
            type="button"
            data-testid="btn-copy"
            disabled={filtered.length === 0}
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            data-testid="btn-download"
            disabled={filtered.length === 0}
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <Printer className="w-4 h-4" />
            Print A4
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-testid={`cat-${cat.id}`}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${
              activeCat === cat.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            data-testid={`gdt-card-${item.id}`}
            className={`group bg-white border rounded-2xl p-5 hover:shadow-md transition-all print:border-slate-200 ${
              item.status2018 === 'Active' ? 'border-slate-200 hover:border-blue-200' : 'border-amber-300 bg-amber-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black">
                {item.symbol}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{item.category}</span>
                {item.status2018 !== 'Active' && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {item.status2018}
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-xs font-bold text-slate-500">
                <span className="text-slate-700">Zone:</span> {item.zone}
              </p>
              <p className="text-xs font-bold text-slate-500">
                <span className="text-slate-700">Datum:</span> {item.datum}
              </p>
            </div>
            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-bold bg-white rounded-3xl border border-slate-200">
          No GD&amp;T symbols found matching your filter.
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-4">Feature Control Frame Modifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATERIAL_MODIFIERS.map((m) => (
            <div key={m.name} className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="min-w-9 h-9 px-2 rounded-lg bg-slate-900 flex items-center justify-center text-white text-sm font-black">
                  {m.symbol}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{m.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">{m.asciiTag}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2 print:hidden">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Reference aligned with{' '}
          <a
            href="https://www.gdandtbasics.com/gdt-symbols/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold"
          >
            GD&amp;T Basics Symbols Guide
          </a>{' '}
          and{' '}
          <a
            href="https://www.gdandtbasics.com/asme-2009-vs-2018/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline font-semibold"
          >
            ASME Y14.5 2009 vs 2018 Summary
          </a>{' '}
          (Concentricity and Symmetry removed in 2018; Regardless of Feature Size applies by default without a modifier symbol).
        </span>
      </div>

      <RelatedTools compact />
    </div>
  );
}
