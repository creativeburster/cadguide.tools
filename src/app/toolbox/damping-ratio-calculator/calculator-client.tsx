'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Activity, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

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

function fmt(val: number, decimals = 3): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function DampingRatioCalculatorClient() {
  const [stiffnessStr, setStiffnessStr] = useState('10000');
  const [massStr, setMassStr] = useState('5');
  const [dampingStr, setDampingStr] = useState('50');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: 'underdamped' | 'critical' | 'overdamped' | 'undamped') => {
    setCopied(false);
    if (preset === 'underdamped') {
      setStiffnessStr('10000');
      setMassStr('5');
      setDampingStr('50');
    } else if (preset === 'critical') {
      setStiffnessStr('10000');
      setMassStr('1');
      setDampingStr('200');
    } else if (preset === 'overdamped') {
      setStiffnessStr('10000');
      setMassStr('5');
      setDampingStr('600');
    } else {
      setStiffnessStr('10000');
      setMassStr('5');
      setDampingStr('0');
    }
  };

  const handleReset = () => applyPreset('underdamped');

  const result = useMemo(() => {
    const k = parsePositive(stiffnessStr);
    const m = parsePositive(massStr);
    const c = parseNonNegative(dampingStr);

    if (!Number.isFinite(k) || !Number.isFinite(m) || !Number.isFinite(c)) {
      return { valid: false as const };
    }

    const wn = Math.sqrt(k / m);
    const fn = wn / (2 * Math.PI);
    const cc = 2 * Math.sqrt(k * m);
    const zeta = c / cc;

    let regime: 'Undamped (ζ = 0)' | 'Underdamped (0 < ζ < 1)' | 'Critically Damped (ζ = 1)' | 'Overdamped (ζ > 1)';
    let badgeTone = 'bg-blue-100 text-blue-800 border-blue-200';
    let wd = Number.NaN;
    let fd = Number.NaN;
    let delta = Number.NaN;
    let qFactor = Number.NaN;

    const eps = 1e-9;
    if (zeta <= eps) {
      regime = 'Undamped (ζ = 0)';
      badgeTone = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      wd = wn;
      fd = fn;
      delta = 0;
    } else if (zeta < 1 - eps) {
      regime = 'Underdamped (0 < ζ < 1)';
      badgeTone = 'bg-blue-100 text-blue-800 border-blue-200';
      const root = Math.sqrt(1 - zeta * zeta);
      wd = wn * root;
      fd = wd / (2 * Math.PI);
      delta = (2 * Math.PI * zeta) / root;
      qFactor = 1 / (2 * zeta);
    } else if (Math.abs(zeta - 1) <= 1e-6) {
      regime = 'Critically Damped (ζ = 1)';
      badgeTone = 'bg-amber-100 text-amber-800 border-amber-200';
      qFactor = 0.5;
    } else {
      regime = 'Overdamped (ζ > 1)';
      badgeTone = 'bg-rose-100 text-rose-800 border-rose-200';
      qFactor = 1 / (2 * zeta);
    }

    return {
      valid: true as const,
      k,
      m,
      c,
      wn,
      fn,
      cc,
      zeta,
      regime,
      badgeTone,
      wd,
      fd,
      delta,
      qFactor,
    };
  }, [stiffnessStr, massStr, dampingStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const fdStr = Number.isFinite(result.fd) ? `${result.fd.toFixed(3)} Hz` : 'N/A (non-oscillatory)';
    const deltaStr = Number.isFinite(result.delta) ? result.delta.toFixed(6) : 'N/A';
    const summary = `SDOF Damping: k=${result.k} N/m, m=${result.m} kg, c=${result.c} N*s/m -> zeta=${result.zeta.toFixed(6)} (${result.regime}), fn=${result.fn.toFixed(3)} Hz, fd=${fdStr}, delta=${deltaStr}`;
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
    const asciiRegime = result.regime.replace(/ζ/g, 'zeta').replace(/[^\x20-\x7E]/g, '');
    const rows = [
      ['parameter', 'value', 'unit'],
      ['stiffness_k', String(result.k), 'N/m'],
      ['mass_m', String(result.m), 'kg'],
      ['damping_c', String(result.c), 'N*s/m'],
      ['critical_damping_cc', result.cc.toFixed(4), 'N*s/m'],
      ['damping_ratio_zeta', result.zeta.toFixed(6), '-'],
      ['regime', asciiRegime, '-'],
      ['natural_freq_fn', result.fn.toFixed(4), 'Hz'],
      ['damped_freq_fd', Number.isFinite(result.fd) ? result.fd.toFixed(4) : 'non-oscillatory', 'Hz'],
      ['log_decrement_delta', Number.isFinite(result.delta) ? result.delta.toFixed(6) : 'non-oscillatory', '-'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sdof_damping_ratio.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">SDOF Damping Ratio &amp; Damped Frequency</h2>
            <p className="text-sm font-medium text-slate-500">
              Covers undamped, underdamped, critically damped, and overdamped regimes safely
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-critical"
            onClick={() => applyPreset('critical')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 cursor-pointer"
          >
            Critical (ζ = 1)
          </button>
          <button
            type="button"
            data-testid="preset-overdamped"
            onClick={() => applyPreset('overdamped')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 cursor-pointer"
          >
            Overdamped (ζ &gt; 1)
          </button>
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
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor="damp-k" className="block text-sm font-black text-slate-700 mb-1.5">
              Spring Stiffness k (N/m)
            </label>
            <input
              id="damp-k"
              data-testid="input-stiffness"
              type="text"
              inputMode="decimal"
              value={stiffnessStr}
              onChange={(e) => setStiffnessStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="damp-m" className="block text-sm font-black text-slate-700 mb-1.5">
              Mass m (kg)
            </label>
            <input
              id="damp-m"
              data-testid="input-mass"
              type="text"
              inputMode="decimal"
              value={massStr}
              onChange={(e) => setMassStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="damp-c" className="block text-sm font-black text-slate-700 mb-1.5">
              Viscous Damping Coefficient c (N·s/m, ≥ 0)
            </label>
            <input
              id="damp-c"
              data-testid="input-damping"
              type="text"
              inputMode="decimal"
              value={dampingStr}
              onChange={(e) => setDampingStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
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
                <span>Enter positive stiffness k, positive mass m, and non-negative damping c.</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="text-xs font-black text-blue-800 uppercase tracking-wider">
                  Damping Ratio (ζ = c / c_c)
                </div>
                {result.valid && (
                  <span data-testid="result-regime" className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${result.badgeTone}`}>
                    {result.regime}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-zeta" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.zeta, 6) : '—'}
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {result.valid ? `(Critical c_c = ${result.cc.toFixed(2)} N·s/m)` : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Natural Freq (f_n)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-fn" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.fn, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Hz</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Damped Freq (f_d)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-fd" className="text-2xl font-black text-slate-900">
                    {result.valid && Number.isFinite(result.fd) ? fmt(result.fd, 3) : '—'}
                  </span>
                  {result.valid && Number.isFinite(result.fd) && (
                    <span className="text-xs font-bold text-slate-500">Hz</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Log Decrement (δ)</div>
                <div data-testid="result-delta" className="text-2xl font-black text-slate-900">
                  {result.valid && Number.isFinite(result.delta) ? fmt(result.delta, 6) : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>SDOF Linear Viscous Damping Relations:</strong>{' '}
                <code>c_c = 2√(k·m)</code>, <code>ζ = c / c_c</code>. Oscillatory damped frequency{' '}
                <code>f_d = f_n√(1 − ζ²)</code> and logarithmic decrement <code>δ = 2πζ / √(1 − ζ²)</code> exist only when <code>ζ &lt; 1</code>; for critical/overdamped systems (<code>ζ ≥ 1</code>) motion decays without oscillation.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
