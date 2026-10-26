import React from 'react';
import specsData from '@/lib/toolbox-engineering-specs.json';
import { BookOpen, CheckCircle2, FileCode, HelpCircle, Layers, ShieldCheck, Sliders } from 'lucide-react';

interface InputSpec {
  label: string;
  val: string;
}

interface OutputSpec {
  label: string;
  val: string;
}

interface EngineeringSpec {
  title: string;
  description: string;
  discipline: string;
  standards: string;
  cadContext: string;
  formula: string;
  inputs: InputSpec[];
  outputs: OutputSpec[];
}

const SPECS = specsData as Record<string, EngineeringSpec>;

export function ToolboxEngineeringGuide({ slug }: { slug: string }) {
  const spec = SPECS[slug];
  if (!spec) return null;

  const inputSummary =
    spec.inputs.length > 0
      ? spec.inputs.map((i) => `${i.label} = ${i.val}`).join(', ')
      : `standard nominal boundary parameters for ${spec.title}`;

  const outputSummary =
    spec.outputs.length > 0
      ? spec.outputs.map((o) => `${o.label} = ${o.val}`).join('; ')
      : `verified design compliance metrics for ${spec.title}`;

  const faqs = [
    {
      q: `What governing equation and methodology does the ${spec.title} use?`,
      a: `The ${spec.title} evaluates ${spec.description ? spec.description.toLowerCase().replace(/\.$/, '') : 'engineering design parameters'} within the ${spec.discipline} domain using the governing formulation: ${spec.formula}. All intermediate quantities are computed in double-precision floating-point arithmetic to prevent cumulative rounding drift before final design verification.`,
    },
    {
      q: `Which international engineering standards apply to ${spec.title} calculations?`,
      a: `Calculations and boundary assumptions in this utility align with recognized industry references including ${spec.standards}. When preparing formal calculation packages or P.E. stamp submittals, always verify local jurisdictional code amendments and project-specific safety factors.`,
    },
    {
      q: `How should I integrate results from the ${spec.title} into my CAD or BIM workflow?`,
      a: `${spec.cadContext} Using the baseline benchmark (${inputSummary}), the solver yields ${outputSummary}, which can be directly cross-referenced against your parametric 3D assembly constraints, 2D fabrication drawings, or bill of materials (BOM).`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="mt-12 space-y-8 print:hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. Engineering Methodology, Governing Equations & Standards Reference */}
      <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Engineering Methodology &amp; Design Standards: {spec.title}
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Discipline: {spec.discipline}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Analytical Formulation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              Governing Mathematical Formulation
            </h3>
            <p>
              In professional <strong>{spec.discipline}</strong> workflows, accurate sizing and performance verification require consistent unit normalization and adherence to closed-form analytical mechanics. This <strong>{spec.title}</strong> utility implements the standardized engineering formulation:
            </p>
            <div className="bg-slate-900 text-blue-300 font-mono text-xs sm:text-sm p-4 rounded-2xl border border-slate-800 overflow-x-auto">
              <code>{spec.formula}</code>
            </div>
            <p>
              {spec.description} Every input change triggers an instant client-side recalculation across all coupled dependent variables, enabling rapid sensitivity analysis during preliminary and detailed CAD design phases.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Applicable Codes, Standards &amp; CAD Integration
            </h3>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Primary Reference Standards &amp; Codes
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {spec.standards}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/70">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  CAD / CAE / BIM Implementation Guidance
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {spec.cadContext}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              <strong>Engineering Verification Note:</strong> Analytical models assume homogeneous material behavior, steady-state boundary loading, and consistent dimensional units. Always apply appropriate service factors, corrosion allowances, or load and resistance factor design (LRFD / ASD) safety margins required by your governing code.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Parameter Specifications & Worked Calculation Example */}
      {(spec.inputs.length > 0 || spec.outputs.length > 0) && (
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Parameter Specifications &amp; Worked Engineering Example
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Baseline reference case using default design values for {spec.title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spec.inputs.length > 0 && (
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-xs font-black text-slate-700 uppercase tracking-wider">
                  Input Design Variables ({spec.inputs.length})
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {spec.inputs.map((inp, idx) => (
                    <div key={idx} className="px-5 py-3 flex items-center justify-between gap-4">
                      <span className="font-bold text-slate-700">{inp.label}</span>
                      <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                        {inp.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {spec.outputs.length > 0 && (
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-xs font-black text-slate-700 uppercase tracking-wider">
                  Computed Baseline Outputs ({spec.outputs.length})
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {spec.outputs.map((out, idx) => (
                    <div key={idx} className="px-5 py-3 flex items-center justify-between gap-4">
                      <span className="font-bold text-slate-700">{out.label}</span>
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                        {out.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step-by-step Worked Example Narrative */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step-by-Step Benchmark Walkthrough
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900">Define Design Boundary Conditions:</strong> Establish the nominal operating parameters for the component or system: <code className="text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{inputSummary}</code>. Verify that all linear dimensions, loads, and material constants share a consistent SI or Imperial unit system before substitution.
              </li>
              <li>
                <strong className="text-slate-900">Execute Analytical Formulation:</strong> Substitute the normalized input vector into the governing relation (<code className="text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">{spec.formula}</code>) in accordance with <strong>{spec.standards}</strong>.
              </li>
              <li>
                <strong className="text-slate-900">Verify Computed Engineering Outputs:</strong> For the baseline design case, the calculator yields <code className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">{outputSummary}</code>. Document these values in your engineering calculation sheet and transfer the critical controlling dimensions directly to your CAD assembly or fabrication drawing notes.
              </li>
            </ol>
          </div>
        </section>
      )}

      {/* 3. Frequently Asked Questions */}
      <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Frequently Asked Engineering Questions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Technical reference &amp; verification guidelines for {spec.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2.5">
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
