'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Gauge,
  Info,
  RotateCcw,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface OeePreset {
  id: string;
  label: string;
  shiftHours: string;
  plannedBreaksMin: string;
  unplannedDowntimeMin: string;
  idealCycleSec: string;
  totalUnits: string;
  defectiveUnits: string;
}

const PRESETS: OeePreset[] = [
  {
    id: 'baseline-shift',
    label: 'Baseline 8h CNC Shift (1050 pcs, 35 scrap)',
    shiftHours: '8',
    plannedBreaksMin: '60',
    unplannedDowntimeMin: '45',
    idealCycleSec: '20',
    totalUnits: '1050',
    defectiveUnits: '35',
  },
  {
    id: 'high-efficiency',
    label: 'High-Uptime Shift (8h, 15m breaks, 12m downtime, 1440 pcs)',
    shiftHours: '8',
    plannedBreaksMin: '15',
    unplannedDowntimeMin: '12',
    idealCycleSec: '18',
    totalUnits: '1440',
    defectiveUnits: '4',
  },
  {
    id: 'bottleneck-line',
    label: 'Heavy Setup Loss Shift (10h, 40m breaks, 110m downtime, 820 pcs)',
    shiftHours: '10',
    plannedBreaksMin: '40',
    unplannedDowntimeMin: '110',
    idealCycleSec: '25',
    totalUnits: '820',
    defectiveUnits: '45',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function parseNonNegInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) ? n : NaN;
}

function fmt(n: number, decimals = 4): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

