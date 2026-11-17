'use client';

import React, { useMemo, useState } from 'react';
import { Info, Copy, Check, Activity, Sliders, Wind, Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type DuctShape = 'round' | 'rectangular';

const ROUGHNESS_PRESETS = [
  { id: 'galv', name: 'Galvanized Steel (0.15 mm)', value: '0.15' },
  { id: 'steel', name: 'Commercial Steel / Wrought Iron (0.045-0.09 mm)', value: '0.09' },
  { id: 'stretched', name: 'Stretched Steel / Smooth Spiral (0.015 mm)', value: '0.015' },
  { id: 'custom', name: 'Custom Value', value: '0.15' },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseNonNeg(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

function solveColebrook(re: number, relRoughness: number): number {
  if (re <= 2300) {
    return 64 / re;
  }
  let invSqrtLambda = 7.0;
  for (let i = 0; i < 25; i++) {
    invSqrtLambda = -2 * Math.log10(2.51 / (re / invSqrtLambda) + relRoughness / 3.72);
  }
  return 1 / (invSqrtLambda * invSqrtLambda);
}

export default function DuctSizeClient() {
  const [shape, setShape] = useState<DuctShape>('round');
  const [flowRate, setFlowRate] = useState('1500');
  const [diameter, setDiameter] = useState('300');
  const [width, setWidth] = useState('500');
  const [height, setHeight] = useState('300');
  const [roughnessPreset, setRoughnessPreset] = useState('galv');
  const [roughnessMm, setRoughnessMm] = useState('0.15');
  const [rhoStr, setRhoStr] = useState('1.204');
  const [nuStr, setNuStr] = useState('0.00001516');
  const [copied, setCopied] = useState(false);

  const handlePresetChange = (id: string) => {
    setRoughnessPreset(id);
    const found = ROUGHNESS_PRESETS.find((r) => r.id === id);
    if (found && id !== 'custom') {
      setRoughnessMm(found.value);
    }
  };

  const resetDefaults = () => {
    setShape('round');
    setFlowRate('1500');
    setDiameter('300');
    setWidth('500');
    setHeight('300');
    setRoughnessPreset('galv');
    setRoughnessMm('0.15');
    setRhoStr('1.204');
    setNuStr('0.00001516');
  };

  const physics = useMemo(() => {
    const qM3h = parsePositive(flowRate, 5000000);
    const kMm = parseNonNeg(roughnessMm, 50);
    const rho = parsePositive(rhoStr, 20);
    const nu = parsePositive(nuStr, 0.01);

    if (qM3h === null || kMm === null || rho === null || nu === null) {
      return null;
    }

    let areaM2 = 0;
    let deMm = 0;
    let dhMm = 0;

    if (shape === 'round') {
      const dMm = parsePositive(diameter, 10000);
      if (dMm === null) return null;
      deMm = dMm;
      dhMm = dMm;
      areaM2 = (Math.PI * Math.pow(dMm / 1000, 2)) / 4;
    } else {
      const aMm = parsePositive(width, 10000);
      const bMm = parsePositive(height, 10000);
      if (aMm === null || bMm === null) return null;
      areaM2 = (aMm * bMm) / 1e6;
      // Huebscher equivalent circular diameter: de = 1.30 * (a*b)^0.625 / (a+b)^0.25
      deMm = (1.30 * Math.pow(aMm * bMm, 0.625)) / Math.pow(aMm + bMm, 0.25);
      // Hydraulic diameter for rectangular duct: dh = 4A/P = 2ab/(a+b)
      dhMm = (2 * aMm * bMm) / (aMm + bMm);
    }

    const qM3s = qM3h / 3600;
    const velocity = qM3s / areaM2;
    const dhM = dhMm / 1000;
    const reynolds = (velocity * dhM) / nu;
    const lambda = solveColebrook(reynolds, kMm / dhMm);
    const pressureDropPerM = (lambda * rho * velocity * velocity) / (2 * dhM);
    const flowCfm = qM3h / 1.6990107955; // exact 1 ft3/min in m3/h = 0.028316846592 * 60

    return {
      areaM2,
      deMm,
      dhMm,
      velocity,
      reynolds,
      lambda,
      pressureDropPerM,
      flowCfm,
    };
  }, [shape, flowRate, diameter, width, height, roughnessMm, rhoStr, nuStr]);

  const copyToClipboard = async () => {
    if (!physics) return;
    const text = [
      'Air Duct Sizing & Friction Loss Report (Colebrook & Huebscher)',
      `Shape: ${shape === 'round' ? 'Round' : 'Rectangular'} | Airflow: ${flowRate} m3/h (${physics.flowCfm.toFixed(1)} CFM)`,
      shape === 'round' ? `Diameter: ${diameter} mm` : `Dimensions: ${width} x ${height} mm`,
      `Cross-Section Area: ${physics.areaM2.toFixed(4)} m2`,
      `Hydraulic Diameter (Dh): ${physics.dhMm.toFixed(1)} mm | Huebscher Equivalent (De): ${physics.deMm.toFixed(2)} mm`,
      `Air Velocity: ${physics.velocity.toFixed(3)} m/s | Reynolds Number: ${Math.round(physics.reynolds)}`,
      `Darcy Friction Factor (lambda): ${physics.lambda.toFixed(5)}`,
      `Friction Loss Rate: ${physics.pressureDropPerM.toFixed(4)} Pa/m`,
    ].join('\n');
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const exportCsv = () => {
    if (!physics) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Duct Shape', shape, '-', 'Round or Rectangular'],
      ['Airflow Rate', flowRate, 'm3/h', `${physics.flowCfm.toFixed(2)} CFM`],
      ['Section Dimensions', shape === 'round' ? `D=${diameter}` : `${width}x${height}`, 'mm', 'Internal duct size'],
      ['Wall Roughness (k)', roughnessMm, 'mm', 'Absolute surface roughness'],
      ['Cross-Section Area', physics.areaM2.toFixed(4), 'm2', 'Flow area'],
      ['Huebscher Equivalent Diameter (De)', physics.deMm.toFixed(2), 'mm', '1.30*(ab)^0.625/(a+b)^0.25'],
      ['Hydraulic Diameter (Dh)', physics.dhMm.toFixed(1), 'mm', '2ab/(a+b) or D'],
      ['Air Velocity (v)', physics.velocity.toFixed(3), 'm/s', 'Q / Area'],
      ['Reynolds Number (Re)', Math.round(physics.reynolds).toString(), '-', 'v * Dh / nu'],
      ['Darcy Friction Factor (lambda)', physics.lambda.toFixed(5), '-', 'Colebrook equation'],
      ['Specific Friction Loss', physics.pressureDropPerM.toFixed(4), 'Pa/m', 'lambda * rho * v^2 / (2 * Dh)'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duct-friction-loss-${shape}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const animDuration = useMemo(() => {
    if (!physics || physics.velocity <= 0.1) return 0;
    const dur = 15 / physics.velocity;
    return Math.max(0.2, Math.min(10, dur));
  }, [physics]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Input Parameters</span>
            </h2>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="btn-shape-round"
              onClick={() => setShape('round')}
              className={`py-3 px-4 rounded-2xl text-sm font-black border transition-all cursor-pointer ${
                shape === 'round'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Round Duct
            </button>
            <button
              type="button"
              data-testid="btn-shape-rectangular"
              onClick={() => setShape('rectangular')}
              className={`py-3 px-4 rounded-2xl text-sm font-black border transition-all cursor-pointer ${
                shape === 'rectangular'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Rectangular Duct
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Airflow Rate Q (m³/h)
            </label>
            <input
              type="text"
              data-testid="input-airflow"
              value={flowRate}
              onChange={(e) => setFlowRate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {shape === 'round' ? (
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Round Diameter D (mm)
              </label>
              <input
                type="text"
                data-testid="input-diameter"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  Width a (mm)
                </label>
                <input
                  type="text"
                  data-testid="input-width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                  Height b (mm)
                </label>
                <input
                  type="text"
                  data-testid="input-height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Material Wall Roughness Preset
            </label>
            <select
              data-testid="select-roughness"
              value={roughnessPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
            >
              {ROUGHNESS_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Absolute Roughness k (mm)
              </label>
              <input
                type="text"
                data-testid="input-roughness"
                value={roughnessMm}
                onChange={(e) => {
                  setRoughnessPreset('custom');
                  setRoughnessMm(e.target.value);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Air Density (kg/m³)
              </label>
              <input
                type="text"
                data-testid="input-rho"
                value={rhoStr}
                onChange={(e) => setRhoStr(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Kinematic Viscosity (m²/s)
              </label>
              <input
                type="text"
                data-testid="input-nu"
                value={nuStr}
                onChange={(e) => setNuStr(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {!physics && (
            <div
              data-testid="validation-error"
              className="p-3 rounded-xl bg-rose-950/70 border border-rose-700 text-rose-200 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive airflow, duct dimensions, roughness (&ge; 0), air density, and viscosity.
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Flow Physics Results</span>
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={copyToClipboard}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-all text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Report'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  onClick={exportCsv}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <span>Velocity</span>
                  <Wind className="w-3 h-3" />
                </div>
                <div className="text-2xl font-black text-blue-900 mt-1">
                  <span data-testid="result-velocity">{physics ? physics.velocity.toFixed(3) : '—'}</span>
                  <span className="text-xs font-bold text-blue-500 ml-1">m/s</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-700 uppercase tracking-wider">Friction Loss</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">
                  <span data-testid="result-dp-m">{physics ? physics.pressureDropPerM.toFixed(4) : '—'}</span>
                  <span className="text-xs font-bold text-emerald-600 ml-1">Pa/m</span>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                <div className="text-xs font-black text-indigo-700 uppercase tracking-wider">Equivalent Dia (De)</div>
                <div className="text-2xl font-black text-indigo-900 mt-1">
                  <span data-testid="result-de">{physics ? physics.deMm.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-indigo-600 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider">Hydraulic Dia (Dh)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  <span data-testid="result-dh">{physics ? physics.dhMm.toFixed(1) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider">Flow Area (A)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  <span data-testid="result-area">{physics ? physics.areaM2.toFixed(4) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">m²</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider">Friction Factor (λ)</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  <span data-testid="result-lambda">{physics ? physics.lambda.toFixed(5) : '—'}</span>
                </div>
              </div>
            </div>

            {physics && physics.velocity > 6.0 && (
              <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs font-medium">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  Actual velocity ({physics.velocity.toFixed(2)} m/s) exceeds typical 6.0 m/s low-noise branch guideline. Consider enlarging the cross-section.
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Duct Section Flow Preview
              </span>
              <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">
                Re = <span data-testid="result-reynolds">{physics ? Math.round(physics.reynolds) : '—'}</span>
              </span>
            </div>

            <div className="relative w-full h-[180px] bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 180" fill="none">
                {animDuration > 0 && (
                  <>
                    <path d="M 30 60 L 370 60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,12" />
                    <path d="M 30 90 L 370 90" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="8,14" />
                    <path d="M 30 120 L 370 120" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,12" />
                  </>
                )}
                {shape === 'round' ? (
                  <g>
                    <rect x="40" y="45" width="320" height="90" rx="4" stroke="#475569" strokeWidth="3" fill="none" opacity="0.5" />
                    <ellipse cx="40" cy="90" rx="14" ry="45" stroke="#64748b" strokeWidth="3" fill="#0f172a" />
                    <ellipse cx="360" cy="90" rx="14" ry="45" stroke="#64748b" strokeWidth="3" fill="none" />
                  </g>
                ) : (
                  <g>
                    <rect x="35" y="40" width="35" height="100" stroke="#64748b" strokeWidth="3" fill="#0f172a" rx="2" />
                    <rect x="70" y="40" width="260" height="100" stroke="#475569" strokeWidth="2.5" fill="none" opacity="0.35" />
                    <rect x="330" y="40" width="35" height="100" stroke="#64748b" strokeWidth="3" fill="none" rx="2" />
                  </g>
                )}
              </svg>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Huebscher Equivalent: d_e = 1.30 * (a * b)^0.625 / (a + b)^0.25. Darcy-Weisbach loss: Delta_p/L = lambda * rho * v^2 / (2 * D_h), with Colebrook friction factor.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
