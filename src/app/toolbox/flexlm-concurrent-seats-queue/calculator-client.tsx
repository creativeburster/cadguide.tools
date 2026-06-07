'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  HelpCircle, Info, Copy, Check, AlertTriangle, CheckCircle, Settings, Sliders, Users, DollarSign, Terminal, Activity
} from 'lucide-react';

// Common CAD software presets
const SOFTWARE_PRESETS = [
  { name: 'AutoCAD (Autodesk)', cost: 1950, premiumFactor: 1.4 },
  { name: 'SolidWorks (Dassault)', cost: 4150, premiumFactor: 1.5 },
  { name: 'Revit (Autodesk)', cost: 2820, premiumFactor: 1.4 },
  { name: 'NX (Siemens)', cost: 7500, premiumFactor: 1.6 },
  { name: 'Custom (Custom)', cost: 2000, premiumFactor: 1.3 },
];

export default function FlexlmQueueClient() {
  const [teamSize, setTeamSize] = useState(50); // Total users
  const [draftingHours, setDraftingHours] = useState(3.0); // Avg daily hours per user
  const [businessHours, setBusinessHours] = useState(8); // Shift duration
  const [peakFactor, setPeakFactor] = useState(1.3); // Peak traffic multiplier
  const [targetDenial, setTargetDenial] = useState(5); // % target denial probability (e.g. 5%)
  const [sessionDuration, setSessionDuration] = useState(2.0); // Avg session duration in hours
  
  const [softwareIdx, setSoftwareIdx] = useState(0);
  const [customCost, setCustomCost] = useState(2000);
  const [customPremium, setCustomPremium] = useState(1.3);
  
  const [copied, setCopied] = useState(false);
  const [optionsCopied, setOptionsCopied] = useState(false);

  // Active Software Pricing
  const software = useMemo(() => {
    const isCustom = softwareIdx === 4;
    return {
      name: SOFTWARE_PRESETS[softwareIdx].name,
      cost: isCustom ? customCost : SOFTWARE_PRESETS[softwareIdx].cost,
      premium: isCustom ? customPremium : SOFTWARE_PRESETS[softwareIdx].premiumFactor,
    };
  }, [softwareIdx, customCost, customPremium]);

  // Offered Load (A) in Erlangs
  const offeredLoad = useMemo(() => {
    const U = Math.max(1, teamSize);
    const Hd = Math.max(0.1, draftingHours);
    const Hw = Math.max(1, businessHours);
    const Fp = Math.max(1.0, peakFactor);
    
    // Average concurrent sessions = U * (Hd / Hw) * Fp
    const A = U * (Hd / Hw) * Fp;
    
    // Safety check: offered load cannot exceed total users
    return Math.min(U - 0.1, A);
  }, [teamSize, draftingHours, businessHours, peakFactor]);

  // Stable Erlang-C function
  const erlangC = (m: number, A: number): number => {
    if (m <= A) return 1.0;
    
    let term = 1.0;
    let sum = 0.0;
    
    for (let k = m - 1; k >= 0; k--) {
      term = term * ((k + 1) / A);
      sum += term;
    }
    
    const factor = m / (m - A);
    return factor / (sum + factor);
  };

  // Find minimum recommended seats
  const recommendations = useMemo(() => {
    const A = offeredLoad;
    const targetLimit = targetDenial / 100;
    const U = teamSize;

    let recSeats = Math.ceil(A) + 1;
    while (recSeats < U) {
      const Pc = erlangC(recSeats, A);
      if (Pc <= targetLimit) {
        break;
      }
      recSeats++;
    }

    // Default to at least Offered Load + 1, and cap at total users
    recSeats = Math.max(Math.ceil(A) + 1, Math.min(U, recSeats));
    const recPc = erlangC(recSeats, A);

    return {
      seats: recSeats,
      denialProbability: recPc * 100,
    };
  }, [offeredLoad, targetDenial, teamSize]);

  // Selected seat configuration calculations (default to recommended, but user can tweak)
  const [selectedSeats, setSelectedSeats] = useState<number | null>(null);
  
  const activeSeats = useMemo(() => {
    if (selectedSeats === null) return recommendations.seats;
    // Keep within bounds
    const minS = Math.ceil(offeredLoad) + 1;
    return Math.max(minS, Math.min(teamSize, selectedSeats));
  }, [selectedSeats, recommendations.seats, offeredLoad, teamSize]);

  // Handle recommendations update
  const syncWithRecommendation = () => {
    setSelectedSeats(recommendations.seats);
  };

  const stats = useMemo(() => {
    const m = activeSeats;
    const A = offeredLoad;
    const Ts = sessionDuration;
    
    const Pc = erlangC(m, A);
    
    // Average wait time if denied (minutes) = Pc * Ts / (m - A) * 60
    const waitTimeMinutes = (Pc * Ts) / (m - A) * 60;

    // Standalone vs Floating pricing
    const costPerStandalone = software.cost;
    const costPerFloating = software.cost * software.premium;

    const standaloneTotal = teamSize * costPerStandalone;
    const floatingTotal = m * costPerFloating;
    
    const budgetSavings = standaloneTotal - floatingTotal;
    const savingsPercent = standaloneTotal > 0 ? (budgetSavings / standaloneTotal) * 100 : 0;
    
    return {
      denialPercent: Pc * 100,
      waitTimeMinutes,
      standaloneTotal,
      floatingTotal,
      budgetSavings,
      savingsPercent,
    };
  }, [activeSeats, offeredLoad, sessionDuration, software, teamSize]);

  // Data for seats vs denial chart SVG
  const chartData = useMemo(() => {
    const A = offeredLoad;
    const minSeats = Math.ceil(A) + 1;
    const maxSeats = Math.min(teamSize, minSeats + 12);
    
    const points: { seats: number; pc: number }[] = [];
    for (let m = minSeats; m <= maxSeats; m++) {
      points.push({
        seats: m,
        pc: erlangC(m, A) * 100,
      });
    }
    return points;
  }, [offeredLoad, teamSize]);

  // SVG Chart path calculation
  const chartPath = useMemo(() => {
    if (chartData.length < 2) return '';
    const width = 320;
    const height = 120;
    
    const xMin = chartData[0].seats;
    const xMax = chartData[chartData.length - 1].seats;
    const yMin = 0;
    const yMax = 100;
    
    const pts = chartData.map((d) => {
      const x = 40 + ((d.seats - xMin) / (xMax - xMin)) * (width - 60);
      const y = 10 + (1 - (d.pc - yMin) / (yMax - yMin)) * (height - 30);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    
    return `M ${pts.join(' L ')}`;
  }, [chartData]);

  // Active seat point on the chart SVG
  const activeChartPoint = useMemo(() => {
    if (chartData.length < 2) return null;
    const width = 320;
    const height = 120;
    
    const xMin = chartData[0].seats;
    const xMax = chartData[chartData.length - 1].seats;
    const yMin = 0;
    const yMax = 100;
    
    const idx = chartData.findIndex((d) => d.seats === activeSeats);
    if (idx === -1) return null;
    
    const d = chartData[idx];
    const x = 40 + ((d.seats - xMin) / (xMax - xMin)) * (width - 60);
    const y = 10 + (1 - (d.pc - yMin) / (yMax - yMin)) * (height - 30);
    return { x, y, pc: d.pc };
  }, [chartData, activeSeats]);

  // Generate OPT config string
  const optionsConfig = useMemo(() => {
    const timeoutSecs = Math.max(900, Math.round(sessionDuration * 3600 * 0.15)); // 15% of session time
    return [
      `# FLEXlm Options File — Optimization Generated by CADGuide.tools`,
      `# Target Software: ${software.name}`,
      `# Total Users: ${teamSize} | Floating Pool Seats: ${activeSeats}`,
      ``,
      `# 1. TIMEOUTALL - Release idle licenses automatically after 15 mins inactivity (900s minimum)`,
      `TIMEOUTALL ${timeoutSecs}`,
      ``,
      `# 2. BORROW_LOWWATER - Keep seats at server, prevent users from borrowing all seats offline`,
      `BORROW_LOWWATER adsk_sds ${Math.max(1, Math.round(activeSeats * 0.3))}`,
      ``,
      `# 3. MAX_OVERAGE_LIMIT - Block seat camping by specific user segments`,
      `# GROUP cad_contractors user_temp1 user_temp2`,
      `# MAX 2 adsk_sds GROUP cad_contractors`,
      ``,
      `# 4. DEBUGLOG - Route diagnostic denials report locally`,
      `DEBUGLOG /var/log/flexlm_denials.log`,
    ].join('\n');
  }, [software, teamSize, activeSeats, sessionDuration]);

  const handleCopySummary = () => {
    const summary = [
      `FLEXlm Concurrent License Report — CADGuide.tools`,
      `Software Preset: ${software.name}`,
      `Team Size (Active Users): ${teamSize}`,
      `Daily Drafting Time (Avg): ${draftingHours} hrs/user`,
      `Business Hours Shift: ${businessHours} hrs`,
      `Peak Loading Factor: ${peakFactor}x`,
      `Offered Load (Erlangs): ${offeredLoad.toFixed(2)}`,
      `---------------------------------------`,
      `Procured Pool Seats: ${activeSeats}`,
      `Probability of Seat Denial: ${stats.denialPercent.toFixed(2)}% (Target: ${targetDenial}%)`,
      `Average User Delay if Denied: ${stats.waitTimeMinutes.toFixed(1)} mins`,
      `Standalone Cost (Named-User): $${stats.standaloneTotal.toLocaleString()}/yr`,
      `Floating Cost (Network Pool): $${stats.floatingTotal.toLocaleString()}/yr`,
      `Net Savings Budget: $${stats.budgetSavings.toLocaleString()}/yr (ROI: ${stats.savingsPercent.toFixed(1)}%)`,
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyOptions = () => {
    navigator.clipboard.writeText(optionsConfig).then(() => {
      setOptionsCopied(true);
      setTimeout(() => setOptionsCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-12">
      {/* Upper Panel: visual grid + curve */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Visual Seat Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> License Pool Concurrency Grid
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Visual seat allocation showing active usage vs queue blocks
            </p>
          </div>

          {/* Seat Grid visualizer */}
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col justify-center items-center min-h-[220px]">
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2.5 max-w-md w-full">
              {Array.from({ length: Math.min(100, activeSeats) }).map((_, i) => {
                const isBusy = i < Math.ceil(offeredLoad);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border transition-all duration-300 flex items-center justify-center text-[9px] font-black ${
                      isBusy
                        ? 'bg-amber-500 border-amber-600 text-white shadow-sm shadow-amber-500/20'
                        : 'bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    }`}
                    title={isBusy ? 'Seat Active (In Use)' : 'Seat Idle (Available)'}
                  >
                    {i + 1}
                  </div>
                );
              })}
              {activeSeats > 100 && (
                <div className="col-span-10 text-center text-xs font-bold text-slate-400 py-1">
                  + {activeSeats - 100} more seats in the licensing pool...
                </div>
              )}
            </div>
            
            {/* Legend and Queue indication */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
                <span>Available ({Math.max(0, activeSeats - Math.ceil(offeredLoad))} seats)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 inline-block"></span>
                <span>Active ({Math.min(activeSeats, Math.ceil(offeredLoad))} seats)</span>
              </div>
              {stats.denialPercent > 1 && (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold animate-pulse">
                    QUEUE
                  </span>
                  <span>Denial delay likelihood: {stats.denialPercent.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* ROI Metric Alerts */}
          {(() => {
            const savings = stats.budgetSavings;
            const isSaving = savings > 0;
            return (
              <div className={`border rounded-2xl p-5 flex items-center gap-4 ${
                isSaving ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {isSaving ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="font-black text-sm uppercase tracking-wide">
                    {isSaving ? `Network License ROI: Save $${savings.toLocaleString()}/yr` : `Float Licensing Deficit (-$${Math.abs(savings).toLocaleString()}/yr)`}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    {isSaving 
                      ? `By pooling ${activeSeats} floating seats for ${teamSize} users, you reduce hardware/license counts by ${teamSize - activeSeats} units, saving ${stats.savingsPercent.toFixed(1)}% of your CAD software budget.`
                      : `The floating license premium (${software.premium}x cost) outweighs the seat savings count. Standalone Named User models would be cheaper for a team of this size. Consider reducing seats or shifting to standalone.`
                    }
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Seats vs Denial Curve Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" /> Denial Rate Curve
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Erlang-C sensitivity analysis curve
            </p>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center min-h-[220px]">
            <svg viewBox="0 0 320 120" className="w-full max-w-[320px] h-auto" aria-label="Erlang-C Chart">
              <rect width="320" height="120" fill="url(#gridBeam)" rx="12" />
              
              {/* Axes */}
              <line x1="40" y1="10" x2="40" y2="100" stroke="#94a3b8" strokeWidth="1" />
              <line x1="40" y1="100" x2="300" y2="100" stroke="#94a3b8" strokeWidth="1" />
              
              {/* Plot line */}
              {chartPath && (
                <path
                  d={chartPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              )}

              {/* Active point marker */}
              {activeChartPoint && (
                <>
                  <circle
                    cx={activeChartPoint.x}
                    cy={activeChartPoint.y}
                    r="4"
                    fill="#ef4444"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={activeChartPoint.x}
                    y1={activeChartPoint.y}
                    x2={activeChartPoint.x}
                    y2="100"
                    stroke="#ef4444"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="40"
                    y1={activeChartPoint.y}
                    x2={activeChartPoint.x}
                    y2={activeChartPoint.y}
                    stroke="#ef4444"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={activeChartPoint.x + 8}
                    y={activeChartPoint.y - 4}
                    fill="#ef4444"
                    fontSize="8"
                    fontWeight="black"
                    fontFamily="monospace"
                  >
                    {activeChartPoint.pc.toFixed(1)}%
                  </text>
                </>
              )}

              {/* Labels */}
              <text x="35" y="15" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="end">100%</text>
              <text x="35" y="55" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="end">50%</text>
              <text x="35" y="98" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="end">0%</text>

              <text x="40" y="110" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">
                {chartData[0]?.seats || 0}
              </text>
              <text x="300" y="110" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">
                {chartData[chartData.length - 1]?.seats || 0} seats (m)
              </text>
            </svg>
          </div>

          {/* Details table properties */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] font-semibold text-slate-500 space-y-1">
            <div className="font-black text-slate-800 text-[10px] uppercase tracking-wider mb-1">
              Active Pool Sensitivity:
            </div>
            <div className="flex justify-between font-mono">
              <span>Offered Load Concurrency (A):</span>
              <span className="text-slate-800 font-bold">{offeredLoad.toFixed(2)} Erlangs</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Wait Likelihood (Pc):</span>
              <span className="text-slate-800 font-bold">{stats.denialPercent.toFixed(2)} %</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Avg Waiting Duration:</span>
              <span className="text-slate-800 font-bold">{stats.waitTimeMinutes.toFixed(1)} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configurations Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Parameter Setup */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" /> Floating Concurrency Setup
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Input user metrics and licensing setups
            </p>
          </div>

          {/* Software Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wide">
              1. Target CAD Software & Cost Profile
            </label>
            <select
              value={softwareIdx}
              onChange={(e) => setSoftwareIdx(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-500 text-white"
            >
              {SOFTWARE_PRESETS.map((preset, idx) => (
                <option key={idx} value={idx}>
                  {preset.name} (Cost: ${preset.cost}/yr)
                </option>
              ))}
            </select>
          </div>

          {/* Custom Software fields */}
          {softwareIdx === 4 && (
            <div className="grid grid-cols-2 gap-4 border border-slate-800 rounded-2xl p-4 bg-slate-950/20">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold">Cost Per Named User ($)</label>
                <input
                  type="number"
                  value={customCost}
                  onChange={(e) => setCustomCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold">Floating Premium Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={customPremium}
                  onChange={(e) => setCustomPremium(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Team size & parameters */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            
            {/* Total Team Size */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Total Engineers / Users (U)</span>
                <span className="text-blue-400 font-mono text-sm">{teamSize} Users</span>
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Average drafting hours */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Avg Daily Drafting Hours (Hd)</span>
                <span className="text-blue-400 font-mono text-sm">{draftingHours} Hours</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={draftingHours}
                onChange={(e) => setDraftingHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Business shift window */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold flex justify-between">
                  <span>Shift Windows (Hw)</span>
                  <span className="font-mono text-blue-400">{businessHours} hrs</span>
                </label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(parseInt(e.target.value) || 8)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold flex justify-between">
                  <span>Peak Load Factor (Fp)</span>
                  <span className="font-mono text-blue-400">{peakFactor}x</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="2.5"
                  value={peakFactor}
                  onChange={(e) => setPeakFactor(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Parameters panel */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between self-stretch space-y-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" /> Tolerances & Pool Controls
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Define license constraints and wait parameters
              </p>
            </div>

            {/* Target Denial probability */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Target License Denial Probability</span>
                <span className="text-blue-400 font-mono text-sm">{targetDenial}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={targetDenial}
                onChange={(e) => setTargetDenial(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                <span>1% (High Availability / Strict)</span>
                <span>5% (Industry Standard)</span>
                <span>25% (Low Cost / high delays)</span>
              </div>
            </div>

            {/* Selected seats slider */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>License Pool Size (m)</span>
                <span className="text-amber-400 font-mono text-sm">{activeSeats} Seats</span>
              </label>
              <input
                type="range"
                min={Math.ceil(offeredLoad) + 1}
                max={teamSize}
                step="1"
                value={activeSeats}
                onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                <span>Min Capacity: {Math.ceil(offeredLoad) + 1}</span>
                <button onClick={syncWithRecommendation} className="text-blue-400 hover:underline">
                  Recommended: {recommendations.seats}
                </button>
                <span>Max Users: {teamSize}</span>
              </div>
            </div>

            {/* Avg Session duration */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>Average CAD Session Duration (Ts)</span>
                <span className="text-blue-400 font-mono text-sm">{sessionDuration} Hours</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.5"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Results pricing block */}
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3.5 text-xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              Cost Summary Comparison
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Named-User Cost</div>
                <div className="text-white font-black text-base font-mono">
                  ${stats.standaloneTotal.toLocaleString()}
                  <span className="text-[10px] text-slate-400 ml-0.5">/yr</span>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-750">
                <div className="text-slate-400 font-bold text-[9px] uppercase">pooled license cost</div>
                <div className="text-white font-black text-base font-mono">
                  ${stats.floatingTotal.toLocaleString()}
                  <span className="text-[10px] text-slate-400 ml-0.5">/yr</span>
                </div>
              </div>
            </div>

            {/* Net Savings Box */}
            <div className={`rounded-xl p-3.5 border ${
              stats.budgetSavings > 0
                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
                : 'bg-rose-950/20 border-rose-900/30 text-rose-300'
            }`}>
              <div className="font-extrabold text-[11px] flex justify-between items-center">
                <span>NET IT BUDGET SAVINGS:</span>
                <span className="text-white font-mono text-sm font-black">
                  {stats.budgetSavings > 0 ? '+' : ''}${stats.budgetSavings.toLocaleString()} / year
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleCopySummary}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-green-600" /> Summary Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy License Report</>
            )}
          </button>
        </div>
      </div>

      {/* Terminal FLEXlm opt file builder */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" /> Generated FLEXlm Options File Config (options.opt)
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Copy-pasteable server-side optimization variables
            </p>
          </div>
          
          <button
            onClick={handleCopyOptions}
            className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 active:scale-95 transition-all"
          >
            {optionsCopied ? (
              <><Check className="w-4 h-4 text-emerald-400" /> Config Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy options.opt</>
            )}
          </button>
        </div>

        <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-80">
          <code>{optionsConfig}</code>
        </pre>
      </div>

      {/* Reference Guide Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Queuing Theory & FLEXlm Allocation Guide
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">1. How Erlang-C Models Floating Licenses</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                Floating CAD licensing is a classic M/M/m queuing system. There are m identical servers (licenses) available to a finite group of users. When an engineer launches AutoCAD or SolidWorks, they request a license from the server.
              </p>
              <p>
                If a seat is available, they checkout the license and start drafting. If all seats are in use, the request is denied. In Erlang-C queuing models:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Offered Load (A)</strong>: The average number of concurrent licenses requested, measured in Erlangs.</li>
                <li><strong>Denial Probability (Pc)</strong>: The probability that a user launching CAD is denied a seat and must wait in a queue or try again later.</li>
              </ul>
              <p>
                Erlang-C assumes that if all licenses are checked out, users queue until one becomes available. If users abandon the request, it behaves as an Erlang-B model (loss system). Most IT managers use Erlang-C to represent a worst-case delay scenario.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">2. Reducing License Camping via options.opt</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                The primary weakness of floating licenses is <strong>license camping</strong>: users leave AutoCAD open overnight or during lunch, unnecessarily holding a seat.
              </p>
              <p>
                To mitigate this, licensing managers configure the <code>options.opt</code> file on the license server:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[10px] font-mono leading-relaxed">
                <li><strong>TIMEOUTALL 900</strong>: Reclaims the license if the client machine is idle for more than 15 minutes (900 seconds). Standard practice.</li>
                <li><strong>BORROW_LOWWATER</strong>: Restricts borrowing seats for offline laptops, ensuring a minimum pool remains active on the local server.</li>
                <li><strong>EXCLUDE / INCLUDE</strong>: Prevents non-drafting personnel from accidentally holding seats, reserving them for core engineers.</li>
              </ul>
              <p>
                Deploying these configuration values allows IT teams to reduce pool sizes and achieve maximum procurement savings.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <RelatedTools />
    </div>
  );
}
