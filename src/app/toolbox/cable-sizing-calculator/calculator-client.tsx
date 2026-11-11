'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseNum(str: string): number {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function formatFixed(n: number, digits: number): string {
  return Number.isFinite(n) ? n.toFixed(digits) : '—';
}

// IEC 60228 preferred nominal conductor cross-sectional areas (mm^2)
const IEC_60228_SIZES_MM2 = [
  0.5, 0.75, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630,
  800, 1000,
];

type PhaseSystem = '3phase' | '1phase';

interface CableSizingPreset {
  label: string;
  phase: PhaseSystem;
  current: string;
  length: string;
  voltage: string;
  pf: string;
  maxDrop: string;
  area: string;
  rho: string;
  reactance: string;
}

const PRESETS: CableSizingPreset[] = [
  {
    label: '3-Phase 400V Cu Feeder (Default)',
    phase: '3phase',
    current: '60',
    length: '120',
    voltage: '400',
    pf: '0.85',
    maxDrop: '3',
    area: '16',
    rho: '0.0172',
    reactance: '0.08',
  },
  {
    label: '1-Phase 230V Cu Branch (Over Limit)',
    phase: '1phase',
    current: '32',
    length: '60',
    voltage: '230',
    pf: '0.90',
    maxDrop: '3',
    area: '6',
    rho: '0.0172',
    reactance: '0.08',
  },
  {
    label: '3-Phase 400V Al Feeder (5% Limit)',
    phase: '3phase',
    current: '100',
    length: '150',
    voltage: '400',
    pf: '0.85',
    maxDrop: '5',
    area: '50',
    rho: '0.0282',
    reactance: '0.08',
  },
];

