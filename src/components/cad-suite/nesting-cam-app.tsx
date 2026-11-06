'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileCode,
  Flame,
  Layers,
  Play,
  Pause,
  Plus,
  Scissors,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { Canvas2DCadViewport } from './canvas2d-cad-viewport';
import { parseDxf, segmentsOf } from '@/lib/cad-file-analysis';
import {
  evaluateNestingAndCam,
  getDefaultBendParams,
  getDefaultIrregularParts,
  getDefaultNestingConfig,
  IrregularPartSpec,
  NestingConfig,
  SheetMetalBendParams,
} from '@/lib/wasm-bridges/nesting-cam-bridge';

function triggerDownload(content: string | ArrayBuffer, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function NestingCamApp() {
  const [bendParams, setBendParams] = useState<SheetMetalBendParams>(() => getDefaultBendParams());
  const [parts, setParts] = useState<IrregularPartSpec[]>(() => getDefaultIrregularParts());
  const [nestingCfg, setNestingCfg] = useState<NestingConfig>(() => getDefaultNestingConfig());
  const [laserFeedMmMin, setLaserFeedMmMin] = useState<number>(1800);
  const [laserPowerPwm, setLaserPowerPwm] = useState<number>(1000);
  const [leadInMm, setLeadInMm] = useState<number>(3.5);
  const [backplotPct, setBackplotPct] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showToolpath, setShowToolpath] = useState<boolean>(true);
  const [importedFileStatus, setImportedFileStatus] = useState<string>('');

  const evaluation = useMemo(
    () =>
      evaluateNestingAndCam(
        bendParams,
        parts,
        nestingCfg,
        laserFeedMmMin,
        laserPowerPwm,
        leadInMm
      ),
    [bendParams, parts, nestingCfg, laserFeedMmMin, laserPowerPwm, leadInMm]
  );

  // Backplotter playback animation timer
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setBackplotPct((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + 2);
      });
    }, 60);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const handleDxfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const doc = parseDxf(text);
    const segs = doc ? segmentsOf(doc) : [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const s of segs) {
      minX = Math.min(minX, s.x1, s.x2);
      maxX = Math.max(maxX, s.x1, s.x2);
      minY = Math.min(minY, s.y1, s.y2);
      maxY = Math.max(maxY, s.y1, s.y2);
    }
    const w = Number.isFinite(minX) ? Math.max(25, Math.min(450, Math.round(maxX - minX || 120))) : 120;
    const h = Number.isFinite(minY) ? Math.max(25, Math.min(350, Math.round(maxY - minY || 80))) : 80;
    const entCount = doc ? doc.entities.length : segs.length;
    const newPart: IrregularPartSpec = {
      id: `dxf-${Date.now()}`,
      name: file.name.replace(/\.dxf$/i, '').slice(0, 22),
      shapeKind: 'slotted-mount',
      widthMm: w,
      heightMm: h,
      innerHoleDiaMm: Math.min(w, h) * 0.28,
      qty: 2,
      color: '#06b6d4',
    };
    setParts((prev) => [...prev, newPart]);
    setImportedFileStatus(
      `Imported ${file.name} (${entCount} DXF entities, ${w}×${h} mm, topology auto-healed)`
    );
  };

  const updatePart = (id: string, key: keyof IrregularPartSpec, val: unknown) => {
    setParts((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: val } : p)));
  };

  const addNewPart = () => {
    setParts((prev) => [
      ...prev,
      {
        id: `part-${Date.now()}`,
        name: `Unfolded Blank (${evaluation.unfold.singleBendFlatLengthMm.toFixed(0)}×${bendParams.partWidthMm}mm)`,
        shapeKind: 'l-bracket',
        widthMm: Math.round(evaluation.unfold.singleBendFlatLengthMm),
        heightMm: Math.round(bendParams.partWidthMm),
        qty: 2,
        color: '#0ea5e9',
      },
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Top Studio Header & Export Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            Rust/WASM NFP &amp; CAM Kernel v{evaluation.unfold.wasmKernelVersion}
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Topology Healed: {evaluation.topologyReport.mergedEndpointCount} Gaps Closed ·{' '}
            {evaluation.topologyReport.removedDuplicateCount} Duplicates Purged
          </span>

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            Import Part DXF
            <input
              type="file"
              accept=".dxf"
              onChange={handleDxfUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="export-gcode-btn"
            onClick={() =>
              triggerDownload(
                evaluation.gcode,
                'sheetmetal-laser-nested.nc',
                'text/plain;charset=utf-8'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Laser G-Code (.nc)
          </button>

          <button
            type="button"
            data-testid="export-nested-dxf-btn"
            onClick={() =>
              triggerDownload(
                evaluation.nestedDxf,
                'nested-sheet-layout.dxf',
                'application/dxf'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Nested DXF
          </button>

          <button
            type="button"
            data-testid="export-nested-svg-btn"
            onClick={() =>
              triggerDownload(
                evaluation.nestedSvg,
                'nested-sheet-layout.svg',
                'image/svg+xml'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            SVG Layout
          </button>
        </div>
      </div>

      {importedFileStatus && (
        <div className="px-4 py-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-900">
          {importedFileStatus}
        </div>
      )}

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: DIN 6935 Sheet Metal Unfolding + NFP Nesting Part List */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. DIN 6935 Sheet Metal Unfolding Engine */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black text-slate-900">
                  DIN 6935 Sheet Metal Unfolding Engine
                </h2>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                K-Factor / BA / BD
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="sm-thickness" className="block text-xs font-bold text-slate-700 mb-1">
                  Thickness T (mm)
                </label>
                <input
                  id="sm-thickness"
                  type="number"
                  min={0.2}
                  max={25}
                  step={0.1}
                  value={bendParams.thicknessMm || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({ ...p, thicknessMm: e.target.value === '' ? 0 : Number(e.target.value) }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="sm-radius" className="block text-xs font-bold text-slate-700 mb-1">
                  Inside Radius R (mm)
                </label>
                <input
                  id="sm-radius"
                  type="number"
                  min={0.2}
                  max={50}
                  step={0.1}
                  value={bendParams.insideRadiusMm || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({ ...p, insideRadiusMm: e.target.value === '' ? 0 : Number(e.target.value) }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="sm-angle" className="block text-xs font-bold text-slate-700 mb-1">
                  Bend Angle θ (°)
                </label>
                <input
                  id="sm-angle"
                  type="number"
                  min={5}
                  max={175}
                  step={1}
                  value={bendParams.bendAngleDeg || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({
                      ...p,
                      bendAngleDeg: e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="sm-kfactor" className="block text-xs font-bold text-slate-700 mb-1">
                  K-Factor (K)
                </label>
                <input
                  id="sm-kfactor"
                  type="number"
                  min={0.25}
                  max={0.5}
                  step={0.01}
                  value={bendParams.kFactor || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({
                      ...p,
                      kFactor: e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="sm-leg1" className="block text-xs font-bold text-slate-700 mb-1">
                  Flange Leg 1 (mm)
                </label>
                <input
                  id="sm-leg1"
                  type="number"
                  min={5}
                  max={1000}
                  step={1}
                  value={bendParams.leg1Mm || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({ ...p, leg1Mm: e.target.value === '' ? 0 : Number(e.target.value) }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="sm-leg2" className="block text-xs font-bold text-slate-700 mb-1">
                  Flange Leg 2 (mm)
                </label>
                <input
                  id="sm-leg2"
                  type="number"
                  min={5}
                  max={1000}
                  step={1}
                  value={bendParams.leg2Mm || ''}
                  onChange={(e) =>
                    setBendParams((p) => ({ ...p, leg2Mm: e.target.value === '' ? 0 : Number(e.target.value) }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Unfolded Results Readout Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Bend Allowance (BA)</div>
                <div data-testid="unfold-ba-mm" className="text-sm font-black text-blue-700 mt-0.5">
                  {evaluation.unfold.bendAllowanceMm.toFixed(2)} mm
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Outside Setback</div>
                <div data-testid="unfold-ossb-mm" className="text-sm font-black text-slate-900 mt-0.5">
                  {evaluation.unfold.outsideSetbackMm.toFixed(2)} mm
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Bend Deduction (BD)</div>
                <div data-testid="unfold-bd-mm" className="text-sm font-black text-amber-700 mt-0.5">
                  {evaluation.unfold.bendDeductionMm.toFixed(2)} mm
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Flat Length Lflat</div>
                <div data-testid="unfold-flat-mm" className="text-sm font-black text-emerald-900 mt-0.5">
                  {evaluation.unfold.singleBendFlatLengthMm.toFixed(2)} mm
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sheet Configuration & True-Shape Nesting Parameters */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  Raw Sheet &amp; NFP Nesting Controls
                </h3>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nestingCfg.enableHoleInHole}
                  onChange={(e) =>
                    setNestingCfg((c) => ({ ...c, enableHoleInHole: e.target.checked }))
                  }
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                Hole-in-Hole Nesting
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="sheet-width" className="block text-xs font-bold text-slate-700 mb-1">
                  Sheet Width (mm)
                </label>
                <input
                  id="sheet-width"
                  type="number"
                  min={200}
                  max={6000}
                  value={nestingCfg.sheetWidthMm}
                  onChange={(e) =>
                    setNestingCfg((c) => ({ ...c, sheetWidthMm: Math.max(100, Number(e.target.value) || 1000) }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label htmlFor="sheet-height" className="block text-xs font-bold text-slate-700 mb-1">
                  Sheet Height (mm)
                </label>
                <input
                  id="sheet-height"
                  type="number"
                  min={200}
                  max={3000}
                  value={nestingCfg.sheetHeightMm}
                  onChange={(e) =>
                    setNestingCfg((c) => ({ ...c, sheetHeightMm: Math.max(100, Number(e.target.value) || 500) }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label htmlFor="sheet-kerf" className="block text-xs font-bold text-slate-700 mb-1">
                  Part Kerf Gap (mm)
                </label>
                <input
                  id="sheet-kerf"
                  type="number"
                  min={0}
                  max={25}
                  step={0.5}
                  value={nestingCfg.kerfSpacingMm}
                  onChange={(e) =>
                    setNestingCfg((c) => ({ ...c, kerfSpacingMm: Math.max(0, Number(e.target.value) || 0) }))
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label htmlFor="laser-feed" className="block text-xs font-bold text-slate-700 mb-1">
                  Laser Feed (mm/min)
                </label>
                <input
                  id="laser-feed"
                  type="number"
                  min={100}
                  max={15000}
                  step={100}
                  value={laserFeedMmMin}
                  onChange={(e) => setLaserFeedMmMin(Math.max(100, Number(e.target.value) || 1800))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            {/* 5 Irregular Parts Queue */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-extrabold text-slate-800">
                Irregular Part Queue ({parts.length} Geometries · {evaluation.placedParts.length} Placed)
              </span>
              <button
                type="button"
                onClick={addNewPart}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Unfolded Blank
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: part.color }}
                    />
                    <span className="font-extrabold text-slate-900 truncate">{part.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      aria-label={`${part.name} Width`}
                      value={part.widthMm}
                      onChange={(e) =>
                        updatePart(part.id, 'widthMm', Math.max(10, Number(e.target.value) || 40))
                      }
                      className="w-14 px-1.5 py-1 rounded border border-slate-200 text-center font-bold"
                    />
                    <span className="text-slate-400">×</span>
                    <input
                      type="number"
                      aria-label={`${part.name} Height`}
                      value={part.heightMm}
                      onChange={(e) =>
                        updatePart(part.id, 'heightMm', Math.max(10, Number(e.target.value) || 40))
                      }
                      className="w-14 px-1.5 py-1 rounded border border-slate-200 text-center font-bold"
                    />
                    <span className="text-slate-500">Qty</span>
                    <input
                      type="number"
                      aria-label={`${part.name} Quantity`}
                      min={0}
                      max={50}
                      value={part.qty}
                      onChange={(e) =>
                        updatePart(part.id, 'qty', Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-12 px-1.5 py-1 rounded border border-slate-200 text-center font-bold"
                    />
                    {parts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setParts((prev) => prev.filter((p) => p.id !== part.id))}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Remove Part"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Nesting KPIs, Canvas 2D Nesting + Backplotter, and Live G-Code Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Sheet Utilization</div>
              <div
                data-testid="nesting-utilization-pct"
                className="text-lg font-black text-emerald-700 mt-1"
              >
                {evaluation.boundingUtilizationPct.toFixed(2)}%
              </div>
              <div className="text-xs font-semibold text-slate-500">
                True Area: {evaluation.trueUtilizationPct.toFixed(1)}%
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Nested Parts</div>
              <div
                data-testid="nesting-placed-count"
                className="text-lg font-black text-slate-900 mt-1"
              >
                {evaluation.placedParts.length} Parts
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {evaluation.holeInHoleCount} Hole-in-Hole Nested
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Laser Cut Path</div>
              <div
                data-testid="cam-cut-distance-mm"
                className="text-lg font-black text-slate-900 mt-1"
              >
                {evaluation.totalCutDistanceMm.toFixed(1)} mm
              </div>
              <div className="text-xs font-semibold text-amber-600">
                Rapid: {evaluation.totalRapidDistanceMm.toFixed(1)} mm
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Est. Cycle Time</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {evaluation.estimatedCycleSeconds.toFixed(1)} s
              </div>
              <div className="text-xs font-semibold text-rose-600">
                Lead-in {leadInMm.toFixed(1)} mm · Inside-First
              </div>
            </div>
          </div>

          {/* Interactive Canvas 2D Nesting & Laser Backplotter */}
          <Canvas2DCadViewport
            mode="nesting"
            height={420}
            titleBadge={`True-Shape NFP Sheet Layout (${nestingCfg.sheetWidthMm}×${nestingCfg.sheetHeightMm} mm) & Laser Backplotter`}
            sheetWidthMm={nestingCfg.sheetWidthMm}
            sheetHeightMm={nestingCfg.sheetHeightMm}
            placedParts={evaluation.placedParts}
            toolpathMoves={evaluation.toolpathMoves}
            backplotProgressPct={backplotPct}
            showToolpathOverlay={showToolpath}
          />

          {/* Dynamic Toolpath Backplotter Scrubber Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (backplotPct >= 100) setBackplotPct(0);
                  setIsPlaying((p) => !p);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause Sim' : 'Simulate Laser Cut'}
              </button>

              <label className="inline-flex items-center gap-1.5 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={showToolpath}
                  onChange={(e) => setShowToolpath(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <span className="font-semibold text-slate-200">Show Toolpath &amp; Lead-ins</span>
              </label>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-[220px]">
              <Flame className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-bold text-slate-300 shrink-0">
                Backplot: {backplotPct}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={backplotPct}
                onChange={(e) => {
                  setIsPlaying(false);
                  setBackplotPct(Number(e.target.value));
                }}
                aria-label="Laser Backplotter Simulation Progress"
                className="w-full accent-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-orange-400 inline-block" /> G00 Rapid
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Lead-In/Out
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> G03 Hole
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-rose-500 inline-block" /> G01 Outer
              </span>
            </div>
          </div>

          {/* Live CNC / Laser G-Code Inspector */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Generated ISO 6983 / Fanuc / Grbl Laser G-Code ({evaluation.toolpathMoves.length} Motion Blocks)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                G21 · G90 · M03 S{laserPowerPwm} · F{laserFeedMmMin}
              </span>
            </div>
            <pre
              data-testid="gcode-preview-box"
              className="bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-2xl max-h-44 overflow-y-auto leading-relaxed"
            >
              {evaluation.gcode.slice(0, 2600)}
            </pre>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
