'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Info,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

interface RasterPreset {
  id: string;
  label: string;
  imageFile: string;
  pixelWidth: string;
  pixelHeight: string;
  scanDpi: string;
  refLinePx: string;
  refLineMm: string;
}

interface LocalRasterPreflight {
  fileName: string;
  fileBytes: number;
  format: 'PNG' | 'JPEG' | 'BMP' | 'Unsupported';
  widthPx: number;
  heightPx: number;
  dpi: number | null;
  note: string;
}

const PRESETS: RasterPreset[] = [
  {
    id: 'calibrated-a3',
    label: 'Preset 1: 300 DPI Scan Calibration (4960x3508 px, 1000 px = 100 mm -> 0.1 mm/px)',
    imageFile: 'scanned_blueprint_a3.png',
    pixelWidth: '4960',
    pixelHeight: '3508',
    scanDpi: '300',
    refLinePx: '1000',
    refLineMm: '100',
  },
  {
    id: '254dpi-exact',
    label: 'Preset 2: Exact 254 DPI Check (2540x1270 px, 500 px = 50 mm -> 0.1 mm/px, 0% drift)',
    imageFile: 'survey_sketch.jpg',
    pixelWidth: '2540',
    pixelHeight: '1270',
    scanDpi: '254',
    refLinePx: '500',
    refLineMm: '50',
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

function inspectLocalRasterImage(fileName: string, buf: ArrayBuffer): LocalRasterPreflight {
  const bytes = new Uint8Array(buf);
  const view = new DataView(buf);
  const cleanName = toSafeAscii(fileName).trim() || 'scan_image';

  // PNG: 8-byte signature + IHDR + optional pHYs chunk
  if (
    bytes.length >= 33 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a &&
    bytes[12] === 0x49 &&
    bytes[13] === 0x48 &&
    bytes[14] === 0x44 &&
    bytes[15] === 0x52
  ) {
    const widthPx = view.getUint32(16, false);
    const heightPx = view.getUint32(20, false);
    let dpi: number | null = null;
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const len = view.getUint32(offset, false);
      const c0 = bytes[offset + 4];
      const c1 = bytes[offset + 5];
      const c2 = bytes[offset + 6];
      const c3 = bytes[offset + 7];
      // pHYs = 0x70 0x48 0x59 0x73
      if (c0 === 0x70 && c1 === 0x48 && c2 === 0x59 && c3 === 0x73 && len === 9 && offset + 17 <= bytes.length) {
        const xPpu = view.getUint32(offset + 8, false);
        const unit = bytes[offset + 16];
        if (unit === 1 && xPpu > 0) {
          dpi = Math.round(xPpu * 0.0254);
        }
        break;
      }
      if (c0 === 0x49 && c1 === 0x45 && c2 === 0x4e && c3 === 0x44) break;
      const next = offset + 12 + len;
      if (next <= offset) break;
      offset = next;
    }
    return {
      fileName: cleanName,
      fileBytes: bytes.length,
      format: 'PNG',
      widthPx,
      heightPx,
      dpi,
      note: dpi ? `Read PNG IHDR (${widthPx} x ${heightPx} px) and pHYs header (${dpi} DPI).` : `Read PNG IHDR (${widthPx} x ${heightPx} px); no pHYs DPI chunk.`,
    };
  }

  // JPEG: SOI (FF D8), APP0 JFIF DPI, and SOFn dimensions
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let off = 2;
    let widthPx = 0;
    let heightPx = 0;
    let dpi: number | null = null;
    while (off + 4 <= bytes.length) {
      if (bytes[off] !== 0xff) break;
      while (off < bytes.length && bytes[off] === 0xff) off += 1;
      if (off >= bytes.length) break;
      const marker = bytes[off];
      off += 1;
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (off + 2 > bytes.length) break;
      const segLen = view.getUint16(off, false);
      if (segLen < 2 || off + segLen > bytes.length) break;
      if (
        marker === 0xe0 &&
        segLen >= 14 &&
        bytes[off + 2] === 0x4a &&
        bytes[off + 3] === 0x46 &&
        bytes[off + 4] === 0x49 &&
        bytes[off + 5] === 0x46 &&
        bytes[off + 6] === 0x00
      ) {
        const units = bytes[off + 9];
        const xDens = view.getUint16(off + 10, false);
        if (units === 1 && xDens > 0) dpi = xDens;
        else if (units === 2 && xDens > 0) dpi = Math.round(xDens * 2.54);
      } else if ((marker === 0xc0 || marker === 0xc1 || marker === 0xc2 || marker === 0xc3) && segLen >= 7) {
        heightPx = view.getUint16(off + 3, false);
        widthPx = view.getUint16(off + 5, false);
      }
      off += segLen;
    }
    if (widthPx > 0 && heightPx > 0) {
      return {
        fileName: cleanName,
        fileBytes: bytes.length,
        format: 'JPEG',
        widthPx,
        heightPx,
        dpi,
        note: dpi ? `Read JPEG SOF (${widthPx} x ${heightPx} px) and JFIF APP0 (${dpi} DPI).` : `Read JPEG SOF (${widthPx} x ${heightPx} px); no JFIF DPI tag.`,
      };
    }
  }

  // BMP: 'BM' header
  if (bytes.length >= 42 && bytes[0] === 0x42 && bytes[1] === 0x4d) {
    const widthPx = Math.abs(view.getInt32(18, true));
    const heightPx = Math.abs(view.getInt32(22, true));
    const xPpm = view.getInt32(38, true);
    const dpi = xPpm > 0 ? Math.round(xPpm * 0.0254) : null;
    if (widthPx > 0 && heightPx > 0) {
      return {
        fileName: cleanName,
        fileBytes: bytes.length,
        format: 'BMP',
        widthPx,
        heightPx,
        dpi,
        note: dpi ? `Read BMP DIB header (${widthPx} x ${heightPx} px, ${dpi} DPI).` : `Read BMP DIB header (${widthPx} x ${heightPx} px).`,
      };
    }
  }

  return {
    fileName: cleanName,
    fileBytes: bytes.length,
    format: 'Unsupported',
    widthPx: 0,
    heightPx: 0,
    dpi: null,
    note: 'Select a valid PNG, JPEG, or BMP raster file to read dimensions and DPI locally.',
  };
}

