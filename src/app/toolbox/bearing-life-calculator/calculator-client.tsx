'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function BearingLifeCalculatorClient() {
  const [inputs, setInputs] = useState(["50","5","1500","ball"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const C=parseFloat(inputs[0])*1000,P=parseFloat(inputs[1])*1000,n=parseFloat(inputs[2]);const p=inputs[3]==='ball'?3:10/3;const L10=Math.pow(C/P,p);const L10h=n>0?L10*1e6/(60*n):0;return{L10,L10h};
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Dynamic Load C (kN)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="50"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Equivalent Load P (kN)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Speed (RPM)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="1500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Type</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="ball"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["50","5","1500","ball"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">L10</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.L10)}<span className="text-lg text-blue-400"> Mr</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">L10h</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.L10h)}<span className="text-lg text-green-400"> hours</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                L10 = (C/P)^p, p=3 for ball, 10/3 for roller
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
