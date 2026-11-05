'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download, Wind } from 'lucide-react';

interface CalculationOutput {
  primary: { label: string; val: string; unit: string };
  secondary: Array<{ label: string; val: string; unit: string }>;
  status: { pass: boolean; text: string };
}

// Metcalf & Eddy Wastewater Engineering Activated Sludge Model
function computeAeration(vals: string[]): CalculationOutput {
  const q = Math.max(0, parseFloat(vals[0]) || 0); // m³/d
  const bodIn = Math.max(0, parseFloat(vals[1]) || 0); // mg/L
  const bodOut = Math.max(0, parseFloat(vals[2]) || 0); // mg/L
  const mlss = Math.max(100, parseFloat(vals[3]) || 3000); // mg/L
  const srt = Math.max(1, parseFloat(vals[4]) || 10); // days
  const waterDepth = Math.max(2, parseFloat(vals[5]) || 4.5); // meters (aeration basin depth)
  const ote = Math.max(5, Math.min(40, parseFloat(vals[6]) || 20)) / 100; // Oxygen transfer efficiency ratio

  const deltaBod = Math.max(0, bodIn - bodOut);
  const bodRemovedKgDay = (q * deltaBod) / 1000; // kg BOD/d

  // Biological sludge yield: Y = 0.6 kg VSS/kg BOD, kd = 0.06 d^-1
  // Y_obs = Y / (1 + kd * SRT)
  const yObs = 0.6 / (1 + 0.06 * srt);
  const pxVss = yObs * bodRemovedKgDay; // Net biomass production kg VSS/d

  // Assuming MLVSS/MLSS ratio = 0.75
  const mlvssRatio = 0.75;
  const basinVolume = mlss > 0
    ? (pxVss * srt * 1000) / (mlvssRatio * mlss)
    : 0; // m³

  // Hydraulic Retention Time HRT (hours)
  const hrtHours = q > 0 ? (basinVolume / q) * 24 : 0;

  // Food to Microorganism ratio F/M (kg BOD5 / kg MLSS·d)
  const totalMlssKg = (basinVolume * mlss) / 1000;
  const fmRatio = totalMlssKg > 0 ? (q * bodIn / 1000) / totalMlssKg : 0;

  // Actual Oxygen Requirement (AOR): kg O2/d
  // AOR = (Q * deltaBOD / 1000) * 1.2 kg O2/kg BOD
  const aorKgDay = bodRemovedKgDay * 1.2;

  // Standard air flow calculation:
  // Density of air at standard conditions = 1.204 kg/m³
  // O2 mass fraction in dry air = 23.2% (0.232)
  // O2 mass per m³ of air = 1.204 * 0.232 = 0.2793 kg O2/Nm³
  const o2Density = 0.2793; // kg O2 per standard m³ air
  const airVolumeNm3Day = ote > 0 ? aorKgDay / (o2Density * ote) : 0;
  const airFlowRateNm3Min = airVolumeNm3Day / (24 * 60); // Nm³/min
  const airFlowRateM3Hour = airVolumeNm3Day / 24; // Nm³/h

  // Blower Sizing:
  // Head pressure = water depth static head + 0.5m piping/diffuser friction loss (kPa)
  // 1 mH2O ≈ 9.81 kPa
  const pressureKPa = (waterDepth + 0.5) * 9.81; // kPa
  // Adiabatic/polytropic blower shaft power: P = (Q_m3s * DeltaP_kPa) / (Blower_efficiency * Motor_efficiency)
  // Combined electromechanical efficiency ≈ 70% (0.70)
  const qM3s = airFlowRateNm3Min / 60;
  const blowerPowerKw = 0.7 > 0 ? (qM3s * pressureKPa) / 0.70 : 0;

  // Check HRT standard range for conventional activated sludge (4 - 12 hours)
  const isHrtOk = hrtHours >= 4 && hrtHours <= 24;
  const statusText = !isHrtOk
    ? hrtHours < 4
      ? 'WARNING: HRT UNDER 4H (RISK OF WASHOFF)'
      : 'WARNING: HRT OVER 24H (OVER-SIZED BASIN)'
    : 'HRT & F/M WITHIN STANDARD DESIGN ENVELOPE';

  return {
    primary: { label: 'Aeration Basin Volume', val: basinVolume.toFixed(0), unit: 'm³' },
    secondary: [
      { label: 'Hydraulic Retention Time (HRT)', val: hrtHours.toFixed(1), unit: 'hours' },
      { label: 'Food-to-Microorganism (F/M)', val: fmRatio.toFixed(3), unit: 'kg BOD/kg MLSS·d' },
      { label: 'Daily Oxygen Demand (AOR)', val: aorKgDay.toFixed(1), unit: 'kg O₂/d' },
      { label: 'Required Air Flow Rate', val: airFlowRateNm3Min.toFixed(1), unit: 'Nm³/min' },
      { label: 'Blower Air Flow Capacity', val: airFlowRateM3Hour.toFixed(0), unit: 'Nm³/h' },
      { label: 'Estimated Blower Motor Power', val: blowerPowerKw.toFixed(1), unit: 'kW' },
    ],
    status: { pass: isHrtOk, text: statusText },
  };
}

