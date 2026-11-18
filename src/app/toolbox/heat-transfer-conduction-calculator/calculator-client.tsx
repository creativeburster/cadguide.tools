'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'masonry', label: 'Masonry Wall (k=0.5, 10 m2, 200mm, 20C/5C)', k: '0.5', a: '10', l: '200', t1: '20', t2: '5' },
  { id: 'steel-plate', label: 'Carbon Steel Plate (k=50, 0.5 m2, 20mm, 120C/40C)', k: '50', a: '0.5', l: '20', t1: '120', t2: '40' },
  { id: 'mineral-wool', label: 'Insulation Slab (k=0.04, 10 m2, 100mm, 22C/-5C)', k: '0.04', a: '10', l: '100', t1: '22', t2: '-5' },
];

export default function HeatTransferConductionCalculatorClient() {
  const [kStr, setKStr] = useState('0.5');
  const [areaStr, setAreaStr] = useState('10');
  const [thickStr, setThickStr] = useState('200');
  const [t1Str, setT1Str] = useState('20');
  const [t2Str, setT2Str] = useState('5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setKStr(p.k);
    setAreaStr(p.a);
    setThickStr(p.l);
    setT1Str(p.t1);
    setT2Str(p.t2);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const k = parseStrictPositive(kStr);
    const A = parseStrictPositive(areaStr);
    const Lmm = parseStrictPositive(thickStr);
    const T1 = parseStrictFinite(t1Str);
    const T2 = parseStrictFinite(t2Str);

    if (!Number.isFinite(k) || !Number.isFinite(A) || !Number.isFinite(Lmm) || !Number.isFinite(T1) || !Number.isFinite(T2)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive thermal conductivity k, area A, thickness L, and finite temperatures T1, T2.',
      };
    }

    const Lm = Lmm / 1000;
    const dT = Math.abs(T1 - T2);
    const Q = (k * A * dT) / Lm;
    const qFlux = Q / A;
    const rAbs = Lm / (k * A);
    const rArea = Lm / k;

    return {
      valid: true as const,
      k,
      A,
      Lmm,
      T1,
      T2,
      dT,
      Q,
      qFlux,
      rAbs,
      rArea,
    };
  }, [kStr, areaStr, thickStr, t1Str, t2Str]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      '1D Steady-State Conduction Summary (Fourier Law)',
      `k = ${result.k} W/(m-K), Area = ${result.A} m2, Thickness = ${result.Lmm} mm, |dT| = ${result.dT.toFixed(2)} K`,
      `Heat Transfer Rate Q = ${result.Q.toFixed(2)} W`,
      `Heat Flux q" = ${result.qFlux.toFixed(2)} W/m2`,
      `Absolute Thermal Resistance R_th = ${result.rAbs.toFixed(6)} K/W`,
      `Unit-Area Thermal Resistance R" = ${result.rArea.toFixed(4)} m2-K/W`,
    ].join('\n');
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
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Thermal Conductivity k', String(result.k), 'W/(m*K)'],
      ['Cross-Sectional Area A', String(result.A), 'm2'],
      ['Slab Thickness L', String(result.Lmm), 'mm'],
      ['Surface 1 Temperature T1', String(result.T1), 'degC'],
      ['Surface 2 Temperature T2', String(result.T2), 'degC'],
      ['Temperature Difference |dT|', result.dT.toFixed(4), 'K'],
      ['Heat Transfer Rate Q', result.Q.toFixed(4), 'W'],
      ['Heat Flux q"', result.qFlux.toFixed(4), 'W/m2'],
      ['Absolute Thermal Resistance R_th', result.rAbs.toFixed(6), 'K/W'],
      ['Unit-Area Thermal Resistance R"', result.rArea.toFixed(6), 'm2*K/W'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heat-transfer-conduction.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Thermal Conductivity k (W/m-K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-k"
                value={kStr}
                onChange={(e) => setKStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Heat Transfer Area A (m2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-area"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Thickness L (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-thickness"
                value={thickStr}
                onChange={(e) => setThickStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Temp T1 (C)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-t1"
                  value={t1Str}
                  onChange={(e) => setT1Str(e.target.value)}
                  className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Temp T2 (C)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-t2"
                  value={t2Str}
                  onChange={(e) => setT2Str(e.target.value)}
                  className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-error" className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm font-bold text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Heat Transfer Rate (Q)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-q">{result.valid ? result.Q.toFixed(2) : '—'}</span>
                  <span className="text-lg text-blue-500"> W</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Absolute Thermal Resistance (R_th)</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-r-abs">{result.valid ? result.rAbs.toFixed(6) : '—'}</span>
                  <span className="text-lg text-green-600"> K/W</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Heat Flux (q&quot;)</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-flux">{result.valid ? result.qFlux.toFixed(2) : '—'}</span>
                  <span className="text-base text-orange-500"> W/m2</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Unit-Area R-Value (L/k)</div>
                <div className="text-2xl font-black text-purple-800">
                  <span data-testid="result-r-area">{result.valid ? result.rArea.toFixed(4) : '—'}</span>
                  <span className="text-base text-purple-500"> m2-K/W</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'Q = k * A * |T1 - T2| / L | q" = Q / A | R_th = L / (k * A) [K/W]'}</span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
