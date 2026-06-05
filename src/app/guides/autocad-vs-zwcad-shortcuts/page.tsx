import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AutocadVsZwcadShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD vs. ZWCAD Command Shortcut Diff Guide | CADGuide.tools',
  description: 'Compare command alias mappings between AutoCAD and ZWCAD. Verify smart command exceptions for seamless transitions.',
  path: '/guides/autocad-vs-zwcad-shortcuts',
});

export default function AutocadVsZwcadShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: 'AutoCAD vs ZWCAD Diff Matrix', path: '/guides/autocad-vs-zwcad-shortcuts' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Platforms Command Comparison Matrix
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD <span className="text-blue-400">vs. ZWCAD</span> Command alias difference table
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              ZWCAD Migration Compatible Alias Quick Reference Manual. Compare AutoCAD vs. Common drawing and collaborative management command aliases of ZWCAD, Solve the problem of switching habits. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AutocadVsZwcadShortcutsClient />
        </section>
      </main>
    </>
);
}
