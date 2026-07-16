'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function ManifoldPressureCalculatorClient() {
  const [inputs, setInputs] = useState(["20","80","5","0.025","1000"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const Q=parseFloat(inputs[0])/1000,D=parseFloat(inputs[1])/1000,L=parseFloat(inputs[2]),f=parseFloat(inputs[3]),rho=parseFloat(inputs[4]);const A=Math.PI*D*D/4;const v=Q/A;const dP=f*L/D*0.5*rho*v*v/1000;const mu=0.001;const Re=rho*v*D/mu;return{v,dP,Re};
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Flow Rate (L/s)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Manifold Dia (mm)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="80"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Length (m)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Friction f</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="0.025"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="4">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Density (kg/m3)</label>
            <input type="text" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} placeholder="1000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["20","80","5","0.025","1000"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Velocity</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.v)}<span className="text-lg text-blue-400"> m/s</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Pressure Drop</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.dP)}<span className="text-lg text-green-400"> kPa</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Reynolds</div>
                <div className="text-3xl font-black text-orange-700">{formatNum(result.Re)}</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                dP = f*L/D*0.5*rho*v^2
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
