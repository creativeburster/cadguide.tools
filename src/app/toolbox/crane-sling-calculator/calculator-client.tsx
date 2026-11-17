'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Link2, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseIntPositive(raw: string): number {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return Number.NaN;
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 3): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CraneSlingCalculatorClient() {
  const [weightStr, setWeightStr] = useState('50');
  const [legsStr, setLegsStr] = useState('2');
  const [angleStr, setAngleStr] = useState('60');
  const [dfStr, setDfStr] = useState('5');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setWeightStr('50');
    setLegsStr('2');
    setAngleStr('60');
    setDfStr('5');
    setCopied(false);
  };

  const result = useMemo(() => {
    const W = parsePositive(weightStr);
    const legs = parseIntPositive(legsStr);
    const angleDeg = parsePositive(angleStr);
    const df = parsePositive(dfStr);

    if (
      !Number.isFinite(W) ||
      !Number.isInteger(legs) ||
      legs < 1 ||
      legs > 4 ||
      !Number.isFinite(angleDeg) ||
      angleDeg <= 0 ||
      angleDeg > 90 ||
      !Number.isFinite(df)
    ) {
      return { valid: false as const };
    }

    const rad = (angleDeg * Math.PI) / 180;
    const sinTheta = Math.sin(rad);
    const angleFactor = 1 / sinTheta;

    const verticalPerLeg = W / legs;
    const slingTension = verticalPerLeg * angleFactor; // = W / (legs * sin(theta))
    const horizontalPerLeg = angleDeg === 90 ? 0 : verticalPerLeg / Math.tan(rad);

    // Single-leg Working Load Limit (WLL) must equal or exceed calculated leg tension T
    const requiredLegWll = slingTension;
    // Minimum Breaking Load (MBL) incorporates the sling design factor (e.g. 5:1 per ASME B30.9)
    const minBreakingLoad = requiredLegWll * df;

    return {
      valid: true as const,
      W,
      legs,
      angleDeg,
      df,
      angleFactor,
      verticalPerLeg,
      horizontalPerLeg,
      slingTension,
      requiredLegWll,
      minBreakingLoad,
      shallowAngleWarning: angleDeg < 30,
      multiLegUnevenWarning: legs >= 3,
    };
  }, [weightStr, legsStr, angleStr, dfStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Sling Load=${result.W} kN, ${result.legs} legs @ ${result.angleDeg}° (AF=${result.angleFactor.toFixed(4)}): Leg Tension / Min. Single-Leg WLL=${result.slingTension.toFixed(3)} kN, Horizontal Force=${result.horizontalPerLeg.toFixed(3)} kN, MBL (DF ${result.df}:1)=${result.minBreakingLoad.toFixed(2)} kN`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
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
      ['parameter', 'value', 'unit'],
      ['load_weight', result.W.toFixed(3), 'kN'],
      ['supporting_legs', String(result.legs), '-'],
      ['horizontal_sling_angle', result.angleDeg.toFixed(1), 'deg'],
      ['angle_factor', result.angleFactor.toFixed(4), '-'],
      ['vertical_share_per_leg', result.verticalPerLeg.toFixed(3), 'kN'],
      ['horizontal_compressive_force', result.horizontalPerLeg.toFixed(3), 'kN'],
      ['sling_tension_per_leg', result.slingTension.toFixed(3), 'kN'],
      ['required_single_leg_wll', result.requiredLegWll.toFixed(3), 'kN'],
      ['design_factor', result.df.toFixed(1), ':1'],
      ['minimum_breaking_load_per_leg', result.minBreakingLoad.toFixed(2), 'kN'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crane_sling_tension.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Multi-Leg Sling Tension &amp; WLL Sizing</h2>
            <p className="text-sm font-medium text-slate-500">
              Sling Tension = (Load Weight / Supporting Legs) × (1 / sin θ)
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label htmlFor="sling-weight" className="block text-sm font-black text-slate-700 mb-1.5">
              Total Suspended Load Weight W (kN)
            </label>
            <input
              id="sling-weight"
              data-testid="input-weight"
              type="text"
              inputMode="decimal"
              value={weightStr}
              onChange={(e) => setWeightStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="sling-legs" className="block text-sm font-black text-slate-700 mb-1.5">
              Effective Supporting Sling Legs (1–4)
            </label>
            <input
              id="sling-legs"
              data-testid="input-legs"
              type="text"
              inputMode="numeric"
              value={legsStr}
              onChange={(e) => setLegsStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-1.5 mt-2">
              {['1', '2', '3', '4'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setLegsStr(n)}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    legsStr === n ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {n} {n === '1' ? 'Leg' : 'Legs'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="sling-angle" className="block text-sm font-black text-slate-700 mb-1.5">
              Horizontal Sling Angle θ (degrees, 0° &lt; θ ≤ 90°)
            </label>
            <input
              id="sling-angle"
              data-testid="input-angle"
              type="text"
              inputMode="decimal"
              value={angleStr}
              onChange={(e) => setAngleStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['90', '60', '45', '30'].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setAngleStr(deg)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    angleStr === deg ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="sling-df" className="block text-sm font-black text-slate-700 mb-1.5">
              Sling Design Factor DF (for Minimum Breaking Load)
            </label>
            <input
              id="sling-df"
              data-testid="input-df"
              type="text"
              inputMode="decimal"
              value={dfStr}
              onChange={(e) => setDfStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {!result.valid && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Enter positive load weight, integer legs (1–4), horizontal angle (0° &lt; θ ≤ 90°), and design factor.</span>
              </div>
            )}

            {result.valid && result.shallowAngleWarning && (
              <div data-testid="warning-shallow-angle" className="rounded-2xl p-4 bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>
                  Horizontal sling angle below 30° produces an Angle Factor &gt; 2.00 ({result.angleFactor.toFixed(2)}), inducing extreme leg tension and inward crushing force. Avoid rigging below 30°.
                </span>
              </div>
            )}

            {result.valid && result.multiLegUnevenWarning && (
              <div data-testid="warning-uneven-legs" className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Rigging Practice Note: For 3- or 4-leg rigid bridles without equalizing hardware, two legs commonly carry most of the load unless center-of-gravity and leg lengths are verified.
                </span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="text-xs font-black text-blue-800 uppercase tracking-wider mb-1">
                Sling Tension per Leg (= Minimum Single-Leg WLL Required)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-tension" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.slingTension, 3) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-700">kN</span>
              </div>
              <div className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `Angle Factor = ${result.angleFactor.toFixed(4)} (sin ${result.angleDeg}° = ${Math.sin((result.angleDeg * Math.PI) / 180).toFixed(4)})` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Vertical Share / Leg</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-vertical" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.verticalPerLeg, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Horizontal Force / Leg</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-horizontal" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.horizontalPerLeg, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Min. Breaking Load (MBL)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-mbl" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.minBreakingLoad, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Sling Tension &amp; WLL Distinction:</strong>{' '}
                Each supporting leg must have a Working Load Limit (WLL) at least equal to the resolved leg tension{' '}
                <code>T = (W / n) / sin(θ)</code>. Do not multiply WLL again by the Design Factor; the Design Factor (<code>MBL = WLL × DF</code>) defines the minimum breaking strength of the sling assembly.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
