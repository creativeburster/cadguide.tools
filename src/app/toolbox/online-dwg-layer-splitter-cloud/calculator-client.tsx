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
  Layers,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const SAMPLE_MULTI_LAYER_DXF = `0
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
0
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
E-LIGHT
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
CIRCLE
8
A-DOOR
0
INSERT
8
E-LIGHT
0
INSERT
8
E-LIGHT
0
ENDSEC
0
EOF`;

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function OnlineDwgLayerSplitterCloudClient() {
  const [dxfSource, setDxfSource] = useState(SAMPLE_MULTI_LAYER_DXF);
  const [outputPrefix, setOutputPrefix] = useState('SPLIT_');
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.slice(0, 4 * 1024 * 1024).text();
    setDxfSource(text);
  };

  const resetDefaults = () => {
    setDxfSource(SAMPLE_MULTI_LAYER_DXF);
    setOutputPrefix('SPLIT_');
  };

  const analysis = useMemo(() => {
    const lines = dxfSource.split(/\r?\n/).map((l) => l.trim());
    if (!dxfSource.trim() || !lines.some((l) => l.toUpperCase() === 'SECTION')) {
      return {
        valid: false as const,
        error: 'Provide a valid ASCII DXF snippet containing SECTION/ENTITIES blocks.',
      };
    }

    const declaredLayers = new Set<string>();
    const countsByLayer: Record<string, number> = {};
    let section: 'NONE' | 'TABLES' | 'ENTITIES' | 'OTHER' = 'NONE';
    let inLayerDef = false;
    let inEntity = false;
    let currentLayer = '0';

    for (let i = 0; i < lines.length - 1; i += 2) {
      const code = lines[i];
      const val = lines[i + 1];
      if (code === '0' && val === 'SECTION') {
        const nc = lines[i + 2];
        const nv = (lines[i + 3] || '').toUpperCase();
        if (nc === '2') {
          section = nv === 'TABLES' ? 'TABLES' : nv === 'ENTITIES' ? 'ENTITIES' : 'OTHER';
          i += 2;
        }
        continue;
      }
      if (code === '0' && val === 'ENDSEC') {
        if (section === 'ENTITIES' && inEntity) {
          countsByLayer[currentLayer] = (countsByLayer[currentLayer] || 0) + 1;
        }
        section = 'NONE';
        inLayerDef = false;
        inEntity = false;
        continue;
      }
      if (section === 'TABLES') {
        if (code === '0' && val === 'LAYER') {
          inLayerDef = true;
        } else if (code === '0') {
          inLayerDef = false;
        } else if (inLayerDef && code === '2' && val) {
          declaredLayers.add(val);
        }
      } else if (section === 'ENTITIES') {
        if (code === '0') {
          if (inEntity) {
            countsByLayer[currentLayer] = (countsByLayer[currentLayer] || 0) + 1;
          }
          if (val && val !== 'SEQEND' && val !== 'VERTEX') {
            inEntity = true;
            currentLayer = '0';
          } else {
            inEntity = false;
          }
        } else if (inEntity && code === '8' && val) {
          currentLayer = val;
        }
      }
    }

    const allLayers = Array.from(new Set([...declaredLayers, ...Object.keys(countsByLayer)])).sort();
    const rows = allLayers.map((layer) => ({
      layer,
      entities: countsByLayer[layer] || 0,
    }));
    const activeLayers = rows.filter((r) => r.entities > 0).map((r) => r.layer);
    const totalEntities = rows.reduce((sum, r) => sum + r.entities, 0);

    const safePrefix = toSafeAscii(outputPrefix).replace(/[^A-Za-z0-9_-]/g, '') || 'SPLIT_';
    const scriptLines = [
      '; Pure-ASCII AutoCAD -LAYER / -WBLOCK Layer Isolation Script',
      'CMDECHO 0',
      ...activeLayers.flatMap((lay) => {
        const cleanLay = toSafeAscii(lay).replace(/"/g, '');
        return [
          `-LAYER T * ON * S "${cleanLay}" F * T "${cleanLay}" `,
          `-WBLOCK "${safePrefix}${cleanLay}.dwg" "" 0,0 ALL `,
        ];
      }),
      '-LAYER T * ON * ',
      'CMDECHO 1',
    ];

    return {
      valid: true as const,
      rows,
      totalLayers: rows.length,
      activeLayerCount: activeLayers.length,
      totalEntities,
      scriptText: scriptLines.join('\n'),
    };
  }, [dxfSource, outputPrefix]);

  const handleCopy = () => {
    if (!analysis.valid) return;
    navigator.clipboard
      .writeText(analysis.scriptText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadScr = () => {
    if (!analysis.valid) return;
    const blob = new Blob([toSafeAscii(analysis.scriptText) + '\r\n'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layer_split_wblock.scr';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local DXF Layer Parser &amp; WBLOCK Script Builder:</span> Counts entities per DXF layer locally in your browser (`0 bytes uploaded`) and builds a pure-ASCII AutoCAD `-LAYER` + `-WBLOCK` script. Binary `.dwg` geometry splitting runs locally in AutoCAD when executing the exported `.scr`.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">ASCII DXF Input</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Load .dxf
              <input type="file" accept=".dxf,.txt" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Output Filename Prefix (ASCII)</label>
            <input
              type="text"
              data-testid="input-prefix"
              value={outputPrefix}
              onChange={(e) => setOutputPrefix(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <textarea
            data-testid="input-dxf"
            rows={12}
            value={dxfSource}
            onChange={(e) => setDxfSource(e.target.value)}
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
            Reset to Sample DXF
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Layer Inventory &amp; Split Script</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!analysis.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-scr"
                  onClick={handleDownloadScr}
                  disabled={!analysis.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .SCR
                </button>
              </div>
            </div>

            {!analysis.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{analysis.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Total Layers</div>
                    <div data-testid="out-total-layers" className="text-2xl font-black text-blue-900 mt-1">
                      {analysis.totalLayers}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Populated Layers</div>
                    <div data-testid="out-active-layers" className="text-2xl font-black text-emerald-900 mt-1">
                      {analysis.activeLayerCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Total Entities</div>
                    <div data-testid="out-total-entities" className="text-2xl font-black text-slate-900 mt-1">
                      {analysis.totalEntities}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <th className="py-2 pr-4">Layer Name</th>
                        <th className="py-2 pl-4">Entity Count (Group Code 8)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.rows.map((r) => (
                        <tr key={r.layer} className="border-b border-slate-100 font-semibold text-slate-800">
                          <td className="py-2 pr-4 font-mono">{r.layer}</td>
                          <td className="py-2 pl-4">{r.entities}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <pre
                  data-testid="out-script"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto"
                >
                  {analysis.scriptText}
                </pre>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  `-LAYER` isolates each populated layer by freezing others, while `-WBLOCK` writes a clean individual DWG file anchored at `0,0`.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-F26FC1CE-45C9-4C85-9DB9-19B6A597D87B.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 -WBLOCK Command Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-2C75A883-10CA-4B6C-96AC-BCD7A7794614.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  AutoCAD 2025 -LAYER Command Help <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-E7599129-7F84-4BF0-8D67-86C5DF1EC97C.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  CMDECHO System Variable <ExternalLink className="w-3 h-3" />
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
