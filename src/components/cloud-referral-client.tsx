'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';

export interface RecommendedTool {
  name: string;
  rating: number; // e.g. 9.8
  metrics: { name: string; score: number }[]; // score out of 5
  pros: string[];
  cons: string[];
  officialUrl: string; // Clean direct URL
  verdict: string; // Short review verdict
}

export interface CloudReferralProps {
  title: string;
  subtitle: string;
  categoryLabel: string;
  painPointDesc: string;
  riskWarning: string;
  recommendedTools: RecommendedTool[];
  bestPractices: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export default function CloudReferralClient({
  painPointDesc,
  riskWarning,
  recommendedTools,
  bestPractices,
  faqs,
}: CloudReferralProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* 1. Pain Point Intro & Security Warning */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Why Do You Need Professional Evaluation? 
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-semibold">
            {painPointDesc}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3 print:border-slate-300">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Referral Evaluation Standard
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
            We perform rigorous performance benchmarks on global CAD cloud services. All recommendations are based on real-world test results. Links go directly to official channels. 
          </p>
        </div>
      </div>

      {/* 2. Enterprise Telemetry & Privacy Risk Warning */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-amber-50/50 p-6 md:p-8 backdrop-blur-md print:bg-white print:border-slate-300">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <div className="flex gap-4">
          <span className="text-2xl select-none leading-none">⚠️</span>
          <div className="space-y-2">
            <h3 className="text-base font-black text-amber-900 tracking-tight">
              Enterprise Security & Anti-Piracy Compliance Warning
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
              {riskWarning}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recommended Tools Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Recommended Cloud Tools & Services Matrix
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Evaluated by CAD experts based on rendering fidelity, speed, and privacy controls.
            </p>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 print:hidden">
            No Installation Required
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendedTools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-300 print:border-slate-300 print:shadow-none print:scale-100"
            >
              {/* Card Top */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {tool.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100">
                    ★ {tool.rating.toFixed(1)}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  {tool.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center justify-between text-xs font-bold text-slate-500"
                    >
                      <span>{m.name}</span>
                      <span className="text-blue-500 font-bold tracking-tight">
                        {'★'.repeat(m.score)}{'☆'.repeat(5 - m.score)}
                      </span>
                    </div>
))}
                </div>

                {/* Pros and Cons */}
                <div className="space-y-3 pt-3 border-t border-slate-50">
                  {/* Pros */}
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Pros
                    </h5>
                    {tool.pros.map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed font-semibold">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span>{pro}</span>
                      </div>
))}
                  </div>

                  {/* Cons */}
                  <div className="space-y-1 pt-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Cons
                    </h5>
                    {tool.cons.map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed font-semibold">
                        <span className="text-rose-500 font-black">×</span>
                        <span>{con}</span>
                      </div>
))}
                  </div>
                </div>

                {/* Verdict */}
                <div className="pt-3 border-t border-slate-50 space-y-1">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Verdict
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {tool.verdict}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-2 print:hidden">
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl font-black text-xs text-white bg-slate-900 hover:bg-blue-600 active:scale-[0.98] transition-all duration-300 shadow-md shadow-slate-900/10 hover:shadow-blue-500/20"
                >
                  Visit Official Site →
                </a>
                <button
                  onClick={() => handleCopyLink(tool.officialUrl, idx)}
                  className="w-full py-2.5 px-6 rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-black transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                  {copiedIndex === idx ? '✓ Link Copied' : '🔗 Copy Clean URL'}
                </button>
              </div>
            </div>
))}
        </div>
      </div>

      {/* 4. Best Practices Guide */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6 print:border-slate-300 print:bg-white">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Enterprise Data Conversion Best Practices Guide
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {bestPractices.map((bp, i) => (
            <div key={i} className="space-y-2">
              <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs select-none">
                0{i + 1}
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {bp.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {bp.desc}
              </p>
            </div>
))}
        </div>
      </div>

      {/* 5. Hardcore FAQ Section */}
      <div className="space-y-6">
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Technical FAQ
        </h2>
        <div className="grid gap-4 print:grid-cols-1">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:border-slate-200 print:border-slate-300 print:shadow-none"
            >
              <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                <span className="font-bold text-slate-800 text-sm">
                  Q: {faq.question}
                </span>
                <span className="ml-1.5 flex-shrink-0 text-slate-400 group-open:rotate-180 transition duration-300 text-xs">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed font-semibold border-t border-slate-50 pt-4">
                {faq.answer}
              </p>
            </details>
))}
        </div>
      </div>

      {/* 6. Newsletter Hook (Hidden during printing) */}
      <RelatedTools />
    </div>
);
}
