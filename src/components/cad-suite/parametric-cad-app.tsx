'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  CheckCircle2,
  Compass,
  Download,
  Layers,
  Plus,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { WebGlCadViewport } from './webgl-cad-viewport';
import { Canvas2DCadViewport } from './canvas2d-cad-viewport';
import {
  ENGINEERING_MATERIALS,
  evaluateParametricModel,
  exportMeshToBinaryStl,
  exportMeshToObj,
  exportParametricToSectionDxf,
  exportParametricToStepAp214,
  FeatureNode,
  getDefaultFeatureTree,
  getDefaultSketchConstraints,
  getDefaultSketchEntities,
  SketchConstraint2D,
  SketchConstraintType,
  SketchEntity2D,
  SketchPlane,
} from '@/lib/wasm-bridges/parametric-cad-bridge';

const emptySubscribe = () => () => {};

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

export default function ParametricCadApp() {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [features, setFeatures] = useState<FeatureNode[]>(() => getDefaultFeatureTree());
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('feat-base-extrude');
  const [sketchPlane, setSketchPlane] = useState<SketchPlane>('XY');
  const [sketchEntities, setSketchEntities] = useState<SketchEntity2D[]>(() => getDefaultSketchEntities());
  const [sketchConstraints, setSketchConstraints] = useState<SketchConstraint2D[]>(() =>
    getDefaultSketchConstraints()
  );
  const [activeSketchTool, setActiveSketchTool] = useState<
    'select' | 'line' | 'circle' | 'rect' | 'arc' | 'spline'
  >('select');
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split');
  const [materialId, setMaterialId] = useState<string>('al-6061');
  const [newConstraintType, setNewConstraintType] = useState<SketchConstraintType>('distance');
  const [newConstraintValue, setNewConstraintValue] = useState<number>(40);

  const [outerDiaStr, setOuterDiaStr] = useState<string>('80');
  const [heightStr, setHeightStr] = useState<string>('25');
  const [holeDiaStr, setHoleDiaStr] = useState<string>('30');

  // Direct quick-access parameters bound to primary features for instant parametric editing
  const baseFeature = features.find((f) => f.id === 'feat-base-extrude') || features[0];
  const centerHoleFeature = features.find((f) => f.id === 'feat-center-hole') || features[1];
  const boltPatternFeature = features.find((f) => f.id === 'feat-bolt-pattern') || features[2];
  const filletFeature = features.find((f) => f.id === 'feat-top-fillet') || features[3];
  const chamferFeature = features.find((f) => f.id === 'feat-chamfer') || features[4];
  const shellFeature = features.find((f) => f.id === 'feat-shell') || features[5];
  const booleanFeature = features.find((f) => f.id === 'feat-boolean') || features[6];

  const parsedOuterDia = parseFloat(outerDiaStr);
  const parsedHeight = parseFloat(heightStr);
  const parsedHoleDia = parseFloat(holeDiaStr);
  const isPrimaryInputValid =
    outerDiaStr.trim() !== '' &&
    heightStr.trim() !== '' &&
    holeDiaStr.trim() !== '' &&
    Number.isFinite(parsedOuterDia) &&
    parsedOuterDia > 0 &&
    Number.isFinite(parsedHeight) &&
    parsedHeight > 0 &&
    Number.isFinite(parsedHoleDia) &&
    parsedHoleDia >= 0 &&
    parsedHoleDia < parsedOuterDia;

  const handleResetDefaults = () => {
    setFeatures(getDefaultFeatureTree());
    setSketchEntities(getDefaultSketchEntities());
    setSketchConstraints(getDefaultSketchConstraints());
    setSelectedFeatureId('feat-base-extrude');
    setMaterialId('al-6061');
    setOuterDiaStr('80');
    setHeightStr('25');
    setHoleDiaStr('30');
  };

  const updateFeatureParam = (featId: string, key: keyof FeatureNode['params'], val: unknown) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === featId
          ? {
              ...f,
              params: {
                ...f.params,
                [key]: val,
              },
            }
          : f
      )
    );
  };

  const toggleFeatureEnabled = (featId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const addRevolveOrCustomFeature = (type: FeatureNode['type']) => {
    const id = `feat-${type}-${Date.now()}`;
    const newNode: FeatureNode = {
      id,
      name:
        type === 'revolve'
          ? 'Revolve 1 (360° Toroidal Rim)'
          : type === 'fillet'
            ? 'Fillet (R3.0mm Edge Blend)'
            : 'Hole (Ø10mm Auxiliary Bore)',
      type,
      enabled: true,
      params:
        type === 'revolve'
          ? { revolveAngleDeg: 360, revolveRadiusMm: 45, revolveSectionWidthMm: 14, heightMm: 20 }
          : type === 'fillet'
            ? { edgeRadiusMm: 3.0 }
            : { holeDiameterMm: 10, holeDepthMm: 25, holeThruAll: true, holePatternCount: 1, holeOffsetXMm: 22, holeOffsetYMm: 0 },
    };
    setFeatures((prev) => [...prev, newNode]);
    setSelectedFeatureId(id);
  };

  const evaluation = useMemo(
    () => evaluateParametricModel(features, sketchEntities, sketchConstraints, materialId),
    [features, sketchEntities, sketchConstraints, materialId]
  );

  const selectedFeature = features.find((f) => f.id === selectedFeatureId) || features[0];
  const activeMaterial =
    ENGINEERING_MATERIALS.find((m) => m.id === materialId) || ENGINEERING_MATERIALS[0];

  const handleAddConstraint = () => {
    if (sketchEntities.length === 0) return;
    const firstId = sketchEntities[0].id;
    const secondId = sketchEntities[1]?.id || firstId;
    const needsTwo = ['coincident', 'parallel', 'perpendicular', 'tangent', 'concentric', 'angle'].includes(
      newConstraintType
    );
    const cst: SketchConstraint2D = {
      id: `cst-${Date.now()}`,
      type: newConstraintType,
      entityIds: needsTwo ? [firstId, secondId] : [firstId],
      value: ['distance', 'radius', 'angle'].includes(newConstraintType) ? newConstraintValue : undefined,
      satisfied: true,
      residual: 0,
    };
    setSketchConstraints((prev) => [...prev, cst]);
  };

  return (
    <div data-hydrated={hydrated ? 'true' : 'false'} className="space-y-8">
      {/* Top Studio Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            Rust/WASM B-Rep Kernel v{evaluation.massProps.wasmKernelVersion}
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['XY', 'XZ', 'YZ'] as const).map((pl) => (
              <button
                key={pl}
                type="button"
                onClick={() => setSketchPlane(pl)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sketchPlane === pl ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pl} Plane
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(
              [
                { id: 'split', label: 'Split 2D + 3D' },
                { id: '3d', label: '3D Solid Only' },
                { id: '2d', label: '2D Sketcher Only' },
              ] as const
            ).map((vm) => (
              <button
                key={vm.id}
                type="button"
                onClick={() => setViewMode(vm.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === vm.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {vm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Industrial CAD Export Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="btn-reset-parametric"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            data-testid="export-step-btn"
            onClick={() =>
              triggerDownload(
                exportParametricToStepAp214(evaluation, features, 'PARAMETRIC_CAD_SOLID'),
                'parametric-part-ap214.step',
                'application/step'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export STEP (AP214)
          </button>

          <button
            type="button"
            data-testid="export-stl-btn"
            onClick={() =>
              triggerDownload(
                exportMeshToBinaryStl(evaluation.mesh),
                'parametric-part-binary.stl',
                'application/octet-stream'
              )
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Binary STL
          </button>

          <button
            type="button"
            data-testid="export-obj-btn"
            onClick={() =>
              triggerDownload(
                exportMeshToObj(evaluation.mesh, 'PARAMETRIC_PART'),
                'parametric-part.obj'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            OBJ
          </button>

          <button
            type="button"
            data-testid="export-dxf-btn"
            onClick={() =>
              triggerDownload(
                exportParametricToSectionDxf(evaluation),
                'parametric-part-section.dxf',
                'application/dxf'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            2D Section DXF
          </button>
        </div>
      </div>

      {/* Main Parametric Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Parametric Dimensions, Feature Tree & 2D Constraints */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Primary Parametric Dimension Inputs (Deterministic & Hand-Calculable) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-black text-slate-900">
                  Primary Solid Dimensions &amp; Modifiers
                </h2>
              </div>
              <select
                aria-label="Base Profile Shape"
                value={baseFeature.params.profileType || 'cylinder'}
                onChange={(e) =>
                  updateFeatureParam(
                    baseFeature.id,
                    'profileType',
                    e.target.value as 'cylinder' | 'rect-block'
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="cylinder">Cylindrical Boss (Ø)</option>
                <option value="rect-block">Prismatic Block (W×L)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="param-outer-dia"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Outer Diameter Do (mm)
                </label>
                <input
                  id="param-outer-dia"
                  type="number"
                  min={10}
                  max={500}
                  step={1}
                  value={outerDiaStr}
                  onChange={(e) => {
                    const str = e.target.value;
                    setOuterDiaStr(str);
                    const raw = parseFloat(str);
                    if (Number.isFinite(raw) && raw > 0) {
                      updateFeatureParam(baseFeature.id, 'outerDiameterMm', raw);
                      setSketchConstraints((prev) =>
                        prev.map((c) => (c.id === 'cst-1' ? { ...c, value: raw / 2 } : c))
                      );
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="param-extrude-height"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Extrusion Height H (mm)
                </label>
                <input
                  id="param-extrude-height"
                  type="number"
                  min={1}
                  max={300}
                  step="any"
                  value={heightStr}
                  onChange={(e) => {
                    const str = e.target.value;
                    setHeightStr(str);
                    const raw = parseFloat(str);
                    if (Number.isFinite(raw) && raw > 0) {
                      updateFeatureParam(baseFeature.id, 'heightMm', raw);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="param-hole-dia"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Center Bore Hole Di (mm)
                </label>
                <input
                  id="param-hole-dia"
                  type="number"
                  min={0}
                  max={400}
                  step={1}
                  value={holeDiaStr}
                  onChange={(e) => {
                    const str = e.target.value;
                    setHoleDiaStr(str);
                    const raw = parseFloat(str);
                    if (Number.isFinite(raw) && raw >= 0) {
                      updateFeatureParam(centerHoleFeature.id, 'holeDiameterMm', raw);
                      if (raw > 0) {
                        setSketchConstraints((prev) =>
                          prev.map((c) => (c.id === 'cst-2' ? { ...c, value: raw / 2 } : c))
                        );
                      }
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="param-material-select"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Engineering Material (ρ)
                </label>
                <select
                  id="param-material-select"
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                >
                  {ENGINEERING_MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.densityGPerCm3.toFixed(2)} g/cm³)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {baseFeature.params.profileType === 'rect-block' && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Block Width W (mm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={baseFeature.params.widthMm ?? 80}
                    onChange={(e) =>
                      updateFeatureParam(baseFeature.id, 'widthMm', Math.max(10, Number(e.target.value) || 10))
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Block Length L (mm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={baseFeature.params.lengthMm ?? 60}
                    onChange={(e) =>
                      updateFeatureParam(baseFeature.id, 'lengthMm', Math.max(10, Number(e.target.value) || 10))
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. 3D Feature Modeling Tree (Extrude, Revolve, Fillet, Chamfer, Shell, Hole, Boolean) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  3D Parametric Feature Tree ({features.filter((f) => f.enabled).length}/{features.length} Active)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => addRevolveOrCustomFeature('revolve')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Revolve
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {features.map((feat, idx) => (
                <div
                  key={feat.id}
                  onClick={() => setSelectedFeatureId(feat.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                    selectedFeatureId === feat.id
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-slate-50/70 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      aria-label={`Toggle ${feat.name}`}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleFeatureEnabled(feat.id);
                      }}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {idx + 1}. {feat.name}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">
                        Op: {feat.type} · {feat.enabled ? 'Evaluated' : 'Suppressed'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      feat.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {feat.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected Feature Fine-Tuning Drawer */}
            {selectedFeature && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
                <div className="font-bold text-blue-300 flex items-center justify-between">
                  <span>Inspector: {selectedFeature.name}</span>
                  <span className="uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 text-[10px]">
                    {selectedFeature.type}
                  </span>
                </div>

                {selectedFeature.type === 'fillet' && (
                  <label className="block">
                    <span className="text-slate-300 block mb-1">Constant Fillet Radius R (mm)</span>
                    <input
                      type="number"
                      min={0.5}
                      max={15}
                      step={0.5}
                      value={filletFeature.params.edgeRadiusMm ?? 2.0}
                      onChange={(e) =>
                        updateFeatureParam(selectedFeature.id, 'edgeRadiusMm', Math.max(0.2, Number(e.target.value) || 1))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                    />
                  </label>
                )}

                {selectedFeature.type === 'chamfer' && (
                  <label className="block">
                    <span className="text-slate-300 block mb-1">Chamfer Bevel Distance d (mm)</span>
                    <input
                      type="number"
                      min={0.5}
                      max={15}
                      step={0.5}
                      value={chamferFeature.params.chamferDistMm ?? 1.5}
                      onChange={(e) =>
                        updateFeatureParam(selectedFeature.id, 'chamferDistMm', Math.max(0.2, Number(e.target.value) || 1))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                    />
                  </label>
                )}

                {selectedFeature.type === 'shell' && (
                  <label className="block">
                    <span className="text-slate-300 block mb-1">Shell Wall Thickness t (mm)</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      step={0.5}
                      value={shellFeature.params.wallThicknessMm ?? 4.0}
                      onChange={(e) =>
                        updateFeatureParam(selectedFeature.id, 'wallThicknessMm', Math.max(0.5, Number(e.target.value) || 2))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                    />
                  </label>
                )}

                {selectedFeature.type === 'boolean' && (
                  <div className="grid grid-cols-2 gap-2">
                    <label>
                      <span className="text-slate-300 block mb-1">Boolean Mode</span>
                      <select
                        value={booleanFeature.params.booleanOp || 'cut'}
                        onChange={(e) =>
                          updateFeatureParam(
                            selectedFeature.id,
                            'booleanOp',
                            e.target.value as 'union' | 'cut' | 'intersect'
                          )
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                      >
                        <option value="cut">Difference (Cut)</option>
                        <option value="union">Union (Add Boss)</option>
                        <option value="intersect">Intersection</option>
                      </select>
                    </label>
                    <label>
                      <span className="text-slate-300 block mb-1">Tool Size (mm)</span>
                      <input
                        type="number"
                        min={2}
                        max={60}
                        value={booleanFeature.params.toolSizeMm ?? 10}
                        onChange={(e) =>
                          updateFeatureParam(selectedFeature.id, 'toolSizeMm', Math.max(2, Number(e.target.value) || 10))
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </label>
                  </div>
                )}

                {selectedFeature.id === 'feat-bolt-pattern' && (
                  <div className="grid grid-cols-2 gap-2">
                    <label>
                      <span className="text-slate-300 block mb-1">Bolt Count N</span>
                      <input
                        type="number"
                        min={2}
                        max={24}
                        value={boltPatternFeature.params.holePatternCount ?? 4}
                        onChange={(e) =>
                          updateFeatureParam(boltPatternFeature.id, 'holePatternCount', Math.max(1, Number(e.target.value) || 4))
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </label>
                    <label>
                      <span className="text-slate-300 block mb-1">BCD Ø (mm)</span>
                      <input
                        type="number"
                        min={16}
                        max={300}
                        value={boltPatternFeature.params.holeBoltCircleDiaMm ?? 56}
                        onChange={(e) =>
                          updateFeatureParam(boltPatternFeature.id, 'holeBoltCircleDiaMm', Math.max(10, Number(e.target.value) || 56))
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. 2D Parametric Sketch Constraint Solver Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  2D Sketcher &amp; Constraint Solver
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                {evaluation.sketchDiagnostics.status} (DOF: {evaluation.sketchDiagnostics.dofRemaining})
              </span>
            </div>

            {/* Sketch Primitive Drawing Palette */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'select', label: 'Pan / Pick' },
                  { id: 'line', label: '+ Line' },
                  { id: 'circle', label: '+ Circle' },
                  { id: 'arc', label: '+ Arc' },
                  { id: 'rect', label: '+ Rect' },
                  { id: 'spline', label: '+ Spline' },
                ] as const
              ).map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveSketchTool(tool.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeSketchTool === tool.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>

            {/* Add Geometric / Dimensional Constraint */}
            <div className="flex items-center gap-2 pt-1">
              <select
                aria-label="Constraint Type"
                value={newConstraintType}
                onChange={(e) => setNewConstraintType(e.target.value as SketchConstraintType)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
              >
                <option value="distance">Length / Distance</option>
                <option value="radius">Radius</option>
                <option value="angle">Angle (°)</option>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="coincident">Coincident</option>
                <option value="parallel">Parallel</option>
                <option value="perpendicular">Perpendicular</option>
                <option value="tangent">Tangent</option>
                <option value="concentric">Concentric</option>
              </select>

              {['distance', 'radius', 'angle'].includes(newConstraintType) && (
                <input
                  type="number"
                  aria-label="Constraint Target Value"
                  value={newConstraintValue}
                  onChange={(e) => setNewConstraintValue(Math.max(1, Number(e.target.value) || 10))}
                  className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              )}

              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0"
              >
                + Constraint
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
              {evaluation.sketchDiagnostics.solvedConstraints.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="font-bold text-slate-700 uppercase">
                    {c.type} {c.value !== undefined ? `= ${c.value}` : ''}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Residual {c.residual.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area: Real-Time Mass Properties Readout + 3D WebGL & 2D Sketcher Viewports */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4 Mass Property & B-Rep Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Net Solid Volume</div>
              <div
                data-testid="parametric-volume-mm3"
                className="text-lg font-black text-slate-900 mt-1"
              >
                {isPrimaryInputValid ? `${evaluation.massProps.volumeMm3.toFixed(2)} mm³` : '—'}
              </div>
              <div className="text-xs font-semibold text-blue-600">
                {isPrimaryInputValid ? `${evaluation.massProps.volumeCm3.toFixed(2)} cm³` : '—'}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Surface Area</div>
              <div
                data-testid="parametric-area-mm2"
                className="text-lg font-black text-slate-900 mt-1"
              >
                {isPrimaryInputValid ? `${evaluation.massProps.surfaceAreaMm2.toFixed(2)} mm²` : '—'}
              </div>
              <div className="text-xs font-semibold text-indigo-600">
                {isPrimaryInputValid ? `${evaluation.massProps.surfaceAreaCm2.toFixed(2)} cm²` : '—'}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Estimated Mass</div>
              <div
                data-testid="parametric-mass-grams"
                className="text-lg font-black text-slate-900 mt-1"
              >
                {isPrimaryInputValid ? `${evaluation.massProps.massGrams.toFixed(2)} g` : '—'}
              </div>
              <div className="text-xs font-semibold text-emerald-600 truncate">
                {activeMaterial.name}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Center of Gravity</div>
              <div className="text-sm font-black text-slate-900 mt-1 font-mono">
                {isPrimaryInputValid
                  ? `(${evaluation.massProps.centerOfGravityMm.join(', ')}) mm`
                  : '—'}
              </div>
              <div className="text-xs font-semibold text-amber-600 mt-0.5">
                {evaluation.massProps.triangleCount} Tris · Watertight
              </div>
            </div>
          </div>

          {/* 3D WebGL 2.0 Viewport */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <WebGlCadViewport
              mesh={evaluation.mesh}
              featureEdges={evaluation.featureEdges}
              accentColor="#3b82f6"
              height={viewMode === 'split' ? 370 : 480}
              titleBadge="3D Parametric B-Rep Solid Viewport (WebGL 2.0)"
            />
          )}

          {/* 2D Parametric Sketch Viewport */}
          {(viewMode === '2d' || viewMode === 'split') && (
            <Canvas2DCadViewport
              mode="sketch"
              height={viewMode === 'split' ? 280 : 440}
              titleBadge={`2D Parametric Sketcher (${sketchPlane} Plane · Click Canvas to Draw)`}
              sketchEntities={evaluation.sketchDiagnostics.solvedEntities}
              activeTool={activeSketchTool}
              onAddSketchEntity={(ent) => setSketchEntities((prev) => [...prev, ent])}
            />
          )}
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
