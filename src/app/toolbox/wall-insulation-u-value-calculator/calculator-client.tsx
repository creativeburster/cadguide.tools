'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CalculationOutput {
  primary: { label: string; val: string; unit: string };
  secondary: Array<{ label: string; val: string; unit: string }>;
  status?: { pass: boolean; text: string };
}

const computeFn: (vals: string[]) => CalculationOutput = (vals) => {
      const clad = vals[0] || 'brick';
      const ext = vals[1] || 'eps50';
      const cav = vals[2] || 'r19';
      let rClad = clad === 'brick' ? 0.8 : clad === 'siding' ? 0.5 : 0.2;
      let rExt = ext === 'none' ? 0 : ext === 'eps25' ? 6.0 : 10.0;
      let rCav = cav === 'r13' ? 13.0 : cav === 'r19' ? 19.0 : 21.0;
      // Parallel path framing factor for wood stud 16" o.c. ~ 25% framing
      const rEffCavity = 1 / ((0.25 / 4.5) + (0.75 / rCav));
      const rAirInsideOutside = 0.68 + 0.17;
      const rTotal = rClad + rExt + rEffCavity + 0.45 + rAirInsideOutside; // +0.45 for 1/2" drywall
      const uValueIp = 1 / rTotal; // BTU/h·ft2·°F
      const uValueMetric = uValueIp * 5.67826; // W/m2·K
      return {
        primary: { label: 'Overall Wall Assembly U-Factor', val: uValueMetric.toFixed(3), unit: 'W/m²·K' },
        secondary: [
          { label: 'Total Thermal Resistance (Imperial R)', val: `R-${rTotal.toFixed(1)}`, unit: 'h·ft²·°F/BTU' },
          { label: 'Effective Cavity Resistance (Framing Adjusted)', val: `R-${rEffCavity.toFixed(1)}`, unit: '' },
          { label: 'ASHRAE 90.1 Climate Zone 4 Max U-Factor', val: '0.363 W/m²·K', unit: '' }
        ],
        status: { pass: uValueMetric <= 0.363, text: uValueMetric <= 0.363 ? 'COMPLIES WITH ASHRAE 90.1 / IECC ENERGY CODE' : 'INSUFFICIENT THERMAL ENVELOPE' }
      };
    };

const DEFAULT_INPUTS = ["brick","eps50","r19"];

export default function CalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    try {
      return computeFn(inputs);
    } catch {
      return {
        primary: { label: 'Calculation Error', val: '—', unit: '' },
        secondary: [],
        status: { pass: false, text: 'Invalid Input Values' }
      };
    }
  }, [inputs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs & Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Adjust values to recalculate</p>
            </div>
          </div>

          <div className="space-y-4">
          <div key="0">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Exterior Wall Cladding</label>
            <select
              value={inputs[0]}
              onChange={(e) => updateInput(0, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="brick" value="brick">{"Exterior Face Brick Veneer (R-0.8)"}</option>
              <option key="siding" value="siding">{"Fiber Cement Siding (R-0.5)"}</option>
              <option key="stucco" value="stucco">{"Portland Cement Stucco (R-0.2)"}</option>
            </select>
          </div>
          <div key="1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Continuous Exterior Foam Insulation</label>
            <select
              value={inputs[1]}
              onChange={(e) => updateInput(1, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="none" value="none">{"None (No Continuous Insulation R-0)"}</option>
              <option key="eps25" value="eps25">{"25 mm Continuous Polyiso (R-6.0)"}</option>
              <option key="eps50" value="eps50">{"50 mm Continuous XPS (R-10.0)"}</option>
            </select>
          </div>
          <div key="2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Stud Cavity Batt Insulation</label>
            <select
              value={inputs[2]}
              onChange={(e) => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="r13" value="r13">{"R-13 Fiberglass Batt (89mm / 2x4 stud)"}</option>
              <option key="r19" value="r19">{"R-19 Mineral Wool Batt (140mm / 2x6 stud)"}</option>
              <option key="r21" value="r21">{"R-21 High-Density Batt (140mm stud)"}</option>
            </select>
          </div>
          </div>

          <button
            onClick={() => setInputs(DEFAULT_INPUTS)}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>
              {result.status && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                  result.status.pass
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {result.status.pass ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{result.status.text}</span>
                </div>
              )}
            </div>

            {/* Primary Result Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                {result.primary.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.primary.val}
                </span>
                {result.primary.unit && (
                  <span className="text-lg font-bold text-blue-600">
                    {result.primary.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            {result.secondary && result.secondary.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {result.secondary.map((metric, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">
                      {metric.label}
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {metric.val}
                      {metric.unit && <span className="text-xs font-medium text-slate-500 ml-1.5">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Engineering Methodology & Formula Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Governing Engineering Formula & Standards</h3>
                <p className="text-xs text-slate-500 font-medium">Standardized calculation procedure</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-700 font-mono font-medium leading-relaxed block break-words">
                {"U = 1 / Σ R_components • R_cavity_eff = 1 / [(f_stud/R_stud) + (f_cav/R_ins)] (ASHRAE 90.1 Parallel-Path Method)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
