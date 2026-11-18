'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Shield, Download } from 'lucide-react';

interface VesselResult {
  valid: boolean;
  error?: string;
  thinMinTotalMm: number;
  lameMinTotalMm: number;
  effectiveNominalMm: number;
  hoopStressMpa: number;
  axialStressMpa: number;
  radiusThicknessRatio: number;
  isThinWalledOk: boolean;
}

function solvePressureVessel(
  vesselType: 'cylindrical' | 'spherical',
  pressureMpaStr: string,
  diMmStr: string,
  allowMpaStr: string,
  etaStr: string,
  corrMmStr: string,
  nomWallMmStr: string
): VesselResult {
  if ([pressureMpaStr, diMmStr, allowMpaStr, etaStr, corrMmStr, nomWallMmStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All vessel pressure, geometry, and stress parameters are required.', thinMinTotalMm: 0, lameMinTotalMm: 0, effectiveNominalMm: 0, hoopStressMpa: 0, axialStressMpa: 0, radiusThicknessRatio: 0, isThinWalledOk: false };
  }
  const P = Number(pressureMpaStr);
  const Di = Number(diMmStr);
  const S = Number(allowMpaStr);
  const eta = Number(etaStr);
  const c = Number(corrMmStr);
  const tNom = Number(nomWallMmStr);

  if (![P, Di, S, eta, c, tNom].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', thinMinTotalMm: 0, lameMinTotalMm: 0, effectiveNominalMm: 0, hoopStressMpa: 0, axialStressMpa: 0, radiusThicknessRatio: 0, isThinWalledOk: false };
  }
  if (P <= 0 || Di <= 0 || S <= 0 || eta <= 0 || eta > 1 || c < 0 || tNom <= c) {
    return { valid: false, error: 'Require P > 0, Di > 0, S > 0, 0 < eta <= 1, c >= 0, and nominal thickness > corrosion allowance.', thinMinTotalMm: 0, lameMinTotalMm: 0, effectiveNominalMm: 0, hoopStressMpa: 0, axialStressMpa: 0, radiusThicknessRatio: 0, isThinWalledOk: false };
  }
  const sEff = S * eta;
  if (P >= sEff) {
    return { valid: false, error: 'Internal pressure P must be less than S * eta for finite wall solution.', thinMinTotalMm: 0, lameMinTotalMm: 0, effectiveNominalMm: 0, hoopStressMpa: 0, axialStressMpa: 0, radiusThicknessRatio: 0, isThinWalledOk: false };
  }

  let tThin = 0;
  let tLame = 0;
  const tEff = tNom - c;
  let hoopStressMpa = 0;
  let axialStressMpa = 0;

  if (vesselType === 'cylindrical') {
    tThin = (P * Di) / (2 * sEff);
    tLame = (Di / 2) * (Math.sqrt((sEff + P) / (sEff - P)) - 1);
    hoopStressMpa = (P * Di) / (2 * tEff);
    axialStressMpa = (P * Di) / (4 * tEff);
  } else {
    tThin = (P * Di) / (4 * sEff);
    tLame = (Di / 2) * (Math.cbrt((2 * sEff + 2 * P) / (2 * sEff - P)) - 1);
    hoopStressMpa = (P * Di) / (4 * tEff);
    axialStressMpa = hoopStressMpa;
  }

  return {
    valid: true,
    thinMinTotalMm: tThin + c,
    lameMinTotalMm: tLame + c,
    effectiveNominalMm: tEff,
    hoopStressMpa,
    axialStressMpa,
    radiusThicknessRatio: Di / (2 * tEff),
    isThinWalledOk: Di / tEff >= 20,
  };
}

export default function PressureVesselClient() {
  const [vesselType, setVesselType] = useState<'cylindrical' | 'spherical'>('cylindrical');
  const [pressureStr, setPressureStr] = useState('1.0'); // MPa (= 10 bar)
  const [diStr, setDiStr] = useState('1000');
  const [allowStr, setAllowStr] = useState('138');
  const [etaStr, setEtaStr] = useState('1.0');
  const [corrStr, setCorrStr] = useState('1.5');
  const [nomWallStr, setNomWallStr] = useState('8');

  const res = solvePressureVessel(vesselType, pressureStr, diStr, allowStr, etaStr, corrStr, nomWallStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pressure Vessel Shell Wall Sizing Report', ''],
      ['Shell Geometry', vesselType],
      ['Internal Design Pressure (MPa)', pressureStr],
      ['Inside Diameter Di (mm)', diStr],
      ['Allowable Stress S (MPa)', allowStr],
      ['Joint Efficiency eta', etaStr],
      ['Corrosion Allowance c (mm)', corrStr],
      ['Selected Nominal Wall t_nom (mm)', nomWallStr],
      ['Thin-Wall Min Required t_thin + c (mm)', res.thinMinTotalMm.toFixed(4)],
      ['Lame Exact Min Required t_lame + c (mm)', res.lameMinTotalMm.toFixed(4)],
      ['Corroded Nominal Thickness t_eff (mm)', res.effectiveNominalMm.toFixed(4)],
      ['Thin-Wall Hoop Stress sigma_theta (MPa)', res.hoopStressMpa.toFixed(4)],
      ['Thin-Wall Axial Stress sigma_z (MPa)', res.axialStressMpa.toFixed(4)],
      ['Radius/Thickness Ratio (r/t_eff)', res.radiusThicknessRatio.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pressure-vessel-wall.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['cylindrical', 'spherical'] as const).map((t) => (
              <button
                key={t}
                type="button"
                data-testid={`btn-${t}`}
                onClick={() => setVesselType(t)}
                className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all ${vesselType === t ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                {t === 'cylindrical' ? 'Cylindrical' : 'Spherical'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pressure P (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-pressure" value={pressureStr} onChange={(e) => setPressureStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Inside Dia D_i (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-di" value={diStr} onChange={(e) => setDiStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Allowable Stress S (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-stress" value={allowStr} onChange={(e) => setAllowStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Joint Efficiency eta</label>
              <input type="text" inputMode="decimal" data-testid="input-eta" value={etaStr} onChange={(e) => setEtaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Corrosion Allow c (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-corr" value={corrStr} onChange={(e) => setCorrStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Selected Wall t_nom (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-tnom" value={nomWallStr} onChange={(e) => setNomWallStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVesselType('cylindrical'); setPressureStr('1.0'); setDiStr('1000');
              setAllowStr('138'); setEtaStr('1.0'); setCorrStr('1.5'); setNomWallStr('8');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Shell Thickness &amp; Stresses</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                    <div className="text-xs font-black text-red-500 uppercase tracking-wider mb-1">Thin-Wall Total Min Thickness</div>
                    <div className="text-3xl font-black text-red-700" data-testid="res-t-thin">{res.thinMinTotalMm.toFixed(4)}<span className="text-lg text-red-400"> mm</span></div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Lame Exact Min Thickness</div>
                    <div className="text-3xl font-black text-orange-700" data-testid="res-t-lame">{res.lameMinTotalMm.toFixed(4)}<span className="text-lg text-orange-400"> mm</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Hoop Stress (at t_eff)</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-hoop">{res.hoopStressMpa.toFixed(3)} MPa</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Axial Stress (at t_eff)</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-axial">{res.axialStressMpa.toFixed(3)} MPa</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Corroded r / t_eff</div>
                    <div className="text-xl font-black text-slate-900">{res.radiusThicknessRatio.toFixed(1)}</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Preliminary continuum cylinder/sphere stress estimate only (Wikipedia Cylinder Stress). Always apply certified pressure-vessel construction codes for external pressure, heads, nozzles, and stamping.
              </span>
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
