'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function BoltCircleCalculatorClient() {
  const [inputs, setInputs] = useState(["200","8","0"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const D = parseFloat(inputs[0]) || 0;
    const n = Math.max(1, parseFloat(inputs[1]) || 1);
    const startDeg = parseFloat(inputs[2]) || 0;
    const startRad = (startDeg * Math.PI) / 180;
    const R = D / 2;

    const spacing = (Math.PI * D) / n; // Circular arc spacing
    const chord = 2 * R * Math.sin(Math.PI / n); // Linear chord distance between centers
    const angleStepDeg = 360 / n; // Angular pitch

    // First hole Cartesian coordinates relative to center (0, 0):
    const x1 = R * Math.cos(startRad);
    const y1 = R * Math.sin(startRad);

    return { spacing, chord, angleStepDeg, x1, y1, startDeg };
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
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bolt Circle Dia (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Number of Bolts</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="8"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Start Angle (deg)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="0"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["200","8","0"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Chord Distance (Hole-to-Hole)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.chord)}<span className="text-lg text-blue-400"> mm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Arc Perimeter Spacing</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.spacing)}<span className="text-lg text-green-400"> mm</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">First Hole (X₁, Y₁) at {result.startDeg}°</div>
                <div className="text-xl font-black text-purple-700">({formatNum(result.x1)}, {formatNum(result.y1)})<span className="text-sm font-medium text-purple-500"> mm</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Angular Pitch (Δθ)</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.angleStepDeg)}<span className="text-sm font-medium text-orange-500"> °</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                X_i = R·cos(θ_start + 2π·i/n) • Y_i = R·sin(θ_start + 2π·i/n) • Chord = 2·R·sin(π/n)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
