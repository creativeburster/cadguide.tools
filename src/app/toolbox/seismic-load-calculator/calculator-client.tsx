'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface StoryForceRow {
  level: number;
  elevM: number;
  weightKn: number;
  forceKn: number;
  shearCumKn: number;
}

interface SeismicLoadResult {
  valid: boolean;
  error?: string;
  csCoeff: number;
  vBaseKn: number;
  topForceKn: number;
  overturningMknm: number;
  stories: StoryForceRow[];
}

function solveSeismicLoad(
  saStr: string,
  rStr: string,
  ieStr: string,
  wStr: string,
  floorsStr: string,
  hsStr: string,
  kStr: string
): SeismicLoadResult {
  const fail = (msg: string): SeismicLoadResult => ({
    valid: false,
    error: msg,
    csCoeff: 0,
    vBaseKn: 0,
    topForceKn: 0,
    overturningMknm: 0,
    stories: [],
  });

  if ([saStr, rStr, ieStr, wStr, floorsStr, hsStr, kStr].some((s) => s.trim() === '')) {
    return fail('All spectral, modification, weight, story geometry, and exponent inputs are required.');
  }
  const sa = Number(saStr);
  const rFactor = Number(rStr);
  const ie = Number(ieStr);
  const wKn = Number(wStr);
  const floors = Number(floorsStr);
  const hsM = Number(hsStr);
  const kExp = Number(kStr);

  if (![sa, rFactor, ie, wKn, floors, hsM, kExp].every(Number.isFinite)) {
    return fail('All inputs must be valid finite numbers.');
  }
  if (sa < 0 || rFactor <= 0 || ie <= 0 || wKn <= 0 || hsM <= 0 || kExp < 0) {
    return fail('Require R > 0, Ie > 0, Weight > 0, Story Height > 0, Sa >= 0, and k >= 0.');
  }
  if (!Number.isInteger(floors) || floors < 1 || floors > 200) {
    return fail('Number of stories must be an integer between 1 and 200.');
  }

  const csCoeff = (sa * ie) / rFactor;
  const vBaseKn = csCoeff * wKn;
  const storyW = wKn / floors;

  let denom = 0;
  for (let i = 1; i <= floors; i++) {
    denom += storyW * Math.pow(i * hsM, kExp);
  }

  const rawRows: StoryForceRow[] = [];
  let overturningMknm = 0;
  for (let i = 1; i <= floors; i++) {
    const elevM = i * hsM;
    const forceKn = denom > 0 ? vBaseKn * ((storyW * Math.pow(elevM, kExp)) / denom) : 0;
    overturningMknm += forceKn * elevM;
    rawRows.push({
      level: i,
      elevM,
      weightKn: storyW,
      forceKn,
      shearCumKn: 0,
    });
  }

  let runningShear = 0;
  for (let idx = rawRows.length - 1; idx >= 0; idx--) {
    runningShear += rawRows[idx].forceKn;
    rawRows[idx].shearCumKn = runningShear;
  }

  const topForceKn = rawRows.length > 0 ? rawRows[rawRows.length - 1].forceKn : 0;

  return {
    valid: true,
    csCoeff,
    vBaseKn,
    topForceKn,
    overturningMknm,
    stories: rawRows,
  };
}

export default function SeismicLoadCalculatorClient() {
  const [saStr, setSaStr] = useState('0.5');
  const [rStr, setRStr] = useState('5');
  const [ieStr, setIeStr] = useState('1.0');
  const [wStr, setWStr] = useState('5000');
  const [floorsStr, setFloorsStr] = useState('5');
  const [hsStr, setHsStr] = useState('3.6');
  const [kStr, setKStr] = useState('1.0');

  const res = solveSeismicLoad(saStr, rStr, ieStr, wStr, floorsStr, hsStr, kStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows: string[][] = [
      ['Seismic Base Shear & Lateral Story Force Report', '', '', '', ''],
      ['Design Spectral Accel Sa (g)', saStr, 'Response Mod Factor R', rStr, ''],
      ['Importance Factor Ie', ieStr, 'Effective Weight W (kN)', wStr, ''],
      ['Seismic Coefficient Cs', res.csCoeff.toFixed(6), 'Total Base Shear V (kN)', res.vBaseKn.toFixed(3), ''],
      ['Roof Level Force F_top (kN)', res.topForceKn.toFixed(3), 'Overturning Moment (kN*m)', res.overturningMknm.toFixed(2), ''],
      ['Story Level', 'Elevation h (m)', 'Story Weight w_i (kN)', 'Lateral Force F_i (kN)', 'Cumulative Story Shear V_i (kN)'],
      ...res.stories.map((row) => [
        String(row.level),
        row.elevM.toFixed(2),
        row.weightKn.toFixed(2),
        row.forceKn.toFixed(3),
        row.shearCumKn.toFixed(3),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seismic-base-shear-distribution.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Seismic &amp; Building Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Spectral Accel Sa (g)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sa"
                value={saStr}
                onChange={(e) => setSaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Response Factor R</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-r"
                value={rStr}
                onChange={(e) => setRStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Importance Factor Ie</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ie"
                value={ieStr}
                onChange={(e) => setIeStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Total Weight W (kN)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-weight"
                value={wStr}
                onChange={(e) => setWStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Stories (N)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-floors"
                value={floorsStr}
                onChange={(e) => setFloorsStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Story Height (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-story-h"
                value={hsStr}
                onChange={(e) => setHsStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Vertical Distribution Exponent (k)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-k"
              value={kStr}
              onChange={(e) => setKStr(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSaStr('0.5');
              setRStr('5');
              setIeStr('1.0');
              setWStr('5000');
              setFloorsStr('5');
              setHsStr('3.6');
              setKStr('1.0');
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Base Shear &amp; Story Distribution</h2>
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase mb-1">Response Coeff Cs</div>
                    <div className="text-2xl font-black text-blue-800" data-testid="res-cs">{res.csCoeff.toFixed(4)}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase mb-1">Base Shear V</div>
                    <div className="text-2xl font-black text-emerald-800" data-testid="res-vbase">{res.vBaseKn.toFixed(2)} kN</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase mb-1">Roof Lateral Force</div>
                    <div className="text-2xl font-black text-orange-800" data-testid="res-topf">{res.topForceKn.toFixed(2)} kN</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                    <div className="text-xs font-black text-purple-500 uppercase mb-1">Base Moment M</div>
                    <div className="text-2xl font-black text-purple-800" data-testid="res-mbase">{res.overturningMknm.toFixed(2)} kN*m</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black">
                      <tr>
                        <th className="px-4 py-2.5">Level</th>
                        <th className="px-4 py-2.5">Elev (m)</th>
                        <th className="px-4 py-2.5">Force Fx (kN)</th>
                        <th className="px-4 py-2.5">Cum Shear Vx (kN)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {res.stories.slice(0, 12).map((row) => (
                        <tr key={row.level}>
                          <td className="px-4 py-2">Story {row.level}</td>
                          <td className="px-4 py-2">{row.elevM.toFixed(2)}</td>
                          <td className="px-4 py-2">{row.forceKn.toFixed(2)}</td>
                          <td className="px-4 py-2">{row.shearCumKn.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Cs = Sa * Ie / R; V = Cs * W; Vertical force distribution F_i = V * (w_i * h_i^k) / Sum(w_j * h_j^k); Base Overturning Moment M = Sum(F_i * h_i).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
