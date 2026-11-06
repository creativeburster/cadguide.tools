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

export default function BendingForceCalculatorClient() {
  const [strengthStr, setStrengthStr] = useState('450');
  const [lengthStr, setLengthStr] = useState('1000');
  const [thicknessStr, setThicknessStr] = useState('3');
  const [dieOpeningStr, setDieOpeningStr] = useState('24');

  const result = useMemo(() => {
    const sigma = parseNum(strengthStr);
    const L = parseNum(lengthStr);
    const t = parseNum(thicknessStr);
    const V = parseNum(dieOpeningStr);

    if (
      sigma === null || L === null || t === null || V === null ||
      sigma <= 0 || L <= 0 || t <= 0 || V <= 0
    ) {
      return { F: null, Ft: null, FPerMeter: null };
    }

    // Standard Air Bending formula: F = (1.42 * sigma * L * t^2) / (V * 1000) [kN]
    const F = (1.42 * sigma * L * Math.pow(t, 2)) / (V * 1000);
    // 1 metric ton-force = 9.80665 kN
    const Ft = F / 9.80665;
    const FPerMeter = (F / L) * 1000;

    return { F, Ft, FPerMeter };
  }, [strengthStr, lengthStr, thicknessStr, dieOpeningStr]);

  const handleReset = () => {
    setStrengthStr('450');
    setLengthStr('1000');
    setThicknessStr('3');
    setDieOpeningStr('24');
  };

  const applyPreset = (sigma: string, l: string, t: string, v: string) => {
    setStrengthStr(sigma);
    setLengthStr(l);
    setThicknessStr(t);
    setDieOpeningStr(v);
  };

  const handleExportCsv = () => {
    const csvContent = [
      '# Press Brake Air Bending Force & Tonnage (Amada / Trumpf Standard)',
      '# Verified by CADGuide.tools Toolbox',
      'Parameter,Value,Unit',
      `Material Strength (sigma),${strengthStr},MPa`,
      `Bend Length (L),${lengthStr},mm`,
      `Sheet Thickness (t),${thicknessStr},mm`,
      `V-Die Opening Width (V),${dieOpeningStr},mm`,
      `Required Bending Force,${result.F !== null ? result.F.toFixed(3) : '—'},kN`,
      `Press Brake Tonnage,${result.Ft !== null ? result.Ft.toFixed(3) : '—'},ton`,
      `Specific Force Per Meter,${result.FPerMeter !== null ? result.FPerMeter.toFixed(3) : '—'},kN/m`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bending_force_calculation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Tooling Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Press Presets:</span>
        <button
          type="button"
          data-testid="preset-mild-steel"
          onClick={() => applyPreset('450', '1000', '3', '24')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Mild Steel (450 MPa, 3 mm, V=24)
        </button>
        <button
          type="button"
          data-testid="preset-stainless-304"
          onClick={() => applyPreset('600', '1000', '2', '16')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Stainless 304 (600 MPa, 2 mm, V=16)
        </button>
        <button
          type="button"
          data-testid="preset-aluminum-5052"
          onClick={() => applyPreset('220', '2000', '4', '32')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Aluminum 5052 (220 MPa, 4 mm, V=32)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title="Reset defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Material Strength σ (MPa)</label>
            <input
              type="text"
              data-testid="input-strength"
              value={strengthStr}
              onChange={(e) => setStrengthStr(e.target.value)}
              placeholder="450"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bend Length L (mm)</label>
            <input
              type="text"
              data-testid="input-length"
              value={lengthStr}
              onChange={(e) => setLengthStr(e.target.value)}
              placeholder="1000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sheet Thickness t (mm)</label>
            <input
              type="text"
              data-testid="input-thickness"
              value={thicknessStr}
              onChange={(e) => setThicknessStr(e.target.value)}
              placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">V-Die Opening V (mm)</label>
            <input
              type="text"
              data-testid="input-die-opening"
              value={dieOpeningStr}
              onChange={(e) => setDieOpeningStr(e.target.value)}
              placeholder="24"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
            <span className="text-xs text-slate-400 mt-1 block">
              {parseNum(thicknessStr) !== null && parseNum(dieOpeningStr) !== null && parseNum(thicknessStr)! > 0
                ? `V/t ratio: ${(parseNum(dieOpeningStr)! / parseNum(thicknessStr)!).toFixed(1)}× (recommended 6×–10×)`
                : '—'}
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Calculation (CSV)
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Press Tonnage Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Bending Force F</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-force">
                    {result.F !== null ? result.F.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-blue-400 font-bold ml-1">kN</span>
                </div>
                <div className="text-xs text-blue-500 font-semibold mt-1">F = 1.42·σ·L·t² / (V·1000)</div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-100">
                <div className="text-base font-black text-emerald-400 uppercase tracking-wider mb-2">Press Tonnage Ft</div>
                <div className="text-3xl font-black text-emerald-700">
                  <span data-testid="result-tonnage">
                    {result.Ft !== null ? result.Ft.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-emerald-400 font-bold ml-1">ton</span>
                </div>
                <div className="text-xs text-emerald-500 font-semibold mt-1">Ft = F / 9.80665 kN/t</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-xs font-black text-slate-400 uppercase mb-1">Specific Force Per Meter</div>
              <div className="text-xl font-black text-slate-800">
                <span data-testid="result-force-per-meter">
                  {result.FPerMeter !== null ? result.FPerMeter.toFixed(3) : '—'}
                </span>
                <span className="text-sm font-semibold text-slate-400 ml-1">kN/m</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Line load on press brake tooling</div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                <Info className="w-4 h-4 text-purple-500 shrink-0" />
                Air Bending Mechanics (DIN 6935 / Amada Tooling Standards)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                The factor 1.42 represents the standard air-bending coefficient for 90° V-dies where V = 6t–10t. For bottoming or coining operations, required tonnage may increase 3× to 5×.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
