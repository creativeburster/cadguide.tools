'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Ruler, Search, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type LinearClass = 'f' | 'm' | 'c' | 'v';
type GeoClass = 'H' | 'K' | 'L';

interface LinearRow {
  label: string;
  minExcl: number;
  maxIncl: number;
  f: number | null;
  m: number | null;
  c: number | null;
  v: number | null;
}

interface AngularRow {
  label: string;
  minExcl: number;
  maxIncl: number;
  fm: string;
  c: string;
  v: string;
}

interface GeoRow {
  label: string;
  minExcl: number;
  maxIncl: number;
  H: number;
  K: number;
  L: number;
}

// Verified verbatim against ISO 2768-1 / 2768-2 tables (AmesWeb)
const LINEAR_ROWS: LinearRow[] = [
  { label: '0.5 to 3 mm', minExcl: 0.5, maxIncl: 3, f: 0.05, m: 0.1, c: 0.2, v: null },
  { label: '> 3 to 6 mm', minExcl: 3, maxIncl: 6, f: 0.05, m: 0.1, c: 0.3, v: 0.5 },
  { label: '> 6 to 30 mm', minExcl: 6, maxIncl: 30, f: 0.1, m: 0.2, c: 0.5, v: 1.0 },
  { label: '> 30 to 120 mm', minExcl: 30, maxIncl: 120, f: 0.15, m: 0.3, c: 0.8, v: 1.5 },
  { label: '> 120 to 400 mm', minExcl: 120, maxIncl: 400, f: 0.2, m: 0.5, c: 1.2, v: 2.5 },
  { label: '> 400 to 1000 mm', minExcl: 400, maxIncl: 1000, f: 0.3, m: 0.8, c: 2.0, v: 4.0 },
  { label: '> 1000 to 2000 mm', minExcl: 1000, maxIncl: 2000, f: 0.5, m: 1.2, c: 3.0, v: 6.0 },
  { label: '> 2000 to 4000 mm', minExcl: 2000, maxIncl: 4000, f: null, m: 2.0, c: 4.0, v: 8.0 },
];

const ANGULAR_ROWS: AngularRow[] = [
  { label: 'up to 10 mm', minExcl: 0, maxIncl: 10, fm: '1 deg 00 min', c: '1 deg 30 min', v: '3 deg 00 min' },
  { label: '> 10 to 50 mm', minExcl: 10, maxIncl: 50, fm: '0 deg 30 min', c: '1 deg 00 min', v: '2 deg 00 min' },
  { label: '> 50 to 120 mm', minExcl: 50, maxIncl: 120, fm: '0 deg 20 min', c: '0 deg 30 min', v: '1 deg 00 min' },
  { label: '> 120 to 400 mm', minExcl: 120, maxIncl: 400, fm: '0 deg 10 min', c: '0 deg 15 min', v: '0 deg 30 min' },
  { label: '> 400 mm', minExcl: 400, maxIncl: Infinity, fm: '0 deg 05 min', c: '0 deg 10 min', v: '0 deg 20 min' },
];

const FLATNESS_ROWS: GeoRow[] = [
  { label: 'up to 10 mm', minExcl: 0, maxIncl: 10, H: 0.02, K: 0.05, L: 0.1 },
  { label: '> 10 to 30 mm', minExcl: 10, maxIncl: 30, H: 0.05, K: 0.1, L: 0.2 },
  { label: '> 30 to 100 mm', minExcl: 30, maxIncl: 100, H: 0.1, K: 0.2, L: 0.4 },
  { label: '> 100 to 300 mm', minExcl: 100, maxIncl: 300, H: 0.2, K: 0.4, L: 0.8 },
  { label: '> 300 to 1000 mm', minExcl: 300, maxIncl: 1000, H: 0.3, K: 0.6, L: 1.2 },
  { label: '> 1000 to 3000 mm', minExcl: 1000, maxIncl: 3000, H: 0.4, K: 0.8, L: 1.6 },
];

