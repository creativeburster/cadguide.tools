'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Shield, AlertTriangle } from 'lucide-react';

const MATERIALS = [
  { name: 'Structural Steel (E=200 GPa, σy=250)', E: 200, yield: 250 },
  { name: 'Aluminum 6061-T6 (E=69 GPa, σy=276)', E: 69, yield: 276 },
  { name: 'Stainless 304 (E=193 GPa, σy=215)', E: 193, yield: 215 },
  { name: 'Timber (E=11 GPa, σy=40)', E: 11, yield: 40 },
  { name: 'Custom', E: 200, yield: 250 },
];

const END_CONDITIONS = [
  { id: 'pinned', name: 'Pinned-Pinned', K: 1.0 },
  { id: 'fixed', name: 'Fixed-Fixed', K: 0.5 },
  { id: 'cantilever', name: 'Fixed-Free (Cantilever)', K: 2.0 },
  { id: 'guided', name: 'Fixed-Pinned', K: 0.7 },
];

export default function ColumnBucklingClient() {
  const [matIdx, setMatIdx] = useState(0);
  const [customE, setCustomE] = useState(200);
  const [customYield, setCustomYield] = useState(250);
  const [endIdx, setEndIdx] = useState(0);
  const [length, setLength] = useState(2000);
  const [section, setSection] = useState<'rect' | 'circular'>('rect');
  const [b, setB] = useState(40);
  const [h, setH] = useState(60);
  const [d, setD] = useState(50);

  const result = useMemo(() => {
    const E = (matIdx === 4 ? customE : MATERIALS[matIdx].E) * 1e3;
    const Sy = matIdx === 4 ? customYield : MATERIALS[matIdx].yield;
    const K = END_CONDITIONS[endIdx].K;
    const L = length;

    let I = 0;
    let A = 0;
    let r = 0;

    if (section === 'rect') {
      I = Math.min(b * Math.pow(h, 3), h * Math.pow(b, 3)) / 12;
      A = b * h;
      r = Math.sqrt(I / A);
    } else {
      I = Math.PI * Math.pow(d, 4) / 64;
      A = Math.PI * d * d / 4;
      r = d / 4;
    }

    const slenderness = K * L / r;
    const Cc = Math.PI * Math.sqrt(2 * E / Sy);

    let Pcr = 0;
    let method = '';

    if (slenderness >= Cc) {
      Pcr = Math.PI * Math.PI * E * I / Math.pow(K * L, 2);
      method = 'Euler (elastic buckling)';
    } else {
      Pcr = A * (Sy - Math.pow(Sy * slenderness / (2 * Cc), 2) / (Math.PI * Math.PI * E / E));
      const sigmaCr = Sy * (1 - (slenderness * slenderness) / (4 * Cc * Cc));
      Pcr = A * sigmaCr;
      method = 'Johnson (inelastic buckling)';
    }

    return { I, A, r, slenderness, Cc, Pcr, method, E, Sy, K };
  }, [matIdx, customE, customYield, endIdx, length, section, b, h, d]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select value={matIdx} onChange={e => setMatIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {MATERIALS.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
            </select>
          </div>

          {matIdx === 4 && (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">E (GPa)</label>
                <input type="number" value={customE} onChange={e => setCustomE(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Yield (MPa)</label>
                <input type="number" value={customYield} onChange={e => setCustomYield(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">End Condition</label>
            <select value={endIdx} onChange={e => setEndIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {END_CONDITIONS.map((c, i) => <option key={i} value={i}>{c.name} (K={c.K})</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Column Length (mm)</label>
            <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Section</label>
            <div className="grid grid-cols-2 gap-2">
              {(['rect', 'circular'] as const).map(s => (
                <button key={s} onClick={() => setSection(s)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${section === s ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {s === 'rect' ? 'Rectangular' : 'Circular'}
                </button>
              ))}
            </div>
          </div>

          {section === 'rect' ? (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Width b (mm)</label>
                <input type="number" value={b} onChange={e => setB(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Height h (mm)</label>
                <input type="number" value={h} onChange={e => setH(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Diameter (mm)</label>
              <input type="number" value={d} onChange={e => setD(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 mb-4">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">Critical Buckling Load</div>
              <div className="text-4xl font-black text-emerald-700">{(result.Pcr / 1000).toFixed(2)}<span className="text-xl text-emerald-400"> kN</span></div>
              <div className="text-xs text-emerald-600 font-medium mt-1">{result.method}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Slenderness λ</div>
                <div className="text-lg font-black text-slate-700">{result.slenderness.toFixed(1)}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Transition Cc</div>
                <div className="text-lg font-black text-slate-700">{result.Cc.toFixed(1)}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Radius Gyration</div>
                <div className="text-lg font-black text-slate-700">{result.r.toFixed(2)} mm</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase mb-1">Moment of Inertia I</div>
                  <div className="text-lg font-black text-slate-700">{(result.I).toFixed(0)} mm⁴</div>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase mb-1">Cross-section Area</div>
                  <div className="text-lg font-black text-slate-700">{result.A.toFixed(0)} mm²</div>
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-2xl p-4 border ${result.slenderness >= result.Cc ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
              <div className="flex items-start gap-2 text-xs font-medium">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className={result.slenderness >= result.Cc ? 'text-blue-700' : 'text-orange-700'}>
                  {result.slenderness >= result.Cc
                    ? `Slenderness ${result.slenderness.toFixed(0)} ≥ Cc ${result.Cc.toFixed(0)}: Euler elastic buckling governs. Pcr = π²EI/(KL)².`
                    : `Slenderness ${result.slenderness.toFixed(0)} < Cc ${result.Cc.toFixed(0)}: Johnson parabolic formula governs. Inelastic buckling occurs before Euler.`}
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
