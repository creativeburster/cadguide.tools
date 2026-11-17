'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, CheckCircle2, AlertTriangle, RotateCcw, Copy, Check, Download } from 'lucide-react';

// Exact 1 refrigeration ton = 3.516852842 kW; 1 US GPM = 0.003785411784 * 60 / 1000 * 1000 = 0.22712470704 m3/h
const KW_PER_RT = 3.516852842;
const M3H_PER_GPM = 0.003785411784 * 60; // 0.22712470704
const WATER_VOL_CP_KJ_L_C = 4.186; // Standard volumetric heat capacity factor used consistently with chiller-load-calculator

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function parseNonNegative(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : Number.NaN;
}

function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}

export default function CalculatorClient() {
  const [tonsStr, setTonsStr] = useState('250');
  const [hrfStr, setHrfStr] = useState('1.25');
  const [ewtStr, setEwtStr] = useState('35');
  const [lwtStr, setLwtStr] = useState('30');
  const [wbtStr, setWbtStr] = useState('26');
  const [cocStr, setCocStr] = useState('3');
  const [evapFactorStr, setEvapFactorStr] = useState('0.0008');
  const [driftPctStr, setDriftPctStr] = useState('0.02');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setTonsStr('250');
    setHrfStr('1.25');
    setEwtStr('35');
    setLwtStr('30');
    setWbtStr('26');
    setCocStr('3');
    setEvapFactorStr('0.0008');
    setDriftPctStr('0.02');
    setCopied(false);
  };

  const result = useMemo(() => {
    const tons = parsePositive(tonsStr);
    const hrf = parsePositive(hrfStr);
    const t = ewtStr.trim() === '' ? Number.NaN : Number(ewtStr.trim());
    const l = lwtStr.trim() === '' ? Number.NaN : Number(lwtStr.trim());
    const w = wbtStr.trim() === '' ? Number.NaN : Number(wbtStr.trim());
    const coc = parsePositive(cocStr);
    const evapFactorPerF = parseNonNegative(evapFactorStr);
    const driftPct = parseNonNegative(driftPctStr);

    if (
      !Number.isFinite(tons) ||
      !Number.isFinite(hrf) ||
      !Number.isFinite(t) ||
      !Number.isFinite(l) ||
      !Number.isFinite(w) ||
      !Number.isFinite(coc) ||
      coc <= 1 ||
      !Number.isFinite(evapFactorPerF) ||
      !Number.isFinite(driftPct)
    ) {
      return { valid: false as const, reason: 'invalid' as const };
    }

    const rangeC = t - l;
    const approachC = l - w;
    if (rangeC <= 0 || approachC <= 0) {
      return { valid: false as const, reason: 'thermodynamic' as const, rangeC, approachC };
    }

    const heatRejectionKw = tons * KW_PER_RT * hrf;
    const flowLs = heatRejectionKw / (WATER_VOL_CP_KJ_L_C * rangeC);
    const flowM3h = flowLs * 3.6;
    const flowGpm = flowM3h / M3H_PER_GPM;

    const rangeF = rangeC * 1.8;
    const evapM3h = flowM3h * rangeF * evapFactorPerF;
    const driftM3h = flowM3h * (driftPct / 100);
    const blowdownM3h = Math.max(0, evapM3h / (coc - 1) - driftM3h);
    const makeupM3h = evapM3h + driftM3h + blowdownM3h;

    const tightApproach = approachC < 2.5;

    return {
      valid: true as const,
      heatRejectionKw,
      rangeC,
      approachC,
      flowLs,
      flowM3h,
      flowGpm,
      evapM3h,
      driftM3h,
      blowdownM3h,
      makeupM3h,
      coc,
      tightApproach,
    };
  }, [tonsStr, hrfStr, ewtStr, lwtStr, wbtStr, cocStr, evapFactorStr, driftPctStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Cooling Tower Thermal & Water Balance Summary (${tonsStr} RT chiller, HRF ${hrfStr})`,
      `Heat Rejection: ${result.heatRejectionKw.toFixed(2)} kW | Range: ${result.rangeC.toFixed(1)} degC | Approach: ${result.approachC.toFixed(1)} degC`,
      `Condenser Water Flow: ${result.flowM3h.toFixed(2)} m3/h (${result.flowGpm.toFixed(2)} GPM / ${result.flowLs.toFixed(2)} L/s)`,
      `Evaporation: ${result.evapM3h.toFixed(4)} m3/h | Drift: ${result.driftM3h.toFixed(4)} m3/h | Blowdown (COC=${result.coc}): ${result.blowdownM3h.toFixed(4)} m3/h | Total Makeup: ${result.makeupM3h.toFixed(4)} m3/h`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!result.valid) return;
    const rows = [
      'parameter,value,unit,notes',
      `heat_rejection,${result.heatRejectionKw.toFixed(3)},kW,Tons * 3.516853 * HRF`,
      `range,${result.rangeC.toFixed(2)},degC,EWT - LWT`,
      `approach,${result.approachC.toFixed(2)},degC,LWT - WBT`,
      `condenser_flow_m3h,${result.flowM3h.toFixed(4)},m3/h,Q_rej / (4.186 * Range) * 3.6`,
      `condenser_flow_gpm,${result.flowGpm.toFixed(2)},GPM,NIST SP 811 US GPM`,
      `evaporation_loss,${result.evapM3h.toFixed(4)},m3/h,Flow * Range_degF * ${evapFactorStr}`,
      `drift_loss,${result.driftM3h.toFixed(4)},m3/h,Flow * ${driftPctStr}%`,
      `blowdown_loss,${result.blowdownM3h.toFixed(4)},m3/h,E / (COC - 1) - Drift (COC=${result.coc})`,
      `total_makeup_water,${result.makeupM3h.toFixed(4)},m3/h,Evap + Drift + Blowdown`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cooling-tower-water-balance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Chemistry</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Chiller Load (RT)</label>
              <input
                data-testid="input-tons"
                type="text"
                inputMode="decimal"
                value={tonsStr}
                onChange={(e) => setTonsStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Heat Rej. Factor</label>
              <input
                data-testid="input-hrf"
                type="text"
                inputMode="decimal"
                value={hrfStr}
                onChange={(e) => setHrfStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">EWT (°C)</label>
              <input
                data-testid="input-ewt"
                type="text"
                inputMode="decimal"
                value={ewtStr}
                onChange={(e) => setEwtStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">LWT (°C)</label>
              <input
                data-testid="input-lwt"
                type="text"
                inputMode="decimal"
                value={lwtStr}
                onChange={(e) => setLwtStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">WBT (°C)</label>
              <input
                data-testid="input-wbt"
                type="text"
                inputMode="decimal"
                value={wbtStr}
                onChange={(e) => setWbtStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">COC (&gt; 1)</label>
              <input
                data-testid="input-coc"
                type="text"
                inputMode="decimal"
                value={cocStr}
                onChange={(e) => setCocStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Evap (/°F)</label>
              <input
                data-testid="input-evap-factor"
                type="text"
                inputMode="decimal"
                value={evapFactorStr}
                onChange={(e) => setEvapFactorStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Drift (%)</label>
              <input
                data-testid="input-drift-pct"
                type="text"
                inputMode="decimal"
                value={driftPctStr}
                onChange={(e) => setDriftPctStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>

              <div className="flex items-center gap-2">
                {result.valid && (
                  <div
                    data-testid="status-badge"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase border ${
                      !result.tightApproach
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {!result.tightApproach ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{!result.tightApproach ? 'APPROACH FEASIBLE' : 'TIGHT APPROACH (<2.5°C)'}</span>
                  </div>
                )}

                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {!result.valid && result.reason === 'thermodynamic' && (
              <div
                data-testid="thermo-warning"
                className="rounded-2xl p-4 bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-bold text-red-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>
                  Thermodynamically infeasible temperatures: evaporative cooling requires EWT &gt; LWT (Range = {result.rangeC.toFixed(1)} °C) and LWT &gt; ambient WBT (Approach = {result.approachC.toFixed(1)} °C).
                </span>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                Circulating Condenser Water Flow
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-flow-m3h" className="text-4xl font-black text-blue-900 tracking-tight">
                  {result.valid ? fmt(result.flowM3h, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-600">m³/h</span>
              </div>
              <div data-testid="result-flow-detail" className="text-xs font-bold text-blue-700 mt-1">
                {result.valid
                  ? `${result.flowGpm.toFixed(2)} GPM • ${result.flowLs.toFixed(2)} L/s • Heat Rejection: ${result.heatRejectionKw.toFixed(2)} kW`
                  : '—'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Range</div>
                <div className="flex items-baseline gap-1">
                  <span data-testid="result-range" className="text-xl font-black text-slate-900">
                    {result.valid ? fmt(result.rangeC, 1) : '—'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">°C</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Approach</div>
                <div className="flex items-baseline gap-1">
                  <span data-testid="result-approach" className="text-xl font-black text-slate-900">
                    {result.valid ? fmt(result.approachC, 1) : '—'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">°C</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Evap + Drift</div>
                <div className="flex items-baseline gap-1">
                  <span data-testid="result-evap" className="text-xl font-black text-slate-900">
                    {result.valid ? fmt(result.evapM3h, 4) : '—'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">m³/h</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  {result.valid ? `Drift ${result.driftM3h.toFixed(4)} m³/h` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Makeup Water</div>
                <div className="flex items-baseline gap-1">
                  <span data-testid="result-makeup" className="text-xl font-black text-slate-900">
                    {result.valid ? fmt(result.makeupM3h, 4) : '—'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">m³/h</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  {result.valid ? `Blowdown ${result.blowdownM3h.toFixed(4)}` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>SPX Cooling Tower Fundamentals (Eq. 3–5):</strong>{' '}
                <code>Flow = Q_rej / (4.186 × Range)</code>; <code>Range = EWT − LWT</code>; <code>Approach = LWT − WBT</code>; <code>Evap = Flow × Range(°F) × 0.0008</code>; <code>Drift = Flow × 0.0002</code>; <code>Blowdown = Evap/(COC − 1) − Drift</code>; <code>Makeup = Evap + Drift + Blowdown</code>.
              </div>
            </div>
          </div>
          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
