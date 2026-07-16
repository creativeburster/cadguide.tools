import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import WaterPipeSizingCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: "Water Pipe Sizing Calculator",
  description: "Calculate minimum pipe diameter from flow rate and maximum velocity.",
  path: '/toolbox/water-pipe-sizing-calculator',
});

export default function WaterPipeSizingCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Water Pipe Sizing Calculator", path: '/toolbox/water-pipe-sizing-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-6 uppercase tracking-[0.15em]">
              Plumbing
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Water Pipe Sizing <span className="text-teal-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate minimum pipe diameter from flow rate and maximum velocity.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <WaterPipeSizingCalculatorClient />
        </section>
      </main>
    </>
  );
}
