'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Download, FileCode, Info, Settings, Upload, RotateCcw, Copy, Check, ExternalLink } from 'lucide-react';

const SAMPLE_BLOATED_DXF = [
  '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1032', '0', 'ENDSEC',
  '0', 'SECTION', '2', 'TABLES',
  '0', 'TABLE', '2', 'APPID',
  '0', 'APPID', '2', 'ACAD',
  '0', 'APPID', '2', 'ORPHAN_GIS_LINK',
  '0', 'APPID', '2', 'LEGACY_TARCH_XDATA',
  '0', 'APPID', '2', 'DGN_ORPHAN_REGAPP',
  '0', 'ENDTAB',
  '0', 'TABLE', '2', 'LAYER',
  '0', 'LAYER', '2', '0',
  '0', 'LAYER', '2', 'WALLS',
  '0', 'ENDTAB',
  '0', 'ENDSEC',
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LINE', '8', 'WALLS', '10', '0', '20', '0', '11', '100', '21', '0',
  '0', 'ENDSEC',
  '0', 'EOF',
].join('\n');

const SAMPLE_CLEAN_DXF = [
  '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1032', '0', 'ENDSEC',
  '0', 'SECTION', '2', 'TABLES',
  '0', 'TABLE', '2', 'APPID',
  '0', 'APPID', '2', 'ACAD',
  '0', 'ENDTAB',
  '0', 'TABLE', '2', 'LAYER',
  '0', 'LAYER', '2', '0',
  '0', 'ENDTAB',
  '0', 'ENDSEC',
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LINE', '8', '0', '10', '0', '20', '0', '11', '50', '21', '0',
  '0', 'ENDSEC',
  '0', 'EOF',
].join('\n');

interface DxfRegappInspection {
  validDxf: boolean;
  acadVer: string;
  appIds: string[];
  nonAcadAppIds: string[];
  layerCount: number;
  entityCount: number;
}

function inspectAsciiDxfRegapps(text: string): DxfRegappInspection {
  const lines = text.split(/\r?\n/);
  const appIds: string[] = [];
  let acadVer = 'UNKNOWN';
  let layerCount = 0;
  let entityCount = 0;
  let inEntities = false;
  let hasSection = false;

  for (let i = 0; i < lines.length - 1; i += 2) {
    const code = lines[i].trim();
    const val = lines[i + 1].trim();
    if (code === '0' && val === 'SECTION') {
      hasSection = true;
    } else if (code === '2' && val === 'ENTITIES') {
      inEntities = true;
    } else if (code === '0' && val === 'ENDSEC') {
      inEntities = false;
    } else if (code === '9' && val === '$ACADVER' && i + 3 < lines.length) {
      acadVer = lines[i + 3].trim();
    } else if (code === '0' && val === 'APPID') {
      for (let j = i + 2; j < lines.length - 1; j += 2) {
        const nc = lines[j].trim();
        const nv = lines[j + 1].trim();
        if (nc === '0') break;
        if (nc === '2') {
          appIds.push(nv);
          break;
        }
      }
    } else if (code === '0' && val === 'LAYER') {
      layerCount++;
    } else if (inEntities && code === '0' && val !== 'VERTEX' && val !== 'SEQEND' && val !== 'ENDSEC') {
      entityCount++;
    }
  }

  const nonAcadAppIds = appIds.filter((a) => a.toUpperCase() !== 'ACAD');
  return {
    validDxf: hasSection && text.includes('EOF'),
    acadVer,
    appIds,
    nonAcadAppIds,
    layerCount,
    entityCount,
  };
}

const OFFICIAL_LINKS = [
  {
    name: 'Autodesk AutoCAD 2025 Help — -PURGE (Command: registered applications, Verify Each Name)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-C3876E92-3478-449C-8FAB-DA760B2EDD09.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — Repair Damaged Drawing Files (AUDIT, AUDITCTL)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-353D7074-378B-401E-A983-B2E6C1930264.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — CMDECHO (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-E7599129-5A3B-4121-A0C3-A625CA96E55B.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Developer Help — AutoCAD Core Console',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core-Console/files/AUTOCAD_CORE_CONSOLE.html',
  },
];

function toAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function MissingRegappCleanerClient() {
  const [dxfText, setDxfText] = useState(SAMPLE_BLOATED_DXF);
  const [fileName, setFileName] = useState('sample-bloated-regapps.dxf');
  const [purgeAll, setPurgeAll] = useState(true);
  const [runAudit, setRunAudit] = useState(true);
  const [setAuditCtl, setSetAuditCtl] = useState(true);
  const [echoOff, setEchoOff] = useState(true);
  const [activeTab, setActiveTab] = useState<'scr' | 'lisp'>('scr');
  const [copied, setCopied] = useState(false);

  const inspection = useMemo(() => inspectAsciiDxfRegapps(dxfText), [dxfText]);

  const scripts = useMemo(() => {
    const scrLines = [
      '; AutoCAD Registered Application Cleanup Script (.scr)',
      '; Create a backup copy of your drawing before running -PURGE or AUDIT.',
    ];
    if (setAuditCtl) {
      scrLines.push('; Set AUDITCTL = 1 to write an .adt audit log file', 'AUDITCTL', '1');
    }
    scrLines.push(
      '; Purge registered applications without verify prompt',
      '-PURGE',
      'R',
      '*',
      'N'
    );
    if (purgeAll) {
      scrLines.push('; Purge all unreferenced named objects', '-PURGE', 'A', '*', 'N');
    }
    if (runAudit) {
      scrLines.push('; Run AUDIT and choose Yes to fix detected errors', 'AUDIT', 'Y');
    }

    const lispLines = [
      ';; AutoLISP Regapp Cleanup Helper (Pure ASCII)',
      ';; Save a backup copy of your drawing before running CLEANDWG.',
      '(defun c:CleanDwg (/)',
      `  (setvar "CMDECHO" ${echoOff ? 0 : 1})`,
    ];
    if (setAuditCtl) {
      lispLines.push('  (setvar "AUDITCTL" 1)');
    }
    lispLines.push('  (command "-PURGE" "R" "*" "N")');
    if (purgeAll) {
      lispLines.push('  (command "-PURGE" "A" "*" "N")');
    }
    if (runAudit) {
      lispLines.push('  (command "AUDIT" "Y")');
    }
    lispLines.push('  (setvar "CMDECHO" 1)', '  (princ)', ')');

    return {
      scr: toAscii(scrLines.join('\r\n') + '\r\n'),
      lisp: toAscii(lispLines.join('\r\n') + '\r\n'),
    };
  }, [purgeAll, runAudit, setAuditCtl, echoOff]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const txt = await f.slice(0, 4 * 1024 * 1024).text();
    setDxfText(txt);
  };

  const resetDefaults = () => {
    setDxfText(SAMPLE_BLOATED_DXF);
    setFileName('sample-bloated-regapps.dxf');
    setPurgeAll(true);
    setRunAudit(true);
    setSetAuditCtl(true);
    setEchoOff(true);
    setActiveTab('scr');
    setCopied(false);
  };

  const handleCopy = async () => {
    const payload = activeTab === 'scr' ? scripts.scr : scripts.lisp;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return;
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadFile = (text: string, fname: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Cleanup Options &amp; DXF</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-bloated"
              onClick={() => {
                setDxfText(SAMPLE_BLOATED_DXF);
                setFileName('sample-bloated-regapps.dxf');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
            >
              Sample 1: 4 APPIDs (3 Non-ACAD)
            </button>
            <button
              type="button"
              data-testid="preset-clean"
              onClick={() => {
                setDxfText(SAMPLE_CLEAN_DXF);
                setFileName('sample-clean-regapps.dxf');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
            >
              Sample 2: Clean DXF (1 APPID)
            </button>
          </div>

          <div>
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 text-xs font-bold text-slate-700 cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Inspect Local ASCII .DXF (0 Upload)</span>
              <input type="file" accept=".dxf,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-xs text-slate-500 mt-1.5">Active file: <strong>{fileName}</strong></p>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700">
              <input type="checkbox" data-testid="checkbox-purge-all" checked={purgeAll} onChange={(e) => setPurgeAll(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span>Include -PURGE All (*, N)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700">
              <input type="checkbox" data-testid="checkbox-audit" checked={runAudit} onChange={(e) => setRunAudit(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span>Run AUDIT (Fix errors: Y)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700">
              <input type="checkbox" data-testid="checkbox-auditctl" checked={setAuditCtl} onChange={(e) => setSetAuditCtl(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span>Set AUDITCTL = 1 (.adt log)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700">
              <input type="checkbox" data-testid="checkbox-cmdecho" checked={echoOff} onChange={(e) => setEchoOff(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span>Set CMDECHO = 0 in AutoLISP</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900">Local DXF APPID Table Inspection</h2>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  !inspection.validDxf
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : inspection.nonAcadAppIds.length > 0
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {!inspection.validDxf
                  ? 'INVALID ASCII DXF'
                  : inspection.nonAcadAppIds.length > 0
                  ? `${inspection.nonAcadAppIds.length} NON-ACAD REGAPPS FOUND`
                  : 'CLEAN APPID TABLE'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase mb-1">Total APPIDs</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-appid-total">{inspection.validDxf ? inspection.appIds.length : '—'}</span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase mb-1">Non-ACAD APPIDs</div>
                <div className="text-2xl font-black text-amber-900">
                  <span data-testid="result-non-acad">{inspection.validDxf ? inspection.nonAcadAppIds.length : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase mb-1">DXF Layers</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-layers">{inspection.validDxf ? inspection.layerCount : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase mb-1">ENTITIES Count</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-entities">{inspection.validDxf ? inspection.entityCount : '—'}</span>
                </div>
              </div>
            </div>

            {inspection.validDxf && inspection.appIds.length > 0 && (
              <div className="text-xs font-mono bg-slate-50 rounded-xl p-3 border border-slate-200 text-slate-700" data-testid="result-appid-list">
                Detected APPID records ({inspection.acadVer}): {inspection.appIds.join(', ')}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  data-testid="tab-scr"
                  onClick={() => setActiveTab('scr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeTab === 'scr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  purge_regapps.scr
                </button>
                <button
                  type="button"
                  data-testid="tab-lisp"
                  onClick={() => setActiveTab('lisp')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeTab === 'lisp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  cleanup.lsp
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Script'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={() => downloadFile(scripts.scr, 'purge_regapps.scr')}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .scr</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download-lisp"
                  onClick={() => downloadFile(scripts.lisp, 'cleanup.lsp')}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Download .lsp</span>
                </button>
              </div>
            </div>

            <pre data-testid="preview-script" className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
              {activeTab === 'scr' ? scripts.scr : scripts.lisp}
            </pre>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Official Autodesk Documentation Sources</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_LINKS.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-800"
                >
                  <span>{link.name}</span>
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
