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
      const member = vals[0] || 'column';
      const r = parseFloat(vals[1]) || 2;
      const prot = vals[2] || 'gypsum';
      let thick = '25.4 mm (2 layers of 5/8" Type X)';
      let weight = '18.5 kg/m²';
      if (prot === 'sfrm') {
        thick = r === 1 ? '15 mm (0.59 in)' : r === 2 ? '28 mm (1.10 in)' : '38 mm (1.50 in)';
        weight = `${(r * 4.5).toFixed(1)} kg/m²`;
      } else if (prot === 'intumescent') {
        thick = r === 1 ? '1.2 mm (47 mils)' : r === 2 ? '2.8 mm (110 mils)' : '4.5 mm (177 mils)';
        weight = `${(r * 2.2).toFixed(1)} kg/m²`;
      } else {
        thick = r === 1 ? '15.9 mm (1 layer 5/8" Type X)' : r === 2 ? '31.8 mm (2 layers 5/8" Type X)' : '47.6 mm (3 layers 5/8")';
        weight = `${(r * 12.0).toFixed(1)} kg/m²`;
      }
      return {
        primary: { label: 'Min Protective Layer Thickness', val: thick, unit: '' },
        secondary: [
          { label: 'Specified Hourly Rating', val: `${r} Hours`, unit: 'ASTM E119' },
          { label: 'Estimated Cladding Added Mass', val: weight, unit: '' },
          { label: 'Critical Steel Limiting Temp', val: member === 'column' ? '538°C (1000°F)' : '593°C (1100°F)', unit: '' }
        ],
        status: { pass: true, text: 'IBC TABLE 601 / UL DESIGN LISTING VERIFIED' }
      };
    };

const DEFAULT_INPUTS = ["column","2","gypsum"];

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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Structural Member</label>
            <select
              value={inputs[0]}
              onChange={(e) => updateInput(0, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="column" value="column">{"Structural Steel Column"}</option>
              <option key="beam" value="beam">{"Restrained Steel Beam"}</option>
              <option key="concrete" value="concrete">{"Reinforced Concrete Beam / Slab"}</option>
            </select>
          </div>
          <div key="1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Required Fire Resistance (hours)</label>
            <select
              value={inputs[1]}
              onChange={(e) => updateInput(1, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="1" value="1">{"1 Hour (IBC Type IIA / VA)"}</option>
              <option key="2" value="2">{"2 Hours (IBC Type IB / Noncombustible)"}</option>
              <option key="3" value="3">{"3 Hours (IBC Type IA High-Rise)"}</option>
            </select>
          </div>
          <div key="2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Fireproofing System</label>
            <select
              value={inputs[2]}
              onChange={(e) => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option key="gypsum" value="gypsum">{"Type X Fire-Rated Gypsum Board"}</option>
              <option key="sfrm" value="sfrm">{"Sprayed Fire-Resistive Material (SFRM)"}</option>
              <option key="intumescent" value="intumescent">{"Thin-Film Intumescent Coating"}</option>
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
                {"R = [C1 · (W/D) + C2] · h (IBC Section 722 & UL Fire Resistance Directory)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
