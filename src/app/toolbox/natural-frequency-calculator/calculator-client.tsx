'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  Settings,
} from 'lucide-react';

type SystemMode = 'spring' | 'cantilever' | 'simply_supported';

interface PresetSpec {
  id: string;
  label: string;
  mode: SystemMode;
  stiffness: string;
  elasticModulusGpa: string;
  inertiaCm4: string;
  lengthM: string;
  massKg: string;
}

const STANDARD_GRAVITY = 9.80665;

const PRESETS: PresetSpec[] = [
  {
    id: 'sdof-spring',
    label: 'SDOF Spring-Mass (k=10,000 N/m, m=10 kg)',
    mode: 'spring',
    stiffness: '10000',
    elasticModulusGpa: '210',
    inertiaCm4: '80',
    lengthM: '1.2',
    massKg: '10',
  },
  {
    id: 'cantilever-steel',
    label: 'Cantilever Beam Tip Mass (Steel E=200 GPa, I=120 cm4, L=1.5 m, m=25 kg)',
    mode: 'cantilever',
    stiffness: '10000',
    elasticModulusGpa: '200',
    inertiaCm4: '120',
    lengthM: '1.5',
    massKg: '25',
  },
  {
    id: 'simply-supported-beam',
    label: 'Simply Supported Beam Midspan (E=70 GPa Al, I=250 cm4, L=2 m, m=40 kg)',
    mode: 'simply_supported',
    stiffness: '10000',
    elasticModulusGpa: '70',
    inertiaCm4: '250',
    lengthM: '2',
    massKg: '40',
  },
];

