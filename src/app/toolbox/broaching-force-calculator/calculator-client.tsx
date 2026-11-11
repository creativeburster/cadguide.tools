'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface BroachPreset {
  label: string;
  teeth: string;
  width: string;
  rpt: string;
  shear: string;
  factorK: string;
  speedMMin: string;
}

const PRESETS: BroachPreset[] = [
  {
    label: 'Keyway — Mild Steel (Default)',
    teeth: '5',
    width: '10',
    rpt: '0.05',
    shear: '300',
    factorK: '1.5',
    speedMMin: '8',
  },
  {
    label: 'Internal Spline — Alloy Steel',
    teeth: '6',
    width: '40',
    rpt: '0.06',
    shear: '450',
    factorK: '4.0',
    speedMMin: '6',
  },
  {
    label: 'Surface Broach — Cast Iron',
    teeth: '4',
    width: '25',
    rpt: '0.08',
    shear: '220',
    factorK: '2.5',
    speedMMin: '12',
  },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits: number): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BroachingForceCalculatorClient() {
  const [teethStr, setTeethStr] = useState('5');
  const [widthStr, setWidthStr] = useState('10');
  const [rptStr, setRptStr] = useState('0.05');
  const [shearStr, setShearStr] = useState('300');
  const [factorKStr, setFactorKStr] = useState('1.5');
  const [speedMMinStr, setSpeedMMinStr] = useState('8');

  const applyPreset = (p: BroachPreset) => {
    setTeethStr(p.teeth);
    setWidthStr(p.width);
    setRptStr(p.rpt);
    setShearStr(p.shear);
    setFactorKStr(p.factorK);
    setSpeedMMinStr(p.speedMMin);
  };

  const handleReset = () => {
    applyPreset(PRESETS[0]);
  };

  const result = useMemo(() => {
    const z = parseNum(teethStr);
    const b = parseNum(widthStr);
    const h = parseNum(rptStr);
    const tau = parseNum(shearStr);
    const k = parseNum(factorKStr);
    const vMMin = parseNum(speedMMinStr);

    const valid =
      Number.isFinite(z) &&
      Number.isFinite(b) &&
      Number.isFinite(h) &&
      Number.isFinite(tau) &&
      Number.isFinite(k) &&
      Number.isFinite(vMMin) &&
      z > 0 &&
      b > 0 &&
      h > 0 &&
      tau > 0 &&
      k > 0 &&
      vMMin > 0;

    if (!valid) {
      return {
        valid: false,
        forceKn: NaN,
        powerKw: NaN,
      };
    }

    // Step-by-step unit derivation:
    // 1. Chip cross-sectional area per tooth: A_c = b [mm] * h [mm] -> [mm^2].
    // 2. Effective specific cutting resistance: k_c = tau [MPa] * K = tau * K [N/mm^2] (since 1 MPa = 1 N/mm^2).
    // 3. Total broaching force across z engaged teeth:
    //    F_N = z * A_c [mm^2] * k_c [N/mm^2] -> [N]; divide by 1000 [N/kN] -> F [kN].
    // 4. Linear cutting speed conversion: v_ms = v_m_min [m/min] / 60 [s/min] -> [m/s].
    // 5. Net cutting power: P = F [kN] * v_ms [m/s] = (F * v_m_min) / 60 [kN·m/s = kW].
    const forceKn = (z * b * h * tau * k) / 1000;
    const powerKw = (forceKn * vMMin) / 60;

    return {
      valid: true,
      forceKn,
      powerKw,
    };
  }, [teethStr, widthStr, rptStr, shearStr, factorKStr, speedMMinStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Linear Broaching Force & Cutting Power Report',
      '# Basis: Metal Cutting Mechanics (Rise per Tooth Chip Area & Linear Cutting Power P = F * v)',
      '# Formula: F [kN] = (z * b * h * tau * K) / 1000 | P [kW] = (F * v_m_min) / 60',
      'Teeth_Engaged_z,Cut_Width_mm,Rise_per_Tooth_mm,Shear_Strength_MPa,Cutting_Factor_K,Cutting_Speed_m_min,Broaching_Force_kN,Cutting_Power_kW',
      `${teethStr.trim()},${widthStr.trim()},${rptStr.trim()},${shearStr.trim()},${factorKStr.trim()},${speedMMinStr.trim()},${formatFixed(result.forceKn, 3)},${formatFixed(result.powerKw, 3)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broaching-force-report.csv';
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Broaching Operation Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Teeth Engaged (z)
              </label>
              <input
                type="text"
                data-testid="input-teeth"
                value={teethStr}
                onChange={(e) => setTeethStr(e.target.value)}
                placeholder="5"
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Cut Width b (mm)
              </label>
              <input
                type="text"
                data-testid="input-width"
                value={widthStr}
                onChange={(e) => setWidthStr(e.target.value)}
                placeholder="10"
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Rise per Tooth / RPT h (mm)
            </label>
            <input
              type="text"
              data-testid="input-rpt"
              value={rptStr}
              onChange={(e) => setRptStr(e.target.value)}
              placeholder="0.05"
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Shear Strength τ (MPa)
              </label>
              <input
                type="text"
                data-testid="input-shear"
                value={shearStr}
                onChange={(e) => setShearStr(e.target.value)}
                placeholder="300"
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400">Typical material value</span>
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Cutting Factor K
              </label>
              <input
                type="text"
                data-testid="input-factor"
                value={factorKStr}
                onChange={(e) => setFactorKStr(e.target.value)}
                placeholder="1.5"
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400">Typical value (verify tooling)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Cutting Speed v (m/min)
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Typical value: 6–36 m/min (~20–120 SFPM for linear broaching).
            </p>
            <input
              type="text"
              data-testid="input-speed"
              value={speedMMinStr}
              onChange={(e) => setSpeedMMinStr(e.target.value)}
              placeholder="8"
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
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
              className="flex-1 py-3 rounded-xl text-sm font-black bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Broaching Force (F)
                </div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-force">{formatFixed(result.forceKn, 3)}</span>
                  {result.valid && <span className="text-lg text-blue-400"> kN</span>}
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">
                  Net Cutting Power (P)
                </div>
                <div className="text-3xl font-black text-green-700">
                  <span data-testid="result-power">{formatFixed(result.powerKw, 3)}</span>
                  {result.valid && <span className="text-lg text-green-400"> kW</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  F [kN] = (z · b · h · τ · K) / 1000 &nbsp;|&nbsp; P [kW] = (F [kN] · v [m/min]) / 60
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">
                Where b · h is the chip cross-sectional area per tooth (mm²) from the rise per tooth (RPT), and τ · K represents effective specific cutting resistance k_c (N/mm²). Divide by hydraulic/mechanical drive efficiency η when sizing machine motor power.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
