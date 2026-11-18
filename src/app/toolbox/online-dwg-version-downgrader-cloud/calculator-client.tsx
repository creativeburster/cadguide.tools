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

interface DwgVersionEntry {
  magic: string;
  label: string;
  releaseRange: string;
  saveasToken: string;
}

const DWG_VERSIONS: DwgVersionEntry[] = [
  { magic: 'AC1032', label: 'DWG 2018', releaseRange: 'AutoCAD 2018 - 2026', saveasToken: '2018' },
  { magic: 'AC1027', label: 'DWG 2013', releaseRange: 'AutoCAD 2013 - 2017', saveasToken: '2013' },
  { magic: 'AC1024', label: 'DWG 2010', releaseRange: 'AutoCAD 2010 - 2012', saveasToken: '2010' },
  { magic: 'AC1021', label: 'DWG 2007', releaseRange: 'AutoCAD 2007 - 2009', saveasToken: '2007' },
  { magic: 'AC1018', label: 'DWG 2004', releaseRange: 'AutoCAD 2004 - 2006', saveasToken: '2004' },
  { magic: 'AC1015', label: 'DWG 2000', releaseRange: 'AutoCAD 2000 - 2002', saveasToken: '2000' },
];

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function OnlineDwgVersionDowngraderCloudClient() {
  const [sourceMagic, setSourceMagic] = useState('AC1032');
  const [targetMagic, setTargetMagic] = useState('AC1027');
  const [drawingFileName, setDrawingFileName] = useState('civil_site_plan.dwg');
  const [localInspectNote, setLocalInspectNote] = useState('Sample header: AC1032 (or upload local .dwg to read first 6 bytes)');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setSourceMagic('AC1032');
    setTargetMagic('AC1027');
    setDrawingFileName('civil_site_plan.dwg');
    setLocalInspectNote('Sample header: AC1032 (or upload local .dwg to read first 6 bytes)');
  };

  const handleLocalDwgHeader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDrawingFileName(toSafeAscii(file.name) || 'drawing.dwg');
    const bytes = new Uint8Array(await file.slice(0, 6).arrayBuffer());
    const ascii = Array.from(bytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '?'))
      .join('');
    const matched = DWG_VERSIONS.find((v) => v.magic === ascii);
    if (matched) {
      setSourceMagic(matched.magic);
      setLocalInspectNote(`${file.name}: ${ascii} (${matched.label} / ${matched.releaseRange}, 0 bytes uploaded)`);
    } else {
      setLocalInspectNote(`${file.name}: leading bytes "${ascii || 'empty'}" (not in AC1015-AC1032 list)`);
    }
  };

  const evaluation = useMemo(() => {
    const srcIdx = DWG_VERSIONS.findIndex((v) => v.magic === sourceMagic);
    const dstIdx = DWG_VERSIONS.findIndex((v) => v.magic === targetMagic);
    const cleanFile = toSafeAscii(drawingFileName).trim();

    if (srcIdx === -1 || dstIdx === -1 || !cleanFile) {
      return {
        valid: false as const,
        error: 'Drawing filename cannot be empty and both source and target AC10xx formats must be selected.',
      };
    }

    const src = DWG_VERSIONS[srcIdx];
    const dst = DWG_VERSIONS[dstIdx];
    const stepsDowngrade = dstIdx - srcIdx; // positive means downgrading to older format

    const exportCmd = dst.magic === 'AC1032'
      ? `SAVEAS ${dst.saveasToken} "${cleanFile}"`
      : `-EXPORTTOAUTOCAD F ${dst.saveasToken} O "${cleanFile.replace(/\.dwg$/i, '')}_${dst.saveasToken}.dwg" `;

    const scriptText = [
      `; Pure-ASCII AutoCAD Version Downgrade Script (${src.magic} -> ${dst.magic})`,
      'CMDECHO 0',
      `OPEN "${cleanFile}"`,
      exportCmd.trim(),
      'CLOSE',
      'CMDECHO 1',
    ].join('\n');

    return {
      valid: true as const,
      src,
      dst,
      stepsDowngrade,
      isDowngrade: stepsDowngrade > 0,
      directionLabel:
        stepsDowngrade > 0
          ? `Downgrade (-${stepsDowngrade} format generation${stepsDowngrade > 1 ? 's' : ''})`
          : stepsDowngrade === 0
            ? 'Same Format Generation (0 steps)'
            : `Upgrade (+${Math.abs(stepsDowngrade)} generation${Math.abs(stepsDowngrade) > 1 ? 's' : ''})`,
      scriptText,
    };
  }, [sourceMagic, targetMagic, drawingFileName]);

  const handleCopy = () => {
    if (!evaluation.valid) return;
    navigator.clipboard
      .writeText(evaluation.scriptText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadScr = () => {
    if (!evaluation.valid) return;
    const blob = new Blob([toSafeAscii(evaluation.scriptText) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwg_convert_${evaluation.src.magic}_to_${evaluation.dst.magic}.scr`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local Header Check &amp; EXPORTTOAUTOCAD Script Builder:</span> Inspects 6-byte `AC10xx` DWG signatures in your browser (`0 bytes uploaded`) and builds a pure-ASCII AutoCAD `EXPORTTOAUTOCAD` / `SAVEAS` conversion script. Binary DWG re-encoding must execute locally using AutoCAD or ODA File Converter.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">DWG Version Setup</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read Local .dwg
              <input type="file" accept=".dwg" onChange={handleLocalDwgHeader} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{localInspectNote}</div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Drawing File Name</label>
            <input
              type="text"
              data-testid="input-filename"
              value={drawingFileName}
              onChange={(e) => setDrawingFileName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Source DWG Format</label>
            <select
              data-testid="select-source-magic"
              value={sourceMagic}
              onChange={(e) => setSourceMagic(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {DWG_VERSIONS.map((v) => (
                <option key={v.magic} value={v.magic}>
                  {v.magic} - {v.label} ({v.releaseRange})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Target DWG Format</label>
            <select
              data-testid="select-target-magic"
              value={targetMagic}
              onChange={(e) => setTargetMagic(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {DWG_VERSIONS.map((v) => (
                <option key={v.magic} value={v.magic}>
                  {v.magic} - {v.label} ({v.releaseRange})
                </option>
              ))}
            </select>
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
                <h2 className="text-lg font-black text-slate-900">Version Matrix &amp; Export Script</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!evaluation.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-scr"
                  onClick={handleDownloadScr}
                  disabled={!evaluation.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
              </div>
            </div>

            {!evaluation.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evaluation.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Source Magic</div>
                    <div data-testid="out-src-magic" className="text-xl font-black text-blue-900 mt-1">
                      {evaluation.src.magic}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Target Magic</div>
                    <div data-testid="out-dst-magic" className="text-xl font-black text-emerald-900 mt-1">
                      {evaluation.dst.magic}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Generation Step</div>
                    <div data-testid="out-step-delta" className="text-sm font-black text-slate-900 mt-2">
                      {evaluation.directionLabel}
                    </div>
                  </div>
                </div>

                <pre
                  data-testid="out-script"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto"
                >
                  {evaluation.scriptText}
                </pre>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  `EXPORTTOAUTOCAD` converts toolset proxy objects into standard AutoCAD entities and saves to older releases so earlier installations can open the drawing cleanly.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-86C80CA1-F237-4AE6-8A43-2E9CA06A03A8.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 EXPORTTOAUTOCAD Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/DWG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  DWG AC10xx Release Signatures <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.opendesign.com/guestfiles/oda_file_converter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  ODA File Converter <ExternalLink className="w-3 h-3" />
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
