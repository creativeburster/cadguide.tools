'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function PlanetaryGearCalculatorClient() {
  const [inputs, setInputs] = useState(["20","60","20","ring-fixed"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const zs = parseFloat(inputs[0]) || 20;
    const zr = parseFloat(inputs[1]) || 60;
    const zp = parseFloat(inputs[2]) || 20;
    const cfg = inputs[3];

    let ratio = 1;
    if (cfg === 'ring-fixed') {
      ratio = (zs + zr) / zs; // Sun in, Carrier out
    } else if (cfg === 'sun-fixed') {
      ratio = (zs + zr) / zr; // Ring in, Carrier out
    } else {
      ratio = -zr / zs; // Carrier fixed, Sun in, Ring out (reverse direction)
    }

    // Engineering Concentricity Condition for standard 2K-H gearsets: zr = zs + 2 * zp
    const reqZp = (zr - zs) / 2;
    const isConcentric = Math.abs(zr - (zs + 2 * zp)) < 0.001;

    // 3-Planet Assembly Condition: (zs + zr) % 3 === 0
    const is3PlanetAssemblable = (Math.round(zs) + Math.round(zr)) % 3 === 0;

    // Relative spin ratio of planet on carrier:
    const planetSpinRatio = zp > 0 ? zs / zp : 0;

    return {
      ratio,
      sr: ratio !== 0 ? 1 / ratio : 0,
      reqZp,
      zp,
      isConcentric,
      is3PlanetAssemblable,
      planetSpinRatio
    };
  }, [inputs]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(6);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Sun Teeth</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Ring Teeth</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="60"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Planet Teeth</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Config</label>
            <select value={inputs[3]} onChange={e => updateInput(3, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
              <option value="ring-fixed">Ring Fixed (Sun In / Carrier Out)</option>
              <option value="sun-fixed">Sun Fixed (Ring In / Carrier Out)</option>
              <option value="carrier-fixed">Carrier Fixed (Sun In / Ring Out)</option>
            </select>
          </div>

          <button onClick={() => setInputs(["20","60","20","ring-fixed"])}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
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
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Overall Gear Ratio</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(Math.abs(result.ratio))}<span className="text-lg text-blue-400"> :1</span></div>
                <div className="text-xs text-blue-500 font-medium mt-1">{result.ratio < 0 ? 'Reverse rotation' : 'Forward rotation'}</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Planet Spin Ratio</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.planetSpinRatio)}<span className="text-lg text-green-400"> :1</span></div>
                <div className="text-xs text-green-500 font-medium mt-1">Relative to carrier (zs / zp)</div>
              </div>
              <div className={`col-span-2 rounded-2xl p-4 border ${result.isConcentric ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                <div className="text-xs font-black uppercase tracking-wider mb-1">Concentricity Condition (zr = zs + 2·zp)</div>
                <div className="text-sm font-bold">
                  {result.isConcentric
                    ? `✓ Concentric: Ring (${inputs[1]}) = Sun (${inputs[0]}) + 2 × Planet (${inputs[2]})`
                    : `⚠️ Non-concentric: Required zp = ${result.reqZp} for standard gears (Current zp = ${result.zp})`}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Willis Equation: (ω_s - ω_c) / (ω_r - ω_c) = -z_r / z_s • Assembly condition: (z_s + z_r) / N_planets = integer
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
