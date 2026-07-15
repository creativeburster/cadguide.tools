import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import SteelSectionClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Standard Steel Section Properties Reference (IPE/HEA/UB) | CADGuide.tools',
  description: 'European (IPE, HEA, HEB) and British (UB) steel section properties: dimensions, area, weight, moment of inertia, and section modulus.',
  path: '/toolbox/steel-section-properties-reference',
});

export default function SteelSectionPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Steel Section Properties', path: '/toolbox/steel-section-properties-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — structural, slate accent */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-slate-400/10 text-slate-300 border border-slate-400/20 mb-5 uppercase tracking-[0.15em]">
                Eurocode 3 · EN 10025
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Steel Section <span className="text-slate-300">Properties</span> Reference
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                European (IPE, HEA, HEB, UPE) and British (UB, UC) hot-rolled steel sections —
                dimensions, cross-sectional area, unit weight, moment of inertia (I), and section modulus (W).
              </p>
            </div>
          </div>
        </section>

        {/* Section type guide — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-3">Section Families</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-lg">
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                <div className="font-black text-slate-800 text-base uppercase mb-1">IPE</div>
                <div className="text-slate-500 font-medium">European I-beams (parallel flanges)</div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                <div className="font-black text-slate-800 text-base uppercase mb-1">HEA / HEB</div>
                <div className="text-slate-500 font-medium">European H-sections (wide flange)</div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                <div className="font-black text-slate-800 text-base uppercase mb-1">UB / UC</div>
                <div className="text-slate-500 font-medium">British Universal Beams / Columns</div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                <div className="font-black text-slate-800 text-base uppercase mb-1">UPE / PFC</div>
                <div className="text-slate-500 font-medium">European / British channels</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <SteelSectionClient />
        </section>
      </main>
    </>
  );
}
