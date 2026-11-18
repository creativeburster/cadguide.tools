'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface RigidPavementResult {
  valid: boolean;
  error?: string;
  contactRadiusMm: number;
  effRadiusBMm: number;
  relStiffnessEllMm: number;
  interiorStressMpa: number;
  edgeStressMpa: number;
  flexuralSafetyRatio: number;
}

function solveWestergaardPavement(
  loadKnStr: string,
  tirePressKpaStr: string,
  thickMmStr: string,
  modulusMpaStr: string,
  poissonStr: string,
  kSubgradeStr: string,
  modulusRuptureStr: string
): RigidPavementResult {
  if ([loadKnStr, tirePressKpaStr, thickMmStr, modulusMpaStr, poissonStr, kSubgradeStr, modulusRuptureStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All wheel load, tire pressure, slab stiffness, subgrade k, and flexural strength inputs are required.', contactRadiusMm: 0, effRadiusBMm: 0, relStiffnessEllMm: 0, interiorStressMpa: 0, edgeStressMpa: 0, flexuralSafetyRatio: 0 };
  }
  const pKn = Number(loadKnStr);
  const pKpa = Number(tirePressKpaStr);
  const h = Number(thickMmStr);
  const E = Number(modulusMpaStr);
  const nu = Number(poissonStr);
  const kMpam = Number(kSubgradeStr);
  const mr = Number(modulusRuptureStr);

  if (![pKn, pKpa, h, E, nu, kMpam, mr].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', contactRadiusMm: 0, effRadiusBMm: 0, relStiffnessEllMm: 0, interiorStressMpa: 0, edgeStressMpa: 0, flexuralSafetyRatio: 0 };
  }
  if (pKn <= 0 || pKpa <= 0 || h <= 0 || E <= 0 || nu < 0 || nu >= 0.5 || kMpam <= 0 || mr <= 0) {
    return { valid: false, error: 'Require positive load, tire pressure, thickness, E, k, Mr, and 0 <= Poisson < 0.5.', contactRadiusMm: 0, effRadiusBMm: 0, relStiffnessEllMm: 0, interiorStressMpa: 0, edgeStressMpa: 0, flexuralSafetyRatio: 0 };
  }

  const P = pKn * 1000;
  const pMpa = pKpa / 1000;
  const contactRadiusMm = Math.sqrt(P / (Math.PI * pMpa));
  const kNmm3 = kMpam * 1e-3;
  const relStiffnessEllMm = Math.pow((E * h * h * h) / (12 * (1 - nu * nu) * kNmm3), 0.25);
  const effRadiusBMm =
    contactRadiusMm < 1.724 * h
      ? Math.sqrt(1.6 * contactRadiusMm * contactRadiusMm + h * h) - 0.675 * h
      : contactRadiusMm;

  if (effRadiusBMm <= 0 || relStiffnessEllMm <= effRadiusBMm) {
    return { valid: false, error: 'Computed radius of relative stiffness ell must exceed effective contact radius b.', contactRadiusMm: 0, effRadiusBMm: 0, relStiffnessEllMm: 0, interiorStressMpa: 0, edgeStressMpa: 0, flexuralSafetyRatio: 0 };
  }

  const interiorStressMpa =
    ((3 * (1 + nu) * P) / (2 * Math.PI * h * h)) * (Math.log(relStiffnessEllMm / effRadiusBMm) + 0.6159);
  const edgeTerm = (E * h * h * h) / (100 * kNmm3 * Math.pow(contactRadiusMm, 4));
  const edgeStressMpa =
    ((3 * (1 + nu) * P) / (Math.PI * (3 + nu) * h * h)) *
    (Math.log(edgeTerm) + 1.84 - (4 * nu) / 3 + (1 - nu) / 2 + (1.18 * (1 + 2 * nu) * contactRadiusMm) / relStiffnessEllMm);

  if (interiorStressMpa <= 0 || edgeStressMpa <= 0) {
    return { valid: false, error: 'Inputs fall outside valid thin-plate logarithmic domain (computed negative stress).', contactRadiusMm: 0, effRadiusBMm: 0, relStiffnessEllMm: 0, interiorStressMpa: 0, edgeStressMpa: 0, flexuralSafetyRatio: 0 };
  }

  const flexuralSafetyRatio = mr / edgeStressMpa;

  return { valid: true, contactRadiusMm, effRadiusBMm, relStiffnessEllMm, interiorStressMpa, edgeStressMpa, flexuralSafetyRatio };
}

export default function RigidPavementClient() {
  const [loadStr, setLoadStr] = useState('50');
  const [pressStr, setPressStr] = useState('700');
  const [thickStr, setThickStr] = useState('250');
  const [eStr, setEStr] = useState('30000');
  const [nuStr, setNuStr] = useState('0.15');
  const [kStr, setKStr] = useState('40');
  const [mrStr, setMrStr] = useState('4.5');

  const res = solveWestergaardPavement(loadStr, pressStr, thickStr, eStr, nuStr, kStr, mrStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Westergaard Winkler-Subgrade Slab Stress Report', ''],
      ['Single Wheel Load P (kN)', loadStr],
      ['Tire Contact Pressure p (kPa)', pressStr],
      ['Concrete Slab Thickness h (mm)', thickStr],
      ['Concrete Modulus E (MPa) / Poisson nu', `${eStr} / ${nuStr}`],
      ['Subgrade Reaction Modulus k (MPa/m)', kStr],
      ['Flexural Strength Mr (MPa)', mrStr],
      ['Contact Radius a (mm)', res.contactRadiusMm.toFixed(2)],
      ['Relative Stiffness Radius ell (mm)', res.relStiffnessEllMm.toFixed(2)],
      ['Interior Flexural Stress sigma_i (MPa)', res.interiorStressMpa.toFixed(4)],
      ['Free Edge Flexural Stress sigma_e (MPa)', res.edgeStressMpa.toFixed(4)],
      ['Edge Flexural Safety Ratio (Mr / sigma_e)', res.flexuralSafetyRatio.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rigid-pavement-westergaard.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Slab &amp; Load Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wheel Load P (kN)</label>
              <input type="text" inputMode="decimal" data-testid="input-load" value={loadStr} onChange={(e) => setLoadStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Tire Press (kPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-pressure" value={pressStr} onChange={(e) => setPressStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Slab Thick h (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-thick" value={thickStr} onChange={(e) => setThickStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Subgrade k (MPa/m)</label>
              <input type="text" inputMode="decimal" data-testid="input-k" value={kStr} onChange={(e) => setKStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">E (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-modulus" value={eStr} onChange={(e) => setEStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Poisson nu</label>
              <input type="text" inputMode="decimal" data-testid="input-nu" value={nuStr} onChange={(e) => setNuStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Mr (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-mr" value={mrStr} onChange={(e) => setMrStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoadStr('50'); setPressStr('700'); setThickStr('250');
              setEStr('30000'); setNuStr('0.15'); setKStr('40'); setMrStr('4.5');
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Westergaard Bending Stresses</h2>
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
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border ${res.flexuralSafetyRatio >= 1.5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {res.flexuralSafetyRatio >= 1.5 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>Flexural Safety Ratio Mr / sigma_e = <span data-testid="res-sf">{res.flexuralSafetyRatio.toFixed(4)}</span></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase mb-1">Free Edge Tensile Stress</div>
                    <div className="text-3xl font-black text-blue-800" data-testid="res-edge">{res.edgeStressMpa.toFixed(4)} MPa</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase mb-1">Interior Tensile Stress</div>
                    <div className="text-3xl font-black text-emerald-800" data-testid="res-interior">{res.interiorStressMpa.toFixed(4)} MPa</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Radius of Relative Stiffness ell</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-ell">{res.relStiffnessEllMm.toFixed(2)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Tire Contact Radius a</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-a">{res.contactRadiusMm.toFixed(2)} mm</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Uses Westergaard closed-form thin-plate bending equations on an elastic Winkler foundation: ell = [E * h^3 / (12 * (1 - nu^2) * k)]^0.25.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
