import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import InjectionClampingClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Injection Molding Clamping Force & Projected Area Calculator',
  description:
    'Calculate the required clamping force (tons) for injection molding based on projected area, cavity count, and material cavity pressure.',
  path: '/toolbox/injection-clamping-force-calculator',
});

export default function InjectionClampingPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Injection Clamping Force Calculator', path: '/toolbox/injection-clamping-force-calculator' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Mold Design Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Injection Molding <span className="text-blue-400">Clamping Force</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate required clamping force (tons) from projected area, cavity count, and material cavity pressure. Includes recommended pressures for PP, PE, ABS, PC, and nylon.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <InjectionClampingClient />
        </section>
      </main>
    </>
  );
}
