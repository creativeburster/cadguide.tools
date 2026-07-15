import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MathcadShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'PTC Mathcad Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of PTC Mathcad Prime keyboard shortcuts for editing, math regions, plotting, and worksheet management. Print as PDF.',
  path: '/toolbox/mathcad-shortcuts-sheet',
});

export default function MathcadShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'PTC Mathcad Shortcuts', path: '/toolbox/mathcad-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — indigo accent */}
        <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5 uppercase tracking-[0.15em]">
                Engineering Calculations
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                PTC Mathcad <span className="text-indigo-400">Keyboard Shortcuts</span>
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Write equations as you would on paper. Every Mathcad Prime shortcut for math entry, Greek letters,
                symbolic evaluation, plotting, and worksheet management — searchable and printable.
              </p>
            </div>
          </div>
        </section>

        {/* Natural math notation section — unique to Mathcad */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-4">Natural Math Notation Shortcuts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: ':', result: ':=', label: 'Definition' },
                { key: 'Ctrl+G', result: 'α →', label: 'Greek Letter' },
                { key: 'Ctrl+.', result: '→', label: 'Symbolic Eval' },
                { key: 'Ctrl+L', result: 'a₁', label: 'Subscript' },
              ].map((item) => (
                <div key={item.key} className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kbd className="font-mono bg-slate-900 text-indigo-300 px-2.5 py-1 rounded-lg font-black text-base select-all">{item.key}</kbd>
                    <span className="font-mono text-lg font-black text-indigo-600">{item.result}</span>
                  </div>
                  <p className="text-base text-slate-500 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MathcadShortcutsClient />
        </section>
      </main>
    </>
  );
}
