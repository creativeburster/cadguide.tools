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

type PitchMode = 'module' | 'dp' | 'cp_mm';

const PRESETS: Array<{ id: string; label: string; mode: PitchMode; val: string; teeth: string }> = [
  { id: 'm25', label: 'Module 2.5 mm, 32T', mode: 'module', val: '2.5', teeth: '32' },
  { id: 'dp8', label: 'DP 8 (1/in), 24T', mode: 'dp', val: '8', teeth: '24' },
  { id: 'cp10', label: 'Circular Pitch 10 mm, 30T', mode: 'cp_mm', val: '10', teeth: '30' },
];

export default function GearModulePitchCalculatorClient() {
  const [inputMode, setInputMode] = useState<PitchMode>('module');
  const [pitchValStr, setPitchValStr] = useState('2.5');
  const [teethStr, setTeethStr] = useState('32');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setInputMode(p.mode);
    setPitchValStr(p.val);
    setTeethStr(p.teeth);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const val = parseStrictPositive(pitchValStr);
    const z = parseStrictPositive(teethStr);

    if (!Number.isFinite(val) || !Number.isFinite(z)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive pitch input value and teeth count z.',
      };
    }

    let m = val;
    if (inputMode === 'dp') {
      m = 25.4 / val;
    } else if (inputMode === 'cp_mm') {
      m = val / Math.PI;
    }

    const dp = 25.4 / m;
    const cpMm = Math.PI * m;
    const cpIn = Math.PI / dp;
    const pitchDiaMm = m * z;
    const pitchDiaIn = pitchDiaMm / 25.4;

    return {
      valid: true as const,
      m,
      dp,
      cpMm,
      cpIn,
      z,
      pitchDiaMm,
      pitchDiaIn,
    };
  }, [inputMode, pitchValStr, teethStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Gear Module & Diametral Pitch Summary`,
      `Module m = ${result.m.toFixed(4)} mm`,
      `Diametral Pitch DP = ${result.dp.toFixed(4)} 1/in`,
      `Circular Pitch = ${result.cpMm.toFixed(4)} mm (${result.cpIn.toFixed(4)} in)`,
      `Teeth z = ${result.z}, Pitch Dia d = ${result.pitchDiaMm.toFixed(2)} mm (${result.pitchDiaIn.toFixed(4)} in)`,
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
      ['Input Mode', inputMode, '-'],
      ['Teeth Count z', String(result.z), '-'],
      ['Metric Module m', result.m.toFixed(4), 'mm'],
      ['Diametral Pitch DP', result.dp.toFixed(4), '1/in'],
      ['Circular Pitch p (mm)', result.cpMm.toFixed(4), 'mm'],
      ['Circular Pitch CP (in)', result.cpIn.toFixed(4), 'in'],
      ['Pitch Diameter d (mm)', result.pitchDiaMm.toFixed(2), 'mm'],
      ['Pitch Diameter d (in)', result.pitchDiaIn.toFixed(4), 'in'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gear-module-dp-conversion.csv';
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
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 text-xs font-bold text-slate-700 border border-slate-200"
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
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Pitch Input</h2>
          </div>

          <div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Input Parameter Mode</span>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { id: 'module', label: 'Module' },
                { id: 'dp', label: 'DP (1/in)' },
                { id: 'cp_mm', label: 'CP (mm)' },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-testid={`mode-${m.id}`}
                  onClick={() => setInputMode(m.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-black border ${
                    inputMode === m.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="input-pitch-val" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              {inputMode === 'module'
                ? 'Metric Module m (mm)'
                : inputMode === 'dp'
                ? 'Diametral Pitch DP (1/in)'
                : 'Circular Pitch p (mm)'}
            </label>
            <input
              id="input-pitch-val"
              data-testid="input-pitch-val"
              type="text"
              inputMode="decimal"
              value={pitchValStr}
              onChange={(e) => setPitchValStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="input-teeth" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Number of Teeth z
            </label>
            <input
              id="input-teeth"
              data-testid="input-teeth"
              type="text"
              inputMode="decimal"
              value={teethStr}
              onChange={(e) => setTeethStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Equivalent Pitch &amp; Diameter</h2>
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
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Metric Module m</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-module">{result.valid ? result.m.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">mm</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Diametral Pitch DP</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-dp">{result.valid ? result.dp.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">1/in</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Circular Pitch p (mm)</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-cp-mm">{result.valid ? result.cpMm.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Circular Pitch CP (in)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-cp-in">{result.valid ? result.cpIn.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">in</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Pitch Dia d (mm)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-dia-mm">{result.valid ? result.pitchDiaMm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mm</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Pitch Dia d (in)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-dia-in">{result.valid ? result.pitchDiaIn.toFixed(4) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">in</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Exact international inch definition (1 in = 25.4 mm): m = 25.4 / DP, p_mm = pi * m, CP_in = pi / DP, d_mm = m * z.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
