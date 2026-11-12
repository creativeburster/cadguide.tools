'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw, AlertTriangle } from 'lucide-react';

type FlowUnit = 'L/s' | 'm3/h';

interface ChillerPreset {
  id: string;
  label: string;
  flow: string;
  unit: FlowUnit;
  tempIn: string;
  tempOut: string;
  cp: string;
  density: string;
  note: string;
}

const PRESETS: ChillerPreset[] = [
  {
    id: 'water-50ls',
    label: 'Chilled Water (50 L/s, 12°C → 7°C)',
    flow: '50',
    unit: 'L/s',
    tempIn: '12',
    tempOut: '7',
    cp: '4.184',
    density: '1.000',
    note: 'Standard chilled water loop using pure water specific heat 4.184 kJ/(kg·K) at 20°C and density 1.000 kg/L.',
  },
  {
    id: 'glycol-30pct',
    label: '30% Glycol Loop (36 m³/h, 10°C → 4°C)',
    flow: '36',
    unit: 'm3/h',
    tempIn: '10',
    tempOut: '4',
    cp: '3.900',
    density: '1.030',
    note: 'Example inhibited glycol loop (illustrative typical values: cp = 3.900 kJ/(kg·K), density = 1.030 kg/L; verify fluid datasheet).',
  },
  {
    id: 'district-cooling',
    label: 'District Cooling Low-Flow (100 L/s, 14°C → 5.5°C)',
    flow: '100',
    unit: 'L/s',
    tempIn: '14',
    tempOut: '5.5',
    cp: '4.184',
    density: '1.000',
    note: 'High delta-T (8.5 K) district chilled water plant example.',
  },
];

// NIST SP 811 Appendix B.9: 1 ton of refrigeration (12,000 Btu_IT/h) = 3.516853 E+03 W = 3.516853 kW
const KW_PER_RT = 3.516853;

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

