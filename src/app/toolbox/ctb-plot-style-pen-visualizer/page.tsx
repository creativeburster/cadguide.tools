import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import CtbPlotStyleClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CAD CTB Plot Style Color & Pen Thickness Visualizer',
  description:
    'Load and visualize AutoCAD color-dependent plot style (CTB) parameters. Customize ACI 255 printing line weights, screening, and colors with a live Canvas blueprint rendering simulator.',
  path: '/toolbox/ctb-plot-style-pen-visualizer',
});

export default function CtbPlotStylePage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'CTB Plot Style Visualizer', path: '/toolbox/ctb-plot-style-pen-visualizer' },
  ]);

  return (
    <>
      {/* Schema.org BreadcrumbList payload */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Free CAD Drafting Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              CAD CTB Plot Style <span className="text-blue-400">Color & Pen</span> Visualizer
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Configure and analyze line weights, screening, and linetype styles for all 255 AutoCAD Index Colors (ACI). Simulate final printed blueprints dynamically on your browser.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <CtbPlotStyleClient />
        </section>
      </main>
    </>
  );
}
