'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseNum(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

type HoleShape = 'custom' | 'round' | 'rectangle' | 'oblong';

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
  const [clearancePctStr, setClearancePctStr] = useState('6'); // % of thickness per side

  const handleShapeChange = (nextShape: HoleShape) => {
    setShape(nextShape);
    if (nextShape === 'round') {
      const d = parseNum(diameterStr) ?? 25;
      setPerimeterStr((Math.PI * d).toFixed(2));
    } else if (nextShape === 'rectangle') {
      const l = parseNum(rectLenStr) ?? 30;
      const w = parseNum(rectWidStr) ?? 20;
      setPerimeterStr((2 * (l + w)).toFixed(2));
    } else if (nextShape === 'oblong') {
      const l = parseNum(rectLenStr) ?? 30;
      const w = parseNum(rectWidStr) ?? 20;
      const p = l >= w ? Math.PI * w + 2 * (l - w) : Math.PI * l + 2 * (w - l);
      setPerimeterStr(p.toFixed(2));
    }
  };

  const effectivePerimeter = useMemo(() => {
    const count = Math.max(1, parseNum(holeCountStr) ?? 1);
    if (shape === 'round') {
      const d = parseNum(diameterStr);
      if (d === null || d <= 0) return null;
      return Math.PI * d * count;
    }
    if (shape === 'rectangle') {
      const l = parseNum(rectLenStr);
      const w = parseNum(rectWidStr);
      if (l === null || w === null || l <= 0 || w <= 0) return null;
      return 2 * (l + w) * count;
    }
    if (shape === 'oblong') {
      const l = parseNum(rectLenStr);
      const w = parseNum(rectWidStr);
      if (l === null || w === null || l <= 0 || w <= 0) return null;
      const singleP = l >= w ? Math.PI * w + 2 * (l - w) : Math.PI * l + 2 * (w - l);
      return singleP * count;
    }
    const p = parseNum(perimeterStr);
    if (p === null || p <= 0) return null;
    return p * count;
  }, [shape, perimeterStr, diameterStr, rectLenStr, rectWidStr, holeCountStr]);

  const result = useMemo(() => {
    const P = effectivePerimeter;
    const t = parseNum(thicknessStr);
    const tau = parseNum(shearStrengthStr);
    const penPct = parseNum(penetrationStr);
    const clrPct = parseNum(clearancePctStr);

    if (
      P === null || t === null || tau === null || penPct === null || clrPct === null ||
      P <= 0 || t <= 0 || tau <= 0 || penPct <= 0 || clrPct < 0
    ) {
      return null;
    }

    const ss = tau * 1e6; // Pa
    const pen = penPct / 100;
    // F (kN) = (P/1000) * (t/1000) * ss / 1000
    const F = (P / 1000) * (t / 1000) * (ss / 1000);
    // Press tonnage (metric ton, g = 9.81 m/s^2)
    const Ft = F / 9.81;
    // Work done (J) = F (kN) * 1000 * (t / 1000) * pen
    const W = F * 1000 * (t / 1000) * pen;
    // Stripping force (typically 8% of punching force)
    const Fstrip = 0.08 * F;
    // Recommended press capacity with 30% safety margin
    const safeTonnage = Ft * 1.3;
    // Die clearance per side (mm)
    const clearancePerSide = t * (clrPct / 100);

    return {
      P,
      F,
      Ft,
      W,
      Fstrip,
      safeTonnage,
      clearancePerSide,
    };
  }, [effectivePerimeter, thicknessStr, shearStrengthStr, penetrationStr, clearancePctStr]);

  const formatNum = (n: number | null | undefined) => {
    if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(4);
  };

  const applyMaterialPreset = (
    nextShape: HoleShape,
    p: string,
    t: string,
    tau: string,
    pen: string,
    clr: string
  ) => {
    setShape(nextShape);
    setPerimeterStr(p);
    setHoleCountStr('1');
    setThicknessStr(t);
    setShearStrengthStr(tau);
    setPenetrationStr(pen);
    setClearancePctStr(clr);
  };

  const handleReset = () => {
    applyMaterialPreset('custom', '100', '2', '300', '30', '6');
  };

  const downloadCsv = () => {
    if (!result) return;
    const rows = [
      '# Sheet Metal Punching & Blanking Tonnage Report',
      '# Verified by CADGuide.tools Engineering Toolbox',
      'Parameter,Value,Unit',
      `Cut Geometry Mode,${shape},`,
      `Total Cut Perimeter (P),${result.P.toFixed(2)},mm`,
      `Sheet Thickness (t),${thicknessStr},mm`,
      `Material Shear Strength (tau),${shearStrengthStr},MPa`,
      `Slug Penetration Ratio,${penetrationStr},%`,
      `Punching Force (F),${result.F.toFixed(3)},kN`,
      `Press Tonnage,${result.Ft.toFixed(3)},ton`,
      `Recommended Press Capacity (1.3x Safety),${result.safeTonnage.toFixed(2)},ton`,
      `Stripping Force (8% F),${result.Fstrip.toFixed(3)},kN`,
      `Die Clearance Per Side,${result.clearancePerSide.toFixed(3)},mm`,
      `Work Done Per Stroke (W),${result.W.toFixed(3)},J`,
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
      {/* Material & Stamping Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Stamping Presets:</span>
        <button
          type="button"
          data-testid="preset-default-mild"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Mild Steel Default (P=100 mm, t=2 mm, τ=300 MPa)
        </button>
        <button
          type="button"
          data-testid="preset-ss304"
          onClick={() => applyMaterialPreset('custom', '150', '2.5', '520', '25', '8')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Stainless 304 (P=150 mm, t=2.5 mm, τ=520 MPa, Clr 8%)
        </button>
        <button
          type="button"
          data-testid="preset-al5052"
          onClick={() => applyMaterialPreset('custom', '120', '3', '145', '35', '5')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Aluminum 5052 (P=120 mm, t=3 mm, τ=145 MPa, Clr 5%)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Punch Geometry Mode Selector */}
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Punch Cutout Geometry</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'custom' as const, label: 'Custom Perimeter' },
                { id: 'round' as const, label: 'Round Hole (ØD)' },
                { id: 'rectangle' as const, label: 'Rect Hole (L×W)' },
                { id: 'oblong' as const, label: 'Oblong Slot' },
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleShapeChange(g.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    shape === g.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {shape === 'custom' && (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Perimeter (mm)</label>
              <input
                type="text"
                data-testid="input-perimeter"
                value={perimeterStr}
                onChange={e => setPerimeterStr(e.target.value)}
                placeholder="100"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
          )}

          {shape === 'round' && (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Hole Diameter D (mm)</label>
              <input
                type="text"
                value={diameterStr}
                onChange={e => setDiameterStr(e.target.value)}
                placeholder="25"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          )}

          {(shape === 'rectangle' || shape === 'oblong') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Length L (mm)</label>
                <input
                  type="text"
                  value={rectLenStr}
                  onChange={e => setRectLenStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Width W (mm)</label>
                <input
                  type="text"
                  value={rectWidStr}
                  onChange={e => setRectWidStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Thickness (mm)</label>
              <input
                type="text"
                data-testid="input-thickness"
                value={thicknessStr}
                onChange={e => setThicknessStr(e.target.value)}
                placeholder="2"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Simultaneous Holes</label>
              <input
                type="text"
                value={holeCountStr}
                onChange={e => setHoleCountStr(e.target.value)}
                placeholder="1"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shear Strength (MPa)</label>
            <input
              type="text"
              data-testid="input-shear-strength"
              value={shearStrengthStr}
              onChange={e => setShearStrengthStr(e.target.value)}
              placeholder="300"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Penetration (%)</label>
              <input
                type="text"
                data-testid="input-penetration"
                value={penetrationStr}
                onChange={e => setPenetrationStr(e.target.value)}
                placeholder="30"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Die Clearance (%t)</label>
              <input
                type="text"
                value={clearancePctStr}
                onChange={e => setClearancePctStr(e.target.value)}
                placeholder="6"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Punching Force</div>
                <div data-testid="output-punching-force" className="text-3xl font-black text-blue-700">
                  {formatNum(result?.F)}
                  <span className="text-base text-blue-400"> kN</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Press Tonnage</div>
                <div data-testid="output-press-tonnage" className="text-3xl font-black text-green-700">
                  {formatNum(result?.Ft)}
                  <span className="text-base text-green-500"> ton</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Work Done</div>
                <div data-testid="output-work-done" className="text-3xl font-black text-orange-700">
                  {formatNum(result?.W)}
                  <span className="text-base text-orange-400"> J</span>
                </div>
              </div>
            </div>

            {/* Secondary Tooling & Die Engineering Outputs */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Total Cut Perimeter</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {result ? `${result.P.toFixed(2)} mm` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Stripping Force (8%)</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {result ? `${result.Fstrip.toFixed(2)} kN` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Die Clearance / Side</div>
                <div className="text-lg font-black text-purple-700 mt-0.5">
                  {result ? `${result.clearancePerSide.toFixed(3)} mm` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Min Press (1.3x Safe)</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {result ? `${result.safeTonnage.toFixed(2)} ton` : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Formula: <code className="font-mono font-bold">F = P × t × τ / 1000 (kN)</code> •{' '}
                  <code className="font-mono font-bold">Tonnage = F / 9.81 (ton)</code> •{' '}
                  <code className="font-mono font-bold">Die Clearance = c% × t (mm/side)</code>
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
