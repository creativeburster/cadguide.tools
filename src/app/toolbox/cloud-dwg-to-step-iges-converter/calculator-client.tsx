'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  FileCheck2,
  Download,
  RotateCcw,
  Upload,
  ExternalLink,
  Info,
  Terminal,
} from 'lucide-react';

type ExportRoute = 'igesexport' | 'acisout-step';

interface ExportPreset {
  id: string;
  label: string;
  route: ExportRoute;
  insunitsCode: string;
  solidCount: string;
}

// Verbatim AutoCAD 2025 Help — INSUNITS (System Variable) integer table (0..24)
const INSUNITS_MAP: Record<number, string> = {
  0: 'Unspecified (No units)',
  1: 'Inches',
  2: 'Feet',
  3: 'Miles',
  4: 'Millimeters',
  5: 'Centimeters',
  6: 'Meters',
  7: 'Kilometers',
  8: 'Microinches',
  9: 'Mils',
  10: 'Yards',
  11: 'Angstroms',
  12: 'Nanometers',
  13: 'Microns',
  14: 'Decimeters',
  15: 'Dekameters',
  16: 'Hectometers',
  17: 'Gigameters',
  18: 'Astronomical Units',
  19: 'Light Years',
  20: 'Parsecs',
  21: 'US Survey Feet',
  22: 'US Survey Inch',
  23: 'US Survey Yard',
  24: 'US Survey Mile',
};

const DWG_SIGNATURES: Record<string, string> = {
  AC1032: 'DWG 2018 Format (AutoCAD 2018 and later)',
  AC1027: 'DWG 2013 Format (AutoCAD 2013–2017)',
  AC1024: 'DWG 2010 Format (AutoCAD 2010–2012)',
  AC1021: 'DWG 2007 Format (AutoCAD 2007–2009)',
  AC1018: 'DWG 2004 Format (AutoCAD 2004–2006)',
  AC1015: 'DWG 2000 Format (AutoCAD 2000–2002)',
};

const PRESETS: ExportPreset[] = [
  {
    id: 'metric-igesexport',
    label: 'Preset 1: AutoCAD IGES Export (IGESEXPORT, mm)',
    route: 'igesexport',
    insunitsCode: '4',
    solidCount: '12',
  },
  {
    id: 'metric-acis-step',
    label: 'Preset 2: ACISOUT (.sat) + Desktop MCAD STEP (mm)',
    route: 'acisout-step',
    insunitsCode: '4',
    solidCount: '8',
  },
  {
    id: 'imperial-igesexport',
    label: 'Preset 3: Imperial IGES Export (IGESEXPORT, Inches)',
    route: 'igesexport',
    insunitsCode: '1',
    solidCount: '24',
  },
];

