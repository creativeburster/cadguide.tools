'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Zap,
  Info,
  RotateCcw,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface SectionPreset {
  id: string;
  label: string;
  e1: string;
  b1: string;
  h1: string;
  e2: string;
  b2: string;
  h2: string;
  moment: string;
}

const PRESETS: SectionPreset[] = [
  {
    id: 'timber-steel',
    label: 'Timber + Top Steel Plate (E1=10, E2=200 GPa)',
    e1: '10',
    b1: '100',
    h1: '200',
    e2: '200',
    b2: '100',
    h2: '20',
    moment: '20',
  },
  {
    id: 'concrete-steel',
    label: 'Concrete + Steel Flange (E1=25, E2=200 GPa)',
    e1: '25',
    b1: '300',
    h1: '150',
    e2: '200',
    b2: '120',
    h2: '12',
    moment: '35',
  },
  {
    id: 'al-steel',
    label: 'Aluminum + Steel Cap (E1=69, E2=200 GPa)',
    e1: '69',
    b1: '80',
    h1: '120',
    e2: '200',
    b2: '80',
    h2: '10',
    moment: '15',
  },
];

function parsePositive(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return Number.NaN;
  const val = Number(trimmed);
  if (!Number.isFinite(val) || val <= 0) return Number.NaN;
  return val;
}

function parseNonNegative(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return Number.NaN;
  const val = Number(trimmed);
  if (!Number.isFinite(val) || val < 0) return Number.NaN;
  return val;
}

function fmt(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '—';
  return val.toFixed(decimals);
}

