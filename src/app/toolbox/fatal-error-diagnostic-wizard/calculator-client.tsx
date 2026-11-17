'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, Search, ShieldAlert, ArrowRight, Settings2, Download, ExternalLink } from 'lucide-react';

interface RecoveryScenario {
  id: string;
  label: string;
  title: string;
  trigger: string;
  commands: string[];
  steps: string[];
  copyCommand: string;
  docTitle: string;
  docUrl: string;
}

const RECOVERY_SCENARIOS: RecoveryScenario[] = [
  {
    id: 'cannot-open',
    label: 'Damaged DWG / Fatal Error Opening File',
    title: 'Recover a Damaged Drawing File (RECOVER / RECOVERALL)',
    trigger: 'Drawing file fails to open, displays errors, or triggers an unexpected crash when opening a specific DWG or nested xref.',
    commands: ['RECOVER', 'RECOVERALL', 'RECOVERAUTO'],
    steps: [
      'Open a blank drawing session and run RECOVER to perform an audit and attempt to open the damaged drawing file.',
      'If the drawing references xrefs, run RECOVERALL so all nested xref files are audited and recovered alongside the host drawing.',
      'Inspect the Drawing Recovery Log window for reported object errors and check RECOVERAUTO if recovery notifications are suppressed.',
      'Copy the recovered drawing locally before resuming work if network storage instability contributed to file damage.',
    ],
    copyCommand: 'RECOVERALL',
    docTitle: 'AutoCAD 2025 Help: Repair Damaged Drawing Files (GUID-353D7074)',
    docUrl: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-353D7074-378B-401E-A983-B2E6C1930264.htm',
  },
  {
    id: 'open-errors',
    label: 'Drawing Opens with Errors or Unused Definitions',
    title: 'Audit Database Errors and Remove Unused Definitions (AUDIT / PURGE / -PURGE)',
    trigger: 'Drawing opens with missing geometry, slow performance, or warnings indicating internal database inconsistencies.',
    commands: ['AUDIT', 'AUDITCTL', 'PURGE', '-PURGE'],
    steps: [
      'Run AUDIT in the current drawing and choose Yes to fix detected database errors.',
      'Set AUDITCTL = 1 if you want the audit results written to an audit log (ADT) file next to the drawing.',
      'Run PURGE or the command-line -PURGE command repeatedly to remove unreferenced named definitions (block definitions, layers, linetypes) one nesting level at a time.',
    ],
    copyCommand: 'AUDIT\nY\n-PURGE\nA\n*\nN',
    docTitle: 'AutoCAD 2025 Help: Repair Damaged Drawing Files & -PURGE (GUID-353D7074 / GUID-C3876E92)',
    docUrl: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-C3876E92-3478-449C-8FAB-DA760B2EDD09.htm',
  },
  {
    id: 'crash-recovery',
    label: 'Unexpected Program Termination & Auto-Save Recovery',
    title: 'Restore Backup & Automatic Save Snapshots (DRAWINGRECOVERY)',
    trigger: 'AutoCAD closed unexpectedly due to a fatal error or system failure and unsaved drawing changes need to be restored.',
    commands: ['DRAWINGRECOVERY'],
    steps: [
      'After restarting AutoCAD, inspect the Drawing Recovery Manager; if closed earlier, reopen it anytime with the DRAWINGRECOVERY command.',
      'Under Backup Files, review the available snapshots listed in the order they were last saved: DrawingFileName_recover.dwg, DrawingFileName_a_b_nnnn.sv$, DrawingFileName.dwg, and DrawingFileName.bak.',
      'Double-click the newest intact snapshot from Backup Files and save it to a verified local folder before continuing.',
    ],
    copyCommand: 'DRAWINGRECOVERY',
    docTitle: 'AutoCAD 2025 Help: Recovering from a System Failure (GUID-DDDADE14)',
    docUrl: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-DDDADE14-9558-4EDB-A8C9-C235291CCBB4.htm',
  },
];

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function FatalErrorWizardClient() {
  const [selectedId, setSelectedId] = useState<string>(RECOVERY_SCENARIOS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredScenarios = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return RECOVERY_SCENARIOS;
    return RECOVERY_SCENARIOS
      .filter(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.trigger.toLowerCase().includes(q) ||
          s.commands.some((c) => c.toLowerCase().includes(q)) ||
          s.steps.some((st) => st.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const aDirect = a.commands.some((c) => c.toLowerCase().includes(q)) || a.title.toLowerCase().includes(q) ? 1 : 0;
        const bDirect = b.commands.some((c) => c.toLowerCase().includes(q)) || b.title.toLowerCase().includes(q) ? 1 : 0;
        return bDirect - aDirect;
      });
  }, [searchTerm]);

  const activeScenario = useMemo(() => {
    return (
      filteredScenarios.find((s) => s.id === selectedId) ??
      filteredScenarios[0] ??
      null
    );
  }, [filteredScenarios, selectedId]);

  const handleCopy = async (text: string, id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1800);
      }
    } catch {
      setCopiedId(null);
    }
  };

  const handleDownloadChecklist = () => {
    if (!activeScenario) return;
    const lines = [
      'CADGuide.tools - AutoCAD Drawing Crash & Recovery Checklist',
      `Scenario: ${activeScenario.title}`,
      `Documented Commands: ${activeScenario.commands.join(', ')}`,
      `Source: ${activeScenario.docUrl}`,
      '',
      'Steps:',
      ...activeScenario.steps.map((st, idx) => `${idx + 1}. ${st}`),
      '',
      'Quick Command Sequence:',
      activeScenario.copyCommand,
      '',
    ];
    const txt = toSafeAscii(lines.join('\n'));
    const blob = new Blob([txt], { type: 'text/plain;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autocad-recovery-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Filter Recovery Workflow
            </h2>

            <div>
              <label htmlFor="input-search" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                Search Command or Symptom
              </label>
              <input
                id="input-search"
                data-testid="input-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. RECOVER, AUDIT, DRAWINGRECOVERY"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900"
              />
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Documented Scenarios ({filteredScenarios.length})
              </div>
              {filteredScenarios.map((sc) => {
                const isActive = activeScenario?.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    data-testid={`scenario-${sc.id}`}
                    onClick={() => setSelectedId(sc.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{sc.label}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{sc.commands.join(' / ')}</div>
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
              {filteredScenarios.length === 0 && (
                <div data-testid="no-results" className="text-xs text-slate-500 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  No matching recovery workflow for &ldquo;{searchTerm}&rdquo;. Try RECOVER, AUDIT, PURGE, or DRAWINGRECOVERY.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {activeScenario ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {activeScenario.commands.map((cmd) => (
                        <span
                          key={cmd}
                          data-testid={`badge-cmd-${cmd}`}
                          className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold"
                        >
                          {cmd}
                        </span>
                      ))}
                    </div>
                    <h3 data-testid="result-title" className="text-xl font-black text-slate-900 tracking-tight">
                      {activeScenario.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    data-testid="btn-download"
                    onClick={handleDownloadChecklist}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Checklist (.txt)
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-sm text-slate-700 space-y-1.5">
                  <p className="font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    When This Applies
                  </p>
                  <p>{activeScenario.trigger}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-blue-600" />
                    Recommended Recovery Steps
                  </p>
                  <ol className="space-y-2.5 text-sm text-slate-700 list-decimal pl-5">
                    {activeScenario.steps.map((st, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>AutoCAD Command Line Sequence</span>
                    <button
                      type="button"
                      data-testid="btn-copy"
                      onClick={() => handleCopy(activeScenario.copyCommand, activeScenario.id)}
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-bold"
                    >
                      {copiedId === activeScenario.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === activeScenario.id ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </div>
                  <pre data-testid="result-command" className="font-mono text-sm text-emerald-400 whitespace-pre-wrap">
                    {activeScenario.copyCommand}
                  </pre>
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <a
                    href={activeScenario.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {activeScenario.docTitle}
                  </a>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-600 py-8 text-center">
                No workflow matches your filter. Clear the search box to restore documented workflows.
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
