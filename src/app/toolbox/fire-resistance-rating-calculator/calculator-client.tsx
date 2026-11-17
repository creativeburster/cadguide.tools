'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

type CalcMode = 'time' | 'thickness';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default Protected Column (dp=25 mm, Hp/As=160)', mode: 'time' as CalcMode, hp: '1.60', area: '0.0100', dp: '25', targetMin: '60', kp: '0.12', rho: '7850', cs: '600', t0: '20', tf: '950', tc: '538' },
  { id: 'target-60', label: 'Solve Thickness for 60 min (Hp/As=160)', mode: 'thickness' as CalcMode, hp: '1.60', area: '0.0100', dp: '25', targetMin: '60', kp: '0.12', rho: '7850', cs: '600', t0: '20', tf: '950', tc: '538' },
  { id: 'heavy-section', label: 'Heavy Column (Hp/As=80 1/m)', mode: 'time' as CalcMode, hp: '1.60', area: '0.0200', dp: '25', targetMin: '120', kp: '0.12', rho: '7850', cs: '600', t0: '20', tf: '950', tc: '538' },
];

export default function FireResistanceThermalCalculatorClient() {
  const [mode, setMode] = useState<CalcMode>('time');
  const [hpStr, setHpStr] = useState('1.60');
  const [areaStr, setAreaStr] = useState('0.0100');
  const [dpStr, setDpStr] = useState('25');
  const [targetMinStr, setTargetMinStr] = useState('60');
  const [kpStr, setKpStr] = useState('0.12');
  const [rhoStr, setRhoStr] = useState('7850');
  const [csStr, setCsStr] = useState('600');
  const [t0Str, setT0Str] = useState('20');
  const [tfStr, setTfStr] = useState('950');
  const [tcStr, setTcStr] = useState('538');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMode(p.mode);
    setHpStr(p.hp);
    setAreaStr(p.area);
    setDpStr(p.dp);
    setTargetMinStr(p.targetMin);
    setKpStr(p.kp);
    setRhoStr(p.rho);
    setCsStr(p.cs);
    setT0Str(p.t0);
    setTfStr(p.tf);
    setTcStr(p.tc);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const Hp = parseStrictPositive(hpStr);
    const As = parseStrictPositive(areaStr);
    const kp = parseStrictPositive(kpStr);
    const rho = parseStrictPositive(rhoStr);
    const cs = parseStrictPositive(csStr);
    const T0 = parseStrictPositive(t0Str);
    const Tf = parseStrictPositive(tfStr);
    const Tc = parseStrictPositive(tcStr);
    const dpMm = parseStrictPositive(dpStr);
    const targetMin = parseStrictPositive(targetMinStr);

    if (
      !Number.isFinite(Hp) ||
      !Number.isFinite(As) ||
      !Number.isFinite(kp) ||
      !Number.isFinite(rho) ||
      !Number.isFinite(cs) ||
      !Number.isFinite(T0) ||
      !Number.isFinite(Tf) ||
      !Number.isFinite(Tc) ||
      (mode === 'time' ? !Number.isFinite(dpMm) : !Number.isFinite(targetMin))
    ) {
      return { valid: false as const, errorMsg: 'Enter valid positive numbers for section geometry, thermal properties, and temperatures.' };
    }
    if (!(T0 < Tc && Tc < Tf)) {
      return { valid: false as const, errorMsg: 'Temperatures must satisfy T_initial < T_critical < T_fire.' };
    }

    const sectionFactor = Hp / As; // 1/m
    const logTerm = -Math.log((Tf - Tc) / (Tf - T0));

    let effectiveDpMm = dpMm;
    let timeToCritMin = 0;
    let tauSec = 0;

    if (mode === 'time') {
      const dpM = dpMm / 1000;
      tauSec = (dpM * rho * cs) / (kp * sectionFactor);
      timeToCritMin = (tauSec * logTerm) / 60;
    } else {
      const targetSec = targetMin * 60;
      tauSec = targetSec / logTerm;
      const reqDpM = (tauSec * kp * sectionFactor) / (rho * cs);
      effectiveDpMm = reqDpM * 1000;
      timeToCritMin = targetMin;
    }

    return {
      valid: true as const,
      Hp,
      As,
      sectionFactor,
      kp,
      rho,
      cs,
      T0,
      Tf,
      Tc,
      effectiveDpMm,
      tauSec,
      timeToCritMin,
    };
  }, [mode, hpStr, areaStr, dpStr, targetMinStr, kpStr, rhoStr, csStr, t0Str, tfStr, tcStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Insulated Steel Section Factor & Lumped Thermal Heating Estimate`,
      `Hp/As = ${result.sectionFactor.toFixed(1)} 1/m, Insulation dp = ${result.effectiveDpMm.toFixed(2)} mm (kp=${result.kp} W/(m*K))`,
      `Thermal Time Constant tau = ${result.tauSec.toFixed(2)} s`,
      `Time to Critical Temp (${result.Tc} C under equiv. ${result.Tf} C exposure) = ${result.timeToCritMin.toFixed(2)} min`,
    ].join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit'],
      ['Mode', mode === 'time' ? 'Solve Time' : 'Solve Thickness', '-'],
      ['Heated Perimeter Hp', String(result.Hp), 'm'],
      ['Steel Cross-Section Area As', String(result.As), 'm2'],
      ['Section Factor Hp/As', result.sectionFactor.toFixed(1), '1/m'],
      ['Protection Thickness dp', result.effectiveDpMm.toFixed(2), 'mm'],
      ['Protection Conductivity kp', String(result.kp), 'W/(m*K)'],
      ['Thermal Time Constant tau', result.tauSec.toFixed(2), 's'],
      ['Time to Critical Steel Temp', result.timeToCritMin.toFixed(2), 'min'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steel-fire-thermal-estimate.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          This calculator uses a simplified 1D lumped-capacitance analytical model assuming constant effective protection conductivity and constant equivalent gas temperature. Formal structural fire resistance certification requires standardized furnace testing and approved product listings.
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-xs font-bold text-slate-700 border border-slate-200"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {!result.valid && (
        <div
          data-testid="error-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{result.errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              data-testid="mode-time"
              onClick={() => setMode('time')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border ${mode === 'time' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
            >
              Solve Heating Time
            </button>
            <button
              type="button"
              data-testid="mode-thickness"
              onClick={() => setMode('thickness')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border ${mode === 'thickness' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
            >
              Solve Thickness
            </button>
          </div>

          {[
            { id: 'hp', label: 'Heated Perimeter Hp (m)', val: hpStr, set: setHpStr },
            { id: 'area', label: 'Steel Area As (m2)', val: areaStr, set: setAreaStr },
            mode === 'time'
              ? { id: 'dp', label: 'Protection Thickness dp (mm)', val: dpStr, set: setDpStr }
              : { id: 'target-min', label: 'Target Heating Time (min)', val: targetMinStr, set: setTargetMinStr },
            { id: 'kp', label: 'Insulation Cond. kp (W/m·K)', val: kpStr, set: setKpStr },
            { id: 'rho', label: 'Steel Density rho_s (kg/m3)', val: rhoStr, set: setRhoStr },
            { id: 'cs', label: 'Steel Specific Heat c_s (J/kg·K)', val: csStr, set: setCsStr },
            { id: 't0', label: 'Initial Temp T0 (deg C)', val: t0Str, set: setT0Str },
            { id: 'tf', label: 'Equiv. Fire Temp T_f (deg C)', val: tfStr, set: setTfStr },
            { id: 'tc', label: 'Critical Steel Temp T_crit (deg C)', val: tcStr, set: setTcStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Thermal Heating Results</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  disabled={!result.valid}
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  disabled={!result.valid}
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                  Time to Critical Steel Temp
                </div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-time-min">{result.valid ? result.timeToCritMin.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">min</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Protection Layer Thickness dp
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-thickness">{result.valid ? result.effectiveDpMm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Section Factor (Hp / As)
                </div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-section-factor">{result.valid ? result.sectionFactor.toFixed(1) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">1/m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">
                  Thermal Time Constant tau
                </div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-tau">{result.valid ? result.tauSec.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Lumped thermal capacitance solution: tau = (dp * rho_s * c_s) / (kp * (Hp/As)), t_crit = -tau * ln((T_f - T_crit) / (T_f - T_0)).
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
