'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Scale } from 'lucide-react';
import { tools, type Tool } from '@/lib/data';
import { annualizedPrice } from '@/lib/utils';

const priced = tools
  .filter((t) => t.starting_price > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

const modelOf = (t: Tool) => (t.price_period === 'one-time' ? 'perpetual' : 'subscription');

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function CadLicenseTcoCalculatorClient() {
  const [slugA, setSlugA] = useState('autocad');
  const [slugB, setSlugB] = useState('bricscad');
  const [seats, setSeats] = useState('10');
  const [years, setYears] = useState('3');
  const [esc, setEsc] = useState('5'); // % annual subscription escalation (assumption)
  const [maint, setMaint] = useState('20'); // % of list, perpetual annual maintenance (assumption)

  const toolA = priced.find((t) => t.slug === slugA) ?? priced[0];
  const toolB = priced.find((t) => t.slug === slugB) ?? priced[1];

  const result = useMemo(() => {
    const S = Math.max(1, parseInt(seats) || 1);
    const Y = Math.min(10, Math.max(1, parseInt(years) || 3));
    const e = (parseFloat(esc) || 0) / 100;
    const m = (parseFloat(maint) || 0) / 100;

    const project = (t: Tool) => {
      const P = annualizedPrice(t);
      const rows: number[] = [];
      let total = 0;
      for (let y = 1; y <= Y; y++) {
        const c =
          modelOf(t) === 'subscription'
            ? P * Math.pow(1 + e, y - 1)
            : y === 1
              ? P
              : P * m;
        rows.push(c);
        total += c;
      }
      return { P, rows, total, totalSeats: total * S };
    };

    const a = project(toolA);
    const b = project(toolB);
    const diff = a.totalSeats - b.totalSeats;
    const cheaper = diff > 0 ? toolB : toolA;
    const pct =
      Math.max(a.totalSeats, b.totalSeats) > 0
        ? (Math.abs(diff) / Math.max(a.totalSeats, b.totalSeats)) * 100
        : 0;
    return { S, Y, a, b, diff, cheaper, pct };
  }, [toolA, toolB, seats, years, esc, maint]);

  const selectCls =
    'w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all';
  const inputCls =
    'w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all';

  const ToolCard = ({ t, r, accent }: { t: Tool; r: { P: number; rows: number[]; total: number; totalSeats: number }; accent: 'blue' | 'violet' }) => (
    <div className={`bg-white rounded-3xl border border-slate-100 p-8 shadow-sm ${accent === 'blue' ? 'border-t-4 border-t-blue-500' : 'border-t-4 border-t-violet-500'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-slate-900">{t.name}</h3>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${modelOf(t) === 'perpetual' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
          {modelOf(t) === 'perpetual' ? 'Perpetual buyout' : 'Subscription'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Year-1 / seat</div>
          <div className="text-2xl font-black text-slate-900">{fmt(r.P)}</div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{result.Y}-yr / seat</div>
          <div className="text-2xl font-black text-slate-900">{fmt(r.total)}</div>
        </div>
      </div>
      <div className={`text-3xl font-black ${accent === 'blue' ? 'text-blue-700' : 'text-violet-700'}`}>
        {fmt(r.totalSeats)}
        <span className="text-sm text-slate-400 font-bold"> / {result.S} seats × {result.Y} yrs</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {r.rows.map((c, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
            Y{i + 1}: {fmt(c)}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Comparison Setup</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Tool A</label>
            <select value={slugA} onChange={(e) => setSlugA(e.target.value)} className={selectCls}>
              {priced.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Tool B</label>
            <select value={slugB} onChange={(e) => setSlugB(e.target.value)} className={selectCls}>
              {priced.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Seats</label>
              <input type="number" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Years</label>
              <input type="number" min={1} max={10} value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sub. escalation %/yr</label>
              <input type="number" min={0} max={20} value={esc} onChange={(e) => setEsc(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Maint. % of list</label>
              <input type="number" min={0} max={40} value={maint} onChange={(e) => setMaint(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>Base prices come from the CADGuide catalog (starting price, period-aware). Escalation and maintenance are adjustable planning assumptions, not vendor quotes.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {result.Y}-Year TCO — {result.S} Seats
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToolCard t={toolA} r={result.a} accent="blue" />
              <ToolCard t={toolB} r={result.b} accent="violet" />
            </div>
            <div className="mt-6 bg-slate-950 rounded-2xl p-6 text-center">
              {result.pct < 1 ? (
                <p className="text-lg font-black text-slate-100">Roughly on par over {result.Y} years.</p>
              ) : (
                <p className="text-lg font-black text-slate-100">
                  <span className="text-emerald-400">{result.cheaper.name}</span> costs{' '}
                  <span className="text-emerald-400">{fmt(Math.abs(result.diff))}</span> less over {result.Y} years ({result.pct.toFixed(0)}% lower TCO).
                </p>
              )}
            </div>
          </div>
          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
