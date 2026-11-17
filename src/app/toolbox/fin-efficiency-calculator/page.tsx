import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import FinEfficiencyCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Fin Efficiency, Effectiveness & Heat Transfer Calculator',
  description: 'Calculate straight rectangular heat sink fin efficiency, effectiveness ratio, fin parameter m, and single-fin heat dissipation.',
  path: '/toolbox/fin-efficiency-calculator',
});

export default function FinEfficiencyCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Fin Efficiency Calculator', path: '/toolbox/fin-efficiency-calculator' },
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
              Thermal Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Fin Efficiency <span className="text-orange-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compute straight rectangular fin efficiency eta_f, fin effectiveness ratio eps_f, and convective heat dissipation q_f.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <FinEfficiencyCalculatorClient />
          <ToolboxEngineeringGuide slug="fin-efficiency-calculator" />
        </section>
      </main>
    </>
  );
}
