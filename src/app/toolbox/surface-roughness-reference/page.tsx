import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import SurfaceRoughnessClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'Surface Roughness (Ra/Rz) Symbols & Values Reference | CADGuide.tools',
  description: 'ISO 1302 surface texture symbols, Ra/Rz values, manufacturing process capabilities, and typical applications reference table.',
  path: '/toolbox/surface-roughness-reference',
});

export default function SurfaceRoughnessPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Surface Roughness Reference', path: '/toolbox/surface-roughness-reference' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        {/* Hero — light, technical theme */}
        <section className="bg-white border-b-2 border-slate-200 py-14 print:hidden">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 mb-4 uppercase tracking-[0.15em]">
              ISO 1302 · ISO 4287
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-slate-900">
              Surface Roughness <span className="text-slate-400">Symbols & Values</span>
            </h1>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              ISO 1302 surface texture symbols, Ra/Rz standard values, manufacturing process capabilities,
              and typical applications — all in one searchable reference.
            </p>
          </div>
        </section>

        {/* Ra scale visual — unique to this page */}
        <section className="bg-slate-50 border-b border-slate-100 py-6 print:hidden">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Ra Value Scale (μm)</h2>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {[
                { val: '0.012', label: 'Super fine', color: 'bg-blue-100 text-blue-700' },
                { val: '0.025', label: 'Lapping', color: 'bg-blue-100 text-blue-700' },
                { val: '0.05', label: 'Polishing', color: 'bg-cyan-100 text-cyan-700' },
                { val: '0.1', label: 'Fine grind', color: 'bg-cyan-100 text-cyan-700' },
                { val: '0.2', label: 'Fine', color: 'bg-green-100 text-green-700' },
                { val: '0.4', label: 'Grinding', color: 'bg-green-100 text-green-700' },
                { val: '0.8', label: 'Standard', color: 'bg-yellow-100 text-yellow-700' },
                { val: '1.6', label: 'Milling', color: 'bg-yellow-100 text-yellow-700' },
                { val: '3.2', label: 'Rough', color: 'bg-orange-100 text-orange-700' },
                { val: '6.3', label: 'Turning', color: 'bg-orange-100 text-orange-700' },
                { val: '12.5', label: 'Roughing', color: 'bg-red-100 text-red-700' },
                { val: '25', label: 'Flame cut', color: 'bg-red-100 text-red-700' },
              ].map((r) => (
                <div key={r.val} className={`flex-shrink-0 rounded-xl px-3 py-2 text-center ${r.color} min-w-[80px]`}>
                  <div className="font-mono font-black text-sm">{r.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <SurfaceRoughnessClient />
        </section>
      </main>
    </>
  );
}
