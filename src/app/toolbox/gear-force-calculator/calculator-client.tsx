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
  { id: 'helical', label: 'Helical Gear (beta = 15 deg)', torque: '200', dia: '100', alpha: '20', beta: '15' },
  { id: 'spur', label: 'Spur Gear (beta = 0 deg)', torque: '200', dia: '100', alpha: '20', beta: '0' },
  { id: 'heavy-helical', label: 'High-Helix Stage (beta = 25 deg)', torque: '450', dia: '150', alpha: '20', beta: '25' },
];

export default function GearForceCalculatorClient() {
  const [torqueStr, setTorqueStr] = useState('200');
  const [diaStr, setDiaStr] = useState('100');
  const [alphaStr, setAlphaStr] = useState('20');
  const [betaStr, setBetaStr] = useState('15');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setTorqueStr(p.torque);
    setDiaStr(p.dia);
    setAlphaStr(p.alpha);
    setBetaStr(p.beta);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const torque = parseStrictPositive(torqueStr);
    const dia = parseStrictPositive(diaStr);
    const alphaN = parseStrictPositive(alphaStr);
    const beta = parseStrictNonNegative(betaStr);

    if (
      !Number.isFinite(torque) ||
      !Number.isFinite(dia) ||
      !Number.isFinite(alphaN) ||
      !Number.isFinite(beta) ||
      alphaN >= 60 ||
      beta >= 60
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter positive torque, pitch diameter, normal pressure angle (0 < alpha_n < 60 deg), and helix angle (0 <= beta < 60 deg).',
      };
    }

    const alphaRad = (alphaN * Math.PI) / 180;
    const betaRad = (beta * Math.PI) / 180;
    const ft = (2000 * torque) / dia;
    const fr = (ft * Math.tan(alphaRad)) / Math.cos(betaRad);
    const fa = ft * Math.tan(betaRad);
    const fn = Math.sqrt(ft * ft + fr * fr + fa * fa);
    const alphaTransDeg = (Math.atan(Math.tan(alphaRad) / Math.cos(betaRad)) * 180) / Math.PI;

    return {
      valid: true as const,
      torque,
      dia,
      alphaN,
      beta,
      ft,
      fr,
      fa,
      fn,
      alphaTransDeg,
    };
  }, [torqueStr, diaStr, alphaStr, betaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Involute Gear Mesh Forces Summary`,
      `T=${result.torque} N*m, d=${result.dia} mm, alpha_n=${result.alphaN} deg, beta=${result.beta} deg`,
      `Tangential Force Ft = ${result.ft.toFixed(2)} N`,
      `Radial Force Fr = ${result.fr.toFixed(2)} N`,
      `Axial Thrust Force Fa = ${result.fa.toFixed(2)} N`,
      `Total Normal Mesh Force Fn = ${result.fn.toFixed(2)} N`,
      `Transverse Pressure Angle alpha_t = ${result.alphaTransDeg.toFixed(2)} deg`,
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
      ['Transmitted Torque T', String(result.torque), 'N*m'],
      ['Pitch Circle Diameter d', String(result.dia), 'mm'],
      ['Normal Pressure Angle alpha_n', String(result.alphaN), 'deg'],
      ['Helix Angle beta', String(result.beta), 'deg'],
      ['Tangential Force Ft', result.ft.toFixed(2), 'N'],
      ['Radial Separating Force Fr', result.fr.toFixed(2), 'N'],
      ['Axial Thrust Force Fa', result.fa.toFixed(2), 'N'],
      ['Total Normal Force Fn', result.fn.toFixed(2), 'N'],
      ['Transverse Pressure Angle alpha_t', result.alphaTransDeg.toFixed(2), 'deg'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-mesh-forces.csv';
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
            <h2 className="text-lg font-black text-slate-900">Gear Mesh Inputs</h2>
          </div>

          {[
            { id: 'torque', label: 'Transmitted Torque T (N*m)', val: torqueStr, set: setTorqueStr },
            { id: 'dia', label: 'Pitch Circle Diameter d (mm)', val: diaStr, set: setDiaStr },
            { id: 'alpha', label: 'Normal Pressure Angle alpha_n (deg)', val: alphaStr, set: setAlphaStr },
            { id: 'beta', label: 'Helix Angle beta (deg, 0 for spur)', val: betaStr, set: setBetaStr },
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
                <h2 className="text-lg font-black text-slate-900">Mesh Force Components</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Tangential Force Ft</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-ft">{result.valid ? result.ft.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">N</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Radial Force Fr</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-fr">{result.valid ? result.fr.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">N</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Axial Thrust Fa</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-fa">{result.valid ? result.fa.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">N</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Total Normal Force Fn</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-fn">{result.valid ? result.fn.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">N</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 sm:col-span-2 lg:col-span-2">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Transverse Pressure Angle alpha_t</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-alpha-t">{result.valid ? result.alphaTransDeg.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">deg</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Involute helical/spur gear mesh force balance: Ft = 2000*T/d, Fr = Ft*tan(alpha_n)/cos(beta), Fa = Ft*tan(beta), Fn = sqrt(Ft^2 + Fr^2 + Fa^2), tan(alpha_t) = tan(alpha_n)/cos(beta). Use Fr and Fa to calculate shaft bearing radial and thrust loads.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
