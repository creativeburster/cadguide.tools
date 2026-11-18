'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RainwaterResult {
  valid: boolean;
  error?: string;
  annualYieldM3: number;
  avgDailySupplyL: number;
  demandCoveragePct: number;
  tankSizeM3: number;
}

function solveRainwater(
  areaM2Str: string,
  rainMmStr: string,
  runoffCoeffStr: string,
  filterEffPctStr: string,
  dailyDemandLStr: string,
  dryDaysStr: string
): RainwaterResult {
  if ([areaM2Str, rainMmStr, runoffCoeffStr, filterEffPctStr, dailyDemandLStr, dryDaysStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All roof area, rainfall, runoff, filter efficiency, demand, and storage day parameters are required.', annualYieldM3: 0, avgDailySupplyL: 0, demandCoveragePct: 0, tankSizeM3: 0 };
  }
  const A = Number(areaM2Str);
  const R = Number(rainMmStr);
  const Cr = Number(runoffCoeffStr);
  const etaF = Number(filterEffPctStr);
  const demandL = Number(dailyDemandLStr);
  const days = Number(dryDaysStr);

  if (![A, R, Cr, etaF, demandL, days].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', annualYieldM3: 0, avgDailySupplyL: 0, demandCoveragePct: 0, tankSizeM3: 0 };
  }
  if (A <= 0 || R <= 0 || Cr <= 0 || Cr > 1 || etaF <= 0 || etaF > 100 || demandL <= 0 || days <= 0) {
    return { valid: false, error: 'Require A > 0, rainfall > 0, 0 < Cr <= 1, 0 < filter eff <= 100%, demand > 0, and storage days > 0.', annualYieldM3: 0, avgDailySupplyL: 0, demandCoveragePct: 0, tankSizeM3: 0 };
  }

  const annualYieldM3 = A * (R / 1000) * Cr * (etaF / 100);
  const avgDailySupplyL = (annualYieldM3 * 1000) / 365;
  const demandCoveragePct = (avgDailySupplyL / demandL) * 100;
  const tankSizeM3 = (demandL * days) / 1000;

  return { valid: true, annualYieldM3, avgDailySupplyL, demandCoveragePct, tankSizeM3 };
}

export default function RainwaterHarvestingCalculatorClient() {
  const [areaStr, setAreaStr] = useState('100');
  const [rainStr, setRainStr] = useState('800');
  const [crStr, setCrStr] = useState('0.8');
  const [filterStr, setFilterStr] = useState('90');
  const [demandStr, setDemandStr] = useState('150');
  const [daysStr, setDaysStr] = useState('30');

  const res = solveRainwater(areaStr, rainStr, crStr, filterStr, demandStr, daysStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Rainwater Harvesting & Cistern Sizing Report', ''],
      ['Catchment Roof Area (m2)', areaStr],
      ['Annual Rainfall (mm)', rainStr],
      ['Runoff Coefficient Cr', crStr],
      ['Filter & First-Flush Efficiency (%)', filterStr],
      ['Daily Non-Potable Demand (L/day)', demandStr],
      ['Dry-Period Reserve Days', daysStr],
      ['Annual Net Harvested Volume (m3)', res.annualYieldM3.toFixed(4)],
      ['Average Daily Available Yield (L/day)', res.avgDailySupplyL.toFixed(4)],
      ['Annual Demand Coverage (%)', res.demandCoveragePct.toFixed(2)],
      ['Recommended Reserve Cistern Size (m3)', res.tankSizeM3.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rainwater-harvesting.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Roof Area (m^2)</label>
              <input type="text" inputMode="decimal" data-testid="input-area" value={areaStr} onChange={(e) => setAreaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Rainfall (mm/yr)</label>
              <input type="text" inputMode="decimal" data-testid="input-rain" value={rainStr} onChange={(e) => setRainStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Runoff Coeff Cr</label>
              <input type="text" inputMode="decimal" data-testid="input-cr" value={crStr} onChange={(e) => setCrStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Filter Eff (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-filter" value={filterStr} onChange={(e) => setFilterStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Daily Demand (L/d)</label>
              <input type="text" inputMode="decimal" data-testid="input-demand" value={demandStr} onChange={(e) => setDemandStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Reserve Days</label>
              <input type="text" inputMode="decimal" data-testid="input-days" value={daysStr} onChange={(e) => setDaysStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button type="button" onClick={() => { setAreaStr('100'); setRainStr('800'); setCrStr('0.8'); setFilterStr('90'); setDemandStr('150'); setDaysStr('30'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
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
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 disabled:opacity-50">
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
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Annual Net Collection</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-annual">{res.annualYieldM3.toFixed(4)}<span className="text-lg text-blue-400"> m^3/yr</span></div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Reserve Cistern Volume</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-tank">{res.tankSizeM3.toFixed(4)}<span className="text-lg text-emerald-500"> m^3</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Mean Daily Yield</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-daily">{res.avgDailySupplyL.toFixed(2)} L/day</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Annual Demand Coverage</div>
                    <div className="text-xl font-black text-slate-900">{res.demandCoveragePct.toFixed(2)} %</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              V_yr = Area * (Rainfall/1000) * Cr * (FilterEff/100); Cistern Volume = DailyDemand * ReserveDays / 1000.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
