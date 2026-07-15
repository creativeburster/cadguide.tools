'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Info } from 'lucide-react';

const MATERIAL_PRESETS = [
  { name: 'Mild Steel (AISI 1045)', vc: 90, fz: 0.08 },
  { name: 'Stainless Steel (304)', vc: 50, fz: 0.06 },
  { name: 'Aluminum (6061-T6)', vc: 300, fz: 0.12 },
  { name: 'Brass (C360)', vc: 200, fz: 0.10 },
  { name: 'Copper', vc: 150, fz: 0.10 },
  { name: 'Titanium (Ti-6Al-4V)', vc: 40, fz: 0.05 },
  { name: 'Cast Iron (GG25)', vc: 80, fz: 0.08 },
  { name: 'POM / Delrin', vc: 200, fz: 0.15 },
  { name: 'Acrylic (PMMA)', vc: 150, fz: 0.10 },
  { name: 'Custom', vc: 100, fz: 0.08 },
];

export default function CNCFeedRateClient() {
  const [materialIdx, setMaterialIdx] = useState(2);
  const [customVc, setCustomVc] = useState(100);
  const [customFz, setCustomFz] = useState(0.08);
  const [toolDiameter, setToolDiameter] = useState(6);
  const [flutes, setFlutes] = useState(2);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const material = MATERIAL_PRESETS[materialIdx];
  const vc = materialIdx === 9 ? customVc : material.vc;
  const fz = materialIdx === 9 ? customFz : material.fz;

  const results = useMemo(() => {
    const D = toolDiameter;
    const z = flutes;
    const isMetric = unit === 'metric';

    // Spindle speed: n = Vc × 1000 / (π × D)
    const rpm = D > 0 ? (vc * 1000) / (Math.PI * D) : 0;

    // Feed rate: Vf = fz × z × n
    const feedRate = fz * z * rpm;

    // Chip load is fz (already input)
    // MRR for slotting: Vf × D (mm³/min for metric)
    const mrr = feedRate * D;

    // Power estimate: P = MRR × kc / (60 × 1000) [kW]
    // Using approximate specific cutting force kc ≈ 2000 N/mm² for steel, 800 for aluminum
    const kc = materialIdx === 2 ? 800 : materialIdx === 0 ? 2000 : 1500;
    const power = (mrr * kc) / (60 * 1000);

    return {
      rpm: Math.round(rpm),
      feedRate: Math.round(feedRate * 10) / 10,
      chipLoad: fz,
      mrr: Math.round(mrr),
      power: Math.round(power * 100) / 100,
      vc,
      D,
      z,
    };
  }, [vc, fz, toolDiameter, flutes, unit, materialIdx]);

  const downloadCsv = () => {
    const csv = [
      ['CNC Feed Rate Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Material', material.name],
      ['Unit System', unit],
      ['', ''],
      ['Input Parameters', ''],
      ['Cutting Speed Vc (m/min)', results.vc],
      ['Tool Diameter D (mm)', results.D],
      ['Number of Flutes z', results.z],
      ['Chip Load fz (mm/tooth)', results.chipLoad],
      ['', ''],
      ['Calculated Results', ''],
      ['Spindle Speed n (RPM)', results.rpm],
      ['Feed Rate Vf (mm/min)', results.feedRate],
      ['Material Removal Rate (mm³/min)', results.mrr],
      ['Estimated Power (kW)', results.power],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cnc-feed-rate-calculation.csv';
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Workpiece Material</label>
            <select
              value={materialIdx}
              onChange={e => setMaterialIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              {MATERIAL_PRESETS.map((m, i) => (
                <option key={m.name} value={i}>{m.name}</option>
              ))}
            </select>
          </div>

          {materialIdx === 9 && (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Cutting Speed Vc (m/min)</label>
                <input
                  type="number"
                  step="5"
                  value={customVc}
                  onChange={e => setCustomVc(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Chip Load fz (mm/tooth)</label>
                <input
                  type="number"
                  step="0.01"
                  value={customFz}
                  onChange={e => setCustomFz(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Tool Diameter D (mm)</label>
            <input
              type="number"
              step="0.5"
              value={toolDiameter}
              onChange={e => setToolDiameter(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[3, 4, 6, 8, 10, 12, 16, 20].map(d => (
                <button
                  key={d}
                  onClick={() => setToolDiameter(d)}
                  className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all"
                >
                  Ø{d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Number of Flutes z</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(f => (
                <button
                  key={f}
                  onClick={() => setFlutes(f)}
                  className={`h-12 rounded-xl text-lg font-black border transition-all ${
                    flutes === f
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {f}F
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-base font-bold text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 shrink-0" />
            <span>Preset: Vc={vc} m/min, fz={fz} mm/tooth</span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Machining Parameters</h2>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Spindle Speed (n)</p>
                <p className="text-3xl font-black">{results.rpm.toLocaleString()}<span className="text-lg font-bold ml-2 opacity-80">RPM</span></p>
                <p className="text-sm mt-2 opacity-70">n = Vc × 1000 / (π × D)</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Feed Rate (Vf)</p>
                <p className="text-3xl font-black">{results.feedRate.toLocaleString()}<span className="text-lg font-bold ml-2 opacity-80">mm/min</span></p>
                <p className="text-sm mt-2 opacity-70">Vf = fz × z × n</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Chip Load fz', value: results.chipLoad.toFixed(3), unit: 'mm/tooth' },
                { label: 'MRR (slotting)', value: results.mrr.toLocaleString(), unit: 'mm³/min' },
                { label: 'Est. Power', value: results.power.toFixed(2), unit: 'kW' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}<span className="text-base text-slate-400 font-bold ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Material Reference Table */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Recommended Cutting Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider">Material</th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider">Vc (m/min)</th>
                    <th className="text-right py-3 px-2 font-black text-slate-400 uppercase tracking-wider">fz (mm/tooth)</th>
                  </tr>
                </thead>
                <tbody>
                  {MATERIAL_PRESETS.filter(m => m.name !== 'Custom').map((m, i) => (
                    <tr
                      key={m.name}
                      onClick={() => setMaterialIdx(i)}
                      className={`border-b border-slate-50 cursor-pointer transition-all ${materialIdx === i ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3 px-2 font-bold text-slate-700">{m.name}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-600">{m.vc}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-600">{m.fz}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-400 mt-3 font-medium">Values are starting recommendations for HSS/Carbide end mills. Always consult tool manufacturer data and adjust based on rigidity, coolant, and depth of cut.</p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
