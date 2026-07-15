import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import TruePositionClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'True Position (GD&T) Calculator with Bonus Tolerance',
  description: 'Calculate true position deviation and bonus tolerance for ASME Y14.5 position tolerances. Supports MMC and LMC material condition modifiers.',
  path: '/toolbox/true-position-calculator',
});

export default function TruePositionPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'True Position Calculator', path: '/toolbox/true-position-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 uppercase tracking-[0.15em]">
              ASME Y14.5 Position Tolerance
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              True Position <span className="text-indigo-400">Calculator</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate true position deviation from measured X/Y offsets. Includes bonus tolerance for MMC and LMC material condition modifiers per ASME Y14.5.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <TruePositionClient />
        </section>
      </main>
    </>
  );
}
