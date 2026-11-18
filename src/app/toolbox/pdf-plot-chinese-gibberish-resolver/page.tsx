import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import PdfFontGibberishClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD PDF Plotting Chinese Font & Gibberish Resolver | CADGuide.tools',
  description:
    'Diagnose and fix CAD PDF plotting issues where Asian or SHX Big Font characters print as question marks (?), scrambled text, or hollow outlines using FONTALT, PDFSHX, and TEXTFILL.',
  path: '/toolbox/pdf-plot-chinese-gibberish-resolver',
});

export default function PdfFontGibberishPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'PDF Plot Font & Gibberish Resolver', path: '/toolbox/pdf-plot-chinese-gibberish-resolver' },
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
              Plotting &amp; Font Troubleshooter
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              PDF Plotting <span className="text-blue-400">Chinese Font Gibberish</span> Resolver
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Diagnose question-mark glyphs, PDF SHX comment conflicts, and hollow outline text, then export pure-ASCII AutoLISP and command scripts (`FONTALT`, `PDFSHX`, `TEXTFILL`).
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <PdfFontGibberishClient />
          <ToolboxEngineeringGuide slug="pdf-plot-chinese-gibberish-resolver" />
        </section>
      </main>
    </>
  );
}
