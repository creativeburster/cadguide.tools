import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import OnlineDwgLayerSplitterCloudClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'DXF Layer Entity Counter & AutoCAD -WBLOCK Split Script Builder | CADGuide.tools',
  description: 'Analyze per-layer entity counts from local ASCII DXF files and generate pure-ASCII AutoCAD -LAYER and -WBLOCK separation scripts with zero uploads.',
  path: '/toolbox/online-dwg-layer-splitter-cloud',
});

export default function OnlineDwgLayerSplitterCloudPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'DXF Layer Entity Counter & WBLOCK Script Builder', path: '/toolbox/online-dwg-layer-splitter-cloud' },
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
              Layer Automation Prep
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              DXF Layer Entity Counter &amp; AutoCAD -WBLOCK Split Script Builder
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Count DXF entities per layer locally and build deterministic `-LAYER` / `-WBLOCK` extraction scripts.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <OnlineDwgLayerSplitterCloudClient />
          <ToolboxEngineeringGuide slug="online-dwg-layer-splitter-cloud" />
        </section>
      </main>
    </>
  );
}
