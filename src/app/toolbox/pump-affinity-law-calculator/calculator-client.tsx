'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Info } from 'lucide-react';

type AffinityMode = 'speed' | 'similar';

interface AffinityResult {
  valid: boolean;
  error?: string;
  q2: number;
  h2: number;
  p2: number;
  qChangePct: number;
  hChangePct: number;
  pChangePct: number;
}

function solveAffinity(
  mode: AffinityMode,
  q1Str: string,
  h1Str: string,
  p1Str: string,
  n1Str: string,
  n2Str: string,
  d1Str: string,
  d2Str: string,
  rho1Str: string,
  rho2Str: string
): AffinityResult {
  const fields = mode === 'speed' ? [q1Str, h1Str, p1Str, n1Str, n2Str, rho1Str, rho2Str] : [q1Str, h1Str, p1Str, n1Str, n2Str, d1Str, d2Str, rho1Str, rho2Str];
  if (fields.some((s) => s.trim() === '')) {
    return { valid: false, error: 'All pump baseline and scaling parameters are required.', q2: 0, h2: 0, p2: 0, qChangePct: 0, hChangePct: 0, pChangePct: 0 };
  }
  const q1 = Number(q1Str);
  const h1 = Number(h1Str);
  const p1 = Number(p1Str);
  const n1 = Number(n1Str);
  const n2 = Number(n2Str);
  const d1 = mode === 'speed' ? 1 : Number(d1Str);
  const d2 = mode === 'speed' ? 1 : Number(d2Str);
  const rho1 = Number(rho1Str);
  const rho2 = Number(rho2Str);

  if (![q1, h1, p1, n1, n2, d1, d2, rho1, rho2].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', q2: 0, h2: 0, p2: 0, qChangePct: 0, hChangePct: 0, pChangePct: 0 };
  }
  if (q1 <= 0 || h1 <= 0 || p1 <= 0 || n1 <= 0 || n2 <= 0 || d1 <= 0 || d2 <= 0 || rho1 <= 0 || rho2 <= 0) {
    return { valid: false, error: 'All flows, heads, powers, speeds, diameters, and fluid densities must be > 0.', q2: 0, h2: 0, p2: 0, qChangePct: 0, hChangePct: 0, pChangePct: 0 };
  }

  const rN = n2 / n1;
  const rD = mode === 'speed' ? 1 : d2 / d1;
  const rRho = rho2 / rho1;

  // Exact Wikipedia Affinity Laws: Q2/Q1 = (N2/N1)*(D2/D1)^3; H2/H1 = (N2/N1)^2*(D2/D1)^2; P2/P1 = (rho2/rho1)*(N2/N1)^3*(D2/D1)^5
  const q2 = q1 * rN * Math.pow(rD, 3);
  const h2 = h1 * Math.pow(rN, 2) * Math.pow(rD, 2);
  const p2 = p1 * rRho * Math.pow(rN, 3) * Math.pow(rD, 5);

  return {
    valid: true,
    q2,
    h2,
    p2,
    qChangePct: (q2 / q1 - 1) * 100,
    hChangePct: (h2 / h1 - 1) * 100,
    pChangePct: (p2 / p1 - 1) * 100,
  };
}

