'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, RotateCcw, Copy, Download, Check, Wrench } from 'lucide-react';

type ThreadSeries = 'all' | 'UNC' | 'UNF';

interface UnifiedThreadRow {
  nominalSize: string;
  designation: string;
  series: 'UNC' | 'UNF';
  majorIn: number;
  majorMm: number;
  tpi: number;
  pitchIn: number;
  pitchMm: number;
  tapDrillCode: string;
  tapDrillIn: string;
}

// Verified verbatim against ASME B1.1 / Unified Thread Standard reference data
const UNIFIED_THREADS: UnifiedThreadRow[] = [
  { nominalSize: '#0', designation: '#0-80', series: 'UNF', majorIn: 0.0600, majorMm: 1.5240, tpi: 80, pitchIn: 0.012500, pitchMm: 0.3175, tapDrillCode: '3/64"', tapDrillIn: '.047' },
  { nominalSize: '#1', designation: '#1-64', series: 'UNC', majorIn: 0.0730, majorMm: 1.8542, tpi: 64, pitchIn: 0.015625, pitchMm: 0.3969, tapDrillCode: '#53', tapDrillIn: '.060' },
  { nominalSize: '#1', designation: '#1-72', series: 'UNF', majorIn: 0.0730, majorMm: 1.8542, tpi: 72, pitchIn: 0.013889, pitchMm: 0.3528, tapDrillCode: '#53', tapDrillIn: '.060' },
  { nominalSize: '#2', designation: '#2-56', series: 'UNC', majorIn: 0.0860, majorMm: 2.1844, tpi: 56, pitchIn: 0.017857, pitchMm: 0.4536, tapDrillCode: '#50', tapDrillIn: '.070' },
  { nominalSize: '#2', designation: '#2-64', series: 'UNF', majorIn: 0.0860, majorMm: 2.1844, tpi: 64, pitchIn: 0.015625, pitchMm: 0.3969, tapDrillCode: '#50', tapDrillIn: '.070' },
  { nominalSize: '#3', designation: '#3-48', series: 'UNC', majorIn: 0.0990, majorMm: 2.5146, tpi: 48, pitchIn: 0.020833, pitchMm: 0.5292, tapDrillCode: '#47', tapDrillIn: '.079' },
  { nominalSize: '#3', designation: '#3-56', series: 'UNF', majorIn: 0.0990, majorMm: 2.5146, tpi: 56, pitchIn: 0.017857, pitchMm: 0.4536, tapDrillCode: '#45', tapDrillIn: '.082' },
  { nominalSize: '#4', designation: '#4-40', series: 'UNC', majorIn: 0.1120, majorMm: 2.8448, tpi: 40, pitchIn: 0.025000, pitchMm: 0.6350, tapDrillCode: '#43', tapDrillIn: '.089' },
  { nominalSize: '#4', designation: '#4-48', series: 'UNF', majorIn: 0.1120, majorMm: 2.8448, tpi: 48, pitchIn: 0.020833, pitchMm: 0.5292, tapDrillCode: '#42', tapDrillIn: '.094' },
  { nominalSize: '#5', designation: '#5-40', series: 'UNC', majorIn: 0.1250, majorMm: 3.1750, tpi: 40, pitchIn: 0.025000, pitchMm: 0.6350, tapDrillCode: '#38', tapDrillIn: '.102' },
  { nominalSize: '#5', designation: '#5-44', series: 'UNF', majorIn: 0.1250, majorMm: 3.1750, tpi: 44, pitchIn: 0.022727, pitchMm: 0.5773, tapDrillCode: '#37', tapDrillIn: '.104' },
  { nominalSize: '#6', designation: '#6-32', series: 'UNC', majorIn: 0.1380, majorMm: 3.5052, tpi: 32, pitchIn: 0.031250, pitchMm: 0.7938, tapDrillCode: '#36', tapDrillIn: '.107' },
  { nominalSize: '#6', designation: '#6-40', series: 'UNF', majorIn: 0.1380, majorMm: 3.5052, tpi: 40, pitchIn: 0.025000, pitchMm: 0.6350, tapDrillCode: '#33', tapDrillIn: '.113' },
  { nominalSize: '#8', designation: '#8-32', series: 'UNC', majorIn: 0.1640, majorMm: 4.1656, tpi: 32, pitchIn: 0.031250, pitchMm: 0.7938, tapDrillCode: '#29', tapDrillIn: '.136' },
  { nominalSize: '#8', designation: '#8-36', series: 'UNF', majorIn: 0.1640, majorMm: 4.1656, tpi: 36, pitchIn: 0.027778, pitchMm: 0.7056, tapDrillCode: '#29', tapDrillIn: '.136' },
  { nominalSize: '#10', designation: '#10-24', series: 'UNC', majorIn: 0.1900, majorMm: 4.8260, tpi: 24, pitchIn: 0.041667, pitchMm: 1.0583, tapDrillCode: '#25', tapDrillIn: '.150' },
  { nominalSize: '#10', designation: '#10-32', series: 'UNF', majorIn: 0.1900, majorMm: 4.8260, tpi: 32, pitchIn: 0.031250, pitchMm: 0.7938, tapDrillCode: '#21', tapDrillIn: '.159' },
  { nominalSize: '#12', designation: '#12-24', series: 'UNC', majorIn: 0.2160, majorMm: 5.4864, tpi: 24, pitchIn: 0.041667, pitchMm: 1.0583, tapDrillCode: '#16', tapDrillIn: '.177' },
  { nominalSize: '#12', designation: '#12-28', series: 'UNF', majorIn: 0.2160, majorMm: 5.4864, tpi: 28, pitchIn: 0.035714, pitchMm: 0.9071, tapDrillCode: '#14', tapDrillIn: '.182' },
  { nominalSize: '1/4', designation: '1/4-20', series: 'UNC', majorIn: 0.2500, majorMm: 6.3500, tpi: 20, pitchIn: 0.050000, pitchMm: 1.2700, tapDrillCode: '#7', tapDrillIn: '.201' },
  { nominalSize: '1/4', designation: '1/4-28', series: 'UNF', majorIn: 0.2500, majorMm: 6.3500, tpi: 28, pitchIn: 0.035714, pitchMm: 0.9071, tapDrillCode: '#3', tapDrillIn: '.213' },
  { nominalSize: '5/16', designation: '5/16-18', series: 'UNC', majorIn: 0.3125, majorMm: 7.9375, tpi: 18, pitchIn: 0.055556, pitchMm: 1.4111, tapDrillCode: 'F', tapDrillIn: '.257' },
  { nominalSize: '5/16', designation: '5/16-24', series: 'UNF', majorIn: 0.3125, majorMm: 7.9375, tpi: 24, pitchIn: 0.041667, pitchMm: 1.0583, tapDrillCode: 'I', tapDrillIn: '.272' },
  { nominalSize: '3/8', designation: '3/8-16', series: 'UNC', majorIn: 0.3750, majorMm: 9.5250, tpi: 16, pitchIn: 0.062500, pitchMm: 1.5875, tapDrillCode: '5/16"', tapDrillIn: '.313' },
  { nominalSize: '3/8', designation: '3/8-24', series: 'UNF', majorIn: 0.3750, majorMm: 9.5250, tpi: 24, pitchIn: 0.041667, pitchMm: 1.0583, tapDrillCode: 'Q', tapDrillIn: '.332' },
  { nominalSize: '7/16', designation: '7/16-14', series: 'UNC', majorIn: 0.4375, majorMm: 11.1125, tpi: 14, pitchIn: 0.071429, pitchMm: 1.8143, tapDrillCode: 'U', tapDrillIn: '.368' },
  { nominalSize: '7/16', designation: '7/16-20', series: 'UNF', majorIn: 0.4375, majorMm: 11.1125, tpi: 20, pitchIn: 0.050000, pitchMm: 1.2700, tapDrillCode: '25/64"', tapDrillIn: '.391' },
  { nominalSize: '1/2', designation: '1/2-13', series: 'UNC', majorIn: 0.5000, majorMm: 12.7000, tpi: 13, pitchIn: 0.076923, pitchMm: 1.9538, tapDrillCode: '27/64"', tapDrillIn: '.422' },
  { nominalSize: '1/2', designation: '1/2-20', series: 'UNF', majorIn: 0.5000, majorMm: 12.7000, tpi: 20, pitchIn: 0.050000, pitchMm: 1.2700, tapDrillCode: '29/64"', tapDrillIn: '.453' },
  { nominalSize: '9/16', designation: '9/16-12', series: 'UNC', majorIn: 0.5625, majorMm: 14.2875, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '31/64"', tapDrillIn: '.484' },
  { nominalSize: '9/16', designation: '9/16-18', series: 'UNF', majorIn: 0.5625, majorMm: 14.2875, tpi: 18, pitchIn: 0.055556, pitchMm: 1.4111, tapDrillCode: '1/2"', tapDrillIn: '.500' },
  { nominalSize: '5/8', designation: '5/8-11', series: 'UNC', majorIn: 0.6250, majorMm: 15.8750, tpi: 11, pitchIn: 0.090909, pitchMm: 2.3091, tapDrillCode: '17/32"', tapDrillIn: '.531' },
  { nominalSize: '5/8', designation: '5/8-18', series: 'UNF', majorIn: 0.6250, majorMm: 15.8750, tpi: 18, pitchIn: 0.055556, pitchMm: 1.4111, tapDrillCode: '9/16"', tapDrillIn: '.563' },
  { nominalSize: '3/4', designation: '3/4-10', series: 'UNC', majorIn: 0.7500, majorMm: 19.0500, tpi: 10, pitchIn: 0.100000, pitchMm: 2.5400, tapDrillCode: '21/32"', tapDrillIn: '.656' },
  { nominalSize: '3/4', designation: '3/4-16', series: 'UNF', majorIn: 0.7500, majorMm: 19.0500, tpi: 16, pitchIn: 0.062500, pitchMm: 1.5875, tapDrillCode: '11/16"', tapDrillIn: '.688' },
  { nominalSize: '7/8', designation: '7/8-9', series: 'UNC', majorIn: 0.8750, majorMm: 22.2250, tpi: 9, pitchIn: 0.111111, pitchMm: 2.8222, tapDrillCode: '49/64"', tapDrillIn: '.766' },
  { nominalSize: '7/8', designation: '7/8-14', series: 'UNF', majorIn: 0.8750, majorMm: 22.2250, tpi: 14, pitchIn: 0.071429, pitchMm: 1.8143, tapDrillCode: '51/64"', tapDrillIn: '.797' },
  { nominalSize: '1"', designation: '1-8', series: 'UNC', majorIn: 1.0000, majorMm: 25.4000, tpi: 8, pitchIn: 0.125000, pitchMm: 3.1750, tapDrillCode: '7/8"', tapDrillIn: '.875' },
  { nominalSize: '1"', designation: '1-12', series: 'UNF', majorIn: 1.0000, majorMm: 25.4000, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '59/64"', tapDrillIn: '.922' },
  { nominalSize: '1-1/8', designation: '1-1/8-7', series: 'UNC', majorIn: 1.1250, majorMm: 28.5750, tpi: 7, pitchIn: 0.142857, pitchMm: 3.6286, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-1/8', designation: '1-1/8-12', series: 'UNF', majorIn: 1.1250, majorMm: 28.5750, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-1/4', designation: '1-1/4-7', series: 'UNC', majorIn: 1.2500, majorMm: 31.7500, tpi: 7, pitchIn: 0.142857, pitchMm: 3.6286, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-1/4', designation: '1-1/4-12', series: 'UNF', majorIn: 1.2500, majorMm: 31.7500, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-3/8', designation: '1-3/8-6', series: 'UNC', majorIn: 1.3750, majorMm: 34.9250, tpi: 6, pitchIn: 0.166667, pitchMm: 4.2333, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-3/8', designation: '1-3/8-12', series: 'UNF', majorIn: 1.3750, majorMm: 34.9250, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-1/2', designation: '1-1/2-6', series: 'UNC', majorIn: 1.5000, majorMm: 38.1000, tpi: 6, pitchIn: 0.166667, pitchMm: 4.2333, tapDrillCode: '—', tapDrillIn: '—' },
  { nominalSize: '1-1/2', designation: '1-1/2-12', series: 'UNF', majorIn: 1.5000, majorMm: 38.1000, tpi: 12, pitchIn: 0.083333, pitchMm: 2.1167, tapDrillCode: '—', tapDrillIn: '—' },
];

