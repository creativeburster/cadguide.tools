'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function BernoulliEquationCalculatorClient() {
  const [inputs, setInputs] = useState(["200","2","0","5","3"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const P1=parseFloat(inputs[0])*1000,v1=parseFloat(inputs[1]),z1=parseFloat(inputs[2]),v2=parseFloat(inputs[3]),z2=parseFloat(inputs[4]);const rho=1000,g=9.81;const P2=P1+0.5*rho*(v1*v1-v2*v2)-rho*g*(z2-z1);const hL=(P1-P2)/(rho*g)+(v1*v1-v2*v2)/(2*g)+(z1-z2);return{P2:P2/1000,hL};
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">P1 (kPa)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">v1 (m/s)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">z1 (m)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="0"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">v2 (m/s)</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="4">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">z2 (m)</label>
            <input type="text" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["200","2","0","5","3"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">P2</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.P2)}<span className="text-lg text-blue-400"> kPa</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Head Loss</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.hL)}<span className="text-lg text-green-400"> m</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                P1/rg + v1^2/2g + z1 = P2/rg + v2^2/2g + z2
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
