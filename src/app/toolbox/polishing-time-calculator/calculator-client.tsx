'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const FINISH_PRESETS = [
  { id: 'medium', label: 'Satin Finish (1.0x)', mult: '1.0', unitMinCm2: '0.03', compoundGMin: '0.5' },
  { id: 'fine', label: 'Fine Polish (1.5x)', mult: '1.5', unitMinCm2: '0.03', compoundGMin: '0.5' },
  { id: 'mirror', label: 'Mirror Buffing (2.0x)', mult: '2.0', unitMinCm2: '0.03', compoundGMin: '0.5' },
];

interface PolishingResult {
  valid: boolean;
  error?: string;
  timeMin: number;
  timeHours: number;
  compoundG: number;
  laborCost: number;
}

function solvePolishing(
  areaStr: string,
  unitTimeStr: string,
  multStr: string,
  compRateStr: string,
  hourlyRateStr: string
): PolishingResult {
  if ([areaStr, unitTimeStr, multStr, compRateStr, hourlyRateStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All surface area, polishing rate, multiplier, and cost inputs are required.', timeMin: 0, timeHours: 0, compoundG: 0, laborCost: 0 };
  }
  const A = Number(areaStr);
  const unitMin = Number(unitTimeStr);
  const mult = Number(multStr);
  const compRate = Number(compRateStr);
  const hourly = Number(hourlyRateStr);

  if (![A, unitMin, mult, compRate, hourly].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', timeMin: 0, timeHours: 0, compoundG: 0, laborCost: 0 };
  }
  if (A <= 0 || unitMin <= 0 || mult <= 0 || compRate < 0 || hourly < 0) {
    return { valid: false, error: 'Area, unit time rate, and stage multiplier must be > 0; compound rate and hourly cost must be >= 0.', timeMin: 0, timeHours: 0, compoundG: 0, laborCost: 0 };
  }

  const timeMin = A * unitMin * mult;
  const timeHours = timeMin / 60;
  const compoundG = timeMin * compRate;
  const laborCost = timeHours * hourly;

  return { valid: true, timeMin, timeHours, compoundG, laborCost };
}

export default function PolishingTimeCalculatorClient() {
  const [presetId, setPresetId] = useState('fine');
  const [areaStr, setAreaStr] = useState('500');
  const [unitTimeStr, setUnitTimeStr] = useState('0.03');
  const [multStr, setMultStr] = useState('1.5');
  const [compRateStr, setCompRateStr] = useState('0.5');
  const [hourlyRateStr, setHourlyRateStr] = useState('60');

  const res = solvePolishing(areaStr, unitTimeStr, multStr, compRateStr, hourlyRateStr);

  const handlePresetChange = (id: string) => {
    setPresetId(id);
    const p = FINISH_PRESETS.find((x) => x.id === id);
    if (p) setMultStr(p.mult);
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Polishing Time & Compound Report', ''],
      ['Surface Area (cm2)', areaStr],
      ['Base Unit Time Rate (min/cm2)', unitTimeStr],
      ['Stage Multiplier', multStr],
      ['Compound Consumption Rate (g/min)', compRateStr],
      ['Labor Rate ($/hr)', hourlyRateStr],
      ['Total Polishing Time (min)', res.timeMin.toFixed(3)],
      ['Total Polishing Time (hr)', res.timeHours.toFixed(4)],
      ['Estimated Compound (g)', res.compoundG.toFixed(3)],
      ['Estimated Labor Cost ($)', res.laborCost.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polishing-time-estimate.csv';
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Finish Preset</label>
            <select
              value={presetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold"
            >
              {FINISH_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Surface Area (cm^2)</label>
            <input type="text" inputMode="decimal" data-testid="input-area" value={areaStr} onChange={(e) => setAreaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Unit Rate (min/cm^2)</label>
              <input type="text" inputMode="decimal" data-testid="input-unit-time" value={unitTimeStr} onChange={(e) => setUnitTimeStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Stage Multiplier</label>
              <input type="text" inputMode="decimal" data-testid="input-mult" value={multStr} onChange={(e) => setMultStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Compound (g/min)</label>
              <input type="text" inputMode="decimal" data-testid="input-comp-rate" value={compRateStr} onChange={(e) => setCompRateStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Labor Cost ($/hr)</label>
              <input type="text" inputMode="decimal" data-testid="input-hourly" value={hourlyRateStr} onChange={(e) => setHourlyRateStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPresetId('fine');
              setAreaStr('500');
              setUnitTimeStr('0.03');
              setMultStr('1.5');
              setCompRateStr('0.5');
              setHourlyRateStr('60');
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
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Estimated Polishing Time</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-time-min">
                      {res.timeMin.toFixed(2)}<span className="text-lg text-blue-400"> min</span>
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-1">{res.timeHours.toFixed(3)} hours</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Compound Consumption</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-compound">
                      {res.compoundG.toFixed(2)}<span className="text-lg text-emerald-500"> g</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-1" data-testid="res-cost">
                      Estimated Labor Cost: ${res.laborCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              t = A * unit_time_rate * stage_multiplier; calibrate unit_time_rate from shop-floor test coupons for the specific alloy, grit progression, and buffing wheel pressure.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
