'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Info } from 'lucide-react';

// Thermal expansion coefficients (µm/m·°C) and elastic moduli (GPa) per ASME B31.3 Appendix C
const MATERIALS = [
  { name: 'Carbon Steel (CS)', alpha: 11.2e-6, E: 200e3, yield: 235, color: '#3b82f6' },
  { name: 'Stainless Steel (304)', alpha: 16.6e-6, E: 193e3, yield: 205, color: '#10b981' },
  { name: 'Stainless Steel (316)', alpha: 16.0e-6, E: 193e3, yield: 205, color: '#06b6d4' },
  { name: 'Copper', alpha: 16.4e-6, E: 110e3, yield: 70, color: '#f59e0b' },
  { name: 'Aluminum (6061)', alpha: 23.6e-6, E: 69e3, yield: 145, color: '#8b5cf6' },
  { name: 'Custom', alpha: 12e-6, E: 200e3, yield: 235, color: '#64748b' },
];

export default function PipeExpansionClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [customAlpha, setCustomAlpha] = useState(12);
  const [customE, setCustomE] = useState(200);
  const [length, setLength] = useState(10); // meters
  const [tempChange, setTempChange] = useState(100); // °C
  const [pipeOD, setPipeOD] = useState(114.3); // mm (4" NPS)
  const [wallThk, setWallThk] = useState(6.02); // mm (Sch 40)

  const mat = MATERIALS[materialIdx];
  const alpha = materialIdx === 5 ? customAlpha * 1e-6 : mat.alpha;
  const E = materialIdx === 5 ? customE * 1e3 : mat.E;

  const results = useMemo(() => {
    const L = length; // m
    const dT = tempChange; // °C
    const D = pipeOD; // mm
    const thk = wallThk; // mm

    // Thermal expansion: ΔL = α × L × ΔT
    const deltaL_mm = alpha * L * dT * 1000; // convert m to mm
    const deltaL_mm_per_m = alpha * dT * 1000;

    // Cross-section area of pipe wall
    const innerD = Math.max(1, D - 2 * thk);
    const area_mm2 = (Math.PI / 4) * (D * D - innerD * innerD);
    const area_m2 = area_mm2 / 1_000_000;

    // If pipe is fully restrained (fixed at both ends), the thermal stress is:
    // σ = E × α × ΔT (in MPa, since E is in MPa)
    const thermalStress = E * alpha * dT; // MPa

    // Anchor force = σ × A
    const anchorForce = thermalStress * area_m2 / 1000; // kN

    // Allowable stress (simplified: 2/3 yield for expansion per B31.3)
    const allowableStress = (mat.yield * 2 / 3);
    const stressRatio = thermalStress / allowableStress;

    // Check if expansion stress exceeds allowable
    const isSafe = thermalStress <= allowableStress;

    return {
      deltaL_mm: deltaL_mm.toFixed(2),
      deltaL_mm_per_m: deltaL_mm_per_m.toFixed(3),
      thermalStress: thermalStress.toFixed(1),
      anchorForce: anchorForce.toFixed(2),
      area_mm2: area_mm2.toFixed(0),
      allowableStress: allowableStress.toFixed(0),
      stressRatio: (stressRatio * 100).toFixed(1),
      isSafe,
    };
  }, [alpha, E, length, tempChange, pipeOD, wallThk, mat.yield]);

  const downloadCsv = () => {
    const csv = [
      ['Pipe Thermal Expansion Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Material', mat.name],
      ['', ''],
      ['Input Parameters', ''],
      ['Pipe Length (m)', length],
      ['Temperature Change ΔT (°C)', tempChange],
      ['Pipe OD (mm)', pipeOD],
      ['Wall Thickness (mm)', wallThk],
      ['Thermal Expansion Coefficient α (1/°C)', alpha.toExponential(4)],
      ['Elastic Modulus E (MPa)', E],
      ['', ''],
      ['Calculated Results', ''],
      ['Expansion ΔL (mm)', results.deltaL_mm],
      ['Expansion per Meter (mm/m)', results.deltaL_mm_per_m],
      ['Thermal Stress σ (MPa, fully restrained)', results.thermalStress],
      ['Anchor Force (kN, fully restrained)', results.anchorForce],
      ['Pipe Wall Area (mm²)', results.area_mm2],
      ['Allowable Stress (MPa)', results.allowableStress],
      ['Stress Ratio (%)', results.stressRatio],
      ['Status', results.isSafe ? 'PASS' : 'EXCEEDS ALLOWABLE'],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe-thermal-expansion.csv';
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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Material</label>
            <select
              value={materialIdx}
              onChange={e => setMaterialIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              {MATERIALS.map((m, i) => (
                <option key={m.name} value={i}>{m.name}</option>
              ))}
            </select>
          </div>

          {materialIdx === 5 && (
            <>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">α (×10⁻⁶ /°C)</label>
                <input type="number" step="0.1" value={customAlpha} onChange={e => setCustomAlpha(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">E (GPa)</label>
                <input type="number" step="1" value={customE} onChange={e => setCustomE(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </>
          )}

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Length (m)</label>
            <input type="number" step="0.5" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Temperature Change ΔT (°C)</label>
            <input type="number" step="5" value={tempChange} onChange={e => setTempChange(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[50, 100, 150, 200, 300].map(t => (
                <button key={t} onClick={() => setTempChange(t)} className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all">ΔT {t}°C</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe OD (mm)</label>
            <input type="number" step="1" value={pipeOD} onChange={e => setPipeOD(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[{l:'2"',v:60.3},{l:'4"',v:114.3},{l:'6"',v:168.3},{l:'8"',v:219.1}].map(s => (
                <button key={s.v} onClick={() => setPipeOD(s.v)} className="px-2.5 py-1 rounded-lg text-sm font-bold bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-all">NPS {s.l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wall Thickness (mm)</label>
            <input type="number" step="0.1" value={wallThk} onChange={e => setWallThk(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Expansion Results</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Thermal Expansion ΔL</p>
                <p className="text-3xl font-black">{results.deltaL_mm}<span className="text-lg font-bold ml-2 opacity-80">mm</span></p>
                <p className="text-sm mt-2 opacity-70">ΔL = α × L × ΔT</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Expansion per Meter</p>
                <p className="text-3xl font-black">{results.deltaL_mm_per_m}<span className="text-lg font-bold ml-2 opacity-80">mm/m</span></p>
                <p className="text-sm mt-2 opacity-70">α × ΔT × 1000</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Thermal Stress (restrained)', value: results.thermalStress, unit: 'MPa' },
                { label: 'Anchor Force (restrained)', value: results.anchorForce, unit: 'kN' },
                { label: 'Pipe Wall Area', value: results.area_mm2, unit: 'mm²' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}<span className="text-base text-slate-400 font-bold ml-1">{item.unit}</span></p>
                </div>
              ))}
            </div>

            {/* Safety Check */}
            <div className={`rounded-2xl p-5 border-2 ${results.isSafe ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${results.isSafe ? 'bg-emerald-500' : 'bg-red-500'} text-white text-lg font-black`}>
                  {results.isSafe ? '✓' : '!'}
                </div>
                <div>
                  <p className={`text-lg font-black ${results.isSafe ? 'text-emerald-700' : 'text-red-700'}`}>
                    {results.isSafe ? 'Within Allowable Stress' : 'EXCEEDS Allowable Stress'}
                  </p>
                  <p className="text-base text-slate-500 font-medium mt-0.5">
                    Stress ratio: {results.stressRatio}% of allowable ({results.allowableStress} MPa per ASME B31.3)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Pipe Expansion */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Pipe Expansion Visualization</h3>
            <svg viewBox="0 0 500 120" className="w-full">
              {/* Cold pipe */}
              <rect x="50" y="40" width="400" height="30" rx="4" fill="#93c5fd" opacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="250" y="35" className="fill-blue-600 text-sm font-bold text-center">Cold (reference)</text>
              {/* Hot pipe (expanded) */}
              {(() => {
                const expansion = Math.min(parseFloat(results.deltaL_mm) * 2, 80);
                return (
                  <>
                    <rect x="50" y="75" width={400 + expansion} height="30" rx="4" fill="#fca5a5" opacity="0.4" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1={450} y1="70" x2={450 + expansion} y2="70" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x={450 + expansion / 2} y="68" className="fill-red-500 text-sm font-bold">ΔL={results.deltaL_mm}mm</text>
                  </>
                );
              })()}
              {/* Anchors */}
              <rect x="44" y="35" width="8" height="80" fill="#1e293b" rx="2" />
              <rect x="448" y="35" width="8" height="80" fill="#1e293b" rx="2" />
              <text x="48" y="130" className="fill-slate-600 text-[8px] font-bold">Anchor</text>
              <text x="448" y="130" className="fill-slate-600 text-[8px] font-bold">Anchor</text>
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
                </marker>
              </defs>
            </svg>
            <div className="mt-3 flex items-start gap-2 text-sm text-slate-400 font-medium">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Stress and force values assume the pipe is fully restrained (both ends fixed). If unrestrained, the pipe expands freely and stress is zero. Use expansion loops or joints if allowable stress is exceeded.</span>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
