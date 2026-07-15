'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Copy, Check, ShieldAlert, ArrowRight, Layers, Link2, Eye, FileInput, Users } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  icon: typeof Layers;
  symptoms: string[];
  cause: string;
  fixes: { step: string; detail: string; command?: string }[];
}

const ISSUES: Issue[] = [
  {
    id: 'families',
    title: 'Oversized Families / Heavy Geometry',
    icon: Layers,
    symptoms: [
      'Model file size exceeds 500 MB',
      'Navigation stutters when entering specific rooms or areas',
      'Loading a particular family takes 10+ seconds',
      'Family contains 500+ nested families or reference planes',
    ],
    cause: 'Revit families with excessive geometry detail (high-poly 3D models), unnecessary nested families, or hundreds of reference planes create massive overhead. Each family instance inherits all internal geometry, so a 10 MB door family placed 200 times adds 2 GB of processing load.',
    fixes: [
      {
        step: 'Audit family sizes with Revit Lookup',
        detail: 'Use Revit Lookup (free add-in) to inspect family sizes. Identify families larger than 5 MB. Focus cleanup on the largest families first — a single 50 MB family can cause more lag than 500 small ones.',
      },
      {
        step: 'Purge unused elements from families',
        detail: 'Open each heavy family → Manage → Purge Unused → check all. Remove unused materials, nested families, reference planes, and subcategories. Save the family back to the project.',
      },
      {
        step: 'Simplify geometry detail',
        detail: 'Replace high-poly imported DWG geometry with native Revit geometry. Use coarse detail level for 3D views. Remove fillets, chamfers, and small holes that are not visible at typical view scales.',
      },
      {
        step: 'Use visibility controls to reduce display load',
        detail: 'In family editor, set 3D geometry to display only in "Fine" detail level. Create simplified 2D representations for plan and elevation views. This prevents Revit from rendering complex 3D geometry in every view.',
      },
    ],
  },
  {
    id: 'links',
    title: 'Excessive Linked Models / Heavy Links',
    icon: Link2,
    symptoms: [
      'Model takes 5+ minutes to open',
      'Switching between views causes 10-30 second freezes',
      'Multiple linked Revit or CAD files are attached',
      'Linked CAD files (DWG) are very large or contain many layers',
    ],
    cause: 'Linked Revit models and DWG underlays are loaded into memory on every view change. If you have 10+ linked models, or linked DWGs with 50 MB+ each, Revit must process all of them for every navigation action. Linked DWGs are particularly costly because Revit cannot optimize them the way it does native elements.',
    fixes: [
      {
        step: 'Audit linked model sizes',
        detail: 'Manage → Manage Links → Revit tab. Note the file sizes. Any link over 200 MB is a candidate for optimization. For DWG links, check the DWG file size outside Revit.',
      },
      {
        step: 'Use Worksets to control link visibility',
        detail: 'Place each linked model on its own workset. Close worksets that are not needed for the current task. This prevents Revit from loading the link geometry into memory.',
      },
      {
        step: 'Replace DWG links with Revit links',
        detail: 'DWG links are 5-10x slower than Revit links. Convert DWG underlays to Revit models and link those instead. If DWG must be used, bind only the needed layers and freeze the rest.',
      },
      {
        step: 'Use Linked View filtering',
        detail: 'When linking a Revit model, select "Linked View" instead of "All". Choose only the specific view needed (e.g., structural plan). This dramatically reduces the geometry Revit must process.',
      },
    ],
  },
  {
    id: 'views',
    title: 'Poor View Templates / Excessive View Count',
    icon: Eye,
    symptoms: [
      'Project browser shows 500+ views',
      'Many views have no view template applied',
      'Duplicate views with slight variations clutter the browser',
      '3D views have all categories visible with no filtering',
    ],
    cause: 'Revit indexes every view in the project, even hidden ones. 500+ views means 500+ view definitions in memory. Views without templates have inconsistent visibility settings, causing Revit to recalculate visibility for each view independently. 3D views with all categories visible are the most expensive.',
    fixes: [
      {
        step: 'Delete unused views',
        detail: 'Use the "Browser Organization" to sort by "Last Modified". Delete views not modified in the last 30 days. Use "Dependent Views" instead of duplicating views for different scales.',
      },
      {
        step: 'Apply view templates to all views',
        detail: 'Create view templates for each discipline (architectural plan, structural plan, MEP plan). Apply templates to all views. This ensures consistent visibility settings and reduces per-view processing.',
        command: 'View → View Templates → Apply Template to All Views',
      },
      {
        step: 'Hide unnecessary categories in 3D views',
        detail: 'In 3D views, hide categories like furniture, planting, lighting fixtures, and mechanical equipment that are not needed for the current task. Use section boxes to limit the visible volume.',
      },
      {
        step: 'Disable "Show Hidden Lines" in views',
        detail: 'The "Show Hidden Lines" setting forces Revit to calculate hidden line projections for every element — extremely expensive. Set it to "None" in view templates unless specifically needed for construction documents.',
      },
    ],
  },
  {
    id: 'dwg-imports',
    title: 'DWG Imports (Not Links) Bloating Model',
    icon: FileInput,
    symptoms: [
      'File size grew dramatically after importing DWG files',
      'Model contains imported DWG geometry that cannot be selected or cleaned',
      'Exploded DWG imports created thousands of line elements',
      'Unknown line patterns and text styles appeared after import',
    ],
    cause: 'Importing (not linking) a DWG file embeds all geometry, layers, blocks, and line patterns directly into the Revit model. Exploding the import multiplies the problem — each block becomes individual lines, and each layer becomes a Revit subcategory. A single exploded 10 MB DWG can add 100+ MB to the Revit file.',
    fixes: [
      {
        step: 'Identify and remove DWG imports',
        detail: 'Manage → Manage Links → CAD Formats tab. If the DWG is listed as a link, remove it. If it was imported (not linked), it is embedded in the model and must be found via "Select All Instances" → Imported Categories.',
      },
      {
        step: 'Never explode DWG imports',
        detail: 'If DWGs are already imported, do NOT explode them. Exploding creates thousands of individual line elements that are nearly impossible to clean up. Instead, delete the import and re-link the DWG.',
      },
      {
        step: 'Clean line patterns and text styles',
        detail: 'Manage → Additional Settings → Line Patterns. Delete any line patterns that came from DWG imports (they usually have AutoCAD-style names like "DASHED", "CENTER", "PHANTOM"). Similarly clean up text styles.',
      },
      {
        step: 'Use Purge Unused after cleanup',
        detail: 'After removing DWG imports and their artifacts, run Manage → Purge Unused repeatedly until no more items appear. Each purge pass may reveal new items freed by the previous pass.',
      },
    ],
  },
  {
    id: 'worksharing',
    title: 'Worksharing Conflicts / Central Model Issues',
    icon: Users,
    symptoms: [
      'Sync with central takes 5+ minutes',
      'Users get "element was modified in central" errors frequently',
      'Model becomes read-only unexpectedly',
      'Local file corruption requires frequent "create new local"',
    ],
    cause: 'Worksharing performance degrades when the central model accumulates orphaned elements, unused worksets, and excessive change history. The more users and the longer the project, the more the central model bloats. Additionally, users working on outdated local files or not syncing regularly causes element-level conflicts.',
    fixes: [
      {
        step: 'Compact the central model',
        detail: 'Ask all users to sync and close Revit. Open the central model directly (not a local) → File → Save As → Options → check "Compact". This rebuilds the database and removes orphaned elements.',
      },
      {
        step: 'Audit and repair the central model',
        detail: 'File → Open → check "Audit" checkbox → select the central model. This runs a full database integrity check and repairs corrupted elements. Do this during off-hours as it takes significant time.',
        command: 'File → Open → Audit checkbox → Select Central Model',
      },
      {
        step: 'Consolidate worksets',
        detail: 'If you have 20+ worksets, consolidate related ones. Each workset adds overhead to every sync operation. Aim for 5-10 worksets maximum, organized by discipline or building section.',
      },
      {
        step: 'Establish sync discipline',
        detail: 'Require all users to sync at least every 2 hours. Set up a daily "reload latest" routine at start of day. Prevent users from keeping elements borrowed overnight.',
      },
    ],
  },
];

