import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import WeldStrengthClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Fillet Weld Strength & Load Capacity Calculator | CADGuide.tools',
  description:
    'Calculate structural fillet weld throat thickness, effective length, and allowable shear/tension load limits under AISC and GB 50017 steel design standards.',
  path: '/toolbox/weld-strength-calculator',
});

export default function WeldStrengthPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Fillet Weld Strength Calculator', path: '/toolbox/weld-strength-calculator' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Structural Steel Design Tool
            </div>
            <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
              Fillet Weld Strength & <span className="text-blue-400">Load Capacity</span> Calculator
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Ensure structural joint integrity. Instantly verify effective throat limits, weld sizes, and maximum joint capacity under AISC specifications.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <WeldStrengthClient />
        </section>
      </main>
    </>
  );
}
