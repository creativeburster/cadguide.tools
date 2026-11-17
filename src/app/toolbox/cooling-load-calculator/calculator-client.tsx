'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download } from 'lucide-react';

type FlowUnit = 'm3h' | 'ls' | 'm3s' | 'cfm';

// Exact 1 refrigeration ton = 3.5168528420667 kW (12,000 BTU_IT/hr)
const KW_PER_RT = 3.516852842;
// NIST SP 811 exact 1 ft3/min = (0.3048^3) / 60 m3/s
const CFM_TO_M3S = (0.3048 ** 3) / 60;

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

export default function CoolingLoadCalculatorClient() {
  const [airflowStr, setAirflowStr] = useState('2000');
  const [flowUnit, setFlowUnit] = useState<FlowUnit>('m3h');
  const [dTStr, setDTStr] = useState('10');
  const [dWStr, setDWStr] = useState('2');
  const [rhoStr, setRhoStr] = useState('1.202');
  const [cpStr, setCpStr] = useState('1.006');
  const [hweStr, setHweStr] = useState('2454');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setAirflowStr('2000');
    setFlowUnit('m3h');
    setDTStr('10');
    setDWStr('2');
    setRhoStr('1.202');
    setCpStr('1.006');
    setHweStr('2454');
    setCopied(false);
  };

  const result = useMemo(() => {
    const Q = parsePositive(airflowStr);
    const dT = parsePositive(dTStr);
    const dW = parseNonNegative(dWStr);
    const rho = parsePositive(rhoStr);
    const cp = parsePositive(cpStr);
    const hwe = parsePositive(hweStr);

    if (
      !Number.isFinite(Q) ||
      !Number.isFinite(dT) ||
      !Number.isFinite(dW) ||
      !Number.isFinite(rho) ||
      !Number.isFinite(cp) ||
      !Number.isFinite(hwe)
    ) {
      return { valid: false as const };
    }

    let flowM3s = Number.NaN;
    if (flowUnit === 'm3h') flowM3s = Q / 3600;
    else if (flowUnit === 'ls') flowM3s = Q / 1000;
    else if (flowUnit === 'm3s') flowM3s = Q;
    else flowM3s = Q * CFM_TO_M3S;

    const massFlowKgs = rho * flowM3s;
    const dwKgPerKg = dW / 1000;
    const sensibleKw = massFlowKgs * cp * dT;
    const latentKw = massFlowKgs * hwe * dwKgPerKg;
    const totalKw = sensibleKw + latentKw;
    const tons = totalKw / KW_PER_RT;
    const shrPct = totalKw > 0 ? (sensibleKw / totalKw) * 100 : Number.NaN;

    return {
      valid: true as const,
      flowM3s,
      massFlowKgs,
      sensibleKw,
      latentKw,
      totalKw,
      tons,
      shrPct,
      dT,
      dW,
    };
  }, [airflowStr, flowUnit, dTStr, dWStr, rhoStr, cpStr, hweStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Moist-Air Cooling Load Summary (q = ${result.flowM3s.toFixed(6)} m3/s, m_dot = ${result.massFlowKgs.toFixed(4)} kg/s)`,
      `Sensible Load Qs: ${result.sensibleKw.toFixed(4)} kW | Latent Load Ql: ${result.latentKw.toFixed(4)} kW`,
      `Total Cooling Load Qt: ${result.totalKw.toFixed(4)} kW (${result.tons.toFixed(4)} RT) | SHR: ${result.shrPct.toFixed(2)}%`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!result.valid) return;
    const rows = [
      'parameter,value,unit,notes',
      `volumetric_flow,${result.flowM3s.toFixed(6)},m3/s,Converted from ${airflowStr} ${flowUnit}`,
      `mass_flow,${result.massFlowKgs.toFixed(6)},kg/s,rho=${rhoStr} kg/m3`,
      `sensible_load,${result.sensibleKw.toFixed(4)},kW,m_dot * cp * dT (cp=${cpStr})`,
      `latent_load,${result.latentKw.toFixed(4)},kW,m_dot * hwe * dW_kg (hwe=${hweStr})`,
      `total_load,${result.totalKw.toFixed(4)},kW,Qs + Ql`,
      `refrigeration_tons,${result.tons.toFixed(4)},RT,1 RT = 3.516852842 kW`,
      `sensible_heat_ratio,${result.shrPct.toFixed(2)},pct,Qs / Qt * 100`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moist-air-cooling-load.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Airflow Rate Q</label>
              <input
                data-testid="input-airflow"
                type="text"
                inputMode="decimal"
                value={airflowStr}
                onChange={(e) => setAirflowStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Unit</label>
              <select
                data-testid="select-flow-unit"
                value={flowUnit}
                onChange={(e) => setFlowUnit(e.target.value as FlowUnit)}
                className="w-full h-11 px-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="m3h">m³/h</option>
                <option value="ls">L/s</option>
                <option value="m3s">m³/s</option>
                <option value="cfm">CFM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Temp Diff ΔT (°C)</label>
              <input
                data-testid="input-dt"
                type="text"
                inputMode="decimal"
                value={dTStr}
                onChange={(e) => setDTStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Humidity Δw (g/kg)</label>
              <input
                data-testid="input-dw"
                type="text"
                inputMode="decimal"
                value={dWStr}
                onChange={(e) => setDWStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">ρ (kg/m³)</label>
              <input
                data-testid="input-rho"
                type="text"
                inputMode="decimal"
                value={rhoStr}
                onChange={(e) => setRhoStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">cp (kJ/kg°C)</label>
              <input
                data-testid="input-cp"
                type="text"
                inputMode="decimal"
                value={cpStr}
                onChange={(e) => setCpStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">hwe (kJ/kg)</label>
              <input
                data-testid="input-hwe"
                type="text"
                inputMode="decimal"
                value={hweStr}
                onChange={(e) => setHweStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Cooling Load Outputs</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-green-700 text-white hover:bg-green-800 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Sensible Load (Qs)</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-sensible" className="text-3xl font-black text-blue-800">
                    {result.valid ? fmt(result.sensibleKw, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-blue-500">kW</span>
                </div>
                <div className="text-xs font-bold text-blue-600 mt-1">
                  {result.valid ? `SHR = ${result.shrPct.toFixed(1)}% • m_dot = ${result.massFlowKgs.toFixed(3)} kg/s` : '—'}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Latent Load (Ql)</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-latent" className="text-3xl font-black text-emerald-800">
                    {result.valid ? fmt(result.latentKw, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">kW</span>
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid ? `Flow q = ${result.flowM3s.toFixed(4)} m³/s` : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Total Cooling Load (Qt)</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-total" className="text-3xl font-black text-orange-800">
                    {result.valid ? fmt(result.totalKw, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-orange-500">kW</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Refrigeration Tonnage</div>
                <div className="flex items-baseline gap-2">
                  <span data-testid="result-tons" className="text-3xl font-black text-purple-800">
                    {result.valid ? fmt(result.tons, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-purple-500">RT</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Psychrometric Governing Equations:</strong> Volumetric flow <code>q</code> in <code>m³/s</code> gives sensible heat <code>hs = cp·ρ·q·ΔT</code> and moisture latent heat <code>hl = ρ·hwe·q·Δw_kg</code> (<code>ρ = 1.202 kg/m³</code>, <code>cp = 1.006 kJ/(kg·°C)</code>, <code>hwe = 2454 kJ/kg</code> at 20 °C; <code>1 RT = 3.51685 kW</code>).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
