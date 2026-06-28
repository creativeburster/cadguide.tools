import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ToolboxClient from './toolbox-client';
import { getAllMarkdownGuides } from '@/lib/guides-markdown';
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
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

        {/* Guides cross-link section */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Troubleshooting & Performance Guides</h2>
              <p className="text-xs text-slate-500 font-medium">Step-by-step solutions for crashes, slow performance, file corruption, and more.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getAllMarkdownGuides()
              .filter(g => g.category === 'performance' || g.category === 'troubleshooting')
              .sort((a, b) => a.title.localeCompare(b.title))
              .slice(0, 4)
              .map(g => (
                <Link
                  key={g.slug}
                  href={`/guides/articles/${g.slug}`}
                  className="block p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{g.category}</p>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-3">{g.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>{g.readTime}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
