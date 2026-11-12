'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Download, FileCode, Info, RotateCcw, Copy, Check } from 'lucide-react';

interface ScaleItem {
  id: string;
  name: string;
  ratio: string;
  selected: boolean;
  isMetric: boolean;
}

const INITIAL_SCALES: ScaleItem[] = [
  { id: 'm-1-1', name: '1:1', ratio: '1:1', selected: true, isMetric: true },
  { id: 'm-1-2', name: '1:2', ratio: '1:2', selected: true, isMetric: true },
  { id: 'm-1-5', name: '1:5', ratio: '1:5', selected: true, isMetric: true },
  { id: 'm-1-10', name: '1:10', ratio: '1:10', selected: true, isMetric: true },
  { id: 'm-1-20', name: '1:20', ratio: '1:20', selected: true, isMetric: true },
  { id: 'm-1-50', name: '1:50', ratio: '1:50', selected: true, isMetric: true },
  { id: 'm-1-100', name: '1:100', ratio: '1:100', selected: true, isMetric: true },
  { id: 'm-1-200', name: '1:200', ratio: '1:200', selected: true, isMetric: true },
  { id: 'm-1-500', name: '1:500', ratio: '1:500', selected: true, isMetric: true },
  { id: 'm-1-1000', name: '1:1000', ratio: '1:1000', selected: true, isMetric: true },
  { id: 'i-1-96', name: '1/8"=1\'', ratio: '1:96', selected: false, isMetric: false },
  { id: 'i-1-48', name: '1/4"=1\'', ratio: '1:48', selected: false, isMetric: false },
  { id: 'i-1-24', name: '1/2"=1\'', ratio: '1:24', selected: false, isMetric: false },
  { id: 'i-1-12', name: '1"=1\'', ratio: '1:12', selected: false, isMetric: false },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const val = Number(trimmed);
  return Number.isFinite(val) ? val : NaN;
}

