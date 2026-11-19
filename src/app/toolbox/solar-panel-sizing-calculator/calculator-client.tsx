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

const DEFAULT_INPUTS = ['3000', '5', '48', '400', '2', '0.75', '0.80'];

export default function SolarPanelSizingCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const E = parseFinite(inputs[0]);
    const sun = parseFinite(inputs[1]);
    const V = parseFinite(inputs[2]);
    const Pw = parseFinite(inputs[3]);
    const days = parseFinite(inputs[4]);
    const eff = parseFinite(inputs[5]);
    const dod = parseFinite(inputs[6]);

    if (E === null || sun === null || V === null || Pw === null || days === null || eff === null || dod === null) {
      return { valid: false as const, error: 'Enter numeric values in all solar array and battery sizing fields.' };
    }
    if (E < 0 || sun <= 0 || V <= 0 || Pw <= 0 || days < 0) {
      return { valid: false as const, error: 'Sun hours, voltage, and panel wattage must be > 0; energy and autonomy days >= 0.' };
    }
    if (eff <= 0 || eff > 1 || dod <= 0 || dod > 1) {
      return { valid: false as const, error: 'System efficiency and battery Depth of Discharge (DoD) must be in (0, 1].' };
    }

    const Parray = E / (sun * eff);
    const Np = Math.ceil(Parray / Pw);
    const batteryWh = (E * days) / (dod * eff);
    const batteryAh = batteryWh / V;

    return { valid: true as const, E, sun, V, Pw, days, eff, dod, Parray, Np, batteryWh, batteryAh };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Off-Grid Solar PV Array & Battery Bank Sizing Report',
      '# Formulas: P_array = E/(sun*eta), C_Wh = E*days/(DoD*eta), C_Ah = C_Wh/V',
      'Parameter,Value,Unit',
      `Daily Load Energy E,${result.E},Wh/day`,
      `Peak Sun Hours,${result.sun},h/day`,
      `Battery Bank Voltage V,${result.V},V`,
      `Module Nameplate Power Pw,${result.Pw},W`,
      `Days of Autonomy,${result.days},days`,
      `Overall System Efficiency eta,${result.eff},-`,
      `Battery Max Depth of Discharge DoD,${result.dod},-`,
      `Required Array Power,${result.Parray.toFixed(6)},W`,
      `Minimum Module Count Np,${result.Np},panels`,
      `Total Battery Energy Capacity,${result.batteryWh.toFixed(3)},Wh`,
      `Required Battery Amp-Hour Capacity,${result.batteryAh.toFixed(6)},Ah`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar-panel-sizing-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Daily Energy Consumption E (Wh)</label>
            <input type="text" data-testid="input-energy" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Sun Hours (h)</label>
              <input type="text" data-testid="input-sun" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">System Volt (V)</label>
              <input type="text" data-testid="input-volt" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Panel Watt (W)</label>
              <input type="text" data-testid="input-pw" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Autonomy (days)</label>
              <input type="text" data-testid="input-days" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">System Eff (0&ndash;1)</label>
              <input type="text" data-testid="input-eff" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Battery DoD (0&ndash;1)</label>
              <input type="text" data-testid="input-dod" value={inputs[6]} onChange={e => updateInput(6, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Panel Count (ceil)</div>
                <div data-testid="output-np" className="text-3xl font-black text-blue-800">
                  {result.valid ? result.Np : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">panels</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Required Array Power</div>
                <div data-testid="output-parray" className="text-3xl font-black text-green-800">
                  {result.valid ? formatNum(result.Parray) : '—'}
                  {result.valid && <span className="text-lg text-green-600 ml-1">W</span>}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">Battery Capacity (Ah)</div>
                <div data-testid="output-ah" className="text-3xl font-black text-orange-800">
                  {result.valid ? formatNum(result.batteryAh) : '—'}
                  {result.valid && <span className="text-lg text-orange-600 ml-1">Ah</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Battery Energy (Wh)</div>
                <div data-testid="output-wh" className="text-3xl font-black text-slate-800">
                  {result.valid ? formatNum(result.batteryWh) : '—'}
                  {result.valid && <span className="text-lg text-slate-500 ml-1">Wh</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Array Power P_array = E / (sun &middot; eta), Panel Count = ceil(P_array / Pw), Battery Capacity = (E &middot; days) / (V &middot; DoD &middot; eta).
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
