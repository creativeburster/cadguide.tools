'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface ShrinkageResult {
  valid: boolean;
  error?: string;
  avgRatePct: number;
  cavityExactMm: number;
  cavityLinearMm: number;
  shrinkAllowanceMm: number;
  partMinMm: number;
  partMaxMm: number;
  totalSpreadMm: number;
}

function solvePlasticShrinkage(
  partDimStr: string,
  minRateStr: string,
  maxRateStr: string,
  moldTolStr: string
): ShrinkageResult {
  if ([partDimStr, minRateStr, maxRateStr, moldTolStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All shrinkage and tolerance parameters are required.', avgRatePct: 0, cavityExactMm: 0, cavityLinearMm: 0, shrinkAllowanceMm: 0, partMinMm: 0, partMaxMm: 0, totalSpreadMm: 0 };
  }
  const L = Number(partDimStr);
  const sMinPct = Number(minRateStr);
  const sMaxPct = Number(maxRateStr);
  const tol = Number(moldTolStr);

  if (![L, sMinPct, sMaxPct, tol].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', avgRatePct: 0, cavityExactMm: 0, cavityLinearMm: 0, shrinkAllowanceMm: 0, partMinMm: 0, partMaxMm: 0, totalSpreadMm: 0 };
  }
  if (L <= 0 || sMinPct <= 0 || sMaxPct <= 0 || tol < 0) {
    return { valid: false, error: 'Part dimension and shrinkage rates must be > 0, and mold tolerance >= 0.', avgRatePct: 0, cavityExactMm: 0, cavityLinearMm: 0, shrinkAllowanceMm: 0, partMinMm: 0, partMaxMm: 0, totalSpreadMm: 0 };
  }
  if (sMaxPct < sMinPct) {
    return { valid: false, error: 'Maximum shrinkage rate must be greater than or equal to minimum shrinkage rate.', avgRatePct: 0, cavityExactMm: 0, cavityLinearMm: 0, shrinkAllowanceMm: 0, partMinMm: 0, partMaxMm: 0, totalSpreadMm: 0 };
  }
  if (sMaxPct >= 25) {
    return { valid: false, error: 'Shrinkage rate must be less than 25%.', avgRatePct: 0, cavityExactMm: 0, cavityLinearMm: 0, shrinkAllowanceMm: 0, partMinMm: 0, partMaxMm: 0, totalSpreadMm: 0 };
  }

  const avgRatePct = 0.5 * (sMinPct + sMaxPct);
  const sAvg = avgRatePct / 100;
  const sMin = sMinPct / 100;
  const sMax = sMaxPct / 100;

  const cavityExactMm = L / (1 - sAvg);
  const cavityLinearMm = L * (1 + sAvg);
  const shrinkAllowanceMm = cavityExactMm - L;
  const partMinMm = (cavityExactMm - tol) * (1 - sMax);
  const partMaxMm = (cavityExactMm + tol) * (1 - sMin);
  const totalSpreadMm = partMaxMm - partMinMm;

  return {
    valid: true,
    avgRatePct,
    cavityExactMm,
    cavityLinearMm,
    shrinkAllowanceMm,
    partMinMm,
    partMaxMm,
    totalSpreadMm,
  };
}

export default function PlasticShrinkageCalculatorClient() {
  const [partDimStr, setPartDimStr] = useState('100');
  const [minRateStr, setMinRateStr] = useState('0.4');
  const [maxRateStr, setMaxRateStr] = useState('0.6');
  const [moldTolStr, setMoldTolStr] = useState('0.05');

  const res = solvePlasticShrinkage(partDimStr, minRateStr, maxRateStr, moldTolStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Plastic Mold Cavity Shrinkage Report', ''],
      ['Target Part Dimension (mm)', partDimStr],
      ['Minimum Shrinkage Rate (%)', minRateStr],
      ['Maximum Shrinkage Rate (%)', maxRateStr],
      ['Mold Machining Tolerance (+/- mm)', moldTolStr],
      ['Midpoint Shrinkage Rate (%)', res.avgRatePct.toFixed(4)],
      ['Exact Cavity Dimension L/(1-s) (mm)', res.cavityExactMm.toFixed(4)],
      ['Linear Approx Cavity L*(1+s) (mm)', res.cavityLinearMm.toFixed(4)],
      ['Shrinkage Allowance Delta (mm)', res.shrinkAllowanceMm.toFixed(4)],
      ['Predicted Min Part Size (mm)', res.partMinMm.toFixed(4)],
      ['Predicted Max Part Size (mm)', res.partMaxMm.toFixed(4)],
      ['Total Predicted Envelope Spread (mm)', res.totalSpreadMm.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plastic-shrinkage-cavity.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Target Part Dimension (mm)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-part-dim"
              value={partDimStr}
              onChange={(e) => setPartDimStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Min Shrinkage (%)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-min-rate"
                value={minRateStr}
                onChange={(e) => setMinRateStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Max Shrinkage (%)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-max-rate"
                value={maxRateStr}
                onChange={(e) => setMaxRateStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Mold Machining Tolerance (+/- mm)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-mold-tol"
              value={moldTolStr}
              onChange={(e) => setMoldTolStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setPartDimStr('100');
              setMinRateStr('0.4');
              setMaxRateStr('0.6');
              setMoldTolStr('0.05');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
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
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div
                data-testid="validation-error"
                className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700"
              >
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Exact Cavity Dimension L/(1-s)</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-cavity-exact">
                      {res.cavityExactMm.toFixed(4)}<span className="text-lg text-emerald-500"> mm</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">Midpoint shrinkage: {res.avgRatePct.toFixed(3)}%</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-sm font-black text-blue-500 uppercase tracking-wider mb-1">Mold Compensation Delta</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-shrink-mm">
                      {res.shrinkAllowanceMm.toFixed(4)}<span className="text-lg text-blue-400"> mm</span>
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-1">Linear approx L*(1+s): {res.cavityLinearMm.toFixed(4)} mm</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Min Molded Part</p>
                    <p className="text-xl font-black text-slate-900" data-testid="res-part-min">{res.partMinMm.toFixed(4)} mm</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Max Molded Part</p>
                    <p className="text-xl font-black text-slate-900" data-testid="res-part-max">{res.partMaxMm.toFixed(4)} mm</p>
                  </div>
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                    <p className="text-xs font-black text-purple-500 uppercase">Expected Part Band</p>
                    <p className="text-xl font-black text-purple-700" data-testid="res-spread">{res.totalSpreadMm.toFixed(4)} mm</p>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Exact cavity sizing inverts linear shrinkage relative to the cold mold dimension: L_part = L_cavity * (1 - s), so L_cavity = L_part / (1 - s). Obtain material shrinkage ranges from your resin supplier datasheet for the chosen wall thickness and gate geometry.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
