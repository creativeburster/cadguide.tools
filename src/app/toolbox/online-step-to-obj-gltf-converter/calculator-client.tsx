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

interface TessellationPreset {
  id: string;
  label: string;
  radiusMm: string;
  chordTolMm: string;
  triangles: string;
  vertices: string;
}

const PRESETS: TessellationPreset[] = [
  {
    id: 'balanced-render',
    label: 'Preset 1: R=25 mm Cylinder, 0.05 mm Chordal Tol (50 segs/circle)',
    radiusMm: '25',
    chordTolMm: '0.05',
    triangles: '50000',
    vertices: '35000',
  },
  {
    id: 'fine-precision',
    label: 'Preset 2: R=25 mm High-Precision Smooth Arc, 0.005 mm Tol (158 segs)',
    radiusMm: '25',
    chordTolMm: '0.005',
    triangles: '200000',
    vertices: '120000',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function evaluateStepObjGltf(radiusStr: string, chordStr: string, trisStr: string, vertsStr: string) {
  const R = parsePositive(radiusStr);
  const delta = parsePositive(chordStr);
  const tris = parsePosInt(trisStr);
  const verts = parsePosInt(vertsStr);

  if (!Number.isFinite(R) || !Number.isFinite(delta) || !Number.isFinite(tris) || !Number.isFinite(verts)) {
    return {
      valid: false as const,
      error: 'Radius and chordal tolerance must be > 0 mm; triangle and vertex counts must be integers >= 1.',
    };
  }
  if (delta >= R) {
    return {
      valid: false as const,
      error: 'Chordal tolerance must be strictly less than cylinder radius (delta < R).',
    };
  }

  const ratio = 1 - delta / R;
  const halfAngleRad = Math.acos(Math.min(1, Math.max(-1, ratio)));
  const rawSegments = Math.PI / halfAngleRad;
  const circleSegments = Math.max(3, Math.ceil(rawSegments));
  const actualChordErrMm = R * (1 - Math.cos(Math.PI / circleSegments));
  // Binary glTF 2.0 unindexed/indexed buffer estimate: 32 bytes/vertex (vec3 pos + vec3 norm + vec2 uv) + 12 bytes/triangle (uint32 x 3)
  const gltfBinBytes = verts * 32 + tris * 12;
  const gltfBinMb = gltfBinBytes / (1024 * 1024);

  return {
    valid: true as const,
    R,
    delta,
    circleSegments,
    actualChordErrMm,
    gltfBinBytes,
    gltfBinMb,
    tris,
    verts,
  };
}

export default function OnlineStepToObjGltfConverterClient() {
  const [radiusStr, setRadiusStr] = useState('25');
  const [chordStr, setChordStr] = useState('0.05');
  const [trisStr, setTrisStr] = useState('50000');
  const [vertsStr, setVertsStr] = useState('35000');
  const [localPreflight, setLocalPreflight] = useState('No local .step / .gltf / .glb read (optional local container check)');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluateStepObjGltf(radiusStr, chordStr, trisStr, vertsStr),
    [radiusStr, chordStr, trisStr, vertsStr]
  );

  const applyPreset = (p: TessellationPreset) => {
    setRadiusStr(p.radiusMm);
    setChordStr(p.chordTolMm);
    setTrisStr(p.triangles);
    setVertsStr(p.vertices);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setLocalPreflight('No local .step / .gltf / .glb read (optional local container check)');
  };

  const handleLocalFileInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const headBytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
    const textHead = new TextDecoder('utf-8', { fatal: false }).decode(headBytes);
    if (
      headBytes.length >= 4 &&
      headBytes[0] === 0x67 &&
      headBytes[1] === 0x6c &&
      headBytes[2] === 0x54 &&
      headBytes[3] === 0x46
    ) {
      const view = new DataView(headBytes.buffer);
      const gltfVer = headBytes.length >= 8 ? view.getUint32(4, true) : 2;
      setLocalPreflight(`${file.name}: Binary glTF container (glTF magic, v${gltfVer}, ${file.size} B, 0 uploaded)`);
      return;
    }
    const isStep = /ISO-10303-21/i.test(textHead);
    const schemaMatch = textHead.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
    if (isStep) {
      setLocalPreflight(
        `${file.name}: Valid ISO-10303-21 STEP (${schemaMatch ? schemaMatch[1] : 'Schema present'}, 0 B uploaded)`
      );
      return;
    }
    setLocalPreflight(`${file.name}: ${(file.size / 1024).toFixed(2)} KB local file inspected (0 B uploaded)`);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'STEP to OBJ / glTF Chordal Tessellation & Buffer Summary',
      `Cylinder Radius: ${evalRes.R} mm | Target Chordal Tol: ${evalRes.delta} mm`,
      `Minimum Circle Segments: ${evalRes.circleSegments} (Actual Chord Error: ${evalRes.actualChordErrMm.toFixed(6)} mm)`,
      `Binary Buffer Size (32B/vert + 12B/tri): ${evalRes.gltfBinBytes} bytes (${evalRes.gltfBinMb.toFixed(4)} MB)`,
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
    if (!evalRes.valid) return;
    const lines = [
      'Metric,Value,Unit',
      `Cylinder Radius,${evalRes.R},mm`,
      `Target Chordal Deviation,${evalRes.delta},mm`,
      `Required Circle Segments,${evalRes.circleSegments},segments`,
      `Actual Chordal Deviation,${evalRes.actualChordErrMm.toFixed(6)},mm`,
      `Target Triangles,${evalRes.tris},triangles`,
      `Target Vertices,${evalRes.verts},vertices`,
      `Binary glTF Buffer Bytes,${evalRes.gltfBinBytes},bytes`,
      `Binary glTF Buffer MB,${evalRes.gltfBinMb.toFixed(6)},MB`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'step_to_gltf_tessellation_budget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local STEP/glTF Header Check &amp; Chordal Tessellation Calculator:</span> Reads local `ISO-10303-21` STEP `FILE_SCHEMA` tags or Binary `glTF` headers via browser `File API` (`0 bytes uploaded`) and calculates exact circular tessellation segments (`ceil(pi / arccos(1 - delta / R))`) and glTF 2.0 binary buffer size.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Tessellation &amp; Mesh Budget</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Optional Local .step / .stp / .gltf / .glb Inspect</span>
              <input type="file" accept=".stp,.step,.gltf,.glb,.obj" onChange={handleLocalFileInspect} className="sr-only" />
            </label>
            <div data-testid="local-preflight" className="text-xs text-slate-600 font-medium break-all">
              {localPreflight}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Radius R (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-radius" value={radiusStr} onChange={(e) => setRadiusStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Chordal Tol delta (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-chord" value={chordStr} onChange={(e) => setChordStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Target Triangles</label>
              <input type="text" inputMode="numeric" data-testid="input-tris" value={trisStr} onChange={(e) => setTrisStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Target Vertices</label>
              <input type="text" inputMode="numeric" data-testid="input-verts" value={vertsStr} onChange={(e) => setVertsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">Tessellation &amp; glTF Buffer Outputs</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!evalRes.valid}
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Summary'}
              </button>
              <button
                type="button"
                data-testid="btn-download-csv"
                disabled={!evalRes.valid}
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
            </div>
          </div>

          {!evalRes.valid ? (
            <div data-testid="validation-error" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{evalRes.error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-black text-blue-600 uppercase">Circle Segments</div>
                  <div data-testid="out-segments" className="text-2xl font-black text-blue-900 mt-1">
                    {evalRes.circleSegments}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-600 uppercase">Actual Chord Error</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    <span data-testid="out-actual-err">{evalRes.actualChordErrMm.toFixed(6)}</span> mm
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase">glTF Binary Buffer</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    <span data-testid="out-gltf-mb">{evalRes.gltfBinMb.toFixed(4)}</span> MB
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    (<span data-testid="out-gltf-bytes">{evalRes.gltfBinBytes}</span> B)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-black text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Desktop Tessellation &amp; Format References (External Links):</span>
                </div>
                <div className="flex flex-wrap gap-4 pt-1">
                  <a href="https://en.wikipedia.org/wiki/ISO_10303-21" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    ISO 10303-21 (STEP) <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    Khronos glTF 2.0 Spec <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    Wavefront OBJ Format <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://www.opencascade.com/products/cad-assistant/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    Open CASCADE CAD Assistant <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
