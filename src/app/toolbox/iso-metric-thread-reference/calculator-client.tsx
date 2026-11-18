'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Wrench, RotateCcw, Copy, Download, Check } from 'lucide-react';

type PitchFilter = 'all' | 'Coarse' | 'Fine';

interface MetricThreadRow {
  designation: string;
  majorMm: number;
  pitchMm: number;
  series: 'Coarse' | 'Fine';
  tapDrillMm: number;
}

// Verified verbatim against AmesWeb Metric Tap Drill Chart (ISO 68-1 / ISO 261 / ISO 262)
const METRIC_THREADS: MetricThreadRow[] = [
  { designation: 'M1.6x0.35', majorMm: 1.6, pitchMm: 0.35, series: 'Coarse', tapDrillMm: 1.25 },
  { designation: 'M2x0.4', majorMm: 2.0, pitchMm: 0.4, series: 'Coarse', tapDrillMm: 1.6 },
  { designation: 'M2.5x0.45', majorMm: 2.5, pitchMm: 0.45, series: 'Coarse', tapDrillMm: 2.05 },
  { designation: 'M3x0.5', majorMm: 3.0, pitchMm: 0.5, series: 'Coarse', tapDrillMm: 2.5 },
  { designation: 'M3.5x0.6', majorMm: 3.5, pitchMm: 0.6, series: 'Coarse', tapDrillMm: 2.9 },
  { designation: 'M4x0.7', majorMm: 4.0, pitchMm: 0.7, series: 'Coarse', tapDrillMm: 3.3 },
  { designation: 'M5x0.8', majorMm: 5.0, pitchMm: 0.8, series: 'Coarse', tapDrillMm: 4.2 },
  { designation: 'M6x1', majorMm: 6.0, pitchMm: 1.0, series: 'Coarse', tapDrillMm: 5.0 },
  { designation: 'M8x1.25', majorMm: 8.0, pitchMm: 1.25, series: 'Coarse', tapDrillMm: 6.8 },
  { designation: 'M8x1', majorMm: 8.0, pitchMm: 1.0, series: 'Fine', tapDrillMm: 7.0 },
  { designation: 'M10x1.5', majorMm: 10.0, pitchMm: 1.5, series: 'Coarse', tapDrillMm: 8.5 },
  { designation: 'M10x1.25', majorMm: 10.0, pitchMm: 1.25, series: 'Fine', tapDrillMm: 8.8 },
  { designation: 'M10x1', majorMm: 10.0, pitchMm: 1.0, series: 'Fine', tapDrillMm: 9.0 },
  { designation: 'M12x1.75', majorMm: 12.0, pitchMm: 1.75, series: 'Coarse', tapDrillMm: 10.2 },
  { designation: 'M12x1.5', majorMm: 12.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 10.5 },
  { designation: 'M12x1.25', majorMm: 12.0, pitchMm: 1.25, series: 'Fine', tapDrillMm: 10.8 },
  { designation: 'M14x2', majorMm: 14.0, pitchMm: 2.0, series: 'Coarse', tapDrillMm: 12.0 },
  { designation: 'M14x1.5', majorMm: 14.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 12.5 },
  { designation: 'M16x2', majorMm: 16.0, pitchMm: 2.0, series: 'Coarse', tapDrillMm: 14.0 },
  { designation: 'M16x1.5', majorMm: 16.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 14.5 },
  { designation: 'M18x2.5', majorMm: 18.0, pitchMm: 2.5, series: 'Coarse', tapDrillMm: 15.5 },
  { designation: 'M18x1.5', majorMm: 18.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 16.5 },
  { designation: 'M20x2.5', majorMm: 20.0, pitchMm: 2.5, series: 'Coarse', tapDrillMm: 17.5 },
  { designation: 'M20x2', majorMm: 20.0, pitchMm: 2.0, series: 'Fine', tapDrillMm: 18.0 },
  { designation: 'M20x1.5', majorMm: 20.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 18.5 },
  { designation: 'M22x2.5', majorMm: 22.0, pitchMm: 2.5, series: 'Coarse', tapDrillMm: 19.5 },
  { designation: 'M22x1.5', majorMm: 22.0, pitchMm: 1.5, series: 'Fine', tapDrillMm: 20.5 },
  { designation: 'M24x3', majorMm: 24.0, pitchMm: 3.0, series: 'Coarse', tapDrillMm: 21.0 },
  { designation: 'M24x2', majorMm: 24.0, pitchMm: 2.0, series: 'Fine', tapDrillMm: 22.0 },
  { designation: 'M27x3', majorMm: 27.0, pitchMm: 3.0, series: 'Coarse', tapDrillMm: 24.0 },
  { designation: 'M27x2', majorMm: 27.0, pitchMm: 2.0, series: 'Fine', tapDrillMm: 25.0 },
  { designation: 'M30x3.5', majorMm: 30.0, pitchMm: 3.5, series: 'Coarse', tapDrillMm: 26.5 },
  { designation: 'M30x2', majorMm: 30.0, pitchMm: 2.0, series: 'Fine', tapDrillMm: 28.0 },
  { designation: 'M33x3.5', majorMm: 33.0, pitchMm: 3.5, series: 'Coarse', tapDrillMm: 29.5 },
  { designation: 'M33x2', majorMm: 33.0, pitchMm: 2.0, series: 'Fine', tapDrillMm: 31.0 },
  { designation: 'M36x4', majorMm: 36.0, pitchMm: 4.0, series: 'Coarse', tapDrillMm: 32.0 },
  { designation: 'M36x3', majorMm: 36.0, pitchMm: 3.0, series: 'Fine', tapDrillMm: 33.0 },
  { designation: 'M39x4', majorMm: 39.0, pitchMm: 4.0, series: 'Coarse', tapDrillMm: 35.0 },
  { designation: 'M39x3', majorMm: 39.0, pitchMm: 3.0, series: 'Fine', tapDrillMm: 36.0 },
  { designation: 'M42x4.5', majorMm: 42.0, pitchMm: 4.5, series: 'Coarse', tapDrillMm: 37.5 },
  { designation: 'M45x4.5', majorMm: 45.0, pitchMm: 4.5, series: 'Coarse', tapDrillMm: 40.5 },
  { designation: 'M48x5', majorMm: 48.0, pitchMm: 5.0, series: 'Coarse', tapDrillMm: 43.0 },
  { designation: 'M52x5', majorMm: 52.0, pitchMm: 5.0, series: 'Coarse', tapDrillMm: 47.0 },
  { designation: 'M56x5.5', majorMm: 56.0, pitchMm: 5.5, series: 'Coarse', tapDrillMm: 50.5 },
];

