import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import ParametricCadApp from '@/components/cad-suite/parametric-cad-app';

export const metadata: Metadata = pageMetadata({
  title: 'Web 3D Parametric Mechanical CAD (Sketch Constraints, B-Rep & STEP Export) | CADGuide.tools',
  description:
    'Browser-local 3D parametric mechanical CAD modeler powered by Rust & WebAssembly. Solve 2D sketch constraints, build 3D feature trees (extrude, revolve, hole, fillet, shell), and export STEP AP214, STL, OBJ, and DXF.',
  path: '/toolbox/web-cad-parametric',
});

export default function WebCadParametricPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Web 3D Parametric Mechanical CAD', path: '/toolbox/web-cad-parametric' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-14 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 uppercase tracking-[0.15em]">
              Rust + WebAssembly B-Rep Solid Modeler
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              Web Interactive 3D Parametric Mechanical CAD
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              2D geometric constraint sketcher, ordered 3D feature tree (extrude, revolve, hole, fillet, chamfer, shell, boolean), analytical mass properties, and industrial ISO 10303-21 STEP AP214, Binary STL, OBJ, and 2D DXF export.
            </p>
          </div>
        </section>

        <section className="py-10 max-w-[1280px] mx-auto px-6 md:px-10 print:p-0">
          <ParametricCadApp />
          <ToolboxEngineeringGuide slug="web-cad-parametric" />
        </section>
      </main>
    </>
  );
}
