'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

interface Preset {
  label: string;
  s: string;
  m: string;
  a: string;
  r: string;
}

const PRESETS: Preset[] = [
  { label: 'DD Sign-Off (200 total, 90% resolved)', s: '50', m: '120', a: '30', r: '180' },
  { label: 'Early SD Coordination (500 total, 45% resolved)', s: '150', m: '250', a: '100', r: '225' },
  { label: 'IFC Issue for Construction (80 total, 100% resolved)', s: '20', m: '45', a: '15', r: '80' },
];

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits: number): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BimClashCountCalculatorClient() {
  const [sStr, setSStr] = useState('50');
  const [mStr, setMStr] = useState('120');
  const [aStr, setAStr] = useState('30');
  const [rStr, setRStr] = useState('180');

  const result = useMemo(() => {
    const s = parseNum(sStr);
    const m = parseNum(mStr);
    const a = parseNum(aStr);
    const r = parseNum(rStr);

    if (
      !Number.isFinite(s) ||
      !Number.isFinite(m) ||
      !Number.isFinite(a) ||
      !Number.isFinite(r) ||
      s < 0 ||
      m < 0 ||
      a < 0 ||
      r < 0
    ) {
      return { total: NaN, rate: NaN, critical: NaN };
    }

    const total = s + m + a;
    if (total <= 0 || r > total) {
      return { total: NaN, rate: NaN, critical: NaN };
    }

    const rate = (r / total) * 100;
    const critical = total - r;
    return { total, rate, critical };
  }, [sStr, mStr, aStr, rStr]);

  const applyPreset = (p: Preset) => {
    setSStr(p.s);
    setMStr(p.m);
    setAStr(p.a);
    setRStr(p.r);
  };

  const handleReset = () => {
    setSStr('50');
    setMStr('120');
    setAStr('30');
    setRStr('180');
  };

  const exportCsv = () => {
    const headers = [
      'Structural_Clashes',
      'MEP_Clashes',
      'Arch_Clashes',
      'Resolved_Clashes',
      'Total_Clashes',
      'Resolution_Rate_pct',
      'Critical_Remaining',
    ];
    const row = [
      sStr.trim(),
      mStr.trim(),
      aStr.trim(),
      rStr.trim(),
      formatFixed(result.total, 0),
      formatFixed(result.rate, 2),
      formatFixed(result.critical, 0),
    ];
    const csvContent = `${headers.join(',')}\n${row.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bim-clash-metrics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Coordination Stage Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${i}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="bim-structural-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Structural Clashes
            </label>
            <input
              id="bim-structural-input"
              data-testid="input-structural"
              type="text"
              value={sStr}
              onChange={(e) => setSStr(e.target.value)}
              placeholder="50"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bim-mep-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              MEP Clashes
            </label>
            <input
              id="bim-mep-input"
              data-testid="input-mep"
              type="text"
              value={mStr}
              onChange={(e) => setMStr(e.target.value)}
              placeholder="120"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bim-arch-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Arch Clashes
            </label>
            <input
              id="bim-arch-input"
              data-testid="input-arch"
              type="text"
              value={aStr}
              onChange={(e) => setAStr(e.target.value)}
              placeholder="30"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bim-resolved-input"
              className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2"
            >
              Resolved
            </label>
            <input
              id="bim-resolved-input"
              data-testid="input-resolved"
              type="text"
              value={rStr}
              onChange={(e) => setRStr(e.target.value)}
              placeholder="180"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            data-testid="reset-btn"
            onClick={handleReset}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Coordination Clash Metrics
                </h2>
              </div>

              <button
                type="button"
                data-testid="export-csv-btn"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-400 uppercase tracking-wider mb-2">
                  Total Clashes
                </div>
                <div data-testid="result-total" className="text-3xl font-black text-blue-700">
                  {formatFixed(result.total, 0)}
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-sm font-black text-green-400 uppercase tracking-wider mb-2">
                  Resolution Rate
                </div>
                <div data-testid="result-rate" className="text-3xl font-black text-green-700">
                  {formatFixed(result.rate, 2)}
                  <span className="text-lg text-green-400"> %</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-400 uppercase tracking-wider mb-2">
                  Critical Remaining
                </div>
                <div data-testid="result-critical" className="text-3xl font-black text-orange-700">
                  {formatFixed(result.critical, 0)}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  BIM Coordination Clash Accounting Definition:{' '}
                  <code>Total = Structural + MEP + Arch</code>,{' '}
                  <code>Resolution Rate = (Resolved / Total) × 100%</code>,{' '}
                  <code>Critical Remaining = Total - Resolved</code> (valid when{' '}
                  <code>0 ≤ Resolved ≤ Total</code> and <code>Total &gt; 0</code>).
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
