'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge } from 'lucide-react';

const MATERIALS = [
  { name: 'Aluminum 6061', vc: 500, fz: 0.10 },
  { name: 'Mild Steel (1018)', vc: 200, fz: 0.06 },
  { name: 'Stainless 304', vc: 150, fz: 0.04 },
  { name: 'Cast Iron (GG25)', vc: 200, fz: 0.06 },
  { name: 'Titanium (Ti-6Al-4V)', vc: 60, fz: 0.03 },
  { name: 'Brass (C360)', vc: 300, fz: 0.08 },
  { name: 'Custom', vc: 200, fz: 0.06 },
];

export default function MillingMRRClient() {
  const [matIdx, setMatIdx] = useState(0);
  const [toolDia, setToolDia] = useState(10);
  const [flutes, setFlutes] = useState(3);
  const [woc, setWoc] = useState(8);
  const [doc, setDoc] = useState(2);
  const [cutLength, setCutLength] = useState(100);
  const [customVc, setCustomVc] = useState(500);
  const [customFz, setCustomFz] = useState(0.10);
  const [useCustom, setUseCustom] = useState(false);

  const result = useMemo(() => {
    const mat = MATERIALS[matIdx];
    const Vc = useCustom ? customVc : mat.vc;
    const fz = useCustom ? customFz : mat.fz;
    const D = toolDia;
    const Z = flutes;

    const rpm = (Vc * 1000) / (Math.PI * D);
    const feedRate = rpm * fz * Z;
    const mrr = (woc * doc * feedRate) / 1000;
    const cuttingTime = (cutLength / feedRate) * 60;
    const power = (mrr * 0.5) / 1000;

    return { Vc, fz, rpm, feedRate, mrr, cuttingTime, power };
  }, [matIdx, toolDia, flutes, woc, doc, cutLength, customVc, customFz, useCustom]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="w-5 h-5 rounded accent-pink-600" />
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
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Chip Load fz (mm/tooth)</label>
                <input type="number" step="0.01" value={customFz} onChange={e => setCustomFz(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Tool Diameter (mm)</label>
            <input type="number" value={toolDia} onChange={e => setToolDia(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Number of Flutes</label>
            <input type="number" value={flutes} onChange={e => setFlutes(parseInt(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Width of Cut (mm)</label>
            <input type="number" value={woc} onChange={e => setWoc(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Depth of Cut (mm)</label>
            <input type="number" step="0.1" value={doc} onChange={e => setDoc(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Cut Length (mm)</label>
            <input type="number" value={cutLength} onChange={e => setCutLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
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
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-xs font-black text-pink-400 uppercase tracking-wider mb-2">Material Removal Rate</div>
                <div className="text-3xl font-black text-pink-700">{result.mrr.toFixed(1)}<span className="text-lg text-pink-400"> cm³/min</span></div>
                <div className="text-xs text-pink-600 font-medium mt-1">MRR = WOC × DOC × F / 1000</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Feed Rate</div>
                <div className="text-3xl font-black text-blue-700">{result.feedRate.toFixed(0)}<span className="text-lg text-blue-400"> mm/min</span></div>
                <div className="text-xs text-blue-600 font-medium mt-1">F = N × fz × Z</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">RPM</div>
                <div className="text-base font-black text-slate-700">{result.rpm.toFixed(0)}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Vc</div>
                <div className="text-base font-black text-slate-700">{result.Vc} m/min</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Cut Time</div>
                <div className="text-base font-black text-slate-700">{result.cuttingTime.toFixed(1)}s</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Est. Power</div>
                <div className="text-base font-black text-slate-700">{result.power.toFixed(2)} kW</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                RPM = Vc×1000/(π×D). Feed = RPM × fz × Z. MRR = WOC × DOC × Feed / 1000 (cm³/min). Power ≈ MRR × k (k≈0.5 for steel, varies by material). Values are starting points for carbide tools.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
