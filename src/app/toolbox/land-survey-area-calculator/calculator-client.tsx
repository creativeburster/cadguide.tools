'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { MapPin, Plus, Trash2, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

interface PointItem {
  id: string;
  xStr: string;
  yStr: string;
}

const REAL_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseReal(raw: string): number | null {
  const t = raw.trim();
  if (!REAL_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

const DEFAULT_POINTS: PointItem[] = [
  { id: '1', xStr: '0', yStr: '0' },
  { id: '2', xStr: '100', yStr: '0' },
  { id: '3', xStr: '100', yStr: '50' },
  { id: '4', xStr: '0', yStr: '50' },
];

export default function LandSurveyAreaCalculatorClient() {
  const [points, setPoints] = useState<PointItem[]>(DEFAULT_POINTS);
  const [copied, setCopied] = useState(false);

  // Pure calculation helper (avoid manual useMemo on array loops for React Compiler compatibility)
  const parsedPts: { x: number; y: number }[] = [];
  let coordsValid = points.length >= 3;
  for (const pt of points) {
    const x = parseReal(pt.xStr);
    const y = parseReal(pt.yStr);
    if (x === null || y === null) {
      coordsValid = false;
      break;
    }
    parsedPts.push({ x, y });
  }

  let areaSqM: number | null = null;
  let perimeterM: number | null = null;
  let areaHa: number | null = null;
  let areaSqFt: number | null = null;
  let areaAcres: number | null = null;

  if (coordsValid) {
    let doubleArea = 0;
    let perim = 0;
    for (let i = 0; i < parsedPts.length; i += 1) {
      const a = parsedPts[i];
      const b = parsedPts[(i + 1) % parsedPts.length];
      doubleArea += a.x * b.y - b.x * a.y;
      perim += Math.hypot(b.x - a.x, b.y - a.y);
    }
    const area = Math.abs(doubleArea) / 2;
    if (area > 0) {
      areaSqM = area;
      perimeterM = perim;
      areaHa = area / 10000;
      areaSqFt = area / 0.09290304;
      areaAcres = area / 4046.8564224;
    }
  }

  const isValid = coordsValid && areaSqM !== null;
  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const updatePoint = (idx: number, field: 'xStr' | 'yStr', value: string) => {
    setPoints(prev => prev.map((pt, i) => (i === idx ? { ...pt, [field]: value } : pt)));
  };

  const addPoint = () => {
    setPoints(prev => [...prev, { id: String(Date.now()), xStr: '0', yStr: '25' }]);
  };

  const removePoint = (idx: number) => {
    if (points.length <= 3) return;
    setPoints(prev => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => setPoints(DEFAULT_POINTS);

  const handleCopy = async () => {
    if (!isValid || areaSqM === null || areaHa === null || areaAcres === null || perimeterM === null) return;
    const text = [
      `Land Survey Polygon (${parsedPts.length} vertices)`,
      `Area: ${areaSqM.toFixed(2)} m2 | ${areaHa.toFixed(4)} ha | ${areaAcres.toFixed(4)} acres`,
      `Perimeter: ${perimeterM.toFixed(2)} m`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || areaSqM === null || areaHa === null || areaSqFt === null || areaAcres === null || perimeterM === null) return;
    const rows = [
      ['section', 'label', 'x_or_value', 'y_or_unit'],
      ...parsedPts.map((pt, i) => ['vertex', `P${i + 1}`, String(pt.x), String(pt.y)]),
      ['result', 'area_sq_m', areaSqM.toFixed(4), 'm2'],
      ['result', 'area_hectares', areaHa.toFixed(6), 'ha'],
      ['result', 'area_sq_ft', areaSqFt.toFixed(4), 'ft2'],
      ['result', 'area_acres', areaAcres.toFixed(6), 'acres'],
      ['result', 'perimeter_m', perimeterM.toFixed(4), 'm'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'land-survey-polygon-area.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Boundary Vertices (m)</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-rect-100x50"
                onClick={() => setPoints(DEFAULT_POINTS)}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-red-50 text-slate-700 border border-slate-200"
              >
                Rectangular Lot (100 m x 50 m)
              </button>
              <button
                type="button"
                data-testid="preset-l-lot"
                onClick={() =>
                  setPoints([
                    { id: 'a1', xStr: '0', yStr: '0' },
                    { id: 'a2', xStr: '80', yStr: '0' },
                    { id: 'a3', xStr: '80', yStr: '30' },
                    { id: 'a4', xStr: '40', yStr: '30' },
                    { id: 'a5', xStr: '40', yStr: '60' },
                    { id: 'a6', xStr: '0', yStr: '60' },
                  ])
                }
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-red-50 text-slate-700 border border-slate-200"
              >
                L-Shaped Corner Parcel (6 Vertices)
              </button>
              <button
                type="button"
                data-testid="preset-trapezoid"
                onClick={() =>
                  setPoints([
                    { id: 't1', xStr: '0', yStr: '0' },
                    { id: 't2', xStr: '120', yStr: '0' },
                    { id: 't3', xStr: '95', yStr: '60' },
                    { id: 't4', xStr: '20', yStr: '60' },
                  ])
                }
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-red-50 text-slate-700 border border-slate-200"
              >
                Trapezoid Parcel (120 / 75 x 60 m)
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {points.map((pt, idx) => (
              <div key={pt.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-slate-500 w-6">P{idx + 1}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid={`pt-x-${idx}`}
                  value={pt.xStr}
                  onChange={e => updatePoint(idx, 'xStr', e.target.value)}
                  className="h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-sm font-bold"
                  aria-label={`Point ${idx + 1} X`}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid={`pt-y-${idx}`}
                  value={pt.yStr}
                  onChange={e => updatePoint(idx, 'yStr', e.target.value)}
                  className="h-9 px-2.5 rounded-lg bg-white border border-slate-200 text-sm font-bold"
                  aria-label={`Point ${idx + 1} Y`}
                />
                {points.length > 3 ? (
                  <button
                    type="button"
                    data-testid={`btn-remove-pt-${idx}`}
                    onClick={() => removePoint(idx)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    aria-label="Remove point"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="w-6" />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-add-point"
            onClick={addPoint}
            className="w-full py-2 rounded-xl border border-dashed border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Vertex
          </button>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Provide &ge; 3 valid numeric (X, Y) vertices enclosing a non-zero area.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1.5"
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
              <Download className="w-4 h-4" /> Export Polygon CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Shoelace Coordinate Area</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                A = 0.5 * |sum(x_i*y_(i+1) - x_(i+1)*y_i)|, converted with exact international survey factors
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <div className="text-sm font-black text-red-600 uppercase tracking-wider mb-1">Parcel Area</div>
                <div className="text-3xl font-black text-red-900">
                  <span data-testid="result-area-sqm">{fmt(areaSqM, 2)}</span>{' '}
                  <span className="text-lg text-red-600">m2</span>
                </div>
                <div className="text-xs text-red-700 mt-1 font-medium">
                  <span data-testid="result-area-sqft">{fmt(areaSqFt, 2)}</span> ft2
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Hectares (ha)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-area-ha">{fmt(areaHa, 4)}</span>{' '}
                  <span className="text-lg text-emerald-600">ha</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">International Acres</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-area-acres">{fmt(areaAcres, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">acres</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Closed Perimeter</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-perimeter">{fmt(perimeterM, 2)}</span>{' '}
                  <span className="text-lg text-slate-500">m</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
