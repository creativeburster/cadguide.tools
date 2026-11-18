'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Info,
  RotateCcw,
  Settings,
  Zap,
} from 'lucide-react';

interface PavementPreset {
  id: string;
  label: string;
  targetSn: string;
  d1Mm: string;
  a1: string;
  d2Mm: string;
  a2: string;
  m2: string;
  a3: string;
  m3: string;
  stepMm: string;
}

const PRESETS: PavementPreset[] = [
  {
    id: 'collector-380',
    label: 'Preset 1: Collector SN=3.80 (D1=100mm, D2=200mm, 10mm step -> D3=230mm)',
    targetSn: '3.80',
    d1Mm: '100',
    a1: '0.44',
    d2Mm: '200',
    a2: '0.14',
    m2: '1.00',
    a3: '0.11',
    m3: '1.00',
    stepMm: '10',
  },
  {
    id: 'heavy-haul',
    label: 'Preset 2: Heavy Haul SN=5.00 (D1=150mm, D2=250mm, 25mm step -> D3=350mm)',
    targetSn: '5.00',
    d1Mm: '150',
    a1: '0.44',
    d2Mm: '250',
    a2: '0.14',
    m2: '0.90',
    a3: '0.11',
    m3: '0.80',
    stepMm: '25',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function evaluatePavementThickness(
  snStr: string,
  d1Str: string,
  a1Str: string,
  d2Str: string,
  a2Str: string,
  m2Str: string,
  a3Str: string,
  m3Str: string,
  stepStr: string
) {
  const targetSn = parsePositive(snStr);
  const d1Mm = parsePositive(d1Str);
  const a1 = parsePositive(a1Str);
  const d2Mm = parsePositive(d2Str);
  const a2 = parsePositive(a2Str);
  const m2 = parsePositive(m2Str);
  const a3 = parsePositive(a3Str);
  const m3 = parsePositive(m3Str);
  const stepMm = parsePositive(stepStr);

  if (
    !Number.isFinite(targetSn) ||
    !Number.isFinite(d1Mm) ||
    !Number.isFinite(a1) ||
    !Number.isFinite(d2Mm) ||
    !Number.isFinite(a2) ||
    !Number.isFinite(m2) ||
    !Number.isFinite(a3) ||
    !Number.isFinite(m3) ||
    !Number.isFinite(stepMm)
  ) {
    return {
      valid: false as const,
      error: 'Target SN, layer thicknesses, layer coefficients, drainage factors, and rounding step must all be > 0.',
    };
  }

  const mmPerIn = 25.4;
  const sn1 = a1 * (d1Mm / mmPerIn);
  const sn2 = a2 * m2 * (d2Mm / mmPerIn);
  const snRem = Math.max(0, targetSn - sn1 - sn2);
  const d3ExactMm = (snRem / (a3 * m3)) * mmPerIn;
  const d3DesignMm = d3ExactMm === 0 ? 0 : Math.ceil(d3ExactMm / stepMm) * stepMm;
  const sn3 = a3 * m3 * (d3DesignMm / mmPerIn);
  const snProvided = sn1 + sn2 + sn3;
  const totalDepthMm = d1Mm + d2Mm + d3DesignMm;

  return {
    valid: true as const,
    targetSn,
    d1Mm,
    d2Mm,
    d3ExactMm,
    d3DesignMm,
    totalDepthMm,
    sn1,
    sn2,
    sn3,
    snProvided,
  };
}

export default function PavementThicknessCalculatorClient() {
  const [snStr, setSnStr] = useState('3.80');
  const [d1Str, setD1Str] = useState('100');
  const [a1Str, setA1Str] = useState('0.44');
  const [d2Str, setD2Str] = useState('200');
  const [a2Str, setA2Str] = useState('0.14');
  const [m2Str, setM2Str] = useState('1.00');
  const [a3Str, setA3Str] = useState('0.11');
  const [m3Str, setM3Str] = useState('1.00');
  const [stepStr, setStepStr] = useState('10');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePavementThickness(snStr, d1Str, a1Str, d2Str, a2Str, m2Str, a3Str, m3Str, stepStr),
    [snStr, d1Str, a1Str, d2Str, a2Str, m2Str, a3Str, m3Str, stepStr]
  );

  const applyPreset = (p: PavementPreset) => {
    setSnStr(p.targetSn);
    setD1Str(p.d1Mm);
    setA1Str(p.a1);
    setD2Str(p.d2Mm);
    setA2Str(p.a2);
    setM2Str(p.m2);
    setA3Str(p.a3);
    setM3Str(p.m3);
    setStepStr(p.stepMm);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Flexible Pavement Structural Number Layer Summary',
      `Target SN: ${evalRes.targetSn.toFixed(4)} | Provided SN: ${evalRes.snProvided.toFixed(4)}`,
      `Surface D1: ${evalRes.d1Mm} mm (SN1=${evalRes.sn1.toFixed(4)})`,
      `Base D2: ${evalRes.d2Mm} mm (SN2=${evalRes.sn2.toFixed(4)})`,
      `Subbase D3: ${evalRes.d3DesignMm} mm (exact ${evalRes.d3ExactMm.toFixed(2)} mm, SN3=${evalRes.sn3.toFixed(4)})`,
      `Total Structure Depth: ${evalRes.totalDepthMm} mm`,
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
      'Layer,ThicknessMm,SNContribution',
      `Surface D1,${evalRes.d1Mm.toFixed(2)},${evalRes.sn1.toFixed(4)}`,
      `Base D2,${evalRes.d2Mm.toFixed(2)},${evalRes.sn2.toFixed(4)}`,
      `Subbase D3 Rounded,${evalRes.d3DesignMm.toFixed(2)},${evalRes.sn3.toFixed(4)}`,
      `Subbase D3 Exact,${evalRes.d3ExactMm.toFixed(4)},${Math.max(0, evalRes.targetSn - evalRes.sn1 - evalRes.sn2).toFixed(4)}`,
      `TOTAL,${evalRes.totalDepthMm.toFixed(2)},${evalRes.snProvided.toFixed(4)}`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pavement_layer_thickness.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-orange-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Layer Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Target SN</label>
              <input type="text" inputMode="decimal" data-testid="input-sn" value={snStr} onChange={(e) => setSnStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Rounding Step (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-step" value={stepStr} onChange={(e) => setStepStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Surface D1 (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-d1" value={d1Str} onChange={(e) => setD1Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Coeff a1 (/in)</label>
              <input type="text" inputMode="decimal" data-testid="input-a1" value={a1Str} onChange={(e) => setA1Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Base D2 (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-d2" value={d2Str} onChange={(e) => setD2Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Coeff a2 (/in)</label>
              <input type="text" inputMode="decimal" data-testid="input-a2" value={a2Str} onChange={(e) => setA2Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Base Drain m2</label>
              <input type="text" inputMode="decimal" data-testid="input-m2" value={m2Str} onChange={(e) => setM2Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Subbase a3 (/in)</label>
              <input type="text" inputMode="decimal" data-testid="input-a3" value={a3Str} onChange={(e) => setA3Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Subbase Drainage Factor m3</label>
              <input type="text" inputMode="decimal" data-testid="input-m3" value={m3Str} onChange={(e) => setM3Str(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Required Subbase &amp; Provided SN</h2>
              </div>
              <div className="flex gap-2">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
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
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Provided SN</div>
                    <div data-testid="out-sn-total" className="text-2xl font-black text-blue-900">{evalRes.snProvided.toFixed(4)}</div>
                    <div className="text-xs text-blue-700 font-semibold mt-0.5">
                      SN1={evalRes.sn1.toFixed(3)} + SN2={evalRes.sn2.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                    <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-1">Design Subbase D3</div>
                    <div className="text-2xl font-black text-purple-900">
                      <span data-testid="out-d3-design">{evalRes.d3DesignMm}</span> mm
                    </div>
                    <div className="text-xs text-purple-700 font-semibold mt-0.5">
                      Exact: <span data-testid="out-d3-exact">{evalRes.d3ExactMm.toFixed(2)}</span> mm
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Total Pavement Depth</div>
                    <div className="text-2xl font-black text-emerald-900">
                      <span data-testid="out-total-depth">{evalRes.totalDepthMm}</span> mm
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>SN_cap = a1*(D1/25.4) + a2*m2*(D2/25.4) + a3*m3*(D3/25.4), solving remaining subbase thickness rounded up by step.</span>
                </div>
              </>
            )}
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
