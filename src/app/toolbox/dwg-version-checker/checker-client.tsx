'use client';

import React, { useState, DragEvent, ChangeEvent } from 'react';
import { Download, Copy, Check, Info } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface VersionInfo {
  code: string;
  year: string;
  firstReleaseYear: string;
  sourceNote: string;
  desc: string;
}

// Verified against Autodesk AutoCAD DXF Reference HEADER ($ACADVER) and Autodesk DWG format specifications
const VERSION_MAP: Record<string, VersionInfo> = {
  AC1032: {
    code: 'AC1032',
    year: 'AutoCAD 2018 Format (used by AutoCAD 2018-2026)',
    firstReleaseYear: '2018',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1032 = AutoCAD 2018)',
    desc: 'Drawing database format introduced in AutoCAD 2018. Supported natively for read/write by AutoCAD 2018 through 2026 and current ODA/IntelliCAD-based CAD tools.',
  },
  AC1027: {
    code: 'AC1027',
    year: 'AutoCAD 2013 Format (AutoCAD 2013-2017)',
    firstReleaseYear: '2013',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1027 = AutoCAD 2013)',
    desc: 'Drawing format introduced in AutoCAD 2013. Commonly used as a save-down exchange format when collaborating with legacy CAD installations.',
  },
  AC1024: {
    code: 'AC1024',
    year: 'AutoCAD 2010 Format (AutoCAD 2010-2012)',
    firstReleaseYear: '2010',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1024 = AutoCAD 2010)',
    desc: 'Drawing format introduced in AutoCAD 2010. Read and write support is widely integrated across modern and legacy DWG-compatible editors.',
  },
  AC1021: {
    code: 'AC1021',
    year: 'AutoCAD 2007 Format (AutoCAD 2007-2009)',
    firstReleaseYear: '2007',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1021 = AutoCAD 2007)',
    desc: 'Drawing format introduced in AutoCAD 2007 with Unicode text encoding support.',
  },
  AC1018: {
    code: 'AC1018',
    year: 'AutoCAD 2004 Format (AutoCAD 2004-2006)',
    firstReleaseYear: '2004',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1018 = AutoCAD 2004)',
    desc: 'Drawing format introduced in AutoCAD 2004.',
  },
  AC1015: {
    code: 'AC1015',
    year: 'AutoCAD 2000 Format (AutoCAD 2000/2000i/2002)',
    firstReleaseYear: '2000',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1015 = AutoCAD 2000)',
    desc: 'AutoCAD 2000 drawing database format, frequently retained for legacy CAM and CNC interoperability.',
  },
  AC1014: {
    code: 'AC1014',
    year: 'AutoCAD Release 14',
    firstReleaseYear: '1997',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1014 = R14)',
    desc: 'AutoCAD Release 14 format.',
  },
  AC1012: {
    code: 'AC1012',
    year: 'AutoCAD Release 13',
    firstReleaseYear: '1994',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1012 = R13)',
    desc: 'AutoCAD Release 13 drawing database format.',
  },
  AC1009: {
    code: 'AC1009',
    year: 'AutoCAD Release 11 / 12',
    firstReleaseYear: '1990',
    sourceNote: 'AutoCAD DXF Reference ($ACADVER: AC1009 = R11 and R12)',
    desc: 'AutoCAD R11/R12 format commonly referenced for basic 2D legacy CAD/CAM interchange.',
  },
};

