'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

export default function BearingLifeCalculatorClient() {
  const [cStr, setCStr] = useState('50');
  const [pStr, setPStr] = useState('5');
  const [speedStr, setSpeedStr] = useState('1500');
  const [bearingType, setBearingType] = useState<'ball' | 'roller'>('ball');

  const result = useMemo(() => {
    const C_kN = parseFloat(cStr);
    const P_kN = parseFloat(pStr);
    const n = parseFloat(speedStr);

    if (
      isNaN(C_kN) ||
      isNaN(P_kN) ||
      isNaN(n) ||
      C_kN <= 0 ||
      P_kN <= 0 ||
      n <= 0
    ) {
      return { L10: NaN, L10h: NaN };
    }

    // Formula per ISO 281:2007:
    // L10 = (C / P)^p, p=3 for ball, 10/3 for roller
    const p = bearingType === 'ball' ? 3 : 10 / 3;
    const L10 = Math.pow(C_kN / P_kN, p);
    const L10h = (L10 * 1e6) / (60 * n);
    return { L10, L10h };
  }, [cStr, pStr, speedStr, bearingType]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(6);
  };

  const handleReset = () => {
    setCStr('50');
    setPStr('5');
    setSpeedStr('1500');
    setBearingType('ball');
  };

  const downloadCsv = () => {
    const csv = [
      ['Bearing Life L10 Calculator Report (ISO 281:2007)', ''],
      ['Calculation Date', new Date().toISOString().split('T')[0]],
      ['', ''],
      ['Input Parameters', ''],
      ['Dynamic Load Rating C (kN)', cStr],
      ['Equivalent Dynamic Load P (kN)', pStr],
      ['Rotational Speed (RPM)', speedStr],
      ['Bearing Type', bearingType === 'ball' ? 'Ball Bearing (p = 3)' : 'Roller Bearing (p = 10/3)'],
      ['', ''],
      ['Calculated Results', ''],
      ['Basic Rating Life L10 (Millions of Revolutions)', isNaN(result.L10) ? '—' : result.L10.toFixed(2)],
      ['Basic Rating Life L10h (Operating Hours)', isNaN(result.L10h) ? '—' : result.L10h.toFixed(0)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bearing-life-l10-report.csv';
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Dynamic Load C (kN)</label>
            <input
              data-testid="input-c"
              type="text"
              value={cStr}
              onChange={e => setCStr(e.target.value)}
              placeholder="50"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Equivalent Load P (kN)</label>
            <input
              data-testid="input-p"
              type="text"
              value={pStr}
              onChange={e => setPStr(e.target.value)}
              placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Speed (RPM)</label>
            <input
              data-testid="input-speed"
              type="text"
              value={speedStr}
              onChange={e => setSpeedStr(e.target.value)}
              placeholder="1500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Type</label>
            <select
              data-testid="select-type"
              value={bearingType}
              onChange={e => setBearingType(e.target.value as 'ball' | 'roller')}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              <option value="ball">Ball Bearing (p = 3)</option>
              <option value="roller">Roller Bearing (p = 10/3)</option>
            </select>
          </div>

          <div className="pt-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Typical Duty Presets</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="btn-preset-motor"
                onClick={() => {
                  setCStr('35');
                  setPStr('3.5');
                  setSpeedStr('1800');
                  setBearingType('ball');
                }}
                className="p-2.5 rounded-xl text-left bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                Electric Motor (Ball)
              </button>
              <button
                type="button"
                data-testid="btn-preset-gearbox"
                onClick={() => {
                  setCStr('120');
                  setPStr('25');
                  setSpeedStr('900');
                  setBearingType('roller');
                }}
                className="p-2.5 rounded-xl text-left bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                Industrial Gearbox (Roller)
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">L10 (Millions of Revs)</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-l10">{formatNum(result.L10)}</span>
                  <span className="text-lg text-blue-400 font-bold ml-1.5">Mr</span>
                </div>
              </div>
              <div className="bg-green-50/60 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">L10h (Operating Life)</div>
                <div className="text-3xl font-black text-green-700">
                  <span data-testid="result-l10h">{formatNum(result.L10h)}</span>
                  <span className="text-lg text-green-400 font-bold ml-1.5">hours</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ISO 281:2007 Basic Rating Life: L10 = (C / P)^p (p = 3 for ball bearings, p = 10/3 for roller bearings). L10h = (10^6 / (60 × n)) × L10.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
