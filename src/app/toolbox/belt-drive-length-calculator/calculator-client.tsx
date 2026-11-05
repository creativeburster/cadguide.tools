'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, RotateCcw } from 'lucide-react';

type SolveMode = 'beltLength' | 'centerDistance';

export default function BeltDriveClient() {
  const [mode, setMode] = useState<SolveMode>('beltLength');
  const [d1Str, setD1Str] = useState('100'); // driver pulley diameter mm
  const [d2Str, setD2Str] = useState('300'); // driven pulley diameter mm
  const [centerDistStr, setCenterDistStr] = useState('500'); // mm
  const [beltLengthStr, setBeltLengthStr] = useState('1500'); // mm
  const [inputRpmStr, setInputRpmStr] = useState('1450');

  const results = useMemo(() => {
    const d1 = parseFloat(d1Str);
    const d2 = parseFloat(d2Str);
    const inputRPM = parseFloat(inputRpmStr);

    if (isNaN(d1) || isNaN(d2) || isNaN(inputRPM) || d1 <= 0 || d2 <= 0 || inputRPM <= 0) {
      return {
        beltLength: '—',
        centerDistance: '—',
        speedRatio: '—',
        outputRPM: '—',
        driverWrap: '—',
        drivenWrap: '—',
      };
    }

    const ratio = d2 / d1;
    const outputRPM = inputRPM / ratio;

    let C_val = NaN;
    let L_val = NaN;

    if (mode === 'beltLength') {
      const c = parseFloat(centerDistStr);
      if (isNaN(c) || c <= 0 || c < Math.abs(d2 - d1) / 2) {
        return {
          beltLength: '—',
          centerDistance: '—',
          speedRatio: ratio.toFixed(2),
          outputRPM: outputRPM.toFixed(0),
          driverWrap: '—',
          drivenWrap: '—',
        };
      }
      C_val = c;
      // Formula per Bando / ISO 4183 / RMA IP-20:
      // L = 2C + (π/2)*(D1 + D2) + (D2 - D1)^2 / (4C)
      L_val = 2 * C_val + (Math.PI / 2) * (d1 + d2) + Math.pow(d2 - d1, 2) / (4 * C_val);
    } else {
      const l = parseFloat(beltLengthStr);
      if (isNaN(l) || l <= 0) {
        return {
          beltLength: '—',
          centerDistance: '—',
          speedRatio: ratio.toFixed(2),
          outputRPM: outputRPM.toFixed(0),
          driverWrap: '—',
          drivenWrap: '—',
        };
      }
      L_val = l;
      // Analytical solution per Bando V-Belt Design Manual:
      // b = 2L - π*(D1 + D2)
      // C = [b + sqrt(b^2 - 8*(D2 - D1)^2)] / 8
      const b = 2 * L_val - Math.PI * (d1 + d2);
      const disc = b * b - 8 * Math.pow(d2 - d1, 2);
      if (disc < 0) {
        return {
          beltLength: '—',
          centerDistance: '—',
          speedRatio: ratio.toFixed(2),
          outputRPM: outputRPM.toFixed(0),
          driverWrap: '—',
          drivenWrap: '—',
        };
      }
      C_val = (b + Math.sqrt(disc)) / 8;
    }

    if (isNaN(C_val) || isNaN(L_val) || C_val <= 0 || 2 * C_val < Math.abs(d2 - d1)) {
      return {
        beltLength: isNaN(L_val) ? '—' : L_val.toFixed(1),
        centerDistance: isNaN(C_val) ? '—' : C_val.toFixed(1),
        speedRatio: ratio.toFixed(2),
        outputRPM: outputRPM.toFixed(0),
        driverWrap: '—',
        drivenWrap: '—',
      };
    }

    // Belt wrap angles
    const sinTheta = (d2 - d1) / (2 * C_val);
    const theta = Math.asin(Math.max(-1, Math.min(1, sinTheta)));
    const alpha1Deg = (Math.PI - 2 * theta) * 180 / Math.PI;
    const alpha2Deg = (Math.PI + 2 * theta) * 180 / Math.PI;

    return {
      beltLength: L_val.toFixed(1),
      centerDistance: C_val.toFixed(1),
      speedRatio: ratio.toFixed(2),
      outputRPM: outputRPM.toFixed(0),
      driverWrap: alpha1Deg.toFixed(1),
      drivenWrap: alpha2Deg.toFixed(1),
    };
  }, [mode, d1Str, d2Str, centerDistStr, beltLengthStr, inputRpmStr]);

  const handleReset = () => {
    setMode('beltLength');
    setD1Str('100');
    setD2Str('300');
    setCenterDistStr('500');
    setBeltLengthStr('1500');
    setInputRpmStr('1450');
  };

  const downloadCsv = () => {
    const csv = [
      ['Belt Drive Calculator Report (ISO 4183 / RMA IP-20)', ''],
      ['Date', new Date().toISOString().split('T')[0]],
      ['Solve Mode', mode === 'beltLength' ? 'Belt Length from Center Distance' : 'Center Distance from Belt Length'],
      ['', ''],
      ['Input Parameters', ''],
      ['Driver Pulley D1 (mm)', d1Str],
      ['Driven Pulley D2 (mm)', d2Str],
      ['Input RPM', inputRpmStr],
      [mode === 'beltLength' ? 'Center Distance (mm)' : 'Belt Length (mm)', mode === 'beltLength' ? centerDistStr : beltLengthStr],
      ['', ''],
      ['Calculated Results', ''],
      ['Belt Length (mm)', results.beltLength],
      ['Center Distance (mm)', results.centerDistance],
      ['Speed Ratio (D2/D1)', results.speedRatio],
      ['Output RPM', results.outputRPM],
      ['Driver Wrap Angle (°)', results.driverWrap],
      ['Driven Wrap Angle (°)', results.drivenWrap],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'belt-drive-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const d1Num = parseFloat(d1Str) || 100;
  const d2Num = parseFloat(d2Str) || 300;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Solve For</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button" data-testid="btn-mode-belt-length"
                onClick={() => setMode('beltLength')}
                className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all ${mode === 'beltLength' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                Belt Length
              </button>
              <button
                type="button" data-testid="btn-mode-center-dist"
                onClick={() => setMode('centerDistance')}
                className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all ${mode === 'centerDistance' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
              >
                Center Dist
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Driver Pulley D₁ (mm)</label>
            <input
              data-testid="input-d1"
              type="text"
              value={d1Str}
              onChange={e => setD1Str(e.target.value)}
              placeholder="100"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Driven Pulley D₂ (mm)</label>
            <input
              data-testid="input-d2"
              type="text"
              value={d2Str}
              onChange={e => setD2Str(e.target.value)}
              placeholder="300"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Input RPM</label>
            <input
              data-testid="input-rpm"
              type="text"
              value={inputRpmStr}
              onChange={e => setInputRpmStr(e.target.value)}
              placeholder="1450"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          {mode === 'beltLength' ? (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Center Distance C (mm)</label>
              <input
                data-testid="input-center-dist"
                type="text"
                value={centerDistStr}
                onChange={e => setCenterDistStr(e.target.value)}
                placeholder="500"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Belt Length L (mm)</label>
              <input
                data-testid="input-belt-length"
                type="text"
                value={beltLengthStr}
                onChange={e => setBeltLengthStr(e.target.value)}
                placeholder="1500"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="pt-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Drive Ratio Presets</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="btn-preset-1-1"
                onClick={() => {
                  setD1Str('150');
                  setD2Str('150');
                  setCenterDistStr('450');
                  setInputRpmStr('1450');
                }}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                1:1 Direct
              </button>
              <button
                type="button"
                data-testid="btn-preset-1-2"
                onClick={() => {
                  setD1Str('100');
                  setD2Str('200');
                  setCenterDistStr('500');
                  setInputRpmStr('1450');
                }}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                1:2 Ratio
              </button>
              <button
                type="button"
                data-testid="btn-preset-1-3"
                onClick={() => {
                  setD1Str('100');
                  setD2Str('300');
                  setCenterDistStr('500');
                  setInputRpmStr('1450');
                }}
                className="p-2 rounded-xl text-center bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-xs font-bold text-slate-700"
              >
                1:3 Ratio
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              <button
                data-testid="btn-export-csv"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">
                  {mode === 'beltLength' ? 'Calculated Belt Length' : 'Calculated Center Distance'}
                </p>
                <p className="text-3xl font-black">
                  <span data-testid="result-primary-value">
                    {mode === 'beltLength' ? results.beltLength : results.centerDistance}
                  </span>
                  <span className="text-lg font-bold ml-2 opacity-80">mm</span>
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-wider opacity-80 mb-1">Output Speed</p>
                <p className="text-3xl font-black">
                  <span data-testid="result-output-rpm">{results.outputRPM}</span>
                  <span className="text-lg font-bold ml-2 opacity-80">RPM</span>
                </p>
                <p className="text-xs mt-2 opacity-80 font-bold">Ratio {results.speedRatio}:1</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Speed Ratio</p>
                <p className="text-lg font-black text-slate-900">
                  <span data-testid="result-speed-ratio">{results.speedRatio}</span>
                  <span className="text-sm text-slate-400 font-bold ml-1">:1</span>
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Driver Wrap Angle</p>
                <p className="text-lg font-black text-slate-900">
                  <span data-testid="result-driver-wrap">{results.driverWrap}</span>
                  <span className="text-sm text-slate-400 font-bold ml-1">°</span>
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Driven Wrap Angle</p>
                <p className="text-lg font-black text-slate-900">
                  <span data-testid="result-driven-wrap">{results.drivenWrap}</span>
                  <span className="text-sm text-slate-400 font-bold ml-1">°</span>
                </p>
              </div>
            </div>
          </div>

          {/* SVG Pulley Diagram */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Pulley Layout (Scale Schematic)</h3>
            <svg viewBox="0 0 500 200" className="w-full">
              {/* Driver pulley */}
              <circle cx="100" cy="100" r={Math.max(15, Math.min(d1Num / 4, 50))} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="100" cy="100" r="3" fill="#3b82f6" />
              <text x="100" y="170" textAnchor="middle" className="fill-blue-600 text-xs font-bold">D₁={d1Str}mm</text>
              <text x="100" y="185" textAnchor="middle" className="fill-slate-400 text-[10px]">{inputRpmStr} RPM</text>
              {/* Driven pulley */}
              <circle cx="400" cy="100" r={Math.max(15, Math.min(d2Num / 4, 50))} fill="none" stroke="#10b981" strokeWidth="2" />
              <circle cx="400" cy="100" r="3" fill="#10b981" />
              <text x="400" y="170" textAnchor="middle" className="fill-emerald-600 text-xs font-bold">D₂={d2Str}mm</text>
              <text x="400" y="185" textAnchor="middle" className="fill-slate-400 text-[10px]">{results.outputRPM} RPM</text>
              {/* Belt lines (simplified tangent lines) */}
              <line x1={100 + Math.max(15, Math.min(d1Num / 4, 50))} y1="100" x2={400 + Math.max(15, Math.min(d2Num / 4, 50))} y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1={100 - Math.max(15, Math.min(d1Num / 4, 50))} y1="100" x2={400 - Math.max(15, Math.min(d2Num / 4, 50))} y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Center distance */}
              <line x1="100" y1="40" x2="400" y2="40" stroke="#64748b" strokeWidth="1" markerStart="url(#dotL)" markerEnd="url(#dotR)" />
              <text x="250" y="32" textAnchor="middle" className="fill-slate-600 text-xs font-bold">
                C={mode === 'beltLength' ? centerDistStr : results.centerDistance} mm
              </text>
              <defs>
                <marker id="dotL" markerWidth="4" markerHeight="4" refX="2" refY="2"><circle cx="2" cy="2" r="1.5" fill="#64748b" /></marker>
                <marker id="dotR" markerWidth="4" markerHeight="4" refX="2" refY="2"><circle cx="2" cy="2" r="1.5" fill="#64748b" /></marker>
              </defs>
            </svg>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
