'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Check, Copy, Download, Info, RotateCcw, Settings, Zap } from 'lucide-react';

type StarterType = 'dol' | 'star_delta' | 'autotransformer';
type PhaseMode = 'three' | 'single';

interface StartingPreset {
  id: string;
  label: string;
  powerKw: string;
  voltage: string;
  eff: string;
  pf: string;
  lrcRatio: string;
  phase: PhaseMode;
  starter: StarterType;
  tapRatio: string;
}

const PRESETS: StartingPreset[] = [
  {
    id: 'dol-15kw',
    label: '15 kW DOL (400V)',
    powerKw: '15',
    voltage: '400',
    eff: '0.9',
    pf: '0.85',
    lrcRatio: '6.5',
    phase: 'three',
    starter: 'dol',
    tapRatio: '0.65',
  },
  {
    id: 'star-delta-30kw',
    label: '30 kW Star-Delta',
    powerKw: '30',
    voltage: '400',
    eff: '0.92',
    pf: '0.86',
    lrcRatio: '6.5',
    phase: 'three',
    starter: 'star_delta',
    tapRatio: '0.65',
  },
  {
    id: 'auto-xfmr-65',
    label: 'Autotransformer 65%',
    powerKw: '45',
    voltage: '400',
    eff: '0.93',
    pf: '0.87',
    lrcRatio: '6.0',
    phase: 'three',
    starter: 'autotransformer',
    tapRatio: '0.65',
  },
];

const parsePos = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const fmt = (n: number | null, dec = 4) => (n === null || !Number.isFinite(n) ? '—' : n.toFixed(dec));

