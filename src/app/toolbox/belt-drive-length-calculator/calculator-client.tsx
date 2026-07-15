'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

type SolveMode = 'beltLength' | 'centerDistance';

export default function BeltDriveClient() {
  const [mode, setMode] = useState<SolveMode>('beltLength');
  const [d1, setD1] = useState(100); // driver pulley diameter mm
  const [d2, setD2] = useState(300); // driven pulley diameter mm
  const [centerDist, setCenterDist] = useState(500); // mm
  const [beltLength, setBeltLength] = useState(1500); // mm
  const [inputRPM, setInputRPM] = useState(1450);

  const results = useMemo(() => {
    const r1 = d1 / 2;
    const r2 = d2 / 2;
    const ratio = d2 / d1;
    const outputRPM = inputRPM / ratio;

    let C = centerDist;
    let L = beltLength;

    if (mode === 'beltLength') {
      // Belt length formula: L = 2C + π/2 × (D1 + D2) + (D2 - D1)² / (4C)
      L = 2 * C + (Math.PI / 2) * (d1 + d2) + Math.pow(d2 - d1, 2) / (4 * C);
    } else {
      // Solve for center distance from belt length
      // Iterative approach: start with approximate C and iterate
      // L ≈ 2C + π/2 × (D1 + D2) + (D2 - D1)² / (4C)
      // Rearrange: C ≈ (L - π/2 × (D1+D2)) / 2 (first approximation, ignoring the squared term)
      let c = (L - (Math.PI / 2) * (d1 + d2)) / 2;
      for (let i = 0; i < 20; i++) {
        const calcL = 2 * c + (Math.PI / 2) * (d1 + d2) + Math.pow(d2 - d1, 2) / (4 * c);
        const error = calcL - L;
        if (Math.abs(error) < 0.01) break;
        c -= error / (2 - Math.pow(d2 - d1, 2) / (4 * c * c));
      }
      C = c;
    }

    // Belt wrap angles
    const alpha1 = Math.PI - 2 * Math.asin((d2 - d1) / (2 * C)); // driver wrap (rad)
    const alpha2 = Math.PI + 2 * Math.asin((d2 - d1) / (2 * C)); // driven wrap (rad)
    const alpha1Deg = (alpha1 * 180 / Math.PI);
    const alpha2Deg = (alpha2 * 180 / Math.PI);

    return {
      beltLength: L.toFixed(1),
      centerDistance: C.toFixed(1),
      speedRatio: ratio.toFixed(2),
      outputRPM: outputRPM.toFixed(0),
      driverWrap: alpha1Deg.toFixed(1),
      drivenWrap: alpha2Deg.toFixed(1),
    };
  }, [mode, d1, d2, centerDist, beltLength, inputRPM]);

  const downloadCsv = () => {
    const csv = [
      ['Belt Drive Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Solve Mode', mode === 'beltLength' ? 'Belt Length from Center Distance' : 'Center Distance from Belt Length'],
      ['', ''],
      ['Input Parameters', ''],
      ['Driver Pulley D1 (mm)', d1],
      ['Driven Pulley D2 (mm)', d2],
      ['Input RPM', inputRPM],
      [mode === 'beltLength' ? 'Center Distance (mm)' : 'Belt Length (mm)', mode === 'beltLength' ? centerDist : beltLength],
      ['', ''],
      ['Calculated Results', ''],
      ['Belt Length (mm)', results.beltLength],
      ['Center Distance (mm)', results.centerDistance],
      ['Speed Ratio (D2/D1)', results.speedRatio],
      ['Output RPM', results.outputRPM],
      ['Driver Wrap Angle (°)', results.driverWrap],
      ['Driven Wrap Angle (°)', results.drivenWrap],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'belt-drive-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Solve For</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode('beltLength')} className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${mode === 'beltLength' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>Belt Length</button>
              <button onClick={() => setMode('centerDistance')} className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${mode === 'centerDistance' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>Center Dist</button>
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Driver Pulley D₁ (mm)</label>
            <input type="number" step="5" value={d1} onChange={e => setD1(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Driven Pulley D₂ (mm)</label>
            <input type="number" step="5" value={d2} onChange={e => setD2(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Input RPM</label>
            <input type="number" step="10" value={inputRPM} onChange={e => setInputRPM(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          {mode === 'beltLength' ? (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Center Distance C (mm)</label>
              <input type="number" step="10" value={centerDist} onChange={e => setCenterDist(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          ) : (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Belt Length L (mm)</label>
              <input type="number" step="10" value={beltLength} onChange={e => setBeltLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">{mode === 'beltLength' ? 'Belt Length' : 'Center Distance'}</p>
                <p className="text-3xl font-black">{mode === 'beltLength' ? results.beltLength : results.centerDistance}<span className="text-lg font-bold ml-2 opacity-80">mm</span></p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Output RPM</p>
                <p className="text-3xl font-black">{results.outputRPM}<span className="text-lg font-bold ml-2 opacity-80">RPM</span></p>
                <p className="text-sm mt-2 opacity-70">Ratio {results.speedRatio}:1</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Speed Ratio', value: results.speedRatio + ':1', unit: '' },
                { label: 'Driver Wrap', value: results.driverWrap, unit: '°' },
                { label: 'Driven Wrap', value: results.drivenWrap, unit: '°' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}<span className="text-base text-slate-400 font-bold ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Pulley Diagram */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Pulley Layout</h3>
            <svg viewBox="0 0 500 200" className="w-full">
              {/* Driver pulley */}
              <circle cx="100" cy="100" r={Math.min(d1 / 4, 50)} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="100" cy="100" r="3" fill="#3b82f6" />
              <text x="100" y="170" className="fill-blue-600 text-sm font-bold text-center">D₁={d1}mm</text>
              <text x="100" y="185" className="fill-slate-400 text-[8px] text-center">{inputRPM} RPM</text>
              {/* Driven pulley */}
              <circle cx="400" cy="100" r={Math.min(d2 / 4, 50)} fill="none" stroke="#10b981" strokeWidth="2" />
              <circle cx="400" cy="100" r="3" fill="#10b981" />
              <text x="400" y="170" className="fill-emerald-600 text-sm font-bold text-center">D₂={d2}mm</text>
              <text x="400" y="185" className="fill-slate-400 text-[8px] text-center">{results.outputRPM} RPM</text>
              {/* Belt lines (simplified as tangent lines) */}
              <line x1={100 + Math.min(d1 / 4, 50)} y1="100" x2={400 + Math.min(d2 / 4, 50)} y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1={100 - Math.min(d1 / 4, 50)} y1="100" x2={400 - Math.min(d2 / 4, 50)} y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Center distance */}
              <line x1="100" y1="40" x2="400" y2="40" stroke="#64748b" strokeWidth="1" markerStart="url(#dotL)" markerEnd="url(#dotR)" />
              <text x="250" y="35" className="fill-slate-600 text-[9px] font-bold text-center">C={results.centerDistance}mm</text>
              <defs>
                <marker id="dotL" markerWidth="4" markerHeight="4" refX="2" refY="2"><circle cx="2" cy="2" r="1.5" fill="#64748b" /></marker>
                <marker id="dotR" markerWidth="4" markerHeight="4" refX="2" refY="2"><circle cx="2" cy="2" r="1.5" fill="#64748b" /></marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
