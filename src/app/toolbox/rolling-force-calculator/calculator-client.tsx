'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RollingResult {
  valid: boolean;
  error?: string;
  draftMm: number;
  reductionPct: number;
  contactLenMm: number;
  frictionFactorQp: number;
  rollForceKn: number;
  totalTorqueKnm: number;
  drivePowerKw: number;
}

function solveRollingForce(
  sigmaStr: string,
  radiusMmStr: string,
  h0Str: string,
  h1Str: string,
  widthMmStr: string,
  muStr: string,
  armCoeffStr: string,
  rpmStr: string
): RollingResult {
  if ([sigmaStr, radiusMmStr, h0Str, h1Str, widthMmStr, muStr, armCoeffStr, rpmStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All flow stress, roll geometry, pass reduction, friction, and speed inputs are required.', draftMm: 0, reductionPct: 0, contactLenMm: 0, frictionFactorQp: 0, rollForceKn: 0, totalTorqueKnm: 0, drivePowerKw: 0 };
  }
  const sigma = Number(sigmaStr);
  const R = Number(radiusMmStr);
  const h0 = Number(h0Str);
  const h1 = Number(h1Str);
  const w = Number(widthMmStr);
  const mu = Number(muStr);
  const arm = Number(armCoeffStr);
  const rpm = Number(rpmStr);

  if (![sigma, R, h0, h1, w, mu, arm, rpm].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', draftMm: 0, reductionPct: 0, contactLenMm: 0, frictionFactorQp: 0, rollForceKn: 0, totalTorqueKnm: 0, drivePowerKw: 0 };
  }
  const draftMm = h0 - h1;
  if (sigma <= 0 || R <= 0 || h1 <= 0 || draftMm <= 0 || w <= 0 || mu < 0 || arm <= 0 || rpm < 0) {
    return { valid: false, error: 'Require positive flow stress, roll radius, width, arm coefficient, h0 > h1 > 0, mu >= 0, and rpm >= 0.', draftMm: 0, reductionPct: 0, contactLenMm: 0, frictionFactorQp: 0, rollForceKn: 0, totalTorqueKnm: 0, drivePowerKw: 0 };
  }

  const reductionPct = (draftMm / h0) * 100;
  const contactLenMm = Math.sqrt(R * draftMm);
  const frictionFactorQp = 1 + (mu * contactLenMm) / (h0 + h1);
  const rollForceKn = (sigma * frictionFactorQp * w * contactLenMm) / 1000;
  const totalTorqueKnm = 2 * arm * rollForceKn * (contactLenMm / 1000);
  const drivePowerKw = (2 * Math.PI * rpm * totalTorqueKnm) / 60;

  return { valid: true, draftMm, reductionPct, contactLenMm, frictionFactorQp, rollForceKn, totalTorqueKnm, drivePowerKw };
}

export default function RollingForceCalculatorClient() {
  const [sigmaStr, setSigmaStr] = useState('300');
  const [rStr, setRStr] = useState('200');
  const [h0Str, setH0Str] = useState('10');
  const [h1Str, setH1Str] = useState('8');
  const [wStr, setWStr] = useState('500');
  const [muStr, setMuStr] = useState('0.12');
  const [armStr, setArmStr] = useState('0.5');
  const [rpmStr, setRpmStr] = useState('60');

  const res = solveRollingForce(sigmaStr, rStr, h0Str, h1Str, wStr, muStr, armStr, rpmStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Flat Rolling Force, Torque & Mill Power Report', ''],
      ['Mean Flow Stress (MPa)', sigmaStr],
      ['Work Roll Radius R (mm)', rStr],
      ['Entry / Exit Thickness h0 / h1 (mm)', `${h0Str} / ${h1Str}`],
      ['Strip Width w (mm)', wStr],
      ['Friction Coefficient mu', muStr],
      ['Lever Arm Factor / Roll RPM', `${armStr} / ${rpmStr}`],
      ['Projected Contact Arc Lp (mm)', res.contactLenMm.toFixed(4)],
      ['Friction Stress Multiplier Qp', res.frictionFactorQp.toFixed(4)],
      ['Rolling Separating Force F (kN)', res.rollForceKn.toFixed(3)],
      ['Two-Roll Mill Torque M (kN*m)', res.totalTorqueKnm.toFixed(4)],
      ['Drive Power P (kW)', res.drivePowerKw.toFixed(3)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flat-rolling-force.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Pass Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Flow Stress (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-sigma" value={sigmaStr} onChange={(e) => setSigmaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Roll Radius R (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-r" value={rStr} onChange={(e) => setRStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Entry h0 (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-h0" value={h0Str} onChange={(e) => setH0Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Exit h1 (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-h1" value={h1Str} onChange={(e) => setH1Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Strip Width w (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-width" value={wStr} onChange={(e) => setWStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Friction mu</label>
              <input type="text" inputMode="decimal" data-testid="input-mu" value={muStr} onChange={(e) => setMuStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Lever Arm Factor</label>
              <input type="text" inputMode="decimal" data-testid="input-arm" value={armStr} onChange={(e) => setArmStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Roll Speed (rpm)</label>
              <input type="text" inputMode="decimal" data-testid="input-rpm" value={rpmStr} onChange={(e) => setRpmStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSigmaStr('300'); setRStr('200'); setH0Str('10'); setH1Str('8');
              setWStr('500'); setMuStr('0.12'); setArmStr('0.5'); setRpmStr('60');
            }}
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Rolling Mechanics Results</h2>
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
                  <div className="text-xs font-black text-blue-500 uppercase mb-1">Separating Roll Force</div>
                  <div className="text-3xl font-black text-blue-800" data-testid="res-force">{res.rollForceKn.toFixed(2)} kN</div>
                  <div className="text-xs font-bold text-blue-700 mt-1">Qp = {res.frictionFactorQp.toFixed(4)} | Red {res.reductionPct.toFixed(1)}%</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-500 uppercase mb-1">Projected Contact Arc Lp</div>
                  <div className="text-3xl font-black text-emerald-800" data-testid="res-lp">{res.contactLenMm.toFixed(3)} mm</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase mb-1">Two-Roll Torque M</div>
                  <div className="text-3xl font-black text-orange-800" data-testid="res-torque">{res.totalTorqueKnm.toFixed(3)} kN*m</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase mb-1">Total Drive Power</div>
                  <div className="text-3xl font-black text-purple-800" data-testid="res-power">{res.drivePowerKw.toFixed(2)} kW</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Lp = sqrt(R * (h0 - h1)); Qp = 1 + mu * Lp / (h0 + h1); F = sigma_f * Qp * w * Lp; Total Torque M = 2 * a_arm * F * Lp; P = 2 * pi * N * M / 60.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
