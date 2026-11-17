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

function parseStrictPositiveInt(raw: string): number {
  const s = raw.trim();
  if (s === '') return Number.NaN;
  const n = Number(s);
  return Number.isInteger(n) && n > 0 ? n : Number.NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

const PRESETS = [
  { id: 'default', label: '8x M16 Flange (69 MPa, K=0.20)', area: '5000', stress: '69', bolts: '8', dia: '16', k: '0.20' },
  { id: '12-bolts', label: '12x M16 Flange (Equal Load)', area: '5000', stress: '69', bolts: '12', dia: '16', k: '0.20' },
  { id: 'ptfe-soft', label: 'PTFE / Soft Gasket (20 MPa)', area: '6500', stress: '20', bolts: '8', dia: '12', k: '0.16' },
];

export default function GasketSealCalculatorClient() {
  const [areaStr, setAreaStr] = useState('5000');
  const [stressStr, setStressStr] = useState('69');
  const [boltsStr, setBoltsStr] = useState('8');
  const [diaStr, setDiaStr] = useState('16');
  const [kStr, setKStr] = useState('0.20');
  const [copied, setCopied] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setAreaStr(p.area);
    setStressStr(p.stress);
    setBoltsStr(p.bolts);
    setDiaStr(p.dia);
    setKStr(p.k);
    setCopied(false);
  };

  const resetDefaults = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const area = parseStrictPositive(areaStr);
    const stress = parseStrictPositive(stressStr);
    const bolts = parseStrictPositiveInt(boltsStr);
    const dia = parseStrictPositive(diaStr);
    const k = parseStrictPositive(kStr);

    if (!Number.isFinite(area) || !Number.isFinite(stress) || !Number.isFinite(bolts) || !Number.isFinite(dia) || !Number.isFinite(k)) {
      return {
        valid: false as const,
        errorMsg: 'Enter strictly positive values for gasket area, seating stress, diameter, nut factor K, and positive integer bolt count.',
      };
    }

    const totalLoadKn = (area * stress) / 1000;
    const perBoltKn = totalLoadKn / bolts;
    const boltTorqueNm = k * (perBoltKn * 1000) * (dia / 1000);
    const shankAreaMm2 = (Math.PI * dia * dia) / 4;
    const shankStressMpa = (perBoltKn * 1000) / shankAreaMm2;

    return {
      valid: true as const,
      area,
      stress,
      bolts,
      dia,
      k,
      totalLoadKn,
      perBoltKn,
      boltTorqueNm,
      shankStressMpa,
    };
  }, [areaStr, stressStr, boltsStr, diaStr, kStr]);

  const handleCopy = async () => {
    if (!result.valid) return;
    const text = [
      `Flange Gasket Seating & Bolt Torque Summary`,
      `Ag=${result.area} mm2, sigma_g=${result.stress} MPa, Bolts=${result.bolts}, d=${result.dia} mm, K=${result.k}`,
      `Total Seating Load W_req = ${result.totalLoadKn.toFixed(2)} kN`,
      `Per-Bolt Preload F_bolt = ${result.perBoltKn.toFixed(3)} kN`,
      `Target Torque per Bolt T = ${result.boltTorqueNm.toFixed(2)} N*m`,
      `Nominal Bolt Shank Stress = ${result.shankStressMpa.toFixed(2)} MPa`,
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
      ['Effective Gasket Area Ag', String(result.area), 'mm2'],
      ['Target Gasket Seating Stress sigma_g', String(result.stress), 'MPa'],
      ['Number of Flange Bolts nb', String(result.bolts), 'ea'],
      ['Nominal Bolt Diameter d', String(result.dia), 'mm'],
      ['Nut Torque Factor K', String(result.k), '-'],
      ['Total Seating Force W_req', result.totalLoadKn.toFixed(2), 'kN'],
      ['Preload per Bolt F_bolt', result.perBoltKn.toFixed(3), 'kN'],
      ['Torque per Bolt T', result.boltTorqueNm.toFixed(2), 'N*m'],
      ['Nominal Shank Stress', result.shankStressMpa.toFixed(2), 'MPa'],
    ];
    const csv = toSafeAscii(rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
    const blob = new Blob([csv], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gasket-seating-bolt-torque.csv';
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
            <h2 className="text-lg font-black text-slate-900">Flange &amp; Gasket Inputs</h2>
          </div>

          {[
            { id: 'area', label: 'Effective Gasket Area Ag (mm2)', val: areaStr, set: setAreaStr },
            { id: 'stress', label: 'Target Seating Stress sigma_g (MPa)', val: stressStr, set: setStressStr },
            { id: 'bolts', label: 'Flange Bolt Count nb (integer)', val: boltsStr, set: setBoltsStr },
            { id: 'dia', label: 'Nominal Bolt Diameter d (mm)', val: diaStr, set: setDiaStr },
            { id: 'k', label: 'Nut Torque Factor K (typ. 0.15-0.25)', val: kStr, set: setKStr },
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
                <h2 className="text-lg font-black text-slate-900">Seating Preload &amp; Torque</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Total Seating Load W_req</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-load">{result.valid ? result.totalLoadKn.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-blue-500">kN</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Torque per Bolt T</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-torque">{result.valid ? result.boltTorqueNm.toFixed(2) : '—'}</span>{' '}
                  <span className="text-base text-emerald-500">N·m</span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">Preload per Bolt F_bolt</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-bolt-force">{result.valid ? result.perBoltKn.toFixed(3) : '—'}</span>{' '}
                  <span className="text-base text-orange-500">kN</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">Nominal Shank Stress</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-stress">{result.valid ? result.shankStressMpa.toFixed(2) : '—'}</span>{' '}
                  <span className="text-sm text-slate-500">MPa</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Bolted flange seating equilibrium: W_req = Ag * sigma_g / 1000 (kN), F_bolt = W_req / nb (kN), T = K * (F_bolt * 1000) * (d / 1000) (N*m), shank nominal stress = 4 * F_bolt * 1000 / (pi * d^2). Check bolt proof load using tensile stress area As for threaded fasteners.
              </span>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
