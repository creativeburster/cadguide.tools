'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info } from 'lucide-react';

type SectionType = 'rect' | 'circular' | 'ibeam' | 'box' | 'tube';

const SECTIONS: { id: SectionType; name: string }[] = [
  { id: 'rect', name: 'Solid Rectangular' },
  { id: 'circular', name: 'Solid Circular' },
  { id: 'tube', name: 'Hollow Circular (Tube)' },
  { id: 'box', name: 'Hollow Rectangular (Box)' },
  { id: 'ibeam', name: 'I-Beam / H-Beam' },
];

export default function SectionModulusClient() {
  const [section, setSection] = useState<SectionType>('rect');
  const [b, setB] = useState(100);
  const [h, setH] = useState(200);
  const [d, setD] = useState(100);
  const [tw, setTw] = useState(6);
  const [tf, setTf] = useState(10);

  const result = useMemo(() => {
    let Ix = 0, Iy = 0, A = 0;
    const B = Math.max(1, b);
    const H = Math.max(1, h);
    const D = Math.max(1, d);
    const Tw = Math.max(1, tw);
    const Tf = Math.max(1, tf);

    if (section === 'rect') {
      Ix = B * Math.pow(H, 3) / 12;
      Iy = H * Math.pow(B, 3) / 12;
      A = B * H;
    } else if (section === 'circular') {
      Ix = Math.PI * Math.pow(D, 4) / 64;
      Iy = Ix;
      A = Math.PI * D * D / 4;
    } else if (section === 'tube') {
      const innerD = Math.max(1, D - 2 * Tw);
      Ix = Math.PI * (Math.pow(D, 4) - Math.pow(innerD, 4)) / 64;
      Iy = Ix;
      A = Math.PI * (D * D - innerD * innerD) / 4;
    } else if (section === 'box') {
      const innerB = Math.max(1, B - 2 * Tw);
      const innerH = Math.max(1, H - 2 * Tw);
      Ix = (B * Math.pow(H, 3) - innerB * Math.pow(innerH, 3)) / 12;
      Iy = (H * Math.pow(B, 3) - innerH * Math.pow(innerB, 3)) / 12;
      A = B * H - innerB * innerH;
    } else if (section === 'ibeam') {
      const innerH = Math.max(1, H - 2 * Tf);
      Ix = (B * Math.pow(H, 3) - (B - Tw) * Math.pow(innerH, 3)) / 12;
      Iy = (2 * Tf * Math.pow(B, 3) + innerH * Math.pow(Tw, 3)) / 12;
      A = 2 * B * Tf + innerH * Tw;
    }

    const Wx = Ix / (H / 2);
    const Wy = Iy / (B / 2);
    const rx = Math.sqrt(Ix / A);
    const ry = Math.sqrt(Iy / A);

    return { Ix, Iy, Wx, Wy, A, rx, ry };
  }, [section, b, h, d, tw, tf]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Section</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Section Type</label>
            <select value={section} onChange={e => setSection(e.target.value as SectionType)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
              {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {(section === 'rect' || section === 'box' || section === 'ibeam') && (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Width B (mm)</label>
                <input type="number" value={b} onChange={e => setB(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Height H (mm)</label>
                <input type="number" value={h} onChange={e => setH(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
            </>
          )}

          {(section === 'circular' || section === 'tube') && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Outer Diameter D (mm)</label>
              <input type="number" value={d} onChange={e => setD(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
            </div>
          )}

          {(section === 'tube' || section === 'box') && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Thickness tw (mm)</label>
              <input type="number" value={tw} onChange={e => setTw(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
            </div>
          )}

          {section === 'ibeam' && (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Web Thickness tw (mm)</label>
                <input type="number" value={tw} onChange={e => setTw(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Flange Thickness tf (mm)</label>
                <input type="number" value={tf} onChange={e => setTf(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Section Properties</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100">
                <div className="text-base font-black text-cyan-400 uppercase tracking-wider mb-2">Moment of Inertia Ix</div>
                <div className="text-2xl font-black text-cyan-700">{(result.Ix / 1e4).toFixed(2)}<span className="text-xl text-cyan-400"> ×10⁴ mm⁴</span></div>
                <div className="text-base text-cyan-600 font-medium mt-1">{(result.Ix / 1e6).toFixed(4)} cm⁴</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Section Modulus Wx</div>
                <div className="text-2xl font-black text-blue-700">{(result.Wx / 1e3).toFixed(2)}<span className="text-xl text-blue-400"> ×10³ mm³</span></div>
                <div className="text-base text-blue-600 font-medium mt-1">{(result.Wx / 1e3).toFixed(2)} cm³</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Iy</div>
                <div className="text-xl font-black text-slate-700">{(result.Iy / 1e4).toFixed(2)}×10⁴</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Wy</div>
                <div className="text-xl font-black text-slate-700">{(result.Wy / 1e3).toFixed(2)}×10³</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Area</div>
                <div className="text-xl font-black text-slate-700">{result.A.toFixed(0)} mm²</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">rx (gyr.)</div>
                <div className="text-xl font-black text-slate-700">{result.rx.toFixed(2)} mm</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Rect: I = BH³/12, W = BH²/6. Circle: I = πD⁴/64, W = πD³/32. Tube: I = π(D⁴-d⁴)/64. I-beam: I = [BH³ - (B-tw)(H-2tf)³]/12. Section modulus W = I/(H/2). Bending stress σ = M/W.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
