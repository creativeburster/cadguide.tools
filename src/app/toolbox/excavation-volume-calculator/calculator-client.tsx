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

const PRESETS = [
  { id: 'default', label: 'Vertical Trench (50 x 1 x 2 m)', l: '50', w: '1', d: '2', slope: '0', swell: '25', cap: '15', cost: '120' },
  { id: 'sloped-pit', label: 'Sloped Pit (0.5H:1V)', l: '50', w: '1', d: '2', slope: '0.5', swell: '25', cap: '15', cost: '120' },
  { id: 'footing-pit', label: 'Foundation Pit (12 x 10 x 3.5 m, 1:1)', l: '12', w: '10', d: '3.5', slope: '1', swell: '30', cap: '18', cost: '140' },
];

export default function ExcavationVolumeCalculatorClient() {
  const [lStr, setLStr] = useState('50');
  const [wStr, setWStr] = useState('1');
  const [dStr, setDStr] = useState('2');
  const [slopeStr, setSlopeStr] = useState('0');
  const [swellStr, setSwellStr] = useState('25');
  const [capStr, setCapStr] = useState('15');
  const [costStr, setCostStr] = useState('120');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setLStr(p.l);
    setWStr(p.w);
    setDStr(p.d);
    setSlopeStr(p.slope);
    setSwellStr(p.swell);
    setCapStr(p.cap);
    setCostStr(p.cost);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const L = parseStrictPositive(lStr);
    const W = parseStrictPositive(wStr);
    const D = parseStrictPositive(dStr);
    const slope = parseStrictNonNegative(slopeStr);
    const swell = parseStrictNonNegative(swellStr);
    const cap = parseStrictPositive(capStr);
    const costPerLoad = parseStrictNonNegative(costStr);

    if (
      !Number.isFinite(L) ||
      !Number.isFinite(W) ||
      !Number.isFinite(D) ||
      !Number.isFinite(slope) ||
      !Number.isFinite(swell) ||
      !Number.isFinite(cap) ||
      !Number.isFinite(costPerLoad)
    ) {
      return { valid: false as const };
    }

    const baseArea = L * W;
    const topL = L + 2 * slope * D;
    const topW = W + 2 * slope * D;
    const topArea = topL * topW;
    const midArea = (L + slope * D) * (W + slope * D);
    const bankVolume = (D / 6) * (baseArea + topArea + 4 * midArea);
    const looseVolume = bankVolume * (1 + swell / 100);
    const loads = Math.ceil(looseVolume / cap);
    const totalCost = loads * costPerLoad;

    return {
      valid: true as const,
      L,
      W,
      D,
      slope,
      swell,
      cap,
      costPerLoad,
      topL,
      topW,
      bankVolume,
      looseVolume,
      loads,
      totalCost,
    };
  }, [lStr, wStr, dStr, slopeStr, swellStr, capStr, costStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Excavation Prismoidal & Haulage Estimate`,
      `Base: ${result.L} x ${result.W} m, Depth: ${result.D} m, Side Slope: ${result.slope}H:1V`,
      `Bank Volume: ${result.bankVolume.toFixed(2)} m3`,
      `Loose Volume (+${result.swell}% swell): ${result.looseVolume.toFixed(2)} m3`,
      `Truck Loads (${result.cap} m3/load): ${result.loads}`,
      `Total Haul Cost: $${result.totalCost.toFixed(2)}`,
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
      ['Bottom Length', String(result.L), 'm'],
      ['Bottom Width', String(result.W), 'm'],
      ['Depth', String(result.D), 'm'],
      ['Side Slope (H:1V)', String(result.slope), '-'],
      ['Top Opening Length', result.topL.toFixed(2), 'm'],
      ['Top Opening Width', result.topW.toFixed(2), 'm'],
      ['Soil Swell Factor', String(result.swell), '%'],
      ['Truck Loose Capacity', String(result.cap), 'm3'],
      ['Bank Excavation Volume', result.bankVolume.toFixed(2), 'm3'],
      ['Loose Haul Volume', result.looseVolume.toFixed(2), 'm3'],
      ['Required Truck Loads', String(result.loads), 'loads'],
      ['Estimated Total Cost', result.totalCost.toFixed(2), 'USD'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'excavation-volume-estimate.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
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
          <span>Enter positive dimensions and truck capacity (&gt; 0), and non-negative slope, swell, and unit cost.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'length', label: 'Bottom Length L (m)', val: lStr, set: setLStr },
            { id: 'width', label: 'Bottom Width W (m)', val: wStr, set: setWStr },
            { id: 'depth', label: 'Excavation Depth D (m)', val: dStr, set: setDStr },
            { id: 'slope', label: 'Side Slope Ratio (H:1V)', val: slopeStr, set: setSlopeStr },
            { id: 'swell', label: 'Soil Swell / Bulking (%)', val: swellStr, set: setSwellStr },
            { id: 'capacity', label: 'Truck Loose Capacity (m3)', val: capStr, set: setCapStr },
            { id: 'cost', label: 'Haul Cost per Load (USD)', val: costStr, set: setCostStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Bank Volume (In-Situ)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-bank-volume">
                    {result.valid ? result.bankVolume.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-base text-blue-500">m3</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Loose Volume (Bulked)</div>
                <div className="text-3xl font-black text-amber-900">
                  <span data-testid="result-loose-volume">
                    {result.valid ? result.looseVolume.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-base text-amber-600">m3</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Truck Loads</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-loads">{result.valid ? String(result.loads) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">loads</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Total Haul Cost</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-cost">{result.valid ? result.totalCost.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">USD</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Prismoidal volume V_bank = (D/6)*(A_bottom + A_top + 4*A_mid), V_loose = V_bank*(1 + swell/100), loads = ceil(V_loose / capacity). Typical soil swell factors are illustrative; confirm geotechnical shoring and slope angles locally.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
