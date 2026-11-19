import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlineDwgToPdfCloudPrinterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD Sheet Plot DPI Calculator, Local DWG/DXF Preflight & -PLOT Builder | CADGuide.tools',
  description: 'Inspect local DWG/DXF headers (0 bytes uploaded), calculate CAD PDF plot pixel dimensions and uncompressed raster memory, and export pure-ASCII AutoCAD -PLOT and PDFSHX scripts.',
  path: '/toolbox/online-dwg-to-pdf-cloud-printer',
});

export default function OnlineDwgToPdfCloudPrinterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Plot DPI Calculator & Local DWG/DXF Preflight', path: '/toolbox/online-dwg-to-pdf-cloud-printer' },
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
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Local Plot Preflight &amp; Sizing
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              CAD Plot DPI Estimator, Local DWG/DXF Preflight &amp; -PLOT Builder
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Verify local DWG magic headers (`AC1015`-`AC1032`) or DXF metadata in-browser, size sheet raster DPI budgets, and export deterministic `-PLOT` (`DWG To PDF.pc3`) scripts.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlineDwgToPdfCloudPrinterClient />
          <ToolboxEngineeringGuide slug="online-dwg-to-pdf-cloud-printer" />
        </section>
      </main>
    </>
  );
}
