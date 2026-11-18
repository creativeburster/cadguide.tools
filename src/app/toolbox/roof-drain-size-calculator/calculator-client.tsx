'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RoofDrainResult {
  valid: boolean;
  error?: string;
  effAreaM2: number;
  runoffLs: number;
  drainsRequired: number;
  scupperWidthM: number;
}

function solveRoofDrainage(
  roofAreaStr: string,
  wallAreaStr: string,
  wallFactorStr: string,
  rainMmHrStr: string,
  drainCapLsStr: string,
  scupHeadMStr: string,
  weirCwStr: string
): RoofDrainResult {
  if ([roofAreaStr, wallAreaStr, wallFactorStr, rainMmHrStr, drainCapLsStr, scupHeadMStr, weirCwStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All roof area, rainfall, leader capacity, and overflow scupper inputs are required.', effAreaM2: 0, runoffLs: 0, drainsRequired: 0, scupperWidthM: 0 };
  }
  const aRoof = Number(roofAreaStr);
  const aWall = Number(wallAreaStr);
  const kWall = Number(wallFactorStr);
  const intensity = Number(rainMmHrStr);
  const qDrain = Number(drainCapLsStr);
  const hScup = Number(scupHeadMStr);
  const cw = Number(weirCwStr);

  if (![aRoof, aWall, kWall, intensity, qDrain, hScup, cw].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', effAreaM2: 0, runoffLs: 0, drainsRequired: 0, scupperWidthM: 0 };
  }
  if (aRoof <= 0 || aWall < 0 || kWall < 0 || kWall > 1 || intensity <= 0 || qDrain <= 0 || hScup <= 0 || cw <= 0) {
    return { valid: false, error: 'Require positive roof area, intensity, drain capacity, weir head, Cw, wall area >= 0, and 0 <= k_wall <= 1.', effAreaM2: 0, runoffLs: 0, drainsRequired: 0, scupperWidthM: 0 };
  }

  const effAreaM2 = aRoof + kWall * aWall;
  // 1 mm/h on 1 m2 = 1 L / 3600 s
  const runoffLs = (effAreaM2 * intensity) / 3600;
  const drainsRequired = Math.ceil(runoffLs / qDrain);
  const qM3s = runoffLs / 1000;
  const scupperWidthM = qM3s / (cw * Math.pow(hScup, 1.5));

  return { valid: true, effAreaM2, runoffLs, drainsRequired, scupperWidthM };
}

export default function RoofDrainCalculatorClient() {
  const [roofStr, setRoofStr] = useState('1800');
  const [wallStr, setWallStr] = useState('200');
  const [kWallStr, setKWallStr] = useState('0.5');
  const [rainStr, setRainStr] = useState('75');
  const [capStr, setCapStr] = useState('11.5');
  const [headStr, setHeadStr] = useState('0.10');
  const [cwStr, setCwStr] = useState('1.84');

  const res = solveRoofDrainage(roofStr, wallStr, kWallStr, rainStr, capStr, headStr, cwStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Roof Drain & Emergency Scupper Sizing Report', ''],
      ['Horizontal Roof Area (m^2)', roofStr],
      ['Contributing Wall Area (m^2)', wallStr],
      ['Wall Runoff Factor k_wall', kWallStr],
      ['Design Rainfall Intensity (mm/h)', rainStr],
      ['Allowable Capacity per Drain (L/s)', capStr],
      ['Scupper Design Head (m) / Weir Coeff Cw', `${headStr} / ${cwStr}`],
      ['Effective Catchment Area (m^2)', res.effAreaM2.toFixed(2)],
      ['Peak Roof Runoff Flow (L/s)', res.runoffLs.toFixed(4)],
      ['Minimum Primary Drains Required', String(res.drainsRequired)],
      ['Total Emergency Scupper Weir Width (mm)', (res.scupperWidthM * 1000).toFixed(1)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roof-drainage-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Catchment Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Roof Area (m2)</label>
              <input type="text" inputMode="decimal" data-testid="input-area-roof" value={roofStr} onChange={(e) => setRoofStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wall Area (m2)</label>
              <input type="text" inputMode="decimal" data-testid="input-area-wall" value={wallStr} onChange={(e) => setWallStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wall Factor k_wall</label>
              <input type="text" inputMode="decimal" data-testid="input-kwall" value={kWallStr} onChange={(e) => setKWallStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Rainfall I (mm/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-rain" value={rainStr} onChange={(e) => setRainStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Leader Drain Capacity (L/s)</label>
            <input type="text" inputMode="decimal" data-testid="input-qdrain" value={capStr} onChange={(e) => setCapStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Scupper Head (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-hscup" value={headStr} onChange={(e) => setHeadStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Weir Coeff Cw</label>
              <input type="text" inputMode="decimal" data-testid="input-cw" value={cwStr} onChange={(e) => setCwStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setRoofStr('1800'); setWallStr('200'); setKWallStr('0.5');
              setRainStr('75'); setCapStr('11.5'); setHeadStr('0.10'); setCwStr('1.84');
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
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Drainage &amp; Overflow Results</h2>
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
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Primary Drains Required</div>
                  <div className="text-4xl font-black text-blue-900" data-testid="res-drains">{res.drainsRequired} drains</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Peak Runoff Rate</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-q">{res.runoffLs.toFixed(3)} L/s</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1" data-testid="res-aeff">Effective Area: {res.effAreaM2.toFixed(1)} m2</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 sm:col-span-2">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Required Total Rectangular Overflow Scupper Width</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-scupper">{(res.scupperWidthM * 1000).toFixed(1)} mm</div>
                  <div className="text-xs font-bold text-orange-700 mt-1">({res.scupperWidthM.toFixed(4)} m total weir crest at H = {headStr} m)</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Effective Area = A_roof + k_wall * A_wall; Q(L/s) = A_eff * I / 3600; Rectangular overflow scupper width B = (Q / 1000) / (Cw * H^1.5). Check regional plumbing codes for safety factors and secondary drain zoning.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
