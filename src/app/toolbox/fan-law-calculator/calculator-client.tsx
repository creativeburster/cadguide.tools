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
  { id: 'default', label: 'Default Speed Reduction (1200 -> 900 RPM)', n1: '1200', n2: '900', d1: '600', d2: '600', rho1: '1.20', rho2: '1.20', q1: '5.0', dp1: '500', p1: '3.0' },
  { id: 'upscale-dia', label: 'Diameter & Speed Change (D2=750, N2=1500)', n1: '1200', n2: '1500', d1: '600', d2: '750', rho1: '1.20', rho2: '1.20', q1: '5.0', dp1: '500', p1: '3.0' },
  { id: 'hot-gas', label: 'Elevated Temp Density (rho2=0.90 kg/m3)', n1: '1200', n2: '1200', d1: '600', d2: '600', rho1: '1.20', rho2: '0.90', q1: '5.0', dp1: '500', p1: '3.0' },
];

export default function FanLawCalculatorClient() {
  const [n1Str, setN1Str] = useState('1200');
  const [n2Str, setN2Str] = useState('900');
  const [d1Str, setD1Str] = useState('600');
  const [d2Str, setD2Str] = useState('600');
  const [rho1Str, setRho1Str] = useState('1.20');
  const [rho2Str, setRho2Str] = useState('1.20');
  const [q1Str, setQ1Str] = useState('5.0');
  const [dp1Str, setDp1Str] = useState('500');
  const [p1Str, setP1Str] = useState('3.0');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setN1Str(p.n1);
    setN2Str(p.n2);
    setD1Str(p.d1);
    setD2Str(p.d2);
    setRho1Str(p.rho1);
    setRho2Str(p.rho2);
    setQ1Str(p.q1);
    setDp1Str(p.dp1);
    setP1Str(p.p1);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const N1 = parseStrictPositive(n1Str);
    const N2 = parseStrictPositive(n2Str);
    const D1 = parseStrictPositive(d1Str);
    const D2 = parseStrictPositive(d2Str);
    const rho1 = parseStrictPositive(rho1Str);
    const rho2 = parseStrictPositive(rho2Str);
    const Q1 = parseStrictPositive(q1Str);
    const dp1 = parseStrictPositive(dp1Str);
    const P1 = parseStrictPositive(p1Str);

    if (
      !Number.isFinite(N1) ||
      !Number.isFinite(N2) ||
      !Number.isFinite(D1) ||
      !Number.isFinite(D2) ||
      !Number.isFinite(rho1) ||
      !Number.isFinite(rho2) ||
      !Number.isFinite(Q1) ||
      !Number.isFinite(dp1) ||
      !Number.isFinite(P1)
    ) {
      return { valid: false as const };
    }

    const rN = N2 / N1;
    const rD = D2 / D1;
    const rRho = rho2 / rho1;

    // Centrifugal fan affinity laws (geometrically similar, same efficiency point):
    // q2 = q1 * (n2/n1) * (d2/d1)^3
    // dp2 = dp1 * (n2/n1)^2 * (d2/d1)^2 * (rho2/rho1)
    // P2 = P1 * (n2/n1)^3 * (d2/d1)^5 * (rho2/rho1)
    const Q2 = Q1 * rN * Math.pow(rD, 3);
    const dp2 = dp1 * Math.pow(rN, 2) * Math.pow(rD, 2) * rRho;
    const P2 = P1 * Math.pow(rN, 3) * Math.pow(rD, 5) * rRho;
    const esp = (dp2 * rho1) / rho2;

    return {
      valid: true as const,
      N1,
      N2,
      D1,
      D2,
      rho1,
      rho2,
      Q1,
      dp1,
      P1,
      rN,
      rD,
      rRho,
      Q2,
      dp2,
      P2,
      esp,
    };
  }, [n1Str, n2Str, d1Str, d2Str, rho1Str, rho2Str, q1Str, dp1Str, p1Str]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Fan Affinity Laws Summary`,
      `Speed: ${result.N1} -> ${result.N2} RPM, Wheel: ${result.D1} -> ${result.D2} mm, Density: ${result.rho1} -> ${result.rho2} kg/m3`,
      `New Flow Q2: ${result.Q2.toFixed(3)} m3/s`,
      `New Pressure dp2: ${result.dp2.toFixed(2)} Pa (ESP=${result.esp.toFixed(2)} Pa)`,
      `New Shaft Power P2: ${result.P2.toFixed(4)} kW`,
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
      ['Baseline Speed N1', String(result.N1), 'RPM'],
      ['New Speed N2', String(result.N2), 'RPM'],
      ['Baseline Wheel Dia D1', String(result.D1), 'mm'],
      ['New Wheel Dia D2', String(result.D2), 'mm'],
      ['Baseline Air Density rho1', String(result.rho1), 'kg/m3'],
      ['New Air Density rho2', String(result.rho2), 'kg/m3'],
      ['Baseline Volume Flow Q1', String(result.Q1), 'm3/s'],
      ['Baseline Pressure dp1', String(result.dp1), 'Pa'],
      ['Baseline Power P1', String(result.P1), 'kW'],
      ['New Volume Flow Q2', result.Q2.toFixed(3), 'm3/s'],
      ['New Pressure dp2', result.dp2.toFixed(2), 'Pa'],
      ['New Shaft Power P2', result.P2.toFixed(4), 'kW'],
      ['Equivalent Static Pressure ESP', result.esp.toFixed(2), 'Pa'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fan-affinity-laws.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 border border-slate-200"
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
          <span>Enter strictly positive values (&gt; 0) for all fan speeds, diameters, densities, flow, pressure, and power.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'n1', label: 'Baseline Speed N1 (RPM)', val: n1Str, set: setN1Str },
            { id: 'n2', label: 'New Speed N2 (RPM)', val: n2Str, set: setN2Str },
            { id: 'd1', label: 'Baseline Diameter D1 (mm)', val: d1Str, set: setD1Str },
            { id: 'd2', label: 'New Diameter D2 (mm)', val: d2Str, set: setD2Str },
            { id: 'rho1', label: 'Baseline Density rho1 (kg/m3)', val: rho1Str, set: setRho1Str },
            { id: 'rho2', label: 'New Density rho2 (kg/m3)', val: rho2Str, set: setRho2Str },
            { id: 'q1', label: 'Baseline Flow Q1 (m3/s)', val: q1Str, set: setQ1Str },
            { id: 'dp1', label: 'Baseline Pressure dp1 (Pa)', val: dp1Str, set: setDp1Str },
            { id: 'p1', label: 'Baseline Power P1 (kW)', val: p1Str, set: setP1Str },
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
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Scaled Fan Performance</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">New Volume Flow Q2</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-q2">{result.valid ? result.Q2.toFixed(3) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">m3/s</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">New Pressure dp2</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-dp2">{result.valid ? result.dp2.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">Pa</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">New Shaft Power P2</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-p2">{result.valid ? result.P2.toFixed(4) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">kW</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Equiv. Static Pressure (at rho1)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-esp">{result.valid ? result.esp.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">Pa</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Fan Affinity Laws (geometrically similar impellers): q2/q1 = (n2/n1)*(d2/d1)^3, dp2/dp1 = (n2/n1)^2*(d2/d1)^2*(rho2/rho1), P2/P1 = (n2/n1)^3*(d2/d1)^5*(rho2/rho1), and ESP = dp2*(rho1/rho2). Confirm VFD/motor torque and wheel tip speed limits with manufacturer curves.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
