'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const STANDARD_GPM_TIERS = [4, 7, 10, 15, 20, 25, 35, 50, 75, 100];
const GAL_TO_LITER = 3.785411784;

function selectStandardFlowTier(calcGpm: number): number {
  for (const tier of STANDARD_GPM_TIERS) {
    if (calcGpm <= tier) return tier;
  }
  return Math.ceil(calcGpm / 25) * 25;
}

export default function GreaseTrapSizingCalculatorClient() {
  const [compStr, setCompStr] = useState('3');
  const [lenStr, setLenStr] = useState('18');
  const [widStr, setWidStr] = useState('18');
  const [depStr, setDepStr] = useState('12');
  const [fillStr, setFillStr] = useState('0.75');
  const [drainStr, setDrainStr] = useState('1.0');
  const [extraGpmStr, setExtraGpmStr] = useState('0');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setCompStr('3');
    setLenStr('18');
    setWidStr('18');
    setDepStr('12');
    setFillStr('0.75');
    setDrainStr('1.0');
    setExtraGpmStr('0');
    setCopied(false);
  };

  const result = useMemo(() => {
    const comp = parseStrictPositive(compStr);
    const len = parseStrictPositive(lenStr);
    const wid = parseStrictPositive(widStr);
    const dep = parseStrictPositive(depStr);
    const fill = parseStrictPositive(fillStr);
    const drain = parseStrictPositive(drainStr);
    const extraGpm = parseStrictNonNegative(extraGpmStr);

    if (
      !Number.isFinite(comp) ||
      !Number.isFinite(len) ||
      !Number.isFinite(wid) ||
      !Number.isFinite(dep) ||
      !Number.isFinite(fill) ||
      !Number.isFinite(drain) ||
      !Number.isFinite(extraGpm) ||
      fill > 1
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive compartment count, dimensions (in), drain period (min), non-negative extra flow, and 0 < fill factor <= 1.',
      };
    }

    const totalVolIn3 = comp * len * wid * dep;
    const totalVolGal = totalVolIn3 / 231;
    const effectiveLoadGal = totalVolGal * fill;
    const effectiveLoadLiters = effectiveLoadGal * GAL_TO_LITER;
    const calcFlowGpm = effectiveLoadGal / drain + extraGpm;
    const ratedFlowGpm = selectStandardFlowTier(calcFlowGpm);
    const minGreaseLbs = ratedFlowGpm * 2;

    return {
      valid: true as const,
      comp,
      len,
      wid,
      dep,
      fill,
      drain,
      extraGpm,
      totalVolGal,
      effectiveLoadGal,
      effectiveLoadLiters,
      calcFlowGpm,
      ratedFlowGpm,
      minGreaseLbs,
    };
  }, [compStr, lenStr, widStr, depStr, fillStr, drainStr, extraGpmStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Volumetric Grease Interceptor Sizing Summary`,
      `Sink: ${result.comp} x ${result.len}x${result.wid}x${result.dep} in, Fill=${result.fill}, Drain=${result.drain} min, Extra=${result.extraGpm} GPM`,
      `Geometric Sink Volume = ${result.totalVolGal.toFixed(2)} gal`,
      `Effective Drain Load = ${result.effectiveLoadGal.toFixed(2)} gal (${result.effectiveLoadLiters.toFixed(2)} L)`,
      `Peak Discharge Flow Rate = ${result.calcFlowGpm.toFixed(2)} GPM`,
      `Recommended Commercial Rating = ${result.ratedFlowGpm} GPM (Min Grease Capacity = ${result.minGreaseLbs} lbs)`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Sink Compartments', String(result.comp), 'ea'],
      ['Bowl Length', String(result.len), 'in'],
      ['Bowl Width', String(result.wid), 'in'],
      ['Bowl Depth', String(result.dep), 'in'],
      ['Fill Factor', String(result.fill), '-'],
      ['Drain Period', String(result.drain), 'min'],
      ['Additional Fixture Flow', String(result.extraGpm), 'GPM'],
      ['Total Geometric Volume', result.totalVolGal.toFixed(2), 'gal'],
      ['Effective Liquid Load', result.effectiveLoadGal.toFixed(2), 'gal'],
      ['Effective Metric Volume', result.effectiveLoadLiters.toFixed(2), 'L'],
      ['Calculated Peak Discharge Flow', result.calcFlowGpm.toFixed(2), 'GPM'],
      ['Recommended Commercial Rating', String(result.ratedFlowGpm), 'GPM'],
      ['Minimum Grease Holding Capacity (2 lb/GPM)', String(result.minGreaseLbs), 'lbs'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grease-interceptor-volumetric-sizing.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          data-testid="btn-drain-1min"
          onClick={() => setDrainStr('1.0')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            drainStr === '1.0' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          1.0 min Drain Period (Strict)
        </button>
        <button
          type="button"
          data-testid="btn-drain-2min"
          onClick={() => setDrainStr('2.0')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
            drainStr === '2.0' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          2.0 min Drain Period (Standard)
        </button>
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Fixture Volume Inputs</h2>
          </div>

          {[
            { id: 'compartments', label: 'Sink Compartments N', val: compStr, set: setCompStr },
            { id: 'len', label: 'Compartment Length L (in)', val: lenStr, set: setLenStr },
            { id: 'wid', label: 'Compartment Width W (in)', val: widStr, set: setWidStr },
            { id: 'dep', label: 'Compartment Depth D (in)', val: depStr, set: setDepStr },
            { id: 'fill', label: 'Fill Factor (typ. 0.75)', val: fillStr, set: setFillStr },
            { id: 'drain', label: 'Drain-Down Time (min)', val: drainStr, set: setDrainStr },
            { id: 'extra', label: 'Additional Fixture Flow (GPM)', val: extraGpmStr, set: setExtraGpmStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                inputMode="decimal"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Interceptor Capacity &amp; Flow Tier</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Recommended Flow Tier</div>
                <div className="text-2xl font-black text-orange-950">
                  <span data-testid="result-rated">{result.valid ? result.ratedFlowGpm : '—'}</span>{' '}
                  <span className="text-sm text-orange-600">GPM</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Min Grease Storage</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-grease">{result.valid ? result.minGreaseLbs : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">lbs</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Calculated Discharge</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-qcalc">{result.valid ? result.calcFlowGpm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">GPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Geometric Sink Volume</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-vgal">{result.valid ? result.totalVolGal.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">gal</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Effective Drain Load</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-vload">{result.valid ? result.effectiveLoadGal.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">gal</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Effective Metric Volume</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-vliters">{result.valid ? result.effectiveLoadLiters.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">L</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Volumetric sink drain-down sizing: V_gal = (N*L*W*D)/231 (1 US gal = 231 in3 exact), V_load = V_gal * fillFactor, Q_calc = V_load / t_drain + Q_extra. Standard commercial interceptor flow tiers tested: 4, 7, 10, 15, 20, 25, 35, 50, 75, 100 GPM (with 2 lb/GPM minimum grease holding ratio). Always confirm drain-down period and local plumbing authority rules before equipment procurement.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
