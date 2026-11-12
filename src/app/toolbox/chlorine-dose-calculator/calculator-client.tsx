'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw, AlertTriangle } from 'lucide-react';

type FlowUnit = 'm3/d' | 'm3/h';

interface ChlorinePreset {
  id: string;
  label: string;
  flow: string;
  unit: FlowUnit;
  demand: string;
  residual: string;
  availClPct: string;
  sg: string;
  contactMin: string;
}

const PRESETS: ChlorinePreset[] = [
  {
    id: 'municipal-2400m3d',
    label: 'Municipal Clearwell (2,400 m³/d, 12.5% NaOCl)',
    flow: '2400',
    unit: 'm3/d',
    demand: '1.8',
    residual: '0.6',
    availClPct: '12.5',
    sg: '1.18',
    contactMin: '30',
  },
  {
    id: 'skid-120m3h',
    label: 'Package Plant (120 m³/h, 10% NaOCl)',
    flow: '120',
    unit: 'm3/h',
    demand: '1.8',
    residual: '0.6',
    availClPct: '10',
    sg: '1.15',
    contactMin: '20',
  },
  {
    id: 'small-well-500m3d',
    label: 'Small Well System (500 m³/d, 5.25% Bleach)',
    flow: '500',
    unit: 'm3/d',
    demand: '1.0',
    residual: '0.5',
    availClPct: '5.25',
    sg: '1.08',
    contactMin: '45',
  },
  {
    id: 'gas-10000m3d',
    label: 'Chlorine Gas Feed (10,000 m³/d, 100% Cl₂)',
    flow: '10000',
    unit: 'm3/d',
    demand: '2.0',
    residual: '0.8',
    availClPct: '100',
    sg: '1.00',
    contactMin: '60',
  },
];

