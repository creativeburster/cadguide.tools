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

export default function BendAllowanceClient() {
  const [thicknessStr, setThicknessStr] = useState('2.0');
  const [bendRadiusStr, setBendRadiusStr] = useState('3.0');
  const [bendAngleStr, setBendAngleStr] = useState('90');
  const [kFactorStr, setKFactorStr] = useState('0.33');
  const [flange1Str, setFlange1Str] = useState('50');
  const [flange2Str, setFlange2Str] = useState('50');

  const result = useMemo(() => {
    const T = parseNum(thicknessStr);
    const R = parseNum(bendRadiusStr);
    const angleDeg = parseNum(bendAngleStr);
    const K = parseNum(kFactorStr);
    const L1 = parseNum(flange1Str);
    const L2 = parseNum(flange2Str);

    if (
      T === null || R === null || angleDeg === null || K === null || L1 === null || L2 === null ||
      T <= 0 || R < 0 || angleDeg <= 0 || angleDeg >= 180 || K <= 0 || K >= 1 || L1 < 0 || L2 < 0
    ) {
      return { bendAllowance: null, outsideSetback: null, bendDeduction: null, flatLength: null };
    }

    const aRad = (angleDeg * Math.PI) / 180;
    const bendAllowance = aRad * (R + K * T);
    // General OSSB equation: (R + T) * tan(Angle / 2)
    const outsideSetback = (R + T) * Math.tan(aRad / 2);
    const bendDeduction = 2 * outsideSetback - bendAllowance;
    const flatLength = L1 + L2 - bendDeduction;

    return { bendAllowance, outsideSetback, bendDeduction, flatLength };
  }, [thicknessStr, bendRadiusStr, bendAngleStr, kFactorStr, flange1Str, flange2Str]);

  const handleReset = () => {
    setThicknessStr('2.0');
    setBendRadiusStr('3.0');
    setBendAngleStr('90');
    setKFactorStr('0.33');
    setFlange1Str('50');
    setFlange2Str('50');
  };

  const applyPreset = (t: string, r: string, a: string, k: string, f1: string, f2: string) => {
    setThicknessStr(t);
    setBendRadiusStr(r);
    setBendAngleStr(a);
    setKFactorStr(k);
    setFlange1Str(f1);
    setFlange2Str(f2);
  };

  const handleExportCsv = () => {
    const csvContent = [
      '# Sheet Metal Bend Allowance & Deduction (DIN 6935 / SolidWorks Standard)',
      '# Verified by CADGuide.tools Toolbox',
      'Parameter,Value,Unit',
      `Material Thickness (T),${thicknessStr},mm`,
      `Inside Bend Radius (R),${bendRadiusStr},mm`,
      `Bend Angle (A),${bendAngleStr},deg`,
      `Neutral Axis K-Factor,${kFactorStr},—`,
      `Flange 1 Length,${flange1Str},mm`,
      `Flange 2 Length,${flange2Str},mm`,
      `Bend Allowance (BA),${result.bendAllowance !== null ? result.bendAllowance.toFixed(3) : '—'},mm`,
      `Outside Setback (OSSB),${result.outsideSetback !== null ? result.outsideSetback.toFixed(3) : '—'},mm`,
      `Bend Deduction (BD),${result.bendDeduction !== null ? result.bendDeduction.toFixed(3) : '—'},mm`,
      `Flat Pattern Blank Length,${result.flatLength !== null ? result.flatLength.toFixed(3) : '—'},mm`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bend_allowance_calculation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Material Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Sheet Presets:</span>
        <button
          type="button"
          data-testid="preset-soft-aluminum"
          onClick={() => applyPreset('2.0', '3.0', '90', '0.33', '50', '50')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Soft Aluminum (K=0.33, 90°)
        </button>
        <button
          type="button"
          data-testid="preset-mild-steel"
          onClick={() => applyPreset('1.5', '2.0', '90', '0.40', '40', '40')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Mild Steel (K=0.40, 90°)
        </button>
        <button
          type="button"
          data-testid="preset-stainless"
          onClick={() => applyPreset('2.0', '4.0', '60', '0.45', '60', '60')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Stainless Steel (K=0.45, 60°)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material Thickness T (mm)</label>
            <input
              type="text"
              data-testid="input-thickness"
              value={thicknessStr}
              onChange={(e) => setThicknessStr(e.target.value)}
              placeholder="2.0"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Inside Radius R (mm)</label>
            <input
              type="text"
              data-testid="input-radius"
              value={bendRadiusStr}
              onChange={(e) => setBendRadiusStr(e.target.value)}
              placeholder="3.0"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Bend Angle A (deg)</label>
            <input
              type="text"
              data-testid="input-angle"
              value={bendAngleStr}
              onChange={(e) => setBendAngleStr(e.target.value)}
              placeholder="90"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">K-Factor (t/T)</label>
              <span className="text-[10px] text-slate-400 font-bold">Neutral Axis</span>
            </div>
            <input
              type="text"
              data-testid="input-k-factor"
              value={kFactorStr}
              onChange={(e) => setKFactorStr(e.target.value)}
              placeholder="0.33"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['0.30', '0.33', '0.38', '0.40', '0.44', '0.50'].map((k) => (
                <button
                  key={k}
                  type="button"
                  data-testid={`preset-k-${k.replace('.', '')}`}
                  onClick={() => setKFactorStr(k)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    kFactorStr === k
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                      : 'bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600 border-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flange 1 (mm)</label>
              <input
                type="text"
                data-testid="input-flange1"
                value={flange1Str}
                onChange={(e) => setFlange1Str(e.target.value)}
                placeholder="50"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flange 2 (mm)</label>
              <input
                type="text"
                data-testid="input-flange2"
                value={flange2Str}
                onChange={(e) => setFlange2Str(e.target.value)}
                placeholder="50"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Sheet Metal Calculations</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50/70 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Bend Allowance (BA)</div>
                <div className="text-3xl font-black text-orange-700">
                  <span data-testid="result-ba">
                    {result.bendAllowance !== null ? result.bendAllowance.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-orange-400 font-bold ml-1">mm</span>
                </div>
                <div className="text-xs text-orange-600 font-semibold mt-1">BA = (π·A/180)·(R + K·T)</div>
              </div>

              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Bend Deduction (BD)</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-bd">
                    {result.bendDeduction !== null ? result.bendDeduction.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-blue-400 font-bold ml-1">mm</span>
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-1">BD = 2·OSSB − BA</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Outside Setback (OSSB)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-ossb">
                    {result.outsideSetback !== null ? result.outsideSetback.toFixed(3) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">mm</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">OSSB = (R + T)·tan(A/2)</div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase mb-1">Flat Pattern Blank Length</div>
                <div className="text-xl font-black text-emerald-800">
                  <span data-testid="result-flat-length">
                    {result.flatLength !== null ? result.flatLength.toFixed(3) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600 ml-1">mm</span>
                </div>
                <div className="text-xs text-emerald-600 mt-0.5">Lflat = Flange1 + Flange2 − BD</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                <Info className="w-4 h-4 text-orange-500 shrink-0" />
                SolidWorks & DIN 6935 Sheet Metal K-Factor Standard
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                The K-Factor (t/T) locates the neutral sheet that undergoes zero tension or compression during forming. Typical values range from 0.33 for soft aluminum air-bending to 0.40–0.44 for mild steel and 0.45 for bottoming.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
