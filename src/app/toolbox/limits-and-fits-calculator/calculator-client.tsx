'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Download, HelpCircle, Layers, FileText } from 'lucide-react';

interface PresetFit {
  hole: string;
  shaft: string;
  name: string;
  type: string;
  desc: string;
}

const PRESET_FITS: PresetFit[] = [
  { hole: 'H7', shaft: 'g6', name: 'H7/g6 - Sliding Fit (Clearance Fit - Rotating Precision Sliding Fit)', type: 'clearance', desc: 'Used for shafts that must turn freely, e.g. gearboxes, precision linkages, and sliding pulleys.' },
  { hole: 'H7', shaft: 'h6', name: 'H7/h6 - Locating Clearance Fit (Clearance Fit - Locating Clearance Fit)', type: 'clearance', desc: 'Close clearance fit for parts that do not rotate, but must slide easily for assembly (spindles, sleeves).' },
  { hole: 'H8', shaft: 'f7', name: 'H8/f7 - Easy Running Fit (Clearance Fit – Wide Clearance Running Fit)', type: 'clearance', desc: 'Recommended for bearings running at higher speeds with wide temperature variations (pumps, fans).' },
  { hole: 'H8', shaft: 'd9', name: 'H8/d9 - Loose Running Fit (Clearance fit - loose rotational fit)', type: 'clearance', desc: 'Loose running fits with wide tolerances, suitable for exposed parts or coarse agricultural machinery.' },
  { hole: 'H7', shaft: 'js6', name: 'H7/js6 - Close Transition Fit (Transition Fits - Positioning Transition Fits)', type: 'transition', desc: 'Symmetric transition fit providing accurate location. Assembly can be done by light tapping.' },
  { hole: 'H7', shaft: 'k6', name: 'H7/k6 - Locating Transition Fit (Transition fit - tight positioning fit)', type: 'transition', desc: 'Used where accurate alignment is vital, but slight interference is possible. Assembly requires a mallet.' },
  { hole: 'H7', shaft: 'n6', name: 'H7/n6 - Heavy Transition Fit (Transition Fit - Heavy Duty Positioning Fit)', type: 'transition', desc: 'Provides tight location. Assembly requires light press force or tight mallet taps.' },
  { hole: 'H7', shaft: 'p6', name: 'H7/p6 - Press Fit (Interference Fit – Light Press-In Interference Fit)', type: 'interference', desc: 'Interference fit used for standard press assemblies where keys are not required (gears, bushings).' },
  { hole: 'H7', shaft: 's6', name: 'H7/s6 - Medium Drive Fit (Interference Fit - Medium Type Insertion Interference Fit)', type: 'interference', desc: 'Tight press fit requiring hydraulic presses or heat shrinking. A permanent joint.' },
];

const SIZE_RANGES = [
  [0, 3],
  [3, 6],
  [6, 10],
  [10, 18],
  [18, 30],
  [30, 50],
  [50, 80],
  [80, 120],
  [120, 180],
  [180, 250],
  [250, 315],
  [315, 400],
  [400, 500],
];

