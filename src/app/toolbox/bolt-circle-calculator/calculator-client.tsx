'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface Preset {
  label: string;
  bcd: string;
  count: string;
  startAngle: string;
}

const PRESETS: Preset[] = [
  { label: 'DN100 PN16 Flange (BCD=200, 8 Bolts)', bcd: '200', count: '8', startAngle: '0' },
  { label: 'Straddled 4-Bolt Cover (BCD=150, 45° Offset)', bcd: '150', count: '4', startAngle: '45' },
  { label: 'Heavy 12-Bolt Turbine Ring (BCD=360, 15° Offset)', bcd: '360', count: '12', startAngle: '15' },
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

export default function BoltCircleCalculatorClient() {
  const [bcdStr, setBcdStr] = useState('200');
  const [countStr, setCountStr] = useState('8');
  const [startAngleStr, setStartAngleStr] = useState('0');

  const result = useMemo(() => {
    const D = parseNum(bcdStr);
    const n = parseNum(countStr);
    const startDeg = parseNum(startAngleStr);

    if (
      !Number.isFinite(D) ||
      !Number.isFinite(n) ||
      !Number.isFinite(startDeg) ||
      D <= 0 ||
      n < 2 ||
      !Number.isInteger(n)
    ) {
      return {
        spacing: NaN,
        chord: NaN,
        angleStepDeg: NaN,
        x1: NaN,
        y1: NaN,
        startDeg: NaN,
      };
    }

    const startRad = (startDeg * Math.PI) / 180;
    const R = D / 2;

    const spacing = (Math.PI * D) / n; // Circular arc spacing
    const chord = 2 * R * Math.sin(Math.PI / n); // Linear chord distance between centers
    const angleStepDeg = 360 / n; // Angular pitch

    const x1 = R * Math.cos(startRad);
    const y1 = R * Math.sin(startRad);

    return { spacing, chord, angleStepDeg, x1, y1, startDeg };
  }, [bcdStr, countStr, startAngleStr]);

  const applyPreset = (p: Preset) => {
    setBcdStr(p.bcd);
    setCountStr(p.count);
    setStartAngleStr(p.startAngle);
  };

  const handleReset = () => {
    setBcdStr('200');
    setCountStr('8');
    setStartAngleStr('0');
  };

  const exportCsv = () => {
    const headers = [
      'Bolt_Circle_Dia_mm',
      'Number_of_Bolts',
      'Start_Angle_deg',
      'Chord_Distance_mm',
      'Arc_Perimeter_Spacing_mm',
      'Angular_Pitch_deg',
      'First_Hole_X1_mm',
      'First_Hole_Y1_mm',
    ];
    const row = [
      bcdStr.trim(),
      countStr.trim(),
      startAngleStr.trim(),
      formatFixed(result.chord, 3),
      formatFixed(result.spacing, 3),
      formatFixed(result.angleStepDeg, 3),
      formatFixed(result.x1, 3),
      formatFixed(result.y1, 3),
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-circle-spacing.csv';
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Flange Layout Presets
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
              htmlFor="bcd-dia-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Bolt Circle Dia (mm)
            </label>
            <input
              id="bcd-dia-input"
              data-testid="input-bcd"
              type="text"
              value={bcdStr}
              onChange={(e) => setBcdStr(e.target.value)}
              placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bcd-count-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Number of Bolts
            </label>
            <input
              id="bcd-count-input"
              data-testid="input-count"
              type="text"
              value={countStr}
              onChange={(e) => setCountStr(e.target.value)}
              placeholder="8"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bcd-angle-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Start Angle (deg)
            </label>
            <input
              id="bcd-angle-input"
              data-testid="input-start-angle"
              type="text"
              value={startAngleStr}
              onChange={(e) => setStartAngleStr(e.target.value)}
              placeholder="0"
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
                  Results (Circular Chord & Pitch Geometry)
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-400 uppercase tracking-wider mb-2">
                  Chord Distance (Hole-to-Hole)
                </div>
                <div data-testid="result-chord" className="text-3xl font-black text-blue-700">
                  {formatFixed(result.chord, 3)}
                  <span className="text-lg text-blue-400"> mm</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-sm font-black text-green-400 uppercase tracking-wider mb-2">
                  Arc Perimeter Spacing
                </div>
                <div data-testid="result-spacing" className="text-3xl font-black text-green-700">
                  {formatFixed(result.spacing, 3)}
                  <span className="text-lg text-green-400"> mm</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-400 uppercase tracking-wider mb-2">
                  First Hole (X₁, Y₁)
                </div>
                <div data-testid="result-first-hole" className="text-2xl font-black text-purple-700">
                  {Number.isFinite(result.x1) && Number.isFinite(result.y1)
                    ? `(${formatFixed(result.x1, 3)}, ${formatFixed(result.y1, 3)})`
                    : '—'}
                  <span className="text-sm font-medium text-purple-500"> mm</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-400 uppercase tracking-wider mb-2">
                  Angular Pitch (Δθ)
                </div>
                <div data-testid="result-angle-step" className="text-3xl font-black text-orange-700">
                  {formatFixed(result.angleStepDeg, 3)}
                  <span className="text-lg text-orange-400"> °</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Euclidean Circle Chord & Polar-to-Cartesian Geometry:{' '}
                  <code>Chord = 2 · R · sin(π / n)</code>,{' '}
                  <code>Arc = π · D / n</code>,{' '}
                  <code>X₁ = R · cos(θ₀)</code>, <code>Y₁ = R · sin(θ₀)</code> (where{' '}
                  <code>R = D / 2</code> and integer <code>n ≥ 2</code>).
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
