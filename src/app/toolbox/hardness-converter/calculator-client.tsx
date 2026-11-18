'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type Scale = 'HRC' | 'HRB' | 'HV' | 'HB' | 'HLD';

interface HardnessRow {
  hb: number | null;
  hv: number | null;
  hrc: number | null;
  hrb: number | null;
  hld: number | null;
}

// Verified comparison table extracted verbatim from Wikipedia "Hardness_comparison"
// (which cites ISO 18265 and ASTM E140 in Further reading), sorted from low to high.
const HARDNESS_TABLE: HardnessRow[] = [
  { hb: 76, hv: 80, hrc: null, hrb: 37, hld: 287 },
  { hb: 81, hv: 85, hrc: null, hrb: 41, hld: 300 },
  { hb: 90, hv: 95, hrc: null, hrb: 52, hld: 321 },
  { hb: 95, hv: 100, hrc: null, hrb: 56, hld: 331 },
  { hb: 105, hv: 110, hrc: null, hrb: 62, hld: 350 },
  { hb: 114, hv: 120, hrc: null, hrb: 67, hld: 365 },
  { hb: 130, hv: 130, hrc: null, hrb: 72, hld: 390 },
  { hb: 135, hv: 135, hrc: null, hrb: 75, hld: 389 },
  { hb: 140, hv: 141, hrc: null, hrb: 77, hld: 404 },
  { hb: 141, hv: 142, hrc: null, hrb: 78, hld: 405 },
  { hb: 143, hv: 144, hrc: null, hrb: 79, hld: 408 },
  { hb: 145, hv: 146, hrc: null, hrb: 79, hld: 411 },
  { hb: 147, hv: 147, hrc: null, hrb: 80, hld: 413 },
  { hb: 150, hv: 149, hrc: null, hrb: 81, hld: 417 },
  { hb: 152, hv: 150, hrc: null, hrb: 82, hld: 420 },
  { hb: 154, hv: 152, hrc: 1, hrb: 82, hld: 423 },
  { hb: 156, hv: 154, hrc: 2, hrb: 83, hld: 425 },
  { hb: 160, hv: 159, hrc: 3, hrb: 84, hld: 430 },
  { hb: 163, hv: 162, hrc: 4, hrb: 85, hld: 434 },
  { hb: 165, hv: 165, hrc: 5, hrb: 86, hld: 437 },
  { hb: 167, hv: 168, hrc: 6, hrb: 87, hld: 439 },
  { hb: 170, hv: 171, hrc: 7, hrb: 87, hld: 443 },
  { hb: 175, hv: 174, hrc: 9, hrb: 88, hld: 449 },
  { hb: 180, hv: 177, hrc: 10, hrb: 89, hld: 455 },
  { hb: 183, hv: 183, hrc: 11, hrb: 90, hld: 459 },
  { hb: 185, hv: 184, hrc: 12, hrb: 91, hld: 461 },
  { hb: 187, hv: 186, hrc: 13, hrb: 91, hld: 463 },
  { hb: 191, hv: 190, hrc: 14, hrb: 92, hld: 468 },
  { hb: 196, hv: 197, hrc: 15, hrb: 92, hld: 474 },
  { hb: 200, hv: 199, hrc: 16, hrb: 93, hld: 478 },
  { hb: 203, hv: 201, hrc: 17, hrb: 94, hld: 482 },
  { hb: 206, hv: 209, hrc: 18, hrb: 94, hld: 485 },
  { hb: 211, hv: 213, hrc: 19, hrb: 95, hld: 491 },
  { hb: 217, hv: 217, hrc: 20, hrb: 96, hld: 497 },
  { hb: 224, hv: 221, hrc: 21, hrb: 97, hld: 505 },
  { hb: 229, hv: 226, hrc: 22, hrb: 98, hld: 510 },
  { hb: 237, hv: 235, hrc: 23, hrb: 99, hld: 518 },
  { hb: 240, hv: 240, hrc: 23, hrb: 99, hld: 521 },
  { hb: 245, hv: 246, hrc: 24, hrb: 100, hld: 526 },
  { hb: 249, hv: 250, hrc: 25, hrb: 101, hld: 530 },
  { hb: 258, hv: 258, hrc: 27, hrb: 102, hld: 539 },
  { hb: 261, hv: 261, hrc: 28, hrb: 103, hld: 542 },
  { hb: 269, hv: 272, hrc: 29, hrb: 104, hld: 550 },
  { hb: 276, hv: 278, hrc: 30, hrb: 105, hld: 557 },
  { hb: 285, hv: 285, hrc: 31, hrb: 105, hld: 565 },
  { hb: 293, hv: 291, hrc: 32, hrb: 106, hld: 572 },
  { hb: 301, hv: 305, hrc: 33, hrb: 107, hld: 579 },
  { hb: 311, hv: 312, hrc: 34, hrb: 108, hld: 588 },
  { hb: 323, hv: 320, hrc: 35, hrb: 109, hld: 599 },
  { hb: 331, hv: 335, hrc: 36, hrb: 109, hld: 605 },
  { hb: 341, hv: 344, hrc: 37, hrb: 110, hld: 613 },
  { hb: 346, hv: 352, hrc: 37, hrb: 110, hld: 617 },
  { hb: 351, hv: 361, hrc: 38, hrb: 111, hld: 622 },
  { hb: 362, hv: 380, hrc: 39, hrb: 111, hld: 630 },
  { hb: 370, hv: 385, hrc: 40, hrb: 112, hld: 635 },
  { hb: 375, hv: 390, hrc: 41, hrb: 113, hld: 640 },
  { hb: 388, hv: 401, hrc: 42, hrb: 114, hld: 650 },
  { hb: 401, hv: 423, hrc: 43, hrb: 114, hld: 660 },
  { hb: 415, hv: 435, hrc: 44, hrb: 115, hld: 669 },
  { hb: 427, hv: 460, hrc: 45, hrb: 115, hld: 677 },
  { hb: 444, hv: 474, hrc: 46, hrb: 116, hld: 688 },
  { hb: 451, hv: 489, hrc: 47, hrb: 117, hld: 693 },
  { hb: 461, hv: 502, hrc: 48, hrb: 117, hld: 699 },
  { hb: 477, hv: 534, hrc: 49, hrb: 118, hld: 709 },
  { hb: 495, hv: 551, hrc: 51, hrb: 119, hld: 719 },
  { hb: 502, hv: 565, hrc: 52, hrb: 119, hld: 724 },
  { hb: 514, hv: 587, hrc: 53, hrb: 120, hld: 731 },
  { hb: 529, hv: 606, hrc: 54, hrb: null, hld: 739 },
  { hb: 545, hv: 639, hrc: 55, hrb: null, hld: 748 },
  { hb: 552, hv: 649, hrc: 56, hrb: null, hld: 751 },
  { hb: 576, hv: 694, hrc: 57, hrb: null, hld: 763 },
  { hb: 590, hv: 727, hrc: 59, hrb: null, hld: 770 },
  { hb: 601, hv: 746, hrc: 60, hrb: null, hld: 776 },
  { hb: 614, hv: 775, hrc: 61, hrb: null, hld: 782 },
  { hb: 626, hv: 803, hrc: 62, hrb: null, hld: 787 },
  { hb: 652, hv: 867, hrc: 63, hrb: null, hld: 799 },
  { hb: 668, hv: 905, hrc: 64, hrb: null, hld: 806 },
  { hb: 682, hv: 940, hrc: 65, hrb: null, hld: 812 },
  { hb: 712, hv: 1021, hrc: 66, hrb: null, hld: 824 },
  { hb: 725, hv: 1060, hrc: 67, hrb: null, hld: 829 },
  { hb: 745, hv: 1114, hrc: 68, hrb: null, hld: 837 },
  { hb: 760, hv: 1210, hrc: 70, hrb: null, hld: 843 },
  { hb: 780, hv: 1220, hrc: 71, hrb: null, hld: 850 },
  { hb: 800, hv: null, hrc: 72, hrb: null, hld: 856 },
];

