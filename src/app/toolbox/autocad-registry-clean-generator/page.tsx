import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import RegistryCleanClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'AutoCAD Clean Registry Reset Batch Script Generator',
  description:
    'Generate a safe Windows cmd batch script (.bat) to reset AutoCAD settings, clean orphaned registry paths, and flush local licensing cache files for clean reinstallation.',
  path: '/toolbox/autocad-registry-clean-generator',
});

export default function RegistryCleanPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Registry Clean Generator', path: '/toolbox/autocad-registry-clean-generator' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD IT Deployment Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              AutoCAD Clean <span className="text-blue-400">Registry Reset</span> Generator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Visually configure and generate secure Windows batches (.bat) Script. One-click backup and clean up residual AutoCAD Registry keys, activation cache and user temporary files. 
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12">
          <RegistryCleanClient />
        </section>
      </main>
    </>
);
}
