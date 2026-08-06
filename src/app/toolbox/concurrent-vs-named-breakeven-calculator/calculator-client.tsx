'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Users } from 'lucide-react';

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function FlexlmConcurrentBreakevenClient() {
  const [users, setUsers] = useState('50');
  const [peak, setPeak] = useState('40');
  const [namedPrice, setNamedPrice] = useState('1865');
  const [concPrice, setConcPrice] = useState('2800');

  const r = useMemo(() => {
    const N = Math.max(1, parseInt(users) || 1);
    const pk = Math.min(100, Math.max(1, parseFloat(peak) || 40)) / 100;
    const Pn = Math.max(0, parseFloat(namedPrice) || 0);
    const Pc = Math.max(0, parseFloat(concPrice) || 0);
    const C = Math.max(1, Math.ceil(N * pk));
    const namedTotal = N * Pn;
    const concTotal = C * Pc;
    // concurrent price at which both models cost the same
    const breakevenPremium = C > 0 ? namedTotal / C : 0;
    const cheaper = namedTotal <= concTotal ? 'named' : 'concurrent';
    const savings = Math.abs(namedTotal - concTotal);
    return { N, C, namedTotal, concTotal, breakevenPremium, cheaper, savings };
  }, [users, peak, namedPrice, concPrice]);

  const inputCls =
    'w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
        </div>
        <div>
          <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Total users (named seats)</label>
          <input type="number" min={1} value={users} onChange={(e) => setUsers(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Peak concurrency %</label>
          <input type="number" min={1} max={100} value={peak} onChange={(e) => setPeak(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Named-user $/yr</label>
          <input type="number" min={0} value={namedPrice} onChange={(e) => setNamedPrice(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Concurrent seat $/yr</label>
          <input type="number" min={0} value={concPrice} onChange={(e) => setConcPrice(e.target.value)} className={inputCls} />
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>Concurrent seats are sized at peak concurrency (users × peak%). Prices are your contract figures — concurrent seats typically carry a 1.4-1.6× premium over named-user.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Annual Cost — {r.N} users, {r.C} concurrent seats</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className={`rounded-2xl p-6 border ${r.cheaper === 'named' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-100'}`}>
              <div className="text-base font-black text-blue-500 uppercase tracking-wider mb-2">Named-user ({r.N} seats)</div>
              <div className="text-3xl font-black text-slate-900">{fmt(r.namedTotal)}</div>
            </div>
            <div className={`rounded-2xl p-6 border ${r.cheaper === 'concurrent' ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-100'}`}>
              <div className="text-base font-black text-violet-500 uppercase tracking-wider mb-2">Concurrent ({r.C} seats)</div>
              <div className="text-3xl font-black text-slate-900">{fmt(r.concTotal)}</div>
            </div>
          </div>
          <div className="bg-slate-950 rounded-2xl p-6 text-center space-y-2">
            <p className="text-lg font-black text-slate-100">
              <span className="text-emerald-400">{r.cheaper === 'named' ? 'Named-user' : 'Concurrent'}</span> is cheaper by{' '}
              <span className="text-emerald-400">{fmt(r.savings)}</span>/yr at these inputs.
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Break-even: concurrent seats cost up to {fmt(r.breakevenPremium)}/seat/yr ({(r.breakevenPremium / (parseFloat(namedPrice) || 1)).toFixed(2)}× named price) before named-user wins.
            </p>
          </div>
        </div>
        <RelatedTools />
      </div>
    </div>
  );
}
