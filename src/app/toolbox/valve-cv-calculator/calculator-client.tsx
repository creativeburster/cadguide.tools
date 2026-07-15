'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge } from 'lucide-react';

export default function ValveCvClient() {
  const [fluidType, setFluidType] = useState<'liquid' | 'gas'>('liquid');
  const [flowRate, setFlowRate] = useState(100);
  const [sg, setSg] = useState(1.0);
  const [p1, setP1] = useState(6);
  const [p2, setP2] = useState(4);
  const [temp, setTemp] = useState(20);

  const result = useMemo(() => {
    const Q = flowRate;
    const G = sg;
    const dP = p1 - p2;

    if (fluidType === 'liquid') {
      const cv = Q * Math.sqrt(G / dP);
      return { cv, dP, velocity: null };
    } else {
      const T = temp + 273.15;
      const cv = Q / (22.67 * Math.sqrt(dP * p2 / (G * T)));
      return { cv, dP, velocity: null };
    }
  }, [fluidType, flowRate, sg, p1, p2, temp]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Fluid Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['liquid', 'gas'] as const).map(t => (
                <button key={t} onClick={() => setFluidType(t)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${fluidType === t ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {t === 'liquid' ? 'Liquid' : 'Gas'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">
              Flow Rate ({fluidType === 'liquid' ? 'GPM' : 'SCFH'})
            </label>
            <input type="number" value={flowRate} onChange={e => setFlowRate(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Specific Gravity</label>
            <input type="number" step="0.01" value={sg} onChange={e => setSg(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Inlet Pressure P1 (bar)</label>
            <input type="number" step="0.1" value={p1} onChange={e => setP1(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Outlet Pressure P2 (bar)</label>
            <input type="number" step="0.1" value={p2} onChange={e => setP2(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          {fluidType === 'gas' && (
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Temperature (°C)</label>
              <input type="number" value={temp} onChange={e => setTemp(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Gauge className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100 mb-4">
              <div className="text-base font-black text-teal-400 uppercase tracking-wider mb-2">Required Cv</div>
              <div className="text-4xl font-black text-teal-700">{result.cv.toFixed(2)}</div>
              <div className="text-base text-teal-600 font-medium mt-1">
                {fluidType === 'liquid' ? 'Cv = Q × √(SG/ΔP)' : 'Cv = Q / (22.67 × √(ΔP×P2/(SG×T)))'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Pressure Drop ΔP</div>
                <div className="text-lg font-black text-slate-700">{result.dP.toFixed(2)} bar</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-base font-black text-slate-400 uppercase mb-1">Flow Rate</div>
                <div className="text-lg font-black text-slate-700">{flowRate} {fluidType === 'liquid' ? 'GPM' : 'SCFH'}</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'Cv is the flow coefficient: gallons of water per minute through a valve with 1 psi pressure drop at 60°F. Select a valve with Cv ≥ calculated value. For choking flow (gas), use ISA-75.01 critical flow equations.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
