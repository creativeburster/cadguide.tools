import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import TurningSpeedsClient from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: 'CNC Turning Speeds & Feeds Calculator (Lathe)',
  description: 'Calculate spindle RPM, feed rate, cutting time, and MRR for CNC turning operations. Supports material-specific cutting speeds and feed per revolution.',
  path: '/toolbox/turning-speeds-feeds-calculator',
});

export default function TurningSpeedsPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: 'Turning Speeds & Feeds Calculator', path: '/toolbox/turning-speeds-feeds-calculator' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6 uppercase tracking-[0.15em]">
              CNC Lathe Operations
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              Turning Speeds <span className="text-amber-400">& Feeds</span> Calculator
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Calculate spindle RPM, feed rate (mm/min), cutting time, and material removal rate for CNC turning. Material-specific cutting speeds with HSS and carbide tool data.
            </p>
          </div>
        </section>
        <section className="py-16 max-w-[1200px] mx-auto px-6 md:px-12">
          <TurningSpeedsClient />
        </section>
      </main>
    </>
  );
}
