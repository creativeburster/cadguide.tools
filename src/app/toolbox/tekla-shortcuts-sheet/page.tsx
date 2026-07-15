import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import TeklaShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Tekla Structures Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Tekla Structures keyboard shortcuts for viewing, selecting, snapping, rendering, and drawing commands. Print as PDF.',
  path: '/toolbox/tekla-shortcuts-sheet',
});

export default function TeklaShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Tekla Structures Shortcuts', path: '/toolbox/tekla-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — dark, orange accent */}
        <section className="bg-slate-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-5 uppercase tracking-[0.15em]">
                BIM Steel & Concrete
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Tekla Structures <span className="text-orange-400">Keyboard Shortcuts</span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                Navigate large steel models faster. Every Tekla hotkey for rendering, selection, viewing,
                and drawing management — searchable, printable, and organized by workflow.
              </p>
            </div>
          </div>
        </section>

        {/* Rendering modes quick reference — unique to Tekla */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Rendering Mode Shortcuts</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'Ctrl+1', label: 'Wireframe', color: 'bg-slate-100 text-slate-700' },
                { key: 'Ctrl+2', label: 'Shaded Wireframe', color: 'bg-blue-50 text-blue-700' },
                { key: 'Ctrl+3', label: 'Grayscale', color: 'bg-slate-200 text-slate-700' },
                { key: 'Ctrl+4', label: 'Rendered', color: 'bg-orange-50 text-orange-700' },
                { key: 'Ctrl+5', label: 'Only Selected', color: 'bg-red-50 text-red-700' },
              ].map((mode) => (
                <div key={mode.key} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 ${mode.color}`}>
                  <kbd className="font-mono font-black text-xs select-all">{mode.key}</kbd>
                  <span className="text-sm font-bold">{mode.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <TeklaShortcutsClient />
        </section>
      </main>
    </>
  );
}