export default function OEECalculatorClient() {
  const [shiftHoursStr, setShiftHoursStr] = useState('8');
  const [breaksStr, setBreaksStr] = useState('60');
  const [downtimeStr, setDowntimeStr] = useState('45');
  const [idealCycleStr, setIdealCycleStr] = useState('20');
  const [totalUnitsStr, setTotalUnitsStr] = useState('1050');
  const [defectUnitsStr, setDefectUnitsStr] = useState('35');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: OeePreset) => {
    setShiftHoursStr(p.shiftHours);
    setBreaksStr(p.plannedBreaksMin);
    setDowntimeStr(p.unplannedDowntimeMin);
    setIdealCycleStr(p.idealCycleSec);
    setTotalUnitsStr(p.totalUnits);
    setDefectUnitsStr(p.defectiveUnits);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const results = useMemo(() => {
    const shiftHours = parsePositive(shiftHoursStr);
    const plannedBreaks = parseNonNegative(breaksStr);
    const unplannedDowntime = parseNonNegative(downtimeStr);
    const idealCycle = parsePositive(idealCycleStr);
    const totalUnits = parseNonNegInt(totalUnitsStr);
    const defectiveUnits = parseNonNegInt(defectUnitsStr);

    if (
      !Number.isFinite(shiftHours) ||
      !Number.isFinite(plannedBreaks) ||
      !Number.isFinite(unplannedDowntime) ||
      !Number.isFinite(idealCycle) ||
      !Number.isFinite(totalUnits) ||
      !Number.isFinite(defectiveUnits)
    ) {
      return {
        valid: false as const,
        error: 'All numeric fields must contain valid finite values (integer unit counts, positive shift/cycle times).',
      };
    }

    if (totalUnits < 1) {
      return { valid: false as const, error: 'Total units produced must be at least 1.' };
    }
    if (defectiveUnits > totalUnits) {
      return { valid: false as const, error: 'Defective units cannot exceed total units produced.' };
    }

    const totalShiftMinutes = shiftHours * 60;
    const plannedProductionTime = totalShiftMinutes - plannedBreaks;
    if (plannedProductionTime <= 0) {
      return { valid: false as const, error: 'Planned breaks cannot meet or exceed total shift minutes.' };
    }

    const operatingTime = plannedProductionTime - unplannedDowntime;
    if (operatingTime <= 0) {
      return { valid: false as const, error: 'Unplanned downtime cannot meet or exceed planned production time.' };
    }

    const availability = operatingTime / plannedProductionTime;
    const operatingTimeSec = operatingTime * 60;
    const netOperatingSec = totalUnits * idealCycle;
    const performanceRaw = netOperatingSec / operatingTimeSec;
    const speedExceedsNominal = performanceRaw > 1;
    const performance = performanceRaw;
    const goodUnits = totalUnits - defectiveUnits;
    const quality = goodUnits / totalUnits;
    const oee = availability * performance * quality;

    const availabilityPct = availability * 100;
    const performancePct = performance * 100;
    const qualityPct = quality * 100;
    const oeePct = oee * 100;

    const speedLossMinutes = Math.max(0, operatingTime - netOperatingSec / 60);
    const qualityLossMinutes = (defectiveUnits * idealCycle) / 60;

    return {
      valid: true as const,
      plannedProductionTime,
      operatingTime,
      goodUnits,
      totalUnits,
      defectiveUnits,
      unplannedDowntime,
      availabilityPct,
      performancePct,
      qualityPct,
      oeePct,
      speedLossMinutes,
      qualityLossMinutes,
      speedExceedsNominal,
    };
  }, [shiftHoursStr, breaksStr, downtimeStr, idealCycleStr, totalUnitsStr, defectUnitsStr]);

  const handleCopy = () => {
    if (!results.valid) return;
    const text = [
      'Overall Equipment Effectiveness (OEE) Report',
      `Planned Time: ${fmt(results.plannedProductionTime, 4)} min | Operating Time: ${fmt(results.operatingTime, 4)} min`,
      `Total Units: ${results.totalUnits} | Good Units: ${results.goodUnits} | Defect Units: ${results.defectiveUnits}`,
      `Availability (A): ${fmt(results.availabilityPct, 4)}%`,
      `Performance (P): ${fmt(results.performancePct, 4)}%`,
      `Quality (Q): ${fmt(results.qualityPct, 4)}%`,
      `Overall OEE: ${fmt(results.oeePct, 4)}%`,
      `Losses -> Downtime: ${fmt(results.unplannedDowntime, 4)} min | Speed Loss: ${fmt(results.speedLossMinutes, 4)} min | Quality Loss: ${fmt(results.qualityLossMinutes, 4)} min`,
    ].join('\n');

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!results.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Planned Production Time,${results.plannedProductionTime.toFixed(6)},min`,
      `Operating Time,${results.operatingTime.toFixed(6)},min`,
      `Good Units,${results.goodUnits},pcs`,
      `Total Units,${results.totalUnits},pcs`,
      `Availability,${results.availabilityPct.toFixed(6)},%`,
      `Performance,${results.performancePct.toFixed(6)},%`,
      `Quality,${results.qualityPct.toFixed(6)},%`,
      `Overall OEE,${results.oeePct.toFixed(6)},%`,
      `Speed Loss Time,${results.speedLossMinutes.toFixed(6)},min`,
      `Quality Loss Time,${results.qualityLossMinutes.toFixed(6)},min`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oee_calculation_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Shift & Production Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Define shift schedule, downtime, cycle time, and unit counts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Shift Duration (Hours)
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-shift-hours"
                value={shiftHoursStr}
                onChange={(e) => setShiftHoursStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Planned Breaks (min)
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-breaks"
                value={breaksStr}
                onChange={(e) => setBreaksStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Unplanned Downtime (min)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-downtime"
              value={downtimeStr}
              onChange={(e) => setDowntimeStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ideal Cycle (sec/part)
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ideal-cycle"
                value={idealCycleStr}
                onChange={(e) => setIdealCycleStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Units
              </label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-total-units"
                value={totalUnitsStr}
                onChange={(e) => setTotalUnitsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Defective Units
              </label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-defects"
                value={defectUnitsStr}
                onChange={(e) => setDefectUnitsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Calculated Metrics</span>
              <h3 className="text-xl font-black text-white">Overall Equipment Effectiveness</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="btn-copy"
                onClick={handleCopy}
                disabled={!results.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                data-testid="btn-download-csv"
                onClick={handleDownloadCsv}
                disabled={!results.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {!results.valid ? (
            <div
              data-testid="validation-error"
              className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-sm font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{results.error}</span>
            </div>
          ) : (
            <>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Overall OEE = A x P x Q</span>
                <div className="text-5xl font-black text-blue-400 mt-2">
                  <span data-testid="out-oee">{fmt(results.oeePct, 4)}</span>%
                </div>
                {results.speedExceedsNominal && (
                  <div className="mt-3 text-xs font-bold text-amber-300">
                    Warning: Observed output exceeds ideal cycle rate (Performance &gt; 100%). Check ideal cycle time setting.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">Availability (A)</div>
                  <div className="text-xl font-black text-white">
                    <span data-testid="out-availability">{fmt(results.availabilityPct, 4)}</span>%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {fmt(results.operatingTime, 1)} / {fmt(results.plannedProductionTime, 1)} min
                  </div>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">Performance (P)</div>
                  <div className="text-xl font-black text-white">
                    <span data-testid="out-performance">{fmt(results.performancePct, 4)}</span>%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Loss: {fmt(results.speedLossMinutes, 2)} min</div>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">Quality (Q)</div>
                  <div className="text-xl font-black text-white">
                    <span data-testid="out-quality">{fmt(results.qualityPct, 4)}</span>%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {results.goodUnits} / {results.totalUnits} pcs
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Time Loss Breakdown
                </div>
                <div className="flex justify-between py-1.5 px-3 bg-slate-800/60 rounded-lg">
                  <span className="text-slate-300">Unplanned Downtime</span>
                  <span className="font-bold text-rose-400">{fmt(results.unplannedDowntime, 4)} min</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 bg-slate-800/60 rounded-lg">
                  <span className="text-slate-300">Speed Loss Time</span>
                  <span className="font-bold text-amber-400">{fmt(results.speedLossMinutes, 4)} min</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 bg-slate-800/60 rounded-lg">
                  <span className="text-slate-300">Quality Loss Time ({results.defectiveUnits} defective)</span>
                  <span className="font-bold text-orange-400">{fmt(results.qualityLossMinutes, 4)} min</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          Methodology & Standard Reference
        </div>
        <p>
          OEE evaluates Availability x Performance x Quality where Planned Production Time = Shift Duration - Planned Breaks and Operating Time = Planned Production Time - Unplanned Downtime.
        </p>
        <a
          href="https://en.wikipedia.org/wiki/Overall_equipment_effectiveness"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
        >
          Overall Equipment Effectiveness & ISO 22400-2:2014 Reference (Wikipedia) <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <RelatedTools />
    </div>
  );
}
