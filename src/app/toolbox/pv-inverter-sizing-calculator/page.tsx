import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import PVInverterSizingClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Solar PV Inverter Sizing & Cold-Temp String Voc Calculator',
  description:
    'Calculate PV array DC rating, DC-to-AC inverter loading ratio (ILR), cold-temperature maximum open-circuit string voltage, and annual yield.',
  path: '/toolbox/pv-inverter-sizing-calculator',
});

export default function PVInverterSizingPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'PV Inverter Sizing Calculator', path: '/toolbox/pv-inverter-sizing-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 uppercase tracking-[0.15em]">
              Solar Array &amp; Inverter Sizing
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Solar PV Inverter <span className="text-amber-400">Sizing Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Compute DC array nameplate kWp, DC/AC loading ratio (ILR), cold-weather maximum open-circuit string voltage Voc, and expected annual energy generation.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <PVInverterSizingClient />
          <ToolboxEngineeringGuide slug="pv-inverter-sizing-calculator" />
        </section>
      </main>
    </>
  );
}
