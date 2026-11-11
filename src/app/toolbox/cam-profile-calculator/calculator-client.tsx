'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

type MotionLaw = 'shm' | 'cycloidal' | 'uniform';

const MOTION_LAW_LABELS: Record<MotionLaw, string> = {
  shm: 'Simple Harmonic Motion (SHM)',
  cycloidal: 'Cycloidal Motion',
  uniform: 'Uniform Velocity (Constant Slope)',
};

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const val = Number(trimmed);
  return Number.isFinite(val) ? val : NaN;
}

export default function CamProfileCalculatorClient() {
  const [liftStr, setLiftStr] = useState<string>('20');
  const [riseAngleStr, setRiseAngleStr] = useState<string>('90');
  const [camAngleStr, setCamAngleStr] = useState<string>('45');
  const [rpmStr, setRpmStr] = useState<string>('60');
  const [motionLaw, setMotionLaw] = useState<MotionLaw>('shm');

  const applyPreset = (preset: 'shm-mid' | 'cycloidal-quarter' | 'uniform-120rpm') => {
    if (preset === 'shm-mid') {
      setLiftStr('20');
      setRiseAngleStr('90');
      setCamAngleStr('45');
      setRpmStr('60');
      setMotionLaw('shm');
    } else if (preset === 'cycloidal-quarter') {
      setLiftStr('20');
      setRiseAngleStr('90');
      setCamAngleStr('22.5');
      setRpmStr('60');
      setMotionLaw('cycloidal');
    } else {
      setLiftStr('15');
      setRiseAngleStr('120');
      setCamAngleStr('60');
      setRpmStr('120');
      setMotionLaw('uniform');
    }
  };

  const handleReset = () => {
    applyPreset('shm-mid');
  };

  /**
   * Step-by-step cam follower kinematics & unit derivation:
   * Given total rise h [mm] (> 0), rise angle beta_deg [deg] (0 < beta_deg <= 360),
   * instantaneous cam angle theta_deg [deg] (0 <= theta_deg <= beta_deg),
   * and constant cam shaft speed N [rpm] (> 0):
   *
   * 1. Angular conversions:
   *    - beta_rad  = beta_deg * (pi / 180) [rad]
   *    - theta_rad = theta_deg * (pi / 180) [rad]
   *    - Normalized rise phase u = theta_deg / beta_deg = theta_rad / beta_rad in [0, 1]
   *    - Cam angular velocity omega = (2 * pi * N) / 60 [rad/s]
   *      (Since dt = d(theta_rad) / omega, d/dt = omega * d/d(theta_rad) and d^2/dt^2 = omega^2 * d^2/d(theta_rad)^2)
   *
   * 2. Standard Rise Motion Laws (References: METU ME 301 Cam Design Ch. 8-3; MechSimulator Cam Follower Guide):
   *    a) Simple Harmonic Motion (SHM):
   *       s(theta) = (h / 2) * (1 - cos(pi * u))                                [mm]
   *       v(theta) = ((pi * h * omega) / (2 * beta_rad)) * sin(pi * u)          [mm/s]
   *       a(theta) = ((pi^2 * h * omega^2) / (2 * beta_rad^2)) * cos(pi * u)    [mm/s^2]
   *       v_max    = (pi * h * omega) / (2 * beta_rad)                          [mm/s]
   *       a_max    = (pi^2 * h * omega^2) / (2 * beta_rad^2)                    [mm/s^2]
   *
   *    b) Cycloidal Motion:
   *       s(theta) = h * (u - sin(2 * pi * u) / (2 * pi))                       [mm]
   *       v(theta) = ((h * omega) / beta_rad) * (1 - cos(2 * pi * u))           [mm/s]
   *       a(theta) = ((2 * pi * h * omega^2) / beta_rad^2) * sin(2 * pi * u)    [mm/s^2]
   *       v_max    = (2 * h * omega) / beta_rad                                 [mm/s]
   *       a_max    = (2 * pi * h * omega^2) / beta_rad^2                        [mm/s^2]
   *
   *    c) Uniform Velocity (Constant Slope):
   *       s(theta) = h * u                                                      [mm]
   *       v(theta) = (h * omega) / beta_rad                                     [mm/s]
   *       a(theta) = 0 (interior of rise; infinite theoretical shock impulses at theta = 0 and theta = beta)
   */
  const calc = useMemo(() => {
    const h = parseStrictNumber(liftStr);
    const betaDeg = parseStrictNumber(riseAngleStr);
    const thetaDeg = parseStrictNumber(camAngleStr);
    const rpm = parseStrictNumber(rpmStr);

    if (
      !Number.isFinite(h) ||
      !Number.isFinite(betaDeg) ||
      !Number.isFinite(thetaDeg) ||
      !Number.isFinite(rpm) ||
      h <= 0 ||
      betaDeg <= 0 ||
      betaDeg > 360 ||
      thetaDeg < 0 ||
      thetaDeg > betaDeg ||
      rpm <= 0
    ) {
      return { isValid: false as const };
    }

    const betaRad = (betaDeg * Math.PI) / 180;
    const u = thetaDeg / betaDeg;
    const omega = (2 * Math.PI * rpm) / 60;

    const evalDisplacement = (phaseU: number): number => {
      if (motionLaw === 'uniform') {
        return h * phaseU;
      }
      if (motionLaw === 'cycloidal') {
        return h * (phaseU - Math.sin(2 * Math.PI * phaseU) / (2 * Math.PI));
      }
      return (h / 2) * (1 - Math.cos(Math.PI * phaseU));
    };

    let s: number;
    let v: number;
    let acc: number;
    let vMax: number;
    let aMax: number;

    if (motionLaw === 'uniform') {
      s = h * u;
      v = (h * omega) / betaRad;
      acc = 0;
      vMax = v;
      aMax = 0;
    } else if (motionLaw === 'cycloidal') {
      s = h * (u - Math.sin(2 * Math.PI * u) / (2 * Math.PI));
      v = ((h * omega) / betaRad) * (1 - Math.cos(2 * Math.PI * u));
      acc = ((2 * Math.PI * h * omega * omega) / (betaRad * betaRad)) * Math.sin(2 * Math.PI * u);
      vMax = (2 * h * omega) / betaRad;
      aMax = (2 * Math.PI * h * omega * omega) / (betaRad * betaRad);
    } else {
      s = (h / 2) * (1 - Math.cos(Math.PI * u));
      v = ((Math.PI * h * omega) / (2 * betaRad)) * Math.sin(Math.PI * u);
      acc = ((Math.PI * Math.PI * h * omega * omega) / (2 * betaRad * betaRad)) * Math.cos(Math.PI * u);
      vMax = (Math.PI * h * omega) / (2 * betaRad);
      aMax = (Math.PI * Math.PI * h * omega * omega) / (2 * betaRad * betaRad);
    }

    // Clean near-zero floating-point noise (e.g. cos(pi/2) = 6.12e-17)
    if (Math.abs(acc) < 1e-11) acc = 0;
    if (Math.abs(v) < 1e-11) v = 0;
    if (Math.abs(s) < 1e-11) s = 0;

    if (
      !Number.isFinite(s) ||
      !Number.isFinite(v) ||
      !Number.isFinite(acc) ||
      !Number.isFinite(omega) ||
      !Number.isFinite(vMax) ||
      !Number.isFinite(aMax)
    ) {
      return { isValid: false as const };
    }

    // Build 40-segment SVG polyline for s(u)
    const padLeft = 40;
    const padTop = 18;
    const plotW = 330;
    const plotH = 110;
    const points: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const ui = i / 40;
      const si = evalDisplacement(ui);
      const px = padLeft + ui * plotW;
      const py = padTop + plotH - (si / h) * plotH;
      points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    const markerX = padLeft + u * plotW;
    const markerY = padTop + plotH - (s / h) * plotH;

    return {
      isValid: true as const,
      h,
      betaDeg,
      thetaDeg,
      rpm,
      omega,
      u,
      s,
      v,
      acc,
      vMax,
      aMax,
      svgPoints: points.join(' '),
      markerX,
      markerY,
    };
  }, [liftStr, riseAngleStr, camAngleStr, rpmStr, motionLaw]);

  const handleDownloadCsv = () => {
    if (!calc.isValid) return;
    const header = [
      'Motion_Law',
      'Total_Lift_mm',
      'Rise_Angle_deg',
      'Cam_Angle_deg',
      'Cam_Speed_rpm',
      'Angular_Velocity_rad_s',
      'Displacement_mm',
      'Velocity_mm_s',
      'Acceleration_mm_s2',
      'Peak_Rise_Velocity_mm_s',
      'Peak_Interior_Acceleration_mm_s2',
    ].join(',');
    const row = [
      `"${MOTION_LAW_LABELS[motionLaw]}"`,
      calc.h.toFixed(3),
      calc.betaDeg.toFixed(2),
      calc.thetaDeg.toFixed(2),
      calc.rpm.toFixed(2),
      calc.omega.toFixed(3),
      calc.s.toFixed(3),
      calc.v.toFixed(2),
      calc.acc.toFixed(2),
      calc.vMax.toFixed(2),
      calc.aMax.toFixed(2),
    ].join(',');
    const blob = new Blob([`${header}\n${row}\n`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cam-profile-kinematics.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Cam Rise Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Motion Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-shm-mid"
                onClick={() => applyPreset('shm-mid')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                SHM Mid (45°)
              </button>
              <button
                type="button"
                data-testid="preset-cycloidal-quarter"
                onClick={() => applyPreset('cycloidal-quarter')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Cycloidal (22.5°)
              </button>
              <button
                type="button"
                data-testid="preset-uniform-120"
                onClick={() => applyPreset('uniform-120rpm')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Uniform 120 rpm
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Total Follower Lift h (mm, &gt; 0)
            </label>
            <input
              type="text"
              data-testid="input-lift"
              value={liftStr}
              onChange={(e) => setLiftStr(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Rise Angle β (deg, 0–360)
              </label>
              <input
                type="text"
                data-testid="input-rise-angle"
                value={riseAngleStr}
                onChange={(e) => setRiseAngleStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Cam Angle θ (deg, 0 ≤ θ ≤ β)
              </label>
              <input
                type="text"
                data-testid="input-cam-angle"
                value={camAngleStr}
                onChange={(e) => setCamAngleStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Cam Shaft Speed N (rpm, &gt; 0)
            </label>
            <input
              type="text"
              data-testid="input-rpm"
              value={rpmStr}
              onChange={(e) => setRpmStr(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Follower Motion Law
            </label>
            <select
              data-testid="select-motion-law"
              value={motionLaw}
              onChange={(e) => setMotionLaw(e.target.value as MotionLaw)}
              className={inputCls}
            >
              <option value="shm">Simple Harmonic Motion (SHM)</option>
              <option value="cycloidal">Cycloidal Motion</option>
              <option value="uniform">Uniform Velocity (Constant Slope)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Instantaneous &amp; Peak Kinematics
                </h2>
              </div>
              <button
                type="button"
                data-testid="btn-download-csv"
                disabled={!calc.isValid}
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Displacement s(θ)
                </div>
                <div className="text-2xl font-black font-mono text-blue-700">
                  <span data-testid="out-displacement">
                    {calc.isValid ? calc.s.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-blue-400">mm</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Velocity v(θ)
                </div>
                <div className="text-2xl font-black font-mono text-emerald-700">
                  <span data-testid="out-velocity">
                    {calc.isValid ? calc.v.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-emerald-500">mm/s</span>
                </div>
              </div>

              <div className="bg-orange-50/80 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Acceleration a(θ)
                </div>
                <div className="text-2xl font-black font-mono text-orange-700">
                  <span data-testid="out-acceleration">
                    {calc.isValid ? calc.acc.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-orange-400">mm/s²</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Angular Velocity ω
                </div>
                <div className="text-lg font-black font-mono text-slate-800">
                  <span data-testid="out-omega">
                    {calc.isValid ? calc.omega.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-xs text-slate-400">rad/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Peak Rise Velocity v_max
                </div>
                <div className="text-lg font-black font-mono text-slate-800">
                  <span data-testid="out-vmax">
                    {calc.isValid ? calc.vMax.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs text-slate-400">mm/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Peak Interior Accel a_max
                </div>
                <div className="text-lg font-black font-mono text-slate-800">
                  <span data-testid="out-amax">
                    {calc.isValid ? calc.aMax.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs text-slate-400">mm/s²</span>
                </div>
              </div>
            </div>

            {/* SVG Displacement Curve */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span className="font-bold uppercase tracking-wider">Rise Displacement Diagram s(θ)</span>
                <span className="font-mono">
                  {calc.isValid ? `u = θ/β = ${calc.u.toFixed(3)}` : 'Invalid input range'}
                </span>
              </div>
              <svg width="100%" height="155" viewBox="0 0 400 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="40" y1="128" x2="370" y2="128" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="18" x2="40" y2="128" stroke="#334155" strokeWidth="1" />
                <text x="40" y="145" fill="#94a3b8" fontSize="10">0°</text>
                <text x="370" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">
                  {calc.isValid ? `${calc.betaDeg}°` : 'β'}
                </text>
                <text x="34" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">h</text>
                <text x="34" y="128" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
                {calc.isValid && (
                  <>
                    <polyline
                      points={calc.svgPoints}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={calc.markerX}
                      cy={calc.markerY}
                      r="4.5"
                      fill="#f97316"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Equations & Literature Source */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Kinematics Equations &amp; Unit Conversions:</span>
              </div>
              <p>
                With <code>β_rad = β_deg × π/180</code>, normalized phase <code>u = θ/β</code>, and shaft angular
                velocity <code>ω = 2πN / 60</code> (rad/s):
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>SHM:</strong> <code>s = (h/2)(1 − cos(πu))</code>,{' '}
                  <code>v = (πhω / (2β_rad)) sin(πu)</code>,{' '}
                  <code>a = (π²hω² / (2β_rad²)) cos(πu)</code>.
                </li>
                <li>
                  <strong>Cycloidal:</strong> <code>s = h(u − sin(2πu)/(2π))</code>,{' '}
                  <code>v = (hω / β_rad)(1 − cos(2πu))</code>,{' '}
                  <code>a = (2πhω² / β_rad²) sin(2πu)</code>.
                </li>
                <li>
                  <strong>Uniform Velocity:</strong> <code>s = h·u</code>, <code>v = hω / β_rad</code>, interior{' '}
                  <code>a = 0</code> (infinite theoretical acceleration impulse at transition ends{' '}
                  <code>θ = 0, β</code>; restricted to very low speeds).
                </li>
              </ul>
              <p className="text-slate-500">
                Sources: METU OpenCourseWare ME 301 Theory of Machines (Ch. 8-3 Cam Motion Curves) and MechSimulator Cam
                Follower Displacement, Velocity &amp; Acceleration Guide.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
