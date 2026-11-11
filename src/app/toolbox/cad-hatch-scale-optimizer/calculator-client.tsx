'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Info, Layers, RotateCcw, Download, Zap } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

function parseNum(str: string): number {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function formatFixed(n: number, digits: number): string {
  return Number.isFinite(n) ? n.toFixed(digits) : '—';
}

type DrawingUnitKey = 'mm' | 'm' | 'inch';

const UNIT_MM_FACTOR: Record<DrawingUnitKey, { label: string; mmPerUnit: number }> = {
  mm: { label: 'Millimeters (1 unit = 1 mm)', mmPerUnit: 1.0 },
  m: { label: 'Meters (1 unit = 1000 mm)', mmPerUnit: 1000.0 },
  inch: { label: 'Inches (1 unit = 25.4 mm)', mmPerUnit: 25.4 },
};

interface HatchPreset {
  label: string;
  unit: DrawingUnitKey;
  plotScale: string;
  basePitch: string;
  targetSpacing: string;
  hpscale: string;
  width: string;
  height: string;
  hpmaxlines: string;
}

const PRESETS: HatchPreset[] = [
  {
    label: 'Metric mm 1:100 Optimal (Default)',
    unit: 'mm',
    plotScale: '100',
    basePitch: '0.125',
    targetSpacing: '2.5',
    hpscale: '2000',
    width: '10000',
    height: '10000',
    hpmaxlines: '100000',
  },
  {
    label: 'Unscaled HPSCALE = 1 (Exceeds HPMAXLINES)',
    unit: 'mm',
    plotScale: '100',
    basePitch: '0.125',
    targetSpacing: '2.5',
    hpscale: '1',
    width: '10000',
    height: '10000',
    hpmaxlines: '100000',
  },
  {
    label: 'Imperial Inches 1:48 (1/4" = 1\'-0")',
    unit: 'inch',
    plotScale: '48',
    basePitch: '0.125',
    targetSpacing: '3.175',
    hpscale: '48',
    width: '240',
    height: '240',
    hpmaxlines: '100000',
  },
];

export default function HatchScaleClient() {
  const [unit, setUnit] = useState<DrawingUnitKey>(PRESETS[0].unit);
  const [plotScaleStr, setPlotScaleStr] = useState(PRESETS[0].plotScale);
  const [basePitchStr, setBasePitchStr] = useState(PRESETS[0].basePitch);
  const [targetSpacingStr, setTargetSpacingStr] = useState(PRESETS[0].targetSpacing);
  const [hpscaleStr, setHpscaleStr] = useState(PRESETS[0].hpscale);
  const [widthStr, setWidthStr] = useState(PRESETS[0].width);
  const [heightStr, setHeightStr] = useState(PRESETS[0].height);
  const [hpmaxlinesStr, setHpmaxlinesStr] = useState(PRESETS[0].hpmaxlines);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const applyPreset = (p: HatchPreset) => {
    setUnit(p.unit);
    setPlotScaleStr(p.plotScale);
    setBasePitchStr(p.basePitch);
    setTargetSpacingStr(p.targetSpacing);
    setHpscaleStr(p.hpscale);
    setWidthStr(p.width);
    setHeightStr(p.height);
    setHpmaxlinesStr(p.hpmaxlines);
  };

  const handleReset = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const plotScale = parseNum(plotScaleStr);
    const basePitch = parseNum(basePitchStr);
    const targetSpacingMm = parseNum(targetSpacingStr);
    const hpscale = parseNum(hpscaleStr);
    const widthUnits = parseNum(widthStr);
    const heightUnits = parseNum(heightStr);
    const hpmaxlines = parseNum(hpmaxlinesStr);

    // Per AutoCAD Help: HPMAXLINES is an integer with valid values from 100 to 10,000,000
    if (
      !Number.isFinite(plotScale) ||
      !Number.isFinite(basePitch) ||
      !Number.isFinite(targetSpacingMm) ||
      !Number.isFinite(hpscale) ||
      !Number.isFinite(widthUnits) ||
      !Number.isFinite(heightUnits) ||
      !Number.isFinite(hpmaxlines) ||
      plotScale <= 0 ||
      basePitch <= 0 ||
      targetSpacingMm <= 0 ||
      hpscale <= 0 ||
      widthUnits <= 0 ||
      heightUnits <= 0 ||
      !Number.isInteger(hpmaxlines) ||
      hpmaxlines < 100 ||
      hpmaxlines > 10000000
    ) {
      return {
        valid: false,
        recHpscale: NaN,
        modelSpacingUnits: NaN,
        paperSpacingMm: NaN,
        estimatedLines: NaN,
        status: '—',
      };
    }

    // Step-by-step unit derivation:
    // 1. Model-space unit conversion factor u [mm / drawing unit]:
    //    mm -> 1.0, m -> 1000.0, inch -> 25.4
    // 2. Model-space perpendicular spacing for active HPSCALE:
    //    s_model [drawing units] = p_0 [drawing units] * HPSCALE [dimensionless]
    // 3. Plotted spacing on paper at plot scale 1 : S:
    //    d_paper [mm] = (s_model [units] * u [mm/unit]) / S [dimensionless]
    // 4. Recommended HPSCALE to achieve target plotted spacing d_target [mm]:
    //    HPSCALE_rec = (d_target [mm] * S) / (p_0 [units] * u [mm/unit])
    // 5. Estimated 45-degree parallel hatch line count (ANSI31 at 45 degrees) across W x H region:
    //    Projected span perpendicular to 45-degree lines: L_perp [units] = (W + H) / sqrt(2)
    //    N_lines = L_perp [units] / s_model [units] (dimensionless)
    const mmPerUnit = UNIT_MM_FACTOR[unit].mmPerUnit;
    const modelSpacingUnits = basePitch * hpscale;
    const paperSpacingMm = (modelSpacingUnits * mmPerUnit) / plotScale;
    const recHpscale = (targetSpacingMm * plotScale) / (basePitch * mmPerUnit);
    const projectedSpanUnits = (widthUnits + heightUnits) / Math.SQRT2;
    const estimatedLines = projectedSpanUnits / modelSpacingUnits;

    // Typical plotted spacing readability bounds (0.5 mm to 15.0 mm on sheet); adjust per drafting standard
    let status = 'Optimal';
    if (estimatedLines > hpmaxlines) {
      status = 'Exceeds HPMAXLINES';
    } else if (paperSpacingMm < 0.5) {
      status = 'Too Dense on Paper';
    } else if (paperSpacingMm > 15.0) {
      status = 'Too Sparse on Paper';
    }

    return {
      valid: true,
      recHpscale,
      modelSpacingUnits,
      paperSpacingMm,
      estimatedLines,
      status,
    };
  }, [unit, plotScaleStr, basePitchStr, targetSpacingStr, hpscaleStr, widthStr, heightStr, hpmaxlinesStr]);

  // Render preview on HTML5 Canvas using the validated result object
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    if (!result.valid) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Enter valid positive parameters to preview ANSI31', W / 2, H / 2);
      return;
    }

    if (result.status === 'Exceeds HPMAXLINES') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HPMAXLINES LIMIT EXCEEDED', W / 2, H / 2 - 10);
      ctx.fillText('AutoCAD suppresses hatch generation', W / 2, H / 2 + 10);
      return;
    }

    // Map plotted paper spacing (mm) to canvas pixels (~5 px per mm on paper)
    const pixelStep = result.paperSpacingMm * 5;
    if (pixelStep < 2) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAPER SPACING < 0.5 mm (SOLID APPEARANCE)', W / 2, H / 2);
      return;
    }

    if (pixelStep > W + H) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ SPARSE HATCH: SPACING EXCEEDS VIEWPORT ]', W / 2, H / 2);
      return;
    }

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.2;
    for (let offset = -H; offset < W + H; offset += pixelStep) {
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset + H, H);
      ctx.stroke();
    }
  }, [result]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# CAD Hatch Pattern Scale Optimization Report',
      '# Reference: Autodesk AutoCAD Official Help — HPSCALE, HPMAXLINES (100 to 10,000,000, default 100000), and ANSI31 (45 deg; 0.125 in imperial acad.pat, 3.175 in metric acadiso.pat)',
      '# Formula: HPSCALE_rec = (d_target * S) / (p_0 * u) | s_model = p_0 * HPSCALE | d_paper = (s_model * u) / S | N_lines = ((W + H) / sqrt(2)) / s_model',
      'Drawing_Unit,Plot_Scale_1_to_S,Base_Pitch_units,Target_Paper_Spacing_mm,Active_HPSCALE,Region_Width_units,Region_Height_units,HPMAXLINES_Limit,Recommended_HPSCALE,Model_Spacing_units,Plotted_Spacing_mm,Estimated_ANSI31_Lines,Status',
      `${unit},${plotScaleStr.trim()},${basePitchStr.trim()},${targetSpacingStr.trim()},${hpscaleStr.trim()},${widthStr.trim()},${heightStr.trim()},${hpmaxlinesStr.trim()},${formatFixed(result.recHpscale, 2)},${formatFixed(result.modelSpacingUnits, 3)},${formatFixed(result.paperSpacingMm, 3)},${formatFixed(result.estimatedLines, 2)},${result.status}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cad-hatch-scale-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; System Variables</h2>
              <p className="text-xs text-slate-500 font-medium">AutoCAD HPSCALE &amp; HPMAXLINES parameters</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Drafting Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Drawing Unit
            </label>
            <select
              data-testid="select-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as DrawingUnitKey)}
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            >
              {(Object.keys(UNIT_MM_FACTOR) as DrawingUnitKey[]).map((k) => (
                <option key={k} value={k}>
                  {UNIT_MM_FACTOR[k].label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Plot Scale 1 : S
              </label>
              <input
                type="text"
                data-testid="input-plot-scale"
                value={plotScaleStr}
                onChange={(e) => setPlotScaleStr(e.target.value)}
                placeholder="100"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Active HPSCALE
              </label>
              <input
                type="text"
                data-testid="input-hpscale"
                value={hpscaleStr}
                onChange={(e) => setHpscaleStr(e.target.value)}
                placeholder="2000"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Base Pitch p₀ (units)
              </label>
              <p className="text-[11px] text-slate-400 mb-1">
                ANSI31: 0.125 (acad.pat imperial) · 3.175 (acadiso.pat metric)
              </p>
              <input
                type="text"
                data-testid="input-base-pitch"
                value={basePitchStr}
                onChange={(e) => setBasePitchStr(e.target.value)}
                placeholder="0.125"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Target Spacing (mm)
              </label>
              <p className="text-[11px] text-slate-400 mb-1">Typical sheet: 2.0–3.0 mm</p>
              <input
                type="text"
                data-testid="input-target-spacing"
                value={targetSpacingStr}
                onChange={(e) => setTargetSpacingStr(e.target.value)}
                placeholder="2.5"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Region Width W (units)
              </label>
              <input
                type="text"
                data-testid="input-width"
                value={widthStr}
                onChange={(e) => setWidthStr(e.target.value)}
                placeholder="10000"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Region Height H (units)
              </label>
              <input
                type="text"
                data-testid="input-height"
                value={heightStr}
                onChange={(e) => setHeightStr(e.target.value)}
                placeholder="10000"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              HPMAXLINES Limit (100 – 10,000,000)
            </label>
            <p className="text-xs text-slate-400 mb-1.5">
              AutoCAD initial value: 100000 (saved in Registry; integer range 100 to 10,000,000).
            </p>
            <input
              type="text"
              data-testid="input-hpmaxlines"
              value={hpmaxlinesStr}
              onChange={(e) => setHpmaxlinesStr(e.target.value)}
              placeholder="100000"
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="reset-btn"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={handleExportCsv}
              disabled={!result.valid}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Scale &amp; Density Results</h2>
              </div>
              <div
                data-testid="result-status"
                className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border ${
                  !result.valid
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : result.status === 'Optimal'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : result.status === 'Exceeds HPMAXLINES'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {result.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                  Recommended HPSCALE
                </div>
                <div data-testid="result-rec-hpscale" className="text-3xl font-black text-blue-900">
                  {formatFixed(result.recHpscale, 2)}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">
                  Plotted Paper Spacing (mm)
                </div>
                <div data-testid="result-paper-spacing" className="text-3xl font-black text-emerald-900">
                  {formatFixed(result.paperSpacingMm, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Model-Space Pitch s_model (units)
                </div>
                <div data-testid="result-model-spacing" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.modelSpacingUnits, 3)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Estimated 45° ANSI31 Line Count
                </div>
                <div data-testid="result-line-count" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.estimatedLines, 2)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  HPSCALE_rec = (d_target · S) / (p₀ · u) &nbsp;|&nbsp; d_paper = (p₀ · HPSCALE · u) / S &nbsp;|&nbsp; N_lines = ((W + H) / √2) / (p₀ · HPSCALE)
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                Reference: Autodesk AutoCAD Help — HPSCALE system variable (sets the default scale factor for new hatch patterns; initial value 1.0000), HPMAXLINES system variable (sets the maximum number of hatch lines generated in a hatch operation; initial value 100000, valid integer range 100 to 10,000,000), and standard ANSI31 hatch pattern definition (*ANSI31, ANSI Iron, Brick, Stone masonry: 45° angle, with perpendicular base spacing 0.125 in imperial acad.pat and 3.175 in metric acadiso.pat). Paper spacing readability bounds (0.5–15.0 mm) are typical drafting values; adjust per project standard.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                45° ANSI31 Plotted Density Preview
              </span>
              <span className="text-xs text-slate-500 font-mono">
                HPMAXLINES: {result.valid ? hpmaxlinesStr.trim() : '—'}
              </span>
            </div>
            <div className="flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-3">
              <canvas
                ref={canvasRef}
                data-testid="hatch-preview-canvas"
                width={420}
                height={180}
                className="rounded-xl max-w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
