'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

interface RoutingStep {
  tHr: number;
  qIn: number;
  qOut: number;
  headM: number;
}

interface RoutingResult {
  valid: boolean;
  error?: string;
  peakOutflowM3s: number;
  maxHeadM: number;
  maxStorageMm3: number;
  attenuationPct: number;
  timeToPeakOutHr: number;
  inflowVolumeMm3: number;
  samples: RoutingStep[];
}

function hydrographInflow(tHr: number, qp: number, tp: number, tb: number): number {
  if (tHr <= 0 || tHr >= tb) return 0;
  if (tHr <= tp) return qp * (tHr / tp);
  return qp * ((tb - tHr) / (tb - tp));
}

function solveFloodRouting(
  qinStr: string,
  tpStr: string,
  tbStr: string,
  areaKm2Str: string,
  weirWidthStr: string,
  cdStr: string
): RoutingResult {
  if ([qinStr, tpStr, tbStr, areaKm2Str, weirWidthStr, cdStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All hydrograph, reservoir surface area, and spillway weir parameters are required.', peakOutflowM3s: 0, maxHeadM: 0, maxStorageMm3: 0, attenuationPct: 0, timeToPeakOutHr: 0, inflowVolumeMm3: 0, samples: [] };
  }
  const qp = Number(qinStr);
  const tp = Number(tpStr);
  const tb = Number(tbStr);
  const areaKm2 = Number(areaKm2Str);
  const bw = Number(weirWidthStr);
  const cd = Number(cdStr);

  if (![qp, tp, tb, areaKm2, bw, cd].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', peakOutflowM3s: 0, maxHeadM: 0, maxStorageMm3: 0, attenuationPct: 0, timeToPeakOutHr: 0, inflowVolumeMm3: 0, samples: [] };
  }
  if (qp <= 0 || tp <= 0 || tb <= tp || areaKm2 <= 0 || bw <= 0 || cd <= 0) {
    return { valid: false, error: 'Require Q_peak > 0, 0 < tp < tb, reservoir area > 0, weir length > 0, and Cd > 0.', peakOutflowM3s: 0, maxHeadM: 0, maxStorageMm3: 0, attenuationPct: 0, timeToPeakOutHr: 0, inflowVolumeMm3: 0, samples: [] };
  }

  // Level-pool mass balance ODE: dH/dt = [I(t) - Cd * Bw * max(H,0)^1.5] / A_res, integrated with 240-step RK4 over [0, 1.5*tb]
  const areaM2 = areaKm2 * 1e6;
  const steps = 240;
  const tEndS = 1.5 * tb * 3600;
  const dtS = tEndS / steps;

  const deriv = (tHr: number, head: number): number => {
    const qIn = hydrographInflow(tHr, qp, tp, tb);
    const qOut = cd * bw * Math.pow(Math.max(0, head), 1.5);
    return (qIn - qOut) / areaM2;
  };

  let h = 0;
  let maxHeadM = 0;
  let peakOutflowM3s = 0;
  let timeToPeakOutHr = 0;
  const samples: RoutingStep[] = [{ tHr: 0, qIn: 0, qOut: 0, headM: 0 }];

  for (let i = 0; i < steps; i++) {
    const t0 = (i * dtS) / 3600;
    const tm = ((i + 0.5) * dtS) / 3600;
    const t1 = ((i + 1) * dtS) / 3600;

    const k1 = deriv(t0, h);
    const k2 = deriv(tm, h + 0.5 * dtS * k1);
    const k3 = deriv(tm, h + 0.5 * dtS * k2);
    const k4 = deriv(t1, h + dtS * k3);

    h = Math.max(0, h + (dtS / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
    const qOut = cd * bw * Math.pow(h, 1.5);

    if (qOut > peakOutflowM3s) {
      peakOutflowM3s = qOut;
      maxHeadM = h;
      timeToPeakOutHr = t1;
    }

    if ((i + 1) % 24 === 0) {
      samples.push({
        tHr: t1,
        qIn: hydrographInflow(t1, qp, tp, tb),
        qOut,
        headM: h,
      });
    }
  }

  const maxStorageMm3 = (areaM2 * maxHeadM) / 1e6;
  const attenuationPct = (1 - peakOutflowM3s / qp) * 100;
  const inflowVolumeMm3 = (0.5 * qp * tb * 3600) / 1e6;

  return { valid: true, peakOutflowM3s, maxHeadM, maxStorageMm3, attenuationPct, timeToPeakOutHr, inflowVolumeMm3, samples };
}

export default function ReservoirFloodRoutingClient() {
  const [qinStr, setQinStr] = useState('150');
  const [tpStr, setTpStr] = useState('4');
  const [tbStr, setTbStr] = useState('12');
  const [areaStr, setAreaStr] = useState('2.5');
  const [widthStr, setWidthStr] = useState('20');
  const [cdStr, setCdStr] = useState('2.15');

  const res = solveFloodRouting(qinStr, tpStr, tbStr, areaStr, widthStr, cdStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows: string[][] = [
      ['Level-Pool Reservoir Flood Routing Report (240-Step RK4)', ''],
      ['Peak Inflow Q_in (m^3/s)', qinStr],
      ['Time to Peak tp (hr)', tpStr],
      ['Flood Base Duration tb (hr)', tbStr],
      ['Reservoir Pool Area (km^2)', areaStr],
      ['Spillway Crest Length Bw (m)', widthStr],
      ['Weir Coefficient Cd', cdStr],
      ['Peak Routed Outflow (m^3/s)', res.peakOutflowM3s.toFixed(4)],
      ['Max Surcharge Head (m)', res.maxHeadM.toFixed(4)],
      ['Peak Detention Storage (million m^3)', res.maxStorageMm3.toFixed(4)],
      ['Peak Attenuation (%)', res.attenuationPct.toFixed(2)],
      ['Time to Peak Outflow (hr)', res.timeToPeakOutHr.toFixed(3)],
      ['Time (hr)', 'Inflow (m^3/s),Outflow (m^3/s),Head (m)'],
      ...res.samples.map((s) => [s.tHr.toFixed(2), `${s.qIn.toFixed(3)},${s.qOut.toFixed(3)},${s.headM.toFixed(4)}`]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservoir-flood-routing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setQinStr('150'); setTpStr('4'); setTbStr('12');
                setAreaStr('2.5'); setWidthStr('20'); setCdStr('2.15');
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Peak Inflow Q_in (m3/s)</label>
            <input type="text" inputMode="decimal" data-testid="input-qin" value={qinStr} onChange={(e) => setQinStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Time to Peak tp (hr)</label>
              <input type="text" inputMode="decimal" data-testid="input-tp" value={tpStr} onChange={(e) => setTpStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Storm Base tb (hr)</label>
              <input type="text" inputMode="decimal" data-testid="input-tb" value={tbStr} onChange={(e) => setTbStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Reservoir Pool Area (km2)</label>
            <input type="text" inputMode="decimal" data-testid="input-area" value={areaStr} onChange={(e) => setAreaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Crest Length Bw (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-width" value={widthStr} onChange={(e) => setWidthStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Weir Coeff Cd</label>
              <input type="text" inputMode="decimal" data-testid="input-cd" value={cdStr} onChange={(e) => setCdStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Routed Flood Outputs</h2>
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Peak Routed Outflow Discharge</div>
                  <div className="text-4xl sm:text-5xl font-black text-blue-900" data-testid="res-qout">{res.peakOutflowM3s.toFixed(2)} m3/s</div>
                  <div className="text-sm font-bold text-blue-700 mt-1">
                    Attenuation: <span data-testid="res-atten">{res.attenuationPct.toFixed(2)}%</span> | Peak Outflow at t = {res.timeToPeakOutHr.toFixed(2)} hr (Inflow Vol {res.inflowVolumeMm3.toFixed(2)} million m3)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Max Surcharge Head Above Crest</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-head">{res.maxHeadM.toFixed(4)} m</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Peak Detention Storage Volume</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-storage">{res.maxStorageMm3.toFixed(4)} million m3</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Numerically integrates the level-pool continuity differential equation dH/dt = [I(t) - Cd * Bw * H^1.5] / A_res across 240 fourth-order Runge-Kutta (RK4) steps for a triangular storm inflow hydrograph starting at crest level H = 0.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
