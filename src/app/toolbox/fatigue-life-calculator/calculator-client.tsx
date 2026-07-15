'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const MATERIALS = [
  { name: 'Steel (Sut=600 MPa)', Sut: 600, Se: 240, hasEndurance: true },
  { name: 'Steel (Sut=800 MPa)', Sut: 800, Se: 320, hasEndurance: true },
  { name: 'Steel (Sut=1000 MPa)', Sut: 1000, Se: 380, hasEndurance: true },
  { name: 'Aluminum 6061-T6', Sut: 310, Se: 96, hasEndurance: false },
  { name: 'Aluminum 7075-T6', Sut: 572, Se: 159, hasEndurance: false },
  { name: 'Titanium (Ti-6Al-4V)', Sut: 950, Se: 340, hasEndurance: true },
  { name: 'Custom', Sut: 600, Se: 240, hasEndurance: true },
];

export default function FatigueLifeClient() {
  const [matIdx, setMatIdx] = useState(0);
  const [customSut, setCustomSut] = useState(600);
  const [customSe, setCustomSe] = useState(240);
  const [stressAmp, setStressAmp] = useState(200);
  const [surfaceFactor, setSurfaceFactor] = useState(0.85);
  const [sizeFactor, setSizeFactor] = useState(0.9);

  const result = useMemo(() => {
    const mat = MATERIALS[matIdx];
    const Sut = matIdx === 6 ? customSut : mat.Sut;
    const Se_base = matIdx === 6 ? customSe : mat.Se;
    const Se = Se_base * surfaceFactor * sizeFactor;
    const Sa = stressAmp;

    const b = -0.085;
    const a = Math.pow(Sut, 2) / Se;
    const N = Math.pow(Sa / a, 1 / b);

    let status = '';
    let infinite = false;

    if (mat.hasEndurance && Sa <= Se) {
      status = 'Infinite life (below endurance limit)';
      infinite = true;
    } else if (Sa >= Sut) {
      status = 'Immediate failure (exceeds UTS)';
    } else if (N > 1e6 && mat.hasEndurance) {
      status = 'Near endurance limit — long life';
    } else {
      status = 'Finite life';
    }

    return { Sut, Se, Sa, N, a, b, status, infinite };
  }, [matIdx, customSut, customSe, stressAmp, surfaceFactor, sizeFactor]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
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

          {matIdx === 6 && (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Ultimate Strength Sut (MPa)</label>
                <input type="number" value={customSut} onChange={e => setCustomSut(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Endurance Limit Se (MPa)</label>
                <input type="number" value={customSe} onChange={e => setCustomSe(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Stress Amplitude Sa (MPa)</label>
            <input type="number" value={stressAmp} onChange={e => setStressAmp(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Surface Finish Factor</label>
            <select value={surfaceFactor} onChange={e => setSurfaceFactor(parseFloat(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              <option value={1.0}>1.0 — Mirror polished</option>
              <option value={0.9}>0.9 — Ground</option>
              <option value={0.85}>0.85 — Machined</option>
              <option value={0.7}>0.7 — Hot rolled</option>
              <option value={0.5}>0.5 — As forged</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Size Factor</label>
            <input type="number" step="0.05" value={sizeFactor} onChange={e => setSizeFactor(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.infinite ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {result.infinite ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className={`rounded-2xl p-6 border mb-4 ${result.infinite ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className={`text-xs font-black uppercase tracking-wider mb-2 ${result.infinite ? 'text-green-400' : 'text-red-400'}`}>Fatigue Life</div>
              <div className={`text-4xl font-black ${result.infinite ? 'text-green-700' : 'text-red-700'}`}>
                {result.infinite ? '∞' : result.N >= 1e6 ? `${(result.N / 1e6).toFixed(2)}M` : result.N >= 1e3 ? `${(result.N / 1e3).toFixed(1)}k` : result.N.toFixed(0)}
                {!result.infinite && <span className="text-lg"> cycles</span>}
              </div>
              <div className={`text-sm font-black mt-2 ${result.infinite ? 'text-green-600' : 'text-red-600'}`}>{result.status}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Endurance Limit</div>
                <div className="text-lg font-black text-slate-700">{result.Se.toFixed(0)} MPa</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Ultimate Strength</div>
                <div className="text-lg font-black text-slate-700">{result.Sut} MPa</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Stress Ratio</div>
                <div className="text-lg font-black text-slate-700">{(result.Sa / result.Se).toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Basquin equation: Sa = a × N^b, where a = Sut²/Se, b = -0.085. Steel has endurance limit (infinite life below Se). Aluminum has NO endurance limit — always finite life. Surface and size factors reduce Se.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
