'use client';

import React, { useState, useMemo } from 'react';
import { Gauge, Copy, Check, Info, ShieldCheck, Activity, Award } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export default function OEECalculatorClient() {
  const [copied, setCopied] = useState(false);

  // Shift & Downtime Parameters
  const [shiftHours, setShiftHours] = useState<number>(8); // Hours
  const [plannedBreaks, setPlannedBreaks] = useState<number>(60); // Minutes (lunch, planned maintenance, team meetings)
  const [unplannedDowntime, setUnplannedDowntime] = useState<number>(45); // Minutes (breakdowns, changeovers, jams)

  // Production Count Parameters
  const [idealCycleTime, setIdealCycleTime] = useState<number>(20); // Seconds per part
  const [totalUnitsProduced, setTotalUnitsProduced] = useState<number>(1050); // Total parts produced
  const [defectiveUnits, setDefectiveUnits] = useState<number>(35); // Scrap + rework parts

  const results = useMemo(() => {
    // 1. Time calculations in minutes
    const totalShiftMinutes = Math.max(0, shiftHours * 60);
    const plannedProductionTime = Math.max(0, totalShiftMinutes - plannedBreaks);
    const operatingTime = Math.max(0, plannedProductionTime - unplannedDowntime);

    // 2. Availability (A)
    const availabilityPct = plannedProductionTime > 0
      ? Math.min(100, Math.max(0, (operatingTime / plannedProductionTime) * 100))
      : 0;

    // 3. Performance (P)
    // Operating time in seconds
    const operatingTimeSeconds = operatingTime * 60;
    const netOperatingSeconds = totalUnitsProduced * idealCycleTime;
    const performancePct = operatingTimeSeconds > 0
      ? Math.min(100, Math.max(0, (netOperatingSeconds / operatingTimeSeconds) * 100))
      : 0;

    // 4. Quality (Q)
    const goodUnits = Math.max(0, totalUnitsProduced - defectiveUnits);
    const qualityPct = totalUnitsProduced > 0
      ? Math.min(100, Math.max(0, (goodUnits / totalUnitsProduced) * 100))
      : 0;

    // 5. Overall Equipment Effectiveness (OEE)
    const oeePct = (availabilityPct / 100) * (performancePct / 100) * (qualityPct / 100) * 100;

    // Benchmarking per TPM Standards
    let rating = 'Typical (Needs Improvement)';
    let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    if (oeePct >= 85) {
      rating = 'World-Class (TPM Gold Benchmark)';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (oeePct >= 75) {
      rating = 'Competitive (Above Average)';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (oeePct < 60) {
      rating = 'Low (Substantial Uncaptured Capacity)';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    }

    // Six Big Losses Time Breakdown
    const speedLossMinutes = operatingTime > 0
      ? Math.max(0, (operatingTime - (netOperatingSeconds / 60)))
      : 0;
    const qualityLossMinutes = (defectiveUnits * idealCycleTime) / 60;

    return {
      plannedProductionTime,
      operatingTime,
      goodUnits,
      availability: availabilityPct.toFixed(1),
      performance: performancePct.toFixed(1),
      quality: qualityPct.toFixed(1),
      oee: oeePct.toFixed(1),
      speedLossMinutes: speedLossMinutes.toFixed(1),
      qualityLossMinutes: qualityLossMinutes.toFixed(1),
      rating,
      badgeColor,
    };
  }, [shiftHours, plannedBreaks, unplannedDowntime, idealCycleTime, totalUnitsProduced, defectiveUnits]);

  const handleCopy = () => {
    const text = `Overall Equipment Effectiveness (OEE) Report:
Shift Time: ${shiftHours} hrs | Planned Time: ${results.plannedProductionTime} mins | Operating Time: ${results.operatingTime} mins
Total Units: ${totalUnitsProduced} | Good Units: ${results.goodUnits} | Defect Units: ${defectiveUnits}
- Availability (A): ${results.availability}%
- Performance (P): ${results.performance}%
- Quality (Q): ${results.quality}%
====================================
Overall OEE: ${results.oee}% (${results.rating})
Unplanned Downtime: ${unplannedDowntime} mins | Speed Loss: ${results.speedLossMinutes} mins | Quality Loss: ${results.qualityLossMinutes} mins
Calculated via CADGuide.tools (SEMI E10 & TPM Standards)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Shift & Production Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Define shift schedule, downtime events, and output volume</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Shift Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Planned Breaks (Mins)
                </label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={plannedBreaks}
                  onChange={(e) => setPlannedBreaks(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Unplanned Downtime (Mins)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="720"
                  value={unplannedDowntime}
                  onChange={(e) => setUnplannedDowntime(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Breakdowns, tool changes, material starvations, and unexpected halts</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Rate & Count Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ideal Cycle (sec)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={idealCycleTime}
                    onChange={(e) => setIdealCycleTime(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Produced
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalUnitsProduced}
                    onChange={(e) => setTotalUnitsProduced(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Defective Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={defectiveUnits}
                    onChange={(e) => setDefectiveUnits(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              TPM Benchmark Definition
            </div>
            <p>OEE = Availability (A) × Performance (P) × Quality (Q). World-Class benchmark standards target 90% Availability, 95% Performance, and 99.9% Quality, producing an overall OEE of 85.0%.</p>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Calculated Metrics</span>
              <h3 className="text-xl font-black text-white">Overall Equipment Effectiveness</h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          </div>

          {/* Big OEE Result */}
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 text-center relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Composite Score</span>
            <div className="text-5xl md:text-6xl font-black text-blue-400 mt-2 mb-3 tracking-tight">
              {results.oee}%
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-current shadow-sm bg-slate-900/60 text-slate-200">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{results.rating}</span>
            </div>
          </div>

          {/* Three Pillars Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
              <div className="text-xs font-medium text-slate-400 mb-1">Availability (A)</div>
              <div className="text-2xl font-black text-white">{results.availability}%</div>
              <div className="text-[10px] text-slate-500 mt-1">{results.operatingTime}m / {results.plannedProductionTime}m</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
              <div className="text-xs font-medium text-slate-400 mb-1">Performance (P)</div>
              <div className="text-2xl font-black text-white">{results.performance}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Loss: {results.speedLossMinutes}m</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center">
              <div className="text-xs font-medium text-slate-400 mb-1">Quality (Q)</div>
              <div className="text-2xl font-black text-white">{results.quality}%</div>
              <div className="text-[10px] text-slate-500 mt-1">{results.goodUnits} / {totalUnitsProduced} pcs</div>
            </div>
          </div>

          {/* Six Big Losses Analysis */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Six Big Losses Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 px-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">1 & 2. Downtime Losses (Breakdowns & Setups)</span>
                <span className="font-bold text-rose-400">{unplannedDowntime} mins</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">3 & 4. Speed Losses (Small Stops & Reduced Speed)</span>
                <span className="font-bold text-amber-400">{results.speedLossMinutes} mins</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">5 & 6. Quality Losses (Scrap & Startup Reject Time)</span>
                <span className="font-bold text-orange-400">{results.qualityLossMinutes} mins ({defectiveUnits} units)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Reference Notes */}
      <div className="p-6 md:p-8 bg-white rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Lean Manufacturing & SEMI E10 Compliance Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Availability Factors</h4>
            <p className="text-xs leading-relaxed">
              Measures production losses due to unplanned equipment downtime and tooling changeovers. Excludes scheduled maintenance and lunch breaks which are excluded from Planned Production Time.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Performance Factors</h4>
            <p className="text-xs leading-relaxed">
              Measures speed loss from micro-stops (&lt;5 mins), operator hesitation, and machinery running slower than nameplate design speed (Ideal Cycle Time).
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Quality Factors</h4>
            <p className="text-xs leading-relaxed">
              Measures first-pass yield. Parts requiring rework or scrap disposal degrade the Quality metric directly, translating directly to wasted machine capacity and energy.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <RelatedTools />
    </div>
  );
}
