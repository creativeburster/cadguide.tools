'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

const STANDARD_GRAVITY = 9.80665;
const SUBCRITICAL_SAFE_RATIO = 0.75;

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(2);
  if (Math.abs(n) >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

const DEFAULT_INPUTS = ['100000', '5'];

export default function ShaftCriticalSpeedCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const k = parseFinite(inputs[0]);
    const m = parseFinite(inputs[1]);

    if (k === null || m === null) {
      return { valid: false as const, error: 'Enter positive numeric values for stiffness k and effective mass m.' };
    }
    if (k <= 0 || m <= 0) {
      return { valid: false as const, error: 'Stiffness k and mass m must both be greater than 0.' };
    }

    const wn = Math.sqrt(k / m);
    const fn = wn / (2 * Math.PI);
    const Nc = fn * 60;
    const deltaStMm = ((m * STANDARD_GRAVITY) / k) * 1000;
    const safeRpm = SUBCRITICAL_SAFE_RATIO * Nc;

    return { valid: true as const, k, m, wn, fn, Nc, deltaStMm, safeRpm };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Shaft First Lateral Critical Speed Report (SDOF Jeffcott Model)',
      '# Formula: omega_n = sqrt(k / m), f_n = omega_n / (2 * pi), N_c = 60 * f_n',
      'Parameter,Value,Unit',
      `Transverse Shaft Stiffness k,${result.k},N/m`,
      `Effective Rotor Mass m,${result.m},kg`,
      `Critical Speed Nc,${result.Nc.toFixed(6)},RPM`,
      `Natural Frequency fn,${result.fn.toFixed(6)},Hz`,
      `Angular Natural Frequency omega_n,${result.wn.toFixed(6)},rad/s`,
      `Static Deflection delta_st (g=9.80665 m/s^2),${result.deltaStMm.toFixed(6)},mm`,
      `Reference 0.75x Subcritical Speed Limit,${result.safeRpm.toFixed(6)},RPM`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shaft-critical-speed-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Lateral Stiffness k (N/m)</label>
            <input
              type="text"
              data-testid="input-k"
              value={inputs[0]}
              onChange={e => updateInput(0, e.target.value)}
              placeholder="100000"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Effective Rotor Mass m (kg)</label>
            <input
              type="text"
              data-testid="input-m"
              value={inputs[1]}
              onChange={e => updateInput(1, e.target.value)}
              placeholder="5"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
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

            {!result.valid && (
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Critical Speed (Nc)</div>
                <div data-testid="output-nc" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.Nc) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">RPM</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Natural Frequency (fn)</div>
                <div data-testid="output-fn" className="text-3xl font-black text-green-800">
                  {result.valid ? formatNum(result.fn) : '—'}
                  {result.valid && <span className="text-lg text-green-600 ml-1">Hz</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Static Deflection (delta_st)</div>
                <div data-testid="output-deflection" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.deltaStMm) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Ref. Subcritical Limit (0.75 &times; Nc)</div>
                <div data-testid="output-safe-rpm" className="text-2xl font-black text-amber-800">
                  {result.valid ? formatNum(result.safeRpm) : '—'}
                  {result.valid && <span className="text-base text-amber-600 ml-1">RPM</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Single-DOF undamped Jeffcott model: omega_n = sqrt(k / m), fn = omega_n / (2 &middot; pi), Nc = 60 &middot; fn. 0.75 &times; Nc is a general reference subcritical separation margin (verify damping and bearing flexibility per application).
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
