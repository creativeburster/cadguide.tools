'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseAtLeastOne(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n >= 1 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'medium-sand', label: 'Medium Sand (150mm, 8m, 140kPa)', db: '150', lb: '8.0', tau: '140', fs: '2.0', strand: '150' },
  { id: 'soft-clay-short', label: 'Short Soft Clay (130mm, 3.5m, 80kPa)', db: '130', lb: '3.5', tau: '80', fs: '2.0', strand: '150' },
  { id: 'weathered-rock', label: 'Weathered Rock (150mm, 6m, 500kPa)', db: '150', lb: '6.0', tau: '500', fs: '1.5', strand: '150' },
];

const SOIL_BOND_SUGGESTIONS = [
  { id: '80', label: 'Soft Clay (80 kPa)', val: '80' },
  { id: '140', label: 'Med. Sand/Gravel (140 kPa)', val: '140' },
  { id: '220', label: 'Dense Till / Hard Clay (220 kPa)', val: '220' },
  { id: '500', label: 'Weathered Rock (500 kPa)', val: '500' },
];

export default function CalculatorClient() {
  const [dbStr, setDbStr] = useState('150');
  const [lbStr, setLbStr] = useState('8.0');
  const [tauStr, setTauStr] = useState('140');
  const [fsStr, setFsStr] = useState('2.0');
  const [strandStr, setStrandStr] = useState('150');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setDbStr(p.db);
    setLbStr(p.lb);
    setTauStr(p.tau);
    setFsStr(p.fs);
    setStrandStr(p.strand);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const db = parseStrictPositive(dbStr);
    const lb = parseStrictPositive(lbStr);
    const tau = parseStrictPositive(tauStr);
    const fs = parseAtLeastOne(fsStr);
    const strandCap = parseStrictPositive(strandStr);

    if (!Number.isFinite(db) || !Number.isFinite(lb) || !Number.isFinite(tau) || !Number.isFinite(fs) || !Number.isFinite(strandCap)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive numbers for diameter, bond length, bond stress, strand capacity, and factor of safety >= 1.0.',
      };
    }

    const perimeterM = Math.PI * (db / 1000);
    const bondAreaM2 = perimeterM * lb;
    const tUlt = bondAreaM2 * tau;
    const tAllow = tUlt / fs;
    const strands = Math.ceil(tAllow / strandCap);
    const pass = lb >= 4.0;

    return {
      valid: true as const,
      db,
      lb,
      tau,
      fs,
      strandCap,
      perimeterM,
      bondAreaM2,
      tUlt,
      tAllow,
      strands,
      pass,
      statusText: pass ? 'MIN BOND LENGTH SATISFIED' : 'WARNING: BOND LENGTH < 4.0 M',
    };
  }, [dbStr, lbStr, tauStr, fsStr, strandStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      'Ground Anchor Pullout Capacity Summary',
      `Drill Hole Diameter Db = ${result.db} mm, Bond Length Lb = ${result.lb} m`,
      `Ultimate Grout-Ground Bond Stress tau = ${result.tau} kPa, FS = ${result.fs}`,
      `Allowable Design Anchor Tension = ${result.tAllow.toFixed(1)} kN`,
      `Ultimate Pullout Resistance = ${result.tUlt.toFixed(1)} kN`,
      `Recommended Strands (${result.strandCap} kN/strand) = ${result.strands}`,
      `Bond Surface Area = ${result.bondAreaM2.toFixed(3)} m2`,
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
      ['Drill Hole Diameter Db', String(result.db), 'mm'],
      ['Grout Bond Length Lb', String(result.lb), 'm'],
      ['Ultimate Bond Stress tau_bond', String(result.tau), 'kPa'],
      ['Design Factor of Safety FS', String(result.fs), '-'],
      ['Working Capacity per Strand', String(result.strandCap), 'kN'],
      ['Bond Zone Perimeter', result.perimeterM.toFixed(4), 'm'],
      ['Bond Zone Surface Area', result.bondAreaM2.toFixed(4), 'm2'],
      ['Ultimate Pullout Resistance T_ult', result.tUlt.toFixed(4), 'kN'],
      ['Allowable Design Tension T_allow', result.tAllow.toFixed(4), 'kN'],
      ['Recommended Strands', String(result.strands), 'strands'],
      ['Bond Length Check', result.statusText, '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ground-anchor-capacity.csv';
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Cylindrical grout-ground bond zone</p>
            </div>
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

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Drill Hole Diameter D_b (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-db"
                value={dbStr}
                onChange={(e) => setDbStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Grout Bond Length L_b (m)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-lb"
                value={lbStr}
                onChange={(e) => setLbStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Ground Bond Stress tau_bond (kPa)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-tau"
                value={tauStr}
                onChange={(e) => setTauStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {SOIL_BOND_SUGGESTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    data-testid={`chip-tau-${s.id}`}
                    onClick={() => setTauStr(s.val)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      tauStr.trim() === s.val
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Design Factor of Safety (FS)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-fs"
                value={fsStr}
                onChange={(e) => setFsStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">15.2 mm Strand Working Load (kN)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-strand"
                value={strandStr}
                onChange={(e) => setStrandStr(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
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
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
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

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div
                data-testid="result-status"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                  !result.valid
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : result.pass
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {result.valid && result.pass ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{result.valid ? result.statusText : 'Awaiting Valid Inputs'}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                Allowable Design Anchor Tension (T_allow)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-tallow" className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight">
                  {result.valid ? result.tAllow.toFixed(1) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-600">kN</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ultimate Resistance</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-tult">{result.valid ? result.tUlt.toFixed(1) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">kN</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Strands</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-strands">{result.valid ? String(result.strands) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">strands</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bond Surface Area</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-area">{result.valid ? result.bondAreaM2.toFixed(3) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m2</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hole Perimeter</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-perimeter">{result.valid ? result.perimeterM.toFixed(3) : '—'}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1">m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Cylindrical Bond Pullout Model &amp; Limitations</h3>
                <p className="text-xs text-slate-500 font-medium">Uniform bond stress approximation along grout-soil interface</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 font-mono font-medium leading-relaxed break-words">
                {'T_ult = pi * (D_b / 1000) * L_b * tau_bond | T_allow = T_ult / FS | Strands = ceil(T_allow / P_strand)'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This preliminary estimate considers grout-ground skin friction over the bond length only. Final tieback anchor design must also verify tendon tensile capacity, grout-to-tendon bond, unbonded free length outside the active slip wedge, and site-specific pullout/creep acceptance tests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
