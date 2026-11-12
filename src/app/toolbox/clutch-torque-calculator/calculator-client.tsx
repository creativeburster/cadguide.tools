'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw, ExternalLink, AlertTriangle } from 'lucide-react';

type WearTheory = 'uniform-wear' | 'uniform-pressure';

interface ClutchPreset {
  id: string;
  label: string;
  theory: WearTheory;
  axialForce: string;
  mu: string;
  outerRadius: string;
  innerRadius: string;
  surfaces: string;
}

const PRESETS: ClutchPreset[] = [
  {
    id: 'industrial-disc-default',
    label: 'Industrial Disc Clutch (Default)',
    theory: 'uniform-wear',
    axialForce: '2000',
    mu: '0.25',
    outerRadius: '60',
    innerRadius: '40',
    surfaces: '2',
  },
  {
    id: 'automotive-single-plate',
    label: 'Automotive Single-Plate Dry',
    theory: 'uniform-wear',
    axialForce: '4500',
    mu: '0.35',
    outerRadius: '115',
    innerRadius: '75',
    surfaces: '2',
  },
  {
    id: 'wet-multi-plate',
    label: 'Wet Multi-Plate Oil (6 Surfaces)',
    theory: 'uniform-wear',
    axialForce: '3000',
    mu: '0.08',
    outerRadius: '80',
    innerRadius: '50',
    surfaces: '6',
  },
];

const MU_EXAMPLES = [
  { label: 'Molded Dry (0.25)', val: '0.25' },
  { label: 'Sintered Dry (0.35)', val: '0.35' },
  { label: 'Oil-Immersed Wet (0.08)', val: '0.08' },
];

