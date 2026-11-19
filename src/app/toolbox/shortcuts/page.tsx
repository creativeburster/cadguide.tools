import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CADShortcutsClient from './shortcuts-client';

export const metadata: Metadata = pageMetadata({
  title: 'ZWCAD Keyboard Shortcuts & Command Aliases Reference',
  description:
    'Searchable command alias and keyboard shortcut cheat sheet verified from official ZWSOFT ZWCAD documentation, with print layout and CSV export.',
  path: '/toolbox/shortcuts',
});

export default function CADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ZWCAD Shortcuts Cheat Sheet', path: '/toolbox/shortcuts' },
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
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Verified CAD Reference
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              ZWCAD <span className="text-blue-400">Keyboard Shortcuts</span> Matrix
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Search, filter, copy, export to CSV, or print essential ZWCAD single-key aliases, function toggles, and file management shortcuts verified against official ZWSOFT documentation.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-[1000px] mx-auto px-6 md:px-12">
          <CADShortcutsClient />
          <ToolboxEngineeringGuide slug="shortcuts" />
        </section>
      </main>
    </>
  );
}
