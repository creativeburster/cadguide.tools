import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ConcreteMixClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Concrete Volume & Mix Ratio Calculator',
  description: 'Calculate concrete volume for slabs, columns, and footings. Determine cement, sand, aggregate, and water quantities for standard mix ratios.',
  path: '/toolbox/concrete-volume-mix-calculator',
});

export default function ConcreteMixPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Concrete Volume & Mix Calculator', path: '/toolbox/concrete-volume-mix-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#78716c_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-stone-500/10 text-stone-400 border border-stone-500/20 mb-6 uppercase tracking-[0.15em]">
              Construction & Civil
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Concrete Volume <span className="text-stone-400">& Mix</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate concrete volume for slabs, columns, and footings. Determine cement, sand, aggregate, and water quantities for standard mix ratios.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ConcreteMixClient />
        </section>
      </main>
    </>
  );
}
