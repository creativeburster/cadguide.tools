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
  { id: 'default', label: 'Baseline FSW (45 N*m, 1200 RPM, 200 mm/min)', torque: '45', rpm: '1200', feed: '200', eta: '0.90' },
  { id: 'high-speed', label: 'High Traverse (400 mm/min)', torque: '45', rpm: '1200', feed: '400', eta: '0.90' },
  { id: 'high-torque', label: 'Heavy Gauge (85 N*m, 600 RPM)', torque: '85', rpm: '600', feed: '150', eta: '0.90' },
];

export default function FswWeldingCalculatorClient() {
  const [torqueStr, setTorqueStr] = useState('45');
  const [rpmStr, setRpmStr] = useState('1200');
  const [feedStr, setFeedStr] = useState('200');
  const [etaStr, setEtaStr] = useState('0.90');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setTorqueStr(p.torque);
    setRpmStr(p.rpm);
    setFeedStr(p.feed);
    setEtaStr(p.eta);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const torque = parseStrictPositive(torqueStr);
    const rpm = parseStrictPositive(rpmStr);
    const feed = parseStrictPositive(feedStr);
    const eta = parseStrictPositive(etaStr);

    if (!Number.isFinite(torque) || !Number.isFinite(rpm) || !Number.isFinite(feed) || !Number.isFinite(eta) || eta > 1) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive spindle torque, RPM, traverse speed, and thermal transfer efficiency (0 < eta <= 1).',
      };
    }

    const spindlePowerKw = (2 * Math.PI * rpm * torque) / 60000;
    const weldPitchMmRev = feed / rpm;
    const revPerMm = rpm / feed;
    const feedMmPerSec = feed / 60;
    const heatInputJmm = (spindlePowerKw * 1000 * eta) / feedMmPerSec;

    return {
      valid: true as const,
      torque,
      rpm,
      feed,
      eta,
      spindlePowerKw,
      weldPitchMmRev,
      revPerMm,
      heatInputJmm,
    };
  }, [torqueStr, rpmStr, feedStr, etaStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `FSW Spindle Power & Linear Heat Input Summary`,
      `Torque=${result.torque} N*m, RPM=${result.rpm}, Feed=${result.feed} mm/min, eta=${result.eta}`,
      `Spindle Mechanical Power P_mech = ${result.spindlePowerKw.toFixed(3)} kW`,
      `Weld Pitch (Advance/Rev) = ${result.weldPitchMmRev.toFixed(4)} mm/rev (${result.revPerMm.toFixed(2)} rev/mm)`,
      `Effective Linear Heat Input Q_lin = ${result.heatInputJmm.toFixed(2)} J/mm`,
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
      ['Spindle Torque M', String(result.torque), 'N*m'],
      ['Spindle Speed n', String(result.rpm), 'RPM'],
      ['Traverse Feed Rate v', String(result.feed), 'mm/min'],
      ['Thermal Transfer Efficiency eta', String(result.eta), '-'],
      ['Spindle Mechanical Power P_mech', result.spindlePowerKw.toFixed(3), 'kW'],
      ['Weld Pitch v/n', result.weldPitchMmRev.toFixed(4), 'mm/rev'],
      ['Revolution Density n/v', result.revPerMm.toFixed(2), 'rev/mm'],
      ['Linear Heat Input Q_lin', result.heatInputJmm.toFixed(2), 'J/mm'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fsw-welding-parameters.csv';
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
            <h2 className="text-lg font-black text-slate-900">FSW Spindle Inputs</h2>
          </div>

          {[
            { id: 'torque', label: 'Spindle Torque M (N*m)', val: torqueStr, set: setTorqueStr },
            { id: 'rpm', label: 'Spindle Speed n (RPM)', val: rpmStr, set: setRpmStr },
            { id: 'feed', label: 'Traverse Speed v (mm/min)', val: feedStr, set: setFeedStr },
            { id: 'eta', label: 'Heat Transfer Efficiency eta (0-1)', val: etaStr, set: setEtaStr },
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
                <h2 className="text-lg font-black text-slate-900">Power &amp; Heat Input</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">Linear Heat Input Q_lin</div>
                <div className="text-3xl font-black text-purple-900">
                  <span data-testid="result-heat">{result.valid ? result.heatInputJmm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-purple-500">J/mm</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Spindle Power P_mech</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-power">{result.valid ? result.spindlePowerKw.toFixed(3) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">kW</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Weld Pitch (Advance/Rev)</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-pitch">{result.valid ? result.weldPitchMmRev.toFixed(4) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">mm/rev</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Revolution Density (n/v)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-revs">{result.valid ? result.revPerMm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">rev/mm</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Exact mechanical power and energy conservation: P_mech = (2*pi*n*M)/60000 (kW), weld pitch = v/n (mm/rev), linear heat input Q_lin = (eta * P_mech * 1000) / (v/60) (J/mm). Requires measured or rated spindle torque from machine telemetry.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
