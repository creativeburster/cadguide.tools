import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ValveCvClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Valve Cv Flow Coefficient Calculator',
  description: 'Calculate valve flow coefficient (Cv) for liquids and gases. Determine required Cv from flow rate, pressure drop, and specific gravity per ISA-75.01.',
  path: '/toolbox/valve-cv-calculator',
});

export default function ValveCvPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Valve Cv Calculator', path: '/toolbox/valve-cv-calculator' },
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
              ISA-75.01 Flow Sizing
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Valve <span className="text-teal-400">Cv</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate valve flow coefficient (Cv) for liquids and gases. Determine required Cv from flow rate, pressure drop, and specific gravity per ISA-75.01 standard.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ValveCvClient />
        </section>
      </main>
    </>
  );
}
