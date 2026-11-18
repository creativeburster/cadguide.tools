'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Gauge, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT_RE = /^\d+$/;

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

function parsePosInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 1 ? v : null;
}

export default function InjectionClampingForceCalculatorClient() {
  const [partAreaStr, setPartAreaStr] = useState('120');
  const [cavitiesStr, setCavitiesStr] = useState('4');
  const [runnerPctStr, setRunnerPctStr] = useState('15');
  const [pressureStr, setPressureStr] = useState('40');
  const [safetyStr, setSafetyStr] = useState('1.2');
  const [copied, setCopied] = useState(false);

  const partArea = parsePos(partAreaStr);
  const cavities = parsePosInt(cavitiesStr);
  const runnerPct = parseNonNeg(runnerPctStr);
  const pressure = parsePos(pressureStr);
  const sf = parsePos(safetyStr);

  const isValid =
    partArea !== null &&
    cavities !== null &&
    runnerPct !== null &&
    pressure !== null &&
    sf !== null &&
    sf >= 1;

  let totalAreaCm2: number | null = null;
  let clampKn: number | null = null;
  let clampTonnes: number | null = null;
  let clampUsTons: number | null = null;

  if (isValid && partArea !== null && cavities !== null && runnerPct !== null && pressure !== null && sf !== null) {
    totalAreaCm2 = cavities * partArea * (1 + runnerPct / 100);
    clampKn = totalAreaCm2 * pressure * 0.1 * sf;
    clampTonnes = clampKn / 9.80665;
    clampUsTons = clampKn / 8.896443230521;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (a: string, n: string, r: string, p: string, s: string) => {
    setPartAreaStr(a);
    setCavitiesStr(n);
    setRunnerPctStr(r);
    setPressureStr(p);
    setSafetyStr(s);
  };

  const handleReset = () => applyPreset('120', '4', '15', '40', '1.2');

  const handleCopy = async () => {
    if (!isValid || totalAreaCm2 === null || clampKn === null || clampTonnes === null || clampUsTons === null) return;
    const text = [
      'Injection Mold Clamping Force Summary',
      `Part Area: ${partArea} cm2 x ${cavities} cavities (+${runnerPct}% runner) = ${totalAreaCm2.toFixed(2)} cm2`,
      `Cavity Pressure: ${pressure} MPa, Safety Factor: ${sf}`,
      `Required Clamping Force: ${clampTonnes.toFixed(2)} metric tonnes (${clampKn.toFixed(2)} kN / ${clampUsTons.toFixed(2)} US tons)`,
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
    if (!isValid || totalAreaCm2 === null || clampKn === null || clampTonnes === null || clampUsTons === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['part_projected_area', String(partArea), 'cm2'],
      ['cavity_count', String(cavities), 'pcs'],
      ['runner_allowance', String(runnerPct), '%'],
      ['cavity_pressure', String(pressure), 'MPa'],
      ['safety_factor', String(sf), 'ratio'],
      ['total_projected_area', totalAreaCm2.toFixed(4), 'cm2'],
      ['clamping_force_kn', clampKn.toFixed(4), 'kN'],
      ['clamping_force_tonnes', clampTonnes.toFixed(4), 'tonnes'],
      ['clamping_force_us_tons', clampUsTons.toFixed(4), 'short_tons'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'injection-clamping-force.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Mold Parameters</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-4cav-abs"
                onClick={() => applyPreset('120', '4', '15', '40', '1.2')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                4-Cavity ABS Brackets (120 cm2, 40 MPa)
              </button>
              <button
                type="button"
                data-testid="preset-single-housing"
                onClick={() => applyPreset('450', '1', '8', '45', '1.25')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Single Large Housing (450 cm2, 45 MPa)
              </button>
              <button
                type="button"
                data-testid="preset-16cav-cap"
                onClick={() => applyPreset('18', '16', '22', '35', '1.15')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200 transition-colors"
              >
                16-Cavity PP Caps (18 cm2, 35 MPa)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Single Part Area (cm2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-area"
                value={partAreaStr}
                onChange={e => setPartAreaStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Cavities N</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-cavities"
                  value={cavitiesStr}
                  onChange={e => setCavitiesStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Runner (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-runner"
                  value={runnerPctStr}
                  onChange={e => setRunnerPctStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Avg Cavity Pressure (MPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-pressure"
                value={pressureStr}
                onChange={e => setPressureStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Safety Factor (&ge; 1.0)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-safety"
                value={safetyStr}
                onChange={e => setSafetyStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Area and pressure must be &gt; 0, cavity count an integer &ge; 1, runner &ge; 0, and safety factor &ge; 1.0.</span>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Clamping Force Results</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                F (kN) = Total Projected Area (cm2) x Cavity Pressure (MPa) x 0.1 x Safety Factor
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Clamping Force (Metric Tonnes)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-tonnes">{fmt(clampTonnes, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">t</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Clamping Force (kN)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-kn">{fmt(clampKn, 2)}</span>{' '}
                  <span className="text-lg text-emerald-600">kN</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Total Projected Area</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-total-area">{fmt(totalAreaCm2, 2)}</span>{' '}
                  <span className="text-lg text-orange-600">cm2</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Clamping Force (US Short Tons)</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-ustons">{fmt(clampUsTons, 2)}</span>{' '}
                  <span className="text-lg text-purple-600">tons</span>
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
