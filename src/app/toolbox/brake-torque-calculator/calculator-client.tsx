'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface BrakePreset {
  label: string;
  force: string;
  radius: string;
  mass: string;
  speedKmh: string;
}

const PRESETS: BrakePreset[] = [
  {
    label: 'Passenger Car Moderate (Default)',
    force: '3000',
    radius: '0.3',
    mass: '1500',
    speedKmh: '80',
  },
  {
    label: 'Passenger Car Emergency',
    force: '12000',
    radius: '0.32',
    mass: '1600',
    speedKmh: '100',
  },
  {
    label: 'Industrial AGV / Forklift',
    force: '6000',
    radius: '0.20',
    mass: '3000',
    speedKmh: '18',
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

export default function BrakeTorqueCalculatorClient() {
  const [forceStr, setForceStr] = useState('3000');
  const [radiusStr, setRadiusStr] = useState('0.3');
  const [massStr, setMassStr] = useState('1500');
  const [speedKmhStr, setSpeedKmhStr] = useState('80');

  const applyPreset = (p: BrakePreset) => {
    setForceStr(p.force);
    setRadiusStr(p.radius);
    setMassStr(p.mass);
    setSpeedKmhStr(p.speedKmh);
  };

  const handleReset = () => {
    applyPreset(PRESETS[0]);
  };

  const result = useMemo(() => {
    const fb = parseNum(forceStr);
    const r = parseNum(radiusStr);
    const m = parseNum(massStr);
    const vKmh = parseNum(speedKmhStr);

    const valid =
      Number.isFinite(fb) &&
      Number.isFinite(r) &&
      Number.isFinite(m) &&
      Number.isFinite(vKmh) &&
      fb > 0 &&
      r > 0 &&
      m > 0 &&
      vKmh >= 0;

    if (!valid) {
      return {
        valid: false,
        torque: NaN,
        decel: NaN,
        distance: NaN,
      };
    }

    // Step-by-step unit derivation (constant-deceleration level-road braking kinematics):
    // 1. Convert initial speed from km/h to m/s:
    //    1 km/h = 1000 m / 3600 s = (1 / 3.6) m/s -> v = v_kmh / 3.6 [m/s]
    // 2. Total wheel braking torque:
    //    T = F_b [N] * R [m] -> [N·m]
    // 3. Linear deceleration by Newton's second law:
    //    a = F_b [N] / m [kg] = (kg·m/s^2) / kg -> [m/s^2]
    // 4. Theoretical braking distance (work-energy equivalence 1/2*m*v^2 = F_b*d, excluding driver reaction distance):
    //    d = v^2 [(m/s)^2] / (2 * a [m/s^2]) -> [m]
    const vMs = vKmh / 3.6;
    const torque = fb * r;
    const decel = fb / m;
    const distance = (vMs * vMs) / (2 * decel);

    return {
      valid: true,
      torque,
      decel,
      distance,
    };
  }, [forceStr, radiusStr, massStr, speedKmhStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Brake Torque & Theoretical Braking Distance Report',
      '# Basis: Newtonian Linear Kinematics & Work-Energy Equivalence (Level Surface, Excluding Reaction Distance)',
      '# Formula: v = v_kmh / 3.6 | T = F_b * R | a = F_b / m | d = v^2 / (2 * a)',
      'Braking_Force_N,Wheel_Radius_m,Vehicle_Mass_kg,Initial_Speed_kmh,Brake_Torque_Nm,Deceleration_m_s2,Braking_Distance_m',
      `${forceStr.trim()},${radiusStr.trim()},${massStr.trim()},${speedKmhStr.trim()},${formatFixed(result.torque, 2)},${formatFixed(result.decel, 3)},${formatFixed(result.distance, 2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brake-torque-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Vehicle Braking Presets
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
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Total Braking Force F_b (N)
            </label>
            <input
              type="text"
              data-testid="input-force"
              value={forceStr}
              onChange={(e) => setForceStr(e.target.value)}
              placeholder="3000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Effective Wheel Radius R (m)
            </label>
            <input
              type="text"
              data-testid="input-radius"
              value={radiusStr}
              onChange={(e) => setRadiusStr(e.target.value)}
              placeholder="0.3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Vehicle / System Mass m (kg)
            </label>
            <input
              type="text"
              data-testid="input-mass"
              value={massStr}
              onChange={(e) => setMassStr(e.target.value)}
              placeholder="1500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Initial Speed v (km/h)
            </label>
            <input
              type="text"
              data-testid="input-speed"
              value={speedKmhStr}
              onChange={(e) => setSpeedKmhStr(e.target.value)}
              placeholder="80"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
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
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Total Brake Torque
                </div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-torque">{formatFixed(result.torque, 2)}</span>
                  {result.valid && <span className="text-lg text-blue-400"> N·m</span>}
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">
                  Deceleration (a)
                </div>
                <div className="text-3xl font-black text-green-700">
                  <span data-testid="result-decel">{formatFixed(result.decel, 3)}</span>
                  {result.valid && <span className="text-lg text-green-400"> m/s²</span>}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">
                  Braking Distance (d)
                </div>
                <div className="text-3xl font-black text-orange-700">
                  <span data-testid="result-distance">{formatFixed(result.distance, 2)}</span>
                  {result.valid && <span className="text-lg text-orange-400"> m</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  v = v_kmh / 3.6 &nbsp;|&nbsp; T = F_b · R &nbsp;|&nbsp; a = F_b / m &nbsp;|&nbsp; d = v² / (2 · a)
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">
                Computes theoretical constant-deceleration braking distance on a level surface (excluding perception-reaction distance). For tire-road friction estimation on level ground, F_b ≤ μ · m · g where μ is the tire-road friction coefficient (typical dry asphalt μ ≈ 0.7–0.8, wet ≈ 0.35–0.5).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
