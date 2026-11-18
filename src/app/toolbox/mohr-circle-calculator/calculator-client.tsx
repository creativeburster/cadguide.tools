'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download } from 'lucide-react';

interface StressPreset {
  id: string;
  label: string;
  sx: string;
  sy: string;
  txy: string;
}

const PRESETS: StressPreset[] = [
  { id: 'default-biaxial', label: 'Biaxial + Shear (80, 20, 30 MPa)', sx: '80', sy: '20', txy: '30' },
  { id: 'pure-shear', label: 'Pure Shear (0, 0, 50 MPa)', sx: '0', sy: '0', txy: '50' },
  { id: 'compression-tension', label: 'Tension-Compression (-40, 60, -25 MPa)', sx: '-40', sy: '60', txy: '-25' },
];

const SIGNED_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseSigned(raw: string): number | null {
  const t = raw.trim();
  if (!SIGNED_RE.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function fmt(val: number | null, dec: number): string {
  if (val === null || !Number.isFinite(val)) return '—';
  return val.toFixed(dec);
}

export default function MohrCircleCalculatorClient() {
  const [sxStr, setSxStr] = useState(PRESETS[0].sx);
  const [syStr, setSyStr] = useState(PRESETS[0].sy);
  const [txyStr, setTxyStr] = useState(PRESETS[0].txy);
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const sx = parseSigned(sxStr);
    const sy = parseSigned(syStr);
    const txy = parseSigned(txyStr);
    if (sx === null || sy === null || txy === null) {
      return { valid: false as const };
    }
    const sigmaAvg = (sx + sy) / 2;
    const radius = Math.sqrt(Math.pow((sx - sy) / 2, 2) + txy * txy);
    const s1 = sigmaAvg + radius;
    const s2 = sigmaAvg - radius;
    const tauMax = radius;
    const thetaP = (Math.atan2(2 * txy, sx - sy) / 2) * (180 / Math.PI);
    const vonMises = Math.sqrt(s1 * s1 - s1 * s2 + s2 * s2);
    return { valid: true as const, sigmaAvg, s1, s2, tauMax, thetaP, vonMises };
  }, [sxStr, syStr, txyStr]);

  const applyPreset = (p: StressPreset) => {
    setSxStr(p.sx);
    setSyStr(p.sy);
    setTxyStr(p.txy);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!calc.valid) return;
    const text = [
      '2D Mohr Circle Plane Stress Transformation Summary',
      `Inputs: sigma_x=${sxStr.trim()} MPa, sigma_y=${syStr.trim()} MPa, tau_xy=${txyStr.trim()} MPa`,
      `sigma_1 = ${calc.s1.toFixed(3)} MPa, sigma_2 = ${calc.s2.toFixed(3)} MPa`,
      `tau_max = ${calc.tauMax.toFixed(3)} MPa, theta_p = ${calc.thetaP.toFixed(3)} deg`,
      `sigma_vm = ${calc.vonMises.toFixed(3)} MPa`,
    ].join('\n');
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['sigma_x', sxStr.trim(), 'MPa'],
      ['sigma_y', syStr.trim(), 'MPa'],
      ['tau_xy', txyStr.trim(), 'MPa'],
      ['sigma_avg', calc.sigmaAvg.toFixed(4), 'MPa'],
      ['principal_stress_1', calc.s1.toFixed(4), 'MPa'],
      ['principal_stress_2', calc.s2.toFixed(4), 'MPa'],
      ['max_in_plane_shear_tau_max', calc.tauMax.toFixed(4), 'MPa'],
      ['principal_angle_theta_p', calc.thetaP.toFixed(4), 'deg'],
      ['plane_stress_von_mises', calc.vonMises.toFixed(4), 'MPa'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mohr-circle-stress-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    { id: 'sx', label: 'Normal Stress σx (MPa)', val: sxStr, set: setSxStr },
    { id: 'sy', label: 'Normal Stress σy (MPa)', val: syStr, set: setSyStr },
    { id: 'txy', label: 'Shear Stress τxy (MPa)', val: txyStr, set: setTxyStr },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Plane Stress Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">Positive = tension, negative = compression</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={`mohr-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  {f.label}
                </label>
                <input
                  id={`mohr-${f.id}`}
                  type="text"
                  inputMode="decimal"
                  data-testid={`input-${f.id}`}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Principal &amp; Shear Results</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? 'PLANE STRESS SOLVED' : 'INVALID INPUT'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Major Principal Stress (σ1)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-s1">{fmt(calc.valid ? calc.s1 : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">MPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Minor Principal Stress (σ2)</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-s2">{fmt(calc.valid ? calc.s2 : null, 4)}</span>
                  <span className="text-base text-emerald-500 ml-1.5">MPa</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Max In-Plane Shear (τmax)</div>
                <div className="text-xl font-black text-orange-800">
                  <span data-testid="result-tmax">{fmt(calc.valid ? calc.tauMax : null, 4)}</span>
                  <span className="text-xs text-orange-600 ml-1">MPa</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Principal Angle (θp)</div>
                <div className="text-xl font-black text-purple-800">
                  <span data-testid="result-theta">{fmt(calc.valid ? calc.thetaP : null, 4)}</span>
                  <span className="text-xs text-purple-600 ml-1">deg</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Circle Center (σavg)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-savg">{fmt(calc.valid ? calc.sigmaAvg : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">MPa</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Von Mises (σvm)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-vm">{fmt(calc.valid ? calc.vonMises : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">MPa</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-slate-500" />
                <span>2D Plane Stress Transformation Equations</span>
              </div>
              <p className="font-mono">
                σavg = (σx + σy)/2 | R = τmax = √(((σx − σy)/2)² + τxy²) | σ1,2 = σavg ± R | θp = 0.5·atan2(2τxy, σx − σy)
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