export default function DwgVersionCheckerClient() {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VersionInfo | null>(VERSION_MAP.AC1032);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('AC1032');
  const [copied, setCopied] = useState(false);

  const inspectHeaderBytes = (magicRaw: string, name: string, sizeLabel: string) => {
    const magic = magicRaw.trim().toUpperCase();
    if (!magic.startsWith('AC') || magic.length < 6) {
      setResult(null);
      setError('Invalid DWG header: first 6 ASCII bytes must start with "AC" (for example AC1032).');
      return;
    }
    const header6 = magic.slice(0, 6);
    const match = VERSION_MAP[header6];
    setError(null);
    setFileName(name);
    setFileSize(sizeLabel);
    setManualCode(header6);
    if (match) {
      setResult(match);
    } else {
      setResult({
        code: header6,
        year: `Unmapped AC Header (${header6})`,
        firstReleaseYear: 'Unknown',
        sourceNote: 'Detected 6-byte ASCII prefix not present in standard AC1009-AC1032 map.',
        desc: `Detected header '${header6}'. This may correspond to a pre-R11 release (such as AC1006 = R10) or a non-standard writer.`,
      });
    }
  };

  const parseDwgHeader = (file: File) => {
    setLoading(true);
    setError(null);
    const sizeInKb = file.size / 1024;
    const sizeLabel = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${sizeInKb.toFixed(1)} KB`;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer || buffer.byteLength < 6) {
          throw new Error('File is smaller than 6 bytes and cannot contain a valid DWG magic header.');
        }
        const bytes = new Uint8Array(buffer);
        let magic = '';
        for (let i = 0; i < 6; i++) {
          magic += String.fromCharCode(bytes[i]);
        }
        inspectHeaderBytes(magic, file.name, sizeLabel);
      } catch (err: unknown) {
        setResult(null);
        setError((err instanceof Error ? err.message : '') || 'Failed to parse DWG header bytes.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setResult(null);
      setError('Failed to read the local file.');
      setLoading(false);
    };
    reader.readAsArrayBuffer(file.slice(0, 6));
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseDwgHeader(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseDwgHeader(e.target.files[0]);
    }
  };

  const handleManualSelect = (code: string) => {
    setError(null);
    setFileName(null);
    setFileSize(null);
    setManualCode(code);
    setResult(VERSION_MAP[code]);
  };

  const handleSampleParse = (code: string) => {
    inspectHeaderBytes(`${code}\0\0`, `sample_${code.toLowerCase()}.dwg`, '128.0 KB (Simulated 6-Byte Header)');
  };

  const handleManualLookup = () => {
    const clean = manualCode.trim().toUpperCase();
    if (!clean) {
      setResult(null);
      setError('Enter a 6-character DWG header code such as AC1032 or upload a .dwg file.');
      return;
    }
    inspectHeaderBytes(clean, 'Manual Header Lookup', '-');
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const text = [
      'DWG Format Version Inspection Report',
      `Magic Header Code: ${result.code}`,
      `Release Format: ${result.year}`,
      `Format Introduced: ${result.firstReleaseYear}`,
      `Source Reference: ${result.sourceNote}`,
      `Details: ${result.desc}`,
    ].join('\n');
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ['Header Code', 'AutoCAD Release Format', 'Introduced Year', 'Selected', 'Reference'],
      ...Object.values(VERSION_MAP).map((v) => [
        v.code,
        v.year,
        v.firstReleaseYear,
        result?.code === v.code ? 'Active' : '-',
        v.sourceNote,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      .replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwg-version-reference-${result?.code || 'table'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 hover:border-blue-400'
          }`}
        >
          <input
            type="file"
            id="dwg-file-input"
            data-testid="input-dwg-file"
            accept=".dwg"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <h3 className="text-lg font-black text-slate-900 mb-1">
            Drop a local .dwg file or click to inspect its 6-byte magic header
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Reads only the first 6 bytes (`AC10xx`) via browser FileReader API. Zero server uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Lookup by Magic Header Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                data-testid="input-header-code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="AC1032"
                className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-mono font-bold text-slate-900"
              />
              <button
                type="button"
                data-testid="btn-lookup-code"
                onClick={handleManualLookup}
                className="px-4 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
              >
                Inspect Code
              </button>
            </div>
          </div>
          <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
            <button
              type="button"
              data-testid="btn-sample-ac1027"
              onClick={() => handleSampleParse('AC1027')}
              className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-extrabold cursor-pointer"
            >
              Test Sample AC1027 File
            </button>
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Table
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-slate-500 font-bold">Reading first 6 bytes...</div>
      )}

      {error && (
        <div data-testid="validation-error" className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
              Detected Header Code:{' '}
              <span data-testid="result-code">{result ? result.code : '—'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900" data-testid="result-year">
              {result ? result.year : '—'}
            </h2>
            {fileName && (
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Source: <span className="font-bold text-slate-800">{fileName}</span> ({fileSize})
              </p>
            )}
          </div>
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 text-left md:text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Introduced</div>
            <div className="text-xl font-black text-slate-800" data-testid="result-released">
              {result ? result.firstReleaseYear : '—'}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {result ? result.desc : 'No valid header detected.'}
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Format Compatibility Note:</strong> AutoCAD releases are backward-compatible (newer releases open older AC10xx formats), not forward-compatible. Verify third-party CAD platform DWG version support against each vendor&apos;s release documentation.
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            Verified AutoCAD $ACADVER / DWG Header Codes
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.keys(VERSION_MAP).map((code) => (
              <button
                key={code}
                type="button"
                data-testid={`btn-code-${code}`}
                onClick={() => handleManualSelect(code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  result?.code === code
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                {code} ({VERSION_MAP[code].firstReleaseYear})
              </button>
            ))}
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
