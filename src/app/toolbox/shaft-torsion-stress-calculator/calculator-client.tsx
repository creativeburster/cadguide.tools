'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge } from 'lucide-react';

const MATERIALS = [
  { name: 'Steel (E=200 GPa, G=77 GPa)', G: 77, yield: 250 },
  { name: 'Stainless 304 (G=73 GPa)', G: 73, yield: 215 },
  { name: 'Aluminum 6061 (G=26 GPa)', G: 26, yield: 276 },
  { name: 'Titanium (G=44 GPa)', G: 44, yield: 880 },
  { name: 'Brass (G=37 GPa)', G: 37, yield: 310 },
];

export default function ShaftTorsionClient() {
  const [shaftType, setShaftType] = useState<'solid' | 'hollow'>('solid');
  const [matIdx, setMatIdx] = useState(0);
  const [outerDia, setOuterDia] = useState(40);
  const [innerDia, setInnerDia] = useState(20);
  const [length, setLength] = useState(500);
  const [torque, setTorque] = useState(100);
  const [power, setPower] = useState(5);
  const [rpm, setRPM] = useState(1500);
  const [inputMode, setInputMode] = useState<'torque' | 'power'>('torque');

  const result = useMemo(() => {
    const G = MATERIALS[matIdx].G * 1e3;
    const yieldStrength = MATERIALS[matIdx].yield;
    const D = outerDia / 1000;
    const d = innerDia / 1000;
    const L = length / 1000;

    let J = 0;
    if (shaftType === 'solid') {
      J = Math.PI * Math.pow(D, 4) / 32;
    } else {
      J = Math.PI * (Math.pow(D, 4) - Math.pow(d, 4)) / 32;
    }

    const Zp = J / (D / 2);

    const T = inputMode === 'torque' ? torque : (power * 60 * 1000) / (2 * Math.PI * rpm);

    const shearStress = (T * (D / 2)) / J;
    const twistAngle = (T * L) / (G * J * 1e6) * (180 / Math.PI);
    const safetyFactor = shearStress > 0 ? yieldStrength / shearStress / 0.577 : 999;

    return { J, Zp, T, shearStress, twistAngle, safetyFactor, G };
  }, [shaftType, matIdx, outerDia, innerDia, length, torque, power, rpm, inputMode]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Shaft Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['solid', 'hollow'] as const).map(t => (
                <button key={t} onClick={() => setShaftType(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${shaftType === t ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {t === 'solid' ? 'Solid' : 'Hollow'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select value={matIdx} onChange={e => setMatIdx(parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {MATERIALS.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Outer Diameter (mm)</label>
            <input type="number" value={outerDia} onChange={e => setOuterDia(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          {shaftType === 'hollow' && (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Inner Diameter (mm)</label>
              <input type="number" value={innerDia} onChange={e => setInnerDia(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          )}

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Length (mm)</label>
            <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Input Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['torque', 'power'] as const).map(m => (
                <button key={m} onClick={() => setInputMode(m)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${inputMode === m ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                  {m === 'torque' ? 'Torque (Nm)' : 'Power (kW)'}
                </button>
              ))}
            </div>
          </div>

          {inputMode === 'torque' ? (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Torque (Nm)</label>
              <input type="number" value={torque} onChange={e => setTorque(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Power (kW)</label>
                <input type="number" value={power} onChange={e => setPower(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Speed (RPM)</label>
                <input type="number" value={rpm} onChange={e => setRPM(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" />
              </div>
            </>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">Shear Stress</div>
                <div className="text-3xl font-black text-red-700">{result.shearStress.toFixed(1)}<span className="text-lg text-red-400"> MPa</span></div>
                <div className="text-xs text-red-600 font-medium mt-1">τ = T×r / J</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Twist Angle</div>
                <div className="text-3xl font-black text-blue-700">{result.twistAngle.toFixed(3)}<span className="text-lg text-blue-400">°</span></div>
                <div className="text-xs text-blue-600 font-medium mt-1">θ = TL / (GJ)</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Applied Torque</div>
                <div className="text-lg font-black text-slate-700">{result.T.toFixed(1)} Nm</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Polar Inertia J</div>
                <div className="text-lg font-black text-slate-700">{(result.J * 1e12).toFixed(0)} mm⁴</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Safety Factor</div>
                <div className={`text-lg font-black ${result.safetyFactor > 2 ? 'text-green-600' : result.safetyFactor > 1 ? 'text-orange-600' : 'text-red-600'}`}>
                  {result.safetyFactor > 999 ? '∞' : result.safetyFactor.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Solid: J = πD⁴/32. Hollow: J = π(D⁴−d⁴)/32. Shear stress τ = T×r/J. Twist angle θ = TL/(GJ) in radians, converted to degrees. Safety factor uses distortion energy theory (0.577×yield).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
