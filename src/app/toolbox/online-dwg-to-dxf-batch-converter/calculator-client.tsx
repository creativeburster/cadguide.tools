'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const DWG_SIGNATURES: Record<string, string> = {
  AC1032: 'DWG 2018 (AutoCAD 2018-2026)',
  AC1027: 'DWG 2013 (AutoCAD 2013-2017)',
  AC1024: 'DWG 2010 (AutoCAD 2010-2012)',
  AC1021: 'DWG 2007 (AutoCAD 2007-2009)',
  AC1018: 'DWG 2004 (AutoCAD 2004-2006)',
  AC1015: 'DWG 2000 (AutoCAD 2000-2002)',
};

type TargetDxfOption = '2018' | '2013' | '2010' | '2007' | '2004' | '2000' | 'R12';

interface BatchPreset {
  id: string;
  label: string;
  targetFormat: TargetDxfOption;
  decimalPlaces: string;
  drawingCount: string;
  avgSecPerDrawing: string;
  fileListText: string;
}

const PRESETS: BatchPreset[] = [
  {
    id: 'dxf-2018-batch',
    label: 'Preset 1: 4 Drawings -> 2018 ASCII DXF (16 decimal places)',
    targetFormat: '2018',
    decimalPlaces: '16',
    drawingCount: '20',
    avgSecPerDrawing: '3',
    fileListText: 'floor_plan_L1.dwg\nfloor_plan_L2.dwg\nsection_AA.dwg\nsite_grading.dwg',
  },
  {
    id: 'dxf-2004-cnc',
    label: 'Preset 2: CNC Profiles -> 2004 DXF (6 decimal places)',
    targetFormat: '2004',
    decimalPlaces: '6',
    drawingCount: '50',
    avgSecPerDrawing: '2',
    fileListText: 'bracket_cut.dwg\nflange_plate.dwg',
  },
  {
    id: 'dxf-r12-legacy',
    label: 'Preset 3: Legacy Plotter -> R12 DXF (8 decimal places)',
    targetFormat: 'R12',
    decimalPlaces: '8',
    drawingCount: '12',
    avgSecPerDrawing: '2.5',
    fileListText: 'logo_outline.dwg',
  },
];

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function OnlineDwgToDxfBatchConverterClient() {
  const [targetFormat, setTargetFormat] = useState<TargetDxfOption>('2018');
  const [decimalPlacesStr, setDecimalPlacesStr] = useState('16');
  const [drawingCountStr, setDrawingCountStr] = useState('20');
  const [avgSecStr, setAvgSecStr] = useState('3');
  const [fileListText, setFileListText] = useState(PRESETS[0].fileListText);
  const [detectedHeader, setDetectedHeader] = useState('No local .dwg inspected yet (optional 6-byte magic check)');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: BatchPreset) => {
    setTargetFormat(p.targetFormat);
    setDecimalPlacesStr(p.decimalPlaces);
    setDrawingCountStr(p.drawingCount);
    setAvgSecStr(p.avgSecPerDrawing);
    setFileListText(p.fileListText);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setDetectedHeader('No local .dwg inspected yet (optional 6-byte magic check)');
  };

  const handleLocalDwgHeader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.slice(0, 6).arrayBuffer());
    const ascii = Array.from(bytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '?'))
      .join('');
    const matched = DWG_SIGNATURES[ascii];
    setDetectedHeader(
      matched
        ? `${file.name}: ${ascii} (${matched}, 0 bytes uploaded)`
        : `${file.name}: leading bytes "${ascii || 'empty'}" (unrecognized AC10xx signature)`
    );
  };

  const result = useMemo(() => {
    const decimals = parsePosInt(decimalPlacesStr);
    const count = parsePosInt(drawingCountStr);
    const secPerDwg = parsePositive(avgSecStr);
    const drawings = fileListText
      .split(/\r?\n/)
      .map((l) => toSafeAscii(l).trim())
      .filter(Boolean);

    if (!Number.isFinite(decimals) || decimals > 16 || !Number.isFinite(count) || !Number.isFinite(secPerDwg)) {
      return {
        valid: false as const,
        error: 'Decimal places must be an integer 1..16; drawing count must be >= 1; sec/drawing > 0.',
      };
    }
    if (drawings.length === 0) {
      return {
        valid: false as const,
        error: 'Provide at least one drawing filename (e.g., floor_plan_L1.dwg) to generate a SAVEAS DXF script.',
      };
    }

    const totalSec = count * secPerDwg;
    const totalMin = totalSec / 60;
    const lines = [
      '; Pure-ASCII AutoCAD Core Console (accoreconsole.exe) SAVEAS DXF Script',
      'CMDECHO 0',
      ...drawings.flatMap((dwg) => {
        const clean = dwg.replace(/"/g, '');
        const base = clean.replace(/\.dwg$/i, '');
        return [
          `OPEN "${clean}"`,
          `SAVEAS DXF ${decimals} "${base}.dxf" V ${targetFormat} Y`,
          'CLOSE',
        ];
      }),
      'CMDECHO 1',
    ];

    return {
      valid: true as const,
      listedCount: drawings.length,
      totalSec,
      totalMin,
      scriptText: lines.join('\n'),
    };
  }, [targetFormat, decimalPlacesStr, drawingCountStr, avgSecStr, fileListText]);

  const handleCopy = () => {
    if (!result.valid) return;
    navigator.clipboard
      .writeText(result.scriptText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadScr = () => {
    if (!result.valid) return;
    const blob = new Blob([toSafeAscii(result.scriptText) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_dwg_to_dxf_saveas.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local Header Inspector &amp; Batch Script Generator Only:</span> Checks `.dwg` 6-byte `AC10xx` signatures in your browser (`0 bytes uploaded`) and builds AutoCAD Core Console `SAVEAS` DXF scripts. Binary DWG-to-DXF translation executes locally using AutoCAD Core Console (`accoreconsole.exe`) or desktop converters such as ODA File Converter.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">Batch Settings</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Check Local .dwg Magic
              <input type="file" accept=".dwg" onChange={handleLocalDwgHeader} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{detectedHeader}</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Target DXF Version</label>
              <select
                data-testid="select-target-format"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as TargetDxfOption)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="2018">DXF 2018</option>
                <option value="2013">DXF 2013</option>
                <option value="2010">DXF 2010</option>
                <option value="2007">DXF 2007</option>
                <option value="2004">DXF 2004</option>
                <option value="2000">DXF 2000</option>
                <option value="R12">DXF R12</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Precision (1-16)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-decimals"
                value={decimalPlacesStr}
                onChange={(e) => setDecimalPlacesStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Batch File Count</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-count"
                value={drawingCountStr}
                onChange={(e) => setDrawingCountStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Est. Sec / Drawing</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sec-per-dwg"
                value={avgSecStr}
                onChange={(e) => setAvgSecStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Drawing List (1 per line)</label>
            <textarea
              data-testid="input-file-list"
              rows={5}
              value={fileListText}
              onChange={(e) => setFileListText(e.target.value)}
              spellCheck={false}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
            />
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Throughput Estimate &amp; SAVEAS Script</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-scr"
                  onClick={handleDownloadScr}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
              </div>
            </div>

            {!result.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Scripted Drawings</div>
                    <div data-testid="out-listed-count" className="text-2xl font-black text-blue-900 mt-1">
                      {result.listedCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Batch Time (sec)</div>
                    <div data-testid="out-total-sec" className="text-2xl font-black text-emerald-900 mt-1">
                      {result.totalSec.toFixed(4)}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Batch Time (min)</div>
                    <div data-testid="out-total-min" className="text-2xl font-black text-slate-900 mt-1">
                      {result.totalMin.toFixed(4)}
                    </div>
                  </div>
                </div>

                <pre
                  data-testid="out-script"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto"
                >
                  {result.scriptText}
                </pre>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Generates sequential `OPEN` / `SAVEAS DXF` / `CLOSE` commands suitable for headless AutoCAD Core Console (`accoreconsole.exe`), or prepare inputs for offline ODA File Converter CLI batches.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-4C171EC0-CF59-49C2-85F8-E616E88D20F2.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 DXF OPEN/SAVEAS Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.opendesign.com/guestfiles/oda_file_converter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  ODA File Converter CLI/GUI <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/DWG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  DWG Format Signature Table <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
