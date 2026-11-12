'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

type TileModuleId = '600x600' | '600x1200';

const TILE_MODULES: Record<TileModuleId, { label: string; areaSqm: number }> = {
  '600x600': {
    label: '600 mm × 600 mm Metric Square Module (0.36 m²)',
    areaSqm: 0.36,
  },
  '600x1200': {
    label: '600 mm × 1200 mm Metric Rectangular Module (0.72 m²)',
    areaSqm: 0.72,
  },
};

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

function safeCeil(val: number): number {
  return Math.ceil(val - 1e-9);
}

export default function CeilingGridCalculatorClient() {
  const [lengthStr, setLengthStr] = useState<string>('12');
  const [widthStr, setWidthStr] = useState<string>('8');
  const [tileModule, setTileModule] = useState<TileModuleId>('600x600');
  const [wastePctStr, setWastePctStr] = useState<string>('10');
  const [mainSpacingStr, setMainSpacingStr] = useState<string>('1.2');
  const [mainBarLenStr, setMainBarLenStr] = useState<string>('3.6');
  const [wallBarLenStr, setWallBarLenStr] = useState<string>('3.0');

  const applyPreset = (
    len: string,
    wid: string,
    mod: TileModuleId,
    waste: string,
    spacing = '1.2',
    mainLen = '3.6',
    wallLen = '3.0'
  ) => {
    setLengthStr(len);
    setWidthStr(wid);
    setTileModule(mod);
    setWastePctStr(waste);
    setMainSpacingStr(spacing);
    setMainBarLenStr(mainLen);
    setWallBarLenStr(wallLen);
  };

  const handleReset = () => {
    applyPreset('12', '8', '600x600', '10', '1.2', '3.6', '3.0');
  };

  /**
   * Modular Suspended Ceiling Takeoff Equations:
   * 1. Floor / Ceiling Area A = L * W [m²], Room Perimeter P = 2 * (L + W) [m]
   * 2. Tile Unit Area A_tile = 0.36 m² (600x600 mm) or 0.72 m² (600x1200 mm)
   * 3. Total Ceiling Tiles N_tiles = ceil((A / A_tile) * (1 + w / 100))
   * 4. Wall Angle Trim Bars N_wall = ceil(P / L_wall)
   * 5. Main T-Bar Runners (area-density estimate) N_main = ceil(A / (s_main * L_main))
   */
  const calc = useMemo(() => {
    const L = parseStrictNumber(lengthStr);
    const W = parseStrictNumber(widthStr);
    const wastePct = parseStrictNumber(wastePctStr);
    const sMain = parseStrictNumber(mainSpacingStr);
    const lenMain = parseStrictNumber(mainBarLenStr);
    const lenWall = parseStrictNumber(wallBarLenStr);

    const modInfo = TILE_MODULES[tileModule];
    if (
      !modInfo ||
      !Number.isFinite(L) ||
      !Number.isFinite(W) ||
      !Number.isFinite(wastePct) ||
      !Number.isFinite(sMain) ||
      !Number.isFinite(lenMain) ||
      !Number.isFinite(lenWall) ||
      L <= 0 ||
      W <= 0 ||
      wastePct < 0 ||
      wastePct > 100 ||
      sMain <= 0 ||
      lenMain <= 0 ||
      lenWall <= 0
    ) {
      return { isValid: false as const };
    }

    const area = L * W;
    const perimeter = 2 * (L + W);
    const tilesNeeded = safeCeil((area / modInfo.areaSqm) * (1 + wastePct / 100));
    const wallAngleBars = safeCeil(perimeter / lenWall);
    const mainRunners = safeCeil(area / (sMain * lenMain));

    return {
      isValid: true as const,
      L,
      W,
      wastePct,
      sMain,
      lenMain,
      lenWall,
      modInfo,
      area,
      perimeter,
      tilesNeeded,
      wallAngleBars,
      mainRunners,
    };
  }, [lengthStr, widthStr, tileModule, wastePctStr, mainSpacingStr, mainBarLenStr, wallBarLenStr]);

  const handleExportCsv = () => {
    if (!calc.isValid) return;
    const rows = [
      ['Parameter', 'Value', 'Unit', 'Notes'],
      ['Room Length (L)', calc.L.toFixed(2), 'm', 'Interior finished span'],
      ['Room Width (W)', calc.W.toFixed(2), 'm', 'Interior finished width'],
      ['Tile Module', calc.modInfo.label, '-', `Unit area = ${calc.modInfo.areaSqm.toFixed(2)} m²`],
      ['Cut Waste Allowance (w)', calc.wastePct.toFixed(1), '%', 'Perimeter cut & handling allowance'],
      ['Main Tee Center Spacing (s_main)', calc.sMain.toFixed(2), 'm', 'Typical metric span = 1.20 m (1200 mm)'],
      ['Main Tee Stock Length (L_main)', calc.lenMain.toFixed(2), 'm', 'Typical stock bar = 3.60 m (3600 mm)'],
      ['Wall Angle Stock Length (L_wall)', calc.lenWall.toFixed(2), 'm', 'Typical perimeter trim = 3.00 m'],
      ['Finished Ceiling Area (A)', calc.area.toFixed(2), 'm²', 'A = L * W'],
      ['Room Perimeter (P)', calc.perimeter.toFixed(2), 'm', 'P = 2 * (L + W)'],
      ['Total Ceiling Tiles Required', String(calc.tilesNeeded), 'pcs', 'ceil((A / A_tile) * (1 + w / 100))'],
      ['Wall Angle Trim Bars', String(calc.wallAngleBars), 'bars', 'ceil(P / L_wall)'],
      ['Main T-Bar Runners (Area Estimate)', String(calc.mainRunners), 'runners', 'ceil(A / (s_main * L_main))'],
      ['Grid System Standards Note', 'ASTM C635 / BS EN 13964 (Suspension grid duty ratings & deflection test standards)', '-', 'Modular area takeoff per manufacturer grid layout guidelines'],
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ceiling-grid-takeoff.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Room &amp; Grid Parameters</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Modular Lay-In Ceiling Takeoff
                </p>
              </div>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="preset-office-600"
                onClick={() => applyPreset('12', '8', '600x600', '10')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                12×8m · 600×600
              </button>
              <button
                type="button"
                data-testid="preset-office-1200"
                onClick={() => applyPreset('12', '8', '600x1200', '10')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                12×8m · 600×1200
              </button>
              <button
                type="button"
                data-testid="preset-exact-6x6"
                onClick={() => applyPreset('6', '6', '600x600', '0')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                6×6m · 0% Waste
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Room Length L (m)
                </label>
                <input
                  type="text"
                  data-testid="input-room-length"
                  value={lengthStr}
                  onChange={(e) => setLengthStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                  Room Width W (m)
                </label>
                <input
                  type="text"
                  data-testid="input-room-width"
                  value={widthStr}
                  onChange={(e) => setWidthStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Ceiling Tile Module
              </label>
              <select
                data-testid="select-tile-module"
                value={tileModule}
                onChange={(e) => setTileModule(e.target.value as TileModuleId)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              >
                <option value="600x600">{TILE_MODULES['600x600'].label}</option>
                <option value="600x1200">{TILE_MODULES['600x1200'].label}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Cut Waste Allowance w (%, 0–100)
              </label>
              <input
                type="text"
                data-testid="input-waste-pct"
                value={wastePctStr}
                onChange={(e) => setWastePctStr(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Grid Stock &amp; Spacing (Editable Typical Values)
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Main Spacing (m)
                  </label>
                  <input
                    type="text"
                    data-testid="input-main-spacing"
                    value={mainSpacingStr}
                    onChange={(e) => setMainSpacingStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Main Tee Bar (m)
                  </label>
                  <input
                    type="text"
                    data-testid="input-main-length"
                    value={mainBarLenStr}
                    onChange={(e) => setMainBarLenStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Wall Angle (m)
                  </label>
                  <input
                    type="text"
                    data-testid="input-wall-length"
                    value={wallBarLenStr}
                    onChange={(e) => setWallBarLenStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-export-csv"
            disabled={!calc.isValid}
            onClick={handleExportCsv}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-black flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Ceiling Takeoff CSV
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Bill of Materials Estimate
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
              <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                Total Ceiling Tiles Required
              </div>
              <div className="text-4xl font-black font-mono text-blue-900">
                <span data-testid="out-tiles-needed">
                  {calc.isValid ? String(calc.tilesNeeded) : '—'}
                </span>{' '}
                <span className="text-lg font-bold text-blue-600">pcs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Finished Ceiling Area (A)
                </div>
                <div className="text-2xl font-black font-mono text-slate-900">
                  <span data-testid="out-ceiling-area">
                    {calc.isValid ? calc.area.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-slate-500">m²</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  Room Perimeter (P)
                </div>
                <div className="text-2xl font-black font-mono text-slate-900">
                  <span data-testid="out-perimeter">
                    {calc.isValid ? calc.perimeter.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-slate-500">m</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Wall Angle Trim Bars
                </div>
                <div className="text-2xl font-black font-mono text-emerald-800">
                  <span data-testid="out-wall-angle">
                    {calc.isValid ? String(calc.wallAngleBars) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-emerald-600">bars</span>
                </div>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-100">
                <div className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
                  Main T-Bar Runners (Area Estimate)
                </div>
                <div className="text-2xl font-black font-mono text-amber-800">
                  <span data-testid="out-main-runners">
                    {calc.isValid ? String(calc.mainRunners) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-amber-600">runners</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Modular Takeoff Formulas &amp; Suspension Grid Standards:</span>
              </div>
              <p className="font-mono text-slate-700">
                A = L × W, P = 2(L + W), Tiles = ceil((A / A_tile) × (1 + w / 100))
              </p>
              <p className="font-mono text-slate-700">
                Wall Angle = ceil(P / L_wall), Main Runners = ceil(A / (s_main × L_main))
              </p>
              <p className="text-slate-500">
                Scope note: Metal suspension grid mechanical load ratings (Light / Intermediate / Heavy Duty) and span
                deflection testing are governed by <strong>ASTM C635</strong> and <strong>BS EN 13964</strong> (metric
                600 × 600 mm and 1200 × 600 mm lay-in modules with main tees typically spaced at 1200 mm centers). The
                material counts above are modular area-density estimates; exact bar counts vary slightly with runner
                orientation, border tile symmetry, and MEP light/diffuser cutouts on your Reflected Ceiling Plan (RCP).
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
