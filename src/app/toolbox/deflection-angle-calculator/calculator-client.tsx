'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Ruler, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type LoadCaseId = 'ss-udl' | 'ss-point' | 'cant-point' | 'cant-udl';

const LOAD_CASES: { id: LoadCaseId; label: string; loadLabel: string; formulaNote: string }[] = [
  {
    id: 'ss-udl',
    label: 'Simply Supported — Uniform Load q',
    loadLabel: 'Distributed Load q (kN/m)',
    formulaNote: 'δ(x) = qx(L³ − 2Lx² + x³)/(24EI), θ(x) = q(L³ − 6Lx² + 4x³)/(24EI)',
  },
  {
    id: 'ss-point',
    label: 'Simply Supported — Midspan Point Load P',
    loadLabel: 'Midspan Point Load P (kN)',
    formulaNote: 'For x ≤ L/2: δ(x) = Px(3L² − 4x²)/(48EI), θ(x) = P(L² − 4x²)/(16EI)',
  },
  {
    id: 'cant-point',
    label: 'Cantilever — Free-End Point Load P (Fixed x=0)',
    loadLabel: 'Tip Load P (kN)',
    formulaNote: 'δ(x) = Px²(3L − x)/(6EI), θ(x) = Px(2L − x)/(2EI)',
  },
  {
    id: 'cant-udl',
    label: 'Cantilever — Uniform Load q (Fixed x=0)',
    loadLabel: 'Distributed Load q (kN/m)',
    formulaNote: 'δ(x) = qx²(6L² − 4Lx + x²)/(24EI), θ(x) = qx(3L² − 3Lx + x²)/(6EI)',
  },
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

function fmt(val: number, decimals = 6): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function DeflectionAngleCalculatorClient() {
  const [loadCase, setLoadCase] = useState<LoadCaseId>('ss-udl');
  const [loadStr, setLoadStr] = useState('10');
  const [spanStr, setSpanStr] = useState('5');
  const [posXStr, setPosXStr] = useState('1.25');
  const [modulusStr, setModulusStr] = useState('200');
  const [inertiaStr, setInertiaStr] = useState('5000');
  const [copied, setCopied] = useState(false);

  const activeCase = LOAD_CASES.find((c) => c.id === loadCase) ?? LOAD_CASES[0];

  const handleReset = () => {
    setLoadCase('ss-udl');
    setLoadStr('10');
    setSpanStr('5');
    setPosXStr('1.25');
    setModulusStr('200');
    setInertiaStr('5000');
    setCopied(false);
  };

  const result = useMemo(() => {
    const load = parsePositive(loadStr);
    const L = parsePositive(spanStr);
    const x = parseNonNegative(posXStr);
    const E_gpa = parsePositive(modulusStr);
    const I_cm4 = parsePositive(inertiaStr);

    if (
      !Number.isFinite(load) ||
      !Number.isFinite(L) ||
      !Number.isFinite(x) ||
      x > L ||
      !Number.isFinite(E_gpa) ||
      !Number.isFinite(I_cm4)
    ) {
      return { valid: false as const };
    }

    const E = E_gpa * 1e9; // Pa
    const I = I_cm4 * 1e-8; // m^4
    const EI = E * I; // N*m^2
    const wOrP = load * 1000; // N/m or N

    let slopeRad = 0;
    let deflM = 0;
    let maxSlopeRad = 0;
    let maxDeflM = 0;

    if (loadCase === 'ss-udl') {
      slopeRad = (wOrP * (L ** 3 - 6 * L * x * x + 4 * x ** 3)) / (24 * EI);
      deflM = (wOrP * x * (L ** 3 - 2 * L * x * x + x ** 3)) / (24 * EI);
      maxSlopeRad = (wOrP * L ** 3) / (24 * EI);
      maxDeflM = (5 * wOrP * L ** 4) / (384 * EI);
    } else if (loadCase === 'ss-point') {
      const xp = x <= L / 2 ? x : L - x;
      const sign = x <= L / 2 ? 1 : -1;
      slopeRad = sign * ((wOrP * (L * L - 4 * xp * xp)) / (16 * EI));
      deflM = (wOrP * xp * (3 * L * L - 4 * xp * xp)) / (48 * EI);
      maxSlopeRad = (wOrP * L * L) / (16 * EI);
      maxDeflM = (wOrP * L ** 3) / (48 * EI);
    } else if (loadCase === 'cant-point') {
      slopeRad = (wOrP * x * (2 * L - x)) / (2 * EI);
      deflM = (wOrP * x * x * (3 * L - x)) / (6 * EI);
      maxSlopeRad = (wOrP * L * L) / (2 * EI);
      maxDeflM = (wOrP * L ** 3) / (3 * EI);
    } else {
      slopeRad = (wOrP * x * (3 * L * L - 3 * L * x + x * x)) / (6 * EI);
      deflM = (wOrP * x * x * (6 * L * L - 4 * L * x + x * x)) / (24 * EI);
      maxSlopeRad = (wOrP * L ** 3) / (6 * EI);
      maxDeflM = (wOrP * L ** 4) / (8 * EI);
    }

    const slopeDeg = (slopeRad * 180) / Math.PI;
    const deflMm = deflM * 1000;
    const maxDeflMm = maxDeflM * 1000;
    const spanRatio = maxDeflM > 0 ? L / maxDeflM : Number.POSITIVE_INFINITY;

    return {
      valid: true as const,
      load,
      L,
      x,
      E_gpa,
      I_cm4,
      slopeRad,
      slopeDeg,
      deflMm,
      maxSlopeRad,
      maxDeflMm,
      spanRatio,
    };
  }, [loadCase, loadStr, spanStr, posXStr, modulusStr, inertiaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Beam Slope (${activeCase.id}) @ x=${result.x}m / L=${result.L}m: theta=${result.slopeRad.toFixed(6)} rad (${result.slopeDeg.toFixed(4)} deg), delta(x)=${result.deflMm.toFixed(3)} mm, max_delta=${result.maxDeflMm.toFixed(3)} mm`;
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
      ['load_case', activeCase.id, '-'],
      ['load_magnitude', String(result.load), loadCase.includes('point') ? 'kN' : 'kN/m'],
      ['span_L', String(result.L), 'm'],
      ['position_x', String(result.x), 'm'],
      ['modulus_E', String(result.E_gpa), 'GPa'],
      ['inertia_I', String(result.I_cm4), 'cm4'],
      ['slope_at_x', result.slopeRad.toFixed(6), 'rad'],
      ['slope_at_x_deg', result.slopeDeg.toFixed(4), 'deg'],
      ['deflection_at_x', result.deflMm.toFixed(3), 'mm'],
      ['max_slope', result.maxSlopeRad.toFixed(6), 'rad'],
      ['max_deflection', result.maxDeflMm.toFixed(3), 'mm'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beam_slope_deflection.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Euler–Bernoulli Beam Slope &amp; Deflection</h2>
            <p className="text-sm font-medium text-slate-500">
              Exact analytical first derivative dw/dx and elastic curve w(x) at any position x ∈ [0, L]
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
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor="beam-case" className="block text-sm font-black text-slate-700 mb-1.5">
              Support &amp; Loading Condition
            </label>
            <select
              id="beam-case"
              data-testid="select-load-case"
              value={loadCase}
              onChange={(e) => setLoadCase(e.target.value as LoadCaseId)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
            >
              {LOAD_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="beam-load" className="block text-xs font-black text-slate-700 mb-1">
                {activeCase.loadLabel}
              </label>
              <input
                id="beam-load"
                data-testid="input-load"
                type="text"
                inputMode="decimal"
                value={loadStr}
                onChange={(e) => setLoadStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="beam-L" className="block text-xs font-black text-slate-700 mb-1">Span L (m)</label>
              <input
                id="beam-L"
                data-testid="input-span"
                type="text"
                inputMode="decimal"
                value={spanStr}
                onChange={(e) => setSpanStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label htmlFor="beam-x" className="block text-xs font-black text-slate-700 mb-1">
              Evaluation Position x (m, 0 ≤ x ≤ L)
            </label>
            <input
              id="beam-x"
              data-testid="input-x"
              type="text"
              inputMode="decimal"
              value={posXStr}
              onChange={(e) => setPosXStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="beam-e" className="block text-xs font-black text-slate-700 mb-1">Elastic Modulus E (GPa)</label>
              <input
                id="beam-e"
                data-testid="input-modulus"
                type="text"
                inputMode="decimal"
                value={modulusStr}
                onChange={(e) => setModulusStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="beam-i" className="block text-xs font-black text-slate-700 mb-1">Moment of Inertia I (cm⁴)</label>
              <input
                id="beam-i"
                data-testid="input-inertia"
                type="text"
                inputMode="decimal"
                value={inertiaStr}
                onChange={(e) => setInertiaStr(e.target.value)}
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
                <span>Provide positive load, span, E, I, and position 0 ≤ x ≤ L.</span>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="text-xs font-black text-orange-800 uppercase tracking-wider mb-1">
                Beam Slope / Deflection Angle θ(x) at x = {posXStr || '—'} m
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-slope" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.slopeRad, 6) : '—'}
                </span>
                <span className="text-lg font-bold text-orange-700">rad</span>
              </div>
              <div data-testid="result-slope-deg" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.slopeDeg.toFixed(4)}° • End/Max Slope = ${result.maxSlopeRad.toFixed(6)} rad` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Deflection at x (δ_x)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-deflection-x" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.deflMm, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mm</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Maximum Deflection (δ_max)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-deflection-max" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.maxDeflMm, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mm</span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  {result.valid && Number.isFinite(result.spanRatio) ? `L / ${Math.round(result.spanRatio)}` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Governing Elastic Curve Equations:</strong>{' '}
                <code>{activeCase.formulaNote}</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
