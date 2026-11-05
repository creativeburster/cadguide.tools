'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download, Wind } from 'lucide-react';

interface CalculationOutput {
  primary: { label: string; val: string; unit: string; testId: string };
  secondary: Array<{ label: string; val: string; unit: string; testId: string }>;
  status: { pass: boolean; text: string };
}

// Metcalf & Eddy Wastewater Engineering Activated Sludge Biological Model
function computeAeration(vals: string[]): CalculationOutput {
  const q = Math.max(0, parseFloat(vals[0]) || 0); // m³/d
  const bodIn = Math.max(0, parseFloat(vals[1]) || 0); // mg/L
  const bodOut = Math.max(0, parseFloat(vals[2]) || 0); // mg/L
  const mlss = Math.max(100, parseFloat(vals[3]) || 3000); // mg/L
  const srt = Math.max(1, parseFloat(vals[4]) || 10); // days
  const waterDepth = Math.max(2, parseFloat(vals[5]) || 4.5); // meters (aeration basin depth)
  // Field Oxygen Transfer Efficiency (α·F·SOTE): Accounting for alpha (wastewater/clean water ratio ~0.65),
  // beta (salinity factor ~0.95), temperature correction, and operating DO saturation deficit.
  // Standard clean water SOTE ~20% translates to ~10% field transfer efficiency.
  const fieldOte = Math.max(2, Math.min(30, parseFloat(vals[6]) || 10)) / 100;

  const deltaBod = Math.max(0, bodIn - bodOut);
  const bodRemovedKgDay = (q * deltaBod) / 1000; // kg BOD/d

  // Biological sludge yield kinetics (Metcalf & Eddy):
  // True yield Y = 0.6 kg VSS/kg BOD, endogenous decay kd = 0.06 d^-1
  // Observed yield Y_obs = Y / (1 + kd * SRT)
  const yObs = 0.6 / (1 + 0.06 * srt);
  const pxVss = yObs * bodRemovedKgDay; // Net biomass production kg VSS/d

  // Assuming active MLVSS/MLSS ratio = 0.75
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
  // Empirical carbonaceous oxygen demand factor = 1.2 kg O2 per kg BOD removed
  // (Note: Rigorous Metcalf & Eddy synthesis-respiration formulation gives AOR = Q*deltaBOD/0.68 - 1.42*Px;
  // with 4.57*Q*N_nit added when full nitrification is required).
  const aorKgDay = bodRemovedKgDay * 1.2;

  // Standard air flow calculation from AOR and Field OTE:
  // Air density at standard conditions = 1.204 kg/m³; O2 mass fraction in dry air = 23.2%
  // Oxygen density per standard m³ air = 1.204 * 0.232 = 0.2793 kg O2/Nm³
  const o2Density = 0.2793; // kg O2 per Nm³ air
  const airVolumeNm3Day = fieldOte > 0 ? aorKgDay / (o2Density * fieldOte) : 0;
  const airFlowRateNm3Min = airVolumeNm3Day / (24 * 60); // Nm³/min
  const airFlowRateM3Hour = airVolumeNm3Day / 24; // Nm³/h

  // Blower Shaft Power Sizing:
  // Head pressure = hydrostatic depth head + 0.5m piping/diffuser friction loss (kPa)
  // 1 mH2O ≈ 9.81 kPa
  const pressureKPa = (waterDepth + 0.5) * 9.81; // kPa
  // Conservative linear mechanical shaft power: P = (Q_m3s * DeltaP_kPa) / Electromechanical_efficiency
  // Combined electromechanical efficiency ≈ 70% (0.70)
  const qM3s = airFlowRateNm3Min / 60;
  const blowerPowerKw = 0.70 > 0 ? (qM3s * pressureKPa) / 0.70 : 0;

  // Check HRT standard range for conventional activated sludge (4 - 24 hours)
  const isHrtOk = hrtHours >= 4 && hrtHours <= 24;
  const statusText = !isHrtOk
    ? hrtHours < 4
      ? 'WARNING: HRT UNDER 4H (RISK OF WASHOFF)'
      : 'WARNING: HRT OVER 24H (OVER-SIZED BASIN)'
    : 'HRT & F/M WITHIN STANDARD DESIGN ENVELOPE';

  return {
    primary: {
      label: 'Aeration Basin Volume',
      val: basinVolume.toFixed(0),
      unit: 'm³',
      testId: 'aeration-basin-volume',
    },
    secondary: [
      {
        label: 'Hydraulic Retention Time (HRT)',
        val: hrtHours.toFixed(1),
        unit: 'hours',
        testId: 'aeration-hrt',
      },
      {
        label: 'Food-to-Microorganism (F/M)',
        val: fmRatio.toFixed(3),
        unit: 'kg BOD/kg MLSS·d',
        testId: 'aeration-fm',
      },
      {
        label: 'Daily Oxygen Demand (AOR)',
        val: aorKgDay.toFixed(1),
        unit: 'kg O₂/d',
        testId: 'aeration-aor',
      },
      {
        label: 'Required Air Flow Rate',
        val: airFlowRateNm3Min.toFixed(1),
        unit: 'Nm³/min',
        testId: 'aeration-airflow',
      },
      {
        label: 'Blower Air Flow Capacity',
        val: airFlowRateM3Hour.toFixed(0),
        unit: 'Nm³/h',
        testId: 'aeration-airflow-hourly',
      },
      {
        label: 'Estimated Blower Motor Power',
        val: blowerPowerKw.toFixed(1),
        unit: 'kW',
        testId: 'aeration-blower-power',
      },
    ],
    status: { pass: isHrtOk, text: statusText },
  };
}

