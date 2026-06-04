'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  HelpCircle, Info, Copy, Check, AlertTriangle, CheckCircle, Layers, Settings, Printer
} from 'lucide-react';

// Core math: Chordal sagitta deviation
// For a circle of radius R, if we approximate it with N-sided polygon,
// each polygon segment subtends an angle θ = 360° / N.
// The sagitta (chordal deviation) S = R - R * cos(θ/2) = R * (1 - cos(π/N))
// The chord length C = 2 * R * sin(θ/2) = 2 * R * sin(π/N)

const DEG_TO_RAD = Math.PI / 180;

// Common 3D printer presets
const PRINTER_PRESETS = [
  { name: 'FDM (Standard)', layerHeight: 0.2, tolerance: 0.3 },
  { name: 'FDM (Fine)', layerHeight: 0.1, tolerance: 0.15 },
  { name: 'SLA (Resin)', layerHeight: 0.05, tolerance: 0.05 },
  { name: 'SLS (Powder)', layerHeight: 0.1, tolerance: 0.1 },
  { name: 'MJF (Multi Jet)', layerHeight: 0.08, tolerance: 0.08 },
  { name: 'Custom', layerHeight: 0.2, tolerance: 0.2 },
];

export default function ChordalDeviationClient() {
  const [radius, setRadius] = useState(5.0); // mm
  const [angularStep, setAngularStep] = useState(10); // degrees
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [printerTolerance, setPrinterTolerance] = useState(0.3); // mm
  const [copied, setCopied] = useState(false);

  // Derived calculations
  const calculations = useMemo(() => {
    const R = Math.max(0.1, radius);
    const theta = Math.max(1, Math.min(90, angularStep));
    const thetaRad = theta * DEG_TO_RAD;

    // Number of polygon segments
    const N = Math.ceil(360 / theta);

    // Sagitta (chordal deviation)
    const sagitta = R * (1 - Math.cos(thetaRad / 2));

    // Chord length (flat segment approximating arc)
    const chordLength = 2 * R * Math.sin(thetaRad / 2);

    // Arc length of the original curve segment
    const arcLength = R * thetaRad;

    // Percentage error (chord vs arc)
    const arcError = ((arcLength - chordLength) / arcLength) * 100;

    // Minimum segments needed to achieve printer tolerance
    // S = R * (1 - cos(π/N_min)) ≤ tolerance
    // cos(π/N_min) ≥ 1 - tolerance/R
    // π/N_min ≤ acos(1 - tolerance/R)
    // N_min ≥ π / acos(1 - tolerance/R)
    const tol = printerTolerance;
    let minSegments = N;
    if (tol > 0 && tol < R) {
      minSegments = Math.ceil(Math.PI / Math.acos(1 - tol / R));
    }

    // Optimal angular step for printer tolerance
    const optimalAngle = minSegments > 0 ? 360 / minSegments : theta;

    // Optimal sagitta at recommended settings
    const optimalSagitta = R * (1 - Math.cos((optimalAngle * DEG_TO_RAD) / 2));

    // Quality verdict
    let verdict: 'excellent' | 'good' | 'warning' | 'fail';
    if (sagitta <= tol * 0.3) verdict = 'excellent';
    else if (sagitta <= tol) verdict = 'good';
    else if (sagitta <= tol * 2) verdict = 'warning';
    else verdict = 'fail';

    return {
      R, theta, N, sagitta, chordLength, arcLength, arcError,
      minSegments, optimalAngle, optimalSagitta, verdict,
    };
  }, [radius, angularStep, printerTolerance]);

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    setPrinterTolerance(PRINTER_PRESETS[index].tolerance);
  };

  const handleCopySummary = () => {
    const summary = [
      `Chordal Deviation Report — CADGuide.tools`,
      `Hole Radius: ${calculations.R} mm`,
      `Angular Step: ${calculations.theta}°`,
      `Polygon Segments: ${calculations.N}`,
      `Sagitta (Deviation): ${calculations.sagitta.toFixed(4)} mm`,
      `Chord Length: ${calculations.chordLength.toFixed(4)} mm`,
      `Arc Length: ${calculations.arcLength.toFixed(4)} mm`,
      `Arc-to-Chord Error: ${calculations.arcError.toFixed(3)}%`,
      `Printer Tolerance: ${printerTolerance} mm`,
      `Minimum Recommended Segments: ${calculations.minSegments}`,
      `Optimal Angular Step: ${calculations.optimalAngle.toFixed(2)}°`,
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // SVG Visualization constants
  const svgSize = 320;
  const svgCenter = svgSize / 2;
  const svgRadius = 120; // visual radius in SVG units

  // Generate polygon points for SVG overlay
  const polygonPoints = useMemo(() => {
    const pts: string[] = [];
    const N = calculations.N;
    for (let i = 0; i <= N; i++) {
      const angle = (i * 2 * Math.PI) / N - Math.PI / 2;
      const x = svgCenter + svgRadius * Math.cos(angle);
      const y = svgCenter + svgRadius * Math.sin(angle);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return pts.join(' ');
  }, [calculations.N]);

  // Sagitta indicator line (show deviation at top of circle)
  const sagittaVisualScale = Math.min(1, calculations.sagitta / calculations.R);
  const sagittaPixels = svgRadius * sagittaVisualScale;

  // Verdict styling
  const verdictConfig = {
    excellent: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, label: 'Excellent — Imperceptible faceting' },
    good: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Good — Within printer tolerance' },
    warning: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, label: 'Warning — Visible faceted stepping likely' },
    fail: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, label: 'Fail — Severe polygon artifacts expected' },
  };
  const vc = verdictConfig[calculations.verdict];
  const VerdictIcon = vc.icon;

  return (
    <div className="space-y-12">
      {/* Upper Panel: Input Controls + SVG Visualization */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">

        {/* Left Side: SVG Arc vs Polygon visualization */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Arc vs. Polygon Mesh Overlay
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Interactive chordal sagitta geometry visualization
            </p>
          </div>

          {/* SVG Visualization */}
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-4 min-h-[340px]">
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-[340px] h-auto" aria-label="Chordal Deviation Diagram">
              {/* Background grid */}
              <defs>
                <pattern id="gridChord" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width={svgSize} height={svgSize} fill="url(#gridChord)" rx="12" />

              {/* Original circle (ideal geometry) */}
              <circle
                cx={svgCenter}
                cy={svgCenter}
                r={svgRadius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="6 3"
                opacity="0.7"
              />

              {/* Polygon approximation overlay */}
              <polygon
                points={polygonPoints}
                fill="rgba(239, 68, 68, 0.06)"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Center point */}
              <circle cx={svgCenter} cy={svgCenter} r="3" fill="#1e293b" />

              {/* Radius line */}
              <line
                x1={svgCenter}
                y1={svgCenter}
                x2={svgCenter}
                y2={svgCenter - svgRadius}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />

              {/* Sagitta indicator arrow (gap between arc and chord at top) */}
              {sagittaPixels > 1 && (
                <>
                  {/* Chord midpoint to arc */}
                  <line
                    x1={svgCenter}
                    y1={svgCenter - svgRadius + sagittaPixels}
                    x2={svgCenter}
                    y2={svgCenter - svgRadius}
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                  {/* Sagitta label */}
                  <text
                    x={svgCenter + 12}
                    y={svgCenter - svgRadius + sagittaPixels / 2 + 4}
                    fill="#f59e0b"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    S = {calculations.sagitta.toFixed(4)} mm
                  </text>
                </>
              )}

              {/* Radius label */}
              <text
                x={svgCenter - 40}
                y={svgCenter - svgRadius / 2}
                fill="#64748b"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                R = {calculations.R} mm
              </text>

              {/* Segment count label */}
              <text
                x={svgCenter - 30}
                y={svgCenter + svgRadius + 24}
                fill="#64748b"
                fontSize="10"
                fontWeight="bold"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {calculations.N} polygon segments
              </text>

              {/* Angular step indicator arc */}
              <text
                x={svgCenter + svgRadius * 0.4}
                y={svgCenter + 14}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {"θ"} = {calculations.theta}°
              </text>

              {/* Legend */}
              <g transform={`translate(12, ${svgSize - 40})`}>
                <line x1="0" y1="0" x2="18" y2="0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" />
                <text x="24" y="4" fill="#64748b" fontSize="8" fontWeight="600">Ideal Circle</text>
                <line x1="0" y1="14" x2="18" y2="14" stroke="#ef4444" strokeWidth="2" />
                <text x="24" y="18" fill="#64748b" fontSize="8" fontWeight="600">STL Polygon Mesh</text>
              </g>
            </svg>
          </div>

          {/* Quality Verdict Card */}
          <div className={`${vc.bg} ${vc.border} border rounded-2xl p-5 flex items-center gap-4`}>
            <VerdictIcon className={`w-6 h-6 ${vc.color} shrink-0`} />
            <div>
              <div className={`font-black text-sm ${vc.color}`}>{vc.label}</div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                {calculations.verdict === 'excellent' && 'Your chordal deviation is well below the printer resolution threshold. Exported mesh geometry will be visually indistinguishable from original BREP curves.'}
                {calculations.verdict === 'good' && 'The deviation is within your printer\'s achievable tolerance. Circular holes should print without noticeable polygon stepping.'}
                {calculations.verdict === 'warning' && `Consider reducing angular step to ${calculations.optimalAngle.toFixed(1)}° (${calculations.minSegments} segments) to bring the deviation below your printer tolerance of ${printerTolerance} mm.`}
                {calculations.verdict === 'fail' && `The deviation of ${calculations.sagitta.toFixed(4)} mm far exceeds the ${printerTolerance} mm printer tolerance. Reduce your export angular step significantly to avoid visible polygon stepping artifacts.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Input Controls Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" /> Export Parameters
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Configure STEP/IGES to STL export settings
              </p>
            </div>

            {/* Hole/Cylinder Radius Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>1. Feature Radius (mm)</span>
                <span className="text-blue-400 font-mono text-sm">{radius} mm</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  max="1000"
                  step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value) || 0.1)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 text-white"
                />
                <div className="flex gap-1">
                  {[2, 5, 10, 25, 50].map((v) => (
                    <button
                      key={v}
                      onClick={() => setRadius(v)}
                      className={`px-2.5 py-2 rounded-lg text-[9px] font-black border transition-all ${
                        radius === v
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Angular Step Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>2. Angular Step (°)</span>
                <span className="text-blue-400 font-mono text-sm">{angularStep}°</span>
              </label>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={angularStep}
                onChange={(e) => setAngularStep(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                <span>1° (360 sides, ultra-fine)</span>
                <span>10° (36 sides, default)</span>
                <span>45° (8 sides, coarse)</span>
              </div>
            </div>

            {/* Printer Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide">
                3. 3D Printer Technology
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRINTER_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePresetChange(i)}
                    className={`py-2.5 px-2 rounded-xl text-[10px] font-black border transition-all ${
                      selectedPreset === i
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom tolerance if Custom preset */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                <span>4. Printer Tolerance Limit</span>
                <span className="text-blue-400 font-mono text-sm">{printerTolerance} mm</span>
              </label>
              <input
                type="range"
                min="0.01"
                max="1.0"
                step="0.01"
                value={printerTolerance}
                onChange={(e) => { setPrinterTolerance(parseFloat(e.target.value)); setSelectedPreset(5); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Calculated Results Summary Card */}
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
              Computed Mesh Metrics
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Segments (N)</div>
                <div className="text-white font-black text-lg font-mono">{calculations.N}</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Sagitta (S)</div>
                <div className="text-amber-400 font-black text-lg font-mono">{calculations.sagitta.toFixed(4)}<span className="text-[10px] text-slate-400 ml-1">mm</span></div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Chord Length</div>
                <div className="text-white font-black text-sm font-mono">{calculations.chordLength.toFixed(4)}<span className="text-[10px] text-slate-400 ml-1">mm</span></div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 font-bold text-[9px] uppercase">Arc Error</div>
                <div className="text-white font-black text-sm font-mono">{calculations.arcError.toFixed(3)}<span className="text-[10px] text-slate-400 ml-1">%</span></div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-950/30 rounded-xl p-3.5 border border-blue-900/30 mt-2">
              <div className="text-blue-400 font-black text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Recommended Export Settings
              </div>
              <div className="text-blue-200 text-[11px] font-semibold leading-relaxed">
                For your {PRINTER_PRESETS[selectedPreset]?.name} printer, use at least <strong className="text-white">{calculations.minSegments} segments</strong> (angular step ≤ <strong className="text-white">{calculations.optimalAngle.toFixed(1)}°</strong>) for a {radius} mm radius feature.
              </div>
            </div>
          </div>

          {/* Copy Summary button */}
          <button
            onClick={handleCopySummary}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-green-600" /> Report Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Deviation Report</>
            )}
          </button>
        </div>
      </div>

      {/* Reference Guide Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Understanding Chordal Deviation in CAD-to-Print Workflows
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">1. What is chordal deviation?</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Definition</strong>: Chordal deviation (also called sagitta or chord height) is the maximum perpendicular distance between a chord segment and the arc it approximates. When CAD software exports BREP (boundary representation) geometry to STL mesh format, every curve is approximated by a series of straight line segments.
              </p>
              <p>
                <strong>The Sagitta Formula</strong>: For a circle of radius R divided into N polygon segments, each segment subtends an angle {"θ = 360° / N"}. The sagitta is computed as:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-center text-sm text-slate-800 font-black">
                {"S = R × (1 − cos(θ/2))"}
              </div>
              <p>
                If S exceeds your printer{"'"}s achievable resolution, the printed circular hole will exhibit visible flat edges (faceted stepping) rather than a smooth curve.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">2. CAD software STL export settings guide</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                Most CAD platforms expose the chordal deviation parameter under different UI labels during STL export:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-xl text-[10px] font-mono leading-relaxed">
                <li><strong className="text-slate-800">SolidWorks</strong>: File → Save As → STL → Options → Deviation (Fine/Custom tolerance).</li>
                <li><strong className="text-slate-800">Fusion 360</strong>: Export → Mesh → Refinement (Low/Medium/High/Custom).</li>
                <li><strong className="text-slate-800">Inventor</strong>: File → Save Copy As → STL → Surface Deviation.</li>
                <li><strong className="text-slate-800">FreeCAD</strong>: Part → Export → STL → Surface deviation (mm).</li>
                <li><strong className="text-slate-800">Rhino 3D</strong>: File → Save As → STL → Detailed Controls → Max angle.</li>
                <li><strong className="text-slate-800">CATIA</strong>: STL Rapid Prototyping → Tessellation Sag.</li>
              </ul>
              <p>
                <strong>Rule of Thumb</strong>: Set the chordal deviation to a value that is at most <em>half</em> of your printer{"'"}s stated XY resolution for best results. A value of <strong className="text-slate-800">0.01 mm</strong> is typical for SLA/resin printers, and <strong className="text-slate-800">0.05 - 0.1 mm</strong> for FDM machines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4.5 flex gap-3 text-xs text-blue-700 leading-relaxed font-semibold">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase text-blue-800">Watertight Mesh Tip:</span> After exporting STL, always run a mesh integrity check. Non-manifold edges, flipped normals, or gaps between polygon faces will cause slicing failures. Most slicers (Cura, PrusaSlicer) include built-in repair tools, or use open-source Meshmixer for advanced healing.
        </div>
      </div>

      <NewsletterSubscribe
        variant="banner"
        title="Get the 3D Printing Engineering Checklist"
        description="Subscribe to receive our STEP-to-STL export quality assurance guide, tolerance lookup tables, and monthly CAD prototyping design tips."
        buttonText="Get 3D Print QA Checklist"
        placeholder="Enter your professional email"
        className="mt-12"
      />
    </div>
  );
}
