import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import CadScaleListResetClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Plotting Scale List Reset LISP Automation Helper | CADGuide.tools',
  description:
    'Online writing resets CAD drawing custom scale aliases are bloated (Scale List) The AutoLISP macro script. Clear the invalid viewport reference proportion dictionary to solve the problem of saving drawings., Unable to write external blocks and open the map to cause death problem. ',
  path: '/toolbox/cad-scale-list-reset-helper',
});

export default function CadScaleListResetPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'CAD Scale List Reset Helper', path: '/toolbox/cad-scale-list-reset-helper' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Performance & Annotation Optimizer
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              CAD <span className="text-blue-400">Viewport scale reset and cleaner</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Resolve copy lag caused by thousands of garbage scales imported from external reference (Xref) loop nesting. One-click generation of LISP cleaners that reset defaults and rebuild common standard scales on demand. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <CadScaleListResetClient />
        </section>
      </main>
    </>
);
}
