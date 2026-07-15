import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MaxShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '3ds Max Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Autodesk 3ds Max keyboard shortcuts for viewport, selection, modeling, animation, and rendering. Print as PDF.',
  path: '/toolbox/3dsmax-shortcuts-sheet',
});

export default function MaxShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '3ds Max Shortcuts', path: '/toolbox/3dsmax-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — teal accent */}
        <section className="bg-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-5 uppercase tracking-[0.15em]">
                  Autodesk 3ds Max
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  3ds Max <span className="text-teal-400">Hotkeys</span><br />Complete Reference
                </h1>
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  Viewport navigation, editable poly sub-levels, animation keys, and rendering —
                  all 56+ hotkeys organized by workflow. Includes tips on the
                  <strong className="text-teal-300"> Shortcut Override Toggle</strong>.
                </p>
              </div>
              <div className="hidden md:block bg-white/5 border border-white/10 rounded-3xl p-6 min-w-[200px]">
                <h2 className="text-xs font-black text-teal-400 uppercase tracking-wider mb-4">Transform Tools</h2>
                <div className="space-y-3">
                  {[
                    { k: 'W', d: 'Move' },
                    { k: 'E', d: 'Rotate' },
                    { k: 'R', d: 'Scale' },
                  ].map((t) => (
                    <div key={t.k} className="flex items-center gap-3">
                      <kbd className="font-mono bg-slate-800 text-teal-300 px-3 py-1.5 rounded-lg font-black text-sm select-all min-w-[44px] text-center">{t.k}</kbd>
                      <span className="text-sm text-slate-300 font-medium">{t.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-object quick reference — unique to 3ds Max */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Editable Poly Sub-Object Levels</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { key: '1', label: 'Vertex' },
                { key: '2', label: 'Edge' },
                { key: '3', label: 'Border' },
                { key: '4', label: 'Polygon' },
                { key: '5', label: 'Element' },
                { key: '6', label: 'Object' },
              ].map((lvl) => (
                <div key={lvl.key} className="flex items-center gap-2 bg-teal-50 rounded-xl px-4 py-2 border border-teal-100">
                  <kbd className="font-mono bg-slate-900 text-teal-300 px-2 py-0.5 rounded font-black text-xs select-all">{lvl.key}</kbd>
                  <span className="text-sm font-bold text-teal-800">{lvl.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MaxShortcutsClient />
        </section>
      </main>
    </>
  );
}
