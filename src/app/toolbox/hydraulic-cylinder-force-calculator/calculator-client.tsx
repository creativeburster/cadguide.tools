'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download, Gauge, RotateCcw, Copy, Check, AlertTriangle } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS: { id: string; label: string; unit: UnitSystem; bore: string; rod: string; press: string }[] = [
  { id: 'metric-80', label: '80mm Bore / 40mm Rod @ 200 bar', unit: 'metric', bore: '80', rod: '40', press: '200' },
  { id: 'metric-125', label: '125mm Bore / 70mm Rod @ 160 bar', unit: 'metric', bore: '125', rod: '70', press: '160' },
  { id: 'imperial-3in', label: '3 in Bore / 1.5 in Rod @ 2500 psi', unit: 'imperial', bore: '3', rod: '1.5', press: '2500' },
];

export default function HydraulicCylinderClient() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [boreStr, setBoreStr] = useState('80');
  const [rodStr, setRodStr] = useState('40');
  const [pressStr, setPressStr] = useState('200');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setUnit(p.unit);
    setBoreStr(p.bore);
    setRodStr(p.rod);
    setPressStr(p.press);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const switchUnit = (nextUnit: UnitSystem) => {
    if (nextUnit === unit) return;
    setUnit(nextUnit);
    if (nextUnit === 'imperial') {
      setBoreStr('3');
      setRodStr('1.5');
      setPressStr('2500');
    } else {
      setBoreStr('80');
      setRodStr('40');
      setPressStr('200');
    }
    setCopied(false);
  };

  const result = useMemo(() => {
    const bore = parseStrictPositive(boreStr);
    const rod = parseStrictNonNegative(rodStr);
    const press = parseStrictNonNegative(pressStr);

    if (!Number.isFinite(bore) || !Number.isFinite(rod) || !Number.isFinite(press)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive bore diameter (> 0) and non-negative rod diameter and pressure.',
      };
    }

    if (rod >= bore) {
      return {
        valid: false as const,
        errorMsg: `Rod diameter (${rod}) must be strictly smaller than bore diameter (${bore}).`,
      };
    }

    if (unit === 'metric') {
      const fullAreaMm2 = (Math.PI * bore * bore) / 4;
      const rodAreaMm2 = (Math.PI * rod * rod) / 4;
      const annAreaMm2 = fullAreaMm2 - rodAreaMm2;
      // 1 bar = 0.1 MPa = 0.1 N/mm2
      const pushN = press * 0.1 * fullAreaMm2;
      const pullN = press * 0.1 * annAreaMm2;
      const pushKn = pushN / 1000;
      const pullKn = pullN / 1000;
      const reductionPct = (1 - annAreaMm2 / fullAreaMm2) * 100;

      return {
        valid: true as const,
        bore,
        rod,
        press,
        fullAreaDisplay: fullAreaMm2 / 100, // cm2
        fullAreaMm2,
        annAreaDisplay: annAreaMm2 / 100, // cm2
        annAreaMm2,
        pushMain: pushKn,
        pullMain: pullKn,
        forceUnit: 'kN',
        areaUnit: 'cm2',
        reductionPct,
      };
    }

    const fullAreaIn2 = (Math.PI * bore * bore) / 4;
    const rodAreaIn2 = (Math.PI * rod * rod) / 4;
    const annAreaIn2 = fullAreaIn2 - rodAreaIn2;
    const pushLbf = press * fullAreaIn2;
    const pullLbf = press * annAreaIn2;
    const reductionPct = (1 - annAreaIn2 / fullAreaIn2) * 100;

    return {
      valid: true as const,
      bore,
      rod,
      press,
      fullAreaDisplay: fullAreaIn2,
      fullAreaMm2: fullAreaIn2 * 645.16,
      annAreaDisplay: annAreaIn2,
      annAreaMm2: annAreaIn2 * 645.16,
      pushMain: pushLbf,
      pullMain: pullLbf,
      forceUnit: 'lbf',
      areaUnit: 'in2',
      reductionPct,
    };
  }, [unit, boreStr, rodStr, pressStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Hydraulic Cylinder Force (${unit === 'metric' ? `${result.bore}/${result.rod} mm @ ${result.press} bar` : `${result.bore}/${result.rod} in @ ${result.press} psi`})`,
      `Push Force = ${result.pushMain.toFixed(2)} ${result.forceUnit}`,
      `Pull Force = ${result.pullMain.toFixed(2)} ${result.forceUnit} (${result.reductionPct.toFixed(1)}% area reduction)`,
      `Full Piston Area = ${result.fullAreaDisplay.toFixed(2)} ${result.areaUnit} | Annulus Area = ${result.annAreaDisplay.toFixed(2)} ${result.areaUnit}`,
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
      ['Unit System', unit, '-'],
      ['Bore Diameter', String(result.bore), unit === 'metric' ? 'mm' : 'in'],
      ['Rod Diameter', String(result.rod), unit === 'metric' ? 'mm' : 'in'],
      ['Operating Pressure', String(result.press), unit === 'metric' ? 'bar' : 'psi'],
      ['Full Piston Area', result.fullAreaDisplay.toFixed(4), result.areaUnit],
      ['Annulus Area', result.annAreaDisplay.toFixed(4), result.areaUnit],
      ['Push Force', result.pushMain.toFixed(4), result.forceUnit],
      ['Pull Force', result.pullMain.toFixed(4), result.forceUnit],
      ['Retraction Area Reduction', result.reductionPct.toFixed(2), '%'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hydraulic-cylinder-force.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameters</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Unit System</label>
            <div className="grid grid-cols-2 gap-2">
              {(['metric', 'imperial'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  data-testid={`btn-unit-${u}`}
                  onClick={() => switchUnit(u)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    unit === u ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {u === 'metric' ? 'Metric (mm, bar)' : 'Imperial (in, psi)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Bore Diameter ({unit === 'metric' ? 'mm' : 'in'})
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-bore"
              value={boreStr}
              onChange={(e) => setBoreStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Rod Diameter ({unit === 'metric' ? 'mm' : 'in'})
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-rod"
              value={rodStr}
              onChange={(e) => setRodStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Pressure ({unit === 'metric' ? 'bar' : 'psi'})
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-pressure"
              value={pressStr}
              onChange={(e) => setPressStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Gauge className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Theoretical Cylinder Thrust</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {!result.valid && (
              <div
                data-testid="validation-error"
                className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Push Force (Extension)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-push">{result.valid ? result.pushMain.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">{unit === 'metric' ? 'kN' : 'lbf'}</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Pull Force (Retraction)</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-pull">{result.valid ? result.pullMain.toFixed(2) : '—'}</span>
                  <span className="text-base font-bold text-orange-500 ml-1.5">{unit === 'metric' ? 'kN' : 'lbf'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Full Piston Area</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-full-area">{result.valid ? result.fullAreaDisplay.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">{unit === 'metric' ? 'cm2' : 'in2'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Annulus Area</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-annulus-area">{result.valid ? result.annAreaDisplay.toFixed(2) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">{unit === 'metric' ? 'cm2' : 'in2'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Pull Force Reduction</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-reduction">{result.valid ? result.reductionPct.toFixed(1) : '—'}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Push F = P * pi * D^2 / 4 · Pull F = P * pi * (D^2 - d^2) / 4 (theoretical lossless force excluding seal friction and backpressure)
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
