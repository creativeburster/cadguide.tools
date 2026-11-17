'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Disc, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Exact international definitions: 1 inch = 25.4 mm, 1 foot = 0.3048 m
const MM_PER_IN = 25.4;
const M_PER_FT = 0.3048;

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CuttingSpeedCalculatorClient() {
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [diaStr, setDiaStr] = useState('50');
  const [diaUnit, setDiaUnit] = useState<'mm' | 'in'>('mm');
  const [rpmStr, setRpmStr] = useState('1000');
  const [vcStr, setVcStr] = useState('157.08');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setMode('forward');
    setDiaStr('50');
    setDiaUnit('mm');
    setRpmStr('1000');
    setVcStr('157.08');
    setCopied(false);
  };

  const result = useMemo(() => {
    const rawD = parsePositive(diaStr);
    if (!Number.isFinite(rawD)) {
      return { valid: false as const };
    }

    const D_mm = diaUnit === 'mm' ? rawD : rawD * MM_PER_IN;
    const D_in = D_mm / MM_PER_IN;

    if (mode === 'forward') {
      const n = parsePositive(rpmStr);
      if (!Number.isFinite(n)) return { valid: false as const };
      // Exact Vc = pi * D_mm * n / 1000 (m/min)
      const vcMpm = (Math.PI * D_mm * n) / 1000;
      const vcSfm = vcMpm / M_PER_FT; // = (pi * D_in * n) / 12
      const circumferenceMm = Math.PI * D_mm;
      return {
        valid: true as const,
        D_mm,
        D_in,
        n,
        vcMpm,
        vcSfm,
        circumferenceMm,
      };
    }

    const targetVc = parsePositive(vcStr);
    if (!Number.isFinite(targetVc)) return { valid: false as const };
    const n = (targetVc * 1000) / (Math.PI * D_mm);
    const vcSfm = targetVc / M_PER_FT;
    const circumferenceMm = Math.PI * D_mm;
    return {
      valid: true as const,
      D_mm,
      D_in,
      n,
      vcMpm: targetVc,
      vcSfm,
      circumferenceMm,
    };
  }, [mode, diaStr, diaUnit, rpmStr, vcStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `D=${result.D_mm.toFixed(2)} mm (${result.D_in.toFixed(4)} in), Spindle=${result.n.toFixed(1)} RPM -> Vc=${result.vcMpm.toFixed(2)} m/min (${result.vcSfm.toFixed(2)} SFM)`;
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
      ['diameter_mm', result.D_mm.toFixed(3), 'mm'],
      ['diameter_in', result.D_in.toFixed(4), 'in'],
      ['spindle_speed', result.n.toFixed(2), 'RPM'],
      ['cutting_speed_metric', result.vcMpm.toFixed(3), 'm/min'],
      ['cutting_speed_sfm', result.vcSfm.toFixed(3), 'ft/min'],
      ['cutter_circumference', result.circumferenceMm.toFixed(2), 'mm/rev'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cutting_surface_speed.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Cutting Surface Speed &amp; Spindle RPM</h2>
            <p className="text-sm font-medium text-slate-500">
              Exact peripheral velocity Vc = π · D · n / 1,000 and SFM = Vc / 0.3048
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

      <div className="px-6 md:px-8 pt-6 flex gap-2">
        <button
          type="button"
          data-testid="tab-forward"
          onClick={() => setMode('forward')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            mode === 'forward' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          RPM + Diameter → Cutting Speed
        </button>
        <button
          type="button"
          data-testid="tab-reverse"
          onClick={() => setMode('reverse')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            mode === 'reverse' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Target Vc + Diameter → Spindle RPM
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="vc-dia" className="text-sm font-black text-slate-700">
                Cutter / Workpiece Diameter D
              </label>
              <div className="flex gap-1">
                {(['mm', 'in'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`dia-unit-${u}`}
                    onClick={() => setDiaUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      diaUnit === u ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="vc-dia"
              data-testid="input-diameter"
              type="text"
              inputMode="decimal"
              value={diaStr}
              onChange={(e) => setDiaStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          {mode === 'forward' ? (
            <div>
              <label htmlFor="vc-rpm" className="block text-sm font-black text-slate-700 mb-1.5">
                Spindle Speed n (RPM)
              </label>
              <input
                id="vc-rpm"
                data-testid="input-rpm"
                type="text"
                inputMode="decimal"
                value={rpmStr}
                onChange={(e) => setRpmStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="vc-target" className="block text-sm font-black text-slate-700 mb-1.5">
                Target Metric Cutting Speed Vc (m/min)
              </label>
              <input
                id="vc-target"
                data-testid="input-target-vc"
                type="text"
                inputMode="decimal"
                value={vcStr}
                onChange={(e) => setVcStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          )}

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
                <span>Diameter, RPM, and target surface speed must all be positive numbers.</span>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="text-xs font-black text-purple-800 uppercase tracking-wider mb-1">
                {mode === 'forward' ? 'Metric Cutting Speed (Vc)' : 'Required Spindle Speed (n)'}
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-primary" className="text-4xl font-black text-slate-900">
                  {result.valid ? (mode === 'forward' ? fmt(result.vcMpm, 2) : fmt(result.n, 1)) : '—'}
                </span>
                <span className="text-lg font-bold text-purple-700">
                  {mode === 'forward' ? 'm/min' : 'RPM'}
                </span>
              </div>
              <div data-testid="result-secondary-line" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.vcSfm.toFixed(2)} ft/min (SFM)` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Imperial Surface Speed (SFM)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-sfm" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.vcSfm, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ft/min</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Peripheral Travel / Rev</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-circ" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.circumferenceMm, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">mm/rev</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Cutting Speed &amp; SFM Exact Formula:</strong>{' '}
                <code>V_c = π · D_mm · n / 1,000</code> (m/min) and exact international foot conversion <code>SFM = V_c / 0.3048 = π · D_in · n / 12</code> (ft/min), avoiding rounded factor approximations.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