function computeCalibration(
  imageFile: string,
  pxWStr: string,
  pxHStr: string,
  dpiStr: string,
  refPxStr: string,
  refMmStr: string
) {
  const pxW = parsePositive(pxWStr);
  const pxH = parsePositive(pxHStr);
  const dpi = parsePositive(dpiStr);
  const refPx = parsePositive(refPxStr);
  const refMm = parsePositive(refMmStr);

  if (!Number.isFinite(pxW) || !Number.isFinite(pxH) || !Number.isFinite(dpi) || !Number.isFinite(refPx) || !Number.isFinite(refMm)) {
    return {
      valid: false as const,
      error: 'All pixel dimensions, scan DPI, reference pixel span, and physical length (mm) must be > 0.',
    };
  }

  const mmPerPx = refMm / refPx;
  const nominalMmPerPx = 25.4 / dpi;
  const calibratedWidthMm = pxW * mmPerPx;
  const calibratedHeightMm = pxH * mmPerPx;
  const scaleDeviationPct = ((mmPerPx - nominalMmPerPx) / nominalMmPerPx) * 100;

  const cleanImg = toSafeAscii(imageFile).trim() || 'scan.png';
  const scrText = [
    '; Pure-ASCII AutoCAD IMAGEATTACH Calibration Script',
    'CMDECHO 0',
    `-IMAGE A "${cleanImg}" 0,0 ${calibratedWidthMm.toFixed(4)} 0`,
    'ZOOM E',
    'CMDECHO 1',
  ].join('\n');

  const dxfText = [
    '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1027', '9', '$INSUNITS', '70', '4', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
    '0', 'LWPOLYLINE', '8', 'RASTER_CALIBRATION_FRAME', '70', '1',
    '10', '0', '20', '0',
    '10', calibratedWidthMm.toFixed(4), '20', '0',
    '10', calibratedWidthMm.toFixed(4), '20', calibratedHeightMm.toFixed(4),
    '10', '0', '20', calibratedHeightMm.toFixed(4),
    '0', 'LINE', '8', 'CALIBRATION_SCALE_BAR',
    '10', '0', '20', '0', '11', refMm.toFixed(4), '21', '0',
    '0', 'ENDSEC', '0', 'EOF',
  ].join('\n');

  return {
    valid: true as const,
    mmPerPx,
    nominalMmPerPx,
    calibratedWidthMm,
    calibratedHeightMm,
    scaleDeviationPct,
    scrText,
    dxfText,
  };
}

