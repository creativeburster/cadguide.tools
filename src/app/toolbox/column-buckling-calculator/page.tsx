import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ColumnBucklingClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Euler Column Buckling Load Calculator',
  description: 'Calculate critical buckling load for columns using Euler and Johnson formulas. Supports pinned, fixed, cantilever, and guided end conditions with material selection.',
  path: '/toolbox/column-buckling-calculator',
});

export default function ColumnBucklingPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Column Buckling Calculator', path: '/toolbox/column-buckling-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Structural Engineering Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Euler Column <span className="text-emerald-400">Buckling</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate critical buckling load for columns using Euler and Johnson parabolic formulas. Supports four end-condition types and automatic slenderness ratio transition.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ColumnBucklingClient />
        </section>
      </main>
    </>
  );
}
