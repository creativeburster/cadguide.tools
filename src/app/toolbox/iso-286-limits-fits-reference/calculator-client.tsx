'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { SlidersHorizontal, Search, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type FitCat = 'all' | 'clearance' | 'transition' | 'interference';

interface PreferredFitRow {
  holeBasis: string;
  shaftBasis: string;
  category: 'clearance' | 'transition' | 'interference';
  name: string;
  description: string;
}

interface ItGradeRow {
  label: string;
  minExcl: number;
  maxIncl: number;
  IT5: number;
  IT6: number;
  IT7: number;
  IT8: number;
  IT9: number;
  IT10: number;
  IT11: number;
}

// Verified verbatim against ISO 286 preferred fit classifications & ISO 286-1 Table 1
const PREFERRED_FITS: PreferredFitRow[] = [
  { holeBasis: 'H11/c11', shaftBasis: 'C11/h11', category: 'clearance', name: 'Loose running', description: 'Larger clearance where accuracy is not essential (pivots, latches, corrosion/heat exposure).' },
  { holeBasis: 'H9/d9', shaftBasis: 'D9/h9', category: 'clearance', name: 'Free running', description: 'Large clearance where accuracy is not essential with high speeds or wide temperature changes.' },
  { holeBasis: 'H8/f7', shaftBasis: 'F8/h7', category: 'clearance', name: 'Close running', description: 'Small clearances with moderate accuracy requirements (moderate speed shafts, spindles, rods).' },
  { holeBasis: 'H7/g6', shaftBasis: 'G7/h6', category: 'clearance', name: 'Sliding', description: 'Minimal clearances for high accuracy that turn and slide freely (sliding gears, journals).' },
  { holeBasis: 'H7/h6', shaftBasis: 'H7/h6', category: 'clearance', name: 'Location clearance', description: 'Very close clearances assembled without force for precise guiding when lubricated.' },
  { holeBasis: 'H7/k6', shaftBasis: 'K7/h6', category: 'transition', name: 'Similar / Location transition', description: 'Negligible clearance or interference assembled/disassembled with rubber mallet (hubs, pulleys).' },
  { holeBasis: 'H7/n6', shaftBasis: 'N7/h6', category: 'transition', name: 'Fixed / Tight transition', description: 'Negligible clearance or small interference requiring light pressing force (plugs, driven bushes).' },
  { holeBasis: 'H7/p6', shaftBasis: 'P7/h6', category: 'interference', name: 'Press fit', description: 'Interference fit assembled or disassembled by cold pressing (hubs, bearings, retainers).' },
  { holeBasis: 'H7/s6', shaftBasis: 'S7/h6', category: 'interference', name: 'Driving fit', description: 'Medium interference using hot or heavy cold pressing (tightest usual fit with cast iron).' },
  { holeBasis: 'H7/u6', shaftBasis: 'U7/h6', category: 'interference', name: 'Forced fit', description: 'High-interference shrink fit requiring large temperature differential; permanent assembly.' },
];

