'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Lightbulb, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const E24_BASE = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91];

function nextE24(targetOhms: number): number {
  if (targetOhms <= 0) return 10;
  let dec = 1;
  while (targetOhms / dec >= 100) dec *= 10;
  while (targetOhms / dec < 10) dec /= 10;
  const norm = targetOhms / dec;
  for (const b of E24_BASE) {
    if (b + 1e-9 >= norm) return Number((b * dec).toPrecision(4));
  }
  return Number((10 * dec * 10).toPrecision(4));
}

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INT_RE = /^\d+$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function parsePosInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 1 ? v : null;
}

export default function LedResistorCalculatorClient() {
  const [vsStr, setVsStr] = useState('12');
  const [vfStr, setVfStr] = useState('2.1');
  const [countStr, setCountStr] = useState('3');
  const [currentMaStr, setCurrentMaStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const vs = parsePos(vsStr);
  const vf = parsePos(vfStr);
  const count = parsePosInt(countStr);
  const currentMa = parsePos(currentMaStr);

  const vDrop = vs !== null && vf !== null && count !== null ? vs - count * vf : null;
  const isValid = vs !== null && vf !== null && count !== null && currentMa !== null && vDrop !== null && vDrop > 0;

  let exactOhms: number | null = null;
  let stdE24: number | null = null;
  let resistorMw: number | null = null;
  let totalMw: number | null = null;

  if (isValid && vs !== null && currentMa !== null && vDrop !== null) {
    exactOhms = vDrop / (currentMa / 1000);
    stdE24 = nextE24(exactOhms);
    resistorMw = vDrop * currentMa;
    totalMw = vs * currentMa;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (s: string, f: string, c: string, i: string) => {
    setVsStr(s);
    setVfStr(f);
    setCountStr(c);
    setCurrentMaStr(i);
  };

  const handleReset = () => applyPreset('12', '2.1', '3', '20');

  const handleCopy = async () => {
    if (!isValid || exactOhms === null || stdE24 === null || resistorMw === null || totalMw === null) return;
    const text = [
      'Series LED Current-Limiting Resistor',
      `Supply: ${vs} V, Series LEDs: ${count} x ${vf} V @ ${currentMa} mA`,
      `Exact Resistor: ${exactOhms.toFixed(2)} Ohm (Recommended E24 >=: ${stdE24} Ohm)`,
      `Resistor Power: ${resistorMw.toFixed(2)} mW, Total Circuit Power: ${totalMw.toFixed(2)} mW`,
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
    if (!isValid || exactOhms === null || stdE24 === null || resistorMw === null || totalMw === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['supply_voltage_v', String(vs), 'V'],
      ['led_vf_v', String(vf), 'V'],
      ['series_led_count', String(count), 'pcs'],
      ['target_current_ma', String(currentMa), 'mA'],
      ['exact_resistance_ohm', exactOhms.toFixed(4), 'Ohm'],
      ['recommended_e24_ohm', String(stdE24), 'Ohm'],
      ['resistor_power_mw', resistorMw.toFixed(3), 'mW'],
      ['total_power_mw', totalMw.toFixed(3), 'mW'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'led-resistor-sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">LED String Inputs</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-12v-3amber"
                onClick={() => applyPreset('12', '2.1', '3', '20')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200"
              >
                12 V Bus / 3x Amber LEDs (2.1 V, 20 mA)
              </button>
              <button
                type="button"
                data-testid="preset-5v-1blue"
                onClick={() => applyPreset('5', '3.2', '1', '15')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200"
              >
                5 V Logic / 1x Blue LED (3.2 V, 15 mA)
              </button>
              <button
                type="button"
                data-testid="preset-24v-6white"
                onClick={() => applyPreset('24', '3.1', '6', '20')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-yellow-50 text-slate-700 border border-slate-200"
              >
                24 V Panel / 6x White LEDs (3.1 V, 20 mA)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Supply Voltage Vs (V)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-vs"
                value={vsStr}
                onChange={e => setVsStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">LED Vf (V)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-vf"
                  value={vfStr}
                  onChange={e => setVfStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Series LEDs N</label>
                <input
                  type="text"
                  inputMode="numeric"
                  data-testid="input-count"
                  value={countStr}
                  onChange={e => setCountStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Forward Current I (mA)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-current"
                value={currentMaStr}
                onChange={e => setCurrentMaStr(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
              />
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Ensure Vs &gt; N x Vf, all inputs &gt; 0, and LED count N is an integer &ge; 1.</span>
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Ohm&apos;s Law Limiting Resistor</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                R = (Vs - N * Vf) / I, P_resistor = (Vs - N * Vf) * I
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-sm font-black text-yellow-700 uppercase tracking-wider mb-1">Exact Series Resistor</div>
                <div className="text-3xl font-black text-yellow-900">
                  <span data-testid="result-ohms">{fmt(exactOhms, 2)}</span>{' '}
                  <span className="text-lg text-yellow-700">Ohm</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Next Standard E24 Value</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-e24">{stdE24 !== null ? String(stdE24) : '—'}</span>{' '}
                  <span className="text-lg text-blue-600">Ohm</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-1">Resistor Dissipation</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-p-resistor">{fmt(resistorMw, 2)}</span>{' '}
                  <span className="text-lg text-emerald-600">mW</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Total Circuit Power</div>
                <div className="text-3xl font-black text-slate-900">
                  <span data-testid="result-p-total">{fmt(totalMw, 2)}</span>{' '}
                  <span className="text-lg text-slate-500">mW</span>
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
