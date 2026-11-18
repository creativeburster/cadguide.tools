'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Zap, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function ImpactForceCalculatorClient() {
  const [massStr, setMassStr] = useState('100');
  const [heightStr, setHeightStr] = useState('2');
  const [stopDistStr, setStopDistStr] = useState('0.05');
  const [gravityStr, setGravityStr] = useState('9.80665');
  const [copied, setCopied] = useState(false);

  const mass = parsePos(massStr);
  const height = parsePos(heightStr);
  const stopDist = parsePos(stopDistStr);
  const gravity = parsePos(gravityStr);

  const isValid = mass !== null && height !== null && stopDist !== null && gravity !== null;

  let avgForceN: number | null = null;
  let avgForceKn: number | null = null;
  let velocityMs: number | null = null;
  let energyJ: number | null = null;
  let decelG: number | null = null;
  let loadFactor: number | null = null;

  if (isValid && mass !== null && height !== null && stopDist !== null && gravity !== null) {
    energyJ = mass * gravity * height;
    velocityMs = Math.sqrt(2 * gravity * height);
    loadFactor = 1 + height / stopDist;
    avgForceN = mass * gravity * loadFactor;
    avgForceKn = avgForceN / 1000;
    decelG = height / stopDist;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (m: string, h: string, d: string, g: string) => {
    setMassStr(m);
    setHeightStr(h);
    setStopDistStr(d);
    setGravityStr(g);
  };

  const handleReset = () => applyPreset('100', '2', '0.05', '9.80665');

  const handleCopy = async () => {
    if (!isValid || avgForceKn === null || avgForceN === null || velocityMs === null || energyJ === null) return;
    const text = [
      'Drop Impact Force Summary',
      `Mass: ${mass} kg, Drop Height: ${height} m, Stopping Distance: ${stopDist} m`,
      `Average Impact Force: ${avgForceKn.toFixed(3)} kN (${avgForceN.toFixed(1)} N)`,
      `Impact Velocity: ${velocityMs.toFixed(3)} m/s`,
      `Kinetic Energy: ${energyJ.toFixed(1)} J`,
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
    if (!isValid || avgForceN === null || avgForceKn === null || velocityMs === null || energyJ === null || decelG === null || loadFactor === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['mass', String(mass), 'kg'],
      ['drop_height', String(height), 'm'],
      ['stopping_distance', String(stopDist), 'm'],
      ['gravity', String(gravity), 'm/s2'],
      ['average_impact_force_n', avgForceN.toFixed(4), 'N'],
      ['average_impact_force_kn', avgForceKn.toFixed(4), 'kN'],
      ['impact_velocity', velocityMs.toFixed(4), 'm/s'],
      ['impact_energy', energyJ.toFixed(4), 'J'],
      ['mean_deceleration_g', decelG.toFixed(4), 'g'],
      ['dynamic_load_factor', loadFactor.toFixed(4), 'ratio'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impact-force-calculation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Drop Parameters</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-drop-100kg"
                onClick={() => applyPreset('100', '2', '0.05', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Standard Drop Test (100 kg, 2 m, 0.05 m)
              </button>
              <button
                type="button"
                data-testid="preset-package-foam"
                onClick={() => applyPreset('15', '1.2', '0.04', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Cushioned Crate (15 kg, 1.2 m, 0.04 m)
              </button>
              <button
                type="button"
                data-testid="preset-heavy-shock"
                onClick={() => applyPreset('500', '0.5', '0.01', '9.80665')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Rigid Steel Strike (500 kg, 0.5 m, 0.01 m)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Mass m (kg)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-mass"
                value={massStr}
                onChange={e => setMassStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Drop Height h (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-height"
                value={heightStr}
                onChange={e => setHeightStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Stopping Distance d (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-stop-dist"
                value={stopDistStr}
                onChange={e => setStopDistStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Gravity g (m/s2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-gravity"
                value={gravityStr}
                onChange={e => setGravityStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All inputs (mass, drop height, stopping distance, gravity) must be strictly positive numbers.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Work-Energy Impact Analysis</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                F_avg = m x g x (1 + h / d), where weight work during crush distance d is included
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Average Impact Force</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-force-kn">{fmt(avgForceKn, 3)}</span>{' '}
                  <span className="text-lg text-blue-600">kN</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  <span data-testid="result-force-n">{fmt(avgForceN, 1)}</span> N
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Impact Velocity</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-velocity">{fmt(velocityMs, 3)}</span>{' '}
                  <span className="text-lg text-emerald-600">m/s</span>
                </div>
                <div className="text-xs text-emerald-700 mt-1 font-medium">v = sqrt(2gh)</div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Impact Energy</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-energy">{fmt(energyJ, 1)}</span>{' '}
                  <span className="text-lg text-orange-600">J</span>
                </div>
                <div className="text-xs text-orange-700 mt-1 font-medium">E = mgh</div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Mean Deceleration</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-decel-g">{fmt(decelG, 1)}</span>{' '}
                  <span className="text-lg text-purple-600">g</span>
                </div>
                <div className="text-xs text-purple-700 mt-1 font-medium">
                  Dynamic load factor: <span data-testid="result-load-factor">{fmt(loadFactor, 1)}</span>x
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