const TYPICAL_STRENGTHS = [
  { label: '12.5% Industrial NaOCl', pct: '12.5', sg: '1.18' },
  { label: '10% Commercial NaOCl', pct: '10', sg: '1.15' },
  { label: '5.25% Household Bleach', pct: '5.25', sg: '1.08' },
  { label: '100% Pure Cl₂ Gas', pct: '100', sg: '1.00' },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

export default function CalculatorClient() {
  const [flowStr, setFlowStr] = useState('2400');
  const [flowUnit, setFlowUnit] = useState<FlowUnit>('m3/d');
  const [demandStr, setDemandStr] = useState('1.8');
  const [residualStr, setResidualStr] = useState('0.6');
  const [availClPctStr, setAvailClPctStr] = useState('12.5');
  const [sgStr, setSgStr] = useState('1.18');
  const [contactMinStr, setContactMinStr] = useState('30');

  const applyPreset = (p: ChlorinePreset) => {
    setFlowStr(p.flow);
    setFlowUnit(p.unit);
    setDemandStr(p.demand);
    setResidualStr(p.residual);
    setAvailClPctStr(p.availClPct);
    setSgStr(p.sg);
    setContactMinStr(p.contactMin);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const calc = useMemo(() => {
    const flowRaw = parseStrictNumber(flowStr);
    const demand = parseStrictNumber(demandStr);
    const residual = parseStrictNumber(residualStr);
    const availPct = parseStrictNumber(availClPctStr);
    const sg = parseStrictNumber(sgStr);
    const contactMin = parseStrictNumber(contactMinStr);

    if (
      !Number.isFinite(flowRaw) ||
      !Number.isFinite(demand) ||
      !Number.isFinite(residual) ||
      !Number.isFinite(availPct) ||
      !Number.isFinite(sg) ||
      !Number.isFinite(contactMin)
    ) {
      return { valid: false as const, error: 'Enter valid finite numbers in all dosing and contact time fields.' };
    }

    if (flowRaw <= 0 || flowRaw > 10_000_000) {
      return { valid: false as const, error: 'Water flow rate must be greater than 0 and at most 10,000,000.' };
    }
    if (demand < 0 || demand > 500) {
      return { valid: false as const, error: 'Chlorine demand must be between 0 and 500 mg/L.' };
    }
    if (residual < 0 || residual > 500) {
      return { valid: false as const, error: 'Target free chlorine residual must be between 0 and 500 mg/L.' };
    }
    const totalDoseMgL = demand + residual;
    if (totalDoseMgL <= 0) {
      return { valid: false as const, error: 'Total chlorine dose (Demand + Residual) must be greater than 0 mg/L.' };
    }
    if (availPct <= 0 || availPct > 100) {
      return { valid: false as const, error: 'Available chlorine mass fraction must be greater than 0% and at most 100%.' };
    }
    if (sg <= 0 || sg > 3) {
      return { valid: false as const, error: 'Solution specific gravity (SG) must be greater than 0 and at most 3.0.' };
    }
    if (contactMin <= 0 || contactMin > 10000) {
      return { valid: false as const, error: 'Disinfection contact time T must be between 0 (exclusive) and 10,000 minutes.' };
    }

    const qDay = flowUnit === 'm3/d' ? flowRaw : flowRaw * 24;
    const qHr = qDay / 24;

    // 1 mg/L = 1 g/m³ = 0.001 kg/m³ -> M [kg/d] = Q [m³/d] * C_dose [mg/L] / 1000
    const pureCl2KgDay = (qDay * totalDoseMgL) / 1000;
    const pureCl2KgHr = pureCl2KgDay / 24;

    // Active Cl2 per liter of solution [kg/L] = SG [kg_sol/L] * (availPct / 100) [kg_Cl2/kg_sol]
    const activeCl2KgPerL = sg * (availPct / 100);
    const solutionLDay = pureCl2KgDay / activeCl2KgPerL;
    const solutionLHr = solutionLDay / 24;

    // US EPA Surface Water Treatment Rule (SWTR): CT [mg*min/L] = C_residual [mg/L] * T [min]
    const ctValue = residual * contactMin;
    const meetsPoeMinResidual = residual >= 0.2;

    return {
      valid: true as const,
      qDay,
      qHr,
      totalDoseMgL,
      pureCl2KgDay,
      pureCl2KgHr,
      solutionLDay,
      solutionLHr,
      ctValue,
      meetsPoeMinResidual,
    };
  }, [flowStr, flowUnit, demandStr, residualStr, availClPctStr, sgStr, contactMinStr]);

  const handleExportCsv = () => {
    if (!calc.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit / Notes'],
      ['Water Flow Input', flowStr.trim(), flowUnit],
      ['Daily Water Flow (Q_day)', calc.qDay.toFixed(1), 'm3/d'],
      ['Hourly Water Flow (Q_hr)', calc.qHr.toFixed(2), 'm3/h'],
      ['Chlorine Demand (C_demand)', demandStr.trim(), 'mg/L'],
      ['Target Free Chlorine Residual (C_residual)', residualStr.trim(), 'mg/L'],
      ['Total Chlorine Dose (C_dose)', calc.totalDoseMgL.toFixed(2), 'mg/L (C_demand + C_residual)'],
      ['Available Chlorine Mass Percent (w_avail)', availClPctStr.trim(), '% wt/wt (typical editable input)'],
      ['Solution Specific Gravity (SG)', sgStr.trim(), 'kg/L (typical editable input)'],
      ['Disinfection Contact Time (T)', contactMinStr.trim(), 'min'],
      ['Daily Pure Chlorine Mass (M_Cl2)', calc.pureCl2KgDay.toFixed(3), 'kg/d (Q_day * C_dose / 1000)'],
      ['Hourly Pure Chlorine Feed Rate', calc.pureCl2KgHr.toFixed(3), 'kg/h (M_Cl2 / 24)'],
      ['Daily Solution Volume (V_sol,day)', calc.solutionLDay.toFixed(2), 'L/d (M_Cl2 / [SG * w_avail/100])'],
      ['Solution Metering Pump Rate (V_sol,hr)', calc.solutionLHr.toFixed(2), 'L/h'],
      ['Disinfection CT Value', calc.ctValue.toFixed(2), 'mg*min/L (US EPA SWTR: C_residual * T)'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chlorine-dose-ct-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Water Disinfection Scenarios
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors cursor-pointer"
            >
              {p.label}
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
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Dosing Inputs</h2>
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
              <label htmlFor="cl-flow" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Treated Water Flow (Q)
              </label>
              <select
                aria-label="Water Flow Unit"
                data-testid="input-flow-unit"
                value={flowUnit}
                onChange={(e) => setFlowUnit(e.target.value as FlowUnit)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="m3/d">m³/d</option>
                <option value="m3/h">m³/h</option>
              </select>
            </div>
            <input
              id="cl-flow"
              data-testid="input-flow"
              type="text"
              inputMode="decimal"
              value={flowStr}
              onChange={(e) => setFlowStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cl-demand" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Cl₂ Demand (mg/L)
              </label>
              <input
                id="cl-demand"
                data-testid="input-demand"
                type="text"
                inputMode="decimal"
                value={demandStr}
                onChange={(e) => setDemandStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="cl-residual" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Free Residual C (mg/L)
              </label>
              <input
                id="cl-residual"
                data-testid="input-residual"
                type="text"
                inputMode="decimal"
                value={residualStr}
                onChange={(e) => setResidualStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cl-strength" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Available Chlorine Strength (% wt/wt)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Editable typical strength (click a quick-fill button below or type exact supplier assay %):
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TYPICAL_STRENGTHS.map((item) => (
                <button
                  key={item.pct}
                  type="button"
                  data-testid={`strength-chip-${item.pct}`}
                  onClick={() => {
                    setAvailClPctStr(item.pct);
                    setSgStr(item.sg);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input
              id="cl-strength"
              data-testid="input-strength"
              type="text"
              inputMode="decimal"
              value={availClPctStr}
              onChange={(e) => setAvailClPctStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cl-sg" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Solution SG (kg/L)
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Typical SDS value</p>
              <input
                id="cl-sg"
                data-testid="input-sg"
                type="text"
                inputMode="decimal"
                value={sgStr}
                onChange={(e) => setSgStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label htmlFor="cl-contact" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Contact Time T (min)
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">Baffled detention time</p>
              <input
                id="cl-contact"
                data-testid="input-contact-time"
                type="text"
                inputMode="decimal"
                value={contactMinStr}
                onChange={(e) => setContactMinStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Mass Feed Rate & Disinfection CT</h2>
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
                  Daily Pure Chlorine Mass (M_Cl₂)
                </div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-cl2-day">{calc.valid ? calc.pureCl2KgDay.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-blue-600 ml-1.5">kg/d</span>
                </div>
                <div className="text-xs font-bold text-blue-700/80 mt-2">
                  Hourly feed:{' '}
                  <span data-testid="result-cl2-hr">{calc.valid ? calc.pureCl2KgHr.toFixed(3) : '—'}</span> kg/h
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">
                  Disinfection CT Value (C × T)
                </div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-ct-value">{calc.valid ? calc.ctValue.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-orange-600 ml-1.5">mg·min/L</span>
                </div>
                <div className="text-xs font-bold text-orange-800/80 mt-2" data-testid="result-poe-check">
                  {calc.valid
                    ? calc.meetsPoeMinResidual
                      ? 'Meets EPA SWTR ≥ 0.2 mg/L POE minimum free residual'
                      : 'Below EPA SWTR 0.2 mg/L POE minimum free residual'
                    : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Total Applied Dose (C_dose)
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-total-dose">{calc.valid ? calc.totalDoseMgL.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1.5">mg/L</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Solution Metering Pump Rate
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-solution-hr">{calc.valid ? calc.solutionLHr.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1.5">L/h</span>
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  Daily volume:{' '}
                  <span data-testid="result-solution-day">{calc.valid ? calc.solutionLDay.toFixed(2) : '—'}</span> L/d
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-black text-slate-900">
                <Info className="w-4 h-4 text-orange-600" />
                Mass-Balance Dosing & US EPA SWTR CT Equations
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed font-medium text-slate-600">
                <li>
                  <strong className="text-slate-800">Applied Dose Concentration:</strong>{' '}
                  <code>C_dose [mg/L] = C_demand [mg/L] + C_residual [mg/L]</code>.
                </li>
                <li>
                  <strong className="text-slate-800">Pure Chlorine Mass Feed (mg/L × m³/d → kg/d):</strong>{' '}
                  Since <code>1 mg/L = 1 g/m³ = 0.001 kg/m³</code>,{' '}
                  <code>M_Cl2 [kg/d] = Q [m³/d] × C_dose [mg/L] ÷ 1000</code>, and{' '}
                  <code>ṁ_Cl2 [kg/h] = M_Cl2 ÷ 24</code>.
                </li>
                <li>
                  <strong className="text-slate-800">Sodium Hypochlorite Solution Volume:</strong>{' '}
                  <code>V_sol [L/d] = M_Cl2 [kg/d] ÷ (SG [kg/L] × w_avail / 100)</code>. Sodium hypochlorite degrades
                  with storage time and heat; verify actual available chlorine % and specific gravity from your chemical
                  supplier&apos;s certificate of analysis.
                </li>
                <li>
                  <strong className="text-slate-800">Disinfection CT Product (US EPA SWTR):</strong>{' '}
                  <code>CT [mg·min/L] = C_residual [mg/L] × T [min]</code>. Under the US EPA Surface Water Treatment Rule,
                  disinfectant residual at the point of entry (POE) to the distribution system cannot be less than{' '}
                  <code>0.2 mg/L</code> for more than 4 hours; compare your calculated CT against your jurisdiction&apos;s
                  pH- and temperature-specific Giardia/virus log-inactivation tables.
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
