'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

type HazardType = 'light' | 'ordinary' | 'extra';

const HAZARD_PRESETS: Record<HazardType, { name: string; maxCoverage: number; maxSpacing: number }> = {
  light: { name: 'Light Hazard', maxCoverage: 20.9, maxSpacing: 4.6 },
  ordinary: { name: 'Ordinary Hazard', maxCoverage: 12.1, maxSpacing: 3.7 },
  extra: { name: 'Extra Hazard', maxCoverage: 9.3, maxSpacing: 3.7 },
};

export default function FireSprinklerCoverageCalculatorClient() {
  const [roomLength, setRoomLength] = useState('30');
  const [roomWidth, setRoomWidth] = useState('20');
  const [hazardType, setHazardType] = useState<HazardType>('light');
  const [proposedSpacing, setProposedSpacing] = useState('4.0');
  const [branchDistance, setBranchDistance] = useState('4.0');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const result = useMemo(() => {
    const rl = parseFloat(roomLength);
    const rw = parseFloat(roomWidth);
    const spacing = parseFloat(proposedSpacing);
    const branch = parseFloat(branchDistance);
    const preset = HAZARD_PRESETS[hazardType];

    if (!rl || !rw || !spacing || !branch || rl <= 0 || rw <= 0 || spacing <= 0 || branch <= 0) return null;

    const roomArea = rl * rw;
    const coveragePerHead = spacing * branch;
    const headsNeeded = Math.ceil(roomArea / coveragePerHead);
    const actualCoverage = roomArea / headsNeeded;

    const spacingOK = spacing <= preset.maxSpacing && branch <= preset.maxSpacing;
    const coverageOK = coveragePerHead <= preset.maxCoverage;
    const allOK = spacingOK && coverageOK;

    return {
      roomArea,
      coveragePerHead,
      headsNeeded,
      actualCoverage,
      maxCoverage: preset.maxCoverage,
      maxSpacing: preset.maxSpacing,
      spacingOK,
      coverageOK,
      allOK,
    };
  }, [roomLength, roomWidth, hazardType, proposedSpacing, branchDistance]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 100) return n.toFixed(0);
    if (Math.abs(n) >= 10) return n.toFixed(1);
    return n.toFixed(2);
  };

  const u = unit === 'metric' ? 'm' : 'ft';
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
            <button onClick={() => { setUnit('metric'); setRoomLength('30'); setRoomWidth('20'); setProposedSpacing('4.0'); setBranchDistance('4.0'); }} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'metric' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Metric</button>
            <button onClick={() => { setUnit('imperial'); setRoomLength('100'); setRoomWidth('65'); setProposedSpacing('13'); setBranchDistance('13'); }} className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${unit === 'imperial' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>Imperial</button>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Hazard Classification</label>
            <select value={hazardType} onChange={e => setHazardType(e.target.value as HazardType)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all">
              {Object.entries(HAZARD_PRESETS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Room L ({u})</label>
              <input type="text" value={roomLength} onChange={e => setRoomLength(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Room W ({u})</label>
              <input type="text" value={roomWidth} onChange={e => setRoomWidth(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sprinkler Spacing ({u})</label>
            <input type="text" value={proposedSpacing} onChange={e => setProposedSpacing(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Branch Line Distance ({u})</label>
            <input type="text" value={branchDistance} onChange={e => setBranchDistance(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => { setHazardType('light'); setRoomLength('30'); setRoomWidth('20'); setProposedSpacing('4.0'); setBranchDistance('4.0'); }}
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
                    <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Room Area</div>
                    <div className="text-3xl font-black text-blue-700">{formatNum(result.roomArea)}<span className="text-lg text-blue-400"> {u2}</span></div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Coverage/Head</div>
                    <div className="text-3xl font-black text-green-700">{formatNum(result.coveragePerHead)}<span className="text-lg text-green-400"> {u2}</span></div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Heads Needed</div>
                    <div className="text-3xl font-black text-orange-700">{result.headsNeeded}</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${result.coverageOK ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    {result.coverageOK ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    <span className={`text-base font-bold ${result.coverageOK ? 'text-green-700' : 'text-red-700'}`}>
                      Coverage: {formatNum(result.coveragePerHead)} {u2} vs max {formatNum(result.maxCoverage)} {u2} — {result.coverageOK ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${result.spacingOK ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    {result.spacingOK ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    <span className={`text-base font-bold ${result.spacingOK ? 'text-green-700' : 'text-red-700'}`}>
                      Spacing: max {formatNum(result.maxSpacing)} {u} — {result.spacingOK ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid dimensions to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                NFPA 13: coverage = spacing × branch distance, heads = ceil(area / coverage)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
