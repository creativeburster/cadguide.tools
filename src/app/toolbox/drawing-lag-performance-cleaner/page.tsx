import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Optimization Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Drawing Lag & <span className="text-blue-400">DWG Performance</span> Cleaner
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Solve CAD viewport zoom lag, DWG The file is too large and the image opening is extremely slow. Interactively select stuck features and automatically generate deep cleaning AutoLISP Silently optimize macros. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <DrawingLagCleanerClient />
        </section>
      </main>
    </>
);
}
