import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import DrillSizeClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Drill Bit Size Chart (Number, Letter & Fractional) | CADGuide.tools',
  description: 'Complete drill bit size chart: number drills (#1-#80), letter drills (A-Z), and fractional inch drills with metric conversions and tap drill applications.',
  path: '/toolbox/drill-bit-size-chart',
});

export default function DrillSizePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Drill Bit Size Chart', path: '/toolbox/drill-bit-size-chart' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — workshop, orange accent */}
        <section className="bg-gradient-to-r from-slate-900 to-orange-950/40 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-5 uppercase tracking-[0.15em]">
                  ANSI B94.11 · Metric
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  Drill Bit <span className="text-orange-400">Size Chart</span><br />Number · Letter · Fractional
                </h1>
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  120+ drill sizes from #80 (0.34mm) to 1½" (38.1mm) with exact metric conversions
                  and tap drill applications. Search by drill number, letter, or millimeter.
                </p>
              </div>
              <div className="hidden md:block bg-white/5 border border-white/10 rounded-3xl p-5 min-w-[200px]">
                <h2 className="text-xs font-black text-orange-400 uppercase tracking-wider mb-3">Drill Systems</h2>
                <div className="space-y-2 text-sm text-slate-300 font-medium">
                  <div><span className="font-black text-orange-300">#80–#1</span> Number drills</div>
                  <div><span className="font-black text-orange-300">A–Z</span> Letter drills</div>
                  <div><span className="font-black text-orange-300">1/16"–1/2"</span> Fractional</div>
                  <div><span className="font-black text-orange-300">0.5–36mm</span> Metric</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <DrillSizeClient />
        </section>
      </main>
    </>
  );
}
