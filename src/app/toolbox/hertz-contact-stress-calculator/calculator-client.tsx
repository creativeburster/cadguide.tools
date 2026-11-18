'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parsePoisson(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n >= 0 && n < 0.5 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'internal-steel', label: 'Steel Roller vs Concave Bore (R1=20, R2=-30 mm)', f: '1000', l: '10', r1: '20', r2: '-30', e1: '200', e2: '200', nu1: '0.30', nu2: '0.30' },
  { id: 'external-rollers', label: 'Two External Steel Rollers (R1=25, R2=25 mm)', f: '2000', l: '15', r1: '25', r2: '25', e1: '207', e2: '207', nu1: '0.30', nu2: '0.30' },
  { id: 'steel-flat', label: 'Steel Roller on Flat Aluminum (R1=15 mm, R2=1e9)', f: '800', l: '12', r1: '15', r2: '1000000', e1: '200', e2: '69', nu1: '0.30', nu2: '0.33' },
];

export default function HertzContactStressCalculatorClient() {
  const [fStr, setFStr] = useState('1000');
  const [lStr, setLStr] = useState('10');
  const [r1Str, setR1Str] = useState('20');
  const [r2Str, setR2Str] = useState('-30');
  const [e1Str, setE1Str] = useState('200');
  const [e2Str, setE2Str] = useState('200');
  const [nu1Str, setNu1Str] = useState('0.30');
  const [nu2Str, setNu2Str] = useState('0.30');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setFStr(p.f);
    setLStr(p.l);
    setR1Str(p.r1);
    setR2Str(p.r2);
    setE1Str(p.e1);
    setE2Str(p.e2);
    setNu1Str(p.nu1);
    setNu2Str(p.nu2);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const F = parseStrictPositive(fStr);
    const Lmm = parseStrictPositive(lStr);
    const R1mm = parseStrictPositive(r1Str);
    const R2mm = parseStrictFinite(r2Str);
    const E1Gpa = parseStrictPositive(e1Str);
    const E2Gpa = parseStrictPositive(e2Str);
    const nu1 = parsePoisson(nu1Str);
    const nu2 = parsePoisson(nu2Str);

    if (
      !Number.isFinite(F) ||
      !Number.isFinite(Lmm) ||
      !Number.isFinite(R1mm) ||
      !Number.isFinite(R2mm) ||
      R2mm === 0 ||
      !Number.isFinite(E1Gpa) ||
      !Number.isFinite(E2Gpa) ||
      !Number.isFinite(nu1) ||
      !Number.isFinite(nu2)
    ) {
      return {
        valid: false as const,
        errorMsg:
          'Enter valid positive Force, Length, R1, E1, E2, nonzero R2 (negative for concave cylinder), and Poisson ratio 0 <= nu < 0.5.',
      };
    }

    const Lm = Lmm / 1000;
    const R1m = R1mm / 1000;
    const R2m = R2mm / 1000;
    const invReq = 1 / R1m + 1 / R2m;
    if (invReq <= 0) {
      return {
        valid: false as const,
        errorMsg: 'Effective curvature (1/R1 + 1/R2) must be positive (convex cylinder cannot exceed concave bore radius).',
      };
    }

    const ReqM = 1 / invReq;
    const E1Pa = E1Gpa * 1e9;
    const E2Pa = E2Gpa * 1e9;
    const invEstar = (1 - nu1 * nu1) / E1Pa + (1 - nu2 * nu2) / E2Pa;
    const EstarPa = 1 / invEstar;

    // Parallel cylinders line contact: b = sqrt(4*F*R*/(pi*L*E*)), p_max = 2*F/(pi*b*L)
    const bM = Math.sqrt((4 * F * ReqM) / (Math.PI * Lm * EstarPa));
    const pmaxPa = (2 * F) / (Math.PI * bM * Lm);

    return {
      valid: true as const,
      F,
      Lmm,
      R1mm,
      R2mm,
      E1Gpa,
      E2Gpa,
      nu1,
      nu2,
      ReqMm: ReqM * 1000,
      EstarGpa: EstarPa / 1e9,
      bMm: bM * 1000,
      widthMm: bM * 2000,
      pmaxMpa: pmaxPa / 1e6,
    };
  }, [fStr, lStr, r1Str, r2Str, e1Str, e2Str, nu1Str, nu2Str]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Hertzian Parallel-Cylinder Line Contact Summary`,
      `F=${result.F} N, L=${result.Lmm} mm, R1=${result.R1mm} mm, R2=${result.R2mm} mm`,
      `Composite Modulus E* = ${result.EstarGpa.toFixed(3)} GPa | Equivalent Radius R* = ${result.ReqMm.toFixed(3)} mm`,
      `Max Contact Pressure p_max = ${result.pmaxMpa.toFixed(2)} MPa`,
      `Half-Width b = ${result.bMm.toFixed(4)} mm (Total Width 2b = ${result.widthMm.toFixed(4)} mm)`,
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
      ['Normal Load F', String(result.F), 'N'],
      ['Contact Length L', String(result.Lmm), 'mm'],
      ['Radius R1', String(result.R1mm), 'mm'],
      ['Radius R2', String(result.R2mm), 'mm'],
      ['Modulus E1', String(result.E1Gpa), 'GPa'],
      ['Modulus E2', String(result.E2Gpa), 'GPa'],
      ['Poisson Ratio nu1', String(result.nu1), '-'],
      ['Poisson Ratio nu2', String(result.nu2), '-'],
      ['Equivalent Radius R*', result.ReqMm.toFixed(4), 'mm'],
      ['Composite Modulus E*', result.EstarGpa.toFixed(4), 'GPa'],
      ['Half Contact Width b', result.bMm.toFixed(6), 'mm'],
      ['Total Contact Width 2b', result.widthMm.toFixed(6), 'mm'],
      ['Max Hertz Contact Pressure p_max', result.pmaxMpa.toFixed(4), 'MPa'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hertz-line-contact.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Normal Force F (N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-force"
                value={fStr}
                onChange={(e) => setFStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Contact Length L (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-length"
                value={lStr}
                onChange={(e) => setLStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Radius R1 (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-r1"
                value={r1Str}
                onChange={(e) => setR1Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Radius R2 (mm, - concave)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-r2"
                value={r2Str}
                onChange={(e) => setR2Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Modulus E1 (GPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-e1"
                value={e1Str}
                onChange={(e) => setE1Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Modulus E2 (GPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-e2"
                value={e2Str}
                onChange={(e) => setE2Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Poisson Ratio nu1</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-nu1"
                value={nu1Str}
                onChange={(e) => setNu1Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Poisson Ratio nu2</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-nu2"
                value={nu2Str}
                onChange={(e) => setNu2Str(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parallel Cylinder Line Contact Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {!result.valid && (
              <div
                data-testid="validation-error"
                className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Max Contact Pressure p_max</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-pmax">{result.valid ? result.pmaxMpa.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">MPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Half Contact Width b</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-b">{result.valid ? result.bMm.toFixed(4) : '—'}</span>
                  <span className="text-base font-bold text-emerald-600 ml-1.5">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Total Contact Width 2b</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-width">{result.valid ? result.widthMm.toFixed(4) : '—'}</span>
                  <span className="text-base font-bold text-orange-500 ml-1.5">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Composite Modulus E*</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-estar">{result.valid ? result.EstarGpa.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-slate-500 ml-1.5">GPa</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  1/E* = (1 - nu1^2)/E1 + (1 - nu2^2)/E2 · 1/R* = 1/R1 + 1/R2 · b = sqrt(4 * F * R* / (pi * L * E*)) · p_max = 2 * F / (pi * b * L)
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
