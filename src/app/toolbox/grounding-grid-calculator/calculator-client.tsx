'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'standard', label: 'Standard Substation (100 ohm-m, 40x30m, 380m)', rho: '100', length: '40', width: '30', depth: '0.8', lt: '380' },
  { id: 'dense-grid', label: 'Dense Mesh Low Rho (50 ohm-m, 50x40m, 900m)', rho: '50', length: '50', width: '40', depth: '0.8', lt: '900' },
  { id: 'high-rho', label: 'High Resistivity Soil (300 ohm-m, 30x25m, 300m)', rho: '300', length: '30', width: '25', depth: '0.6', lt: '300' },
];

export default function CalculatorClient() {
  const [rhoStr, setRhoStr] = useState('100');
  const [lengthStr, setLengthStr] = useState('40');
  const [widthStr, setWidthStr] = useState('30');
  const [depthStr, setDepthStr] = useState('0.8');
  const [ltStr, setLtStr] = useState('380');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setRhoStr(p.rho);
    setLengthStr(p.length);
    setWidthStr(p.width);
    setDepthStr(p.depth);
    setLtStr(p.lt);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const rho = parseStrictPositive(rhoStr);
    const l = parseStrictPositive(lengthStr);
    const w = parseStrictPositive(widthStr);
    const h = parseStrictPositive(depthStr);
    const lt = parseStrictPositive(ltStr);

    if (!Number.isFinite(rho) || !Number.isFinite(l) || !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(lt)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive numbers (> 0) for soil resistivity, grid dimensions, burial depth, and total buried conductor length.',
      };
    }

    const area = l * w;
    const req = Math.sqrt(area / Math.PI);
    // Sverak substation grounding mesh resistance equation
    const term1 = 1 / lt;
    const sqrt20OverA = Math.sqrt(20 / area);
    const term2 = (1 / Math.sqrt(20 * area)) * (1 + 1 / (1 + h * sqrt20OverA));
    const rg = rho * (term1 + term2);
    const density = lt / area;
    const pass = rg <= 1.0;

    return {
      valid: true as const,
      rho,
      l,
      w,
      h,
      lt,
      area,
      req,
      rg,
      density,
      pass,
      statusText: pass ? 'WITHIN 1.0 OHM TARGET' : 'EXCEEDS 1.0 OHM TARGET: ADD RODS OR CONDUCTOR',
    };
  }, [rhoStr, lengthStr, widthStr, depthStr, ltStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Substation Grounding Grid Resistance Summary (Sverak Equation)',
      `Soil Resistivity = ${result.rho} ohm-m, Grid = ${result.l} m x ${result.w} m (Area = ${result.area.toFixed(0)} m2)`,
      `Burial Depth h = ${result.h} m, Total Buried Length L_t = ${result.lt} m`,
      `Grid Resistance R_g = ${result.rg.toFixed(2)} ohm`,
      `Equivalent Radius = ${result.req.toFixed(2)} m`,
      `Conductor Density L_t/A = ${result.density.toFixed(3)} m/m2`,
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
      ['Soil Resistivity rho', String(result.rho), 'ohm-m'],
      ['Grid Length L', String(result.l), 'm'],
      ['Grid Width W', String(result.w), 'm'],
      ['Burial Depth h', String(result.h), 'm'],
      ['Total Buried Conductor Length L_t', String(result.lt), 'm'],
      ['Earth Mat Area A', result.area.toFixed(2), 'm2'],
      ['Equivalent Circle Radius r_eq', result.req.toFixed(4), 'm'],
      ['Conductor Density Ratio L_t/A', result.density.toFixed(4), 'm/m2'],
      ['Ground Grid Resistance R_g', result.rg.toFixed(4), 'ohm'],
      ['Target Check (<= 1.0 ohm)', result.statusText, '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grounding-grid-resistance.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Uniform soil resistivity model</p>
            </div>
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Soil Resistivity rho (ohm-m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rho"
                value={rhoStr}
                onChange={(e) => setRhoStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Grid Length L (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-length"
                value={lengthStr}
                onChange={(e) => setLengthStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Grid Width W (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-width"
                value={widthStr}
                onChange={(e) => setWidthStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Burial Depth h (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-depth"
                value={depthStr}
                onChange={(e) => setDepthStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Total Buried Conductor Length L_t (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-lt"
                value={ltStr}
                onChange={(e) => setLtStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-error" className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm font-bold text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div
                data-testid="result-status"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                  !result.valid
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : result.pass
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {result.valid && result.pass ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{result.valid ? result.statusText : 'Awaiting Valid Inputs'}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                Ground Grid Resistance (R_g)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-rg" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.rg.toFixed(2) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-600">ohm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Earth Mat Area</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-area">{result.valid ? result.area.toFixed(0) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m2</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Equivalent Radius</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-req">{result.valid ? result.req.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Conductor Density</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-density">{result.valid ? result.density.toFixed(3) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m/m2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Sverak Grid Resistance Equation &amp; Scope</h3>
                <p className="text-xs text-slate-500 font-medium">Uniform-soil substation mesh approximation</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 font-mono font-medium leading-relaxed break-words">
                {'R_g = rho * [ 1/L_t + (1 / sqrt(20*A)) * (1 + 1 / (1 + h * sqrt(20/A))) ]'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This calculation estimates low-frequency earth resistance R_g assuming uniform soil resistivity rho. Detailed substation design also requires two-layer soil testing, fault current split verification, and touch/step voltage evaluation using dedicated grounding software.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
