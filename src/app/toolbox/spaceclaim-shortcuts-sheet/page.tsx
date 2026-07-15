import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import SpaceClaimShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'SpaceClaim Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Ansys SpaceClaim keyboard shortcuts for design, editing, viewing, and selection. Print as PDF.',
  path: '/toolbox/spaceclaim-shortcuts-sheet',
});

export default function SpaceClaimShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'SpaceClaim Shortcuts', path: '/toolbox/spaceclaim-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — amber accent */}
        <section className="bg-gradient-to-r from-slate-900 to-amber-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5 uppercase tracking-[0.15em]">
              Ansys Direct Modeling
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              SpaceClaim <span className="text-amber-400">Keyboard Shortcuts</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Direct modeling at its fastest. The <strong className="text-amber-300">Pull</strong> tool does 80% of the work —
              extrude, round, offset, revolve — all from one key. Search every SpaceClaim hotkey here.
            </p>
          </div>
        </section>

        {/* Direct modeling core tools — unique to SpaceClaim */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Core Direct Modeling Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'P', name: 'Pull', desc: 'Extrude, round, offset, revolve' },
                { key: 'M', name: 'Move', desc: 'Translate faces and edges' },
                { key: 'F', name: 'Fill', desc: 'Replace, patch, close gaps' },
                { key: 'C', name: 'Combine', desc: 'Merge, subtract, intersect' },
              ].map((tool) => (
                <div key={tool.key} className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kbd className="font-mono bg-slate-900 text-amber-400 px-3 py-1.5 rounded-lg font-black text-sm select-all">{tool.key}</kbd>
                    <span className="font-black text-slate-800">{tool.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <SpaceClaimShortcutsClient />
        </section>
      </main>
    </>
  );
}
