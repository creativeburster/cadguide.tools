import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlineGcodeViewerSimulatorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Online 3D G-Code Viewer & CNC / 3D Print Toolpath Simulator | CADGuide.tools',
  description:
    'Interactive client-side 3D G-code toolpath simulator for CNC milling, laser cutting, and FDM 3D printing. Scrub motion segments, inspect G0/G1/G2/G3 moves, and verify cycle time.',
  path: '/toolbox/online-gcode-viewer-simulator',
});

export default function OnlineGcodeViewerSimulatorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '3D G-Code Viewer & CNC Toolpath Simulator', path: '/toolbox/online-gcode-viewer-simulator' },
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
              Open-Source Client-Side CNC & Additive Backplotter
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Interactive 3D G-Code Toolpath Viewer & Simulator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Simulate G0 rapid traverses, G1 linear cuts, and G2/G3 helical arcs in 3D isometric or 2D XY projection locally in your browser.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlineGcodeViewerSimulatorClient />
          <ToolboxEngineeringGuide slug="online-gcode-viewer-simulator" />
        </section>
      </main>
    </>
  );
}
