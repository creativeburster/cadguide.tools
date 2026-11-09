'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Bookmark, Plus, Trash2, RotateCcw, ArrowRight, GitBranch, Check } from 'lucide-react';
import TOOLBOX_INDEX from '@/lib/toolbox-slim.json';

interface SlimTool {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords?: string[];
}

const SLIM_TOOLS = TOOLBOX_INDEX as SlimTool[];

interface SavedPreset {
  id: string;
  name: string;
  createdAt: string;
  values: { id: string; label: string; value: string }[];
}

// Curated Upstream -> Current -> Downstream Engineering Pipeline Chains
const WORKFLOW_CHAINS: Record<
  string,
  {
    pipelineTitle: string;
    upstream: { slug: string; stage: string; label: string; desc: string };
    downstream: { slug: string; stage: string; label: string; desc: string }[];
  }
> = {
  sheet_metal: {
    pipelineTitle: 'Sheet Metal Fabrication & Nesting Pipeline',
    upstream: {
      slug: 'sheet-metal-gauge-chart',
      stage: '1. Material & Gauge',
      label: 'Sheet Metal Gauge & Thickness Chart',
      desc: 'Verify standard steel, stainless, and aluminum sheet thickness before bend calculation.',
    },
    downstream: [
      {
        slug: 'sheet-metal-blank-calculator',
        stage: '2. Flat Pattern Blank',
        label: 'Sheet Metal Flat Blank Length Calculator',
        desc: 'Compute total unfolded flat blank length from bend allowance and deduction.',
      },
      {
        slug: 'web-cad-sheetmetal-nesting',
        stage: '3. CAM Laser Nesting',
        label: '2D Sheet Metal Nesting & DXF CAM Studio',
        desc: 'Pack unfolded sheet metal blanks onto stock plates and export cutting DXF/G-Code.',
      },
    ],
  },
  machining: {
    pipelineTitle: 'CNC Machining & Toolpath Verification Pipeline',
    upstream: {
      slug: 'cnc-tool-specifications-reference',
      stage: '1. Tooling Selection',
      label: 'CNC Cutting Tool Specifications Reference',
      desc: 'Select carbide end mill / insert geometry and recommended chip load.',
    },
    downstream: [
      {
        slug: 'spindle-power-calculator',
        stage: '2. Torque & Power Check',
        label: 'CNC Spindle Power & Torque Calculator',
        desc: 'Verify machine spindle kW and cutting torque against your material removal rate.',
      },
      {
        slug: 'online-gcode-viewer-simulator',
        stage: '3. G-Code Verification',
        label: 'Online G-Code Toolpath Viewer & Simulator',
        desc: 'Inspect generated NC toolpaths, rapid moves, and cycle time in-browser.',
      },
    ],
  },
  fastener_thread: {
    pipelineTitle: 'Threaded Fastener & Bolted Joint Pipeline',
    upstream: {
      slug: 'metric-thread-spec-table',
      stage: '1. Thread Geometry',
      label: 'ISO Metric Thread Pitch & Spec Table',
      desc: 'Look up coarse/fine pitch, major diameter, and basic pitch diameter.',
    },
    downstream: [
      {
        slug: 'tap-drill-size-calculator',
        stage: '2. Hole Preparation',
        label: 'Tap Drill Size & Thread Percentage Calculator',
        desc: 'Calculate exact pre-tap drill diameter for 65%–75% thread engagement.',
      },
      {
        slug: 'bolt-torque-preload-calculator',
        stage: '3. Assembly Preload',
        label: 'Bolt Tightening Torque & Preload Calculator',
        desc: 'Determine assembly wrench torque and clamp load per VDI 2230.',
      },
    ],
  },
  gdt_tolerance: {
    pipelineTitle: 'GD&T & Dimensional Tolerance Stackup Pipeline',
    upstream: {
      slug: 'iso-286-tolerance-table',
      stage: '1. Hole / Shaft Fit',
      label: 'ISO 286 Hole & Shaft Tolerance Table (H7/g6)',
      desc: 'Select standard clearance, transition, or interference fit limits.',
    },
    downstream: [
      {
        slug: 'true-position-calculator',
        stage: '2. Feature Position',
        label: 'GD&T True Position & Bonus Tolerance Calculator',
        desc: 'Verify diametral position zone and MMC/LMC bonus tolerance per ASME Y14.5.',
      },
      {
        slug: 'tolerance-stackup-calculator',
        stage: '3. Assembly Stackup',
        label: 'Worst-Case & RSS Tolerance Stackup Calculator',
        desc: 'Evaluate multi-part assembly gap closure and statistical 3-sigma variation.',
      },
    ],
  },
  structural_beam: {
    pipelineTitle: 'Structural Section & Beam Verification Pipeline',
    upstream: {
      slug: 'steel-section-properties-reference',
      stage: '1. Section Properties',
      label: 'Structural Steel Section Properties (I, Z, A)',
      desc: 'Retrieve moment of inertia (I) and elastic section modulus (S) for standard profiles.',
    },
    downstream: [
      {
        slug: 'beam-deflection-structural-calculator',
        stage: '2. Deflection & Bending',
        label: 'Structural Beam Deflection & Stress Calculator',
        desc: 'Check maximum bending stress and span deflection against L/360 serviceability.',
      },
      {
        slug: 'anchor-bolt-calculator',
        stage: '3. Baseplate Anchorage',
        label: 'Structural Anchor Bolt Pullout & Shear Calculator',
        desc: 'Verify concrete embedment and anchor tension/shear interaction.',
      },
    ],
  },
  additive_3d: {
    pipelineTitle: '3D Printing & Mesh Preparation Pipeline',
    upstream: {
      slug: '3d-printing-chordal-deviation',
      stage: '1. CAD Export Resolution',
      label: '3D Printing Chordal Deviation & Angle Calculator',
      desc: 'Choose optimal STEP-to-STL tessellation chord height before exporting.',
    },
    downstream: [
      {
        slug: 'stl-mesh-checker',
        stage: '2. Manifold Audit',
        label: 'STL Mesh Integrity & Manifold Checker',
        desc: 'Verify watertight triangles, normal orientation, and bounding volume.',
      },
      {
        slug: '3d-print-cost-time-estimator',
        stage: '3. Print Time & Cost',
        label: '3D Print Material Weight, Time & Cost Estimator',
        desc: 'Estimate filament spool consumption, layer time, and part unit cost.',
      },
    ],
  },
  cad_admin: {
    pipelineTitle: 'CAD Administration & License Optimization Pipeline',
    upstream: {
      slug: 'cad-hardware-workstation-spec-builder',
      stage: '1. Workstation Sizing',
      label: 'CAD/BIM Workstation Hardware Spec Builder',
      desc: 'Size CPU single-core clock, ECC RAM, and GPU VRAM for your assembly scale.',
    },
    downstream: [
      {
        slug: 'flexlm-concurrent-seats-queue',
        stage: '2. Floating Seat Pool',
        label: 'Concurrent Floating License Seat Calculator',
        desc: 'Model Erlang-B seat denial probability and optimal floating license ratio.',
      },
      {
        slug: 'cad-license-tco-calculator',
        stage: '3. 5-Year TCO Audit',
        label: 'CAD Subscription vs. Perpetual 5-Year TCO Calculator',
        desc: 'Compare multi-year SaaS subscription renewal cost against perpetual licenses.',
      },
    ],
  },
};

