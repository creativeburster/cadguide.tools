'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function parseStrictPositive(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseStrictNonNegative(raw: string): number {
  const n = parseStrictFinite(raw);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'loop-75', label: '75m Insulated Loop (60C->50C, 16 W/m)', len: '75', ts: '60', tr: '50', loss: '16', rho: '983', cp: '4184', grad: '0.035' },
  { id: 'long-160', label: '160m Commercial Riser (65C->57C, 20 W/m)', len: '160', ts: '65', tr: '57', loss: '20', rho: '983', cp: '4184', grad: '0.04' },
  { id: 'tight-dt5', label: '5C Max Delta-T (80m, 14 W/m)', len: '80', ts: '60', tr: '55', loss: '14', rho: '983', cp: '4184', grad: '0.035' },
];

export default function HotWaterCirculationCalculatorClient() {
  const [lenStr, setLenStr] = useState('75');
  const [tsStr, setTsStr] = useState('60');
  const [trStr, setTrStr] = useState('50');
  const [lossStr, setLossStr] = useState('16');
  const [rhoStr, setRhoStr] = useState('983');
  const [cpStr, setCpStr] = useState('4184');
  const [gradStr, setGradStr] = useState('0.035');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setLenStr(p.len);
    setTsStr(p.ts);
    setTrStr(p.tr);
    setLossStr(p.loss);
    setRhoStr(p.rho);
    setCpStr(p.cp);
    setGradStr(p.grad);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const len = parseStrictPositive(lenStr);
    const ts = parseStrictFinite(tsStr);
    const tr = parseStrictFinite(trStr);
    const lossRate = parseStrictNonNegative(lossStr);
    const rho = parseStrictPositive(rhoStr);
    const cp = parseStrictPositive(cpStr);
    const grad = parseStrictNonNegative(gradStr);

    if (
      !Number.isFinite(len) ||
      !Number.isFinite(ts) ||
      !Number.isFinite(tr) ||
      !Number.isFinite(lossRate) ||
      !Number.isFinite(rho) ||
      !Number.isFinite(cp) ||
      !Number.isFinite(grad)
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter valid positive loop length, water density, specific heat, and non-negative heat loss/head gradient.',
      };
    }

    const dt = ts - tr;
    if (dt <= 0) {
      return {
        valid: false as const,
        errorMsg: `Supply temperature must exceed return temperature (currently Ts=${ts} C <= Tr=${tr} C).`,
      };
    }

    const qLossW = len * lossRate;
    const qLossKw = qLossW / 1000;
    const mDotKgS = qLossW / (cp * dt);
    const flowLmin = (mDotKgS / rho) * 60000;
    const flowM3h = (mDotKgS / rho) * 3600;
    const pumpHeadM = len * grad;

    return {
      valid: true as const,
      len,
      ts,
      tr,
      lossRate,
      rho,
      cp,
      grad,
      dt,
      qLossW,
      qLossKw,
      flowLmin,
      flowM3h,
      pumpHeadM,
    };
  }, [lenStr, tsStr, trStr, lossStr, rhoStr, cpStr, gradStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Hot Water Recirculation Summary (${result.len} m, dT=${result.dt.toFixed(1)} C)`,
      `Total Heat Loss = ${result.qLossKw.toFixed(3)} kW (${result.qLossW.toFixed(1)} W)`,
      `Required Flow = ${result.flowLmin.toFixed(2)} L/min (${result.flowM3h.toFixed(3)} m3/h)`,
      `Estimated Friction Head Allowance = ${result.pumpHeadM.toFixed(2)} m H2O`,
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
      ['Loop Length', String(result.len), 'm'],
      ['Supply Temp Ts', String(result.ts), 'degC'],
      ['Return Temp Tr', String(result.tr), 'degC'],
      ['Design Temp Drop dT', result.dt.toFixed(2), 'K'],
      ['Linear Pipe Heat Loss', String(result.lossRate), 'W/m'],
      ['Water Density rho', String(result.rho), 'kg/m3'],
      ['Water Specific Heat cp', String(result.cp), 'J/(kg*K)'],
      ['Total Heat Loss Q_loss', result.qLossKw.toFixed(4), 'kW'],
      ['Recirculation Flow Rate', result.flowLmin.toFixed(4), 'L/min'],
      ['Recirculation Flow Rate (m3/h)', result.flowM3h.toFixed(4), 'm3/h'],
      ['Estimated Head Loss', result.pumpHeadM.toFixed(4), 'm H2O'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hot-water-circulation.csv';
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Presets</div>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Loop Length (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-length"
                value={lenStr}
                onChange={(e) => setLenStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Heat Loss Rate (W/m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-loss"
                value={lossStr}
                onChange={(e) => setLossStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Supply Temp Ts (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-ts"
                value={tsStr}
                onChange={(e) => setTsStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Return Temp Tr (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tr"
                value={trStr}
                onChange={(e) => setTrStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">rho (kg/m3)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-rho"
                value={rhoStr}
                onChange={(e) => setRhoStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">cp (J/kgK)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-cp"
                value={cpStr}
                onChange={(e) => setCpStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Head (m/m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-grad"
                value={gradStr}
                onChange={(e) => setGradStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Circulation Pump Flow &amp; Heat Loss</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {!result.valid && (
              <div
                data-testid="validation-error"
                className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Required Recirculation Flow</div>
              <div className="text-4xl font-black text-blue-900">
                <span data-testid="result-flow">{result.valid ? result.flowLmin.toFixed(2) : '—'}</span>
                <span className="text-lg font-bold text-blue-600 ml-1.5">L/min</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Heat Loss</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-heatloss">{result.valid ? result.qLossKw.toFixed(3) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">kW</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Design Temp Drop dT</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-dt">{result.valid ? result.dt.toFixed(1) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">C</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Head Allowance</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-head">{result.valid ? result.pumpHeadM.toFixed(2) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m H2O</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  Q_loss = L * q_m · m_dot = Q_loss / (cp * (Ts - Tr)) · Flow = (m_dot / rho) * 60000 L/min (steady-state loop heat balance)
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
