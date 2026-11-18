'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Check, Copy, Download, ExternalLink, Info, RotateCcw, Settings, Zap } from 'lucide-react';

type SectionShape = 'rectangle' | 'circle' | 'hollow_circle' | 'i_beam';

interface InertiaPreset {
  id: string;
  label: string;
  shape: SectionShape;
  b: string;
  h: string;
  dOuter: string;
  dInner: string;
  bf: string;
  tf: string;
  tw: string;
}

const PRESETS: InertiaPreset[] = [
  {
    id: 'rect-100x200',
    label: 'Rectangle 100x200',
    shape: 'rectangle',
    b: '100',
    h: '200',
    dOuter: '80',
    dInner: '60',
    bf: '100',
    tf: '10',
    tw: '6',
  },
  {
    id: 'solid-shaft',
    label: 'Solid Circle D=80',
    shape: 'circle',
    b: '100',
    h: '200',
    dOuter: '80',
    dInner: '60',
    bf: '100',
    tf: '10',
    tw: '6',
  },
  {
    id: 'hollow-tube',
    label: 'Tube D100 / d80',
    shape: 'hollow_circle',
    b: '100',
    h: '200',
    dOuter: '100',
    dInner: '80',
    bf: '100',
    tf: '10',
    tw: '6',
  },
  {
    id: 'i-beam-200',
    label: 'I-Beam 200x100',
    shape: 'i_beam',
    b: '100',
    h: '200',
    dOuter: '100',
    dInner: '80',
    bf: '100',
    tf: '10',
    tw: '6',
  },
];

const parsePos = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const fmt = (n: number | null, dec = 4) => (n === null || !Number.isFinite(n) ? '—' : n.toFixed(dec));

