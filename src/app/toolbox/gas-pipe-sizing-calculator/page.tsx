import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import GasPipeSizingCalculatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Natural Gas Low-Pressure Pipe Sizing Calculator (Spitzglass)',
  description: 'Calculate low-pressure natural gas pipe capacity (cfh and m3/h) and Spitzglass geometric factor k from actual pipe ID, pressure drop, length, and specific gravity.',
  path: '/toolbox/gas-pipe-sizing-calculator',
});

export default function GasPipeSizingCalculatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Gas Pipe Sizing Calculator', path: '/toolbox/gas-pipe-sizing-calculator' },
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
              Fuel Gas Piping
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Natural Gas Pipe Sizing <span className="text-orange-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compute low-pressure (&lt;= 1 psig) gas flow capacity using the Spitzglass equation with standard Schedule 40 actual inside diameters.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <GasPipeSizingCalculatorClient />
          <ToolboxEngineeringGuide slug="gas-pipe-sizing-calculator" />
        </section>
      </main>
    </>
  );
}
