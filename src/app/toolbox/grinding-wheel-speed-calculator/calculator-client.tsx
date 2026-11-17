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

const PRESETS = [
  { id: 'surface-200', label: '200 mm Wheel @ 3000 RPM (31.4 m/s)', dia: '200', rpm: '3000', doc: '0.02', feed: '12000', width: '20' },
  { id: 'high-speed-45', label: '350 mm CBN @ 2500 RPM (45.8 m/s)', dia: '350', rpm: '2500', doc: '0.03', feed: '15000', width: '25' },
  { id: 'finish-pass', label: '200 mm Finish Pass (0.005 mm DOC)', dia: '200', rpm: '2400', doc: '0.005', feed: '8000', width: '15' },
];

export default function GrindingWheelSpeedCalculatorClient() {
  const [diaStr, setDiaStr] = useState('200');
  const [rpmStr, setRpmStr] = useState('3000');
  const [docStr, setDocStr] = useState('0.02');
  const [feedStr, setFeedStr] = useState('12000');
  const [widthStr, setWidthStr] = useState('20');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setDiaStr(p.dia);
    setRpmStr(p.rpm);
    setDocStr(p.doc);
    setFeedStr(p.feed);
    setWidthStr(p.width);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const ds = parseStrictPositive(diaStr);
    const n = parseStrictPositive(rpmStr);
    const ae = parseStrictPositive(docStr);
    const vw = parseStrictPositive(feedStr);
    const bd = parseStrictPositive(widthStr);

    if (!Number.isFinite(ds) || !Number.isFinite(n) || !Number.isFinite(ae) || !Number.isFinite(vw) || !Number.isFinite(bd)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive wheel diameter, spindle RPM, radial depth of cut, table feed rate, and active grinding width.',
      };
    }

    const vsMs = (Math.PI * ds * n) / 60000;
    const sfpm = (vsMs * 60) / 0.3048;
    const qwMin = ae * vw * bd;
    const qwpSec = qwMin / (60 * bd);
    const qwpMin = ae * vw;
    const vwMs = vw / 60000;
    const speedRatio = vsMs / vwMs;

    return {
      valid: true as const,
      ds,
      n,
      ae,
      vw,
      bd,
      vsMs,
      sfpm,
      qwMin,
      qwpSec,
      qwpMin,
      speedRatio,
    };
  }, [diaStr, rpmStr, docStr, feedStr, widthStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Grinding Wheel Surface Speed & Specific MRR Summary`,
      `ds=${result.ds} mm, n=${result.n} RPM, ae=${result.ae} mm, vw=${result.vw} mm/min, bd=${result.bd} mm`,
      `Wheel Surface Speed vs = ${result.vsMs.toFixed(3)} m/s (${result.sfpm.toFixed(2)} SFPM)`,
      `Volumetric MRR Qw = ${result.qwMin.toFixed(2)} mm3/min`,
      `Specific MRR Qw' = ${result.qwpSec.toFixed(3)} mm3/(mm*s) (${result.qwpMin.toFixed(2)} mm3/(mm*min))`,
      `Speed Ratio qs = vs / vw = ${result.speedRatio.toFixed(2)}`,
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
      ['Wheel Diameter ds', String(result.ds), 'mm'],
      ['Wheel Speed n', String(result.n), 'RPM'],
      ['Radial Depth of Cut ae', String(result.ae), 'mm'],
      ['Workpiece Table Feed vw', String(result.vw), 'mm/min'],
      ['Active Contact Width bd', String(result.bd), 'mm'],
      ['Wheel Peripheral Speed vs', result.vsMs.toFixed(3), 'm/s'],
      ['Surface Speed SFPM', result.sfpm.toFixed(2), 'ft/min'],
      ['Material Removal Rate Qw', result.qwMin.toFixed(2), 'mm3/min'],
      ['Specific MRR Qw_prime (per s)', result.qwpSec.toFixed(3), 'mm3/(mm*s)'],
      ['Specific MRR Qw_prime (per min)', result.qwpMin.toFixed(2), 'mm3/(mm*min)'],
      ['Grinding Speed Ratio qs = vs/vw', result.speedRatio.toFixed(2), '-'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grinding-wheel-speed-mrr.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 hover:text-purple-700 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Wheel &amp; Pass Inputs</h2>
          </div>

          {[
            { id: 'dia', label: 'Wheel Outer Diameter ds (mm)', val: diaStr, set: setDiaStr },
            { id: 'rpm', label: 'Spindle Speed n (RPM)', val: rpmStr, set: setRpmStr },
            { id: 'doc', label: 'Radial Depth of Cut ae (mm)', val: docStr, set: setDocStr },
            { id: 'feed', label: 'Workpiece Table Feed vw (mm/min)', val: feedStr, set: setFeedStr },
            { id: 'width', label: 'Active Grinding Width bd (mm)', val: widthStr, set: setWidthStr },
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
                <h2 className="text-lg font-black text-slate-900">Surface Speed &amp; Specific Removal Rate</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Wheel Surface Speed vs</div>
                <div className="text-2xl font-black text-purple-900">
                  <span data-testid="result-vs">{result.valid ? result.vsMs.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-purple-500">m/s</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Volumetric MRR Qw</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-qw">{result.valid ? result.qwMin.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm3/min</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Specific MRR Qw&apos; (per s)</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-qw-prime">{result.valid ? result.qwpSec.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">mm3/(mm·s)</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Imperial Surface Speed</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-sfpm">{result.valid ? result.sfpm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">SFPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Specific MRR Qw&apos; (per min)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-qw-prime-min">{result.valid ? result.qwpMin.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm3/(mm·min)</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Speed Ratio qs = vs / vw</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-ratio">{result.valid ? result.speedRatio.toFixed(2) : '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Kinematics: vs = (pi * ds * n) / 60000 (m/s), Qw = ae * vw * bd (mm3/min), Specific MRR per unit grinding contact width Qw&apos; = Qw / (60 * bd) = (ae * vw) / 60 (mm3/(mm*s)), Speed Ratio qs = vs / (vw / 60000). Always observe the maximum rated operating speed stamped on your grinding wheel blotter.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
