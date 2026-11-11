import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Cable Tray Fill Ratio Calculator (NEC 392.22 Control & Signal)',
  description:
    'Calculate multiconductor control and signal cable tray cross-sectional fill ratio per NEC 392.22 (40% solid-bottom / 50% ladder or ventilated; power cables require NEC 392.22(A)(1)).',
  path: '/toolbox/cable-tray-fill-calculator',
});

export default function CalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Cable Tray Fill Ratio Calculator (NEC 392)", path: '/toolbox/cable-tray-fill-calculator' },
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
              Engineering Calculator
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Cable Tray Fill Ratio Calculator (NEC 392.22)
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate cross-sectional fill percentage for multiconductor control and signal cable trays per NEC 392.22 (40% solid-bottom / 50% ladder or ventilated).
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <CalculatorClient />
          <ToolboxEngineeringGuide slug="cable-tray-fill-calculator" />
        </section>
      </main>
    </>
  );
}
