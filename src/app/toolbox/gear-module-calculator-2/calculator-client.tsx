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

const PRESETS = [
  { id: 'default', label: '60 mm Pitch Dia / 20T (m=3)', dia: '60', teeth: '20', alpha: '20' },
  { id: 'm4-25t', label: '100 mm Pitch Dia / 25T (m=4)', dia: '100', teeth: '25', alpha: '20' },
  { id: 'fine-m1', label: '40 mm Pitch Dia / 40T (m=1)', dia: '40', teeth: '40', alpha: '20' },
];

export default function GearModuleCalculator2Client() {
  const [diaStr, setDiaStr] = useState('60');
  const [teethStr, setTeethStr] = useState('20');
  const [alphaStr, setAlphaStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setDiaStr(p.dia);
    setTeethStr(p.teeth);
    setAlphaStr(p.alpha);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const d = parseStrictPositive(diaStr);
    const z = parseStrictPositive(teethStr);
    const alpha = parseStrictPositive(alphaStr);

    if (!Number.isFinite(d) || !Number.isFinite(z) || !Number.isFinite(alpha) || alpha >= 45) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive pitch diameter d, teeth count z, and pressure angle (0 < alpha < 45 deg).',
      };
    }

    const m = d / z;
    const circularPitch = Math.PI * m;
    const diametralPitch = 25.4 / m;
    const tipDiameter = d + 2 * m;
    const rootDiameter = d - 2.5 * m;
    const baseDiameter = d * Math.cos((alpha * Math.PI) / 180);

    if (rootDiameter <= 0) {
      return {
        valid: false as const,
        errorMsg: 'Computed root diameter is non-positive (increase teeth count z for standard 1.25m dedendum).',
      };
    }

    return {
      valid: true as const,
      d,
      z,
      alpha,
      m,
      circularPitch,
      diametralPitch,
      tipDiameter,
      rootDiameter,
      baseDiameter,
    };
  }, [diaStr, teethStr, alphaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Gear Module & Pitch Conversion Summary`,
      `d=${result.d} mm, z=${result.z}, alpha=${result.alpha} deg`,
      `Metric Module m = ${result.m.toFixed(4)} mm`,
      `Circular Pitch p = ${result.circularPitch.toFixed(4)} mm`,
      `Imperial Diametral Pitch Pd = ${result.diametralPitch.toFixed(4)} 1/in`,
      `Tip Dia da = ${result.tipDiameter.toFixed(4)} mm, Root Dia df = ${result.rootDiameter.toFixed(4)} mm, Base Dia db = ${result.baseDiameter.toFixed(4)} mm`,
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
      ['Pitch Diameter d', String(result.d), 'mm'],
      ['Teeth Count z', String(result.z), '-'],
      ['Pressure Angle alpha', String(result.alpha), 'deg'],
      ['Metric Module m', result.m.toFixed(4), 'mm'],
      ['Circular Pitch p', result.circularPitch.toFixed(4), 'mm'],
      ['Diametral Pitch Pd', result.diametralPitch.toFixed(4), '1/in'],
      ['Tip Diameter da', result.tipDiameter.toFixed(4), 'mm'],
      ['Root Diameter df', result.rootDiameter.toFixed(4), 'mm'],
      ['Base Diameter db', result.baseDiameter.toFixed(4), 'mm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-module-pitch-summary.csv';
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
            <h2 className="text-lg font-black text-slate-900">Gear Inputs</h2>
          </div>

          {[
            { id: 'dia', label: 'Pitch Diameter d (mm)', val: diaStr, set: setDiaStr },
            { id: 'teeth', label: 'Number of Teeth z', val: teethStr, set: setTeethStr },
            { id: 'alpha', label: 'Pressure Angle alpha (deg)', val: alphaStr, set: setAlphaStr },
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
                <h2 className="text-lg font-black text-slate-900">Module, Pitch &amp; Blank Diameters</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Metric Module m</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-module">{result.valid ? result.m.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Circular Pitch p</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-circular">{result.valid ? result.circularPitch.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Diametral Pitch Pd</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-dp">{result.valid ? result.diametralPitch.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">1/in</span>
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
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Base Diameter db</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-base">{result.valid ? result.baseDiameter.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Standard full-depth spur gear formulas: m = d/z, p = pi*m, Pd = 25.4/m (using 1 in = 25.4 mm exact), da = d + 2*m, df = d - 2.5*m, db = d*cos(alpha).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
