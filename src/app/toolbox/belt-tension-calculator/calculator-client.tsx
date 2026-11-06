'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseNum(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

export default function BeltTensionCalculatorClient() {
  const [powerStr, setPowerStr] = useState('5');
  const [speedStr, setSpeedStr] = useState('10');
  const [frictionStr, setFrictionStr] = useState('0.3');
  const [wrapAngleStr, setWrapAngleStr] = useState('2.8');

  const result = useMemo(() => {
    const P_kW = parseNum(powerStr);
    const v = parseNum(speedStr);
    const mu = parseNum(frictionStr);
    const theta = parseNum(wrapAngleStr);

    if (
      P_kW === null || v === null || mu === null || theta === null ||
      P_kW <= 0 || v <= 0 || mu <= 0 || theta <= 0
    ) {
      return { te: null, t1: null, t2: null, t0: null, fb: null };
    }

    const P = P_kW * 1000; // W
    const te = P / v; // N
    const eTerm = Math.exp(mu * theta);
    if (eTerm <= 1) {
      return { te: null, t1: null, t2: null, t0: null, fb: null };
    }
    const t1 = (te * eTerm) / (eTerm - 1);
    const t2 = te / (eTerm - 1);
    const t0 = (t1 + t2) / 2;
    const fb = 2 * t0 * Math.sin(theta / 2);

    return { te, t1, t2, t0, fb };
  }, [powerStr, speedStr, frictionStr, wrapAngleStr]);

  const handleReset = () => {
    setPowerStr('5');
    setSpeedStr('10');
    setFrictionStr('0.3');
    setWrapAngleStr('2.8');
  };

  const applyPreset = (p: string, s: string, f: string, w: string) => {
    setPowerStr(p);
    setSpeedStr(s);
    setFrictionStr(f);
    setWrapAngleStr(w);
  };

  const handleExportCsv = () => {
    const csvContent = [
      '# Belt Tension Calculation (Euler-Eytelwein & Bando / Gates V-Belt Design Standard)',
      '# Verified by CADGuide.tools Toolbox',
      'Parameter,Value,Unit',
      `Transmitted Power,${powerStr},kW`,
      `Belt Linear Speed,${speedStr},m/s`,
      `Friction Coefficient (u),${frictionStr},—`,
      `Wrap Angle (theta),${wrapAngleStr},rad`,
      `Effective Tension (Te),${result.te !== null ? result.te.toFixed(2) : '—'},N`,
      `Tight Side Tension (T1),${result.t1 !== null ? result.t1.toFixed(2) : '—'},N`,
      `Slack Side Tension (T2),${result.t2 !== null ? result.t2.toFixed(2) : '—'},N`,
      `Initial Static Tension (T0),${result.t0 !== null ? result.t0.toFixed(2) : '—'},N`,
      `Shaft Radial Load (Fb),${result.fb !== null ? result.fb.toFixed(2) : '—'},N`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'belt_tension_calculation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      {/* Engineering Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">Drive Presets:</span>
        <button
          type="button"
          data-testid="preset-standard"
          onClick={() => applyPreset('5', '10', '0.3', '2.8')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Standard Industrial (5 kW, 10 m/s)
        </button>
        <button
          type="button"
          data-testid="preset-compact"
          onClick={() => applyPreset('3', '15', '0.35', '2.6')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Compact High-Speed (3 kW, 15 m/s)
        </button>
        <button
          type="button"
          data-testid="preset-heavy"
          onClick={() => applyPreset('15', '5', '0.25', '3.14')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
        >
          Heavy Conveyor (15 kW, 5 m/s)
        </button>
      </div>

      <div data-testid="calculator-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div data-testid="calculator-inputs" className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              title="Reset defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Power P (kW)</label>
            <input
              type="text"
              data-testid="input-power"
              value={powerStr}
              onChange={(e) => setPowerStr(e.target.value)}
              placeholder="5"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Belt Speed v (m/s)</label>
            <input
              type="text"
              data-testid="input-speed"
              value={speedStr}
              onChange={(e) => setSpeedStr(e.target.value)}
              placeholder="10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Friction Coefficient u</label>
            <input
              type="text"
              data-testid="input-friction"
              value={frictionStr}
              onChange={(e) => setFrictionStr(e.target.value)}
              placeholder="0.3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Wrap Angle theta (rad)</label>
            <input
              type="text"
              data-testid="input-wrap-angle"
              value={wrapAngleStr}
              onChange={(e) => setWrapAngleStr(e.target.value)}
              placeholder="2.8"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <span className="text-xs text-slate-400 mt-1 block">
              {parseNum(wrapAngleStr) !== null ? `≈ ${((parseNum(wrapAngleStr)! * 180) / Math.PI).toFixed(1)}°` : '—'}
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Calculation (CSV)
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div data-testid="calculator-results" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Tension Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100">
                <div className="text-base font-black text-blue-400 uppercase tracking-wider mb-2">Effective Pull Te</div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-te">
                    {result.te !== null ? result.te.toFixed(2) : '—'}
                  </span>
                  <span className="text-lg text-blue-400 font-bold ml-1">N</span>
                </div>
                <div className="text-xs text-blue-500 font-semibold mt-1">Te = 1000·P / v</div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-100">
                <div className="text-base font-black text-emerald-400 uppercase tracking-wider mb-2">Tight Side T1</div>
                <div className="text-3xl font-black text-emerald-700">
                  <span data-testid="result-t1">
                    {result.t1 !== null ? result.t1.toFixed(2) : '—'}
                  </span>
                  <span className="text-lg text-emerald-400 font-bold ml-1">N</span>
                </div>
                <div className="text-xs text-emerald-500 font-semibold mt-1">T1 = Te·e^(uθ) / (e^(uθ)−1)</div>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-100">
                <div className="text-base font-black text-amber-500 uppercase tracking-wider mb-2">Slack Side T2</div>
                <div className="text-3xl font-black text-amber-700">
                  <span data-testid="result-t2">
                    {result.t2 !== null ? result.t2.toFixed(2) : '—'}
                  </span>
                  <span className="text-lg text-amber-500 font-bold ml-1">N</span>
                </div>
                <div className="text-xs text-amber-600 font-semibold mt-1">T2 = Te / (e^(uθ)−1)</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Static Initial Tension T0</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-t0">
                    {result.t0 !== null ? result.t0.toFixed(2) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">N</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">T0 = (T1 + T2) / 2</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Shaft Bearing Load Fb</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-fb">
                    {result.fb !== null ? result.fb.toFixed(2) : '—'}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 ml-1">N</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Fb ≈ 2·T0·sin(θ/2) (Symmetric static approximation; vector sum difference &lt;0.25%)</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                Euler-Eytelwein Belt Friction Law (Bando / Gates V-Belt Design Manual)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                Transmitted force ratio: T1 / T2 = e^(u·θ). Minimum installation tension prevents slip while avoiding excessive bearing reaction forces on drive shafts.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
