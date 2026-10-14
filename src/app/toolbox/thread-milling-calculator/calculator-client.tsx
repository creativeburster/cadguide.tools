'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function ThreadMillingCalculatorClient() {
  const [inputs, setInputs] = useState(["20","2.5","12","3000","3"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const D = parseFloat(inputs[0]) || 20; // Nominal Thread Major Dia (mm)
    const p = parseFloat(inputs[1]) || 2.5; // Pitch (mm)
    const dc = parseFloat(inputs[2]) || 12; // Cutter Diameter (mm)
    const n = parseFloat(inputs[3]) || 3000; // Spindle RPM
    const z = parseFloat(inputs[4]) || 3; // Flute count
    const fz = 0.05; // Standard feed per tooth (mm/tooth)

    // Linear outer periphery feed rate (mm/min)
    const fPeriphery = z * fz * n;

    // CNC Tool Center Feed Rate for internal thread: f_center = f_periphery * (D - dc) / D
    const fCenter = D > dc && D > 0 ? fPeriphery * ((D - dc) / D) : fPeriphery;

    // Cutting speed Vc (m/min)
    const Vc = (Math.PI * dc * n) / 1000;

    // Centerline arc length for one 360° helical revolution: L = π * (D - dc)
    const centerRevLength = Math.max(0, Math.PI * (D - dc));

    // Cycle time per single 360° pitch pass (seconds):
    const tSinglePass = fCenter > 0 ? (centerRevLength / fCenter) * 60 : 0;

    const step = z > 0 ? p / z : p;

    return { f: fPeriphery, fCenter, step, t: tSinglePass, Vc };
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Thread Dia (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pitch (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="2.5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Cutter Dia (mm)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="12"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Spindle RPM</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="3000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="4">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Flutes</label>
            <input type="text" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["20","2.5","12","3000","3"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">CNC Center Feed Rate</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.fCenter)}<span className="text-lg text-blue-400"> mm/min</span></div>
                <div className="text-xs text-blue-500 font-medium mt-1">Periphery: {formatNum(result.f)} mm/min</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Cycle Time (1 Pass)</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.t)}<span className="text-lg text-green-400"> s</span></div>
                <div className="text-xs text-green-500 font-medium mt-1">Helical interpolation time</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Cutting Speed (Vc)</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.Vc)}<span className="text-sm font-medium text-purple-500"> m/min</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Axial Pitch per Revolution</div>
                <div className="text-xl font-black text-orange-700">{inputs[1]}<span className="text-sm font-medium text-orange-500"> mm/rev</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                f_center = f_periphery · (D - d_c) / D • Helical Pass Time = π·(D - d_c) / f_center
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
