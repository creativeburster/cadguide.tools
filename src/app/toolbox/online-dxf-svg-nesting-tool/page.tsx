import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlineDxfSvgNestingClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Online 2D DXF & SVG Sheet Metal Automatic Nesting Tool | CADGuide.tools',
  description:
    'Free browser-based 2D DXF and SVG automatic sheet metal & laser nesting optimizer. Configure sheet dimensions, kerf spacing, part quantities, and export nested DXF/SVG cut layouts.',
  path: '/toolbox/online-dxf-svg-nesting-tool',
});

export default function OnlineDxfSvgNestingToolPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '2D DXF & SVG Sheet Metal Automatic Nesting Tool', path: '/toolbox/online-dxf-svg-nesting-tool' },
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
              Open-Source Client-Side CAM & Nesting Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              2D DXF & SVG Sheet Metal Automatic Nesting Optimizer
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Pack rectangular and DXF bounding profiles onto standard laser, plasma, waterjet, or CNC router sheets locally in your browser.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlineDxfSvgNestingClient />
          <ToolboxEngineeringGuide slug="online-dxf-svg-nesting-tool" />
        </section>
      </main>
    </>
  );
}
