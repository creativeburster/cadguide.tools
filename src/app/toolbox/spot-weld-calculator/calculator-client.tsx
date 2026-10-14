'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function SpotWeldCalculatorClient() {
  const [inputs, setInputs] = useState(["1.5","250","3"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const t = parseFloat(inputs[0]) || 1.5; // Sheet thickness in mm
    const ss = (parseFloat(inputs[1]) || 250) * 1e6; // Shear strength in Pa
    const FeKn = parseFloat(inputs[2]) || 3; // Electrode force in kN
    const FeN = FeKn * 1000; // N

    // Recommended nugget diameter dn = 5 * sqrt(t) (AWS C1.1 recommendation, mm)
    const d = 5 * Math.sqrt(t);
    const A = (Math.PI * d * d) / 4 / 1e6; // m²

    // Shear failure tensile load capacity per spot weld (kN):
    const F = (ss * A) / 1000;

    // Minimum spot weld center-to-center pitch to avoid shunting current: s = 8 * d
    const s = 8 * d;

    // Electrode tip contact face diameter (typically de = 2*t + 3mm or dn + 1mm)
    const de = Math.max(4, Math.round(5 * Math.sqrt(t) * 10) / 10);
    const tipAreaMm2 = (Math.PI * de * de) / 4;
    const contactPressureMpa = tipAreaMm2 > 0 ? FeN / tipAreaMm2 : 0;

    // AWS C1.1 recommended electrode clamping force window (approx 1.5 ~ 2.5 kN per mm thickness)
    const recMinFe = Math.round(1.6 * Math.pow(t, 1.2) * 10) / 10;
    const recMaxFe = Math.round(2.6 * Math.pow(t, 1.2) * 10) / 10;
    const forceStatus = FeKn < recMinFe
      ? { pass: false, text: `LOW FORCE (Risk of severe expulsion/flash, recommend >= ${recMinFe} kN)` }
      : FeKn > recMaxFe * 1.3
      ? { pass: false, text: `HIGH FORCE (Risk of excessive indentation >15%, recommend <= ${recMaxFe} kN)` }
      : { pass: true, text: `OPTIMAL CLAMPING FORCE (${recMinFe} ~ ${recMaxFe} kN)` };

    return { d, F, s, contactPressureMpa, forceStatus, FeKn, de };
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sheet Thickness (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="1.5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Shear Strength (MPa)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="250"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Electrode Force (kN)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["1.5","250","3"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Nugget Diameter (d_n)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.d)}<span className="text-lg text-blue-400"> mm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Shear Load Capacity</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.F)}<span className="text-lg text-green-400"> kN</span></div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Tip Contact Pressure</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.contactPressureMpa)}<span className="text-sm font-medium text-purple-500"> MPa (Face Ø{result.de}mm)</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Anti-Shunting Pitch Spacing</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.s)}<span className="text-sm font-medium text-orange-500"> mm (Min 8·d_n)</span></div>
              </div>
              <div className={`col-span-2 rounded-2xl p-4 border ${result.forceStatus.pass ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                <div className="text-xs font-black uppercase tracking-wider mb-1">AWS C1.1 Clamping Force Verification</div>
                <div className="text-sm font-bold">{result.forceStatus.text}</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                d_n = 5·√t (AWS C1.1) • Shear Load = (π·d_n²/4)·τ • Min Spacing s = 8·d_n to prevent secondary current shunting
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
