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

interface GroupPreset {
  id: string;
  label: string;
  diaMm: string;
  spacingMm: string;
  rows: string;
  cols: string;
  qSingleKn: string;
}

const PRESETS: GroupPreset[] = [
  {
    id: 'grid-3x3',
    label: 'Preset 1: 3x3 Group (D=600 mm, s=1800 mm, Q_single=950 kN)',
    diaMm: '600',
    spacingMm: '1800',
    rows: '3',
    cols: '3',
    qSingleKn: '950',
  },
  {
    id: 'grid-2x4',
    label: 'Preset 2: 2x4 Group (D=500 mm, s=1500 mm, Q_single=800 kN)',
    diaMm: '500',
    spacingMm: '1500',
    rows: '2',
    cols: '4',
    qSingleKn: '800',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function evaluatePileGroup(
  diaStr: string,
  spacingStr: string,
  rowsStr: string,
  colsStr: string,
  qSingleStr: string
) {
  const D = parsePositive(diaStr);
  const s = parsePositive(spacingStr);
  const m = parsePosInt(rowsStr);
  const n = parsePosInt(colsStr);
  const qSingle = parsePositive(qSingleStr);

  if (!Number.isFinite(D) || !Number.isFinite(s) || !Number.isFinite(m) || !Number.isFinite(n) || !Number.isFinite(qSingle)) {
    return {
      valid: false as const,
      error: 'Diameter, spacing, and single-pile capacity must be > 0; row & column counts m, n must be integers >= 1.',
    };
  }
  if (s <= D) {
    return { valid: false as const, error: 'Center-to-center spacing s must be strictly greater than pile diameter D.' };
  }

  const totalPiles = m * n;
  const thetaDeg = Math.atan(D / s) * (180 / Math.PI);
  const eta = 1 - (thetaDeg / 90) * (((n - 1) * m + (m - 1) * n) / totalPiles);
  const groupCapKn = eta * totalPiles * qSingle;
  const spacingRatio = s / D;

  return {
    valid: true as const,
    totalPiles,
    thetaDeg,
    etaPct: eta * 100,
    groupCapKn,
    spacingRatio,
  };
}

export default function PileGroupEfficiencyCalculatorClient() {
  const [diaStr, setDiaStr] = useState('600');
  const [spacingStr, setSpacingStr] = useState('1800');
  const [rowsStr, setRowsStr] = useState('3');
  const [colsStr, setColsStr] = useState('3');
  const [qSingleStr, setQSingleStr] = useState('950');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePileGroup(diaStr, spacingStr, rowsStr, colsStr, qSingleStr),
    [diaStr, spacingStr, rowsStr, colsStr, qSingleStr]
  );

  const applyPreset = (p: GroupPreset) => {
    setDiaStr(p.diaMm);
    setSpacingStr(p.spacingMm);
    setRowsStr(p.rows);
    setColsStr(p.cols);
    setQSingleStr(p.qSingleKn);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Converse-Labarre Pile Group Efficiency Summary',
      `Total Piles: ${evalRes.totalPiles} | s/D Ratio: ${evalRes.spacingRatio.toFixed(2)}D | theta: ${evalRes.thetaDeg.toFixed(4)} deg`,
      `Group Efficiency eta: ${evalRes.etaPct.toFixed(4)}%`,
      `Total Group Capacity: ${evalRes.groupCapKn.toFixed(4)} kN`,
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
      `Total Piles,${evalRes.totalPiles},piles`,
      `Spacing Ratio s/D,${evalRes.spacingRatio.toFixed(4)},D`,
      `Angle Theta,${evalRes.thetaDeg.toFixed(6)},deg`,
      `Converse-Labarre Efficiency,${evalRes.etaPct.toFixed(4)},%`,
      `Group Ultimate Capacity,${evalRes.groupCapKn.toFixed(4)},kN`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pile_group_efficiency.csv';
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Group Layout</h2>
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
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Pile Diameter D (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Center-to-Center Spacing s (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-spacing" value={spacingStr} onChange={(e) => setSpacingStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Rows m</label>
              <input type="text" inputMode="numeric" data-testid="input-rows" value={rowsStr} onChange={(e) => setRowsStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Columns n</label>
              <input type="text" inputMode="numeric" data-testid="input-cols" value={colsStr} onChange={(e) => setColsStr(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold" />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase block mb-1">Single Pile Capacity Q_single (kN)</label>
            <input type="text" inputMode="decimal" data-testid="input-qsingle" value={qSingleStr} onChange={(e) => setQSingleStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Group Efficiency &amp; Capacity</h2>
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
                    <div className="text-xs font-black text-blue-500 uppercase">Group Capacity</div>
                    <div className="text-2xl font-black text-blue-900 mt-1">
                      <span data-testid="out-group-cap">{evalRes.groupCapKn.toFixed(4)}</span> kN
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Efficiency eta</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-eta">{evalRes.etaPct.toFixed(4)}</span>%
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">theta = {evalRes.thetaDeg.toFixed(4)} deg</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase">Spacing Ratio</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      <span data-testid="out-ratio">{evalRes.spacingRatio.toFixed(2)}</span> D
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">{evalRes.totalPiles} piles</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Converse-Labarre formula: eta = 1 - (arctan(D/s)_deg / 90) * ((n - 1)*m + (m - 1)*n) / (m*n); Q_group = eta * m * n * Q_single.</span>
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
