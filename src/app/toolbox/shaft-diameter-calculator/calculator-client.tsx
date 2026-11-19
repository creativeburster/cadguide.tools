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

const DEFAULT_INPUTS = ['500', '40', '0.75'];

export default function ShaftDiameterCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const T = parseFinite(inputs[0]);
    const tauMpa = parseFinite(inputs[1]);
    const kw = parseFinite(inputs[2]);

    if (T === null || tauMpa === null || kw === null) {
      return { valid: false as const, error: 'Enter valid numbers for torque, allowable shear stress, and keyway factor.' };
    }
    if (T < 0 || tauMpa <= 0) {
      return { valid: false as const, error: 'Torque T must be >= 0 and allowable shear stress must be > 0.' };
    }
    if (kw <= 0 || kw > 1) {
      return { valid: false as const, error: 'Keyway allowable stress reduction factor kw must satisfy 0 < kw <= 1.' };
    }

    const tauPa = tauMpa * 1e6;
    const dSolid = Math.cbrt((16 * T) / (Math.PI * tauPa)) * 1000;
    const dKeyed = Math.cbrt((16 * T) / (Math.PI * kw * tauPa)) * 1000;
    const dCeil = Math.ceil(dKeyed);

    return { valid: true as const, T, tauMpa, kw, dSolid, dKeyed, dCeil };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Solid Circular Shaft Minimum Diameter Report (Pure Torsion)',
      '# Formula: d = (16 * T / (pi * kw * tau_allow))^(1/3)',
      'Parameter,Value,Unit',
      `Applied Torque T,${result.T},N*m`,
      `Allowable Shear Stress tau_allow,${result.tauMpa},MPa`,
      `Keyway Stress Reduction Factor kw,${result.kw},-`,
      `Solid Shaft Diameter (Unkeyed),${result.dSolid.toFixed(6)},mm`,
      `Keyed Shaft Diameter (Exact),${result.dKeyed.toFixed(6)},mm`,
      `Keyed Shaft Diameter (Rounded Up),${result.dCeil},mm`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shaft-diameter-report.csv';
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Transmitted Torque T (N&middot;m)</label>
            <input
              type="text"
              data-testid="input-torque"
              value={inputs[0]}
              onChange={e => updateInput(0, e.target.value)}
              placeholder="500"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Allowable Shear Stress (MPa)</label>
            <input
              type="text"
              data-testid="input-tau"
              value={inputs[1]}
              onChange={e => updateInput(1, e.target.value)}
              placeholder="40"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Keyway Allowable Stress Factor kw (0 &lt; kw &le; 1)</label>
            <input
              type="text"
              data-testid="input-kw"
              value={inputs[2]}
              onChange={e => updateInput(2, e.target.value)}
              placeholder="0.75"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Keyed Shaft Min Dia (Exact)</div>
                <div data-testid="output-d-keyed" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.dKeyed) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">Recommended Ceiling Size</div>
                <div data-testid="output-d-ceil" className="text-3xl font-black text-emerald-800">
                  {result.valid ? result.dCeil : '—'}
                  {result.valid && <span className="text-lg text-emerald-600 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Solid Shaft (kw = 1.0)</div>
                <div data-testid="output-d-solid" className="text-3xl font-black text-slate-800">
                  {result.valid ? formatNum(result.dSolid) : '—'}
                  {result.valid && <span className="text-lg text-slate-500 ml-1">mm</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  From pure circular shaft torsion tau = 16 &middot; T / (pi &middot; d&sup3;) (Engineering ToolBox: Torsion of Shafts), reduced allowable stress kw &middot; tau_allow yields d_keyed = (16 &middot; T / (pi &middot; kw &middot; tau_allow))^(1/3).
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
