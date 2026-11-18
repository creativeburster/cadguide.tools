'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, ExternalLink } from 'lucide-react';

type SectionShape = 'rect' | 'ibeam' | 'box' | 'circular' | 'tube';

interface SectionModulusResult {
  valid: boolean;
  error?: string;
  areaMm2: number;
  ixE4Mm4: number;
  sxE3Mm3: number;
  zxE3Mm3: number;
  rxMm: number;
  stressMpa: number;
  shapeFactor: number;
}

function solveSectionModulus(
  shape: SectionShape,
  bStr: string,
  hStr: string,
  twStr: string,
  tfStr: string,
  tStr: string,
  momentStr: string
): SectionModulusResult {
  const emptyRes = (error: string): SectionModulusResult => ({
    valid: false,
    error,
    areaMm2: 0,
    ixE4Mm4: 0,
    sxE3Mm3: 0,
    zxE3Mm3: 0,
    rxMm: 0,
    stressMpa: 0,
    shapeFactor: 0,
  });

  if (momentStr.trim() === '' || bStr.trim() === '') {
    return emptyRes('Section primary dimension and bending moment inputs are required.');
  }
  const B = Number(bStr);
  const M = Number(momentStr);
  if (!Number.isFinite(B) || !Number.isFinite(M) || B <= 0 || M < 0) {
    return emptyRes('Width/diameter must be > 0 and bending moment must be >= 0.');
  }

  let A = 0;
  let Ix = 0;
  let Sx = 0;
  let Zx = 0;

  if (shape === 'rect') {
    if (hStr.trim() === '') return emptyRes('Rectangle height H is required.');
    const H = Number(hStr);
    if (!Number.isFinite(H) || H <= 0) return emptyRes('Rectangle height H must be > 0.');
    A = B * H;
    Ix = (B * Math.pow(H, 3)) / 12;
    Sx = (B * Math.pow(H, 2)) / 6;
    Zx = (B * Math.pow(H, 2)) / 4;
  } else if (shape === 'ibeam') {
    if ([hStr, twStr, tfStr].some((s) => s.trim() === '')) {
      return emptyRes('All I-beam dimensions (B, H, tw, tf) are required.');
    }
    const H = Number(hStr);
    const tw = Number(twStr);
    const tf = Number(tfStr);
    if (![H, tw, tf].every(Number.isFinite) || H <= 0 || tw <= 0 || tf <= 0) {
      return emptyRes('I-beam dimensions must be positive numbers.');
    }
    if (2 * tf >= H || tw >= B) {
      return emptyRes('Invalid I-beam geometry: require 2*tf < H and tw < B.');
    }
    const hw = H - 2 * tf;
    A = 2 * B * tf + hw * tw;
    Ix = (B * Math.pow(H, 3) - (B - tw) * Math.pow(hw, 3)) / 12;
    Sx = Ix / (H / 2);
    Zx = B * tf * (H - tf) + (tw * Math.pow(hw, 2)) / 4;
  } else if (shape === 'box') {
    if ([hStr, tStr].some((s) => s.trim() === '')) {
      return emptyRes('All hollow box dimensions (B, H, t) are required.');
    }
    const H = Number(hStr);
    const t = Number(tStr);
    if (![H, t].every(Number.isFinite) || H <= 0 || t <= 0) {
      return emptyRes('Box dimensions must be positive numbers.');
    }
    if (2 * t >= Math.min(B, H)) {
      return emptyRes('Invalid box wall thickness: require 2*t < min(B, H).');
    }
    const bi = B - 2 * t;
    const hi = H - 2 * t;
    A = B * H - bi * hi;
    Ix = (B * Math.pow(H, 3) - bi * Math.pow(hi, 3)) / 12;
    Sx = Ix / (H / 2);
    Zx = (B * Math.pow(H, 2) - bi * Math.pow(hi, 2)) / 4;
  } else if (shape === 'circular') {
    const D = B;
    A = (Math.PI * Math.pow(D, 2)) / 4;
    Ix = (Math.PI * Math.pow(D, 4)) / 64;
    Sx = (Math.PI * Math.pow(D, 3)) / 32;
    Zx = Math.pow(D, 3) / 6;
  } else {
    if (tStr.trim() === '') return emptyRes('Tube wall thickness t is required.');
    const D = B;
    const t = Number(tStr);
    if (!Number.isFinite(t) || t <= 0 || 2 * t >= D) {
      return emptyRes('Invalid tube geometry: require t > 0 and 2*t < outer diameter.');
    }
    const d = D - 2 * t;
    A = (Math.PI * (Math.pow(D, 2) - Math.pow(d, 2))) / 4;
    Ix = (Math.PI * (Math.pow(D, 4) - Math.pow(d, 4))) / 64;
    Sx = Ix / (D / 2);
    Zx = (Math.pow(D, 3) - Math.pow(d, 3)) / 6;
  }

  const rxMm = Math.sqrt(Ix / A);
  const stressMpa = Sx > 0 ? (M * 1e6) / Sx : 0;
  const shapeFactor = Sx > 0 ? Zx / Sx : 0;

  return {
    valid: true,
    areaMm2: A,
    ixE4Mm4: Ix / 1e4,
    sxE3Mm3: Sx / 1e3,
    zxE3Mm3: Zx / 1e3,
    rxMm,
    stressMpa,
    shapeFactor,
  };
}