export default function CompositeSectionCalculatorClient() {
  const [e1Str, setE1Str] = useState<string>('10');
  const [b1Str, setB1Str] = useState<string>('100');
  const [h1Str, setH1Str] = useState<string>('200');
  const [e2Str, setE2Str] = useState<string>('200');
  const [b2Str, setB2Str] = useState<string>('100');
  const [h2Str, setH2Str] = useState<string>('20');
  const [momentStr, setMomentStr] = useState<string>('20');
  const [copied, setCopied] = useState<boolean>(false);

  const applyPreset = (p: SectionPreset) => {
    setE1Str(p.e1);
    setB1Str(p.b1);
    setH1Str(p.h1);
    setE2Str(p.e2);
    setB2Str(p.b2);
    setH2Str(p.h2);
    setMomentStr(p.moment);
  };

  const handleReset = () => {
    applyPreset(PRESETS[0]);
    setCopied(false);
  };

  const result = useMemo(() => {
    const E1 = parsePositive(e1Str);
    const b1 = parsePositive(b1Str);
    const h1 = parsePositive(h1Str);
    const E2 = parsePositive(e2Str);
    const b2 = parsePositive(b2Str);
    const h2 = parsePositive(h2Str);
    const M_kNm = parseNonNegative(momentStr);

    if (
      !Number.isFinite(E1) ||
      !Number.isFinite(b1) ||
      !Number.isFinite(h1) ||
      !Number.isFinite(E2) ||
      !Number.isFinite(b2) ||
      !Number.isFinite(h2) ||
      !Number.isFinite(M_kNm)
    ) {
      return { valid: false as const };
    }

    // Transform Layer 2 into equivalent Base Material 1 using modular ratio n = E2 / E1
    const n = E2 / E1;
    const b2Trans = n * b2;

    const A1 = b1 * h1;
    const A2 = b2 * h2;
    const A2Trans = n * A2;
    const AtTotal = A1 + A2Trans;

    // Centroids measured upward from bottom face y = 0
    const y1 = h1 / 2;
    const y2 = h1 + h2 / 2;
    const yBar = (A1 * y1 + A2Trans * y2) / AtTotal;

    // Own centroidal moments of inertia
    const I1Own = (b1 * Math.pow(h1, 3)) / 12;
    const I2Own = (b2 * Math.pow(h2, 3)) / 12;
    const I2TransOwn = n * I2Own;

    // Parallel-Axis Theorem distances d_i = |y_i - yBar|
    const d1 = Math.abs(y1 - yBar);
    const d2 = Math.abs(y2 - yBar);
    const I1Steiner = A1 * d1 * d1;
    const I2TransSteiner = A2Trans * d2 * d2;

    const ItTotal = I1Own + I1Steiner + (I2TransOwn + I2TransSteiner);

    // Bending stress restoration (M in kN*m -> N*mm = M_kNm * 1e6; I in mm^4 -> stress in MPa)
    const M_Nmm = M_kNm * 1e6;
    const c1Bot = yBar; // distance to bottom face y = 0
    const c2Top = h1 + h2 - yBar; // distance to top face y = h1 + h2
    const cInt = Math.abs(h1 - yBar); // distance to bond interface y = h1

    const sigma1Bot = (M_Nmm * c1Bot) / ItTotal;
    const sigma2TopEquiv = (M_Nmm * c2Top) / ItTotal;
    const sigma2TopActual = n * sigma2TopEquiv; // CRITICAL: multiply back by n = E2/E1
    const sigma1Int = (M_Nmm * cInt) / ItTotal;
    const sigma2Int = n * sigma1Int;

    return {
      valid: true as const,
      E1,
      E2,
      b1,
      h1,
      b2,
      h2,
      M_kNm,
      n,
      b2Trans,
      A1,
      A2,
      A2Trans,
      AtTotal,
      y1,
      y2,
      yBar,
      d1,
      d2,
      I1Own,
      I2TransOwn,
      I1Steiner,
      I2TransSteiner,
      ItTotal,
      sigma1Bot,
      sigma2TopEquiv,
      sigma2TopActual,
      sigma1Int,
      sigma2Int,
    };
  }, [e1Str, b1Str, h1Str, e2Str, b2Str, h2Str, momentStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Composite Section Transform (Base Material 1)`,
      `Modular Ratio n = E2/E1 = ${result.n.toFixed(3)}`,
      `Transformed Area At = ${(result.AtTotal / 100).toFixed(2)} cm2 (${result.AtTotal.toFixed(1)} mm2)`,
      `Centroid from bottom y_bar = ${result.yBar.toFixed(2)} mm`,
      `Transformed Inertia It = ${(result.ItTotal / 10000).toFixed(2)} cm4 (${result.ItTotal.toFixed(0)} mm4)`,
      `Bottom Fiber Stress sigma1 = ${result.sigma1Bot.toFixed(2)} MPa`,
      `Top Fiber Stress sigma2 = n*(M*c2/It) = ${result.sigma2TopActual.toFixed(2)} MPa`,
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
      `E1,${result.E1.toFixed(2)},GPa,Base reference material 1 modulus`,
      `E2,${result.E2.toFixed(2)},GPa,Transformed material 2 modulus`,
      `n,${result.n.toFixed(4)},-,Modular ratio E2/E1`,
      `b2_transformed,${result.b2Trans.toFixed(2)},mm,Equivalent width n*b2`,
      `At,${(result.AtTotal / 100).toFixed(3)},cm2,Total transformed area A1 + n*A2`,
      `y_bar,${result.yBar.toFixed(3)},mm,Neutral axis height from bottom face`,
      `It_cm4,${(result.ItTotal / 10000).toFixed(3)},cm4,Total transformed moment of inertia via parallel-axis theorem`,
      `It_mm4,${result.ItTotal.toFixed(1)},mm4,Sum(Ii_trans + Ai_trans*di^2)`,
      `M,${result.M_kNm.toFixed(3)},kN*m,Applied bending moment`,
      `sigma1_bottom,${result.sigma1Bot.toFixed(3)},MPa,Material 1 extreme bottom stress M*y_bar/It`,
      `sigma2_top_actual,${result.sigma2TopActual.toFixed(3)},MPa,Material 2 true extreme top stress n*M*c2/It`,
      `sigma1_interface,${result.sigma1Int.toFixed(3)},MPa,Material 1 bond interface stress`,
      `sigma2_interface,${result.sigma2Int.toFixed(3)},MPa,Material 2 bond interface stress (n*sigma1_interface)`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'composite-transformed-section.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Section Layers</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Quick Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Layer 1 (Bottom Base Material)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-black text-slate-400 block mb-1">E1 (GPa)</label>
                <input
                  data-testid="input-e1"
                  type="text"
                  inputMode="decimal"
                  value={e1Str}
                  onChange={(e) => setE1Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 block mb-1">b1 (mm)</label>
                <input
                  data-testid="input-b1"
                  type="text"
                  inputMode="decimal"
                  value={b1Str}
                  onChange={(e) => setB1Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 block mb-1">h1 (mm)</label>
                <input
                  data-testid="input-h1"
                  type="text"
                  inputMode="decimal"
                  value={h1Str}
                  onChange={(e) => setH1Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100 space-y-3">
            <div className="text-xs font-black text-orange-800 uppercase tracking-wider">
              Layer 2 (Top Bonded Material)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-black text-orange-700/70 block mb-1">E2 (GPa)</label>
                <input
                  data-testid="input-e2"
                  type="text"
                  inputMode="decimal"
                  value={e2Str}
                  onChange={(e) => setE2Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-orange-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-orange-700/70 block mb-1">b2 (mm)</label>
                <input
                  data-testid="input-b2"
                  type="text"
                  inputMode="decimal"
                  value={b2Str}
                  onChange={(e) => setB2Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-orange-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-orange-700/70 block mb-1">h2 (mm)</label>
                <input
                  data-testid="input-h2"
                  type="text"
                  inputMode="decimal"
                  value={h2Str}
                  onChange={(e) => setH2Str(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl bg-white border border-orange-200 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Applied Bending Moment M (kN·m)
            </label>
            <input
              data-testid="input-moment"
              type="text"
              inputMode="decimal"
              value={momentStr}
              onChange={(e) => setMomentStr(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Transformed Section &amp; Bending Stress
                </h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Modular Ratio n = E2/E1
                </div>
                <div data-testid="result-n" className="text-2xl font-black text-blue-800">
                  {result.valid ? fmt(result.n, 3) : '—'}
                </div>
                <div className="text-xs font-bold text-blue-600 mt-1">
                  {result.valid ? `b2_tr = ${fmt(result.b2Trans, 1)} mm` : '—'}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Neutral Axis ȳ (from bottom)
                </div>
                <div data-testid="result-ybar" className="text-2xl font-black text-emerald-800">
                  {result.valid ? `${fmt(result.yBar, 2)} mm` : '—'}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid ? `At = ${fmt(result.AtTotal / 100, 2)} cm²` : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Transformed Inertia It
                </div>
                <div data-testid="result-it" className="text-2xl font-black text-orange-800">
                  {result.valid ? `${fmt(result.ItTotal / 10000, 2)} cm⁴` : '—'}
                </div>
                <div className="text-xs font-bold text-orange-700 mt-1">
                  {result.valid ? `${fmt(result.ItTotal / 1e6, 2)} ×10⁶ mm⁴` : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Material 1 Bottom Stress σ1 = M·ȳ / It
                </div>
                <div data-testid="result-sigma1" className="text-2xl font-black text-slate-900">
                  {result.valid ? `${fmt(result.sigma1Bot, 2)} MPa` : '—'}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-1">
                  {result.valid ? `At bond interface (y=${result.h1} mm): σ1_int = ${fmt(result.sigma1Int, 2)} MPa` : '—'}
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                  Material 2 Top Stress σ2 = n·(M·c2 / It)
                </div>
                <div data-testid="result-sigma2" className="text-2xl font-black text-purple-900">
                  {result.valid ? `${fmt(result.sigma2TopActual, 2)} MPa` : '—'}
                </div>
                <div data-testid="result-sigma2-detail" className="text-xs text-purple-700 font-semibold mt-1">
                  {result.valid
                    ? `Transformed stress = ${fmt(result.sigma2TopEquiv, 2)} MPa × n (${fmt(result.n, 2)}) • Interface σ2_int = ${fmt(result.sigma2Int, 2)} MPa`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <div>
                  <strong>Transformed-Section &amp; Parallel-Axis Theorem:</strong> Material 2 is transformed into equivalent Material 1 by scaling widths parallel to the neutral axis by{' '}
                  <code>n = E2/E1</code> (heights remain unchanged). Composite centroid{' '}
                  <code>ȳ = (A1·y1 + n·A2·y2) / (A1 + n·A2)</code>; total inertia via Steiner parallel-axis theorem{' '}
                  <code>It = Σ(Ii,trans + Ai,trans·di²)</code>. True stress in Material 2 must be restored by multiplying by <code>n</code>: <code>σ2 = n·(M·y / It)</code>.
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
