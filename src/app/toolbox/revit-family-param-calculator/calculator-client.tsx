'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Copy, Check, Download } from 'lucide-react';

interface FamilyParamResult {
  valid: boolean;
  error?: string;
  roughWidthMm: number;
  roughHeightMm: number;
  bboxVolumeM3: number;
  arrayCount: number;
  actualSpacingMm: number;
  revitFormulaText: string;
}

function solveRevitFamilyParams(
  widthMmStr: string,
  heightMmStr: string,
  depthMmStr: string,
  clrSideMmStr: string,
  clrHeadMmStr: string,
  spanMmStr: string,
  maxSpacingMmStr: string
): FamilyParamResult {
  if ([widthMmStr, heightMmStr, depthMmStr, clrSideMmStr, clrHeadMmStr, spanMmStr, maxSpacingMmStr].some((s) => s.trim() === '')) {
    return { valid: false, error: 'All opening dimensions, clearances, and linear array parameters are required.', roughWidthMm: 0, roughHeightMm: 0, bboxVolumeM3: 0, arrayCount: 0, actualSpacingMm: 0, revitFormulaText: '' };
  }
  const w = Number(widthMmStr);
  const h = Number(heightMmStr);
  const d = Number(depthMmStr);
  const clrS = Number(clrSideMmStr);
  const clrH = Number(clrHeadMmStr);
  const span = Number(spanMmStr);
  const maxPitch = Number(maxSpacingMmStr);

  if (![w, h, d, clrS, clrH, span, maxPitch].every(Number.isFinite)) {
    return { valid: false, error: 'All inputs must be valid finite numbers.', roughWidthMm: 0, roughHeightMm: 0, bboxVolumeM3: 0, arrayCount: 0, actualSpacingMm: 0, revitFormulaText: '' };
  }
  if (w <= 0 || h <= 0 || d <= 0 || clrS < 0 || clrH < 0 || span <= 0 || maxPitch <= 0) {
    return { valid: false, error: 'Require positive W/H/D/Span/MaxSpacing and non-negative clearances.', roughWidthMm: 0, roughHeightMm: 0, bboxVolumeM3: 0, arrayCount: 0, actualSpacingMm: 0, revitFormulaText: '' };
  }

  const roughWidthMm = w + 2 * clrS;
  const roughHeightMm = h + clrH;
  const bboxVolumeM3 = (roughWidthMm * roughHeightMm * d) / 1e9;
  const arrayCount = Math.max(2, Math.ceil(span / maxPitch) + 1);
  const actualSpacingMm = span / (arrayCount - 1);

  const revitFormulaText = [
    'Rough Width = Width + 2 * Side Clearance',
    'Rough Height = Height + Head Clearance',
    `Array Count = max(2, roundup(${span} mm / ${maxPitch} mm) + 1) = ${arrayCount}`,
    `Actual Spacing = Array Span / (Array Count - 1) = ${actualSpacingMm.toFixed(2)} mm`,
  ].join('\n');

  return { valid: true, roughWidthMm, roughHeightMm, bboxVolumeM3, arrayCount, actualSpacingMm, revitFormulaText };
}

export default function RevitFamilyParamCalculatorClient() {
  const [widthStr, setWidthStr] = useState('900');
  const [heightStr, setHeightStr] = useState('2100');
  const [depthStr, setDepthStr] = useState('400');
  const [clrSideStr, setClrSideStr] = useState('50');
  const [clrHeadStr, setClrHeadStr] = useState('50');
  const [spanStr, setSpanStr] = useState('3600');
  const [maxSpacingStr, setMaxSpacingStr] = useState('600');
  const [copied, setCopied] = useState(false);

  const res = solveRevitFamilyParams(widthStr, heightStr, depthStr, clrSideStr, clrHeadStr, spanStr, maxSpacingStr);

  const handleCopy = () => {
    if (!res.valid) return;
    navigator.clipboard.writeText(res.revitFormulaText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const downloadCsv = () => {
    if (!res.valid) return;
    const rows = [
      ['Revit Family Opening & Array Parameters', ''],
      ['Nominal Width (mm)', widthStr],
      ['Nominal Height (mm)', heightStr],
      ['Frame Depth (mm)', depthStr],
      ['Side Clearance (mm)', clrSideStr],
      ['Head Clearance (mm)', clrHeadStr],
      ['Array Span (mm)', spanStr],
      ['Max Pitch Limit (mm)', maxSpacingStr],
      ['Rough Opening Width (mm)', res.roughWidthMm.toFixed(2)],
      ['Rough Opening Height (mm)', res.roughHeightMm.toFixed(2)],
      ['Bounding Box Volume (m^3)', res.bboxVolumeM3.toFixed(4)],
      ['Array Instance Count', String(res.arrayCount)],
      ['Solved Actual Array Spacing (mm)', res.actualSpacingMm.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revit-family-parameters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Family Inputs</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-width" value={widthStr} onChange={(e) => setWidthStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Height (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-height" value={heightStr} onChange={(e) => setHeightStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Depth (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-depth" value={depthStr} onChange={(e) => setDepthStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Side Clr</label>
              <input type="text" inputMode="decimal" data-testid="input-clr-side" value={clrSideStr} onChange={(e) => setClrSideStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 uppercase block mb-1">Head Clr</label>
              <input type="text" inputMode="decimal" data-testid="input-clr-head" value={clrHeadStr} onChange={(e) => setClrHeadStr(e.target.value)} className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Array Span (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-span" value={spanStr} onChange={(e) => setSpanStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Max Spacing (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-max-spacing" value={maxSpacingStr} onChange={(e) => setMaxSpacingStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWidthStr('900'); setHeightStr('2100'); setDepthStr('400');
              setClrSideStr('50'); setClrHeadStr('50'); setSpanStr('3600'); setMaxSpacingStr('600');
            }}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Parameter Outputs</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleCopy} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200 disabled:opacity-50">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" onClick={downloadCsv} disabled={!res.valid} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 disabled:opacity-50">
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!res.valid ? (
              <div data-testid="validation-error" className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-bold text-red-700">{res.error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase mb-1">Rough Opening W</div>
                    <div className="text-2xl font-black text-blue-800" data-testid="res-rw">{res.roughWidthMm.toFixed(1)} mm</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-500 uppercase mb-1">Rough Opening H</div>
                    <div className="text-2xl font-black text-emerald-800" data-testid="res-rh">{res.roughHeightMm.toFixed(1)} mm</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase mb-1">Bounding Volume</div>
                    <div className="text-2xl font-black text-orange-800" data-testid="res-vol">{res.bboxVolumeM3.toFixed(4)} m3</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Linear Array Instance Count</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-array-count">{res.arrayCount}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Actual Array Pitch</div>
                    <div className="text-2xl font-black text-slate-900" data-testid="res-array-spacing">{res.actualSpacingMm.toFixed(2)} mm</div>
                  </div>
                </div>

                <pre className="bg-slate-900 text-slate-100 rounded-2xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{res.revitFormulaText}</pre>
              </>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Calculates geometric rough openings (Rough Width = W + 2*SideClr, Rough Height = H + HeadClr) and linear parametric array counts (Count = max(2, ceil(Span / MaxSpacing) + 1)).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
