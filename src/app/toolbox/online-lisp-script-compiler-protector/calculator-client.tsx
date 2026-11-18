'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_LISP_CLEAN = `; Pure-ASCII AutoLISP Sample Routine
(defun c:CLEANLAY ( / ss oldEcho)
  (setq oldEcho (getvar "CMDECHO"))
  (setvar "CMDECHO" 0)
  (setq ss (ssget "_X"))
  (if ss
    (princ (strcat "\\nScanned entities: " (itoa (sslength ss))))
  )
  (setvar "CMDECHO" oldEcho)
  (princ)
)

(defun helper-add (a b / sum)
  (setq sum (+ a b))
  sum
)`;

const SAMPLE_LISP_UNBALANCED = `; Unbalanced Parentheses & Unscoped Global Check Sample
(defun c:BROKEN_TEST (pt)
  (setq globalLeakVar 100)
  (command "_CIRCLE" pt 25.0
  (princ)
)`;

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function auditAutoLisp(source: string) {
  if (!source.trim()) {
    return { valid: false as const, error: 'AutoLISP (.lsp) source cannot be empty.' };
  }

  let openParens = 0;
  let closeParens = 0;
  let depth = 0;
  let maxDepth = 0;
  let minDepth = 0;
  let unclosedQuotes = 0;
  let inString = false;
  let inComment = false;
  let escaped = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\n') {
      inComment = false;
      if (inString) {
        unclosedQuotes++;
        inString = false;
      }
      escaped = false;
      continue;
    }
    if (inComment) continue;
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === ';') {
      inComment = true;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '(') {
      openParens++;
      depth++;
      if (depth > maxDepth) maxDepth = depth;
    } else if (ch === ')') {
      closeParens++;
      depth--;
      if (depth < minDepth) minDepth = depth;
    }
  }
  if (inString) unclosedQuotes++;

  const strippedCode = source
    .replace(/;[^\r\n]*/g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""');
  const defunRegex = /\(\s*defun\s+([^\s(]+)\s*\(([^)]*)\)/gi;
  let defunCount = 0;
  let missingLocalSlashCount = 0;
  const defuns: Array<{ name: string; hasLocals: boolean }> = [];
  let m: RegExpExecArray | null;
  while ((m = defunRegex.exec(strippedCode)) !== null) {
    defunCount++;
    const hasLocals = m[2].includes('/');
    if (!hasLocals) missingLocalSlashCount++;
    defuns.push({ name: m[1], hasLocals });
  }

  const parenBalanced = openParens === closeParens && minDepth >= 0;
  const syntaxStatus = parenBalanced && unclosedQuotes === 0 ? 'PASS' : 'FAIL';

  return {
    valid: true as const,
    openParens,
    closeParens,
    parenDelta: openParens - closeParens,
    maxDepth,
    unclosedQuotes,
    defunCount,
    missingLocalSlashCount,
    defuns,
    parenBalanced,
    syntaxStatus,
  };
}

export default function OnlineLispScriptCompilerProtectorClient() {
  const [lispSource, setLispSource] = useState(SAMPLE_LISP_CLEAN);
  const [copied, setCopied] = useState(false);

  const report = useMemo(() => auditAutoLisp(lispSource), [lispSource]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.slice(0, 2 * 1024 * 1024).text();
    setLispSource(text);
  };

  const resetDefaults = () => {
    setLispSource(SAMPLE_LISP_CLEAN);
  };

  const handleCopy = () => {
    if (!report.valid) return;
    const lines = [
      'AutoLISP Static Syntax & Scope Audit Report',
      `Parenthesis Balance: ${report.syntaxStatus} (Open=${report.openParens}, Close=${report.closeParens}, MaxDepth=${report.maxDepth})`,
      `Unclosed String Quotes: ${report.unclosedQuotes}`,
      `defun Declarations: ${report.defunCount} | Missing Local "/" Separator: ${report.missingLocalSlashCount}`,
    ];
    navigator.clipboard
      .writeText(lines.join('\n'))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!report.valid) return;
    const lines = [
      'Check,Value,Status',
      `Syntax Balance,${report.openParens}/${report.closeParens},${report.syntaxStatus}`,
      `Max Nesting Depth,${report.maxDepth},INFO`,
      `Unclosed Quotes,${report.unclosedQuotes},${report.unclosedQuotes === 0 ? 'PASS' : 'FAIL'}`,
      `Total defun Routines,${report.defunCount},INFO`,
      `Routines Missing "/" Locals,${report.missingLocalSlashCount},${report.missingLocalSlashCount === 0 ? 'PASS' : 'WARN'}`,
      ...report.defuns.map((d) => `defun ${toSafeAscii(d.name)},1,${d.hasLocals ? 'SCOPED' : 'UNSCOPED'}`),
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autolisp_static_audit.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Browser-Local AutoLISP Static Linter Only:</span> Verifies parenthesis depth balance, unclosed string literals, and `defun` local variable `/` declarations before compiling inside Visual LISP IDE (`0 bytes uploaded`). Browser runtime does not compile `.fas`/`.vlx` binaries; compile locally via AutoCAD `VLISP` (`LISPSYS`).
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-clean"
          onClick={() => setLispSource(SAMPLE_LISP_CLEAN)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Clean Balanced AutoLISP (18/18 parens, 2 defuns)
        </button>
        <button
          type="button"
          data-testid="preset-unbalanced"
          onClick={() => setLispSource(SAMPLE_LISP_UNBALANCED)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Unbalanced Parenthesis + Missing Locals Sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">AutoLISP (.lsp) Source</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Load .lsp
              <input type="file" accept=".lsp,.mnl,.txt" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          <textarea
            data-testid="input-lsp"
            rows={14}
            value={lispSource}
            onChange={(e) => setLispSource(e.target.value)}
            spellCheck={false}
            className="w-full p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs border border-slate-200"
          />
          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Sample
          </button>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Static Audit Report</h2>
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
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!report.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Audit CSV
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
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    report.syntaxStatus === 'PASS'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">Syntax Check</div>
                  <div data-testid="out-status" className="text-2xl font-black mt-1">
                    {report.syntaxStatus}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-bold text-blue-600 uppercase">Open / Close Parens</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    <span data-testid="out-open">{report.openParens}</span> /{' '}
                    <span data-testid="out-close">{report.closeParens}</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase">defun Routines</div>
                  <div data-testid="out-defuns" className="text-2xl font-black text-slate-900 mt-1">
                    {report.defunCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="text-xs font-bold text-amber-700 uppercase">Missing &quot;/&quot; Locals</div>
                  <div data-testid="out-missing-locals" className="text-2xl font-black text-amber-900 mt-1">
                    {report.missingLocalSlashCount}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Catches unmatched parentheses, unclosed strings, and unscoped `defun` symbols locally prior to Visual LISP (`VLISP`) `.fas`/`.vlx` compilation.
                </span>
              </div>
              <a
                href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-5601ACC6-C4F6-4375-9C2C-3DBCAE2880B1.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                AutoCAD 2025 VLISP Command Help <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
