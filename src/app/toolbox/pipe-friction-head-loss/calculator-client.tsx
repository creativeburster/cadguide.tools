'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type FrictionMode = 'hw' | 'dw';

const PIPE_C_PRESETS = [
  { name: 'PVC / Plastic (C=150)', c: '150' },
  { name: 'Copper / Stainless (C=140)', c: '140' },
  { name: 'Welded Steel (C=120)', c: '120' },
  { name: 'New Cast Iron (C=100)', c: '100' },
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

function evaluatePipeFriction(args: {
  mode: FrictionMode;
  flowM3hStr: string;
  diaMmStr: string;
  lenMStr: string;
  rhoStr: string;
  cFactorStr: string;
  epsMmStr: string;
  nuCstStr: string;
}) {
  const qM3h = parsePositive(args.flowM3hStr);
  const diaMm = parsePositive(args.diaMmStr);
  const L = parsePositive(args.lenMStr);
  const rho = parsePositive(args.rhoStr);
  const C = parsePositive(args.cFactorStr);
  const epsMm = parseNonNegative(args.epsMmStr);
  const nuCst = parsePositive(args.nuCstStr);

  if (!Number.isFinite(qM3h) || !Number.isFinite(diaMm) || !Number.isFinite(L) || !Number.isFinite(rho)) {
    return {
      valid: false as const,
      error: 'Flow rate, pipe internal diameter, length, and fluid density must all be > 0.',
    };
  }
  if (args.mode === 'hw' && !Number.isFinite(C)) {
    return { valid: false as const, error: 'Hazen-Williams roughness constant C must be > 0.' };
  }
  if (args.mode === 'dw' && (!Number.isFinite(epsMm) || !Number.isFinite(nuCst))) {
    return { valid: false as const, error: 'Darcy-Weisbach roughness eps >= 0 mm and viscosity nu > 0 cSt are required.' };
  }

  const Q = qM3h / 3600;
  const d = diaMm / 1000;
  const area = (Math.PI * d * d) / 4;
  const velocity = Q / area;
  const g = 9.80665;

  let headLossM = 0;
  let frictionFactor = 0;
  let reynolds = 0;

  if (args.mode === 'hw') {
    headLossM = (10.67 * L * Math.pow(Q, 1.852)) / (Math.pow(C, 1.852) * Math.pow(d, 4.8704));
  } else {
    const nu = nuCst * 1e-6;
    reynolds = (velocity * d) / nu;
    if (reynolds <= 2300) {
      frictionFactor = 64 / reynolds;
    } else {
      const term = epsMm / (3.7 * diaMm) + 5.74 / Math.pow(reynolds, 0.9);
      frictionFactor = 0.25 / Math.pow(Math.log10(term), 2);
    }
    headLossM = frictionFactor * (L / d) * ((velocity * velocity) / (2 * g));
  }

  const pressureDropKpa = (headLossM * rho * g) / 1000;
  const unitPressureDropKpaM = pressureDropKpa / L;

  return {
    valid: true as const,
    mode: args.mode,
    velocity,
    headLossM,
    pressureDropKpa,
    unitPressureDropKpaM,
    frictionFactor,
    reynolds,
  };
}

export default function PipeFrictionClient() {
  const [mode, setMode] = useState<FrictionMode>('hw');
  const [flowM3hStr, setFlowM3hStr] = useState('15');
  const [diaMmStr, setDiaMmStr] = useState('80');
  const [lenMStr, setLenMStr] = useState('100');
  const [rhoStr, setRhoStr] = useState('1000');
  const [cFactorStr, setCFactorStr] = useState('150');
  const [epsMmStr, setEpsMmStr] = useState('0.045');
  const [nuCstStr, setNuCstStr] = useState('1.004');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () =>
      evaluatePipeFriction({
        mode,
        flowM3hStr,
        diaMmStr,
        lenMStr,
        rhoStr,
        cFactorStr,
        epsMmStr,
        nuCstStr,
      }),
    [mode, flowM3hStr, diaMmStr, lenMStr, rhoStr, cFactorStr, epsMmStr, nuCstStr]
  );

  const resetDefaults = () => {
    setMode('hw');
    setFlowM3hStr('15');
    setDiaMmStr('80');
    setLenMStr('100');
    setRhoStr('1000');
    setCFactorStr('150');
    setEpsMmStr('0.045');
    setNuCstStr('1.004');
  };

  const applyDarcyPreset = () => {
    setMode('dw');
    setFlowM3hStr('36');
    setDiaMmStr('100');
    setLenMStr('200');
    setRhoStr('1000');
    setEpsMmStr('0.045');
    setNuCstStr('1.004');
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      `Pipe Friction Loss Report (${evalRes.mode === 'hw' ? 'Hazen-Williams' : 'Darcy-Weisbach'})`,
      `Velocity: ${evalRes.velocity.toFixed(4)} m/s`,
      `Head Loss hf: ${evalRes.headLossM.toFixed(4)} m`,
      `Total Pressure Drop: ${evalRes.pressureDropKpa.toFixed(4)} kPa`,
      `Unit Gradient: ${evalRes.unitPressureDropKpaM.toFixed(6)} kPa/m`,
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
      `Hydraulic Model,${evalRes.mode === 'hw' ? 'Hazen-Williams' : 'Darcy-Weisbach'},mode`,
      `Flow Velocity,${evalRes.velocity.toFixed(4)},m/s`,
      `Friction Head Loss,${evalRes.headLossM.toFixed(4)},m`,
      `Total Pressure Drop,${evalRes.pressureDropKpa.toFixed(4)},kPa`,
      `Unit Friction Gradient,${evalRes.unitPressureDropKpaM.toFixed(6)},kPa/m`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe_friction_head_loss.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-hw-default"
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Hazen-Williams PVC DN80 (15 m3/h, 100 m, C=150)
        </button>
        <button
          type="button"
          data-testid="preset-dw-steel"
          onClick={applyDarcyPreset}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Darcy-Weisbach Steel DN100 (36 m3/h, 200 m, eps=0.045 mm)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Hydraulic Parameters</span>
            </h2>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-testid="mode-hw"
              onClick={() => setMode('hw')}
              className={`py-2 px-3 rounded-xl text-xs font-black border ${
                mode === 'hw' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Hazen-Williams
            </button>
            <button
              type="button"
              data-testid="mode-dw"
              onClick={() => setMode('dw')}
              className={`py-2 px-3 rounded-xl text-xs font-black border ${
                mode === 'dw' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Darcy-Weisbach
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Flow Q (m3/h)</label>
              <input type="text" inputMode="decimal" data-testid="input-flow" value={flowM3hStr} onChange={(e) => setFlowM3hStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Inner Dia d (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diaMmStr} onChange={(e) => setDiaMmStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Length L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-length" value={lenMStr} onChange={(e) => setLenMStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Density rho (kg/m3)</label>
              <input type="text" inputMode="decimal" data-testid="input-rho" value={rhoStr} onChange={(e) => setRhoStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
            </div>
          </div>

          {mode === 'hw' ? (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase block">Hazen-Williams Roughness C</label>
              <input type="text" inputMode="decimal" data-testid="input-c" value={cFactorStr} onChange={(e) => setCFactorStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              <div className="flex flex-wrap gap-1.5">
                {PIPE_C_PRESETS.map((p) => (
                  <button
                    key={p.c}
                    type="button"
                    onClick={() => setCFactorStr(p.c)}
                    className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Roughness eps (mm)</label>
                <input type="text" inputMode="decimal" data-testid="input-eps" value={epsMmStr} onChange={(e) => setEpsMmStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase block mb-1">Viscosity nu (cSt)</label>
                <input type="text" inputMode="decimal" data-testid="input-nu" value={nuCstStr} onChange={(e) => setNuCstStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Hydraulics Report</span>
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!evalRes.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  disabled={!evalRes.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold disabled:opacity-50"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase">Velocity</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-velocity">{evalRes.velocity.toFixed(4)}</span> m/s</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase">Head Loss hf</div>
                    <div className="text-xl font-black text-blue-900 mt-1"><span data-testid="out-hf">{evalRes.headLossM.toFixed(4)}</span> m</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Pressure Drop</div>
                    <div className="text-xl font-black text-emerald-900 mt-1"><span data-testid="out-dp">{evalRes.pressureDropKpa.toFixed(4)}</span> kPa</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="text-xs font-black text-purple-500 uppercase">Unit Loss</div>
                    <div className="text-xl font-black text-purple-900 mt-1"><span data-testid="out-unit-dp">{evalRes.unitPressureDropKpaM.toFixed(6)}</span> kPa/m</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Hazen-Williams: hf = 10.67 * L * Q^1.852 / (C^1.852 * d^4.8704); Darcy-Weisbach uses Swamee-Jain / laminar 64/Re with g = 9.80665 m/s^2.</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://en.wikipedia.org/wiki/Hazen%E2%80%93Williams_equation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                      Hazen-Williams Equation <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="https://en.wikipedia.org/wiki/Darcy_friction_factor_formulae" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                      Darcy Friction Factor Formulae <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="https://en.wikipedia.org/wiki/Standard_gravity" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                      ISO 80000 Standard Gravity <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
