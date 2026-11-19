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
  Printer,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

interface PaperPreset {
  id: string;
  label: string;
  paperName: string;
  widthMm: string;
  heightMm: string;
  scaleDenom: string;
  dpi: string;
  channels: '3' | '4';
  pdfshx: '0' | '1' | '2';
}

interface LocalCadPreflight {
  fileName: string;
  fileBytes: number;
  format: 'DWG' | 'DXF' | 'Unsupported';
  versionTag: string;
  generationLabel: string;
  summaryNote: string;
  suggestedPdfName: string;
}

const DWG_GENERATIONS: Record<string, string> = {
  AC1015: 'AutoCAD 2000-2002',
  AC1018: 'AutoCAD 2004-2006',
  AC1021: 'AutoCAD 2007-2009',
  AC1024: 'AutoCAD 2010-2012',
  AC1027: 'AutoCAD 2013-2017',
  AC1032: 'AutoCAD 2018-2026',
};

const PRESETS: PaperPreset[] = [
  {
    id: 'a1-300dpi',
    label: 'Preset 1: ISO A1 (841x594 mm, 1:100, 300 DPI, PDFSHX=2)',
    paperName: 'ISO full bleed A1 (841.00 x 594.00 MM)',
    widthMm: '841',
    heightMm: '594',
    scaleDenom: '100',
    dpi: '300',
    channels: '3',
    pdfshx: '2',
  },
  {
    id: 'a3-600dpi',
    label: 'Preset 2: ISO A3 (420x297 mm, 1:50, 600 DPI)',
    paperName: 'ISO full bleed A3 (420.00 x 297.00 MM)',
    widthMm: '420',
    heightMm: '297',
    scaleDenom: '50',
    dpi: '600',
    channels: '3',
    pdfshx: '1',
  },
  {
    id: 'arch-d-exact',
    label: 'Preset 3: 508x254 mm Exact Inch Check (20x10 in @ 100 DPI = 2000x1000 px)',
    paperName: 'Custom (508.00 x 254.00 MM)',
    widthMm: '508',
    heightMm: '254',
    scaleDenom: '50',
    dpi: '100',
    channels: '3',
    pdfshx: '2',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function fmt(n: number, decimals = 4): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : 'N/A';
}

function toPdfOutputName(fileName: string): string {
  const clean = toSafeAscii(fileName).trim();
  const base = clean.replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9._-]/g, '_');
  return (base || 'output_sheet') + '.pdf';
}

function inspectLocalCadFile(fileName: string, buf: ArrayBuffer): LocalCadPreflight {
  const bytes = new Uint8Array(buf);
  const suggestedPdfName = toPdfOutputName(fileName);

  if (bytes.length >= 6) {
    let magic = '';
    for (let i = 0; i < 6; i++) {
      magic += String.fromCharCode(bytes[i]);
    }
    if (/^AC10\d{2}$/.test(magic)) {
      return {
        fileName: toSafeAscii(fileName) || 'drawing.dwg',
        fileBytes: bytes.length,
        format: 'DWG',
        versionTag: magic,
        generationLabel: DWG_GENERATIONS[magic] || 'Legacy / Extended DWG',
        summaryNote: `Verified binary DWG signature ${magic} (${bytes.length} bytes).`,
        suggestedPdfName,
      };
    }
  }

  const sliceLen = Math.min(bytes.length, 4 * 1024 * 1024);
  const text = new TextDecoder('latin1').decode(bytes.subarray(0, sliceLen));
  const lines = text.split(/\r?\n/);
  const isDxf = fileName.toLowerCase().endsWith('.dxf') || (text.includes('SECTION') && text.includes('EOF'));

  if (isDxf) {
    let acadVer = 'Unknown';
    let insunits = 'Unspecified';
    let entityCount = 0;
    let inEntities = false;

    for (let i = 0; i + 1 < lines.length; i += 2) {
      const code = lines[i].trim();
      const val = lines[i + 1].trim();
      if (code === '9' && val === '$ACADVER' && i + 3 < lines.length && lines[i + 2].trim() === '1') {
        acadVer = lines[i + 3].trim();
      } else if (code === '9' && val === '$INSUNITS' && i + 3 < lines.length && lines[i + 2].trim() === '70') {
        insunits = lines[i + 3].trim();
      } else if (code === '2' && val === 'ENTITIES') {
        inEntities = true;
      } else if (code === '0' && val === 'ENDSEC' && inEntities) {
        inEntities = false;
      } else if (inEntities && code === '0') {
        entityCount += 1;
      }
    }

    return {
      fileName: toSafeAscii(fileName) || 'drawing.dxf',
      fileBytes: bytes.length,
      format: 'DXF',
      versionTag: acadVer,
      generationLabel: DWG_GENERATIONS[acadVer] || 'ASCII DXF Stream',
      summaryNote: `DXF $INSUNITS=${insunits}, detected ${entityCount} ENTITIES objects.`,
      suggestedPdfName,
    };
  }

  return {
    fileName: toSafeAscii(fileName) || 'unknown_file',
    fileBytes: bytes.length,
    format: 'Unsupported',
    versionTag: 'Unrecognized',
    generationLabel: 'Not a recognized AC10xx DWG or ASCII DXF file',
    summaryNote: 'Select a valid .dwg or ASCII .dxf drawing file to run header preflight.',
    suggestedPdfName: 'output_sheet.pdf',
  };
}

