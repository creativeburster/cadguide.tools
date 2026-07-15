'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download } from 'lucide-react';

const STANDARD_MODULES = [0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0, 16.0, 20.0, 25.0];

export default function GearModuleClient() {
  const [solveFor, setSolveFor] = useState<'module' | 'teeth' | 'pitchDiameter'>('module');
  const [moduleVal, setModuleVal] = useState<number>(2.0);
  const [teeth, setTeeth] = useState<number>(24);
  const [pitchDiameter, setPitchDiameter] = useState<number>(48);
  const [teeth2, setTeeth2] = useState<number>(36);
  const [showCenterDistance, setShowCenterDistance] = useState<boolean>(true);

  const result = useMemo(() => {
    let m = moduleVal;
    let z = teeth;
    let d = pitchDiameter;

    if (solveFor === 'module') {
      if (z > 0) m = d / z;
    } else if (solveFor === 'teeth') {
      if (m > 0) z = d / m;
    } else if (solveFor === 'pitchDiameter') {
      d = m * z;
    }

    const centerDistance = showCenterDistance && m > 0 ? m * (z + teeth2) / 2 : 0;
    const addendum = m;
    const dedendum = 1.25 * m;
    const tipDiameter = d + 2 * addendum;
    const rootDiameter = d - 2 * dedendum;
    const circularPitch = Math.PI * m;
    const baseDiameter = d * Math.cos(20 * Math.PI / 180);

    return {
      module: m,
      teeth: z,
      pitchDiameter: d,
      centerDistance,
      addendum,
      dedendum,
      tipDiameter,
      rootDiameter,
      circularPitch,
      baseDiameter,
      teeth2,
    };
  }, [solveFor, moduleVal, teeth, pitchDiameter, teeth2, showCenterDistance]);

  const downloadCsv = () => {
    const csv = [
      ['Gear Module Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Solved For', solveFor],
      ['Module m (mm)', result.module.toFixed(4)],
      ['Teeth z1', result.teeth],
      ['Teeth z2', result.teeth2],
      ['Pitch Diameter d (mm)', result.pitchDiameter.toFixed(4)],
      ['', ''],
      ['Calculated Results', ''],
      ['Pitch Diameter d = m × z (mm)', result.pitchDiameter.toFixed(4)],
      ['Tip Diameter da = d + 2m (mm)', result.tipDiameter.toFixed(4)],
      ['Root Diameter df = d - 2.5m (mm)', result.rootDiameter.toFixed(4)],
      ['Addendum ha = m (mm)', result.addendum.toFixed(4)],
      ['Dedendum hf = 1.25m (mm)', result.dedendum.toFixed(4)],
      ['Circular Pitch p = πm (mm)', result.circularPitch.toFixed(4)],
      ['Base Diameter db = d·cos(20°) (mm)', result.baseDiameter.toFixed(4)],
      ['Center Distance a = m(z1+z2)/2 (mm)', result.centerDistance.toFixed(4)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-module-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Solve For</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'module', label: 'Module' },
                { id: 'teeth', label: 'Teeth' },
                { id: 'pitchDiameter', label: 'Pitch Ø' },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSolveFor(opt.id)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${
                    solveFor === opt.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {solveFor !== 'module' && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Module m (mm)</label>
              <input
                type="number"
                step="0.1"
                value={moduleVal}
                onChange={e => setModuleVal(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {STANDARD_MODULES.slice(6, 14).map(m => (
                  <button
                    key={m}
                    onClick={() => setModuleVal(m)}
                    className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {solveFor !== 'teeth' && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Teeth z₁</label>
              <input
                type="number"
                step="1"
                value={teeth}
                onChange={e => setTeeth(parseInt(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          )}

          {solveFor !== 'pitchDiameter' && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pitch Diameter d (mm)</label>
              <input
                type="number"
                step="0.1"
                value={pitchDiameter}
                onChange={e => setPitchDiameter(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="pt-2 border-t border-slate-50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showCenterDistance}
                onChange={e => setShowCenterDistance(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-base font-bold text-slate-600">Calculate center distance (mating gear)</span>
            </label>
          </div>

          {showCenterDistance && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Mating Gear Teeth z₂</label>
              <input
                type="number"
                step="1"
                value={teeth2}
                onChange={e => setTeeth2(parseInt(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Module m', value: result.module.toFixed(4), unit: 'mm', highlight: solveFor === 'module' },
                { label: 'Teeth z₁', value: result.teeth.toString(), unit: '', highlight: solveFor === 'teeth' },
                { label: 'Pitch Diameter d', value: result.pitchDiameter.toFixed(4), unit: 'mm', highlight: solveFor === 'pitchDiameter' },
                { label: 'Tip Diameter da', value: result.tipDiameter.toFixed(4), unit: 'mm' },
                { label: 'Root Diameter df', value: result.rootDiameter.toFixed(4), unit: 'mm' },
                { label: 'Circular Pitch p', value: result.circularPitch.toFixed(4), unit: 'mm' },
                { label: 'Base Diameter db', value: result.baseDiameter.toFixed(4), unit: 'mm' },
                { label: 'Addendum ha', value: result.addendum.toFixed(4), unit: 'mm' },
                { label: 'Dedendum hf', value: result.dedendum.toFixed(4), unit: 'mm' },
              ].map(item => (
                <div
                  key={item.label}
                  className={`rounded-2xl p-4 border transition-all ${
                    item.highlight
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-xl font-black ${item.highlight ? 'text-blue-600' : 'text-slate-900'}`}>
                    {item.value}
                    {item.unit && <span className="text-base text-slate-400 font-bold ml-1">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {showCenterDistance && (
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-base font-black uppercase tracking-wider opacity-80 mb-1">Center Distance (a = m × (z₁ + z₂) / 2)</p>
                <p className="text-3xl font-black">
                  {result.centerDistance.toFixed(4)}
                  <span className="text-lg font-bold ml-2 opacity-80">mm</span>
                </p>
              </div>
            )}
          </div>

          {/* SVG Visualization */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Gear Geometry Visualization</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
                <circle cx="150" cy="150" r={Math.min(result.pitchDiameter * 1.2, 130)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="150" cy="150" r={Math.min(result.tipDiameter * 1.2, 130)} fill="none" stroke="#1e40af" strokeWidth="1.5" />
                <circle cx="150" cy="150" r={Math.min(result.rootDiameter * 1.2, 130)} fill="none" stroke="#93c5fd" strokeWidth="1" />
                <circle cx="150" cy="150" r={Math.min(result.baseDiameter * 1.2, 130)} fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="150" cy="150" r="3" fill="#1e40af" />
                <line x1="150" y1="150" x2={150 + Math.min(result.pitchDiameter * 1.2, 130)} y2="150" stroke="#3b82f6" strokeWidth="1" />
                <text x="155" y={150 - Math.min(result.pitchDiameter * 0.6, 65)} className="fill-blue-600 text-[8px] font-bold">d={result.pitchDiameter.toFixed(1)}</text>
                <text x="155" y={150 - Math.min(result.tipDiameter * 0.6, 65)} className="fill-blue-800 text-[8px] font-bold">da={result.tipDiameter.toFixed(1)}</text>
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-600"></span><span className="text-slate-600">Pitch Circle (d)</span></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-800"></span><span className="text-slate-600">Tip Circle (da)</span></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-300"></span><span className="text-slate-600">Root Circle (df)</span></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 border-dashed"></span><span className="text-slate-600">Base Circle (db)</span></span>
            </div>
          </div>

          {/* Formula Reference */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-slate-400" />
              <h3 className="text-lg font-black text-slate-900">Formula Reference</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
              {[
                ['Module', 'm = d / z'],
                ['Pitch Diameter', 'd = m × z'],
                ['Tip Diameter', 'da = d + 2m'],
                ['Root Diameter', 'df = d − 2.5m'],
                ['Circular Pitch', 'p = π × m'],
                ['Base Diameter', 'db = d × cos(20°)'],
                ['Center Distance', 'a = m × (z₁ + z₂) / 2'],
                ['Addendum', 'ha = m'],
              ].map(([name, formula]) => (
                <div key={name} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <span className="font-bold text-slate-600">{name}</span>
                  <code className="text-blue-600 font-mono font-bold">{formula}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
