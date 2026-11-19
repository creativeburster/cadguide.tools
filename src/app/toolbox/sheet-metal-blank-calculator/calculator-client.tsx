'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(2);
  if (Math.abs(n) >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

const DEFAULT_INPUTS = ['40', '30', '90', '4', '2', '0.33'];

export default function SheetMetalBlankCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const L1 = parseFinite(inputs[0]);
    const L2 = parseFinite(inputs[1]);
    const angleDeg = parseFinite(inputs[2]);
    const R = parseFinite(inputs[3]);
    const T = parseFinite(inputs[4]);
    const K = parseFinite(inputs[5]);

    if (L1 === null || L2 === null || angleDeg === null || R === null || T === null || K === null) {
      return { valid: false as const, error: 'Enter numeric values in all fields to compute blank length.' };
    }
    if (angleDeg <= 0 || angleDeg >= 180) {
      return { valid: false as const, error: 'Bend angle must satisfy 0 < angle < 180 deg.' };
    }
    if (L1 < 0 || L2 < 0 || R < 0 || T <= 0 || K < 0 || K > 1) {
      return { valid: false as const, error: 'Thickness T must be > 0, K-factor in [0, 1], and L1, L2, R >= 0.' };
    }

    const aRad = (angleDeg * Math.PI) / 180;
    const BA = aRad * (R + K * T);
    const BL = L1 + L2 + BA;
    const OSSB = (R + T) * Math.tan(aRad / 2);
    const BD = 2 * OSSB - BA;

    return { valid: true as const, L1, L2, angleDeg, R, T, K, BA, BL, OSSB, BD };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Sheet Metal Blank Size Report (Bend Allowance Tangent-Leg Method)',
      '# Formula: BA = A*(pi/180)*(R + K*T), Blank Length = Straight_Leg_1 + Straight_Leg_2 + BA',
      'Parameter,Value,Unit',
      `Straight Leg 1,${result.L1},mm`,
      `Straight Leg 2,${result.L2},mm`,
      `Bend Angle A,${result.angleDeg},deg`,
      `Inside Bend Radius R,${result.R},mm`,
      `Material Thickness T,${result.T},mm`,
      `K-Factor,${result.K},-`,
      `Bend Allowance BA,${result.BA.toFixed(6)},mm`,
      `Blank Length BL,${result.BL.toFixed(6)},mm`,
      `Outside Setback OSSB,${result.OSSB.toFixed(6)},mm`,
      `Bend Deduction BD,${result.BD.toFixed(6)},mm`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sheet-metal-blank-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Straight Leg 1 (mm)</label>
              <input
                type="text"
                data-testid="input-l1"
                value={inputs[0]}
                onChange={e => updateInput(0, e.target.value)}
                placeholder="40"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Straight Leg 2 (mm)</label>
              <input
                type="text"
                data-testid="input-l2"
                value={inputs[1]}
                onChange={e => updateInput(1, e.target.value)}
                placeholder="30"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Bend Angle A (deg)</label>
            <input
              type="text"
              data-testid="input-angle"
              value={inputs[2]}
              onChange={e => updateInput(2, e.target.value)}
              placeholder="90"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Inside Radius R (mm)</label>
            <input
              type="text"
              data-testid="input-radius"
              value={inputs[3]}
              onChange={e => updateInput(3, e.target.value)}
              placeholder="4"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Thickness T (mm)</label>
              <input
                type="text"
                data-testid="input-thickness"
                value={inputs[4]}
                onChange={e => updateInput(4, e.target.value)}
                placeholder="2"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">K-Factor (0 to 1)</label>
              <input
                type="text"
                data-testid="input-k"
                value={inputs[5]}
                onChange={e => updateInput(5, e.target.value)}
                placeholder="0.33"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Bend Allowance (BA)</div>
                <div data-testid="output-ba" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.BA) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Blank Length (L1 + L2 + BA)</div>
                <div data-testid="output-bl" className="text-3xl font-black text-green-800">
                  {result.valid ? formatNum(result.BL) : '—'}
                  {result.valid && <span className="text-lg text-green-600 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Outside Setback (OSSB)</div>
                <div data-testid="output-ossb" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.OSSB) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Bend Deduction (BD)</div>
                <div data-testid="output-bd" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.BD) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">mm</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Flat blank development from straight tangent legs: Blank Length = Straight Leg 1 + Straight Leg 2 + BA, where BA = A &middot; (pi / 180) &middot; (R + K &middot; T) (Wikipedia: Bending metalworking).
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
