'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Wind, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parseNonNeg(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

export default function LiftForceCalculatorClient() {
  const [rhoStr, setRhoStr] = useState('1.225');
  const [velStr, setVelStr] = useState('60');
  const [areaStr, setAreaStr] = useState('16');
  const [clStr, setClStr] = useState('0.8');
  const [cd0Str, setCd0Str] = useState('0.025');
  const [arStr, setArStr] = useState('7.5');
  const [eStr, setEStr] = useState('0.82');
  const [copied, setCopied] = useState(false);

  const rho = parsePos(rhoStr);
  const vel = parsePos(velStr);
  const area = parsePos(areaStr);
  const cl = parsePos(clStr);
  const cd0 = parseNonNeg(cd0Str);
  const ar = parsePos(arStr);
  const oswaldE = parsePos(eStr);

  const eOk = oswaldE !== null && oswaldE > 0 && oswaldE <= 1;
  const isValid =
    rho !== null && vel !== null && area !== null && cl !== null && cd0 !== null && ar !== null && eOk;

  let dynPressPa: number | null = null;
  let liftN: number | null = null;
  let dragN: number | null = null;
  let cdi: number | null = null;
  let ldRatio: number | null = null;

  if (isValid && rho !== null && vel !== null && area !== null && cl !== null && cd0 !== null && ar !== null && oswaldE !== null) {
    dynPressPa = 0.5 * rho * vel * vel;
    liftN = dynPressPa * area * cl;
    cdi = (cl * cl) / (Math.PI * ar * oswaldE);
    const cdTotal = cd0 + cdi;
    dragN = dynPressPa * area * cdTotal;
    ldRatio = dragN > 0 ? liftN / dragN : null;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (r: string, v: string, s: string, clv: string, cd0v: string, arv: string, ev: string) => {
    setRhoStr(r);
    setVelStr(v);
    setAreaStr(s);
    setClStr(clv);
    setCd0Str(cd0v);
    setArStr(arv);
    setEStr(ev);
  };

  const handleReset = () => applyPreset('1.225', '60', '16', '0.8', '0.025', '7.5', '0.82');

  const handleCopy = async () => {
    if (!isValid || dynPressPa === null || liftN === null || dragN === null || ldRatio === null) return;
    const text = [
      'Aerodynamic Lift & Parabolic Drag Polar',
      `V=${vel} m/s, S=${area} m2, rho=${rho} kg/m3, C_L=${cl}, AR=${ar}, e=${oswaldE}`,
      `Dynamic Pressure q: ${dynPressPa.toFixed(2)} Pa`,
      `Lift Force L: ${liftN.toFixed(1)} N, Total Drag D: ${dragN.toFixed(1)} N, L/D: ${ldRatio.toFixed(2)}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || dynPressPa === null || liftN === null || dragN === null || cdi === null || ldRatio === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['air_density', String(rho), 'kg/m3'],
      ['airspeed', String(vel), 'm/s'],
      ['wing_area', String(area), 'm2'],
      ['lift_coeff_cl', String(cl), 'ratio'],
      ['zero_lift_drag_cd0', String(cd0), 'ratio'],
      ['aspect_ratio', String(ar), 'ratio'],
      ['oswald_efficiency', String(oswaldE), 'ratio'],
      ['dynamic_pressure_pa', dynPressPa.toFixed(3), 'Pa'],
      ['lift_force_n', liftN.toFixed(3), 'N'],
      ['induced_drag_cdi', cdi.toFixed(6), 'ratio'],
      ['total_drag_n', dragN.toFixed(3), 'N'],
      ['lift_to_drag_ratio', ldRatio.toFixed(3), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aerodynamic-lift-drag.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Wind className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Wing &amp; Flight Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-light-aircraft"
                onClick={() => applyPreset('1.225', '60', '16', '0.8', '0.025', '7.5', '0.82')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Light GA Cruise (60 m/s, S=16 m2, AR=7.5)
              </button>
              <button
                type="button"
                data-testid="preset-uav-cruise"
                onClick={() => applyPreset('1.225', '25', '1.4', '0.75', '0.02', '12', '0.85')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                Fixed-Wing UAV (25 m/s, S=1.4 m2, AR=12)
              </button>
              <button
                type="button"
                data-testid="preset-sailplane"
                onClick={() => applyPreset('1.11', '32', '11.5', '0.9', '0.015', '24', '0.9')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
              >
                High-AR Sailplane (32 m/s, AR=24)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Air Density (kg/m3)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-rho"
                  value={rhoStr}
                  onChange={e => setRhoStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Airspeed V (m/s)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-vel"
                  value={velStr}
                  onChange={e => setVelStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Wing Area S (m2)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-area"
                  value={areaStr}
                  onChange={e => setAreaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Lift Coeff C_L</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-cl"
                  value={clStr}
                  onChange={e => setClStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">C_D0</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-cd0"
                  value={cd0Str}
                  onChange={e => setCd0Str(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">AR</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-ar"
                  value={arStr}
                  onChange={e => setArStr(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">e (0–1]</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-e"
                  value={eStr}
                  onChange={e => setEStr(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure rho, V, S, C_L, AR &gt; 0, C_D0 &ge; 0, and Oswald efficiency e in (0, 1].</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Lift &amp; Induced Drag Polar</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                L = 0.5*rho*V^2*S*C_L, C_Di = C_L^2 / (pi*AR*e), D = q*S*(C_D0 + C_Di)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-sm font-black text-teal-600 uppercase tracking-wider mb-1">Lift Force L</div>
                <div className="text-3xl font-black text-teal-900">
                  <span data-testid="result-lift">{fmt(liftN, 2)}</span>{' '}
                  <span className="text-lg text-teal-600">N</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Total Drag Force D</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-drag">{fmt(dragN, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">N</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  C_Di: <span data-testid="result-cdi">{fmt(cdi, 5)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Lift-to-Drag Ratio (L/D)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-ld">{fmt(ldRatio, 2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Dynamic Pressure q</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-q">{fmt(dynPressPa, 2)}</span>{' '}
                  <span className="text-lg text-slate-500">Pa</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
