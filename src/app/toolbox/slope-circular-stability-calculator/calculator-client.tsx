'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Download } from 'lucide-react';

interface SliceRow {
  index: number;
  xMid: number;
  height: number;
  weight: number;
  alphaDeg: number;
  arcLength: number;
  nEff: number;
  resisting: number;
  driving: number;
}

interface CircularSlopeSuccess {
  valid: true;
  R: number;
  xExit: number;
  totalWeight: number;
  sumResisting: number;
  sumDriving: number;
  fs: number;
  slices: SliceRow[];
}

type CircularSlopeResult =
  | CircularSlopeSuccess
  | { valid: false; error: string };

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function computeCircularSlices(
  H: number,
  betaDeg: number,
  c: number,
  phiDeg: number,
  gamma: number,
  xc: number,
  yc: number,
  ru: number,
  nSlices: number
): CircularSlopeResult {
  const beta = (betaDeg * Math.PI) / 180;
  const phi = (phiDeg * Math.PI) / 180;
  const R = Math.hypot(xc, yc);

  if (R <= Math.abs(yc - H)) {
    return { valid: false, error: 'Slip circle center (xc, yc) does not intersect top crest y = H.' };
  }

  const exitRad = R * R - (yc - H) * (yc - H);
  if (exitRad <= 0) {
    return { valid: false, error: 'Slip circle does not exit behind the slope crest.' };
  }

  const xExit = xc + Math.sqrt(exitRad);
  if (xExit <= 0) {
    return { valid: false, error: 'Slip circle exit coordinate must be > 0.' };
  }

  const xCrest = H / Math.tan(beta);
  const b = xExit / nSlices;
  const slices: SliceRow[] = [];
  let sumResisting = 0;
  let sumDriving = 0;
  let totalWeight = 0;

  for (let i = 0; i < nSlices; i++) {
    const xMid = (i + 0.5) * b;
    const ySurf = xMid < xCrest ? xMid * Math.tan(beta) : H;
    const circTerm = R * R - (xMid - xc) * (xMid - xc);
    if (circTerm < 0) continue;
    const yCirc = yc - Math.sqrt(circTerm);
    const height = Math.max(0, ySurf - yCirc);
    const weight = gamma * b * height;
    const sinAlpha = (xMid - xc) / R;
    const cosAlpha = Math.sqrt(Math.max(1e-12, 1 - sinAlpha * sinAlpha));
    const arcLength = b / cosAlpha;
    const nEff = Math.max(0, weight * cosAlpha - (ru * weight) / cosAlpha);
    const resisting = c * arcLength + nEff * Math.tan(phi);
    const driving = weight * sinAlpha;

    sumResisting += resisting;
    sumDriving += driving;
    totalWeight += weight;

    slices.push({
      index: i + 1,
      xMid,
      height,
      weight,
      alphaDeg: (Math.asin(Math.max(-1, Math.min(1, sinAlpha))) * 180) / Math.PI,
      arcLength,
      nEff,
      resisting,
      driving,
    });
  }

  if (sumDriving <= 0 || slices.length === 0) {
    return { valid: false, error: 'Net driving shear moment is <= 0 for this circle geometry; adjust xc or yc.' };
  }

  return {
    valid: true,
    R,
    xExit,
    totalWeight,
    sumResisting,
    sumDriving,
    fs: sumResisting / sumDriving,
    slices,
  };
}

const DEFAULT_INPUTS = ['8.0', '30', '20', '26', '19.0', '4', '12', '0', '10'];

