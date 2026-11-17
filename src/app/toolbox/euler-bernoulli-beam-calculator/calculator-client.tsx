'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default (P=20 kN, a=2 m, L=6 m, x=3 m)', p: '20', a: '2', l: '6', e: '200', i: '5000', x: '3' },
  { id: 'midspan', label: 'Symmetric Midspan (P=20 kN, a=3 m)', p: '20', a: '3', l: '6', e: '200', i: '5000', x: '3' },
  { id: 'stiff-beam', label: 'Heavier Section (P=40 kN, I=12000 cm4)', p: '40', a: '2.5', l: '8', e: '210', i: '12000', x: '4' },
];

export default function EulerBernoulliBeamCalculatorClient() {
  const [pStr, setPStr] = useState('20');
  const [aStr, setAStr] = useState('2');
  const [lStr, setLStr] = useState('6');
  const [eStr, setEStr] = useState('200');
  const [iStr, setIStr] = useState('5000');
  const [xStr, setXStr] = useState('3');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPStr(p.p);
    setAStr(p.a);
    setLStr(p.l);
    setEStr(p.e);
    setIStr(p.i);
    setXStr(p.x);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const P_kN = parseStrictPositive(pStr);
    const a = parseStrictPositive(aStr);
    const L = parseStrictPositive(lStr);
    const E_GPa = parseStrictPositive(eStr);
    const I_cm4 = parseStrictPositive(iStr);
    const x = parseStrictNonNegative(xStr);

    if (
      !Number.isFinite(P_kN) ||
      !Number.isFinite(a) ||
      !Number.isFinite(L) ||
      !Number.isFinite(E_GPa) ||
      !Number.isFinite(I_cm4) ||
      !Number.isFinite(x)
    ) {
      return { valid: false as const, errorMsg: 'Enter valid positive numbers for P, a, L, E, I and x >= 0.' };
    }
    if (a >= L) {
      return { valid: false as const, errorMsg: 'Load position a must be strictly less than span L (0 < a < L).' };
    }
    if (x > L) {
      return { valid: false as const, errorMsg: 'Evaluation position x must satisfy 0 <= x <= L.' };
    }

    const P = P_kN * 1000; // N
    const E = E_GPa * 1e9; // Pa
    const I = I_cm4 * 1e-8; // m^4
    const EI = E * I;
    const b = L - a;

    // Support reactions (kN) and bending moments (kN*m)
    const rA = (P_kN * b) / L;
    const rB = (P_kN * a) / L;
    const mMax = (P_kN * a * b) / L;
    const mAtX = x <= a ? rA * x : rB * (L - x);

    // Downward deflection positive (mm) and exact section slope dy/dx (rad)
    let yMm = 0;
    let thetaRad = 0;
    if (x <= a) {
      yMm = ((P * b * x * (L * L - b * b - x * x)) / (6 * L * EI)) * 1000;
      thetaRad = (P * b * (L * L - b * b - 3 * x * x)) / (6 * L * EI);
    } else {
      const xRev = L - x;
      yMm = ((P * a * xRev * (L * L - a * a - xRev * xRev)) / (6 * L * EI)) * 1000;
      thetaRad = -(P * a * (L * L - a * a - 3 * xRev * xRev)) / (6 * L * EI);
    }

    // Exact maximum deflection magnitude and location
    const lMaxSide = Math.max(a, b);
    const lShort = Math.min(a, b);
    const xMaxFromLeft = a >= b ? Math.sqrt((L * L - b * b) / 3) : L - Math.sqrt((L * L - a * a) / 3);
    const yMaxMm =
      ((P * lShort * Math.pow(L * L - lShort * lShort, 1.5)) / (9 * Math.sqrt(3) * L * EI)) * 1000;

    return {
      valid: true as const,
      P_kN,
      a,
      b,
      L,
      E_GPa,
      I_cm4,
      x,
      lMaxSide,
      xMaxFromLeft,
      yMm,
      yMaxMm,
      thetaRad,
      rA,
      rB,
      mMax,
      mAtX,
    };
  }, [pStr, aStr, lStr, eStr, iStr, xStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Euler-Bernoulli Simply Supported Beam (Point Load)`,
      `P=${result.P_kN} kN at a=${result.a} m on L=${result.L} m (E=${result.E_GPa} GPa, I=${result.I_cm4} cm4)`,
      `Deflection y(${result.x} m) = ${result.yMm.toFixed(4)} mm`,
      `Max Deflection ymax = ${result.yMaxMm.toFixed(4)} mm at x = ${result.xMaxFromLeft.toFixed(3)} m`,
      `Slope dy/dx(${result.x} m) = ${result.thetaRad.toFixed(6)} rad`,
      `Reactions: RA=${result.rA.toFixed(3)} kN, RB=${result.rB.toFixed(3)} kN, Mmax=${result.mMax.toFixed(3)} kN*m`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
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
      ['Parameter', 'Value', 'Unit'],
      ['Point Load P', String(result.P_kN), 'kN'],
      ['Load Position a', String(result.a), 'm'],
      ['Span L', String(result.L), 'm'],
      ['Young Modulus E', String(result.E_GPa), 'GPa'],
      ['Second Moment I', String(result.I_cm4), 'cm4'],
      ['Evaluation Position x', String(result.x), 'm'],
      ['Deflection at x', result.yMm.toFixed(4), 'mm'],
      ['Max Deflection', result.yMaxMm.toFixed(4), 'mm'],
      ['Slope dy/dx at x', result.thetaRad.toFixed(6), 'rad'],
      ['Left Reaction RA', result.rA.toFixed(3), 'kN'],
      ['Right Reaction RB', result.rB.toFixed(3), 'kN'],
      ['Max Bending Moment', result.mMax.toFixed(3), 'kN*m'],
      ['Bending Moment at x', result.mAtX.toFixed(3), 'kN*m'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'euler-bernoulli-beam.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'p', label: 'Point Load P (kN)', val: pStr, set: setPStr },
            { id: 'a', label: 'Load Position a (m)', val: aStr, set: setAStr },
            { id: 'l', label: 'Beam Span L (m)', val: lStr, set: setLStr },
            { id: 'e', label: 'Young Modulus E (GPa)', val: eStr, set: setEStr },
            { id: 'i', label: 'Second Moment I (cm4)', val: iStr, set: setIStr },
            { id: 'x', label: 'Eval Position x (m)', val: xStr, set: setXStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Deflection y(x)</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-deflection">{result.valid ? result.yMm.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Max Deflection</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-ymax">{result.valid ? result.yMaxMm.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Slope dy/dx at x</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-slope">{result.valid ? result.thetaRad.toFixed(6) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">rad</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Left Reaction RA</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-ra">{result.valid ? result.rA.toFixed(3) : '—'}</span> kN
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Right Reaction RB</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-rb">{result.valid ? result.rB.toFixed(3) : '—'}</span> kN
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Max Moment Mmax</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-mmax">{result.valid ? result.mMax.toFixed(3) : '—'}</span> kN·m
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 font-bold">Moment at x</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  <span data-testid="result-mx">{result.valid ? result.mAtX.toFixed(3) : '—'}</span> kN·m
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Euler-Bernoulli small-deflection theory for a simply supported prismatic beam with point load P at a: y(x) = P*b*x*(L^2 - b^2 - x^2)/(6*L*E*I) for x &lt;= a; theta(x) = dy/dx. Shear deformation neglected.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
