import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import STEPParserClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'STEP File Header Parser & Metadata Inspector',
  description:
    'Drag and drop STEP (.stp/.step) files to extract header metadata: author, organization, CAD system, AP protocol, and units. 100% client-side.',
  path: '/toolbox/step-file-header-parser',
});

export default function STEPParserPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'STEP File Parser', path: '/toolbox/step-file-header-parser' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Client-Side CAD Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              STEP File <span className="text-blue-400">Header Parser</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Drag and drop STEP files to extract ISO 10303 header metadata: author, organization, originating CAD system, AP protocol, and file description. 100% client-side.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <STEPParserClient />
        </section>
      </main>
    </>
  );
}
