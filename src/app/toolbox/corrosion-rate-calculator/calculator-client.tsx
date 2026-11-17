'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { ShieldAlert, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// ASTM G1 constants for mass loss W (g), area A (cm^2), time T (h), density D (g/cm^3)
const ASTM_K_MM_YR = 8.76e4;
const ASTM_K_MPY = 3.45e6;
const HOURS_PER_DAY = 24;
const HOURS_PER_YEAR = 8760;

const DENSITY_PRESETS = [
  { label: 'Carbon Steel', val: '7.85' },
  { label: 'Carbon Steel (ASTM G1 Ex.)', val: '7.86' },
  { label: '304 Stainless', val: '7.93' },
  { label: 'Aluminum 6061', val: '2.70' },
  { label: 'Copper', val: '8.96' },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 6): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CorrosionRateCalculatorClient() {
  const [massLossStr, setMassLossStr] = useState('0.5');
  const [massUnit, setMassUnit] = useState<'g' | 'mg'>('g');
  const [densityStr, setDensityStr] = useState('7.85');
  const [areaStr, setAreaStr] = useState('20');
  const [timeStr, setTimeStr] = useState('365');
  const [timeUnit, setTimeUnit] = useState<'days' | 'hours'>('days');
  const [allowanceStr, setAllowanceStr] = useState('1.5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: 'default' | 'astm-g1') => {
    setCopied(false);
    if (preset === 'default') {
      setMassLossStr('0.5');
      setMassUnit('g');
      setDensityStr('7.85');
      setAreaStr('20');
      setTimeStr('365');
      setTimeUnit('days');
      setAllowanceStr('1.5');
    } else {
      // Worked example from ASTM G1 / ScientificConverters: 25 mg, 20 cm2, 720 h, 7.86 g/cm3
      setMassLossStr('25');
      setMassUnit('mg');
      setDensityStr('7.86');
      setAreaStr('20');
      setTimeStr('720');
      setTimeUnit('hours');
      setAllowanceStr('1.5');
    }
  };

  const handleReset = () => applyPreset('default');

  const result = useMemo(() => {
    const rawW = parsePositive(massLossStr);
    const D = parsePositive(densityStr);
    const A = parsePositive(areaStr);
    const rawT = parsePositive(timeStr);
    const allow = parsePositive(allowanceStr);

    if (
      !Number.isFinite(rawW) ||
      !Number.isFinite(D) ||
      !Number.isFinite(A) ||
      !Number.isFinite(rawT) ||
      !Number.isFinite(allow)
    ) {
      return { valid: false as const };
    }

    const W_g = massUnit === 'g' ? rawW : rawW / 1000;
    const T_h = timeUnit === 'hours' ? rawT : rawT * HOURS_PER_DAY;
    const T_days = T_h / HOURS_PER_DAY;

    // CR = (K * W) / (A * T_h * D)
    const crMmYr = (ASTM_K_MM_YR * W_g) / (A * T_h * D);
    const crUmYr = crMmYr * 1000;
    const crMpy = (ASTM_K_MPY * W_g) / (A * T_h * D);

    // Direct mass-loss penetration thickness during test exposure (cm * 10 = mm)
    const penetrationMm = (W_g / (D * A)) * 10;
    const serviceLifeYr = allow / crMmYr;

    let severity = 'Low / Acceptable';
    let badgeTone = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (crMmYr >= 1.0) {
      severity = 'Severe (> 1.0 mm/yr)';
      badgeTone = 'bg-rose-100 text-rose-800 border-rose-200';
    } else if (crMmYr >= 0.1) {
      severity = 'Moderate (0.1–1.0 mm/yr)';
      badgeTone = 'bg-amber-100 text-amber-800 border-amber-200';
    }

    return {
      valid: true as const,
      W_g,
      T_h,
      T_days,
      D,
      A,
      allow,
      crMmYr,
      crUmYr,
      crMpy,
      penetrationMm,
      serviceLifeYr,
      severity,
      badgeTone,
    };
  }, [massLossStr, massUnit, densityStr, areaStr, timeStr, timeUnit, allowanceStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `ASTM G1 Corrosion Rate: ${result.crMmYr.toFixed(6)} mm/yr (${result.crMpy.toFixed(4)} mpy) | Penetration=${result.penetrationMm.toFixed(6)} mm over ${result.T_h.toFixed(1)} h | Est. Life (${result.allow} mm allow.)=${result.serviceLifeYr.toFixed(2)} yr`;
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
      ['mass_loss', result.W_g.toFixed(6), 'g'],
      ['density', result.D.toFixed(4), 'g/cm3'],
      ['exposed_area', result.A.toFixed(4), 'cm2'],
      ['exposure_time', result.T_h.toFixed(2), 'hours'],
      ['corrosion_rate_mm_yr', result.crMmYr.toFixed(6), 'mm/yr'],
      ['corrosion_rate_um_yr', result.crUmYr.toFixed(4), 'um/yr'],
      ['corrosion_rate_mpy', result.crMpy.toFixed(6), 'mpy'],
      ['exposure_penetration', result.penetrationMm.toFixed(6), 'mm'],
      ['corrosion_allowance', result.allow.toFixed(3), 'mm'],
      ['remaining_life', result.serviceLifeYr.toFixed(2), 'years'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corrosion_rate_astm_g1.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Mass-Loss Corrosion Rate (ASTM G1)</h2>
            <p className="text-sm font-medium text-slate-500">
              Uniform corrosion rate in mm/yr, µm/yr, and mpy with exposure-hour unit normalization
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-astm-g1"
            onClick={() => applyPreset('astm-g1')}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-black border border-orange-200 transition-colors cursor-pointer"
          >
            ASTM G1 Coupon Example (25 mg, 720 h)
          </button>
          <button
            type="button"
            data-testid="reset-button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="corr-mass" className="text-sm font-black text-slate-700">
                Mass Loss W
              </label>
              <div className="flex gap-1">
                {(['g', 'mg'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`mass-unit-${u}`}
                    onClick={() => setMassUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      massUnit === u ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="corr-mass"
              data-testid="input-mass-loss"
              type="text"
              inputMode="decimal"
              value={massLossStr}
              onChange={(e) => setMassLossStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="corr-density" className="block text-sm font-black text-slate-700 mb-1.5">
              Alloy Density D (g/cm³)
            </label>
            <input
              id="corr-density"
              data-testid="input-density"
              type="text"
              inputMode="decimal"
              value={densityStr}
              onChange={(e) => setDensityStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {DENSITY_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setDensityStr(p.val)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  {p.label} ({p.val})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="corr-area" className="block text-sm font-black text-slate-700 mb-1.5">
              Exposed Area A (cm²)
            </label>
            <input
              id="corr-area"
              data-testid="input-area"
              type="text"
              inputMode="decimal"
              value={areaStr}
              onChange={(e) => setAreaStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="corr-time" className="text-sm font-black text-slate-700">
                Exposure Time T
              </label>
              <div className="flex gap-1">
                {(['days', 'hours'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`time-unit-${u}`}
                    onClick={() => setTimeUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      timeUnit === u ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="corr-time"
              data-testid="input-time"
              type="text"
              inputMode="decimal"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {result.valid && (
              <div className="text-xs font-semibold text-slate-500 mt-1">
                Equivalent exposure: {result.T_h.toFixed(1)} h ({result.T_days.toFixed(2)} days)
              </div>
            )}
          </div>

          <div>
            <label htmlFor="corr-allow" className="block text-sm font-black text-slate-700 mb-1.5">
              Corrosion Allowance (mm, editable)
            </label>
            <input
              id="corr-allow"
              data-testid="input-allowance"
              type="text"
              inputMode="decimal"
              value={allowanceStr}
              onChange={(e) => setAllowanceStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black transition-colors cursor-pointer"
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
                <span>All mass loss, density, area, exposure time, and allowance values must be positive numbers.</span>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="text-xs font-black text-orange-800 uppercase tracking-wider">
                  Annual Corrosion Rate
                </div>
                {result.valid && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${result.badgeTone}`}>
                    {result.severity}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-cr-mm" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.crMmYr, 6) : '—'}
                </span>
                <span className="text-lg font-bold text-orange-700">mm/yr</span>
              </div>
              <div data-testid="result-cr-um" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.crUmYr.toFixed(2)} µm/yr • ${result.crMpy.toFixed(4)} mpy` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Imperial Rate (mpy)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-cr-mpy" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.crMpy, 4) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mil/yr</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Test Penetration</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-penetration" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.penetrationMm, 6) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mm</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Remaining Life Estimate</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-life" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.serviceLifeYr, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">yr</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>ASTM G1 Uniform Mass-Loss Formula:</strong>{' '}
                <code>CR = (K × W) / (A × T_h × D)</code> where <code>W</code> is in grams, <code>A</code> in cm², <code>T_h</code> in hours (1 day = {HOURS_PER_DAY} h, 1 yr = {HOURS_PER_YEAR} h), and <code>D</code> in g/cm³, with <code>K = 8.76 × 10⁴</code> for mm/yr and <code>K = 3.45 × 10⁶</code> for mpy.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
