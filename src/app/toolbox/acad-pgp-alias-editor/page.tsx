import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import AcadPgpEditorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD PGP Command Alias Editor & Compiler Online | CADGuide.tools',
  description:
    'Online editing, modification and compilation AutoCAD acad.pgp Or Haochen/Zhongwang CAD Alias file. Provides local resolution, Repeat shortcut key conflict verification and one-click package download. All data is run safely locally in the browser, Not uploading to server. ',
  path: '/toolbox/acad-pgp-alias-editor',
});

export default function AcadPgpEditorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'ACAD PGP Alias Editor', path: '/toolbox/acad-pgp-alias-editor' },
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
              CAD Configuration & Deployment Helper
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD <span className="text-blue-400">PGP Shortcut Key Alias Editor</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Upload and parse local acad.pgp / gcad.pgp configuration files online. Real-time conflict red text warning, easy addition, deletion and modification, And compile and download pure PGP text with one click. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <AcadPgpEditorClient />
        </section>
      </main>
    </>
);
}
