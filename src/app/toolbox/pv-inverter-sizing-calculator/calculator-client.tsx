'use client';

import React, { useState, useMemo } from 'react';
import { Sun, Copy, Check, Info, ShieldCheck, Zap, Activity } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

export default function PVInverterSizingClient() {
  const [copied, setCopied] = useState(false);

  // Solar Array & Inverter Specifications
  const [moduleWattage, setModuleWattage] = useState<number>(550); // Wp per module
  const [moduleQuantity, setModuleQuantity] = useState<number>(240); // Total modules
  const [inverterAcPower, setInverterAcPower] = useState<number>(100); // kWac rated inverter power
  const [peakSunHours, setPeakSunHours] = useState<number>(4.3); // Hours/day average
  const [performanceRatio, setPerformanceRatio] = useState<number>(82); // PR % (soiling, thermal, wiring losses)
  const [gridCarbonFactor, setGridCarbonFactor] = useState<number>(0.475); // kgCO2e/kWh

  const results = useMemo(() => {
    // 1. Total DC Capacity
    const dcCapacityKw = (moduleWattage * moduleQuantity) / 1000;

    // 2. DC / AC Ratio (Inverter Loading Ratio / ILR)
    const acPower = Math.max(1, inverterAcPower);
    const dcAcRatio = dcCapacityKw / acPower;

    // 3. Estimated Clipping Loss %
    let clippingLossPct = 0;
    if (dcAcRatio > 1.35) {
      clippingLossPct = 2.0 + (dcAcRatio - 1.35) * 14;
    } else if (dcAcRatio > 1.22) {
      clippingLossPct = 0.5 + (dcAcRatio - 1.22) * 11.5;
    } else if (dcAcRatio > 1.10) {
      clippingLossPct = 0.2;
    }

    // 4. Annual Generation (MWh)
    const annualSpecificYieldKwhPerKwp = peakSunHours * 365 * (performanceRatio / 100);
    const grossAnnualKwh = dcCapacityKw * annualSpecificYieldKwhPerKwp;
    const netAnnualKwh = grossAnnualKwh * (1 - clippingLossPct / 100);
    const netAnnualMwh = netAnnualKwh / 1000;

    // 5. Environmental Offset
    const annualCo2Tonnes = (netAnnualKwh * gridCarbonFactor) / 1000;

    // 6. Diagnostic Evaluation
    let statusText = 'Optimal Sizing (Standard Commercial)';
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (dcAcRatio < 1.05) {
      statusText = 'Under-sized Array (Inverter Under-utilized)';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (dcAcRatio > 1.35) {
      statusText = 'High DC Overbuild (Noticeable Peak Clipping)';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else if (dcAcRatio > 1.50) {
      statusText = 'Excessive Overbuild (Check Inverter Max DC Specs)';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    }

    return {
      dcCapacityKw: dcCapacityKw.toFixed(1),
      dcAcRatio: dcAcRatio.toFixed(2),
      clippingLossPct: clippingLossPct.toFixed(1),
      annualSpecificYield: annualSpecificYieldKwhPerKwp.toFixed(0),
      netAnnualMwh: netAnnualMwh.toFixed(1),
      annualCo2Tonnes: annualCo2Tonnes.toFixed(1),
      statusText,
      badgeColor,
    };
  }, [moduleWattage, moduleQuantity, inverterAcPower, peakSunHours, performanceRatio, gridCarbonFactor]);

  const handleCopy = () => {
    const text = `Solar PV Inverter Sizing Report:
DC Array Capacity: ${results.dcCapacityKw} kWp (${moduleQuantity} × ${moduleWattage}Wp)
Inverter AC Rating: ${inverterAcPower} kWac
DC/AC Sizing Ratio (ILR): ${results.dcAcRatio} (${results.statusText})
Estimated Clipping Loss: ${results.clippingLossPct}%
Specific Yield: ${results.annualSpecificYield} kWh/kWp/year
Estimated Annual Production: ${results.netAnnualMwh} MWh/year
Estimated Annual CO2 Avoidance: ${results.annualCo2Tonnes} Tonnes CO2e
Calculated via CADGuide.tools (IEC 62548 Standard)`;

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
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">System Specifications</h2>
              <p className="text-xs text-slate-500 font-medium">Input PV module parameters, inverter power, and site solar data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Module Rating (Wp)
                </label>
                <input
                  type="number"
                  min="50"
                  max="800"
                  step="5"
                  value={moduleWattage}
                  onChange={(e) => setModuleWattage(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Module Quantity (pcs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={moduleQuantity}
                  onChange={(e) => setModuleQuantity(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Inverter AC Power (kWac)
              </label>
              <input
                type="number"
                min="0.5"
                max="5000"
                step="5"
                value={inverterAcPower}
                onChange={(e) => setInverterAcPower(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Total nominal continuous AC output capacity of the inverter(s)</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Location & Performance Factors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Peak Sun Hours (h/day)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    step="0.1"
                    value={peakSunHours}
                    onChange={(e) => setPeakSunHours(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Performance Ratio PR (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="95"
                    step="1"
                    value={performanceRatio}
                    onChange={(e) => setPerformanceRatio(Math.max(10, parseFloat(e.target.value) || 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              Engineering Sizing Rule of Thumb
            </div>
            <p>Modern PV systems typically employ a DC/AC ratio between 1.15 and 1.30. Inverters operate at higher efficiency across morning and afternoon hours; modest midday clipping loss is economically offset by lower balance-of-system (BOS) capital costs.</p>
          </div>
        </div>

        {/* Right Outputs */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Design Results</span>
              <h3 className="text-xl font-black text-white">Array Loading & Energy Yield</h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Specs'}
            </button>
          </div>

          {/* Big Ratio Display */}
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 text-center relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">DC / AC Loading Ratio</span>
            <div className="text-5xl md:text-6xl font-black text-amber-400 mt-2 mb-3 tracking-tight">
              {results.dcAcRatio}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-current shadow-sm bg-slate-900/60 text-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{results.statusText}</span>
            </div>
          </div>

          {/* Capacity & Losses Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="text-xs text-slate-400 mb-1">DC Array Rating</div>
              <div className="text-2xl font-black text-white">{results.dcCapacityKw} <span className="text-sm font-semibold text-slate-400">kWp</span></div>
              <div className="text-[11px] text-slate-400 mt-1">vs {inverterAcPower} kWac inverter</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="text-xs text-slate-400 mb-1">Estimated Inverter Clipping</div>
              <div className="text-2xl font-black text-amber-400">{results.clippingLossPct}%</div>
              <div className="text-[11px] text-slate-400 mt-1">Midday peak cut-off loss</div>
            </div>
          </div>

          {/* Annual Generation & ESG */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Annual Generation & Carbon Offset
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="py-2.5 px-3 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Estimated Annual Yield</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{results.netAnnualMwh} MWh</div>
              </div>
              <div className="py-2.5 px-3 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400">Annual CO2 Offset</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{results.annualCo2Tonnes} tCO2e</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Reference Notes */}
      <div className="p-6 md:p-8 bg-white rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          Photovoltaic Array Design Standards (IEC 62548 & NEC 690)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Clipping Economics</h4>
            <p className="text-xs leading-relaxed">
              Inverter loading ratios of 1.20 - 1.30 provide the lowest Levelized Cost of Energy (LCOE) by generating more power during dawn, dusk, and cloudy days, despite minor peak midday clipping.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Thermal Derating</h4>
            <p className="text-xs leading-relaxed">
              High ambient temperature degrades module voltage and wattage via negative temperature coefficients (-0.35%/°C). Actual peak DC output in summer is commonly 10-15% below STC rating.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Max Inverter DC Input</h4>
            <p className="text-xs leading-relaxed">
              Ensure total array open-circuit voltage (Voc) at minimum historic site temperature does not exceed the inverter maximum DC input voltage limit (typically 1000V or 1500Vdc).
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <RelatedTools />
    </div>
  );
}
