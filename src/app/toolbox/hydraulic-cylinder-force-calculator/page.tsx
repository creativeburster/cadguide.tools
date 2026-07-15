import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import HydraulicCylinderClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Hydraulic Cylinder Force Calculator (Push & Pull)',
  description: 'Calculate hydraulic cylinder push and pull force from bore diameter, rod diameter, and pressure. Supports metric and imperial units.',
  path: '/toolbox/hydraulic-cylinder-force-calculator',
});

export default function HydraulicCylinderPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Hydraulic Cylinder Force Calculator', path: '/toolbox/hydraulic-cylinder-force-calculator' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Fluid Power Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Hydraulic Cylinder <span className="text-orange-400">Force</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate push and pull force from bore diameter, rod diameter, and hydraulic pressure. Includes effective area and retraction force reduction.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <HydraulicCylinderClient />
        </section>
      </main>
    </>
  );
}
