'use client';

import React, { useState, useMemo } from 'react';
import { Wind, Copy, Check, Info, ShieldCheck, Scale } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export default function GlazingWindLoadCalculatorClient() {
  const [copied, setCopied] = useState(false);

  // 输入参数
  const [width, setWidth] = useState<number>(1500); // mm
  const [height, setHeight] = useState<number>(2400); // mm
  const [windPressure, setWindPressure] = useState<number>(1.8); // kPa (design wind load)
  const [glassThickness, setGlassThickness] = useState<number>(10); // mm
  const [glassType, setGlassType] = useState<'annealed' | 'heat-strengthened' | 'fully-tempered'>('fully-tempered');
  const [aspectLimit, setAspectLimit] = useState<'L60' | 'L175'>('L175'); // Deflection limit: L/60 for aesthetic, L/175 for structural seal

  const results = useMemo(() => {
    const a = Math.min(width, height); // short span
    const b = Math.max(width, height); // long span
    const t = Math.max(1, glassThickness);
    const q = windPressure * 1000; // Pa (N/m²)

    // Glass Modulus of Elasticity E = 70,000 MPa, Poisson's ratio ν = 0.22
    const E = 70000; // MPa

    // Approximate maximum central deflection for 4-side simply supported rectangular plate
    // w_max = α * q * a^4 / (E * t^3)
    // ratio b/a
    const ratio = b / a;
    let alpha = 0.044; // for ratio ~ 1.5
    if (ratio <= 1.1) alpha = 0.0138;
    else if (ratio <= 1.3) alpha = 0.0270;
    else if (ratio <= 1.6) alpha = 0.0440;
    else if (ratio <= 2.0) alpha = 0.0650;
    else alpha = 0.0800;

    // a in meters
    const aM = a / 1000;
    const tM = t / 1000;
    const deflectionMm = (alpha * q * Math.pow(aM, 4)) / (E * 1e6 * Math.pow(tM, 3)) * 1000;

    // Allowable deflection limit
    const limitDivisor = aspectLimit === 'L175' ? 175 : 60;
    const maxAllowableDeflection = a / limitDivisor;

    // Max surface bending stress σ_max = β * q * a² / t²
    let beta = 0.40;
    if (ratio <= 1.1) beta = 0.287;
    else if (ratio <= 1.5) beta = 0.450;
    else if (ratio <= 2.0) beta = 0.610;
    else beta = 0.750;

    const stressMpa = (beta * (q / 1e6) * Math.pow(a, 2)) / Math.pow(t, 2);

    // Allowable stress per ASTM E1300:
    // Annealed = 19.3 MPa, Heat-Strengthened = 38.6 MPa, Fully Tempered = 68.9 MPa
    let allowableStress = 68.9;
    if (glassType === 'annealed') allowableStress = 19.3;
    if (glassType === 'heat-strengthened') allowableStress = 38.6;

    const stressPass = stressMpa <= allowableStress;
    const deflPass = deflectionMm <= maxAllowableDeflection;
    const overallPass = stressPass && deflPass;

    return {
      deflectionMm: deflectionMm.toFixed(2),
      maxAllowableDeflection: maxAllowableDeflection.toFixed(2),
      stressMpa: stressMpa.toFixed(1),
      allowableStress: allowableStress.toFixed(1),
      stressRatio: (stressMpa / allowableStress).toFixed(2),
      overallPass,
      status: overallPass ? 'VERIFIED (PASS)' : 'EXCEEDED (FAIL)'
    };
  }, [width, height, windPressure, glassThickness, glassType, aspectLimit]);

  const handleCopy = () => {
    const text = `Curtain Wall Glazing Wind Load Assessment:
Panel Size: ${width}mm x ${height}mm (t=${glassThickness}mm, ${glassType.toUpperCase()})
Wind Pressure: ${windPressure} kPa
Max Deflection: ${results.deflectionMm} mm (Allowable: ${results.maxAllowableDeflection} mm)
Max Surface Stress: ${results.stressMpa} MPa (Allowable: ${results.allowableStress} MPa)
Compliance Status: ${results.status} (ASTM E1300 / IBC Standard)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wind className="w-6 h-6 text-sky-600" />
              <span>ASTM E1300 Glass Panel Structural Verification</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              4-side simply supported rectangular glass pane under uniform lateral wind pressure.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${
              results.overallPass 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {results.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                1. Panel Dimensions & Wind Pressure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Width a (mm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(100, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Height b (mm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(100, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Design Wind Load (kPa)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={windPressure}
                    onChange={(e) => setWindPressure(Math.max(0.1, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                2. Glass Specification & Deflection Limits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nominal Thickness (mm)</label>
                  <select
                    value={glassThickness}
                    onChange={(e) => setGlassThickness(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    {[6, 8, 10, 12, 15, 19].map((t) => (
                      <option key={t} value={t}>{t} mm monolithic</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Heat Treatment Type</label>
                  <select
                    value={glassType}
                    onChange={(e) => setGlassType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="fully-tempered">Fully Tempered (FT)</option>
                    <option value="heat-strengthened">Heat-Strengthened (HS)</option>
                    <option value="annealed">Regular Annealed (AN)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Deflection Standard Limit</label>
                  <select
                    value={aspectLimit}
                    onChange={(e) => setAspectLimit(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="L175">L / 175 (Strict Structural Seal)</option>
                    <option value="L60">L / 60 (Standard Sightline)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                Calculated Center Deflection
              </span>
              <div className="text-4xl font-black text-white mt-1">
                {results.deflectionMm} <span className="text-lg font-bold text-sky-400">mm</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Maximum allowable limit: <strong>{results.maxAllowableDeflection} mm</strong>
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300">Surface Bending Stress Demand</span>
              <div className="text-2xl font-black text-sky-300">
                {results.stressMpa} <span className="text-xs font-semibold text-slate-300">MPa</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Allowable stress capacity ({glassType}): <strong>{results.allowableStress} MPa</strong>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Stress Utilization Ratio:</span>
                <span className="font-bold text-white">{results.stressRatio}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Governing Standard:</span>
                <span className="font-bold text-white">ASTM E1300 / IBC 2404</span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-900/40"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Glazing Calculation Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
