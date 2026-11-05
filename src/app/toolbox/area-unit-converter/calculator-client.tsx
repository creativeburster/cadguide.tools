'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, ArrowLeftRight, Download, Table } from 'lucide-react';

interface UnitDef {
  key: string;
  name: string;
  factorToM2: number; // Exact SI / NIST SP 811 definition
  symbol: string;
}

const AREA_UNITS: UnitDef[] = [
  { key: 'm2', name: 'Square Meter', factorToM2: 1, symbol: 'm²' },
  { key: 'mm2', name: 'Square Millimeter', factorToM2: 0.000001, symbol: 'mm²' },
  { key: 'cm2', name: 'Square Centimeter', factorToM2: 0.0001, symbol: 'cm²' },
  { key: 'km2', name: 'Square Kilometer', factorToM2: 1000000, symbol: 'km²' },
  { key: 'in2', name: 'Square Inch', factorToM2: 0.00064516, symbol: 'in²' },
  { key: 'ft2', name: 'Square Foot', factorToM2: 0.09290304, symbol: 'ft²' },
  { key: 'yd2', name: 'Square Yard', factorToM2: 0.83612736, symbol: 'yd²' },
  { key: 'acre', name: 'Acre (International)', factorToM2: 4046.8564224, symbol: 'ac' },
  { key: 'ha', name: 'Hectare', factorToM2: 10000, symbol: 'ha' },
];

const UNIT_MAP: Record<string, UnitDef> = Object.fromEntries(
  AREA_UNITS.map(u => [u.key, u])
);
// Fallback alias for legacy 'hectare' key
UNIT_MAP['hectare'] = UNIT_MAP['ha'];

export default function AreaUnitConverterClient() {
  const [valStr, setValStr] = useState('1');
  const [fromUnit, setFromUnit] = useState('m2');
  const [toUnit, setToUnit] = useState('ft2');

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const results = useMemo(() => {
    const val = parseFloat(valStr);
    if (isNaN(val) || !isFinite(val)) {
      return { outputVal: NaN, m2Val: NaN, table: [] };
    }

    const fromDef = UNIT_MAP[fromUnit.toLowerCase()] || UNIT_MAP['m2'];
    const toDef = UNIT_MAP[toUnit.toLowerCase()] || UNIT_MAP['ft2'];

    // Convert to base unit: square meters (m²)
    const m2Val = val * fromDef.factorToM2;
    // Convert from base unit to target unit
    const outputVal = m2Val / toDef.factorToM2;

    const table = AREA_UNITS.map(u => ({
      key: u.key,
      name: u.name,
      symbol: u.symbol,
      converted: m2Val / u.factorToM2,
    }));

    return { outputVal, m2Val, table, fromDef, toDef };
  }, [valStr, fromUnit, toUnit]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs >= 1000000) return n.toExponential(6);
    if (abs >= 10000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (abs >= 100) return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
    if (abs >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
    if (abs >= 0.0001) return n.toFixed(6);
    return n.toExponential(6);
  };

  const downloadCsv = () => {
    if (isNaN(results.outputVal)) return;
    const rows = [
      ['Area Unit Conversion Matrix Report', ''],
      ['Standards', 'NIST SP 811 / ISO 80000-1 / BIPM SI Brochure (9th Edition)'],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Input Parameter', ''],
      ['Given Value', valStr],
      ['From Unit', `${results.fromDef?.name} (${results.fromDef?.symbol})`],
      ['Target Unit', `${results.toDef?.name} (${results.toDef?.symbol})`],
      ['Converted Output', results.outputVal.toString()],
      ['Equivalent in Square Meters (m²)', results.m2Val.toString()],
      ['', ''],
      ['Full Multi-Unit Equivalent Table', ''],
      ['Unit Name', 'Symbol', 'Converted Equivalent Value']
    ];

    results.table.forEach(row => {
      rows.push([row.name, row.symbol, row.converted.toString()]);
    });

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `area-conversion-${valStr}-${fromUnit}-to-${toUnit}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Convert Area</h2>
              <p className="text-xs text-slate-500 font-medium">BIPM / NIST SP 811 precision metrology</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Area Magnitude
              </label>
              <input
                type="number"
                step="any"
                data-testid="input-value"
                value={valStr}
                onChange={e => setValStr(e.target.value)}
                placeholder="1"
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Source Unit (From)
              </label>
              <select
                data-testid="select-from"
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
              >
                {AREA_UNITS.map(u => (
                  <option key={u.key} value={u.key}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Swap Button */}
            <div className="flex justify-center -my-1">
              <button
                type="button"
                data-testid="btn-swap"
                onClick={swapUnits}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-all cursor-pointer"
                title="Swap source and target units"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap Units</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                Target Unit (To)
              </label>
              <select
                data-testid="select-to"
                value={toUnit}
                onChange={e => setToUnit(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
              >
                {AREA_UNITS.map(u => (
                  <option key={u.key} value={u.key}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            data-testid="btn-reset"
            onClick={() => { setValStr('1'); setFromUnit('m2'); setToUnit('ft2'); }}
            className="w-full py-2.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Reset Defaults (1 m² → ft²)
          </button>
        </div>

        {/* Right Column: High-Precision Converted Output & Multi-Unit Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Conversion Result</h2>
                  <p className="text-xs text-slate-500 font-medium">Exact double-precision analytical output</p>
                </div>
              </div>

              <button
                data-testid="btn-export-csv"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* Primary Conversion Banner */}
            <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-purple-200 mb-1">
                Converted Equivalent
              </div>
              <div className="text-4xl font-black">
                <span data-testid="result-value">{formatNum(results.outputVal)}</span>{' '}
                <span data-testid="result-unit" className="text-xl font-bold text-purple-200">
                  {results.toDef?.symbol}
                </span>
              </div>
              <div className="text-xs text-purple-200/90 mt-2 font-medium">
                {valStr} {results.fromDef?.symbol} = {results.m2Val.toLocaleString('en-US', { maximumFractionDigits: 6 })} m²
              </div>
            </div>

            {/* Equivalent Values Across All Units */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                <Table className="w-4 h-4 text-purple-600" />
                <span>Equivalent Area in Other Standard Units</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.table.map(row => (
                  <div
                    key={row.key}
                    className={`p-3 rounded-xl border transition-all ${
                      row.key === toUnit
                        ? 'bg-purple-50/70 border-purple-200 shadow-xs'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-500">{row.name}</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {formatNum(row.converted)} <span className="text-xs font-bold text-slate-400">{row.symbol}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Conversion Reference Note */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Standard Definitions:</strong> 1 ft² = 0.09290304 m² (exact) • 1 yd² = 0.83612736 m² (exact, 9 ft²) • 1 acre = 4,046.8564224 m² • 1 hectare (ha) = 10,000 m² (exact).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
