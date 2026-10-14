'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function SteelBeamLoadCalculatorClient() {
  const [inputs, setInputs] = useState(["200","250","5","udl"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const Z = (parseFloat(inputs[0]) || 0) * 1e-6; // cm³ to m³
    const fy = (parseFloat(inputs[1]) || 0) * 1e6; // MPa to Pa
    const L = parseFloat(inputs[2]) || 0;
    const loadType = inputs[3] || 'udl';

    // Allowable bending moment capacity M_allow = 0.66 * fy * Z (kNm)
    const M = (0.66 * fy * Z) / 1000;

    let allowableLoad = 0;
    let loadUnit = 'kN/m';
    let loadLabel = 'Allowable UDL (w)';

    if (loadType === 'point') {
      // Midspan point load for simply supported beam: M_max = P * L / 4  =>  P = 4 * M / L
      allowableLoad = L > 0 ? (4 * M) / L : 0;
      loadUnit = 'kN';
      loadLabel = 'Allowable Midspan Point Load (P)';
    } else {
      // Uniformly distributed load: M_max = w * L² / 8  =>  w = 8 * M / L²
      allowableLoad = L > 0 ? (8 * M) / (L * L) : 0;
      loadUnit = 'kN/m';
      loadLabel = 'Allowable Distributed Load (w)';
    }

    return { M, allowableLoad, loadUnit, loadLabel };
  }, [inputs]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(6);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Section Modulus Z (cm3)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Yield Stress (MPa)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="250"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Span (m)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Load Type</label>
            <select value={inputs[3]} onChange={e => updateInput(3, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all">
              <option value="udl">Uniform Distributed Load (UDL, kN/m)</option>
              <option value="point">Midspan Point Load (P, kN)</option>
            </select>
          </div>

          <button onClick={() => setInputs(["200","250","5","udl"])}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Moment Capacity</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.M)}<span className="text-lg text-blue-400"> kNm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">{result.loadLabel}</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.allowableLoad)}<span className="text-lg text-green-400"> {result.loadUnit}</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                M_cap = 0.66·fy·Z • UDL: w = 8·M / L² • Point Load: P = 4·M / L (AISC 360 ASD Allowable Stress)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
