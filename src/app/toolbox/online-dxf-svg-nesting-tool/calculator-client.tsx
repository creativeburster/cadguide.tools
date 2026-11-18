'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { parseDxf, segmentsOf } from '@/lib/cad-file-analysis';
import { NestablePart, runSheetMetalNesting } from '@/lib/open-source-cad-engines';

interface PartDraft {
  id: string;
  name: string;
  widthStr: string;
  heightStr: string;
  qtyStr: string;
  color: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const DEFAULT_PARTS: PartDraft[] = [
  { id: 'P1', name: 'Base_Plate_304SS', widthStr: '380', heightStr: '260', qtyStr: '6', color: '#3b82f6' },
  { id: 'P2', name: 'Gusset_Bracket_L', widthStr: '220', heightStr: '180', qtyStr: '10', color: '#10b981' },
  { id: 'P3', name: 'Motor_Mount_Flange', widthStr: '310', heightStr: '310', qtyStr: '4', color: '#f59e0b' },
  { id: 'P4', name: 'Stiffener_Rib', widthStr: '450', heightStr: '110', qtyStr: '8', color: '#8b5cf6' },
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

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function downloadFile(content: string, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([toSafeAscii(content)], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function evaluateNesting(
  sheetWStr: string,
  sheetHStr: string,
  kerfStr: string,
  allowRot: boolean,
  parts: PartDraft[]
) {
  const sheetW = parsePositive(sheetWStr);
  const sheetH = parsePositive(sheetHStr);
  const kerf = parseNonNegative(kerfStr);

  if (!Number.isFinite(sheetW) || !Number.isFinite(sheetH) || !Number.isFinite(kerf)) {
    return {
      valid: false as const,
      error: 'Sheet width and height must be > 0 mm; kerf spacing must be >= 0 mm.',
    };
  }
  if (parts.length === 0) {
    return { valid: false as const, error: 'Add at least one rectangular or DXF part to nest.' };
  }

  const numericParts: NestablePart[] = [];
  for (const p of parts) {
    const w = parsePositive(p.widthStr);
    const h = parsePositive(p.heightStr);
    const q = parsePosInt(p.qtyStr);
    if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(q)) {
      return {
        valid: false as const,
        error: `Part "${p.name || p.id}" must have positive W/H (mm) and integer Qty >= 1.`,
      };
    }
    numericParts.push({
      id: p.id,
      name: toSafeAscii(p.name) || p.id,
      width: w,
      height: h,
      qty: q,
      color: p.color,
    });
  }

  const nesting = runSheetMetalNesting(sheetW, sheetH, kerf, allowRot, numericParts);
  const sheetAreaMm2 = sheetW * sheetH;
  const wasteAreaMm2 = Math.max(0, sheetAreaMm2 - nesting.usedAreaMm2);

  return {
    valid: true as const,
    sheetW,
    sheetH,
    kerf,
    sheetAreaMm2,
    wasteAreaMm2,
    nesting,
  };
}

export default function OnlineDxfSvgNestingClient() {
  const [sheetWStr, setSheetWStr] = useState('1250');
  const [sheetHStr, setSheetHStr] = useState('2500');
  const [kerfStr, setKerfStr] = useState('5');
  const [allowRot, setAllowRot] = useState<boolean>(true);
  const [parts, setParts] = useState<PartDraft[]>(DEFAULT_PARTS);
  const [copied, setCopied] = useState(false);

  const applyPreset = (id: 'default' | 'handcheck' | 'laser600') => {
    if (id === 'default') {
      setSheetWStr('1250');
      setSheetHStr('2500');
      setKerfStr('5');
      setAllowRot(true);
      setParts(DEFAULT_PARTS);
    } else if (id === 'handcheck') {
      // Exact hand calculation: 1000x500 mm sheet (500,000 mm2), kerf=0, 4 parts of 250x200 (200,000 mm2) -> 40.0000%
      setSheetWStr('1000');
      setSheetHStr('500');
      setKerfStr('0');
      setAllowRot(false);
      setParts([{ id: 'P1', name: 'Test_Plate', widthStr: '250', heightStr: '200', qtyStr: '4', color: '#3b82f6' }]);
    } else {
      setSheetWStr('600');
      setSheetHStr('900');
      setKerfStr('2');
      setAllowRot(true);
      setParts([
        { id: 'P1', name: 'Bracket_A', widthStr: '180', heightStr: '120', qtyStr: '6', color: '#3b82f6' },
        { id: 'P2', name: 'Plate_B', widthStr: '140', heightStr: '90', qtyStr: '6', color: '#10b981' },
      ]);
    }
  };

  const handleDxfPartImport = (file: File) => {
    file.text().then((txt) => {
      const doc = parseDxf(txt);
      if (!doc) return;
      const segs = segmentsOf(doc);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const s of segs) {
        minX = Math.min(minX, s.x1, s.x2);
        minY = Math.min(minY, s.y1, s.y2);
        maxX = Math.max(maxX, s.x1, s.x2);
        maxY = Math.max(maxY, s.y1, s.y2);
      }
      const w = Number.isFinite(minX) ? Math.max(10, Math.round(maxX - minX)) : 150;
      const h = Number.isFinite(minY) ? Math.max(10, Math.round(maxY - minY)) : 100;
      setParts((prev) => [
        ...prev,
        {
          id: `DXF_${prev.length + 1}`,
          name: toSafeAscii(file.name.replace(/\.dxf$/i, '')) || `DXF_${prev.length + 1}`,
          widthStr: String(w),
          heightStr: String(h),
          qtyStr: '4',
          color: COLORS[prev.length % COLORS.length],
        },
      ]);
    });
  };

  const evaluated = useMemo(
    () => evaluateNesting(sheetWStr, sheetHStr, kerfStr, allowRot, parts),
    [sheetWStr, sheetHStr, kerfStr, allowRot, parts]
  );

  const handleCopy = () => {
    if (!evaluated.valid) return;
    const text = [
      '2D Sheet Metal Nesting Summary (Shelf Algorithm)',
      `Sheet: ${evaluated.sheetW} x ${evaluated.sheetH} mm (Kerf: ${evaluated.kerf} mm)`,
      `Material Utilization: ${evaluated.nesting.utilizationPct.toFixed(4)}%`,
      `Placed Parts: ${evaluated.nesting.placed.length} | Unplaced: ${evaluated.nesting.unplacedCount}`,
      `Used Area: ${evaluated.nesting.usedAreaMm2.toFixed(2)} mm^2 | Remaining Area: ${evaluated.wasteAreaMm2.toFixed(2)} mm^2`,
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-default"
          onClick={() => applyPreset('default')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: 1250x2500 ISO Standard 4-Part Mix
        </button>
        <button
          type="button"
          data-testid="preset-handcheck"
          onClick={() => applyPreset('handcheck')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Deterministic 1000x500 mm (4x 250x200, Kerf 0 -&gt; 40%)
        </button>
        <button
          type="button"
          data-testid="preset-laser600"
          onClick={() => applyPreset('laser600')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 3: Laser Bed 600x900 mm (Kerf 2 mm)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Sheet &amp; Kerf Parameters</span>
            </h2>
            <select
              data-testid="select-sheet-size"
              onChange={(e) => {
                const [w, h] = e.target.value.split('x');
                if (w && h) {
                  setSheetWStr(w);
                  setSheetHStr(h);
                }
              }}
              className="text-xs font-bold bg-slate-100 px-2.5 py-1.5 rounded-xl text-slate-700"
            >
              <option value="1250x2500">1250 x 2500 mm</option>
              <option value="1500x3000">1500 x 3000 mm</option>
              <option value="1219x2438">1219 x 2438 mm (4x8 ft)</option>
              <option value="600x900">600 x 900 mm</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Sheet Width (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sheet-w"
                value={sheetWStr}
                onChange={(e) => setSheetWStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Sheet Height (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sheet-h"
                value={sheetHStr}
                onChange={(e) => setSheetHStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Kerf / Gap (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-kerf"
                value={kerfStr}
                onChange={(e) => setKerfStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
            <label className="flex items-center gap-2 font-bold text-slate-700 pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={allowRot}
                onChange={(e) => setAllowRot(e.target.checked)}
              />
              <span>Allow 90 deg Rotation</span>
            </label>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase">Parts to Nest ({parts.length})</span>
              <div className="flex gap-1.5">
                <label className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-black cursor-pointer flex items-center gap-1">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>+ DXF</span>
                  <input
                    type="file"
                    accept=".dxf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleDxfPartImport(e.target.files[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setParts((prev) => [
                      ...prev,
                      {
                        id: `P${prev.length + 1}`,
                        name: `Part_${prev.length + 1}`,
                        widthStr: '200',
                        heightStr: '150',
                        qtyStr: '4',
                        color: COLORS[prev.length % COLORS.length],
                      },
                    ])
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-black flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {parts.map((p, idx) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => {
                        const next = [...parts];
                        next[idx] = { ...p, name: e.target.value };
                        setParts(next);
                      }}
                      className="flex-1 bg-white px-2 py-1 rounded border border-slate-200 font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setParts(parts.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">W (mm)</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p.widthStr}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, widthStr: e.target.value };
                          setParts(next);
                        }}
                        className="w-full px-2 py-1 bg-white rounded border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">H (mm)</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={p.heightStr}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, heightStr: e.target.value };
                          setParts(next);
                        }}
                        className="w-full px-2 py-1 bg-white rounded border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Qty</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={p.qtyStr}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, qtyStr: e.target.value };
                          setParts(next);
                        }}
                        className="w-full px-2 py-1 bg-white rounded border border-slate-200 font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset('default')}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              data-testid="btn-download-dxf"
              disabled={!evaluated.valid}
              onClick={() =>
                evaluated.valid &&
                downloadFile(evaluated.nesting.dxfText, `nested-sheet-${evaluated.sheetW}x${evaluated.sheetH}.dxf`)
              }
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export Nested Cut Sheet (.DXF)</span>
            </button>
            <button
              type="button"
              data-testid="btn-download-svg"
              disabled={!evaluated.valid}
              onClick={() =>
                evaluated.valid &&
                downloadFile(
                  evaluated.nesting.svgText,
                  `nested-sheet-${evaluated.sheetW}x${evaluated.sheetH}.svg`,
                  'image/svg+xml'
                )
              }
              className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black disabled:opacity-50"
            >
              Export Nested Layout (.SVG)
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-sm font-black text-slate-800">Browser-Local Shelf Nesting Output</span>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              disabled={!evaluated.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </button>
          </div>

          {!evaluated.valid ? (
            <div
              data-testid="validation-error"
              className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{evaluated.error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Material Utilization</div>
                  <div data-testid="out-utilization" className="text-2xl font-black text-blue-600 mt-1">
                    {evaluated.nesting.utilizationPct.toFixed(4)}%
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Parts Placed</div>
                  <div data-testid="out-placed" className="text-2xl font-black text-emerald-600 mt-1">
                    {evaluated.nesting.placed.length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Overflow / Unplaced</div>
                  <div data-testid="out-unplaced" className="text-2xl font-black text-rose-600 mt-1">
                    {evaluated.nesting.unplacedCount}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <div className="flex justify-between items-center text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span className="font-bold text-slate-200">
                    Sheet Layout ({evaluated.sheetW} x {evaluated.sheetH} mm | Kerf {evaluated.kerf} mm)
                  </span>
                  <span>
                    Used Area: <strong data-testid="out-used-m2">{(evaluated.nesting.usedAreaMm2 / 1e6).toFixed(4)}</strong> m^2
                  </span>
                </div>
                <div className="my-4 flex items-center justify-center bg-slate-950 rounded-2xl p-4">
                  <svg viewBox={`0 0 ${evaluated.sheetW} ${evaluated.sheetH}`} className="w-full max-h-[420px]">
                    <rect
                      x={0}
                      y={0}
                      width={evaluated.sheetW}
                      height={evaluated.sheetH}
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth={Math.max(2, evaluated.sheetW * 0.003)}
                    />
                    {evaluated.nesting.placed.map((p) => (
                      <g key={p.id}>
                        <rect
                          x={p.x}
                          y={p.y}
                          width={p.width}
                          height={p.height}
                          fill={p.color}
                          fillOpacity={0.28}
                          stroke={p.color}
                          strokeWidth={Math.max(1.5, evaluated.sheetW * 0.002)}
                        />
                        <text
                          x={p.x + p.width / 2}
                          y={p.y + p.height / 2}
                          fill="#f8fafc"
                          fontSize={Math.max(14, Math.min(p.width, p.height) * 0.14)}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {p.name} {p.rotated ? '(R)' : ''}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </>
          )}

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>
                Rectangular bounding-box shelf packing respects sheet margins and kerf clearances. Exported DXF (`AC1027`, `$INSUNITS=4` millimeters) and SVG contain pure-ASCII entities generated locally.
              </span>
            </div>
            <a
              href="https://en.wikipedia.org/wiki/AutoCAD_DXF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              AutoCAD DXF Format Specification (Wikipedia) <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