export default function CableSizingCalculatorClient() {
  const [phase, setPhase] = useState<PhaseSystem>(PRESETS[0].phase);
  const [currentStr, setCurrentStr] = useState(PRESETS[0].current);
  const [lengthStr, setLengthStr] = useState(PRESETS[0].length);
  const [voltageStr, setVoltageStr] = useState(PRESETS[0].voltage);
  const [pfStr, setPfStr] = useState(PRESETS[0].pf);
  const [maxDropStr, setMaxDropStr] = useState(PRESETS[0].maxDrop);
  const [areaStr, setAreaStr] = useState(PRESETS[0].area);
  const [rhoStr, setRhoStr] = useState(PRESETS[0].rho);
  const [reactanceStr, setReactanceStr] = useState(PRESETS[0].reactance);

  const applyPreset = (p: CableSizingPreset) => {
    setPhase(p.phase);
    setCurrentStr(p.current);
    setLengthStr(p.length);
    setVoltageStr(p.voltage);
    setPfStr(p.pf);
    setMaxDropStr(p.maxDrop);
    setAreaStr(p.area);
    setRhoStr(p.rho);
    setReactanceStr(p.reactance);
  };

  const handleReset = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const current = parseNum(currentStr);
    const lengthM = parseNum(lengthStr);
    const voltage = parseNum(voltageStr);
    const cosPhi = parseNum(pfStr);
    const maxDropPct = parseNum(maxDropStr);
    const areaMm2 = parseNum(areaStr);
    const rho = parseNum(rhoStr);
    const xPerKm = parseNum(reactanceStr);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(lengthM) ||
      !Number.isFinite(voltage) ||
      !Number.isFinite(cosPhi) ||
      !Number.isFinite(maxDropPct) ||
      !Number.isFinite(areaMm2) ||
      !Number.isFinite(rho) ||
      !Number.isFinite(xPerKm) ||
      current <= 0 ||
      lengthM <= 0 ||
      voltage <= 0 ||
      cosPhi <= 0 ||
      cosPhi > 1 ||
      maxDropPct <= 0 ||
      maxDropPct >= 100 ||
      areaMm2 <= 0 ||
      rho <= 0 ||
      xPerKm < 0
    ) {
      return {
        valid: false,
        rPerKm: NaN,
        vdVolts: NaN,
        vdPct: NaN,
        minAreaVd: NaN,
        iecSizeText: '—',
        status: '—',
      };
    }

    // Step-by-step unit derivation:
    // 1. Route length conversion (m -> km):
    //    L_km [km] = L_m [m] / 1000 [m/km]
    // 2. Conductor linear resistance per km (Omega/km):
    //    Given resistivity rho [Omega*mm^2/m], multiplying by 1000 [m/km] gives [Omega*mm^2/km];
    //    dividing by cross-sectional area A [mm^2] yields R [Omega/km]:
    //    R [Omega/km] = (rho [Omega*mm^2/m] * 1000 [m/km]) / A [mm^2]
    // 3. Load reactive factor:
    //    sin(phi) = sqrt(1 - cos^2(phi))
    // 4. Steady-state AC voltage drop:
    //    Three-phase balanced: dU [V] = sqrt(3) * I [A] * L_km [km] * (R*cos(phi) + X*sin(phi)) [Omega/km]
    //    Single-phase (2-wire): dU [V] = 2 * I [A] * L_km [km] * (R*cos(phi) + X*sin(phi)) [Omega/km]
    //    Note: [A] * [km] * [Omega/km] = [A * Omega] = [V].
    const phaseFactor = phase === '3phase' ? Math.sqrt(3) : 2;
    const lengthKm = lengthM / 1000;
    const rPerKm = (rho * 1000) / areaMm2;
    const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
    const zEffectivePerKm = rPerKm * cosPhi + xPerKm * sinPhi;
    const vdVolts = phaseFactor * current * lengthKm * zEffectivePerKm;
    const vdPct = (vdVolts / voltage) * 100;

    // Minimum conductor cross-section required to meet maxDropPct:
    // dU_max [V] = U_n * (maxDropPct / 100)
    // Z_allow [Omega/km] = dU_max / (phaseFactor * I * L_km)
    // R_allow * cos(phi) = Z_allow - X * sin(phi)  =>  A_min [mm^2] = (rho * 1000 * cos(phi)) / (Z_allow - X * sin(phi))
    const vdMaxVolts = voltage * (maxDropPct / 100);
    const zAllowPerKm = vdMaxVolts / (phaseFactor * current * lengthKm);
    const rCosAllow = zAllowPerKm - xPerKm * sinPhi;

    let minAreaVd = NaN;
    let iecSizeText = 'Parallel Runs Needed';
    if (rCosAllow > 0) {
      minAreaVd = (rho * 1000 * cosPhi) / rCosAllow;
      const matched = IEC_60228_SIZES_MM2.find((s) => s >= minAreaVd - 1e-9);
      iecSizeText = matched !== undefined ? `${matched}` : '> 1000';
    }

    const status = vdPct <= maxDropPct ? 'Within Limit' : 'Exceeds Limit';

    return {
      valid: true,
      rPerKm,
      vdVolts,
      vdPct,
      minAreaVd,
      iecSizeText,
      status,
    };
  }, [phase, currentStr, lengthStr, voltageStr, pfStr, maxDropStr, areaStr, rhoStr, reactanceStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Cable Sizing & AC Voltage Drop Calculation Report',
      '# Standards: IEC 60228 (Nominal Conductor Cross-Sections) | IEC 60364-5-52 Annex G (Voltage Drop Limits)',
      '# Formula: L_km = L_m / 1000 | R [Ohm/km] = (rho * 1000) / A | dU = k * I * L_km * (R*cos(phi) + X*sin(phi))',
      'Phase_System,Current_A,Length_m,Voltage_V,Power_Factor,Max_Drop_Pct,Selected_Area_mm2,Resistivity_Ohm_mm2_m,Reactance_Ohm_km,Linear_Resistance_Ohm_km,Voltage_Drop_V,Voltage_Drop_Pct,Min_Area_VD_mm2,Next_IEC_60228_mm2,Status',
      `${phase},${currentStr.trim()},${lengthStr.trim()},${voltageStr.trim()},${pfStr.trim()},${maxDropStr.trim()},${areaStr.trim()},${rhoStr.trim()},${reactanceStr.trim()},${formatFixed(result.rPerKm, 3)},${formatFixed(result.vdVolts, 2)},${formatFixed(result.vdPct, 2)},${formatFixed(result.minAreaVd, 2)},${result.iecSizeText},${result.status}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cable-sizing-voltage-drop-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">AC impedance &amp; IEC 60228 sizing</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Circuit Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              System Phase
            </label>
            <select
              data-testid="select-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value as PhaseSystem)}
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              <option value="3phase">Three-Phase Balanced AC (√3 factor)</option>
              <option value="1phase">Single-Phase 2-Wire AC (2× factor)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Current I (A)
              </label>
              <input
                type="text"
                data-testid="input-current"
                value={currentStr}
                onChange={(e) => setCurrentStr(e.target.value)}
                placeholder="60"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Length L (m)
              </label>
              <input
                type="text"
                data-testid="input-length"
                value={lengthStr}
                onChange={(e) => setLengthStr(e.target.value)}
                placeholder="120"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Voltage U_n (V)
              </label>
              <input
                type="text"
                data-testid="input-voltage"
                value={voltageStr}
                onChange={(e) => setVoltageStr(e.target.value)}
                placeholder="400"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Power Factor cosφ
              </label>
              <input
                type="text"
                data-testid="input-pf"
                value={pfStr}
                onChange={(e) => setPfStr(e.target.value)}
                placeholder="0.85"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Max Drop (%)
              </label>
              <input
                type="text"
                data-testid="input-max-drop"
                value={maxDropStr}
                onChange={(e) => setMaxDropStr(e.target.value)}
                placeholder="3"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Section A (mm²)
              </label>
              <input
                type="text"
                data-testid="input-area"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                placeholder="16"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Resistivity ρ (Ω·mm²/m)
            </label>
            <p className="text-xs text-slate-400 mb-1.5">
              20 °C reference: annealed Cu 0.0172, Al 0.0282; adjust for operating temperature.
            </p>
            <input
              type="text"
              data-testid="input-rho"
              value={rhoStr}
              onChange={(e) => setRhoStr(e.target.value)}
              placeholder="0.0172"
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Reactance X (Ω/km)
            </label>
            <p className="text-xs text-slate-400 mb-1.5">
              Typical LV multicore cable value: 0.08 Ω/km; adjust per cable manufacturer datasheet.
            </p>
            <input
              type="text"
              data-testid="input-reactance"
              value={reactanceStr}
              onChange={(e) => setReactanceStr(e.target.value)}
              placeholder="0.08"
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="reset-btn"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={handleExportCsv}
              disabled={!result.valid}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div
                data-testid="result-status"
                className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border ${
                  !result.valid
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : result.status === 'Within Limit'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {result.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Voltage Drop ΔU (V)
                </div>
                <div data-testid="result-vd-volts" className="text-3xl font-black text-blue-800">
                  {formatFixed(result.vdVolts, 2)}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">
                  Voltage Drop ΔU% (%)
                </div>
                <div data-testid="result-vd-pct" className="text-3xl font-black text-emerald-800">
                  {formatFixed(result.vdPct, 2)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Conductor Resistance R (Ω/km)
                </div>
                <div data-testid="result-resistance" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.rPerKm, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Min Area for Drop Limit A_min (mm²)
                </div>
                <div data-testid="result-min-area" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.minAreaVd, 2)}
                </div>
              </div>

              <div className="sm:col-span-2 bg-amber-50/70 rounded-2xl p-5 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-amber-700 uppercase tracking-wider">
                    Next Standard IEC 60228 Section (mm²)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Smallest nominal size ≥ A_min for voltage drop; verify thermal ampacity separately per installation method.
                  </div>
                </div>
                <div data-testid="result-iec-size" className="text-3xl font-black text-amber-900">
                  {result.valid ? result.iecSizeText : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  3-Phase: ΔU = √3 · I · (L / 1000) · (R cosφ + X sinφ) &nbsp;|&nbsp; 1-Phase: ΔU = 2 · I · (L / 1000) · (R cosφ + X sinφ)
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                Unit derivation: L_km = L [m] / 1000 [m/km]; R = (ρ [Ω·mm²/m] × 1000 [m/km]) / A [mm²] in Ω/km; sinφ = √(1 − cos²φ). IEC 60364-5-52 Annex G informative voltage drop limits: 3% lighting, 5% other uses. Standard nominal conductor cross-sections per IEC 60228. Thermal current-carrying capacity depends on installation method and ambient derating and must be checked against local electrical code tables.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
