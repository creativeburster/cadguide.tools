'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

type CapUnit = 'pF' | 'nF' | 'uF' | 'mF';
type FreqUnit = 'Hz' | 'kHz' | 'MHz';
type ResUnit = 'ohm' | 'kohm';

const CAP_TO_FARAD: Record<CapUnit, number> = {
  pF: 1e-12,
  nF: 1e-9,
  uF: 1e-6,
  mF: 1e-3,
};

const CAP_UNIT_LABELS: Record<CapUnit, string> = {
  pF: 'pF (10⁻¹² F)',
  nF: 'nF (10⁻⁹ F)',
  uF: 'μF (10⁻⁶ F)',
  mF: 'mF (10⁻³ F)',
};

const FREQ_TO_HZ: Record<FreqUnit, number> = {
  Hz: 1,
  kHz: 1e3,
  MHz: 1e6,
};

const RES_TO_OHM: Record<ResUnit, number> = {
  ohm: 1,
  kohm: 1e3,
};

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const val = Number(trimmed);
  return Number.isFinite(val) ? val : NaN;
}

export default function CapacitorReactanceCalculatorClient() {
  const [capStr, setCapStr] = useState<string>('100');
  const [capUnit, setCapUnit] = useState<CapUnit>('uF');
  const [freqStr, setFreqStr] = useState<string>('50');
  const [freqUnit, setFreqUnit] = useState<FreqUnit>('Hz');
  const [resStr, setResStr] = useState<string>('1000');
  const [resUnit, setResUnit] = useState<ResUnit>('ohm');

  const applyPreset = (preset: 'mains-50hz' | 'audio-rc-1khz' | 'motor-run-60hz') => {
    if (preset === 'mains-50hz') {
      setCapStr('100');
      setCapUnit('uF');
      setFreqStr('50');
      setFreqUnit('Hz');
      setResStr('1000');
      setResUnit('ohm');
    } else if (preset === 'audio-rc-1khz') {
      setCapStr('100');
      setCapUnit('nF');
      setFreqStr('1');
      setFreqUnit('kHz');
      setResStr('10');
      setResUnit('kohm');
    } else {
      setCapStr('10');
      setCapUnit('uF');
      setFreqStr('60');
      setFreqUnit('Hz');
      setResStr('470');
      setResUnit('ohm');
    }
  };

  const handleReset = () => {
    applyPreset('mains-50hz');
  };

  /**
   * Step-by-step SI unit conversion & RC circuit derivation:
   * 1. Convert inputs to SI base units (Farad [F], Hertz [Hz = s^-1], Ohm [ohm = V/A]):
   *    - C_F   = C_input * CAP_TO_FARAD[capUnit]   [F]
   *      (e.g., 100 uF * 10^-6 F/uF = 1.0 * 10^-4 F; 100 nF * 10^-9 F/nF = 1.0 * 10^-7 F)
   *    - f_Hz  = f_input * FREQ_TO_HZ[freqUnit]    [Hz]
   *      (e.g., 1 kHz * 10^3 Hz/kHz = 1000 Hz)
   *    - R_ohm = R_input * RES_TO_OHM[resUnit]     [ohm]
   *      (e.g., 10 kohm * 10^3 ohm/kohm = 10000 ohm)
   *
   * 2. Capacitive reactance X_C (OpenStax College Physics 2e §23.11 Eq. 23.58):
   *    X_C = 1 / (2 * pi * f_Hz * C_F)             [ohm]
   *
   * 3. RC Time Constant tau (OpenStax University Physics Vol. 2 §10.5 Eq. 10.9):
   *    tau_s  = R_ohm * C_F                        [s]
   *    tau_ms = tau_s * 1000                       [ms]
   *
   * 4. First-order RC -3 dB Cutoff Frequency f_c:
   *    f_c = 1 / (2 * pi * R_ohm * C_F)            [Hz]
   *
   * 5. Series RC Impedance Magnitude |Z|:
   *    |Z| = sqrt(R_ohm^2 + X_C^2)                 [ohm]
   */
  const calc = useMemo(() => {
    const capVal = parseStrictNumber(capStr);
    const freqVal = parseStrictNumber(freqStr);
    const resVal = parseStrictNumber(resStr);

    if (
      !Number.isFinite(capVal) ||
      !Number.isFinite(freqVal) ||
      !Number.isFinite(resVal) ||
      capVal <= 0 ||
      freqVal <= 0 ||
      resVal <= 0
    ) {
      return { isValid: false as const };
    }

    const cFarad = capVal * CAP_TO_FARAD[capUnit];
    const fHz = freqVal * FREQ_TO_HZ[freqUnit];
    const rOhm = resVal * RES_TO_OHM[resUnit];

    const xcOhm = 1 / (2 * Math.PI * fHz * cFarad);
    const tauMs = rOhm * cFarad * 1000;
    const fcHz = 1 / (2 * Math.PI * rOhm * cFarad);
    const zOhm = Math.hypot(rOhm, xcOhm);

    if (
      !Number.isFinite(xcOhm) ||
      !Number.isFinite(tauMs) ||
      !Number.isFinite(fcHz) ||
      !Number.isFinite(zOhm)
    ) {
      return { isValid: false as const };
    }

    return {
      isValid: true as const,
      capVal,
      freqVal,
      resVal,
      cFarad,
      fHz,
      rOhm,
      xcOhm,
      tauMs,
      fcHz,
      zOhm,
    };
  }, [capStr, capUnit, freqStr, freqUnit, resStr, resUnit]);

  const handleDownloadCsv = () => {
    if (!calc.isValid) return;
    const header = [
      'Capacitance_Input',
      'Capacitance_Unit',
      'Capacitance_F',
      'Frequency_Input',
      'Frequency_Unit',
      'Frequency_Hz',
      'Resistance_Input',
      'Resistance_Unit',
      'Resistance_ohm',
      'Reactance_Xc_ohm',
      'Time_Constant_ms',
      'Cutoff_Frequency_Hz',
      'Series_Impedance_Z_ohm',
    ].join(',');
    const row = [
      calc.capVal,
      capUnit,
      calc.cFarad.toExponential(6),
      calc.freqVal,
      freqUnit,
      calc.fHz.toFixed(3),
      calc.resVal,
      resUnit,
      calc.rOhm.toFixed(3),
      calc.xcOhm.toFixed(3),
      calc.tauMs.toFixed(3),
      calc.fcHz.toFixed(3),
      calc.zOhm.toFixed(3),
    ].join(',');
    const blob = new Blob([`${header}\n${row}\n`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'capacitor-reactance-rc.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:bg-white transition-all';
  const selectCls =
    'h-11 px-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">RC Circuit Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Circuit Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-mains-50hz"
                onClick={() => applyPreset('mains-50hz')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                100 μF · 50 Hz
              </button>
              <button
                type="button"
                data-testid="preset-audio-1khz"
                onClick={() => applyPreset('audio-rc-1khz')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                100 nF · 1 kHz
              </button>
              <button
                type="button"
                data-testid="preset-motor-60hz"
                onClick={() => applyPreset('motor-run-60hz')}
                className="px-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                10 μF · 60 Hz
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Capacitance C (&gt; 0)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                data-testid="input-capacitance"
                value={capStr}
                onChange={(e) => setCapStr(e.target.value)}
                className={`${inputCls} col-span-2`}
              />
              <select
                data-testid="select-cap-unit"
                value={capUnit}
                onChange={(e) => setCapUnit(e.target.value as CapUnit)}
                className={selectCls}
              >
                {(Object.keys(CAP_UNIT_LABELS) as CapUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {CAP_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              AC Frequency f (&gt; 0)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                data-testid="input-frequency"
                value={freqStr}
                onChange={(e) => setFreqStr(e.target.value)}
                className={`${inputCls} col-span-2`}
              />
              <select
                data-testid="select-freq-unit"
                value={freqUnit}
                onChange={(e) => setFreqUnit(e.target.value as FreqUnit)}
                className={selectCls}
              >
                <option value="Hz">Hz</option>
                <option value="kHz">kHz (10³ Hz)</option>
                <option value="MHz">MHz (10⁶ Hz)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Series Resistance R (&gt; 0)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                data-testid="input-resistance"
                value={resStr}
                onChange={(e) => setResStr(e.target.value)}
                className={`${inputCls} col-span-2`}
              />
              <select
                data-testid="select-res-unit"
                value={resUnit}
                onChange={(e) => setResUnit(e.target.value as ResUnit)}
                className={selectCls}
              >
                <option value="ohm">Ω (ohm)</option>
                <option value="kohm">kΩ (10³ Ω)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Reactance &amp; RC Filter Parameters
                </h2>
              </div>
              <button
                type="button"
                data-testid="btn-download-csv"
                disabled={!calc.isValid}
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Capacitive Reactance X_C
                </div>
                <div className="text-2xl font-black font-mono text-blue-700">
                  <span data-testid="out-xc">
                    {calc.isValid ? calc.xcOhm.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-blue-400">Ω</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  RC Time Constant τ
                </div>
                <div className="text-2xl font-black font-mono text-emerald-700">
                  <span data-testid="out-tau">
                    {calc.isValid ? calc.tauMs.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-emerald-500">ms</span>
                </div>
              </div>

              <div className="bg-orange-50/80 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  −3 dB Cutoff Frequency f_c
                </div>
                <div className="text-2xl font-black font-mono text-orange-700">
                  <span data-testid="out-fc">
                    {calc.isValid ? calc.fcHz.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-orange-400">Hz</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Series RC Impedance |Z|
                </div>
                <div className="text-2xl font-black font-mono text-slate-800">
                  <span data-testid="out-impedance">
                    {calc.isValid ? calc.zOhm.toFixed(3) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-slate-400">Ω</span>
                </div>
              </div>
            </div>

            {/* Equations & SI Derivation */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-yellow-600 shrink-0" />
                <span>SI Unit Conversion &amp; Circuit Equations:</span>
              </div>
              <p>
                Convert capacitance to Farads (<code>1 μF = 10⁻⁶ F</code>, <code>1 nF = 10⁻⁹ F</code>,{' '}
                <code>1 pF = 10⁻¹² F</code>, <code>1 mF = 10⁻³ F</code>), frequency to Hertz (
                <code>1 kHz = 10³ Hz</code>, <code>1 MHz = 10⁶ Hz</code>), and resistance to Ohms (
                <code>1 kΩ = 10³ Ω</code>):
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Capacitive Reactance:</strong> <code>X_C = 1 / (2π · f_Hz · C_F)</code> [Ω]
                </li>
                <li>
                  <strong>RC Time Constant:</strong> <code>τ = R_Ω · C_F</code> [s] ={' '}
                  <code>R_Ω · C_F × 1000</code> [ms]
                </li>
                <li>
                  <strong>−3 dB Cutoff Frequency:</strong> <code>f_c = 1 / (2π · R_Ω · C_F)</code> [Hz]
                </li>
                <li>
                  <strong>Series RC Impedance Magnitude:</strong> <code>|Z| = √(R_Ω² + X_C²)</code> [Ω]
                </li>
              </ul>
              <p className="text-slate-500">
                Sources: OpenStax <em>College Physics 2e</em> §23.11 (Reactance, Inductive and Capacitive, Eq. 23.58)
                and OpenStax <em>University Physics Vol. 2</em> §10.5 (RC Circuits, Eq. 10.9).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
