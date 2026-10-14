'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function PipeFlowRateCalculatorClient() {
  const [inputs, setInputs] = useState(["100","2","0.15"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const D = (parseFloat(inputs[0]) || 100) / 1000; // Pipe inner diameter in m
    const v = parseFloat(inputs[1]) || 0; // Velocity in m/s
    const rough = (parseFloat(inputs[2]) || 0.15) / 1000; // Absolute roughness in m

    const A = (Math.PI * D * D) / 4; // Area in m²
    const Q = A * v * 1000; // Instantaneous flow in L/s
    const Qh = Q * 3.6; // Volumetric hourly flow in m³/h

    // Kinematic viscosity of water at 20°C: ν ≈ 1.004e-6 m²/s
    const nu = 1.004e-6;
    const Re = (v * D) / nu;

    // Darcy friction factor f via Swamee-Jain equation for full turbulent pipe flow:
    // f = 0.25 / [log10( (eps / (3.7 * D)) + (5.74 / Re^0.9) )]^2
    let f = 0.02;
    if (Re > 4000 && D > 0) {
      const term = (rough / (3.7 * D)) + (5.74 / Math.pow(Re, 0.9));
      f = 0.25 / Math.pow(Math.log10(term), 2);
    } else if (Re > 0 && Re <= 2000) {
      f = 64 / Re;
    }

    // Darcy-Weisbach head loss per 100m of pipe (m/100m): hf_100 = f * (100 / D) * (v² / 2g)
    const g = 9.80665;
    const hfPer100m = D > 0 ? f * (100 / D) * (v * v) / (2 * g) : 0;

    return { Q, Qh, A: A * 10000, f, hfPer100m, Re };
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
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Dia (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Velocity (m/s)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Roughness (mm)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="0.15"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["100","2","0.15"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Instantaneous Flow (Q)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.Q)}<span className="text-lg text-blue-400"> L/s</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Hourly Volume (Q_h)</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.Qh)}<span className="text-lg text-green-400"> m³/h</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Friction Head Loss (per 100m)</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.hfPer100m)}<span className="text-sm font-medium text-purple-500"> m / 100m (f={formatNum(result.f)})</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Flow Internal Area</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.A)}<span className="text-sm font-medium text-orange-500"> cm² (Re={Math.round(result.Re)})</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Q = A·v • Darcy-Weisbach: h_f = f·(L/D)·(v²/2g) using Swamee-Jain Colebrook approximation
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
