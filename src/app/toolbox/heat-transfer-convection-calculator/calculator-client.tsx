'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'air-plate', label: 'Air Forced Convection (Nu=100, k=0.026, L=1m)', nu: '100', k: '0.026', l: '1', a: '5', dt: '20' },
  { id: 'water-pipe', label: 'Water Forced Flow (Nu=150, k=0.60, L=0.05m)', nu: '150', k: '0.60', l: '0.05', a: '0.8', dt: '15' },
];

export default function HeatTransferConvectionCalculatorClient() {
  const [nuStr, setNuStr] = useState('100');
  const [kStr, setKStr] = useState('0.026');
  const [lStr, setLStr] = useState('1');
  const [areaStr, setAreaStr] = useState('5');
  const [dtStr, setDtStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setNuStr(p.nu);
    setKStr(p.k);
    setLStr(p.l);
    setAreaStr(p.a);
    setDtStr(p.dt);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const nu = parseStrictPositive(nuStr);
    const k = parseStrictPositive(kStr);
    const L = parseStrictPositive(lStr);
    const A = parseStrictPositive(areaStr);
    const dT = parseStrictNonNegative(dtStr);

    if (!Number.isFinite(nu) || !Number.isFinite(k) || !Number.isFinite(L) || !Number.isFinite(A) || !Number.isFinite(dT)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive Nusselt number, fluid conductivity k, characteristic length L, surface area A, and non-negative temperature difference dT.',
      };
    }

    const h = (nu * k) / L;
    const qFlux = h * dT;
    const qTotal = h * A * dT;
    const rConv = 1 / (h * A);

    return {
      valid: true as const,
      nu,
      k,
      L,
      A,
      dT,
      h,
      qFlux,
      qTotal,
      rConv,
    };
  }, [nuStr, kStr, lStr, areaStr, dtStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Convective Heat Transfer Summary (Newton Law of Cooling)',
      `Nu = ${result.nu}, k_f = ${result.k} W/(m-K), L_c = ${result.L} m, A = ${result.A} m2, dT = ${result.dT} K`,
      `Convection Coefficient h = ${result.h.toFixed(3)} W/(m2-K)`,
      `Total Heat Transfer Rate Q = ${result.qTotal.toFixed(2)} W`,
      `Surface Heat Flux q" = ${result.qFlux.toFixed(2)} W/m2`,
      `Convective Thermal Resistance R_conv = ${result.rConv.toFixed(6)} K/W`,
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
      ['Nusselt Number Nu', String(result.nu), '-'],
      ['Fluid Thermal Conductivity k_f', String(result.k), 'W/(m*K)'],
      ['Characteristic Length L_c', String(result.L), 'm'],
      ['Surface Area A', String(result.A), 'm2'],
      ['Temperature Difference dT', String(result.dT), 'K'],
      ['Convection Coefficient h', result.h.toFixed(4), 'W/(m2*K)'],
      ['Total Heat Transfer Rate Q', result.qTotal.toFixed(4), 'W'],
      ['Surface Heat Flux q"', result.qFlux.toFixed(4), 'W/m2'],
      ['Convective Resistance R_conv', result.rConv.toFixed(6), 'K/W'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heat-transfer-convection.csv';
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Nusselt Number Nu</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-nu"
                value={nuStr}
                onChange={(e) => setNuStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Fluid Conductivity k_f (W/m-K)</label>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Characteristic Length L_c (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-length"
                value={lStr}
                onChange={(e) => setLStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Surface Area A (m2)</label>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Temp Difference |T_s - T_inf| (K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dt"
                value={dtStr}
                onChange={(e) => setDtStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Heat Transfer Coeff (h)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-h">{result.valid ? result.h.toFixed(3) : '—'}</span>
                  <span className="text-lg text-blue-500"> W/m2K</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Total Heat Transfer Rate (Q)</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-q">{result.valid ? result.qTotal.toFixed(2) : '—'}</span>
                  <span className="text-lg text-green-600"> W</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Surface Heat Flux (q&quot;)</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-flux">{result.valid ? result.qFlux.toFixed(2) : '—'}</span>
                  <span className="text-base text-orange-500"> W/m2</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Convective Resistance (R_conv)</div>
                <div className="text-2xl font-black text-purple-800">
                  <span data-testid="result-r-conv">{result.valid ? result.rConv.toFixed(6) : '—'}</span>
                  <span className="text-base text-purple-500"> K/W</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'h = Nu * k_f / L_c | q" = h * dT | Q = h * A * dT | R_conv = 1 / (h * A)'}</span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
