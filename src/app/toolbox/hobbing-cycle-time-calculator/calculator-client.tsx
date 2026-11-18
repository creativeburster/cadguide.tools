'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const STRICT_INT_RE = /^[+-]?\d+$/;

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

function parseStrictIntAtLeast(raw: string, minVal: number): number {
  const s = raw.trim();
  if (!STRICT_INT_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n >= minVal ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'single-start', label: 'z=40, b=30mm, 1-start, 200 RPM, 1.5 mm/rev, 2 passes', z: '40', width: '30', app: '10', starts: '1', speed: '200', feed: '1.5', passes: '2' },
  { id: 'double-start', label: 'z=50, b=40mm, 2-start hob, 250 RPM, 1.2 mm/rev, 1 pass', z: '50', width: '40', app: '12', starts: '2', speed: '250', feed: '1.2', passes: '1' },
  { id: 'coarse-pinion', label: 'z=18, b=60mm, 1-start, 150 RPM, 1.0 mm/rev, 2 passes', z: '18', width: '60', app: '14', starts: '1', speed: '150', feed: '1.0', passes: '2' },
];

export default function HobbingCycleTimeCalculatorClient() {
  const [zStr, setZStr] = useState('40');
  const [bStr, setBStr] = useState('30');
  const [appStr, setAppStr] = useState('10');
  const [startsStr, setStartsStr] = useState('1');
  const [nStr, setNStr] = useState('200');
  const [faStr, setFaStr] = useState('1.5');
  const [passesStr, setPassesStr] = useState('2');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setZStr(p.z);
    setBStr(p.width);
    setAppStr(p.app);
    setStartsStr(p.starts);
    setNStr(p.speed);
    setFaStr(p.feed);
    setPassesStr(p.passes);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const z = parseStrictIntAtLeast(zStr, 4);
    const width = parseStrictPositive(bStr);
    const approach = parseStrictNonNegative(appStr);
    const starts = parseStrictIntAtLeast(startsStr, 1);
    const speed = parseStrictPositive(nStr);
    const feed = parseStrictPositive(faStr);
    const passes = parseStrictIntAtLeast(passesStr, 1);

    if (
      !Number.isFinite(z) ||
      !Number.isFinite(width) ||
      !Number.isFinite(approach) ||
      !Number.isFinite(starts) ||
      !Number.isFinite(speed) ||
      !Number.isFinite(feed) ||
      !Number.isFinite(passes)
    ) {
      return {
        valid: false as const,
        errorMsg:
          'Enter valid positive integers for teeth (z >= 4), hob starts (>= 1), passes (>= 1), and positive face width, hob RPM, feed, with approach >= 0.',
      };
    }

    const totalTravel = width + approach;
    const nw = (speed * starts) / z;
    const vf = feed * nw;
    const tPass = totalTravel / vf;
    const tTotal = passes * tPass;

    return {
      valid: true as const,
      z,
      width,
      approach,
      starts,
      speed,
      feed,
      passes,
      totalTravel,
      nw,
      vf,
      tPass,
      tTotal,
    };
  }, [zStr, bStr, appStr, startsStr, nStr, faStr, passesStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Gear Hobbing Cutting Time Summary (z=${result.z}, starts=${result.starts})`,
      `Workpiece Speed n_w = ${result.nw.toFixed(3)} RPM | Axial Feed Rate v_f = ${result.vf.toFixed(3)} mm/min`,
      `Total Axial Stroke = ${result.totalTravel.toFixed(2)} mm`,
      `Time per Pass = ${result.tPass.toFixed(3)} min`,
      `Total Cutting Time (${result.passes} passes) = ${result.tTotal.toFixed(3)} min`,
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
      ['Gear Teeth z', String(result.z), 'teeth'],
      ['Face Width b', String(result.width), 'mm'],
      ['Approach and Overtravel', String(result.approach), 'mm'],
      ['Hob Starts', String(result.starts), 'starts'],
      ['Hob Speed n', String(result.speed), 'RPM'],
      ['Axial Feed f_a', String(result.feed), 'mm/work rev'],
      ['Number of Passes', String(result.passes), 'passes'],
      ['Workpiece Speed n_w', result.nw.toFixed(4), 'RPM'],
      ['Axial Feed Rate v_f', result.vf.toFixed(4), 'mm/min'],
      ['Time per Pass', result.tPass.toFixed(4), 'min'],
      ['Total Cutting Time', result.tTotal.toFixed(4), 'min'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hobbing-cycle-time.csv';
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Gear Teeth (z)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-z"
                value={zStr}
                onChange={(e) => setZStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hob Starts (k)</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-starts"
                value={startsStr}
                onChange={(e) => setStartsStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Face Width b (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-width"
                value={bStr}
                onChange={(e) => setBStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Approach+Overtravel (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-approach"
                value={appStr}
                onChange={(e) => setAppStr(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Hob RPM</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-speed"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Feed (mm/rev)</label>
              <input
                type="text"
                inputMode="decimal"
                data-testid="input-feed"
                value={faStr}
                onChange={(e) => setFaStr(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Passes</label>
              <input
                type="text"
                inputMode="numeric"
                data-testid="input-passes"
                value={passesStr}
                onChange={(e) => setPassesStr(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all"
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
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Hobbing Cutting Time Results</h2>
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Cutting Time</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-total">{result.valid ? result.tTotal.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">min</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Time per Pass</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-pass">{result.valid ? result.tPass.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-emerald-600 ml-1.5">min</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Workpiece Speed n_w</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-nw">{result.valid ? result.nw.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">RPM</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Axial Feed Rate v_f</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-vf">{result.valid ? result.vf.toFixed(3) : '—'}</span>
                  <span className="text-sm font-bold text-orange-500 ml-1">mm/min</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  n_w = (n_hob * k_starts) / z · v_f = f_a * n_w · t_cut = passes * (b + approach) / v_f (excludes non-cutting rapid/load time)
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
