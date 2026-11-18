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

interface PilePreset {
  id: string;
  label: string;
  diaMm: string;
  lengthM: string;
  cuKpa: string;
  nc: string;
  alpha: string;
  fs: string;
}

const PRESETS: PilePreset[] = [
  {
    id: 'cohesive-600',
    label: 'Preset 1: 600 mm x 15 m Pile (cu=50 kPa, Nc=9, alpha=0.5, FS=2.5)',
    diaMm: '600',
    lengthM: '15',
    cuKpa: '50',
    nc: '9',
    alpha: '0.5',
    fs: '2.5',
  },
  {
    id: 'large-bored-800',
    label: 'Preset 2: 800 mm x 20 m Pile (cu=75 kPa, Nc=9, alpha=0.45, FS=3.0)',
    diaMm: '800',
    lengthM: '20',
    cuKpa: '75',
    nc: '9',
    alpha: '0.45',
    fs: '3.0',
  },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function evaluatePileCapacity(
  diaStr: string,
  lenStr: string,
  cuStr: string,
  ncStr: string,
  alphaStr: string,
  fsStr: string
) {
  const diaMm = parsePositive(diaStr);
  const L = parsePositive(lenStr);
  const cu = parsePositive(cuStr);
  const nc = parsePositive(ncStr);
  const alpha = parsePositive(alphaStr);
  const fs = parsePositive(fsStr);

  if (
    !Number.isFinite(diaMm) ||
    !Number.isFinite(L) ||
    !Number.isFinite(cu) ||
    !Number.isFinite(nc) ||
    !Number.isFinite(alpha) ||
    !Number.isFinite(fs)
  ) {
    return {
      valid: false as const,
      error: 'Pile diameter, length, undrained shear strength, Nc, alpha, and FS must all be > 0.',
    };
  }
  if (alpha > 1.0) {
    return { valid: false as const, error: 'Adhesion factor alpha for total-stress clay must satisfy 0 < alpha <= 1.0.' };
  }
  if (fs < 1.0) {
    return { valid: false as const, error: 'Factor of safety FS must be >= 1.0.' };
  }

  const d = diaMm / 1000;
  const Ap = (Math.PI * d * d) / 4;
  const As = Math.PI * d * L;
  const Qb = Ap * nc * cu;
  const Qs = As * alpha * cu;
  const Qt = Qb + Qs;
  const Qa = Qt / fs;

  return {
    valid: true as const,
    Ap,
    As,
    Qb,
    Qs,
    Qt,
    Qa,
    fs,
  };
}

export default function PileCapacityCalculatorClient() {
  const [diaStr, setDiaStr] = useState('600');
  const [lenStr, setLenStr] = useState('15');
  const [cuStr, setCuStr] = useState('50');
  const [ncStr, setNcStr] = useState('9');
  const [alphaStr, setAlphaStr] = useState('0.5');
  const [fsStr, setFsStr] = useState('2.5');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluatePileCapacity(diaStr, lenStr, cuStr, ncStr, alphaStr, fsStr),
    [diaStr, lenStr, cuStr, ncStr, alphaStr, fsStr]
  );

  const applyPreset = (p: PilePreset) => {
    setDiaStr(p.diaMm);
    setLenStr(p.lengthM);
    setCuStr(p.cuKpa);
    setNcStr(p.nc);
    setAlphaStr(p.alpha);
    setFsStr(p.fs);
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      'Total-Stress Alpha-Method Pile Axial Capacity Summary',
      `Tip Area Ap: ${evalRes.Ap.toFixed(4)} m^2 | Shaft Area As: ${evalRes.As.toFixed(4)} m^2`,
      `End Bearing Qb: ${evalRes.Qb.toFixed(4)} kN | Skin Friction Qs: ${evalRes.Qs.toFixed(4)} kN`,
      `Ultimate Capacity Qu: ${evalRes.Qt.toFixed(4)} kN | Allowable Qa (FS=${evalRes.fs}): ${evalRes.Qa.toFixed(4)} kN`,
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
      `Base Cross-Section Area Ap,${evalRes.Ap.toFixed(6)},m2`,
      `Shaft Surface Area As,${evalRes.As.toFixed(6)},m2`,
      `Ultimate End Bearing Qb,${evalRes.Qb.toFixed(4)},kN`,
      `Ultimate Skin Friction Qs,${evalRes.Qs.toFixed(4)},kN`,
      `Total Ultimate Capacity Qu,${evalRes.Qt.toFixed(4)},kN`,
      `Allowable Capacity Qa,${evalRes.Qa.toFixed(4)},kN`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pile_axial_capacity_alpha_method.csv';
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Pile Dia D (mm)</label>
            <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Embedded Length L (m)</label>
            <input type="text" inputMode="decimal" data-testid="input-length" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Undrained Shear cu (kPa)</label>
            <input type="text" inputMode="decimal" data-testid="input-cu" value={cuStr} onChange={(e) => setCuStr(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Nc</label>
              <input type="text" inputMode="decimal" data-testid="input-nc" value={ncStr} onChange={(e) => setNcStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">alpha</label>
              <input type="text" inputMode="decimal" data-testid="input-alpha" value={alphaStr} onChange={(e) => setAlphaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">FS</label>
              <input type="text" inputMode="decimal" data-testid="input-fs" value={fsStr} onChange={(e) => setFsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Axial Pile Capacity</h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="text-xs font-black text-blue-500 uppercase">End Bearing Qb</div>
                    <div className="text-xl font-black text-blue-900 mt-1"><span data-testid="out-qb">{evalRes.Qb.toFixed(4)}</span> kN</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Skin Friction Qs</div>
                    <div className="text-xl font-black text-emerald-900 mt-1"><span data-testid="out-qs">{evalRes.Qs.toFixed(4)}</span> kN</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <div className="text-xs font-black text-orange-500 uppercase">Ultimate Qu</div>
                    <div className="text-xl font-black text-orange-900 mt-1"><span data-testid="out-qu">{evalRes.Qt.toFixed(4)}</span> kN</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase">Allowable Qa</div>
                    <div className="text-xl font-black text-slate-900 mt-1"><span data-testid="out-qa">{evalRes.Qa.toFixed(4)}</span> kN</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Total-stress alpha-method in cohesive soil: Qb = (pi*D^2/4)*Nc*cu, Qs = (pi*D*L)*alpha*cu, Qu = Qb + Qs, Qa = Qu / FS.</span>
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
