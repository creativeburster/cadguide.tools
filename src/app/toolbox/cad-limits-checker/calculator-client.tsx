'use client';

import { useState, useMemo } from 'react';
import { Info, Copy, Check, FileText, Settings, Download, RotateCcw } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface PaperPreset {
  id: string;
  name: string;
  widthMm: string;
  heightMm: string;
  standardNote: string;
}

/**
 * Standard drawing sheet sizes:
 * - ISO A0 to A4 per ISO 216 international paper size standard.
 * - North American Architectural sizes ARCH E (36 x 48 in) and ARCH D (24 x 36 in),
 *   converted with exact 1 in = 25.4 mm (914.4 x 1219.2 mm and 609.6 x 914.4 mm).
 */
const PAPER_PRESETS: PaperPreset[] = [
  { id: 'iso-a0', name: 'ISO A0 (1189 x 841 mm)', widthMm: '1189', heightMm: '841', standardNote: 'ISO 216 A-series' },
  { id: 'iso-a1', name: 'ISO A1 (841 x 594 mm)', widthMm: '841', heightMm: '594', standardNote: 'ISO 216 A-series' },
  { id: 'iso-a2', name: 'ISO A2 (594 x 420 mm)', widthMm: '594', heightMm: '420', standardNote: 'ISO 216 A-series' },
  { id: 'iso-a3', name: 'ISO A3 (420 x 297 mm)', widthMm: '420', heightMm: '297', standardNote: 'ISO 216 A-series' },
  { id: 'iso-a4', name: 'ISO A4 (297 x 210 mm)', widthMm: '297', heightMm: '210', standardNote: 'ISO 216 A-series' },
  { id: 'arch-e', name: 'ARCH E (1219.2 x 914.4 mm / 48 x 36 in)', widthMm: '1219.2', heightMm: '914.4', standardNote: 'North American ARCH (36 x 48 in)' },
  { id: 'arch-d', name: 'ARCH D (914.4 x 609.6 mm / 36 x 24 in)', widthMm: '914.4', heightMm: '609.6', standardNote: 'North American ARCH (24 x 36 in)' },
];

const QUICK_SCALES = ['1', '10', '20', '50', '100', '200', '500'];

type DrawingUnit = 'mm' | 'm';

const UNIT_MM_FACTOR: Record<DrawingUnit, number> = {
  mm: 1,
  m: 1000,
};

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const val = Number(trimmed);
  return Number.isFinite(val) ? val : NaN;
}

