import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import PrintCostClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '3D Print Time & Filament Cost Estimator',
  description:
    'Estimate 3D printing time and filament cost from model volume, infill percentage, layer height, print speed, and material price.',
  path: '/toolbox/3d-print-cost-time-estimator',
});

export default function PrintCostPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '3D Print Cost Estimator', path: '/toolbox/3d-print-cost-time-estimator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free 3D Printing Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              3D Print <span className="text-blue-400">Cost & Time</span> Estimator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Estimate print time and filament cost for FDM 3D prints. Enter model volume, infill, layer height, and speed. Supports PLA, PETG, ABS, and TPU.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <PrintCostClient />
        </section>
      </main>
    </>
  );
}
