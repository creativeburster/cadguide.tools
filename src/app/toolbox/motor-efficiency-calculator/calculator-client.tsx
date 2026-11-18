'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Check, Copy, Download, ExternalLink, Info, RotateCcw, Settings, Zap } from 'lucide-react';

interface MotorEffPreset {
  id: string;
  label: string;
  pOut: string;
  pIn: string;
  freq: string;
  poles: string;
  rpm: string;
}

const PRESETS: MotorEffPreset[] = [
  { id: '50hz-4p-37kw', label: '37 kW 50Hz 4-Pole', pOut: '37', pIn: '40', freq: '50', poles: '4', rpm: '1475' },
  { id: '60hz-4p-75kw', label: '75 kW 60Hz 4-Pole', pOut: '75', pIn: '80', freq: '60', poles: '4', rpm: '1780' },
  { id: '50hz-2p-15kw', label: '15 kW 50Hz 2-Pole', pOut: '15', pIn: '16.5', freq: '50', poles: '2', rpm: '2940' },
];

const parsePos = (raw: string): number | null => {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const fmt = (n: number | null, dec = 4) => (n === null || !Number.isFinite(n) ? '—' : n.toFixed(dec));

export default function CalculatorClient() {
  const [pOutStr, setPOutStr] = useState('37');
  const [pInStr, setPInStr] = useState('40');
  const [freqStr, setFreqStr] = useState('50');
  const [polesStr, setPolesStr] = useState('4');
  const [rpmStr, setRpmStr] = useState('1475');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: MotorEffPreset) => {
    setPOutStr(p.pOut);
    setPInStr(p.pIn);
    setFreqStr(p.freq);
    setPolesStr(p.poles);
    setRpmStr(p.rpm);
  };

  const calc = useMemo(() => {
    const pOut = parsePos(pOutStr);
    const pIn = parsePos(pInStr);
    const freq = parsePos(freqStr);
    const poles = parsePos(polesStr);
    const rpm = parsePos(rpmStr);

    if (
      pOut === null ||
      pIn === null ||
      freq === null ||
      poles === null ||
      rpm === null ||
      !Number.isInteger(poles) ||
      poles < 2 ||
      poles % 2 !== 0
    ) {
      return { valid: false as const, error: 'Enter positive numbers and an even integer pole count (>= 2).' };
    }
    if (pOut >= pIn) {
      return { valid: false as const, error: 'Mechanical shaft output P_out must be less than electrical input P_in.' };
    }
    const ns = (120 * freq) / poles;
    if (rpm > ns) {
      return { valid: false as const, error: `Rotor speed (${rpm} RPM) cannot exceed synchronous speed (${ns} RPM) in motoring mode.` };
    }

    const eff = (pOut / pIn) * 100;
    const losses = pIn - pOut;
    const slip = ((ns - rpm) / ns) * 100;
    const torque = (pOut * 1000 * 60) / (2 * Math.PI * rpm);
    return { valid: true as const, error: '', eff, losses, ns, slip, torque };
  }, [pOutStr, pInStr, freqStr, polesStr, rpmStr]);

  const handleCopy = async () => {
    if (!calc.valid) return;
    const summary = `Efficiency=${calc.eff.toFixed(4)}% | Losses=${calc.losses.toFixed(4)} kW | Ns=${calc.ns.toFixed(2)} RPM | Slip=${calc.slip.toFixed(4)}% | Torque=${calc.torque.toFixed(4)} N*m`;
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!calc.valid) return;
    const rows = [
      ['metric', 'value', 'unit'],
      ['efficiency_pct', calc.eff.toFixed(4), '%'],
      ['power_losses_kw', calc.losses.toFixed(4), 'kW'],
      ['synchronous_speed_rpm', calc.ns.toFixed(2), 'RPM'],
      ['slip_pct', calc.slip.toFixed(4), '%'],
      ['shaft_torque_nm', calc.torque.toFixed(4), 'N*m'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motor-efficiency-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    { id: 'pout', label: 'Shaft Output Power P_out (kW)', val: pOutStr, set: setPOutStr },
    { id: 'pin', label: 'Electrical Input Power P_in (kW)', val: pInStr, set: setPInStr },
    { id: 'freq', label: 'Supply Frequency f (Hz)', val: freqStr, set: setFreqStr },
    { id: 'poles', label: 'Number of Poles P (even int)', val: polesStr, set: setPolesStr },
    { id: 'rpm', label: 'Measured Rotor Speed nr (RPM)', val: rpmStr, set: setRpmStr },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Motor Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">P_out &lt; P_in, nr &le; Ns</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="space-y-3.5">
            {fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={`meff-${f.id}`} className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
                  {f.label}
                </label>
                <input
                  id={`meff-${f.id}`}
                  type="text"
                  inputMode="decimal"
                  data-testid={`input-${f.id}`}
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => applyPreset(PRESETS[0])}
            className="w-full py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Performance</h2>
              </div>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  calc.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {calc.valid ? 'MOTORING VALIDATED' : 'INVALID INPUT'}
              </span>
            </div>

            {!calc.valid && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
                {calc.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-1">Operating Efficiency (η)</div>
                <div className="text-3xl font-black text-orange-800">
                  <span data-testid="result-eff">{fmt(calc.valid ? calc.eff : null, 4)}</span>
                  <span className="text-base text-orange-500 ml-1.5">%</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Total Power Losses</div>
                <div className="text-3xl font-black text-blue-800">
                  <span data-testid="result-loss">{fmt(calc.valid ? calc.losses : null, 4)}</span>
                  <span className="text-base text-blue-500 ml-1.5">kW</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Synchronous Speed (Ns)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-ns">{fmt(calc.valid ? calc.ns : null, 2)}</span>
                  <span className="text-xs text-slate-500 ml-1">RPM</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Rotor Slip (s)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-slip">{fmt(calc.valid ? calc.slip : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Shaft Torque (T)</div>
                <div className="text-xl font-black text-slate-800">
                  <span data-testid="result-torque">{fmt(calc.valid ? calc.torque : null, 4)}</span>
                  <span className="text-xs text-slate-500 ml-1">N·m</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!calc.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!calc.valid}
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2 font-medium">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  η = (P_out / P_in) × 100%; Ns = 120·f / P; slip s = (Ns − nr) / Ns; shaft torque T = 1000·P_out / (2π·nr / 60).
                </span>
              </div>
              <div className="pl-6">
                <a
                  href="https://en.wikipedia.org/wiki/Induction_motor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  <span>Reference: Induction motor synchronous speed &amp; slip</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
