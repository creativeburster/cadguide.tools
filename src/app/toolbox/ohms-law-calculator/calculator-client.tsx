'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Zap } from 'lucide-react';

export default function OhmsLawClient() {
  const [voltage, setVoltage] = useState<string>('12');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [power, setPower] = useState<string>('');

  const result = useMemo(() => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const R = parseFloat(resistance);
    const P = parseFloat(power);

    const hasV = !isNaN(V);
    const hasI = !isNaN(I);
    const hasR = !isNaN(R);
    const hasP = !isNaN(P);
    const count = [hasV, hasI, hasR, hasP].filter(Boolean).length;

    let v = V, i = I, r = R, p = P;

    if (count >= 2) {
      if (hasV && hasI) { r = V / I; p = V * I; }
      else if (hasV && hasR) { i = V / R; p = V * V / R; }
      else if (hasV && hasP) { i = P / V; r = V * V / P; }
      else if (hasI && hasR) { v = I * R; p = I * I * R; }
      else if (hasI && hasP) { v = P / I; r = P / (I * I); }
      else if (hasR && hasP) { i = Math.sqrt(P / R); v = Math.sqrt(P * R); }
    }

    return { v: isNaN(v) ? 0 : v, i: isNaN(i) ? 0 : i, r: isNaN(r) ? 0 : r, p: isNaN(p) ? 0 : p, count };
  }, [voltage, current, resistance, power]);

  const fields = [
    { label: 'Voltage (V)', unit: 'V', value: voltage, setter: setVoltage, color: 'yellow', result: result.v },
    { label: 'Current (I)', unit: 'A', value: current, setter: setCurrent, color: 'blue', result: result.i },
    { label: 'Resistance (R)', unit: 'Ω', value: resistance, setter: setResistance, color: 'orange', result: result.r },
    { label: 'Power (P)', unit: 'W', value: power, setter: setPower, color: 'red', result: result.p },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Input (any 2)</h2>
          </div>

          {fields.map(f => (
            <div key={f.label}>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.setter(e.target.value)} placeholder="—"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-yellow-600/5 focus:bg-white transition-all" />
            </div>
          ))}

          <button onClick={() => { setVoltage(''); setCurrent(''); setResistance(''); setPower(''); }}
            className="w-full py-3 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Clear All
          </button>
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
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2">Voltage</div>
                <div className="text-3xl font-black text-yellow-700">{result.v.toFixed(4)}<span className="text-lg text-yellow-400"> V</span></div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2">Current</div>
                <div className="text-3xl font-black text-blue-700">{result.i.toFixed(4)}<span className="text-lg text-blue-400"> A</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-2">Resistance</div>
                <div className="text-3xl font-black text-orange-700">{result.r.toFixed(4)}<span className="text-lg text-orange-400"> Ω</span></div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-xs font-black text-red-400 uppercase tracking-wider mb-2">Power</div>
                <div className="text-3xl font-black text-red-700">{result.p.toFixed(4)}<span className="text-lg text-red-400"> W</span></div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                {'V = I × R. P = V × I = I² × R = V²/R. Enter any two known values; the calculator solves for all four. Leave unknown fields blank.'}
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
