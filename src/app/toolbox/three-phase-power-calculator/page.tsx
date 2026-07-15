import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ThreePhaseClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Three-Phase Power Calculator (kW, kVA, PF, Amps)',
  description: 'Calculate three-phase electrical power: real power (kW), apparent power (kVA), reactive power (kVAR), power factor, line current, and motor current.',
  path: '/toolbox/three-phase-power-calculator',
});

export default function ThreePhasePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Three-Phase Power Calculator', path: '/toolbox/three-phase-power-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 uppercase tracking-[0.15em]">
              AC Power Systems
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Three-Phase <span className="text-purple-400">Power</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate real power (kW), apparent power (kVA), reactive power (kVAR), power factor, and line current for three-phase AC systems.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ThreePhaseClient />
        </section>
      </main>
    </>
  );
}
