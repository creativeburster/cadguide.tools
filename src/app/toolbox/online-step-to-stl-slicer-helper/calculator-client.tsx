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

interface StlSlicerPreset {
  id: string;
  label: string;
  radiusMm: string;
  chordTolMm: string;
  angleDeg: string;
  layerHeightMm: string;
  slopeDeg: string;
  triangles: string;
}

const PRESETS: StlSlicerPreset[] = [
  {
    id: 'fdm-standard',
    label: 'Preset 1: FDM Standard (R=20 mm, 0.02 mm chord, 15 deg, 0.20 mm layer, 45 deg slope)',
    radiusMm: '20',
    chordTolMm: '0.02',
    angleDeg: '15',
    layerHeightMm: '0.20',
    slopeDeg: '45',
    triangles: '20000',
  },
  {
    id: 'sla-fine',
    label: 'Preset 2: Fine SLA Mesh (R=20 mm, 0.005 mm chord, 10 deg, 0.05 mm layer, 30 deg slope)',
    radiusMm: '20',
    chordTolMm: '0.005',
    angleDeg: '10',
    layerHeightMm: '0.05',
    slopeDeg: '30',
    triangles: '80000',
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

function computeStlSlicerResolution(
  radiusStr: string,
  chordStr: string,
  angleStr: string,
  layerStr: string,
  slopeStr: string,
  trisStr: string
) {
  const R = parsePositive(radiusStr);
  const delta = parsePositive(chordStr);
  const angleDeg = parsePositive(angleStr);
  const hLayer = parsePositive(layerStr);
  const slopeDeg = parsePositive(slopeStr);
  const tris = parsePosInt(trisStr);

  if (
    !Number.isFinite(R) ||
    !Number.isFinite(delta) ||
    !Number.isFinite(angleDeg) ||
    !Number.isFinite(hLayer) ||
    !Number.isFinite(slopeDeg) ||
    !Number.isFinite(tris)
  ) {
    return {
      valid: false as const,
      error: 'All geometric parameters must be > 0 and triangle count must be an integer >= 1.',
    };
  }
  if (delta >= R) {
    return { valid: false as const, error: 'Chordal tolerance must be strictly less than cylinder radius (delta < R).' };
  }
  if (angleDeg > 120) {
    return { valid: false as const, error: 'Angular deflection limit must be <= 120 deg.' };
  }
  if (slopeDeg >= 90) {
    return { valid: false as const, error: 'Surface slope angle above horizontal must be < 90 deg.' };
  }

  const nChord = Math.ceil(Math.PI / Math.acos(Math.min(1, Math.max(-1, 1 - delta / R))));
  const nAngle = Math.ceil(360 / angleDeg);
  const nSegments = Math.max(3, nChord, nAngle);
  const cuspMm = hLayer * Math.cos((slopeDeg * Math.PI) / 180);
  const binaryStlBytes = 84 + 50 * tris;
  const binaryStlMb = binaryStlBytes / (1024 * 1024);

  return {
    valid: true as const,
    nChord,
    nAngle,
    nSegments,
    cuspMm,
    binaryStlBytes,
    binaryStlMb,
    tris,
  };
}

export default function OnlineStepToStlSlicerHelperClient() {
  const [radiusStr, setRadiusStr] = useState('20');
  const [chordStr, setChordStr] = useState('0.02');
  const [angleStr, setAngleStr] = useState('15');
  const [layerStr, setLayerStr] = useState('0.20');
  const [slopeStr, setSlopeStr] = useState('45');
  const [trisStr, setTrisStr] = useState('20000');
  const [fileNote, setFileNote] = useState('No local .step / .stl read (optional header & binary byte integrity check)');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => computeStlSlicerResolution(radiusStr, chordStr, angleStr, layerStr, slopeStr, trisStr),
    [radiusStr, chordStr, angleStr, layerStr, slopeStr, trisStr]
  );

  const applyPreset = (p: StlSlicerPreset) => {
    setRadiusStr(p.radiusMm);
    setChordStr(p.chordTolMm);
    setAngleStr(p.angleDeg);
    setLayerStr(p.layerHeightMm);
    setSlopeStr(p.slopeDeg);
    setTrisStr(p.triangles);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setFileNote('No local .step / .stl read (optional header & binary byte integrity check)');
  };

  const handleLocalFileInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const headBytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
    const textHead = new TextDecoder('utf-8', { fatal: false }).decode(headBytes);
    if (/ISO-10303-21/i.test(textHead)) {
      const m = textHead.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
      setFileNote(`${file.name}: Valid ISO-10303-21 STEP (${m ? m[1] : 'Schema found'}, 0 B uploaded)`);
      return;
    }
    if (file.size >= 84 && !/^solid\s/i.test(textHead.slice(0, 64))) {
      const view = new DataView(headBytes.buffer);
      const triCount = view.getUint32(80, true);
      const expected = 84 + 50 * triCount;
      setTrisStr(String(Math.max(1, triCount)));
      setFileNote(
        `${file.name}: Binary STL (${triCount} tris, size match ${expected === file.size ? 'EXACT' : `${expected} B vs ${file.size} B`}, 0 B uploaded)`
      );
      return;
    }
    setFileNote(`${file.name}: ${(file.size / 1024).toFixed(2)} KB ASCII/local CAD file (0 B uploaded)`);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'STEP to STL Slicer Resolution & Staircase Cusp Summary',
      `Required Circle Segments: ${evalRes.nSegments} (chord=${evalRes.nChord}, angle=${evalRes.nAngle})`,
      `Staircase Cusp Height (h * cos(alpha)): ${evalRes.cuspMm.toFixed(4)} mm`,
      `Binary STL Size (84 + 50*N_tri): ${evalRes.binaryStlBytes} bytes (${evalRes.binaryStlMb.toFixed(4)} MB)`,
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
      `Chordal Circle Segments,${evalRes.nChord},segments`,
      `Angular Circle Segments,${evalRes.nAngle},segments`,
      `Governing Circle Segments,${evalRes.nSegments},segments`,
      `Staircase Normal Cusp Error,${evalRes.cuspMm.toFixed(6)},mm`,
      `Binary STL Triangles,${evalRes.tris},triangles`,
      `Binary STL File Bytes,${evalRes.binaryStlBytes},bytes`,
      `Binary STL File MB,${evalRes.binaryStlMb.toFixed(6)},MB`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'step_to_stl_slicer_budget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">STEP / Binary STL Header Check &amp; Tessellation Resolution Helper:</span> Inspects local `ISO-10303-21` schemas or validates Binary STL `84 + 50 * N_tri` byte lengths locally (`0 bytes uploaded`), while computing governing chordal/angular circle segments and layer staircase cusp error.
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
              <h2 className="text-lg font-black text-slate-900">Meshing &amp; Layer Inputs</h2>
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
              <span>Optional Local .step / .stp / .stl Inspect</span>
              <input type="file" accept=".stp,.step,.stl" onChange={handleLocalFileInspect} className="sr-only" />
            </label>
            <div className="text-xs text-slate-600 font-medium break-all">{fileNote}</div>
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
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Max Angle Deflect (deg)</label>
              <input type="text" inputMode="decimal" data-testid="input-angle" value={angleStr} onChange={(e) => setAngleStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Layer Height h (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-layer" value={layerStr} onChange={(e) => setLayerStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Slope Angle (deg)</label>
              <input type="text" inputMode="decimal" data-testid="input-slope" value={slopeStr} onChange={(e) => setSlopeStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">STL Triangle Count</label>
              <input type="text" inputMode="numeric" data-testid="input-tris" value={trisStr} onChange={(e) => setTrisStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">Mesh Resolution &amp; STL File Size</h2>
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
                    {evalRes.nSegments}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-black text-emerald-600 uppercase">Staircase Cusp</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    <span data-testid="out-cusp">{evalRes.cuspMm.toFixed(4)}</span> mm
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase">Binary STL Size</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    <span data-testid="out-stl-mb">{evalRes.binaryStlMb.toFixed(4)}</span> MB
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    (<span data-testid="out-stl-bytes">{evalRes.binaryStlBytes}</span> B)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-black text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Open-Source Meshing &amp; Format References (External Links):</span>
                </div>
                <div className="flex flex-wrap gap-4 pt-1">
                  <a href="https://en.wikipedia.org/wiki/ISO_10303-21" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    ISO 10303-21 (STEP) <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://en.wikipedia.org/wiki/STL_(file_format)" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    STL File Format <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://www.freecad.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                    FreeCAD Offline Mesher <ExternalLink className="w-3 h-3" />
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