const SCALE_KEY: Record<Scale, keyof HardnessRow> = {
  HRC: 'hrc',
  HRB: 'hrb',
  HV: 'hv',
  HB: 'hb',
  HLD: 'hld',
};

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictFinite(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

interface AggRow {
  x: number;
  hb: number | null;
  hv: number | null;
  hrc: number | null;
  hrb: number | null;
  hld: number | null;
}

function meanNullable(vals: (number | null)[]): number | null {
  if (vals.some((v) => v === null)) return null;
  const sum = vals.reduce<number>((acc, v) => acc + (v ?? 0), 0);
  return sum / vals.length;
}

function buildSortedSeries(scale: Scale): AggRow[] {
  const key = SCALE_KEY[scale];
  const validRows = HARDNESS_TABLE.filter((r) => r[key] !== null)
    .map((r) => ({ ...r, x: r[key] as number }))
    .sort((a, b) => a.x - b.x);

  const grouped: AggRow[] = [];
  for (const row of validRows) {
    const last = grouped[grouped.length - 1];
    if (last && last.x === row.x) {
      // Collect duplicates via temporary bucket logic below
      grouped.push(row);
    } else {
      grouped.push(row);
    }
  }

  // Collapse identical x keys cleanly so x is strictly increasing (no 0/0 division)
  const merged: AggRow[] = [];
  let i = 0;
  while (i < validRows.length) {
    let j = i + 1;
    while (j < validRows.length && validRows[j].x === validRows[i].x) j++;
    const slice = validRows.slice(i, j);
    merged.push({
      x: slice[0].x,
      hb: meanNullable(slice.map((s) => s.hb)),
      hv: meanNullable(slice.map((s) => s.hv)),
      hrc: meanNullable(slice.map((s) => s.hrc)),
      hrb: meanNullable(slice.map((s) => s.hrb)),
      hld: meanNullable(slice.map((s) => s.hld)),
    });
    i = j;
  }
  return merged;
}

function interpolateScale(series: AggRow[], x: number, target: keyof HardnessRow): number | null {
  if (series.length === 0 || x < series[0].x || x > series[series.length - 1].x) {
    return null;
  }
  for (let i = 0; i < series.length; i++) {
    if (Math.abs(x - series[i].x) < 1e-12) {
      return series[i][target];
    }
    if (i < series.length - 1 && x > series[i].x && x < series[i + 1].x) {
      const y0 = series[i][target];
      const y1 = series[i + 1][target];
      if (y0 === null || y1 === null) return null;
      const t = (x - series[i].x) / (series[i + 1].x - series[i].x);
      return y0 + t * (y1 - y0);
    }
  }
  return null;
}

const PRESETS: { id: string; label: string; scale: Scale; value: string }[] = [
  { id: 'hrc45', label: '45 HRC (4140 Tool / Shaft Steel)', scale: 'HRC', value: '45' },
  { id: 'hrc60', label: '60 HRC (Hardened Tool Steel, HRB N/A)', scale: 'HRC', value: '60' },
  { id: 'hrb88', label: '88 HRB (Annealed Mild Steel)', scale: 'HRB', value: '88' },
  { id: 'hb200', label: '200 HB (Medium Carbon Steel)', scale: 'HB', value: '200' },
];

export default function HardnessConverterClient() {
  const [inputScale, setInputScale] = useState<Scale>('HRC');
  const [inputValueStr, setInputValueStr] = useState('45');
  const [copied, setCopied] = useState(false);

  const series = useMemo(() => buildSortedSeries(inputScale), [inputScale]);
  const minVal = series.length > 0 ? series[0].x : 0;
  const maxVal = series.length > 0 ? series[series.length - 1].x : 0;

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setInputScale(p.scale);
    setInputValueStr(p.value);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const val = parseStrictFinite(inputValueStr);
    if (!Number.isFinite(val)) {
      return {
        valid: false as const,
        errorMsg: `Enter a valid numeric ${inputScale} hardness value between ${minVal} and ${maxVal}.`,
      };
    }
    if (val < minVal || val > maxVal) {
      return {
        valid: false as const,
        errorMsg: `${inputScale} table range is ${minVal} to ${maxVal} (values outside the verified comparison chart are not extrapolated).`,
      };
    }

    const hrc = inputScale === 'HRC' ? val : interpolateScale(series, val, 'hrc');
    const hv = inputScale === 'HV' ? val : interpolateScale(series, val, 'hv');
    const hb = inputScale === 'HB' ? val : interpolateScale(series, val, 'hb');
    const hrb = inputScale === 'HRB' ? val : interpolateScale(series, val, 'hrb');
    const hld = inputScale === 'HLD' ? val : interpolateScale(series, val, 'hld');

    return {
      valid: true as const,
      val,
      hrc,
      hv,
      hb,
      hrb,
      hld,
    };
  }, [inputScale, inputValueStr, series, minVal, maxVal]);

  const scales: { id: Scale; name: string }[] = [
    { id: 'HRC', name: 'Rockwell C (HRC)' },
    { id: 'HV', name: 'Vickers (HV)' },
    { id: 'HB', name: 'Brinell (HB)' },
    { id: 'HRB', name: 'Rockwell B (HRB)' },
    { id: 'HLD', name: 'Leeb (HLD)' },
  ];

  const handleCopy = async () => {
    if (!result.valid) return;
    const fmt = (v: number | null) => (v === null ? 'N/A' : v.toFixed(1));
    const text = [
      'Steel Hardness Scale Conversion Summary',
      `Input: ${result.val} ${inputScale}`,
      `Rockwell C (HRC) = ${fmt(result.hrc)}`,
      `Vickers (HV 5kgf) = ${fmt(result.hv)}`,
      `Brinell (HB 3000kgf) = ${fmt(result.hb)}`,
      `Rockwell B (HRB) = ${fmt(result.hrb)}`,
      `Leeb (HLD) = ${fmt(result.hld)}`,
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
    const fmt = (v: number | null) => (v === null ? 'N/A' : v.toFixed(2));
    const rows = [
      ['Scale', 'Converted Value', 'Unit'],
      ['Input Scale', inputScale, '-'],
      ['Input Value', String(result.val), inputScale],
      ['Rockwell C (HRC)', fmt(result.hrc), 'HRC'],
      ['Vickers (HV)', fmt(result.hv), 'HV'],
      ['Brinell (HB)', fmt(result.hb), 'HB'],
      ['Rockwell B (HRB)', fmt(result.hrb), 'HRB'],
      ['Leeb (HLD)', fmt(result.hld), 'HLD'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hardness-conversion.csv';
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
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Input</h2>
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Hardness Scale</label>
            <div className="grid grid-cols-2 gap-2">
              {scales.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  data-testid={`btn-scale-${s.id.toLowerCase()}`}
                  onClick={() => setInputScale(s.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-black border transition-all cursor-pointer ${
                    inputScale === s.id
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
              Value ({inputScale}, valid {minVal}–{maxVal})
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-value"
              value={inputValueStr}
              onChange={(e) => setInputValueStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-cyan-600/5 focus:bg-white transition-all"
            />
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
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Converted Values</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 disabled:opacity-40 cursor-pointer"
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

            <div className="space-y-3">
              {[
                { key: 'hrc', label: 'Rockwell C (HRC)', value: result.valid ? result.hrc : null, unit: 'HRC', color: 'blue' },
                { key: 'hv', label: 'Vickers (HV, 5 kgf)', value: result.valid ? result.hv : null, unit: 'HV', color: 'purple' },
                { key: 'hb', label: 'Brinell (HB, 10mm / 3000 kgf)', value: result.valid ? result.hb : null, unit: 'HB', color: 'orange' },
                { key: 'hrb', label: 'Rockwell B (HRB, 1/16" / 100 kgf)', value: result.valid ? result.hrb : null, unit: 'HRB', color: 'teal' },
                { key: 'hld', label: 'Leeb Rebound (HLD)', value: result.valid ? result.hld : null, unit: 'HLD', color: 'slate' },
              ].map((r) => (
                <div
                  key={r.key}
                  className={`flex items-center justify-between rounded-2xl p-4 border ${
                    !result.valid || r.value === null
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : r.color === 'blue'
                      ? 'bg-blue-50 border-blue-100'
                      : r.color === 'purple'
                      ? 'bg-purple-50 border-purple-100'
                      : r.color === 'orange'
                      ? 'bg-orange-50 border-orange-100'
                      : r.color === 'teal'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-base sm:text-lg font-black text-slate-700">{r.label}</span>
                  <span className="text-xl font-black text-slate-900">
                    <span data-testid={`result-${r.key}`}>
                      {!result.valid || r.value === null ? '—' : r.value.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400 ml-1.5">{r.unit}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Approximate material-specific steel conversion table compiled from the public Wikipedia Hardness Comparison table (citing ISO 18265 and ASTM E140 in references). Values outside a scale&apos;s defined rows show &mdash;. In ASTM E140 / ISO 18265 practice, standard Rockwell B testing is typically used up to 100 HRB; values above 100 HRB are shown only where included in the source chart.
                </span>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
