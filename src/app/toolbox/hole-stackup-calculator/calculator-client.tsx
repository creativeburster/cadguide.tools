'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle, Plus, Trash2 } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictNonNegative(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

interface TolContributor {
  label: string;
  tolStr: string;
}

const DEFAULT_CONTRIBUTORS: TolContributor[] = [
  { label: 'Hole Position +/-t1', tolStr: '0.10' },
  { label: 'Mating Hole Position +/-t2', tolStr: '0.15' },
  { label: 'Hole Size Bonus / Tolerance t3', tolStr: '0.10' },
  { label: 'Pin / Datum Shift t4', tolStr: '0.05' },
];

const PRESETS: { id: string; label: string; clearance: string; items: TolContributor[] }[] = [
  {
    id: 'four-link',
    label: 'Standard 4-Contributor Assembly (C_nom=0.50 mm)',
    clearance: '0.50',
    items: DEFAULT_CONTRIBUTORS,
  },
  {
    id: 'tight-rss',
    label: 'Tight Clearance Stack (C_nom=0.30 mm, 3 Links)',
    clearance: '0.30',
    items: [
      { label: 'Housing Bore Position t1', tolStr: '0.12' },
      { label: 'Cover Bore Position t2', tolStr: '0.12' },
      { label: 'Dowel Datum Clear t3', tolStr: '0.10' },
    ],
  },
];

export default function HoleStackupCalculatorClient() {
  const [clearanceStr, setClearanceStr] = useState('0.50');
  const [items, setItems] = useState<TolContributor[]>(DEFAULT_CONTRIBUTORS);
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setClearanceStr(p.clearance);
    setItems(p.items.map((x) => ({ ...x })));
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const updateItemTol = (idx: number, val: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, tolStr: val } : it)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: `Contributor t${prev.length + 1}`, tolStr: '0.05' }]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const computeStackup = () => {
    const cNom = parseStrictNonNegative(clearanceStr);
    if (!Number.isFinite(cNom) || items.length < 1) {
      return {
        valid: false as const,
        errorMsg: 'Nominal clearance must be >= 0 mm and at least one tolerance contributor is required.',
      };
    }

    const parsedVals: number[] = [];
    for (let i = 0; i < items.length; i++) {
      const v = parseStrictNonNegative(items[i].tolStr);
      if (!Number.isFinite(v)) {
        return {
          valid: false as const,
          errorMsg: `Contributor #${i + 1} has invalid tolerance value (enter non-negative half-band >= 0 mm).`,
        };
      }
      parsedVals.push(v);
    }

    const wc = parsedVals.reduce((acc, v) => acc + v, 0);
    const rss = Math.sqrt(parsedVals.reduce((acc, v) => acc + v * v, 0));
    const minClearWC = cNom - wc;
    const minClearRSS = cNom - rss;
    const passWC = minClearWC >= 0;
    const passRSS = minClearRSS >= 0;

    return {
      valid: true as const,
      cNom,
      parsedVals,
      wc,
      rss,
      minClearWC,
      minClearRSS,
      passWC,
      passRSS,
      statusText: passWC ? 'PASS (WC >= 0)' : passRSS ? 'WARN (RSS OK, WC < 0)' : 'INTERFERENCE (RSS < 0)',
    };
  };

  const result = computeStackup();

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `1D Tolerance Stackup Summary (${items.length} contributors, C_nom = ${result.cNom.toFixed(3)} mm)`,
      `Worst-Case Stack (+/-) = ${result.wc.toFixed(4)} mm | Min Clearance WC = ${result.minClearWC.toFixed(4)} mm`,
      `RSS Stack (+/-) = ${result.rss.toFixed(4)} mm | Min Clearance RSS = ${result.minClearRSS.toFixed(4)} mm`,
      `Status = ${result.statusText}`,
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
    const rows: string[][] = [
      ['Parameter', 'Value', 'Unit'],
      ['Nominal Assembly Clearance C_nom', result.cNom.toFixed(4), 'mm'],
    ];
    items.forEach((it, idx) => {
      rows.push([it.label, result.parsedVals[idx].toFixed(4), 'mm']);
    });
    rows.push(
      ['Worst-Case Half-Stack T_WC', result.wc.toFixed(4), 'mm'],
      ['RSS Statistical Half-Stack T_RSS', result.rss.toFixed(4), 'mm'],
      ['Min Clearance (Worst-Case)', result.minClearWC.toFixed(4), 'mm'],
      ['Min Clearance (RSS)', result.minClearRSS.toFixed(4), 'mm'],
      ['Fit Status', result.statusText, '-']
    );
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hole-tolerance-stackup.csv';
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

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Nominal Clearance C_nom (mm)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-nom-clearance"
              value={clearanceStr}
              onChange={(e) => setClearanceStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Half-Band Contributors (+/- mm)</span>
              <button
                type="button"
                data-testid="btn-add-tol"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 block mb-1">{it.label}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    data-testid={`input-tol-${idx}`}
                    value={it.tolStr}
                    onChange={(e) => updateItemTol(idx, e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    data-testid={`btn-remove-${idx}`}
                    onClick={() => removeItem(idx)}
                    aria-label={`Remove ${it.label}`}
                    className="mt-5 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
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
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">1D Tolerance Stackup Results</h2>
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
                className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{result.errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Worst-Case Stack (+/- T_WC)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-wc">{result.valid ? result.wc.toFixed(4) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">RSS Statistical Stack (+/- T_RSS)</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-rss">{result.valid ? result.rss.toFixed(4) : '—'}</span>
                  <span className="text-base font-bold text-emerald-600 ml-1.5">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Min Clearance (Worst-Case)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-min-wc">{result.valid ? result.minClearWC.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">mm</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Min Clearance (RSS) &amp; Status</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-min-rss">{result.valid ? result.minClearRSS.toFixed(4) : '—'}</span>
                  <span className="text-sm font-bold text-orange-500 ml-1">mm</span>
                </div>
                <div data-testid="result-status" className="text-xs font-black text-slate-700 mt-1">
                  {result.valid ? result.statusText : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  T_WC = sum(t_i) · T_RSS = sqrt(sum(t_i^2)) · Min Clearance = C_nom - T_stack (uncorrelated normal distributions assumed for RSS)
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