function parseStrictNum(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

export default function ClutchTorqueCalculatorClient() {
  const [theory, setTheory] = useState<WearTheory>('uniform-wear');
  const [axialForceStr, setAxialForceStr] = useState('2000');
  const [muStr, setMuStr] = useState('0.25');
  const [outerRadiusStr, setOuterRadiusStr] = useState('60');
  const [innerRadiusStr, setInnerRadiusStr] = useState('40');
  const [surfacesStr, setSurfacesStr] = useState('2');

  const applyPreset = (p: ClutchPreset) => {
    setTheory(p.theory);
    setAxialForceStr(p.axialForce);
    setMuStr(p.mu);
    setOuterRadiusStr(p.outerRadius);
    setInnerRadiusStr(p.innerRadius);
    setSurfacesStr(p.surfaces);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const calc = useMemo(() => {
    const F = parseStrictNum(axialForceStr);
    const mu = parseStrictNum(muStr);
    const Ro = parseStrictNum(outerRadiusStr);
    const Ri = parseStrictNum(innerRadiusStr);
    const n = parseStrictNum(surfacesStr);

    if (
      !Number.isFinite(F) ||
      !Number.isFinite(mu) ||
      !Number.isFinite(Ro) ||
      !Number.isFinite(Ri) ||
      !Number.isFinite(n)
    ) {
      return {
        valid: false as const,
        error: 'Enter valid finite numbers for all clutch geometry, force, and friction inputs.',
      };
    }

    if (F <= 0) {
      return { valid: false as const, error: 'Axial clamping force F must be greater than 0 N.' };
    }
    if (mu <= 0 || mu > 2) {
      return { valid: false as const, error: 'Coefficient of friction μ must be greater than 0 and at most 2.0.' };
    }
    if (Ri <= 0 || Ro <= Ri) {
      return {
        valid: false as const,
        error: 'Annular lining radii must satisfy R_o > R_i > 0 mm.',
      };
    }
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      return {
        valid: false as const,
        error: 'Number of active friction surfaces n must be an integer between 1 and 100.',
      };
    }

    // Effective friction radius R_m [mm] and interface pressure [MPa = N/mm^2]:
    // 1. Uniform Wear assumption (worn-in clutch, p * r = const):
    //    R_m = (R_o + R_i) / 2 ; p_max (at inner radius R_i) = F / (2 * pi * R_i * (R_o - R_i))
    // 2. Uniform Pressure assumption (new rigid flat disc, p = const):
    //    R_m = (2 / 3) * (R_o^3 - R_i^3) / (R_o^2 - R_i^2) ; p_avg = F / (pi * (R_o^2 - R_i^2))
    // Torque capacity T [N·m] = mu * F [N] * (R_m [mm] / 1000 [mm/m]) * n
    const rmMm =
      theory === 'uniform-wear'
        ? (Ro + Ri) / 2
        : (2 / 3) * ((Ro ** 3 - Ri ** 3) / (Ro ** 2 - Ri ** 2));

    const pressureMpa =
      theory === 'uniform-wear'
        ? F / (2 * Math.PI * Ri * (Ro - Ri))
        : F / (Math.PI * (Ro ** 2 - Ri ** 2));

    const torqueNm = mu * F * (rmMm / 1000) * n;

    return {
      valid: true as const,
      F,
      mu,
      Ro,
      Ri,
      n,
      rmMm,
      torqueNm,
      pressureMpa,
    };
  }, [theory, axialForceStr, muStr, outerRadiusStr, innerRadiusStr, surfacesStr]);

  const handleExportCsv = () => {
    if (!calc.valid) return;
    const theoryLabel =
      theory === 'uniform-wear'
        ? 'Uniform Wear (Worn-In / Practical Assemblies: R_m = (R_o + R_i) / 2)'
        : 'Uniform Pressure (New / Unworn Plates: R_m = 2/3 * (R_o^3 - R_i^3) / (R_o^2 - R_i^2))';
    const pressureLabel =
      theory === 'uniform-wear'
        ? 'Peak Lining Pressure at R_i p_max (MPa)'
        : 'Uniform Lining Pressure p_avg (MPa)';

    const rows = [
      ['# Axial Disc Clutch Torque Capacity Report', ''],
      ['# Reference', 'Shigley Mechanical Engineering Design (Ch. 16) & Roymech Axial Clutch Equations'],
      ['# Formula', 'T = mu * F * (R_m / 1000) * n'],
      ['Pressure Distribution Model', `"${theoryLabel}"`],
      ['Axial Clamping Force F (N)', String(calc.F)],
      ['Coefficient of Friction mu', String(calc.mu)],
      ['Outer Radius R_o (mm)', String(calc.Ro)],
      ['Inner Radius R_i (mm)', String(calc.Ri)],
      ['Active Friction Surfaces n', String(calc.n)],
      ['Effective Friction Radius R_m (mm)', calc.rmMm.toFixed(3)],
      ['Torque Capacity T (N*m)', calc.torqueNm.toFixed(3)],
      [pressureLabel, calc.pressureMpa.toFixed(3)],
    ];

    const csv = rows.map((r) => r.join(',')).join('\r\n') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clutch-torque-calculation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Clutch Design Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="clutch-theory" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Contact Pressure Assumption
            </label>
            <select
              id="clutch-theory"
              data-testid="select-theory"
              value={theory}
              onChange={(e) => setTheory(e.target.value as WearTheory)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 cursor-pointer"
            >
              <option value="uniform-wear">Uniform Wear — R_m = (R_o + R_i) / 2 (Worn-In / Conservative)</option>
              <option value="uniform-pressure">Uniform Pressure — R_m = 2/3·(R_o³ − R_i³)/(R_o² − R_i²) (New Plate)</option>
            </select>
          </div>

          <div>
            <label htmlFor="clutch-force" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Axial Clamping Force F (N)
            </label>
            <input
              id="clutch-force"
              data-testid="input-axial-force"
              type="text"
              inputMode="decimal"
              value={axialForceStr}
              onChange={(e) => setAxialForceStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="clutch-mu" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Coefficient of Friction μ (Editable)
            </label>
            <input
              id="clutch-mu"
              data-testid="input-friction"
              type="text"
              inputMode="decimal"
              value={muStr}
              onChange={(e) => setMuStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MU_EXAMPLES.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMuStr(item.val)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5" data-testid="mu-typical-note">
              Typical example values only — verify actual μ and allowable pressure against your friction lining
              manufacturer&apos;s datasheet.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="clutch-ro" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Outer Radius R_o (mm)
              </label>
              <input
                id="clutch-ro"
                data-testid="input-outer-radius"
                type="text"
                inputMode="decimal"
                value={outerRadiusStr}
                onChange={(e) => setOuterRadiusStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="clutch-ri" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Inner Radius R_i (mm)
              </label>
              <input
                id="clutch-ri"
                data-testid="input-inner-radius"
                type="text"
                inputMode="decimal"
                value={innerRadiusStr}
                onChange={(e) => setInnerRadiusStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="clutch-surfaces" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Active Friction Surfaces n
            </label>
            <input
              id="clutch-surfaces"
              data-testid="input-surfaces"
              type="text"
              inputMode="numeric"
              value={surfacesStr}
              onChange={(e) => setSurfacesStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Single dry disc clamped between flywheel and pressure plate has n = 2 active friction interfaces.
            </p>
          </div>
        </div>

        {/* Results */}
        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Clutch Capacity Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!calc.valid}
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!calc.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{calc.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Torque Capacity T</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-torque">{calc.valid ? calc.torqueNm.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">N·m</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">
                  Effective Radius R_m
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-mean-radius">{calc.valid ? calc.rmMm.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-emerald-500 ml-1.5">mm</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  {theory === 'uniform-wear' ? 'Peak Pressure p_max (at R_i)' : 'Uniform Pressure p_avg'}
                </div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-lining-pressure">{calc.valid ? calc.pressureMpa.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-slate-400 ml-1.5">MPa</span>
                </div>
              </div>
            </div>

            {/* Formula & Theory Reference */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                Equations, Unit Derivation &amp; Engineering References
              </div>
              <ul className="list-disc pl-5 space-y-1.5 font-medium">
                <li>
                  <strong>Friction Torque Equation:</strong> <code>T = μ · F · (R_m / 1000) · n</code>, where{' '}
                  <code>F</code> is in N, <code>R_m</code> in mm is divided by <code>1000 mm/m</code> to obtain meters,{' '}
                  <code>n</code> is the number of active friction faces, and <code>T</code> is in <code>N·m</code>.
                </li>
                <li>
                  <strong>Uniform Wear Theory (Practical / Worn-In Plates):</strong> Assumes axial wear rate is
                  proportional to frictional work intensity <code>p · v</code> (since sliding speed{' '}
                  <code>v = ω · r</code>, local pressure satisfies <code>p · r = constant</code>, peaking at inner
                  radius <code>R_i</code>). Yields arithmetic mean radius <code>R_m = (R_o + R_i) / 2</code> and a more
                  conservative torque rating used for long-term sizing.
                </li>
                <li>
                  <strong>Uniform Pressure Theory (New / Unworn Rigid Plates):</strong> Assumes constant contact
                  pressure <code>p = F / [π · (R_o² − R_i²)]</code> across a brand-new flat disc, yielding{' '}
                  <code>R_m = (2/3) · (R_o³ − R_i³) / (R_o² − R_i²)</code>.
                </li>
                <li>
                  <strong>Sources:</strong> Budynas &amp; Nisbett,{' '}
                  <em>Shigley&apos;s Mechanical Engineering Design</em> (Chapter 16: Clutches, Brakes, Couplings, and
                  Flywheels); and{' '}
                  <a
                    href="https://roymech.org/Useful_Tables/Drive/Axial_Plate_clutch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 font-bold underline"
                  >
                    Roymech — Axial Clutch Equations
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