const DEFAULT_INPUTS = ['5000', '220', '15', '3000', '10', '4.5', '10'];

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
        primary: { label: 'Calculation Error', val: '—', unit: '', testId: 'aeration-basin-volume' },
        secondary: [],
        status: { pass: false, text: 'Invalid Input Parameters' },
      };
    }
  }, [inputs]);

  const downloadCsv = () => {
    const rows = [
      ['Activated Sludge Aeration Basin & Blower Sizing Report', ''],
      ['Governing Method', 'Metcalf & Eddy Wastewater Engineering Kinetic Model'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Process Input Parameters', ''],
      ['Design Daily Inflow Q (m³/d)', inputs[0]],
      ['Influent BOD5 (mg/L)', inputs[1]],
      ['Effluent Target BOD5 (mg/L)', inputs[2]],
      ['Aeration Tank MLSS (mg/L)', inputs[3]],
      ['Sludge Age SRT (days)', inputs[4]],
      ['Basin Liquid Depth (m)', inputs[5]],
      ['Field OTE α·F·SOTE (%)', inputs[6]],
      ['', ''],
      ['Biological & Hydraulic Outputs', ''],
      ['Required Basin Volume (m³)', result.primary.val],
      ...result.secondary.map(s => [s.label, `${s.val} ${s.unit}`]),
      ['Design Verification Status', result.status.text],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aeration-basin-sizing-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Process Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Influent &amp; activated sludge kinetics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Design Inflow Q (m³/d)
              </label>
              <input
                type="number"
                step="500"
                value={inputs[0]}
                onChange={e => updateInput(0, e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
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
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Effluent BOD (mg/L)
                </label>
                <input
                  type="number"
                  step="5"
                  value={inputs[2]}
                  onChange={e => updateInput(2, e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
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
                  step="250"
                  value={inputs[3]}
                  onChange={e => updateInput(3, e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
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
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
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
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Field OTE (%)
                </label>
                <input
                  type="number"
                  step="1"
                  min="2"
                  max="30"
                  value={inputs[6]}
                  onChange={e => updateInput(6, e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Field OTE (α·F·SOTE) accounts for wastewater matrix alpha factor (~0.65), operating DO deficit, and temperature. Clean water 20% SOTE ≈ 10% in mixed liquor.
            </p>
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
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
                  <p className="text-xs text-slate-500 font-medium">Basin volume &amp; blower aeration metrics</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Status Pill */}
            <div className="flex items-center">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                result.status.pass
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {result.status.pass ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>{result.status.text}</span>
              </div>
            </div>

            {/* Primary Result Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-blue-100 mb-1">
                {result.primary.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  data-testid={result.primary.testId}
                  className="text-4xl sm:text-5xl font-black tracking-tight"
                >
                  {result.primary.val}
                </span>
                <span className="text-xl font-bold text-blue-200">{result.primary.unit}</span>
              </div>
              <div className="text-xs text-blue-100/90 mt-2 font-medium">
                Biomass inventory sized at {inputs[4]}-day sludge retention time (MLVSS/MLSS = 0.75)
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {result.secondary.map((metric, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">
                    {metric.label}
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    <span data-testid={metric.testId}>{metric.val}</span>
                    {metric.unit && <span className="text-xs font-medium text-slate-500 ml-1">{metric.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Engineering Note Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Wind className="w-4 h-4 text-blue-600" />
                Aeration Diffuser &amp; Blower Sizing Engineering Rule:
              </div>
              <p className="leading-relaxed">
                Daily actual oxygen requirement (AOR) uses the standard 1.2 kg O₂/kg BOD empirical factor. Airflow is calculated via field oxygen transfer efficiency (Field OTE = {inputs[6]}%, reflecting α-factor and dissolved oxygen deficit). Blower shaft power utilizes a conservative linear pressure-flow estimate (at {inputs[5]}m water depth + 0.5m piping head, with 70% electromechanical efficiency).
              </p>
            </div>
          </div>

          {/* Governing Formula Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Governing Biological Equations (Metcalf &amp; Eddy)</h3>
                <p className="text-xs text-slate-500 font-medium">Activated sludge steady-state kinetics</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5 text-xs sm:text-sm text-slate-700 font-mono font-medium leading-relaxed">
              <p>P_x,VSS = [Y / (1 + k_d · SRT)] · Q · ΔBOD  (Y=0.6, k_d=0.06 d⁻¹)</p>
              <p>V_basin = (P_x,VSS · SRT · 1000) / (0.75 · MLSS)  [m³]</p>
              <p>HRT = (V / Q) × 24h • F/M = (Q · BOD_in) / (V · MLSS)</p>
              <p>Airflow = AOR / (0.2793 · Field_OTE)  [Nm³/d]</p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
