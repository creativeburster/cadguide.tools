'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

type UnitType = 'modular' | 'king' | 'cmu' | 'custom';

const PRESETS: Record<UnitType, { name: string; length: number; height: number }> = {
  modular: { name: 'Modular Brick', length: 190, height: 57 },
  king: { name: 'King Brick', length: 240, height: 70 },
  cmu: { name: 'CMU Block', length: 390, height: 190 },
  custom: { name: 'Custom', length: 200, height: 100 },
};

export default function BrickBlockQuantityCalculatorClient() {
  const [wallLength, setWallLength] = useState('5000');
  const [wallHeight, setWallHeight] = useState('2700');
  const [wallThickness, setWallThickness] = useState('1');
  const [jointThickness, setJointThickness] = useState('10');
  const [unitType, setUnitType] = useState<UnitType>('modular');
  const [brickLength, setBrickLength] = useState('190');
  const [brickHeight, setBrickHeight] = useState('57');
  const [openingArea, setOpeningArea] = useState('0');
  const [wasteFactor, setWasteFactor] = useState('5');

  const result = useMemo(() => {
    const wl = parseFloat(wallLength);
    const wh = parseFloat(wallHeight);
    const wt = parseFloat(wallThickness);
    const jt = parseFloat(jointThickness);
    const bl = parseFloat(brickLength);
    const bh = parseFloat(brickHeight);
    const oa = parseFloat(openingArea) || 0;
    const wf = parseFloat(wasteFactor) || 0;

    if (!wl || !wh || !bl || !bh || wl <= 0 || wh <= 0 || bl <= 0 || bh <= 0) return null;

    const wallArea = (wl * wh) / 1_000_000 - oa / 1_000_000;
    const brickWithJoint = bl + jt;
    const heightWithJoint = bh + jt;
    const bricksPerM2 = (1000 / brickWithJoint) * (1000 / heightWithJoint);
    const totalBricks = Math.ceil(wallArea * bricksPerM2 * wt * (1 + wf / 100));

    const brickVolume = (bl * bh * (brickLength as unknown as number) * 0.001) / 1_000_000;
    const wallVolumeM3 = wallArea * wt * 0.1;
    const mortarVolumeM3 = Math.max(0, wallVolumeM3 - totalBricks * (bl * bh * 75 * 1e-9));
    const cementBags = Math.ceil(mortarVolumeM3 * 5);

    return {
      wallArea,
      bricksPerM2,
      totalBricks,
      mortarVolumeM3,
      cementBags,
    };
  }, [wallLength, wallHeight, wallThickness, jointThickness, brickLength, brickHeight, openingArea, wasteFactor]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(0);
    if (Math.abs(n) >= 10) return n.toFixed(1);
    return n.toFixed(3);
  };

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

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Unit Type</label>
            <select value={unitType} onChange={e => {
              const t = e.target.value as UnitType;
              setUnitType(t);
              const p = PRESETS[t];
              setBrickLength(String(p.length));
              setBrickHeight(String(p.height));
            }}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all">
              {Object.entries(PRESETS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Length (mm)</label>
            <input type="text" value={wallLength} onChange={e => setWallLength(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Height (mm)</label>
            <input type="text" value={wallHeight} onChange={e => setWallHeight(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Thickness (wythes)</label>
            <input type="text" value={wallThickness} onChange={e => setWallThickness(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Mortar Joint (mm)</label>
            <input type="text" value={jointThickness} onChange={e => setJointThickness(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Brick L (mm)</label>
              <input type="text" value={brickLength} onChange={e => setBrickLength(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Brick H (mm)</label>
              <input type="text" value={brickHeight} onChange={e => setBrickHeight(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Opening Area (mm²)</label>
            <input type="text" value={openingArea} onChange={e => setOpeningArea(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Waste Factor (%)</label>
            <input type="text" value={wasteFactor} onChange={e => setWasteFactor(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => { setWallLength('5000'); setWallHeight('2700'); setWallThickness('1'); setJointThickness('10'); setUnitType('modular'); setBrickLength('190'); setBrickHeight('57'); setOpeningArea('0'); setWasteFactor('5'); }}
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Wall Area</div>
                  <div className="text-3xl font-black text-blue-700">{formatNum(result.wallArea)}<span className="text-lg text-blue-400"> m²</span></div>
                </div>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Bricks/m²</div>
                  <div className="text-3xl font-black text-green-700">{formatNum(result.bricksPerM2)}</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Total Bricks</div>
                  <div className="text-3xl font-black text-orange-700">{result.totalBricks.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Mortar Volume</div>
                  <div className="text-3xl font-black text-purple-700">{formatNum(result.mortarVolumeM3)}<span className="text-lg text-purple-400"> m³</span></div>
                </div>
                <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                  <div className="text-base font-black text-rose-400 uppercase tracking-wider mb-2">Cement Bags</div>
                  <div className="text-3xl font-black text-rose-700">{result.cementBags}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid dimensions to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                bricks/m² = (1000/(L+joint)) × (1000/(H+joint)), total = area × bricks/m² × wythes × (1+waste%)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