export default function IsoMetricThreadReferenceClient() {
  const [searchStr, setSearchStr] = useState('');
  const [series, setSeries] = useState<PitchFilter>('all');
  const [copied, setCopied] = useState(false);

  const q = searchStr.trim().toLowerCase();
  const filtered = METRIC_THREADS.filter(r => {
    if (series !== 'all' && r.series !== series) return false;
    if (!q) return true;
    return (
      r.designation.toLowerCase().includes(q) ||
      String(r.tapDrillMm).includes(q) ||
      r.series.toLowerCase().includes(q)
    );
  });

  const featured = filtered[0] ?? null;

  const handleReset = () => {
    setSearchStr('');
    setSeries('all');
  };

  const handleCopy = async () => {
    if (filtered.length === 0) return;
    const text = [
      'ISO Metric Coarse & Fine Thread Tap Drill Reference',
      ...filtered.slice(0, 15).map(r => `${r.designation} (${r.series}): Pitch ${r.pitchMm} mm | Tap Drill ${r.tapDrillMm.toFixed(2)} mm`),
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
    if (filtered.length === 0) return;
    const rows = [
      ['designation', 'series', 'major_mm', 'pitch_mm', 'tap_drill_mm'],
      ...filtered.map(r => [r.designation, r.series, String(r.majorMm), String(r.pitchMm), r.tapDrillMm.toFixed(2)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iso-metric-threads-tap-drill.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">ISO 261 / 262 Metric Threads</h2>
              <p className="text-sm text-slate-500 font-medium">Coarse &amp; fine pitch sizes M1.6 to M56 with recommended tap drill diameters</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-m6"
              onClick={() => {
                setSeries('Coarse');
                setSearchStr('M6x1');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
            >
              M6 x 1.0 Coarse
            </button>
            <button
              type="button"
              data-testid="preset-m10-coarse"
              onClick={() => {
                setSeries('Coarse');
                setSearchStr('M10x1.5');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
            >
              M10 x 1.5 Coarse
            </button>
            <button
              type="button"
              data-testid="preset-m12-fine"
              onClick={() => {
                setSeries('Fine');
                setSearchStr('M12x1.25');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
            >
              M12 x 1.25 Fine
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              data-testid="input-search"
              value={searchStr}
              onChange={e => setSearchStr(e.target.value)}
              placeholder="Search thread (e.g. M8x1.25, M10x1.5, 6.8)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'Coarse', 'Fine'] as PitchFilter[]).map(f => (
              <button
                key={f}
                type="button"
                data-testid={`filter-${f.toLowerCase()}`}
                onClick={() => setSeries(f)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                  series === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Matching Sizes</div>
            <div className="text-2xl font-black text-orange-900">
              <span data-testid="result-count">{filtered.length}</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Top Match</div>
            <div className="text-xl font-black text-slate-900">
              <span data-testid="result-top-thread">{featured ? featured.designation : '—'}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Pitch</div>
            <div className="text-xl font-black text-blue-900">
              <span data-testid="result-top-pitch">{featured ? String(featured.pitchMm) : '—'}</span>{' '}
              <span className="text-sm text-blue-600">mm</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Tap Drill</div>
            <div className="text-xl font-black text-emerald-900">
              <span data-testid="result-top-drill">{featured ? featured.tapDrillMm.toFixed(2) : '—'}</span>{' '}
              <span className="text-sm text-emerald-600">mm</span>
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
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Visible Rows'}
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
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Series</th>
                <th className="px-4 py-3 text-right">Major Dia (mm)</th>
                <th className="px-4 py-3 text-right">Pitch (mm)</th>
                <th className="px-4 py-3 text-right">Tap Drill (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.designation} className="hover:bg-orange-50/40">
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{r.designation}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-600">{r.series}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.majorMm.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.pitchMm.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-orange-800">{r.tapDrillMm.toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No matching metric thread sizes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