export default function ChillerLoadCalculatorClient() {
  const [flowStr, setFlowStr] = useState('50');
  const [flowUnit, setFlowUnit] = useState<FlowUnit>('L/s');
  const [tempInStr, setTempInStr] = useState('12');
  const [tempOutStr, setTempOutStr] = useState('7');
  const [cpStr, setCpStr] = useState('4.184');
  const [densityStr, setDensityStr] = useState('1.000');

  const applyPreset = (preset: ChillerPreset) => {
    setFlowStr(preset.flow);
    setFlowUnit(preset.unit);
    setTempInStr(preset.tempIn);
    setTempOutStr(preset.tempOut);
    setCpStr(preset.cp);
    setDensityStr(preset.density);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const calc = useMemo(() => {
    const flowRaw = parseStrictNumber(flowStr);
    const tIn = parseStrictNumber(tempInStr);
    const tOut = parseStrictNumber(tempOutStr);
    const cp = parseStrictNumber(cpStr);
    const rho = parseStrictNumber(densityStr);

    if (
      !Number.isFinite(flowRaw) ||
      !Number.isFinite(tIn) ||
      !Number.isFinite(tOut) ||
      !Number.isFinite(cp) ||
      !Number.isFinite(rho)
    ) {
      return { valid: false as const, error: 'Enter valid finite numbers for all fluid and temperature inputs.' };
    }

    if (flowRaw <= 0 || flowRaw > 100000) {
      return { valid: false as const, error: 'Volumetric flow rate must be greater than 0 and at most 100,000.' };
    }
    if (tIn < -50 || tIn > 150 || tOut < -50 || tOut > 150) {
      return { valid: false as const, error: 'Fluid temperatures must stay within -50°C to 150°C.' };
    }
    if (tIn <= tOut) {
      return { valid: false as const, error: 'Entering return temperature (T_in) must exceed leaving supply temperature (T_out) for cooling mode.' };
    }
    if (cp <= 0 || cp > 15) {
      return { valid: false as const, error: 'Specific heat capacity cp must be between 0 and 15 kJ/(kg·K).' };
    }
    if (rho <= 0 || rho > 5) {
      return { valid: false as const, error: 'Fluid density ρ must be between 0 and 5 kg/L.' };
    }

    // 1 m³/h = 1000 L / 3600 s = (1 / 3.6) L/s
    const flowLs = flowUnit === 'L/s' ? flowRaw : flowRaw / 3.6;
    const deltaT = tIn - tOut;
    const massFlowKgS = flowLs * rho;
    const coolingKw = massFlowKgS * cp * deltaT;
    const refrigerationTons = coolingKw / KW_PER_RT;
    const flowPerTonLs = flowLs / refrigerationTons;

    return {
      valid: true as const,
      flowLs,
      deltaT,
      massFlowKgS,
      coolingKw,
      refrigerationTons,
      flowPerTonLs,
    };
  }, [flowStr, flowUnit, tempInStr, tempOutStr, cpStr, densityStr]);

  const handleExportCsv = () => {
    if (!calc.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit / Notes'],
      ['Volumetric Flow Input', flowStr.trim(), flowUnit],
      ['Equivalent Volumetric Flow (V_dot)', calc.flowLs.toFixed(3), 'L/s'],
      ['Entering Return Water Temp (T_in)', tempInStr.trim(), 'degC'],
      ['Leaving Supply Water Temp (T_out)', tempOutStr.trim(), 'degC'],
      ['Temperature Differential (Delta_T)', calc.deltaT.toFixed(2), 'K (degC)'],
      ['Fluid Specific Heat (cp)', cpStr.trim(), 'kJ/(kg*K)'],
      ['Fluid Density (rho)', densityStr.trim(), 'kg/L'],
      ['Mass Flow Rate (m_dot)', calc.massFlowKgS.toFixed(3), 'kg/s (V_dot [L/s] * rho [kg/L])'],
      ['Sensible Cooling Capacity (Q)', calc.coolingKw.toFixed(2), 'kW (m_dot * cp * Delta_T)'],
      ['Refrigeration Tonnage (RT)', calc.refrigerationTons.toFixed(2), 'RT (NIST SP 811: 1 RT = 3.516853 kW)'],
      ['Flow per Refrigeration Ton', calc.flowPerTonLs.toFixed(4), 'L/(s*RT)'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chiller-cooling-load-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Quick Hydronic Loop Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-testid={`preset-${preset.id}`}
              onClick={() => applyPreset(preset)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Hydronic Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="chiller-flow" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Volumetric Flow Rate
              </label>
              <select
                aria-label="Flow Rate Unit"
                data-testid="input-flow-unit"
                value={flowUnit}
                onChange={(e) => setFlowUnit(e.target.value as FlowUnit)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="L/s">L/s</option>
                <option value="m3/h">m³/h</option>
              </select>
            </div>
            <input
              id="chiller-flow"
              data-testid="input-flow"
              type="text"
              inputMode="decimal"
              value={flowStr}
              onChange={(e) => setFlowStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="chiller-tin" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Return T_in (°C)
              </label>
              <input
                id="chiller-tin"
                data-testid="input-temp-in"
                type="text"
                inputMode="decimal"
                value={tempInStr}
                onChange={(e) => setTempInStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="chiller-tout" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Supply T_out (°C)
              </label>
              <input
                id="chiller-tout"
                data-testid="input-temp-out"
                type="text"
                inputMode="decimal"
                value={tempOutStr}
                onChange={(e) => setTempOutStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="chiller-cp" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Fluid Specific Heat c_p (kJ/(kg·K))
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Editable typical value: pure water at 20°C is 4.184 kJ/(kg·K); adjust per glycol concentration.
            </p>
            <input
              id="chiller-cp"
              data-testid="input-cp"
              type="text"
              inputMode="decimal"
              value={cpStr}
              onChange={(e) => setCpStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="chiller-density" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Fluid Density ρ (kg/L)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Editable typical value: 1.000 kg/L (= 1000 kg/m³) for water; converts L/s to mass flow kg/s.
            </p>
            <input
              id="chiller-density"
              data-testid="input-density"
              type="text"
              inputMode="decimal"
              value={densityStr}
              onChange={(e) => setDensityStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Thermal Capacity & Tonnage</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!calc.valid}
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!calc.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{calc.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                  Sensible Cooling Capacity (Q)
                </div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-cooling-kw">{calc.valid ? calc.coolingKw.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-blue-600 ml-1.5">kW</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">
                  Refrigeration Tonnage (RT)
                </div>
                <div className="text-3xl font-black text-green-900">
                  <span data-testid="result-tonnage-rt">{calc.valid ? calc.refrigerationTons.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-green-600 ml-1.5">RT</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Mass Flow Rate (ṁ)
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-mass-flow">{calc.valid ? calc.massFlowKgS.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1.5">kg/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Temperature Differential (ΔT)
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-delta-t">{calc.valid ? calc.deltaT.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1.5">°C (K)</span>
                </div>
              </div>

              <div className="sm:col-span-2 bg-orange-50/70 rounded-2xl p-5 border border-orange-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-orange-600 uppercase tracking-wider">
                    Volumetric Flow per Refrigeration Ton
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Derived strictly as V̇ [L/s] ÷ RT = 3.516853 ÷ (ρ × c_p × ΔT)
                  </p>
                </div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-flow-per-ton">{calc.valid ? calc.flowPerTonLs.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-orange-700 ml-1.5">L/(s·RT)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-black text-slate-900">
                <Info className="w-4 h-4 text-green-600" />
                Unit Conversion & Thermodynamic Equations
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed font-medium text-slate-600">
                <li>
                  <strong className="text-slate-800">Volumetric to Mass Flow:</strong>{' '}
                  <code>V̇ [L/s] = V̇ [m³/h] ÷ 3.6</code>; <code>ṁ [kg/s] = V̇ [L/s] × ρ [kg/L]</code>.
                </li>
                <li>
                  <strong className="text-slate-800">Sensible Heat Balance:</strong>{' '}
                  <code>Q [kW] = ṁ [kg/s] × c_p [kJ/(kg·K)] × (T_in − T_out) [K]</code> (1 kJ/s = 1 kW).
                </li>
                <li>
                  <strong className="text-slate-800">Refrigeration Tonnage (NIST SP 811 Appendix B.9):</strong>{' '}
                  1 ton of refrigeration (12,000 Btu<sub>IT</sub>/h) = <code>3.516853 kW</code>;{' '}
                  <code>RT = Q [kW] ÷ 3.516853</code>.
                </li>
                <li>
                  <strong className="text-slate-800">Water Specific Heat Reference:</strong>{' '}
                  Pure liquid water at 20°C has <code>c_p = 4.184 kJ/(kg·K)</code> (4184 J/(kg·K)).
                </li>
              </ul>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