export default function MotorStartingCurrentCalculatorClient() {
  const [powerKwStr, setPowerKwStr] = useState('15');
  const [voltageStr, setVoltageStr] = useState('400');
  const [effStr, setEffStr] = useState('0.9');
  const [pfStr, setPfStr] = useState('0.85');
  const [lrcRatioStr, setLrcRatioStr] = useState('6.5');
  const [phase, setPhase] = useState<PhaseMode>('three');
  const [starter, setStarter] = useState<StarterType>('dol');
  const [tapRatioStr, setTapRatioStr] = useState('0.65');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: StartingPreset) => {
    setPowerKwStr(p.powerKw);
    setVoltageStr(p.voltage);
    setEffStr(p.eff);
    setPfStr(p.pf);
    setLrcRatioStr(p.lrcRatio);
    setPhase(p.phase);
    setStarter(p.starter);
    setTapRatioStr(p.tapRatio);
  };

  const calc = useMemo(() => {
    const pKw = parsePos(powerKwStr);
    const v = parsePos(voltageStr);
    const eff = parsePos(effStr);
    const pf = parsePos(pfStr);
    const k = parsePos(lrcRatioStr);
    const tap = parsePos(tapRatioStr);

    if (pKw === null || v === null || eff === null || pf === null || k === null || eff > 1 || pf > 1) {
      return { valid: false as const, error: 'Enter positive kW, voltage, and LRC ratio; efficiency and PF must be in (0, 1].' };
    }
    if (starter === 'star_delta' && phase !== 'three') {
      return { valid: false as const, error: 'Star-Delta starting applies to three-phase induction motors only.' };
    }
    if (starter === 'autotransformer' && (tap === null || tap >= 1)) {
      return { valid: false as const, error: 'Autotransformer tap ratio must be in (0, 1).' };
    }

    const factor = phase === 'three' ? Math.sqrt(3) : 1;
    const ifl = (pKw * 1000) / (factor * v * eff * pf);
    const iDol = ifl * k;
    const lineMult = starter === 'dol' ? 1 : starter === 'star_delta' ? 1 / 3 : Math.pow(tap ?? 0.65, 2);
    const iStart = iDol * lineMult;
    const startKva = (factor * v * iStart) / 1000;
    const torquePct = lineMult * 100;

    return { valid: true as const, error: '', ifl, iDol, iStart, startKva, torquePct };
  }, [powerKwStr, voltageStr, effStr, pfStr, lrcRatioStr, phase, starter, tapRatioStr]);

  const handleCopy = async () => {
    if (!calc.valid) return;
    const summary = `Starter=${starter} | I_FL=${calc.ifl.toFixed(4)} A | I_start=${calc.iStart.toFixed(4)} A | S_start=${calc.startKva.toFixed(4)} kVA | RelativeTorque=${calc.torquePct.toFixed(2)}% DOL`;
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['metric', 'value', 'unit'],
      ['starter_method', starter, 'enum'],
      ['full_load_current', calc.ifl.toFixed(4), 'A'],
      ['dol_locked_rotor_current', calc.iDol.toFixed(4), 'A'],
      ['line_starting_current', calc.iStart.toFixed(4), 'A'],
      ['starting_apparent_power', calc.startKva.toFixed(4), 'kVA'],
      ['relative_starting_torque_pct_dol', calc.torquePct.toFixed(2), '%'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motor-starting-current.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Electrical Inputs</h2>
              <p className="text-xs text-slate-500 font-medium">0 &lt; η, PF &le; 1</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="ms-kw" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Rated Shaft Power (kW)
              </label>
              <input
                id="ms-kw"
                type="text"
                inputMode="decimal"
                data-testid="input-kw"
                value={powerKwStr}
                onChange={(e) => setPowerKwStr(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="ms-v" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Line Voltage (V)
              </label>
              <input
                id="ms-v"
                type="text"
                inputMode="decimal"
                data-testid="input-voltage"
                value={voltageStr}
                onChange={(e) => setVoltageStr(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ms-eff" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Efficiency (0-1)
                </label>
                <input
                  id="ms-eff"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-eff"
                  value={effStr}
                  onChange={(e) => setEffStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="ms-pf" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Power Factor (0-1)
                </label>
                <input
                  id="ms-pf"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-pf"
                  value={pfStr}
                  onChange={(e) => setPfStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
            </div>
            <div>
              <label htmlFor="ms-k" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                LRC Multiplier (I_LR / I_FL)
              </label>
              <input
                id="ms-k"
                type="text"
                inputMode="decimal"
                data-testid="input-k"
                value={lrcRatioStr}
                onChange={(e) => setLrcRatioStr(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="ms-phase" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Phase System
              </label>
              <select
                id="ms-phase"
                data-testid="select-phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value as PhaseMode)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 cursor-pointer"
              >
                <option value="three">3-Phase AC (sqrt(3) factor)</option>
                <option value="single">1-Phase AC</option>
              </select>
            </div>
            <div>
              <label htmlFor="ms-starter" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                Starting Method
              </label>
              <select
                id="ms-starter"
                data-testid="select-starter"
                value={starter}
                onChange={(e) => setStarter(e.target.value as StarterType)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 cursor-pointer"
              >
                <option value="dol">Direct-On-Line (DOL, 1.0x)</option>
                <option value="star_delta">Star-Delta (1/3 line current &amp; torque)</option>
                <option value="autotransformer">Autotransformer (tap ratio squared)</option>
              </select>
            </div>
            {starter === 'autotransformer' && (
              <div>
                <label htmlFor="ms-tap" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Autotransformer Tap Ratio (0-1)
                </label>
                <input
                  id="ms-tap"
                  type="text"
                  inputMode="decimal"
                  data-testid="input-tap"
                  value={tapRatioStr}
                  onChange={(e) => setTapRatioStr(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Inrush &amp; Line Current Results</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? `STARTER: ${starter.replace('_', '-')}` : 'INVALID INPUT'}
              </span>
            </div>

            {!calc.valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-1">Line Starting Current (I_start)</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-istart">{fmt(calc.valid ? calc.iStart : null, 4)}</span>
                  <span className="text-base text-green-500 ml-1.5">A</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Full Load Current (I_FL)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-ifl">{fmt(calc.valid ? calc.ifl : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">A</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-bold text-orange-600 uppercase mb-1">Starting Apparent Power</div>
                <div className="text-xl font-black text-orange-800">
                  <span data-testid="result-skva">{fmt(calc.valid ? calc.startKva : null, 4)}</span>
                  <span className="text-xs text-orange-600 ml-1">kVA</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">DOL Baseline Current</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-idol">{fmt(calc.valid ? calc.iDol : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">A</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Torque vs DOL</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-torque-pct">{fmt(calc.valid ? calc.torquePct : null, 2)}</span>
                  <span className="text-xs text-slate-500 ml-1">%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-2 text-xs text-slate-600 font-medium">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                I_FL = 1000·P / (k_ph·V·η·cosφ), k_ph = sqrt(3) for 3-phase or 1 for 1-phase. I_DOL = I_FL·K. Star-delta reduces supply line current and starting torque to 1/3 of DOL; autotransformer scales line current and torque by tap².
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
