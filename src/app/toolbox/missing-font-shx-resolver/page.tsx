import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MissingFontResolverClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Missing CAD Fonts & SHX Substitute Matchbox | CADGuide.tools',
  description: 'Lookup recommended backup SHX font substitutes for missing AutoCAD/BIM fonts (e.g. tssdeng, hztxt, gbcbig). Fix garbled Chinese text and question marks.',
  path: '/toolbox/missing-font-shx-resolver',
});

export default function MissingFontResolverPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'SHX Font Resolver', path: '/toolbox/missing-font-shx-resolver' },
  ]);

  return (
    <>
      {/* Schema.org breadcrumb payload */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero Banner (hidden during printing) */}
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Native Utility
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Missing CAD fonts and <span className="text-blue-400">SHX Substitution</span> Matching box
            </h1>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Solving the issue of drawings that are full of question marks (?) and garbled text. Enter the missing font name, match the best copyright-free replacement solution and one-click configuration script. 
            </p>
          </div>
        </section>

        {/* Client Interactive Workspace */}
        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <MissingFontResolverClient />
        </section>
      </main>
    </>
);
}
