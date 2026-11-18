'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Scale, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

type LeverClass = '1' | '2' | '3';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function LeverMechanicalAdvantageCalculatorClient() {
  const [leverClass, setLeverClass] = useState<LeverClass>('1');
  const [loadForceStr, setLoadForceStr] = useState('200');
  const [effortArmStr, setEffortArmStr] = useState('1.5');
  const [loadArmStr, setLoadArmStr] = useState('0.3');
  const [effStr, setEffStr] = useState('100');
  const [copied, setCopied] = useState(false);

  const loadForce = parsePos(loadForceStr);
  const effortArm = parsePos(effortArmStr);
  const loadArm = parsePos(loadArmStr);
  const eff = parsePos(effStr);

  const effOk = eff !== null && eff > 0 && eff <= 100;
  let geomOk = effortArm !== null && loadArm !== null;
  if (geomOk && effortArm !== null && loadArm !== null) {
    if (leverClass === '2' && effortArm <= loadArm) geomOk = false;
    if (leverClass === '3' && loadArm <= effortArm) geomOk = false;
  }

  const isValid = loadForce !== null && effOk && geomOk;

  let idealMa: number | null = null;
  let actualMa: number | null = null;
  let effortForce: number | null = null;
  let fulcrumReaction: number | null = null;

  if (isValid && loadForce !== null && effortArm !== null && loadArm !== null && eff !== null) {
    idealMa = effortArm / loadArm;
    actualMa = idealMa * (eff / 100);
    effortForce = loadForce / actualMa;
    if (leverClass === '1') {
      fulcrumReaction = loadForce + effortForce;
    } else if (leverClass === '2') {
      fulcrumReaction = Math.abs(loadForce - effortForce);
    } else {
      fulcrumReaction = Math.abs(effortForce - loadForce);
    }
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (cls: LeverClass, fl: string, le: string, ll: string, ef: string) => {
    setLeverClass(cls);
    setLoadForceStr(fl);
    setEffortArmStr(le);
    setLoadArmStr(ll);
    setEffStr(ef);
  };

  const handleReset = () => applyPreset('1', '200', '1.5', '0.3', '100');

  const handleCopy = async () => {
    if (!isValid || idealMa === null || actualMa === null || effortForce === null || fulcrumReaction === null) return;
    const text = [
      `Class ${leverClass} Lever Statics Summary`,
      `Load Force: ${loadForce} N, Effort Arm: ${effortArm} m, Load Arm: ${loadArm} m, Efficiency: ${eff}%`,
      `Ideal MA: ${idealMa.toFixed(3)}, Actual MA: ${actualMa.toFixed(3)}`,
      `Required Effort: ${effortForce.toFixed(2)} N, Fulcrum Reaction: ${fulcrumReaction.toFixed(2)} N`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || idealMa === null || actualMa === null || effortForce === null || fulcrumReaction === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['lever_class', `class_${leverClass}`, 'type'],
      ['load_force_n', String(loadForce), 'N'],
      ['effort_arm_m', String(effortArm), 'm'],
      ['load_arm_m', String(loadArm), 'm'],
      ['mechanical_efficiency_pct', String(eff), '%'],
      ['ideal_ma', idealMa.toFixed(4), 'ratio'],
      ['actual_ma', actualMa.toFixed(4), 'ratio'],
      ['effort_force_n', effortForce.toFixed(4), 'N'],
      ['fulcrum_reaction_n', fulcrumReaction.toFixed(4), 'N'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lever-class-${leverClass}-ma.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Lever Geometry</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-class1-crowbar"
                onClick={() => applyPreset('1', '200', '1.5', '0.3', '100')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Class 1 Pry Bar (200 N, 1.5 m / 0.3 m)
              </button>
              <button
                type="button"
                data-testid="preset-class2-wheelbarrow"
                onClick={() => applyPreset('2', '500', '1.4', '0.4', '100')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Class 2 Wheelbarrow (500 N, 1.4 m / 0.4 m)
              </button>
              <button
                type="button"
                data-testid="preset-class3-tongs"
                onClick={() => applyPreset('3', '30', '0.08', '0.24', '100')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-200"
              >
                Class 3 Tweezers / Boom (30 N, 0.08 m / 0.24 m)
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Lever Class</div>
            <div className="grid grid-cols-3 gap-2">
              {(['1', '2', '3'] as LeverClass[]).map(c => (
                <button
                  key={c}
                  type="button"
                  data-testid={`class-${c}`}
                  onClick={() => setLeverClass(c)}
                  className={`py-2 rounded-xl text-sm font-bold border ${
                    leverClass === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Class {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Load Force F_load (N)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-load-force"
                value={loadForceStr}
                onChange={e => setLoadForceStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Effort Arm L_e (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-effort-arm"
                  value={effortArmStr}
                  onChange={e => setEffortArmStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Load Arm L_l (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-load-arm"
                  value={loadArmStr}
                  onChange={e => setLoadArmStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Pivot Efficiency (%, (0–100])</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-eff"
                value={effStr}
                onChange={e => setEffStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All forces and arms must be &gt; 0, efficiency in (0, 100]; Class 2 requires L_e &gt; L_l; Class 3 requires L_l &gt; L_e.</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Static Equilibrium &amp; MA</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                MA_ideal = L_effort / L_load, F_effort = F_load / MA_actual
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Actual Mechanical Advantage</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-ma">{fmt(actualMa, 4)}</span>{' '}
                  <span className="text-lg text-blue-600">x</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  Ideal MA: <span data-testid="result-ideal-ma">{fmt(idealMa, 4)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Required Effort Force</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-effort">{fmt(effortForce, 2)}</span>{' '}
                  <span className="text-lg text-emerald-600">N</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sm:col-span-2">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Fulcrum Reaction Magnitude</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-reaction">{fmt(fulcrumReaction, 2)}</span>{' '}
                  <span className="text-lg text-slate-500">N</span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
