'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

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

const DEFAULT_INPUTS = ['200', '2', '0.3', '20', '0.56'];

export default function SettlementCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const q = parseFinite(inputs[0]);
    const B = parseFinite(inputs[1]);
    const v = parseFinite(inputs[2]);
    const E = parseFinite(inputs[3]);
    const Iw = parseFinite(inputs[4]);

    if (q === null || B === null || v === null || E === null || Iw === null) {
      return { valid: false as const, error: 'Enter numeric values in all fields to calculate settlement.' };
    }
    if (q < 0 || B <= 0 || E <= 0 || Iw <= 0) {
      return { valid: false as const, error: 'Width B, Youngs modulus E, and influence factor Iw must be positive; q must be >= 0.' };
    }
    if (v < 0 || v >= 0.5) {
      return { valid: false as const, error: 'Poisson ratio v must satisfy 0 <= v < 0.5 for linear elastic soil.' };
    }

    const qPa = q * 1000;
    const EPa = E * 1e6;
    const S = ((qPa * B * (1 - v * v) * Iw) / EPa) * 1000;
    const ratioPct = (S / (B * 1000)) * 100;

    return { valid: true as const, q, B, v, E, Iw, S, ratioPct };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Elastic Foundation Immediate Settlement Report',
      '# Formula: S = q * B * (1 - v^2) * Iw / E',
      'Parameter,Value,Unit',
      `Bearing Pressure q,${result.q},kPa`,
      `Footing Width B,${result.B},m`,
      `Poisson Ratio v,${result.v},-`,
      `Young Modulus E,${result.E},MPa`,
      `Influence Factor Iw,${result.Iw},-`,
      `Immediate Settlement S,${result.S.toFixed(6)},mm`,
      `Settlement-to-Width Ratio S/B,${result.ratioPct.toFixed(6)},%`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foundation-settlement-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Bearing Pressure q (kPa)</label>
            <input
              type="text"
              data-testid="input-q"
              value={inputs[0]}
              onChange={e => updateInput(0, e.target.value)}
              placeholder="200"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Foundation Width B (m)</label>
            <input
              type="text"
              data-testid="input-b"
              value={inputs[1]}
              onChange={e => updateInput(1, e.target.value)}
              placeholder="2"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Poisson Ratio v (0 to &lt; 0.5)</label>
            <input
              type="text"
              data-testid="input-v"
              value={inputs[2]}
              onChange={e => updateInput(2, e.target.value)}
              placeholder="0.3"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Elastic Modulus E (MPa)</label>
            <input
              type="text"
              data-testid="input-e"
              value={inputs[3]}
              onChange={e => updateInput(3, e.target.value)}
              placeholder="20"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shape / Rigidity Influence Factor Iw</label>
            <input
              type="text"
              data-testid="input-iw"
              value={inputs[4]}
              onChange={e => updateInput(4, e.target.value)}
              placeholder="0.56"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Immediate Elastic Settlement</div>
                <div data-testid="output-settlement" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.S) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Settlement / Width Ratio (S/B)</div>
                <div data-testid="output-ratio" className="text-3xl font-black text-slate-800">
                  {result.valid ? formatNum(result.ratioPct) : '—'}
                  {result.valid && <span className="text-lg text-slate-500 ml-1">%</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Boussinesq elastic half-space immediate settlement: S = q &middot; B &middot; (1 &minus; v&sup2;) &middot; Iw / E. Enter Iw for your specific footing shape, corner/center location, and rigidity.
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
