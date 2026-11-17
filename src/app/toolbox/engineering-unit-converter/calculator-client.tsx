'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, ArrowLeftRight, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type Category = 'length' | 'mass' | 'force' | 'pressure' | 'energy' | 'power' | 'temperature' | 'velocity' | 'area';

// Exact physical/SI definitions: 1 ft = 0.3048 m, 1 in = 0.0254 m, 1 lb = 0.45359237 kg, g_n = 9.80665 m/s^2
const LB_KG = 0.45359237;
const GN = 9.80665;
const LBF_N = LB_KG * GN; // 4.4482216152605 N exact
const IN_M = 0.0254;
const FT_M = 0.3048;
const IN2_M2 = IN_M * IN_M; // 0.00064516 m2 exact
const FT2_M2 = FT_M * FT_M; // 0.09290304 m2 exact
const PSI_PA = LBF_N / IN2_M2;
const BTU_J = 1055.05585262; // International Table BTU

const CATEGORIES: { id: Category; name: string }[] = [
  { id: 'length', name: 'Length' },
  { id: 'mass', name: 'Mass' },
  { id: 'force', name: 'Force' },
  { id: 'pressure', name: 'Pressure' },
  { id: 'energy', name: 'Energy' },
  { id: 'power', name: 'Power' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'velocity', name: 'Velocity' },
  { id: 'area', name: 'Area' },
];

const UNITS: Record<Category, { id: string; name: string; factor: number }[]> = {
  length: [
    { id: 'mm', name: 'mm', factor: 0.001 },
    { id: 'cm', name: 'cm', factor: 0.01 },
    { id: 'm', name: 'm', factor: 1 },
    { id: 'km', name: 'km', factor: 1000 },
    { id: 'in', name: 'in', factor: IN_M },
    { id: 'ft', name: 'ft', factor: FT_M },
    { id: 'yd', name: 'yd', factor: 0.9144 },
    { id: 'mile', name: 'mile', factor: 1609.344 },
  ],
  mass: [
    { id: 'mg', name: 'mg', factor: 1e-6 },
    { id: 'g', name: 'g', factor: 1e-3 },
    { id: 'kg', name: 'kg', factor: 1 },
    { id: 't', name: 't (metric)', factor: 1000 },
    { id: 'oz', name: 'oz (avdp)', factor: LB_KG / 16 },
    { id: 'lb', name: 'lb (avdp)', factor: LB_KG },
    { id: 'ton_us', name: 'ton (US short)', factor: 2000 * LB_KG },
  ],
  force: [
    { id: 'n', name: 'N', factor: 1 },
    { id: 'kn', name: 'kN', factor: 1000 },
    { id: 'mn', name: 'MN', factor: 1e6 },
    { id: 'kgf', name: 'kgf', factor: GN },
    { id: 'lbf', name: 'lbf', factor: LBF_N },
    { id: 'kip', name: 'kip', factor: 1000 * LBF_N },
    { id: 'dyne', name: 'dyne', factor: 1e-5 },
  ],
  pressure: [
    { id: 'pa', name: 'Pa', factor: 1 },
    { id: 'kpa', name: 'kPa', factor: 1000 },
    { id: 'mpa', name: 'MPa', factor: 1e6 },
    { id: 'bar', name: 'bar', factor: 100000 },
    { id: 'psi', name: 'psi', factor: PSI_PA },
    { id: 'ksi', name: 'ksi', factor: 1000 * PSI_PA },
    { id: 'atm', name: 'atm', factor: 101325 },
    { id: 'mmhg', name: 'mmHg (0 C)', factor: 101325 / 760 },
  ],
  energy: [
    { id: 'j', name: 'J', factor: 1 },
    { id: 'kj', name: 'kJ', factor: 1000 },
    { id: 'mj', name: 'MJ', factor: 1e6 },
    { id: 'cal', name: 'cal (th)', factor: 4.184 },
    { id: 'kcal', name: 'kcal (th)', factor: 4184 },
    { id: 'wh', name: 'Wh', factor: 3600 },
    { id: 'kwh', name: 'kWh', factor: 3.6e6 },
    { id: 'btu', name: 'BTU (IT)', factor: BTU_J },
    { id: 'ftlb', name: 'ft-lbf', factor: FT_M * LBF_N },
  ],
  power: [
    { id: 'w', name: 'W', factor: 1 },
    { id: 'kw', name: 'kW', factor: 1000 },
    { id: 'mw', name: 'MW', factor: 1e6 },
    { id: 'hp', name: 'hp (550 ft-lbf/s)', factor: 550 * FT_M * LBF_N },
    { id: 'btuh', name: 'BTU/h', factor: BTU_J / 3600 },
    { id: 'ftlbs', name: 'ft-lbf/s', factor: FT_M * LBF_N },
  ],
  temperature: [
    { id: 'degC', name: 'deg C', factor: 1 },
    { id: 'degF', name: 'deg F', factor: 1 },
    { id: 'K', name: 'K', factor: 1 },
  ],
  velocity: [
    { id: 'ms', name: 'm/s', factor: 1 },
    { id: 'kmh', name: 'km/h', factor: 1000 / 3600 },
    { id: 'mph', name: 'mph', factor: 0.44704 },
    { id: 'fts', name: 'ft/s', factor: FT_M },
    { id: 'knot', name: 'knot', factor: 1852 / 3600 },
  ],
  area: [
    { id: 'mm2', name: 'mm2', factor: 1e-6 },
    { id: 'cm2', name: 'cm2', factor: 1e-4 },
    { id: 'm2', name: 'm2', factor: 1 },
    { id: 'ha', name: 'ha', factor: 10000 },
    { id: 'km2', name: 'km2', factor: 1e6 },
    { id: 'in2', name: 'in2', factor: IN2_M2 },
    { id: 'ft2', name: 'ft2', factor: FT2_M2 },
    { id: 'acre', name: 'acre', factor: 4046.8564224 },
  ],
};

