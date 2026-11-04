'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Plus, Trash2, Download, UploadCloud, Sparkles } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { parseDxf, segmentsOf } from '@/lib/cad-file-analysis';
import { NestablePart, runSheetMetalNesting } from '@/lib/open-source-cad-engines';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

function downloadFile(content: string, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OnlineDxfSvgNestingClient() {
  const [sheetW, setSheetW] = useState<number>(1250);
  const [sheetH, setSheetH] = useState<number>(2500);
  const [kerf, setKerf] = useState<number>(5);
  const [allowRot, setAllowRot] = useState<boolean>(true);

  const [parts, setParts] = useState<NestablePart[]>([
    { id: 'P1', name: 'Base_Plate_304SS', width: 380, height: 260, qty: 6, color: '#3b82f6' },
    { id: 'P2', name: 'Gusset_Bracket_L', width: 220, height: 180, qty: 10, color: '#10b981' },
    { id: 'P3', name: 'Motor_Mount_Flange', width: 310, height: 310, qty: 4, color: '#f59e0b' },
    { id: 'P4', name: 'Stiffener_Rib', width: 450, height: 110, qty: 8, color: '#8b5cf6' },
  ]);

  const nestingResult = useMemo(
    () => runSheetMetalNesting(sheetW, sheetH, kerf, allowRot, parts),
    [sheetW, sheetH, kerf, allowRot, parts]
  );

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
          name: file.name.replace(/\.dxf$/i, ''),
          width: w,
          height: h,
          qty: 4,
          color: COLORS[prev.length % COLORS.length],
        },
      ]);
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Configuration Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Sheet & Kerf Parameters</span>
            </h2>
            <select
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                if (w && h) {
                  setSheetW(w);
                  setSheetH(h);
                }
              }}
              className="text-xs font-bold bg-slate-100 px-2.5 py-1.5 rounded-xl text-slate-700"
            >
              <option value="1250x2500">ISO 1250×2500 mm</option>
              <option value="1500x3000">ISO 1500×3000 mm</option>
              <option value="1219x2438">US 4×8 ft (1219×2438)</option>
              <option value="600x900">Laser Bed 600×900 mm</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Sheet Width (mm)</label>
              <input
                type="number"
                value={sheetW}
                onChange={(e) => setSheetW(Math.max(100, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Sheet Height (mm)</label>
              <input
                type="number"
                value={sheetH}
                onChange={(e) => setSheetH(Math.max(100, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Kerf / Part Gap (mm)</label>
              <input
                type="number"
                step="0.5"
                value={kerf}
                onChange={(e) => setKerf(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <label className="flex items-center gap-2 font-bold text-slate-700 pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={allowRot}
                onChange={(e) => setAllowRot(e.target.checked)}
              />
              <span>Allow 90° Rotation</span>
            </label>
          </div>

          {/* Part List */}
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
                        width: 200,
                        height: 150,
                        qty: 4,
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
                        type="number"
                        value={p.width}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, width: Math.max(5, Number(e.target.value)) };
                          setParts(next);
                        }}
                        className="w-full px-2 py-1 bg-white rounded border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">H (mm)</span>
                      <input
                        type="number"
                        value={p.height}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, height: Math.max(5, Number(e.target.value)) };
                          setParts(next);
                        }}
                        className="w-full px-2 py-1 bg-white rounded border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Qty</span>
                      <input
                        type="number"
                        value={p.qty}
                        onChange={(e) => {
                          const next = [...parts];
                          next[idx] = { ...p, qty: Math.max(1, Number(e.target.value)) };
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
              onClick={() => downloadFile(nestingResult.dxfText, `nested-sheet-${sheetW}x${sheetH}.dxf`)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Nested Cut Sheet (.DXF)</span>
            </button>
            <button
              type="button"
              onClick={() => downloadFile(nestingResult.svgText, `nested-sheet-${sheetW}x${sheetH}.svg`, 'image/svg+xml')}
              className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black"
            >
              Export Nested Layout (.SVG)
            </button>
          </div>
        </div>

        {/* Right Nesting Layout Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Material Utilization</div>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {nestingResult.utilizationPct.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Parts Placed</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{nestingResult.placed.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Overflow / Unplaced</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{nestingResult.unplacedCount}</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white">
            <div className="flex justify-between items-center text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-200">
                Sheet Layout Preview ({sheetW} × {sheetH} mm · Kerf {kerf} mm)
              </span>
              <span>Used Area: {(nestingResult.usedAreaMm2 / 1e6).toFixed(3)} m²</span>
            </div>
            <div className="my-4 flex items-center justify-center bg-slate-950 rounded-2xl p-4">
              <svg viewBox={`0 0 ${sheetW} ${sheetH}`} className="w-full max-h-[420px]">
                <rect
                  x={0}
                  y={0}
                  width={sheetW}
                  height={sheetH}
                  fill="#0f172a"
                  stroke="#475569"
                  strokeWidth={Math.max(2, sheetW * 0.003)}
                />
                {nestingResult.placed.map((p) => (
                  <g key={p.id}>
                    <rect
                      x={p.x}
                      y={p.y}
                      width={p.width}
                      height={p.height}
                      fill={p.color}
                      fillOpacity={0.28}
                      stroke={p.color}
                      strokeWidth={Math.max(1.5, sheetW * 0.002)}
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
                      {p.name} {p.rotated ? '↻' : ''}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
