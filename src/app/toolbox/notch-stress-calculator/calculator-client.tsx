'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';

interface PresetSpec {
  id: string;
  label: string;
  nomStress: string;
  depth: string;
  radius: string;
  neuberConst: string;
}

const PRESETS: PresetSpec[] = [
  {
    id: 'baseline-notch',
    label: 'Baseline Steel Fillet (100 MPa, a=2 mm, r=0.5 mm, sqrt(rho*)=sqrt(0.5))',
    nomStress: '100',
    depth: '2',
    radius: '0.5',
    neuberConst: '0.5',
  },
  {
    id: 'sharp-groove',
    label: 'Sharp Groove High Kt (120 MPa, a=3 mm, r=0.25 mm, rho*=0.25 mm)',
    nomStress: '120',
    depth: '3',
    radius: '0.25',
    neuberConst: '0.25',
  },
  {
    id: 'circular-hole-inglis',
    label: 'Circular Hole Check a=r (150 MPa, a=5 mm, r=5 mm -> Kt=3.0)',
    nomStress: '150',
    depth: '5',
    radius: '5',
    neuberConst: '0.1',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function fmt(n: number, decimals = 4): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

export default function NotchStressCalculatorClient() {
  const [nomStressStr, setNomStressStr] = useState('100');
  const [depthStr, setDepthStr] = useState('2');
  const [radiusStr, setRadiusStr] = useState('0.5');
  const [rhoStarStr, setRhoStarStr] = useState('0.5');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: PresetSpec) => {
    setNomStressStr(p.nomStress);
    setDepthStr(p.depth);
    setRadiusStr(p.radius);
    setRhoStarStr(p.neuberConst);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const evaluation = useMemo(() => {
    const sNom = parsePositive(nomStressStr);
    const a = parsePositive(depthStr);
    const r = parsePositive(radiusStr);
    const rhoStar = parseNonNegative(rhoStarStr);

    if (!Number.isFinite(sNom) || !Number.isFinite(a) || !Number.isFinite(r) || !Number.isFinite(rhoStar)) {
      return {
        valid: false as const,
        error: 'Nominal stress, notch depth a, and root radius r must be > 0; Neuber length rho* must be >= 0.',
      };
    }

    const kt = 1 + 2 * Math.sqrt(a / r);
    const q = 1 / (1 + Math.sqrt(rhoStar / r));
    const kf = 1 + q * (kt - 1);
    const sigmaMax = kt * sNom;
    const sigmaEff = kf * sNom;

    return {
      valid: true as const,
      sNom,
      a,
      r,
      rhoStar,
      kt,
      q,
      kf,
      sigmaMax,
      sigmaEff,
    };
  }, [nomStressStr, depthStr, radiusStr, rhoStarStr]);

  const handleCopy = () => {
    if (!evaluation.valid) return;
    const report = [
      'Notch Stress Concentration Summary',
      `Nominal Stress sigma_0: ${fmt(evaluation.sNom, 4)} MPa`,
      `Notch Depth a: ${fmt(evaluation.a, 4)} mm | Root Radius r: ${fmt(evaluation.r, 4)} mm`,
      `Neuber Characteristic Length rho*: ${fmt(evaluation.rhoStar, 4)} mm`,
      `Theoretical Kt = 1 + 2*sqrt(a/r): ${fmt(evaluation.kt, 4)}`,
      `Notch Sensitivity q = 1 / (1 + sqrt(rho*/r)): ${fmt(evaluation.q, 5)}`,
      `Fatigue Concentration Kf = 1 + q*(Kt - 1): ${fmt(evaluation.kf, 4)}`,
      `Elastic Peak Stress sigma_max: ${fmt(evaluation.sigmaMax, 4)} MPa`,
      `Effective Fatigue Peak Stress sigma_eff: ${fmt(evaluation.sigmaEff, 4)} MPa`,
    ].join('\n');

    navigator.clipboard
      .writeText(report)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evaluation.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Nominal Stress,${evaluation.sNom.toFixed(6)},MPa`,
      `Notch Depth a,${evaluation.a.toFixed(6)},mm`,
      `Root Radius r,${evaluation.r.toFixed(6)},mm`,
      `Neuber Characteristic Length rho*,${evaluation.rhoStar.toFixed(6)},mm`,
      `Theoretical Factor Kt,${evaluation.kt.toFixed(6)},dimensionless`,
      `Notch Sensitivity q,${evaluation.q.toFixed(6)},dimensionless`,
      `Fatigue Factor Kf,${evaluation.kf.toFixed(6)},dimensionless`,
      `Elastic Peak Stress,${evaluation.sigmaMax.toFixed(6)},MPa`,
      `Effective Fatigue Stress,${evaluation.sigmaEff.toFixed(6)},MPa`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notch_stress_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Geometry & Stress Inputs</h2>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Nominal Stress sigma_0 (MPa)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-nominal"
              value={nomStressStr}
              onChange={(e) => setNomStressStr(e.target.value)}
              placeholder="100"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Notch Depth / Semi-Axis a (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-depth"
              value={depthStr}
              onChange={(e) => setDepthStr(e.target.value)}
              placeholder="2"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Notch Root Radius r (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-radius"
              value={radiusStr}
              onChange={(e) => setRadiusStr(e.target.value)}
              placeholder="0.5"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Neuber Material Length rho* (mm)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-rho-star"
              value={rhoStarStr}
              onChange={(e) => setRhoStarStr(e.target.value)}
              placeholder="0.5"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
            <p className="text-xs text-slate-400 mt-1">
              Material assumption parameter for q = 1 / (1 + sqrt(rho* / r)); set 0 for full sensitivity q = 1.
            </p>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!evaluation.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!evaluation.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!evaluation.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evaluation.error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Theoretical Factor Kt</div>
                  <div className="text-2xl font-black text-blue-800">
                    <span data-testid="out-kt">{fmt(evaluation.kt, 4)}</span>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Elastic Peak Stress sigma_max</div>
                  <div className="text-2xl font-black text-emerald-800">
                    <span data-testid="out-smax">{fmt(evaluation.sigmaMax, 4)}</span>
                    <span className="text-base text-emerald-500"> MPa</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Notch Sensitivity q</div>
                  <div className="text-2xl font-black text-amber-800">
                    <span data-testid="out-q">{fmt(evaluation.q, 5)}</span>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                  <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Fatigue Factor Kf</div>
                  <div className="text-2xl font-black text-indigo-800">
                    <span data-testid="out-kf">{fmt(evaluation.kf, 4)}</span>
                  </div>
                </div>
                <div className="sm:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Effective Fatigue Stress (Kf * sigma_0)
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    <span data-testid="out-seff">{fmt(evaluation.sigmaEff, 4)}</span> MPa
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Inglis elliptical notch approximation: Kt = 1 + 2*sqrt(a/r), sigma_max = Kt*sigma_0. With user-editable Neuber length rho*: q = 1 / (1 + sqrt(rho* / r)), Kf = 1 + q*(Kt - 1). For finite-width shoulder fillets or stepped shafts, verify specific geometry charts before final sign-off.
                </span>
              </div>
              <div className="pt-1">
                <a
                  href="https://en.wikipedia.org/wiki/Stress_concentration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Stress Concentration Reference (Wikipedia — Inglis Equation) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
