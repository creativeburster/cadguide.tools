'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  Settings,
  Zap,
  Info,
  RotateCcw,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface BagPreset {
  id: string;
  label: string;
  bagKg: string;
  yieldL: string;
}

const BAG_PRESETS: BagPreset[] = [
  { id: 'quikrete-80', label: '80 lb / 36.2 kg (17.0 L yield — Quikrete 1101)', bagKg: '36.2', yieldL: '17.0' },
  { id: 'quikrete-60', label: '60 lb / 27.2 kg (12.7 L yield — Quikrete 1101)', bagKg: '27.2', yieldL: '12.7' },
  { id: 'quikrete-40', label: '40 lb / 18.1 kg (8.5 L yield — Quikrete 1101)', bagKg: '18.1', yieldL: '8.5' },
  { id: 'metric-40', label: 'Metric 40 kg (18.8 L ref yield ~2128 kg/m³)', bagKg: '40', yieldL: '18.8' },
];

const CUBIC_YARD_TO_M3 = 0.764554858;

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

export default function ConcreteSlabVolumeCalculatorClient() {
  const [shape, setShape] = useState<'rect' | 'circular'>('rect');
  const [lengthStr, setLengthStr] = useState<string>('10');
  const [widthStr, setWidthStr] = useState<string>('5');
  const [diameterStr, setDiameterStr] = useState<string>('4');
  const [thicknessStr, setThicknessStr] = useState<string>('150');
  const [wastePctStr, setWastePctStr] = useState<string>('10');

  const [bagPresetId, setBagPresetId] = useState<string>('quikrete-80');
  const [bagWeightStr, setBagWeightStr] = useState<string>('36.2');
  const [bagYieldLStr, setBagYieldLStr] = useState<string>('17.0');
  const [bagCostStr, setBagCostStr] = useState<string>('8');
  const [copied, setCopied] = useState<boolean>(false);

  const handleBagPreset = (id: string) => {
    setBagPresetId(id);
    const p = BAG_PRESETS.find((item) => item.id === id);
    if (p) {
      setBagWeightStr(p.bagKg);
      setBagYieldLStr(p.yieldL);
    }
  };

  const handleReset = () => {
    setShape('rect');
    setLengthStr('10');
    setWidthStr('5');
    setDiameterStr('4');
    setThicknessStr('150');
    setWastePctStr('10');
    setBagPresetId('quikrete-80');
    setBagWeightStr('36.2');
    setBagYieldLStr('17.0');
    setBagCostStr('8');
    setCopied(false);
  };

  const result = useMemo(() => {
    const T_mm = parsePositive(thicknessStr);
    const wastePct = parseNonNegative(wastePctStr);
    const bagKg = parsePositive(bagWeightStr);
    const yieldL = parsePositive(bagYieldLStr);
    const bagCost = parseNonNegative(bagCostStr);

    let netVol = Number.NaN;
    let areaM2 = Number.NaN;
    if (shape === 'rect') {
      const L = parsePositive(lengthStr);
      const W = parsePositive(widthStr);
      if (Number.isFinite(L) && Number.isFinite(W) && Number.isFinite(T_mm)) {
        areaM2 = L * W;
        netVol = areaM2 * (T_mm / 1000);
      }
    } else {
      const D = parsePositive(diameterStr);
      if (Number.isFinite(D) && Number.isFinite(T_mm)) {
        areaM2 = (Math.PI * D * D) / 4;
        netVol = areaM2 * (T_mm / 1000);
      }
    }

    if (
      !Number.isFinite(netVol) ||
      !Number.isFinite(wastePct) ||
      wastePct > 100 ||
      !Number.isFinite(bagKg) ||
      !Number.isFinite(yieldL) ||
      !Number.isFinite(bagCost)
    ) {
      return { valid: false as const };
    }

    const orderVolM3 = netVol * (1 + wastePct / 100);
    const orderVolYd3 = orderVolM3 / CUBIC_YARD_TO_M3;
    const orderLiters = orderVolM3 * 1000;
    const exactBags = orderLiters / yieldL;
    const bags = Math.ceil(exactBags);
    const totalDryKg = bags * bagKg;
    const totalCost = bags * bagCost;
    const bagsPerM3 = 1000 / yieldL;

    return {
      valid: true as const,
      areaM2,
      netVol,
      orderVolM3,
      orderVolYd3,
      orderLiters,
      exactBags,
      bags,
      bagKg,
      yieldL,
      bagsPerM3,
      totalDryKg,
      totalCost,
      wastePct,
    };
  }, [shape, lengthStr, widthStr, diameterStr, thicknessStr, wastePctStr, bagWeightStr, bagYieldLStr, bagCostStr]);

  const handleCopySummary = async () => {
    if (!result.valid) return;
    const text = [
      `Concrete Slab Volume & Bag Estimate (${shape === 'rect' ? 'Rectangular' : 'Circular'})`,
      `Area = ${result.areaM2.toFixed(2)} m2 | Net Volume = ${result.netVol.toFixed(3)} m3`,
      `Order Volume (+${result.wastePct}% waste) = ${result.orderVolM3.toFixed(3)} m3 (${result.orderVolYd3.toFixed(3)} yd3)`,
      `Pre-mixed Bags (${result.bagKg} kg @ ${result.yieldL} L/bag): ${result.bags} bags (${result.totalDryKg.toFixed(1)} kg dry mix)`,
      `Estimated Bag Cost: $${result.totalCost.toFixed(2)}`,
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
      `geometry,${shape},-,Rectangular or Circular slab`,
      `surface_area,${result.areaM2.toFixed(3)},m2,Plan area`,
      `net_volume,${result.netVol.toFixed(4)},m3,Exact geometric volume`,
      `waste_allowance,${result.wastePct.toFixed(1)},%,Over-excavation/spillage factor`,
      `order_volume_m3,${result.orderVolM3.toFixed(4)},m3,Ready-mix concrete volume incl waste`,
      `order_volume_yd3,${result.orderVolYd3.toFixed(4)},yd3,Cubic yards (1 yd3 = 0.764555 m3)`,
      `bag_weight,${result.bagKg.toFixed(2)},kg,Dry mix mass per bag`,
      `bag_yield,${result.yieldL.toFixed(2)},L/bag,Mixed wet yield per bag`,
      `bags_needed,${result.bags},bags,ceil(order_L / bag_yield_L)`,
      `total_dry_mass,${result.totalDryKg.toFixed(1)},kg,bags * bag_weight`,
      `total_cost,${result.totalCost.toFixed(2)},$,bags * cost_per_bag`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concrete-slab-volume.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Slab &amp; Bag Specs</h2>
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

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Slab Geometry
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['rect', 'circular'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`shape-${s}`}
                  onClick={() => setShape(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-black border transition-all ${
                    shape === s
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {s === 'rect' ? 'Rectangular' : 'Circular Pad'}
                </button>
              ))}
            </div>
          </div>

          {shape === 'rect' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                  Length L (m)
                </label>
                <input
                  data-testid="input-length"
                  type="text"
                  inputMode="decimal"
                  value={lengthStr}
                  onChange={(e) => setLengthStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                  Width W (m)
                </label>
                <input
                  data-testid="input-width"
                  type="text"
                  inputMode="decimal"
                  value={widthStr}
                  onChange={(e) => setWidthStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Diameter D (m)
              </label>
              <input
                data-testid="input-diameter"
                type="text"
                inputMode="decimal"
                value={diameterStr}
                onChange={(e) => setDiameterStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Thickness T (mm)
              </label>
              <input
                data-testid="input-thickness"
                type="text"
                inputMode="decimal"
                value={thicknessStr}
                onChange={(e) => setThicknessStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase block mb-1">
                Waste Margin (%)
              </label>
              <input
                data-testid="input-waste"
                type="text"
                inputMode="decimal"
                value={wastePctStr}
                onChange={(e) => setWastePctStr(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Bag Specification Preset
            </label>
            <select
              data-testid="select-bag-preset"
              value={bagPresetId}
              onChange={(e) => handleBagPreset(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              {BAG_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
              <option value="custom">Custom Regional Bag</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">Bag Mass (kg)</label>
              <input
                data-testid="input-bag-kg"
                type="text"
                inputMode="decimal"
                value={bagWeightStr}
                onChange={(e) => {
                  setBagPresetId('custom');
                  setBagWeightStr(e.target.value);
                }}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">Yield (L/bag)</label>
              <input
                data-testid="input-bag-yield"
                type="text"
                inputMode="decimal"
                value={bagYieldLStr}
                onChange={(e) => {
                  setBagPresetId('custom');
                  setBagYieldLStr(e.target.value);
                }}
                className="w-full h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 block mb-1">Cost ($/bag)</label>
              <input
                data-testid="input-bag-cost"
                type="text"
                inputMode="decimal"
                value={bagCostStr}
                onChange={(e) => setBagCostStr(e.target.value)}
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
                  Ready-Mix Volume &amp; Bagged Concrete Results
                </h2>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Order Volume (with Waste)
                </div>
                <div data-testid="result-order-vol" className="text-3xl font-black text-blue-800">
                  {result.valid ? `${result.orderVolM3.toFixed(3)} m³` : '—'}
                </div>
                <div data-testid="result-vol-sub" className="text-xs font-bold text-blue-700 mt-1">
                  {result.valid
                    ? `Net: ${result.netVol.toFixed(3)} m³ • ${result.orderVolYd3.toFixed(3)} yd³`
                    : '—'}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Pre-Mixed Bags Needed
                </div>
                <div data-testid="result-bags" className="text-3xl font-black text-emerald-800">
                  {result.valid ? `${result.bags}` : '—'}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  {result.valid
                    ? `Exact: ${result.exactBags.toFixed(2)} bags (${result.bagsPerM3.toFixed(2)} bags/m³)`
                    : '—'}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-1">
                  Total Material Cost
                </div>
                <div data-testid="result-cost" className="text-2xl font-black text-orange-800">
                  {result.valid ? `$${fmt(result.totalCost, 2)}` : '—'}
                </div>
                <div className="text-xs font-bold text-orange-700 mt-1">
                  {result.valid ? `Total dry bag mass: ${fmt(result.totalDryKg, 1)} kg` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Slab Footprint Area
                </div>
                <div data-testid="result-area" className="text-2xl font-black text-slate-800">
                  {result.valid ? `${fmt(result.areaM2, 2)} m²` : '—'}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  {result.valid ? `Order volume in liters: ${fmt(result.orderLiters, 0)} L` : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <div>
                  <strong>Volume &amp; Yield Equations:</strong> Net geometric volume{' '}
                  <code>V_net = L·W·(T/1000)</code> (or <code>π·D²/4·(T/1000)</code>); ready-mix order volume{' '}
                  <code>V_order = V_net·(1 + waste/100)</code>. Bag count{' '}
                  <code>bags = ceil(1000·V_order / yield_L)</code>. Reference yields per QUIKRETE Concrete Mix No. 1101 Data Sheet: 80 lb (36.2 kg) &approx; 17 L, 60 lb (27.2 kg) &approx; 12.7 L, 40 lb (18.1 kg) &approx; 8.5 L. Always edit bag mass and manufacturer yield to match local regional bags.
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
