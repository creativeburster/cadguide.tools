'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function ReamingDimensionCalculatorClient() {
  const [inputs, setInputs] = useState(["20","0.02","steel"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const D = parseFloat(inputs[0]) || 20; // Target diameter (mm)
    const tol = parseFloat(inputs[1]) || 0.02; // Tolerance (mm)
    const mat = inputs[2] || 'steel';

    // Material-dependent reaming allowance factor & cutting speed (Machinery's Handbook)
    // Cast iron: higher allowance to prevent glazing/work-hardening (0.25 - 0.40mm)
    // Steel: standard allowance (0.15 - 0.25mm)
    // Aluminum: lower allowance to avoid tearing/smearing (0.10 - 0.20mm)
    let matFactor = 1.0;
    let recSpeedVc = 12; // m/min
    if (mat === 'cast_iron') {
      matFactor = 1.25;
      recSpeedVc = 14;
    } else if (mat === 'aluminum') {
      matFactor = 0.85;
      recSpeedVc = 24;
    }

    const baseStock = D < 6 ? 0.10 : D < 12 ? 0.15 : D < 25 ? 0.22 : 0.32;
    const stock = Math.round(baseStock * matFactor * 100) / 100;
    const drill = Math.round((D - stock) * 100) / 100;

    // Standard reamer nominal manufacturing size targeting middle-to-upper tolerance
    const reamer = D + (tol * 0.4);

    // Recommended reamer spindle speed n = 1000 * Vc / (π * D)
    const recRPM = D > 0 ? Math.round((1000 * recSpeedVc) / (Math.PI * D)) : 0;

    return { drill, reamer, stock, recSpeedVc, recRPM, mat };
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Target Dia (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Tolerance (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="0.02"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select value={inputs[2]} onChange={e => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
              <option value="steel">Carbon / Alloy Steel</option>
              <option value="cast_iron">Cast Iron</option>
              <option value="aluminum">Aluminum / Non-Ferrous</option>
            </select>
          </div>

          <button onClick={() => setInputs(["20","0.02","steel"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Pre-ream Drill Dia</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.drill)}<span className="text-lg text-blue-400"> mm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Finished Reamer Size</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.reamer)}<span className="text-lg text-green-400"> mm</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Material Allowance (2× stock)</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.stock)}<span className="text-sm font-medium text-orange-500"> mm (on diameter)</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Recommended Reaming Speed</div>
                <div className="text-xl font-black text-purple-700">{result.recRPM}<span className="text-sm font-medium text-purple-500"> RPM ({result.recSpeedVc} m/min)</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Pre-drill = Target D - Stock(D, Material) • Reaming allowance calibrated per Machinery&#39;s Handbook specifications
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
