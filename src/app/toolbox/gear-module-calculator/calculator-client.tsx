'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download, Copy, Check, RotateCcw, AlertTriangle, Zap } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const QUICK_MODULES = ['1.0', '1.25', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0'];

export default function GearModuleClient() {
  const [solveFor, setSolveFor] = useState<'module' | 'teeth' | 'pitchDiameter'>('module');
  const [moduleStr, setModuleStr] = useState('2.0');
  const [teethStr, setTeethStr] = useState('24');
  const [pitchDiaStr, setPitchDiaStr] = useState('48');
  const [teeth2Str, setTeeth2Str] = useState('36');
  const [alphaStr, setAlphaStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setSolveFor('module');
    setModuleStr('2.0');
    setTeethStr('24');
    setPitchDiaStr('48');
    setTeeth2Str('36');
    setAlphaStr('20');
    setCopied(false);
  };

  const result = useMemo(() => {
    const z2 = parseStrictPositive(teeth2Str);
    const alpha = parseStrictPositive(alphaStr);
    if (!Number.isFinite(z2) || !Number.isFinite(alpha) || alpha >= 45) {
      return { valid: false as const, errorMsg: 'Enter valid positive mating gear teeth z2 and pressure angle (0 < alpha < 45 deg).' };
    }

    let m = Number.NaN;
    let z = Number.NaN;
    let d = Number.NaN;

    if (solveFor === 'module') {
      d = parseStrictPositive(pitchDiaStr);
      z = parseStrictPositive(teethStr);
      if (!Number.isFinite(d) || !Number.isFinite(z)) {
        return { valid: false as const, errorMsg: 'Enter strictly positive pitch diameter d and teeth z1.' };
      }
      m = d / z;
    } else if (solveFor === 'teeth') {
      d = parseStrictPositive(pitchDiaStr);
      m = parseStrictPositive(moduleStr);
      if (!Number.isFinite(d) || !Number.isFinite(m)) {
        return { valid: false as const, errorMsg: 'Enter strictly positive pitch diameter d and module m.' };
      }
      z = d / m;
    } else {
      m = parseStrictPositive(moduleStr);
      z = parseStrictPositive(teethStr);
      if (!Number.isFinite(m) || !Number.isFinite(z)) {
        return { valid: false as const, errorMsg: 'Enter strictly positive module m and teeth z1.' };
      }
      d = m * z;
    }

    const addendum = m;
    const dedendum = 1.25 * m;
    const tipDiameter = d + 2 * addendum;
    const rootDiameter = d - 2 * dedendum;
    const circularPitch = Math.PI * m;
    const baseDiameter = d * Math.cos((alpha * Math.PI) / 180);
    const centerDistance = (m * (z + z2)) / 2;

    if (rootDiameter <= 0) {
      return { valid: false as const, errorMsg: 'Computed root diameter is non-positive (teeth count too small for full-depth 1.25m dedendum).' };
    }

    return {
      valid: true as const,
      m,
      z,
      d,
      z2,
      alpha,
      addendum,
      dedendum,
      tipDiameter,
      rootDiameter,
      circularPitch,
      baseDiameter,
      centerDistance,
    };
  }, [solveFor, moduleStr, teethStr, pitchDiaStr, teeth2Str, alphaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Metric Spur Gear Geometry Summary`,
      `SolveFor=${solveFor}, m=${result.m.toFixed(4)} mm, z1=${result.z.toFixed(2)}, z2=${result.z2}, alpha=${result.alpha} deg`,
      `Pitch Diameter d = ${result.d.toFixed(4)} mm`,
      `Tip Diameter da = ${result.tipDiameter.toFixed(4)} mm`,
      `Root Diameter df = ${result.rootDiameter.toFixed(4)} mm`,
      `Base Diameter db = ${result.baseDiameter.toFixed(4)} mm`,
      `Circular Pitch p = ${result.circularPitch.toFixed(4)} mm`,
      `Mating Center Distance a = ${result.centerDistance.toFixed(4)} mm`,
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
      ['Solved For', solveFor, '-'],
      ['Module m', result.m.toFixed(4), 'mm'],
      ['Teeth z1', result.z.toFixed(2), '-'],
      ['Mating Gear Teeth z2', String(result.z2), '-'],
      ['Pressure Angle alpha', String(result.alpha), 'deg'],
      ['Pitch Diameter d = m*z1', result.d.toFixed(4), 'mm'],
      ['Tip Diameter da = d + 2*m', result.tipDiameter.toFixed(4), 'mm'],
      ['Root Diameter df = d - 2.5*m', result.rootDiameter.toFixed(4), 'mm'],
      ['Base Diameter db = d*cos(alpha)', result.baseDiameter.toFixed(4), 'mm'],
      ['Circular Pitch p = pi*m', result.circularPitch.toFixed(4), 'mm'],
      ['Addendum ha = m', result.addendum.toFixed(4), 'mm'],
      ['Dedendum hf = 1.25*m', result.dedendum.toFixed(4), 'mm'],
      ['Center Distance a = m*(z1+z2)/2', result.centerDistance.toFixed(4), 'mm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-module-geometry.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scaleFactor = result.valid && result.tipDiameter > 0 ? 120 / (result.tipDiameter / 2) : 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'module', label: 'Solve Module (m)' },
            { id: 'teeth', label: 'Solve Teeth (z1)' },
            { id: 'pitchDiameter', label: 'Solve Pitch Dia (d)' },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              data-testid={`mode-${opt.id}`}
              onClick={() => setSolveFor(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                solveFor === opt.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
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
            <h2 className="text-lg font-black text-slate-900">Gear Parameters</h2>
          </div>

          {solveFor !== 'module' && (
            <div>
              <label htmlFor="input-module" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Module m (mm)
              </label>
              <input
                id="input-module"
                data-testid="input-module"
                type="text"
                inputMode="decimal"
                value={moduleStr}
                onChange={(e) => setModuleStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_MODULES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModuleStr(m)}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {solveFor !== 'teeth' && (
            <div>
              <label htmlFor="input-teeth" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Teeth Count z1
              </label>
              <input
                id="input-teeth"
                data-testid="input-teeth"
                type="text"
                inputMode="decimal"
                value={teethStr}
                onChange={(e) => setTeethStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          )}

          {solveFor !== 'pitchDiameter' && (
            <div>
              <label htmlFor="input-pitch-dia" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Pitch Diameter d (mm)
              </label>
              <input
                id="input-pitch-dia"
                data-testid="input-pitch-dia"
                type="text"
                inputMode="decimal"
                value={pitchDiaStr}
                onChange={(e) => setPitchDiaStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          )}

          <div>
            <label htmlFor="input-teeth2" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Mating Gear Teeth z2
            </label>
            <input
              id="input-teeth2"
              data-testid="input-teeth2"
              type="text"
              inputMode="decimal"
              value={teeth2Str}
              onChange={(e) => setTeeth2Str(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-alpha" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Pressure Angle alpha (deg)
            </label>
            <input
              id="input-alpha"
              data-testid="input-alpha"
              type="text"
              inputMode="decimal"
              value={alphaStr}
              onChange={(e) => setAlphaStr(e.target.value)}
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
                <h2 className="text-lg font-black text-slate-900">Spur Gear Dimensions</h2>
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Module m</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-module">{result.valid ? result.m.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Teeth z1</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-teeth">{result.valid ? result.z.toFixed(2) : '—'}</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Pitch Diameter d</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-pitch-dia">{result.valid ? result.d.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Tip Diameter da</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-tip">{result.valid ? result.tipDiameter.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Root Diameter df</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-root">{result.valid ? result.rootDiameter.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Circular Pitch p</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-pitch">{result.valid ? result.circularPitch.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Base Diameter db</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-base">{result.valid ? result.baseDiameter.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 col-span-2">
                <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Center Distance a = m*(z1+z2)/2</div>
                <div className="text-2xl font-black text-indigo-900">
                  <span data-testid="result-center">{result.valid ? result.centerDistance.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-indigo-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Standard full-depth metric spur gear geometry (unshifted): m = d/z, ha = m, hf = 1.25m, da = d + 2m, df = d - 2.5m, p = pi*m, db = d*cos(alpha), a = m*(z1+z2)/2.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Concentric Reference Circles</h3>
            {result.valid ? (
              <div className="flex justify-center">
                <svg data-testid="gear-svg" viewBox="0 0 300 300" className="w-full max-w-[260px]">
                  <circle cx="150" cy="150" r={(result.tipDiameter / 2) * scaleFactor} fill="none" stroke="#1e40af" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r={(result.d / 2) * scaleFactor} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="150" cy="150" r={(result.baseDiameter / 2) * scaleFactor} fill="none" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2 2" />
                  <circle cx="150" cy="150" r={(result.rootDiameter / 2) * scaleFactor} fill="none" stroke="#93c5fd" strokeWidth="1.2" />
                  <circle cx="150" cy="150" r="3" fill="#1e40af" />
                </svg>
              </div>
            ) : (
              <div className="text-center py-8 text-xs font-bold text-slate-400">Enter valid gear parameters to render geometry circles.</div>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
