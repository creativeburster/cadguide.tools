import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ThreadReferenceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'ISO Metric Thread & Tap Drill Size Reference Table | CADGuide.tools',
  description: 'Complete ISO metric thread table (M1.6–M48) with coarse/fine pitch, tap drill sizes, clearance holes, and thread engagement data.',
  path: '/toolbox/iso-metric-thread-reference',
});

export default function ThreadReferencePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ISO Metric Thread Reference', path: '/toolbox/iso-metric-thread-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — industrial, orange accent */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950/30 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-5 uppercase tracking-[0.15em]">
                  ISO 261 · ISO 965
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  Metric Thread <span className="text-orange-400">& Tap Drill</span><br />Reference Table
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                  M1.6 to M48 — coarse pitch, fine pitch, tap drill Ø, clearance hole Ø,
                  and thread engagement data. Search by thread size or drill diameter.
                </p>
              </div>
              <div className="hidden md:block bg-white/5 border border-white/10 rounded-3xl p-6 min-w-[180px]">
                <h2 className="text-base font-black text-orange-400 uppercase tracking-wider mb-3">Drill Formula</h2>
                <div className="text-lg text-slate-300 font-mono leading-relaxed">
                  Tap Drill =<br />
                  Major Ø − Pitch<br />
                  <span className="text-base text-slate-400 mt-2 block">e.g. M8×1.25 → 8−1.25 = 6.8mm</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <ThreadReferenceClient />
        </section>
      </main>
    </>
  );
}
