import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ReynoldsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Reynolds Number Calculator (Pipe Flow)',
  description: 'Calculate Reynolds number for pipe flow to determine laminar, transitional, or turbulent flow regime. Supports water, air, oil, and custom fluids.',
  path: '/toolbox/reynolds-number-calculator',
});

export default function ReynoldsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Reynolds Number Calculator', path: '/toolbox/reynolds-number-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-6 uppercase tracking-[0.15em]">
              Fluid Mechanics
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Reynolds Number <span className="text-sky-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate Reynolds number (Re) for pipe flow to determine laminar, transitional, or turbulent regime. Includes friction factor and flow regime classification.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ReynoldsClient />
        </section>
      </main>
    </>
  );
}
