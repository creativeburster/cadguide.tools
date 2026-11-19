'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

const KPA_TO_PSF = 20.88543423315;

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

const DEFAULT_INPUTS = ['1.0', '0.70', '1.0', '1.0', '1.0', '1.0'];

export default function SnowLoadCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const pg = parseFinite(inputs[0]);
    const kf = parseFinite(inputs[1]);
    const Ce = parseFinite(inputs[2]);
    const Ct = parseFinite(inputs[3]);
    const Is = parseFinite(inputs[4]);
    const Cs = parseFinite(inputs[5]);

    if (pg === null || kf === null || Ce === null || Ct === null || Is === null || Cs === null) {
      return { valid: false as const, error: 'Enter numeric values for ground snow load and all multiplicative factors.' };
    }
    if (pg < 0 || kf <= 0 || Ce <= 0 || Ct <= 0 || Is <= 0 || Cs < 0) {
      return { valid: false as const, error: 'Ensure pg >= 0, Cs >= 0, and kf, Ce, Ct, Is > 0.' };
    }

    const pf = kf * Ce * Ct * Is * pg;
    const ps = pf * Cs;
    const psPsf = ps * KPA_TO_PSF;

    return { valid: true as const, pg, kf, Ce, Ct, Is, Cs, pf, ps, psPsf };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Parametric Roof Snow Load Report',
      '# Formula: pf = kf * Ce * Ct * Is * pg ; ps = pf * Cs',
      'Parameter,Value,Unit',
      `Ground Snow Load pg,${result.pg},kPa`,
      `Flat Roof Factor kf,${result.kf},-`,
      `Exposure Factor Ce,${result.Ce},-`,
      `Thermal Factor Ct,${result.Ct},-`,
      `Importance Factor Is,${result.Is},-`,
      `Slope Reduction Factor Cs,${result.Cs},-`,
      `Flat Roof Snow Load pf,${result.pf.toFixed(6)},kPa`,
      `Sloped Roof Snow Load ps,${result.ps.toFixed(6)},kPa`,
      `Sloped Roof Snow Load (Imperial),${result.psPsf.toFixed(6)},psf`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roof-snow-load-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Ground Snow Load pg (kPa)</label>
            <input type="text" data-testid="input-pg" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Flat Roof Coefficient kf</label>
            <input type="text" data-testid="input-kf" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Exposure Ce</label>
              <input type="text" data-testid="input-ce" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Thermal Ct</label>
              <input type="text" data-testid="input-ct" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Importance Is</label>
              <input type="text" data-testid="input-is" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Roof Slope Cs</label>
              <input type="text" data-testid="input-cs" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Flat Roof Load (pf)</div>
                <div data-testid="output-pf" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.pf) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">kPa</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Sloped Roof Load (ps)</div>
                <div data-testid="output-ps" className="text-3xl font-black text-green-800">
                  {result.valid ? formatNum(result.ps) : '—'}
                  {result.valid && <span className="text-lg text-green-600 ml-1">kPa</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Sloped Load (Imperial)</div>
                <div data-testid="output-psf" className="text-3xl font-black text-slate-800">
                  {result.valid ? formatNum(result.psPsf) : '—'}
                  {result.valid && <span className="text-lg text-slate-500 ml-1">psf</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Parametric roof snow load multiplier: pf = kf &middot; Ce &middot; Ct &middot; Is &middot; pg, ps = pf &middot; Cs (1 kPa = 20.8854 psf). Select exposure, thermal, importance, and slope coefficients per your local structural code.
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
