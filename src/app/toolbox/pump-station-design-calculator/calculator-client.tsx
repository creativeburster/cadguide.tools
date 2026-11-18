'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PumpStationResult {
  valid: boolean;
  error?: string;
  qPumpM3h: number;
  cycleTimeMin: number;
  wetWellMinVolM3: number;
  basinAreaM2: number;
  circularDiaM: number;
}

function solvePumpStation(
  qPeakStr: string,
  maxStartsStr: string,
  dutyPumpsStr: string,
  activeDepthMStr: string
): PumpStationResult {
  if ([qPeakStr, maxStartsStr, dutyPumpsStr, activeDepthMStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All flow rate, start frequency, duty count, and active depth inputs are required.', qPumpM3h: 0, cycleTimeMin: 0, wetWellMinVolM3: 0, basinAreaM2: 0, circularDiaM: 0 };
  }
  const qPeak = Number(qPeakStr);
  const starts = Number(maxStartsStr);
  const duty = Number(dutyPumpsStr);
  const depthM = Number(activeDepthMStr);

  if (![qPeak, starts, duty, depthM].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', qPumpM3h: 0, cycleTimeMin: 0, wetWellMinVolM3: 0, basinAreaM2: 0, circularDiaM: 0 };
  }
  if (qPeak <= 0 || starts <= 0 || !Number.isInteger(duty) || duty < 1 || depthM <= 0) {
    return { valid: false, error: 'Require Q_peak > 0, starts/hr > 0, integer duty pumps >= 1, and active water depth > 0.', qPumpM3h: 0, cycleTimeMin: 0, wetWellMinVolM3: 0, basinAreaM2: 0, circularDiaM: 0 };
  }

  const qPumpM3h = qPeak / duty;
  const cycleTimeMin = 60 / starts;
  const wetWellMinVolM3 = (qPumpM3h * (cycleTimeMin / 60)) / 4;
  const basinAreaM2 = wetWellMinVolM3 / depthM;
  const circularDiaM = Math.sqrt((4 * basinAreaM2) / Math.PI);

  return { valid: true, qPumpM3h, cycleTimeMin, wetWellMinVolM3, basinAreaM2, circularDiaM };
}

export default function CalculatorClient() {
  const [qPeakStr, setQPeakStr] = useState('180');
  const [startsStr, setStartsStr] = useState('6');
  const [dutyStr, setDutyStr] = useState('2');
  const [depthStr, setDepthStr] = useState('1.5');

  const res = solvePumpStation(qPeakStr, startsStr, dutyStr, depthStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pump Station Wet Well Sizing Report', ''],
      ['Peak Inflow Rate (m3/h)', qPeakStr],
      ['Max Pump Starts per Hour', startsStr],
      ['Duty Pump Count', dutyStr],
      ['Active Operating Depth (m)', depthStr],
      ['Per-Pump Required Flow (m3/h)', res.qPumpM3h.toFixed(4)],
      ['Minimum Start Cycle Period (min)', res.cycleTimeMin.toFixed(2)],
      ['Minimum Effective Live Volume (m3)', res.wetWellMinVolM3.toFixed(4)],
      ['Required Basin Plan Area (m2)', res.basinAreaM2.toFixed(4)],
      ['Equivalent Circular Wet Well Dia (m)', res.circularDiaM.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pump-station-wet-well.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Peak Design Flow (m^3/h)</label>
            <input type="text" inputMode="decimal" data-testid="input-qpeak" value={qPeakStr} onChange={(e) => setQPeakStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Max Motor Starts / Hour</label>
            <input type="text" inputMode="decimal" data-testid="input-starts" value={startsStr} onChange={(e) => setStartsStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Duty Operating Pumps</label>
            <input type="text" inputMode="numeric" data-testid="input-duty" value={dutyStr} onChange={(e) => setDutyStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1.5">Active Drawdown Depth (m)</label>
            <input type="text" inputMode="decimal" data-testid="input-depth" value={depthStr} onChange={(e) => setDepthStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setQPeakStr('180'); setStartsStr('6'); setDutyStr('2'); setDepthStr('1.5'); }} className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Minimum Effective Wet Well Live Volume</div>
                  <div className="text-4xl font-black text-blue-900" data-testid="res-vmin">{res.wetWellMinVolM3.toFixed(4)} <span className="text-lg font-bold text-blue-600">m^3</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Single Pump Capacity</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-qpump">{res.qPumpM3h.toFixed(2)} m^3/h</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Basin Plan Area</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-area">{res.basinAreaM2.toFixed(4)} m^2</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Min Circular Dia</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-dia">{res.circularDiaM.toFixed(4)} m</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2.5 text-sm text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Analytical worst-case pump cycle derivation: cycle time T = V/Q_in + V/(Q_pump - Q_in) is minimized at Q_in = 0.5*Q_pump, yielding V_min = Q_pump * T_min / 4. Add a standby pump per project redundancy criteria.
              </span>
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
