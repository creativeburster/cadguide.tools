'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function WaterHammerCalculatorClient() {
  const [inputs, setInputs] = useState(["2","500","1","2.2","1000"]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const v = parseFloat(inputs[0]) || 0; // Flow velocity (m/s)
    const L = parseFloat(inputs[1]) || 0; // Pipe length (m)
    const tc = parseFloat(inputs[2]) || 1; // Valve closure time (s)
    const K = (parseFloat(inputs[3]) || 2.2) * 1e9; // Bulk modulus (Pa)
    const rho = parseFloat(inputs[4]) || 1000; // Fluid density (kg/m³)

    // Acoustic wave propagation speed a = sqrt(K / rho) in m/s
    const a = rho > 0 ? Math.sqrt(K / rho) : 1480;

    // Critical pipeline phase reflection time: tcrit = 2 * L / a (seconds)
    const tcrit = a > 0 ? (2 * L) / a : 0;

    // Full Joukowsky instantaneous / direct surge pressure: ΔP_max = rho * a * v (kPa)
    const dPDirect = (rho * a * v) / 1000;

    // Actual effective surge pressure:
    // If tc <= tcrit: Rapid / Direct water hammer (full Joukowsky surge)
    // If tc > tcrit: Slow / Indirect water hammer, reduced by (tcrit / tc)
    const isDirectHammer = tc <= tcrit || tc <= 0;
    const reductionFactor = isDirectHammer ? 1 : tcrit / tc;
    const dPEffective = dPDirect * reductionFactor;

    // Head surge in meters of water column: ΔH = ΔP / (rho * g)
    const headSurgeM = (dPEffective * 1000) / (rho * 9.80665);

    return {
      dP: dPEffective,
      dPDirect,
      a,
      tcrit,
      tc,
      isDirectHammer,
      reductionFactor,
      headSurgeM
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
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div key="0">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Flow Velocity (m/s)</label>
            <input type="text" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} placeholder="2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Pipe Length (m)</label>
            <input type="text" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} placeholder="500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Valve Close Time (s)</label>
            <input type="text" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} placeholder="1"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="3">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Bulk Modulus K (GPa)</label>
            <input type="text" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} placeholder="2.2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>
          <div key="4">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Density (kg/m3)</label>
            <input type="text" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} placeholder="1000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all" />
          </div>

          <button onClick={() => setInputs(["2","500","1","2.2","1000"])}
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
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Effective Surge (ΔP)</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.dP)}<span className="text-lg text-blue-400"> kPa</span></div>
                <div className="text-xs text-blue-500 font-medium mt-1">Joukowsky Peak: {formatNum(result.dPDirect)} kPa</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Equivalent Surge Head</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.headSurgeM)}<span className="text-lg text-green-400"> m</span></div>
                <div className="text-xs text-green-500 font-medium mt-1">Column of water</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Acoustic Wave Speed (a)</div>
                <div className="text-xl font-black text-purple-700">{formatNum(result.a)}<span className="text-sm font-medium text-purple-500"> m/s</span></div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Critical Closure Time (2L/a)</div>
                <div className="text-xl font-black text-orange-700">{formatNum(result.tcrit)}<span className="text-sm font-medium text-orange-500"> s</span></div>
              </div>
              <div className={`col-span-2 rounded-2xl p-4 border ${result.isDirectHammer ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                <div className="text-xs font-black uppercase tracking-wider mb-1">Closure Regime Classification</div>
                <div className="text-sm font-bold">
                  {result.isDirectHammer
                    ? `⚠️ Direct / Rapid Closure (tc = ${inputs[2]}s ≤ tcrit = ${formatNum(result.tcrit)}s): Full Joukowsky shock wave develops`
                    : `✓ Indirect / Slow Closure (tc = ${inputs[2]}s > tcrit = ${formatNum(result.tcrit)}s): Pressure attenuated by ${(result.reductionFactor * 100).toFixed(1)}%`}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Joukowsky Law: ΔP = ρ·a·v (Rapid) • Michaud: ΔP_slow = ΔP·(2L / a·tc) = 2·ρ·L·v / tc (Slow)
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
