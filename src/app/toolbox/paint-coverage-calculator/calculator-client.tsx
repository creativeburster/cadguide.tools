'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Info,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';

interface PaintCostPreset {
  id: string;
  label: string;
  areaM2: string;
  coats: string;
  dftUm: string;
  vsPct: string;
  lossPct: string;
  pricePerL: string;
}

const PRESETS: PaintCostPreset[] = [
  {
    id: 'wall-standard',
    label: 'Preset 1: 100 m2 x 2 Coats (50 um DFT, 50% VS -> 10 m2/L, 10% loss)',
    areaM2: '100',
    coats: '2',
    dftUm: '50',
    vsPct: '50',
    lossPct: '10',
    pricePerL: '15',
  },
  {
    id: 'epoxy-steel',
    label: 'Preset 2: High-Build Epoxy (250 m2, 2 Coats, 125 um DFT, 65% VS, 20% loss)',
    areaM2: '250',
    coats: '2',
    dftUm: '125',
    vsPct: '65',
    lossPct: '20',
    pricePerL: '28',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function evaluatePaintCoverage(
  areaStr: string,
  coatsStr: string,
  dftStr: string,
  vsStr: string,
  lossStr: string,
  priceStr: string
) {
  const area = parsePositive(areaStr);
  const coats = parsePositive(coatsStr);
  const dftUm = parsePositive(dftStr);
  const vsPct = parsePositive(vsStr);
  const lossPct = parseNonNegative(lossStr);
  const price = parseNonNegative(priceStr);

  if (
    !Number.isFinite(area) ||
    !Number.isFinite(coats) ||
    !Number.isFinite(dftUm) ||
    !Number.isFinite(vsPct) ||
    !Number.isFinite(lossPct) ||
    !Number.isFinite(price)
  ) {
    return {
      valid: false as const,
      error: 'Area, coats, DFT, and volume solids must be > 0; loss factor and unit price must be >= 0.',
    };
  }
  if (vsPct > 100) {
    return { valid: false as const, error: 'Volume solids percentage cannot exceed 100%.' };
  }

  const theoSpreadM2PerL = (10 * vsPct) / dftUm;
  const wftUm = dftUm / (vsPct / 100);
  const theoVolumeL = (area * coats) / theoSpreadM2PerL;
  const totalVolumeL = theoVolumeL * (1 + lossPct / 100);
  const lossL = totalVolumeL - theoVolumeL;
  const totalCost = totalVolumeL * price;

  return {
    valid: true as const,
    theoSpreadM2PerL,
    wftUm,
    theoVolumeL,
    lossL,
    totalVolumeL,
    totalCost,
  };
}

export default function PaintCoverageCalculatorClient() {
  const [areaStr, setAreaStr] = useState('100');
  const [coatsStr, setCoatsStr] = useState('2');
  const [dftStr, setDftStr] = useState('50');
  const [vsStr, setVsStr] = useState('50');
  const [lossStr, setLossStr] = useState('10');
  const [priceStr, setPriceStr] = useState('15');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePaintCoverage(areaStr, coatsStr, dftStr, vsStr, lossStr, priceStr),
    [areaStr, coatsStr, dftStr, vsStr, lossStr, priceStr]
  );

  const applyPreset = (p: PaintCostPreset) => {
    setAreaStr(p.areaM2);
    setCoatsStr(p.coats);
    setDftStr(p.dftUm);
    setVsStr(p.vsPct);
    setLossStr(p.lossPct);
    setPriceStr(p.pricePerL);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Coating Theoretical Coverage & Cost Summary',
      `Theoretical Spreading Rate: ${evalRes.theoSpreadM2PerL.toFixed(3)} m^2/L (WFT: ${evalRes.wftUm.toFixed(2)} um)`,
      `Theoretical Volume: ${evalRes.theoVolumeL.toFixed(3)} L | With Loss: ${evalRes.totalVolumeL.toFixed(3)} L`,
      `Estimated Material Cost: $${evalRes.totalCost.toFixed(2)}`,
    ].join('\n');
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!evalRes.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Theoretical Spreading Rate,${evalRes.theoSpreadM2PerL.toFixed(4)},m2/L`,
      `Wet Film Thickness WFT,${evalRes.wftUm.toFixed(4)},um`,
      `Theoretical Paint Volume,${evalRes.theoVolumeL.toFixed(4)},L`,
      `Wastage Allowance Volume,${evalRes.lossL.toFixed(4)},L`,
      `Total Required Volume,${evalRes.totalVolumeL.toFixed(4)},L`,
      `Estimated Cost,${evalRes.totalCost.toFixed(2)},USD`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paint_coverage_cost.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-orange-400"
          >
            {p.label}
          </button>
        ))}
      </div>

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
              onClick={() => applyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Surface Area (m2)</label>
            <input type="text" inputMode="decimal" data-testid="input-area" value={areaStr} onChange={(e) => setAreaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Coats</label>
            <input type="text" inputMode="decimal" data-testid="input-coats" value={coatsStr} onChange={(e) => setCoatsStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Dry Film Thickness DFT (um)</label>
            <input type="text" inputMode="decimal" data-testid="input-dft" value={dftStr} onChange={(e) => setDftStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Volume Solids VS (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-vs" value={vsStr} onChange={(e) => setVsStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Loss / Wastage (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-loss" value={lossStr} onChange={(e) => setLossStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Paint Price ($/L)</label>
            <input type="text" inputMode="decimal" data-testid="input-price" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!evalRes.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  disabled={!evalRes.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

            {!evalRes.valid ? (
              <div data-testid="validation-error" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalRes.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Spreading Rate</div>
                    <div className="text-2xl font-black text-blue-900">
                      <span data-testid="out-spread">{evalRes.theoSpreadM2PerL.toFixed(3)}</span> m2/L
                    </div>
                    <div className="text-xs text-blue-700 font-semibold mt-0.5">
                      WFT: <span data-testid="out-wft">{evalRes.wftUm.toFixed(1)}</span> um
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Total Required Paint</div>
                    <div className="text-2xl font-black text-emerald-900">
                      <span data-testid="out-total-liters">{evalRes.totalVolumeL.toFixed(3)}</span> L
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Net {evalRes.theoVolumeL.toFixed(2)} + Loss {evalRes.lossL.toFixed(2)} L
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Material Cost</div>
                    <div className="text-2xl font-black text-orange-900">
                      $<span data-testid="out-cost">{evalRes.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Theoretical spreading rate = 10 * VS(%) / DFT(um); Total liters = (Area * Coats / Spreading) * (1 + Loss%/100).</span>
                </div>
              </>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
