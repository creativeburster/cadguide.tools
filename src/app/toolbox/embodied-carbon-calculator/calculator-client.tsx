'use client';

import React, { useState, useMemo } from 'react';
import { Leaf, Copy, Check, Download, RotateCcw, AlertTriangle, Info } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

interface PresetSpec {
  id: string;
  label: string;
  gfa: string;
  concVol: string;
  concEf: string;
  rebarWt: string;
  rebarEf: string;
  steelWt: string;
  steelEf: string;
  glazingArea: string;
  glazingEf: string;
}

const PRESETS: PresetSpec[] = [
  {
    id: 'default',
    label: 'Default RC Frame (2,500 m2)',
    gfa: '2500',
    concVol: '850',
    concEf: '320',
    rebarWt: '85',
    rebarEf: '1400',
    steelWt: '45',
    steelEf: '1800',
    glazingArea: '650',
    glazingEf: '65',
  },
  {
    id: 'low-carbon-scm',
    label: 'SCM Concrete Mix (190 kgCO2e/m3)',
    gfa: '2500',
    concVol: '850',
    concEf: '190',
    rebarWt: '85',
    rebarEf: '950',
    steelWt: '45',
    steelEf: '1200',
    glazingArea: '650',
    glazingEf: '55',
  },
  {
    id: 'steel-warehouse',
    label: 'Steel Frame Warehouse (4,000 m2)',
    gfa: '4000',
    concVol: '420',
    concEf: '260',
    rebarWt: '35',
    rebarEf: '1400',
    steelWt: '180',
    steelEf: '1800',
    glazingArea: '200',
    glazingEf: '65',
  },
];