export default function PumpAffinityClient() {
  const [mode, setMode] = useState<AffinityMode>('speed');
  const [q1Str, setQ1Str] = useState('100');
  const [h1Str, setH1Str] = useState('30');
  const [p1Str, setP1Str] = useState('15');
  const [n1Str, setN1Str] = useState('1450');
  const [n2Str, setN2Str] = useState('1750');
  const [d1Str, setD1Str] = useState('200');
  const [d2Str, setD2Str] = useState('220');
  const [rho1Str, setRho1Str] = useState('1000');
  const [rho2Str, setRho2Str] = useState('1000');

  const res = solveAffinity(mode, q1Str, h1Str, p1Str, n1Str, n2Str, d1Str, d2Str, rho1Str, rho2Str);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pump Affinity Laws Report', ''],
      ['Scaling Mode', mode === 'speed' ? 'Constant Impeller Diameter (Speed Change)' : 'Geometrically Similar Family (N and D Scaling)'],
      ['Q1 (m3/h)', q1Str],
      ['H1 (m)', h1Str],
      ['P1 (kW)', p1Str],
      ['N1 / N2 (rpm)', `${n1Str} -> ${n2Str}`],
      ...(mode === 'similar' ? [['D1 / D2 (mm)', `${d1Str} -> ${d2Str}`]] : []),
      ['Density rho1 / rho2 (kg/m3)', `${rho1Str} -> ${rho2Str}`],
      ['New Flow Q2 (m3/h)', res.q2.toFixed(4)],
      ['New Head H2 (m)', res.h2.toFixed(4)],
      ['New Shaft Power P2 (kW)', res.p2.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pump-affinity-law.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button type="button" data-testid="mode-speed" onClick={() => setMode('speed')} className={`px-3 py-2.5 rounded-xl text-sm font-black border ${mode === 'speed' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
              Constant Dia (Speed Change N)
            </button>
            <button type="button" data-testid="mode-similar" onClick={() => setMode('similar')} className={`px-3 py-2.5 rounded-xl text-sm font-black border ${mode === 'similar' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
              Geometrically Similar Pump (N &amp; D)
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">Q1 (m^3/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-q1" value={q1Str} onChange={(e) => setQ1Str(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">H1 (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-h1" value={h1Str} onChange={(e) => setH1Str(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">P1 (kW)</label>
              <input type="text" inputMode="decimal" data-testid="input-p1" value={p1Str} onChange={(e) => setP1Str(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Speed N1 (rpm)</label>
              <input type="text" inputMode="decimal" data-testid="input-n1" value={n1Str} onChange={(e) => setN1Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Speed N2 (rpm)</label>
              <input type="text" inputMode="decimal" data-testid="input-n2" value={n2Str} onChange={(e) => setN2Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          {mode === 'similar' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Impeller D1 (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-d1" value={d1Str} onChange={(e) => setD1Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Impeller D2 (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-d2" value={d2Str} onChange={(e) => setD2Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">rho1 (kg/m^3)</label>
              <input type="text" inputMode="decimal" data-testid="input-rho1" value={rho1Str} onChange={(e) => setRho1Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">rho2 (kg/m^3)</label>
              <input type="text" inputMode="decimal" data-testid="input-rho2" value={rho2Str} onChange={(e) => setRho2Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMode('speed'); setQ1Str('100'); setH1Str('30'); setP1Str('15');
              setN1Str('1450'); setN2Str('1750'); setD1Str('200'); setD2Str('220'); setRho1Str('1000'); setRho2Str('1000');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Scaled Operating Point</h2>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Flow Q2</p>
                  <p className="text-2xl font-black" data-testid="res-q2">{res.q2.toFixed(4)}<span className="text-sm font-bold ml-1">m^3/h</span></p>
                  <p className="text-xs mt-1 opacity-80">{res.qChangePct >= 0 ? '+' : ''}{res.qChangePct.toFixed(1)}%</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Head H2</p>
                  <p className="text-2xl font-black" data-testid="res-h2">{res.h2.toFixed(4)}<span className="text-sm font-bold ml-1">m</span></p>
                  <p className="text-xs mt-1 opacity-80">{res.hChangePct >= 0 ? '+' : ''}{res.hChangePct.toFixed(1)}%</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Shaft Power P2</p>
                  <p className="text-2xl font-black" data-testid="res-p2">{res.p2.toFixed(4)}<span className="text-sm font-bold ml-1">kW</span></p>
                  <p className="text-xs mt-1 opacity-80">{res.pChangePct >= 0 ? '+' : ''}{res.pChangePct.toFixed(1)}%</p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2.5 text-sm text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Strictly follows Wikipedia Affinity Laws: constant-diameter speed change yields Q~N, H~N^2, P~rho*N^3; geometrically similar impeller scaling uses Q~N*D^3, H~N^2*D^2, P~rho*N^3*D^5.
              </span>
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
