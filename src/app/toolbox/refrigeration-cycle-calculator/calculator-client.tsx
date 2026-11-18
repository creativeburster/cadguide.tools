'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

interface RefrigerationResult {
  valid: boolean;
  error?: string;
  h2ActualKjKg: number;
  refrigEffectKjKg: number;
  actualWorkKjKg: number;
  cop: number;
  coolingKw: number;
  compressorKw: number;
  condenserHeatKw: number;
}

function solveRefrigerationCycle(
  h1Str: string,
  h2sStr: string,
  h3Str: string,
  etaIsPctStr: string,
  massFlowStr: string
): RefrigerationResult {
  if ([h1Str, h2sStr, h3Str, etaIsPctStr, massFlowStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All enthalpy, isentropic efficiency, and mass flow inputs are required.', h2ActualKjKg: 0, refrigEffectKjKg: 0, actualWorkKjKg: 0, cop: 0, coolingKw: 0, compressorKw: 0, condenserHeatKw: 0 };
  }
  const h1 = Number(h1Str);
  const h2s = Number(h2sStr);
  const h3 = Number(h3Str);
  const etaIs = Number(etaIsPctStr);
  const m = Number(massFlowStr);

  if (![h1, h2s, h3, etaIs, m].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', h2ActualKjKg: 0, refrigEffectKjKg: 0, actualWorkKjKg: 0, cop: 0, coolingKw: 0, compressorKw: 0, condenserHeatKw: 0 };
  }
  if (h1 <= h3 || h2s <= h1 || etaIs <= 0 || etaIs > 100 || m <= 0) {
    return { valid: false, error: 'Require h2s > h1 > h3, 0 < isentropic efficiency <= 100%, and mass flow > 0.', h2ActualKjKg: 0, refrigEffectKjKg: 0, actualWorkKjKg: 0, cop: 0, coolingKw: 0, compressorKw: 0, condenserHeatKw: 0 };
  }

  // Isenthalpic expansion: h4 = h3; Actual discharge: h2 = h1 + (h2s - h1) / eta_is
  const h2ActualKjKg = h1 + (h2s - h1) / (etaIs / 100);
  const refrigEffectKjKg = h1 - h3;
  const actualWorkKjKg = h2ActualKjKg - h1;
  const cop = refrigEffectKjKg / actualWorkKjKg;
  const coolingKw = m * refrigEffectKjKg;
  const compressorKw = m * actualWorkKjKg;
  const condenserHeatKw = coolingKw + compressorKw;

  return { valid: true, h2ActualKjKg, refrigEffectKjKg, actualWorkKjKg, cop, coolingKw, compressorKw, condenserHeatKw };
}

export default function RefrigerationCycleCalculatorClient() {
  const [h1Str, setH1Str] = useState('400');
  const [h2sStr, setH2sStr] = useState('440');
  const [h3Str, setH3Str] = useState('250');
  const [etaStr, setEtaStr] = useState('80');
  const [massStr, setMassStr] = useState('0.1');

  const res = solveRefrigerationCycle(h1Str, h2sStr, h3Str, etaStr, massStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Vapor-Compression Refrigeration Cycle Report', ''],
      ['Evaporator Outlet h1 (kJ/kg)', h1Str],
      ['Isentropic Compressor Outlet h2s (kJ/kg)', h2sStr],
      ['Condenser Outlet / Expansion Inlet h3=h4 (kJ/kg)', h3Str],
      ['Compressor Isentropic Efficiency (%)', etaStr],
      ['Refrigerant Mass Flow (kg/s)', massStr],
      ['Actual Compressor Outlet h2 (kJ/kg)', res.h2ActualKjKg.toFixed(3)],
      ['Refrigeration Effect q_e (kJ/kg)', res.refrigEffectKjKg.toFixed(3)],
      ['Specific Compressor Work w_c (kJ/kg)', res.actualWorkKjKg.toFixed(3)],
      ['COP_R (Cooling)', res.cop.toFixed(4)],
      ['Cooling Capacity Q_e (kW)', res.coolingKw.toFixed(4)],
      ['Compressor Input Power W_c (kW)', res.compressorKw.toFixed(4)],
      ['Condenser Heat Rejection Q_cond (kW)', res.condenserHeatKw.toFixed(4)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refrigeration-cycle-cop.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">State Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Evap Outlet h1 (kJ/kg)</label>
            <input type="text" inputMode="decimal" data-testid="input-h1" value={h1Str} onChange={(e) => setH1Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Isentropic Outlet h2s (kJ/kg)</label>
            <input type="text" inputMode="decimal" data-testid="input-h2s" value={h2sStr} onChange={(e) => setH2sStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Condenser Outlet h3=h4 (kJ/kg)</label>
            <input type="text" inputMode="decimal" data-testid="input-h3" value={h3Str} onChange={(e) => setH3Str(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Isentropic Eff (%)</label>
              <input type="text" inputMode="decimal" data-testid="input-eta" value={etaStr} onChange={(e) => setEtaStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Mass Flow (kg/s)</label>
              <input type="text" inputMode="decimal" data-testid="input-mass" value={massStr} onChange={(e) => setMassStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setH1Str('400'); setH2sStr('440'); setH3Str('250'); setEtaStr('80'); setMassStr('0.1'); }}
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Thermodynamic Cycle Results</h2>
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
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Coefficient of Performance (COP)</div>
                  <div className="text-4xl font-black text-orange-800" data-testid="res-cop">{res.cop.toFixed(3)}</div>
                  <div className="text-xs font-bold text-orange-700 mt-1" data-testid="res-h2">Actual h2: {res.h2ActualKjKg.toFixed(2)} kJ/kg</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Cooling Capacity</div>
                  <div className="text-4xl font-black text-purple-800" data-testid="res-qe-kw">{res.coolingKw.toFixed(3)} kW</div>
                  <div className="text-xs font-bold text-purple-700 mt-1" data-testid="res-qcond">Condenser Heat Rejection: {res.condenserHeatKw.toFixed(3)} kW</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Refrigeration Effect q_e</div>
                  <div className="text-2xl font-black text-blue-800" data-testid="res-qe">{res.refrigEffectKjKg.toFixed(2)} kJ/kg</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Actual Compressor Work</div>
                  <div className="text-2xl font-black text-green-800" data-testid="res-wc">{res.actualWorkKjKg.toFixed(2)} kJ/kg</div>
                  <div className="text-xs font-bold text-green-700 mt-1" data-testid="res-wc-kw">Power: {res.compressorKw.toFixed(3)} kW</div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                First-law energy balance for steady vapor-compression cycle: h4 = h3 (isenthalpic throttling), h2 = h1 + (h2s - h1) / eta_is, q_e = h1 - h3, COP = q_e / (h2 - h1), Q_cond = Q_e + W_c.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