export default function SectionModulusCalculatorClient() {
  const [shape, setShape] = useState<SectionShape>('rect');
  const [bStr, setBStr] = useState('100');
  const [hStr, setHStr] = useState('200');
  const [twStr, setTwStr] = useState('8');
  const [tfStr, setTfStr] = useState('12');
  const [tStr, setTStr] = useState('10');
  const [momentStr, setMomentStr] = useState('20');

  const res = solveSectionModulus(shape, bStr, hStr, twStr, tfStr, tStr, momentStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Cross-Section Modulus & Flexural Stress Report', ''],
      ['Section Profile', shape],
      [shape === 'circular' || shape === 'tube' ? 'Outer Diameter D (mm)' : 'Width B (mm)', bStr],
      ...(shape === 'rect' || shape === 'ibeam' || shape === 'box' ? [['Depth H (mm)', hStr]] : []),
      ...(shape === 'ibeam' ? [['Web Thickness tw (mm)', twStr], ['Flange Thickness tf (mm)', tfStr]] : []),
      ...(shape === 'box' || shape === 'tube' ? [['Wall Thickness t (mm)', tStr]] : []),
      ['Applied Bending Moment M (kN*m)', momentStr],
      ['Cross-Sectional Area A (mm^2)', res.areaMm2.toFixed(2)],
      ['Moment of Inertia Ix (x10^4 mm^4)', res.ixE4Mm4.toFixed(3)],
      ['Elastic Section Modulus Sx (x10^3 mm^3)', res.sxE3Mm3.toFixed(3)],
      ['Plastic Section Modulus Zx (x10^3 mm^3)', res.zxE3Mm3.toFixed(3)],
      ['Plastic Shape Factor (Zx/Sx)', res.shapeFactor.toFixed(4)],
      ['Radius of Gyration rx (mm)', res.rxMm.toFixed(3)],
      ['Maximum Elastic Bending Stress (MPa)', res.stressMpa.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `section-modulus-${shape}.csv`;
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Section Profile</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cross-Section Type</label>
            <select
              data-testid="select-shape"
              value={shape}
              onChange={(e) => setShape(e.target.value as SectionShape)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              <option value="rect">Solid Rectangle</option>
              <option value="ibeam">Symmetric I-Beam / H-Section</option>
              <option value="box">Hollow Rectangular Box</option>
              <option value="circular">Solid Circular Bar</option>
              <option value="tube">Circular Hollow Tube</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                {shape === 'circular' || shape === 'tube' ? 'Outer Dia D (mm)' : 'Width B (mm)'}
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

            {(shape === 'rect' || shape === 'ibeam' || shape === 'box') && (
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Depth H (mm)</label>
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
          </div>

          {shape === 'ibeam' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Web tw (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tw"
                  value={twStr}
                  onChange={(e) => setTwStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Flange tf (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tf"
                  value={tfStr}
                  onChange={(e) => setTfStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bending Moment M (kN*m)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-moment"
              value={momentStr}
              onChange={(e) => setMomentStr(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setShape('rect');
              setBStr('100');
              setHStr('200');
              setTwStr('8');
              setTfStr('12');
              setTStr('10');
              setMomentStr('20');
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Section Properties &amp; Flexural Stress</h2>
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
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Elastic Modulus Sx</div>
                  <div className="text-2xl font-black text-blue-800" data-testid="res-sx">{res.sxE3Mm3.toFixed(2)}</div>
                  <div className="text-xs font-bold text-blue-700 mt-1">x10^3 mm3</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Plastic Modulus Zx</div>
                  <div className="text-2xl font-black text-emerald-800" data-testid="res-zx">{res.zxE3Mm3.toFixed(2)}</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">x10^3 mm3 (SF: {res.shapeFactor.toFixed(3)})</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Moment of Inertia Ix</div>
                  <div className="text-2xl font-black text-orange-800" data-testid="res-ix">{res.ixE4Mm4.toFixed(2)}</div>
                  <div className="text-xs font-bold text-orange-700 mt-1">x10^4 mm4</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Cross-Section Area</div>
                  <div className="text-2xl font-black text-purple-800" data-testid="res-area">{res.areaMm2.toFixed(1)} mm2</div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase mb-1">Radius of Gyration rx</div>
                  <div className="text-2xl font-black text-slate-800" data-testid="res-rx">{res.rxMm.toFixed(3)} mm</div>
                </div>
                <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                  <div className="text-xs font-black text-rose-500 uppercase mb-1">Max Bending Stress</div>
                  <div className="text-2xl font-black text-rose-800" data-testid="res-stress">{res.stressMpa.toFixed(3)} MPa</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Elastic Sx = Ix / (H/2); Flexural Stress sigma = M / Sx; Radius of Gyration rx = sqrt(Ix / A). Plastic Zx sums first area moments on both sides of the equal-area axis.
                </span>
              </div>
              <div className="flex flex-wrap gap-4 pl-6 font-semibold">
                <a
                  href="https://en.wikipedia.org/wiki/Section_modulus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Wikipedia: Section modulus <ExternalLink className="w-3 h-3" />
                </a>
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
