'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RackPinionResult {
  valid: boolean;
  error?: string;
  pitchDiaMm: number;
  linearPitchMm: number;
  travelPerRevMm: number;
  linearSpeedMs: number;
  axialThrustN: number;
}

function solveRackPinion(
  modMmStr: string,
  teethStr: string,
  rpmStr: string,
  torqueNmStr: string,
  effPctStr: string
): RackPinionResult {
  if ([modMmStr, teethStr, rpmStr, torqueNmStr, effPctStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All gear module, tooth count, speed, torque, and efficiency inputs are required.', pitchDiaMm: 0, linearPitchMm: 0, travelPerRevMm: 0, linearSpeedMs: 0, axialThrustN: 0 };
  }
  const m = Number(modMmStr);
  const z = Number(teethStr);
  const n = Number(rpmStr);
  const T = Number(torqueNmStr);
  const eta = Number(effPctStr);

  if (![m, z, n, T, eta].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', pitchDiaMm: 0, linearPitchMm: 0, travelPerRevMm: 0, linearSpeedMs: 0, axialThrustN: 0 };
  }
  if (m <= 0 || !Number.isInteger(z) || z < 6 || n < 0 || T < 0 || eta <= 0 || eta > 100) {
    return { valid: false, error: 'Require module > 0, integer pinion teeth >= 6, rpm >= 0, torque >= 0, and 0 < efficiency <= 100%.', pitchDiaMm: 0, linearPitchMm: 0, travelPerRevMm: 0, linearSpeedMs: 0, axialThrustN: 0 };
  }

  const pitchDiaMm = m * z;
  const linearPitchMm = Math.PI * m;
  const travelPerRevMm = Math.PI * pitchDiaMm;
  const linearSpeedMs = (Math.PI * (pitchDiaMm / 1000) * n) / 60;
  const axialThrustN = ((2000 * T) / pitchDiaMm) * (eta / 100);

  return { valid: true, pitchDiaMm, linearPitchMm, travelPerRevMm, linearSpeedMs, axialThrustN };
}

export default function RackPinionCalculatorClient() {
  const [modStr, setModStr] = useState('2');
  const [teethStr, setTeethStr] = useState('20');
  const [rpmStr, setRpmStr] = useState('100');
  const [torqueStr, setTorqueStr] = useState('10');
  const [effStr, setEffStr] = useState('95');

  const res = solveRackPinion(modStr, teethStr, rpmStr, torqueStr, effStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Rack & Pinion Kinematics Report', ''],
      ['Normal Module m (mm)', modStr],
      ['Pinion Teeth z', teethStr],
      ['Pinion Speed (rpm)', rpmStr],
      ['Input Torque (N*m)', torqueStr],
      ['Meshing Efficiency (%)', effStr],
      ['Pinion Pitch Diameter (mm)', res.pitchDiaMm.toFixed(3)],
      ['Rack Circular Pitch (mm)', res.linearPitchMm.toFixed(4)],
      ['Linear Travel per Rev (mm)', res.travelPerRevMm.toFixed(4)],
      ['Linear Velocity (m/s)', res.linearSpeedMs.toFixed(6)],
      ['Effective Rack Thrust (N)', res.axialThrustN.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rack-pinion-drive.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Module m (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-module" value={modStr} onChange={(e) => setModStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pinion Teeth z</label>
              <input type="text" inputMode="numeric" data-testid="input-teeth" value={teethStr} onChange={(e) => setTeethStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Speed (rpm)</label>
              <input type="text" inputMode="decimal" data-testid="input-rpm" value={rpmStr} onChange={(e) => setRpmStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Torque (N*m)</label>
              <input type="text" inputMode="decimal" data-testid="input-torque" value={torqueStr} onChange={(e) => setTorqueStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Efficiency (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-eff" value={effStr} onChange={(e) => setEffStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>

          <button type="button" onClick={() => { setModStr('2'); setTeethStr('20'); setRpmStr('100'); setTorqueStr('10'); setEffStr('95'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
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
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50">
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
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Linear Speed</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-speed">{res.linearSpeedMs.toFixed(6)}<span className="text-lg text-blue-400"> m/s</span></div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Linear Thrust Force</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-force">{res.axialThrustN.toFixed(3)}<span className="text-lg text-emerald-500"> N</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Travel / Revolution</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-travel">{res.travelPerRevMm.toFixed(4)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Pitch Diameter d = m*z</div>
                    <div className="text-xl font-black text-slate-900">{res.pitchDiaMm.toFixed(2)} mm</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Linear Pitch p = pi*m</div>
                    <div className="text-xl font-black text-slate-900">{res.linearPitchMm.toFixed(4)} mm</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              d = m * z; v = pi * (d/1000) * n / 60; F = (2000 * T / d) * eta.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
