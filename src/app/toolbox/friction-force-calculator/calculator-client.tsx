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

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'ramp-15', label: 'Incline 15 deg (Static Check)', mass: '100', angle: '15', mus: '0.35', muk: '0.30', g: '9.80665' },
  { id: 'ramp-25', label: 'Steep Incline 25 deg (Sliding)', mass: '100', angle: '25', mus: '0.35', muk: '0.30', g: '9.80665' },
  { id: 'flat', label: 'Flat Surface (0 deg)', mass: '100', angle: '0', mus: '0.35', muk: '0.30', g: '9.80665' },
];

export default function FrictionForceCalculatorClient() {
  const [massStr, setMassStr] = useState('100');
  const [angleStr, setAngleStr] = useState('15');
  const [musStr, setMusStr] = useState('0.35');
  const [mukStr, setMukStr] = useState('0.30');
  const [gStr, setGStr] = useState('9.80665');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMassStr(p.mass);
    setAngleStr(p.angle);
    setMusStr(p.mus);
    setMukStr(p.muk);
    setGStr(p.g);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const mass = parseStrictPositive(massStr);
    const angle = parseStrictNonNegative(angleStr);
    const mus = parseStrictNonNegative(musStr);
    const muk = parseStrictNonNegative(mukStr);
    const g = parseStrictPositive(gStr);

    if (!Number.isFinite(mass) || !Number.isFinite(angle) || !Number.isFinite(mus) || !Number.isFinite(muk) || !Number.isFinite(g) || angle >= 90) {
      return {
        valid: false as const,
        errorMsg: 'Enter positive mass and gravity, non-negative mu_s / mu_k, and incline angle in [0, 90) degrees.',
      };
    }

    const rad = (angle * Math.PI) / 180;
    const normalN = mass * g * Math.cos(rad);
    const gravityParallelN = mass * g * Math.sin(rad);
    const staticMaxN = mus * normalN;
    const kineticN = muk * normalN;
    const critAngleDeg = (Math.atan(mus) * 180) / Math.PI;
    const isStatic = gravityParallelN <= staticMaxN + 1e-9;
    const minHoldForceN = isStatic ? 0 : Math.max(0, gravityParallelN - staticMaxN);
    const netAccelMs2 = isStatic ? 0 : Math.max(0, g * (Math.sin(rad) - muk * Math.cos(rad)));

    return {
      valid: true as const,
      mass,
      angle,
      mus,
      muk,
      g,
      normalN,
      gravityParallelN,
      staticMaxN,
      kineticN,
      critAngleDeg,
      isStatic,
      minHoldForceN,
      netAccelMs2,
    };
  }, [massStr, angleStr, musStr, mukStr, gStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Coulomb Inclined Plane Friction Summary`,
      `m=${result.mass} kg, theta=${result.angle} deg, mu_s=${result.mus}, mu_k=${result.muk}, g=${result.g} m/s2`,
      `Normal Force N = ${result.normalN.toFixed(2)} N`,
      `Gravity Down-Slope Component Fg = ${result.gravityParallelN.toFixed(2)} N`,
      `Max Static Friction Fs_max = ${result.staticMaxN.toFixed(2)} N`,
      `Kinetic Sliding Friction Fk = ${result.kineticN.toFixed(2)} N`,
      `Self-Locking Critical Angle = ${result.critAngleDeg.toFixed(2)} deg (${result.isStatic ? 'STATIC' : 'SLIDING'})`,
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
      ['Mass m', String(result.mass), 'kg'],
      ['Incline Angle theta', String(result.angle), 'deg'],
      ['Static Friction Coefficient mu_s', String(result.mus), '-'],
      ['Kinetic Friction Coefficient mu_k', String(result.muk), '-'],
      ['Gravity g', String(result.g), 'm/s2'],
      ['Normal Force N', result.normalN.toFixed(2), 'N'],
      ['Gravity Parallel Component Fg', result.gravityParallelN.toFixed(2), 'N'],
      ['Max Static Friction Fs_max', result.staticMaxN.toFixed(2), 'N'],
      ['Kinetic Friction Fk', result.kineticN.toFixed(2), 'N'],
      ['Critical Friction Angle theta_crit', result.critAngleDeg.toFixed(2), 'deg'],
      ['Motion State', result.isStatic ? 'STATIC (Self-Locking)' : 'SLIDING', '-'],
      ['Downslope Acceleration a_net', result.netAccelMs2.toFixed(3), 'm/s2'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'friction-force-analysis.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Contact &amp; Slope</h2>
          </div>

          {[
            { id: 'mass', label: 'Block Mass m (kg)', val: massStr, set: setMassStr },
            { id: 'angle', label: 'Incline Angle theta (deg, < 90)', val: angleStr, set: setAngleStr },
            { id: 'mus', label: 'Static Friction Coeff mu_s', val: musStr, set: setMusStr },
            { id: 'muk', label: 'Kinetic Friction Coeff mu_k', val: mukStr, set: setMukStr },
            { id: 'g', label: 'Gravity g (m/s2)', val: gStr, set: setGStr },
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
                <div>
                  <h2 className="text-lg font-black text-slate-900">Equilibrium &amp; Friction Forces</h2>
                  <p className="text-xs font-bold text-slate-500">
                    State:{' '}
                    <span
                      data-testid="result-state"
                      className={result.valid ? (result.isStatic ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-500'}
                    >
                      {result.valid ? (result.isStatic ? 'STATIC (Self-Locking)' : 'SLIDING (Unbalanced)') : '—'}
                    </span>
                  </p>
                </div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Normal Force N</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-normal">{result.valid ? result.normalN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">N</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Max Static Friction Fs_max</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-static-max">{result.valid ? result.staticMaxN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">N</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Kinetic Friction Fk</div>
                <div className="text-2xl font-black text-amber-900">
                  <span data-testid="result-kinetic">{result.valid ? result.kineticN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-amber-500">N</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Gravity Component Fg</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-gravity">{result.valid ? result.gravityParallelN.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">N</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Critical Friction Angle</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-crit-angle">{result.valid ? result.critAngleDeg.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">deg</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Downslope Accel. a_net</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-accel">{result.valid ? result.netAccelMs2.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">m/s2</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Coulomb dry friction model: N = m*g*cos(theta), Fg = m*g*sin(theta), Fs_max = mu_s*N, Fk = mu_k*N, theta_crit = atan(mu_s). Standard gravity default g = 9.80665 m/s2 (NIST SP 811).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
