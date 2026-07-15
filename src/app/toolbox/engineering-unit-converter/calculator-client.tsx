'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, ArrowRight } from 'lucide-react';

type Category = 'length' | 'mass' | 'force' | 'pressure' | 'energy' | 'power' | 'temperature' | 'velocity' | 'area';

const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'length', name: 'Length', icon: '📏' },
  { id: 'mass', name: 'Mass', icon: '⚖️' },
  { id: 'force', name: 'Force', icon: '💪' },
  { id: 'pressure', name: 'Pressure', icon: '🗜️' },
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'power', name: 'Power', icon: '🔌' },
  { id: 'temperature', name: 'Temp', icon: '🌡️' },
  { id: 'velocity', name: 'Velocity', icon: '🚀' },
  { id: 'area', name: 'Area', icon: '📐' },
];

const UNITS: Record<Category, { name: string; factor: number }[]> = {
  length: [
    { name: 'mm', factor: 0.001 },
    { name: 'cm', factor: 0.01 },
    { name: 'm', factor: 1 },
    { name: 'km', factor: 1000 },
    { name: 'in', factor: 0.0254 },
    { name: 'ft', factor: 0.3048 },
    { name: 'yd', factor: 0.9144 },
    { name: 'mile', factor: 1609.344 },
  ],
  mass: [
    { name: 'mg', factor: 0.000001 },
    { name: 'g', factor: 0.001 },
    { name: 'kg', factor: 1 },
    { name: 't', factor: 1000 },
    { name: 'oz', factor: 0.0283495 },
    { name: 'lb', factor: 0.453592 },
    { name: 'ton (US)', factor: 907.185 },
  ],
  force: [
    { name: 'N', factor: 1 },
    { name: 'kN', factor: 1000 },
    { name: 'MN', factor: 1000000 },
    { name: 'kgf', factor: 9.80665 },
    { name: 'lbf', factor: 4.44822 },
    { name: 'kip', factor: 4448.22 },
    { name: 'dyne', factor: 0.00001 },
  ],
  pressure: [
    { name: 'Pa', factor: 1 },
    { name: 'kPa', factor: 1000 },
    { name: 'MPa', factor: 1000000 },
    { name: 'bar', factor: 100000 },
    { name: 'psi', factor: 6894.76 },
    { name: 'ksi', factor: 6894760 },
    { name: 'atm', factor: 101325 },
    { name: 'mmHg', factor: 133.322 },
  ],
  energy: [
    { name: 'J', factor: 1 },
    { name: 'kJ', factor: 1000 },
    { name: 'MJ', factor: 1000000 },
    { name: 'cal', factor: 4.184 },
    { name: 'kcal', factor: 4184 },
    { name: 'Wh', factor: 3600 },
    { name: 'kWh', factor: 3600000 },
    { name: 'BTU', factor: 1055.06 },
    { name: 'ft-lb', factor: 1.35582 },
  ],
  power: [
    { name: 'W', factor: 1 },
    { name: 'kW', factor: 1000 },
    { name: 'MW', factor: 1000000 },
    { name: 'hp', factor: 745.7 },
    { name: 'BTU/h', factor: 0.293071 },
    { name: 'ft-lb/s', factor: 1.35582 },
  ],
  temperature: [
    { name: '°C', factor: 1 },
    { name: '°F', factor: 1 },
    { name: 'K', factor: 1 },
  ],
  velocity: [
    { name: 'm/s', factor: 1 },
    { name: 'km/h', factor: 0.277778 },
    { name: 'mph', factor: 0.44704 },
    { name: 'ft/s', factor: 0.3048 },
    { name: 'knot', factor: 0.514444 },
  ],
  area: [
    { name: 'mm²', factor: 0.000001 },
    { name: 'cm²', factor: 0.0001 },
    { name: 'm²', factor: 1 },
    { name: 'ha', factor: 10000 },
    { name: 'km²', factor: 1000000 },
    { name: 'in²', factor: 0.00064516 },
    { name: 'ft²', factor: 0.092903 },
    { name: 'acre', factor: 4046.86 },
  ],
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === '°F') celsius = (value - 32) * 5 / 9;
  else if (from === 'K') celsius = value - 273.15;

  if (to === '°C') return celsius;
  if (to === '°F') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(2);
  const [inputValue, setInputValue] = useState(1);

  const result = useMemo(() => {
    const units = UNITS[category];
    if (category === 'temperature') {
      return convertTemp(inputValue, units[fromUnit].name, units[toUnit].name);
    }
    const baseValue = inputValue * units[fromUnit].factor;
    return baseValue / units[toUnit].factor;
  }, [category, fromUnit, toUnit, inputValue]);

  const units = UNITS[category];

  return (
    <div className="space-y-8">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setCategory(c.id); setFromUnit(0); setToUnit(Math.min(2, UNITS[c.id].length - 1)); }}
            className={`px-4 py-2.5 rounded-xl text-base font-black border transition-all ${category === c.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Convert</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">From</label>
            <div className="flex gap-3">
              <input type="number" value={inputValue} onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
                className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold" />
              <select value={fromUnit} onChange={e => setFromUnit(parseInt(e.target.value))}
                className="w-32 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
                {units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">To</label>
            <div className="flex gap-3">
              <input type="number" value={result.toFixed(6)} readOnly
                className="flex-1 h-12 px-4 rounded-2xl bg-blue-50 border border-blue-100 text-lg font-black text-blue-700" />
              <select value={toUnit} onChange={e => setToUnit(parseInt(e.target.value))}
                className="w-32 h-12 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold">
                {units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Quick Reference</h2>
          <div className="space-y-2">
            {units.map((u, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-100">
                <span className="text-lg font-bold text-slate-600">{u.name}</span>
                <span className="text-lg font-black text-slate-900">
                  {category === 'temperature'
                    ? convertTemp(inputValue, units[fromUnit].name, u.name).toFixed(4)
                    : ((inputValue * units[fromUnit].factor) / u.factor).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
