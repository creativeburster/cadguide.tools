'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  FileSearch,
  Download,
  RotateCcw,
  Upload,
  ExternalLink,
  Info,
} from 'lucide-react';

type FailureScenario = 'cannot-open' | 'opens-with-errors' | 'crash-autosave';

interface RecoveryPreset {
  id: string;
  label: string;
  scenario: FailureScenario;
  headerSig: string;
  fileName: string;
  savetimeMin: string;
  auditCtlVal: '0' | '1';
}

const DWG_SIGNATURES: Record<string, string> = {
  AC1032: 'DWG 2018 Format (AutoCAD 2018–2027)',
  AC1027: 'DWG 2013 Format (AutoCAD 2013–2017)',
  AC1024: 'DWG 2010 Format (AutoCAD 2010–2012)',
  AC1021: 'DWG 2007 Format (AutoCAD 2007–2009)',
  AC1018: 'DWG 2004 Format (AutoCAD 2004–2006)',
  AC1015: 'DWG 2000 Format (AutoCAD 2000–2002)',
};

const PRESETS: RecoveryPreset[] = [
  {
    id: 'cannot-open-ac1032',
    label: 'Scenario 1: Cannot Open DWG ("Drawing file is not valid")',
    scenario: 'cannot-open',
    headerSig: 'AC1032',
    fileName: 'site-grading-plan.dwg',
    savetimeMin: '10',
    auditCtlVal: '1',
  },
  {
    id: 'opens-corrupt-ac1027',
    label: 'Scenario 2: Opens with Corrupt Entities / Slow Selection',
    scenario: 'opens-with-errors',
    headerSig: 'AC1027',
    fileName: 'hvac-riser-2015.dwg',
    savetimeMin: '5',
    auditCtlVal: '1',
  },
  {
    id: 'crash-null-header',
    label: 'Scenario 3: Power Outage / Truncated Zero-Byte Header',
    scenario: 'crash-autosave',
    headerSig: '0x000000',
    fileName: 'truncated-crash.dwg',
    savetimeMin: '10',
    auditCtlVal: '1',
  },
];

const SCENARIO_GUIDANCE: Record<
  FailureScenario,
  { primaryCommand: string; workflowTitle: string; steps: string[] }
> = {
  'cannot-open': {
    primaryCommand: 'RECOVER / RECOVERALL',
    workflowTitle: 'Damaged File Cannot Be Opened Directly',
    steps: [
      'Start desktop AutoCAD with a blank drawing and run RECOVER to perform a database audit while attempting to open the damaged .dwg file.',
      'If the drawing attaches damaged external references, run RECOVERALL so AutoCAD repairs both the host file and all nested xrefs.',
      'Set RECOVERAUTO to control recovery notifications when opening damaged files, and set AUDITCTL = 1 so AutoCAD writes a detailed .adt audit log.',
    ],
  },
  'opens-with-errors': {
    primaryCommand: 'AUDIT + PURGE / -PURGE + -WBLOCK',
    workflowTitle: 'Drawing Opens but Contains Database Errors or Bloat',
    steps: [
      'Run AUDIT in the open drawing and choose Yes at the "Fix any errors detected?" prompt (with AUDITCTL = 1 to generate an .adt report).',
      'Run PURGE or command-line -PURGE to remove unreferenced block definitions, layers, registered applications, zero-length geometry, empty text objects, and orphaned DGN linestyle data.',
      'Use -WBLOCK to write clean geometry out to a new drawing file, or run SAVEAS to export to DXF and re-save as DWG to rebuild object tables.',
    ],
  },
  'crash-autosave': {
    primaryCommand: 'DRAWINGRECOVERY (.bak / .sv$)',
    workflowTitle: 'Unexpected Crash, Freeze, or Power Failure',
    steps: [
      'Run DRAWINGRECOVERY in AutoCAD to open the Drawing Recovery Manager (status tracked by DRSTATE; behavior controlled by RECOVERYMODE).',
      'Under Backup Files, inspect available snapshots in order: DrawingFileName_recover.dwg, DrawingFileName_a_b_nnnn.sv$, DrawingFileName.dwg, and DrawingFileName.bak.',
      'Ensure ISAVEBAK = 1 (creates .bak files on save) and SAVETIME = 5 to 10 minutes (writes automatic save files to SAVEFILEPATH). Copy any valid .bak or .sv$ file and rename its extension to .dwg to open it.',
    ],
  },
};