export default function SlopeCircularStabilityCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo<CircularSlopeResult>(() => {
    const H = parseFinite(inputs[0]);
    const beta = parseFinite(inputs[1]);
    const c = parseFinite(inputs[2]);
    const phi = parseFinite(inputs[3]);
    const gamma = parseFinite(inputs[4]);
    const xc = parseFinite(inputs[5]);
    const yc = parseFinite(inputs[6]);
    const ru = parseFinite(inputs[7]);
    const nSlicesRaw = parseFinite(inputs[8]);

    if (
      H === null || beta === null || c === null || phi === null ||
      gamma === null || xc === null || yc === null || ru === null || nSlicesRaw === null
    ) {
      return { valid: false, error: 'Enter numeric values for all slope, soil, and slip-circle parameters.' };
    }
    if (H <= 0 || gamma <= 0 || beta < 1 || beta >= 89 || c < 0 || phi < 0 || phi >= 89) {
      return { valid: false, error: 'Ensure H > 0, gamma > 0, 1 <= beta < 89 deg, c >= 0, and 0 <= phi < 89 deg.' };
    }
    if (yc <= 0 || ru < 0 || ru > 0.6) {
      return { valid: false, error: 'Ensure circle center yc > 0 and pore-pressure ratio ru in [0, 0.6].' };
    }
    const nSlices = Math.round(nSlicesRaw);
    if (!Number.isInteger(nSlicesRaw) || nSlices < 4 || nSlices > 50) {
      return { valid: false, error: 'Number of slices must be an integer between 4 and 50.' };
    }

    return computeCircularSlices(H, beta, c, phi, gamma, xc, yc, ru, nSlices);
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Circular Slope Stability Ordinary Method of Slices (Fellenius) Report',
      `# Height=${inputs[0].trim()}m, Slope=${inputs[1].trim()}deg, c=${inputs[2].trim()}kPa, phi=${inputs[3].trim()}deg, gamma=${inputs[4].trim()}kN/m3, xc=${inputs[5].trim()}m, yc=${inputs[6].trim()}m, ru=${inputs[7].trim()}`,
      `# Slip Radius R=${result.R.toFixed(6)} m, Exit x=${result.xExit.toFixed(6)} m, Total Weight=${result.totalWeight.toFixed(3)} kN/m, Sum Resisting=${result.sumResisting.toFixed(3)} kN/m, Sum Driving=${result.sumDriving.toFixed(3)} kN/m, Factor of Safety=${result.fs.toFixed(6)}`,
      'Slice,x_mid (m),Height h_i (m),Weight W_i (kN/m),Base Angle alpha (deg),Arc Length l_i (m),Effective Normal N_eff (kN/m),Resisting (kN/m),Driving (kN/m)',
      ...result.slices.map(s =>
        `${s.index},${s.xMid.toFixed(4)},${s.height.toFixed(4)},${s.weight.toFixed(3)},${s.alphaDeg.toFixed(3)},${s.arcLength.toFixed(4)},${s.nEff.toFixed(3)},${s.resisting.toFixed(3)},${s.driving.toFixed(3)}`
      ),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slope-circular-slices-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
                <p className="text-xs text-slate-500 font-medium">Fellenius Method of Slices</p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Height H (m)</label>
              <input type="text" data-testid="input-h" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Slope &beta; (deg)</label>
              <input type="text" data-testid="input-beta" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Cohesion c (kPa)</label>
              <input type="text" data-testid="input-c" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Friction &phi; (deg)</label>
              <input type="text" data-testid="input-phi" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Unit Wt &gamma; (kN/m&sup3;)</label>
              <input type="text" data-testid="input-gamma" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pore Ratio ru</label>
              <input type="text" data-testid="input-ru" value={inputs[7]} onChange={e => updateInput(7, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Center xc (m)</label>
              <input type="text" data-testid="input-xc" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Center yc (m)</label>
              <input type="text" data-testid="input-yc" value={inputs[6]} onChange={e => updateInput(6, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Number of Slices (4 to 50)</label>
            <input type="text" data-testid="input-slices" value={inputs[8]} onChange={e => updateInput(8, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Method of Slices Results</h2>
              </div>
              <div className="flex items-center gap-2">
                {result.valid && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase border ${
                      result.fs >= 1.5
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : result.fs >= 1.2
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {result.fs >= 1.5 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{result.fs >= 1.5 ? 'FS >= 1.50' : result.fs >= 1.0 ? 'Marginal' : 'Unstable (< 1.0)'}</span>
                  </div>
                )}
                <button
                  type="button"
                  data-testid="export-csv-btn"
                  onClick={downloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                Circular Factor of Safety (Ordinary Method of Slices)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="output-fs" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.fs.toFixed(3) : '—'}
                </span>
                {result.valid && <span className="text-lg font-bold text-blue-600">FS</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Slip Radius R</div>
                <div data-testid="output-r" className="text-lg font-black text-slate-900">
                  {result.valid ? `${result.R.toFixed(3)} m` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total Weight</div>
                <div data-testid="output-weight" className="text-lg font-black text-slate-900">
                  {result.valid ? `${result.totalWeight.toFixed(1)} kN/m` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Sum Resisting</div>
                <div data-testid="output-resisting" className="text-lg font-black text-emerald-700">
                  {result.valid ? `${result.sumResisting.toFixed(1)} kN/m` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Sum Driving</div>
                <div data-testid="output-driving" className="text-lg font-black text-rose-700">
                  {result.valid ? `${result.sumDriving.toFixed(1)} kN/m` : '—'}
                </div>
              </div>
            </div>

            {result.valid && (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr className="text-slate-500 uppercase font-black">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">x_mid (m)</th>
                      <th className="py-2.5 px-3">h_i (m)</th>
                      <th className="py-2.5 px-3">W_i (kN/m)</th>
                      <th className="py-2.5 px-3">alpha (deg)</th>
                      <th className="py-2.5 px-3">Res (kN/m)</th>
                      <th className="py-2.5 px-3">Drv (kN/m)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono font-semibold text-slate-700">
                    {result.slices.map(s => (
                      <tr key={s.index} data-testid="slice-row">
                        <td className="py-2 px-3 font-black">{s.index}</td>
                        <td className="py-2 px-3">{s.xMid.toFixed(2)}</td>
                        <td className="py-2 px-3">{s.height.toFixed(2)}</td>
                        <td className="py-2 px-3">{s.weight.toFixed(1)}</td>
                        <td className="py-2 px-3">{s.alphaDeg.toFixed(1)}</td>
                        <td className="py-2 px-3 text-emerald-700">{s.resisting.toFixed(1)}</td>
                        <td className="py-2 px-3 text-rose-700">{s.driving.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Ordinary Method of Slices (Fellenius / Swedish Circle Method, Wikipedia: Slope stability analysis): toe-passing circle R = hypot(xc, yc); FS = Sum[c &middot; l_i + (W_i &middot; cos(alpha_i) &minus; ru &middot; W_i / cos(alpha_i)) &middot; tan(phi)] / Sum[W_i &middot; sin(alpha_i)].
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
