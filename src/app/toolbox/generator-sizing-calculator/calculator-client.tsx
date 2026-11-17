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

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: '80 kW Load, 400V 3-Ph (84 kVA)', kw: '80', df: '0.70', margin: '20', pf: '0.80', vll: '400', eta: '0.92' },
  { id: '480v-large', label: '250 kW Plant, 480V 3-Ph', kw: '250', df: '0.80', margin: '15', pf: '0.85', vll: '480', eta: '0.94' },
  { id: 'compact-50', label: '50 kW Backup, PF 0.80', kw: '50', df: '0.75', margin: '25', pf: '0.80', vll: '400', eta: '0.90' },
];

export default function GeneratorSizingCalculatorClient() {
  const [kwStr, setKwStr] = useState('80');
  const [dfStr, setDfStr] = useState('0.70');
  const [marginStr, setMarginStr] = useState('20');
  const [pfStr, setPfStr] = useState('0.80');
  const [vllStr, setVllStr] = useState('400');
  const [etaStr, setEtaStr] = useState('0.92');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setKwStr(p.kw);
    setDfStr(p.df);
    setMarginStr(p.margin);
    setPfStr(p.pf);
    setVllStr(p.vll);
    setEtaStr(p.eta);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const pConn = parseStrictPositive(kwStr);
    const df = parseStrictPositive(dfStr);
    const margin = parseStrictNonNegative(marginStr);
    const pf = parseStrictPositive(pfStr);
    const vll = parseStrictPositive(vllStr);
    const eta = parseStrictPositive(etaStr);

    if (
      !Number.isFinite(pConn) ||
      !Number.isFinite(df) ||
      !Number.isFinite(margin) ||
      !Number.isFinite(pf) ||
      !Number.isFinite(vll) ||
      !Number.isFinite(eta) ||
      df > 1 ||
      pf > 1 ||
      eta > 1
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter positive load, voltage, non-negative margin %, and factors (0 < DF, PF, eta <= 1).',
      };
    }

    const pDemand = pConn * df;
    const pReq = pDemand * (1 + margin / 100);
    const sReq = pReq / pf;
    const iLine = (1000 * sReq) / (Math.sqrt(3) * vll);
    const pShaft = pReq / eta;

    return {
      valid: true as const,
      pConn,
      df,
      margin,
      pf,
      vll,
      eta,
      pDemand,
      pReq,
      sReq,
      iLine,
      pShaft,
    };
  }, [kwStr, dfStr, marginStr, pfStr, vllStr, etaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Three-Phase Generator Sizing Summary`,
      `Connected=${result.pConn} kW, DF=${result.df}, Margin=${result.margin}%, PF=${result.pf}, V_LL=${result.vll} V, eta_alt=${result.eta}`,
      `Demand Load P_demand = ${result.pDemand.toFixed(2)} kW`,
      `Required Real Power P_req = ${result.pReq.toFixed(2)} kW`,
      `Required Apparent Rating S_req = ${result.sReq.toFixed(2)} kVA`,
      `Three-Phase Line Current I_line = ${result.iLine.toFixed(2)} A`,
      `Required Prime Mover Shaft Power P_shaft = ${result.pShaft.toFixed(2)} kW`,
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
      ['Connected Real Load P_conn', String(result.pConn), 'kW'],
      ['Demand Factor DF', String(result.df), '-'],
      ['Growth & Step Margin', String(result.margin), '%'],
      ['Rated Power Factor PF', String(result.pf), '-'],
      ['Three-Phase Line Voltage V_LL', String(result.vll), 'V'],
      ['Alternator Efficiency eta_alt', String(result.eta), '-'],
      ['Net Demand Load P_demand', result.pDemand.toFixed(2), 'kW'],
      ['Required Electrical Power P_req', result.pReq.toFixed(2), 'kW'],
      ['Required Apparent Power S_req', result.sReq.toFixed(2), 'kVA'],
      ['Three-Phase Line Current I_line', result.iLine.toFixed(2), 'A'],
      ['Prime Mover Shaft Power P_shaft', result.pShaft.toFixed(2), 'kW'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generator-sizing-kva.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-yellow-50 hover:text-yellow-800 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Load &amp; Electrical Inputs</h2>
          </div>

          {[
            { id: 'kw', label: 'Connected Real Load P_conn (kW)', val: kwStr, set: setKwStr },
            { id: 'df', label: 'Demand Factor DF (0-1)', val: dfStr, set: setDfStr },
            { id: 'margin', label: 'Expansion / Step Margin (%)', val: marginStr, set: setMarginStr },
            { id: 'pf', label: 'Rated Power Factor PF (0-1)', val: pfStr, set: setPfStr },
            { id: 'vll', label: 'Three-Phase Voltage V_LL (V)', val: vllStr, set: setVllStr },
            { id: 'eta', label: 'Alternator Efficiency eta_alt (0-1)', val: etaStr, set: setEtaStr },
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
                <h2 className="text-lg font-black text-slate-900">Generator Rating &amp; Current</h2>
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
              <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                <div className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-1">Apparent Power S_req</div>
                <div className="text-2xl font-black text-yellow-950">
                  <span data-testid="result-kva">{result.valid ? result.sReq.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-yellow-700">kVA</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Required Real Power P_req</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-preq">{result.valid ? result.pReq.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">kW</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">3-Phase Line Current I_line</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-current">{result.valid ? result.iLine.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">A</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Demand Load P_demand</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-pdemand">{result.valid ? result.pDemand.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">kW</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 sm:col-span-2 lg:col-span-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Prime Mover Mechanical Power P_shaft</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-shaft">{result.valid ? result.pShaft.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">kW</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Three-phase AC power sizing: P_demand = P_conn * DF, P_req = P_demand * (1 + margin/100), S_req = P_req / PF (kVA), I_line = 1000 * S_req / (sqrt(3) * V_LL), P_shaft = P_req / eta_alt. Evaluate transient locked-rotor kVA for large motor starting separately per manufacturer step-load curves.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
