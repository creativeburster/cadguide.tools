import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import PipeSizeClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Pipe Size Chart (NPS/DN/Schedule) Reference | CADGuide.tools',
  description: 'Complete pipe size chart: NPS to DN conversion, outside diameter, wall thickness for Schedule 10-160 and XS/XXS, with weight and bore data.',
  path: '/toolbox/pipe-size-chart',
});

export default function PipeSizePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Pipe Size Chart', path: '/toolbox/pipe-size-chart' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — piping, green accent */}
        <section className="bg-gradient-to-br from-green-950 via-slate-900 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-green-500/10 text-green-400 border border-green-500/20 mb-5 uppercase tracking-[0.15em]">
                ASME B36.10 · EN 10220
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Pipe Size <span className="text-green-400">Chart</span><br />NPS · DN · Schedule
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                NPS to DN conversion, outside diameter, wall thickness for Schedule 10-160 and XS/XXS,
                with inside diameter (bore) and weight per meter. Searchable by NPS, DN, or OD.
              </p>
            </div>
          </div>
        </section>

        {/* NPS vs DN explanation — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-3">NPS vs DN — Key Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-lg">
              <div className="bg-green-50 rounded-xl border border-green-100 p-3">
                <div className="font-black text-green-800 text-base uppercase mb-1">NPS ≠ OD</div>
                <div className="text-slate-500 font-medium">NPS 1" pipe has OD 1.315", not 1.000". NPS is a nominal size, not actual OD.</div>
              </div>
              <div className="bg-green-50 rounded-xl border border-green-100 p-3">
                <div className="font-black text-green-800 text-base uppercase mb-1">DN = NPS × 25</div>
                <div className="text-slate-500 font-medium">DN (Diamètre Nominal) is metric. DN50 ≈ NPS 2". Approximate, not exact.</div>
              </div>
              <div className="bg-green-50 rounded-xl border border-green-100 p-3">
                <div className="font-black text-green-800 text-base uppercase mb-1">Schedule = Wall</div>
                <div className="text-slate-500 font-medium">Schedule number determines wall thickness. Higher = thicker. Sch 40 is most common.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <PipeSizeClient />
        </section>
      </main>
    </>
  );
}
