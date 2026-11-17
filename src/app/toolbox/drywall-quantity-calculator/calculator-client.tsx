'use client';

import React, { useMemo, useState } from 'react';
import { Download, Copy, Check, RotateCcw, Settings, Zap, Info, AlertTriangle } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface DrywallPreset {
  id: string;
  label: string;
  grossArea: string;
  openingArea: string;
  sheetWidth: string;
  sheetLength: string;
  wastePct: string;
  screwsPerSheet: string;
  compoundKgPerM2: string;
}

const PRESETS: DrywallPreset[] = [
  {
    id: 'default',
    label: 'Default (100 m2 · 1.2x2.4m · 10% Waste)',
    grossArea: '100',
    openingArea: '0',
    sheetWidth: '1.2',
    sheetLength: '2.4',
    wastePct: '10',
    screwsPerSheet: '32',
    compoundKgPerM2: '0.45',
  },
  {
    id: '3m-board-openings',
    label: '120 m2 - 12 m2 Openings · 1.2x3.0m',
    grossArea: '120',
    openingArea: '12',
    sheetWidth: '1.2',
    sheetLength: '3.0',
    wastePct: '15',
    screwsPerSheet: '40',
    compoundKgPerM2: '0.50',
  },
];

function parsePositive(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function parseNonNeg(raw: string, max: number): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
}

