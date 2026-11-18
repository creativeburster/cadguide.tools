'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface RoundaboutResult {
  valid: boolean;
  error?: string;
  entryCapacityVph: number;
  vcRatio: number;
  reserveCapacityVph: number;
}

function solveRoundabout(
  circFlowStr: string,
  demandStr: string,
  interceptAStr: string,
  decayBStr: string
): RoundaboutResult {
  if ([circFlowStr, demandStr, interceptAStr, decayBStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All circulating flow, approach demand, intercept A, and slope B inputs are required.', entryCapacityVph: 0, vcRatio: 0, reserveCapacityVph: 0 };
  }
  const vc = Number(circFlowStr);
  const dem = Number(demandStr);
  const A = Number(interceptAStr);
  const B = Number(decayBStr);

  if (![vc, dem, A, B].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', entryCapacityVph: 0, vcRatio: 0, reserveCapacityVph: 0 };
  }
  if (vc < 0 || dem < 0 || A <= 0 || B <= 0) {
    return { valid: false, error: 'Require flows >= 0, intercept A > 0, and exponential decay B > 0.', entryCapacityVph: 0, vcRatio: 0, reserveCapacityVph: 0 };
  }

  const entryCapacityVph = A * Math.exp(-B * vc);
  const vcRatio = dem / entryCapacityVph;
  const reserveCapacityVph = entryCapacityVph - dem;

  return { valid: true, entryCapacityVph, vcRatio, reserveCapacityVph };
}

export default function RoundaboutCapacityClient() {
  const [vcStr, setVcStr] = useState('750');
  const [demStr, setDemStr] = useState('480');
  const [aStr, setAStr] = useState('1130');
  const [bStr, setBStr] = useState('0.0010');

  const res = solveRoundabout(vcStr, demStr, aStr, bStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Roundabout Exponential Gap-Acceptance Capacity Report', ''],
      ['Circulating Flow Vc (veh/h)', vcStr],
      ['Approach Demand Vd (veh/h)', demStr],
      ['Intercept Parameter A (veh/h)', aStr],
      ['Exponential Decay Parameter B (h/veh)', bStr],
      ['Entry Capacity Ce (veh/h)', res.entryCapacityVph.toFixed(2)],
      ['Volume-to-Capacity Ratio (v/c)', res.vcRatio.toFixed(4)],
      ['Reserve Capacity (veh/h)', res.reserveCapacityVph.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roundabout-capacity.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Gap-Acceptance Inputs</h2>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => { setAStr('1130'); setBStr('0.0010'); }} className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-700">1-Lane (1130, 0.0010)</button>
            <button type="button" onClick={() => { setAStr('1420'); setBStr('0.0009'); }} className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-700">2-Lane (1420, 0.0009)</button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Circulating Flow V_c (veh/h)</label>
            <input type="text" inputMode="decimal" data-testid="input-vc" value={vcStr} onChange={(e) => setVcStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Approach Demand V_d (veh/h)</label>
            <input type="text" inputMode="decimal" data-testid="input-demand" value={demStr} onChange={(e) => setDemStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Intercept A (veh/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-a" value={aStr} onChange={(e) => setAStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Decay B (h/veh)</label>
              <input type="text" inputMode="decimal" data-testid="input-b" value={bStr} onChange={(e) => setBStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button type="button" onClick={() => { setVcStr('750'); setDemStr('480'); setAStr('1130'); setBStr('0.0010'); }} className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200">Reset</button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Entry Capacity Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border ${res.vcRatio <= 0.85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : res.vcRatio <= 1.0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {res.vcRatio <= 0.85 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{res.vcRatio <= 0.85 ? 'Undersaturated (v/c <= 0.85)' : res.vcRatio <= 1.0 ? 'Near Capacity (0.85 < v/c <= 1.0)' : 'Oversaturated (v/c > 1.0)'}</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Approach Entry Capacity Ce</div>
                  <div className="text-4xl sm:text-5xl font-black text-blue-900" data-testid="res-ce">{res.entryCapacityVph.toFixed(2)} veh/h</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Volume-to-Capacity Ratio (v/c)</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-vc">{res.vcRatio.toFixed(4)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Reserve Capacity (Ce - Vd)</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-reserve">{res.reserveCapacityVph.toFixed(2)} veh/h</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Exponential gap-acceptance model Ce = A * exp(-B * Vc), with user-calibrated intercept A and exponential decay slope B for local roundabout geometry.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
