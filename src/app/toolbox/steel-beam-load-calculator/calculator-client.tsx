'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type LoadMode = 'udl' | 'point';

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

const DEFAULT_INPUTS = ['200', '250', '5', '1.67'];

export default function SteelBeamLoadCalculatorClient() {
  const [loadMode, setLoadMode] = useState<LoadMode>('udl');
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const resetDefaults = () => {
    setLoadMode('udl');
    setInputs(DEFAULT_INPUTS);
  };

  const result = useMemo(() => {
    const zx = parseFinite(inputs[0]);
    const fy = parseFinite(inputs[1]);
    const span = parseFinite(inputs[2]);
    const omega = parseFinite(inputs[3]);

    if (zx === null || fy === null || span === null || omega === null) {
      return { valid: false as const, error: 'Enter numeric values for section modulus, yield strength, span, and safety factor.' };
    }
    if (zx <= 0 || fy <= 0 || span <= 0 || omega <= 0) {
      return { valid: false as const, error: 'Section modulus Zx, yield strength fy, span L, and safety factor Omega must all be > 0.' };
    }

    const My = (fy * zx) / 1000;
    const Ma = My / omega;
    const wUdl = (8 * Ma) / (span * span);
    const totalUdl = wUdl * span;
    const pPoint = (4 * Ma) / span;

    return { valid: true as const, zx, fy, span, omega, My, Ma, wUdl, totalUdl, pPoint };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Simply Supported Steel Beam Flexural Capacity Report',
      '# Formulas: My = fy*Zx/1000 [kN*m], Ma = My/Omega, w_udl = 8*Ma/L^2 [kN/m], P_mid = 4*Ma/L [kN]',
      'Parameter,Value,Unit',
      `Section Modulus Zx,${result.zx},cm3`,
      `Steel Yield Strength fy,${result.fy},MPa`,
      `Simply Supported Span L,${result.span},m`,
      `User Safety Factor Omega,${result.omega},-`,
      `Primary Load Mode,${loadMode},-`,
      `Yield Bending Moment My,${result.My.toFixed(6)},kN*m`,
      `Allowable Bending Moment Ma,${result.Ma.toFixed(6)},kN*m`,
      `Allowable Uniform Load w_udl,${result.wUdl.toFixed(6)},kN/m`,
      `Total Uniformly Distributed Load,${result.totalUdl.toFixed(6)},kN`,
      `Allowable Midspan Point Load P,${result.pPoint.toFixed(6)},kN`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-beam-load-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
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
            <button
              type="button"
              data-testid="load-udl"
              onClick={() => setLoadMode('udl')}
              className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer ${
                loadMode === 'udl' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Uniform Load (UDL)
            </button>
            <button
              type="button"
              data-testid="load-point"
              onClick={() => setLoadMode('point')}
              className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer ${
                loadMode === 'point' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Midspan Point Load
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Section Modulus Zx (cm&sup3;)</label>
              <input type="text" data-testid="input-zx" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Yield Strength fy (MPa)</label>
              <input type="text" data-testid="input-fy" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Simply Supported Span L (m)</label>
              <input type="text" data-testid="input-span" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Safety Factor &Omega; (-)</label>
              <input type="text" data-testid="input-omega" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Flexural Load Capacity</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 sm:col-span-2">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  {loadMode === 'udl' ? 'Allowable Uniform Load w (8*Ma / L^2)' : 'Allowable Midspan Point Load P (4*Ma / L)'}
                </div>
                <div data-testid="output-governing" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(loadMode === 'udl' ? result.wUdl : result.pPoint) : '—'}
                  {result.valid && <span className="text-lg text-blue-500 ml-1">{loadMode === 'udl' ? 'kN/m' : 'kN'}</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Yield Moment My</div>
                <div data-testid="output-my" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.My) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kN&middot;m</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Allowable Moment Ma (My / &Omega;)</div>
                <div data-testid="output-ma" className="text-2xl font-black text-green-800">
                  {result.valid ? formatNum(result.Ma) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">kN&middot;m</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Uniform Distributed Load w</div>
                <div data-testid="output-w-udl" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.wUdl) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kN/m</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Midspan Point Load P</div>
                <div data-testid="output-p-point" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.pPoint) : '—'}
                  {result.valid && <span className="text-base text-slate-500 ml-1">kN</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Simply supported flexural bending capacity without lateral-torsional buckling or deflection reductions: My = fy &middot; Zx / 1000, Ma = My / &Omega;, w = 8Ma / L&sup2;, P = 4Ma / L. Adjust &Omega; and verify shear, web crippling, and serviceability deflection independently.
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
