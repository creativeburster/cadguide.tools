'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Download } from 'lucide-react';

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

const DEFAULT_INPUTS = ['15', '18', '5', '30', '25', '0', '1.5'];

export default function SlopeStabilityCalculatorClient() {
  const [inputs, setInputs] = useState<string[]>(DEFAULT_INPUTS);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const result = useMemo(() => {
    const c = parseFinite(inputs[0]);
    const gamma = parseFinite(inputs[1]);
    const z = parseFinite(inputs[2]);
    const betaDeg = parseFinite(inputs[3]);
    const phiDeg = parseFinite(inputs[4]);
    const ru = parseFinite(inputs[5]);
    const targetFs = parseFinite(inputs[6]);

    if (
      c === null || gamma === null || z === null || betaDeg === null ||
      phiDeg === null || ru === null || targetFs === null
    ) {
      return { valid: false as const, error: 'Enter numeric values for all soil and slope parameters.' };
    }
    if (c < 0 || gamma <= 0 || z <= 0 || betaDeg <= 0 || betaDeg >= 89 || phiDeg < 0 || phiDeg >= 89) {
      return { valid: false as const, error: 'Ensure gamma > 0, z > 0, c >= 0, 0 < beta < 89 deg, and 0 <= phi < 89 deg.' };
    }
    if (ru < 0 || ru > 0.6 || targetFs <= 0) {
      return { valid: false as const, error: 'Pore-pressure ratio ru must be in [0, 0.6] and target FS > 0.' };
    }

    const betaRad = (betaDeg * Math.PI) / 180;
    const phiRad = (phiDeg * Math.PI) / 180;
    const cosB = Math.cos(betaRad);
    const sinB = Math.sin(betaRad);

    const cohTerm = c / (gamma * z * sinB * cosB);
    const fricTerm = Math.max(0, 1 - ru / (cosB * cosB)) * (Math.tan(phiRad) / Math.tan(betaRad));
    const FS = cohTerm + fricTerm;
    const statusText = FS >= targetFs ? 'MEETS TARGET FS' : FS >= 1.0 ? 'MARGINAL (BELOW TARGET)' : 'UNSTABLE (FS < 1.0)';

    return { valid: true as const, c, gamma, z, betaDeg, phiDeg, ru, targetFs, cohTerm, fricTerm, FS, statusText };
  }, [inputs]);

  const downloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Infinite Slope Planar Limit-Equilibrium Stability Report',
      '# Formula: FS = c/(gamma*z*sin(beta)*cos(beta)) + (1 - ru/cos^2(beta))*tan(phi)/tan(beta)',
      'Parameter,Value,Unit',
      `Effective Cohesion c,${result.c},kPa`,
      `Soil Unit Weight gamma,${result.gamma},kN/m3`,
      `Failure Plane Depth z,${result.z},m`,
      `Slope Angle beta,${result.betaDeg},deg`,
      `Friction Angle phi,${result.phiDeg},deg`,
      `Pore-Pressure Ratio ru,${result.ru},-`,
      `Target Factor of Safety,${result.targetFs},-`,
      `Cohesive Resistance Term,${result.cohTerm.toFixed(6)},-`,
      `Frictional Resistance Term,${result.fricTerm.toFixed(6)},-`,
      `Calculated Factor of Safety FS,${result.FS.toFixed(6)},-`,
      `Status,${result.statusText},-`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infinite-slope-stability-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Cohesion c (kPa)</label>
            <input type="text" data-testid="input-c" value={inputs[0]} onChange={e => updateInput(0, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Soil Unit Weight &gamma; (kN/m&sup3;)</label>
            <input type="text" data-testid="input-gamma" value={inputs[1]} onChange={e => updateInput(1, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Failure Plane Depth z (m)</label>
            <input type="text" data-testid="input-z" value={inputs[2]} onChange={e => updateInput(2, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Slope &beta; (deg)</label>
              <input type="text" data-testid="input-beta" value={inputs[3]} onChange={e => updateInput(3, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Friction &phi; (deg)</label>
              <input type="text" data-testid="input-phi" value={inputs[4]} onChange={e => updateInput(4, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pore Ratio ru</label>
              <input type="text" data-testid="input-ru" value={inputs[5]} onChange={e => updateInput(5, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Target FS</label>
              <input type="text" data-testid="input-target-fs" value={inputs[6]} onChange={e => updateInput(6, e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
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
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Factor of Safety (FS)</div>
                <div data-testid="output-fs" className="text-3xl font-black text-blue-800">
                  {result.valid ? formatNum(result.FS) : '—'}
                </div>
              </div>
              <div className={`rounded-2xl p-6 border ${!result.valid ? 'bg-slate-50 border-slate-200' : result.FS >= result.targetFs ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Stability Check (Target {result.valid ? result.targetFs : '—'})</div>
                <div data-testid="output-status" className="flex items-center gap-2 text-lg font-black text-slate-800">
                  {result.valid && (result.FS >= result.targetFs ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />)}
                  <span>{result.valid ? result.statusText : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Cohesion Term</div>
                <div data-testid="output-coh" className="text-2xl font-black text-slate-800">{result.valid ? formatNum(result.cohTerm) : '—'}</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Friction Term</div>
                <div data-testid="output-fric" className="text-2xl font-black text-slate-800">{result.valid ? formatNum(result.fricTerm) : '—'}</div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Infinite-slope planar limit equilibrium: FS = c / (&gamma; &middot; z &middot; sin &beta; &middot; cos &beta;) + (1 &minus; ru / cos&sup2; &beta;) &middot; tan &phi; / tan &beta; (Wikipedia: Slope stability analysis).
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
