'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info } from 'lucide-react';

const BAR_SIZES = [
  { name: 'Ø8 mm', dia: 8 },
  { name: 'Ø10 mm', dia: 10 },
  { name: 'Ø12 mm', dia: 12 },
  { name: 'Ø16 mm', dia: 16 },
  { name: 'Ø20 mm', dia: 20 },
  { name: 'Ø25 mm', dia: 25 },
  { name: 'Ø32 mm', dia: 32 },
  { name: 'Ø40 mm', dia: 40 },
];

export default function RebarWeightClient() {
  const [barIdx, setBarIdx] = useState(2);
  const [length, setLength] = useState(12);
  const [spacing, setSpacing] = useState(200);
  const [slabWidth, setSlabWidth] = useState(4);
  const [slabLength, setSlabLength] = useState(6);

  const result = useMemo(() => {
    const dia = BAR_SIZES[barIdx].dia;
    const unitWeight = (dia * dia) / 162;
    const totalBarLength = length;
    const barWeight = unitWeight * totalBarLength;

    const barsPerWidth = Math.ceil((slabWidth * 1000) / spacing) + 1;
    const barsPerLength = Math.ceil((slabLength * 1000) / spacing) + 1;
    const totalBars = barsPerWidth + barsPerLength;
    const totalLength = barsPerWidth * slabLength + barsPerLength * slabWidth;
    const totalWeight = totalLength * unitWeight;

    return { unitWeight, barWeight, barsPerWidth, barsPerLength, totalBars, totalLength, totalWeight };
  }, [barIdx, length, spacing, slabWidth, slabLength]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bar Size</label>
            <select value={barIdx} onChange={e => setBarIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
              {BAR_SIZES.map((b, i) => <option key={i} value={i}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Single Bar Length (m)</label>
            <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bar Spacing (mm)</label>
            <input type="number" value={spacing} onChange={e => setSpacing(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Slab Width (m)</label>
            <input type="number" value={slabWidth} onChange={e => setSlabWidth(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Slab Length (m)</label>
            <input type="number" value={slabLength} onChange={e => setSlabLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Results</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                <div className="text-base font-black text-slate-500 uppercase tracking-wider mb-2">Unit Weight</div>
                <div className="text-3xl font-black text-slate-800">{result.unitWeight.toFixed(3)}<span className="text-lg text-slate-500"> kg/m</span></div>
                <div className="text-base text-slate-600 font-medium mt-1">W = d²/162</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Single Bar Weight</div>
                <div className="text-3xl font-black text-blue-700">{result.barWeight.toFixed(2)}<span className="text-lg text-blue-400"> kg</span></div>
                <div className="text-base text-blue-600 font-medium mt-1">{length}m bar</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h3 className="text-base font-black text-slate-400 uppercase tracking-wider mb-3">Slab Reinforcement (both directions)</h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Bars (Width)</div>
                  <div className="text-lg font-black text-slate-700">{result.barsPerWidth}</div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Bars (Length)</div>
                  <div className="text-lg font-black text-slate-700">{result.barsPerLength}</div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Total Length</div>
                  <div className="text-lg font-black text-slate-700">{result.totalLength.toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Total Weight</div>
                  <div className="text-lg font-black text-green-700">{result.totalWeight.toFixed(1)} kg</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Unit weight formula: W = d²/162 (kg/m, d in mm). Based on steel density 7850 kg/m³. Number of bars = (slab dimension / spacing) + 1. Add 10-15% for laps and waste.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
