'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download } from 'lucide-react';

const MATERIALS = [
  { name: 'PLA', density: 1.24, pricePerKg: 20, color: '#3b82f6' },
  { name: 'PETG', density: 1.27, pricePerKg: 25, color: '#10b981' },
  { name: 'ABS', density: 1.04, pricePerKg: 22, color: '#f59e0b' },
  { name: 'TPU (Flexible)', density: 1.21, pricePerKg: 35, color: '#8b5cf6' },
  { name: 'Nylon (PA)', density: 1.14, pricePerKg: 45, color: '#ef4444' },
  { name: 'PC (Polycarbonate)', density: 1.20, pricePerKg: 50, color: '#06b6d4' },
  { name: 'Custom', density: 1.24, pricePerKg: 20, color: '#64748b' },
];

export default function PrintCostClient() {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [customDensity, setCustomDensity] = useState('1.24');
  const [customPrice, setCustomPrice] = useState('20');
  const [modelVolume, setModelVolume] = useState('20'); // cm³
  const [infill, setInfill] = useState(20); // %
  const [shellLayers, setShellLayers] = useState('3');
  const [layerHeight, setLayerHeight] = useState('0.2'); // mm
  const [printSpeed, setPrintSpeed] = useState('60'); // mm/s
  const [nozzleWidth, setNozzleWidth] = useState('0.4'); // mm
  const [elecCost, setElecCost] = useState('0.15'); // $/kWh
  const [printerPower, setPrinterPower] = useState('120'); // W

  const mat = MATERIALS[materialIdx];
  const density = materialIdx === 6 ? Math.max(0.1, parseFloat(customDensity) || 1.24) : mat.density;
  const pricePerKg = materialIdx === 6 ? Math.max(0, parseFloat(customPrice) || 0) : mat.pricePerKg;

  const results = useMemo(() => {
    const V = Math.max(0, parseFloat(modelVolume) || 0); // cm³
    const infillRatio = Math.max(0, Math.min(100, infill)) / 100;
    const numShells = Math.max(0, parseInt(shellLayers, 10) || 0);
    const hLayer = Math.max(0.01, parseFloat(layerHeight) || 0.2);
    const wNozzle = Math.max(0.05, parseFloat(nozzleWidth) || 0.4);
    const speed = Math.max(1, parseFloat(printSpeed) || 60);
    const powerW = Math.max(0, parseFloat(printerPower) || 0);
    const costKwh = Math.max(0, parseFloat(elecCost) || 0);

    // Approximate shell volume: ~10% volume fraction per perimeter wall (capped at 50%)
    const shellFraction = Math.min(0.5, numShells * 0.1);
    const effectiveInfill = shellFraction + (1 - shellFraction) * infillRatio;
    const printedVolume = V * effectiveInfill; // cm³

    // Weight = volume × density
    const weightG = printedVolume * density;
    const weightKg = weightG / 1000;

    // Material cost
    const materialCost = weightKg * pricePerKg;

    // Bead path length: total linear length of extruded filament bead from nozzle
    // Bead cross-sectional area = layerHeight (mm) × nozzleWidth (mm) / 100 [cm²]
    const layerArea = (hLayer * wNozzle) / 100; // cm²
    const beadLengthCm = layerArea > 0 ? printedVolume / layerArea : 0; // cm
    const beadLengthM = beadLengthCm / 100;
    const beadLengthMM = beadLengthCm * 10;

    // Filament length: equivalent raw unextruded 1.75mm filament spool length
    // Cross-sectional area of 1.75mm filament: A = pi * (1.75 / 2)^2 ≈ 2.40528 mm² = 0.0240528 cm²
    const filAreaCm2 = 0.0240528;
    const filLengthCm = printedVolume > 0 ? printedVolume / filAreaCm2 : 0;
    const filLengthM = filLengthCm / 100;

    // Time = length / speed (seconds)
    const printTimeSec = speed > 0 ? beadLengthMM / speed : 0;
    const printTimeHr = printTimeSec / 3600;

    // Add overhead: warm-up, travel moves, layer changes (~30% overhead)
    const totalTimeHr = printTimeHr * 1.3;

    // Electricity cost
    const elecTotal = (powerW / 1000) * totalTimeHr * costKwh;

    // Total cost
    const totalCost = materialCost + elecTotal;

    return {
      weightG: weightG.toFixed(1),
      weightKg: weightKg.toFixed(3),
      materialCost: materialCost.toFixed(2),
      printTimeHr: totalTimeHr.toFixed(2),
      printTimeMin: (totalTimeHr * 60).toFixed(0),
      elecCost: elecTotal.toFixed(2),
      totalCost: totalCost.toFixed(2),
      beadLengthM: beadLengthM.toFixed(1),
      filamentLengthM: filLengthM.toFixed(2),
    };
  }, [modelVolume, infill, shellLayers, layerHeight, nozzleWidth, printSpeed, density, pricePerKg, printerPower, elecCost]);

  const downloadCsv = () => {
    const csv = [
      ['3D Print Cost & Time Estimator Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['Material', mat.name],
      ['', ''],
      ['Input Parameters', ''],
      ['Model Volume (cm³)', modelVolume],
      ['Infill (%)', infill],
      ['Shell Layers', shellLayers],
      ['Layer Height (mm)', layerHeight],
      ['Nozzle Width (mm)', nozzleWidth],
      ['Print Speed (mm/s)', printSpeed],
      ['Material Density (g/cm³)', density],
      ['Material Price ($/kg)', pricePerKg],
      ['Printer Power (W)', printerPower],
      ['Electricity Cost ($/kWh)', elecCost],
      ['', ''],
      ['Estimated Results', ''],
      ['Filament Weight (g)', results.weightG],
      ['1.75mm Filament Length (m)', results.filamentLengthM],
      ['Bead Path Length (m)', results.beadLengthM],
      ['Material Cost ($)', results.materialCost],
      ['Print Time (hours)', results.printTimeHr],
      ['Print Time (minutes)', results.printTimeMin],
      ['Electricity Cost ($)', results.elecCost],
      ['Total Cost ($)', results.totalCost],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '3d-print-cost-estimate.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (hours: string) => {
    const h = parseFloat(hours);
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    if (!isFinite(h)) return '—';
    if (mm === 60) return `${hh + 1}h 0m`;
    return `${hh}h ${mm}m`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Print Parameters</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
            <select data-testid="select-material" value={materialIdx} onChange={e => setMaterialIdx(parseInt(e.target.value, 10))} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all">
              {MATERIALS.map((m, i) => <option key={m.name} value={i}>{m.name} — ${m.pricePerKg}/kg</option>)}
            </select>
          </div>

          {materialIdx === 6 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Density (g/cm³)</label>
                <input type="number" step="0.01" value={customDensity} onChange={e => setCustomDensity(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Price ($/kg)</label>
                <input type="number" step="1" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
              </div>
            </div>
          )}

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Model Volume (cm³)</label>
            <input type="number" step="1" data-testid="input-volume" value={modelVolume} onChange={e => setModelVolume(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Infill Density: {infill}%</label>
            <input type="range" min="0" max="100" data-testid="input-infill" value={infill} onChange={e => setInfill(parseInt(e.target.value, 10))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-sm font-bold text-slate-400 mt-1">
              <span>0%</span><span>20%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium mb-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              Shell volume is estimated at ~10% volume fraction per perimeter wall (up to 50%). Verify in your slicer (Cura, PrusaSlicer, Bambu Studio) for exact perimeter toolpaths.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Shell Layers</label>
              <input type="number" step="1" value={shellLayers} onChange={e => setShellLayers(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Layer Height (mm)</label>
              <input type="number" step="0.05" value={layerHeight} onChange={e => setLayerHeight(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Print Speed (mm/s)</label>
              <input type="number" step="5" value={printSpeed} onChange={e => setPrintSpeed(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Nozzle (mm)</label>
              <input type="number" step="0.1" value={nozzleWidth} onChange={e => setNozzleWidth(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Printer Power (W)</label>
              <input type="number" step="10" value={printerPower} onChange={e => setPrinterPower(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Elec. ($/kWh)</label>
              <input type="number" step="0.01" value={elecCost} onChange={e => setElecCost(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Estimate Results</h2>
              <button data-testid="btn-export-csv" onClick={downloadCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Estimated Print Time</p>
                <p data-testid="result-print-time" className="text-3xl font-black">{formatTime(results.printTimeHr)}</p>
                <p className="text-sm mt-2 opacity-70">{results.printTimeMin} minutes total (incl. 30% overhead)</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                <p className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">Total Cost</p>
                <p data-testid="result-total-cost" className="text-3xl font-black">${results.totalCost}</p>
                <p className="text-sm mt-2 opacity-70">${results.materialCost} material + ${results.elecCost} electricity</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">Filament Weight</p>
                <p className="text-lg font-black text-slate-900"><span data-testid="result-weight">{results.weightG}</span><span className="text-base text-slate-400 font-bold ml-1">g</span></p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">1.75mm Spool Length</p>
                <p className="text-lg font-black text-slate-900"><span data-testid="result-filament-length">{results.filamentLengthM}</span><span className="text-base text-slate-400 font-bold ml-1">m</span></p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">Bead Path Length</p>
                <p className="text-lg font-black text-slate-900"><span data-testid="result-bead-length">{results.beadLengthM}</span><span className="text-base text-slate-400 font-bold ml-1">m</span></p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">Material Cost</p>
                <p className="text-lg font-black text-slate-900"><span data-testid="result-mat-cost">${results.materialCost}</span></p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-base font-bold text-slate-600 w-32">Material</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                  <div className="h-full bg-blue-500 flex items-center justify-end px-2 text-sm font-black text-white" style={{ width: `${parseFloat(results.totalCost) > 0 ? (parseFloat(results.materialCost) / parseFloat(results.totalCost)) * 100 : 0}%` }}>
                    ${results.materialCost}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-base font-bold text-slate-600 w-32">Electricity</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                  <div className="h-full bg-amber-500 flex items-center justify-end px-2 text-sm font-black text-white" style={{ width: `${parseFloat(results.totalCost) > 0 ? Math.max(2, (parseFloat(results.elecCost) / parseFloat(results.totalCost)) * 100) : 0}%` }}>
                    <span data-testid="result-elec-cost">${results.elecCost}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-3 font-medium">Estimates are approximate. Actual print time depends on travel moves, retraction, cooling pauses, and slicer-specific path optimization. Always verify with your slicer&apos;s time estimate.</p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
