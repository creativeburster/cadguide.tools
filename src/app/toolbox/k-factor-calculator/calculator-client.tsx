'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import { Info, Download, HelpCircle, Layers, RefreshCw, FileText } from 'lucide-react';

interface Preset {
  name: string;
  material: string;
  thickness: number;
  radius: number;
  kFactor: number;
}

const PRESETS: Preset[] = [
  { name: '1.0mm Mild Steel (Press Brake)', material: 'Mild Steel', thickness: 1.0, radius: 1.0, kFactor: 0.44 },
  { name: '2.0mm Mild Steel (Press Brake)', material: 'Mild Steel', thickness: 2.0, radius: 2.0, kFactor: 0.44 },
  { name: '1.5mm Stainless Steel', material: 'Stainless Steel', thickness: 1.5, radius: 2.0, kFactor: 0.38 },
  { name: '1.2mm Aluminum (5052)', material: 'Aluminum', thickness: 1.2, radius: 1.5, kFactor: 0.40 },
  { name: '3.0mm Copper (Soft)', material: 'Copper/Brass', thickness: 3.0, radius: 3.0, kFactor: 0.45 },
];

export default function KFactorCalculatorClient() {
  const [material, setMaterial] = useState<string>('Mild Steel');
  const [referenceMode, setReferenceMode] = useState<'apex' | 'tangent'>('apex');
  const [kMode, setKMode] = useState<'custom' | 'din6935'>('custom');

  // Input states
  const [thickness, setThickness] = useState<number>(2.0);
  const [radius, setRadius] = useState<number>(2.0);
  const [angle, setAngle] = useState<number>(90);
  const [flange1, setFlange1] = useState<number>(50);
  const [flange2, setFlange2] = useState<number>(50);
  const [customK, setCustomK] = useState<number>(0.44);

  // Apply Preset
  const handleApplyPreset = (preset: Preset) => {
    setMaterial(preset.material);
    setThickness(preset.thickness);
    setRadius(preset.radius);
    setCustomK(preset.kFactor);
    setKMode('custom');
  };

  // DIN 6935 Auto K-factor logic
  const dinKFactor = useMemo(() => {
    if (thickness <= 0) return 0;
    const ratio = radius / thickness;
    if (ratio <= 0.6) return 0.33;
    if (ratio <= 1.0) return 0.40;
    if (ratio <= 1.5) return 0.43;
    if (ratio <= 2.0) return 0.45;
    if (ratio <= 3.0) return 0.47;
    return 0.50;
  }, [radius, thickness]);

  const activeK = kMode === 'din6935' ? dinKFactor : customK;

  // Perform calculations
  const calcResults = useMemo(() => {
    const T = thickness;
    const R = radius;
    const K = activeK;
    const alphaDeg = angle;
    const alphaRad = (alphaDeg * Math.PI) / 180;

    // Bend Allowance (BA)
    // Formula: BA = pi * (alpha / 180) * (R + K * T)
    const bendAllowance = alphaRad * (R + K * T);

    // Outside Setback (OS)
    // Formula: OS = tan(alpha / 2) * (R + T)
    const setback = Math.tan(alphaRad / 2) * (R + T);

    // Bend Deduction (BD)
    // Formula: BD = 2 * OS - BA
    const bendDeduction = 2 * setback - bendAllowance;

    // Flat Length (L) and Tangent Lengths
    let tangent1 = 0;
    let tangent2 = 0;
    let flatLength = 0;

    if (referenceMode === 'apex') {
      // Inputs flange1, flange2 represent outside lengths to apex
      tangent1 = Math.max(0, flange1 - setback);
      tangent2 = Math.max(0, flange2 - setback);
      flatLength = flange1 + flange2 - bendDeduction;
    } else {
      // Inputs flange1, flange2 represent straight tangent lengths
      tangent1 = flange1;
      tangent2 = flange2;
      flatLength = flange1 + flange2 + bendAllowance;
    }

    return {
      ba: bendAllowance,
      os: setback,
      bd: bendDeduction,
      tangent1,
      tangent2,
      flatLength,
    };
  }, [thickness, radius, activeK, angle, flange1, flange2, referenceMode]);

  // Download SVG
  const downloadSvg = () => {
    const svgEl = document.getElementById('k-factor-svg');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k-factor-bend-radius-${radius}mm-thickness-${thickness}mm.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Export
  const downloadCsv = () => {
    const csvContent = [
      ['K-Factor & Bend Calculator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Material', material],
      ['Bending Angle (deg)', angle],
      ['Sheet Thickness (mm)', thickness],
      ['Inner Radius (mm)', radius],
      ['K-Factor', activeK.toFixed(4)],
      ['Reference Mode', referenceMode === 'apex' ? 'Apex (Outside Flanges)' : 'Tangent (Straight Flanges)'],
      ['Flange 1 Length (mm)', flange1],
      ['Flange 2 Length (mm)', flange2],
      ['', ''],
      ['Calculated Results', ''],
      ['Bend Allowance (BA) (mm)', calcResults.ba.toFixed(4)],
      ['Outside Setback (OS) (mm)', calcResults.os.toFixed(4)],
      ['Bend Deduction (BD) (mm)', calcResults.bd.toFixed(4)],
      ['Flat Pattern Length (mm)', calcResults.flatLength.toFixed(4)],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k-factor-calculation-report-${material.replace(/\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Bending coordinates calculation for dynamic SVG
  const svgCoords = useMemo(() => {
    const cx = 140;
    const cy = 200;
    const R = radius * 7; // Scaling factor for visual clarity
    const T = thickness * 7;
    const K = activeK;
    const alpha = angle;
    const thetaEnd = (90 - alpha) * (Math.PI / 180);

    // Straight tangent lengths scaled for visual display
    // Scale tangent lengths to fit nicely in 420x350 box
    const maxVisualTangent = 120;
    const scaleFactor = maxVisualTangent / Math.max(flange1, flange2, 20);
    const L_t1 = calcResults.tangent1 * scaleFactor;
    const L_t2 = calcResults.tangent2 * scaleFactor;

    // Inner surface coords
    const innerT1 = { x: cx, y: cy + R };
    const innerStart = { x: cx - R - L_t1, y: cy + R };
    const innerArcEnd = {
      x: cx + R * Math.cos(thetaEnd),
      y: cy + R * Math.sin(thetaEnd),
    };
    const innerEnd = {
      x: innerArcEnd.x + L_t2 * Math.sin(thetaEnd),
      y: innerArcEnd.y - L_t2 * Math.cos(thetaEnd),
    };

    // Outer surface coords
    const outerT1 = { x: cx, y: cy + R + T };
    const outerStart = { x: cx - R - L_t1, y: cy + R + T };
    const outerArcEnd = {
      x: cx + (R + T) * Math.cos(thetaEnd),
      y: cy + (R + T) * Math.sin(thetaEnd),
    };
    const outerEnd = {
      x: outerArcEnd.x + L_t2 * Math.sin(thetaEnd),
      y: outerArcEnd.y - L_t2 * Math.cos(thetaEnd),
    };

    // Neutral Axis coords
    const neutralStart = { x: cx - R - L_t1, y: cy + R + K * T };
    const neutralT1 = { x: cx, y: cy + R + K * T };
    const neutralArcEnd = {
      x: cx + (R + K * T) * Math.cos(thetaEnd),
      y: cy + (R + K * T) * Math.sin(thetaEnd),
    };
    const neutralEnd = {
      x: neutralArcEnd.x + L_t2 * Math.sin(thetaEnd),
      y: neutralArcEnd.y - L_t2 * Math.cos(thetaEnd),
    };

    // Apex intersection coords
    const osVal = calcResults.os * scaleFactor;
    const apexInner = { x: cx + R * Math.tan((alpha / 2) * (Math.PI / 180)), y: cy + R };
    const apexOuter = { x: cx + (R + T) * Math.tan((alpha / 2) * (Math.PI / 180)), y: cy + R + T };

    return {
      innerStart,
      innerT1,
      innerArcEnd,
      innerEnd,
      outerStart,
      outerT1,
      outerArcEnd,
      outerEnd,
      neutralStart,
      neutralT1,
      neutralArcEnd,
      neutralEnd,
      apexInner,
      apexOuter,
      R,
      T,
      cx,
      cy,
      thetaEnd,
      largeArcFlag: 0,
      sweepFlag: 0,
    };
  }, [radius, thickness, activeK, angle, flange1, flange2, calcResults]);

  return (
    <div className="space-y-12">
      {/* Preset Quick Selection Bar */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Presets & Bending Templates
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleApplyPreset(preset)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Bending Parameters</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Adjust sliders or input exact values to update calculations instantly.
            </p>
          </div>

          <div className="space-y-6">
            {/* Dimension Reference Mode */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Dimension Reference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setReferenceMode('apex')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    referenceMode === 'apex'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Outside Flange (Apex)
                </button>
                <button
                  onClick={() => setReferenceMode('tangent')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    referenceMode === 'tangent'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tangent (Straight)
                </button>
              </div>
            </div>

            {/* Thickness Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Sheet Thickness (T)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={thickness}
                    step={0.1}
                    min={0.1}
                    max={20}
                    onChange={(e) => setThickness(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-16 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                  />
                  <span>mm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Inside Radius Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Inside Radius (R)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={radius}
                    step={0.1}
                    min={0.1}
                    max={30}
                    onChange={(e) => setRadius(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-16 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                  />
                  <span>mm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.1"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Bending Angle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Bending Angle (Deflection)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={angle}
                    step={1}
                    min={10}
                    max={170}
                    onChange={(e) => setAngle(Math.max(10, Math.min(170, parseFloat(e.target.value) || 90)))}
                    className="w-16 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                  />
                  <span>°</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="170"
                step="1"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Flange 1 & 2 Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">Flange 1 (L1)</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={flange1}
                    onChange={(e) => setFlange1(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mm</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">Flange 2 (L2)</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={flange2}
                    onChange={(e) => setFlange2(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mm</span>
                </div>
              </div>
            </div>

            {/* K-Factor Calculation Mode */}
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">K-Factor Calculation</label>
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  <Info className="w-3 h-3" /> Auto is DIN 6935
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setKMode('custom')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    kMode === 'custom'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Custom Manual K
                </button>
                <button
                  onClick={() => setKMode('din6935')}
                  className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                    kMode === 'din6935'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  DIN 6935 Auto
                </button>
              </div>

              {kMode === 'custom' ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="text-slate-400">Manual K-Factor Value</span>
                    <input
                      type="number"
                      step={0.01}
                      min={0}
                      max={1}
                      value={customK}
                      onChange={(e) => setCustomK(Math.max(0, Math.min(1, parseFloat(e.target.value) || 0.44)))}
                      className="w-16 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.6"
                    step="0.01"
                    value={customK}
                    onChange={(e) => setCustomK(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 animate-fadeIn">
                  <div>
                    <div className="text-slate-400">DIN 6935 Auto-Computed K:</div>
                    <div className="text-blue-600 text-sm font-black mt-0.5">K = {dinKFactor.toFixed(2)}</div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-semibold max-w-[160px] leading-relaxed">
                    Based on R/T ratio: {(radius / thickness).toFixed(2)}. (R/T &gt; 3.0 gives K = 0.50).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Visual SVG + Results Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live SVG Visualizer Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Header / Actions inside card */}
            <div className="w-full flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" /> Bending Profile Visualizer
              </h3>
              <button
                onClick={downloadSvg}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                title="Download SVG file"
              >
                <Download className="w-3.5 h-3.5" /> SVG
              </button>
            </div>

            {/* Dynamic Bending SVG */}
            <div className="w-full flex items-center justify-center bg-slate-900/2 rounded-2xl border border-slate-50 p-4 relative min-h-[300px]">
              <svg
                id="k-factor-svg"
                viewBox="0 0 420 350"
                className="w-full max-w-[420px] h-auto drop-shadow-sm font-sans"
              >
                {/* Grid Gridlines Background */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" rx="16" />

                {/* Inner Sheet Path */}
                <path
                  d={`M ${svgCoords.innerStart.x} ${svgCoords.innerStart.y}
                     L ${svgCoords.innerT1.x} ${svgCoords.innerT1.y}
                     A ${svgCoords.R} ${svgCoords.R} 0 ${svgCoords.largeArcFlag} ${svgCoords.sweepFlag} ${svgCoords.innerArcEnd.x} ${svgCoords.innerArcEnd.y}
                     L ${svgCoords.innerEnd.x} ${svgCoords.innerEnd.y}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Outer Sheet Path */}
                <path
                  d={`M ${svgCoords.outerStart.x} ${svgCoords.outerStart.y}
                     L ${svgCoords.outerT1.x} ${svgCoords.outerT1.y}
                     A ${svgCoords.R + svgCoords.T} ${svgCoords.R + svgCoords.T} 0 ${svgCoords.largeArcFlag} ${svgCoords.sweepFlag} ${svgCoords.outerArcEnd.x} ${svgCoords.outerArcEnd.y}
                     L ${svgCoords.outerEnd.x} ${svgCoords.outerEnd.y}`}
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Flat/Cut end cap line (Start side) */}
                <line
                  x1={svgCoords.innerStart.x}
                  y1={svgCoords.innerStart.y}
                  x2={svgCoords.outerStart.x}
                  y2={svgCoords.outerStart.y}
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Flat/Cut end cap line (End side) */}
                <line
                  x1={svgCoords.innerEnd.x}
                  y1={svgCoords.innerEnd.y}
                  x2={svgCoords.outerEnd.x}
                  y2={svgCoords.outerEnd.y}
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Shaded Neutral Fiber Axis (dashed red) */}
                <path
                  d={`M ${svgCoords.neutralStart.x} ${svgCoords.neutralStart.y}
                     L ${svgCoords.neutralT1.x} ${svgCoords.neutralT1.y}
                     A ${svgCoords.R + (thickness * 7 * activeK)} ${svgCoords.R + (thickness * 7 * activeK)} 0 ${svgCoords.largeArcFlag} ${svgCoords.sweepFlag} ${svgCoords.neutralArcEnd.x} ${svgCoords.neutralArcEnd.y}
                     L ${svgCoords.neutralEnd.x} ${svgCoords.neutralEnd.y}`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.8"
                  strokeDasharray="4,4"
                />

                {/* Apex Helper Lines (Outside intersect) */}
                {angle === 90 && (
                  <>
                    <line
                      x1={svgCoords.outerStart.x}
                      y1={svgCoords.outerStart.y}
                      x2={svgCoords.outerT1.x + svgCoords.R + svgCoords.T}
                      y2={svgCoords.outerStart.y}
                      stroke="#cbd5e1"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                    <line
                      x1={svgCoords.outerEnd.x}
                      y1={svgCoords.outerEnd.y}
                      x2={svgCoords.outerEnd.x}
                      y2={svgCoords.outerStart.y}
                      stroke="#cbd5e1"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                    <circle cx={svgCoords.outerT1.x + svgCoords.R + svgCoords.T} cy={svgCoords.outerStart.y} r="3" fill="#64748b" />
                  </>
                )}

                {/* Inside Center Mark (cross) */}
                <line x1={svgCoords.cx - 5} y1={svgCoords.cy} x2={svgCoords.cx + 5} y2={svgCoords.cy} stroke="#64748b" strokeWidth="1" />
                <line x1={svgCoords.cx} y1={svgCoords.cy - 5} x2={svgCoords.cx} y2={svgCoords.cy + 5} stroke="#64748b" strokeWidth="1" />
                <circle cx={svgCoords.cx} cy={svgCoords.cy} r="1.5" fill="#64748b" />

                {/* Labels and Arrows */}
                {/* R Label */}
                <line x1={svgCoords.cx} y1={svgCoords.cy} x2={svgCoords.cx - svgCoords.R + 8} y2={svgCoords.cy + svgCoords.R - 8} stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="1,1" />
                <text
                  x={svgCoords.cx - (svgCoords.R / 2)}
                  y={svgCoords.cy + (svgCoords.R / 2)}
                  fill="#2563eb"
                  className="text-[10px] font-black"
                >
                  R={radius.toFixed(1)}
                </text>

                {/* T Label */}
                <line x1={svgCoords.innerStart.x + 10} y1={svgCoords.innerStart.y} x2={svgCoords.innerStart.x + 10} y2={svgCoords.outerStart.y} stroke="#1d4ed8" strokeWidth="1" />
                <text
                  x={svgCoords.innerStart.x + 15}
                  y={svgCoords.innerStart.y + (svgCoords.T / 2) + 3}
                  fill="#1d4ed8"
                  className="text-[10px] font-black"
                >
                  T={thickness.toFixed(1)}
                </text>

                {/* Axis Labels */}
                <text x="20" y="325" fill="#64748b" className="text-[10px] font-black uppercase tracking-wider">
                  Blue: Sheet Boundaries
                </text>
                <text x="240" y="325" fill="#f43f5e" className="text-[10px] font-black uppercase tracking-wider">
                  Red: Neutral Axis (K={activeK.toFixed(2)})
                </text>
              </svg>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Calculated Results</h3>
              <button
                onClick={downloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> CSV Report
              </button>
            </div>

            {/* Large Flat Pattern Output */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Flat Pattern Blank Length (L)
              </div>
              <div className="text-4xl md:text-5xl font-black tracking-tight text-blue-400">
                {calcResults.flatLength.toFixed(3)} <span className="text-lg md:text-xl text-slate-300">mm</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Formula: {referenceMode === 'apex' 
                  ? 'F1 + F2 - BD (Legs - Bend Deduction)' 
                  : 'L1 + L2 + BA (Tangents + Bend Allowance)'}
              </p>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bend Allowance (BA)</div>
                <div className="text-base font-black text-white">{calcResults.ba.toFixed(3)} mm</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bend Deduction (BD)</div>
                <div className="text-base font-black text-white">{calcResults.bd.toFixed(3)} mm</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-slate-800/40 space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Outside Setback (OS)</div>
                <div className="text-base font-black text-white">{calcResults.os.toFixed(3)} mm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Step-by-Step Educational Explanation Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Bending Engineering Reference
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">1. Core Bending Equations</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Bend Allowance (BA)</strong> measures the length of the neutral axis within the bend area. It represents the material added:
                <code className="block bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-blue-600 font-mono mt-1 text-[11px]">
                  BA = (Angle_Rad) * (R + K * T)
                </code>
              </p>
              <p>
                <strong>Outside Setback (OS)</strong> is the distance from the tangent point of the bend to the apex of the mold corner:
                <code className="block bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-blue-600 font-mono mt-1 text-[11px]">
                  OS = tan(Angle / 2) * (R + T)
                </code>
              </p>
              <p>
                <strong>Bend Deduction (BD)</strong> is the difference between outside lengths and flat pattern length, subtracting excess material:
                <code className="block bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-blue-600 font-mono mt-1 text-[11px]">
                  BD = 2 * OS - BA
                </code>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">2. Real-Time Math Log</h4>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-mono">
              <div>
                <span className="text-slate-400">// Conversion to radians</span>
                <div>{angle}° = {(angle * Math.PI / 180).toFixed(4)} rad</div>
              </div>
              <div>
                <span className="text-slate-400">// Bend Allowance Calculation</span>
                <div>BA = {(angle * Math.PI / 180).toFixed(4)} * ({radius.toFixed(1)} + {activeK.toFixed(2)} * {thickness.toFixed(1)}) = <span className="text-blue-600 font-bold">{calcResults.ba.toFixed(3)} mm</span></div>
              </div>
              <div>
                <span className="text-slate-400">// Setback & Deduction</span>
                <div>OS = tan({(angle / 2)}°) * ({radius.toFixed(1)} + {thickness.toFixed(1)}) = <span className="text-slate-900 font-bold">{calcResults.os.toFixed(3)} mm</span></div>
                <div>BD = 2 * {calcResults.os.toFixed(3)} - {calcResults.ba.toFixed(3)} = <span className="text-rose-600 font-bold">{calcResults.bd.toFixed(3)} mm</span></div>
              </div>
              <div className="pt-2 border-t border-slate-200/50">
                <span className="text-slate-400">// Flat Pattern Output</span>
                <div>L = {flange1} + {flange2} - {calcResults.bd.toFixed(3)} = <span className="text-emerald-600 font-bold">{calcResults.flatLength.toFixed(3)} mm</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter banner */}
      <NewsletterSubscribe
        variant="banner"
        title="Get the CAD Bending & Press Brake handbook"
        description="Subscribe to receive our cheat sheet on sheet metal minimum bend radii charts, K-factor registers for major materials, and premium AutoLISP scripts."
        buttonText="Get Free PDF Handbook"
        placeholder="Enter your work email"
        className="mt-12"
      />
    </div>
  );
}
