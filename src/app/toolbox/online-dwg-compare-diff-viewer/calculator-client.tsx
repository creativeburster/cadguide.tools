'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  GitCompare,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_REV_A = `0
SECTION
2
TABLES
0
TABLE
2
LAYER
0
LAYER
2
A-WALL
0
LAYER
2
A-DOOR
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
A-WALL
0
LINE
8
A-WALL
0
CIRCLE
8
A-DOOR
0
TEXT
8
A-DOOR
0
ENDSEC
0
EOF`;

const SAMPLE_REV_B = `0
SECTION
2
TABLES
0
TABLE
2
LAYER
0
LAYER
2
A-WALL
0
LAYER
2
A-DOOR
0
LAYER
2
A-FURN
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
A-WALL
0
LINE
8
A-WALL
0
LINE
8
A-WALL
0
LWPOLYLINE
8
A-FURN
0
CIRCLE
8
A-DOOR
0
TEXT
8
A-DOOR
0
ENDSEC
0
EOF`;

interface DxfSummary {
  layers: Set<string>;
  entityCounts: Record<string, number>;
  totalEntities: number;
}

function parseAsciiDxfCounts(text: string): DxfSummary | null {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  if (!lines.some((l) => l.toUpperCase() === 'SECTION')) {
    return null;
  }
  const layers = new Set<string>();
  const entityCounts: Record<string, number> = {};
  let section: 'NONE' | 'TABLES' | 'ENTITIES' | 'OTHER' = 'NONE';
  let inLayerDef = false;

  for (let i = 0; i < lines.length - 1; i += 2) {
    const code = lines[i];
    const val = lines[i + 1];
    if (code === '0' && val === 'SECTION') {
      const nextCode = lines[i + 2];
      const nextVal = (lines[i + 3] || '').toUpperCase();
      if (nextCode === '2') {
        section = nextVal === 'TABLES' ? 'TABLES' : nextVal === 'ENTITIES' ? 'ENTITIES' : 'OTHER';
        i += 2;
      }
      continue;
    }
    if (code === '0' && val === 'ENDSEC') {
      section = 'NONE';
      inLayerDef = false;
      continue;
    }
    if (section === 'TABLES') {
      if (code === '0' && val === 'LAYER') {
        inLayerDef = true;
      } else if (code === '0') {
        inLayerDef = false;
      } else if (inLayerDef && code === '2' && val) {
        layers.add(val);
      }
    } else if (section === 'ENTITIES') {
      if (code === '0' && val && val !== 'SEQEND' && val !== 'VERTEX') {
        const key = val.toUpperCase();
        entityCounts[key] = (entityCounts[key] || 0) + 1;
      }
    }
  }

  const totalEntities = Object.values(entityCounts).reduce((a, b) => a + b, 0);
  return { layers, entityCounts, totalEntities };
}

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function OnlineDwgCompareDiffViewerClient() {
  const [revAText, setRevAText] = useState(SAMPLE_REV_A);
  const [revBText, setRevBText] = useState(SAMPLE_REV_B);
  const [copied, setCopied] = useState(false);

  const handleUpload = (side: 'A' | 'B') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.slice(0, 4 * 1024 * 1024).text();
    if (side === 'A') setRevAText(text);
    else setRevBText(text);
  };

  const resetDefaults = () => {
    setRevAText(SAMPLE_REV_A);
    setRevBText(SAMPLE_REV_B);
  };

  const diffResult = useMemo(() => {
    if (!revAText.trim() || !revBText.trim()) {
      return { valid: false as const, error: 'Both Revision A and Revision B ASCII DXF inputs must be populated.' };
    }
    const a = parseAsciiDxfCounts(revAText);
    const b = parseAsciiDxfCounts(revBText);
    if (!a || !b) {
      return {
        valid: false as const,
        error: 'Both inputs must contain valid ASCII DXF SECTION blocks (binary .dwg cannot be diffed directly in text mode).',
      };
    }

    const addedLayers = Array.from(b.layers).filter((l) => !a.layers.has(l)).sort();
    const removedLayers = Array.from(a.layers).filter((l) => !b.layers.has(l)).sort();

    const allEntityTypes = Array.from(
      new Set([...Object.keys(a.entityCounts), ...Object.keys(b.entityCounts)])
    ).sort();

    const rows = allEntityTypes.map((type) => {
      const countA = a.entityCounts[type] || 0;
      const countB = b.entityCounts[type] || 0;
      return { type, countA, countB, delta: countB - countA };
    });

    const netDelta = b.totalEntities - a.totalEntities;
    return {
      valid: true as const,
      layersA: a.layers.size,
      layersB: b.layers.size,
      addedLayers,
      removedLayers,
      totalA: a.totalEntities,
      totalB: b.totalEntities,
      netDelta,
      rows,
    };
  }, [revAText, revBText]);

  const handleCopy = () => {
    if (!diffResult.valid) return;
    const lines = [
      'Local ASCII DXF Revision Diff Summary',
      `Rev A Entities: ${diffResult.totalA} | Rev B Entities: ${diffResult.totalB} | Net Delta: ${diffResult.netDelta >= 0 ? '+' : ''}${diffResult.netDelta}`,
      `Added Layers: ${diffResult.addedLayers.join(', ') || 'None'}`,
      `Removed Layers: ${diffResult.removedLayers.join(', ') || 'None'}`,
      ...diffResult.rows.map((r) => `${r.type}: A=${r.countA}, B=${r.countB}, Delta=${r.delta >= 0 ? '+' : ''}${r.delta}`),
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
    if (!diffResult.valid) return;
    const lines = [
      'EntityType,RevA_Count,RevB_Count,Delta',
      ...diffResult.rows.map((r) => `${toSafeAscii(r.type)},${r.countA},${r.countB},${r.delta}`),
      `TOTAL,${diffResult.totalA},${diffResult.totalB},${diffResult.netDelta}`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dxf_revision_diff_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local ASCII DXF Revision Comparator Only:</span> Parses group-code `LAYER` tables and `ENTITIES` counts in your browser (`0 bytes uploaded`). For visual binary `.dwg` overlay comparison with revision clouds, run desktop AutoCAD `COMPARE`.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Revision A (ASCII DXF)</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Load Rev A .dxf
              <input type="file" accept=".dxf,.txt" onChange={handleUpload('A')} className="hidden" />
            </label>
          </div>
          <textarea
            data-testid="input-rev-a"
            rows={10}
            value={revAText}
            onChange={(e) => setRevAText(e.target.value)}
            spellCheck={false}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Revision B (ASCII DXF)</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Load Rev B .dxf
              <input type="file" accept=".dxf,.txt" onChange={handleUpload('B')} className="hidden" />
            </label>
          </div>
          <textarea
            data-testid="input-rev-b"
            rows={10}
            value={revBText}
            onChange={(e) => setRevBText(e.target.value)}
            spellCheck={false}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">Diff Summary</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Samples
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              disabled={!diffResult.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download-csv"
              onClick={handleDownloadCsv}
              disabled={!diffResult.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export Diff CSV
            </button>
          </div>
        </div>

        {!diffResult.valid ? (
          <div
            data-testid="validation-error"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{diffResult.error}</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase">Rev A Entities</div>
                <div data-testid="out-total-a" className="text-2xl font-black text-slate-900 mt-1">{diffResult.totalA}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-500 uppercase">Rev B Entities</div>
                <div data-testid="out-total-b" className="text-2xl font-black text-slate-900 mt-1">{diffResult.totalB}</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-600 uppercase">Net Entity Delta</div>
                <div data-testid="out-net-delta" className="text-2xl font-black text-blue-900 mt-1">
                  {diffResult.netDelta >= 0 ? `+${diffResult.netDelta}` : diffResult.netDelta}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-600 uppercase">Added Layers</div>
                <div data-testid="out-added-layers" className="text-sm font-black text-emerald-900 mt-2">
                  {diffResult.addedLayers.join(', ') || 'None'}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-4">DXF Entity Type</th>
                    <th className="py-2 px-4">Rev A Count</th>
                    <th className="py-2 px-4">Rev B Count</th>
                    <th className="py-2 pl-4">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {diffResult.rows.map((r) => (
                    <tr key={r.type} className="border-b border-slate-100 font-semibold text-slate-800">
                      <td className="py-2 pr-4 font-mono">{r.type}</td>
                      <td className="py-2 px-4">{r.countA}</td>
                      <td className="py-2 px-4">{r.countB}</td>
                      <td className="py-2 pl-4">{r.delta >= 0 ? `+${r.delta}` : r.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <span>
              Deterministic DXF group-code diffing counts `TABLES` layer symbols and `ENTITIES` section records locally without transmitting geometry files.
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-4B96F5FD-C9CF-4E2E-996E-E00914F8D99E.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              AutoCAD 2025 COMPARE Command Help <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://en.wikipedia.org/wiki/AutoCAD_DXF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              AutoCAD DXF Section Structure (Wikipedia) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
