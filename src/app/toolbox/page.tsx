import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ToolboxClient from './toolbox-client';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Free CAD & BIM Utilities Toolbox — Calculators, Cheat Sheets, & Diagnostics',
  description:
    'Explore a curated toolbox of interactive CAD/BIM utilities. Access local file parsers (DWG, DXF, CTB), engineering calculators, and keyboard shortcuts sheets.',
  path: '/toolbox',
});

export default function ToolboxPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
  ]);

  return (
    <>
      {/* Schema.org BreadcrumbList payload */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          {/* Glassmorphism background glowing blur ball */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Drafting & Design Toolkit
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              The Interactive <span className="text-blue-400">CAD Toolbox</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              A comprehensive library of privacy-first, client-side calculators, parsers, cheat sheets, and diagnostics — plus expert-vetted recommendations for cloud services when heavy server-side processing is required.
            </p>
          </div>
        </section>

        {/* Toolbox Main List */}
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ToolboxClient />
        </section>
      </main>
    </>
  );
}
