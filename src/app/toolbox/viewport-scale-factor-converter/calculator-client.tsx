'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import { Info, Download, HelpCircle, Layers, Copy, Check, FileText } from 'lucide-react';

interface ScalePreset {
  label: string;
  ratio: number;
}

const METRIC_PRESETS: ScalePreset[] = [
  { label: '1:1 (Full Size)', ratio: 1 },
  { label: '1:2 (Half Size)', ratio: 2 },
  { label: '1:5', ratio: 5 },
  { label: '1:10', ratio: 10 },
  { label: '1:20', ratio: 20 },
  { label: '1:50 (Standard Detail)', ratio: 50 },
  { label: '1:100 (Standard Layout)', ratio: 100 },
  { label: '1:200', ratio: 200 },
  { label: '1:500 (Site Layout)', ratio: 500 },
  { label: '1:1000 (Civil Map)', ratio: 1000 },
];

const IMPERIAL_PRESETS: ScalePreset[] = [
  { label: '1:1 (Full Size)', ratio: 1 },
  { label: '3" = 1\'-0" (1:4)', ratio: 4 },
  { label: '1-1/2" = 1\'-0" (1:8)', ratio: 8 },
  { label: '1" = 1\'-0" (1:12)', ratio: 12 },
  { label: '3/4" = 1\'-0" (1:16)', ratio: 16 },
  { label: '1/2" = 1\'-0" (1:24)', ratio: 24 },
  { label: '3/8" = 1\'-0" (1:32)', ratio: 32 },
  { label: '1/4" = 1\'-0" (1:48)', ratio: 48 },
  { label: '1/8" = 1\'-0" (1:96)', ratio: 96 },
  { label: '3/32" = 1\'-0" (1:128)', ratio: 128 },
  { label: '1/16" = 1\'-0" (1:192)', ratio: 192 },
];

