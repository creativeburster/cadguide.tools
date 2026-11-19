'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

const MODULUS_PRESETS = [
  { id: 'steel', label: 'Spring Steel (79.3 GPa)', g: '79.3' },
  { id: 'stainless', label: 'Stainless Wire (69.0 GPa)', g: '69.0' },
  { id: 'bronze', label: 'Phosphor Bronze (41.0 GPa)', g: '41.0' },
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

const DEFAULT_INPUTS = ['3', '20', '10', '100', '79.3'];

export default function SpringDesignCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const d = parseFinite(inputs[0]);
    const D = parseFinite(inputs[1]);
    const N = parseFinite(inputs[2]);
    const F = parseFinite(inputs[3]);
    const G_GPa = parseFinite(inputs[4]);

    if (d === null || D === null || N === null || F === null || G_GPa === null) {
      return { valid: false as const, error: 'Enter numeric values in all helical spring geometry, load, and shear modulus fields.' };
    }
    if (d <= 0 || D <= 0 || N <= 0 || F < 0 || G_GPa <= 0) {
      return { valid: false as const, error: 'Wire diameter d, mean diameter D, active coils N, and shear modulus G must be > 0; load F >= 0.' };
    }
    if (D <= d) {
      return { valid: false as const, error: 'Mean coil diameter D must exceed wire diameter d (spring index C = D / d > 1).' };
    }

    const C = D / d;
    const G_MPa = G_GPa * 1000;
    const k = (G_MPa * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * N);
    const defl = F / k;
    const Kw = (4 * C - 1) / (4 * C - 4) + 0.615 / C;
    const tau = Kw * (8 * F * D) / (Math.PI * Math.pow(d, 3));

    return { valid: true as const, d, D, N, F, G_GPa, C, k, defl, Kw, tau };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Helical Compression Spring Rate & Wahl Shear Stress Report',
      '# Formulas: k = (G*1000)*d^4/(8*D^3*N) [N/mm], Kw = (4C-1)/(4C-4)+0.615/C, tau = Kw*8*F*D/(pi*d^3) [MPa]',
      'Parameter,Value,Unit',
      `Wire Diameter d,${result.d},mm`,
      `Mean Coil Diameter D,${result.D},mm`,
      `Active Coils N,${result.N},coils`,
      `Axial Load F,${result.F},N`,
      `Shear Modulus G,${result.G_GPa},GPa`,
      `Spring Index C,${result.C.toFixed(6)},-`,
      `Spring Stiffness Rate k,${result.k.toFixed(6)},N/mm`,
      `Static Deflection delta,${result.defl.toFixed(6)},mm`,
      `Wahl Correction Factor Kw,${result.Kw.toFixed(6)},-`,
      `Corrected Shear Stress tau,${result.tau.toFixed(6)},MPa`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spring-design-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
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
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shear Modulus Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {MODULUS_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => updateInput(4, p.g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    inputs[4] === p.g
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Wire Diameter d (mm)</label>
              <input type="text" data-testid="input-d" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Mean Coil Diameter D (mm)</label>
              <input type="text" data-testid="input-D" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Active Coils N (-)</label>
              <input type="text" data-testid="input-N" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Applied Axial Load F (N)</label>
              <input type="text" data-testid="input-F" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Shear Modulus G (GPa)</label>
              <input type="text" data-testid="input-G" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Spring Properties</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Spring Rate k</div>
                <div data-testid="output-k" className="text-2xl font-black text-blue-800">
                  {result.valid ? formatNum(result.k) : '—'}
                  {result.valid && <span className="text-base text-blue-500 ml-1">N/mm</span>}
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">Deflection &delta;</div>
                <div data-testid="output-defl" className="text-2xl font-black text-green-800">
                  {result.valid ? formatNum(result.defl) : '—'}
                  {result.valid && <span className="text-base text-green-600 ml-1">mm</span>}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Shear Stress &tau;</div>
                <div data-testid="output-tau" className="text-2xl font-black text-orange-800">
                  {result.valid ? formatNum(result.tau) : '—'}
                  {result.valid && <span className="text-base text-orange-600 ml-1">MPa</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Spring Index C (D/d)</div>
                <div data-testid="output-c" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.C) : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 sm:col-span-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Wahl Stress Correction Factor Kw</div>
                <div data-testid="output-kw" className="text-2xl font-black text-slate-800">
                  {result.valid ? formatNum(result.Kw) : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Under axial tension or compression, coil spring wire undergoes torsion proportional to shear modulus G (Wikipedia:{' '}
                  <a href="https://en.wikipedia.org/wiki/Coil_spring" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                    Coil spring
                  </a>
                  ). Stiffness k = (G &middot; 1000) &middot; d&sup4; / (8 &middot; D&sup3; &middot; N) N/mm, &delta; = F / k, and Wahl-corrected shear stress &tau; = Kw &middot; 8FD / (&pi;d&sup3;) MPa.
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
