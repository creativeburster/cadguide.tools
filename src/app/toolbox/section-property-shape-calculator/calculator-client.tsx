'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, ExternalLink } from 'lucide-react';

type ShapeKind = 'rect' | 'box' | 'circle' | 'tube';

interface SectionShapeResult {
  valid: boolean;
  error?: string;
  areaMm2: number;
  ixMm4: number;
  iyMm4: number;
  sxMm3: number;
  syMm3: number;
  rxMm: number;
  ryMm: number;
  iParallelMm4: number;
}

function solveSectionProperties(
  shape: ShapeKind,
  bStr: string,
  hStr: string,
  tStr: string,
  dOffStr: string
): SectionShapeResult {
  const err = (msg: string): SectionShapeResult => ({
    valid: false,
    error: msg,
    areaMm2: 0,
    ixMm4: 0,
    iyMm4: 0,
    sxMm3: 0,
    syMm3: 0,
    rxMm: 0,
    ryMm: 0,
    iParallelMm4: 0,
  });

  if (bStr.trim() === '' || dOffStr.trim() === '') {
    return err('Primary dimension and parallel-axis offset distance are required.');
  }
  const B = Number(bStr);
  const dOff = Number(dOffStr);
  if (!Number.isFinite(B) || !Number.isFinite(dOff) || B <= 0 || dOff < 0) {
    return err('Outer dimension must be > 0 and parallel-axis offset must be >= 0.');
  }

  let A = 0;
  let Ix = 0;
  let Iy = 0;
  let Sx = 0;
  let Sy = 0;

  if (shape === 'rect') {
    if (hStr.trim() === '') return err('Rectangle height H is required.');
    const H = Number(hStr);
    if (!Number.isFinite(H) || H <= 0) return err('Rectangle height H must be > 0.');
    A = B * H;
    Ix = (B * Math.pow(H, 3)) / 12;
    Iy = (H * Math.pow(B, 3)) / 12;
    Sx = Ix / (H / 2);
    Sy = Iy / (B / 2);
  } else if (shape === 'box') {
    if (hStr.trim() === '' || tStr.trim() === '') return err('Box height H and wall thickness t are required.');
    const H = Number(hStr);
    const t = Number(tStr);
    if (!Number.isFinite(H) || !Number.isFinite(t) || H <= 0 || t <= 0) {
      return err('Box height H and thickness t must be > 0.');
    }
    if (2 * t >= Math.min(B, H)) {
      return err('Hollow box wall thickness must satisfy 2*t < min(B, H).');
    }
    const bi = B - 2 * t;
    const hi = H - 2 * t;
    A = B * H - bi * hi;
    Ix = (B * Math.pow(H, 3) - bi * Math.pow(hi, 3)) / 12;
    Iy = (H * Math.pow(B, 3) - hi * Math.pow(bi, 3)) / 12;
    Sx = Ix / (H / 2);
    Sy = Iy / (B / 2);
  } else if (shape === 'circle') {
    const D = B;
    A = (Math.PI * Math.pow(D, 2)) / 4;
    Ix = (Math.PI * Math.pow(D, 4)) / 64;
    Iy = Ix;
    Sx = (Math.PI * Math.pow(D, 3)) / 32;
    Sy = Sx;
  } else {
    if (tStr.trim() === '') return err('Tube wall thickness t is required.');
    const D = B;
    const t = Number(tStr);
    if (!Number.isFinite(t) || t <= 0 || 2 * t >= D) {
      return err('Circular tube wall thickness must satisfy t > 0 and 2*t < outer diameter.');
    }
    const d = D - 2 * t;
    A = (Math.PI * (Math.pow(D, 2) - Math.pow(d, 2))) / 4;
    Ix = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / 64;
    Iy = Ix;
    Sx = Ix / (D / 2);
    Sy = Sx;
  }

  const rxMm = Math.sqrt(Ix / A);
  const ryMm = Math.sqrt(Iy / A);
  const iParallelMm4 = Ix + A * Math.pow(dOff, 2);

  return {
    valid: true,
    areaMm2: A,
    ixMm4: Ix,
    iyMm4: Iy,
    sxMm3: Sx,
    syMm3: Sy,
    rxMm,
    ryMm,
    iParallelMm4,
  };
}

