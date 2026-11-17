'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { ArrowLeftRight, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Exact NIST SP 811 / SI & Avoirdupois conversion factors relative to 1 kg/m3
const LB_TO_KG = 0.45359237;
const FT_TO_M = 0.3048;
const IN_TO_M = 0.0254;
const US_GAL_TO_M3 = 231 * Math.pow(IN_TO_M, 3);

type DensityUnitId = 'g/cm3' | 'kg/m3' | 'kg/L' | 'mg/cm3' | 'lb/ft3' | 'lb/in3' | 'lb/gal_us';

const DENSITY_UNITS: { id: DensityUnitId; label: string; toKgM3: number }[] = [
  { id: 'g/cm3', label: 'g/cm³ (grams per cubic cm)', toKgM3: 1000 },
  { id: 'kg/m3', label: 'kg/m³ (SI base)', toKgM3: 1 },
  { id: 'kg/L', label: 'kg/L (kilograms per liter)', toKgM3: 1000 },
  { id: 'mg/cm3', label: 'mg/cm³', toKgM3: 1 },
  { id: 'lb/ft3', label: 'lb/ft³ (pounds per cubic ft)', toKgM3: LB_TO_KG / Math.pow(FT_TO_M, 3) },
  { id: 'lb/in3', label: 'lb/in³ (pounds per cubic in)', toKgM3: LB_TO_KG / Math.pow(IN_TO_M, 3) },
  { id: 'lb/gal_us', label: 'lb/gal (US liquid gallon)', toKgM3: LB_TO_KG / US_GAL_TO_M3 },
];

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function formatSmart(val: number): string {
  if (!Number.isFinite(val)) return '—';
  if (val === 0) return '0';
  if (Math.abs(val) >= 1000) return val.toFixed(2);
  if (Math.abs(val) >= 1) return val.toFixed(4);
  return val.toFixed(6);
}

export default function DensityUnitConverterClient() {
  const [valueStr, setValueStr] = useState('7.85');
  const [fromUnit, setFromUnit] = useState<DensityUnitId>('g/cm3');
  const [toUnit, setToUnit] = useState<DensityUnitId>('kg/m3');
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setCopied(false);
  };

  const handleReset = () => {
    setValueStr('7.85');
    setFromUnit('g/cm3');
    setToUnit('kg/m3');
    setCopied(false);
  };

  const result = useMemo(() => {
    const val = parseNonNegative(valueStr);
    if (!Number.isFinite(val)) {
      return { valid: false as const };
    }
    const fromDef = DENSITY_UNITS.find((u) => u.id === fromUnit) ?? DENSITY_UNITS[0];
    const toDef = DENSITY_UNITS.find((u) => u.id === toUnit) ?? DENSITY_UNITS[1];
    const baseKgM3 = val * fromDef.toKgM3;
    const converted = baseKgM3 / toDef.toKgM3;

    const matrix = DENSITY_UNITS.map((u) => ({
      ...u,
      value: baseKgM3 / u.toKgM3,
    }));

    return {
      valid: true as const,
      inputVal: val,
      baseKgM3,
      converted,
      matrix,
    };
  }, [valueStr, fromUnit, toUnit]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `${result.inputVal} ${fromUnit} = ${formatSmart(result.converted)} ${toUnit} (${result.baseKgM3.toFixed(4)} kg/m3)`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
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
      ['unit_id', 'label', 'value'],
      ...result.matrix.map((m) => [
        m.id,
        m.label.replace(/³/g, '3').replace(/,/g, '').replace(/[^\x20-\x7E]/g, ''),
        m.value.toFixed(6),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'density_conversion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Engineering Mass Density Converter</h2>
            <p className="text-sm font-medium text-slate-500">
              Exact NIST SP 811 SI &amp; Avoirdupois density unit conversions
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor="dens-val" className="block text-sm font-black text-slate-700 mb-1.5">
              Density Value (≥ 0)
            </label>
            <input
              id="dens-val"
              data-testid="input-value"
              type="text"
              inputMode="decimal"
              value={valueStr}
              onChange={(e) => setValueStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="dens-from" className="block text-sm font-black text-slate-700 mb-1.5">From Unit</label>
              <select
                id="dens-from"
                data-testid="select-from"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as DensityUnitId)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              >
                {DENSITY_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                data-testid="swap-button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-black cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Swap Units
              </button>
            </div>

            <div>
              <label htmlFor="dens-to" className="block text-sm font-black text-slate-700 mb-1.5">To Unit</label>
              <select
                id="dens-to"
                data-testid="select-to"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as DensityUnitId)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
              >
                {DENSITY_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Enter a valid non-negative numeric density value.</span>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="text-xs font-black text-purple-800 uppercase tracking-wider mb-1">
                Converted Density ({toUnit})
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-converted" className="text-4xl font-black text-slate-900 font-mono">
                  {result.valid ? formatSmart(result.converted) : '—'}
                </span>
                <span className="text-lg font-bold text-purple-700">{toUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DENSITY_UNITS.map((u) => {
                const entry = result.valid ? result.matrix.find((m) => m.id === u.id) : undefined;
                return (
                  <div key={u.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-500">{u.id}</span>
                    <span data-testid={`matrix-${u.id}`} className="text-base font-black text-slate-900 font-mono">
                      {entry ? formatSmart(entry.value) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Exact Definition Constants:</strong>{' '}
                <code>1 g/cm³ = 1,000 kg/m³ = 1 kg/L</code>, with exact international foot (<code>0.3048 m</code>), inch (<code>0.0254 m</code>), and pound-mass (<code>0.45359237 kg</code>), giving <code>1 g/cm³ ≈ 62.427961 lb/ft³ ≈ 0.036127292 lb/in³</code>.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
