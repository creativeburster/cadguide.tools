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

const GRAVITY_ACCEL = 9.81; // m/s^2

interface PullPreset {
  label: string;
  mass: string;
  length: string;
  mu: string;
  angle: string;
  radius: string;
  swpMax: string;
}

const PRESETS: PullPreset[] = [
  {
    label: 'Lubricated Conduit (Default)',
    mass: '4.5',
    length: '120',
    mu: '0.35',
    angle: '90',
    radius: '0.6',
    swpMax: '7.30',
  },
  {
    label: 'Dry Conduit 180° Sweep (Over Limit)',
    mass: '6.0',
    length: '100',
    mu: '0.50',
    angle: '180',
    radius: '0.6',
    swpMax: '7.30',
  },
  {
    label: 'Industrial Feeder (Southwire 1000 lb/ft)',
    mass: '8.0',
    length: '100',
    mu: '0.25',
    angle: '90',
    radius: '0.9',
    swpMax: '14.59',
  },
];

export default function CalculatorClient() {
  const [massStr, setMassStr] = useState(PRESETS[0].mass);
  const [lengthStr, setLengthStr] = useState(PRESETS[0].length);
  const [muStr, setMuStr] = useState(PRESETS[0].mu);
  const [angleStr, setAngleStr] = useState(PRESETS[0].angle);
  const [radiusStr, setRadiusStr] = useState(PRESETS[0].radius);
  const [swpMaxStr, setSwpMaxStr] = useState(PRESETS[0].swpMax);

  const applyPreset = (p: PullPreset) => {
    setMassStr(p.mass);
    setLengthStr(p.length);
    setMuStr(p.mu);
    setAngleStr(p.angle);
    setRadiusStr(p.radius);
    setSwpMaxStr(p.swpMax);
  };

  const handleReset = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const m = parseNum(massStr);
    const len = parseNum(lengthStr);
    const mu = parseNum(muStr);
    const thetaDeg = parseNum(angleStr);
    const rBend = parseNum(radiusStr);
    const swpMax = parseNum(swpMaxStr);

    if (
      !Number.isFinite(m) ||
      !Number.isFinite(len) ||
      !Number.isFinite(mu) ||
      !Number.isFinite(thetaDeg) ||
      !Number.isFinite(rBend) ||
      !Number.isFinite(swpMax) ||
      m <= 0 ||
      len <= 0 ||
      mu <= 0 ||
      thetaDeg < 0 ||
      rBend <= 0 ||
      swpMax <= 0
    ) {
      return {
        valid: false,
        tStraightKn: NaN,
        bendMultiplier: NaN,
        tOutKn: NaN,
        swpKnPerM: NaN,
        status: '—',
      };
    }

    // Unit derivation (single cable or common-jacket pull, W_c = 1, T_0 = 0):
    // 1. Linear cable weight: W [N/m] = m [kg/m] * g [9.81 m/s^2]
    // 2. Horizontal straight-section pulling tension:
    //    T_in [kN] = (W [N/m] * L [m] * mu [dimensionless]) / 1000 [N/kN]
    // 3. Cumulative bend angle in radians:
    //    theta_rad [rad] = theta_deg [deg] * (pi / 180)
    // 4. Euler-Eytelwein capstan bend multiplier:
    //    M_bend = exp(mu * theta_rad) [dimensionless]
    // 5. Bend exit tension:
    //    T_out [kN] = T_in [kN] * M_bend
    // 6. Sidewall bearing pressure:
    //    SWP [kN/m] = T_out [kN] / R [m]
    const weightPerMeter = m * GRAVITY_ACCEL;
    const tStraightKn = (weightPerMeter * len * mu) / 1000;
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const bendMultiplier = Math.exp(mu * thetaRad);
    const tOutKn = tStraightKn * bendMultiplier;
    const swpKnPerM = tOutKn / rBend;
    const status = swpKnPerM <= swpMax ? 'Within Limit' : 'Exceeds Limit';

    return {
      valid: true,
      tStraightKn,
      bendMultiplier,
      tOutKn,
      swpKnPerM,
      status,
    };
  }, [massStr, lengthStr, muStr, angleStr, radiusStr, swpMaxStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Cable Pull Tension & Sidewall Pressure Report',
      '# Reference: Euler-Eytelwein Capstan Equation (T_out = T_in * exp(mu * theta)) | Southwire CableTech SW-1003229 Sidewall Pressure Guidance (SWP = T_out / R)',
      '# Formula: T_in = (m * 9.81 * L * mu) / 1000 [kN] | T_out = T_in * exp(mu * theta_rad) [kN] | SWP = T_out / R [kN/m]',
      'Cable_Mass_kg_m,Straight_Length_m,Friction_Coeff_mu,Bend_Angle_deg,Bend_Radius_m,Max_SWP_Limit_kN_m,Straight_Tension_kN,Bend_Multiplier,Total_Exit_Tension_kN,Sidewall_Pressure_kN_m,Status',
      `${massStr.trim()},${lengthStr.trim()},${muStr.trim()},${angleStr.trim()},${radiusStr.trim()},${swpMaxStr.trim()},${formatFixed(result.tStraightKn, 3)},${formatFixed(result.bendMultiplier, 3)},${formatFixed(result.tOutKn, 3)},${formatFixed(result.swpKnPerM, 3)},${result.status}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cable-pull-tension-report.csv';
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
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Single-cable / common-jacket conduit pull</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Engineering Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Cable Mass m (kg/m)
              </label>
              <input
                type="text"
                data-testid="input-mass"
                value={massStr}
                onChange={(e) => setMassStr(e.target.value)}
                placeholder="4.5"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Pull Length L (m)
              </label>
              <input
                type="text"
                data-testid="input-length"
                value={lengthStr}
                onChange={(e) => setLengthStr(e.target.value)}
                placeholder="120"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Friction Coefficient μ
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Typical values: 0.35 lubricated conduit, 0.50 dry conduit; verify per lubricant datasheet.
            </p>
            <input
              type="text"
              data-testid="input-mu"
              value={muStr}
              onChange={(e) => setMuStr(e.target.value)}
              placeholder="0.35"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Bend Angle θ (°)
              </label>
              <input
                type="text"
                data-testid="input-angle"
                value={angleStr}
                onChange={(e) => setAngleStr(e.target.value)}
                placeholder="90"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Bend Radius R (m)
              </label>
              <input
                type="text"
                data-testid="input-radius"
                value={radiusStr}
                onChange={(e) => setRadiusStr(e.target.value)}
                placeholder="0.6"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Max Sidewall Pressure Limit (kN/m)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Typical values: 7.30 kN/m (~500 lb/ft multiconductor) to 14.59 kN/m (1000 lb/ft per Southwire SW-1003229).
            </p>
            <input
              type="text"
              data-testid="input-swp-max"
              value={swpMaxStr}
              onChange={(e) => setSwpMaxStr(e.target.value)}
              placeholder="7.30"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
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
              className="flex-1 py-3 rounded-xl text-sm font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
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
                  Total Pulling Tension T_out (kN)
                </div>
                <div data-testid="result-tension" className="text-3xl font-black text-blue-900">
                  {formatFixed(result.tOutKn, 3)}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">
                  Sidewall Bearing Pressure SWP (kN/m)
                </div>
                <div data-testid="result-swp" className="text-3xl font-black text-orange-900">
                  {formatFixed(result.swpKnPerM, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Straight Run Tension T_in (kN)
                </div>
                <div data-testid="result-straight-tension" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.tStraightKn, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Capstan Bend Multiplier e^(μ·θ) (x)
                </div>
                <div data-testid="result-multiplier" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.bendMultiplier, 3)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  T_in = (m · g · L · μ) / 1000 &nbsp;|&nbsp; T_out = T_in · e^(μ · θ_rad) &nbsp;|&nbsp; SWP = T_out / R
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                Sources: Euler-Eytelwein capstan friction equation (T_out = T_in · e^(μ·θ), with θ_rad = θ° × π / 180 and g = 9.81 m/s²) and Southwire CableTech Maximum Sidewall Pressure Flyer (SW-1003229) radial bend bearing equation SWP = T_out / R for a single cable or common-jacket pull (weight correction factor W_c = 1).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
