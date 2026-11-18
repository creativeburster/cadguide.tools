'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface SlidingResult {
  valid: boolean;
  error?: string;
  ka: number;
  paKnM: number;
  totalVerticalKnM: number;
  slidingResistanceKnM: number;
  fsSliding: number;
  fsOverturn: number;
  overturnMomentKnMm: number;
  resistingMomentKnMm: number;
}

function solveRetainingSliding(
  heightStr: string,
  baseStr: string,
  tStemStr: string,
  tBaseStr: string,
  gammaCStr: string,
  gammaSStr: string,
  phiDegStr: string,
  muStr: string,
  cbStr: string
): SlidingResult {
  if ([heightStr, baseStr, tStemStr, tBaseStr, gammaCStr, gammaSStr, phiDegStr, muStr, cbStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All retaining wall geometry, soil, concrete density, and base resistance inputs are required.', ka: 0, paKnM: 0, totalVerticalKnM: 0, slidingResistanceKnM: 0, fsSliding: 0, fsOverturn: 0, overturnMomentKnMm: 0, resistingMomentKnMm: 0 };
  }
  const H = Number(heightStr);
  const B = Number(baseStr);
  const tStem = Number(tStemStr);
  const tBase = Number(tBaseStr);
  const gammaC = Number(gammaCStr);
  const gammaS = Number(gammaSStr);
  const phiDeg = Number(phiDegStr);
  const mu = Number(muStr);
  const cb = Number(cbStr);

  if (![H, B, tStem, tBase, gammaC, gammaS, phiDeg, mu, cb].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', ka: 0, paKnM: 0, totalVerticalKnM: 0, slidingResistanceKnM: 0, fsSliding: 0, fsOverturn: 0, overturnMomentKnMm: 0, resistingMomentKnMm: 0 };
  }
  if (H <= tBase || tBase <= 0 || tStem <= 0 || B <= tStem || gammaC <= 0 || gammaS <= 0 || phiDeg <= 0 || phiDeg >= 60 || mu <= 0 || cb < 0) {
    return { valid: false, error: 'Require H > t_base > 0, B > t_stem > 0, positive unit weights, 0 < phi < 60 deg, mu > 0, and cb >= 0.', ka: 0, paKnM: 0, totalVerticalKnM: 0, slidingResistanceKnM: 0, fsSliding: 0, fsOverturn: 0, overturnMomentKnMm: 0, resistingMomentKnMm: 0 };
  }

  const phiRad = (phiDeg * Math.PI) / 180;
  const sinPhi = Math.sin(phiRad);
  const ka = (1 - sinPhi) / (1 + sinPhi);
  const paKnM = 0.5 * ka * gammaS * H * H;
  const overturnMomentKnMm = paKnM * (H / 3);

  const wBase = B * tBase * gammaC;
  const wStem = tStem * (H - tBase) * gammaC;
  const wSoil = (B - tStem) * (H - tBase) * gammaS;
  const totalVerticalKnM = wBase + wStem + wSoil;

  const resistingMomentKnMm =
    wBase * (B / 2) +
    wStem * (tStem / 2) +
    wSoil * (tStem + (B - tStem) / 2);

  const slidingResistanceKnM = totalVerticalKnM * mu + cb * B;
  const fsSliding = slidingResistanceKnM / paKnM;
  const fsOverturn = resistingMomentKnMm / overturnMomentKnMm;

  return { valid: true, ka, paKnM, totalVerticalKnM, slidingResistanceKnM, fsSliding, fsOverturn, overturnMomentKnMm, resistingMomentKnMm };
}

export default function RetainingWallSlidingClient() {
  const [hStr, setHStr] = useState('4.5');
  const [bStr, setBStr] = useState('2.8');
  const [tStemStr, setTStemStr] = useState('0.4');
  const [tBaseStr, setTBaseStr] = useState('0.5');
  const [gammaCStr, setGammaCStr] = useState('24');
  const [gammaSStr, setGammaSStr] = useState('18.5');
  const [phiStr, setPhiStr] = useState('32');
  const [muStr, setMuStr] = useState('0.45');
  const [cbStr, setCbStr] = useState('0');

  const res = solveRetainingSliding(hStr, bStr, tStemStr, tBaseStr, gammaCStr, gammaSStr, phiStr, muStr, cbStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Retaining Wall Sliding & Overturning Equilibrium Report', ''],
      ['Total Wall Height H (m)', hStr],
      ['Footing Width B (m)', bStr],
      ['Stem / Base Thickness (m)', `${tStemStr} / ${tBaseStr}`],
      ['Concrete / Backfill Unit Weight (kN/m^3)', `${gammaCStr} / ${gammaSStr}`],
      ['Backfill Friction Angle phi (deg)', phiStr],
      ['Base Friction mu / Base Cohesion (kPa)', `${muStr} / ${cbStr}`],
      ['Rankine Active Ka', res.ka.toFixed(6)],
      ['Active Lateral Thrust Pa (kN/m)', res.paKnM.toFixed(4)],
      ['Total Stabilizing Vertical Force (kN/m)', res.totalVerticalKnM.toFixed(4)],
      ['Base Sliding Resistance (kN/m)', res.slidingResistanceKnM.toFixed(4)],
      ['Sliding Factor of Safety (FS_slide)', res.fsSliding.toFixed(4)],
      ['Overturning Factor of Safety (FS_ot)', res.fsOverturn.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'retaining-wall-sliding.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Wall &amp; Soil Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wall Height H (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-height" value={hStr} onChange={(e) => setHStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Base Width B (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-base" value={bStr} onChange={(e) => setBStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Stem Thick (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-tstem" value={tStemStr} onChange={(e) => setTStemStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Base Thick (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-tbase" value={tBaseStr} onChange={(e) => setTBaseStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Concrete gamma_c</label>
              <input type="text" inputMode="decimal" data-testid="input-gamma-c" value={gammaCStr} onChange={(e) => setGammaCStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Soil gamma_s (kN/m3)</label>
              <input type="text" inputMode="decimal" data-testid="input-gamma-s" value={gammaSStr} onChange={(e) => setGammaSStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">phi (deg)</label>
              <input type="text" inputMode="decimal" data-testid="input-phi" value={phiStr} onChange={(e) => setPhiStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Friction mu</label>
              <input type="text" inputMode="decimal" data-testid="input-mu" value={muStr} onChange={(e) => setMuStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Cohesion c_b</label>
              <input type="text" inputMode="decimal" data-testid="input-cb" value={cbStr} onChange={(e) => setCbStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setHStr('4.5'); setBStr('2.8'); setTStemStr('0.4'); setTBaseStr('0.5');
              setGammaCStr('24'); setGammaSStr('18.5'); setPhiStr('32'); setMuStr('0.45'); setCbStr('0');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Equilibrium Stability Checks</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border ${res.fsSliding >= 1.5 && res.fsOverturn >= 2.0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {res.fsSliding >= 1.5 && res.fsOverturn >= 2.0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{res.fsSliding >= 1.5 ? 'FS_sliding >= 1.50' : 'FS_sliding < 1.50'} | {res.fsOverturn >= 2.0 ? 'FS_overturn >= 2.00' : 'FS_overturn < 2.00'}</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Sliding Factor of Safety (FS_sliding)</div>
                  <div className="text-4xl sm:text-5xl font-black text-blue-900" data-testid="res-fs-slide">{res.fsSliding.toFixed(4)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Active Thrust Pa</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-pa">{res.paKnM.toFixed(2)} kN/m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Sliding Resistance</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-rs">{res.slidingResistanceKnM.toFixed(2)} kN/m</div>
                    <div className="text-xs text-slate-500 mt-0.5" data-testid="res-v">Sum V: {res.totalVerticalKnM.toFixed(1)} kN/m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Overturning FS_ot</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-fs-ot">{res.fsOverturn.toFixed(4)}</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Uses Rankine active coefficient Ka = (1 - sin(phi)) / (1 + sin(phi)) (<a href="https://en.wikipedia.org/wiki/Lateral_earth_pressure" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Wikipedia: Lateral earth pressure</a>), explicit non-overlapping L-wall stem/footing/backfill weights, FS_slide = (mu * Sum_V + c_b * B) / Pa, and FS_ot = Mr / Mo.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
