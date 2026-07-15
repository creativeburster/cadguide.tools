import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import DrawingLagCleanerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Drawing Lag & Slow DWG File Performance LISP Cleaner',
  description:
    'Diagnose viewport lag, giant DWG file size, and slow opening speeds in AutoCAD. Generate highly optimized custom AutoLISP code to purge regapps and reset scale list edit configurations.',
  path: '/toolbox/drawing-lag-performance-cleaner',
});

export default function DrawingLagCleanerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Drawing Lag Performance Cleaner', path: '/toolbox/drawing-lag-performance-cleaner' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Optimization Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Drawing Lag & <span className="text-blue-400">DWG Performance</span> Cleaner
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Solve CAD viewport zoom lag, DWG file size inflation, and extremely slow drawing load times. Interactively generate custom AutoLISP recovery scripts.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <DrawingLagCleanerClient />
        </section>

        {/* Related Expert Guides Section — dev-only; guides are noindex+302→404 in production */}
        {process.env.NODE_ENV === 'development' && (
        <section className="pb-24 pt-4 max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="border-t border-slate-200/80 pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-sm font-black uppercase tracking-widest text-emerald-600 block mb-1">Expert Reading</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance Tuning & Troubleshooting</h2>
                <p className="text-base text-slate-500 font-medium mt-1">Further reading on CAD hardware acceleration, silent installs, and LISP APIs.</p>
              </div>
              <Link href="/guides" className="text-base font-black text-emerald-600 hover:underline">
                Explore Guides Library (6,160+) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/guides/autocad-performance-0"
                className="group p-6 rounded-2xl bg-white border border-slate-150 hover:border-emerald-350 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-125 transition-transform"></div>
                <span className="text-[9px] font-mono font-black text-emerald-600 uppercase tracking-wider block mb-1">Graphics Optimization</span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">GPU Hardware Acceleration Settings →</h3>
                <p className="text-base text-slate-500 mt-2 font-medium">Configure graphics cards, thread allocations, and cache sizes to eliminate cross-hair stuttering.</p>
              </Link>

              <Link 
                href="/guides/standards-bricscad-0"
                className="group p-6 rounded-2xl bg-white border border-slate-150 hover:border-emerald-350 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl -mr-6 -mt-6 group-hover:scale-125 transition-transform"></div>
                <span className="text-[9px] font-mono font-black text-emerald-600 uppercase tracking-wider block mb-1">Automation APIs</span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">LISP & PGP Shortcut Migration Matrix →</h3>
                <p className="text-base text-slate-500 mt-2 font-medium">Troubleshoot custom command overrides, recover pgp aliases, and deploy cross-CAD scripts.</p>
              </Link>
            </div>
          </div>
        </section>
        )}
      </main>
    </>
  );
}
