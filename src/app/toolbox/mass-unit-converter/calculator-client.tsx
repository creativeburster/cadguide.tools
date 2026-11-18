'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { ArrowLeftRight, Scale, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

interface MassUnitDef {
  id: string;
  label: string;
  toKg: number;
}

const MASS_UNITS: MassUnitDef[] = [
  { id: 'mg', label: 'Milligrams (mg)', toKg: 1e-6 },
  { id: 'g', label: 'Grams (g)', toKg: 0.001 },
  { id: 'kg', label: 'Kilograms (kg)', toKg: 1 },
  { id: 't', label: 'Metric Tonnes (t)', toKg: 1000 },
  { id: 'oz', label: 'Ounces avdp (oz)', toKg: 0.028349523125 },
  { id: 'lb', label: 'Pounds avdp (lb)', toKg: 0.45359237 },
  { id: 'short_ton', label: 'US Short Tons (2000 lb)', toKg: 907.18474 },
  { id: 'long_ton', label: 'UK Long Tons (2240 lb)', toKg: 1016.0469088 },
];

const NONNEG_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseNonNeg(raw: string): number | null {
  const t = raw.trim();
  if (!NONNEG_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

function fmtMass(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const a = Math.abs(n);
  if (a >= 1e9 || a < 1e-5) return n.toExponential(6);
  if (a >= 100) return n.toFixed(4);
  if (a >= 1) return n.toFixed(6);
  return n.toPrecision(6);
}

export default function MassUnitConverterClient() {
  const [valStr, setValStr] = useState('100');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lb');
  const [copied, setCopied] = useState(false);

  const val = parseNonNeg(valStr);
  const fromDef = MASS_UNITS.find(u => u.id === fromUnit) ?? MASS_UNITS[2];
  const toDef = MASS_UNITS.find(u => u.id === toUnit) ?? MASS_UNITS[5];
  const isValid = val !== null;

  const kgVal = val !== null ? val * fromDef.toKg : null;
  const converted = kgVal !== null ? kgVal / toDef.toKg : null;

  const applyPreset = (v: string, f: string, t: string) => {
    setValStr(v);
    setFromUnit(f);
    setToUnit(t);
  };

  const handleReset = () => applyPreset('100', 'kg', 'lb');

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = async () => {
    if (!isValid || converted === null) return;
    const text = `${valStr.trim()} ${fromUnit} = ${fmtMass(converted)} ${toUnit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || kgVal === null) return;
    const rows = [
      ['unit_id', 'unit_label', 'converted_value'],
      ...MASS_UNITS.map(u => [u.id, u.label, (kgVal / u.toKg).toPrecision(10)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mass-conversion-${fromUnit}-to-${toUnit}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Mass Conversion</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-100kg-lb"
                onClick={() => applyPreset('100', 'kg', 'lb')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                100 kg to Pounds (lb)
              </button>
              <button
                type="button"
                data-testid="preset-1t-short"
                onClick={() => applyPreset('1', 't', 'short_ton')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                1 Metric Tonne to US Short Tons
              </button>
              <button
                type="button"
                data-testid="preset-1lb-g"
                onClick={() => applyPreset('1', 'lb', 'g')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-200"
              >
                Exact International Pound (1 lb in g)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Mass Value (&ge; 0)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-value"
              value={valStr}
              onChange={e => setValStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">From Unit</label>
            <select
              data-testid="select-from"
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
            >
              {MASS_UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            data-testid="btn-swap"
            onClick={handleSwap}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Units
          </button>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">To Unit</label>
            <select
              data-testid="select-to"
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
            >
              {MASS_UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Enter a non-negative numeric mass value.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center justify-center gap-1.5"
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
              <Download className="w-4 h-4" /> Export All Units CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Converted Mass</div>
              <div className="text-3xl font-black text-purple-900">
                <span data-testid="result-converted">{fmtMass(converted)}</span>{' '}
                <span className="text-lg text-purple-600">{toUnit}</span>
              </div>
              <div className="text-xs text-purple-700 mt-1 font-medium">
                1 lb = 0.45359237 kg | 1 t = 1000 kg | 1 US short ton = 907.18474 kg
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3 text-right">Equivalent Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MASS_UNITS.map(u => (
                    <tr key={u.id} className={u.id === toUnit ? 'bg-purple-50/50 font-bold' : ''}>
                      <td className="px-4 py-2 text-slate-800">{u.label}</td>
                      <td className="px-4 py-2 text-right font-mono" data-testid={`unit-${u.id}`}>
                        {kgVal !== null ? fmtMass(kgVal / u.toKg) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
