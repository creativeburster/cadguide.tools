'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Download, Info, RotateCcw } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface BasePlatePreset {
  id: string;
  label: string;
  pu: string;
  fc: string;
  fy: string;
  d: string;
  bf: string;
  B: string;
  N: string;
  a2: string;
  lambda: string;
  clearance: string;
}

const PRESETS: BasePlatePreset[] = [
  {
    id: 'default-w300',
    label: 'Default (Pu 1500 kN · 400×400 mm · A2=4A1)',
    pu: '1500',
    fc: '25',
    fy: '250',
    d: '300',
    bf: '300',
    B: '400',
    N: '400',
    a2: '640000',
    lambda: '1.0',
    clearance: '50',
  },
  {
    id: 'unconfined-pedestal',
    label: 'Unconfined Pedestal (A2 = A1)',
    pu: '900',
    fc: '25',
    fy: '250',
    d: '300',
    bf: '300',
    B: '400',
    N: '400',
    a2: '160000',
    lambda: '1.0',
    clearance: '50',
  },
  {
    id: 'calcsteel-w310',
    label: 'W310×97 Example (410×410 mm · λ=0.7)',
    pu: '1500',
    fc: '25',
    fy: '250',
    d: '308',
    bf: '305',
    B: '410',
    N: '410',
    a2: '672400',
    lambda: '0.7',
    clearance: '50',
  },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseNonNegative(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

export default function ColumnBasePlateCalculatorClient() {
  const [puStr, setPuStr] = useState('1500');
  const [fcStr, setFcStr] = useState('25');
  const [fyStr, setFyStr] = useState('250');
  const [dStr, setDStr] = useState('300');
  const [bfStr, setBfStr] = useState('300');
  const [bStr, setBStr] = useState('400');
  const [nStr, setNStr] = useState('400');
  const [a2Str, setA2Str] = useState('640000');
  const [lambdaStr, setLambdaStr] = useState('1.0');
  const [clearanceStr, setClearanceStr] = useState('50');

  const applyPreset = (p: BasePlatePreset) => {
    setPuStr(p.pu);
    setFcStr(p.fc);
    setFyStr(p.fy);
    setDStr(p.d);
    setBfStr(p.bf);
    setBStr(p.B);
    setNStr(p.N);
    setA2Str(p.a2);
    setLambdaStr(p.lambda);
    setClearanceStr(p.clearance);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const calc = useMemo(() => {
    const puKn = parsePositive(puStr, 1e6);
    const fc = parsePositive(fcStr, 200);
    const fy = parsePositive(fyStr, 1500);
    const d = parsePositive(dStr, 3000);
    const bf = parsePositive(bfStr, 3000);
    const B = parsePositive(bStr, 5000);
    const N = parsePositive(nStr, 5000);
    const a2 = parsePositive(a2Str, 1e9);
    const lambda = parsePositive(lambdaStr, 1.0);
    const clearance = parseNonNegative(clearanceStr, 500);

    if (
      puKn === null ||
      fc === null ||
      fy === null ||
      d === null ||
      bf === null ||
      B === null ||
      N === null ||
      a2 === null ||
      lambda === null ||
      clearance === null
    ) {
      return {
        valid: false as const,
        error: 'Enter positive finite numbers within engineering limits (λ in (0, 1.0], edge clearance ≥ 0 mm).',
      };
    }

    const a1 = B * N;
    if (a2 < a1) {
      return {
        valid: false as const,
        error: `Supporting concrete area A2 (${a2.toFixed(0)} mm²) must be ≥ base plate area A1 (${a1.toFixed(0)} mm²).`,
      };
    }

    const puN = puKn * 1000;
    const rawConf = Math.sqrt(a2 / a1);
    const confFactor = Math.min(rawConf, 2.0);
    const ppN = Math.min(0.85 * fc * a1 * confFactor, 1.7 * fc * a1);
    const phiPpKn = (0.65 * ppN) / 1000;
    const bearingRatio = puKn / phiPpKn;

    const fpu = puN / a1;
    const fpMax = 0.65 * Math.min(0.85 * fc * confFactor, 1.7 * fc);

    const m = Math.max(0, (N - 0.95 * d) / 2);
    const n = Math.max(0, (B - 0.80 * bf) / 2);
    const nPrime = Math.sqrt(d * bf) / 4;
    const lambdaNPrime = lambda * nPrime;
    const l = Math.max(m, n, lambdaNPrime);

    const tp = l * Math.sqrt((2 * puN) / (0.9 * fy * B * N));
    const loadRatioX = ((4 * d * bf) / ((d + bf) ** 2)) * (puKn / phiPpKn);

    const minBForClearance = bf + 2 * clearance;
    const minNForClearance = d + 2 * clearance;

    return {
      valid: true as const,
      puKn,
      puN,
      fc,
      fy,
      d,
      bf,
      B,
      N,
      a1,
      a2,
      lambda,
      clearance,
      confFactor,
      phiPpKn,
      bearingRatio,
      bearingOk: bearingRatio <= 1.0,
      fpu,
      fpMax,
      m,
      n,
      nPrime,
      lambdaNPrime,
      l,
      tp,
      loadRatioX,
      minBForClearance,
      minNForClearance,
    };
  }, [puStr, fcStr, fyStr, dStr, bfStr, bStr, nStr, a2Str, lambdaStr, clearanceStr]);

  const exportCsv = () => {
    if (!calc.valid) return;
    const rows = [
      'parameter,value,unit,standard_or_formula',
      `factored_load_Pu,${calc.puKn},kN,Pu_N = Pu_kN * 1000`,
      `concrete_strength_fc,${calc.fc},MPa,N/mm2`,
      `plate_yield_Fy,${calc.fy},MPa,N/mm2`,
      `column_depth_d,${calc.d},mm,Column profile depth`,
      `column_flange_bf,${calc.bf},mm,Column flange width`,
      `plate_width_B,${calc.B},mm,Base plate width`,
      `plate_length_N,${calc.N},mm,Base plate length`,
      `plate_area_A1,${calc.a1.toFixed(1)},mm2,A1 = B * N`,
      `support_area_A2,${calc.a2.toFixed(1)},mm2,Supporting concrete area (>= A1)`,
      `confinement_factor,${calc.confFactor.toFixed(3)},-,min(sqrt(A2/A1) 2.0) per AISC J8-2`,
      `design_bearing_capacity_phiPp,${calc.phiPpKn.toFixed(2)},kN,0.65 * min(0.85*fc*A1*sqrt(A2/A1) 1.7*fc*A1) / 1000`,
      `actual_bearing_pressure_fpu,${calc.fpu.toFixed(3)},MPa,Pu_N / A1`,
      `max_bearing_stress_fp_max,${calc.fpMax.toFixed(3)},MPa,0.65 * min(0.85*confFactor 1.7) * fc`,
      `cantilever_m,${calc.m.toFixed(2)},mm,(N - 0.95*d) / 2`,
      `cantilever_n,${calc.n.toFixed(2)},mm,(B - 0.80*bf) / 2`,
      `n_prime,${calc.nPrime.toFixed(2)},mm,sqrt(d * bf) / 4`,
      `lambda_factor,${calc.lambda},-,Editable (default 1.0 conservative; verify per project code / AISC DG1)`,
      `governing_cantilever_l,${calc.l.toFixed(2)},mm,max(m n lambda*n_prime)`,
      `required_thickness_tp,${calc.tp.toFixed(2)},mm,l * sqrt(2*Pu_N / (0.9 * Fy * B * N))`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'column-base-plate-aisc-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <span className="font-bold">Concentric compression LRFD check only (AISC 360 Eq. J8-2 &amp; AISC Design Guide 1):</span>{' '}
          Biaxial bending / uplift / anchor rod tension are not included here. Parameters such as <code>λ</code> and edge clearance are editable inputs — verify final geometry against your project structural code.
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-testid="reset-button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="bp-pu" className="block text-xs font-bold text-slate-700 mb-1.5">
              Factored Load Pu (kN, LRFD)
            </label>
            <input
              id="bp-pu"
              data-testid="input-pu"
              type="text"
              inputMode="decimal"
              value={puStr}
              onChange={(e) => setPuStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-fc" className="block text-xs font-bold text-slate-700 mb-1.5">
              Concrete f&apos;c (MPa)
            </label>
            <input
              id="bp-fc"
              data-testid="input-fc"
              type="text"
              inputMode="decimal"
              value={fcStr}
              onChange={(e) => setFcStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-fy" className="block text-xs font-bold text-slate-700 mb-1.5">
              Plate Yield Fy (MPa)
            </label>
            <input
              id="bp-fy"
              data-testid="input-fy"
              type="text"
              inputMode="decimal"
              value={fyStr}
              onChange={(e) => setFyStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-d" className="block text-xs font-bold text-slate-700 mb-1.5">
              Column Depth d (mm)
            </label>
            <input
              id="bp-d"
              data-testid="input-d"
              type="text"
              inputMode="decimal"
              value={dStr}
              onChange={(e) => setDStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-bf" className="block text-xs font-bold text-slate-700 mb-1.5">
              Column Flange bf (mm)
            </label>
            <input
              id="bp-bf"
              data-testid="input-bf"
              type="text"
              inputMode="decimal"
              value={bfStr}
              onChange={(e) => setBfStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-B" className="block text-xs font-bold text-slate-700 mb-1.5">
              Base Plate Width B (mm)
            </label>
            <input
              id="bp-B"
              data-testid="input-B"
              type="text"
              inputMode="decimal"
              value={bStr}
              onChange={(e) => setBStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-N" className="block text-xs font-bold text-slate-700 mb-1.5">
              Base Plate Length N (mm)
            </label>
            <input
              id="bp-N"
              data-testid="input-N"
              type="text"
              inputMode="decimal"
              value={nStr}
              onChange={(e) => setNStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-a2" className="block text-xs font-bold text-slate-700 mb-1.5">
              Support Concrete Area A2 (mm²)
            </label>
            <input
              id="bp-a2"
              data-testid="input-a2"
              type="text"
              inputMode="decimal"
              value={a2Str}
              onChange={(e) => setA2Str(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-lambda" className="block text-xs font-bold text-slate-700 mb-1.5">
              λ Factor (Editable — Per Project Spec)
            </label>
            <input
              id="bp-lambda"
              data-testid="input-lambda"
              type="text"
              inputMode="decimal"
              value={lambdaStr}
              onChange={(e) => setLambdaStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="bp-clearance" className="block text-xs font-bold text-slate-700 mb-1.5">
              Edge Clearance (mm — Per Project Spec)
            </label>
            <input
              id="bp-clearance"
              data-testid="input-clearance"
              type="text"
              inputMode="decimal"
              value={clearanceStr}
              onChange={(e) => setClearanceStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {!calc.valid && (
          <div data-testid="validation-error" className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {calc.error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-orange-600 text-white rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-100">
              Required Thickness tp
            </div>
            <div data-testid="result-tp" className="text-2xl font-black font-mono mt-1">
              {calc.valid ? `${calc.tp.toFixed(2)} mm` : '—'}
            </div>
            <div className="text-xs text-orange-100 mt-1">
              φb = 0.90 (AISC DG1 LRFD)
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
              Concrete Capacity φc Pp
            </div>
            <div data-testid="result-phi-pp" className="text-2xl font-black font-mono mt-1">
              {calc.valid ? `${calc.phiPpKn.toFixed(2)} kN` : '—'}
            </div>
            <div data-testid="result-bearing-status" className="text-xs text-slate-300 mt-1">
              {calc.valid
                ? `${(calc.bearingRatio * 100).toFixed(1)}% utilized (${calc.bearingOk ? 'OK' : 'EXCEEDS φc Pp'})`
                : '—'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Governing Cantilever l
            </div>
            <div data-testid="result-cantilever" className="text-2xl font-black font-mono text-slate-900 mt-1">
              {calc.valid ? `${calc.l.toFixed(2)} mm` : '—'}
            </div>
            <div data-testid="result-mn" className="text-xs text-slate-500 mt-1">
              {calc.valid
                ? `m=${calc.m.toFixed(2)} · n=${calc.n.toFixed(2)} · λn'=${calc.lambdaNPrime.toFixed(2)}`
                : '—'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bearing Pressure fpu
            </div>
            <div data-testid="result-fpu" className="text-2xl font-black font-mono text-slate-900 mt-1">
              {calc.valid ? `${calc.fpu.toFixed(3)} MPa` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {calc.valid
                ? `fp,max=${calc.fpMax.toFixed(3)} MPa · √(A2/A1)=${calc.confFactor.toFixed(3)}`
                : '—'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="export-csv"
            disabled={!calc.valid}
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV Calculation
          </button>

          {calc.valid && (
            <div className="text-xs font-mono text-slate-500">
              Clearance check: min B = {calc.minBForClearance.toFixed(0)} mm ({calc.B >= calc.minBForClearance ? 'OK' : 'Narrow'}), min N = {calc.minNForClearance.toFixed(0)} mm ({calc.N >= calc.minNForClearance ? 'OK' : 'Short'})
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-600" /> AISC 360 Eq. J8-2 &amp; Design Guide 1 Step-by-Step SI Conversions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="font-bold text-slate-900">1. Unit Conversions (kN, mm², MPa)</div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-slate-800">
              <div>Pu [N] = Pu [kN] × 1,000</div>
              <div>A1 [mm²] = B [mm] × N [mm]</div>
              <div>1 MPa = 1 N/mm², so MPa × mm² = N and (MPa × mm²) / 1,000 = kN</div>
              <div>φc Pp [N] = 0.65 × min(0.85·f&apos;c·A1·√(A2/A1), 1.7·f&apos;c·A1)</div>
              <div>fpu [MPa] = Pu [N] / (B × N [mm²])</div>
            </div>
            <p>
              Confinement factor <code>√(A2 / A1)</code> is capped at <code>2.0</code> (reached when supporting area <code>A2 ≥ 4·A1</code>).
            </p>
          </div>

          <div className="space-y-2.5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="font-bold text-slate-900">2. Plate Cantilever &amp; Thickness Formulas</div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-slate-800">
              <div>m [mm] = (N - 0.95·d) / 2</div>
              <div>n [mm] = (B - 0.80·bf) / 2</div>
              <div>n&apos; [mm] = √(d · bf) / 4</div>
              <div>l [mm] = max(m, n, λ·n&apos;)</div>
              <div>tp [mm] = l × √(2·Pu [N] / (0.90 · Fy [MPa] · B · N))</div>
            </div>
            <p className="text-xs text-slate-500">
              Note: Reference load ratio parameter X = (4·d·bf / (d + bf)²) × (Pu / φc Pp) ≈{' '}
              {calc.valid ? calc.loadRatioX.toFixed(3) : '—'}. Default λ = 1.0 gives a conservative upper bound when λ is not reduced; adjust λ and edge clearance per your project structural specification.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