export default function EmbodiedCarbonCalculatorClient() {
  const [gfaStr, setGfaStr] = useState('2500');
  const [concVolStr, setConcVolStr] = useState('850');
  const [concEfStr, setConcEfStr] = useState('320');
  const [rebarWtStr, setRebarWtStr] = useState('85');
  const [rebarEfStr, setRebarEfStr] = useState('1400');
  const [steelWtStr, setSteelWtStr] = useState('45');
  const [steelEfStr, setSteelEfStr] = useState('1800');
  const [glazingAreaStr, setGlazingAreaStr] = useState('650');
  const [glazingEfStr, setGlazingEfStr] = useState('65');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: PresetSpec) => {
    setGfaStr(p.gfa);
    setConcVolStr(p.concVol);
    setConcEfStr(p.concEf);
    setRebarWtStr(p.rebarWt);
    setRebarEfStr(p.rebarEf);
    setSteelWtStr(p.steelWt);
    setSteelEfStr(p.steelEf);
    setGlazingAreaStr(p.glazingArea);
    setGlazingEfStr(p.glazingEf);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const gfa = parseStrictPositive(gfaStr);
    const concVol = parseStrictNonNegative(concVolStr);
    const concEf = parseStrictNonNegative(concEfStr);
    const rebarWt = parseStrictNonNegative(rebarWtStr);
    const rebarEf = parseStrictNonNegative(rebarEfStr);
    const steelWt = parseStrictNonNegative(steelWtStr);
    const steelEf = parseStrictNonNegative(steelEfStr);
    const glazingArea = parseStrictNonNegative(glazingAreaStr);
    const glazingEf = parseStrictNonNegative(glazingEfStr);

    if (
      !Number.isFinite(gfa) ||
      !Number.isFinite(concVol) ||
      !Number.isFinite(concEf) ||
      !Number.isFinite(rebarWt) ||
      !Number.isFinite(rebarEf) ||
      !Number.isFinite(steelWt) ||
      !Number.isFinite(steelEf) ||
      !Number.isFinite(glazingArea) ||
      !Number.isFinite(glazingEf)
    ) {
      return { valid: false as const };
    }

    const concKg = concVol * concEf;
    const rebarKg = rebarWt * rebarEf;
    const steelKg = steelWt * steelEf;
    const glazingKg = glazingArea * glazingEf;
    const totalKg = concKg + rebarKg + steelKg + glazingKg;
    const totalTonnes = totalKg / 1000;
    const intensity = totalKg / gfa;
    const concreteSharePct = totalKg > 0 ? (concKg / totalKg) * 100 : 0;

    return {
      valid: true as const,
      gfa,
      concVol,
      concEf,
      rebarWt,
      rebarEf,
      steelWt,
      steelEf,
      glazingArea,
      glazingEf,
      concTonnes: concKg / 1000,
      rebarTonnes: rebarKg / 1000,
      steelTonnes: steelKg / 1000,
      glazingTonnes: glazingKg / 1000,
      totalKg,
      totalTonnes,
      intensity,
      concreteSharePct,
    };
  }, [
    gfaStr,
    concVolStr,
    concEfStr,
    rebarWtStr,
    rebarEfStr,
    steelWtStr,
    steelEfStr,
    glazingAreaStr,
    glazingEfStr,
  ]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Embodied Carbon Quantity Summation (A1-A3 Estimate)`,
      `Gross Floor Area: ${result.gfa.toFixed(2)} m2`,
      `Total Embodied Carbon: ${result.totalTonnes.toFixed(2)} tCO2e (${result.totalKg.toFixed(1)} kgCO2e)`,
      `Carbon Intensity: ${result.intensity.toFixed(2)} kgCO2e/m2`,
      `Breakdown (tCO2e): Concrete ${result.concTonnes.toFixed(2)}, Rebar ${result.rebarTonnes.toFixed(2)}, Steel ${result.steelTonnes.toFixed(2)}, Glazing ${result.glazingTonnes.toFixed(2)}`,
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
      ['Basis', 'Material Quantity x Reference Emission Factor Summation', '-'],
      ['Gross Floor Area', result.gfa.toFixed(2), 'm2'],
      ['Concrete Volume', result.concVol.toFixed(2), 'm3'],
      ['Concrete Factor', result.concEf.toFixed(2), 'kgCO2e/m3'],
      ['Rebar Weight', result.rebarWt.toFixed(2), 't'],
      ['Rebar Factor', result.rebarEf.toFixed(2), 'kgCO2e/t'],
      ['Structural Steel Weight', result.steelWt.toFixed(2), 't'],
      ['Structural Steel Factor', result.steelEf.toFixed(2), 'kgCO2e/t'],
      ['Glazing Area', result.glazingArea.toFixed(2), 'm2'],
      ['Glazing Factor', result.glazingEf.toFixed(2), 'kgCO2e/m2'],
      ['Total Embodied Carbon', result.totalTonnes.toFixed(2), 'tCO2e'],
      ['Total Embodied Carbon (kg)', result.totalKg.toFixed(1), 'kgCO2e'],
      ['Carbon Intensity per Floor Area', result.intensity.toFixed(2), 'kgCO2e/m2'],
      ['Concrete Share of Total', result.concreteSharePct.toFixed(2), '%'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embodied-carbon-summary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <span>Upfront Material Carbon Estimator (A1-A3 Summation)</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Totals upfront embodied carbon from structural quantities and user-editable reference emission factors.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Typical default emission factors are illustrative reference values only and depend on supplier mix, recycled content, and local grid electricity. Replace them with project-specific Environmental Product Declarations (EPD) for formal reporting.
          </span>
        </div>

        {!result.valid && (
          <div
            data-testid="error-banner"
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Enter a positive gross floor area (&gt; 0) and non-negative numeric quantities and factors.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                1. Floor Area & Concrete
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="input-gfa" className="text-xs font-bold text-slate-700 block mb-1">
                    Gross Floor Area (m2)
                  </label>
                  <input
                    id="input-gfa"
                    data-testid="input-gfa"
                    type="text"
                    value={gfaStr}
                    onChange={(e) => setGfaStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-concrete-vol" className="text-xs font-bold text-slate-700 block mb-1">
                    Concrete Volume (m3)
                  </label>
                  <input
                    id="input-concrete-vol"
                    data-testid="input-concrete-vol"
                    type="text"
                    value={concVolStr}
                    onChange={(e) => setConcVolStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-concrete-ef" className="text-xs font-bold text-slate-700 block mb-1">
                    Concrete EF (kgCO2e/m3)
                  </label>
                  <input
                    id="input-concrete-ef"
                    data-testid="input-concrete-ef"
                    type="text"
                    value={concEfStr}
                    onChange={(e) => setConcEfStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                2. Metals & Glazing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-rebar-wt" className="text-xs font-bold text-slate-700 block mb-1">
                    Rebar Steel Weight (t)
                  </label>
                  <input
                    id="input-rebar-wt"
                    data-testid="input-rebar-wt"
                    type="text"
                    value={rebarWtStr}
                    onChange={(e) => setRebarWtStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-rebar-ef" className="text-xs font-bold text-slate-700 block mb-1">
                    Rebar EF (kgCO2e/t)
                  </label>
                  <input
                    id="input-rebar-ef"
                    data-testid="input-rebar-ef"
                    type="text"
                    value={rebarEfStr}
                    onChange={(e) => setRebarEfStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-steel-wt" className="text-xs font-bold text-slate-700 block mb-1">
                    Structural Steel Weight (t)
                  </label>
                  <input
                    id="input-steel-wt"
                    data-testid="input-steel-wt"
                    type="text"
                    value={steelWtStr}
                    onChange={(e) => setSteelWtStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-steel-ef" className="text-xs font-bold text-slate-700 block mb-1">
                    Structural Steel EF (kgCO2e/t)
                  </label>
                  <input
                    id="input-steel-ef"
                    data-testid="input-steel-ef"
                    type="text"
                    value={steelEfStr}
                    onChange={(e) => setSteelEfStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-glazing-area" className="text-xs font-bold text-slate-700 block mb-1">
                    Glazing Area (m2)
                  </label>
                  <input
                    id="input-glazing-area"
                    data-testid="input-glazing-area"
                    type="text"
                    value={glazingAreaStr}
                    onChange={(e) => setGlazingAreaStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="input-glazing-ef" className="text-xs font-bold text-slate-700 block mb-1">
                    Glazing EF (kgCO2e/m2)
                  </label>
                  <input
                    id="input-glazing-ef"
                    data-testid="input-glazing-ef"
                    type="text"
                    value={glazingEfStr}
                    onChange={(e) => setGlazingEfStr(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl space-y-5 shadow-lg">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Total Embodied Carbon
              </span>
              <div className="text-4xl font-black text-white mt-1">
                <span data-testid="result-total-tonnes">
                  {result.valid ? result.totalTonnes.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-lg font-bold text-emerald-400">tCO2e</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Equivalent mass:{' '}
                <span data-testid="result-total-kg">
                  {result.valid ? result.totalKg.toFixed(1) : '—'}
                </span>{' '}
                kgCO2e
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-slate-300 block">Carbon Intensity per Floor Area</span>
              <div className="text-2xl font-black text-emerald-300 mt-1">
                <span data-testid="result-intensity">
                  {result.valid ? result.intensity.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-xs font-semibold text-slate-300">kgCO2e/m2</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Concrete Contribution:</span>
                <span className="font-bold text-white">
                  <span data-testid="result-concrete-tonnes">
                    {result.valid ? result.concTonnes.toFixed(2) : '—'}
                  </span>{' '}
                  tCO2e (<span data-testid="result-concrete-share">{result.valid ? result.concreteSharePct.toFixed(2) : '—'}</span>%)
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reinforcing Rebar:</span>
                <span className="font-bold text-white">
                  <span data-testid="result-rebar-tonnes">
                    {result.valid ? result.rebarTonnes.toFixed(2) : '—'}
                  </span>{' '}
                  tCO2e
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Structural Steel:</span>
                <span className="font-bold text-white">
                  <span data-testid="result-steel-tonnes">
                    {result.valid ? result.steelTonnes.toFixed(2) : '—'}
                  </span>{' '}
                  tCO2e
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Glazing & Curtain Wall:</span>
                <span className="font-bold text-white">
                  <span data-testid="result-glazing-tonnes">
                    {result.valid ? result.glazingTonnes.toFixed(2) : '—'}
                  </span>{' '}
                  tCO2e
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!result.valid}
                onClick={handleCopy}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!result.valid}
                onClick={handleDownloadCsv}
                className="py-2.5 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
