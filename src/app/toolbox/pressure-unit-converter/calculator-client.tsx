'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download } from 'lucide-react';

const PRESSURE_UNITS = [
  { id: 'pa', label: 'Pascal (Pa)', factorPa: 1 },
  { id: 'kpa', label: 'Kilopascal (kPa)', factorPa: 1000 },
  { id: 'mpa', label: 'Megapascal (MPa)', factorPa: 1e6 },
  { id: 'bar', label: 'Bar (bar = 100,000 Pa)', factorPa: 100000 },
  { id: 'mbar', label: 'Millibar (mbar = 100 Pa)', factorPa: 100 },
  { id: 'psi', label: 'Pound per sq in (psi = 6894.757 Pa)', factorPa: (0.45359237 * 9.80665) / (0.0254 * 0.0254) },
  { id: 'atm', label: 'Standard Atmosphere (atm = 101,325 Pa)', factorPa: 101325 },
  { id: 'torr', label: 'Torr / mmHg (101,325 / 760 Pa)', factorPa: 101325 / 760 },
  { id: 'kgcm2', label: 'kgf/cm^2 (at = 98,066.5 Pa)', factorPa: 98066.5 },
  { id: 'mmh2o', label: 'mmH2O (conventional 9.80665 Pa)', factorPa: 9.80665 },
];

interface PressureConvResult {
  valid: boolean;
  error?: string;
  pa: number;
  converted: number;
  allValues: Array<{ id: string; label: string; value: number }>;
}

function solvePressureConversion(valStr: string, fromId: string, toId: string): PressureConvResult {
  if (valStr.trim() === '') {
    return { valid: false, error: 'Pressure value is required.', pa: 0, converted: 0, allValues: [] };
  }
  const val = Number(valStr);
  if (!Number.isFinite(val)) {
    return { valid: false, error: 'Pressure value must be a valid finite number.', pa: 0, converted: 0, allValues: [] };
  }
  const uFrom = PRESSURE_UNITS.find((u) => u.id === fromId) || PRESSURE_UNITS[3];
  const uTo = PRESSURE_UNITS.find((u) => u.id === toId) || PRESSURE_UNITS[5];
  const pa = val * uFrom.factorPa;
  const converted = pa / uTo.factorPa;
  const allValues = PRESSURE_UNITS.map((u) => ({ id: u.id, label: u.label, value: pa / u.factorPa }));
  return { valid: true, pa, converted, allValues };
}

export default function PressureUnitConverterClient() {
  const [valStr, setValStr] = useState('1');
  const [fromId, setFromId] = useState('bar');
  const [toId, setToId] = useState('psi');

  const res = solvePressureConversion(valStr, fromId, toId);

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Pressure Unit Conversion Table', ''],
      ['Input', `${valStr} ${fromId}`],
      ['Converted Target', `${res.converted.toFixed(6)} ${toId}`],
      ...res.allValues.map((x) => [x.label, x.value.toFixed(6)]),
    ];
    const csv = rows.map((r) => `"${r[0]}","${r[1]}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pressure-unit-conversion.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Value</label>
            <input type="text" inputMode="decimal" data-testid="input-value" value={valStr} onChange={(e) => setValStr(e.target.value)} className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">From Unit</label>
            <select data-testid="select-from" value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {PRESSURE_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">To Unit</label>
            <select data-testid="select-to" value={toId} onChange={(e) => setToId(e.target.value)} className="w-full h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold">
              {PRESSURE_UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>

          <button type="button" onClick={() => { setValStr('1'); setFromId('bar'); setToId('psi'); }} className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Converted Result</h2>
              </div>
              <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 disabled:opacity-50">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Result ({toId.toUpperCase()})</div>
                  <div className="text-4xl font-black text-blue-700" data-testid="res-converted">{res.converted.toFixed(6)}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {res.allValues.map((item) => (
                    <div key={item.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-600">{item.label}</span>
                      <span className="font-mono font-black text-slate-900" data-testid={`unit-${item.id}`}>{item.value.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              Exact SI relations: 1 bar = 100,000 Pa; 1 atm = 101,325 Pa = 760 Torr; 1 psi = (0.45359237*9.80665)/(0.0254^2) = 6894.757293 Pa.
            </div>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
