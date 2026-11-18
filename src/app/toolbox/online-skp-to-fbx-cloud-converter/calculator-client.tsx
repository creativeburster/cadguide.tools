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
} from 'lucide-react';

interface VramPreset {
  id: string;
  label: string;
  triangles: string;
  vertices: string;
  texCount: string;
  texResPx: string;
  mipFactor: string;
}

const PRESETS: VramPreset[] = [
  {
    id: 'arch-interior',
    label: 'Preset 1: Architectural Interior (100k tris, 4x 1024px RGBA8 no mipmaps = 16 MB tex)',
    triangles: '100000',
    vertices: '100000',
    texCount: '4',
    texResPx: '1024',
    mipFactor: '1',
  },
  {
    id: 'heavy-fbx-mip',
    label: 'Preset 2: High-Res Render Export (1M tris, 8x 2048px, 1.3333 mip factor)',
    triangles: '1000000',
    vertices: '750000',
    texCount: '8',
    texResPx: '2048',
    mipFactor: '1.3333',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) ? n : NaN;
}

function computeFbxSceneBudget(
  trisStr: string,
  vertsStr: string,
  texCountStr: string,
  texResStr: string,
  mipStr: string
) {
  const tris = parseNonNegInt(trisStr);
  const verts = parseNonNegInt(vertsStr);
  const texCount = parseNonNegInt(texCountStr);
  const texRes = parsePositive(texResStr);
  const mip = parsePositive(mipStr);

  if (
    !Number.isFinite(tris) ||
    !Number.isFinite(verts) ||
    !Number.isFinite(texCount) ||
    !Number.isFinite(texRes) ||
    !Number.isFinite(mip) ||
    tris < 1
  ) {
    return {
      valid: false as const,
      error: 'Triangles >= 1; vertices & textures must be integers >= 0; resolution & mip multiplier > 0.',
    };
  }

  // Geometry buffer: 32 bytes/vertex (pos 12B + normal 12B + UV 8B) + 12 bytes/triangle (3 x uint32 indices)
  const geomBytes = verts * 32 + tris * 12;
  const texBytes = texCount * texRes * texRes * 4 * mip;
  const totalBytes = geomBytes + texBytes;

  const mb = 1024 * 1024;
  return {
    valid: true as const,
    geomMb: geomBytes / mb,
    texMb: texBytes / mb,
    totalMb: totalBytes / mb,
    geomBytes,
    texBytes,
    totalBytes,
  };
}

export default function OnlineSkpToFbxCloudConverterClient() {
  const [trisStr, setTrisStr] = useState('100000');
  const [vertsStr, setVertsStr] = useState('100000');
  const [texCountStr, setTexCountStr] = useState('4');
  const [texResStr, setTexResStr] = useState('1024');
  const [mipStr, setMipStr] = useState('1');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => computeFbxSceneBudget(trisStr, vertsStr, texCountStr, texResStr, mipStr),
    [trisStr, vertsStr, texCountStr, texResStr, mipStr]
  );

  const applyPreset = (p: VramPreset) => {
    setTrisStr(p.triangles);
    setVertsStr(p.vertices);
    setTexCountStr(p.texCount);
    setTexResStr(p.texResPx);
    setMipStr(p.mipFactor);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'FBX / Render Mesh GPU Memory Budget Summary',
      `Geometry Buffer (32B/vert + 12B/tri): ${evalRes.geomMb.toFixed(4)} MB (${evalRes.geomBytes} bytes)`,
      `Uncompressed RGBA8 Texture VRAM: ${evalRes.texMb.toFixed(4)} MB`,
      `Total Estimated GPU Memory: ${evalRes.totalMb.toFixed(4)} MB`,
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
      'Component,Bytes,Megabytes',
      `Geometry Vertex+Index Buffer,${evalRes.geomBytes},${evalRes.geomMb.toFixed(6)}`,
      `RGBA8 Texture Memory,${Math.round(evalRes.texBytes)},${evalRes.texMb.toFixed(6)}`,
      `Total Scene VRAM Budget,${Math.round(evalRes.totalBytes)},${evalRes.totalMb.toFixed(6)}`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skp_to_fbx_vram_budget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Scene Mesh &amp; Uncompressed RGBA8 VRAM Budget Calculator:</span> Sizes vertex/index buffers and uncompressed texture memory prior to SKP-to-FBX export (`32 B/vert + 12 B/tri` and `N_tex * W * H * 4 * k_mip`). Actual binary `.skp` to `.fbx` translation executes in desktop SketchUp Pro / FBX SDK tools.
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
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">Mesh &amp; Texture Parameters</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Triangle Count</label>
              <input type="text" inputMode="numeric" data-testid="input-tris" value={trisStr} onChange={(e) => setTrisStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Vertex Count</label>
              <input type="text" inputMode="numeric" data-testid="input-verts" value={vertsStr} onChange={(e) => setVertsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Texture Maps</label>
              <input type="text" inputMode="numeric" data-testid="input-tex-count" value={texCountStr} onChange={(e) => setTexCountStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Square Map Res (px)</label>
              <input type="text" inputMode="decimal" data-testid="input-tex-res" value={texResStr} onChange={(e) => setTexResStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Mipmap Multiplier (1.0 none / 1.3333 full chain)</label>
            <input type="text" inputMode="decimal" data-testid="input-mip" value={mipStr} onChange={(e) => setMipStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900">GPU &amp; Mesh Memory Footprint</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!evalRes.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!evalRes.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!evalRes.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{evalRes.error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-bold text-blue-600 uppercase">Geometry Buffer</div>
                  <div data-testid="out-geom-mb" className="text-2xl font-black text-blue-900 mt-1">
                    {evalRes.geomMb.toFixed(4)} MB
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-600 uppercase">RGBA8 Textures</div>
                  <div data-testid="out-tex-mb" className="text-2xl font-black text-emerald-900 mt-1">
                    {evalRes.texMb.toFixed(4)} MB
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase">Total VRAM Budget</div>
                  <div data-testid="out-total-mb" className="text-2xl font-black text-slate-900 mt-1">
                    {evalRes.totalMb.toFixed(4)} MB
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Uncompressed RGBA8 assumes 4 bytes per texel; standard vertex format assumes 12B XYZ + 12B Normal + 8B UV = 32B/vertex plus 12B per triangle index triplet.
                </span>
              </div>
              <a
                href="https://en.wikipedia.org/wiki/FBX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                Autodesk FBX Format Overview (Wikipedia) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
