'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Shield, AlertTriangle } from 'lucide-react';

const MATERIALS = [
  { name: 'Carbon Steel (SA-516 Gr.70)', stress: 138 },
  { name: 'Stainless Steel (SA-240 304)', stress: 137 },
  { name: 'Stainless Steel (SA-240 316)', stress: 138 },
  { name: 'Aluminum (SB-209 6061-T6)', stress: 60 },
  { name: 'Custom', stress: 138 },
];

export default function PressureVesselClient() {
  const [vesselType, setVesselType] = useState<'cylindrical' | 'spherical'>('cylindrical');
  const [matIdx, setMatIdx] = useState(0);
  const [customStress, setCustomStress] = useState(138);
  const [diameter, setDiameter] = useState(1000);
  const [pressure, setPressure] = useState(10);
  const [efficiency, setEfficiency] = useState(1.0);
  const [corrosion, setCorrosion] = useState(1.5);

  const result = useMemo(() => {
    const S = matIdx === 4 ? customStress : MATERIALS[matIdx].stress;
    const P = pressure;
    const D = diameter;
    const E = efficiency;
    const CA = corrosion;

    let t = 0;
    if (vesselType === 'cylindrical') {
      t = (P * D) / (2 * S * E - P);
    } else {
      t = (P * D) / (4 * S * E - P);
    }

    const tTotal = t + CA;
    const MAWP = vesselType === 'cylindrical'
      ? (2 * S * E * t) / (D + t)
      : (4 * S * E * t) / (D + 2 * t);

    return { t, tTotal, MAWP, S };
  }, [vesselType, matIdx, customStress, diameter, pressure, efficiency, corrosion]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Vessel Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['cylindrical', 'spherical'] as const).map(t => (
                <button key={t} onClick={() => setVesselType(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${vesselType === t ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {t === 'cylindrical' ? 'Cylindrical' : 'Spherical'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select value={matIdx} onChange={e => setMatIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-600/5">
              {MATERIALS.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
            </select>
          </div>

          {matIdx === 4 && (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Allowable Stress (MPa)</label>
              <input type="number" value={customStress} onChange={e => setCustomStress(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Inside Diameter (mm)</label>
            <input type="number" value={diameter} onChange={e => setDiameter(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Design Pressure (bar)</label>
            <input type="number" value={pressure} onChange={e => setPressure(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Joint Efficiency (E)</label>
            <select value={efficiency} onChange={e => setEfficiency(parseFloat(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              <option value={1.0}>1.0 — Full RT</option>
              <option value={0.85}>0.85 — Spot RT</option>
              <option value={0.7}>0.7 — No RT</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Corrosion Allowance (mm)</label>
            <input type="number" step="0.1" value={corrosion} onChange={e => setCorrosion(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">Min. Wall Thickness</div>
                <div className="text-3xl font-black text-red-700">{result.t.toFixed(2)}<span className="text-lg text-red-400"> mm</span></div>
                <div className="text-xs text-red-600 font-medium mt-1">Calculated (excl. CA)</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-2">Total Thickness</div>
                <div className="text-3xl font-black text-orange-700">{result.tTotal.toFixed(2)}<span className="text-lg text-orange-400"> mm</span></div>
                <div className="text-xs text-orange-600 font-medium mt-1">Including {corrosion}mm CA</div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase mb-1">MAWP (bar)</div>
                  <div className="text-xl font-black text-slate-700">{result.MAWP.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase mb-1">Allowable Stress</div>
                  <div className="text-xl font-black text-slate-700">{result.S} MPa</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-start gap-2 text-xs text-amber-700 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                This calculator is for preliminary design only. Pressure vessel design must comply with ASME BPVC and be certified by a licensed engineer. External pressure, wind, seismic, and nozzle loads are not considered.
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {vesselType === 'cylindrical'
                  ? 'Cylindrical: t = PD / (2SE − P). Spherical: t = PD / (4SE − P). MAWP is Maximum Allowable Working Pressure at calculated thickness.'
                  : 'Spherical vessels have half the wall thickness of cylindrical for same P and D. Formula: t = PD / (4SE − P).'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
