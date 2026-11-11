'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, RotateCcw, Download } from 'lucide-react';

function parseNum(str: string): number {
  const trimmed = str.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function formatFixed(n: number, digits: number): string {
  return Number.isFinite(n) ? n.toFixed(digits) : '—';
}

interface TrayPreset {
  label: string;
  width: string;
  depth: string;
  n1: string;
  d1: string;
  n2: string;
  d2: string;
  maxFill: string;
}

const PRESETS: TrayPreset[] = [
  {
    label: 'Solid Bottom 300×100 (40% Limit)',
    width: '300',
    depth: '100',
    n1: '8',
    d1: '24',
    n2: '20',
    d2: '12',
    maxFill: '40',
  },
  {
    label: 'Ladder Tray Control Only (50% Limit)',
    width: '450',
    depth: '100',
    n1: '0',
    d1: '0',
    n2: '120',
    d2: '14',
    maxFill: '50',
  },
  {
    label: 'Overfilled 150×75 Tray (Exceeds Limit)',
    width: '150',
    depth: '75',
    n1: '10',
    d1: '22',
    n2: '15',
    d2: '14',
    maxFill: '40',
  },
];

export default function CalculatorClient() {
  const [widthStr, setWidthStr] = useState(PRESETS[0].width);
  const [depthStr, setDepthStr] = useState(PRESETS[0].depth);
  const [n1Str, setN1Str] = useState(PRESETS[0].n1);
  const [d1Str, setD1Str] = useState(PRESETS[0].d1);
  const [n2Str, setN2Str] = useState(PRESETS[0].n2);
  const [d2Str, setD2Str] = useState(PRESETS[0].d2);
  const [maxFillStr, setMaxFillStr] = useState(PRESETS[0].maxFill);

  const applyPreset = (p: TrayPreset) => {
    setWidthStr(p.width);
    setDepthStr(p.depth);
    setN1Str(p.n1);
    setD1Str(p.d1);
    setN2Str(p.n2);
    setD2Str(p.d2);
    setMaxFillStr(p.maxFill);
  };

  const handleReset = () => applyPreset(PRESETS[0]);

  const result = useMemo(() => {
    const w = parseNum(widthStr);
    const h = parseNum(depthStr);
    const n1 = parseNum(n1Str);
    const d1 = parseNum(d1Str);
    const n2 = parseNum(n2Str);
    const d2 = parseNum(d2Str);
    const maxFill = parseNum(maxFillStr);

    if (
      !Number.isFinite(w) ||
      !Number.isFinite(h) ||
      !Number.isFinite(n1) ||
      !Number.isFinite(d1) ||
      !Number.isFinite(n2) ||
      !Number.isFinite(d2) ||
      !Number.isFinite(maxFill) ||
      w <= 0 ||
      h <= 0 ||
      !Number.isInteger(n1) ||
      !Number.isInteger(n2) ||
      n1 < 0 ||
      n2 < 0 ||
      n1 + n2 <= 0 ||
      (n1 > 0 && d1 <= 0) ||
      (n1 === 0 && d1 < 0) ||
      (n2 > 0 && d2 <= 0) ||
      (n2 === 0 && d2 < 0) ||
      maxFill <= 0 ||
      maxFill > 100
    ) {
      return {
        valid: false,
        fillPct: NaN,
        cableAreaCm2: NaN,
        trayAreaCm2: NaN,
        remainingAreaCm2: NaN,
        status: '—',
      };
    }

    // Step-by-step unit derivation (mm -> mm^2 -> cm^2, since 1 cm = 10 mm => 1 cm^2 = 100 mm^2):
    // 1. Usable internal tray cross-section:
    //    A_tray_mm2 [mm^2] = W [mm] * H [mm]
    //    A_tray_cm2 [cm^2] = A_tray_mm2 / 100
    // 2. Single circular cable cross-section from outer diameter d [mm]:
    //    A_single [mm^2] = (pi * d^2) / 4
    //    A_cables_mm2 [mm^2] = n1 * (pi * d1^2 / 4) + n2 * (pi * d2^2 / 4)
    //    A_cables_cm2 [cm^2] = A_cables_mm2 / 100
    // 3. Cross-sectional fill percentage:
    //    Fill% = (A_cables_mm2 / A_tray_mm2) * 100
    // 4. Remaining allowable cross-sectional area before reaching maxFill%:
    //    A_rem_cm2 [cm^2] = A_tray_cm2 * (maxFill / 100) - A_cables_cm2
    const trayAreaMm2 = w * h;
    const cable1AreaMm2 = n1 * ((Math.PI * d1 * d1) / 4);
    const cable2AreaMm2 = n2 * ((Math.PI * d2 * d2) / 4);
    const totalCableAreaMm2 = cable1AreaMm2 + cable2AreaMm2;

    const trayAreaCm2 = trayAreaMm2 / 100;
    const cableAreaCm2 = totalCableAreaMm2 / 100;
    const fillPct = (totalCableAreaMm2 / trayAreaMm2) * 100;
    const allowableAreaCm2 = trayAreaCm2 * (maxFill / 100);
    const remainingAreaCm2 = allowableAreaCm2 - cableAreaCm2;
    const status = fillPct <= maxFill ? 'Within Limit' : 'Exceeds Limit';

    return {
      valid: true,
      fillPct,
      cableAreaCm2,
      trayAreaCm2,
      remainingAreaCm2,
      status,
    };
  }, [widthStr, depthStr, n1Str, d1Str, n2Str, d2Str, maxFillStr]);

  const handleExportCsv = () => {
    if (!result.valid) return;
    const lines = [
      '# Cable Tray Cross-Sectional Fill Ratio Report',
      '# Reference: NFPA 70 (NEC) Article 392 (40% solid-bottom / 50% ladder or ventilated control & signal fill limits)',
      '# Formula: A_cable = Sum(N_i * pi * d_i^2 / 4) [mm^2] | A_cm2 = A_mm2 / 100 | Fill% = (A_cable / (W * H)) * 100',
      'Tray_Width_mm,Tray_Depth_mm,Group1_Count,Group1_OD_mm,Group2_Count,Group2_OD_mm,Max_Fill_Limit_Pct,Fill_Ratio_Pct,Total_Cable_Area_cm2,Tray_Area_cm2,Remaining_Allowable_Area_cm2,Status',
      `${widthStr.trim()},${depthStr.trim()},${n1Str.trim()},${d1Str.trim()},${n2Str.trim()},${d2Str.trim()},${maxFillStr.trim()},${formatFixed(result.fillPct, 2)},${formatFixed(result.cableAreaCm2, 2)},${formatFixed(result.trayAreaCm2, 2)},${formatFixed(result.remainingAreaCm2, 2)},${result.status}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cable-tray-fill-report.csv';
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
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Inputs &amp; Parameters</h2>
              <p className="text-xs text-slate-500 font-medium">Tray dimensions &amp; outer cable diameters</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              NEC 392 Tray Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  type="button"
                  data-testid={`preset-btn-${idx}`}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Tray Width W (mm)
              </label>
              <input
                type="text"
                data-testid="input-width"
                value={widthStr}
                onChange={(e) => setWidthStr(e.target.value)}
                placeholder="300"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Usable Depth H (mm)
              </label>
              <input
                type="text"
                data-testid="input-depth"
                value={depthStr}
                onChange={(e) => setDepthStr(e.target.value)}
                placeholder="100"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Power Cables N₁
              </label>
              <input
                type="text"
                data-testid="input-n1"
                value={n1Str}
                onChange={(e) => setN1Str(e.target.value)}
                placeholder="8"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Power OD d₁ (mm)
              </label>
              <input
                type="text"
                data-testid="input-d1"
                value={d1Str}
                onChange={(e) => setD1Str(e.target.value)}
                placeholder="24"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Control Cables N₂
              </label>
              <input
                type="text"
                data-testid="input-n2"
                value={n2Str}
                onChange={(e) => setN2Str(e.target.value)}
                placeholder="20"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Control OD d₂ (mm)
              </label>
              <input
                type="text"
                data-testid="input-d2"
                value={d2Str}
                onChange={(e) => setD2Str(e.target.value)}
                placeholder="12"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Max Fill Limit (%)
            </label>
            <p className="text-xs text-slate-400 mb-1.5">
              NEC 392 control/signal multiconductor limits: 40% solid bottom, 50% ladder/ventilated trough.
            </p>
            <input
              type="text"
              data-testid="input-max-fill"
              value={maxFillStr}
              onChange={(e) => setMaxFillStr(e.target.value)}
              placeholder="40"
              className="w-full h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:bg-white transition-all"
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
            className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Calculated Outputs</h2>
              </div>
              <div
                data-testid="result-status"
                className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border ${
                  !result.valid
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : result.status === 'Within Limit'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {result.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">
                  Cross-Sectional Fill Ratio (%)
                </div>
                <div data-testid="result-fill-pct" className="text-3xl font-black text-blue-900">
                  {formatFixed(result.fillPct, 2)}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">
                  Total Cable Area (cm²)
                </div>
                <div data-testid="result-cable-area" className="text-3xl font-black text-orange-900">
                  {formatFixed(result.cableAreaCm2, 2)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tray Internal Cross-Section (cm²)
                </div>
                <div data-testid="result-tray-area" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.trayAreaCm2, 2)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Remaining Allowable Area (cm²)
                </div>
                <div data-testid="result-remaining-area" className="text-2xl font-black text-slate-900">
                  {formatFixed(result.remainingAreaCm2, 2)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-2 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  A_cable = Σ N_i · (π · d_i² / 4) [mm²] &nbsp;|&nbsp; A [cm²] = A [mm²] / 100 &nbsp;|&nbsp; Fill % = (A_cable / (W × H)) × 100
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                Reference: NFPA 70 (National Electrical Code / NEC) Article 392 specifies maximum cross-sectional fill rates of 50% for ladder or ventilated trough trays and 40% for solid-bottom trays containing multiconductor control and/or signal cables (25% for solid-bottom trays with heat-producing cables per NEC 392.12). Power cables 4/0 AWG and larger or single-conductor installations require single-layer diameter-sum or NEC fill-area table checks.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
