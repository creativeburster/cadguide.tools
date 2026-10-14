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
      const q = parseFloat(vals[0]) || 0;
      const bodIn = parseFloat(vals[1]) || 0;
      const bodOut = parseFloat(vals[2]) || 0;
      const mlss = parseFloat(vals[3]) || 3000;
      const srt = parseFloat(vals[4]) || 10;
      const v = (q * (bodIn - bodOut) * srt) / (mlss * 0.6);
      const hrt = (v / Math.max(1, q)) * 24;
      const fm = (q * bodIn) / (mlss * Math.max(1, v));
      const o2 = (q * (bodIn - bodOut) * 1.2) / 1000;
      return {
        primary: { label: 'Aeration Basin Volume', val: v.toFixed(0), unit: 'm³' },
        secondary: [
          { label: 'Hydraulic Retention Time (HRT)', val: hrt.toFixed(1), unit: 'hours' },
          { label: 'Food-to-Microorganism (F/M)', val: fm.toFixed(3), unit: 'kg BOD/kg MLSS·d' },
          { label: 'Daily Oxygen Demand', val: o2.toFixed(1), unit: 'kg O₂/d' }
        ],
        status: { pass: hrt >= 4 && hrt <= 24, text: hrt >= 4 ? 'HRT WITHIN STANDARD RANGE' : 'WARNING: HRT TOO SHORT' }
      };
    };

const DEFAULT_INPUTS = ["5000","220","15","3000","10"];

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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Design Inflow Q (m³/d)</label>
            <input
              type="number"
              step="100"
              value={inputs[0]}
              onChange={(e) => updateInput(0, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Influent BOD5 (mg/L)</label>
            <input
              type="number"
              step="10"
              value={inputs[1]}
              onChange={(e) => updateInput(1, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Target Effluent BOD5 (mg/L)</label>
            <input
              type="number"
              step="1"
              value={inputs[2]}
              onChange={(e) => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">MLSS Concentration (mg/L)</label>
            <input
              type="number"
              step="100"
              value={inputs[3]}
              onChange={(e) => updateInput(3, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>
          <div key="4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Sludge Age SRT (days)</label>
            <input
              type="number"
              step="1"
              value={inputs[4]}
              onChange={(e) => updateInput(4, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
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
                {"V = (Q · ΔBOD · SRT) / (0.6 · MLSS) • HRT = (V / Q) × 24h (Metcalf & Eddy Wastewater Engineering)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
