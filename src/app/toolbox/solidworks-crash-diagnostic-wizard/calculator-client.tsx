'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, RotateCcw, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

interface WizardScenario {
  id: string;
  label: string;
  category: string;
  question: string;
  cause: string;
  officialUrl: string;
  officialLabel: string;
  steps: { title: string; detail: string; actionNote?: string }[];
}

const SCENARIOS: WizardScenario[] = [
  {
    id: 'graphics-opengl',
    label: 'Crashes on Open / Viewport Display Glitches',
    category: 'Graphics Driver',
    question: 'Does SOLIDWORKS crash, hang, or show display artifacts when opening models or rotating viewports?',
    cause: 'Hardware graphics card or driver incompatibility during accelerated viewport rendering. SOLIDWORKS Rx includes a single-session OpenGL software test mode and driver Diagnostics tab.',
    officialUrl: 'https://blogs.solidworks.com/products/solidworks/complete-guide-using-solidworks-rx/',
    officialLabel: 'SOLIDWORKS Blog: Complete Guide to Using SOLIDWORKS Rx',
    steps: [
      {
        title: 'Launch SOLIDWORKS in OpenGL mode via SOLIDWORKS Rx',
        detail: 'Close SOLIDWORKS, open SOLIDWORKS Rx from Windows Tools, and select "Click here to Launch SOLIDWORKS in OpenGL mode" to test without using your CAD video card.',
      },
      {
        title: 'Inspect Diagnostics Tab Graphics Card Entry',
        detail: 'Open the SOLIDWORKS Rx Diagnostics Tab to review your graphics card information and verify you are running a certified graphics driver for stability.',
        actionNote: 'Source: SOLIDWORKS Graphic Optimization Guide & SOLIDWORKS Rx Diagnostics Tab',
      },
    ],
  },
  {
    id: 'large-assembly',
    label: 'Large Assembly Lag, Freezes & Slow Rebuilds',
    category: 'Assembly Performance',
    question: 'Does SOLIDWORKS freeze or slow down sharply when opening or mating complex multi-level assemblies?',
    cause: 'Opening every subassembly fully Resolved loads unnecessary solid geometry and mates into memory when lighter assembly opening modes or SpeedPak configurations would suffice.',
    officialUrl: 'https://blogs.solidworks.com/products/solidworks/large-assembly-tips-tricks/',
    officialLabel: 'SOLIDWORKS Blog: Large Assembly Tips & Tricks',
    steps: [
      {
        title: 'Choose the Appropriate Assembly Opening Mode',
        detail: 'Switch between Resolved, Lightweight, Large Assembly Mode, and Large Design Review depending on whether you need full feature editing or fast review/mating.',
      },
      {
        title: 'Create a SpeedPak Configuration for Subassemblies',
        detail: 'Use SpeedPak on heavy subassemblies to reduce file footprint by limiting loaded geometry to the specific faces and bodies required for mate referencing.',
      },
    ],
  },
  {
    id: 'temp-maintenance',
    label: 'Unstable Repeated Sessions / Accumulated Temp Files',
    category: 'System Maintenance',
    question: 'Does instability appear progressively across sessions or after abrupt program exits?',
    cause: 'Accumulated temporary files in SOLIDWORKS data folders or prior crash/reboot history can degrade startup and session reliability.',
    officialUrl: 'https://blogs.solidworks.com/products/solidworks/complete-guide-using-solidworks-rx/',
    officialLabel: 'SOLIDWORKS Blog: System Maintenance & Reliability Tabs',
    steps: [
      {
        title: 'Run SOLIDWORKS Rx System Maintenance Cleaning',
        detail: 'Use the built-in System Maintenance utility in SOLIDWORKS Rx for cleaning temporary files in SOLIDWORKS data folders through the supported GUI tool.',
      },
      {
        title: 'Review Session History in the Reliability Tab',
        detail: 'Inspect the SOLIDWORKS Rx Reliability Tab to review past sessions, reboots, and crash patterns before escalating.',
      },
    ],
  },
  {
    id: 'problem-capture',
    label: 'Repeatable Crash Requiring Reseller Support Package',
    category: 'Diagnostics & Escalation',
    question: 'Do crashes recur on a specific workflow even after adjusting display quality or assembly modes?',
    cause: 'Repeatable application defects or environment conflicts require a complete diagnostic capture with system settings and performance logs.',
    officialUrl: 'https://www.solidworks.com/sw/docs/SolidWorks_Graphic_Optimization_Guide.pdf',
    officialLabel: 'SOLIDWORKS Graphic Optimization Guide (PDF)',
    steps: [
      {
        title: 'Balance Performance vs. Image Quality',
        detail: 'Review SolidWorks System options - Performance to balance 3D display performance against visual image quality for complex parts.',
      },
      {
        title: 'Complete the 3-Step SOLIDWORKS Rx Problem Capture',
        detail: 'On the SOLIDWORKS Rx Problem Capture Tab: Step 1 Record (choose Use Current Session or reproduce), Step 2 Add More Files to Zip if needed, and Step 3 fill out the Problem Capture Details form for support.',
      },
    ],
  },
];