const OFFICIAL_DOCS = [
  {
    name: 'Autodesk AutoCAD 2025 Help — IMPORT (Command)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-81A5EE76-39A7-40A4-A5C5-E4921C03B33A.htm',
    desc: 'Documents importing STEP (*.ste; *.stp; *.step) and IGES (*.iges; *.igs / IGESIMPORT) into full AutoCAD (not available in AutoCAD LT).',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — EXPORT (Command)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-A72DB257-3410-4792-B548-6B9FC1DED72B.htm',
    desc: 'Lists supported AutoCAD EXPORT output formats including IGES (*.iges; *.igs via IGESEXPORT) and ACIS (*.sat via ACISOUT). STEP is not listed in AutoCAD EXPORT.',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — IGESEXPORT (Command)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-C3F00D33-08E9-47DB-9608-94A366E48319.htm',
    desc: 'Saves selected objects in the current drawing to a new IGES (*.igs, *.iges) file in products that include IGES translation.',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — INSUNITS (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-A58A87BB-482B-4042-A00A-EEF55A2B4FD8.htm',
    desc: 'Defines drawing-units integer codes 0–24 (0 = Unspecified, 1 = Inches, 2 = Feet, 4 = Millimeters, 6 = Meters, 21 = US Survey Feet, up to 24 = US Survey Mile; 22–24 supported on AutoCAD for Mac only).',
  },
];

function parseStrictNum(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function CloudDwgToStepIgesConverterClient() {
  const [route, setRoute] = useState<ExportRoute>('igesexport');
  const [insunitsCodeStr, setInsunitsCodeStr] = useState('4');
  const [solidCountStr, setSolidCountStr] = useState('12');
  const [localHeaderInfo, setLocalHeaderInfo] = useState<string>('No local DWG inspected (optional 6-byte check)');

  const applyPreset = (p: ExportPreset) => {
    setRoute(p.route);
    setInsunitsCodeStr(p.insunitsCode);
    setSolidCountStr(p.solidCount);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setLocalHeaderInfo('No local DWG inspected (optional 6-byte check)');
  };

  const handleLocalHeaderSlice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const slice = file.slice(0, 6);
    const buf = await slice.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const ascii = Array.from(bytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '?'))
      .join('');
    const matched = DWG_SIGNATURES[ascii];
    setLocalHeaderInfo(
      matched
        ? `${file.name}: ${ascii} — ${matched} (inspected locally, 0 bytes uploaded)`
        : `${file.name}: ${ascii || 'empty'} — unrecognized 6-byte DWG signature`
    );
  };

  const evaluation = useMemo(() => {
    const insCode = parseStrictNum(insunitsCodeStr);
    const solids = parseStrictNum(solidCountStr);

    if (!Number.isFinite(insCode) || !Number.isFinite(solids)) {
      return {
        valid: false as const,
        error: 'Enter valid finite integers for AutoCAD INSUNITS Code (0–24) and Expected 3D Solid Bodies (1–10,000).',
      };
    }

    if (!Number.isInteger(insCode) || !(insCode in INSUNITS_MAP)) {
      return {
        valid: false as const,
        error: 'INSUNITS must be an official AutoCAD integer code from 0 to 24 (e.g., 1 = Inches, 4 = Millimeters, 6 = Meters, 24 = US Survey Mile).',
      };
    }

    if (!Number.isInteger(solids) || solids < 1 || solids > 10000) {
      return {
        valid: false as const,
        error: 'Expected 3D Solid Bodies must be an integer between 1 and 10,000.',
      };
    }

    const unitName = INSUNITS_MAP[insCode];
    const exportCmdLabel =
      route === 'igesexport'
        ? 'IGESEXPORT (*.igs, *.iges)'
        : 'ACISOUT (*.sat) -> Desktop MCAD STEP';

    const cmdToken = route === 'igesexport' ? 'IGESEXPORT' : 'ACISOUT';
    const routeComment =
      route === 'igesexport'
        ? '; Launches IGESEXPORT dialog to write selected 3D objects to IGES (*.igs, *.iges) (full AutoCAD, not AutoCAD LT)'
        : '; Standard AutoCAD EXPORT does not include STEP. Exports ACIS (*.sat) solids for STEP (ISO 10303-21) save in desktop MCAD';

    const scrLines = [
      `; AutoCAD 3D Export Preflight Script (.scr) - ${solids} expected 3D solid body/bodies`,
      `; Note: 2D wireframe lines/arcs cannot auto-convert into 3D STEP/IGES solids; verify 3D solid geometry first.`,
      `; Set INSUNITS = ${insCode} (${unitName}) per AutoCAD System Variable table`,
      `INSUNITS ${insCode}`,
      `; Audit drawing database and fix detected errors`,
      `AUDIT Y`,
      `; Purge unused blocks and layer definitions before neutral export`,
      `-PURGE A * N`,
      routeComment,
      cmdToken,
    ];

    const scrContent = toSafeAscii(scrLines.join('\r\n') + '\r\n');

    return {
      valid: true as const,
      insCode,
      unitName,
      solids,
      exportCmdLabel,
      insunitsSummary: `${insCode} (${unitName})`,
      stepNote: 'AutoCAD IMPORT reads STEP (*.ste; *.stp; *.step); STEP is not in AutoCAD EXPORT',
      scrContent,
    };
  }, [route, insunitsCodeStr, solidCountStr]);

  const downloadScr = () => {
    if (!evaluation.valid) return;
    const blob = new Blob([evaluation.scrContent], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autocad-3d-export-preflight.scr';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Honest Browser & CAD Format Capability Disclosure */}
      <div
        data-testid="honest-conversion-disclosure"
        className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-amber-950">
          <h2 className="font-black text-base">
            Browser &amp; Format Reality Check — No Online DWG-to-STEP Conversion Performed Here
          </h2>
          <p className="leading-relaxed font-medium text-amber-900">
            Web browsers cannot reconstruct proprietary binary <code>.dwg</code> files or turn 2D drafting entities (
            <code>LINE</code>, <code>ARC</code>, <code>LWPOLYLINE</code>) into 3D B-Rep <code>STEP</code> (
            <code>ISO 10303-21</code>) or <code>IGES</code> solid models. This page does not upload your files or claim
            online conversion.
          </p>
          <ul className="list-disc pl-5 space-y-1 font-medium text-amber-900 leading-relaxed">
            <li>
              <strong>STEP in AutoCAD:</strong> Per Autodesk AutoCAD Help, standard AutoCAD only imports{' '}
              <code>STEP (*.ste; *.stp; *.step)</code> via the <code>IMPORT</code> command (not available in AutoCAD
              LT); <code>STEP</code> is <strong>not listed</strong> in the standard AutoCAD <code>EXPORT</code> command.
            </li>
            <li>
              <strong>IGES &amp; ACIS in AutoCAD:</strong> Products that include neutral export (full AutoCAD, not
              AutoCAD LT) provide <code>IGESEXPORT</code> for <code>IGES (*.igs, *.iges)</code> and{' '}
              <code>ACISOUT</code> for <code>ACIS (*.sat)</code> solid object files. To produce an{' '}
              <code>ISO 10303-21</code> STEP file, open the 3D DWG or exported <code>.sat</code> solid in a desktop
              mechanical CAD application that natively supports STEP export.
            </li>
          </ul>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Desktop Export Preflight Profiles
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Preflight Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div>
            <label htmlFor="dwg-route" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              AutoCAD Desktop Export Route
            </label>
            <select
              id="dwg-route"
              data-testid="select-export-route"
              value={route}
              onChange={(e) => setRoute(e.target.value as ExportRoute)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 cursor-pointer"
            >
              <option value="igesexport">IGESEXPORT — Direct IGES (*.igs, *.iges)</option>
              <option value="acisout-step">ACISOUT (*.sat) — Intermediate for Desktop MCAD STEP</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dwg-insunits"
              className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2"
            >
              AutoCAD INSUNITS Code (0–24)
            </label>
            <input
              id="dwg-insunits"
              data-testid="input-insunits-code"
              type="text"
              inputMode="numeric"
              value={insunitsCodeStr}
              onChange={(e) => setInsunitsCodeStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Common official codes: 0 = Unspecified, 1 = Inches, 2 = Feet, 4 = Millimeters, 5 = Centimeters, 6 = Meters
            </p>
          </div>

          <div>
            <label
              htmlFor="dwg-solids"
              className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2"
            >
              Expected 3D Solid Bodies
            </label>
            <input
              id="dwg-solids"
              data-testid="input-solid-count"
              type="text"
              inputMode="numeric"
              value={solidCountStr}
              onChange={(e) => setSolidCountStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Optional Local 6-Byte DWG Header Check (0 Bytes Uploaded)
            </label>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Inspect Local .DWG Header</span>
              <input type="file" accept=".dwg" onChange={handleLocalHeaderSlice} className="hidden" />
            </label>
            <div className="text-[11px] text-slate-500 mt-1.5 font-mono" data-testid="local-header-status">
              {localHeaderInfo}
            </div>
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Verified Desktop Export Workflow &amp; .SCR Script
                </h2>
              </div>
              <button
                type="button"
                data-testid="download-scr-button"
                disabled={!evaluation.valid}
                onClick={downloadScr}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download .SCR
              </button>
            </div>

            {!evaluation.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{evaluation.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  AutoCAD Export Command
                </div>
                <div className="text-sm font-black text-slate-900 leading-snug" data-testid="result-export-route">
                  {evaluation.valid ? evaluation.exportCmdLabel : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  INSUNITS Drawing Scale
                </div>
                <div className="text-sm font-black text-slate-900 leading-snug" data-testid="result-insunits-summary">
                  {evaluation.valid ? evaluation.insunitsSummary : '—'}
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Target 3D Solids</div>
                <div className="text-2xl font-black text-blue-950" data-testid="result-solid-count">
                  {evaluation.valid ? String(evaluation.solids) : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="font-black text-slate-900">STEP Capability Summary: </span>
              <span data-testid="result-step-note">
                {evaluation.valid ? evaluation.stepNote : '—'}
              </span>
            </div>

            {evaluation.valid && (
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Pure-ASCII AutoCAD Script Preview (autocad-3d-export-preflight.scr)
                </div>
                <pre
                  data-testid="preview-scr"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed"
                >
                  {evaluation.scrContent}
                </pre>
              </div>
            )}
          </div>

          {/* Official Documentation Links */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              Official Autodesk Documentation References
            </div>
            <div className="space-y-3">
              {OFFICIAL_DOCS.map((doc) => (
                <a
                  key={doc.url}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 font-black text-sm text-slate-900">
                    <span>{doc.name}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{doc.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
