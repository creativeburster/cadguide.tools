'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ArrowLeftRight, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Exact conversion factors to Newton (N):
// g_n = 9.80665 m/s^2 exact, 1 lb = 0.45359237 kg => 1 lbf = 4.4482216152605 N exact
const GN = 9.80665;
const LBF_N = 0.45359237 * GN;

type ForceUnitId = 'n' | 'kn' | 'mn' | 'mn_milli' | 'dyn' | 'kgf' | 'tf' | 'lbf' | 'kip' | 'ozf';

const FORCE_UNITS: { id: ForceUnitId; label: string; symbol: string; toN: number }[] = [
  { id: 'n', label: 'Newton (N)', symbol: 'N', toN: 1 },
  { id: 'kn', label: 'Kilonewton (kN)', symbol: 'kN', toN: 1000 },
  { id: 'mn', label: 'Meganewton (MN)', symbol: 'MN', toN: 1e6 },
  { id: 'mn_milli', label: 'Millinewton (mN)', symbol: 'mN', toN: 0.001 },
  { id: 'dyn', label: 'Dyne (dyn)', symbol: 'dyn', toN: 1e-5 },
  { id: 'kgf', label: 'Kilogram-force (kgf)', symbol: 'kgf', toN: GN },
  { id: 'tf', label: 'Metric tonne-force (tf)', symbol: 'tf', toN: 1000 * GN },
  { id: 'lbf', label: 'Pound-force (lbf)', symbol: 'lbf', toN: LBF_N },
  { id: 'kip', label: 'Kip-force (1000 lbf)', symbol: 'kip', toN: 1000 * LBF_N },
  { id: 'ozf', label: 'Ounce-force (ozf)', symbol: 'ozf', toN: LBF_N / 16 },
];

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9 || abs < 1e-5) return n.toExponential(4);
  if (abs >= 1000) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(4);
  return n.toFixed(6);
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function ForceUnitConverterClient() {
  const [valStr, setValStr] = useState('1000');
  const [fromUnit, setFromUnit] = useState<ForceUnitId>('n');
  const [toUnit, setToUnit] = useState<ForceUnitId>('lbf');
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setCopied(false);
  };

  const handleReset = () => {
    setValStr('1000');
    setFromUnit('n');
    setToUnit('lbf');
    setCopied(false);
  };

  const result = useMemo(() => {
    const val = parseStrictFinite(valStr);
    const fromDef = FORCE_UNITS.find((u) => u.id === fromUnit);
    const toDef = FORCE_UNITS.find((u) => u.id === toUnit);
    if (!Number.isFinite(val) || !fromDef || !toDef) {
      return { valid: false as const };
    }
    const baseN = val * fromDef.toN;
    const converted = baseN / toDef.toN;
    const matrix = FORCE_UNITS.map((u) => ({
      ...u,
      converted: baseN / u.toN,
    }));
    return {
      valid: true as const,
      inputVal: val,
      fromDef,
      toDef,
      baseN,
      converted,
      matrix,
    };
  }, [valStr, fromUnit, toUnit]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = `${result.inputVal} ${result.fromDef.symbol} = ${formatNum(result.converted)} ${result.toDef.symbol}`;
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
      ['Field', 'Value', 'Unit'],
      ['Input Force', String(result.inputVal), result.fromDef.symbol],
      ['Target Force', formatNum(result.converted), result.toDef.symbol],
      ['SI Base Equivalent', formatNum(result.baseN), 'N'],
      ...result.matrix.map((m) => [m.label, formatNum(m.converted), m.symbol]),
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'force-unit-conversion.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="input-value" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Force Value
            </label>
            <input
              id="input-value"
              data-testid="input-value"
              type="text"
              value={valStr}
              onChange={(e) => setValStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="select-from" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              From Unit
            </label>
            <select
              id="select-from"
              data-testid="select-from"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as ForceUnitId)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            >
              {FORCE_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              data-testid="btn-swap"
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap Units
            </button>
          </div>

          <div>
            <label htmlFor="select-to" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              To Unit
            </label>
            <select
              id="select-to"
              data-testid="select-to"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as ForceUnitId)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            >
              {FORCE_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Results</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="error-banner" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Enter a valid finite number for force.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                  Converted Force ({FORCE_UNITS.find((u) => u.id === toUnit)?.symbol})
                </div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-converted">
                    {result.valid ? formatNum(result.converted) : '—'}
                  </span>{' '}
                  <span className="text-base font-bold text-purple-500">
                    {FORCE_UNITS.find((u) => u.id === toUnit)?.symbol}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  SI Base Equivalent (N)
                </div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-n">{result.valid ? formatNum(result.baseN) : '—'}</span>{' '}
                  <span className="text-base font-bold text-slate-500">N</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Exact definitions: g_n = 9.80665 m/s2 (1 kgf = 9.80665 N); 1 lb = 0.45359237 kg (1 lbf = 4.4482216152605 N).
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Unit</th>
                    <th className="px-4 py-2.5 text-right">Equivalent Force</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FORCE_UNITS.map((u) => {
                    const row = result.valid ? result.matrix.find((m) => m.id === u.id) : null;
                    return (
                      <tr key={u.id}>
                        <td className="px-4 py-2 font-semibold text-slate-700">{u.label}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          <span data-testid={`matrix-${u.id}`}>{row ? formatNum(row.converted) : '—'}</span>{' '}
                          <span className="text-slate-400">{u.symbol}</span>
                        </td>
                      </tr>
                    );
                  })}
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
