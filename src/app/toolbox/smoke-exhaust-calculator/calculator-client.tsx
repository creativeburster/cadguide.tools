'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, RotateCcw, Download } from 'lucide-react';

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const Q_PRESETS = [
  { label: '2.0 MW', val: '2.0' },
  { label: '2.5 MW', val: '2.5' },
  { label: '5.0 MW', val: '5.0' },
];

const DEFAULT_INPUTS = ['2.5', '0.70', '3.0', '1.05', '2'];

export default function SmokeExhaustCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const qMw = parseFinite(inputs[0]);
    const chiC = parseFinite(inputs[1]);
    const z = parseFinite(inputs[2]);
    const rho = parseFinite(inputs[3]);
    const fansRaw = parseFinite(inputs[4]);

    if (qMw === null || chiC === null || z === null || rho === null || fansRaw === null) {
      return { valid: false as const, error: 'Enter numeric values for all fire, plume, and fan parameters.' };
    }
    if (qMw <= 0 || chiC <= 0 || chiC > 1 || z <= 0 || rho <= 0) {
      return { valid: false as const, error: 'Ensure Q > 0, z > 0, rho > 0, and convective fraction chi_c in (0, 1].' };
    }
    const fans = Math.round(fansRaw);
    if (!Number.isInteger(fansRaw) || fans < 1) {
      return { valid: false as const, error: 'Number of exhaust fans must be an integer >= 1.' };
    }

    const qConvKw = qMw * 1000 * chiC;
    const massRate = 0.071 * Math.pow(qConvKw, 1 / 3) * Math.pow(z, 5 / 3) + 0.0018 * qConvKw;
    const volM3s = massRate / rho;
    const volM3h = volM3s * 3600;
    const perFanM3h = volM3h / fans;

    return { valid: true as const, qMw, chiC, z, rho, fans, qConvKw, massRate, volM3s, volM3h, perFanM3h };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Axisymmetric Plume Smoke Exhaust Rate Estimation Report',
      '# Formula: m = 0.071 * Qc^(1/3) * z^(5/3) + 0.0018 * Qc ; V = m / rho',
      'Parameter,Value,Unit',
      `Total Heat Release Rate Q,${result.qMw},MW`,
      `Convective Heat Fraction chi_c,${result.chiC},-`,
      `Convective Heat Release Rate Qc,${result.qConvKw.toFixed(3)},kW`,
      `Clear Height Below Smoke Base z,${result.z},m`,
      `Smoke Layer Density rho,${result.rho},kg/m3`,
      `Operating Exhaust Fans,${result.fans},units`,
      `Plume Mass Generation Rate m,${result.massRate.toFixed(6)},kg/s`,
      `Total Volumetric Exhaust V_s,${result.volM3s.toFixed(6)},m3/s`,
      `Total Volumetric Exhaust V_h,${result.volM3h.toFixed(3)},m3/h`,
      `Exhaust Capacity per Fan,${result.perFanM3h.toFixed(3)},m3/h`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smoke-exhaust-rate-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
                <p className="text-xs text-slate-500 font-medium">Axisymmetric Plume Correlation</p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Total Heat Release Rate Q (MW)</label>
            <div className="flex gap-1.5 mb-2">
              {Q_PRESETS.map(p => (
                <button
                  key={p.val}
                  type="button"
                  data-testid={`preset-q-${p.val}`}
                  onClick={() => updateInput(0, p.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    inputs[0] === p.val
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input type="text" data-testid="input-q" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Convective Ratio &chi;c</label>
              <input type="text" data-testid="input-chi" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Clear Height z (m)</label>
              <input type="text" data-testid="input-z" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Smoke &rho; (kg/m&sup3;)</label>
              <input type="text" data-testid="input-rho" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Exhaust Fans</label>
              <input type="text" data-testid="input-fans" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>
              <div className="flex items-center gap-2">
                {result.valid && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Steady Plume Correlation</span>
                  </div>
                )}
                <button
                  type="button"
                  data-testid="export-csv-btn"
                  onClick={downloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Total Required Smoke Exhaust Rate</div>
              <div className="flex items-baseline gap-2">
                <span data-testid="output-vol-h" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.volM3h.toFixed(1) : '—'}
                </span>
                {result.valid && <span className="text-lg font-bold text-blue-600">m&sup3;/h</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Exhaust Rate per Fan</div>
                <div data-testid="output-per-fan" className="text-xl font-black text-slate-900">
                  {result.valid ? result.perFanM3h.toFixed(1) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">m&sup3;/h</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Plume Mass Rate m</div>
                <div data-testid="output-mass" className="text-xl font-black text-slate-900">
                  {result.valid ? result.massRate.toFixed(3) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">kg/s</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Volumetric Rate</div>
                <div data-testid="output-vol-s" className="text-xl font-black text-slate-900">
                  {result.valid ? result.volM3s.toFixed(3) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">m&sup3;/s</span>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Empirical axisymmetric smoke plume correlation (Qc = &chi;c &middot; Q): m = 0.071 &middot; Qc^(1/3) &middot; z^(5/3) + 0.0018 &middot; Qc, V = m / &rho;. Preliminary estimation only, not an engineering code compliance certification.
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
