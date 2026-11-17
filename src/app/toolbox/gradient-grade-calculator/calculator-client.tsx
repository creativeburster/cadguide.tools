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

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: '5pct', label: '5% Road / Drainage Grade (100m, 5m)', run: '100', rise: '5' },
  { id: '12pct', label: '12% Steep Driveway (100m, 12m)', run: '100', rise: '12' },
  { id: '2pct', label: '2% Cross-Slope (50m, 1m)', run: '50', rise: '1' },
];

export default function GradientGradeCalculatorClient() {
  const [runStr, setRunStr] = useState('100');
  const [riseStr, setRiseStr] = useState('5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setRunStr(p.run);
    setRiseStr(p.rise);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const run = parseStrictPositive(runStr);
    const rise = parseStrictFinite(riseStr);

    if (!Number.isFinite(run) || !Number.isFinite(rise)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive horizontal run (> 0) and finite vertical rise.',
      };
    }

    const slope = rise / run;
    const gradePct = slope * 100;
    const perMille = slope * 1000;
    const angleDeg = (Math.atan2(rise, run) * 180) / Math.PI;
    const slopeDistance = Math.hypot(run, rise);
    const ratioLabel = Math.abs(rise) < 1e-12 ? 'Flat (0)' : `1 : ${(run / Math.abs(rise)).toFixed(2)}`;

    return {
      valid: true as const,
      run,
      rise,
      gradePct,
      perMille,
      angleDeg,
      slopeDistance,
      ratioLabel,
    };
  }, [runStr, riseStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Gradient & Slope Trigonometry Summary`,
      `Run=${result.run} m, Rise=${result.rise} m`,
      `Grade = ${result.gradePct.toFixed(3)} % (${result.perMille.toFixed(2)} mm/m)`,
      `Slope Angle = ${result.angleDeg.toFixed(4)} deg`,
      `Slope Ratio = ${result.ratioLabel}`,
      `Slope Distance = ${result.slopeDistance.toFixed(4)} m`,
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
      ['Horizontal Run', String(result.run), 'm'],
      ['Vertical Rise', String(result.rise), 'm'],
      ['Gradient Percentage', result.gradePct.toFixed(3), '%'],
      ['Millimeters per Meter (Per Mille)', result.perMille.toFixed(2), 'mm/m'],
      ['Slope Angle', result.angleDeg.toFixed(4), 'deg'],
      ['Slope Ratio (1 : N)', result.ratioLabel, '-'],
      ['Slope Distance', result.slopeDistance.toFixed(4), 'm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-grade-slope.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Survey Inputs</h2>
          </div>

          <div>
            <label htmlFor="input-run" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Horizontal Distance / Run (m)
            </label>
            <input
              id="input-run"
              data-testid="input-run"
              type="text"
              inputMode="decimal"
              value={runStr}
              onChange={(e) => setRunStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="input-rise" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Elevation Difference / Rise (m)
            </label>
            <input
              id="input-rise"
              data-testid="input-rise"
              type="text"
              inputMode="decimal"
              value={riseStr}
              onChange={(e) => setRiseStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Grade, Angle &amp; Slope Distance</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">Grade Percentage</div>
                <div className="text-2xl font-black text-red-950">
                  <span data-testid="result-grade">{result.valid ? result.gradePct.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-red-600">%</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Slope Angle</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-angle">{result.valid ? result.angleDeg.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">deg</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Slope Distance</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-distance">{result.valid ? result.slopeDistance.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Per Mille (mm/m)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-permille">{result.valid ? result.perMille.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm/m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 sm:col-span-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Grade Ratio (Vertical : Horizontal)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-ratio">{result.valid ? result.ratioLabel : '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Right-triangle surveying trigonometry: Grade% = (rise / run)*100, Per Mille = (rise / run)*1000 mm/m, Angle = atan2(rise, run)*(180/pi), Slope Distance = sqrt(run^2 + rise^2). Unit-consistent when run and rise share any linear length unit.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
