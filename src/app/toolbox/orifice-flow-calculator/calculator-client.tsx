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

interface OrificePreset {
  id: string;
  label: string;
  pipeDiaMm: string;
  orificeDiaMm: string;
  dpKpa: string;
  rhoKgM3: string;
  cd: string;
}

const PRESETS: OrificePreset[] = [
  {
    id: 'water-100x50',
    label: 'Preset 1: Water Line (D=100 mm, d=50 mm, dP=10 kPa, rho=1000)',
    pipeDiaMm: '100',
    orificeDiaMm: '50',
    dpKpa: '10',
    rhoKgM3: '1000',
    cd: '0.62',
  },
  {
    id: 'air-duct',
    label: 'Preset 2: Air Duct (D=200 mm, d=120 mm, dP=2.5 kPa, rho=1.2)',
    pipeDiaMm: '200',
    orificeDiaMm: '120',
    dpKpa: '2.5',
    rhoKgM3: '1.2',
    cd: '0.61',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function evaluateOrificeFlow(
  pipeDiaStr: string,
  orificeDiaStr: string,
  dpKpaStr: string,
  rhoStr: string,
  cdStr: string
) {
  const Dmm = parsePositive(pipeDiaStr);
  const dmm = parsePositive(orificeDiaStr);
  const dpKpa = parsePositive(dpKpaStr);
  const rho = parsePositive(rhoStr);
  const Cd = parsePositive(cdStr);

  if (!Number.isFinite(Dmm) || !Number.isFinite(dmm) || !Number.isFinite(dpKpa) || !Number.isFinite(rho) || !Number.isFinite(Cd)) {
    return {
      valid: false as const,
      error: 'All dimensions, differential pressure, fluid density, and discharge coefficient must be > 0.',
    };
  }
  if (dmm >= Dmm) {
    return {
      valid: false as const,
      error: 'Orifice bore diameter d must be strictly smaller than pipe internal diameter D (beta = d/D < 1).',
    };
  }
  if (Cd > 1) {
    return { valid: false as const, error: 'Discharge coefficient Cd for an orifice plate must satisfy 0 < Cd <= 1.' };
  }

  const D = Dmm / 1000;
  const d = dmm / 1000;
  const dP = dpKpa * 1000;
  const beta = d / D;
  const approachFactor = 1 / Math.sqrt(1 - Math.pow(beta, 4));
  const A2 = (Math.PI * d * d) / 4;
  const A1 = (Math.PI * D * D) / 4;
  const Q_m3s = Cd * approachFactor * A2 * Math.sqrt((2 * dP) / rho);
  const Q_Ls = Q_m3s * 1000;
  const mDotKgS = rho * Q_m3s;
  const vPipe = Q_m3s / A1;

  return {
    valid: true as const,
    beta,
    approachFactor,
    Q_Ls,
    mDotKgS,
    vPipe,
  };
}

export default function OrificeFlowCalculatorClient() {
  const [pipeDiaStr, setPipeDiaStr] = useState('100');
  const [orificeDiaStr, setOrificeDiaStr] = useState('50');
  const [dpKpaStr, setDpKpaStr] = useState('10');
  const [rhoStr, setRhoStr] = useState('1000');
  const [cdStr, setCdStr] = useState('0.62');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluateOrificeFlow(pipeDiaStr, orificeDiaStr, dpKpaStr, rhoStr, cdStr),
    [pipeDiaStr, orificeDiaStr, dpKpaStr, rhoStr, cdStr]
  );

  const applyPreset = (p: OrificePreset) => {
    setPipeDiaStr(p.pipeDiaMm);
    setOrificeDiaStr(p.orificeDiaMm);
    setDpKpaStr(p.dpKpa);
    setRhoStr(p.rhoKgM3);
    setCdStr(p.cd);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Orifice Plate Flow Summary (Incompressible)',
      `Beta (d/D): ${evalRes.beta.toFixed(4)} | Velocity-of-Approach Factor E_v: ${evalRes.approachFactor.toFixed(4)}`,
      `Volumetric Flow: ${evalRes.Q_Ls.toFixed(4)} L/s | Mass Flow: ${evalRes.mDotKgS.toFixed(4)} kg/s`,
      `Upstream Pipe Velocity: ${evalRes.vPipe.toFixed(4)} m/s`,
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
      `Diameter Ratio Beta,${evalRes.beta.toFixed(6)},ratio`,
      `Velocity-of-Approach Factor Ev,${evalRes.approachFactor.toFixed(6)},factor`,
      `Volumetric Flow Rate,${evalRes.Q_Ls.toFixed(6)},L/s`,
      `Mass Flow Rate,${evalRes.mDotKgS.toFixed(6)},kg/s`,
      `Upstream Pipe Velocity,${evalRes.vPipe.toFixed(6)},m/s`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orifice_plate_flow.csv';
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Pipe Dia D (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-pipe-dia" value={pipeDiaStr} onChange={(e) => setPipeDiaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Orifice Dia d (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-orifice-dia" value={orificeDiaStr} onChange={(e) => setOrificeDiaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Pressure Drop dP (kPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-dp" value={dpKpaStr} onChange={(e) => setDpKpaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Fluid Density rho (kg/m3)</label>
            <input type="text" inputMode="decimal" data-testid="input-rho" value={rhoStr} onChange={(e) => setRhoStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Discharge Coeff Cd</label>
            <input type="text" inputMode="decimal" data-testid="input-cd" value={cdStr} onChange={(e) => setCdStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Flow Rate</div>
                    <div className="text-2xl font-black text-blue-900">
                      <span data-testid="out-flow-ls">{evalRes.Q_Ls.toFixed(4)}</span> L/s
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Mass Flow Rate</div>
                    <div className="text-2xl font-black text-emerald-900">
                      <span data-testid="out-mass-kgs">{evalRes.mDotKgS.toFixed(4)}</span> kg/s
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Pipe Velocity</div>
                    <div className="text-2xl font-black text-slate-900">
                      <span data-testid="out-velocity">{evalRes.vPipe.toFixed(4)}</span> m/s
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      beta=<span data-testid="out-beta">{evalRes.beta.toFixed(4)}</span> | Ev={evalRes.approachFactor.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>Q = Cd * (1 / sqrt(1 - beta^4)) * (pi/4 * d^2) * sqrt(2 * dP / rho)</span>
                  </div>
                  <div>
                    <a href="https://en.wikipedia.org/wiki/Orifice_plate" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline">
                      Orifice Plate Equations &amp; ISO 5167 Overview (Wikipedia) <ExternalLink className="w-3 h-3" />
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
