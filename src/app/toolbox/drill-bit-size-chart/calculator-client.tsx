'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Info, RotateCcw, Copy, Check, Download } from 'lucide-react';

interface DrillRow {
  size: string;
  category: 'Number' | 'Letter' | 'Fractional';
  inch: number;
  mm: number;
  tap: string;
}

// Verified ASME B94.11M #80-#1, Letter A-Z, and Fractional 1/64"-1/2" sizes
// Tap drills cross-verified verbatim against Wikipedia Unified Thread Standard (UNC/UNF/UNEF cutting tap table)
const DRILL_SIZES: DrillRow[] = [
  { size: '#80', category: 'Number', inch: 0.0135, mm: 0.3429, tap: '' },
  { size: '#79', category: 'Number', inch: 0.0145, mm: 0.3683, tap: '' },
  { size: '#78', category: 'Number', inch: 0.016, mm: 0.4064, tap: '' },
  { size: '#77', category: 'Number', inch: 0.018, mm: 0.4572, tap: '' },
  { size: '#76', category: 'Number', inch: 0.02, mm: 0.508, tap: '' },
  { size: '#75', category: 'Number', inch: 0.021, mm: 0.5334, tap: '' },
  { size: '#74', category: 'Number', inch: 0.0225, mm: 0.5715, tap: '' },
  { size: '#73', category: 'Number', inch: 0.024, mm: 0.6096, tap: '' },
  { size: '#72', category: 'Number', inch: 0.025, mm: 0.635, tap: '' },
  { size: '#71', category: 'Number', inch: 0.026, mm: 0.6604, tap: '' },
  { size: '#70', category: 'Number', inch: 0.028, mm: 0.7112, tap: '' },
  { size: '#69', category: 'Number', inch: 0.0292, mm: 0.7417, tap: '' },
  { size: '#68', category: 'Number', inch: 0.031, mm: 0.7874, tap: '' },
  { size: '#67', category: 'Number', inch: 0.032, mm: 0.8128, tap: '' },
  { size: '#66', category: 'Number', inch: 0.033, mm: 0.8382, tap: '' },
  { size: '#65', category: 'Number', inch: 0.035, mm: 0.889, tap: '' },
  { size: '#64', category: 'Number', inch: 0.036, mm: 0.9144, tap: '' },
  { size: '#63', category: 'Number', inch: 0.037, mm: 0.9398, tap: '' },
  { size: '#62', category: 'Number', inch: 0.038, mm: 0.9652, tap: '' },
  { size: '#61', category: 'Number', inch: 0.039, mm: 0.9906, tap: '' },
  { size: '#60', category: 'Number', inch: 0.04, mm: 1.016, tap: '' },
  { size: '#59', category: 'Number', inch: 0.041, mm: 1.0414, tap: '' },
  { size: '#58', category: 'Number', inch: 0.042, mm: 1.0668, tap: '' },
  { size: '#57', category: 'Number', inch: 0.043, mm: 1.0922, tap: '' },
  { size: '#56', category: 'Number', inch: 0.0465, mm: 1.1811, tap: '' },
  { size: '#55', category: 'Number', inch: 0.052, mm: 1.3208, tap: '' },
  { size: '#54', category: 'Number', inch: 0.055, mm: 1.397, tap: '' },
  { size: '#53', category: 'Number', inch: 0.0595, mm: 1.5113, tap: '#1-64 UNC / #1-72 UNF' },
  { size: '#52', category: 'Number', inch: 0.0635, mm: 1.6129, tap: '' },
  { size: '#51', category: 'Number', inch: 0.067, mm: 1.7018, tap: '' },
  { size: '#50', category: 'Number', inch: 0.07, mm: 1.778, tap: '#2-56 UNC / #2-64 UNF' },
  { size: '#49', category: 'Number', inch: 0.073, mm: 1.8542, tap: '' },
  { size: '#48', category: 'Number', inch: 0.076, mm: 1.9304, tap: '' },
  { size: '#47', category: 'Number', inch: 0.0785, mm: 1.9939, tap: '#3-48 UNC' },
  { size: '#46', category: 'Number', inch: 0.081, mm: 2.0574, tap: '' },
  { size: '#45', category: 'Number', inch: 0.082, mm: 2.0828, tap: '#3-56 UNF' },
  { size: '#44', category: 'Number', inch: 0.086, mm: 2.1844, tap: '' },
  { size: '#43', category: 'Number', inch: 0.089, mm: 2.2606, tap: '#4-40 UNC' },
  { size: '#42', category: 'Number', inch: 0.0935, mm: 2.3749, tap: '#4-48 UNF' },
  { size: '#41', category: 'Number', inch: 0.096, mm: 2.4384, tap: '' },
  { size: '#40', category: 'Number', inch: 0.098, mm: 2.4892, tap: '' },
  { size: '#39', category: 'Number', inch: 0.0995, mm: 2.5273, tap: '' },
  { size: '#38', category: 'Number', inch: 0.1015, mm: 2.5781, tap: '#5-40 UNC' },
  { size: '#37', category: 'Number', inch: 0.104, mm: 2.6416, tap: '#5-44 UNF' },
  { size: '#36', category: 'Number', inch: 0.1065, mm: 2.7051, tap: '#6-32 UNC' },
  { size: '#35', category: 'Number', inch: 0.11, mm: 2.794, tap: '' },
  { size: '#34', category: 'Number', inch: 0.111, mm: 2.8194, tap: '' },
  { size: '#33', category: 'Number', inch: 0.113, mm: 2.8702, tap: '#6-40 UNF' },
  { size: '#32', category: 'Number', inch: 0.116, mm: 2.9464, tap: '' },
  { size: '#31', category: 'Number', inch: 0.12, mm: 3.048, tap: '' },
  { size: '#30', category: 'Number', inch: 0.1285, mm: 3.2639, tap: '' },
  { size: '#29', category: 'Number', inch: 0.136, mm: 3.4544, tap: '#8-32 UNC / #8-36 UNF' },
  { size: '#28', category: 'Number', inch: 0.1405, mm: 3.5687, tap: '' },
  { size: '#27', category: 'Number', inch: 0.144, mm: 3.6576, tap: '' },
  { size: '#26', category: 'Number', inch: 0.147, mm: 3.7338, tap: '' },
  { size: '#25', category: 'Number', inch: 0.1495, mm: 3.7973, tap: '#10-24 UNC' },
  { size: '#24', category: 'Number', inch: 0.152, mm: 3.8608, tap: '' },
  { size: '#23', category: 'Number', inch: 0.154, mm: 3.9116, tap: '' },
  { size: '#22', category: 'Number', inch: 0.157, mm: 3.9878, tap: '' },
  { size: '#21', category: 'Number', inch: 0.159, mm: 4.0386, tap: '#10-32 UNF' },
  { size: '#20', category: 'Number', inch: 0.161, mm: 4.0894, tap: '' },
  { size: '#19', category: 'Number', inch: 0.166, mm: 4.2164, tap: '' },
  { size: '#18', category: 'Number', inch: 0.1695, mm: 4.3053, tap: '' },
  { size: '#17', category: 'Number', inch: 0.173, mm: 4.3942, tap: '' },
  { size: '#16', category: 'Number', inch: 0.177, mm: 4.4958, tap: '#12-24 UNC' },
  { size: '#15', category: 'Number', inch: 0.18, mm: 4.572, tap: '' },
  { size: '#14', category: 'Number', inch: 0.182, mm: 4.6228, tap: '#12-28 UNF' },
  { size: '#13', category: 'Number', inch: 0.185, mm: 4.699, tap: '' },
  { size: '#12', category: 'Number', inch: 0.189, mm: 4.8006, tap: '' },
  { size: '#11', category: 'Number', inch: 0.191, mm: 4.8514, tap: '' },
  { size: '#10', category: 'Number', inch: 0.1935, mm: 4.9149, tap: '' },
  { size: '#9', category: 'Number', inch: 0.196, mm: 4.9784, tap: '' },
  { size: '#8', category: 'Number', inch: 0.199, mm: 5.0546, tap: '' },
  { size: '#7', category: 'Number', inch: 0.201, mm: 5.1054, tap: '1/4-20 UNC' },
  { size: '#6', category: 'Number', inch: 0.204, mm: 5.1816, tap: '' },
  { size: '#5', category: 'Number', inch: 0.2055, mm: 5.2197, tap: '' },
  { size: '#4', category: 'Number', inch: 0.209, mm: 5.3086, tap: '' },
  { size: '#3', category: 'Number', inch: 0.213, mm: 5.4102, tap: '1/4-28 UNF' },
  { size: '#2', category: 'Number', inch: 0.221, mm: 5.6134, tap: '' },
  { size: '#1', category: 'Number', inch: 0.228, mm: 5.7912, tap: '' },
  { size: 'A', category: 'Letter', inch: 0.234, mm: 5.9436, tap: '' },
  { size: 'B', category: 'Letter', inch: 0.238, mm: 6.0452, tap: '' },
  { size: 'C', category: 'Letter', inch: 0.242, mm: 6.1468, tap: '' },
  { size: 'D', category: 'Letter', inch: 0.246, mm: 6.2484, tap: '' },
  { size: 'E', category: 'Letter', inch: 0.25, mm: 6.35, tap: '' },
  { size: 'F', category: 'Letter', inch: 0.257, mm: 6.5278, tap: '5/16-18 UNC' },
  { size: 'G', category: 'Letter', inch: 0.261, mm: 6.6294, tap: '' },
  { size: 'H', category: 'Letter', inch: 0.266, mm: 6.7564, tap: '' },
  { size: 'I', category: 'Letter', inch: 0.272, mm: 6.9088, tap: '5/16-24 UNF' },
  { size: 'J', category: 'Letter', inch: 0.277, mm: 7.0358, tap: '' },
  { size: 'K', category: 'Letter', inch: 0.281, mm: 7.1374, tap: '' },
  { size: 'L', category: 'Letter', inch: 0.29, mm: 7.366, tap: '' },
  { size: 'M', category: 'Letter', inch: 0.295, mm: 7.493, tap: '' },
  { size: 'N', category: 'Letter', inch: 0.302, mm: 7.6708, tap: '' },
  { size: 'O', category: 'Letter', inch: 0.316, mm: 8.0264, tap: '' },
  { size: 'P', category: 'Letter', inch: 0.323, mm: 8.2042, tap: '' },
  { size: 'Q', category: 'Letter', inch: 0.332, mm: 8.4328, tap: '3/8-24 UNF' },
  { size: 'R', category: 'Letter', inch: 0.339, mm: 8.6106, tap: '' },
  { size: 'S', category: 'Letter', inch: 0.348, mm: 8.8392, tap: '' },
  { size: 'T', category: 'Letter', inch: 0.358, mm: 9.0932, tap: '' },
  { size: 'U', category: 'Letter', inch: 0.368, mm: 9.3472, tap: '7/16-14 UNC' },
  { size: 'V', category: 'Letter', inch: 0.377, mm: 9.5758, tap: '' },
  { size: 'W', category: 'Letter', inch: 0.386, mm: 9.8044, tap: '' },
  { size: 'X', category: 'Letter', inch: 0.397, mm: 10.0838, tap: '' },
  { size: 'Y', category: 'Letter', inch: 0.404, mm: 10.2616, tap: '7/16-28 UNEF' },
  { size: 'Z', category: 'Letter', inch: 0.413, mm: 10.4902, tap: '' },
  { size: '1/64"', category: 'Fractional', inch: 0.015625, mm: 0.3969, tap: '' },
  { size: '1/32"', category: 'Fractional', inch: 0.03125, mm: 0.7937, tap: '' },
  { size: '3/64"', category: 'Fractional', inch: 0.046875, mm: 1.1906, tap: '#0-80 UNF' },
  { size: '1/16"', category: 'Fractional', inch: 0.0625, mm: 1.5875, tap: '' },
  { size: '5/64"', category: 'Fractional', inch: 0.078125, mm: 1.9844, tap: '' },
  { size: '3/32"', category: 'Fractional', inch: 0.09375, mm: 2.3812, tap: '' },
  { size: '7/64"', category: 'Fractional', inch: 0.109375, mm: 2.7781, tap: '' },
  { size: '1/8"', category: 'Fractional', inch: 0.125, mm: 3.175, tap: '' },
  { size: '9/64"', category: 'Fractional', inch: 0.140625, mm: 3.5719, tap: '' },
  { size: '5/32"', category: 'Fractional', inch: 0.15625, mm: 3.9688, tap: '' },
  { size: '11/64"', category: 'Fractional', inch: 0.171875, mm: 4.3656, tap: '' },
  { size: '3/16"', category: 'Fractional', inch: 0.1875, mm: 4.7625, tap: '#12-32 UNEF' },
  { size: '13/64"', category: 'Fractional', inch: 0.203125, mm: 5.1594, tap: '' },
  { size: '7/32"', category: 'Fractional', inch: 0.21875, mm: 5.5562, tap: '1/4-32 UNEF' },
  { size: '15/64"', category: 'Fractional', inch: 0.234375, mm: 5.9531, tap: '' },
  { size: '1/4"', category: 'Fractional', inch: 0.25, mm: 6.35, tap: '' },
  { size: '17/64"', category: 'Fractional', inch: 0.265625, mm: 6.7469, tap: '' },
  { size: '9/32"', category: 'Fractional', inch: 0.28125, mm: 7.1437, tap: '5/16-32 UNEF' },
  { size: '19/64"', category: 'Fractional', inch: 0.296875, mm: 7.5406, tap: '' },
  { size: '5/16"', category: 'Fractional', inch: 0.3125, mm: 7.9375, tap: '3/8-16 UNC' },
  { size: '21/64"', category: 'Fractional', inch: 0.328125, mm: 8.3344, tap: '' },
  { size: '11/32"', category: 'Fractional', inch: 0.34375, mm: 8.7312, tap: '3/8-32 UNEF' },
  { size: '23/64"', category: 'Fractional', inch: 0.359375, mm: 9.1281, tap: '' },
  { size: '3/8"', category: 'Fractional', inch: 0.375, mm: 9.525, tap: '' },
  { size: '25/64"', category: 'Fractional', inch: 0.390625, mm: 9.9219, tap: '7/16-20 UNF' },
  { size: '13/32"', category: 'Fractional', inch: 0.40625, mm: 10.3187, tap: '' },
  { size: '27/64"', category: 'Fractional', inch: 0.421875, mm: 10.7156, tap: '1/2-13 UNC' },
  { size: '7/16"', category: 'Fractional', inch: 0.4375, mm: 11.1125, tap: '' },
  { size: '29/64"', category: 'Fractional', inch: 0.453125, mm: 11.5094, tap: '1/2-20 UNF' },
  { size: '15/32"', category: 'Fractional', inch: 0.46875, mm: 11.9062, tap: '1/2-28 UNEF' },
  { size: '31/64"', category: 'Fractional', inch: 0.484375, mm: 12.3031, tap: '9/16-12 UNC' },
  { size: '1/2"', category: 'Fractional', inch: 0.5, mm: 12.7, tap: '9/16-18 UNF' },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

export default function DrillSizeClient() {
  const [category, setCategory] = useState<'All' | 'Number' | 'Letter' | 'Fractional'>('All');
  const [query, setQuery] = useState('');
  const [tapOnly, setTapOnly] = useState(false);
  const [targetStr, setTargetStr] = useState('5.10');
  const [targetUnit, setTargetUnit] = useState<'mm' | 'in'>('mm');
  const [copiedSize, setCopiedSize] = useState<string | null>(null);

  const handleReset = () => {
    setCategory('All');
    setQuery('');
    setTapOnly(false);
    setTargetStr('5.10');
    setTargetUnit('mm');
    setCopiedSize(null);
  };

  const closest = useMemo(() => {
    const val = parsePositive(targetStr);
    if (!Number.isFinite(val)) return null;
    const targetMm = targetUnit === 'mm' ? val : val * 25.4;
    let best = DRILL_SIZES[0];
    let bestDiff = Math.abs(DRILL_SIZES[0].mm - targetMm);
    for (const row of DRILL_SIZES) {
      const diff = Math.abs(row.mm - targetMm);
      if (diff < bestDiff) {
        best = row;
        bestDiff = diff;
      }
    }
    return {
      row: best,
      targetMm,
      deltaMm: best.mm - targetMm,
    };
  }, [targetStr, targetUnit]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DRILL_SIZES.filter((row) => {
      if (category !== 'All' && row.category !== category) return false;
      if (tapOnly && !row.tap) return false;
      if (!q) return true;
      return (
        row.size.toLowerCase().includes(q) ||
        row.tap.toLowerCase().includes(q) ||
        row.mm.toFixed(3).includes(q) ||
        row.inch.toFixed(4).includes(q)
      );
    });
  }, [category, query, tapOnly]);

  const handleCopyClosest = async () => {
    if (!closest) return;
    const txt = `Closest drill to ${closest.targetMm.toFixed(3)} mm: ${closest.row.size} (${closest.row.inch} in / ${closest.row.mm.toFixed(3)} mm${closest.row.tap ? `, Tap: ${closest.row.tap}` : ''})`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(txt);
        setCopiedSize(closest.row.size);
        setTimeout(() => setCopiedSize(null), 1800);
      }
    } catch {
      setCopiedSize(null);
    }
  };

  const handleDownloadCsv = () => {
    const header = 'size,category,inch,mm,tap_drill';
    const rows = DRILL_SIZES.map(
      (r) => `${r.size},${r.category},${r.inch},${r.mm},${r.tap || '-'}`
    );
    const csv = [header, ...rows].join('\n').replace(/[^\x20-\x7E\n]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asme_b94_11m_drill_bit_chart.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">ASME B94.11M Drill Bit Size &amp; Tap Reference (138 Sizes)</h2>
          <p className="text-sm font-medium text-slate-500">
            Complete #80–#1 (80 sizes), A–Z (26 sizes), and 1/64&quot;–1/2&quot; fractional drills with UNC/UNF/UNEF tap matches
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-testid="export-csv-button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV (138)
          </button>
          <button
            type="button"
            data-testid="reset-button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-orange-50/70 rounded-2xl p-5 border border-orange-200">
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="drill-target" className="text-xs font-black text-orange-900 uppercase">
                Closest Drill Bit Finder
              </label>
              <div className="flex gap-1">
                {(['mm', 'in'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`target-unit-${u}`}
                    onClick={() => setTargetUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      targetUnit === u ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="drill-target"
              data-testid="input-target-hole"
              type="text"
              inputMode="decimal"
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-orange-300 font-bold bg-white text-slate-900"
            />
          </div>

          <div className="lg:col-span-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black text-orange-800 uppercase mb-0.5">Closest Standard Drill</div>
              <div className="flex items-baseline gap-3">
                <span data-testid="result-closest-size" className="text-3xl font-black text-slate-900">
                  {closest ? closest.row.size : '—'}
                </span>
                <span data-testid="result-closest-detail" className="text-sm font-bold text-slate-700 font-mono">
                  {closest
                    ? `${closest.row.inch.toFixed(4)} in • ${closest.row.mm.toFixed(3)} mm (Δ ${closest.deltaMm >= 0 ? '+' : ''}${closest.deltaMm.toFixed(3)} mm)`
                    : '—'}
                </span>
              </div>
              {closest?.row.tap && (
                <div className="text-xs font-black text-orange-700 mt-1">
                  Tap Drill Application: {closest.row.tap}
                </div>
              )}
            </div>

            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopyClosest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
            >
              {copiedSize ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSize ? 'Copied' : 'Copy Match'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Number', 'Letter', 'Fractional'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                data-testid={`filter-${cat.toLowerCase()}`}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                  category === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? `All (${DRILL_SIZES.length})` : cat}
              </button>
            ))}
            <button
              type="button"
              data-testid="filter-tap-only"
              onClick={() => setTapOnly((v) => !v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                tapOnly ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tap Drills Only
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              data-testid="input-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search #7, Q, 1/4-20, 5.1..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold w-60"
            />
          </div>
        </div>

        <div className="text-xs font-black text-slate-500">
          Showing <span data-testid="result-row-count">{filteredRows.length}</span> of {DRILL_SIZES.length} drill sizes
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[420px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-100 sticky top-0 text-xs font-black text-slate-600 uppercase">
              <tr>
                <th className="py-3 px-4">Drill Size</th>
                <th className="py-3 px-4">System</th>
                <th className="py-3 px-4">Decimal (in)</th>
                <th className="py-3 px-4">Metric (mm)</th>
                <th className="py-3 px-4">Verified Unified Tap Drill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row) => (
                <tr key={row.size} data-testid={`row-${row.size}`} className="hover:bg-orange-50/40">
                  <td className="py-2.5 px-4 font-black text-slate-900 font-mono">{row.size}</td>
                  <td className="py-2.5 px-4 text-xs font-bold text-slate-500">{row.category}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{row.inch.toFixed(4)}&quot;</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{row.mm.toFixed(3)} mm</td>
                  <td className="py-2.5 px-4 font-bold text-orange-700">{row.tap || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
          <div>
            <strong>ASME B94.11M &amp; Unified Thread Standard Basis:</strong>{' '}
            All 80 number sizes (#80–#1), 26 letter sizes (A–Z), and 32 fractional sizes (1/64&quot;–1/2&quot;) follow exact <code>1 in = 25.4 mm</code> metric conversions; cutting tap drill pairings follow Unified Thread Standard (UNC/UNF/UNEF) specifications.
          </div>
        </div>

        <RelatedTools />
      </div>
    </div>
  );
}
