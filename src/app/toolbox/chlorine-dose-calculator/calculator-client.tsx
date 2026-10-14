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
      const q = parseFloat(vals[0]) || 120;
      const dem = parseFloat(vals[1]) || 1.8;
      const res = parseFloat(vals[2]) || 0.6;
      const str = parseFloat(vals[3]) || 10;
      const dosage = dem + res;
      const cl2KgHr = (q * dosage) / 1000;
      const solutionLHr = (cl2KgHr / (str / 100)) / 1.15;
      return {
        primary: { label: 'Pure Chlorine Dose Feed Rate', val: cl2KgHr.toFixed(3), unit: 'kg/h' },
        secondary: [
          { label: 'Total Dosage Concentration', val: dosage.toFixed(2), unit: 'mg/L (ppm)' },
          { label: 'Hypochlorite Solution Feed Pump Rate', val: solutionLHr.toFixed(2), unit: 'L/h' },
          { label: 'Daily Chlorine Consumption', val: (cl2KgHr * 24).toFixed(1), unit: 'kg/day' }
        ],
        status: { pass: dosage <= 5.0, text: dosage <= 5.0 ? 'SAFE POTABLE WATER RESIDUAL' : 'HIGH DOSAGE WARNING' }
      };
    };

const DEFAULT_INPUTS = ["120","1.8","0.6","10"];

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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Water Flow Q (m³/h)</label>
            <input
              type="number"
              step="10"
              value={inputs[0]}
              onChange={(e) => updateInput(0, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Chlorine Demand (mg/L)</label>
            <input
              type="number"
              step="0.1"
              value={inputs[1]}
              onChange={(e) => updateInput(1, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Target Free Residual (mg/L)</label>
            <input
              type="number"
              step="0.1"
              value={inputs[2]}
              onChange={(e) => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">NaOCl Solution Strength (%)</label>
            <select
              value={inputs[3]}
              onChange={(e) => updateInput(3, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="10" value="10">{"10% Commercial Sodium Hypochlorite"}</option>
              <option key="12.5" value="12.5">{"12.5% Industrial Bleach"}</option>
              <option key="5.25" value="5.25">{"5.25% Household Strength"}</option>
              <option key="100" value="100">{"100% Pure Chlorine Gas (Cl2)"}</option>
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
                {"Feed (kg/h) = Q(m³/h) × (Demand + Residual)(mg/L) / 1000 (AWWA Standard B300 Disinfection)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
