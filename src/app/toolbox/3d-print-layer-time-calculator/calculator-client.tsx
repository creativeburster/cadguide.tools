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
  const [inputs, setInputs] = useState(['0.20', '50', '500', '10000', '20', '200']);
  const [activePreset, setActivePreset] = useState<number | null>(1); // Standard default

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
    setActivePreset(null);
  };

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    const next = [...inputs];
    next[0] = p.layerHeight;
    next[1] = p.speed;
    setInputs(next);
    setActivePreset(idx);
  };

  const result = useMemo(() => {
    const h = Math.max(0.01, parseFloat(inputs[0]) || 0.2); // mm
    const v = Math.max(1, parseFloat(inputs[1]) || 50); // mm/s
    const perim = Math.max(0, parseFloat(inputs[2]) || 0); // mm
    const area = Math.max(0, parseFloat(inputs[3]) || 0); // mm²
    const dens = Math.max(0, Math.min(100, parseFloat(inputs[4]) || 0)) / 100; // ratio
    const layers = Math.max(1, parseInt(inputs[5]) || 1); // count
    const nozzle = 0.4; // standard 0.4mm nozzle

    // Time per layer: perimeter outline path + infill raster path (s)
    const tPerim = v > 0 ? perim / v : 0;
    const tInfill = v > 0 ? (area * dens) / (v * nozzle) : 0;
    const tL = tPerim + tInfill; // seconds

    // Total time with 25% acceleration & retraction overhead
    const totalTimeSec = tL * layers * 1.25;
    const tTMin = totalTimeSec / 60;
    const roundedMin = Math.round(tTMin);
    const hours = Math.floor(roundedMin / 60);
    const mins = roundedMin % 60;

    // Total extruded volume in mm³
    const vPerim = perim * nozzle * h * layers;
    const vInfill = area * dens * h * layers;
    const totalExtrusionMm3 = vPerim + vInfill;

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
    };
  }, [inputs]);

  const downloadCsv = () => {
    const rows = [
      ['3D Print Layer Time & Filament Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameters', ''],
      ['Layer Height (mm)', inputs[0]],
      ['Print Speed (mm/s)', inputs[1]],
      ['Layer Perimeter (mm)', inputs[2]],
      ['Infill Area (mm²)', inputs[3]],
      ['Infill Density (%)', inputs[4]],
      ['Total Layers', inputs[5]],
      ['', ''],
      ['Calculated Outputs', ''],
      ['Time per Layer (seconds)', result.tL.toFixed(1)],
      ['Total Print Time (minutes)', result.tTMin.toFixed(1)],
      ['Formatted Time', `${result.hours}h ${result.mins}m`],
      ['Total Model Height (mm)', result.modelHeightMm.toFixed(1)],
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
              <p className="text-xs text-slate-500 font-medium">Layer & extrusion kinematics</p>
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
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Layer Height (mm)</label>
              <input
                type="number"
                step="0.02"
                value={inputs[0]}
                onChange={e => updateInput(0, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Print Speed (mm/s)</label>
              <input
                type="number"
                step="5"
                value={inputs[1]}
                onChange={e => updateInput(1, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Layer Perimeter (mm)</label>
              <input
                type="number"
                step="10"
                value={inputs[2]}
                onChange={e => updateInput(2, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Infill Area (mm²)</label>
              <input
                type="number"
                step="500"
                value={inputs[3]}
                onChange={e => updateInput(3, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Infill Density: {inputs[4]}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs[4]}
                onChange={e => updateInput(4, e.target.value)}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Total Layers</label>
              <input
                type="number"
                step="10"
                value={inputs[5]}
                onChange={e => updateInput(5, e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => { setInputs(['0.20', '50', '500', '10000', '20', '200']); setActivePreset(1); }}
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
                  <span>Cycle per Layer</span>
                </div>
                <div className="text-4xl font-black">{result.tL.toFixed(1)}<span className="text-xl ml-1 font-bold">s</span></div>
                <div className="text-xs text-emerald-100/90 mt-2 font-medium">
                  Part Height: {result.modelHeightMm.toFixed(1)} mm ({inputs[5]} layers @ {inputs[0]} mm)
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
                <div className="text-[11px] text-slate-400 mt-1">Total polymer plastic deposited</div>
              </div>
            </div>

            {/* Technical Formula Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800">Governing Slicer Kinematics:</strong> Layer duration is derived from toolpath perimeter trajectory <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">t_perim = P / v</code> plus raster infill vector sweep <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">t_infill = (A × density) / (v × nozzle)</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
