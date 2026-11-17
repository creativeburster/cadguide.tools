'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

type HazardType = 'light' | 'ordinary' | 'extra';
type UnitSystem = 'metric' | 'imperial';

// Verified against NFPA 13 (2002-2019 editions) Standard Spray Pendent & Upright Hydraulically Calculated:
// Light Hazard (unobstructed / noncombustible): 225 sqft (20.9 m2), max spacing 15 ft (4.6 m)
// Ordinary Hazard: 130 sqft (12.1 m2), max spacing 15 ft (4.6 m)
// Extra Hazard (Hydraulically Calculated, Density > 0.25): 100 sqft (9.3 m2), max spacing 12 ft (3.7 m)
const HAZARD_PRESETS: Record<
  HazardType,
  { name: string; maxAreaM2: number; maxSpacingM: number; maxAreaFt2: number; maxSpacingFt: number }
> = {
  light: { name: 'Light Hazard (Hydraulically Calculated)', maxAreaM2: 20.9, maxSpacingM: 4.6, maxAreaFt2: 225, maxSpacingFt: 15 },
  ordinary: { name: 'Ordinary Hazard (Hydraulically Calculated)', maxAreaM2: 12.1, maxSpacingM: 4.6, maxAreaFt2: 130, maxSpacingFt: 15 },
  extra: { name: 'Extra Hazard (Density > 0.25)', maxAreaM2: 9.3, maxSpacingM: 3.7, maxAreaFt2: 100, maxSpacingFt: 12 },
};

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function FireSprinklerCoverageCalculatorClient() {
  const [roomLengthStr, setRoomLengthStr] = useState('30');
  const [roomWidthStr, setRoomWidthStr] = useState('20');
  const [hazardType, setHazardType] = useState<HazardType>('light');
  const [spacingStr, setSpacingStr] = useState('4.0');
  const [branchStr, setBranchStr] = useState('4.0');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [copied, setCopied] = useState(false);

  const switchUnit = (nextUnit: UnitSystem) => {
    setUnit(nextUnit);
    if (nextUnit === 'metric') {
      setRoomLengthStr('30');
      setRoomWidthStr('20');
      setSpacingStr('4.0');
      setBranchStr('4.0');
    } else {
      setRoomLengthStr('100');
      setRoomWidthStr('60');
      setSpacingStr('13');
      setBranchStr('10');
    }
    setCopied(false);
  };

  const resetDefaults = () => {
    setHazardType('light');
    switchUnit('metric');
  };

  const result = useMemo(() => {
    const L = parseStrictPositive(roomLengthStr);
    const W = parseStrictPositive(roomWidthStr);
    const S = parseStrictPositive(spacingStr);
    const B = parseStrictPositive(branchStr);
    const preset = HAZARD_PRESETS[hazardType];

    if (!Number.isFinite(L) || !Number.isFinite(W) || !Number.isFinite(S) || !Number.isFinite(B)) {
      return { valid: false as const };
    }

    const maxArea = unit === 'metric' ? preset.maxAreaM2 : preset.maxAreaFt2;
    const maxSpacing = unit === 'metric' ? preset.maxSpacingM : preset.maxSpacingFt;
    const maxWallDist = maxSpacing / 2;

    const roomArea = L * W;
    const coveragePerHead = S * B;
    const areaHeadsNeeded = Math.ceil(roomArea / coveragePerHead);
    const nx = Math.ceil(L / S);
    const ny = Math.ceil(W / B);
    const gridHeadsNeeded = nx * ny;

    const spacingOK = S <= maxSpacing && B <= maxSpacing;
    const coverageOK = coveragePerHead <= maxArea;
    const compliant = spacingOK && coverageOK;

    return {
      valid: true as const,
      L,
      W,
      S,
      B,
      preset,
      maxArea,
      maxSpacing,
      maxWallDist,
      roomArea,
      coveragePerHead,
      areaHeadsNeeded,
      nx,
      ny,
      gridHeadsNeeded,
      spacingOK,
      coverageOK,
      compliant,
    };
  }, [roomLengthStr, roomWidthStr, hazardType, spacingStr, branchStr, unit]);

  const u = unit === 'metric' ? 'm' : 'ft';
  const u2 = unit === 'metric' ? 'm2' : 'ft2';

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `NFPA 13 Fire Sprinkler Coverage & Spacing Check (${result.preset.name})`,
      `Room: ${result.L} x ${result.W} ${u} (Area=${result.roomArea.toFixed(2)} ${u2})`,
      `Grid Spacing: ${result.S} x ${result.B} ${u} -> Coverage/Head = ${result.coveragePerHead.toFixed(2)} ${u2} (Max ${result.maxArea} ${u2})`,
      `Grid Layout: ${result.nx} x ${result.ny} = ${result.gridHeadsNeeded} heads`,
      `Status: ${result.compliant ? 'COMPLIANT' : 'EXCEEDS NFPA 13 LIMIT'}`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Hazard Class', result.preset.name, '-'],
      ['Unit System', unit, '-'],
      ['Room Area', result.roomArea.toFixed(2), u2],
      ['Coverage per Sprinkler', result.coveragePerHead.toFixed(2), u2],
      ['Max Allowable Coverage', String(result.maxArea), u2],
      ['Max Allowable Spacing', String(result.maxSpacing), u],
      ['Max Distance to Wall', result.maxWallDist.toFixed(2), u],
      ['Grid Sprinkler Count (Nx x Ny)', String(result.gridHeadsNeeded), 'heads'],
      ['Theoretical Area Count', String(result.areaHeadsNeeded), 'heads'],
      ['Compliance Status', result.compliant ? 'COMPLIANT' : 'EXCEEDS LIMIT', '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fire-sprinkler-coverage.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Enter strictly positive values (&gt; 0) for room dimensions and sprinkler spacing.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
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
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="unit-metric"
              onClick={() => switchUnit('metric')}
              className={`flex-1 py-2 rounded-xl text-xs font-black ${unit === 'metric' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Metric (m / m2)
            </button>
            <button
              type="button"
              data-testid="unit-imperial"
              onClick={() => switchUnit('imperial')}
              className={`flex-1 py-2 rounded-xl text-xs font-black ${unit === 'imperial' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Imperial (ft / ft2)
            </button>
          </div>

          <div>
            <label htmlFor="select-hazard" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Hazard Classification
            </label>
            <select
              id="select-hazard"
              data-testid="select-hazard"
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value as HazardType)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
            >
              {Object.entries(HAZARD_PRESETS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-length" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Room L ({u})
              </label>
              <input
                id="input-length"
                data-testid="input-length"
                type="text"
                value={roomLengthStr}
                onChange={(e) => setRoomLengthStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="input-width" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Room W ({u})
              </label>
              <input
                id="input-width"
                data-testid="input-width"
                type="text"
                value={roomWidthStr}
                onChange={(e) => setRoomWidthStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-spacing" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Sprinkler Spacing S ({u})
            </label>
            <input
              id="input-spacing"
              data-testid="input-spacing"
              type="text"
              value={spacingStr}
              onChange={(e) => setSpacingStr(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-branch" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Branch Line Distance B ({u})
            </label>
            <input
              id="input-branch"
              data-testid="input-branch"
              type="text"
              value={branchStr}
              onChange={(e) => setBranchStr(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Spacing & Layout Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Room Area</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-room-area">{result.valid ? result.roomArea.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-blue-500">{u2}</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Coverage/Head</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-coverage">{result.valid ? result.coveragePerHead.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-emerald-500">{u2}</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Grid Heads</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-grid-heads">{result.valid ? String(result.gridHeadsNeeded) : '—'}</span>{' '}
                  <span className="text-xs text-orange-500">heads</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Max Wall Dist</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-max-wall">{result.valid ? result.maxWallDist.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">{u}</span>
                </div>
              </div>
            </div>

            {result.valid && (
              <div className="space-y-2.5">
                <div
                  data-testid="status-coverage"
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold ${
                    result.coverageOK ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {result.coverageOK ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>
                    Coverage/Head: {result.coveragePerHead.toFixed(2)} {u2} vs max {result.maxArea} {u2} — {result.coverageOK ? 'PASS' : 'EXCEEDS LIMIT'}
                  </span>
                </div>
                <div
                  data-testid="status-spacing"
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-bold ${
                    result.spacingOK ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {result.spacingOK ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>
                    Linear Spacing: max(S, B) = {Math.max(result.S, result.B).toFixed(2)} {u} vs max {result.maxSpacing} {u} — {result.spacingOK ? 'PASS' : 'EXCEEDS LIMIT'}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                NFPA 13 Hydraulically Calculated Standard Spray (Unobstructed): Light Hazard max 225 ft2 (20.9 m2) / 15 ft (4.6 m); Ordinary Hazard max 130 ft2 (12.1 m2) / 15 ft (4.6 m); Extra Hazard (Density &gt; 0.25) max 100 ft2 (9.3 m2) / 12 ft (3.7 m). Obstructed or combustible construction can tighten limits.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
