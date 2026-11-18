'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type HarmonicConfig = 'flexspline_out' | 'circular_out';

const STRICT_INT_RE = /^[+-]?\d+$/;
const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictIntAtLeast(raw: string, minVal: number): number {
  const s = raw.trim();
  if (!STRICT_INT_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= minVal ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function parseEfficiency(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS: {
  id: string;
  label: string;
  config: HarmonicConfig;
  zs: string;
  zf: string;
  n1: string;
  t1: string;
  eta: string;
}[] = [
  { id: 'ratio100', label: '100:1 Flexspline Out (202/200, 3000 RPM, 5 Nm)', config: 'flexspline_out', zs: '202', zf: '200', n1: '3000', t1: '5', eta: '85' },
  { id: 'ratio50', label: '50:1 Flexspline Out (102/100, 2000 RPM, 4 Nm)', config: 'flexspline_out', zs: '102', zf: '100', n1: '2000', t1: '4', eta: '85' },
  { id: 'circular-out', label: '101:1 Circular Out (202/200, 3000 RPM, 5 Nm)', config: 'circular_out', zs: '202', zf: '200', n1: '3000', t1: '5', eta: '85' },
];

export default function HarmonicDriveCalculatorClient() {
  const [config, setConfig] = useState<HarmonicConfig>('flexspline_out');
  const [zsStr, setZsStr] = useState('202');
  const [zfStr, setZfStr] = useState('200');
  const [n1Str, setN1Str] = useState('3000');
  const [t1Str, setT1Str] = useState('5');
  const [etaStr, setEtaStr] = useState('85');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setConfig(p.config);
    setZsStr(p.zs);
    setZfStr(p.zf);
    setN1Str(p.n1);
    setT1Str(p.t1);
    setEtaStr(p.eta);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const zs = parseStrictIntAtLeast(zsStr, 22);
    const zf = parseStrictIntAtLeast(zfStr, 20);
    const n1 = parseStrictNonNegative(n1Str);
    const t1 = parseStrictNonNegative(t1Str);
    const etaPct = parseEfficiency(etaStr);

    if (!Number.isFinite(zs) || !Number.isFinite(zf) || !Number.isFinite(n1) || !Number.isFinite(t1) || !Number.isFinite(etaPct)) {
      return {
        valid: false as const,
        errorMsg: 'Enter integer tooth counts (Z_f >= 20, Z_s >= 22), non-negative speed/torque, and efficiency in (0, 100]%.',
      };
    }

    if (zs <= zf) {
      return {
        valid: false as const,
        errorMsg: 'Circular spline teeth Z_s must be strictly greater than flexspline teeth Z_f (typically Z_s - Z_f = 2).',
      };
    }

    const diff = zs - zf;
    const ratio = config === 'flexspline_out' ? zf / diff : zs / diff;
    const n2 = n1 / ratio;
    const t2 = t1 * ratio * (etaPct / 100);
    const p2Kw = (2 * Math.PI * n2 * t2) / 60000;

    return {
      valid: true as const,
      zs,
      zf,
      diff,
      n1,
      t1,
      etaPct,
      ratio,
      n2,
      t2,
      p2Kw,
    };
  }, [config, zsStr, zfStr, n1Str, t1Str, etaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Harmonic (Strain Wave) Drive Summary',
      `Configuration: ${config === 'flexspline_out' ? 'Circular Spline Fixed / Flexspline Output' : 'Flexspline Fixed / Circular Spline Output'}`,
      `Circular Spline Z_s = ${result.zs}, Flexspline Z_f = ${result.zf} (dZ = ${result.diff})`,
      `Reduction Ratio = ${result.ratio.toFixed(2)} : 1`,
      `Output Speed = ${result.n2.toFixed(3)} RPM (from ${result.n1} RPM)`,
      `Output Torque = ${result.t2.toFixed(2)} Nm (from ${result.t1} Nm at ${result.etaPct}% efficiency)`,
      `Output Shaft Power = ${result.p2Kw.toFixed(3)} kW`,
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
      ['Kinematics Configuration', config === 'flexspline_out' ? 'Flexspline Output' : 'Circular Spline Output', '-'],
      ['Circular Spline Teeth Z_s', String(result.zs), 'teeth'],
      ['Flexspline Teeth Z_f', String(result.zf), 'teeth'],
      ['Input Speed n_1', String(result.n1), 'RPM'],
      ['Input Torque T_1', String(result.t1), 'Nm'],
      ['Drive Efficiency eta', String(result.etaPct), '%'],
      ['Reduction Ratio i', result.ratio.toFixed(4), ':1'],
      ['Output Speed n_2', result.n2.toFixed(4), 'RPM'],
      ['Output Torque T_2', result.t2.toFixed(4), 'Nm'],
      ['Output Mechanical Power P_2', result.p2Kw.toFixed(6), 'kW'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'harmonic-drive-kinematics.csv';
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Drive Configuration</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="btn-config-flexspline"
                onClick={() => setConfig('flexspline_out')}
                className={`px-3 py-2 rounded-xl text-xs font-black border text-left transition-all cursor-pointer ${
                  config === 'flexspline_out'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Circular Spline Fixed / Flexspline Out (i = Z_f / dZ)
              </button>
              <button
                type="button"
                data-testid="btn-config-circular"
                onClick={() => setConfig('circular_out')}
                className={`px-3 py-2 rounded-xl text-xs font-black border text-left transition-all cursor-pointer ${
                  config === 'circular_out'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Flexspline Fixed / Circular Spline Out (i = Z_s / dZ)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Circular Spline Teeth Z_s</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-zs"
                value={zsStr}
                onChange={(e) => setZsStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flexspline Teeth Z_f</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-zf"
                value={zfStr}
                onChange={(e) => setZfStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Wave Generator Input Speed (RPM)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-n1"
                value={n1Str}
                onChange={(e) => setN1Str(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Input Torque T_1 (Nm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-t1"
                value={t1Str}
                onChange={(e) => setT1Str(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Efficiency eta (%)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-eta"
                value={etaStr}
                onChange={(e) => setEtaStr(e.target.value)}
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Reduction Ratio</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-ratio">{result.valid ? result.ratio.toFixed(2) : '—'}</span>
                  <span className="text-lg text-blue-500"> :1</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Output Speed</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-n2">{result.valid ? result.n2.toFixed(3) : '—'}</span>
                  <span className="text-lg text-green-600"> RPM</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Output Torque</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-t2">{result.valid ? result.t2.toFixed(2) : '—'}</span>
                  <span className="text-lg text-orange-500"> Nm</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Output Mechanical Power</div>
                <div className="text-3xl font-black text-purple-800">
                  <span data-testid="result-power">{result.valid ? result.p2Kw.toFixed(3) : '—'}</span>
                  <span className="text-lg text-purple-500"> kW</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'Flexspline Out: |i| = Z_f / (Z_s - Z_f) | Circular Out: i = Z_s / (Z_s - Z_f) | T_2 = T_1 * |i| * eta'}</span>
              </div>
              <p className="text-xs text-slate-500">
                With circular spline fixed and flexspline driving the output, output rotation is opposite to the wave generator. Efficiency depends on speed, lubrication, and temperature per manufacturer catalog curves.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
