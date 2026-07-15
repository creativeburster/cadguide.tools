import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import Iso2768ReferenceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'ISO 2768 General Tolerances Reference Table | CADGuide.tools',
  description: 'ISO 2768-1/2 general tolerances for linear dimensions, angular dimensions, and geometrical tolerances (fine, medium, coarse, very coarse).',
  path: '/toolbox/iso-2768-general-tolerances-reference',
});

export default function Iso2768ReferencePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ISO 2768 General Tolerances', path: '/toolbox/iso-2768-general-tolerances-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — blueprint theme, indigo accent */}
        <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5 uppercase tracking-[0.15em]">
                ISO 2768-1 & ISO 2768-2
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                General Tolerances <span className="text-indigo-400">Reference Table</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Linear, angular, and geometrical tolerances for dimensions without individual tolerance indications.
                Four accuracy classes: fine (f), medium (m), coarse (c), very coarse (v).
              </p>
            </div>
          </div>
        </section>

        {/* Accuracy class guide — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Accuracy Classes</h2>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
                <div className="font-black text-blue-700 text-lg">f</div>
                <div className="text-xs font-bold text-blue-600 uppercase">Fine</div>
                <div className="text-xs text-slate-500 mt-1">Precision instruments</div>
              </div>
              <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
                <div className="font-black text-green-700 text-lg">m</div>
                <div className="text-xs font-bold text-green-600 uppercase">Medium</div>
                <div className="text-xs text-slate-500 mt-1">General engineering (default)</div>
              </div>
              <div className="bg-orange-50 rounded-xl border border-orange-100 p-3 text-center">
                <div className="font-black text-orange-700 text-lg">c</div>
                <div className="text-xs font-bold text-orange-600 uppercase">Coarse</div>
                <div className="text-xs text-slate-500 mt-1">Structural / non-critical</div>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
                <div className="font-black text-red-700 text-lg">v</div>
                <div className="text-xs font-bold text-red-600 uppercase">Very Coarse</div>
                <div className="text-xs text-slate-500 mt-1">Castings / rough work</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <Iso2768ReferenceClient />
        </section>
      </main>
    </>
  );
}
