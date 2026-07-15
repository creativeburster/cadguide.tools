import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import Iso286ReferenceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'ISO 286 Limits & Fits Reference Table | CADGuide.tools',
  description: 'Searchable ISO 286-1/2 limits and fits reference: IT tolerance grades, shaft/hole fundamental deviations, and common fit combinations with applications.',
  path: '/toolbox/iso-286-limits-fits-reference',
});

export default function Iso286ReferencePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ISO 286 Limits & Fits', path: '/toolbox/iso-286-limits-fits-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — steel blue, engineering standard theme */}
        <section className="bg-gradient-to-r from-slate-800 to-blue-950 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-5 uppercase tracking-[0.15em]">
                ISO 286-1 & ISO 286-2
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Limits &amp; Fits <span className="text-blue-300">Reference Table</span>
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                IT tolerance grades, shaft/hole fundamental deviations, and common fit combinations
                (clearance, transition, interference) with real-world applications. Searchable and printable.
              </p>
            </div>
          </div>
        </section>

        {/* Fit type visual guide — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-3">Fit Categories at a Glance</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-2xl border border-green-100 p-4 text-center">
                <div className="text-2xl mb-1">↔️</div>
                <div className="font-black text-green-800 text-lg">Clearance</div>
                <div className="text-base text-green-600 font-medium mt-1">Hole always larger than shaft</div>
              </div>
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 text-center">
                <div className="text-2xl mb-1">⚖️</div>
                <div className="font-black text-amber-800 text-lg">Transition</div>
                <div className="text-base text-amber-600 font-medium mt-1">Overlap possible — precision location</div>
              </div>
              <div className="bg-red-50 rounded-2xl border border-red-100 p-4 text-center">
                <div className="text-2xl mb-1">🔒</div>
                <div className="font-black text-red-800 text-lg">Interference</div>
                <div className="text-base text-red-600 font-medium mt-1">Shaft always larger than hole</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <Iso286ReferenceClient />
        </section>
      </main>
    </>
  );
}
