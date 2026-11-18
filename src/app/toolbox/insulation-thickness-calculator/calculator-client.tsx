'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Thermometer, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const REAL_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseReal(raw: string): number | null {
  const t = raw.trim();
  if (!REAL_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function InsulationThicknessCalculatorClient() {
  const [pipeTempStr, setPipeTempStr] = useState('150');
  const [ambTempStr, setAmbTempStr] = useState('25');
  const [kStr, setKStr] = useState('0.04');
  const [hOutStr, setHOutStr] = useState('10');
  const [qMaxStr, setQMaxStr] = useState('30');
  const [pipeDiaStr, setPipeDiaStr] = useState('100');
  const [copied, setCopied] = useState(false);

  const tPipe = parseReal(pipeTempStr);
  const tAmb = parseReal(ambTempStr);
  const k = parsePos(kStr);
  const hOut = parsePos(hOutStr);
  const qMax = parsePos(qMaxStr);
  const pipeDiaMm = parsePos(pipeDiaStr);

  const isValid =
    tPipe !== null &&
    tAmb !== null &&
    Math.abs(tPipe - tAmb) > 0 &&
    k !== null &&
    hOut !== null &&
    qMax !== null &&
    pipeDiaMm !== null;

  let thickMm: number | null = null;
  let outerDiaMm: number | null = null;
  let surfaceTemp: number | null = null;
  let actualQ: number | null = null;

  if (isValid && tPipe !== null && tAmb !== null && k !== null && hOut !== null && qMax !== null && pipeDiaMm !== null) {
    const r1 = pipeDiaMm / 2000;
    const dT = Math.abs(tPipe - tAmb);

    const rLin = (tM: number) => {
      const r2 = r1 + tM;
      const cond = tM > 0 ? Math.log(r2 / r1) / (2 * Math.PI * k) : 0;
      const conv = 1 / (2 * Math.PI * r2 * hOut);
      return cond + conv;
    };

    const qBare = dT / rLin(0);
    let tSolved = 0;

    if (qBare > qMax) {
      const rCrit = k / hOut;
      let low = Math.max(0, rCrit - r1);
      let high = Math.max(low + 0.05, 0.05);
      for (let i = 0; i < 60; i += 1) {
        if (dT / rLin(high) <= qMax) break;
        high *= 2;
      }
      for (let i = 0; i < 80; i += 1) {
        const mid = 0.5 * (low + high);
        if (dT / rLin(mid) > qMax) {
          low = mid;
        } else {
          high = mid;
        }
      }
      tSolved = 0.5 * (low + high);
    }

    const rTotal = rLin(tSolved);
    const r2Solved = r1 + tSolved;
    const rConv = 1 / (2 * Math.PI * r2Solved * hOut);
    thickMm = tSolved * 1000;
    outerDiaMm = pipeDiaMm + 2 * thickMm;
    actualQ = dT / rTotal;
    surfaceTemp = tAmb + (tPipe - tAmb) * (rConv / rTotal);
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (tp: string, ta: string, kv: string, h: string, q: string, d: string) => {
    setPipeTempStr(tp);
    setAmbTempStr(ta);
    setKStr(kv);
    setHOutStr(h);
    setQMaxStr(q);
    setPipeDiaStr(d);
  };

  const handleReset = () => applyPreset('150', '25', '0.04', '10', '30', '100');

  const handleCopy = async () => {
    if (!isValid || thickMm === null || surfaceTemp === null || actualQ === null || outerDiaMm === null) return;
    const text = [
      'Cylindrical Pipe Insulation Thickness Summary',
      `Pipe OD: ${pipeDiaMm} mm, T_pipe: ${tPipe} C, T_amb: ${tAmb} C, Target Q_max: ${qMax} W/m`,
      `Required Insulation Thickness: ${thickMm.toFixed(2)} mm (Outer OD: ${outerDiaMm.toFixed(2)} mm)`,
      `Cladding Surface Temp: ${surfaceTemp.toFixed(2)} C, Heat Loss: ${actualQ.toFixed(2)} W/m`,
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
    if (!isValid || thickMm === null || surfaceTemp === null || actualQ === null || outerDiaMm === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['pipe_temp_c', String(tPipe), 'C'],
      ['ambient_temp_c', String(tAmb), 'C'],
      ['insulation_k', String(k), 'W/mK'],
      ['surface_h_out', String(hOut), 'W/m2K'],
      ['max_heat_loss_w_m', String(qMax), 'W/m'],
      ['pipe_od_mm', String(pipeDiaMm), 'mm'],
      ['required_thickness_mm', thickMm.toFixed(4), 'mm'],
      ['insulated_od_mm', outerDiaMm.toFixed(4), 'mm'],
      ['surface_temp_c', surfaceTemp.toFixed(3), 'C'],
      ['solved_heat_loss_w_m', actualQ.toFixed(4), 'W/m'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipe-insulation-thickness.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Thermometer className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Pipe &amp; Heat Loss Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-steam-100mm"
                onClick={() => applyPreset('150', '25', '0.04', '10', '30', '100')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Steam Line (150 C, 100 mm OD, 30 W/m)
              </button>
              <button
                type="button"
                data-testid="preset-chilled-50mm"
                onClick={() => applyPreset('7', '30', '0.035', '8', '12', '50')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Chilled Water Pipe (7 C, 50 mm OD, 12 W/m)
              </button>
              <button
                type="button"
                data-testid="preset-process-250mm"
                onClick={() => applyPreset('240', '20', '0.045', '12', '55', '250')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Hot Process Header (240 C, 250 mm OD)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pipe Temp (C)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tpipe"
                  value={pipeTempStr}
                  onChange={e => setPipeTempStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Ambient (C)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tamb"
                  value={ambTempStr}
                  onChange={e => setAmbTempStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">k (W/mK)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-k"
                  value={kStr}
                  onChange={e => setKStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">h_out (W/m2K)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-hout"
                  value={hOutStr}
                  onChange={e => setHOutStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Max Loss (W/m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-qmax"
                  value={qMaxStr}
                  onChange={e => setQMaxStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">Pipe OD (mm)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-dia"
                  value={pipeDiaStr}
                  onChange={e => setPipeDiaStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure T_pipe != T_amb, and k, h_out, Q_max, pipe OD are strictly positive numbers.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center justify-center gap-1.5"
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
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Cylindrical Radial Conduction Solver</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                R_lin(t) = ln((r1 + t)/r1) / (2*pi*k) + 1 / (2*pi*(r1 + t)*h_out), bisection root solver
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Insulation Thickness</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-thickness">{fmt(thickMm, 2)}</span>{' '}
                  <span className="text-lg text-blue-600">mm</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Outer Surface Temp</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-surface-temp">{fmt(surfaceTemp, 2)}</span>{' '}
                  <span className="text-lg text-emerald-600">C</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Insulated Outer Diameter</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-outer-dia">{fmt(outerDiaMm, 2)}</span>{' '}
                  <span className="text-lg text-orange-600">mm</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Actual Linear Heat Loss</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-heat-loss">{fmt(actualQ, 2)}</span>{' '}
                  <span className="text-lg text-purple-600">W/m</span>
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
