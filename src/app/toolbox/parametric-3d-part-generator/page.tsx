import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import Parametric3dPartGeneratorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Online Parametric 3D Mechanical Part Generator (Gear, Flange, Bracket) | CADGuide.tools',
  description:
    'Interactive browser-based parametric 3D CAD generator for involute spur gears, ASME/DIN bolted pipe flanges, and sheet metal brackets. Export STEP AP214, Binary STL, OBJ, and 2D DXF.',
  path: '/toolbox/parametric-3d-part-generator',
});

export default function Parametric3dPartGeneratorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Parametric 3D Mechanical Part Generator', path: '/toolbox/parametric-3d-part-generator' },
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
              Open-Source Parametric B-Rep & Mesh Modeler
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Interactive 3D Parametric Mechanical Part Generator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Configure involute spur gears, bolted pipe flanges, and structural brackets in real time and export STEP AP214, watertight Binary STL, Wavefront OBJ, or 2D laser DXF.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <Parametric3dPartGeneratorClient />
          <ToolboxEngineeringGuide slug="parametric-3d-part-generator" />
        </section>
      </main>
    </>
  );
}
