'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

type PlateCase = 'square_ss' | 'circ_clamped' | 'circ_ss' | 'custom';

interface PlateBendingResult {
  valid: boolean;
  error?: string;
  flexuralRigidityNm: number;
  sigmaMpa: number;
  deflectionMm: number;
  spanThicknessRatio: number;
}

function solvePlateBending(
  plateCase: PlateCase,
  pressureKpaStr: string,
  spanMmStr: string,
  thicknessMmStr: string,
  eGpaStr: string,
  nuStr: string,
  betaStr: string,
  alphaStr: string
): PlateBendingResult {
  const fields = [pressureKpaStr, spanMmStr, thicknessMmStr, eGpaStr, nuStr, ...(plateCase === 'custom' ? [betaStr, alphaStr] : [])];
  if (fields.some((s) => s.trim() === '')) {
    return { valid: false, error: 'All plate geometry, load, and material parameters are required.', flexuralRigidityNm: 0, sigmaMpa: 0, deflectionMm: 0, spanThicknessRatio: 0 };
  }

  const qKpa = Number(pressureKpaStr);
  const aMm = Number(spanMmStr);
  const tMm = Number(thicknessMmStr);
  const eGpa = Number(eGpaStr);
  const nu = Number(nuStr);
  const beta = plateCase === 'custom' ? Number(betaStr) : 0;
  const alpha = plateCase === 'custom' ? Number(alphaStr) : 0;

  if (![qKpa, aMm, tMm, eGpa, nu, beta, alpha].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', flexuralRigidityNm: 0, sigmaMpa: 0, deflectionMm: 0, spanThicknessRatio: 0 };
  }
  if (qKpa <= 0 || aMm <= 0 || tMm <= 0 || eGpa <= 0) {
    return { valid: false, error: 'Pressure, span/diameter, thickness, and Youngs modulus must be > 0.', flexuralRigidityNm: 0, sigmaMpa: 0, deflectionMm: 0, spanThicknessRatio: 0 };
  }
  if (nu <= 0 || nu >= 0.5) {
    return { valid: false, error: 'Poisson ratio nu must satisfy 0 < nu < 0.5.', flexuralRigidityNm: 0, sigmaMpa: 0, deflectionMm: 0, spanThicknessRatio: 0 };
  }
  if (plateCase === 'custom' && (beta <= 0 || alpha <= 0)) {
    return { valid: false, error: 'Custom dimensionless coefficients beta and alpha must be > 0.', flexuralRigidityNm: 0, sigmaMpa: 0, deflectionMm: 0, spanThicknessRatio: 0 };
  }

  const q = qKpa * 1000; // Pa
  const a = aMm / 1000; // m
  const t = tMm / 1000; // m
  const E = eGpa * 1e9; // Pa
  const D = (E * Math.pow(t, 3)) / (12 * (1 - nu * nu)); // N*m

  let sigmaPa = 0;
  let wMeters = 0;

  if (plateCase === 'square_ss') {
    let wSum = 0;
    let mxSum = 0;
    const pi = Math.PI;
    for (let m = 1; m <= 29; m += 2) {
      for (let n = 1; n <= 29; n += 2) {
        const sgn = (((m - 1) / 2) % 2 === 0 ? 1 : -1) * (((n - 1) / 2) % 2 === 0 ? 1 : -1);
        const qMn = (16 * q) / (pi * pi * m * n);
        const k2 = Math.pow(m / a, 2) + Math.pow(n / a, 2);
        const wMn = (qMn / (Math.pow(pi, 4) * D * k2 * k2)) * sgn;
        wSum += wMn;
        mxSum += pi * pi * D * (Math.pow(m / a, 2) + nu * Math.pow(n / a, 2)) * wMn;
      }
    }
    wMeters = wSum;
    sigmaPa = (6 * mxSum) / (t * t);
  } else if (plateCase === 'circ_clamped') {
    const r = a / 2;
    wMeters = (q * Math.pow(r, 4)) / (64 * D);
    sigmaPa = (0.75 * q * r * r) / (t * t);
  } else if (plateCase === 'circ_ss') {
    const r = a / 2;
    wMeters = ((5 + nu) * q * Math.pow(r, 4)) / (64 * (1 + nu) * D);
    sigmaPa = ((3 * (3 + nu)) / 8) * (q * r * r) / (t * t);
  } else {
    sigmaPa = (beta * q * a * a) / (t * t);
    wMeters = (alpha * q * Math.pow(a, 4)) / D;
  }

  return {
    valid: true,
    flexuralRigidityNm: D,
    sigmaMpa: sigmaPa / 1e6,
    deflectionMm: wMeters * 1000,
    spanThicknessRatio: aMm / tMm,
  };
}