// IT5..IT11 values in micrometers (um) from ISO 286 Table 1
const IT_GRADE_TABLE: ItGradeRow[] = [
  { label: '0 to 3 mm', minExcl: 0, maxIncl: 3, IT5: 4, IT6: 6, IT7: 10, IT8: 14, IT9: 25, IT10: 40, IT11: 60 },
  { label: '> 3 to 6 mm', minExcl: 3, maxIncl: 6, IT5: 5, IT6: 8, IT7: 12, IT8: 18, IT9: 30, IT10: 48, IT11: 75 },
  { label: '> 6 to 10 mm', minExcl: 6, maxIncl: 10, IT5: 6, IT6: 9, IT7: 15, IT8: 22, IT9: 36, IT10: 58, IT11: 90 },
  { label: '> 10 to 18 mm', minExcl: 10, maxIncl: 18, IT5: 8, IT6: 11, IT7: 18, IT8: 27, IT9: 43, IT10: 70, IT11: 110 },
  { label: '> 18 to 30 mm', minExcl: 18, maxIncl: 30, IT5: 9, IT6: 13, IT7: 21, IT8: 33, IT9: 52, IT10: 84, IT11: 130 },
  { label: '> 30 to 50 mm', minExcl: 30, maxIncl: 50, IT5: 11, IT6: 16, IT7: 25, IT8: 39, IT9: 62, IT10: 100, IT11: 160 },
  { label: '> 50 to 80 mm', minExcl: 50, maxIncl: 80, IT5: 13, IT6: 19, IT7: 30, IT8: 46, IT9: 74, IT10: 120, IT11: 190 },
  { label: '> 80 to 120 mm', minExcl: 80, maxIncl: 120, IT5: 15, IT6: 22, IT7: 35, IT8: 54, IT9: 87, IT10: 140, IT11: 220 },
  { label: '> 120 to 180 mm', minExcl: 120, maxIncl: 180, IT5: 18, IT6: 25, IT7: 40, IT8: 63, IT9: 100, IT10: 160, IT11: 250 },
  { label: '> 180 to 250 mm', minExcl: 180, maxIncl: 250, IT5: 20, IT6: 29, IT7: 46, IT8: 72, IT9: 115, IT10: 185, IT11: 290 },
  { label: '> 250 to 315 mm', minExcl: 250, maxIncl: 315, IT5: 23, IT6: 32, IT7: 52, IT8: 81, IT9: 130, IT10: 210, IT11: 320 },
  { label: '> 315 to 400 mm', minExcl: 315, maxIncl: 400, IT5: 25, IT6: 36, IT7: 57, IT8: 89, IT9: 140, IT10: 230, IT11: 360 },
  { label: '> 400 to 500 mm', minExcl: 400, maxIncl: 500, IT5: 27, IT6: 40, IT7: 63, IT8: 97, IT9: 155, IT10: 250, IT11: 400 },
  { label: '> 500 to 630 mm', minExcl: 500, maxIncl: 630, IT5: 32, IT6: 44, IT7: 70, IT8: 110, IT9: 175, IT10: 280, IT11: 440 },
  { label: '> 630 to 800 mm', minExcl: 630, maxIncl: 800, IT5: 36, IT6: 50, IT7: 80, IT8: 125, IT9: 200, IT10: 320, IT11: 500 },
  { label: '> 800 to 1000 mm', minExcl: 800, maxIncl: 1000, IT5: 40, IT6: 56, IT7: 90, IT8: 140, IT9: 230, IT10: 360, IT11: 560 },
  { label: '> 1000 to 1250 mm', minExcl: 1000, maxIncl: 1250, IT5: 47, IT6: 66, IT7: 105, IT8: 165, IT9: 260, IT10: 420, IT11: 660 },
  { label: '> 1250 to 1600 mm', minExcl: 1250, maxIncl: 1600, IT5: 55, IT6: 78, IT7: 125, IT8: 195, IT9: 310, IT10: 500, IT11: 780 },
  { label: '> 1600 to 2000 mm', minExcl: 1600, maxIncl: 2000, IT5: 65, IT6: 92, IT7: 150, IT8: 230, IT9: 370, IT10: 600, IT11: 920 },
  { label: '> 2000 to 2500 mm', minExcl: 2000, maxIncl: 2500, IT5: 78, IT6: 110, IT7: 175, IT8: 280, IT9: 440, IT10: 700, IT11: 1100 },
  { label: '> 2500 to 3150 mm', minExcl: 2500, maxIncl: 3150, IT5: 96, IT6: 135, IT7: 210, IT8: 330, IT9: 540, IT10: 860, IT11: 1350 },
];

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function Iso286ReferenceClient() {
  const [dimStr, setDimStr] = useState('50');
  const [catFilter, setCatFilter] = useState<FitCat>('all');
  const [searchStr, setSearchStr] = useState('');
  const [copied, setCopied] = useState(false);

  const dim = parsePos(dimStr);
  const dimValid = dim !== null && dim > 0 && dim <= 3150;
  const itMatch = dimValid && dim !== null ? IT_GRADE_TABLE.find(r => dim > r.minExcl && dim <= r.maxIncl) ?? null : null;

  const q = searchStr.trim().toLowerCase();
  const visibleFits = PREFERRED_FITS.filter(f => {
    if (catFilter !== 'all' && f.category !== catFilter) return false;
    if (!q) return true;
    return (
      f.holeBasis.toLowerCase().includes(q) ||
      f.shaftBasis.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  });

  const handleReset = () => {
    setDimStr('50');
    setCatFilter('all');
    setSearchStr('');
  };

  const handleCopy = async () => {
    if (!itMatch) return;
    const text = [
      `ISO 286 IT Grades & Preferred Fits (Nominal: ${dim} mm)`,
      `Band: ${itMatch.label} | IT6 = ${itMatch.IT6} um | IT7 = ${itMatch.IT7} um | IT8 = ${itMatch.IT8} um`,
      ...visibleFits.map(f => `${f.holeBasis} (${f.name}, ${f.category}): ${f.description}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const rows = [
      ['section', 'col1', 'col2', 'col3', 'col4', 'col5', 'col6', 'col7', 'col8'],
      ...visibleFits.map(f => ['PREFERRED_FIT', f.holeBasis, f.shaftBasis, f.category, f.name.replace(/,/g, ' '), '', '', '', '']),
      ...IT_GRADE_TABLE.map(r => ['IT_GRADE_UM', r.label, String(r.IT5), String(r.IT6), String(r.IT7), String(r.IT8), String(r.IT9), String(r.IT10), String(r.IT11)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iso-286-limits-fits-reference.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">ISO 286 Preferred Fits &amp; IT Grades</h2>
              <p className="text-sm text-slate-500 font-medium">Search preferred hole-basis / shaft-basis fits or enter diameter (0–3150 mm) for IT bandwidth</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-sliding-h7g6"
              onClick={() => {
                setDimStr('50');
                setCatFilter('clearance');
                setSearchStr('H7/g6');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
            >
              H7/g6 Sliding (50 mm)
            </button>
            <button
              type="button"
              data-testid="preset-press-h7p6"
              onClick={() => {
                setDimStr('30');
                setCatFilter('interference');
                setSearchStr('H7/p6');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
            >
              H7/p6 Press Fit (30 mm)
            </button>
            <button
              type="button"
              data-testid="preset-small-3mm"
              onClick={() => {
                setDimStr('2.5');
                setCatFilter('all');
                setSearchStr('');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
            >
              Micro 2.5 mm Band
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Nominal Diameter (mm, &le; 3150)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-dim"
              value={dimStr}
              onChange={e => setDimStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Search Fits or Applications</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                data-testid="input-search"
                value={searchStr}
                onChange={e => setSearchStr(e.target.value)}
                placeholder="H7/g6, press, gears..."
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          </div>
          <div className="flex items-end gap-1.5">
            {(['all', 'clearance', 'transition', 'interference'] as FitCat[]).map(cat => (
              <button
                key={cat}
                type="button"
                data-testid={`filter-${cat}`}
                onClick={() => setCatFilter(cat)}
                className={`flex-1 h-11 rounded-xl text-xs font-bold capitalize border ${
                  catFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {!dimValid && (
          <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Nominal diameter must be &gt; 0 and &le; 3150 mm per ISO 286 Table 1.</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">IT7 Grade Width</div>
            <div className="text-2xl font-black text-blue-900">
              <span data-testid="result-it7">{itMatch ? String(itMatch.IT7) : '—'}</span>{' '}
              <span className="text-sm text-blue-600">um</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">IT6 Grade Width</div>
            <div className="text-2xl font-black text-emerald-900">
              <span data-testid="result-it6">{itMatch ? String(itMatch.IT6) : '—'}</span>{' '}
              <span className="text-sm text-emerald-600">um</span>
            </div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
            <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">IT5 / IT8 Width</div>
            <div className="text-2xl font-black text-orange-900">
              <span data-testid="result-it5">{itMatch ? String(itMatch.IT5) : '—'}</span> / {itMatch ? String(itMatch.IT8) : '—'}{' '}
              <span className="text-sm text-orange-600">um</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Visible Fits</div>
            <div className="text-2xl font-black text-slate-900">
              <span data-testid="result-fit-count">{visibleFits.length}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            data-testid="btn-reset"
            onClick={handleReset}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            type="button"
            data-testid="btn-copy"
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Visible Summary'}
          </button>
          <button
            type="button"
            data-testid="btn-download"
            onClick={handleDownload}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Hole Basis</th>
                <th className="px-4 py-3">Shaft Basis</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Fit Name</th>
                <th className="px-4 py-3">Typical Engineering Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleFits.map(f => (
                <tr key={f.holeBasis} className="hover:bg-blue-50/40">
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{f.holeBasis}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600">{f.shaftBasis}</td>
                  <td className="px-4 py-2.5 capitalize font-bold text-slate-700">{f.category}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">{f.name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{f.description}</td>
                </tr>
              ))}
              {visibleFits.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No matching preferred fits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase">
              <tr>
                <th className="px-3 py-2.5">ISO 286 Nominal Range</th>
                <th className="px-3 py-2.5 text-right">IT5 (um)</th>
                <th className="px-3 py-2.5 text-right">IT6 (um)</th>
                <th className="px-3 py-2.5 text-right">IT7 (um)</th>
                <th className="px-3 py-2.5 text-right">IT8 (um)</th>
                <th className="px-3 py-2.5 text-right">IT9 (um)</th>
                <th className="px-3 py-2.5 text-right">IT10 (um)</th>
                <th className="px-3 py-2.5 text-right">IT11 (um)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {IT_GRADE_TABLE.map(r => (
                <tr key={r.label} className={itMatch?.label === r.label ? 'bg-blue-50 font-bold' : ''}>
                  <td className="px-3 py-2 text-slate-800">{r.label}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT5}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT6}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT7}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT8}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT9}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT10}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.IT11}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
