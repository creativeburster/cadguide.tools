'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';

interface ParkingPreset {
  id: string;
  label: string;
  lotAreaM2: string;
  areaPerStallM2: string;
}

const PRESETS: ParkingPreset[] = [
  {
    id: 'lot-4200',
    label: 'Preset 1: 4,200 m2 Lot (90 deg -> 27.5 m2/stall = 152 stalls)',
    lotAreaM2: '4200',
    areaPerStallM2: '27.5',
  },
  {
    id: 'mega-30000',
    label: 'Preset 2: 30,000 m2 Lot (25.0 m2/stall = 1,200 stalls)',
    lotAreaM2: '30000',
    areaPerStallM2: '25.0',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

// 2010 ADA Standards Section 208.2 Minimum Number of Accessible Parking Spaces
function adaMinimumAccessibleSpaces(totalSpaces: number): number {
  if (totalSpaces <= 0) return 0;
  if (totalSpaces <= 25) return 1;
  if (totalSpaces <= 50) return 2;
  if (totalSpaces <= 75) return 3;
  if (totalSpaces <= 100) return 4;
  if (totalSpaces <= 150) return 5;
  if (totalSpaces <= 200) return 6;
  if (totalSpaces <= 300) return 7;
  if (totalSpaces <= 400) return 8;
  if (totalSpaces <= 500) return 9;
  if (totalSpaces <= 1000) return Math.ceil(totalSpaces * 0.02);
  return 20 + Math.ceil((totalSpaces - 1000) / 100);
}

function evaluateParkingCapacity(lotAreaStr: string, stallFactorStr: string) {
  const area = parsePositive(lotAreaStr);
  const factor = parsePositive(stallFactorStr);

  if (!Number.isFinite(area) || !Number.isFinite(factor)) {
    return {
      valid: false as const,
      error: 'Net pavement lot area and area factor per stall must both be > 0 m^2.',
    };
  }
  const totalStalls = Math.floor(area / factor);
  if (totalStalls < 1) {
    return {
      valid: false as const,
      error: 'Lot area must be at least equal to one stall area factor (yielding >= 1 total stall).',
    };
  }

  const accessibleStalls = adaMinimumAccessibleSpaces(totalStalls);
  // 2010 ADA Standards Section 208.2.4: at least 1 van-accessible space for every 6 or fraction of 6 required
  const vanStalls = Math.ceil(accessibleStalls / 6);
  const standardAccessibleStalls = accessibleStalls - vanStalls;
  const regularStalls = Math.max(0, totalStalls - accessibleStalls);

  return {
    valid: true as const,
    area,
    factor,
    totalStalls,
    accessibleStalls,
    vanStalls,
    standardAccessibleStalls,
    regularStalls,
  };
}

export default function ParkingCapacityCalculatorClient() {
  const [lotAreaStr, setLotAreaStr] = useState('4200');
  const [stallFactorStr, setStallFactorStr] = useState('27.5');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluateParkingCapacity(lotAreaStr, stallFactorStr),
    [lotAreaStr, stallFactorStr]
  );

  const applyPreset = (p: ParkingPreset) => {
    setLotAreaStr(p.lotAreaM2);
    setStallFactorStr(p.areaPerStallM2);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Parking Lot Capacity & 2010 ADA Section 208.2 Summary',
      `Net Lot Area: ${evalRes.area.toFixed(1)} m^2 | Area Factor: ${evalRes.factor.toFixed(1)} m^2/stall`,
      `Total Vehicle Stalls: ${evalRes.totalStalls} (${evalRes.regularStalls} regular)`,
      `Required Accessible Spaces (208.2): ${evalRes.accessibleStalls} (incl. ${evalRes.vanStalls} van-accessible per 208.2.4)`,
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
      `Net Lot Area,${evalRes.area.toFixed(2)},m2`,
      `Gross Area Per Stall,${evalRes.factor.toFixed(2)},m2/stall`,
      `Total Stalls,${evalRes.totalStalls},spaces`,
      `Standard Non-Accessible Stalls,${evalRes.regularStalls},spaces`,
      `Required Accessible Stalls (ADA 208.2),${evalRes.accessibleStalls},spaces`,
      `Required Van Accessible Stalls (ADA 208.2.4),${evalRes.vanStalls},spaces`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parking_capacity_ada_208.csv';
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-purple-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
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
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Net Pavement Lot Area (m2)</label>
            <input type="text" inputMode="decimal" data-testid="input-area" value={lotAreaStr} onChange={(e) => setLotAreaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Parking Angle Area Factor (m2/stall)</label>
            <input type="text" inputMode="decimal" data-testid="input-factor" value={stallFactorStr} onChange={(e) => setStallFactorStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button type="button" data-testid="angle-90" onClick={() => setStallFactorStr('27.5')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-100">90 deg (27.5)</button>
              <button type="button" data-testid="angle-60" onClick={() => setStallFactorStr('31.0')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-100">60 deg (31.0)</button>
              <button type="button" data-testid="angle-45" onClick={() => setStallFactorStr('34.0')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-100">45 deg (34.0)</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parking Capacity &amp; Accessible Stalls</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
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
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Stalls</div>
                    <div data-testid="out-total" className="text-3xl font-black text-blue-900">{evalRes.totalStalls}</div>
                    <div className="text-xs text-blue-700 font-semibold mt-0.5">{evalRes.regularStalls} standard spaces</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Accessible Stalls (208.2)</div>
                    <div data-testid="out-accessible" className="text-3xl font-black text-emerald-900">{evalRes.accessibleStalls}</div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">{evalRes.standardAccessibleStalls} standard accessible</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Van Accessible (208.2.4)</div>
                    <div data-testid="out-van" className="text-3xl font-black text-slate-900">{evalRes.vanStalls}</div>
                    <div className="text-xs text-slate-600 font-semibold mt-0.5">At least 1 per 6 accessible</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>Total = floor(Area / Factor); Accessible count uses 2010 ADA Table 208.2 brackets and 208.2.4 van ratio.</span>
                  </div>
                  <div>
                    <a href="https://www.ada.gov/law-and-regs/design-standards/2010-stds/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-purple-700 hover:underline">
                      2010 ADA Standards for Accessible Design (ada.gov) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
