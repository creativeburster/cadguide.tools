import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import WeldingSymbolClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AWS Welding Symbol Reference Guide (A2.4) | CADGuide.tools',
  description: 'Complete AWS A2.4 welding symbol reference: groove, fillet, plug, surfacing welds with supplementary symbols and tail notes.',
  path: '/toolbox/aws-welding-symbol-reference',
});

export default function WeldingSymbolPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'AWS Welding Symbols', path: '/toolbox/aws-welding-symbol-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — industrial dark, amber accent */}
        <section className="bg-slate-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5 uppercase tracking-[0.15em]">
              AWS A2.4 Standard
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Welding Symbol <span className="text-amber-400">Reference Guide</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Complete AWS A2.4 welding symbol reference — groove types, fillet, plug, slot, surfacing,
              and supplementary symbols. Searchable by weld type or symbol name.
            </p>
          </div>
        </section>

        {/* Symbol anatomy guide — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-8 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Welding Symbol Anatomy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
                <div className="font-black text-amber-800 text-xs uppercase mb-1">Arrow Side</div>
                <div className="text-slate-600 font-medium">Symbol below reference line</div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
                <div className="font-black text-amber-800 text-xs uppercase mb-1">Other Side</div>
                <div className="text-slate-600 font-medium">Symbol above reference line</div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
                <div className="font-black text-amber-800 text-xs uppercase mb-1">Both Sides</div>
                <div className="text-slate-600 font-medium">Symbols on both sides</div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
                <div className="font-black text-amber-800 text-xs uppercase mb-1">Tail</div>
                <div className="text-slate-600 font-medium">Process/spec notes (e.g. GTAW)</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <WeldingSymbolClient />
        </section>
      </main>
    </>
  );
}
