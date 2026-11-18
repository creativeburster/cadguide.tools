'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  Languages,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_GERMAN_DXF = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1027
0
ENDSEC
0
SECTION
2
ENTITIES
0
TEXT
8
NOTES
10
10
20
50
40
5
1
WERKSTOFF: STAHL
0
TEXT
8
NOTES
10
10
20
40
40
5
1
BOHRUNG D=12 MM
0
MTEXT
8
NOTES
10
10
20
25
40
5
1
WELLE UND DICHTUNG PRUEFEN
0
ENDSEC
0
EOF`;

const DEFAULT_GLOSSARY = `STAHL=STEEL
BOHRUNG=BORE HOLE
WELLE=SHAFT
DICHTUNG=SEAL
WERKSTOFF=MATERIAL
PRUEFEN=INSPECT`;

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

interface ExtractedText {
  entityType: 'TEXT' | 'MTEXT';
  layer: string;
  original: string;
  translated: string;
  changed: boolean;
}

export default function OnlineDxfTextTranslatorCloudClient() {
  const [dxfSource, setDxfSource] = useState(SAMPLE_GERMAN_DXF);
  const [glossaryText, setGlossaryText] = useState(DEFAULT_GLOSSARY);
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.slice(0, 4 * 1024 * 1024).text();
    setDxfSource(text);
  };

  const resetDefaults = () => {
    setDxfSource(SAMPLE_GERMAN_DXF);
    setGlossaryText(DEFAULT_GLOSSARY);
  };

  const result = useMemo(() => {
    const rawLines = dxfSource.split(/\r?\n/);
    if (!dxfSource.trim() || !rawLines.some((l) => l.trim().toUpperCase() === 'SECTION')) {
      return {
        valid: false as const,
        error: 'Provide valid ASCII DXF content containing SECTION/ENTITIES group-code pairs.',
      };
    }

    const pairs: Array<[string, string]> = glossaryText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.includes('='))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()] as [string, string];
      })
      .filter(([src]) => src.length > 0)
      .sort((a, b) => b[0].length - a[0].length);

    if (pairs.length === 0) {
      return {
        valid: false as const,
        error: 'Glossary mapping must contain at least one SOURCE=TARGET entry.',
      };
    }

    const translateStr = (input: string) => {
      let out = input;
      let hitCount = 0;
      for (const [src, dst] of pairs) {
        const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'g');
        const matches = out.match(re);
        if (matches) {
          hitCount += matches.length;
          out = out.replace(re, dst);
        }
      }
      return { out, hitCount };
    };

    const items: ExtractedText[] = [];
    const outputLines = [...rawLines];
    let currentEntity: '' | 'TEXT' | 'MTEXT' = '';
    let currentLayer = '0';
    let inEntities = false;
    let totalTermReplacements = 0;

    for (let i = 0; i < outputLines.length - 1; i += 2) {
      const code = outputLines[i].trim();
      const val = outputLines[i + 1].trim();
      if (code === '0' && val === 'SECTION') {
        const nc = (outputLines[i + 2] || '').trim();
        const nv = (outputLines[i + 3] || '').trim().toUpperCase();
        if (nc === '2' && nv === 'ENTITIES') {
          inEntities = true;
          i += 2;
        }
        continue;
      }
      if (code === '0' && val === 'ENDSEC') {
        inEntities = false;
        currentEntity = '';
        continue;
      }
      if (!inEntities) continue;

      if (code === '0') {
        currentEntity = val === 'TEXT' || val === 'MTEXT' ? val : '';
        currentLayer = '0';
      } else if (currentEntity) {
        if (code === '8') {
          currentLayer = val;
        } else if (code === '1' || code === '3') {
          const { out, hitCount } = translateStr(val);
          totalTermReplacements += hitCount;
          if (hitCount > 0) {
            outputLines[i + 1] = out;
          }
          items.push({
            entityType: currentEntity,
            layer: currentLayer,
            original: val,
            translated: out,
            changed: hitCount > 0,
          });
        }
      }
    }

    const translatedEntityCount = items.filter((it) => it.changed).length;

    return {
      valid: true as const,
      items,
      textCount: items.length,
      translatedEntityCount,
      totalTermReplacements,
      translatedDxf: outputLines.join('\n'),
    };
  }, [dxfSource, glossaryText]);

  const handleCopy = () => {
    if (!result.valid) return;
    navigator.clipboard
      .writeText(result.translatedDxf)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadDxf = () => {
    if (!result.valid) return;
    const blob = new Blob([toSafeAscii(result.translatedDxf) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated_drawing.dxf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const lines = [
      'EntityType,Layer,OriginalText,TranslatedText,Changed',
      ...result.items.map(
        (it) =>
          `${it.entityType},${toSafeAscii(it.layer)},"${toSafeAscii(it.original).replace(/"/g, '""')}","${toSafeAscii(it.translated).replace(/"/g, '""')}",${it.changed}`
      ),
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dxf_text_glossary_audit.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Browser-Local ASCII DXF Glossary Replacer:</span> Extracts `TEXT`/`MTEXT` group-code (`1`/`3`) strings, applies your deterministic glossary rules in memory (`0 bytes uploaded`), and exports the updated ASCII `.dxf` while keeping geometry coordinates untouched.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-black text-slate-900">ASCII DXF Input</h2>
              <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Load .dxf
                <input type="file" accept=".dxf,.txt" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <textarea
              data-testid="input-dxf"
              rows={9}
              value={dxfSource}
              onChange={(e) => setDxfSource(e.target.value)}
              spellCheck={false}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <label className="text-sm font-black text-slate-900 block">Glossary Table (SOURCE=TARGET per line)</label>
            <textarea
              data-testid="input-glossary"
              rows={6}
              value={glossaryText}
              onChange={(e) => setGlossaryText(e.target.value)}
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
              Reset Sample &amp; Glossary
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Extracted Text &amp; Replaced DXF</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy DXF'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  type="button"
                  data-testid="btn-download-dxf"
                  onClick={handleDownloadDxf}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .DXF
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Text Entities Parsed</div>
                    <div data-testid="out-text-count" className="text-2xl font-black text-slate-900 mt-1">
                      {result.textCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Modified Entities</div>
                    <div data-testid="out-modified-count" className="text-2xl font-black text-blue-900 mt-1">
                      {result.translatedEntityCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Term Replacements</div>
                    <div data-testid="out-hit-count" className="text-2xl font-black text-emerald-900 mt-1">
                      {result.totalTermReplacements}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <th className="py-2 pr-3">Type</th>
                        <th className="py-2 px-3">Original</th>
                        <th className="py-2 pl-3">Translated Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((it, idx) => (
                        <tr key={idx} className="border-b border-slate-100 text-xs font-semibold text-slate-800">
                          <td className="py-2 pr-3 font-mono">{it.entityType}</td>
                          <td className="py-2 px-3">{it.original}</td>
                          <td data-testid={`row-translated-${idx}`} className="py-2 pl-3 text-blue-700 font-bold">
                            {it.translated}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Operates strictly on DXF `TEXT` and `MTEXT` group code `1` and `3` strings while preserving `10/20/40` placement coordinates.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://en.wikipedia.org/wiki/AutoCAD_DXF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD DXF Format Specification <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-8E1786B0-D31D-4A61-8A84-78E7BE34867B.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 TEXTFILL Plotting Help <ExternalLink className="w-3 h-3" />
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
