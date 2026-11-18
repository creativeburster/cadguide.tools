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

type HeadFixity = 'free' | 'fixed';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (!t) return NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function evaluateRigidPileLateral(
  diaMmStr: string,
  lenMStr: string,
  cuStr: string,
  eccMStr: string,
  kcStr: string,
  fsStr: string,
  head: HeadFixity
) {
  const diaMm = parsePositive(diaMmStr);
  const L = parsePositive(lenMStr);
  const cu = parsePositive(cuStr);
  const e = parseNonNegative(eccMStr);
  const kc = parsePositive(kcStr);
  const fs = parsePositive(fsStr);

  if (
    !Number.isFinite(diaMm) ||
    !Number.isFinite(L) ||
    !Number.isFinite(cu) ||
    !Number.isFinite(e) ||
    !Number.isFinite(kc) ||
    !Number.isFinite(fs)
  ) {
    return {
      valid: false as const,
      error: 'Pile diameter, embedded length, undrained cu, factor kc, and FS must be > 0; load eccentricity e >= 0.',
    };
  }
  if (fs < 1.0) {
    return { valid: false as const, error: 'Factor of safety FS must be >= 1.0.' };
  }

  const D = diaMm / 1000;
  const zSkip = 1.5 * D;
  if (L <= zSkip) {
    return {
      valid: false as const,
      error: `Embedded length L (${L} m) must exceed upper ineffective zone depth 1.5*D (${zSkip.toFixed(3)} m).`,
    };
  }

  const lEff = L - zSkip;
  const pUltPerM = kc * cu * D;

  let fM = 0;
  let huKn = 0;
  let mMaxKnm = 0;

  if (head === 'fixed') {
    fM = lEff;
    huKn = pUltPerM * lEff;
    mMaxKnm = huKn * (zSkip + 0.5 * lEff);
  } else {
    // Free-head rigid pile moment equilibrium around rotation toe:
    // f = sqrt(b1^2 + L_eff^2) - b1 where b1 = 2*e + 3*D + L_eff
    const b1 = 2 * e + 3 * D + lEff;
    fM = Math.sqrt(b1 * b1 + lEff * lEff) - b1;
    huKn = pUltPerM * fM;
    mMaxKnm = huKn * (e + zSkip + 0.5 * fM);
  }

  const hAllowKn = huKn / fs;
  return {
    valid: true as const,
    zSkip,
    lEff,
    fM,
    huKn,
    hAllowKn,
    mMaxKnm,
    head,
    fs,
  };
}

export default function PileLateralCapacityCalculatorClient() {
  const [diaStr, setDiaStr] = useState('800');
  const [lenStr, setLenStr] = useState('6.0');
  const [cuStr, setCuStr] = useState('65');
  const [eccStr, setEccStr] = useState('0.5');
  const [kcStr, setKcStr] = useState('9');
  const [fsStr, setFsStr] = useState('2.5');
  const [head, setHead] = useState<HeadFixity>('free');
  const [copied, setCopied] = useState(false);

  const evalRes = useMemo(
    () => evaluateRigidPileLateral(diaStr, lenStr, cuStr, eccStr, kcStr, fsStr, head),
    [diaStr, lenStr, cuStr, eccStr, kcStr, fsStr, head]
  );

  const resetDefaults = () => {
    setDiaStr('800');
    setLenStr('6.0');
    setCuStr('65');
    setEccStr('0.5');
    setKcStr('9');
    setFsStr('2.5');
    setHead('free');
  };

  const handleCopy = () => {
    if (!evalRes.valid) return;
    const text = [
      `Cohesive Rigid Pile Lateral Capacity (${evalRes.head} head)`,
      `Upper Ineffective Zone 1.5D: ${evalRes.zSkip.toFixed(4)} m | Effective Depth L_eff: ${evalRes.lEff.toFixed(4)} m`,
      `Ultimate Lateral Soil Resistance Hu: ${evalRes.huKn.toFixed(4)} kN`,
      `Allowable Lateral Load (FS=${evalRes.fs}): ${evalRes.hAllowKn.toFixed(4)} kN`,
      `Maximum Soil Moment M_max: ${evalRes.mMaxKnm.toFixed(4)} kN*m`,
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
      `Head Boundary Condition,${evalRes.head},mode`,
      `Upper Gap Depth 1.5D,${evalRes.zSkip.toFixed(4)},m`,
      `Active Effective Length L_eff,${evalRes.lEff.toFixed(4)},m`,
      `Positive Resistance Depth f,${evalRes.fM.toFixed(4)},m`,
      `Ultimate Lateral Resistance Hu,${evalRes.huKn.toFixed(4)},kN`,
      `Allowable Lateral Load Ha,${evalRes.hAllowKn.toFixed(4)},kN`,
      `Peak Moment M_max,${evalRes.mMaxKnm.toFixed(4)},kN*m`,
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rigid_pile_lateral_capacity.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-free"
          onClick={resetDefaults}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-purple-400"
        >
          Preset 1: Free-Head Rigid Pile (D=800 mm, L=6.0 m, e=0.5 m)
        </button>
        <button
          type="button"
          data-testid="preset-fixed"
          onClick={() => {
            setDiaStr('800');
            setLenStr('6.0');
            setCuStr('65');
            setEccStr('0.5');
            setKcStr('9');
            setFsStr('2.5');
            setHead('fixed');
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-purple-400"
        >
          Preset 2: Fixed-Head Rigid Translation (D=800 mm, L=6.0 m)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-testid="head-free"
              onClick={() => setHead('free')}
              className={`py-2 px-3 rounded-xl text-xs font-black border ${head === 'free' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700'}`}
            >
              Free Head
            </button>
            <button
              type="button"
              data-testid="head-fixed"
              onClick={() => setHead('fixed')}
              className={`py-2 px-3 rounded-xl text-xs font-black border ${head === 'fixed' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700'}`}
            >
              Fixed Head
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Diameter D (mm)</label>
              <input type="text" inputMode="decimal" data-testid="input-dia" value={diaStr} onChange={(e) => setDiaStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Depth L (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-len" value={lenStr} onChange={(e) => setLenStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Shear cu (kPa)</label>
              <input type="text" inputMode="decimal" data-testid="input-cu" value={cuStr} onChange={(e) => setCuStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Eccentricity e (m)</label>
              <input type="text" inputMode="decimal" data-testid="input-ecc" value={eccStr} onChange={(e) => setEccStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Bearing Factor kc</label>
              <input type="text" inputMode="decimal" data-testid="input-kc" value={kcStr} onChange={(e) => setKcStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase block mb-1">Safety Factor FS</label>
              <input type="text" inputMode="decimal" data-testid="input-fs" value={fsStr} onChange={(e) => setFsStr(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Rigid-Pile Static Equilibrium</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
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
                    <div className="text-xs font-black text-blue-500 uppercase">Ultimate Resistance Hu</div>
                    <div className="text-2xl font-black text-blue-900 mt-1">
                      <span data-testid="out-hu">{evalRes.huKn.toFixed(4)}</span> kN
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="text-xs font-black text-emerald-600 uppercase">Allowable Load Ha</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      <span data-testid="out-ha">{evalRes.hAllowKn.toFixed(4)}</span> kN
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-xs font-black text-slate-500 uppercase">Max Soil Moment</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      <span data-testid="out-mmax">{evalRes.mMaxKnm.toFixed(4)}</span> kN*m
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">f = {evalRes.fM.toFixed(4)} m</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Assumes rigid short-pile soil failure without structural plastic hinge formation; verify pile section bending resistance M_y exceeds M_max separately.</span>
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
