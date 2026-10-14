'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function ColumnBasePlateCalculatorClient() {
  const [inputs, setInputs] = useState(["500","25","200","200","250"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const P = (parseFloat(inputs[0]) || 0) * 1000; // kN to N
    const fc = parseFloat(inputs[1]) || 25; // Concrete compressive strength (MPa)
    const cw = parseFloat(inputs[2]) || 200; // Column width (mm)
    const cd = parseFloat(inputs[3]) || 200; // Column depth (mm)
    const fy = parseFloat(inputs[4]) || 250; // Steel yield strength (MPa)

    // Allowable concrete bearing stress: fp_allow = 0.35 * fc (AISC ASD) or 0.6 * fc (full confinement)
    const fpAllow = 0.6 * fc;

    // Minimum required base plate area A1 = P / fpAllow (mm²)
    const reqArea = fpAllow > 0 ? P / fpAllow : 0;

    // Base plate square dimension B must provide adequate bearing area and house the column profile:
    const minSideFromArea = Math.sqrt(reqArea);
    const minSideFromColumn = Math.max(cw, cd) + 100; // At least 50mm clearance on each side
    const B = Math.ceil(Math.max(minSideFromArea, minSideFromColumn) / 10) * 10;

    // Actual bearing pressure under working load:
    const actualArea = B * B;
    const fp = actualArea > 0 ? P / actualArea : 0;

    // Bidirectional cantilever overhang distances (m along flange, n along web):
    // AISC Design Guide 1: m = (B - 0.95*cd)/2, n = (B - 0.8*cw)/2
    const m = Math.max(0, (B - 0.95 * cd) / 2);
    const n = Math.max(0, (B - 0.80 * cw) / 2);
    const cantilever = Math.max(m, n);

    // Required plate thickness: t = l * sqrt(2 * fp / (0.9 * fy)) (LRFD) or sqrt(3 * fp * l² / (0.75 * fy)) (ASD)
    const t = fy > 0 ? Math.ceil(cantilever * Math.sqrt((3 * fp) / (0.75 * fy)) * 10) / 10 : 0;

    return { B, t, fp, cantilever, m, n };
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Column Load (kN)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Concrete fc (MPa)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="25"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Column Width (mm)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Column Depth (mm)</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div key="4">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Steel fy (MPa)</label>
            <input type="text" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} placeholder="250"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["500","25","200","200","250"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Base Plate Size (B × B)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.B)}<span className="text-lg text-blue-400"> mm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Minimum Thickness (t)</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.t)}<span className="text-lg text-green-400"> mm</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Concrete Bearing Stress</div>
                <div className="text-3xl font-black text-orange-700">{formatNum(result.fp)}<span className="text-lg text-orange-400"> MPa</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Governing Cantilever (l)</div>
                <div className="text-3xl font-black text-purple-700">{formatNum(result.cantilever)}<span className="text-lg text-purple-400"> mm</span></div>
                <div className="text-xs text-purple-500 font-medium mt-1">m={formatNum(result.m)}mm, n={formatNum(result.n)}mm</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                AISC Design Guide 1: Cantilever l = max(m, n) where m = (B - 0.95·cd)/2, n = (B - 0.8·cw)/2 • t = l · √(3·fp / (0.75·fy))
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
