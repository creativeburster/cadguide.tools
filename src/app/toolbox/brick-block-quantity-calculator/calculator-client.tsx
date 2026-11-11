'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, Download, RotateCcw } from 'lucide-react';

type UnitType = 'us_modular' | 'uk_brick' | 'cmu' | 'custom';

interface UnitPreset {
  name: string;
  length: string;
  width: string;
  height: string;
}

// Actual work dimensions (mm, excluding mortar joints):
// US Modular Brick: 194 × 92 × 57 mm
// UK Standard Brick: 215 × 102.5 × 65 mm
// Metric CMU Block (AU/NZ/CA): 390 × 190 × 190 mm
const UNIT_PRESETS: Record<UnitType, UnitPreset> = {
  us_modular: { name: 'US Modular Brick (194×92×57 mm)', length: '194', width: '92', height: '57' },
  uk_brick: { name: 'UK Standard Brick (215×102.5×65 mm)', length: '215', width: '102.5', height: '65' },
  cmu: { name: 'Metric CMU Block (390×190×190 mm)', length: '390', width: '190', height: '190' },
  custom: { name: 'Custom Unit Dimensions', length: '200', width: '100', height: '60' },
};

const parseNum = (str: string): number => {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
};

const formatFixed = (n: number, digits: number): string => {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
};

