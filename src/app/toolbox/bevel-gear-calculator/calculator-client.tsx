'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface Preset {
  label: string;
  m: string;
  z1: string;
  z2: string;
}

const PRESETS: Preset[] = [
  { label: 'KHK Reference (m=3, 20:40)', m: '3', z1: '20', z2: '40' },
  { label: 'Miter Gear 1:1 (m=2.5, 24:24)', m: '2.5', z1: '24', z2: '24' },
  { label: 'High Reduction 1:3 (m=4, 15:45)', m: '4', z1: '15', z2: '45' },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits = 3): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BevelGearCalculatorClient() {
  const [mStr, setMStr] = useState('3');
  const [z1Str, setZ1Str] = useState('20');
  const [z2Str, setZ2Str] = useState('40');

  const result = useMemo(() => {
    const m = parseNum(mStr);
    const z1 = parseNum(z1Str);
    const z2 = parseNum(z2Str);

    if (
      !Number.isFinite(m) ||
      !Number.isFinite(z1) ||
      !Number.isFinite(z2) ||
      m <= 0 ||
      z1 < 1 ||
      z2 < 1
    ) {
      return {
        d1: NaN,
        d2: NaN,
        pd1: NaN,
        pd2: NaN,
        coneDist: NaN,
        ratio: NaN,
      };
    }

    // Orthogonal straight bevel gear (Shaft angle Σ = 90°)
    const d1 = (Math.atan(z1 / z2) * 180) / Math.PI;
    const d2 = 90 - d1;
    const pd1 = m * z1;
    const pd2 = m * z2;
    const coneDist = 0.5 * m * Math.hypot(z1, z2);
    const ratio = z2 / z1;

    return { d1, d2, pd1, pd2, coneDist, ratio };
  }, [mStr, z1Str, z2Str]);

  const applyPreset = (p: Preset) => {
    setMStr(p.m);
    setZ1Str(p.z1);
    setZ2Str(p.z2);
  };

  const handleReset = () => {
    setMStr('3');
    setZ1Str('20');
    setZ2Str('40');
  };

  const exportCsv = () => {
    const headers = [
      'Module_m_mm',
      'Pinion_Teeth_z1',
      'Gear_Teeth_z2',
      'Pinion_Cone_Angle_deg',
      'Gear_Cone_Angle_deg',
      'Pinion_PD_mm',
      'Gear_PD_mm',
      'Cone_Distance_R_mm',
      'Gear_Ratio',
    ];
    const row = [
      mStr.trim(),
      z1Str.trim(),
      z2Str.trim(),
      formatFixed(result.d1, 3),
      formatFixed(result.d2, 3),
      formatFixed(result.pd1, 3),
      formatFixed(result.pd2, 3),
      formatFixed(result.coneDist, 3),
      formatFixed(result.ratio, 3),
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bevel-gear-geometry.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Engineering Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${i}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="bevel-module-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Module (mm)
            </label>
            <input
              id="bevel-module-input"
              data-testid="input-module"
              type="text"
              value={mStr}
              onChange={(e) => setMStr(e.target.value)}
              placeholder="3"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bevel-z1-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Pinion Teeth (z₁)
            </label>
            <input
              id="bevel-z1-input"
              data-testid="input-z1"
              type="text"
              value={z1Str}
              onChange={(e) => setZ1Str(e.target.value)}
              placeholder="20"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bevel-z2-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Gear Teeth (z₂)
            </label>
            <input
              id="bevel-z2-input"
              data-testid="input-z2"
              type="text"
              value={z2Str}
              onChange={(e) => setZ2Str(e.target.value)}
              placeholder="40"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Results (Σ = 90° Orthogonal Straight Bevel)
                </h2>
              </div>

              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-400 uppercase tracking-wider mb-2">
                  Pinion Cone (δ₁)
                </div>
                <div data-testid="result-d1" className="text-3xl font-black text-blue-700">
                  {formatFixed(result.d1, 3)}
                  <span className="text-lg text-blue-400"> deg</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-sm font-black text-green-400 uppercase tracking-wider mb-2">
                  Gear Cone (δ₂)
                </div>
                <div data-testid="result-d2" className="text-3xl font-black text-green-700">
                  {formatFixed(result.d2, 3)}
                  <span className="text-lg text-green-400"> deg</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-400 uppercase tracking-wider mb-2">
                  Pinion PD (d₁)
                </div>
                <div data-testid="result-pd1" className="text-3xl font-black text-orange-700">
                  {formatFixed(result.pd1, 3)}
                  <span className="text-lg text-orange-400"> mm</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-400 uppercase tracking-wider mb-2">
                  Gear PD (d₂)
                </div>
                <div data-testid="result-pd2" className="text-3xl font-black text-purple-700">
                  {formatFixed(result.pd2, 3)}
                  <span className="text-lg text-purple-400"> mm</span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="text-sm font-black text-indigo-400 uppercase tracking-wider mb-2">
                  Cone Distance (R)
                </div>
                <div data-testid="result-cone-dist" className="text-3xl font-black text-indigo-700">
                  {formatFixed(result.coneDist, 3)}
                  <span className="text-lg text-indigo-400"> mm</span>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-sm font-black text-red-400 uppercase tracking-wider mb-2">
                  Ratio (u)
                </div>
                <div data-testid="result-ratio" className="text-3xl font-black text-red-700">
                  {formatFixed(result.ratio, 3)}
                  <span className="text-lg text-red-400"> :1</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Reference: KHK Stock Gears Technical Reference (Calculation of Gear Dimensions — Straight Bevel Gear, Shaft Angle Σ = 90°):{' '}
                  <code>δ₁ = arctan(z₁ / z₂)</code>, <code>δ₂ = 90° - δ₁</code>,{' '}
                  <code>d = z · m</code>, <code>R = 0.5 · m · √(z₁² + z₂²)</code>.
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
