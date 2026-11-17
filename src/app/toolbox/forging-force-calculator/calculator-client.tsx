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

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const G_STD = 9.80665;

const PRESETS = [
  { id: 'upset', label: 'Open-Die Upset (Qf = 1.2)', sigma: '200', area: '5000', qf: '1.2', stroke: '10', wf: '0.85' },
  { id: 'simple-die', label: 'Simple Closed-Die (Qf = 2.5)', sigma: '200', area: '5000', qf: '2.5', stroke: '10', wf: '0.85' },
  { id: 'complex-flash', label: 'Complex Flash Impression (Qf = 5.0)', sigma: '160', area: '8000', qf: '5.0', stroke: '12', wf: '0.75' },
];

export default function ForgingForceCalculatorClient() {
  const [sigmaStr, setSigmaStr] = useState('200');
  const [areaStr, setAreaStr] = useState('5000');
  const [qfStr, setQfStr] = useState('1.2');
  const [strokeStr, setStrokeStr] = useState('10');
  const [wfStr, setWfStr] = useState('0.85');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setSigmaStr(p.sigma);
    setAreaStr(p.area);
    setQfStr(p.qf);
    setStrokeStr(p.stroke);
    setWfStr(p.wf);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const sigma = parseStrictPositive(sigmaStr);
    const area = parseStrictPositive(areaStr);
    const qf = parseStrictPositive(qfStr);
    const stroke = parseStrictPositive(strokeStr);
    const wf = parseStrictPositive(wfStr);

    if (
      !Number.isFinite(sigma) ||
      !Number.isFinite(area) ||
      !Number.isFinite(qf) ||
      !Number.isFinite(stroke) ||
      !Number.isFinite(wf) ||
      wf > 1
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive values for flow stress, area, shape factor Qf, stroke, and work factor (0 < eta_w <= 1).',
      };
    }

    const forceKn = (sigma * area * qf) / 1000;
    const tonnageTf = forceKn / G_STD;
    const workKj = wf * forceKn * (stroke / 1000);
    const avgPressureMpa = sigma * qf;

    return {
      valid: true as const,
      sigma,
      area,
      qf,
      stroke,
      wf,
      forceKn,
      tonnageTf,
      workKj,
      avgPressureMpa,
    };
  }, [sigmaStr, areaStr, qfStr, strokeStr, wfStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Forging Force & Deformation Work Summary`,
      `sigma_f=${result.sigma} MPa, Area=${result.area} mm2, Qf=${result.qf}, Stroke=${result.stroke} mm, WorkFactor=${result.wf}`,
      `Max Forging Force F_max = ${result.forceKn.toFixed(2)} kN (${result.tonnageTf.toFixed(2)} tf)`,
      `Stroke Deformation Work W = ${result.workKj.toFixed(2)} kJ`,
      `Mean Die Face Pressure p_avg = ${result.avgPressureMpa.toFixed(2)} MPa`,
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
      ['Material Flow Stress sigma_f', String(result.sigma), 'MPa'],
      ['Projected Plan Area A', String(result.area), 'mm2'],
      ['Friction & Shape Factor Qf', String(result.qf), '-'],
      ['Deformation Stroke dh', String(result.stroke), 'mm'],
      ['Stroke Work Fill Factor eta_w', String(result.wf), '-'],
      ['Maximum Forging Force F_max', result.forceKn.toFixed(2), 'kN'],
      ['Metric Press Tonnage F_tf', result.tonnageTf.toFixed(2), 'tf'],
      ['Deformation Work W', result.workKj.toFixed(2), 'kJ'],
      ['Mean Die Face Pressure p_avg', result.avgPressureMpa.toFixed(2), 'MPa'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forging-force-calculation.csv';
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
            <h2 className="text-lg font-black text-slate-900">Forging Inputs</h2>
          </div>

          {[
            { id: 'sigma', label: 'Flow Stress sigma_f (MPa)', val: sigmaStr, set: setSigmaStr },
            { id: 'area', label: 'Projected Area incl. Flash A (mm2)', val: areaStr, set: setAreaStr },
            { id: 'qf', label: 'Friction & Shape Factor Qf (typ. 1.2-8.0)', val: qfStr, set: setQfStr },
            { id: 'stroke', label: 'Deformation Stroke dh (mm)', val: strokeStr, set: setStrokeStr },
            { id: 'wf', label: 'Stroke Work Fill Factor eta_w (0-1)', val: wfStr, set: setWfStr },
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
                <h2 className="text-lg font-black text-slate-900">Press Load & Work</h2>
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
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Max Forging Force F_max</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-force">{result.valid ? result.forceKn.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-purple-500">kN</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Metric Press Tonnage</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-tonnage">{result.valid ? result.tonnageTf.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">tf</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Stroke Deformation Work W</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-work">{result.valid ? result.workKj.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">kJ</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Mean Die Face Pressure</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-pressure">{result.valid ? result.avgPressureMpa.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">MPa</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Open/closed-die forging estimate: F_max = (sigma_f * A * Qf) / 1000 (kN), F_tf = F_max / 9.80665 (standard gravity per NIST SP 811), W = eta_w * F_max * (dh / 1000) (kJ). Verify press tonnage margin against die flash design and strain-rate flow stress at target temperature.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
