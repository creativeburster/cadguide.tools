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
  { id: 'default', label: '3:1 Reduction (100/300 mm, C=500 mm)', d1: '100', d2: '300', c: '500', n1: '1800' },
  { id: 'overdrive', label: '1:2 Speed-Up (250/125 mm, C=400 mm)', d1: '250', d2: '125', c: '400', n1: '1200' },
  { id: 'equal', label: '1:1 Equal Pulleys (150/150 mm)', d1: '150', d2: '150', c: '450', n1: '1500' },
];

export default function GearRatioBeltCalculatorClient() {
  const [d1Str, setD1Str] = useState('100');
  const [d2Str, setD2Str] = useState('300');
  const [cStr, setCStr] = useState('500');
  const [n1Str, setN1Str] = useState('1800');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setD1Str(p.d1);
    setD2Str(p.d2);
    setCStr(p.c);
    setN1Str(p.n1);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const d1 = parseStrictPositive(d1Str);
    const d2 = parseStrictPositive(d2Str);
    const c = parseStrictPositive(cStr);
    const n1 = parseStrictPositive(n1Str);

    if (!Number.isFinite(d1) || !Number.isFinite(d2) || !Number.isFinite(c) || !Number.isFinite(n1)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive pulley pitch diameters D1, D2, center distance C, and driver speed n1.',
      };
    }

    const minCenter = (d1 + d2) / 2;
    if (c <= minCenter) {
      return {
        valid: false as const,
        errorMsg: `Geometric interference: center distance C must exceed (D1 + D2)/2 = ${minCenter.toFixed(1)} mm.`,
      };
    }

    const ratio = d2 / d1;
    const n2 = n1 / ratio;
    const beltSpeedMs = (Math.PI * (d1 / 1000) * n1) / 60;
    const deltaD = Math.abs(d2 - d1);
    const phi = Math.asin(deltaD / (2 * c));
    const smallWrapDeg = 180 - (360 / Math.PI) * phi;
    const lExact = 2 * c * Math.cos(phi) + (Math.PI * (d1 + d2)) / 2 + deltaD * phi;
    const lApprox = 2 * c + (Math.PI * (d1 + d2)) / 2 + Math.pow(deltaD, 2) / (4 * c);

    return {
      valid: true as const,
      d1,
      d2,
      c,
      n1,
      ratio,
      n2,
      beltSpeedMs,
      smallWrapDeg,
      lExact,
      lApprox,
    };
  }, [d1Str, d2Str, cStr, n1Str]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Two-Pulley Open Belt Drive Summary`,
      `D1=${result.d1} mm, D2=${result.d2} mm, C=${result.c} mm, n1=${result.n1} RPM`,
      `Speed Ratio i = ${result.ratio.toFixed(3)}:1, Driven Speed n2 = ${result.n2.toFixed(2)} RPM`,
      `Belt Pitch Speed v = ${result.beltSpeedMs.toFixed(3)} m/s`,
      `Small-Pulley Wrap Angle = ${result.smallWrapDeg.toFixed(2)} deg`,
      `Exact Open-Belt Length L_exact = ${result.lExact.toFixed(2)} mm (Approx L_approx = ${result.lApprox.toFixed(2)} mm)`,
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
      ['Driver Pulley Pitch Dia D1', String(result.d1), 'mm'],
      ['Driven Pulley Pitch Dia D2', String(result.d2), 'mm'],
      ['Center Distance C', String(result.c), 'mm'],
      ['Driver Speed n1', String(result.n1), 'RPM'],
      ['Drive Ratio i = D2/D1', result.ratio.toFixed(3), ':1'],
      ['Driven Speed n2', result.n2.toFixed(2), 'RPM'],
      ['Belt Linear Speed v', result.beltSpeedMs.toFixed(3), 'm/s'],
      ['Small-Pulley Wrap Angle theta_small', result.smallWrapDeg.toFixed(2), 'deg'],
      ['Exact Open-Belt Length L_exact', result.lExact.toFixed(2), 'mm'],
      ['Second-Order Approx Length L_approx', result.lApprox.toFixed(2), 'mm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'belt-drive-ratio-length.csv';
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
            <h2 className="text-lg font-black text-slate-900">Pulley Geometry</h2>
          </div>

          {[
            { id: 'd1', label: 'Driver Pitch Dia D1 (mm)', val: d1Str, set: setD1Str },
            { id: 'd2', label: 'Driven Pitch Dia D2 (mm)', val: d2Str, set: setD2Str },
            { id: 'c', label: 'Center Distance C (mm)', val: cStr, set: setCStr },
            { id: 'n1', label: 'Driver Speed n1 (RPM)', val: n1Str, set: setN1Str },
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
                <h2 className="text-lg font-black text-slate-900">Ratio, Speed &amp; Belt Length</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Exact Belt Length L_exact</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-len-exact">{result.valid ? result.lExact.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Drive Ratio i = D2/D1</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-ratio">{result.valid ? result.ratio.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">:1</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Driven Speed n2</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-n2">{result.valid ? result.n2.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">RPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Belt Speed v</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-speed">{result.valid ? result.beltSpeedMs.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">m/s</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Small-Pulley Wrap Angle</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-wrap">{result.valid ? result.smallWrapDeg.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">deg</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">2nd-Order Approx L_approx</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-len-approx">{result.valid ? result.lApprox.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Open two-pulley belt kinematics (neglecting slip): i = D2/D1, phi = asin(|D2-D1|/(2C)), theta_small = 180 - (360/pi)*phi, L_exact = 2*C*cos(phi) + pi*(D1+D2)/2 + |D2-D1|*phi. Requires non-overlapping pulleys C &gt; (D1 + D2)/2.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
