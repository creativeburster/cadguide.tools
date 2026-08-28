'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  UploadCloud, 
  ShieldAlert, 
  Star, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  HelpCircle, 
  Sliders, 
  FileCheck2, 
  Lock, 
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  FileCode,
  Layers,
  Printer
} from 'lucide-react';
import { ConversionPair } from '@/lib/converter-data';

interface ConverterDetailClientProps {
  pair: ConversionPair;
}

export function ConverterDetailClient({ pair }: ConverterDetailClientProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [dragActive, setDragActive] = useState(false);
  const [mockFile, setMockFile] = useState<string | null>(null);
  const [activeParamTab, setActiveParamTab] = useState<number>(0);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setMockFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. Interactive Conversion Studio & Sponsor Dispatcher */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          {/* Left: Workbench Upload Zone */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client-Side Evaluation Studio</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {pair.title} Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure precision tolerances, inspect mathematical boundary attributes, and dispatch to verified offline & cloud conversion engines.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50/50' 
                  : mockFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'
              }`}
              onClick={() => {
                if (!mockFile) setMockFile(`model.${pair.fromFormat.ext.split(' ')[0].toLowerCase()}`);
              }}
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-blue-600">
                  {mockFile ? <FileCheck2 className="w-8 h-8 text-emerald-600" /> : <UploadCloud className="w-8 h-8" />}
                </div>

                {mockFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{mockFile} loaded</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Target format: <strong className="text-blue-600">{pair.toFormat.ext}</strong> • Ready to dispatch
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMockFile(null); }}
                      className="text-[11px] font-bold text-red-500 hover:underline pt-2 inline-block"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      Drag and drop your <span className="text-blue-600 font-extrabold">{pair.fromFormat.ext.split(' ')[0]}</span> file here
                    </p>
                    <p className="text-xs text-slate-400">
                      or click to browse local files (Supports up to 500MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Parameters Adjuster */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Recommended Discretization Tolerances</span>
                </span>
                <span className="text-[11px] text-slate-650">ISO 10303 Compliant</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {pair.keyParameters.map((kp, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs space-y-1">
                    <div className="text-[10px] font-semibold text-slate-650 truncate">{kp.label}</div>
                    <div className="text-xs font-black text-slate-900">{kp.value}</div>
                    <div className="text-[9px] text-slate-650 line-clamp-1">{kp.hint}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Security & Sponsor Dispatch Box */}
          <div className="w-full lg:w-5/12 space-y-6">
            {/* IP Risk Alert */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                    Confidential IP & Safety Warning
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    {pair.riskWarning}
                  </p>
                </div>
              </div>
            </div>

            {/* Sponsor Instant Access Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-2">
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest">
                  Featured Converter Recommendation
                </div>
                <h3 className="text-lg font-black leading-snug">
                  {pair.recommendedTools[0]?.name || 'Industrial Conversion Engine'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pair.recommendedTools[0]?.verdict || 'High-fidelity geometric parser ensuring 100% watertight output.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={pair.recommendedTools[0]?.affiliateUrl || pair.recommendedTools[0]?.officialUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>Launch Official Tool ({pair.recommendedTools[0]?.pricing})</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleCopy(pair.recommendedTools[0]?.officialUrl || '')}
                  className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copiedUrl === pair.recommendedTools[0]?.officialUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Official URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Direct Portal URL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Free Evaluation • No Card Required</span>
                <span className="text-blue-400 font-bold">★ {pair.recommendedTools[0]?.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Sponsor & Curated Converter Tools Matrix */}
      <section className="space-y-6">
        {/* DWG FastView Official Sponsor Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Sponsor • 3D Cloud Converter Engine</span>
            </div>
            <h3 className="text-xl font-black tracking-tight">
              DWG FastView Cloud 3D Engine
              <span className="ml-2.5 text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                In Development / Coming Soon
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              DWG FastView is building a high-speed, server-grade 3D CAD conversion & rendering pipeline. While the dedicated cloud 3D converter API is under active development, you can use DWG FastView for instant 2D/3D multi-format viewing and markup on Web & Mobile today, or launch our verified offline/cloud partner tools below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://en.dwgfastview.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-center"
            >
              <span>Explore DWG FastView</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Curated {pair.title} Benchmark Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluated across geometric fidelity, corporate data privacy, and batch processing capabilities.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {pair.recommendedTools.length} Active Partner Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pair.recommendedTools.map((tool, idx) => {
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 relative hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Top Badge and Score */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 font-extrabold text-[11px] rounded-xl border border-slate-200">
                      {tool.badge}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{tool.rating}</span>
                    </div>
                  </div>

                  {/* Tool Name and Pricing */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {tool.name}
                    </h3>
                    <span className="text-xs font-bold text-blue-600">
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Metric Progress Bars */}
                  <div className="space-y-2 pt-1">
                    {tool.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-650">
                          <span>{m.name}</span>
                          <span className="text-slate-800 font-bold">{m.score} / 5</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(m.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {tool.pros.map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{pro}</span>
                      </div>
                    ))}
                    {tool.cons.map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-slate-650">
                        <span className="text-red-400 font-black shrink-0">•</span>
                        <span className="leading-snug">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <a
                    href={tool.affiliateUrl || tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Use {tool.name.split(' ')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopy(tool.officialUrl)}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60"
                  >
                    {copiedUrl === tool.officialUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Deep-Dive Technical Guide & Avoidance Rules */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>Engineering Discretization Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Technical Guide: Preventing Geometry Failures during {pair.fromFormat.ext.split(' ')[0]} to {pair.toFormat.ext.split(' ')[0]} Conversion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Follow these verified CAD administrator standards to avoid broken surfaces, scaling drift, and corrupted toolpaths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pair.technicalGuide.map((guide, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 relative flex flex-col justify-start"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {guide.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Format Technical Specifications Comparison Table */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {pair.fromFormat.ext.split(' ')[0]} vs {pair.toFormat.ext.split(' ')[0]} Technical Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare kernel topology, color & appearance capabilities, and target manufacturing workflows.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-900 font-black">
                <th className="py-3.5 px-4 rounded-l-xl w-1/4">Specification</th>
                <th className="py-3.5 px-4 w-3/8 text-blue-700 bg-blue-50/40">
                  {pair.fromFormat.ext} (Source)
                </th>
                <th className="py-3.5 px-4 rounded-r-xl w-3/8 text-indigo-700 bg-indigo-50/40">
                  {pair.toFormat.ext} (Target)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">Official Name</td>
                <td className="py-3.5 px-4">{pair.fromFormat.name}</td>
                <td className="py-3.5 px-4">{pair.toFormat.name}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">Category</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{pair.fromFormat.category}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{pair.toFormat.category}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">Geometric Nature</td>
                <td className="py-3.5 px-4">{pair.fromFormat.nature}</td>
                <td className="py-3.5 px-4">{pair.toFormat.nature}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">Colors & Materials</td>
                <td className="py-3.5 px-4">{pair.fromFormat.colorMaterial}</td>
                <td className="py-3.5 px-4">{pair.toFormat.colorMaterial}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">3D PMI & Tolerancing</td>
                <td className="py-3.5 px-4">{pair.fromFormat.pmi}</td>
                <td className="py-3.5 px-4">{pair.toFormat.pmi}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/30">Primary Ecosystem</td>
                <td className="py-3.5 px-4 text-slate-650">{pair.fromFormat.ecosystem}</td>
                <td className="py-3.5 px-4 text-slate-650">{pair.toFormat.ecosystem}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Accordion */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {pair.title} FAQs
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {pair.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-sm sm:text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pr-6">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Related Conversion Pairs Matrix */}
      {pair.relatedSlugs.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Related CAD & 3D Conversion Pipelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pair.relatedSlugs.map((slug) => (
              <Link
                key={slug}
                href={`/convert/${slug}`}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                  {slug.replace(/-/g, ' ')}
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 pt-2 border-t border-slate-100">
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
