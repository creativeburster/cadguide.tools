'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download } from 'lucide-react';

const PRESET_DIAS = ['8', '10', '12', '16', '20', '25', '32', '40'];
const LB_PER_KG = 1 / 0.45359237;
const M_PER_FT = 0.3048;

interface RebarWeightResult {
  valid: boolean;
  error?: string;
  areaMm2: number;
  unitKgM: number;
  unitLbFt: number;
  singleBarKg: number;
  barsWidth: number;
  barsLength: number;
  totalBars: number;
  totalLenM: number;
  totalWeightKg: number;
}

function solveRebarWeight(
  diaMmStr: string,
  densityStr: string,
  barLenStr: string,
  spacingMmStr: string,
  slabWidthStr: string,
  slabLengthStr: string,
  wastePctStr: string
): RebarWeightResult {
  if ([diaMmStr, densityStr, barLenStr, spacingMmStr, slabWidthStr, slabLengthStr, wastePctStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All diameter, steel density, bar length, spacing, and slab dimensions are required.', areaMm2: 0, unitKgM: 0, unitLbFt: 0, singleBarKg: 0, barsWidth: 0, barsLength: 0, totalBars: 0, totalLenM: 0, totalWeightKg: 0 };
  }
  const d = Number(diaMmStr);
  const rho = Number(densityStr);
  const len = Number(barLenStr);
  const s = Number(spacingMmStr);
  const W = Number(slabWidthStr);
  const L = Number(slabLengthStr);
  const waste = Number(wastePctStr);

  if (![d, rho, len, s, W, L, waste].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', areaMm2: 0, unitKgM: 0, unitLbFt: 0, singleBarKg: 0, barsWidth: 0, barsLength: 0, totalBars: 0, totalLenM: 0, totalWeightKg: 0 };
  }
  if (d <= 0 || rho <= 0 || len <= 0 || s <= 0 || W <= 0 || L <= 0 || waste < 0) {
    return { valid: false, error: 'Require positive geometry/density/spacing inputs and waste allowance >= 0%.', areaMm2: 0, unitKgM: 0, unitLbFt: 0, singleBarKg: 0, barsWidth: 0, barsLength: 0, totalBars: 0, totalLenM: 0, totalWeightKg: 0 };
  }

  const areaMm2 = (Math.PI * d * d) / 4;
  const unitKgM = (areaMm2 / 1e6) * rho;
  const unitLbFt = unitKgM * LB_PER_KG * M_PER_FT;
  const singleBarKg = unitKgM * len;

  const barsWidth = Math.ceil((W * 1000) / s) + 1;
  const barsLength = Math.ceil((L * 1000) / s) + 1;
  const totalBars = barsWidth + barsLength;
  const totalLenM = (barsWidth * L + barsLength * W) * (1 + waste / 100);
  const totalWeightKg = totalLenM * unitKgM;

  return { valid: true, areaMm2, unitKgM, unitLbFt, singleBarKg, barsWidth, barsLength, totalBars, totalLenM, totalWeightKg };
}

export default function RebarWeightClient() {
  const [diaStr, setDiaStr] = useState('12');
  const [densityStr, setDensityStr] = useState('7850');
  const [barLenStr, setBarLenStr] = useState('12');
  const [spacingStr, setSpacingStr] = useState('200');
  const [slabWStr, setSlabWStr] = useState('4');
  const [slabLStr, setSlabLStr] = useState('6');
  const [wasteStr, setWasteStr] = useState('0');

  const res = solveRebarWeight(diaStr, densityStr, barLenStr, spacingStr, slabWStr, slabLStr, wasteStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Rebar Unit Mass & Slab Mesh Report', ''],
      ['Nominal Bar Diameter (mm)', diaStr],
      ['Steel Density (kg/m^3)', densityStr],
      ['Single Bar Stock Length (m)', barLenStr],
      ['Grid Spacing (mm)', spacingStr],
      ['Slab Dimensions (m x m)', `${slabWStr} x ${slabLStr}`],
      ['Waste & Lap Allowance (%)', wasteStr],
      ['Cross-Sectional Area (mm^2)', res.areaMm2.toFixed(4)],
      ['Unit Mass (kg/m)', res.unitKgM.toFixed(6)],
      ['Unit Mass (lb/ft)', res.unitLbFt.toFixed(6)],
      ['Single Bar Mass (kg)', res.singleBarKg.toFixed(4)],
      ['Total Bars (Bidirectional)', String(res.totalBars)],
      ['Total Rebar Length (m)', res.totalLenM.toFixed(3)],
      ['Total Mesh Mass (kg)', res.totalWeightKg.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rebar-weight-takeoff.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-2">Quick Metric Bar Size</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRESET_DIAS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiaStr(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border ${diaStr === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                >
                  {d}mm
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bar Dia (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Density (kg/m3)</label>
                <input type="text" inputMode="decimal" data-testid="input-density" value={densityStr} onChange={(e) => setDensityStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bar Length (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-bar-len" value={barLenStr} onChange={(e) => setBarLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Spacing (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-spacing" value={spacingStr} onChange={(e) => setSpacingStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Width W (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-slab-w" value={slabWStr} onChange={(e) => setSlabWStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Length L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-slab-l" value={slabLStr} onChange={(e) => setSlabLStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Waste (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-waste" value={wasteStr} onChange={(e) => setWasteStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Exact Circular Weight Results</h2>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Unit Linear Mass</div>
                    <div className="text-3xl font-black text-slate-900" data-testid="res-unit-weight">{res.unitKgM.toFixed(4)} kg/m</div>
                    <div className="text-sm font-bold text-slate-600 mt-1" data-testid="res-unit-lbft">{res.unitLbFt.toFixed(4)} lb/ft | Area {res.areaMm2.toFixed(2)} mm2</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Single Bar Weight ({barLenStr} m)</div>
                    <div className="text-3xl font-black text-blue-800" data-testid="res-bar-weight">{res.singleBarKg.toFixed(3)} kg</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Bidirectional Slab Mesh Takeoff</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Bars W / L</div>
                      <div className="text-lg font-black text-slate-800">{res.barsWidth} / {res.barsLength} ({res.totalBars})</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Total Length</div>
                      <div className="text-lg font-black text-slate-800" data-testid="res-total-len">{res.totalLenM.toFixed(2)} m</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Total Mass</div>
                      <div className="text-lg font-black text-emerald-700" data-testid="res-total-weight">{res.totalWeightKg.toFixed(2)} kg</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Total Tonnage</div>
                      <div className="text-lg font-black text-slate-800">{(res.totalWeightKg / 1000).toFixed(4)} t</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Uses exact cross-sectional area A = (pi / 4) * d^2 and custom steel density rho (default 7850 kg/m3), without truncated hand-rule divisors.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
