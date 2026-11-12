'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

interface AlloyPreset {
  id: string;
  label: string;
  typicalRate: string;
}

const ALLOY_PRESETS: AlloyPreset[] = [
  { id: 'cast_iron', label: 'Gray Cast Iron (Typical 1.0%)', typicalRate: '1.0' },
  { id: 'ductile_iron', label: 'Ductile Iron (Typical 0.8%)', typicalRate: '0.8' },
  { id: 'steel', label: 'Carbon Steel (Typical 2.0%)', typicalRate: '2.0' },
  { id: 'stainless', label: 'Stainless Steel (Typical 2.1%)', typicalRate: '2.1' },
  { id: 'aluminum', label: 'Aluminum Alloy (Typical 1.3%)', typicalRate: '1.3' },
  { id: 'brass', label: 'Brass / Bronze (Typical 1.5%)', typicalRate: '1.5' },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

export default function CastingShrinkageCalculatorClient() {
  const [dimensionStr, setDimensionStr] = useState<string>('200');
  const [materialId, setMaterialId] = useState<string>('cast_iron');
  const [shrinkageRateStr, setShrinkageRateStr] = useState<string>('1.0');

  const handleMaterialChange = (nextId: string) => {
    setMaterialId(nextId);
    const found = ALLOY_PRESETS.find((item) => item.id === nextId);
    if (found) {
      setShrinkageRateStr(found.typicalRate);
    }
  };

  const applyPreset = (dim: string, mat: string, rate: string) => {
    setDimensionStr(dim);
    setMaterialId(mat);
    setShrinkageRateStr(rate);
  };

  const handleReset = () => {
    applyPreset('200', 'cast_iron', '1.0');
  };

  /**
   * Governing Foundry Patternmaking Equations:
   * 1. Patternmaker's shrink rule definition (Kurt Foundry):
   *    Shrinkage (%) = (Pattern_dim - Casting_dim) / Casting_dim * 100
   *    => Linear Shrinkage Allowance S = L * (s / 100)
   *    => Pattern / Cavity Size L_pattern = L + S = L * (1 + s / 100)
   *    => Uniform 3D CAD Scale Factor k_scale = 1 + s / 100
   * 2. Inverse contraction definition (Matson Foundry):
   *    L_inverse = L / (1 - s / 100)
   */
  const calc = useMemo(() => {
    const L = parseStrictNumber(dimensionStr);
    const sPct = parseStrictNumber(shrinkageRateStr);

    if (!Number.isFinite(L) || !Number.isFinite(sPct) || L <= 0 || sPct <= 0 || sPct >= 50) {
      return { isValid: false as const };
    }

    const rate = sPct / 100;
    const allowance = L * rate;
    const patternSize = L * (1 + rate);
    const scaleFactor = 1 + rate;
    const inverseSize = L / (1 - rate);

    return {
      isValid: true as const,
      L,
      sPct,
      allowance,
      patternSize,
      scaleFactor,
      inverseSize,
    };
  }, [dimensionStr, shrinkageRateStr]);

  const handleExportCsv = () => {
    if (!calc.isValid) return;
    const selectedAlloy = ALLOY_PRESETS.find((a) => a.id === materialId)?.label ?? materialId;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Target Cooled Casting Dimension (L)', calc.L.toFixed(3), 'mm', 'Room-temperature casting target'],
      ['Reference Alloy Preset', selectedAlloy, '-', 'Typical linear solidification shrinkage'],
      ['Linear Shrinkage Rate (s)', calc.sPct.toFixed(2), '%', 'Editable foundry allowance'],
      ['Linear Shrinkage Allowance (S)', calc.allowance.toFixed(3), 'mm', 'S = L * (s / 100)'],
      ['Pattern / Cavity Size (Shrink Rule)', calc.patternSize.toFixed(3), 'mm', 'L_pattern = L * (1 + s / 100)'],
      ['3D CAD Uniform Scale Factor', calc.scaleFactor.toFixed(4), '-', 'k_scale = 1 + s / 100'],
      ['Pattern Size (Inverse Contraction)', calc.inverseSize.toFixed(3), 'mm', 'L_inverse = L / (1 - s / 100)'],
      ['Reference Note', 'Foundry patternmaking shrink-rule & contraction formulas (Kurt Foundry / Matson Foundry)', '-', 'Adjust per foundry sand system and core restraint'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'casting-shrinkage-allowance.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Pattern Inputs</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Linear Contraction Allowance
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-gray-iron"
                onClick={() => applyPreset('200', 'cast_iron', '1.0')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Gray Iron · 200mm
              </button>
              <button
                type="button"
                data-testid="preset-carbon-steel"
                onClick={() => applyPreset('500', 'steel', '2.0')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Steel · 500mm
              </button>
              <button
                type="button"
                data-testid="preset-aluminum"
                onClick={() => applyPreset('150', 'aluminum', '1.3')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Al Alloy · 150mm
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Target Casting Dimension L (mm, &gt; 0)
              </label>
              <input
                type="text"
                data-testid="input-dimension"
                value={dimensionStr}
                onChange={(e) => setDimensionStr(e.target.value)}
                placeholder="200"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Alloy Reference Preset (Typical Value)
              </label>
              <select
                data-testid="select-material"
                value={materialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              >
                {ALLOY_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Typical rule-of-thumb linear shrinkage; override below for actual mold &amp; core restraint.
              </p>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Linear Shrinkage Rate s (%, 0 &lt; s &lt; 50)
              </label>
              <input
                type="text"
                data-testid="input-shrinkage-rate"
                value={shrinkageRateStr}
                onChange={(e) => setShrinkageRateStr(e.target.value)}
                placeholder="1.0"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-export-csv"
            disabled={!calc.isValid}
            onClick={handleExportCsv}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Pattern Allowance CSV
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Calculated Pattern &amp; Cavity Sizing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Linear Shrinkage Allowance (S)
                </div>
                <div className="text-3xl font-black font-mono text-blue-800">
                  <span data-testid="out-shrinkage-allowance">
                    {calc.isValid ? calc.allowance.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-blue-500">mm</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Pattern / Cavity Size (Shrink Rule)
                </div>
                <div className="text-3xl font-black font-mono text-emerald-800">
                  <span data-testid="out-pattern-size">
                    {calc.isValid ? calc.patternSize.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-emerald-600">mm</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  3D CAD Uniform Scale Factor
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-scale-factor">
                    {calc.isValid ? calc.scaleFactor.toFixed(4) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-slate-400">×</span>
                </div>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                  Pattern Size (Inverse Contraction)
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  <span data-testid="out-inverse-size">
                    {calc.isValid ? calc.inverseSize.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-amber-600">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Foundry Patternmaking Equations &amp; Scope:</span>
              </div>
              <p className="font-mono text-slate-700">
                Shrink Rule Method: S = L × (s / 100), L_pattern = L × (1 + s / 100), k_scale = 1 + s / 100
              </p>
              <p className="font-mono text-slate-700">
                Inverse Contraction Method: L_inverse = L / (1 − s / 100)
              </p>
              <p className="text-slate-500">
                References: Kurt Foundry patternmaking allowance definition and Matson Foundry typical linear
                solidification shrinkage tables (Gray cast iron 1.0%, Ductile iron 0.8%, Carbon steel 2.0%, Stainless
                steel 2.1%, Aluminum 1.3%, Brass/bronze 1.5%). Actual solid contraction varies with sand binder rigidity
                (green sand vs. no-bake) and internal core restraint; verify with your foundry before cutting tooling.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
