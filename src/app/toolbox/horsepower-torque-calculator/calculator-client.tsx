'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

type UnitMode = 'metric' | 'imperial';

const W_PER_MECH_HP = 745.6998715822702; // NIST SP 811: 550 ft*lbf/s
const NM_PER_LBFT = 1.3558179483314004; // 0.3048 m * 4.4482216152605 N
const STRICT_NUM_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function parseStrictPositive(raw: string): number {
  const s = raw.trim();
  if (!STRICT_NUM_RE.test(s)) return Number.NaN;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS: { id: string; label: string; mode: UnitMode; torque: string; rpm: string }[] = [
  { id: 'metric-200', label: '200 N*m @ 3000 RPM (Electric Motor)', mode: 'metric', torque: '200', rpm: '3000' },
  { id: 'imperial-350', label: '350 ft*lbf @ 4500 RPM (Automotive Engine)', mode: 'imperial', torque: '350', rpm: '4500' },
  { id: 'crossover-5252', label: '100 ft*lbf @ 5252.11 RPM (T = HP Check)', mode: 'imperial', torque: '100', rpm: '5252.1131' },
];

export default function HorsepowerTorqueCalculatorClient() {
  const [mode, setMode] = useState<UnitMode>('metric');
  const [torqueStr, setTorqueStr] = useState('200');
  const [rpmStr, setRpmStr] = useState('3000');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setMode(p.mode);
    setTorqueStr(p.torque);
    setRpmStr(p.rpm);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const tIn = parseStrictPositive(torqueStr);
    const rpm = parseStrictPositive(rpmStr);
    if (!Number.isFinite(tIn) || !Number.isFinite(rpm)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive shaft torque (> 0) and rotational speed (> 0 RPM).',
      };
    }

    const tNm = mode === 'metric' ? tIn : tIn * NM_PER_LBFT;
    const tLbft = mode === 'imperial' ? tIn : tIn / NM_PER_LBFT;
    const omega = (2 * Math.PI * rpm) / 60;
    const pWatts = tNm * omega;
    const pKw = pWatts / 1000;
    const pHpMech = pWatts / W_PER_MECH_HP;

    return {
      valid: true as const,
      tIn,
      rpm,
      tNm,
      tLbft,
      pKw,
      pHpMech,
    };
  }, [mode, torqueStr, rpmStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Shaft Power & Torque Summary (${result.tNm.toFixed(2)} N*m / ${result.tLbft.toFixed(2)} ft*lbf at ${result.rpm} RPM)`,
      `Mechanical Power = ${result.pHpMech.toFixed(3)} hp (550 ft*lbf/s)`,
      `SI Shaft Power = ${result.pKw.toFixed(3)} kW`,
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
      ['Input Mode', mode, '-'],
      ['Torque (SI)', result.tNm.toFixed(4), 'N*m'],
      ['Torque (US Customary)', result.tLbft.toFixed(4), 'ft*lbf'],
      ['Rotational Speed', String(result.rpm), 'RPM'],
      ['Mechanical Horsepower', result.pHpMech.toFixed(4), 'hp'],
      ['Kilowatts', result.pKw.toFixed(4), 'kW'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'horsepower-torque.csv';
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
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
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
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-100 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Torque Input Unit</label>
            <div className="grid grid-cols-2 gap-2">
              {(['metric', 'imperial'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  data-testid={`btn-mode-${m}`}
                  onClick={() => setMode(m)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    mode === m ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m === 'metric' ? 'SI (N*m)' : 'Imperial (ft*lbf)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Torque ({mode === 'metric' ? 'N*m' : 'ft*lbf'})
            </label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-torque"
              value={torqueStr}
              onChange={(e) => setTorqueStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Speed (RPM)</label>
            <input
              type="text"
              inputMode="decimal"
              data-testid="input-rpm"
              value={rpmStr}
              onChange={(e) => setRpmStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
            />
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
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Shaft Power Output</h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
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
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Mechanical Horsepower (550 ft*lbf/s)</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-hp">{result.valid ? result.pHpMech.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-blue-500 ml-1.5">hp</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Kilowatts</div>
                <div className="text-3xl font-black text-emerald-800">
                  <span data-testid="result-kw">{result.valid ? result.pKw.toFixed(3) : '—'}</span>
                  <span className="text-base font-bold text-emerald-600 ml-1.5">kW</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Equivalent Torque (N*m)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-tnm">{result.valid ? result.tNm.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-slate-500 ml-1">N*m</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Equivalent Torque (ft*lbf)</div>
                <div className="text-2xl font-black text-orange-800">
                  <span data-testid="result-tlbft">{result.valid ? result.tLbft.toFixed(2) : '—'}</span>
                  <span className="text-sm font-bold text-orange-500 ml-1">ft*lbf</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  P_kW = T_Nm * 2 * pi * RPM / 60000 · NIST SP 811 Appendix B8: 1 mechanical hp (550 ft*lbf/s) = 745.6999 W · HP = T_lbft * RPM / (33000 / 2pi)
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
