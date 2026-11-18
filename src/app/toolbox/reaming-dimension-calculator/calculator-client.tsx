'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const MATERIAL_DEFAULTS = [
  { label: 'Steel Ref (0.22mm, 12m/min)', stockMm: '0.22', vc: '12' },
  { label: 'Cast Iron Ref (0.28mm, 14m/min)', stockMm: '0.28', vc: '14' },
  { label: 'Aluminum Ref (0.18mm, 24m/min)', stockMm: '0.18', vc: '24' },
];

interface ReamingResult {
  valid: boolean;
  error?: string;
  preDrillDiaMm: number;
  radialDepthMm: number;
  reamerMidTargetMm: number;
  spindleRpm: number;
  feedRateMmMin: number;
}

function solveReaming(
  targetDiaStr: string,
  tolUpperMmStr: string,
  tolLowerMmStr: string,
  stockAllowanceMmStr: string,
  vcMMinStr: string,
  fzMmToothStr: string,
  flutesStr: string
): ReamingResult {
  if ([targetDiaStr, tolUpperMmStr, tolLowerMmStr, stockAllowanceMmStr, vcMMinStr, fzMmToothStr, flutesStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All hole geometry, allowance, and cutting parameters are required.', preDrillDiaMm: 0, radialDepthMm: 0, reamerMidTargetMm: 0, spindleRpm: 0, feedRateMmMin: 0 };
  }
  const D = Number(targetDiaStr);
  const tolHi = Number(tolUpperMmStr);
  const tolLo = Number(tolLowerMmStr);
  const stock = Number(stockAllowanceMmStr);
  const vc = Number(vcMMinStr);
  const fz = Number(fzMmToothStr);
  const z = Number(flutesStr);

  if (![D, tolHi, tolLo, stock, vc, fz, z].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', preDrillDiaMm: 0, radialDepthMm: 0, reamerMidTargetMm: 0, spindleRpm: 0, feedRateMmMin: 0 };
  }
  if (D <= 0 || stock <= 0 || stock >= D || tolHi < tolLo || vc <= 0 || fz <= 0 || !Number.isInteger(z) || z < 2) {
    return { valid: false, error: 'Require D > stock > 0, upper tol >= lower tol, Vc > 0, fz > 0, and integer flutes >= 2.', preDrillDiaMm: 0, radialDepthMm: 0, reamerMidTargetMm: 0, spindleRpm: 0, feedRateMmMin: 0 };
  }

  const preDrillDiaMm = D - stock;
  const radialDepthMm = stock / 2;
  const reamerMidTargetMm = D + 0.5 * (tolHi + tolLo);
  const spindleRpm = (1000 * vc) / (Math.PI * D);
  const feedRateMmMin = fz * z * spindleRpm;

  return { valid: true, preDrillDiaMm, radialDepthMm, reamerMidTargetMm, spindleRpm, feedRateMmMin };
}

export default function ReamingDimensionCalculatorClient() {
  const [targetDiaStr, setTargetDiaStr] = useState('20');
  const [tolHiStr, setTolHiStr] = useState('0.021');
  const [tolLoStr, setTolLoStr] = useState('0.000');
  const [stockStr, setStockStr] = useState('0.22');
  const [vcStr, setVcStr] = useState('12');
  const [fzStr, setFzStr] = useState('0.08');
  const [flutesStr, setFlutesStr] = useState('6');

  const res = solveReaming(targetDiaStr, tolHiStr, tolLoStr, stockStr, vcStr, fzStr, flutesStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Hole Reaming Sizing & Feeds Report', ''],
      ['Target Nominal Hole Dia D (mm)', targetDiaStr],
      ['Tolerance Band Upper / Lower (mm)', `${tolHiStr} / ${tolLoStr}`],
      ['Diametral Reaming Stock Allowance (mm)', stockStr],
      ['Cutting Speed Vc (m/min)', vcStr],
      ['Feed per Tooth fz (mm/tooth)', fzStr],
      ['Reamer Flutes z', flutesStr],
      ['Pre-Ream Drill Diameter (mm)', res.preDrillDiaMm.toFixed(4)],
      ['Radial Depth of Cut ae (mm)', res.radialDepthMm.toFixed(4)],
      ['Mid-Tolerance Target Size (mm)', res.reamerMidTargetMm.toFixed(4)],
      ['Spindle Speed (rpm)', res.spindleRpm.toFixed(2)],
      ['Linear Table Feed (mm/min)', res.feedRateMmMin.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reaming-hole-dimension.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {MATERIAL_DEFAULTS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => { setStockStr(m.stockMm); setVcStr(m.vc); }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200"
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Finish Dia D (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={targetDiaStr} onChange={(e) => setTargetDiaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Diametral Stock (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-stock" value={stockStr} onChange={(e) => setStockStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Upper Tol (+mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-tol-hi" value={tolHiStr} onChange={(e) => setTolHiStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Lower Tol (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-tol-lo" value={tolLoStr} onChange={(e) => setTolLoStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Vc (m/min)</label>
              <input type="text" inputMode="decimal" data-testid="input-vc" value={vcStr} onChange={(e) => setVcStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">fz (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-fz" value={fzStr} onChange={(e) => setFzStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Flutes z</label>
              <input type="text" inputMode="numeric" data-testid="input-flutes" value={flutesStr} onChange={(e) => setFlutesStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          </div>

          <button type="button" onClick={() => { setTargetDiaStr('20'); setTolHiStr('0.021'); setTolLoStr('0.000'); setStockStr('0.22'); setVcStr('12'); setFzStr('0.08'); setFlutesStr('6'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Pre-Ream Drill Diameter</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-drill">{res.preDrillDiaMm.toFixed(4)}<span className="text-lg text-blue-400"> mm</span></div>
                    <div className="text-xs text-blue-600 font-bold mt-1">Radial cut ae = {res.radialDepthMm.toFixed(4)} mm</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Spindle Speed &amp; Feed</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-rpm">{res.spindleRpm.toFixed(2)}<span className="text-lg text-emerald-500"> rpm</span></div>
                    <div className="text-xs text-emerald-600 font-bold mt-1" data-testid="res-feed">Table Feed: {res.feedRateMmMin.toFixed(2)} mm/min</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-600">Tolerance Midpoint Reference Diameter</span>
                  <span className="font-black text-slate-900" data-testid="res-mid">{res.reamerMidTargetMm.toFixed(4)} mm</span>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Pre-drill = Finish_D - Stock_allowance; n = 1000*Vc / (pi*D); vf = fz * z * n. Verify reamer supplier stock guidelines for alloy hardness.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
