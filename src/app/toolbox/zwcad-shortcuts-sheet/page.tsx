import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ZWCADShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'ZWCAD Keyboard Shortcuts & Command Aliases Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of ZWCAD keyboard shortcuts, function keys, and command aliases. Print as PDF or copy commands for your drafting workflow.',
  path: '/toolbox/zwcad-shortcuts-sheet',
});

export default function ZWCADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ZWCAD Shortcuts', path: '/toolbox/zwcad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — compact, red accent */}
        <section className="bg-slate-900 text-white py-14 print:hidden">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-5 uppercase tracking-[0.15em]">
              ZWCAD 2D Drafting Reference
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              ZWCAD <span className="text-red-400">Hotkeys & PGP Aliases</span> Reference
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              ZWCAD shares the same PGP alias format as AutoCAD — if you know one, you know the other.
              Search every shortcut, function key, and command alias here.
            </p>
          </div>
        </section>

        {/* Migration callout — unique to ZWCAD */}
        <section className="bg-red-50 border-y border-red-100 py-6 print:hidden">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
              🔄
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-sm font-black text-red-900 uppercase tracking-wider">Migrating from AutoCAD?</h2>
              <p className="text-sm text-red-700/80 font-medium mt-1">
                ZWCAD reads <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">acad.pgp</code> files directly.
                Import your existing aliases via Customize User Interface with zero retraining needed.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <ZWCADShortcutsClient />
        </section>
      </main>
    </>
  );
}
