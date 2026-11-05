'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download, BatteryCharging, ShieldAlert } from 'lucide-react';

interface ChemistryPreset {
  name: string;
  defaultDod: number;
  cellVoltage: string;
  cycleLife: string;
  description: string;
}

const CHEMISTRY_PRESETS: Record<string, ChemistryPreset> = {
  lifepo4: {
    name: 'Lithium Iron Phosphate (LiFePO4)',
    defaultDod: 0.85,
    cellVoltage: '3.2V / cell',
    cycleLife: '3,000 - 6,000 cycles',
    description: 'High thermal stability, deep discharge tolerance, ideal for solar ESS & telecom.'
  },
  li_ion: {
    name: 'Lithium-ion NMC / NCA',
    defaultDod: 0.80,
    cellVoltage: '3.7V / cell',
    cycleLife: '1,000 - 2,000 cycles',
    description: 'High energy density, compact footprint, common in portable & EV energy storage.'
  },
  agm_gel: {
    name: 'Sealed AGM / Gel Lead-Acid',
    defaultDod: 0.50,
    cellVoltage: '2.0V / cell (12V monobloc)',
    cycleLife: '500 - 800 cycles',
    description: 'Maintenance-free, robust, standard for emergency UPS backup systems.'
  },
  flooded: {
    name: 'Flooded Lead-Acid (FLA)',
    defaultDod: 0.50,
    cellVoltage: '2.0V / cell',
    cycleLife: '800 - 1,200 cycles',
    description: 'Economical industrial stationary backup; requires periodic distilled water replenishment.'
  }
};

const VOLTAGE_PRESETS = [12, 24, 48, 96, 120];

