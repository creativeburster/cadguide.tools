'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

type Mode = 'speed' | 'diameter';

export default function PumpAffinityClient() {
  const [mode, setMode] = useState<Mode>('speed');
  const [q1, setQ1] = useState(100);
  const [h1, setH1] = useState(30);
  const [p1, setP1] = useState(15);
  const [n1, setN1] = useState(1450);
  const [n2, setN2] = useState(1750);
  const [d1, setD1] = useState(200);
  const [d2, setD2] = useState(180);

  const results = useMemo(() => {
    let ratio: number;

    if (mode === 'speed') {
      ratio = n2 / n1;
    } else {
      ratio = d2 / d1;
    }

    // Affinity laws
    const q2 = q1 * ratio;
    const h2 = h1 * ratio * ratio;
    const p2 = p1 * ratio * ratio * ratio;

    return {
      ratio: ratio.toFixed(4),
      q2: q2.toFixed(2),
      h2: h2.toFixed(2),
      p2: p2.toFixed(2),
      qChange: ((q2 / q1 - 1) * 100).toFixed(1),
      hChange: ((h2 / h1 - 1) * 100).toFixed(1),
      pChange: ((p2 / p1 - 1) * 100).toFixed(1),
    };
  }, [mode, q1, h1, p1, n1, n2, d1, d2]);

  const downloadCsv = () => {
    const csv = [
      ['Pump Affinity Law Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Mode', mode === 'speed' ? 'Speed Change' : 'Impeller Diameter Change'],
      ['', ''],
      ['Input (Condition 1)', ''],
      ['Flow Q1 (m³/h)', q1],
      ['Head H1 (m)', h1],
      ['Power P1 (kW)', p1],
      [mode === 'speed' ? 'Speed N1 (RPM)' : 'Diameter D1 (mm)', mode === 'speed' ? n1 : d1],
      [mode === 'speed' ? 'Speed N2 (RPM)' : 'Diameter D2 (mm)', mode === 'speed' ? n2 : d2],
      ['', ''],
      ['Output (Condition 2)', ''],
      ['Flow Q2 (m³/h)', results.q2],
      ['Head H2 (m)', results.h2],
      ['Power P2 (kW)', results.p2],
      ['Ratio', results.ratio],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pump-affinity-law.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Change Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode('speed')} className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${mode === 'speed' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>Speed Change</button>
              <button onClick={() => setMode('diameter')} className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${mode === 'diameter' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>Impeller Trim</button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Baseline (Condition 1)</p>
            <div className="space-y-4">
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Flow Q₁ (m³/h)</label>
                <input type="number" step="1" value={q1} onChange={e => setQ1(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Head H₁ (m)</label>
                <input type="number" step="0.5" value={h1} onChange={e => setH1(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Power P₁ (kW)</label>
                <input type="number" step="0.1" value={p1} onChange={e => setP1(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">{mode === 'speed' ? 'Speed Change' : 'Impeller Trim'}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{mode === 'speed' ? 'N₁ (RPM)' : 'D₁ (mm)'}</label>
                <input type="number" step="1" value={mode === 'speed' ? n1 : d1} onChange={e => mode === 'speed' ? setN1(parseFloat(e.target.value) || 0) : setD1(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">{mode === 'speed' ? 'N₂ (RPM)' : 'D₂ (mm)'}</label>
                <input type="number" step="1" value={mode === 'speed' ? n2 : d2} onChange={e => mode === 'speed' ? setN2(parseFloat(e.target.value) || 0) : setD2(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">New Operating Point</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Flow Q₂</p>
                <p className="text-2xl font-black">{results.q2}<span className="text-base font-bold ml-1 opacity-80">m³/h</span></p>
                <p className="text-sm mt-1 opacity-70">{results.qChange}% change</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Head H₂</p>
                <p className="text-2xl font-black">{results.h2}<span className="text-base font-bold ml-1 opacity-80">m</span></p>
                <p className="text-sm mt-1 opacity-70">{results.hChange}% change</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Power P₂</p>
                <p className="text-2xl font-black">{results.p2}<span className="text-base font-bold ml-1 opacity-80">kW</span></p>
                <p className="text-sm mt-1 opacity-70">{results.pChange}% change</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Affinity Laws Applied</p>
              <div className="space-y-1 text-base font-mono text-slate-600">
                <p>Q₂ = Q₁ × (N₂/N₁) = {q1} × {results.ratio} = {results.q2}</p>
                <p>H₂ = H₁ × (N₂/N₁)² = {h1} × {results.ratio}² = {results.h2}</p>
                <p>P₂ = P₁ × (N₂/N₁)³ = {p1} × {results.ratio}³ = {results.p2}</p>
              </div>
            </div>
          </div>

          {/* Performance Curve Sketch */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Performance Curve Shift</h3>
            <svg viewBox="0 0 400 200" className="w-full">
              <line x1="40" y1="170" x2="380" y2="170" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="#cbd5e1" strokeWidth="1" />
              <text x="210" y="195" className="fill-slate-400 text-sm font-bold text-center">Flow Q (m³/h)</text>
              <text x="15" y="95" className="fill-slate-400 text-sm font-bold" transform="rotate(-90 15 95)">Head H (m)</text>
              {/* Curve 1 */}
              <path d="M 40 30 Q 200 60 380 160" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <text x="80" y="50" className="fill-blue-500 text-sm font-bold">H₁ (baseline)</text>
              {/* Curve 2 */}
              <path d="M 40 60 Q 180 90 340 165" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
              <text x="80" y="80" className="fill-emerald-500 text-sm font-bold">H₂ (new)</text>
            </svg>
            <p className="text-sm text-slate-400 mt-2 font-medium text-center">Simplified head-flow curve shift. Actual curve shape depends on pump specific speed and system curve.</p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
