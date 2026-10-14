'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function DuctSizingCalculatorClient() {
  const [inputs, setInputs] = useState(["1000","5","circular"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const Q = (parseFloat(inputs[0]) || 0) / 3600; // m³/h to m³/s
    const v = parseFloat(inputs[1]) || 5; // m/s
    const shape = inputs[2] || 'circular';

    const A = v > 0 ? Q / v : 0; // m²

    // Circular equivalent diameter (mm)
    const DRound = Math.sqrt((4 * A) / Math.PI) * 1000;

    let D = DRound;
    let rectW = 0;
    let rectH = 0;

    if (shape === 'rectangular') {
      // Standard aspect ratio 1.5:1 (W:H), rounded to standard 50mm increments
      const rawH = Math.sqrt(A / 1.5) * 1000;
      rectH = Math.max(100, Math.ceil(rawH / 50) * 50);
      rectW = Math.max(100, Math.ceil((A * 1e6) / rectH / 50) * 50);

      // Huebscher equivalent circular diameter De = 1.30 * (a * b)^0.625 / (a + b)^0.25 (mm)
      const a = rectW;
      const b = rectH;
      D = (1.30 * Math.pow(a * b, 0.625)) / Math.pow(a + b, 0.25);
    }

    // Darcy-Weisbach duct friction rate (Pa/m) using ASHRAE air duct friction formula
    const Dm = D / 1000;
    const fr = Dm > 0 ? 0.018 * Math.pow(v, 1.9) / Math.pow(Dm, 1.2) : 0;

    return { A, D, DRound, rectW, rectH, fr, shape };
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
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Airflow Q (m3/h)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="1000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Velocity v (m/s)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Duct Shape</label>
            <select value={inputs[2]} onChange={e => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
              <option value="circular">Circular Duct (Round)</option>
              <option value="rectangular">Rectangular Duct</option>
            </select>
          </div>

          <button onClick={() => setInputs(["1000","5","circular"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Net Flow Area (A)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.A)}<span className="text-lg text-blue-400"> m²</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">
                  {result.shape === 'rectangular' ? 'Equivalent Diameter (De)' : 'Internal Diameter (D)'}
                </div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.D)}<span className="text-lg text-green-400"> mm</span></div>
              </div>
              {result.shape === 'rectangular' && (
                <div className="col-span-2 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                  <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Recommended Rectangular Duct Size (Width × Height)</div>
                  <div className="text-2xl font-black text-purple-700">{result.rectW} × {result.rectH}<span className="text-sm font-medium text-purple-500"> mm (Standard 50mm Module)</span></div>
                </div>
              )}
              <div className="col-span-2 bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Specific Friction Loss Rate (Δp/L)</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.fr)}<span className="text-sm font-medium text-orange-500"> Pa/m (ASHRAE Duct Friction Equation)</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                A = Q / v • Huebscher Equivalent: De = 1.30·(a·b)^0.625 / (a + b)^0.25 • Δp/L = 0.018·v^1.9 / D^1.2
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
