'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download } from 'lucide-react';

export default function BendAllowanceClient() {
  const [thickness, setThickness] = useState(2.0);
  const [bendRadius, setBendRadius] = useState(3.0);
  const [bendAngle, setBendAngle] = useState(90);
  const [kFactor, setKFactor] = useState(0.33);
  const [flange1, setFlange1] = useState(50);
  const [flange2, setFlange2] = useState(50);

  const result = useMemo(() => {
    const T = thickness;
    const R = bendRadius;
    const A = bendAngle * Math.PI / 180;
    const K = kFactor;

    const bendAllowance = A * (R + K * T);
    const outsideSetback = R + T;
    const bendDeduction = 2 * outsideSetback * Math.tan(A / 2) - bendAllowance;
    const flatLength = flange1 + flange2 - bendDeduction;

    return { bendAllowance, outsideSetback, bendDeduction, flatLength };
  }, [thickness, bendRadius, bendAngle, kFactor, flange1, flange2]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material Thickness (mm)</label>
            <input type="number" step="0.1" value={thickness} onChange={e => setThickness(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Bend Radius (mm)</label>
            <input type="number" step="0.1" value={bendRadius} onChange={e => setBendRadius(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Bend Angle (°)</label>
            <input type="number" value={bendAngle} onChange={e => setBendAngle(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">K-Factor</label>
            <input type="number" step="0.01" value={kFactor} onChange={e => setKFactor(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[0.30, 0.33, 0.40, 0.42, 0.45].map(k => (
                <button key={k} onClick={() => setKFactor(k)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600 border border-slate-100 transition-all">
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flange 1 Length (mm)</label>
            <input type="number" value={flange1} onChange={e => setFlange1(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flange 2 Length (mm)</label>
            <input type="number" value={flange2} onChange={e => setFlange2(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Results</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-2">Bend Allowance</div>
                <div className="text-3xl font-black text-orange-700">{result.bendAllowance.toFixed(3)}<span className="text-lg text-orange-400"> mm</span></div>
                <div className="text-xs text-orange-600 font-medium mt-1">BA = A × (R + K×T)</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Bend Deduction</div>
                <div className="text-3xl font-black text-blue-700">{result.bendDeduction.toFixed(3)}<span className="text-lg text-blue-400"> mm</span></div>
                <div className="text-xs text-blue-600 font-medium mt-1">BD = 2×OSSB×tan(A/2) − BA</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Outside Setback (OSSB)</div>
                <div className="text-xl font-black text-slate-700">{result.outsideSetback.toFixed(2)} mm</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="text-xs font-black text-green-400 uppercase mb-1">Flat Pattern Length</div>
                <div className="text-xl font-black text-green-700">{result.flatLength.toFixed(2)} mm</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                K-Factor: 0.30 for air bending soft materials, 0.33 for typical, 0.40-0.45 for bottoming/coining. BA = angle × (R + K×T). BD = 2×OSSB×tan(A/2) − BA. Flat = Flange1 + Flange2 − BD.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
