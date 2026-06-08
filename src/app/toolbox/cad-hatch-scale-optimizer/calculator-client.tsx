'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Info, Check, AlertTriangle, Layers } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

const DRAWING_UNITS = [
  { name: 'Metric: Millimeters (Metric: mm)', key: 'mm', factor: 1.0 },
  { name: 'Metric: Meters (Metric: Meter)', key: 'm', factor: 1000.0 },
  { name: 'Imperial: Inches (Imperial: inches)', key: 'inch', factor: 25.4 },
];

const HATCH_PATTERNS = [
  { name: 'ANSI31 (Oblique parallel lines / Iron-Steel)', key: 'ansi31', baseSpacing: 6, desc: 'Standard Metal, Section line' },
  { name: 'NET (Grid Line / Grid-Tile)', key: 'net', baseSpacing: 10, desc: 'Tile, anti-slip mesh' },
  { name: 'AR-CONC (Concrete / Concrete)', key: 'arconc', baseSpacing: 16, desc: 'Coarse aggregate, cement mortar' },
  { name: 'GRAVEL (Pebbles)', key: 'gravel', baseSpacing: 20, desc: 'Pebbles, loose water' },
];

export default function HatchScaleClient() {
  const [unitIdx, setUnitIdx] = useState(0);
  const [viewportScale, setViewportScale] = useState(100); // e.g. 100 for 1:100 scale
  const [patternIdx, setPatternIdx] = useState(0);
  const [hatchScale, setHatchScale] = useState(1.0); // User adjusted scale factor in CAD
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentUnit = useMemo(() => DRAWING_UNITS[unitIdx], [unitIdx]);
  const currentPattern = useMemo(() => HATCH_PATTERNS[patternIdx], [patternIdx]);

  // Compute recommendation
  const recommendation = useMemo(() => {
    // Basic engineering optimal scale formula
    // For ANSI31 at 1:100 in mm unit, recommended CAD scale is ~100
    // If unit is meter, recommended CAD scale is 100 / 1000 = 0.1
    const optimalScale = (viewportScale / currentUnit.factor) * (currentPattern.baseSpacing / 6);
    
    // Safety boundaries
    const minSafeScale = optimalScale * 0.1;
    const maxSafeScale = optimalScale * 10;

    return {
      optimal: optimalScale,
      minSafe: minSafeScale,
      maxSafe: maxSafeScale,
    };
  }, [viewportScale, currentUnit, currentPattern]);

  // Calculate density index and safety status of user-selected hatchScale
  const status = useMemo(() => {
    const ratio = hatchScale / recommendation.optimal;
    
    if (ratio < 0.08) {
      return {
        level: 'danger',
        label: 'MAXHATCH Too Dense',
        color: 'text-red-500 border-red-500/20 bg-red-500/10',
        desc: 'The density of line segments is extremely high! Easy to trigger AutoCAD MAXHATCH limits (default 100,000 lines), this will cause the drawing to be saved and stuck., Viewport crashes or casts to Solid fill. '
      };
    } else if (ratio < 0.35) {
      return {
        level: 'warning',
        label: 'Relatively Dense',
        color: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        desc: 'Dense padding can cause severe artifacts when printing or viewport zooming CPU Rendering is lagging and file size will expand.. It is recommended to increase the proportion appropriately. '
      };
    } else if (ratio > 8.0) {
      return {
        level: 'empty',
        label: 'The pattern is too sparse or blank (Too Sparse)',
        color: 'text-sky-500 border-sky-500/20 bg-sky-500/10',
        desc: 'The proportion of the fill pattern is too large and the spacing between fill lines is too wide., May appear blank in the viewport (no fill lines visible)) , Giving the impression that the padding is missing. '
      };
    } else {
      return {
        level: 'safe',
        label: 'Perfect Match (Optimal Density)',
        color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        desc: 'The current proportion conforms to the printing proportion of the drawing, and the line width and rendering performance of the drawing are optimal.. '
      };
    }
  }, [hatchScale, recommendation]);

  // Draw pattern inside HTML5 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900 background
    ctx.fillRect(0, 0, W, H);

    // Grid lines for grid space visualization
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Dynamic scale scaling for display purposes
    // We map hatchScale such that a hatchScale of 'recommendation.optimal' gives a visual spacing of 'currentPattern.baseSpacing'
    const visualScale = hatchScale / recommendation.optimal;
    const spacing = currentPattern.baseSpacing * visualScale;

    // Prevent infinite loop if spacing is extremely tiny (Crash protection in JS)
    if (spacing < 1.8) {
      // Draw warning state on Canvas
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, 0, W, H);
      
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MAXHATCH EXCEEDED', W / 2, H / 2 - 10);
      ctx.fillText('(CAD CRASH PREVENTED)', W / 2, H / 2 + 10);
      return;
    }

    if (spacing > 190) {
      // Draw sparse state on Canvas
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('[ HATCH TOO SPARSE / EMPTY ]', W / 2, H / 2);
      return;
    }

    // Draw the hatch pattern
    ctx.strokeStyle = '#60a5fa'; // light blue pattern line
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    const patKey = currentPattern.key;

    if (patKey === 'ansi31') {
      // Slanted lines at 45deg
      for (let offset = -H; offset < W + H; offset += spacing) {
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - H, H);
        ctx.stroke();
      }
    } else if (patKey === 'net') {
      // Grid lines
      for (let x = 0; x < W + spacing; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H + spacing; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    } else if (patKey === 'arconc') {
      // Concrete sand grains & triangles
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      
      const step = Math.max(12, spacing);
      for (let x = 5; x < W; x += step) {
        for (let y = 5; y < H; y += step) {
          const randX = x + (Math.sin(x + y) * step * 0.4);
          const randY = y + (Math.cos(x - y) * step * 0.4);

          // Draw small triangle for aggregate
          if ((Math.round(randX + randY) % 3) === 0) {
            ctx.beginPath();
            ctx.moveTo(randX, randY);
            ctx.lineTo(randX + 4, randY + 6);
            ctx.lineTo(randX - 3, randY + 5);
            ctx.closePath();
            ctx.stroke();
          } else {
            // Sand particle dots
            ctx.fillRect(randX, randY, 1.5, 1.5);
            ctx.fillRect(randX + 3, randY - 2, 1, 1);
          }
        }
      }
    } else if (patKey === 'gravel') {
      // Small circles for gravel
      ctx.strokeStyle = '#38bdf8';
      const r = Math.max(2, spacing * 0.25);
      const step = Math.max(12, spacing);

      for (let x = step / 2; x < W; x += step) {
        for (let y = step / 2; y < H; y += step) {
          const rx = x + (Math.sin(x * y) * step * 0.3);
          const ry = y + (Math.cos(x + y) * step * 0.3);
          
          ctx.beginPath();
          ctx.arc(rx, ry, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }, [hatchScale, recommendation, currentPattern, currentUnit]);

  const copyToClipboard = () => {
    const text = `--- CAD Optimal Hatch Factor ---
Pattern: ${currentPattern.name}
Drawing Unit: ${currentUnit.name}
Target Output Plot Scale: 1:${viewportScale}
Recommended HATCH Scale in CAD: ${recommendation.optimal.toFixed(4)}
Safety limits: ${recommendation.minSafe.toFixed(4)} to ${recommendation.maxSafe.toFixed(4)}
Your Configured HATCH Scale: ${hatchScale} (${status.label})
Generated via CADGuide.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Parameters */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Input parameters (Parameters)</span>
          </h2>
        </div>

        {/* Units */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. Current drawing unit of the drawing (Drawing Unit)
          </label>
          <select
            value={unitIdx}
            onChange={(e) => {
              setUnitIdx(Number(e.target.value));
              // Adjust user hatch scale proportionally to keep visual relative
              const nextUnit = DRAWING_UNITS[Number(e.target.value)];
              const ratio = currentUnit.factor / nextUnit.factor;
              setHatchScale(prev => Number((prev * ratio).toFixed(4)));
            }}
            className="w-full bg-slate-850 border border-slate-850 rounded-xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none print:hidden"
          >
            {DRAWING_UNITS.map((u, i) => (
              <option key={u.key} value={i}>
                {u.name}
              </option>
))}
          </select>
          <div className="hidden print:block font-bold">
            Drawing unit: {currentUnit.name}
          </div>
        </div>

        {/* Viewport Scale */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">2. Target print scale denominator (Scale 1:X)</span>
            <span className="text-blue-400 font-mono">1 : {viewportScale}</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            step="5"
            value={viewportScale}
            onChange={(e) => setViewportScale(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            value={viewportScale}
            onChange={(e) => setViewportScale(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>

        {/* Pattern Select */}
        <div className="space-y-2 border-t border-slate-800/80 pt-5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            3. CAD Pattern
          </label>
          <div className="grid grid-cols-2 gap-2.5 print:hidden">
            {HATCH_PATTERNS.map((p, i) => (
              <button
                key={p.key}
                onClick={() => setPatternIdx(i)}
                className={`py-3 px-2 rounded-xl text-xs font-black border transition-all duration-205 ${
                  patternIdx === i
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                {p.name}
              </button>
))}
          </div>
          <div className="hidden print:block font-bold">
            Fill pattern: {currentPattern.name}
          </div>
        </div>

        {/* Live Adjusting User Hatch Scale */}
        <div className="space-y-3 border-t border-slate-800/80 pt-5">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider">4. Debugging HATCH scale factors (Scale Input)</span>
            <span className="text-blue-400 font-mono">{hatchScale}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHatchScale(Number(recommendation.optimal.toFixed(3)))}
              className="px-2.5 py-1 rounded bg-slate-850 hover:bg-blue-650 border border-slate-800 text-[10px] font-black text-slate-300 print:hidden"
            >
              Apply recommendations
            </button>
          </div>
          <input
            type="range"
            min={recommendation.optimal * 0.02}
            max={recommendation.optimal * 5.0}
            step={recommendation.optimal * 0.02}
            value={hatchScale}
            onChange={(e) => setHatchScale(Number(Number(e.target.value).toFixed(4)))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-500 print:hidden"
          />
          <input
            type="number"
            step="0.0001"
            value={hatchScale}
            onChange={(e) => setHatchScale(Math.max(0.0001, Number(e.target.value)))}
            className="w-full bg-slate-850 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 print:hidden"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
        {/* Results */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-md font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              <span>Optimum Hatch Scale Verdict</span>
            </h3>
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all text-xs font-black flex items-center gap-1.5 border border-slate-200/50 print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? 'Copied' : 'Copy data'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-150/40">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Optimal HATCH Scale
              </div>
              <div className="text-3xl font-black font-mono text-blue-600 mt-1">
                {recommendation.optimal.toFixed(3)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                In the CAD Fill dialog box &quot;Scale&quot; Enter this value in
              </p>
            </div>
            
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Safety Scale Range
              </div>
              <div className="font-mono text-xs text-slate-700 font-semibold mt-1">
                {recommendation.minSafe.toFixed(3)} to {recommendation.maxSafe.toFixed(3)}
              </div>
              <div className="text-[9px] text-slate-400">
                If it is lower than the minimum safe ratio, it will easily cause the drawing to freeze and collapse.! 
              </div>
            </div>
          </div>

          {/* Scale Status evaluation */}
          <div className={`border p-4.5 rounded-2xl flex gap-3.5 items-start ${status.color}`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-sm font-black block">{status.label}</strong>
              <p className="text-xs leading-relaxed opacity-90">{status.desc}</p>
            </div>
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between print:bg-white print:border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Live Hatch Canvas Viewport
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              Viewport Size: 100mm x 100mm
            </span>
          </div>

          <div className="flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2.5">
            <canvas
              ref={canvasRef}
              width={260}
              height={200}
              className="rounded-xl shadow-lg border border-slate-800 max-w-full"
            />
          </div>

          <div className="text-[9.5px] text-slate-400 leading-relaxed mt-4 flex items-start gap-2 print:text-slate-600">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Crash principle tips: </strong>In AutoCAD in if Hatch If the ratio is too small, the software will automatically trigger `HPMAXLINES` (Default 100000) Alerts. To prevent crashes, CAD will force the fill to render as solid (solid color), or cause a computational deadlock lasting several minutes. Be sure to use the safety bounds provided by the optimizer! 
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <RelatedTools />
      </div>
    </div>
);
}
