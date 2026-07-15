import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import HatchScaleClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Hatch Pattern Scale Optimizer | CADGuide.tools',
  description:
    'Optimize AutoCAD and GstarCAD hatch density to prevent solid hatch conversion, MAXHATCH limit crashes, and viewport freezes.',
  path: '/toolbox/cad-hatch-scale-optimizer',
});

export default function HatchScalePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Hatch Scale Optimizer', path: '/toolbox/cad-hatch-scale-optimizer' },
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
              CAD Performance & Design Tool
            </div>
            <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
              CAD Hatch Pattern <span className="text-blue-400">Scale Optimizer</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Prevent CAD viewport freezes and drawing size bloat. Calculate the mathematically optimal HATCH scale factors for metric/imperial viewports.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <HatchScaleClient />
        </section>
      </main>
    </>
  );
}
