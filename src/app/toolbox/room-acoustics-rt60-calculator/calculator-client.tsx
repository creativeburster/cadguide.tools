'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function RoomAcousticsRT60CalculatorClient() {
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('8');
  const [height, setHeight] = useState('3');
  const [floorAbs, setFloorAbs] = useState('0.05');
  const [ceilingAbs, setCeilingAbs] = useState('0.10');
  const [wallAbs, setWallAbs] = useState('0.05');
  const [doorAbs, setDoorAbs] = useState('0.08');
  const [windowAbs, setWindowAbs] = useState('0.35');
  const [doorArea, setDoorArea] = useState('2');
  const [windowArea, setWindowArea] = useState('6');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const fa = parseFloat(floorAbs);
    const ca = parseFloat(ceilingAbs);
    const wa = parseFloat(wallAbs);
    const da = parseFloat(doorAbs);
    const wina = parseFloat(windowAbs);
    const dArea = parseFloat(doorArea) || 0;
    const winArea = parseFloat(windowArea) || 0;

    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) return null;

    const volume = l * w * h;
    const floorArea = l * w;
    const ceilingArea = l * w;
    const totalWallArea = 2 * (l + w) * h;
    const plainWallArea = Math.max(0, totalWallArea - dArea - winArea);

    const totalAbsorption =
      floorArea * fa +
      ceilingArea * ca +
      plainWallArea * wa +
      dArea * da +
      winArea * wina;

    const k = unit === 'metric' ? 0.161 : 0.049;
    const rt60 = totalAbsorption > 0 ? (k * volume) / totalAbsorption : Infinity;

    let rating = '';
    let ratingColor = '';
    if (rt60 < 0.3) { rating = 'Very Dead (studio)'; ratingColor = 'text-purple-700'; }
    else if (rt60 < 0.6) { rating = 'Dead (recording)'; ratingColor = 'text-blue-700'; }
    else if (rt60 < 1.0) { rating = 'Good (speech)'; ratingColor = 'text-green-700'; }
    else if (rt60 < 1.5) { rating = 'Fair (lecture hall)'; ratingColor = 'text-amber-700'; }
    else if (rt60 < 2.0) { rating = 'Live (concert hall)'; ratingColor = 'text-orange-700'; }
    else { rating = 'Very Live (cathedral)'; ratingColor = 'text-red-700'; }

    return { volume, totalAbsorption, rt60, rating, ratingColor };
  }, [length, width, height, floorAbs, ceilingAbs, wallAbs, doorAbs, windowAbs, doorArea, windowArea, unit]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 10) return n.toFixed(2);
    return n.toFixed(3);
  };

  const u = unit === 'metric' ? 'm' : 'ft';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Room & Surfaces</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'metric' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Metric</button>
            <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'imperial' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Imperial</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">L ({u})</label>
              <input type="text" value={length} onChange={e => setLength(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">W ({u})</label>
              <input type="text" value={width} onChange={e => setWidth(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-black text-slate-400 uppercase tracking-wider block mb-2">H ({u})</label>
              <input type="text" value={height} onChange={e => setHeight(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider">Absorption Coefficients (α)</div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Floor (carpet/wood/concrete)</label>
              <input type="text" value={floorAbs} onChange={e => setFloorAbs(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Ceiling (tile/plaster)</label>
              <input type="text" value={ceilingAbs} onChange={e => setCeilingAbs(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Walls (painted/block)</label>
              <input type="text" value={wallAbs} onChange={e => setWallAbs(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">Door α</label>
                <input type="text" value={doorAbs} onChange={e => setDoorAbs(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">Door Area ({u}²)</label>
                <input type="text" value={doorArea} onChange={e => setDoorArea(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">Window α</label>
                <input type="text" value={windowAbs} onChange={e => setWindowAbs(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1">Window Area ({u}²)</label>
                <input type="text" value={windowArea} onChange={e => setWindowArea(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          <button onClick={() => { setLength('10'); setWidth('8'); setHeight('3'); setFloorAbs('0.05'); setCeilingAbs('0.10'); setWallAbs('0.05'); setDoorAbs('0.08'); setWindowAbs('0.35'); setDoorArea('2'); setWindowArea('6'); }}
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
                    <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Room Volume</div>
                    <div className="text-3xl font-black text-blue-700">{formatNum(result.volume)}<span className="text-lg text-blue-400"> {u}³</span></div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Total Absorption</div>
                    <div className="text-3xl font-black text-green-700">{formatNum(result.totalAbsorption)}<span className="text-lg text-green-400"> Sabins</span></div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">RT60</div>
                    <div className="text-3xl font-black text-orange-700">{formatNum(result.rt60)}<span className="text-lg text-orange-400"> s</span></div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                  <div className="text-base font-black text-slate-400 uppercase tracking-wider mb-2">Acoustic Rating</div>
                  <div className={`text-2xl font-black ${result.ratingColor}`}>{result.rating}</div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid room dimensions to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                RT60 = 0.161 × V / A (metric) or 0.049 × V / A (imperial), A = Σ(Sᵢ × αᵢ)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
