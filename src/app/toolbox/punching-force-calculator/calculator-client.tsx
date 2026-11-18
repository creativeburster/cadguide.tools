'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

const STANDARD_GRAVITY = 9.80665;
type HoleShape = 'custom' | 'round' | 'rectangle' | 'oblong';

interface PunchResult {
  valid: boolean;
  error?: string;
  perimeterMm: number;
  forceKn: number;
  tonnageTf: number;
  strippingForceKn: number;
  recommendedPressTf: number;
  clearancePerSideMm: number;
  workDoneJ: number;
}

function solvePunchingForce(
  shape: HoleShape,
  perimeterStr: string,
  diameterStr: string,
  rectLenStr: string,
  rectWidStr: string,
  holeCountStr: string,
  thicknessStr: string,
  shearStrengthStr: string,
  penetrationStr: string,
  clearancePctStr: string,
  stripPctStr: string,
  pressMarginStr: string
): PunchResult {
  const count = Number(holeCountStr);
  const t = Number(thicknessStr);
  const tau = Number(shearStrengthStr);
  const penPct = Number(penetrationStr);
  const clrPct = Number(clearancePctStr);
  const stripPct = Number(stripPctStr);
  const sf = Number(pressMarginStr);

  if ([holeCountStr, thicknessStr, shearStrengthStr, penetrationStr, clearancePctStr, stripPctStr, pressMarginStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All thickness, shear strength, stripping, and press margin inputs are required.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
  }

  let singleP = 0;
  if (shape === 'round') {
    const d = Number(diameterStr);
    if (diameterStr.trim() === '' || !Number.isFinite(d) || d <= 0) {
      return { valid: false, error: 'Round hole diameter D must be > 0.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
    }
    singleP = Math.PI * d;
  } else if (shape === 'rectangle' || shape === 'oblong') {
    const l = Number(rectLenStr);
    const w = Number(rectWidStr);
    if (rectLenStr.trim() === '' || rectWidStr.trim() === '' || !Number.isFinite(l) || !Number.isFinite(w) || l <= 0 || w <= 0) {
      return { valid: false, error: 'Cutout length L and width W must be > 0.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
    }
    singleP = shape === 'rectangle' ? 2 * (l + w) : l >= w ? Math.PI * w + 2 * (l - w) : Math.PI * l + 2 * (w - l);
  } else {
    const p = Number(perimeterStr);
    if (perimeterStr.trim() === '' || !Number.isFinite(p) || p <= 0) {
      return { valid: false, error: 'Custom cut perimeter must be > 0.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
    }
    singleP = p;
  }

  if (![count, t, tau, penPct, clrPct, stripPct, sf].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
  }
  if (!Number.isInteger(count) || count < 1 || t <= 0 || tau <= 0 || penPct <= 0 || penPct > 100 || clrPct < 0 || stripPct < 0 || sf < 1) {
    return { valid: false, error: 'Require integer hole count >= 1, t > 0, tau > 0, 0 < pen <= 100%, clearance >= 0, strip >= 0, press factor >= 1.0.', perimeterMm: 0, forceKn: 0, tonnageTf: 0, strippingForceKn: 0, recommendedPressTf: 0, clearancePerSideMm: 0, workDoneJ: 0 };
  }

  const perimeterMm = singleP * count;
  const forceKn = (perimeterMm * t * tau) / 1000;
  const tonnageTf = forceKn / STANDARD_GRAVITY;
  const strippingForceKn = (stripPct / 100) * forceKn;
  const recommendedPressTf = tonnageTf * sf;
  const clearancePerSideMm = t * (clrPct / 100);
  const workDoneJ = forceKn * t * (penPct / 100);

  return { valid: true, perimeterMm, forceKn, tonnageTf, strippingForceKn, recommendedPressTf, clearancePerSideMm, workDoneJ };
}

export default function PunchingForceCalculatorClient() {
  const [shape, setShape] = useState<HoleShape>('custom');
  const [perimeterStr, setPerimeterStr] = useState('100');
  const [diameterStr, setDiameterStr] = useState('25');
  const [rectLenStr, setRectLenStr] = useState('30');
  const [rectWidStr, setRectWidStr] = useState('20');
  const [holeCountStr, setHoleCountStr] = useState('1');
  const [thicknessStr, setThicknessStr] = useState('2');
  const [shearStrengthStr, setShearStrengthStr] = useState('300');
  const [penetrationStr, setPenetrationStr] = useState('30');
  const [clearancePctStr, setClearancePctStr] = useState('6');
  const [stripPctStr, setStripPctStr] = useState('8');
  const [pressMarginStr, setPressMarginStr] = useState('1.30');

  const res = solvePunchingForce(
    shape, perimeterStr, diameterStr, rectLenStr, rectWidStr,
    holeCountStr, thicknessStr, shearStrengthStr, penetrationStr,
    clearancePctStr, stripPctStr, pressMarginStr
  );

  const handleReset = () => {
    setShape('custom'); setPerimeterStr('100'); setDiameterStr('25');
    setRectLenStr('30'); setRectWidStr('20'); setHoleCountStr('1');
    setThicknessStr('2'); setShearStrengthStr('300'); setPenetrationStr('30');
    setClearancePctStr('6'); setStripPctStr('8'); setPressMarginStr('1.30');
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      'Sheet Metal Punching Force Report,',
      `Cut Geometry,${shape}`,
      `Total Perimeter (mm),${res.perimeterMm.toFixed(4)}`,
      `Thickness (mm),${thicknessStr}`,
      `Shear Strength (MPa),${shearStrengthStr}`,
      `Punching Force (kN),${res.forceKn.toFixed(4)}`,
      `Metric Tonnage (tf @ 9.80665 m/s2),${res.tonnageTf.toFixed(4)}`,
      `Stripping Force (kN @ ${stripPctStr}%),${res.strippingForceKn.toFixed(4)}`,
      `Recommended Press Capacity (tf @ ${pressMarginStr}x),${res.recommendedPressTf.toFixed(4)}`,
      `Die Clearance Per Side (mm),${res.clearancePerSideMm.toFixed(4)}`,
      `Stroke Shear Work (J),${res.workDoneJ.toFixed(4)}`,
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'punching-force-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {([
              { id: 'custom', label: 'Custom P' },
              { id: 'round', label: 'Round (D)' },
              { id: 'rectangle', label: 'Rect (L*W)' },
              { id: 'oblong', label: 'Oblong Slot' },
            ] as const).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setShape(g.id)}
                className={`px-2.5 py-2 rounded-xl text-xs font-black border ${shape === g.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {shape === 'custom' && (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cut Perimeter (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-perimeter" value={perimeterStr} onChange={(e) => setPerimeterStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          )}
          {shape === 'round' && (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Hole Dia D (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diameterStr} onChange={(e) => setDiameterStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          )}
          {(shape === 'rectangle' || shape === 'oblong') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length L (mm)</label>
                <input type="text" inputMode="decimal" value={rectLenStr} onChange={(e) => setRectLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width W (mm)</label>
                <input type="text" inputMode="decimal" value={rectWidStr} onChange={(e) => setRectWidStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Thickness t (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-thickness" value={thicknessStr} onChange={(e) => setThicknessStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Hole Count</label>
              <input type="text" inputMode="numeric" data-testid="input-count" value={holeCountStr} onChange={(e) => setHoleCountStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Shear Strength (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-shear-strength" value={shearStrengthStr} onChange={(e) => setShearStrengthStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Penetration (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-penetration" value={penetrationStr} onChange={(e) => setPenetrationStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Clear (%t)</label>
              <input type="text" inputMode="decimal" value={clearancePctStr} onChange={(e) => setClearancePctStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Strip (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-strip" value={stripPctStr} onChange={(e) => setStripPctStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Press SF</label>
              <input type="text" inputMode="decimal" data-testid="input-sf" value={pressMarginStr} onChange={(e) => setPressMarginStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
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
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase mb-1">Punching Force</div>
                    <div data-testid="output-punching-force" className="text-3xl font-black text-blue-700">{res.forceKn.toFixed(3)}<span className="text-base text-blue-400"> kN</span></div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-xs font-black text-green-600 uppercase mb-1">Press Tonnage</div>
                    <div data-testid="output-press-tonnage" className="text-3xl font-black text-green-700">{res.tonnageTf.toFixed(4)}<span className="text-base text-green-500"> tf</span></div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-xs font-black text-orange-600 uppercase mb-1">Work Done</div>
                    <div data-testid="output-work-done" className="text-3xl font-black text-orange-700">{res.workDoneJ.toFixed(2)}<span className="text-base text-orange-400"> J</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-[11px] font-black text-slate-400 uppercase">Perimeter</div>
                    <div className="text-lg font-black text-slate-800">{res.perimeterMm.toFixed(2)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-[11px] font-black text-slate-400 uppercase">Stripping Force</div>
                    <div className="text-lg font-black text-slate-800" data-testid="output-strip">{res.strippingForceKn.toFixed(3)} kN</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-[11px] font-black text-slate-400 uppercase">Clearance / Side</div>
                    <div className="text-lg font-black text-purple-700">{res.clearancePerSideMm.toFixed(3)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-[11px] font-black text-slate-400 uppercase">Press w/ Margin</div>
                    <div className="text-lg font-black text-emerald-700" data-testid="output-safe-tf">{res.recommendedPressTf.toFixed(4)} tf</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Shear formula: F = P * t * tau / 1000 (kN); Tonnage = F / 9.80665 (metric ton-force); Work = F * t * penetration%.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
