'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

function parseInput(val: string): number | null {
  const trimmed = val.trim();
  if (trimmed === '') return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

export default function BearingStaticLoadCalculatorClient() {
  const [frStr, setFrStr] = useState('10');
  const [faStr, setFaStr] = useState('2');
  const [x0Str, setX0Str] = useState('0.6');
  const [y0Str, setY0Str] = useState('0.5');
  const [s0Str, setS0Str] = useState('1.5');

  const result = useMemo(() => {
    const Fr = parseInput(frStr);
    const Fa = parseInput(faStr);
    const X0 = parseInput(x0Str);
    const Y0 = parseInput(y0Str);
    const s0 = parseInput(s0Str);

    if (
      Fr === null ||
      Fa === null ||
      X0 === null ||
      Y0 === null ||
      s0 === null ||
      Fr < 0 ||
      Fa < 0 ||
      X0 < 0 ||
      Y0 < 0 ||
      s0 <= 0
    ) {
      return { P0: NaN, C0: NaN };
    }

    // Formula per ISO 76:2006 (Rolling bearings — Static load ratings):
    // P0r = max(X0*Fr + Y0*Fa, Fr)
    // Required minimum basic static load rating: C0 = s0 * P0
    const P0 = Math.max(X0 * Fr + Y0 * Fa, Fr);
    const C0 = s0 * P0;
    return { P0, C0 };
  }, [frStr, faStr, x0Str, y0Str, s0Str]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(6);
  };

  const handleReset = () => {
    setFrStr('10');
    setFaStr('2');
    setX0Str('0.6');
    setY0Str('0.5');
    setS0Str('1.5');
  };

  const downloadCsv = () => {
    const csv = [
      ['Bearing Static Load Capacity Report (ISO 76:2006)', ''],
      ['Calculation Date', new Date().toISOString().split('T')[0]],
      ['', ''],
      ['Input Parameters', ''],
      ['Radial Load Fr (kN)', frStr],
      ['Axial Load Fa (kN)', faStr],
      ['Static Radial Factor X0', x0Str],
      ['Static Axial Factor Y0', y0Str],
      ['Static Safety Factor s0', s0Str],
      ['', ''],
      ['Calculated Results', ''],
      ['Equivalent Static Load P0 (kN)', isNaN(result.P0) ? '—' : result.P0.toFixed(3)],
      ['Required Static Load Rating C0 (kN)', isNaN(result.C0) ? '—' : result.C0.toFixed(3)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bearing-static-load-capacity-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              data-testid="btn-reset"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Radial Load Fr (kN)</label>
            <input
              data-testid="input-fr"
              type="text"
              value={frStr}
              onChange={e => setFrStr(e.target.value)}
              placeholder="10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Axial Load Fa (kN)</label>
            <input
              data-testid="input-fa"
              type="text"
              value={faStr}
              onChange={e => setFaStr(e.target.value)}
              placeholder="2"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">X0 (Radial)</label>
              <input
                data-testid="input-x0"
                type="text"
                value={x0Str}
                onChange={e => setX0Str(e.target.value)}
                placeholder="0.6"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Y0 (Axial)</label>
              <input
                data-testid="input-y0"
                type="text"
                value={y0Str}
                onChange={e => setY0Str(e.target.value)}
                placeholder="0.5"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Safety Factor s0</label>
            <input
              data-testid="input-s0"
              type="text"
              value={s0Str}
              onChange={e => setS0Str(e.target.value)}
              placeholder="1.5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Safety Factor Presets</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="btn-preset-normal"
                onClick={() => setS0Str('1.0')}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                Normal (1.0)
              </button>
              <button
                type="button"
                data-testid="btn-preset-precision"
                onClick={() => setS0Str('1.5')}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                Quiet (1.5)
              </button>
              <button
                type="button"
                data-testid="btn-preset-shock"
                onClick={() => setS0Str('2.0')}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                Shock (2.0)
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <button
                data-testid="btn-export-csv"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Equivalent Static Load P0</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-p0">{formatNum(result.P0)}</span>
                  <span className="text-lg text-blue-400 font-bold ml-1.5">kN</span>
                </div>
              </div>
              <div className="bg-green-50/60 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">Required Static Rating C0</div>
                <div className="text-3xl font-black text-green-700">
                  <span data-testid="result-c0">{formatNum(result.C0)}</span>
                  <span className="text-lg text-green-400 font-bold ml-1.5">kN</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ISO 76:2006 Static Load Rating: P0 = max(X0·Fr + Y0·Fa, Fr). Required static rating C0 = s0 · P0 (s0 per ISO 76 / manufacturer application guide).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
