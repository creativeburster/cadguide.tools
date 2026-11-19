'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Download } from 'lucide-react';

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const DEFAULT_INPUTS = ['2.08', '11.5', '1.92', '12.0', '95', '2.0'];

export default function SoilCompactionCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const wet = parseFinite(inputs[0]);
    const w = parseFinite(inputs[1]);
    const mdd = parseFinite(inputs[2]);
    const omc = parseFinite(inputs[3]);
    const targetRc = parseFinite(inputs[4]);
    const tolW = parseFinite(inputs[5]);

    if (wet === null || w === null || mdd === null || omc === null || targetRc === null || tolW === null) {
      return { valid: false as const, error: 'Enter numeric values for all density, moisture, and specification fields.' };
    }
    if (wet <= 0 || mdd <= 0 || w < 0 || omc < 0 || targetRc <= 0 || tolW < 0) {
      return { valid: false as const, error: 'Densities and target RC must be > 0; moisture and tolerance >= 0.' };
    }

    const fieldDry = wet / (1 + w / 100);
    const rc = (fieldDry / mdd) * 100;
    const moistureDev = w - omc;
    const rcPass = rc >= targetRc;
    const moisturePass = Math.abs(moistureDev) <= tolW;
    const pass = rcPass && moisturePass;

    return {
      valid: true as const,
      wet,
      w,
      mdd,
      omc,
      targetRc,
      tolW,
      fieldDry,
      rc,
      moistureDev,
      rcPass,
      moisturePass,
      pass,
    };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Field Soil Compaction & Proctor Moisture Report',
      '# Formula: dry_density = wet_density / (1 + w/100) ; RC = (dry_density / MDD) * 100%',
      'Parameter,Value,Unit',
      `Field Wet Density,${result.wet},g/cm3`,
      `Field Moisture Content w,${result.w},%`,
      `Lab Maximum Dry Density MDD,${result.mdd},g/cm3`,
      `Optimum Moisture Content OMC,${result.omc},%`,
      `Target Relative Compaction,${result.targetRc},%`,
      `Moisture Tolerance (+/-),${result.tolW},%`,
      `Field Dry Density,${result.fieldDry.toFixed(6)},g/cm3`,
      `Relative Compaction RC,${result.rc.toFixed(6)},%`,
      `Moisture Deviation from OMC,${result.moistureDev.toFixed(3)},%`,
      `Overall Spec Compliance,${result.pass ? 'PASS' : 'ADJUST_REQUIRED'},-`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soil-compaction-report.csv';
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
                <p className="text-xs text-slate-500 font-medium">Proctor Density &amp; Moisture</p>
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Field In-Situ Wet Density (g/cm&sup3;)</label>
            <input type="text" data-testid="input-wet" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Field Moisture Content w (%)</label>
            <input type="text" data-testid="input-w" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Lab Max Dry Density MDD (g/cm&sup3;)</label>
            <input type="text" data-testid="input-mdd" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Optimum Moisture Content OMC (%)</label>
            <input type="text" data-testid="input-omc" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Target RC (%)</label>
              <input type="text" data-testid="input-target-rc" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Moist. Tol (&plusmn;%)</label>
              <input type="text" data-testid="input-tol" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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
                  <div
                    data-testid="output-status"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase border ${
                      result.pass
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {result.pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{result.pass ? `PASS (>= ${result.targetRc}%)` : 'RE-ROLL OR MOISTURE ADJUST'}</span>
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
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Relative Compaction Degree (RC)</div>
              <div className="flex items-baseline gap-2">
                <span data-testid="output-rc" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.rc.toFixed(2) : '—'}
                </span>
                {result.valid && <span className="text-lg font-bold text-blue-600">%</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Field Dry Density</div>
                <div data-testid="output-dry" className="text-xl font-black text-slate-900">
                  {result.valid ? result.fieldDry.toFixed(4) : '—'}
                  {result.valid && <span className="text-xs font-medium text-slate-500 ml-1">g/cm&sup3;</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Deviation from OMC</div>
                <div data-testid="output-dev" className="text-xl font-black text-slate-900">
                  {result.valid ? `${result.moistureDev >= 0 ? '+' : ''}${result.moistureDev.toFixed(2)}%` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Moisture Window Check</div>
                <div className="text-xl font-black text-slate-900">
                  {result.valid ? (result.moisturePass ? 'Within Band' : 'Out of Band') : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Proctor relative compaction (Wikipedia: Proctor compaction test): gamma_d = gamma_wet / (1 + w / 100), RC = (gamma_d / MDD) &times; 100%.
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
