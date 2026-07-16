import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import RoofPitchCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: "Roof Pitch & Area Calculator",
  description: "Calculate roof pitch angle, slope factor, and total roof area from plan dimensions.",
  path: '/toolbox/roof-pitch-calculator',
});

export default function RoofPitchCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Roof Pitch & Area Calculator", path: '/toolbox/roof-pitch-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-6 uppercase tracking-[0.15em]">
              BIM
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Roof Pitch & Area <span className="text-red-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate roof pitch angle, slope factor, and total roof area from plan dimensions.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <RoofPitchCalculatorClient />
        </section>
      </main>
    </>
  );
}
