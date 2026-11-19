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

const DEFAULT_INPUTS = ['1250', '400', '5.5', '500'];

export default function ShortCircuitCurrentCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const kva = parseFinite(inputs[0]);
    const v = parseFinite(inputs[1]);
    const z = parseFinite(inputs[2]);
    const mva = parseFinite(inputs[3]);

    if (kva === null || v === null || z === null || mva === null) {
      return { valid: false as const, error: 'Enter numeric values for transformer rating, voltage, %Z, and utility fault MVA.' };
    }
    if (kva <= 0 || v <= 0 || z <= 0 || mva <= 0) {
      return { valid: false as const, error: 'All electrical ratings (kVA, Voltage, %Z, Grid MVA) must be greater than 0.' };
    }

    const iRated = (kva * 1000) / (Math.sqrt(3) * v);
    const iscInfiniteKa = (iRated / (z / 100)) / 1000;
    const zXfmrMva = (kva / 1000) / (z / 100);
    const scMva = 1 / (1 / mva + 1 / zXfmrMva);
    const iscActualKa = ((scMva * 1e6) / (Math.sqrt(3) * v)) / 1000;

    return {
      valid: true as const,
      kva,
      v,
      z,
      mva,
      iRated,
      iscInfiniteKa,
      zXfmrMva,
      scMva,
      iscActualKa,
    };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Simplified Three-Phase Symmetrical Short-Circuit Current Report (MVA Method)',
      '# Formula: MVA_xfmr = (kVA/1000)/(%Z/100), MVA_sc = 1/(1/MVA_grid + 1/MVA_xfmr), I_sc = MVA_sc*1e6/(sqrt(3)*V)',
      'Parameter,Value,Unit',
      `Transformer Apparent Power,${result.kva},kVA`,
      `Secondary Line-to-Line Voltage,${result.v},V`,
      `Transformer Percent Impedance %Z,${result.z},%`,
      `Upstream Utility Grid Fault Level,${result.mva},MVA`,
      `Transformer Secondary Fault MVA,${result.zXfmrMva.toFixed(6)},MVA`,
      `Combined Short-Circuit MVA,${result.scMva.toFixed(6)},MVA`,
      `Symmetrical Short-Circuit Current Isc,${result.iscActualKa.toFixed(6)},kA`,
      `Infinite-Bus Theoretical Max Isc_inf,${result.iscInfiniteKa.toFixed(6)},kA`,
      `Full-Load Rated Current I_fl,${result.iRated.toFixed(3)},A`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'short-circuit-current-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
                <p className="text-xs text-slate-500 font-medium">3-Phase MVA Method</p>
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

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Transformer Apparent Power (kVA)</label>
              <input
                type="text"
                data-testid="input-kva"
                value={inputs[0]}
                onChange={e => updateInput(0, e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Secondary Line-to-Line Voltage (V)</label>
              <input
                type="text"
                data-testid="input-v"
                value={inputs[1]}
                onChange={e => updateInput(1, e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Transformer Percent Impedance (%Z)</label>
              <input
                type="text"
                data-testid="input-z"
                value={inputs[2]}
                onChange={e => updateInput(2, e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Upstream Utility Grid Fault Level (MVA)</label>
              <input
                type="text"
                data-testid="input-mva"
                value={inputs[3]}
                onChange={e => updateInput(3, e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
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
                    <span>3-Phase MVA Impedance Method</span>
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
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                Symmetrical Short-Circuit Current (Isc)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="output-isc" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.iscActualKa.toFixed(3) : '—'}
                </span>
                {result.valid && <span className="text-lg font-bold text-blue-600">kA</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full-Load Rated Current</div>
                <div data-testid="output-ifl" className="text-xl font-black text-slate-900">
                  {result.valid ? result.iRated.toFixed(2) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">A</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Infinite-Bus Max (Isc_inf)</div>
                <div data-testid="output-isc-inf" className="text-xl font-black text-slate-900">
                  {result.valid ? result.iscInfiniteKa.toFixed(3) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">kA</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Short-Circuit Apparent Power</div>
                <div data-testid="output-sc-mva" className="text-xl font-black text-slate-900">
                  {result.valid ? result.scMva.toFixed(3) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">MVA</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Simplified Three-Phase Symmetrical Fault Current (MVA Impedance Method): treats upstream grid and transformer impedances purely by scalar MVA magnitudes (neglecting cable resistance and X/R asymmetry). Not a substitute for formal utility short-circuit compliance studies.
              </span>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
