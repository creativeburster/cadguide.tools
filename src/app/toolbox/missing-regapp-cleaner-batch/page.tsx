import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import MissingRegappCleanerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD Massive Regapp Bloat LISP Cleaner Batch Generator | CADGuide.tools',
  description:
    'Online generation of batch cleaning CAD registration applications (Regapp) Bloated residual AutoLISP macro code and .scr Batch drawing control script. Helps shrink drawing size 80%, Completely solve the problem of viewport freezing and slow drawing opening. ',
  path: '/toolbox/missing-regapp-cleaner-batch',
});

export default function MissingRegappCleanerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Regapp Cleaner Batch Generator', path: '/toolbox/missing-regapp-cleaner-batch' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Performance Tuning Wizard
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Regapp <span className="text-blue-400">Drawing registration application slimming script generator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Solve the problem of inexplicable increase in the size of CAD drawings, Viewport panning stuck nemesis. Custom generated silent cleaning Regapp Rubbish AutoLISP plugin, And get a one-click fully automatic scanning and batch cleaning script for multiple images. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <MissingRegappCleanerClient />
        </section>
      </main>
    </>
);
}
