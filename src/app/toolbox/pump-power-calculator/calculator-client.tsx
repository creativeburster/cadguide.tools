'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const STANDARD_GRAVITY = 9.80665;

interface PumpPowerResult {
  valid: boolean;
  error?: string;
  hydraulicKw: number;
  shaftKw: number;
  motorKw: number;
  dailyEnergyKwh: number;
}

function solvePumpPower(
  flowM3hStr: string,
  headMStr: string,
  etaPumpStr: string,
  etaMotorStr: string,
  rhoStr: string
): PumpPowerResult {
  if ([flowM3hStr, headMStr, etaPumpStr, etaMotorStr, rhoStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'Flow, head, pump efficiency, motor efficiency, and density are required.', hydraulicKw: 0, shaftKw: 0, motorKw: 0, dailyEnergyKwh: 0 };
  }
  const qM3h = Number(flowM3hStr);
  const H = Number(headMStr);
  const etaP = Number(etaPumpStr);
  const etaM = Number(etaMotorStr);
  const rho = Number(rhoStr);

  if (![qM3h, H, etaP, etaM, rho].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', hydraulicKw: 0, shaftKw: 0, motorKw: 0, dailyEnergyKwh: 0 };
  }
  if (qM3h <= 0 || H <= 0 || rho <= 0 || etaP <= 0 || etaP > 1 || etaM <= 0 || etaM > 1) {
    return { valid: false, error: 'Require Q > 0, H > 0, rho > 0, and 0 < efficiencies <= 1.0.', hydraulicKw: 0, shaftKw: 0, motorKw: 0, dailyEnergyKwh: 0 };
  }

  const qM3s = qM3h / 3600;
  const hydraulicKw = (rho * STANDARD_GRAVITY * qM3s * H) / 1000;
  const shaftKw = hydraulicKw / etaP;
  const motorKw = shaftKw / etaM;
  const dailyEnergyKwh = motorKw * 24;

  return { valid: true, hydraulicKw, shaftKw, motorKw, dailyEnergyKwh };
}

export default function PumpPowerCalculatorClient() {
  const [flowStr, setFlowStr] = useState('100');
  const [headStr, setHeadStr] = useState('30');
  const [etaPStr, setEtaPStr] = useState('0.75');
  const [etaMStr, setEtaMStr] = useState('0.95');
  const [rhoStr, setRhoStr] = useState('1000');

  const res = solvePumpPower(flowStr, headStr, etaPStr, etaMStr, rhoStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pump Hydraulic & Shaft Power Report', ''],
      ['Flow Rate (m3/h)', flowStr],
      ['Total Dynamic Head (m)', headStr],
      ['Pump Hydraulic Efficiency', etaPStr],
      ['Motor Efficiency', etaMStr],
      ['Fluid Density (kg/m3)', rhoStr],
      ['Hydraulic Power (kW)', res.hydraulicKw.toFixed(4)],
      ['Shaft Power (kW)', res.shaftKw.toFixed(4)],
      ['Electrical Input Power (kW)', res.motorKw.toFixed(4)],
      ['24h Continuous Energy (kWh/day)', res.dailyEnergyKwh.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pump-power-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Flow Rate (m^3/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-flow" value={flowStr} onChange={(e) => setFlowStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Head H (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-head" value={headStr} onChange={(e) => setHeadStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Fluid Density (kg/m^3)</label>
            <input type="text" inputMode="decimal" data-testid="input-rho" value={rhoStr} onChange={(e) => setRhoStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setFlowStr('100'); setHeadStr('30'); setEtaPStr('0.75'); setEtaMStr('0.95'); setRhoStr('1000'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Hydraulic Power</div>
                    <div className="text-2xl font-black text-blue-700" data-testid="res-ph">{res.hydraulicKw.toFixed(4)} kW</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Shaft Power</div>
                    <div className="text-2xl font-black text-emerald-700" data-testid="res-ps">{res.shaftKw.toFixed(4)} kW</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Motor Input</div>
                    <div className="text-2xl font-black text-orange-700" data-testid="res-pm">{res.motorKw.toFixed(4)} kW</div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-600">24-Hour Continuous Operation Energy</span>
                  <span className="font-black text-slate-900">{res.dailyEnergyKwh.toFixed(2)} kWh/day</span>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Uses ISO 80000 gravity g = 9.80665 m/s^2: Ph = rho*g*(Q/3600)*H/1000; Ps = Ph/eta_pump; Pm = Ps/eta_motor.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
