'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type DuctShape = 'circular' | 'rectangular';

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

export default function DuctSizingCalculatorClient() {
  const [airflow, setAirflow] = useState('1800');
  const [targetVel, setTargetVel] = useState('5.0');
  const [shape, setShape] = useState<DuctShape>('circular');
  const [aspectRatio, setAspectRatio] = useState('1.5');
  const [stepMm, setStepMm] = useState('50');
  const [roughness, setRoughness] = useState('0.15');
  const [copied, setCopied] = useState(false);

  const resetAll = () => {
    setAirflow('1800');
    setTargetVel('5.0');
    setShape('circular');
    setAspectRatio('1.5');
    setStepMm('50');
    setRoughness('0.15');
  };

  const result = useMemo(() => {
    const qM3h = parsePositive(airflow, 5000000);
    const vTarget = parsePositive(targetVel, 100);
    const ar = parsePositive(aspectRatio, 20);
    const step = parsePositive(stepMm, 500);
    const kMm = parseNonNeg(roughness, 50);

    if (qM3h === null || vTarget === null || ar === null || step === null || kMm === null) {
      return null;
    }

    const qM3s = qM3h / 3600;
    const reqAreaM2 = qM3s / vTarget;
    const dRoundMm = Math.sqrt((4 * reqAreaM2) / Math.PI) * 1000;

    let rectW = 0;
    let rectH = 0;
    let actualAreaM2 = reqAreaM2;
    let actualVel = vTarget;
    let deMm = dRoundMm;
    let dhMm = dRoundMm;

    if (shape === 'rectangular') {
      const rawH = Math.sqrt(reqAreaM2 / ar) * 1000;
      rectH = Math.max(step, Math.ceil(rawH / step) * step);
      rectW = Math.max(step, Math.ceil((reqAreaM2 * 1e6) / rectH / step) * step);
      actualAreaM2 = (rectW * rectH) / 1e6;
      actualVel = qM3s / actualAreaM2;
      deMm = (1.30 * Math.pow(rectW * rectH, 0.625)) / Math.pow(rectW + rectH, 0.25);
      dhMm = (2 * rectW * rectH) / (rectW + rectH);
    }

    const rho = 1.204;
    const nu = 1.516e-5;
    const dhM = dhMm / 1000;
    const reynolds = (actualVel * dhM) / nu;
    const lambda = solveColebrook(reynolds, kMm / dhMm);
    const frictionRatePaM = (lambda * rho * actualVel * actualVel) / (2 * dhM);

    return {
      reqAreaM2,
      actualAreaM2,
      dRoundMm,
      deMm,
      dhMm,
      rectW,
      rectH,
      actualVel,
      reynolds,
      lambda,
      frictionRatePaM,
    };
  }, [airflow, targetVel, shape, aspectRatio, stepMm, roughness]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'HVAC Duct Sizing Report (Velocity Method & Darcy-Colebrook)',
      `Airflow Q: ${airflow} m3/h | Target Velocity: ${targetVel} m/s | Shape: ${shape}`,
      `Required Flow Area: ${result.reqAreaM2.toFixed(4)} m2`,
      shape === 'circular'
        ? `Internal Diameter D: ${result.dRoundMm.toFixed(2)} mm`
        : `Rounded Rectangular Size: ${result.rectW} x ${result.rectH} mm (De=${result.deMm.toFixed(2)} mm, Actual v=${result.actualVel.toFixed(3)} m/s)`,
      `Specific Friction Loss: ${result.frictionRatePaM.toFixed(4)} Pa/m (Re=${Math.round(result.reynolds)}, lambda=${result.lambda.toFixed(5)})`,
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
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Airflow Q', airflow, 'm3/h', 'Input design airflow'],
      ['Target Velocity', targetVel, 'm/s', 'Design velocity'],
      ['Duct Shape', shape, '-', 'circular or rectangular'],
      ['Roughness k', roughness, 'mm', 'Absolute roughness'],
      ['Required Area', result.reqAreaM2.toFixed(4), 'm2', 'Q / v_target'],
      ['Circular Diameter', result.dRoundMm.toFixed(2), 'mm', 'sqrt(4 * A / pi)'],
      ['Equivalent Diameter De', result.deMm.toFixed(2), 'mm', shape === 'rectangular' ? 'Huebscher equation' : 'Same as D'],
      ['Hydraulic Diameter Dh', result.dhMm.toFixed(1), 'mm', shape === 'rectangular' ? '2ab/(a+b)' : 'Same as D'],
      ['Actual Air Velocity', result.actualVel.toFixed(3), 'm/s', 'Q / actualArea'],
      ['Specific Friction Loss', result.frictionRatePaM.toFixed(4), 'Pa/m', 'Colebrook + Darcy-Weisbach'],
    ];
    if (shape === 'rectangular') {
      rows.splice(7, 0, ['Rounded Width x Height', `${result.rectW}x${result.rectH}`, 'mm', `Step ${stepMm} mm`]);
    }
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duct-sizing-${shape}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Sizing Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="btn-shape-circular"
              onClick={() => setShape('circular')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                shape === 'circular'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Circular Duct
            </button>
            <button
              type="button"
              data-testid="btn-shape-rectangular"
              onClick={() => setShape('rectangular')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                shape === 'rectangular'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Rectangular Duct
            </button>
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
                Target Velocity (m/s)
              </label>
              <input
                type="text"
                data-testid="input-velocity"
                value={targetVel}
                onChange={(e) => setTargetVel(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {shape === 'rectangular' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Target Aspect Ratio (W:H)
                </label>
                <input
                  type="text"
                  data-testid="input-aspect-ratio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Dimension Step (mm)
                </label>
                <input
                  type="text"
                  data-testid="input-step-mm"
                  value={stepMm}
                  onChange={(e) => setStepMm(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

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

          {!result && (
            <div
              data-testid="validation-error"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive airflow, target velocity, and dimension settings.
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Recommended Sizing</h2>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Required Flow Area</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-area">{result ? result.reqAreaM2.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">m²</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  {shape === 'rectangular' ? 'Huebscher Equivalent (De)' : 'Internal Diameter (D)'}
                </div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-diameter">{result ? result.deMm.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">mm</span>
                </div>
              </div>
              {shape === 'rectangular' && (
                <div className="col-span-2 bg-purple-50 rounded-2xl p-5 border border-purple-100">
                  <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                    Rounded Rectangular Size (W × H)
                  </div>
                  <div className="text-2xl font-black text-purple-900">
                    <span data-testid="result-rect-size">
                      {result ? `${result.rectW} x ${result.rectH}` : '—'}
                    </span>
                    <span className="text-sm font-bold text-purple-600 ml-1.5">
                      mm (Actual v = <span data-testid="result-actual-vel">{result ? result.actualVel.toFixed(3) : '—'}</span> m/s)
                    </span>
                  </div>
                </div>
              )}
              <div className="col-span-2 bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">
                  Specific Friction Loss (Colebrook / Darcy-Weisbach)
                </div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-friction-rate">{result ? result.frictionRatePaM.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-orange-600 ml-1">Pa/m</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                Constant-Velocity Duct Sizing &amp; Colebrook Friction Rate
              </div>
              <p>
                A_req = Q / v; Round D = sqrt(4 * A_req / pi); Huebscher Equivalent De = 1.30 * (a * b)^0.625 / (a + b)^0.25; Friction loss computed at actual velocity and hydraulic diameter Dh using Darcy-Weisbach and Colebrook (rho=1.204 kg/m3, nu=1.516e-5 m2/s).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
