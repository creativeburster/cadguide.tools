'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

const MATERIALS = [
  { name: 'PP (Polypropylene)', cavityPressure: 30, color: '#3b82f6' },
  { name: 'PE (Polyethylene)', cavityPressure: 25, color: '#10b981' },
  { name: 'ABS', cavityPressure: 40, color: '#f59e0b' },
  { name: 'PC (Polycarbonate)', cavityPressure: 50, color: '#ef4444' },
  { name: 'Nylon (PA6)', cavityPressure: 45, color: '#8b5cf6' },
  { name: 'PS (Polystyrene)', cavityPressure: 35, color: '#06b6d4' },
  { name: 'PMMA (Acrylic)', cavityPressure: 45, color: '#ec4899' },
  { name: 'POM (Delrin)', cavityPressure: 50, color: '#84cc16' },
  { name: 'Custom', cavityPressure: 40, color: '#64748b' },
];

export default function InjectionClampingClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [customPressure, setCustomPressure] = useState(40);
  const [projectedArea, setProjectedArea] = useState(100); // cm²
  const [cavities, setCavities] = useState(1);
  const [safetyFactor, setSafetyFactor] = useState(1.2);

  const cavityPressure = materialIdx === 8 ? customPressure : MATERIALS[materialIdx].cavityPressure;

  const results = useMemo(() => {
    // F = P × A × n × SF
    // P in MPa (bar/10), A in cm² → convert to m² (×0.0001)
    // F (N) = P (MPa) × A (m²) × n × SF
    // F (tons) = F (N) / 9810
    const areaM2 = projectedArea * 0.0001 * cavities;
    const forceN = cavityPressure * 1e6 * areaM2 * safetyFactor;
    const forceTons = forceN / 9810;
    const forceKN = forceN / 1000;

    return {
      forceTons: forceTons.toFixed(1),
      forceKN: forceKN.toFixed(1),
      areaTotal: (projectedArea * cavities).toFixed(0),
      cavityPressure,
    };
  }, [cavityPressure, projectedArea, cavities, safetyFactor]);

  const downloadCsv = () => {
    const csv = [
      ['Injection Molding Clamping Force Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Material', MATERIALS[materialIdx].name],
      ['', ''],
      ['Input Parameters', ''],
      ['Projected Area per Cavity (cm²)', projectedArea],
      ['Number of Cavities', cavities],
      ['Cavity Pressure (MPa)', results.cavityPressure],
      ['Safety Factor', safetyFactor],
      ['', ''],
      ['Calculated Results', ''],
      ['Total Projected Area (cm²)', results.areaTotal],
      ['Clamping Force (tons)', results.forceTons],
      ['Clamping Force (kN)', results.forceKN],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'injection-clamping-force.csv';
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select
              value={materialIdx}
              onChange={e => setMaterialIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              {MATERIALS.map((m, i) => <option key={m.name} value={i}>{m.name}</option>)}
            </select>
          </div>

          {materialIdx === 8 && (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Cavity Pressure (MPa)</label>
              <input type="number" step="1" value={customPressure} onChange={e => setCustomPressure(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Projected Area per Cavity (cm²)</label>
            <input type="number" step="1" value={projectedArea} onChange={e => setProjectedArea(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Number of Cavities</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 8].map(c => (
                <button key={c} onClick={() => setCavities(c)} className={`h-12 rounded-xl text-sm font-black border transition-all ${cavities === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Safety Factor</label>
            <div className="flex gap-2">
              {[1.0, 1.2, 1.5, 2.0].map(sf => (
                <button key={sf} onClick={() => setSafetyFactor(sf)} className={`flex-1 h-10 rounded-xl text-xs font-black border transition-all ${safetyFactor === sf ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>{sf}×</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Clamping Force Results</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">Required Clamping Force</p>
                <p className="text-4xl font-black">{results.forceTons}<span className="text-sm font-bold ml-2 opacity-80">tons</span></p>
                <p className="text-[10px] mt-2 opacity-70">F = P × A × n × SF</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">Force in kN</p>
                <p className="text-4xl font-black">{results.forceKN}<span className="text-sm font-bold ml-2 opacity-80">kN</span></p>
                <p className="text-[10px] mt-2 opacity-70">{results.areaTotal} cm² total area</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cavity Pressure', value: results.cavityPressure, unit: 'MPa' },
                { label: 'Total Projected Area', value: results.areaTotal, unit: 'cm²' },
                { label: 'Safety Factor', value: safetyFactor + '×', unit: '' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}<span className="text-xs text-slate-400 font-bold ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Material Reference */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">Cavity Pressure by Material</h3>
            <div className="space-y-2">
              {MATERIALS.filter(m => m.name !== 'Custom').map((m, i) => (
                <div
                  key={m.name}
                  onClick={() => setMaterialIdx(i)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${materialIdx === i ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <span className="text-xs font-bold text-slate-600 w-40">{m.name}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                    <div className="h-full rounded-lg flex items-center justify-end px-2 text-[10px] font-black text-white" style={{ width: `${(m.cavityPressure / 60) * 100}%`, backgroundColor: m.color }}>
                      {m.cavityPressure} MPa
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 font-medium">Cavity pressures are starting recommendations. Actual values depend on melt temperature, flow length, wall thickness, and mold temperature.</p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
