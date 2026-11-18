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
  { id: 'default', label: 'Lab Gyroscope (3000 RPM, 0.02 kg-m2, 0.5 Nm)', n: '3000', inertia: '0.02', torque: '0.5' },
  { id: 'high-torque', label: 'Heavy Rotor (1500 RPM, 0.05 kg-m2, 1.2 Nm)', n: '1500', inertia: '0.05', torque: '1.2' },
  { id: 'cmg-fast', label: 'Fast Flywheel (10000 RPM, 0.01 kg-m2, 2.0 Nm)', n: '10000', inertia: '0.01', torque: '2.0' },
];

export default function GyroscopePrecessionCalculatorClient() {
  const [spinStr, setSpinStr] = useState('3000');
  const [inertiaStr, setInertiaStr] = useState('0.02');
  const [torqueStr, setTorqueStr] = useState('0.5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setSpinStr(p.n);
    setInertiaStr(p.inertia);
    setTorqueStr(p.torque);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const n = parseStrictPositive(spinStr);
    const I = parseStrictPositive(inertiaStr);
    const T = parseStrictNonNegative(torqueStr);

    if (!Number.isFinite(n) || !Number.isFinite(I) || !Number.isFinite(T)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive spin speed (> 0 RPM), positive moment of inertia (> 0 kg-m2), and non-negative torque (>= 0 Nm).',
      };
    }

    const ws = (2 * Math.PI * n) / 60;
    const H = I * ws;
    const opRad = T / H;
    const opDeg = (opRad * 180) / Math.PI;
    const npRpm = (opRad * 60) / (2 * Math.PI);

    return {
      valid: true as const,
      n,
      I,
      T,
      ws,
      H,
      opRad,
      opDeg,
      npRpm,
    };
  }, [spinStr, inertiaStr, torqueStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Gyroscope Precession Summary',
      `Spin Speed = ${result.n} RPM (${result.ws.toFixed(2)} rad/s), I = ${result.I} kg-m2, T = ${result.T} Nm`,
      `Spin Angular Momentum H = ${result.H.toFixed(4)} N-m-s`,
      `Precession Rate = ${result.opRad.toFixed(6)} rad/s (${result.opDeg.toFixed(3)} deg/s, ${result.npRpm.toFixed(4)} RPM)`,
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
      ['Spin Speed n', String(result.n), 'RPM'],
      ['Polar Moment of Inertia I', String(result.I), 'kg-m2'],
      ['Applied Orthogonal Torque T', String(result.T), 'Nm'],
      ['Spin Angular Velocity omega_s', result.ws.toFixed(4), 'rad/s'],
      ['Spin Angular Momentum H', result.H.toFixed(6), 'N-m-s'],
      ['Precession Angular Velocity Omega_p', result.opRad.toFixed(6), 'rad/s'],
      ['Precession Rate (Degrees)', result.opDeg.toFixed(4), 'deg/s'],
      ['Precession Speed', result.npRpm.toFixed(4), 'RPM'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gyroscope-precession.csv';
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Spin Speed n (RPM)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-spin"
                value={spinStr}
                onChange={(e) => setSpinStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
              />
            </div>

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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Applied Torque T (Nm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-torque"
                value={torqueStr}
                onChange={(e) => setTorqueStr(e.target.value)}
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Precession Rate</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-op-rad">{result.valid ? result.opRad.toFixed(6) : '—'}</span>
                  <span className="text-lg text-blue-500"> rad/s</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Angular Velocity</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-op-deg">{result.valid ? result.opDeg.toFixed(3) : '—'}</span>
                  <span className="text-lg text-green-600"> deg/s</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Precession RPM</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-op-rpm">{result.valid ? result.npRpm.toFixed(4) : '—'}</span>
                  <span className="text-base text-orange-500"> RPM</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Spin Angular Momentum H</div>
                <div className="text-2xl font-black text-purple-800">
                  <span data-testid="result-momentum">{result.valid ? result.H.toFixed(4) : '—'}</span>
                  <span className="text-base text-purple-500"> N-m-s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'omega_s = 2*pi*n/60 | H = I * omega_s | Omega_p = T / H'}</span>
              </div>
              <p className="text-xs text-slate-500">
                Steady-state rigid-body orthogonal precession formula valid when nutation is damped and precession angular speed is small compared to spin speed (Omega_p &lt;&lt; omega_s).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
