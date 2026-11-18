'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

interface FamilyAuditPreset {
  id: string;
  label: string;
  fileSizeKb: string;
  maxSizeKb: string;
  nestingDepth: string;
  maxDepth: string;
  importedCads: string;
  formulaCount: string;
  meshTris: string;
  maxTris: string;
}

const PRESETS: FamilyAuditPreset[] = [
  {
    id: 'clean-family',
    label: 'Preset 1: Clean 1200 KB Pump Family (0 Failures -> PASS)',
    fileSizeKb: '1200',
    maxSizeKb: '2000',
    nestingDepth: '2',
    maxDepth: '3',
    importedCads: '0',
    formulaCount: '12',
    meshTris: '2500',
    maxTris: '5000',
  },
  {
    id: 'bloated-family',
    label: 'Preset 2: Overweight Family (4500 KB, Nesting 5, 2 Imported DWGs -> FAIL)',
    fileSizeKb: '4500',
    maxSizeKb: '2000',
    nestingDepth: '5',
    maxDepth: '3',
    importedCads: '2',
    formulaCount: '38',
    meshTris: '12000',
    maxTris: '5000',
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

function evaluateFamilyAudit(
  sizeStr: string,
  maxSizeStr: string,
  depthStr: string,
  maxDepthStr: string,
  cadCountStr: string,
  formulaStr: string,
  trisStr: string,
  maxTrisStr: string
) {
  const sizeKb = parsePositive(sizeStr);
  const maxKb = parsePositive(maxSizeStr);
  const depth = parseNonNegInt(depthStr);
  const maxDepth = parseNonNegInt(maxDepthStr);
  const cadCount = parseNonNegInt(cadCountStr);
  const formulas = parseNonNegInt(formulaStr);
  const tris = parseNonNegInt(trisStr);
  const maxTris = parsePositive(maxTrisStr);

  if (
    !Number.isFinite(sizeKb) ||
    !Number.isFinite(maxKb) ||
    !Number.isFinite(depth) ||
    !Number.isFinite(maxDepth) ||
    !Number.isFinite(cadCount) ||
    !Number.isFinite(formulas) ||
    !Number.isFinite(tris) ||
    !Number.isFinite(maxTris)
  ) {
    return {
      valid: false as const,
      error: 'File sizes and triangle limits must be > 0; counts and nesting depths must be integers >= 0.',
    };
  }

  const sizeRatioPct = (sizeKb / maxKb) * 100;
  const triRatioPct = (tris / maxTris) * 100;
  const checks = [
    { name: 'File Size <= Budget', actual: `${sizeKb} KB`, limit: `${maxKb} KB`, pass: sizeKb <= maxKb },
    { name: 'Nesting Depth <= Limit', actual: String(depth), limit: String(maxDepth), pass: depth <= maxDepth },
    { name: 'Imported CAD Objects == 0', actual: String(cadCount), limit: '0', pass: cadCount === 0 },
    { name: 'Triangle Count <= Limit', actual: String(tris), limit: String(maxTris), pass: tris <= maxTris },
  ];
  const failCount = checks.filter((c) => !c.pass).length;
  const status = failCount === 0 ? 'PASS' : 'FAIL';

  return {
    valid: true as const,
    sizeKb,
    maxKb,
    sizeRatioPct,
    triRatioPct,
    formulas,
    checks,
    failCount,
    status,
  };
}

export default function OnlineRevitFamilyCheckerAuditClient() {
  const [sizeStr, setSizeStr] = useState('1200');
  const [maxSizeStr, setMaxSizeStr] = useState('2000');
  const [depthStr, setDepthStr] = useState('2');
  const [maxDepthStr, setMaxDepthStr] = useState('3');
  const [cadCountStr, setCadCountStr] = useState('0');
  const [formulaStr, setFormulaStr] = useState('12');
  const [trisStr, setTrisStr] = useState('2500');
  const [maxTrisStr, setMaxTrisStr] = useState('5000');
  const [rfaHeaderNote, setRfaHeaderNote] = useState('No local .rfa read (optional CFBF D0 CF 11 E0 byte check)');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () =>
      evaluateFamilyAudit(
        sizeStr,
        maxSizeStr,
        depthStr,
        maxDepthStr,
        cadCountStr,
        formulaStr,
        trisStr,
        maxTrisStr
      ),
    [sizeStr, maxSizeStr, depthStr, maxDepthStr, cadCountStr, formulaStr, trisStr, maxTrisStr]
  );

  const applyPreset = (p: FamilyAuditPreset) => {
    setSizeStr(p.fileSizeKb);
    setMaxSizeStr(p.maxSizeKb);
    setDepthStr(p.nestingDepth);
    setMaxDepthStr(p.maxDepth);
    setCadCountStr(p.importedCads);
    setFormulaStr(p.formulaCount);
    setTrisStr(p.meshTris);
    setMaxTrisStr(p.maxTris);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
    setRfaHeaderNote('No local .rfa read (optional CFBF D0 CF 11 E0 byte check)');
  };

  const handleRfaHeaderCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = (file.size / 1024).toFixed(2);
    setSizeStr(String(Math.max(1, Math.round(file.size / 1024))));
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
    const isCfbf = bytes.length >= 4 && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
    setRfaHeaderNote(
      `${file.name}: ${kb} KB, ${isCfbf ? 'Valid CFBF Compound Container' : 'Non-CFBF Header'} [${hex}] (0 bytes uploaded)`
    );
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'BIM Family Performance Gate Audit',
      `Gate Status: ${evalRes.status} (${evalRes.failCount} failed checks)`,
      `Size Utilization: ${evalRes.sizeRatioPct.toFixed(4)}% | Triangle Budget: ${evalRes.triRatioPct.toFixed(4)}%`,
      ...evalRes.checks.map((c) => `${c.name}: ${c.actual} vs ${c.limit} -> ${c.pass ? 'PASS' : 'FAIL'}`),
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
      'GateRule,Actual,BudgetLimit,Status',
      ...evalRes.checks.map((c) => `${c.name},${c.actual},${c.limit},${c.pass ? 'PASS' : 'FAIL'}`),
      `Size Budget Ratio,${evalRes.sizeRatioPct.toFixed(4)}%,100%,INFO`,
      `Overall Gate,${evalRes.failCount} failures,0 failures,${evalRes.status}`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rfa_family_performance_audit.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Local CFBF Container Check &amp; Family Gate Calculator:</span> Verifies `.rfa` Compound File Binary Format (`D0 CF 11 E0`) signature bytes and size locally (`0 bytes uploaded`), and evaluates project QA budget gates for size, nesting depth, imported CAD links, and triangle load.
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
            <h2 className="text-lg font-black text-slate-900">Family Metrics vs Limits</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Read Local .rfa
              <input type="file" accept=".rfa" onChange={handleRfaHeaderCheck} className="hidden" />
            </label>
          </div>
          <div className="text-xs text-slate-500 font-mono break-all">{rfaHeaderNote}</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">File Size (KB)</label>
              <input type="text" inputMode="decimal" data-testid="input-size-kb" value={sizeStr} onChange={(e) => setSizeStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Max Size Budget (KB)</label>
              <input type="text" inputMode="decimal" data-testid="input-max-size-kb" value={maxSizeStr} onChange={(e) => setMaxSizeStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Nesting Depth</label>
              <input type="text" inputMode="numeric" data-testid="input-depth" value={depthStr} onChange={(e) => setDepthStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Max Depth Limit</label>
              <input type="text" inputMode="numeric" data-testid="input-max-depth" value={maxDepthStr} onChange={(e) => setMaxDepthStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Imported CAD Count</label>
              <input type="text" inputMode="numeric" data-testid="input-cad-count" value={cadCountStr} onChange={(e) => setCadCountStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Formula Count</label>
              <input type="text" inputMode="numeric" data-testid="input-formulas" value={formulaStr} onChange={(e) => setFormulaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">3D Mesh Triangles</label>
              <input type="text" inputMode="numeric" data-testid="input-tris" value={trisStr} onChange={(e) => setTrisStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Max Triangles</label>
              <input type="text" inputMode="numeric" data-testid="input-max-tris" value={maxTrisStr} onChange={(e) => setMaxTrisStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800" />
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
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Gate Evaluation</h2>
              </div>
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
                  Export Audit CSV
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className={`p-4 rounded-2xl border ${
                      evalRes.status === 'PASS'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">Gate Verdict</div>
                    <div data-testid="out-status" className="text-2xl font-black mt-1">
                      {evalRes.status} ({evalRes.failCount} fails)
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Size Budget Ratio</div>
                    <div data-testid="out-size-ratio" className="text-2xl font-black text-blue-900 mt-1">
                      {evalRes.sizeRatioPct.toFixed(4)}%
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">Triangle Budget Ratio</div>
                    <div data-testid="out-tri-ratio" className="text-2xl font-black text-slate-900 mt-1">
                      {evalRes.triRatioPct.toFixed(4)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {evalRes.checks.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
                      <span className="text-slate-700">{c.name}</span>
                      <span className={c.pass ? 'text-emerald-700' : 'text-rose-700'}>
                        {c.actual} / {c.limit} ({c.pass ? 'PASS' : 'FAIL'})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Revit `.rfa` files use Microsoft Compound File Binary Format (`CFBF` magic `D0 CF 11 E0`). Tracking file size, nesting depth, imported DWG count, and mesh facets against team QA budgets keeps federated BIM models responsive.
                </span>
              </div>
              <a
                href="https://en.wikipedia.org/wiki/Compound_File_Binary_Format"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                Compound File Binary Format (D0 CF 11 E0) Reference <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