const PERP_ROWS: GeoRow[] = [
  { label: 'up to 100 mm', minExcl: 0, maxIncl: 100, H: 0.2, K: 0.4, L: 0.6 },
  { label: '> 100 to 300 mm', minExcl: 100, maxIncl: 300, H: 0.3, K: 0.6, L: 1.0 },
  { label: '> 300 to 1000 mm', minExcl: 300, maxIncl: 1000, H: 0.4, K: 0.8, L: 1.5 },
  { label: '> 1000 to 3000 mm', minExcl: 1000, maxIncl: 3000, H: 0.5, K: 1.0, L: 2.0 },
];

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseDim(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function Iso2768ReferenceClient() {
  const [dimStr, setDimStr] = useState('25');
  const [linClass, setLinClass] = useState<LinearClass>('m');
  const [geoClass, setGeoClass] = useState<GeoClass>('K');
  const [searchStr, setSearchStr] = useState('');
  const [copied, setCopied] = useState(false);

  const dim = parseDim(dimStr);
  const dimLinearOk = dim !== null && dim >= 0.5 && dim <= 4000;
  const dimGeoOk = dim !== null && dim > 0 && dim <= 3000;

  const linearMatch =
    dimLinearOk && dim !== null
      ? LINEAR_ROWS.find(r => (r.minExcl === 0.5 ? dim >= 0.5 && dim <= r.maxIncl : dim > r.minExcl && dim <= r.maxIncl)) ?? null
      : null;

  const linearTol = linearMatch ? linearMatch[linClass] : null;
  const flatnessMatch = dimGeoOk && dim !== null ? FLATNESS_ROWS.find(r => dim > r.minExcl && dim <= r.maxIncl) ?? null : null;
  const perpMatch = dimGeoOk && dim !== null ? PERP_ROWS.find(r => dim > r.minExcl && dim <= r.maxIncl) ?? null : null;
  const angMatch = dim !== null && dim > 0 ? ANGULAR_ROWS.find(r => dim > r.minExcl && dim <= r.maxIncl) ?? null : null;

  const angTolText = angMatch ? (linClass === 'f' || linClass === 'm' ? angMatch.fm : angMatch[linClass]) : '—';
  const flatTol = flatnessMatch ? flatnessMatch[geoClass] : null;
  const perpTol = perpMatch ? perpMatch[geoClass] : null;

  const q = searchStr.trim().toLowerCase();
  const visibleLinearRows = LINEAR_ROWS.filter(r => !q || r.label.toLowerCase().includes(q));

  const applyPreset = (d: string, lc: LinearClass, gc: GeoClass) => {
    setDimStr(d);
    setLinClass(lc);
    setGeoClass(gc);
  };

  const handleReset = () => {
    applyPreset('25', 'm', 'K');
    setSearchStr('');
  };

  const handleCopy = async () => {
    if (!dimLinearOk) return;
    const text = [
      `ISO 2768-${linClass}${geoClass} Tolerance Lookup (Nominal: ${dim} mm)`,
      `Linear Deviation: ${linearTol !== null ? `+-${linearTol} mm` : 'N/A for class'}`,
      `Angular Deviation: +- ${angTolText}`,
      `Straightness & Flatness (${geoClass}): ${flatTol !== null ? `${flatTol} mm` : '—'}`,
      `Perpendicularity (${geoClass}): ${perpTol !== null ? `${perpTol} mm` : '—'}`,
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
      ['table', 'range', 'f_or_H', 'm_or_K', 'c_or_L', 'v'],
      ...LINEAR_ROWS.map(r => ['ISO_2768_1_Linear', r.label, String(r.f ?? ''), String(r.m ?? ''), String(r.c ?? ''), String(r.v ?? '')]),
      ...ANGULAR_ROWS.map(r => ['ISO_2768_1_Angular', r.label, r.fm, r.fm, r.c, r.v]),
      ...FLATNESS_ROWS.map(r => ['ISO_2768_2_Flatness', r.label, String(r.H), String(r.K), String(r.L), '']),
      ...PERP_ROWS.map(r => ['ISO_2768_2_Perpendicularity', r.label, String(r.H), String(r.K), String(r.L), '']),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iso-2768-general-tolerances.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Ruler className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Dimension &amp; Class</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-machined-25m"
                onClick={() => applyPreset('25', 'm', 'K')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200"
              >
                General CNC (25 mm, ISO 2768-mK)
              </button>
              <button
                type="button"
                data-testid="preset-precision-5f"
                onClick={() => applyPreset('5', 'f', 'H')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200"
              >
                Fine Instrument (5 mm, ISO 2768-fH)
              </button>
              <button
                type="button"
                data-testid="preset-welded-600c"
                onClick={() => applyPreset('600', 'c', 'L')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200"
              >
                Coarse Weldment (600 mm, ISO 2768-cL)
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Nominal Size (mm, 0.5–4000)</label>
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
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Part 1 Linear / Angular Class</div>
            <div className="grid grid-cols-4 gap-2">
              {(['f', 'm', 'c', 'v'] as LinearClass[]).map(c => (
                <button
                  key={c}
                  type="button"
                  data-testid={`class-${c}`}
                  onClick={() => setLinClass(c)}
                  className={`py-2 rounded-xl text-sm font-black border ${
                    linClass === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Part 2 Geometric Class</div>
            <div className="grid grid-cols-3 gap-2">
              {(['H', 'K', 'L'] as GeoClass[]).map(g => (
                <button
                  key={g}
                  type="button"
                  data-testid={`geo-${g}`}
                  onClick={() => setGeoClass(g)}
                  className={`py-2 rounded-xl text-sm font-black border ${
                    geoClass === g ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Filter Linear Table</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                data-testid="input-search"
                value={searchStr}
                onChange={e => setSearchStr(e.target.value)}
                placeholder="e.g. 30, 400..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
              />
            </div>
          </div>

          {(!dimLinearOk || dim === null) && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Enter a nominal size from 0.5 to 4000 mm (Part 2 geometric tables cover up to 3000 mm).</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export Full ISO 2768 CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Lookup Result: ISO 2768-{linClass}{geoClass}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Linear Tolerance ({linClass})</div>
                <div className="text-3xl font-black text-indigo-900">
                  +/-<span data-testid="result-linear">{linearTol !== null ? String(linearTol) : '—'}</span>{' '}
                  <span className="text-base text-indigo-600">mm</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Angular Tolerance ({linClass})</div>
                <div className="text-2xl font-black text-blue-900 mt-1">
                  +/-<span data-testid="result-angular">{angTolText}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Flatness / Straightness ({geoClass})</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-flatness">{flatTol !== null ? String(flatTol) : '—'}</span>{' '}
                  <span className="text-base text-emerald-600">mm</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Perpendicularity ({geoClass})</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-perp">{perpTol !== null ? String(perpTol) : '—'}</span>{' '}
                  <span className="text-base text-orange-600">mm</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ISO 2768-1 Linear Range</th>
                    <th className="px-4 py-3 text-right">f (Fine)</th>
                    <th className="px-4 py-3 text-right">m (Medium)</th>
                    <th className="px-4 py-3 text-right">c (Coarse)</th>
                    <th className="px-4 py-3 text-right">v (Very Coarse)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleLinearRows.map(r => (
                    <tr key={r.label} className={linearMatch?.label === r.label ? 'bg-indigo-50/70 font-bold' : ''}>
                      <td className="px-4 py-2.5 text-slate-800">{r.label}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.f !== null ? `+/-${r.f}` : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.m !== null ? `+/-${r.m}` : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.c !== null ? `+/-${r.c}` : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.v !== null ? `+/-${r.v}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-black uppercase">
                    <tr>
                      <th className="px-3 py-2.5">ISO 2768-2 Flatness</th>
                      <th className="px-3 py-2.5 text-right">H</th>
                      <th className="px-3 py-2.5 text-right">K</th>
                      <th className="px-3 py-2.5 text-right">L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {FLATNESS_ROWS.map(r => (
                      <tr key={r.label} className={flatnessMatch?.label === r.label ? 'bg-emerald-50/60 font-bold' : ''}>
                        <td className="px-3 py-2">{r.label}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.H}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.K}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.L}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-black uppercase">
                    <tr>
                      <th className="px-3 py-2.5">Perpendicularity</th>
                      <th className="px-3 py-2.5 text-right">H</th>
                      <th className="px-3 py-2.5 text-right">K</th>
                      <th className="px-3 py-2.5 text-right">L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PERP_ROWS.map(r => (
                      <tr key={r.label} className={perpMatch?.label === r.label ? 'bg-orange-50/60 font-bold' : ''}>
                        <td className="px-3 py-2">{r.label}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.H}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.K}</td>
                        <td className="px-3 py-2 text-right font-mono">{r.L}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
