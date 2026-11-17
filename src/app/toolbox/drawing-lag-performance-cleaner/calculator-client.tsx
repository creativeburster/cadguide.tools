'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Wrench, Info, RotateCcw, Copy, Check, Download, Upload, AlertTriangle } from 'lucide-react';

const SAMPLE_ASCII_DXF = [
  '0', 'SECTION', '2', 'HEADER', '9', '$ACADVER', '1', 'AC1032', '0', 'ENDSEC',
  '0', 'SECTION', '2', 'TABLES',
  '0', 'TABLE', '2', 'APPID',
  '0', 'APPID', '2', 'ACAD',
  '0', 'APPID', '2', 'THIRD_PARTY_GIS',
  '0', 'APPID', '2', 'DGN_IMPORT_REGAPP',
  '0', 'ENDTAB',
  '0', 'TABLE', '2', 'LAYER',
  '0', 'LAYER', '2', '0',
  '0', 'LAYER', '2', 'ARCH_WALLS',
  '0', 'ENDTAB',
  '0', 'TABLE', '2', 'LTYPE',
  '0', 'LTYPE', '2', 'CONTINUOUS',
  '0', 'ENDTAB',
  '0', 'ENDSEC',
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LINE', '8', 'ARCH_WALLS', '10', '0.0', '20', '0.0', '11', '100.0', '21', '0.0',
  '0', 'LINE', '8', 'ARCH_WALLS', '10', '100.0', '20', '0.0', '11', '100.0', '21', '50.0',
  '0', 'POINT', '8', '0', '10', '0.0', '20', '0.0', '30', '0.0',
  '0', 'TEXT', '8', '0', '10', '10.0', '20', '10.0', '40', '2.5', '1', 'ROOM 101',
  '0', 'ENDSEC',
  '0', 'EOF',
].join('\n');

interface DxfAuditStats {
  totalLines: number;
  byteSize: number;
  appidCount: number;
  layerCount: number;
  ltypeCount: number;
  blockCount: number;
  entityCount: number;
  dgnDictionaryHits: number;
  isValidDxf: boolean;
}

function inspectAsciiDxf(text: string): DxfAuditStats {
  const lines = text.split(/\r?\n/);
  let appidCount = 0;
  let layerCount = 0;
  let ltypeCount = 0;
  let blockCount = 0;
  let entityCount = 0;
  let dgnDictionaryHits = 0;
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
    } else if (code === '0' && val === 'APPID') {
      appidCount++;
    } else if (code === '0' && val === 'LAYER') {
      layerCount++;
    } else if (code === '0' && val === 'LTYPE') {
      ltypeCount++;
    } else if (code === '0' && val === 'BLOCK') {
      blockCount++;
    } else if (inEntities && code === '0' && val !== 'VERTEX' && val !== 'SEQEND' && val !== 'ENDSEC') {
      entityCount++;
    }
    if (val.includes('ACAD_DGNLINESTYLECOMP')) {
      dgnDictionaryHits++;
    }
  }

  return {
    totalLines: lines.length,
    byteSize: text.length,
    appidCount,
    layerCount,
    ltypeCount,
    blockCount,
    entityCount,
    dgnDictionaryHits,
    isValidDxf: hasSection && text.includes('EOF'),
  };
}

