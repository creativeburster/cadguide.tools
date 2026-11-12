import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CloudDxfToGcodeLaserConverterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Client-Side ASCII DXF to 2D Laser G-Code Generator | CADGuide.tools',
  description:
    'Parse 2D ASCII DXF entities (LINE, CIRCLE, ARC, LWPOLYLINE) locally in your browser into pure-ASCII G0/G1/G2/G3/M3/M5 G-code with LinuxCNC and GRBL command references.',
  path: '/toolbox/cloud-dxf-to-gcode-laser-converter',
});

export default function CloudDxfToGcodeLaserConverterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    {
      name: 'Client-Side ASCII DXF to 2D Laser G-Code Generator',
      path: '/toolbox/cloud-dxf-to-gcode-laser-converter',
    },
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
              100% Browser-Local ASCII Compiler
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Client-Side ASCII DXF to 2D Laser G-Code Generator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Convert 2D ASCII DXF contours (LINE, CIRCLE, ARC, LWPOLYLINE) into pure-ASCII G-code locally without
              server uploads. Review in CAM and run an air-cut dry run before machining.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <CloudDxfToGcodeLaserConverterClient />
          <ToolboxEngineeringGuide slug="cloud-dxf-to-gcode-laser-converter" />
        </section>
      </main>
    </>
  );
}