function parsePositive(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function fmt(n: number, decimals = 4): string {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(decimals);
}

export default function NaturalFrequencyCalculatorClient() {
  const [mode, setMode] = useState<SystemMode>('spring');
  const [stiffnessStr, setStiffnessStr] = useState('10000');
  const [elasticModulusStr, setElasticModulusStr] = useState('210');
  const [inertiaCm4Str, setInertiaCm4Str] = useState('80');
  const [lengthMStr, setLengthMStr] = useState('1.2');
  const [massKgStr, setMassKgStr] = useState('10');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: PresetSpec) => {
    setMode(p.mode);
    setStiffnessStr(p.stiffness);
    setElasticModulusStr(p.elasticModulusGpa);
    setInertiaCm4Str(p.inertiaCm4);
    setLengthMStr(p.lengthM);
    setMassKgStr(p.massKg);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const evaluation = useMemo(() => {
    const m = parsePositive(massKgStr);
    if (!Number.isFinite(m)) {
      return { valid: false as const, error: 'Mass m must be a positive number (kg).' };
    }

    let kEq = NaN;
    if (mode === 'spring') {
      const k = parsePositive(stiffnessStr);
      if (!Number.isFinite(k)) {
        return { valid: false as const, error: 'Spring stiffness k must be a positive number (N/m).' };
      }
      kEq = k;
    } else {
      const eGpa = parsePositive(elasticModulusStr);
      const iCm4 = parsePositive(inertiaCm4Str);
      const lengthM = parsePositive(lengthMStr);
      if (!Number.isFinite(eGpa) || !Number.isFinite(iCm4) || !Number.isFinite(lengthM)) {
        return {
          valid: false as const,
          error: 'Modulus E (GPa), Second Moment I (cm4), and Span L (m) must all be positive numbers.',
        };
      }
      const ei = eGpa * 1e9 * (iCm4 * 1e-8); // N*m^2
      const factor = mode === 'cantilever' ? 3 : 48;
      kEq = (factor * ei) / Math.pow(lengthM, 3);
    }

    const wn = Math.sqrt(kEq / m);
    const fn = wn / (2 * Math.PI);
    const period = 1 / fn;
    const staticDeflMm = ((m * STANDARD_GRAVITY) / kEq) * 1000;

    return {
      valid: true as const,
      kEq,
      m,
      wn,
      fn,
      period,
      staticDeflMm,
    };
  }, [mode, stiffnessStr, elasticModulusStr, inertiaCm4Str, lengthMStr, massKgStr]);

  const handleCopy = () => {
    if (!evaluation.valid) return;
    const report = [
      'Natural Frequency Calculation Summary',
      `Mode: ${mode}`,
      `Equivalent Stiffness k_eq: ${fmt(evaluation.kEq, 4)} N/m`,
      `Effective Mass m: ${fmt(evaluation.m, 4)} kg`,
      `Natural Frequency fn: ${fmt(evaluation.fn, 4)} Hz`,
      `Angular Frequency omega_n: ${fmt(evaluation.wn, 4)} rad/s`,
      `Period T: ${fmt(evaluation.period, 5)} s`,
      `Static Deflection (g=${STANDARD_GRAVITY} m/s^2): ${fmt(evaluation.staticDeflMm, 5)} mm`,
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
      `System Mode,${mode},text`,
      `Equivalent Stiffness k_eq,${evaluation.kEq.toFixed(6)},N/m`,
      `Mass m,${evaluation.m.toFixed(6)},kg`,
      `Natural Frequency fn,${evaluation.fn.toFixed(6)},Hz`,
      `Angular Frequency omega_n,${evaluation.wn.toFixed(6)},rad/s`,
      `Natural Period T,${evaluation.period.toFixed(6)},s`,
      `Static Deflection delta_st,${evaluation.staticDeflMm.toFixed(6)},mm`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'natural_frequency_report.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">System Inputs</h2>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              System Model
            </label>
            <select
              data-testid="select-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as SystemMode)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            >
              <option value="spring">Linear Lumped Spring-Mass (k, m)</option>
              <option value="cantilever">Cantilever Beam End Mass (3EI / L^3)</option>
              <option value="simply_supported">Simply Supported Midspan Mass (48EI / L^3)</option>
            </select>
          </div>

          {mode === 'spring' ? (
            <div>
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Spring Stiffness k (N/m)
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-stiffness"
                value={stiffnessStr}
                onChange={(e) => setStiffnessStr(e.target.value)}
                placeholder="10000"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Elastic Modulus E (GPa)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-modulus"
                  value={elasticModulusStr}
                  onChange={(e) => setElasticModulusStr(e.target.value)}
                  placeholder="200"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Area Moment of Inertia I (cm^4)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-inertia"
                  value={inertiaCm4Str}
                  onChange={(e) => setInertiaCm4Str(e.target.value)}
                  placeholder="120"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Beam Span Length L (m)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-length"
                  value={lengthMStr}
                  onChange={(e) => setLengthMStr(e.target.value)}
                  placeholder="1.5"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Effective Mass m (kg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-mass"
              value={massKgStr}
              onChange={(e) => setMassKgStr(e.target.value)}
              placeholder="10"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
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
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Modal Response</h2>
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
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Natural Frequency fn</div>
                  <div className="text-2xl font-black text-blue-800">
                    <span data-testid="out-fn">{fmt(evaluation.fn, 4)}</span>
                    <span className="text-base text-blue-500"> Hz</span>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Angular Frequency omega_n</div>
                  <div className="text-2xl font-black text-emerald-800">
                    <span data-testid="out-wn">{fmt(evaluation.wn, 4)}</span>
                    <span className="text-base text-emerald-500"> rad/s</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                  <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Natural Period T</div>
                  <div className="text-2xl font-black text-amber-800">
                    <span data-testid="out-period">{fmt(evaluation.period, 5)}</span>
                    <span className="text-base text-amber-500"> s</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Equivalent Stiffness k_eq</div>
                  <div className="text-2xl font-black text-slate-800">
                    <span data-testid="out-keq">{fmt(evaluation.kEq, 4)}</span>
                    <span className="text-base text-slate-500"> N/m</span>
                  </div>
                </div>
                <div className="sm:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Static Gravity Deflection (g = {STANDARD_GRAVITY} m/s^2)
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    <span data-testid="out-defl">{fmt(evaluation.staticDeflMm, 5)}</span> mm
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Single-degree-of-freedom undamped model: omega_n = sqrt(k_eq / m), fn = omega_n / (2 * pi). Beam models treat the beam self-mass as negligible relative to the lumped tip or midspan mass (Euler-Bernoulli bending stiffness k_eq = 3EI/L^3 cantilever or 48EI/L^3 simply supported).
                </span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <a
                  href="https://en.wikipedia.org/wiki/Natural_frequency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Natural Frequency Reference (Wikipedia) <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Standard_gravity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Standard Gravity g = 9.80665 m/s^2 <ExternalLink className="w-3 h-3" />
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
