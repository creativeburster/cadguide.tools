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

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'standard-320', label: 'Delta = 36.5 deg, Radius R = 320 m', delta: '36.5', radius: '320' },
  { id: 'right-angle', label: '90-deg Bend (Delta = 90 deg, R = 150 m)', delta: '90', radius: '150' },
  { id: 'gentle-highway', label: 'Long Radius Curve (Delta = 18 deg, R = 800 m)', delta: '18', radius: '800' },
];

export default function CalculatorClient() {
  const [deltaStr, setDeltaStr] = useState('36.5');
  const [radiusStr, setRadiusStr] = useState('320');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setDeltaStr(p.delta);
    setRadiusStr(p.radius);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const delta = parseStrictFinite(deltaStr);
    const r = parseStrictFinite(radiusStr);

    if (!Number.isFinite(delta) || delta <= 0 || delta >= 180 || !Number.isFinite(r) || r <= 0) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive deflection angle 0 < Delta < 180 deg and positive curve radius R > 0 m.',
      };
    }

    const rad = (delta * Math.PI) / 180;
    const halfRad = rad / 2;
    const l = r * rad;
    const t = r * Math.tan(halfRad);
    const lc = 2 * r * Math.sin(halfRad);
    const e = r * (1 / Math.cos(halfRad) - 1);
    const m = r * (1 - Math.cos(halfRad));

    return {
      valid: true as const,
      delta,
      r,
      l,
      t,
      lc,
      e,
      m,
    };
  }, [deltaStr, radiusStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Circular Horizontal Curve Geometry (Delta=${result.delta} deg, R=${result.r} m)`,
      `Arc Length L = ${result.l.toFixed(2)} m`,
      `Tangent Distance T = ${result.t.toFixed(2)} m`,
      `Long Chord LC = ${result.lc.toFixed(2)} m`,
      `External Distance E = ${result.e.toFixed(2)} m | Middle Ordinate M = ${result.m.toFixed(2)} m`,
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
      ['Deflection Angle Delta', String(result.delta), 'deg'],
      ['Curve Radius R', String(result.r), 'm'],
      ['Curve Arc Length L', result.l.toFixed(4), 'm'],
      ['Tangent Distance T', result.t.toFixed(4), 'm'],
      ['Long Chord LC', result.lc.toFixed(4), 'm'],
      ['External Distance E', result.e.toFixed(4), 'm'],
      ['Middle Ordinate M', result.m.toFixed(4), 'm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'horizontal-curve-elements.csv';
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Simple circular horizontal curve</p>
            </div>
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Deflection / Intersection Angle Delta (deg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-delta"
              value={deltaStr}
              onChange={(e) => setDeltaStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Curve Radius R (m)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-radius"
              value={radiusStr}
              onChange={(e) => setRadiusStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
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
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Circular Curve Elements</h2>
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
                className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Curve Total Arc Length (L)</div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-l" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.l.toFixed(2) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-600">m</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tangent Distance (T)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-t">{result.valid ? result.t.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Long Chord Length (LC)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-lc">{result.valid ? result.lc.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">External Distance (E)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-e">{result.valid ? result.e.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Middle Ordinate (M)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-m">{result.valid ? result.m.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">m</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  T = R * tan(Delta/2) · L = R * Delta_rad · LC = 2 * R * sin(Delta/2) · E = R * (sec(Delta/2) - 1) · M = R * (1 - cos(Delta/2))
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
