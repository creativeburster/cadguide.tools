'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type MaterialKey = 'carbon_steel' | 'alloy_steel' | 'aluminum';
type TreatmentKey = 'hardening' | 'tempering' | 'annealing';

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

const MATERIAL_FACTORS: Record<MaterialKey, { label: string; soakMinPerMm: number }> = {
  carbon_steel: { label: 'Plain Carbon Steel', soakMinPerMm: 1.2 },
  alloy_steel: { label: 'Low Alloy Steel', soakMinPerMm: 1.5 },
  aluminum: { label: 'Aluminum Alloy', soakMinPerMm: 0.8 },
};

const TREATMENT_COOLING: Record<TreatmentKey, { label: string; cool: string }> = {
  hardening: { label: 'Austenitize & Quench (Hardening)', cool: 'Oil / Water Quench' },
  tempering: { label: 'Tempering', cool: 'Still Air Cool' },
  annealing: { label: 'Full Annealing', cool: 'Slow Furnace Cool' },
};

const PRESETS: { id: string; label: string; thickness: string; mat: MaterialKey; treat: TreatmentKey }[] = [
  { id: 'carbon50', label: '50mm Carbon Steel (Hardening)', thickness: '50', mat: 'carbon_steel', treat: 'hardening' },
  { id: 'alloy80', label: '80mm Low Alloy Steel (Annealing)', thickness: '80', mat: 'alloy_steel', treat: 'annealing' },
  { id: 'alu40', label: '40mm Aluminum Alloy (Tempering)', thickness: '40', mat: 'aluminum', treat: 'tempering' },
];

export default function HeatTreatmentTimeCalculatorClient() {
  const [thickStr, setThickStr] = useState('50');
  const [material, setMaterial] = useState<MaterialKey>('carbon_steel');
  const [treatment, setTreatment] = useState<TreatmentKey>('hardening');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setThickStr(p.thickness);
    setMaterial(p.mat);
    setTreatment(p.treat);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const thickness = parseStrictPositive(thickStr);
    if (!Number.isFinite(thickness)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive ruling section thickness (> 0 mm).',
      };
    }

    const matSpec = MATERIAL_FACTORS[material];
    const treatSpec = TREATMENT_COOLING[treatment];
    const soakTimeMin = thickness * matSpec.soakMinPerMm;
    const heatTimeMin = thickness * 2.0;
    const totalTimeMin = soakTimeMin + heatTimeMin;

    return {
      valid: true as const,
      thickness,
      matLabel: matSpec.label,
      factor: matSpec.soakMinPerMm,
      treatLabel: treatSpec.label,
      coolMethod: treatSpec.cool,
      soakTimeMin,
      heatTimeMin,
      totalTimeMin,
    };
  }, [thickStr, material, treatment]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Heat Treatment Workshop Time Estimate',
      `Section Thickness = ${result.thickness} mm, Material = ${result.matLabel}, Process = ${result.treatLabel}`,
      `Estimated Heating-Through Time = ${result.heatTimeMin.toFixed(1)} min`,
      `Soaking Time (${result.factor} min/mm) = ${result.soakTimeMin.toFixed(1)} min`,
      `Total Furnace Time (Heat + Soak) = ${result.totalTimeMin.toFixed(1)} min`,
      `Cooling Method = ${result.coolMethod}`,
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
      ['Ruling Section Thickness', String(result.thickness), 'mm'],
      ['Material Group', result.matLabel, '-'],
      ['Soak Time Factor', String(result.factor), 'min/mm'],
      ['Treatment Process', result.treatLabel, '-'],
      ['Estimated Heating Time', result.heatTimeMin.toFixed(2), 'min'],
      ['Estimated Soaking Time', result.soakTimeMin.toFixed(2), 'min'],
      ['Total Furnace Time', result.totalTimeMin.toFixed(2), 'min'],
      ['Cooling Method', result.coolMethod, '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heat-treatment-time.csv';
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Section Thickness (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-thickness"
                value={thickStr}
                onChange={(e) => setThickStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Material</label>
              <select
                data-testid="select-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value as MaterialKey)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
              >
                <option value="carbon_steel">Plain Carbon Steel (1.2 min/mm)</option>
                <option value="alloy_steel">Low Alloy Steel (1.5 min/mm)</option>
                <option value="aluminum">Aluminum Alloy (0.8 min/mm)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Treatment</label>
              <select
                data-testid="select-treatment"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value as TreatmentKey)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all cursor-pointer"
              >
                <option value="hardening">Austenitize &amp; Quench (Hardening)</option>
                <option value="tempering">Tempering (Still Air Cool)</option>
                <option value="annealing">Full Annealing (Furnace Cool)</option>
              </select>
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
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-40 cursor-pointer"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Soaking Time</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-soak">{result.valid ? result.soakTimeMin.toFixed(1) : '—'}</span>
                  <span className="text-lg text-blue-500"> min</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Estimated Heating Time</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-heat">{result.valid ? result.heatTimeMin.toFixed(1) : '—'}</span>
                  <span className="text-lg text-green-600"> min</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Total Furnace Time</div>
                <div className="text-3xl font-black text-purple-800">
                  <span data-testid="result-total">{result.valid ? result.totalTimeMin.toFixed(1) : '—'}</span>
                  <span className="text-lg text-purple-500"> min</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Cooling Method</div>
                <div data-testid="result-cool" className="text-2xl font-black text-orange-800">
                  {result.valid ? result.coolMethod : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'t_soak = thickness * factor | t_heat = 2.0 * thickness | t_total = t_heat + t_soak'}</span>
              </div>
              <p className="text-xs text-slate-500">
                Workshop rule-of-thumb estimate for single sections. Actual soak cycles depend on furnace loading density, atmosphere thermal conductivity, and alloy-specific TTT/CCT transformation specifications.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
