'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Anchor, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

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

function fmt(val: number, decimals = 2): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CraneLoadCalculatorClient() {
  const [loadStr, setLoadStr] = useState('50');
  const [radiusStr, setRadiusStr] = useState('10');
  const [boomWeightStr, setBoomWeightStr] = useState('0');
  const [boomCgRadiusStr, setBoomCgRadiusStr] = useState('5');
  const [cwStr, setCwStr] = useState('200');
  const [cwDistStr, setCwDistStr] = useState('3');
  const [ratedPctStr, setRatedPctStr] = useState('75');
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: 'default' | 'safe-outrigger' | 'with-boom') => {
    setCopied(false);
    if (preset === 'default') {
      setLoadStr('50');
      setRadiusStr('10');
      setBoomWeightStr('0');
      setBoomCgRadiusStr('5');
      setCwStr('200');
      setCwDistStr('3');
      setRatedPctStr('75');
    } else if (preset === 'safe-outrigger') {
      setLoadStr('50');
      setRadiusStr('10');
      setBoomWeightStr('0');
      setBoomCgRadiusStr('5');
      setCwStr('250');
      setCwDistStr('3');
      setRatedPctStr('85');
    } else {
      setLoadStr('40');
      setRadiusStr('10');
      setBoomWeightStr('15');
      setBoomCgRadiusStr('5');
      setCwStr('250');
      setCwDistStr('3');
      setRatedPctStr('75');
    }
  };

  const handleReset = () => applyPreset('default');

  const result = useMemo(() => {
    const W = parsePositive(loadStr);
    const R = parsePositive(radiusStr);
    const Wb = parseNonNegative(boomWeightStr);
    const Rb = parseNonNegative(boomCgRadiusStr);
    const CW = parsePositive(cwStr);
    const d = parsePositive(cwDistStr);
    const ratedPct = parsePositive(ratedPctStr);

    if (
      !Number.isFinite(W) ||
      !Number.isFinite(R) ||
      !Number.isFinite(Wb) ||
      !Number.isFinite(Rb) ||
      !Number.isFinite(CW) ||
      !Number.isFinite(d) ||
      !Number.isFinite(ratedPct) ||
      ratedPct > 100
    ) {
      return { valid: false as const };
    }

    const loadOverturning = W * R;
    const boomOverturning = Wb * Rb;
    const Mo = loadOverturning + boomOverturning;
    const Ms = CW * d;
    const sf = Ms / Mo;

    // Tipping load about tipping fulcrum: W_tip * R + Wb * Rb = Ms => W_tip = (Ms - Wb*Rb) / R
    const tippingLoad = Math.max(0, (Ms - boomOverturning) / R);
    const ratedLoad = tippingLoad * (ratedPct / 100);
    const isWithinRated = W <= ratedLoad && sf > 1.0;

    return {
      valid: true as const,
      W,
      R,
      Wb,
      Rb,
      CW,
      d,
      ratedPct,
      loadOverturning,
      boomOverturning,
      Mo,
      Ms,
      sf,
      tippingLoad,
      ratedLoad,
      isWithinRated,
    };
  }, [loadStr, radiusStr, boomWeightStr, boomCgRadiusStr, cwStr, cwDistStr, ratedPctStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `Crane Overturning Stability: Mo=${result.Mo.toFixed(2)} kN*m, Ms=${result.Ms.toFixed(2)} kN*m, SF=${result.sf.toFixed(3)}, Tipping Load=${result.tippingLoad.toFixed(2)} kN, Stability-Limited Rated Load (${result.ratedPct}%)=${result.ratedLoad.toFixed(2)} kN (${result.isWithinRated ? 'PASS' : 'EXCEEDS LIMIT'})`;
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
      ['lifted_load', result.W.toFixed(2), 'kN'],
      ['load_radius', result.R.toFixed(2), 'm'],
      ['boom_weight', result.Wb.toFixed(2), 'kN'],
      ['boom_cg_radius', result.Rb.toFixed(2), 'm'],
      ['counterweight', result.CW.toFixed(2), 'kN'],
      ['counterweight_arm', result.d.toFixed(2), 'm'],
      ['overturning_moment', result.Mo.toFixed(2), 'kN*m'],
      ['stabilizing_moment', result.Ms.toFixed(2), 'kN*m'],
      ['stability_safety_factor', result.sf.toFixed(3), '-'],
      ['tipping_load', result.tippingLoad.toFixed(2), 'kN'],
      ['rated_stability_limit', result.ratedLoad.toFixed(2), 'kN'],
      ['status', result.isWithinRated ? 'PASS' : 'EXCEEDS_RATED_LIMIT', '-'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crane_overturning_stability.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Crane Overturning Stability &amp; Moment Equilibrium</h2>
            <p className="text-sm font-medium text-slate-500">
              Static tipping balance ΣM = 0 around fulcrum with ASME B30 stability-limited rated fraction
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="preset-safe-outrigger"
            onClick={() => applyPreset('safe-outrigger')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 transition-colors cursor-pointer"
          >
            Outrigger 85% (CW 250 kN)
          </button>
          <button
            type="button"
            data-testid="preset-with-boom"
            onClick={() => applyPreset('with-boom')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
          >
            Include Boom Deadweight
          </button>
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
      </div>

      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="crane-w" className="block text-xs font-black text-slate-700 mb-1">
                Lifted Load W (kN)
              </label>
              <input
                id="crane-w"
                data-testid="input-load"
                type="text"
                inputMode="decimal"
                value={loadStr}
                onChange={(e) => setLoadStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="crane-r" className="block text-xs font-black text-slate-700 mb-1">
                Load Radius R (m)
              </label>
              <input
                id="crane-r"
                data-testid="input-radius"
                type="text"
                inputMode="decimal"
                value={radiusStr}
                onChange={(e) => setRadiusStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="crane-wb" className="block text-xs font-black text-slate-700 mb-1">
                Boom Weight W_b (kN)
              </label>
              <input
                id="crane-wb"
                data-testid="input-boom-weight"
                type="text"
                inputMode="decimal"
                value={boomWeightStr}
                onChange={(e) => setBoomWeightStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="crane-rb" className="block text-xs font-black text-slate-700 mb-1">
                Boom CG Radius R_b (m)
              </label>
              <input
                id="crane-rb"
                data-testid="input-boom-radius"
                type="text"
                inputMode="decimal"
                value={boomCgRadiusStr}
                onChange={(e) => setBoomCgRadiusStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="crane-cw" className="block text-xs font-black text-slate-700 mb-1">
                Counterweight + Chassis (kN)
              </label>
              <input
                id="crane-cw"
                data-testid="input-counterweight"
                type="text"
                inputMode="decimal"
                value={cwStr}
                onChange={(e) => setCwStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="crane-d" className="block text-xs font-black text-slate-700 mb-1">
                Stabilizing Arm d (m)
              </label>
              <input
                id="crane-d"
                data-testid="input-cw-dist"
                type="text"
                inputMode="decimal"
                value={cwDistStr}
                onChange={(e) => setCwDistStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="crane-pct" className="text-xs font-black text-slate-700">
                Stability-Limited Rated Fraction (% of Tipping Load)
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setRatedPctStr('75')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  75% Crawler
                </button>
                <button
                  type="button"
                  onClick={() => setRatedPctStr('85')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  85% Outrigger
                </button>
              </div>
            </div>
            <input
              id="crane-pct"
              data-testid="input-rated-pct"
              type="text"
              inputMode="decimal"
              value={ratedPctStr}
              onChange={(e) => setRatedPctStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
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
                <span>Provide positive load, radius, counterweight, arm distance, and rated percentage (≤ 100%).</span>
              </div>
            )}

            <div
              className={`rounded-2xl p-6 border ${
                !result.valid
                  ? 'bg-slate-50 border-slate-200'
                  : result.isWithinRated
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Overturning Safety Factor (SF = M_s / M_o)
                </div>
                {result.valid && (
                  <span
                    data-testid="result-status"
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      result.isWithinRated ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {result.isWithinRated ? 'PASS — WITHIN RATED LIMIT' : 'EXCEEDS RATED STABILITY LIMIT'}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-sf" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.sf, 3) : '—'}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {result.valid ? `(Tipping Load: ${result.tippingLoad.toFixed(2)} kN)` : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Overturning Moment</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-mo" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.Mo, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN·m</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Stabilizing Moment</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-ms" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.Ms, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN·m</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">
                  Rated Load ({ratedPctStr}%)
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-rated-load" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.ratedLoad, 2) : '—'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">kN</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Moment Equilibrium &amp; Rated Capacity Basis:</strong>{' '}
                Static tipping check only (<code>M_o = W·R + W_b·R_b</code>, <code>M_s = CW·d</code>). Under US mobile crane standards (ASME B30), stability-limited rated loads are typically 75% of tipping load for crawler cranes and 85% for outrigger-supported cranes; structural boom strength and OEM load charts must be verified separately.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
