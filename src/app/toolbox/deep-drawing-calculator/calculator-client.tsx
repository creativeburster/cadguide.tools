'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Copy, Check, Info, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export default function DeepDrawingCalculatorClient() {
  const [copied, setCopied] = useState(false);

  // Geometric Parameters
  const [blankDiameter, setBlankDiameter] = useState<number>(100); // mm (D)
  const [punchDiameter, setPunchDiameter] = useState<number>(55); // mm (d)
  const [sheetThickness, setSheetThickness] = useState<number>(1.2); // mm (t)
  const [dieShoulderRadius, setDieShoulderRadius] = useState<number>(6); // mm (rd)

  // Material & Press Parameters
  const [tensileStrength, setTensileStrength] = useState<number>(340); // MPa (Rm)
  const [blankHolderPressure, setBlankHolderPressure] = useState<number>(2.0); // MPa (pbh)

  // Material presets
  const handleMaterialPreset = (rm: number, pbh: number) => {
    setTensileStrength(rm);
    setBlankHolderPressure(pbh);
  };

  const results = useMemo(() => {
    const D = Math.max(1, blankDiameter);
    const d = Math.max(0.1, punchDiameter);
    const t = Math.max(0.05, sheetThickness);
    const rd = Math.max(0.5, dieShoulderRadius);

    // 1. Drawing Ratio & Reduction
    const drawingRatio = D / d;
    const reductionPct = Math.max(0, (1 - d / D) * 100);

    // 2. Drawing Force Calculation per DIN 8584:
    // F_draw = pi * d * t * Rm * (D/d - 0.65)
    const factorC = Math.max(0.2, (D / d) - 0.65);
    const drawingForceKn = (Math.PI * d * t * tensileStrength * factorC) / 1000;

    // 3. Blank Holder Force Calculation:
    // Area = pi/4 * (D^2 - (d + 2*rd)^2)
    const innerBoundary = d + 2 * rd;
    let blankHolderArea = 0;
    if (D > innerBoundary) {
      blankHolderArea = (Math.PI / 4) * (Math.pow(D, 2) - Math.pow(innerBoundary, 2));
    }
    const blankHolderForceKn = Math.max(0, (blankHolderArea * blankHolderPressure) / 1000);

    // 4. Total Press Tonnage (including 25% safety margin, 1 tonne = 9.80665 kN)
    const totalForceKn = drawingForceKn + blankHolderForceKn;
    const recommendedTonnage = (totalForceKn * 1.25) / 9.80665;

    // 5. Drawability Feasibility Assessment
    let feasibility = 'Feasible Single Draw';
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let warning = null;

    if (drawingRatio <= 1.95) {
      feasibility = 'Feasible in 1st Draw (Normal Operation)';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (drawingRatio <= 2.15) {
      feasibility = 'Borderline (High Draw Quality & Lubricant Required)';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      warning = 'Draw ratio is near the physical tear limit for single-stage drawing. High-lubricity drawing compound and generous die radii recommended.';
    } else {
      feasibility = 'Multi-Stage Redraw Required (Tearing Risk)';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
      warning = 'Drawing ratio exceeds standard single-operation limits (~2.0 to 2.1). Cup must be produced using two or more draw stages.';
    }

    return {
      drawingRatio: drawingRatio.toFixed(2),
      reductionPct: reductionPct.toFixed(1),
      drawingForceKn: drawingForceKn.toFixed(1),
      blankHolderForceKn: blankHolderForceKn.toFixed(1),
      totalForceKn: totalForceKn.toFixed(1),
      recommendedTonnage: recommendedTonnage.toFixed(1),
      feasibility,
      badgeColor,
      warning,
    };
  }, [blankDiameter, punchDiameter, sheetThickness, dieShoulderRadius, tensileStrength, blankHolderPressure]);

  const handleCopy = () => {
    const text = `Sheet Metal Deep Drawing Calculation Report:
Blank Diameter (D): ${blankDiameter} mm | Punch Diameter (d): ${punchDiameter} mm | Sheet (t): ${sheetThickness} mm
Material Rm: ${tensileStrength} MPa | Die Radius (rd): ${dieShoulderRadius} mm
- Drawing Ratio (β): ${results.drawingRatio} (${results.feasibility})
- Reduction Rate: ${results.reductionPct}%
- Drawing Force: ${results.drawingForceKn} kN
- Blank Holder Force: ${results.blankHolderForceKn} kN
- Total Force: ${results.totalForceKn} kN
- Recommended Press Tonnage: ${results.recommendedTonnage} Tonnes (with 25% safety margin)
Calculated via CADGuide.tools (DIN 8584 Standard)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tooling & Sheet Dimensions</h2>
              <p className="text-xs text-slate-500 font-medium">Input blank diameter, punch diameter, gauge, and material</p>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Material Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleMaterialPreset(320, 2.0)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Deep Draw Steel (DC04 / SPCE - 320 MPa)
              </button>
              <button
                type="button"
                onClick={() => handleMaterialPreset(620, 3.0)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Stainless 304 (620 MPa)
              </button>
              <button
                type="button"
                onClick={() => handleMaterialPreset(190, 1.2)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Aluminum 5052-O (190 MPa)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Blank Diameter D (mm)
                </label>
                <input
                  type="number"
                  min="5"
                  max="2000"
                  step="1"
                  value={blankDiameter}
                  onChange={(e) => setBlankDiameter(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Punch Diameter d (mm)
                </label>
                <input
                  type="number"
                  min="2"
                  max="1500"
                  step="1"
                  value={punchDiameter}
                  onChange={(e) => setPunchDiameter(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sheet Thickness t (mm)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="25"
                  step="0.1"
                  value={sheetThickness}
                  onChange={(e) => setSheetThickness(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Die Shoulder Radius rd (mm)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={dieShoulderRadius}
                  onChange={(e) => setDieShoulderRadius(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Material Tensile Rm (MPa)
                </label>
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="10"
                  value={tensileStrength}
                  onChange={(e) => setTensileStrength(Math.max(10, parseFloat(e.target.value) || 10))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Blank Holder Pressure (MPa)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="15"
                  step="0.1"
                  value={blankHolderPressure}
                  onChange={(e) => setBlankHolderPressure(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              DIN 8584 Standard Limit
            </div>
            <p>Maximum first draw ratio β (D/d) typically tops out at ~2.00 to 2.10 for killed deep-drawing sheet steel, and ~1.65 to 1.80 for standard aluminum alloys without intermediate annealing.</p>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Analysis Results</span>
              <h3 className="text-xl font-black text-white">Drawability & Press Sizing</h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          </div>

          {/* Big Ratio Display */}
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 text-center relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Drawing Ratio β (D/d)</span>
            <div className="text-5xl md:text-6xl font-black text-indigo-400 mt-2 mb-3 tracking-tight">
              {results.drawingRatio}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-current shadow-sm bg-slate-900/60 text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{results.feasibility}</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Cross-section diameter reduction: <strong className="text-white">{results.reductionPct}%</strong>
            </div>
          </div>

          {results.warning && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{results.warning}</span>
            </div>
          )}

          {/* Force & Press Tonnage Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="text-xs text-slate-400 mb-1">Drawing Force (F_draw)</div>
              <div className="text-2xl font-black text-white">{results.drawingForceKn} <span className="text-sm font-semibold text-slate-400">kN</span></div>
              <div className="text-[11px] text-slate-400 mt-1">Cylindrical punch force</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="text-xs text-slate-400 mb-1">Blank Holder Force (F_bh)</div>
              <div className="text-2xl font-black text-indigo-400">{results.blankHolderForceKn} <span className="text-sm font-semibold text-slate-400">kN</span></div>
              <div className="text-[11px] text-slate-400 mt-1">Wrinkle prevention clamping</div>
            </div>
          </div>

          {/* Recommended Press Sizing */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Combined Press Capacity (with 25% safety):</span>
              <span className="font-bold text-white">{results.totalForceKn} kN</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1 border-t border-slate-700">
              <span className="font-bold text-slate-200">Recommended Press Sizing:</span>
              <span className="text-xl font-black text-emerald-400">{results.recommendedTonnage} Tonnes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Reference Notes */}
      <div className="p-6 md:p-8 bg-white rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Sheet Metal Deep Drawing Engineering Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Die Radius (rd) Sizing</h4>
            <p className="text-xs leading-relaxed">
              Die radius should typically be (4 to 8) × sheet thickness. An overly sharp radius creates tensile stress concentrations causing premature tearing; an overly large radius promotes flange wrinkling.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Blank Holder Function</h4>
            <p className="text-xs leading-relaxed">
              As the outer flange contracts circumferentially into the die, compressive stresses induce buckling (wrinkling). The blank holder suppresses wrinkles; excessive pressure will cause bottom punch blowout.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Anisotropy & Earring</h4>
            <p className="text-xs leading-relaxed">
              Crystalline sheet orientation (planar anisotropy Δr) causes wavy cup rims (earing). Material grades certified for deep drawing (e.g. DC04, EN 10130) feature controlled plastic strain ratios (r-value &gt; 1.6).
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <RelatedTools />
    </div>
  );
}