export default function MomentInertiaShapeCalculatorClient() {
  const [shape, setShape] = useState<SectionShape>('rectangle');
  const [bStr, setBStr] = useState('100');
  const [hStr, setHStr] = useState('200');
  const [dOuterStr, setDOuterStr] = useState('80');
  const [dInnerStr, setDInnerStr] = useState('60');
  const [bfStr, setBfStr] = useState('100');
  const [tfStr, setTfStr] = useState('10');
  const [twStr, setTwStr] = useState('6');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: InertiaPreset) => {
    setShape(p.shape);
    setBStr(p.b);
    setHStr(p.h);
    setDOuterStr(p.dOuter);
    setDInnerStr(p.dInner);
    setBfStr(p.bf);
    setTfStr(p.tf);
    setTwStr(p.tw);
  };

  const calc = useMemo(() => {
    if (shape === 'rectangle') {
      const bMm = parsePos(bStr);
      const hMm = parsePos(hStr);
      if (bMm === null || hMm === null) {
        return { valid: false as const, error: 'Enter positive b and h values (> 0 mm).' };
      }
      const b = bMm / 10;
      const h = hMm / 10;
      const area = b * h;
      const ix = (b * Math.pow(h, 3)) / 12;
      const iy = (h * Math.pow(b, 3)) / 12;
      const j = ix + iy;
      const zx = ix / (h / 2);
      const rx = Math.sqrt(ix / area);
      return { valid: true as const, error: '', area, ix, iy, j, zx, rx };
    }

    if (shape === 'circle') {
      const dMm = parsePos(dOuterStr);
      if (dMm === null) {
        return { valid: false as const, error: 'Enter a positive diameter D (> 0 mm).' };
      }
      const d = dMm / 10;
      const r = d / 2;
      const area = Math.PI * r * r;
      const ix = (Math.PI * Math.pow(d, 4)) / 64;
      const iy = ix;
      const j = ix + iy;
      const zx = ix / r;
      const rx = d / 4;
      return { valid: true as const, error: '', area, ix, iy, j, zx, rx };
    }

    if (shape === 'hollow_circle') {
      const doMm = parsePos(dOuterStr);
      const diMm = parsePos(dInnerStr);
      if (doMm === null || diMm === null) {
        return { valid: false as const, error: 'Enter positive outer and inner diameters (> 0 mm).' };
      }
      if (diMm >= doMm) {
        return { valid: false as const, error: 'Inner diameter di must be strictly smaller than outer diameter D.' };
      }
      const dO = doMm / 10;
      const dI = diMm / 10;
      const area = (Math.PI * (dO * dO - dI * dI)) / 4;
      const ix = (Math.PI * (Math.pow(dO, 4) - Math.pow(dI, 4))) / 64;
      const iy = ix;
      const j = ix + iy;
      const zx = ix / (dO / 2);
      const rx = Math.sqrt(ix / area);
      return { valid: true as const, error: '', area, ix, iy, j, zx, rx };
    }

    const hMm = parsePos(hStr);
    const bfMm = parsePos(bfStr);
    const tfMm = parsePos(tfStr);
    const twMm = parsePos(twStr);
    if (hMm === null || bfMm === null || tfMm === null || twMm === null) {
      return { valid: false as const, error: 'Enter positive H, bf, tf, and tw dimensions (> 0 mm).' };
    }
    if (twMm >= bfMm) {
      return { valid: false as const, error: 'Web thickness tw must be strictly less than flange width bf.' };
    }
    if (2 * tfMm >= hMm) {
      return { valid: false as const, error: 'Combined flange thickness (2 * tf) must be strictly less than total height H.' };
    }
    const h = hMm / 10;
    const bf = bfMm / 10;
    const tf = tfMm / 10;
    const tw = twMm / 10;
    const hw = h - 2 * tf;
    const area = 2 * bf * tf + hw * tw;
    const ix = (bf * Math.pow(h, 3) - (bf - tw) * Math.pow(hw, 3)) / 12;
    const iy = (2 * tf * Math.pow(bf, 3) + hw * Math.pow(tw, 3)) / 12;
    const j = ix + iy;
    const zx = ix / (h / 2);
    const rx = Math.sqrt(ix / area);
    return { valid: true as const, error: '', area, ix, iy, j, zx, rx };
  }, [shape, bStr, hStr, dOuterStr, dInnerStr, bfStr, tfStr, twStr]);

  const handleCopy = async () => {
    if (!calc.valid) return;
    const summary = `Shape=${shape} | A=${calc.area.toFixed(4)} cm2 | Ix=${calc.ix.toFixed(4)} cm4 | Iy=${calc.iy.toFixed(4)} cm4 | J=${calc.j.toFixed(4)} cm4 | Zx=${calc.zx.toFixed(4)} cm3 | rx=${calc.rx.toFixed(4)} cm`;
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['metric', 'value', 'unit'],
      ['shape', shape, 'enum'],
      ['area_a', calc.area.toFixed(4), 'cm2'],
      ['ix', calc.ix.toFixed(4), 'cm4'],
      ['iy', calc.iy.toFixed(4), 'cm4'],
      ['polar_j', calc.j.toFixed(4), 'cm4'],
      ['section_modulus_zx', calc.zx.toFixed(4), 'cm3'],
      ['radius_gyration_rx', calc.rx.toFixed(4), 'cm'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `section-inertia-${shape}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Section Geometry</h2>
              <p className="text-xs text-slate-500 font-medium">All dimensions in mm (&gt; 0)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="shape-select" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Cross-Section Profile
            </label>
            <select
              id="shape-select"
              data-testid="select-shape"
              value={shape}
              onChange={(e) => setShape(e.target.value as SectionShape)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="rectangle">Solid Rectangle (b x h)</option>
              <option value="circle">Solid Circle (Diameter D)</option>
              <option value="hollow_circle">Hollow Circular Tube (D / di)</option>
              <option value="i_beam">Symmetric I-Beam (H, bf, tw, tf)</option>
            </select>
          </div>

          {shape === 'rectangle' && (
            <div className="space-y-3.5">
              <div>
                <label htmlFor="in-b" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Width b (mm)
                </label>
                <input
                  id="in-b"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-b"
                  value={bStr}
                  onChange={(e) => setBStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="in-h" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Height h (mm)
                </label>
                <input
                  id="in-h"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-h"
                  value={hStr}
                  onChange={(e) => setHStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {(shape === 'circle' || shape === 'hollow_circle') && (
            <div className="space-y-3.5">
              <div>
                <label htmlFor="in-do" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Outer Diameter D (mm)
                </label>
                <input
                  id="in-do"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-douter"
                  value={dOuterStr}
                  onChange={(e) => setDOuterStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {shape === 'hollow_circle' && (
                <div>
                  <label htmlFor="in-di" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                    Inner Diameter di (mm)
                  </label>
                  <input
                    id="in-di"
                    type="text"
                    inputMode="decimal"
                    data-testid="input-dinner"
                    value={dInnerStr}
                    onChange={(e) => setDInnerStr(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {shape === 'i_beam' && (
            <div className="space-y-3.5">
              <div>
                <label htmlFor="in-ih" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Total Height H (mm)
                </label>
                <input
                  id="in-ih"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-h"
                  value={hStr}
                  onChange={(e) => setHStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="in-bf" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Flange Width bf (mm)
                </label>
                <input
                  id="in-bf"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-bf"
                  value={bfStr}
                  onChange={(e) => setBfStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="in-tw" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Web Thickness tw (mm)
                </label>
                <input
                  id="in-tw"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tw"
                  value={twStr}
                  onChange={(e) => setTwStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="in-tf" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Flange Thickness tf (mm)
                </label>
                <input
                  id="in-tf"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tf"
                  value={tfStr}
                  onChange={(e) => setTfStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Centroidal Section Properties</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? 'VALID PROFILE' : 'INVALID GEOMETRY'}
              </span>
            </div>

            {!calc.valid && (
              <div data-testid="validation-error" className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Second Moment Ix</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-ix">{fmt(calc.valid ? calc.ix : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">cm⁴</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Second Moment Iy</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-iy">{fmt(calc.valid ? calc.iy : null, 4)}</span>
                  <span className="text-base text-emerald-500 ml-1.5">cm⁴</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Polar Moment J</div>
                <div className="text-xl font-black text-orange-800">
                  <span data-testid="result-j">{fmt(calc.valid ? calc.j : null, 4)}</span>
                  <span className="text-xs text-orange-600 ml-1">cm⁴</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Section Area A</div>
                <div className="text-xl font-black text-purple-800">
                  <span data-testid="result-area">{fmt(calc.valid ? calc.area : null, 4)}</span>
                  <span className="text-xs text-purple-600 ml-1">cm²</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Elastic Modulus Zx</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-zx">{fmt(calc.valid ? calc.zx : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">cm³</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Gyration Radius rx</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-rx">{fmt(calc.valid ? calc.rx : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">cm</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Centroidal equations: Rectangle Ix = b·h³/12; Solid circle Ix = Iy = π·D⁴/64; Annulus Ix = Iy = π·(D⁴ − di⁴)/64; Symmetric I-section Ix = [bf·H³ − (bf − tw)·(H − 2·tf)³]/12.
                </span>
              </div>
              <div className="flex flex-wrap gap-4 pl-6">
                <a
                  href="https://en.wikipedia.org/wiki/List_of_second_moments_of_area"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  <span>Reference: List of second moments of area</span>
                  <ExternalLink className="w-3 h-3" />
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
