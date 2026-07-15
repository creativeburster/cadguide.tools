import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ImperialThreadClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'UNC/UNF Imperial Thread & Tap Drill Reference | CADGuide.tools',
  description: 'Complete UNC (coarse) and UNF (fine) thread table: #0 through 1-1/2" with TPI, tap drill sizes, clearance holes, and thread engagement data.',
  path: '/toolbox/imperial-thread-reference',
});

export default function ImperialThreadPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Imperial Thread Reference', path: '/toolbox/imperial-thread-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — split layout, blue accent */}
        <section className="bg-gradient-to-r from-blue-950 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5 uppercase tracking-[0.15em]">
                  ASME B1.1 · Unified Threads
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                  UNC / UNF <span className="text-blue-400">Thread</span><br />Reference Table
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                  #0 through 1-1/2" — coarse (UNC) and fine (UNF) threads with TPI,
                  tap drill sizes, clearance holes, and thread engagement data.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h2 className="text-base font-black text-blue-400 uppercase tracking-wider mb-3">Thread Series</h2>
                <div className="space-y-3 text-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-blue-300 bg-blue-500/10 px-2 py-1 rounded-lg text-base">UNC</span>
                    <span className="text-slate-300 font-medium">Unified National Coarse — general purpose</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-blue-300 bg-blue-500/10 px-2 py-1 rounded-lg text-base">UNF</span>
                    <span className="text-slate-300 font-medium">Unified National Fine — precision & sealing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-blue-300 bg-blue-500/10 px-2 py-1 rounded-lg text-base">UNEF</span>
                    <span className="text-slate-300 font-medium">Unified National Extra Fine — thin walls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <ImperialThreadClient />
        </section>
      </main>
    </>
  );
}
