'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

// Exact liquid US gallon to liter: 1 gal = 231 * (0.0254 m)^3 * 1000 = 3.785411784 L -> L/s = GPM * 3.785411784 / 60
const GPM_TO_LPS = 3.785411784 / 60;

const OUTLET_TYPES = [
  { id: 'smooth', label: '0.90 (Outlet < 4 in, smooth and rounded)', c: '0.90' },
  { id: 'square', label: '0.80 (Outlet < 4 in, square and sharp)', c: '0.80' },
  { id: 'projecting', label: '0.70 (Outlet < 4 in, projecting)', c: '0.70' },
];

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

function parseStrictPosInt(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: 'Default (Ps=70, Pr=50, Pp=32 psi, d=2.5 in)', ps: '70', pr: '50', pp: '32', d: '2.5', cd: '0.90', n: '1', ptarget: '20' },
  { id: 'dual-outlet', label: 'Dual 2.5 in Outlets (N=2, Pp=25)', ps: '68', pr: '42', pp: '25', d: '2.5', cd: '0.90', n: '2', ptarget: '20' },
  { id: 'square-edge', label: 'Square Edge 2.5 in (C=0.80)', ps: '70', pr: '50', pp: '32', d: '2.5', cd: '0.80', n: '1', ptarget: '20' },
];

export default function FireHydrantFlowCalculatorClient() {
  const [psStr, setPsStr] = useState('70');
  const [prStr, setPrStr] = useState('50');
  const [ppStr, setPpStr] = useState('32');
  const [dStr, setDStr] = useState('2.5');
  const [cdStr, setCdStr] = useState('0.90');
  const [nStr, setNStr] = useState('1');
  const [ptargetStr, setPtargetStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPsStr(p.ps);
    setPrStr(p.pr);
    setPpStr(p.pp);
    setDStr(p.d);
    setCdStr(p.cd);
    setNStr(p.n);
    setPtargetStr(p.ptarget);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const Ps = parseStrictPositive(psStr);
    const Pr = parseStrictNonNegative(prStr);
    const Pp = parseStrictPositive(ppStr);
    const d = parseStrictPositive(dStr);
    const Cd = parseStrictPositive(cdStr);
    const N = parseStrictPosInt(nStr);
    const Ptarget = parseStrictNonNegative(ptargetStr);

    if (
      !Number.isFinite(Ps) ||
      !Number.isFinite(Pr) ||
      !Number.isFinite(Pp) ||
      !Number.isFinite(d) ||
      !Number.isFinite(Cd) ||
      !Number.isFinite(N) ||
      !Number.isFinite(Ptarget)
    ) {
      return { valid: false as const, errorMsg: 'Enter valid numeric inputs (Ps, Pp, d, Cd > 0; N >= 1 integer; Pr, P_target >= 0).' };
    }
    if (Ps <= Pr) {
      return { valid: false as const, errorMsg: 'Static pressure Ps must be strictly greater than residual pressure Pr during test flow.' };
    }
    if (Ps <= Ptarget) {
      return { valid: false as const, errorMsg: 'Static pressure Ps must be strictly greater than target residual pressure (default 20 psi).' };
    }

    // NFPA 291 Pitot discharge and Hazen-Williams available fire flow projection:
    // Q = 29.83 * C * d^2 * sqrt(Pp) * N
    // AFF = Q * ((Ps - Ptarget) / (Ps - Pr))^0.54
    const qTestGpm = 29.83 * Cd * d * d * Math.sqrt(Pp) * N;
    const dropTest = Ps - Pr;
    const dropTarget = Ps - Ptarget;
    const affGpm = qTestGpm * Math.pow(dropTarget / dropTest, 0.54);
    const affLps = affGpm * GPM_TO_LPS;
    const staticDropOk = dropTest >= 10;

    return {
      valid: true as const,
      Ps,
      Pr,
      Pp,
      d,
      Cd,
      N,
      Ptarget,
      qTestGpm,
      affGpm,
      affLps,
      dropTest,
      staticDropOk,
    };
  }, [psStr, prStr, ppStr, dStr, cdStr, nStr, ptargetStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `NFPA 291 Fire Hydrant Flow Test Summary`,
      `Ps=${result.Ps} psi, Pr=${result.Pr} psi, Pp=${result.Pp} psi, d=${result.d} in, C=${result.Cd}, N=${result.N}`,
      `Test Pitot Discharge Q = ${result.qTestGpm.toFixed(2)} GPM`,
      `Available Fire Flow at ${result.Ptarget} psi = ${result.affGpm.toFixed(2)} GPM (${result.affLps.toFixed(2)} L/s)`,
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
      ['Static Pressure Ps', String(result.Ps), 'psi'],
      ['Residual Pressure Pr', String(result.Pr), 'psi'],
      ['Pitot Pressure Pp', String(result.Pp), 'psi'],
      ['Nozzle Diameter d', String(result.d), 'in'],
      ['Discharge Coefficient C', String(result.Cd), '-'],
      ['Outlets Flowing N', String(result.N), '-'],
      ['Target Residual Pressure', String(result.Ptarget), 'psi'],
      ['Test Flow Rate Q', result.qTestGpm.toFixed(2), 'GPM'],
      ['Available Fire Flow AFF', result.affGpm.toFixed(2), 'GPM'],
      ['Equivalent Metric Flow', result.affLps.toFixed(2), 'L/s'],
      ['Observed Static-to-Residual Drop', result.dropTest.toFixed(2), 'psi'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fire-hydrant-flow-test.csv';
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          {[
            { id: 'ps', label: 'Static Pressure Ps (psi)', val: psStr, set: setPsStr },
            { id: 'pr', label: 'Residual Pressure Pr (psi)', val: prStr, set: setPrStr },
            { id: 'pp', label: 'Pitot Pressure Pp (psi)', val: ppStr, set: setPpStr },
            { id: 'd', label: 'Outlet Diameter d (in)', val: dStr, set: setDStr },
            { id: 'n', label: 'Outlets Flowing N', val: nStr, set: setNStr },
            { id: 'ptarget', label: 'Target Residual (psi)', val: ptargetStr, set: setPtargetStr },
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

          <div>
            <label htmlFor="select-cd" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Discharge Coeff C (Outlet &lt; 4 in)
            </label>
            <select
              id="select-cd"
              data-testid="select-cd"
              value={cdStr}
              onChange={(e) => setCdStr(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
            >
              {OUTLET_TYPES.map((o) => (
                <option key={o.id} value={o.c}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Fire Flow Results</h2>
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
                  Available Fire Flow (AFF at {result.valid ? result.Ptarget : ptargetStr} psi)
                </div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-aff-gpm">{result.valid ? result.affGpm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">GPM</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Test Pitot Discharge Q</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-qtest-gpm">{result.valid ? result.qTestGpm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">GPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Metric AFF Equivalent</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-aff-lps">{result.valid ? result.affLps.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">L/s</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Static-to-Residual Drop</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-drop">{result.valid ? result.dropTest.toFixed(1) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">psi</span>
                </div>
                <div data-testid="status-drop" className="text-xs font-bold text-slate-600 mt-0.5">
                  {result.valid
                    ? result.staticDropOk
                      ? 'Drop >= 10 psi (Reliable Test Drop)'
                      : 'Drop < 10 psi (Consider flowing additional outlet)'
                    : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                NFPA 291 Pitot and Hazen-Williams Flow Formulas: Q = 29.83 * C * d^2 * sqrt(Pp) * N; AFF = Q * ((Ps - 20) / (Ps - Pr))^0.54. Note: pumper outlets (&gt;= 4 in) require an additional friction factor adjustment not applied automatically here.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
