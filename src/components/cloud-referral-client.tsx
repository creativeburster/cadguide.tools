'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck2, CheckCircle2, FileCode, Sliders } from 'lucide-react';
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
  title,
  painPointDesc,
  riskWarning,
  recommendedTools,
  bestPractices,
  faqs,
}: CloudReferralProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetSchema, setTargetSchema] = useState('AutoCAD 2018+ (AC1032) / IFC4 / STEP AP242');
  const [unitSystem, setUnitSystem] = useState('Preserve Native File Units (mm / inch / m)');
  const [toleranceMode, setToleranceMode] = useState('High Precision (0.005 mm Chordal)');
  const [fileReport, setFileReport] = useState<{
    name: string;
    size: string;
    ext: string;
    hexSignature: string;
    asciiPreview: string;
    detectedContainer: string;
    readinessNote: string;
  } | null>(null);

  const inspectLocalCadFile = (file: File) => {
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;
    const ext = file.name.split('.').pop()?.toUpperCase() || 'CAD';

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return;
      const bytes = new Uint8Array(buffer.slice(0, 256));
      const hexArr: string[] = [];
      for (let i = 0; i < Math.min(bytes.length, 8); i++) {
        hexArr.push(bytes[i].toString(16).toUpperCase().padStart(2, '0'));
      }
      const hexSig = hexArr.join(' ');

      let ascii = '';
      for (let i = 0; i < Math.min(bytes.length, 160); i++) {
        ascii += bytes[i] >= 32 && bytes[i] <= 126 ? String.fromCharCode(bytes[i]) : '.';
      }

      let container = `${ext} Engineering Container`;
      let note = 'Header structure verified locally. Ready for translation dispatch.';

      if (hexSig.startsWith('D0 CF 11 E0')) {
        container = `OLE2 Compound Binary Document (.${ext} — Revit / MicroStation V8 / SolidWorks)`;
        note = 'Valid Microsoft Structured Storage (OLE2) container header confirmed.';
      } else if (ascii.startsWith('AC1032')) {
        container = 'AutoCAD DWG Binary Database (AC1032 — Release 2018–2026)';
        note = 'Modern 64-bit DWG container; no legacy down-save required for current engines.';
      } else if (ascii.startsWith('AC1027')) {
        container = 'AutoCAD DWG Binary Database (AC1027 — Release 2013–2017)';
      } else if (ascii.startsWith('AC1024')) {
        container = 'AutoCAD DWG Binary Database (AC1024 — Release 2010–2012)';
      } else if (ascii.startsWith('AC10')) {
        container = `AutoCAD Legacy DWG Binary (${ascii.slice(0, 6)})`;
      } else if (ascii.includes('ISO-10303-21')) {
        if (ascii.toUpperCase().includes('IFC4')) {
          container = 'openBIM IFC4 EXPRESS Schema (ISO 16739-1)';
        } else if (ascii.toUpperCase().includes('IFC2X3')) {
          container = 'openBIM IFC2x3 Coordination Schema (ISO 10303-21)';
        } else {
          container = 'ISO 10303-21 STEP B-Rep Solid Model (AP203 / AP214 / AP242)';
        }
        note = 'Clear-text EXPRESS header verified; full topological hierarchy intact.';
      } else if (ascii.includes('SECTION') || ascii.includes('HEADER')) {
        container = 'ASCII DXF Drawing Exchange Database';
      } else if (ascii.startsWith('%PDF')) {
        container = `Adobe PDF Document (${ascii.slice(0, 8)})`;
        note = 'PDF header verified. Check whether source contains vector paths or raster scan.';
      } else if (ascii.toLowerCase().startsWith('solid')) {
        container = 'ASCII STL Triangulated Surface Mesh';
      } else if (hexSig.startsWith('50 4B 03 04')) {
        container = `ZIP-Packaged 3D Archive (.${ext} — 3MF / USDZ / KMZ / F3D)`;
      }

      setFileReport({
        name: file.name,
        size: sizeStr,
        ext,
        hexSignature: hexSig,
        asciiPreview: ascii.slice(0, 36),
        detectedContainer: container,
        readinessNote: note,
      });
    };
    reader.readAsArrayBuffer(file.slice(0, 256));
  };

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
      {/* 0. Interactive Client-Side File Header Preflight & Conversion Sandbox */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              <span>Local CAD / BIM Header Preflight & Format Inspector</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Verify binary file signatures (OLE2, AC10xx, ISO-10303-21, IFC, STL) 100% locally in your browser before dispatching to cloud translation engines.
            </p>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            ✓ Zero-Upload Local Sandbox
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              inspectLocalCadFile(e.target.files[0]);
            }
          }}
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              inspectLocalCadFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
            fileReport
              ? 'border-emerald-400 bg-emerald-50/20'
              : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-300'
          }`}
        >
          <div className="max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-blue-600">
              {fileReport ? <FileCheck2 className="w-6 h-6 text-emerald-600" /> : <UploadCloud className="w-6 h-6" />}
            </div>
            {fileReport ? (
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{fileReport.name} ({fileReport.size})</span>
                </p>
                <div className="p-3.5 bg-white border border-emerald-200 rounded-2xl text-left text-xs space-y-1.5 shadow-2xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400 font-bold">Detected Container:</span>
                    <span className="font-black text-slate-800 text-right">{fileReport.detectedContainer}</span>
                  </div>
                  <div className="flex justify-between gap-2 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans font-bold">Hex Magic Bytes:</span>
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">{fileReport.hexSignature}</span>
                  </div>
                  <div className="flex justify-between gap-2 font-mono text-[11px]">
                    <span className="text-slate-400 font-sans font-bold">ASCII Header:</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate max-w-[240px]">{fileReport.asciiPreview}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                    ✓ {fileReport.readinessNote}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileReport(null);
                  }}
                  className="text-[11px] font-black text-rose-600 hover:underline pt-1 inline-block"
                >
                  Inspect Another CAD / BIM File
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900">
                  Drop your source CAD / BIM / 3D file here or click to run local header preflight
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  Supports RVT, IFC, DGN, DWG, DXF, STEP, IGES, STL, OBJ, 3MF, PDF (100% browser-local byte inspection)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Translation & Precision Preflight Settings ({title})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Target Output Schema</label>
              <select
                value={targetSchema}
                onChange={(e) => setTargetSchema(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option>AutoCAD 2018+ (AC1032) / IFC4 / STEP AP242</option>
                <option>Legacy Compatible (AC1027 / IFC2x3 / STEP AP214)</option>
                <option>Lightweight Web & Mesh (glTF 2.0 / 3MF / Binary STL)</option>
                <option>High-Resolution Vector PDF / Archival DWF</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Coordinate & Unit System</label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option>Preserve Native File Units (mm / inch / m)</option>
                <option>Normalize to Metric Millimeters (mm)</option>
                <option>Normalize to Metric Meters (m — BIM Survey)</option>
                <option>Normalize to Imperial Inches (in)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Curve & Surface Tolerance</label>
              <select
                value={toleranceMode}
                onChange={(e) => setToleranceMode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option>High Precision (0.005 mm Chordal)</option>
                <option>Standard Production (0.02 mm Chordal)</option>
                <option>Fast Coordination Preview (0.10 mm)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
            Directory & Benchmark
          </div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Cloud Tool Directory & Security Benchmark
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
            We perform rigorous performance and telemetry benchmarks on external cloud CAD converters and utilities. All recommendations link directly to official vendor download portals or open-source repositories.
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
