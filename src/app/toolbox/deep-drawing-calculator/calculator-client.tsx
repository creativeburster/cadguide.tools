'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

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

export default function DeepDrawingCalculatorClient() {
  const [punchDiaStr, setPunchDiaStr] = useState('55');
  const [blankMode, setBlankMode] = useState<'direct' | 'from-height'>('direct');
  const [blankDiaStr, setBlankDiaStr] = useState('100');
  const [cupHeightStr, setCupHeightStr] = useState('31.705');
  const [thicknessStr, setThicknessStr] = useState('1.2');
  const [rmStr, setRmStr] = useState('340');
  const [effFactorStr, setEffFactorStr] = useState('1.15');
  const [bhpStr, setBhpStr] = useState('2.0');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setPunchDiaStr('55');
    setBlankMode('direct');
    setBlankDiaStr('100');
    setCupHeightStr('31.705');
    setThicknessStr('1.2');
    setRmStr('340');
    setEffFactorStr('1.15');
    setBhpStr('2.0');
    setCopied(false);
  };

  const result = useMemo(() => {
    const d = parsePositive(punchDiaStr);
    const t = parsePositive(thicknessStr);
    const Rm = parsePositive(rmStr);
    const eta = parsePositive(effFactorStr);
    const pbh = parseNonNegative(bhpStr);

    if (!Number.isFinite(d) || !Number.isFinite(t) || !Number.isFinite(Rm) || !Number.isFinite(eta) || !Number.isFinite(pbh)) {
      return { valid: false as const, reason: 'All diameters, thickness, tensile strength, efficiency factor, and blank holder pressure must be valid numbers.' };
    }

    let D0 = Number.NaN;
    if (blankMode === 'direct') {
      D0 = parsePositive(blankDiaStr);
    } else {
      const h = parsePositive(cupHeightStr);
      if (Number.isFinite(h)) {
        // Equal-area cylindrical shell without flange: pi/4 * D0^2 = pi/4 * d^2 + pi * d * h => D0 = sqrt(d^2 + 4*d*h)
        D0 = Math.sqrt(d * d + 4 * d * h);
      }
    }

    if (!Number.isFinite(D0) || D0 <= d) {
      return { valid: false as const, reason: 'Initial blank diameter D₀ must be strictly greater than punch diameter d (β = D₀/d > 1.0).' };
    }

    const beta = D0 / d;
    // Ideal plastic + friction/bending corrected drawing force: Fd = pi * d * t * Rm * eta * ln(D0 / d) / 1000 (kN)
    const drawForceKn = (Math.PI * d * t * Rm * eta * Math.log(beta)) / 1000;

    // Initial flange annular contact area between blank OD and die bore (approximated at d + 2*t)
    const dieBore = d + 2 * t;
    const flangeAreaMm2 = D0 > dieBore ? (Math.PI / 4) * (D0 * D0 - dieBore * dieBore) : 0;
    const blankHolderForceKn = (flangeAreaMm2 * pbh) / 1000;

    const totalForceKn = drawForceKn + blankHolderForceKn;
    const pressMetricTons = totalForceKn / 9.80665;

    return {
      valid: true as const,
      d,
      D0,
      t,
      Rm,
      eta,
      pbh,
      beta,
      drawForceKn,
      blankHolderForceKn,
      totalForceKn,
      pressMetricTons,
      highLdrWarning: beta > 2.0,
    };
  }, [punchDiaStr, blankMode, blankDiaStr, cupHeightStr, thicknessStr, rmStr, effFactorStr, bhpStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Cylindrical Deep Drawing: d=${result.d} mm, D0=${result.D0.toFixed(2)} mm (beta=${result.beta.toFixed(4)}), t=${result.t} mm, Rm=${result.Rm} MPa -> Fd=${result.drawForceKn.toFixed(2)} kN, Fbh=${result.blankHolderForceKn.toFixed(2)} kN, Total=${result.totalForceKn.toFixed(2)} kN (${result.pressMetricTons.toFixed(2)} tf)`;
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
      ['punch_diameter_d', result.d.toFixed(2), 'mm'],
      ['blank_diameter_D0', result.D0.toFixed(2), 'mm'],
      ['sheet_thickness_t', result.t.toFixed(2), 'mm'],
      ['tensile_strength_Rm', result.Rm.toFixed(1), 'MPa'],
      ['drawing_ratio_beta', result.beta.toFixed(4), '-'],
      ['drawing_force_Fd', result.drawForceKn.toFixed(3), 'kN'],
      ['blank_holder_force_Fbh', result.blankHolderForceKn.toFixed(3), 'kN'],
      ['total_press_force', result.totalForceKn.toFixed(3), 'kN'],
      ['press_tonnage', result.pressMetricTons.toFixed(2), 'tf'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deep_drawing_tonnage.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Cylindrical Cup Deep Drawing Force &amp; Ratio</h2>
            <p className="text-sm font-medium text-slate-500">
              Evaluates drawing ratio β = D₀ / d, logarithmic draw force, and blank holder tonnage
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dd-d" className="block text-xs font-black text-slate-700 mb-1">Punch Dia d (mm)</label>
              <input
                id="dd-d"
                data-testid="input-punch-dia"
                type="text"
                inputMode="decimal"
                value={punchDiaStr}
                onChange={(e) => setPunchDiaStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="dd-t" className="block text-xs font-black text-slate-700 mb-1">Thickness t (mm)</label>
              <input
                id="dd-t"
                data-testid="input-thickness"
                type="text"
                inputMode="decimal"
                value={thicknessStr}
                onChange={(e) => setThicknessStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-600 uppercase">Blank Diameter Specification</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  data-testid="mode-direct"
                  onClick={() => setBlankMode('direct')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    blankMode === 'direct' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Blank D₀
                </button>
                <button
                  type="button"
                  data-testid="mode-height"
                  onClick={() => setBlankMode('from-height')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    blankMode === 'from-height' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  From Cup Height
                </button>
              </div>
            </div>

            {blankMode === 'direct' ? (
              <div>
                <label htmlFor="dd-d0" className="block text-xs font-black text-slate-700 mb-1">
                  Initial Blank Diameter D₀ (mm)
                </label>
                <input
                  id="dd-d0"
                  data-testid="input-blank-dia"
                  type="text"
                  inputMode="decimal"
                  value={blankDiaStr}
                  onChange={(e) => setBlankDiaStr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="dd-h" className="block text-xs font-black text-slate-700 mb-1">
                  Cylindrical Cup Height h (mm)
                </label>
                <input
                  id="dd-h"
                  data-testid="input-cup-height"
                  type="text"
                  inputMode="decimal"
                  value={cupHeightStr}
                  onChange={(e) => setCupHeightStr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="dd-rm" className="block text-xs font-black text-slate-700 mb-1">Tensile Rm (MPa)</label>
              <input
                id="dd-rm"
                data-testid="input-rm"
                type="text"
                inputMode="decimal"
                value={rmStr}
                onChange={(e) => setRmStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dd-eta" className="block text-xs font-black text-slate-700 mb-1">Friction η_f</label>
              <input
                id="dd-eta"
                data-testid="input-eta"
                type="text"
                inputMode="decimal"
                value={effFactorStr}
                onChange={(e) => setEffFactorStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dd-pbh" className="block text-xs font-black text-slate-700 mb-1">BHP (MPa)</label>
              <input
                id="dd-pbh"
                data-testid="input-bhp"
                type="text"
                inputMode="decimal"
                value={bhpStr}
                onChange={(e) => setBhpStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
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
              <div data-testid="error-banner" className="rounded-2xl p-4 bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{result.reason}</span>
              </div>
            )}

            {result.valid && result.highLdrWarning && (
              <div data-testid="warning-ldr" className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  High Drawing Ratio (β = {result.beta.toFixed(2)} &gt; 2.00): exceeds typical single-stage first-draw Limiting Drawing Ratio (LDR). Consider multi-stage redrawing to prevent wall tearing.
                </span>
              </div>
            )}

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <div className="text-xs font-black text-indigo-800 uppercase tracking-wider mb-1">
                Total Press Force (Drawing + Blank Holder)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-total-force" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.totalForceKn, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-indigo-700">kN</span>
              </div>
              <div data-testid="result-tonnage" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.pressMetricTons.toFixed(2)} metric tons • Blank D₀ = ${result.D0.toFixed(2)} mm` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Drawing Ratio (β)</div>
                <div data-testid="result-beta" className="text-2xl font-black text-slate-900">
                  {result.valid ? fmt(result.beta, 4) : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Drawing Force (F_d)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-draw-force" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.drawForceKn, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Blank Holder (F_bh)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-bh-force" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.blankHolderForceKn, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Sheet Metal Deep Drawing Mechanics:</strong>{' '}
                Equal-area blank diameter <code>D₀ = √(d² + 4dh)</code> (for sharp corner radius), drawing ratio <code>β = D₀ / d</code>, plastic/friction draw force <code>F_d = π·d·t·R_m·η_f·ln(D₀/d)</code>, and flange hold-down force <code>F_bh = A_flange·p_bh</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
