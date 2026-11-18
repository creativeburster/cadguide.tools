'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, ShieldAlert, ExternalLink, Layers, Link2, Eye, FileInput, Users, Download } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  iconKey: 'layers' | 'links' | 'views' | 'dwg' | 'worksharing';
  symptoms: string[];
  cause: string;
  sourceTitle: string;
  sourceUrl: string;
  fixes: { step: string; detail: string; command?: string }[];
}

const ISSUES: Issue[] = [
  {
    id: 'families',
    title: 'Unused Elements & Heavy Nested Families',
    iconKey: 'layers',
    symptoms: [
      'Project file size keeps growing after iterative family edits',
      'Unused views, families, and types accumulate inside the model',
      'Complex nested 3D geometry renders in coarse plan or elevation views',
    ],
    cause: 'Accumulated unused views, families, materials, and unsimplified high-detail 3D family geometry increase the active object database and viewport regeneration load.',
    sourceTitle: 'Revit Help: Purge Unused Objects',
    sourceUrl: 'https://help.autodesk.com/cloudhelp/2022/ENU/Revit-Customize/files/GUID-4EBBDE76-E019-486E-BFBF-EE326CAAE2C4.htm',
    fixes: [
      {
        step: 'Back up the model and run Purge Unused',
        detail: 'Create a backup project file first. If the project is workset-enabled, ensure all worksets are open before running Purge Unused to remove unused views, families, and other objects.',
        command: 'Manage tab -> Settings panel -> Purge Unused',
      },
      {
        step: 'Set coarse detail visibility in families',
        detail: 'Assign complex 3D solids to Fine detail level and keep Coarse/Medium views using simplified 2D symbolic lines so plan navigation avoids heavy solid projection.',
      },
    ],
  },
  {
    id: 'links',
    title: 'Linked Models & DWG Underlay Overhead',
    iconKey: 'links',
    symptoms: [
      'Model opening or view switching slows down across disciplines',
      'Multiple linked Revit, CAD, or DWF markup files remain loaded in every view',
      'Linked views pull unnecessary categories from discipline models',
    ],
    cause: 'Keeping large linked models or CAD files loaded when not actively needed forces Revit to load and regenerate additional discipline geometry in memory.',
    sourceTitle: 'Revit Help: Linking Models',
    sourceUrl: 'https://help.autodesk.com/cloudhelp/2025/ENU/Revit-Collaborate/files/GUID-7B2D9699-D9CE-446D-A424-A8BF488C728D.htm',
    fixes: [
      {
        step: 'Review and unload inactive links via Manage Links',
        detail: 'Inspect Revit, CAD Formats, and DWF Markups tabs in Manage Links. Unload links or close dedicated link worksets when editing isolated zones.',
        command: 'Manage tab -> Manage Project panel -> Manage Links',
      },
      {
        step: 'Filter linked visibility by Linked View',
        detail: 'In Visibility/Graphics overrides -> Revit Links, switch display settings from By Host View to By Linked View where only a specific floor plan or discipline grid is needed.',
      },
    ],
  },
  {
    id: 'views',
    title: 'Inconsistent View Templates & Hidden Line Load',
    iconKey: 'views',
    symptoms: [
      'Unneeded working views pile up in the Project Browser',
      'Each view recalculates separate visibility overrides without templates',
      'Wide 3D views render every element without section boxes',
    ],
    cause: 'Excess unorganized working views and unconstrained 3D views expand the indexed view definitions and graphical recalculation scope.',
    sourceTitle: 'Revit Help: Manage Links & View Organization',
    sourceUrl: 'https://help.autodesk.com/cloudhelp/2019/ENU/Revit-DocumentPresent/files/GUID-A80AFF8B-F673-489C-85EC-3586D4C8B7FA.htm',
    fixes: [
      {
        step: 'Standardize view settings with View Templates',
        detail: 'Apply discipline View Templates across working and documentation views so visibility, detail level, and shadow states remain controlled.',
        command: 'View tab -> Graphics panel -> View Templates',
      },
      {
        step: 'Use Section Boxes in 3D inspection views',
        detail: 'Enable Section Box on working 3D views to restrict rendered geometry to the active building zone rather than the entire site.',
      },
    ],
  },
  {
    id: 'worksharing',
    title: 'Synchronize with Central Delays',
    iconKey: 'worksharing',
    symptoms: [
      'Expected delay during your central file accesses notice appears',
      'Multiple team members synchronize against a file-based central simultaneously',
      'Stale or corrupt central model requires administrative repair',
    ],
    cause: 'Concurrent access contention on a file-based central model or accumulated database fragmentation slows down Synchronize with Central operations.',
    sourceTitle: 'Revit Help: About Delays When Using Synchronize with Central',
    sourceUrl: 'https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Collaborate/files/GUID-5196BA79-8632-45EC-BC8A-4971FE362465.htm',
    fixes: [
      {
        step: 'Inspect Central File Access status before restarting',
        detail: 'Wait for active central file access to clear or check Central File Access status rather than terminating Revit mid-sync.',
        command: 'Collaborate tab -> Synchronize panel -> Synchronize with Central',
      },
      {
        step: 'Repair Corrupt Central Model when blocked',
        detail: 'For file-based worksharing corruption errors, have users close the model and run Repair Central Model from an intact workstation.',
        command: 'Collaborate tab -> Manage Models panel -> Repair Central Model',
      },
    ],
  },
  {
    id: 'dwg-imports',
    title: 'Imported & Exploded CAD Objects',
    iconKey: 'dwg',
    symptoms: [
      'Model becomes heavy immediately after importing DWG drawings',
      'Imported line patterns and subcategories appear in Object Styles',
      'Exploded CAD blocks leave hundreds of unstructured detail lines',
    ],
    cause: 'Importing CAD geometry directly into project files embeds all layers and patterns inside the project stream, and exploding multiplies individual element records.',
    sourceTitle: 'Revit Help: Purge Unused Objects after Removing Imports',
    sourceUrl: 'https://help.autodesk.com/cloudhelp/2022/ENU/Revit-Customize/files/GUID-4EBBDE76-E019-486E-BFBF-EE326CAAE2C4.htm',
    fixes: [
      {
        step: 'Replace direct DWG imports with Linked CAD',
        detail: 'Remove imported CAD instances from views and re-attach them as linked references via Manage Links when reference geometry is still needed.',
        command: 'Insert tab -> Link panel -> Link CAD',
      },
      {
        step: 'Run Purge Unused after clearing CAD artifacts',
        detail: 'After deleting imported instances and stray line patterns, run Purge Unused to clear unreferenced materials and symbols.',
        command: 'Manage tab -> Settings panel -> Purge Unused',
      },
    ],
  },
];

