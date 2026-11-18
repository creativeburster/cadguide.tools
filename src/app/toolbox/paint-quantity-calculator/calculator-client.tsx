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

interface QuantityPreset {
  id: string;
  label: string;
  grossAreaM2: string;
  openingsM2: string;
  coats: string;
  coverageM2L: string;
  wastePct: string;
  canSizeL: string;
}

const PRESETS: QuantityPreset[] = [
  {
    id: 'room-50m2',
    label: 'Preset 1: 60 m2 Gross - 10 m2 Openings (2 Coats, 10 m2/L, 5% waste, 5L cans)',
    grossAreaM2: '60',
    openingsM2: '10',
    coats: '2',
    coverageM2L: '10',
    wastePct: '5',
    canSizeL: '5',
  },
  {
    id: 'large-hall',
    label: 'Preset 2: Hallway 320 m2 - 40 m2 Openings (2 Coats, 11.2 m2/L, 10% waste, 20L pails)',
    grossAreaM2: '320',
    openingsM2: '40',
    coats: '2',
    coverageM2L: '11.2',
    wastePct: '10',
    canSizeL: '20',
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

function evaluatePaintQuantity(
  grossStr: string,
  openStr: string,
  coatsStr: string,
  covStr: string,
  wasteStr: string,
  canStr: string
) {
  const gross = parsePositive(grossStr);
  const openings = parseNonNegative(openStr);
  const coats = parsePositive(coatsStr);
  const cov = parsePositive(covStr);
  const wastePct = parseNonNegative(wasteStr);
  const canSize = parsePositive(canStr);

  if (
    !Number.isFinite(gross) ||
    !Number.isFinite(openings) ||
    !Number.isFinite(coats) ||
    !Number.isFinite(cov) ||
    !Number.isFinite(wastePct) ||
    !Number.isFinite(canSize)
  ) {
    return {
      valid: false as const,
      error: 'Gross area, coats, coverage rate, and can size must be > 0; openings & waste factor must be >= 0.',
    };
  }
  if (openings >= gross) {
    return {
      valid: false as const,
      error: 'Deducted door/window openings area must be strictly smaller than gross wall area.',
    };
  }

  const netAreaM2 = gross - openings;
  const litersReq = ((netAreaM2 * coats) / cov) * (1 + wastePct / 100);
  const cansRequired = Math.ceil(litersReq / canSize);
  const purchasedLiters = cansRequired * canSize;

  return {
    valid: true as const,
    netAreaM2,
    litersReq,
    cansRequired,
    purchasedLiters,
  };
}

export default function PaintQuantityCalculatorClient() {
  const [grossStr, setGrossStr] = useState('60');
  const [openStr, setOpenStr] = useState('10');
  const [coatsStr, setCoatsStr] = useState('2');
  const [covStr, setCovStr] = useState('10');
  const [wasteStr, setWasteStr] = useState('5');
  const [canStr, setCanStr] = useState('5');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePaintQuantity(grossStr, openStr, coatsStr, covStr, wasteStr, canStr),
    [grossStr, openStr, coatsStr, covStr, wasteStr, canStr]
  );

  const applyPreset = (p: QuantityPreset) => {
    setGrossStr(p.grossAreaM2);
    setOpenStr(p.openingsM2);
    setCoatsStr(p.coats);
    setCovStr(p.coverageM2L);
    setWasteStr(p.wastePct);
    setCanStr(p.canSizeL);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Paint Volume & Container Packaging Summary',
      `Net Paintable Area: ${evalRes.netAreaM2.toFixed(2)} m^2`,
      `Required Volume (incl. waste): ${evalRes.litersReq.toFixed(3)} L`,
      `Containers Needed: ${evalRes.cansRequired} (${evalRes.purchasedLiters.toFixed(2)} L purchased)`,
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
      `Net Paintable Area,${evalRes.netAreaM2.toFixed(4)},m2`,
      `Required Paint Volume,${evalRes.litersReq.toFixed(4)},L`,
      `Containers Needed,${evalRes.cansRequired},cans`,
      `Total Purchased Volume,${evalRes.purchasedLiters.toFixed(4)},L`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paint_quantity_takeoff.csv';
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-red-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Gross Surface Area (m2)</label>
            <input type="text" inputMode="decimal" data-testid="input-gross" value={grossStr} onChange={(e) => setGrossStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Openings Deduction (m2)</label>
            <input type="text" inputMode="decimal" data-testid="input-openings" value={openStr} onChange={(e) => setOpenStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Number of Coats</label>
            <input type="text" inputMode="decimal" data-testid="input-coats" value={coatsStr} onChange={(e) => setCoatsStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Coverage (m2/L)</label>
            <input type="text" inputMode="decimal" data-testid="input-coverage" value={covStr} onChange={(e) => setCovStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Waste Factor (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-waste" value={wasteStr} onChange={(e) => setWasteStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Can / Pail Size (L)</label>
            <input type="text" inputMode="decimal" data-testid="input-can-size" value={canStr} onChange={(e) => setCanStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
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
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Net Area</div>
                    <div className="text-2xl font-black text-slate-900">
                      <span data-testid="out-net-area">{evalRes.netAreaM2.toFixed(2)}</span> m2
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Paint Needed</div>
                    <div className="text-2xl font-black text-blue-900">
                      <span data-testid="out-liters">{evalRes.litersReq.toFixed(3)}</span> L
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Containers</div>
                    <div data-testid="out-cans" className="text-2xl font-black text-emerald-900">
                      {evalRes.cansRequired}
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {evalRes.purchasedLiters.toFixed(2)} L total
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>L = ((Gross - Openings) * Coats / Coverage) * (1 + Waste%/100); Cans = ceil(L / CanSize).</span>
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
