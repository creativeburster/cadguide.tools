'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Clock, Download, Layers } from 'lucide-react';

interface Preset {
  name: string;
  layerHeight: string;
  speed: string;
  desc: string;
}

const PRESETS: Preset[] = [
  { name: 'Draft (Fast)', layerHeight: '0.28', speed: '65', desc: 'Rapid prototyping, thicker visible layer lines' },
  { name: 'Standard (Balanced)', layerHeight: '0.20', speed: '50', desc: 'Everyday mechanical parts & enclosures' },
  { name: 'Fine (Quality)', layerHeight: '0.12', speed: '40', desc: 'Miniatures, smooth curves & fine text' },
  { name: 'Ultra Fine', layerHeight: '0.08', speed: '30', desc: 'Highest resolution, longest print time' },
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

    // Total time with 25% acceleration & retraction overhead
    const totalTimeSec = totalCycleRawSec * 1.25;
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
      volumeCm3,
      modelHeightMm: h * layers,
      solidL,
      sparseL,
    };
  }, [layerHeight, speed, perimeter, wallCount, infillArea, infillDensity, solidLayers, totalLayers]);

  const downloadCsv = () => {
    const rows = [
      ['3D Print Layer Time & Kinematics Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Layer Height (mm)', layerHeight],
      ['Print Speed (mm/s)', speed],
      ['Layer Perimeter (mm)', perimeter],
      ['Wall Count (Shells)', wallCount],
      ['Infill Area (mm²)', infillArea],
      ['Infill Density (%)', infillDensity],
      ['Solid Top/Bottom Layers', solidLayers],
      ['Total Layers', totalLayers],
      ['', ''],
      ['Calculated Outputs', ''],
      ['Average Cycle per Layer (seconds)', result.tL.toFixed(1)],
      ['Total Print Time (minutes)', result.tTMin.toFixed(1)],
      ['Formatted Time', `${result.hours}h ${result.mins}m`],
      ['Total Model Height (mm)', result.modelHeightMm.toFixed(1)],
      ['Solid 100% Fill Layers', result.solidL],
      ['Sparse Infill Layers', result.sparseL],
      ['1.75mm Filament Length (meters)', result.filamentLengthMeters.toFixed(2)],
      ['Approx PLA Weight (grams)', result.filamentWeightGrams.toFixed(1)],
      ['Extruded Material Volume (cm³)', result.volumeCm3.toFixed(2)],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layer-time-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Slicer Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Wall count & solid cap kinematics</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Quality Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(idx)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    activePreset === idx
                      ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-black text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-400">{p.layerHeight}mm • {p.speed}mm/s</div>
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
                  step="0.02"
                  value={layerHeight}
                  onChange={e => { setLayerHeight(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Print Speed (mm/s)</label>
                <input
                  type="number"
                  step="5"
                  value={speed}
                  onChange={e => { setSpeed(e.target.value); setActivePreset(null); }}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Perimeter (mm)</label>
                <input
                  type="number"
                  step="10"
                  value={perimeter}
                  onChange={e => setPerimeter(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Wall Count</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={wallCount}
                  onChange={e => setWallCount(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Infill Area (mm²)</label>
              <input
                type="number"
                step="500"
                value={infillArea}
                onChange={e => setInfillArea(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Sparse Infill: {infillDensity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={infillDensity}
                onChange={e => setInfillDensity(e.target.value)}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Solid Cap Layers</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={solidLayers}
                  onChange={e => setSolidLayers(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Total Layers</label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  value={totalLayers}
                  onChange={e => setTotalLayers(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                />
              </div>
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
              setActivePreset(1);
            }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Kinematic & Material Output</h2>
                  <p className="text-xs text-slate-500 font-medium">Estimated print cycle & consumption</p>
                </div>
              </div>
              <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Time Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-200 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Total Print Time</span>
                </div>
                <div className="text-4xl font-black">{result.hours}h {result.mins}m</div>
                <div className="text-xs text-purple-200/90 mt-2 font-medium">
                  {result.tTMin.toFixed(1)} mins total • Includes 25% acceleration & travel buffer
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-100 mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Average Cycle per Layer</span>
                </div>
                <div className="text-4xl font-black">{result.tL.toFixed(1)}<span className="text-xl ml-1 font-bold">s</span></div>
                <div className="text-xs text-emerald-100/90 mt-2 font-medium">
                  Part Height: {result.modelHeightMm.toFixed(1)} mm ({totalLayers} layers @ {layerHeight} mm)
                </div>
              </div>
            </div>

            {/* Material Consumption Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">1.75mm Filament Length</div>
                <div className="text-2xl font-black text-slate-900">{result.filamentLengthMeters.toFixed(2)} <span className="text-xs text-slate-500 font-bold">m</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Based on 2.405 mm² standard cross-section</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approx. Filament Weight</div>
                <div className="text-2xl font-black text-slate-900">{result.filamentWeightGrams.toFixed(1)} <span className="text-xs text-slate-500 font-bold">g</span></div>
                <div className="text-[11px] text-slate-400 mt-1">Calculated for standard PLA (1.24 g/cm³)</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Solid Extruded Volume</div>
                <div className="text-2xl font-black text-slate-900">{result.volumeCm3.toFixed(2)} <span className="text-xs text-slate-500 font-bold">cm³</span></div>
                <div className="text-[11px] text-slate-400 mt-1">{result.solidL} solid + {result.sparseL} sparse infill layers</div>
              </div>
            </div>

            {/* Technical Formula Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Governing Slicer Kinematics:</strong> Outer perimeter duration is derived from <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">t_walls = (P × wallCount) / v</code>. Internal infill is segmented into solid cap layers (100% density) and sparse layers (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">t_infill = (A × density) / (v × nozzle)</code>), matching modern slicer toolpath kinematics.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
