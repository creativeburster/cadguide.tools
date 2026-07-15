'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge } from 'lucide-react';

const FLUIDS = [
  { name: 'Water (20°C)', rho: 998, mu: 0.001 },
  { name: 'Air (20°C, 1 atm)', rho: 1.204, mu: 0.000018 },
  { name: 'Oil (SAE 30, 20°C)', rho: 892, mu: 0.44 },
  { name: 'Glycerin (20°C)', rho: 1260, mu: 1.49 },
  { name: 'Gasoline (20°C)', rho: 737, mu: 0.0006 },
  { name: 'Custom', rho: 998, mu: 0.001 },
];

export default function ReynoldsClient() {
  const [fluidIdx, setFluidIdx] = useState(0);
  const [customRho, setCustomRho] = useState(998);
  const [customMu, setCustomMu] = useState(0.001);
  const [velocity, setVelocity] = useState(2.0);
  const [diameter, setDiameter] = useState(0.05);

  const result = useMemo(() => {
    const rho = fluidIdx === 5 ? customRho : FLUIDS[fluidIdx].rho;
    const mu = fluidIdx === 5 ? customMu : FLUIDS[fluidIdx].mu;
    const V = velocity;
    const D = diameter;

    const Re = (rho * V * D) / mu;
    let regime = '';
    let color = '';
    if (Re < 2300) { regime = 'Laminar Flow'; color = 'blue'; }
    else if (Re < 4000) { regime = 'Transitional Flow'; color = 'orange'; }
    else { regime = 'Turbulent Flow'; color = 'red'; }

    const frictionFactor = Re < 2300 ? 64 / Re : 0.316 / Math.pow(Re, 0.25);

    return { Re, regime, color, frictionFactor, rho, mu };
  }, [fluidIdx, customRho, customMu, velocity, diameter]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Fluid</label>
            <select value={fluidIdx} onChange={e => setFluidIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {FLUIDS.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
            </select>
          </div>

          {fluidIdx === 5 && (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Density ρ (kg/m³)</label>
                <input type="number" value={customRho} onChange={e => setCustomRho(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Dynamic Viscosity μ (Pa·s)</label>
                <input type="number" step="0.0001" value={customMu} onChange={e => setCustomMu(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flow Velocity (m/s)</label>
            <input type="number" step="0.1" value={velocity} onChange={e => setVelocity(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Diameter (m)</label>
            <input type="number" step="0.001" value={diameter} onChange={e => setDiameter(parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
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

            <div className={`rounded-2xl p-6 border mb-4 ${
              result.color === 'blue' ? 'bg-blue-50 border-blue-100' :
              result.color === 'orange' ? 'bg-orange-50 border-orange-100' :
              'bg-red-50 border-red-100'
            }`}>
              <div className={`text-xs font-black uppercase tracking-wider mb-2 ${
                result.color === 'blue' ? 'text-blue-400' :
                result.color === 'orange' ? 'text-orange-400' : 'text-red-400'
              }`}>Reynolds Number</div>
              <div className={`text-4xl font-black ${
                result.color === 'blue' ? 'text-blue-700' :
                result.color === 'orange' ? 'text-orange-700' : 'text-red-700'
              }`}>
                {result.Re >= 10000 ? result.Re.toExponential(3) : result.Re.toFixed(1)}
              </div>
              <div className={`text-sm font-black mt-2 ${
                result.color === 'blue' ? 'text-blue-600' :
                result.color === 'orange' ? 'text-orange-600' : 'text-red-600'
              }`}>{result.regime}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Friction Factor f</div>
                <div className="text-lg font-black text-slate-700">{result.frictionFactor.toFixed(5)}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Density</div>
                <div className="text-lg font-black text-slate-700">{result.rho} kg/m³</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Viscosity</div>
                <div className="text-lg font-black text-slate-700">{result.mu} Pa·s</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Re = ρVD/μ. Laminar: Re < 2300 (smooth, parallel streamlines). Transitional: 2300 ≤ Re < 4000. Turbulent: Re ≥ 4000 (chaotic mixing). Friction factor: f = 64/Re (laminar), f = 0.316/Re^0.25 (turbulent, Blasius).'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