export default function LimitsCheckerClient() {
  const [paperPresetId, setPaperPresetId] = useState<string>('iso-a3');
  const [sheetWidthStr, setSheetWidthStr] = useState<string>('420');
  const [sheetHeightStr, setSheetHeightStr] = useState<string>('297');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [unit, setUnit] = useState<DrawingUnit>('mm');
  const [scaleDenominatorStr, setScaleDenominatorStr] = useState<string>('100');
  const [paperGridPitchStr, setPaperGridPitchStr] = useState<string>('10');
  const [snapSubdivStr, setSnapSubdivStr] = useState<string>('5');
  const [limcheckVal, setLimcheckVal] = useState<'0' | '1'>('0');
  const [copiedState, setCopiedState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleSelectPaperPreset = (id: string) => {
    setPaperPresetId(id);
    const found = PAPER_PRESETS.find((p) => p.id === id);
    if (found) {
      setSheetWidthStr(found.widthMm);
      setSheetHeightStr(found.heightMm);
    }
  };

  const applyScenarioPreset = (presetKey: 'a3-mm-100' | 'a1-m-200' | 'archd-mm-50') => {
    setCopiedState('idle');
    if (presetKey === 'a3-mm-100') {
      setPaperPresetId('iso-a3');
      setSheetWidthStr('420');
      setSheetHeightStr('297');
      setOrientation('landscape');
      setUnit('mm');
      setScaleDenominatorStr('100');
      setPaperGridPitchStr('10');
      setSnapSubdivStr('5');
      setLimcheckVal('0');
    } else if (presetKey === 'a1-m-200') {
      setPaperPresetId('iso-a1');
      setSheetWidthStr('841');
      setSheetHeightStr('594');
      setOrientation('landscape');
      setUnit('m');
      setScaleDenominatorStr('200');
      setPaperGridPitchStr('10');
      setSnapSubdivStr('5');
      setLimcheckVal('1');
    } else {
      setPaperPresetId('arch-d');
      setSheetWidthStr('914.4');
      setSheetHeightStr('609.6');
      setOrientation('portrait');
      setUnit('mm');
      setScaleDenominatorStr('50');
      setPaperGridPitchStr('10');
      setSnapSubdivStr('4');
      setLimcheckVal('0');
    }
  };

  const handleReset = () => {
    applyScenarioPreset('a3-mm-100');
  };

  /**
   * Step-by-step unit derivation:
   * 1. Sheet dimensions in mm:
   *    longSide_mm  = max(W_sheet, H_sheet) [mm]
   *    shortSide_mm = min(W_sheet, H_sheet) [mm]
   *    X_sheet [mm] = longSide_mm  (landscape) or shortSide_mm (portrait)
   *    Y_sheet [mm] = shortSide_mm (landscape) or longSide_mm  (portrait)
   * 2. Model-space unit conversion factor k_u [mm / drawing unit]:
   *    k_u = 1 (when drawing unit = mm) or 1000 (when drawing unit = m)
   * 3. Upper-right LIMITS corner (X_max, Y_max) for plot scale 1 : S:
   *    X_max [units] = (X_sheet [mm] * S) / k_u [mm/unit]
   *    Y_max [units] = (Y_sheet [mm] * S) / k_u [mm/unit]
   * 4. Model-space GRID and SNAP spacing from target paper grid pitch p_grid [mm]
   *    and integer subdivision ratio N_sub:
   *    GRID [units] = (p_grid [mm] * S) / k_u [mm/unit]
   *    SNAP [units] = GRID [units] / N_sub
   */
  const calc = useMemo(() => {
    const rawW = parseStrictNumber(sheetWidthStr);
    const rawH = parseStrictNumber(sheetHeightStr);
    const scaleS = parseStrictNumber(scaleDenominatorStr);
    const paperGridMm = parseStrictNumber(paperGridPitchStr);
    const snapSubdiv = parseStrictNumber(snapSubdivStr);

    if (
      !Number.isFinite(rawW) ||
      !Number.isFinite(rawH) ||
      !Number.isFinite(scaleS) ||
      !Number.isFinite(paperGridMm) ||
      !Number.isFinite(snapSubdiv) ||
      rawW <= 0 ||
      rawH <= 0 ||
      scaleS <= 0 ||
      paperGridMm <= 0 ||
      snapSubdiv < 1 ||
      !Number.isInteger(snapSubdiv)
    ) {
      return { isValid: false as const };
    }

    const longSideMm = Math.max(rawW, rawH);
    const shortSideMm = Math.min(rawW, rawH);
    const xSheetMm = orientation === 'landscape' ? longSideMm : shortSideMm;
    const ySheetMm = orientation === 'landscape' ? shortSideMm : longSideMm;

    const unitMmFactor = UNIT_MM_FACTOR[unit];
    const modelWidth = (xSheetMm * scaleS) / unitMmFactor;
    const modelHeight = (ySheetMm * scaleS) / unitMmFactor;
    const gridSpacing = (paperGridMm * scaleS) / unitMmFactor;
    const snapSpacing = gridSpacing / snapSubdiv;

    if (
      !Number.isFinite(modelWidth) ||
      !Number.isFinite(modelHeight) ||
      !Number.isFinite(gridSpacing) ||
      !Number.isFinite(snapSpacing)
    ) {
      return { isValid: false as const };
    }

    const scriptLines = [
      'LIMITS',
      '0,0',
      `${modelWidth.toFixed(2)},${modelHeight.toFixed(2)}`,
      'LIMCHECK',
      limcheckVal,
      'GRID',
      gridSpacing.toFixed(2),
      'SNAP',
      snapSpacing.toFixed(2),
      'ZOOM',
      'All',
    ];

    return {
      isValid: true as const,
      xSheetMm,
      ySheetMm,
      modelWidth,
      modelHeight,
      gridSpacing,
      snapSpacing,
      scriptText: scriptLines.join('\n') + '\n',
    };
  }, [sheetWidthStr, sheetHeightStr, orientation, unit, scaleDenominatorStr, paperGridPitchStr, snapSubdivStr, limcheckVal]);

  const handleCopyScript = async () => {
    if (!calc.isValid) return;
    try {
      await navigator.clipboard.writeText(calc.scriptText);
      setCopiedState('copied');
      setTimeout(() => setCopiedState('idle'), 2000);
    } catch {
      setCopiedState('failed');
    }
  };

  const handleDownloadScr = () => {
    if (!calc.isValid) return;
    const blob = new Blob([calc.scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'configure_limits.scr';
    link.click();
    URL.revokeObjectURL(url);
  };

  const svgRect = useMemo(() => {
    if (!calc.isValid) {
      return { x: 80, y: 30, w: 240, h: 140 };
    }
    const aspect = calc.modelWidth / calc.modelHeight;
    const maxW = 280;
    const maxH = 140;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    return {
      x: (400 - w) / 2,
      y: (200 - h) / 2,
      w,
      h,
    };
  }, [calc]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-900">
      {/* Left: Inputs Panel */}
      <div
        data-testid="calculator-inputs"
        className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5 print:bg-white print:text-black print:border-none print:shadow-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Sheet &amp; Scale Setup</span>
          </h2>
          <button
            type="button"
            data-testid="btn-reset"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Scenario Presets */}
        <div className="space-y-2 print:hidden">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            Quick Scenario Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              data-testid="preset-a3-mm-100"
              onClick={() => applyScenarioPreset('a3-mm-100')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              A3 · 1:100 (mm)
            </button>
            <button
              type="button"
              data-testid="preset-a1-m-200"
              onClick={() => applyScenarioPreset('a1-m-200')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              A1 · 1:200 (m)
            </button>
            <button
              type="button"
              data-testid="preset-archd-mm-50"
              onClick={() => applyScenarioPreset('archd-mm-50')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              ARCH D · 1:50
            </button>
          </div>
        </div>

        {/* Paper Size Preset + Editable Width/Height */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            1. Standard Paper Preset (ISO 216 / ARCH)
          </label>
          <select
            data-testid="select-paper-preset"
            value={paperPresetId}
            onChange={(e) => handleSelectPaperPreset(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none"
          >
            {PAPER_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Sheet Side A (mm)</label>
              <input
                type="text"
                data-testid="input-sheet-width"
                value={sheetWidthStr}
                onChange={(e) => setSheetWidthStr(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Sheet Side B (mm)</label>
              <input
                type="text"
                data-testid="input-sheet-height"
                value={sheetHeightStr}
                onChange={(e) => setSheetHeightStr(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Orientation & Model Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              2. Sheet Orientation
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                data-testid="btn-orient-landscape"
                onClick={() => setOrientation('landscape')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  orientation === 'landscape'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Landscape
              </button>
              <button
                type="button"
                data-testid="btn-orient-portrait"
                onClick={() => setOrientation('portrait')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  orientation === 'portrait'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Portrait
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              3. Model Drawing Unit
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                data-testid="btn-unit-mm"
                onClick={() => setUnit('mm')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  unit === 'mm'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                mm
              </button>
              <button
                type="button"
                data-testid="btn-unit-m"
                onClick={() => setUnit('m')}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  unit === 'm'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                m
              </button>
            </div>
          </div>
        </div>

        {/* Plot Scale Denominator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
              4. Plot Scale Denominator S (1 : S)
            </label>
            <span className="text-xs font-mono text-blue-400">1 : {scaleDenominatorStr.trim() || '—'}</span>
          </div>
          <input
            type="text"
            data-testid="input-scale-denominator"
            value={scaleDenominatorStr}
            onChange={(e) => setScaleDenominatorStr(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SCALES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScaleDenominatorStr(s)}
                className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                  scaleDenominatorStr.trim() === s
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                1:{s}
              </button>
            ))}
          </div>
        </div>

        {/* Editable Empirical Grid & Snap Heuristics */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Plotted Grid Pitch (mm, typical 10)
            </label>
            <input
              type="text"
              data-testid="input-paper-grid"
              value={paperGridPitchStr}
              onChange={(e) => setPaperGridPitchStr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Snap Subdivisions (typical 5, int)
            </label>
            <input
              type="text"
              data-testid="input-snap-subdiv"
              value={snapSubdivStr}
              onChange={(e) => setSnapSubdivStr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none"
            />
          </div>
        </div>

        {/* LIMCHECK System Variable */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            5. LIMCHECK System Variable
          </label>
          <select
            data-testid="select-limcheck"
            value={limcheckVal}
            onChange={(e) => setLimcheckVal(e.target.value as '0' | '1')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none"
          >
            <option value="0">0 — Off (Allow drawing outside grid limits, AutoCAD initial value)</option>
            <option value="1">1 — On (Reject point entry outside grid limits)</option>
          </select>
        </div>
      </div>

      {/* Right: Results & Visualizer Panel */}
      <div
        data-testid="calculator-results"
        className="lg:col-span-7 space-y-6 flex flex-col justify-between"
      >
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Model-Space LIMITS, GRID &amp; SNAP Results</span>
            </h3>
            <button
              type="button"
              data-testid="btn-download-scr"
              disabled={!calc.isValid}
              onClick={handleDownloadScr}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download .scr
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">
                Model Width X_max
              </div>
              <div className="text-2xl font-black font-mono text-slate-900">
                <span data-testid="out-model-width">
                  {calc.isValid ? calc.modelWidth.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-sm font-bold text-slate-400">{unit}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-xs text-slate-400 font-black uppercase tracking-wider mb-1">
                Model Height Y_max
              </div>
              <div className="text-2xl font-black font-mono text-slate-900">
                <span data-testid="out-model-height">
                  {calc.isValid ? calc.modelHeight.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-sm font-bold text-slate-400">{unit}</span>
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100">
              <div className="text-xs text-blue-500 font-black uppercase tracking-wider mb-1">
                GRID Spacing (Typical Pitch)
              </div>
              <div className="text-2xl font-black font-mono text-blue-700">
                <span data-testid="out-grid-spacing">
                  {calc.isValid ? calc.gridSpacing.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-sm font-bold text-blue-400">{unit}</span>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
              <div className="text-xs text-emerald-600 font-black uppercase tracking-wider mb-1">
                SNAP Spacing
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700">
                <span data-testid="out-snap-spacing">
                  {calc.isValid ? calc.snapSpacing.toFixed(2) : '—'}
                </span>{' '}
                <span className="text-sm font-bold text-emerald-500">{unit}</span>
              </div>
            </div>
          </div>

          {/* AutoCAD Script Preview */}
          <div className="space-y-2 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                AutoCAD Command Script (configure_limits.scr)
              </span>
              <button
                type="button"
                disabled={!calc.isValid}
                onClick={handleCopyScript}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white disabled:opacity-40 transition-all text-xs font-black flex items-center gap-1 border border-slate-200"
              >
                {copiedState === 'copied' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedState === 'copied'
                    ? 'Copied'
                    : copiedState === 'failed'
                      ? 'Copy unavailable'
                      : 'Copy Script'}
                </span>
              </button>
            </div>
            <pre
              data-testid="out-script-preview"
              className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed"
            >
              {calc.isValid ? calc.scriptText : '— Enter positive numeric sheet dimensions, scale, and integer snap subdivisions —'}
            </pre>
          </div>

          {/* Formula & Official Reference Note */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-800">Formula &amp; Command Reference:</div>
            <p>
              Model-space upper-right corner: <code>X_max = (X_sheet_mm × S) / k_u</code>,{' '}
              <code>Y_max = (Y_sheet_mm × S) / k_u</code>, where <code>k_u = 1</code> for <code>mm</code> and{' '}
              <code>1000</code> for <code>m</code>. Empirical grid spacing:{' '}
              <code>GRID = (p_grid_mm × S) / k_u</code>, <code>SNAP = GRID / N_sub</code> (typical planning values:{' '}
              <code>10 mm</code> paper pitch, <code>5</code> subdivisions).
            </p>
            <p className="text-slate-500">
              Sources: Autodesk AutoCAD Help — <code>LIMITS</code> (Command), <code>LIMCHECK</code> (System Variable),{' '}
              <code>GRID</code> (Command), <code>SNAP</code> (Command), and <code>ZOOM</code> &gt; <code>All</code>;{' '}
              sheet dimensions per ISO 216 (A0–A4) and North American ARCH series (<code>1 in = 25.4 mm</code>).
            </p>
          </div>
        </div>

        {/* SVG Boundary Preview */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Model-Space Sheet Boundary Preview
            </span>
            <span className="text-xs font-mono text-slate-400">
              {calc.isValid
                ? `Sheet: ${calc.xSheetMm} × ${calc.ySheetMm} mm (${orientation})`
                : 'Awaiting valid parameters'}
            </span>
          </div>

          <div className="relative w-full h-[200px] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="limitsGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(#limitsGridPattern)" />

              <rect
                x={svgRect.x}
                y={svgRect.y}
                width={svgRect.w}
                height={svgRect.h}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5 3"
              />

              {/* Lower-Left Corner (0,0) */}
              <circle cx={svgRect.x} cy={svgRect.y + svgRect.h} r="4" fill="#10b981" />
              <text
                x={svgRect.x + 6}
                y={svgRect.y + svgRect.h - 6}
                fill="#10b981"
                fontSize="10"
                fontWeight="bold"
              >
                0,0
              </text>

              {/* Upper-Right Corner (X_max, Y_max) */}
              <circle cx={svgRect.x + svgRect.w} cy={svgRect.y} r="4" fill="#f97316" />
              <text
                x={svgRect.x + svgRect.w - 6}
                y={Math.max(14, svgRect.y - 6)}
                fill="#fb923c"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                {calc.isValid
                  ? `${calc.modelWidth.toFixed(2)},${calc.modelHeight.toFixed(2)}`
                  : '—'}
              </text>
            </svg>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed mt-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              In AutoCAD, <code>ZOOM</code> &gt; <code>All</code> adjusts the viewport magnification to accommodate all
              visible objects or the grid limits set by <code>LIMITS</code>, whichever is larger. Note that{' '}
              <code>ZOOM All</code> always regenerates the drawing and cannot be used transparently.
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 mt-4 print:hidden">
        <RelatedTools />
      </div>
    </div>
  );
}
