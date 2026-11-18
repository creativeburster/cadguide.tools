'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileSearch,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_VECTOR_PDF = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R /Contents 6 0 R >>
endobj
5 0 obj
<< /Length 44 >>
stream
10 10 m 110 10 l 110 60 l 10 60 l h S
endstream
endobj
%%EOF`;

const SAMPLE_RASTER_PDF = `%PDF-1.4
1 0 obj
<< /Type /Pages /Kids [2 0 R] /Count 1 >>
endobj
2 0 obj
<< /Type /Page /Resources << /XObject << /Im1 3 0 R >> >> >>
endobj
3 0 obj
<< /Type /XObject /Subtype /Image /Width 3508 /Height 2480 >>
endobj
%%EOF`;

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function inspectPdfPreflight(pdfText: string, pdfFileName: string, pageNumStr: string, importScaleStr: string) {
  const trimmed = pdfText.trim();
  const pageNum = Number(pageNumStr.trim());
  const importScale = Number(importScaleStr.trim());

  if (!trimmed) {
    return { valid: false as const, error: 'PDF header/object source cannot be empty.' };
  }
  const versionMatch = trimmed.match(/%PDF-(\d+\.\d+)/i);
  if (!versionMatch) {
    return { valid: false as const, error: 'Source does not contain a valid %PDF-1.x header signature.' };
  }
  if (!Number.isSafeInteger(pageNum) || pageNum < 1 || !Number.isFinite(importScale) || importScale <= 0) {
    return { valid: false as const, error: 'Target page number must be an integer >= 1 and import scale > 0.' };
  }

  const pageObjects = (trimmed.match(/\/Type\s*\/Page\b(?!s)/gi) || []).length;
  const countMatch = trimmed.match(/\/Count\s+(\d+)/i);
  const declaredPages = countMatch ? Number(countMatch[1]) : pageObjects;
  const rasterImages = (trimmed.match(/\/Subtype\s*\/Image\b/gi) || []).length;
  const pathOps = (trimmed.match(/\b\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s+(?:m|l|c)\b/g) || []).length;

  let classification = 'HYBRID_VECTOR_RASTER';
  if (pathOps > 0 && rasterImages === 0) classification = 'VECTOR_READY';
  else if (pathOps === 0 && rasterImages > 0) classification = 'RASTER_SCAN_ONLY';

  const cleanFile = toSafeAscii(pdfFileName).trim() || 'sheet.pdf';
  const scriptText = [
    '; Pure-ASCII AutoCAD -PDFIMPORT Batch Script',
    'CMDECHO 0',
    `-PDFIMPORT F "${cleanFile}" ${pageNum} 0,0 ${importScale} 0`,
    'ZOOM E',
    'CMDECHO 1',
  ].join('\n');

  return {
    valid: true as const,
    pdfVersion: versionMatch[1],
    declaredPages: Math.max(declaredPages, pageObjects),
    pageObjects,
    rasterImages,
    pathOps,
    classification,
    scriptText,
  };
}

export default function OnlinePdfToDwgConverterClient() {
  const [pdfText, setPdfText] = useState(SAMPLE_VECTOR_PDF);
  const [pdfFileName, setPdfFileName] = useState('architectural_vector.pdf');
  const [pageNumStr, setPageNumStr] = useState('1');
  const [importScaleStr, setImportScaleStr] = useState('1');
  const [copied, setCopied] = useState(false);

  const report = useMemo(
    () => inspectPdfPreflight(pdfText, pdfFileName, pageNumStr, importScaleStr),
    [pdfText, pdfFileName, pageNumStr, importScaleStr]
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(toSafeAscii(file.name) || 'drawing.pdf');
    const slice = await file.slice(0, 512 * 1024).arrayBuffer();
    const bytes = new Uint8Array(slice);
    const ascii = Array.from(bytes)
      .map((b) => (b === 10 || b === 13 || (b >= 32 && b <= 126) ? String.fromCharCode(b) : ' '))
      .join('');
    setPdfText(ascii);
  };

  const resetDefaults = () => {
    setPdfText(SAMPLE_VECTOR_PDF);
    setPdfFileName('architectural_vector.pdf');
    setPageNumStr('1');
    setImportScaleStr('1');
  };

  const handleCopy = () => {
    if (!report.valid) return;
    navigator.clipboard
      .writeText(report.scriptText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadScr = () => {
    if (!report.valid) return;
    const blob = new Blob([toSafeAscii(report.scriptText) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdfimport_to_dwg.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Browser-Local PDF Stream Preflight &amp; -PDFIMPORT Builder:</span> Scans local `.pdf` objects (`%PDF-1.x`, `/Type /Page`, `/Subtype /Image`, uncompressed vector operators) without uploading (`0 bytes uploaded`), and exports an AutoCAD `-PDFIMPORT` script for local DWG conversion.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-vector"
          onClick={() => {
            setPdfText(SAMPLE_VECTOR_PDF);
            setPdfFileName('architectural_vector.pdf');
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Vector CAD PDF (2 Pages, 0 Raster Images)
        </button>
        <button
          type="button"
          data-testid="preset-raster"
          onClick={() => {
            setPdfText(SAMPLE_RASTER_PDF);
            setPdfFileName('scanned_sheet.pdf');
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Scanned Raster-Only PDF (1 Page, 1 Image XObject)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">PDF Header &amp; Parameters</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read Local .pdf
              <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Target Page #</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-page-num"
                value={pageNumStr}
                onChange={(e) => setPageNumStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Import Scale Factor</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-scale"
                value={importScaleStr}
                onChange={(e) => setImportScaleStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <textarea
            data-testid="input-pdf-source"
            rows={10}
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            spellCheck={false}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
          />

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
                <FileSearch className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Preflight Inspection &amp; -PDFIMPORT Script</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!report.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy SCR'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-scr"
                  onClick={handleDownloadScr}
                  disabled={!report.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
              </div>
            </div>

            {!report.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{report.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">PDF Header</div>
                    <div data-testid="out-version" className="text-xl font-black text-blue-900 mt-1">
                      PDF {report.pdfVersion}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Pages Detected</div>
                    <div data-testid="out-pages" className="text-xl font-black text-slate-900 mt-1">
                      {report.declaredPages}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <div className="text-xs font-bold text-amber-700 uppercase">Image XObjects</div>
                    <div data-testid="out-images" className="text-xl font-black text-amber-900 mt-1">
                      {report.rasterImages}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-700 uppercase">Stream Class</div>
                    <div data-testid="out-class" className="text-xs font-black text-emerald-900 mt-2">
                      {report.classification}
                    </div>
                  </div>
                </div>

                <pre
                  data-testid="out-script"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto"
                >
                  {report.scriptText}
                </pre>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Note: compressed `/FlateDecode` PDF object streams require desktop PDF decoders; uncompressed PDFs reveal vector `m/l/c` paths directly alongside `/Subtype /Image` scans.
                </span>
              </div>
              <a
                href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-ADEE1DE4-3CEF-432D-95F2-014F326E8B2A.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                AutoCAD 2025 -PDFIMPORT Command Help <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
