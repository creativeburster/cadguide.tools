import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import OnshapeShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Onshape Keyboard Shortcuts Cheat Sheet | CADGuide.tools',
  description: 'Complete searchable list of Onshape keyboard shortcuts for Part Studio, assembly, sketch, drawing, and 3D view. Print as PDF.',
  path: '/toolbox/onshape-shortcuts-sheet',
});

export default function OnshapeShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Onshape Shortcuts', path: '/toolbox/onshape-shortcuts-sheet' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — cloud-themed, sky blue gradient */}
        <section className="bg-gradient-to-b from-sky-500 via-sky-600 to-slate-900 text-white py-20 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-white/10 text-sky-200 border border-white/20 mb-6 uppercase tracking-[0.15em]">
              ☁️ Cloud-Native CAD
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight">
              Onshape <span className="text-sky-200">Keyboard Shortcuts</span><br />Complete Reference
            </h1>
            <p className="text-base md:text-lg text-sky-100/80 leading-relaxed max-w-2xl mx-auto font-medium">
              Over 70 browser-based shortcuts for Part Studio, Assembly, Sketch, Drawing, and 3D view.
              Press <kbd className="bg-white/15 px-2 py-0.5 rounded font-mono text-sm">Shift+?</kbd> anywhere in Onshape to see them all in-app.
            </p>
          </div>
        </section>

        {/* Browser shortcuts intro — unique to Onshape */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-sky-600 mb-1">L</div>
                <div className="text-sm font-bold text-slate-700">Sketch: Line</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Single-key tools in sketch mode</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-sky-600 mb-1">Shift+E</div>
                <div className="text-sm font-bold text-slate-700">Part Studio: Extrude</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Shift+letter for features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-sky-600 mb-1">Shift+7</div>
                <div className="text-sm font-bold text-slate-700">View: Isometric</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Shift+number for views</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <OnshapeShortcutsClient />
        </section>
      </main>
    </>
  );
}
