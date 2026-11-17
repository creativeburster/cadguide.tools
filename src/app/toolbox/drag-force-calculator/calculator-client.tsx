'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Wind, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Exact conversion factors: 1 mph = 0.44704 m/s (0.3048 * 5280 / 3600), 1 hp = 745.69987158 W
const MPH_TO_MS = 0.44704;
const W_PER_HP = 550 * 0.3048 * 4.4482216152605;

const FLUID_PRESETS = [
  { label: 'Air Sea Level (1.225)', rho: '1.225' },
  { label: 'Fresh Water (998.2)', rho: '998.2' },
  { label: 'Seawater (1025)', rho: '1025' },
];

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

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function DragForceCalculatorClient() {
  const [rhoStr, setRhoStr] = useState('1.225');
  const [velStr, setVelStr] = useState('30');
  const [velUnit, setVelUnit] = useState<'m/s' | 'km/h' | 'mph'>('m/s');
  const [cdStr, setCdStr] = useState('0.3');
  const [areaStr, setAreaStr] = useState('2.2');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setRhoStr('1.225');
    setVelStr('30');
    setVelUnit('m/s');
    setCdStr('0.3');
    setAreaStr('2.2');
    setCopied(false);
  };

  const result = useMemo(() => {
    const rho = parsePositive(rhoStr);
    const rawU = parseNonNegative(velStr);
    const Cd = parsePositive(cdStr);
    const A = parsePositive(areaStr);

    if (!Number.isFinite(rho) || !Number.isFinite(rawU) || !Number.isFinite(Cd) || !Number.isFinite(A)) {
      return { valid: false as const };
    }

    const uMs = velUnit === 'm/s' ? rawU : velUnit === 'km/h' ? rawU / 3.6 : rawU * MPH_TO_MS;
    const dynamicPressurePa = 0.5 * rho * uMs * uMs;
    const dragForceN = dynamicPressurePa * Cd * A;
    const dragPowerKw = (dragForceN * uMs) / 1000;
    const dragPowerHp = (dragForceN * uMs) / W_PER_HP;

    return {
      valid: true as const,
      rho,
      uMs,
      Cd,
      A,
      dynamicPressurePa,
      dragForceN,
      dragPowerKw,
      dragPowerHp,
    };
  }, [rhoStr, velStr, velUnit, cdStr, areaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Drag Equation: rho=${result.rho} kg/m3, u=${result.uMs.toFixed(2)} m/s, Cd=${result.Cd}, A=${result.A} m2 -> q=${result.dynamicPressurePa.toFixed(2)} Pa, Fd=${result.dragForceN.toFixed(2)} N, Drag Power=${result.dragPowerKw.toFixed(3)} kW (${result.dragPowerHp.toFixed(2)} hp)`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['fluid_density', String(result.rho), 'kg/m3'],
      ['flow_velocity', result.uMs.toFixed(4), 'm/s'],
      ['drag_coefficient', String(result.Cd), '-'],
      ['reference_area', String(result.A), 'm2'],
      ['dynamic_pressure', result.dynamicPressurePa.toFixed(2), 'Pa'],
      ['drag_force', result.dragForceN.toFixed(3), 'N'],
      ['drag_power_kw', result.dragPowerKw.toFixed(4), 'kW'],
      ['drag_power_hp', result.dragPowerHp.toFixed(3), 'hp'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drag_force_calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Aerodynamic &amp; Hydrodynamic Drag Force</h2>
            <p className="text-sm font-medium text-slate-500">
              Quadratic drag equation F_d = ½ · ρ · u² · c_d · A with dynamic pressure &amp; propulsive power
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor="drag-rho" className="block text-sm font-black text-slate-700 mb-1.5">
              Fluid Mass Density ρ (kg/m³)
            </label>
            <input
              id="drag-rho"
              data-testid="input-density"
              type="text"
              inputMode="decimal"
              value={rhoStr}
              onChange={(e) => setRhoStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {FLUID_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setRhoStr(p.rho)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="drag-u" className="text-sm font-black text-slate-700">
                Relative Flow Velocity u
              </label>
              <div className="flex gap-1">
                {(['m/s', 'km/h', 'mph'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`vel-unit-${u}`}
                    onClick={() => setVelUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      velUnit === u ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="drag-u"
              data-testid="input-velocity"
              type="text"
              inputMode="decimal"
              value={velStr}
              onChange={(e) => setVelStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="drag-cd" className="block text-sm font-black text-slate-700 mb-1.5">Drag Coeff c_d</label>
              <input
                id="drag-cd"
                data-testid="input-cd"
                type="text"
                inputMode="decimal"
                value={cdStr}
                onChange={(e) => setCdStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="drag-area" className="block text-sm font-black text-slate-700 mb-1.5">Ref. Area A (m²)</label>
              <input
                id="drag-area"
                data-testid="input-area"
                type="text"
                inputMode="decimal"
                value={areaStr}
                onChange={(e) => setAreaStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Fluid density, drag coefficient, and area must be positive; velocity must be non-negative.</span>
              </div>
            )}

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
              <div className="text-xs font-black text-teal-800 uppercase tracking-wider mb-1">
                Aerodynamic / Hydrodynamic Drag Force (F_d)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-drag-force" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.dragForceN, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-teal-700">N</span>
              </div>
              <div data-testid="result-drag-power-sub" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.dragPowerKw.toFixed(3)} kW (${result.dragPowerHp.toFixed(2)} hp)` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Drag Power (F_d · u)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-drag-power" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.dragPowerKw, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kW</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Dynamic Pressure (q = ½ρu²)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-dynamic-pressure" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.dynamicPressurePa, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Pa</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Drag Equation:</strong>{' '}
                <code>F_d = ½ · ρ · u² · c_d · A</code>, dynamic pressure <code>q = ½ · ρ · u²</code>, and propulsive drag power <code>P_d = F_d · u</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
