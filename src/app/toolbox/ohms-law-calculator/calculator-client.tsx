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

type KnownPair = 'V_R' | 'V_I' | 'I_R' | 'V_P' | 'I_P' | 'P_R';

interface PairMeta {
  id: KnownPair;
  label: string;
  firstLabel: string;
  secondLabel: string;
}

const PAIR_OPTIONS: PairMeta[] = [
  { id: 'V_R', label: 'Voltage (V) & Resistance (R)', firstLabel: 'Voltage V (V)', secondLabel: 'Resistance R (ohm)' },
  { id: 'V_I', label: 'Voltage (V) & Current (I)', firstLabel: 'Voltage V (V)', secondLabel: 'Current I (A)' },
  { id: 'I_R', label: 'Current (I) & Resistance (R)', firstLabel: 'Current I (A)', secondLabel: 'Resistance R (ohm)' },
  { id: 'V_P', label: 'Voltage (V) & Power (P)', firstLabel: 'Voltage V (V)', secondLabel: 'Power P (W)' },
  { id: 'I_P', label: 'Current (I) & Power (P)', firstLabel: 'Current I (A)', secondLabel: 'Power P (W)' },
  { id: 'P_R', label: 'Power (P) & Resistance (R)', firstLabel: 'Power P (W)', secondLabel: 'Resistance R (ohm)' },
];

interface OhmPreset {
  id: string;
  label: string;
  pair: KnownPair;
  val1: string;
  val2: string;
}

const PRESETS: OhmPreset[] = [
  { id: 'dc-12v-4ohm', label: '12 V Supply across 4 ohm Load (I=3 A, P=36 W)', pair: 'V_R', val1: '12', val2: '4' },
  { id: 'dc-24v-48w', label: '24 V Coil rated 48 W (I=2 A, R=12 ohm)', pair: 'V_P', val1: '24', val2: '48' },
  { id: 'heater-10a-23ohm', label: '10 A Heater 23 ohm (V=230 V, P=2300 W)', pair: 'I_R', val1: '10', val2: '23' },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function fmt(n: number, decimals = 4): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) > 0 && Math.abs(n) < 1) return n.toFixed(5);
  return n.toFixed(decimals);
}

export default function OhmsLawClient() {
  const [pair, setPair] = useState<KnownPair>('V_R');
  const [val1Str, setVal1Str] = useState('12');
  const [val2Str, setVal2Str] = useState('4');
  const [copied, setCopied] = useState(false);

  const pairMeta = PAIR_OPTIONS.find((p) => p.id === pair) ?? PAIR_OPTIONS[0];

  const applyPreset = (p: OhmPreset) => {
    setPair(p.pair);
    setVal1Str(p.val1);
    setVal2Str(p.val2);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const result = useMemo(() => {
    const a = parsePositive(val1Str);
    const b = parsePositive(val2Str);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return {
        valid: false as const,
        error: 'Both known inputs must be strictly positive numbers (> 0).',
      };
    }

    let V = 0;
    let I = 0;
    let R = 0;
    let P = 0;

    switch (pair) {
      case 'V_R':
        V = a;
        R = b;
        I = V / R;
        P = (V * V) / R;
        break;
      case 'V_I':
        V = a;
        I = b;
        R = V / I;
        P = V * I;
        break;
      case 'I_R':
        I = a;
        R = b;
        V = I * R;
        P = I * I * R;
        break;
      case 'V_P':
        V = a;
        P = b;
        I = P / V;
        R = (V * V) / P;
        break;
      case 'I_P':
        I = a;
        P = b;
        V = P / I;
        R = P / (I * I);
        break;
      case 'P_R':
        P = a;
        R = b;
        I = Math.sqrt(P / R);
        V = Math.sqrt(P * R);
        break;
    }

    return {
      valid: true as const,
      V,
      I,
      R,
      P,
      conductance: 1 / R,
    };
  }, [pair, val1Str, val2Str]);

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      "Ohm's Law DC Circuit Summary",
      `Known Pair: ${pairMeta.label}`,
      `Voltage V: ${fmt(result.V)} V`,
      `Current I: ${fmt(result.I)} A`,
      `Resistance R: ${fmt(result.R)} ohm`,
      `Power P: ${fmt(result.P)} W`,
      `Conductance G: ${fmt(result.conductance, 5)} S`,
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
    if (!result.valid) return;
    const lines = [
      'Quantity,Value,Unit',
      `Voltage V,${result.V.toFixed(6)},V`,
      `Current I,${result.I.toFixed(6)},A`,
      `Resistance R,${result.R.toFixed(6)},ohm`,
      `Power P,${result.P.toFixed(6)},W`,
      `Conductance G,${result.conductance.toFixed(6)},S`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ohms_law_results.csv';
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-yellow-500 hover:text-yellow-700 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Known Pair Inputs</h2>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Known Pair Selection
            </label>
            <select
              data-testid="select-pair"
              value={pair}
              onChange={(e) => setPair(e.target.value as KnownPair)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {PAIR_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              {pairMeta.firstLabel}
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-val1"
              value={val1Str}
              onChange={(e) => setVal1Str(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider block mb-2">
              {pairMeta.secondLabel}
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-val2"
              value={val2Str}
              onChange={(e) => setVal2Str(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800"
            />
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
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
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Solved Circuit Quantities</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
                  <div className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-1">Voltage V</div>
                  <div className="text-2xl font-black text-yellow-800">
                    <span data-testid="out-voltage">{fmt(result.V)}</span>
                    <span className="text-base text-yellow-600"> V</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Current I</div>
                  <div className="text-2xl font-black text-blue-800">
                    <span data-testid="out-current">{fmt(result.I)}</span>
                    <span className="text-base text-blue-500"> A</span>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Resistance R</div>
                  <div className="text-2xl font-black text-orange-800">
                    <span data-testid="out-resistance">{fmt(result.R)}</span>
                    <span className="text-base text-orange-500"> ohm</span>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                  <div className="text-xs font-black text-rose-600 uppercase tracking-wider mb-1">Power P</div>
                  <div className="text-2xl font-black text-rose-800">
                    <span data-testid="out-power">{fmt(result.P)}</span>
                    <span className="text-base text-rose-500"> W</span>
                  </div>
                </div>
                <div className="sm:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Electrical Conductance G = 1 / R
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    <span data-testid="out-conductance">{fmt(result.conductance, 5)}</span> S
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  DC / purely resistive linear relation: V = I * R and P = V * I = I^2 * R = V^2 / R. Select any two known positive quantities to eliminate multi-field conflicts.
                </span>
              </div>
              <div>
                <a
                  href="https://en.wikipedia.org/wiki/Ohm%27s_law"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Ohm&apos;s Law Reference (Wikipedia) <ExternalLink className="w-3 h-3" />
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