export default function ViewportScaleCalculatorClient() {
  const [modelUnit, setModelUnit] = useState<'mm' | 'cm' | 'm' | 'in' | 'ft'>('m');
  const [paperUnit, setPaperUnit] = useState<'mm' | 'in'>('mm');
  const [scaleSystem, setScaleSystem] = useState<'metric' | 'imperial'>('metric');
  const [presetRatio, setPresetRatio] = useState<number>(100);
  const [customRatio, setCustomRatio] = useState<number>(100);
  const [useCustomRatio, setUseCustomRatio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeRatio = useCustomRatio ? customRatio : presetRatio;

  // Factor to convert model units to paper units
  // E.g., if model is 'm' and paper is 'mm', 1 model unit (1m) = 1000 paper units (1000mm).
  // So factor = 1000.
  const unitConversionFactor = useMemo(() => {
    // Model to mm
    let modelToMm = 1;
    if (modelUnit === 'cm') modelToMm = 10;
    if (modelUnit === 'm') modelToMm = 1000;
    if (modelUnit === 'in') modelToMm = 25.4;
    if (modelUnit === 'ft') modelToMm = 304.8;

    // Paper to mm
    const paperToMm = paperUnit === 'in' ? 25.4 : 1;

    return modelToMm / paperToMm;
  }, [modelUnit, paperUnit]);

  // Calculations
  const results = useMemo(() => {
    const ratio = activeRatio <= 0 ? 1 : activeRatio;

    // Zoom XP factor: (Unit Conversion Factor) / (Print Scale Ratio)
    // E.g. Model in m, Paper in mm, Scale 1:100.
    // Conversion = 1000. Ratio = 100.
    // XP = 1000 / 100 = 10.
    // So zoom factor is 10XP.
    const xpValue = unitConversionFactor / ratio;

    // Formatted XP factor
    let xpCommandString = '';
    if (xpValue === Math.round(xpValue)) {
      xpCommandString = `${xpValue}XP`;
    } else {
      // Show as fraction if decimal is complicated
      const decimalStr = xpValue.toFixed(4);
      if (modelUnit === 'm' && paperUnit === 'mm') {
        xpCommandString = `${1000}/${ratio}XP`;
      } else if (modelUnit === 'cm' && paperUnit === 'mm') {
        xpCommandString = `${10}/${ratio}XP`;
      } else if (modelUnit === 'mm' && paperUnit === 'mm') {
        xpCommandString = `1/${ratio}XP`;
      } else {
        xpCommandString = `${xpValue.toFixed(4)}XP`;
      }
    }

    // Equivalent drawing scales: e.g. 1 mm on paper represents X meters in model space
    const paperRepresentation = ratio / unitConversionFactor;

    return {
      xpValue,
      xpCommandString,
      paperRepresentation,
    };
  }, [activeRatio, unitConversionFactor, modelUnit, paperUnit]);

  // Copy to clipboard
  const handleCopyCommand = () => {
    if (!results) return;
    const cmd = `Z\nS\n${results.xpCommandString}\n`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG parameters scaling for Page layout preview
  const svgPreview = useMemo(() => {
    if (!results) return null;

    // Page dimension inside SVG viewBox (approx 360x240 for display)
    const pageWidth = 360;
    const pageHeight = 240;

    // Viewport window inside paper sheet (centered)
    const vpWidth = 240;
    const vpHeight = 160;
    const vpX = (pageWidth - vpWidth) / 2;
    const vpY = (pageHeight - vpHeight) / 2;

    // Center of viewport
    const vpcX = vpX + vpWidth / 2;
    const vpcY = vpY + vpHeight / 2;

    // Draw a house object outline (dimensions relative to model units)
    // Assume house base size is 12 units in model space.
    // If model unit is meters, house is 12m. If mm, house is 12mm (tiny!).
    // Let's compute a scaled visual representation:
    // Visual Size = Model Size * XP Value * Scaling Factor.
    // If zoom is 1:100 (m to mm), XP = 10XP. Visual Size = 12 * 10 = 120px.
    const baseModelSize = 12; // 12 units (e.g. 12m or 12in)
    const rawVisualSize = baseModelSize * results.xpValue * 8; // Scaling factor for display clarity

    // Limit visual size to avoid crashing layout
    const visualSize = Math.max(2, Math.min(300, rawVisualSize));

    // House paths centered in viewport
    const x0 = vpcX - visualSize / 2;
    const y0 = vpcY + visualSize / 3;
    const w = visualSize;
    const h = visualSize / 2;

    // Roof coordinates
    const rx1 = x0;
    const ry1 = y0;
    const rx2 = vpcX;
    const ry2 = vpcY - visualSize / 3;
    const rx3 = x0 + w;
    const ry3 = y0;

    // Door coordinates
    const dx = vpcX - w / 8;
    const dy = y0 + h - h / 2;
    const dw = w / 4;
    const dh = h / 2;

    return {
      pageWidth,
      pageHeight,
      vpWidth,
      vpHeight,
      vpX,
      vpY,
      vpcX,
      vpcY,
      housePath: `M ${x0} ${y0} L ${x0} ${y0 + h} L ${x0 + w} ${y0 + h} L ${x0 + w} ${y0} Z`,
      roofPath: `M ${rx1} ${ry1} L ${rx2} ${ry2} L ${rx3} ${ry3} Z`,
      doorPath: `M ${dx} ${dy} L ${dx} ${dy + dh} L ${dx + dw} ${dy + dh} L ${dx + dw} ${dy} Z`,
      visualSize,
      isOverflow: rawVisualSize > vpWidth || rawVisualSize > vpHeight,
    };
  }, [results]);

  // Export report
  const downloadReport = () => {
    if (!results) return;
    const csvContent = [
      ['CAD Viewport Scale Factor Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Model Space Unit', modelUnit],
      ['Paper Space Unit', paperUnit],
      ['Print Scale (1:X)', activeRatio],
      ['Computed XP Zoom Factor', results.xpValue.toFixed(6)],
      ['AutoCAD ZOOM Command input', results.xpCommandString],
      ['Scale Equivalent', `1 ${paperUnit} on paper = ${results.paperRepresentation.toFixed(4)} ${modelUnit} in model`],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cad-viewport-scale-factor-report-1to${activeRatio}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Parameters Configuration Row */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Input parameters panel */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Scale Configuration</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Select drafting units and target printing scale to convert Zoom factor.
            </p>
          </div>

          <div className="space-y-6">
            {/* Model Space Units selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Model Space Unit (Drafting unit)</label>
              <div className="flex flex-wrap gap-2">
                {(['mm', 'cm', 'm', 'in', 'ft'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setModelUnit(unit)}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      modelUnit === unit
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {unit === 'mm' && 'Millimeters (mm)'}
                    {unit === 'cm' && 'Centimeters (cm)'}
                    {unit === 'm' && 'Meters (m)'}
                    {unit === 'in' && 'Inches (in)'}
                    {unit === 'ft' && 'Feet (ft)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Space Layout Sheet Units selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Layout Sheet Unit (Paper unit)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaperUnit('mm')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    paperUnit === 'mm'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Metric Layout (mm)
                </button>
                <button
                  onClick={() => setPaperUnit('in')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    paperUnit === 'in'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Imperial Layout (in)
                </button>
              </div>
            </div>

            {/* Target printing scale selection */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Target Print Scale (1:X)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setScaleSystem('metric');
                      setUseCustomRatio(false);
                      setPresetRatio(100);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-black border transition-all ${
                      scaleSystem === 'metric' && !useCustomRatio ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    Metric Presets
                  </button>
                  <button
                    onClick={() => {
                      setScaleSystem('imperial');
                      setUseCustomRatio(false);
                      setPresetRatio(96);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-black border transition-all ${
                      scaleSystem === 'imperial' && !useCustomRatio ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    Imperial Presets
                  </button>
                  <button
                    onClick={() => setUseCustomRatio(true)}
                    className={`px-2.5 py-1 rounded text-[10px] font-black border transition-all ${
                      useCustomRatio ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {useCustomRatio ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400">1 :</span>
                    <input
                      type="number"
                      value={customRatio}
                      min={1}
                      max={10000}
                      onChange={(e) => setCustomRatio(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white text-sm"
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    step="1"
                    value={customRatio}
                    onChange={(e) => setCustomRatio(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400">Select Scale Preset</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(scaleSystem === 'metric' ? METRIC_PRESETS : IMPERIAL_PRESETS).map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setPresetRatio(p.ratio)}
                        className={`py-2 px-3 rounded-xl text-xs font-black border text-left transition-all ${
                          presetRatio === p.ratio
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold shadow-sm'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: SVG layout preview & result cards */}
        {results && svgPreview && (
          <div className="lg:col-span-7 space-y-6">
            {/* Visual preview card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> Print Sheet Layout Mockup (纸张视口预览)
                </h3>
                {svgPreview.isOverflow && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
                    ⚠️ Viewport Overflow
                  </span>
                )}
              </div>

              {/* Dynamic SVG page sheet preview */}
              <div className="w-full flex items-center justify-center bg-slate-900/2 rounded-2xl border border-slate-50 p-2 relative min-h-[300px]">
                <svg
                  viewBox={`0 0 ${svgPreview.pageWidth} ${svgPreview.pageHeight}`}
                  className="w-full max-w-[360px] h-auto drop-shadow-sm font-sans"
                >
                  {/* Grid background */}
                  <rect width="100%" height="100%" fill="#f8fafc" rx="12" />

                  {/* Paper sheet body (white) */}
                  <rect
                    x="20"
                    y="20"
                    width={svgPreview.pageWidth - 40}
                    height={svgPreview.pageHeight - 40}
                    fill="white"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    rx="4"
                  />
                  <text x="30" y="32" fill="#94a3b8" className="text-[8px] font-black uppercase tracking-wider">
                    Printable Sheet Boundary ({paperUnit === 'mm' ? 'A3 Sheet' : '11&quot;x8.5&quot; Letter'})
                  </text>

                  {/* Viewport Boundary window (solid blue) */}
                  <rect
                    x={svgPreview.vpX}
                    y={svgPreview.vpY}
                    width={svgPreview.vpWidth}
                    height={svgPreview.vpHeight}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="none"
                  />
                  <text x={svgPreview.vpX + 6} y={svgPreview.vpY + 12} fill="#2563eb" className="text-[8px] font-black uppercase tracking-wider">
                    Viewport Window
                  </text>

                  {/* Drawing object inside viewport (House vector) */}
                  <g clipPath="url(#viewport-clip)">
                    <defs>
                      <clipPath id="viewport-clip">
                        <rect
                          x={svgPreview.vpX}
                          y={svgPreview.vpY}
                          width={svgPreview.vpWidth}
                          height={svgPreview.vpHeight}
                        />
                      </clipPath>
                    </defs>

                    {/* House wall path */}
                    <path
                      d={svgPreview.housePath}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Roof path */}
                    <path
                      d={svgPreview.roofPath}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Door path */}
                    <path
                      d={svgPreview.doorPath}
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    {/* Interior circle visual placeholder */}
                    <circle
                      cx={svgPreview.vpcX}
                      cy={svgPreview.vpcY - svgPreview.visualSize / 15}
                      r={svgPreview.visualSize / 8}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </g>

                  {/* Red dimension labels on layout */}
                  {svgPreview.visualSize > 10 && (
                    <>
                      {/* Left horizontal dimension line */}
                      <line
                        x1={svgPreview.vpcX - svgPreview.visualSize / 2}
                        y1={svgPreview.vpcY + svgPreview.visualSize / 3 + svgPreview.visualSize / 2 + 10}
                        x2={svgPreview.vpcX + svgPreview.visualSize / 2}
                        y2={svgPreview.vpcY + svgPreview.visualSize / 3 + svgPreview.visualSize / 2 + 10}
                        stroke="#ef4444"
                        strokeWidth="0.8"
                      />
                      <circle cx={svgPreview.vpcX - svgPreview.visualSize / 2} cy={svgPreview.vpcY + svgPreview.visualSize / 3 + svgPreview.visualSize / 2 + 10} r="1.5" fill="#ef4444" />
                      <circle cx={svgPreview.vpcX + svgPreview.visualSize / 2} cy={svgPreview.vpcY + svgPreview.visualSize / 3 + svgPreview.visualSize / 2 + 10} r="1.5" fill="#ef4444" />
                      <text
                        x={svgPreview.vpcX}
                        y={svgPreview.vpcY + svgPreview.visualSize / 3 + svgPreview.visualSize / 2 + 20}
                        fill="#ef4444"
                        textAnchor="middle"
                        className="text-[8px] font-black font-mono"
                      >
                        Print size: {(12 * results.xpValue).toFixed(1)} {paperUnit}
                      </text>
                    </>
                  )}
                </svg>
              </div>
            </div>

            {/* Calculations results details cards */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Viewport Scale factor</h3>
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> CSV Report
                </button>
              </div>

              {/* AutoCAD command block card */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AutoCAD Zoom Command Multiplier
                  </div>
                  <div className="text-3xl font-black tracking-tight text-blue-400 font-mono">
                    {results.xpCommandString}
                  </div>
                </div>
                <button
                  onClick={handleCopyCommand}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-blue-600/10 active:scale-95 transition-all shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied Command!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Zoom macro
                    </>
                  )}
                </button>
              </div>

              {/* Formula & variables summary card */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/40 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 pb-2">Equivalent Ratios</h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
                  <div className="space-y-1 bg-slate-800/30 p-4 rounded-xl border border-slate-800/30 text-center">
                    <span className="text-slate-400 block text-[9px] uppercase">Paper space representation</span>
                    <span className="text-base font-black text-white">
                      1 {paperUnit} = {results.paperRepresentation.toFixed(4)} {modelUnit}
                    </span>
                  </div>
                  <div className="space-y-1 bg-slate-800/30 p-4 rounded-xl border border-slate-800/30 text-center">
                    <span className="text-slate-400 block text-[9px] uppercase">Plotting scale factor</span>
                    <span className="text-base font-black text-white">
                      1 : {activeRatio}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Engineering Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Viewport Scaling Engineering Reference
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">1. Setting Viewport Scale in AutoCAD</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Step 1</strong>: Double-click inside the layout viewport window to activate model space editing.
              </p>
              <p>
                <strong>Step 2</strong>: Type <code className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-[10px]">Z</code> (Zoom) and press Enter.
              </p>
              <p>
                <strong>Step 3</strong>: Type <code className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-[10px]">S</code> (Scale) and press Enter.
              </p>
              <p>
                <strong>Step 4</strong>: Type the computed multiplier followed by <code className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-[10px]">XP</code> (e.g. <code className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-[10px]">{results?.xpCommandString || '20XP'}</code>) and press Enter.
              </p>
              <p>
                <strong>Step 5</strong>: Double-click outside the viewport to lock paper space, then lock the viewport display scaling using the properties palette.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">2. Why is the XP factor not always 1/Scale?</h4>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-mono">
              <div>
                <span className="text-slate-400">// Unit Mismatch Correction</span>
                <div>Layout paper space sheets are always drawn in Millimeters (or Inches).</div>
                <div className="pt-2">If your model is drawn in Meters (common for civil and floor plans), 1 unit = 1000mm. To print at 1:100 scale, the multiplier is:</div>
                <div className="text-blue-600 font-bold font-mono pt-1 text-[11px]">XP = (1000 mm / 1 m) / 100 = 10XP</div>
              </div>
              <div className="pt-2 border-t border-slate-200/50">
                <span className="text-slate-400">// Command Macro workflow</span>
                <div>Double click viewport, paste:</div>
                <div className="text-slate-800 font-mono font-bold text-[11px]">_zoom _scale {results?.xpCommandString || '20XP'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter banner */}
      <NewsletterSubscribe
        variant="banner"
        title="Get the CAD Layout & Plotting handbook"
        description="Subscribe to receive our cheat sheet on plotting pen weights, standard layout borders (A0-A4), and custom Page setup profiles."
        buttonText="Get Plotting Cheat Sheet"
        placeholder="Enter your work email"
        className="mt-12"
      />
    </div>
  );
}