export default function RevitPerfClient() {
  const [selectedId, setSelectedId] = useState<string>(ISSUES[0].id);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const selected = ISSUES.find(i => i.id === selectedId) || ISSUES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Issue List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Select Your Issue</h2>
          </div>
          {ISSUES.map(issue => {
            const Icon = issue.icon;
            return (
              <button
                key={issue.id}
                onClick={() => setSelectedId(issue.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  selectedId === issue.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedId === issue.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-black ${selectedId === issue.id ? 'text-blue-600' : 'text-slate-900'}`}>{issue.title}</h3>
                  <p className="text-sm text-slate-400 font-bold mt-1">{issue.symptoms.length} symptoms identified</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symptoms */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Common Symptoms</h3>
            <ul className="space-y-3">
              {selected.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">{symptom}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Root Cause */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <h3 className="text-base font-black text-amber-600 uppercase tracking-wider mb-2">Root Cause Analysis</h3>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">{selected.cause}</p>
          </div>

          {/* Fixes */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Step-by-Step Fixes</h3>
            <div className="space-y-4">
              {selected.fixes.map((fix, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-black shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900">{fix.step}</h4>
                      <p className="text-base text-slate-600 font-medium mt-1 leading-relaxed">{fix.detail}</p>
                    </div>
                  </div>
                  {fix.command && (
                    <div className="mt-3 ml-10 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-white text-base font-mono break-all">
                        {fix.command}
                      </code>
                      <button
                        onClick={() => handleCopy(fix.command!, `fix-${i}`)}
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-base font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all shrink-0"
                      >
                        {copiedText === `fix-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-base text-slate-600 font-medium">
              Still slow after all fixes? Try the <strong>Revit Model Optimization</strong> service via Autodesk, or export the model to IFC and re-import into a clean file to shed accumulated bloat.
            </p>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
