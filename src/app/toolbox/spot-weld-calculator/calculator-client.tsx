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

const DEFAULT_INPUTS = ['1.5', '250', '3.0', '5.0', '8.0'];

export default function SpotWeldCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const t = parseFinite(inputs[0]);
    const tau = parseFinite(inputs[1]);
    const Fe = parseFinite(inputs[2]);
    const kn = parseFinite(inputs[3]);
    const ks = parseFinite(inputs[4]);

    if (t === null || tau === null || Fe === null || kn === null || ks === null) {
      return { valid: false as const, error: 'Enter numeric values in all resistance spot weld geometry and material fields.' };
    }
    if (t <= 0 || tau <= 0 || Fe < 0 || kn <= 0 || ks <= 0) {
      return { valid: false as const, error: 'Thickness t, shear strength tau, kn, and ks must be > 0; electrode force Fe >= 0.' };
    }

    const dn = kn * Math.sqrt(t);
    const area = (Math.PI * dn * dn) / 4;
    const shearLoad = (area * tau) / 1000;
    const contactPressure = (Fe * 1000) / area;
    const minSpacing = ks * dn;

    return { valid: true as const, t, tau, Fe, kn, ks, dn, area, shearLoad, contactPressure, minSpacing };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Resistance Spot Weld Nugget & Shear Capacity Report',
      '# Formulas: dn = kn*sqrt(t), A = pi*dn^2/4, F_shear = A*tau/1000, p_contact = Fe*1000/A, s_min = ks*dn',
      'Parameter,Value,Unit',
      `Governing Sheet Thickness t,${result.t},mm`,
      `Weld Metal Shear Strength tau,${result.tau},MPa`,
      `Electrode Clamping Force Fe,${result.Fe},kN`,
      `Nugget Sizing Factor kn,${result.kn},-`,
      `Minimum Spacing Factor ks,${result.ks},-`,
      `Weld Nugget Diameter dn,${result.dn.toFixed(6)},mm`,
      `Nugget Shear Cross-Section Area,${result.area.toFixed(6)},mm2`,
      `Single-Spot Shear Load Capacity,${result.shearLoad.toFixed(6)},kN`,
      `Mean Electrode Contact Stress,${result.contactPressure.toFixed(6)},MPa`,
      `Minimum Spot Weld Spacing s_min,${result.minSpacing.toFixed(6)},mm`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spot-weld-report.csv';
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

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Sheet Thickness t (mm)</label>
              <input type="text" data-testid="input-thickness" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Weld Shear Strength &tau; (MPa)</label>
              <input type="text" data-testid="input-shear" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Electrode Clamping Force Fe (kN)</label>
              <input type="text" data-testid="input-force" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Nugget Factor kn</label>
                <input type="text" data-testid="input-kn" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Spacing Factor ks</label>
                <input type="text" data-testid="input-ks" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Weld Outputs</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Nugget Diameter dn</div>
                <div data-testid="output-dn" className="text-2xl font-black text-blue-800">
                  {result.valid ? formatNum(result.dn) : '—'}
                  {result.valid && <span className="text-base text-blue-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Nugget Shear Area</div>
                <div data-testid="output-area" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.area) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">mm&sup2;</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Shear Capacity F</div>
                <div data-testid="output-shear" className="text-2xl font-black text-green-800">
                  {result.valid ? formatNum(result.shearLoad) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">kN</span>}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Electrode Contact Stress</div>
                <div data-testid="output-pressure" className="text-2xl font-black text-orange-800">
                  {result.valid ? formatNum(result.contactPressure) : '—'}
                  {result.valid && <span className="text-base text-orange-600 ml-1">MPa</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2 lg:col-span-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Minimum Spot Spacing s_min (ks &middot; dn)</div>
                <div data-testid="output-spacing" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.minSpacing) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">mm</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Parametric resistance spot weld model: d_n = k_n &middot; &radic;t, A = &pi;d_n&sup2;/4, shear capacity F = A &middot; &tau; / 1000 (kN), contact pressure p = Fe &middot; 1000 / A (MPa), and minimum center-to-center spacing s_min = k_s &middot; d_n. Adjust k_n, k_s, and &tau; per your welding procedure qualification.
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