function resolvePipelineForSlug(slug: string, discipline: string) {
  const s = slug.toLowerCase();
  const d = discipline.toLowerCase();

  if (s.includes('bend') || s.includes('k-factor') || s.includes('sheet-metal') || s.includes('punch') || s.includes('nesting')) {
    return WORKFLOW_CHAINS.sheet_metal;
  }
  if (s.includes('milling') || s.includes('turning') || s.includes('speeds-feeds') || s.includes('spindle') || s.includes('gcode') || s.includes('machining') || s.includes('tool-wear')) {
    return WORKFLOW_CHAINS.machining;
  }
  if (s.includes('thread') || s.includes('tap-drill') || s.includes('bolt') || s.includes('screw') || s.includes('fastener') || s.includes('torque')) {
    return WORKFLOW_CHAINS.fastener_thread;
  }
  if (s.includes('tolerance') || s.includes('position') || s.includes('gdt') || s.includes('fit')) {
    return WORKFLOW_CHAINS.gdt_tolerance;
  }
  if (s.includes('3d-print') || s.includes('stl') || s.includes('chordal') || s.includes('extruder') || s.includes('filament')) {
    return WORKFLOW_CHAINS.additive_3d;
  }
  if (s.includes('license') || s.includes('flexlm') || s.includes('workstation') || s.includes('hardware') || s.includes('pgp') || s.includes('dwg')) {
    return WORKFLOW_CHAINS.cad_admin;
  }
  if (s.includes('beam') || s.includes('column') || s.includes('steel') || s.includes('weld') || d.includes('structural') || d.includes('civil')) {
    return WORKFLOW_CHAINS.structural_beam;
  }

  // Fallback: match 3 related tools from slim index in same category/keywords
  const current = SLIM_TOOLS.find((t) => t.slug === slug);
  const siblings = SLIM_TOOLS.filter(
    (t) => t.slug !== slug && (t.category === current?.category || t.category === 'calculator')
  ).slice(0, 3);

  if (siblings.length >= 3) {
    return {
      pipelineTitle: `${discipline || 'Engineering'} Multi-Step Calculation Pipeline`,
      upstream: {
        slug: siblings[0].slug,
        stage: '1. Prerequisite Check',
        label: siblings[0].title,
        desc: siblings[0].description,
      },
      downstream: [
        {
          slug: siblings[1].slug,
          stage: '2. Companion Verification',
          label: siblings[1].title,
          desc: siblings[1].description,
        },
        {
          slug: siblings[2].slug,
          stage: '3. Downstream Validation',
          label: siblings[2].title,
          desc: siblings[2].description,
        },
      ],
    };
  }
  return WORKFLOW_CHAINS.machining;
}

