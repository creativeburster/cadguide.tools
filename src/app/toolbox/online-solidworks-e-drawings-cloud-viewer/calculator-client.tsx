'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Cog,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

interface AssemblyPreset {
  id: string;
  label: string;
  totalComponents: string;
  suppressedPct: string;
  avgTrisPerPart: string;
}

const PRESETS: AssemblyPreset[] = [
  {
    id: 'gearbox-asm',
    label: 'Preset 1: 400-Part Gearbox (25% suppressed -> 300 active x 2,000 tris)',
    totalComponents: '400',
    suppressedPct: '25',
    avgTrisPerPart: '2000',
  },
  {
    id: 'full-machine',
    label: 'Preset 2: Unsuppressed Machine Cell (100 parts, 0% suppressed, 10,000 tris/part)',
    totalComponents: '100',
    suppressedPct: '0',
    avgTrisPerPart: '10000',
  },
];

function parsePosInt(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return NaN;
  const n = Number(t);
  return Number.isSafeInteger(n) && n >= 1 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function computeAssemblyBudget(totalCompStr: string, suppressedPctStr: string, trisPerPartStr: string) {
  const totalComp = parsePosInt(totalCompStr);
  const suppressedPct = parseNonNegative(suppressedPctStr);
  const trisPerPart = parsePosInt(trisPerPartStr);

  if (!Number.isFinite(totalComp) || !Number.isFinite(suppressedPct) || !Number.isFinite(trisPerPart)) {
    return {
      valid: false as const,
      error: 'Component count & triangles/part must be positive integers; suppressed ratio must be 0..99.9%.',
    };
  }
  if (suppressedPct >= 100) {
    return { valid: false as const, error: 'Suppressed/hidden percentage must be strictly less than 100%.' };
  }

  const activeComponents = totalComp * (1 - suppressedPct / 100);
  const totalTriangles = Math.round(activeComponents * trisPerPart);
  const binaryStlBytes = 84 + 50 * totalTriangles;
  const binaryStlMb = binaryStlBytes / (1024 * 1024);

  return {
    valid: true as const,
    activeComponents,
    totalTriangles,
    binaryStlBytes,
    binaryStlMb,
  };
}

export default function OnlineSolidworksEDrawingsCloudViewerClient() {
  const [totalCompStr, setTotalCompStr] = useState('400');
  const [suppressedPctStr, setSuppressedPctStr] = useState('25');
  const [trisPerPartStr, setTrisPerPartStr] = useState('2000');
  const [headerNote, setHeaderNote] = useState('No local .sldprt/.sldasm read (optional CFBF container check)');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => computeAssemblyBudget(totalCompStr, suppressedPctStr, trisPerPartStr),
    [totalCompStr, suppressedPctStr, trisPerPartStr]
  );

  const handleLocalInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
    const isCfbf = bytes.length >= 4 && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
    setHeaderNote(
      `${file.name}: ${(file.size / 1024).toFixed(2)} KB, ${isCfbf ? 'Valid CFBF Compound Container' : 'Header Bytes'} [${hex}] (0 bytes uploaded)`
    );
  };

  const applyPreset = (p: AssemblyPreset) => {
    setTotalCompStr(p.totalComponents);
    setSuppressedPctStr(p.suppressedPct);
    setTrisPerPartStr(p.avgTrisPerPart);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setHeaderNote('No local .sldprt/.sldasm read (optional CFBF container check)');
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'CAD Assembly Lightweighting & Tessellation Size Budget',
      `Active Components: ${evalRes.activeComponents.toFixed(2)}`,
      `Total Tessellated Triangles: ${evalRes.totalTriangles}`,
      `Equivalent Binary STL Size: ${evalRes.binaryStlBytes} bytes (${evalRes.binaryStlMb.toFixed(4)} MB)`,
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
      `Active Components,${evalRes.activeComponents.toFixed(4)},count`,
      `Total Tessellated Triangles,${evalRes.totalTriangles},triangles`,
      `Binary STL Size Bytes,${evalRes.binaryStlBytes},bytes`,
      `Binary STL Size MB,${evalRes.binaryStlMb.toFixed(6)},MB`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assembly_tessellation_budget.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local CFBF Container Check &amp; Assembly Lightweighting Calculator:</span> Reads leading bytes of native `.sldprt`/`.sldasm`/`.edrw` containers (`D0 CF 11 E0` Compound File Binary Format, `0 bytes uploaded`) and budgets active triangle load and Binary STL export size. Rendering native Parasolid/eDrawings assemblies requires desktop CAD/eDrawings Viewer.
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Cog className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Assembly Parameters</h2>
            </div>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read Local File
              <input type="file" accept=".sldprt,.sldasm,.slddrw,.eprt,.easm,.edrw" onChange={handleLocalInspect} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{headerNote}</div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Total Assembly Components</label>
            <input type="text" inputMode="numeric" data-testid="input-total-comp" value={totalCompStr} onChange={(e) => setTotalCompStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Suppressed / Defeatured Ratio (%)</label>
            <input type="text" inputMode="decimal" data-testid="input-suppressed-pct" value={suppressedPctStr} onChange={(e) => setSuppressedPctStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Avg Triangles per Active Part</label>
            <input type="text" inputMode="numeric" data-testid="input-tris-per-part" value={trisPerPartStr} onChange={(e) => setTrisPerPartStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
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
              <h2 className="text-lg font-black text-slate-900">Lightweighting &amp; Export Footprint</h2>
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
                  <div className="text-xs font-bold text-blue-600 uppercase">Active Components</div>
                  <div data-testid="out-active-comp" className="text-2xl font-black text-blue-900 mt-1">
                    {evalRes.activeComponents.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Total Triangles</div>
                  <div data-testid="out-total-tris" className="text-2xl font-black text-emerald-900 mt-1">
                    {evalRes.totalTriangles}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 uppercase">Binary STL Budget</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    <span data-testid="out-stl-mb">{evalRes.binaryStlMb.toFixed(4)}</span> MB
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    (<span data-testid="out-stl-bytes">{evalRes.binaryStlBytes}</span> B)
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Suppressing internal hardware before tessellation scales triangle count linearly (`Active = Total * (1 - Suppressed%/100)`), and Binary STL export size equals `84 + 50 * Triangles` bytes.
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://en.wikipedia.org/wiki/Compound_File_Binary_Format"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  CFBF Container Spec (D0 CF 11 E0) <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/STL_(file_format)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  Binary STL Size Spec <ExternalLink className="w-3 h-3" />
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
