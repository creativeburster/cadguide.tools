'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ArrowLeftRight, RotateCcw, Download } from 'lucide-react';

interface SpeedUnitDef {
  id: 'ms' | 'kmh' | 'mph' | 'fts' | 'knot' | 'mms' | 'mmin';
  label: string;
  symbol: string;
  toMsFactor: number;
}

const SPEED_UNITS: SpeedUnitDef[] = [
  { id: 'ms', label: 'Meters per second (m/s)', symbol: 'm/s', toMsFactor: 1 },
  { id: 'kmh', label: 'Kilometers per hour (km/h)', symbol: 'km/h', toMsFactor: 1 / 3.6 },
  { id: 'mph', label: 'Miles per hour (mph)', symbol: 'mph', toMsFactor: 0.44704 },
  { id: 'fts', label: 'Feet per second (ft/s)', symbol: 'ft/s', toMsFactor: 0.3048 },
  { id: 'knot', label: 'Knots (kn)', symbol: 'kn', toMsFactor: 1852 / 3600 },
  { id: 'mms', label: 'Millimeters per second (mm/s)', symbol: 'mm/s', toMsFactor: 0.001 },
  { id: 'mmin', label: 'Meters per minute (m/min)', symbol: 'm/min', toMsFactor: 1 / 60 },
];

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(2);
  if (Math.abs(n) >= 1) return n.toFixed(3);
  return n.toFixed(6);
}

export default function SpeedUnitConverterClient() {
  const [valStr, setValStr] = useState('100');
  const [fromUnit, setFromUnit] = useState<SpeedUnitDef['id']>('kmh');
  const [toUnit, setToUnit] = useState<SpeedUnitDef['id']>('mph');

  const result = useMemo(() => {
    const val = parseFinite(valStr);
    if (val === null) {
      return { valid: false as const, error: 'Enter a valid numeric speed value to convert.' };
    }
    const fromDef = SPEED_UNITS.find(u => u.id === fromUnit) || SPEED_UNITS[1];
    const toDef = SPEED_UNITS.find(u => u.id === toUnit) || SPEED_UNITS[2];
    const ms = val * fromDef.toMsFactor;
    const converted = ms / toDef.toMsFactor;
    const allUnits = SPEED_UNITS.map(u => ({
      ...u,
      value: ms / u.toMsFactor,
    }));

    return { valid: true as const, val, fromDef, toDef, ms, converted, allUnits };
  }, [valStr, fromUnit, toUnit]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const resetDefaults = () => {
    setValStr('100');
    setFromUnit('kmh');
    setToUnit('mph');
  };

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Precision Speed & Machining Feed Unit Conversion Table',
      `# Input: ${result.val} ${result.fromDef.symbol} -> ${result.converted.toFixed(6)} ${result.toDef.symbol}`,
      'Unit,Symbol,Converted Value',
      ...result.allUnits.map(u => `"${u.label}",${u.symbol},${u.value.toFixed(6)}`),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speed-unit-conversion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Speed Value</label>
            <input type="text" data-testid="input-val" value={valStr} onChange={e => setValStr(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">From Unit</label>
            <select
              data-testid="select-from"
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value as SpeedUnitDef['id'])}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
            >
              {SPEED_UNITS.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              data-testid="btn-swap"
              onClick={swapUnits}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap Units
            </button>
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">To Unit</label>
            <select
              data-testid="select-to"
              value={toUnit}
              onChange={e => setToUnit(e.target.value as SpeedUnitDef['id'])}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
            >
              {SPEED_UNITS.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Converted Results</h2>
              </div>
              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={downloadCsv}
                disabled={!result.valid}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {!result.valid && (
              <div data-testid="validation-msg" className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Primary Output</div>
              <div data-testid="output-result" className="text-3xl font-black text-blue-800">
                {result.valid ? formatNum(result.converted) : '—'}
                {result.valid && <span className="text-lg text-blue-500 ml-1.5">{result.toDef.symbol}</span>}
              </div>
            </div>

            {result.valid && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.allUnits.map(u => (
                  <div key={u.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase mb-1">{u.symbol}</div>
                    <div data-testid={`output-unit-${u.id}`} className="text-base font-black text-slate-800 font-mono">
                      {u.value.toFixed(6)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Exact international definitions: 1 mph = 0.44704 m/s (Wikipedia: Miles per hour); 1 knot = 1852 m / 3600 s (Wikipedia: Knot); 1 ft/s = 0.3048 m/s; 1 km/h = 1/3.6 m/s.
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
