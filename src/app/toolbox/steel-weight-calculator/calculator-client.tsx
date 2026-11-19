'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type ShapeType = 'ibeam' | 'tube' | 'angle' | 'plate';

const DENSITY_PRESETS = [
  { id: 'steel', label: 'Steel (7850 kg/m3)', rho: '7850' },
  { id: 'aluminum', label: 'Aluminum (2712 kg/m3)', rho: '2712' },
  { id: 'titanium', label: 'Titanium (4500 kg/m3)', rho: '4500' },
];

function parseFinite(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const DEFAULT_INPUTS = ['200', '100', '8', '10', '6', '7850']; // h, b, t1(tw/t/wt), t2(tf), L(m), rho

export default function SteelWeightCalculatorClient() {
  const [shape, setShape] = useState<ShapeType>('ibeam');
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const resetDefaults = () => {
    setShape('ibeam');
    setInputs(DEFAULT_INPUTS);
  };

  const result = useMemo(() => {
    const h = parseFinite(inputs[0]);
    const b = parseFinite(inputs[1]);
    const t1 = parseFinite(inputs[2]);
    const t2 = parseFinite(inputs[3]);
    const L = parseFinite(inputs[4]);
    const rho = parseFinite(inputs[5]);

    if (h === null || b === null || t1 === null || t2 === null || L === null || rho === null) {
      return { valid: false as const, error: 'Enter numeric values for cross-section dimensions, length, and material density.' };
    }
    if (h <= 0 || b <= 0 || t1 < 0 || t2 < 0 || L < 0 || rho <= 0) {
      return { valid: false as const, error: 'H, B, and density must be > 0; thickness and length must be >= 0.' };
    }

    let areaMm2 = 0;
    if (shape === 'ibeam') {
      if (t1 <= 0 || t2 <= 0 || h < 2 * t2 || b < t1) {
        return { valid: false as const, error: 'Require tw > 0, tf > 0, H >= 2*tf, and B >= tw for I-beam section.' };
      }
      areaMm2 = 2 * b * t2 + (h - 2 * t2) * t1;
    } else if (shape === 'tube') {
      if (t1 <= 0 || 2 * t1 > h || 2 * t1 > b) {
        return { valid: false as const, error: 'Wall thickness t must be > 0 and 2*t <= min(H, B) for hollow tube.' };
      }
      areaMm2 = 2 * t1 * (h + b - 2 * t1);
    } else if (shape === 'angle') {
      if (t1 <= 0 || t1 > h || t1 > b) {
        return { valid: false as const, error: 'Angle thickness t must be > 0 and <= leg lengths H and B.' };
      }
      areaMm2 = t1 * (h + b - t1);
    } else {
      areaMm2 = h * b;
    }

    const areaCm2 = areaMm2 / 100;
    const unitWeight = (areaMm2 / 1_000_000) * rho;
    const totalWeight = unitWeight * L;

    return { valid: true as const, h, b, t1, t2, L, rho, areaMm2, areaCm2, unitWeight, totalWeight };
  }, [shape, inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Structural Steel Section Mass & Unit Weight Report',
      '# Formula: w = (A_mm2 / 1e6) * rho [kg/m], W = w * L [kg]',
      'Parameter,Value,Unit',
      `Section Shape,${shape},-`,
      `Height / Width1 (H),${result.h},mm`,
      `Width / Width2 (B),${result.b},mm`,
      `Web / Wall Thickness t1,${result.t1},mm`,
      `Flange Thickness tf (t2),${result.t2},mm`,
      `Length L,${result.L},m`,
      `Material Density rho,${result.rho},kg/m3`,
      `Cross-Section Area,${result.areaCm2.toFixed(4)},cm2`,
      `Unit Weight,${result.unitWeight.toFixed(6)},kg/m`,
      `Total Section Weight,${result.totalWeight.toFixed(6)},kg`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-weight-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
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

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'ibeam', label: 'I-Beam' },
                { id: 'tube', label: 'Rect Tube' },
                { id: 'angle', label: 'Angle (L)' },
                { id: 'plate', label: 'Flat Plate' },
              ] as const
            ).map(s => (
              <button
                key={s.id}
                type="button"
                data-testid={`shape-${s.id}`}
                onClick={() => setShape(s.id)}
                className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer ${
                  shape === s.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DENSITY_PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                data-testid={`density-${p.id}`}
                onClick={() => updateInput(5, p.rho)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                  inputs[5] === p.rho ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Height / Dimension H (mm)</label>
              <input type="text" data-testid="input-h" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Width / Dimension B (mm)</label>
              <input type="text" data-testid="input-b" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Web / Wall Thickness t1 (mm)</label>
              <input type="text" data-testid="input-t1" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Flange Thickness t2 (mm, I-Beam)</label>
              <input type="text" data-testid="input-t2" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Length L (m)</label>
                <input type="text" data-testid="input-length" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Density (kg/m3)</label>
                <input type="text" data-testid="input-rho" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Section Area &amp; Mass Results</h2>
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
              <div data-testid="validation-msg" className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-amber-800">
                {result.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Cross-Section Area</div>
                <div data-testid="output-area" className="text-2xl font-black text-slate-800">
                  {result.valid ? result.areaCm2.toFixed(2) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">cm&sup2;</span>}
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Unit Weight</div>
                <div data-testid="output-uw" className="text-2xl font-black text-blue-800">
                  {result.valid ? result.unitWeight.toFixed(4) : '—'}
                  {result.valid && <span className="text-base text-blue-500 ml-1">kg/m</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Total Section Weight</div>
                <div data-testid="output-total-w" className="text-2xl font-black text-green-800">
                  {result.valid ? result.totalWeight.toFixed(3) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">kg</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Mass computed as W = (Area_mm2 / 1,000,000) &middot; &rho; &middot; L using verified densities from Engineering ToolBox ({' '}
                  <a href="https://www.engineeringtoolbox.com/metal-alloys-densities-d_50.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    Metal Alloys Densities d_50
                  </a>
                  : Steel 7850 kg/m&sup3;, Aluminum 2712 kg/m&sup3;, Titanium 4500 kg/m&sup3;).
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