export default function DrawingLagCleanerClient() {
  const [enableAudit, setEnableAudit] = useState(true);
  const [enableAecPurge, setEnableAecPurge] = useState(true);
  const [enableOverkill, setEnableOverkill] = useState(false);
  const [enablePurgeDialogHint, setEnablePurgeDialogHint] = useState(true);
  const [dxfText, setDxfText] = useState(SAMPLE_ASCII_DXF);
  const [dxfFileName, setDxfFileName] = useState('sample-bloat-check.dxf');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setEnableAudit(true);
    setEnableAecPurge(true);
    setEnableOverkill(false);
    setEnablePurgeDialogHint(true);
    setDxfText(SAMPLE_ASCII_DXF);
    setDxfFileName('sample-bloat-check.dxf');
    setCopied(false);
  };

  const handleUploadDxf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDxfFileName(file.name);
    const txt = await file.text();
    setDxfText(txt);
  };

  const auditStats = useMemo(() => inspectAsciiDxf(dxfText), [dxfText]);

  const scriptText = useMemo(() => {
    const lines: string[] = [
      ';; =========================================================================',
      ';; AutoCAD Drawing Lag & Bloat Cleanup Checklist Script (Pure ASCII .scr)',
      ';; Based strictly on Autodesk AutoCAD 2025 Core Help Command Reference',
      ';; Save a backup copy of your .dwg before running cleanup commands.',
      ';; =========================================================================',
      '',
    ];

    if (enableAudit) {
      lines.push(
        ';; 1. Enable AUDITCTL = 1 (.adt log) and inspect errors with AUDIT',
        'AUDITCTL',
        '1',
        ''
      );
    }

    if (enableAecPurge) {
      lines.push(
        ';; 2. PURGEAECDATA (Only works when no Xrefs are attached and no visible AEC objects exist)',
        'PURGEAECDATA',
        'Yes',
        ''
      );
    }

    if (enableOverkill) {
      lines.push(
        ';; 3. Remove duplicate/overlapping lines, arcs, and zero-length polyline segments',
        'OVERKILL',
        ''
      );
    }

    if (enablePurgeDialogHint) {
      lines.push(
        ';; 4. Interactive PURGE / -PURGE checklist:',
        ';; Run PURGE (or command-line -PURGE) to remove unused block definitions, layers,',
        ';; linetypes, registered applications, zero-length geometry, empty text objects,',
        ';; and select "Orphaned Data" in the Purge dialog to purge unneeded DGN linestyles.',
        'PURGE',
        ''
      );
    }

    lines.push(';; End of script');
    return lines.join('\r\n').replace(/[^\x20-\x7E\r\n\t]/g, '');
  }, [enableAudit, enableAecPurge, enableOverkill, enablePurgeDialogHint]);

  const handleCopyScript = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(scriptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadScr = () => {
    const blob = new Blob([scriptText], { type: 'text/plain;charset=ascii;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autocad_lag_cleanup.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">AutoCAD Drawing Lag Cleanup &amp; Read-Only DXF Inspector</h2>
            <p className="text-sm font-medium text-slate-500">
              Documented AutoCAD command script generator plus client-side read-only ASCII DXF table counter
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="text-xs font-black text-slate-600 uppercase">Cleanup Commands Included in .scr Script</div>

            <label className="flex items-start gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                data-testid="chk-audit"
                checked={enableAudit}
                onChange={(e) => setEnableAudit(e.target.checked)}
                className="mt-1 rounded border-slate-300"
              />
              <span>
                AUDITCTL = 1 &amp; AUDIT Guidance
                <span className="block text-xs font-normal text-slate-500">Enables .adt audit log output before running AUDIT database error checks.</span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                data-testid="chk-aec"
                checked={enableAecPurge}
                onChange={(e) => setEnableAecPurge(e.target.checked)}
                className="mt-1 rounded border-slate-300"
              />
              <span>
                PURGEAECDATA (Yes)
                <span className="block text-xs font-normal text-slate-500">Removes invisible AEC data when no xrefs are attached and no visible AEC objects remain.</span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                data-testid="chk-overkill"
                checked={enableOverkill}
                onChange={(e) => setEnableOverkill(e.target.checked)}
                className="mt-1 rounded border-slate-300"
              />
              <span>
                OVERKILL (Duplicate Geometry Cleanup)
                <span className="block text-xs font-normal text-slate-500">Removes duplicate or overlapping lines, arcs, and zero-length polyline segments.</span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                data-testid="chk-purge"
                checked={enablePurgeDialogHint}
                onChange={(e) => setEnablePurgeDialogHint(e.target.checked)}
                className="mt-1 rounded border-slate-300"
              />
              <span>
                PURGE / -PURGE (Regapps, Zero-Length, Empty Text &amp; Orphaned DGN Data)
                <span className="block text-xs font-normal text-slate-500">Opens PURGE so you can clean unreferenced definitions and select Orphaned Data for DGN linestyles.</span>
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-600 uppercase">Generated Pure ASCII .scr Script</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </button>
                <button
                  type="button"
                  data-testid="export-scr-button"
                  onClick={handleDownloadScr}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .scr
                </button>
              </div>
            </div>
            <pre
              data-testid="script-preview"
              className="rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] p-4 overflow-x-auto leading-relaxed max-h-64"
            >
              {scriptText}
            </pre>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Read-Only ASCII DXF Bloat Inspector</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Inspecting: <span className="font-mono font-bold text-slate-700">{dxfFileName}</span> (diagnostic read-only — does not rewrite DXF)
                </p>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-black cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Inspect .dxf
                <input
                  data-testid="input-dxf-upload"
                  type="file"
                  accept=".dxf"
                  onChange={handleUploadDxf}
                  className="hidden"
                />
              </label>
            </div>

            {!auditStats.isValidDxf && (
              <div className="rounded-xl p-3 bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Input does not contain ASCII DXF SECTION/EOF markers (binary DWG/DXF cannot be inspected as plain ASCII text).</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Registered APPIDs</div>
                <div data-testid="stat-appid" className="text-2xl font-black text-slate-900">{auditStats.appidCount}</div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Layers Defined</div>
                <div data-testid="stat-layers" className="text-2xl font-black text-slate-900">{auditStats.layerCount}</div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">DXF Entities</div>
                <div data-testid="stat-entities" className="text-2xl font-black text-slate-900">{auditStats.entityCount}</div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">Linetypes / Blocks</div>
                <div className="text-lg font-black text-slate-900">{auditStats.ltypeCount} / {auditStats.blockCount}</div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">DGN Dict Hits</div>
                <div data-testid="stat-dgn" className="text-2xl font-black text-slate-900">{auditStats.dgnDictionaryHits}</div>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                <div className="text-[11px] font-black text-slate-400 uppercase">ASCII Size</div>
                <div className="text-lg font-black text-slate-900">{auditStats.byteSize} B</div>
              </div>
            </div>

            <textarea
              data-testid="input-dxf-text"
              rows={5}
              value={dxfText}
              onChange={(e) => {
                setDxfFileName('pasted-text.dxf');
                setDxfText(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 bg-white"
            />
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
            <div>
              <strong>Official AutoCAD Command Scope:</strong>{' '}
              Includes <code>AUDIT</code> / <code>AUDITCTL</code>, <code>PURGE</code> / <code>-PURGE</code> (named definitions, registered applications, zero-length geometry, empty text objects, and Orphaned Data for DGN linestyles), <code>PURGEAECDATA</code>, and <code>OVERKILL</code>.
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
