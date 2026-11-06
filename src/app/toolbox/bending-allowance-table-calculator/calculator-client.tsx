'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download, Table } from 'lucide-react';

function parseNum(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

const MATERIAL_K_FACTORS: Record<string, { label: string; k: number }> = {
  steel: { label: 'Carbon Steel (Typical K=0.44)', k: 0.44 },
  stainless: { label: 'Stainless Steel (Typical K=0.40)', k: 0.40 },
  aluminum: { label: 'Aluminum (Typical K=0.33)', k: 0.33 },
};

const TABLE_ANGLES = [30, 45, 60, 90, 120, 135];
const TABLE_RADII = [1.0, 2.0, 3.0, 4.0, 5.0];

export default function BendingAllowanceTableCalculatorClient() {
  const [material, setMaterial] = useState('steel');
  const [kFactorStr, setKFactorStr] = useState('0.44');
  const [thicknessStr, setThicknessStr] = useState('2');
  const [angleStr, setAngleStr] = useState('90');
  const [radiusStr, setRadiusStr] = useState('3');

  const result = useMemo(() => {
    const T = parseNum(thicknessStr);
    const angleDeg = parseNum(angleStr);
    const R = parseNum(radiusStr);
    const K = parseNum(kFactorStr);

    if (
      T === null || angleDeg === null || R === null || K === null ||
      T <= 0 || angleDeg <= 0 || angleDeg >= 180 || R < 0 || K <= 0 || K >= 1
    ) {
      return { K: null, BA: null, BD: null, OSSB: null };
    }

    const aRad = (angleDeg * Math.PI) / 180;
    const BA = aRad * (R + K * T);
    const OSSB = (R + T) * Math.tan(aRad / 2);
    const BD = 2 * OSSB - BA;

    return { K, BA, BD, OSSB };
  }, [thicknessStr, angleStr, radiusStr, kFactorStr]);

  // Generate lookup table matrix
  const tableMatrix = useMemo(() => {
    const T = parseNum(thicknessStr);
    const K = parseNum(kFactorStr);
    if (T === null || T <= 0 || K === null || K <= 0 || K >= 1) return null;

    return TABLE_ANGLES.map((ang) => {
      const aRad = (ang * Math.PI) / 180;
      const rowRadii = TABLE_RADII.map((r) => {
        const ba = aRad * (r + K * T);
        return ba;
      });
      return { angle: ang, values: rowRadii };
    });
  }, [thicknessStr, kFactorStr]);

  const handleMaterialChange = (mat: string) => {
    setMaterial(mat);
    const defaultK = MATERIAL_K_FACTORS[mat]?.k ?? 0.44;
    setKFactorStr(defaultK.toString());
  };

  const handleReset = () => {
    setMaterial('steel');
    setKFactorStr('0.44');
    setThicknessStr('2');
    setAngleStr('90');
    setRadiusStr('3');
  };

  const applyPreset = (mat: string, t: string, a: string, r: string, k?: string) => {
    setMaterial(mat);
    const presetK = k ?? (MATERIAL_K_FACTORS[mat]?.k ?? 0.44).toString();
    setKFactorStr(presetK);
    setThicknessStr(t);
    setAngleStr(a);
    setRadiusStr(r);
  };

  const handleExportCsv = () => {
    const T = parseNum(thicknessStr);
    const K = parseNum(kFactorStr);
    const rows = [
      '# Sheet Metal Bend Allowance Reference Table (SolidWorks / DB Sheetmetals Standard)',
      '# Verified by CADGuide.tools Toolbox',
      'Parameter,Value,Unit',
      `Material,${MATERIAL_K_FACTORS[material]?.label || material},—`,
      `Neutral Axis K-Factor,${K !== null ? K.toFixed(2) : '—'},—`,
      `Material Thickness (T),${thicknessStr},mm`,
      `Target Bend Angle,${angleStr},deg`,
      `Target Inside Radius,${radiusStr},mm`,
      `Bend Allowance (BA),${result.BA !== null ? result.BA.toFixed(3) : '—'},mm`,
      `Bend Deduction (BD),${result.BD !== null ? result.BD.toFixed(3) : '—'},mm`,
      `Outside Setback (OSSB),${result.OSSB !== null ? result.OSSB.toFixed(3) : '—'},mm`,
      '',
      '# Full Bend Allowance Matrix (BA in mm for T = ' + (T !== null ? T.toFixed(2) : '—') + ' mm, K = ' + (K !== null ? K.toFixed(2) : '—') + ')',
      ['Angle (deg)', ...TABLE_RADII.map((r) => `R=${r.toFixed(1)}mm`)].join(','),
    ];

    if (tableMatrix) {
      tableMatrix.forEach((row) => {
        rows.push([`${row.angle}°`, ...row.values.map((v) => v.toFixed(3))].join(','));
      });
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bending_allowance_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      {/* Material & Sheet Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Fabrication Presets:</span>
        <button
          type="button"
          data-testid="preset-carbon-steel-2mm"
          onClick={() => applyPreset('steel', '2', '90', '3')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Carbon Steel (2 mm, R=3 mm)
        </button>
        <button
          type="button"
          data-testid="preset-stainless-15mm"
          onClick={() => applyPreset('stainless', '1.5', '90', '2')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Stainless 304 (1.5 mm, R=2 mm)
        </button>
        <button
          type="button"
          data-testid="preset-aluminum-3mm"
          onClick={() => applyPreset('aluminum', '3', '60', '3')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Aluminum 5052 (3 mm, 60°)
        </button>
      </div>

      <div data-testid="calculator-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div data-testid="calculator-inputs" className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Material Type</label>
            <select
              data-testid="select-material"
              value={material}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
            >
              <option value="steel">Carbon Steel (Typical K=0.44)</option>
              <option value="stainless">Stainless Steel (Typical K=0.40)</option>
              <option value="aluminum">Aluminum (Typical K=0.33)</option>
            </select>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-1">K-Factor (Neutral Axis)</label>
            <input
              type="text"
              data-testid="input-k-factor"
              value={kFactorStr}
              onChange={(e) => setKFactorStr(e.target.value)}
              placeholder="0.44"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
            <span className="text-xs text-slate-400 mt-1 block">Typical values: Steel 0.44, Stainless 0.40, Al 0.33. User editable; verify with tooling/material test certs.</span>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Thickness T (mm)</label>
            <input
              type="text"
              data-testid="input-thickness"
              value={thicknessStr}
              onChange={(e) => setThicknessStr(e.target.value)}
              placeholder="2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bend Angle (deg)</label>
            <input
              type="text"
              data-testid="input-angle"
              value={angleStr}
              onChange={(e) => setAngleStr(e.target.value)}
              placeholder="90"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Inside Radius R (mm)</label>
            <input
              type="text"
              data-testid="input-radius"
              value={radiusStr}
              onChange={(e) => setRadiusStr(e.target.value)}
              placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Table & Calculations (CSV)
            </button>
          </div>
        </div>

        {/* Results & Lookup Table Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div data-testid="calculator-results" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculation Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">K-Factor</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-k">
                    {result.K !== null ? result.K.toFixed(2) : '—'}
                  </span>
                </div>
                <div className="text-xs text-blue-500 font-semibold mt-1">Neutral axis position</div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-100">
                <div className="text-base font-black text-emerald-400 uppercase tracking-wider mb-2">Bend Allowance</div>
                <div className="text-3xl font-black text-emerald-700">
                  <span data-testid="result-ba">
                    {result.BA !== null ? result.BA.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-emerald-400 font-bold ml-1">mm</span>
                </div>
                <div className="text-xs text-emerald-500 font-semibold mt-1">BA = (π·A/180)·(R + K·T)</div>
              </div>

              <div className="bg-orange-50/70 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Bend Deduction</div>
                <div className="text-3xl font-black text-orange-700">
                  <span data-testid="result-bd">
                    {result.BD !== null ? result.BD.toFixed(3) : '—'}
                  </span>
                  <span className="text-lg text-orange-400 font-bold ml-1">mm</span>
                </div>
                <div className="text-xs text-orange-500 font-semibold mt-1">BD = 2·OSSB − BA</div>
              </div>
            </div>

            {/* Matrix Reference Table */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Table className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  Bend Allowance Table (BA mm for T = {parseNum(thicknessStr) !== null ? parseNum(thicknessStr)!.toFixed(2) : '—'} mm)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider">
                      <th className="py-3 px-4">Angle \ Radius</th>
                      {TABLE_RADII.map((r) => (
                        <th key={r} className="py-3 px-4 text-center">
                          R = {r.toFixed(1)} mm
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableMatrix ? (
                      tableMatrix.map((row) => (
                        <tr key={row.angle} className="border-b border-slate-50 hover:bg-purple-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800 bg-slate-50/40">
                            {row.angle}°
                          </td>
                          {row.values.map((v, i) => {
                            const isMatch =
                              parseNum(angleStr) === row.angle &&
                              parseNum(radiusStr) === TABLE_RADII[i];
                            return (
                              <td
                                key={i}
                                className={`py-3 px-4 text-center font-mono font-bold ${
                                  isMatch
                                    ? 'bg-purple-100 text-purple-800 rounded'
                                    : 'text-slate-600'
                                }`}
                              >
                                {v.toFixed(3)}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          Enter valid thickness to generate table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                <Info className="w-4 h-4 text-purple-500 shrink-0" />
                Sheet Metal Neutral Axis Bending Standards
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                OSSB = (R + T)·tan(Angle/2). Use this standardized bend allowance matrix to calibrate CNC press brake backgauge offsets and parametric sheet metal unfolding rules.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
