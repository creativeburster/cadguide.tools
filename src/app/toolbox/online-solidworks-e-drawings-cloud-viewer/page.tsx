import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlineSolidworksEDrawingsCloudViewerClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '3D Assembly CFBF Container Inspector & Tessellation Size Calculator | CADGuide.tools',
  description: 'Check local .sldprt/.sldasm Compound File Binary Format bytes in your browser and size assembly defeaturing triangle counts and Binary STL export footprints.',
  path: '/toolbox/online-solidworks-e-drawings-cloud-viewer',
});

export default function OnlineSolidworksEDrawingsCloudViewerPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Assembly CFBF Inspector & Tessellation Calculator', path: '/toolbox/online-solidworks-e-drawings-cloud-viewer' },
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
              Assembly Export Sizing
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              3D Assembly CFBF Container Inspector &amp; Tessellation Size Calculator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Check CFBF signatures locally and compute lightweight assembly triangle counts and STL sizes.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlineSolidworksEDrawingsCloudViewerClient />
          <ToolboxEngineeringGuide slug="online-solidworks-e-drawings-cloud-viewer" />
        </section>
      </main>
    </>
  );
}