export default function ImperialThreadReferenceClient() {
  const [searchStr, setSearchStr] = useState('');
  const [series, setSeries] = useState<ThreadSeries>('all');
  const [copied, setCopied] = useState(false);

  const q = searchStr.trim().toLowerCase();
  const filtered = UNIFIED_THREADS.filter(row => {
    if (series !== 'all' && row.series !== series) return false;
    if (!q) return true;
    return (
      row.designation.toLowerCase().includes(q) ||
      row.nominalSize.toLowerCase().includes(q) ||
      row.tapDrillCode.toLowerCase().includes(q) ||
      row.series.toLowerCase().includes(q)
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
      'ASME B1.1 UNC / UNF Imperial Thread Reference',
      ...filtered.slice(0, 15).map(
        r => `${r.designation} (${r.series}) | Major: ${r.majorIn.toFixed(4)} in (${r.majorMm.toFixed(3)} mm) | TPI: ${r.tpi} | Tap Drill: ${r.tapDrillCode} (${r.tapDrillIn} in)`
      ),
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
      ['designation', 'series', 'major_in', 'major_mm', 'tpi', 'pitch_in', 'pitch_mm', 'tap_drill_code', 'tap_drill_in'],
      ...filtered.map(r => [
        r.designation,
        r.series,
        r.majorIn.toFixed(4),
        r.majorMm.toFixed(4),
        String(r.tpi),
        r.pitchIn.toFixed(6),
        r.pitchMm.toFixed(4),
        r.tapDrillCode === '—' ? '' : r.tapDrillCode.replace(/"/g, 'in'),
        r.tapDrillIn === '—' ? '' : r.tapDrillIn,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imperial-unc-unf-threads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">ASME B1.1 Thread Lookup</h2>
              <p className="text-sm text-slate-500 font-medium">Filter #0 through 1-1/2&quot; UNC coarse and UNF fine sizes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-1-4-20"
              onClick={() => {
                setSeries('UNC');
                setSearchStr('1/4-20');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-200"
            >
              1/4-20 UNC
            </button>
            <button
              type="button"
              data-testid="preset-12-28"
              onClick={() => {
                setSeries('UNF');
                setSearchStr('#12-28');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-200"
            >
              #12-28 UNF
            </button>
            <button
              type="button"
              data-testid="preset-0-80"
              onClick={() => {
                setSeries('all');
                setSearchStr('#0-80');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-200"
            >
              #0-80 UNF
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
              placeholder="Search designation or drill (e.g. 1/4-20, #10-32, #0-80, 7/8)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'UNC', 'UNF'] as ThreadSeries[]).map(s => (
              <button
                key={s}
                type="button"
                data-testid={`filter-${s.toLowerCase()}`}
                onClick={() => setSeries(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                  series === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Matching Sizes</div>
            <div className="text-2xl font-black text-amber-900">
              <span data-testid="result-count">{filtered.length}</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Top Match</div>
            <div className="text-xl font-black text-slate-900">
              <span data-testid="result-top-designation">{featured ? featured.designation : '—'}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Tap Drill (~75%)</div>
            <div className="text-xl font-black text-blue-900">
              <span data-testid="result-top-drill">{featured ? featured.tapDrillCode : '—'}</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Major Diameter</div>
            <div className="text-xl font-black text-emerald-900">
              <span data-testid="result-top-major-mm">{featured ? featured.majorMm.toFixed(4) : '—'}</span>{' '}
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
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1.5"
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
                <th className="px-4 py-3 text-right">Major (in)</th>
                <th className="px-4 py-3 text-right">Major (mm)</th>
                <th className="px-4 py-3 text-right">TPI</th>
                <th className="px-4 py-3 text-right">Pitch (mm)</th>
                <th className="px-4 py-3 text-right">Tap Drill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.designation} className="hover:bg-amber-50/40">
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{r.designation}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-600">{r.series}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.majorIn.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.majorMm.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{r.tpi}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{r.pitchMm.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-amber-800">
                    {r.tapDrillCode === '—' ? '—' : `${r.tapDrillCode} (${r.tapDrillIn} in)`}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No matching UNC or UNF thread sizes found.
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