// IT Values in microns (microns = mm/1000)
// Key format: "ITLevel": [values matching ranges in order]
const IT_LOOKUP: Record<string, number[]> = {
  '5': [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
  '6': [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
  '7': [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
  '8': [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
  '9': [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
  '10': [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
  '11': [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
};

// Shaft deviations in microns
const SHAFT_DEVIATIONS: Record<string, number[]> = {
  a: [-270, -270, -280, -290, -110, -120, -140, -160, -180, -200, -220, -240, -260],
  b: [-140, -140, -150, -160, -180, -200, -220, -240, -260, -280, -300, -320, -340],
  c: [-60, -70, -80, -95, -110, -130, -140, -160, -170, -190, -210, -230, -250],
  d: [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230],
  e: [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
  f: [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
  g: [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
  h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  js: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  k: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],
  m: [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
  n: [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
  p: [6, 12, 15, 18, 22, 26, 32, 37, 43, 51, 57, 63, 68],
  r: [10, 15, 19, 23, 28, 34, 41, 50, 60, 72, 81, 89, 97],
  s: [14, 19, 23, 28, 35, 43, 53, 65, 79, 97, 111, 124, 138],
  u: [18, 23, 28, 34, 44, 54, 70, 87, 108, 136, 156, 177, 198],
};

// Hole deviations in microns
const HOLE_DEVIATIONS: Record<string, number[]> = {
  A: [270, 270, 280, 290, 110, 120, 140, 160, 180, 200, 220, 240, 260],
  B: [140, 140, 150, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340],
  C: [60, 70, 80, 95, 110, 130, 140, 160, 170, 190, 210, 230, 250],
  D: [20, 30, 40, 50, 65, 80, 100, 120, 145, 170, 190, 210, 230],
  E: [14, 20, 25, 32, 40, 50, 60, 72, 85, 100, 110, 125, 135],
  F: [6, 10, 13, 16, 20, 25, 30, 36, 43, 50, 56, 62, 68],
  G: [2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20],
  H: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  JS: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  K: [0, -1, -1, -1, -2, -2, -2, -3, -3, -4, -4, -4, -5],
  M: [-2, -4, -6, -7, -8, -9, -11, -13, -15, -17, -20, -21, -23],
  N: [-4, -8, -10, -12, -15, -17, -20, -23, -27, -31, -34, -37, -40],
  P: [-6, -12, -15, -18, -22, -26, -32, -37, -43, -51, -57, -63, -68],
  R: [-10, -15, -19, -23, -28, -34, -41, -50, -60, -72, -81, -89, -97],
  S: [-14, -19, -23, -28, -35, -43, -53, -65, -79, -97, -111, -124, -138],
  U: [-18, -23, -28, -34, -44, -54, -70, -87, -108, -136, -156, -177, -198],
};

export default function LimitsAndFitsCalculatorClient() {
  const [size, setSize] = useState<number>(30);
  const [holeLetter, setHoleLetter] = useState<string>('H');
  const [holeGrade, setHoleGrade] = useState<string>('7');
  const [shaftLetter, setShaftLetter] = useState<string>('g');
  const [shaftGrade, setShaftGrade] = useState<string>('6');

  // Handle preset fits
  const handleApplyPreset = (p: PresetFit) => {
    // Separate letters and numbers
    const holeMatch = p.hole.match(/^([A-Z]+)(\d+)$/);
    const shaftMatch = p.shaft.match(/^([a-z]+)(\d+)$/);
    if (holeMatch && shaftMatch) {
      setHoleLetter(holeMatch[1]);
      setHoleGrade(holeMatch[2]);
      setShaftLetter(shaftMatch[1]);
      setShaftGrade(shaftMatch[2]);
    }
  };

  // Find range index
  const rangeIdx = useMemo(() => {
    const s = size;
    return SIZE_RANGES.findIndex(([min, max]) => s > min && s <= max);
  }, [size]);

  // Calculations
  const results = useMemo(() => {
    const idx = rangeIdx;
    if (idx === -1 || size <= 0 || size > 500) {
      return null;
    }

    // 1. Hole calculations
    const holeIT = IT_LOOKUP[holeGrade]?.[idx] || 0;
    const holeFD = HOLE_DEVIATIONS[holeLetter]?.[idx] || 0;
    
    let ES = 0; // Upper Deviation (Hole)
    let EI = 0; // Lower Deviation (Hole)

    if (holeLetter === 'JS') {
      EI = -holeIT / 2;
      ES = holeIT / 2;
    } else if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(holeLetter)) {
      EI = holeFD;
      ES = EI + holeIT;
    } else {
      // K, M, N, P, R, S, U
      ES = holeFD;
      EI = ES - holeIT;
    }

    const holeMin = size + EI / 1000;
    const holeMax = size + ES / 1000;

    // 2. Shaft calculations
    const shaftIT = IT_LOOKUP[shaftGrade]?.[idx] || 0;
    const shaftFD = SHAFT_DEVIATIONS[shaftLetter]?.[idx] || 0;

    let es = 0; // Upper Deviation (Shaft)
    let ei = 0; // Lower Deviation (Shaft)

    if (shaftLetter === 'js') {
      ei = -shaftIT / 2;
      es = shaftIT / 2;
    } else if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(shaftLetter)) {
      es = shaftFD;
      ei = es - shaftIT;
    } else {
      // k, m, n, p, r, s, u
      ei = shaftFD;
      es = ei + shaftIT;
    }

    const shaftMin = size + ei / 1000;
    const shaftMax = size + es / 1000;

    // 3. Fit calculation
    let fitType: 'clearance' | 'interference' | 'transition' = 'clearance';
    let maxClearance = 0;
    let minClearance = 0;
    let maxInterference = 0;
    let minInterference = 0;

    if (EI - es > 0) {
      // Clearance fit
      fitType = 'clearance';
      minClearance = EI - es;
      maxClearance = ES - ei;
    } else if (es - EI > 0 && ES - ei < 0) {
      // Interference fit
      fitType = 'interference';
      minInterference = ei - ES;
      maxInterference = es - EI;
    } else {
      // Transition fit (overlapping limits)
      fitType = 'transition';
      maxClearance = ES - ei;
      maxInterference = es - EI;
    }

    return {
      holeIT,
      holeEI: EI,
      holeES: ES,
      holeMin,
      holeMax,
      shaftIT,
      shaftEI: ei,
      shaftES: es,
      shaftMin,
      shaftMax,
      fitType,
      maxClearance,
      minClearance,
      maxInterference,
      minInterference,
    };
  }, [size, rangeIdx, holeLetter, holeGrade, shaftLetter, shaftGrade]);

  // Export CSV
  const downloadCsv = () => {
    if (!results) return;
    const csvContent = [
      ['ISO 286 Limits and Fits Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Nominal Sizing (mm)', size],
      ['Hole Selection', `${holeLetter}${holeGrade}`],
      ['Shaft Selection', `${shaftLetter}${shaftGrade}`],
      ['Fit Type', results.fitType.toUpperCase()],
      ['', ''],
      ['Hole Tolerance details', ''],
      ['Lower Deviation EI (um)', results.holeEI],
      ['Upper Deviation ES (um)', results.holeES],
      ['Hole Min Limit (mm)', results.holeMin.toFixed(4)],
      ['Hole Max Limit (mm)', results.holeMax.toFixed(4)],
      ['Hole Total Tolerance (um)', results.holeIT],
      ['', ''],
      ['Shaft Tolerance details', ''],
      ['Lower Deviation ei (um)', results.shaftEI],
      ['Upper Deviation es (um)', results.shaftES],
      ['Shaft Min Limit (mm)', results.shaftMin.toFixed(4)],
      ['Shaft Max Limit (mm)', results.shaftMax.toFixed(4)],
      ['Shaft Total Tolerance (um)', results.shaftIT],
      ['', ''],
      ['Calculated Fit Values', ''],
      ['Max Clearance (um)', results.fitType !== 'interference' ? results.maxClearance.toFixed(1) : 'N/A'],
      ['Min Clearance (um)', results.fitType === 'clearance' ? results.minClearance.toFixed(1) : 'N/A'],
      ['Max Interference (um)', results.fitType !== 'clearance' ? results.maxInterference.toFixed(1) : 'N/A'],
      ['Min Interference (um)', results.fitType === 'interference' ? results.minInterference.toFixed(1) : 'N/A'],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `iso286-fit-report-${size}mm-${holeLetter}${holeGrade}-${shaftLetter}${shaftGrade}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export SVG
  const downloadSvg = () => {
    const svgEl = document.getElementById('tolerance-svg');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tolerance-band-diagram-${size}mm-${holeLetter}${holeGrade}-${shaftLetter}${shaftGrade}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // SVG parameters scaling
  const svgMetrics = useMemo(() => {
    if (!results) return null;
    const chartHeight = 240;
    const midY = 150; // Zero Line Y-coordinate

    // Find the largest absolute value in deviations to set scale
    const maxVal = Math.max(
      Math.abs(results.holeES),
      Math.abs(results.holeEI),
      Math.abs(results.shaftES),
      Math.abs(results.shaftEI),
      20 // minimum scale bounds
    );

    const scale = (chartHeight / 2) / (maxVal * 1.15); // Scale so maximum fits within half height

    // Box dimensions
    const holeTop = midY - results.holeES * scale;
    const holeBottom = midY - results.holeEI * scale;
    const holeHeight = Math.max(1, holeBottom - holeTop);

    const shaftTop = midY - results.shaftES * scale;
    const shaftBottom = midY - results.shaftEI * scale;
    const shaftHeight = Math.max(1, shaftBottom - shaftTop);

    return {
      holeTop,
      holeBottom,
      holeHeight,
      shaftTop,
      shaftBottom,
      shaftHeight,
      midY,
      scale,
    };
  }, [results]);

  return (
    <div className="space-y-12">
      {/* Preset standard fit selection */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> ISO 286 Recommended Fits (Standard Presets)
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_FITS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all text-left"
            >
              <div className="font-extrabold text-slate-800">{p.hole}/{p.shaft}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.name.split(' - ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Fits Configuration</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Nominal sizes range up to 500mm. Standard tolerance letters and grades are selectable.
            </p>
          </div>

          <div className="space-y-6">
            {/* Nominal size input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">Nominal Size (D)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={size}
                    step={1}
                    min={1}
                    max={500}
                    onChange={(e) => setSize(Math.max(1, Math.min(500, parseFloat(e.target.value) || 30)))}
                    className="w-20 h-8 text-center rounded bg-slate-50 border border-slate-100 focus:outline-none font-bold"
                  />
                  <span>mm</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Min: 1mm</span>
                {rangeIdx !== -1 && (
                  <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    ISO Range: {SIZE_RANGES[rangeIdx][0]} - {SIZE_RANGES[rangeIdx][1]} mm
                  </span>
                )}
                <span>Max: 500mm</span>
              </div>
            </div>

            {/* Hole Selection Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Hole Tolerance Band</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">Deviation Letter</span>
                  <select
                    value={holeLetter}
                    onChange={(e) => setHoleLetter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                  >
                    {Object.keys(HOLE_DEVIATIONS).map((l) => (
                      <option key={l} value={l}>Hole {l}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">IT Grade</span>
                  <select
                    value={holeGrade}
                    onChange={(e) => setHoleGrade(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                  >
                    {Object.keys(IT_LOOKUP).map((g) => (
                      <option key={g} value={g}>IT{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shaft Selection Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Shaft Tolerance Band</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">Deviation Letter</span>
                  <select
                    value={shaftLetter}
                    onChange={(e) => setShaftLetter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                  >
                    {Object.keys(SHAFT_DEVIATIONS).map((l) => (
                      <option key={l} value={l}>Shaft {l}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">IT Grade</span>
                  <select
                    value={shaftGrade}
                    onChange={(e) => setShaftGrade(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                  >
                    {Object.keys(IT_LOOKUP).map((g) => (
                      <option key={g} value={g}>IT{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Graph & Calculations */}
        {results && svgMetrics && (
          <div className="lg:col-span-7 space-y-6">
            {/* Visualizer Chart */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> Tolerance Zone Diagram (μm)
                </h3>
                <button
                  onClick={downloadSvg}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> SVG
                </button>
              </div>

              {/* Dynamic SVG tolerance band chart */}
              <div className="w-full flex items-center justify-center bg-slate-900/2 rounded-2xl border border-slate-50 p-2 relative min-h-[300px]">
                <svg
                  id="tolerance-svg"
                  viewBox="0 0 450 300"
                  className="w-full max-w-[450px] h-auto drop-shadow-sm font-sans"
                >
                  {/* Zero Line (Nominal size base line) */}
                  <line
                    x1="20"
                    y1={svgMetrics.midY}
                    x2="430"
                    y2={svgMetrics.midY}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                  <text x="25" y={svgMetrics.midY - 6} fill="#64748b" className="text-[10px] font-black uppercase tracking-wider">
                    Nominal Zero Line (D = {size} mm)
                  </text>

                  {/* Hole Tolerance Band Box */}
                  <rect
                    x="110"
                    y={svgMetrics.holeTop}
                    width="70"
                    height={svgMetrics.holeHeight}
                    fill="#3b82f6"
                    fillOpacity="0.15"
                    stroke="#2563eb"
                    strokeWidth="2.2"
                    rx="4"
                  />
                  <text x="145" y={Math.min(270, Math.max(30, svgMetrics.holeTop + svgMetrics.holeHeight/2 + 4))} fill="#1d4ed8" textAnchor="middle" className="text-xs font-black">
                    Hole {holeLetter}{holeGrade}
                  </text>

                  {/* Shaft Tolerance Band Box */}
                  <rect
                    x="270"
                    y={svgMetrics.shaftTop}
                    width="70"
                    height={svgMetrics.shaftHeight}
                    fill="#f59e0b"
                    fillOpacity="0.15"
                    stroke="#d97706"
                    strokeWidth="2.2"
                    rx="4"
                  />
                  <text x="305" y={Math.min(270, Math.max(30, svgMetrics.shaftTop + svgMetrics.shaftHeight/2 + 4))} fill="#b45309" textAnchor="middle" className="text-xs font-black">
                    Shaft {shaftLetter}{shaftGrade}
                  </text>

                  {/* Deviation Dimension Lines: Hole */}
                  {/* Upper Limit Indicator */}
                  <line x1="90" y1={svgMetrics.holeTop} x2="110" y2={svgMetrics.holeTop} stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="80" y={svgMetrics.holeTop + 3.5} fill="#64748b" textAnchor="end" className="text-[10px] font-bold font-mono">
                    {results.holeES > 0 ? `+${results.holeES}` : results.holeES}
                  </text>

                  {/* Lower Limit Indicator */}
                  <line x1="90" y1={svgMetrics.holeBottom} x2="110" y2={svgMetrics.holeBottom} stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="80" y={svgMetrics.holeBottom + 3.5} fill="#64748b" textAnchor="end" className="text-[10px] font-bold font-mono">
                    {results.holeEI > 0 ? `+${results.holeEI}` : results.holeEI}
                  </text>

                  {/* Deviation Dimension Lines: Shaft */}
                  {/* Upper Limit Indicator */}
                  <line x1="340" y1={svgMetrics.shaftTop} x2="360" y2={svgMetrics.shaftTop} stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="370" y={svgMetrics.shaftTop + 3.5} fill="#64748b" textAnchor="start" className="text-[10px] font-bold font-mono">
                    {results.shaftES > 0 ? `+${results.shaftES}` : results.shaftES}
                  </text>

                  {/* Lower Limit Indicator */}
                  <line x1="340" y1={svgMetrics.shaftBottom} x2="360" y2={svgMetrics.shaftBottom} stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="370" y={svgMetrics.shaftBottom + 3.5} fill="#64748b" textAnchor="start" className="text-[10px] font-bold font-mono">
                    {results.shaftEI > 0 ? `+${results.shaftEI}` : results.shaftEI}
                  </text>
                </svg>
              </div>
            </div>

            {/* Calculations results details cards */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Tolerance Deviation Details</h3>
                <button
                  onClick={downloadCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> CSV Report
                </button>
              </div>

              {/* Fit Type Large Output Badge */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Calculated Fit Classification
                </div>
                {results.fitType === 'clearance' && (
                  <div className="text-3xl font-black tracking-tight text-emerald-400">
                    Clearance Fit (clearance fit)
                  </div>
                )}
                {results.fitType === 'transition' && (
                  <div className="text-3xl font-black tracking-tight text-amber-400">
                    Transition Fit (transition fit)
                  </div>
                )}
                {results.fitType === 'interference' && (
                  <div className="text-3xl font-black tracking-tight text-rose-400">
                    Interference Fit (interference fit)
                  </div>
                )}
                
                {/* Clearance details */}
                <div className="text-xs text-slate-300 font-semibold leading-relaxed pt-2 flex flex-wrap justify-center gap-x-6 gap-y-1">
                  {results.fitType !== 'interference' && (
                    <span>Max Clearance: <strong className="text-white">{results.maxClearance.toFixed(1)} μm</strong></span>
                  )}
                  {results.fitType === 'clearance' && (
                    <span>Min Clearance: <strong className="text-white">{results.minClearance.toFixed(1)} μm</strong></span>
                  )}
                  {results.fitType !== 'clearance' && (
                    <span>Max Interference: <strong className="text-white">{results.maxInterference.toFixed(1)} μm</strong></span>
                  )}
                  {results.fitType === 'interference' && (
                    <span>Min Interference: <strong className="text-white">{results.minInterference.toFixed(1)} μm</strong></span>
                  )}
                </div>
              </div>

              {/* Deviation Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Hole details card */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/40 space-y-4">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">Hole Limits ({holeLetter.toUpperCase()}{holeGrade})</h4>
                  <div className="space-y-2 text-xs font-semibold leading-relaxed">
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Upper Deviation (ES)</span>
                      <span>{results.holeES > 0 ? `+${results.holeES}` : results.holeES} μm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Lower Deviation (EI)</span>
                      <span>{results.holeEI > 0 ? `+${results.holeEI}` : results.holeEI} μm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Max Limit Size</span>
                      <span className="text-white font-bold font-mono">{results.holeMax.toFixed(4)} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Min Limit Size</span>
                      <span className="text-white font-bold font-mono">{results.holeMin.toFixed(4)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Tolerance (IT{holeGrade})</span>
                      <span>{results.holeIT} μm</span>
                    </div>
                  </div>
                </div>

                {/* Shaft details card */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/40 space-y-4">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">Shaft Limits ({shaftLetter.toLowerCase()}{shaftGrade})</h4>
                  <div className="space-y-2 text-xs font-semibold leading-relaxed">
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Upper Deviation (es)</span>
                      <span>{results.shaftES > 0 ? `+${results.shaftES}` : results.shaftES} μm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Lower Deviation (ei)</span>
                      <span>{results.shaftEI > 0 ? `+${results.shaftEI}` : results.shaftEI} μm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Max Limit Size</span>
                      <span className="text-white font-bold font-mono">{results.shaftMax.toFixed(4)} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                      <span className="text-slate-400">Min Limit Size</span>
                      <span className="text-white font-bold font-mono">{results.shaftMin.toFixed(4)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Tolerance (IT{shaftGrade})</span>
                      <span>{results.shaftIT} μm</span>
                    </div>
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
          <HelpCircle className="w-5 h-5 text-blue-600" /> Engineering Limits & Fits Guide
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">1. Understanding fit Types</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Clearance Fit</strong> (Clearance fit: The hole is always larger than the shaft. This allows rotational or axial sliding movement between the parts. Common examples include H7/g6, H8/f7.
              </p>
              <p>
                <strong>Transition Fit</strong> (Transition fit: The tolerance bands overlap. Depending on the actual manufactured size, the parts might have a clearance or an interference fit. Used for precise locating keys, pulleys, and centering pins. Common examples include H7/js6, H7/k6.
              </p>
              <p>
                <strong>Interference Fit</strong> (Interference fit: The shaft is always larger than the hole. The parts must be pressed together using hydraulic pressure or thermal expansion (heat shrinking). Provides a rigid joint without keyways. Common examples include H7/p6, H7/s6.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">2. Standard ISO 286 Nomenclature</h4>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-mono">
              <div>
                <span className="text-slate-400">{'// Fit Designation: e.g. H7/g6'}</span>
                <div>Capital Letter &quot;H&quot; represents Hole Tolerance.</div>
                <div>Lowercase Letter &quot;g&quot; represents Shaft Tolerance.</div>
                <div>Number &quot;7&quot; or &quot;6&quot; represents the International Tolerance (IT) Grade.</div>
              </div>
              <div className="pt-2 border-t border-slate-200/50">
                <span className="text-slate-400">{'// IT Grade scale'}</span>
                <div>Lower IT number = Tighter tolerance band (harder to machine, higher cost).</div>
                <div>IT5-IT7: Precision machining (grinding, boring).</div>
                <div>IT8-IT11: Standard general machining (turning, milling).</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter banner */}
      <RelatedTools />
    </div>
  );
}
