import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import RebarWeightClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Rebar Weight & Spacing Calculator (kg/m, lb/ft)',
  description: 'Calculate rebar weight per meter, total weight for slabs and walls, and spacing for given bar sizes. Supports metric and imperial bar sizes.',
  path: '/toolbox/rebar-weight-calculator',
});

export default function RebarWeightPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Rebar Weight Calculator', path: '/toolbox/rebar-weight-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-slate-400/10 text-slate-300 border border-slate-400/20 mb-6 uppercase tracking-[0.15em]">
              Reinforcement Design
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Rebar Weight <span className="text-slate-400">& Spacing</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate rebar unit weight, total weight for slabs and walls, and number of bars from spacing. Supports metric bar sizes (8-40mm).
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <RebarWeightClient />
        </section>
      </main>
    </>
  );
}
