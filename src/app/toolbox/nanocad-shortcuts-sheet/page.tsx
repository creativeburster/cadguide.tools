import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import NanoCADShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'nanoCAD Keyboard Shortcuts & Command Aliases Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of nanoCAD keyboard shortcuts, function keys, and command aliases. Print as PDF or copy commands for your drafting workflow.',
  path: '/toolbox/nanocad-shortcuts-sheet',
});

export default function NanoCADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'nanoCAD Shortcuts', path: '/toolbox/nanocad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — minimal, green accent */}
        <section className="bg-white border-b border-slate-100 py-12 print:hidden">
          <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-green-500/10 text-green-600 border border-green-500/20 mb-4 uppercase tracking-[0.15em]">
              Free CAD · Open Source
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-slate-900">
              nanoCAD <span className="text-green-600">Keyboard Shortcuts</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              The free, AutoCAD-compatible CAD platform. Every hotkey, function key, and command alias
              in one searchable reference — with alias file download for your workflow.
            </p>
          </div>
        </section>

        {/* Free CAD features — unique to nanoCAD */}
        <section className="bg-green-50/50 border-b border-green-100 py-6 print:hidden">
          <div className="max-w-[800px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-green-600">$0</div>
                <div className="text-base font-bold text-slate-500 uppercase tracking-wider mt-1">Free License</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-600">100%</div>
                <div className="text-base font-bold text-slate-500 uppercase tracking-wider mt-1">AutoCAD Compatible</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-600">.pgp</div>
                <div className="text-base font-bold text-slate-500 uppercase tracking-wider mt-1">Alias Import</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <NanoCADShortcutsClient />
        </section>
      </main>
    </>
  );
}
