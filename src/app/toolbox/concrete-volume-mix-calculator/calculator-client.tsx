'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Copy, Check, Download, AlertTriangle } from 'lucide-react';

interface MixOption {
  id: string;
  label: string;
  cement: number;
  sand: number;
  aggregate: number;
  note: string;
}

const MIX_RATIOS: MixOption[] = [
  { id: 'M5', label: 'M5 (1 : 5 : 10)', cement: 1, sand: 5, aggregate: 10, note: 'IS 456:2000 nominal lean mix' },
  { id: 'M7.5', label: 'M7.5 (1 : 4 : 8)', cement: 1, sand: 4, aggregate: 8, note: 'IS 456:2000 nominal mix' },
  { id: 'M10', label: 'M10 (1 : 3 : 6)', cement: 1, sand: 3, aggregate: 6, note: 'IS 456:2000 nominal mix' },
  { id: 'M15', label: 'M15 (1 : 2 : 4)', cement: 1, sand: 2, aggregate: 4, note: 'IS 456:2000 nominal plain concrete mix' },
  { id: 'M20', label: 'M20 (1 : 1.5 : 3)', cement: 1, sand: 1.5, aggregate: 3, note: 'IS 456:2000 highest nominal mix' },
  {
    id: 'CUSTOM_1_1_2',
    label: 'Empirical 1 : 1 : 2 (Custom — IS 456 requires design mix for M25+)',
    cement: 1,
    sand: 1,
    aggregate: 2,
    note: 'Custom empirical proportion (not an IS 456 nominal mix)',
  },
];

// NIST SP 811 exact international foot and yard
const FT3_TO_M3 = 0.3048 ** 3; // 0.028316846592 m3
const YD3_TO_M3 = 0.9144 ** 3; // 0.764554857984 m3

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

