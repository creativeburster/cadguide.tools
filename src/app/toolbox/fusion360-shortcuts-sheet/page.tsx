import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AutodeskFusion360Client from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Autodesk Fusion 360 Keyboard Hotkeys Reference | CADGuide.tools',
  description: 'Complete reference table for Fusion 360 sculpting, assembly, and CAM path planning keyboard shortcut keys.',
  path: '/toolbox/fusion360-shortcuts-sheet',
});

export default function AutodeskFusion360Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Autodesk Fusion 360 Shortcuts', path: '/toolbox/fusion360-shortcuts-sheet' },
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
              Keyboard Shortcuts Cheatsheet
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Autodesk Fusion 360 <span className="text-blue-400">Keyboard Shortcuts and Commands</span> Cheat Sheet
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Cloud collaborative design of lightweight 3D solutions. Provided Fusion 360 Sculpted surfaces, 3D extrusions &amp; CAM Manufacturing tool path shortcut code, A4 printing optimization. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AutodeskFusion360Client />
        </section>
      </main>
    </>
);
}
