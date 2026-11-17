import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import DxfParserClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'DXF $ACADVER & ASCII Layer Table Parser',
  description:
    'Inspect ASCII DXF drawing files locally in your browser. Extract $ACADVER format headers and LAYER table attributes (ACI color, linetype, frozen, locked, plottable flags).',
  path: '/toolbox/dxf-watermark-layer-parser',
});

export default function DxfParserPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'DXF Header & Layer Parser', path: '/toolbox/dxf-watermark-layer-parser' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              100% Local File Analyzer
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              ASCII DXF <span className="text-blue-400">Header &amp; Layer</span> Parser
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Analyze ASCII DXF drawings locally in your browser. Inspect $ACADVER release headers and active LAYER table records without uploading files.
            </p>
          </div>
        </section>

        {/* Main Content Component */}
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <DxfParserClient />
          <ToolboxEngineeringGuide slug="dxf-watermark-layer-parser" />
        </section>
      </main>
    </>
  );
}
