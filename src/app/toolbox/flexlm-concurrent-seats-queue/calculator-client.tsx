'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, AlertTriangle, RotateCcw, Copy, Check, Download, Users } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictPosInt(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 ? n : Number.NaN;
}

function erlangB(m: number, A: number): number {
  let b = 1.0;
  for (let k = 1; k <= m; k++) {
    b = (A * b) / (k + A * b);
  }
  return b;
}

function erlangC(m: number, A: number): number {
  if (m <= A) return Number.NaN;
  const b = erlangB(m, A);
  return (m * b) / (m - A * (1 - b));
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default Team (50 users, 3h/8h, Fp=1.3, m=34)', users: '50', hd: '3.0', hw: '8.0', fp: '1.3', ts: '2.0', m: '34', floatCost: '3000', namedCost: '2000' },
  { id: 'tight-pool', label: 'Tight Pool (m=28 seats)', users: '50', hd: '3.0', hw: '8.0', fp: '1.3', ts: '2.0', m: '28', floatCost: '3000', namedCost: '2000' },
  { id: 'overloaded', label: 'Queue Overload (m=20 < A=24.38)', users: '50', hd: '3.0', hw: '8.0', fp: '1.3', ts: '2.0', m: '20', floatCost: '3000', namedCost: '2000' },
];

