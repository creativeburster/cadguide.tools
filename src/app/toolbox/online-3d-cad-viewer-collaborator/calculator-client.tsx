'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Box,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

type FormatKind = 'step' | 'stl_ascii' | 'stl_binary' | 'obj' | 'unknown';

interface CadSamplePreset {
  id: string;
  label: string;
  fileName: string;
  content: string;
}

const SAMPLE_STEP = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Sample AP214 bracket assembly'),'2;1');
FILE_NAME('bracket_sample.stp','2026-11-18T00:00:00',('CAD Engineer'),('CADGuide'),'','','');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));
ENDSEC;
DATA;
#1=APPLICATION_CONTEXT('core data for automotive mechanical design processes');
#2=PRODUCT('BRACKET','BRACKET','',(#1));
#3=CARTESIAN_POINT('',(0.0,0.0,0.0));
#4=CARTESIAN_POINT('',(50.0,0.0,0.0));
#5=CARTESIAN_POINT('',(50.0,25.0,10.0));
#6=VERTEX_POINT('',#3);
#7=MANIFOLD_SOLID_BREP('Body1',#8);
#8=CLOSED_SHELL('',());
ENDSEC;
END-ISO-10303-21;`;

const SAMPLE_STL_ASCII = `solid cadguide_wedge
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 20 0 0
      vertex 20 10 0
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 5
      vertex 20 0 5
      vertex 20 10 5
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex 0 0 0
      vertex 20 0 0
      vertex 20 0 5
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 20 0 0
      vertex 20 10 0
      vertex 20 10 5
    endloop
  endfacet
