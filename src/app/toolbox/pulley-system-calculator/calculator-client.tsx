'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PulleyResult {
  valid: boolean;
  error?: string;
  idealMa: number;
  actualMa: number;
  effortForceN: number;
  systemEfficiencyPct: number;
  ropePullDistanceM: number;
  anchorLoadN: number;
}

function solvePulley(
  loadNStr: string,
  ropesStr: string,
  sheaveEffStr: string,
  liftDistMStr: string
): PulleyResult {
  if ([loadNStr, ropesStr, sheaveEffStr, liftDistMStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'Load, supporting rope falls, sheave efficiency, and lift height are required.', idealMa: 0, actualMa: 0, effortForceN: 0, systemEfficiencyPct: 0, ropePullDistanceM: 0, anchorLoadN: 0 };
  }
  const W = Number(loadNStr);
  const n = Number(ropesStr);
  const eta = Number(sheaveEffStr);
  const h = Number(liftDistMStr);

  if (![W, n, eta, h].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', idealMa: 0, actualMa: 0, effortForceN: 0, systemEfficiencyPct: 0, ropePullDistanceM: 0, anchorLoadN: 0 };
  }
  if (!Number.isInteger(n) || n < 1 || W <= 0 || h <= 0) {
    return { valid: false, error: 'Require integer supporting rope falls n >= 1, load W > 0, and lift height h > 0.', idealMa: 0, actualMa: 0, effortForceN: 0, systemEfficiencyPct: 0, ropePullDistanceM: 0, anchorLoadN: 0 };
  }
  if (eta <= 0 || eta > 1) {
    return { valid: false, error: 'Per-sheave efficiency must satisfy 0 < eta <= 1.0.', idealMa: 0, actualMa: 0, effortForceN: 0, systemEfficiencyPct: 0, ropePullDistanceM: 0, anchorLoadN: 0 };
  }

  const actualMa = Math.abs(eta - 1) < 1e-12 ? n : (1 - Math.pow(eta, n)) / (1 - eta);
  const effortForceN = W / actualMa;
  const systemEfficiencyPct = (actualMa / n) * 100;
  const ropePullDistanceM = n * h;
  const anchorLoadN = W + effortForceN;

  return { valid: true, idealMa: n, actualMa, effortForceN, systemEfficiencyPct, ropePullDistanceM, anchorLoadN };
}

export default function PulleySystemCalculatorClient() {
  const [loadStr, setLoadStr] = useState('1000');
  const [ropesStr, setRopesStr] = useState('4');
  const [etaStr, setEtaStr] = useState('0.96');
  const [liftStr, setLiftStr] = useState('2');

  const res = solvePulley(loadStr, ropesStr, etaStr, liftStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pulley Block & Tackle Mechanics Report', ''],
      ['Suspended Load W (N)', loadStr],
      ['Supporting Rope Falls n', ropesStr],
      ['Single Sheave Efficiency eta_s', etaStr],
      ['Load Lift Height h (m)', liftStr],
      ['Ideal Mechanical Advantage', String(res.idealMa)],
      ['Actual Mechanical Advantage', res.actualMa.toFixed(4)],
      ['Required Pull Force (N)', res.effortForceN.toFixed(4)],
      ['System Total Efficiency (%)', res.systemEfficiencyPct.toFixed(4)],
      ['Rope Travel Length (m)', res.ropePullDistanceM.toFixed(4)],
      ['Total Overhead Anchor Load (N)', res.anchorLoadN.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pulley-mechanical-advantage.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Load W (N)</label>
            <input type="text" inputMode="decimal" data-testid="input-load" value={loadStr} onChange={(e) => setLoadStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Supporting Rope Falls n</label>
            <input type="text" inputMode="numeric" data-testid="input-ropes" value={ropesStr} onChange={(e) => setRopesStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Per-Sheave Efficiency (eta_s)</label>
            <input type="text" inputMode="decimal" data-testid="input-eta" value={etaStr} onChange={(e) => setEtaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Lift Height h (m)</label>
            <input type="text" inputMode="decimal" data-testid="input-lift" value={liftStr} onChange={(e) => setLiftStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setLoadStr('1000'); setRopesStr('4'); setEtaStr('0.96'); setLiftStr('2'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Actual Mechanical Advantage</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-ma">{res.actualMa.toFixed(4)}<span className="text-lg text-blue-400"> :1</span></div>
                    <div className="text-xs text-blue-600 font-bold mt-1">Ideal MA: {res.idealMa} :1</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Haul Effort Force</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-force">{res.effortForceN.toFixed(4)}<span className="text-lg text-emerald-500"> N</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">System Efficiency</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-eff">{res.systemEfficiencyPct.toFixed(3)} %</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Rope Pull Length</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-rope-len">{res.ropePullDistanceM.toFixed(2)} m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Anchor Load</div>
                    <div className="text-xl font-black text-slate-900">{res.anchorLoadN.toFixed(2)} N</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Cumulative sheave friction series: Actual MA = (1 - eta_s^n) / (1 - eta_s) for eta_s &lt; 1 (and equals n when frictionless eta_s = 1).
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
