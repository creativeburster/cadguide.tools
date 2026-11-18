'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

interface RebarDevResult {
  valid: boolean;
  error?: string;
  barForceKn: number;
  ldMm: number;
  ldRatioDb: number;
  ldhMm: number;
  lapMm: number;
}

function solveRebarDevelopment(
  dbStr: string,
  fyStr: string,
  bondStr: string,
  kPosStr: string,
  kCoatStr: string,
  kHookStr: string,
  kLapStr: string
): RebarDevResult {
  if ([dbStr, fyStr, bondStr, kPosStr, kCoatStr, kHookStr, kLapStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All bar geometry, bond stress, and modifier factor inputs are required.', barForceKn: 0, ldMm: 0, ldRatioDb: 0, ldhMm: 0, lapMm: 0 };
  }
  const db = Number(dbStr);
  const fy = Number(fyStr);
  const tauB = Number(bondStr);
  const kPos = Number(kPosStr);
  const kCoat = Number(kCoatStr);
  const kHook = Number(kHookStr);
  const kLap = Number(kLapStr);

  if (![db, fy, tauB, kPos, kCoat, kHook, kLap].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', barForceKn: 0, ldMm: 0, ldRatioDb: 0, ldhMm: 0, lapMm: 0 };
  }
  if (db <= 0 || fy <= 0 || tauB <= 0 || kPos <= 0 || kCoat <= 0 || kHook <= 0 || kLap <= 0) {
    return { valid: false, error: 'Require positive diameter, yield strength, design bond stress, and multiplier factors.', barForceKn: 0, ldMm: 0, ldRatioDb: 0, ldhMm: 0, lapMm: 0 };
  }

  // Axial force equilibrium: (pi/4 * db^2) * fy = pi * db * Ld_basic * tau_b => Ld_basic = (db * fy) / (4 * tau_b)
  const barAreaMm2 = (Math.PI * db * db) / 4;
  const barForceKn = (barAreaMm2 * fy) / 1000;
  const ldMm = ((db * fy) / (4 * tauB)) * kPos * kCoat;
  const ldRatioDb = ldMm / db;
  const ldhMm = ldMm * kHook;
  const lapMm = ldMm * kLap;

  return { valid: true, barForceKn, ldMm, ldRatioDb, ldhMm, lapMm };
}

export default function RebarDevelopmentClient() {
  const [dbStr, setDbStr] = useState('20');
  const [fyStr, setFyStr] = useState('420');
  const [bondStr, setBondStr] = useState('2.5');
  const [kPosStr, setKPosStr] = useState('1.0');
  const [kCoatStr, setKCoatStr] = useState('1.0');
  const [kHookStr, setKHookStr] = useState('0.7');
  const [kLapStr, setKLapStr] = useState('1.3');

  const res = solveRebarDevelopment(dbStr, fyStr, bondStr, kPosStr, kCoatStr, kHookStr, kLapStr);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Rebar Development & Lap Splice Equilibrium Report', ''],
      ['Bar Diameter db (mm)', dbStr],
      ['Design Yield Stress fy (MPa)', fyStr],
      ['Average Design Bond Stress tau_b (MPa)', bondStr],
      ['Casting Position Factor k_pos', kPosStr],
      ['Coating Factor k_coat', kCoatStr],
      ['Hook Factor k_hook', kHookStr],
      ['Lap Splice Multiplier k_lap', kLapStr],
      ['Yield Tension Force (kN)', res.barForceKn.toFixed(3)],
      ['Straight Tension Development Length Ld (mm)', res.ldMm.toFixed(2)],
      ['Ratio Ld / db (x diameter)', res.ldRatioDb.toFixed(2)],
      ['Hooked Development Length Ldh (mm)', res.ldhMm.toFixed(2)],
      ['Tension Lap Splice Length L_lap (mm)', res.lapMm.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rebar-development-length.csv';
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
                setDbStr('20');
                setFyStr('420');
                setBondStr('2.5');
                setKPosStr('1.0');
                setKCoatStr('1.0');
                setKHookStr('0.7');
                setKLapStr('1.3');
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bar Dia db (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-db" value={dbStr} onChange={(e) => setDbStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Yield fy (MPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-fy" value={fyStr} onChange={(e) => setFyStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Design Bond Stress tau_b (MPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-bond" value={bondStr} onChange={(e) => setBondStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Position k_pos</label>
              <input type="text" inputMode="decimal" data-testid="input-kpos" value={kPosStr} onChange={(e) => setKPosStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Coating k_coat</label>
              <input type="text" inputMode="decimal" data-testid="input-kcoat" value={kCoatStr} onChange={(e) => setKCoatStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Hook Factor k_hook</label>
              <input type="text" inputMode="decimal" data-testid="input-khook" value={kHookStr} onChange={(e) => setKHookStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Lap Factor k_lap</label>
              <input type="text" inputMode="decimal" data-testid="input-klap" value={kLapStr} onChange={(e) => setKLapStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Equilibrium Results</h2>
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                disabled={!res.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/40 rounded-2xl p-6 border border-orange-100">
                  <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Tension Development Length Ld</div>
                  <div className="text-4xl sm:text-5xl font-black text-slate-900" data-testid="res-ld">{res.ldMm.toFixed(1)} mm</div>
                  <div className="text-sm font-bold text-slate-600 mt-1">Yield Tension Force: {res.barForceKn.toFixed(2)} kN</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Ld / db Ratio</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-ratio">{res.ldRatioDb.toFixed(2)} db</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase mb-1">Hooked Length Ldh</div>
                    <div className="text-2xl font-black text-blue-800" data-testid="res-ldh">{res.ldhMm.toFixed(1)} mm</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase mb-1">Lap Splice Length</div>
                    <div className="text-2xl font-black text-emerald-800" data-testid="res-lap">{res.lapMm.toFixed(1)} mm</div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Force equilibrium along perimeter pi * db * Ld * tau_b = (pi / 4) * db^2 * fy gives Ld = (db * fy * k_pos * k_coat) / (4 * tau_b). Always verify minimum anchorage lengths and splice factors against your local concrete structural code.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
