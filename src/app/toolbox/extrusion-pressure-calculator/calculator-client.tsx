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
  { id: 'default', label: 'Default (D0=100, Df=30, Yf=150)', d0: '100', df: '30', lb: '200', yf: '150', mu: '0.10', a: '0.8', b: '1.2' },
  { id: 'aluminum-rod', label: 'Aluminum Alloy (D0=150, Df=25, Yf=90)', d0: '150', df: '25', lb: '300', yf: '90', mu: '0.08', a: '0.8', b: '1.2' },
  { id: 'frictionless', label: 'Ideal Limit (mu=0, a=0, b=1)', d0: '100', df: '30', lb: '200', yf: '150', mu: '0', a: '0', b: '1' },
];

export default function ExtrusionPressureCalculatorClient() {
  const [d0Str, setD0Str] = useState('100');
  const [dfStr, setDfStr] = useState('30');
  const [lbStr, setLbStr] = useState('200');
  const [yfStr, setYfStr] = useState('150');
  const [muStr, setMuStr] = useState('0.10');
  const [aStr, setAStr] = useState('0.8');
  const [bStr, setBStr] = useState('1.2');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setD0Str(p.d0);
    setDfStr(p.df);
    setLbStr(p.lb);
    setYfStr(p.yf);
    setMuStr(p.mu);
    setAStr(p.a);
    setBStr(p.b);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const D0 = parseStrictPositive(d0Str);
    const Df = parseStrictPositive(dfStr);
    const Lb = parseStrictNonNegative(lbStr);
    const Yf = parseStrictPositive(yfStr);
    const mu = parseStrictNonNegative(muStr);
    const ja = parseStrictNonNegative(aStr);
    const jb = parseStrictPositive(bStr);

    if (
      !Number.isFinite(D0) ||
      !Number.isFinite(Df) ||
      !Number.isFinite(Lb) ||
      !Number.isFinite(Yf) ||
      !Number.isFinite(mu) ||
      !Number.isFinite(ja) ||
      !Number.isFinite(jb)
    ) {
      return { valid: false as const, errorMsg: 'Enter valid positive numbers for diameters, flow stress, and coefficient b; non-negative values for length, friction, and coefficient a.' };
    }
    if (Df >= D0) {
      return { valid: false as const, errorMsg: 'Extrudate diameter Df must be strictly smaller than billet diameter D0 (R > 1).' };
    }

    const extrusionRatio = Math.pow(D0 / Df, 2);
    const trueStrain = Math.log(extrusionRatio);
    const idealPressure = Yf * trueStrain;
    const frictionTerm = (2 * mu * Lb) / D0;
    const totalPressure = Yf * (ja + jb * trueStrain + frictionTerm);
    const billetAreaMm2 = (Math.PI * D0 * D0) / 4;
    const forceKN = (totalPressure * billetAreaMm2) / 1000;

    return {
      valid: true as const,
      D0,
      Df,
      Lb,
      Yf,
      mu,
      ja,
      jb,
      extrusionRatio,
      trueStrain,
      idealPressure,
      totalPressure,
      forceKN,
      billetAreaMm2,
    };
  }, [d0Str, dfStr, lbStr, yfStr, muStr, aStr, bStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Direct Extrusion Pressure & Force Summary`,
      `D0=${result.D0} mm -> Df=${result.Df} mm (R=${result.extrusionRatio.toFixed(4)}, eps=${result.trueStrain.toFixed(4)})`,
      `Ideal Pressure: ${result.idealPressure.toFixed(2)} MPa`,
      `Total Pressure: ${result.totalPressure.toFixed(2)} MPa`,
      `Ram Force: ${result.forceKN.toFixed(2)} kN`,
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
      ['Billet Diameter D0', String(result.D0), 'mm'],
      ['Extrudate Diameter Df', String(result.Df), 'mm'],
      ['Billet Contact Length Lb', String(result.Lb), 'mm'],
      ['Mean Flow Stress Yf', String(result.Yf), 'MPa'],
      ['Container Friction Coefficient mu', String(result.mu), '-'],
      ['Empirical Constant a', String(result.ja), '-'],
      ['Redundant Work Factor b', String(result.jb), '-'],
      ['Extrusion Ratio R', result.extrusionRatio.toFixed(4), '-'],
      ['True Strain ln(R)', result.trueStrain.toFixed(4), '-'],
      ['Ideal Homogeneous Pressure', result.idealPressure.toFixed(2), 'MPa'],
      ['Total Extrusion Pressure', result.totalPressure.toFixed(2), 'MPa'],
      ['Total Ram Force', result.forceKN.toFixed(2), 'kN'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extrusion-pressure-force.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-700 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'd0', label: 'Billet Diameter D0 (mm)', val: d0Str, set: setD0Str },
            { id: 'df', label: 'Extrudate Diameter Df (mm)', val: dfStr, set: setDfStr },
            { id: 'lb', label: 'Billet Length Lb (mm)', val: lbStr, set: setLbStr },
            { id: 'yf', label: 'Mean Flow Stress Yf (MPa)', val: yfStr, set: setYfStr },
            { id: 'mu', label: 'Container Friction mu', val: muStr, set: setMuStr },
            { id: 'a', label: 'Johnson Constant a', val: aStr, set: setAStr },
            { id: 'b', label: 'Johnson Factor b', val: bStr, set: setBStr },
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Total Extrusion Pressure</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-total-pressure">
                    {result.valid ? result.totalPressure.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-base text-blue-500">MPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Total Ram Force</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-force">{result.valid ? result.forceKN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">kN</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Ideal Pressure (mu=0)</div>
                <div className="text-2xl font-black text-purple-900">
                  <span data-testid="result-ideal-pressure">
                    {result.valid ? result.idealPressure.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-sm text-purple-500">MPa</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Extrusion Ratio R</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-ratio">
                    {result.valid ? result.extrusionRatio.toFixed(4) : '—'}
                  </span>{' '}
                  <span className="text-xs text-slate-500">(ln R = <span data-testid="result-strain">{result.valid ? result.trueStrain.toFixed(4) : '—'}</span>)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Direct extrusion equation: R = (D0/Df)^2, p_ideal = Yf * ln(R), p_ext = Yf * (a + b*ln(R) + 2*mu*Lb/D0), F = p_ext * (pi*D0^2/4). Empirical constants a and b are editable parameters; verify press tonnage against tooling friction tests.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