const OFFICIAL_LINKS = [
  {
    name: 'Autodesk AutoCAD 2025 Help — Repair Damaged Drawing Files (RECOVER, RECOVERALL, AUDIT, AUDITCTL, PURGE)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-353D7074-378B-401E-A983-B2E6C1930264.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — About Recovering from a System Failure (_recover.dwg, .sv$, .bak)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-DDDADE14-9558-4EDB-A8C9-C235291CCBB4.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — -PURGE (Command) & -WBLOCK (Command)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-C3876E92-3478-449C-8FAB-DA760B2EDD09.htm',
  },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function CloudDwgDrawingRecoveryServiceClient() {
  const [scenario, setScenario] = useState<FailureScenario>('cannot-open');
  const [headerSig, setHeaderSig] = useState('AC1032');
  const [fileName, setFileName] = useState('site-grading-plan.dwg');
  const [savetimeStr, setSavetimeStr] = useState('10');
  const [auditCtlStr, setAuditCtlStr] = useState('1');

  const applyPreset = (p: RecoveryPreset) => {
    setScenario(p.scenario);
    setHeaderSig(p.headerSig);
    setFileName(p.fileName);
    setSavetimeStr(p.savetimeMin);
    setAuditCtlStr(p.auditCtlVal);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleLocalDwgHeaderRead = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.size < 6) {
      setHeaderSig('TRUNCATED (<6B)');
      return;
    }
    const buf = await file.slice(0, 6).arrayBuffer();
    const bytes = new Uint8Array(buf);
    const allZero = bytes.every((b) => b === 0);
    if (allZero) {
      setHeaderSig('0x000000');
      return;
    }
    const ascii = Array.from(bytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '?'))
      .join('');
    setHeaderSig(ascii);
  };

  const diag = useMemo(() => {
    const savetime = parseStrictNumber(savetimeStr);
    const auditCtl = parseStrictNumber(auditCtlStr);

    if (!Number.isFinite(savetime) || !Number.isFinite(auditCtl)) {
      return {
        valid: false as const,
        error: 'Enter valid finite integers for SAVETIME (0–600 minutes) and AUDITCTL (0 or 1).',
      };
    }
    if (!Number.isInteger(savetime) || savetime < 0 || savetime > 600) {
      return {
        valid: false as const,
        error: 'AutoCAD SAVETIME system variable must be an integer between 0 and 600 minutes.',
      };
    }
    if (auditCtl !== 0 && auditCtl !== 1) {
      return {
        valid: false as const,
        error: 'AutoCAD AUDITCTL system variable must be either 0 (Off) or 1 (On, writes .adt log).',
      };
    }

    const versionDesc = DWG_SIGNATURES[headerSig] ?? 'Unrecognized or Damaged DWG Header Signature';
    const isRecognizedHeader = Boolean(DWG_SIGNATURES[headerSig]);
    const guide = SCENARIO_GUIDANCE[scenario];

    const scrLines = [
      `; AutoCAD Post-Recovery Audit & Backup Safety Script (.scr)`,
      `; Generated locally by CADGuide.tools - Run inside desktop AutoCAD after opening recovered drawing`,
      `; Ensure .bak creation is enabled (ISAVEBAK = 1) and set automatic save interval (SAVETIME 0..600 min)`,
      `ISAVEBAK 1`,
      `SAVETIME ${savetime}`,
      `; Configure audit log file (.adt) generation (AUDITCTL: 1 = create .adt file, 0 = off)`,
      `AUDITCTL ${auditCtl}`,
      `; Run database integrity check and fix detected errors (Yes)`,
      `AUDIT Y`,
    ];

    return {
      valid: true as const,
      savetime,
      auditCtl,
      versionDesc,
      isRecognizedHeader,
      guide,
      scrContent: toSafeAscii(scrLines.join('\r\n') + '\r\n'),
    };
  }, [scenario, headerSig, savetimeStr, auditCtlStr]);

  const handleDownloadScr = () => {
    if (!diag.valid) return;
    const blob = new Blob([diag.scrContent], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autocad-audit-backup-setup.scr';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Honest disclosure banner */}
      <div
        data-testid="honest-recovery-disclosure"
        className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-sm text-amber-950">
          <h2 className="font-black text-base">
            Offline DWG Recovery Notice — No Browser Binary Repair
          </h2>
          <p className="leading-relaxed font-medium text-amber-900">
            This page <strong>does not reconstruct or repair corrupted binary DWG geometry in the browser</strong>. It
            reads only the first 6 bytes of a local file to check its <code>AC10xx</code> version signature (zero
            upload) and provides verified Autodesk AutoCAD offline recovery workflows (<code>RECOVER</code>,{' '}
            <code>RECOVERALL</code>, <code>AUDIT</code>, <code>DRAWINGRECOVERY</code>, <code>-PURGE</code>,{' '}
            <code>-WBLOCK</code>, and <code>.bak</code> / <code>.sv$</code> restoration). Avoid uploading confidential
            project drawings to unverified third-party websites.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Failure Triage Scenarios
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
                <FileSearch className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Triage & Script Inputs</h2>
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
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Optional Local 6-Byte Header Check (.dwg / .bak / .sv$)
            </label>
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 text-sm font-bold text-slate-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Check Local File Header</span>
              <input
                type="file"
                accept=".dwg,.bak,.sv$"
                onChange={handleLocalDwgHeaderRead}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">
              Target file: <strong data-testid="active-dwg-name">{fileName}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="dwg-scenario" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Observed Failure Mode
            </label>
            <select
              id="dwg-scenario"
              data-testid="select-scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value as FailureScenario)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 cursor-pointer"
            >
              <option value="cannot-open">Cannot open file / &quot;Drawing file is not valid&quot;</option>
              <option value="opens-with-errors">Opens with corrupt objects or bloat</option>
              <option value="crash-autosave">AutoCAD crash or power failure recovery</option>
            </select>
          </div>

          <div>
            <label htmlFor="dwg-savetime" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              SAVETIME Interval (0–600 min)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              AutoCAD automatic save interval in minutes (0 disables autosave; default is 10).
            </p>
            <input
              id="dwg-savetime"
              data-testid="input-savetime"
              type="text"
              inputMode="numeric"
              value={savetimeStr}
              onChange={(e) => setSavetimeStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="dwg-auditctl" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              AUDITCTL Log Switch (0 or 1)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              1 writes an <code>.adt</code> audit log file; 0 disables log file creation.
            </p>
            <input
              id="dwg-auditctl"
              data-testid="input-auditctl"
              type="text"
              inputMode="numeric"
              value={auditCtlStr}
              onChange={(e) => setAuditCtlStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Header Version Check & Official Recovery Steps
              </h2>
              <button
                type="button"
                data-testid="download-scr-button"
                disabled={!diag.valid}
                onClick={handleDownloadScr}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Audit .SCR
              </button>
            </div>

            {!diag.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{diag.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                  6-Byte Header Signature
                </div>
                <div className="text-2xl font-black text-blue-950 font-mono" data-testid="result-header-sig">
                  {diag.valid ? headerSig : '—'}
                </div>
                <div className="text-xs font-semibold text-blue-800 mt-1" data-testid="result-header-desc">
                  {diag.valid ? diag.versionDesc : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Primary Official AutoCAD Command
                </div>
                <div className="text-xl font-black text-slate-900 font-mono" data-testid="result-primary-command">
                  {diag.valid ? diag.guide.primaryCommand : '—'}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1" data-testid="result-savetime-summary">
                  {diag.valid ? `ISAVEBAK=1 | SAVETIME=${diag.savetime} min | AUDITCTL=${diag.auditCtl}` : '—'}
                </div>
              </div>
            </div>

            {diag.valid && (
              <>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                  <div className="text-sm font-black text-slate-900">{diag.guide.workflowTitle}</div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs font-medium text-slate-700 leading-relaxed">
                    {diag.guide.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    AutoCAD Script Preview (autocad-audit-backup-setup.scr)
                  </div>
                  <pre
                    data-testid="preview-recovery-scr"
                    className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed"
                  >
                    {diag.scrContent}
                  </pre>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              Official Autodesk AutoCAD Recovery Documentation
            </div>
            <div className="space-y-3">
              {OFFICIAL_LINKS.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-900">{item.name}</span>
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
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
