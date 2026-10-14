'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function WeldingFilletSizeCalculatorClient() {
  const [inputs, setInputs] = useState(["10","20","100","50"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const t1 = parseFloat(inputs[0]) || 0; // Thinner plate (mm)
    const t2 = parseFloat(inputs[1]) || 0; // Thicker plate (mm)
    const L = parseFloat(inputs[2]) || 0; // Weld length (mm)
    const F = (parseFloat(inputs[3]) || 0) * 1000; // N

    // AWS D1.1 Table 2.4: Minimum fillet weld size based on the thicker part joined (t2):
    const thickest = Math.max(t1, t2);
    let minS = 3;
    if (thickest > 20) minS = 8;
    else if (thickest > 12) minS = 6;
    else if (thickest > 6) minS = 5;

    // AWS D1.1 Section 2.4.2.8: Maximum fillet weld along edges of thinner material (t1):
    const thinnest = Math.min(t1, t2);
    const maxS = thinnest < 6 ? thinnest : Math.max(1, thinnest - 1.5);

    // Required fillet leg size based on allowable throat shear stress:
    // s_req = F / (0.707 * L * allowableStress) with allowable shear stress ≈ 200 MPa (for E70xx electrodes)
    const reqS = L > 0 ? F / (0.707 * L * 200) : 0;
    const designS = Math.max(minS, reqS);
    const Fw = (0.707 * designS * L * 200) / 1000; // Capacity at design size in kN

    const isFeasible = designS <= maxS;

    return { minS, maxS, reqS, designS, Fw, isFeasible, t1, t2 };
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Thinner Plate (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Thicker Plate (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Weld Length (mm)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Force (kN)</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="50"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["10","20","100","50"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Recommended Design Leg (s)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.designS)}<span className="text-lg text-blue-400"> mm</span></div>
                <div className="text-xs text-blue-500 font-medium mt-1">Required: {formatNum(result.reqS)} mm</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Weld Load Capacity</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.Fw)}<span className="text-lg text-green-400"> kN</span></div>
                <div className="text-xs text-green-500 font-medium mt-1">At recommended size</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Min Leg (Thicker Plate {result.t2}mm)</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.minS)}<span className="text-sm font-medium text-purple-500"> mm (AWS D1.1 Table 2.4)</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Max Leg (Thinner Plate {result.t1}mm)</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.maxS)}<span className="text-sm font-medium text-orange-500"> mm (Edge boundary)</span></div>
              </div>
              <div className={`col-span-2 rounded-2xl p-4 border ${result.isFeasible ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                <div className="text-xs font-black uppercase tracking-wider mb-1">AWS D1.1 Edge Feasibility Check</div>
                <div className="text-sm font-bold">
                  {result.isFeasible
                    ? `✓ Feasible: Design leg size (${formatNum(result.designS)}mm) is within AWS maximum boundary (${formatNum(result.maxS)}mm)`
                    : `⚠️ Oversized: Required weld (${formatNum(result.designS)}mm) exceeds max edge size (${formatNum(result.maxS)}mm). Increase weld length or use groove/PJP weld.`}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                AWS D1.1 Structural Welding Code: Throat t_e = 0.707·s • F_weld = 0.707·s·L·F_v • Min leg governed by thicker plate, max leg by thinner plate
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