/**
 * Reads and applies input/select values on the current calculator page via React's native value setter
 * so any calculator on the site gains user-triggered LocalStorage Preset save/load without altering
 * its initial default mount state (keeping all automated E2E default assertions 100% intact).
 */
function captureCurrentPageInputs(): { id: string; label: string; value: string }[] {
  const mainEl = document.querySelector('main') || document.body;
  const controls = Array.from(
    mainEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      'input[type="number"], input[type="text"]:not([data-testid="preset-name-input"]):not([data-testid="shortcut-search-input"]), select'
    )
  );

  return controls
    .filter((el) => !el.closest('[data-testid="toolbox-preset-bar"]'))
    .map((el, idx) => {
      const id = el.getAttribute('data-testid') || el.id || el.name || `field-${idx}`;
      const wrapper = el.closest('div');
      const labelEl = wrapper?.querySelector('label');
      const label = (labelEl?.textContent || id).trim().replace(/\s+/g, ' ').slice(0, 32);
      return { id, label, value: el.value };
    })
    .filter((item) => item.value !== '');
}

function applyInputsToPage(values: { id: string; label: string; value: string }[]) {
  const mainEl = document.querySelector('main') || document.body;
  const controls = Array.from(
    mainEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      'input[type="number"], input[type="text"]:not([data-testid="preset-name-input"]):not([data-testid="shortcut-search-input"]), select'
    )
  ).filter((el) => !el.closest('[data-testid="toolbox-preset-bar"]'));

  controls.forEach((el, idx) => {
    const id = el.getAttribute('data-testid') || el.id || el.name || `field-${idx}`;
    const match = values.find((v) => v.id === id);
    if (!match) return;

    if (el instanceof HTMLSelectElement) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
      setter?.call(el, match.value);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setter?.call(el, match.value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

export function ToolboxPresetAndPipelineBar({
  slug,
  title,
  discipline,
}: {
  slug: string;
  title: string;
  discipline: string;
}) {
  const storageKey = `cadguide_presets_v1_${slug}`;
  const [presets, setPresets] = useState<SavedPreset[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors in private browsing
    }
    return [];
  });
  const [presetName, setPresetName] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const savePresetsToStorage = useCallback(
    (next: SavedPreset[]) => {
      setPresets(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
    },
    [storageKey]
  );

  const handleSaveCurrentPreset = () => {
    const snapshot = captureCurrentPageInputs();
    if (snapshot.length === 0) return;

    const cleanName =
      presetName.trim() ||
      `Spec #${presets.length + 1} (${snapshot
        .slice(0, 2)
        .map((s) => s.value)
        .join(' / ')})`;

    const newEntry: SavedPreset = {
      id: `${Date.now()}`,
      name: cleanName,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      values: snapshot,
    };

    const updated = [newEntry, ...presets].slice(0, 8);
    savePresetsToStorage(updated);
    setPresetName('');
    setActivePresetId(newEntry.id);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const handleLoadPreset = (preset: SavedPreset) => {
    applyInputsToPage(preset.values);
    setActivePresetId(preset.id);
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    savePresetsToStorage(updated);
    if (activePresetId === id) setActivePresetId(null);
  };

  const pipeline = resolvePipelineForSlug(slug, discipline);

  return (
    <div className="space-y-8 print:hidden" data-testid="toolbox-preset-bar">
      {/* 1. Local Browser Parameter Presets & History Bar */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  My Saved Engineering Presets (Browser LocalStorage)
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100% Local • Zero Account Needed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Save your shop-floor material thicknesses, machine speeds, or team seat counts locally in this browser for instant 1-click recall on your next visit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              data-testid="preset-name-input"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name (e.g. 2mm 304 SS)..."
              className="h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
            />
            <button
              type="button"
              data-testid="btn-save-local-preset"
              onClick={handleSaveCurrentPreset}
              className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved Locally!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Current Inputs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {presets.length > 0 ? (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1">
              Saved Specs ({presets.length}/8):
            </span>
            {presets.map((p) => (
              <div
                key={p.id}
                className={`inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border text-xs transition-all ${
                  activePresetId === p.id
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 font-bold hover:border-blue-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleLoadPreset(p)}
                  className="flex items-center gap-1.5 cursor-pointer text-left"
                  title={p.values.map((v) => `${v.label}: ${v.value}`).join(' | ')}
                >
                  <RotateCcw className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({p.values.slice(0, 3).map((v) => v.value).join(', ')})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePreset(p.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Remove saved preset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>
              No custom presets saved for <strong className="text-slate-600">{title}</strong> yet. Adjust any input above and click &ldquo;Save Current Inputs&rdquo; to pin your standard parameters.
            </span>
          </div>
        )}
      </section>

      {/* 2. Upstream & Downstream Engineering Workflow Pipeline */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                Connected Engineering Workflow Chain
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                {pipeline.pipelineTitle}
              </h3>
            </div>
          </div>
          <Link
            href="/toolbox"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All 670+ Engineering Utilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Upstream Step */}
          <Link
            href={`/toolbox/${pipeline.upstream.slug}`}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 rounded-2xl p-4 flex flex-col justify-between transition-all space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {pipeline.upstream.stage} (Upstream)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                {pipeline.upstream.label}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pipeline.upstream.desc}
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-400">
              Open Prerequisite Tool →
            </span>
          </Link>

          {/* Downstream Step 1 */}
          {pipeline.downstream.map((step) => (
            <Link
              key={step.slug}
              href={`/toolbox/${step.slug}`}
              className="group bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-400 rounded-2xl p-4 flex flex-col justify-between transition-all space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {step.stage} (Next Step)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-blue-200 transition-colors">
                  {step.label}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <span className="text-[11px] font-extrabold text-blue-300">
                Continue to Next Step →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
