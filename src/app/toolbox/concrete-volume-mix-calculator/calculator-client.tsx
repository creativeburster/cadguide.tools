'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info } from 'lucide-react';

const MIX_RATIOS = [
  { name: 'M5 (1:5:10)', cement: 1, sand: 5, aggregate: 10 },
  { name: 'M7.5 (1:4:8)', cement: 1, sand: 4, aggregate: 8 },
  { name: 'M10 (1:3:6)', cement: 1, sand: 3, aggregate: 6 },
  { name: 'M15 (1:2:4)', cement: 1, sand: 2, aggregate: 4 },
  { name: 'M20 (1:1.5:3)', cement: 1, sand: 1.5, aggregate: 3 },
  { name: 'M25 (1:1:2)', cement: 1, sand: 1, aggregate: 2 },
];

export default function ConcreteMixClient() {
  const [shape, setShape] = useState<'slab' | 'column' | 'footing'>('slab');
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(0.15);
  const [diameter, setDiameter] = useState(0.3);
  const [mixIdx, setMixIdx] = useState(3);
  const [waste, setWaste] = useState(5);

  const result = useMemo(() => {
    let volume = 0;
    if (shape === 'slab' || shape === 'footing') {
      volume = length * width * height;
    } else {
      volume = Math.PI * (diameter / 2) ** 2 * height;
    }

    const volumeWithWaste = volume * (1 + waste / 100);
    const mix = MIX_RATIOS[mixIdx];
    const totalParts = mix.cement + mix.sand + mix.aggregate;

    const dryVolume = volumeWithWaste * 1.54;
    const cementVol = (dryVolume * mix.cement) / totalParts;
    const sandVol = (dryVolume * mix.sand) / totalParts;
    const aggVol = (dryVolume * mix.aggregate) / totalParts;

    const cementBags = cementVol / 0.0347;
    const cementKg = cementBags * 50;
    const sandKg = sandVol * 1600;
    const aggKg = aggVol * 1450;
    const waterL = cementKg * 0.5;

    return { volume, volumeWithWaste, cementBags, cementKg, sandVol, sandKg, aggVol, aggKg, waterL };
  }, [shape, length, width, height, diameter, mixIdx, waste]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {(['slab', 'column', 'footing'] as const).map(s => (
                <button key={s} onClick={() => setShape(s)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${shape === s ? 'bg-stone-700 border-stone-700 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {shape === 'column' ? (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Diameter (m)</label>
              <input type="number" step="0.01" value={diameter} onChange={e => setDiameter(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
            </div>
          ) : (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Length (m)</label>
                <input type="number" step="0.1" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Width (m)</label>
                <input type="number" step="0.1" value={width} onChange={e => setWidth(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{shape === 'column' ? 'Height' : 'Thickness/Depth'} (m)</label>
            <input type="number" step="0.01" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Mix Ratio</label>
            <select value={mixIdx} onChange={e => setMixIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
              {MIX_RATIOS.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Waste Factor (%)</label>
            <input type="number" value={waste} onChange={e => setWaste(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Results</h2>

            <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200 mb-4">
              <div className="text-base font-black text-stone-500 uppercase tracking-wider mb-2">Concrete Volume</div>
              <div className="text-4xl font-black text-stone-800">{result.volumeWithWaste.toFixed(3)}<span className="text-xl text-stone-500"> m³</span></div>
              <div className="text-base text-stone-600 font-medium mt-1">{(result.volumeWithWaste * 35.31).toFixed(1)} ft³ · {(result.volumeWithWaste * 1.31).toFixed(2)} yd³</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Cement</div>
                <div className="text-xl font-black text-slate-700">{result.cementBags.toFixed(1)} bags</div>
                <div className="text-base text-slate-500 font-medium">{result.cementKg.toFixed(0)} kg (50kg bags)</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Sand</div>
                <div className="text-xl font-black text-slate-700">{result.sandVol.toFixed(3)} m³</div>
                <div className="text-base text-slate-500 font-medium">{result.sandKg.toFixed(0)} kg</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Aggregate</div>
                <div className="text-xl font-black text-slate-700">{result.aggVol.toFixed(3)} m³</div>
                <div className="text-base text-slate-500 font-medium">{result.aggKg.toFixed(0)} kg</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Water</div>
                <div className="text-xl font-black text-slate-700">{result.waterL.toFixed(0)} L</div>
                <div className="text-base text-slate-500 font-medium">w/c ratio ≈ 0.5</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Dry volume = wet volume × 1.54 (voids). Cement = 50kg per bag, 0.0347 m³. Sand density ≈ 1600 kg/m³. Aggregate density ≈ 1450 kg/m³. Water/cement ratio ≈ 0.5 for medium workability.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
