'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type ChannelShape = 'rectangular' | 'trapezoidal';

interface SurfacePreset {
  id: string;
  label: string;
  typicalN: string;
}

const SURFACE_PRESETS: SurfacePreset[] = [
  { id: 'concrete_wood', label: 'Concrete — wooden forms (Typical n = 0.015)', typicalN: '0.015' },
  { id: 'concrete_finished', label: 'Concrete — finished (Typical n = 0.012)', typicalN: '0.012' },
  { id: 'corrugated_metal', label: 'Corrugated metal (Typical n = 0.022)', typicalN: '0.022' },
  { id: 'earth_gravelly', label: 'Earth channel — gravelly (Typical n = 0.025)', typicalN: '0.025' },
  { id: 'custom', label: 'Custom Roughness (Edit below)', typicalN: '' },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

export default function ChannelFlowManningCalculatorClient() {
  const [shape, setShape] = useState<ChannelShape>('rectangular');
  const [widthStr, setWidthStr] = useState<string>('2');
  const [depthStr, setDepthStr] = useState<string>('1');
  const [sideSlopeStr, setSideSlopeStr] = useState<string>('1.5');
  const [slopeStr, setSlopeStr] = useState<string>('0.001');
  const [surfaceId, setSurfaceId] = useState<string>('concrete_wood');
  const [manningNStr, setManningNStr] = useState<string>('0.015');

  const handleSurfaceChange = (nextId: string) => {
    setSurfaceId(nextId);
    const found = SURFACE_PRESETS.find((s) => s.id === nextId);
    if (found && found.typicalN !== '') {
      setManningNStr(found.typicalN);
    }
  };

  const handleManningInput = (val: string) => {
    setManningNStr(val);
    const matched = SURFACE_PRESETS.find(
      (s) => s.id !== 'custom' && Number(s.typicalN) === parseStrictNumber(val)
    );
    setSurfaceId(matched ? matched.id : 'custom');
  };

  const applyPreset = (
    nextShape: ChannelShape,
    b: string,
    y: string,
    z: string,
    s: string,
    surf: string,
    n: string
  ) => {
    setShape(nextShape);
    setWidthStr(b);
    setDepthStr(y);
    setSideSlopeStr(z);
    setSlopeStr(s);
    setSurfaceId(surf);
    setManningNStr(n);
  };

  const handleReset = () => {
    applyPreset('rectangular', '2', '1', '1.5', '0.001', 'concrete_wood', '0.015');
  };

  /**
   * Open-Channel Uniform Gravity Flow Equations (SI Manning's Equation):
   * 1. Rectangular section (z = 0):
   *    Flow Area A = b * y [m²]
   *    Wetted Perimeter P = b + 2 * y [m]
   * 2. Trapezoidal section (side slope z horizontal : 1 vertical, z > 0):
   *    Top water width T = b + 2 * z * y
   *    Flow Area A = y * (b + T) / 2 = (b + z * y) * y [m²]
   *    Wetted Perimeter P = b + 2 * y * sqrt(1 + z^2) [m]
   * 3. Hydraulic Radius R_h = A / P [m]
   * 4. Mean Velocity v = (1 / n) * R_h^(2/3) * S^(1/2) [m/s]
   * 5. Discharge Flow Rate Q = A * v [m³/s]
   */
  const calc = useMemo(() => {
    const b = parseStrictNumber(widthStr);
    const y = parseStrictNumber(depthStr);
    const S = parseStrictNumber(slopeStr);
    const n = parseStrictNumber(manningNStr);
    const z = shape === 'trapezoidal' ? parseStrictNumber(sideSlopeStr) : 0;

    if (
      !Number.isFinite(b) ||
      !Number.isFinite(y) ||
      !Number.isFinite(S) ||
      !Number.isFinite(n) ||
      !Number.isFinite(z) ||
      b <= 0 ||
      y <= 0 ||
      S <= 0 ||
      n <= 0 ||
      (shape === 'trapezoidal' && z <= 0)
    ) {
      return { isValid: false as const };
    }

    const area = shape === 'rectangular' ? b * y : (b + z * y) * y;
    const perimeter = shape === 'rectangular' ? b + 2 * y : b + 2 * y * Math.sqrt(1 + z * z);
    const hydraulicRadius = area / perimeter;
    const velocity = (1 / n) * Math.pow(hydraulicRadius, 2 / 3) * Math.sqrt(S);
    const flowRate = area * velocity;

    return {
      isValid: true as const,
      b,
      y,
      z,
      S,
      n,
      area,
      perimeter,
      hydraulicRadius,
      velocity,
      flowRate,
    };
  }, [shape, widthStr, depthStr, sideSlopeStr, slopeStr, manningNStr]);

  const handleExportCsv = () => {
    if (!calc.isValid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Channel Cross-Section Shape', shape === 'rectangular' ? 'Rectangular Flume' : 'Trapezoidal Channel', '-', shape === 'rectangular' ? 'Vertical walls (z = 0)' : `Side slope z = ${calc.z}H : 1V`],
      ['Bottom Width (b)', calc.b.toFixed(3), 'm', 'Channel invert bottom width'],
      ['Flow Depth (y)', calc.y.toFixed(3), 'm', 'Normal vertical water depth'],
      ['Side Slope (z)', calc.z.toFixed(3), 'H:1V', 'Horizontal run per 1 unit vertical'],
      ['Longitudinal Slope (S)', calc.S.toFixed(5), 'm/m', 'Hydraulic energy / bed gradient'],
      ['Manning Roughness (n)', calc.n.toFixed(4), '-', 'Empirical surface roughness coefficient'],
      ['Flow Area (A)', calc.area.toFixed(3), 'm²', shape === 'rectangular' ? 'A = b * y' : 'A = (b + z * y) * y'],
      ['Wetted Perimeter (P)', calc.perimeter.toFixed(3), 'm', shape === 'rectangular' ? 'P = b + 2 * y' : 'P = b + 2 * y * sqrt(1 + z^2)'],
      ['Hydraulic Radius (R_h)', calc.hydraulicRadius.toFixed(3), 'm', 'R_h = A / P'],
      ['Mean Velocity (v)', calc.velocity.toFixed(3), 'm/s', 'v = (1 / n) * R_h^(2/3) * S^(1/2)'],
      ['Volumetric Flow Rate (Q)', calc.flowRate.toFixed(3), 'm³/s', 'Q = A * v'],
      ['Reference', 'SI Manning Uniform Open-Channel Equation (Engineering ToolBox / Open-Channel Hydraulics)', '-', 'Steady uniform gravity flow'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'channel-flow-manning.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Channel Geometry</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  SI Manning Uniform Flow
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-rect-concrete"
                onClick={() =>
                  applyPreset('rectangular', '2', '1', '1.5', '0.001', 'concrete_wood', '0.015')
                }
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Rect · 2×1m
              </button>
              <button
                type="button"
                data-testid="preset-trap-concrete"
                onClick={() =>
                  applyPreset('trapezoidal', '2', '1', '1.5', '0.001', 'concrete_wood', '0.015')
                }
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Trap · z=1.5
              </button>
              <button
                type="button"
                data-testid="preset-trap-earth"
                onClick={() =>
                  applyPreset('trapezoidal', '3', '1.2', '2', '0.002', 'earth_gravelly', '0.025')
                }
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Earth · z=2.0
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Channel Cross-Section Shape
              </label>
              <select
                data-testid="select-shape"
                value={shape}
                onChange={(e) => setShape(e.target.value as ChannelShape)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              >
                <option value="rectangular">Rectangular Flume (Vertical Walls, z = 0)</option>
                <option value="trapezoidal">Trapezoidal Channel (Sloped Banks, zH : 1V)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Bottom Width b (m)
                </label>
                <input
                  type="text"
                  data-testid="input-width"
                  value={widthStr}
                  onChange={(e) => setWidthStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Flow Depth y (m)
                </label>
                <input
                  type="text"
                  data-testid="input-depth"
                  value={depthStr}
                  onChange={(e) => setDepthStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            {shape === 'trapezoidal' && (
              <div>
                <label className="text-xs font-black text-teal-700 uppercase tracking-wider block mb-1.5">
                  Side Slope z (z Horizontal : 1 Vertical, &gt; 0)
                </label>
                <input
                  type="text"
                  data-testid="input-side-slope"
                  value={sideSlopeStr}
                  onChange={(e) => setSideSlopeStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-teal-50/50 border border-teal-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Longitudinal Slope S (m/m, &gt; 0)
              </label>
              <input
                type="text"
                data-testid="input-slope"
                value={slopeStr}
                onChange={(e) => setSlopeStr(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Surface Material Preset (Typical Value)
              </label>
              <select
                data-testid="select-surface"
                value={surfaceId}
                onChange={(e) => handleSurfaceChange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              >
                {SURFACE_PRESETS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Manning Roughness Coefficient n (&gt; 0)
              </label>
              <input
                type="text"
                data-testid="input-manning-n"
                value={manningNStr}
                onChange={(e) => handleManningInput(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-export-csv"
            disabled={!calc.isValid}
            onClick={handleExportCsv}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Open-Channel Flow CSV
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Discharge &amp; Hydraulic Section Elements
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50/50 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                Volumetric Flow Rate (Q)
              </div>
              <div className="text-4xl font-black font-mono text-blue-900">
                <span data-testid="out-flow-rate">
                  {calc.isValid ? calc.flowRate.toFixed(3) : '—'}
                </span>{' '}
                <span className="text-lg font-bold text-blue-600">m³/s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Mean Flow Velocity (v)
                </div>
                <div className="text-2xl font-black font-mono text-emerald-800">
                  <span data-testid="out-velocity">
                    {calc.isValid ? calc.velocity.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-emerald-600">m/s</span>
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                  Hydraulic Radius (R_h = A / P)
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  <span data-testid="out-hydraulic-radius">
                    {calc.isValid ? calc.hydraulicRadius.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-amber-600">m</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Wetted Flow Area (A)
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-flow-area">
                    {calc.isValid ? calc.area.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-slate-500">m²</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Wetted Perimeter (P)
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-wetted-perimeter">
                    {calc.isValid ? calc.perimeter.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-slate-500">m</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600 shrink-0" />
                <span>SI Manning Formula &amp; Section Geometry:</span>
              </div>
              <p className="font-mono text-slate-700">
                v = (1 / n) · R_h^(2/3) · S^(1/2), Q = A · v, R_h = A / P
              </p>
              <p className="font-mono text-slate-700">
                Rectangular (z = 0): A = b · y, P = b + 2y | Trapezoidal (zH:1V): A = (b + z·y)·y, P = b + 2y√(1 + z²)
              </p>
              <p className="text-slate-500">
                References: Engineering ToolBox (<em>Manning&apos;s Formula and Gravity Flow</em>,{' '}
                <em>Flow Section Channels — Geometric Relationships</em>, and <em>Manning&apos;s Roughness Coefficients</em>
                : concrete with wooden forms n = 0.015, finished concrete n = 0.012, corrugated metal n = 0.022,
                gravelly earth channel n = 0.025). Assumes steady uniform free-surface flow.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
