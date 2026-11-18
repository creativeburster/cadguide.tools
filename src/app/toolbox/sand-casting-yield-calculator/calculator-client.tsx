'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface SandCastingResult {
  valid: boolean;
  error?: string;
  netCastingsKg: number;
  totalPourKg: number;
  yieldPct: number;
  returnScrapKg: number;
  chargeRequiredKg: number;
}

function solveSandCastingYield(
  partWtStr: string,
  cavitiesStr: string,
  riserWtStr: string,
  gatingWtStr: string,
  meltLossPctStr: string
): SandCastingResult {
  if ([partWtStr, cavitiesStr, riserWtStr, gatingWtStr, meltLossPctStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All part mass, cavity count, riser, gating, and melting loss inputs are required.', netCastingsKg: 0, totalPourKg: 0, yieldPct: 0, returnScrapKg: 0, chargeRequiredKg: 0 };
  }
  const partWt = Number(partWtStr);
  const cavities = Number(cavitiesStr);
  const riser = Number(riserWtStr);
  const gating = Number(gatingWtStr);
  const lossPct = Number(meltLossPctStr);

  if (![partWt, cavities, riser, gating, lossPct].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', netCastingsKg: 0, totalPourKg: 0, yieldPct: 0, returnScrapKg: 0, chargeRequiredKg: 0 };
  }
  if (partWt <= 0 || !Number.isInteger(cavities) || cavities < 1 || riser < 0 || gating < 0 || lossPct < 0 || lossPct >= 100) {
    return { valid: false, error: 'Require part weight > 0, integer cavities >= 1, riser/gating >= 0, and 0 <= melting loss < 100%.', netCastingsKg: 0, totalPourKg: 0, yieldPct: 0, returnScrapKg: 0, chargeRequiredKg: 0 };
  }

  const netCastingsKg = partWt * cavities;
  const returnScrapKg = riser + gating;
  const totalPourKg = netCastingsKg + returnScrapKg;
  const yieldPct = (netCastingsKg / totalPourKg) * 100;
  const chargeRequiredKg = totalPourKg / (1 - lossPct / 100);

  return { valid: true, netCastingsKg, totalPourKg, yieldPct, returnScrapKg, chargeRequiredKg };
}

export default function SandCastingYieldCalculatorClient() {
  const [partStr, setPartStr] = useState('15');
  const [cavStr, setCavStr] = useState('1');
  const [riserStr, setRiserStr] = useState('5');
  const [gatingStr, setGatingStr] = useState('2');
  const [lossStr, setLossStr] = useState('5');

  const res = solveSandCastingYield(partStr, cavStr, riserStr, gatingStr, lossStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Sand Casting Metal Yield & Charge Report', ''],
      ['Single Net Part Mass (kg)', partStr],
      ['Cavities per Mold', cavStr],
      ['Total Net Castings per Mold (kg)', res.netCastingsKg.toFixed(3)],
      ['Riser / Feeder Mass (kg)', riserStr],
      ['Gating Runner System Mass (kg)', gatingStr],
      ['Furnace Melting Loss (%)', lossStr],
      ['Total Poured Metal per Mold (kg)', res.totalPourKg.toFixed(3)],
      ['Casting Process Yield (%)', res.yieldPct.toFixed(3)],
      ['Furnace Charge Metal Required (kg)', res.chargeRequiredKg.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sand-casting-yield.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Mold Mass Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Part Mass (kg)</label>
              <input type="text" inputMode="decimal" data-testid="input-part" value={partStr} onChange={(e) => setPartStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cavities / Mold</label>
              <input type="text" inputMode="numeric" data-testid="input-cavities" value={cavStr} onChange={(e) => setCavStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Riser Mass (kg)</label>
              <input type="text" inputMode="decimal" data-testid="input-riser" value={riserStr} onChange={(e) => setRiserStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Gating Mass (kg)</label>
              <input type="text" inputMode="decimal" data-testid="input-gating" value={gatingStr} onChange={(e) => setGatingStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Melting Loss (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-loss" value={lossStr} onChange={(e) => setLossStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setPartStr('15'); setCavStr('1'); setRiserStr('5'); setGatingStr('2'); setLossStr('5'); }} className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200">Reset</button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Yield &amp; Charge Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Casting Yield</div>
                  <div className="text-4xl font-black text-emerald-800" data-testid="res-yield">{res.yieldPct.toFixed(3)} %</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1" data-testid="res-castings">Net Castings: {res.netCastingsKg.toFixed(2)} kg</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Total Poured Mass</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-pour">{res.totalPourKg.toFixed(3)} kg</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Furnace Charge Needed</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-charge">{res.chargeRequiredKg.toFixed(3)} kg</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-xs font-black text-slate-500 uppercase mb-1">Riser + Gating Return</div>
                  <div className="text-3xl font-black text-slate-900" data-testid="res-return">{res.returnScrapKg.toFixed(2)} kg</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Total Pour = Cavities * Part Mass + Riser + Gating; Yield (%) = (Net Castings / Total Pour) * 100; Furnace Charge = Total Pour / (1 - Melting Loss / 100).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