export default function FlexlmQueueClient() {
  const [usersStr, setUsersStr] = useState('50');
  const [hdStr, setHdStr] = useState('3.0');
  const [hwStr, setHwStr] = useState('8.0');
  const [fpStr, setFpStr] = useState('1.3');
  const [tsStr, setTsStr] = useState('2.0');
  const [seatsStr, setSeatsStr] = useState('34');
  const [floatingCostStr, setFloatingCostStr] = useState('3000');
  const [namedCostStr, setNamedCostStr] = useState('2000');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setUsersStr(p.users);
    setHdStr(p.hd);
    setHwStr(p.hw);
    setFpStr(p.fp);
    setTsStr(p.ts);
    setSeatsStr(p.m);
    setFloatingCostStr(p.floatCost);
    setNamedCostStr(p.namedCost);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const U = parseStrictPosInt(usersStr);
    const Hd = parseStrictPositive(hdStr);
    const Hw = parseStrictPositive(hwStr);
    const Fp = parseStrictPositive(fpStr);
    const Ts = parseStrictPositive(tsStr);
    const m = parseStrictPosInt(seatsStr);
    const floatingCost = parseStrictPositive(floatingCostStr);
    const namedCost = parseStrictPositive(namedCostStr);

    if (
      !Number.isFinite(U) ||
      !Number.isFinite(Hd) ||
      !Number.isFinite(Hw) ||
      !Number.isFinite(Fp) ||
      !Number.isFinite(Ts) ||
      !Number.isFinite(m) ||
      !Number.isFinite(floatingCost) ||
      !Number.isFinite(namedCost)
    ) {
      return { valid: false as const, errorMsg: 'Enter valid positive numbers (integer Users U >= 1, Seats m >= 1).' };
    }
    if (Hd > Hw) {
      return { valid: false as const, errorMsg: 'Daily usage hours Hd cannot exceed shift window Hw.' };
    }

    const offeredLoad = U * (Hd / Hw) * Fp;
    const pbPct = erlangB(m, offeredLoad) * 100;
    const pcVal = erlangC(m, offeredLoad);
    const queueStable = Number.isFinite(pcVal);
    const pcPct = queueStable ? pcVal * 100 : Number.NaN;
    const waitMin = queueStable ? ((pcVal * Ts) / (m - offeredLoad)) * 60 : Number.NaN;

    const namedTotalCost = U * namedCost;
    const floatingTotalCost = m * floatingCost;
    const savings = namedTotalCost - floatingTotalCost;

    // Sensitivity curve for m-4 .. m+4 (>= 1)
    const rows: { seats: number; pbPct: number; pcPct: number; stable: boolean }[] = [];
    const startM = Math.max(1, Math.floor(offeredLoad) - 2);
    const endM = startM + 10;
    for (let s = startM; s <= endM; s++) {
      const cVal = erlangC(s, offeredLoad);
      rows.push({
        seats: s,
        pbPct: erlangB(s, offeredLoad) * 100,
        pcPct: Number.isFinite(cVal) ? cVal * 100 : Number.NaN,
        stable: Number.isFinite(cVal),
      });
    }

    return {
      valid: true as const,
      U,
      Hd,
      Hw,
      Fp,
      Ts,
      m,
      offeredLoad,
      pbPct,
      pcPct,
      waitMin,
      queueStable,
      namedTotalCost,
      floatingTotalCost,
      savings,
      rows,
    };
  }, [usersStr, hdStr, hwStr, fpStr, tsStr, seatsStr, floatingCostStr, namedCostStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Concurrent License Pool Sizing (Erlang-B & Erlang-C)`,
      `Users=${result.U}, Offered Load A=${result.offeredLoad.toFixed(3)} Erlangs, Pool Seats m=${result.m}`,
      `Erlang-B Denial Probability P_B = ${result.pbPct.toFixed(3)}%`,
      `Erlang-C Queue Wait Probability P_C = ${result.queueStable ? `${result.pcPct.toFixed(3)}% (Avg Wait ${result.waitMin.toFixed(2)} min)` : 'Queue Unstable (m <= A)'}`,
      `Cost Comparison: Named $${result.namedTotalCost.toFixed(0)}/yr vs Floating $${result.floatingTotalCost.toFixed(0)}/yr (Delta $${result.savings.toFixed(0)}/yr)`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Metric', 'Value', 'Unit'],
      ['Total Active Users U', String(result.U), 'users'],
      ['Offered Load A', result.offeredLoad.toFixed(3), 'Erlangs'],
      ['Selected Floating Seats m', String(result.m), 'seats'],
      ['Erlang-B Denial Prob P_B', result.pbPct.toFixed(3), '%'],
      ['Erlang-C Wait Prob P_C', result.queueStable ? result.pcPct.toFixed(3) : 'OVERLOAD', '%'],
      ['Expected Queue Delay', result.queueStable ? result.waitMin.toFixed(2) : 'OVERLOAD', 'min'],
      ['Named-User Total Cost', result.namedTotalCost.toFixed(2), 'USD/yr'],
      ['Floating Pool Total Cost', result.floatingTotalCost.toFixed(2), 'USD/yr'],
      ...result.rows.map((r) => [
        `Sensitivity m=${r.seats}`,
        `PB=${r.pbPct.toFixed(3)}%`,
        r.stable ? `PC=${r.pcPct.toFixed(3)}%` : 'OVERLOAD',
      ]),
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concurrent-license-erlang-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Pool Parameters</h2>
          </div>

          {[
            { id: 'users', label: 'Active Team Users U', val: usersStr, set: setUsersStr },
            { id: 'hd', label: 'Avg Daily Usage Hd (hr)', val: hdStr, set: setHdStr },
            { id: 'hw', label: 'Shift Window Hw (hr)', val: hwStr, set: setHwStr },
            { id: 'fp', label: 'Peak Multiplier Fp', val: fpStr, set: setFpStr },
            { id: 'ts', label: 'Avg Session Duration Ts (hr)', val: tsStr, set: setTsStr },
            { id: 'seats', label: 'License Pool Seats m', val: seatsStr, set: setSeatsStr },
            { id: 'floating-cost', label: 'Floating Seat Cost (USD/yr)', val: floatingCostStr, set: setFloatingCostStr },
            { id: 'named-cost', label: 'Named Seat Cost (USD/yr)', val: namedCostStr, set: setNamedCostStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Erlang-B & Erlang-C Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Offered Load A</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-offered-load">{result.valid ? result.offeredLoad.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-blue-500">Erlangs</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Erlang-B Denial P_B</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-pb">{result.valid ? result.pbPct.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-emerald-500">%</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Erlang-C Queue P_C</div>
                <div className="text-2xl font-black text-amber-900">
                  <span data-testid="result-pc">{result.valid && result.queueStable ? result.pcPct.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-amber-600">%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Avg Wait (Queue)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-wait">{result.valid && result.queueStable ? result.waitMin.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">min</span>
                </div>
              </div>
            </div>

            {result.valid && !result.queueStable && (
              <div data-testid="overload-warning" className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
                Offered load A ({result.offeredLoad.toFixed(2)}) meets or exceeds pool seats m ({result.m}). Erlang-C queue is unstable (infinite wait without rejection), while Erlang-B blocking probability remains {result.pbPct.toFixed(2)}%.
              </div>
            )}

            {result.valid && (
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-bold">Named Total</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    $<span data-testid="result-named-cost">{result.namedTotalCost.toFixed(0)}</span>/yr
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-bold">Floating Pool Total</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    $<span data-testid="result-floating-cost">{result.floatingTotalCost.toFixed(0)}</span>/yr
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-bold">Annual Cost Delta</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    $<span data-testid="result-savings">{result.savings.toFixed(0)}</span>/yr
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Offered traffic A = U*(Hd/Hw)*Fp. Erlang-B assumes denied checkout requests are cleared immediately without retrying; Erlang-C assumes requests queue indefinitely (valid only when m &gt; A). Unit prices are user-editable budget assumptions.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
