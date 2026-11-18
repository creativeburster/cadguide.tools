'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Layers, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';
import { ISO286_RANGES, ISO286_HOLES, ISO286_SHAFTS } from './iso286-data';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parseDia(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 3 && v <= 400 ? v : null;
}

const HOLE_KEYS = Object.keys(ISO286_HOLES);
const SHAFT_KEYS = Object.keys(ISO286_SHAFTS);

export default function LimitsAndFitsCalculatorClient() {
  const [diaStr, setDiaStr] = useState('30');
  const [holeZone, setHoleZone] = useState('H7');
  const [shaftZone, setShaftZone] = useState('g6');
  const [copied, setCopied] = useState(false);

  const dia = parseDia(diaStr);
  const rangeIdx = dia !== null ? ISO286_RANGES.findIndex(([lo, hi]) => dia > lo && dia <= hi) : -1;
  const holePair = rangeIdx >= 0 ? ISO286_HOLES[holeZone]?.[rangeIdx] ?? null : null;
  const shaftPair = rangeIdx >= 0 ? ISO286_SHAFTS[shaftZone]?.[rangeIdx] ?? null : null;

  const isValid = dia !== null && rangeIdx >= 0 && holePair !== null && shaftPair !== null;

  let holeMaxMm: number | null = null;
  let holeMinMm: number | null = null;
  let shaftMaxMm: number | null = null;
  let shaftMinMm: number | null = null;
  let maxClearanceMm: number | null = null;
  let minClearanceMm: number | null = null;
  let fitType = '—';

  if (isValid && dia !== null && holePair !== null && shaftPair !== null) {
    const [hHi, hLo] = holePair;
    const [sHi, sLo] = shaftPair;
    holeMaxMm = dia + hHi / 1000;
    holeMinMm = dia + hLo / 1000;
    shaftMaxMm = dia + sHi / 1000;
    shaftMinMm = dia + sLo / 1000;
    maxClearanceMm = (hHi - sLo) / 1000;
    minClearanceMm = (hLo - sHi) / 1000;
    if (minClearanceMm >= 0) fitType = 'Clearance Fit';
    else if (maxClearanceMm <= 0) fitType = 'Interference Fit';
    else fitType = 'Transition Fit';
  }

  const fmt4 = (n: number | null) => (n !== null && Number.isFinite(n) ? n.toFixed(4) : '—');
  const fmtSigned = (n: number | null) =>
    n !== null && Number.isFinite(n) ? `${n > 0 ? '+' : ''}${n.toFixed(4)}` : '—';

  const applyPreset = (d: string, h: string, s: string) => {
    setDiaStr(d);
    setHoleZone(h);
    setShaftZone(s);
  };

  const handleReset = () => applyPreset('30', 'H7', 'g6');

  const handleCopy = async () => {
    if (!isValid || holeMaxMm === null || holeMinMm === null || shaftMaxMm === null || shaftMinMm === null || maxClearanceMm === null || minClearanceMm === null || holePair === null || shaftPair === null) return;
    const text = [
      `ISO 286 Fit: ${dia} mm ${holeZone}/${shaftZone} (${fitType})`,
      `Hole ${holeZone}: ${holeMinMm.toFixed(4)} to ${holeMaxMm.toFixed(4)} mm (${holePair[1]}/${holePair[0]} um)`,
      `Shaft ${shaftZone}: ${shaftMinMm.toFixed(4)} to ${shaftMaxMm.toFixed(4)} mm (${shaftPair[1]}/${shaftPair[0]} um)`,
      `Clearance (+) / Interference (-): Min ${minClearanceMm.toFixed(4)} mm, Max ${maxClearanceMm.toFixed(4)} mm`,
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
    if (!isValid || holeMaxMm === null || holeMinMm === null || shaftMaxMm === null || shaftMinMm === null || maxClearanceMm === null || minClearanceMm === null || holePair === null || shaftPair === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['nominal_diameter', String(dia), 'mm'],
      ['hole_zone', holeZone, 'iso286'],
      ['shaft_zone', shaftZone, 'iso286'],
      ['fit_classification', fitType, 'type'],
      ['hole_upper_um', String(holePair[0]), 'um'],
      ['hole_lower_um', String(holePair[1]), 'um'],
      ['hole_max_mm', holeMaxMm.toFixed(4), 'mm'],
      ['hole_min_mm', holeMinMm.toFixed(4), 'mm'],
      ['shaft_upper_um', String(shaftPair[0]), 'um'],
      ['shaft_lower_um', String(shaftPair[1]), 'um'],
      ['shaft_max_mm', shaftMaxMm.toFixed(4), 'mm'],
      ['shaft_min_mm', shaftMinMm.toFixed(4), 'mm'],
      ['max_clearance_mm', maxClearanceMm.toFixed(4), 'mm'],
      ['min_clearance_mm', minClearanceMm.toFixed(4), 'mm'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iso286-fit-${dia}mm-${holeZone}-${shaftZone}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">ISO 286 Fit Selection</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-30-h7g6"
                onClick={() => applyPreset('30', 'H7', 'g6')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Sliding Clearance (30 mm H7/g6)
              </button>
              <button
                type="button"
                data-testid="preset-50-h7p6"
                onClick={() => applyPreset('50', 'H7', 'p6')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Press Interference (50 mm H7/p6)
              </button>
              <button
                type="button"
                data-testid="preset-40-h7k6"
                onClick={() => applyPreset('40', 'H7', 'k6')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Transition Fit (40 mm H7/k6)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Nominal Diameter D (mm, 3 &lt; D &le; 400)
              </label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dia"
                value={diaStr}
                onChange={e => setDiaStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Hole Tolerance</label>
                <select
                  data-testid="select-hole"
                  value={holeZone}
                  onChange={e => setHoleZone(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                >
                  {HOLE_KEYS.map(k => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Shaft Tolerance</label>
                <select
                  data-testid="select-shaft"
                  value={shaftZone}
                  onChange={e => setShaftZone(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                >
                  {SHAFT_KEYS.map(k => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Supported ISO 286 lookup range is strictly 3 mm &lt; D &le; 400 mm.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5"
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Fit Classification: <span data-testid="result-fit-type">{fitType}</span>
              </h2>
              <span className="text-xs font-black text-slate-500 uppercase">
                {rangeIdx >= 0 ? `Band: (${ISO286_RANGES[rangeIdx][0]}, ${ISO286_RANGES[rangeIdx][1]}] mm` : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Max Clearance (+) / Interference (-)</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-max-clear">{fmtSigned(maxClearanceMm)}</span>{' '}
                  <span className="text-lg text-blue-600">mm</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  Min: <span data-testid="result-min-clear">{fmtSigned(minClearanceMm)}</span> mm
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Hole Limits ({holeZone})</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-hole-min">{fmt4(holeMinMm)}</span> –{' '}
                  <span data-testid="result-hole-max">{fmt4(holeMaxMm)}</span>{' '}
                  <span className="text-sm text-emerald-600">mm</span>
                </div>
                <div className="text-xs text-emerald-700 mt-1 font-medium">
                  Deviations: {holePair ? `${holePair[1]} / ${holePair[0]} um` : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 sm:col-span-2">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Shaft Limits ({shaftZone})</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-shaft-min">{fmt4(shaftMinMm)}</span> –{' '}
                  <span data-testid="result-shaft-max">{fmt4(shaftMaxMm)}</span>{' '}
                  <span className="text-sm text-orange-600">mm</span>
                </div>
                <div className="text-xs text-orange-700 mt-1 font-medium">
                  Deviations: {shaftPair ? `${shaftPair[1]} / ${shaftPair[0]} um` : '—'}
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