export default function SectionPropertyShapeCalculatorClient() {
  const [shape, setShape] = useState<ShapeKind>('rect');
  const [bStr, setBStr] = useState('100');
  const [hStr, setHStr] = useState('200');
  const [tStr, setTStr] = useState('10');
  const [dOffStr, setDOffStr] = useState('50');

  const res = solveSectionProperties(shape, bStr, hStr, tStr, dOffStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Geometric Cross-Section Properties Report', ''],
      ['Shape', shape],
      [shape === 'circle' || shape === 'tube' ? 'Outer Diameter D (mm)' : 'Width B (mm)', bStr],
      ...(shape === 'rect' || shape === 'box' ? [['Height H (mm)', hStr]] : []),
      ...(shape === 'box' || shape === 'tube' ? [['Wall Thickness t (mm)', tStr]] : []),
      ['Parallel-Axis Offset d (mm)', dOffStr],
      ['Area A (mm^2)', res.areaMm2.toFixed(2)],
      ['Centroidal Ix (mm^4)', res.ixMm4.toFixed(1)],
      ['Centroidal Iy (mm^4)', res.iyMm4.toFixed(1)],
      ['Section Modulus Sx (mm^3)', res.sxMm3.toFixed(1)],
      ['Section Modulus Sy (mm^3)', res.syMm3.toFixed(1)],
      ['Radius of Gyration rx (mm)', res.rxMm.toFixed(3)],
      ['Radius of Gyration ry (mm)', res.ryMm.toFixed(3)],
      ['Parallel-Axis Moment I_par (mm^4)', res.iParallelMm4.toFixed(1)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `section-properties-${shape}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Geometry Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cross-Section Shape</label>
            <select
              data-testid="select-shape"
              value={shape}
              onChange={(e) => setShape(e.target.value as ShapeKind)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              <option value="rect">Solid Rectangle</option>
              <option value="box">Hollow Rectangular Box</option>
              <option value="circle">Solid Circle</option>
              <option value="tube">Circular Tube</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                {shape === 'circle' || shape === 'tube' ? 'Outer Dia D (mm)' : 'Width B (mm)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-b"
                value={bStr}
                onChange={(e) => setBStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>

            {(shape === 'rect' || shape === 'box') && (
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Height H (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-h"
                  value={hStr}
                  onChange={(e) => setHStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            )}

            {(shape === 'box' || shape === 'tube') && (
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wall Thick t (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-t"
                  value={tStr}
                  onChange={(e) => setTStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Axis Offset d (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-doff"
                value={dOffStr}
                onChange={(e) => setDOffStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShape('rect');
              setBStr('100');
              setHStr('200');
              setTStr('10');
              setDOffStr('50');
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Centroidal &amp; Parallel-Axis Results</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Centroidal Ix</div>
                  <div className="text-2xl font-black text-blue-800" data-testid="res-ix">{Math.round(res.ixMm4)} mm4</div>
                  <div className="text-xs font-bold text-blue-700 mt-1">Iy: {Math.round(res.iyMm4)} mm4</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Parallel-Axis I_par</div>
                  <div className="text-2xl font-black text-emerald-800" data-testid="res-ipar">{Math.round(res.iParallelMm4)} mm4</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">Ix + A * d^2</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Section Modulus Sx</div>
                  <div className="text-2xl font-black text-orange-800" data-testid="res-sx">{Math.round(res.sxMm3)} mm3</div>
                  <div className="text-xs font-bold text-orange-700 mt-1">Sy: {Math.round(res.syMm3)} mm3</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Section Area A</div>
                  <div className="text-2xl font-black text-purple-800" data-testid="res-area">{res.areaMm2.toFixed(1)} mm2</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2">
                  <div className="text-xs font-black text-slate-500 uppercase mb-1">Radii of Gyration (rx / ry)</div>
                  <div className="text-2xl font-black text-slate-800" data-testid="res-rx">
                    {res.rxMm.toFixed(3)} mm / {res.ryMm.toFixed(3)} mm
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Parallel Axis Theorem: I_par = Ix + A * d^2 shifts the centroidal second moment of area by a perpendicular offset d.
                </span>
              </div>
              <div className="pl-6 font-semibold">
                <a
                  href="https://en.wikipedia.org/wiki/List_of_second_moments_of_area"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Wikipedia: List of second moments of area <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
