'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

type FuelType = 'gas' | 'oil' | 'coal';

interface Preset {
  label: string;
  flow: string;
  hSteam: string;
  hFeed: string;
  qIn: string;
  fuelType: FuelType;
}

const FUEL_LHV_MAP: Record<FuelType, { label: string; lhv: number; unit: string }> = {
  gas: { label: 'Natural Gas (LHV = 35 MJ/m³)', lhv: 35, unit: 'm³/h' },
  oil: { label: 'Fuel Oil (LHV = 42 MJ/kg)', lhv: 42, unit: 'kg/h' },
  coal: { label: 'Bituminous Coal (LHV = 28 MJ/kg)', lhv: 28, unit: 'kg/h' },
};

const PRESETS: Preset[] = [
  {
    label: 'Natural Gas 5 t/h Steam',
    flow: '5000',
    hSteam: '2700',
    hFeed: '500',
    qIn: '3500',
    fuelType: 'gas',
  },
  {
    label: 'Fuel Oil 10 t/h Steam',
    flow: '10000',
    hSteam: '2750',
    hFeed: '450',
    qIn: '7500',
    fuelType: 'oil',
  },
  {
    label: 'Coal Fired 20 t/h Steam',
    flow: '20000',
    hSteam: '2800',
    hFeed: '420',
    qIn: '16000',
    fuelType: 'coal',
  },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits: number): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BoilerEfficiencyCalculatorClient() {
  const [flowStr, setFlowStr] = useState('5000');
  const [h1Str, setH1Str] = useState('2700');
  const [h2Str, setH2Str] = useState('500');
  const [qInStr, setQInStr] = useState('3500');
  const [fuelType, setFuelType] = useState<FuelType>('gas');

  const fuelMeta = FUEL_LHV_MAP[fuelType];

  const result = useMemo(() => {
    const flowKgH = parseNum(flowStr);
    const h1 = parseNum(h1Str);
    const h2 = parseNum(h2Str);
    const qIn = parseNum(qInStr);

    if (
      !Number.isFinite(flowKgH) ||
      !Number.isFinite(h1) ||
      !Number.isFinite(h2) ||
      !Number.isFinite(qIn) ||
      flowKgH <= 0 ||
      h2 < 0 ||
      h1 <= h2 ||
      qIn <= 0
    ) {
      return { Qo: NaN, eff: NaN, fuel: NaN };
    }

    // Q_out (kW) = (m_s [kg/h] / 3600 [s/h]) * (h_1 - h_2) [kJ/kg]
    const msKgS = flowKgH / 3600;
    const Qo = msKgS * (h1 - h2);
    const eff = (Qo / qIn) * 100;

    // Unit conversion: Q_in [kW = kJ/s] * 3.6 = MJ/h; divided by LHV [MJ/unit] yields m³/h or kg/h
    const fuel = (qIn * 3.6) / fuelMeta.lhv;

    return { Qo, eff, fuel };
  }, [flowStr, h1Str, h2Str, qInStr, fuelMeta.lhv]);

  const applyPreset = (p: Preset) => {
    setFlowStr(p.flow);
    setH1Str(p.hSteam);
    setH2Str(p.hFeed);
    setQInStr(p.qIn);
    setFuelType(p.fuelType);
  };

  const handleReset = () => {
    setFlowStr('5000');
    setH1Str('2700');
    setH2Str('500');
    setQInStr('3500');
    setFuelType('gas');
  };

  const exportCsv = () => {
    const formulaComment =
      '# Direct Boiler Efficiency: Q_out = (m_steam / 3600) * (h_steam - h_feedwater) | eta_th = (Q_out / Q_in) * 100 | Fuel = Q_in × 3.6 / LHV';
    const headers = [
      'Steam_Flow_kg_h',
      'Steam_Enthalpy_kJ_kg',
      'Feedwater_Enthalpy_kJ_kg',
      'Fuel_Input_kW',
      'Fuel_Type',
      'Boiler_Output_kW',
      'Efficiency_pct',
      'Fuel_Consumption',
    ];
    const row = [
      flowStr.trim(),
      h1Str.trim(),
      h2Str.trim(),
      qInStr.trim(),
      fuelType,
      formatFixed(result.Qo, 2),
      formatFixed(result.eff, 3),
      formatFixed(result.fuel, 2),
    ];
    const csvContent = `${formulaComment}\n${headers.join(',')}\n${row.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boiler-efficiency.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Boiler Plant Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${i}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="boiler-flow-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Steam Flow (kg/h)
            </label>
            <input
              id="boiler-flow-input"
              data-testid="input-steam-flow"
              type="text"
              value={flowStr}
              onChange={(e) => setFlowStr(e.target.value)}
              placeholder="5000"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="boiler-h1-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Steam Enthalpy (kJ/kg)
            </label>
            <input
              id="boiler-h1-input"
              data-testid="input-steam-enthalpy"
              type="text"
              value={h1Str}
              onChange={(e) => setH1Str(e.target.value)}
              placeholder="2700"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="boiler-h2-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Feedwater Enthalpy (kJ/kg)
            </label>
            <input
              id="boiler-h2-input"
              data-testid="input-feedwater-enthalpy"
              type="text"
              value={h2Str}
              onChange={(e) => setH2Str(e.target.value)}
              placeholder="500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="boiler-qin-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Fuel Input (kW)
            </label>
            <input
              id="boiler-qin-input"
              data-testid="input-fuel-input"
              type="text"
              value={qInStr}
              onChange={(e) => setQInStr(e.target.value)}
              placeholder="3500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="boiler-fuel-select"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Fuel Type
            </label>
            <select
              id="boiler-fuel-select"
              data-testid="select-fuel-type"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            >
              <option value="gas">Natural Gas</option>
              <option value="oil">Fuel Oil</option>
              <option value="coal">Coal</option>
            </select>
          </div>

          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Results (Direct / Input-Output Method)
                </h2>
              </div>

              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-400 uppercase tracking-wider mb-2">
                  Boiler Output
                </div>
                <div data-testid="result-output" className="text-3xl font-black text-blue-700">
                  {formatFixed(result.Qo, 2)}
                  <span className="text-lg text-blue-400"> kW</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-sm font-black text-green-400 uppercase tracking-wider mb-2">
                  Efficiency
                </div>
                <div data-testid="result-efficiency" className="text-3xl font-black text-green-700">
                  {formatFixed(result.eff, 3)}
                  <span className="text-lg text-green-400"> %</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-400 uppercase tracking-wider mb-2">
                  Fuel Consumption
                </div>
                <div data-testid="result-fuel" className="text-3xl font-black text-orange-700">
                  {formatFixed(result.fuel, 2)}
                  <span className="text-lg text-orange-400"> {fuelMeta.unit}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Direct Thermal Efficiency Definition:{' '}
                  <code>Q_out = (m_steam / 3600) × (h_steam - h_feedwater)</code>,{' '}
                  <code>η_th = (Q_out / Q_in) × 100%</code>,{' '}
                  <code>Fuel = Q_in × 3.6 / LHV</code>. Nominal fuel consumption uses{' '}
                  {fuelMeta.label} (Typical value; verify with fuel supplier data / 典型值，请以燃料供应商数据为准).
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
