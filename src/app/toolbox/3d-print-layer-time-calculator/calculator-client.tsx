'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, Clock, Layers } from 'lucide-react';

interface PrintPreset {
  name: string;
  layerHeight: string;
  speed: string;
  desc: string;
}

const PRESETS: PrintPreset[] = [
  { name: 'Ultra Fine (0.12mm)', layerHeight: '0.12', speed: '40', desc: 'Miniatures & high visual surface detail' },
  { name: 'Standard (0.20mm)', layerHeight: '0.20', speed: '50', desc: 'General engineering prototypes & brackets' },
  { name: 'Draft Fast (0.28mm)', layerHeight: '0.28', speed: '70', desc: 'Rapid dimensional concept fit checks' },
];

export default function PrintLayerTimeCalculatorClient() {
  const [layerHeight, setLayerHeight] = useState('0.20');
  const [speed, setSpeed] = useState('50');
  const [perimeter, setPerimeter] = useState('500');
  const [wallCount, setWallCount] = useState('2');
  const [infillArea, setInfillArea] = useState('10000');
  const [infillDensity, setInfillDensity] = useState('20');
  const [solidLayers, setSolidLayers] = useState('4');
  const [totalLayers, setTotalLayers] = useState('200');
  const [overheadPercent, setOverheadPercent] = useState('25');

  const [activePreset, setActivePreset] = useState<number | null>(1); // Standard default

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setLayerHeight(p.layerHeight);
    setSpeed(p.speed);
    setActivePreset(idx);
  };

  const result = useMemo(() => {
    const h = Math.max(0.01, parseFloat(layerHeight) || 0.2); // mm
    const v = Math.max(1, parseFloat(speed) || 50); // mm/s
    const perim = Math.max(0, parseFloat(perimeter) || 0); // mm
    const walls = Math.max(1, parseInt(wallCount) || 1); // count of perimeter shells
    const area = Math.max(0, parseFloat(infillArea) || 0); // mm²
    const dens = Math.max(0, Math.min(100, parseFloat(infillDensity) || 0)) / 100; // ratio
    const layers = Math.max(1, parseInt(totalLayers) || 1); // count
    const solidL = Math.max(0, Math.min(layers, parseInt(solidLayers) || 0)); // top & bottom solid layers
    const sparseL = Math.max(0, layers - solidL);
    const parsedOverhead = parseFloat(overheadPercent);
    const overhead = Math.max(0, Math.min(100, isNaN(parsedOverhead) ? 25 : parsedOverhead)) / 100;
    const nozzle = 0.4; // standard 0.4mm nozzle

    // Single-layer toolpath duration:
    // Outer/inner wall perimeters: perimeter * wallCount / v (s)
    const tPerim = v > 0 ? (perim * walls) / v : 0;

    // Sparse infill duration: area * density / (v * nozzle)
    const tInfillSparse = v > 0 ? (area * dens) / (v * nozzle) : 0;

    // Solid layer fill duration (100% density): area * 1.0 / (v * nozzle)
    const tInfillSolid = v > 0 ? (area * 1.0) / (v * nozzle) : 0;

    const tLayerSparse = tPerim + tInfillSparse;
    const tLayerSolid = tPerim + tInfillSolid;

    // Weighted average cycle per layer
    const totalCycleRawSec = (tLayerSolid * solidL) + (tLayerSparse * sparseL);
    const tL = layers > 0 ? totalCycleRawSec / layers : 0;

    // Total time with user-specified acceleration & retraction travel overhead
    const overheadFactor = 1.0 + overhead;
    const totalTimeSec = totalCycleRawSec * overheadFactor;
    const tTMin = totalTimeSec / 60;
    const roundedMin = Math.round(tTMin);
    const hours = Math.floor(roundedMin / 60);
    const mins = roundedMin % 60;

    // Extruded polymer volume in mm³:
    // Walls volume across all layers
    const vWalls = perim * walls * nozzle * h * layers;
    // Solid top/bottom fill volume
    const vSolidFill = area * 1.0 * h * solidL;
    // Sparse infill volume
    const vSparseFill = area * dens * h * sparseL;
    const totalExtrusionMm3 = vWalls + vSolidFill + vSparseFill;

    // Converted to length of standard 1.75mm filament (cross-section = π * (1.75/2)² ≈ 2.405 mm²)
    const filamentLengthMeters = (totalExtrusionMm3 / 2.405) / 1000;

    // Approximate PLA weight (density = 1.24 g/cm³)
    const volumeCm3 = totalExtrusionMm3 / 1000;
    const filamentWeightGrams = volumeCm3 * 1.24;

    return {
      tL,
      tTMin,
      hours,
      mins,
      filamentLengthMeters,
      filamentWeightGrams,
      totalExtrusionMm3,
      volumeCm3,
      solidL,
      sparseL,
    };
  }, [layerHeight, speed, perimeter, wallCount, infillArea, infillDensity, solidLayers, totalLayers, overheadPercent]);

  const downloadCsv = () => {
    const rows = [
      ['3D Print Layer Time & Filament Sizing Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Slicing & Toolpath Parameters', ''],
      ['Layer Height (mm)', layerHeight],
      ['Print Speed (mm/s)', speed],
      ['Layer Perimeter (mm)', perimeter],
      ['Perimeter Wall Count', wallCount],
      ['Infill Area (mm²)', infillArea],
      ['Infill Density (%)', infillDensity],
      ['Solid Top/Bottom Layers', solidLayers],
      ['Total Layers', totalLayers],
      ['Travel & Acceleration Overhead (%)', overheadPercent],
      ['', ''],
      ['Slicing Estimations', ''],
      ['Average Time per Layer (s)', result.tL.toFixed(2)],
      ['Total Estimated Print Time (min)', result.tTMin.toFixed(2)],
      ['Total Estimated Print Time (formatted)', `${result.hours}h ${result.mins}m`],
      ['Total Extruded Volume (cm³)', result.volumeCm3.toFixed(2)],
      ['1.75mm Filament Length (m)', result.filamentLengthMeters.toFixed(2)],
      ['Estimated PLA Mass (g)', result.filamentWeightGrams.toFixed(1)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '3d-print-layer-time-estimate.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Print Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Kinematics &amp; geometry settings</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Print Quality Presets</label>
            <div className="space-y-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activePreset === idx
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-black text-slate-500">{p.speed} mm/s</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Layer Height (mm)</label>
                <input
                  type="number"
                  step="0.04"
                  value={layerHeight}
                  onChange={e => { setLayerHeight(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Print Speed (mm/s)</label>
                <input
                  type="number"
                  step="10"
                  value={speed}
                  onChange={e => { setSpeed(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Perimeter (mm)</label>
                <input
                  type="number"
                  step="50"
                  value={perimeter}
                  onChange={e => setPerimeter(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Wall Count</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="10"
                  value={wallCount}
                  data-testid="print-input-walls"
                  onChange={e => setWallCount(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Infill Area (mm²)</label>
                <input
                  type="number"
                  step="1000"
                  value={infillArea}
                  onChange={e => setInfillArea(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Infill Density (%)</label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  max="100"
                  value={infillDensity}
                  onChange={e => setInfillDensity(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Solid Layers</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="50"
                  value={solidLayers}
                  onChange={e => setSolidLayers(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Total Layers</label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  value={totalLayers}
                  data-testid="print-input-layers"
                  onChange={e => setTotalLayers(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Acceleration &amp; Travel Overhead (%)
                </label>
                <span className="text-xs font-bold text-slate-600">{overheadPercent}%</span>
              </div>
              <input
                type="number"
                step="5"
                min="0"
                max="100"
                value={overheadPercent}
                data-testid="print-input-overhead"
                onChange={e => setOverheadPercent(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Accounts for stepper jerk/acceleration curves, retracts, and non-print G0 rapid travel. Standard: 25%.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setLayerHeight('0.20');
              setSpeed('50');
              setPerimeter('500');
              setWallCount('2');
              setInfillArea('10000');
              setInfillDensity('20');
              setSolidLayers('4');
              setTotalLayers('200');
              setOverheadPercent('25');
              setActivePreset(1);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Right Column: Results & Engineering Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Print Estimations</h2>
                  <p className="text-xs text-slate-500 font-medium">Layer kinematics &amp; filament consumption</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Result Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-200 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Total Estimated Print Time</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="print-total-time">{result.hours}h {result.mins}m</span>
                </div>
                <div className="text-xs text-indigo-100/90 mt-2 font-medium">
                  {result.tTMin.toFixed(0)} total minutes across {totalLayers} layers ({overheadPercent}% travel overhead)
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Filament Required (1.75mm)</span>
                </div>
                <div className="text-4xl font-black">
                  <span data-testid="print-filament-length">{result.filamentLengthMeters.toFixed(1)}</span> <span className="text-xl font-bold">m</span>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-medium">
                  Approx. <span data-testid="print-filament-weight">{result.filamentWeightGrams.toFixed(1)}</span>g PLA (density 1.24 g/cm³)
                </div>
              </div>
            </div>

            {/* Breakdown Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Time / Layer</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="print-time-per-layer">{result.tL.toFixed(1)}</span> <span className="text-xs text-slate-500 font-bold">s</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Raw toolpath motion speed</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Extruded Volume</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="print-extrusion-volume">{result.volumeCm3.toFixed(1)}</span> <span className="text-xs text-slate-500 font-bold">cm³</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{result.totalExtrusionMm3.toLocaleString()} mm³ plastic</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Solid vs Sparse</div>
                <div className="text-2xl font-black text-slate-900">{result.solidL} / {result.sparseL}</div>
                <div className="text-[11px] text-slate-400 mt-1">Solid (100%) vs {infillDensity}% infill</div>
              </div>
            </div>

            {/* Kinematic Methodology Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Toolpath Kinematics Formula:</strong> Wall duration is computed as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">(perimeter × walls) / v</code>. Infill duration calculates volumetric raster extrusion rate as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">(area × density) / (v × nozzle)</code>. Solid top and bottom layers enforce 100% density toolpaths.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
