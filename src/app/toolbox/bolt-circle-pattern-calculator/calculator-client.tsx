'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

export default function BoltCircleClient() {
  const [pcd, setPcd] = useState(100);
  const [boltCount, setBoltCount] = useState(8);
  const [startAngle, setStartAngle] = useState(0);
  const [holeDia, setHoleDia] = useState(10);
  const [centerHole, setCenterHole] = useState(false);

  const coords = useMemo(() => {
    const r = pcd / 2;
    const angleStep = (2 * Math.PI) / boltCount;
    const startRad = (startAngle * Math.PI) / 180;

    return Array.from({ length: boltCount }, (_, i) => {
      const angle = startRad + i * angleStep;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      return {
        n: i + 1,
        x: x.toFixed(3),
        y: y.toFixed(3),
        angleDeg: ((angle * 180 / Math.PI) % 360).toFixed(1),
      };
    });
  }, [pcd, boltCount, startAngle]);

  const downloadCsv = () => {
    const rows = [['Hole #', 'X (mm)', 'Y (mm)', 'Angle (deg)']];
    coords.forEach(c => rows.push([String(c.n), c.x, c.y, c.angleDeg]));
    if (centerHole) rows.push(['C', '0.000', '0.000', '—']);
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-circle-coordinates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const svgR = Math.min(pcd / 2 + 20, 180);
  const scale = svgR / (pcd / 2 + 15);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pitch Circle Diameter PCD (mm)</label>
            <input type="number" step="1" value={pcd} onChange={e => setPcd(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Number of Bolts</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 6, 8, 10, 12, 16, 24].map(n => (
                <button key={n} onClick={() => setBoltCount(n)} className={`h-10 rounded-xl text-base font-black border transition-all ${boltCount === n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Start Angle (°)</label>
            <input type="number" step="15" value={startAngle} onChange={e => setStartAngle(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            <div className="mt-2 flex gap-1.5">
              {[0, 45, 90, 180].map(a => (
                <button key={a} onClick={() => setStartAngle(a)} className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all">{a}°</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Hole Diameter (mm)</label>
            <input type="number" step="0.5" value={holeDia} onChange={e => setHoleDia(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={centerHole} onChange={e => setCenterHole(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
            <span className="text-base font-bold text-slate-600">Add center hole (0, 0)</span>
          </label>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Hole Coordinates</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">#</th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">X (mm)</th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">Y (mm)</th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-sm">Angle</th>
                  </tr>
                </thead>
                <tbody>
                  {coords.map(c => (
                    <tr key={c.n} className="border-b border-slate-50">
                      <td className="py-2.5 px-2 font-black text-slate-400">{c.n}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-700">{c.x}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-700">{c.y}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-500">{c.angleDeg}°</td>
                    </tr>
                  ))}
                  {centerHole && (
                    <tr className="border-b border-slate-50 bg-blue-50">
                      <td className="py-2.5 px-2 font-black text-blue-600">C</td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-600">0.000</td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-600">0.000</td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-400">—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Bolt Circle Preview</h3>
            <div className="flex justify-center">
              <svg viewBox={`-${svgR + 5} -${svgR + 5} ${2 * svgR + 10} ${2 * svgR + 10}`} className="w-full max-w-[360px]">
                <circle cx="0" cy="0" r={pcd / 2 * scale} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" />
                {centerHole && <circle cx="0" cy="0" r={holeDia / 2 * scale} fill="none" stroke="#3b82f6" strokeWidth="1.5" />}
                {coords.map(c => (
                  <circle key={c.n} cx={parseFloat(c.x) * scale} cy={-parseFloat(c.y) * scale} r={holeDia / 2 * scale} fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
                ))}
                <line x1="0" y1="0" x2={pcd / 2 * scale} y2="0" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x={pcd / 4 * scale} y="-3" className="fill-slate-400 text-[8px]">PCD={pcd}</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
