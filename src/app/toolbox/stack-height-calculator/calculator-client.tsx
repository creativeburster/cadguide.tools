'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

const GRAVITY_MPS2 = 9.80665;

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

const DEFAULT_INPUTS = ['50', '300', '25', '101325', '287.058'];

export default function StackHeightCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const dP = parseFinite(inputs[0]);
    const Ts = parseFinite(inputs[1]);
    const Ta = parseFinite(inputs[2]);
    const Patm = parseFinite(inputs[3]);
    const Rs = parseFinite(inputs[4]);

    if (dP === null || Ts === null || Ta === null || Patm === null || Rs === null) {
      return { valid: false as const, error: 'Enter numeric values in all draft pressure, temperature, atmospheric pressure, and gas constant fields.' };
    }
    if (dP < 0 || Patm <= 0 || Rs <= 0 || Ts <= -273.15 || Ta <= -273.15) {
      return { valid: false as const, error: 'Require dP >= 0, P_atm > 0, R_s > 0, and temperatures > -273.15 deg C.' };
    }
    if (Ts <= Ta) {
      return { valid: false as const, error: 'Stack gas temperature Ts must exceed ambient air temperature Ta to produce upward natural draft.' };
    }

    const rhoA = Patm / (Rs * (Ta + 273.15));
    const rhoS = Patm / (Rs * (Ts + 273.15));
    const dpm = (rhoA - rhoS) * GRAVITY_MPS2;
    const height = dP / dpm;

    return { valid: true as const, dP, Ts, Ta, Patm, Rs, rhoA, rhoS, dpm, height };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Natural Draft Chimney Stack Height Report',
      '# Formula: dp = g * (rho_o - rho_r) * h (Engineering ToolBox d_122.html), rho = P / (Rs * (T + 273.15))',
      'Parameter,Value,Unit',
      `Required Natural Draft dP,${result.dP},Pa`,
      `Mean Flue Gas Temperature Ts,${result.Ts},degC`,
      `Ambient Air Temperature Ta,${result.Ta},degC`,
      `Atmospheric Pressure P_atm,${result.Patm},Pa`,
      `Specific Gas Constant Rs,${result.Rs},J/(kg*K)`,
      `Ambient Air Density rho_o,${result.rhoA.toFixed(6)},kg/m3`,
      `Flue Gas Density rho_r,${result.rhoS.toFixed(6)},kg/m3`,
      `Draft Gradient per Meter,${result.dpm.toFixed(6)},Pa/m`,
      `Required Effective Stack Height H,${result.height.toFixed(6)},m`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stack-height-report.csv';
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

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Required Draft &Delta;P (Pa)</label>
              <input type="text" data-testid="input-dp" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Flue Gas Temp Ts (&deg;C)</label>
              <input type="text" data-testid="input-ts" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Ambient Air Temp Ta (&deg;C)</label>
              <input type="text" data-testid="input-ta" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Atmospheric Pressure P (Pa)</label>
              <input type="text" data-testid="input-patm" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Specific Gas Constant Rs (J/kg&middot;K)</label>
              <input type="text" data-testid="input-rs" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Natural Draft Results</h2>
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Required Stack Height H</div>
                <div data-testid="output-height" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.height) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">m</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Draft per Meter (&Delta;P/m)</div>
                <div data-testid="output-dpm" className="text-3xl font-black text-green-800">
                  {result.valid ? formatNum(result.dpm) : '—'}
                  {result.valid && <span className="text-lg text-green-600 ml-1">Pa/m</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Ambient Air Density &rho;_o</div>
                <div data-testid="output-rho-a" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.rhoA) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kg/m&sup3;</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Flue Gas Density &rho;_r</div>
                <div data-testid="output-rho-s" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.rhoS) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kg/m&sup3;</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Natural draft buoyancy equation dp = g &middot; (&rho;_o &minus; &rho;_r) &middot; h (Engineering ToolBox:{' '}
                  <a href="https://www.engineeringtoolbox.com/natural-draught-ventilation-d_122.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    Natural Draught Ventilation
                  </a>
                  ), with ideal gas density &rho; = P / (Rs &middot; (T + 273.15)). Friction and heat losses along the stack must be included in &Delta;P.
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
