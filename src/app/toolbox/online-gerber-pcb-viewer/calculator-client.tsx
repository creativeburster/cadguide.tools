'use client';

import React, { useState, useMemo } from 'react';
import { UploadCloud, Download, Cpu, Layers, Eye } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import {
  getSampleGerberTopCopper,
  getSampleExcellonDrill,
  parseGerberAndDrill,
} from '@/lib/open-source-cad-engines';

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

export default function OnlineGerberPcbViewerClient() {
  const [gerberText, setGerberText] = useState<string>(() => getSampleGerberTopCopper());
  const [drillText, setDrillText] = useState<string>(() => getSampleExcellonDrill());
  const [gerberFileName, setGerberFileName] = useState<string>('STM32_Breakout-F_Cu.gtl');

  const [showTraces, setShowTraces] = useState<boolean>(true);
  const [showPads, setShowPads] = useState<boolean>(true);
  const [showDrills, setShowDrills] = useState<boolean>(true);
  const [solderMaskTheme, setSolderMaskTheme] = useState<'green' | 'blue' | 'black'>('green');

  const parsed = useMemo(() => parseGerberAndDrill(gerberText, drillText), [gerberText, drillText]);

  const boardW = Math.max(10, parsed.bbox.maxX - parsed.bbox.minX);
  const boardH = Math.max(10, parsed.bbox.maxY - parsed.bbox.minY);
  const pad = Math.max(boardW, boardH) * 0.1;

  const maskBg =
    solderMaskTheme === 'green' ? '#064e3b' : solderMaskTheme === 'blue' ? '#1e3a8a' : '#0f172a';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gerber & Drill File Loader + Aperture & Tool Tables */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>Load Fabrication Files</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Supports RS-274X / Gerber X2 (`.gbr`, `.gtl`, `.gbl`, `.gko`) and Excellon NC Drill (`.drl`, `.txt`).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Load Gerber</span>
              <input
                type="file"
                accept=".gbr,.gtl,.gbl,.gts,.gbs,.gto,.gbo,.gko,.gm1,.pho,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setGerberFileName(f.name);
                  f.text().then(setGerberText);
                }}
              />
            </label>
            <label className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Load .DRL Drill</span>
              <input
                type="file"
                accept=".drl,.xln,.txt,.tap"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setDrillText)}
              />
            </label>
          </div>

          {/* Layer Visibility Controls */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="font-black text-slate-700 uppercase tracking-wider">Layer Stackup Visibility</div>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                Copper Traces (D01)
              </span>
              <input type="checkbox" checked={showTraces} onChange={(e) => setShowTraces(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block" />
                SMD / THT Flashed Pads (D03)
              </span>
              <input type="checkbox" checked={showPads} onChange={(e) => setShowPads(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
                Excellon NC Drill Hits
              </span>
              <input type="checkbox" checked={showDrills} onChange={(e) => setShowDrills(e.target.checked)} />
            </label>
          </div>

          {/* Aperture D-Code Table */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-black text-slate-700 uppercase">
              Gerber Aperture Table ({parsed.apertures.length})
            </div>
            <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">D-Code</th>
                    <th className="py-1.5 px-2.5">Shape</th>
                    <th className="py-1.5 px-2.5">Size (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsed.apertures.map((ap) => (
                    <tr key={ap.code}>
                      <td className="py-1 px-2.5 font-mono font-bold text-emerald-700">D{ap.code}</td>
                      <td className="py-1 px-2.5 font-semibold text-slate-700">
                        {ap.shape === 'C' ? 'Circle' : ap.shape === 'R' ? 'Rect' : 'Obround'}
                      </td>
                      <td className="py-1 px-2.5 font-mono text-slate-600">
                        {ap.shape === 'R' ? `${ap.width.toFixed(2)}×${ap.height.toFixed(2)}` : `Ø${ap.width.toFixed(3)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Excellon Drill Tool Table */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-black text-slate-700 uppercase">
              Excellon Drill Tools ({parsed.drillTools.length})
            </div>
            <div className="border border-slate-200 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-2.5">Tool</th>
                    <th className="py-1.5 px-2.5">Bit Ø (mm)</th>
                    <th className="py-1.5 px-2.5">Holes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsed.drillTools.map((t) => (
                    <tr key={t.code}>
                      <td className="py-1 px-2.5 font-mono font-bold text-blue-700">{t.code}</td>
                      <td className="py-1 px-2.5 font-mono text-slate-700">Ø{t.diaMm.toFixed(2)}</td>
                      <td className="py-1 px-2.5 font-black text-slate-900">{t.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              downloadFile(parsed.dxfText, `${gerberFileName.replace(/\.[^.]+$/, '')}_Mechanical.dxf`)
            }
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PCB Traces & Drills to .DXF</span>
          </button>
        </div>

        {/* Right: Interactive PCB Solder-Mask & Copper Viewport */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Board Size</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {boardW.toFixed(1)} × {boardH.toFixed(1)} mm
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Copper Traces</div>
              <div className="text-lg font-black text-amber-600 mt-0.5">{parsed.traceCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">Flashed Pads</div>
              <div className="text-lg font-black text-emerald-600 mt-0.5">{parsed.padCount}</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-[11px] font-black text-slate-400 uppercase">NC Drill Holes</div>
              <div className="text-lg font-black text-blue-600 mt-0.5">{parsed.drillHoleCount}</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-200">
                {gerberFileName} — Interactive CAM Artwork Viewport
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSolderMaskTheme('green')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    solderMaskTheme === 'green' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Green Mask
                </button>
                <button
                  type="button"
                  onClick={() => setSolderMaskTheme('blue')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    solderMaskTheme === 'blue' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Blue Mask
                </button>
                <button
                  type="button"
                  onClick={() => setSolderMaskTheme('black')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    solderMaskTheme === 'black' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Matte Black
                </button>
              </div>
            </div>

            <svg
              viewBox={`${parsed.bbox.minX - pad} ${parsed.bbox.minY - pad} ${boardW + pad * 2} ${boardH + pad * 2}`}
              className="w-full h-80 rounded-2xl"
              style={{ backgroundColor: maskBg }}
            >
              <g transform={`scale(1,-1) translate(0,${-(parsed.bbox.minY + parsed.bbox.maxY)})`}>
                {/* Copper Traces */}
                {showTraces &&
                  parsed.primitives
                    .filter((p) => p.kind === 'trace')
                    .map((p, i) => (
                      <line
                        key={`tr-${i}`}
                        x1={p.x1}
                        y1={p.y1}
                        x2={p.x2}
                        y2={p.y2}
                        stroke="#fbbf24"
                        strokeWidth={Math.max(0.25, p.width)}
                        strokeLinecap="round"
                      />
                    ))}

                {/* Flashed SMD & Through-Hole Pads */}
                {showPads &&
                  parsed.primitives
                    .filter((p) => p.kind === 'flash')
                    .map((p, i) =>
                      p.shape === 'R' ? (
                        <rect
                          key={`fl-${i}`}
                          x={p.x1 - p.width / 2}
                          y={p.y1 - (p.height || p.width) / 2}
                          width={p.width}
                          height={p.height || p.width}
                          fill="#fde047"
                          rx={0.15}
                        />
                      ) : (
                        <circle key={`fl-${i}`} cx={p.x1} cy={p.y1} r={p.width / 2} fill="#fde047" />
                      )
                    )}

                {/* Excellon Drill Plated Holes */}
                {showDrills &&
                  parsed.primitives
                    .filter((p) => p.kind === 'drill')
                    .map((p, i) => (
                      <circle
                        key={`dr-${i}`}
                        cx={p.x1}
                        cy={p.y1}
                        r={p.width / 2}
                        fill="#0f172a"
                        stroke="#38bdf8"
                        strokeWidth={0.15}
                      />
                    ))}
              </g>
            </svg>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
