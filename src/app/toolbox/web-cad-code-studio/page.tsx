import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CodeCadApp from '@/components/cad-suite/code-cad-app';

export const metadata: Metadata = pageMetadata({
  title: 'Web Procedural Code-CAD & Algorithmic Parametric Modeling Studio | CADGuide.tools',
  description:
    'Write declarative Code-CAD scripts with @param annotations to auto-generate interactive UI sliders, compile B-Rep 3D solids in milliseconds via Rust/WASM, and export STEP AP214, Binary STL, OBJ, and DXF.',
  path: '/toolbox/web-cad-code-studio',
});

export default function WebCadCodeStudioPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    {
      name: 'Web Procedural Code-CAD Studio',
      path: '/toolbox/web-cad-code-studio',
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-14 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 uppercase tracking-[0.15em]">
              Rust + WebAssembly Procedural B-Rep Compiler
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              Web Procedural Code-CAD &amp; Algorithmic Modeling Studio
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              Define parametric part families (gears, bolted flanges, heatsinks, enclosures) in code, auto-extract interactive @param sliders with bidirectional sync, and export industrial STEP AP214, Binary STL, OBJ, and DXF.
            </p>
          </div>
        </section>

        <section className="py-10 max-w-[1280px] mx-auto px-6 md:px-10 print:p-0">
          <CodeCadApp />
          <ToolboxEngineeringGuide slug="web-cad-code-studio" />
        </section>
      </div>
    </>
  );
}