export default function DrywallQuantityCalculatorClient() {
  const [grossArea, setGrossArea] = useState('100');
  const [openingArea, setOpeningArea] = useState('0');
  const [sheetWidth, setSheetWidth] = useState('1.2');
  const [sheetLength, setSheetLength] = useState('2.4');
  const [wastePct, setWastePct] = useState('10');
  const [screwsPerSheet, setScrewsPerSheet] = useState('32');
  const [compoundKgPerM2, setCompoundKgPerM2] = useState('0.45');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: DrywallPreset) => {
    setGrossArea(p.grossArea);
    setOpeningArea(p.openingArea);
    setSheetWidth(p.sheetWidth);
    setSheetLength(p.sheetLength);
    setWastePct(p.wastePct);
    setScrewsPerSheet(p.screwsPerSheet);
    setCompoundKgPerM2(p.compoundKgPerM2);
  };

  const resetAll = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const gross = parsePositive(grossArea, 1000000);
    const open = parseNonNeg(openingArea, 1000000);
    const w = parsePositive(sheetWidth, 10);
    const l = parsePositive(sheetLength, 20);
    const waste = parseNonNeg(wastePct, 100);
    const scrRate = parsePositive(screwsPerSheet, 500);
    const compRate = parseNonNeg(compoundKgPerM2, 20);

    if (
      gross === null ||
      open === null ||
      open >= gross ||
      w === null ||
      l === null ||
      waste === null ||
      scrRate === null ||
      compRate === null
    ) {
      return null;
    }

    const netArea = gross - open;
    const sheetArea = w * l;
    const effectiveArea = netArea * (1 + waste / 100);
    const sheetsNeeded = Math.ceil(effectiveArea / sheetArea);
    const totalScrews = Math.ceil(sheetsNeeded * scrRate);
    const compoundKg = effectiveArea * compRate;

    return {
      netArea,
      sheetArea,
      effectiveArea,
      sheetsNeeded,
      totalScrews,
      compoundKg,
    };
  }, [grossArea, openingArea, sheetWidth, sheetLength, wastePct, screwsPerSheet, compoundKgPerM2]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      'Drywall Sheet & Fastener Quantity Estimate',
      `Net Surface Area: ${result.netArea.toFixed(2)} m2 (Gross ${grossArea} m2 - Openings ${openingArea} m2)`,
      `Board Size: ${sheetWidth} m x ${sheetLength} m (${result.sheetArea.toFixed(2)} m2/sheet) | Waste Factor: ${wastePct}%`,
      `Required Sheets: ${result.sheetsNeeded}`,
      `Estimated Screws (${screwsPerSheet}/sheet): ${result.totalScrews}`,
      `Estimated Joint Compound (${compoundKgPerM2} kg/m2): ${result.compoundKg.toFixed(2)} kg`,
      'Note: Screw and compound allowances are editable typical reference rates; adjust for finish level and stud spacing.',
    ].join('\n');
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Gross Surface Area', grossArea, 'm2', 'Total wall/ceiling area'],
      ['Deducted Openings Area', openingArea, 'm2', 'Doors/windows deducted'],
      ['Net Surface Area', result.netArea.toFixed(2), 'm2', 'Gross minus openings'],
      ['Sheet Width', sheetWidth, 'm', 'Single gypsum board width'],
      ['Sheet Length', sheetLength, 'm', 'Single gypsum board length'],
      ['Single Sheet Area', result.sheetArea.toFixed(2), 'm2', 'Width * Length'],
      ['Waste Factor', wastePct, '%', 'Cut-off and trimming allowance'],
      ['Area with Waste', result.effectiveArea.toFixed(2), 'm2', 'Net Area * (1 + waste/100)'],
      ['Screws per Sheet (Editable Allowance)', screwsPerSheet, 'pcs/sheet', 'Typical framing allowance'],
      ['Joint Compound Rate (Editable Allowance)', compoundKgPerM2, 'kg/m2', 'Typical finish allowance'],
      ['Sheets Needed (Rounded Up)', String(result.sheetsNeeded), 'sheets', 'ceil(effectiveArea / sheetArea)'],
      ['Total Drywall Screws', String(result.totalScrews), 'pcs', 'sheets * screwsPerSheet'],
      ['Joint Compound Estimate', result.compoundKg.toFixed(2), 'kg', 'effectiveArea * compoundRate'],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drywall-quantity-estimate-${result.sheetsNeeded}sheets.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-testid="reset-button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Area &amp; Sheet Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Gross Wall/Ceiling Area (m²)
              </label>
              <input
                type="text"
                data-testid="input-gross-area"
                value={grossArea}
                onChange={(e) => setGrossArea(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Openings Deduction (m²)
              </label>
              <input
                type="text"
                data-testid="input-opening-area"
                value={openingArea}
                onChange={(e) => setOpeningArea(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Sheet Width (m)
              </label>
              <input
                type="text"
                data-testid="input-sheet-width"
                value={sheetWidth}
                onChange={(e) => setSheetWidth(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Sheet Length (m)
              </label>
              <input
                type="text"
                data-testid="input-sheet-length"
                value={sheetLength}
                onChange={(e) => setSheetLength(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Waste Factor (%)
              </label>
              <input
                type="text"
                data-testid="input-waste"
                value={wastePct}
                onChange={(e) => setWastePct(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Screws / Sheet (Est.)
              </label>
              <input
                type="text"
                data-testid="input-screws-rate"
                value={screwsPerSheet}
                onChange={(e) => setScrewsPerSheet(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Joint Compound Allowance (kg/m², Editable)
            </label>
            <input
              type="text"
              data-testid="input-compound-rate"
              value={compoundKgPerM2}
              onChange={(e) => setCompoundKgPerM2(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-rose-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Typical reference planning allowances (~32 screws per 1.2×2.4 m board and ~0.45 kg/m² joint compound). Verify against local framing spacing and finish level requirements.
            </p>
          </div>

          {!result && (
            <div
              data-testid="validation-error"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Enter valid positive dimensions (openings deduction must be strictly less than gross area).
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Material Estimate</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Sheets Needed</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-sheets">{result ? String(result.sheetsNeeded) : '—'}</span>
                  <span className="text-sm font-bold text-blue-500 ml-1">sheets</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Estimated Screws</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-screws">{result ? String(result.totalScrews) : '—'}</span>
                  <span className="text-sm font-bold text-emerald-600 ml-1">pcs</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-700 uppercase tracking-wider mb-1">Joint Compound</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-compound">{result ? result.compoundKg.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-orange-600 ml-1">kg</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Net Area</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-net-area">{result ? result.netArea.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">m²</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4 text-rose-600 shrink-0" />
                Area Takeoff &amp; Material Allowance Formula
              </div>
              <p>
                A_net = A_gross - A_openings; Sheets = ceil(A_net * (1 + waste / 100) / (W_s * L_s)); Screws = Sheets * screwsPerSheet; Compound = A_net * (1 + waste / 100) * compoundRate.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
