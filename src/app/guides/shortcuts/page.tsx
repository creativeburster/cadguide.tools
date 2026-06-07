import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import CADShortcutsClient from './shortcuts-client';

export const metadata: Metadata = pageMetadata({
  title: 'Ultimate CAD Shortcuts & Cheat Sheet',
  description:
    'Search and compare essential drafting command shortcuts across AutoCAD, GstarCAD, ZWCAD, and DWG FastView. Print the optimized cheat sheet instantly.',
  path: '/guides/shortcuts',
});

export default function CADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: 'CAD Shortcuts Cheat Sheet', path: '/guides/shortcuts' },
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
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Cheat Sheet
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Cross-Platform <span className="text-blue-400">CAD Shortcuts</span> Matrix
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Compare drafting keyboard shortcuts across AutoCAD, GstarCAD, ZWCAD, and DWG FastView side-by-side. Find commands, copy aliases, or print the layout as your office desk cheat sheet.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1000px] mx-auto px-6 md:px-12">
          <CADShortcutsClient />
        </section>
      </main>
    </>
  );
}
