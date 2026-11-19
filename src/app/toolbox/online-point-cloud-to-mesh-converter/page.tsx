import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlinePointCloudToMeshConverterClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Local Point Cloud Preflight (LAS/PLY/XYZ) & Binary STL Mesh Budget Calculator | CADGuide.tools',
  description: 'Inspect local LAS, PLY, XYZ, and PTS point counts and bounding spans in-browser (0 bytes uploaded), estimate voxel surface triangles, and predict Binary STL size (84 + 50*N bytes).',
  path: '/toolbox/online-point-cloud-to-mesh-converter',
});

export default function OnlinePointCloudToMeshConverterPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Local Point Cloud Preflight & STL Mesh Budget Calculator', path: '/toolbox/online-point-cloud-to-mesh-converter' },
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
              Local Point Cloud Preflight &amp; Meshing
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Point Cloud Preflight (LAS/PLY/XYZ) &amp; Binary STL Mesh Budget Calculator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Read local LAS, PLY, or XYZ point counts and bounding boxes in-browser, size target voxel spacing, and estimate Binary STL footprint (`84 + 50 * N` bytes).
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlinePointCloudToMeshConverterClient />
          <ToolboxEngineeringGuide slug="online-point-cloud-to-mesh-converter" />
        </section>
      </main>
    </>
  );
}
