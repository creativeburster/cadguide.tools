import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import Online3dCadViewerCollaboratorClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Best Cloud 3D CAD/BIM Viewers & Collab Portals Review | CADGuide.tools',
  description: 'Benchmark top online WebGL CAD viewers. Compare rendering accuracy, redline markup tools, and secure project sharing.',
  path: '/toolbox/online-3d-cad-viewer-collaborator',
});

export default function Online3dCadViewerCollaboratorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal', path: '/toolbox/online-3d-cad-viewer-collaborator' },
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
              Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal
            </h1>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Direct navigation to objective in-depth evaluation and anti-audit. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <Online3dCadViewerCollaboratorClient />
        </section>
      </main>
    </>
);
}
