'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Flame, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function DieCastingPressureCalculatorClient() {
  const [flowMode, setFlowMode] = useState<'time-to-vel' | 'vel-to-time'>('time-to-vel');
  const [pressureStr, setPressureStr] = useState('50');
  const [projAreaStr, setProjAreaStr] = useState('200');
  const [clampSfStr, setClampSfStr] = useState('1.0');
  const [cavityVolStr, setCavityVolStr] = useState('500');
  const [gateAreaStr, setGateAreaStr] = useState('50');
  const [fillTimeMsStr, setFillTimeMsStr] = useState('250');
  const [gateVelStr, setGateVelStr] = useState('40');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setFlowMode('time-to-vel');
    setPressureStr('50');
    setProjAreaStr('200');
    setClampSfStr('1.0');
    setCavityVolStr('500');
    setGateAreaStr('50');
    setFillTimeMsStr('250');
    setGateVelStr('40');
    setCopied(false);
  };

  const result = useMemo(() => {
    const P_mpa = parsePositive(pressureStr);
    const A_proj_cm2 = parsePositive(projAreaStr);
    const sf = parsePositive(clampSfStr);
    const V_cav_cm3 = parsePositive(cavityVolStr);
    const A_gate_mm2 = parsePositive(gateAreaStr);

    if (
      !Number.isFinite(P_mpa) ||
      !Number.isFinite(A_proj_cm2) ||
      !Number.isFinite(sf) ||
      !Number.isFinite(V_cav_cm3) ||
      !Number.isFinite(A_gate_mm2)
    ) {
      return { valid: false as const };
    }

    // F = P * A: (N/mm^2) * (cm^2 * 100 mm^2/cm^2) / 1000 = 0.1 * P_MPa * A_cm2 (kN)
    const clampForceKn = 0.1 * P_mpa * A_proj_cm2 * sf;
    const clampMetricTons = clampForceKn / 9.80665;
    const V_cav_mm3 = V_cav_cm3 * 1000;

    let fillTimeMs = Number.NaN;
    let gateVelocityMs = Number.NaN;

    if (flowMode === 'time-to-vel') {
      const tMs = parsePositive(fillTimeMsStr);
      if (!Number.isFinite(tMs)) return { valid: false as const };
      fillTimeMs = tMs;
      // mm^3 / (mm^2 * ms) = mm/ms = m/s
      gateVelocityMs = V_cav_mm3 / (A_gate_mm2 * tMs);
    } else {
      const vg = parsePositive(gateVelStr);
      if (!Number.isFinite(vg)) return { valid: false as const };
      gateVelocityMs = vg;
      fillTimeMs = V_cav_mm3 / (A_gate_mm2 * vg);
    }

    const flowRateCm3s = V_cav_cm3 / (fillTimeMs / 1000);

    return {
      valid: true as const,
      P_mpa,
      A_proj_cm2,
      sf,
      V_cav_cm3,
      A_gate_mm2,
      clampForceKn,
      clampMetricTons,
      fillTimeMs,
      gateVelocityMs,
      flowRateCm3s,
    };
  }, [flowMode, pressureStr, projAreaStr, clampSfStr, cavityVolStr, gateAreaStr, fillTimeMsStr, gateVelStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Die Casting Sizing: Clamp=${result.clampForceKn.toFixed(2)} kN (${result.clampMetricTons.toFixed(2)} tf, SF=${result.sf}), Fill Time=${result.fillTimeMs.toFixed(2)} ms, Gate Velocity=${result.gateVelocityMs.toFixed(3)} m/s, Flow=${result.flowRateCm3s.toFixed(1)} cm3/s`;
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
      ['injection_pressure', String(result.P_mpa), 'MPa'],
      ['projected_area', String(result.A_proj_cm2), 'cm2'],
      ['clamping_safety_factor', String(result.sf), '-'],
      ['clamping_force', result.clampForceKn.toFixed(2), 'kN'],
      ['machine_tonnage', result.clampMetricTons.toFixed(2), 'tf'],
      ['cavity_volume', String(result.V_cav_cm3), 'cm3'],
      ['gate_area', String(result.A_gate_mm2), 'mm2'],
      ['fill_time', result.fillTimeMs.toFixed(2), 'ms'],
      ['gate_velocity', result.gateVelocityMs.toFixed(3), 'm/s'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'die_casting_parameters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Die Casting Clamping Force &amp; Gate Flow</h2>
            <p className="text-sm font-medium text-slate-500">
              Couples projected cavity clamping force with continuity-derived gate velocity &amp; fill time
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="reset-button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="px-6 md:px-8 pt-6 flex flex-wrap gap-2">
        <button
          type="button"
          data-testid="mode-time-to-vel"
          onClick={() => setFlowMode('time-to-vel')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            flowMode === 'time-to-vel' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Fill Time → Gate Velocity
        </button>
        <button
          type="button"
          data-testid="mode-vel-to-time"
          onClick={() => setFlowMode('vel-to-time')}
          className={`px-4 py-2 rounded-xl text-sm font-black cursor-pointer ${
            flowMode === 'vel-to-time' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Target Gate Velocity → Fill Time
        </button>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="dc-p" className="block text-xs font-black text-slate-700 mb-1">Metal P (MPa)</label>
              <input
                id="dc-p"
                data-testid="input-pressure"
                type="text"
                inputMode="decimal"
                value={pressureStr}
                onChange={(e) => setPressureStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dc-a" className="block text-xs font-black text-slate-700 mb-1">Proj. Area (cm²)</label>
              <input
                id="dc-a"
                data-testid="input-proj-area"
                type="text"
                inputMode="decimal"
                value={projAreaStr}
                onChange={(e) => setProjAreaStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
            <div>
              <label htmlFor="dc-sf" className="block text-xs font-black text-slate-700 mb-1">Clamp SF</label>
              <input
                id="dc-sf"
                data-testid="input-clamp-sf"
                type="text"
                inputMode="decimal"
                value={clampSfStr}
                onChange={(e) => setClampSfStr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dc-v" className="block text-xs font-black text-slate-700 mb-1">Cavity Vol (cm³)</label>
              <input
                id="dc-v"
                data-testid="input-cavity-vol"
                type="text"
                inputMode="decimal"
                value={cavityVolStr}
                onChange={(e) => setCavityVolStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label htmlFor="dc-ag" className="block text-xs font-black text-slate-700 mb-1">Gate Area (mm²)</label>
              <input
                id="dc-ag"
                data-testid="input-gate-area"
                type="text"
                inputMode="decimal"
                value={gateAreaStr}
                onChange={(e) => setGateAreaStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          {flowMode === 'time-to-vel' ? (
            <div>
              <label htmlFor="dc-tf" className="block text-sm font-black text-slate-700 mb-1.5">
                Cavity Fill Time t_fill (ms)
              </label>
              <input
                id="dc-tf"
                data-testid="input-fill-time"
                type="text"
                inputMode="decimal"
                value={fillTimeMsStr}
                onChange={(e) => setFillTimeMsStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="dc-vg" className="block text-sm font-black text-slate-700 mb-1.5">
                Target Gate Velocity v_g (m/s)
              </label>
              <input
                id="dc-vg"
                data-testid="input-gate-vel"
                type="text"
                inputMode="decimal"
                value={gateVelStr}
                onChange={(e) => setGateVelStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              data-testid="copy-summary-button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
            <button
              type="button"
              data-testid="export-csv-button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-black cursor-pointer"
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
                <span>All pressure, projected area, safety factor, cavity volume, gate area, and timing/velocity inputs must be positive.</span>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="text-xs font-black text-purple-800 uppercase tracking-wider mb-1">
                Required Die Clamping Force
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-clamp-kn" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.clampForceKn, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-purple-700">kN</span>
              </div>
              <div data-testid="result-tonnage" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.clampMetricTons.toFixed(2)} metric tons` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Gate Velocity (v_g)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-vg" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.gateVelocityMs, 3) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">m/s</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Fill Time (t_fill)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-fill-time" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.fillTimeMs, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ms</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Volumetric Flow</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-flow-rate" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.flowRateCm3s, 1) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">cm³/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Continuity &amp; Hydrostatic Clamping Relations:</strong>{' '}
                Clamping force <code>F = P_inj · A_proj · SF</code> (with unit conversion <code>1 MPa·cm² = 0.1 kN</code>). Volumetric continuity enforces{' '}
                <code>v_g = (V_cav × 1,000) / (A_gate × t_fill)</code> where <code>V_cav</code> is in cm³, <code>A_gate</code> in mm², and <code>t_fill</code> in ms.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
