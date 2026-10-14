'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function PlasticShrinkageCalculatorClient() {
  const [inputs, setInputs] = useState(["100","0.5","60","220"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const L = parseFloat(inputs[0]) || 0;
    const baseRate = (parseFloat(inputs[1]) || 0.5) / 100;
    const moldT = parseFloat(inputs[2]) || 60;
    const meltT = parseFloat(inputs[3]) || 220;

    // Engineering thermal & crystallinity correction for injection molding:
    // Higher mold temp increases crystallinity & post-mold shrinkage (~0.25% per 10°C delta)
    // Higher melt temp increases volume contraction (~0.1% per 20°C delta)
    const moldFactor = 1 + 0.0025 * (moldT - 60);
    const meltFactor = 1 + 0.0005 * (meltT - 220);
    const effRate = Math.max(0.0005, baseRate * moldFactor * meltFactor);

    const S = L * effRate;
    const M = effRate < 1 ? L / (1 - effRate) : L;
    const effRatePct = effRate * 100;

    return { S, M, effRatePct };
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Part Dimension (mm)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Shrinkage Rate (%)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="0.5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Mold Temp (C)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="60"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Melt Temp (C)</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="220"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["100","0.5","60","220"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Linear Shrinkage</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.S)}<span className="text-lg text-blue-400"> mm</span></div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Required Mold Cavity</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.M)}<span className="text-lg text-green-400"> mm</span></div>
              </div>
              <div className="col-span-2 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Effective Total Shrinkage Rate</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.effRatePct)}<span className="text-sm font-medium text-purple-500"> % (adjusted for mold & melt temperatures)</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                S = L · S_eff, where S_eff is corrected for crystalline cooling gradient & melt expansion
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
