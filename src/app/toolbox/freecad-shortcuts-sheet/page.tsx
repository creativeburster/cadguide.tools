import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import FreeCADClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'FreeCAD Open-Source CAD Hotkeys & Mouse Navigation | CADGuide.tools',
  description: 'Searchable database of FreeCAD shortcut keys for PartDesign and Draft workbenches. Print optimized cheatsheet.',
  path: '/toolbox/freecad-shortcuts-sheet',
});

export default function FreeCADPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'FreeCAD Shortcuts', path: '/toolbox/freecad-shortcuts-sheet' },
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
              Keyboard Shortcuts Cheatsheet
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              FreeCAD <span className="text-blue-400">键盘快捷键与命令</span> 速查表
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              开源三维建模极客速查。收录 FreeCAD 零部件、草图约束与视图导航键盘热键，完美适配 A4 纸张打印。
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <FreeCADClient />
        </section>
      </main>
    </>
  );
}
