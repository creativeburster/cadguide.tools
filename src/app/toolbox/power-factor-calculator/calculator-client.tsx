'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface PowerFactorResult {
  valid: boolean;
  error?: string;
  qcKvar: number;
  s1Kva: number;
  s2Kva: number;
  q1Kvar: number;
  q2Kvar: number;
  iBeforeA: number;
  iAfterA: number;
  currentReductionPct: number;
}

function solvePowerFactor(
  realPowerKwStr: string,
  pf1Str: string,
  pf2Str: string,
  lineVoltageVStr: string,
  phases: '3ph' | '1ph'
): PowerFactorResult {
  if ([realPowerKwStr, pf1Str, pf2Str, lineVoltageVStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'Real power, initial PF, target PF, and voltage are required.', qcKvar: 0, s1Kva: 0, s2Kva: 0, q1Kvar: 0, q2Kvar: 0, iBeforeA: 0, iAfterA: 0, currentReductionPct: 0 };
  }
  const P = Number(realPowerKwStr);
  const pf1 = Number(pf1Str);
  const pf2 = Number(pf2Str);
  const V = Number(lineVoltageVStr);

  if (![P, pf1, pf2, V].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', qcKvar: 0, s1Kva: 0, s2Kva: 0, q1Kvar: 0, q2Kvar: 0, iBeforeA: 0, iAfterA: 0, currentReductionPct: 0 };
  }
  if (P <= 0 || V <= 0) {
    return { valid: false, error: 'Real power P and system voltage V must be > 0.', qcKvar: 0, s1Kva: 0, s2Kva: 0, q1Kvar: 0, q2Kvar: 0, iBeforeA: 0, iAfterA: 0, currentReductionPct: 0 };
  }
  if (pf1 <= 0 || pf1 > 1 || pf2 <= 0 || pf2 > 1) {
    return { valid: false, error: 'Power factors must satisfy 0 < PF <= 1.0.', qcKvar: 0, s1Kva: 0, s2Kva: 0, q1Kvar: 0, q2Kvar: 0, iBeforeA: 0, iAfterA: 0, currentReductionPct: 0 };
  }
  if (pf2 < pf1) {
    return { valid: false, error: 'Target power factor must be greater than or equal to initial power factor.', qcKvar: 0, s1Kva: 0, s2Kva: 0, q1Kvar: 0, q2Kvar: 0, iBeforeA: 0, iAfterA: 0, currentReductionPct: 0 };
  }

  const phi1 = Math.acos(pf1);
  const phi2 = Math.acos(pf2);
  const q1Kvar = P * Math.tan(phi1);
  const q2Kvar = P * Math.tan(phi2);
  const qcKvar = q1Kvar - q2Kvar;
  const s1Kva = P / pf1;
  const s2Kva = P / pf2;
  const vDenom = phases === '3ph' ? Math.sqrt(3) * V : V;
  const iBeforeA = (s1Kva * 1000) / vDenom;
  const iAfterA = (s2Kva * 1000) / vDenom;
  const currentReductionPct = (1 - iAfterA / iBeforeA) * 100;

  return { valid: true, qcKvar, s1Kva, s2Kva, q1Kvar, q2Kvar, iBeforeA, iAfterA, currentReductionPct };
}

export default function PowerFactorCalculatorClient() {
  const [pStr, setPStr] = useState('100');
  const [pf1Str, setPf1Str] = useState('0.75');
  const [pf2Str, setPf2Str] = useState('0.95');
  const [voltStr, setVoltStr] = useState('400');
  const [phases, setPhases] = useState<'3ph' | '1ph'>('3ph');

  const res = solvePowerFactor(pStr, pf1Str, pf2Str, voltStr, phases);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Power Factor Correction Report', ''],
      ['Real Power P (kW)', pStr],
      ['Initial Power Factor', pf1Str],
      ['Target Power Factor', pf2Str],
      ['System Voltage (V)', voltStr],
      ['System Phase Configuration', phases === '3ph' ? '3-Phase' : '1-Phase'],
      ['Required Capacitor Qc (kvar)', res.qcKvar.toFixed(4)],
      ['Apparent Power Before S1 (kVA)', res.s1Kva.toFixed(4)],
      ['Apparent Power After S2 (kVA)', res.s2Kva.toFixed(4)],
      ['Line Current Before (A)', res.iBeforeA.toFixed(2)],
      ['Line Current After (A)', res.iAfterA.toFixed(2)],
      ['Current Reduction (%)', res.currentReductionPct.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'power-factor-correction.csv';
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Real Power P (kW)</label>
            <input type="text" inputMode="decimal" data-testid="input-power" value={pStr} onChange={(e) => setPStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Current PF</label>
              <input type="text" inputMode="decimal" data-testid="input-pf1" value={pf1Str} onChange={(e) => setPf1Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Target PF</label>
              <input type="text" inputMode="decimal" data-testid="input-pf2" value={pf2Str} onChange={(e) => setPf2Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Voltage (V)</label>
              <input type="text" inputMode="decimal" data-testid="input-voltage" value={voltStr} onChange={(e) => setVoltStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Phase System</label>
              <select value={phases} onChange={(e) => setPhases(e.target.value as '3ph' | '1ph')} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold">
                <option value="3ph">3-Phase</option>
                <option value="1ph">1-Phase</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setPStr('100'); setPf1Str('0.75'); setPf2Str('0.95'); setVoltStr('400'); setPhases('3ph'); }}
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
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">
                {res.error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Required Reactive Compensation Qc</div>
                    <div className="text-3xl font-black text-blue-700" data-testid="res-qc">
                      {res.qcKvar.toFixed(3)}<span className="text-lg text-blue-400"> kvar</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Line Current Reduction</div>
                    <div className="text-3xl font-black text-emerald-700" data-testid="res-reduction">
                      {res.currentReductionPct.toFixed(2)}<span className="text-lg text-emerald-500"> %</span>
                    </div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">
                      {res.iBeforeA.toFixed(1)} A -&gt; {res.iAfterA.toFixed(1)} A
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Apparent Power Before (S1)</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-s1">{res.s1Kva.toFixed(3)} kVA</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">Apparent Power After (S2)</div>
                    <div className="text-xl font-black text-slate-900" data-testid="res-s2">{res.s2Kva.toFixed(3)} kVA</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              AC Power Triangle (Wikipedia Power Factor): S = P / PF; Qc = P * (tan(acos(PF1)) - tan(acos(PF2))). Assumes sinusoidal linear load without harmonic detuning reactors.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