function convertTemp(value: number, fromId: string, toId: string): { value: number; validKelvin: boolean } {
  let celsius = value;
  if (fromId === 'degF') celsius = ((value - 32) * 5) / 9;
  else if (fromId === 'K') celsius = value - 273.15;

  const kelvin = celsius + 273.15;
  if (!Number.isFinite(kelvin) || kelvin < 0) {
    return { value: Number.NaN, validKelvin: false };
  }
  if (toId === 'degC') return { value: celsius, validKelvin: true };
  if (toId === 'degF') return { value: (celsius * 9) / 5 + 32, validKelvin: true };
  return { value: kelvin, validKelvin: true };
}

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

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnitId, setFromUnitId] = useState('mm');
  const [toUnitId, setToUnitId] = useState('ft');
  const [valStr, setValStr] = useState('1000');
  const [copied, setCopied] = useState(false);

  const selectCategory = (cat: Category) => {
    setCategory(cat);
    const list = UNITS[cat];
    setFromUnitId(list[0].id);
    setToUnitId(list[Math.min(2, list.length - 1)].id);
    setValStr(cat === 'temperature' ? '25' : cat === 'length' ? '1000' : '100');
    setCopied(false);
  };

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    setCopied(false);
  };

  const handleReset = () => {
    setCategory('length');
    setFromUnitId('mm');
    setToUnitId('ft');
    setValStr('1000');
    setCopied(false);
  };

  const units = UNITS[category];

  const result = useMemo(() => {
    const val = parseStrictFinite(valStr);
    const fromDef = units.find((u) => u.id === fromUnitId) ?? units[0];
    const toDef = units.find((u) => u.id === toUnitId) ?? units[Math.min(1, units.length - 1)];

    if (!Number.isFinite(val)) {
      return { valid: false as const, errorMsg: 'Enter a valid finite numeric input.' };
    }

    if (category === 'temperature') {
      const conv = convertTemp(val, fromDef.id, toDef.id);
      if (!conv.validKelvin) {
        return { valid: false as const, errorMsg: 'Temperature cannot be below absolute zero (0 K / -273.15 deg C).' };
      }
      const matrix = units.map((u) => ({
        ...u,
        converted: convertTemp(val, fromDef.id, u.id).value,
      }));
      return {
        valid: true as const,
        inputVal: val,
        fromDef,
        toDef,
        converted: conv.value,
        matrix,
      };
    }

    const baseVal = val * fromDef.factor;
    const converted = baseVal / toDef.factor;
    const matrix = units.map((u) => ({
      ...u,
      converted: baseVal / u.factor,
    }));

    return {
      valid: true as const,
      inputVal: val,
      fromDef,
      toDef,
      converted,
      matrix,
    };
  }, [category, units, fromUnitId, toUnitId, valStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = `[${category.toUpperCase()}] ${result.inputVal} ${result.fromDef.name} = ${formatNum(result.converted)} ${result.toDef.name}`;
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
      ['Category', category, '-'],
      ['Input', String(result.inputVal), result.fromDef.name],
      ['Target', formatNum(result.converted), result.toDef.name],
      ...result.matrix.map((m) => ['Equivalent', formatNum(m.converted), m.name]),
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engineering-unit-conversion.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            data-testid={`cat-${c.id}`}
            onClick={() => selectCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
              category === c.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {c.name}
          </button>
        ))}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Convert ({category})</h2>
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
              From Value & Unit
            </label>
            <div className="flex gap-3">
              <input
                id="input-value"
                data-testid="input-value"
                type="text"
                value={valStr}
                onChange={(e) => setValStr(e.target.value)}
                className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-900"
              />
              <select
                data-testid="select-from"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-40 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              data-testid="btn-swap"
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap Units
            </button>
          </div>

          <div>
            <label htmlFor="select-to" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Target Unit
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 h-12 px-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center text-lg font-black text-blue-900">
                <span data-testid="result-converted">
                  {result.valid ? formatNum(result.converted) : '—'}
                </span>
              </div>
              <select
                id="select-to"
                data-testid="select-to"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-40 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="btn-copy"
              disabled={!result.valid}
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              disabled={!result.valid}
              onClick={handleDownloadCsv}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Category Equivalents</h2>
          <div className="space-y-2">
            {units.map((u) => {
              const row = result.valid ? result.matrix.find((m) => m.id === u.id) : null;
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200"
                >
                  <span className="text-sm font-bold text-slate-700">{u.name}</span>
                  <span data-testid={`matrix-${u.id}`} className="text-sm font-mono font-black text-slate-900">
                    {row ? formatNum(row.converted) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