export default function SolidWorksCrashClient() {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selected = SCENARIOS.find(s => s.id === selectedId) || SCENARIOS[0];

  const toggleStep = (key: string) => {
    setCheckedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = selected.steps.filter((_, idx) => checkedSteps[`${selected.id}-${idx}`]).length;

  const handleCopySummary = () => {
    const text = [
      `SOLIDWORKS Diagnostic Checklist - ${selected.label}`,
      `Cause: ${selected.cause}`,
      `Official Source: ${selected.officialUrl}`,
      ...selected.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.detail}`),
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(selected.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadChecklistTxt = () => {
    const text = [
      'SOLIDWORKS Crash & Freeze Official Diagnostic Checklist',
      `Scenario: ${selected.label} (${selected.category})`,
      `Summary: ${selected.cause}`,
      `Source URL: ${selected.officialUrl}`,
      '',
      'Action Steps:',
      ...selected.steps.map((s, i) =>
        `[ ${checkedSteps[`${selected.id}-${i}`] ? 'x' : ' '} ] ${i + 1}. ${s.title}\n    ${s.detail}`
      ),
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidworks-diagnostic-${selected.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="calculator-client" className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Select Symptom</h2>
              <p className="text-xs text-slate-500 font-medium">Guided by official SOLIDWORKS Rx &amp; Assembly documentation</p>
            </div>
          </div>
          <button
            type="button"
            data-testid="btn-reset"
            onClick={() => {
              setSelectedId(SCENARIOS[0].id);
              setCheckedSteps({});
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              type="button"
              data-testid={`scenario-${s.id}`}
              onClick={() => setSelectedId(s.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selected.id === s.id
                  ? 'border-blue-500 bg-blue-50/60'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 block mb-1">{s.category}</span>
              <span className="text-sm font-black text-slate-800">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div data-testid="diagnostic-panel" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 block mb-1">{selected.category}</span>
              <h3 data-testid="diag-title" className="text-xl font-black text-slate-900 mb-2">{selected.question}</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{selected.cause}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="copy-checklist-btn"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
            >
              {copiedId === selected.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === selected.id ? 'Copied' : 'Copy Steps'}
            </button>
            <button
              type="button"
              data-testid="export-txt-btn"
              onClick={downloadChecklistTxt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Checklist (.txt)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
            <span>Official Diagnostic Steps</span>
            <span data-testid="progress-count">{completedCount} / {selected.steps.length} checked</span>
          </div>

          {selected.steps.map((step, idx) => {
            const key = `${selected.id}-${idx}`;
            const checked = Boolean(checkedSteps[key]);
            return (
              <div
                key={key}
                data-testid={`step-${idx}`}
                onClick={() => toggleStep(key)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  checked ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${checked ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-500'}`}>
                    {checked ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-black">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-black mb-1 ${checked ? 'line-through text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.detail}</p>
                    {step.actionNote && (
                      <p className="mt-2 text-xs font-bold text-slate-500">{step.actionNote}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Reference Documentation</span>
          <a
            href={selected.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-black text-blue-600 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            {selected.officialLabel}
          </a>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