export default function BatteryCapacityCalculatorClient() {
  // Inputs
  const [loadPower, setLoadPower] = useState('500'); // Watts
  const [backupTime, setBackupTime] = useState('4');   // Hours
  const [systemVoltage, setSystemVoltage] = useState('48'); // Volts DC
  const [dod, setDod] = useState('0.8');              // Depth of Discharge (0.1 - 1.0)
  const [inverterEff, setInverterEff] = useState('0.9'); // Efficiency (0.7 - 0.99)
  const [designMargin, setDesignMargin] = useState('1.10'); // Safety / Aging margin (IEEE 485)
  const [selectedChemistry, setSelectedChemistry] = useState('custom');

  const handleChemistryChange = (key: string) => {
    setSelectedChemistry(key);
    if (key !== 'custom' && CHEMISTRY_PRESETS[key]) {
      setDod(CHEMISTRY_PRESETS[key].defaultDod.toString());
    }
  };

  const handleVoltagePreset = (v: number) => {
    setSystemVoltage(v.toString());
  };

  const handleReset = () => {
    setLoadPower('500');
    setBackupTime('4');
    setSystemVoltage('48');
    setDod('0.8');
    setInverterEff('0.9');
    setDesignMargin('1.10');
    setSelectedChemistry('custom');
  };

  const result = useMemo(() => {
    const P = parseFloat(loadPower);
    const t = parseFloat(backupTime);
    const V = parseFloat(systemVoltage);
    const d = parseFloat(dod);
    const eff = parseFloat(inverterEff);
    const margin = parseFloat(designMargin);

    if (
      isNaN(P) || isNaN(t) || isNaN(V) || isNaN(d) || isNaN(eff) ||
      P <= 0 || t <= 0 || V <= 0 || d <= 0 || eff <= 0
    ) {
      return {
        isValid: false,
        energyNeededWh: 0,
        baseAh: 0,
        recommendedAh: 0,
        totalStoredWh: 0,
        dcCurrentA: 0
      };
    }

    // Required energy by the AC/DC load
    const energyNeededWh = P * t;

    // Base Ampere-Hour capacity at battery terminal
    const baseAh = energyNeededWh / (V * d * eff);

    // Recommended Ah capacity with IEEE 485 aging & design margin
    const m = isNaN(margin) || margin <= 0 ? 1.0 : margin;
    const recommendedAh = baseAh * m;

    // Total gross energy capacity stored in the battery pack
    const totalStoredWh = baseAh * V;

    // Continuous DC discharge current at nominal voltage
    const dcCurrentA = P / (V * eff);

    return {
      isValid: true,
      energyNeededWh,
      baseAh,
      recommendedAh,
      totalStoredWh,
      dcCurrentA
    };
  }, [loadPower, backupTime, systemVoltage, dod, inverterEff, designMargin]);

  const formatNum = (n: number, decimals: number = 2) => {
    if (!result.isValid || isNaN(n) || !isFinite(n)) return '—';
    return n.toFixed(decimals);
  };

  const handleExportCsv = () => {
    const headers = ['Parameter', 'Value', 'Unit'];
    const rows = [
      ['Load Power (P)', loadPower, 'W'],
      ['Backup Duration (t)', backupTime, 'h'],
      ['System DC Voltage (V)', systemVoltage, 'V'],
      ['Depth of Discharge (DoD)', dod, 'ratio'],
      ['Inverter / System Efficiency', inverterEff, 'ratio'],
      ['Design Margin (IEEE 485)', designMargin, 'multiplier'],
      ['Energy Needed (Load)', formatNum(result.energyNeededWh, 1), 'Wh'],
      ['Base Battery Capacity', formatNum(result.baseAh, 2), 'Ah'],
      ['Recommended Sized Capacity', formatNum(result.recommendedAh, 2), 'Ah'],
      ['Total Gross Battery Energy', formatNum(result.totalStoredWh, 1), 'Wh'],
      ['Continuous DC Current', formatNum(result.dcCurrentA, 2), 'A']
    ];

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `battery-capacity-sizing-${systemVoltage}v-${loadPower}w.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Inputs Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs & Parameters</h2>
            </div>
            <button
              data-testid="btn-reset"
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Chemistry Preset Dropdown */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Battery Chemistry Preset
            </label>
            <select
              data-testid="select-chemistry"
              value={selectedChemistry}
              onChange={(e) => handleChemistryChange(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="custom">Custom Configuration</option>
              <option value="lifepo4">LiFePO4 (Lithium Iron Phosphate - 85% DoD)</option>
              <option value="li_ion">Lithium-ion NMC (80% DoD)</option>
              <option value="agm_gel">AGM / Gel Lead-Acid (50% DoD)</option>
              <option value="flooded">Flooded Lead-Acid (FLA - 50% DoD)</option>
            </select>
          </div>

          {/* Load Power */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Load Power (Watts)
            </label>
            <input
              type="text"
              data-testid="input-load-power"
              value={loadPower}
              onChange={(e) => setLoadPower(e.target.value)}
              placeholder="500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          {/* Backup Time */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Backup Autonomy Time (Hours)
            </label>
            <input
              type="text"
              data-testid="input-backup-time"
              value={backupTime}
              onChange={(e) => setBackupTime(e.target.value)}
              placeholder="4"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          {/* System Voltage with Quick Presets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                System DC Voltage (Volts)
              </label>
            </div>
            <input
              type="text"
              data-testid="input-system-voltage"
              value={systemVoltage}
              onChange={(e) => setSystemVoltage(e.target.value)}
              placeholder="48"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <div className="flex gap-1.5 mt-2">
              {VOLTAGE_PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  data-testid={`btn-voltage-${v}`}
                  onClick={() => handleVoltagePreset(v)}
                  className={`flex-1 py-1.5 text-xs font-black rounded-lg border transition-all ${
                    systemVoltage === v.toString()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>

          {/* Depth of Discharge & Efficiency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Max DoD (0.1-1.0)
              </label>
              <input
                type="text"
                data-testid="input-dod"
                value={dod}
                onChange={(e) => {
                  setDod(e.target.value);
                  setSelectedChemistry('custom');
                }}
                placeholder="0.8"
                className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Efficiency (η)
              </label>
              <input
                type="text"
                data-testid="input-efficiency"
                value={inverterEff}
                onChange={(e) => setInverterEff(e.target.value)}
                placeholder="0.9"
                className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Design Margin */}
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Design & Aging Margin (IEEE 485)
            </label>
            <input
              type="text"
              data-testid="input-design-margin"
              value={designMargin}
              onChange={(e) => setDesignMargin(e.target.value)}
              placeholder="1.10"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              1.10 = 10% safety margin for battery capacity degradation over lifetime.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              data-testid="btn-reset-secondary"
              onClick={handleReset}
              className="w-1/3 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              data-testid="btn-export-csv"
              onClick={handleExportCsv}
              className="w-2/3 py-3 rounded-xl text-sm font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Sizing CSV
            </button>
          </div>
        </div>

        {/* Right Results & Visuals Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Sizing Results</h2>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <BatteryCharging className="w-3.5 h-3.5" />
                IEEE 485 / NEC 480 Aligned
              </span>
            </div>

            {/* Core Output Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                    Rated Battery Capacity (C)
                  </div>
                  <div className="text-4xl font-black text-blue-900 font-mono" data-testid="res-battery-capacity">
                    {formatNum(result.baseAh, 2)}
                    <span className="text-lg text-blue-500 ml-1.5">Ah</span>
                  </div>
                </div>
                <div className="text-xs text-blue-600/80 font-semibold mt-3 pt-3 border-t border-blue-200/50">
                  Recommended with {((parseFloat(designMargin) - 1) * 100).toFixed(0)}% margin:{' '}
                  <strong className="text-blue-900" data-testid="res-recommended-capacity">
                    {formatNum(result.recommendedAh, 2)} Ah
                  </strong>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-2">
                    Load Energy Needed
                  </div>
                  <div className="text-4xl font-black text-emerald-900 font-mono" data-testid="res-energy-needed">
                    {formatNum(result.energyNeededWh, 0)}
                    <span className="text-lg text-emerald-500 ml-1.5">Wh</span>
                  </div>
                </div>
                <div className="text-xs text-emerald-700/80 font-semibold mt-3 pt-3 border-t border-emerald-200/50">
                  Equivalent to {(result.energyNeededWh / 1000).toFixed(2)} kWh AC/DC consumption
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Total Gross Energy Stored
                </div>
                <div className="text-2xl font-black text-slate-800 font-mono" data-testid="res-total-stored-energy">
                  {formatNum(result.totalStoredWh, 1)}
                  <span className="text-sm text-slate-500 ml-1">Wh</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  Nominal capacity energy: Ah &times; V ({formatNum(result.totalStoredWh / 1000, 2)} kWh)
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Continuous DC Discharge Current
                </div>
                <div className="text-2xl font-black text-slate-800 font-mono" data-testid="res-dc-discharge-current">
                  {formatNum(result.dcCurrentA, 2)}
                  <span className="text-sm text-slate-500 ml-1">A</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  Bus discharge current at {systemVoltage}V nominal (P / (V &times; η))
                </p>
              </div>
            </div>

            {/* Engineering Formula Callout */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 font-mono leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Sizing Equations:</span>
                E_load = P &times; t (Wh) &bull; Capacity = E_load / (V_sys &times; DoD &times; &eta;) (Ah) &bull; I_dc = P / (V_sys &times; &eta;) (A)
              </div>
            </div>
          </div>

          {/* Technical Specs & Chemistry Guide */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              Battery Sizing & Chemistry Reference (IEEE 485 / NEC Article 480)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-slate-800 font-bold block mb-1">Depth of Discharge (DoD) Limits:</strong>
                Deep-cycle lead-acid batteries (AGM/Gel/FLA) should generally not exceed 50% DoD for reliable cycle longevity. Lithium-based batteries (LiFePO4/NMC) comfortably handle 80% to 90% DoD.
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-slate-800 font-bold block mb-1">Temperature Derating:</strong>
                Batteries operated in sub-ambient temperatures (below 25&deg;C / 77&deg;F) lose effective capacity. Under freezing conditions (0&deg;C), lead-acid capacity drops by ~20%, requiring a 1.25 derating multiplier.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
