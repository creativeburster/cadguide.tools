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
  { id: 'default', label: 'Solid Disk (m=50 kg, ro=0.5 m, ri=0)', m: '50', ro: '0.5', ri: '0', rpm: '300', cs: '0.05' },
  { id: 'annular-rim', label: 'Hollow Rim (ri=0.3 m)', m: '50', ro: '0.5', ri: '0.3', rpm: '300', cs: '0.05' },
  { id: 'high-speed', label: 'High-Speed Rotor (1500 RPM)', m: '25', ro: '0.4', ri: '0.2', rpm: '1500', cs: '0.02' },
];

export default function FlywheelEnergyCalculatorClient() {
  const [mStr, setMStr] = useState('50');
  const [roStr, setRoStr] = useState('0.5');
  const [riStr, setRiStr] = useState('0');
  const [rpmStr, setRpmStr] = useState('300');
  const [csStr, setCsStr] = useState('0.05');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMStr(p.m);
    setRoStr(p.ro);
    setRiStr(p.ri);
    setRpmStr(p.rpm);
    setCsStr(p.cs);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const m = parseStrictPositive(mStr);
    const ro = parseStrictPositive(roStr);
    const ri = parseStrictNonNegative(riStr);
    const rpm = parseStrictPositive(rpmStr);
    const cs = parseStrictNonNegative(csStr);

    if (!Number.isFinite(m) || !Number.isFinite(ro) || !Number.isFinite(ri) || !Number.isFinite(rpm) || !Number.isFinite(cs)) {
      return { valid: false as const, errorMsg: 'Enter valid positive mass, outer radius, and speed RPM; non-negative inner radius and Cs.' };
    }
    if (ri >= ro) {
      return { valid: false as const, errorMsg: 'Inner radius ri must be strictly smaller than outer radius ro (0 <= ri < ro).' };
    }

    const omega = (2 * Math.PI * rpm) / 60;
    const I = 0.5 * m * (ro * ro + ri * ri);
    const Ek = 0.5 * I * omega * omega;
    const dE = I * omega * omega * cs;
    const vRim = omega * ro;

    return {
      valid: true as const,
      m,
      ro,
      ri,
      rpm,
      cs,
      omega,
      I,
      Ek,
      dE,
      vRim,
    };
  }, [mStr, roStr, riStr, rpmStr, csStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Flywheel Inertia & Kinetic Energy Summary`,
      `m=${result.m} kg, ro=${result.ro} m, ri=${result.ri} m, n=${result.rpm} RPM (omega=${result.omega.toFixed(4)} rad/s)`,
      `Moment of Inertia I = ${result.I.toFixed(4)} kg*m2`,
      `Total Kinetic Energy Ek = ${result.Ek.toFixed(2)} J`,
      `Cyclic Fluctuation Energy dE (Cs=${result.cs}) = ${result.dE.toFixed(2)} J`,
      `Outer Rim Speed v_rim = ${result.vRim.toFixed(3)} m/s`,
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
      ['Mass m', String(result.m), 'kg'],
      ['Outer Radius ro', String(result.ro), 'm'],
      ['Inner Radius ri', String(result.ri), 'm'],
      ['Speed n', String(result.rpm), 'RPM'],
      ['Fluctuation Coefficient Cs', String(result.cs), '-'],
      ['Angular Velocity omega', result.omega.toFixed(4), 'rad/s'],
      ['Moment of Inertia I', result.I.toFixed(4), 'kg*m2'],
      ['Kinetic Energy Ek', result.Ek.toFixed(2), 'J'],
      ['Cyclic Energy Delta dE', result.dE.toFixed(2), 'J'],
      ['Outer Rim Peripheral Speed', result.vRim.toFixed(3), 'm/s'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flywheel-energy-inertia.csv';
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
            <h2 className="text-lg font-black text-slate-900">Inputs</h2>
          </div>

          {[
            { id: 'mass', label: 'Rotor Mass m (kg)', val: mStr, set: setMStr },
            { id: 'ro', label: 'Outer Radius ro (m)', val: roStr, set: setRoStr },
            { id: 'ri', label: 'Inner Radius ri (m, 0 for disk)', val: riStr, set: setRiStr },
            { id: 'rpm', label: 'Rotational Speed n (RPM)', val: rpmStr, set: setRpmStr },
            { id: 'cs', label: 'Speed Fluctuation Coeff Cs', val: csStr, set: setCsStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
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
                <h2 className="text-lg font-black text-slate-900">Results</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Moment of Inertia I</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-inertia">{result.valid ? result.I.toFixed(4) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">kg·m2</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Stored Kinetic Energy Ek</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-ek">{result.valid ? result.Ek.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">J</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Cyclic Energy Delta dE</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-de">{result.valid ? result.dE.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">J</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Outer Rim Speed</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-vrim">{result.valid ? result.vRim.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">m/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Rigid uniform cylinder/annulus formulas: I = 0.5*m*(ro^2 + ri^2), omega = 2*pi*n/60, Ek = 0.5*I*omega^2, dE = I*omega^2*Cs, v_rim = omega*ro.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
