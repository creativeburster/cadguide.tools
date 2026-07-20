'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

type OccupancyType =
  | 'assembly-standing' | 'assembly-seated' | 'business' | 'educational'
  | 'institutional' | 'kitchen' | 'mercantile' | 'residential' | 'storage' | 'industrial';

const OCCUPANCY_FACTORS: Record<OccupancyType, { name: string; factor: number; unit: string }> = {
  'assembly-standing': { name: 'Assembly (Standing)', factor: 0.21, unit: 'm²/person' },
  'assembly-seated': { name: 'Assembly (Seated)', factor: 0.65, unit: 'm²/person' },
  'business': { name: 'Business (Office)', factor: 9.3, unit: 'm²/person' },
  'educational': { name: 'Educational (Classroom)', factor: 1.9, unit: 'm²/person' },
  'institutional': { name: 'Institutional (Care)', factor: 9.3, unit: 'm²/person' },
  'kitchen': { name: 'Kitchen / Cooking', factor: 9.3, unit: 'm²/person' },
  'mercantile': { name: 'Mercantile (Retail)', factor: 5.6, unit: 'm²/person' },
  'residential': { name: 'Residential', factor: 18.6, unit: 'm²/person' },
  'storage': { name: 'Storage / Warehouse', factor: 27.9, unit: 'm²/person' },
  'industrial': { name: 'Industrial (Shop)', factor: 9.3, unit: 'm²/person' },
};

export default function EgressWidthCalculatorClient() {
  const [floorArea, setFloorArea] = useState('500');
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('business');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const result = useMemo(() => {
    const area = parseFloat(floorArea);
    const occ = OCCUPANCY_FACTORS[occupancyType];

    if (!area || area <= 0) return null;

    let factor = occ.factor;
    if (unit === 'imperial') {
      factor = factor * 10.764;
    }

    const occupantLoad = Math.ceil(area / factor);
    const stairWidth = occupantLoad * (unit === 'metric' ? 7.6 : 0.3);
    const levelWidth = occupantLoad * (unit === 'metric' ? 5.1 : 0.2);

    let minExits = 2;
    if (occupantLoad > 500) minExits = 3;
    if (occupantLoad > 1000) minExits = 4;

    return {
      occupantLoad,
      stairWidth,
      levelWidth,
      minExits,
      factor,
      factorUnit: unit === 'metric' ? 'm²/person' : 'ft²/person',
    };
  }, [floorArea, occupancyType, unit]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(0);
    if (Math.abs(n) >= 10) return n.toFixed(1);
    return n.toFixed(2);
  };

  const u = unit === 'metric' ? 'mm' : 'in';
  const u2 = unit === 'metric' ? 'm²' : 'ft²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'metric' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Metric</button>
            <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'imperial' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Imperial</button>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Floor Area ({u2})</label>
            <input type="text" value={floorArea} onChange={e => setFloorArea(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Occupancy Type</label>
            <select value={occupancyType} onChange={e => setOccupancyType(e.target.value as OccupancyType)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all">
              {Object.entries(OCCUPANCY_FACTORS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>

          <button onClick={() => { setFloorArea('500'); setOccupancyType('business'); }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            {result ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Occupant Load</div>
                    <div className="text-3xl font-black text-blue-700">{result.occupantLoad}</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Stair Width</div>
                    <div className="text-3xl font-black text-green-700">{formatNum(result.stairWidth)}<span className="text-lg text-green-400"> {u}</span></div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Level Egress</div>
                    <div className="text-3xl font-black text-purple-700">{formatNum(result.levelWidth)}<span className="text-lg text-purple-400"> {u}</span></div>
                  </div>
                </div>

                <div className="mt-6 bg-orange-50 rounded-2xl p-6 border border-orange-100 text-center">
                  <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Minimum Exits Required</div>
                  <div className="text-4xl font-black text-orange-700">{result.minExits}</div>
                </div>

                <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="text-sm text-slate-500 font-medium">
                    Load factor: {formatNum(result.factor)} {result.factorUnit} (IBC Table 1004.5)
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid floor area to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                IBC 2021: load = area / factor, stair = load × 0.3in/occ, level = load × 0.2in/occ
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
