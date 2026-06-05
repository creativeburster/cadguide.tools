import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import CloudDwgDrawingRecoveryServiceClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Best Online Damaged DWG Drawing Recovery & Repair Services | CADGuide.tools',
  description: 'Compare the best online tools to recover corrupt DWG files. Learn how to bypass the invalid drawing error and salvage layers locally.',
  path: '/toolbox/cloud-dwg-drawing-recovery-service',
});

export default function CloudDwgDrawingRecoveryServicePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Online Damaged DWG Drawing Recovery & Repair Portal', path: '/toolbox/cloud-dwg-drawing-recovery-service' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Cloud Referral & Evaluation Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Online Damaged DWG Drawing Recovery & Repair Portal
            </h1>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              客观深度评测与防审计直达导航. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <CloudDwgDrawingRecoveryServiceClient />
        </section>
      </main>
    </>
);
}
