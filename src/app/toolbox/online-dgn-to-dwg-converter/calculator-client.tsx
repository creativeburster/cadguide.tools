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

type DgnUnitKey = 'm' | 'mm' | 'ft' | 'in';

const UNIT_TO_MM: Record<DgnUnitKey, number> = {
  mm: 1,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

const DWG_INSUNITS_CODE: Record<DgnUnitKey, number> = {
  in: 1,
  ft: 2,
  mm: 4,
  m: 6,
};

interface DgnPreset {
  id: string;
  label: string;
  dgnFileName: string;
  masterUnit: DgnUnitKey;
  dwgUnit: DgnUnitKey;
  subPerMaster: string;
  posPerSub: string;
  sampleCoords: string;
}

const PRESETS: DgnPreset[] = [
  {
    id: 'civil-m-to-mm',
    label: 'Preset 1: Civil Meters DGN -> Millimeters DWG (x1000)',
    dgnFileName: 'highway_alignment.dgn',
    masterUnit: 'm',
    dwgUnit: 'mm',
    subPerMaster: '1000',
    posPerSub: '100',
    sampleCoords: '12.5',
  },
  {
    id: 'imperial-ft-to-in',
    label: 'Preset 2: Survey Feet DGN -> Inches DWG (x12)',
    dgnFileName: 'parcel_plan.dgn',
    masterUnit: 'ft',
    dwgUnit: 'in',
    subPerMaster: '12',
    posPerSub: '1000',
    sampleCoords: '100',
  },
  {
    id: 'same-mm-to-mm',
    label: 'Preset 3: Direct 1:1 Millimeters DGN -> Millimeters DWG',
    dgnFileName: 'structural_detail.dgn',
    masterUnit: 'mm',
    dwgUnit: 'mm',
    subPerMaster: '1',
    posPerSub: '1000',
    sampleCoords: '2500',
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
  if (!Number.isFinite(n)) return 'N/A';
  if (Math.abs(n) > 0 && Math.abs(n) < 1) return n.toFixed(6);
  return n.toFixed(decimals);
}

export default function OnlineDgnToDwgConverterClient() {
  const [dgnFileName, setDgnFileName] = useState('highway_alignment.dgn');
  const [masterUnit, setMasterUnit] = useState<DgnUnitKey>('m');
  const [dwgUnit, setDwgUnit] = useState<DgnUnitKey>('mm');
  const [subPerMasterStr, setSubPerMasterStr] = useState('1000');
  const [posPerSubStr, setPosPerSubStr] = useState('100');
  const [sampleCoordStr, setSampleCoordStr] = useState('12.5');
  const [headerStatus, setHeaderStatus] = useState('No local .dgn header read yet (optional byte check)');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: DgnPreset) => {
    setDgnFileName(p.dgnFileName);
    setMasterUnit(p.masterUnit);
    setDwgUnit(p.dwgUnit);
    setSubPerMasterStr(p.subPerMaster);
    setPosPerSubStr(p.posPerSub);
    setSampleCoordStr(p.sampleCoords);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setHeaderStatus('No local .dgn header read yet (optional byte check)');
  };

  const handleLocalDgnHeader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDgnFileName(toSafeAscii(file.name) || 'drawing.dgn');
    const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const hex = Array.from(bytes.slice(0, 8))
      .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
    if (bytes.length >= 8 && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0) {
      setHeaderStatus(`${file.name}: OLE2 Compound Binary (Bentley V8 DGN candidate) [${hex}]`);
    } else if (bytes.length >= 2 && bytes[0] === 0x08 && bytes[1] === 0x09) {
      setHeaderStatus(`${file.name}: MicroStation V7 ISFF header candidate [${hex}]`);
    } else {
      setHeaderStatus(`${file.name}: Read ${file.size} bytes locally [${hex || 'empty'}]`);
    }
  };

  const result = useMemo(() => {
    const subPerMaster = parsePositive(subPerMasterStr);
    const posPerSub = parsePositive(posPerSubStr);
    const sampleMaster = parsePositive(sampleCoordStr);

    if (!Number.isFinite(subPerMaster) || !Number.isFinite(posPerSub) || !Number.isFinite(sampleMaster)) {
      return {
        valid: false as const,
        error: 'Sub-units per Master, Positional Units per Sub-unit, and Sample Coordinate must all be > 0.',
      };
    }

    const scaleFactor = UNIT_TO_MM[masterUnit] / UNIT_TO_MM[dwgUnit];
    const scaledValue = sampleMaster * scaleFactor;
    const uorPerMaster = subPerMaster * posPerSub;
    const resolutionMm = UNIT_TO_MM[masterUnit] / uorPerMaster;
    const insunitsCode = DWG_INSUNITS_CODE[dwgUnit];

    const cleanName = toSafeAscii(dgnFileName).trim() || 'input.dgn';
    const scriptText = [
      `; Pure-ASCII AutoCAD DGNIMPORT conversion script`,
      `CMDECHO 0`,
      `INSUNITS ${insunitsCode}`,
      `-DGNIMPORT "${cleanName}" "Default" Master No`,
      `ZOOM E`,
      `CMDECHO 1`,
    ].join('\n');

    return {
      valid: true as const,
      scaleFactor,
      scaledValue,
      uorPerMaster,
      resolutionMm,
      insunitsCode,
      scriptText,
    };
  }, [dgnFileName, masterUnit, dwgUnit, subPerMasterStr, posPerSubStr, sampleCoordStr]);

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
    a.download = 'dgn_to_dwg_import.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local Header Check &amp; Script Generator Only:</span> Inspects `.dgn` leading bytes in your browser (`0 bytes uploaded`), computes exact DGN-to-DWG `INSUNITS` scale conversion, and generates an AutoCAD `DGNIMPORT` script. Native `.dgn` kernel parsing requires desktop CAD (`AutoCAD DGNIMPORT`).
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
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">DGN Unit &amp; Script Settings</h2>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read Local .dgn Header
              <input type="file" accept=".dgn" onChange={handleLocalDgnHeader} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{headerStatus}</div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">DGN File Name (for Script)</label>
            <input
              type="text"
              data-testid="input-filename"
              value={dgnFileName}
              onChange={(e) => setDgnFileName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">DGN Master Unit</label>
              <select
                data-testid="select-master-unit"
                value={masterUnit}
                onChange={(e) => setMasterUnit(e.target.value as DgnUnitKey)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="m">Meters (m)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Target DWG Unit</label>
              <select
                data-testid="select-dwg-unit"
                value={dwgUnit}
                onChange={(e) => setDwgUnit(e.target.value as DgnUnitKey)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="mm">Millimeters (INSUNITS=4)</option>
                <option value="m">Meters (INSUNITS=6)</option>
                <option value="in">Inches (INSUNITS=1)</option>
                <option value="ft">Feet (INSUNITS=2)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Sub-Units / Master</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-sub-per-master"
                value={subPerMasterStr}
                onChange={(e) => setSubPerMasterStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Positional / Sub-Unit</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-pos-per-sub"
                value={posPerSubStr}
                onChange={(e) => setPosPerSubStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Sample Coordinate (Master Units)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-sample-coord"
              value={sampleCoordStr}
              onChange={(e) => setSampleCoordStr(e.target.value)}
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
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Scale &amp; DGNIMPORT Script</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-black text-blue-600 uppercase">Conversion Scale Factor</div>
                    <div data-testid="out-scale" className="text-2xl font-black text-blue-900 mt-1">
                      {fmt(result.scaleFactor)}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Scaled Sample Coordinate</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-scaled-coord">{fmt(result.scaledValue)}</span> {dwgUnit}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">UORs per Master Unit</div>
                    <div data-testid="out-uor" className="text-xl font-black text-slate-900 mt-1">
                      {fmt(result.uorPerMaster, 0)}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Positional Resolution</div>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      <span data-testid="out-resolution">{result.resolutionMm.toFixed(6)}</span> mm
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
                  Verifies exact unit scaling before invoking AutoCAD `DGNIMPORT` and sets `INSUNITS` according to AutoCAD 2025 specifications (`1=Inches`, `2=Feet`, `4=Millimeters`, `6=Meters`).
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-0B1EC8D0-A34C-4F4E-8E72-A71656F7EF55.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 DGNIMPORT Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-A58A87BB-482B-4042-A00A-EEF55A2B4FD8.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 INSUNITS Help <ExternalLink className="w-3 h-3" />
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
