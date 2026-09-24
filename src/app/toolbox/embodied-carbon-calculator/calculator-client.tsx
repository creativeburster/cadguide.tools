'use client';

import React, { useState, useMemo } from 'react';
import { Leaf, Copy, Check, Info, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export default function EmbodiedCarbonCalculatorClient() {
  const [copied, setCopied] = useState(false);

  // 输入参数
  const [grossFloorArea, setGrossFloorArea] = useState<number>(2500); // m²
  const [concreteVolume, setConcreteVolume] = useState<number>(850); // m³
  const [concreteEmissionFactor, setConcreteEmissionFactor] = useState<number>(320); // kgCO2e/m³ (e.g. C30/37 CEM I)
  const [rebarWeight, setRebarWeight] = useState<number>(85); // Tonnes
  const [rebarEmissionFactor, setRebarEmissionFactor] = useState<number>(1400); // kgCO2e/tonne
  const [structuralSteelWeight, setStructuralSteelWeight] = useState<number>(45); // Tonnes
  const [steelEmissionFactor, setSteelEmissionFactor] = useState<number>(1800); // kgCO2e/tonne
  const [glazingArea, setGlazingArea] = useState<number>(650); // m²
  const [glazingEmissionFactor, setGlazingEmissionFactor] = useState<number>(65); // kgCO2e/m² (double-glazed Low-E)

  const results = useMemo(() => {
    const concreteTotalKg = concreteVolume * concreteEmissionFactor;
    const rebarTotalKg = rebarWeight * rebarEmissionFactor;
    const steelTotalKg = structuralSteelWeight * steelEmissionFactor;
    const glazingTotalKg = glazingArea * glazingEmissionFactor;

    const totalEmbodiedCarbonKg = concreteTotalKg + rebarTotalKg + steelTotalKg + glazingTotalKg;
    const totalEmbodiedCarbonTonnes = totalEmbodiedCarbonKg / 1000;
    const area = Math.max(1, grossFloorArea);
    const carbonIntensityPerM2 = totalEmbodiedCarbonKg / area;

    // RIBA 2030 Climate Challenge Benchmark:
    // Target 2030 for non-domestic: < 500 kgCO2e/m²; Domestic: < 300 kgCO2e/m²
    let rating = 'D (High Carbon)';
    let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    if (carbonIntensityPerM2 <= 300) {
      rating = 'A (RIBA 2030 Exemplary Target)';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (carbonIntensityPerM2 <= 500) {
      rating = 'B (RIBA 2025 Standard Target)';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (carbonIntensityPerM2 <= 800) {
      rating = 'C (Business As Usual)';
      badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }

    return {
      concreteTotalTonnes: (concreteTotalKg / 1000).toFixed(1),
      rebarTotalTonnes: (rebarTotalKg / 1000).toFixed(1),
      steelTotalTonnes: (steelTotalKg / 1000).toFixed(1),
      glazingTotalTonnes: (glazingTotalKg / 1000).toFixed(1),
      totalEmbodiedCarbonTonnes: totalEmbodiedCarbonTonnes.toFixed(1),
      carbonIntensityPerM2: carbonIntensityPerM2.toFixed(1),
      rating,
      badgeColor
    };
  }, [grossFloorArea, concreteVolume, concreteEmissionFactor, rebarWeight, rebarEmissionFactor, structuralSteelWeight, steelEmissionFactor, glazingArea, glazingEmissionFactor]);

  const handleCopy = () => {
    const text = `Embodied Carbon Assessment:
Gross Floor Area: ${grossFloorArea} m²
Total Upfront Carbon: ${results.totalEmbodiedCarbonTonnes} tCO2e
Carbon Intensity: ${results.carbonIntensityPerM2} kgCO2e/m²
Benchmark Rating: ${results.rating} (EN 15978 / RICS Standard)`;
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
              <Leaf className="w-6 h-6 text-emerald-600" />
              <span>Cradle-to-Gate (A1-A3) Embodied Carbon Evaluation</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Compliant with EN 15978, RICS Whole Life Carbon Assessment, and RIBA 2030 Climate Challenge baselines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${results.badgeColor}`}>
              {results.rating}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                1. Project Floor Area & Concrete Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Gross Internal Floor Area (m²)</label>
                  <input
                    type="number"
                    value={grossFloorArea}
                    onChange={(e) => setGrossFloorArea(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Structural Concrete Volume (m³)</label>
                  <input
                    type="number"
                    value={concreteVolume}
                    onChange={(e) => setConcreteVolume(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Concrete Carbon Factor (kgCO₂e/m³)</label>
                <input
                  type="number"
                  value={concreteEmissionFactor}
                  onChange={(e) => setConcreteEmissionFactor(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400">Typical: C30/37 CEM I = 320 kgCO₂e/m³; CEM III GGBS blend = 190 kgCO₂e/m³</span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                2. Metals & Glazing Quantities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Reinforcing Rebar Steel (Tonnes)</label>
                  <input
                    type="number"
                    value={rebarWeight}
                    onChange={(e) => setRebarWeight(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Structural Steel Sections (Tonnes)</label>
                  <input
                    type="number"
                    value={structuralSteelWeight}
                    onChange={(e) => setStructuralSteelWeight(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Facade Curtain Wall & Glazing Area (m²)</label>
                <input
                  type="number"
                  value={glazingArea}
                  onChange={(e) => setGlazingArea(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Total Upfront Carbon (A1-A3)
              </span>
              <div className="text-4xl font-black text-white mt-1">
                {results.totalEmbodiedCarbonTonnes} <span className="text-lg font-bold text-emerald-400">tCO₂e</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Total metric tons of carbon embodied in structure</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300">Carbon Intensity per Unit Area</span>
              <div className="text-2xl font-black text-emerald-300">
                {results.carbonIntensityPerM2} <span className="text-xs font-semibold text-slate-300">kgCO₂e/m²</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Baseline standard benchmark: 600 - 800 kgCO₂e/m²
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Concrete Contribution:</span>
                <span className="font-bold text-white">{results.concreteTotalTonnes} tCO₂e</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reinforcing Rebar:</span>
                <span className="font-bold text-white">{results.rebarTotalTonnes} tCO₂e</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Structural Steelwork:</span>
                <span className="font-bold text-white">{results.steelTotalTonnes} tCO₂e</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Architectural Glazing:</span>
                <span className="font-bold text-white">{results.glazingTotalTonnes} tCO₂e</span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Carbon Audit Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
