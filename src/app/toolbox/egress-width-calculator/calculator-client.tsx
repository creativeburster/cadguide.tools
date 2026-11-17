'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type UnitMode = 'metric' | 'imperial';

const SQFT_TO_SQM = 0.09290304; // Exact NIST SP 811 international foot^2
const INCH_TO_MM = 25.4; // Exact international inch

interface OccupancyPreset {
  id: string;
  label: string;
  olfSqFt: string; // IBC Table 1004.5 reference area per occupant in ft2
}

const OCCUPANCY_PRESETS: OccupancyPreset[] = [
  { id: 'business', label: 'Business Area (150 ft²/occ ref)', olfSqFt: '150' },
  { id: 'business-legacy', label: 'Business Gross Legacy (100 ft²/occ ref)', olfSqFt: '100' },
  { id: 'assembly-concentrated', label: 'Assembly Concentrated, Unfixed Chairs (7 ft²/occ ref)', olfSqFt: '7' },
  { id: 'classroom', label: 'Educational Classroom (20 ft²/occ ref)', olfSqFt: '20' },
  { id: 'mercantile', label: 'Mercantile / Retail (60 ft²/occ ref)', olfSqFt: '60' },
  { id: 'storage', label: 'Storage / Mechanical (300 ft²/occ ref)', olfSqFt: '300' },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

export default function EgressWidthCalculatorClient() {
  const [unit, setUnit] = useState<UnitMode>('metric');
  const [floorArea, setFloorArea] = useState('500');
  const [presetId, setPresetId] = useState('business');
  const [olfStr, setOlfStr] = useState(() => (150 * SQFT_TO_SQM).toFixed(4)); // m2/occ in metric, ft2/occ in imperial
  const [stairFactorIn, setStairFactorIn] = useState('0.3');
  const [levelFactorIn, setLevelFactorIn] = useState('0.2');
  const [copied, setCopied] = useState(false);

  const switchUnit = (nextUnit: UnitMode) => {
    if (nextUnit === unit) return;
    const areaVal = parsePositive(floorArea, 1e9);
    const olfVal = parsePositive(olfStr, 1e6);
    if (areaVal !== null) {
      setFloorArea(nextUnit === 'imperial' ? (areaVal / SQFT_TO_SQM).toFixed(2) : (areaVal * SQFT_TO_SQM).toFixed(2));
    }
    if (olfVal !== null) {
      setOlfStr(nextUnit === 'imperial' ? (olfVal / SQFT_TO_SQM).toFixed(2) : (olfVal * SQFT_TO_SQM).toFixed(4));
    }
    setUnit(nextUnit);
  };

  const applyOccupancyPreset = (id: string) => {
    setPresetId(id);
    const found = OCCUPANCY_PRESETS.find((o) => o.id === id);
    if (!found) return;
    const sqFt = Number(found.olfSqFt);
    setOlfStr(unit === 'imperial' ? sqFt.toString() : (sqFt * SQFT_TO_SQM).toFixed(4));
  };

  const resetAll = () => {
    setUnit('metric');
    setFloorArea('500');
    setPresetId('business');
    setOlfStr((150 * SQFT_TO_SQM).toFixed(4));
    setStairFactorIn('0.3');
    setLevelFactorIn('0.2');
  };

  const result = useMemo(() => {
    const area = parsePositive(floorArea, 1e9);
    const olf = parsePositive(olfStr, 1e6);
    const sIn = parsePositive(stairFactorIn, 10);
    const lIn = parsePositive(levelFactorIn, 10);

    if (area === null || olf === null || sIn === null || lIn === null) {
      return null;
    }

    const occupantLoad = Math.ceil(area / olf);
    const stairWidthIn = occupantLoad * sIn;
    const levelWidthIn = occupantLoad * lIn;
    const stairWidthDisplay = unit === 'imperial' ? stairWidthIn : stairWidthIn * INCH_TO_MM;
    const levelWidthDisplay = unit === 'imperial' ? levelWidthIn : levelWidthIn * INCH_TO_MM;

    // IBC Section 1006 / Table 1006.3.3 thresholds by occupant load: 1-500 -> 2, 501-1000 -> 3, >1000 -> 4
    let minExits = 2;
    if (occupantLoad > 1000) minExits = 4;
    else if (occupantLoad > 500) minExits = 3;

    return {
      occupantLoad,
      stairWidthDisplay,
      levelWidthDisplay,
      minExits,
      stairFactorMm: sIn * INCH_TO_MM,
      levelFactorMm: lIn * INCH_TO_MM,
    };
  }, [unit, floorArea, olfStr, stairFactorIn, levelFactorIn]);

  const handleCopy = async () => {
    if (!result) return;
    const uArea = unit === 'metric' ? 'm2' : 'ft2';
    const uLen = unit === 'metric' ? 'mm' : 'in';
    const text = [
      'Occupant Load & Egress Width Sizing Summary',
      `Floor Area: ${floorArea} ${uArea} | Load Factor: ${olfStr} ${uArea}/occ`,
      `Design Occupant Load: ${result.occupantLoad} persons`,
      `Required Stair Capacity Width (${stairFactorIn} in/occ): ${result.stairWidthDisplay.toFixed(2)} ${uLen}`,
      `Required Level Egress Width (${levelFactorIn} in/occ): ${result.levelWidthDisplay.toFixed(2)} ${uLen}`,
      `Minimum Exits Baseline (by occupant count only): ${result.minExits}`,
      'Note: Check local building code minimum clear widths (e.g., 44 in / 36 in stairs, 32 in doors) and sprinkler reduction allowances.',
    ].join('\n');
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    const uArea = unit === 'metric' ? 'm2' : 'ft2';
    const uLen = unit === 'metric' ? 'mm' : 'in';
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Unit System', unit, '-', 'Exact conversion: 1 ft2 = 0.09290304 m2, 1 in = 25.4 mm'],
      ['Floor Area', floorArea, uArea, 'Input space area'],
      ['Occupant Load Factor (OLF)', olfStr, `${uArea}/person`, 'Editable space area per occupant'],
      ['Stair Width Factor', stairFactorIn, 'in/person', `${result.stairFactorMm.toFixed(2)} mm/person`],
      ['Level Component Factor', levelFactorIn, 'in/person', `${result.levelFactorMm.toFixed(2)} mm/person`],
      ['Design Occupant Load', String(result.occupantLoad), 'persons', 'ceil(Area / OLF)'],
      ['Calculated Stair Width', result.stairWidthDisplay.toFixed(2), uLen, 'Load * stairFactor'],
      ['Calculated Level Egress Width', result.levelWidthDisplay.toFixed(2), uLen, 'Load * levelFactor'],
      ['Minimum Exits by Load Threshold', String(result.minExits), 'exits', '1-500: 2; 501-1000: 3; >1000: 4'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egress-width-calculation-${result.occupantLoad}occ.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uAreaLabel = unit === 'metric' ? 'm²' : 'ft²';
  const uLenLabel = unit === 'metric' ? 'mm' : 'in';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Space &amp; Code Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="btn-unit-metric"
              onClick={() => switchUnit('metric')}
              className={`py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                unit === 'metric' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Metric (m² / mm)
            </button>
            <button
              type="button"
              data-testid="btn-unit-imperial"
              onClick={() => switchUnit('imperial')}
              className={`py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                unit === 'imperial' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Imperial (ft² / in)
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Occupancy Reference Preset (Editable Factor)
            </label>
            <select
              data-testid="select-occupancy"
              value={presetId}
              onChange={(e) => applyOccupancyPreset(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            >
              {OCCUPANCY_PRESETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Floor Area ({uAreaLabel})
              </label>
              <input
                type="text"
                data-testid="input-area"
                value={floorArea}
                onChange={(e) => setFloorArea(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Load Factor ({uAreaLabel}/occ)
              </label>
              <input
                type="text"
                data-testid="input-olf"
                value={olfStr}
                onChange={(e) => setOlfStr(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Stair Factor (in/occ)
              </label>
              <input
                type="text"
                data-testid="input-stair-factor"
                value={stairFactorIn}
                onChange={(e) => setStairFactorIn(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Level Factor (in/occ)
              </label>
              <input
                type="text"
                data-testid="input-level-factor"
                value={levelFactorIn}
                onChange={(e) => setLevelFactorIn(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
              />
            </div>
          </div>

          {!result && (
            <div data-testid="validation-error" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive area, load factor, and egress width factors.
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Egress Capacity Output</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Occupant Load</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-occupants">{result ? String(result.occupantLoad) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">persons</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">Min Exits Required</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-min-exits">{result ? String(result.minExits) : '—'}</span>
                  <span className="text-sm font-bold text-orange-600 ml-1">exits</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Calculated Stair Width</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-stair-width">{result ? result.stairWidthDisplay.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">{uLenLabel}</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Calculated Level Width</div>
                <div className="text-2xl font-black text-purple-900">
                  <span data-testid="result-level-width">{result ? result.levelWidthDisplay.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-purple-500 ml-1">{uLenLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-orange-600 shrink-0" />
                IBC Chapter 10 Calculation Basis &amp; Code Verification Notice
              </div>
              <p>
                Occupant Load = ceil(Area / OLF); Width = Occupant Load * Capacity Factor (baseline 0.3 in/occ stair, 0.2 in/occ level components; editable for sprinkler/EVACS reductions). Exact conversion: 1 ft² = 0.09290304 m², 1 in = 25.4 mm.
              </p>
              <p>
                Always verify final egress dimensions against the applicable local building code, absolute minimum clear corridor/stair/door widths, and single-exit/common-path rules.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
