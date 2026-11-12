import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CloudBimRvtToIfcConverterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Revit RVT to openBIM IFC Export Guide & Local IFC Schema Inspector | CADGuide.tools',
  description:
    'Export Revit RVT models to ISO 16739-1 (IFC4 / IFC2x3) using official Autodesk Revit IFC workflows and audit exported IFC STEP text files locally in your browser.',
  path: '/toolbox/cloud-bim-rvt-to-ifc-converter',
});

export default function CloudBimRvtToIfcConverterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Revit RVT to openBIM IFC Export Guide & Local IFC Inspector', path: '/toolbox/cloud-bim-rvt-to-ifc-converter' },
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
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              openBIM Export Guide & Local IFC Audit
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Revit RVT to openBIM IFC Export Guide & Local IFC Inspector
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              Proprietary binary RVT files cannot be converted to IFC inside a browser. Follow official Autodesk Revit
              IFC export steps and inspect exported IFC2x3 / IFC4 entity counts locally with zero cloud upload.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1100px] mx-auto px-6 md:px-12 print:p-0">
          <CloudBimRvtToIfcConverterClient />
          <ToolboxEngineeringGuide slug="cloud-bim-rvt-to-ifc-converter" />
        </section>
      </main>
    </>
  );
}
