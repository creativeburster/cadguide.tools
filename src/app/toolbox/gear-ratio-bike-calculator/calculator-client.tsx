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

const WHEEL_PRESETS = [
  { id: '700x25c', label: '700x25c Road (672 mm)', wheel: '672' },
  { id: '700x28c', label: '700x28c Road (678 mm)', wheel: '678' },
  { id: '29er', label: '29x2.20" MTB (734 mm)', wheel: '734' },
];

export default function GearRatioBikeCalculatorClient() {
  const [chainringStr, setChainringStr] = useState('52');
  const [cogStr, setCogStr] = useState('11');
  const [wheelStr, setWheelStr] = useState('672');
  const [crankStr, setCrankStr] = useState('172.5');
  const [cadenceStr, setCadenceStr] = useState('90');
  const [copied, setCopied] = useState(false);

  const resetDefaults = () => {
    setChainringStr('52');
    setCogStr('11');
    setWheelStr('672');
    setCrankStr('172.5');
    setCadenceStr('90');
    setCopied(false);
  };

  const result = useMemo(() => {
    const chainring = parseStrictPositive(chainringStr);
    const cog = parseStrictPositive(cogStr);
    const wheelMm = parseStrictPositive(wheelStr);
    const crankMm = parseStrictPositive(crankStr);
    const cadence = parseStrictPositive(cadenceStr);

    if (
      !Number.isFinite(chainring) ||
      !Number.isFinite(cog) ||
      !Number.isFinite(wheelMm) ||
      !Number.isFinite(crankMm) ||
      !Number.isFinite(cadence)
    ) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive chainring teeth, cog teeth, wheel rolling diameter, crank length, and cadence RPM.',
      };
    }

    const ratio = chainring / cog;
    const developmentM = ratio * Math.PI * (wheelMm / 1000);
    const gearInches = ratio * (wheelMm / 25.4);
    const gainRatio = (wheelMm / 2 / crankMm) * ratio;
    const speedKmh = developmentM * cadence * 0.06;
    const speedMph = speedKmh / 1.609344;

    return {
      valid: true as const,
      chainring,
      cog,
      wheelMm,
      crankMm,
      cadence,
      ratio,
      developmentM,
      gearInches,
      gainRatio,
      speedKmh,
      speedMph,
    };
  }, [chainringStr, cogStr, wheelStr, crankStr, cadenceStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Bicycle Drivetrain Kinematics Summary`,
      `Gearing: ${result.chainring}/${result.cog}T, Wheel=${result.wheelMm} mm, Crank=${result.crankMm} mm, Cadence=${result.cadence} RPM`,
      `Gear Ratio = ${result.ratio.toFixed(4)}:1`,
      `Rollout Development = ${result.developmentM.toFixed(3)} m/rev`,
      `Gear Inches = ${result.gearInches.toFixed(2)} in`,
      `Sheldon Gain Ratio = ${result.gainRatio.toFixed(3)}`,
      `Cruising Speed = ${result.speedKmh.toFixed(2)} km/h (${result.speedMph.toFixed(2)} mph)`,
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
      ['Chainring Teeth Nf', String(result.chainring), 'T'],
      ['Rear Cog Teeth Nr', String(result.cog), 'T'],
      ['Wheel Rolling Diameter Dw', String(result.wheelMm), 'mm'],
      ['Crank Arm Length Lc', String(result.crankMm), 'mm'],
      ['Pedaling Cadence', String(result.cadence), 'RPM'],
      ['Gear Ratio R', result.ratio.toFixed(4), ':1'],
      ['Development (Meter-Gear)', result.developmentM.toFixed(3), 'm'],
      ['Gear Inches GI', result.gearInches.toFixed(2), 'in'],
      ['Gain Ratio GR', result.gainRatio.toFixed(3), '-'],
      ['Road Speed (km/h)', result.speedKmh.toFixed(2), 'km/h'],
      ['Road Speed (mph)', result.speedMph.toFixed(2), 'mph'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bicycle-gear-ratio.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 items-center">
        {WHEEL_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`preset-${p.id}`}
            onClick={() => setWheelStr(p.wheel)}
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
            <h2 className="text-lg font-black text-slate-900">Drivetrain Inputs</h2>
          </div>

          {[
            { id: 'chainring', label: 'Chainring Teeth Nf', val: chainringStr, set: setChainringStr },
            { id: 'cog', label: 'Rear Cog Teeth Nr', val: cogStr, set: setCogStr },
            { id: 'wheel', label: 'Wheel Outer Dia Dw (mm)', val: wheelStr, set: setWheelStr },
            { id: 'crank', label: 'Crank Length Lc (mm)', val: crankStr, set: setCrankStr },
            { id: 'cadence', label: 'Pedaling Cadence (RPM)', val: cadenceStr, set: setCadenceStr },
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
                <h2 className="text-lg font-black text-slate-900">Gearing &amp; Speed Metrics</h2>
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
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Gear Ratio Nf/Nr</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-ratio">{result.valid ? result.ratio.toFixed(4) : '—'}</span>{' '}
                  <span className="text-sm text-blue-500">:1</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Road Speed (km/h)</div>
                <div className="text-2xl font-black text-emerald-900">
                  <span data-testid="result-speed-kmh">{result.valid ? result.speedKmh.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-emerald-500">km/h</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Development (Rollout)</div>
                <div className="text-2xl font-black text-orange-900">
                  <span data-testid="result-dev">{result.valid ? result.developmentM.toFixed(3) : '—'}</span>{' '}
                  <span className="text-sm text-orange-500">m</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Gear Inches</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-gear-inches">{result.valid ? result.gearInches.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">in</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Gain Ratio</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-gain">{result.valid ? result.gainRatio.toFixed(3) : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Road Speed (mph)</div>
                <div className="text-xl font-black text-slate-900">
                  <span data-testid="result-speed-mph">{result.valid ? result.speedMph.toFixed(2) : '—'}</span>{' '}
                  <span className="text-xs text-slate-500">mph</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Kinematics: Ratio R = Nf/Nr, Development M = R*pi*(Dw/1000), Gear Inches = R*(Dw/25.4), Gain Ratio = (Dw / (2*Lc))*R, Speed = M*cadence*0.06 (km/h). Default 672 mm reflects 622 mm BSD + 2*25 mm tire height.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