export default function CadScaleListResetClient() {
  const [scales, setScales] = useState<ScaleItem[]>(INITIAL_SCALES);
  const [includeCustom, setIncludeCustom] = useState<boolean>(true);
  const [customPaperUnitsStr, setCustomPaperUnitsStr] = useState<string>('1');
  const [customDrawingUnitsStr, setCustomDrawingUnitsStr] = useState<string>('25');
  const [copiedState, setCopiedState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleToggle = (id: string) => {
    setScales((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const applyPreset = (preset: 'metric-plus-25' | 'imperial-arch' | 'metric-only') => {
    setCopiedState('idle');
    if (preset === 'metric-plus-25') {
      setScales(INITIAL_SCALES);
      setIncludeCustom(true);
      setCustomPaperUnitsStr('1');
      setCustomDrawingUnitsStr('25');
    } else if (preset === 'imperial-arch') {
      setScales(
        INITIAL_SCALES.map((item) => ({
          ...item,
          selected: !item.isMetric || item.id === 'm-1-1',
        }))
      );
      setIncludeCustom(false);
      setCustomPaperUnitsStr('1');
      setCustomDrawingUnitsStr('16');
    } else {
      setScales(INITIAL_SCALES);
      setIncludeCustom(false);
      setCustomPaperUnitsStr('1');
      setCustomDrawingUnitsStr('25');
    }
  };

  const handleReset = () => {
    applyPreset('metric-plus-25');
  };

  /**
   * Step-by-step derivation for custom scale ratio & AutoLISP dictionary rebuild:
   * 1. Per AutoCAD -SCALELISTEDIT > Add documentation, scale ratios take the form n:m,
   *    where n = number of paper units (> 0) and m = number of drawing units (> 0).
   *    Dimensionless viewport scale factor = n / m.
   * 2. Total rebuilt custom/standard scale entries pushed after resetting ACAD_SCALELIST:
   *    N_total = N_checked_presets + (1 if includeCustom and custom ratio not already in checked presets, else 0).
   * 3. Generated AutoLISP script uses strictly ASCII characters and verified AutoCAD commands / AutoLISP functions:
   *    CMDECHO, -SCALELISTEDIT (Reset / Add / Exit), namedobjdict, dictremove, dictsearch, entget, ACAD_SCALELIST.
   */
  const calc = useMemo(() => {
    const nPaper = parseStrictNumber(customPaperUnitsStr);
    const mDrawing = parseStrictNumber(customDrawingUnitsStr);
    const customNumsValid =
      Number.isFinite(nPaper) &&
      Number.isFinite(mDrawing) &&
      nPaper > 0 &&
      mDrawing > 0;

    const customFactor = customNumsValid ? nPaper / mDrawing : NaN;
    const customRatioText = customNumsValid
      ? `${customPaperUnitsStr.trim()}:${customDrawingUnitsStr.trim()}`
      : '—';

    if (includeCustom && (!customNumsValid || !Number.isFinite(customFactor))) {
      return {
        isValid: false as const,
        customNumsValid: false,
        customFactor: NaN,
        customRatioText: '—',
      };
    }

    const activeList: Array<{ name: string; ratio: string }> = scales
      .filter((s) => s.selected)
      .map((s) => ({ name: s.name, ratio: s.ratio }));

    if (includeCustom && customNumsValid) {
      const existsAlready = activeList.some(
        (s) => s.name.toLowerCase() === customRatioText.toLowerCase()
      );
      if (!existsAlready) {
        activeList.push({ name: customRatioText, ratio: customRatioText });
      }
    }

    const lines: string[] = [
      ';; =========================================================================',
      ';; AutoCAD Annotation Scale List Purge & Reconstruction Utility',
      ';; Generated by CADGuide.tools (Pure ASCII AutoLISP)',
      ';; -------------------------------------------------------------------------',
      ';; WARNING: Back up the drawing before running; removing ACAD_SCALELIST via',
      ';; (dictremove (namedobjdict) "ACAD_SCALELIST") is not an Autodesk-documented',
      ';; procedure. Use with caution on drawings containing annotative objects.',
      ';; -------------------------------------------------------------------------',
      ';; Usage:',
      ';; 1. Save a backup copy of your .dwg file before running this routine.',
      ';; 2. In AutoCAD, run APPLOAD and load reset_scalelist.lsp.',
      ';; 3. Type ResetScaleList at the command prompt and press Enter.',
      ';; =========================================================================',
      '',
      '(defun c:ResetScaleList (/ _cadguide_add_scale)',
      '  (setvar "CMDECHO" 0)',
      '  (princ "\\n[CADGuide] Resetting drawing scale list...")',
      '',
      '  ;; Step 1: Remove ACAD_SCALELIST entry from Named Object Dictionary',
      '  (dictremove (namedobjdict) "ACAD_SCALELIST")',
      '',
      '  ;; Step 2: Re-initialize default scale dictionary via command-line -SCALELISTEDIT',
      '  (command "-SCALELISTEDIT" "Reset" "Yes" "Exit")',
      '',
      '  ;; Step 3: Helper that checks ACAD_SCALELIST before calling -SCALELISTEDIT Add',
      '  (defun _cadguide_add_scale (sName sRatio / sDict exists)',
      '    (setq exists nil)',
      '    (setq sDict (dictsearch (namedobjdict) "ACAD_SCALELIST"))',
      '    (if sDict',
      '      (foreach item sDict',
      '        (if (= (car item) 350)',
      '          (if (= (strcase (cdr (assoc 300 (entget (cdr item))))) (strcase sName))',
      '            (setq exists T)',
      '          )',
      '        )',
      '      )',
      '    )',
      '    (if (not exists)',
      '      (command "-SCALELISTEDIT" "Add" sName sRatio "Exit")',
      '    )',
      '  )',
      '',
    ];

    if (activeList.length > 0) {
      lines.push('  ;; Step 4: Ensure selected standard and custom scales exist');
      activeList.forEach((item) => {
        const escapedName = item.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        lines.push(`  (_cadguide_add_scale "${escapedName}" "${item.ratio}")`);
      });
      lines.push('');
    }

    lines.push('  (setvar "CMDECHO" 1)');
    lines.push('  (princ "\\n[CADGuide] Scale list reset completed.")');
    lines.push('  (princ)');
    lines.push(')');

    return {
      isValid: true as const,
      customNumsValid,
      customFactor,
      customRatioText,
      activeList,
      totalCount: activeList.length,
      lispCode: lines.join('\n') + '\n',
    };
  }, [scales, includeCustom, customPaperUnitsStr, customDrawingUnitsStr]);

  const handleDownload = () => {
    if (!calc.isValid) return;
    const blob = new Blob([calc.lispCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reset_scalelist.lsp';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!calc.isValid) return;
    try {
      await navigator.clipboard.writeText(calc.lispCode);
      setCopiedState('copied');
      setTimeout(() => setCopiedState('idle'), 2000);
    } catch {
      setCopiedState('failed');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Scale Selection & Custom Ratio Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900 font-black text-lg tracking-tight">
                Scale List Configuration
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Standard &amp; Custom n:m Ratios
              </p>
            </div>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 transition-all"
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
                data-testid="preset-metric-25"
                onClick={() => applyPreset('metric-plus-25')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Metric + 1:25
              </button>
              <button
                type="button"
                data-testid="preset-metric-only"
                onClick={() => applyPreset('metric-only')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Metric Only (10)
              </button>
              <button
                type="button"
                data-testid="preset-imperial-arch"
                onClick={() => applyPreset('imperial-arch')}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                Imperial Arch (5)
              </button>
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
              1. Standard Scales to Ensure After Reset
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {scales.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    item.selected
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    data-testid={`chk-scale-${item.id}`}
                    checked={item.selected}
                    onChange={() => handleToggle(item.id)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-medium opacity-75">Ratio {item.ratio}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Scale Ratio n:m */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider cursor-pointer">
              <input
                type="checkbox"
                data-testid="chk-include-custom"
                checked={includeCustom}
                onChange={(e) => setIncludeCustom(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>2. Append Custom Scale (Format n:m)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Paper Units n (&gt; 0)
                </label>
                <input
                  type="text"
                  data-testid="input-paper-units"
                  value={customPaperUnitsStr}
                  onChange={(e) => setCustomPaperUnitsStr(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  Drawing Units m (&gt; 0)
                </label>
                <input
                  type="text"
                  data-testid="input-drawing-units"
                  value={customDrawingUnitsStr}
                  onChange={(e) => setCustomDrawingUnitsStr(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-download-lsp"
            disabled={!calc.isValid}
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm shadow-sm transition-all w-full"
          >
            <Download className="w-4 h-4" />
            Download reset_scalelist.lsp
          </button>
        </div>

        {/* Right: Computed Summary & LISP Preview */}
        <div
          data-testid="calculator-results"
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-500" />
                <span>Scale Rebuild Summary &amp; AutoLISP Output</span>
              </h3>
              <button
                type="button"
                disabled={!calc.isValid}
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white disabled:opacity-40 text-slate-700 text-xs font-black flex items-center gap-1.5 transition-all"
              >
                {copiedState === 'copied' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copiedState === 'copied'
                    ? 'Copied'
                    : copiedState === 'failed'
                      ? 'Copy unavailable'
                      : 'Copy LISP'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">
                  Target Scale Count
                </div>
                <div className="text-2xl font-black font-mono text-blue-700">
                  <span data-testid="out-scale-count">
                    {calc.isValid ? String(calc.totalCount) : '—'}
                  </span>{' '}
                  <span className="text-xs font-bold text-blue-400">scales</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                  Custom Ratio (n:m)
                </div>
                <div
                  data-testid="out-custom-ratio"
                  className="text-2xl font-black font-mono text-slate-800"
                >
                  {calc.customNumsValid ? calc.customRatioText : '—'}
                </div>
              </div>

              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
                  Custom Factor (n / m)
                </div>
                <div
                  data-testid="out-custom-factor"
                  className="text-2xl font-black font-mono text-emerald-700"
                >
                  {calc.customNumsValid ? calc.customFactor.toFixed(4) : '—'}
                </div>
              </div>
            </div>

            {/* Active Scale Badges */}
            {calc.isValid && (
              <div className="flex flex-wrap gap-1.5">
                {calc.activeList.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            {/* Pure ASCII LISP Code Block */}
            <div className="bg-slate-900 text-slate-200 font-mono text-xs p-5 rounded-2xl overflow-x-auto max-h-[380px] border border-slate-800">
              <pre data-testid="out-lisp-code" className="whitespace-pre leading-relaxed">
                {calc.isValid
                  ? calc.lispCode
                  : ';; Enter positive numeric values for Custom Paper Units (n) and Drawing Units (m)'}
              </pre>
            </div>

            {/* Official Command & Dictionary Reference */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Verified AutoCAD Commands &amp; AutoLISP Functions:</span>
              </div>
              <p>
                <code>-SCALELISTEDIT</code> (prompts: <code>Reset</code> &gt; <code>Yes</code> &gt; <code>Exit</code>, and{' '}
                <code>Add</code> with ratio <code>n:m</code> where <code>n</code> = paper units and <code>m</code> = drawing
                units), <code>SCALELISTEDIT</code>, <code>APPLOAD</code>, system variable <code>CMDECHO</code> (
                <code>0</code> turns off command echoing), and AutoLISP dictionary functions <code>namedobjdict</code>,{' '}
                <code>dictremove</code>, <code>dictsearch</code>, and <code>entget</code> operating on the{' '}
                <code>ACAD_SCALELIST</code> dictionary.
              </p>
              <p className="text-slate-500">
                Sources: Autodesk AutoCAD Command &amp; System Variable Reference and AutoLISP Developer&apos;s Guide. Note:
                Per AutoCAD documentation, scales currently referenced by an annotative object cannot be deleted by{' '}
                <code>-SCALELISTEDIT Delete</code>.
              </p>
              <p className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded-xl p-3">
                Backup Warning: Removing <code>ACAD_SCALELIST</code> directly via{' '}
                <code>(dictremove (namedobjdict) &quot;ACAD_SCALELIST&quot;)</code> is not an Autodesk-documented workflow.
                Always save a backup copy of your drawing before running <code>reset_scalelist.lsp</code>, and use with
                caution on drawings containing annotative objects.
              </p>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
