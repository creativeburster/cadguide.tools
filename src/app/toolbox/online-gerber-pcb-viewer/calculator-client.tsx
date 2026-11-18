'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  UploadCloud,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import {
  getSampleGerberTopCopper,
  getSampleExcellonDrill,
  parseGerberAndDrill,
} from '@/lib/open-source-cad-engines';

const DETERMINISTIC_GERBER = [
  'G04 Deterministic 50x30 mm PCB Sample*',
  '%FSLAX24Y24*%',
  '%MOMM*%',
  '%ADD10C,0.2000*%',
  '%ADD11C,1.5000*%',
  'D10*',
  'X0Y0D02*',
  'X500000Y0D01*',
  'X500000Y300000D01*',
  'X0Y300000D01*',
  'X0Y0D01*',
  'D11*',
  'X50000Y50000D03*',
  'X450000Y50000D03*',
  'X450000Y250000D03*',
  'X50000Y250000D03*',
  'M02*',
].join('\n');

const DETERMINISTIC_DRILL = [
  'M48',
  'METRIC,TZ',
  'T01C1.000',
  '%',
  'G90',
  'T01',
  'X5.000Y5.000',
  'X45.000Y5.000',
  'X45.000Y25.000',
  'X5.000Y25.000',
  'M30',
].join('\n');

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

function evaluateGerberState(gerberText: string, drillText: string) {
  if (!gerberText.trim()) {
    return { valid: false as const, error: 'Gerber RS-274X source cannot be empty.' };
  }
  const parsed = parseGerberAndDrill(gerberText, drillText);
  if (parsed.primitives.length === 0) {
    return {
      valid: false as const,
      error: 'No valid Gerber traces (D01), pads (D03), or Excellon drill coordinates found.',
    };
  }
  const boardW = parsed.bbox.maxX - parsed.bbox.minX;
  const boardH = parsed.bbox.maxY - parsed.bbox.minY;
  const areaMm2 = boardW * boardH;
  return {
    valid: true as const,
    parsed,
    boardW,
    boardH,
    areaMm2,
  };
}

