import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AutoLispReferenceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoLISP Function Quick Reference for AutoCAD | CADGuide.tools',
  description: 'Complete AutoLISP function reference: math, geometry, entity access, selection sets, list manipulation, and command execution for AutoCAD scripting.',
  path: '/toolbox/autolisp-function-reference',
});

export default function AutoLispReferencePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'AutoLISP Reference', path: '/toolbox/autolisp-function-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — code editor theme, green accent */}
        <section className="bg-slate-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-green-500/10 text-green-400 border border-green-500/20 mb-5 uppercase tracking-[0.15em]">
                  AutoCAD Scripting
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  AutoLISP <span className="text-green-400">Function</span><br />Quick Reference
                </h1>
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  50+ AutoLISP functions for AutoCAD automation — math, geometry, entity access,
                  selection sets, list operations, and command execution. Search by function name or category.
                </p>
              </div>
              <div className="hidden md:block bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-sm min-w-[280px]">
                <div className="text-xs text-slate-500 mb-2">;; Example</div>
                <div className="text-green-400">(defun c:drawcircle ()</div>
                <div className="text-slate-300 ml-4">(setq</div>
                <div className="text-slate-300 ml-4">  pt (getpoint "\nPick center: ")</div>
                <div className="text-slate-300 ml-4">  rad (getdist pt "\nRadius: "))</div>
                <div className="text-green-400 ml-4">(command "CIRCLE" pt rad)</div>
                <div className="text-green-400">)</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AutoLispReferenceClient />
        </section>
      </main>
    </>
  );
}
