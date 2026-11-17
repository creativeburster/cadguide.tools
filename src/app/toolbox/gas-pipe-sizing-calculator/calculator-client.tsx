'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const CFH_TO_M3H = 0.028316846592;

const PIPE_PRESETS = [
  { id: 'half', label: '1/2" Sch 40 (0.622 in)', dia: '0.622' },
  { id: 'three-quarter', label: '3/4" Sch 40 (0.824 in)', dia: '0.824' },
  { id: 'one', label: '1" Sch 40 (1.049 in)', dia: '1.049' },
  { id: 'one-quarter', label: '1-1/4" Sch 40 (1.380 in)', dia: '1.380' },
  { id: 'one-half', label: '1-1/2" Sch 40 (1.610 in)', dia: '1.610' },
  { id: 'two', label: '2" Sch 40 (2.067 in)', dia: '2.067' },
];

export default function GasPipeSizingCalculatorClient() {
  const [diaStr, setDiaStr] = useState('0.622');
  const [dropStr, setDropStr] = useState('0.3');
  const [lenStr, setLenStr] = useState('60');
  const [sgStr, setSgStr] = useState('0.60');
  const [reqStr, setReqStr] = useState('30');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setDiaStr('0.622');
    setDropStr('0.3');
    setLenStr('60');
    setSgStr('0.60');
    setReqStr('30');
    setCopied(false);
  };

  const result = useMemo(() => {
    const d = parseStrictPositive(diaStr);
    const h = parseStrictPositive(dropStr);
    const l = parseStrictPositive(lenStr);
    const sg = parseStrictPositive(sgStr);
    const req = parseStrictPositive(reqStr);

    if (!Number.isFinite(d) || !Number.isFinite(h) || !Number.isFinite(l) || !Number.isFinite(sg) || !Number.isFinite(req)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive values for inside pipe diameter, pressure drop, equivalent length, specific gravity, and demand flow.',
      };
    }

    const kFactor = Math.sqrt(Math.pow(d, 5) / (1 + 3.6 / d + 0.03 * d));
    const capacityCfh = 3550 * kFactor * Math.sqrt(h / (l * sg));
    const capacityM3h = capacityCfh * CFH_TO_M3H;
    const utilizationPct = (req / capacityCfh) * 100;
    const isAdequate = capacityCfh >= req;

    return {
      valid: true as const,
      d,
      h,
      l,
      sg,
      req,
      kFactor,
      capacityCfh,
      capacityM3h,
      utilizationPct,
      isAdequate,
    };
  }, [diaStr, dropStr, lenStr, sgStr, reqStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Low-Pressure Natural Gas Pipe Sizing (Spitzglass)`,
      `ID d=${result.d} in, Drop h=${result.h} in.w.c., Length L=${result.l} ft, SG=${result.sg}, Demand=${result.req} cfh`,
      `Spitzglass Geometric Factor k = ${result.kFactor.toFixed(4)}`,
      `Allowable Pipe Flow Capacity q = ${result.capacityCfh.toFixed(2)} cfh (${result.capacityM3h.toFixed(3)} m3/h)`,
      `Capacity Utilization = ${result.utilizationPct.toFixed(2)}% (${result.isAdequate ? 'ADEQUATE' : 'UNDERSIZED'})`,
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
      ['Pipe Inside Diameter d', String(result.d), 'in'],
      ['Allowable Pressure Drop h', String(result.h), 'in.w.c.'],
      ['Equivalent Pipe Length L', String(result.l), 'ft'],
      ['Gas Specific Gravity SG', String(result.sg), '-'],
      ['Required Demand Flow q_req', String(result.req), 'cfh'],
      ['Spitzglass Constant k', result.kFactor.toFixed(4), '-'],
      ['Calculated Flow Capacity q_cap', result.capacityCfh.toFixed(2), 'cfh'],
      ['Metric Flow Capacity q_m3h', result.capacityM3h.toFixed(3), 'm3/h'],
      ['Capacity Utilization', result.utilizationPct.toFixed(2), '%'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spitzglass-gas-pipe-sizing.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PIPE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => {
              setDiaStr(p.dia);
              setCopied(false);
            }}
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
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Piping Parameters</h2>
          </div>

          {[
            { id: 'dia', label: 'Actual Inside Diameter d (in)', val: diaStr, set: setDiaStr },
            { id: 'drop', label: 'Allowable Pressure Drop h (in. w.c.)', val: dropStr, set: setDropStr },
            { id: 'len', label: 'Equivalent Length L (ft)', val: lenStr, set: setLenStr },
            { id: 'sg', label: 'Gas Specific Gravity SG (air = 1.0)', val: sgStr, set: setSgStr },
            { id: 'req', label: 'Target Appliance Demand (cfh)', val: reqStr, set: setReqStr },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={`input-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                {f.label}
              </label>
              <input
                id={`input-${f.id}`}
                data-testid={`input-${f.id}`}
                type="text"
                inputMode="decimal"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
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
                <div>
                  <h2 className="text-lg font-black text-slate-900">Spitzglass Low-Pressure Capacity</h2>
                  <p className="text-xs font-bold text-slate-500">
                    Sizing Check:{' '}
                    <span
                      data-testid="result-status"
                      className={result.valid ? (result.isAdequate ? 'text-emerald-700' : 'text-red-700') : 'text-slate-500'}
                    >
                      {result.valid ? (result.isAdequate ? 'ADEQUATE CAPACITY' : 'UNDERSIZED FOR DEMAND') : '—'}
                    </span>
                  </p>
                </div>
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
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Allowable Flow Capacity q_cap</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-cfh">{result.valid ? result.capacityCfh.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">cfh</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Metric Equivalent Flow</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-m3h">{result.valid ? result.capacityM3h.toFixed(3) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">m3/h</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Spitzglass Geometric Factor k</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-k">{result.valid ? result.kFactor.toFixed(4) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">-</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Demand Utilization</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-util">{result.valid ? result.utilizationPct.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Low-pressure (&lt;= 1 psig) Spitzglass equation: k = sqrt(d^5 / (1 + 3.6/d + 0.03*d)), q = 3550 * k * sqrt(h / (L * SG)) in cfh. Source:{' '}
                <a
                  href="https://www.engineeringtoolbox.com/natural-gas-pipe-calculator-d_1042.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-700 underline font-semibold"
                >
                  Engineering ToolBox (Natural Gas Pipe Sizing)
                </a>
                . Verify local fuel gas jurisdiction codes before final pipe selection.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
