'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download, Gauge } from 'lucide-react';

export default function HydraulicCylinderClient() {
  const [bore, setBore] = useState(80);
  const [rodDia, setRodDia] = useState(40);
  const [pressure, setPressure] = useState(200);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const result = useMemo(() => {
    const D = unit === 'metric' ? bore / 1000 : bore / 12;
    const d = unit === 'metric' ? rodDia / 1000 : rodDia / 12;
    const P = unit === 'metric' ? pressure * 1e6 : pressure * 6894.76;

    const fullArea = Math.PI * D * D / 4;
    const rodArea = Math.PI * d * d / 4;
    const annulusArea = fullArea - rodArea;

    const pushForce = P * fullArea;
    const pullForce = P * annulusArea;

    const forceUnit = unit === 'metric' ? 'N' : 'lbf';
    const areaUnit = unit === 'metric' ? 'm²' : 'in²';

    return {
      fullArea, rodArea, annulusArea,
      pushForce, pullForce,
      forceUnit, areaUnit,
      pullReduction: ((1 - pullForce / pushForce) * 100).toFixed(1),
    };
  }, [bore, rodDia, pressure, unit]);

  const fmtForce = (f: number) => {
    if (unit === 'metric') {
      return f > 10000 ? `${(f / 1000).toFixed(2)} kN` : `${f.toFixed(0)} N`;
    }
    return `${(f).toFixed(0)} lbf`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Unit System</label>
            <div className="grid grid-cols-2 gap-2">
              {(['metric', 'imperial'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${unit === u ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {u === 'metric' ? 'Metric (mm, bar)' : 'Imperial (in, psi)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Bore Diameter ({unit === 'metric' ? 'mm' : 'in'})</label>
            <input type="number" value={bore} onChange={e => setBore(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Rod Diameter ({unit === 'metric' ? 'mm' : 'in'})</label>
            <input type="number" value={rodDia} onChange={e => setRodDia(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Pressure ({unit === 'metric' ? 'bar' : 'psi'})</label>
            <input type="number" value={pressure} onChange={e => setPressure(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
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
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Push Force (Extension)</div>
                <div className="text-3xl font-black text-blue-700">{fmtForce(result.pushForce)}</div>
                <div className="text-xs text-blue-600 font-medium mt-1">F = P × π×D²/4</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-2">Pull Force (Retraction)</div>
                <div className="text-3xl font-black text-orange-700">{fmtForce(result.pullForce)}</div>
                <div className="text-xs text-orange-600 font-medium mt-1">F = P × π×(D²−d²)/4</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Full Area</div>
                <div className="text-lg font-black text-slate-700">{(result.fullArea * 1e6).toFixed(2)} mm²</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Annulus Area</div>
                <div className="text-lg font-black text-slate-700">{(result.annulusArea * 1e6).toFixed(2)} mm²</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Pull Reduction</div>
                <div className="text-lg font-black text-slate-700">{result.pullReduction}%</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Push force uses full piston area. Pull force uses annulus area (piston minus rod). The rod reduces effective area during retraction, resulting in lower pull force at the same pressure.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
