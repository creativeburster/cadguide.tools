'use client';

import { useState } from 'react';
import { Stethoscope, Info, ExternalLink, CheckCircle2 } from 'lucide-react';

export interface WizardCause {
  cause: string;
  fix: string[];
  sourceUrl?: string;
  sourceTitle?: string;
}
export interface WizardNode {
  id: string;
  symptom: string;
  causes: WizardCause[];
}
export interface WizardData {
  wizardId: string;
  title: string;
  entryQuestion: string;
  sourcesPolicy?: string;
  nodes: WizardNode[];
}

/** Interactive decision-tree diagnostic wizard. All content is passed in (sourced data). */
export function DecisionWizardClient({ data }: { data: WizardData }) {
  const [selected, setSelected] = useState<string | null>(null);
  const node = data.nodes.find((n) => n.id === selected) ?? null;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{data.entryQuestion}</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium mb-6">Pick the scenario that matches your situation — the wizard lists verified causes and fixes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.nodes.map((n, i) => (
            <button
              key={n.id}
              onClick={() => setSelected(n.id === selected ? null : n.id)}
              className={`text-left p-5 rounded-2xl border transition-all ${
                selected === n.id
                  ? 'bg-rose-50/60 border-rose-200 shadow-sm'
                  : 'bg-slate-50 border-slate-100 hover:border-rose-200 hover:bg-white'
              }`}
            >
              <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Scenario {i + 1}</div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{n.symptom}</p>
            </button>
          ))}
        </div>
      </div>

      {node && (
        <div className="space-y-6">
          {node.causes.map((c, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <div className="flex items-start gap-3 mb-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  Likely cause {i + 1}: {c.cause}
                </h3>
              </div>
              <ol className="space-y-3 mb-5">
                {c.fix.map((step, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-black flex items-center justify-center">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              {c.sourceUrl && c.sourceUrl !== 'not obtained' && (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:underline uppercase tracking-wider"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Source: {c.sourceTitle ?? 'Official KB'}
                </a>
              )}
              {(!c.sourceUrl || c.sourceUrl === 'not obtained') && (
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Source: not obtained — verify with vendor support</span>
              )}
            </div>
          ))}
        </div>
      )}

      {data.sourcesPolicy && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>{data.sourcesPolicy}</p>
          </div>
        </div>
      )}
    </div>
  );
}
