'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Info,
  Layers,
  RotateCcw,
  Settings,
  Sparkles,
} from 'lucide-react';

type SymptomId = 'question_mark' | 'scrambled_gibberish' | 'outline_geometry';

const SYMPTOMS: Array<{ id: SymptomId; name: string; desc: string; badge: string }> = [
  {
    id: 'question_mark',
    name: 'All Asian / Chinese characters display as question marks (?)',
    desc: 'Occurs when opening external drawings where SHX Big Fonts are missing from the local CAD Fonts directory.',
    badge: 'FONTALT / SHX missing',
  },
  {
    id: 'scrambled_gibberish',
    name: 'Text becomes scrambled symbols or unreadable PDF comments',
    desc: 'Exported PDF viewers misdecode SHX text stored as PDF comment annotations controlled by PDFSHX.',
    badge: 'PDFSHX conflict',
  },
  {
    id: 'outline_geometry',
    name: 'TrueType text plots as hollow outlines with bloated PDF size',
    desc: 'Text objects render as unfilled outlines when TEXTFILL is 0 or when PC3 driver converts TrueType fonts to geometry.',
    badge: 'TEXTFILL=0 / PC3 Geometry',
  },
];

function validateFontAlt(raw: string): { valid: true; cleaned: string } | { valid: false; error: string } {
  const t = raw.trim();
  if (!t) {
    return { valid: false, error: 'Alternate font filename cannot be empty (e.g. gbcbig.shx, bigfont.shx, simplex.shx).' };
  }
  if (!/^[\x21-\x7E]+$/.test(t) || /["\\]/.test(t)) {
    return {
      valid: false,
      error: 'Alternate font name must be printable ASCII without spaces, quotes ("), or backslashes (\\).',
    };
  }
  return { valid: true, cleaned: t };
}

function buildScripts(symptomId: SymptomId, fontAltRaw: string) {
  const fontCheck = validateFontAlt(fontAltRaw);
  if (symptomId === 'question_mark' && !fontCheck.valid) {
    return { valid: false as const, error: fontCheck.error };
  }
  const safeFont = fontCheck.valid ? fontCheck.cleaned : 'gbcbig.shx';

  let lispBody = '';
  let scrLines: string[] = [];

  if (symptomId === 'question_mark') {
    lispBody = `(setvar "FONTALT" "${safeFont}")\n  (princ "\\n[OK] FONTALT set to ${safeFont}. Reopen the drawing to apply fallback.\\n")`;
    scrLines = [`FONTALT`, `${safeFont}`, `REGEN`];
  } else if (symptomId === 'scrambled_gibberish') {
    lispBody = `(setvar "PDFSHX" 0)\n  (princ "\\n[OK] PDFSHX set to 0. SHX text will not export as PDF comments.\\n")`;
    scrLines = [`PDFSHX`, `0`];
  } else {
    lispBody = `(setvar "PDFSHX" 0)\n  (setvar "TEXTFILL" 1)\n  (princ "\\n[OK] TEXTFILL set to 1 and PDFSHX set to 0.\\n")`;
    scrLines = [`PDFSHX`, `0`, `TEXTFILL`, `1`, `REGEN`];
  }

  const lispCode = [
    '; CADGuide.tools Pure-ASCII AutoLISP Plot Font Fix',
    '(defun c:FIXPDFFONT ()',
    '  (setvar "CMDECHO" 0)',
    `  ${lispBody}`,
    '  (setvar "CMDECHO" 1)',
    '  (princ)',
    ')',
    '(princ "\\nType FIXPDFFONT and press Enter to apply.\\n")',
    '(princ)',
  ].join('\n');

  const scrCode = scrLines.join('\r\n') + '\r\n';

  return {
    valid: true as const,
    safeFont,
    lispCode,
    scrCode,
  };
}

export default function PdfFontGibberishClient() {
  const [symptomId, setSymptomId] = useState<SymptomId>('question_mark');
  const [fontAltVal, setFontAltVal] = useState('gbcbig.shx');
  const [copied, setCopied] = useState(false);

  const scriptRes = useMemo(() => buildScripts(symptomId, fontAltVal), [symptomId, fontAltVal]);

  const diagramStates = useMemo(() => {
    if (symptomId === 'question_mark') {
      return { search: 'danger', pc3: 'inactive', pdf: 'danger' };
    }
    if (symptomId === 'scrambled_gibberish') {
      return { search: 'success', pc3: 'danger', pdf: 'danger' };
    }
    return { search: 'success', pc3: 'warning', pdf: 'warning' };
  }, [symptomId]);

  const handleReset = () => {
    setSymptomId('question_mark');
    setFontAltVal('gbcbig.shx');
  };

  const handleCopy = () => {
    if (!scriptRes.valid) return;
    navigator.clipboard
      .writeText(scriptRes.lispCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const triggerDownload = (content: string, filename: string) => {
    const safeAscii = content.replace(/[^\x20-\x7E\r\n\t]/g, '');
    const blob = new Blob([safeAscii.endsWith('\n') ? safeAscii : safeAscii + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-10 relative">
          <div>
            <h2 className="text-white font-black text-lg tracking-tight">PDF Plot Rendering &amp; Font Pipeline Diagnostics</h2>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">FONTALT / PDFSHX / TEXTFILL Pipeline</p>
          </div>
          <button
            type="button"
            data-testid="btn-reset"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 py-6 px-4">
          <svg viewBox="0 0 640 120" className="w-full max-w-[600px] h-auto" aria-label="PDF Plot Flow">
            <path d="M 60 60 L 200 60" fill="none" stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'} strokeWidth="2" />
            <path d="M 200 60 L 380 60" fill="none" stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'warning' ? '#f59e0b' : '#475569'} strokeWidth="2" />
            <path d="M 380 60 L 560 60" fill="none" stroke={diagramStates.pdf === 'danger' ? '#ef4444' : '#f59e0b'} strokeWidth="2" />

            <g transform="translate(60, 60)">
              <circle r="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Layers className="w-5 h-5 text-blue-400" />
              </g>
              <text y="34" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">DWG Drawing</text>
            </g>
            <g transform="translate(200, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.search === 'danger' ? '#ef4444' : '#10b981'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <FileText className={`w-5 h-5 ${diagramStates.search === 'danger' ? 'text-red-400' : 'text-emerald-400'}`} />
              </g>
              <text y="34" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                {diagramStates.search === 'danger' ? 'SHX Font Missing' : 'FONTALT OK'}
              </text>
            </g>
            <g transform="translate(380, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pc3 === 'danger' ? '#ef4444' : diagramStates.pc3 === 'warning' ? '#f59e0b' : '#475569'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Settings className="w-5 h-5 text-slate-300" />
              </g>
              <text y="34" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                {diagramStates.pc3 === 'danger' ? 'PDFSHX Conflict' : diagramStates.pc3 === 'warning' ? 'TEXTFILL=0 Outlines' : 'Plotter Driver'}
              </text>
            </g>
            <g transform="translate(560, 60)">
              <circle r="20" fill="#1e293b" stroke={diagramStates.pdf === 'danger' ? '#ef4444' : '#f59e0b'} strokeWidth="2" />
              <g transform="translate(-10, -10)">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </g>
              <text y="34" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                {diagramStates.pdf === 'danger' ? 'Unreadable PDF' : 'Hollow Outlines'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-800 font-black text-lg tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Select Symptom
            </h3>
            <div className="flex flex-col gap-2">
              {SYMPTOMS.map((sym) => {
                const isActive = sym.id === symptomId;
                return (
                  <button
                    key={sym.id}
                    type="button"
                    data-testid={`symptom-${sym.id}`}
                    onClick={() => setSymptomId(sym.id)}
                    className={`w-full flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                      isActive ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 font-bold' : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                    }`}
                  >
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {sym.badge}
                    </span>
                    <span className="text-sm text-slate-800 font-black mt-2">{sym.name}</span>
                    <span className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{sym.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {symptomId === 'question_mark' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">FONTALT Target Font</h3>
              </div>
              <label htmlFor="fontAlt" className="text-xs font-black text-slate-500 uppercase">Alternate Font Filename (SHX)</label>
              <input
                id="fontAlt"
                type="text"
                data-testid="input-fontalt"
                value={fontAltVal}
                onChange={(e) => setFontAltVal(e.target.value)}
                placeholder="gbcbig.shx"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base font-semibold text-slate-800"
              />
              <div className="flex flex-wrap gap-1.5">
                <button type="button" data-testid="font-gbcbig" onClick={() => setFontAltVal('gbcbig.shx')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-100">gbcbig.shx</button>
                <button type="button" data-testid="font-bigfont" onClick={() => setFontAltVal('bigfont.shx')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-100">bigfont.shx</button>
                <button type="button" data-testid="font-simplex" onClick={() => setFontAltVal('simplex.shx')} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-100">simplex.shx</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Diagnosis &amp; System Variable Remediation
            </h3>

            {symptomId === 'question_mark' && (
              <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>When a drawing references an unavailable SHX or Asian Big Font, AutoCAD substitutes the alternate font stored in the <code className="font-mono font-bold text-slate-800">FONTALT</code> system variable (Registry-saved).</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Run <code className="font-mono font-bold">FONTALT</code> and assign a valid installed fallback (such as <code className="font-mono font-bold">{fontAltVal || 'gbcbig.shx'}</code>).</li>
                  <li>Save and reopen the drawing so unmapped styles resolve cleanly.</li>
                </ol>
              </div>
            )}

            {symptomId === 'scrambled_gibberish' && (
              <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>The <code className="font-mono font-bold text-slate-800">PDFSHX</code> system variable (Initial value: 1) controls whether SHX font text is stored inside exported PDFs as PDF comments. Setting <code className="font-mono font-bold">PDFSHX</code> to <code className="font-mono font-bold">0</code> omits comment annotations that misrender in some PDF viewers.</p>
              </div>
            )}

            {symptomId === 'outline_geometry' && (
              <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>The <code className="font-mono font-bold text-slate-800">TEXTFILL</code> system variable controls whether TrueType fonts are filled-in for plotting (<code className="font-mono font-bold">0</code> displays text as outlines; <code className="font-mono font-bold">1</code> fills TrueType fonts). Also verify in your PC3 custom properties that TrueType text is not forced to geometry.</p>
              </div>
            )}

            {!scriptRes.valid ? (
              <div data-testid="validation-error" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{scriptRes.error}</span>
              </div>
            ) : (
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 font-mono text-sm space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-slate-400">Pure-ASCII AutoLISP &amp; Command Script</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      data-testid="btn-copy"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-sans font-bold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy LISP'}
                    </button>
                    <button
                      type="button"
                      data-testid="btn-download-lsp"
                      onClick={() => triggerDownload(scriptRes.lispCode, 'fix_pdf_font.lsp')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-sans font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .LSP
                    </button>
                    <button
                      type="button"
                      data-testid="btn-download-scr"
                      onClick={() => triggerDownload(scriptRes.scrCode, 'fix_pdf_font.scr')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-sans font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .SCR
                    </button>
                  </div>
                </div>
                <pre data-testid="lisp-preview" className="overflow-x-auto text-emerald-400 p-3 bg-slate-950/60 rounded-lg text-xs">
                  {scriptRes.lispCode}
                </pre>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-black text-slate-700">Autodesk AutoCAD 2025 Official Documentation References:</div>
              <div className="flex flex-wrap gap-4">
                <a href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-858A8D84-5104-4A35-9C82-2094DF6F411D.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                  FONTALT <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-928DF015-1E04-4CC2-AF1B-0037548DFBAE.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                  Substitute Fonts <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-56EA988C-A1DA-4E85-8765-B3F31A01AB02.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                  PDFSHX <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-8E1786B0-D31D-4A61-8A84-78E7BE34867B.htm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                  TEXTFILL <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
