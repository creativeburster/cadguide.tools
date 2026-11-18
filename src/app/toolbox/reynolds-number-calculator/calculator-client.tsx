'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Gauge, Download } from 'lucide-react';

const FLUID_PRESETS = [
  { label: 'Water 20C', rho: '998', mu: '0.001' },
  { label: 'Air 20C', rho: '1.204', mu: '0.000018' },
  { label: 'SAE 30 Oil', rho: '892', mu: '0.44' },
  { label: 'Glycerin', rho: '1260', mu: '1.49' },
];

type DuctShape = 'circular' | 'rectangular';

interface ReynoldsResult {
  valid: boolean;
  error?: string;
  dhM: number;
  areaM2: number;
  nuM2s: number;
  re: number;
  regime: 'Laminar' | 'Transitional' | 'Turbulent';
  flowLs: number;
  darcyFNote: string;
}

function solveReynolds(
  shape: DuctShape,
  rhoStr: string,
  muStr: string,
  velStr: string,
  diaMmStr: string,
  rectWMmStr: string,
  rectHMmStr: string
): ReynoldsResult {
  if ([rhoStr, muStr, velStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'Fluid density, dynamic viscosity, and flow velocity are required.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
  }
  const rho = Number(rhoStr);
  const mu = Number(muStr);
  const v = Number(velStr);

  if (![rho, mu, v].every(Number.isFinite) || rho <= 0 || mu <= 0 || v <= 0) {
    return { valid: false, error: 'Density, dynamic viscosity, and velocity must be finite numbers > 0.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
  }

  let dhM = 0;
  let areaM2 = 0;
  if (shape === 'circular') {
    if (diaMmStr.trim() === '') {
      return { valid: false, error: 'Pipe inner diameter D is required.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
    }
    const dMm = Number(diaMmStr);
    if (!Number.isFinite(dMm) || dMm <= 0) {
      return { valid: false, error: 'Pipe inner diameter D must be > 0.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
    }
    dhM = dMm / 1000;
    areaM2 = (Math.PI * dhM * dhM) / 4;
  } else {
    if (rectWMmStr.trim() === '' || rectHMmStr.trim() === '') {
      return { valid: false, error: 'Rectangular duct width and height are required.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
    }
    const wM = Number(rectWMmStr) / 1000;
    const hM = Number(rectHMmStr) / 1000;
    if (!Number.isFinite(wM) || !Number.isFinite(hM) || wM <= 0 || hM <= 0) {
      return { valid: false, error: 'Rectangular duct dimensions must be > 0.', dhM: 0, areaM2: 0, nuM2s: 0, re: 0, regime: 'Laminar', flowLs: 0, darcyFNote: '' };
    }
    areaM2 = wM * hM;
    dhM = (4 * areaM2) / (2 * (wM + hM));
  }

  const nuM2s = mu / rho;
  const re = (rho * v * dhM) / mu;
  const flowLs = areaM2 * v * 1000;
  let regime: ReynoldsResult['regime'] = 'Turbulent';
  let darcyFNote = `Blasius smooth-pipe ref (4000 <= Re <= 10^5): ${(0.316 / Math.pow(re, 0.25)).toFixed(5)}`;
  if (re < 2300) {
    regime = 'Laminar';
    darcyFNote = `Circular laminar Hagen-Poiseuille f = 64 / Re = ${(64 / re).toFixed(5)}`;
  } else if (re < 4000) {
    regime = 'Transitional';
    darcyFNote = 'Transitional zone (2300 <= Re < 4000); single-formula friction factor is uncertain.';
  } else if (re > 100000) {
    darcyFNote = 'High-Re turbulent regime (Re > 10^5); apply full Colebrook-White roughness correlation.';
  }

  return { valid: true, dhM, areaM2, nuM2s, re, regime, flowLs, darcyFNote };
}

export default function ReynoldsClient() {
  const [shape, setShape] = useState<DuctShape>('circular');
  const [rhoStr, setRhoStr] = useState('998');
  const [muStr, setMuStr] = useState('0.001');
  const [velStr, setVelStr] = useState('2');
  const [diaStr, setDiaStr] = useState('50');
  const [rwStr, setRwStr] = useState('200');
  const [rhStr, setRhStr] = useState('100');

  const res = solveReynolds(shape, rhoStr, muStr, velStr, diaStr, rwStr, rhStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Reynolds Number & Hydraulic Diameter Report', ''],
      ['Section Geometry', shape],
      ['Density rho (kg/m^3)', rhoStr],
      ['Dynamic Viscosity mu (Pa*s)', muStr],
      ['Kinematic Viscosity nu (mm^2/s)', (res.nuM2s * 1e6).toFixed(4)],
      ['Flow Velocity u (m/s)', velStr],
      ['Hydraulic Diameter Dh (mm)', (res.dhM * 1000).toFixed(2)],
      ['Volumetric Flow Rate (L/s)', res.flowLs.toFixed(4)],
      ['Reynolds Number (Re)', res.re.toFixed(2)],
      ['Flow Regime', res.regime],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reynolds-number.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Flow &amp; Fluid Inputs</h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FLUID_PRESETS.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => { setRhoStr(f.rho); setMuStr(f.mu); }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Density rho (kg/m3)</label>
              <input type="text" inputMode="decimal" data-testid="input-rho" value={rhoStr} onChange={(e) => setRhoStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Viscosity mu (Pa*s)</label>
              <input type="text" inputMode="decimal" data-testid="input-mu" value={muStr} onChange={(e) => setMuStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Duct / Pipe Geometry</label>
            <div className="flex gap-2">
              <button type="button" data-testid="shape-circular" onClick={() => setShape('circular')} className={`flex-1 py-2 rounded-xl text-xs font-black ${shape === 'circular' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Circular Pipe</button>
              <button type="button" data-testid="shape-rect" onClick={() => setShape('rectangular')} className={`flex-1 py-2 rounded-xl text-xs font-black ${shape === 'rectangular' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Rectangular</button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Mean Velocity u (m/s)</label>
            <input type="text" inputMode="decimal" data-testid="input-vel" value={velStr} onChange={(e) => setVelStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          {shape === 'circular' ? (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Pipe Inner Diameter D (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Duct Width (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-rw" value={rwStr} onChange={(e) => setRwStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Duct Height (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-rh" value={rhStr} onChange={(e) => setRhStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Gauge className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Flow Regime Results</h2>
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
                <div className={`rounded-2xl p-6 border ${res.regime === 'Laminar' ? 'bg-blue-50 border-blue-100' : res.regime === 'Transitional' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Reynolds Number (Re)</div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900" data-testid="res-re">{res.re.toFixed(1)}</div>
                  <div className="text-base font-black text-slate-700 mt-1" data-testid="res-regime">{res.regime} Flow</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Hydraulic Dia Dh</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-dh">{(res.dhM * 1000).toFixed(2)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Kinematic Visc nu</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-nu">{(res.nuM2s * 1e6).toFixed(4)} mm2/s</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Volume Flow Q</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-flow">{res.flowLs.toFixed(3)} L/s</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-600">{res.darcyFNote}</div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Definition (<a href="https://en.wikipedia.org/wiki/Reynolds_number" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Wikipedia: Reynolds number</a>): Re = rho * u * L / mu = u * L / nu, where L = Dh = 4*A/Pw. Internal pipe transition typically occurs between Re 2300 and 4000.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
