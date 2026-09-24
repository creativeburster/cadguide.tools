import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import EmbodiedCarbonCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Embodied Carbon Calculator (A1-A3 Cradle-to-Gate) — Building Materials LCA',
  description: 'Calculate upfront embodied carbon (kgCO2e/m²) for structural concrete, steel, glass, and insulation per EN 15978 and RICS professional standards.',
  path: '/toolbox/embodied-carbon-calculator',
});

export default function EmbodiedCarbonCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Embodied Carbon Calculator', path: '/toolbox/embodied-carbon-calculator' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6 uppercase tracking-[0.15em]">
              ESG & Sustainability
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Embodied Carbon <span className="text-emerald-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Estimate upfront structural carbon intensity (kgCO₂e/m²) across concrete, rebar, steel, and glazing per EN 15978 and RICS standards.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <EmbodiedCarbonCalculatorClient />
        </section>
      </main>
    </>
  );
}