function renderIssueIcon(iconKey: Issue['iconKey']) {
  if (iconKey === 'links') return <Link2 className="w-5 h-5" />;
  if (iconKey === 'views') return <Eye className="w-5 h-5" />;
  if (iconKey === 'dwg') return <FileInput className="w-5 h-5" />;
  if (iconKey === 'worksharing') return <Users className="w-5 h-5" />;
  return <Layers className="w-5 h-5" />;
}

export default function RevitPerfClient() {
  const [selectedId, setSelectedId] = useState<string>(ISSUES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selected = ISSUES.find((i) => i.id === selectedId) || ISSUES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }).catch(() => {});
  };

  const downloadChecklist = () => {
    const lines = [
      'Revit Model Performance Diagnostic Checklist',
      `Selected Bottleneck: ${selected.title}`,
      `Official Reference: ${selected.sourceTitle} (${selected.sourceUrl})`,
      '',
      'Common Symptoms:',
      ...selected.symptoms.map((s, idx) => `${idx + 1}. ${s}`),
      '',
      'Recommended Actions:',
      ...selected.fixes.map((f, idx) => `${idx + 1}. ${f.step} - ${f.detail}${f.command ? ` [Command: ${f.command}]` : ''}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revit-performance-${selected.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Select Bottleneck Area</h2>
          </div>
          {ISSUES.map((issue) => (
            <button
              key={issue.id}
              type="button"
              data-testid={`issue-btn-${issue.id}`}
              onClick={() => setSelectedId(issue.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                selectedId === issue.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedId === issue.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                {renderIssueIcon(issue.iconKey)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-black ${selectedId === issue.id ? 'text-blue-700' : 'text-slate-900'}`}>{issue.title}</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">{issue.symptoms.length} symptoms | {issue.fixes.length} actions</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-black text-slate-900" data-testid="selected-issue-title">{selected.title}</h3>
              <button type="button" onClick={downloadChecklist} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800">
                <Download className="w-3.5 h-3.5" />
                Export Checklist
              </button>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Symptoms</h4>
              <ul className="space-y-2">
                {selected.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                    <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">Technical Cause</div>
              <p className="text-sm text-slate-700 font-medium">{selected.cause}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Verified Workflow Steps</h4>
              {selected.fixes.map((fix, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2">
                  <div className="text-sm font-black text-slate-900">{i + 1}. {fix.step}</div>
                  <p className="text-sm text-slate-600">{fix.detail}</p>
                  {fix.command && (
                    <div className="flex items-center gap-2 pt-1">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono break-all">{fix.command}</code>
                      <button
                        type="button"
                        onClick={() => handleCopy(fix.command!, `fix-${selected.id}-${i}`)}
                        aria-label={`Copy command ${i + 1}`}
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 shrink-0"
                      >
                        {copiedId === `fix-${selected.id}-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <a
              href={selected.sourceUrl}
              data-testid="official-help-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline uppercase tracking-wider"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {selected.sourceTitle}
            </a>
          </div>

          <RelatedTools compact />
        </div>
      </div>
    </div>
  );
}
