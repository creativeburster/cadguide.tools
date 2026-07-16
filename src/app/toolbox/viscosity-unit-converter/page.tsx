import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ViscosityUnitConverterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: "Viscosity Unit Converter",
  description: "Convert between cP, Pa.s, Poise, lb/ft.s, and cSt.",
  path: '/toolbox/viscosity-unit-converter',
});

export default function ViscosityUnitConverterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: "Viscosity Unit Converter", path: '/toolbox/viscosity-unit-converter' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 uppercase tracking-[0.15em]">
              Converter
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Viscosity Unit <span className="text-purple-400">Converter</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Convert between cP, Pa.s, Poise, lb/ft.s, and cSt.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <ViscosityUnitConverterClient />
        </section>
      </main>
    </>
  );
}