export default function OnlineGerberPcbViewerClient() {
  const [gerberText, setGerberText] = useState<string>(() => getSampleGerberTopCopper());
  const [drillText, setDrillText] = useState<string>(() => getSampleExcellonDrill());
  const [gerberFileName, setGerberFileName] = useState<string>('STM32_Breakout-F_Cu.gtl');
  const [showTraces, setShowTraces] = useState<boolean>(true);
  const [showPads, setShowPads] = useState<boolean>(true);
  const [showDrills, setShowDrills] = useState<boolean>(true);
  const [solderMaskTheme, setSolderMaskTheme] = useState<'green' | 'blue' | 'black'>('green');
  const [copied, setCopied] = useState(false);

  const evalResult = useMemo(() => evaluateGerberState(gerberText, drillText), [gerberText, drillText]);

  const applyPreset = (kind: 'stm32' | 'rect50x30') => {
    if (kind === 'stm32') {
      setGerberFileName('STM32_Breakout-F_Cu.gtl');
      setGerberText(getSampleGerberTopCopper());
      setDrillText(getSampleExcellonDrill());
    } else {
      setGerberFileName('TestBoard_50x30.gbr');
      setGerberText(DETERMINISTIC_GERBER);
      setDrillText(DETERMINISTIC_DRILL);
    }
  };

  const handleCopy = () => {
    if (!evalResult.valid) return;
    const text = [
      'Gerber RS-274X & Excellon Inspection Summary',
      `File: ${toSafeAscii(gerberFileName)}`,
      `Board Span: ${evalResult.boardW.toFixed(4)} x ${evalResult.boardH.toFixed(4)} mm (${evalResult.areaMm2.toFixed(4)} mm^2)`,
      `Traces (D01): ${evalResult.parsed.traceCount} | Flashed Pads (D03): ${evalResult.parsed.padCount} | Drills: ${evalResult.parsed.drillHoleCount}`,
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
    if (!evalResult.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `File Name,${toSafeAscii(gerberFileName).replace(/,/g, '_')},text`,
      `Board Width,${evalResult.boardW.toFixed(4)},mm`,
      `Board Height,${evalResult.boardH.toFixed(4)},mm`,
      `Board Area,${evalResult.areaMm2.toFixed(4)},mm^2`,
      `Apertures Defined,${evalResult.parsed.apertures.length},count`,
      `Copper Traces,${evalResult.parsed.traceCount},count`,
      `Flashed Pads,${evalResult.parsed.padCount},count`,
      `Excellon Drill Holes,${evalResult.parsed.drillHoleCount},count`,
    ];
    downloadFile(lines.join('\r\n') + '\r\n', 'gerber_inspection_summary.csv', 'text/csv;charset=utf-8');
  };

  const maskBg =
    solderMaskTheme === 'green' ? '#064e3b' : solderMaskTheme === 'blue' ? '#1e3a8a' : '#0f172a';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-stm32"
          onClick={() => applyPreset('stm32')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-emerald-500"
        >
          Preset 1: STM32 60x40 mm Breakout Board
        </button>
        <button
          type="button"
          data-testid="preset-rect50x30"
          onClick={() => applyPreset('rect50x30')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-emerald-500"
        >
          Preset 2: Deterministic 50x30 mm (4 Traces, 4 Pads, 4 Drills)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>Gerber &amp; Excellon Source</span>
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <label className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Load Gerber</span>
              <input
                type="file"
                accept=".gbr,.gtl,.gbl,.gts,.gbs,.gto,.gbo,.gko,.gm1,.pho,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setGerberFileName(toSafeAscii(f.name) || 'board.gbr');
                  f.text().then(setGerberText);
                }}
              />
            </label>
            <label className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
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

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Gerber RS-274X Text</label>
            <textarea
              data-testid="input-gerber"
              rows={8}
              value={gerberText}
              onChange={(e) => setGerberText(e.target.value)}
              spellCheck={false}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span>Copper Traces (D01)</span>
              <input type="checkbox" checked={showTraces} onChange={(e) => setShowTraces(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span>Flashed Pads (D03)</span>
              <input type="checkbox" checked={showPads} onChange={(e) => setShowPads(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 cursor-pointer">
              <span>Excellon Drill Hits</span>
              <input type="checkbox" checked={showDrills} onChange={(e) => setShowDrills(e.target.checked)} />
            </label>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset('stm32')}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              data-testid="btn-download-dxf"
              disabled={!evalResult.valid}
              onClick={() =>
                evalResult.valid &&
                downloadFile(
                  evalResult.parsed.dxfText,
                  `${(toSafeAscii(gerberFileName) || 'board').replace(/\.[^.]+$/, '')}_Mechanical.dxf`
                )
              }
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export PCB Geometry (.DXF)</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-sm font-black text-slate-800">Client-Side Gerber &amp; Excellon Analysis</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="btn-copy"
                onClick={handleCopy}
                disabled={!evalResult.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                data-testid="btn-download-csv"
                onClick={handleDownloadCsv}
                disabled={!evalResult.valid}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {!evalResult.valid ? (
            <div
              data-testid="validation-error"
              className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{evalResult.error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Board Size (mm)</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    <span data-testid="out-board-w">{evalResult.boardW.toFixed(2)}</span> x{' '}
                    <span data-testid="out-board-h">{evalResult.boardH.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Copper Traces</div>
                  <div data-testid="out-traces" className="text-lg font-black text-amber-600 mt-0.5">
                    {evalResult.parsed.traceCount}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Flashed Pads</div>
                  <div data-testid="out-pads" className="text-lg font-black text-emerald-600 mt-0.5">
                    {evalResult.parsed.padCount}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">NC Drill Holes</div>
                  <div data-testid="out-drills" className="text-lg font-black text-blue-600 mt-0.5">
                    {evalResult.parsed.drillHoleCount}
                  </div>
                </div>
              </div>

              {(() => {
                const bw = Math.max(10, evalResult.boardW);
                const bh = Math.max(10, evalResult.boardH);
                const pad = Math.max(bw, bh) * 0.1;
                const bb = evalResult.parsed.bbox;
                return (
                  <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                      <span className="font-bold text-slate-200">{gerberFileName} - CAM Viewport</span>
                      <div className="flex gap-1.5">
                        {(['green', 'blue', 'black'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSolderMaskTheme(t)}
                            className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                              solderMaskTheme === t ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {t} Mask
                          </button>
                        ))}
                      </div>
                    </div>

                    <svg
                      viewBox={`${bb.minX - pad} ${bb.minY - pad} ${bw + pad * 2} ${bh + pad * 2}`}
                      className="w-full h-80 rounded-2xl"
                      style={{ backgroundColor: maskBg }}
                    >
                      <g transform={`scale(1,-1) translate(0,${-(bb.minY + bb.maxY)})`}>
                        {showTraces &&
                          evalResult.parsed.primitives
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

                        {showPads &&
                          evalResult.parsed.primitives
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

                        {showDrills &&
                          evalResult.parsed.primitives
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
                );
              })()}
            </>
          )}

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>
                Parses Extended Gerber RS-274X (`%FSLAX...%`, `%MOMM*%`, `%ADD...%`, D01/D02/D03) and Excellon drill tool hits purely inside your browser.
              </span>
            </div>
            <a
              href="https://en.wikipedia.org/wiki/Gerber_format"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              Gerber RS-274X Specification (Wikipedia / Ucamco) <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
