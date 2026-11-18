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
          <span className="font-black">Raster-to-DXF Scale Calibration &amp; Reference Frame Generator:</span> Computes exact mm/px physical scale calibration from a known drawing dimension, builds a `1:1` DXF calibration frame + scale bar, and exports an AutoCAD `IMAGEATTACH` setup script (`0 bytes uploaded`). Automatic contour tracing of photographs requires desktop/vectorize software.
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
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">Raster Dimensions &amp; Reference</h2>
          </div>

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
              <a
                href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-0F75E36F-6138-424C-9510-5847CE1D8852.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                AutoCAD 2025 IMAGEATTACH Help <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
