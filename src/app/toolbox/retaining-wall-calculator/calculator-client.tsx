'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RetainingWallResult {
  valid: boolean;
  error?: string;
  ka: number;
  kp: number;
  paSoilKnM: number;
  paSurchargeKnM: number;
  paTotalKnM: number;
  overturnMomentKnMm: number;
  ppPassiveKnM: number;
}

function solveRetainingWall(
  gammaStr: string,
  heightStr: string,
  phiDegStr: string,
  surchargeStr: string
): RetainingWallResult {
  if ([gammaStr, heightStr, phiDegStr, surchargeStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All soil unit weight, wall height, friction angle, and surcharge inputs are required.', ka: 0, kp: 0, paSoilKnM: 0, paSurchargeKnM: 0, paTotalKnM: 0, overturnMomentKnMm: 0, ppPassiveKnM: 0 };
  }
  const gamma = Number(gammaStr);
  const H = Number(heightStr);
  const phiDeg = Number(phiDegStr);
  const q = Number(surchargeStr);

  if (![gamma, H, phiDeg, q].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', ka: 0, kp: 0, paSoilKnM: 0, paSurchargeKnM: 0, paTotalKnM: 0, overturnMomentKnMm: 0, ppPassiveKnM: 0 };
  }
  if (gamma <= 0 || H <= 0 || phiDeg <= 0 || phiDeg >= 60 || q < 0) {
    return { valid: false, error: 'Require gamma > 0, H > 0, 0 < phi < 60 deg, and surcharge q >= 0.', ka: 0, kp: 0, paSoilKnM: 0, paSurchargeKnM: 0, paTotalKnM: 0, overturnMomentKnMm: 0, ppPassiveKnM: 0 };
  }

  const phiRad = (phiDeg * Math.PI) / 180;
  const sinPhi = Math.sin(phiRad);
  const ka = (1 - sinPhi) / (1 + sinPhi);
  const kp = (1 + sinPhi) / (1 - sinPhi);

  const paSoilKnM = 0.5 * ka * gamma * H * H;
  const paSurchargeKnM = ka * q * H;
  const paTotalKnM = paSoilKnM + paSurchargeKnM;
  const overturnMomentKnMm = paSoilKnM * (H / 3) + paSurchargeKnM * (H / 2);
  const ppPassiveKnM = 0.5 * kp * gamma * H * H;

  return { valid: true, ka, kp, paSoilKnM, paSurchargeKnM, paTotalKnM, overturnMomentKnMm, ppPassiveKnM };
}

export default function RetainingWallCalculatorClient() {
  const [gammaStr, setGammaStr] = useState('18');
  const [heightStr, setHeightStr] = useState('4');
  const [phiStr, setPhiStr] = useState('30');
  const [qStr, setQStr] = useState('10');

  const res = solveRetainingWall(gammaStr, heightStr, phiStr, qStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Rankine Lateral Earth Pressure Report', ''],
      ['Soil Unit Weight gamma (kN/m^3)', gammaStr],
      ['Wall Height H (m)', heightStr],
      ['Internal Friction Angle phi (deg)', phiStr],
      ['Surface Surcharge q (kPa)', qStr],
      ['Rankine Active Coefficient Ka', res.ka.toFixed(6)],
      ['Rankine Passive Coefficient Kp', res.kp.toFixed(6)],
      ['Soil Active Thrust Pa_soil (kN/m)', res.paSoilKnM.toFixed(4)],
      ['Surcharge Active Thrust Pa_q (kN/m)', res.paSurchargeKnM.toFixed(4)],
      ['Total Active Lateral Force Pa (kN/m)', res.paTotalKnM.toFixed(4)],
      ['Base Overturning Moment Mo (kN*m/m)', res.overturnMomentKnMm.toFixed(4)],
      ['Passive Soil Resistance Pp (kN/m)', res.ppPassiveKnM.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rankine-earth-pressure.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Soil Unit Weight gamma (kN/m3)</label>
            <input type="text" inputMode="decimal" data-testid="input-gamma" value={gammaStr} onChange={(e) => setGammaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Retained Height H (m)</label>
            <input type="text" inputMode="decimal" data-testid="input-height" value={heightStr} onChange={(e) => setHeightStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Friction Angle phi (deg)</label>
            <input type="text" inputMode="decimal" data-testid="input-phi" value={phiStr} onChange={(e) => setPhiStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Surface Surcharge q (kPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-q" value={qStr} onChange={(e) => setQStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <button
            type="button"
            onClick={() => { setGammaStr('18'); setHeightStr('4'); setPhiStr('30'); setQStr('10'); }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Rankine Earth Pressure Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Total Active Lateral Force Pa</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-pa">{res.paTotalKnM.toFixed(3)} kN/m</div>
                  <div className="text-xs font-bold text-blue-700 mt-1">Soil {res.paSoilKnM.toFixed(2)} + Surcharge {res.paSurchargeKnM.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Passive Soil Resistance Pp</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-pp">{res.ppPassiveKnM.toFixed(2)} kN/m</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Overturning Moment Mo</div>
                  <div className="text-2xl font-black text-orange-800" data-testid="res-mo">{res.overturnMomentKnMm.toFixed(3)} kN*m/m</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Rankine Coefficients Ka / Kp</div>
                  <div className="text-xl font-black text-purple-800">
                    <span data-testid="res-ka">{res.ka.toFixed(4)}</span> / <span data-testid="res-kp">{res.kp.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Rankine cohesionless backfill coefficients (Ref: <a href="https://en.wikipedia.org/wiki/Lateral_earth_pressure" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Wikipedia: Lateral earth pressure</a>): Ka = (1 - sin(phi)) / (1 + sin(phi)), Kp = (1 + sin(phi)) / (1 - sin(phi)), Pa = 0.5*Ka*gamma*H^2 + Ka*q*H.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
