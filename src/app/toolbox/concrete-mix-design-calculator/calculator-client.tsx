'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Zap,
  Info,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface MixPreset {
  id: string;
  label: string;
  water: string;
  wc: string;
  airPct: string;
  coarseRatio: string;
  druw: string;
  sgCement: string;
  sgCoarse: string;
  sgFine: string;
  batchVol: string;
}

const MIX_PRESETS: MixPreset[] = [
  {
    id: 'structural-28',
    label: 'Structural Non-Air (w/c=0.45, 180 kg water, 2.0% air)',
    water: '180',
    wc: '0.45',
    airPct: '2.0',
    coarseRatio: '0.65',
    druw: '1600',
    sgCement: '3.15',
    sgCoarse: '2.68',
    sgFine: '2.64',
    batchVol: '1',
  },
  {
    id: 'pavement-air',
    label: 'Pavement Interactive PCC Example (148 kg water, 5.5% air)',
    water: '148',
    wc: '0.39',
    airPct: '5.5',
    coarseRatio: '0.71',
    druw: '1600',
    sgCement: '3.15',
    sgCoarse: '2.68',
    sgFine: '2.64',
    batchVol: '1',
  },
];

function parsePositive(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return Number.NaN;
  const val = Number(trimmed);
  if (!Number.isFinite(val) || val <= 0) return Number.NaN;
  return val;
}

function parseNonNegative(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return Number.NaN;
  const val = Number(trimmed);
  if (!Number.isFinite(val) || val < 0) return Number.NaN;
  return val;
}

function fmt(val: number, decimals = 2): string {
  if (!Number.isFinite(val)) return '—';
  return val.toFixed(decimals);
}

