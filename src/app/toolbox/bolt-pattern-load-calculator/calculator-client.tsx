'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface BoltPatternPreset {
  label: string;
  moment: string;
  shear: string;
  boltCount: string;
  spacing: string;
}

const PRESETS: BoltPatternPreset[] = [
  {
    label: '4-Bolt Bracket (Default)',
    moment: '5000',
    shear: '2000',
    boltCount: '4',
    spacing: '100',
  },
  {
    label: '6-Bolt Heavy Gusset',
    moment: '12000',
    shear: '6000',
    boltCount: '6',
    spacing: '80',
  },
  {
    label: '2-Bolt Light Splice',
    moment: '600',
    shear: '1000',
    boltCount: '2',
    spacing: '120',
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

export default function BoltPatternLoadCalculatorClient() {
  const [momentStr, setMomentStr] = useState('5000');
  const [shearStr, setShearStr] = useState('2000');
  const [boltCountStr, setBoltCountStr] = useState('4');
  const [spacingStr, setSpacingStr] = useState('100');

  const applyPreset = (p: BoltPatternPreset) => {
    setMomentStr(p.moment);
    setShearStr(p.shear);
    setBoltCountStr(p.boltCount);
    setSpacingStr(p.spacing);
  };

  const handleReset = () => {
    applyPreset(PRESETS[0]);
  };

  const result = useMemo(() => {
    const M = parseNum(momentStr);
    const V = parseNum(shearStr);
    const n = parseNum(boltCountStr);
    const sMm = parseNum(spacingStr);

    const valid =
      Number.isFinite(M) &&
      Number.isFinite(V) &&
      Number.isFinite(n) &&
      Number.isFinite(sMm) &&
      M >= 0 &&
      V >= 0 &&
      M + V > 0 &&
      Number.isInteger(n) &&
      n >= 2 &&
      sMm > 0;

    if (!valid) {
      return {
        valid: false,
        fMax: NaN,
        fMin: NaN,
        fAvg: NaN,
        fMomentMax: NaN,
      };
    }

    // Step-by-step unit derivation (collinear equally spaced bolt group under in-plane moment M and parallel shear V):
    // 1. Convert pitch spacing from mm to m: s = s_mm / 1000 [m]
    // 2. Outermost bolt distance from group centroid: y_max = (n - 1) * s / 2 [m]
    // 3. Polar / second moment sum of bolt coordinates about centroid:
    //    sum(y_i^2) = n * s^2 * (n^2 - 1) / 12 [m^2]
    // 4. Max moment-induced shear force on extreme bolt:
    //    F_m,max = (M [N·m] * y_max [m]) / sum(y_i^2) [m^2] -> [N]
    // 5. Direct shear share per bolt: F_avg = V [N] / n -> [N]
    // 6. Algebraic collinear superposition:
    //    F_max = F_avg + F_m,max [N], F_min = F_avg - F_m,max [N]
    const s = sMm / 1000;
    const yMax = ((n - 1) * s) / 2;
    const sumY2 = (n * s * s * (n * n - 1)) / 12;
    const fMomentMax = (M * yMax) / sumY2;
    const fAvg = V / n;
    const fMax = fAvg + fMomentMax;
    const fMin = fAvg - fMomentMax;

    return {
      valid: true,
      fMax,
      fMin,
      fAvg,
      fMomentMax,
    };
  }, [momentStr, shearStr, boltCountStr, spacingStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Bolt Pattern Load Distribution Report (Collinear In-Plane Moment & Direct Shear)',
      '# Basis: Rigid-Body Statics & Polar Moment of Inertia Superposition',
      '# Formula: s = s_mm / 1000 | y_max = (n - 1)*s/2 | sum(y_i^2) = n*s^2*(n^2 - 1)/12 | F_max = V/n + M*y_max/sum(y_i^2) | F_min = V/n - M*y_max/sum(y_i^2)',
      'Moment_Nm,Direct_Shear_N,Bolt_Count,Bolt_Spacing_mm,Max_Bolt_Force_N,Min_Bolt_Force_N,Avg_Direct_Shear_N,Max_Moment_Share_N',
      `${momentStr.trim()},${shearStr.trim()},${boltCountStr.trim()},${spacingStr.trim()},${formatFixed(result.fMax, 2)},${formatFixed(result.fMin, 2)},${formatFixed(result.fAvg, 2)},${formatFixed(result.fMomentMax, 2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-pattern-load-report.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Joint Geometry Presets
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

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              In-Plane Moment M (N·m)
            </label>
            <input
              type="text"
              data-testid="input-moment"
              value={momentStr}
              onChange={(e) => setMomentStr(e.target.value)}
              placeholder="5000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Direct Shear V (N)
            </label>
            <input
              type="text"
              data-testid="input-shear"
              value={shearStr}
              onChange={(e) => setShearStr(e.target.value)}
              placeholder="2000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Bolt Count n (integer ≥ 2)
            </label>
            <input
              type="text"
              data-testid="input-count"
              value={boltCountStr}
              onChange={(e) => setBoltCountStr(e.target.value)}
              placeholder="4"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-2">
              Bolt Pitch Spacing s (mm)
            </label>
            <input
              type="text"
              data-testid="input-spacing"
              value={spacingStr}
              onChange={(e) => setSpacingStr(e.target.value)}
              placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
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
                  Max Bolt Force (F_max)
                </div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-fmax">{formatFixed(result.fMax, 2)}</span>
                  {result.valid && <span className="text-lg text-blue-400"> N</span>}
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">
                  Opposite Extreme Bolt Force (F_min)
                </div>
                <div className="text-3xl font-black text-green-700">
                  <span data-testid="result-fmin">{formatFixed(result.fMin, 2)}</span>
                  {result.valid && <span className="text-lg text-green-400"> N</span>}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">
                  Avg Direct Shear (V / n)
                </div>
                <div className="text-2xl font-black text-orange-700">
                  <span data-testid="result-favg">{formatFixed(result.fAvg, 2)}</span>
                  {result.valid && <span className="text-base text-orange-400"> N</span>}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Max Moment Share (M·y_max / Σy_i²)
                </div>
                <div className="text-2xl font-black text-slate-800">
                  <span data-testid="result-fm">{formatFixed(result.fMomentMax, 2)}</span>
                  {result.valid && <span className="text-base text-slate-400"> N</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Rigid-Body Statics Definition: F_i = (V / n) ± (M · y_i) / Σ(y_j²), where Σ(y_j²) = n · s² · (n² − 1) / 12 and s = s_mm / 1000 m.
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">
                Models a single collinear row of equally spaced bolts subjected to an in-plane eccentric moment M and a direct shear V acting parallel to the moment reaction at the extreme bolts. A negative F_min indicates net force acting opposite to V.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
