'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default Aluminum Fin (L=50, t=2, w=30)', l: '50', t: '2', w: '30', k: '200', h: '50', dt: '50' },
  { id: 'copper-high-h', label: 'Copper Forced Air (k=385, h=120)', l: '40', t: '1.5', w: '40', k: '385', h: '120', dt: '45' },
  { id: 'steel-tall', label: 'Low-k Tall Fin (k=50, L=80 mm)', l: '80', t: '2', w: '30', k: '50', h: '50', dt: '50' },
];

export default function FinEfficiencyCalculatorClient() {
  const [lStr, setLStr] = useState('50');
  const [tStr, setTStr] = useState('2');
  const [wStr, setWStr] = useState('30');
  const [kStr, setKStr] = useState('200');
  const [hStr, setHStr] = useState('50');
  const [dtStr, setDtStr] = useState('50');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setLStr(p.l);
    setTStr(p.t);
    setWStr(p.w);
    setKStr(p.k);
    setHStr(p.h);
    setDtStr(p.dt);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const L_mm = parseStrictPositive(lStr);
    const t_mm = parseStrictPositive(tStr);
    const w_mm = parseStrictPositive(wStr);
    const k = parseStrictPositive(kStr);
    const h = parseStrictPositive(hStr);
    const dT = parseStrictPositive(dtStr);

    if (
      !Number.isFinite(L_mm) ||
      !Number.isFinite(t_mm) ||
      !Number.isFinite(w_mm) ||
      !Number.isFinite(k) ||
      !Number.isFinite(h) ||
      !Number.isFinite(dT)
    ) {
      return { valid: false as const };
    }

    const L = L_mm / 1000;
    const t = t_mm / 1000;
    const w = w_mm / 1000;

    // Straight rectangular fin with corrected length (adiabatic tip approximation):
    // Lc = L + t/2, P = 2*(w + t), Ac = w*t, Af = P*Lc
    // m = sqrt(h*P / (k*Ac)), eta_f = tanh(m*Lc) / (m*Lc), q_f = eta_f * h * Af * dT, eps_f = q_f / (h * Ac * dT)
    const Lc = L + t / 2;
    const P = 2 * (w + t);
    const Ac = w * t;
    const Af = P * Lc;
    const m = Math.sqrt((h * P) / (k * Ac));
    const mLc = m * Lc;
    const eta = Math.tanh(mLc) / mLc;
    const etaPct = eta * 100;
    const heatW = eta * h * Af * dT;
    const effectiveness = heatW / (h * Ac * dT);
    const thermalResistanceKW = dT / heatW;

    return {
      valid: true as const,
      L_mm,
      t_mm,
      w_mm,
      k,
      h,
      dT,
      Lc_mm: Lc * 1000,
      m,
      etaPct,
      heatW,
      effectiveness,
      thermalResistanceKW,
    };
  }, [lStr, tStr, wStr, kStr, hStr, dtStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Straight Rectangular Fin Thermal Performance`,
      `L=${result.L_mm} mm (Lc=${result.Lc_mm.toFixed(2)} mm), t=${result.t_mm} mm, w=${result.w_mm} mm, k=${result.k} W/(m*K), h=${result.h} W/(m2*K), dT=${result.dT} K`,
      `Fin Parameter m = ${result.m.toFixed(4)} 1/m`,
      `Fin Efficiency eta_f = ${result.etaPct.toFixed(2)} %`,
      `Fin Effectiveness eps_f = ${result.effectiveness.toFixed(2)}`,
      `Single Fin Heat Dissipation q_f = ${result.heatW.toFixed(3)} W`,
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
      ['Fin Length L', String(result.L_mm), 'mm'],
      ['Fin Thickness t', String(result.t_mm), 'mm'],
      ['Fin Width w', String(result.w_mm), 'mm'],
      ['Corrected Length Lc', result.Lc_mm.toFixed(2), 'mm'],
      ['Thermal Conductivity k', String(result.k), 'W/(m*K)'],
      ['Convection Coefficient h', String(result.h), 'W/(m2*K)'],
      ['Base Excess Temp dT', String(result.dT), 'K'],
      ['Fin Parameter m', result.m.toFixed(4), '1/m'],
      ['Fin Efficiency eta_f', result.etaPct.toFixed(2), '%'],
      ['Fin Effectiveness eps_f', result.effectiveness.toFixed(2), '-'],
      ['Single Fin Heat Dissipation q_f', result.heatW.toFixed(3), 'W'],
      ['Fin Thermal Resistance', result.thermalResistanceKW.toFixed(3), 'K/W'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fin-efficiency-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Enter strictly positive values (&gt; 0) for fin dimensions, conductivity k, convection coefficient h, and base excess temperature dT.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'length', label: 'Fin Length L (mm)', val: lStr, set: setLStr },
            { id: 'thickness', label: 'Fin Thickness t (mm)', val: tStr, set: setTStr },
            { id: 'width', label: 'Fin Width w (mm)', val: wStr, set: setWStr },
            { id: 'k', label: 'Thermal Conductivity k (W/m·K)', val: kStr, set: setKStr },
            { id: 'h', label: 'Convection Coeff h (W/m2·K)', val: hStr, set: setHStr },
            { id: 'dt', label: 'Base Excess Temp dT_b (K)', val: dtStr, set: setDtStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Fin Efficiency (eta_f)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-efficiency">{result.valid ? result.etaPct.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">%</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Fin Effectiveness (eps_f)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-effectiveness">{result.valid ? result.effectiveness.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">ratio</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Heat Dissipated (q_f)</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-heat">{result.valid ? result.heatW.toFixed(3) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">W</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Fin Parameter m</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-m">{result.valid ? result.m.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">1/m</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                1D straight rectangular fin with corrected length Lc = L + t/2: P = 2*(w+t), Ac = w*t, Af = P*Lc, m = sqrt(h*P/(k*Ac)), eta_f = tanh(m*Lc)/(m*Lc), q_f = eta_f*h*Af*dT_b, eps_f = q_f/(h*Ac*dT_b).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
