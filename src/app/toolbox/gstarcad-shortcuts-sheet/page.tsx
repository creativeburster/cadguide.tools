import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import GstarCADShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'GstarCAD Keyboard Shortcuts & Command Aliases Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of GstarCAD keyboard shortcuts, function keys, and command aliases. Print as PDF or copy commands for your drafting workflow.',
  path: '/toolbox/gstarcad-shortcuts-sheet',
});

export default function GstarCADShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'GstarCAD Shortcuts', path: '/toolbox/gstarcad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — split layout, cyan accent */}
        <section className="bg-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5 uppercase tracking-[0.15em]">
                  GstarCAD Shortcuts
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  GstarCAD<br />
                  <span className="text-cyan-400">Command Aliases</span> & Hotkeys
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                  GstarCAD mirrors AutoCAD's alias system by default. Type
                  <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-lg mx-1">L</code> for LINE,
                  <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-lg mx-1">CO</code> for COPY —
                  your muscle memory transfers instantly.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h2 className="text-base font-black text-cyan-400 uppercase tracking-wider mb-4">Quick Reference</h2>
                <div className="space-y-2.5">
                  {[
                    { k: 'LA', d: 'Layer Manager' },
                    { k: 'B', d: 'Create Block' },
                    { k: 'H', d: 'Hatch Fill' },
                    { k: 'F3', d: 'Object Snap' },
                  ].map((r) => (
                    <div key={r.k} className="flex items-center gap-3">
                      <kbd className="font-mono bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg font-black text-base select-all min-w-[48px] text-center">{r.k}</kbd>
                      <span className="text-lg text-slate-300 font-medium">{r.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workspace note — unique to GstarCAD */}
        <section className="bg-cyan-50 border-b border-cyan-100 py-5 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <p className="text-lg text-cyan-900 font-medium text-center">
              💡 In GstarCAD Classic workspace, menu items show underlined letters — press
              <kbd className="bg-cyan-100 px-1.5 py-0.5 rounded text-base mx-1 font-mono">Alt + underlined letter</kbd>
              to access menu commands without the mouse.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <GstarCADShortcutsClient />
        </section>
      </main>
    </>
  );
}
