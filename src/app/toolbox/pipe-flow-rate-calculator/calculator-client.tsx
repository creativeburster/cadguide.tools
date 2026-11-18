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

interface PipeFlowPreset {
  id: string;
  label: string;
  diaMm: string;
  velocityMs: string;
  roughnessMm: string;
  nuCst: string;
}

const PRESETS: PipeFlowPreset[] = [
  {
    id: 'turbulent-100',
    label: 'Preset 1: DN100 Steel Water (v=2.0 m/s, eps=0.15 mm, nu=1.004 cSt)',
    diaMm: '100',
    velocityMs: '2',
    roughnessMm: '0.15',
    nuCst: '1.004',
  },
  {
    id: 'laminar-25',
    label: 'Preset 2: Laminar 25 mm Tube (v=0.05 m/s, Re=1245 -> f=64/Re)',
    diaMm: '25',
    velocityMs: '0.05',
    roughnessMm: '0.015',
    nuCst: '1.004',
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

function evaluatePipeFlowRate(diaStr: string, velStr: string, roughStr: string, nuStr: string) {
  const diaMm = parsePositive(diaStr);
  const v = parsePositive(velStr);
  const roughMm = parseNonNegative(roughStr);
  const nuCst = parsePositive(nuStr);

  if (!Number.isFinite(diaMm) || !Number.isFinite(v) || !Number.isFinite(roughMm) || !Number.isFinite(nuCst)) {
    return {
      valid: false as const,
      error: 'Internal diameter, velocity, and kinematic viscosity must be > 0; roughness must be >= 0 mm.',
    };
  }

  const D = diaMm / 1000;
  const A = (Math.PI * D * D) / 4;
  const qM3s = A * v;
  const qLs = qM3s * 1000;
  const qM3h = qLs * 3.6;

  const nuM2s = nuCst * 1e-6;
  const re = (v * D) / nuM2s;
  const regime = re <= 2300 ? 'Laminar (f = 64/Re)' : re < 4000 ? 'Transitional (Swamee-Jain)' : 'Turbulent (Swamee-Jain)';

  let f = 0;
  if (re <= 2300) {
    f = 64 / re;
  } else {
    const term = roughMm / (3.7 * diaMm) + 5.74 / Math.pow(re, 0.9);
    f = 0.25 / Math.pow(Math.log10(term), 2);
  }

  const g = 9.80665;
  const hfPer100m = f * (100 / D) * ((v * v) / (2 * g));

  return {
    valid: true as const,
    areaCm2: A * 10000,
    qLs,
    qM3h,
    re,
    f,
    hfPer100m,
    regime,
  };
}

export default function PipeFlowRateCalculatorClient() {
  const [diaStr, setDiaStr] = useState('100');
  const [velStr, setVelStr] = useState('2');
  const [roughStr, setRoughStr] = useState('0.15');
  const [nuStr, setNuStr] = useState('1.004');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePipeFlowRate(diaStr, velStr, roughStr, nuStr),
    [diaStr, velStr, roughStr, nuStr]
  );

  const applyPreset = (p: PipeFlowPreset) => {
    setDiaStr(p.diaMm);
    setVelStr(p.velocityMs);
    setRoughStr(p.roughnessMm);
    setNuStr(p.nuCst);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Pipe Flow Rate & Darcy Friction Loss Summary',
      `Flow Rate Q: ${evalRes.qLs.toFixed(4)} L/s (${evalRes.qM3h.toFixed(4)} m^3/h)`,
      `Reynolds Number Re: ${evalRes.re.toFixed(2)} | Regime: ${evalRes.regime}`,
      `Darcy Friction Factor f: ${evalRes.f.toFixed(6)} | Head Loss per 100m: ${evalRes.hfPer100m.toFixed(4)} m`,
    ].join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evalRes.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Cross-Section Area,${evalRes.areaCm2.toFixed(4)},cm2`,
      `Volumetric Flow Q,${evalRes.qLs.toFixed(4)},L/s`,
      `Hourly Flow Qh,${evalRes.qM3h.toFixed(4)},m3/h`,
      `Reynolds Number,${evalRes.re.toFixed(2)},dimensionless`,
      `Darcy Friction Factor f,${evalRes.f.toFixed(6)},dimensionless`,
      `Head Loss per 100m,${evalRes.hfPer100m.toFixed(4)},m/100m`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe_flow_rate_summary.csv';
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-teal-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pipe Inner Dia D (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Flow Velocity v (m/s)</label>
            <input type="text" inputMode="decimal" data-testid="input-velocity" value={velStr} onChange={(e) => setVelStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Roughness eps (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-roughness" value={roughStr} onChange={(e) => setRoughStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Kinematic Viscosity nu (mm^2/s = cSt)</label>
            <input type="text" inputMode="decimal" data-testid="input-nu" value={nuStr} onChange={(e) => setNuStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Flow &amp; Friction Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!evalRes.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  disabled={!evalRes.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

            {!evalRes.valid ? (
              <div data-testid="validation-error" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalRes.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase">Instantaneous Q</div>
                    <div className="text-xl font-black text-blue-900 mt-1"><span data-testid="out-qls">{evalRes.qLs.toFixed(4)}</span> L/s</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Hourly Flow Qh</div>
                    <div className="text-xl font-black text-emerald-900 mt-1"><span data-testid="out-qm3h">{evalRes.qM3h.toFixed(4)}</span> m3/h</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="text-xs font-black text-purple-500 uppercase">Friction f</div>
                    <div data-testid="out-f" className="text-xl font-black text-purple-900 mt-1">{evalRes.f.toFixed(6)}</div>
                    <div className="text-[11px] text-purple-700 font-semibold mt-0.5">Re = {Math.round(evalRes.re)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase">Head Loss / 100m</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-hf100">{evalRes.hfPer100m.toFixed(4)}</span> m</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">{evalRes.regime}</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Uses ISO 80000 standard gravity g = 9.80665 m/s^2, f = 64/Re (laminar) or Swamee-Jain (1976) correlation.</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://en.wikipedia.org/wiki/Darcy_friction_factor_formulae" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline">
                      Darcy Friction Factor Formulae <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="https://en.wikipedia.org/wiki/Standard_gravity" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline">
                      ISO 80000 Standard Gravity <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