endsolid cadguide_wedge`;

const SAMPLE_OBJ = `# Wavefront OBJ Pyramid Sample
o pyramid_sample
v 0 0 0
v 10 0 0
v 10 10 0
v 0 10 0
v 5 5 8
f 1 2 3
f 1 3 4
f 1 2 5
f 2 3 5
f 3 4 5
f 4 1 5`;

const PRESETS: CadSamplePreset[] = [
  { id: 'step-ap214', label: 'Preset 1: STEP AP214 Header + 8 Entities', fileName: 'bracket_sample.stp', content: SAMPLE_STEP },
  { id: 'stl-wedge', label: 'Preset 2: ASCII STL Wedge (4 facets, 20x10x5)', fileName: 'wedge_sample.stl', content: SAMPLE_STL_ASCII },
  { id: 'obj-pyramid', label: 'Preset 3: Wavefront OBJ Pyramid (5 v, 6 f, 10x10x8)', fileName: 'pyramid_sample.obj', content: SAMPLE_OBJ },
];

interface BinaryStlSummary {
  fileName: string;
  byteSize: number;
  headerText: string;
  triangleCount: number;
  expectedByteSize: number;
  bboxSpan: [number, number, number] | null;
}

interface ParsedCadResult {
  valid: boolean;
  error?: string;
  format: FormatKind;
  formatLabel: string;
  fileName: string;
  byteSize: number;
  schemaOrHeader: string;
  primaryCountLabel: string;
  primaryCount: number;
  secondaryCountLabel: string;
  secondaryCount: number;
  spanX: number | null;
  spanY: number | null;
  spanZ: number | null;
}

function fmt(n: number | null, decimals = 4): string {
  if (n === null || !Number.isFinite(n)) return '—';
  return n.toFixed(decimals);
}

export default function Online3dCadViewerCollaboratorClient() {
  const [sourceText, setSourceText] = useState(SAMPLE_STEP);
  const [fileName, setFileName] = useState('bracket_sample.stp');
  const [binarySummary, setBinarySummary] = useState<BinaryStlSummary | null>(null);
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: CadSamplePreset) => {
    setBinarySummary(null);
    setFileName(p.fileName);
    setSourceText(p.content);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const headSlice = await file.slice(0, 512).arrayBuffer();
    const headBytes = new Uint8Array(headSlice);
    const headAscii = Array.from(headBytes)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ' '))
      .join('');

    const isStlExt = file.name.toLowerCase().endsWith('.stl');
    const startsWithSolid = /^\s*solid\b/i.test(headAscii);
    const hasFacetKeyword = /facet\s+normal/i.test(headAscii);

    if (isStlExt && !(startsWithSolid && hasFacetKeyword) && file.size >= 84) {
      const headerView = new DataView(await file.slice(0, 84).arrayBuffer());
      const triCount = headerView.getUint32(80, true);
      const headerText = Array.from(new Uint8Array(headerView.buffer, 0, 80))
        .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : ' '))
        .join('')
        .trim();

      let bboxSpan: [number, number, number] | null = null;
      const expectedBytes = 84 + triCount * 50;
      if (file.size <= 10 * 1024 * 1024 && expectedBytes <= file.size) {
        const fullBuf = await file.slice(84, expectedBytes).arrayBuffer();
        const dv = new DataView(fullBuf);
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        for (let t = 0; t < triCount; t++) {
          const base = t * 50;
          for (let v = 0; v < 3; v++) {
            const off = base + 12 + v * 12;
            const x = dv.getFloat32(off, true);
            const y = dv.getFloat32(off + 4, true);
            const z = dv.getFloat32(off + 8, true);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
          }
        }
        if (triCount > 0 && Number.isFinite(minX)) {
          bboxSpan = [maxX - minX, maxY - minY, maxZ - minZ];
        }
      }

      setBinarySummary({
        fileName: file.name,
        byteSize: file.size,
        headerText: headerText || '(binary header)',
        triangleCount: triCount,
        expectedByteSize: expectedBytes,
        bboxSpan,
      });
      return;
    }

    setBinarySummary(null);
    const maxRead = Math.min(file.size, 4 * 1024 * 1024);
    const txt = await file.slice(0, maxRead).text();
    setSourceText(txt);
  };

  const parsed: ParsedCadResult = useMemo(() => {
    if (binarySummary) {
      return {
        valid: true,
        format: 'stl_binary',
        formatLabel: 'Binary STL',
        fileName: binarySummary.fileName,
        byteSize: binarySummary.byteSize,
        schemaOrHeader: `${binarySummary.headerText} (expected ${binarySummary.expectedByteSize} B)`,
        primaryCountLabel: 'Triangles',
        primaryCount: binarySummary.triangleCount,
        secondaryCountLabel: 'Expected Bytes',
        secondaryCount: binarySummary.expectedByteSize,
        spanX: binarySummary.bboxSpan ? binarySummary.bboxSpan[0] : null,
        spanY: binarySummary.bboxSpan ? binarySummary.bboxSpan[1] : null,
        spanZ: binarySummary.bboxSpan ? binarySummary.bboxSpan[2] : null,
      };
    }

    const trimmed = sourceText.trim();
    if (!trimmed) {
      return {
        valid: false,
        error: 'Paste STEP, ASCII STL, or Wavefront OBJ text, select a preset, or inspect a local CAD file.',
        format: 'unknown',
        formatLabel: 'Empty',
        fileName,
        byteSize: 0,
        schemaOrHeader: '—',
        primaryCountLabel: 'Items',
        primaryCount: 0,
        secondaryCountLabel: 'Secondary',
        secondaryCount: 0,
        spanX: null,
        spanY: null,
        spanZ: null,
      };
    }

    const byteSize = new TextEncoder().encode(sourceText).length;

    if (/ISO-10303-21\s*;/i.test(trimmed)) {
      const schemaMatch = trimmed.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
      const schema = schemaMatch ? schemaMatch[1] : 'Not declared';
      const entityMatches = trimmed.match(/^\s*#\d+\s*=/gm);
      const solidMatches = trimmed.match(/\b(MANIFOLD_SOLID_BREP|BREP_WITH_VOIDS|SHELL_BASED_SURFACE_MODEL|GEOMETRIC_SET)\b/gi);
      return {
        valid: true,
        format: 'step',
        formatLabel: 'STEP Part 21 (ISO-10303-21)',
        fileName,
        byteSize,
        schemaOrHeader: schema,
        primaryCountLabel: 'STEP Entities (#id)',
        primaryCount: entityMatches ? entityMatches.length : 0,
        secondaryCountLabel: 'Solid / Shell Nodes',
        secondaryCount: solidMatches ? solidMatches.length : 0,
        spanX: null,
        spanY: null,
        spanZ: null,
      };
    }

    if (/^\s*solid\b/i.test(trimmed) && /\bfacet\s+normal\b/i.test(trimmed)) {
      const solidMatch = trimmed.match(/^\s*solid\s*([^\r\n]*)/i);
      const solidName = solidMatch && solidMatch[1].trim() ? solidMatch[1].trim() : '(unnamed solid)';
      const facetCount = (trimmed.match(/\bfacet\s+normal\b/gi) || []).length;
      const vertexRegex = /^\s*vertex\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)/gm;
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      let vCount = 0;
      let m: RegExpExecArray | null;
      while ((m = vertexRegex.exec(trimmed)) !== null) {
        const x = Number(m[1]);
        const y = Number(m[2]);
        const z = Number(m[3]);
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
          vCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }
      }
      return {
        valid: true,
        format: 'stl_ascii',
        formatLabel: 'ASCII STL',
        fileName,
        byteSize,
        schemaOrHeader: solidName,
        primaryCountLabel: 'Facets',
        primaryCount: facetCount,
        secondaryCountLabel: 'Vertices Parsed',
        secondaryCount: vCount,
        spanX: vCount > 0 ? maxX - minX : null,
        spanY: vCount > 0 ? maxY - minY : null,
        spanZ: vCount > 0 ? maxZ - minZ : null,
      };
    }

    if (/^\s*(v|vt|vn|f|o|g|#)\s/m.test(trimmed) && /^\s*v\s+[+-]?\d/m.test(trimmed)) {
      const vRegex = /^\s*v\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s+([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)/gm;
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      let vCount = 0;
      let m: RegExpExecArray | null;
      while ((m = vRegex.exec(trimmed)) !== null) {
        const x = Number(m[1]);
        const y = Number(m[2]);
        const z = Number(m[3]);
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
          vCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }
      }
      const fCount = (trimmed.match(/^\s*f\s+/gm) || []).length;
      const objMatch = trimmed.match(/^\s*(?:o|g)\s+([^\r\n]+)/m);
      return {
        valid: true,
        format: 'obj',
        formatLabel: 'Wavefront OBJ',
        fileName,
        byteSize,
        schemaOrHeader: objMatch ? objMatch[1].trim() : 'OBJ Geometry',
        primaryCountLabel: 'Vertices (v)',
        primaryCount: vCount,
        secondaryCountLabel: 'Faces (f)',
        secondaryCount: fCount,
        spanX: vCount > 0 ? maxX - minX : null,
        spanY: vCount > 0 ? maxY - minY : null,
        spanZ: vCount > 0 ? maxZ - minZ : null,
      };
    }

    return {
      valid: false,
      error: 'Unrecognized text format. Supported local inspection formats: STEP (.stp/.step ISO-10303-21), ASCII/Binary STL (.stl), and Wavefront OBJ (.obj).',
      format: 'unknown',
      formatLabel: 'Unknown',
      fileName,
      byteSize,
      schemaOrHeader: '—',
      primaryCountLabel: 'Items',
      primaryCount: 0,
      secondaryCountLabel: 'Secondary',
      secondaryCount: 0,
      spanX: null,
      spanY: null,
      spanZ: null,
    };
  }, [sourceText, fileName, binarySummary]);

  const handleCopy = () => {
    if (!parsed.valid) return;
    const text = [
      'Local 3D CAD Inspection Summary (Client-Side Only)',
      `File: ${parsed.fileName} (${parsed.byteSize} bytes)`,
      `Format: ${parsed.formatLabel}`,
      `Header / Schema: ${parsed.schemaOrHeader}`,
      `${parsed.primaryCountLabel}: ${parsed.primaryCount}`,
      `${parsed.secondaryCountLabel}: ${parsed.secondaryCount}`,
      `Bounding Span X / Y / Z: ${fmt(parsed.spanX)} / ${fmt(parsed.spanY)} / ${fmt(parsed.spanZ)}`,
    ].join('\n');

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!parsed.valid) return;
    const toAscii = (s: string) => s.replace(/[^\x20-\x7E\r\n\t]/g, '');
    const fmtCsvSpan = (v: number | null) => (v !== null && Number.isFinite(v) ? v.toFixed(4) : 'N/A');
    const lines = [
      'Field,Value',
      `File Name,${toAscii(parsed.fileName).replace(/,/g, '_')}`,
      `Byte Size,${parsed.byteSize}`,
      `Detected Format,${toAscii(parsed.formatLabel)}`,
      `Header or Schema,${toAscii(parsed.schemaOrHeader).replace(/,/g, ';')}`,
      `${toAscii(parsed.primaryCountLabel)},${parsed.primaryCount}`,
      `${toAscii(parsed.secondaryCountLabel)},${parsed.secondaryCount}`,
      `Bounding Span X,${fmtCsvSpan(parsed.spanX)}`,
      `Bounding Span Y,${fmtCsvSpan(parsed.spanY)}`,
      `Bounding Span Z,${fmtCsvSpan(parsed.spanZ)}`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'local_3d_cad_inspection.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Browser-Local File Header &amp; Mesh Preflight Only:</span> All parsing of STEP (`ISO-10303-21`), STL, and Wavefront OBJ data runs locally inside your browser (`0 bytes uploaded`). This utility does not upload proprietary assemblies to third-party servers or host remote collaborative sessions.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Local 3D File or ASCII Source</h2>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Inspect Local File
              <input
                type="file"
                accept=".stp,.step,.stl,.obj"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            data-testid="input-cad-source"
            rows={12}
            value={sourceText}
            onChange={(e) => {
              setBinarySummary(null);
              setFileName('pasted_cad_snippet.txt');
              setSourceText(e.target.value);
            }}
            spellCheck={false}
            placeholder="Paste ISO-10303-21 STEP, ASCII STL, or Wavefront OBJ text..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to STEP Sample
          </button>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900">Inspection Results</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!parsed.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!parsed.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!parsed.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{parsed.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-wider">Detected Format</div>
                  <div data-testid="out-format" className="text-xl font-black text-blue-900 mt-1">
                    {parsed.formatLabel}
                  </div>
                  <div className="text-xs text-blue-700 mt-1 break-all">
                    Header / Schema: <span data-testid="out-schema" className="font-mono font-bold">{parsed.schemaOrHeader}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">{parsed.primaryCountLabel}</div>
                    <div data-testid="out-primary-count" className="text-2xl font-black text-slate-900 mt-1">
                      {parsed.primaryCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">{parsed.secondaryCountLabel}</div>
                    <div data-testid="out-secondary-count" className="text-2xl font-black text-slate-900 mt-1">
                      {parsed.secondaryCount}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Mesh Bounding Box Span (Model Units)</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-xl p-2 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400">Delta X</div>
                      <div data-testid="out-span-x" className="text-base font-black text-slate-800">{fmt(parsed.spanX)}</div>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400">Delta Y</div>
                      <div data-testid="out-span-y" className="text-base font-black text-slate-800">{fmt(parsed.spanY)}</div>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400">Delta Z</div>
                      <div data-testid="out-span-z" className="text-base font-black text-slate-800">{fmt(parsed.spanZ)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Neutral exchange specifications allow inspecting schemas and mesh bounds prior to review: STEP Part 21 uses the `ISO-10303-21` header and `FILE_SCHEMA`, ASCII STL uses `facet normal`/`vertex`, and Wavefront OBJ stores `v` vertices and `f` polygon faces.
                </span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <a
                  href="https://en.wikipedia.org/wiki/ISO_10303-21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  STEP ISO-10303-21 <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/STL_(file_format)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  STL Format Spec <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Wavefront_.obj_file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Wavefront OBJ Format <ExternalLink className="w-3 h-3" />
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
