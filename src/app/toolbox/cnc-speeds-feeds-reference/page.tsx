import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import { ToolboxEngineeringGuide } from '@/components/toolbox-engineering-guide';
import type { Metadata } from 'next';
import CncSpeedsFeedsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CNC Speeds & Feeds Quick Reference Table | CADGuide.tools',
  description: 'Manufacturer-cited CNC cutting speeds (Vc) and chip loads (fz / f) for carbon steel, alloy steel, stainless steel, cast iron, aluminum, titanium, superalloys, and hardened steel.',
  path: '/toolbox/cnc-speeds-feeds-reference',
});

export default function CncSpeedsFeedsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'CNC Speeds & Feeds', path: '/toolbox/cnc-speeds-feeds-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — machining, red/orange accent */}
        <section className="bg-gradient-to-br from-slate-900 via-red-950/40 to-slate-900 text-white py-16 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-red-500/10 text-red-400 border border-red-500/20 mb-5 uppercase tracking-[0.15em]">
                CNC Machining Reference
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Speeds &amp; Feeds <span className="text-red-400">Quick Reference</span>
              </h1>
              <p className="text-xl md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                Published cutting speeds (Vc) and feed rates (fz / f) cited from Tungaloy milling and indexable drilling catalogs. Typical reference values — verify with your tooling manufacturer.
              </p>
            </div>
          </div>
        </section>

        {/* Formula card — unique to this page */}
        <section className="bg-white border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-lg font-black text-slate-400 uppercase tracking-wider mb-3">Core Formulas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <div className="text-base font-black text-slate-400 uppercase mb-2">Spindle Speed (n)</div>
                <div className="font-mono text-lg text-slate-800 font-bold">n = (Vc × 1000) / (π × D)</div>
                <div className="text-base text-slate-500 mt-1">Vc = cutting speed (m/min), D = tool Ø (mm)</div>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <div className="text-base font-black text-slate-400 uppercase mb-2">Feed Rate (Vf)</div>
                <div className="font-mono text-lg text-slate-800 font-bold">Vf = fz × z × n</div>
                <div className="text-base text-slate-500 mt-1">fz = chip load/tooth (mm/t), z = flutes</div>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <div className="text-base font-black text-slate-400 uppercase mb-2">MRR (Q)</div>
                <div className="font-mono text-lg text-slate-800 font-bold">Q = (ap × ae × Vf) / 1000</div>
                <div className="text-base text-slate-500 mt-1">ap = axial DOC (mm), ae = radial WOC (mm)</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <CncSpeedsFeedsClient />
          <ToolboxEngineeringGuide slug="cnc-speeds-feeds-reference" />
        </section>
      </main>
    </>
  );
}