export default function ConcreteMixDesignCalculatorClient() {
  const [waterStr, setWaterStr] = useState<string>('180');
  const [wcStr, setWcStr] = useState<string>('0.45');
  const [airPctStr, setAirPctStr] = useState<string>('2.0');
  const [coarseRatioStr, setCoarseRatioStr] = useState<string>('0.65');
  const [druwStr, setDruwStr] = useState<string>('1600');
  const [sgCementStr, setSgCementStr] = useState<string>('3.15');
  const [sgCoarseStr, setSgCoarseStr] = useState<string>('2.68');
  const [sgFineStr, setSgFineStr] = useState<string>('2.64');
  const [batchVolStr, setBatchVolStr] = useState<string>('1');
  const [copied, setCopied] = useState<boolean>(false);

  const applyPreset = (p: MixPreset) => {
    setWaterStr(p.water);
    setWcStr(p.wc);
    setAirPctStr(p.airPct);
    setCoarseRatioStr(p.coarseRatio);
    setDruwStr(p.druw);
    setSgCementStr(p.sgCement);
    setSgCoarseStr(p.sgCoarse);
    setSgFineStr(p.sgFine);
    setBatchVolStr(p.batchVol);
  };

  const handleReset = () => {
    applyPreset(MIX_PRESETS[0]);
    setCopied(false);
  };

  const result = useMemo(() => {
    const waterKg = parsePositive(waterStr);
    const wc = parsePositive(wcStr);
    const airPct = parseNonNegative(airPctStr);
    const coarseRatio = parseNonNegative(coarseRatioStr);
    const druw = parsePositive(druwStr);
    const sgCement = parsePositive(sgCementStr);
    const sgCoarse = parsePositive(sgCoarseStr);
    const sgFine = parsePositive(sgFineStr);
    const batchVol = parsePositive(batchVolStr);

    if (
      !Number.isFinite(waterKg) ||
      !Number.isFinite(wc) ||
      !Number.isFinite(airPct) ||
      airPct >= 25 ||
      !Number.isFinite(coarseRatio) ||
      coarseRatio > 1 ||
      !Number.isFinite(druw) ||
      !Number.isFinite(sgCement) ||
      !Number.isFinite(sgCoarse) ||
      !Number.isFinite(sgFine) ||
      !Number.isFinite(batchVol)
    ) {
      return { valid: false as const };
    }

    const rhoWater = 1000; // kg/m^3
    const cementKg = waterKg / wc;
    const coarseKg = coarseRatio * druw;

    const volWater = waterKg / rhoWater;
    const volCement = cementKg / (rhoWater * sgCement);
    const volAir = airPct / 100;
    const volCoarse = coarseKg / (rhoWater * sgCoarse);

    const occupiedVol = volWater + volCement + volAir + volCoarse;
    const volFine = 1.0 - occupiedVol;
    const overflow = volFine <= 0;

    const fineKg = overflow ? Number.NaN : volFine * rhoWater * sgFine;
    const totalUnitVol = overflow ? occupiedVol : occupiedVol + volFine;
    const freshDensity = overflow ? Number.NaN : waterKg + cementKg + coarseKg + fineKg;

    return {
      valid: true as const,
      overflow,
      batchVol,
      waterKg,
      cementKg,
      coarseKg,
      fineKg,
      volWater,
      volCement,
      volAir,
      volCoarse,
      volFine,
      totalUnitVol,
      freshDensity,
      batchWater: waterKg * batchVol,
      batchCement: cementKg * batchVol,
      batchCoarse: coarseKg * batchVol,
      batchFine: overflow ? Number.NaN : fineKg * batchVol,
    };
  }, [waterStr, wcStr, airPctStr, coarseRatioStr, druwStr, sgCementStr, sgCoarseStr, sgFineStr, batchVolStr]);

  const handleCopySummary = async () => {
    if (!result.valid || result.overflow) return;
    const text = [
      `ACI Absolute Volume Concrete Mix (per 1.000 m3 / batch ${result.batchVol} m3)`,
      `Water: ${result.waterKg.toFixed(2)} kg/m3 (${result.volWater.toFixed(4)} m3)`,
      `Cement: ${result.cementKg.toFixed(2)} kg/m3 (${result.volCement.toFixed(4)} m3)`,
      `Coarse Aggregate: ${result.coarseKg.toFixed(2)} kg/m3 (${result.volCoarse.toFixed(4)} m3)`,
      `Fine Aggregate (Sand): ${result.fineKg.toFixed(2)} kg/m3 (${result.volFine.toFixed(4)} m3)`,
      `Entrained/Entrapped Air: ${result.volAir.toFixed(4)} m3`,
      `Total Volume Sum: ${result.totalUnitVol.toFixed(4)} m3 | Fresh Density: ${result.freshDensity.toFixed(2)} kg/m3`,
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
    if (!result.valid || result.overflow) return;
    const rows = [
      'ingredient,mass_kg_per_m3,absolute_vol_m3_per_m3,batch_mass_kg,notes',
      `Mixing Water,${result.waterKg.toFixed(3)},${result.volWater.toFixed(5)},${result.batchWater.toFixed(3)},SG=1.00 at 1000 kg/m3`,
      `Portland Cement,${result.cementKg.toFixed(3)},${result.volCement.toFixed(5)},${result.batchCement.toFixed(3)},SG=${sgCementStr.trim()}`,
      `Coarse Aggregate,${result.coarseKg.toFixed(3)},${result.volCoarse.toFixed(5)},${result.batchCoarse.toFixed(3)},b/b0*DRUW SG=${sgCoarseStr.trim()}`,
      `Fine Aggregate,${result.fineKg.toFixed(3)},${result.volFine.toFixed(5)},${result.batchFine.toFixed(3)},Remaining absolute volume SG=${sgFineStr.trim()}`,
      `Air Content,0.000,${result.volAir.toFixed(5)},0.000,${airPctStr.trim()}% target air`,
      `Total,${result.freshDensity.toFixed(3)},${result.totalUnitVol.toFixed(5)},${(result.freshDensity * result.batchVol).toFixed(3)},Batch=${result.batchVol} m3`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concrete-mix-absolute-volume.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Mix Inputs</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              Reference Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {MIX_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid={`preset-${p.id}`}
                  onClick={() => applyPreset(p)}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Water (kg/m³)
              </label>
              <input
                data-testid="input-water"
                type="text"
                inputMode="decimal"
                value={waterStr}
                onChange={(e) => setWaterStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                w/c Ratio
              </label>
              <input
                data-testid="input-wc"
                type="text"
                inputMode="decimal"
                value={wcStr}
                onChange={(e) => setWcStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Air Content (%)
              </label>
              <input
                data-testid="input-air"
                type="text"
                inputMode="decimal"
                value={airPctStr}
                onChange={(e) => setAirPctStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Batch Vol (m³)
              </label>
              <input
                data-testid="input-batch"
                type="text"
                inputMode="decimal"
                value={batchVolStr}
                onChange={(e) => setBatchVolStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Coarse Ratio (b/b0)
              </label>
              <input
                data-testid="input-coarse-ratio"
                type="text"
                inputMode="decimal"
                value={coarseRatioStr}
                onChange={(e) => setCoarseRatioStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Coarse DRUW (kg/m³)
              </label>
              <input
                data-testid="input-druw"
                type="text"
                inputMode="decimal"
                value={druwStr}
                onChange={(e) => setDruwStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">SG Cement</label>
              <input
                data-testid="input-sg-c"
                type="text"
                inputMode="decimal"
                value={sgCementStr}
                onChange={(e) => setSgCementStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">SG Coarse</label>
              <input
                data-testid="input-sg-ca"
                type="text"
                inputMode="decimal"
                value={sgCoarseStr}
                onChange={(e) => setSgCoarseStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">SG Fine</label>
              <input
                data-testid="input-sg-fa"
                type="text"
                inputMode="decimal"
                value={sgFineStr}
                onChange={(e) => setSgFineStr(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Absolute Volume Mix Proportions (1.000 m³ Basis)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid || result.overflow}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid || result.overflow}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {result.valid && result.overflow && (
              <div
                data-testid="volume-overflow-warning"
                className="mb-4 rounded-2xl p-4 border bg-red-50 border-red-200 flex items-start gap-2.5 text-sm font-bold text-red-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>
                  Non-fine-aggregate absolute volumes sum to {result.totalUnitVol.toFixed(4)} m³ (&ge; 1.000 m³). Reduce water, air, or coarse ratio b/b0 so remaining volume for fine aggregate is positive.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Portland Cement (Mass / Vol)
                </div>
                <div data-testid="result-cement" className="text-2xl font-black text-blue-800">
                  {result.valid ? `${fmt(result.cementKg, 2)} kg/m³` : '—'}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  {result.valid
                    ? `V = ${result.volCement.toFixed(4)} m³ • Batch: ${fmt(result.batchCement, 1)} kg`
                    : '—'}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Net Mixing Water (Mass / Vol)
                </div>
                <div data-testid="result-water" className="text-2xl font-black text-emerald-800">
                  {result.valid ? `${fmt(result.waterKg, 2)} kg/m³` : '—'}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid
                    ? `V = ${result.volWater.toFixed(4)} m³ • Batch: ${fmt(result.batchWater, 1)} kg`
                    : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Fine Aggregate / Sand (Mass / Vol)
                </div>
                <div data-testid="result-fine" className="text-2xl font-black text-orange-800">
                  {result.valid && !result.overflow ? `${fmt(result.fineKg, 2)} kg/m³` : '—'}
                </div>
                <div className="text-xs font-bold text-orange-700 mt-1">
                  {result.valid && !result.overflow
                    ? `V = ${result.volFine.toFixed(4)} m³ • Batch: ${fmt(result.batchFine, 1)} kg`
                    : '—'}
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                  Coarse Aggregate / Stone (Mass / Vol)
                </div>
                <div data-testid="result-coarse" className="text-2xl font-black text-purple-800">
                  {result.valid ? `${fmt(result.coarseKg, 2)} kg/m³` : '—'}
                </div>
                <div className="text-xs font-bold text-purple-700 mt-1">
                  {result.valid
                    ? `V = ${result.volCoarse.toFixed(4)} m³ • Batch: ${fmt(result.batchCoarse, 1)} kg`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">
                  Absolute Volume Balance (ΣV)
                </div>
                <div data-testid="result-vol-sum" className="text-lg font-black text-slate-800">
                  {result.valid && !result.overflow ? `${result.totalUnitVol.toFixed(4)} m³` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">
                  Theoretical Fresh Density
                </div>
                <div data-testid="result-density" className="text-lg font-black text-slate-800">
                  {result.valid && !result.overflow ? `${fmt(result.freshDensity, 2)} kg/m³` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <div>
                  <strong>ACI Absolute Volume Method:</strong> Solid volume of each component is{' '}
                  <code>V = Mass / (1000 × SG)</code> (Pavement Interactive default typical specific gravities: cement <code>3.15</code>, coarse <code>2.68</code>, fine <code>2.64</code>, water <code>1000 kg/m³</code>). Fine aggregate occupies remaining volume{' '}
                  <code>V_fine = 1.000 − (V_water + V_cement + V_coarse + V_air)</code> so total volume equals <code>1.0000 m³</code>. Edit all parameters for local quarry SG and target w/c specs.
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
