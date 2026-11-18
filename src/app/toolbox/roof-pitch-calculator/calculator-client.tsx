'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RoofPitchResult {
  valid: boolean;
  error?: string;
  runM: number;
  pitchRatio: number;
  pitchIn12: number;
  slopePct: number;
  angleDeg: number;
  rafterFactor: number;
  rafterLenM: number;
  totalRoofAreaM2: number;
}

function solveRoofPitch(
  planLenStr: string,
  planWidStr: string,
  riseStr: string,
  overhangStr: string
): RoofPitchResult {
  if ([planLenStr, planWidStr, riseStr, overhangStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All building plan dimensions, gable rise, and eave overhang inputs are required.', runM: 0, pitchRatio: 0, pitchIn12: 0, slopePct: 0, angleDeg: 0, rafterFactor: 0, rafterLenM: 0, totalRoofAreaM2: 0 };
  }
  const L = Number(planLenStr);
  const W = Number(planWidStr);
  const rise = Number(riseStr);
  const oh = Number(overhangStr);

  if (![L, W, rise, oh].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', runM: 0, pitchRatio: 0, pitchIn12: 0, slopePct: 0, angleDeg: 0, rafterFactor: 0, rafterLenM: 0, totalRoofAreaM2: 0 };
  }
  if (L <= 0 || W <= 0 || rise <= 0 || oh < 0) {
    return { valid: false, error: 'Require positive length, width, ridge rise, and overhang >= 0.', runM: 0, pitchRatio: 0, pitchIn12: 0, slopePct: 0, angleDeg: 0, rafterFactor: 0, rafterLenM: 0, totalRoofAreaM2: 0 };
  }

  const runM = W / 2;
  const pitchRatio = rise / runM;
  const pitchIn12 = pitchRatio * 12;
  const slopePct = pitchRatio * 100;
  const angleDeg = (Math.atan(pitchRatio) * 180) / Math.PI;
  const rafterFactor = Math.hypot(1, pitchRatio);
  const totalHorizRun = runM + oh;
  const rafterLenM = totalHorizRun * rafterFactor;
  const totalRoofAreaM2 = 2 * L * rafterLenM;

  return { valid: true, runM, pitchRatio, pitchIn12, slopePct, angleDeg, rafterFactor, rafterLenM, totalRoofAreaM2 };
}

export default function RoofPitchCalculatorClient() {
  const [lenStr, setLenStr] = useState('12');
  const [widStr, setWidStr] = useState('8');
  const [riseStr, setRiseStr] = useState('3');
  const [ohStr, setOhStr] = useState('0');

  const res = solveRoofPitch(lenStr, widStr, riseStr, ohStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Gable Roof Pitch, Rafter Length & Area Report', ''],
      ['Building Plan Length (m)', lenStr],
      ['Building Span Width (m)', widStr],
      ['Half-Span Run (m)', res.runM.toFixed(4)],
      ['Ridge Rise (m)', riseStr],
      ['Horizontal Eave Overhang (m)', ohStr],
      ['Pitch Ratio (Rise/Run)', res.pitchRatio.toFixed(6)],
      ['US Pitch (X:12)', res.pitchIn12.toFixed(2)],
      ['Slope Percentage (%)', res.slopePct.toFixed(2)],
      ['Pitch Angle (deg)', res.angleDeg.toFixed(3)],
      ['Rafter Slope Multiplier', res.rafterFactor.toFixed(6)],
      ['Single-Side Rafter Length (m)', res.rafterLenM.toFixed(4)],
      ['Total Two-Slope Roof Area (m^2)', res.totalRoofAreaM2.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roof-pitch-geometry.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Plan Length (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Span Width (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-wid" value={widStr} onChange={(e) => setWidStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Ridge Rise (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-rise" value={riseStr} onChange={(e) => setRiseStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Overhang (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-overhang" value={ohStr} onChange={(e) => setOhStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <button type="button" onClick={() => { setLenStr('12'); setWidStr('8'); setRiseStr('3'); setOhStr('0'); }} className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200">Reset</button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Roof Trigonometry Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Pitch Ratio / X:12</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-pitch">{res.pitchRatio.toFixed(4)}</div>
                  <div className="text-xs font-bold text-blue-700 mt-1" data-testid="res-pitch12">{res.pitchIn12.toFixed(2)}:12 ({res.slopePct.toFixed(2)}%)</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Pitch Angle &amp; Factor</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-angle">{res.angleDeg.toFixed(3)} deg</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1" data-testid="res-factor">Slope Factor: {res.rafterFactor.toFixed(4)}</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Total Sloped Roof Area</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-area">{res.totalRoofAreaM2.toFixed(2)} m2</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Single Rafter Length</div>
                  <div className="text-3xl font-black text-purple-800" data-testid="res-rafter">{res.rafterLenM.toFixed(4)} m</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Run = Span / 2; Pitch = Rise / Run; Factor = sqrt(1 + Pitch^2); Rafter = (Run + Overhang) * Factor; Total Gable Area = 2 * Length * Rafter.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
