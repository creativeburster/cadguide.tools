import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CloudDwgDrawingRecoveryServiceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Corrupt DWG Local Recovery Guide & Header Version Inspector | CADGuide.tools',
  description:
    'Inspect DWG AC10xx file-header version bytes locally and generate pure-ASCII AutoCAD recovery & audit scripts (RECOVER, RECOVERALL, AUDIT, DRAWINGRECOVERY, -PURGE, -WBLOCK).',
  path: '/toolbox/cloud-dwg-drawing-recovery-service',
});

export default function CloudDwgDrawingRecoveryServicePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Corrupt DWG Local Recovery Guide & Header Inspector', path: '/toolbox/cloud-dwg-drawing-recovery-service' },
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
              Offline DWG Triage & Recovery Guide
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Corrupt DWG Local Recovery Guide & Header Inspector
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              Browser JavaScript cannot repair damaged binary DWG geometry. Check your file&apos;s 6-byte AC10xx version
              signature locally and follow official Autodesk offline recovery commands without uploading confidential
              drawings.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1100px] mx-auto px-6 md:px-12 print:p-0">
          <CloudDwgDrawingRecoveryServiceClient />
          <ToolboxEngineeringGuide slug="cloud-dwg-drawing-recovery-service" />
        </section>
      </main>
    </>
  );
}
