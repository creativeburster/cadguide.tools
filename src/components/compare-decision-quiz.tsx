'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/lib/data';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, HelpCircle, ShieldCheck } from 'lucide-react';
import { ToolLogo } from '@/components/tool-logo';

interface CompareDecisionQuizProps {
  toolA: Tool;
  toolB: Tool;
}

export function CompareDecisionQuiz({ toolA, toolB }: CompareDecisionQuizProps) {
  // Selected answers: 0, 1, or null
  const [q1, setQ1] = useState<'heavy' | 'agile' | 'standard' | null>(null);
  const [q2, setQ2] = useState<'enterprise' | 'value' | 'student' | null>(null);
  const [q3, setQ3] = useState<'windows' | 'mac' | 'browser' | null>(null);

  // Compute recommendation based on selections
  const result = (() => {
    if (!q1 && !q2 && !q3) return null;

    let scoreA = 0;
    let scoreB = 0;
    const reasons: string[] = [];

    // Analyze tool attributes
    const aIsCloud = toolA.platforms?.includes('Web') || toolA.slug.includes('fusion') || toolA.slug.includes('onshape');
    const bIsCloud = toolB.platforms?.includes('Web') || toolB.slug.includes('fusion') || toolB.slug.includes('onshape');

    const aHasMac = toolA.platforms?.includes('Mac');
    const bHasMac = toolB.platforms?.includes('Mac');

    const aCheaper = toolA.starting_price < toolB.starting_price;

    // Q1: Project Scale
    if (q1 === 'heavy') {
      if (toolA.score >= toolB.score) {
        scoreA += 2;
        reasons.push(`Superior large-assembly performance and comprehensive fabrication drawings`);
      } else {
        scoreB += 2;
        reasons.push(`Robust parametric constraint solver suited for deep industrial machinery`);
      }
    } else if (q1 === 'agile') {
      if (aIsCloud && !bIsCloud) {
        scoreA += 3;
        reasons.push(`Native cloud collaboration, integrated CAM, and zero-install browser sharing`);
      } else if (bIsCloud && !aIsCloud) {
        scoreB += 3;
        reasons.push(`Cloud-first workspace for rapid prototyping and agile team iteration`);
      } else {
        scoreA += 1;
        scoreB += 1;
        reasons.push(`Flexible modeling pipeline adapted for fast design iterations`);
      }
    }

    // Q2: Budget & Licensing
    if (q2 === 'value' || q2 === 'student') {
      if (aCheaper) {
        scoreA += 2;
        reasons.push(`Significantly lower entry cost ($${toolA.starting_price} vs $${toolB.starting_price})`);
      } else {
        scoreB += 2;
        reasons.push(`More accessible pricing tier for agile teams and independent creators`);
      }
    } else if (q2 === 'enterprise') {
      if (toolA.score >= toolB.score) scoreA += 1;
      else scoreB += 1;
      reasons.push(`Broad vendor ecosystem, extensive certified training, and deep supply-chain interoperability`);
    }

    // Q3: OS Platform
    if (q3 === 'mac' || q3 === 'browser') {
      if (aHasMac && !bHasMac) {
        scoreA += 4;
        reasons.push(`Official native macOS architecture support`);
      } else if (bHasMac && !aHasMac) {
        scoreB += 4;
        reasons.push(`Official native macOS architecture support`);
      }
    }

    const winner = scoreA >= scoreB ? toolA : toolB;
    const runnerUp = scoreA >= scoreB ? toolB : toolA;

    return {
      winner,
      runnerUp,
      reasons: reasons.slice(0, 2),
    };
  })();

  const handleReset = () => {
    setQ1(null);
    setQ2(null);
    setQ3(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-600 border border-blue-100 mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 30-Second Fit Selector
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Still Undecided Between {toolA.name} and {toolB.name}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Select your project parameters to get an objective recommendation based on your constraints.
          </p>
        </div>

        {(q1 || q2 || q3) && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Question 1 */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[10px]">1</span>
            Primary Project Scale
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: 'heavy', label: 'Heavy Assemblies & Machinery', sub: 'Complex industrial parts' },
              { id: 'agile', label: 'Agile Prototyping & Cloud', sub: 'Fast iterations & 3D prints' },
              { id: 'standard', label: 'General Drafting & Modeling', sub: 'Standard technical drawings' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setQ1(opt.id as any)}
                className={`text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  q1 === opt.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[10px] font-medium mt-0.5 ${q1 === opt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[10px]">2</span>
            Budget & Licensing
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: 'enterprise', label: 'Commercial Enterprise Tier', sub: 'Dedicated support & updates' },
              { id: 'value', label: 'Cost-Conscious / Fixed Budget', sub: 'Max value per seat' },
              { id: 'student', label: 'Startup / Freelance / Student', sub: 'Lowest initial cash outflow' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setQ2(opt.id as any)}
                className={`text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  q2 === opt.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[10px] font-medium mt-0.5 ${q2 === opt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[10px]">3</span>
            Target Hardware & OS
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: 'windows', label: 'Windows Workstation (GPU)', sub: 'Standard dedicated CAD desktop' },
              { id: 'mac', label: 'Apple Silicon Mac (macOS)', sub: 'MacBook Pro / Mac Studio' },
              { id: 'browser', label: 'Browser / Lightweight / Mixed', sub: 'Cross-platform flexibility' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setQ3(opt.id as any)}
                className={`text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  q3 === opt.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[10px] font-medium mt-0.5 ${q3 === opt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Panel */}
      {result ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 shadow-sm flex items-center justify-center p-2 shrink-0">
                <ToolLogo slug={result.winner.slug} src={result.winner.logo_url} name={result.winner.name} className="w-10 h-10 object-contain" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Best Strategic Match For You
                </div>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">
                  {result.winner.name}
                </h4>
                <div className="text-xs text-slate-600 font-medium mt-1">
                  {result.reasons.length > 0
                    ? result.reasons.join(' • ')
                    : `Aligns most closely with your specified project scale and workflow.`}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
              <Link
                href={`/tools/${result.winner.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                View Full {result.winner.name} Review
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/alternatives/${result.runnerUp.slug}`}
                className="inline-flex items-center justify-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold py-1 transition-colors"
              >
                Or check {result.runnerUp.name} Alternatives →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400 font-medium">
          💡 Click any option above to see your customized recommendation and reasoning.
        </div>
      )}
    </div>
  );
}
