'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Industrial Rotor (0.5 kg-m2, 3000 RPM, 60 RPM)', i: '0.5', ns: '3000', np: '60', span: '0.4' },
  { id: 'marine-stabilizer', label: 'Ship Stabilizer (4.0 kg-m2, 1800 RPM, 15 RPM)', i: '4.0', ns: '1800', np: '15', span: '0.8' },
  { id: 'turbine', label: 'Aircraft Turbine (0.25 kg-m2, 9000 RPM, 12 RPM)', i: '0.25', ns: '9000', np: '12', span: '0.5' },
];

export default function GyroscopicCoupleCalculatorClient() {
  const [inertiaStr, setInertiaStr] = useState('0.5');
  const [nsStr, setNsStr] = useState('3000');
  const [npStr, setNpStr] = useState('60');
  const [spanStr, setSpanStr] = useState('0.4');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setInertiaStr(p.i);
    setNsStr(p.ns);
    setNpStr(p.np);
    setSpanStr(p.span);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const I = parseStrictPositive(inertiaStr);
    const ns = parseStrictPositive(nsStr);
    const np = parseStrictNonNegative(npStr);
    const span = parseStrictPositive(spanStr);

    if (!Number.isFinite(I) || !Number.isFinite(ns) || !Number.isFinite(np) || !Number.isFinite(span)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive inertia (> 0), spin speed (> 0 RPM), bearing span (> 0 m), and non-negative precession speed (>= 0 RPM).',
      };
    }

    const ws = (2 * Math.PI * ns) / 60;
    const wp = (2 * Math.PI * np) / 60;
    const couple = I * ws * wp;
    const bearingForce = couple / span;

    return {
      valid: true as const,
      I,
      ns,
      np,
      span,
      ws,
      wp,
      couple,
      bearingForce,
    };
  }, [inertiaStr, nsStr, npStr, spanStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Gyroscopic Couple & Bearing Reaction Summary',
      `Inertia I = ${result.I} kg-m2, Spin = ${result.ns} RPM (${result.ws.toFixed(2)} rad/s), Precession = ${result.np} RPM (${result.wp.toFixed(3)} rad/s)`,
      `Gyroscopic Couple C = ${result.couple.toFixed(2)} Nm`,
      `Bearing Reaction per Support (Span ${result.span} m) = ${result.bearingForce.toFixed(2)} N`,
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
      ['Polar Moment of Inertia I', String(result.I), 'kg-m2'],
      ['Spin Speed n_s', String(result.ns), 'RPM'],
      ['Precession Speed n_p', String(result.np), 'RPM'],
      ['Bearing Support Span L_b', String(result.span), 'm'],
      ['Spin Angular Velocity omega_s', result.ws.toFixed(4), 'rad/s'],
      ['Precession Angular Velocity omega_p', result.wp.toFixed(4), 'rad/s'],
      ['Gyroscopic Couple C', result.couple.toFixed(4), 'Nm'],
      ['Bearing Radial Reaction F_b', result.bearingForce.toFixed(4), 'N'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gyroscopic-couple.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
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

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Polar Inertia I (kg-m2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-inertia"
                value={inertiaStr}
                onChange={(e) => setInertiaStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Spin Speed n_s (RPM)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-spin"
                value={nsStr}
                onChange={(e) => setNsStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Precession Speed n_p (RPM)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-precession"
                value={npStr}
                onChange={(e) => setNpStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Bearing Support Span L_b (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-span"
                value={spanStr}
                onChange={(e) => setSpanStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-error" className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm font-bold text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Gyroscopic Couple</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-couple">{result.valid ? result.couple.toFixed(2) : '—'}</span>
                  <span className="text-lg text-blue-500"> Nm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Bearing Reaction Force</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-bearing-force">{result.valid ? result.bearingForce.toFixed(2) : '—'}</span>
                  <span className="text-lg text-orange-500"> N</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Spin Angular Velocity</div>
                <div className="text-2xl font-black text-green-800">
                  <span data-testid="result-ws">{result.valid ? result.ws.toFixed(2) : '—'}</span>
                  <span className="text-base text-green-600"> rad/s</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Precession Angular Velocity</div>
                <div className="text-2xl font-black text-purple-800">
                  <span data-testid="result-wp">{result.valid ? result.wp.toFixed(3) : '—'}</span>
                  <span className="text-base text-purple-500"> rad/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'C = I * omega_s * omega_p | F_bearing = C / L_b (orthogonal spin and precession axes)'}</span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
