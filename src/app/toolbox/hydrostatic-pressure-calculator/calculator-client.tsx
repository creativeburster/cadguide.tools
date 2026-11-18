'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictNonNegative(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'freshwater-10m', label: 'Freshwater 10m Depth (rho=1000 kg/m3)', rho: '1000', h: '10', g: '9.80665', patm: '101.325' },
  { id: 'seawater-50m', label: 'Seawater 50m Depth (rho=1025 kg/m3)', rho: '1025', h: '50', g: '9.80665', patm: '101.325' },
  { id: 'oil-4m', label: 'Hydraulic Oil 4m Head (rho=860 kg/m3)', rho: '860', h: '4', g: '9.80665', patm: '101.325' },
];

export default function HydrostaticPressureCalculatorClient() {
  const [rhoStr, setRhoStr] = useState('1000');
  const [hStr, setHStr] = useState('10');
  const [gStr, setGStr] = useState('9.80665');
  const [patmStr, setPatmStr] = useState('101.325');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setRhoStr(p.rho);
    setHStr(p.h);
    setGStr(p.g);
    setPatmStr(p.patm);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const rho = parseStrictPositive(rhoStr);
    const h = parseStrictNonNegative(hStr);
    const g = parseStrictPositive(gStr);
    const patm = parseStrictNonNegative(patmStr);

    if (!Number.isFinite(rho) || !Number.isFinite(h) || !Number.isFinite(g) || !Number.isFinite(patm)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive fluid density (> 0) and gravity (> 0), and non-negative depth and surface pressure.',
      };
    }

    const pGaugeKpa = (rho * g * h) / 1000;
    const pBar = pGaugeKpa / 100;
    const pAbsKpa = patm + pGaugeKpa;
    const forceOn1m2Kn = pGaugeKpa;

    return {
      valid: true as const,
      rho,
      h,
      g,
      patm,
      pGaugeKpa,
      pBar,
      pAbsKpa,
      forceOn1m2Kn,
    };
  }, [rhoStr, hStr, gStr, patmStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Hydrostatic Pressure Summary (rho=${result.rho} kg/m3, h=${result.h} m, g=${result.g} m/s2)`,
      `Gauge Pressure = ${result.pGaugeKpa.toFixed(3)} kPa (${result.pBar.toFixed(4)} bar)`,
      `Absolute Pressure = ${result.pAbsKpa.toFixed(3)} kPa`,
      `Normal Force on 1 m2 Plate = ${result.forceOn1m2Kn.toFixed(3)} kN`,
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
      ['Fluid Density rho', String(result.rho), 'kg/m3'],
      ['Submergence Depth h', String(result.h), 'm'],
      ['Gravitational Acceleration g', String(result.g), 'm/s2'],
      ['Surface Pressure P_atm', String(result.patm), 'kPa'],
      ['Gauge Hydrostatic Pressure', result.pGaugeKpa.toFixed(4), 'kPa'],
      ['Gauge Pressure (bar)', result.pBar.toFixed(6), 'bar'],
      ['Absolute Pressure', result.pAbsKpa.toFixed(4), 'kPa'],
      ['Force on 1 m2 Surface', result.forceOn1m2Kn.toFixed(4), 'kN'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hydrostatic-pressure.csv';
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
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Fluid Density rho (kg/m3)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-rho"
              value={rhoStr}
              onChange={(e) => setRhoStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Fluid Depth h (m)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-depth"
              value={hStr}
              onChange={(e) => setHStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Gravity g (m/s2)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-g"
                value={gStr}
                onChange={(e) => setGStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Surface P_atm (kPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-patm"
                value={patmStr}
                onChange={(e) => setPatmStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800"
              />
            </div>
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
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Hydrostatic Pressure Results</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white cursor-pointer"
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Gauge Pressure (rho*g*h)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-pkpa">{result.valid ? result.pGaugeKpa.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">kPa</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Gauge Pressure (bar)</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-pbar">{result.valid ? result.pBar.toFixed(4) : '—'}</span>
                  <span className="text-base font-bold text-emerald-600 ml-1.5">bar</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Absolute Pressure</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-pabs">{result.valid ? result.pAbsKpa.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-orange-500 ml-1.5">kPa</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Hydrostatic Force on 1 m2</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-force">{result.valid ? result.forceOn1m2Kn.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-slate-500 ml-1.5">kN</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  P_gauge = rho * g * h (incompressible fluid) · P_abs = P_atm + P_gauge · NIST SP 811 standard gravity g_n = 9.80665 m/s2
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
