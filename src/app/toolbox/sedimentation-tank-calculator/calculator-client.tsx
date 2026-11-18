'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface SedimentationResult {
  valid: boolean;
  error?: string;
  areaM2: number;
  diameterM: number;
  volumeM3: number;
  hrtHr: number;
  weirLenM: number;
  weirRateM3md: number;
  weirStatus: string;
}

function solveSedimentationTank(
  qStr: string,
  sorStr: string,
  depthStr: string,
  weirMaxStr: string
): SedimentationResult {
  const err = (msg: string): SedimentationResult => ({
    valid: false,
    error: msg,
    areaM2: 0,
    diameterM: 0,
    volumeM3: 0,
    hrtHr: 0,
    weirLenM: 0,
    weirRateM3md: 0,
    weirStatus: '',
  });

  if ([qStr, sorStr, depthStr, weirMaxStr].some((s) => s.trim() === '')) {
    return err('All flow, overflow rate, depth, and target weir loading inputs are required.');
  }
  const Q = Number(qStr);
  const SOR = Number(sorStr);
  const depth = Number(depthStr);
  const weirMax = Number(weirMaxStr);

  if (![Q, SOR, depth, weirMax].every(Number.isFinite)) {
    return err('All inputs must be valid finite numbers.');
  }
  if (Q <= 0 || SOR <= 0 || depth <= 0 || weirMax <= 0) {
    return err('Design flow, overflow rate, depth, and weir limit must all be > 0.');
  }

  const areaM2 = Q / SOR;
  const diameterM = Math.sqrt((4 * areaM2) / Math.PI);
  const volumeM3 = areaM2 * depth;
  const hrtHr = (volumeM3 / Q) * 24;
  const weirLenM = Math.PI * diameterM;
  const weirRateM3md = Q / weirLenM;
  const weirStatus = weirRateM3md <= weirMax ? 'OK (Within Limit)' : 'Exceeds Target Max';

  return {
    valid: true,
    areaM2,
    diameterM,
    volumeM3,
    hrtHr,
    weirLenM,
    weirRateM3md,
    weirStatus,
  };
}

export default function SedimentationTankCalculatorClient() {
  const [qStr, setQStr] = useState('12000');
  const [sorStr, setSorStr] = useState('32');
  const [depthStr, setDepthStr] = useState('3.8');
  const [weirMaxStr, setWeirMaxStr] = useState('180');

  const res = solveSedimentationTank(qStr, sorStr, depthStr, weirMaxStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Circular Sedimentation Clarifier Sizing Report', ''],
      ['Design Flow Q (m^3/d)', qStr],
      ['Surface Overflow Rate SOR (m^3/(m^2*d))', sorStr],
      ['Sidewater Depth H (m)', depthStr],
      ['Max Weir Loading Limit (m^3/(m*d))', weirMaxStr],
      ['Required Surface Area A (m^2)', res.areaM2.toFixed(2)],
      ['Clarifier Diameter D (m)', res.diameterM.toFixed(3)],
      ['Tank Hydraulic Volume V (m^3)', res.volumeM3.toFixed(1)],
      ['Hydraulic Retention Time HRT (hr)', res.hrtHr.toFixed(3)],
      ['Peripheral Weir Length (m)', res.weirLenM.toFixed(3)],
      ['Weir Overflow Rate (m^3/(m*d))', res.weirRateM3md.toFixed(2)],
      ['Weir Check Status', res.weirStatus],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sedimentation-tank-sizing.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Clarifier Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Design Flow Q (m3/d)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-q"
                value={qStr}
                onChange={(e) => setQStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Surface Overflow Rate (m3/m2*d)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sor"
                value={sorStr}
                onChange={(e) => setSorStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Water Depth (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-depth"
                  value={depthStr}
                  onChange={(e) => setDepthStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Weir Limit (m3/m*d)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-weir-max"
                  value={weirMaxStr}
                  onChange={(e) => setWeirMaxStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setQStr('12000');
              setSorStr('32');
              setDepthStr('3.8');
              setWeirMaxStr('180');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Clarifier Geometry &amp; Detention</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Required Surface Area</div>
                  <div className="text-2xl font-black text-blue-800" data-testid="res-area">{res.areaM2.toFixed(2)} m2</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Tank Diameter D</div>
                  <div className="text-2xl font-black text-emerald-800" data-testid="res-dia">{res.diameterM.toFixed(3)} m</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Hydraulic Volume V</div>
                  <div className="text-2xl font-black text-orange-800" data-testid="res-vol">{res.volumeM3.toFixed(1)} m3</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Retention Time HRT</div>
                  <div className="text-2xl font-black text-purple-800" data-testid="res-hrt">{res.hrtHr.toFixed(3)} hr</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2">
                  <div className="text-xs font-black text-slate-500 uppercase mb-1">Peripheral Weir Overflow Rate</div>
                  <div className="text-2xl font-black text-slate-800" data-testid="res-weir">{res.weirRateM3md.toFixed(2)} m3/(m*d)</div>
                  <div className="text-xs font-bold text-slate-600 mt-1" data-testid="res-weir-status">
                    Weir Length {res.weirLenM.toFixed(2)} m — {res.weirStatus}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                A = Q / SOR; D = sqrt(4 * A / pi); V = A * H; HRT = 24 * V / Q; Peripheral Weir Loading = Q / (pi * D).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
