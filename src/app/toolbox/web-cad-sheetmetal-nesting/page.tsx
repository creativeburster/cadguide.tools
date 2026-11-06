import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import NestingCamApp from '@/components/cad-suite/nesting-cam-app';

export const metadata: Metadata = pageMetadata({
  title: 'Web 2D Sheet Metal Unfolding, True-Shape NFP Nesting & Laser G-Code CAM | CADGuide.tools',
  description:
    'Browser-local 2D sheet metal DIN 6935 unfolding (K-Factor, BA, BD), true-shape NFP & hole-in-hole nesting optimizer, and laser/plasma CNC G-code generator with live backplotter.',
  path: '/toolbox/web-cad-sheetmetal-nesting',
});

export default function WebCadSheetMetalNestingPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    {
      name: 'Web 2D Sheet Metal Unfolding & Laser Nesting CAM',
      path: '/toolbox/web-cad-sheetmetal-nesting',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-14 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 uppercase tracking-[0.15em]">
              Rust + WebAssembly Sheet Metal &amp; CAM Studio
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              Web 2D Sheet Metal Unfolding, True-Shape Nesting &amp; Laser CAM
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              Compute DIN 6935 bend allowance &amp; bend deduction, pack irregular polygons with hole-in-hole nesting at 80%+ sheet utilization, and generate ISO 6983 Fanuc/Grbl laser G-code with lead-in/lead-out and toolpath simulation.
            </p>
          </div>
        </section>

        <section className="py-10 max-w-[1280px] mx-auto px-6 md:px-10 print:p-0">
          <NestingCamApp />
          <ToolboxEngineeringGuide slug="web-cad-sheetmetal-nesting" />
        </section>
      </div>
    </>
  );
}