export default function OnlineImageJpgToDxfVectorizerClient() {
  const [imageFile, setImageFile] = useState('scanned_blueprint_a3.png');
  const [pxWStr, setPxWStr] = useState('4960');
  const [pxHStr, setPxHStr] = useState('3508');
  const [dpiStr, setDpiStr] = useState('300');
  const [refPxStr, setRefPxStr] = useState('1000');
  const [refMmStr, setRefMmStr] = useState('100');
  const [preflight, setPreflight] = useState<LocalRasterPreflight | null>(null);
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: RasterPreset) => {
    setImageFile(p.imageFile);
    setPxWStr(p.pixelWidth);
    setPxHStr(p.pixelHeight);
    setDpiStr(p.scanDpi);
    setRefPxStr(p.refLinePx);
    setRefMmStr(p.refLineMm);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setPreflight(null);
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.arrayBuffer().then((buf) => {
      const info = inspectLocalRasterImage(file.name, buf);
      setPreflight(info);
      if (info.format !== 'Unsupported' && info.widthPx > 0 && info.heightPx > 0) {
        setImageFile(info.fileName);
        setPxWStr(String(info.widthPx));
        setPxHStr(String(info.heightPx));
        if (info.dpi && info.dpi > 0) {
          setDpiStr(String(info.dpi));
        }
      }
    }).catch(() => {});
  };

  const evalRes = useMemo(
    () => computeCalibration(imageFile, pxWStr, pxHStr, dpiStr, refPxStr, refMmStr),
    [imageFile, pxWStr, pxHStr, dpiStr, refPxStr, refMmStr]
  );

  const handleCopy = () => {
    if (!evalRes.valid) return;
    navigator.clipboard
      .writeText(evalRes.scrText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([toSafeAscii(text) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local Raster Inspector &amp; DXF Calibration Generator:</span> Reads local PNG (`IHDR` / `pHYs`), JPEG (`SOF` / `JFIF`), or BMP dimensions and DPI metadata directly in your browser (`0 bytes uploaded`), computes exact mm/px scale calibration, and exports a `1:1` DXF calibration frame + AutoCAD `IMAGEATTACH` script. Automatic vector contour tracing executes in desktop CAD/rasterize tools.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Raster Dimensions &amp; File</h2>
            </div>
            <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Inspect Image</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.bmp"
                data-testid="input-local-file"
                className="hidden"
                onChange={handleLocalImageUpload}
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
                {preflight.fileName} — {preflight.format} ({preflight.fileBytes} bytes)
              </div>
              <div className="font-medium">{preflight.note}</div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Image Filename</label>
            <input
              type="text"
              data-testid="input-img-file"
              value={imageFile}
              onChange={(e) => setImageFile(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Width (px)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-px-w"
                value={pxWStr}
                onChange={(e) => setPxWStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Height (px)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-px-h"
                value={pxHStr}
                onChange={(e) => setPxHStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Ref Segment (px)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ref-px"
                value={refPxStr}
                onChange={(e) => setRefPxStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">True Length (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ref-mm"
                value={refMmStr}
                onChange={(e) => setRefMmStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Nominal Scan DPI</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-dpi"
              value={dpiStr}
              onChange={(e) => setDpiStr(e.target.value)}
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
              <h2 className="text-lg font-black text-slate-900">Calibrated Scale &amp; CAD Reference</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!evalRes.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy SCR'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-dxf"
                  onClick={() => evalRes.valid && downloadText(evalRes.dxfText, 'calibration_frame.dxf')}
                  disabled={!evalRes.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .DXF
                </button>
                <button
                  type="button"
                  data-testid="btn-download-scr"
                  onClick={() => evalRes.valid && downloadText(evalRes.scrText, 'imageattach_calibrated.scr')}
                  disabled={!evalRes.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
              </div>
            </div>

            {!evalRes.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalRes.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Calibrated Scale Factor</div>
                    <div className="text-2xl font-black text-blue-900 mt-1">
                      <span data-testid="out-mm-per-px">{evalRes.mmPerPx.toFixed(6)}</span> mm/px
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Calibrated Sheet (mm)</div>
                    <div className="text-xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-cal-w">{evalRes.calibratedWidthMm.toFixed(4)}</span> x{' '}
                      <span data-testid="out-cal-h">{evalRes.calibratedHeightMm.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-600">Deviation vs Nominal DPI Scale</span>
                    <span data-testid="out-dev-pct" className="text-lg font-black text-slate-900">
                      {evalRes.scaleDeviationPct.toFixed(4)}%
                    </span>
                  </div>
                </div>

                <pre
                  data-testid="out-script"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto"
                >
                  {evalRes.scrText}
                </pre>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Generates an AutoCAD `IMAGEATTACH` command macro sized to the calibrated physical width and a 1:1 millimeter DXF boundary reference frame.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-0F75E36F-6138-424C-9510-5847CE1D8852.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 IMAGEATTACH Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/PNG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  PNG IHDR &amp; pHYs Chunks (Wikipedia) <ExternalLink className="w-3 h-3" />
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
