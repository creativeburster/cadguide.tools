'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Activity, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parseNonNeg(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

export default function InductorReactanceCalculatorClient() {
  const [inductanceStr, setInductanceStr] = useState('10');
  const [frequencyStr, setFrequencyStr] = useState('1000');
  const [resistanceStr, setResistanceStr] = useState('2.5');
  const [capStr, setCapStr] = useState('100');
  const [voltageStr, setVoltageStr] = useState('12');
  const [copied, setCopied] = useState(false);

  const lMh = parsePos(inductanceStr);
  const fHz = parsePos(frequencyStr);
  const rOhm = parseNonNeg(resistanceStr);
  const cPf = parseNonNeg(capStr);
  const vRms = parseNonNeg(voltageStr);

  const isValid = lMh !== null && fHz !== null && rOhm !== null && cPf !== null && vRms !== null;

  let xlOhm: number | null = null;
  let zMagOhm: number | null = null;
  let phaseDeg: number | null = null;
  let qFactor: number | null = null;
  let tauMs: number | null = null;
  let frKhz: number | null = null;
  let currentMa: number | null = null;

  if (isValid && lMh !== null && fHz !== null && rOhm !== null && cPf !== null && vRms !== null) {
    const lHenry = lMh / 1000;
    xlOhm = 2 * Math.PI * fHz * lHenry;
    zMagOhm = Math.sqrt(rOhm * rOhm + xlOhm * xlOhm);
    phaseDeg = (Math.atan2(xlOhm, rOhm) * 180) / Math.PI;
    qFactor = rOhm > 0 ? xlOhm / rOhm : null;
    tauMs = rOhm > 0 ? (lHenry / rOhm) * 1000 : null;
    frKhz = cPf > 0 ? 1 / (2 * Math.PI * Math.sqrt(lHenry * cPf * 1e-12)) / 1000 : null;
    currentMa = zMagOhm > 0 ? (vRms / zMagOhm) * 1000 : null;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (l: string, f: string, r: string, c: string, v: string) => {
    setInductanceStr(l);
    setFrequencyStr(f);
    setResistanceStr(r);
    setCapStr(c);
    setVoltageStr(v);
  };

  const handleReset = () => applyPreset('10', '1000', '2.5', '100', '12');

  const handleCopy = async () => {
    if (!isValid || xlOhm === null || zMagOhm === null || phaseDeg === null) return;
    const text = [
      'Inductor Reactance & RL Impedance Summary',
      `L = ${lMh} mH, f = ${fHz} Hz, R_series = ${rOhm} Ohm, C_p = ${cPf} pF`,
      `Inductive Reactance X_L: ${xlOhm.toFixed(3)} Ohm`,
      `Total Impedance |Z|: ${zMagOhm.toFixed(3)} Ohm at ${phaseDeg.toFixed(2)} deg`,
      `Self-Resonant Frequency f_r: ${frKhz !== null ? frKhz.toFixed(3) + ' kHz' : 'N/A'}`,
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
    if (!isValid || xlOhm === null || zMagOhm === null || phaseDeg === null || currentMa === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['inductance_mh', String(lMh), 'mH'],
      ['frequency_hz', String(fHz), 'Hz'],
      ['series_resistance_ohm', String(rOhm), 'Ohm'],
      ['parasitic_capacitance_pf', String(cPf), 'pF'],
      ['rms_voltage', String(vRms), 'V'],
      ['inductive_reactance_xl', xlOhm.toFixed(4), 'Ohm'],
      ['impedance_magnitude', zMagOhm.toFixed(4), 'Ohm'],
      ['phase_angle_deg', phaseDeg.toFixed(3), 'deg'],
      ['quality_factor_q', qFactor !== null ? qFactor.toFixed(4) : '', 'ratio'],
      ['time_constant_tau_ms', tauMs !== null ? tauMs.toFixed(4) : '', 'ms'],
      ['self_resonant_freq_khz', frKhz !== null ? frKhz.toFixed(4) : '', 'kHz'],
      ['rms_current_ma', currentMa.toFixed(4), 'mA'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inductor-reactance-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Circuit Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-audio-choke"
                onClick={() => applyPreset('10', '1000', '2.5', '100', '12')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Audio Filter Choke (10 mH, 1 kHz, 2.5 Ohm)
              </button>
              <button
                type="button"
                data-testid="preset-buck-100uh"
                onClick={() => applyPreset('0.1', '250000', '0.05', '25', '24')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Buck Power Inductor (100 uH, 250 kHz)
              </button>
              <button
                type="button"
                data-testid="preset-ac-reactor"
                onClick={() => applyPreset('50', '60', '0.8', '200', '230')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Mains Line Reactor (50 mH, 60 Hz, 230 V)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Inductance L (mH)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-inductance"
                value={inductanceStr}
                onChange={e => setInductanceStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Frequency f (Hz)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-frequency"
                value={frequencyStr}
                onChange={e => setFrequencyStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Series Resistance R (Ohm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-resistance"
                value={resistanceStr}
                onChange={e => setResistanceStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">Parasitic Capacitance C (pF)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-capacitance"
                value={capStr}
                onChange={e => setCapStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">AC Supply V_rms (V)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-voltage"
                value={voltageStr}
                onChange={e => setVoltageStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Inductance and frequency must be &gt; 0; resistance, capacitance, and voltage must be &ge; 0.</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-yellow-50 text-yellow-800 hover:bg-yellow-100 flex items-center justify-center gap-1.5"
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">AC Impedance &amp; Resonance</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                X_L = 2*pi*f*L, |Z| = sqrt(R^2 + X_L^2), tau = L / R, f_r = 1 / (2*pi*sqrt(L*C))
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-sm font-black text-yellow-700 uppercase tracking-wider mb-1">Inductive Reactance (X_L)</div>
                <div className="text-3xl font-black text-yellow-900">
                  <span data-testid="result-xl">{fmt(xlOhm, 3)}</span>{' '}
                  <span className="text-lg text-yellow-700">Ohm</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Total Impedance |Z|</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-z">{fmt(zMagOhm, 3)}</span>{' '}
                  <span className="text-lg text-blue-600">Ohm</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  Phase angle: <span data-testid="result-phase">{fmt(phaseDeg, 2)}</span> deg
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">RL Time Constant (tau)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-tau">{fmt(tauMs, 3)}</span>{' '}
                  <span className="text-lg text-emerald-600">ms</span>
                </div>
                <div className="text-xs text-emerald-700 mt-1 font-medium">
                  Quality factor Q: <span data-testid="result-q">{fmt(qFactor, 2)}</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-sm font-black text-purple-600 uppercase tracking-wider mb-1">Self-Resonant Freq (f_r)</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-fr">{fmt(frKhz, 3)}</span>{' '}
                  <span className="text-lg text-purple-600">kHz</span>
                </div>
                <div className="text-xs text-purple-700 mt-1 font-medium">
                  RMS Current: <span data-testid="result-current">{fmt(currentMa, 2)}</span> mA
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
