'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TruePositionClient() {
  const [toleranceDia, setToleranceDia] = useState(0.5);
  const [xOffset, setXOffset] = useState(0.15);
  const [yOffset, setYOffset] = useState(0.1);
  const [useBonus, setUseBonus] = useState(false);
  const [mmc, setMmc] = useState(10.0);
  const [actualSize, setActualSize] = useState(10.2);
  const [modifier, setModifier] = useState<'MMC' | 'LMC'>('MMC');

  const result = useMemo(() => {
    const tp = 2 * Math.sqrt(xOffset * xOffset + yOffset * yOffset);

    let bonus = 0;
    if (useBonus) {
      if (modifier === 'MMC') {
        bonus = Math.max(0, actualSize - mmc);
      } else {
        bonus = Math.max(0, mmc - actualSize);
      }
    }

    const totalTolerance = toleranceDia + bonus;
    const isPass = tp <= totalTolerance;
    const utilization = (tp / totalTolerance) * 100;

    return { tp, bonus, totalTolerance, isPass, utilization };
  }, [toleranceDia, xOffset, yOffset, useBonus, mmc, actualSize, modifier]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Position Tolerance Ø (mm)</label>
            <input type="number" step="0.01" value={toleranceDia} onChange={e => setToleranceDia(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">X Deviation (mm)</label>
            <input type="number" step="0.01" value={xOffset} onChange={e => setXOffset(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Y Deviation (mm)</label>
            <input type="number" step="0.01" value={yOffset} onChange={e => setYOffset(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useBonus} onChange={e => setUseBonus(e.target.checked)}
                className="w-5 h-5 rounded accent-indigo-600" />
              <span className="text-base font-black text-slate-400 uppercase tracking-wider">Apply Bonus Tolerance</span>
            </label>
          </div>

          {useBonus && (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Material Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['MMC', 'LMC'] as const).map(m => (
                    <button key={m} onClick={() => setModifier(m)}
                      className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${modifier === m ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{modifier} Size (mm)</label>
                <input type="number" step="0.01" value={mmc} onChange={e => setMmc(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Actual Feature Size (mm)</label>
                <input type="number" step="0.01" value={actualSize} onChange={e => setActualSize(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.isPass ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {result.isPass ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className={`rounded-2xl p-6 border mb-4 ${result.isPass ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className={`text-base font-black uppercase tracking-wider mb-2 ${result.isPass ? 'text-green-400' : 'text-red-400'}`}>
                True Position Deviation
              </div>
              <div className={`text-4xl font-black ${result.isPass ? 'text-green-700' : 'text-red-700'}`}>
                {result.tp.toFixed(4)}<span className="text-xl"> mm Ø</span>
              </div>
              <div className={`text-base font-medium mt-1 ${result.isPass ? 'text-green-600' : 'text-red-600'}`}>
                {result.isPass ? 'PASS — Within tolerance zone' : 'FAIL — Exceeds tolerance zone'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Specified Tol.</div>
                <div className="text-lg font-black text-slate-700">Ø{toleranceDia.toFixed(3)} mm</div>
              </div>
              {useBonus && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Bonus Tol.</div>
                  <div className="text-lg font-black text-slate-700">+{result.bonus.toFixed(3)} mm</div>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Total Allowance</div>
                <div className="text-lg font-black text-slate-700">Ø{result.totalTolerance.toFixed(3)} mm</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-base font-black text-slate-400 uppercase mb-1">Tolerance Utilization</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${result.utilization > 100 ? 'bg-red-500' : result.utilization > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, result.utilization)}%` }} />
                </div>
                <span className="text-lg font-black text-slate-700">{result.utilization.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                True Position = 2 × √(Δx² + Δy²). Bonus tolerance (MMC) = Actual Size − MMC Size. As the feature departs from MMC, additional position tolerance is allowed.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