export default function OnlineDwgToPdfCloudPrinterClient() {
  const [paperName, setPaperName] = useState(PRESETS[0].paperName);
  const [widthMmStr, setWidthMmStr] = useState('841');
  const [heightMmStr, setHeightMmStr] = useState('594');
  const [scaleDenomStr, setScaleDenomStr] = useState('100');
  const [dpiStr, setDpiStr] = useState('300');
  const [channels, setChannels] = useState<'3' | '4'>('3');
  const [pdfshx, setPdfshx] = useState<'0' | '1' | '2'>('2');
  const [ctbFile, setCtbFile] = useState('monochrome.ctb');
  const [preflight, setPreflight] = useState<LocalCadPreflight | null>(null);
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: PaperPreset) => {
    setPaperName(p.paperName);
    setWidthMmStr(p.widthMm);
    setHeightMmStr(p.heightMm);
    setScaleDenomStr(p.scaleDenom);
    setDpiStr(p.dpi);
    setChannels(p.channels);
    setPdfshx(p.pdfshx);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setCtbFile('monochrome.ctb');
    setPreflight(null);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.arrayBuffer().then((buf) => {
      setPreflight(inspectLocalCadFile(file.name, buf));
    }).catch(() => {});
  };

  const result = useMemo(() => {
    const wMm = parsePositive(widthMmStr);
    const hMm = parsePositive(heightMmStr);
    const scaleDen = parsePositive(scaleDenomStr);
    const dpi = parsePositive(dpiStr);
    const ch = Number(channels);

    if (!Number.isFinite(wMm) || !Number.isFinite(hMm) || !Number.isFinite(scaleDen) || !Number.isFinite(dpi)) {
      return {
        valid: false as const,
        error: 'Sheet width, height, scale denominator, and DPI must all be positive numbers (> 0).',
      };
    }

    const pxW = (wMm / 25.4) * dpi;
    const pxH = (hMm / 25.4) * dpi;
    const megapixels = (pxW * pxH) / 1e6;
    const rawRasterMb = (pxW * pxH * ch) / (1024 * 1024);
    const modelWidthM = (wMm * scaleDen) / 1000;
    const modelHeightM = (hMm * scaleDen) / 1000;

    const cleanPaper = toSafeAscii(paperName).trim() || 'ISO full bleed A1 (841.00 x 594.00 MM)';
    const cleanCtb = toSafeAscii(ctbFile).trim() || 'monochrome.ctb';
    const outPdf = preflight && preflight.format !== 'Unsupported' ? preflight.suggestedPdfName : 'output_sheet.pdf';

    const scriptText = [
      '; Pure-ASCII AutoCAD -PLOT PDF Script (DWG To PDF.pc3)',
      'CMDECHO 0',
      `PDFSHX ${pdfshx}`,
      '-PLOT',
      'Y',
      'Model',
      'DWG To PDF.pc3',
      cleanPaper,
      'Millimeters',
      'Landscape',
      'No',
      'Extents',
      `1=${scaleDen}`,
      'Center',
      'Yes',
      cleanCtb,
      'Yes',
      'As displayed',
      outPdf,
      'No',
      'Yes',
      'CMDECHO 1',
    ].join('\n');

    return {
      valid: true as const,
      pxW,
      pxH,
      megapixels,
      rawRasterMb,
      modelWidthM,
      modelHeightM,
      scriptText,
    };
  }, [paperName, widthMmStr, heightMmStr, scaleDenomStr, dpiStr, channels, pdfshx, ctbFile, preflight]);

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
    a.download = 'dwg_to_pdf_plot.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">In-Browser DWG/DXF Header Preflight &amp; Plot DPI Estimator:</span> Reads local `.dwg` version bytes (`AC1015`-`AC1032`) or ASCII `.dxf` entities directly in memory (`0 bytes uploaded`), computes sheet pixel footprint and uncompressed raster buffer, and exports an AutoCAD `-PLOT` (`DWG To PDF.pc3`) script. Actual vector PDF plotting executes locally in desktop CAD.
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
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Local File &amp; Plot Inputs</h2>
            </div>
            <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Inspect .DWG/.DXF</span>
              <input
                type="file"
                accept=".dwg,.dxf"
                data-testid="input-local-file"
                className="hidden"
                onChange={handleLocalFileChange}
              />
            </label>
          </div>

          {preflight && (
            <div
              data-testid="out-file-preflight"
              className={`p-3 rounded-2xl border text-xs space-y-1 ${
                preflight.format === 'Unsupported'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <div className="font-black">
                {preflight.fileName} — {preflight.format} {preflight.versionTag} ({preflight.generationLabel})
              </div>
              <div className="font-medium">{preflight.summaryNote}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Sheet Width (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-width-mm"
                value={widthMmStr}
                onChange={(e) => setWidthMmStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Sheet Height (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-height-mm"
                value={heightMmStr}
                onChange={(e) => setHeightMmStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Plot Scale (1 : S)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-scale-denom"
                value={scaleDenomStr}
                onChange={(e) => setScaleDenomStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Target Raster DPI</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-dpi"
                value={dpiStr}
                onChange={(e) => setDpiStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Color Depth</label>
              <select
                data-testid="select-channels"
                value={channels}
                onChange={(e) => setChannels(e.target.value as '3' | '4')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="3">RGB 24-bit (3 B/px)</option>
                <option value="4">RGBA 32-bit (4 B/px)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">PDFSHX Setting</label>
              <select
                data-testid="select-pdfshx"
                value={pdfshx}
                onChange={(e) => setPdfshx(e.target.value as '0' | '1' | '2')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="0">0 (No SHX comments)</option>
                <option value="1">1 (PDF comments)</option>
                <option value="2">2 (Hidden searchable text)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Plot Style Table (.ctb)</label>
            <input
              type="text"
              data-testid="input-ctb"
              value={ctbFile}
              onChange={(e) => setCtbFile(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
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
              <h2 className="text-lg font-black text-slate-900">Raster Metrics &amp; -PLOT Script</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Raster Pixel Dimensions</div>
                    <div className="text-xl font-black text-blue-900 mt-1">
                      <span data-testid="out-px-w">{fmt(result.pxW, 2)}</span> x <span data-testid="out-px-h">{fmt(result.pxH, 2)}</span> px
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Uncompressed Raster Buffer</div>
                    <div className="text-xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-raster-mb">{fmt(result.rawRasterMb)}</span> MB ({fmt(result.megapixels)} MP)
                    </div>
                  </div>
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-600">Model Space Real-World Span</span>
                    <span className="text-lg font-black text-slate-900">
                      <span data-testid="out-model-w">{fmt(result.modelWidthM)}</span> m x {fmt(result.modelHeightM)} m
                    </span>
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
                  1 inch = 25.4 mm exact conversion. `-PLOT` runs command-line plotting in AutoCAD / Core Console, while `PDFSHX` controls whether SHX text objects export as PDF comments (`1`) or hidden searchable text (`2`).
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-625E395D-143A-494F-A1EA-1BF119B927DC.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 -PLOT Command Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-56EA988C-A1DA-4E85-8765-B3F31A01AB02.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 PDFSHX Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/DWG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  DWG Version Codes (Wikipedia) <ExternalLink className="w-3 h-3" />
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
