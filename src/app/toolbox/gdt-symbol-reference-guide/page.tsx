import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import GDTSymbolClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'GD&T Symbol Reference Guide (ASME Y14.5)',
  description:
    'Interactive reference for ASME Y14.5 Geometric Dimensioning & Tolerancing symbols. Form, profile, orientation, location, and runout controls.',
  path: '/toolbox/gdt-symbol-reference-guide',
});

export default function GDTSymbolPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'GD&T Symbol Reference', path: '/toolbox/gdt-symbol-reference-guide' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              ASME Y14.5 Reference
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              GD&T <span className="text-blue-400">Symbol Reference</span> Guide
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Browse all ASME Y14.5 Geometric Dimensioning & Tolerancing symbols by category. Form, profile, orientation, location, and runout with tolerance zone descriptions.
            </p>
          </div>
        </section>
        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <GDTSymbolClient />
        </section>
      </main>
    </>
  );
}
