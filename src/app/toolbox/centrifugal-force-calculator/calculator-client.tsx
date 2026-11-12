'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type MassUnit = 'kg' | 'g';
type RadiusUnit = 'm' | 'mm';

const MASS_TO_KG: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
};

const RADIUS_TO_M: Record<RadiusUnit, number> = {
  m: 1,
  mm: 0.001,
};

const STANDARD_GRAVITY = 9.80665; // m/s² (exact standard gravity g_0)

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

export default function CentrifugalForceCalculatorClient() {
  const [massStr, setMassStr] = useState<string>('2');
  const [massUnit, setMassUnit] = useState<MassUnit>('kg');
  const [radiusStr, setRadiusStr] = useState<string>('0.3');
  const [radiusUnit, setRadiusUnit] = useState<RadiusUnit>('m');
  const [rpmStr, setRpmStr] = useState<string>('1500');

  const applyPreset = (m: string, mu: MassUnit, r: string, ru: RadiusUnit, rpm: string) => {
    setMassStr(m);
    setMassUnit(mu);
    setRadiusStr(r);
    setRadiusUnit(ru);
    setRpmStr(rpm);
  };

  const handleReset = () => {
    applyPreset('2', 'kg', '0.3', 'm', '1500');
  };

  /**
   * Rotational Dynamics Equations (OpenStax University Physics Vol. 1, Sec. 6.3):
   * 1. Angular velocity: omega = (2 * pi * N) / 60 [rad/s]
   * 2. Tangential linear speed: v = omega * r_m [m/s]
   * 3. Radial / centripetal acceleration: a_c = r_m * omega^2 = v^2 / r_m [m/s²]
   * 4. Magnitude of centripetal / rotating-frame centrifugal force: F_c = m_kg * r_m * omega^2 [N]
   * 5. Relative Centrifugal Acceleration (RCF): RCF = a_c / 9.80665 [g]
   */
  const calc = useMemo(() => {
    const mRaw = parseStrictNumber(massStr);
    const rRaw = parseStrictNumber(radiusStr);
    const rpm = parseStrictNumber(rpmStr);

    const kMass = MASS_TO_KG[massUnit];
    const kRadius = RADIUS_TO_M[radiusUnit];

    if (
      kMass === undefined ||
      kRadius === undefined ||
      !Number.isFinite(mRaw) ||
      !Number.isFinite(rRaw) ||
      !Number.isFinite(rpm) ||
      mRaw <= 0 ||
      rRaw <= 0 ||
      rpm <= 0
    ) {
      return { isValid: false as const };
    }

    const mKg = mRaw * kMass;
    const rM = rRaw * kRadius;
    const omega = (2 * Math.PI * rpm) / 60;
    const v = omega * rM;
    const ac = rM * omega * omega;
    const fc = mKg * ac;
    const rcf = ac / STANDARD_GRAVITY;

    return {
      isValid: true as const,
      mRaw,
      mKg,
      rRaw,
      rM,
      rpm,
      omega,
      v,
      ac,
      fc,
      rcf,
    };
  }, [massStr, massUnit, radiusStr, radiusUnit, rpmStr]);

  const handleExportCsv = () => {
    if (!calc.isValid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Rotating Mass (m)', calc.mKg.toFixed(4), 'kg', `Input: ${calc.mRaw} ${massUnit}`],
      ['Center-of-Mass Radius (r)', calc.rM.toFixed(4), 'm', `Input: ${calc.rRaw} ${radiusUnit}`],
      ['Rotational Speed (N)', calc.rpm.toFixed(2), 'RPM', 'Revolutions per minute'],
      ['Angular Velocity (omega)', calc.omega.toFixed(3), 'rad/s', 'omega = 2 * pi * N / 60'],
      ['Tangential Linear Speed (v)', calc.v.toFixed(3), 'm/s', 'v = omega * r'],
      ['Centrifugal / Centripetal Force (F_c)', calc.fc.toFixed(2), 'N', 'F_c = m * r * omega^2'],
      ['Relative Centrifugal Acceleration (RCF)', calc.rcf.toFixed(2), 'g', 'RCF = (r * omega^2) / 9.80665'],
      ['Reference', 'OpenStax University Physics Volume 1, Section 6.3 Centripetal Force', '-', 'Uniform circular motion mechanics'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'centrifugal-force-results.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Rotor Inputs</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Uniform Circular Motion
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-industrial-rotor"
                onClick={() => applyPreset('2', 'kg', '0.3', 'm', '1500')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                2kg · 0.3m · 1500
              </button>
              <button
                type="button"
                data-testid="preset-spindle-chuck"
                onClick={() => applyPreset('500', 'g', '100', 'mm', '3000')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                500g · 100mm · 3000
              </button>
              <button
                type="button"
                data-testid="preset-flywheel"
                onClick={() => applyPreset('10', 'kg', '0.25', 'm', '900')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                10kg · 0.25m · 900
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Rotating Mass m (&gt; 0)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="input-mass"
                  value={massStr}
                  onChange={(e) => setMassStr(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
                <select
                  data-testid="select-mass-unit"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                  className="w-24 h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Center-of-Mass Radius r (&gt; 0)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="input-radius"
                  value={radiusStr}
                  onChange={(e) => setRadiusStr(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
                <select
                  data-testid="select-radius-unit"
                  value={radiusUnit}
                  onChange={(e) => setRadiusUnit(e.target.value as RadiusUnit)}
                  className="w-24 h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                >
                  <option value="m">m</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Rotational Speed N (RPM, &gt; 0)
              </label>
              <input
                type="text"
                data-testid="input-rpm"
                value={rpmStr}
                onChange={(e) => setRpmStr(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-export-csv"
            disabled={!calc.isValid}
            onClick={handleExportCsv}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Rotational Force CSV
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Rotational Force &amp; Kinematics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Centrifugal Force (F_c)
                </div>
                <div className="text-3xl font-black font-mono text-blue-800">
                  <span data-testid="out-centrifugal-force">
                    {calc.isValid ? calc.fc.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-blue-500">N</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Angular Velocity (ω)
                </div>
                <div className="text-3xl font-black font-mono text-emerald-800">
                  <span data-testid="out-angular-velocity">
                    {calc.isValid ? calc.omega.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-emerald-600">rad/s</span>
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                  Tangential Linear Speed (v)
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  <span data-testid="out-linear-speed">
                    {calc.isValid ? calc.v.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-amber-600">m/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Relative Centrifugal Accel (RCF)
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-rcf-g">
                    {calc.isValid ? calc.rcf.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-slate-500">× g</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Uniform Circular Motion Mechanics:</span>
              </div>
              <p className="font-mono text-slate-700">
                ω = 2πN / 60, v = ωr, a_c = rω² = v² / r, F_c = m · r · ω², RCF = a_c / 9.80665
              </p>
              <p className="text-slate-500">
                Reference: OpenStax <em>University Physics Volume 1</em>, Section 6.3 (<em>Centripetal Force</em>). In an
                inertial frame, <em>F_c</em> is the inward centripetal force required to keep mass <em>m</em> on a circular
                path of radius <em>r</em>; in the co-rotating non-inertial frame, the apparent outward centrifugal inertial
                force has the identical magnitude <em>m·r·ω²</em>.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
