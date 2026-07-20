import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import FireSprinklerCoverageCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: "Fire Sprinkler Coverage & Spacing Calculator (NFPA 13)",
  description: "Calculate fire sprinkler head count, coverage area per head, and spacing compliance per NFPA 13 hazard classifications.",
  path: '/toolbox/fire-sprinkler-coverage-calculator',
});

export default function FireSprinklerCoverageCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Fire Sprinkler Coverage Calculator", path: '/toolbox/fire-sprinkler-coverage-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 uppercase tracking-[0.15em]">
              AEC / Fire Protection
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Fire Sprinkler <span className="text-orange-400">Coverage Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate sprinkler head count, coverage area, and NFPA 13 spacing compliance.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <FireSprinklerCoverageCalculatorClient />
        </section>
      </main>
    </>
  );
}
