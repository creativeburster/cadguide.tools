import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import DwgVersionCheckerClient from './checker-client';

export const metadata: Metadata = pageMetadata({
  title: 'DWG Version Checker & Compatibility Matrix',
  description:
    'Identify your CAD DWG file version instantly. Upload or drag-and-drop a .dwg drawing to detect its AutoCAD format (e.g. AC1032, AC1027) and test software support tables.',
  path: '/toolbox/dwg-version-checker',
});

export default function DwgVersionCheckerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'DWG Version Checker', path: '/toolbox/dwg-version-checker' },
  ]);

  return (
    <>
      {/* Schema.org BreadcrumbList payload */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free Utility
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD <span className="text-blue-400">DWG Version</span> Checker
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Struggling to open a drawing file? Drag and drop your `.dwg` file here to instantly identify its internal release version and check software compatibility without uploading.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1000px] mx-auto px-6 md:px-12">
          <DwgVersionCheckerClient />
        </section>
      </main>
    </>
  );
}