export default function ConcreteMixClient() {
  const [shape, setShape] = useState<'slab' | 'column' | 'footing'>('slab');
  const [lengthStr, setLengthStr] = useState('5');
  const [widthStr, setWidthStr] = useState('4');
  const [heightStr, setHeightStr] = useState('0.15');
  const [diameterStr, setDiameterStr] = useState('0.4');
  const [countStr, setCountStr] = useState('1');
  const [mixId, setMixId] = useState('M15');
  const [wastePctStr, setWastePctStr] = useState('5');
  const [dryFactorStr, setDryFactorStr] = useState('1.54');
  const [cementDensityStr, setCementDensityStr] = useState('1440');
  const [bagWeightStr, setBagWeightStr] = useState('50');
  const [sandDensityStr, setSandDensityStr] = useState('1600');
  const [aggDensityStr, setAggDensityStr] = useState('1450');
  const [wcRatioStr, setWcRatioStr] = useState('0.50');
  const [copied, setCopied] = useState(false);

  const handleShapeSelect = (nextShape: 'slab' | 'column' | 'footing') => {
    setShape(nextShape);
    if (nextShape === 'column' && heightStr === '0.15') {
      setHeightStr('3.0');
    } else if (nextShape !== 'column' && heightStr === '3.0') {
      setHeightStr('0.15');
    }
  };

  const applyPreset = (preset: 'slab-m15' | 'column-m20') => {
    setCopied(false);
    if (preset === 'slab-m15') {
      setShape('slab');
      setLengthStr('5');
      setWidthStr('4');
      setHeightStr('0.15');
      setDiameterStr('0.4');
      setCountStr('1');
      setMixId('M15');
      setWastePctStr('5');
    } else {
      setShape('column');
      setDiameterStr('0.4');
      setHeightStr('3.0');
      setCountStr('2');
      setMixId('M20');
      setWastePctStr('5');
    }
  };

  const handleReset = () => {
    setShape('slab');
    setLengthStr('5');
    setWidthStr('4');
    setHeightStr('0.15');
    setDiameterStr('0.4');
    setCountStr('1');
    setMixId('M15');
    setWastePctStr('5');
    setDryFactorStr('1.54');
    setCementDensityStr('1440');
    setBagWeightStr('50');
    setSandDensityStr('1600');
    setAggDensityStr('1450');
    setWcRatioStr('0.50');
    setCopied(false);
  };

  const result = useMemo(() => {
    const height = parsePositive(heightStr);
    const count = parsePositive(countStr);
    const wastePct = parseNonNegative(wastePctStr);
    const dryFactor = parsePositive(dryFactorStr);
    const cementDensity = parsePositive(cementDensityStr);
    const bagWeight = parsePositive(bagWeightStr);
    const sandDensity = parsePositive(sandDensityStr);
    const aggDensity = parsePositive(aggDensityStr);
    const wcRatio = parsePositive(wcRatioStr);

    let baseVol = Number.NaN;
    if (shape === 'column') {
      const d = parsePositive(diameterStr);
      if (Number.isFinite(d) && Number.isFinite(height)) {
        baseVol = Math.PI * (d / 2) ** 2 * height;
      }
    } else {
      const l = parsePositive(lengthStr);
      const w = parsePositive(widthStr);
      if (Number.isFinite(l) && Number.isFinite(w) && Number.isFinite(height)) {
        baseVol = l * w * height;
      }
    }

    if (
      !Number.isFinite(baseVol) ||
      !Number.isFinite(count) ||
      !Number.isFinite(wastePct) ||
      !Number.isFinite(dryFactor) ||
      !Number.isFinite(cementDensity) ||
      !Number.isFinite(bagWeight) ||
      !Number.isFinite(sandDensity) ||
      !Number.isFinite(aggDensity) ||
      !Number.isFinite(wcRatio)
    ) {
      return { valid: false as const };
    }

    const mix = MIX_RATIOS.find((m) => m.id === mixId) ?? MIX_RATIOS[3];
    const totalParts = mix.cement + mix.sand + mix.aggregate;
    const netVolume = baseVol * count;
    const wetVolume = netVolume * (1 + wastePct / 100);
    const wetFt3 = wetVolume / FT3_TO_M3;
    const wetYd3 = wetVolume / YD3_TO_M3;

    const dryVolume = wetVolume * dryFactor;
    const cementVol = (dryVolume * mix.cement) / totalParts;
    const sandVol = (dryVolume * mix.sand) / totalParts;
    const aggVol = (dryVolume * mix.aggregate) / totalParts;

    const cementKg = cementVol * cementDensity;
    const exactBags = cementKg / bagWeight;
    const orderBags = Math.ceil(exactBags);
    const sandKg = sandVol * sandDensity;
    const aggKg = aggVol * aggDensity;
    const waterL = cementKg * wcRatio;

    return {
      valid: true as const,
      mix,
      netVolume,
      wetVolume,
      wetFt3,
      wetYd3,
      dryVolume,
      cementVol,
      cementKg,
      exactBags,
      orderBags,
      sandVol,
      sandKg,
      aggVol,
      aggKg,
      waterL,
      bagWeight,
      dryFactor,
      wastePct,
      wcRatio,
    };
  }, [
    shape,
    lengthStr,
    widthStr,
    heightStr,
    diameterStr,
    countStr,
    mixId,
    wastePctStr,
    dryFactorStr,
    cementDensityStr,
    bagWeightStr,
    sandDensityStr,
    aggDensityStr,
    wcRatioStr,
  ]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Concrete Volume & Nominal Mix Summary (${result.mix.label})`,
      `Net Volume: ${result.netVolume.toFixed(3)} m3 | Order Volume (+${result.wastePct}% waste): ${result.wetVolume.toFixed(3)} m3 (${result.wetFt3.toFixed(2)} ft3 / ${result.wetYd3.toFixed(2)} yd3)`,
      `Dry Volume (x${result.dryFactor}): ${result.dryVolume.toFixed(3)} m3`,
      `Cement: ${result.cementKg.toFixed(2)} kg (${result.exactBags.toFixed(2)} exact bags, buy ${result.orderBags} x ${result.bagWeight} kg bags, ${result.cementVol.toFixed(3)} m3)`,
      `Sand: ${result.sandKg.toFixed(2)} kg (${result.sandVol.toFixed(3)} m3)`,
      `Coarse Aggregate: ${result.aggKg.toFixed(2)} kg (${result.aggVol.toFixed(3)} m3)`,
      `Mixing Water (w/c=${result.wcRatio.toFixed(2)}): ${result.waterL.toFixed(2)} L`,
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
      `mix_grade,${result.mix.id},-,${result.mix.note}`,
      `net_volume,${result.netVolume.toFixed(4)},m3,Before waste allowance`,
      `order_wet_volume,${result.wetVolume.toFixed(4)},m3,Includes ${result.wastePct}% waste`,
      `order_volume_ft3,${result.wetFt3.toFixed(4)},ft3,NIST SP 811 exact 0.3048^3`,
      `order_volume_yd3,${result.wetYd3.toFixed(4)},yd3,NIST SP 811 exact 0.9144^3`,
      `dry_volume,${result.dryVolume.toFixed(4)},m3,Wet volume x ${result.dryFactor}`,
      `cement_mass,${result.cementKg.toFixed(2)},kg,Bulk density ${cementDensityStr} kg/m3`,
      `cement_bags_exact,${result.exactBags.toFixed(2)},bags,${result.bagWeight} kg per bag`,
      `cement_bags_order,${result.orderBags},bags,Rounded up for procurement`,
      `sand_mass,${result.sandKg.toFixed(2)},kg,${result.sandVol.toFixed(4)} m3`,
      `aggregate_mass,${result.aggKg.toFixed(2)},kg,${result.aggVol.toFixed(4)} m3`,
      `water,${result.waterL.toFixed(2)},L,w/c ratio = ${result.wcRatio}`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concrete-volume-mix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Geometry &amp; Mix</h2>
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

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              data-testid="preset-slab-m15"
              onClick={() => applyPreset('slab-m15')}
              className="px-3 py-2 rounded-xl text-xs font-black bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
            >
              Slab M15 (5x4x0.15)
            </button>
            <button
              type="button"
              data-testid="preset-column-m20"
              onClick={() => applyPreset('column-m20')}
              className="px-3 py-2 rounded-xl text-xs font-black bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
            >
              2x Column M20 (Ø0.4x3)
            </button>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {(['slab', 'column', 'footing'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`btn-shape-${s}`}
                  onClick={() => handleShapeSelect(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-black border transition-all ${
                    shape === s
                      ? 'bg-stone-700 border-stone-700 text-white'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {shape === 'column' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Diameter D (m)</label>
                <input
                  data-testid="input-diameter"
                  type="text"
                  inputMode="decimal"
                  value={diameterStr}
                  onChange={(e) => setDiameterStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Height H (m)</label>
                <input
                  data-testid="input-height"
                  type="text"
                  inputMode="decimal"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length (m)</label>
                <input
                  data-testid="input-length"
                  type="text"
                  inputMode="decimal"
                  value={lengthStr}
                  onChange={(e) => setLengthStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width (m)</label>
                <input
                  data-testid="input-width"
                  type="text"
                  inputMode="decimal"
                  value={widthStr}
                  onChange={(e) => setWidthStr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Depth (m)</label>
                <input
                  data-testid="input-height"
                  type="text"
                  inputMode="decimal"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Member Count</label>
              <input
                data-testid="input-count"
                type="text"
                inputMode="decimal"
                value={countStr}
                onChange={(e) => setCountStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Waste Factor (%)</label>
              <input
                data-testid="input-waste"
                type="text"
                inputMode="decimal"
                value={wastePctStr}
                onChange={(e) => setWastePctStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase block mb-1">Mix Ratio</label>
            <select
              data-testid="select-mix"
              value={mixId}
              onChange={(e) => setMixId(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
            >
              {MIX_RATIOS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Dry Factor</label>
              <input
                data-testid="input-dry-factor"
                type="text"
                inputMode="decimal"
                value={dryFactorStr}
                onChange={(e) => setDryFactorStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">w/c Ratio</label>
              <input
                data-testid="input-wc"
                type="text"
                inputMode="decimal"
                value={wcRatioStr}
                onChange={(e) => setWcRatioStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Cement (kg/m³)</label>
              <input
                data-testid="input-cement-density"
                type="text"
                inputMode="decimal"
                value={cementDensityStr}
                onChange={(e) => setCementDensityStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Bag Weight (kg)</label>
              <input
                data-testid="input-bag-weight"
                type="text"
                inputMode="decimal"
                value={bagWeightStr}
                onChange={(e) => setBagWeightStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Sand (kg/m³)</label>
              <input
                data-testid="input-sand-density"
                type="text"
                inputMode="decimal"
                value={sandDensityStr}
                onChange={(e) => setSandDensityStr(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">Coarse Agg (kg/m³)</label>
              <input
                data-testid="input-agg-density"
                type="text"
                inputMode="decimal"
                value={aggDensityStr}
                onChange={(e) => setAggDensityStr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Volume &amp; Batch Quantities</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="copy-summary-button"
                  disabled={!result.valid}
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
                <button
                  type="button"
                  data-testid="export-csv-button"
                  disabled={!result.valid}
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-stone-800 text-white hover:bg-stone-900 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            {mixId === 'CUSTOM_1_1_2' && (
              <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  IS 456:2000 restricts nominal volumetric mixes to M5–M20. Grades M25 and above require laboratory design mix proportioning per IS 10262 / ACI 211.1.
                </span>
              </div>
            )}

            <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
              <div className="text-xs font-black text-stone-500 uppercase tracking-wider mb-1">
                Wet Concrete Volume (Incl. Waste)
              </div>
              <div className="flex items-baseline gap-2">
                <span data-testid="result-wet-volume" className="text-4xl font-black text-stone-900">
                  {result.valid ? fmt(result.wetVolume, 3) : '—'}
                </span>
                <span className="text-lg font-bold text-stone-500">m³</span>
              </div>
              <div data-testid="result-imperial-volume" className="text-sm font-bold text-stone-600 mt-1">
                {result.valid
                  ? `Net: ${result.netVolume.toFixed(3)} m³ • ${result.wetFt3.toFixed(2)} ft³ • ${result.wetYd3.toFixed(2)} yd³ • Dry Vol: ${result.dryVolume.toFixed(3)} m³`
                  : '—'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Cement ({bagWeightStr || '50'} kg Bags)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-cement-bags" className="text-2xl font-black text-slate-800">
                    {result.valid ? fmt(result.exactBags, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">bags</span>
                </div>
                <div data-testid="result-cement-mass" className="text-xs text-slate-600 font-bold mt-1">
                  {result.valid
                    ? `${result.cementKg.toFixed(2)} kg (Order ${result.orderBags} bags • ${result.cementVol.toFixed(3)} m³)`
                    : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Fine Aggregate (Sand)</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-sand-kg" className="text-2xl font-black text-slate-800">
                    {result.valid ? fmt(result.sandKg, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">kg</span>
                </div>
                <div className="text-xs text-slate-600 font-bold mt-1">
                  {result.valid ? `${result.sandVol.toFixed(3)} m³` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Coarse Aggregate</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-agg-kg" className="text-2xl font-black text-slate-800">
                    {result.valid ? fmt(result.aggKg, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">kg</span>
                </div>
                <div className="text-xs text-slate-600 font-bold mt-1">
                  {result.valid ? `${result.aggVol.toFixed(3)} m³` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase mb-1">Mixing Water</div>
                <div className="flex items-baseline gap-1.5">
                  <span data-testid="result-water-l" className="text-2xl font-black text-slate-800">
                    {result.valid ? fmt(result.waterL, 2) : '—'}
                  </span>
                  <span className="text-sm font-bold text-slate-500">L</span>
                </div>
                <div className="text-xs text-slate-600 font-bold mt-1">
                  {result.valid ? `Based on w/c = ${result.wcRatio.toFixed(2)}` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <strong>IS 456:2000 Nominal Mix &amp; Dry Volume Method:</strong>{' '}
                <code>V_dry = V_wet × 1.54</code>, split by volumetric parts <code>c : s : a</code>. Using cement loose bulk density <code>1,440 kg/m³</code> (one <code>50 kg</code> bag ≈ <code>0.0347 m³</code>) and NIST SP 811 exact volume conversions (<code>1 ft³ = 0.3048³ m³</code>, <code>1 yd³ = 0.9144³ m³</code>).
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
