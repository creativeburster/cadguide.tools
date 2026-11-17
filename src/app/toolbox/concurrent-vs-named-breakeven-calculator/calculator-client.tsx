'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Users, RotateCcw, Copy, Check, Download } from 'lucide-react';

function parsePositiveInt(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isInteger(n) && n >= 1 ? n : Number.NaN;
}

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmtUsd(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function FlexlmConcurrentBreakevenClient() {
  const [usersStr, setUsersStr] = useState('50');
  const [peakPctStr, setPeakPctStr] = useState('40');
  const [namedPriceStr, setNamedPriceStr] = useState('1865');
  const [concPriceStr, setConcPriceStr] = useState('2800');
  const [copied, setCopied] = useState(false);

  const applyPreset = (users: string, peak: string, namedP: string, concP: string) => {
    setUsersStr(users);
    setPeakPctStr(peak);
    setNamedPriceStr(namedP);
    setConcPriceStr(concP);
    setCopied(false);
  };

  const handleReset = () => applyPreset('50', '40', '1865', '2800');

  const r = useMemo(() => {
    const N = parsePositiveInt(usersStr);
    const peakPct = parsePositive(peakPctStr);
    const Pn = parsePositive(namedPriceStr);
    const Pc = parsePositive(concPriceStr);

    if (
      !Number.isFinite(N) ||
      !Number.isFinite(peakPct) ||
      peakPct > 100 ||
      !Number.isFinite(Pn) ||
      !Number.isFinite(Pc)
    ) {
      return { valid: false as const };
    }

    const peakRatio = peakPct / 100;
    const C = Math.ceil(N * peakRatio);
    const namedTotal = N * Pn;
    const concTotal = C * Pc;
    const breakevenSeatPrice = namedTotal / C;
    const breakevenMultiplier = breakevenSeatPrice / Pn;
    const breakevenMaxSeats = Math.floor(namedTotal / Pc);
    const breakevenConcurrencyPct = (Pn / Pc) * 100;
    const cheaper = namedTotal <= concTotal ? 'named' : 'concurrent';
    const savings = Math.abs(namedTotal - concTotal);

    return {
      valid: true as const,
      N,
      C,
      peakPct,
      Pn,
      Pc,
      namedTotal,
      concTotal,
      breakevenSeatPrice,
      breakevenMultiplier,
      breakevenMaxSeats,
      breakevenConcurrencyPct,
      cheaper,
      savings,
    };
  }, [usersStr, peakPctStr, namedPriceStr, concPriceStr]);

  const handleCopySummary = async () => {
    if (!r.valid) return;
    const text = [
      `Concurrent vs Named-User License Break-Even (${r.N} users, ${r.peakPct}% peak concurrency)`,
      `Required Floating Seats: ${r.C} | Named Total: ${fmtUsd(r.namedTotal)}/yr | Concurrent Total: ${fmtUsd(r.concTotal)}/yr`,
      `Winner: ${r.cheaper === 'named' ? 'Named-user' : 'Concurrent'} saves ${fmtUsd(r.savings)}/yr`,
      `Break-Even Floating Seat Ceiling: ${fmtUsd(r.breakevenSeatPrice)}/seat/yr (${r.breakevenMultiplier.toFixed(2)}x named price) | Max Equal-Cost Seats: ${r.breakevenMaxSeats}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!r.valid) return;
    const rows = [
      'metric,value,unit,notes',
      `total_named_users,${r.N},seats,Integer user count`,
      `peak_concurrency,${r.peakPct.toFixed(2)},pct,Target simultaneous active fraction`,
      `required_concurrent_seats,${r.C},seats,ceil(N * peak_pct / 100)`,
      `named_annual_cost,${r.namedTotal.toFixed(2)},USD/yr,N * named_price`,
      `concurrent_annual_cost,${r.concTotal.toFixed(2)},USD/yr,C * concurrent_price`,
      `annual_savings,${r.savings.toFixed(2)},USD/yr,Cheaper model: ${r.cheaper}`,
      `breakeven_concurrent_price,${r.breakevenSeatPrice.toFixed(2)},USD/seat/yr,${r.breakevenMultiplier.toFixed(2)}x named seat price`,
      `breakeven_max_concurrent_seats,${r.breakevenMaxSeats},seats,floor(named_annual_cost / concurrent_price)`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concurrent-vs-named-breakeven.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>
          <button
            type="button"
            data-testid="reset-button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="preset-50-40"
            onClick={() => applyPreset('50', '40', '1865', '2800')}
            className="px-3 py-2 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
          >
            50 Users / 40% Peak
          </button>
          <button
            type="button"
            data-testid="preset-heavy-80"
            onClick={() => applyPreset('20', '80', '1500', '2800')}
            className="px-3 py-2 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
          >
            20 Users / 80% Peak
          </button>
        </div>

        <div>
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
            Total Users (Named Seats)
          </label>
          <input
            data-testid="input-users"
            type="text"
            inputMode="numeric"
            value={usersStr}
            onChange={(e) => setUsersStr(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
            Peak Concurrency % (0 &lt; pct &le; 100)
          </label>
          <input
            data-testid="input-peak"
            type="text"
            inputMode="decimal"
            value={peakPctStr}
            onChange={(e) => setPeakPctStr(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
            Named-User Cost ($/yr)
          </label>
          <input
            data-testid="input-named-price"
            type="text"
            inputMode="decimal"
            value={namedPriceStr}
            onChange={(e) => setNamedPriceStr(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
            Concurrent Seat Cost ($/yr)
          </label>
          <input
            data-testid="input-conc-price"
            type="text"
            inputMode="decimal"
            value={concPriceStr}
            onChange={(e) => setConcPriceStr(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Floating pool size <code>C = ceil(N × peak%)</code>. Enter your actual vendor contract unit prices to compare total annual expenditure.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Annual Cost Comparison</h2>
                <div className="text-xs font-bold text-slate-500">
                  Required concurrent seats:{' '}
                  <span data-testid="result-conc-seats" className="text-indigo-700 font-black">
                    {r.valid ? r.C : '—'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="copy-summary-button"
                disabled={!r.valid}
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Summary'}
              </button>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!r.valid}
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`rounded-2xl p-6 border ${
                r.valid && r.cheaper === 'named' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-100'
              }`}
            >
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                Named-User Total ({r.valid ? `${r.N} seats` : '—'})
              </div>
              <div data-testid="result-named-total" className="text-3xl font-black text-slate-900">
                {r.valid ? fmtUsd(r.namedTotal) : '—'}
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 border ${
                r.valid && r.cheaper === 'concurrent' ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-100'
              }`}
            >
              <div className="text-xs font-black text-violet-500 uppercase tracking-wider mb-1">
                Concurrent Total ({r.valid ? `${r.C} seats` : '—'})
              </div>
              <div data-testid="result-conc-total" className="text-3xl font-black text-slate-900">
                {r.valid ? fmtUsd(r.concTotal) : '—'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="text-xs font-black text-slate-500 uppercase mb-1">Annual Cost Savings</div>
              <div data-testid="result-savings" className="text-2xl font-black text-slate-900">
                {r.valid ? fmtUsd(r.savings) : '—'}
              </div>
              <div data-testid="result-winner" className="text-xs font-bold text-emerald-700 mt-1">
                {r.valid ? `${r.cheaper === 'named' ? 'Named-user' : 'Concurrent'} wins at current inputs` : '—'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="text-xs font-black text-slate-500 uppercase mb-1">Break-Even Concurrent Seat Price</div>
              <div data-testid="result-breakeven-price" className="text-2xl font-black text-slate-900">
                {r.valid ? fmtUsd(r.breakevenSeatPrice) : '—'}
              </div>
              <div className="text-xs font-bold text-slate-600 mt-1">
                {r.valid
                  ? `${r.breakevenMultiplier.toFixed(2)}× named • Max equal seats: ${r.breakevenMaxSeats} (${r.breakevenConcurrencyPct.toFixed(1)}%)`
                  : '—'}
              </div>
            </div>
          </div>
        </div>
        <RelatedTools />
      </div>
    </div>
  );
}
