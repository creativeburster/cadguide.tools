'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge } from 'lucide-react';

const MATERIALS = [
  { name: 'Steel — Mild (AISI 1018)', hss: 30, carbide: 180, feed: 0.15 },
  { name: 'Steel — Medium (AISI 1045)', hss: 25, carbide: 150, feed: 0.15 },
  { name: 'Stainless 304', hss: 18, carbide: 120, feed: 0.12 },
  { name: 'Aluminum 6061', hss: 250, carbide: 600, feed: 0.20 },
  { name: 'Brass (C360)', hss: 100, carbide: 300, feed: 0.18 },
  { name: 'Cast Iron (GG25)', hss: 25, carbide: 150, feed: 0.15 },
  { name: 'Titanium (Ti-6Al-4V)', hss: 12, carbide: 60, feed: 0.10 },
  { name: 'Custom', hss: 30, carbide: 180, feed: 0.15 },
];

export default function TurningSpeedsClient() {
  const [matIdx, setMatIdx] = useState(0);
  const [toolType, setToolType] = useState<'hss' | 'carbide'>('carbide');
  const [diameter, setDiameter] = useState(50);
  const [doc, setDoc] = useState(2);
  const [length, setLength] = useState(100);
  const [customVc, setCustomVc] = useState(180);
  const [customFeed, setCustomFeed] = useState(0.15);
  const [useCustom, setUseCustom] = useState(false);

  const result = useMemo(() => {
    const mat = MATERIALS[matIdx];
    const Vc = useCustom ? customVc : (toolType === 'hss' ? mat.hss : mat.carbide);
    const fn = useCustom ? customFeed : mat.feed;

    const D = diameter;
    const rpm = (Vc * 1000) / (Math.PI * D);
    const feedRate = rpm * fn;
    const mrr = feedRate * doc * D;
    const cuttingTime = length / feedRate * 60;

    return { Vc, fn, rpm, feedRate, mrr, cuttingTime };
  }, [matIdx, toolType, diameter, doc, length, customVc, customFeed, useCustom]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Tool Material</label>
            <div className="grid grid-cols-2 gap-2">
              {(['hss', 'carbide'] as const).map(t => (
                <button key={t} onClick={() => setToolType(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${toolType === t ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {t === 'hss' ? 'HSS' : 'Carbide'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="w-5 h-5 rounded accent-amber-600" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Custom Speeds</span>
            </label>
          </div>

          {useCustom && (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Cutting Speed Vc (m/min)</label>
                <input type="number" value={customVc} onChange={e => setCustomVc(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Feed/Rev (mm/rev)</label>
                <input type="number" step="0.01" value={customFeed} onChange={e => setCustomFeed(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Workpiece Ø (mm)</label>
            <input type="number" value={diameter} onChange={e => setDiameter(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Depth of Cut (mm)</label>
            <input type="number" step="0.1" value={doc} onChange={e => setDoc(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Cut Length (mm)</label>
            <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Gauge className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">Spindle Speed</div>
                <div className="text-3xl font-black text-amber-700">{result.rpm.toFixed(0)}<span className="text-lg text-amber-400"> RPM</span></div>
                <div className="text-xs text-amber-600 font-medium mt-1">N = Vc×1000 / (π×D)</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Feed Rate</div>
                <div className="text-3xl font-black text-blue-700">{result.feedRate.toFixed(1)}<span className="text-lg text-blue-400"> mm/min</span></div>
                <div className="text-xs text-blue-600 font-medium mt-1">F = N × fn</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Cutting Speed</div>
                <div className="text-lg font-black text-slate-700">{result.Vc} m/min</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">MRR</div>
                <div className="text-lg font-black text-slate-700">{result.mrr.toFixed(0)} mm³/min</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Cutting Time</div>
                <div className="text-lg font-black text-slate-700">{result.cuttingTime.toFixed(1)} s</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                RPM = Vc×1000/(π×D). Feed rate = RPM × feed/rev. MRR = feedRate × DOC × Ø. Cutting time = length / feedRate × 60. Values are starting points — adjust based on tool wear, surface finish, and rigidity.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
