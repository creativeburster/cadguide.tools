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
  { id: '10mm-l175', label: '1500x2400x10 mm (L/175)', w: '1500', h: '2400', q: '1.8', t: '10', e: '70000', nu: '0.22', div: '175', sAllow: '50' },
  { id: '12mm-l175', label: '1500x2400x12 mm (Passing L/175)', w: '1500', h: '2400', q: '1.8', t: '12', e: '70000', nu: '0.22', div: '175', sAllow: '50' },
  { id: 'square-8mm', label: '1200x1200x8 mm (L/60)', w: '1200', h: '1200', q: '1.5', t: '8', e: '70000', nu: '0.22', div: '60', sAllow: '50' },
];

export default function GlazingWindLoadCalculatorClient() {
  const [widthStr, setWidthStr] = useState('1500');
  const [heightStr, setHeightStr] = useState('2400');
  const [pressureStr, setPressureStr] = useState('1.8');
  const [thickStr, setThickStr] = useState('10');
  const [modulusStr, setModulusStr] = useState('70000');
  const [nuStr, setNuStr] = useState('0.22');
  const [divisorStr, setDivisorStr] = useState('175');
  const [sAllowStr, setSAllowStr] = useState('50');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setWidthStr(p.w);
    setHeightStr(p.h);
    setPressureStr(p.q);
    setThickStr(p.t);
    setModulusStr(p.e);
    setNuStr(p.nu);
    setDivisorStr(p.div);
    setSAllowStr(p.sAllow);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const w = parseStrictPositive(widthStr);
    const h = parseStrictPositive(heightStr);
    const qKpa = parseStrictPositive(pressureStr);
    const t = parseStrictPositive(thickStr);
    const E = parseStrictPositive(modulusStr);
    const nu = parseStrictNonNegative(nuStr);
    const div = parseStrictPositive(divisorStr);
    const sAllow = parseStrictPositive(sAllowStr);

    if (
      !Number.isFinite(w) ||
      !Number.isFinite(h) ||
      !Number.isFinite(qKpa) ||
      !Number.isFinite(t) ||
      !Number.isFinite(E) ||
      !Number.isFinite(nu) ||
      !Number.isFinite(div) ||
      !Number.isFinite(sAllow) ||
      nu >= 0.5
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive dimensions, wind pressure, thickness, elastic modulus, deflection divisor, allowable stress, and 0 <= Poisson ratio < 0.5.',
      };
    }

    const a = Math.min(w, h);
    const b = Math.max(w, h);
    const qMpa = qKpa / 1000;
    const D = (E * Math.pow(t, 3)) / (12 * (1 - nu * nu));

    let w0 = 0;
    let mx = 0;
    let my = 0;
    for (let m = 1; m <= 19; m += 2) {
      for (let n = 1; n <= 19; n += 2) {
        const term = Math.pow(m / a, 2) + Math.pow(n / b, 2);
        const amn = (16 * qMpa) / (Math.pow(Math.PI, 6) * D * m * n * term * term);
        const sign = Math.sin((m * Math.PI) / 2) * Math.sin((n * Math.PI) / 2);
        w0 += amn * sign;
        const kx = Math.pow((m * Math.PI) / a, 2);
        const ky = Math.pow((n * Math.PI) / b, 2);
        mx += D * (kx + nu * ky) * amn * sign;
        my += D * (ky + nu * kx) * amn * sign;
      }
    }

    const stressMax = (6 * Math.max(mx, my)) / (t * t);
    const wAllow = a / div;
    const deflPass = w0 <= wAllow;
    const stressPass = stressMax <= sAllow;
    const totalLoadKn = qKpa * (w / 1000) * (h / 1000);

    return {
      valid: true as const,
      w,
      h,
      a,
      b,
      qKpa,
      t,
      E,
      nu,
      div,
      sAllow,
      w0,
      stressMax,
      wAllow,
      deflPass,
      stressPass,
      totalLoadKn,
    };
  }, [widthStr, heightStr, pressureStr, thickStr, modulusStr, nuStr, divisorStr, sAllowStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Four-Side Simply Supported Plate Wind Load Summary (Navier Series m,n=1..19)`,
      `Panel=${result.w}x${result.h}x${result.t} mm, q=${result.qKpa} kPa, E=${result.E} MPa, nu=${result.nu}`,
      `Center Deflection w0 = ${result.w0.toFixed(2)} mm (Limit L/${result.div} = ${result.wAllow.toFixed(2)} mm: ${result.deflPass ? 'PASS' : 'EXCEEDS'})`,
      `Max Surface Bending Stress = ${result.stressMax.toFixed(2)} MPa (Allowable = ${result.sAllow} MPa: ${result.stressPass ? 'PASS' : 'EXCEEDS'})`,
      `Total Panel Wind Force = ${result.totalLoadKn.toFixed(2)} kN`,
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
      ['Panel Width W', String(result.w), 'mm'],
      ['Panel Height H', String(result.h), 'mm'],
      ['Design Wind Pressure q', String(result.qKpa), 'kPa'],
      ['Glass Thickness t', String(result.t), 'mm'],
      ['Elastic Modulus E', String(result.E), 'MPa'],
      ['Poisson Ratio nu', String(result.nu), '-'],
      ['Deflection Limit Divisor (a/div)', String(result.div), '-'],
      ['Allowable Bending Stress', String(result.sAllow), 'MPa'],
      ['Center Deflection w0 (Navier)', result.w0.toFixed(2), 'mm'],
      ['Max Bending Stress sigma_max', result.stressMax.toFixed(2), 'MPa'],
      ['Allowable Deflection w_allow', result.wAllow.toFixed(2), 'mm'],
      ['Total Wind Load on Panel', result.totalLoadKn.toFixed(2), 'kN'],
      ['Deflection Check', result.deflPass ? 'WITHIN LIMIT' : 'EXCEEDS LIMIT', '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glazing-wind-load-navier.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 hover:text-sky-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-divisor-175"
          onClick={() => setDivisorStr('175')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            divisorStr === '175' ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          L/175 Seal Limit
        </button>
        <button
          type="button"
          data-testid="btn-divisor-60"
          onClick={() => setDivisorStr('60')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            divisorStr === '60' ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          L/60 Visual Limit
        </button>
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Panel &amp; Load Inputs</h2>
          </div>

          {[
            { id: 'width', label: 'Panel Width W (mm)', val: widthStr, set: setWidthStr },
            { id: 'height', label: 'Panel Height H (mm)', val: heightStr, set: setHeightStr },
            { id: 'pressure', label: 'Uniform Wind Pressure q (kPa)', val: pressureStr, set: setPressureStr },
            { id: 'thickness', label: 'Monolithic Thickness t (mm)', val: thickStr, set: setThickStr },
            { id: 'modulus', label: 'Elastic Modulus E (MPa)', val: modulusStr, set: setModulusStr },
            { id: 'nu', label: 'Poisson Ratio nu (0 <= nu < 0.5)', val: nuStr, set: setNuStr },
            { id: 'divisor', label: 'Deflection Divisor (a / L_div)', val: divisorStr, set: setDivisorStr },
            { id: 'sallow', label: 'Allowable Surface Stress (MPa)', val: sAllowStr, set: setSAllowStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                inputMode="decimal"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
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
                <div>
                  <h2 className="text-lg font-black text-slate-900">Kirchhoff-Love Plate Response</h2>
                  <p className="text-xs font-bold text-slate-500">
                    Deflection Check:{' '}
                    <span
                      data-testid="result-defl-status"
                      className={result.valid ? (result.deflPass ? 'text-emerald-700' : 'text-red-700') : 'text-slate-500'}
                    >
                      {result.valid ? (result.deflPass ? 'WITHIN LIMIT' : 'DEFLECTION EXCEEDS LIMIT') : '—'}
                    </span>
                  </p>
                </div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
                <div className="text-xs font-black text-sky-700 uppercase tracking-wider mb-1">Center Deflection w0</div>
                <div className="text-3xl font-black text-sky-950">
                  <span data-testid="result-deflection">{result.valid ? result.w0.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-sky-600">mm</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Max Bending Stress sigma_max</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-stress">{result.valid ? result.stressMax.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">MPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Allowable Deflection (a / {result.valid ? result.div : '—'})
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-allowable">{result.valid ? result.wAllow.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Total Wind Load on Panel</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-load">{result.valid ? result.totalLoadKn.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">kN</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Analytical small-deflection solution for a 4-side simply supported linear-elastic rectangular plate (Navier double sine series odd harmonics m,n = 1..19). When central deflection w0 exceeds roughly half the plate thickness (w0 &gt; 0.5*t), geometric membrane stiffening reduces actual deflection relative to linear plate theory; verify laminated, heat-treated, and insulated glass units with jurisdiction glazing standards.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