export default function BrickBlockQuantityCalculatorClient() {
  const [unitType, setUnitType] = useState<UnitType>('us_modular');
  const [wallLength, setWallLength] = useState('5000');
  const [wallHeight, setWallHeight] = useState('2700');
  const [wythes, setWythes] = useState('1');
  const [jointThickness, setJointThickness] = useState('10');
  const [brickLength, setBrickLength] = useState('194');
  const [brickWidth, setBrickWidth] = useState('92');
  const [brickHeight, setBrickHeight] = useState('57');
  const [openingAreaM2, setOpeningAreaM2] = useState('0');
  const [wasteFactor, setWasteFactor] = useState('5');
  const [cementBagsPerM3, setCementBagsPerM3] = useState('6.5');

  const handleUnitChange = (t: UnitType) => {
    setUnitType(t);
    const p = UNIT_PRESETS[t];
    setBrickLength(p.length);
    setBrickWidth(p.width);
    setBrickHeight(p.height);
  };

  const handleReset = () => {
    setUnitType('us_modular');
    setWallLength('5000');
    setWallHeight('2700');
    setWythes('1');
    setJointThickness('10');
    setBrickLength('194');
    setBrickWidth('92');
    setBrickHeight('57');
    setOpeningAreaM2('0');
    setWasteFactor('5');
    setCementBagsPerM3('6.5');
  };

  const result = useMemo(() => {
    const wl = parseNum(wallLength);
    const wh = parseNum(wallHeight);
    const wt = parseNum(wythes);
    const jt = parseNum(jointThickness);
    const bl = parseNum(brickLength);
    const bw = parseNum(brickWidth);
    const bh = parseNum(brickHeight);
    const oa = parseNum(openingAreaM2);
    const wf = parseNum(wasteFactor);
    const bagsFactor = parseNum(cementBagsPerM3);

    const baseValid =
      Number.isFinite(wl) &&
      Number.isFinite(wh) &&
      Number.isFinite(wt) &&
      Number.isFinite(jt) &&
      Number.isFinite(bl) &&
      Number.isFinite(bw) &&
      Number.isFinite(bh) &&
      Number.isFinite(oa) &&
      Number.isFinite(wf) &&
      Number.isFinite(bagsFactor) &&
      wl > 0 &&
      wh > 0 &&
      Number.isInteger(wt) &&
      wt >= 1 &&
      jt >= 0 &&
      bl > 0 &&
      bw > 0 &&
      bh > 0 &&
      oa >= 0 &&
      wf >= 0 &&
      bagsFactor > 0;

    if (!baseValid) {
      return {
        valid: false,
        wallArea: NaN,
        bricksPerM2: NaN,
        totalBricks: NaN,
        mortarVolumeM3: NaN,
        cementBags: NaN,
      };
    }

    // Step-by-step unit derivation:
    // 1. Gross wall area: (wl [mm] * wh [mm]) / 10^6 [mm^2/m^2] -> [m^2].
    //    Net wall area: A_net = A_gross - openingAreaM2 [m^2] (must be > 0).
    // 2. Units per m^2 per wythe: 10^6 [mm^2/m^2] / ((bl + jt) [mm] * (bh + jt) [mm]).
    // 3. Net units = A_net * bricksPerM2 * wt; Total units = ceil(Net units * (1 + wf / 100)).
    // 4. Total wall thickness for wt wythes with (wt - 1) collar joints:
    //    t_wall = (wt * bw + (wt - 1) * jt) / 1000 [m].
    // 5. Net masonry wall volume: V_wall = A_net [m^2] * t_wall [m] -> [m^3].
    // 6. Net solid bounding volume of masonry units (1 mm^3 = 10^-9 m^3):
    //    V_units = netBricks * (bl * bw * bh * 1e-9) [m^3].
    // 7. Mortar volume including waste: V_mortar = max(0, V_wall - V_units) * (1 + wf / 100) [m^3].
    // 8. Cement bags: ceil(V_mortar * cementBagsPerM3).
    const grossAreaM2 = (wl * wh) / 1_000_000;
    const wallArea = grossAreaM2 - oa;
    if (wallArea <= 0) {
      return {
        valid: false,
        wallArea: NaN,
        bricksPerM2: NaN,
        totalBricks: NaN,
        mortarVolumeM3: NaN,
        cementBags: NaN,
      };
    }

    const bricksPerM2 = 1_000_000 / ((bl + jt) * (bh + jt));
    const netBricks = wallArea * bricksPerM2 * wt;
    const totalBricks = Math.ceil(netBricks * (1 + wf / 100));

    const wallThicknessM = (wt * bw + (wt - 1) * jt) / 1000;
    const wallVolumeM3 = wallArea * wallThicknessM;
    const netBrickVolumeM3 = netBricks * (bl * bw * bh * 1e-9);
    const netMortarVolumeM3 = Math.max(0, wallVolumeM3 - netBrickVolumeM3);
    const mortarVolumeM3 = netMortarVolumeM3 * (1 + wf / 100);
    const cementBags = Math.ceil(mortarVolumeM3 * bagsFactor);

    return {
      valid: true,
      wallArea,
      bricksPerM2,
      totalBricks,
      mortarVolumeM3,
      cementBags,
    };
  }, [
    wallLength,
    wallHeight,
    wythes,
    jointThickness,
    brickLength,
    brickWidth,
    brickHeight,
    openingAreaM2,
    wasteFactor,
    cementBagsPerM3,
  ]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Brick & Block Masonry Takeoff Report',
      '# Basis: Volumetric Masonry Takeoff Geometry (Coordinated Unit Dimensions & Joint Deduction)',
      '# Formula: A_net = (W_L*W_H)/10^6 - A_open | Units/m2 = 10^6/((L+j)*(H+j)) | Total_Units = ceil(A_net * Units/m2 * wythes * (1+waste%)) | V_mortar = (V_wall - V_units)*(1+waste%)',
      'Unit_Type,Wall_Length_mm,Wall_Height_mm,Wythes,Joint_mm,Unit_L_mm,Unit_W_mm,Unit_H_mm,Opening_m2,Waste_pct,Cement_Factor_bags_m3,Net_Wall_Area_m2,Units_per_m2,Total_Units,Mortar_Volume_m3,Cement_Bags',
      `${unitType},${wallLength.trim()},${wallHeight.trim()},${wythes.trim()},${jointThickness.trim()},${brickLength.trim()},${brickWidth.trim()},${brickHeight.trim()},${openingAreaM2.trim()},${wasteFactor.trim()},${cementBagsPerM3.trim()},${formatFixed(result.wallArea, 2)},${formatFixed(result.bricksPerM2, 2)},${result.totalBricks},${formatFixed(result.mortarVolumeM3, 3)},${result.cementBags}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brick-block-quantity-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs</h2>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Standard Unit Preset
            </label>
            <select
              data-testid="select-unit-type"
              value={unitType}
              onChange={(e) => handleUnitChange(e.target.value as UnitType)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            >
              {Object.entries(UNIT_PRESETS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Wall Length (mm)
              </label>
              <input
                type="text"
                data-testid="input-wall-length"
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Wall Height (mm)
              </label>
              <input
                type="text"
                data-testid="input-wall-height"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Wythes (integer ≥ 1)
              </label>
              <input
                type="text"
                data-testid="input-wythes"
                value={wythes}
                onChange={(e) => setWythes(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Mortar Joint (mm)
              </label>
              <input
                type="text"
                data-testid="input-joint"
                value={jointThickness}
                onChange={(e) => setJointThickness(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400">Typical value: 10 mm (~3/8 in)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Unit L (mm)
              </label>
              <input
                type="text"
                data-testid="input-brick-l"
                value={brickLength}
                onChange={(e) => setBrickLength(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Unit W (mm)
              </label>
              <input
                type="text"
                data-testid="input-brick-w"
                value={brickWidth}
                onChange={(e) => setBrickWidth(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Unit H (mm)
              </label>
              <input
                type="text"
                data-testid="input-brick-h"
                value={brickHeight}
                onChange={(e) => setBrickHeight(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Opening Area (m²)
              </label>
              <input
                type="text"
                data-testid="input-opening"
                value={openingAreaM2}
                onChange={(e) => setOpeningAreaM2(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Waste Factor (%)
              </label>
              <input
                type="text"
                data-testid="input-waste"
                value={wasteFactor}
                onChange={(e) => setWasteFactor(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-400">Typical value: 5%–10%</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Cement Yield Factor (bags / m³ mortar)
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Typical value: ~6.0–7.5 (50 kg cement bags per m³ wet mortar for 1:5–1:4 mix); adjust per mix design.
            </p>
            <input
              type="text"
              data-testid="input-cement-factor"
              value={cementBagsPerM3}
              onChange={(e) => setCementBagsPerM3(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              data-testid="reset-btn"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="button"
              data-testid="export-csv-btn"
              onClick={handleExportCsv}
              disabled={!result.valid}
              className="flex-1 py-3 rounded-xl text-sm font-black bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div
            data-testid="calculator-results"
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Results</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Net Wall Area
                </div>
                <div className="text-3xl font-black text-blue-700">
                  <span data-testid="result-area">{formatFixed(result.wallArea, 2)}</span>
                  {result.valid && <span className="text-lg text-blue-400"> m²</span>}
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-500 uppercase tracking-wider mb-2">
                  Units / m² (per wythe)
                </div>
                <div data-testid="result-per-m2" className="text-3xl font-black text-green-700">
                  {formatFixed(result.bricksPerM2, 2)}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">
                  Total Units (incl. waste)
                </div>
                <div data-testid="result-total-bricks" className="text-3xl font-black text-orange-700">
                  {result.valid ? String(result.totalBricks) : '—'}
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-xs font-black text-purple-500 uppercase tracking-wider mb-2">
                  Mortar Volume (incl. waste)
                </div>
                <div className="text-3xl font-black text-purple-700">
                  <span data-testid="result-mortar">{formatFixed(result.mortarVolumeM3, 3)}</span>
                  {result.valid && <span className="text-lg text-purple-400"> m³</span>}
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                <div className="text-xs font-black text-rose-500 uppercase tracking-wider mb-2">
                  Cement Bags
                </div>
                <div data-testid="result-cement-bags" className="text-3xl font-black text-rose-700">
                  {result.valid ? String(result.cementBags) : '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Units/m² = 10⁶ / ((L + j) · (H + j)) &nbsp;|&nbsp; Total Units = ⌈A_net · Units/m² · wythes · (1 + waste%)⌉ &nbsp;|&nbsp; V_mortar = (V_wall − V_units) · (1 + waste%)
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">
                Mortar volume is computed from bed, head, and multi-wythe collar joint space between unit outer bounding dimensions (L × W × H). For hollow CMU core grouting, calculate core fill concrete separately.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
