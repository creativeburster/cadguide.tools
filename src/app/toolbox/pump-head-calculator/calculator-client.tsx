'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const STANDARD_GRAVITY = 9.80665;

interface PumpHeadResult {
  valid: boolean;
  error?: string;
  velocityMs: number;
  frictionHeadM: number;
  totalHeadM: number;
  hydraulicPowerKw: number;
  shaftPowerKw: number;
  motorInputKw: number;
}

function solvePumpHead(
  qLsStr: string,
  hsMStr: string,
  pipeLenMStr: string,
  pipeDiaMmStr: string,
  frictionFStr: string,
  rhoStr: string,
  etaPumpStr: string,
  etaMotorStr: string
): PumpHeadResult {
  if ([qLsStr, hsMStr, pipeLenMStr, pipeDiaMmStr, frictionFStr, rhoStr, etaPumpStr, etaMotorStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All hydraulic, pipe, and efficiency inputs are required.', velocityMs: 0, frictionHeadM: 0, totalHeadM: 0, hydraulicPowerKw: 0, shaftPowerKw: 0, motorInputKw: 0 };
  }
  const qLs = Number(qLsStr);
  const hs = Number(hsMStr);
  const L = Number(pipeLenMStr);
  const dMm = Number(pipeDiaMmStr);
  const f = Number(frictionFStr);
  const rho = Number(rhoStr);
  const etaP = Number(etaPumpStr);
  const etaM = Number(etaMotorStr);

  if (![qLs, hs, L, dMm, f, rho, etaP, etaM].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', velocityMs: 0, frictionHeadM: 0, totalHeadM: 0, hydraulicPowerKw: 0, shaftPowerKw: 0, motorInputKw: 0 };
  }
  if (qLs <= 0 || L < 0 || dMm <= 0 || f < 0 || rho <= 0 || etaP <= 0 || etaP > 1 || etaM <= 0 || etaM > 1) {
    return { valid: false, error: 'Require Q > 0, L >= 0, dia > 0, f >= 0, rho > 0, and 0 < efficiencies <= 1.0.', velocityMs: 0, frictionHeadM: 0, totalHeadM: 0, hydraulicPowerKw: 0, shaftPowerKw: 0, motorInputKw: 0 };
  }

  const Q = qLs / 1000; // m^3/s
  const d = dMm / 1000; // m
  const area = (Math.PI * d * d) / 4;
  const v = Q / area;
  const frictionHeadM = f * (L / d) * ((v * v) / (2 * STANDARD_GRAVITY));
  const totalHeadM = hs + frictionHeadM;
  if (totalHeadM < 0) {
    return { valid: false, error: 'Total dynamic head (Hs + Hf) cannot be negative.', velocityMs: 0, frictionHeadM: 0, totalHeadM: 0, hydraulicPowerKw: 0, shaftPowerKw: 0, motorInputKw: 0 };
  }
  const hydraulicPowerKw = (rho * STANDARD_GRAVITY * Q * totalHeadM) / 1000;
  const shaftPowerKw = hydraulicPowerKw / etaP;
  const motorInputKw = shaftPowerKw / etaM;

  return { valid: true, velocityMs: v, frictionHeadM, totalHeadM, hydraulicPowerKw, shaftPowerKw, motorInputKw };
}

export default function PumpHeadCalculatorClient() {
  const [qStr, setQStr] = useState('50');
  const [hsStr, setHsStr] = useState('20');
  const [lenStr, setLenStr] = useState('100');
  const [diaStr, setDiaStr] = useState('150');
  const [fStr, setFStr] = useState('0.02');
  const [rhoStr, setRhoStr] = useState('1000');
  const [etaPStr, setEtaPStr] = useState('0.75');
  const [etaMStr, setEtaMStr] = useState('0.95');

  const res = solvePumpHead(qStr, hsStr, lenStr, diaStr, fStr, rhoStr, etaPStr, etaMStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pump Total Head & Power Report', ''],
      ['Flow Rate (L/s)', qStr],
      ['Static Head (m)', hsStr],
      ['Pipe Length (m)', lenStr],
      ['Pipe Diameter (mm)', diaStr],
      ['Darcy Friction Factor f', fStr],
      ['Fluid Density (kg/m3)', rhoStr],
      ['Pump Efficiency / Motor Efficiency', `${etaPStr} / ${etaMStr}`],
      ['Flow Velocity (m/s)', res.velocityMs.toFixed(4)],
      ['Darcy-Weisbach Friction Head (m)', res.frictionHeadM.toFixed(4)],
      ['Total Dynamic Head (m)', res.totalHeadM.toFixed(4)],
      ['Hydraulic Power (kW)', res.hydraulicPowerKw.toFixed(4)],
      ['Pump Shaft Power (kW)', res.shaftPowerKw.toFixed(4)],
      ['Electrical Motor Input (kW)', res.motorInputKw.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pump-head-power.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Flow Q (L/s)</label>
              <input type="text" inputMode="decimal" data-testid="input-flow" value={qStr} onChange={(e) => setQStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Static Head Hs (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-hs" value={hsStr} onChange={(e) => setHsStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pipe Length L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pipe ID d (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Darcy Friction f</label>
              <input type="text" inputMode="decimal" data-testid="input-f" value={fStr} onChange={(e) => setFStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Density rho (kg/m^3)</label>
              <input type="text" inputMode="decimal" data-testid="input-rho" value={rhoStr} onChange={(e) => setRhoStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pump Eff (0..1)</label>
              <input type="text" inputMode="decimal" data-testid="input-etap" value={etaPStr} onChange={(e) => setEtaPStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Motor Eff (0..1)</label>
              <input type="text" inputMode="decimal" data-testid="input-etam" value={etaMStr} onChange={(e) => setEtaMStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setQStr('50'); setHsStr('20'); setLenStr('100'); setDiaStr('150'); setFStr('0.02'); setRhoStr('1000'); setEtaPStr('0.75'); setEtaMStr('0.95'); }}
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
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Friction Head (Darcy-Weisbach)</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-hf">{res.frictionHeadM.toFixed(4)}<span className="text-lg text-blue-400"> m</span></div>
                    <div className="text-xs text-blue-600 font-bold mt-1">Pipe velocity: {res.velocityMs.toFixed(4)} m/s</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Total Dynamic Head</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-tdh">{res.totalHeadM.toFixed(4)}<span className="text-lg text-emerald-500"> m</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Hydraulic Power</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-ph">{res.hydraulicPowerKw.toFixed(4)} kW</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Shaft Power</div>
                    <div className="text-xl font-black text-slate-900">{res.shaftPowerKw.toFixed(4)} kW</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Motor Input Power</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-pm">{res.motorInputKw.toFixed(4)} kW</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Uses ISO 80000 gravity g = 9.80665 m/s^2, Darcy-Weisbach head loss hf = f*(L/d)*(v^2/(2*g)) with d in meters, and shaft/motor efficiency chain.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