const DEFAULT_INPUTS = ['5000', '220', '15', '3000', '10', '4.5', '20'];

export default function CalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    try {
      return computeAeration(inputs);
    } catch {
      return {
        primary: { label: 'Calculation Error', val: '—', unit: '' },
        secondary: [],
        status: { pass: false, text: 'Invalid Input Values' },
      };
    }
  }, [inputs]);

  const downloadCsv = () => {
    const rows = [
      ['Aeration Basin & Blower Sizing Report', ''],
      ['Methodology', 'Metcalf & Eddy Wastewater Engineering Activated Sludge Model'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Design Inflow Q (m³/d)', inputs[0]],
      ['Influent BOD5 (mg/L)', inputs[1]],
      ['Target Effluent BOD5 (mg/L)', inputs[2]],
      ['Mixed Liquor Suspended Solids MLSS (mg/L)', inputs[3]],
      ['Solids Retention Time SRT (days)', inputs[4]],
      ['Basin Water Depth (m)', inputs[5]],
      ['Oxygen Transfer Efficiency OTE (%)', inputs[6]],
      ['', ''],
      ['Process & Sizing Outputs', ''],
      ['Aeration Basin Volume (m³)', result.primary.val],
      ['Hydraulic Retention Time HRT (hours)', result.secondary[0]?.val],
      ['Food-to-Microorganism F/M (kg BOD/kg MLSS·d)', result.secondary[1]?.val],
      ['Daily Oxygen Demand AOR (kg O2/d)', result.secondary[2]?.val],
      ['Required Air Flow Rate (Nm³/min)', result.secondary[3]?.val],
      ['Blower Capacity (Nm³/h)', result.secondary[4]?.val],
      ['Estimated Blower Power (kW)', result.secondary[5]?.val],
      ['Design Status', result.status.text],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aeration-tank-blower-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Process Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Influent & activated sludge kinetics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Design Inflow Q (m³/d)
              </label>
              <input
                type="number"
                step="100"
                value={inputs[0]}
                onChange={e => updateInput(0, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Influent BOD (mg/L)
                </label>
                <input
                  type="number"
                  step="10"
                  value={inputs[1]}
                  onChange={e => updateInput(1, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Effluent BOD (mg/L)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputs[2]}
                  onChange={e => updateInput(2, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  MLSS (mg/L)
                </label>
                <input
                  type="number"
                  step="100"
                  value={inputs[3]}
                  onChange={e => updateInput(3, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Sludge Age (SRT d)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputs[4]}
                  onChange={e => updateInput(4, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Basin Depth (m)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs[5]}
                  onChange={e => updateInput(5, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Diffuser OTE (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputs[6]}
                  onChange={e => updateInput(6, e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setInputs(DEFAULT_INPUTS)}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
                  <p className="text-xs text-slate-500 font-medium">Basin volume & blower aeration metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                {result.status && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                      result.status.pass
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {result.status.pass ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{result.status.text}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl p-6 text-white shadow-xs">
              <div className="text-xs font-black text-orange-200 uppercase tracking-wider mb-2">
                {result.primary.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">
                  {result.primary.val}
                </span>
                {result.primary.unit && (
                  <span className="text-lg font-bold text-orange-200">
                    {result.primary.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            {result.secondary && result.secondary.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {result.secondary.map((metric, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">
                      {metric.label}
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {metric.val}
                      {metric.unit && <span className="text-xs font-medium text-slate-500 ml-1.5">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Blower Engineering Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-start gap-3">
              <Wind className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Aeration Blower & Diffuser Design Rule:</strong> Standard oxygen requirement (AOR) is converted to standard air flow using fine-bubble aeration transfer efficiency ({inputs[6]}% OTE). Blower shaft power includes static hydrostatic head at {inputs[5]}m liquid depth plus 0.5m piping loss.
              </div>
            </div>

            {/* Engineering Methodology & Formula Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Governing Biological Equations (Metcalf &amp; Eddy)</h3>
              </div>
              <div className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed break-words">
                P_x = [Y / (1 + k_d · SRT)] · Q · ΔBOD • V = (P_x · SRT) / (0.75 · MLSS) • HRT = (V / Q) × 24h
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
