'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Gauge, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

// Exact conversion constants:
// 1 mechanical horsepower = 550 ft*lbf/s = 745.69987158227022 W = 0.74569987158227022 kW
const KW_PER_HP = (550 * 0.3048 * 4.4482216152605) / 1000;
// 1 lbf*in = 4.4482216152605 N * 0.0254 m
const NM_PER_LBF_IN = 4.4482216152605 * 0.0254;

const SERVICE_PRESETS = [
  { label: 'Centrifugal Pump (SF 1.25)', power: '15', rpm: '1800', sf: '1.25' },
  { label: 'General Conveyor (SF 1.50)', power: '15', rpm: '1800', sf: '1.5' },
  { label: 'Reciprocating Compressor (SF 2.50)', power: '22', rpm: '1450', sf: '2.5' },
];

function parsePositive(raw: string): number {
  const t = raw.trim();
  if (t === '') return Number.NaN;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : Number.NaN;
}

function fmt(val: number, decimals = 3): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : '—';
}

export default function CouplingTorqueCalculatorClient() {
  const [powerStr, setPowerStr] = useState('15');
  const [powerUnit, setPowerUnit] = useState<'kW' | 'hp'>('kW');
  const [rpmStr, setRpmStr] = useState('1800');
  const [sfStr, setSfStr] = useState('1.5');
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setPowerStr('15');
    setPowerUnit('kW');
    setRpmStr('1800');
    setSfStr('1.5');
    setCopied(false);
  };

  const result = useMemo(() => {
    const rawPower = parsePositive(powerStr);
    const rpm = parsePositive(rpmStr);
    const sf = parsePositive(sfStr);

    if (!Number.isFinite(rawPower) || !Number.isFinite(rpm) || !Number.isFinite(sf)) {
      return { valid: false as const };
    }

    const powerKw = powerUnit === 'kW' ? rawPower : rawPower * KW_PER_HP;
    const powerW = powerKw * 1000;
    const omega = (2 * Math.PI * rpm) / 60; // rad/s

    // Exact rotational mechanics relation: P = tau * omega => tau = P / omega = 30000 * P_kW / (pi * n)
    const nominalNm = powerW / omega;
    const designNm = nominalNm * sf;
    const nominalLbfIn = nominalNm / NM_PER_LBF_IN;
    const designLbfIn = designNm / NM_PER_LBF_IN;

    return {
      valid: true as const,
      powerKw,
      rpm,
      sf,
      omega,
      nominalNm,
      designNm,
      nominalLbfIn,
      designLbfIn,
    };
  }, [powerStr, powerUnit, rpmStr, sfStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const summary = `P=${result.powerKw.toFixed(3)} kW @ ${result.rpm} RPM (omega=${result.omega.toFixed(3)} rad/s) -> Nominal Torque=${result.nominalNm.toFixed(4)} N*m, Design Torque (SF ${result.sf})=${result.designNm.toFixed(4)} N*m (${result.designLbfIn.toFixed(2)} lbf*in)`;
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
      ['power_kw', result.powerKw.toFixed(4), 'kW'],
      ['rotational_speed', result.rpm.toFixed(2), 'RPM'],
      ['angular_velocity', result.omega.toFixed(4), 'rad/s'],
      ['service_factor', result.sf.toFixed(2), '-'],
      ['nominal_torque_nm', result.nominalNm.toFixed(4), 'N*m'],
      ['design_torque_nm', result.designNm.toFixed(4), 'N*m'],
      ['design_torque_lbf_in', result.designLbfIn.toFixed(2), 'lbf*in'],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coupling_torque_sizing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Shaft &amp; Coupling Torque Calculator</h2>
            <p className="text-sm font-medium text-slate-500">
              Exact rotational power-torque relationship τ = P / ω = 30,000·P / (π·n)
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="coup-power" className="text-sm font-black text-slate-700">
                Transmitted Power P
              </label>
              <div className="flex gap-1">
                {(['kW', 'hp'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    data-testid={`power-unit-${u}`}
                    onClick={() => setPowerUnit(u)}
                    className={`px-2 py-0.5 rounded text-xs font-black cursor-pointer ${
                      powerUnit === u ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input
              id="coup-power"
              data-testid="input-power"
              type="text"
              inputMode="decimal"
              value={powerStr}
              onChange={(e) => setPowerStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="coup-rpm" className="block text-sm font-black text-slate-700 mb-1.5">
              Shaft Speed n (RPM)
            </label>
            <input
              id="coup-rpm"
              data-testid="input-rpm"
              type="text"
              inputMode="decimal"
              value={rpmStr}
              onChange={(e) => setRpmStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="coup-sf" className="block text-sm font-black text-slate-700 mb-1.5">
              Service Factor SF
            </label>
            <input
              id="coup-sf"
              data-testid="input-sf"
              type="text"
              inputMode="decimal"
              value={sfStr}
              onChange={(e) => setSfStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SERVICE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setPowerUnit('kW');
                    setPowerStr(p.power);
                    setRpmStr(p.rpm);
                    setSfStr(p.sf);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
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
                <span>Power, rotational speed (RPM), and service factor must all be positive numbers.</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="text-xs font-black text-blue-800 uppercase tracking-wider mb-1">
                Design Coupling Torque (T_d = T_n × SF)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-design-nm" className="text-4xl font-black text-slate-900">
                  {result.valid ? fmt(result.designNm, 2) : '—'}
                </span>
                <span className="text-lg font-bold text-blue-700">N·m</span>
              </div>
              <div data-testid="result-design-lbfin" className="text-sm font-bold text-slate-600 mt-1">
                {result.valid ? `${result.designLbfIn.toFixed(2)} lbf·in` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Nominal Torque (T_n)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-nominal-nm" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.nominalNm, 4) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">N·m</span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  {result.valid ? `${result.nominalLbfIn.toFixed(2)} lbf·in` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Angular Velocity (ω)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-omega" className="text-2xl font-black text-slate-900">
                    {result.valid ? fmt(result.omega, 3) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">rad/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>Rotational Power &amp; Torque Identity:</strong>{' '}
                From <code>P = τ · ω</code> where <code>ω = 2πn / 60</code>, nominal torque is{' '}
                <code>T_n = 30,000·P_kW / (π·n) ≈ 9549.2966·P_kW / n</code> N·m (computed from exact π rather than rounded integer approximations).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
