import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import DeepDrawingCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Sheet Metal Deep Drawing Calculator — Drawing Ratio, Force & Blank Holder Pressure',
  description: 'Calculate drawing ratio (β), drawing force (kN), blank holder pressure, and press tonnage for cylindrical sheet metal cup drawing per DIN 8584 standards.',
  path: '/toolbox/deep-drawing-calculator',
});

export default function DeepDrawingCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Deep Drawing Calculator', path: '/toolbox/deep-drawing-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 uppercase tracking-[0.15em]">
              Sheet Metal & Die Stamping
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Deep Drawing <span className="text-indigo-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Determine cylindrical cup drawing ratio (β), drawing force, blank holder force, and press tonnage per DIN 8584 and SME stamping standards.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <DeepDrawingCalculatorClient />
        </section>
      </main>
    </>
  );
}
