'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, Download, Zap, RotateCcw, Copy, Check, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

type GearType = 'spur' | 'planetary';

export default function GearRatioClient() {
  const [gearType, setGearType] = useState<GearType>('spur');
  const [inputRpmStr, setInputRpmStr] = useState('1800');
  const [inputTorqueStr, setInputTorqueStr] = useState('50');
  const [effStr, setEffStr] = useState('98');
  const [driverTeethStr, setDriverTeethStr] = useState('20');
  const [drivenTeethStr, setDrivenTeethStr] = useState('60');
  const [moduleStr, setModuleStr] = useState('2.0');
  const [sunTeethStr, setSunTeethStr] = useState('18');
  const [ringTeethStr, setRingTeethStr] = useState('54');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setGearType('spur');
    setInputRpmStr('1800');
    setInputTorqueStr('50');
    setEffStr('98');
    setDriverTeethStr('20');
    setDrivenTeethStr('60');
    setModuleStr('2.0');
    setSunTeethStr('18');
    setRingTeethStr('54');
    setCopied(false);
  };

  const result = useMemo(() => {
    const nIn = parseStrictPositive(inputRpmStr);
    const tIn = parseStrictPositive(inputTorqueStr);
    const effPct = parseStrictPositive(effStr);

    if (!Number.isFinite(nIn) || !Number.isFinite(tIn) || !Number.isFinite(effPct) || effPct > 100) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive input speed RPM, torque, and stage efficiency (0 < eta <= 100%).',
      };
    }

    const eta = effPct / 100;
    const inputPowerKw = (2 * Math.PI * nIn * tIn) / 60000;
    const outputPowerKw = inputPowerKw * eta;

    if (gearType === 'spur') {
      const z1 = parseStrictPositive(driverTeethStr);
      const z2 = parseStrictPositive(drivenTeethStr);
      const m = parseStrictPositive(moduleStr);
      if (!Number.isFinite(z1) || !Number.isFinite(z2) || !Number.isFinite(m)) {
        return { valid: false as const, errorMsg: 'Enter strictly positive driver teeth z1, driven teeth z2, and module m.' };
      }
      const ratio = z2 / z1;
      const nOut = nIn / ratio;
      const tOut = tIn * ratio * eta;
      const centerDistance = (m * (z1 + z2)) / 2;
      return {
        valid: true as const,
        gearType,
        nIn,
        tIn,
        effPct,
        ratio,
        nOut,
        tOut,
        centerDistance,
        planetTeeth: 0,
        inputPowerKw,
        outputPowerKw,
      };
    }

    const zs = parseStrictPositive(sunTeethStr);
    const zr = parseStrictPositive(ringTeethStr);
    if (!Number.isFinite(zs) || !Number.isFinite(zr)) {
      return { valid: false as const, errorMsg: 'Enter strictly positive sun gear teeth zs and ring gear teeth zr.' };
    }
    if (zr <= zs) {
      return { valid: false as const, errorMsg: 'Planetary constraint violated: internal ring teeth zr must exceed sun teeth zs (zr > zs).' };
    }

    const ratio = 1 + zr / zs;
    const nOut = nIn / ratio;
    const tOut = tIn * ratio * eta;
    const planetTeeth = (zr - zs) / 2;

    return {
      valid: true as const,
      gearType,
      nIn,
      tIn,
      effPct,
      ratio,
      nOut,
      tOut,
      centerDistance: 0,
      planetTeeth,
      inputPowerKw,
      outputPowerKw,
    };
  }, [gearType, inputRpmStr, inputTorqueStr, effStr, driverTeethStr, drivenTeethStr, moduleStr, sunTeethStr, ringTeethStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Gear Ratio & Torque Summary (${result.gearType})`,
      `Ratio i = ${result.ratio.toFixed(3)}:1`,
      `Output Speed = ${result.nOut.toFixed(2)} RPM`,
      `Output Torque = ${result.tOut.toFixed(2)} N*m (eta = ${result.effPct}%)`,
      `Input Power = ${result.inputPowerKw.toFixed(3)} kW, Output Power = ${result.outputPowerKw.toFixed(3)} kW`,
      result.gearType === 'spur'
        ? `Center Distance = ${result.centerDistance.toFixed(2)} mm`
        : `Implied Planet Gear Teeth zp = ${result.planetTeeth.toFixed(1)}`,
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
      ['Gear Architecture', result.gearType, '-'],
      ['Input Speed n_in', String(result.nIn), 'RPM'],
      ['Input Torque T_in', String(result.tIn), 'N*m'],
      ['Efficiency eta', String(result.effPct), '%'],
      ['Gear Ratio i', result.ratio.toFixed(3), ':1'],
      ['Output Speed n_out', result.nOut.toFixed(2), 'RPM'],
      ['Output Torque T_out', result.tOut.toFixed(2), 'N*m'],
      ['Input Mechanical Power', result.inputPowerKw.toFixed(3), 'kW'],
      ['Output Mechanical Power', result.outputPowerKw.toFixed(3), 'kW'],
      result.gearType === 'spur'
        ? ['Center Distance a', result.centerDistance.toFixed(2), 'mm']
        : ['Implied Planet Teeth zp = (zr-zs)/2', result.planetTeeth.toFixed(1), 'T'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-ratio-speed-torque.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-testid="mode-spur"
            onClick={() => setGearType('spur')}
            className={`px-4 py-2 rounded-xl text-xs font-black border ${
              gearType === 'spur' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            Spur Gear Pair (z2 / z1)
          </button>
          <button
            type="button"
            data-testid="mode-planetary"
            onClick={() => setGearType('planetary')}
            className={`px-4 py-2 rounded-xl text-xs font-black border ${
              gearType === 'planetary' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            Planetary Stage (Sun In, Carrier Out, Ring Fixed)
          </button>
        </div>
        <button
          type="button"
          data-testid="btn-reset"
          onClick={resetDefaults}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Gear Train Inputs</h2>
          </div>

          {gearType === 'spur' ? (
            <>
              <div>
                <label htmlFor="input-z1" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Driver Teeth z1
                </label>
                <input
                  id="input-z1"
                  data-testid="input-z1"
                  type="text"
                  inputMode="decimal"
                  value={driverTeethStr}
                  onChange={(e) => setDriverTeethStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="input-z2" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Driven Teeth z2
                </label>
                <input
                  id="input-z2"
                  data-testid="input-z2"
                  type="text"
                  inputMode="decimal"
                  value={drivenTeethStr}
                  onChange={(e) => setDrivenTeethStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="input-module" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Metric Module m (mm)
                </label>
                <input
                  id="input-module"
                  data-testid="input-module"
                  type="text"
                  inputMode="decimal"
                  value={moduleStr}
                  onChange={(e) => setModuleStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="input-sun" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Sun Gear Teeth zs
                </label>
                <input
                  id="input-sun"
                  data-testid="input-sun"
                  type="text"
                  inputMode="decimal"
                  value={sunTeethStr}
                  onChange={(e) => setSunTeethStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="input-ring" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Ring Gear Teeth zr (&gt; zs)
                </label>
                <input
                  id="input-ring"
                  data-testid="input-ring"
                  type="text"
                  inputMode="decimal"
                  value={ringTeethStr}
                  onChange={(e) => setRingTeethStr(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="input-rpm" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Input Speed n_in (RPM)
            </label>
            <input
              id="input-rpm"
              data-testid="input-rpm"
              type="text"
              inputMode="decimal"
              value={inputRpmStr}
              onChange={(e) => setInputRpmStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="input-torque" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Input Torque T_in (N*m)
            </label>
            <input
              id="input-torque"
              data-testid="input-torque"
              type="text"
              inputMode="decimal"
              value={inputTorqueStr}
              onChange={(e) => setInputTorqueStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="input-eff" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Stage Efficiency eta (%)
            </label>
            <input
              id="input-eff"
              data-testid="input-eff"
              type="text"
              inputMode="decimal"
              value={effStr}
              onChange={(e) => setEffStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Ratio, Output Speed &amp; Torque</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Gear Ratio i</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-ratio">{result.valid ? result.ratio.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">:1</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Output Speed n_out</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-rpm">{result.valid ? result.nOut.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">RPM</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Output Torque T_out</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-torque">{result.valid ? result.tOut.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">N·m</span>
                </div>
              </div>
              {gearType === 'spur' ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Center Distance a</div>
                  <div className="text-xl font-black text-slate-900">
                    <span data-testid="result-center">{result.valid ? result.centerDistance.toFixed(2) : '—'}</span>{' '}
                    <span className="text-xs text-slate-500">mm</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Implied Planet Teeth zp</div>
                  <div className="text-xl font-black text-slate-900">
                    <span data-testid="result-planet">{result.valid ? result.planetTeeth.toFixed(1) : '—'}</span>{' '}
                    <span className="text-xs text-slate-500">T</span>
                  </div>
                </div>
              )}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Input Power P_in</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-pin">{result.valid ? result.inputPowerKw.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">kW</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Output Power P_out</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-pout">{result.valid ? result.outputPowerKw.toFixed(3) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">kW</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Spur pair: i = z2/z1, a = m*(z1+z2)/2. Epicyclic planetary (sun input, carrier output, stationary ring): i = 1 + zr/zs, zp = (zr - zs)/2. Both modes compute n_out = n_in/i and T_out = T_in * i * eta.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
