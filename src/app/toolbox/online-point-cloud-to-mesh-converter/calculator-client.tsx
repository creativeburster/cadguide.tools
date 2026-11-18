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
} from 'lucide-react';

interface MeshBudgetPreset {
  id: string;
  label: string;
  spanX: string;
  spanY: string;
  spanZ: string;
  rawPoints: string;
  voxelM: string;
  triPerSurfaceVoxel: string;
}

const PRESETS: MeshBudgetPreset[] = [
  {
    id: 'building-facade',
    label: 'Preset 1: Scan Volume 20x10x5 m (1,000,000 pts, 0.05 m voxel, 2 tri/surface voxel)',
    spanX: '20',
    spanY: '10',
    spanZ: '5',
    rawPoints: '1000000',
    voxelM: '0.05',
    triPerSurfaceVoxel: '2',
  },
  {
    id: 'small-bracket',
    label: 'Preset 2: Metrology Scan 1x1x1 m (500,000 pts, 0.1 m voxel, 2 tri/voxel)',
    spanX: '1',
    spanY: '1',
    spanZ: '1',
    rawPoints: '500000',
    voxelM: '0.1',
    triPerSurfaceVoxel: '2',
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

function computeMeshBudget(
  spanXStr: string,
  spanYStr: string,
  spanZStr: string,
  rawPointsStr: string,
  voxelMStr: string,
  triFactorStr: string
) {
  const dx = parsePositive(spanXStr);
  const dy = parsePositive(spanYStr);
  const dz = parsePositive(spanZStr);
  const pts = parsePosInt(rawPointsStr);
  const voxel = parsePositive(voxelMStr);
  const kTri = parsePositive(triFactorStr);

  if (!Number.isFinite(dx) || !Number.isFinite(dy) || !Number.isFinite(dz) || !Number.isFinite(pts) || !Number.isFinite(voxel) || !Number.isFinite(kTri)) {
    return {
      valid: false as const,
      error: 'Bounding spans, voxel size, and triangles per surface voxel must be > 0; point count must be an integer >= 1.',
    };
  }

  const bboxVolumeM3 = dx * dy * dz;
  const pointDensityPerM3 = pts / bboxVolumeM3;
  const nx = Math.ceil(dx / voxel);
  const ny = Math.ceil(dy / voxel);
  const nz = Math.ceil(dz / voxel);
  const bboxSurfaceAreaM2 = 2 * (dx * dy + dy * dz + dx * dz);
  const estSurfaceVoxels = Math.round(bboxSurfaceAreaM2 / (voxel * voxel));
  const estTriangles = Math.round(estSurfaceVoxels * kTri);
  const binaryStlBytes = 84 + 50 * estTriangles;
  const binaryStlMb = binaryStlBytes / (1024 * 1024);

  return {
    valid: true as const,
    bboxVolumeM3,
    pointDensityPerM3,
    gridDims: `${nx} x ${ny} x ${nz}`,
    estSurfaceVoxels,
    estTriangles,
    binaryStlBytes,
    binaryStlMb,
  };
}

export default function OnlinePointCloudToMeshConverterClient() {
  const [spanXStr, setSpanXStr] = useState('20');
  const [spanYStr, setSpanYStr] = useState('10');
  const [spanZStr, setSpanZStr] = useState('5');
  const [rawPointsStr, setRawPointsStr] = useState('1000000');
  const [voxelMStr, setVoxelMStr] = useState('0.05');
  const [triFactorStr, setTriFactorStr] = useState('2');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: MeshBudgetPreset) => {
    setSpanXStr(p.spanX);
    setSpanYStr(p.spanY);
    setSpanZStr(p.spanZ);
    setRawPointsStr(p.rawPoints);
    setVoxelMStr(p.voxelM);
    setTriFactorStr(p.triPerSurfaceVoxel);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const evalRes = useMemo(
    () => computeMeshBudget(spanXStr, spanYStr, spanZStr, rawPointsStr, voxelMStr, triFactorStr),
    [spanXStr, spanYStr, spanZStr, rawPointsStr, voxelMStr, triFactorStr]
  );

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Point Cloud to Binary STL Mesh Budget Summary',
      `Bounding Volume: ${evalRes.bboxVolumeM3.toFixed(4)} m^3 | Density: ${evalRes.pointDensityPerM3.toFixed(2)} pts/m^3`,
      `Voxel Grid: ${evalRes.gridDims}`,
      `Estimated Triangles: ${evalRes.estTriangles}`,
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
      `Bounding Box Volume,${evalRes.bboxVolumeM3.toFixed(4)},m^3`,
      `Volumetric Point Density,${evalRes.pointDensityPerM3.toFixed(4)},pts/m^3`,
      `Voxel Grid Dimensions,${evalRes.gridDims},cells`,
      `Estimated Surface Voxels,${evalRes.estSurfaceVoxels},cells`,
      `Estimated Triangles,${evalRes.estTriangles},triangles`,
      `Binary STL Size,${evalRes.binaryStlBytes},bytes`,
      `Binary STL Size MB,${evalRes.binaryStlMb.toFixed(6)},MB`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'point_cloud_stl_budget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Voxel Density &amp; Binary STL File Size Estimator:</span> Evaluates volumetric point density, voxel resolution grid dimensions, surface triangle estimates, and exact Binary STL byte footprint (`84 + 50 * N_tri` bytes) prior to desktop Poisson / Ball-Pivoting surface reconstruction.
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
            <Box className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">Bounding Box &amp; Voxel Inputs</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Span X (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-span-x"
                value={spanXStr}
                onChange={(e) => setSpanXStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Span Y (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-span-y"
                value={spanYStr}
                onChange={(e) => setSpanYStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Span Z (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-span-z"
                value={spanZStr}
                onChange={(e) => setSpanZStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Raw Point Count</label>
            <input
              type="text"
              inputMode="numeric"
              data-testid="input-points"
              value={rawPointsStr}
              onChange={(e) => setRawPointsStr(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Voxel Spacing (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-voxel"
                value={voxelMStr}
                onChange={(e) => setVoxelMStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Triangles / Surface Voxel</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tri-factor"
                value={triFactorStr}
                onChange={(e) => setTriFactorStr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
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
              <h2 className="text-lg font-black text-slate-900">Mesh Resolution &amp; STL Budget</h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-bold text-blue-600 uppercase">Point Density</div>
                  <div className="text-2xl font-black text-blue-900 mt-1">
                    <span data-testid="out-density">{evalRes.pointDensityPerM3.toFixed(2)}</span> pts/m^3
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Estimated Mesh Facets</div>
                  <div data-testid="out-triangles" className="text-2xl font-black text-emerald-900 mt-1">
                    {evalRes.estTriangles}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase">Binary STL Byte Size</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    <span data-testid="out-stl-bytes">{evalRes.binaryStlBytes}</span> bytes
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase">Binary STL Size (MB)</div>
                  <div data-testid="out-stl-mb" className="text-xl font-black text-slate-900 mt-1">
                    {evalRes.binaryStlMb.toFixed(4)} MB
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Per binary STL format layout: 80-byte header + 4-byte triangle count + 50 bytes per triangle (`84 + 50 * N_tri`). Surface voxel count approximates the bounding envelope surface area divided by `voxel^2`.
                </span>
              </div>
              <a
                href="https://en.wikipedia.org/wiki/STL_(file_format)"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                Binary STL File Layout Specification (Wikipedia) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
