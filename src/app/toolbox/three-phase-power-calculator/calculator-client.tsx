'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Zap } from 'lucide-react';

export default function ThreePhaseClient() {
  const [voltage, setVoltage] = useState(400);
  const [power, setPower] = useState(15);
  const [powerFactor, setPowerFactor] = useState(0.85);
  const [efficiency, setEfficiency] = useState(90);
  const [solveMode, setSolveMode] = useState<'kW' | 'amps'>('kW');

  const result = useMemo(() => {
    const V = voltage;
    const PF = powerFactor;
    const eff = efficiency / 100;

    let kW, amps, kVA, kVAR;

    if (solveMode === 'kW') {
      kW = power;
      kVA = kW / PF;
      kVAR = kVA * Math.sin(Math.acos(PF));
      amps = (kW * 1000) / (Math.sqrt(3) * V * PF);
    } else {
      amps = power;
      kVA = (Math.sqrt(3) * V * amps) / 1000;
      kW = kVA * PF;
      kVAR = kVA * Math.sin(Math.acos(PF));
    }

    const motorCurrent = amps / eff;

    return { kW, amps, kVA, kVAR, motorCurrent };
  }, [voltage, power, powerFactor, efficiency, solveMode]);

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
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Solve For</label>
            <div className="grid grid-cols-2 gap-2">
              {(['kW', 'amps'] as const).map(m => (
                <button key={m} onClick={() => setSolveMode(m)}
                  className={`px-3 py-2.5 rounded-xl text-base font-black border transition-all ${solveMode === m ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-100 text-slate-600'}`}>
                  {m === 'kW' ? 'Power → Amps' : 'Amps → Power'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Line Voltage (V)</label>
            <input type="number" value={voltage} onChange={e => setVoltage(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">
              {solveMode === 'kW' ? 'Real Power (kW)' : 'Line Current (A)'}
            </label>
            <input type="number" value={power} onChange={e => setPower(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Power Factor</label>
            <input type="number" step="0.01" value={powerFactor} onChange={e => setPowerFactor(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Motor Efficiency (%)</label>
            <input type="number" value={efficiency} onChange={e => setEfficiency(parseFloat(e.target.value) || 0)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Real Power</div>
                <div className="text-3xl font-black text-purple-700">{result.kW.toFixed(2)}<span className="text-lg text-purple-400"> kW</span></div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Line Current</div>
                <div className="text-3xl font-black text-blue-700">{result.amps.toFixed(2)}<span className="text-lg text-blue-400"> A</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Apparent Power</div>
                <div className="text-3xl font-black text-orange-700">{result.kVA.toFixed(2)}<span className="text-lg text-orange-400"> kVA</span></div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-base font-black text-red-400 uppercase tracking-wider mb-2">Reactive Power</div>
                <div className="text-3xl font-black text-red-700">{result.kVAR.toFixed(2)}<span className="text-lg text-red-400"> kVAR</span></div>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Motor Input Current</div>
                  <div className="text-xl font-black text-slate-700">{result.motorCurrent.toFixed(2)} A</div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase mb-1">Power Factor Angle</div>
                  <div className="text-xl font-black text-slate-700">{(Math.acos(powerFactor) * 180 / Math.PI).toFixed(1)}°</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'I = P×1000 / (√3 × V × PF). kVA = kW / PF. kVAR = kVA × sin(φ). Motor current = line current / efficiency. For 3-phase 400V at PF=0.85, 15kW draws ~25.5A.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
