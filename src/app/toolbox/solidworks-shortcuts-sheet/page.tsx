import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import SolidWorksShortcutsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'SolidWorks Essential Keyboard Shortcuts & Mouse Gestures List',
  description:
    'A comprehensive, searchable index of SolidWorks keyboard shortcuts, mouse gestures, and S-key shortcuts. Highly optimized for desktop cheatsheet printing (A4 Landscape).',
  path: '/toolbox/solidworks-shortcuts-sheet',
});

export default function SolidWorksShortcutsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'SolidWorks Shortcuts', path: '/toolbox/solidworks-shortcuts-sheet' },
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
              3D CAD Productivity Booster
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              SolidWorks <span className="text-blue-400">Shortcuts & Mouse Gestures</span> List
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Professional 3D modeling efficiency tool. Keyboard hotkey search, Interactive 8-way mouse gesture roulette display, Support Ctrl+P quick printing A4 Paper cheat sheet. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <SolidWorksShortcutsClient />
        </section>
      </main>
    </>
);
}
