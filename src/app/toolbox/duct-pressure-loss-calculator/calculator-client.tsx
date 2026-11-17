'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface DuctLossPreset {
  id: string;
  label: string;
  airflow: string;
  diameter: string;
  length: string;
  roughness: string;
  sumK: string;
  rho: string;
  nu: string;
}

const PRESETS: DuctLossPreset[] = [
  {
    id: 'default',
    label: 'Default (2000 m3/h · Ø300 · Galv 0.15mm)',
    airflow: '2000',
    diameter: '300',
    length: '20',
    roughness: '0.15',
    sumK: '2.0',
    rho: '1.204',
    nu: '0.00001516',
  },
  {
    id: 'smooth-pvc',
    label: 'Smooth Steel/PVC (3600 m3/h · Ø400 · 0.015mm)',
    airflow: '3600',
    diameter: '400',
    length: '30',
    roughness: '0.015',
    sumK: '3.5',
    rho: '1.204',
    nu: '0.00001516',
  },
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

export default function DuctPressureLossCalculatorClient() {
  const [airflow, setAirflow] = useState('2000');
  const [diameter, setDiameter] = useState('300');
  const [length, setLength] = useState('20');
  const [roughness, setRoughness] = useState('0.15');
  const [sumK, setSumK] = useState('2.0');
  const [rho, setRho] = useState('1.204');
  const [nu, setNu] = useState('0.00001516');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: DuctLossPreset) => {
    setAirflow(p.airflow);
    setDiameter(p.diameter);
    setLength(p.length);
    setRoughness(p.roughness);
    setSumK(p.sumK);
    setRho(p.rho);
    setNu(p.nu);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const Qm3h = parsePositive(airflow, 5000000);
    const Dmm = parsePositive(diameter, 10000);
    const Lm = parseNonNeg(length, 50000);
    const kMm = parseNonNeg(roughness, 50);
    const kSum = parseNonNeg(sumK, 500);
    const density = parsePositive(rho, 20);
    const viscosity = parsePositive(nu, 0.01);

    if (
      Qm3h === null ||
      Dmm === null ||
      Lm === null ||
      kMm === null ||
      kSum === null ||
      density === null ||
      viscosity === null
    ) {
      return null;
    }

    const Q = Qm3h / 3600;
    const D = Dmm / 1000;
    const area = (Math.PI * D * D) / 4;
    const velocity = Q / area;
    const reynolds = (velocity * D) / viscosity;
    const relRough = kMm / Dmm;
    const lambda = solveColebrook(reynolds, relRough);
    const velocityPressure = 0.5 * density * velocity * velocity;
    const frictionLoss = lambda * (Lm / D) * velocityPressure;
    const fittingLoss = kSum * velocityPressure;
    const totalLoss = frictionLoss + fittingLoss;
    const totalLossInWg = totalLoss / 248.84;

    return {
      velocity,
      reynolds,
      lambda,
      velocityPressure,
      frictionLoss,
      fittingLoss,
      totalLoss,
      totalLossInWg,
    };
  }, [airflow, diameter, length, roughness, sumK, rho, nu]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'Air Duct Pressure Loss Report (Darcy-Weisbach & Colebrook)',
      `Airflow Q: ${airflow} m3/h | Diameter D: ${diameter} mm | Length L: ${length} m`,
      `Wall Roughness k: ${roughness} mm | Fitting Loss Sum K: ${sumK} | Density: ${rho} kg/m3`,
      `Air Velocity: ${result.velocity.toFixed(3)} m/s | Reynolds Number: ${Math.round(result.reynolds)}`,
      `Darcy-Weisbach Friction Factor (lambda): ${result.lambda.toFixed(5)}`,
      `Major Friction Loss: ${result.frictionLoss.toFixed(3)} Pa | Fitting Loss: ${result.fittingLoss.toFixed(3)} Pa`,
      `Total Pressure Loss: ${result.totalLoss.toFixed(3)} Pa (${result.totalLossInWg.toFixed(4)} in. w.g.)`,
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

  const handleDownloadCsv = () => {
    if (!result) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Formula / Source'],
      ['Airflow Rate (Q)', airflow, 'm3/h', 'Input'],
      ['Duct Diameter (D)', diameter, 'mm', 'Input'],
      ['Straight Duct Length (L)', length, 'm', 'Input'],
      ['Surface Roughness (k)', roughness, 'mm', 'Galvanized steel 0.15 mm typical'],
      ['Sum of Fitting K', sumK, '-', 'Input minor loss coefficients'],
      ['Air Density (rho)', rho, 'kg/m3', 'Standard air 20 C'],
      ['Kinematic Viscosity (nu)', nu, 'm2/s', 'Standard air 20 C'],
      ['Air Velocity (v)', result.velocity.toFixed(3), 'm/s', 'Q / (pi * D^2 / 4)'],
      ['Reynolds Number (Re)', Math.round(result.reynolds).toString(), '-', 'v * D / nu'],
      ['Friction Factor (lambda)', result.lambda.toFixed(5), '-', 'Colebrook iteration (Re>2300) or 64/Re'],
      ['Velocity Pressure (Pv)', result.velocityPressure.toFixed(3), 'Pa', '0.5 * rho * v^2'],
      ['Major Friction Loss', result.frictionLoss.toFixed(3), 'Pa', 'lambda * (L / D) * Pv'],
      ['Minor Fitting Loss', result.fittingLoss.toFixed(3), 'Pa', 'sum(K) * Pv'],
      ['Total Pressure Loss', result.totalLoss.toFixed(3), 'Pa', 'Major + Minor'],
      ['Total Pressure Loss (in w.g.)', result.totalLossInWg.toFixed(4), 'in w.g.', 'Pa / 248.84'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duct-pressure-loss-${diameter}mm.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-testid="reset-button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Duct &amp; Air Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Airflow Q (m³/h)
              </label>
              <input
                type="text"
                data-testid="input-airflow"
                value={airflow}
                onChange={(e) => setAirflow(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Duct Dia D (mm)
              </label>
              <input
                type="text"
                data-testid="input-diameter"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Duct Length L (m)
              </label>
              <input
                type="text"
                data-testid="input-length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Wall Roughness k (mm)
              </label>
              <input
                type="text"
                data-testid="input-roughness"
                value={roughness}
                onChange={(e) => setRoughness(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Sum of Fitting K
              </label>
              <input
                type="text"
                data-testid="input-sum-k"
                value={sumK}
                onChange={(e) => setSumK(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Air Density (kg/m³)
              </label>
              <input
                type="text"
                data-testid="input-rho"
                value={rho}
                onChange={(e) => setRho(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Kinematic Viscosity nu (m²/s)
            </label>
            <input
              type="text"
              data-testid="input-nu"
              value={nu}
              onChange={(e) => setNu(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {!result && (
            <div
              data-testid="validation-error"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive airflow, diameter, air density, and viscosity values.
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Pressure Loss Output</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Air Velocity (v)</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-velocity">{result ? result.velocity.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">m/s</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Major Friction Loss</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-friction-loss">{result ? result.frictionLoss.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">Pa</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">Fitting Loss</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-fitting-loss">{result ? result.fittingLoss.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-orange-600 ml-1">Pa</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 col-span-2 sm:col-span-1">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Total Pressure Loss</div>
                <div className="text-2xl font-black text-purple-900">
                  <span data-testid="result-total-loss">{result ? result.totalLoss.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-purple-500 ml-1">Pa</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Friction Factor (λ)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-lambda">{result ? result.lambda.toFixed(5) : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Reynolds (Re)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-reynolds">{result ? Math.round(result.reynolds).toString() : '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                Darcy-Weisbach &amp; Colebrook Fluid Resistance Equations
              </div>
              <p>
                Delta_p_major = lambda * (L / D) * (rho * v^2 / 2); Delta_p_minor = sum(K) * (rho * v^2 / 2).
              </p>
              <p>
                Turbulent friction factor solved iteratively via Colebrook: 1/lambda^0.5 = -2 * log10(2.51 / (Re * lambda^0.5) + (k / D) / 3.72); Laminar (Re &lt;= 2300): lambda = 64 / Re.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
