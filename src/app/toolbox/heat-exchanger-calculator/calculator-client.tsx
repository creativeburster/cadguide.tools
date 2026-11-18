'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type Arrangement = 'counter' | 'parallel';

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

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS: {
  id: string;
  label: string;
  arr: Arrangement;
  thi: string;
  tho: string;
  tci: string;
  tco: string;
  mh: string;
  cp: string;
  u: string;
}[] = [
  { id: 'counter', label: 'Counterflow Water (80->50C, 20->40C, U=1000)', arr: 'counter', thi: '80', tho: '50', tci: '20', tco: '40', mh: '2', cp: '4.18', u: '1000' },
  { id: 'balanced', label: 'Balanced dT1=dT2=30C (80->50C, 20->50C)', arr: 'counter', thi: '80', tho: '50', tci: '20', tco: '50', mh: '2', cp: '4.18', u: '1000' },
  { id: 'parallel', label: 'Parallel Flow (80->55C, 20->40C)', arr: 'parallel', thi: '80', tho: '55', tci: '20', tco: '40', mh: '2', cp: '4.18', u: '1000' },
];

export default function HeatExchangerCalculatorClient() {
  const [arrangement, setArrangement] = useState<Arrangement>('counter');
  const [thiStr, setThiStr] = useState('80');
  const [thoStr, setThoStr] = useState('50');
  const [tciStr, setTciStr] = useState('20');
  const [tcoStr, setTcoStr] = useState('40');
  const [mhStr, setMhStr] = useState('2');
  const [cpStr, setCpStr] = useState('4.18');
  const [uStr, setUStr] = useState('1000');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setArrangement(p.arr);
    setThiStr(p.thi);
    setThoStr(p.tho);
    setTciStr(p.tci);
    setTcoStr(p.tco);
    setMhStr(p.mh);
    setCpStr(p.cp);
    setUStr(p.u);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const thi = parseStrictFinite(thiStr);
    const tho = parseStrictFinite(thoStr);
    const tci = parseStrictFinite(tciStr);
    const tco = parseStrictFinite(tcoStr);
    const mh = parseStrictPositive(mhStr);
    const cp = parseStrictPositive(cpStr);
    const u = parseStrictPositive(uStr);

    if (!Number.isFinite(thi) || !Number.isFinite(tho) || !Number.isFinite(tci) || !Number.isFinite(tco) || !Number.isFinite(mh) || !Number.isFinite(cp) || !Number.isFinite(u)) {
      return {
        valid: false as const,
        errorMsg: 'Enter valid temperatures and strictly positive mass flow (> 0), specific heat (> 0), and overall U (> 0).',
      };
    }

    if (thi <= tho || tco <= tci) {
      return {
        valid: false as const,
        errorMsg: 'Hot fluid must cool down (T_hot_in > T_hot_out) and cold fluid must heat up (T_cold_out > T_cold_in).',
      };
    }

    const dt1 = arrangement === 'counter' ? thi - tco : thi - tci;
    const dt2 = arrangement === 'counter' ? tho - tci : tho - tco;

    if (dt1 <= 0 || dt2 <= 0) {
      return {
        valid: false as const,
        errorMsg: `Temperature cross detected for ${arrangement} flow (dT1=${dt1.toFixed(2)} C, dT2=${dt2.toFixed(2)} C; both terminal approaches must be > 0).`,
      };
    }

    const qKw = mh * cp * (thi - tho);
    const lmtd = Math.abs(dt1 - dt2) <= 1e-9 ? dt1 : (dt1 - dt2) / Math.log(dt1 / dt2);
    const uaKwK = qKw / lmtd;
    const areaM2 = (qKw * 1000) / (u * lmtd);

    return {
      valid: true as const,
      thi,
      tho,
      tci,
      tco,
      mh,
      cp,
      u,
      dt1,
      dt2,
      qKw,
      lmtd,
      uaKwK,
      areaM2,
    };
  }, [arrangement, thiStr, thoStr, tciStr, tcoStr, mhStr, cpStr, uStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Heat Exchanger Duty & LMTD Summary (${arrangement} flow)`,
      `Hot: ${result.thi} C -> ${result.tho} C | Cold: ${result.tci} C -> ${result.tco} C`,
      `Duty Q = ${result.qKw.toFixed(2)} kW`,
      `LMTD = ${result.lmtd.toFixed(3)} C (dT1=${result.dt1.toFixed(2)} C, dT2=${result.dt2.toFixed(2)} C)`,
      `Required UA = ${result.uaKwK.toFixed(3)} kW/K | Area A (at U=${result.u} W/m2K) = ${result.areaM2.toFixed(3)} m2`,
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
      ['Flow Arrangement', arrangement, '-'],
      ['Hot Inlet Temp', String(result.thi), 'degC'],
      ['Hot Outlet Temp', String(result.tho), 'degC'],
      ['Cold Inlet Temp', String(result.tci), 'degC'],
      ['Cold Outlet Temp', String(result.tco), 'degC'],
      ['Hot Mass Flow', String(result.mh), 'kg/s'],
      ['Hot Cp', String(result.cp), 'kJ/(kg*K)'],
      ['Overall Heat Transfer Coeff U', String(result.u), 'W/(m2*K)'],
      ['Terminal dT1', result.dt1.toFixed(4), 'degC'],
      ['Terminal dT2', result.dt2.toFixed(4), 'degC'],
      ['Heat Duty Q', result.qKw.toFixed(4), 'kW'],
      ['LMTD', result.lmtd.toFixed(4), 'degC'],
      ['Required UA', result.uaKwK.toFixed(4), 'kW/K'],
      ['Required Heat Transfer Area A', result.areaM2.toFixed(4), 'm2'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heat-exchanger-lmtd.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-green-50 hover:text-green-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Flow Arrangement</label>
            <div className="grid grid-cols-2 gap-2">
              {(['counter', 'parallel'] as const).map((arr) => (
                <button
                  key={arr}
                  type="button"
                  data-testid={`btn-arr-${arr}`}
                  onClick={() => setArrangement(arr)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    arrangement === arr
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {arr === 'counter' ? 'Counterflow' : 'Parallel Flow'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hot Inlet (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-thi"
                value={thiStr}
                onChange={(e) => setThiStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hot Outlet (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tho"
                value={thoStr}
                onChange={(e) => setThoStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Cold Inlet (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tci"
                value={tciStr}
                onChange={(e) => setTciStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Cold Outlet (C)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tco"
                value={tcoStr}
                onChange={(e) => setTcoStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hot Mass Flow (kg/s)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-mh"
                value={mhStr}
                onChange={(e) => setMhStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hot Cp (kJ/kg-K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-cp"
                value={cpStr}
                onChange={(e) => setCpStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Overall Coeff U (W/m2-K)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-u"
                value={uStr}
                onChange={(e) => setUStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download"
                  onClick={handleDownloadCsv}
                  disabled={!result.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {!result.valid && (
              <div data-testid="validation-error" className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm font-bold text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Heat Duty (Q)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-q">{result.valid ? result.qKw.toFixed(2) : '—'}</span>
                  <span className="text-lg text-blue-500"> kW</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">LMTD</div>
                <div className="text-3xl font-black text-green-800">
                  <span data-testid="result-lmtd">{result.valid ? result.lmtd.toFixed(3) : '—'}</span>
                  <span className="text-lg text-green-600"> C</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Required UA</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-ua">{result.valid ? result.uaKwK.toFixed(3) : '—'}</span>
                  <span className="text-lg text-orange-500"> kW/K</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">Required Transfer Area</div>
                <div className="text-3xl font-black text-purple-800">
                  <span data-testid="result-area">{result.valid ? result.areaM2.toFixed(3) : '—'}</span>
                  <span className="text-lg text-purple-500"> m2</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{'Q = m*cp*(T_hi - T_ho) | LMTD = (dT1 - dT2)/ln(dT1/dT2) (or dT1 when dT1 == dT2) | A = Q/(U*LMTD)'}</span>
              </div>
              <p className="text-xs text-slate-500">
                Counterflow/parallel 1-pass single-phase energy balance. Multi-pass shell-and-tube configurations require an LMTD correction factor F &lt; 1.0 applied to LMTD.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
