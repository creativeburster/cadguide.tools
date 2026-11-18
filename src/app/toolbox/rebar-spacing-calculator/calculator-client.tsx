'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RebarSpacingResult {
  valid: boolean;
  error?: string;
  nx: number;
  ny: number;
  totalBars: number;
  netLengthM: number;
  grossLengthM: number;
  unitMassKgM: number;
  totalMassKg: number;
}

function solveRebarSpacing(
  lenMStr: string,
  widMStr: string,
  coverMmStr: string,
  sxMmStr: string,
  syMmStr: string,
  diaMmStr: string,
  layersStr: string,
  densityStr: string,
  wastePctStr: string,
  direction: 'both' | 'single'
): RebarSpacingResult {
  if ([lenMStr, widMStr, coverMmStr, sxMmStr, syMmStr, diaMmStr, layersStr, densityStr, wastePctStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All slab geometry, spacing, bar diameter, density, and allowance inputs are required.', nx: 0, ny: 0, totalBars: 0, netLengthM: 0, grossLengthM: 0, unitMassKgM: 0, totalMassKg: 0 };
  }
  const L = Number(lenMStr);
  const W = Number(widMStr);
  const cMm = Number(coverMmStr);
  const sxMm = Number(sxMmStr);
  const syMm = Number(syMmStr);
  const diaMm = Number(diaMmStr);
  const layers = Number(layersStr);
  const rho = Number(densityStr);
  const wastePct = Number(wastePctStr);

  if (![L, W, cMm, sxMm, syMm, diaMm, layers, rho, wastePct].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', nx: 0, ny: 0, totalBars: 0, netLengthM: 0, grossLengthM: 0, unitMassKgM: 0, totalMassKg: 0 };
  }
  const netSpanL = L - (2 * cMm) / 1000;
  const netSpanW = W - (2 * cMm) / 1000;
  if (L <= 0 || W <= 0 || cMm < 0 || netSpanL <= 0 || netSpanW <= 0 || sxMm <= 0 || syMm <= 0 || diaMm <= 0 || !Number.isInteger(layers) || layers < 1 || rho <= 0 || wastePct < 0) {
    return { valid: false, error: 'Require net dimensions > 2*cover, positive spacings and diameter, integer layers >= 1, density > 0, and waste >= 0%.', nx: 0, ny: 0, totalBars: 0, netLengthM: 0, grossLengthM: 0, unitMassKgM: 0, totalMassKg: 0 };
  }

  const nx = Math.ceil(netSpanL / (sxMm / 1000)) + 1;
  const ny = direction === 'both' ? Math.ceil(netSpanW / (syMm / 1000)) + 1 : 0;
  const totalBars = layers * (nx + ny);
  const netLengthM = layers * (nx * netSpanW + ny * netSpanL);
  const grossLengthM = netLengthM * (1 + wastePct / 100);
  const unitMassKgM = ((Math.PI * Math.pow(diaMm / 1000, 2)) / 4) * rho;
  const totalMassKg = grossLengthM * unitMassKgM;

  return { valid: true, nx, ny, totalBars, netLengthM, grossLengthM, unitMassKgM, totalMassKg };
}

export default function RebarSpacingCalculatorClient() {
  const [lenStr, setLenStr] = useState('10');
  const [widStr, setWidStr] = useState('5');
  const [coverStr, setCoverStr] = useState('50');
  const [sxStr, setSxStr] = useState('200');
  const [syStr, setSyStr] = useState('200');
  const [diaStr, setDiaStr] = useState('12');
  const [layersStr, setLayersStr] = useState('1');
  const [densityStr, setDensityStr] = useState('7850');
  const [wasteStr, setWasteStr] = useState('5');
  const [direction, setDirection] = useState<'both' | 'single'>('both');

  const res = solveRebarSpacing(lenStr, widStr, coverStr, sxStr, syStr, diaStr, layersStr, densityStr, wasteStr, direction);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Slab Rebar Spacing & Takeoff Report', ''],
      ['Slab Length / Width (m)', `${lenStr} x ${widStr}`],
      ['Edge Cover (mm)', coverStr],
      ['X / Y Spacing (mm)', `${sxStr} / ${syStr}`],
      ['Bar Diameter (mm)', diaStr],
      ['Mesh Layers', layersStr],
      ['Steel Density (kg/m^3)', densityStr],
      ['Lap & Waste Allowance (%)', wasteStr],
      ['Total Bar Count', String(res.totalBars)],
      ['Net Bar Length (m)', res.netLengthM.toFixed(3)],
      ['Gross Length incl Allowance (m)', res.grossLengthM.toFixed(3)],
      ['Exact Unit Mass (kg/m)', res.unitMassKgM.toFixed(6)],
      ['Total Rebar Mass (kg)', res.totalMassKg.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rebar-spacing-takeoff.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width W (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-wid" value={widStr} onChange={(e) => setWidStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Cover (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-cover" value={coverStr} onChange={(e) => setCoverStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Sx (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-sx" value={sxStr} onChange={(e) => setSxStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Sy (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-sy" value={syStr} onChange={(e) => setSyStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bar Dia (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Layers</label>
              <input type="text" inputMode="numeric" data-testid="input-layers" value={layersStr} onChange={(e) => setLayersStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Density (kg/m3)</label>
              <input type="text" inputMode="decimal" data-testid="input-density" value={densityStr} onChange={(e) => setDensityStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Waste/Lap (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-waste" value={wasteStr} onChange={(e) => setWasteStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Mesh Layout</label>
            <select data-testid="select-dir" value={direction} onChange={(e) => setDirection(e.target.value === 'single' ? 'single' : 'both')} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold">
              <option value="both">Bidirectional Mesh (X &amp; Y)</option>
              <option value="single">Unidirectional (X Only)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setLenStr('10'); setWidStr('5'); setCoverStr('50'); setSxStr('200'); setSyStr('200');
              setDiaStr('12'); setLayersStr('1'); setDensityStr('7850'); setWasteStr('5'); setDirection('both');
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Takeoff Results</h2>
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
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Bars</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-count">{res.totalBars}</div>
                  <div className="text-xs text-blue-700 mt-1">Nx = {res.nx} | Ny = {res.ny} (x {layersStr} layer)</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Net Cut Length</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-length">{res.netLengthM.toFixed(2)} m</div>
                  <div className="text-xs text-emerald-700 mt-1">Gross (+{wasteStr}%): {res.grossLengthM.toFixed(2)} m</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Total Mass (incl Allowance)</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-weight">{res.totalMassKg.toFixed(2)} kg</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Exact Unit Mass</div>
                  <div className="text-3xl font-black text-slate-900" data-testid="res-unit">{res.unitMassKgM.toFixed(4)} kg/m</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Bar count uses N = ceil((Span - 2*cover) / spacing) + 1 along net covered spans. Linear mass uses exact circular area (pi/4) * d^2 * density.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
