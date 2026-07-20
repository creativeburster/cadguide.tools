'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info } from 'lucide-react';

export default function PavementThicknessCalculatorClient() {
  const [esals, setEsals] = useState('500000');
  const [reliability, setReliability] = useState('90');
  const [standardDev, setStandardDev] = useState('0.45');
  const [serviceabilityLoss, setServiceabilityLoss] = useState('2.0');
  const [subgradeMR, setSubgradeMR] = useState('30');
  const [surfaceCoeff, setSurfaceCoeff] = useState('0.44');
  const [baseCoeff, setBaseCoeff] = useState('0.14');
  const [subbaseCoeff, setSubbaseCoeff] = useState('0.11');
  const [drainageCoeff, setDrainageCoeff] = useState('1.0');

  const result = useMemo(() => {
    const W18 = parseFloat(esals);
    const R = parseFloat(reliability) / 100;
    const S0 = parseFloat(standardDev);
    const dPSI = parseFloat(serviceabilityLoss);
    const MR = parseFloat(subgradeMR);
    const a1 = parseFloat(surfaceCoeff);
    const a2 = parseFloat(baseCoeff);
    const a3 = parseFloat(subbaseCoeff);
    const m = parseFloat(drainageCoeff);

    if (!W18 || !MR || !a1 || !a2 || !a3 || W18 <= 0 || MR <= 0) return null;

    const ZR = { 0.5: 0, 0.85: -1.036, 0.9: -1.282, 0.95: -1.645, 0.99: -2.327 }[R] ?? -1.282;

    const logW = Math.log10(W18);
    const term = ZR * S0 + 9.46 * Math.log10(MR) - 8.27 - 5.19 * Math.log10(dPSI);

    let SN = 1.0;
    for (let i = 0; i < 50; i++) {
      const f = Math.log10(logW) - 9.46 * Math.log10(MR) + 8.27 + 5.19 * Math.log10(dPSI) - ZR * S0;
      SN = Math.pow(10, f / 7.0);
    }

    const D1 = SN / (a1 * m);
    const remainingSN1 = Math.max(0, SN - a1 * D1 * m);
    const D2 = remainingSN1 / (a2 * m);
    const remainingSN2 = Math.max(0, remainingSN1 - a2 * D2 * m);
    const D3 = remainingSN2 / (a3 * m);

    return {
      SN,
      D1: Math.max(D1, 25),
      D2: Math.max(D2, 100),
      D3: Math.max(D3, 150),
    };
  }, [esals, reliability, standardDev, serviceabilityLoss, subgradeMR, surfaceCoeff, baseCoeff, subbaseCoeff, drainageCoeff]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 1000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 10) return n.toFixed(1);
    return n.toFixed(2);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Design Inputs</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">ESALs (18-kip loads)</label>
            <input type="text" value={esals} onChange={e => setEsals(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Reliability (%)</label>
            <select value={reliability} onChange={e => setReliability(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all">
              <option value="85">85% (Local roads)</option>
              <option value="90">90% (Collector)</option>
              <option value="95">95% (Arterial)</option>
              <option value="99">99% (Interstate)</option>
            </select>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Standard Deviation</label>
            <input type="text" value={standardDev} onChange={e => setStandardDev(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Serviceability Loss (ΔPSI)</label>
            <input type="text" value={serviceabilityLoss} onChange={e => setServiceabilityLoss(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Subgrade MR (MPa)</label>
            <input type="text" value={subgradeMR} onChange={e => setSubgradeMR(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider">Layer Coefficients</div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Surface (a₁) — Asphalt</label>
              <input type="text" value={surfaceCoeff} onChange={e => setSurfaceCoeff(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Base (a₂) — Aggregate</label>
              <input type="text" value={baseCoeff} onChange={e => setBaseCoeff(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Subbase (a₃)</label>
              <input type="text" value={subbaseCoeff} onChange={e => setSubbaseCoeff(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-1">Drainage (m)</label>
              <input type="text" value={drainageCoeff} onChange={e => setDrainageCoeff(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all" />
            </div>
          </div>

          <button onClick={() => { setEsals('500000'); setReliability('90'); setStandardDev('0.45'); setServiceabilityLoss('2.0'); setSubgradeMR('30'); setSurfaceCoeff('0.44'); setBaseCoeff('0.14'); setSubbaseCoeff('0.11'); setDrainageCoeff('1.0'); }}
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

            {result ? (
              <>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-4">
                  <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Required Structural Number (SN)</div>
                  <div className="text-4xl font-black text-blue-700">{formatNum(result.SN)}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-base font-black text-orange-400 uppercase tracking-wider mb-2">Surface D₁</div>
                    <div className="text-3xl font-black text-orange-700">{formatNum(result.D1)}<span className="text-lg text-orange-400"> mm</span></div>
                    <div className="text-sm text-orange-400 font-bold mt-1">Asphalt</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-base font-black text-green-400 uppercase tracking-wider mb-2">Base D₂</div>
                    <div className="text-3xl font-black text-green-700">{formatNum(result.D2)}<span className="text-lg text-green-400"> mm</span></div>
                    <div className="text-sm text-green-400 font-bold mt-1">Aggregate</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="text-base font-black text-purple-400 uppercase tracking-wider mb-2">Subbase D₃</div>
                    <div className="text-3xl font-black text-purple-700">{formatNum(result.D3)}<span className="text-lg text-purple-400"> mm</span></div>
                    <div className="text-sm text-purple-400 font-bold mt-1">Granular</div>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="text-sm text-slate-500 font-medium">
                    Total pavement depth: {formatNum(result.D1 + result.D2 + result.D3)} mm
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold">Enter valid parameters to calculate</div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-base text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                AASHTO 1993: SN = a₁D₁m₁ + a₂D₂m₂ + a₃D₃m₃, solve iteratively for required SN
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