export default function PlateBendingCalculatorClient() {
  const [plateCase, setPlateCase] = useState<PlateCase>('square_ss');
  const [pressureStr, setPressureStr] = useState('5');
  const [spanStr, setSpanStr] = useState('500');
  const [thicknessStr, setThicknessStr] = useState('10');
  const [eGpaStr, setEGpaStr] = useState('200');
  const [nuStr, setNuStr] = useState('0.3');
  const [betaStr, setBetaStr] = useState('0.287');
  const [alphaStr, setAlphaStr] = useState('0.00406');

  const res = solvePlateBending(plateCase, pressureStr, spanStr, thicknessStr, eGpaStr, nuStr, betaStr, alphaStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Kirchhoff-Love Thin Plate Bending Report', ''],
      ['Plate Case', plateCase],
      ['Uniform Pressure q (kPa)', pressureStr],
      ['Plate Span or Diameter a (mm)', spanStr],
      ['Plate Thickness t (mm)', thicknessStr],
      ['Youngs Modulus E (GPa)', eGpaStr],
      ['Poisson Ratio nu', nuStr],
      ['Flexural Rigidity D (N*m)', res.flexuralRigidityNm.toFixed(2)],
      ['Max Bending Stress (MPa)', res.sigmaMpa.toFixed(4)],
      ['Max Center Deflection (mm)', res.deflectionMm.toFixed(6)],
      ['Span to Thickness Ratio (a/t)', res.spanThicknessRatio.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plate-bending-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Boundary Case</label>
            <select
              data-testid="select-plate-case"
              value={plateCase}
              onChange={(e) => setPlateCase(e.target.value as PlateCase)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold"
            >
              <option value="square_ss">Square Plate - All Edges Simply Supported</option>
              <option value="circ_clamped">Circular Plate (Dia a) - Clamped Edge</option>
              <option value="circ_ss">Circular Plate (Dia a) - Simply Supported</option>
              <option value="custom">Custom Coeffs (sigma=beta*q*a^2/t^2, w=alpha*q*a^4/D)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Pressure q (kPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-pressure"
                value={pressureStr}
                onChange={(e) => setPressureStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Width / Dia a (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-span"
                value={spanStr}
                onChange={(e) => setSpanStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Thickness t (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-thickness"
                value={thicknessStr}
                onChange={(e) => setThicknessStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Modulus E (GPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-e"
                value={eGpaStr}
                onChange={(e) => setEGpaStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">Poisson Ratio (nu)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-nu"
              value={nuStr}
              onChange={(e) => setNuStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold"
            />
          </div>

          {plateCase === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Beta (stress)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-beta"
                  value={betaStr}
                  onChange={(e) => setBetaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Alpha (q*a^4/D)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-alpha"
                  value={alphaStr}
                  onChange={(e) => setAlphaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setPlateCase('square_ss');
              setPressureStr('5');
              setSpanStr('500');
              setThicknessStr('10');
              setEGpaStr('200');
              setNuStr('0.3');
              setBetaStr('0.287');
              setAlphaStr('0.00406');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
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
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div
                data-testid="validation-error"
                className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700"
              >
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-sm font-black text-blue-500 uppercase tracking-wider mb-1">Max Bending Stress</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-sigma">
                      {res.sigmaMpa.toFixed(4)}<span className="text-lg text-blue-400"> MPa</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-sm font-black text-emerald-500 uppercase tracking-wider mb-1">Max Center Deflection</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-deflection">
                      {res.deflectionMm.toFixed(5)}<span className="text-lg text-emerald-500"> mm</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Flexural Rigidity D = E*t^3/(12*(1-nu^2))</p>
                    <p className="text-xl font-black text-slate-900" data-testid="res-rigidity">{res.flexuralRigidityNm.toFixed(2)} N*m</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-black text-slate-400 uppercase">Span-to-Thickness Ratio (a / t)</p>
                    <p className="text-xl font-black text-slate-900">{res.spanThicknessRatio.toFixed(1)}</p>
                  </div>
                </div>

                {res.spanThicknessRatio < 10 && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm font-bold text-amber-800">
                    Thin-plate Kirchhoff-Love assumption works best for a/t &gt;= 10. Below 10, transverse shear deformation increases actual deflection.
                  </div>
                )}
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Kirchhoff-Love thin plate theory uses flexural rigidity D = E*t^3 / (12*(1 - nu^2)) and small-deflection assumptions (w &lt;&lt; t).
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
