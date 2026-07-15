import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import WireGaugeClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Wire Gauge (AWG) Calculator — Diameter, Area & Resistance',
  description: 'Convert AWG wire gauge to diameter, cross-sectional area, and resistance per length. Includes ampacity ratings for copper and aluminum conductors.',
  path: '/toolbox/wire-gauge-awg-calculator',
});

export default function WireGaugePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Wire Gauge (AWG) Calculator', path: '/toolbox/wire-gauge-awg-calculator' },
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
              AWG / SWG / BWG
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Wire Gauge <span className="text-orange-400">AWG</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Convert AWG wire gauge to diameter, cross-sectional area, resistance per meter, and ampacity. Includes copper and aluminum conductor data.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <WireGaugeClient />
        </section>
      </main>
    </>
  );
}
