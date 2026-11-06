'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Download,
  FileJson,
  Sliders,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';
import { WebGlCadViewport } from './webgl-cad-viewport';
import {
  CODE_CAD_TEMPLATES,
  CodeCadTemplate,
  compileCodeCadScript,
  exportMeshToBinaryStl,
  exportMeshToObj,
  updateScriptParamInCode,
} from '@/lib/wasm-bridges/code-cad-bridge';

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

export default function CodeCadApp() {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeTemplateId, setActiveTemplateId] = useState<CodeCadTemplate['id']>('spur-gear');
  const [code, setCode] = useState<string>(() => CODE_CAD_TEMPLATES[0].code);

  const compiled = useMemo(() => compileCodeCadScript(code), [code]);

  const handleSelectTemplate = (tpl: CodeCadTemplate) => {
    setActiveTemplateId(tpl.id);
    setCode(tpl.code);
  };

  const handleParamChange = (paramName: string, newVal: number) => {
    setCode((prev) => updateScriptParamInCode(prev, paramName, newVal));
  };

  const lineCount = useMemo(() => code.split(/\r?\n/).length, [code]);

  return (
    <div data-hydrated={hydrated ? 'true' : 'false'} className="space-y-8">
      {/* Top Studio Header & Template Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              Rust/WASM DSL Compiler v{compiled.wasmKernelVersion}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Compiled in {compiled.compileTimeMs} ms ·{' '}
              <span data-testid="code-cad-vertex-count">{compiled.vertexCount}</span> Vertices ({compiled.triangleCount} Tris)
            </span>
          </div>

          {/* Industrial Data Exporters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="btn-reset-code"
              onClick={() => {
                const tpl =
                  CODE_CAD_TEMPLATES.find((t) => t.id === activeTemplateId) || CODE_CAD_TEMPLATES[0];
                setCode(tpl.code);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Reset Template
            </button>

            <button
              type="button"
              data-testid="code-export-step-btn"
              onClick={() =>
                triggerDownload(
                  compiled.stepText,
                  `${activeTemplateId}-ap214.step`,
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
              data-testid="code-export-stl-btn"
              onClick={() =>
                triggerDownload(
                  exportMeshToBinaryStl(compiled.mesh),
                  `${activeTemplateId}-binary.stl`,
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
              data-testid="code-export-dxf-btn"
              onClick={() =>
                triggerDownload(
                  compiled.dxfText,
                  `${activeTemplateId}-section.dxf`,
                  'application/dxf'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              2D DXF
            </button>

            <button
              type="button"
              data-testid="code-export-json-btn"
              onClick={() =>
                triggerDownload(
                  JSON.stringify(
                    {
                      version: '1.0',
                      template: activeTemplateId,
                      params: compiled.params,
                      code,
                    },
                    null,
                    2
                  ),
                  `${activeTemplateId}-project.cad.json`,
                  'application/json'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              Save .cad.json
            </button>
          </div>
        </div>

        {/* Built-in Standard Part Family Template Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-500 uppercase mr-1">
            Standard Templates:
          </span>
          {CODE_CAD_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              data-testid={`template-btn-${tpl.id}`}
              onClick={() => handleSelectTemplate(tpl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTemplateId === tpl.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Code Editor + Auto-Slider & 3D Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code-CAD Script Editor + Live AST Diagnostics + Auto-Extracted @param Sliders */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Auto-Extracted @param Interactive Sliders */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <h2 className="text-base font-black text-slate-900">
                  Auto-Extracted <code className="text-purple-600">@param</code> Controls ({compiled.params.length})
                </h2>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                2-Way Live Sync
              </span>
            </div>

            <div className="space-y-3.5">
              {compiled.params.map((p) => (
                <div
                  key={p.name}
                  className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor={`code-param-${p.name}`}
                      className="font-extrabold text-slate-800"
                    >
                      {p.label}{' '}
                      <span className="text-slate-400 font-mono">({p.name})</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`code-param-${p.name}`}
                        type="number"
                        min={p.min}
                        max={p.max * 4}
                        step={p.step}
                        value={p.value}
                        onChange={(e) => {
                          if (e.target.value.trim() === '') return;
                          const v = parseFloat(e.target.value);
                          if (Number.isFinite(v) && v > 0) {
                            handleParamChange(
                              p.name,
                              Math.min(p.max * 4, Math.max(p.min * 0.2, v))
                            );
                          }
                        }}
                        className="w-20 px-2 py-1 rounded-lg border border-slate-300 bg-white text-right font-mono font-bold text-slate-900"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold w-8">
                        {p.unit}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    aria-label={`${p.label} Slider`}
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={Math.min(p.max, Math.max(p.min, p.value))}
                    onChange={(e) => handleParamChange(p.name, Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Code-CAD Script Editor with Line Numbers & Error Diagnostics */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">model.cad (Code-CAD DSL Script)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {lineCount} lines · UTF-8
              </span>
            </div>

            <div className="flex font-mono text-xs">
              <div
                aria-hidden="true"
                className="select-none py-4 px-2.5 bg-slate-900/70 text-slate-600 text-right border-r border-slate-800 leading-6"
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                aria-label="Code-CAD Script Editor"
                data-testid="code-cad-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={18}
                className="w-full p-4 bg-slate-950 text-purple-100 font-mono text-xs leading-6 focus:outline-none resize-y"
              />
            </div>

            {/* Diagnostics Console */}
            <div
              data-testid="code-cad-diagnostics"
              className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs"
            >
              {compiled.diagnostics.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>AST &amp; B-Rep Verification Passed: 0 Syntax/Constraint Errors</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {compiled.diagnostics.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-amber-300 font-semibold"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Line {d.line}, Col {d.column}: {d.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Readout KPIs + 3D WebGL 2.0 Viewport */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4 Engineering Readout KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {compiled.engineeringReadouts.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm"
              >
                <div className="text-[11px] font-bold text-slate-500 uppercase truncate">
                  {item.label}
                </div>
                <div
                  data-testid={`code-cad-readout-${idx}`}
                  className="text-base font-black text-slate-900 mt-1"
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* 3D WebGL 2.0 Viewport */}
          <WebGlCadViewport
            mesh={compiled.mesh}
            featureEdges={compiled.featureEdges}
            accentColor="#7c3aed"
            height={480}
            titleBadge={`Code-CAD Live B-Rep Viewport (${compiled.vertexCount} Vertices · ${compiled.compileTimeMs} ms)`}
          />

          {/* Solid Mass & B-Rep Summary Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-slate-500 font-semibold">Solid Volume: </span>
                <span data-testid="code-cad-volume" className="font-black text-slate-900">
                  {compiled.volumeMm3.toFixed(2)} mm³ ({(compiled.volumeMm3 / 1000).toFixed(2)} cm³)
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Surface Area: </span>
                <span data-testid="code-cad-area" className="font-black text-slate-900">
                  {compiled.surfaceAreaMm2.toFixed(2)} mm²
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                triggerDownload(
                  exportMeshToObj(compiled.mesh, activeTemplateId),
                  `${activeTemplateId}.obj`
                )
              }
              className="text-purple-700 hover:text-purple-900 font-extrabold underline cursor-pointer"
            >
              Download Wavefront .OBJ Mesh
            </button>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
